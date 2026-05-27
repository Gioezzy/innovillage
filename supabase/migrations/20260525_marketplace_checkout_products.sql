-- Migration: Add marketplace checkout fields to products table
-- Task 1.1: Create and execute database migration for products table
-- Requirements: 4.1, 4.3, 4.4
-- 
-- INSTRUCTIONS: Run this SQL in Supabase SQL Editor
-- This migration is idempotent (safe to run multiple times)

-- Add marketplace URL columns if they don't exist
DO $$ 
BEGIN
  -- Add shopee_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'shopee_url'
  ) THEN
    ALTER TABLE public.products ADD COLUMN shopee_url TEXT;
    RAISE NOTICE 'Added shopee_url column to products table';
  ELSE
    RAISE NOTICE 'shopee_url column already exists';
  END IF;
  
  -- Add tokopedia_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'products' 
    AND column_name = 'tokopedia_url'
  ) THEN
    ALTER TABLE public.products ADD COLUMN tokopedia_url TEXT;
    RAISE NOTICE 'Added tokopedia_url column to products table';
  ELSE
    RAISE NOTICE 'tokopedia_url column already exists';
  END IF;
  
  -- Add padiumkm_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'products' 
    AND column_name = 'padiumkm_url'
  ) THEN
    ALTER TABLE public.products ADD COLUMN padiumkm_url TEXT;
    RAISE NOTICE 'Added padiumkm_url column to products table';
  ELSE
    RAISE NOTICE 'padiumkm_url column already exists';
  END IF;
END $$;

-- Clean up any invalid existing data before adding constraints
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  -- Check for invalid Shopee URLs
  SELECT COUNT(*) INTO invalid_count
  FROM public.products
  WHERE shopee_url IS NOT NULL 
    AND shopee_url !~ '^https://shopee\.co\.id/';
  
  IF invalid_count > 0 THEN
    RAISE NOTICE 'Found % invalid Shopee URLs, setting them to NULL', invalid_count;
    UPDATE public.products
    SET shopee_url = NULL
    WHERE shopee_url IS NOT NULL 
      AND shopee_url !~ '^https://shopee\.co\.id/';
  END IF;
  
  -- Check for invalid Tokopedia URLs
  SELECT COUNT(*) INTO invalid_count
  FROM public.products
  WHERE tokopedia_url IS NOT NULL 
    AND tokopedia_url !~ '^https://www\.tokopedia\.com/';
  
  IF invalid_count > 0 THEN
    RAISE NOTICE 'Found % invalid Tokopedia URLs, setting them to NULL', invalid_count;
    UPDATE public.products
    SET tokopedia_url = NULL
    WHERE tokopedia_url IS NOT NULL 
      AND tokopedia_url !~ '^https://www\.tokopedia\.com/';
  END IF;
  
  -- Check for invalid PadiUMKM URLs
  SELECT COUNT(*) INTO invalid_count
  FROM public.products
  WHERE padiumkm_url IS NOT NULL 
    AND padiumkm_url !~ '^https://';
  
  IF invalid_count > 0 THEN
    RAISE NOTICE 'Found % invalid PadiUMKM URLs, setting them to NULL', invalid_count;
    UPDATE public.products
    SET padiumkm_url = NULL
    WHERE padiumkm_url IS NOT NULL 
      AND padiumkm_url !~ '^https://';
  END IF;
  
  -- Check for URLs exceeding length limit
  SELECT COUNT(*) INTO invalid_count
  FROM public.products
  WHERE (shopee_url IS NOT NULL AND length(shopee_url) > 2048)
     OR (tokopedia_url IS NOT NULL AND length(tokopedia_url) > 2048)
     OR (padiumkm_url IS NOT NULL AND length(padiumkm_url) > 2048);
  
  IF invalid_count > 0 THEN
    RAISE NOTICE 'Found % URLs exceeding length limit, setting them to NULL', invalid_count;
    UPDATE public.products
    SET shopee_url = NULL
    WHERE shopee_url IS NOT NULL AND length(shopee_url) > 2048;
    
    UPDATE public.products
    SET tokopedia_url = NULL
    WHERE tokopedia_url IS NOT NULL AND length(tokopedia_url) > 2048;
    
    UPDATE public.products
    SET padiumkm_url = NULL
    WHERE padiumkm_url IS NOT NULL AND length(padiumkm_url) > 2048;
  END IF;
END $$;

-- Add check constraints for URL format validation
DO $$
BEGIN
  -- Shopee URL format constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'shopee_url_format'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT shopee_url_format 
      CHECK (shopee_url IS NULL OR shopee_url ~ '^https://shopee\.co\.id/');
    RAISE NOTICE 'Added shopee_url_format constraint';
  ELSE
    RAISE NOTICE 'shopee_url_format constraint already exists';
  END IF;
  
  -- Tokopedia URL format constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tokopedia_url_format'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT tokopedia_url_format 
      CHECK (tokopedia_url IS NULL OR tokopedia_url ~ '^https://www\.tokopedia\.com/');
    RAISE NOTICE 'Added tokopedia_url_format constraint';
  ELSE
    RAISE NOTICE 'tokopedia_url_format constraint already exists';
  END IF;
  
  -- PadiUMKM URL format constraint (future)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'padiumkm_url_format'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT padiumkm_url_format 
      CHECK (padiumkm_url IS NULL OR padiumkm_url ~ '^https://');
    RAISE NOTICE 'Added padiumkm_url_format constraint';
  ELSE
    RAISE NOTICE 'padiumkm_url_format constraint already exists';
  END IF;
  
  -- URL length constraint (max 2048 characters)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'marketplace_url_length'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT marketplace_url_length 
      CHECK (
        (shopee_url IS NULL OR length(shopee_url) <= 2048) AND
        (tokopedia_url IS NULL OR length(tokopedia_url) <= 2048) AND
        (padiumkm_url IS NULL OR length(padiumkm_url) <= 2048)
      );
    RAISE NOTICE 'Added marketplace_url_length constraint';
  ELSE
    RAISE NOTICE 'marketplace_url_length constraint already exists';
  END IF;
END $$;

-- Create index for marketplace URL queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_products_marketplace_urls 
  ON public.products(shopee_url, tokopedia_url) 
  WHERE shopee_url IS NOT NULL OR tokopedia_url IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.products.shopee_url IS 'URL to product listing on Shopee marketplace (format: https://shopee.co.id/...)';
COMMENT ON COLUMN public.products.tokopedia_url IS 'URL to product listing on Tokopedia marketplace (format: https://www.tokopedia.com/...)';
COMMENT ON COLUMN public.products.padiumkm_url IS 'URL to product listing on PadiUMKM marketplace';

-- Verification query (optional - run after migration)
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- AND column_name IN ('shopee_url', 'tokopedia_url', 'padiumkm_url')
-- ORDER BY column_name;
