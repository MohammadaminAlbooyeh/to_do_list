import { Platform } from 'react-native';

const getAPIHost = () => {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

export const API_BASE_URL = `http://${getAPIHost()}:5050`;
