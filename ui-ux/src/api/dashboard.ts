import client from './client';
import { DashboardStats } from './types';

export interface DashboardResponse {
  stats: DashboardStats;
  chartData: {
    executionResults: Array<{
      label: string;
      count: number;
      percentage: number;
      color: string;
      hoverColor: string;
      dotColor: string;
    }>;
    executionTrend: Array<{
      date: string;
      passed: number;
      failed: number;
      noResult: number;
      error: number;
    }>;
    bugsByModule: Array<{
      name: string;
      total: number;
      passed: number;
      failed: number;
    }>;
    automationVsManual: Array<{
      name: string;
      percent: number;
      auto: number;
      manual: number;
    }>;
    activityHeatmap: number[];
  };
}

export interface ModuleDashboardResponse {
  kpis: {
    totalTests: number;
    executions: number;
    passRate: number;
    openDefects: number;
  };
  submodules: Array<{
    name: string;
    total: number;
    passed: number;
    failed: number;
  }>;
  recentRuns: Array<{
    id: string;
    testCaseName: string;
    status: 'passed' | 'failed' | 'timedout' | 'error';
    durationMs: number;
    startedAt: string;
  }>;
  openDefects: any[];
}

export const getDashboard = async (timeframe = '7d'): Promise<DashboardResponse> => {
  const response = await client.get('/dashboard', { params: { timeframe } });
  return response.data;
};

export const getModuleDashboard = async (module: string): Promise<ModuleDashboardResponse> => {
  const response = await client.get(`/dashboard/module/${encodeURIComponent(module)}`);
  return response.data;
};
