/**
 * API Configuration for AgriConnect Frontend
 */
import axios from 'axios';

// Read API URL from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000/uploads';

// Warn if environment variables are missing
if (!import.meta.env.VITE_API_URL) {
  console.warn('Missing VITE_API_URL environment variable. Using default: http://localhost:5000/api');
}

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
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
  getByCrop: (cropId) => api.get(`/prices/crop/${cropId}`),
  getByRegion: (regionId) => api.get(`/prices/region/${regionId}`),
  upsert: (data) => api.post('/prices', data),
  bulkUpsert: (data) => api.post('/prices/bulk', data),
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
