/**
 * Database Seed for AgriConnect
 * Populates database with initial data
 */
require('dotenv').config();
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const seed = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...\n');

    await client.query('BEGIN');

    // Seed Regions (Botswana Districts)
    console.log('Seeding regions...');
    await client.query(`
      INSERT INTO regions (name, latitude, longitude) VALUES
      ('Gaborone', -24.6282, 25.9231),
      ('Francistown', -21.1661, 27.5144),
      ('Molepolole', -24.4064, 25.4950),
      ('Serowe', -22.3908, 26.7139),
      ('Maun', -20.0000, 23.4167),
      ('Kgatleng', -24.4389, 26.1639),
      ('Kweneng', -24.1844, 25.3225),
      ('Central', -22.3333, 27.1333),
      ('North-East', -21.0167, 27.4833),
      ('North-West', -19.9667, 25.2833),
      ('Southern', -25.0500, 25.5000),
      ('South-East', -24.8167, 25.9500),
      ('Chobe', -18.3667, 25.1500)
      ON CONFLICT (name) DO NOTHING
    `);

    // Seed Crops (Botswana common crops)
    console.log('Seeding crops...');
    await client.query(`
      INSERT INTO crops (name, category, description) VALUES
      ('Maize', 'Grain', 'Main staple crop in Botswana'),
      ('Sorghum', 'Grain', 'Drought-resistant grain crop'),
      ('Millet', 'Grain', 'Traditional grain crop'),
      ('Cowpeas', 'Legume', 'Protein-rich legume'),
      ('Groundnuts', 'Legume', 'Popular legume crop'),
      ('Beans', 'Legume', 'Common legume variety'),
      ('Tomatoes', 'Vegetable', 'Fresh market vegetable'),
      ('Onions', 'Vegetable', 'Essential cooking vegetable'),
      ('Cabbage', 'Vegetable', 'Leafy green vegetable'),
      ('Spinach', 'Vegetable', 'Nutritious leafy green'),
      ('Carrots', 'Vegetable', 'Root vegetable'),
      ('Potatoes', 'Vegetable', 'Tuberous crop'),
      ('Butternut', 'Vegetable', 'Popular squash variety'),
      ('Green Pepper', 'Vegetable', 'Bell pepper variety'),
      ('Watermelon', 'Fruit', 'Sweet melon variety'),
      ('Oranges', 'Fruit', 'Citrus fruit'),
      ('Mangoes', 'Fruit', 'Tropical fruit'),
      ('Pawpaw', 'Fruit', 'Papaya fruit'),
      ('Sunflower', 'Oil Crop', 'Oilseed crop'),
      ('Cotton', 'Cash Crop', 'Fiber crop')
      ON CONFLICT (name) DO NOTHING
    `);

    // Create admin user
    console.log('Creating admin user...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    await client.query(`
      INSERT INTO users (name, email, phone, password, role, region_id, is_active)
      VALUES ('Admin User', 'admin@agriconnect.bw', '26712345678', $1, 'admin', 1, true)
      ON CONFLICT (phone) DO NOTHING
    `, [hashedAdminPassword]);

    // Create sample farmer
    console.log('Creating sample farmer...');
    const hashedFarmerPassword = await bcrypt.hash('farmer123', 12);
    await client.query(`
      INSERT INTO users (name, email, phone, password, role, region_id, is_active)
      VALUES ('John Mosweu', 'john@example.com', '26776543210', $1, 'farmer', 6, true)
      ON CONFLICT (phone) DO NOTHING
    `, [hashedFarmerPassword]);

    // Create sample buyer
    console.log('Creating sample buyer...');
    const hashedBuyerPassword = await bcrypt.hash('buyer123', 12);
    await client.query(`
      INSERT INTO users (name, email, phone, password, role, region_id, is_active)
      VALUES ('Fresh Mart', 'freshmart@example.com', '26774567890', $1, 'buyer', 1, true)
      ON CONFLICT (phone) DO NOTHING
    `, [hashedBuyerPassword]);

    // Get IDs for foreign keys
    const farmerResult = await client.query(`SELECT id FROM users WHERE phone = '26776543210'`);
    const farmerId = farmerResult.rows[0]?.id;

    if (farmerId) {
      // Create sample listings
      console.log('Creating sample listings...');
      await client.query(`
        INSERT INTO listings (farmer_id, crop_id, quantity, unit, price, region_id, description, status) VALUES
        ($1, 7, 500, 'kg', 8.50, 6, 'Fresh organic tomatoes from my farm. Picked daily.', 'active'),
        ($1, 8, 200, 'kg', 6.00, 6, 'Quality onions, stored properly.', 'active'),
        ($1, 9, 150, 'kg', 5.00, 6, 'Fresh cabbage heads, pesticide-free.', 'active'),
        ($1, 1, 1000, 'kg', 3.50, 6, 'Dried maize grain, good for milling.', 'active'),
        ($1, 4, 300, 'kg', 12.00, 6, 'Locally grown cowpeas, rich in protein.', 'active')
        ON CONFLICT DO NOTHING
      `, [farmerId]);
    }

    // Seed market prices
    console.log('Seeding market prices...');
    await client.query(`
      INSERT INTO prices (crop_id, region_id, price, unit) VALUES
      (1, 1, 3.50, 'kg'),
      (1, 2, 3.20, 'kg'),
      (1, 6, 3.00, 'kg'),
      (2, 1, 4.00, 'kg'),
      (2, 6, 3.80, 'kg'),
      (4, 1, 12.00, 'kg'),
      (4, 6, 11.50, 'kg'),
      (5, 1, 15.00, 'kg'),
      (7, 1, 10.00, 'kg'),
      (7, 2, 9.50, 'kg'),
      (7, 6, 8.00, 'kg'),
      (8, 1, 7.00, 'kg'),
      (8, 6, 6.00, 'kg'),
      (9, 1, 6.00, 'kg'),
      (9, 6, 5.00, 'kg'),
      (10, 1, 8.00, 'kg'),
      (12, 1, 9.00, 'kg'),
      (13, 1, 7.50, 'kg'),
      (15, 1, 5.00, 'kg')
      ON CONFLICT (crop_id, region_id) DO UPDATE SET price = EXCLUDED.price
    `);

    await client.query('COMMIT');
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:  26712345678 / admin123');
    console.log('Farmer: 26776543210 / farmer123');
    console.log('Buyer:  26774567890 / buyer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run seed
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
