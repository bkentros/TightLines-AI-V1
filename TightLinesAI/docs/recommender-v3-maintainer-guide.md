# Recommender V3 — Maintainer Guide

This document describes **legacy v3** internals (audits, regression tests, and offline tooling import `recommenderEngine/legacyV3.ts`). **The live Edge recommender** is `runRecommenderRebuildSurface` — see [`tightlines_recommender_architecture_clean.md`](./tightlines_recommender_architecture_clean.md) before large changes.

Historical tuning context: [recommender-v3-nine-of-ten-plan.md](recommender-v3-nine-of-ten-plan.md).

---

## Overview

The V3 freshwater recommender is **deterministic**: the same request and shared-condition analysis always yields the same ranked picks and copy. Logic is **layered**: a monthly **seasonal row** defines eligible pools and biology; a **daily payload** encodes posture and windows; a **resolved profile** clamps daily preferences inside that month; **scoring** ranks candidates inside the pools; **top-three selection** applies coherence and diversity; **copy and color** explain outcomes. The engine supports **four species** (`largemouth_bass`, `smallmouth_bass`, `northern_pike`, `trout`) and **two contexts** (`freshwater_lake_pond`, `freshwater_river`). **Trout is river-only** at the API boundary (`v3/scope.ts`).

---

## The six layers

**1. Seasonal resolution** — Chooses the `RecommenderV3SeasonalRow` for `(species, region_key, month, context)`, with optional `state_code` match taking priority over the unscoped row, then `REGION_FALLBACKS` when no row exists for the request region. Authoritative: `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.ts`.

**2. Daily payload** — Turns shared How’s Fishing analysis into posture, surface/reaction windows, opportunity mix, and notes. Authoritative: `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/resolveDailyPayload.ts`.

**3. Resolved profile (clamp)** — Maps the daily payload into `RecommenderV3ResolvedProfile`: tactical preferences constrained by the seasonal monthly baseline. Authoritative: `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/resolveFinalProfile.ts`.

**4. Scoring** — Per-archetype fits, breakdown lines, sort score, provisional `why_chosen`, color theme from `resolveColorDecisionV3`. Guards live alongside. Authoritative: `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/scoring/scoreCandidates.ts` and `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/scoring/guards/`.

**5. Top-three selection** — Picks three coherent candidates, computes `diversity_bonus`, rebuilds final `why_chosen`, and attaches `color_decision`. Authoritative: `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/topThreeSelection.ts`.

**6. Copy and color rationale** — `buildWhyChosen` / `phraseForTopDriver` / selection-role suffixes; `colorReasonPhraseV3` and the clarity/light matrix. Authoritative: `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/recommendationCopy.ts` and `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/colorDecision.ts`.

---

## Data model

A **`RecommenderV3SeasonalRow`** (`v3/contracts.ts`) is keyed in authoring by `species`, `region_key`, `month`, `context`, and optional `state_code` (empty string omitted in the row key). Important fields:

| Field | Role |
|--------|------|
| `monthly_baseline` | Allowed columns/paces/presence, forage, typical water column/location, surface flag. |
| `primary_lure_ids` / `primary_fly_ids` | Authored monthly primaries (order matters for tie nudges). |
| `eligible_lure_ids` / `eligible_fly_ids` | The ranked pool (≥3 each); scoring never leaves this set. |
| `state_scoring_adjustments` | Optional per-archetype deltas on **state-scoped** rows; optional `when: { clarity }`. |

**Authored sources per species**

- Largemouth: `v3/seasonal/largemouth/index.ts` composes base + overrides (see below). Entry re-export: `v3/seasonal/largemouth.ts`.
- Smallmouth: `v3/seasonal/smallmouth.ts`
- Trout: `v3/seasonal/trout.ts` (river-only rows)
- Pike: `v3/seasonal/pike.ts`

Shared helpers: `v3/seasonal/tuning.ts` (`upsertSeasonalRow`, `finalizeSeasonalRows`, …), `v3/seasonal/validateSeasonalRow.ts`.

---

## State gating

