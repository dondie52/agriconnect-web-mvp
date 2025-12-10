// Force IPv4 DNS resolution - MUST be before any network activity
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const { Pool } = require('pg');

// Log environment for debugging
console.log('🔎 DB Config Loading...');
console.log('🔎 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('🔎 SUPABASE_PROJECT_REF:', process.env.SUPABASE_PROJECT_REF);

// Lazy pool initialization - only create when first accessed
let pool = null;

function getPool() {
  if (!pool) {
    console.log('🔧 Creating database pool...');
    console.log('🔎 Full DB URL:', process.env.DATABASE_URL);
    
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      keepAlive: true,
      statement_timeout: 10000,
      connectionTimeoutMillis: 10000,
      idle_in_transaction_session_timeout: 10000,
    });

    pool.on('connect', () => console.log('✅ Pool connected to database'));
    pool.on('error', (err) => console.error('❌ Pool error:', err.message));
  }
  return pool;
}

// Test connection - this is when the actual connection happens
async function testConnection() {
  try {
    const p = getPool();
    await p.query('SELECT 1');
    console.log('✔ Database reachable');
    return true;
  } catch (err) {
    console.error('❌ DB unreachable:', err.message);
    throw err;
  }
}

// Export a proxy that lazily gets the pool
module.exports = {
  get pool() {
    return getPool();
  },
  testConnection,
  getPool,
};
