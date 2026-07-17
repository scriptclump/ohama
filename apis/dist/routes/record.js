"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const TestCase_1 = require("../models/TestCase");
const auth_1 = require("../middleware/auth");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// @route   POST /api/record
// @desc    Spawn Playwright codegen window, wait for close, and save the generated spec code
// @access  Private
router.post('/', auth_1.auth, async (req, res) => {
    const { url, name } = req.body;
    const authReq = req;
    if (!url || !name) {
        return res.status(400).json({ message: 'URL and Name are required' });
    }
    try {
        const apisRoot = path_1.default.join(__dirname, '../../');
        const tmpDir = path_1.default.join(apisRoot, 'tmp');
        if (!fs_1.default.existsSync(tmpDir)) {
            fs_1.default.mkdirSync(tmpDir, { recursive: true });
        }
        const codegenId = new mongoose_1.default.Types.ObjectId().toString();
        const tempSpecPath = path_1.default.join(tmpDir, `codegen-${codegenId}.spec.ts`);
        // Spawn codegen process
        const child = (0, child_process_1.spawn)('npx', ['playwright', 'codegen', '-o', `tmp/codegen-${codegenId}.spec.ts`, url], {
            cwd: apisRoot,
            shell: true,
            env: { ...process.env }
        });
        child.on('close', async (code) => {
            try {
                if (!fs_1.default.existsSync(tempSpecPath)) {
                    return res.status(400).json({
                        message: 'No code was recorded. Ensure you performed some actions in the browser before closing it.'
                    });
                }
                const specCode = fs_1.default.readFileSync(tempSpecPath, 'utf8');
                // Clean up the temp spec file
                fs_1.default.unlinkSync(tempSpecPath);
                // Create new test case in Mongo
                const testCase = new TestCase_1.TestCase({
                    owner: authReq.user.id,
                    name,
                    description: `Codegen recorded test for ${url}`,
                    specCode,
                    targetUrl: url,
                    source: 'codegen',
                    defaultEmulation: {
                        browser: 'chromium'
                    }
                });
                await testCase.save();
                res.status(201).json(testCase);
            }
            catch (err) {
                console.error('Error during codegen cleanup/save:', err);
                res.status(500).json({ message: 'Error saving recorded test case', error: err.message });
            }
        });
    }
    catch (err) {
        console.error('Error launching codegen:', err);
        res.status(500).json({ message: 'Failed to start codegen', error: err.message });
    }
});
exports.default = router;
