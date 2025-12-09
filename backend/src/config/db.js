require('dotenv').config();
const { Pool } = require('pg');

function normalizeUrl(url) {
  return url?.replace('postgresql://', 'postgres://');
}

const databaseUrl = normalizeUrl(process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: databaseUrl,
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

module.exports = { pool, testConnection };
