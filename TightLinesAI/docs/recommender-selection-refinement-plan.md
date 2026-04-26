# Recommender Selection Refinement Plan

## Purpose

This plan refines the live deterministic lure and fly recommender so it feels
like a strong guide, not a calculator.

The current production spine is good:

1. Resolve species, region, month, water type, water clarity, and daily
   conditions.
2. Load the exact seasonal row.
3. Shape the day into three target profiles, such as `surface / medium` or
   `bottom / slow`.
4. Select up to three lures and up to three flies.

The current selection behavior is too narrow. It can collapse a believable
daily lane into the same exact item too often, over-use forage or clarity as
slot dictators, and allow lure/fly trios that look too similar to an angler.

The goal is:

- Keep the clean deterministic architecture.
- Keep biology and column truth strict.
- Add bounded, deterministic variety inside the set of guide-approved options.
- Make 3 lures and 3 flies the target wherever honest inventory supports it.
- Avoid fake fit, random flicker, and cluttered exception logic.

## Non-Goals

Do not add habitat user input in this project phase.

Defer all user-selected cover/bottom inputs such as weeds, grass, pads, wood,
rock, sand, docks, current seams, etc. Those may become optional refinements
later, but they are not required to fix the current recommender.

Do not revive the legacy V3 weighted scoring engine.

Do not make live refresh produce different recommendations for the same user,
same date, same location, same species, same water type, and same clarity.
Variety must be deterministic and date-scoped, not true runtime randomness.

Do not loosen species, region, water type, or seasonal row coverage through
fallback rows.

## Current Problems To Fix

### 1. Family Diversity Is Too Fine-Grained

The current `family_group` prevents exact duplicates, but it is too detailed to
prevent bad user-facing trios.

Example problem:

- `squarebill_crankbait`
- `medium_diving_crankbait`
- `lipless_crankbait`

These can be distinct `family_group` values, but to an angler this still reads
as three crankbait-style recommendations.

### 2. Pace Is Too Hard A Gate

Current selection requires exact column and exact pace, where pace may match
`primary_pace` or `secondary_pace`.

Column should remain strict. Pace should become a compatibility weight, not an
absolute gate, unless an item is truly incompatible with the slot.

Example:

For a `surface / medium` Florida largemouth slot, a frog should not disappear
just because it is authored as `surface / slow`. It is still a valid surface
tool in that seasonal context, especially in Florida lake/pond fishing.

### 3. Forage And Clarity Narrow Too Aggressively

Forage and clarity are useful. They should influence selection, not dominate it.

Current slot-level narrowing can make the engine repeatedly choose the same
subset when multiple guide-approved options exist.

Desired behavior:

- Forage match: bonus.
- Clarity match or specialist match: bonus.
- Non-match: usually still eligible if the item passes species, water type,
  row, surface, and column gates.

### 4. Daily Condition Windows Are Good But Too Narrow In Effect

Daily condition windows are useful and should remain. Windy stained water
favoring spinnerbait/bladed jig/lipless is reasonable. Calm aggressive surface
days favoring topwater is reasonable.

But a condition window should boost a set of items, not monopolize a slot
unless the row and pool are already narrow.

### 5. Seasonal Shortlists Need A Truth Audit

The Florida frog example shows this clearly.

Florida LMB lake rows may include frogs in some months and omit them in others.
Before catalog-thinness can be trusted, every row must be audited for whether
the right lures and flies are actually available for that species, region,
water type, and month.

## Desired Selection Philosophy

The engine should behave like this:

1. "The seasonal row says these columns, paces, forage modes, and archetypes are
   biologically in play."
2. "Today shapes the best three tactical lanes."
3. "For each lane, keep the column strict."
4. "Inside that column, score or weight compatible options by pace, forage,
   clarity, daily condition windows, macro diversity, and recent history."
5. "Use deterministic weighted sampling to choose among the credible options."

In plain fishing terms:

If today is a surface Florida largemouth day, the engine should not always act
as if it knows the one perfect topwater. It should identify a credible surface
lane and rotate among frog, walking bait, popper, buzzbait, slider, or related
surface tools when each is seasonally and contextually honest.

## Pass Order

Do these passes in order. Each pass should leave the app compiling and tests
passing before the next pass starts.

## Pass 1: Add Macro Presentation Groups

### Goal

Add a broader diversity label to every lure and fly archetype.

Keep `family_group` for display and fine-grained identity. Add a new field
called `presentation_group` for broad top-three diversity.

