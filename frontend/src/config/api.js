/**
 * API Configuration for AgriConnect Frontend
 * Centralized API URL configuration using Create React App environment variables
 */

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '/uploads') : 'http://localhost:5000/uploads');

// Base URL without /api suffix (for WebSocket connections)
export const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

// WebSocket URL for live price updates
export const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/live/prices';

// Log API configuration (always log to help debug)
console.log('🔗 API Configuration:', {
  API_URL,
  UPLOAD_URL,
  API_BASE_URL,
  WS_URL,
  'REACT_APP_API_URL from env': process.env.REACT_APP_API_URL || 'NOT SET - using fallback',
  'NODE_ENV': process.env.NODE_ENV
});

// Warn if using localhost fallback in production
if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ WARNING: REACT_APP_API_URL not set! Using localhost fallback. This will not work in production.');
}
