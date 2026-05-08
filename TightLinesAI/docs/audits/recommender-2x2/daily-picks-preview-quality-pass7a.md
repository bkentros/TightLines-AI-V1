# Daily Picks Preview Quality Audit - Pass 7A

Date: 2026-05-08  
Scope: Fixture-based internal quality audit for the gated daily-picks 2x2 preview path.  
Runtime under audit: `runDailyPicksSurface` direct calls, not the production 3:3 path.

## Summary

Pass 7A added fixture coverage for realistic archived-day-style scenarios using injected shared-condition analysis and realistic request/env metadata. The goal was to prove invariants and document recommendation quality, not to tune scoring, catalog profiles, seasonal rows, UI, sessions, or migrations.

The preview engine consistently returned exactly four future 2x2 picks, preserved intrinsic catalog column/pace/surface/display fields, selected only row-authored species/water-compatible candidates, honored seasonal and daily surface gates, kept removed trout/pike padding IDs absent in the targeted scenarios, separated all-purpose and big-fish score reasons, and produced a Set B that avoided Set A IDs in a rich Florida bass fixture.

## Fixture Results

| Fixture | Goal | Surface gate | Scenario tags | Confidence | Selected IDs | Judgment |
|---|---|---|---|---|---|---|
| Florida largemouth, lake/pond, July, stained, calm low-light active | all_purpose | open | calm_surface, low_light_surface, heat_finesse | high | Lure: `suspending_jerkbait`; honorable lure: `drop_shot_minnow`; fly: `popper_fly`; honorable fly: `clouser_minnow` | Biologically plausible. All-purpose did not use big-fish score reasons. Surface is open, and a popper is credible in warm calm low light. |
| Florida largemouth, same setup | big_fish | open | calm_surface, low_light_surface, heat_finesse | high | Lure: `walking_topwater`; honorable lure: `hollow_body_frog`; fly: `deer_hair_slider`; honorable fly: `frog_fly` | Goal shift is visible and plausible for warm Florida low-light surface opportunity. This is aggressive/high-upside rather than action-first. |
| Northern Michigan largemouth, lake/pond, March, clear cold | all_purpose | closed | clear_subtle, cold_slow | high | Lure: `tube_jig`; honorable lure: `carolina_rigged_stick_worm`; fly: `lead_eye_leech`; honorable fly: `jighead_marabou_leech` | Correctly does not resurrect topwater when the seasonal row closes surface. Cold/slow and clear/subtle direction is plausible. |
| Trout river, Great Lakes/Upper Midwest, April, cold clear stable | all_purpose | closed | clear_subtle, cold_slow | high | Lure: `suspending_jerkbait`; honorable lure: `hair_jig`; fly: `clouser_minnow`; honorable fly: `woolly_bugger` | Removed trout `popper_fly` and `deer_hair_slider` stay absent. Output is usable, but trout fly specificity remains a follow-up area because generic streamers/buggers can still win. |
| Trout river, Mountain West, May, stained elevated runoff | all_purpose | closed | wind_reaction, dirty_vibration, cold_slow, runoff_streamer, current_swing, open_water_search | high | Lure: `inline_spinner`; honorable lure: `casting_spoon`; fly: `clouser_minnow`; honorable fly: `woolly_bugger` | Runoff/current tags are present and surface stays closed. The result is defensible as subsurface search, but future tuning should make trout runoff streamer profiles compete more explicitly. |
| Northern pike river, Great Lakes/Upper Midwest, March, cold suppressive | all_purpose | closed | cold_slow | high | Lure: `inline_spinner`; honorable lure: `pike_jig_and_plastic`; fly: `clouser_minnow`; honorable fly: `articulated_baitfish_streamer` | `tube_jig` and `woolly_bugger` remain absent. Pike-first lure inventory works after the `large_pike_tube` repair, but pike generic fly cleanup is not complete. |
| Northern pike lake/pond, Great Lakes/Upper Midwest, June, stained | big_fish | caution | wind_reaction, dirty_vibration, open_water_search | high | Lure: `large_bucktail_spinner`; honorable lure: `pike_jerkbait`; fly: `pike_flash_fly`; honorable fly: `large_articulated_pike_streamer` | Strong result. Big-fish/upside reasons are present, and selected profiles are pike-appropriate, large/flash/reaction-oriented. |
| Florida largemouth, lake/pond, July, missing wind | all_purpose | closed | heat_finesse | medium | Lure: `suspending_jerkbait`; honorable lure: `drop_shot_minnow`; fly: `clouser_minnow`; honorable fly: `deceiver` | Correctly closes surface and copy stays uncertainty-aware because wind is missing. |
| Great Lakes/Upper Midwest largemouth, lake/pond, June, dirty windy | all_purpose | closed | wind_reaction, dirty_vibration | high | Lure: `squarebill_crankbait`; honorable lure: `spinnerbait`; fly: `baitfish_slider_fly`; honorable fly: `unweighted_baitfish_streamer` | Reaction/vibration tags lift valid candidates without bypassing surface gates. The fly side is acceptable but still reflects warmwater generic streamer inventory. |
| Florida largemouth rich pool Set A -> Set B | all_purpose | open | low_light_surface, wind_reaction, dirty_vibration, heat_finesse, open_water_search | high | Set A: `spinnerbait`, `lipless_crankbait`, `clouser_minnow`, `popper_fly`; Set B: `bladed_jig`, `squarebill_crankbait`, `game_changer`, `articulated_baitfish_streamer` | Variant B avoided all Set A IDs in this rich pool while staying inside row-authored candidates. |

