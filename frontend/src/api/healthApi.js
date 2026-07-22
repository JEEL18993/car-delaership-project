import apiClient from './axios';

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
