-- Publicly viewable event posters and video trailers, uploaded by authenticated users.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-media',
  'event-media',
  true,
  52428800,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view event media" on storage.objects;
create policy "Public can view event media"
on storage.objects for select
to public
using (bucket_id = 'event-media');

drop policy if exists "Authenticated users upload own event media" on storage.objects;
create policy "Authenticated users upload own event media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'event-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users update own event media" on storage.objects;
create policy "Users update own event media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'event-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'event-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users delete own event media" on storage.objects;
create policy "Users delete own event media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'event-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
