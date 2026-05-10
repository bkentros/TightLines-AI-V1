# QA6 Archived-Weather Replay Validation

Date: 2026-05-09

Scope: QA6 validates daily-picks 2x2 behavior against fixed archived-weather-style fixture summaries for March-November launch months. This pass added replay tooling and documentation only. No scoring weights, biological gates, catalog profiles, seasonal CSV rows, generated seasonal row logic, or selector behavior were tuned.

## Files Changed

- `scripts/audit/daily-picks-archived-weather-replay.ts`
- `docs/audits/recommender-2x2/qa6-archived-weather-replay.md`

## Replay Harness

The new replay harness runs saved fixture summaries through the active `runDailyPicksEngine` path. Each fixture supplies a real dated launch-month context, species, region, water type, clarity, daylight wind, light label, thermal label, runoff label where applicable, pressure label, and How's Fishing score. The harness runs both All Purpose and Big Fish for every fixture, then reports:

- selected IDs and daily scenario tags
- surface gate state
- QA5B/watch inventory hits
- broad-fly share
- AP vs Big Fish exact-set overlap
- adjacent-day exact repeats for consecutive fixture days
- surface selections under `closed` or `caution` gates

Fixtures are checked in as stable replay data; the script does not fetch production weather snapshots or live archive APIs.

## Replay Fixture Matrix

| Fixture | Species | Region | Month | Water | Weather lane |
|---|---|---:|---:|---|---|
| lmb_fl_mar18_low_light_lake | largemouth_bass | florida | 3 | lake/pond | stained, calm, low light, warming |
| lmb_fl_mar19_windy_lake | largemouth_bass | florida | 3 | lake/pond | stained, windy, mixed light, warming |
| lmb_midwest_jun14_dirty_river | largemouth_bass | midwest_interior | 6 | river | dirty, breezy, elevated/current |
| lmb_gl_sep20_cool_low_light_lake | largemouth_bass | great_lakes_upper_midwest | 9 | lake/pond | clear, calm, low light, cooling |
| smb_gl_may07_clear_lake | smallmouth_bass | great_lakes_upper_midwest | 5 | lake/pond | clear, breezy, cool/warming |
| smb_gl_may08_low_light_lake | smallmouth_bass | great_lakes_upper_midwest | 5 | lake/pond | clear, calm, low light, cool/warming |
| smb_gl_may09_dirty_river | smallmouth_bass | great_lakes_upper_midwest | 5 | river | dirty, breezy, elevated/current |
| smb_northeast_oct18_cold_clear_river | smallmouth_bass | northeast | 10 | river | clear, calm, bright, cold/cooling |
| smb_mountain_aug12_low_light_lake | smallmouth_bass | mountain_west | 8 | lake/pond | stained, calm, low light |
| pike_gl_may15_windy_stained_lake | northern_pike | great_lakes_upper_midwest | 5 | lake/pond | stained, windy, cool/warming |
| pike_gl_may16_clear_calm_lake | northern_pike | great_lakes_upper_midwest | 5 | lake/pond | clear, calm, bright/cold |
| pike_gl_jul08_low_light_lake | northern_pike | great_lakes_upper_midwest | 7 | lake/pond | stained, calm, low light |
| pike_midwest_oct05_windy_river | northern_pike | midwest_interior | 10 | river | stained, windy, cooling |
| trout_mountain_may24_runoff | trout | mountain_west | 5 | river | dirty, breezy, elevated runoff |
| trout_app_jul15_low_light | trout | appalachian | 7 | river | stained, calm, low light |
| trout_app_jul16_windy | trout | appalachian | 7 | river | stained, breezy, mixed light |
| trout_gl_sep12_bright_clear | trout | great_lakes_upper_midwest | 9 | river | clear, breezy, bright |
| trout_alaska_jun20_low_light | trout | alaska | 6 | river | clear, calm, low light, warming |

## Aggregate Replay Results

- Fixtures: 18
- Goal runs: 36
- AP/BF identical fixture sets: 0
- Adjacent-day exact repeats: 1
- Broad-fly selected share: 0.417
- Surface selections while daily gate was closed: 0
- Caution-surface watch cases: 1

Top selected IDs:

- `clouser_minnow`: 8 Top selections, 13 total selections
- `pike_bunny_streamer`: 5 Top, 5 total
- `suspending_jerkbait`: 5 Top, 10 total
- `casting_spoon`: 4 Top, 4 total
- `deer_hair_slider`: 4 Top, 5 total
- `game_changer`: 4 Top, 8 total
- `pike_spinnerbait`: 4 Top, 4 total

QA5B/watch inventory selected:

- `big_smallmouth_tube`: 4
- `pike_spinnerbait`: 4
- `mouse_fly`: 3
- `magnum_jerkbait`: 2
- `pike_glidebait`: 2
- `shallow_minnowbait`: 2
- `wake_bait`: 2
- `weedless_spoon`: 1

## Replay Results by Species

### Largemouth Bass

Observed: daily conditions are moving inventory. The Florida windy/stained lake moved to squarebill/spinnerbait/bladed jig lanes with surface closed. The Great Lakes fall low-light lake moved Big Fish to `wake_bait`, `walking_topwater`, `deer_hair_slider`, and `mouse_fly`.

Observed: LMB `mouse_fly` and `wake_bait` did not appear outside open surface windows in this replay. The March Florida low-light Big Fish fixture preferred existing surface inventory (`walking_topwater`, `hollow_body_frog`, `deer_hair_slider`, `frog_fly`), which supports the QA5A intent that mouse_fly is not universal.

Red flag: the Midwest dirty/elevated river Big Fish fixture selected `buzzbait` and `deer_hair_slider` under `surface_daily_gate: caution`. This is not a hard leak, but it is biologically questionable enough for QA7: dirty/current river Big Fish should not drift surface-heavy unless the surface window is stronger.

### Smallmouth Bass

Observed: AP and Big Fish are clearly separated. Clear/cold lake AP stayed with `flat_sided_crankbait` / `suspending_jerkbait` and craw/baitfish fly choices, while Big Fish moved into `big_smallmouth_tube`, `magnum_jerkbait`, `game_changer`, and leech/streamer choices.

Observed: `big_smallmouth_tube` rose in both river/current and cold clear Big Fish contexts. This is directionally right.

Observed: `compact_glidebait` did not appear in the limited clear-lake replay. The lake fixtures favored `big_smallmouth_tube`, `magnum_jerkbait`, and existing hard-bait inventory instead. That does not prove a bug, but it suggests compact_glidebait may be narrow enough that QA7 should inspect score traces before changing rows or tags.

Red flag: one exact adjacent-day repeat occurred for Great Lakes SMB lake All Purpose from 2025-05-07 to 2025-05-08: `flat_sided_crankbait / suspending_jerkbait / warmwater_crawfish_fly / clouser_minnow`. This confirms adjacent-day repeats are not only a synthetic-harness artifact.

### Northern Pike

Observed: pike-first reaction tools are working. Windy/stained lake and windy fall river fixtures selected `pike_spinnerbait` as Top lure for both AP and Big Fish, with pike-first fly support such as `pike_bunny_streamer` and `pike_flash_fly`.

Observed: clear/calm pike Big Fish split correctly into `pike_glidebait` plus `weedless_spoon`, while AP used `inline_spinner` and `shallow_minnowbait`. The split is sensible enough for launch validation.

Observed: low-light summer pike moved to surface/upside inventory in Big Fish: `large_pike_topwater`, `pike_glidebait`, `deer_hair_slider`, and `frog_fly`.

Red flag: pike reaction is very concentrated on `pike_spinnerbait`; `weedless_spoon` appeared only once and not in the windy/stained fixture. That may be biology, row authoring, or score competition. QA7 should trace pike reaction-band alternatives before tuning.

### Trout

Observed: trout runoff produced `runoff_streamer` and `current_swing` tags and selected `sculpin_streamer` / `sculpzilla` in the runoff fixture, with `clouser_minnow` and `articulated_baitfish_streamer` still present.

Observed: trout `mouse_fly` appeared only in low-light open-surface Big Fish fixtures in this replay: Appalachian July and Alaska June. It did not appear in the bright/clear September fixture.

Red flag: broad trout flies remain frequent. `clouser_minnow`, `game_changer`, and `articulated_baitfish_streamer` still carry a large share of trout selections, even when more specific runoff or surface inventory is present.

