# Recommender V3 — "9 of 10" Remediation Plan

## Purpose
This document is the single source of truth for closing the remaining gaps in the
freshwater V3 lure/fly recommender so the product is confidently shippable.

The tuned engine is already matrix-clean (`309/309` across top-1, top-3, disallowed
avoidance, color lane, plus `14/14` daily-shift checks and `0` hard/soft fails).
This plan does **not** reopen species tuning. It only closes architectural and
correctness gaps identified in the post-tuning evaluation, so that every
`species × region × month × context` request (4 × 18 × 12 × 2, minus trout-in-lake)
provably returns exactly 3 lures and 3 flies and the surrounding code is
maintainable.

Work this doc section-by-section. Each section is self-contained. Do **not**
skip ahead: later sections assume earlier ones are complete.

---

## Guardrails that apply to every section
These come from `docs/recommender-v3-post-tuning-checklist.md` and must not be
violated in any section of this plan:

- Do **not** broadly rewrite the recommender architecture.
- Do **not** reopen species-level tuning unless a regression is observed.
- Do **not** introduce random tie-breakers or fake certainty.
- Do **not** change any authored seasonal row's `primary_lure_ids`,
  `primary_fly_ids`, `eligible_lure_ids`, `eligible_fly_ids`, or
  `monthly_baseline` values while implementing this plan. Data edits are
  out of scope. This plan is structural, not biological.
- After **every** section, rerun `npm run audit:recommender:v3:freshwater:validate`
  and `npm run audit:recommender:v3:regression-baselines`. Both must pass with
  zero new hard or soft fails before moving to the next section.

---

## Section map

| Section | Theme | Why it matters |
|---|---|---|
| 0 | Safety net (baseline snapshot) | Lets us detect regressions introduced by later sections. |
| 1 | Exhaustive coverage + gating tests | Proves "always 3 lures + 3 flies" and proves state-gating matches V3 scope. |
| 2 | Typed label contract, dead code, misnamed field | Removes silent-drift risk between `howFishingEngine` normalize layer and `resolveDailyPayloadV3`. |
| 3 | Structural hygiene (file splits) | Makes `scoreCandidates.ts` and `seasonal/largemouth.ts` reviewable. |
| 4 | State-scoped seasonal rows | Replaces hard-coded `stateCode === "PA" / "ID"` branches with a scalable pattern. |
| 5 | Signal-quality upgrades | Breakdown-driven `why_chosen` + surfaced color rationale. |
| 6 | Final validation + docs | Locks in the new baseline and updates the maintainer guides. |

Run order: strictly 0 → 1 → 2 → 3 → 4 → 5 → 6.

---

# Section 0 — Freeze the current baseline

## Goal
Capture a byte-stable snapshot of today's matrix outputs and regression-baseline
files so that every later section can diff against "known good".

## Files to touch
- `TightLinesAI/docs/recommender-v3-audit/generated/` (already committed matrix
  summaries live here — leave them in place).
- `TightLinesAI/docs/recommender-v3-audit/regression-baselines/expected-headlines.json`
  (already exists — do not regenerate).
- `TightLinesAI/docs/recommender-v3-audit/generated/PRE_9OF10_BASELINE.md` (new).

