/**
 * API Configuration for AgriConnect Frontend
 * Strict environment variable configuration using Vite's import.meta.env
 */

/**
 * Get required environment variable or throw error
 * @param {string} key - Environment variable key
 * @returns {string} - Environment variable value
 */
function getEnvVar(key) {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// API URL - required
export const API_URL = getEnvVar('VITE_API_URL');

// Upload URL - derived from API_URL if not set
export const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || API_URL.replace('/api', '/uploads');

// Base URL without /api suffix (for WebSocket connections)
export const API_BASE_URL = API_URL.replace('/api', '');

// WebSocket URL for live price updates
export const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/live/prices';

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    API_URL,
    UPLOAD_URL,
    API_BASE_URL,
    WS_URL,
  });
}
