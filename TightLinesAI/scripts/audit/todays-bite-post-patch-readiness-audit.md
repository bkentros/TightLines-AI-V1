# Today's Bite Post-Patch Readiness Audit

Generated: 2026-05-14T15:06:23.745Z

Ran actual production code after the patch. Recommender production logic was invoked but not edited.

## Readiness

- Result: PASS
- Score range/counts complete-data: min 10, max 95, >=80/30562, >=85/18312, >=90/14924, >=95/2674, =100/0
- Guard counts: {"missing_ge80":0,"low_rel_ge80":0,"ordinary_ge80":0,"strong_ge90":0,"cat_gt30":0,"production_style_ge95":0}
- >=95 by context: {"freshwater_lake_pond":2674,"freshwater_river":0,"coastal":0,"coastal_flats_estuary":0}
- >=95 by family: {"calibration_catastrophic":0,"calibration_elite":0,"calibration_ordinary_good":0,"calibration_strong":0,"calibration_super_elite":2674,"missing_partial_data":0,"production_style":0}
- Production-style max score: 94
- light_mist_dry_baseline max/>=90/>=95: 94/3514/0

## Upper-9s / River

- Complete-data >=95: 2674
- Lake max: 95
- River max: 94
- River-only +1 remains a shadow idea only; production patch did not add it.

## Boundary / Taper

- Max actual tiny-input final-score cliff: 3
- Boundary rows: [{"name":"pressure","variable_delta":0.44,"final_delta":3,"hard":false,"before":-0.2,"after":-0.64},{"name":"wind_freshwater_lake_pond","variable_delta":0,"final_delta":0,"hard":false,"before":0.1,"after":0.1},{"name":"wind_freshwater_river","variable_delta":0,"final_delta":0,"hard":false,"before":0,"after":0},{"name":"wind_coastal","variable_delta":0,"final_delta":0,"hard":false,"before":0.1,"after":0.1},{"name":"wind_coastal_flats_estuary","variable_delta":0.05,"final_delta":1,"hard":false,"before":0.35,"after":0.3},{"name":"tide_inshore","variable_delta":0.003,"final_delta":0,"hard":false,"before":-1,"after":-0.997},{"name":"tide_flats","variable_delta":0.003,"final_delta":0,"hard":false,"before":-0.25,"after":-0.247}]
- Gulf measured-water 74F Oct->Nov focus cliff: 3.667 -> 0
- Active precip cap: numeric/tapered score cap wired.

## Recommender Impact

- Attempted/valid/unsupported/errors: 54432/48384/6048/0
- Signature/thermal/activity/surface/tags/unexpected: 0/0/5404/0/0/0
- Recommender impact classification: activity-tier only.

## Forecast Snapshot Guard

- Forecast offsets covered: {"0":15552,"1":15552,"2":15552,"3":15552,"4":15552,"5":15552,"6":15552}
- Request/environment snapshots persisted in JSONL by forecast_offset.
- Production forecast day 0..6 snapshot code was not edited.

## Validation Commands

- `deno fmt` on changed TypeScript files
- `deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts`
- `deno run --allow-read --allow-write scripts/audit/run-todays-bite-post-patch-readiness-audit.ts`
- `git diff --name-only`
- Protected recommender diff check.
