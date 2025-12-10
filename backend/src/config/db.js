const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const { Pool } = require('pg');

function normalizeDatabaseUrl(connectionString = process.env.DATABASE_URL) {
  try {
    console.log('🔎 Loaded DB URL:', connectionString);
    console.log('🔎 SUPABASE_PROJECT_REF:', process.env.SUPABASE_PROJECT_REF);
    console.log('🔎 SUPABASE_PROJECT_ID:', process.env.SUPABASE_PROJECT_ID);

    if (!connectionString) {
      console.warn('⚠️ No DATABASE_URL provided — returning undefined');
      return undefined;
    }

    const url = new URL(connectionString);
    const host = url.hostname;
    const projectRef =
      process.env.SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_ID;

    if (host.includes('pooler.supabase') && !projectRef) {
      console.warn(
        '⚠️ Missing Supabase project ref — using raw connection string',
      );
      return connectionString;
    }

    return connectionString;
  } catch (err) {
    console.warn('⚠️ DB URL normalization error — using raw:', err.message);
    return connectionString;
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  statement_timeout: 10000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => console.log('✅ Connected successfully to database'));
pool.on('error', (err) => console.error('❌ Pool error:', err.message));

function testConnection() {
  return pool
    .query('SELECT 1')
    .then(() => {
      console.log('✔ Database reachable');
    })
    .catch((err) => {
      console.error('❌ DB unreachable:', err.message);
      throw err;
    });
}

module.exports = { pool, testConnection, normalizeDatabaseUrl };
