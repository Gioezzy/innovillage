-- Migration: Add province field to orders table
-- Task 18.2: Integrate shipping cost calculation in checkout flow
-- Requirements: 3.4, 11.2
-- 
-- INSTRUCTIONS: Run this SQL in Supabase SQL Editor
-- This migration is idempotent (safe to run multiple times)

-- Add province column to orders table
DO $$ 
BEGIN
  -- Add province column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'orders' 
    AND column_name = 'province'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN province TEXT;
    RAISE NOTICE 'Added province column to orders table';
  ELSE
    RAISE NOTICE 'province column already exists';
  END IF;
END $$;

-- Add check constraint for province validation (must be one of 38 Indonesian provinces)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'province_valid_values'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT province_valid_values 
      CHECK (
        province IS NULL OR 
        province IN (
          'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 
          'Sumatera Selatan', 'Bengkulu', 'Lampung', 'Kepulauan Riau', 
          'Kepulauan Bangka Belitung', 'DKI Jakarta', 'Jawa Barat', 
          'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten', 'Bali', 
          'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 
          'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 
          'Kalimantan Utara', 'Sulawesi Utara', 'Sulawesi Tengah', 
          'Sulawesi Selatan', 'Sulawesi Tenggara', 'Gorontalo', 
          'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 
          'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya'
        )
      );
    RAISE NOTICE 'Added province_valid_values constraint';
  ELSE
    RAISE NOTICE 'province_valid_values constraint already exists';
  END IF;
END $$;

-- Create index for province queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_orders_province 
  ON public.orders(province) 
  WHERE province IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.orders.province IS 'Destination province for delivery orders (one of 38 Indonesian provinces)';

-- Verification query (optional - run after migration)
-- SELECT column_name, data_type, character_maximum_length
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- AND column_name = 'province';

