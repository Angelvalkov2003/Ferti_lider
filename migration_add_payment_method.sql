-- Migration: Add payment_method column to orders table
-- Run this in Supabase SQL Editor if you already have the orders table

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) NOT NULL DEFAULT 'cash_on_delivery' 
CHECK (payment_method IN ('cash_on_delivery', 'card'));

COMMENT ON COLUMN orders.payment_method IS 'Payment method: cash_on_delivery (наложен платеж) or card (плащане с карта)';
