# IATS CONNECT security implementation — review branch

Branch: `security/content-filtering-e2ee`

## Included groundwork
- Authenticated `content-guard` Edge Function: OpenAI image moderation, Google Safe Browsing checks, and strict allowlist-only links. Missing secrets, provider errors and timeouts fail closed.
- Database migration for public chat-key metadata and encryption protocol fields. Encrypted-message conversation previews are generic.
- The next required code change is integration with the current service/UI.

## Required Edge Function secrets
Set in a **development** Supabase project before deployment:
- `OPENAI_MODERATION_API_KEY`
- `GOOGLE_SAFE_BROWSING_API_KEY`
- `APP_ORIGIN` (exact origin)
- `LINK_ALLOWLIST` (comma-separated explicitly approved academic domains)

Images are sent to the moderation provider before encryption, as requested; disclose that third-party processing in the privacy notice. Google Safe Browsing is not an adult-domain classifier, so the allowlist prevents unverified domains from passing.

## Rollout status — NOT production-ready
The current `js/supabase-service.js` still sends plaintext messages and uploads original attachments. The crypto primitives and Edge Function are not yet wired into live send/receive paths. Do not deploy the migration or claim E2EE is active until the service/UI integration, attachment decryption, key verification, recovery, and tests pass. Existing plaintext history cannot be retroactively encrypted.

## Required integration/tests
1. Invoke content guard before sending links or images; only `allowed: true` permits sending.
2. Encrypt message text and attachment bytes client-side; store only ciphertext and non-sensitive metadata. Decrypt on recipient devices and render attachment plaintext only in memory.
3. Add key fingerprint verification, rotation and multi-device recovery; never silently replace a key.
4. Keep old plaintext history readable and clearly distinguish it from E2EE messages.
5. Test missing/failed provider, flagged image, suspicious/unapproved links, tampered ciphertext, two authorized accounts, unauthorized third account, device/key loss, and existing chat flows.
6. Configure secrets in a development project, deploy/test there, inspect security advisors, then review a PR before production.
