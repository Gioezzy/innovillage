-- Create categories table
create table public.categories (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text not null,
  description text null,
  image_url text null,
  is_active boolean null default true,
  display_order integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_slug_key unique (slug)
);

-- Add category_id to products table
alter table public.products 
add column category_id uuid null;

alter table public.products 
add constraint products_category_id_fkey 
foreign key (category_id) references public.categories (id) on delete set null;

-- Enable RLS on categories
alter table public.categories enable row level security;

-- Create policies for categories
create policy "Enable read access for all users" on public.categories
  for select using (true);

create policy "Enable insert for admins only" on public.categories
  for insert with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Enable update for admins only" on public.categories
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Enable delete for admins only" on public.categories
  for delete using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
