import apiClient, { extractData } from './client';

export const reviewService = {
  /** POST /reviews - submit a review for a completed booking */
  async create(data) {
    const response = await apiClient.post('/reviews', data);
    return extractData(response);
  },

  /** PUT /reviews/{id} - update a review */
  async update(id, data) {
    const response = await apiClient.put(`/reviews/${id}`, data);
    return extractData(response);
  },

  /** GET /reviews/{id} - get single review */
  async getById(id) {
    const response = await apiClient.get(`/reviews/${id}`);
    return extractData(response);
  },

  /** DELETE /reviews/{id} - delete a review */
  async delete(id) {
    const response = await apiClient.delete(`/reviews/${id}`);
    return extractData(response);
  },

  /** GET /merchants/{merchantId}/reviews - list reviews for a merchant */
  async getByMerchant(merchantId, params) {
    try {
      const response = await apiClient.get(`/merchants/${merchantId}/reviews`, { params });
      return extractData(response);
    } catch { return []; }
  },

  /** GET /user/reviews - get reviews written by current user */
  async getMyReviews() {
    try {
      const response = await apiClient.get('/user/reviews');
      return extractData(response);
    } catch { return []; }
  },
};