## Exact steps
1. Run `npm run audit:recommender:v3:freshwater:validate` from the
   `TightLinesAI/` directory. Confirm headline numbers match the current
   baseline in `docs/recommender-v3-post-tuning-checklist.md` ("Current
   Baseline" section).
2. Run `npm run audit:recommender:v3:regression-baselines`. It must exit 0.
3. Create `TightLinesAI/docs/recommender-v3-audit/generated/PRE_9OF10_BASELINE.md`
   containing:
   - A single-line timestamp (UTC ISO8601) of when the snapshot was taken.
   - The git SHA of `HEAD`.
   - The full stdout of `npm run audit:recommender:v3:freshwater:analyze`
     (copy the "Headline Summary" block verbatim).
   - The full stdout of `npm run audit:recommender:v3:coverage`.
   - The full stdout of `npm run audit:recommender:v3:daily-shifts`.
4. Commit this single new file with message:
   `chore(recommender-v3): freeze pre-9/10 baseline snapshot`.

## Definition of done
- `PRE_9OF10_BASELINE.md` exists and contains all three audit outputs.
- `npm run audit:recommender:v3:regression-baselines` exits 0.
- No other files were modified.

---

# Section 1 — Exhaustive coverage + cross-gating tests

## Goal
Turn the "every species × region × month × context returns 3 lures + 3 flies"
promise into a test that runs in CI, and add a matching test proving the
state-level gating in `config/stateSpeciesGating.ts` never advertises a
(species, context) pair the V3 engine will reject.

## Background
Today the engine relies on `resolveSeasonalRowV3` + `REGION_FALLBACKS`
(`supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.ts`)
to find a row for every input. The fallback chain covers all 18 canonical
regions, but there is **no test** that iterates the full Cartesian product and
asserts `lure_recommendations.length === 3 && fly_recommendations.length === 3`.
That is the single highest-leverage missing safeguard.

Similarly, `STATE_SPECIES_MAP` in
`supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts`
lists `(species, contexts[])` per state. `RECOMMENDER_V3_SPECIES_CONTEXTS` in
`supabase/functions/_shared/recommenderEngine/v3/scope.ts` defines which
`(v3_species, v3_context)` pairs the engine supports. These must not drift —
e.g. no state may advertise `river_trout` in `freshwater_lake_pond`.

## Files to create
- `TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.cartesian.test.ts`
- `TightLinesAI/supabase/functions/_shared/recommenderEngine/runRecommenderV3.cartesian.test.ts`
- `TightLinesAI/supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.consistency.test.ts`

## Files that may be read (no writes)
- `.../v3/contracts.ts` for `RECOMMENDER_V3_SPECIES`, `RECOMMENDER_V3_CONTEXTS`.
- `.../v3/scope.ts` for `RECOMMENDER_V3_SPECIES_CONTEXTS`.
- `.../howFishingEngine/contracts/region.ts` for `CANONICAL_REGION_KEYS` (or
  equivalent export — if none exists, import from
  `.../recommenderEngine/config/regions.ts`).
- `.../config/stateSpeciesGating.ts` for `STATE_SPECIES_MAP`.
- `.../sharedAnalysis.ts` for `analyzeRecommenderConditions`.

## Test 1 — `resolveSeasonalRow.cartesian.test.ts`
Deno test. Iterate every combination of:

- `species` ∈ `RECOMMENDER_V3_SPECIES`
- `region_key` ∈ all canonical regions (the 18-entry list)
- `month` ∈ `1..12`
- `context` ∈ `RECOMMENDER_V3_SPECIES_CONTEXTS[species]`

For each combo, call `resolveSeasonalRowV3(species, region_key, month, context)`
and assert:

- It does not throw.
- `row.eligible_lure_ids.length >= 3`.
- `row.eligible_fly_ids.length >= 3`.
- `row.primary_lure_ids.length >= 1`.
- `row.primary_fly_ids.length >= 1`.

Failure output must include the exact failing tuple so a human can jump
straight to the offending seasonal author file.

## Test 2 — `runRecommenderV3.cartesian.test.ts`
End-to-end determinism test. Use a **single fixed synthetic daily payload**
(build it once at the top of the file using a minimal but valid
`SharedConditionAnalysis`; if constructing that from scratch is noisy, reuse
one of the frozen matrix scenarios under
`docs/recommender-v3-audit/generated/…/scenarios/…` via
`computeRecommenderV3(req, analysis)`).

Iterate the same Cartesian product as Test 1 (substituting the region's first
`CANONICAL_REGIONS` entry for `req.location.region_key` and using a fixed
`state_code` such as `"TX"` just to satisfy the input contract — the engine
does not require the state code to match the region; it is only consumed by
two scoring guards). For each combo, assert:

- `response.lure_recommendations.length === 3`.
- `response.fly_recommendations.length === 3`.
- Every returned id is in the seasonal row's `eligible_*_ids`.
- `used_region_fallback` is a boolean (not undefined).
- No duplicate ids inside `lure_recommendations` or inside `fly_recommendations`.

This test is the production-grade proof of the core user promise.

## Test 3 — `stateSpeciesGating.consistency.test.ts`
For every `(state, species, contexts[])` triple in `STATE_SPECIES_MAP`:

- Map the legacy `SpeciesGroup` to V3 via `toRecommenderV3Species`.
- If the mapped V3 species is null (e.g. `walleye`, `striped_bass`,
  `redfish`, `seatrout`, `tarpon` — species V3 intentionally does not
  support), skip that entry.
- For each context in `contexts[]` that is also a V3 context
  (`isRecommenderV3Context`), assert
  `RECOMMENDER_V3_SPECIES_CONTEXTS[v3Species].includes(context) === true`.

This catches the class of bug where a state advertises `river_trout` in
`freshwater_lake_pond` (which the engine would 422) without warning a
maintainer.

## Verification
- Run `deno test supabase/functions/_shared/recommenderEngine` (from
  `TightLinesAI/`). All three new tests must pass.
- Run `npm run audit:recommender:v3:freshwater:validate`. Headline numbers
  must still match `PRE_9OF10_BASELINE.md`.
- Run `npm run audit:recommender:v3:regression-baselines`. Must exit 0.

## Definition of done
- Three new test files exist and pass.
- If any of the three tests reveal a real coverage hole (e.g. a seasonal row
  returning fewer than 3 eligible flies for some exotic region×month), do
  **not** fix it yet. Record the failing tuples in the PR description and
  stop. That is a seasonal-data gap that must be surfaced to the product
  owner before data edits are made.
- No scoring, seasonal, or contract code was modified in this section.

---

# Section 2 — Typed label contract, dead code, misnamed field

## Goal
Kill three silent-drift risks inside `resolveDailyPayloadV3` and the ranked
response shape so no future renames in the `howFishingEngine` normalize layer
or in the scoring module can silently break recommendations.

## Issue 2A — String-coupled label matching
Today `resolveDailyPayloadV3` (`supabase/functions/_shared/recommenderEngine/v3/resolveDailyPayload.ts`)
switches on raw string labels produced by `howFishingEngine/normalize/*.ts`:

- `"low_light"`, `"heavy_overcast"`, `"bright"`, `"glare"`, `"mixed_sky"`
  (line 24, 69–70, 114, 117, 237).

These strings are not type-checked against the producers. A rename in
`normalizeLight.ts` would compile cleanly and silently degrade daily
shifts.

### Fix
1. In `supabase/functions/_shared/howFishingEngine/normalize/normalizeLight.ts`,
   export a `const` tuple of every label the function can emit, typed as:

   ```ts
   export const LIGHT_LABELS = [
     "bright",
     "glare",
     "mixed_sky",
     "mixed",
     "low_light",
     "heavy_overcast",
   ] as const;
   export type LightLabel = (typeof LIGHT_LABELS)[number];
   ```

   Use the **exact** set of strings the function already emits — do not add
   or remove any label. If the function currently never emits one of the
   strings the recommender switches on, that is a bug; surface it but do not
   fix it in this section.

2. Change the return type of `normalizeLight` (and the `VariableState.label`
   field where appropriate) so callers observe `LightLabel | null` instead
   of `string | null`.

3. Do the same for `normalizeRunoff`, `normalizePressure`, `normalizePrecip`,
   `normalizeWind`, `normalizeTemperature`, and `normalizeTide`: each gets
   an exported `const` array of its actual emitted labels and a derived
   type. No new labels are introduced.

4. In `resolveDailyPayload.ts`, replace the `string | null` parameter types
   in the removed light-label shim and all local comparisons with the new
   `LightLabel | null` type (and equivalents for other variables if you
   reference them). Every `===` comparison against a label literal must be
   against a value that is inside the exported tuple — TypeScript will
   enforce it.

5. Do **not** change any control-flow. Only tighten types.

## Issue 2B — Dead `mixed_sky → mixed` mapping
`resolveDailyPayload.ts` previously contained a tiny helper that mapped
`mixed_sky` → `mixed` and otherwise returned the input string.

No downstream code in that file used the value `"mixed"` — all conditionals
check `"low_light"` / `"heavy_overcast"` / `"bright"` / `"glare"`. The
mapping was dead once `normalizeLight` stopped emitting `mixed_sky`.

### Fix
Delete the helper. At the former call site, read the label directly and
narrow with `isLightLabel` from `normalizeLight.ts`:

```ts
const rawLightLabel =
  analysis.norm.normalized.light_cloud_condition?.label ?? null;
const lightLabel: LightLabel | null =
  rawLightLabel !== null && isLightLabel(rawLightLabel) ? rawLightLabel : null;
```

Confirm no other file still references the deleted helper name.

## Issue 2C — Misnamed diversity score field (`diversity_bonus`)
The field now named `diversity_bonus` on `RecommenderV3RankedArchetype`
(`v3/contracts.ts`) and on `ScoredCandidate` (`v3/scoringTypes.ts`)
is never populated by `scoreCandidates.ts` (it is hard-coded to `0` at
the scored-candidate factory). The **only** place it gets a non-zero value is
`topThreeSelection.ts`, where the variable is assigned the output of
`changeupBonus(...)`. In other words, the field stores a diversity /
changeup bonus, not a per-archetype "mix fit" score.

### Fix
1. Rename the field across the entire codebase to `diversity_bonus`.
   - Files touched: `v3/contracts.ts`, `v3/scoringTypes.ts`,
     `v3/scoreCandidates.ts`, `v3/topThreeSelection.ts`, plus any audit
     script that reads it (search the repo for the pre-rename identifier).
2. Update the doc comment on the field to say:
   > "Post-selection diversity bonus applied in `topThreeSelection`. Zero
   > for candidates that were not considered as a changeup slot. Not a
   > per-archetype fit score."
3. Audit scripts under `scripts/recommender-v3-audit/` that persist this
   field into JSON summaries: update them to read `diversity_bonus`. Any
   committed summary JSON under `docs/recommender-v3-audit/generated/` that
   contains the pre-rename key gets regenerated once at the end of this
   section (see verification below).

## Verification
- `deno check supabase/functions/_shared/recommenderEngine/v3/resolveDailyPayload.ts`
  must compile clean with the new types.
- A repo-wide search for the pre-rename field identifier must return zero matches.
- Run `npm run audit:recommender:v3:freshwater:validate`. Headline numbers
  must still match `PRE_9OF10_BASELINE.md`.
- Run `npm run audit:recommender:v3:regression-baselines`. Must exit 0.
- Regenerate committed matrix summaries under
  `docs/recommender-v3-audit/generated/` (`npm run audit:recommender:v3:freshwater:matrix:run-all`
  followed by `npm run audit:recommender-v3:freshwater:analyze`). Commit the
  regenerated JSON/MD. Headline numbers must be unchanged.

## Definition of done
- Every label-comparison site in `resolveDailyPayload.ts` is type-checked
  against a producer-exported tuple.
- The dead `mixed_sky → mixed` light-label shim and its helper are gone.
- The diversity score field is named `diversity_bonus` everywhere with an
  accurate doc comment.
- All audit outputs still match the Section 0 baseline.

---

# Section 3 — Structural hygiene (file splits)

## Goal
Shrink two files that are currently hard to review without changing a single
scoring number or seasonal value: `scoreCandidates.ts` (1,218 lines) and
`seasonal/largemouth.ts` (3,275 lines).

## 3A — Extract species guards from `scoreCandidates.ts`

Target layout, all under
`supabase/functions/_shared/recommenderEngine/v3/scoring/`:

```
scoring/
  index.ts                     (barrel re-export of scoreLureCandidatesV3, scoreFlyCandidatesV3)
  scoreCandidates.ts           (general math + scoreProfile + rank; stays here)
  guards/
    largemouthLakeGuards.ts    (current function: largemouthLakeGuardAdjustments)
    smallmouthGuards.ts        (current function: smallmouthGuardAdjustments, + its PA branch today)
    practicalityStateGuards.ts (current ID April runoff branch currently inside practicalityFit)
```

Keep `v3/scoreCandidates.ts` as a re-export shim so existing imports keep
working:

```ts
export { scoreLureCandidatesV3, scoreFlyCandidatesV3 } from "./scoring/index.ts";
```

### Rules for the split
- Do **not** change any scoring weights, thresholds, or ordering.
- Every guard function keeps its exact current signature and returns the
  same numeric delta under the same inputs.
- The hard-coded `stateCode === "PA"` and `stateCode === "ID"` branches
  stay exactly where their parent function lives for now — they move with
  the guard. They will be replaced in Section 4, not this one.
- `deno fmt` the new files.
- After the split, `scoring/scoreCandidates.ts` should be under ~450 lines.

## 3B — Split `seasonal/largemouth.ts`

Target layout, all under
`supabase/functions/_shared/recommenderEngine/v3/seasonal/largemouth/`:

```
largemouth/
  index.ts                (exports LARGEMOUTH_V3_SEASONAL_ROWS)
  base.ts                 (the authored "default" rows used as the starting
                           set for addMonths / override helpers)
  overrides/
    florida.ts
    gulfCoast.ts
    southeastAtlantic.ts
    southCentral.ts
    greatLakes.ts
    northeastAppalachian.ts
    midwestInterior.ts
    westAndMountain.ts
```

Keep `seasonal/largemouth.ts` as a one-line re-export:
`export { LARGEMOUTH_V3_SEASONAL_ROWS } from "./largemouth/index.ts";`

### Rules for the split
- Do **not** edit a single authored value (`eligible_*_ids`, `primary_*_ids`,
  `monthly_baseline`, etc.). This is pure file reshuffling.
- Preserve the order in which rows are registered — `index.ts` must
  concatenate override groups in the same order the current file applies
  them. (The order matters if `addMonths` uses "last write wins" semantics;
  audit-driven verification below will catch any divergence.)
- `validateSeasonalRow.ts` runs at module load; keep that invariant.
- After the split, no file in `seasonal/largemouth/` should exceed 800
  lines.

## Verification (applies to both 3A and 3B)
- `deno check supabase/functions/_shared/recommenderEngine/**.ts` compiles
  clean.
- `deno test supabase/functions/_shared/recommenderEngine` — every test from
  Section 1 still passes.
- Rerun the full matrix archive + run + analyze cycle:
  ```
  npm run audit:recommender:v3:freshwater:matrix:run-all
  npm run audit:recommender:v3:freshwater:analyze
  npm run audit:recommender:v3:coverage
  npm run audit:recommender:v3:daily-shifts
  npm run audit:recommender:v3:regression-baselines
  ```
  Every headline number must match `PRE_9OF10_BASELINE.md` **exactly**. If a
  single cell moves, the split was not mechanical — revert and retry.

## Definition of done
- `scoreCandidates.ts` is thin; species guards live in
  `v3/scoring/guards/*`.
- `seasonal/largemouth.ts` is a one-line shim; authored rows live under
  `seasonal/largemouth/`.
- All audits unchanged.

---

# Section 4 — Replace `stateCode === "PA" | "ID"` branches with state-scoped seasonal rows

## Goal
Remove the two hard-coded state branches inside the scoring layer and replace
them with a first-class "state-scoped seasonal row" mechanism, so adding a new
state-specific tuning in the future is a data edit, not a scoring edit.

## Background
Today `scoring/guards/smallmouthGuards.ts` (post-Section-3) has a PA June
river branch at what was `scoreCandidates.ts:622–638`. `practicalityFit`
(lines 794, 808–823) has two ID April runoff branches. These branches mix
biological truth (what lane leads on Pennsylvania tailwaters in June) with
scoring math. That is the wrong layer.

## Design
1. Extend `RecommenderV3SeasonalRow` in
   `supabase/functions/_shared/recommenderEngine/v3/contracts.ts`:

   ```ts
   export type RecommenderV3SeasonalRow = {
     // ... existing fields unchanged ...
     /** Optional: US state 2-letter code. When present, this row is only used
      *  when the request's state_code matches. State-scoped rows take
      *  priority over region-scoped rows for the same
      *  (species, region_key, month, context).
      */
     state_code?: string;
   };
   ```

2. Update `resolveSeasonalRowV3` (`seasonal/resolveSeasonalRow.ts`) to accept
   an optional `state_code` parameter. Resolution order:

   1. Exact match on `(species, region_key, month, context, state_code)`
      where `state_code` is defined on the row.
   2. Exact match on `(species, region_key, month, context)` where the row
      has no `state_code`.
   3. `REGION_FALLBACKS` chain, reapplying steps 1 then 2.

   Plumb `state_code` from `req.location.state_code` through
   `runRecommenderV3.ts` (`computeRecommenderV3`).

3. For each hard-coded branch, author one or more **narrow** state-scoped
   seasonal rows that reproduce the branch's behavior by editing the row's
   `primary_lure_ids` / `primary_fly_ids` order (and adjusting the eligible
   sets only if strictly required). Rows live under the appropriate species
   seasonal override folder:

   - PA June `freshwater_river` smallmouth: new row under
     `seasonal/smallmouth/overrides/pennsylvania.ts` that reorders
     `primary_lure_ids` so `tube_jig`, `squarebill_crankbait`,
     `suspending_jerkbait` lead ahead of `walking_topwater`. Deletion of
     scoring delta must be **numerically equivalent** for the matrix
     scenarios covering PA June.
   - ID April `freshwater_river` trout: new row under
     `seasonal/trout/overrides/idaho.ts` (create the directory if it does
     not exist — this may require applying the equivalent of Section 3B
     to `trout.ts` if not already done; if not, keep the override inside a
     single `seasonal/trout/overrides.ts` file instead of directory-splitting
     trout in this pass) that elevates `sculpin_streamer`, `woolly_bugger`,
     `clouser_minnow` in `primary_fly_ids`, and demotes `inline_spinner`
     and `slim_minnow_streamer` from `primary_*_ids` to eligibility-only.

4. Once the state-scoped rows reproduce the branch behavior, delete:
   - The `stateCode === "PA"` block inside the smallmouth guard.
   - The two `stateCode === "ID"` blocks inside `practicalityFit`.
   - The `stateCode?: string` parameter can remain on the scoring functions
     (because the architecture still supports it) or be removed — delete it
     if no remaining scoring code uses it after the branches are gone.

## Rules
- The net matrix result for every PA-June and ID-April scenario already in
  the audit archives must be **bit-identical** before and after this
  section. If it is not, either (a) the new row values are wrong or (b) the
  guard deletion was premature — revert and retry.
- Do **not** invent new biology. The new rows only codify the exact
  adjustments the branches were making.

## Verification
- Run Section 1's Cartesian tests — they must still pass (they now silently
  exercise the new `state_code`-aware resolver for rows that have no
  `state_code` set).
