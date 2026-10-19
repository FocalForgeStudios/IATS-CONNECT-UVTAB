-- Direct-message text encryption metadata only. No link/image filtering or attachment changes.
alter table public.profiles
  add column if not exists chat_public_key jsonb,
  add column if not exists chat_key_version integer;

alter table public.messages
  add column if not exists encryption_version integer not null default 0;

comment on column public.profiles.chat_public_key is
  'Public ECDH key for direct-message encryption; private key stays in this user device IndexedDB.';
comment on column public.messages.encryption_version is
  '0 = legacy plaintext message; 1 = encrypted text envelope.';
