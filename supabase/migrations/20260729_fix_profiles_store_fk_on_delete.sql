-- Migration: Fix profiles.store_id foreign key constraint to handle deletion gracefully
-- When a store is deleted in the stores table, automatically set store_id to NULL in profiles table

ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_store_id_fkey;

ALTER TABLE profiles
ADD CONSTRAINT profiles_store_id_fkey
FOREIGN KEY (store_id)
REFERENCES stores(id)
ON DELETE SET NULL;
