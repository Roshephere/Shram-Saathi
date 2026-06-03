import apiClient, { extractData } from './client';

export const adminService = {
  async getDashboardStats() {
    const response = await apiClient.get('/admin/dashboard');
    return extractData(response);
  },

  async getPendingMerchants() {
    const response = await apiClient.get('/admin/merchants/pending');
    return extractData(response);
  },

  async verifyMerchant(id, notes = '') {
    const response = await apiClient.put(`/admin/merchants/${id}/verify`, { notes });
    return response.data;
  },

  async rejectMerchant(id, reason = '') {
    const response = await apiClient.put(`/admin/merchants/${id}/reject`, { reason });
    return response.data;
  },

  async suspendMerchant(id, reason = '') {
    const response = await apiClient.put(`/admin/merchants/${id}/suspend`, { reason });
    return response.data;
  },

  async getTransactions(params) {
    const response = await apiClient.get('/admin/transactions', { params });
    return extractData(response);
  },
};
