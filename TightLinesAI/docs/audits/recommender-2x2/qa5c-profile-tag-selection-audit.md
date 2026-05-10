# QA5C Profile, Tag, Family, and Selection-Context Audit

Date: 2026-05-09

Scope: QA5C validates the QA5B inventory additions and the QA5A mouse_fly largemouth usage. This pass made only narrow catalog metadata, family taxonomy, copy, and catalog-test corrections. It did not add inventory, tune scoring weights, weaken gates, add runtime fallbacks, or author seasonal CSV changes.

## Files Changed

- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `docs/audits/recommender-2x2/qa5c-profile-tag-selection-audit.md`

## Method

- Rebuilt and validated generated seasonal rows before and after catalog review.
- Traced launch-month selection contexts across the six harness scenarios for:
  - compact_glidebait
  - magnum_jerkbait
  - big_smallmouth_tube
  - wake_bait
  - magnum_worm
  - pike_spinnerbait
  - weedless_spoon
  - shallow_minnowbait
  - pike_glidebait
  - bluegill_streamer
  - mouse_fly largemouth_bass usage
- Audited same-style Top Pick / Honorable Mention risk for these pairs:
  - compact_glidebait vs glidebait
  - big_smallmouth_tube vs tube_jig
  - shallow_minnowbait vs pike_jerkbait
  - pike_spinnerbait vs spinnerbait

## Profile and Tag Findings

Observed: pike_spinnerbait is pike-first and contextually correct. It remains `species_allowed: ["northern_pike"]`, is allowed in lake/pond and river, and carries pike-credible stained/dirty reaction tags: `wind_reaction`, `dirty_vibration`, and `cover_ambush`. Trace samples show it rising in windy/stained pike all-purpose and dirty/elevated river contexts via condition, clarity, forage, and reliable-action reasons.

Observed: mouse_fly largemouth_bass selection remains narrow. In launch trace, largemouth mouse_fly selections occurred only for `largemouth_bass / freshwater_lake_pond / calm_low_light_surface_stress / big_fish`. No LMB river or all-purpose mouse_fly leakage was observed. Existing trout mouse_fly selections remain in trout river calm-low-light big-fish contexts; that is outside the LMB expansion question but should be replayed in QA6.

Observed: wake_bait and mouse_fly rise in the intended low-light surface lane. Both remain surface, slow/medium, Big Fish / high-risk inventory, and trace selection is tied to `calm_surface` and `low_light_surface`.

Observed: magnum_worm is aligned to warm cover LMB Big Fish. It is bottom, slow/medium, lake/pond-only, largemouth-only, and rises in heat/clear or cover-driven LMB Big Fish contexts through `heat_finesse` and `cover_ambush`.

Observed: bluegill_streamer needed one narrow condition-tag fix. It was biologically correct inventory but lacked a warm-context tag in the LMB cover/bluegill lane. QA5C added `warming_search`, which gives it an honest condition reason when it rises in warm low-light LMB lake contexts.

Observed: compact_glidebait is a credible SMB lake Big Fish tool. It remains lake/pond-only, smallmouth-only, clear/stained, mid-column, slow/medium, and rises in clear SMB lake Big Fish contexts through `clear_subtle`, forage, and Big Fish tags.

Observed: big_smallmouth_tube is a credible SMB bottom/current Big Fish tool. It remains bottom, slow/medium, lake/pond and river, smallmouth-only, and rises in clear/cold/current Big Fish contexts through `clear_subtle`, `cold_slow`, and `current_swing`.

Observed: shallow_minnowbait is pike AP inventory, not a pike_jerkbait clone in selected launch contexts. It is pike-only, mid-column, medium/slow, clear/stained, and rises in warming/search contexts. No selected Top/HM pairings with pike_jerkbait were observed in the QA5C trace.

