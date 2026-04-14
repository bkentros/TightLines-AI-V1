# Recommender V3 Roadmap

## Purpose

This roadmap defines how we should move the V3 recommender forward from the current state.

It answers three questions:

1. What architecture are we committing to right now?
2. In what order should we improve species and systems?
3. How do we evolve toward a cleaner long-term model without throwing away the current working engine?

This document is intentionally more strategic and more complete than `docs/recommender-v3-fix-plan.md`.
The fix plan is a tactical cleanup-and-quality plan.
This roadmap is the full phased program for finishing V3 species work and then migrating the scoring model into a cleaner declarative design.

## Strategic Decision

We are **not** doing a full recommender rewrite right now.

We are committing to this path instead:

1. Keep the current V3 architecture in place.
2. Finish tuning one flagship species on the current engine first.
3. Use that finished species to define the stable long-term day-state contract.
4. Gradually migrate scoring intent out of hardcoded procedural logic and into declarative lure/fly metadata.
5. Repeat species-by-species once the architecture and audit process are stable.

Why this is the right path:

- The current V3 engine is already structurally correct:
  - seasonal decides what is biologically possible
  - daily conditions decide what rises that day
- We already have audit harnesses that can expose failures and confirm improvements.
- A full rewrite now would mix architecture risk and calibration risk at the same time.
- We still have not fully “finished” one flagship freshwater species end-to-end.
- We need a stable reference species before we decide what the final declarative model must support.

## What V3 Is Doing Today

The current engine works in four layers:

### 1. Seasonal eligibility

Per `species + region + month + context`, V3 returns:

- eligible lure ids
- eligible fly ids
- seasonal forage anchors
- seasonal water-column / location anchors

This is the “what is possible” layer.

Primary files:

- `supabase/functions/_shared/recommenderEngine/v3/seasonal/*.ts`
- `supabase/functions/_shared/recommenderEngine/v3/seasonal/resolveSeasonalRow.ts`

### 2. Daily normalized handoff

Raw weather and water context are normalized into a bounded daily payload:

- `posture_score_10`
- `posture_band`
- `presentation_presence_today`
- `reaction_window_today`
- `pace_bias_today`
- `surface_window_today`
- column-shift limits
- guardrail booleans

This is the “what kind of day is it?” layer.

Primary file:

- `supabase/functions/_shared/recommenderEngine/v3/resolveDailyPayload.ts`

### 3. Condition feature vector

The daily payload is converted into a small feature vector:

- willingness
- tempo_bias
- wind_stress
- light_stress
- pressure_stress
- temp_stress
- hydro_stress
- clarity_visibility_push
- surface_window

This is the “how should the day mechanically influence lure/fly ranking?” layer.

Primary file:

- `supabase/functions/_shared/recommenderEngine/v3/buildConditionFeatures.ts`

### 4. Ranking and top-3 selection

Each archetype is scored using:

- water-column fit
- mood fit
- presentation fit
- forage bonus
- daily condition fit
- clarity fit
- guardrails
- a limited amount of species/context tuning

Then the top 3 is selected with a coherence pass so the lineup tells one believable tactical story.

Primary files:

- `supabase/functions/_shared/recommenderEngine/v3/archetypeConditionWeights.ts`
- `supabase/functions/_shared/recommenderEngine/v3/scoreCandidates.ts`

## Long-Term Target Architecture

The long-term target is **not** a single “aggressive / neutral / suppressed” label.

That is too coarse because:

- two neutral days can still require very different recommendations
- pace and aggression are not the same thing
- visibility need and aggression are not the same thing
- surface opportunity and aggression are not the same thing
- river current / hydro disruption adds a separate dimension

The long-term target is:

### A compact multi-signal day-state contract

We want a small, interpretable set of daily signals:

- `posture_band`
- `pace_bias`
- `surface_window`
- `visibility_need`
- `column_bias`
- `flow_state` for rivers

This is the stable “day language” the recommender should speak.

### Declarative lure/fly profiles

Every lure/fly should eventually express, in metadata:

- preferred posture bands
- preferred pace bias
- preferred surface window
- preferred visibility need
- preferred water-column posture
- preferred clarity
- forage affinities
- tactical role
- optional species/context modifiers where truly needed

### Much less procedural special-casing

Today, some scoring behavior lives in hardcoded logic.
Long term, more of that intent should live in profile metadata and row metadata so the system is easier to:

- read
- audit
- tune
- explain
- extend across species

## Current State Snapshot

This roadmap begins from the current audited state as of the latest generated outputs.

