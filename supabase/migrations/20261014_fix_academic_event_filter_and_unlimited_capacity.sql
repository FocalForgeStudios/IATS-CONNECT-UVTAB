-- Fix the academic content filter contract and make event capacity optional/unlimited.
-- NULL max_attendees means no capacity limit; explicit positive values remain enforced.
alter table public.catchups alter column max_attendees drop default;
alter table public.catchups alter column max_attendees set default null;

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
begin
  if actor is null then raise exception 'Sign in required'; end if;
  select coalesce(attendee_ids, '{}'::uuid[]), coalesce(attendees, 0), max_attendees
    into current_ids, current_count, cap
    from public.catchups where id = p_catchup_id for update;
  if not found then return false; end if;
  if p_joining then
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