Observed: weedless_spoon is contextually useful but rarely a Top Pick. It rose in pike lake wind/stain cover contexts and usually acted as Honorable Mention or Set B inventory. That is acceptable for launch, but QA6 should confirm whether it is too low-ceiling in real weather.

## Family-Group Fixes

Observed issue: compact_glidebait and glidebait could appear as different selector families even though they are same-style hard-swimbait/glide presentations. Pre-fix trace found 2 same-style selected pair contexts. Fix: set `compact_glidebait.family_group` to `hard_swimbait`, matching glidebait. Post-fix trace found 0 same-style selected pair contexts for this pair.

Observed issue: big_smallmouth_tube and tube_jig could appear as different selector families even though both are tube presentations. Pre-fix trace found 61 same-style selected pair contexts. Fix: set `tube_jig.family_group` to `tube_jig`, matching big_smallmouth_tube. Post-fix trace found 0 same-style selected pair contexts for this pair.

Observed acceptable separation: pike_spinnerbait and generic spinnerbait should not share a selector family because pike_spinnerbait is pike-first inventory while spinnerbait is bass/general inventory. Generic spinnerbait is not present in pike launch rows after QA5A; trace found 0 selected same-style pike_spinnerbait/spinnerbait contexts. QA5C added a test asserting pike_spinnerbait is pike-only and keeps a different family from generic spinnerbait.

Observed acceptable separation: shallow_minnowbait and pike_jerkbait share a jerk/minnow presentation neighborhood, but selected QA5C contexts did not produce duplicate Top/HM style pairings. No family change was made.

## Copy and Column/Pace Alignment

Observed issue: weedless_spoon was profiled as mid-column but copy leaned too shallow in places. Fix: updated copy to describe upper-to-mid lanes, cover lanes, controlled pace, and fluttering through shallow-to-mid cover without changing the column or pace.

Observed issue: shallow_minnowbait was profiled as mid-column but copy leaned too shallow in places. Fix: updated copy to describe upper-to-mid/top-few-feet behavior without changing the column or pace.

No column, pace, seasonal row, or scoring changes were made.

## Scenario-Selection Findings

Windy/stained pike: pike_spinnerbait, weedless_spoon, large bucktail/flash inventory, and other pike-first reaction tools remain active. pike_spinnerbait received direct wind/stain/dirty-vibration reasons and is behaving as the primary pike-first AP improvement from QA5B.

Clear/calm pike Big Fish: pike_glidebait and pike_jerkbait rise in clear/stained lake Big Fish contexts. pike_glidebait scored through `clear_subtle`, Big Fish, high-risk, forage, and mid-column alignment.

Low-light bass surface: wake_bait and LMB mouse_fly rise in lake/pond Big Fish contexts tied to surface conditions. No launch trace showed mouse_fly as LMB all-purpose or LMB river inventory.

Warm cover LMB Big Fish: magnum_worm and bluegill_streamer now both have honest condition paths. The bluegill_streamer `warming_search` addition turned a biologically reasonable selection into a traceable one.

Clear SMB lake Big Fish: compact_glidebait rises as intended, but no longer pairs with glidebait as a different selector family.

SMB bottom/current Big Fish: big_smallmouth_tube rises as intended, but no longer pairs with tube_jig as a different selector family.

## Harness Results

Launch months, all scenarios:

- Rows: 828
- Contexts: 9234
- Failures: 0
- Pool health: lure min/p10/median 6/7/17; fly min/p10/median 9/11/14; thin <4 per side 0
- Condition-reason rate: 0.668
- Goal-reason rate: 0.881
- Surface leaks: 0
- Set B reuse reviews: 15/9234
- Identical AP/BF sets: 13/4617
- Adjacent-day repeated sets: 8278
- Family diversity same-family with in-band alternative: Set A lures=0, flies=0; Set B lures=0, flies=0

Launch months, calm low-light surface stress:

