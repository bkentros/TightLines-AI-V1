# TightLines AI — Lure and Fly Recommender Architecture Plan

## 1. Context

TightLines AI is a deterministic fishing app. One of its existing core features is **How’s Fishing Right Now**, a daily outlook engine that determines:

- daily score
- summary
- broad time recommendation
- top factors
- limiting factors
- tip of the day

That engine already exists and is the source of the app’s daily fishing read.

The app also has a **Lure and Fly Recommender** feature. Its purpose is to recommend **3 lures** and **3 flies** for the user’s day based on context such as species, water type, clarity, season, geography, and daily fishing conditions. Over multiple iterations, that recommender became too complex, too messy, and too difficult to reason about.

This document defines the **rebuilt lure and fly recommender**. It is not a cleanup memo and it is not an implementation task list. It is the source-of-truth description of the recommender that should be built going forward.

The rebuild must produce a recommender that is:

- deterministic
- biologically sensible
- simple enough to maintain
- architecturally clean
- reliable across supported contexts
- varied enough to avoid feeling robotic
- narrow enough to avoid over-engineering again

---

## 2. Purpose of This Document

This document defines:

- what the rebuilt lure and fly recommender is
- what it takes as input
- how it should be structured architecturally
- what data models it should use
- how seasonality should be authored
- how daily regime should shape recommendations
- how wind should affect surface/topwater recommendations
- how actual lures and flies should be selected
- what is intentionally excluded from v1

The goal is for this document to describe the recommender itself as clearly and completely as possible.

---

## 3. Recommender Goals

The rebuilt recommender must satisfy all of the following:

### 3.1 Deterministic
The engine must not guess. It must operate from authored data and simple deterministic logic.

### 3.2 Biologically sensible
Recommendations must make fishing sense for the selected species, season, geography, water type, and daily regime.

### 3.3 Simpler than prior versions
The architecture must avoid becoming a giant web of conditions, metadata, exceptions, and item-specific scoring branches.

### 3.4 Stable and explainable
The system should be easy to explain in plain English. If the logic becomes hard to explain, the design is probably becoming too complex.

### 3.5 Varied, but not sloppy
The same engine should not always return the exact same items when multiple equally strong fits exist, but variety must be bounded inside deterministic rules.

### 3.6 Config-driven
The engine should be driven primarily by:
- item profiles
- seasonal context rows
- simple shaping rules
- simple selection rules

### 3.7 Easy to test
Narrow ranges, broad ranges, blocked surface scenarios, repeated target profiles, and sparse candidate pools must all be testable.

---

## 4. Scope and Hard Constraints

### 4.1 Species in scope
- Largemouth Bass (`LMB`)
- Smallmouth Bass (`SMB`)
- Pike (`Pike`)
- Trout (`Trout`)

### 4.2 Water types in scope
- `lake_pond`
- `river`

### 4.3 Trout scope
Trout is **river-only** for now. Trout must not be recommended for lake/pond contexts in this version.

### 4.4 Fly scope
The fly side is limited to:
- streamers
- topwater flies such as poppers

Do not design around:
- dries
- nymphs
- euro concepts
- hatch-matching systems

### 4.5 Inventory assumptions
The current inventory is approximately:
- ~35 lures
- ~25 flies

The new engine should assume the inventory is finite and practical. It should not require an enormous catalog to work.

### 4.6 Color logic
Color logic is considered separate and already sufficiently handled elsewhere.

Light/cloud cover plus water clarity determines a color theme such as:
- dark
- natural
- bright

The recommender should consume color output or a color theme input, but should not reinvent the color system.

### 4.7 Daily regime source
Daily regime comes from **How’s Fishing Right Now**, using the existing daily score logic:

- `<= 3.5` = `suppressive`
- `>= 7.0` = `aggressive`
- otherwise = `neutral`

The recommender should use that regime, not independently compute its own regime.

---

## 5. Clean Architecture Overview

The rebuilt recommender should follow a clean layered architecture. Each layer should have a narrow responsibility and should not bleed its job into another layer.

### 5.1 Why this matters
The old recommender direction became overly tangled because too many concerns lived in the same place. Seasonal logic, item logic, daily weather interpretation, exceptions, and selection behavior became mixed together.

The rebuilt version should separate those concerns.

### 5.2 Recommended layers

#### Layer 1 — Inputs Layer
This layer resolves the raw context for the recommendation request.

It includes:
- selected species
- selected water type
- selected water clarity
- user location
- current month
- daily outputs from How’s Fishing