- Add one more Deno test,
  `seasonal/resolveSeasonalRow.stateScoped.test.ts`, that asserts:
  - Calling `resolveSeasonalRowV3("smallmouth_bass", "northeast", 6, "freshwater_river", "PA")`
    returns the new PA row.
  - Calling it without `"PA"` returns the shared northeast June row.
  - The PA row's `primary_lure_ids[0] === "tube_jig"`.
- Rerun the full audit suite; every headline must match
  `PRE_9OF10_BASELINE.md`.

## Definition of done
- `RecommenderV3SeasonalRow.state_code` exists and the resolver honors it.
- No `stateCode === "PA"` or `stateCode === "ID"` branch exists in the
  scoring layer.
- `PA-June-smallmouth-river` and `ID-April-trout-river` matrix outputs are
  unchanged.

---

# Section 5 — Signal quality: breakdown-driven `why_chosen` + surfaced color rationale

## Goal
Close two user-perceived quality gaps without changing rankings. The ranking
contract stays identical; only the explanatory text and a new `color_reason`
field improve.

## 5A — Breakdown-driven `why_chosen`
Today `buildWhyChosen` (`v3/recommendationCopy.ts:222`) stitches strings from
the seasonal row, the resolved profile, and the daily payload's notes. It
does **not** consult `RecommenderV3ScoreBreakdown` — the very data structure
that lists each scoring dimension's contribution. Result: the free-text
explanation can disagree with the actual numeric driver of the selection.

