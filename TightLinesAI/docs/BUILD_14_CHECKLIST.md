# Build 14 checklist (1.0.1) — pre-marketing update

Target: **build 14** → submit → approved **before marketing**.

Build **13** stays live on the App Store until you **release 1.0.1** after approval.

---

## Ship status (updated)

| Item | Code / config | Status |
|------|----------------|--------|
| Email sign-up (all domains) | `6696989` | ✅ Shipped in repo |
| Legal sync + June 2 copy | `792284f` | ✅ Shipped in repo |
| Legal site deploy | Cloudflare Pages | ✅ You deployed |
| Support email routing | Cloudflare | ✅ You configured |
| Apple Sign-In UX (copy only) | `1ab4434` | ✅ Shipped — auth flow unchanged |
| App icon +15% | `1ab4434` | ✅ Shipped |
| Version **1.0.1** | `app.json` | ✅ Shipped |
| PostHog EAS production secrets | expo.dev | ✅ Set |
| PostHog crash hardening | `b4c3b1c` | ✅ Shipped |
| Pressure Watch Out copy | `4bca9fb` | ✅ Shipped (earlier) |
| **EAS build + submit** | — | ⏳ **You** — see §5 |
| **App Store Connect** (What's New, privacy, submit for review) | — | ⏳ **You** |
| **Release 1.0.1** after approval | — | ⏳ **You** (manual release) |

**Build 13 users today:** unchanged. No OTA. PostHog and other build 14 changes apply only after users install **1.0.1**.

### Change safety (why this should not break the app)

| Change | Risk | Mitigation |
|--------|------|------------|
| PostHog | Was crash source before | Lazy init, no lifecycle autocapture, try/catch on every call, provider error boundary; invalid key → analytics off, app runs |
| Email allowlist removed | Low | Supabase still validates; only removed client-side block |
| Apple Sign-In UX | Low | Error **copy only** — same `signInWithApple`, session, navigation |
| Icon +15% | None | Asset only |
| Legal copy | None | Display text only |

---

## Overview

| Item | What changes | Needs App Review? |
|------|----------------|-------------------|
| **PostHog** | EAS production secrets + events in live app | Yes (new binary) |
| **App icon** | Bigger logo in `assets/icon.png` | Yes (new binary) |
| **Apple Sign-In UX** | Clearer errors when Apple email conflicts with existing email/password account | Yes (new binary) |
| **Email sign-up** | Any valid email domain (business/custom) | Yes (new binary) |
| **Legal pages** | Privacy / Terms / Safety aligned + published | Web deploy (separate from binary); verify URLs |

---

## 1. App icon (bigger logo)

**Files**
- `TightLinesAI/assets/icon.png` — **1024×1024** (required)
- Optional: `TightLinesAI/assets/splash-icon.png` — keep consistent if you change branding

**Checklist**
- [x] Scale logo up inside the canvas (+15%, green arrow safe)
- [x] Preview (`assets/icon-preview-phone-scale.png`)
- [x] Do **not** put critical detail in corners

**No code change** beyond the image asset unless icon path changes in `app.json` (already `./assets/icon.png`).

---

## 2. PostHog (production analytics)

**Why build 14:** Store builds do **not** read local `.env`. PostHog key must be in **EAS production environment**.

### A. Add EAS secrets (before `eas build`) — ✅ done

In [expo.dev](https://expo.dev) → project **tightlines-ai** → **Environment variables** → **production**:

| Variable | Value |
|----------|--------|
| `EXPO_PUBLIC_POSTHOG_API_KEY` | Your PostHog project API key |
| `EXPO_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` |

Or CLI (from `TightLinesAI/`):

```bash
eas env:create --name EXPO_PUBLIC_POSTHOG_API_KEY --value "phc_..." --environment production --visibility secret
eas env:create --name EXPO_PUBLIC_POSTHOG_HOST --value "https://us.i.posthog.com" --environment production --visibility plaintext
```

### B. Verify before build

```bash
cd TightLinesAI
npm run prebuild:check-env   # local .env can stay store-like OR posthog-enabled for dev testing
```

Local `.env` does **not** affect EAS production if secrets are set on Expo.

### C. After build 14 is on device (TestFlight or Store)

- [ ] Sign in → **Settings → ADMIN TOOLS → Send analytics test event**
- [ ] PostHog → **Live events** → confirm `prebuild_smoke_test` or `app_opened`
- [ ] Build **FinFindr weekly summary** dashboard (see `FOUNDER_WEEKLY_ROUTINE.md` / prior PostHog notes)

### D. App Store Connect — App Privacy

- [ ] Confirm **App Privacy** labels still match data collection (analytics / usage data if prompted)
- [ ] Privacy Policy URL unchanged: `https://finfindr.app/privacy` (already mentions PostHog)

---

## 3. Privacy / Terms / Safety

**Two places must stay in sync:**

| In-app (source of truth for copy) | Public website |
|-----------------------------------|----------------|
| `TightLinesAI/lib/legalDocuments.ts` | `legal-site/privacy/index.html` |
| same | `legal-site/terms/index.html` |
| same | `legal-site/safety/index.html` |

**Also:** Support page `legal-site/support/index.html` if contact copy changes.

### Checklist

- [x] Read all three in-app docs in Settings (Terms, Privacy, Safety)
- [x] Compare to live URLs (repo + live were aligned as of May 27, 2026):
  - https://finfindr.app/privacy
  - https://finfindr.app/terms
  - https://finfindr.app/safety
  - https://finfindr.app/support
- [x] Confirm **FinFindr LLC** is named as operator (especially after org migration completes)
- [x] Confirm **PostHog** / analytics wording matches build 14 (analytics enabled in production)
- [x] Confirm **account deletion** and **subscription cancel** language is clear
- [x] Update **“Last updated”** date on any page you change (in-app `legalDocuments.ts` + HTML) → **June 2, 2026**
- [x] Build 14 copy: business/custom email sign-up noted in Privacy + Terms
- [x] **Deploy `legal-site/`** to Cloudflare Pages (finfindr.app)
- [x] Re-check live URLs in a private browser after deploy
- [x] **Inbound support email:** Cloudflare Email Routing for `support@finfindr.app`. See `docs/FINFINDR_EMAIL_SETUP.md`

**Agent task:** sync `legalDocuments.ts` ↔ `legal-site/*.html`, then deploy web.

---

## 4. Version & build numbers

**File:** `TightLinesAI/app.json`

- [x] `version`: **`1.0.1`**
- [ ] `ios.buildNumber`: EAS **autoIncrement** will bump to **14** on next build

**Add in App Store Connect** when submitting for review:

```text
• Sign up with any email address, including business domains
• Improved app icon visibility
• Clearer sign-in guidance when an account already exists
• Analytics improvements for app reliability
• Legal and policy updates
```

---

## 5. Build & submit — **your step**

**One command** (build on EAS, then auto-upload to App Store Connect when the build finishes):

```bash
cd "/Users/brandonkentros/TightLines AI V1/TightLinesAI" && eas build --platform ios --profile production --auto-submit
```

Stay logged in to Expo (`eas login`). First run may prompt for Apple credentials — same as build 13.

**After the command finishes:**

1. [App Store Connect](https://appstoreconnect.apple.com) → **FinFindr** → version **1.0.1**
2. Select **build 14** (processing may take 5–15 min after upload)
3. Paste **What’s New** (§4 above)
4. Confirm **App Privacy** still matches (analytics / usage data)
5. **Submit for Review**
6. After approval → **Release** (manual release if still configured)

**Checklist**
- [x] Repo committed on `release/app-store-v1` (not `.env`)
- [x] EAS production PostHog vars set
- [x] `legal-site` deployed
- [ ] Run build command above
- [ ] ASC: attach build 14, What's New, submit for review
- [ ] **Release** after approval

**Review expectation:** Smaller update than 4.3 fight — often **1–3 days**; not guaranteed.

---

## 6. Pre-marketing smoke (build 14)

Before you post on social **early next week**:

- [ ] Install **1.0.1** from TestFlight or App Store
- [ ] Cold launch, Sign in with Apple, Home layout
- [ ] Today’s Bite, Tackle Box (fly card), Water Read once
- [ ] PostHog event visible in dashboard
- [ ] Icon looks right on home screen
- [ ] Settings → Terms / Privacy / Safety open correctly
- [ ] Developer name: **FinFindr LLC** if org migration finished (optional check)

---

## 7. Apple Sign-In UX (auth polish)

### How it works today (build 13)

| Screen | Apple button | Intended use |
|--------|--------------|--------------|
| **Welcome** | Sign in with Apple | **New users:** one-tap creates account → profile setup (username, home water) → home. **Returning Apple users:** one-tap sign-in → home. |
| **Sign in** | Sign in with Apple | **Returning users** who originally created their account with Apple |
| **Create account** (email form) | No Apple button | Email + password sign-up only |

Apple is **not** “sign-in only for people who already have accounts.” On the welcome screen it is also a **valid way to create a new account** (Supabase `signInWithIdToken` creates the user on first Apple authorization).

### What went wrong in your test (founder device)

Likely cause: **Apple ID profile on the device was incomplete** (name/email not fully set up in Settings → Apple Account). Wife’s test on a properly configured Apple ID worked as designed: Apple one-tap → onboarding.

Other case that can still happen: user already has an **email/password** FinFindr account with the same email — Apple cannot attach automatically, and build 13 shows a generic **“Apple Sign-In failed”** banner instead of helpful copy.

Build 14 still improves messaging for edge cases; the happy path (new Apple user → onboarding) is already working in build 13.

### Build 14 fixes (code)

**Files:** `TightLinesAI/lib/auth.ts`, `TightLinesAI/app/(auth)/welcome.tsx`, `TightLinesAI/app/(auth)/sign-in.tsx`

- [x] Map Supabase “user already registered” / identity-conflict errors to friendly copy
- [x] Do **not** show generic “Apple Sign-In failed” for that case
- [ ] Optional: on welcome, short helper under Apple button — *“New here? Apple creates your account in one tap.”*
- [ ] Optional (later): Supabase **manual identity linking** so email users can add Apple later — not required for build 14

### What to tell users (support / friends)

| Situation | Tell them |
|-----------|-----------|
| **Brand-new user** | On welcome, tap **Sign in with Apple** *or* **Create account** (email). Both work. Apple → setup screen → done. |
| **Returning user, signed up with Apple** | Welcome or Sign in → **Sign in with Apple** |
| **Returning user, signed up with email** | **Sign in** → email + password (Apple will not work until linking is built) |

### Test before submit

- [ ] Fresh Apple ID (or delete test user in Supabase) → Apple on welcome → lands on profile setup → finishes → home
- [ ] Same Apple user again → Apple → home (no onboarding)
- [ ] Email/password account exists → Apple on welcome → friendly “use email sign-in” message (not generic failure)
- [ ] Email sign-in still works for that account

---

## 8. Order of work

1. ~~Legal, Apple Sign-In, icon, PostHog, 1.0.1~~ — **done**
2. **`eas build --auto-submit`** — you
3. **App Store Connect** — attach build, What's New, submit for review — you
4. **Wait for approval** → release **1.0.1** — you
5. **PostHog Live events** after release — optional 5 min check
6. **Marketing** when ready

---

## 9. Bring to your agent

Paste this file and say:

> “Execute BUILD_14_CHECKLIST.md — Apple Sign-In UX, icon, PostHog EAS secrets, legal sync + deploy, 1.0.1, build and submit.”

Or do icon/legal yourself and ask agent only for technical steps.

---

## 10. Branded download link (finfindr.app)

**Share this everywhere (bio, social, friends):**

```
https://finfindr.app/download
```

Opens the App Store directly (302 redirect). Also works: `https://finfindr.app/app`

**Permanent App Store URL (same destination):** `https://apps.apple.com/app/id6769178136`

### Cloudflare — make `/download` go straight to App Store (you do this)

Git pushes to `main` only work if Pages is connected and **Production** points at the latest deploy. If you still see the legal or download landing page, do **both** steps below.

#### A) Zone redirect rule (fastest — works even if Pages is stale)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → select zone **finfindr.app**
2. **Rules** → **Redirect Rules** → **Create rule**
3. **Name:** `App Store download`
4. **When incoming requests match:** Custom filter expression:
   ```
   (http.request.uri.path eq "/download") or (http.request.uri.path eq "/download/") or (http.request.uri.path eq "/app") or (http.request.uri.path eq "/app/")
   ```
5. **Then:** Dynamic redirect → **302** → URL `https://apps.apple.com/app/id6769178136`
6. **Deploy** the rule
7. **Caching** → **Configuration** → **Purge Everything** (clears old HTML)

#### B) Pages production deploy (keeps privacy/terms in sync)

1. **Workers & Pages** → project **finfindr-auth** (custom domain `finfindr.app`)
2. **Settings** → **Builds & deployments** → confirm **Production branch** = `main`, **Root directory** = `legal-site`
3. **Deployments** → latest commit from GitHub should be **Production** (not an old manual upload). If not: **⋯** → **Promote to production**
4. Or deploy from terminal (API token required):
   ```bash
   export CLOUDFLARE_API_TOKEN='...'
   bash TightLinesAI/scripts/deploy-legal-site.sh
   ```

Redirect logic in repo: `legal-site/_redirects` + `legal-site/functions/download*.js`

---

## Quick links

- **Public download:** https://finfindr.app/download
- EAS builds: https://expo.dev/accounts/tightlinesai/projects/tightlines-ai/builds
- App Store Connect: https://appstoreconnect.apple.com
- PostHog: https://us.posthog.com (or your project URL)
- Weekly monitoring: `docs/FOUNDER_WEEKLY_ROUTINE.md`
