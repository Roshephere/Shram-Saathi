import apiClient, { extractData } from './client';

export const reviewService = {
  async getAll(params) {
    try {
      const response = await apiClient.get('/merchant-reviews', { params });
      return extractData(response);
    } catch { return []; }
  },

  async create(data) {
    const response = await apiClient.post('/merchant-reviews', data);
    return extractData(response);
  },

  async getByMerchant(merchantId) {
    try {
      const response = await apiClient.get(`/merchants/${merchantId}/reviews`);
      return extractData(response);
    } catch { return []; }
  },
};
