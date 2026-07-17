import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateConfig } from './configGen';

export const runPlaywrightTest = async (
  runId: string,
  specCode: string,
  browser: string,
  device?: string
): Promise<{
  status: 'passed' | 'failed' | 'timedout' | 'error';
  durationMs: number;
  stdout: string;
  stderr: string;
  errorMessage?: string;
  report?: any;
  artifacts: Array<{ type: 'screenshot' | 'video' | 'trace'; path: string }>;
}> => {
  const apisRoot = path.join(__dirname, '../../');
  const tmpDir = path.join(apisRoot, 'tmp');
  const runsDir = path.join(apisRoot, 'runs');
  const runOutputDir = path.join(runsDir, runId);

  // Ensure directories exist
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  if (!fs.existsSync(runsDir)) fs.mkdirSync(runsDir, { recursive: true });
  if (!fs.existsSync(runOutputDir)) fs.mkdirSync(runOutputDir, { recursive: true });

  const specPath = path.join(tmpDir, `${runId}.spec.ts`);
  const configPath = path.join(tmpDir, `${runId}.config.ts`);
  const reportPath = path.join(runOutputDir, 'report.json');

  // Write spec file and config file
  fs.writeFileSync(specPath, specCode, 'utf8');
  fs.writeFileSync(configPath, generateConfig(runId, browser, device), 'utf8');

  let stdout = '';
  let stderr = '';
  let status: 'passed' | 'failed' | 'timedout' | 'error' = 'passed';
  let errorMessage: string | undefined = undefined;
  let durationMs = 0;
  let artifacts: Array<{ type: 'screenshot' | 'video' | 'trace'; path: string }> = [];
  let parsedReport: any = null;
  const startedAt = Date.now();

  return new Promise((resolve) => {
    // Command: npx playwright test tmp/<runId>.spec.ts --config tmp/<runId>.config.ts
    const child = spawn(
      'npx',
      ['playwright', 'test', `tmp/${runId}.spec.ts`, '--config', `tmp/${runId}.config.ts`],
      { cwd: apisRoot, shell: true }
    );

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
        if (fs.existsSync(specPath)) fs.unlinkSync(specPath);
        if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
      } catch (err) {
        console.error('Error deleting temp files:', err);
      }

      // Parse JSON report
      try {
        if (fs.existsSync(reportPath)) {
          const reportData = fs.readFileSync(reportPath, 'utf8');
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
                          } else if (result.status === 'timedOut') {
                            hasTimeouts = true;
                          }

                          if (result.error && result.error.message) {
                            errorMessage = result.error.message.replace(/\u001b\[[0-9;]*m/g, '');
                          }

                          if (result.attachments) {
                            for (const attachment of result.attachments) {
                              let type: 'screenshot' | 'video' | 'trace' | null = null;
                              if (attachment.name === 'screenshot' || attachment.contentType?.startsWith('image/')) {
                                type = 'screenshot';
                              } else if (attachment.name === 'video' || attachment.contentType?.startsWith('video/')) {
                                type = 'video';
                              } else if (attachment.name === 'trace' || attachment.contentType === 'application/zip') {
                                type = 'trace';
                              }

                              if (type && attachment.path) {
                                // Convert absolute path to relative path (relative to apis root)
                                const relativePath = path.relative(apisRoot, attachment.path);
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
          } else if (hasFailures) {
            status = 'failed';
          } else {
            status = 'passed';
          }
        } else {
          if (status !== 'timedout') {
            status = 'error';
            errorMessage = errorMessage || stderr.replace(/\u001b\[[0-9;]*m/g, '') || 'Playwright crashed or failed to compile the test.';
          }
        }
      } catch (e: any) {
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
