# Seasonal Row Audit

Pass: 1 current-state audit  
Scope: documentation only; no CSV or generated row data changed

Historical note: this file records the Pass 1 pre-cutover seasonal row audit. After the daily-picks 2x2 cutover, live seasonal lookup is handled by `supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts`, which performs exact species/region/month/water-type lookup against generated v4 rows.

## Files Audited

- `data/seasonal-matrix/largemouth_bass.csv`
- `data/seasonal-matrix/smallmouth_bass.csv`
- `data/seasonal-matrix/northern_pike.csv`
- `data/seasonal-matrix/trout.csv`
- `data/seasonal-matrix/schema.md`
- `scripts/generate-seasonal-rows-v4.ts`
- `scripts/check-seasonal-matrix-consistency.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/seasonalResolve.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/resolveSeasonalRow.ts`

## Current Seasonal Row Schema

CSV header:

```txt
species,region_key,month,water_type,state_code,column_range,column_baseline,pace_range,pace_baseline,primary_forage,secondary_forage,surface_seasonally_possible,primary_lure_ids,primary_fly_ids,excluded_lure_ids,excluded_fly_ids,notes
```

Generated runtime type:

- `species`
- `region_key`
- `month`
- `water_type`
- optional `state_code`
- `column_range`
- `column_baseline`
- `pace_range`
- `pace_baseline`
- `primary_forage`
- optional `secondary_forage`
- `surface_seasonally_possible`
- `primary_lure_ids`
- `primary_fly_ids`
- optional `excluded_lure_ids`
- optional `excluded_fly_ids`

The `notes` column is authoring-only and is not emitted into generated runtime rows.

## Generation And Consumption

Authoring/generation:

- CSVs under `data/seasonal-matrix/*.csv` are parsed by `scripts/generate-seasonal-rows-v4.ts`.
- The generator validates row shape and writes generated arrays under `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/*.ts`.
- `scripts/check-seasonal-matrix-consistency.ts` regenerates to a temp directory and checks committed generated files match the CSVs.

Pre-cutover consumption:

- The old production rebuild path consumed generated files through `supabase/functions/_shared/recommenderEngine/rebuild/seasonalResolve.ts`.
- That lookup was exact by species, region, month, and water type.
- That lookup ignored state-scoped rows and did not use region fallback.

Historical ambiguous/legacy consumption:

- `supabase/functions/_shared/recommenderEngine/v4/seasonal/resolveSeasonalRow.ts` was used by the standalone experimental v4 engine/tests, not the old live rebuild path.
- That resolver supports state-scoped rows and region fallback, which differs from production rebuild behavior.

Documentation conflict:

- `data/seasonal-matrix/schema.md` currently says the live edge still resolves seasonal biology from embedded v3 tables.
- Pass 1 traced runtime showed the old live rebuild used generated v4 rows via `rebuild/seasonalResolve.ts`.
- Mark this schema note for cleanup later.

## Row Inventory Summary

Generated row counts:

| Species | Rows | Regions | Water Types | Surface Rows | Full Column Range Rows | Full Pace Range Rows | Avg Lure IDs | Avg Fly IDs |
| --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| Largemouth bass | 384 | 16 | lake/pond, river | 172 | 172 | 271 | 17.6 | 12.8 |
| Smallmouth bass | 336 | 14 | lake/pond, river | 107 | 107 | 206 | 18.9 | 16.7 |
| Northern pike | 216 | 9 | lake/pond, river | 36 | 36 | 137 | 11.5 | 14.6 |
| Trout | 168 | 14 | river only | 59 | 59 | 118 | 6.6 | 18.2 |

Authoring notes:

- Every sampled row had "Migrated from v3 seasonal rows" notes.
- LMB rows: 384 rows, 80 mention padded primaries, 223 mention G8 coverage warnings.
- SMB rows: 336 rows, 82 mention padded primaries, 110 mention G8 coverage warnings.
- Pike rows: 216 rows, 0 mention padded primaries, 153 mention G8 coverage warnings.
- Trout rows: 168 rows, 0 mention padded primaries, 90 mention G8 coverage warnings.

Interpretation: the current rows are very likely shaped by old 3-slot/3:3 coverage requirements. The IDs should be treated as current inventory, not as final biological truth.

## `surface_seasonally_possible`

Current representation:

- Boolean field in CSV/generated row.
- Schema says it must agree with whether `surface` appears in `column_range`.
- Live rebuild checks both `row.column_range.includes("surface")` and `row.surface_seasonally_possible`.
- If surface is seasonally possible but daylight mean wind is `>14`, `shapeProfiles.ts` removes surface from target profile columns.

Important current behavior:

- Suppressive regime does not hard-close surface in `computeSurfaceBlocked`; it shapes profiles but does not behave like the new planned daily gate.
- Missing wind returns `0` in `rebuild/wind.ts`, which can leave surface open. The new plan says missing/untrustworthy wind should close surface.
- Current wind band says `windy` at `>=12`, while surface block is `>14`. This inconsistency should be resolved in the new daily scenario layer.

New plan requirement:

1. Seasonal surface gate first: row/region/month/water type must allow surface.
2. Daily surface gate second: wind/regime/light/etc. must allow surface.
3. Both gates must be open for topwater/surface flies.

## Surface Timing Snapshot

Largemouth bass:

- Florida lake/pond surface months: 2-11.
- Florida river surface months: 5-10.
- Great Lakes / Upper Midwest lake and river surface months: 6-9.
- Midwest Interior lake surface months: 5-10; river surface months: 6-9.
- March surface rows exist for Florida lake/pond and Hawaii lake/pond only.
- Great Lakes / Upper Midwest March lake is surface false; Great Lakes / Upper Midwest May lake is also surface false.

Example rows:

- Florida LMB March lake: surface true, full column range, full pace range, 20 lure IDs, 15 fly IDs; includes walking topwater, buzzbait, hollow-body frog, popper fly, deer-hair slider, frog fly.
- Great Lakes / Upper Midwest LMB March lake: surface false, bottom/mid only, slow/medium only.
- Great Lakes / Upper Midwest LMB May lake: surface false, bottom/mid/upper, slow/medium/fast; no surface IDs.
- Midwest Interior LMB May lake: surface true and includes walking topwater and buzzbait.

This mostly matches the plan's example distinction: Florida March LMB can allow topwater while Michigan/northern LMB March generally should not. However, Midwest Interior May surface needs Pass 5 review by state/region because "Michigan" may resolve to Great Lakes/Upper Midwest rather than Midwest Interior depending region resolver.

Smallmouth bass:

- No March surface rows.
- Southern lake/pond regions begin surface in May: Gulf Coast, South Central, Southeast Atlantic, Southern California, Southwest Desert.
- Most northern lake/pond regions begin in June.
- Some northern river regions begin in July.
- Great Lakes / Upper Midwest lake June row has surface true and includes buzzbait, walking topwater, popper/deer-hair/foam surface flies.

Pike:

- No March surface rows.
- South Central lake starts surface in April-May.
- Appalachian and Midwest Interior lakes have May-June surface windows.
- Northern/cooler regions are generally June-July or June-August.
- Surface windows are narrower than bass, which is directionally good, but pike rows need wind/flash/surface separation in Pass 5.

Trout:

- Trout rows are river-only.
- No March surface rows.
- Several southern/western/appalachian trout regions begin surface in May.
- Many northern/cold regions run June-September; Mountain Alpine is July-August.
- Trout surface rows include `small_floating_trout_plug`, `popper_fly`, `deer_hair_slider`, and `mouse_fly` in many regions.
- This requires careful review because trout fly recommendations are supposed to be streamer/topwater only, and mouse/topwater should be narrow daily/seasonal windows.

## `primary_lure_ids` And `primary_fly_ids`

Current live usage:

- `selectSide.ts` treats these as `allowedIds` for the authored row pool.
- Initial compatible candidates come only from row-authored IDs.
- Rescue/fallback can use catalog-valid rotation candidates that pass gear/species/water/exclusion/surface hard gates and are not in a row, except certain seasonally authored fly IDs require row authorization.

What the IDs appear to mean today:

- They are not true "top picks"; they are large row inventory pools.
- They are not a strict final allowed set in every rescue path.
- They are partly seasonal allowed IDs and partly old 3:3 slot inventory.
- LMB and SMB notes explicitly say "padded primaries for G1" in many rows.
- Large average ID counts and G8 notes indicate old slot-0/full coverage pressure.

Future concept:

- Reuse the physical CSV columns if convenient, but rename/interpret as seasonal allowed IDs.
- Remove IDs that exist only to satisfy 3:3 or old slot-0 checks.
- Ensure every row can truthfully support 2 lures and 2 flies under common daily states before adding rescue logic.

## Broad Row Range Risks

Rows with full `bottom|mid|upper|surface` column ranges are exactly the surface rows:

- LMB: 172 rows.
- SMB: 107 rows.
- Pike: 36 rows.
- Trout: 59 rows.

Rows with full `slow|medium|fast` pace ranges:

- LMB: 271 rows.
- SMB: 206 rows.
- Pike: 137 rows.
- Trout: 118 rows.

Risk:

- Full column and pace ranges may be too broad because the old engine needed three target profiles and exact/adjacent fill options.
- In a 2x2 engine, ranges should represent biological possibility, not slot inventory breadth.

Examples requiring future review:

- Florida LMB March lake allows all columns, all paces, and surface.
- Midwest Interior LMB May lake allows all columns, all paces, and surface.
- Great Lakes SMB June lake allows all columns, all paces, and includes buzzbait.
- South Central pike April lake allows all columns, all paces, and includes large pike topwater plus buzzbait.
- Southeast Atlantic trout May river allows all columns, all paces, and includes mouse fly.

## Obvious Surface Seasonality Risks

