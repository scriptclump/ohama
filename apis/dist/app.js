"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const tests_1 = __importDefault(require("./routes/tests"));
const runs_1 = __importDefault(require("./routes/runs"));
const record_1 = __importDefault(require("./routes/record"));
const devices_1 = __importDefault(require("./routes/devices"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static runs directory
app.use('/runs', express_1.default.static(path_1.default.join(__dirname, '../runs')));
// Mount API routes
app.use('/api/auth', auth_1.default);
app.use('/api/tests', tests_1.default);
app.use('/api', runs_1.default);
app.use('/api/record', record_1.default);
app.use('/api/devices', devices_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TaaS backend running' });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});
exports.default = app;
