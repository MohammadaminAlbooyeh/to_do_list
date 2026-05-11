const getAPIBase = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
  }
  return 'http://localhost:5050';
};

export const API_BASE_URL = getAPIBase();