- LMB Florida February/March lake surface may be defensible, but individual surface IDs need review. Hollow-body frog in Florida March may be viable around vegetation; open-water topwaters/buzzbait should still depend heavily on daily conditions.
- LMB Midwest Interior May lake surface may be too early for some northern states if that region covers colder water. Confirm region mapping and state distribution in Pass 5.
- SMB Great Lakes June lake includes surface and buzzbait. Surface can be valid, but buzzbait for SMB needs careful review.
- Pike South Central April lake includes surface and buzzbait. Pike surface in April South Central may be possible, but wind should not promote it and big-profile pike surface should not be generic.
- Trout May surface rows in Appalachian, Northern California, South Central, Southeast Atlantic, Southern California, and Southwest High Desert include mouse fly. Mouse in May should be reviewed closely; plan calls for summer low-light big-fish windows, not generic trout surface.

## Rows Likely Carrying 3:3 Padding

Signals:

- Explicit notes: "padded primaries for G1" in 80 LMB rows and 82 SMB rows.
- G8 notes across many rows: old slot-0 gaps by posture.
- Very large pools in many row examples: LMB March Florida lake has 20 lure IDs and 15 fly IDs; SMB Great Lakes June lake has 23 lure IDs and 17 fly IDs; trout surface rows often have 21 fly IDs.
- Warmwater rows often include broad fly streamer pools that look more like inventory breadth than tight seasonal truth.

Specific examples:

- LMB January Appalachian lake includes 18 lure IDs and 10 fly IDs in a winter row.
- SMB January Appalachian lake includes 18 lure IDs and 11 fly IDs in a winter row.
- Trout winter rows often carry 16 fly IDs even when surface is false and column/pace are narrower.
- Pike January Alaska rows include a large pike fly pool plus general warmwater/trout streamers.

## Species-Specific Deep Review Queues For Pass 5

### Largemouth Bass

Deep review categories:

- Early spring surface timing by warm vs northern regions.
- Frog/hollow-body/frog-fly rows: should require vegetation/cover seasonality, not just warm surface.
- Buzzbait rows: should be active/warm/stained/dirty/open surface, not slow or generic.
- Dirty-water rows: should emphasize vibration/profile without forcing surface.
- Cold/early season rows: broad fast/mid inventory may need tightening.
- River rows: topwater and frog scope should be stricter than lake/pond in many regions.

Rows to sample first:

- Florida February/March/April lake.
- Great Lakes / Upper Midwest April-June lake.
- Midwest Interior May lake.
- Gulf Coast and South Central April-May lake.
- Any row with notes containing padded primaries.

### Smallmouth Bass

Deep review categories:

- SMB surface timing in northern lake and river rows.
- Buzzbait eligibility for SMB.
- Avoid LMB-style frog/topwater bias.
- Clear subtle tools in rivers/lakes: tube, Ned, hair jig, jerkbait, drop shot.
- Pace ranges in cold and post-front months.

Rows to sample first:

- Great Lakes / Upper Midwest June lake.
- Great Lakes / Upper Midwest July river.
- Southern May lake rows.
- Any row including `buzzbait`.

### Northern Pike

Deep review categories:

- Wind should promote flash/reaction, not surface.
- Big-fish goal should favor large profile pike tools where seasonally sensible.
- Surface windows should be calm/breezy and warm, with daily gate strict.
- Bass-coded pike inventory: buzzbait, tube, spinnerbait, squarebill/flat/lipless.
- Fly side should distinguish pike flash fly, bunny streamer, large articulated pike streamer, and generic baitfish streamers.

Rows to sample first:

- South Central April/May lake.
- Appalachian and Midwest Interior May lake.
- Alaska/Mountain Alpine June-August.
- Windy pike rows/scripts where surface currently may coexist with reaction boosts.

### Trout

Deep review categories:

- Trout remains river-only.
- Fly recommendations are streamer/topwater only; no generic hatch/dry/nymph behavior.
- Mouse fly should be summer low-light/calm big-fish, not broad surface.
- Elevated runoff should boost streamers/sculpins/buggers/leeches, not surface.
- Spring/May surface rows in southern regions need biological validation.
- Many trout rows have large fly pools and G8 notes; trim to honest seasonal allowed IDs.

Rows to sample first:

- Southeast Atlantic May river.
- Appalachian May-June river.
- Mountain Alpine July-August river.
- Alaska June-August river.
- Fall streamer rows across PNW/Mountain West/Northeast.

## Keep / Rewrite Guidance

Keep:

- CSV as authoring source.
- Generated TypeScript as runtime data.
- Exact no-fallback production lookup if that remains a product goal.
- `surface_seasonally_possible` as the first surface gate.
- Seasonal row concepts: column range/baseline, pace range/baseline, forage, excluded IDs.

Rewrite/renovate:

- Treat `primary_lure_ids` and `primary_fly_ids` as seasonal allowed IDs.
- Remove old padding pressure.
- Tighten broad `pace_range` and `column_range` where they were authored for 3-slot coverage.
- Review every surface row by region/month/water type.
- Review broad fly pools, especially trout/pike.
- Update schema docs to remove stale v3 runtime note.

Do not do in Pass 5:

- Do not borrow rows from neighboring regions/months to fill 2x2.
- Do not add rescue IDs to avoid data work.
- Do not make daily weather resurrect surface when `surface_seasonally_possible` is false.
