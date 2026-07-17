import client from './client';

export const register = async (name: string, email: string, password: string) => {
  const response = await client.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};