### Global V3 state

From the latest generated audits:

- `v3-daily-shift-audit.md`: `14/14` checks passed
- `v3-coverage-audit.md`:
  - lure tactical conflict rate: `3.2%`
  - fly tactical conflict rate: `0.0%`
  - lure expectation mismatches: `0`
  - fly expectation mismatches: `0`
  - no lure or fly is dead in viability / top-3 / top-1 reachability

### Largemouth state

From the latest largemouth-specific outputs:

- `largemouth-v3-matrix-review-sheet.md`
  - `110` scenarios
  - current precheck miss counts:
    - top-1 primary misses: `27`
    - top-3 primary missing: `4`
    - disallowed-present: `5`
- `largemouth-v3-gold-batch-1-review-sheet.md`
  - top-1 primary misses: `3`
  - top-3 primary missing: `2`
  - disallowed-present: `1`
- `largemouth-v3-gold-batch-2-review-sheet.md`
  - top-1 primary misses: `4`
  - top-3 primary missing: `1`
  - disallowed-present: `0`
- `largemouth-v3-gold-batch-3-review-sheet.md`
  - top-1 primary misses: `1`
  - top-3 primary missing: `0`
  - disallowed-present: `0`
- `lmb-lake-deep-audit.md`
  - lure #1 entropy: `3.65`
  - effective distinct lure #1s: `12.5`
  - median lure score gap (#1−#3): `1.00`
  - 6/11 July 8 clarity triples keep the same #1 lure and fly
  - duplicate family usage in lure top 3 is still too high

### Current largemouth weak spots

The remaining high-value problem areas are:

- south-central / Alabama river largemouth
- Texas winter / fall reservoir edge cases
- Georgia clear highland reservoir spring / summer overlays
- some clear summer lake rows still allowing wrong topwater or drop-shot drift
- clarity still under-influencing some summer lake windows

## Roadmap Principles

These principles should govern every phase:

1. Seasonal remains the authority for eligibility.
2. Daily conditions remain the authority for ranking within the eligible pool.
3. We only keep lure/fly options that have an intentional role.
4. Every added rule must be auditable.
5. Species tuning should become more declarative over time, not more opaque.
6. We do not move to the next species until the current species is truly stable enough.

## Phase 1: Finish Largemouth On The Current Engine

### Objective

Make `largemouth_bass` the first fully tuned freshwater V3 species across:

- lake / pond
- river
- monthly seasonality
- daily weather shifts
- clarity
- lure realism
- fly realism
- top-3 usefulness

### Why this phase comes first

Largemouth is the best calibration species because it spans:

- warm grass lakes
- reservoirs
- rivers
- clear and stained water
- surface, shallow cover, offshore, current-edge, and fall transition behavior

If the engine cannot feel convincingly right for largemouth, it is not ready for a broad declarative refactor.

### Workstreams

#### 1. Seasonal row cleanup and specificity

Goals:

- ensure every largemouth row is intentional
- keep river largemouth biologically distinct from smallmouth-like cold-current behavior
- keep warm shallow grass rows from collapsing into generic summer bass logic

Tasks:

- finish Florida warm-season rows
- finish Texas winter / summer / fall reservoir rows
- finish Alabama / south-central current-river rows
- finish northern clear-lake largemouth rows
- finish overlay rows:
  - Georgia highland
  - California Delta
  - Midwest backwater

#### 2. Daily movement tuning

Goals:

- the day should visibly change picks
- but not in a chaotic or biologically silly way

Tasks:

- keep validating overcast vs bright
- warming vs cold snap
- river stable flow vs elevated flow
- low-light vs heat-limited midday
- windy reaction windows vs post-front slow days

#### 3. Archetype realism and reach

Goals:

- every intentional largemouth lure/fly should have a believable top-3 role
- common largemouth tools should show up where anglers expect them
- specialty tools should be rare but real

Tasks:

- ensure grass/surface tools earn true summer windows
- ensure slow tools earn genuine post-front / suppressed windows
- ensure moving current tools outrank drag tools in current-edge river rows
- continue trimming “wrong but technically possible” top-3 appearances

#### 4. Top-3 coherence

Goals:

- top 3 should feel like one game plan
- alternatives should differ usefully but not contradict the day

Tasks:

- reduce family duplication
- avoid multiple nearly identical open-water topwaters in one lineup
- avoid mixing strong search lanes with obviously wrong drag/finesse backups unless the day truly supports that

#### 5. Color realism

Goals:

- colors should fit lure type, clarity, light, and practical angler realism

Tasks:

- strengthen dark vs natural vs bright lane selection in river rows
- keep clear-water natural lanes restrained
- keep stained/dirty water from collapsing to one repeated color family

### Largemouth pass bar

We should not move on from largemouth until these conditions are met:

#### Global largemouth quality

- gold batches feel manually credible, not just precheck-passable
- no major remaining “this reads like the wrong species” clusters

#### Audit bars

- largemouth matrix:
  - top-1 primary misses comfortably below current `27`
  - top-3 primary missing near zero
  - disallowed-present near zero
- lake deep audit:
  - duplicate-family top-3 problem materially reduced
  - clarity sweeps show better separation on peak summer days
  - score-gap stability improved or at least not worsening
- daily-shift audit:
  - stays at `14/14`

#### Human plausibility bars

Largemouth must feel stable across:

- Florida winter / spring
- Florida summer grass
- Texas winter / fall
- stained summer cover scenarios
- clear summer finesse / target scenarios
- fall shad-transition scenarios
- at least one credible river batch

### Deliverables for Phase 1

- tuned largemouth seasonal tables
- tuned largemouth scoring behavior
- updated largemouth matrix review sheet
- updated largemouth gold batches
- updated largemouth lake deep audit
- a short “largemouth stable enough” summary document when phase ends

## Phase 2: Lock The Stable Day-State Contract

### Objective

Freeze the long-term daily “language” of the recommender before broader declarative migration.

### Why this phase exists

Right now, the engine already has a daily handoff, but it is partly embedded in procedural code.
Before migrating to declarative lure/fly profiles, we need to decide what the stable normalized day-state actually is.

### Deliverable

A design doc that defines each daily signal:

- name
- allowed values
- biological meaning
- how it is derived
- what kinds of lures/flies it should influence
- which signals are species-agnostic
- which signals are context-specific

### Proposed stable signal set

#### Required

- `posture_band`
- `pace_bias`
- `surface_window`
- `visibility_need`
- `column_bias`
- `flow_state` for rivers

#### Optional if needed after review

- `reaction_window`
- `light_harshness`
- `hydro_stability`

### Exit criteria

- every current scoring rule can be mapped to one or more stable day-state signals
- no critical current logic depends on undefined “mystery behavior”
- we can explain the daily engine to a human without walking line-by-line through code

## Phase 3: Begin Declarative Migration Without A Rewrite

### Objective

Move lure/fly scoring intent from hardcoded logic into metadata gradually, without breaking the current engine.

### Important constraint

This is **not** a ground-up rewrite.
This is an incremental migration.

### Migration strategy

#### Step 1. Introduce new profile fields

Each lure/fly profile should gradually gain fields like:

- `preferred_posture_bands`
- `preferred_pace_biases`
- `preferred_surface_windows`
- `preferred_visibility_needs`
- `preferred_column_biases`
- `preferred_flow_states`

These should map directly to the stable day-state contract from Phase 2.

#### Step 2. Mirror existing logic first

Do not invent new tuning during migration.
First, use metadata to mirror existing scoring intent as closely as possible.

#### Step 3. Reduce procedural code only after parity

Only once audit outputs are stable should we remove or shrink procedural species/context scoring logic.

#### Step 4. Keep audit parity visible

For each migrated slice:

- compare old and new outputs
- confirm audit parity or improvement
- only then keep the change

### What should stay procedural even long term

Some logic probably still belongs in code:

- hard guardrails
- invalid-surface suppression
- deterministic tie-breaking
- bounded top-3 coherence selection
- context-wide safety caps

The goal is not “everything in metadata.”
The goal is “domain preferences in metadata, infrastructure in code.”

### Exit criteria

- most lure/fly day-response logic is visible in profile metadata
- species tuning becomes easier to audit and edit
- the size of species-specific imperative bonuses in `scoreCandidates.ts` is materially reduced

## Phase 4: Expand To Smallmouth

### Objective

After largemouth is stable enough and the day-state contract is locked, tune `smallmouth_bass`.

### Why second

Smallmouth shares enough bass structure to benefit from largemouth architecture work, but it has distinct biology:

- more current affinity
- more cold-clear tolerance
- different lure-family emphasis
- different river behavior

### Key risks to watch

- smallmouth being over-largemouthed in shallow cover situations
- generic bottom finesse overwhelming more aggressive current-driven windows
- river and lake smallmouth collapsing together

### Pass bar

- smallmouth lake and river scenarios feel species-correct
- no major largemouth bias leakage in final outputs

## Phase 5: Expand To Trout

### Objective

Tune trout after bass architecture is more stable.

### Why third

Trout uses some different fly logic and river logic, but it benefits heavily from a clear day-state contract:

- surface window
- current / flow state
- light harshness
- cold snap vs warmup

### Special focus

- fly realism over generic streamer repetition
- surface insect / mouse / streamer transitions
- strong river wind and runoff handling

## Phase 6: Expand To Pike

### Objective

Tune `northern_pike` last among the current freshwater V3 set.

### Why last

Pike already uses a smaller and more specialized pool.
It benefits from the same architecture improvements, but it is not the best flagship species for proving the day-state model.

### Special focus

- narrow but real big-profile windows
- correct surface restraint vs opening
- avoiding generic bass-style ranking behavior

## Phase 7: Cleanup, Consolidation, And Explainability

### Objective

After all current species are stable enough, make the system easier to maintain.

### Work

- remove stale transitional fields
- trim procedural leftovers that no longer carry real value
- clean up audit outputs
- write an internal architecture explainer
- make it easy to inspect:
  - why a lure won
  - which daily features helped it
  - why nearby alternatives lost

### Deliverables

- cleaned contracts
- cleaned metadata
- simplified scoring code
- architecture explainer
- species tuning playbook

## Audit Harness By Phase

These tools should remain the core iteration loop:

### Cross-species / structural

- `docs/recommender-v3-audit/generated/v3-daily-shift-audit.md`
- `docs/recommender-v3-audit/generated/v3-coverage-audit.md`
- `docs/recommender-v3-fix-plan.md`

### Largemouth-specific

- `docs/recommender-v3-audit/LARGEMOUTH_V3_FOCUS.md`
- `docs/recommender-v3-audit/generated/largemouth-v3-matrix-review-sheet.md`
- `docs/recommender-v3-audit/generated/largemouth-v3-gold-batch-1-review-sheet.md`
- `docs/recommender-v3-audit/generated/largemouth-v3-gold-batch-2-review-sheet.md`
- `docs/recommender-v3-audit/generated/largemouth-v3-gold-batch-3-review-sheet.md`
- `docs/recommender-v3-audit/generated/lmb-lake-deep-audit.md`
- `docs/recommender-v3-audit/generated/lmb-lake-viewer-results.json`

### Main commands

From repo root:

```sh
deno test supabase/functions/_shared/recommenderEngine/__tests__/v3Foundation.test.ts
deno run --allow-read --allow-write --allow-env scripts/recommender-v3-audit/runLargemouthMatrix.ts
deno run --allow-read --allow-write --allow-env scripts/recommender-v3-audit/runLargemouthGoldBatch1.ts
deno run --allow-read --allow-write --allow-env scripts/recommender-v3-audit/runLargemouthGoldBatch2.ts
deno run --allow-read --allow-write --allow-env scripts/recommender-v3-audit/runLargemouthGoldBatch3.ts
deno run --allow-read --allow-write scripts/recommender-v3-audit/runLmbLakeDeepAudit.ts
deno run --allow-read --allow-write --allow-env scripts/recommender-v3-audit/runDailyShiftAudit.ts
deno run --allow-read --allow-write --allow-env scripts/recommender-v3-audit/runCoverageAudit.ts
```

## What We Should Not Do

### Do not do a full rewrite before finishing largemouth

That would erase too much calibration context and make debugging much harder.

### Do not keep piling on opaque procedural tuning forever

That will make the engine impossible to reason about across species.

### Do not reduce the daily engine to one single mood label

That is too lossy and will make recommendations repetitive and less biologically realistic.

## Recommended Immediate Next Steps

This is the practical sequence to continue from the current worktree:

1. Finish largemouth river current rows, especially south-central / Alabama.
2. Finish Texas winter/fall reservoir misses.
3. Finish clear summer lake anti-drift and clarity sensitivity cleanup.
4. Write the stable day-state contract doc.
5. Start introducing declarative day-state preference fields into lure/fly profiles.

## Definition Of Success For The Whole Roadmap

The roadmap is successful when:

- seasonal always determines what is possible
- daily conditions clearly determine what rises that day
- recommendations vary meaningfully across real daily conditions
- every lure/fly has an intentional role
- top 3 outputs feel like one believable tactical plan
- species outputs feel species-correct
- the engine is understandable enough that a human can audit and tune it confidently
- most domain behavior is declared in metadata instead of hidden in procedural scoring code
