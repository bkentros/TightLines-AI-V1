# Recommender v4 — Simplified Eligibility Engine

**Document purpose:** Detailed historical / implementation plan for an eligibility-first **v4** engine and pipeline (pseudocode, schemas, file maps). Useful for understanding the current `recommenderEngine/v4/**` code and scripts.

> **Canonical architecture & phased transition:** [`tightlines_recommender_architecture_clean.md`](./tightlines_recommender_architecture_clean.md) — this is the authoritative rebuild plan, ordering (transition → biology → engine), and non‑negotiable rules (no seasonal fallbacks in the final engine, etc.). Where this v4 document disagrees with that file, **follow the architecture doc**.
>
> **Runtime status:** The production Edge function runs **`runRecommenderRebuildSurface`** (deterministic rebuild). The standalone **v4** engine under `recommenderEngine/v4/engine/**` remains for tests and tooling. Legacy **v3** (`legacyV3.ts`) is for audits/scripts only.

---

## 0. Project context (read this first)

**What the app is.** TightLines AI is a mobile fishing assistant (iOS first, React Native / Expo SDK 55, Expo Router) that gives anglers data-driven, trustworthy daily guidance. Two headline features sit at the core of the product:

1. **How's Fishing Right Now.** A daily 10-100 score ("internal canonical scale") computed from weather, pressure, moon, solunar, wind, water-temp proxies, and astronomical timing via the `howFishingEngine` (see `supabase/functions/_shared/howFishingEngine/`). This score drives posture (`aggressive | neutral | suppressed`) for v4.
2. **Lure / Fly Recommender.** The subject of this plan. Takes a (species, region, state, month, water_type) scope and today's conditions, produces three lure recommendations AND three fly recommendations with explanations.

**Who the user is.** A fishing-literate angler who will catch an "off" recommendation instantly. Credibility is everything. A bass jig displayed as "upper column" is a product-death bug. That specific failure in v3 is what motivated v4.

**Scope of v4 recommender.**
- Four species: `largemouth_bass`, `smallmouth_bass`, `northern_pike`, `trout`.
- Two water types: `freshwater_lake_pond`, `freshwater_river`. Trout is river-only (P26).
- Eighteen supported regions (per `howFishingEngine/contracts/region.ts`).
- All 12 months.
- Three daily posture buckets × three clarity buckets × wind-aware surface gating.

**Stack relevant to this plan.**
- Supabase Edge Functions (Deno/TypeScript). The recommender runs server-side at `supabase/functions/recommender/index.ts`.
- Supabase Postgres (with PostGIS). One new table is introduced in v4: `recommender_diagnostics` (§11.1).
- No Claude/OpenAI calls from v4. Copy is template-driven (§13).
- Frontend in `TightLinesAI/` root (Expo SDK 55, Zustand, Expo Router). Frontend impact is enumerated in Appendix C.

**What v4 is NOT.**
- Not a scoring engine. No weighted sums. No "fit values."
- Not temperature-driven. `water_temp_f` is never read (P15).
- Not a presence engine. `presence` is eliminated entirely (P16).
- Not a multi-pass ranker. One eligibility filter + one seeded random pick per slot.

**What "good output" means for the user.**
Three lures (or three flies) per request, each with:
- A credible `(column, pace)` lane for today's species/region/month/water_type/clarity/posture.
- A forage alignment on the **headline** pick (slot 0) whenever forage data allows it.
- A distinct fishing approach across the three slots (family_group uniqueness — no two crankbaits, no two sculpin streamers).
- Copy that explains WHY this pick today — never false forage claims, never mechanical phrasing, never template leaks.

The top-3 should read the way an expert guide would describe the day: "Lead with X on the dominant lane. Back it up with Y. If it's tight, try Z." That narrative is what §13 copy templates produce.

**Why a full v3 gut, not an incremental patch.**
v3 encodes display metadata (`primary_column`) inside ranking metadata (`column_range`) AND layers ~10 independent daily shifts on top, compounding error sources. Every fix to v3 adds another layer. v4 separates them: archetype = display (`column` is a single value), seasonal row = ranking boundary (`column_range`), daily conditions = gate. The fix is structural.

---

## Table of Contents

0.  Project context
1.  Executive summary
2.  Why v4 exists (problem statement)
3.  Core principles & invariants
4.  Architecture overview
5.  Input / output contracts
6.  The posture rule (asymmetric)
7.  Column and pace distributions
8.  Surface gate
9.  Clarity gate
10. Forage gate
11. Pool construction (eligibility filter)
12. Pick assembly (slot satisfaction + fallback)
13. Copy layer
14. Worked examples
15. Identified flaws and mitigations
16. Data schemas (archetype, seasonal row, daily payload, response)
17. Seasonal-matrix authoring workflow (CSV pipeline)
18. File-by-file delete / keep / modify map
19. Phased implementation checklist
20. Test strategy
21. Rollout plan
22. Appendix A — Full archetype column/pace re-authoring table
23. Appendix B — Climate zone grouping
24. Appendix C — Frontend impact
25. Appendix D — Glossary
26. Appendix E — Post-implementation deep-audit checklist
27. Final note to the implementing agent

---

## 1. Executive summary

The current v3 recommender has evolved into a multi-layered weighted scoring engine spanning ~14,000 lines. It produces credibility-breaking outputs (the canonical failure: a bass jig displayed as an "upper" column lure) because two responsibilities — DISPLAY and RANKING — were collapsed into one authored field (`column_range`), and because the scoring layer rewards partial overlaps in ways that don't match how fishing actually works.

**v4 is a deliberate simplification.** It replaces the entire scoring pipeline with:

1.  A **monthly biological window** (authored per region × month × water type × species) that defines the valid column range, pace range, forage focus, and a **baseline center** for each axis — plus a small **headline curation list** (`primary_lure_ids` / `primary_fly_ids`) of 4-8 ids per row.
2.  An **asymmetric posture shift** driven by the single How's Fishing score — aggressive expands the baseline toward surface/fast; suppressed shifts the baseline anchor toward bottom/slow.
3.  A **structural distribution recipe** for the 3 top picks — 2 anchor + 1 outward (COMMIT shape) on aggressive/suppressed postures, 1 baseline + 1 above + 1 below (SPREAD shape) on neutral days with interior baselines — guaranteeing column spread and pace mix that matches today's posture.
4.  A small set of **hard filters** — clarity strengths, surface gate (wind + posture), forage gate on the headline slot only.
5.  A **runtime-derived eligible pool** — the engine intersects the full archetype catalog with today's tactical columns/paces/clarity + the row's ranges. There is no hand-authored `eligible_*_ids` list; eligibility is a pure function of archetype attributes, row ranges, and daily conditions. Authors may optionally opt specific ids OUT per row via `excluded_*_ids` (rare).
6.  A **seeded random pick** from the eligible pool once the recipe is locked. No scoring. No tiers. No weights.

The result is ~300 lines of engine code, a flat authoring matrix that a fishing-literate human can audit row-by-row (authors write ranges + 4-8 primary ids per row, not per-row eligibility lists), and outputs that structurally look like what a guide would hand you.

---

## 2. Why v4 exists

### 2.1 Failures of v3

- **Display/scoring collision.** `column_range[0]` is both the UI-shown primary column and the scoring-preferred column. Authors front-loaded ranges with the preferred scoring columns rather than the lure's actual primary column, producing outputs like "bass jig → upper".
- **Weighted scoring across small archetype pools is noise.** Differences between `3.2` and `2.7` fit scores have no biological meaning; they are artifacts of dozens of individually-reasonable nudges compounding in ways no one audits end to end.
- **Tier sprawl.** Column tiers, pace tiers, presence tiers, lane fits, forage fits, clarity fits, practicality fits, compound fits, state-scoped deltas, guards, micro-nudges. Each layer compensates for the last.
- **Presence is redundant with clarity.** Every archetype's presence value is derived from its clarity strengths; authoring them separately doubles the failure surface and adds no signal.
- **Water temperature was tried and abandoned.** The product will not require water temp — too unreliable in the field. Any code that depends on it is dead weight.
- **Daily payload bloat.** Columns/pace/presence each get their own `-1/0/+1` shift accumulator driven by ~10 independent signals. The How's Fishing engine already aggregates all those signals into a single daily score; doing it twice is wasted complexity.

### 2.2 What v4 guarantees

- Every top-3 lure or fly is **credibly in its correct water column** (one column authored per archetype, period).
- Every top-3 **spans the eligible columns** of the day (e.g. one bottom, one mid, one upper — or 2+1 when only two columns make sense).
- Every top-3 **matches today's posture** via the structural pace distribution (2+1 biased toward slow on suppressed, toward fast on aggressive).
- Surface picks only appear when they're actually fishable (wind ≤ 18 mph AND posture ≠ suppressed AND seasonally valid). **Never more than one surface pick in any top-3.**
- The headline pick explicitly imitates today's **primary forage**; alternates are free to offer pattern variety.
- Deterministic output per `(user, date, species, region, month, water type)` — no unexplained day-to-day flicker.

---

## 3. Core principles & invariants

These are the non-negotiables. Implementation must preserve every one of them.

| # | Invariant | Enforcement |
|---|---|---|
| P1 | Every archetype has exactly ONE authored column | Factory throws if missing/invalid |
| P2 | Every archetype has ONE primary pace and at most ONE secondary pace | Factory throws if duplicated or 3+ |
| P3 | Presence does not exist in v4 | Field does not appear in types, archetypes, rows, outputs |
| P4 | Top-3 contains at most 1 surface pick | Post-assembly check flips extra surface to upper |
| P5 | Top-3 respects the pace distribution (2+1) exact count for the row's pace range | Assembly constraint |
| P6 | Top-3 spans column distribution (2+1 or 1+1+1) per the recipe | Assembly constraint |
| P7 | Top-3 family_group values are unique across picks | Assembly constraint |
| P8 | Surface picks require wind ≤ 18 mph AND posture ≠ suppressed AND `surface_seasonally_possible` | Filter step |
| P9 | Suppressed posture never produces a surface pick, regardless of other gates | Filter step |
| P10 | Headline pick must match `primary_forage` or `secondary_forage`; alternates are not forage-gated | Pool construction |
| P11 | Same `(user_id, local_date, species, region_key, month, water_type)` → same top-3 | Deterministic seed |
| P12 | No re-roll / regenerate UI or API path exists in v4 | No seed-rotation code |
| P13 | Fly catalog is **streamers + topwater only**. The only fly archetypes with `column === "surface"` are the three authored topwater flies (`popper_fly`, `frog_fly`, `mouse_fly`). Every other fly has `column ∈ {bottom, mid, upper}`. No nymphs. No dry flies. | Factory + catalog |
| P14 | `column_baseline` on any seasonal row is never `surface` | Row validator |
| P15 | Water temperature is never consumed by v4 | No codepath reads `water_temp_f` |
| P16 | Water clarity, not presence, is the visibility filter | Archetype uses `clarity_strengths` |
| P17 | The How's Fishing score is the SINGLE posture input | No per-axis daily shifts |
| P18 | Minimum pool size before relaxation is 6 archetypes | Hard constant |
| P19 | Color decision is independent of v4 scoring (unchanged from v3) | Kept as a separate module |
| P20 | v4 ships beside v3 under a feature flag until shadow-mode diff passes | Rollout discipline |
| P21 | On a **neutral** day with `today_columns.length ≥ 3` and `column_baseline` having valid neighbors in BOTH directions within `today_columns`, the column distribution is `[baseline, above, below]` (a 1+1+1 spread). Otherwise the 2+1 rule applies. Same rule applies to pace. | Posture engine (§6.2) |
| P22 | Top-3 ordering is deterministic: slot 0 is the HEADLINE (most-likely lane today), slot 1 is the SECONDARY (same-direction reinforcement on aggressive/suppressed, aggressive-leaning neighbor on neutral), slot 2 is the OUTWARD (outward tier of the distribution). | Slot recipe (§7.1) |
| P23 | Surface flies are **species-restricted**. `popper_fly` is allowed for bass only. `frog_fly` is allowed for largemouth and pike only. `mouse_fly` is allowed for trout only. Factory enforces this via `species_allowed`. | Factory (G7) |
| P24 | When `env_data.wind_speed_mph` is missing, the engine defaults to `99` (closes surface). Missing wind NEVER opens a surface pick. | `resolveDailyPayloadV4` (G4) |
| P25 | Relaxation events, missing-wind events, and headline-pool fallbacks are emitted as structured diagnostics with a stable prefix (`[recommender_v4_diag]`) via `console.warn` AND, if the `recommender_diagnostics` table exists, inserted with the request context. | Edge function wrapper |
| P26 | Trout requests with `context === "freshwater_lake_pond"` are rejected with HTTP `400 invalid_context` before engine invocation. Trout is river-only. | Edge function guard |
| P27 | When `user_id` is not available (anonymous or service-side invocation), the seed is derived from a stable synthetic key: `anon-{sha256(local_date|species|region_key|month|water_type)}`. Picks remain deterministic per request. | Seed builder (§12.5) |

---

## 4. Architecture overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       RecommenderRequest                            │
│  (species, region_key, month, water_type, water_clarity, env_data)  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  analyzeRecommenderConditions                       │
│   (reuses howFishingEngine — produces SharedConditionAnalysis)      │
│   Outputs: scored.score (10-100), normalized wind, light, etc.      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  resolveDailyPayloadV4 (tiny)                       │
│   Inputs : scored.score, wind_speed_mph, water_clarity              │
│   Outputs: { posture, wind_mph, water_clarity }                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  resolveSeasonalRowV4                               │
│   Lookup (species, region_key, month, water_type, state_code?)      │
│   Returns: { column_range, column_baseline,                         │
│              pace_range, pace_baseline,                             │
│              primary_forage, secondary_forage?,                     │
│              surface_seasonally_possible,                           │
│              primary_lure_ids, primary_fly_ids,                     │
│              excluded_lure_ids?, excluded_fly_ids? }                │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  resolveTodayTacticsV4                              │
│   1. Filter column_range for surface gate                           │
│   2. Apply posture rule → column_distribution (3 values)            │
│   3. Apply posture rule → pace_distribution (3 values)              │
│   4. Derive pace_set = unique(pace_distribution)                    │
│   5. Derive column_set = unique(column_distribution)                │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  buildEligiblePoolV4 (once per gear mode)           │
│   Filter FULL CATALOG where:                                        │
│     - species ∈ species_allowed                                     │
│     - water_type ∈ water_types_allowed                              │
│     - column ∈ column_set                                           │
│     - primary_pace ∈ pace_set OR secondary_pace ∈ pace_set          │
│     - water_clarity ∈ clarity_strengths                             │
│     - (suppressed OR wind>18 OR !surface_seasonally_possible)       │
│         ⇒ column !== "surface"                                      │
│     - id NOT IN row.excluded_*_ids (if populated)                   │
│                                                                     │
│   NOTE: There is no row.eligible_*_ids list. The eligible pool is   │
│   derived at runtime from the full catalog + archetype attributes + │
│   row ranges + daily conditions. Authors can opt specific ids out   │
│   via the optional excluded_*_ids field (rare; default empty).      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  pickTop3V4 (once per gear mode)                    │
│   1. Bucket pool by (column, primary_pace)                          │
│   2. Build slot recipe: 3 (column, pace) pairs from distributions   │
│      - slot 0 = anchor column × dominant pace (HEADLINE)            │
│      - slot 1 = anchor column × minority pace OR second column      │
│      - slot 2 = outward column × complementary pace                 │
│   3. Headline slot: seeded pick from primary_ids ∩ forage_match     │
│      ∩ (column, pace) bucket; fallback path documented              │
│   4. Alternates: seeded pick from eligible_pool ∩ (column, pace)    │
│      bucket, excluding family_groups already picked                 │
│   5. If pool thin: apply relaxation chain (§12)                     │
│   6. Enforce surface-cap post-check (P4)                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  resolveColorDecisionV3 (unchanged)                 │
│   Called per pick: color_theme from (clarity, light_bucket)         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  buildCopyV4 (per pick)                             │
│   why_chosen: context-driven (posture, forage, column, pace)        │
│   how_to_fish: variant[0|1|2] chosen by clarity bucket              │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     RecommenderResponseV4                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Input / output contracts

### 5.1 Input (unchanged from v3)

`RecommenderRequest` from `supabase/functions/_shared/recommenderEngine/contracts/input.ts`. v4 does NOT widen or break this type.

```ts
export type RecommenderRequest = {
  location: {
    latitude: number;
    longitude: number;
    state_code: string;
    region_key: RegionKey;
    local_date: string;        // "YYYY-MM-DD"
    local_timezone: string;
    month: number;             // 1-12
  };
  species: SpeciesGroup;
  context: EngineContext;      // freshwater_lake_pond | freshwater_river only for v4
  water_clarity: WaterClarity; // clear | stained | dirty
  env_data: Record<string, unknown>; // must include `wind_speed_mph: number`
};
```

v4 additionally requires a `user_id` for the deterministic seed. The edge function `supabase/functions/recommender/index.ts` already authenticates the caller via Supabase auth; pass `user.id` into the engine explicitly (new parameter on `runRecommenderV4`).

### 5.2 Output — trimmed and cleaned

The frontend contract in `lib/recommenderContracts.ts` and the engine contract in `supabase/functions/_shared/recommenderEngine/contracts/output.ts` both get tightened:

```ts
export type RankedRecommendationV4 = {
  id: string;
  display_name: string;
  family_group: string;
  color_style: string;        // "Natural" | "Dark" | "Bright"
  why_chosen: string;
  how_to_fish: string;
  column: TacticalColumn;     // was primary_column in v3 — RENAME
  pace: TacticalPace;         // primary pace; secondary is not exposed
  is_surface: boolean;
};

export type RecommenderSummaryV4 = {
  posture: "aggressive" | "neutral" | "suppressed";
  column_range: TacticalColumn[];     // the row's authored range
  column_baseline: TacticalColumn;    // the row's authored baseline
  pace_range: TacticalPace[];
  pace_baseline: TacticalPace;
  primary_forage: ForageBucket;
  secondary_forage?: ForageBucket;
  surface_available_today: boolean;   // true iff surface in today_columns
  today_column_distribution: TacticalColumn[]; // length 3
  today_pace_distribution: TacticalPace[];     // length 3
};

export type RecommenderResponseV4 = {
  feature: "recommender_v4";
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  generated_at: string;
  cache_expires_at: string;
  summary: RecommenderSummaryV4;
  lure_recommendations: [RankedRecommendationV4, RankedRecommendationV4, RankedRecommendationV4];
  fly_recommendations:  [RankedRecommendationV4, RankedRecommendationV4, RankedRecommendationV4];
};
```

**Removed from v3 output:** `presence`, `preferred_presence`, `presence_preference_order`, `primary_column` (renamed), `reaction_window`, `opportunity_mix`, `surface_window`, `allowed_presence`, `preferred_column`, `secondary_column`, `preferred_pace`, `secondary_pace` (on the summary), `variables_considered`, `daily_payload`, `seasonal_row`, `resolved_profile`, `breakdown`, `score`, `tactical_fit`, `practicality_fit`, `forage_fit`, `clarity_fit`, `diversity_bonus`, `selection_role`.

**Kept:** `id`, `display_name`, `family_group`, `color_style`, `why_chosen`, `how_to_fish`, `is_surface`, `generated_at`, `cache_expires_at`.

**Renamed:** `primary_column` → `column` (on the pick); `daily_tactical_preference` → replaced by the trimmed `summary` above.

---

## 6. The posture rule (asymmetric)

### 6.1 Posture resolution

Input: `score ∈ [10, 100]` from `scoreDay(norm).score` (the How's Fishing engine's `scored.score` field).

```
resolvePostureV4(score: number): Posture
  if score >= 70 → "aggressive"
  if score <= 35 → "suppressed"
  else            → "neutral"
```

These thresholds map to the 1.0-10.0 display scale as `>=7.0` aggressive, `<=3.5` suppressed. Threshold tuning is an authoring concern, not an architecture concern; the constants live in `v4/constants.ts` as `POSTURE_AGGRESSIVE_THRESHOLD = 70` and `POSTURE_SUPPRESSED_THRESHOLD = 35`.

### 6.2 The asymmetric shift — with three shapes

The distribution result is a 3-tuple. Its **shape** depends on the posture:

- **Aggressive** → 2+1 COMMIT shape: `[anchor, anchor, anchor+1]`. Fish still hold the baseline lane; one bonus slot above.
- **Suppressed** → 2+1 COMMIT shape: `[shifted_anchor, shifted_anchor, shifted_anchor-1]`. Anchor moves DOWN one tier from baseline; one more-suppressed slot below.
- **Neutral + range ≥ 3 + baseline interior** → 1+1+1 SPREAD shape: `[baseline, above, below]`. Ordered as headline / aggressive-leaning / suppressed-leaning.
- **Neutral + any other condition** (range < 3 OR baseline at the edge of the range in either direction) → 2+1 COMMIT shape: `[anchor, anchor, adjacent]` where `adjacent` is the only available neighbor.

"Baseline interior" means the baseline has at least one neighbor above AND at least one neighbor below, both within the filtered range (§8). Formally: `shift(baseline_idx, -1) < baseline_idx && shift(baseline_idx, +1) > baseline_idx`.

