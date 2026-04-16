# Recommender V3 — Regression anchors

Compact **“must not regress”** reference for the matrix-clean freshwater engine. Full baseline numbers and exception rationale live in [V3_POST_TUNING_STATE.md](./V3_POST_TUNING_STATE.md). Rerun full audits via [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md).

## How this doc is used

- **3.1 anchors:** Scenarios and row families below are the first things to re-check after any scoring, seasonal, or daily-payload change.
- **Tests:** High-value automated coverage is in `supabase/functions/_shared/recommenderEngine/__tests__/v3RegressionBaselines.test.ts`, `v3DailyShiftAnchors.test.ts`, and `v3SeasonalRegressionAnchors.test.ts` (see file headers).
- **Committed audit JSON:** [regression-baselines/](./regression-baselines/) locks headline metrics; `npm run audit:recommender:v3:regression-baselines` fails if committed outputs drift past those caps.

---

## 1. Unified matrix (all species)

| Layer | Must not regress |
|--------|------------------|
| **Headline contract** | 309 scenarios; top-1 / top-3 primary / disallowed / color lane all at 100%; 0 hard / 0 soft fails. |
| **LMB anchors** | Matrix anchor keys include `lmb_matrix_florida_lake`, `lmb_matrix_texas_reservoir`, `lmb_matrix_alabama_river`, `lmb_matrix_new_york_natural_lake`, plus overlay lakes (Georgia highland, Ozarks, Minnesota weed, California Delta, PNW, etc.) — all **12/12 or 4/4** top-1 primary hits on their grid slices. |
| **SMB anchors** | Great Lakes / northeast / south-central river and clear-lake grids; separation from LMB grass/frog defaults. |
| **Trout anchors** | Northern California, mountain west, tailwater, PNW river months; mouse and cold-snap behaviors. |
| **Pike anchors** | Minnesota northwoods, Adirondack clear, Rainy River, Alaska interior, ND reservoir, Idaho river overlay — jerkbait / metal / streamer posture by season. |

---

## 2. Daily-shift pairs (synthetic analysis fixtures)

These seven **paired** scenarios live in `scripts/recommender-v3-audit/runDailyShiftAudit.ts` (`PAIRS`). Each pair has **two checks** (14 total). IDs are stable regression handles:

| Pair `id` | Intent |
|-----------|--------|
| `florida_may_overcast_vs_bright` | Surface and frog lanes open under overcast; suppressed under bright May Florida largemouth lake. |
| `lmb_texas_winter_vs_fall` | Winter post-front finesse/bottom vs fall reaction/shallow Texas largemouth lake. |
| `florida_july_lowlight_vs_heat` | July low-light surface/top vs heat-limited midsummer Florida largemouth lake. |
| `smb_gl_lowlight_vs_bright` | Great Lakes smallmouth **lake** low-light surface lane vs bright midday removal of surface. |
| `trout_mouse_vs_river_wind` | NorCal July trout river: **mouse_fly** in top 3 with surface on; strong wind removes mouse lane. |
| `trout_west_warmup_vs_cold` | Western midsummer trout river: warmup shallow/fast vs cold snap slower/deeper with **hair_jig** in lure top 3. |
| `pike_lowlight_vs_bright` | MN July pike **lake** stained: low-light allows **walking_topwater** or **frog_fly** in top 3; bright removes both from top 3. |

---

## 3. Formerly fragile scoring / seasonal spots

Do **not** remove or flatten without rerunning `npm run audit:recommender:v3:freshwater:validate` and updating [regression-baselines/CHANGELOG.md](./regression-baselines/CHANGELOG.md):

| Area | Code / doc pointer |
|------|---------------------|
| **LMB** | `largemouthLakeGuardAdjustments` + Florida / south-central / PNW / GL / MW regional nudges in `scoreCandidates.ts`; “Focused largemouth overrides” in `seasonal/largemouth.ts`. |
| **SMB** | `smallmouthGuardAdjustments` (includes **PA** June river tailwater shaping); targeted `addMonths` in `seasonal/smallmouth.ts`. |
| **Trout** | Narrow regional overrides in `seasonal/trout.ts`; **Idaho April stained river** block in `practicalityFit` (`scoreCandidates.ts`). |
| **Pike** | `pikeSortSkew`; **south_central April river** row in `seasonal/pike.ts`. |
| **Daily** | Clarity-driven presence hard rule in `resolveDailyPayload.ts`. |

---

## 4. Coverage audit (static grid)

- **Intent:** All `success_targets` buckets stay `pass: true` and lure/fly `expectation_mismatches` stay at **0** in [generated/v3-coverage-audit.json](./generated/v3-coverage-audit.json).
- **Scale:** 1104 seasonal rows × synthetic daily/clarity grid — regression here usually means an archetype role or row edit went wrong globally.

---

## 5. Test map (existing vs new)

| Existing test | What it already guards |
|---------------|-------------------------|
| `v3Foundation.test.ts` | Scope, daily aggressive payload, monthly clamp, **Florida July windy lake** surface closed + pool-bound picks, trout region fallback provenance, top-3 + copy fields. |
| `peerCoherenceTopThree.test.ts` | Peer coherence pick 2 vs 3 on **windy summer lake** (same family as foundation windy test). |
| `v3Surface.test.ts` | Public surface contract smoke. |
| **New (Section 3)** | See `v3RegressionBaselines.test.ts`, `v3DailyShiftAnchors.test.ts`, `v3SeasonalRegressionAnchors.test.ts` — daily-shift conviction, headline JSON caps, pike April river seasonal lead, optional coverage headline. |

Low-value tests deliberately **not** added: per-archetype score deltas, duplicate `resolveSeasonalRowV3` for every month, or string-matching `why_chosen` copy.

---

## 6. Tie counts as a regression signal (Section 3.3)

**Decision:** Yes — `top1_tie_count` per species in `freshwater-v3-matrix-audit-summary.json` is a **formal but bounded** signal.

- **Where it surfaces:** Caps in [regression-baselines/expected-headlines.json](./regression-baselines/expected-headlines.json), enforced by `npm run audit:recommender:v3:regression-baselines` (`scripts/recommender-v3-audit/verifyRegressionBaselines.ts`) and `v3RegressionBaselines.test.ts`.
- **What counts as regression:** Any species `top1_tie_count` **strictly greater than** its `max_top1_tie_count` cap, **or** any drop below 100% on the four headline primary/disallowed/color metrics, **or** any hard/soft fail above zero.
- **What is not a regression signal (by design):** Specialty-table **bonus top-3** counts (JSON field `unexpected_top3_count`) and similar diagnostics — those can move without failing the headline verifier; treat them as tuning evidence, not CI gates, unless you intentionally add a separate threshold later.
- **Lowering ties:** If the engine **reduces** ties below the cap, the verifier still passes — caps are **ceilings**, not exact targets.