This layer does not choose lures or flies.

#### Layer 2 — Geography and Seasonal Context Layer
This layer resolves the user’s location into the recommender’s seasonal world.

It should:
- receive the resolved **How’s Fishing region**
- map that region to a smaller **recommender band**
- apply sparse region overrides if needed
- load the authored seasonal row for:
  - species
  - band
  - month
  - water type

This layer defines the **seasonal biological envelope**.

#### Layer 3 — Daily Shaping Layer
This layer takes the seasonal row and daily regime and turns them into **3 target profile slots**.

It should determine targets such as:
- `upper / fast`
- `mid / medium`
- `bottom / slow`

This layer should not know or care whether the actual item is a spinnerbait, jerkbait, clouser, sculpin streamer, and so on. It only shapes daily target profiles.

#### Layer 4 — Inventory Matching Layer
This layer selects actual lures and flies that best match the target profiles.

It should use:
- hard eligibility gates
- profile fit tiers
- forage alignment if possible
- family diversity
- deterministic tie-breaking

This layer should not alter seasonal biology or regime shaping.

#### Layer 5 — Output Layer
This layer returns:
- 3 lures
- 3 flies
- color theme if applicable
- any internal reasoning payload needed for UI or explanation

This layer should not recalculate engine logic.

### 5.3 Clean boundaries
The architecture should preserve these boundaries:

- **seasonality** should define what is plausible
- **daily shaping** should define what the day emphasizes
- **inventory matching** should define which actual items best fit those targets
- **presentation** should only render results

This separation is the main protection against over-engineering.

---

## 6. Inputs to the Recommender

The recommender should consume a clean daily input object that represents only what it needs.

### 6.1 Core request inputs
- `species`
- `waterType`
- `waterClarity`
- `userLocation`
- `currentMonth`

### 6.2 Daily engine inputs from How’s Fishing
- `resolvedRegionId`
- `dailyScore`
- `regime`
- `colorTheme`

### 6.3 Optional internal input fields
Depending on implementation, it may also be useful for the recommender request object to include:
- local date
- seed source for deterministic tie-breaking
- any band override already resolved upstream

### 6.4 What the recommender should not do
The recommender should not independently:
- resolve geography from scratch if How’s Fishing already did so
- recompute regime from raw weather
- rebuild the color system
- create a second independent daily-conditions interpretation system

---

## 7. Geography and Region-to-Band Model

### 7.1 Source of truth
The **How’s Fishing region system remains the source of truth** for region resolution.

The recommender must not invent its own separate geography resolver.

### 7.2 High-level geography flow
The correct geography flow is:

1. user location resolves to the existing How’s Fishing region
2. How’s Fishing continues using that region for daily scoring
3. the recommender receives that resolved region
4. the recommender maps that region to a smaller **recommender band**
5. the recommender uses the band for seasonal rows

### 7.3 Why this is the preferred structure
This achieves both goals:
- it preserves current How’s Fishing scoring accuracy and geography behavior
- it simplifies seasonal authorship for the recommender

### 7.4 Band philosophy
The recommender should likely use fewer bands than the raw How’s Fishing region count, because the seasonal behavior model does not need the same level of direct weather-resolution granularity.

However, the band system must not be so coarse that it wipes out meaningful seasonal differences.

### 7.5 Sparse region overrides
The recommender should support **band defaults plus sparse region overrides**.

This means:
- most regions can map cleanly into bands
- some specific regions may override a default seasonal row if needed

This keeps the authored table set smaller while still allowing important exceptions.

### 7.6 Important implementation principle
Changing the recommender to use bands does **not** mean changing the How’s Fishing scoring regions.

The recommender should always remain downstream of the existing How’s Fishing region resolution.

---

## 8. Core Engine Concept

The rebuilt recommender should be driven by three core authored systems:

1. **item profiles**
2. **seasonal context rows**
3. **small deterministic daily shaping rules**

The engine should not store fully authored final recommendations for every possible combination. It should instead:

1. load the seasonal context row
2. derive the day’s target profiles from the seasonal row + regime
3. select actual items that best fit those profiles

This is simpler, cleaner, and more stable than trying to author full ranked item lists for every combination.

---

## 9. Item Profile Model

Each lure and fly should have a lean, explicit profile.

### 9.1 Item types

