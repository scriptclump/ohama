"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPlaywrightTest = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configGen_1 = require("./configGen");
const runPlaywrightTest = async (runId, specCode, browser, device) => {
    const apisRoot = path_1.default.join(__dirname, '../../');
    const tmpDir = path_1.default.join(apisRoot, 'tmp');
    const runsDir = path_1.default.join(apisRoot, 'runs');
    const runOutputDir = path_1.default.join(runsDir, runId);
    // Ensure directories exist
    if (!fs_1.default.existsSync(tmpDir))
        fs_1.default.mkdirSync(tmpDir, { recursive: true });
    if (!fs_1.default.existsSync(runsDir))
        fs_1.default.mkdirSync(runsDir, { recursive: true });
    if (!fs_1.default.existsSync(runOutputDir))
        fs_1.default.mkdirSync(runOutputDir, { recursive: true });
    const specPath = path_1.default.join(tmpDir, `${runId}.spec.ts`);
    const configPath = path_1.default.join(tmpDir, `${runId}.config.ts`);
    const reportPath = path_1.default.join(runOutputDir, 'report.json');
    // Write spec file and config file
    fs_1.default.writeFileSync(specPath, specCode, 'utf8');
    fs_1.default.writeFileSync(configPath, (0, configGen_1.generateConfig)(runId, browser, device), 'utf8');
    let stdout = '';
    let stderr = '';
    let status = 'passed';
    let errorMessage = undefined;
    let durationMs = 0;
    let artifacts = [];
    let parsedReport = null;
    const startedAt = Date.now();
    return new Promise((resolve) => {
        // Command: npx playwright test tmp/<runId>.spec.ts --config tmp/<runId>.config.ts
        const child = (0, child_process_1.spawn)('npx', ['playwright', 'test', `tmp/${runId}.spec.ts`, '--config', `tmp/${runId}.config.ts`], { cwd: apisRoot, shell: true });
        // Timeout execution after 60 seconds
        const timeoutDuration = 60000;
        const timer = setTimeout(() => {
            child.kill('SIGKILL');
            status = 'timedout';
            errorMessage = `Test run timed out after ${timeoutDuration / 1000}s`;
        }, timeoutDuration);
        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        child.on('close', (code) => {
            clearTimeout(timer);
            const finishedAt = Date.now();
            durationMs = finishedAt - startedAt;
            // Clean up temp files
            try {
                if (fs_1.default.existsSync(specPath))
                    fs_1.default.unlinkSync(specPath);
                if (fs_1.default.existsSync(configPath))
                    fs_1.default.unlinkSync(configPath);
            }
            catch (err) {
                console.error('Error deleting temp files:', err);
            }
            // Parse JSON report
            try {
                if (fs_1.default.existsSync(reportPath)) {
                    const reportData = fs_1.default.readFileSync(reportPath, 'utf8');
                    parsedReport = JSON.parse(reportData);
                    if (parsedReport.stats) {
                        durationMs = parsedReport.stats.duration || durationMs;
                    }
                    let hasFailures = false;
                    let hasTimeouts = false;
                    if (parsedReport.suites) {
                        for (const suite of parsedReport.suites) {
                            if (suite.specs) {
                                for (const spec of suite.specs) {
                                    if (spec.tests) {
                                        for (const test of spec.tests) {
                                            if (test.results) {
                                                for (const result of test.results) {
                                                    if (result.status === 'failed') {
                                                        hasFailures = true;
                                                    }
                                                    else if (result.status === 'timedOut') {
                                                        hasTimeouts = true;
                                                    }
                                                    if (result.error && result.error.message) {
                                                        errorMessage = result.error.message.replace(/\u001b\[[0-9;]*m/g, '');
                                                    }
                                                    if (result.attachments) {
                                                        for (const attachment of result.attachments) {
                                                            let type = null;
                                                            if (attachment.name === 'screenshot' || attachment.contentType?.startsWith('image/')) {
                                                                type = 'screenshot';
                                                            }
                                                            else if (attachment.name === 'video' || attachment.contentType?.startsWith('video/')) {
                                                                type = 'video';
                                                            }
                                                            else if (attachment.name === 'trace' || attachment.contentType === 'application/zip') {
                                                                type = 'trace';
                                                            }
                                                            if (type && attachment.path) {
                                                                // Convert absolute path to relative path (relative to apis root)
                                                                const relativePath = path_1.default.relative(apisRoot, attachment.path);
                                                                artifacts.push({
                                                                    type,
                                                                    path: relativePath
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (hasTimeouts) {
                        status = 'timedout';
                    }
                    else if (hasFailures) {
                        status = 'failed';
                    }
                    else {
                        status = 'passed';
                    }
                }
                else {
                    if (status !== 'timedout') {
                        status = 'error';
                        errorMessage = errorMessage || stderr.replace(/\u001b\[[0-9;]*m/g, '') || 'Playwright crashed or failed to compile the test.';
                    }
                }
            }
            catch (e) {
                status = 'error';
                errorMessage = `Failed to parse Playwright report: ${e.message}`;
            }
            resolve({
                status,
                durationMs,
                stdout,
                stderr,
                errorMessage,
                report: parsedReport,
                artifacts
            });
        });
    });
};
exports.runPlaywrightTest = runPlaywrightTest;
