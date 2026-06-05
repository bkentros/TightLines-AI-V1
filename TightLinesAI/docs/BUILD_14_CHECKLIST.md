# Build 14 checklist (1.0.1) — pre-marketing update

Target: **build 14** tomorrow → submit → approved **before marketing early next week**.

Build **13** stays live on the App Store while this ships.

---

## Overview

| Item | What changes | Needs App Review? |
|------|----------------|-------------------|
| **PostHog** | EAS production secrets + events in live app | Yes (new binary) |
| **App icon** | Bigger logo in `assets/icon.png` | Yes (new binary) |
| **Legal pages** | Privacy / Terms / Safety aligned + published | Web deploy (separate from binary); verify URLs |

---

## 1. App icon (bigger logo)

**Files**
- `TightLinesAI/assets/icon.png` — **1024×1024** (required)
- Optional: `TightLinesAI/assets/splash-icon.png` — keep consistent if you change branding

**Checklist**
- [ ] Scale logo up inside the canvas (leave safe padding — iOS rounds corners)
- [ ] Preview on iPhone home screen (dev build or simulator) before EAS build
- [ ] Do **not** put critical detail in corners

**No code change** beyond the image asset unless icon path changes in `app.json` (already `./assets/icon.png`).

---

## 2. PostHog (production analytics)

**Why build 14:** Store builds do **not** read local `.env`. PostHog key must be in **EAS production environment**.

### A. Add EAS secrets (before `eas build`)

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

- [ ] Read all three in-app docs in Settings (Terms, Privacy, Safety)
- [ ] Compare to live URLs:
  - https://finfindr.app/privacy
  - https://finfindr.app/terms
  - https://finfindr.app/safety
  - https://finfindr.app/support
- [ ] Confirm **FinFindr LLC** is named as operator (especially after org migration completes)
- [ ] Confirm **PostHog** / analytics wording matches build 14 (analytics enabled in production)
- [ ] Confirm **account deletion** and **subscription cancel** language is clear
- [ ] Update **“Last updated”** date on any page you change (in-app `legalDocuments.ts` + HTML)
- [ ] **Deploy `legal-site/`** to Cloudflare Pages (finfindr.app) — website does **not** update from the iOS build alone
- [ ] Re-check live URLs in a private browser after deploy

**Agent task:** sync `legalDocuments.ts` ↔ `legal-site/*.html`, then deploy web.

---

## 4. Version & build numbers

**File:** `TightLinesAI/app.json`

- [ ] `version`: `1.0.0` → **`1.0.1`**
- [ ] `ios.buildNumber`: EAS **autoIncrement** will bump (expect **14**)

**Optional:** Add short **What’s New** in App Store Connect:

```text
• Improved app icon visibility
• Analytics improvements for app reliability
• Legal and policy updates
```

---

## 5. Build & submit (tomorrow)

```bash
cd TightLinesAI
git status                    # clean, on release branch
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

**Checklist**
- [ ] Repo committed (icon + legal copy + version bump; **not** `.env`)
- [ ] EAS production PostHog vars set
- [ ] `legal-site` deployed if legal HTML changed
- [ ] Pick **build 14** / **1.0.1** on submit
- [ ] **Release** after approval (manual release if still configured)

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

## 7. Order of work (recommended)

1. **Legal** — edit + deploy `legal-site` (no review wait)
2. **Icon** — new `icon.png`
3. **EAS PostHog** secrets
4. **Bump** `1.0.1` in `app.json`
5. **`eas build`** → **`eas submit`**
6. **Wait for approval** → release **1.0.1**
7. **Marketing** early next week

---

## 8. Bring to your agent

Paste this file and say:

> “Execute BUILD_14_CHECKLIST.md — icon, PostHog EAS secrets, legal sync + deploy, 1.0.1, build and submit.”

Or do icon/legal yourself and ask agent only for technical steps.

---

## 9. Branded download link (finfindr.app)

**Share this everywhere (bio, social, friends):**

```
https://finfindr.app/download
```

Opens the App Store directly (302 redirect). Also works: `https://finfindr.app/app`

**Permanent App Store URL (same destination):** `https://apps.apple.com/app/id6769178136`

### Deploy to Cloudflare (you do this — agent has no Cloudflare login)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → your **finfindr.app** Pages project
3. **Create deployment** / upload **`legal-site/`** folder (same project as privacy/terms)
4. After deploy, open `https://finfindr.app/download` on your phone — tap **Download on the App Store**

Files live in repo: `legal-site/download/index.html`, `legal-site/assets/download.css`

---

## Quick links

- **Public download:** https://finfindr.app/download
- EAS builds: https://expo.dev/accounts/tightlinesai/projects/tightlines-ai/builds
- App Store Connect: https://appstoreconnect.apple.com
- PostHog: https://us.posthog.com (or your project URL)
- Weekly monitoring: `docs/FOUNDER_WEEKLY_ROUTINE.md`
