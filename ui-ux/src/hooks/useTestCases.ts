import { useState, useEffect, useCallback } from 'react';
import { listTests, createTest, updateTest, deleteTest, TestCase } from '../api';

export const useTestCases = () => {
  const [tests, setTests] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTests();
      setTests(data);
    } catch (err: any) {
      console.error('Error fetching test cases:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load test cases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleCreate = async (payload: Partial<TestCase>) => {
    setError(null);
    try {
      const newTest = await createTest(payload);
      setTests(prev => [newTest, ...prev]);
      return newTest;
    } catch (err: any) {
      console.error('Error creating test case:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create test case');
      throw err;
    }
  };

  const handleUpdate = async (id: string, payload: Partial<TestCase>) => {
    setError(null);
    try {
      const updated = await updateTest(id, payload);
      setTests(prev => prev.map(t => t._id === id ? updated : t));
      return updated;
    } catch (err: any) {
      console.error('Error updating test case:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update test case');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteTest(id);
      setTests(prev => prev.filter(t => t._id !== id));
    } catch (err: any) {
      console.error('Error deleting test case:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete test case');
      throw err;
    }
  };

  return {
    tests,
    loading,
    error,
    createTest: handleCreate,
    updateTest: handleUpdate,
    deleteTest: handleDelete,
    refresh: fetchTests
  };
};
