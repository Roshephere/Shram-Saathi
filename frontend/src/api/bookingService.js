import apiClient, { extractData, extractPaginated } from './client';

export const bookingService = {
  /** GET /bookings?service_request_id={id} - view bids for a request */
  async getAll(params) {
    const response = await apiClient.get('/bookings', { params });
    return extractData(response);
  },

  /** GET /customer/bookings - customer's bookings (paginated) */
  async getCustomerBookings(params) {
    const response = await apiClient.get('/customer/bookings', { params });
    return extractPaginated(response);
  },

  /** GET /bookings/{id} - single booking detail */
  async getById(id) {
    const response = await apiClient.get(`/bookings/${id}`);
    return extractData(response);
  },

  /** POST /bookings - merchant places a bid */
  async create(data) {
    const response = await apiClient.post('/bookings', data);
    return extractData(response);
  },

  /** PUT /bookings/{id}/accept - customer selects a winning bid */
  async select(id) {
    const response = await apiClient.put(`/bookings/${id}/accept`);
    return extractData(response);
  },

  /** PUT /bookings/{id}/reject - merchant withdraws their own bid */
  async reject(id) {
    const response = await apiClient.put(`/bookings/${id}/reject`);
    return extractData(response);
  },

  /** PUT /bookings/{id}/start - merchant starts work */
  async start(id) {
    const response = await apiClient.put(`/bookings/${id}/start`);
    return extractData(response);
  },

  /** PUT /bookings/{id}/complete - merchant completes work */
  async complete(id) {
    const response = await apiClient.put(`/bookings/${id}/complete`);
    return extractData(response);
  },

  /** DELETE /bookings/{id} - customer cancels */
  async cancel(id) {
    const response = await apiClient.delete(`/bookings/${id}`);
    return extractData(response);
  },

  /** GET /merchant/bookings - merchant's own bids and jobs (paginated) */
  async merchantBookings(params) {
    const response = await apiClient.get('/merchant/bookings', { params });
    return extractPaginated(response);
  },

  /** GET /bookings/{id}/transaction - get transaction for a booking */
  async getTransaction(bookingId) {
    const response = await apiClient.get(`/bookings/${bookingId}/transaction`);
    return extractData(response);
  },

  /** PUT /transactions/{id}/confirm - customer confirms payment */
  async confirmPayment(transactionId) {
    const response = await apiClient.put(`/transactions/${transactionId}/confirm`);
    return extractData(response);
  },

  /** PUT /transactions/{id}/receive - merchant confirms payment received */
  async receivePayment(transactionId) {
    const response = await apiClient.put(`/transactions/${transactionId}/receive`);
    return extractData(response);
  },
};
