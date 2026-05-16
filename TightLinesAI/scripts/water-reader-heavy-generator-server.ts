import { createClient } from '@supabase/supabase-js';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { fileURLToPath } from 'node:url';
import { buildServerWaterReaderRead } from '../supabase/functions/_shared/waterReaderRead/buildRead.ts';
import { buildWaterReaderSeasonContext } from '../supabase/functions/_shared/waterReaderRead/seasonContext.ts';
import {
  WATER_READER_APP_SVG_WIDTH,
  WATER_READER_ENGINE_VERSION,
  WATER_READER_READ_FEATURE,
  type WaterbodyPolygonForWaterReaderRead,
  type WaterReaderReadResponse,
} from '../supabase/functions/_shared/waterReaderRead/contracts.ts';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface PolygonRpcRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: string;
  centroid_lat: number;
  centroid_lon: number;
  bbox_min_lon: number | null;
  bbox_min_lat: number | null;
  bbox_max_lon: number | null;
  bbox_max_lat: number | null;
  area_sq_m: number | null;
  area_acres: number | null;
  perimeter_m: number | null;
  geojson: unknown | null;
  geometry_is_valid: boolean;
  geometry_validity_detail: string | null;
  component_count: number;
  interior_ring_count: number;
  water_reader_support_status: WaterbodyPolygonForWaterReaderRead['waterReaderSupportStatus'];
  water_reader_support_reason: string;
  polygon_qa_flags: string[] | null;
  original_vertex_count?: number | null;
  runtime_vertex_count?: number | null;
  runtime_component_count?: number | null;
  runtime_interior_ring_count?: number | null;
  runtime_simplified?: boolean | null;
  runtime_simplification_tolerance?: number | null;
}

interface GenerateRequest {
  lakeId: string;
  currentDate?: string;
  seasonContextKey?: string;
  mapWidth?: number;
  engineVersion?: string;
}

interface GenerationJobRow {
  id: string;
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  attempts: number;
  max_attempts: number;
  next_attempt_at: string;
  last_error: string | null;
}

