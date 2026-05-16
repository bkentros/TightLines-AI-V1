import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { startHeavyGeneratorServer } from './water-reader-heavy-generator-server.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  process.env.WATER_READER_INTERNAL_KEY = process.env.WATER_READER_INTERNAL_KEY || 'queue-smoke-key';

  const serverSource = readFileSync('scripts/water-reader-heavy-generator-server.ts', 'utf8');
  const edgeSource = readFileSync('supabase/functions/water-reader-read/index.ts', 'utf8');
  const migrationSource = readFileSync('supabase/migrations/20260515120000_water_reader_generation_queue_history.sql', 'utf8');
  const activeGuardMigrationSource = readFileSync('supabase/migrations/20260516120000_water_reader_user_active_generation_guard.sql', 'utf8');
  const retryWatchdogMigrationSource = readFileSync('supabase/migrations/20260516140000_water_reader_retryable_queue_watchdog.sql', 'utf8');
  const historySource = readFileSync('supabase/functions/water-reader-history/index.ts', 'utf8');
  const docsSource = readFileSync('docs/water_reader_heavy_worker_cloud_run.md', 'utf8');

  assert(serverSource.includes('/water-reader/jobs/process-one'), 'worker should expose process-one endpoint');
  assert(serverSource.includes('/water-reader/jobs/drain'), 'worker should expose drain endpoint');
  assert(serverSource.includes('claim_water_reader_generation_job'), 'worker should claim jobs through RPC');
  assert(serverSource.includes('generateWaterReaderHeavyRead'), 'worker should reuse heavy read generator');
  assert(serverSource.includes('mark_water_reader_generation_job_complete'), 'worker should mark jobs complete');
  assert(serverSource.includes('mark_water_reader_generation_job_failed'), 'worker should mark jobs failed/retryable');
  assert(edgeSource.includes('generationStatus: jobStatus'), 'edge pending response should include generation status');
  assert(edgeSource.includes('generationJobId: params.job.id'), 'edge pending response should include job id');
  assert(edgeSource.includes('retryAfterMs'), 'edge pending response should include retry hint');
  assert(edgeSource.includes('GENERATION_JOB_MAX_ATTEMPTS = 10'), 'edge should keep generation jobs retryable for launch traffic');
  assert(edgeSource.includes('keepGenerationJobRetryable'), 'edge should reopen failed generation jobs instead of leaving a dead end');
  assert(!edgeSource.includes('EDGE_INLINE_METADATA_AREA_ACRES_LIMIT'), 'edge should not route by acreage alone before runtime complexity is known');
  assert(edgeSource.includes('heavy.heavy && heavyGeneratorConfigured()'), 'edge should only worker-route measured heavy reads when the worker is configured');
  assert(edgeSource.includes('Deno.env.get("WATER_READER_DIRECT_HEAVY_GENERATION") === "true"'), 'direct heavy generation should be explicit opt-in');
  assert(edgeSource.includes('surface_area_acres, centroid'), 'edge metadata lookup should include lightweight area and centroid for pre-polygon routing');
  assert(edgeSource.includes('metadataPendingPolygon(metadata)'), 'edge should build a pending response from metadata for emergency queueing and polygon RPC failure');
  assert(edgeSource.includes('allowDirectHeavyGeneration'), 'edge should try direct heavy generation before queueing risky reads');
  assert(edgeSource.includes('!diagnosticMode && routeAllCacheMissesThroughHeavyWorker()'), 'edge safest mode should route every uncached read before runtime polygon fetch');
  assert(edgeSource.includes('polygon rpc failed') && edgeSource.includes('queueGenerationReadResponse'), 'edge polygon RPC failures should fall back to queued generation');
  assert(edgeSource.includes('kickGenerationWorker'), 'edge pending response path should kick the worker after queueing a job');
  assert(edgeSource.includes('/water-reader/jobs/drain'), 'edge worker kick should use the queue drain endpoint');
  assert(edgeSource.includes('begin_water_reader_generation_request'), 'edge should acquire the per-user active generation guard through RPC');
  assert(edgeSource.includes('findRecentUserBuildingJob'), 'edge pending response path should guard rapid heavy read starts');
  assert(edgeSource.includes('Another Water Read is Building. Check Recent Water Reads'), 'edge rapid-start guard should return friendly user-safe copy');
  assert(migrationSource.includes('check (status in (') && migrationSource.includes("'processing'"), 'migration should constrain job statuses');
  assert(activeGuardMigrationSource.includes('water_reader_user_active_generation_requests'), 'active guard migration should create one active generation row per user');
  assert(activeGuardMigrationSource.includes('pg_advisory_xact_lock'), 'active guard RPC should serialize concurrent starts for the same user');
  assert(activeGuardMigrationSource.includes('begin_water_reader_generation_request'), 'active guard migration should expose begin RPC');
  assert(activeGuardMigrationSource.includes('clear_water_reader_user_active_generation_request'), 'active guard migration should expose clear RPC');
  assert(activeGuardMigrationSource.includes('delete from public.water_reader_user_active_generation_requests') && activeGuardMigrationSource.includes('generation_job_id = in_job_id'), 'job completion/failure should clear active generation rows');
  assert(retryWatchdogMigrationSource.includes('water_reader_generation_error_is_retryable'), 'retry watchdog should classify retryable generation errors');
  assert(retryWatchdogMigrationSource.includes('requeue_water_reader_generation_job'), 'retry watchdog should requeue retryable failed jobs');
  assert(retryWatchdogMigrationSource.includes('requeue_stale_water_reader_generation_jobs'), 'retry watchdog should requeue stale processing jobs');
  assert(retryWatchdogMigrationSource.includes("when retryable then 'queued'"), 'retryable worker failures should remain queued instead of terminal failed');
  assert(historySource.includes('requeue_water_reader_generation_job'), 'history should requeue retryable failures before showing building');
  assert(historySource.includes('requeue_stale_water_reader_generation_jobs'), 'history should run the stale job watchdog before deriving recent-read status');
  assert(docsSource.includes('Cloud Scheduler'), 'queue runner docs should mention Cloud Scheduler');
  assert(docsSource.includes('/water-reader/jobs/drain'), 'queue runner docs should mention the drain endpoint');
  assert(docsSource.includes('WATER_READER_DIRECT_HEAVY_GENERATION="true"') && docsSource.includes('WATER_READER_ROUTE_ALL_CACHE_MISSES_TO_WORKER=false') && docsSource.includes('hybrid launch path'), 'queue runner docs should recommend hybrid production routing');
  assert(docsSource.includes('Cloud Tasks') && docsSource.includes('multiple Cloud Scheduler jobs'), 'queue runner docs should mention high-volume runner options');

  const server = startHeavyGeneratorServer(0);
  try {
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/water-reader/jobs/process-one`, {
      method: 'POST',
      headers: { 'x-water-reader-internal-key': 'wrong-key' },
    });
    assert(response.status === 403, `worker drain endpoint should reject a bad internal key, got ${response.status}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }

  console.log(JSON.stringify({
    ok: true,
    queueMigration: '20260515120000_water_reader_generation_queue_history.sql',
    activeGuardMigration: '20260516120000_water_reader_user_active_generation_guard.sql',
    retryWatchdogMigration: '20260516140000_water_reader_retryable_queue_watchdog.sql',
    workerRejectsBadInternalKey: true,
  }));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
