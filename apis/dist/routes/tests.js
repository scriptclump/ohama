"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TestCase_1 = require("../models/TestCase");
const TestRun_1 = require("../models/TestRun");
const auth_1 = require("../middleware/auth");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// @route   POST /api/tests
// @desc    Create a test case
// @access  Private
router.post('/', auth_1.auth, async (req, res) => {
    const { name, description, specCode, targetUrl, defaultEmulation, source } = req.body;
    const authReq = req;
    try {
        if (!name || !specCode) {
            return res.status(400).json({ message: 'Name and specCode are required' });
        }
        const testCase = new TestCase_1.TestCase({
            owner: authReq.user.id,
            name,
            description,
            specCode,
            targetUrl,
            defaultEmulation,
            source: source || 'manual'
        });
        await testCase.save();
        res.status(201).json(testCase);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// @route   GET /api/tests
// @desc    Get all test cases of user
// @access  Private
router.get('/', auth_1.auth, async (req, res) => {
    const authReq = req;
    try {
        const tests = await TestCase_1.TestCase.find({ owner: authReq.user.id }).sort({ updatedAt: -1 });
        res.json(tests);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// @route   GET /api/tests/:id
// @desc    Get a specific test case by ID
// @access  Private
router.get('/:id', auth_1.auth, async (req, res) => {
    const authReq = req;
    try {
        const test = await TestCase_1.TestCase.findOne({ _id: req.params.id, owner: authReq.user.id });
        if (!test) {
            return res.status(404).json({ message: 'Test case not found' });
        }
        res.json(test);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// @route   PUT /api/tests/:id
// @desc    Update a test case
// @access  Private
router.put('/:id', auth_1.auth, async (req, res) => {
    const { name, description, specCode, targetUrl, defaultEmulation, source } = req.body;
    const authReq = req;
    try {
        let test = await TestCase_1.TestCase.findOne({ _id: req.params.id, owner: authReq.user.id });
        if (!test) {
            return res.status(404).json({ message: 'Test case not found' });
        }
        if (name !== undefined)
            test.name = name;
        if (description !== undefined)
            test.description = description;
        if (specCode !== undefined)
            test.specCode = specCode;
        if (targetUrl !== undefined)
            test.targetUrl = targetUrl;
        if (defaultEmulation !== undefined)
            test.defaultEmulation = defaultEmulation;
        if (source !== undefined)
            test.source = source;
        await test.save();
        res.json(test);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// @route   DELETE /api/tests/:id
// @desc    Delete a test case and its runs + artifact folders
// @access  Private
router.delete('/:id', auth_1.auth, async (req, res) => {
    const authReq = req;
    try {
        const test = await TestCase_1.TestCase.findOne({ _id: req.params.id, owner: authReq.user.id });
        if (!test) {
            return res.status(404).json({ message: 'Test case not found' });
        }
        // Find and delete all related runs and their directory artifacts
        const runs = await TestRun_1.TestRun.find({ testCase: test._id });
        for (const run of runs) {
            const runDir = path_1.default.join(__dirname, '../../runs', run._id.toString());
            if (fs_1.default.existsSync(runDir)) {
                fs_1.default.rmSync(runDir, { recursive: true, force: true });
            }
            await run.deleteOne();
        }
        await test.deleteOne();
        res.json({ message: 'Test case and all associated runs and artifacts deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
exports.default = router;
