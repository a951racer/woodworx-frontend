import axios from 'axios';

const TOKEN_KEY = 'woodworx_token';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Request interceptor: attach JWT token to Authorization header
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 by clearing auth state and redirecting to login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
