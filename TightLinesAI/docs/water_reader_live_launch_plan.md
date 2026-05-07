# Water Reader Live Launch Plan

## Goal

Make Water Reader available in the app for any supported lake in `waterbody_index`, generated on demand, with the final tuned engine and a clean production cache.

The product behavior must remain the accepted Water Reader model:

- Geometry-only lake polygon analysis.
- No fish prediction.
- No imagery, depth, bathymetry, species, clarity, weather, activity, or fish behavior for zone placement.
- Season-invariant overlays.
- Season can affect legend/read guidance only.
- Dam detection remains disabled until a future metadata-backed detector is explicitly approved.

## Current Architecture

The app already has the right high-level route:

1. App calls Supabase Edge Function `water-reader-read`.
2. Edge authenticates the user and subscription.
3. Edge checks `public.water_reader_engine_read_cache`.
4. Cache hit returns immediately.
5. Cache miss generates a Water Reader read:
   - small/moderate rows may run in Edge;
   - heavy rows route to `WATER_READER_HEAVY_GENERATOR_URL`.
6. Generated reads are written back to `water_reader_engine_read_cache`.

Important current repo detail:

- Final tuned engine source lives in `lib/water-reader-engine`.
- App/server generation imports `supabase/functions/_shared/waterReaderEngine`.
- Before launch, the shared Supabase engine must be synced to the final tuned engine. Do not deploy until this is verified.

## Launch Provider Recommendation

Default recommendation: **Google Cloud Run** for production heavy compute.

Why:

- It runs a normal Node HTTP server/container.
- It scales to zero.
- It is pay-per-use with 100ms billing granularity.
- It is likely cheaper than always-on services for bursty on-demand generation.
- It avoids fitting a Node server into a Python-first deployment wrapper.

Acceptable alternative: **Modal Starter**.

Use Modal if speed of setup matters more than cloud-native Node simplicity. Modal is strong for bursty serverless compute and has free monthly compute credit, but the deployment wrapper is a little less natural for this existing Node server.

Avoid for v1 unless there is a strong reason:

- Render paid web service: simple but more fixed monthly cost.
- Railway: simple, but less clearly cheapest.
- Supabase Edge only: keep it as auth/cache/router, not the heavy compute home.

## Phase 1 - Sync Final Engine Into Server Runtime

Objective: make the Edge/shared runtime use the final tuned engine.

Tasks:

1. Compare these folders:
   - `lib/water-reader-engine`
   - `supabase/functions/_shared/waterReaderEngine`
2. Copy/sync final tuned engine logic into `supabase/functions/_shared/waterReaderEngine`.
3. Preserve Supabase/Deno import style:
   - shared runtime imports should use `.ts` extensions where required;
   - do not introduce Node-only APIs into Supabase shared code;
   - keep `supabase/functions/_shared/waterReaderRead/buildRead.ts` imports working.
4. Ensure new files are included, especially:
   - `features/smoothness.ts`
5. Keep final accepted behavior:
   - smooth/sparse-lake enrichment;
   - point-seeded neck rescue;
   - clear-neck footprint boost;
   - Walloon-style compact `Pinch` subtype;
   - slightly loosened readable saddle display;
   - dam detector returns no candidates;
   - cove+point and cove+neck confluence normalization;
   - island display backfill.

Acceptance:

- `diff -qr lib/water-reader-engine supabase/functions/_shared/waterReaderEngine` has no meaningful logic drift except import extension/runtime-format differences.
- `supabase/functions/_shared/waterReaderEngine/features/smoothness.ts` exists.
- `npm run qa:water-reader-production-feature-envelope` still passes using shared runtime.
- `npm run qa:water-reader-app-integration-smoke` still passes.

## Phase 2 - Bump Engine Version

Objective: guarantee launch uses a fresh cache namespace.

Update:

- `supabase/functions/_shared/waterReaderRead/contracts.ts`
- `lib/waterReaderContracts.ts` if it mirrors the engine version or response constants.
- Any cache builder/test expectation that references `WATER_READER_ENGINE_VERSION`.

Current launch value:

```ts
export const WATER_READER_ENGINE_VERSION = "water-reader-engine-v4-paper-redesign";
```