```ts
export type Species = 'LMB' | 'SMB' | 'Pike' | 'Trout'
export type WaterType = 'lake_pond' | 'river'
export type Column = 'bottom' | 'mid' | 'upper' | 'surface'
export type Pace = 'slow' | 'medium' | 'fast'
export type Side = 'lure' | 'fly'

export type ForageTag =
  | 'baitfish'
  | 'crawfish'
  | 'bluegill'
  | 'perch'
  | 'frog_mouse'
  | 'sculpin'
  | 'leech'
```

### 9.2 Item profile shape

```ts
export type ItemProfile = {
  id: string
  name: string
  side: Side
  family: string

  speciesAllowed: Species[]
  waterTypesAllowed: WaterType[]

  column: Column
  pacePrimary: Pace
  paceSecondary?: Pace

  forageTags: ForageTag[]

  isTopwater: boolean
}
```

### 9.3 Required profile rules

#### Rule A — one canonical column
Each item must have exactly **one** canonical water column.

Do not allow:
- multi-column items
- split column profiles
- “sometimes upper, sometimes mid” base definitions

Any flexibility should be handled later by fit tiers and fallback logic, not by bloating the base profile.

#### Rule B — pace is singular by default
Each item should usually have exactly **one** pace.

Some items may have a second pace only if that truly reflects how they are commonly fished.

#### Rule C — paceSecondary must be tightly constrained
If `paceSecondary` exists:
- it must be adjacent to `pacePrimary`
- allowed adjacency is only:
  - `slow <-> medium`
  - `medium <-> fast`
- no item may have all three pace values

#### Rule D — family is required
Each item must include a `family`.

This exists so the recommender can avoid repetitive outputs within the same side.

#### Rule E — metadata should stay lean
Do not preserve legacy metadata unless it directly helps the new architecture.

The item profile should only contain what the recommender truly needs.

---

## 10. Seasonal Context Row Model

The engine needs one seasonal row per:

- species
- recommender band
- month
- water type

### 10.1 Seasonal row shape

```ts
export type SeasonalContextRow = {
  species: Species
  bandId: string
  month: 1|2|3|4|5|6|7|8|9|10|11|12
  waterType: WaterType

  columnMin: Column
  columnMax: Column
  columnAnchor: Column

  paceMin: Pace
  paceMax: Pace
  paceAnchor: Pace

  primaryForage: ForageTag | null
  secondaryForage: ForageTag | null

  surfaceSeasonAllowed: boolean
}
```

### 10.2 Why ranges alone are not enough
A seasonal row such as:

- `column: bottom -> surface`
- `pace: slow -> fast`

does not tell the engine where the center of gravity lives for a normal day.

That is why anchors are required.

### 10.3 What the anchors mean
- `columnAnchor` = the neutral seasonal depth center
- `paceAnchor` = the neutral seasonal speed center

They are not final recommendations by themselves. They are the stable seasonal center that daily regime logic shifts around.

---

## 11. Seasonal Authorship Standard

This is one of the most important parts of the entire recommender design.

### 11.1 Seasonal rows must be authored thoughtfully
Seasonal rows must not be filled mechanically, casually, or just to complete a table.

For each combination of:
- species
- band
- month
- water type

the following must be thought through deeply so that they make biological and fishing sense:

- allowed column range
- column anchor
- allowed pace range
- pace anchor
- primary forage
- secondary forage
- whether surface should be seasonally allowed

### 11.2 Biological authorship is required
Every seasonal row should make sense to a serious angler in context.

That means the row should reflect a real seasonal interpretation of:

- where fish are likely to be positioned
- how active or restrained they tend to be
- whether they can reasonably be targeted up high or on top
- what forage is most relevant
- how water type changes the picture

### 11.3 Avoid fake precision
Every month must be reviewed individually, but adjacent months do **not** need to be forced into artificial differences.

It is acceptable for two adjacent months to share the same structure if that honestly reflects the fishery context.

The goal is not to make every row look different.
The goal is to make every row make sense.

### 11.4 Use archetypes first, then customize
The best authorship approach is:

1. define a small number of seasonal behavior archetypes per species and water type
2. map each band/month context to one of those archetypes
3. customize anchors, forage, and surface allowance where needed

This helps prevent both:
- random table filling
- total table chaos

### 11.5 The same standard applies to inventory authorship
The same depth of thinking should also apply to item eligibility and tagging.

The following must make fishing sense:
- which lures are eligible for each species
- which flies are eligible for each species
- which items make sense in lake/pond
- which items make sense in river
- which forage tags each item should carry

Nothing should be marked eligible or tagged casually.

---

## 12. Daily Regime Model

The daily regime comes from How’s Fishing and acts as the primary day-level shaper.

