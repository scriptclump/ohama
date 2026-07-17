import client from './client';

export interface DevicesResponse {
  browsers: string[];
  devices: string[];
}

export const listDevices = async (): Promise<DevicesResponse> => {
  const response = await client.get('/devices');
  return response.data;
};
