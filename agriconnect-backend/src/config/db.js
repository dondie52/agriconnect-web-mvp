/**
 * Database Configuration for AgriConnect
 * Uses PostgreSQL with connection pooling
 * Supports both DATABASE_URL (Supabase) and individual DB_* variables
 */

const { Pool } = require('pg');
const net = require('net');
require('dotenv').config();

// Force IPv4 connections to fix Supabase IPv6 issues
const originalConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function(options, ...args) {
  if (typeof options === 'object' && options.host) {
    options.family = 4; // Force IPv4
  }
  return originalConnect.call(this, options, ...args);
};

// Build pool configuration
// Prefer DATABASE_URL for Supabase/production, fall back to individual vars for local dev
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL connection string (Supabase)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
  console.log('📡 Using DATABASE_URL for connection (Supabase mode)');
} else {
  // Fall back to individual environment variables (local development)
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'agriconnect',
    user: process.env.DB_USER || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };

  // Only add password if it's set and not empty
  if (process.env.DB_PASS && process.env.DB_PASS.trim() !== '') {
    poolConfig.password = process.env.DB_PASS;
  }
  console.log('📡 Using individual DB_* variables for connection (local mode)');
}

const pool = new Pool(poolConfig);

// Log successful connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err.message);
  console.error('Error details:', {
    code: err.code,
    errno: err.errno,
    syscall: err.syscall,
    hostname: err.hostname
  });
  process.exit(-1);
});

// Query helper with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

// Transaction helper
const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Override release to track released status
  let released = false;
  client.release = () => {
    if (released) return;
    released = true;
    return release();
  };
  
  return client;
};

// Test connection function (for startup and manual testing)
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection test successful');
    console.log('📅 Server time:', result.rows[0].now);
    return { success: true, time: result.rows[0].now };
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};
