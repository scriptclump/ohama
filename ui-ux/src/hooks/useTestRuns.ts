import { useState, useEffect, useCallback } from 'react';
import { listRuns, runTest, TestRun } from '../api';

export const useTestRuns = (testId: string) => {
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = useCallback(async () => {
    if (!testId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listRuns(testId);
      setRuns(data);
    } catch (err: any) {
      console.error('Error fetching test runs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load run history');
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const executeRun = async (emulation?: { browser?: string; device?: string }) => {
    if (!testId) return;
    setExecuting(true);
    setError(null);
    try {
      const result = await runTest(testId, emulation);
      setRuns(prev => [result, ...prev]);
      return result;
    } catch (err: any) {
      console.error('Error executing test:', err);
      setError(err.response?.data?.message || err.message || 'Test run failed to execute');
      throw err;
    } finally {
      setExecuting(false);
    }
  };

  return {
    runs,
    loading,
    executing,
    error,
    executeRun,
    refresh: fetchRuns
  };
};
