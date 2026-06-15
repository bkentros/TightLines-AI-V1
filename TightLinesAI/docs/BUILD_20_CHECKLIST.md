# Build 20 checklist (1.0.3) — running submission log

**Purpose:** Living list of everything going into the **next production build (1.0.3)** so you can paste a clean summary into App Store Connect when you submit.

| Field | Value |
|-------|--------|
| **App version** | `1.0.3` (planned) — **not bumped yet** in `app.json` (still `1.0.2`). Bump only at the final EAS build. `1.0.2` is already live, so `1.0.3` is required for the next release. |
| **iOS build number** | **TBD** — `production` profile has `autoIncrement: true`, so EAS sets it at build time (likely `20`; this doc is named for the target). Currently `18` in `app.json`. |
| **Branch** | `release/app-store-v1` |
| **Status** | 🟡 In progress — accumulating changes for 1.0.3. **No EAS build yet.** |
| **Latest commit** | `cb939b1` — premium 6-day forecast tiles + live conditions polish |

**Live users today:** On the released App Store build **1.0.2 (build 18)**. **No OTA** — `expo-updates` is not installed, so every item below requires a brand-new binary. Metro only updates the dev client, never the App Store app.

---

## Ship status (update as you go)

| Item | Commit / ref | In build 20? | Status |
|------|----------------|--------------|--------|
| Premium 6-day forecast tiles (rounded elevated cards, bolder serif score, per-band text color + band word, TMRW marker, fixed clipped TOMORROW label, cleaner Hi/Lo) | `cb939b1` | ✅ Yes | ✅ Committed & pushed |
| Live conditions polish (brand-blue metric icons, bolder serif values, softer grid corners) | `cb939b1` | ✅ Yes | ✅ Committed & pushed |
| River Run feature (full build — currently "coming soon") | — | ⬜ | ⬜ Planned |
| *Add your next items here* | — | ⬜ | ⬜ Planned |

---

## 1. Changes in build 20 so far

### Premium UI polish — 6-day forecast + live conditions (`cb939b1`)

**Why:** Carry the premium feel from the intelligence-module emblems into the two most-viewed dashboard surfaces. No animation/glimmer added (the dashboard already has enough motion) — depth comes from static styling only.

**What changed:**

| Area | Change |
|------|--------|
| **Forecast tiles** | Redesigned each day as a rounded (10px), softly elevated card |
| **Score hierarchy** | Bigger bold serif score; score-block text color now adapts per band (`bandStyle.fg`) so the red "Tough" band gets white text for proper contrast |
| **Band word** | Each tile now names its band under the score (`PRIME / GOOD / FAIR / POOR / TOUGH`); color + label derive from the same band source so they always match the legend |
| **Header** | Subtle warm-white header strip, bolder serif date |
| **"Tomorrow"** | Old floating `TOMORROW` label was clipped by the tile's `overflow: hidden` — replaced with an in-tile brand-blue `TMRW` label + blue highlight border on the next-up day |
| **Hi/Lo footer** | Slightly stronger, better-spaced `72° / 55°` |
| **Live conditions** | Metric icons (wind / humidity / today / pressure) now brand blue; metric values bolder serif at 14px; metric grid corners rounded 6 → 8 to match the forecast cards |

**Client only:** No migrations or edge-function changes — ships entirely in the EAS binary.

**Screens touched:** `(tabs)/index.tsx`.

---

## 2. Planned before submit *(add items here)*

Use this section as your running backlog. When something is committed, move it to §1 and mark ✅ in the ship status table.

| Item | Notes | Status |
|------|--------|--------|
| **River Run** feature build | Currently a "coming soon" module on dashboard + login. Build the real daily run score / strength / fishability for Great Lakes migratory species. See `docs/finfindr_river_run_spec_v1.md`. | ⬜ Planned |
| | | ⬜ Planned |
| | | ⬜ Planned |

**Agent / you:** Edit this table as you add work. Bump `app.json` → `version` to `1.0.3` (and leave `buildNumber` to autoIncrement) only once, right before the final EAS build.

---

## 3. App Store — "What's New" draft

Paste into App Store Connect when the build is attached. **Edit as you add more changes.**

```text
• Redesigned, more premium 6-day bite forecast — clearer scores and an easier-to-read layout
• Polished live conditions panel with refreshed metrics
```

*(Add bullets here as you ship more in this build — e.g. River Run when it lands.)*

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
- [ ] `app.json` → `version` bumped to `1.0.3` (build number left to autoIncrement)
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

1. [App Store Connect](https://appstoreconnect.apple.com) → **FinFindr** → create/select version **1.0.3**
2. Select the new build (processing may take 5–15 min after upload)
3. Paste **What's New** from §3
4. Confirm **App Privacy** still matches
5. **Submit for Review** → **Release** after approval (if manual release)

- [ ] EAS production build succeeded
- [ ] Build uploaded to ASC
- [ ] Build attached to 1.0.3
- [ ] What's New pasted
- [ ] Submitted for review

---

## 6. Smoke test (TestFlight or device)

Minimum path after installing the build:

- [ ] Dashboard loads; 6-day forecast tiles render correctly (scores, band words, Hi/Lo, TMRW marker)
- [ ] Tough/red day shows white score text (contrast)
- [ ] Live conditions metrics readable (blue icons, values)
- [ ] Free tier: locked forecast days still open the paywall
- [ ] Forecast day tap → day report opens (or paywall for free tier)
- [ ] No layout clipping on Pro Max / 14-15-16 / SE

---

## 7. Quick reference

| | |
|--|--|
| **Version** | 1.0.3 (planned) |
| **Build** | TBD (autoIncrement; target 20) |
| **Key commits (so far)** | `cb939b1` (forecast + live conditions polish) |
| **EAS builds** | https://expo.dev/accounts/tightlinesai/projects/tightlines-ai/builds |
| **Prior checklist** | `docs/BUILD_17_CHECKLIST.md` (1.0.2 / build 18 — shipped) |

---

## How to update this doc

1. Add a row to **§2 Planned** when you start new work.
2. When done, move the description to **§1**, update the ship status table, and add a What's New bullet in **§3**.
3. Tell your agent: *"Add [X] to BUILD_20_CHECKLIST.md"* — same pattern as this file.
