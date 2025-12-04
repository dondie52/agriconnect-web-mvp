/**
 * Manual Database Connection Test Script
 * Run with: node test-db.js
 * 
 * Tests connection to PostgreSQL database using DATABASE_URL or individual DB_* variables
 */
const { pool } = require('./src/config/db');

async function testConnection() {
  console.log('🔄 Attempting to connect...\n');
  
  try {
    // Test basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Connected successfully\n');
    
    // Get PostgreSQL version
    const versionResult = await pool.query('SELECT version()');
    const version = versionResult.rows[0].version;
    console.log(`PostgreSQL version: ${version}\n`);
    
    // List tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Tables:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('  (No tables found - you may need to run migrations)');
    }
    
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection failed\n');
    console.error('Error Details:');
    console.error(`  message: ${error.message}`);
    if (error.code) {
      console.error(`  code: ${error.code}`);
    }
    console.error(`  stack: ${error.stack}`);
    
    await pool.end();
    process.exit(1);
  }
}

testConnection();
