import { useState, useEffect, useCallback } from 'react';
import { getModuleDashboard, ModuleDashboardResponse } from '../api';

export const useDetailView = (moduleName: string) => {
  const [data, setData] = useState<ModuleDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!moduleName) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getModuleDashboard(moduleName);
      setData(result);
    } catch (err: any) {
      console.error('Error fetching detail metrics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load module details');
    } finally {
      setLoading(false);
    }
  }, [moduleName]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    kpis: data?.kpis || null,
    submodules: data?.submodules || [],
    recentRuns: data?.recentRuns || [],
    openDefects: data?.openDefects || [],
    loading,
    error,
    refresh: fetchDetail
  };
};
