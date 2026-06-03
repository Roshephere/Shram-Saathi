import apiClient, { extractData } from './client';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },

  async register(data) {
    const response = await apiClient.post('/register', data);
    return response.data;
  },

  async me() {
    const response = await apiClient.get('/me');
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/logout');
    return extractData(response);
  },

  async updateProfile(data) {
    const response = await apiClient.post('/updateProfile', data);
    return response.data;
  },

  async updatePassword(data) {
    const response = await apiClient.post('/updatePassword', data);
    return response.data;
  },
};
