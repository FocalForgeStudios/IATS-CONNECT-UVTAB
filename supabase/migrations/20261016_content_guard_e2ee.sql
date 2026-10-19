-- IATS CONNECT security foundation: content guard + E2EE key directory.
alter table public.profiles add column if not exists chat_public_key jsonb, add column if not exists chat_key_version integer not null default 1;
comment on column public.profiles.chat_public_key is 'Public ECDH key for direct-message encryption. Never store private keys here.';
alter table public.messages add column if not exists encryption_version integer not null default 0, add column if not exists payload_kind text not null default 'text';
alter table public.messages drop constraint if exists messages_payload_kind_check;
alter table public.messages add constraint messages_payload_kind_check check (payload_kind in ('text','attachment','profile_share','system'));
create or replace function public.on_message_inserted() returns trigger language plpgsql security definer set search_path = public as $$
begin
 update public.conversations set last_message = case when new.encryption_version > 0 then '🔒 Encrypted message' when new.payload_kind = 'attachment' then '📎 Encrypted attachment' else left(new.text,140) end, last_message_at=new.created_at, updated_at=new.created_at where id=new.conversation_id;
 return new;
end; $$;
-- Existing profile RLS should remain owner-write/read-authenticated. Never store private keys in Postgres.
