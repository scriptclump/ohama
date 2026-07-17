"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCase = void 0;
const mongoose_1 = require("mongoose");
const TestCaseSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    specCode: { type: String, required: true },
    targetUrl: { type: String },
    defaultEmulation: {
        device: { type: String },
        browser: { type: String, enum: ['chromium', 'firefox', 'webkit'], default: 'chromium' }
    },
    source: { type: String, enum: ['manual', 'codegen'], default: 'manual' }
}, {
    timestamps: true
});
exports.TestCase = (0, mongoose_1.model)('TestCase', TestCaseSchema);
