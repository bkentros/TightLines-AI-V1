# Build 17 checklist (1.0.1) — running submission log

**Purpose:** Living list of everything going into **build 17** so you can paste a clean summary into App Store Connect when you submit.

| Field | Value |
|-------|--------|
| **App version** | `1.0.1` (`app.json`) |
| **iOS build number** | `17` (`app.json` → `ios.buildNumber`) |
| **Branch** | `release/app-store-v1` |
| **Status** | 🟡 In progress — free tier shipped on branch; more changes planned before EAS build |
| **Latest commit** | `456bcab` — premium UI polish (module emblems, River Run, account/login) |

**Live users today:** Still on the last **released** App Store build until you ship 1.0.1. No OTA — every item below requires this new binary.

---

## Ship status (update as you go)

| Item | Commit / ref | In build 17? | Status |
|------|----------------|--------------|--------|
| Auth & onboarding responsive layout hardening | `4976b7a` | ✅ Yes | ✅ Committed & pushed |
| Layout QA script (`npm run qa:responsive-auth-layout`) | `4976b7a` | ✅ Yes | ✅ Committed & pushed |
| Transparency — V1 fly scope (streamers only) | `d6e475f` / `a68d452` | ✅ Yes | ✅ Committed & pushed |
| Free tier one-time trials (Tackle Box, Water Read, Today's Bite full) | `a68d452` | ✅ Yes | ✅ Committed, migrated, edge fns deployed |
| Free tier hardening (revisit, flicker, fail-closed trial mark, admin reset) | `eec8e3b` | ✅ Yes | ✅ Committed, migrated, edge fns deployed |
| Moon/tide solunar widget removed from Today's Bite report | `eec8e3b` | ✅ Yes | ✅ Committed & pushed |
| Free tier contract smoke (`npm run qa:free-tier-today-bite-contract`) | `eec8e3b` | ✅ Yes | ✅ Committed & pushed |
| Security fix — lock `admin_lookup_user_id_by_email` to service_role (was anon/authenticated executable → email→user-id enumeration) | `20260614185501` migration | ✅ Yes (DB only) | ✅ Migrated & verified |
| Paywall reliability — fix 6-day forecast paywall dying after a few opens | `0d8c489` | ✅ Yes | ✅ Committed & pushed |
| Premium intelligence-module emblems (Water Read, Tackle Box, Today's Bite) + glint/twinkle motion | `456bcab` | ✅ Yes | ✅ Committed & pushed |
| River Run "coming soon" module (migratory species) on dashboard + login, with colored left accents on all module cards | `456bcab` | ✅ Yes | ✅ Committed & pushed |
| Admin Home layout-preview rebuilt as scrollable device frame (footer/Transparency reachable on every preset) | `456bcab` | ✅ Yes (admin-only tool) | ✅ Committed & pushed |
| Premium account/login polish — `@handle` username claim, onboarding profile hero redesign, welcome hero sheen | `456bcab` | ✅ Yes | ✅ Committed & pushed |
| *Add your next items here* | — | ⬜ | ⬜ Planned |

---

## 1. Changes in build 17 so far

### Auth & onboarding — responsive layout hardening (`4976b7a`)

**Why:** Defensive iOS hardening for smaller iPhones (SE, Mini) and large Dynamic Type — **not** driven by the Android user report (that was not actionable for this iOS app).

**What changed:**

| Area | Change |
|------|--------|
| **Layout engine** | New `lib/responsiveAuth.ts` + enhanced `hooks/useAuthScrollLayout.ts` — classifies devices as compact / standard / tall |
| **Spread layout** | `justifyContent: 'space-between'` fill only on **Plus / Pro Max** (tall tier). Smaller phones always scroll — avoids crushing copy off-screen |
| **Typography** | Minimum readable sizes (~11px+) on auth meta labels, ribbons, stamps, beacons (was 7–9px in places) |
| **Keyboard** | `keyboardVerticalOffset` + dismiss-on-drag on sign-up, sign-in, forgot/reset password, onboarding step 2 |
| **Verify email** | Switched to `ScrollView` — no longer clips on short screens |
| **Hero sizing** | `BrandScopeStage` scales by tier; Pro Max keeps 108pt stage (unchanged feel on your phone) |
| **Shared components** | `components/paper/auth/index.tsx` label/footer/ribbon floors raised |
| **QA** | `scripts/qa-responsive-auth-layout.ts` — simulates SE → Pro Max without a test device |

**Screens touched:**

- `(auth)/` — welcome, sign-up, sign-in, verify-email, forgot-password, reset-password
- `(onboarding)/` — step-1-welcome, step-2-preferences

**Pro Max / your device:** Tall tier preserved — spread layout + full hero size. No intentional visual regression.

**Files (15):** See commit `4976b7a` for full diff.

---

### Transparency — V1 fly scope (`app/how-it-works.tsx`)

**Why:** Set expectations on the **How FinFindr reads a day** screen so users know Tackle Box fly picks in V1 are streamers only.

**What changed:**

| Area | Change |
|------|--------|
| **Tackle Box card** | Info note now states fly picks are streamer patterns only in V1 — dry flies, nymphs, and other fly categories not included yet |

**Screens touched:**

- Home → **TRANSPARENCY** → **How FinFindr reads a day** (`app/how-it-works.tsx`, Tackle Box §03)

---

### Free tier one-time trials (`a68d452`)

**Why:** Give free users a real taste of core products before paywalls — Angler tier unchanged; 6-day forecast strip untouched (tomorrow score preview only; forecast day taps always paywall).

**Product rules:**

| Feature | Free tier gets | After trial used |
|---------|----------------|------------------|
| **Tackle Box** | 1 full daily-picks report + Changeup on same session | Paywall on new sessions; same exact setup same day can revisit until local midnight |
| **Water Read** | 1 lake generation | Paywall on new lakes; trial lake in history revisitable forever |
| **Today's Bite (today)** | 1 full report ever (first day cached until local midnight) | Same-day revisit full; after midnight or regenerate → partial only forever |
| **6-day forecast** | Unchanged — tomorrow preview only | Unchanged |

**Server:** Migration `20260614152959_add_free_tier_trial_flags.sql`; edge functions `recommender`, `how-fishing`, `water-reader-read`, `waterbody-polygon`, `water-reader-history`, `admin-reset-free-trials`.

**Client:** `lib/subscription.ts`, `lib/freeTrialAccess.ts`, recommender / water-reader / how-fishing screens, subscribe copy.

---

### Free tier hardening + polish (`eec8e3b`)

**Why:** Fix QA bugs from first trial pass; prevent double full Today's Bite; make admin reset safe for re-testing.

**Fixes & polish:**

| Area | Change |
|------|--------|
| **Tackle Box** | Paywall dismiss no longer leaves spinner; subscribe flow retries generation; same-day revisit after trial spent |
| **Water Read** | Trial lake enforced server-side; building/ready flicker fixed (`stableReadyReadRef`) |
| **Today's Bite** | Limited UI only when `bundle.access_tier === 'free_limited'`; cache expiry hardened; trial mark fail-closed (503 if DB write fails) |
| **Admin reset** | Admin-only (`brandonkentros@icloud.com`); **requires target free account email**; clears server trials + history + sessions + device caches |
| **Report UI** | Removed Moon & Tide solunar widget from Today's Bite (mislabeled; not used in engine timing) |
| **QA** | `scripts/free-tier-today-bite-contract-smoke.ts` + `npm run qa:free-tier-today-bite-contract` |

**Server (additional):** Migration `20260614182712_admin_lookup_user_id_by_email.sql`; redeployed `how-fishing`, `recommender`, `water-reader-read`, `waterbody-polygon`, `admin-reset-free-trials`.

**Supabase deploy status:** Migrations applied; edge functions deployed on project `hsesngprhpgajyfbrwbf`.

---

### Premium UI polish — modules, River Run, account/login (`456bcab`, `0d8c489`)

**Why:** Make the first-open and core dashboard feel premium and curated; ship the next product (River Run) as a visible "coming soon"; fix a paywall reliability bug; make admin layout QA trustworthy.

**What changed:**

| Area | Change |
|------|--------|
| **Module emblems** | Rebuilt Water Read / Tackle Box / Today's Bite icons as premium gradient SVGs with staggered glint + twinkle motion (respects Reduce Motion) |
| **River Run** | New "coming soon" module (mentions *migratory species*) on dashboard **and** login — greyed with active glimmer, solid colored left accent |
| **Module cards** | Colored left-accent rule added to every dashboard + login intelligence-module card |
| **Account / username** | Profile-setup username is now a premium `@handle` claim (curated `yourhandle` placeholder, `@` prefix, live availability tint) |
| **Onboarding hero** | Profile "top box" redesigned — field-guide rubric, brand seal, eyebrow pulse, accent rule, 01·02·03 index strip, light sheen |
| **Welcome hero** | Subtle premium light-sheen sweep on the cover; value cards carry colored accents + animated emblems |
| **Paywall reliability** | 6-day forecast paywall no longer silently stops appearing after a few opens (`SubscribePrompt` ref refactor) — `0d8c489` |
| **Admin layout preview** | Rebuilt `HomeLayoutPreviewFrame` as a true-size, natively scrollable device frame so the footer + Transparency button stay reachable on every iPhone preset (was a scaled transform that clipped the bottom) |

**Client only:** No migrations or edge-function changes — ships entirely in the EAS binary. Remote Supabase verified reconciled (all Build-17 migrations applied, edge functions ACTIVE, no ERROR-level security advisories; `admin_lookup_user_id_by_email` no longer flagged).

**Screens touched:** `(tabs)/index.tsx`, `(auth)/welcome.tsx`, `(onboarding)/step-2-preferences.tsx`, `components/paper/IntelligenceModuleIcons.tsx`, `components/dev/HomeLayoutPreviewFrame.tsx`, `app/module-icons-preview.tsx`.

---

### Testing accounts — admin vs free (read this)

**You do NOT need to give anyone `brandonkentros@icloud.com` to test or approve this build.**

| Account | Purpose | Free tier behavior |
|---------|---------|-------------------|
| **`brandonkentros@icloud.com`** | Your admin account — complimentary **Angler** (full access), not free tier | Sees **ADMIN TOOLS** in Settings (reset trials, layout preview, etc.) |
| **Any other account** (e.g. a Gmail you use for QA) | Free tier smoke tests, another agent's work, App Store review | Normal free user — gets one trial per feature |

**How re-testing works:**

1. Sign in on the **free test account** and burn trials (Tackle Box, Water Read, Today's Bite).
2. To reset and run again: sign in as **admin** → Settings → **Reset free tier trials** → enter the **free test account's email** (required). Blank only resets admin's own server state.
3. **Clear cache** alone does **not** reset server trial flags.

**Apple App Store review:** Reviewers create/use their own account — no admin access needed.

---

## 2. Planned before submit *(add items here)*

Use this section as your running backlog. When something is committed, move it to §1 and mark ✅ in the ship status table.

| Item | Notes | Status |
|------|--------|--------|
| | | ⬜ Planned |
| | | ⬜ Planned |
| | | ⬜ Planned |

**Agent / you:** Edit this table as you add work. Bump `ios.buildNumber` in `app.json` only once before the final EAS build (currently **17**).

---

## 3. App Store — “What’s New” draft

Paste into App Store Connect when build 17 is attached. **Edit as you add more changes.**

```text
• Improved sign-up and onboarding layout on all iPhone sizes
• Clearer, more readable labels on account setup screens
• Better keyboard behavior when creating an account
• Transparency page now clarifies that fly picks are streamers only in this version
• Free tier: try one full Tackle Box session, one Water Read lake, and one full Today's Bite before upgrading
• Bug fixes and polish across Tackle Box, Water Read, and Today's Bite for free users
• Redesigned, premium intelligence-module icons on the dashboard
• New "River Run" module preview for Great Lakes migratory species — coming soon
• A more premium account setup: claim your @handle and a refreshed profile screen
• Fixed an issue where the forecast paywall could stop appearing
```

*(Add bullets here as you ship more in this build.)*

---

## 4. Pre-build checks

Run before `eas build`:

```bash
cd TightLinesAI
npm run qa:responsive-auth-layout          # auth layout matrix — no device needed
npm run qa:free-tier-today-bite-contract   # Today's Bite free-tier contract smoke
npx tsc --noEmit                           # typecheck
```

- [ ] All §2 planned items done or deferred to a later build
- [ ] `app.json` → `version` still `1.0.1`, `buildNumber` is `17` (or final number you choose)
- [ ] Changes committed on `release/app-store-v1` (never commit `.env`)
- [ ] `git push origin release/app-store-v1`

---

## 5. Build & submit (when ready)

```bash
cd "/Users/brandonkentros/TightLines AI V1/TightLinesAI"
eas build --platform ios --profile production --non-interactive
```

After the build finishes:

```bash
eas submit --platform ios --profile production --latest
```

**App Store Connect**

1. [App Store Connect](https://appstoreconnect.apple.com) → **FinFindr** → version **1.0.1**
2. Select **build 17** (processing may take 5–15 min after upload)
3. Paste **What’s New** from §3
4. Confirm **App Privacy** still matches
5. **Submit for Review** → **Release** after approval (if manual release)

- [ ] EAS production build succeeded
- [ ] Build uploaded to ASC
- [ ] Build 17 attached to 1.0.1
- [ ] What’s New pasted
- [ ] Submitted for review

---

## 6. Smoke test (TestFlight or device)

Minimum path after installing build 17:

- [ ] Welcome screen — readable, no clipped text
- [ ] Create account — all fields visible; keyboard does not hide inputs
- [ ] Verify email screen scrolls if needed
- [ ] Onboarding profile setup (username + home water)
- [ ] Sign in with Apple + email sign-in still work
- [ ] Home loads after onboarding

**Free tier (use a separate free account — not admin):**

- [ ] Today's Bite — first generate = full report
- [ ] Today's Bite — same day reopen = full (cached)
- [ ] Tackle Box — one full session + Changeup same day
- [ ] Water Read — one lake generates; trial lake reopens from Recent Reads
- [ ] After trials spent — paywalls on new Tackle Box / new lake; Today's Bite partial after midnight

**Optional re-test loop (admin only):** Settings → Reset free tier trials → enter free test email.

---

## 7. Not in this binary (web / legal-site only)

These commits are on the branch but **do not** ship inside the iOS app — listed so you do not double-count them in “What’s New”:

| Item | Notes |
|------|--------|
| TikTok / download funnel (`finfindr.app/get`, `/download`) | Cloudflare Pages — deploy from `main` / `legal-site/` |

---

## 8. Quick reference

| | |
|--|--|
| **Version** | 1.0.1 |
| **Build** | 17 |
| **Key commits (so far)** | `4976b7a` (auth layout), `a68d452` (free tier trials), `eec8e3b` (hardening), `0d8c489` (paywall fix), `456bcab` (premium UI polish) |
| **EAS builds** | https://expo.dev/accounts/tightlinesai/projects/tightlines-ai/builds |
| **Prior checklist** | `docs/BUILD_14_CHECKLIST.md` (build 14–16 era) |

---

## How to update this doc

1. Add a row to **§2 Planned** when you start new work.
2. When done, move the description to **§1**, update the ship status table, and add a What’s New bullet in **§3**.
3. Tell your agent: *“Add [X] to BUILD_17_CHECKLIST.md”* — same pattern as this file.
