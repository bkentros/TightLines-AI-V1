# Water Reader Heavy Worker - Cloud Run Launch

## Worker Image

Build from the repo root with the dedicated Dockerfile:

```bash
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/<gcp-project>/<artifact-repo>/water-reader-heavy-generator:water-reader-engine-v3-live-final \
  --file Dockerfile.water-reader-heavy-generator
```

The container starts the existing heavy-generator server entrypoint. On Cloud Run it listens on `PORT`; locally it falls back to `WATER_READER_HEAVY_GENERATOR_PORT` or `8789`.

## Required Worker Secrets

Set these as Cloud Run secrets or environment variables:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
WATER_READER_INTERNAL_KEY
```

`WATER_READER_INTERNAL_KEY` must match the Supabase Edge Function secret of the same name. Rotate any local tunnel/test key before production.

## Recommended Cloud Run Settings

Start conservative:

```bash
gcloud run deploy water-reader-heavy-generator \
  --image us-central1-docker.pkg.dev/<gcp-project>/<artifact-repo>/water-reader-heavy-generator:water-reader-engine-v3-live-final \
  --region us-central1 \
  --allow-unauthenticated \
  --cpu 2 \
  --memory 2Gi \
  --concurrency 1 \
  --min-instances 0 \
  --max-instances 5 \
  --timeout 60s \
  --set-env-vars SUPABASE_URL="<supabase-url>" \
  --set-secrets SUPABASE_SERVICE_ROLE_KEY="<secret-name>:latest",WATER_READER_INTERNAL_KEY="<secret-name>:latest"
```

The endpoint is `POST /water-reader/generate` and requires header `x-water-reader-internal-key`.

## Supabase Edge Secrets

After the Cloud Run URL is known:

```bash
supabase secrets set \
  WATER_READER_HEAVY_GENERATOR_URL="<cloud-run-service-url>" \
  WATER_READER_INTERNAL_KEY="<same-secret-as-worker>" \
  WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS="25000"
```

If production smoke shows legitimate worker timeouts, raise the Edge timeout cautiously:

```bash
supabase secrets set WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS="45000"
```

Then deploy the read function:

```bash
supabase functions deploy water-reader-read
```

## Production Cache Wipe SQL

Do not execute until Brandon confirms the exact Supabase project/environment.

Audit existing cache namespaces:

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
