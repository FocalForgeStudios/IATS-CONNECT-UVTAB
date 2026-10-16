import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const guard = await readFile(new URL("../supabase/functions/content-guard/index.ts", import.meta.url), "utf8");
const crypto = await readFile(new URL("../js/chat-crypto.js", import.meta.url), "utf8");
const migration = await readFile(new URL("../supabase/migrations/20261016_content_guard_e2ee.sql", import.meta.url), "utf8");
test("content guard fails closed if any required provider secret is missing", () => {
  assert.match(guard, /!moderationKey \|\| !safeBrowsingKey/);
  assert.match(guard, /temporarily unavailable/);
});
test("image checks reject flagged content and provider failures", () => {
  assert.match(guard, /api\.openai\.com\/v1\/moderations/);
  assert.match(guard, /moderation\.flagged === true/);
  assert.match(guard, /Image screening failed/);
});
test("links require Safe Browsing success and explicit allowlist", () => {
  assert.match(guard, /safebrowsing\.googleapis\.com/);
  assert.match(guard, /LINK_ALLOWLIST/);
  assert.match(guard, /not on IATS CONNECT's verified-link allowlist/);
});
test("crypto uses ECDH, HKDF, AES-GCM and IndexedDB private-key persistence", () => {
  assert.match(crypto, /name: "ECDH"/);
  assert.match(crypto, /name: "HKDF"/);
  assert.match(crypto, /name: "AES-GCM"/);
  assert.match(crypto, /indexedDB/);
  assert.match(crypto, /chat_public_key: local\.publicJwk/);
});
test("migration adds public key metadata and generic encrypted previews", () => {
  assert.match(migration, /chat_public_key jsonb/);
  assert.match(migration, /encryption_version integer/);
  assert.match(migration, /Encrypted message/);
});
