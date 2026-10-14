-- Allow password recovery to return to the deployed frontend and reserve Campus News
-- publication for focalforges@gmail.com without restricting normal event hosting.
drop policy if exists "catchups_insert_own" on public.catchups;
create policy "catchups_insert_own" on public.catchups
  for insert to authenticated
  with check (
    auth.uid() = host_id
    and (
      lower(coalesce(tag, '')) <> 'campus news'
      or lower(coalesce(auth.jwt() ->> 'email', '')) = 'focalforges@gmail.com'
    )
  );
