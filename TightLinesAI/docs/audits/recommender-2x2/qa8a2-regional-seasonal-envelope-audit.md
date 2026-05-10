# QA8A.2 Regional Seasonal Envelope Audit

Date: 2026-05-09

Scope: QA8A.2 audits whether generated daily-picks seasonal row envelopes are biologically credible by species, region, month, and water type. This pass is documentation-first and audit-only. No scoring weights, biological gates, fallback borrowing, catalog metadata, seasonal CSV rows, or selector policy were changed.

Core product principle: seasonal biology decides what is legal. Daily conditions only rank within the legal row envelope. This audit asks whether the row legality envelope itself looks credible before QA8 exposure/variety work continues.

## Files Changed

- `scripts/audit/daily-picks-quality-harness.ts`
- `docs/audits/recommender-2x2/qa8a2-regional-seasonal-envelope-audit.md`

## What Was Audited

All generated daily-picks v4 seasonal rows:

| Scope | Count |
| --- | ---: |
| Total rows | 1104 |
| `largemouth_bass` rows | 384 |
| `smallmouth_bass` rows | 336 |
| `northern_pike` rows | 216 |
| `trout` rows | 168 |
| Lake/pond rows | 468 |
| River rows | 636 |
| Launch rows, March-November | 828 |
| All-month harness contexts | 12312 |
| Launch-month harness contexts | 9234 |

Fields reviewed:

- `column_range`
- `column_baseline`
- `pace_range`
- `pace_baseline`
- `surface_seasonally_possible`
- authored surface IDs in `primary_lure_ids` / `primary_fly_ids`
- obvious month/region/species/water credibility

## Audit Tooling Added

`scripts/audit/daily-picks-quality-harness.ts` now supports:

- `--envelope-audit`: static regional-seasonal envelope review mode.

The mode classifies generated rows as:

- `hard`: clear structural or biological invariant break.
- `likely`: likely row authoring issue, but not a runtime invariant failure.
- `watch`: row is plausible but should receive human biology review.

This mode is audit-only and does not affect runtime selection.

## Regional Climate Bands

| Climate band | Region keys | Rationale |
| --- | --- | --- |
| `cold_cold_temperate` | `alaska`, `great_lakes_upper_midwest`, `inland_northwest`, `mountain_alpine`, `mountain_west`, `northeast` | Cold winters, ice or near-ice conditions, delayed surface windows, conservative Jan/Feb upper and fast lanes. |
| `cool_mid_latitude` | `appalachian`, `midwest_interior`, `northern_california`, `pacific_northwest` | Shoulder-month nuance; upper can be credible earlier than surface, but May/October surface needs species/water specificity. |
| `warm_southern` | `gulf_coast`, `south_central`, `southeast_atlantic`, `southern_california` | Winter activity and upper-column windows can be plausible, but surface should remain species- and water-specific. |
| `subtropical_desert_special` | `florida`, `hawaii`, `southwest_desert`, `southwest_high_desert` | Warm or special-climate behavior can justify active winter rows; still needs restraint for trout/pike and high-desert cold snaps. |

## Expected Envelope Rules

These rules are conservative review heuristics, not runtime gates.

| Context | Expected envelope |
| --- | --- |
| Cold Jan/Feb | Surface closed; upper generally closed; no fast lane; baseline bottom or mid depending species/water. |
| Cool Jan/Feb | Surface usually closed; upper may be plausible in limited baitfish or warming-window cases; pace should mostly be slow/medium. |
| Warm southern winter | Upper can be plausible; surface may be plausible for limited warmwater bass contexts; not automatic for all species/water rows. |
| Spring transition | Upper/mid should open progressively; surface should open later than upper except warm regions. |
| Summer | Surface/upper broadly plausible for bass and pike where species and water support it; daily surface gates should still matter. |
| Fall | Upper/mid baitfish movement credible; surface should taper by region/species/month. |
| Trout | River-only; streamer column/pace should follow water temperature/runoff/season; mouse/surface windows should remain narrow and low-light credible. |
| Pike | Pike-first inventory preferred; generic bass-coded carryover should be avoided where pike-first tools already cover the row. |

## Envelope Audit Results

`deno run -A scripts/audit/daily-picks-quality-harness.ts --envelope-audit`

| Result | Count |
| --- | ---: |
| Rows audited | 1104 |
| Hard invariant breaks | 0 |
| Likely issues | 54 |
| Watch/review findings | 151 |
| Unique flagged rows | 191 |
| Launch-priority findings | 130 |
| Winter/deferred findings | 75 |

Finding codes:

| Finding code | Severity | Count | Priority |
| --- | --- | ---: | --- |
| `cold_march_fast_lane` | watch | 12 | Launch |
| `cold_shoulder_surface_window` | watch | 49 | Launch |
| `cool_shoulder_surface_window` | watch | 10 | Launch |
| `trout_surface_mouse_window` | watch | 59 | Launch |
| `winter_pike_generic_spinnerbait_padding` | likely | 54 | Winter/deferred |
| `warm_winter_active_envelope` | watch | 21 | Winter/deferred |

## Hard Invariant Findings

No hard invariant breaks were found.

Observed hard checks:

| Check | Result |
| --- | ---: |
| `column_baseline` outside `column_range` | 0 |
| `pace_baseline` outside `pace_range` | 0 |
| surface as baseline column | 0 |
| surface flag/column mismatch | 0 |
| trout lake/pond rows | 0 |
| authored surface IDs while seasonal surface is closed | 0 |
| cold Jan/Feb upper/surface rows | 0 |
| cold Jan/Feb fast rows | 0 |

## Launch-Critical Row Issues

No launch-critical hard break or likely issue was found.

The launch findings are watch/review items where the row can be biologically credible, but should be checked by Brandon before final launch polish:

| Finding | Count | Representative rows | Assessment |
| --- | ---: | --- | --- |
| Cold-region March fast lanes | 12 | `northern_pike/great_lakes_upper_midwest/m3/freshwater_lake_pond`, `trout/northeast/m3/freshwater_river` | Plausible as reaction/runoff/late-ice transition lanes, but fast should not dominate cold water. Harness selections still respect row pace. |
| Cold-region June/September surface windows | 49 | `largemouth_bass/great_lakes_upper_midwest/m6/freshwater_lake_pond`, `smallmouth_bass/inland_northwest/m9/freshwater_river` | Plausible in true summer/early-fall windows, but should remain condition-dependent. No caution-gate surface selections observed. |
| Cool mid-latitude May/October surface windows | 10 | `largemouth_bass/appalachian/m5/freshwater_lake_pond`, `largemouth_bass/northern_california/m10/freshwater_lake_pond` | May/October can be credible in low light or warm spells; row-level surface breadth should be human-reviewed. |
| Trout surface/mouse windows | 59 | `trout/appalachian/m5/freshwater_river`, `trout/great_lakes_upper_midwest/m9/freshwater_river`, `trout/mountain_alpine/m7/freshwater_river` | Trout remains river-only and surface is seasonally gated, but every trout surface row carries both `small_floating_trout_plug` and `mouse_fly`. This is the most important launch review item. |

## Winter / Deferred Row Issues

Observed likely issue:

| Finding | Count | Rows affected | Assessment |
| --- | ---: | --- | --- |
| Winter pike generic `spinnerbait` padding | 54 | Pike Dec/Jan/Feb rows across pike regions, both lake/pond and river where authored | Not a runtime invariant break: rows are bottom/mid, slow/medium, and `spinnerbait` is catalog-eligible for pike. It is still stale authoring risk because pike-first tools exist in the same rows. |

Representative winter pike rows:

| Row | Envelope | Authored concern |
| --- | --- | --- |
| `northern_pike/alaska/m1/freshwater_lake_pond` | bottom/mid, slow/medium, surface closed | Generic `spinnerbait` remains alongside pike-first tools. |
| `northern_pike/great_lakes_upper_midwest/m2/freshwater_river` | bottom/mid, slow/medium, surface closed | Generic `spinnerbait` remains despite `casting_spoon`, `large_bucktail_spinner`, `large_profile_pike_swimbait`, `pike_jerkbait`, `pike_jig_and_plastic`, and `large_pike_tube`. |
| `northern_pike/appalachian/m12/freshwater_lake_pond` | bottom/mid, slow/medium, surface closed | Generic carryover appears to be old coverage padding. |

Winter watch item:

| Finding | Count | Representative rows | Assessment |
| --- | ---: | --- | --- |
| Warm winter active envelopes | 21 | `largemouth_bass/florida/m2/freshwater_lake_pond`, `northern_pike/south_central/m1/freshwater_lake_pond`, `trout/southwest_high_desert/m2/freshwater_river` | Plausible in warm/special climates, but should be reviewed for species-specific restraint. Not automatically wrong. |

## Review But Probably Okay

Rows in this bucket are not recommended for immediate edits without score traces or Brandon review.

| Pattern | Why probably okay | What to check later |
| --- | --- | --- |
| Cold June and September surface for bass/pike | Surface can be real in northern summer and early fall, especially low light, wind lanes, vegetation, or baitfish pushes. | Confirm daily surface tags and selected inventory remain restrained under neutral/dirty/current contexts. |
| Cool May/October LMB lake surface | May and October can both produce topwater windows in mid-latitude lakes. | Consider whether `buzzbait` and walking topwater are too broadly authored in October. |
| Cold March pike/trout fast lane | Reaction bites can exist in runoff, pre-spawn pike, and streamer windows. | Confirm fast does not dominate cold-clear/suppressed contexts. |
| Warm winter active rows | Florida/Hawaii/southern rows can fish much more like shoulder season than northern winter. | Review pike/trout separately from LMB; do not apply bass logic wholesale. |

