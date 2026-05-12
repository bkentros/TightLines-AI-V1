# Daily Picks Recommender Maintenance

This is the current maintainer map for the FinFindr deterministic daily lure/fly recommender.

The production feature is the daily-picks 2x2 recommender: Set A and Set B, each with a top lure, honorable lure, top fly, and honorable fly.

## Active Runtime

- Edge entry: `supabase/functions/recommender/index.ts`
- Session/cache layer: `supabase/functions/recommender/dailyPicksSession.ts`
- Daily-picks engine: `supabase/functions/_shared/recommenderEngine/dailyPicks/`
- Shared contracts: `supabase/functions/_shared/recommenderEngine/contracts/`
- Catalog and generated seasonal rows: `supabase/functions/_shared/recommenderEngine/v4/`
- Frontend mirror contracts: `lib/recommenderContracts.ts`
- App screens:
  - `app/recommender.tsx`
  - `components/fishing/RecommenderView.tsx`

The directory name `recommenderEngine/v4` is historical. It is still active because it holds the current catalog, candidate factory, and generated seasonal rows. Do not delete or rename it without a deliberate migration.

## Current Product Rules

- Species: largemouth bass, smallmouth bass, northern pike, trout.
- Trout is river-only.
- LMB, SMB, and pike support freshwater lake/pond and freshwater river where state/species gating allows them.
- Water clarity: clear, stained, dirty/murky.
- Goals: All Purpose and Big Fish.
- Weather and context shape the daily scenario before candidate scoring.
- Set A and Set B should differ when credible alternatives exist.

## Core Invariants

- Species truth comes first. Do not make fake catalog tags to force usage.
- Seasonal row eligibility controls what can enter a pool.
- Daily conditions must materially influence score reasons and selected picks.
- Surface-closed windows must not select surface picks or leave surface finalists.
- Top pick and honorable mention on the same side must not share `family_group`.
- Set B exact-ID repeats are failures unless scarcity proves unavoidable.
- Same-side surface/surface should be avoided when a close non-surface alternative is credible.
- Actual user-facing slot share must stay at or below 20% for any one lure/fly.
- Big Fish should favor upside without becoming reckless.
- All Purpose should favor reliable, versatile, condition-fit picks.

## Daily Condition Inputs

Daily scenarios are built in `buildDailyScenario.ts`.

- Wind uses local daylight mean wind, 5am through 9pm local, when hourly wind is available.
- Light uses normalized cloud/light mode from the shared weather normalization pipeline.
- Temperature uses normalized thermal band, shock, trend, and activity context.
- River/current behavior uses water movement/runoff mode where applicable.
- Pressure is used through normalized fishing context/activity/confidence rather than as a direct bait-family tag.

## Main Tuning Files

- Scenario gates: `dailyPicks/buildDailyScenario.ts`
- Pool construction: `dailyPicks/buildCandidatePool.ts`
- Scoring: `dailyPicks/scoreCandidate.ts`
- Selection, family/column/Set B repair: `dailyPicks/selectDailyPicks.ts`
- Response copy and shape: `dailyPicks/shapeDailyPicksResponse.ts`
- Seasonal row resolution: `dailyPicks/resolveDailyPicksSeasonalRow.ts`
- Catalog profiles: `v4/candidates/lures.ts` and `v4/candidates/flies.ts`
- Seasonal source CSVs: `data/seasonal-matrix/*.csv`
- Generated seasonal rows: `v4/seasonal/generated/*.ts`

## Audit Commands

Run fast checks before behavior changes:

```sh
deno check scripts/audit/run-daily-picks-archive-audit.ts
deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__ supabase/functions/recommender/dailyPicksSession.test.ts
```

Run full species audits after any selector, scoring, catalog, seasonal, or weather-normalization change:

```sh
deno run --allow-net --allow-read --allow-write scripts/audit/run-daily-picks-archive-audit.ts --species=largemouth_bass
deno run --allow-net --allow-read --allow-write scripts/audit/run-daily-picks-archive-audit.ts --species=smallmouth_bass
deno run --allow-net --allow-read --allow-write scripts/audit/run-daily-picks-archive-audit.ts --species=northern_pike
deno run --allow-net --allow-read --allow-write scripts/audit/run-daily-picks-archive-audit.ts --species=trout
```

Generated audit reports are intentionally not committed. Regenerate them when auditing, then review hard fails, likely misses, same-family counts, Set B exact-ID counts, surface finalist safety, actual slot share, condition diagnostics, zero/low-use profiles, and overdominance watches.

## Seasonal Row Workflow

Edit CSVs in `data/seasonal-matrix/`, then regenerate and validate:

```sh
npm run gen:seasonal-rows-v4
npm run check:seasonal-matrix
deno test -A supabase/functions/_shared/recommenderEngine/__tests__/generatedSeasonalIntegrity.test.ts
```

Only change seasonal rows for proven species/region/month/water-type biology. Do not widen rows simply to increase variety.

## Catalog Workflow

Catalog changes belong in:

- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`

After catalog edits, run:

```sh
deno test -A supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts
deno test -A supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__
```

Catalog changes should be guide-correct. Do not add tags, species eligibility, water eligibility, or clarity strength only to move usage numbers.

## Commit Hygiene

- Keep recommender cleanup and recommender behavior changes in separate commits.
- Do not commit generated audit reports unless explicitly needed for a handoff.
- Do not mix unrelated app or water-reader changes into recommender commits.
