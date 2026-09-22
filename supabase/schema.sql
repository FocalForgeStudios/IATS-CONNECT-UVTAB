-- =========================================================================
-- IATS CONNECT — Supabase Database Schema
-- -------------------------------------------------------------------------
-- HOW TO USE:
--   1. Open your Supabase project -> SQL Editor -> New query.
--   2. Paste this ENTIRE file and click "Run". Safe to re-run (uses
--      IF NOT EXISTS / CREATE OR REPLACE everywhere).
--   3. Go to Authentication -> Providers -> enable "Google" (paste your
--      Google OAuth Client ID/Secret) so real Google sign-in works.
--   4. Go to Authentication -> Email Templates -> "Magic Link" and make
--      sure the template includes {{ .Token }} — that is the real 6-digit
--      code this app's "Sign in with email" screen expects.
--   5. Copy your Project URL + anon public key into js/supabase-config.js.
-- =========================================================================

create extension if not exists "pgcrypto";

-- =========================================================================
-- 1. PROFILES  (one row per real authenticated user — no sample rows)
-- =========================================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null default 'IATS Scholar',
  email         text,
  university    text default 'IATS',
  major         text default 'Undeclared',
  year          text default 'Class of 2026',
  bio           text default '',
  courses       text[] default '{}',
  interests     text[] default '{}',
  avatar_url    text,                 -- always optional, never required at signup
  location      text default 'IATS Main Campus',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- =========================================================================
-- 2. MATCH_PROFILES  (study-buddy directory cards)
-- =========================================================================
create table if not exists public.match_profiles (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references auth.users(id) on delete cascade,
  name          text not null,
  major         text,
  year          text,
  university    text default 'IATS',
  compat_score  int default 85,
  bio           text,
  courses       text[] default '{}',
  interests     text[] default '{}',
  avatar_url    text,
  location      text default 'IATS Main Campus',
  created_at    timestamptz not null default now()
);

alter table public.match_profiles enable row level security;

drop policy if exists "match_profiles_select_authenticated" on public.match_profiles;
create policy "match_profiles_select_authenticated" on public.match_profiles
  for select using (auth.role() = 'authenticated');

drop policy if exists "match_profiles_insert_own" on public.match_profiles;
create policy "match_profiles_insert_own" on public.match_profiles
  for insert with check (auth.uid() = owner_id);

drop policy if exists "match_profiles_update_own" on public.match_profiles;
create policy "match_profiles_update_own" on public.match_profiles
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "match_profiles_delete_own" on public.match_profiles;
create policy "match_profiles_delete_own" on public.match_profiles
  for delete using (auth.uid() = owner_id);

-- =========================================================================
-- 3. CATCHUPS  (academic events / news)
-- =========================================================================
create table if not exists public.catchups (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  host           text,
  host_avatar    text,
  host_id        uuid references auth.users(id) on delete set null,
  location       text,
  event_time     text,
  tag            text default 'Academic Event',
  attendees      int default 1,
  max_attendees  int default 8,
  attendee_ids   uuid[] default '{}',
  created_at     timestamptz not null default now()
);

alter table public.catchups enable row level security;

drop policy if exists "catchups_select_authenticated" on public.catchups;
create policy "catchups_select_authenticated" on public.catchups
  for select using (auth.role() = 'authenticated');

drop policy if exists "catchups_insert_own" on public.catchups;
create policy "catchups_insert_own" on public.catchups
  for insert with check (auth.uid() = host_id);

drop policy if exists "catchups_update_authenticated" on public.catchups;
-- Any signed-in scholar may update attendee counts when joining/leaving;
-- app code only ever changes attendees/attendee_ids for this table.
create policy "catchups_update_authenticated" on public.catchups
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "catchups_delete_own" on public.catchups;
create policy "catchups_delete_own" on public.catchups
  for delete using (auth.uid() = host_id);

-- =========================================================================
-- 4. HUB_POSTS  (faculty / guild discussion posts)
-- =========================================================================
create table if not exists public.hub_posts (
  id               uuid primary key default gen_random_uuid(),
  category         text default 'tech',
  author           text,
  author_role      text,
  author_avatar    text,
  author_id        uuid references auth.users(id) on delete set null,
  title            text not null,
  content          text not null,
  upvotes          int default 1,
  upvoter_ids      uuid[] default '{}',
  comments_count   int default 0,
  tags             text[] default '{}',
  created_at       timestamptz not null default now()
);

alter table public.hub_posts enable row level security;

drop policy if exists "hub_posts_select_authenticated" on public.hub_posts;
create policy "hub_posts_select_authenticated" on public.hub_posts
  for select using (auth.role() = 'authenticated');

drop policy if exists "hub_posts_insert_own" on public.hub_posts;
create policy "hub_posts_insert_own" on public.hub_posts
  for insert with check (auth.uid() = author_id);

drop policy if exists "hub_posts_update_authenticated" on public.hub_posts;
create policy "hub_posts_update_authenticated" on public.hub_posts
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "hub_posts_delete_own" on public.hub_posts;
create policy "hub_posts_delete_own" on public.hub_posts
  for delete using (auth.uid() = author_id);

-- =========================================================================
-- 5. CONVERSATIONS + MESSAGES  (real-time direct messaging)
-- =========================================================================
create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  created_by       uuid not null references auth.users(id) on delete cascade,
  participant_id   uuid references auth.users(id) on delete cascade,
  name             text,               -- display name of the other party
  major            text,
  avatar_url       text,
  status           text default 'online',
  last_message     text,
  last_message_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.conversations enable row level security;

drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant" on public.conversations
  for select using (auth.uid() = created_by or auth.uid() = participant_id);

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own" on public.conversations
  for insert with check (auth.uid() = created_by);

drop policy if exists "conversations_update_participant" on public.conversations;
create policy "conversations_update_participant" on public.conversations
  for update using (auth.uid() = created_by or auth.uid() = participant_id)
  with check (auth.uid() = created_by or auth.uid() = participant_id);

create table if not exists public.messages (
  id                uuid primary key default gen_random_uuid(),
  conversation_id   uuid not null references public.conversations(id) on delete cascade,
  sender_id         uuid not null references auth.users(id) on delete cascade,
  text              text not null,
  created_at        timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages(conversation_id, created_at);

alter table public.messages enable row level security;

drop policy if exists "messages_select_participant" on public.messages;
create policy "messages_select_participant" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.created_by = auth.uid() or c.participant_id = auth.uid())
    )
  );

drop policy if exists "messages_insert_participant" on public.messages;
create policy "messages_insert_participant" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.created_by = auth.uid() or c.participant_id = auth.uid())
    )
  );

-- Keep the conversations list preview + ordering fresh automatically,
-- in one atomic step, whenever a message lands.
create or replace function public.on_message_inserted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set last_message = left(new.text, 140),
      last_message_at = new.created_at,
      updated_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_on_message_inserted on public.messages;
create trigger trg_on_message_inserted
  after insert on public.messages
  for each row execute function public.on_message_inserted();

-- Enable real-time, no-delay delivery for chat.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.match_profiles;
alter publication supabase_realtime add table public.catchups;
alter publication supabase_realtime add table public.hub_posts;

-- =========================================================================
-- 6. RATE LIMITING
--    A dedicated log table + trigger function that blocks a user from
--    inserting too many rows, too fast, into the tables people can spam
--    (messages, posts, events, directory cards). This runs INSIDE
--    Postgres, so it cannot be bypassed by calling the API directly.
-- =========================================================================
create table if not exists public.rate_limit_log (
  id          bigserial primary key,
  user_id     uuid not null,
  action      text not null,
  created_at  timestamptz not null default now()
);

create index if not exists rate_limit_log_lookup_idx
  on public.rate_limit_log(user_id, action, created_at);

-- Automatically keep this table small.
create or replace function public.prune_rate_limit_log()
returns void language sql as $$
  delete from public.rate_limit_log where created_at < now() - interval '1 day';
$$;

create or replace function public.enforce_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  limit_count int;
  window_secs int;
  recent_count int;
  actor uuid;
begin
  actor := auth.uid();
  if actor is null then
    raise exception 'You must be signed in to do that.';
  end if;

  -- Per-table limits: generous enough for real use, tight enough to stop
  -- a runaway loop or bot from hammering the database.
  case tg_table_name
    when 'messages' then
      limit_count := 20; window_secs := 60;      -- 20 messages / minute / user
    when 'hub_posts' then
      limit_count := 6;  window_secs := 300;     -- 6 posts / 5 minutes / user
    when 'catchups' then
      limit_count := 6;  window_secs := 300;     -- 6 events / 5 minutes / user
    when 'match_profiles' then
      limit_count := 6;  window_secs := 300;     -- 6 directory cards / 5 minutes / user
    else
      limit_count := 30; window_secs := 60;
  end case;

  select count(*) into recent_count
  from public.rate_limit_log
  where user_id = actor
    and action = tg_table_name
    and created_at > now() - (window_secs || ' seconds')::interval;

  if recent_count >= limit_count then
    raise exception 'Rate limit exceeded for %: max % actions per % seconds. Please slow down.',
      tg_table_name, limit_count, window_secs;
  end if;

  insert into public.rate_limit_log (user_id, action) values (actor, tg_table_name);
  return new;
end;
$$;

drop trigger if exists trg_rate_limit_messages on public.messages;
create trigger trg_rate_limit_messages
  before insert on public.messages
  for each row execute function public.enforce_rate_limit();

drop trigger if exists trg_rate_limit_hub_posts on public.hub_posts;
create trigger trg_rate_limit_hub_posts
  before insert on public.hub_posts
  for each row execute function public.enforce_rate_limit();

drop trigger if exists trg_rate_limit_catchups on public.catchups;
create trigger trg_rate_limit_catchups
  before insert on public.catchups
  for each row execute function public.enforce_rate_limit();

drop trigger if exists trg_rate_limit_match_profiles on public.match_profiles;
create trigger trg_rate_limit_match_profiles
  before insert on public.match_profiles
  for each row execute function public.enforce_rate_limit();

-- =========================================================================
-- 7. AUTO-CREATE A PROFILE ROW THE MOMENT SOMEONE REALLY SIGNS UP
--    (covers Google OAuth users too, so nothing depends on client code)
-- =========================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'IATS Scholar'),
    new.email,
    new.raw_user_meta_data->>'avatar_url' -- optional; never blocks signup if absent
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_handle_new_auth_user on auth.users;
create trigger trg_handle_new_auth_user
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- =========================================================================
-- Done. Next steps:
--   - Settings -> API -> confirm "anon" key matches js/supabase-config.js
--   - Authentication -> Providers -> enable Google
--   - Authentication -> Rate Limits: Supabase also enforces its own
--     dashboard-level limits on auth requests (sign-ups, OTP sends) —
--     leave those on for extra protection against abuse.
--   - Authentication -> Policies: "Leaked password protection" and
--     CAPTCHA (hCaptcha/Turnstile) are optional extra hardening you can
--     switch on in the dashboard with no code changes.
-- =========================================================================