- **`STATE_SPECIES_MAP`** — `TightLinesAI/supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts`: which legacy species and contexts are advertised per US state for the product.
- **`STATE_TO_REGION`** — `TightLinesAI/supabase/functions/_shared/howFishingEngine/config/stateToRegion.ts`: bulk mapping from state to canonical `RegionKey` for analysis and recommender.
- **`REGION_FALLBACKS`** — In `resolveSeasonalRow.ts`: ordered substitute regions if no row exists for the request region.
- **Request flow** — `runRecommenderV3.ts` resolves species/context via `scope.ts`, builds analysis, resolves daily payload, then **`resolveSeasonalRowV3(species, req.location.region_key, month, context, req.location.state_code ?? undefined)`**. If `state_code` matches a row’s `state_code`, that row wins over the unscoped row for the same tuple; `used_state_scoped_row` is exposed on the response.

---

## How to add or modify a seasonal row

1. **Pick the species module** (see Data model) and locate the `addMonths` / `upsertSeasonalRow` pattern used there.
2. **Respect key collision rules** — `upsertSeasonalRow` in `tuning.ts` is **last-write-wins** for the same `(species, region_key, month, context, state_code?)` key. Registration order matters: a later call replaces an earlier row with the same key.
3. **Largemouth package layout** — `v3/seasonal/largemouth/index.ts` calls, in order: `registerBaseLargemouthRows` (`registerBase.ts` → `base.ts` + `baseContinued.ts`), **`registerFocusedAuditedLargemouthOverrides`** (`overrides/focusedAudited.ts`), **`registerSoutheastAtlanticLargemouthOverrides`** (`overrides/southeastAtlantic.ts`). Focused audited overrides are a **single ordered module** so matrix-proven tweaks can override base months **without reordering** the large base files. New audited overrides belong **appended inside `focusedAudited.ts`** (or in a new module imported **after** base and **before or after** other overrides per product intent), not inserted mid-base, unless you intentionally replace a key and accept last-write semantics.
4. **State-scoped rows** — Use a **distinct** `state_code` on the row so the key differs from the unscoped row (`tuning.ts` `seasonalRowKey`). Clone authored fields from the base row, then adjust deltas or primaries as designed.
5. **Validate** — Run `npm run audit:recommender:v3:freshwater:validate` and **`npm run audit:recommender:v3:regression-baselines`**. If baselines fail, treat that as a **hard gate**: fix the seasonal authoring (or, with **product owner approval**, update the committed baseline JSON under `scripts/recommender-v3-audit/regression-baselines/`). Do not bypass failing baselines on your own.

---

## How to add state-scoped tuning (no hardcoded branches)

1. Identify the base `(species, region_key, month, context)` row to clone.
2. **Clone** into a new row with `state_code` set to the two-letter state.
3. Add **`state_scoring_adjustments`**: `{ archetype_id, delta }` entries; use **`when: { clarity: "stained" }`** (or another `WaterClarity`) if the nudge must be conditional.
4. **Register** the scoped row **after** the base row in the same species file so both exist and resolution can find the unscoped fallback.
5. **Test** — Extend `v3/seasonal/resolveSeasonalRow.stateScoped.test.ts` for resolver preference and, if needed, a scoring smoke test via `computeRecommenderV3`.
6. **Never** reintroduce `stateCode === "XX"` branches in `v3/scoring/guards/` or `scoreCandidates.ts`. If you reach for that, you need another `state_scoring_adjustments` entry or a new optional predicate on `StateScopedDeltaV3` in `v3/contracts.ts`.

---

## How to extend breakdown-driven `why_chosen`

1. If you add a new **`code`** in the `breakdown` array built in `v3/scoring/scoreCandidates.ts`, add a matching branch in **`phraseForTopDriver`** in `v3/recommendationCopy.ts` (or explicitly return `null` to fall back to legacy slot-1 text).
2. Add a **unit test** in `v3/recommendationCopy.test.ts` with synthetic breakdown where your code is the sole positive top driver and assert the output contains the expected substring.
3. **Diversity** — The string **` It rounds out the lineup with a different look.`** is appended only when `changeupBonus > 0` and the joined parts do not already contain `rounds out the lineup` (case-insensitive). Final copy is rebuilt in `topThreeSelection.ts` after bonuses are known.

---

## How to extend color rationale

1. If you introduce a new **`reason_code`** on `ResolvedColorDecisionV3` in `v3/colorDecision.ts`, extend the **`COLOR_MATRIX`** and **`colorThemeFromReasonCode`** logic as needed.
2. Add the **product phrase** to **`COLOR_REASON_PHRASES`** in the same file (keep copy in sync with product).
3. Extend **`v3/colorDecision.test.ts`**: non-empty phrase for the new code, and matrix path coverage if applicable.