function requireEnv(names: string[]): Record<string, string> {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) throw new Error(`Missing required env: ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, process.env[name] as string]));
}

function parseDate(value: string | undefined): Date {
  const date = value ? new Date(value) : new Date();
  if (!Number.isFinite(date.getTime())) throw new Error(`Invalid currentDate: ${value}`);
  return date;
}

function previewBbox(row: PolygonRpcRow): WaterbodyPolygonForWaterReaderRead['bbox'] {
  const minLon = row.bbox_min_lon;
  const minLat = row.bbox_min_lat;
  const maxLon = row.bbox_max_lon;
  const maxLat = row.bbox_max_lat;
  if (
    typeof minLon !== 'number' ||
    typeof minLat !== 'number' ||
    typeof maxLon !== 'number' ||
    typeof maxLat !== 'number' ||
    !Number.isFinite(minLon) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLon) ||
    !Number.isFinite(maxLat) ||
    minLon >= maxLon ||
    minLat >= maxLat
  ) {
    return null;
  }
  return { minLon, minLat, maxLon, maxLat };
}

function mapPolygon(row: PolygonRpcRow): WaterbodyPolygonForWaterReaderRead {
  return {
    lakeId: row.lake_id,
    name: row.name,
    state: row.state,
    county: row.county,
    waterbodyType: row.waterbody_type,
    centroid: { lat: row.centroid_lat, lon: row.centroid_lon },
    bbox: previewBbox(row),
    areaSqM: row.area_sq_m,
    areaAcres: row.area_acres,
    perimeterM: row.perimeter_m,
    geojson:
      row.geojson &&
        typeof row.geojson === 'object' &&
        'type' in row.geojson &&
        'coordinates' in row.geojson
        ? row.geojson as WaterbodyPolygonForWaterReaderRead['geojson']
        : null,
    geometryIsValid: row.geometry_is_valid,
    geometryValidityDetail: row.geometry_validity_detail,
    componentCount: row.component_count,
    interiorRingCount: row.interior_ring_count,
    waterReaderSupportStatus: row.water_reader_support_status,
    waterReaderSupportReason: row.water_reader_support_reason,
    polygonQaFlags: row.polygon_qa_flags ?? [],
    originalVertexCount: row.original_vertex_count ?? null,
    runtimeVertexCount: row.runtime_vertex_count ?? null,
    runtimeComponentCount: row.runtime_component_count ?? null,
    runtimeInteriorRingCount: row.runtime_interior_ring_count ?? null,
    runtimeSimplified: row.runtime_simplified ?? null,
    runtimeSimplificationTolerance: row.runtime_simplification_tolerance ?? null,
  };
}

function cacheQaFlags(read: WaterReaderReadResponse): string[] {
  return [
    ...read.polygonQaFlags,
    read.fallbackMessage ? 'fallback_no_map' : null,
    read.displayedEntryCount === 0 ? 'zero_displayed_entries' : null,
    read.rendererWarningCount > 0 ? 'renderer_warnings' : null,
    read.retainedEntryCount > 0 ? 'retained_entries' : null,
  ].filter(Boolean) as string[];
}

function cacheKey(state: string, currentDate: Date) {
  // Full read/SVG cache stays season-context keyed because the legend/read copy varies by season.
  // The production feature-envelope geometry is season-invariant.
  return buildWaterReaderSeasonContext(state, currentDate).seasonContextKey;
}

function representativeDateForSeasonContextKey(state: string, seasonContextKey: string): Date | null {
  for (let month = 0; month < 12; month += 1) {
    for (let day = 1; day <= 31; day += 1) {
      const date = new Date(Date.UTC(2026, month, day, 12, 0, 0));
      if (date.getUTCMonth() !== month) continue;
      if (buildWaterReaderSeasonContext(state, date).seasonContextKey === seasonContextKey) return date;
    }
  }
  return null;
}

async function fetchRuntimePolygon(supabase: any, lakeId: string) {
  const started = Date.now();
  const { data, error } = await supabase.rpc('get_waterbody_polygon_runtime_for_reader', { in_lake_id: lakeId });
  const fetchMs = Date.now() - started;
  if (error) throw new Error(`polygon_fetch_failed: ${error.message}`);
  const row = Array.isArray(data) ? data[0] as PolygonRpcRow | undefined : undefined;
  if (!row) throw new Error('not_found');
  return { polygon: mapPolygon(row), fetchMs };
}

async function readCacheBySeasonContext(
  supabase: any,
  lakeId: string,
  seasonContextKey: string,
  fetchMs: number,
) {
  const started = Date.now();
  const { data, error } = await supabase
    .from('water_reader_engine_read_cache')
    .select('read_response')
    .eq('lake_id', lakeId)
    .eq('season_context_key', seasonContextKey)
    .eq('map_width', WATER_READER_APP_SVG_WIDTH)
    .eq('engine_version', WATER_READER_ENGINE_VERSION)
    .maybeSingle<{ read_response: WaterReaderReadResponse }>();
  const cacheMs = Date.now() - started;
  if (error) throw new Error(`cache_lookup_failed: ${error.message}`);
  if (!data?.read_response) return { read: null, cacheMs, seasonContextKey };
  return {
    read: {
      ...data.read_response,
      generationStatus: 'ready',
      generationJobId: null,
      retryAfterMs: null,
      cacheStatus: 'hit',
      seasonContextKey,
      mapWidth: WATER_READER_APP_SVG_WIDTH,
      engineVersion: WATER_READER_ENGINE_VERSION,
      timings: {
        ...(data.read_response.timings ?? {}),
        fetchMs,
        cacheMs,
        totalMs: fetchMs + cacheMs,
      },
    },
    cacheMs,
    seasonContextKey,
  };
}

async function seasonContextKeyForRequest(supabase: any, request: GenerateRequest, currentDate: Date): Promise<string | null> {
  if (request.seasonContextKey) return request.seasonContextKey;
  const { data, error } = await supabase
    .from('waterbody_index')
    .select('state_code')
    .eq('id', request.lakeId)
    .maybeSingle<{ state_code: string | null }>();
  if (error || !data?.state_code) return null;
  return cacheKey(data.state_code, currentDate);
}

async function readCacheBeforePolygon(supabase: any, request: GenerateRequest, currentDate: Date) {
  const seasonContextKey = await seasonContextKeyForRequest(supabase, request, currentDate);
  if (!seasonContextKey) return null;
  return readCacheBySeasonContext(supabase, request.lakeId, seasonContextKey, 0);
}

async function upsertCache(supabase: any, read: WaterReaderReadResponse, seasonContextKey: string) {
  const { error } = await supabase
    .from('water_reader_engine_read_cache')
    .upsert({
      lake_id: read.lakeId,
      season_context_key: seasonContextKey,
      map_width: WATER_READER_APP_SVG_WIDTH,
      engine_version: WATER_READER_ENGINE_VERSION,
      read_response: read,
      timings: read.timings ?? null,
      qa_flags: cacheQaFlags(read),
    }, {
      onConflict: 'lake_id,season_context_key,map_width,engine_version',
    });
  if (!error) return { cacheWriteStatus: 'stored' as const, cacheWriteError: null };
  return {
    cacheWriteStatus: 'failed' as const,
    cacheWriteError: 'Generated read returned without caching.',
  };
}

export async function generateWaterReaderHeavyRead(request: GenerateRequest): Promise<WaterReaderReadResponse> {
  if (!request.lakeId || !UUID_RE.test(request.lakeId)) throw new Error('invalid_lake_id');
  if (request.mapWidth != null && request.mapWidth !== WATER_READER_APP_SVG_WIDTH) throw new Error('invalid_map_width');
  if (request.engineVersion != null && request.engineVersion !== WATER_READER_ENGINE_VERSION) throw new Error('invalid_engine_version');
  const env = requireEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  let currentDate = parseDate(request.currentDate);
  try {
    const cachedBeforePolygon = await readCacheBeforePolygon(supabase, request, currentDate);
    if (cachedBeforePolygon?.read) return cachedBeforePolygon.read;
  } catch (error) {
    console.warn('[water-reader-heavy-generator] cache precheck failed; continuing to polygon fetch', error);
  }
  const { polygon, fetchMs } = await fetchRuntimePolygon(supabase, request.lakeId);
  if (request.seasonContextKey) {
    currentDate = representativeDateForSeasonContextKey(polygon.state, request.seasonContextKey) ?? currentDate;
  }
  const seasonContextKey = request.seasonContextKey ?? cacheKey(polygon.state, currentDate);
  const cached = await readCacheBySeasonContext(supabase, polygon.lakeId, seasonContextKey, fetchMs);
  if (cached.read) return cached.read;

  const generated = buildServerWaterReaderRead({ polygonPayload: polygon, currentDate, fetchMs });
  const cacheWrite = await upsertCache(supabase, generated, seasonContextKey);
  return {
    ...generated,
    generationStatus: 'ready',
    generationJobId: null,
    retryAfterMs: null,
    cacheStatus: 'miss',
    ...cacheWrite,
    seasonContextKey,
    mapWidth: WATER_READER_APP_SVG_WIDTH,
    engineVersion: WATER_READER_ENGINE_VERSION,
    timings: {
      ...(generated.timings ?? {}),
      cacheMs: cached.cacheMs,
    },
  };
}

function normalizeJobRow(data: unknown): GenerationJobRow | null {
  if (!data) return null;
  if (Array.isArray(data)) return data[0] as GenerationJobRow | undefined ?? null;
  return data as GenerationJobRow;
}

function jobBackoffSeconds(job: GenerationJobRow): number {
  return Math.min(900, 30 * Math.max(1, 2 ** job.attempts));
}

async function processOneGenerationJob(workerId: string) {
  const env = requireEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc('claim_water_reader_generation_job', {
    in_worker_id: workerId,
  });
  if (error) throw new Error(`claim_job_failed: ${error.message}`);
  const job = normalizeJobRow(data);
  if (!job?.id) {
    return { status: 'no_job' as const, claimed: false };
  }

  try {
    const read = await generateWaterReaderHeavyRead({
      lakeId: job.lake_id,
      seasonContextKey: job.season_context_key,
      mapWidth: job.map_width,
      engineVersion: job.engine_version,
    });
    if (read.cacheWriteStatus === 'failed') {
      throw new Error(read.cacheWriteError ?? 'cache_write_failed');
    }
    const { error: completeError } = await supabase.rpc('mark_water_reader_generation_job_complete', {
      in_job_id: job.id,
    });
    if (completeError) throw new Error(`mark_complete_failed: ${completeError.message}`);
    return {
      status: 'completed' as const,
      claimed: true,
      jobId: job.id,
      lakeId: job.lake_id,
      cacheStatus: read.cacheStatus ?? null,
      cacheWriteStatus: read.cacheWriteStatus ?? null,
      displayedEntryCount: read.displayedEntryCount,
      hasSvg: Boolean(read.productionSvgResult?.svg),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const { error: failedError } = await supabase.rpc('mark_water_reader_generation_job_failed', {
      in_job_id: job.id,
      in_error: message,
      in_retry_after_seconds: jobBackoffSeconds(job),
    });
    if (failedError) throw new Error(`mark_failed_failed: ${failedError.message}; original=${message}`);
    return {
      status: 'failed' as const,
      claimed: true,
      jobId: job.id,
      lakeId: job.lake_id,
      error: message,
      retryAfterSeconds: jobBackoffSeconds(job),
    };
  }
}

async function drainGenerationJobs(workerId: string, maxJobs: number) {
  const limit = Math.max(1, Math.min(25, Math.floor(maxJobs)));
  const results = [];
  for (let i = 0; i < limit; i += 1) {
    const result = await processOneGenerationJob(workerId);
    results.push(result);
    if (result.status === 'no_job') break;
  }
  return {
    status: results.some((row) => row.status === 'completed')
      ? 'completed'
      : results.some((row) => row.status === 'failed')
        ? 'failed'
        : 'no_job',
    claimed: results.filter((row) => row.claimed).length,
    completed: results.filter((row) => row.status === 'completed').length,
    failed: results.filter((row) => row.status === 'failed').length,
    noJob: results.some((row) => row.status === 'no_job'),
    results,
  };
}

async function readJsonBody(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function startHeavyGeneratorServer(port: number) {
  const internalKey = process.env.WATER_READER_INTERNAL_KEY;
  if (!internalKey) throw new Error('Missing WATER_READER_INTERNAL_KEY');
  const server = createServer(async (req, res) => {
    try {
      if (req.method !== 'POST') {
        sendJson(res, 404, { error: 'not_found', message: 'Not found' });
        return;
      }
      if (req.headers['x-water-reader-internal-key'] !== internalKey) {
        sendJson(res, 403, { error: 'forbidden', message: 'Forbidden' });
        return;
      }
      const url = req.url ?? '';
      if (url === '/water-reader/generate') {
        const body = await readJsonBody(req);
        const read = await generateWaterReaderHeavyRead(body);
        sendJson(res, 200, read);
        return;
      }
      if (url === '/water-reader/jobs/process-one') {
        const workerId = String(req.headers['x-water-reader-worker-id'] ?? process.env.WATER_READER_WORKER_ID ?? `worker-${process.pid}`);
        sendJson(res, 200, await processOneGenerationJob(workerId));
        return;
      }
      if (url === '/water-reader/jobs/drain') {
        const body = await readJsonBody(req);
        const workerId = String(req.headers['x-water-reader-worker-id'] ?? process.env.WATER_READER_WORKER_ID ?? `worker-${process.pid}`);
        const maxJobs = typeof body.maxJobs === 'number' ? body.maxJobs : 1;
        sendJson(res, 200, await drainGenerationJobs(workerId, maxJobs));
        return;
      }
      sendJson(res, 404, { error: 'not_found', message: 'Not found' });
    } catch (error) {
      sendJson(res, 500, {
        feature: WATER_READER_READ_FEATURE,
        error: 'heavy_generation_failed',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
  server.listen(port, () => {
    console.log(JSON.stringify({ ok: true, server: 'water-reader-heavy-generator', port }));
  });
  return server;
}

function arg(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const port = Number(arg('--port') ?? process.env.PORT ?? process.env.WATER_READER_HEAVY_GENERATOR_PORT ?? 8789);
  if (process.argv.includes('--serve')) {
    startHeavyGeneratorServer(Number.isFinite(port) ? port : 8789);
    return;
  }
  if (process.argv.includes('--once')) {
    const lakeId = arg('--lake-id');
    if (!lakeId) throw new Error('Missing --lake-id');
    const currentDate = arg('--date') ?? new Date().toISOString();
    const read = await generateWaterReaderHeavyRead({
      lakeId,
      currentDate: currentDate.includes('T') ? currentDate : `${currentDate}T12:00:00.000Z`,
      mapWidth: WATER_READER_APP_SVG_WIDTH,
      engineVersion: WATER_READER_ENGINE_VERSION,
    });
    console.log(JSON.stringify({
      lakeId: read.lakeId,
      name: read.name,
      cacheStatus: read.cacheStatus,
      cacheWriteStatus: read.cacheWriteStatus ?? null,
      totalMs: read.timings?.totalMs ?? null,
      displayedEntryCount: read.displayedEntryCount,
      hasSvg: Boolean(read.productionSvgResult?.svg),
      fallbackMessage: read.fallbackMessage,
      originalVertexCount: read.originalVertexCount ?? null,
      runtimeVertexCount: read.runtimeVertexCount ?? null,
      rendererWarningCount: read.rendererWarningCount,
    }, null, 2));
    return;
  }
  console.error('Use --serve or --once --lake-id <uuid> --date <YYYY-MM-DD>');
  process.exit(1);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  void main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
