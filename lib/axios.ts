import axios from 'axios';

// Point to the Next.js proxy route, which forwards to the backend with cookies
const API_BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: '',
});

// Add a request interceptor to automatically route requests through the Next.js proxy
axiosInstance.interceptors.request.use((config) => {
  let url = config.url || '';
  
  // Only intercept if not already going through the proxy and not a local mocked route
  if (!url.startsWith('/api/proxy')) {
    // Strip leading slash
    if (url.startsWith('/')) {
      url = url.substring(1);
    }
    
    // Ensure it starts with 'api/' for the backend
    if (!url.startsWith('api/')) {
      url = 'api/' + url;
    }
    
    // Reroute through the Next.js proxy
    config.url = '/api/proxy/' + url;
  }
  
  return config;
});

// Add a response interceptor to handle shared errors (like 401 and 429 rate limits)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Auto-retry on 429 (Too Many Requests) with exponential backoff
    if (error.response?.status === 429 && config) {
      const anyConfig = config as any;
      anyConfig._retryCount = anyConfig._retryCount || 0;
      
      if (anyConfig._retryCount < 3) {
        anyConfig._retryCount += 1;
        const delay = 500 * anyConfig._retryCount;
        
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Axios Response] 429 rate limit on ${config.url}. Retrying attempt ${anyConfig._retryCount} in ${delay}ms...`);
        }
        
        await new Promise((resolve) => setTimeout(resolve, delay));
        return axiosInstance(config);
      }
    }

    if (error.response?.status === 401) {
      const url = config?.url || '';
      const isAuthRequest = url.includes('/auth/');

      if (typeof window !== 'undefined' && !isAuthRequest) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
