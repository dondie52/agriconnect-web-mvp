-- =====================================================
-- AgriConnect Botswana - PostgreSQL Database Schema
-- Version: 1.0.0
-- Description: Complete database schema for the AgriConnect platform
-- =====================================================

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS crop_plans CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS buyer_requests CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS crops CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

-- =====================================================
-- REGIONS TABLE
-- Stores Botswana districts/regions
-- =====================================================
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE regions IS 'Geographic regions (districts) of Botswana';

-- =====================================================
-- USERS TABLE
-- Stores all users: farmers, buyers, admins
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer', 'buyer', 'admin')),
    region_id INTEGER REFERENCES regions(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

COMMENT ON TABLE users IS 'User accounts including farmers, buyers, and administrators';
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_region ON users(region_id);

-- =====================================================
-- CROPS TABLE
-- Stores crop/produce types
-- =====================================================
CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE crops IS 'Types of crops/produce available on the platform';
CREATE INDEX idx_crops_category ON crops(category);

-- =====================================================
-- LISTINGS TABLE
-- Farmer produce listings
-- =====================================================
CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id INTEGER NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) DEFAULT 'kg' CHECK (unit IN ('kg', 'ton', 'bag', 'crate', 'bunch')),
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    region_id INTEGER NOT NULL REFERENCES regions(id) ON DELETE RESTRICT,
    description TEXT,
    images JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'deleted')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

COMMENT ON TABLE listings IS 'Produce listings created by farmers';
CREATE INDEX idx_listings_farmer ON listings(farmer_id);
CREATE INDEX idx_listings_crop ON listings(crop_id);
CREATE INDEX idx_listings_region ON listings(region_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created ON listings(created_at DESC);

-- =====================================================
-- CART_ITEMS TABLE
-- Shopping cart items for buyers
-- =====================================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

COMMENT ON TABLE cart_items IS 'Shopping cart items for buyers before checkout';
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_cart_items_listing ON cart_items(listing_id);

-- =====================================================
-- ORDERS TABLE
-- Orders placed by buyers (created during checkout)
-- Enhanced with delivery location, phone, and fee tracking
-- =====================================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Pricing fields
    total_price DECIMAL(12, 2) NOT NULL,                -- Items total (for backward compatibility)
    total_amount DECIMAL(12, 2),                         -- Final total (items + delivery fee)
    delivery_fee DECIMAL(10, 2) DEFAULT 0,              -- Delivery fee based on distance
    
    -- Delivery preference (backward compatibility)
    delivery_preference VARCHAR(20) DEFAULT 'pickup' CHECK (delivery_preference IN ('pickup', 'delivery')),
    delivery_address TEXT,                               -- Legacy address field
    
    -- Enhanced delivery fields
    delivery_type VARCHAR(20) DEFAULT 'pickup' CHECK (delivery_type IN ('pickup', 'delivery')),
    address_text TEXT,                                   -- Full delivery address as text
    latitude DECIMAL(10, 8) CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
    longitude DECIMAL(11, 8) CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
    
    -- Contact information
    phone_number VARCHAR(20),                            -- Contact phone for the order
    
    -- Order details
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

COMMENT ON TABLE orders IS 'Orders placed by buyers during checkout with enhanced delivery tracking';
COMMENT ON COLUMN orders.total_price IS 'Items subtotal (for backward compatibility)';
COMMENT ON COLUMN orders.total_amount IS 'Final total including items and delivery fee';
COMMENT ON COLUMN orders.delivery_fee IS 'Delivery fee calculated based on distance';
COMMENT ON COLUMN orders.delivery_type IS 'Type of delivery: pickup or delivery';
COMMENT ON COLUMN orders.address_text IS 'Full delivery address as text';
COMMENT ON COLUMN orders.latitude IS 'Latitude coordinate for delivery location';
COMMENT ON COLUMN orders.longitude IS 'Longitude coordinate for delivery location';
COMMENT ON COLUMN orders.phone_number IS 'Contact phone number for the order';

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_delivery_type ON orders(delivery_type);

-- =====================================================
-- ORDER_ITEMS TABLE
-- Individual items within an order
-- =====================================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE order_items IS 'Individual line items within an order';
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_listing ON order_items(listing_id);
CREATE INDEX idx_order_items_farmer ON order_items(farmer_id);

-- =====================================================
-- PRICES TABLE
-- Market prices for crops by region
-- =====================================================
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    region_id INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    previous_price DECIMAL(10, 2),
    unit VARCHAR(20) DEFAULT 'kg',
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(crop_id, region_id)
);

