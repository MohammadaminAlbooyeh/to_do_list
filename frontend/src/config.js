import { Platform } from 'react-native';

const getAPIBase = () => {
  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = window.location.port ? `:${window.location.port}` : '';
    return `http://${host}${port}`;
  }
  return Platform.OS === 'android' ? 'http://10.0.2.2:5050' : 'http://localhost:5050';
};

export const API_BASE_URL = getAPIBase();
