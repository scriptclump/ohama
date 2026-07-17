import { useState, useEffect, useCallback } from 'react';
import { getDashboard, DashboardResponse } from '../api/dashboard';

export const useDashboard = (timeframe = '7d') => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await getDashboard(timeframe);
      setData(dashboardData);
    } catch (err: any) {
      console.error('Error fetching dashboard metrics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    stats: data?.stats || null,
    chartData: data?.chartData || null,
    loading,
    error,
    refresh: fetchDashboard
  };
};
