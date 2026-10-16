# IATS CONNECT security implementation — review branch

Branch: `security/content-filtering-e2ee`

## Implemented on this branch
- Authenticated `content-guard` Edge Function: image moderation via OpenAI, malicious-link checking via Google Safe Browsing, and a strict explicit domain allowlist. Missing secrets, provider errors and timeouts fail closed.
- Direct-message send/edit/profile-share text is encrypted in the browser using ECDH P-256, HKDF-SHA-256 and AES-256-GCM. Client code decrypts encrypted messages for display.
- Images are screened before encryption. Chat attachment bytes are encrypted before upload to the private Storage bucket and decrypted in the client for display/download.
- Database migration adds public-key metadata and encryption version fields. Conversation previews are generic for encrypted messages.
- Privacy notice updated to disclose third-party pre-encryption image screening.

## Required Edge Function secrets
Configure in a **development** Supabase project before deploying:
- `OPENAI_MODERATION_API_KEY`
- `GOOGLE_SAFE_BROWSING_API_KEY`
- `APP_ORIGIN` (exact allowed origin)
- `LINK_ALLOWLIST` (comma-separated explicitly approved academic domains)

Images are sent to the moderation provider before encryption, as requested; disclose this third-party processing in the privacy notice. Safe Browsing is not an adult-domain classifier, so only explicitly allowlisted domains pass. Links on other domains will be blocked even if they are legitimate until IATS approves them.

## Rollout status — NOT production-ready
No production Supabase schema or Edge Function was changed. The current implementation uses a static per-user ECDH key and does not yet provide independent fingerprint verification, forward secrecy, or multi-device/key-loss recovery. A malicious database administrator could substitute a public key in the profile directory unless users verify fingerprints out of band. Do not merge or advertise this as production-grade E2EE until these design gaps are addressed.

The migration must be applied before deploying the new service code. Provider secrets must be configured before deploying `content-guard`; otherwise sends fail closed. Existing plaintext history remains in its original format and cannot be retroactively encrypted.

## Verification performed
- GitHub Actions Node contract tests pass on the latest branch commit. These check that send paths call the guard, text and attachments are encrypted, and the migration/crypto contracts exist.
- These are source-level checks, not live provider checks or two-account browser E2E tests. A development Supabase environment with configured secrets is still required for end-to-end verification.
