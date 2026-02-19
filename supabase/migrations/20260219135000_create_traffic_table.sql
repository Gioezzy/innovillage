create table if not exists public.website_traffic (
  id uuid not null default gen_random_uuid(),
  path text not null,
  user_agent text,
  ip_hash text,
  created_at timestamp with time zone not null default now(),
  constraint website_traffic_pkey primary key (id)
);

alter table public.website_traffic enable row level security;

-- Allow anyone (including unauthenticated users) to insert traffic data
create policy "Anyone can insert traffic data"
on public.website_traffic
for insert
to public
with check (true);

-- Allow only admins and super_admins to view traffic data
create policy "Admins can view traffic data"
on public.website_traffic
for select
to authenticated
using (
  auth.uid() in (
    select id from public.profiles 
    where role in ('admin', 'super_admin')
  )
);
