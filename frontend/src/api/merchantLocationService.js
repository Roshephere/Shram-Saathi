import apiClient, { extractData } from './client';

export const merchantLocationService = {
  async getAll() {
    const response = await apiClient.get('/merchant-locations');
    return extractData(response);
  },

  async getById(id) {
    const response = await apiClient.get(`/merchant-locations/${id}`);
    return extractData(response);
  },

  async create(data) {
    const response = await apiClient.post('/merchant-locations', data);
    return extractData(response);
  },

  async update(id, data) {
    const response = await apiClient.put(`/merchant-locations/${id}`, data);
    return extractData(response);
  },

  async delete(id) {
    const response = await apiClient.delete(`/merchant-locations/${id}`);
    return extractData(response);
  },
};
