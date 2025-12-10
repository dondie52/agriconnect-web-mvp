/**
 * API Configuration for AgriConnect Frontend
 * Strict environment variable configuration using Vite's import.meta.env
 */

const normalizeApiUrl = (url) => {
  const trimmed = (url || '').trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
};

const PRODUCTION_API_URL = 'https://agriconnect-web-mvp.onrender.com/api';

const resolveApiUrl = () => {
  const envApiUrl = import.meta.env?.VITE_API_URL;
  if (envApiUrl) return normalizeApiUrl(envApiUrl);

  if (typeof window !== 'undefined' && window.location?.origin) {
    // Use local API when running the frontend locally
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
      return normalizeApiUrl(`${window.location.origin}/api`);
    }
  }

  // Default to production API to avoid localhost calls in deployed environments
  console.warn('[AgriConnect] VITE_API_URL missing – defaulting to production API');
  return normalizeApiUrl(PRODUCTION_API_URL);
};

export const API_URL = resolveApiUrl();

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
