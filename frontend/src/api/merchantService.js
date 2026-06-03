import apiClient, { extractData } from './client';

export const merchantService = {
  async getAll() {
    const response = await apiClient.get('/merchants');
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/merchants/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/merchants', data);
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.put(`/merchants/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/merchants/${id}`);
    return response.data;
  },

  async getServiceCategories(merchantId) {
    const response = await apiClient.get(`/merchants/${merchantId}/service-categories`);
    return extractData(response);
  },

  async attachServiceCategories(merchantId, data) {
    const response = await apiClient.post(`/merchants/${merchantId}/service-categories`, data);
    return extractData(response);
  },

  async updateServiceCategory(merchantId, categoryId, data) {
    const response = await apiClient.put(`/merchants/${merchantId}/service-categories/${categoryId}`, data);
    return extractData(response);
  },

  async detachServiceCategory(merchantId, categoryId) {
    const response = await apiClient.delete(`/merchants/${merchantId}/service-categories/${categoryId}`);
    return extractData(response);
  },

  async syncServiceCategories(merchantId, data) {
    const response = await apiClient.put(`/merchants/${merchantId}/service-categories/sync`, data);
    return extractData(response);
  },
};
