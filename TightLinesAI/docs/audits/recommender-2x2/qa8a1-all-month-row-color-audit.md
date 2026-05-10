# QA8A.1 All-Month Row Biology + Color Guidance Sanity Audit

Date: 2026-05-09

Scope: QA8A.1 extended the QA8A launch-month audit to all 12 months across all generated daily-picks rows, with special attention to winter/northern embarrassment checks and color recommendation paths. This pass added audit tooling and documentation only. No scoring weights, gates, fallback borrowing, catalog metadata, seasonal CSV rows, or color behavior were changed.

## Files Changed

- `scripts/audit/daily-picks-quality-harness.ts`
- `docs/audits/recommender-2x2/qa8a1-all-month-row-color-audit.md`

## What Was Audited

All generated daily-picks v4 seasonal rows:

- Total rows: 1104
- `largemouth_bass`: 384
- `smallmouth_bass`: 336
- `northern_pike`: 216
- `trout`: 168
- Water types: 468 lake/pond rows and 636 river rows

Regions covered:

- `alaska`
- `appalachian`
- `florida`
- `great_lakes_upper_midwest`
- `gulf_coast`
- `hawaii`
- `inland_northwest`
- `midwest_interior`
- `mountain_alpine`
- `mountain_west`
- `northeast`
- `northern_california`
- `pacific_northwest`
- `south_central`
- `southeast_atlantic`
- `southern_california`
- `southwest_desert`
- `southwest_high_desert`

Automated cold-winter watch regions used by the row sanity mode:

- `alaska`
- `great_lakes_upper_midwest`
- `inland_northwest`
- `midwest_interior`
- `mountain_alpine`
- `mountain_west`
- `northeast`
- `pacific_northwest`

## Audit Tooling Added

`scripts/audit/daily-picks-quality-harness.ts` now supports:

- `--row-sanity`: static all-row biology/invariant summary.
- Selected-output geometry counters in normal harness mode:
  - `selected_geometry_mismatches`
  - `surface_caution_selections`

These are audit-only diagnostics. They do not affect runtime selection.

## Northern Winter Surface/Upper Findings

Observed all-month sanity results:

- Cold Jan/Feb rows with upper or surface availability: 0
- Cold Jan/Feb fast-only rows: 0
- Cold Jan/Feb rows including fast pace: 0
- Warmwater surface IDs in cold Dec/Jan/Feb rows: 0
- Surface IDs authored when seasonal surface is closed: 0

Interpretation:

Northern and mountain winter geometry is conservative. The specific concern that northern February might allow surface or upper presentations for LMB, SMB, pike, or trout was not observed.

Southern winter surface/upper rows were not automatically flagged. That remains biologically plausible in Florida, Hawaii, Gulf Coast, desert, and some southern-climate contexts, and this pass did not treat those rows as issues without evidence.

## Surface/Column/Pace Invariant Findings

All-month row sanity mode:

- `bad_column_baseline`: 0
- `bad_pace_baseline`: 0
- `surface_baseline`: 0
- `surface_column_flag_mismatch`: 0
- `trout_lake_or_pond_rows`: 0
- `surface_ids_when_seasonal_surface_closed`: 0

Launch harness with new geometry counters:

- Rows: 828
- Contexts: 9234
- Failures: 0
- Selected geometry mismatches: 0
- Surface leaks: 0
- Caution surface selections: 0
- Pool health: lure min/p10/median 6/7/17; fly min/p10/median 9/11/14; thin pools 0

All-month harness with new geometry counters:

- Rows: 1104
- Contexts: 12312
- Failures: 0
- Selected geometry mismatches: 0
- Surface leaks: 0
- Caution surface selections: 0
- Pool health: lure min/p10/median 6/6/16; fly min/p10/median 9/10/13; thin pools 0

Interpretation:

Selected candidates respect row-authored column and pace envelopes across launch and all-month harness sweeps. No selected surface candidate appeared when seasonal surface was closed, when daily surface was closed, or under the QA7 caution scenarios used by the harness.

## Launch-Critical March-November Findings

No new launch-critical row geometry issue was found.

Launch row behavior remains consistent with QA8A:

- No selected geometry mismatches.
- No surface leaks.
- No caution-gate surface selections in the harness scenarios.
- No family-diversity violation with in-band alternatives.

Known launch risks remain out of scope for this pass:

- Broad flies remain high-volume.
- Adjacent-day repeats remain high.
- Some thin/constrained contexts still produce identical AP/BF sets.

Those are exposure/row-authoring polish items, not QA8A.1 row-geometry failures.

## Winter / Deferred Findings

Observed issue: 54 northern pike winter rows carry generic `spinnerbait` while also carrying pike-first tools.

Details:

- `pike_rows_with_bass_coded_lures`: 54
- `pike_rows_with_bass_coded_and_pike_first_lures`: 54
- Launch rows with this issue: 0
- Winter rows with this issue: 54

Representative rows:

- `northern_pike/alaska/m1/freshwater_lake_pond`: `spinnerbait` plus `pike_jig_and_plastic`, `casting_spoon`, `large_bucktail_spinner`, `large_profile_pike_swimbait`, `pike_jerkbait`
- `northern_pike/great_lakes_upper_midwest/m2/freshwater_river`: `spinnerbait` plus `casting_spoon`, `large_bucktail_spinner`, `large_profile_pike_swimbait`, `pike_jerkbait`, `pike_jig_and_plastic`, `large_pike_tube`

Assessment:

This is not a hard invariant break because `spinnerbait` is catalog-eligible for pike and the rows remain bottom/mid and slow/medium. It is, however, old coverage-padding risk. Winter pike rows already have pike-first tools, so QA8B/QA9 should consider removing generic `spinnerbait` from winter pike rows unless a row-specific shallow reaction reason is documented.

No winter topwater embarrassment was observed:

- No `buzzbait`, frog, mouse, wake bait, large pike topwater, popper/slider/gurgler, or other surface IDs appeared in cold-region winter rows.

## Color Logic Findings

Status: daily-picks 2x2 color guidance is inactive.

Observed active response/backend state:

- `DailyPicksResponsePick` in `shapeDailyPicksResponse.ts` contains identity, family/presentation group, column, pace, surface, score, reasons, `why_chosen`, and `how_to_fish`.
- It does not include color family, palette, color label, color copy, or color recommendation fields.
- The frontend mirror in `lib/recommenderContracts.ts` also has no color fields.
- `components/fishing/RecommenderView.tsx` renders image, slot, family/presentation, column, pace, surface, `why_chosen`, and `how_to_fish`; it does not render color guidance.
- `lib/recommender.ts` cache validation only checks the daily-picks shape and does not expect or preserve color guidance.

Observed active frontend residue:

- `app/recommender.tsx` imports `ALL_COLOR_PALETTE_IMAGES` and preloads the three palette images.
- `lib/colorPaletteImages.ts` still exports `ColorFamily`, `getColorPaletteImage`, and `ALL_COLOR_PALETTE_IMAGES`.
- The file explicitly notes that daily-picks 2x2 no longer sends palette guidance and that the lookup remains only for future explicit palette features.

Observed legacy/stale docs:

- `docs/audits/recommender-2x2/current-runtime-map.md` still describes an older rebuild adapter that built a color decision.
- `docs/audits/recommender-2x2/pass9a-old-engine-cleanup.md` says the old color decision files were removed and daily-picks contracts no longer include the old ranked output.

Assessment:

No stale visible UI appears to imply color guidance to users. The only active color-related code path is image preloading for palette assets, not recommendation display or backend output. Therefore QA8A.1 does not recommend adding color behavior now.

If color guidance returns later, it should be a modest advisory layer based on water clarity, light, forage, and presentation type. It must not hard-gate candidates or overpower seasonal biology.

## Observed Issues vs Hypotheses

Observed issue:

- Winter pike rows retain generic `spinnerbait` in 54 Dec/Jan/Feb rows even where pike-first tools exist.

Observed non-issues:

- No northern/cold Jan-Feb surface or upper row geometry.
- No cold Jan-Feb fast-only or fast-included pace envelopes.
- No surface flag/column mismatch.
- No trout lake/pond rows.
- No closed-season surface IDs.
- No selected output geometry mismatch.
- No selected surface pick under closed or caution daily gates in the harness sweeps.
- No active daily-picks color recommendation output or UI.

Hypotheses requiring later follow-up:

- Winter pike `spinnerbait` may be harmless under scoring because pike-first tools often outcompete it, but it is still row-authoring clutter and should be removed or justified in a winter cleanup.
- Broad flies and adjacent-day repeats are not caused by all-month row geometry failures, but remain product-quality risks.
- Stale audit docs could confuse future agents about whether color is active; a docs cleanup pass should reconcile `current-runtime-map.md` with pass9a cleanup notes.

## Fix Recommendation

Do not tune runtime behavior in QA8A.1.

Recommended later fixes:

1. Winter/deferred row cleanup: remove generic `spinnerbait` from winter pike rows where pike-first options already cover the biological lane.
2. Add a regression test or row-sanity assertion for cold-region Jan/Feb rows: no surface, no upper, no fast pace unless explicitly exempted.
3. Add a row-sanity assertion that closed seasonal surface rows do not author surface IDs.
4. Clean stale docs that still describe old active color-decision paths.

## Commands Run

- `git status --short`
- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --row-sanity`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`

## Recommended Next Pass

QA8B should be an exposure/variety and winter-row cleanup pass:

1. Address adjacent-day exact repeats without weakening biological gates.
2. Add durable row-sanity tests for winter/cold-region traps.
3. Clean winter pike `spinnerbait` padding.
4. Continue broad-fly row authoring review.
5. Reconcile stale docs around the retired color-decision path.
