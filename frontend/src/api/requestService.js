import apiClient, { extractData } from './client';

export const requestService = {
  async getAll(params) {
    const response = await apiClient.get('/service-requests', { params });
    const data = extractData(response);
    return data?.data ?? data ?? [];
  },

  async getById(id) {
    const response = await apiClient.get(`/service-requests/${id}`);
    return extractData(response);
  },

  async create(data) {
    const response = await apiClient.post('/service-requests', data);
    return extractData(response);
  },

  async update(id, data) {
    const response = await apiClient.put(`/service-requests/${id}`, data);
    return extractData(response);
  },

  async delete(id) {
    const response = await apiClient.delete(`/service-requests/${id}`);
    return extractData(response);
  },

  async getUserRequests(params) {
    const response = await apiClient.get('/service-requests/user/list', { params });
    return extractData(response);
  },

  async getAvailableRequests(params) {
    const response = await apiClient.get('/service-requests/available', { params });
    return extractData(response);
  },
};
