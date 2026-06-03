import apiClient, { extractData } from './client';

export const customerService = {
  async getBookings(params) {
    const response = await apiClient.get('/bookings', { params });
    return extractData(response);
  },

  async createBooking(data) {
    const response = await apiClient.post('/bookings', data);
    return extractData(response);
  },

  async getBookingById(id) {
    const response = await apiClient.get(`/bookings/${id}`);
    return extractData(response);
  },

  async cancelBooking(id) {
    const response = await apiClient.delete(`/bookings/${id}`);
    return extractData(response);
  },

  async getReviews(params) {
    try {
      const response = await apiClient.get('/merchant-reviews', { params });
      return extractData(response);
    } catch { return []; }
  },

  async createReview(data) {
    const response = await apiClient.post('/merchant-reviews', data);
    return extractData(response);
  },
};