### 12.1 Regimes
- `suppressive`
- `neutral`
- `aggressive`

### 12.2 What regime should do
Regime should shape:
- how shallow or deep the top 3 profiles lean
- how active or restrained the paces lean

Regime should **not** explode into dozens of special item-specific branches.

### 12.3 High-level regime meaning
- **Suppressive** = lean deeper and more restrained
- **Neutral** = stay centered around seasonal anchors
- **Aggressive** = lean shallower and more active, within legal seasonal bounds

---

## 13. Column Shaping Logic

Column shaping determines the 3 daily target columns from:
- the seasonal legal column range
- the column anchor
- the daily regime
- any day-level surface block

### 13.1 Ordered column system
Use this order:

- `bottom = 0`
- `mid = 1`
- `upper = 2`
- `surface = 3`

### 13.2 Legal seasonal column list
The seasonal row defines a legal ordered list from `columnMin` to `columnMax`.

Examples:
- `bottom -> surface` = `[bottom, mid, upper, surface]`
- `bottom -> upper` = `[bottom, mid, upper]`
- `bottom -> mid` = `[bottom, mid]`
- `bottom only` = `[bottom]`

### 13.3 Bottom is always the floor
`bottom` should effectively never be voided from play. It remains the permanent depth floor in the recommendation system.

Even if a row is otherwise compressed or surface is removed, bottom remains the deepest legal fallback.

### 13.4 Neutral column shaping
Neutral should be anchor-centered.

Recommended rule:
- Rank 1 = anchor
- Rank 2 = one step shallower than anchor, if legal
- Rank 3 = one step deeper than anchor, if legal; otherwise deepest legal column

This keeps neutral centered while still producing a top 3 spread where possible.

### 13.5 Suppressive column shaping
Suppressive should bias deeper.

Recommended rule:
- Rank 1 = one step deeper than anchor, if legal; otherwise anchor
- Rank 2 = deepest legal column
- Rank 3 = anchor

This preserves a deeper, more restrained daily shape.

### 13.6 Aggressive column shaping
Aggressive should bias shallower and more active, but it should not blindly force surface to rank 1.

Recommended rule:
- Rank 1 = highest active non-surface legal column
- Rank 2 = surface if legal and not blocked; otherwise highest active legal column or next best legal alternative
- Rank 3 = anchor

This keeps the day aggressive without turning every aggressive pattern into “surface first.”

### 13.7 Narrow-range behavior
The system must support narrow ranges such as:
- `bottom -> mid`
- `bottom only`

If a range is narrow, the shaping logic must clamp to legal values cleanly.

Examples:
- if legal columns are `[bottom]`, all three targets may become `bottom`
- if legal columns are `[bottom, mid]` and anchor is `mid`, neutral may collapse to some combination of `mid` and `bottom`

The engine must never invent illegal columns to force visible variety.

---

## 14. Pace Shaping Logic

Pace shaping determines the 3 daily target paces from:
- the legal seasonal pace range
- the pace anchor
- the daily regime

### 14.1 Ordered pace system
Use this order:

- `slow = 0`
- `medium = 1`
- `fast = 2`

### 14.2 Legal seasonal pace list
The seasonal row defines the legal ordered list from `paceMin` to `paceMax`.

Examples:
- `slow -> fast` = `[slow, medium, fast]`
- `slow -> medium` = `[slow, medium]`
- `slow only` = `[slow]`

### 14.3 Pace templates

#### If pace anchor = `fast`

**Aggressive**
- fast
- fast
- medium

**Neutral**
- fast
- medium
- medium

**Suppressive**
- medium
- medium
- medium

#### If pace anchor = `medium`

**Aggressive**
- fast
- medium
- medium

**Neutral**
- medium
- medium
- medium

**Suppressive**
- medium
- slow
- medium

#### If pace anchor = `slow`

**Aggressive**
- medium
- slow
- slow

**Neutral**
- slow
- slow
- slow

**Suppressive**
- slow
- slow
- slow

### 14.4 Pace clamping
After pace targets are generated, they must be clamped to the legal pace range.

Examples:
- if only `slow` is legal, all pace targets must become `slow`
- if `slow -> medium` is legal, `fast` must never appear

### 14.5 Note on dual-pace items
Dual-pace items do not change the shaping model. They only affect matching in the item-selection layer.

The shaping model should remain simple and based on the seasonal row.

---

## 15. Wind and Surface-Block Logic

This is the only explicit special rule that should exist in v1.

