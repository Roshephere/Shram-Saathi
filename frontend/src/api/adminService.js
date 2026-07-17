import apiClient, { extractData, extractPaginated } from './client';

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

  async getBookings(params) {
    const response = await apiClient.get('/admin/bookings', { params });
    return extractPaginated(response);
  },

  async getReviews(params) {
    const response = await apiClient.get('/admin/reviews', { params });
    return extractPaginated(response);
  },

  async verifyReview(id) {
    const response = await apiClient.put(`/admin/reviews/${id}/verify`);
    return extractData(response);
  },

  async rejectReview(id) {
    const response = await apiClient.put(`/admin/reviews/${id}/reject`);
    return extractData(response);
  },

  async resubmitMerchant(id) {
    const response = await apiClient.put(`/admin/merchants/${id}/resubmit`);
    return extractData(response);
  },

  async getTransactions(params) {
    const response = await apiClient.get('/admin/transactions', { params });
    return extractPaginated(response);
  },

  async sendPaymentReminder(bookingId, merchantId) {
    const response = await apiClient.post(`/admin/transactions/${bookingId}/remind`, { merchant_id: merchantId });
    return extractData(response);
  },

  async blockMerchant(merchantId) {
    const response = await apiClient.put(`/admin/merchants/${merchantId}/block`);
    return extractData(response);
  },
};
