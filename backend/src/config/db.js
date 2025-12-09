require('dotenv').config();
const { Pool } = require('pg');
const dns = require('dns');

// ---- Normalize Supabase pooled URLs ----
const normalizeDatabaseUrl = (connectionString) => {
  try {
    const url = new URL(connectionString);
    const host = url.hostname || '';

    const projectRef =
      process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_ID;

    const optionsParam = url.searchParams.get('options') || '';

    // Validate pooled connection requirement
    if (host.includes('pooler.supabase') && !projectRef) {
      throw new Error(
        'Supabase pooler connections require SUPABASE_PROJECT_REF (or SUPABASE_PROJECT_ID) to be set.'
      );
    }

    // Inject project reference into pooled connections
    if (host.includes('pooler.supabase') && projectRef && !optionsParam.includes('project=')) {
      url.searchParams.set('options', `project=${projectRef}`);
    }

    // Ensure SSL when connecting to Supabase
    if (host.includes('supabase') && !url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }

    return url.toString();
  } catch (error) {
    console.error('DATABASE_URL validation failed:', error.message);
    throw error;
  }
};

// ---- Force IPv4 so Supabase doesn't choke ----
const enforceIPv4Lookup = (hostnameToForce) => {
  if (!hostnameToForce) return () => {};

  const originalLookup = dns.lookup;

  dns.lookup = (hostname, options, callback) => {
    const shouldForce = hostname === hostnameToForce;

    if (!shouldForce) {
      return originalLookup(hostname, options, callback);
    }

    const callbackFn = typeof options === 'function' ? options : callback;
    const lookupOptions = typeof options === 'object' && options !== null ? options : {};
    const hints = (lookupOptions.hints || 0) | dns.ADDRCONFIG | dns.V4MAPPED;

    return originalLookup(
      hostname,
      {
        ...lookupOptions,
        family: 4,
        hints,
      },
      callbackFn
    );
  };

  return () => {
    dns.lookup = originalLookup;
  };
};

// ----------------------------------
// Build PG pool config
// ----------------------------------
let poolConfig = {};
let restoreLookup;

if (process.env.DATABASE_URL) {
  const normalizedUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
  const url = new URL(normalizedUrl);

  restoreLookup = enforceIPv4Lookup(url.hostname);

  poolConfig = {
    connectionString: normalizedUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  console.log('📡 Using Supabase pooled connection (IPv4 enforced)');
} else {
  const host = process.env.DB_HOST || 'localhost';
  restoreLookup = enforceIPv4Lookup(host);

  poolConfig = {
    host,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'agriconnect',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    ssl: false,
  };

  console.log('📌 Using local DB config');
}

const pool = new Pool(poolConfig);

// ----------------------------------
// Logging
// ----------------------------------
pool.on('connect', () => {
  console.log('✅ Connected successfully to database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection pool error:', err);
});

// ----------------------------------
// Test Function
// ----------------------------------
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('📌 DB Time:', result.rows[0].now);
  } catch (err) {
    console.error('❌ DB test failed:', err.message);
    throw err;
  }
};

module.exports = { pool, testConnection };
