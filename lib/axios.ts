import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://eventeevapi.onrender.com';

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
      const isLoginRequest = error.config?.url?.includes('/api/auth/login');
      const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/';

      console.error('[Axios Response] 401 Unauthorized detected:', {
        url: error.config?.url,
        message: error.response?.data?.message || 'Unauthorized',
        isLoginRequest,
        isHomePage
      });

      if (typeof window !== 'undefined' && !isLoginRequest && !isHomePage) {
        localStorage.removeItem('x-auth-token');
        // Force redirect to home page to refresh session for non-login related 401s
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