### Files

- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- Existing catalog tests under:
  - `supabase/functions/_shared/recommenderEngine/v4/__tests__/`
  - `supabase/functions/_shared/recommenderEngine/__tests__/`

### Contract Changes

Add:

```ts
presentation_group: string;
```

to `ArchetypeProfileV4`.

Do not expose this field to the frontend response unless needed for debugging.
The UI can continue showing `family_group`.

### Lure Presentation Groups

Use these groups unless there is a strong reason to split further:

| presentation_group | Archetypes |
| --- | --- |
| `worm_finesse` | `weightless_stick_worm`, `carolina_rigged_stick_worm`, `shaky_head_worm`, `drop_shot_worm` |
| `drop_shot_minnow` | `drop_shot_minnow` |
| `ned_tube_finesse` | `ned_rig`, `tube_jig` |
| `bottom_jig_craw` | `texas_rigged_soft_plastic_craw`, `football_jig`, `compact_flipping_jig`, `finesse_jig` |
| `swim_jig` | `swim_jig` |
| `hair_jig` | `hair_jig` |
| `spinner_vibration` | `inline_spinner`, `spinnerbait`, `bladed_jig`, `large_bucktail_spinner` |
| `swimbait` | `paddle_tail_swimbait`, `large_profile_pike_swimbait` |
| `jerkbait` | `soft_jerkbait`, `suspending_jerkbait`, `pike_jerkbait` |
| `crankbait` | `squarebill_crankbait`, `flat_sided_crankbait`, `medium_diving_crankbait`, `deep_diving_crankbait`, `lipless_crankbait` |
| `blade_spoon` | `blade_bait`, `casting_spoon` |
| `topwater_open` | `walking_topwater`, `popping_topwater`, `buzzbait`, `prop_bait`, `large_pike_topwater` |
| `topwater_frog` | `hollow_body_frog` |
| `pike_jig` | `pike_jig_and_plastic` |

This grouping intentionally makes multiple crankbaits conflict at the macro
level, while allowing a frog and walking bait to be different topwater looks.

### Fly Presentation Groups

Use these groups:

| presentation_group | Archetypes |
| --- | --- |
| `baitfish_streamer` | `clouser_minnow`, `deceiver`, `bucktail_baitfish_streamer`, `slim_minnow_streamer`, `articulated_baitfish_streamer`, `game_changer`, `zonker_streamer`, `conehead_streamer`, `unweighted_baitfish_streamer`, `baitfish_slider_fly` |
| `big_articulated_streamer` | `articulated_dungeon_streamer`, `large_articulated_pike_streamer` |
| `leech_bugger` | `jighead_marabou_leech`, `lead_eye_leech`, `woolly_bugger`, `rabbit_strip_leech`, `balanced_leech`, `feather_jig_leech` |
| `sculpin_bottom` | `sculpin_streamer`, `sculpzilla`, `muddler_sculpin` |
| `crawfish_fly` | `crawfish_streamer` |
| `pike_bunny_streamer` | `pike_bunny_streamer` |
| `surface_fly_popper_slider` | `popper_fly`, `deer_hair_slider` |
| `surface_fly_frog_mouse` | `frog_fly`, `mouse_fly` |

This does not pretend flies are not often baitfish imitations. It simply
prevents three "strip a baitfish streamer" answers from looking like variety
when the lineup can be more guide-like.

### Acceptance Tests

Add or update tests so:

- Every lure and fly has `presentation_group`.
- `presentation_group` is non-empty.
- Reconstructing catalog entries through `lure()` / `fly()` preserves it.
- At least one test proves three crankbait archetypes share
  `presentation_group === "crankbait"`.
- At least one test proves `popper_fly` / `deer_hair_slider` and `frog_fly` /
  `mouse_fly` are separated into the intended surface fly groups.

## Pass 2: Refactor Selection Into Weighted Deterministic Sampling

### Goal

Replace "narrow until one answer wins" with "build a credible pool, weight it,
and choose deterministically from the weighted pool."

This is the main engine behavior change.

### Files

- `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts`
- Tests under:
  - `supabase/functions/_shared/recommenderEngine/__tests__/rebuildFinalistPoolPolicy.test.ts`
  - `supabase/functions/_shared/recommenderEngine/__tests__/rebuildSelectSideSlotExact.test.ts`
  - `supabase/functions/_shared/recommenderEngine/__tests__/rebuildDailyConditionWindows.test.ts`
  - Add a new test file if cleaner:
    `supabase/functions/_shared/recommenderEngine/__tests__/rebuildWeightedVariety.test.ts`

