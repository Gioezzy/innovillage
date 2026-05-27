-- Migration: Add marketplace checkout fields to orders table
-- Task 1.2: Create and execute database migration for orders table
-- Requirements: 3.1, 3.2, 3.6, 3.8, 7.1
-- 
-- INSTRUCTIONS: Run this SQL in Supabase SQL Editor
-- This migration is idempotent (safe to run multiple times)

-- Add marketplace-related columns to orders table
DO $$ 
BEGIN
  -- Add marketplace_platform column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'marketplace_platform'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN marketplace_platform TEXT;
    RAISE NOTICE 'Added marketplace_platform column to orders table';
  ELSE
    RAISE NOTICE 'marketplace_platform column already exists';
  END IF;
  
  -- Add shipping_address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'orders' 
    AND column_name = 'shipping_address'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN shipping_address TEXT;
    RAISE NOTICE 'Added shipping_address column to orders table';
  ELSE
    RAISE NOTICE 'shipping_address column already exists';
  END IF;
  
  -- Add shipping_cost column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'orders' 
    AND column_name = 'shipping_cost'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN shipping_cost NUMERIC(10,2) DEFAULT 0;
    RAISE NOTICE 'Added shipping_cost column to orders table';
  ELSE
    RAISE NOTICE 'shipping_cost column already exists';
  END IF;
  
  -- Add platform_fee column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'orders' 
    AND column_name = 'platform_fee'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN platform_fee NUMERIC(10,2) DEFAULT 0;
    RAISE NOTICE 'Added platform_fee column to orders table';
  ELSE
    RAISE NOTICE 'platform_fee column already exists';
  END IF;
  
  -- Add net_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'orders' 
    AND column_name = 'net_amount'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN net_amount NUMERIC(10,2);
    RAISE NOTICE 'Added net_amount column to orders table';
  ELSE
    RAISE NOTICE 'net_amount column already exists';
  END IF;
END $$;

-- Add check constraints for data validation
DO $$
BEGIN
  -- Marketplace platform constraint (only allow specific values)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'marketplace_platform_values'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT marketplace_platform_values 
      CHECK (marketplace_platform IS NULL OR marketplace_platform IN ('Shopee', 'Tokopedia', 'PadiUMKM'));
    RAISE NOTICE 'Added marketplace_platform_values constraint';
  ELSE
    RAISE NOTICE 'marketplace_platform_values constraint already exists';
  END IF;
  
  -- Shipping address length constraint (max 500 characters)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'shipping_address_length'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT shipping_address_length 
      CHECK (shipping_address IS NULL OR length(shipping_address) <= 500);
    RAISE NOTICE 'Added shipping_address_length constraint';
  ELSE
    RAISE NOTICE 'shipping_address_length constraint already exists';
  END IF;
  
  -- Shipping cost must be non-negative
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'shipping_cost_non_negative'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT shipping_cost_non_negative 
      CHECK (shipping_cost >= 0);
    RAISE NOTICE 'Added shipping_cost_non_negative constraint';
  ELSE
    RAISE NOTICE 'shipping_cost_non_negative constraint already exists';
  END IF;
  
  -- Platform fee must be non-negative
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'platform_fee_non_negative'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT platform_fee_non_negative 
      CHECK (platform_fee >= 0);
    RAISE NOTICE 'Added platform_fee_non_negative constraint';
  ELSE
    RAISE NOTICE 'platform_fee_non_negative constraint already exists';
  END IF;
END $$;

-- Add new enum values to order_status type
DO $$
BEGIN
  -- Check if 'marketplace_redirect' value exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'marketplace_redirect' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
  ) THEN
    ALTER TYPE order_status ADD VALUE 'marketplace_redirect';
    RAISE NOTICE 'Added marketplace_redirect to order_status enum';
  ELSE
    RAISE NOTICE 'marketplace_redirect already exists in order_status enum';
  END IF;
  
  -- Check if 'confirmed' value exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'confirmed' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
  ) THEN
    ALTER TYPE order_status ADD VALUE 'confirmed';
    RAISE NOTICE 'Added confirmed to order_status enum';
  ELSE
    RAISE NOTICE 'confirmed already exists in order_status enum';
  END IF;
END $$;

-- Create index for marketplace order queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_orders_marketplace 
  ON public.orders(marketplace_platform, status) 
  WHERE marketplace_platform IS NOT NULL;

-- Create index for order status queries
CREATE INDEX IF NOT EXISTS idx_orders_status 
  ON public.orders(status, created_at DESC);

-- Add comments for documentation
COMMENT ON COLUMN public.orders.marketplace_platform IS 'Marketplace platform used for checkout (Shopee, Tokopedia, or PadiUMKM)';
COMMENT ON COLUMN public.orders.shipping_address IS 'Customer shipping address for delivery orders (max 500 characters)';
COMMENT ON COLUMN public.orders.shipping_cost IS 'Estimated shipping cost in IDR (actual cost determined by marketplace)';
COMMENT ON COLUMN public.orders.platform_fee IS 'Marketplace platform fee in IDR';
COMMENT ON COLUMN public.orders.net_amount IS 'Net amount received after platform fees (total_amount - platform_fee)';

-- Verification query (optional - run after migration)
-- SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- AND column_name IN ('marketplace_platform', 'shipping_address', 'shipping_cost', 'platform_fee', 'net_amount')
-- ORDER BY column_name;

-- Verify enum values (optional)
-- SELECT enumlabel 
-- FROM pg_enum 
-- WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
-- ORDER BY enumsortorder;
