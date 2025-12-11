-- =====================================================
-- Migration: Add Cart + Checkout System
-- Description: Adds cart_items and order_items tables
-- Run this on existing databases to add cart functionality
-- =====================================================

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_listing ON cart_items(listing_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_listing ON order_items(listing_id);
CREATE INDEX IF NOT EXISTS idx_order_items_farmer ON order_items(farmer_id);

-- Add delivery_address column to orders if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'delivery_address'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_address TEXT;
    END IF;
END $$;

-- Migration complete message
DO $$
BEGIN
    RAISE NOTICE 'Migration 001_add_cart_system completed successfully!';
END $$;
