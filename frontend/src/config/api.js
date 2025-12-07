/**
 * API Configuration for AgriConnect Frontend
 * Centralized API URL configuration using Vite environment variables
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '/uploads') : 'http://localhost:5000/uploads');

// Base URL without /api suffix (for WebSocket connections)
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';

// WebSocket URL for live price updates
export const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/live/prices';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔗 API Configuration:', {
    API_URL,
    UPLOAD_URL,
    API_BASE_URL,
    WS_URL
  });
}
