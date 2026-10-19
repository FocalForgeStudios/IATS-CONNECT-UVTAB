# IATS CONNECT Architecture Audit

**Audit baseline:** `1920e4ca942532e5d521ed39e8bfc6f157204943` (18 October 2026)  
**Working branch:** `refactor/feature-module-boundaries`  
**Scope:** Read-only inventory and safe refactoring plan. No production database or live deployment changes.

## Current structure

- `index.html`: page markup; loads `js/content-filter.js`, `js/supabase-config.js`, `js/supabase-service.js`, and `js/app.js`.
- `js/app.js`: approximately 3,000 lines / 188 KB. One IIFE contains application state, initialization, auth UI/session hydration, routing, dashboard, Study Buddy, Events/Campus News, course forums, chat, profile, diagnostics, and most DOM event wiring.
- `js/supabase-service.js`: Supabase client plus auth, profile, Study Buddy, Events/News, course-post, unread-news, conversation, message, presence, and upload operations.
- `js/supabase-config.js`: Supabase configuration.
- `js/content-filter.js`: content validation logic with a global interface.

## Findings

1. `js/app.js` contains around 93 named functions and uses a shared `AppState` object across feature areas. This makes unintended cross-feature effects possible.
2. One central `bindEvents()` wires up navigation, authentication, event forms, chat controls, profile forms, and modal handlers.
3. `renderCatchupCard()` is declared twice in `js/app.js` (around lines 1301 and 1364). The later declaration takes precedence. The earlier version contains host-edit controls and more registration-capacity checks that are absent from the later version. This is a confirmed defect to resolve during the Events extraction.
4. The app currently has no `test` script in `package.json`. Existing scripts include Vite build and a TypeScript no-emit check; neither alone verifies key user journeys.
5. `index.html` loads `app.js` as a classic script while the Supabase service is an ES module that exposes `window.SupabaseService`. Any modularization must preserve initialization order and existing inline/global entry points until migrated deliberately.
6. The Events and News feed is backed by the `catchups` subscription, while unread-news tracking uses `news_reads`. These should remain separate responsibilities even if they share a data source.

## Proposed module boundaries

- `core/app-state.js`: one explicit shared state owner and narrow state access.
- `core/navigation.js`: route/view changes and navigation rendering.
- `core/auth-controller.js`: auth modal and sign-in forms; delegates identity/session operations to the service layer.
- `features/study-buddy.js`: directory rendering, profile creation, matching and chat-start action.
- `features/events-news.js`: event/news rendering, create/edit/publish, registration and modal lifecycle.
- `features/course-forums.js`: course feed, post creation and voting.
- `features/chat.js`: conversation UI, composer, attachments, emoji, voice-note UI and message actions.
- `features/profile.js`: profile view and profile-specific actions.
- `services/supabase-client.js` and focused service modules: retain one configured client and separate auth, profiles, events/news, forums, and chat operations behind stable interfaces.
- `content-filter.js`: keep as a standalone moderation service initially.

Names are provisional. Do not move code until dependencies and global/inline-handler references are inventoried and regression checks exist.

## Safe migration plan

1. Record a smoke-test checklist for guest navigation, sign-in/refresh/sign-out, Study Buddy directory, Campus News, event create/edit/close, course posts, chat send/Enter, attachment/emoji/voice controls, and profile.
2. Establish how to run the app locally and verify the current baseline. Do not assume a feature passes merely because its data exists in Supabase.
3. Fix the duplicate event renderer on this branch and add a focused regression check.
4. Extract one feature at a time, starting with a low-coupling feature; preserve the public DOM IDs and service API during the first pass.
5. Run build, available static checks, and the smoke-test checklist after every extraction.
6. Review changes in a pull request. Merge only after checks pass; never test experimental refactoring directly on `main`.
7. Do not alter the production database schema or auth configuration as part of the initial refactor.

## Verification limits

This is a static repository audit. It does not establish that the currently deployed site has been browser-tested, and it does not yet prove the root cause of the reported sign-out, missing-news, or missing-profile symptoms.