### Fix
1. Change the `buildWhyChosen` signature to accept the selected candidate's
   `breakdown: RecommenderV3ScoreBreakdown[]`.
2. Inside `buildWhyChosen`, before any string-stitching, identify the
   single largest positive contributor in `breakdown` (break ties by the
   existing breakdown array order — do not randomize). Map its dimension
   to a human phrase. Minimum mapping table:

   | breakdown `dimension` | phrase prefix |
   |---|---|
   | `monthly_primary_fit` | "It's one of this month's lead lanes." |
   | `tactical_fit` | "It matches the column and pace the conditions are pushing toward." |
   | `practicality_fit` | "It fishes cleanly in this water and weather." |
   | `forage_fit` | "It matches what bass are keyed on right now." |
   | `clarity_fit` | "It reads well in today's clarity." |
   | `diversity_bonus` | "It rounds out the lineup with a different look." |

   (If a dimension is missing above, fall back to the existing
   string-stitched output.)

3. Prepend the chosen phrase to the existing output, keeping the existing
   text as the second sentence. Never emit two contradicting sentences —
   if the largest-contributor phrase is already present, skip the prepend.

4. Update the call site in `scoring/scoreCandidates.ts` (post-Section-3) to
   pass `breakdown` into `buildWhyChosen`.

