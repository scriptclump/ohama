import { useState, useEffect } from 'react';
import { listDevices } from '../api';

let cachedDevices: string[] = [];
let cachedBrowsers: string[] = [];

export const useDevices = () => {
  const [devices, setDevices] = useState<string[]>(cachedDevices);
  const [browsers, setBrowsers] = useState<string[]>(cachedBrowsers);
  const [loading, setLoading] = useState<boolean>(cachedDevices.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedDevices.length > 0) {
      setLoading(false);
      return;
    }

    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listDevices();
        cachedDevices = data.devices || [];
        cachedBrowsers = data.browsers || [];
        setDevices(cachedDevices);
        setBrowsers(cachedBrowsers);
      } catch (err: any) {
        console.error('Error fetching device list:', err);
        setError(err.message || 'Failed to load emulation devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  return {
    devices,
    browsers,
    loading,
    error
  };
};
