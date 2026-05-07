import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { buildWaterReaderSeasonContext } from '../supabase/functions/_shared/waterReaderRead/seasonContext.ts';
import {
  WATER_READER_APP_SVG_WIDTH,
  WATER_READER_ENGINE_VERSION,
  type WaterReaderReadResponse,
} from '../supabase/functions/_shared/waterReaderRead/contracts.ts';
import { generateWaterReaderHeavyRead } from './water-reader-heavy-generator-server.ts';

const OUT = 'tmp/water-reader-50-lake-tuning/chunk-7i-worker-smoke.json';
const CURRENT_DATE = '2026-07-15T12:00:00.000Z';
const TARGETS = [
  { label: 'Van Norman Lake', lakeId: '3113638f-9be6-4303-9011-62a9892a1ab9', state: 'MI' },
  { label: 'Lake Minnetonka', lakeId: 'fb322d45-0a28-4216-b30d-61b71f391d6a', state: 'MN' },
  { label: 'Lake Apopka', lakeId: '1b3d4c1f-2781-4651-be56-7766a359c8f5', state: 'FL' },
];

function requireEnv(names: string[]): Record<string, string> {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) throw new Error(`Missing required env: ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, process.env[name] as string]));
}

function seasonKey(state: string) {
  return buildWaterReaderSeasonContext(state, new Date(CURRENT_DATE)).seasonContextKey;
}

async function deleteCacheKey(supabase: any, target: typeof TARGETS[number]) {
  const { error, count } = await supabase
    .from('water_reader_engine_read_cache')
    .delete({ count: 'exact' })
    .eq('lake_id', target.lakeId)
    .eq('season_context_key', seasonKey(target.state))
    .eq('map_width', WATER_READER_APP_SVG_WIDTH)
    .eq('engine_version', WATER_READER_ENGINE_VERSION);
  if (error) throw new Error(`cache delete failed for ${target.label}: ${error.message}`);
  return count ?? 0;
}

function rowSummary(target: typeof TARGETS[number], read: WaterReaderReadResponse, elapsedMs: number, deletedRows: number) {
  const passed = Boolean(
    read.cacheStatus === 'miss' &&
    (read.cacheWriteStatus === 'stored' || read.cacheWriteStatus === 'failed') &&
    elapsedMs < 20000 &&
    read.displayedEntryCount > 0 &&
    read.productionSvgResult?.svg &&
    read.fallbackMessage === null
  );
  return {
    label: target.label,
    lakeId: target.lakeId,
    status: passed ? 'passed' : 'failed',
    deletedRows,
    cacheStatus: read.cacheStatus ?? null,
    cacheWriteStatus: read.cacheWriteStatus ?? null,
    workerElapsedMs: elapsedMs,
    timingTotalMs: read.timings?.totalMs ?? null,
    displayedEntryCount: read.displayedEntryCount,
    hasSvg: Boolean(read.productionSvgResult?.svg),
    fallbackMessage: read.fallbackMessage,
    originalVertexCount: read.originalVertexCount ?? null,
    runtimeVertexCount: read.runtimeVertexCount ?? null,
    runtimeSimplified: read.runtimeSimplified ?? null,
    rendererWarningCount: read.rendererWarningCount,
    passed,
  };
}

async function main() {
  mkdirSync(dirname(OUT), { recursive: true });
  const env = requireEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const rows = [];
  for (const target of TARGETS) {
    const deletedRows = await deleteCacheKey(supabase, target);
    const started = Date.now();
    const read = await generateWaterReaderHeavyRead({
      lakeId: target.lakeId,
      currentDate: CURRENT_DATE,
      seasonContextKey: seasonKey(target.state),
      mapWidth: WATER_READER_APP_SVG_WIDTH,
      engineVersion: WATER_READER_ENGINE_VERSION,
    });
    rows.push(rowSummary(target, read, Date.now() - started, deletedRows));
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    currentDate: CURRENT_DATE,
    status: rows.every((row) => row.passed) ? 'passed' : 'failed',
    rows,
  };
  writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify(payload, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