```
resolveDistribution<T>(
  canonical_scale: readonly T[],           // e.g. ["bottom","mid","upper","surface"]
  range:           readonly T[],           // e.g. ["bottom","mid","upper","surface"]
  baseline:        T,                      // e.g. "upper"
  posture:         Posture,
  seed:            PRNG,
): readonly [T, T, T]

  // Map range to canonical scale indices; compute min/max range-bound indices.
  range_indices  = range.map(v => canonical_scale.indexOf(v)).sort((a,b) => a-b)
  range_min_idx  = range_indices[0]
  range_max_idx  = range_indices[range_indices.length - 1]
  baseline_idx   = canonical_scale.indexOf(baseline)
  assert(range_indices.includes(baseline_idx))  // invariant

  shift = (idx, direction) =>
    clamp(idx + direction, range_min_idx, range_max_idx)

  // Helper: does baseline have neighbors on BOTH sides within the range?
  below_idx = shift(baseline_idx, -1)
  above_idx = shift(baseline_idx, +1)
  baseline_is_interior =
    (below_idx < baseline_idx) && (above_idx > baseline_idx)

  switch posture:
    case "aggressive":
      anchor_idx = baseline_idx
      second_idx = shift(baseline_idx, +1)
      if second_idx === anchor_idx:  // baseline at range top → clamp down
        second_idx = shift(baseline_idx, -1)
      return [canonical_scale[anchor_idx],
              canonical_scale[anchor_idx],
              canonical_scale[second_idx]]

    case "suppressed":
      anchor_idx = shift(baseline_idx, -1)        // anchor MOVES down
      second_idx = shift(anchor_idx, -1)
      if second_idx === anchor_idx:               // anchor at range bottom → clamp up
        second_idx = shift(anchor_idx, +1)
      return [canonical_scale[anchor_idx],
              canonical_scale[anchor_idx],
              canonical_scale[second_idx]]

    case "neutral":
      // 1+1+1 spread: only when the range is wide enough AND baseline has room both sides.
      if range.length >= 3 && baseline_is_interior:
        return [canonical_scale[baseline_idx],   // #1 HEADLINE: baseline
                canonical_scale[above_idx],       // #2 SECONDARY: aggressive-leaning neighbor
                canonical_scale[below_idx]]       // #3 OUTWARD: suppressed-leaning neighbor

      // 2+1 fallback: range < 3 OR baseline at edge.
      anchor_idx = baseline_idx
      candidates = []
      if below_idx !== anchor_idx: candidates.push(below_idx)
      if above_idx !== anchor_idx: candidates.push(above_idx)
      if candidates.length === 0:
        // Degenerate: single-value range.
        return [canonical_scale[anchor_idx]] * 3
      // Deterministic choice: if both sides available (cannot happen here because
      // that would mean interior = true), the seed picks. Otherwise take the only option.
      second_idx = candidates.length === 1 ? candidates[0] : seed.pick(candidates)
      return [canonical_scale[anchor_idx],
              canonical_scale[anchor_idx],
              canonical_scale[second_idx]]
```

The same function is called twice per request — once with the column scale (`["bottom","mid","upper","surface"]`) and once with the pace scale (`["slow","medium","fast"]`). Identical behavior on both axes.

### 6.3 Why asymmetric + why 1+1+1 on neutral

**Biology — asymmetric posture:** Aggressive fish still hold in their primary zone; they just extend reach upward. Suppressed fish genuinely retreat from their primary zone to deeper, slower water. A symmetric rule would either over-commit suppressed (looks sensible) or under-commit suppressed (looks wrong). The asymmetric rule is biologically correct.

**Biology — neutral spread:** On a neutral day you genuinely don't know which way fish will lean. Showing the user a toolbox across three lanes (baseline + aggressive neighbor + suppressed neighbor) is more honest than doubling-down on one lane. On aggressive and suppressed days, committing to a specific lane is correct because the conditions have told us where fish are. Neutral is the only posture where "spread" beats "commit."

**Neutral 1+1+1 only fires when the range is wide and the baseline has room.** If the range is 2 columns, or the baseline sits at the top or bottom of the range, the 2+1 fallback applies — you cannot spread in a direction you don't have.

**Ordering in the 1+1+1 shape is fixed, not seeded:** `[baseline, above, below]`. The headline is the baseline lane. The aggressive-leaning alternate is #2. The suppressed-leaning alternate is #3. This creates a coherent narrative — "main play, if they're feeding up, if they're tight."

---

## 7. Column and pace distributions

The output of §6.2 for each axis is a 3-tuple called the **distribution**.

- `column_distribution: [TacticalColumn, TacticalColumn, TacticalColumn]`
- `pace_distribution: [TacticalPace, TacticalPace, TacticalPace]`

The distributions are **ordered**. Index 0 is the anchor slot (headline), index 1 is the secondary-anchor slot, index 2 is the outward slot.

**Example tables** — illustrating the three shapes.

**Example 1: June, Michigan (NC), Bass, Lake/Pond** — baseline `(upper, fast)`, range wide:

| Axis | Range | Baseline | Posture | Distribution | Shape |
|---|---|---|---|---|---|
| Column | `[bottom, mid, upper, surface]` | `upper` | Aggressive | `[upper, upper, surface]` | 2+1 COMMIT |
| Pace | `[slow, medium, fast]` | `fast` | Aggressive | `[fast, fast, medium]` | 2+1 COMMIT |
| Column | `[bottom, mid, upper, surface]` | `upper` | Suppressed | `[mid, mid, bottom]` (surface pre-filtered) | 2+1 COMMIT |
| Pace | `[slow, medium, fast]` | `fast` | Suppressed | `[medium, medium, slow]` | 2+1 COMMIT |
| Column | `[bottom, mid, upper, surface]` | `upper` | Neutral | `[upper, surface, mid]` | **1+1+1 SPREAD** (upper is interior: surface above, mid below) |
| Pace | `[slow, medium, fast]` | `fast` | Neutral | `[fast, fast, medium]` | 2+1 FALLBACK (fast at top edge — no pace above) |

**Example 2: April, Florida (Gulf Coastal Plains), Largemouth, Lake/Pond** — baseline `(upper, fast)`, neutral day:

| Axis | Range | Baseline | Posture | Distribution | Shape |
|---|---|---|---|---|---|
| Column | `[bottom, mid, upper, surface]` | `upper` | Neutral | `[upper, surface, mid]` | **1+1+1 SPREAD** |
| Pace | `[slow, medium, fast]` | `fast` | Neutral | `[fast, fast, medium]` | 2+1 FALLBACK |

**Example 3: March, Tennessee, Smallmouth, River** — baseline `(mid, medium)`, range `[bottom, mid, upper]`:

| Axis | Range | Baseline | Posture | Distribution | Shape |
|---|---|---|---|---|---|
| Column | `[bottom, mid, upper]` | `mid` | Neutral | `[mid, upper, bottom]` | **1+1+1 SPREAD** (mid is interior) |
| Pace | `[slow, medium]` | `medium` | Neutral | `[medium, medium, slow]` | 2+1 FALLBACK (range < 3) |

**Example 4: December, Minnesota, Pike, Lake/Pond** — baseline `(bottom, slow)`, range `[bottom, mid]`:

| Axis | Range | Baseline | Posture | Distribution | Shape |
|---|---|---|---|---|---|
| Column | `[bottom, mid]` | `bottom` | Neutral | `[bottom, bottom, mid]` | 2+1 FALLBACK (range < 3) |
| Pace | `[slow]` | `slow` | Neutral | `[slow, slow, slow]` | Degenerate |

### 7.1 Slot recipe

Slots are filled in order `[0, 1, 2]`. Each slot is a `(column, pace)` target. The mapping from distributions to slot recipe is index-aligned and deterministic:

```
build_slot_recipe(column_dist, pace_dist):
  // column_dist and pace_dist each have length 3.
  //
  // For 2+1 shape (aggressive, suppressed, neutral-fallback):
  //   column_dist = [c0, c0, c_other]
  //   pace_dist   = [p0, p0, p_other]
  //
  // For 1+1+1 shape (neutral spread):
  //   column_dist = [baseline, above, below]   (ordered, no duplicates)
  //   pace_dist   = [baseline, above, below]   IF pace is also 1+1+1,
  //                 else [p0, p0, p_other]
  //
  // slot 0 (HEADLINE):   column_dist[0] × pace_dist[0]
  // slot 1 (SECONDARY):  column_dist[1] × pace_dist[1]
  // slot 2 (OUTWARD):    column_dist[2] × pace_dist[2]

  return [
    { column: column_dist[0], pace: pace_dist[0], role: "headline"  },
    { column: column_dist[1], pace: pace_dist[1], role: "secondary" },
    { column: column_dist[2], pace: pace_dist[2], role: "outward"   },
  ]
```

### 7.2 How the recipe reads under each shape

**Both axes 2+1 (aggressive/suppressed, or neutral with narrow range):**
- `[c0, c0, c_other] × [p0, p0, p_other]` → slots `(c0,p0)`, `(c0,p0)`, `(c_other,p_other)`
- Slot 0 and 1 both want anchor-column × dominant-pace — family_group redundancy (P7) forces two distinct archetypes in the same lane.
- Slot 2 is the outward bonus — a different column AND (if pace permits) a different pace.

**Column 1+1+1, pace 2+1 (common neutral case):**
- `[baseline, above, below] × [p0, p0, p_other]` → slots `(baseline,p0)`, `(above,p0)`, `(below,p_other)`
- Three distinct columns. Slot 0 is the baseline lane at dominant pace. Slot 1 is one tier up at the same dominant pace (aggressive-leaning). Slot 2 is one tier down at the alternate pace (suppressed-leaning). This is the primary target shape for neutral bass summer days.

**Column 1+1+1 AND pace 1+1+1 (rare — range 3+ on both axes, baseline interior on both):**
- `[baseline_c, above_c, below_c] × [baseline_p, above_p, below_p]` → slots `(bC,bP)`, `(aC,aP)`, `(bC,bP)`
- Three fully distinct (column, pace) lanes. Slot 0 baseline × baseline, slot 1 aggressive × aggressive, slot 2 suppressed × suppressed. Clean toolbox.

**Degenerate cases:**
- **Single-column range** (`column_dist = [c0, c0, c0]`): slots `(c0,p0)`, `(c0,p0)`, `(c0,p_other)`. All three picks are same column; pace varies.
- **Single-pace range** (`pace_dist = [p0, p0, p0]`): slots `(c0,p0)`, `(c0,p0)`, `(c_other,p0)`. All three picks are same pace; column varies.
- **Both degenerate** (single column AND single pace): `(c0,p0)` × 3. Family_group redundancy forces three distinct archetypes in one bucket. Relaxation (§12.3) fires if the bucket has fewer than 3 distinct family_groups.

---

## 8. Surface gate

A compact truth table:

| `surface_seasonally_possible` (row) | `wind_mph ≤ 18` | `posture ≠ suppressed` | → surface in `today_columns`? |
|:-:|:-:|:-:|:-:|
| false | — | — | no |
| true  | false | — | no |
| true  | true  | false (suppressed) | no |
| true  | true  | true  | yes |

Implementation:

```
compute_today_columns(row, posture, wind_mph):
  cols = [...row.column_range]
  if not row.surface_seasonally_possible:
    cols = cols.filter(c => c !== "surface")
  if wind_mph > 18:
    cols = cols.filter(c => c !== "surface")
  if posture === "suppressed":
    cols = cols.filter(c => c !== "surface")
  return cols
```

The posture rule (§6.2) then operates on `cols` — NOT on the full `row.column_range`. If surface is filtered out, the rule's `range_max_idx` is the highest remaining index. This means aggressive posture on a windy day cannot manufacture a surface pick: the range itself no longer contains surface, so `shift(baseline, +1)` has nowhere to push.

**Surface cap (P4):** after `pick_top3` assembly, verify no more than 1 of the 3 picks has `column === "surface"`. If 2+, the engine flips the offending pick to the **anchor column** (`column_distribution[0]`) — NOT a hardcoded `"upper"` — and the slot's target pace is preserved. The anchor column is always in `today_columns` because the distribution was derived from it, so the flip target is always populated.

```
enforce_surface_cap(picks, column_distribution, pool, seed):
  surface_count = picks.filter(p => p.column === "surface").length
  if surface_count <= 1:
    return picks

  // Identify the offending pick: the LAST surface pick in the picks array
  // (preserves the headline/secondary if one of them is legitimately surface).
  surface_indices = indices_of(picks, p => p.column === "surface")
  offending_idx   = surface_indices[surface_indices.length - 1]

  anchor_column   = column_distribution[0]
  target_pace     = picks[offending_idx].pace  // keep the slot's authored pace

  // Find a replacement at (anchor_column, target_pace) excluding already-picked
  // family_groups AND the offending archetype itself.
  other_family_groups = picks
    .filter((_, i) => i !== offending_idx)
    .map(p => p.family_group)

  candidates = pool.filter(a =>
       a.column === anchor_column
    && a.family_group NOT IN other_family_groups
    && a.id !== picks[offending_idx].id
    && (a.primary_pace === target_pace
        || a.secondary_pace === target_pace)
  )

  if candidates.length > 0:
    picks[offending_idx] = seed.pick(candidates)
  else:
    // Fall back through the relaxation chain starting at (anchor_column, target_pace).
    picks[offending_idx] = apply_relaxation_chain(
      { column: anchor_column, pace: target_pace },
      pool,
      other_family_groups,
      seed,
    )

  return picks
```

This is a safety rail; in correctly-authored data with the gate logic above it should never fire. The guard exists so a data bug cannot produce a double-surface top-3.

---

## 9. Clarity gate

Every archetype has `clarity_strengths: readonly ("clear" | "stained" | "dirty")[]`. The filter is simple set membership:

```
passes_clarity_gate(archetype, water_clarity):
  return archetype.clarity_strengths.includes(water_clarity)
```

Presence does not exist (P3). This is the entire visibility filter. Downstream, the color decision (§11 passthrough) further refines visibility by picking a natural/dark/bright theme.

---

## 10. Forage gate

Forage is gated ONLY on the headline slot (slot 0). Alternates are free.

```
passes_forage_gate_for_headline(archetype, row):
  allowed_forages = [row.primary_forage]
  if row.secondary_forage:
    allowed_forages.push(row.secondary_forage)
  return archetype.forage_tags.some(tag => allowed_forages.includes(tag))
```

**Authoring invariant (enforced by row validator):** every row's `primary_lure_ids` list must contain at least two archetypes that pass `passes_forage_gate_for_headline`, to ensure the headline slot has a fallback when family_group redundancy prevents the first match. Same rule for `primary_fly_ids`. Validator failure is a data-quality error, not a runtime error.

---

## 11. Pool construction (eligibility filter)

One pool is built per gear mode (lure or fly). The pool is derived **at runtime from the full catalog** — there is no authored `eligible_*_ids` list. Eligibility is a pure function of archetype attributes + seasonal row ranges + daily conditions.

```
build_eligible_pool(
  gear_mode: "lure" | "fly",
  row:       SeasonalRowV4,
  today_cols: readonly TacticalColumn[],
  today_paces: readonly TacticalPace[],
  water_clarity: WaterClarity,
  species:   SpeciesGroup,
  water_type: WaterType,
): readonly ArchetypeProfileV4[]

  catalog         = gear_mode === "lure" ? LURE_ARCHETYPES_V4 : FLY_ARCHETYPES_V4
  excluded_ids    = new Set(gear_mode === "lure"
                              ? (row.excluded_lure_ids ?? [])
                              : (row.excluded_fly_ids  ?? []))
  today_cols_set  = new Set(today_cols)
  today_paces_set = new Set(today_paces)

  return Object.values(catalog).filter(a =>
       !excluded_ids.has(a.id)
    && a.species_allowed.includes(species)
    && a.water_types_allowed.includes(water_type)
    && today_cols_set.has(a.column)
    && (today_paces_set.has(a.primary_pace) ||
        (a.secondary_pace != null && today_paces_set.has(a.secondary_pace)))
    && a.clarity_strengths.includes(water_clarity)
  )
```

**Why no hand-authored eligibility list:** the archetype already encodes every signal that would've driven authoring decisions (`species_allowed`, `water_types_allowed`, `column`, `primary_pace` + `secondary_pace`, `clarity_strengths`). The seasonal row already encodes the biological window (`column_range`, `pace_range`). Intersecting these at runtime is strictly equivalent to authoring per-row eligibility lists — except it saves ~10,000 hand-authored decisions and removes a class of author mistakes (forgetting to add a new lure to old rows).

**`excluded_*_ids` as an escape hatch:** for the rare case where an author knows a specific archetype is a bad idea for a specific (species, region, month, water_type) despite passing all attribute checks — say, a regional knowledge that "spinnerbaits don't work in this Colorado tailwater in July even though clarity/column/pace all check out" — the author populates `excluded_lure_ids` with that id. Default is empty. Expected usage: <5% of rows have ANY excluded ids, and those rows typically have 1-2 ids excluded. If `excluded_*_ids` grows to >25% of rows, the catalog-level archetype attributes are probably wrong and should be fixed instead of patched per-row.

**Primary pool** (for headline):

```
build_headline_pool(
  gear_mode: "lure" | "fly",
  row:       SeasonalRowV4,
  eligible_pool: readonly ArchetypeProfileV4[],
): readonly ArchetypeProfileV4[]

  primary_ids = gear_mode === "lure" ? row.primary_lure_ids : row.primary_fly_ids
  primary_set = new Set(primary_ids)

  return eligible_pool
    .filter(a => primary_set.has(a.id))
    .filter(a => passes_forage_gate_for_headline(a, row))
```

If `build_headline_pool` returns 0 archetypes, relax in this order. Each step records a structured diagnostic (§11.1).

1.  **Drop forage gate, keep primary_ids filter.** Record `headline_fallback: "forage_relaxed"`. If still 0:
2.  **Drop primary_ids, re-apply forage gate on full `eligible_pool`.** Record `headline_fallback: "primary_relaxed"`. If still 0:
3.  **Drop both — use full `eligible_pool`.** Record `headline_fallback: "both_relaxed"`.

This three-step chain guarantees the headline slot is ALWAYS filled. **When step 1, 2, or 3 fires, the copy template for slot 0 switches to the `no_forage_match` variant (§13.1) — the engine must NOT claim forage alignment that didn't happen.**

**Minimum pool enforcement:** if `eligible_pool.length < 6`, the engine emits `pool_undersized: true` diagnostics and proceeds with the relaxation-aware picker (§12.3). The picker still produces 3 picks; the diagnostic exists so authoring drift surfaces in logs without blocking users.

### 11.1 Diagnostic destination (P25)

Every diagnostic emission goes to TWO places:

1. **`console.warn`** with a stable prefix so log queries can filter cleanly:
   ```
   [recommender_v4_diag] { "event": "headline_fallback", "variant": "forage_relaxed",
                            "species": "...", "region_key": "...", "month": ..., ... }
   ```
2. **`recommender_diagnostics` Supabase table** (best-effort insert; failures are caught and silently dropped — diagnostics must NEVER break a user request):
   ```sql
   create table if not exists recommender_diagnostics (
     id           uuid primary key default gen_random_uuid(),
     created_at   timestamptz default now(),
     user_id      uuid null,
     event        text not null,     -- 'headline_fallback' | 'pool_undersized' |
                                     -- 'pace_relaxed' | 'column_relaxed' |
                                     -- 'family_redundancy_relaxed' | 'wind_missing' |
                                     -- 'surface_cap_fired'
     variant      text null,         -- e.g. 'forage_relaxed'
     species      text not null,
     region_key   text not null,
     month        int  not null,
     water_type   text not null,
     context      jsonb null         -- any extra diagnostic payload
   );
   create index on recommender_diagnostics (created_at desc);
   create index on recommender_diagnostics (species, region_key, month, water_type);
   ```

The diagnostic writer lives in `supabase/functions/_shared/recommenderEngine/v4/engine/diagnostics.ts` and is called by the engine through a passed-in `diag` function so the pure engine does not import Supabase. The edge function wires in an implementation that does both writes; tests wire in a collector that captures events for assertion.

---

## 12. Pick assembly

### 12.1 Bucketing

```
bucket_pool_by_column_pace(pool):
  buckets: Map<`${column}|${pace}`, ArchetypeProfileV4[]>
  for each archetype in pool:
    key_primary = `${archetype.column}|${archetype.primary_pace}`
    buckets.getOrCreate(key_primary).push(archetype)
    if archetype.secondary_pace:
      key_secondary = `${archetype.column}|${archetype.secondary_pace}`
      buckets.getOrCreate(key_secondary).push(archetype)
  return buckets
```

Every archetype appears in up to 2 buckets (once per eligible pace). When the picker retrieves from a bucket, it prefers archetypes whose `primary_pace` equals the bucket's pace.

### 12.2 Slot picking

```
pick_top3(
  slot_recipe:  readonly [SlotTarget, SlotTarget, SlotTarget],
  pool:         readonly ArchetypeProfileV4[],
  headline_pool: readonly ArchetypeProfileV4[],
  seed:         PRNG,
): readonly [Pick, Pick, Pick]

  buckets = bucket_pool_by_column_pace(pool)
  picked_family_groups = new Set<string>()
  picks = []

  for i in [0, 1, 2]:
    slot = slot_recipe[i]
    candidate_pool = (i === 0) ? headline_pool : pool
    candidate_buckets = bucket_pool_by_column_pace(candidate_pool)

    // Attempt exact match
    key = `${slot.column}|${slot.pace}`
    exact = (candidate_buckets.get(key) ?? [])
      .filter(a => !picked_family_groups.has(a.family_group))
      .sort(stable_by_id)

    chosen = null
    if exact.length > 0:
      // Prefer primary_pace matches over secondary_pace matches
      primary_matches = exact.filter(a => a.primary_pace === slot.pace)
      pool_to_pick = primary_matches.length > 0 ? primary_matches : exact
      chosen = seed.pick(pool_to_pick)
    else:
      chosen = apply_relaxation_chain(slot, candidate_pool, picked_family_groups, seed)

    if chosen === null:
      throw new Error(`V4: slot ${i} could not be filled for row ...`)

    picks.push(chosen)
    picked_family_groups.add(chosen.family_group)

  return picks
```

### 12.3 Relaxation chain

Applied when the exact `(column, pace)` bucket is empty (after excluding already-picked family_groups).

Order:

1.  **Pace relax (same column).** Any archetype in pool with `column === slot.column` AND (`primary_pace ∈ today_pace_set` OR `secondary_pace ∈ today_pace_set`), excluding picked family_groups.
2.  **Column adjacent (same pace).** Any archetype with `column === nearest_adjacent_column_in_today_cols(slot.column)` AND matching pace. "Nearest adjacent" is the column in `today_cols` with the smallest index distance on the canonical column scale.
3.  **Column adjacent (any today pace).** Same as #2 but pace is relaxed to anything in `today_pace_set`.
4.  **Any today_cols × any today_pace.** Full pool excluding picked family_groups.
5.  **Give up on redundancy.** If `picked_family_groups` is blocking everything, drop the family_group constraint and retry from #1. Record `family_redundancy_relaxed: true` in diagnostics.

If all five steps return empty, the row/catalog is structurally broken. Throw `RecommenderV4EngineError("could not fill top-3 for ...")`. This will be caught by the edge function and returned as a `500 engine_error` — the same failure mode as v3 today.

### 12.4 Surface cap enforcement

Implemented per §8 `enforce_surface_cap`. The cap fires AFTER `pick_top3` assembly returns. Called once per gear mode. The flip target is always `column_distribution[0]` (the anchor column), never hardcoded.

### 12.5 Seed — with anonymous fallback (P27)

```
build_seed(user_id, local_date, species, region_key, month, water_type):
  // If user_id is present and non-empty, use the user-scoped key.
  // Otherwise use a synthesized anonymous key so picks remain deterministic
  // per request even without auth context.
  key_parts = user_id != null && user_id.length > 0
    ? [user_id, local_date, species, region_key, month, water_type]
    : ["anon", local_date, species, region_key, month, water_type]
  key = key_parts.join("|")
  return xfnv1a(key)
```

