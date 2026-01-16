-- Create Enums
create type public.user_role as enum ('admin', 'artisan', 'customer');
create type public.order_status as enum ('pending_payment', 'paid', 'in_weaving', 'quality_check', 'ready_for_pickup', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'success', 'failed', 'refunded');
create type public.motif_image_status as enum ('pending', 'verified', 'rejected');

-- Create Profiles Table (extends auth.users)
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text null,
  avatar_url text null,
  phone text null,
  address text null,
  bio text null,
  role public.user_role null default 'customer'::public.user_role,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id)
);

-- Trigger to create profile after signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Motifs Table
create table public.motifs (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text not null,
  philosophy text null,
  historical_note text null,
  origin_region text null,
  image_url text null,
  is_verified boolean null default false,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint motifs_pkey primary key (id),
  constraint motifs_slug_key unique (slug)
);

-- Create Motif Images Table
create table public.motif_images (
  id uuid not null default gen_random_uuid (),
  motif_id uuid null references public.motifs (id) on delete cascade,
  uploaded_by uuid null references public.profiles (id) on delete set null,
  file_url text not null,
  file_metadata jsonb null,
  status public.motif_image_status null default 'pending'::public.motif_image_status,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint motif_images_pkey primary key (id)
);

-- Create Products Table (Assuming categories table exists from previous migration)
create table public.products (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text null,
  description text null,
  price numeric not null,
  stock_quantity integer null default 0,
  category_id uuid null references public.categories (id) on delete set null,
  motif_id uuid null references public.motifs (id) on delete set null,
  material text null,
  size text null,
  color text null,
  weaving_time_days integer null,
  is_active boolean null default true,
  is_limited boolean null default false,
  image_urls text[] null,
  created_by uuid null references public.profiles (id) on delete set null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint products_pkey primary key (id),
  constraint products_slug_key unique (slug)
);

-- Create Orders Table
create table public.orders (
  id uuid not null default gen_random_uuid (),
  user_id uuid null references public.profiles (id) on delete set null,
  order_number text not null,
  total_amount numeric not null,
  status public.order_status null default 'pending_payment'::public.order_status,
  delivery_method text null,
  note text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_order_number_key unique (order_number)
);

-- Create Order Items Table
create table public.order_items (
  id uuid not null default gen_random_uuid (),
  order_id uuid null references public.orders (id) on delete cascade,
  product_id uuid null references public.products (id) on delete set null,
  quantity integer null default 1,
  unit_price numeric not null,
  line_total numeric not null,
  created_at timestamp with time zone null default now(),
  constraint order_items_pkey primary key (id)
);

-- Create Payments Table
create table public.payments (
  id uuid not null default gen_random_uuid (),
  order_id uuid null references public.orders (id) on delete cascade,
  amount numeric not null,
  method text null,
  status public.payment_status null default 'pending'::public.payment_status,
  raw_response jsonb null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint payments_pkey primary key (id)
);

-- Create Notifications Table
create table public.notifications (
  id uuid not null default gen_random_uuid (),
  user_id uuid null references public.profiles (id) on delete cascade,
  title text not null,
  message text not null,
  type text null,
  related_id text null,
  is_read boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint notifications_pkey primary key (id)
);


-- Enable Row Level Security (RLS) on all tables check
alter table public.profiles enable row level security;
alter table public.motifs enable row level security;
alter table public.motif_images enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;

-- Basic RLS Policies (Adjust as needed)
-- Public can read verified motifs and active products
create policy "Public can view verified motifs" on public.motifs for select using (is_active = true);
create policy "Public can view active products" on public.products for select using (is_active = true);

-- Users can view/edit own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Users can view own orders and notifications
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);

-- Admins allow all (This requires a helper function or complex policy, simplistic version here)
-- Ideally use: (select role from profiles where id = auth.uid()) = 'admin'

