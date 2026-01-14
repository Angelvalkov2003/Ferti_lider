-- E-commerce Database Schema for Supabase
-- This script creates a simplified relational database schema for a basic online store

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Product Images Table
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
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'paid', 'shipped', 'completed', 'canceled')),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_sort_order ON product_images(product_id, sort_order);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- Optional: Create a function to validate products JSON structure
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

-- Optional: Add constraint to validate products JSON structure
ALTER TABLE orders 
ADD CONSTRAINT check_products_json 
CHECK (validate_products_json(products));

-- Add comments for documentation
COMMENT ON TABLE categories IS 'Stores product categories';
COMMENT ON TABLE products IS 'Stores products available in the online store';
COMMENT ON TABLE product_images IS 'Stores product images with ordering support. sort_order 0 = main image';
COMMENT ON TABLE orders IS 'Stores complete order information including customer details. Products are stored as JSON snapshots.';
COMMENT ON COLUMN product_images.sort_order IS '0 = main image, 1+ = secondary images';
COMMENT ON COLUMN orders.products IS 'JSON array containing product snapshot: {id, name, price, quantity}';
COMMENT ON COLUMN orders.status IS 'Order status: new, paid, shipped, completed, canceled';