A PRNG interface the picker consumes:

```ts
type PRNG = {
  pick<T>(arr: readonly T[]): T;  // uniform random pick
  next(): number;                 // 0 <= x < 1
};
```

Implement with mulberry32 or splitmix32 seeded by the hash above. Both are deterministic, fast, and dependency-free.

**Seed stability guarantee:**
- Same `(user_id OR "anon", date, species, region, month, water_type)` → same top-3 forever.
- Changing `water_clarity` or any daily condition does NOT change the seed — it changes the eligible pool, which may change the picks, but the underlying draw order is stable.
- There is NO re-roll API. Same request → same response (P12).

---

## 13. Copy layer

Copy is context-driven. No score references, no tier language, no hedging. Each pick gets:

- `why_chosen: string` — a concise 1-2 sentence explanation grounded in the row + posture + forage + the pick's role in the top-3.
- `how_to_fish: string` — a variant string from the archetype's `how_to_fish_variants` tuple, chosen by `water_clarity`.
- `color_style: string` — the existing color decision output, preserved from v3 (`"Natural" | "Dark" | "Bright"`).

### 13.1 `why_chosen` templates

Each template is selected by a tuple `(slot_role, distribution_shape, posture, forage_match, surface, is_degenerate_outward)`. The selector is:

```
select_template(pick, slot_role, posture, shape, forage_match_result, pick_is_surface,
                anchor_column, outward_column):
  is_degenerate_outward = (anchor_column === outward_column) // same column for slot 0 and slot 2

  if slot_role === "headline":
    if forage_match_result === "matched":
      if pick_is_surface: return HEADLINE_SURFACE_FORAGE
      return HEADLINE_FORAGE_MATCH
    if forage_match_result === "forage_relaxed" || forage_match_result === "both_relaxed":
      // The forage gate was dropped in the headline fallback chain (§11).
      // Copy must NOT claim a forage match that didn't happen.
      if pick_is_surface: return HEADLINE_SURFACE_NO_FORAGE
      return HEADLINE_NO_FORAGE_MATCH

  if slot_role === "secondary":
    if shape === "spread":  // 1+1+1 neutral — secondary is aggressive-leaning neighbor
      return SECONDARY_SPREAD
    return SECONDARY_COMMIT  // 2+1 — same lane as headline

  if slot_role === "outward":
    if is_degenerate_outward:
      return OUTWARD_SAME_COLUMN    // slot 2 is in the same column as slot 0 (range=1 case)
    if shape === "spread":           // 1+1+1 neutral — outward is suppressed-leaning neighbor
      return OUTWARD_SPREAD
    return OUTWARD_COMMIT            // 2+1 — the bonus/backup tier
```

**Templates:**

```
HEADLINE_FORAGE_MATCH:
  "Today's ${forage_label} read lines up with a ${posture_phrase} day — ${display_name} leads the ${column_phrase} ${pace_phrase} line."

HEADLINE_SURFACE_FORAGE:
  "Surface window is open and ${forage_label} is on the menu — start with ${display_name} on top before committing to subsurface."

HEADLINE_NO_FORAGE_MATCH:
  "On a ${posture_phrase} day the ${column_phrase} ${pace_phrase} lane is the play — ${display_name} fits the lane even though today's forage doesn't line up perfectly."

HEADLINE_SURFACE_NO_FORAGE:
  "Surface window is open — ${display_name} gives you a top-of-column look while subsurface patterns reset."

SECONDARY_COMMIT:
  "${display_name} doubles down on the ${column_phrase} ${pace_phrase} lane — a change of profile without changing the lane."

SECONDARY_SPREAD:
  "If fish are willing to feed up today, ${display_name} works the ${column_phrase} ${pace_phrase} lane — one tier above the baseline."

OUTWARD_COMMIT:
  "If the lane isn't producing, ${display_name} pulls you ${direction_phrase} to ${column_phrase} with a ${pace_phrase} look."

OUTWARD_SPREAD:
  "If the bite is tight today, ${display_name} drops you to the ${column_phrase} ${pace_phrase} lane — a conservative hedge from the baseline."

OUTWARD_SAME_COLUMN:
  "${display_name} keeps you in the ${column_phrase} lane with a ${pace_phrase} change-up — the range doesn't open a deeper or higher option today."
```

**Phrase helpers:**

```
posture_phrase(p)   → "aggressive feeding" | "neutral, workable" | "suppressed, tight"
forage_label(f)     → "crawfish" | "baitfish" | "bluegill and perch" | "leech and worm"
                      | "insect forage" | "surface prey"
column_phrase(c)    → "bottom" | "mid-column" | "upper column" | "surface"
pace_phrase(p)      → "slow" | "steady medium" | "fast"
direction_phrase(anchor_idx, outward_idx)  →
  "deeper"  if outward_idx < anchor_idx,
  "higher"  if outward_idx > anchor_idx,
  // anchor_idx === outward_idx is handled by OUTWARD_SAME_COLUMN, not this helper
```

Note: `direction_phrase` never returns empty because the same-column case is routed to `OUTWARD_SAME_COLUMN` before this helper is called.

### 13.2 `how_to_fish`

Unchanged in spirit from v3. Pick the variant by clarity bucket:

```
pick_how_to_fish(archetype, water_clarity):
  switch water_clarity:
    case "clear":   return archetype.how_to_fish_variants[0]
    case "stained": return archetype.how_to_fish_variants[1]
    case "dirty":   return archetype.how_to_fish_variants[2]
```

Existing variants in the catalog are already authored in this ordering. No authoring changes needed.

### 13.3 Summary copy

The `summary` object on the response is structured data; the frontend renders it. No string copy is generated in the engine for the summary — it's consumed as structured fields.

---

## 14. Worked examples

The seasonal row values below are illustrative only. Final values come from the authoring pipeline (§17). Every pick in every example is **verified against the catalog in Appendix A** — slot targets and archetype attributes match.

### 14.1 Example A — June, Michigan (NC), Largemouth Bass, Lake/Pond, **stained** water, calm wind (8 mph), `score=82` (aggressive)

```
row.column_range    = ["bottom","mid","upper","surface"]
row.column_baseline = "upper"
row.pace_range      = ["slow","medium","fast"]
row.pace_baseline   = "fast"
row.primary_forage  = "bluegill_perch"
row.secondary_forage = "baitfish"
row.surface_seasonally_possible = true

posture              = "aggressive"
today_cols           = ["bottom","mid","upper","surface"]  (wind ok, posture ok, surface eligible)
column_distribution  = ["upper","upper","surface"]         (2+1 COMMIT)
pace_distribution    = ["fast","fast","medium"]            (2+1 COMMIT; fast at top, clamp fallback)

slot_recipe:
  0 (headline):  (upper, fast)
  1 (secondary): (upper, fast)
  2 (outward):   (surface, medium)

Catalog verification for slot 0 (upper, fast) in STAINED water, forage=bluegill_perch|baitfish:
  - squarebill_crankbait: column=upper, primary=medium, secondary=fast, forage=bluegill_perch+baitfish,
    clarity=stained+dirty → EXACT (upper, fast) via secondary_pace; clarity passes stained; forage matches both → ✓
  - soft_jerkbait: column=upper, primary=medium, secondary=slow, baitfish, clarity=clear+stained → pace mismatch
  - flat_sided_crankbait: column=upper, primary=medium, no secondary, baitfish, clarity=clear+stained → pace mismatch
  - weightless_stick_worm: column=upper, primary=medium, secondary=slow, leech_worm, all clarities → pace mismatch

Headline pool (primary_ids ∩ forage match ∩ (upper,fast) ∩ stained clarity):
  {squarebill_crankbait} → seeded pick → squarebill_crankbait.

Slot 1 (upper, fast), excluding family_group "crankbait_shallow":
  No other upper+fast in stained. Relaxation step 1 (pace relax within upper column):
    - weightless_stick_worm (upper, medium, all clarities) ✓ family="soft_plastic_worm" distinct ✓
    - soft_jerkbait (upper, medium, stained) ✓ family="jerkbait_soft" distinct ✓
  Seeded pick → soft_jerkbait (baitfish secondary forage still matches for a nice cohesive pair;
  note forage is NOT gated on slot 1, but aligning is aesthetically better when possible).

Slot 2 (surface, medium), family_group distinct:
  - walking_topwater (surface, medium, surface_prey+baitfish, clear+stained) ✓
  - popping_topwater (surface, medium, surface_prey, clear+stained) ✓
  - prop_bait (surface, medium, surface_prey, clear+stained) ✓
  - hollow_body_frog (surface, slow, secondary=medium, stained+dirty) ✓ via secondary_pace
  - buzzbait (surface, fast, secondary=medium, stained+dirty) ✓ via secondary_pace
  Seeded pick → walking_topwater.

Final top-3:
  0: squarebill_crankbait   (upper, fast via secondary, baitfish+bluegill_perch)  → HEADLINE (forage match on primary bluegill_perch)
  1: soft_jerkbait          (upper, medium, baitfish)                             → SECONDARY (pace-relaxed)
  2: walking_topwater       (surface, medium, surface_prey+baitfish)              → OUTWARD

Surface cap: 1 surface pick. Passes (P4).
Diagnostic: pace_relaxed on slot 1.
```

Copy per §13.1:
- Slot 0: HEADLINE_FORAGE_MATCH — "Today's bluegill and perch read lines up with an aggressive feeding day — Squarebill Crankbait leads the upper column fast line."
- Slot 1: SECONDARY_COMMIT — "Soft Jerkbait doubles down on the upper column steady medium lane — a change of profile without changing the lane."
- Slot 2: OUTWARD_COMMIT — "If the lane isn't producing, Walking Topwater pulls you higher to surface with a steady medium look."

**Note:** the pace-relax diagnostic on slot 1 is a realistic outcome for this row. It signals that authors could strengthen `primary_lure_ids` by adding an additional upper+fast archetype (e.g. authoring a new `hollow_body_frog` variant or adding `spybait` to the catalog). Until then, pace-relax to `(upper, medium)` is the correct conservative fill.

### 14.2 Example B — Same row, cold front, `score=28` (suppressed), wind 10 mph, clear water

```
posture              = "suppressed"
today_cols           = ["bottom","mid","upper"]    (surface dropped by suppressed-posture gate)
column_distribution  = resolveDistribution(cols=today_cols, range=today_cols, baseline="upper", suppressed)
  anchor_idx = shift(upper, -1) = mid
  second_idx = shift(mid, -1)   = bottom
  → ["mid","mid","bottom"]
pace_distribution    = resolveDistribution(range=["slow","medium","fast"], baseline="fast", suppressed)
  anchor_idx = shift(fast, -1) = medium
  second_idx = shift(medium, -1) = slow
  → ["medium","medium","slow"]

slot_recipe:
  0 (headline):  (mid, medium)
  1 (secondary): (mid, medium)
  2 (outward):   (bottom, slow)

Catalog verification for slot 0 (mid, medium) with clarity=clear and bluegill_perch|baitfish forage:
  - suspending_jerkbait: column=mid, primary_pace=medium, forage=baitfish, clarity=clear,stained ✓
  - paddle_tail_swimbait: column=mid, primary_pace=medium, forage=baitfish+bluegill_perch, clarity=all ✓ (forage match on both)
  - swim_jig: column=mid, primary_pace=medium, forage=bluegill_perch+baitfish, clarity=stained,dirty ✗ (not clear)
  - spinnerbait: column=mid, primary_pace=medium, forage=baitfish+bluegill_perch, clarity=stained,dirty ✗ (not clear)
  - medium_diving_crankbait: column=mid, primary_pace=medium, forage=baitfish+crawfish, clarity=all ✓
  - bladed_jig: column=mid, primary_pace=medium, forage=baitfish+crawfish, clarity=stained,dirty ✗ (not clear)

Two strong headline candidates with forage match: paddle_tail_swimbait (bluegill_perch+baitfish) and suspending_jerkbait (baitfish).
Seeded pick → paddle_tail_swimbait wins (primary_forage match on bluegill_perch).

Slot 1 (mid, medium), excluding family_group "paddle_tail"/"swimbait":
  - suspending_jerkbait ✓ (family "jerkbait" distinct)
  - medium_diving_crankbait ✓ (family "crankbait" distinct)
  Seeded pick → suspending_jerkbait.

Slot 2 (bottom, slow) — forage not gated for alternates:
  - texas_rigged_soft_plastic_craw, football_jig, finesse_jig, shaky_head_worm, ned_rig, tube_jig, hair_jig, blade_bait (bottom/slow primary)
  Seeded pick excluding "jerkbait" and "swimbait" → football_jig (crawfish forage).

Final top-3:
  0: paddle_tail_swimbait    (mid, medium, bluegill_perch+baitfish)  → HEADLINE
  1: suspending_jerkbait     (mid, medium, baitfish)                  → SECONDARY
  2: football_jig            (bottom, slow, crawfish)                 → OUTWARD

Surface cap: 0 surface picks. Passes.
No diagnostics fired (happy path).
```

### 14.3 Example C — December, Minnesota, Pike, Lake/Pond, stained water, wind 15 mph, `score=48` (neutral)

```
row.column_range    = ["bottom","mid"]          // cold northern lake; no upper/surface
row.column_baseline = "bottom"
row.pace_range      = ["slow"]                    // cold pike; slow only
row.pace_baseline   = "slow"
row.primary_forage  = "baitfish"
row.secondary_forage = undefined
row.surface_seasonally_possible = false

posture              = "neutral"
today_cols           = ["bottom","mid"]           (surface seasonally impossible, already absent)
column_distribution  = neutral, range.length=2 < 3 → 2+1 fallback:
  baseline=bottom, above=mid, below=bottom (clamp, == anchor)
  candidates = [mid]
  → ["bottom","bottom","mid"]
pace_distribution    = neutral, range.length=1 → degenerate:
  → ["slow","slow","slow"]

slot_recipe:
  0 (headline):  (bottom, slow)
  1 (secondary): (bottom, slow)
  2 (outward):   (mid, slow)

Catalog verification (flies — assuming authoring below; species_allowed must include "pike"):
  eligible pike flies per Appendix A (pike-allowed subset):
    - clouser_minnow      column=mid, primary=medium, secondary=fast
    - deceiver            column=mid, primary=medium
    - articulated_dungeon_streamer  column=mid, primary=slow, secondary=medium  (clarity: stained,dirty)
    - rabbit_strip_leech  column=bottom, primary=slow  (clarity: stained,dirty)
    - sculpin_streamer    column=bottom, primary=slow  (clarity: all)
    - sculpzilla          column=bottom, primary=slow, secondary=medium (clarity: stained,dirty)
    - pike_bunny_streamer column=mid, primary=slow, secondary=medium (clarity: stained,dirty)
    - large_articulated_pike_streamer column=mid, primary=slow, secondary=medium (clarity: stained,dirty)

Slot 0 (bottom, slow), forage=baitfish, clarity=stained:
  - sculpin_streamer ✓ (bottom/slow/baitfish+crawfish/all clarities) → forage match on baitfish
  - sculpzilla ✓ (bottom/slow/baitfish+crawfish/stained+dirty)
  - rabbit_strip_leech ✗ (forage=leech_worm only) — forage fails for headline
  Seeded pick from forage-matching set → sculpin_streamer.

Slot 1 (bottom, slow), excluding sculpin family:
  - sculpzilla ✓ (family_group may be "sculpin_family" — DUPLICATE with sculpin_streamer)
  - rabbit_strip_leech ✓ (family "leech_family" — distinct)
  Seeded pick → rabbit_strip_leech (or sculpzilla if family_group authoring makes them distinct).
  AUTHORING NOTE: If sculpin_streamer, sculpzilla, muddler_sculpin all share family_group "sculpin",
  slot 1 must pick from non-sculpin archetypes. Rabbit_strip_leech matches (bottom, slow) exactly.

Slot 2 (mid, slow), excluding sculpin + leech families:
  - pike_bunny_streamer ✓ (mid, slow primary, baitfish+bluegill_perch, stained+dirty)
  - articulated_dungeon_streamer ✓ (mid, slow primary, stained+dirty)
  - large_articulated_pike_streamer ✓ (mid, slow primary, stained+dirty)
  Seeded pick → pike_bunny_streamer.

Final top-3 flies:
  0: sculpin_streamer           (bottom, slow, baitfish+crawfish)     → HEADLINE
  1: rabbit_strip_leech         (bottom, slow, leech_worm)            → SECONDARY (forage-relaxed — leech doesn't match baitfish; the SECONDARY slot doesn't gate forage, so no fallback diagnostic)
  2: pike_bunny_streamer        (mid,    slow, baitfish+bluegill_perch) → OUTWARD
```

### 14.4 Example D — March, Tennessee (SE Atlantic), Smallmouth, River, stained water, wind 5 mph, `score=76` (aggressive)

```
row.column_range    = ["bottom","mid","upper"]   // river, pre-spawn
row.column_baseline = "mid"
row.pace_range      = ["slow","medium"]
row.pace_baseline   = "medium"
row.primary_forage  = "crawfish"
row.secondary_forage = "baitfish"
row.surface_seasonally_possible = false

posture              = "aggressive"
today_cols           = ["bottom","mid","upper"]
column_distribution  = aggressive:
  anchor_idx = mid, second_idx = shift(mid, +1) = upper
  → ["mid","mid","upper"]
pace_distribution    = aggressive, range=["slow","medium"], baseline="medium":
  anchor_idx = medium, second_idx = shift(medium, +1) = medium (clamp at top) === anchor
  clamp fallback → second_idx = shift(medium, -1) = slow
  → ["medium","medium","slow"]

slot_recipe:
  0 (headline):  (mid, medium)
  1 (secondary): (mid, medium)
  2 (outward):   (upper, slow)

Slot 0 (mid, medium), forage=crawfish|baitfish, clarity=stained:
  - bladed_jig: column=mid, primary=medium, forage=baitfish+crawfish, clarity=stained,dirty ✓ (forage match on crawfish primary)
  - swim_jig: column=mid, primary=medium, forage=bluegill_perch+baitfish, clarity=stained,dirty ✓ (secondary_forage match on baitfish)
  - lipless_crankbait: column=mid, primary=medium, forage=baitfish+crawfish, clarity=stained,dirty ✓ (forage match on both)
  - suspending_jerkbait: column=mid, primary=medium, forage=baitfish, clarity=clear,stained ✓ (secondary_forage on baitfish)
  Seeded pick → bladed_jig (or lipless_crankbait). Both primary-forage matches.

Slot 1 (mid, medium), excluding slot 0 family:
  - (if slot 0 was bladed_jig family "bladed_jig") remaining: swim_jig ✓, lipless_crankbait ✓, suspending_jerkbait ✓
  - Seeded pick → lipless_crankbait.

Slot 2 (upper, slow), forage not gated, clarity=stained:
  - weightless_stick_worm: column=upper, primary=medium, secondary=slow, leech_worm, all clarities ✓ (secondary_pace match)
  - soft_jerkbait: column=upper, primary=medium, secondary=slow, baitfish, clear+stained ✓
  - squarebill_crankbait: column=upper, primary=medium, secondary=fast — pace mismatch; relax step 1 fires.
  Exact matches exist (weightless_stick_worm, soft_jerkbait). Seeded pick → weightless_stick_worm.

Final top-3:
  0: bladed_jig              (mid, medium, baitfish+crawfish)     → HEADLINE (forage match on crawfish)
  1: lipless_crankbait       (mid, medium, baitfish+crawfish)     → SECONDARY
  2: weightless_stick_worm   (upper, slow-secondary, leech_worm)  → OUTWARD

Surface cap: 0 surface. Passes.
No diagnostics fired.
```

### 14.5 Example E — April, Florida (Gulf Coastal Plains), Largemouth Bass, Lake/Pond, clear water, wind 10 mph, `score=52` (neutral) — the 1+1+1 SPREAD case

```
row.column_range    = ["bottom","mid","upper","surface"]
row.column_baseline = "upper"
row.pace_range      = ["slow","medium","fast"]
row.pace_baseline   = "fast"
row.primary_forage  = "bluegill_perch"
row.secondary_forage = "baitfish"
row.surface_seasonally_possible = true

posture              = "neutral"
today_cols           = ["bottom","mid","upper","surface"]  (wind ok, posture ok, surface eligible)
column_distribution  = neutral, range.length=4 ≥ 3, baseline=upper interior (above=surface, below=mid):
  → 1+1+1 SPREAD → [upper, surface, mid]
pace_distribution    = neutral, range.length=3, baseline=fast at top edge (no above):
  → 2+1 FALLBACK → [fast, fast, medium]

slot_recipe:
  0 (headline):  (upper, fast)
  1 (secondary): (surface, fast)
  2 (outward):   (mid, medium)

Catalog verification:
  Slot 0 (upper, fast) clear water, forage bluegill_perch|baitfish:
    - squarebill_crankbait ✓ (upper, fast secondary, bluegill_perch+baitfish, stained+dirty) ✗ clarity fails "clear" — wait, clarity_strengths = stained,dirty. FAILS clarity gate for clear water.
    - Pool under "clear" drops squarebill. Remaining upper+fast in clear: NONE exact.
    - Pace relax (same column=upper, today_paces={fast, medium}):
      - weightless_stick_worm (upper, medium, leech_worm, all clarities) ✓ but forage doesn't match bluegill_perch|baitfish. Headline gate fails.
      - soft_jerkbait (upper, medium, baitfish, clear+stained) ✓ forage match on baitfish ✓
      - flat_sided_crankbait (upper, medium, baitfish, clear+stained) ✓ forage match on baitfish ✓
    - Seeded pick → soft_jerkbait (forage-matching) or flat_sided_crankbait.
    - DIAGNOSTIC: pace_relaxed for slot 0 (from fast to medium).

  Slot 1 (surface, fast) clear water:
    - buzzbait (surface, fast primary, surface_prey+baitfish, stained+dirty) ✗ clarity fails clear
    - walking_topwater (surface, medium primary, surface_prey+baitfish, clear+stained) ✓ — pace mismatch; relax
    - popping_topwater (surface, medium primary, secondary=slow, surface_prey, clear+stained) ✓ pace mismatch
    - prop_bait (surface, medium primary, surface_prey, clear+stained) ✓ pace mismatch
    - Pace relax (same column=surface, today_paces={fast, medium}): walking_topwater/popping_topwater/prop_bait all ✓
    - Family groups distinct from slot 0. Seeded pick → walking_topwater.
    - DIAGNOSTIC: pace_relaxed for slot 1.

  Slot 2 (mid, medium) clear water, forage not gated:
    - suspending_jerkbait (mid, medium, baitfish, clear+stained) ✓
    - paddle_tail_swimbait (mid, medium, baitfish+bluegill_perch, all) ✓
    - medium_diving_crankbait (mid, medium, baitfish+crawfish, all) ✓
    - casting_spoon (mid, medium, baitfish, clear+stained) ✓
    - Seeded pick → paddle_tail_swimbait (assuming family distinct from slots 0, 1).

Final top-3:
  0: soft_jerkbait            (upper, medium, baitfish)                    → HEADLINE
  1: walking_topwater         (surface, medium, surface_prey+baitfish)    → SECONDARY — aggressive-leaning
  2: paddle_tail_swimbait     (mid, medium, baitfish+bluegill_perch)       → OUTWARD — suppressed-leaning

Surface cap: 1 surface pick. Passes.
Diagnostics: pace_relaxed on slots 0 and 1.
```

