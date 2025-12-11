-- Migration: Add delivery fields to orders table
-- Date: 2024
-- Description: Adds fields for enhanced delivery checkout including address, coordinates, phone, and fee

-- Add new columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS address_text TEXT,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS delivery_type VARCHAR(20) DEFAULT 'pickup',
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2);

-- Add CHECK constraint for delivery_type
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_delivery_type_check;

ALTER TABLE orders
ADD CONSTRAINT orders_delivery_type_check
CHECK (delivery_type IN ('pickup', 'delivery'));

-- Add CHECK constraint for latitude (valid range -90 to 90)
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_latitude_check;

ALTER TABLE orders
ADD CONSTRAINT orders_latitude_check
CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));

-- Add CHECK constraint for longitude (valid range -180 to 180)
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_longitude_check;

ALTER TABLE orders
ADD CONSTRAINT orders_longitude_check
CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));

-- Add CHECK constraint for delivery_fee (must be non-negative)
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_delivery_fee_check;

ALTER TABLE orders
ADD CONSTRAINT orders_delivery_fee_check
CHECK (delivery_fee >= 0);

-- Add CHECK constraint for total_amount (must be positive)
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_total_amount_check;

ALTER TABLE orders
ADD CONSTRAINT orders_total_amount_check
CHECK (total_amount IS NULL OR total_amount > 0);

-- Update existing records to set total_amount = total_price where not set
UPDATE orders
SET total_amount = total_price
WHERE total_amount IS NULL;

-- Update existing records to set delivery_type based on delivery_preference
UPDATE orders
SET delivery_type = COALESCE(delivery_preference, 'pickup')
WHERE delivery_type IS NULL;

-- Create index for delivery_type for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_delivery_type ON orders(delivery_type);

-- Add comments for documentation
COMMENT ON COLUMN orders.address_text IS 'Full delivery address as text';
COMMENT ON COLUMN orders.latitude IS 'Latitude coordinate for delivery location';
COMMENT ON COLUMN orders.longitude IS 'Longitude coordinate for delivery location';
COMMENT ON COLUMN orders.phone_number IS 'Contact phone number for the order';
COMMENT ON COLUMN orders.delivery_type IS 'Type of delivery: pickup or delivery';
COMMENT ON COLUMN orders.delivery_fee IS 'Delivery fee calculated based on distance';
COMMENT ON COLUMN orders.total_amount IS 'Total order amount including items and delivery fee';
