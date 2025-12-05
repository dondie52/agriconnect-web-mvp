/**
 * Database Migration for AgriConnect
 * Creates all necessary tables
 */
require('dotenv').config();
const { pool } = require('../config/db');

const migrate = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...\n');

    // Begin transaction
    await client.query('BEGIN');

    // Create regions table
    console.log('Creating regions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS regions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        latitude DECIMAL(10, 7),
        longitude DECIMAL(10, 7),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create users table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer', 'buyer', 'admin')),
        region_id INTEGER REFERENCES regions(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);

    // Create crops table
    console.log('Creating crops table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS crops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create listings table
    console.log('Creating listings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        farmer_id INTEGER NOT NULL REFERENCES users(id),
        crop_id INTEGER NOT NULL REFERENCES crops(id),
        quantity DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(20) DEFAULT 'kg',
        price DECIMAL(10, 2) NOT NULL,
        region_id INTEGER NOT NULL REFERENCES regions(id),
        description TEXT,
        images JSONB DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'deleted')),
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);

    // Create orders table
    console.log('Creating orders table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER NOT NULL REFERENCES listings(id),
        buyer_id INTEGER NOT NULL REFERENCES users(id),
        farmer_id INTEGER NOT NULL REFERENCES users(id),
        quantity DECIMAL(10, 2) NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(12, 2) NOT NULL,
        delivery_preference VARCHAR(20) DEFAULT 'pickup',
        notes TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);

    // Create prices table
    console.log('Creating prices table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS prices (
        id SERIAL PRIMARY KEY,
        crop_id INTEGER NOT NULL REFERENCES crops(id),
        region_id INTEGER NOT NULL REFERENCES regions(id),
        price DECIMAL(10, 2) NOT NULL,
        previous_price DECIMAL(10, 2),
        unit VARCHAR(20) DEFAULT 'kg',
        updated_by INTEGER REFERENCES users(id),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(crop_id, region_id)
      )
    `);

    // Create buyer_requests table
    console.log('Creating buyer_requests table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS buyer_requests (
        id SERIAL PRIMARY KEY,
        buyer_id INTEGER NOT NULL REFERENCES users(id),
        crop_id INTEGER NOT NULL REFERENCES crops(id),
        quantity DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(20) DEFAULT 'kg',
        max_price DECIMAL(10, 2),
        region_id INTEGER REFERENCES regions(id),
        notes TEXT,
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'fulfilled')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);

    // Create notifications table
    console.log('Creating notifications table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        reference_id INTEGER,
        reference_type VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create crop_plans table
    console.log('Creating crop_plans table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS crop_plans (
        id SERIAL PRIMARY KEY,
        farmer_id INTEGER NOT NULL REFERENCES users(id),
        crop_id INTEGER NOT NULL REFERENCES crops(id),
        season VARCHAR(20) NOT NULL CHECK (season IN ('summer', 'winter', 'autumn', 'spring')),
        year INTEGER NOT NULL,
        planned_quantity DECIMAL(10, 2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP,
        UNIQUE(farmer_id, crop_id, season, year)
      )
    `);

    // Create analytics_events table
    console.log('Creating analytics_events table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER NOT NULL REFERENCES listings(id),
        viewer_id INTEGER REFERENCES users(id),
        event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('view', 'contact', 'order')),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for performance
    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_listings_farmer ON listings(farmer_id);
      CREATE INDEX IF NOT EXISTS idx_listings_crop ON listings(crop_id);
      CREATE INDEX IF NOT EXISTS idx_listings_region ON listings(region_id);
      CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
      CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_farmer ON orders(farmer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_prices_crop_region ON prices(crop_id, region_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
      CREATE INDEX IF NOT EXISTS idx_analytics_listing ON analytics_events(listing_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_events(created_at);
    `);

    // Commit transaction
    await client.query('COMMIT');
    
    console.log('\n✅ Database migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run migration
migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