### 15.1 Wind rule
Use **mean wind from 5:00 AM to 9:00 PM local time**.

Do not use:
- gust logic
- “any point in the day”
- complex sustained-window sub-logic

### 15.2 Surface/topwater block threshold
If mean wind from 5:00 AM to 9:00 PM is:

- `> 14 mph`

then:

- all `surface` recommendations are blocked for that day
- all topwater lure/fly recommendations are blocked for that day

### 15.3 Important principle
The seasonal row should remain biologically honest even when the day blocks surface.

That means:
- `surface` may still be seasonally allowed in the authored row
- wind only removes `surface` from the **day’s legal column set**

### 15.4 Surface-block execution rule
When mean wind from 5 AM to 9 PM is `> 14 mph`:

1. set `surfaceBlocked = true`
2. remove `surface` from the day’s legal column list before column target generation
3. if the seasonal anchor was `surface`, demote the day’s effective anchor to the next legal non-surface column
4. generate aggressive / neutral / suppressive targets from this reduced legal column set

### 15.5 Bottom remains in play
Even when surface is blocked, bottom remains the permanent deepest legal fallback.

### 15.6 Regime behavior when surface is blocked

#### Aggressive when surface is blocked
Bias toward the highest remaining legal water:

- Rank 1 = highest remaining legal column
- Rank 2 = effective anchor
- Rank 3 = one step deeper than the effective anchor, if legal; otherwise effective anchor

#### Neutral when surface is blocked
Stay centered, but compress downward if the shallower option disappeared:

- Rank 1 = effective anchor
- Rank 2 = one step shallower than anchor if legal; otherwise one step deeper if legal; otherwise anchor
- Rank 3 = one step deeper than anchor if legal and not already used; otherwise next deeper legal value; otherwise deepest legal value; otherwise anchor

#### Suppressive when surface is blocked
Bias deeper as normal:

- Rank 1 = one step deeper than anchor if legal; otherwise anchor
- Rank 2 = deepest legal column
- Rank 3 = effective anchor

### 15.7 Wind affects columns, not pace
In v1, the wind rule should affect:
- `surface` column legality
- topwater item legality

It should **not** directly alter pace logic.

This keeps the architecture cleaner.

---

## 16. Final Target Profile Generation

The daily shaping layer should combine the column targets and pace targets by rank to create 3 target profiles.

Example:
- Rank 1 = `upper / fast`
- Rank 2 = `surface / medium`
- Rank 3 = `mid / medium`

These are target profiles only. They are not item identities.

The inventory matching layer chooses actual lures and flies after this.

The same target-profile generation logic should be used for:
- lure recommendations
- fly recommendations

The profiles are shared. The inventory pools are different.

---

## 17. Item Selection Logic

Once the 3 target profiles are created, actual items should be selected separately for:
- lures
- flies

### 17.1 Hard gating comes first
For each side, remove any item that fails:

- side
- species eligibility
- water-type eligibility
- trout river-only scope
- surface/topwater wind block
- surface season allowance if relevant

This produces the legal candidate pool.

### 17.2 Best-fit must be tiered
The engine should not choose randomly from the entire legal pool.

Instead, it should rank candidates by fit quality and choose only from the **highest non-empty fit tier**.

### 17.3 Recommended fit tiers

#### Tier 1
- exact column match
- exact `pacePrimary` match

#### Tier 2
- exact column match
- exact `paceSecondary` match

#### Tier 3
- exact column match
- adjacent pace match

#### Tier 4
- adjacent column match
- exact `pacePrimary` match

#### Tier 5
- adjacent column match
- exact `paceSecondary` match or adjacent pace match

#### Tier 6
- any legal item still inside the broader seasonal envelope, only if all higher tiers are empty

### 17.4 Best-fit shortlist principle
The engine should choose from the **highest non-empty tier only**.

That is how the system determines “best fit” without becoming random or sloppy.

### 17.5 Shortlist priorities inside a tier
Inside the selected tier, prefer:

1. a family not already used on that side
2. an item not already used on that side
3. a forage-aligned item if the forage requirement for that side has not yet been satisfied
4. deterministic seeded tie-breaking / bounded rotation

### 17.6 Profile-distance concept
A simple profile-distance value may also be used inside fallback ranking:

- `columnDistance = abs(itemColumnIndex - targetColumnIndex)`
- `paceDistance = abs(itemPaceIndex - targetPaceIndex)`
- `totalDistance = columnDistance + paceDistance`

This can help rank candidates cleanly inside lower tiers or ties.

