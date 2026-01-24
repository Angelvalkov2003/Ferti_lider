-- Final E-commerce Database Schema for Supabase
-- Clean schema without carts/cart_items - cart is stored locally in browser
-- Run this in Supabase SQL Editor

-- ⚠️ WARNING: This will DELETE all existing data!
-- Make sure you have a backup if you have important data

-- Drop all existing tables (in correct order to handle foreign keys)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS validate_products_json(JSONB) CASCADE;

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Collections Table (used for product categories/collections)
-- This is the ONLY table for categorizing products
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2),
    featured_image JSONB,
    images JSONB[] DEFAULT '{}',
    category TEXT, -- This references collections by handle or can be collection title
    available BOOLEAN DEFAULT true,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Product Images Table (optional - for additional product images)
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_product_sort_order UNIQUE (product_id, sort_order)
);

-- 4. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_address TEXT NOT NULL,
    -- Order Information
    products JSONB NOT NULL, -- Array of product snapshots: [{id, name, price, quantity}, ...]
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'cash_on_delivery' CHECK (payment_method IN ('cash_on_delivery', 'card')),
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'paid', 'completed', 'canceled')),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_products_handle ON products(handle);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_position ON products(position);
CREATE INDEX idx_collections_handle ON collections(handle);
CREATE INDEX idx_collections_position ON collections(position);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_sort_order ON product_images(product_id, sort_order);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_updated_at ON orders(updated_at DESC);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Function to validate products JSON structure in orders
CREATE OR REPLACE FUNCTION validate_products_json(products_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if it's an array
    IF jsonb_typeof(products_data) != 'array' THEN
        RETURN FALSE;
    END IF;
    
    -- Check if each element has required fields
    RETURN (
        SELECT bool_and(
            elem ? 'id' AND 
            elem ? 'name' AND 
            elem ? 'price' AND 
            elem ? 'quantity' AND
            (elem->>'quantity')::INTEGER > 0
        )
        FROM jsonb_array_elements(products_data) AS elem
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add constraint to validate products JSON structure
ALTER TABLE orders 
ADD CONSTRAINT check_products_json 
CHECK (validate_products_json(products));

-- Add comments for documentation
COMMENT ON TABLE collections IS 'Stores product collections/categories - this is the ONLY table for categorizing products';
COMMENT ON TABLE products IS 'Stores products available in the online store';
COMMENT ON TABLE product_images IS 'Stores product images with ordering support. sort_order 0 = main image';
COMMENT ON TABLE orders IS 'Stores complete order information including customer details. Products are stored as JSON snapshots. Cart is stored locally in browser (localStorage/cookies), not in database.';
COMMENT ON COLUMN product_images.sort_order IS '0 = main image, 1+ = secondary images';
COMMENT ON COLUMN orders.products IS 'JSON array containing product snapshot: {id, name, price, quantity}';
COMMENT ON COLUMN orders.status IS 'Order status: new, paid, shipped, completed, canceled';
COMMENT ON COLUMN products.category IS 'Category/collection name - can reference collections table by handle or title';
