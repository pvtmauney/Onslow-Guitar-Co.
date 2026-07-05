-- Onslow Guitar Co. — storage bucket + policies
-- Run after 0001_schema.sql.

-- One public bucket for all site media (photos + uploaded video clips).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can view files (the bucket is public anyway; this covers API reads).
create policy "Public read media bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Only the authenticated owner can add, replace, or remove files.
create policy "Owner upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Owner update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "Owner delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