COMMENT ON TABLE prices IS 'Market prices for crops in each region';
CREATE INDEX idx_prices_crop ON prices(crop_id);
CREATE INDEX idx_prices_region ON prices(region_id);

-- =====================================================
-- BUYER_REQUESTS TABLE
-- Buyer produce requests
-- =====================================================
CREATE TABLE buyer_requests (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id INTEGER NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20) DEFAULT 'kg',
    max_price DECIMAL(10, 2),
    region_id INTEGER REFERENCES regions(id) ON DELETE SET NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'fulfilled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

COMMENT ON TABLE buyer_requests IS 'Product requests from buyers looking for specific produce';
CREATE INDEX idx_requests_buyer ON buyer_requests(buyer_id);
CREATE INDEX idx_requests_crop ON buyer_requests(crop_id);
CREATE INDEX idx_requests_region ON buyer_requests(region_id);
CREATE INDEX idx_requests_status ON buyer_requests(status);

-- =====================================================
-- NOTIFICATIONS TABLE
-- User notifications
-- =====================================================
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_id INTEGER,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'Notifications sent to users';
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- CROP_PLANS TABLE
-- Farmer crop planning data
-- =====================================================
CREATE TABLE crop_plans (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id INTEGER NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    season VARCHAR(20) NOT NULL CHECK (season IN ('summer', 'winter', 'autumn', 'spring')),
    year INTEGER NOT NULL,
    planned_quantity DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    UNIQUE(farmer_id, crop_id, season, year)
);

COMMENT ON TABLE crop_plans IS 'Crop planning data from farmers for coordination';
CREATE INDEX idx_cropplans_farmer ON crop_plans(farmer_id);
CREATE INDEX idx_cropplans_crop ON crop_plans(crop_id);
CREATE INDEX idx_cropplans_season ON crop_plans(season, year);

-- =====================================================
-- ANALYTICS_EVENTS TABLE
-- Tracking views, clicks, and interactions
-- =====================================================
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    viewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('view', 'contact', 'order')),
    created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE analytics_events IS 'Analytics events for tracking listing performance';
CREATE INDEX idx_analytics_listing ON analytics_events(listing_id);
CREATE INDEX idx_analytics_viewer ON analytics_events(viewer_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);

-- =====================================================
-- SEED DATA - Regions (Botswana Districts)
-- =====================================================
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
    ('Chobe', -18.3667, 25.1500);

-- =====================================================
-- SEED DATA - Crops
-- =====================================================
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
    ('Cotton', 'Cash Crop', 'Fiber crop');

-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

-- Active listings with full details
CREATE OR REPLACE VIEW v_active_listings AS
SELECT 
    l.id,
    l.quantity,
    l.unit,
    l.price,
    l.description,
    l.images,
    l.views,
    l.created_at,
    c.name as crop_name,
    c.category as crop_category,
    r.name as region_name,
    u.name as farmer_name,
    u.phone as farmer_phone
FROM listings l
JOIN crops c ON l.crop_id = c.id
JOIN regions r ON l.region_id = r.id
JOIN users u ON l.farmer_id = u.id
WHERE l.status = 'active';

-- Market prices with change percentage
CREATE OR REPLACE VIEW v_market_prices AS
SELECT 
    p.id,
    p.price,
    p.previous_price,
    p.unit,
    p.updated_at,
    c.name as crop_name,
    c.category as crop_category,
    r.name as region_name,
    CASE 
        WHEN p.previous_price IS NOT NULL AND p.previous_price > 0 
        THEN ROUND(((p.price - p.previous_price) / p.previous_price * 100)::numeric, 2)
        ELSE 0 
    END as price_change_percent
FROM prices p
JOIN crops c ON p.crop_id = c.id
JOIN regions r ON p.region_id = r.id
ORDER BY c.name, r.name;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
