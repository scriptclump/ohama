export const generateConfig = (runId: string, browser: string, device?: string): string => {
  const deviceLine = device ? `...devices['${device}'],` : '';
  return `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '${runId}.spec.ts',
  outputDir: '../runs/${runId}',
  reporter: [['json', { outputFile: '../runs/${runId}/report.json' }]],
  use: {
    ${deviceLine}
    browserName: '${browser}',
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },
});
`;
};
