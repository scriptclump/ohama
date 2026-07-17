export interface TestCase {
  _id: string;
  name: string;
  description?: string;
  specCode: string;
  targetUrl?: string;
  defaultEmulation?: { device?: string; browser: string };
  source: 'manual' | 'codegen';
  module?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestRun {
  _id: string;
  testCase: string;
  status: 'passed' | 'failed' | 'timedout' | 'error';
  emulation: { device?: string; browser: string };
  durationMs: number;
  startedAt: string;
  finishedAt: string;
  stdout: string;
  stderr: string;
  errorMessage?: string;
  report?: any;
  artifacts: { type: 'screenshot' | 'video' | 'trace'; path: string }[];
}

export interface DashboardStats {
  totalTests: number;
  automationCoverage: number;
  openDefects: number;
  activeSuites: number;
  passRate: number;
  executionsToday: number;
  avgRuntimeMs: number;
}
