/**
 * Test utility to check API connection
 * Run this in browser console or as a standalone script
 */
fetch(import.meta.env.VITE_API_URL + "/health")
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
