# Water Reader V4 Rollout Runbook

Current engine/cache namespace:

```text
water-reader-engine-v4-paper-redesign
```

This rollout aligns all three live pieces:

1. Cloud Run heavy worker image.
2. Supabase `water-reader-read` Edge Function.
3. Generated cache rows in `water_reader_engine_read_cache`.

Do not wipe production cache until Brandon confirms the exact target environment.

## 1. Build And Deploy The V4 Cloud Run Worker

Run in Google Cloud Shell:

```bash
export PROJECT_ID="project-cfc7b3bc-30d6-4173-ade"
export REGION="us-central1"
export REPO="tightlines-workers"
export IMAGE="water-reader-heavy-generator"
export TAG="water-reader-engine-v4-paper-redesign"
export SERVICE="water-reader-heavy-generator"
export IMAGE_URL="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$TAG"

gcloud config set project "$PROJECT_ID"

cd ~/TightLines-AI-V1/TightLinesAI || {
  git clone https://github.com/bkentros/TightLines-AI-V1.git ~/TightLines-AI-V1
  cd ~/TightLines-AI-V1/TightLinesAI
}

git pull origin main

cp Dockerfile.water-reader-heavy-generator Dockerfile

gcloud builds submit \
  --tag "$IMAGE_URL"

gcloud run deploy "$SERVICE" \
  --image "$IMAGE_URL" \
  --region "$REGION" \
  --allow-unauthenticated \
  --cpu 2 \
  --memory 2Gi \
  --concurrency 1 \
  --min-instances 0 \
  --max-instances 5 \
  --timeout 60s \
  --set-env-vars SUPABASE_URL="https://hsesngprhpgajyfbrwbf.supabase.co" \
  --set-secrets SUPABASE_SERVICE_ROLE_KEY="supabase-service-role-key:latest",WATER_READER_INTERNAL_KEY="water-reader-internal-key:latest"
```

Expected service URL:

```text
https://water-reader-heavy-generator-702173693212.us-central1.run.app
```

## 2. Deploy Supabase Read Function With V4 Runtime

Run after the Cloud Run worker deploy succeeds:

```bash
export SUPABASE_PROJECT_REF="hsesngprhpgajyfbrwbf"
export WORKER_URL="https://water-reader-heavy-generator-702173693212.us-central1.run.app"

npx supabase@latest secrets set --project-ref "$SUPABASE_PROJECT_REF" \
  WATER_READER_INTERNAL_KEY="$(gcloud secrets versions access latest --secret=water-reader-internal-key)" \
  WATER_READER_HEAVY_GENERATOR_URL="$WORKER_URL" \
  WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS="45000"

npx supabase@latest functions deploy water-reader-read --project-ref "$SUPABASE_PROJECT_REF"
```

## 3. Verify Live V4 Alignment

Run from a repo checkout that has `.env` with the Water Reader test user:

```bash
npm run smoke:water-reader-live-launch
```

The smoke must report:

```text
expectedEngineVersion: water-reader-engine-v4-paper-redesign
status: passed
```

Every read row should show `actualEngineVersion` equal to `water-reader-engine-v4-paper-redesign`.

## 4. Cache Audit SQL

Audit before any wipe:

```sql
select engine_version, count(*) as rows
from public.water_reader_engine_read_cache
group by engine_version
order by engine_version;
```

After v4 deploy, v3 rows can remain temporarily because the v4 cache key will miss and regenerate. Wiping is only needed if Brandon wants to force storage cleanup and avoid any old namespace rows hanging around.

Production wipe command, only after explicit confirmation:

```sql
truncate table public.water_reader_engine_read_cache;
```

Verify:

```sql
select count(*) as remaining_rows
from public.water_reader_engine_read_cache;
```
