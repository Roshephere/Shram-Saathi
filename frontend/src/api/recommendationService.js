import apiClient, { extractData } from './client';

export const recommendationService = {
  async getForServiceRequest(serviceRequestId, params = {}) {
    const response = await apiClient.get(`/recommendations/service-request/${serviceRequestId}`, { params });
    return extractData(response);
  },

  async getHybrid(serviceRequestId, params = {}) {
    const response = await apiClient.get(`/recommendations/hybrid/${serviceRequestId}`, { params });
    return extractData(response);
  },

  async getByCategory(categoryId, params = {}) {
    const response = await apiClient.get(`/recommendations/category/${categoryId}`, { params });
    return extractData(response);
  },
};
