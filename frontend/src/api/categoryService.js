import apiClient, { extractData } from './client';

export const categoryService = {
  async getAll() {
    const response = await apiClient.get('/service-categories');
    return extractData(response);
  },

  async getById(id) {
    const response = await apiClient.get(`/service-categories/${id}`);
    return extractData(response);
  },

  async create(data) {
    const response = await apiClient.post('/service-categories', data);
    return extractData(response);
  },

  async update(id, data) {
    const response = await apiClient.put(`/service-categories/${id}`, data);
    return extractData(response);
  },

  async delete(id) {
    const response = await apiClient.delete(`/service-categories/${id}`);
    return extractData(response);
  },

  async getAvailable() {
    const response = await apiClient.get('/available-service-categories');
    return extractData(response);
  },
};
