insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read site media" on storage.objects;
drop policy if exists "Admins can upload site media" on storage.objects;
drop policy if exists "Admins can update site media" on storage.objects;
drop policy if exists "Admins can delete site media" on storage.objects;

create policy "Anyone can read site media"
  on storage.objects for select
  using (bucket_id = 'site-media');

create policy "Admins can upload site media"
  on storage.objects for insert
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins can update site media"
  on storage.objects for update
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

create policy "Admins can delete site media"
  on storage.objects for delete
  using (bucket_id = 'site-media' and public.is_admin());