### 17.7 Engine must never fail on sparse pools
The engine must not fail just because an exact profile match does not exist.

That is why the fallback tiers exist.

---

## 18. Diversity and Collapsed-Target Handling

The recommender should avoid repetitive outputs, but it must do so honestly.

### 18.1 Required diversity rules
Within each side independently:
- no exact duplicate item
- avoid repeating the same family if legal alternatives exist

### 18.2 Narrow rows are allowed to collapse
Some seasonal rows will be narrow, such as:
- `bottom -> mid`
- `bottom only`
- `slow -> medium`
- `slow only`

Some rows that seasonally allow surface may also lose surface for the day because of wind.

In these cases, multiple target profiles may collapse to the same final profile.

That is allowed.

### 18.3 Do not invent fake profiles
If two or three slots collapse to the same target profile, the engine must **not** invent illegal new profiles just to show variety.

Instead:
1. keep the repeated legal profile
2. diversify through family choice first
3. then diversify through item choice
4. then use deterministic tie-breaking

### 18.4 Example
If a narrow context yields multiple `bottom / slow` slots, the engine should still try to return different bottom/slow families first before repeating a family.

### 18.5 Inventory shortages should be visible
If the legal inventory is too thin to produce 3 good distinct recommendations in a narrow context, that shortage should be treated as an inventory/design issue, not hidden by biologically weaker profile invention.

---

## 19. Variety and Deterministic Rotation

Variety is desirable, but randomness must be bounded.

### 19.1 Required principle
The recommender should use deterministic seeded tie-breaking or bounded rotation inside the best-fit shortlist.

### 19.2 What this means
The same day + same context should not produce wildly different outputs on refresh.

However, if several equally strong fits exist, the system should be able to rotate among them in a controlled way so the engine does not always feel frozen.

### 19.3 What not to do
Do not:
- select randomly from the whole legal pool
- allow every refresh to reshuffle outputs
- use uncontrolled randomness

---

## 20. Forage Logic

Forage should exist in the recommender, but it should remain simple.

### 20.1 Seasonal forage
Each seasonal row may include:
- `primaryForage`
- `secondaryForage`

### 20.2 Item forage tags
Each item may include 1–2 forage tags that reflect what it most plausibly imitates or aligns with.

### 20.3 Enforcement rule
At least **one recommendation out of the 3** on each side should align with one of the row’s forage tags **if a legal candidate exists**.

### 20.4 Important caveat
Forage must not break the engine.

If no legal forage-aligned candidate exists for that side in that context, the recommender should continue normally.

### 20.5 Forage should stay coarse
Do not build a giant prey ontology in v1.

Use a practical, coarse forage system.

---

## 21. Simplicity Rules for v1

To prevent another over-engineered recommender, the following should be treated as explicit v1 constraints.

### 21.1 No extra special rules
Beyond the wind/surface block, do not add:
- spinnerbait wind prioritization
- low-light boosts
- item-family weather boosts
- special lure-specific condition trees

Those can be considered later only if the base system proves stable and needs them.

### 21.2 No multi-column items
Each item gets one column only.

### 21.3 No unconstrained multi-pace items
Dual pace is allowed only in the narrow, adjacent-primary/secondary form already defined.

### 21.4 No giant weather-to-item scoring system
The recommender should not independently build a giant matrix that scores each weather variable against each item.

That belongs to the old over-engineered direction.

### 21.5 No confidence system
This recommender does not need a separate confidence model in v1.

### 21.6 No excessive metadata
Do not add fields unless they clearly improve the architecture.

### 21.7 No fake precision
Do not pretend to know more than the model truly knows. Keep authored systems believable and grounded.

---

## 22. Final Summary of the Recommender

The rebuilt lure and fly recommender should work like this:

1. receive the user’s selected fishing context
2. receive the resolved How’s Fishing region and daily regime
3. map the How’s Fishing region into a recommender band
4. load the authored seasonal row for:
   - species
   - band
   - month
   - water type
5. build the day’s legal column and pace targets from:
   - seasonal ranges
   - anchors
   - daily regime
   - wind surface block if applicable
6. combine those into 3 target profiles
7. select 3 lures and 3 flies separately using:
   - hard eligibility gates
   - best-fit tiers
   - family diversity
   - forage alignment if possible
   - deterministic tie-breaking
8. return a deterministic, biologically sensible set of recommendations

The recommender should remain:
- deterministic
- biologically grounded
- simpler than past versions
- cleanly layered
- explainable
- scalable across supported contexts without becoming messy again
