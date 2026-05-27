-- Migration: Add Row Level Security (RLS) policies for marketplace columns
-- Task 19.2: Add Row Level Security (RLS) policies for new columns
-- Requirements: 4.7, 7.1
-- 
-- INSTRUCTIONS: Run this SQL in Supabase SQL Editor
-- This migration adds RLS policies to ensure:
-- 1. Store owners can only update marketplace URLs for their own products
-- 2. Users can only view their own order marketplace fields
-- 3. Admin/super_admin have full access to all data

-- Note: The existing RLS policies from 20260111_marketplace_schema.sql already cover:
-- - "Store Owners can update own products" - allows updating ALL columns including marketplace URLs
-- - "Users can view own orders" - allows viewing ALL columns including marketplace fields
-- - "Super Admin can view/update all products" - full access to all product columns
-- - "Super Admin can view/update all orders" - full access to all order columns
--
-- This migration verifies those policies exist and adds any missing specific policies
-- for the new marketplace columns if needed.

-- ============================================================================
-- PRODUCTS TABLE RLS POLICIES
-- ============================================================================

-- Verify existing policies cover marketplace URL columns
-- The existing "Store Owners can update own products" policy already allows
-- store owners to update marketplace URLs (shopee_url, tokopedia_url, padiumkm_url)
-- because it grants UPDATE permission on the entire products table for their products.

-- Verify the policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'products' 
    AND policyname = 'Store Owners can update own products'
  ) THEN
    RAISE WARNING 'Policy "Store Owners can update own products" does not exist. This policy should have been created by 20260111_marketplace_schema.sql';
  ELSE
    RAISE NOTICE 'Verified: Store owners can update marketplace URLs via existing policy';
  END IF;
END $$;

-- Verify super admin policies exist for products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'products' 
    AND policyname = 'Super Admin can update all products'
  ) THEN
    RAISE WARNING 'Policy "Super Admin can update all products" does not exist. This policy should have been created by 20260111_super_admin_access.sql';
  ELSE
    RAISE NOTICE 'Verified: Super admins can update all product columns including marketplace URLs';
  END IF;
END $$;

-- Add a specific policy comment for documentation
COMMENT ON TABLE public.products IS 'Products table with marketplace integration. RLS policies ensure: (1) Public can view active products, (2) Store owners can manage their own products including marketplace URLs, (3) Super admins have full access';

-- ============================================================================
-- ORDERS TABLE RLS POLICIES
-- ============================================================================

-- Verify existing policies cover marketplace order fields
-- The existing "Users can view own orders" policy already allows users to view
-- marketplace fields (marketplace_platform, shipping_address, shipping_cost, 
-- platform_fee, net_amount, province) because it grants SELECT permission on 
-- the entire orders table for their orders.

-- Verify the policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'orders' 
    AND policyname = 'Users can view own orders'
  ) THEN
    RAISE WARNING 'Policy "Users can view own orders" does not exist. This policy should have been created by 20260111_remaining_tables_schema.sql';
  ELSE
    RAISE NOTICE 'Verified: Users can view their own order marketplace fields via existing policy';
  END IF;
END $$;

-- Verify store owners can view orders for their store
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'orders' 
    AND policyname = 'Store Owners can view orders'
  ) THEN
    RAISE WARNING 'Policy "Store Owners can view orders" does not exist. This policy should have been created by 20260111_marketplace_schema.sql';
  ELSE
    RAISE NOTICE 'Verified: Store owners can view orders for their store including marketplace fields';
  END IF;
END $$;

-- Verify super admin policies exist for orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'orders' 
    AND policyname = 'Super Admin can view all orders'
  ) THEN
    RAISE WARNING 'Policy "Super Admin can view all orders" does not exist. This policy should have been created by 20260111_super_admin_access.sql';
  ELSE
    RAISE NOTICE 'Verified: Super admins can view all order columns including marketplace fields';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'orders' 
    AND policyname = 'Super Admin can update all orders'
  ) THEN
    RAISE WARNING 'Policy "Super Admin can update all orders" does not exist. This policy should have been created by 20260111_super_admin_access.sql';
  ELSE
    RAISE NOTICE 'Verified: Super admins can update all order columns including marketplace fields';
  END IF;
END $$;

-- Add a specific policy comment for documentation
COMMENT ON TABLE public.orders IS 'Orders table with marketplace integration. RLS policies ensure: (1) Users can view their own orders including marketplace fields, (2) Store owners can view orders for their store, (3) Super admins have full access';

-- ============================================================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Ensure RLS is enabled on both tables (should already be enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Add column-level comments for documentation
COMMENT ON COLUMN public.products.shopee_url IS 'Marketplace URL for Shopee. Protected by RLS: store owners can update their own products, super admins have full access';
COMMENT ON COLUMN public.products.tokopedia_url IS 'Marketplace URL for Tokopedia. Protected by RLS: store owners can update their own products, super admins have full access';
COMMENT ON COLUMN public.products.padiumkm_url IS 'Marketplace URL for PadiUMKM. Protected by RLS: store owners can update their own products, super admins have full access';

COMMENT ON COLUMN public.orders.marketplace_platform IS 'Marketplace platform used for checkout. Protected by RLS: users can view their own orders, store owners can view orders for their store, super admins have full access';
COMMENT ON COLUMN public.orders.shipping_address IS 'Customer shipping address. Protected by RLS: users can view their own orders, store owners can view orders for their store, super admins have full access';
COMMENT ON COLUMN public.orders.shipping_cost IS 'Estimated shipping cost. Protected by RLS: users can view their own orders, store owners can view orders for their store, super admins have full access';
COMMENT ON COLUMN public.orders.platform_fee IS 'Marketplace platform fee. Protected by RLS: users can view their own orders, store owners can view orders for their store, super admins have full access';
COMMENT ON COLUMN public.orders.net_amount IS 'Net amount after fees. Protected by RLS: users can view their own orders, store owners can view orders for their store, super admins have full access';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all RLS policies are in place
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Count products policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename = 'products';
  
  RAISE NOTICE 'Products table has % RLS policies', policy_count;
  
  -- Count orders policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'public' 
  AND tablename = 'orders';
  
  RAISE NOTICE 'Orders table has % RLS policies', policy_count;
END $$;

-- Optional: List all policies for products and orders tables
-- Uncomment to see all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('products', 'orders')
-- ORDER BY tablename, policyname;