### Strict Gates

Keep these as hard gates:

- `gear_mode === side`
- species allowed
- water type allowed
- row primary shortlist membership
- row exclusion list
- surface blocked removes surface items and surface flies
- candidate column must equal target profile column
- candidate primary pace must be inside row `pace_range`
- candidate column must be inside row `column_range`
- no duplicate archetype id within a side's top three

### Soft Factors

Convert these to weighted factors:

- primary pace exact match
- secondary pace exact match
- adjacent pace compatibility
- primary forage match
- secondary forage match
- clarity strengths match
- clarity specialist match
- daily condition window match
- unused `presentation_group`
- unused fine `family_group`
- recent-history cooldown

### Pace Compatibility

Do not allow all paces equally.

Use compatibility tiers:

| Slot pace vs item pace | Eligibility | Suggested weight |
| --- | --- | --- |
| item `primary_pace === slot.pace` | eligible | high |
| item `secondary_pace === slot.pace` | eligible | medium-high |
| item primary pace adjacent to slot pace | eligible | medium |
| item secondary pace adjacent to slot pace | eligible | medium-low |
| item has no exact or adjacent pace relationship | not eligible |

Adjacent means:

- `slow` adjacent to `medium`
- `medium` adjacent to `slow` and `fast`
- `fast` adjacent to `medium`

Do not allow `slow` to satisfy `fast` or `fast` to satisfy `slow` unless that
pace is explicitly authored as secondary.

### Suggested Weight Model

Use simple additive or multiplicative scoring. Keep it readable.

A recommended additive model:

```ts
score = 100
+ paceScore
+ forageScore
+ clarityScore
+ conditionScore
+ diversityScore
+ recencyScore
+ slotOrderScore
```

Suggested values:

| Factor | Score |
| --- | ---: |
| primary pace exact | `+30` |
| secondary pace exact | `+22` |
| primary pace adjacent | `+12` |
| secondary pace adjacent | `+8` |
| primary forage match | `+14` |
| secondary forage match | `+6` |
| clarity strength includes selected clarity | `+8` |
| clarity specialist matches selected clarity | `+10` additional |
| active condition window match | `+18` |
| unused presentation group | `+28` |
| already used presentation group | `-80` |
| unused fine family group | `+8` |
| already used fine family group | `-20` |
| shown in recent 7-day history | `-45` |

These values are starting points. They should be centralized as constants in
`selectSide.ts` so future tuning is easy.

### Diversity Rules

Use `presentation_group` as the primary diversity key.

Policy:

1. Prefer no repeated `presentation_group` within the same side.
2. Allow repeated `presentation_group` only when no positive-score alternative
   exists for the slot.
3. Still prefer distinct fine `family_group` as a secondary diversity signal.

This should eliminate obvious bad trios such as three crankbait-style lures
while still allowing a thin winter row to return honest options.

### Deterministic Weighted Sampling

Do not sort by score and always pick the top item.

Instead:

1. Build scored candidate pool.
2. Remove candidates with score <= 0.
3. Convert scores to positive weights.
4. Use deterministic seeded weighted sampling to select one item.

Seed must include:

- user seed or `"shared"`
- local date
- region key
- species
- water type
- clarity
- side
- slot index
- candidate id in the deterministic choice function

The same request must return the same result. A different local date may rotate
the choice if multiple credible candidates exist.

Implementation option:

- Keep `hashSeed`.
- Create `weightedChoice(seed, candidates)` where each candidate has `{ cand,
  score }`.
- Compute a deterministic integer in `[0, totalWeight)`.
- Walk the sorted candidates by stable id order until the weighted threshold is
  crossed.

### Forage Slot / Clarity Slot / Condition Slot

Remove the current concept that forage, clarity, and condition each owns one
slot and narrows only there.

Instead:

- Apply forage score to every slot.
- Apply clarity score to every slot.
- Apply condition-window score to every slot where the condition window is
  relevant.

If this creates too much sameness, tune weights downward rather than restoring
hard slot narrowing.

### Output Shape

Keep the existing output shape:

- `id`
- `display_name`
- `family_group`
- `color_style`
- `why_chosen`
- `how_to_fish`
- `primary_column`
- `pace`
- `presence`
- `is_surface`
- `source_slot_index`

