/**
 * Test utility to check API connection
 * Run this in browser console or as a standalone script
 * Usage: import('./test/checkApi.js') or require('./test/checkApi.js')
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

fetch(API_URL + "/health")
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
