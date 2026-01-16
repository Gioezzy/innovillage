-- Allow Super Admin to view/manage EVERYTHING

-- PRODUCTS
create policy "Super Admin can view all products"
on public.products for select
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

create policy "Super Admin can update all products"
on public.products for update
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

create policy "Super Admin can delete all products"
on public.products for delete
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

-- ORDERS
create policy "Super Admin can view all orders"
on public.orders for select
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

create policy "Super Admin can update all orders"
on public.orders for update
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

create policy "Super Admin can delete all orders"
on public.orders for delete
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

-- ORDER ITEMS
create policy "Super Admin can view all order items"
on public.order_items for select
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);

-- PAYMENTS
create policy "Super Admin can view all payments"
on public.payments for select
using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'super_admin')
);