## 5B — Surfaced color rationale
`resolveColorDecisionV3` (`v3/colorDecision.ts:69`) already produces a
structured `reason_code` (`"clear_bright_natural"` … `"dirty_low_bright"`).
That code is **not** exposed on `RecommenderV3RankedArchetype`.

### Fix
1. Add to `RecommenderV3RankedArchetype` (`v3/contracts.ts:376`):

   ```ts
   color_decision: {
     theme: ResolvedColorThemeV3;
     reason_code: ResolvedColorDecisionV3["reason_code"];
     short_reason: string; // human phrase derived from reason_code
   };
   ```

2. Introduce a pure function `colorReasonPhrase(reasonCode)` in
   `v3/colorDecision.ts` with one phrase per `reason_code`. Examples:
   - `clear_bright_natural` → "Clear water + bright sun → go natural."
   - `stained_low_bright` → "Stained water + low light → bright/chartreuse stands out."
   - `dirty_mixed_bright` → "Dirty water + mixed light → bright profile reads from farther."
   (Fill in all nine codes.)

3. Populate `color_decision` in `scoreCandidates.ts` where the ranked
   archetype object is built. Leave the existing
   `color_theme` + `color_recommendations` fields untouched for
   back-compat.

## Rules
- Do **not** change `score`, `tactical_fit`, `practicality_fit`,
  `forage_fit`, `clarity_fit`, `diversity_bonus`, or any selection logic.