## Invariants Added

The new fixture test file checks:

- Every future preview response has exactly four named slots.
- Selected pick IDs match diagnostics selected IDs.
- Every selected pick is row-authored for that species/region/month/water row.
- Catalog species and water eligibility match the response species/water type.
- Surface picks only appear when the seasonal row allows surface and the daily surface gate is not closed.
- Removed seasonal cleanup IDs remain absent in targeted fixtures: trout `popper_fly`/`deer_hair_slider`, pike `tube_jig`/`woolly_bugger`.
- Big-fish fixtures include at least one big-fish/upside score reason when valid pools support it.
- All-purpose fixtures do not leak big-fish score reasons.
- Missing-wind fixtures do not open surface and do not produce overconfident `why_chosen` copy.
- Intrinsic catalog display, column, pace, and surface fields are preserved in response shaping.
- Set B can avoid Set A IDs when alternatives exist.

## Questionable Outputs / Follow-Up Risks

- Trout streamer selection still leans generic in the tested cold-clear and elevated-runoff fixtures (`clouser_minnow`, `woolly_bugger`). This is not a regression from Pass 5B/5C, but it confirms that future trout fly specificity work remains valuable.
- Pike suppressive river output correctly excludes `tube_jig`/`woolly_bugger`, but still selects generic fly profiles. Future pike fly cleanup or scoring weight review should make pike-first flies win more consistently.
- The trout elevated-runoff fixture produced `runoff_streamer` and `current_swing` scenario tags, but selected picks did not expose a `condition_tag:runoff_streamer` score reason in the final four. That suggests the valid pool/scoring can recognize the day but may need later tuning or inventory cleanup to make trout runoff-specialist profiles rise.
- Florida big-fish surface output looks tactically coherent, but it also highlights the known Big Fish inventory gap: true glidebait-style bass inventory is still absent and should remain a later catalog/inventory pass, not a Pass 7A change.

## Recommended Follow-Ups

1. Use this fixture suite as a guardrail before any scoring/catalog/seasonal tuning.
2. Add a Pass 7B tuning audit for questionable but non-blocking outputs, especially trout runoff streamer competition and pike generic fly competition.
3. Continue remaining seasonal cleanup for pike generic flies and bass/pike row padding only in narrow, tested passes.
4. Add true big-fish inventory such as glidebait in a dedicated catalog/inventory pass after deciding image and seasonal-row support.
5. Keep the `recommendation_goal` migration as a deployment prerequisite before any deployed preview or cutover relying on session keying.

## Pass 7B Follow-Up

Pass 7B inspected score/reason traces for the two non-blocking Pass 7A findings and made two narrow catalog tag corrections rather than changing global scoring weights or seasonal rows.

### Trout elevated-runoff streamer competition

Cause found: the Mountain West May trout runoff fixture already authored runoff-relevant fly inventory, but the final honorable slot preferred presentation diversity from a generic leech/bugger over a runoff-tagged streamer. The strongest exact runoff specialist already in the row was `sculpzilla`, while `sculpin_streamer` had the right river-bottom sculpin profile but lacked the `runoff_streamer` tag. In elevated/dirty trout current, a sculpin streamer is a credible runoff streamer profile.

Change made: added `runoff_streamer` to `sculpin_streamer.condition_tags`.

After result:

| Fixture | Goal | Surface gate | Scenario tags | Selected IDs | Result |
|---|---|---|---|---|---|
| Trout river, Mountain West, May, stained elevated runoff | all_purpose | closed | wind_reaction, dirty_vibration, cold_slow, runoff_streamer, current_swing, open_water_search | Lure: `inline_spinner`; honorable lure: `casting_spoon`; fly: `clouser_minnow`; honorable fly: `sculpin_streamer` | Target met. At least one selected fly now carries a real `condition_tag:runoff_streamer` score reason while surface remains closed and removed trout popper/slider IDs remain absent. |

