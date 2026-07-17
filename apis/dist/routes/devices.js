"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_1 = require("@playwright/test");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/devices
// @desc    Get list of emulation devices and browser engines
// @access  Private
router.get('/', auth_1.auth, (req, res) => {
    try {
        const deviceNames = Object.keys(test_1.devices);
        const browsers = ['chromium', 'firefox', 'webkit'];
        res.json({
            browsers,
            devices: deviceNames
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve devices list', error: error.message });
    }
});
exports.default = router;
