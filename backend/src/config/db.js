const { Pool } = require('pg');
const net = require('net');
require('dotenv').config();

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
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
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