Rules:

- Bump engine version for any future detection, geometry, display, or ranking change.
- Copy-only legend changes can choose either to bump or accept old cached copy until refreshed.
- Do not reuse the old `water-reader-engine-v2-feature-envelope` cache namespace for the final launch.

Acceptance:

- App integration smoke confirms the new version string is used everywhere expected.
- Cache lookup/write keys use the new engine version.

## Phase 3 - Production Cache Wipe

Objective: wipe stale generated reads before launch so users cannot receive old visual output.

Do this after the engine version bump is merged/deployed, and again immediately before public launch if staging generated test rows in production.

Pre-wipe audit:

```sql
select engine_version, count(*) as rows
from public.water_reader_engine_read_cache
group by engine_version
order by engine_version;
```

Wipe:

```sql
truncate table public.water_reader_engine_read_cache;
```

Post-wipe verification:

```sql
select count(*) as remaining_rows
from public.water_reader_engine_read_cache;
```

Required result:

```text
remaining_rows = 0
```

Safety rules:

- Wipe only `public.water_reader_engine_read_cache`.
- Do not wipe `waterbody_index`.
- Do not wipe source polygon tables.
- Do not wipe user/account/subscription tables.
- If production access policy blocks `truncate`, use:

```sql
delete from public.water_reader_engine_read_cache;
```

## Phase 4 - Hosted Heavy Worker

Objective: permanently host the heavy generator that Edge calls on heavy cache misses.

Existing worker:

- `scripts/water-reader-heavy-generator-server.ts`
- command: `npm run serve:water-reader-heavy-generator`
- endpoint path: `/water-reader/generate`
- default port: `8789`
- required header: `x-water-reader-internal-key`

Required environment:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
WATER_READER_INTERNAL_KEY
WATER_READER_HEAVY_GENERATOR_PORT=8789
```

Cloud Run implementation target:

1. Add a production Dockerfile or deployment config for the heavy worker.
2. Install Node dependencies.
3. Start:

```bash
npm run serve:water-reader-heavy-generator
```

4. Configure Cloud Run:
   - CPU: start with 1-2 vCPU.
   - Memory: start with 1-2 GiB.
   - Concurrency: start low, preferably `1` or `2`, because generation is CPU-heavy.
   - Min instances: `0` for cheapest launch.
   - Max instances: conservative cap, such as `3-10`, to protect Supabase and cost.
   - Timeout: at least `60s`; Edge currently caps worker fetch timeout up to `60s`.

Modal alternative target:

1. Add a Modal deployment wrapper that exposes the existing Node web server with `@modal.web_server`.
2. Bind the worker to `0.0.0.0`.
3. Use Modal secrets for the required environment.
4. Deploy a persistent web endpoint.

Acceptance:

- Direct worker smoke succeeds for a known supported lake.
- Worker writes `water_reader_engine_read_cache`.
- Worker rejects requests without `x-water-reader-internal-key`.
- Worker response includes `feature: "water_reader_read_v1"`, `productionSvgResult`, `engineVersion`, and timing diagnostics.
- Live launch smoke passes after Cloud Run and Supabase Edge deploy:

```bash
npm run smoke:water-reader-live-launch
```

## Phase 5 - Supabase Edge Configuration

Objective: route heavy rows from Edge to the hosted worker.

Set production Supabase secrets:

```bash
supabase secrets set \
  WATER_READER_HEAVY_GENERATOR_URL="<hosted-worker-base-url>" \
  WATER_READER_INTERNAL_KEY="<same-secret-as-worker>" \
  WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS="25000"