Copy per §13.1 (shape="spread"):
- Slot 0: HEADLINE_FORAGE_MATCH — "Today's baitfish read lines up with a neutral, workable day — Soft Jerkbait leads the upper column steady medium line."
- Slot 1: SECONDARY_SPREAD — "If fish are willing to feed up today, Walking Topwater works the surface steady medium lane — one tier above the baseline."
- Slot 2: OUTWARD_SPREAD — "If the bite is tight today, Paddle-Tail Swimbait drops you to the mid-column steady medium lane — a conservative hedge from the baseline."

**What Example E demonstrates:** the 1+1+1 spread produces three genuinely distinct lanes on a neutral day. The user sees baseline-upper as the headline, surface as the aggressive alternate, and mid as the suppressed alternate — a coherent toolbox. The pace relax on slots 0 and 1 is a diagnostic signal that the catalog may lack a `(upper, fast, clear-allowed)` archetype; this will show up in production logs and drive future catalog expansion (adding a catalog archetype, not editing row metadata).

---

## 15. Identified flaws and mitigations

Every one of these is addressed by the engine design above. This section exists so implementers and reviewers don't have to re-derive them.

| # | Flaw | Mitigation |
|---|---|---|
| F1 | Small pools collapse to same 3 picks | Minimum pool of 6 (P18; 4 for trout). Below that, relaxation chain §12.3 fires and diagnostic `pool_undersized` is emitted. Because pools are computed at runtime from the full catalog (§11), small pools reflect a real biological constraint (narrow range + strict clarity) and not an authoring oversight. Coverage test (§20.4) surfaces cells where pools are chronically thin — catalog expansion, not row editing, is the fix. |
| F2 | Column spread impossible when pool lacks coverage | Relaxation chain §12.3 steps 1-4 walk the pool outward. Step 5 drops family redundancy as last resort. Only after step 5 failure does the engine throw. |
| F3 | Surface × posture edge cases (baseline at range top + aggressive) | Pseudocode in §6.2 includes clamp fallback for top-of-range aggressive. Verified in Example D. |
| F4 | Surface gate must filter range BEFORE posture math runs | Pseudocode in §8 filters first. Confirmed in all 5 worked examples. |
| F5 | Baseline drift across regions appears arbitrary | Authoring workflow §17 uses climate-zone defaults (Appendix B) with explicit per-row overrides. Validator reports unexplained neighbor-row deltas. |
| F6 | CSV ↔ TS divergence | Generated TS files carry `// DO NOT EDIT — generated from seasonal-matrix.csv` header. A CI check (`npm run check:seasonal-matrix-consistency`) regenerates and diffs; non-empty diff fails the build. |
| F7 | Surface cap flip target could be invalid column | §8 flips to `column_distribution[0]` (always in `today_columns`), never a hardcoded column. Relaxation chain handles empty candidate set. |
| F8 | Copy lies about forage when forage gate was relaxed | §13.1 `select_template` switches to `HEADLINE_NO_FORAGE_MATCH` when `forage_match_result !== "matched"`. No template ever claims forage alignment that didn't happen. |
| F9 | Missing `wind_speed_mph` opening surface incorrectly | P24 / G4 update: missing wind defaults to `99` mph (closes surface). Engine never opens a surface pick from an absence of data. |
| F10 | Anonymous or service-side invocations crash the seed builder | §12.5 / P27: `user_id` falsy → synthesized `"anon"` seed component. Picks remain deterministic per request. |
| F11 | Trout on `freshwater_lake_pond` causes row lookup failure | P26: edge function rejects with `400 invalid_context` before engine invocation. |
| F12 | Neutral-day output always same shape as aggressive/suppressed | §6.2 + P21: 1+1+1 SPREAD shape applies when range≥3 and baseline interior. Neutral days on wide ranges now offer three distinct lanes. |
| F13 | `primary_lure_ids` thin per posture shape (row passes G1 but fails headline coverage under aggressive/neutral) | G8 runs an expanded validator check per §15.2. |
| F14 | Surface flies must be species-restricted (mouse ≠ pike, frog ≠ trout, popper ≠ pike) | G7 enforces `species_allowed` per surface fly archetype at factory compile. |
| F15 | Diagnostic signals disappear if not persisted | P25 / §11.1: diagnostics emit via `console.warn` with stable prefix AND write to `recommender_diagnostics` table (best-effort, never blocks a user request). |
| F16 | Relaxation rates can silently drift upward across authoring passes | Coverage test (§20.4) asserts relaxation rate < 5% across all (species × region × month × water_type × posture × clarity) combinations. |

### 15.1 Validator catalog

Each validator runs at a defined lifecycle stage. CI enforces all of them.

#### G1 — Seasonal row validator (compile-time, per row)

Every seasonal row must satisfy:

- `column_baseline ∈ column_range`
- `pace_baseline ∈ pace_range`
- `column_baseline !== "surface"` (P14)
- `column_range.filter(c => c !== "surface").length >= 1` — after stripping surface, at least one column remains so baseline has a valid home.
- `primary_lure_ids.length >= 3` (headline needs a curated pool — DATA_QUALITY_ERROR below 3)
- `primary_fly_ids.length >= 3` (same; relaxed to 2 for trout-river-winter where catalog is thin — see G6)
- `primary_lure_ids ∩ excluded_lure_ids === ∅` — a primary can't also be excluded (contradiction)
- `primary_fly_ids ∩ excluded_fly_ids === ∅`
- At least 2 archetypes in `primary_lure_ids` have `forage_tags ∩ {primary_forage, secondary_forage}` non-empty (DATA_QUALITY_ERROR on fail)
- At least 2 archetypes in `primary_fly_ids` have `forage_tags ∩ {primary_forage, secondary_forage}` non-empty (DATA_QUALITY_ERROR on fail); relaxed to 1 for trout-river-winter if pool is chronically thin
- If `surface_seasonally_possible === true`, `column_range` must include `"surface"`; if false, it must NOT include `"surface"`
- Every archetype id in `primary_*_ids` and `excluded_*_ids` must exist in the catalog
- Every archetype in `primary_*_ids` must have the row's `species` in its `species_allowed`
- Every archetype in `primary_*_ids` must have the row's `water_type` in its `water_types_allowed`
- Every archetype in `primary_*_ids` must have `column ∈ row.column_range` — a primary can't be biologically out-of-range for its own row
- Every archetype in `primary_*_ids` must have `primary_pace ∈ row.pace_range` OR `secondary_pace ∈ row.pace_range`

