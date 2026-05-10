# Daily-Picks 2x2 Quality Audit Master Plan

Date: 2026-05-08\
Scope: QA-1 master audit plan plus lightweight inspection harness for the live
daily-picks 2x2 recommender.\
Behavior change: none.

## Current Baseline

Daily-picks 2x2 is the live recommender path. The active runtime starts with
exact generated v4 seasonal rows, builds a normalized `DailyScenario`,
hard-gates row-authored catalog IDs, scores valid candidates, selects exactly
two lures and two flies, and stores Set A / Set B through
`dailyPicksSession.ts`.

The first-pass audit position is conservative:

- Seasonal biology decides what can appear.
- Daily conditions decide what rises.
- Variety can rotate only among strong valid candidates.
- Catalog and seasonal data should be corrected before broad scoring changes.
- No tuning should happen from anecdotes or single surprising outputs.

## Audit Objectives

1. Prove catalog truth for every active lure and fly: species fit, water fit,
   column, pace, forage, clarity strengths, condition tags, goal tags, and
   how-to-fish copy.
2. Prove seasonal rows are biologically credible by species, region, month, and
   water type.
3. Prove every supported row has enough valid post-gate inventory for
   all-purpose and big-fish recommendations without rescue borrowing.
4. Prove daily-condition tags change scoring in the intended direction while
   never resurrecting seasonally invalid presentations.
5. Prove all-purpose and big-fish differ when biology and inventory support
   different choices.
6. Prove Set B differs from Set A when strong valid alternatives exist.
7. Prove repeated days do not feel copy-pasted when valid alternatives exist.
8. Prove response copy describes real candidate properties and actual score
   reasons without overclaiming.
9. Preserve image coverage, frontend mapping coverage, and Set A / Set B session
   behavior.

## Fixture Matrix

Use three fixture tiers.

Tier 1: exhaustive generated-row sweeps

- All 1,104 generated seasonal rows:
  - Largemouth bass: 384 rows.
  - Smallmouth bass: 336 rows.
  - Northern pike: 216 rows.
  - Trout: 168 river-only rows.
- Both goals: `all_purpose`, `big_fish`.
- Synthetic daily-condition templates that isolate condition tags and gates.
- All clarity states across targeted templates: `clear`, `stained`, `dirty`.

Tier 2: canonical biology fixtures

- Florida LMB lake/pond, March-July: southern surface allowed vs heat/dirty/wind
  decisions.
- Great Lakes / Upper Midwest LMB lake/pond, March-May and June: cold/northern
  surface restraint.
- Great Lakes / Upper Midwest SMB lake/pond and river, April-September:
  clear-subtle, current/rock, limited topwater.
- Pike lake/pond and river in Alaska, Great Lakes / Upper Midwest, Midwest
  Interior, Appalachian, and South Central rows: cold slow, wind flash, surface
  restraint, big-profile upside.
- Trout river in Appalachian, Mountain West, Pacific Northwest, Great Lakes /
  Upper Midwest, Alaska, and Inland Northwest rows: runoff streamer, clear
  bright subtle, mouse/surface only in narrow seasonal/daily windows.

Tier 3: product/session fixtures

- Real edge-function requests with no preview header.
- Same exact context repeated returns stable Set A.
- One refresh returns Set B and locks refresh.
- `view_variant: "A"` remains available after B exists.
- Water clarity, goal, species, water type, location/date create separate
  session identity.
- Frontend renders all four images and intrinsic profile fields.

## Species, Water, Month Coverage

For each species:

- Sweep all generated rows by region, month, and water type.
- Flag rows where post-gate lure or fly count is less than 2 as failures.
- Flag rows where post-gate lure or fly count is less than 4 as thin-pool review
  items.
- Flag surface rows by month/region and compare against biological expectations.
- Flag non-surface rows that can still select surface under any daily condition
  as hard failures.
- Compare lake/pond and river rows separately; do not let credibility in one
  water type justify the other.

Special species rules:

- Trout lake/pond remains unsupported.
- Pike wind should promote flash/reaction, not surface.
- SMB should not inherit LMB frog/open-topwater bias.
- LMB frog and buzzbait opportunities must remain seasonal/daily-window
  specific.

## Goal Comparison Plan

For every row and condition template:

- Run all-purpose and big-fish with the same row, date, clarity, and daily
  scenario.
- Compare selected IDs, score reasons, goal-tag reasons, and candidate classes.
- Treat identical sets as acceptable only when the valid pool genuinely contains
  no credible higher-upside alternative inside the quality band.
- Treat big-fish outputs with zero selected big-fish goal reasons as review
  items.
