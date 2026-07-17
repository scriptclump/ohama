import client from './client';
import { TestCase } from './types';

export const listTests = async (): Promise<TestCase[]> => {
  const response = await client.get('/tests');
  return response.data;
};

export const getTest = async (id: string): Promise<TestCase> => {
  const response = await client.get(`/tests/${id}`);
  return response.data;
};

export const createTest = async (payload: Partial<TestCase>): Promise<TestCase> => {
  const response = await client.post('/tests', payload);
  return response.data;
};

export const updateTest = async (id: string, payload: Partial<TestCase>): Promise<TestCase> => {
  const response = await client.put(`/tests/${id}`, payload);
  return response.data;
};

export const deleteTest = async (id: string): Promise<{ message: string }> => {
  const response = await client.delete(`/tests/${id}`);
  return response.data;
};