Do not expose internal scores to the app by default.

### Trace Support

Keep `onSlotTrace`, but update trace fields to include:

- `candidateScores`: array of `{ id, score, reasons }`
- `chosenId`
- `presentationGroupNarrowed` or equivalent flag if a same-group candidate was
  penalized out
- `recentHistoryPenaltyApplied`
- `conditionWindow`

This trace can stay test-only.

### Acceptance Tests

Add tests proving:

- Same request returns identical picks.
- Different local dates can rotate among same-column same-season alternatives.
- Column remains exact.
- Adjacent pace can allow frogs into `surface / medium` slots.
- `slow` does not satisfy `fast` through adjacency.
- Three crankbait-style lures are not returned when non-crank alternatives
  exist.
- Recent history can rotate away from yesterday's exact pick when alternatives
  exist.
- Forage and clarity influence ranking but do not eliminate otherwise credible
  candidates.

## Pass 3: Rebalance Daily Condition Windows

### Goal

Make condition windows stronger as bonuses, not hard funnels.

### Files

- `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts`
- `supabase/functions/_shared/recommenderEngine/__tests__/rebuildDailyConditionWindows.test.ts`

### Required Behavior

Keep these windows:

- Lure surface commitment
- Lure wind reaction
- Lure clear subtle
- Trout mouse fly
- Surface commitment fly

But use them as weight boosts.

Do not let one condition window automatically remove all other credible options
from the pool.

### Surface Window

For aggressive surface days with non-windy daylight wind:

- Boost open-water topwaters and frogs if they are valid for the row.
- Do not force only `walking_topwater`.
- Do not force only `frog_fly`.

### Wind Reaction Window

For windy and non-suppressive conditions:

- Boost `spinnerbait`, `bladed_jig`, and `lipless_crankbait`.
- Do not hard-remove swimbaits, jerkbaits, or other valid mid-column options
  unless they already fail gates.

### Clear Subtle Window

For clear, non-windy, non-aggressive conditions:

- Boost subtle clear-water tools.
- Do not make `suspending_jerkbait` a guaranteed output every time.

### Trout Mouse Window

For trout river summer, aggressive, calm, surface-allowed days:

- Strongly boost `mouse_fly`.
- Do not use mouse outside valid species, water type, month, surface, and wind
  context.

### Acceptance Tests

Add tests proving condition windows change probabilities or deterministic
weighted choice in representative pools, but do not collapse the pool to one
item when multiple valid options exist.

## Pass 4: Seasonal Row Truth Audit And Repairs

### Goal

Audit and repair row shortlists so each species, region, month, and water type
has the right lures and flies in play.

This pass should happen after selection refactor. Otherwise current hard
filtering may make good rows look bad.

### Files

Primary authoring source:

- `data/seasonal-matrix/largemouth_bass.csv`
- `data/seasonal-matrix/smallmouth_bass.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `data/seasonal-matrix/trout.csv`

Generated output:

- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/*.ts`

Scripts:

- `scripts/generate-seasonal-rows-v4.ts`
- `scripts/check-seasonal-matrix-consistency.ts`
- `scripts/audit-eligibility-by-region-v4.ts`

### Audit Questions For Every Row

For each row, answer:

- Is the `column_range` honest for the species, region, month, and water type?
- Is `column_baseline` the right neutral center of gravity?
- Is `pace_range` honest?
- Is `pace_baseline` honest?
- Is `surface_seasonally_possible` correct?
- Is `primary_forage` plausible?
- Is `secondary_forage` plausible?
- Are the right lure archetypes present in `primary_lure_ids`?
- Are the right fly archetypes present in `primary_fly_ids`?
- Are any archetypes present only to pad inventory?
- Are any region-specific staples missing?
- Are any water-type-invalid patterns included?

### High-Priority Row Families

Start with rows most likely to produce obvious user-facing errors:

1. Florida LMB lake/pond March-October.
2. Gulf Coast LMB lake/pond March-October.
3. Southeast Atlantic LMB lake/pond March-October.
4. Florida/Gulf/Southeast LMB river warm-season rows.
5. Smallmouth summer river rows where surface or baitfish streamers may be
   over/under represented.
6. Pike warm-season lake rows where large surface and large baitfish profiles
   should vary.
7. Trout summer river rows where mouse/surface/streamer choices must stay
   regionally honest.
8. Cold-water winter rows where forced 3:3 may be unrealistic.