- Confirm all-purpose keeps reliable/versatile profiles competitive and does not
  become "small fish only."
- Confirm big-fish does not become reckless surface/aggression inventory when
  surface, season, or water type says no.

## Daily-Condition Scenario Plan

Initial synthetic templates:

- `cold_clear_suppressed`: clear, cold, suppressed, surface closed; should favor
  slow/subtle/cold-slow inventory.
- `windy_stained_reaction`: stained, windy, active, surface closed; should lift
  wind reaction and dirty vibration profiles.
- `calm_low_light_surface_stress`: calm low-light active surface tags; seasonal
  rows must still gate surface.
- `dirty_elevated_river`: dirty elevated river movement; should lift
  current/streamer/visibility tools, especially trout runoff streamers.
- `missing_wind_low_confidence`: missing wind; surface closed and copy should
  remain restrained.
- `heat_clear_bright`: clear bright heat-limited finesse; should lift
  clear-subtle and heat-finesse profiles.

Later archived-day fixtures should use real hourly weather snapshots, but not
until the synthetic matrix identifies the highest-risk rows and tags. Store raw
weather, normalized scenario, candidate pools, score reasons, selected IDs, and
copy for each fixture.

## Pool-Health Metrics

Required per row/scenario/goal:

- Authored lure/fly ID counts.
- Hard-gated lure/fly candidate counts.
- Candidate counts by column, pace, family group, and presentation group.
- Candidate counts with all-purpose goal tags.
- Candidate counts with big-fish goal tags.
- Candidate counts with active condition-tag matches.
- Candidate counts after surface closure.
- Selected IDs and score reasons.

Failure thresholds:

- Less than 2 hard-gated lures or less than 2 hard-gated flies.
- Any selected candidate not in the hard-gated pool.
- Any selected candidate outside row species/water/column/pace/surface gates.
- Any selected surface item when seasonal surface is false or daily surface is
  closed.

Review thresholds:

- Less than 4 hard-gated candidates on either side.
- No active condition-tag matches among selected picks in a condition-specific
  fixture.
- No goal-tag score reason among selected picks in a goal-specific fixture.
- Large dominance by one candidate across unrelated species/water/season
  contexts.

## Variety And Exposure Metrics

Per row/scenario/goal/date sequence:

- Set A exact set stability inside one local date.
- Set B ID overlap with Set A.
- Consecutive-day exact 2x2 repeats.
- Top-pick repeat streaks.
- Total exposure by candidate ID.
- Top-pick exposure by candidate ID.
- Exposure by presentation group and family group.
- Valid candidates with zero exposure in 14-day and 30-day simulations.

Acceptance target:

- Set B should differ by at least one lure and one fly when strong valid
  alternatives exist.
- No exact same 2x2 set should repeat on adjacent days when alternatives exist
  inside quality bands.
- No single candidate should dominate unrelated contexts without an obvious
  biological reason.
- Zero-exposure inventory should be explained by narrow seasonality, weak score
  fit, or corrected by metadata/row work if the item is valid and useful.

## Acceptance Criteria

Ship-quality criteria for the live recommender:

- All requested tests pass.
- Catalog validation and generated seasonal integrity stay green.
- Every supported row can produce exactly 2 lures and 2 flies under
  representative daily scenarios.
- Surface never appears when either seasonal or daily gate is closed.
- Displayed column and pace always come from the catalog profile.
- Copy references only real score reasons, scenario state, forage matches, and
  candidate identity.
- Big-fish outputs contain credible higher-upside inventory where the row
  supports it.
- All-purpose outputs remain practical and action-oriented.
- Clarity remains a bonus only, not a hard gate.
- Set A / Set B session semantics remain unchanged.
- Image mappings remain complete for active IDs.

## Initial Harness

