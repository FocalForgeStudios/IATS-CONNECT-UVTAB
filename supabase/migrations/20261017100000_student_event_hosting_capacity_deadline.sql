-- Restore student event hosting controls while keeping official news/admin events protected.
-- Student hosts may update only their own non-official event rows.
drop policy if exists "catchups_update_own_event" on public.catchups;
create policy "catchups_update_own_event" on public.catchups
  for update to authenticated
  using (
    auth.uid() = host_id
    and coalesce(is_official, false) = false
    and coalesce(item_type, 'event') = 'event'
    and lower(coalesce(tag, '')) <> 'campus news'
  )
  with check (
    auth.uid() = host_id
    and coalesce(is_official, false) = false
    and coalesce(item_type, 'event') = 'event'
    and lower(coalesce(tag, '')) <> 'campus news'
  );

-- Enforce both capacity and the registration deadline atomically on the server.
create or replace function public.toggle_catchup_attendance(p_catchup_id uuid, p_joining boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  current_ids uuid[];
  current_count integer;
  cap integer;
  deadline timestamptz;
  starts_at timestamptz;
begin
  if actor is null then raise exception 'Sign in required'; end if;
  select coalesce(attendee_ids, '{}'::uuid[]), coalesce(attendees, 0), max_attendees,
         registration_deadline, event_starts_at
    into current_ids, current_count, cap, deadline, starts_at
    from public.catchups where id = p_catchup_id and coalesce(item_type, 'event') = 'event'
    for update;
  if not found then return false; end if;

  if p_joining then
    if deadline is not null and now() >= deadline then
      raise exception 'Registration deadline has passed';
    end if;
    if starts_at is not null and now() >= starts_at then
      raise exception 'This event has already started';
    end if;
    if actor = any(current_ids) then return true; end if;
    if cap is not null and current_count >= cap then return false; end if;
    update public.catchups
      set attendee_ids = array_append(current_ids, actor), attendees = current_count + 1
      where id = p_catchup_id;
  else
    if not (actor = any(current_ids)) then return true; end if;
    update public.catchups
      set attendee_ids = array_remove(current_ids, actor), attendees = greatest(0, current_count - 1)
      where id = p_catchup_id;
  end if;
  return true;
end;
$$;
