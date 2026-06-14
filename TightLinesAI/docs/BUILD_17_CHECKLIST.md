# Build 17 checklist (1.0.1) — running submission log

**Purpose:** Living list of everything going into **build 17** so you can paste a clean summary into App Store Connect when you submit.

| Field | Value |
|-------|--------|
| **App version** | `1.0.1` (`app.json`) |
| **iOS build number** | `17` (`app.json` → `ios.buildNumber`) |
| **Branch** | `release/app-store-v1` |
| **Status** | 🟡 In progress — more changes planned before EAS build |

**Live users today:** Still on the last **released** App Store build until you ship 1.0.1. No OTA — every item below requires this new binary.

---

## Ship status (update as you go)

| Item | Commit / ref | In build 17? | Status |
|------|----------------|--------------|--------|
| Auth & onboarding responsive layout hardening | `4976b7a` | ✅ Yes | ✅ Committed locally |
| Layout QA script (`npm run qa:responsive-auth-layout`) | `4976b7a` | ✅ Yes | ✅ Committed locally |
| Transparency — V1 fly scope (streamers only) | — | ✅ Yes | ⬜ Uncommitted |
| Free tier one-time trials (Tackle Box, Water Read, Today's Bite full) | — | ✅ Yes | ✅ Deployed (migration + edge fns) |
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

### Free tier one-time trials (Tackle Box, Water Read, Today's Bite full)

**Why:** Give free users a real taste of core products before paywalls — Angler tier unchanged; 6-day forecast strip untouched (tomorrow score preview only).

**What changed:**

| Feature | Free tier gets | After trial used |
|---------|----------------|------------------|
| **Tackle Box** | 1 full daily-picks report + Changeup on same session | Paywall on new sessions |
| **Water Read** | 1 lake generation | Paywall on new lakes (can re-open trial lake via history) |
| **Today's Bite (today)** | 1 full today report | Later today → limited report surface |
| **6-day forecast** | Unchanged — tomorrow preview only | Unchanged |

**Server:** Migration `20260614120000_add_free_tier_trial_flags.sql`; edge functions `recommender`, `how-fishing`, `water-reader-read`, `waterbody-polygon`, `water-reader-history`, `admin-reset-free-trials`.

**Client:** `lib/subscription.ts`, `lib/freeTrialAccess.ts`, recommender / water-reader / how-fishing screens, subscribe copy, Settings → ADMIN TOOLS → Reset free tier trials.

**Deploy before testing:** Run migration + deploy edge functions on Supabase.

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
```

*(Add bullets here as you ship more in this build.)*

---

## 4. Pre-build checks

Run before `eas build`:

```bash
cd TightLinesAI
npm run qa:responsive-auth-layout   # auth layout matrix — no device needed
npx tsc --noEmit                    # typecheck
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
| **Key commit (so far)** | `4976b7a` |
| **EAS builds** | https://expo.dev/accounts/tightlinesai/projects/tightlines-ai/builds |
| **Prior checklist** | `docs/BUILD_14_CHECKLIST.md` (build 14–16 era) |

---

## How to update this doc

1. Add a row to **§2 Planned** when you start new work.
2. When done, move the description to **§1**, update the ship status table, and add a What’s New bullet in **§3**.
3. Tell your agent: *“Add [X] to BUILD_17_CHECKLIST.md”* — same pattern as this file.