- Rows: 828
- Contexts: 1656
- Failures: 0
- Pool health: lure min/p10/median 6/7/18; fly min/p10/median 9/11/15; thin <4 per side 0
- Condition-reason rate: 0.530
- Goal-reason rate: 0.909
- Surface leaks: 0
- Set B reuse reviews: 0/1656
- Identical AP/BF sets: 3/828
- Adjacent-day repeated sets: 1421
- Family diversity same-family with in-band alternative: Set A lures=0, flies=0; Set B lures=0, flies=0

Launch months, dirty elevated river:

- Rows: 477
- Contexts: 954
- Failures: 0
- Pool health: lure min/p10/median 6/6/14; fly min/p10/median 9/11/16; thin <4 per side 0
- Condition-reason rate: 0.876
- Goal-reason rate: 0.907
- Surface leaks: 0
- Set B reuse reviews: 14/954
- Identical AP/BF sets: 0/477
- Adjacent-day repeated sets: 921
- Family diversity same-family with in-band alternative: Set A lures=0, flies=0; Set B lures=0, flies=0

## Tests Run

- `npm run check:seasonal-matrix`
- `npm run gen:seasonal-rows-v4`
- `npm run check:seasonal-matrix`
- `npx tsc --noEmit`
- `deno test -A supabase/functions/recommender/index.test.ts supabase/functions/recommender/dailyPicksSession.test.ts supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__`
- `deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --scenario=calm_low_light_surface_stress --exposure-days=7`
- `deno run -A scripts/audit/daily-picks-quality-harness.ts --launch-months --scenario=dirty_elevated_river --water=freshwater_river --exposure-days=7`

## Remaining Red Flags

Observed: adjacent-day repeated sets remain high in the launch harness. This was explicitly out of scope for QA5C and should be handled as a selector/exposure pass only after biological inventory and row truth are stable.

Observed: clouser_minnow, game_changer, suspending_jerkbait, and bladed_jig remain high-volume launch selections. QA5C did not find a new QA5B metadata break causing that, but real-weather replay should check whether this is acceptable seasonal strength or excessive dominance.

Observed: magnum_jerkbait is a high-volume new Big Fish lure across bass launch contexts. Its profile is biologically defensible, but QA6 should verify with archived weather that it does not crowd out slower bottom or surface Big Fish options in windows where those should lead.

Observed: shallow_minnowbait is a high-volume pike AP tool. This is directionally useful for pike-first credibility, but QA6 should verify it is not acting as a universal pike default when spoon/bucktail/spinnerbait/swimbait contexts are stronger.

Observed: weedless_spoon is selected but rarely becomes Top Pick in trace data. That may be acceptable coverage behavior, but QA6 should verify whether real weed/wind windows surface it enough.

Observed: trout mouse_fly remains active in trout river calm-low-light Big Fish contexts. QA5C confirmed LMB mouse_fly did not broaden incorrectly, but QA6 should independently replay trout surface/mouse windows.

## QA6 Archived-Weather Replay Recommendation

Run archived-weather replay over March-November by species, region, water type, and goal, with special review queues for:

- pike windy/stained and clear/calm Big Fish days: confirm pike_spinnerbait, weedless_spoon, pike_glidebait, pike_jerkbait, bucktail, and pike swimbait divide contexts sensibly.
- LMB low-light lake/pond Big Fish days: confirm wake_bait and mouse_fly rise only in true surface windows while magnum_worm and bluegill_streamer carry warm cover days.
- SMB clear lake Big Fish days: confirm compact_glidebait does not overtake jerkbait/tube/swimbait lanes outside clear visual windows.
- SMB river/current Big Fish days: confirm big_smallmouth_tube appears in bottom/current windows without becoming a universal river Big Fish answer.
- Trout low-light river Big Fish days: confirm mouse_fly remains narrow enough for launch.
- Adjacent-day exposure and repeat behavior: measure after real weather inputs, then decide whether QA6 or QA7 should add exposure policy.
