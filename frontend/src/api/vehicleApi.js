import apiClient from './axios';

export const getVehicles = async () => {
  const response = await apiClient.get('/vehicles');
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  return [];
};

export const searchVehicles = async (params) => {
  const response = await apiClient.get('/vehicles/search', { params });
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  return [];
};

export const createVehicle = async (vehicleData) => {
  const response = await apiClient.post('/vehicles', vehicleData);
  return response.data?.data || response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
  return response.data?.data || response.data;
};

export const deleteVehicle = async (id) => {
  const response = await apiClient.delete(`/vehicles/${id}`);
  return response.data?.data || response.data;
};

export const purchaseVehicle = async (id) => {
  const response = await apiClient.post(`/vehicles/${id}/purchase`);
  return response.data?.data || response.data;
};

export const restockVehicle = async (id, amount) => {
  const response = await apiClient.post(`/vehicles/${id}/restock`, { amount });
  return response.data?.data || response.data;
};

export const vehicleApi = {
  getVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle
};

export default vehicleApi;
