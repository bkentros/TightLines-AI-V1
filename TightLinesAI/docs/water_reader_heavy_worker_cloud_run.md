# Water Reader Heavy Worker - Cloud Run Launch

## Worker Image

Build from the repo root with the dedicated Dockerfile:

```bash
export TAG="water-reader-engine-v7-legend-guidance-copy"

cp Dockerfile.water-reader-heavy-generator Dockerfile

gcloud builds submit \
  --tag us-central1-docker.pkg.dev/<gcp-project>/<artifact-repo>/water-reader-heavy-generator:$TAG
```

The container starts the existing heavy-generator server entrypoint. On Cloud Run it listens on `PORT`; locally it falls back to `WATER_READER_HEAVY_GENERATOR_PORT` or `8789`.

Important: the image tag must match the current `WATER_READER_ENGINE_VERSION`. The current launch tag is:

```text
water-reader-engine-v7-legend-guidance-copy
```

## Required Worker Secrets

Set these as Cloud Run secrets or environment variables:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
WATER_READER_INTERNAL_KEY
```

`WATER_READER_INTERNAL_KEY` must match the Supabase Edge Function secret of the same name. Rotate any local tunnel/test key before production.

## Recommended Cloud Run Settings

Use queue mode for production cache misses. Keep worker request concurrency at 1 so each container drains one heavy read at a time, then let Cloud Run scale out by instance count.

```bash
export TAG="water-reader-engine-v7-legend-guidance-copy"

gcloud run deploy water-reader-heavy-generator \
  --image us-central1-docker.pkg.dev/<gcp-project>/<artifact-repo>/water-reader-heavy-generator:$TAG \
  --region us-central1 \
  --allow-unauthenticated \
  --cpu 2 \
  --memory 4Gi \
  --concurrency 1 \
  --min-instances 1 \
  --max-instances 10 \
  --timeout 1800s \
  --set-env-vars SUPABASE_URL="<supabase-url>" \
  --set-secrets SUPABASE_SERVICE_ROLE_KEY="<secret-name>:latest",WATER_READER_INTERNAL_KEY="<secret-name>:latest"
```

For larger launch windows, `--max-instances 20` is reasonable after watching Supabase load. Memory should be 2-4Gi; start at 4Gi for large polygons and reduce only after worker memory metrics look calm.

The compatibility endpoint is `POST /water-reader/generate` and requires header `x-water-reader-internal-key`. Production queue draining should use `POST /water-reader/jobs/drain`.

## Queue Runner

Production Edge reads should return cached reads immediately and route uncached generation to the Cloud Run worker. Do not let normal cache misses generate inside Supabase Edge during launch; an engine cache-version bump can turn many previously cached lakes into fresh generations, and Edge can hit compute ceilings before the queue fallback responds. Keep `WATER_READER_DIRECT_HEAVY_GENERATION=true`, `WATER_READER_ROUTE_ALL_CACHE_MISSES_TO_WORKER=true`, and `WATER_READER_EDGE_INLINE_CACHE_MISSES=false` unless you are intentionally running a controlled hybrid test.

The production safety contract depends on the queue/history migrations and the active-generation guard migration being applied before deploying the Edge functions. `water_reader_user_active_generation_requests` enforces one active uncached generation per user at the database boundary, and `begin_water_reader_generation_request` serializes same-user starts with an advisory transaction lock. Cached reads are still allowed to return immediately; uncached second reads get the friendly Recent Water Reads building response until the active request is ready.

Create a Cloud Scheduler job that calls the worker drain endpoint every minute:

```bash
export WORKER_URL="<cloud-run-service-url>"
export WATER_READER_INTERNAL_KEY="<same-secret-as-worker>"

gcloud scheduler jobs create http water-reader-drain-1 \
  --location us-central1 \
  --schedule "* * * * *" \
  --uri "$WORKER_URL/water-reader/jobs/drain" \
  --http-method POST \
  --headers "content-type=application/json,x-water-reader-internal-key=$WATER_READER_INTERNAL_KEY" \
  --message-body '{"maxJobs":10}'
