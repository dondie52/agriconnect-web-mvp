/**
 * Test utility to check API connection
 * Run this in browser console or as a standalone script
 * Usage: import('./test/checkApi.js') or require('./test/checkApi.js')
 */
import { API_URL } from '../config/api.js';

fetch(API_URL + "/health")
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
