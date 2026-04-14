# Recommender V3 Fix Plan

## Goal

Make the V3 lure and fly recommender behave like this, consistently:

- seasonal tables determine what is biologically eligible for the species, region, month, and water type
- daily normalized weather and water conditions determine which eligible lure or fly rises to the top that day
- lure and fly recommendations react meaningfully to day-to-day condition changes
- similar tools do not collapse into indistinguishable scoring behavior
- top 3 lineups tell one coherent tactical story instead of mixing contradictory lanes
- stale metadata and legacy scaffolding do not clutter the codebase or silently influence outcomes

This plan uses the current LMB audit tools as the main iteration harness:

- `docs/recommender-v3-audit/generated/lmb-lake-viewer-results.json`
- `docs/recommender-v3-audit/generated/lmb-lake-deep-audit.md`
- `docs/recommender-v3-audit/generated/v3-coverage-audit.md`
- `docs/recommender-v3-audit/generated/v3-daily-shift-audit.md`

## What The Latest Audit Says

Current state from the latest generated audits and follow-up structural checks:

- V3 architecture shape is correct: seasonal eligibility first, daily ranking second.
- Unit and surface tests are green.
- Daily shift audit is not yet good enough: `11/14` checks passed.
- Coverage audit still fails key quality targets:
  - lure tactical conflict rate: `6.34%` vs target `<= 2%`
  - lure expectation mismatches: `3`
  - fly expectation mismatches: `1`
  - one lure never reaches top 3
- Fly sensitivity is still sticky in several largemouth lake rows:
  - `12` fly rows have only one top-1 winner across all synthetic daily states
- Exact score ties are still common:
  - lure top-1 ties: `17.3%`
  - fly top-1 ties: `29.8%`
  - lure top-3 score duplication: `35.2%`
  - fly top-3 score duplication: `54.5%`
- Seasonal table integrity is not clean yet:
  - `1209` raw seasonal rows
  - `1104` unique `(species, region, month, context)` keys
  - `105` shadowed rows silently overridden by later file order

## Root Problems To Fix

### 1. Seasonal data is partly clean in intent, but not clean in structure

Symptoms:

- duplicate seasonal keys exist across species tables
- `resolveSeasonalRowV3` returns the last matching row, so file order decides winners
- many adjacent months intentionally reuse pools, but some rows are true accidental overrides rather than clear monthly design

Why this matters:

- makes the biological layer harder to reason about
- creates hidden behavior where a later override can replace a broader base row without any explicit conflict signal
- blocks confident tuning because “current truth” is not obvious from authoring structure

### 2. Daily scoring is still too lane-driven and not archetype-specific enough

Symptoms:

- most daily variation comes from tactical lane weights
- only a small subset of archetypes have explicit per-id deltas
- many flies and some lures behave almost identically when their lane, clarity strengths, and forage matches overlap

Why this matters:

- the architecture wants every lure and fly to have its own weather sensitivity profile
- without stronger per-archetype differentiation, similar tools keep tying or moving in lockstep

### 3. Daily handoff compresses too much information

Symptoms:

- daily handoff currently reduces the day to:
  - posture band
  - presentation band
  - column bias
  - a few guardrail booleans
- raw normalized weather states are then re-compressed into only 8 condition features

Why this matters:

- enough for broad shifts
- not enough for fine separation between near-neighbor lures and flies
- especially weak for “good vs better” distinctions on fishable days

### 4. Tie handling is not biologically meaningful

Symptoms:

- component scores are rounded before ranking
- final scores are rounded before ranking
- ties break alphabetically by display name

Why this matters:

- ties are frequent enough to materially shape output
- alphabetical fallback is deterministic but not biologically grounded

### 5. Top-3 coherence is too weak

Symptoms:

- top-3 diversity only blocks a small set of redundancy keys
- mixed-story lineups still pass:
  - reaction + bottom drag
  - surface + bottom fly
  - fast + slow conflict on the same day

Why this matters:

- a human guide can offer alternatives, but they still need to fit one believable daily read

### 6. Legacy metadata is still present and increases authoring mess

Fields that appear stale or legacy-only right now:

- `preferred_pace_biases`
  - present in fly profiles
  - not referenced anywhere in the current code path
