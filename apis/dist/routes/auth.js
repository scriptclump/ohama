"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        let user = await User_1.User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        user = new User_1.User({
            name,
            email,
            passwordHash
        });
        await user.save();
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth_1.auth, async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const user = await User_1.User.findById(authReq.user.id).select('-passwordHash');
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.default = router;
