-- Add optional public event poster and short attendee notes.
alter table public.catchups
  add column if not exists banner_url text,
  add column if not exists notes text;

alter table public.catchups
  drop constraint if exists catchups_banner_url_http_check;
alter table public.catchups
  add constraint catchups_banner_url_http_check
  check (banner_url is null or banner_url ~* '^https?://');
