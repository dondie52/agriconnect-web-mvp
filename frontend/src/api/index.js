/**
 * API Configuration for AgriConnect Frontend
 * Production-ready with WebSocket support for real-time updates
 */
import axios from 'axios';

// Read API URL from environment variables (Create React App uses REACT_APP_ prefix)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5000/uploads';

// Base URL without /api suffix (for WebSocket connections)
export const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

// WebSocket URL for live price updates
export const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/live/prices';

// Log API configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API Configuration:', {
    API_URL,
    UPLOAD_URL,
    API_BASE_URL,
    WS_URL
  });
}

// Create axios instance with CORS credentials support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for CORS with credentials
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth token and log in development
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error.message);
    return Promise.reject(error);
  }
);

// Helper function to get user-friendly error message
const getErrorMessage = (error) => {
  // Network error (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your internet connection and try again.';
    }
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    return 'Connection failed. Please try again later.';
  }
  
  // CORS error
  if (error.response.status === 403 && error.response.data?.message?.includes('CORS')) {
    return 'Access denied. Please refresh the page and try again.';
  }
  
  // Server provided error message
  if (error.response.data?.message) {
    return error.response.data.message;
  }
  
  // Fallback based on status code
  switch (error.response.status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return 'Access denied. You do not have permission for this action.';
    case 404:
      return 'Resource not found.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again in a few minutes.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Response interceptor - handle errors with better messages
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 API Response: ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Attach user-friendly message to error
    error.userMessage = getErrorMessage(error);
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadProfilePhoto: (formData) => api.post('/auth/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/listings/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/listings/${id}`),
  getMyListings: (params) => api.get('/listings/farmer/my-listings', { params }),
  getStats: () => api.get('/listings/farmer/stats'),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getFarmerOrders: (params) => api.get('/orders/farmer/my-orders', { params }),
  getBuyerOrders: (params) => api.get('/orders/buyer/my-orders', { params }),
  getStats: () => api.get('/orders/farmer/stats'),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};

// Prices API
export const pricesAPI = {
  getAll: (params) => api.get('/prices', { params }),
  getLatest: (params) => api.get('/prices/latest', { params }),
  getSyncStatus: () => api.get('/prices/sync-status'),
  getByCrop: (cropId) => api.get(`/prices/crop/${cropId}`),
  getByRegion: (regionId) => api.get(`/prices/region/${regionId}`),
  upsert: (data) => api.post('/prices', data),
  bulkUpsert: (data) => api.post('/prices/bulk', data),
  triggerSync: () => api.post('/prices/sync'),
};

// Requests API (Buyer Requests)
export const requestsAPI = {
  getAll: (params) => api.get('/requests', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
  getMyRequests: (params) => api.get('/requests/buyer/my-requests', { params }),
  getRelevantForFarmer: (params) => api.get('/requests/farmer/relevant', { params }),
  close: (id) => api.post(`/requests/${id}/close`),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Weather API
export const weatherAPI = {
  getForUser: () => api.get('/weather/my-region'),
  getByRegion: (regionId) => api.get(`/weather/region/${regionId}`),
  getForecast: (regionId) => api.get(`/weather/forecast/${regionId || ''}`),
};

// Crop Plans API
export const cropPlansAPI = {
  create: (data) => api.post('/crop-plans', data),
  getMyPlans: (params) => api.get('/crop-plans/my-plans', { params }),
  delete: (id) => api.delete(`/crop-plans/${id}`),
  getRegionalTrends: (regionId, params) => api.get(`/crop-plans/trends/region/${regionId}`, { params }),
  getNationalTrends: (params) => api.get('/crop-plans/trends/national', { params }),
  getSummary: () => api.get('/crop-plans/summary'),
};

// Analytics API
export const analyticsAPI = {
  trackView: (listingId) => api.post('/analytics/track/view', { listing_id: listingId }),
  trackContact: (listingId) => api.post('/analytics/track/contact', { listing_id: listingId }),
  getFarmerSummary: (params) => api.get('/analytics/farmer/overview', { params }),
  getFarmerDetails: (params) => api.get('/analytics/farmer/details', { params }),
  getTopListings: (params) => api.get('/analytics/farmer/top-listings', { params }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getListings: (params) => api.get('/admin/listings', { params }),
};

// Reference Data API
export const referenceAPI = {
  getCrops: () => api.get('/crops'),
  getRegions: () => api.get('/regions'),
};

// Chat API (Chatbot)
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
};

// AI API
export const aiAPI = {
  getFarmingTips: (data) => api.post('/ai/farming-tips', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
