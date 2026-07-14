import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('auth_token');
      const publicPaths = ['/home', '/auth/', '/login', '/register'];
      const isPublicPage = publicPaths.some((p) => window.location.pathname.startsWith(p));

      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      if (token && !isPublicPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function extractData(response) {
  const data = response.data;
  if (data && data.success !== undefined && data.data !== undefined) {
    return data.data;
  }
  return data;
}

export function extractPaginated(response) {
  const data = response.data;
  if (data && data.success !== undefined && data.data !== undefined) {
    return { data: data.data, meta: data.meta || {} };
  }
  return { data: data, meta: {} };
}

export default apiClient;
