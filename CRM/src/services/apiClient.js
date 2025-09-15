import axios from 'axios';

// Global API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Check for different types of auth tokens
    let token = null;
    
    // Check for admin auth first (for admin dashboard)
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      try {
        const parsed = JSON.parse(adminAuth);
        token = parsed.token;
      } catch (e) {
        console.warn('Invalid admin auth token');
      }
    }
    
    // Check for employee auth
    if (!token) {
      const employeeAuth = localStorage.getItem('employeeAuth');
      if (employeeAuth) {
        try {
          const parsed = JSON.parse(employeeAuth);
          token = parsed.token;
        } catch (e) {
          console.warn('Invalid employee auth token');
        }
      }
    }
    
    // Check for customer auth
    if (!token) {
      const customerAuth = localStorage.getItem('customerAuth');
      if (customerAuth) {
        try {
          const parsed = JSON.parse(customerAuth);
          token = parsed.token;
        } catch (e) {
          console.warn('Invalid customer auth token');
        }
      }
    }
    
    // Fallback to simple token storage
    if (!token) {
      token = localStorage.getItem('authToken');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Backend server is not available');
      return Promise.reject(new Error('Backend server is not available. Please check if the server is running.'));
    }
    
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access denied. You do not have permission to perform this action.'));
    }
    
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    return Promise.reject(error.response?.data?.message || error.message || 'An unexpected error occurred');
  }
);

// API status checker
export const checkAPIHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default apiClient;
