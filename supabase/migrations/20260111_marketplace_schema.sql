-- 1. Add 'super_admin' to user_role enum
-- Note: Running inside a transaction block might fail for enum updates in some Postgres versions/providers.
-- If this fails, run it separately: ALTER TYPE public.user_role ADD VALUE 'super_admin';
alter type public.user_role add value if not exists 'super_admin';

-- 2. Create 'stores' table
create table public.stores (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text not null,
  description text null,
  image_url text null,
  banner_url text null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  is_active boolean null default true,
  is_verified boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint stores_pkey primary key (id),
  constraint stores_slug_key unique (slug),
  constraint stores_owner_id_key unique (owner_id) -- One store per owner for now
);

-- 3. Add store_id to products
alter table public.products 
add column store_id uuid null references public.stores(id) on delete cascade;

-- 4. Add store_id to orders
-- This implies an order belongs to ONE store. 
-- Mixed carts will need to be split into multiple orders on the frontend/backend logic.
alter table public.orders
add column store_id uuid null references public.stores(id) on delete set null;

-- 5. Enable RLS on stores
alter table public.stores enable row level security;

-- 6. RLS Policies for Stores

-- Public view active stores
create policy "Public can view active stores"
on public.stores for select
using (is_active = true);

-- Super Admin can view all
create policy "Super Admin can view all stores"
on public.stores for select
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

-- Super Admin can update/delete all
create policy "Super Admin can update all stores"
on public.stores for update
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

-- Store Owner can manage their own store
create policy "Owners can update own store"
on public.stores for update
using (auth.uid() = owner_id);

create policy "Owners can insert own store"
on public.stores for insert
with check (auth.uid() = owner_id);

-- 7. Update Product Policies for Marketplace
-- Allow Public to view products (already exists)
-- Allow Store Owners to insert products into THEIR store
create policy "Store Owners can insert products"
on public.products for insert
with check (
  exists (
    select 1 from public.stores 
    where stores.id = store_id 
    and stores.owner_id = auth.uid()
  )
);

-- Allow Store Owners to update THEIR products
create policy "Store Owners can update own products"
on public.products for update
using (
  exists (
    select 1 from public.stores 
    where stores.id = store_id 
    and stores.owner_id = auth.uid()
  )
);

-- Allow Store Owners to delete THEIR products
create policy "Store Owners can delete own products"
on public.products for delete
using (
  exists (
    select 1 from public.stores 
    where stores.id = store_id 
    and stores.owner_id = auth.uid()
  )
);

-- 8. Update Order Policies for Marketplace
-- Store Owners can view orders for THEIR store
create policy "Store Owners can view orders"
on public.orders for select
using (
  exists (
    select 1 from public.stores 
    where stores.id = store_id 
    and stores.owner_id = auth.uid()
  )
);
