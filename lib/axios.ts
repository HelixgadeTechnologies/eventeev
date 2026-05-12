import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventeevapi.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('x-auth-token');
      if (token) {
        // Log diagnostic (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Axios Request] Attaching token to ${config.url}`);
        }
        
        // Backend expects x-auth-token
        config.headers['x-auth-token'] = token;
        
        // Fallback: Some backends also listen to standard Authorization header
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Axios Request] No token found in localStorage for ${config.url}`);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle shared errors (like 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthRequest = url.includes('/api/auth/');

      if (typeof window !== 'undefined' && !isAuthRequest) {
        localStorage.removeItem('x-auth-token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