```

The Scheduler request is:

```http
POST $WORKER_URL/water-reader/jobs/drain
content-type: application/json
x-water-reader-internal-key: <secret>

{"maxJobs":10}
```

`maxJobs: 10` matches the current Cloud Run launch shape: request concurrency stays at 1, but one scheduler tick can drain a small burst while Cloud Run scales instances. The database claim RPC uses `for update skip locked`, so multiple runner calls can safely overlap.

For higher-volume spikes, add multiple Cloud Scheduler jobs with staggered schedules or move the runner trigger to Cloud Tasks. Cloud Tasks gives better backpressure and retry control if cache misses arrive faster than once-per-minute scheduler drains can clear them.

## Supabase Edge Secrets

After the Cloud Run URL is known:

```bash
export SUPABASE_PROJECT_REF="<supabase-project-ref>"

npx supabase@latest secrets set --project-ref "$SUPABASE_PROJECT_REF" \
  WATER_READER_HEAVY_GENERATOR_URL="<cloud-run-service-url>" \
  WATER_READER_INTERNAL_KEY="<same-secret-as-worker>" \
  WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS="20000" \
  WATER_READER_DIRECT_HEAVY_GENERATION="true" \
  WATER_READER_ROUTE_ALL_CACHE_MISSES_TO_WORKER="true" \
  WATER_READER_EDGE_INLINE_CACHE_MISSES="false"
```

If production smoke shows legitimate worker timeouts, raise the direct heavy timeout cautiously. Reads that do not finish inside the timeout fall back to the Recent Water Reads queue instead of returning a user-facing failure:

```bash
npx supabase@latest secrets set --project-ref "$SUPABASE_PROJECT_REF" WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS="45000"
```

Then deploy the read function:

```bash
npx supabase@latest functions deploy water-reader-read --project-ref "$SUPABASE_PROJECT_REF"
npx supabase@latest functions deploy water-reader-history --project-ref "$SUPABASE_PROJECT_REF"
```

Run the live launch smoke after both deploys. It signs in with the Water Reader test user, searches real indexed lakes, opens several reads through deployed Supabase, and fails if deployed reads are not serving the current engine version:

```bash
npm run smoke:water-reader-live-launch
```

## Launch Pre-Warm

Pre-warm the high-confidence launch list before a release or launch push:

```bash
npm run prewarm:water-reader-launch -- --launch-core --date YYYY-MM-DD
```

The script uses the production heavy-generator code path, stores reads in `water_reader_engine_read_cache`, retries transient Supabase/Cloudflare failures, and writes the latest report to:

```text
tmp/water-reader-launch-prewarm/latest.json
```

Use exact IDs for known large or alias-sensitive waterbodies, and keep optional extreme stress cases separate from the launch list:

```bash
npm run prewarm:water-reader-launch -- --stress --date YYYY-MM-DD
```

`--stress` currently includes Toledo Bend Reservoir. Treat that as a post-launch/CPU-bump stress target, not a launch blocker.

## Production Cache Wipe SQL

Do not execute until Brandon confirms the exact Supabase project/environment.

Audit existing cache namespaces before and after deploy:

```sql
select engine_version, count(*) as rows
from public.water_reader_engine_read_cache
group by engine_version
order by engine_version;
```

Wipe only the generated Water Reader read cache:

```sql
truncate table public.water_reader_engine_read_cache;
```

Verify the wipe:

```sql
select count(*) as remaining_rows
from public.water_reader_engine_read_cache;
```

Required result:

```text
remaining_rows = 0
```

If `truncate` is blocked by production policy, use:

```sql
delete from public.water_reader_engine_read_cache;
```

Never wipe `waterbody_index`, source polygon tables, or user/account/subscription tables for this launch.
