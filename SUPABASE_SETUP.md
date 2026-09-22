# IATS CONNECT — Supabase Setup Guide

The app has been switched from Firebase to Supabase. Follow these steps in
order and it'll be fully working with real accounts, real-time chat, and
rate limiting.

## 1. Create your project
Go to https://supabase.com → New project. Pick a region close to your
users. Free tier is enough to start.

## 2. Run the database schema
Open **SQL Editor → New query** in your Supabase dashboard, paste the
entire contents of `supabase/schema.sql` from this project, and click
**Run**. This creates every table, security policy, the rate-limiting
triggers, and turns on real-time delivery for chat/feed updates. It's
safe to re-run if you ever need to.

## 3. Add your credentials to the app
Go to **Project Settings → Data API** (or **API**), copy:
- **Project URL**
- **anon public** key (never the `service_role` key — that one must
  never be shipped to a browser)

Paste them into `js/supabase-config.js`:
```js
export const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```
Copy the same two values into `public/js/supabase-config.js` too (that
folder mirrors the root files).

## 4. Turn on Google Sign-In
**Authentication → Providers → Google** → toggle on, paste your Google
OAuth **Client ID** and **Client Secret**. Under **Authentication → URL
Configuration**, add the URL(s) you'll host the app on to the allowed
Redirect URLs list.

## 5. Make the email OTP a real 6-digit code
By default Supabase's "Magic Link" email only contains a clickable link.
This app's UI expects a typed 6-digit code, which Supabase already
generates internally — you just need the email to show it. Go to
**Authentication → Email Templates → Magic Link**, and make sure the
template body includes `{{ .Token }}` (that's the real code). A minimal
template:

```
Your IATS CONNECT verification code is: {{ .Token }}
This code expires in 60 minutes.
```

No code is ever generated or shown by the app itself anymore — it's 100%
sent by Supabase to the real inbox you typed in.

## 6. Rate limiting — already on, two layers
- **Database layer (the real protection):** `supabase/schema.sql`
  installs a trigger that blocks a user from inserting too many rows too
  fast into `messages`, `hub_posts`, `catchups`, and `match_profiles`.
  This can't be bypassed by calling the API directly.
- **Auth layer:** Supabase's dashboard has its own built-in rate limits
  on sign-ups and OTP emails (Authentication → Rate Limits) — leave
  these on.
- **Client layer:** the app also throttles double-clicks/spam-taps
  before a request is even sent, as a first line of defense.

## 7. Security notes
- Every table has Row Level Security (RLS) turned on — people can only
  write rows as themselves, and direct messages are only readable by
  the two people in that conversation.
- The Supabase client library always uses parameterized queries, so
  standard SQL injection isn't possible through normal app usage.
- Consider enabling **Authentication → Policies → Leaked Password
  Protection** and a CAPTCHA (hCaptcha/Turnstile) in the dashboard for
  extra hardening — both are toggles, no code changes needed.

## 8. Photos / avatars
Nothing in the app requires a photo upload at sign-up — accounts get a
neutral default avatar automatically, and people can add a real photo
later from their profile if you choose to build that in (this keeps you
well within the free tier's storage limits for now).

## 9. Two-way chat tip
"Start New Chat" currently matches by the exact name someone used when
they signed up, so real-time delivery works instantly between two real
accounts. If you'd like a proper "search and pick a real person"
picker instead of typing a name, that's a small UI addition — the
backend (`conversations.participant_id`) is already built to support it.