- seasonal authoring fields present in `LegacySeasonalCore` but not emitted into final `RecommenderV3SeasonalRow`
  - `base_mood`
  - `base_presentation_style`
  - `primary_lure_archetypes`
  - `primary_fly_archetypes`

Important nuance:

- some of these fields may still be useful as authoring hints
- but if they remain, they should either:
  - actively shape output through explicit logic, or
  - move into comments / audit annotations instead of pretending to be runtime data

## Execution Order

## Phase 0: Lock The Quality Bar

Create a single source of truth for what “done” means before tuning.

Deliverables:

- document target metrics for:
  - daily shift audit
  - coverage audit
  - LMB deep audit
  - tie-rate audit
  - seasonal integrity audit
- add one lightweight script or test that reports:
  - duplicate seasonal keys
  - exact score ties
  - low-sensitivity rows
  - tactical conflict rate

Definition of done:

- we can run one repeatable checklist after every scoring change

## Phase 1: Clean The Seasonal Layer First

This is the first real fix phase. No more hidden overrides.

Tasks:

- add a seasonal integrity audit that fails on duplicate `(species, region, month, context)` keys
- remove accidental duplicate rows from the seasonal files
- make intentional specialization explicit instead of relying on later override order
- keep lake and river distinct unless identical eligibility is truly intended
- review high-override largemouth regions first:
  - Florida
  - south-central
  - Gulf Coast
  - southeast Atlantic
- collapse repeated monthly definitions into shared named pool constants where the biology is actually unchanged
- leave month-to-month repetition only when it is intentional and documented

Definition of done:

- duplicate seasonal key count is `0`
- resolver never depends on “last row wins” for valid authored data
- every row is explainable from the file without needing to mentally diff shadowed rows

## Phase 2: Remove Stale Metadata And Dead Scaffolding

Safe cleanup pass after seasonal truth is clean.

Tasks:

- remove `preferred_pace_biases` from contracts and fly profiles unless a concrete scoring or UI use is added
- decide whether `base_mood` and `base_presentation_style` should:
  - become real inputs to output generation, or
  - be deleted from seasonal authoring
- decide whether `primary_lure_archetypes` and `primary_fly_archetypes` should:
  - become explicit seasonal priority hints in ranking or audits, or
  - be removed from seasonal authoring
- remove comments and helper text that still describe obsolete seasonal priority behavior
- review the viewer/deep-audit derived fields and keep only fields that support:
  - tuning
  - debugging
  - UI explanation

Recommended default:

- remove `preferred_pace_biases`
- remove unused seasonal authoring fields from runtime authoring types unless we intentionally promote them into audit-only metadata

Definition of done:

- every field in the V3 contract or seasonal authoring layer is either:
  - used in runtime logic, or
  - deliberately retained for audit authoring with clear naming and comments

## Phase 3: Eliminate Non-Meaningful Ties

Do this before deeper tuning so audit output becomes trustworthy.

Tasks:

- stop rounding component scores before ranking
- stop rounding final score before ranking
- keep rounded numbers only for response display
- add a biologically meaningful deterministic tie-break stack, in order:
  - raw score
  - raw `daily_condition_fit`
  - raw `water_column_fit`
  - raw `forage_bonus`
  - lane-specific or archetype-specific specificity bonus
  - stable id fallback only as the final safety valve
- add audit output that distinguishes:
  - mathematically equal scores
  - rounded-display equal scores

Definition of done:

- exact top-1 tie rate is close to zero in normal scenarios
- display ties may still happen, but ranking is no longer driven by alphabetic fallback

## Phase 4: Increase Daily Weather Sensitivity

This is the core recommender quality phase.

Tasks:

- expand condition features beyond the current compressed set where needed
- preserve more signal from normalized weather instead of only broad bands
- consider adding explicit per-feature gradients for:
  - pressure direction strength
  - wind execution penalty vs beneficial chop
  - light harshness vs low-light opportunity
  - runoff severity
  - precipitation recency and intensity
  - temperature opportunity vs stress
- reduce over-reliance on posture band as the main driver
- strengthen scenario-specific daily movement for:
  - overcast vs bright
  - warming vs cold snap
  - low-light vs heat-limited midday
  - stable vs post-front

