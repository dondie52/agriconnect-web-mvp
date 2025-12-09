const { Pool } = require('pg');
const net = require('net');
require('dotenv').config();

// Normalize Supabase pooled URLs to avoid "Tenant or user not found" errors
const normalizeDatabaseUrl = (connectionString) => {
  try {
    const url = new URL(connectionString);
    const host = url.hostname || '';

    // Supabase connection pooling endpoints (pooler.supabase.*) require the project ref
    const projectRef = process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_ID;
    const optionsParam = url.searchParams.get('options') || '';

    if (host.includes('pooler.supabase') && projectRef && !optionsParam.includes('project=')) {
      url.searchParams.set('options', `project=${projectRef}`);
    }

    // Ensure SSL is enforced when not explicitly provided
    if (host.includes('supabase') && !url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }

    return url.toString();
  } catch (error) {
    console.warn('Invalid DATABASE_URL, using raw value');
    return connectionString;
  }
};

// Force IPv4 to fix Supabase connection issues
const originalConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function(options, ...args) {
  if (typeof options === 'object' && options.host) {
    options.family = 4;
  }
  return originalConnect.call(this, options, ...args);
};

// Pool config
let poolConfig;

if (process.env.DATABASE_URL) {
  const normalizedUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
  poolConfig = {
    connectionString: normalizedUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
  console.log('📡 Using Supabase pooled connection');
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'agriconnect',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    ssl: false
  };
}

const pool = new Pool(poolConfig);

// Simple query helper
const query = (text, params) => pool.query(text, params);

// Optional client
const getClient = async () => pool.connect();

// Connection test
const testConnection = async () => {
  const res = await pool.query('SELECT NOW()');
  console.log('Connected successfully to database', res.rows[0]);
  return res.rows[0];
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};
