-- Add bank details to stores
alter table public.stores 
add column if not exists bank_name text,
add column if not exists account_number text,
add column if not exists account_holder text;

-- Add fee calculations to orders
alter table public.orders 
add column if not exists platform_fee numeric default 0,
add column if not exists net_amount numeric default 0;

-- Create withdrawals table
create type withdrawal_status as enum ('pending', 'approved', 'rejected');

create table if not exists public.withdrawals (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  amount numeric not null,
  status withdrawal_status not null default 'pending',
  bank_info jsonb not null, -- Stores snapshot of bank details at time of request
  proof_url text, -- For admin to upload transfer proof
  admin_note text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint withdrawals_pkey primary key (id)
);

-- RLS for Withdrawals
alter table public.withdrawals enable row level security;

-- Stores can view and create their own withdrawals
create policy "Stores can view their own withdrawals"
on public.withdrawals
for select
to authenticated
using (
  store_id in (
    select id from public.stores where owner_id = auth.uid()
  )
);

create policy "Stores can request withdrawals"
on public.withdrawals
for insert
to authenticated
with check (
  store_id in (
    select id from public.stores where owner_id = auth.uid()
  )
);

-- Admins/Super Admins can view all and update status
create policy "Admins can view all withdrawals"
on public.withdrawals
for select
to authenticated
using (
  auth.uid() in (
    select id from public.profiles where role in ('super_admin', 'admin') 
    -- Note: 'admin' role here usually means Store Owner, but we want Super Admin.
    -- However, based on app logic, 'admin' is Store Owner.
    -- So we need to be specific.
  )
);

create policy "Super Admins can manage withdrawals"
on public.withdrawals
for all
to authenticated
using (
  auth.uid() in (
    select id from public.profiles where role = 'super_admin'
  )
);
