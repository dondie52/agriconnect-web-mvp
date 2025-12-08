/**
 * API Configuration for AgriConnect Frontend
 * Centralized API URL configuration using Vite environment variables
 */

// Debug print to confirm Vercel injected variables
console.log("ENV DEBUG ===>", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  NODE_ENV: import.meta.env.MODE,
});

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '/uploads') : 'http://localhost:5000/uploads');

// Base URL without /api suffix (for WebSocket connections)
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';

// WebSocket URL for live price updates
export const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/live/prices';

// Log API configuration (always log to help debug)
console.log('🔗 API Configuration:', {
  API_URL,
  UPLOAD_URL,
  API_BASE_URL,
  WS_URL,
  'VITE_API_URL from env': import.meta.env.VITE_API_URL || 'NOT SET - using fallback',
  'MODE': import.meta.env.MODE
});

// Warn if using localhost fallback in production
if (!import.meta.env.VITE_API_URL && import.meta.env.MODE === 'production') {
  console.warn('⚠️ WARNING: VITE_API_URL not set! Using localhost fallback. This will not work in production.');
}
