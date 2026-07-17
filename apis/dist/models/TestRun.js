"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRun = void 0;
const mongoose_1 = require("mongoose");
const TestRunSchema = new mongoose_1.Schema({
    testCase: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TestCase', required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['passed', 'failed', 'timedout', 'error'], required: true },
    emulation: {
        device: { type: String },
        browser: { type: String, required: true }
    },
    durationMs: { type: Number, required: true },
    startedAt: { type: Date, required: true },
    finishedAt: { type: Date, required: true },
    stdout: { type: String, default: '' },
    stderr: { type: String, default: '' },
    errorMessage: { type: String },
    report: { type: mongoose_1.Schema.Types.Mixed },
    artifacts: [{
            type: { type: String, enum: ['screenshot', 'video', 'trace'], required: true },
            path: { type: String, required: true }
        }]
}, {
    timestamps: true
});
exports.TestRun = (0, mongoose_1.model)('TestRun', TestRunSchema);
