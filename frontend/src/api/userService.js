import apiClient, { extractData } from './client';

export const userService = {
  async getLocations() {
    const response = await apiClient.get('/user/locations');
    return extractData(response);
  },

  async createLocation(data) {
    const response = await apiClient.post('/user/locations', data);
    return extractData(response);
  },

  async updateLocation(id, data) {
    const response = await apiClient.put(`/user/locations/${id}`, data);
    return extractData(response);
  },

  async deleteLocation(id) {
    const response = await apiClient.delete(`/user/locations/${id}`);
    return extractData(response);
  },

  async getAllUsers(params) {
    const response = await apiClient.get('/users', { params });
    const data = extractData(response);
    return data?.data ?? data ?? [];
  },

  async getUserById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return extractData(response);
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return extractData(response);
  },
};