- Do **not** remove the legacy `color_theme` field in this pass. Leaving
  it duplicated protects existing UI code until the client migrates.

## Verification
- `npm run audit:recommender:v3:freshwater:validate` — headline numbers
  match `PRE_9OF10_BASELINE.md`.
- `npm run audit:recommender:v3:regression-baselines` exits 0.
- Spot-check a representative scenario file under
  `docs/recommender-v3-audit/generated/.../top-three/…` (or run a single
  matrix run) to confirm `color_decision.reason_code` now appears and
  `why_chosen` starts with the breakdown-driven phrase.

## Definition of done
- Every returned ranked archetype carries a populated `color_decision`
  object with `reason_code` + `short_reason`.
- `why_chosen` never contradicts the top positive breakdown contributor.
- Rankings and scores are numerically unchanged.

---

# Section 6 — Final validation, docs, handoff

## Goal
Lock the improved engine into the regression baseline and update the
maintainer guides so future agents know the new patterns.

## Steps
1. Run the full audit cycle:
   ```
   npm run audit:recommender:v3:freshwater:matrix:archive-env-all
   npm run audit:recommender:v3:freshwater:validate
   npm run audit:recommender:v3:regression-baselines
   ```
   Commit all regenerated files under
   `docs/recommender-v3-audit/generated/`.