---

## Testing and verification ladder

Run **in this order** before pushing recommender work:

1. `deno check supabase/functions/_shared/recommenderEngine supabase/functions/_shared/howFishingEngine/normalize`
2. `deno test supabase/functions/_shared/recommenderEngine` — expect **49 passed / 2 failed** (only the two tests documented in `docs/recommender-v3-audit/KNOWN_AUTHORING_ISSUES.md`).
3. `deno test supabase/functions/_shared/howFishingEngine/normalize` — **all pass**.
4. `npm run audit:recommender:v3:freshwater:validate` — **exit 0**; matrix headlines must match `docs/recommender-v3-audit/generated/PRE_9OF10_BASELINE.md`.
5. `npm run audit:recommender:v3:regression-baselines` — **exit 0**.

**Rule:** (1)–(4) must be clean except the two known failures; (5) must always pass for merge confidence on numeric contracts.

---

## Documented deviations and known gaps

**Section 3B layout (scoring entrypoint).** Production scoring lives in `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/scoring/scoreCandidates.ts`. The thin barrel file `v3/scoreCandidates.ts` only re-exports scoring and `peerArchetypesCoherenceConflict` for stable import paths—grep or open the `scoring/` file when changing ranks.

**Largemouth overrides live in one focused module.** Audited high-value overrides are concentrated in `v3/seasonal/largemouth/overrides/focusedAudited.ts` rather than many per-region files. That keeps **last-write-wins** predictable: the override file runs after base registration and wins on key collisions. Splitting into more files would be a refactor: preserve the same **registration order contract** in `largemouth/index.ts` and move slices of `addLargemouthMonths` calls into new modules imported in the intended order.

**`state_scoring_adjustments` and the breakdown.** Those deltas are applied inside **`practicality_fit`** in scoring, so they appear in the **`practicality_fit`** breakdown line, not a separate code. That is intentional for matrix parity. If product ever needs a distinct top-driver phrase, introduce a dedicated breakdown code (e.g. `state_scope_fit`), wire it in `scoreCandidates.ts`, and teach **`phraseForTopDriver`** about it.

**Two KNOWN_AUTHORING_ISSUES tests** — See `docs/recommender-v3-audit/KNOWN_AUTHORING_ISSUES.md`. **Do not “fix”** the underlying seasonal rows without product owner approval; the failures are recorded evidence.

**`diversity_bonus`** — Computed in `topThreeSelection.ts` after core scoring; it is **not** a `breakdown` entry. It appears on **`RecommenderV3RankedArchetype`** and can append the diversity **why_chosen** suffix when positive.

---

## Glossary

| Term | Definition |
|------|------------|
| **Seasonal row** | One monthly biology record: species, region, month, context, pools, baseline. |
| **Monthly baseline** | `monthly_baseline`: allowed tactical lanes, forage story, typical column/location, surface flag. |
| **Tactical shift** | Daily-driven nudges (column/pace/presence shifts) inside the monthly envelope. |
| **Resolved profile** | `RecommenderV3ResolvedProfile`: clamped daily preference used for scoring. |
| **Eligible pool** | `eligible_lure_ids` / `eligible_fly_ids`: only these archetypes can appear in output. |
| **Primary order** | `primary_lure_ids` / `primary_fly_ids`: authored intent order; affects monthly-primary tie nudges. |
| **Breakdown** | Per-candidate scored components (`strict_monthly_lane_fit`, `column_fit`, …) for audits and copy. |
| **Diversity bonus** | Post-selection nudge for lineup variety; not in the breakdown array. |
| **State-scoped row** | Seasonal row with `state_code` set; preferred over unscoped row when the request state matches. |
| **`state_scoring_adjustments`** | Small per-archetype score deltas carried on state-scoped rows. |
| **`reason_code`** | Enum from `resolveColorDecisionV3` tying clarity + light bucket to color theme. |
| **Top-driver phrase** | Optional lead clause from `phraseForTopDriver` when the highest positive breakdown code is recognized. |
| **Fallback row** | Seasonal row taken from `REGION_FALLBACKS` when the request region has no row; `used_region_fallback` is true. |
