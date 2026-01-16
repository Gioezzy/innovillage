-- 1. Public Access
create policy "uploads_select"
on storage.objects for select
using ( bucket_id = 'uploads' );

-- 2. Authenticated Uploads
create policy "uploads_insert"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'uploads' );

-- 3. Authenticated Updates
create policy "uploads_update"
on storage.objects for update
to authenticated
using ( bucket_id = 'uploads' );

-- 4. Authenticated Deletes
create policy "uploads_delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'uploads' );
