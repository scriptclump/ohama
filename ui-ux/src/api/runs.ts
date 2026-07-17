import client from './client';
import { TestRun } from './types';

export const runTest = async (
  testId: string,
  emulation?: { browser?: string; device?: string }
): Promise<TestRun> => {
  const response = await client.post(`/tests/${testId}/run`, emulation || {});
  return response.data;
};

export const listRuns = async (testId: string): Promise<TestRun[]> => {
  const response = await client.get(`/tests/${testId}/runs`);
  return response.data;
};

export const getRun = async (runId: string): Promise<TestRun> => {
  const response = await client.get(`/runs/${runId}`);
  return response.data;
};

export const artifactUrl = (runId: string, filename: string): string => {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Replace /api suffix to get base server URL (e.g. http://localhost:5000)
  const serverBase = apiBase.replace(/\/api$/, '');
  return `${serverBase}/runs/${runId}/${filename}`;
};