## Candidate / Output Geometry Check

Launch harness:

`deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`

| Metric | Result |
| --- | ---: |
| Rows | 828 |
| Contexts | 9234 |
| Failures | 0 |
| Lure pool min/p10/median | 6 / 7 / 17 |
| Fly pool min/p10/median | 9 / 11 / 14 |
| Thin pools under 4 per side | 0 |
| Selected geometry mismatches | 0 |
| Surface leaks | 0 |
| Caution-gate surface selections | 0 |
| Family diversity violations with in-band alternative | 0 |

All-month harness:

`deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`

| Metric | Result |
| --- | ---: |
| Rows | 1104 |
| Contexts | 12312 |
| Failures | 0 |
| Lure pool min/p10/median | 6 / 6 / 16 |
| Fly pool min/p10/median | 9 / 10 / 13 |
| Thin pools under 4 per side | 0 |
| Selected geometry mismatches | 0 |
| Surface leaks | 0 |
| Caution-gate surface selections | 0 |
| Family diversity violations with in-band alternative | 0 |

Interpretation:

Selected candidates continue to respect row-authored column, pace, and surface gates. QA8A.2 did not find a selector/runtime leak. Remaining concerns are row-authorship credibility questions.

## Observed Issues

Observed issue: winter pike rows retain generic `spinnerbait` where pike-first inventory is already available.

- Severity: likely issue.
- Priority: winter/deferred.
- Proposed fix type: seasonal row edit.
- Rationale: old bass-coded carryover is not needed where pike-first winter tools exist.
- Regression test: extend row sanity/envelope audit to assert no generic `spinnerbait` in Dec/Jan/Feb pike rows when pike-first alternatives are present, unless explicitly allowlisted.

Observed issue: trout surface rows all carry both `small_floating_trout_plug` and `mouse_fly`.

- Severity: watch/review, not proven failure.
- Priority: launch.
- Proposed fix type: seasonal row review, possibly catalog/row split later.
- Rationale: trout mouse fishing is real but should be narrower than generic surface streamer/plugin windows.
- Regression test: add a trout surface-window audit that separates `small_floating_trout_plug` from `mouse_fly` and verifies mouse appears only in strong month/region windows.

## Hypotheses

Hypothesis: cold-region June/September surface windows may be slightly broad for some bass river rows.

- Evidence: 49 cold shoulder surface windows flagged for review.
- Counter-evidence: no surface leaks or caution-gate surface selections in harness output.
- Recommended action: review selected examples with archived weather before editing rows.

Hypothesis: cold March fast lanes are biologically acceptable only if daily conditions keep fast tools from dominating cold-clear/suppressed contexts.

- Evidence: 12 cold March fast-lane rows.
- Counter-evidence: generated rows remain bottom/mid/upper as expected and harness geometry is clean.
- Recommended action: score trace cold March pike/trout rows before any row edit.

Hypothesis: warm winter active envelopes are plausible but may be too bass-like for pike/trout in some southern/special regions.

- Evidence: 21 warm winter active rows, including pike and trout.
- Counter-evidence: warm/special climate bands are intentionally not treated as northern winter.
- Recommended action: defer until winter polish unless Brandon wants winter launch confidence now.

## Recommended Fixes Or Next Pass

No immediate code or row fixes are recommended from QA8A.2 because no hard invariant break was found.

Recommended QA8B / QA9 focus:

1. Review trout surface rows and decide whether `mouse_fly` should be narrower than `small_floating_trout_plug`.
2. Remove generic `spinnerbait` from winter pike rows where pike-first tools are already present, with an allowlist if Brandon wants rare winter shallow reaction exceptions.
3. Trace cold March pike/trout fast lanes under cold-clear, dirty/runoff, and warming-trend fixtures.
4. Review cool May/October LMB surface rows for `buzzbait` and walking-topwater breadth.
5. Continue to QA8 exposure/variety knowing hard row geometry and runtime gates are clean.

## Commands Run

- `git status --short`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --row-sanity --json`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --envelope-audit`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`

## Caveats

- Regional climate bands are conservative audit heuristics, not a full fisheries model.
- The envelope audit flags row-level legality, not actual day-by-day biological optimality.
- Watch/review rows should not be edited blindly; use archived-weather replay and score traces before changing row authoring.
- The worktree contains many pre-existing QA and asset changes. This pass only added envelope audit tooling and this QA8A.2 document.