2. Update
   `supabase/functions/_shared/recommenderEngine/ENGINE_V3_MAINTAINER_GUIDE.md`:
   - New section "State-scoped seasonal rows" describing how to author one
     (point at Section 4's mechanism).
   - New section "Label contracts" explaining that every
     `howFishingEngine/normalize/*.ts` file owns the canonical set of
     labels it emits and that consumers must import the exported `const`
     tuples rather than comparing raw strings.
   - Update the field glossary to describe `diversity_bonus` (renamed)
     and `color_decision.reason_code` (new).

3. Update
   `docs/recommender-v3-audit/V3_POST_TUNING_STATE.md` with a
   "Post-9/10 remediation" subsection listing:
   - The three new Cartesian + consistency tests.
   - The typed label contract.
   - The removal of state-code branches.
   - The new `color_decision` field.

4. Update `docs/recommender-v3-post-tuning-checklist.md` to check off the
   relevant items under Sections 3, 4, and 5 of that doc (e.g. "Tuning
   Philosophy Documentation — exception audit", which this plan's
   Section 4 satisfies).

5. Tag the commit series with a clear message, e.g.
   `chore(recommender-v3): 9-of-10 remediation complete`.

## Definition of done
- Every earlier section's definition of done is met.
- `PRE_9OF10_BASELINE.md` + new post-remediation baseline are both committed
  so future agents can diff them.
- Maintainer guide and post-tuning state doc describe the new patterns.
- `npm run audit:recommender:v3:freshwater:validate` and
  `npm run audit:recommender:v3:regression-baselines` both pass.

---

# Working protocol with the orchestrating human
- Each section is its own agent pass. Do not proceed to the next section
  until the human confirms the previous one is accepted.
- If a section's "Verification" step reveals a matrix-number change you
  cannot explain mechanically, stop and report. Do not attempt to "fix"
  rankings in this plan — that would violate the "don't reopen tuning"
  guardrail.
- Every section's final report to the human must include:
  1. A list of every file created, modified, or deleted.
  2. The full output of `npm run audit:recommender:v3:freshwater:validate`
     headline summary.
  3. The exit status of `npm run audit:recommender:v3:regression-baselines`.
  4. A one-line "Definition of done met? Yes/No" with justification.
