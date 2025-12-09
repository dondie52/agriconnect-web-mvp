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
        '⚠️ Missing SUPABASE_PROJECT_REF — skipping normalization and using raw URL',
      );
      return connectionString;
    }

    const optionsParam = url.searchParams.get('options') || '';
    if (
      host.includes('pooler.supabase') &&
      projectRef &&
      !optionsParam.includes('project=')
    ) {
      console.log('🔧 Injecting Supabase project ref into pooled URL...');
      url.searchParams.set(
        'options',
        `${optionsParam}${optionsParam ? '&' : ''}project=${projectRef}`,
      );
      return url.toString();
    }

    return connectionString;
  } catch (err) {
    console.warn('⚠️ DB URL normalization error — using raw:', err.message);
    return connectionString;
  }
}

const pool = new Pool({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => console.log('✅ Connected successfully to database'));
pool.on('error', (err) => console.error('❌ Pool error:', err.message));

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('📌 DB Time:', result.rows[0].now);
  } catch (err) {
    console.error('❌ DB test failed:', err.message);
    throw err;
  }
}

module.exports = { pool, testConnection, normalizeDatabaseUrl };
