const { Pool } = require('pg');
const dns = require('dns');
require('dotenv').config();

// Normalize Supabase pooled URLs to avoid "Tenant or user not found" errors
const normalizeDatabaseUrl = (connectionString) => {
  try {
    const url = new URL(connectionString);
    const host = url.hostname || '';

    // Supabase connection pooling endpoints (pooler.supabase.*) require the project ref
    const projectRef = process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_ID;
    const optionsParam = url.searchParams.get('options') || '';

    if (host.includes('pooler.supabase') && !projectRef) {
      throw new Error(
        'Supabase pooler connections require SUPABASE_PROJECT_REF (or SUPABASE_PROJECT_ID) to be set.'
      );
    }

    if (host.includes('pooler.supabase') && projectRef && !optionsParam.includes('project=')) {
      url.searchParams.set('options', `project=${projectRef}`);
    }

    // Ensure SSL is enforced when not explicitly provided
    if (host.includes('supabase') && !url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }

    return url.toString();
  } catch (error) {
    console.error('DATABASE_URL validation failed:', error.message);
    throw error;
  }
};

// Force IPv4 DNS resolution to avoid IPv6-only hosts in environments without IPv6 egress
const lookupIPv4Only = (hostname, options, callback) => {
  const lookupOptions = typeof options === 'object' ? options : {};
  const hints = (lookupOptions.hints || 0) | dns.ADDRCONFIG | dns.V4MAPPED;

  return dns.lookup(hostname, { ...lookupOptions, family: 4, hints }, callback);
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
    lookup: lookupIPv4Only,
  };
  console.log('📡 Using Supabase pooled connection (IPv4 DNS enforced)');
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'agriconnect',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    ssl: false,
    lookup: lookupIPv4Only,
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