Added:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7
```

Useful filters:

```bash
deno run -A scripts/audit/daily-picks-quality-harness.ts --species=trout --water=freshwater_river --scenario=dirty_elevated_river --exposure-days=14
deno run -A scripts/audit/daily-picks-quality-harness.ts --species=northern_pike --scenario=windy_stained_reaction --json
```

The harness is intentionally read-only and synthetic. It does not call live
weather or mutate sessions. It builds `DailyScenario` objects directly from
fixed templates, then runs the active hard-gated pool, scorer, selector, Set B
avoid behavior, and multi-day exposure checks.

First run baseline:

- Rows inspected: 1,104.
- Row/scenario/goal contexts: 12,312.
- Failures: 0.
- Hard-gated pool health: lure min/p10/median `6/6/16`; fly min/p10/median
  `10/10/14`.
- Thin pools under 4 candidates per side: 0.
- Surface leaks: 0.
- Selected condition-reason rate: 0.653.
- Selected goal-reason rate: 0.831.
- Set B reuse review contexts: 50 / 12,312.
- Identical all-purpose/big-fish sets: 30 / 6,156 comparisons.
- Adjacent-day repeated exact sets over 7 synthetic days: 11,116 contexts.

Interpretation:

- Pool sufficiency and surface hard gates look structurally healthy in this
  synthetic sweep.
- Multi-day variety is the largest review queue. This is an observed exposure
  result, not yet proof of a bad recommendation, because synthetic conditions
  were intentionally repeated and the current selector only rotates inside
  quality bands.
- Set B reuse review contexts cluster around dirty elevated river big-fish cases
  and need pool/score trace review before tuning.
- Goal separation is mostly present by exact set, but some cold SMB river
  contexts produce identical all-purpose and big-fish sets and should be
  reviewed for honest big-fish inventory or score reasons.

## Immediate Red Flags

Observed issues:

- `scoreCandidate.ts` does not directly score `activity_level` to pace fit.
  Activity affects surface and scenario tags, but there is no explicit
  suppressed/active pace term.
- `pressure_mode` is normalized in `DailyScenario` but is not a direct scoring
  dimension. It may still influence How's score upstream.
- `buildDailyScenario.ts` currently never emits `cover_ambush`, even though
  catalog profiles use it as a condition tag.
- Selector jitter uses seed/date/goal/variant/side/slot/id. The request/session
  identity separates context, but deterministic tie-breaking does not directly
  include region, month, water type, clarity, or location unless the caller's
  seed includes them.
- `data/seasonal-matrix/schema.md` still contains a stale pre-cutover runtime
  note saying live resolution uses embedded v3 tables.
- The harness found many adjacent-day exact repeats under repeated synthetic
  conditions.

Hypotheses to test before fixing:

- The missing direct activity-to-pace term may make daily conditions less
  influential than intended in rows where active scenario tags do not match
  selected inventory.
- Pressure may not need direct scoring if How's score already carries it, but
  copy and diagnostics should not imply pressure-specific lure logic unless
  score reasons support it.
- `cover_ambush` may be useful as a catalog identity tag rather than a daily
  scenario tag, but if it is intended to affect scoring, it is currently dead as
  a condition-tag match.
- Adjacent-day repeats may be acceptable in genuinely thin or high-score-gap
  rows, but the volume of repeats suggests QA-7 should trace quality bands and
  exposure before final release confidence.
- Set B reuse in river big-fish scenarios may indicate either valid quality-band
  conservatism or thin credible high-upside river inventory.

## Recommended Next Passes

QA-2: Catalog truth audit

- Review every active lure and fly profile against
  species/water/column/pace/tag/copy truth.
- Produce a profile issue table with observed issue, biological rationale,
  recommended narrow fix, and regression test target.

QA-3: Seasonal row biology audit

- Sample and then sweep rows by species, region, month, and water type.
- Focus on surface timing, river credibility, broad pace/column ranges, and old
  padding notes.

QA-4: Pool health by row/species/water/month/goal

- Extend the harness output into saved JSON/MD summaries.
- Trace every thin or goal-reasonless review context.

QA-5: Daily-condition scenario fixtures

- Validate actual `buildDailyScenario` outputs from representative env_data,
  including wind, light, temperature, runoff, pressure, confidence, and missing
  inputs.

QA-6: All Purpose vs Big Fish separation

- Trace score tables for identical or reasonless goal outputs and decide whether
  issues are catalog tags, seasonal authoring, scoring, or acceptable biology.

QA-7: Variety/exposure simulation

- Run 14-day and 30-day simulations over stable and changing conditions.
- Determine whether no-repeat/history logic is needed or whether current
  jitter/quality-band rotation is sufficient.

QA-8: Targeted tuning fixes with regression tests

- Apply only narrow proven catalog, row, or scoring changes.
- Prefer metadata/row corrections over weight changes when the evidence points
  there.

QA-9: Final device/product QA checklist

- Repeat local tests.
- Verify real deployed edge behavior, app rendering, images, Set A/B UX, copy
  restraint, and cache/session stability.

## Caveats

- The initial harness does not prove biological accuracy; it proves structural
  behavior across synthetic conditions.
- The harness bypasses `buildDailyScenario`, so QA-5 must separately validate
  real env_data normalization.
- Archived weather replay is intentionally deferred.
- Server-side midnight weather snapshotting is out of scope for this pass.
- No tuning changes were made.
