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
  return buildWaterReaderSeasonContext(state, currentDate).seasonContextKey;
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

async function readCache(supabase: any, polygon: WaterbodyPolygonForWaterReaderRead, currentDate: Date, fetchMs: number) {
  const seasonContextKey = cacheKey(polygon.state, currentDate);
  const started = Date.now();
  const { data, error } = await supabase
    .from('water_reader_engine_read_cache')
    .select('read_response')
    .eq('lake_id', polygon.lakeId)
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
  const currentDate = parseDate(request.currentDate);
  const { polygon, fetchMs } = await fetchRuntimePolygon(supabase, request.lakeId);
  const cached = await readCache(supabase, polygon, currentDate, fetchMs);
  if (request.seasonContextKey && cached.seasonContextKey !== request.seasonContextKey) {
    throw new Error(`season_context_mismatch:${cached.seasonContextKey}`);
  }
  if (cached.read) return cached.read;

  const generated = buildServerWaterReaderRead({ polygonPayload: polygon, currentDate, fetchMs });
  const cacheWrite = await upsertCache(supabase, generated, cached.seasonContextKey);
  return {
    ...generated,
    cacheStatus: 'miss',
    ...cacheWrite,
    seasonContextKey: cached.seasonContextKey,
    mapWidth: WATER_READER_APP_SVG_WIDTH,
    engineVersion: WATER_READER_ENGINE_VERSION,
    timings: {
      ...(generated.timings ?? {}),
      cacheMs: cached.cacheMs,
    },
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
      if (req.method !== 'POST' || req.url !== '/water-reader/generate') {
        sendJson(res, 404, { error: 'not_found', message: 'Not found' });
        return;
      }
      if (req.headers['x-water-reader-internal-key'] !== internalKey) {
        sendJson(res, 403, { error: 'forbidden', message: 'Forbidden' });
        return;
      }
      const body = await readJsonBody(req);
      const read = await generateWaterReaderHeavyRead(body);
      sendJson(res, 200, read);
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
  const port = Number(arg('--port') ?? process.env.WATER_READER_HEAVY_GENERATOR_PORT ?? 8789);
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
