"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TestCase_1 = require("../models/TestCase");
const TestRun_1 = require("../models/TestRun");
const auth_1 = require("../middleware/auth");
const runner_1 = require("../services/runner");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// Helper to find file recursively in a directory
const findFileRecursively = (dir, fileName) => {
    if (!fs_1.default.existsSync(dir))
        return null;
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        const fullPath = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(fullPath);
        if (stat.isDirectory()) {
            const found = findFileRecursively(fullPath, fileName);
            if (found)
                return found;
        }
        else if (file.toLowerCase() === fileName.toLowerCase()) {
            return fullPath;
        }
    }
    return null;
};
// @route   POST /api/tests/:id/run
// @desc    Execute a test case (synchronous)
// @access  Private
router.post('/tests/:id/run', auth_1.auth, async (req, res) => {
    const { id } = req.params;
    const { device, browser } = req.body;
    const authReq = req;
    try {
        const testCase = await TestCase_1.TestCase.findOne({ _id: id, owner: authReq.user.id });
        if (!testCase) {
            return res.status(404).json({ message: 'Test case not found' });
        }
        // Determine configuration (override defaults if body parameters are provided)
        const runDevice = device !== undefined ? device : testCase.defaultEmulation?.device;
        const runBrowser = browser !== undefined ? browser : (testCase.defaultEmulation?.browser || 'chromium');
        // Create a new TestRun document ID beforehand
        const runId = new mongoose_1.default.Types.ObjectId().toString();
        const startedAt = new Date();
        // Run the Playwright test
        const runResult = await (0, runner_1.runPlaywrightTest)(runId, testCase.specCode, runBrowser, runDevice);
        const finishedAt = new Date();
        // Create and save the TestRun document
        const testRun = new TestRun_1.TestRun({
            _id: runId,
            testCase: testCase._id,
            owner: authReq.user.id,
            status: runResult.status,
            emulation: {
                device: runDevice,
                browser: runBrowser
            },
            durationMs: runResult.durationMs,
            startedAt,
            finishedAt,
            stdout: runResult.stdout,
            stderr: runResult.stderr,
            errorMessage: runResult.errorMessage,
            report: runResult.report,
            artifacts: runResult.artifacts
        });
        await testRun.save();
        res.json(testRun);
    }
    catch (err) {
        console.error('Error running test:', err);
        res.status(500).json({ message: 'Server error during test execution', error: err.message });
    }
});
// @route   GET /api/tests/:id/runs
// @desc    Get execution history for a test case
// @access  Private
router.get('/tests/:id/runs', auth_1.auth, async (req, res) => {
    const { id } = req.params;
    const authReq = req;
    try {
        const runs = await TestRun_1.TestRun.find({ testCase: id, owner: authReq.user.id }).sort({ createdAt: -1 });
        res.json(runs);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// @route   GET /api/runs/:runId
// @desc    Get details of a specific test run
// @access  Private
router.get('/runs/:runId', auth_1.auth, async (req, res) => {
    const { runId } = req.params;
    const authReq = req;
    try {
        const run = await TestRun_1.TestRun.findOne({ _id: runId, owner: authReq.user.id });
        if (!run) {
            return res.status(404).json({ message: 'Test run not found' });
        }
        res.json(run);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// @route   GET /api/runs/:runId/artifacts/:fileName
// @desc    Serve artifact file (screenshot, video, or trace)
// @access  Private
router.get('/runs/:runId/artifacts/:fileName', auth_1.auth, async (req, res) => {
    const { runId, fileName } = req.params;
    const authReq = req;
    try {
        // Verify run belongs to user
        const run = await TestRun_1.TestRun.findOne({ _id: runId, owner: authReq.user.id });
        if (!run) {
            return res.status(404).json({ message: 'Test run not found or unauthorized' });
        }
        const apisRoot = path_1.default.join(__dirname, '../../');
        const runDir = path_1.default.join(apisRoot, 'runs', runId);
        // Try direct filename resolve first
        let filePath = path_1.default.resolve(runDir, fileName);
        if (!filePath.startsWith(runDir)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!fs_1.default.existsSync(filePath) || fs_1.default.statSync(filePath).isDirectory()) {
            // Find recursively if it was deep inside report
            const found = findFileRecursively(runDir, fileName);
            if (found) {
                filePath = found;
            }
            else {
                return res.status(404).json({ message: 'Artifact file not found' });
            }
        }
        res.sendFile(filePath);
    }
    catch (err) {
        console.error('Error serving artifact:', err);
        res.status(500).send('Server error');
    }
});
// @route   GET /api/runs/:runId/artifacts-wildcard/*
// @desc    Serve artifact file with deep subpaths
// @access  Private
router.get('/runs/:runId/artifacts-wildcard/*', auth_1.auth, async (req, res) => {
    const { runId } = req.params;
    const subPath = req.params[0];
    const authReq = req;
    try {
        // Verify run belongs to user
        const run = await TestRun_1.TestRun.findOne({ _id: runId, owner: authReq.user.id });
        if (!run) {
            return res.status(404).json({ message: 'Test run not found or unauthorized' });
        }
        const apisRoot = path_1.default.join(__dirname, '../../');
        const runDir = path_1.default.join(apisRoot, 'runs', runId);
        const filePath = path_1.default.resolve(runDir, subPath);
        if (!filePath.startsWith(runDir)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!fs_1.default.existsSync(filePath) || fs_1.default.statSync(filePath).isDirectory()) {
            return res.status(404).json({ message: 'Artifact file not found' });
        }
        res.sendFile(filePath);
    }
    catch (err) {
        console.error('Error serving wildcard artifact:', err);
        res.status(500).send('Server error');
    }
});
exports.default = router;
