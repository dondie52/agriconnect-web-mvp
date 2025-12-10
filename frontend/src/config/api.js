/**
 * API Configuration for AgriConnect Frontend
 * Strict environment variable configuration using Vite's import.meta.env
 */

const normalizeApiUrl = (url) => {
  const trimmed = (url || '').trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
};

const buildFallbackApiUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

const envApiUrl = import.meta.env?.VITE_API_URL;
export const API_URL = normalizeApiUrl(envApiUrl || buildFallbackApiUrl());

if (!envApiUrl) {
  console.warn('[AgriConnect] VITE_API_URL missing – falling back to', API_URL);
}

// Base URL without /api suffix (for WebSocket connections)
export const API_BASE_URL = API_URL.replace(/\/api$/, '');

// Upload URL - derived from API_BASE_URL if not set
export const UPLOAD_URL = import.meta.env?.VITE_UPLOAD_URL || `${API_BASE_URL}/uploads`;

// WebSocket URL for live price updates
export const WS_URL = `${API_BASE_URL.replace(/^http/, 'ws')}/live/prices`;

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    API_URL,
    UPLOAD_URL,
    API_BASE_URL,
    WS_URL,
  });
}