### Northern pike cold/suppressive river fly specificity

Cause found: the pike suppressive river row already authored pike-only fly profiles, but `pike_bunny_streamer` and `large_articulated_pike_streamer` lacked `cold_slow`. Generic multi-species baitfish streamers were scoring ahead because they had stronger all-purpose/search reasons. A large rabbit-strip pike streamer fished slow with pauses is credible in cold/suppressive pike river conditions without making all-purpose pike selection blindly giant or high-risk.

Change made: added `cold_slow` to `pike_bunny_streamer.condition_tags`.

After result:

| Fixture | Goal | Surface gate | Scenario tags | Selected IDs | Result |
|---|---|---|---|---|---|
| Northern pike river, Great Lakes/Upper Midwest, March, cold suppressive | all_purpose | closed | cold_slow | Lure: `inline_spinner`; honorable lure: `pike_jig_and_plastic`; fly: `clouser_minnow`; honorable fly: `pike_bunny_streamer` | Target met. The fly side now includes a pike-only profile while `tube_jig` and `woolly_bugger` remain absent. |

### Test fixture correction

The pike suppressive fixture now supplies explicit 5 mph hourly wind instead of relying on the helper default hourly wind, so the fixture better matches its intended cold/suppressive calm-river scenario. The dirty/windy fixture now supplies explicit 17 mph hourly wind for the same reason. This is a test-fixture clarity fix only; production wind handling still correctly prefers valid hourly wind over scalar fallback.

No seasonal CSVs, generated seasonal rows, global score weights, selector behavior, frontend code, migrations, or production cutover paths were changed.

## Pass 7C Follow-Up

Pass 7C added the first narrow Big Fish bass lure inventory path: `glidebait`.

### Catalog profile

`glidebait` is authored as a bass-only lake/pond lure, not a general coverage tool:

- Species: `largemouth_bass`, `smallmouth_bass`
- Water: `freshwater_lake_pond`
- Column/pace: `mid`, primary `slow`, secondary `medium`
- Forage: `baitfish`, `bluegill_perch`
- Clarity strengths: `clear`, `stained`
- Condition tags: `clear_subtle`, `open_water_search`, `cover_ambush`
- Goal tags: `big_fish_upside`, `high_risk_high_reward`

It has no all-purpose goal tags, no surface identity, no trout/pike eligibility, and no dirty-water clarity strength.

### Seasonal authoring

`glidebait` was added only to five bass lake/pond seasonal rows:

| Species | Region | Month | Water type | Rationale |
|---|---|---:|---|---|
| largemouth_bass | florida | 3 | freshwater_lake_pond | Southern prespawn/spawn-adjacent big-profile bass window with mid/upper seasonal envelope and baitfish/bluegill forage. |
| largemouth_bass | florida | 7 | freshwater_lake_pond | Warm-water big-fish lake/pond option when daily conditions support slow visible profile rather than dirty reaction or surface-only choices. |
| largemouth_bass | great_lakes_upper_midwest | 6 | freshwater_lake_pond | Northern lake/pond post-spawn/early summer row with mid-column access and bluegill/baitfish forage. |
| smallmouth_bass | great_lakes_upper_midwest | 6 | freshwater_lake_pond | Clear/stained northern lake smallmouth big-bait window with baitfish secondary forage. |
| smallmouth_bass | great_lakes_upper_midwest | 9 | freshwater_lake_pond | Fall northern lake smallmouth baitfish window with mid-column access. |

It was not added to trout, pike, river rows, northern March bass, or broad bottom-only/cold rows.

### Fixture outcome

New preview fixture coverage confirms:

- In a clear Florida largemouth lake/pond Big Fish fixture where the row authors `glidebait`, `glidebait` can be selected as Lure of the Day with real `goal:big_fish:*` score reasons.
- The same fixture under `all_purpose` does not select `glidebait` when reliable/versatile alternatives exist.
- Dirty/windy poor-fit bass conditions do not promote `glidebait` above better valid options.
- Northern March largemouth still does not author `glidebait` and still does not resurrect surface/topwater.
- Existing Pass 7A/7B invariants and Set B variety continue passing.

No global scoring weights, selector behavior, frontend code, migrations, image assets, trout/pike rows, or production cutover paths were changed.

## Files Inspected / Exercised

- `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/previewQualityFixtures.test.ts`