Definition of done:

- daily shift audit passes all scenario checks
- “same month, same region, same species, different day” produces the kind of believable tactical movement a guide would expect

## Phase 5: Give Every Archetype Its Own Weather Response

This is where the recommender becomes truly high-resolution.

Tasks:

- expand per-archetype weighting beyond the current small `ID_DELTA` subset
- define weather response notes for every archetype:
  - when it improves
  - when it falls off
  - what variable matters most
- separate near-neighbor archetypes explicitly, for example:
  - `drop_shot_worm` vs `drop_shot_minnow`
  - `walking_topwater` vs `popping_topwater` vs `prop_bait` vs `buzzbait`
  - `rabbit_strip_leech` vs `woolly_bugger` vs `sculpin_streamer`
  - `game_changer` vs `deceiver` vs `clouser_minnow`
- tune weak or dead families first:
  - `weightless_stick_worm`
  - `drop_shot_worm`
  - `large_profile_pike_swimbait`
  - `pike_bunny_streamer`
- tune sticky fly rows where `crawfish_streamer` is always the winner in largemouth lake spring/summer windows

Definition of done:

- every archetype has at least one believable path to surface when it is eligible and intended
- “similar but not identical” tools stop moving in lockstep

## Phase 6: Enforce Top-3 Story Coherence

Variety is good. Contradictory advice is not.

Tasks:

- add top-3 coherence rules after raw ranking:
  - avoid surface + pinned-bottom contradiction unless explicitly justified
  - avoid fast reaction + dead-slow drag conflict on suppressed days
  - avoid duplicate family and near-duplicate lane crowding
- expand `top3_redundancy_key` coverage where families currently crowd the lineup
- add a post-rank coherence pass that can swap #3 for #4 when the alternative story is cleaner without materially hurting score quality

Definition of done:

- lure tactical conflict rate drops below `2%`
- top-3 lineups read like “primary lane + believable backups,” not “three unrelated ideas”

## Phase 7: Revisit Seasonal Eligibility With The Cleaner Scorer

Only after the scorer is smarter.

Tasks:

- use the cleaned audits to find rows where the wrong family is eligible at all
- tighten seasonal pools when a bait should never be in play for that month/context
- broaden pools only when the bait is biologically valid but currently boxed out unfairly
- use the LMB lake viewer as the main manual spot-check tool for:
  - Florida lakes
  - south-central reservoirs
  - upper Midwest summer lakes

Definition of done:

- seasonal tables define possibility space cleanly
- scorer handles preference inside that space
- fewer “fixes” need to be made by guardrails alone

## Validation Workflow

For each scoring batch:

1. Run seasonal integrity audit.
2. Run unit and surface tests.
3. Run `runDailyShiftAudit.ts`.
4. Run `runCoverageAudit.ts`.
5. Run `runLmbLakeViewer.ts`.
6. Run `runLmbLakeDeepAudit.ts`.
7. Manually inspect a handful of high-value viewer scenarios:
   - Florida May
   - Florida July
   - south-central winter and fall
   - Great Lakes summer smallmouth analogs for cross-species sanity
   - western trout warmup vs cold snap analogs for fly scoring philosophy

## Success Criteria

We should call the project successful when all of these are true:

- seasonal duplicate key count is `0`
- stale runtime metadata is removed or explicitly repurposed
- daily shift audit passes all targeted checks
- exact top-1 tie rate is reduced to rare edge cases
- lure tactical conflict rate is below target
- no archetype that is meant to be winner-capable is permanently locked out
- LMB deep audit shows stronger daily contribution share and better clarity/day spread
- the viewer shows obvious, believable changes when the day changes, even inside the same month and same fishery

## Immediate First PR

The first implementation PR should do only the following:

- add a seasonal integrity audit and fail on duplicate keys
- remove or quarantine obviously stale metadata:
  - `preferred_pace_biases`
  - any unused seasonal authoring fields we choose not to promote
- make ranking use unrounded raw scores internally
- add a deterministic non-alphabetic tie-break stack

Why this first:

- it removes hidden mess
- makes subsequent tuning easier to trust
- improves every later audit run without yet changing the biological model too aggressively
