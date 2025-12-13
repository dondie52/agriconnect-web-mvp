-- =====================================================
-- Migration: Add Livestock Tracking System
-- Description: Adds livestock and livestock_events tables
-- Run this on existing databases to add livestock tracking functionality
-- =====================================================

-- Create livestock table
CREATE TABLE IF NOT EXISTS livestock (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('cattle', 'goat', 'sheep', 'chicken', 'pig', 'donkey', 'horse', 'other')),
    breed VARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'unknown')),
    age_months INTEGER CHECK (age_months >= 0),
    weight_kg DECIMAL(8, 2) CHECK (weight_kg > 0),
    tag_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'healthy' CHECK (status IN ('healthy', 'sick', 'sold', 'deceased')),
    location VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Create indexes for livestock table
CREATE INDEX IF NOT EXISTS idx_livestock_farmer ON livestock(farmer_id);
CREATE INDEX IF NOT EXISTS idx_livestock_type ON livestock(type);
CREATE INDEX IF NOT EXISTS idx_livestock_status ON livestock(status);
CREATE INDEX IF NOT EXISTS idx_livestock_tag ON livestock(tag_number);

COMMENT ON TABLE livestock IS 'Livestock records for farmers to track their animals';

-- Create livestock_events table for health/event tracking
CREATE TABLE IF NOT EXISTS livestock_events (
    id SERIAL PRIMARY KEY,
    livestock_id INTEGER NOT NULL REFERENCES livestock(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('vaccination', 'illness', 'treatment', 'sale', 'death', 'weight_update', 'breeding', 'birth', 'other')),
    description TEXT,
    event_date DATE DEFAULT CURRENT_DATE,
    recorded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for livestock_events table
CREATE INDEX IF NOT EXISTS idx_livestock_events_livestock ON livestock_events(livestock_id);
CREATE INDEX IF NOT EXISTS idx_livestock_events_type ON livestock_events(event_type);
CREATE INDEX IF NOT EXISTS idx_livestock_events_date ON livestock_events(event_date DESC);

COMMENT ON TABLE livestock_events IS 'Health and lifecycle events for livestock tracking';

-- Migration complete message
DO $$
BEGIN
    RAISE NOTICE 'Migration 003_add_livestock_tracking completed successfully!';
END $$;