```

If heavy rows time out during production smoke, raise timeout cautiously:

```bash
supabase secrets set WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS="45000"
```

Deploy:

```bash
supabase functions deploy water-reader-read
```

If the deploy flow requires shared function bundling, follow the repo's existing Supabase deploy procedure and verify `_shared/waterReaderEngine` is included.

Acceptance:

- `water-reader-read` can return a cache hit.
- `water-reader-read` can generate a small/normal uncached lake.
- `water-reader-read` can route a heavy uncached lake to the worker.
- A free-tier user is blocked.
- A paid/subscribed user is allowed.

## Phase 6 - Live Smoke Matrix

Run live/staging checks against the deployed path, not only local scripts.

Minimum lake cases:

- One simple/small supported lake.
- One smooth/sparse lake from the custom batch, such as Glen or Walloon.
- One island-heavy lake.
- One cove-heavy reservoir.
- One known heavy large/complex row.
- One `not_supported` or no-polygon row.

For each supported case verify:

- `fallbackMessage` is null.
- `productionSvgResult.svg` exists.
- `displayedEntryCount > 0`.
- `engineVersion` is the final launch version.
- First request returns `cacheStatus: "miss"` and cache write status `stored`.
- Second request returns `cacheStatus: "hit"`.
- Heavy rows include `operationalDiagnostics.heavyGenerationStatus: "routed"` when routed.

## Phase 7 - Optional Prewarm

Prewarming is optional but recommended for known popular lakes and founder lakes.

Options:

- Use existing `build:water-reader-read-cache`.
- Or add a targeted prewarm script for a supplied lake ID list.

Prewarm only after:

- final engine version is deployed;
- production cache wipe is complete;
- hosted worker is configured;
- live smoke passes.

Suggested prewarm list:

- founder/custom MI/FL lakes;
- 50-lake QA manifest;
- high-traffic states or launch marketing lakes.

## Phase 8 - Launch Monitoring

Monitor:

- Edge Function errors for `water-reader-read`.
- Heavy worker errors/timeouts.
- Cache hit vs miss ratio.
- Slowest generation rows.
- Rows with fallback/no-map.
- Rows with zero displayed entries.
- Renderer warning counts.
- Cache write failures.
- Supabase DB size growth from cached read JSON/SVG.

Recommended production dashboard counters:

- `water_reader_read_cache_hit`
- `water_reader_read_cache_miss_edge_generated`
- `water_reader_read_cache_miss_worker_generated`
- `water_reader_read_worker_timeout`
- `water_reader_read_worker_failed`
- `water_reader_read_fallback_no_map`
- `water_reader_read_zero_displayed`

## Future Tuning After Launch

Tuning is allowed after launch.

Rules:

- For detection, zone geometry, display selection, confluence, renderer, or ranking changes: bump `WATER_READER_ENGINE_VERSION`.
- Run the accepted QA suite before deploy.
- Run at least a targeted visual batch for any changed feature family.
- Keep old cache rows only if storage is acceptable; otherwise delete old engine-version rows.

Old-version cleanup:

```sql
delete from public.water_reader_engine_read_cache
where engine_version <> 'water-reader-engine-v4-paper-redesign';
```

Do not tune production by editing cache rows manually. Change engine code, bump version, regenerate.

## Required Verification Commands

Local/source checks:

```bash
npm run qa:water-reader-typecheck
npm run qa:water-reader-engine-features
npm run qa:water-reader-engine-zone-smoke
npm run qa:water-reader-production-feature-envelope
npm run qa:water-reader-app-integration-smoke
node --env-file=.env ./node_modules/tsx/dist/cli.mjs scripts/water-reader-50-lake-matrix-review.ts --batch=review-ready-full
rg "water-reader-engine-v1" . --glob '!node_modules/**' --glob '!tmp/**' --glob '!docs/**' --glob '!*.md'
git diff --check
```

Heavy worker local smoke:

```bash
npm run smoke:water-reader-heavy-generator
```

Supabase function check:

```bash
deno check supabase/functions/water-reader-read/index.ts
```

## Launch Blockers

Do not launch if any of these are true:

- `supabase/functions/_shared/waterReaderEngine` is not synced with final tuned engine behavior.
- `features/smoothness.ts` is missing from shared runtime.
- Dam detection returns any candidates.
- Final engine version was not bumped.
- Production `water_reader_engine_read_cache` still contains old launch-test rows before public launch.
- Heavy worker is not configured and heavy lakes return the "needs heavy generation worker" fallback.
- Cache miss generation does not write cache.
- App can only open the 50 QA lakes instead of any supported polygon-backed index row.
- Free users can generate paid Water Reader reads.
- Paid users cannot generate supported lakes.
