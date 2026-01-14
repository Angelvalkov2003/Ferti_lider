-- Migration: Update order statuses to include new statuses
-- Run this in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add new constraint with updated statuses
ALTER TABLE orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('new', 'confirmed', 'shipped', 'paid', 'completed', 'canceled'));

-- Update existing statuses if needed (optional - only if you want to migrate old data)
-- UPDATE orders SET status = 'confirmed' WHERE status = 'paid' AND ...; -- Add your migration logic if needed

COMMENT ON COLUMN orders.status IS 'Order status: new (Нова), confirmed (Потвърждение с клиент), shipped (Изпратена пратка), paid (Платена пратка), completed (Финализирано), canceled (Отменена)';