### Florida/Gulf/Southeast Frog Rule

For warm-season largemouth lake/pond rows in Florida, Gulf Coast, and Southeast
Atlantic:

- `hollow_body_frog` should usually be present when `surface` is seasonally
  possible.
- `frog_fly` should usually be present for fly-side lake/pond surface seasons.
- Removing frogs must have a row note explaining why.

Warm-season means roughly March through October, but the exact month span may
vary by region if the biology justifies it.

### Topwater Variety Rule

When `surface` is seasonally possible, the row should usually include at least
two meaningfully different surface lure looks if the species and water type
support them.

Examples:

- frog + walking bait
- popper + buzzbait
- walking bait + prop bait
- pike large topwater + buzzbait or frog where species permits

For flies, the row should usually include at least two surface fly looks where
surface fly fishing is honest.

### Regeneration Required

After CSV edits, run:

```bash
npm run gen:seasonal-rows-v4
npm run check:seasonal-matrix
npm run audit:eligibility
```

Generated files must match the CSV source.

### Acceptance Tests

Add row-specific tests for high-risk cases:

- Florida LMB lake July/August/September includes frog opportunities when
  surface is possible.
- Gulf Coast LMB lake summer includes frog opportunities when surface is
  possible.
- No row includes a surface fly for a species that the catalog forbids.
- No row includes lake-only lures in river-only contexts unless catalog permits.

## Pass 5: Catalog Eligibility Audit

### Goal

Ensure the catalog itself is truthful after the selector has been improved.

### Files

- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`

### Audit Fields

For every archetype, audit:

- species allowed
- water types allowed
- canonical column
- primary pace
- secondary pace
- forage tags
- clarity strengths
- family group
- presentation group
- surface flag behavior

### Specific Guidance

Do not broaden species or water-type eligibility just to improve output counts.

Do not give every item every clarity. Clarity should be honest, but it is now a
soft influence, so it no longer needs to be inflated to keep items eligible.

Do not give every item secondary pace. Secondary pace should mean "this is a
credible alternate way to fish the item," not "make selection easier."

### Acceptance Tests

Add or update tests for:

- `secondary_pace` may not duplicate `primary_pace`.
- `secondary_pace`, when present, must be adjacent to `primary_pace`.
- surface fly rules still hold.
- `presentation_group` exists and is valid.
- all closed ID sets still match catalog contents.

## Pass 6: Thin Catalog Audit

### Goal

Only after selection and row truth are improved, audit thin pools.

At that point, a thin pool should mean the app genuinely lacks enough honest
inventory, not that selector rules over-filtered it.

### New Audit Script

Create a new script:

```text
scripts/audit-recommender-rebuild-pool-health.ts
```

It should run representative cells across:

- all supported species
- all authored regions
- all months
- all valid water types
- three clarity states
- three daily regimes
- calm, breezy, and windy surface states where relevant

For each cell, report:

- target profiles
- lure candidate count by slot before weighted choice
- fly candidate count by slot before weighted choice
- chosen lure ids
- chosen fly ids
- presentation groups used
- family groups used
- repeated presentation groups
- fewer-than-3 outputs
- zero-output side

Write output to:

```text
docs/audits/recommender-rebuild/pool-health-report.md
docs/audits/recommender-rebuild/pool-health-report.json
```

### Metrics To Track

Track globally and per species/region/water type:

- percent of cells with 3 lure picks
- percent of cells with 3 fly picks
- percent of cells with fewer than 3 lure picks
- percent of cells with fewer than 3 fly picks
- repeated presentation group rate
- repeated exact family group rate
- repeated exact same top pick across adjacent dates
- topwater variety rate when surface is open
- frog exposure rate in Florida/Gulf/Southeast LMB warm-season lake rows

### Acceptance Criteria

Do not require 100% 3:3 if honest inventory is thin.

Do require:

- No zero-output lure side in supported mainstream bass/pike contexts unless a
  row is intentionally documented as thin.
- No zero-output fly side in supported mainstream warmwater contexts unless
  documented.
- Frog exposure appears in warm-season southern LMB lake surface contexts.
- Repeated presentation groups are rare when alternatives exist.
- Thin cells are documented as either row authoring issue, catalog gap, or
  honest inventory limit.

## Pass 7: Repetition And Variety Regression Suite

### Goal

Lock the new behavior so future tuning does not reintroduce repetition.

### Test File

Create:

```text
supabase/functions/_shared/recommenderEngine/__tests__/rebuildVarietyRegression.test.ts
```

### Required Scenarios

Add tests for:

1. Florida LMB lake/pond, murky water, warm season, aggressive surface-open day:
   topwater candidates include frog options and output can select frog across
   seeded dates.
2. Florida LMB lake/pond warm-season adjacent dates:
   exact same three lure ids should not repeat every day when alternatives
   exist.
3. Florida LMB lake/pond warm-season adjacent dates:
   exact same three fly ids should not repeat every day when alternatives
   exist.
4. Crankbait macro conflict:
   three crankbait presentation groups should not appear together when other
   valid groups exist.
5. Fly streamer macro conflict:
   three baitfish streamer presentation groups should not appear together when
   valid leech/sculpin/surface alternatives exist.
6. Cold winter row:
   if the row honestly has narrow lanes, repeated columns and paces are allowed,
   but repeated presentation groups should still be avoided when alternatives
   exist.
7. Determinism:
   same request twice returns identical output.

### Do Not Snapshot Exact Full Outputs Too Broadly

Avoid brittle full-output snapshots across the entire matrix.

Prefer invariant tests:

- counts
- no duplicate ids
- no avoidable macro repeats
- frog appears over a date-seed sample
- same request deterministic
- different date can rotate
- all picks stay column-valid and species-valid

## Pass 8: Product Copy And UI Sanity Review

### Goal

Make sure the UI still tells the truth after selector behavior changes.

### Files

- `components/fishing/RecommenderView.tsx`
- `lib/recommenderContracts.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/copy.ts`
- `supabase/functions/_shared/recommenderEngine/contracts/output.ts`

### Guidance

The UI may continue showing:

- `family_group` as a fine label
- color style
- column
- pace
- action/presence
- why chosen
- how to fish

Do not expose `presentation_group` unless there is a clear UX reason.

Copy should not overclaim:

- If forage was only a small bonus, do not say the bait was selected primarily
  because of forage.
- If clarity was only a small bonus, do not say clarity dictated the pick.
- Keep copy focused on column, pace, and daily tactical fit.

### Acceptance Tests

Existing response-shape tests should pass.

Add copy tests only if new copy branches are introduced.

## Implementation Checklist

Use this checklist for the full project.

- [ ] Pass 1 adds `presentation_group` to catalog contracts, factories, lures,
      flies, and catalog tests.
- [ ] Pass 2 replaces hard slot narrowing with scored deterministic weighted
      sampling.
- [ ] Pass 2 keeps column strict and pace compatible.
- [ ] Pass 2 demotes forage and clarity to soft influence.
- [ ] Pass 2 uses `presentation_group` as the primary diversity key.
- [ ] Pass 3 converts condition windows into boosts, not hard funnels.
- [ ] Pass 4 audits and repairs seasonal row shortlists, starting with southern
      warm-season LMB surface rows.
- [ ] Pass 4 regenerates seasonal rows from CSVs.
- [ ] Pass 5 audits catalog eligibility and pace/clarity/forage truth.
- [ ] Pass 6 adds pool-health audit output.
- [ ] Pass 7 adds regression tests for repetition, macro diversity, frog
      exposure, and determinism.
- [ ] Pass 8 confirms response shape, copy, and UI remain truthful.

## Recommended Command Gates

Run these after each implementation pass when relevant:

```bash
deno test supabase/functions/_shared/recommenderEngine
npm run check:seasonal-matrix
```

Run these after seasonal CSV edits:

```bash
npm run gen:seasonal-rows-v4
npm run check:seasonal-matrix
npm run audit:eligibility
```

Run the new pool-health audit after Pass 6:

```bash
deno run -A scripts/audit-recommender-rebuild-pool-health.ts
```

## Final Success Definition

The recommender is successful when:

- It still feels deterministic and stable for a user on a given day.
- It no longer feels repetitive across days when valid alternatives exist.
- It gives 3 lure and 3 fly recommendations wherever honest inventory supports
  that target.
- It avoids obvious bad trios such as three crankbaits or three near-identical
  baitfish streamers when alternatives exist.
- It keeps column truth strict.
- It keeps pace important but not brittle.
- It keeps forage, clarity, and daily conditions useful but not overpowering.
- Florida and other southern warm-season largemouth lake contexts produce
  credible frog/topwater opportunities.
- Thin catalogs are identified only after selector and row truth have been
  repaired.