## High-Volume Selection Review

`magnum_jerkbait`: selected twice, both in SMB Big Fish cold/clear or low-light shoulder contexts. QA6 does not show overuse.

`shallow_minnowbait`: selected twice, both as pike AP inventory in clear/calm or low-light lake contexts. QA6 does not show universal pike dominance, but its AP role should stay under watch.

`pike_spinnerbait`: selected four times, always as pike reaction inventory in windy/stained or windy/cooling contexts. Biologically sensible, but concentration is high relative to other pike reaction tools.

`big_smallmouth_tube`: selected four times, aligned with SMB bottom/current or cold Big Fish lanes.

`wake_bait`: selected twice, both in low-light surface-open bass Big Fish contexts.

`mouse_fly`: selected three times, all low-light surface-open Big Fish contexts, two trout and one LMB.

Broad flies: `clouser_minnow` and `game_changer` remain high-volume. This is the largest unresolved catalog/row/scoring quality question from QA6.

## AP vs Big Fish Separation Findings

Observed: no fixture produced identical AP and Big Fish four-pick sets.

Observed: AP generally kept reliable/search/action tools, while Big Fish shifted to upside, surface, larger profile, or streamer tools. Examples:

- LMB fall low light: AP `suspending_jerkbait` / `flat_sided_crankbait`; Big Fish `wake_bait` / `walking_topwater`.
- SMB cold clear river: AP `suspending_jerkbait` / `tube_jig`; Big Fish `big_smallmouth_tube` / `magnum_jerkbait`.
- Pike clear calm lake: AP `inline_spinner` / `shallow_minnowbait`; Big Fish `pike_glidebait` / `weedless_spoon`.
- Trout runoff: AP `clouser_minnow` / `sculpin_streamer`; Big Fish `articulated_baitfish_streamer` / `sculpzilla`.

## Red Flags

Observed: broad flies still over-represent real replay selections. Broad fly share was 0.417 of selected fly slots, with `clouser_minnow` selected 13 times and `game_changer` 8 times across 72 fly slots.

Observed: LMB dirty/elevated river Big Fish selected surface items under a caution surface gate. There was no closed-gate leak, but this is a biological credibility issue for QA7.

Observed: adjacent-day exact repeat occurred in real fixture replay for Great Lakes SMB lake AP. Exposure/adjacent-day policy still needs work.

Observed: pike reaction splits are pike-first, but `pike_spinnerbait` is doing most of the work. `weedless_spoon` and bucktail/spoon alternatives need trace review before any tuning.

Hypothesis: `compact_glidebait` may be too narrow or outscored by other SMB Big Fish inventory in archived clear-lake windows. QA6 does not prove a bug because the fixture sample is intentionally small.

## Recommended Narrow Fixes for QA7

1. Add a score-trace QA pass for broad flies by species/row. Focus `clouser_minnow`, `game_changer`, `articulated_baitfish_streamer`, `articulated_dungeon_streamer`, and `unweighted_baitfish_streamer`.

2. Investigate surface caution policy, especially dirty/current river Big Fish. The likely narrow fix is selector/scoring treatment of `surface_daily_gate: caution`, not broader catalog gates.

3. Add adjacent-day exposure policy for Set A after biology validation. The replay confirms exact repeats can occur under real fixture variation.

4. Trace pike reaction alternatives inside the honorable quality band: `pike_spinnerbait`, `large_bucktail_spinner`, `weedless_spoon`, `shallow_minnowbait`, `casting_spoon`, and pike swimbaits.

5. Trace compact_glidebait in clear SMB lake rows before changing metadata or rows. Confirm whether it is absent because of score competition, row seasonality, or fixture coverage.

6. Keep trout mouse_fly narrow but replay more low-light summer/fall trout fixtures before changing rows.

## Tests Run

- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-archived-weather-replay.ts`

## Caveats

This is a lightweight fixed-fixture replay, not a statistically representative archive sweep. The fixture matrix is intentionally small and targeted to launch risks exposed by QA5A-QA5C. Results are stable and repeatable, but QA7 should use score traces and possibly a larger fixture grid before making behavior changes.