**Error message contract for G1 failures.** The validator must produce actionable error messages (this matters because authoring errors will be the #1 source of Phase 3 iteration). Every G1 error message follows this template:

```
[G1] <rule_name> failed for row (species={species}, region={region_key}, month={month},
     water_type={water_type}, state={state_code or '*'})
     Offending value: <value>
     Expected: <rule>
     Likely cause: <one of: "copy-paste from wrong species row" |
                            "archetype catalog drift" |
                            "baseline edited without updating range" |
                            "new archetype missing from primary_ids" |
                            "CSV hand-edit typo">
     Fix: <specific actionable suggestion>
```

Worked example — the "bass row pasted into pike row" failure mode:

```
[G1] primary-species-gate failed for row (species=northern_pike, region=minnesota_ne,
     month=7, water_type=freshwater_lake_pond, state=*)
     Offending value: texas_rigged_stick_worm
     Expected: every id in primary_lure_ids must have northern_pike in its species_allowed
     Likely cause: copy-paste from wrong species row
     Fix: remove texas_rigged_stick_worm from primary_lure_ids, or (if pike should eat
          stick worms in your authoring opinion) update LURE_ARCHETYPES_V4.texas_rigged_stick_worm.species_allowed
          to include "northern_pike". Note: pike primary_lure_ids should emphasize
          pike-specific archetypes (large_bucktail_spinner, large_pike_topwater,
          pike_jig_and_plastic) — see §17.6 pike authoring guidance.
```

This catches the most common copy-paste failure mode with a clear fix path instead of a cryptic "species_allowed does not include northern_pike" error.

**Runtime pool-size check (advisory, not compile-time):** the coverage test (§20.4) simulates every (species, region, month, water_type, posture, clarity) cell and reports cells where the runtime-derived pool has fewer than 6 archetypes. Low-pool cells aren't errors — they're signals that catalog-level attributes may need tuning (e.g. adding a new mid-slow clarity=clear fly archetype). The coverage report is reviewed after each authoring pass.

#### G2 — Archetype validator (compile-time, per archetype)

- `column: TacticalColumn` is set
- `primary_pace` is set; if `secondary_pace` is set, it differs from `primary_pace`
- `forage_tags.length >= 1`
- `clarity_strengths.length >= 1`
- `how_to_fish_variants.length === 3`
- `species_allowed.length >= 1`
- `water_types_allowed.length >= 1`
- For FLY archetypes: `column === "surface"` allowed ONLY for the three authored topwater flies (`popper_fly`, `frog_fly`, `mouse_fly`). Any other fly with `column === "surface"` fails validation. (P13)

#### G3 — Determinism

All tests that consume picker output supply a fixed seed. Integration tests assert identical output from identical inputs.

#### G4 — Missing wind

`env_data.wind_speed_mph` is missing or non-numeric → `wind_mph = 99`. Engine emits diagnostic `wind_missing: true`. Engine does NOT throw.

#### G5 — Missing state_code

Falls back to region-scoped row. Same as v3 behavior. If neither state-scoped nor region-scoped row exists for the (species, region, month, water_type) tuple → coverage-test failure at CI (not a runtime fallback).

#### G6 — Per-species forage restrictions

The `forage_policy` per species governs which `primary_forage` values are authorable:

```ts
export const FORAGE_POLICY_V4: Record<RecommenderV4Species, ReadonlySet<ForageBucket>> = {
  largemouth_bass:  new Set(["baitfish","bluegill_perch","crawfish","leech_worm","surface_prey"]),
  smallmouth_bass:  new Set(["baitfish","crawfish","leech_worm","bluegill_perch","insect_misc","surface_prey"]),
  northern_pike:    new Set(["baitfish","bluegill_perch","surface_prey"]),  // no insect_misc, no leech_worm
  trout:            new Set(["baitfish","crawfish","leech_worm","surface_prey"]),  // NO insect_misc — streamers-only
};
```

Rationale for trout: with streamers + mouse surface flies only, no catalog archetype meaningfully imitates a hatching insect. Authors expressing "insect hatch month" on a trout row must use `leech_worm` (woolly bugger / leech patterns cover attractor retrieves). G6 rejects trout rows with `primary_forage === "insect_misc"` or `secondary_forage === "insect_misc"` as DATA_QUALITY_ERROR.

Because the eligible pool is derived at runtime (§11), there is no `eligible_fly_ids.length` minimum to check. The runtime check that matters is the §20.4 coverage test, which reports trout-river-winter cells with fewer than 4 archetypes in the runtime pool (vs 6 for non-trout) so authors can decide whether to expand the catalog. This is accepted trade-off per P13.

#### G7 — Surface fly species restrictions (P23)

Per archetype:

- `popper_fly.species_allowed ⊆ {largemouth_bass, smallmouth_bass}` — no pike, no trout
- `frog_fly.species_allowed ⊆ {largemouth_bass, northern_pike}` — no trout, no smallmouth
- `mouse_fly.species_allowed === {trout}` — trout only; bass anglers do fish mouse flies but user-specified exclusion

No other fly archetype may have `column === "surface"`. Validator fails if any fly catalog entry violates these.

#### G8 — Primary-ids posture coverage (per-row)

For each seasonal row, the validator simulates the distribution resolution for all three postures (aggressive, neutral, suppressed) and for each posture checks that `primary_lure_ids` contains at least **1** archetype whose `(column, primary_pace | secondary_pace)` matches the slot-0 target of that posture's distribution. Same check for `primary_fly_ids`.

If the check fails for any posture, the validator emits DATA_QUALITY_WARN with the posture name — authors know the headline-pool fallback chain will fire for that posture. A failed check is not fatal (headline fallback guarantees a pick) but repeated warnings identify rows needing catalog expansion.

#### G9 — Cross-row neighbor consistency (advisory)

Runs as a report, not a hard block. For each (species, region, water_type), it scans month-to-month transitions and flags unexplained `column_baseline` or `pace_baseline` jumps (a 2-tier shift month-over-month is suspicious and usually means authoring forgot a transition month). Output: human-readable Markdown report for author review.

### 15.2 Failure-mode coverage matrix

The engine must produce correct output for the full cross-product of conditions. The coverage test (§20.4) enumerates this matrix:

| Axis | Values |
|---|---|
| Species | largemouth_bass, smallmouth_bass, northern_pike, trout |
| Water type | freshwater_lake_pond, freshwater_river (trout: river only per P26) |
| Water clarity | clear, stained, dirty |
| Posture | aggressive, neutral, suppressed |
| Month | 1-12 |
| Region | All 18 supported regions (per-species eligibility from state-species gate) |

Total cells under consideration: ~5,000+ distinct scenarios. The coverage test must produce a valid 3-pick response for every cell. Any cell that errors is a blocking regression.

---

## 16. Data schemas

### 16.1 `TacticalColumn` / `TacticalPace`

```ts
export const TACTICAL_COLUMNS_V4 = ["bottom", "mid", "upper", "surface"] as const;
export type TacticalColumn = (typeof TACTICAL_COLUMNS_V4)[number];

export const TACTICAL_PACES_V4 = ["slow", "medium", "fast"] as const;
export type TacticalPace = (typeof TACTICAL_PACES_V4)[number];
```

`TacticalPresence` does not exist in v4.

### 16.2 `ForageBucket`

```ts
export const FORAGE_BUCKETS_V4 = [
  "baitfish",
  "crawfish",
  "bluegill_perch",
  "leech_worm",
  "insect_misc",
  "surface_prey",
] as const;
export type ForageBucket = (typeof FORAGE_BUCKETS_V4)[number];
```

Unchanged from v3; moved to `v4/contracts.ts`.

### 16.3 `ArchetypeProfileV4`

```ts
export type ArchetypeProfileV4 = {
  id: ArchetypeIdV4;
  display_name: string;
  gear_mode: "lure" | "fly";
  species_allowed: readonly SpeciesGroup[];
  water_types_allowed: readonly EngineContext[];
  family_group: string;
  column: TacticalColumn;                   // single, no secondary
  primary_pace: TacticalPace;
  secondary_pace?: TacticalPace;
  forage_tags: readonly ForageBucket[];
  clarity_strengths: readonly WaterClarity[];
  is_surface: boolean;                      // derived: column === "surface"
  how_to_fish_variants: readonly [string, string, string]; // [clear, stained, dirty]
};
```

**Removed from v3 archetype type:** `column_range`, `primary_column`, `secondary_column`, `presence`, `secondary_presence`, `presence_range`, `pace_range` (replaced by `primary_pace` + `secondary_pace`), `tactical_lane`, `current_friendly`, `why_hooks`, `how_to_fish_template`.

**Tactical lane is removed.** The `bottom_contact` / `fly_bottom` / `surface` / `fly_surface` lanes existed to enforce "bottom lures must be column=bottom" at the factory level. In v4 the invariant is enforced directly: every lure has one authored column; no tactical_lane tag is needed. The factory asserts `column !== "surface"` for flies and `column_baseline !== "surface"` for rows. Lane tags add metadata without changing behavior and are dropped.

### 16.4 `SeasonalRowV4`

```ts
export type SeasonalRowV4 = {
  species: RecommenderV4Species;
  region_key: RegionKey;
  month: number;              // 1-12
  water_type: EngineContext;  // freshwater_lake_pond | freshwater_river

  state_code?: string;        // optional US 2-letter; rows with state_code win over regional

  column_range: readonly TacticalColumn[];
  column_baseline: TacticalColumn;      // ∈ column_range, ≠ "surface"
  pace_range: readonly TacticalPace[];
  pace_baseline: TacticalPace;          // ∈ pace_range

  primary_forage: ForageBucket;
  secondary_forage?: ForageBucket;

  surface_seasonally_possible: boolean; // must match column_range containing "surface"

  primary_lure_ids: readonly LureArchetypeIdV4[];
  primary_fly_ids: readonly FlyArchetypeIdV4[];

  excluded_lure_ids?: readonly LureArchetypeIdV4[]; // default []; rare expert opt-outs
  excluded_fly_ids?: readonly FlyArchetypeIdV4[];   // default []; rare expert opt-outs
};
```

**Removed from v3 seasonal row:** `monthly_baseline` (flattened), `allowed_columns`, `column_preference_order`, `allowed_paces`, `pace_preference_order`, `allowed_presence`, `presence_preference_order`, `typical_seasonal_water_column`, `typical_seasonal_location`, `state_scoring_adjustments`.

**Removed from the v4 draft (previous revision of this doc):** `eligible_lure_ids`, `eligible_fly_ids`. The eligible pool is now derived at runtime from the full archetype catalog (§11) using the archetype's own `species_allowed`, `water_types_allowed`, `column`, `primary_pace`, `secondary_pace`, and `clarity_strengths` intersected with today's tactical columns / paces / clarity. This removes ~10,000 hand-authored decisions and eliminates the "forgot to add a new lure to old rows" bug class.

`primary_lure_ids` and `primary_fly_ids` are REQUIRED in v4. They are the HEADLINE curation — slot 0 prefers to draw from them. They're not the pool; the pool is everything in the catalog that passes the runtime filter. Primary ids are small (typically 4-8 per row) and hand-curated for credibility.

`excluded_*_ids` is OPTIONAL and defaults to empty. Populate only for the rare cases where a specific archetype passes all runtime gates but is known to be a bad recommendation for this row — see §11 escape-hatch discussion. Default expectation: <5% of rows populate this; when populated, usually 1-2 ids.

### 16.5 `DailyPayloadV4`

```ts
export type DailyPayloadV4 = {
  posture: "aggressive" | "neutral" | "suppressed";
  wind_mph: number;
  water_clarity: WaterClarity;
  hows_fishing_score: number; // 10-100, kept for diagnostics/copy
};
```

No shifts. No windows. No opportunity modes. No presence fields.

### 16.6 `ResolvedTacticsV4`

```ts
export type ResolvedTacticsV4 = {
  today_columns: readonly TacticalColumn[];
  column_distribution: readonly [TacticalColumn, TacticalColumn, TacticalColumn];
  pace_distribution: readonly [TacticalPace, TacticalPace, TacticalPace];
};
```

Produced by `resolveTodayTacticsV4(row, daily)`.

### 16.7 `RankedRecommendationV4` and `RecommenderResponseV4`

Declared in §5.2.

---

## 17. Seasonal-matrix authoring workflow (CSV pipeline)

### 17.1 Why CSV

Authoring volume: ~1,000-1,500 rows across species × regions × months × water_types × optional state overrides. This is too many to review inside TypeScript files. CSV enables:

- Per-species auditing in a spreadsheet by a fishing-literate reviewer.
- Climate-zone propagation with per-row overrides.
- Diff-friendly git history (one row per line).
- A simple reverse pipeline: edit CSV → regenerate TS → commit both.

### 17.2 File location

- `TightLinesAI/data/seasonal-matrix/largemouth_bass.csv`
- `TightLinesAI/data/seasonal-matrix/smallmouth_bass.csv`
- `TightLinesAI/data/seasonal-matrix/northern_pike.csv`
- `TightLinesAI/data/seasonal-matrix/trout.csv`

One CSV per species. Rows are authored per (region × month × water_type × optional state_code).

### 17.3 CSV schema

Columns (header row, in order):

```
species,region_key,month,water_type,state_code,
column_range,column_baseline,
pace_range,pace_baseline,
primary_forage,secondary_forage,
surface_seasonally_possible,
primary_lure_ids,
primary_fly_ids,
excluded_lure_ids,
excluded_fly_ids,
notes
```

Field rules:

- `column_range`, `pace_range`: pipe-separated, e.g. `bottom|mid|upper|surface`.
- `*_ids` columns: pipe-separated archetype ids. `excluded_*_ids` may be empty (default).
- `state_code`: empty string for regional rows; uppercase 2-letter for overrides.
- `secondary_forage`: empty string when absent.
- `notes`: free text, not consumed by the engine; for authoring comments.

**Removed columns (from earlier v4 draft):** `eligible_lure_ids`, `eligible_fly_ids`. Authors no longer list per-row eligibility; the engine derives it at runtime from the catalog (§11). If migrating an existing draft CSV, delete those two columns and add `excluded_lure_ids,excluded_fly_ids` (both empty by default).

### 17.4 Generator

A Deno script at `TightLinesAI/scripts/generate-seasonal-rows-v4.ts`:

```
Usage: deno run -A scripts/generate-seasonal-rows-v4.ts

Reads:  data/seasonal-matrix/{species}.csv
Writes: supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/{species}.ts

Each generated file starts with the banner:
  // ┌────────────────────────────────────────────────────────────┐
  // │ GENERATED FILE — DO NOT EDIT BY HAND                       │
  // │ Source: data/seasonal-matrix/{species}.csv                 │
  // │ Regenerate: npm run gen:seasonal-rows-v4                   │
  // └────────────────────────────────────────────────────────────┘

Validates each row against §15.1 G1 before writing. Any validation error
is fatal (process exits 1). DATA_QUALITY_WARN entries are written to
stderr but do not fail the process.
```

A consistency check at `TightLinesAI/scripts/check-seasonal-matrix-consistency.ts`:

```
Usage: deno run -A scripts/check-seasonal-matrix-consistency.ts

Runs the generator to a temporary location, then diffs against
the committed generated files. Any diff exits 1.
```

Wired into package.json:

```json
{
  "scripts": {
    "gen:seasonal-rows-v4":   "deno run -A scripts/generate-seasonal-rows-v4.ts",
    "check:seasonal-matrix":  "deno run -A scripts/check-seasonal-matrix-consistency.ts",
    "audit:catalog-gaps":     "deno run -A scripts/catalog-gap-analysis-v4.ts",
    "audit:eligibility":      "deno run -A scripts/audit-eligibility-by-region-v4.ts"
  }
}
```

CI runs `npm run check:seasonal-matrix` on every PR. Local pre-commit hook runs `npm run gen:seasonal-rows-v4` when a CSV changes.

### 17.5 Climate-zone authoring helper

Optional layer for initial authoring pass. See Appendix B.

### 17.6 Per-species authoring guidance

Species-specific rules authors must follow. Validator (G6) enforces these.

**Largemouth bass:**
- All 4 water-column tiers available across spring through fall in most regions.
- Primary forage vocabulary: `baitfish`, `bluegill_perch`, `crawfish`, `leech_worm`, `surface_prey`.
- Surface seasonally possible from late spring to early fall in most southern regions; summer only in northern regions.
- Use `bluegill_perch` as primary forage during bluegill spawn (late spring) and post-spawn (summer) in all regions that have bluegill populations.

**Smallmouth bass:**
- Crawfish dominates as primary forage across most of the year in rocky rivers.
- `insect_misc` is valid primary forage for smallmouth in early summer in rivers (hex hatch, hellgrammite drift) — mayfly/stonefly-imitating drift patterns.
- Surface is seasonally possible in warmer months; stream smallmouth feed up on terrestrials.
- `bluegill_perch` is NOT a smallmouth primary forage — use `baitfish` for minnow-imitating patterns.

**Northern pike:**
- Column range typically `[bottom, mid]` winter, `[bottom, mid, upper]` summer, surface possible in early summer on windless days only.
- Primary forage vocabulary is restricted (G6): `baitfish`, `bluegill_perch`, `surface_prey`.
- Pike do NOT eat insects meaningfully — `insect_misc` is rejected for pike rows.
- `primary_*_ids` for pike should emphasize large-profile pike-specific archetypes (`large_bucktail_spinner`, `large_pike_topwater`, `pike_jig_and_plastic`) and pike-allowed bass lures (`bladed_jig`, `swim_jig`, `paddle_tail_swimbait`, `spinnerbait`, `buzzbait`). Bass-scale archetypes that technically pass the runtime filter (e.g., `drop_shot_worm`) shouldn't be in `primary_*_ids` but may surface in alternates — that's fine; pike do eat small baits opportunistically.

**Trout (river only — P26):**
- Column range typically `[bottom, mid]` cold months; `[bottom, mid, upper, surface]` with surface seasonally possible only in warmer months (June-September in most regions) for night mouse patterns.
- Primary forage vocabulary (G6): `baitfish`, `crawfish`, `leech_worm`, `surface_prey`.
- `insect_misc` is REJECTED by G6. For hatch-dominant months, author `leech_worm` as primary forage — woolly bugger and leech patterns cover attractor retrieves during hatches.
- Runtime pool for trout rows typically yields 4-8 eligible flies (smaller than bass). Coverage test (§20.4) flags cells below 4 as thin — the fix is catalog expansion, not row editing.
- `primary_fly_ids` for trout should emphasize: woolly_bugger, sculpin_streamer, muddler_sculpin, sculpzilla, rabbit_strip_leech, balanced_leech, clouser_minnow, conehead_streamer, zonker_streamer, mouse_fly (only in months with `surface_seasonally_possible === true` AND region supports night mouse fishing).
- `mouse_fly` should only appear in `primary_fly_ids` when the row's `surface_seasonally_possible === true`. If a trout row has `surface_seasonally_possible === false`, `mouse_fly` in `primary_fly_ids` is a G1 validator error (column not in range).

### 17.7 Authoring budget estimate

Realistic effort (dramatically reduced from earlier draft because `eligible_*_ids` authoring is eliminated — authors now curate only `primary_*_ids` plus the occasional `excluded_*_ids`):

- **Largemouth bass:** 18 regions × 12 months × 2 water_types = 432 rows. ~6 min/row (ranges + baselines + forage + 4-8 primary ids) = 43 hours.
- **Smallmouth bass:** 18 regions × 12 months × 2 water_types = 432 rows. ~6 min/row = 43 hours.
- **Northern pike:** ~10 regions × 12 months × 2 water_types = 240 rows. ~5 min/row (simpler forage) = 20 hours.
- **Trout:** ~15 regions × 12 months × 1 water_type = 180 rows. ~6 min/row = 18 hours.
- **State-code overrides:** ~50-100 rows total across all species × 4 min/row = 7 hours.
- **Per-region × 12-month eligibility audit** (§17.8, new): simulate pool across all months for each (species, region, water_type) and visually review the 12-month arc. ~10 min/(species, region, water_type) triple = ~(18+18+10+15) × 2 × 10 min = 60 hours for bass species, 40 hours for pike, 30 hours for trout (river only) = ~22 hours aggregated. Round to 25 hours.
- **Validation iteration & review:** 20-25 hours.

Total: **~175-200 hours = 4-5 weeks of part-time authoring** or 1-1.5 weeks full-time with a dedicated fishing-literate reviewer. This is roughly half the earlier estimate, freed up by dropping `eligible_*_ids`.

### 17.8 Per-region × 12-month eligibility audit (NEW — replaces the removed `eligible_*_ids` review)

Because the eligible pool is now derived at runtime, authors must verify that the runtime-derived pool looks correct across every month of every (species, region, water_type) combination. A tooling script assists:

`TightLinesAI/scripts/audit-eligibility-by-region-v4.ts` takes `(species, region, water_type)` and outputs a markdown table:

```
## largemouth_bass — appalachia_piedmont — freshwater_lake_pond

| Month | Clarity | Posture | Pool size | Top-5 ids by family | Notes |
| 1 | clear | aggressive | 8 | texas_rigged_craw(jig), shaky_head_worm(finesse), ned_rig(finesse), deep_diving_crankbait(crank), flat_sided_crankbait(crank) | |
| 1 | clear | neutral | 7 | ...
...
| 12 | dirty | suppressed | 4 | compact_flipping_jig(jig), ... | POOL THIN — verify |
```

The author (or a fishing-literate reviewer) scans this table and flags:
- Pools that feel too big (lots of noise) → tune archetype `clarity_strengths` or add `excluded_*_ids`.
- Pools that feel too small (same 3 picks over and over) → expand archetype `species_allowed` / add catalog archetype.
- Month-to-month arcs that feel wrong (e.g., spinnerbait missing all summer) → check archetype attributes.

This review replaces the per-row `eligible_lure_ids` authoring that the earlier draft required. The review is faster because it's a scan of the full arc, not row-by-row editing. Required before shipping each species. Reviewer signs off in Phase 9 (§26 Appendix E).

### 17.9 Pre-authoring catalog gap analysis (MUST run before Phase 3 authoring begins)

**Why this exists.** Before the author writes a single seasonal row, they need to know where the catalog has thin cells. Otherwise they'll author 180 trout rows and discover at coverage-test time that half of trout-winter-clear cells only have 3 archetypes because the catalog lacks a `(bottom, slow, clear)` trout-allowed fly. Fixing the catalog AFTER authoring is expensive — you re-run every audit. Fixing it BEFORE authoring costs nothing.

**The script.** `TightLinesAI/scripts/catalog-gap-analysis-v4.ts` enumerates the full cross-product of possible runtime filters and reports archetype counts per cell. It does NOT require the seasonal matrix to exist; it operates purely on the catalog.

```
Usage: deno run -A scripts/catalog-gap-analysis-v4.ts [--species <id>] [--format markdown|json]

For every (species, water_type, column, pace, clarity) cell in the cross-product:
  - Count archetypes in LURE_ARCHETYPES_V4 matching: species_allowed, water_types_allowed, column, (primary_pace == pace OR secondary_pace == pace), clarity_strengths.
  - Same for FLY_ARCHETYPES_V4.
  - Emit a row: species | water_type | column | pace | clarity | lure_count | fly_count | verdict

Verdict values:
  - "ok"        — lure_count >= 4 AND fly_count >= 3
  - "thin"      — below that but >= 2 of each
  - "critical"  — < 2 of either

Output: TightLinesAI/docs/authoring/catalog-gap-analysis.md
```

**What the author does with the output.** For every `"critical"` cell, decide one of three responses:
1. **Expand the catalog.** Add a new archetype or broaden an existing archetype's `clarity_strengths` / `species_allowed` / `water_types_allowed`. (Preferred when the biological case is real — e.g., a `sculpin_olive_jig` for trout-bottom-slow-clear.)
2. **Accept the thinness.** Document in the gap-analysis file that this cell is inherently sparse and relaxation is acceptable. (E.g., trout-surface-fast-dirty is genuinely rare; relaxation here is fine.)
3. **Remove the cell from possible rows.** If no (species, region, month) combination would actually land on this cell, flag it as unreachable. (Rare — most cells are reachable via some region/month combination.)

For every `"thin"` cell, record the verdict in the gap-analysis file but proceed with authoring — the coverage test will report relaxation frequency and the per-region audit (§17.8) will catch any specific row that exposes the thinness.

**Required before Phase 3 authoring begins.** The implementing agent MUST run this script, commit the output markdown, and the reviewer MUST sign off on the `critical` cells before row authoring starts. This prevents the "author 180 rows then discover 40 of them can't produce a credible headline" failure mode.

**Rerun after any catalog edit.** Any change to lure or fly catalog attributes (archetype added/removed, clarity_strengths broadened, species_allowed changed) invalidates the gap analysis. Rerun and re-review.

---

## 18. File-by-file delete / keep / modify map

### 18.1 DELETE — wholesale

These files exist only to serve v3's scoring / tier logic and have no place in v4. Delete in Phase 4 after shadow-mode validation.

```
supabase/functions/_shared/recommenderEngine/v3/scoreCandidates.ts            (731 lines)
supabase/functions/_shared/recommenderEngine/v3/scoring/scoreCandidates.ts
supabase/functions/_shared/recommenderEngine/v3/scoring/index.ts
supabase/functions/_shared/recommenderEngine/v3/scoring/guards/largemouthLakeGuards.ts
supabase/functions/_shared/recommenderEngine/v3/scoring/guards/practicalityStateGuards.ts
supabase/functions/_shared/recommenderEngine/v3/scoring/guards/smallmouthGuards.ts
supabase/functions/_shared/recommenderEngine/v3/scoringTypes.ts
supabase/functions/_shared/recommenderEngine/v3/topThreeSelection.ts          (376 lines)
supabase/functions/_shared/recommenderEngine/v3/resolveDailyPayload.ts        (401 lines)
supabase/functions/_shared/recommenderEngine/v3/resolveFinalProfile.ts        (141 lines)
supabase/functions/_shared/recommenderEngine/v3/speciesMetabolicContext.ts    (118 lines)
supabase/functions/_shared/recommenderEngine/v3/recommendationCopy.ts         (616 lines)
supabase/functions/_shared/recommenderEngine/v3/recommendationCopy.test.ts

supabase/functions/_shared/recommenderEngine/v3/seasonal/largemouth.ts        (legacy)
supabase/functions/_shared/recommenderEngine/v3/seasonal/largemouth/          (all files)
supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts        (1914 lines)
supabase/functions/_shared/recommenderEngine/v3/seasonal/pike.ts              (1055 lines)
supabase/functions/_shared/recommenderEngine/v3/seasonal/trout.ts             (997 lines)
supabase/functions/_shared/recommenderEngine/v3/seasonal/tuning.ts            (361 lines)
supabase/functions/_shared/recommenderEngine/v3/seasonal/validateSeasonalRow.ts (329 lines)
supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.ts (161 lines)
supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.cartesian.test.ts
supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.stateScoped.test.ts
supabase/functions/_shared/recommenderEngine/v3/seasonal/index.ts             (exports only)

supabase/functions/_shared/recommenderEngine/v3/candidates/lures.ts           (824 lines; replaced)
supabase/functions/_shared/recommenderEngine/v3/candidates/flies.ts           (575 lines; replaced)
supabase/functions/_shared/recommenderEngine/v3/candidates/index.ts           (replaced)

supabase/functions/_shared/recommenderEngine/runRecommenderV3.ts
supabase/functions/_shared/recommenderEngine/runRecommenderV3Surface.ts
supabase/functions/_shared/recommenderEngine/runRecommenderV3.cartesian.test.ts

supabase/functions/_shared/recommenderEngine/__tests__/authoringTuning.test.ts
supabase/functions/_shared/recommenderEngine/__tests__/gatingParity.test.ts
supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts   (generated CSV rows)
supabase/functions/_shared/recommenderEngine/__tests__/peerCoherenceTopThree.test.ts
supabase/functions/_shared/recommenderEngine/__tests__/v3DailyShiftAnchors.test.ts
supabase/functions/_shared/recommenderEngine/__tests__/v3Foundation.test.ts
supabase/functions/_shared/recommenderEngine/__tests__/v3RegressionBaselines.test.ts
supabase/functions/_shared/recommenderEngine/__tests__/v3SeasonalRegressionAnchors.test.ts
supabase/functions/_shared/recommenderEngine/__tests__/rebuildSurfaceContract.test.ts

supabase/functions/_shared/recommenderEngine/ENGINE_V3_MAINTAINER_GUIDE.md    (replaced)

scripts/recommender-v3-audit/                                                  (entire dir)
scripts/recommender-v3-report-audit/                                           (entire dir)
```

### 18.2 DELETE — v3 contracts file after v4 lands

```
supabase/functions/_shared/recommenderEngine/v3/contracts.ts        (474 lines; replaced by v4/contracts.ts)
supabase/functions/_shared/recommenderEngine/v3/index.ts            (replaced by v4/index.ts)
supabase/functions/_shared/recommenderEngine/v3/scope.ts            (replace with v4/scope.ts)
supabase/functions/_shared/recommenderEngine/v3/colorDecision.test.ts (replaced by v4 test)
```

### 18.3 DELETE — stale documentation

```
docs/recommender-v3-fix-plan.md
docs/recommender-v3-nine-of-ten-plan.md
docs/recommender-v3-post-tuning-checklist.md
docs/recommender-v3-roadmap.md
docs/recommender-v3-renovation-spec.md
docs/recommender-v3-maintainer-guide.md
docs/recommender-audit-tuning-plan.md
docs/audits/recommender-v3/                                        (entire dir)
```

### 18.4 KEEP — unchanged

```
supabase/functions/_shared/recommenderEngine/v3/colorDecision.ts   (move to v4/; zero code changes)
supabase/functions/_shared/recommenderEngine/v3/colors.ts          (move to v4/; zero code changes)
supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts
supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.consistency.test.ts
supabase/functions/_shared/recommenderEngine/contracts/input.ts
supabase/functions/_shared/recommenderEngine/contracts/species.ts
supabase/functions/_shared/recommenderEngine/contracts/families.ts
supabase/functions/_shared/recommenderEngine/contracts/mod.ts
supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts
supabase/functions/_shared/howFishingEngine/**                     (entire tree — consumed by v4)
```

### 18.5 MODIFY

```
supabase/functions/_shared/recommenderEngine/index.ts
  — replace v3 re-exports with v4 re-exports
  — remove re-exports for deleted types (presence, windows, opportunity mix, etc.)
  — keep state-gating and shared infrastructure re-exports

supabase/functions/_shared/recommenderEngine/contracts/output.ts
  — replace RankedRecommendation with RankedRecommendationV4
  — replace RecommenderSessionSummary with RecommenderSummaryV4
  — replace RecommenderResponse with RecommenderResponseV4
  — RECOMMENDER_FEATURE constant changes from "recommender_v3" to "recommender_v4"

supabase/functions/recommender/index.ts
  — import runRecommenderV4 instead of runRecommenderV3Surface
  — pass user.id as seed component
  — update response serialization to v4 shape
  — keep all auth, subscription, and state-species gate logic unchanged

supabase/functions/recommender/index.test.ts
  — update assertions to match v4 response shape
  — drop any assertion referencing presence, opportunity_mix, surface_window

lib/recommenderContracts.ts                                        (frontend)
  — remove TacticalPresence type and related consts
  — RankedRecommendation: rename primary_column → column, drop presence
  — RecommenderSessionSummary: remove allowed_presence, preferred_presence,
    secondary_presence, surface_window, opportunity_mix; add today_column_distribution,
    today_pace_distribution per §5.2
  — RecommenderResponse: feature constant "recommender_v4"

components/fishing/RecommenderView.tsx                             (frontend)
  — remove any UI that renders presence
  — rename any `primary_column` references to `column`
  — summary section adjusts to v4 summary shape (remove opportunity mix pill etc.)

app/(any screen consuming the recommender)/*                       (frontend)
  — audit all call sites for removed fields; compile errors will enumerate them

scripts/asset_generation/                                          (keep if consumed)
scripts/audit/                                                     (keep, independent of v3)
scripts/generate-recommender-gating.ts                             (keep)
scripts/recommenderCalibrationScenarios.ts                         (keep if referenced by new
                                                                    v4 calibration; otherwise delete)
```

### 18.6 NEW — created in v4

```
supabase/functions/_shared/recommenderEngine/v4/
  contracts.ts                     — v4 types (ArchetypeProfileV4, SeasonalRowV4, etc.)
  constants.ts                     — POSTURE thresholds, wind threshold, min pool size
  scope.ts                         — species / context scope (mirror of v3/scope.ts)
  candidates/
    lures.ts                       — authored lure catalog per §16.3
    flies.ts                       — authored fly catalog per §16.3
    index.ts                       — merged export
  seasonal/
    resolveSeasonalRow.ts          — row lookup (state_code first, region fallback)
    generated/
      largemouth_bass.ts           — generated from CSV
      smallmouth_bass.ts           — generated from CSV
      northern_pike.ts             — generated from CSV
      trout.ts                     — generated from CSV
    index.ts                       — merged export of all species rows
  engine/
    resolveDailyPayload.ts         — builds DailyPayloadV4 from SharedConditionAnalysis + wind
    resolveTodayTactics.ts         — §6/§7 logic (distribution resolution)
    buildEligiblePool.ts           — §11 filter
    pickTop3.ts                    — §12 assembly + relaxation + surface cap
    buildCopy.ts                   — §13 copy synthesis
    diagnostics.ts                 — §11.1 diagnostic emitter (injected into pure engine)
    runRecommenderV4.ts            — top-level entry point
  colorDecision.ts                 — moved from v3, no changes
  colors.ts                        — moved from v3, no changes
  index.ts                         — public API
  __tests__/
    postureResolution.test.ts
    distributionResolution.test.ts     — including 1+1+1 spread cases
    surfaceGate.test.ts
    surfaceCapFlipTarget.test.ts       — verifies flip to column_distribution[0], not hardcoded upper
    forageGate.test.ts
    forageFallbackCopy.test.ts         — verifies copy never lies on forage relax
    clarityGate.test.ts
    poolConstruction.test.ts
    pickTop3.test.ts
    oneOnOneSpread.test.ts             — neutral 1+1+1 explicit scenarios
    surfaceFlySpeciesGate.test.ts      — G7
    windMissingDefault.test.ts         — G4
    anonSeedFallback.test.ts           — P27
    troutForagePolicy.test.ts          — G6
    pikeCatalogCoverage.test.ts        — pike-specific archetype reachability
    copyLayer.test.ts
    seasonalRowLookup.test.ts
    diagnostics.test.ts                — P25
    coverage.test.ts                   — §20.4 matrix (experimental v4 engine; opt-in `TL_RUN_V4_COVERAGE_MATRIX=1`)
        *(removed post-cutover: `runRecommenderV4.integration.test.ts` — brittle §14 synthetic scenarios; rely on distributionResolution + component tests.)*
    snapshots/
      aggressive.json
      suppressed.json
      neutral_narrow.json              — 2+1 fallback on narrow range
      neutral_spread.json              — 1+1+1 SPREAD
      surfaceClosed.json
      mixWaterClarity.json
      smallPoolRelaxation.json
      trout_winter.json
      trout_summer_mouse.json          — surface fly species-gating
      pike_winter.json
      bass_florida_neutral.json         — Example E

data/seasonal-matrix/
  largemouth_bass.csv
  smallmouth_bass.csv
  northern_pike.csv
  trout.csv
  schema.md                        — this spec's §17 condensed

scripts/
  generate-seasonal-rows-v4.ts
  check-seasonal-matrix-consistency.ts
  catalog-gap-analysis-v4.ts            — §17.9 pre-authoring catalog gap analysis (run before Phase 3)
  audit-eligibility-by-region-v4.ts     — §17.8 per-region × 12-month eligibility audit (run after Phase 3)
  shadow-mode-diff.ts                   — §21 tool for Phase 3
  clean-house-audit-v4.ts               — §18.7 grep-based clean-house verifier

docs/
  recommender-v4-simplified-design.md         — this file
  recommender-v4-maintainer-guide.md          — tight version of this file, post-ship
  authoring/catalog-gap-analysis.md           — §17.9 cross-product archetype count report
  authoring/coverage-per-region.md            — §20.4 per-(species, region, water_type) relaxation report
  authoring/eligibility-audits/               — §17.8 per-region × 12-month audit markdown output
    {species}-{region}-{water_type}.md
```

### 18.7 Clean-house discipline (mandatory before Phase 8 is complete)

The implementing agent MUST run and pass every check in this section before declaring the cleanup phase done. This is a hard gate on shipping.

#### 18.7.1 File-existence checks

```bash
# These paths MUST NOT exist after Phase 8:
test ! -d supabase/functions/_shared/recommenderEngine/v3
test ! -d scripts/recommender-v3-audit
test ! -d scripts/recommender-v3-report-audit
test ! -d docs/audits/recommender-v3

# These files MUST NOT exist:
test ! -f supabase/functions/_shared/recommenderEngine/runRecommenderV3.ts
test ! -f supabase/functions/_shared/recommenderEngine/runRecommenderV3Surface.ts
test ! -f docs/recommender-v3-fix-plan.md
test ! -f docs/recommender-v3-nine-of-ten-plan.md
test ! -f docs/recommender-v3-post-tuning-checklist.md
test ! -f docs/recommender-v3-roadmap.md
test ! -f docs/recommender-v3-renovation-spec.md
test ! -f docs/recommender-v3-maintainer-guide.md
test ! -f docs/recommender-audit-tuning-plan.md
test ! -f supabase/functions/_shared/recommenderEngine/ENGINE_V3_MAINTAINER_GUIDE.md
```

#### 18.7.2 Grep-based stale-reference checks

Each of the following `rg` commands MUST return zero matches:

```bash
# v3 engine imports and references:
rg --no-heading -l 'recommenderEngine/v3/' supabase/ lib/ app/ components/ hooks/ scripts/ | wc -l
# → 0

# v3-era type names:
rg --no-heading 'RankedRecommendation\b' supabase/ lib/ app/ components/ hooks/
rg --no-heading 'RecommenderSessionSummary\b' supabase/ lib/ app/ components/ hooks/
rg --no-heading 'RecommenderResponse\b' supabase/ lib/ app/ components/ hooks/
# → each returns 0 (v4 types are RankedRecommendationV4, etc., or post-Phase-8 renames)

# v3-era field names on output shape:
rg --no-heading '\bprimary_column\b' lib/ app/ components/ hooks/ supabase/functions/recommender/
rg --no-heading '\bpresence\b' lib/ app/ components/ hooks/ supabase/functions/recommender/
rg --no-heading '\bopportunity_mix\b' lib/ app/ components/ hooks/
rg --no-heading '\bsurface_window\b' lib/ app/ components/ hooks/
rg --no-heading '\bpreferred_presence\b' lib/ app/ components/ hooks/
rg --no-heading '\bpreferred_column\b' lib/ app/ components/ hooks/
rg --no-heading '\bsecondary_presence\b' lib/ app/ components/ hooks/
rg --no-heading '\bsecondary_column\b' lib/ app/ components/ hooks/
rg --no-heading '\ballowed_presence\b' lib/ app/ components/ hooks/
rg --no-heading '\breaction_window\b' lib/ app/ components/ hooks/
rg --no-heading 'recommender_v3' lib/ app/ components/ hooks/ supabase/
# → each returns 0

# v3 dead auxiliaries:
rg --no-heading 'speciesMetabolicContext' supabase/ lib/
rg --no-heading 'resolveFinalProfile' supabase/ lib/
rg --no-heading 'dimensionFit' supabase/ lib/
rg --no-heading 'scoreCandidates' supabase/ lib/
rg --no-heading 'topThreeSelection' supabase/ lib/
rg --no-heading 'tactical_lane' supabase/ lib/
# → each returns 0

# Water-temperature references in recommender code path (P15):
rg --no-heading 'water_temp' supabase/functions/_shared/recommenderEngine/ supabase/functions/recommender/
# → 0

# Feature flag logic must be removed:
rg --no-heading 'RECOMMENDER_ENGINE_VERSION' supabase/
# → 0

# v4 drafts of now-dropped eligible_*_ids field must not leak into code (ONLY doc mentions in §11/§16.4/§17.3 are allowed):
rg --no-heading 'eligible_lure_ids\|eligible_fly_ids' supabase/ lib/ app/ components/ hooks/ scripts/ data/
# → 0
```

#### 18.7.3 Package / build hygiene

- `package.json` scripts: no `:v4` suffix remains; scripts are named canonically (`gen:seasonal-rows`, `check:seasonal-matrix`).
- No `deno.json` / `import_map.json` entries referencing `v3/`.
- No dead npm dependencies introduced for v3-era work.
- `supabase/functions/_shared/recommenderEngine/index.ts` exports only v4 symbols (renamed, no `V4` suffix post-Phase-8).

#### 18.7.4 Test hygiene

- No test file references deleted modules. CI green across unit + integration + coverage tests.
- No `.skip(` or `.only(` calls left in v4 test files (stale).
- Snapshot directory matches §18.6 listing exactly (extra or missing snapshots fail this check).

#### 18.7.5 Documentation hygiene

- `docs/` contains `recommender-v4-simplified-design.md` (this file) and `recommender-v4-maintainer-guide.md`. No v3 docs.
- `README.md` and any onboarding docs no longer reference v3.
- `AGENTS.md` and `.cursor/rules/*.mdc` audited for v3 language.

#### 18.7.6 Automated runner — `scripts/clean-house-audit-v4.ts`

Implementer writes this script to encapsulate all grep checks above. Returns exit code 0 on clean, 1 on any residue with a summary of what was found and where. Add to CI on the main branch.

```
Usage: deno run -A scripts/clean-house-audit-v4.ts

Exit 0 → clean-house complete.
Exit 1 → stale v3 references found. Stdout lists paths and matches.
```

CI runs this on every PR AND nightly on main (to catch regressions where someone might reintroduce a v3 reference).

---

## 19. Phased implementation checklist

The work is ordered so that each phase produces a shippable state. No phase breaks production.

### Phase 0 — Prerequisites (half day)

- [ ] Verify `scored.score` comes back in range `[10, 100]` for a sample of live requests (from `howFishingEngine`).
- [ ] Verify `env_data.wind_speed_mph` is present on live requests; log rate of missing over a week of traffic. Per P24, the engine defaults missing wind to **99** (closes surface). The Phase 0 check is to understand upstream wind-data availability, NOT to validate the default.
- [ ] Confirm frontend `lib/recommenderContracts.ts` has one owner; identify all consumers of `primary_column`, `pace`, `presence`, `opportunity_mix`, `surface_window`, `preferred_*`, `secondary_*` via grep (these will break in Phase 5 output rename — inventory them now).
- [ ] Read this doc end to end. Open questions are raised before any code is written.

### Phase 1 — v4 scaffolding (2-3 days)

- [ ] Create `supabase/functions/_shared/recommenderEngine/v4/` directory tree per §18.6.
- [ ] Author `v4/contracts.ts` per §16. All types compile cleanly.
- [ ] Author `v4/constants.ts`:
  ```ts
  export const POSTURE_AGGRESSIVE_THRESHOLD = 70;
  export const POSTURE_SUPPRESSED_THRESHOLD = 35;
  export const SURFACE_WIND_THRESHOLD_MPH   = 18;
  export const MIN_ELIGIBLE_POOL_SIZE       = 6;
  ```
- [ ] Author `v4/scope.ts` — mirror `v3/scope.ts` (species × context gating). No behavior change.
- [ ] Move (not modify) `v3/colorDecision.ts` → `v4/colorDecision.ts` and `v3/colors.ts` → `v4/colors.ts`. Update imports.
- [ ] Author `v4/engine/resolveDailyPayload.ts`:
  - Inputs: `SharedConditionAnalysis`, `env_data.wind_speed_mph`, `water_clarity`.
  - Logic: `posture = resolvePostureV4(analysis.scored.score)`; extract wind; pass through clarity.
- [ ] Unit tests for `resolveDailyPayloadV4` (posture bucket edges, wind missing fallback).

### Phase 2 — Catalog authoring (3-5 days)

- [ ] Write `v4/candidates/lures.ts` from scratch following §16.3 schema. Base the authoring on the existing v3 `lures.ts`, carrying over:
  - Same 33 lure ids, PLUS 3 new pike-specific archetypes (see Appendix A): `large_bucktail_spinner`, `large_pike_topwater`, `pike_jig_and_plastic`.
  - `column` = the `primary_column` that was added in v3 (current authoring is already correct after the last pass).
  - `primary_pace` = `pace_range[0]` from v3.
  - `secondary_pace` = `pace_range[1]` from v3 if present, else undefined.
  - `clarity_strengths` unchanged.
  - `forage_tags` = `forage_matches` from v3.
  - `family_group` = `top3_redundancy_key ?? family_key` from v3. For the new pike archetypes, use distinct family_groups: `large_spinner`, `large_pike_surface`, `pike_jig`.
  - `how_to_fish_variants` unchanged.
  - `species_allowed`, `water_types_allowed` unchanged (verify against Appendix A — authoring must match).
  - Drop `current_friendly`, `why_hooks`, `how_to_fish_template`, `tactical_lane`, `primary_column`, `secondary_column`, `column_range`, `presence`, `secondary_presence`, `presence_range`.
- [ ] Author the 3 new pike archetypes per Appendix A (including `how_to_fish_variants` for clear/stained/dirty).
- [ ] Factory (`lure()`) asserts per §15.1 G2.
- [ ] Write `v4/candidates/flies.ts` following §16.3:
  - **KEEP** `popper_fly`, `frog_fly`, `mouse_fly` in the catalog; they are the three authored topwater flies per P13. NO nymphs and NO dry flies are added.
  - Enforce `species_allowed` per G7: popper_fly → bass only; frog_fly → largemouth+pike; mouse_fly → trout only.
  - For all non-surface flies: carry over v3 authoring as described above.
  - Factory (`fly()`) asserts per G2 (including the "column surface allowed only for popper/frog/mouse" check).
- [ ] Confirm `FLY_ARCHETYPE_IDS_V4` INCLUDES `popper_fly`, `frog_fly`, `mouse_fly` alongside the streamer ids.
- [ ] Unit tests for archetype validator (invariants fire on bad input — including: fly with `column="surface"` but id not in `{popper_fly, frog_fly, mouse_fly}` must throw; mouse_fly with species_allowed including pike must throw; etc.).

### Phase 2.5 — Catalog gap analysis gate (MUST pass before Phase 3 begins)

This is a hard gate. Do not start Phase 3 row authoring until this gate passes.

- [ ] Author `scripts/catalog-gap-analysis-v4.ts` per §17.9.
- [ ] Add npm script: `audit:catalog-gaps`.
- [ ] Run `npm run audit:catalog-gaps`. Output written to `TightLinesAI/docs/authoring/catalog-gap-analysis.md`.
- [ ] Review every `"critical"` cell in the output. For each, record the chosen response (expand catalog / accept thinness / mark unreachable) in the markdown with reviewer initials + date.
- [ ] If any `"critical"` cells warrant catalog expansion, loop back to Phase 2 (add/broaden archetypes), re-run gap analysis, re-review.
- [ ] Reviewer signs the top of `catalog-gap-analysis.md` with `Gate passed — Phase 3 may begin — <name> — <date>`.
- [ ] Commit the reviewed markdown to the repo before starting Phase 3.

### Phase 3 — CSV pipeline & seasonal matrix (5-10 days)

- [ ] Author `scripts/generate-seasonal-rows-v4.ts` per §17.4.
- [ ] Author `scripts/check-seasonal-matrix-consistency.ts`.
- [ ] Add npm scripts: `gen:seasonal-rows-v4`, `check:seasonal-matrix`.
- [ ] Add CI check to GitHub Actions that runs `check:seasonal-matrix`.
- [ ] Create `data/seasonal-matrix/schema.md` with the CSV header and column rules.
- [ ] **Author the CSVs.** This is the biggest lift. Recommended approach:
  1. Start from v3's seasonal rows. For each existing v3 row (per-species), compute CSV fields:
     - `column_range` = `monthly_baseline.allowed_columns`
     - `column_baseline` = `monthly_baseline.column_preference_order[0]` — if this is `"surface"`, substitute the next value down (enforce P14).
     - `pace_range` = `monthly_baseline.allowed_paces`
     - `pace_baseline` = `monthly_baseline.pace_preference_order[0]`
     - `primary_forage` = `monthly_baseline.primary_forage`
     - `secondary_forage` = `monthly_baseline.secondary_forage`
     - `surface_seasonally_possible` = from v3
     - `primary_lure_ids` = `primary_lure_ids` from v3 (if absent, pick 4-8 from the v3 `eligible_lure_ids` that match archetype's `species_allowed` + `water_types_allowed` + forage — per climate-zone defaults if the row is empty in v3)
     - `primary_fly_ids` same treatment
     - `excluded_lure_ids`, `excluded_fly_ids` = empty by default; populate only if v3 had manual curation signaling "exclude this id even if ranges allow"
  2. Hand-audit per species by a reviewer with fishing literacy (or the agent asking clarifying questions during authoring).
  3. Apply climate-zone grouping (Appendix B) for consistency across neighboring regions.
  4. **Do NOT migrate `eligible_lure_ids` / `eligible_fly_ids` from v3** — v4 does not have those fields. The runtime engine derives the pool from the catalog.
- [ ] Run generator; commit both CSVs and generated TS.
- [ ] Validator (`gen:seasonal-rows-v4`) passes cleanly with zero DATA_QUALITY_ERROR.
- [ ] DATA_QUALITY_WARN entries reviewed and either fixed or explicitly suppressed per row via the CSV's `notes` column.
- [ ] **Run per-region × 12-month eligibility audit** (§17.8) for every (species, region, water_type) combination. Output the per-region markdown tables into `TightLinesAI/docs/authoring/eligibility-audits/{species}-{region}-{water_type}.md`. Reviewer signs off each file.
- [ ] For any cell where the runtime pool is thin (<6 archetypes, or <4 for trout) AND the thinness is not biologically justified, either: (a) add a catalog archetype, (b) broaden an archetype's `clarity_strengths` / `species_allowed`, or (c) document the thinness in the row's `notes` column as accepted.

### Phase 4 — Engine logic (3-5 days)

- [ ] `v4/engine/resolveTodayTactics.ts` — §6/§7. Unit tests per §20.
- [ ] `v4/engine/buildEligiblePool.ts` — §11. Unit tests.
- [ ] `v4/engine/pickTop3.ts` — §12. Unit tests including each relaxation step.
- [ ] `v4/engine/buildCopy.ts` — §13. Unit tests for each template.
- [ ] `v4/engine/runRecommenderV4.ts` — top-level orchestration:
  ```ts
  export function runRecommenderV4(
    req: RecommenderRequest,
    user_id: string,
  ): RecommenderResponseV4
  ```
  No side effects. Pure function. Throws `RecommenderV4EngineError` on catastrophic pool failure.
- [x] ~~Integration test: `runRecommenderV4.integration.test.ts`~~ **Removed (2026 post-cutover)** — was synthetic/fragile; `distributionResolution.test.ts` + `pickTop3.test.ts` + `rebuildSurfaceContract.test.ts` cover production-relevant invariants.

### Phase 5 — Edge function + output contract (1 day)

- [ ] Update `contracts/output.ts` per §5.2.
- [ ] Update `recommenderEngine/index.ts` re-exports.
- [ ] Update `supabase/functions/recommender/index.ts`:
  - Import `runRecommenderV4`.
  - Pass `user.id` into engine.
  - Response serialization uses v4 shape.
- [ ] Update `recommender/index.test.ts` to v4 assertions.
- [ ] Update frontend `lib/recommenderContracts.ts` per §18.5.
- [ ] Fix compile errors across frontend consumers.
- [ ] Smoke-test via `recommender/index.test.ts`.

### Phase 6 — Shadow mode (1 week in production)

- [ ] Add an env var `RECOMMENDER_ENGINE_VERSION = "v3" | "v4" | "shadow"`.
- [ ] In `shadow` mode: run both v3 and v4, return v3 to the client, log v4's top-3 ids + summary to Supabase `recommender_shadow_logs` table.
- [ ] Create table `recommender_shadow_logs`:
  ```sql
  create table recommender_shadow_logs (
    id           uuid primary key default gen_random_uuid(),
    created_at   timestamptz default now(),
    user_id      uuid not null,
    request_body jsonb not null,
    v3_summary   jsonb not null,
    v4_summary   jsonb not null,
    v3_lure_ids  text[] not null,
    v4_lure_ids  text[] not null,
    v3_fly_ids   text[] not null,
    v4_fly_ids   text[] not null
  );
  ```
- [ ] Deploy `shadow` mode to production.
- [ ] Author `scripts/shadow-mode-diff.ts`:
  - Reads last 7 days of shadow logs.
  - For each unique (species, region, month, water_type, clarity, posture-bucket):
    - Reports % top-3 overlap between v3 and v4 (by id and by family_group).
    - Reports surface-pick rate delta.
    - Reports column-distribution delta.
  - Output Markdown report.
- [ ] Review report with product owner. Flag and investigate any rows where v4 produces obviously wrong top-3.

### Phase 7 — Cutover (0.5 day)

- [ ] Flip `RECOMMENDER_ENGINE_VERSION` to `"v4"` in production.
- [ ] Monitor error rate for 24 hours.
- [ ] If any issue: flip back to `"v3"` immediately (keeps v3 path live until Phase 8).

### Phase 8 — Cleanup + clean-house verification (2-3 days)

Only after 7 days of clean v4 production traffic. This phase is NOT complete until `scripts/clean-house-audit-v4.ts` exits 0.

**Code deletion:**
- [ ] Delete `RECOMMENDER_ENGINE_VERSION` logic (engine is always v4).
- [ ] Delete all v3 files per §18.1 and §18.2.
- [ ] Delete stale docs per §18.3.
- [ ] Delete `recommender_shadow_logs` table and the shadow-mode code.

**Rename to canonical names:**
- [ ] Rename `v4/` directory back to `engine/` — v4 is now "the engine". Update all imports.
- [ ] Remove the `V4` suffix from type names in `contracts.ts` → they become the definitive types (`RankedRecommendation`, `RecommenderResponse`, `RecommenderSummary`, `ArchetypeProfile`, `SeasonalRow`, `DailyPayload`, `ResolvedTactics`).
- [ ] Remove the `V4` suffix from constants (`TACTICAL_COLUMNS_V4` → `TACTICAL_COLUMNS`, etc.).
- [ ] Remove the `V4` suffix from function names (`runRecommenderV4` → `runRecommender`, etc.).
- [ ] Update `package.json` script names: `gen:seasonal-rows-v4` → `gen:seasonal-rows`, `check:seasonal-matrix` stays.
- [ ] Update test file names to drop `V4` suffix.

**Clean-house audit (mandatory):**
- [ ] Run `deno run -A scripts/clean-house-audit-v4.ts`. Must exit 0.
- [ ] Run every grep command in §18.7.2. Each must return 0 matches.
- [ ] Run every file-existence test in §18.7.1. Each must pass (file does not exist).
- [ ] Verify `tsc --noEmit` produces zero errors across the repo.
- [ ] Verify all tests pass (unit + integration + coverage).

**Documentation:**
- [ ] Write `docs/recommender-maintainer-guide.md` — condensed from this doc, ~30% of the length, with the permanent invariants and gotchas.
- [ ] Update `README.md` recommender section to reference v4 architecture.
- [ ] Update `AGENTS.md` if it mentions v3 terminology.
- [ ] Audit `.cursor/rules/*.mdc` for v3 references and purge.

### Phase 9 — Post-implementation audit (1 day)

After Phase 8 passes, run the **deep audit** in Appendix E. This is a human-driven, end-to-end review that validates the entire v4 implementation against the spec.

- [ ] Invariant P1-P27 verification (Appendix E.1)
- [ ] Validator G1-G9 activation check (Appendix E.2)
- [ ] Engine behavior spot-check on 20 random requests across species/region/month (Appendix E.3)
- [ ] Frontend render verification (Appendix E.4)
- [ ] Per-region × 12-month eligibility audit sign-off (Appendix E.4.5)
- [ ] Clean-house complete verification (Appendix E.5)
- [ ] Production health metrics review (Appendix E.6)
- [ ] Final sign-off (Appendix E.7)

### Estimated total: 4-6 weeks end-to-end including shadow-mode observation window and the authoring long-pole.

---

## 20. Test strategy

### 20.1 Unit tests (run in every CI build)

- **`postureResolution.test.ts`**
  - `score === 70` → aggressive
  - `score === 69` → neutral
  - `score === 35` → suppressed
  - `score === 36` → neutral
  - `score === 100` → aggressive
  - `score === 10` → suppressed
- **`distributionResolution.test.ts`** — exhaustive matrix of posture × baseline position:
  - Baseline at top of range, aggressive → clamp fallback to [anchor, anchor, anchor-1]
  - Baseline at bottom of range, suppressed → clamp fallback
  - Single-value range → all-same distribution
  - Validates against Example A, B, C, D from §14.
- **`surfaceGate.test.ts`**:
  - `surface_seasonally_possible=false` → no surface regardless of wind/posture
  - `wind_mph=19` with surface seasonally possible and aggressive → no surface
  - `posture=suppressed` with all other conditions favorable → no surface
  - Only when all three gates pass → surface in today_columns
- **`clarityGate.test.ts`**:
  - Archetype with `clarity_strengths=["clear"]` excluded when `water_clarity="dirty"`
  - Archetype with all three clarities included in all cases
- **`forageGate.test.ts`**:
  - Headline-pool filters on `primary_forage ∪ secondary_forage`
  - Archetype with `forage_tags=["baitfish"]` passes when row's `primary_forage="baitfish"`
  - Fallback chain: forage empty → forage dropped, primary_ids kept
  - Fallback chain: also empty → primary_ids dropped, full pool used
- **`poolConstruction.test.ts`**:
  - Excludes archetypes with wrong `water_type`
  - Excludes archetypes with wrong `species_allowed`
  - Includes archetypes with secondary_pace matching today's paces
- **`pickTop3.test.ts`**:
  - Exact-match happy path
  - Pace relaxation step fires
  - Column adjacent relaxation step fires
  - Family-group redundancy enforced
  - Family-redundancy relaxation fires (records diagnostic)
  - Throws on catastrophically empty pool
- **`surfaceCap.test.ts`**:
  - 1 surface pick passes through unchanged
  - 2 surface picks → second flipped to upper
  - 3 surface picks (impossible with correct distributions but tested for safety) → two flipped
- **`copyLayer.test.ts`**:
  - Each template variant produces the expected phrasing for each (posture, role, forage_match) combo
  - `how_to_fish` variant selection matches clarity bucket
- **`seasonalRowLookup.test.ts`**:
  - State-scoped row wins over regional row
  - Region fallback when (state, region) row missing
  - Throws on unsupported species/context

### 20.2 Integration tests

- **~~`runRecommenderV4.integration.test.ts`~~ (removed)** — end-to-end v4 engine examples were high-churn; use `distributionResolution.test.ts` (§14 column/pace math), `pickTop3*.test.ts`, and **`rebuildSurfaceContract.test.ts`** for the live rebuild path.

### 20.3 Snapshot tests

- `snapshots/` directory with JSON snapshots of canonical `(species, region, month, water_type, clarity, score, wind)` scenarios.
- Snapshot comparison is exact on: id list per gear mode, summary fields.
- Copy strings are NOT snapshotted (tested separately to allow phrasing iteration without breaking snapshots).

### 20.4 Coverage tests — the 9-payload matrix

`coverage.test.ts` is the most important test in v4. It runs `runRecommenderV4` for every (species, region, month, water_type) combination that exists in the seasonal matrix, and for each combination runs NINE synthetic daily payloads:

| # | posture | score | wind_mph | water_clarity |
|---|---|---|---|---|
| 1 | aggressive | 85 | 5 | clear |
| 2 | aggressive | 85 | 5 | stained |
| 3 | aggressive | 85 | 5 | dirty |
| 4 | neutral | 50 | 5 | clear |
| 5 | neutral | 50 | 5 | stained |
| 6 | neutral | 50 | 5 | dirty |
| 7 | suppressed | 25 | 10 | clear |
| 8 | suppressed | 25 | 10 | stained |
| 9 | suppressed | 25 | 10 | dirty |

Assertions per cell:
- Zero engine errors.
- Both lure and fly top-3 arrays have length 3.
- No more than 1 surface pick in either top-3 array.
- `family_group` uniqueness within each top-3.
- Every pick's `column` is in `row.column_range` OR in the relaxed set per §12.3.
- Deterministic under fixed seed.

Reports per (species, region, month, water_type, posture, clarity) cell:
- Whether `pool_undersized` fired.
- Whether any `*_relaxed` diagnostic fired.
- Whether `surface_cap_fired` (should never).

**Pass criteria (global, aggregated across the whole matrix):**
- 100% of cells produce valid output.
- `pool_undersized` ≤ 5% of cells.
- `family_redundancy_relaxed` ≤ 2% of cells.
- `surface_cap_fired` = 0.
- `headline_fallback = both_relaxed` ≤ 1% (this is the worst headline fallback).

**Pass criteria (per-(species, region, water_type) triple):**

Aggregate global rates hide chronically-bad single regions. The coverage test MUST also emit a per-triple report and assert:

- For every (species, region, water_type) triple: `pool_undersized` rate ≤ 20% (4x the global cap — a region can be thinner than average but must not be dominated by thin cells).
- For every triple: `pace_relaxed` + `column_relaxed` combined rate ≤ 25% (a region must not chronically relax).
- For every triple: `headline_fallback != "none"` rate ≤ 15%.
- For every triple: the unique archetype-id set appearing in any top-3 slot across the 12-month × 3-posture × 3-clarity simulation is at least 6 for non-trout triples, 4 for trout triples. (Flat output across a whole region is a red flag.)

The per-triple report is written to `TightLinesAI/docs/authoring/coverage-per-region.md` on every coverage test run. CI fails if any triple violates the per-triple cap, with the report path printed so the author knows exactly which cells to investigate.

**Why per-triple caps exist:** global averages can make a chronically broken region invisible. If "Colorado Front Range trout river" chronically relaxes pace on 40% of cells but the global rate is 3% (because bass regions are healthy), the user experience in Colorado is terrible even though CI is green. Per-triple caps force the author to fix that region OR accept documented relaxation in row `notes`.

Any violation — global OR per-triple — fails CI.

### 20.5 Property tests (optional)

- For random inputs within the allowed space: output always has 3 picks, always passes P4 (surface cap), always has distinct family_groups (post-relaxation), deterministic under identical inputs.

### 20.6 Targeted behavioral tests (new for v4)

- **`oneOnOneSpread.test.ts`** — exhaustive matrix of neutral 1+1+1 vs 2+1 fallback. Every case from §6.2 decision tree must produce the expected 3-tuple.
- **`surfaceCapFlipTarget.test.ts`** — force a 2-surface top-3 (by feeding the cap bad input) and verify the flipped slot lands in `column_distribution[0]`, never "upper" unconditionally.
- **`forageFallbackCopy.test.ts`** — trigger `headline_fallback = "forage_relaxed"` and assert the emitted copy uses the `HEADLINE_NO_FORAGE_MATCH` template (no claim of forage alignment).
- **`windMissingDefault.test.ts`** — omit `wind_speed_mph` from env_data; verify `today_columns` does NOT include surface (wind defaults to 99).
- **`anonSeedFallback.test.ts`** — call `runRecommenderV4` with `user_id = ""` and `user_id = null`; verify both return deterministic output matching the `"anon"` seed key.
- **`surfaceFlySpeciesGate.test.ts`** — request pike fly recommendations when `mouse_fly` would otherwise match; verify `mouse_fly` is never in the pool (species_allowed gate). Same for trout requests not getting `frog_fly` or `popper_fly`.
- **`pikeCatalogCoverage.test.ts`** — for every (pike, region, month) combination, verify pike-specific archetypes (the 3 new ones + the 2 existing) are reachable. Catches authoring regressions where pike falls back entirely to bass archetypes.
- **`troutForagePolicy.test.ts`** — author a test CSV with `primary_forage = "insect_misc"` for a trout row; verify generator fails with DATA_QUALITY_ERROR pointing to G6.
- **`diagnostics.test.ts`** — call the engine with a collector-diag function; force each diagnostic event type; verify structured emission.
- **`runtimePoolConsistency.test.ts`** — call `build_eligible_pool` on the SAME (row, daily conditions) twice; verify result equality. Catches accidental nondeterminism in the catalog iteration order (Object.values order should be stable — this test proves it).
- **`excludedIdsRespected.test.ts`** — author a row with a specific id in `excluded_lure_ids`; verify the archetype never appears in any top-3 output for that row, even if it would otherwise pass all filters.
- **`primaryIdsDontLeakToPool.test.ts`** — author a row whose `primary_lure_ids` contains an archetype with `water_types_allowed = ["L"]` authored into a "freshwater_river" row; verify G1 flags this row (primary must respect water_types_allowed).
- **`perRegionTwelveMonthArc.test.ts`** — for each (species, region, water_type), run the engine across months 1-12 × 3 postures × 3 clarities and assert: (a) no month/posture/clarity produces an empty pool, (b) across the 12-month arc for a given (posture, clarity), the SET of unique archetypes that appear in any top-3 slot is at least 4 — this catches rows that were mass-copied without adjustment because a truly flat arc is biologically implausible (fish behavior changes across the year in any real region).

### 20.7 Shadow-mode diffs (not CI tests; §21 tooling)

---

## 21. Rollout plan

Summarized from §19 Phases 6-8:

1. **Shadow mode** runs v3 to users and v4 silently, logs both.
2. **Diff report** generated after 7 days of data across all (species, region, month) slices.
3. Product owner reviews diffs and approves cutover.
4. **Cutover** flips the engine to v4 in one env-var change.
5. **Kill switch:** reverting the env var restores v3 instantly (v3 code is still present for a week after cutover).
6. **Cleanup** deletes v3 code one week after clean v4 operation.

**Success metrics during shadow mode:**

- ≥ 95% of requests produce 3 top-3 picks with no engine errors.
- ≤ 5% of requests enter family-redundancy relaxation.
- 0% of requests produce 2+ surface picks.
- ≥ 70% of v4 headline picks are the same family_group as the top v3 pick (as a sanity check, not a strict match — v4 is expected to diverge from v3 but not catastrophically).
- Spot audit of 50 random (species, region, month) rows by a fishing-literate reviewer — at least 90% "feels right" verdict.

---

## 22. Appendix A — Full archetype authoring table

This table is the AUTHORING source of truth for `v4/candidates/lures.ts` and `v4/candidates/flies.ts`. Implementer copies these values into the catalog. Validators G2, G7 will catch any authoring mistake.

**Species key:** `LMB` = largemouth_bass, `SMB` = smallmouth_bass, `PIKE` = northern_pike, `TRT` = trout.
**Water key:** `L` = freshwater_lake_pond, `R` = freshwater_river.

### 22.1 Lure archetypes (36 total — 33 existing + 3 new pike-specific)

| id | family_group | column | primary_pace | secondary_pace | forage_tags | clarity_strengths | species_allowed | water_types_allowed |
|---|---|---|---|---|---|---|---|---|
| `weightless_stick_worm` | `soft_plastic_worm` | `upper` | `medium` | `slow` | `leech_worm` | `clear, stained, dirty` | LMB, SMB | L, R |
| `carolina_rigged_stick_worm` | `soft_plastic_worm` | `bottom` | `slow` | — | `leech_worm, baitfish` | `clear, stained` | LMB, SMB | L, R |
| `shaky_head_worm` | `soft_plastic_worm` | `bottom` | `slow` | — | `leech_worm` | `clear, stained, dirty` | LMB, SMB | L, R |
| `drop_shot_worm` | `soft_plastic_worm` | `mid` | `slow` | — | `leech_worm` | `clear, stained` | LMB, SMB | L, R |
| `drop_shot_minnow` | `soft_plastic_minnow` | `mid` | `slow` | — | `baitfish` | `clear, stained` | LMB, SMB | L, R |
| `ned_rig` | `finesse_plastic` | `bottom` | `slow` | — | `leech_worm, crawfish` | `clear, stained` | LMB, SMB | L, R |
| `tube_jig` | `finesse_plastic` | `bottom` | `slow` | `medium` | `crawfish, baitfish` | `clear, stained` | LMB, SMB | L, R |
| `texas_rigged_soft_plastic_craw` | `soft_plastic_craw` | `bottom` | `slow` | — | `crawfish` | `clear, stained, dirty` | LMB, SMB | L, R |
| `football_jig` | `skirted_jig_bottom` | `bottom` | `slow` | `medium` | `crawfish` | `clear, stained, dirty` | LMB, SMB | L, R |
| `compact_flipping_jig` | `skirted_jig_bottom` | `bottom` | `slow` | — | `crawfish, bluegill_perch` | `stained, dirty` | LMB, SMB | L, R |
| `finesse_jig` | `skirted_jig_bottom` | `bottom` | `slow` | — | `crawfish, leech_worm` | `clear, stained` | LMB, SMB | L, R |
| `swim_jig` | `skirted_jig_swimming` | `mid` | `medium` | `fast` | `bluegill_perch, baitfish` | `stained, dirty` | LMB, SMB | L, R |
| `hair_jig` | `hair_jig` | `bottom` | `slow` | `medium` | `baitfish, leech_worm` | `clear, stained` | LMB, SMB, TRT | R |
| `inline_spinner` | `spinner` | `mid` | `medium` | `fast` | `baitfish` | `clear, stained` | LMB, SMB, TRT | L, R |
| `spinnerbait` | `safety_pin_spinner` | `mid` | `medium` | `slow` | `baitfish, bluegill_perch` | `stained, dirty` | LMB, SMB | L, R |
| `bladed_jig` | `bladed_jig` | `mid` | `medium` | `fast` | `baitfish, crawfish` | `stained, dirty` | LMB, SMB | L, R |
| `paddle_tail_swimbait` | `swimbait` | `mid` | `medium` | `fast` | `baitfish, bluegill_perch` | `clear, stained, dirty` | LMB, SMB | L, R |
| `soft_jerkbait` | `jerkbait_soft` | `upper` | `medium` | `slow` | `baitfish` | `clear, stained` | LMB, SMB | L, R |
| `suspending_jerkbait` | `jerkbait` | `mid` | `medium` | — | `baitfish` | `clear, stained` | LMB, SMB, TRT | L, R |
| `squarebill_crankbait` | `crankbait_shallow` | `upper` | `medium` | `fast` | `baitfish, bluegill_perch` | `stained, dirty` | LMB, SMB | L, R |
| `flat_sided_crankbait` | `crankbait_shallow` | `upper` | `medium` | — | `baitfish` | `clear, stained` | LMB, SMB | L, R |
| `medium_diving_crankbait` | `crankbait_medium` | `mid` | `medium` | — | `baitfish, crawfish` | `clear, stained, dirty` | LMB, SMB | L, R |
| `deep_diving_crankbait` | `crankbait_deep` | `bottom` | `medium` | — | `baitfish, crawfish` | `clear, stained, dirty` | LMB, SMB | L |
| `lipless_crankbait` | `crankbait_lipless` | `mid` | `medium` | `fast` | `baitfish, crawfish` | `stained, dirty` | LMB, SMB | L, R |
| `blade_bait` | `blade_bait` | `bottom` | `slow` | `medium` | `baitfish` | `clear, stained, dirty` | LMB, SMB, PIKE | L, R |
| `casting_spoon` | `spoon` | `mid` | `medium` | — | `baitfish` | `clear, stained` | LMB, SMB, PIKE, TRT | L, R |
| `walking_topwater` | `surface_walking` | `surface` | `medium` | — | `surface_prey, baitfish` | `clear, stained` | LMB, SMB | L, R |
| `popping_topwater` | `surface_popper` | `surface` | `medium` | `slow` | `surface_prey` | `clear, stained` | LMB, SMB | L, R |
| `buzzbait` | `surface_buzz` | `surface` | `fast` | `medium` | `surface_prey, baitfish` | `stained, dirty` | LMB, SMB | L, R |
| `prop_bait` | `surface_prop` | `surface` | `medium` | — | `surface_prey` | `clear, stained` | LMB, SMB | L, R |
| `hollow_body_frog` | `surface_frog` | `surface` | `slow` | `medium` | `surface_prey` | `stained, dirty` | LMB, PIKE | L |
| `large_profile_pike_swimbait` | `pike_swimbait` | `mid` | `medium` | `slow` | `baitfish, bluegill_perch` | `clear, stained, dirty` | PIKE | L, R |
| `pike_jerkbait` | `pike_jerkbait` | `mid` | `medium` | `fast` | `baitfish` | `clear, stained` | PIKE | L, R |
| **`large_bucktail_spinner`** (NEW) | `large_spinner` | `mid` | `medium` | `fast` | `baitfish, bluegill_perch` | `clear, stained` | PIKE, LMB | L, R |
| **`large_pike_topwater`** (NEW) | `large_pike_surface` | `surface` | `medium` | `slow` | `surface_prey, baitfish` | `clear, stained` | PIKE, LMB | L |
| **`pike_jig_and_plastic`** (NEW) | `pike_jig` | `bottom` | `slow` | `medium` | `baitfish, bluegill_perch` | `stained, dirty` | PIKE, LMB | L |

**Pike additions rationale (user decision Q3=A, no wire):**
- `large_bucktail_spinner` — pike-size inline spinner (#5-#7 bucktail). Distinct family_group from `inline_spinner` (trout-size). Crucially: species_allowed excludes SMB (too big for smallmouth) and TRT (pike-size bucktails are not a trout presentation).
- `large_pike_topwater` — large walking/popping pike surface bait (e.g. scaled-up Whopper Plopper, large prop baits). Separate family_group so it doesn't collide with `walking_topwater`/`popping_topwater` in a mixed top-3.
- `pike_jig_and_plastic` — large soft plastic on heavy jig head for deep pike in stained/dirty water. Species_allowed includes LMB because big-fish LMB tactics overlap.

NO wire-trace archetype is authored. The catalog does not encode terminal tackle choices.

### 22.2 Fly archetypes (21 total — 18 streamers + 3 topwater surface flies)

**Streamers (18):**

| id | family_group | column | primary_pace | secondary_pace | forage_tags | clarity_strengths | species_allowed | water_types_allowed |
|---|---|---|---|---|---|---|---|---|
| `clouser_minnow` | `streamer_weighted` | `mid` | `medium` | `fast` | `baitfish` | `clear, stained` | SMB, LMB, PIKE, TRT | L, R |
| `deceiver` | `streamer_baitfish` | `mid` | `medium` | — | `baitfish` | `clear, stained, dirty` | SMB, LMB, PIKE | L, R |
| `bucktail_baitfish_streamer` | `streamer_baitfish` | `mid` | `medium` | `slow` | `baitfish` | `clear, stained` | SMB, LMB, PIKE, TRT | R |
| `slim_minnow_streamer` | `streamer_sparse` | `upper` | `medium` | — | `baitfish` | `clear` | SMB, TRT | R |
| `articulated_baitfish_streamer` | `streamer_articulated` | `mid` | `medium` | `slow` | `baitfish` | `stained, dirty` | SMB, LMB, PIKE, TRT | L, R |
| `articulated_dungeon_streamer` | `streamer_articulated` | `mid` | `slow` | `medium` | `baitfish, bluegill_perch` | `stained, dirty` | LMB, PIKE, TRT | L, R |
| `game_changer` | `streamer_segmented` | `mid` | `medium` | — | `baitfish` | `clear, stained, dirty` | SMB, LMB, PIKE, TRT | L, R |
| `woolly_bugger` | `leech_family` | `mid` | `slow` | `medium` | `leech_worm` | `clear, stained, dirty` | SMB, LMB, TRT | L, R |
| `rabbit_strip_leech` | `leech_family` | `bottom` | `slow` | — | `leech_worm` | `stained, dirty` | SMB, LMB, PIKE, TRT | L, R |
| `balanced_leech` | `leech_family` | `bottom` | `slow` | — | `leech_worm` | `clear, stained` | TRT | L |
| `zonker_streamer` | `streamer_baitfish` | `mid` | `medium` | `slow` | `baitfish` | `clear, stained` | SMB, LMB, TRT | L, R |
| `sculpin_streamer` | `sculpin_family` | `bottom` | `slow` | — | `baitfish, crawfish` | `clear, stained, dirty` | SMB, LMB, PIKE, TRT | R |
| `sculpzilla` | `sculpin_family` | `bottom` | `slow` | `medium` | `baitfish, crawfish` | `stained, dirty` | SMB, LMB, PIKE, TRT | R |
| `muddler_sculpin` | `sculpin_family` | `bottom` | `slow` | — | `baitfish, crawfish` | `clear, stained` | SMB, TRT | R |
| `crawfish_streamer` | `crawfish_fly` | `bottom` | `slow` | — | `crawfish` | `clear, stained, dirty` | SMB, LMB, TRT | R |
| `conehead_streamer` | `streamer_weighted` | `mid` | `medium` | — | `baitfish` | `clear, stained` | SMB, LMB, TRT | R |
| `pike_bunny_streamer` | `streamer_pike_large` | `mid` | `slow` | `medium` | `baitfish, bluegill_perch` | `stained, dirty` | PIKE | L, R |
| `large_articulated_pike_streamer` | `streamer_pike_large` | `mid` | `slow` | `medium` | `baitfish` | `stained, dirty` | PIKE | L, R |

**NOTE on `balanced_leech`:** Authoring uses `clear, stained` and `TRT/L` only because the "balanced" leech is a stillwater trout-specific presentation (hangs horizontal under an indicator). Bass/pike anglers do not use this fly meaningfully.

**Surface flies (3) — species-restricted per P23/G7:**

| id | family_group | column | primary_pace | secondary_pace | forage_tags | clarity_strengths | species_allowed | water_types_allowed |
|---|---|---|---|---|---|---|---|---|
| `popper_fly` | `fly_popper` | `surface` | `medium` | `slow` | `surface_prey, bluegill_perch` | `clear, stained` | LMB, SMB | L, R |
| `frog_fly` | `fly_frog` | `surface` | `slow` | `medium` | `surface_prey` | `stained, dirty` | LMB, PIKE | L |
| `mouse_fly` | `fly_mouse` | `surface` | `slow` | `medium` | `surface_prey` | `clear, stained` | TRT | R |

**Surface fly rationale (user decisions Q1=NO, Q4: normal topwater only):**
- `popper_fly` — classic bass/smallmouth popper. Bluegill-color poppers crush bedding bass. Species gate EXCLUDES pike (pike topwater uses `frog_fly` or lure-side `large_pike_topwater`) and EXCLUDES trout (trout do not eat bluegill poppers; trout surface pattern is the mouse at night).
- `frog_fly` — large foam/deer-hair frog. Bass and pike in pad/weed cover. EXCLUDES trout per user's explicit note ("Maybe frog should not be applied to trout"). EXCLUDES smallmouth because smallmouth in rivers don't typically hit frogs.
- `mouse_fly` — trout-only, per user's explicit note ("trout specific like mice"). Fished slow on big trout water at night/dusk. EXCLUDES bass and pike despite the biological possibility, per user product intent.

**Explicitly REJECTED fly categories (NOT in v4 catalog):**
- Nymphs (pheasant_tail, hares_ear, stonefly, czech, egg) — NO
- Dry flies (adams, elk_hair_caddis, stimulator, hopper, parachute_mayfly) — NO
- Wet flies — NO
- Scud/sowbug patterns — NO

The v4 fly catalog is **21 flies total**: 18 streamers + 3 topwater. This is the closed set. The factory rejects any fly archetype not in this set.

### 22.3 Primary-id guidance per species (for seasonal authors)

When authoring `primary_lure_ids` and `primary_fly_ids` per seasonal row, prefer species-appropriate archetypes first:

**Largemouth bass primaries** (typical): `weightless_stick_worm`, `texas_rigged_soft_plastic_craw`, `paddle_tail_swimbait`, `swim_jig`, `bladed_jig`, `spinnerbait`, `squarebill_crankbait`, `lipless_crankbait`, `walking_topwater`, `hollow_body_frog`, `popping_topwater`, `popper_fly`, `frog_fly` (surface-possible months).

**Smallmouth bass primaries** (typical): `ned_rig`, `tube_jig`, `drop_shot_worm`, `hair_jig`, `finesse_jig`, `inline_spinner`, `suspending_jerkbait`, `flat_sided_crankbait`, `soft_jerkbait`, `clouser_minnow`, `sculpin_streamer`, `crawfish_streamer`, `popper_fly`.

**Northern pike primaries** (typical): `large_profile_pike_swimbait`, `pike_jerkbait`, `large_bucktail_spinner`, `large_pike_topwater`, `pike_jig_and_plastic`, `pike_bunny_streamer`, `large_articulated_pike_streamer`, `frog_fly` (warm months).

**Trout primaries** (typical, river only): `suspending_jerkbait` (big trout streamer tactic), `inline_spinner`, `hair_jig`, `clouser_minnow`, `woolly_bugger`, `sculpin_streamer`, `muddler_sculpin`, `bucktail_baitfish_streamer`, `zonker_streamer`, `conehead_streamer`, `crawfish_streamer`, `mouse_fly` (surface-possible warm months, night fishing).

These are suggestions — author judgment per row overrides. Validator G8 checks that the author's chosen primary_ids actually cover the posture-slot targets.

### 22.4 Catalog totals

- **Lures:** 36 archetypes (33 existing + 3 pike additions)
- **Flies:** 21 archetypes (18 streamers + 3 topwater surface flies)
- **Total:** 57 archetypes

`LURE_ARCHETYPE_IDS_V4` must equal the exact set of 36 ids in §22.1.
`FLY_ARCHETYPE_IDS_V4` must equal the exact set of 21 ids in §22.2.

Factory validators (G2, G7) enforce that no additional archetypes are present and no listed archetype is missing.

---

## 23. Appendix B — Climate zone grouping

For seasonal-matrix authoring, the 18 supported regions cluster into 6 climate zones. Start-of-authoring defaults propagate within a zone; per-region overrides are explicit.

| Zone | Regions | Summer baseline (column, pace) | Mid-winter baseline |
|---|---|---|---|
| **Northern Cold** | WC_MI, NC_MI, NE_MI, WC_WI, NE_WI, NC_MN, NE_MN | `(upper, fast)` lake; `(mid, medium)` river | `(bottom, slow)` lake-ice; `(bottom, slow)` river |
| **Mid-Atlantic/Appalachian** | PA_EAST, VA, WV | `(mid, medium)` both | `(bottom, slow)` both |
| **Southeast Atlantic** | NC_MID, SC_CENTRAL, GA_NORTH | `(upper, fast)` lake; `(mid, medium)` river | `(mid, slow)` lake; `(bottom, slow)` river |
| **Gulf Coastal Plains** | FL_CENTRAL, FL_NORTH, AL_CENTRAL | `(upper, fast)` lake; `(upper, medium)` river | `(mid, medium)` lake; `(mid, slow)` river |
| **Midwest Mixed** | MO_CENTRAL, TN_CENTRAL, KY_CENTRAL | `(upper, fast)` lake; `(mid, medium)` river | `(bottom, slow)` both |
| **Western Highland** | CO_FRONT_RANGE, MT_WEST | `(mid, medium)` both (tailwater rivers dominate) | `(bottom, slow)` both |

These region keys are illustrative — the authoring step must confirm exact region_keys against `howFishingEngine/contracts/region.ts`. If zone assignments are not obvious, the implementer should ask the product owner before authoring.

---

## 24. Appendix C — Frontend impact

### 24.1 Breaking changes consumed by frontend

1. **`RankedRecommendation.primary_column` → `RankedRecommendation.column`.** One rename across all consumers.
2. **`RankedRecommendation.presence` is removed.** Any UI that renders a "bold" / "subtle" / "moderate" chip must be deleted. Color chip (from `color_style`) covers visibility communication.
3. **`RecommenderSessionSummary` loses** `allowed_presence`, `preferred_presence`, `secondary_presence`, `preferred_column`, `secondary_column`, `preferred_pace`, `secondary_pace`, `surface_window`, `opportunity_mix`. Any UI chip or row showing these is removed.
4. **`RecommenderSessionSummary` gains** `today_column_distribution` (3 values) and `today_pace_distribution` (3 values). A new "today's tactical read" component can render them explicitly, e.g. `"Upper column, fast retrieve — with a surface backup look"`.
5. **`feature` constant** changes from `"recommender_v3"` to `"recommender_v4"`. Any cache key or analytics event must be updated.

### 24.2 Components to audit

Run this grep once v4 lands. It must return zero hits BEFORE Phase 8 is complete (all hits are either renamed to v4 equivalents or deleted):

```bash
rg --no-heading 'primary_column|\bpresence\b|opportunity_mix|surface_window|preferred_presence|preferred_column|secondary_presence|secondary_column|preferred_pace|secondary_pace\b|allowed_presence|recommender_v3' app/ components/ hooks/ lib/
```

There is NO "translation" layer. v4 fields are different and the frontend must consume them directly. Specifically:

- `primary_column` → `column`
- `presence` → delete the render; color_style chip conveys visibility
- `opportunity_mix` → delete; not replaced (the 1+1+1 spread is visible via `today_column_distribution`)
- `surface_window` → delete; `today_column_distribution` includes surface if open
- `preferred_column`/`preferred_pace`/`secondary_*` → delete; replaced by `today_column_distribution` and `today_pace_distribution` arrays

Post-Phase-8, after the `V4` type suffix is stripped, interfaces look like:

```ts
interface RankedRecommendation {
  id: string;
  display_name: string;
  column: "bottom" | "mid" | "upper" | "surface";
  pace: "slow" | "medium" | "fast";
  forage_tags: readonly ForageTag[];
  clarity_strengths: readonly ClarityLevel[];
  color_style: ColorStyle;
  why_chosen: string;
  how_to_fish: string;
  family_group: string;
}
interface RecommenderSummary {
  posture: "aggressive" | "neutral" | "suppressed";
  today_column_distribution: readonly [TacticalColumn, TacticalColumn, TacticalColumn];
  today_pace_distribution:   readonly [TacticalPace,   TacticalPace,   TacticalPace];
  hows_fishing_score: number;
  water_clarity: WaterClarity;
  wind_mph: number;
}
```

Any UI code using `primary_column`, `presence`, `opportunity_mix`, or `surface_window` must be deleted or updated BEFORE Phase 8 passes.

### 24.3 Example "Today's tactical read" component

The new summary makes it easy to render a single sentence that didn't exist in v3:

```tsx
function TacticalRead({ summary }: { summary: RecommenderSummaryV4 }) {
  const dominantColumn = summary.today_column_distribution[0];
  const dominantPace   = summary.today_pace_distribution[0];
  const outwardColumn  = summary.today_column_distribution[2];
  const outwardPace    = summary.today_pace_distribution[2];

  return (
    <Text>
      Today's read is <B>{summary.posture}</B>. Lean on the {dominantColumn} {dominantPace} lane, with a {outwardColumn} {outwardPace} backup.
    </Text>
  );
}
```

---

## 25. Appendix D — Glossary

- **1+1+1 SPREAD shape.** Neutral-posture distribution `[baseline, above, below]` when the range has ≥3 values AND baseline has valid neighbors on both sides. Produces three distinct lanes in the top-3. See P21, §6.2.
- **2+1 COMMIT shape.** Distribution `[anchor, anchor, adjacent]` used by aggressive, suppressed, and neutral-fallback postures. Two picks in the anchor lane, one adjacent.
- **Anchor column / anchor pace.** The dominant column/pace in a 2+1 distribution: `column_distribution[0]`. In the neutral 1+1+1 case it refers to the baseline (which is also `distribution[0]`).
- **Archetype.** A canonical lure or fly profile (e.g. "football jig"). Each archetype has exactly one authored column, primary pace, optional secondary pace, forage tags, clarity strengths, species_allowed, and water_types_allowed.
- **Authored topwater flies.** The closed set `{popper_fly, frog_fly, mouse_fly}`. The ONLY fly archetypes with `column === "surface"` in v4. See P13, G7.
- **Baseline interior.** A baseline value has "interior" status when it has at least one neighbor above AND at least one neighbor below within today's range. Required for the 1+1+1 SPREAD shape to fire.
- **Clean-house audit.** The grep-based verifier in §18.7 that confirms no stale v3 references remain. Run by `scripts/clean-house-audit-v4.ts`. Exit 0 required before Phase 8 is complete.
- **Column baseline.** The center of the column range for a given (species, region, month, water_type). Resolved posture expands or shifts from here.
- **Column distribution.** The 3-element ordered list of columns assigned to the 3 top-3 slots today.
- **Column range.** The biologically-valid column set for a given seasonal row (e.g. `["bottom","mid","upper","surface"]` for summer bass lakes; `["bottom","mid"]` for cold winter lakes).
- **Coverage test.** §20.4. Runs the engine across all (species × region × month × water_type × posture × clarity) cells using a 9-payload matrix. Enforces relaxation-rate ceilings and invariants across the full scope.
- **Daily payload.** The v4 daily context: `{ posture, wind_mph, water_clarity, hows_fishing_score }`. Replaces v3's much larger daily payload.
- **Diagnostics.** Structured events emitted by the engine via `console.warn` (stable prefix `[recommender_v4_diag]`) and best-effort inserts to `recommender_diagnostics`. See §11.1, P25.
- **Eligible pool.** The subset of the FULL archetype catalog that passes all runtime gates for a specific request: species (archetype `species_allowed`), water_type (archetype `water_types_allowed`), today's columns, today's paces, today's clarity, the surface gate, and the row's `excluded_*_ids` opt-outs. Derived at runtime; never hand-authored per row. See §11.
- **Family group.** A tag used to prevent top-3 from returning two archetypes that are fishing-redundant (e.g. two different crankbaits). Unique-per-slot constraint.
- **Forage policy.** Per-species set of legal `primary_forage`/`secondary_forage` values. See G6. Trout rejects `insect_misc`; pike rejects `insect_misc` and `leech_worm`.
- **Headline pool.** Eligible pool ∩ `primary_*_ids` ∩ forage gate. Headline slot picks from here first, with a 3-step fallback chain (§11) if the pool is empty.
- **Headline fallback.** When the headline pool is empty, the engine relaxes (a) forage, (b) primary_ids, or (c) both — recording the fallback variant as a diagnostic. The copy layer uses `HEADLINE_NO_FORAGE_MATCH` when the forage gate was relaxed.
- **Pace baseline / pace range.** Same as column, but for retrieve pace.
- **Pace distribution.** The 3-element ordered list of paces assigned to the 3 top-3 slots today.
- **Posture.** `aggressive` / `neutral` / `suppressed`. Derived from the How's Fishing daily score. Single daily input to the v4 engine (besides wind and clarity).
- **Primary forage.** The authored dominant forage for a seasonal row. Headline slot must match this or `secondary_forage`. Alternates ignore forage.
- **Relaxation chain.** §12.3. Pace relax → column adjacent → adjacent + same pace → adjacent pace same column → drop family_group uniqueness. Each step records a diagnostic.
- **Seed.** `xfnv1a(user_id|date|species|region|month|water_type)`, or `xfnv1a("anon"|...)` when user_id is absent (P27). Used to make picks deterministic for a given user/day/scenario.
- **Slot roles.** `headline` (slot 0), `secondary` (slot 1), `outward` (slot 2). See P22 for ordering semantics.
- **Species_allowed.** Per-archetype list of species that may use this archetype. Enforced at pool construction and by G7 for surface flies.
- **Surface cap.** Hard invariant P4: no top-3 has more than 1 surface pick. Violation → flip the offending slot to `column_distribution[0]`.
- **Surface gate.** The three-way test for surface eligibility today: `surface_seasonally_possible AND wind_mph ≤ 18 AND posture ≠ suppressed`.
- **Today's columns / paces.** The column_range and pace_range after surface filtering (`today_columns`, `today_paces`).
- **Water_types_allowed.** Per-archetype list of water types (freshwater_lake_pond, freshwater_river). Enforced at pool construction.

---

## 26. Appendix E — Post-implementation deep-audit checklist (Phase 9)

This checklist runs AFTER Phase 8 cleanup is complete. Every box must be checked before declaring v4 "done." The implementing agent executes this checklist end-to-end and reports results to the product owner.

The checklist is organized into six audit sections: **Invariants, Validators, Engine Behavior, Frontend, Clean-house, Production Health.** A final sign-off section aggregates the result.

### E.1 Invariant verification (P1-P27)

For each invariant, run the listed verification method. Mark PASS or FAIL. Any FAIL blocks sign-off.

| # | Invariant | Verification method |
|---|---|---|
| P1 | Top-3 has exactly 3 distinct archetypes per gear mode | Integration test + coverage test |
| P2 | Determinism per seed | `anonSeedFallback.test.ts`; rebuild determinism via `rebuildSurfaceContract.test.ts` |
| P3 | No water-temperature code paths | `rg 'water_temp' supabase/functions/_shared/recommenderEngine/ supabase/functions/recommender/` → 0 |
| P4 | Surface cap ≤ 1 | `coverage.test.ts` asserts `surface_count ≤ 1` on every cell |
| P5 | `column_baseline ≠ surface` | Validator G1 enforced; grep `column_baseline.*surface` in CSVs → 0 |
| P6 | Pace distribution applied | Unit tests in `distributionResolution.test.ts` |
| P7 | Family group uniqueness within top-3 | Coverage test assertion |
| P8 | Clarity filter applied | `clarityGate.test.ts` |
| P9 | Forage gate on headline only | `forageGate.test.ts` + `forageFallbackCopy.test.ts` |
| P10 | Seasonal row driven by `(species, region, month, water_type)` + `state_code` fallback | `seasonalRowLookup.test.ts` |
| P11 | Color decision independent | `rg 'resolveColorDecision' supabase/functions/_shared/recommenderEngine/v4/engine/` confirms color is called separately, not inside picker |
| P12 | No re-roll API | grep endpoint list; `/api/recommender/reroll` must not exist |
| P13 | Fly surface only via popper/frog/mouse | G7 test + factory assertion |
| P14 | `column_baseline ≠ surface` (duplicate cross-check) | Same as P5 |
| P15 | Water temperature never consumed | Same as P3 |
| P16 | Clarity is the visibility filter | Archetype `clarity_strengths` used in filter; no `presence` field |
| P17 | Single posture input | Grep `hows_fishing_score` usages in v4 engine; only posture derivation should consume it |
| P18 | Min pool = 6 (trout: 4) | `POOL_MIN_SIZE` constant asserted; `pool_undersized` diagnostic fires below threshold in tests |
| P19 | Color decision unchanged | Snapshot test against v3 color output for identical inputs |
| P20 | v4 ships behind flag during shadow mode | Shadow-mode logs present pre-Phase-8; flag removed in Phase 8 |
| P21 | 1+1+1 neutral spread when interior | `oneOnOneSpread.test.ts` verifies |
| P22 | Ordering headline/secondary/outward | Integration test asserts slot role labels in output order |
| P23 | Surface fly species restrictions | `surfaceFlySpeciesGate.test.ts` |
| P24 | Missing wind → 99 | `windMissingDefault.test.ts` |
| P25 | Diagnostics to console.warn + table | `diagnostics.test.ts` with collector; live smoke test writes to `recommender_diagnostics` |
| P26 | Trout/lake-pond → 400 | Edge function integration test |
| P27 | Anonymous seed fallback | `anonSeedFallback.test.ts` |

### E.2 Validator activation (G1-G9)

For each validator, confirm the listed evidence. Mark PASS or FAIL.

| # | Validator | Evidence |
|---|---|---|
| G1 | Seasonal row validator | Exists in `scripts/generate-seasonal-rows-v4.ts`; runs during CSV→TS generation; fails on authored bad inputs (deliberate test) |
| G2 | Archetype validator | Factories `lure()` / `fly()` throw on invalid inputs; deliberate bad-input tests pass |
| G3 | Determinism | See P2 |
| G4 | Missing wind | See P24 |
| G5 | Missing state_code | `seasonalRowLookup.test.ts` covers fallback |
| G6 | Per-species forage policy | `troutForagePolicy.test.ts`; manual grep of pike rows for `insect_misc` → 0 |
| G7 | Surface fly species | See P23 |
| G8 | Primary-ids posture coverage | Generator emits DATA_QUALITY_WARN for thin rows; report reviewed |
| G9 | Cross-row neighbor consistency | Report generated; product owner has reviewed flagged transitions |

### E.3 Engine behavior spot-check

Run the engine with 20 real scenarios and manually verify outputs are credible. Record results in a spreadsheet with columns `(scenario_id, species, region, month, water_type, clarity, score, top_3_ids, credible_y_n, notes)`.

Recommended scenarios to spot-check:

1. LMB, Florida Central, April, Lake/Pond, clear, score=55 (neutral — should trigger 1+1+1 spread)
2. LMB, Michigan NC, July, Lake/Pond, stained, score=85 (aggressive summer peak)
3. LMB, Texas, January, Lake/Pond, dirty, score=22 (suppressed winter)
4. SMB, Tennessee, March, River, stained, score=76 (aggressive pre-spawn)
5. SMB, New York, October, River, clear, score=50 (neutral fall)
6. SMB, Wisconsin NE, December, Lake/Pond, dirty, score=18 (suppressed ice edge)
7. PIKE, Minnesota NE, June, Lake/Pond, stained, score=72 (aggressive early summer)
8. PIKE, Minnesota NC, August, Lake/Pond, clear, score=48 (neutral summer)
9. PIKE, Wisconsin NE, February, Lake/Pond, dirty, score=28 (suppressed deep winter)
10. TRT, Montana West, June, River, clear, score=78 (aggressive hatch)
11. TRT, Colorado Front Range, August, River, clear, score=45 (neutral summer low flow)
12. TRT, Pennsylvania East, November, River, stained, score=38 (borderline suppressed/neutral)
13. TRT, Virginia, July, River, stained, score=82 (aggressive + surface window for mouse)
14. LMB, Florida North, July, River, dirty, score=70 (wind 22 — surface closed by wind)
15. LMB, Alabama Central, May, Lake/Pond, clear, score=65 (bluegill spawn)
16. SMB, Kentucky Central, June, River, stained, score=92 (extreme aggressive)
17. PIKE, Michigan NE, November, Lake/Pond, stained, score=14 (extreme suppressed)
18. TRT, West Virginia, April, River, dirty, score=55 (neutral spring runoff)
19. LMB, Missouri Central, August, Lake/Pond, dirty, score=35 (suppressed summer cold front)
20. TRT, Montana West, January, River, clear, score=25 (suppressed winter — sparse pool, expect relaxation)

Pass criteria:
- ≥ 18/20 scenarios produce credible recommendations on first read by a fishing-literate reviewer.
- All "why chosen" copy reads correct (no mechanical or misleading phrasing).
- No scenario errors or throws.

Failures drive a follow-up authoring pass or engine tweak.

### E.4 Frontend render verification

Load the app on physical device. Run the 20 scenarios in E.3 via the actual UI. Verify:

- [ ] Top-3 cards render correctly with lure/fly name, column badge, pace chip.
- [ ] "Today's tactical read" component renders with `today_column_distribution` and `today_pace_distribution` values.
- [ ] Color chip renders (color decision unchanged from v3).
- [ ] `why_chosen` and `how_to_fish` text renders without orphan punctuation, double-space, or "${variable}" leakage.
- [ ] Toggle between lure and fly mode: both sides render three picks.
- [ ] Surface picks render a surface badge distinct from upper/mid/bottom.
- [ ] No UI chip rendering stale field (`presence`, `opportunity_mix`, `surface_window`, `primary_column`).
- [ ] Cache key reflects v4 feature constant — open the app twice with identical inputs, confirm cached response renders identically.
- [ ] Error case: trout + lake/pond combination returns a user-facing "Trout recommendations are river-only" message (P26 + client error rendering).

### E.4.5 Per-region × 12-month eligibility audit (sign-off required)

Because v4 derives the eligible pool at runtime from the catalog (§11), it's critical that the runtime-derived pool is credible across every month of every (species, region, water_type). This audit cannot be fully automated — a fishing-literate reviewer must read the output and sign off.

- [ ] `scripts/audit-eligibility-by-region-v4.ts` has been run for every (species, region, water_type) combination in the matrix.
- [ ] Markdown audit files exist under `TightLinesAI/docs/authoring/eligibility-audits/{species}-{region}-{water_type}.md`.
- [ ] For each file, the reviewer has stamped `Reviewed by: <name> on <date> — approved` at the top of the file.
- [ ] No unreviewed audit files block shipping.
- [ ] `perRegionTwelveMonthArc.test.ts` passes (automated floor on pool size and month-to-month arc variation).

Reviewer rubric per audit file:
- Each month × posture × clarity cell has a non-empty pool. If empty, this is a catalog gap — fix before shipping.
- The TOP 5 ids per cell look like the lures/flies a local expert would choose. Outliers (e.g., blade_bait as top pick in Florida July LMB) indicate either bad archetype attributes (fix the catalog) or bad row ranges (fix the CSV).
- The 12-month arc shows seasonal progression — early/late-season cold-water lures dominant in winter months, warm-water shapes dominant in summer. A flat arc across all 12 months is a red flag.
- Excluded ids, if any, are justified in the row's `notes` column.

Any failure here blocks sign-off (§E.7).

### E.5 Clean-house complete

This section is the enforcement gate. EVERY item must pass:

- [ ] `scripts/clean-house-audit-v4.ts` exits 0.
- [ ] All grep commands in §18.7.2 return 0 matches.
- [ ] All file-existence tests in §18.7.1 pass (files do not exist).
- [ ] `tsc --noEmit` in the repo root produces 0 errors.
- [ ] `deno check supabase/functions` produces 0 errors.
- [ ] All tests pass locally and in CI (unit + integration + coverage).
- [ ] `recommender/index.ts` edge function imports only from `v4/engine/` (or post-Phase-8 canonical path).
- [ ] Package scripts in `package.json` are named canonically (no `v4` suffix in any script).
- [ ] `supabase/functions/_shared/recommenderEngine/index.ts` re-exports only v4 (canonical) symbols.
- [ ] README recommender section updated.
- [ ] `AGENTS.md` updated.
- [ ] `.cursor/rules/*.mdc` audited; no v3 language remains.
- [ ] `docs/recommender-v4-simplified-design.md` retained (this file); `docs/recommender-v4-maintainer-guide.md` written.
- [ ] No snapshot files reference deleted archetype ids.

### E.6 Production health (7-day observation post-Phase-7 cutover)

Metrics pulled from `recommender_diagnostics` and production logs:

- [ ] Error rate (5xx from edge function) < 0.5% of requests.
- [ ] `pool_undersized` rate < 5% of requests across the matrix.
- [ ] `headline_fallback: "both_relaxed"` rate < 1%.
- [ ] `family_redundancy_relaxed` rate < 2%.
- [ ] `surface_cap_fired` count = 0 (if > 0, there is an authoring bug).
- [ ] `wind_missing` rate reasonable (reflects upstream wind-data availability, not an engine bug).
- [ ] p95 latency of `POST /functions/v1/recommender` < 1.5s.
- [ ] No spike in "why_chosen" strings containing literal `${` (template leak).
- [ ] User-observed error feedback (bug reports, app reviews) surfaces no "lure X shouldn't be for species Y" or "wrong water column" complaints related to v4 engine output.

### E.7 Sign-off

Product owner signs off on the following statement before v4 is declared "done":

> I have reviewed E.1 through E.6. All invariants pass. All validators are active. The engine behavior spot-check shows ≥90% credible outputs across 20 varied scenarios. The frontend renders v4 output correctly on device. No stale v3 code or metadata remains in the codebase. Production health metrics meet the bar. v4 is the canonical recommender engine.

Signed: ______________________
Date:   ______________________

Any red item above blocks sign-off. The implementing agent MUST NOT mark v4 complete until every box is checked and the product owner has signed.

---

## 27. Final note to the implementing agent

This plan is deliberately exhaustive. Every decision has been explicitly made. Every ambiguity has been closed. Every edge case has been named and handled.

**Your prime directives:**

1. **Do not improvise.** If you encounter a decision this document does not resolve, stop and ask the product owner. Do not guess.
2. **Do not skip the clean-house section (§18.7) or the post-implementation audit (§26).** These are not optional polish; they are the difference between "v4 shipped" and "v4 shipped cleanly."
3. **Do not dilute the catalog.** The 57 archetypes in Appendix A are the closed set. Do not add nymphs. Do not add dry flies. Do not add wire-leader-required pike archetypes. Do not remove surface flies beyond their species restrictions.
4. **Do not relax the validators.** Every validator in §15.1 is load-bearing. Failing a validator means the authored data is wrong; fix the data, not the validator.
5. **Do not skip the coverage test (§20.4).** The 9-payload matrix is the single best defense against authoring drift across 1,000+ rows.
6. **Do not declare v4 "done" until Appendix E (§26) is fully green.** That is the shipping gate.

If you finish all nine phases and every checklist item in Appendix E is signed off — congratulations, you've delivered a flagship recommender.

---

**End of plan.**

When the implementing agent has questions during any phase, the default is: do not improvise. Any ambiguity that is not resolved by this document should be raised as an explicit question to the product owner before code is written. The entire point of this document is that zero improvisation should be necessary.
