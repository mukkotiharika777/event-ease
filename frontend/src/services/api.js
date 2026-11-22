import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 2500, // Short timeout for rapid failover to local database when backend is not active
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('eventease_token');
        localStorage.removeItem('eventease_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
