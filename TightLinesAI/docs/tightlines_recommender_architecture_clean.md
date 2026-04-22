# TightLines AI — Lure & Fly Recommender Architecture Plan

## Context

TightLines AI is a deterministic fishing app.

One existing feature, **How’s Fishing Right Now**, already provides:
- a daily fishing score
- a daily summary
- broad timing guidance
- top and limiting factors
- a presentation-oriented tip

The **Lure & Fly Recommender** is a separate deterministic feature built on top of that daily context. Its job is to recommend **up to 3 lures and up to 3 flies** that make sense for the user’s selected fishing context.

This document defines the rebuilt recommender only. It is the architecture and engine plan for how the recommender should work.

---

## Transition-first implementation

Before implementing the rebuilt recommender, the codebase must be reduced to the smallest set of assets that support this architecture.

Do this **first**.
Do **not** add new seasonal rows, new metadata, or new engine behavior until this transition pass is complete.

### Why this transition exists

This rebuild is not a minor tune-up.
It is a replacement of an overgrown recommender with a simpler deterministic system that must stay accurate across:

- 4 species
- 2 water types, with Trout limited to river
- 18 regions
- 12 months

The goal is a clear codebase with no stale logic, no stale metadata, no hidden fallbacks, and no duplicated recommender systems.
The implementing agent should assume that clarity and correctness are more important than preserving old behavior.

### Current runtime context (post cutover)

The **live** recommender path is the deterministic rebuild:
- `supabase/functions/recommender/index.ts` → `runRecommenderRebuildSurface` → `supabase/functions/_shared/recommenderEngine/rebuild/**`
- Seasonal rows are generated from `data/seasonal-matrix/*.csv` (Phase 2–4 pipeline).

Legacy v3 (`runRecommenderV3`, `runRecommenderV3Surface`, `v3/**`) remains for offline audits, calibration scripts, and regression tests — import via `recommenderEngine/legacyV3.ts`, not the Edge function.

The `recommenderEngine/v4/**` subtree supplies catalogs, generated seasonal TS, and an experimental alternate engine used by tooling and tests; production consumes the rebuild path above.

The rebuild must not preserve two competing recommender engines long-term.
The end state should be **one** clear runtime path and **one** clear authoring system.

### Final source-of-truth rule

The implementing agent should treat these as the intended durable sources of truth:

- seasonal rows are authored from `data/seasonal-matrix/*.csv`
- item catalog data comes from the selected archetype catalog files kept for the rebuild
- the live runtime must ultimately point to one rebuilt recommender engine path only

If any older file, runtime path, or metadata system disagrees with these sources of truth, the older system should be removed, deprecated, or ignored.

### Keep as source of truth

These assets should be preserved because they align with the simplified deterministic architecture:

- `supabase/functions/recommender/index.ts` for the API boundary, auth, subscription gating, and input validation
- shared How's Fishing context analysis and region resolution for the upstream daily context and geography source of truth
- `supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts` and generated client gating output for state × species × water-type availability
- `data/seasonal-matrix/*.csv` and `data/seasonal-matrix/schema.md` as the preferred seasonal-row authoring source
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts` and `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts` as the best current archetype catalog base
- `lib/recommender.ts`, `lib/recommenderContracts.ts`, image maps, and UI rendering surfaces as the stable app integration layer

### Keep but simplify or adapt

These assets are useful, but should be narrowed to match this architecture instead of copied forward blindly:

- the CSV-to-generated seasonal-row pipeline, consistency checks, and related CI workflow
- the authoring audits for coverage, eligibility, and catalog gaps
- the current deterministic caching and response-shaping surfaces
- color logic as a separate downstream concern, not a driver of biological recommendation logic
- existing v4 tests and diagnostics as validation tooling, not as proof that the current engine design should be preserved as-is

### Delete, deprecate, or ignore

These areas represent the exact kinds of complexity this rebuild is trying to remove:

- the legacy v3 scoring engine, tuning logic, and selection tournament behavior
- region fallback logic in seasonal resolution
- state-scoped seasonal overrides and state scoring adjustments
- hidden second-pass diversity bonuses, coherence bonuses, and rescue/fallback pick behavior
- duplicated recommender plans, v3 audit artifacts, and v3-only scripts that document or tune the old weighted system
- any long-term plan that keeps both the old runtime and the rebuilt runtime alive in parallel

### Hard transition rules

The future implementing agent should treat these as non-negotiable:

- No seasonal row fallbacks
- No runtime borrowing from another region
- No state-scoped seasonal override layer
- No weighted scoring ladder
- No hidden second-pass tournament logic for top-3 selection
- No bloated item metadata beyond what this architecture requires
- No new exception systems added to rescue weak authoring
- No stale recommender code or stale recommender metadata left behind after cutover

### Implementation phases

The rebuild should happen in this order:

1. **Transition pass**
   - remove, deprecate, or ignore old recommender complexity
   - confirm the final runtime path and final authoring source of truth
   - **Exit criteria:** one intended runtime path is chosen, one intended authoring system is chosen, and obsolete recommender logic is clearly identified for removal
2. **Seasonal row accuracy and completeness**
   - audit every supported `species + region + month + water type` context
   - ensure every row is authored and biologically sensible
   - deeply evaluate month-by-month regional biology, especially column ranges, column anchors, pace ranges, and pace anchors
   - **Exit criteria:** every supported context has exactly one biologically trusted row and zero fallback rows
3. **Species-specific biological eligibility review**
   - audit every lure and fly for honest species, month, water-type, regional, and seasonal suitability where biologically necessary
   - remove any eligibility that exists only to inflate pools
   - **Exit criteria:** item eligibility is biologically honest and no longer padded to create artificial pool size
4. **Per-context inventory sufficiency review**
   - measure whether each supported context can produce 3 lures and 3 flies from honest eligible inventory
   - identify real catalog gaps instead of patching them with logic creep
   - if a context honestly supports fewer than 3 lures or fewer than 3 flies, the engine should return only the eligible count rather than inventing or relaxing recommendations
   - **Exit criteria:** supported contexts have an explicit honest inventory expectation, and any thin contexts are documented without adding rescue logic
5. **Engine implementation**
   - implement the rebuilt deterministic engine only after the transition and biological audits are complete
   - do not add logic to compensate for weak rows or inflated eligibility
   - **Exit criteria:** the engine matches this architecture, is deterministic, and contains no fallback, rescue, or weighted-scoring creep
6. **Final validation and runtime cutover**
   - confirm deterministic output and supported-context coverage
   - wire the rebuilt engine into the live recommender path
   - remove any stale recommender code that is no longer referenced
   - **Exit criteria:** the live recommender uses only the rebuilt path and stale recommender code/metadata are removed or deprecated

### Phase dependency rule

These phases are sequential and should not be collapsed together.

- Do not implement final recommendation logic before seasonal rows are accurate.
- Do not judge inventory sufficiency before species-specific eligibility is tightened.
- Do not add rescue logic to compensate for missing rows, weak biology, or thin inventory.
- If inventory is honestly thin, return fewer recommendations rather than inventing biological fit.
- Fix data truth first, then implement engine behavior.

### First audit questions for the implementing agent

Before writing or deleting engine code, answer these questions:

- What current recommender code is only preserving v3 scoring complexity and should be removed?
- What current data and catalog assets are strong enough to keep as authoring inputs?
- Where does the current system still rely on fallback behavior, relaxed selection, or hidden rescue logic?
- Which supported contexts are biologically under-authored?
- Which seasonal rows are present but not biologically trustworthy enough to keep unchanged?
- Which contexts cannot honestly produce 3 lures and 3 flies with the current catalog?
- Which lure and fly eligibility tags are too broad for a clean deterministic system?

---

## Recommender goals

The recommender must be:

- deterministic
- biologically sensible
- simple and maintainable
- believable to anglers
- flexible enough to work across supported contexts without becoming messy

It should use:
- **seasonal context** as the backbone
- **daily regime** as the day-level shaper
- **bounded deterministic variety** instead of loose randomness

---

## Scope

### Species in scope
- Largemouth Bass
- Smallmouth Bass
- Pike
- Trout

### Water types in scope
- lake/pond
- river

### Additional scope rules
- Supported runtime matrix:
  - Largemouth Bass: lake/pond and river
  - Smallmouth Bass: lake/pond and river
  - Pike: lake/pond and river
  - Trout: river only
- Any context outside that matrix is invalid and should not be handled through fallback logic
- Trout is **river-only**
- Fly recommendations are limited to **streamers** and **topwater flies**
- Color logic remains separate and is not redesigned inside this engine

---

## Core architecture

The recommender works in four layers:

### 1. Inputs layer
This layer resolves the recommendation context.

Inputs:
- species
- water type
- water clarity
- user location
- month
- daily score from How’s Fishing
- color theme from existing logic

This layer does not choose items. It only resolves context.

### 2. Seasonal context layer
This layer loads the biological seasonal envelope for the current context.

It defines:
- legal water-column range
- column anchor
- legal pace range
- pace anchor
- whether surface is seasonally allowed
- primary forage
- optional secondary forage

This is the core seasonal biology layer.

### 3. Daily shaping layer
This layer takes the seasonal row and shapes it for the specific day.

It uses:
- daily regime
- wind-based surface block
- anchor-based shaping rules

Its output is the day’s **top 3 target profiles**.

A target profile is a pair like:
- upper / fast
- mid / medium
- bottom / slow

### 4. Item selection layer
This layer takes the target profiles and selects real lures and flies.

It uses:
- hard gating
- exact slot fit (strict column + pace)
- family diversity
- forage alignment when possible
- deterministic seeded tie-breaking

This layer does not change the biology. It only fills the profiles with actual items.

---

## Geography model

### Runtime geography
The recommender uses the existing **How’s Fishing region system** as the upstream geography source of truth.

Runtime seasonal lookup grain:
- species
- region
- month
- water type

### Authoring model
Seasonal rows remain **region-authored**.

Maintainability comes from **template-sharing at the authoring layer**, not from collapsing regions into a smaller runtime band system.

That means:
- runtime remains region-resolved
- seasonal rows remain region-authored
- template-sharing is only a way to reduce duplicate authoring where biology is truly identical

It must not flatten meaningful region differences.

---

## Item profile model

Each lure and fly should have a lean profile.

### Required fields
Each item defines:
- `id`
- `name`
- `side` (`lure` or `fly`)
- `family`
- `speciesAllowed`
- `waterTypesAllowed`
- `column`
- `pacePrimary`
- optional `paceSecondary`
- `forageTags`
- `isTopwater`

### Hard profile rules
- Every item has exactly **one canonical column**
- Every item has exactly **one primary pace**
- `paceSecondary` is allowed only when it is genuinely justified, adjacent to the primary pace, and should be rare
- No multi-column items
- No all-three-pace items

### Allowed columns
- bottom
- mid
- upper
- surface

### Allowed paces
- slow
- medium
- fast

### Coarse forage tags
Use the preserved coarse taxonomy:
- baitfish
- crawfish
- bluegill_perch
- leech_worm
- surface_prey

Important:
- `surface_prey` is primarily an **item-level** tag
- it is not a seasonal-row forage value

---

## Seasonal row model

Each seasonal row defines the biological seasonal envelope for one context.

### Row grain
One row exists per:
- species
- region
- month
- water type

### Each row defines
- `column_range`
- `column_baseline`
- `pace_range`
- `pace_baseline`
- `surface_seasonally_possible`
- `primary_forage`
- optional `secondary_forage`
- `primary_lure_ids`
- `primary_fly_ids`
- optional `excluded_lure_ids`
- optional `excluded_fly_ids`

Implementation note:
- `column_range` is the legal seasonal column set
- `column_baseline` is the neutral center-of-gravity column for shaping
- `pace_range` is the legal seasonal pace set
- `pace_baseline` is the neutral center-of-gravity pace for shaping

### Seasonal row rules
- `column_baseline` must be inside the legal column range
- `column_baseline` must never be `surface`
- `pace_baseline` must be inside the legal pace range
- `bottom` must remain inside every legal column range
- `slow` must remain inside every legal pace range
- `primary_forage` must not equal `secondary_forage`
- `surface_prey` is not used as a seasonal-row forage value
- `primary_lure_ids` and `primary_fly_ids` are row-authored shortlist bindings, not optional decoration
- `excluded_*` fields should be rare and only used when they remove a biologically contradictory item that would otherwise pass catalog gating

### Coverage rule
Every supported runtime context must have an authored seasonal row.

That means one valid row must exist for every supported:
- species
- region
- month
- water type

No fallback seasonal rows are allowed.
Missing coverage is invalid data, not a runtime case.

### Validation requirements
The seasonal dataset must be machine-validatable.

At minimum, validation must confirm:
- full supported-context coverage
- no fallback rows
- `column_baseline` is inside range and is not `surface`
- `pace_baseline` is inside range
- `paceSecondary`, when present on an item, is adjacent to `pacePrimary`
- `primary_forage` does not equal `secondary_forage`
- row-authored primary/excluded ids only reference valid catalog ids for that side

---

## Seasonal authorship principles

Seasonal rows are biological claims, not filler data.

### Core rules
- Biology first, inventory second
- Narrow when honest, wide when honest
- The baseline is the neutral center of gravity
- Adjacent months may legitimately share values
- Real region differences must be preserved
- Do not widen rows just to give the engine more options
- Wide summer rows are acceptable when they are biologically honest
- Each row should be authored as a deliberate month-level biological claim, not copied forward by default
- Column ranges, column anchors, pace ranges, and pace anchors must be deeply considered for each supported row

### Water-type rule
Lake/pond and river rows are authored separately.
They are not flattened together for convenience.

### Template-sharing rule
Templates should only be used when rows express the same biological claim.
Template-sharing is a deduplication tool, not a disguised geography abstraction.

---

## Daily regime model

The daily regime comes from the How’s Fishing score.

- **suppressive** if score <= 3.5 on the How's Fishing 1-10 scale
- **aggressive** if score >= 7.0 on the How's Fishing 1-10 scale
- **neutral** otherwise

Implementation note:
The live rebuild receives the How's Fishing score on a 10-100 scale and converts it back to the 1-10 thresholds above before assigning the regime.

The regime does not replace seasonal logic.
It shapes the day relative to the seasonal anchors.

### Regime meaning
- **aggressive** = bias shallower / more active within legal bounds
- **neutral** = center around the seasonal anchors
- **suppressive** = bias deeper / more restrained within legal bounds

---

## Column shaping logic

Columns are ordered:

- bottom
- mid
- upper
- surface

Bottom is the permanent depth floor and should effectively never be removed from play.
Daily shaping can only move **upward** from the legal seasonal floor and back down within legal bounds.

### Neutral day
- Rank 1 = anchor
- Rank 2 = one step shallower than anchor if legal
- Rank 3 = one step deeper than anchor if legal, otherwise deepest legal

### Aggressive day
- Rank 1 = highest legal active column
- Rank 2 = effective anchor
- Rank 3 = one step deeper than anchor if legal, otherwise anchor

### Suppressive day
- Rank 1 = one step deeper than anchor if legal, otherwise anchor
- Rank 2 = deepest legal column
- Rank 3 = anchor

### Narrow rows
If the legal column range is narrow, repeated column targets are allowed.
Do not invent illegal columns for visual variety.

---

## Pace shaping logic

Paces are ordered:

- slow
- medium
- fast

Slow is the permanent pace floor and should effectively never be removed from play.
Daily shaping can only move **upward** from the legal seasonal floor and back down within legal bounds.

### If pace anchor = fast
- Aggressive: fast, fast, medium
- Neutral: fast, medium, medium
- Suppressive: medium, medium, medium

### If pace anchor = medium
- Aggressive: fast, medium, medium
- Neutral: medium, medium, medium
- Suppressive: medium, slow, medium

### If pace anchor = slow
- Aggressive: medium, slow, slow
- Neutral: slow, slow, slow
- Suppressive: slow, slow, slow

### Narrow pace rows
If only one pace is legal, repeated pace targets are allowed.
Do not invent illegal pace values for visual variety.

---

## Wind and surface-block rule

### Wind metric
Use **mean wind from 5:00 AM to 9:00 PM local time**.

Implementation note:
The live rebuild computes this from the hourly wind grid when available and otherwise falls back to the daily wind value after unit normalization.

### Surface block threshold
If `surface` is inside the legal seasonal column range and mean wind from 5:00 AM to 9:00 PM is **greater than 14 mph**:
- `surfaceBlocked = true`

### Effect of surfaceBlocked
When surface is blocked:
- remove `surface` from the effective day-legal column set
- block all surface/topwater recommendations

Because the seasonal column anchor can never be `surface`, no special anchor demotion rule is needed.
The engine simply regenerates the ranked day columns from the remaining legal non-surface range.
In practice, that means the engine naturally drops from `surface` to `upper` if legal, otherwise `mid`, otherwise `bottom`.

### Important distinction
- `surfaceSeasonAllowed` is a **seasonal biological rule**
- `surfaceBlocked` is a **day-level execution rule**

Do not rewrite the seasonal row because one day is windy.

### Wind does not reshape pace
In v1, wind affects:
- column legality
- topwater eligibility

It does **not** independently reshape pace logic.

---

## Final target-profile generation

The daily shaping layer generates one ranked list of 3 columns and one ranked list of 3 paces.
The final target profiles are created by pairing those lists **by rank position**, not by cross-product.

Examples:
- upper / fast
- surface / medium
- mid / medium

This happens before item selection.

The engine thinks in profiles first, items second.

---

## Item selection logic

Item selection happens separately for:
- lures
- flies

### Hard gating
Filter candidates by:
- side
- species eligibility
- water-type eligibility
- topwater block
- row-authored primary shortlist membership (`primary_lure_ids` / `primary_fly_ids`)
- any row-authored exclusions that still remain after catalog tightening

Note: `clarity_strengths` is **not** a hard gate. It is a soft ranking preference applied during per-slot selection (see "Exact slot fit" below) — candidates remain eligible regardless of today's clarity, but clarity-matching items receive a small ranking bonus.

### Exact slot fit (strict column + pace)
Do not choose loosely from the full legal pool or from “nearby” lanes.

For each slot’s target profile (e.g. `upper / fast`), a candidate may fill that slot only if:

- its **column** equals the profile column exactly, and
- the profile **pace** matches either `primary_pace` or `secondary_pace` on that item (secondary must be an exact match to the slot pace — not adjacent).

Candidates must still sit inside the seasonal envelope (`column_range` / `pace_range` on the row) as enforced before slot matching.

If no candidate satisfies a given slot exactly on that side, **skip that slot** and **continue** to the next ranked profile slot. Returned picks are only exact fits; each recommendation card carries the **target profile (pace/presence) of the slot it actually filled**, so lure and fly lists can be shorter than three and may omit earlier slots when that side has no inventory for them. Do not fall back to adjacent column, adjacent pace, or any other in-envelope-only rescue.

Important:
- Slot matching happens only inside the hard-gated shortlist for that row and side
- The live rebuild does **not** scan the full catalog at runtime
- Lure and fly sides share the same three target profiles, but each side fills slots independently — counts may differ if one side has fewer exact-fit items

### Variety inside the exact-fit pool
Among candidates that satisfy the slot exactly, prefer:

1. forage alignment, if useful and available
2. family diversity
3. deterministic seeded rotation / tie-breaking

When both primary and secondary match the slot pace, prefer the **primary pace** match as the tighter fit (implementation ranks that ahead of secondary-only).

The engine should not randomly choose from all legal items.

---

## Diversity and collapsed-target handling

### Duplicate item rule
Do not return the same exact item twice on the same side.

### Family diversity rule
If multiple candidates fit, prefer different families when possible.

### Collapsed target rule
If a narrow seasonal row or wind block causes repeated target profiles, that is acceptable.

Examples:
- bottom / slow
- bottom / slow
- bottom / slow

This is not a bug if the seasonal biology truly supports it.

### Diversity comes from inventory, not fake profiles
When targets collapse:
- keep the repeated target profiles
- create variety through different families and items
- do not invent illegal columns or paces just to make the output look different

### Honest thin-inventory rule
If a side cannot honestly fill all 3 target profiles from the eligible pool:
- return only the eligible count
- do not invent biological fit
- do not widen seasonal envelopes
- do not broaden item eligibility
- do not add rescue or fallback picks

---

## Forage logic

### Seasonal forage
Each seasonal row carries:
- primary forage
- optional secondary forage

### Item forage tags
Each item may carry 1–2 coarse forage tags.

### Recommendation rule
At least one recommendation per side should align with the row’s seasonal forage **if an eligible match exists**.

This is an alignment rule.
It must not override hard gating or biological fit.

---

## Current runtime output

The live rebuild returns a stable app-facing response through `runRecommenderRebuildSurface`.

### Session-level summary currently exposed
- species
- water type
- water clarity
- monthly primary forage
- optional monthly secondary forage
- session color theme label
- legal seasonal columns / paces
- surface seasonality flag
- current daily preference:
  - posture band
  - preferred column / pace / presence
  - optional secondary column / pace / presence
  - surface open / closed today
  - opportunity mix

### Per recommendation currently exposed
- item id
- display name
- family group
- session color style
- why chosen
- how to fish
- item-authored column
- engine-selected pace
- engine-derived presence
- surface flag
- optional `source_slot_index` (0–2): which shared daily tactical **profile slot** this pick satisfied when the rebuild engine filled that slot (present on rebuild responses; omitted on legacy v3 surfaces)

Important:
- displayed `column` reflects the item's authored profile
- displayed `pace` reflects the pace the engine selected for that slot
- displayed `presence` is derived from that selected pace

### Thin lists and presentation order
Recommendation arrays contain **only real picks** (no padding). The client may show medals **Gold / Silver / Bronze** by **array order** (first pick = Gold, …) so short lists never leave a visual “hole” where an earlier slot had no item. When a pick satisfied a **later** tactical slot because earlier slots had no eligible item on that side, `source_slot_index` preserves that fact; the app may surface it subtly (e.g. “Daily slot 3 of 3”) without changing medal order or per-card pace/column truth.

### Missing seasonal row behavior
If a gated runtime request has no authored seasonal row for its exact:
- species
- region
- month
- water type

the live Edge function returns:
- HTTP `422`
- error code `seasonal_row_missing`

This is intentional and distinct from a generic engine failure.

---

## Deterministic variety

The recommender should not feel robotic, but it must remain trustworthy.

Use deterministic seeded tie-breaking or bounded shortlist rotation so that:
- the same context on the same day is stable
- outputs are not loose or random
- variety happens inside believable bounds

---

## Simplicity rules for v1

Do **not** add:
- multi-column item profiles
- bloated metadata
- item-level weather scoring
- a second scoring engine
- a growing web of item-specific special rules
- a new geography abstraction layered on top of the How’s Fishing regions

Beyond the wind / surface block rule, v1 should stay disciplined and simple.

---

## Summary

The rebuilt recommender works like this:

1. Resolve user context and How’s Fishing outputs
2. Resolve the current How’s Fishing region
3. Load the region-authored seasonal row for the current species, month, and water type
4. Apply daily regime and wind-based surface blocking
5. Generate the day’s top 3 target profiles
6. Select actual lure and fly items from best-fit shortlists
7. Preserve variety through deterministic bounded selection and family diversity
8. Return up to 3 lures and up to 3 flies that remain believable, explainable, and cleanly architected, including fewer when inventory is honestly thin

This is the recommender architecture and engine plan.
