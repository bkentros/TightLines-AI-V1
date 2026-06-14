import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATER_READER_APP_SVG_WIDTH,
  WATER_READER_ENGINE_VERSION,
  WATER_READER_READ_FEATURE,
  type WaterbodyPolygonForWaterReaderRead,
  type WaterReaderReadOperationalDiagnostics,
  type WaterReaderReadResponse,
} from "../_shared/waterReaderRead/contracts.ts";
import { buildServerWaterReaderRead } from "../_shared/waterReaderRead/buildRead.ts";
import { buildWaterReaderSeasonContext } from "../_shared/waterReaderRead/seasonContext.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";
import { resolveServerSubscriptionTier } from "../_shared/appAccess.ts";
import {
  FREE_TRIAL_PROFILE_SELECT,
  type FreeTrialProfileRow,
  isFreeTierWaterReadAllowed,
  markFreeWaterReadTrialUsedIfNeeded,
} from "../_shared/freeTrialAccess.ts";
import type {
  WaterbodyPreviewBbox,
  WaterbodyType,
  WaterReaderPolygonSupportStatus,
} from "../_shared/waterReader/index.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
}

function jsonError(message: string, code: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: code, message }),
    { status, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface PolygonRpcRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: WaterbodyType | string;
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
  source_dataset: string | null;
  source_feature_id: string | null;
  source_summary: Record<string, unknown> | null;
  geometry_is_valid: boolean;
  geometry_validity_detail: string | null;
  component_count: number;
  interior_ring_count: number;
  water_reader_support_status: WaterReaderPolygonSupportStatus;
  water_reader_support_reason: string;
  polygon_qa_flags: string[] | null;
  original_vertex_count?: number | null;
  runtime_vertex_count?: number | null;
  runtime_component_count?: number | null;
  runtime_interior_ring_count?: number | null;
  runtime_simplified?: boolean | null;
  runtime_simplification_tolerance?: number | null;
}

interface CacheRow {
  read_response: WaterReaderReadResponse;
  generated_at: string;
  timings: Record<string, unknown> | null;
  qa_flags: string[] | null;
}

interface WaterbodyMetadataRow {
  id: string;
  canonical_name: string | null;
  state_code: string | null;
  county_name?: string | null;
  waterbody_type?: WaterbodyType | string | null;
  surface_area_acres?: number | string | null;
  centroid?: unknown;
}

interface GenerationJobRow {
  id: string;
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
  status: "queued" | "processing" | "complete" | "failed";
  attempts: number;
  max_attempts: number;
  next_attempt_at: string;
  last_error: string | null;
  requested_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface BeginGenerationRequestRow {
  allowed: boolean;
  same_request: boolean;
  job_id: string;
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
  status: "queued" | "processing" | "complete" | "failed";
  attempts: number;
  max_attempts: number;
  next_attempt_at: string;
  last_error: string | null;
  requested_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

type CacheWriteResult = Pick<WaterReaderReadResponse, "cacheWriteStatus" | "cacheWriteError">;

interface HeavyRouteInfo {
  heavy: boolean;
  reason: string | null;
  runtimeGeoJsonBytes: number | null;
  edgeComplexityScore: number;
}

const EDGE_INLINE_ORIGINAL_VERTEX_LIMIT = 25000;
const EDGE_INLINE_RUNTIME_VERTEX_LIMIT = 9000;
const EDGE_INLINE_RUNTIME_GEOJSON_BYTE_LIMIT = 220000;
const EDGE_INLINE_INTERIOR_RING_LIMIT = 32;
const EDGE_INLINE_RUNTIME_COMPONENT_LIMIT = 2;
const EDGE_INLINE_COMPLEXITY_SCORE_LIMIT = 12000;
const GENERATION_JOB_MAX_ATTEMPTS = 10;
const INTERIOR_RING_COMPLEXITY_WEIGHT = 120;
const DEFAULT_EDGE_POLYGON_FETCH_TIMEOUT_MS = 6000;
const WATER_READER_READ_RATE_LIMITS = [
  { windowSeconds: 60, maxRequests: 120 },
  { windowSeconds: 86400, maxRequests: 1500 },
];

function centroidPoint(value: unknown): { lon: number; lat: number } | null {
  const maybe = value as { coordinates?: unknown } | null;
  const coordinates = maybe?.coordinates;
  if (
    !Array.isArray(coordinates) ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number" ||
    !Number.isFinite(coordinates[0]) ||
    !Number.isFinite(coordinates[1])
  ) {
    return null;
  }
  return { lon: coordinates[0], lat: coordinates[1] };
}

function normalizeAcres(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function metadataPendingPolygon(row: WaterbodyMetadataRow): WaterbodyPolygonForWaterReaderRead {
  const point = centroidPoint(row.centroid) ?? { lat: 0, lon: 0 };
  const areaAcres = normalizeAcres(row.surface_area_acres);
  return {
    lakeId: row.id,
    name: row.canonical_name ?? "Selected Waterbody",
    state: row.state_code ?? "",
    county: row.county_name ?? null,
    waterbodyType: row.waterbody_type ?? "lake",
    centroid: { lat: point.lat, lon: point.lon },
    bbox: null,
    areaSqM: areaAcres == null ? null : areaAcres * 4046.8564224,
    areaAcres,
    perimeterM: null,
    geojson: null,
    geometryIsValid: true,
    geometryValidityDetail: null,
    componentCount: 0,
    interiorRingCount: 0,
    waterReaderSupportStatus: "supported",
    waterReaderSupportReason: "This larger waterbody is being prepared in the background.",
    polygonQaFlags: ["metadata_area_heavy_route"],
    originalVertexCount: null,
    runtimeVertexCount: null,
    runtimeComponentCount: null,
    runtimeInteriorRingCount: null,
    runtimeSimplified: null,
    runtimeSimplificationTolerance: null,
  };
}

function mapPreviewBbox(row: PolygonRpcRow): WaterbodyPreviewBbox | null {
  const minLon = row.bbox_min_lon;
  const minLat = row.bbox_min_lat;
  const maxLon = row.bbox_max_lon;
  const maxLat = row.bbox_max_lat;
  if (
    typeof minLon !== "number" ||
    typeof minLat !== "number" ||
    typeof maxLon !== "number" ||
    typeof maxLat !== "number" ||
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

function parseCurrentDate(value: unknown): Date | Response {
  if (value == null) return new Date();
  if (typeof value !== "string" || value.trim().length === 0) {
    return jsonError("currentDate must be an ISO date string when provided", "invalid_current_date", 400);
  }
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) {
    return jsonError("currentDate must be a valid date", "invalid_current_date", 400);
  }
  return parsed;
}

function internalKeyValid(req: Request): boolean {
  const expected = Deno.env.get("WATER_READER_INTERNAL_KEY");
  const provided = req.headers.get("x-water-reader-internal-key");
  return Boolean(expected && provided && provided === expected);
}

function runtimeGeoJsonBytes(polygon: WaterbodyPolygonForWaterReaderRead): number | null {
  if (!polygon.geojson) return null;
  return JSON.stringify(polygon.geojson).length;
}

function heavyRouteInfo(polygon: WaterbodyPolygonForWaterReaderRead): HeavyRouteInfo {
  const bytes = runtimeGeoJsonBytes(polygon);
  const originalVertexCount = polygon.originalVertexCount ?? 0;
  const runtimeVertexCount = polygon.runtimeVertexCount ?? 0;
  const runtimeComponentCount = polygon.runtimeComponentCount ?? polygon.componentCount ?? 0;
  const interiorRingCount = polygon.runtimeInteriorRingCount ?? polygon.interiorRingCount ?? 0;
  const qaFlags = polygon.polygonQaFlags ?? [];
  const edgeComplexityScore = runtimeVertexCount + (interiorRingCount * INTERIOR_RING_COMPLEXITY_WEIGHT);
  const reasons = [
    originalVertexCount >= EDGE_INLINE_ORIGINAL_VERTEX_LIMIT ? `original_vertex_count:${originalVertexCount}` : null,
    runtimeVertexCount >= EDGE_INLINE_RUNTIME_VERTEX_LIMIT ? `runtime_vertex_count:${runtimeVertexCount}` : null,
    bytes != null && bytes >= EDGE_INLINE_RUNTIME_GEOJSON_BYTE_LIMIT ? `runtime_geojson_bytes:${bytes}` : null,
    interiorRingCount >= EDGE_INLINE_INTERIOR_RING_LIMIT ? `interior_ring_count:${interiorRingCount}` : null,
    runtimeComponentCount >= EDGE_INLINE_RUNTIME_COMPONENT_LIMIT ? `runtime_component_count:${runtimeComponentCount}` : null,
    edgeComplexityScore >= EDGE_INLINE_COMPLEXITY_SCORE_LIMIT ? `edge_runtime_complexity_score:${edgeComplexityScore}` : null,
    qaFlags.includes("high_vertex_count") ? "qa_flag:high_vertex_count" : null,
    qaFlags.includes("multi_component") ? "qa_flag:multi_component" : null,
    qaFlags.includes("interior_rings") ? "qa_flag:interior_rings" : null,
  ].filter(Boolean) as string[];
  return {
    heavy: reasons.length > 0,
    reason: reasons.join(",") || null,
    runtimeGeoJsonBytes: bytes,
    edgeComplexityScore,
  };
}

function allowEdgeHeavyLocalFallback(): boolean {
  return Deno.env.get("WATER_READER_ALLOW_EDGE_HEAVY_FALLBACK") === "true";
}

function routeAllCacheMissesThroughHeavyWorker(): boolean {
  if (!heavyGeneratorConfigured()) return false;
  if (Deno.env.get("WATER_READER_ROUTE_ALL_CACHE_MISSES_TO_WORKER") === "true") return true;
  // Cache misses should stay off Supabase Edge unless inline generation is
  // explicitly re-enabled for a controlled hybrid test.
  return Deno.env.get("WATER_READER_EDGE_INLINE_CACHE_MISSES") !== "true";
}

function heavyGeneratorConfigured(): boolean {
  return Boolean(Deno.env.get("WATER_READER_HEAVY_GENERATOR_URL") && Deno.env.get("WATER_READER_INTERNAL_KEY"));
}

function allowDirectHeavyGeneration(): boolean {
  return heavyGeneratorConfigured() &&
    Deno.env.get("WATER_READER_DIRECT_HEAVY_GENERATION") === "true";
}

function edgePolygonFetchTimeoutMs(): number {
  const raw = Number(Deno.env.get("WATER_READER_EDGE_POLYGON_FETCH_TIMEOUT_MS") ?? DEFAULT_EDGE_POLYGON_FETCH_TIMEOUT_MS);
  return Number.isFinite(raw) ? Math.max(1000, Math.min(20000, Math.floor(raw))) : DEFAULT_EDGE_POLYGON_FETCH_TIMEOUT_MS;
}

function workerRouteInfo(heavy: HeavyRouteInfo): HeavyRouteInfo {
  if (heavy.heavy) return heavy;
  return {
    ...heavy,
    heavy: true,
    reason: "worker_routed_cache_miss",
  };
}

function mapPolygonRow(row: PolygonRpcRow): WaterbodyPolygonForWaterReaderRead {
  return {
    lakeId: row.lake_id,
    name: row.name,
    state: row.state,
    county: row.county,
    waterbodyType: row.waterbody_type,
    centroid: { lat: row.centroid_lat, lon: row.centroid_lon },
    bbox: mapPreviewBbox(row),
    areaSqM: row.area_sq_m,
    areaAcres: row.area_acres,
    perimeterM: row.perimeter_m,
    geojson:
      row.geojson &&
        typeof row.geojson === "object" &&
        ("type" in row.geojson) &&
        ("coordinates" in row.geojson)
        ? row.geojson as WaterbodyPolygonForWaterReaderRead["geojson"]
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

function fallbackReadResponse(params: {
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  fallbackMessage: string;
  fetchMs: number;
  metadataMs?: number;
  cacheMs: number;
  operationalDiagnostics?: WaterReaderReadOperationalDiagnostics | null;
}): WaterReaderReadResponse {
  const seasonContext = buildWaterReaderSeasonContext(params.polygon.state, params.currentDate);
  return {
    feature: WATER_READER_READ_FEATURE,
    lakeId: params.polygon.lakeId,
    name: params.polygon.name,
    state: params.polygon.state,
    county: params.polygon.county,
    waterbodyType: params.polygon.waterbodyType,
    centroid: params.polygon.centroid,
    bbox: params.polygon.bbox,
    areaSqM: params.polygon.areaSqM,
    areaAcres: params.polygon.areaAcres,
    perimeterM: params.polygon.perimeterM,
    geometryIsValid: params.polygon.geometryIsValid,
    geometryValidityDetail: params.polygon.geometryValidityDetail,
    componentCount: params.polygon.componentCount,
    interiorRingCount: params.polygon.interiorRingCount,
    waterReaderSupportStatus: params.polygon.waterReaderSupportStatus,
    waterReaderSupportReason: params.polygon.waterReaderSupportReason,
    polygonQaFlags: params.polygon.polygonQaFlags,
    originalVertexCount: params.polygon.originalVertexCount,
    runtimeVertexCount: params.polygon.runtimeVertexCount,
    runtimeComponentCount: params.polygon.runtimeComponentCount,
    runtimeInteriorRingCount: params.polygon.runtimeInteriorRingCount,
    runtimeSimplified: params.polygon.runtimeSimplified,
    runtimeSimplificationTolerance: params.polygon.runtimeSimplificationTolerance,
    engineSupportStatus: params.polygon.waterReaderSupportStatus,
    engineSupportReason: params.polygon.waterReaderSupportReason,
    displayedEntryCount: 0,
    retainedEntryCount: 0,
    rendererWarningCount: 0,
    season: seasonContext.season,
    seasonGroup: seasonContext.seasonGroup === "unknown" ? null : seasonContext.seasonGroup,
    productionSvgResult: null,
    fallbackMessage: params.fallbackMessage,
    generationStatus: params.operationalDiagnostics?.code === "controlled_fallback_failed" ? "failed" : "ready",
    generationJobId: null,
    retryAfterMs: null,
    cacheStatus: "miss",
    seasonContextKey: seasonContext.seasonContextKey,
    mapWidth: WATER_READER_APP_SVG_WIDTH,
    engineVersion: WATER_READER_ENGINE_VERSION,
    operationalDiagnostics: params.operationalDiagnostics ?? null,
    timings: {
      fetchMs: params.fetchMs,
      metadataMs: params.metadataMs,
      preprocessMs: 0,
      featuresMs: 0,
      zonesMs: 0,
      legendMs: 0,
      displayMs: 0,
      renderMs: 0,
      totalMs: (params.metadataMs ?? 0) + params.fetchMs + params.cacheMs,
    },
  };
}

function pendingReadResponse(params: {
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  job: GenerationJobRow;
  fetchMs: number;
  metadataMs?: number;
  cacheMs: number;
}): WaterReaderReadResponse {
  const seasonContext = buildWaterReaderSeasonContext(params.polygon.state, params.currentDate);
  const jobStatus = params.job.status === "processing"
    ? "processing"
    : params.job.status === "failed"
      ? "failed"
      : "queued";
  const retryAfterMs = jobStatus === "failed" ? null : 4000;
  return {
    feature: WATER_READER_READ_FEATURE,
    lakeId: params.polygon.lakeId,
    name: params.polygon.name,
    state: params.polygon.state,
    county: params.polygon.county,
    waterbodyType: params.polygon.waterbodyType,
    centroid: params.polygon.centroid,
    bbox: params.polygon.bbox,
    areaSqM: params.polygon.areaSqM,
    areaAcres: params.polygon.areaAcres,
    perimeterM: params.polygon.perimeterM,
    geometryIsValid: params.polygon.geometryIsValid,
    geometryValidityDetail: params.polygon.geometryValidityDetail,
    componentCount: params.polygon.componentCount,
    interiorRingCount: params.polygon.interiorRingCount,
    waterReaderSupportStatus: params.polygon.waterReaderSupportStatus,
    waterReaderSupportReason: params.polygon.waterReaderSupportReason,
    polygonQaFlags: params.polygon.polygonQaFlags,
    originalVertexCount: params.polygon.originalVertexCount,
    runtimeVertexCount: params.polygon.runtimeVertexCount,
    runtimeComponentCount: params.polygon.runtimeComponentCount,
    runtimeInteriorRingCount: params.polygon.runtimeInteriorRingCount,
    runtimeSimplified: params.polygon.runtimeSimplified,
    runtimeSimplificationTolerance: params.polygon.runtimeSimplificationTolerance,
    engineSupportStatus: params.polygon.waterReaderSupportStatus,
    engineSupportReason: params.polygon.waterReaderSupportReason,
    displayedEntryCount: 0,
    retainedEntryCount: 0,
    rendererWarningCount: 0,
    season: seasonContext.season,
    seasonGroup: seasonContext.seasonGroup === "unknown" ? null : seasonContext.seasonGroup,
    productionSvgResult: null,
    fallbackMessage: jobStatus === "failed"
      ? "We couldn't prepare this Water Read yet. Please try again in a bit."
      : null,
    generationStatus: jobStatus,
    generationJobId: params.job.id,
    retryAfterMs,
    cacheStatus: "miss",
    cacheWriteStatus: "skipped",
    cacheWriteError: null,
    seasonContextKey: params.job.season_context_key,
    mapWidth: WATER_READER_APP_SVG_WIDTH,
    engineVersion: WATER_READER_ENGINE_VERSION,
    operationalDiagnostics: {
      code: jobStatus === "failed" ? "generation_failed" : `generation_${jobStatus}`,
      message: jobStatus === "failed"
        ? "Water Reader generation failed before a cached read was available."
        : "Water Reader generation is queued and will be cached by the worker.",
      originalVertexCount: params.polygon.originalVertexCount ?? null,
      runtimeVertexCount: params.polygon.runtimeVertexCount ?? null,
    },
    timings: {
      fetchMs: params.fetchMs,
      metadataMs: params.metadataMs,
      cacheMs: params.cacheMs,
      preprocessMs: 0,
      featuresMs: 0,
      zonesMs: 0,
      legendMs: 0,
      displayMs: 0,
      renderMs: 0,
      totalMs: (params.metadataMs ?? 0) + params.fetchMs + params.cacheMs,
    },
  };
}

function normalizeJobRow(data: unknown): GenerationJobRow | null {
  if (!data) return null;
  if (Array.isArray(data)) return data[0] as GenerationJobRow | undefined ?? null;
  return data as GenerationJobRow;
}

function normalizeBeginGenerationRequestRow(data: unknown): BeginGenerationRequestRow | null {
  if (!data) return null;
  const row = Array.isArray(data) ? data[0] : data;
  return row as BeginGenerationRequestRow | null;
}

function generationJobFromBeginRow(row: BeginGenerationRequestRow): GenerationJobRow {
  return {
    id: row.job_id,
    lake_id: row.lake_id,
    season_context_key: row.season_context_key,
    map_width: row.map_width,
    engine_version: row.engine_version,
    status: row.status,
    attempts: row.attempts,
    max_attempts: row.max_attempts,
    next_attempt_at: row.next_attempt_at,
    last_error: row.last_error,
    requested_by: row.requested_by ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };
}

async function ensureGenerationJob(params: {
  supabase: any;
  lakeId: string;
  seasonContextKey: string;
  userId: string;
}): Promise<GenerationJobRow> {
  const { data, error } = await params.supabase.rpc("ensure_water_reader_generation_job", {
    in_lake_id: params.lakeId,
    in_season_context_key: params.seasonContextKey,
    in_map_width: WATER_READER_APP_SVG_WIDTH,
    in_engine_version: WATER_READER_ENGINE_VERSION,
    in_requested_by: params.userId,
    in_priority: 0,
  });
  if (error) throw new Error(error.message);
  const job = normalizeJobRow(data);
  if (!job?.id) throw new Error("generation job RPC returned no job");
  return job;
}

async function beginGenerationRequest(params: {
  supabase: any;
  userId: string;
  lakeId: string;
  seasonContextKey: string;
}): Promise<BeginGenerationRequestRow> {
  const { data, error } = await params.supabase.rpc("begin_water_reader_generation_request", {
    in_user_id: params.userId,
    in_lake_id: params.lakeId,
    in_season_context_key: params.seasonContextKey,
    in_map_width: WATER_READER_APP_SVG_WIDTH,
    in_engine_version: WATER_READER_ENGINE_VERSION,
    in_priority: 0,
    in_max_attempts: GENERATION_JOB_MAX_ATTEMPTS,
  });
  if (error) throw new Error(error.message);
  const row = normalizeBeginGenerationRequestRow(data);
  if (!row?.job_id) throw new Error("generation request RPC returned no job");
  return row;
}

async function keepGenerationJobRetryable(params: {
  supabase: any;
  job: GenerationJobRow;
}): Promise<GenerationJobRow> {
  if (params.job.status !== "failed" && params.job.max_attempts >= GENERATION_JOB_MAX_ATTEMPTS) {
    return params.job;
  }

  const patch: Record<string, unknown> = {
    max_attempts: GENERATION_JOB_MAX_ATTEMPTS,
  };
  if (params.job.status === "failed") {
    patch.status = "queued";
    patch.attempts = 0;
    patch.failed_at = null;
    patch.locked_by = null;
    patch.locked_at = null;
    patch.next_attempt_at = new Date().toISOString();
  }

  const { data, error } = await params.supabase
    .from("water_reader_generation_jobs")
    .update(patch)
    .eq("id", params.job.id)
    .select("id,lake_id,season_context_key,map_width,engine_version,status,attempts,max_attempts,next_attempt_at,last_error,created_at,updated_at")
    .single();

  if (error) {
    console.error("[water-reader-read] generation job retryability update failed", {
      jobId: params.job.id,
      status: params.job.status,
      message: error.message,
    });
    return params.job;
  }
  return data as GenerationJobRow;
}

async function markGenerationJobComplete(params: {
  supabase: any;
  jobId: string | null;
}) {
  if (!params.jobId) return;
  const { error } = await params.supabase.rpc("mark_water_reader_generation_job_complete", {
    in_job_id: params.jobId,
  });
  if (error) {
    console.error("[water-reader-read] generation job complete update failed", {
      jobId: params.jobId,
      message: error.message,
    });
  }
}

async function cancelGenerationJob(params: {
  supabase: any;
  jobId: string | null;
  reason: string;
}) {
  if (!params.jobId) return;
  const { error } = await params.supabase.rpc("cancel_water_reader_generation_job", {
    in_job_id: params.jobId,
    in_error: params.reason,
  });
  if (error) {
    console.error("[water-reader-read] generation job cancel update failed", {
      jobId: params.jobId,
      message: error.message,
    });
  }
}

async function clearActiveGenerationRequest(params: {
  supabase: any;
  userId: string;
  lakeId: string;
  seasonContextKey: string;
}) {
  const { error } = await params.supabase.rpc("clear_water_reader_user_active_generation_request", {
    in_user_id: params.userId,
    in_generation_job_id: null,
    in_lake_id: params.lakeId,
    in_season_context_key: params.seasonContextKey,
    in_map_width: WATER_READER_APP_SVG_WIDTH,
    in_engine_version: WATER_READER_ENGINE_VERSION,
  });
  if (error) {
    console.error("[water-reader-read] active generation request clear failed", {
      lakeId: params.lakeId,
      userId: params.userId,
      message: error.message,
    });
  }
}

interface RecentPreparingHistoryRow {
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
  generation_job_id: string | null;
  status: "preparing" | "ready" | "failed";
  last_viewed_at: string;
}

function generationCacheKey(row: {
  lake_id: string;
  season_context_key: string;
  map_width: number;
  engine_version: string;
}): string {
  return `${row.lake_id}:${row.season_context_key}:${row.map_width}:${row.engine_version}`;
}

async function findRecentUserBuildingJob(params: {
  supabase: any;
  userId: string;
}): Promise<GenerationJobRow | null> {
  const { data: historyRows, error: historyError } = await params.supabase
    .from("water_reader_user_history")
    .select("lake_id,season_context_key,map_width,engine_version,generation_job_id,status,last_viewed_at")
    .eq("user_id", params.userId)
    .eq("status", "preparing")
    .not("generation_job_id", "is", null)
    .order("last_viewed_at", { ascending: false })
    .limit(20);
  if (historyError) {
    console.error("[water-reader-read] recent building history lookup failed", {
      userId: params.userId,
      message: historyError.message,
    });
    return null;
  }

  let histories = (historyRows ?? []) as RecentPreparingHistoryRow[];
  const lakeIds = Array.from(new Set(histories.map((row) => row.lake_id)));
  if (lakeIds.length > 0) {
    const { data: cacheRows, error: cacheError } = await params.supabase
      .from("water_reader_engine_read_cache")
      .select("lake_id,season_context_key,map_width,engine_version")
      .in("lake_id", lakeIds);
    if (cacheError) {
      console.error("[water-reader-read] recent building cache lookup failed", {
        userId: params.userId,
        message: cacheError.message,
      });
    } else {
      const readyCacheKeys = new Set(
        ((cacheRows ?? []) as Array<{
          lake_id: string;
          season_context_key: string;
          map_width: number;
          engine_version: string;
        }>).map(generationCacheKey),
      );
      histories = histories.filter((row) => !readyCacheKeys.has(generationCacheKey(row)));
    }
  }

  const jobIds = histories
    .map((row) => row.generation_job_id)
    .filter((id): id is string => Boolean(id));
  if (jobIds.length === 0) return null;

  const { data: jobRows, error: jobError } = await params.supabase
    .from("water_reader_generation_jobs")
    .select("id,lake_id,season_context_key,map_width,engine_version,status,attempts,max_attempts,next_attempt_at,last_error,created_at,updated_at")
    .in("id", jobIds)
    .in("status", ["queued", "processing"])
    .order("updated_at", { ascending: false })
    .limit(1);
  if (jobError) {
    console.error("[water-reader-read] recent building job lookup failed", {
      userId: params.userId,
      message: jobError.message,
    });
    return null;
  }

  const job = Array.isArray(jobRows) ? jobRows[0] as GenerationJobRow | undefined : null;
  return job ?? null;
}

function runInBackground(promise: Promise<unknown>) {
  const edgeRuntime = (globalThis as unknown as {
    EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void };
  }).EdgeRuntime;
  if (typeof edgeRuntime?.waitUntil === "function") {
    edgeRuntime.waitUntil(promise);
    return;
  }
  promise.catch((error) => {
    console.error("[water-reader-read] background task failed", {
      message: error instanceof Error ? error.message : String(error),
    });
  });
}

async function settleWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<{ timedOut: true } | { timedOut: false; value: T }> {
  let timer: number | undefined;
  try {
    return await Promise.race([
      promise.then((value) => ({ timedOut: false as const, value })),
      new Promise<{ timedOut: true }>((resolve) => {
        timer = setTimeout(() => resolve({ timedOut: true }), timeoutMs);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

async function kickGenerationWorker(params: {
  jobId: string;
  lakeId: string;
  seasonContextKey: string;
}) {
  const url = Deno.env.get("WATER_READER_HEAVY_GENERATOR_URL");
  const internalKey = Deno.env.get("WATER_READER_INTERNAL_KEY");
  if (!url || !internalKey) return;

  const endpoint = `${url.replace(/\/$/, "")}/water-reader/jobs/drain`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-water-reader-internal-key": internalKey,
      },
      body: JSON.stringify({ maxJobs: 5 }),
    });
    if (!response.ok) {
      const message = (await response.text()).slice(0, 500);
      console.error("[water-reader-read] worker kick failed", {
        jobId: params.jobId,
        lakeId: params.lakeId,
        seasonContextKey: params.seasonContextKey,
        status: response.status,
        message,
      });
    }
  } catch (error) {
    console.error("[water-reader-read] worker kick request failed", {
      jobId: params.jobId,
      lakeId: params.lakeId,
      seasonContextKey: params.seasonContextKey,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

async function upsertUserHistory(params: {
  supabase: any;
  userId: string;
  lakeId: string;
  seasonContextKey: string;
  status: "preparing" | "ready" | "failed";
  generationJobId?: string | null;
}) {
  const { error } = await params.supabase
    .from("water_reader_user_history")
    .upsert({
      user_id: params.userId,
      lake_id: params.lakeId,
      season_context_key: params.seasonContextKey,
      map_width: WATER_READER_APP_SVG_WIDTH,
      engine_version: WATER_READER_ENGINE_VERSION,
      generation_job_id: params.generationJobId ?? null,
      status: params.status,
      last_viewed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,lake_id,season_context_key,map_width,engine_version",
    });
  if (error) {
    console.error("[water-reader-read] history upsert failed", {
      lakeId: params.lakeId,
      userId: params.userId,
      status: params.status,
      message: error.message,
    });
  }
}

async function recentBuildingReadResponse(params: {
  supabase: any;
  userId: string;
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  seasonContextKey: string;
  fetchMs: number;
  metadataMs: number;
  cacheMs: number;
}): Promise<Response | null> {
  const recentBuildingJob = await findRecentUserBuildingJob({
    supabase: params.supabase,
    userId: params.userId,
  });
  if (!recentBuildingJob) return null;

  const sameRequestedRead =
    recentBuildingJob.lake_id === params.polygon.lakeId &&
    recentBuildingJob.season_context_key === params.seasonContextKey &&
    recentBuildingJob.map_width === WATER_READER_APP_SVG_WIDTH &&
    recentBuildingJob.engine_version === WATER_READER_ENGINE_VERSION;

  if (sameRequestedRead) {
    await upsertUserHistory({
      supabase: params.supabase,
      userId: params.userId,
      lakeId: params.polygon.lakeId,
      seasonContextKey: params.seasonContextKey,
      status: "preparing",
      generationJobId: recentBuildingJob.id,
    });
    if (recentBuildingJob.status === "queued") {
      runInBackground(kickGenerationWorker({
        jobId: recentBuildingJob.id,
        lakeId: params.polygon.lakeId,
        seasonContextKey: params.seasonContextKey,
      }));
    }
    return new Response(
      JSON.stringify(pendingReadResponse({
        polygon: params.polygon,
        currentDate: params.currentDate,
        job: recentBuildingJob,
        fetchMs: params.fetchMs,
        metadataMs: params.metadataMs,
        cacheMs: params.cacheMs,
      })),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  return new Response(
    JSON.stringify(fallbackReadResponse({
      polygon: params.polygon,
      currentDate: params.currentDate,
      fallbackMessage: "Another Water Read is Building. Check Recent Water Reads, then try this lake again shortly.",
      fetchMs: params.fetchMs,
      metadataMs: params.metadataMs,
      cacheMs: params.cacheMs,
      operationalDiagnostics: {
        code: "recent_water_read_building",
        message: "A recent heavy Water Reader generation is already in progress for this user.",
        heavyGenerationStatus: "routed",
      },
    })),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
}

function pendingGenerationReadResponse(params: {
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  job: GenerationJobRow;
  fetchMs: number;
  metadataMs: number;
  cacheMs: number;
}): Response {
  return new Response(
    JSON.stringify(pendingReadResponse(params)),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
}

async function returnPendingGenerationJob(params: {
  supabase: any;
  userId: string;
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  seasonContextKey: string;
  job: GenerationJobRow;
  fetchMs: number;
  metadataMs: number;
  cacheMs: number;
}): Promise<Response> {
  await upsertUserHistory({
    supabase: params.supabase,
    userId: params.userId,
    lakeId: params.polygon.lakeId,
    seasonContextKey: params.seasonContextKey,
    status: params.job.status === "failed" ? "failed" : "preparing",
    generationJobId: params.job.id,
  });
  if (params.job.status === "queued") {
    runInBackground(kickGenerationWorker({
      jobId: params.job.id,
      lakeId: params.polygon.lakeId,
      seasonContextKey: params.seasonContextKey,
    }));
  }
  return pendingGenerationReadResponse({
    polygon: params.polygon,
    currentDate: params.currentDate,
    job: params.job,
    fetchMs: params.fetchMs,
    metadataMs: params.metadataMs,
    cacheMs: params.cacheMs,
  });
}

async function queueGenerationReadResponse(params: {
  supabase: any;
  userId: string;
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  seasonContextKey: string;
  fetchMs: number;
  metadataMs: number;
  cacheMs: number;
}): Promise<Response> {
  let job: GenerationJobRow;
  try {
    const beginRow = await beginGenerationRequest({
      supabase: params.supabase,
      userId: params.userId,
      lakeId: params.polygon.lakeId,
      seasonContextKey: params.seasonContextKey,
    });

    job = generationJobFromBeginRow(beginRow);
    if (!beginRow.allowed && !beginRow.same_request) {
      return new Response(
        JSON.stringify(fallbackReadResponse({
          polygon: params.polygon,
          currentDate: params.currentDate,
          fallbackMessage: "Another Water Read is Building. Check Recent Water Reads, then try this lake again shortly.",
          fetchMs: params.fetchMs,
          metadataMs: params.metadataMs,
          cacheMs: params.cacheMs,
          operationalDiagnostics: {
            code: "recent_water_read_building",
            message: "A recent Water Reader generation is already in progress for this user.",
            heavyGenerationStatus: "routed",
          },
        })),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
      );
    }
  } catch (jobError) {
    console.error("[water-reader-read] guarded generation request begin failed; falling back to legacy queue path", {
      lakeId: params.polygon.lakeId,
      message: jobError instanceof Error ? jobError.message : String(jobError),
    });

    const recentResponse = await recentBuildingReadResponse(params);
    if (recentResponse) return recentResponse;

    try {
      job = await ensureGenerationJob({
        supabase: params.supabase,
        lakeId: params.polygon.lakeId,
        seasonContextKey: params.seasonContextKey,
        userId: params.userId,
      });
      job = await keepGenerationJobRetryable({
        supabase: params.supabase,
        job,
      });
      await upsertUserHistory({
        supabase: params.supabase,
        userId: params.userId,
        lakeId: params.polygon.lakeId,
        seasonContextKey: params.seasonContextKey,
        status: job.status === "failed" ? "failed" : "preparing",
        generationJobId: job.id,
      });
    } catch (legacyJobError) {
      console.error("[water-reader-read] generation job ensure failed", {
        lakeId: params.polygon.lakeId,
        message: legacyJobError instanceof Error ? legacyJobError.message : String(legacyJobError),
      });
      return jsonError("Failed to start Water Reader map generation", "water_reader_generation_queue_failed", 500);
    }
  }

  if (job.status === "queued") {
    runInBackground(kickGenerationWorker({
      jobId: job.id,
      lakeId: params.polygon.lakeId,
      seasonContextKey: params.seasonContextKey,
    }));
  }
  return new Response(
    JSON.stringify(pendingReadResponse({
      polygon: params.polygon,
      currentDate: params.currentDate,
      job,
      fetchMs: params.fetchMs,
      metadataMs: params.metadataMs,
      cacheMs: params.cacheMs,
    })),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
}

async function routedCacheMissReadResponse(params: {
  supabase: any;
  userId: string;
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  seasonContextKey: string;
  metadataMs: number;
  cacheMs: number;
}): Promise<Response> {
  let job: GenerationJobRow;
  try {
    const beginRow = await beginGenerationRequest({
      supabase: params.supabase,
      userId: params.userId,
      lakeId: params.polygon.lakeId,
      seasonContextKey: params.seasonContextKey,
    });
    job = generationJobFromBeginRow(beginRow);

    if (!beginRow.allowed) {
      if (beginRow.same_request) {
        return await returnPendingGenerationJob({
          supabase: params.supabase,
          userId: params.userId,
          polygon: params.polygon,
          currentDate: params.currentDate,
          seasonContextKey: params.seasonContextKey,
          job,
          fetchMs: 0,
          metadataMs: params.metadataMs,
          cacheMs: params.cacheMs,
        });
      }

      return new Response(
        JSON.stringify(fallbackReadResponse({
          polygon: params.polygon,
          currentDate: params.currentDate,
          fallbackMessage: "Another Water Read is Building. Check Recent Water Reads, then try this lake again shortly.",
          fetchMs: 0,
          metadataMs: params.metadataMs,
          cacheMs: params.cacheMs,
          operationalDiagnostics: {
            code: "recent_water_read_building",
            message: "A recent Water Reader generation is already in progress for this user.",
            heavyGenerationStatus: "routed",
          },
        })),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
      );
    }
  } catch (jobError) {
    console.error("[water-reader-read] routed cache miss job begin failed; using queue fallback", {
      lakeId: params.polygon.lakeId,
      seasonContextKey: params.seasonContextKey,
      message: jobError instanceof Error ? jobError.message : String(jobError),
    });
    return await queueGenerationReadResponse({
      supabase: params.supabase,
      userId: params.userId,
      polygon: params.polygon,
      currentDate: params.currentDate,
      seasonContextKey: params.seasonContextKey,
      fetchMs: 0,
      metadataMs: params.metadataMs,
      cacheMs: params.cacheMs,
    });
  }

  if (job.status === "processing" || (job.requested_by && job.requested_by !== params.userId)) {
    return await returnPendingGenerationJob({
      supabase: params.supabase,
      userId: params.userId,
      polygon: params.polygon,
      currentDate: params.currentDate,
      seasonContextKey: params.seasonContextKey,
      job,
      fetchMs: 0,
      metadataMs: params.metadataMs,
      cacheMs: params.cacheMs,
    });
  }

  if (allowDirectHeavyGeneration()) {
    const result = await requestHeavyGenerator({
      lakeId: params.polygon.lakeId,
      currentDate: params.currentDate,
      seasonContextKey: params.seasonContextKey,
      heavy: {
        heavy: true,
        reason: "worker_routed_cache_miss",
        runtimeGeoJsonBytes: null,
        edgeComplexityScore: 0,
      },
    });

    if (result.read) {
      if (result.read.cacheWriteStatus !== "failed") {
        await markGenerationJobComplete({ supabase: params.supabase, jobId: job.id });
        await upsertUserHistory({
          supabase: params.supabase,
          userId: params.userId,
          lakeId: params.polygon.lakeId,
          seasonContextKey: params.seasonContextKey,
          status: "ready",
          generationJobId: null,
        });
      }
      return new Response(
        JSON.stringify(result.read),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
      );
    }
  }

  return await returnPendingGenerationJob({
    supabase: params.supabase,
    userId: params.userId,
    polygon: params.polygon,
    currentDate: params.currentDate,
    seasonContextKey: params.seasonContextKey,
    job,
    fetchMs: 0,
    metadataMs: params.metadataMs,
    cacheMs: params.cacheMs,
  });
}

async function requestHeavyGenerator(params: {
  lakeId: string;
  currentDate: Date;
  seasonContextKey: string;
  heavy: HeavyRouteInfo;
}): Promise<{ read: WaterReaderReadResponse | null; diagnostics: WaterReaderReadOperationalDiagnostics }> {
  const url = Deno.env.get("WATER_READER_HEAVY_GENERATOR_URL");
  const internalKey = Deno.env.get("WATER_READER_INTERNAL_KEY");
  if (!url || !internalKey) {
    return {
      read: null,
      diagnostics: {
        code: "heavy_generator_not_configured",
        message: "Heavy Water Reader generation worker is not configured.",
        heavyGenerationStatus: "not_configured",
        heavyGenerationReason: params.heavy.reason,
        runtimeGeoJsonBytes: params.heavy.runtimeGeoJsonBytes,
        edgeComplexityScore: params.heavy.edgeComplexityScore,
      },
    };
  }

  const timeoutMsRaw = Number(Deno.env.get("WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS") ?? 20000);
  const timeoutMs = Number.isFinite(timeoutMsRaw) ? Math.max(1000, Math.min(60000, Math.floor(timeoutMsRaw))) : 20000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const endpoint = `${url.replace(/\/$/, "")}/water-reader/generate`;
  const started = Date.now();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-water-reader-internal-key": internalKey,
      },
      body: JSON.stringify({
        lakeId: params.lakeId,
        currentDate: params.currentDate.toISOString(),
        seasonContextKey: params.seasonContextKey,
        mapWidth: WATER_READER_APP_SVG_WIDTH,
        engineVersion: WATER_READER_ENGINE_VERSION,
        skipInitialCacheLookup: params.heavy.reason === "worker_routed_cache_miss",
      }),
      signal: controller.signal,
    });
    const elapsedMs = Date.now() - started;
    const text = await response.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { nonJsonBody: text.slice(0, 500) };
    }
    if (response.ok && json?.feature === WATER_READER_READ_FEATURE && json?.lakeId === params.lakeId) {
      return {
        read: {
          ...json,
          generationStatus: "ready",
          generationJobId: null,
          retryAfterMs: null,
          operationalDiagnostics: {
            code: "heavy_generator_routed",
            message: "Heavy Water Reader generation completed by worker.",
            heavyGenerationStatus: "routed",
            heavyGenerationReason: params.heavy.reason,
            workerHttpStatus: response.status,
            workerElapsedMs: elapsedMs,
            runtimeGeoJsonBytes: params.heavy.runtimeGeoJsonBytes,
            edgeComplexityScore: params.heavy.edgeComplexityScore,
            originalVertexCount: json.originalVertexCount ?? null,
            runtimeVertexCount: json.runtimeVertexCount ?? null,
          },
        },
        diagnostics: {
          code: "heavy_generator_routed",
          message: "Heavy Water Reader generation completed by worker.",
          heavyGenerationStatus: "routed",
          heavyGenerationReason: params.heavy.reason,
          workerHttpStatus: response.status,
          workerElapsedMs: elapsedMs,
          runtimeGeoJsonBytes: params.heavy.runtimeGeoJsonBytes,
          edgeComplexityScore: params.heavy.edgeComplexityScore,
          originalVertexCount: json.originalVertexCount ?? null,
          runtimeVertexCount: json.runtimeVertexCount ?? null,
        },
      };
    }
    return {
      read: null,
      diagnostics: {
        code: "heavy_generator_failed",
        message: json?.message ?? "Heavy Water Reader generation worker failed.",
        heavyGenerationStatus: "failed",
        heavyGenerationReason: params.heavy.reason,
        workerHttpStatus: response.status,
        workerElapsedMs: elapsedMs,
        runtimeGeoJsonBytes: params.heavy.runtimeGeoJsonBytes,
        edgeComplexityScore: params.heavy.edgeComplexityScore,
      },
    };
  } catch (error) {
    const elapsedMs = Date.now() - started;
    const timedOut = error instanceof DOMException && error.name === "AbortError";
    return {
      read: null,
      diagnostics: {
        code: timedOut ? "heavy_generator_timeout" : "heavy_generator_request_failed",
        message: timedOut ? "Heavy Water Reader generation worker timed out." : "Heavy Water Reader generation worker request failed.",
        heavyGenerationStatus: timedOut ? "timeout" : "failed",
        heavyGenerationReason: params.heavy.reason,
        workerHttpStatus: null,
        workerElapsedMs: elapsedMs,
        runtimeGeoJsonBytes: params.heavy.runtimeGeoJsonBytes,
        edgeComplexityScore: params.heavy.edgeComplexityScore,
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

function cacheQaFlags(read: WaterReaderReadResponse): string[] {
  return [
    ...read.polygonQaFlags,
    read.fallbackMessage ? "fallback_no_map" : null,
    read.displayedEntryCount === 0 ? "zero_displayed_entries" : null,
    read.rendererWarningCount > 0 ? "renderer_warnings" : null,
    read.retainedEntryCount > 0 ? "retained_entries" : null,
  ].filter(Boolean) as string[];
}

async function upsertGeneratedRead(params: {
  supabase: any;
  read: WaterReaderReadResponse;
  seasonContextKey: string;
}): Promise<CacheWriteResult> {
  const { error } = await params.supabase
    .from("water_reader_engine_read_cache")
    .upsert({
      lake_id: params.read.lakeId,
      season_context_key: params.seasonContextKey,
      map_width: WATER_READER_APP_SVG_WIDTH,
      engine_version: WATER_READER_ENGINE_VERSION,
      read_response: params.read,
      timings: params.read.timings ?? null,
      qa_flags: cacheQaFlags(params.read),
    }, {
      onConflict: "lake_id,season_context_key,map_width,engine_version",
    });
  if (!error) return { cacheWriteStatus: "stored", cacheWriteError: null };
  console.error("[water-reader-read] cache write failed after generation", {
    lakeId: params.read.lakeId,
    seasonContextKey: params.seasonContextKey,
    message: error.message,
  });
  return {
    cacheWriteStatus: "failed",
    cacheWriteError: "Generated read returned without caching.",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", "method_not_allowed", 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ?? (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return jsonError("Missing authentication token", "unauthorized", 401);
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return jsonError("Unauthorized", "unauthorized", 401);
  }

  const rateLimit = await checkUserRateLimit(supabase, {
    userId: user.id,
    feature: "water_reader_read",
    rules: WATER_READER_READ_RATE_LIMITS,
  });
  if (!rateLimit.allowed) {
    return rateLimitExceededResponse(rateLimit, corsHeaders());
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(FREE_TRIAL_PROFILE_SELECT)
    .eq("id", user.id)
    .single<FreeTrialProfileRow>();
  const tier = resolveServerSubscriptionTier(
    profile?.subscription_tier,
    user.email,
  );

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", "invalid_body", 400);
  }

  const lakeIdRaw = typeof body.lakeId === "string" ? body.lakeId.trim() : "";
  if (!lakeIdRaw || !UUID_RE.test(lakeIdRaw)) {
    return jsonError("lakeId must be a valid UUID", "invalid_lake_id", 400);
  }

  if (tier === "free") {
    const allowed = await isFreeTierWaterReadAllowed(
      supabase,
      user.id,
      lakeIdRaw,
      profile,
    );
    if (!allowed) {
      return jsonError("Subscribe to use this feature", "subscription_required", 403);
    }
  }

  const currentDate = parseCurrentDate(body.currentDate);
  if (currentDate instanceof Response) return currentDate;
  const diagnosticMode = body.diagnosticMode === "runtime_payload_only" ? "runtime_payload_only" : null;
  if (diagnosticMode && !internalKeyValid(req)) {
    return jsonError("Forbidden", "forbidden", 403);
  }

  const metadataStarted = Date.now();
  const { data: metadata, error: metadataError } = await supabase
    .from("waterbody_index")
    .select("id, canonical_name, state_code, county_name, waterbody_type, surface_area_acres, centroid")
    .eq("id", lakeIdRaw)
    .maybeSingle<WaterbodyMetadataRow>();
  const metadataMs = Date.now() - metadataStarted;

  if (metadataError) {
    console.error("[water-reader-read] metadata lookup failed", {
      lakeId: lakeIdRaw,
      message: metadataError.message,
    });
    return jsonError("Failed to load waterbody metadata", "metadata_lookup_failed", 500);
  }

  if (!metadata) {
    return new Response(
      JSON.stringify({
        feature: WATER_READER_READ_FEATURE,
        lakeId: lakeIdRaw,
        error: "not_found",
        message: "No waterbody found for this id.",
      }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  // Full read/SVG cache stays season-context keyed because the legend/read copy varies by season.
  // The production feature-envelope geometry is season-invariant.
  const seasonContext = buildWaterReaderSeasonContext(metadata.state_code ?? "", currentDate);

  let cacheMs = 0;
  if (!diagnosticMode) {
    const cacheStarted = Date.now();
    const { data: cacheRow, error: cacheError } = await supabase
      .from("water_reader_engine_read_cache")
      .select("read_response, generated_at, timings, qa_flags")
      .eq("lake_id", lakeIdRaw)
      .eq("season_context_key", seasonContext.seasonContextKey)
      .eq("map_width", WATER_READER_APP_SVG_WIDTH)
      .eq("engine_version", WATER_READER_ENGINE_VERSION)
      .maybeSingle<CacheRow>();
    cacheMs = Date.now() - cacheStarted;

    if (cacheError) {
      console.error("[water-reader-read] cache lookup failed", cacheError);
      return jsonError("Failed to load cached Water Reader map", "water_reader_cache_lookup_failed", 500);
    }

    if (cacheRow?.read_response) {
      await markFreeWaterReadTrialUsedIfNeeded(supabase, user.id, profile, tier);
      await Promise.all([
        clearActiveGenerationRequest({
          supabase,
          userId: user.id,
          lakeId: lakeIdRaw,
          seasonContextKey: seasonContext.seasonContextKey,
        }),
        upsertUserHistory({
          supabase,
          userId: user.id,
          lakeId: lakeIdRaw,
          seasonContextKey: seasonContext.seasonContextKey,
          status: "ready",
          generationJobId: null,
        }),
      ]);
      return new Response(
        JSON.stringify({
          ...cacheRow.read_response,
          generationStatus: "ready",
          generationJobId: null,
          retryAfterMs: null,
          cacheStatus: "hit",
          seasonContextKey: seasonContext.seasonContextKey,
          mapWidth: WATER_READER_APP_SVG_WIDTH,
          engineVersion: WATER_READER_ENGINE_VERSION,
          timings: {
            ...(cacheRow.read_response.timings ?? {}),
            fetchMs: 0,
            metadataMs,
            cacheMs,
            totalMs: metadataMs + cacheMs,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
      );
    }
  }

  if (!diagnosticMode && routeAllCacheMissesThroughHeavyWorker()) {
    return await routedCacheMissReadResponse({
      supabase,
      userId: user.id,
      polygon: metadataPendingPolygon(metadata),
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      metadataMs,
      cacheMs,
    });
  }

  let durableJob: GenerationJobRow | null = null;
  if (!diagnosticMode) {
    const pendingPolygon = metadataPendingPolygon(metadata);
    try {
      const beginRow = await beginGenerationRequest({
        supabase,
        userId: user.id,
        lakeId: lakeIdRaw,
        seasonContextKey: seasonContext.seasonContextKey,
      });
      durableJob = generationJobFromBeginRow(beginRow);
      if (!beginRow.allowed) {
        if (beginRow.same_request) {
          if (durableJob.status === "queued") {
            runInBackground(kickGenerationWorker({
              jobId: durableJob.id,
              lakeId: pendingPolygon.lakeId,
              seasonContextKey: seasonContext.seasonContextKey,
            }));
          }
          return new Response(
            JSON.stringify(pendingReadResponse({
              polygon: pendingPolygon,
              currentDate,
              job: durableJob,
              fetchMs: 0,
              metadataMs,
              cacheMs,
            })),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
          );
        }

        return new Response(
          JSON.stringify(fallbackReadResponse({
            polygon: pendingPolygon,
            currentDate,
            fallbackMessage: "Another Water Read is Building. Check Recent Water Reads, then try this lake again shortly.",
            fetchMs: 0,
            metadataMs,
            cacheMs,
            operationalDiagnostics: {
              code: "recent_water_read_building",
              message: "A recent Water Reader generation is already in progress for this user.",
              heavyGenerationStatus: "routed",
            },
          })),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
        );
      }
    } catch (jobError) {
      console.error("[water-reader-read] durable generation request begin failed; falling back to legacy guard", {
        lakeId: lakeIdRaw,
        seasonContextKey: seasonContext.seasonContextKey,
        message: jobError instanceof Error ? jobError.message : String(jobError),
      });

      const recentResponse = await recentBuildingReadResponse({
        supabase,
        userId: user.id,
        polygon: pendingPolygon,
        currentDate,
        seasonContextKey: seasonContext.seasonContextKey,
        fetchMs: 0,
        metadataMs,
        cacheMs,
      });
      if (recentResponse) return recentResponse;

      try {
        durableJob = await ensureGenerationJob({
          supabase,
          lakeId: lakeIdRaw,
          seasonContextKey: seasonContext.seasonContextKey,
          userId: user.id,
        });
        durableJob = await keepGenerationJobRetryable({
          supabase,
          job: durableJob,
        });
      } catch (legacyJobError) {
        console.error("[water-reader-read] legacy durable generation job ensure failed; continuing inline", {
          lakeId: lakeIdRaw,
          seasonContextKey: seasonContext.seasonContextKey,
          message: legacyJobError instanceof Error ? legacyJobError.message : String(legacyJobError),
        });
      }

      await upsertUserHistory({
        supabase,
        userId: user.id,
        lakeId: lakeIdRaw,
        seasonContextKey: seasonContext.seasonContextKey,
        status: "preparing",
        generationJobId: durableJob?.id ?? null,
      });
    }

    if (durableJob?.status === "processing" || (durableJob?.requested_by && durableJob.requested_by !== user.id)) {
      return await returnPendingGenerationJob({
        supabase,
        userId: user.id,
        polygon: pendingPolygon,
        currentDate,
        seasonContextKey: seasonContext.seasonContextKey,
        job: durableJob,
        fetchMs: 0,
        metadataMs,
        cacheMs,
      });
    }
  }

  const fetchStarted = Date.now();
  const polygonFetchPromise = Promise.resolve(supabase.rpc("get_waterbody_polygon_runtime_for_reader", {
    in_lake_id: lakeIdRaw,
  }));
  const polygonFetch = await settleWithTimeout(polygonFetchPromise, edgePolygonFetchTimeoutMs());
  const fetchMs = Date.now() - fetchStarted;

  if (polygonFetch.timedOut) {
    runInBackground(polygonFetchPromise.catch((error: unknown) => {
      console.error("[water-reader-read] timed-out polygon rpc later rejected", {
        lakeId: lakeIdRaw,
        message: error instanceof Error ? error.message : String(error),
      });
    }));
    if (!diagnosticMode && durableJob?.requested_by === user.id && allowDirectHeavyGeneration()) {
      const result = await requestHeavyGenerator({
        lakeId: lakeIdRaw,
        currentDate,
        seasonContextKey: seasonContext.seasonContextKey,
        heavy: {
          heavy: true,
          reason: "edge_polygon_fetch_timeout",
          runtimeGeoJsonBytes: null,
          edgeComplexityScore: 0,
        },
      });
      if (result.read) {
        if (result.read.cacheWriteStatus !== "failed") {
          await markGenerationJobComplete({ supabase, jobId: durableJob.id });
          await upsertUserHistory({
            supabase,
            userId: user.id,
            lakeId: lakeIdRaw,
            seasonContextKey: seasonContext.seasonContextKey,
            status: "ready",
            generationJobId: null,
          });
        }
        return new Response(
          JSON.stringify(result.read),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
        );
      }
    }
    return await queueGenerationReadResponse({
      supabase,
      userId: user.id,
      polygon: metadataPendingPolygon(metadata),
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      fetchMs,
      metadataMs,
      cacheMs,
    });
  }

  const { data, error } = polygonFetch.value as { data: unknown; error: { message?: string } | null };

  if (error) {
    console.error("[water-reader-read] polygon rpc failed", error);
    if (!diagnosticMode && durableJob?.requested_by === user.id && allowDirectHeavyGeneration()) {
      const result = await requestHeavyGenerator({
        lakeId: lakeIdRaw,
        currentDate,
        seasonContextKey: seasonContext.seasonContextKey,
        heavy: {
          heavy: true,
          reason: "edge_polygon_rpc_failed",
          runtimeGeoJsonBytes: null,
          edgeComplexityScore: 0,
        },
      });
      if (result.read) {
        if (result.read.cacheWriteStatus !== "failed") {
          await markGenerationJobComplete({ supabase, jobId: durableJob.id });
          await upsertUserHistory({
            supabase,
            userId: user.id,
            lakeId: lakeIdRaw,
            seasonContextKey: seasonContext.seasonContextKey,
            status: "ready",
            generationJobId: null,
          });
        }
        return new Response(
          JSON.stringify(result.read),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
        );
      }
    }
    return await queueGenerationReadResponse({
      supabase,
      userId: user.id,
      polygon: metadataPendingPolygon(metadata),
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      fetchMs,
      metadataMs,
      cacheMs,
    });
  }

  const rows = Array.isArray(data) ? data as PolygonRpcRow[] : [];
  if (rows.length === 0) {
    await cancelGenerationJob({
      supabase,
      jobId: durableJob?.id ?? null,
      reason: "No runtime polygon row was available for this waterbody.",
    });
    return new Response(
      JSON.stringify({
        feature: WATER_READER_READ_FEATURE,
        lakeId: lakeIdRaw,
        error: "not_found",
        message: "No waterbody found for this id.",
      }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const polygon = mapPolygonRow(rows[0]!);

  if (diagnosticMode === "runtime_payload_only") {
    return new Response(
      JSON.stringify({
        feature: WATER_READER_READ_FEATURE,
        diagnosticMode,
        lakeId: polygon.lakeId,
        name: polygon.name,
        state: polygon.state,
        waterReaderSupportStatus: polygon.waterReaderSupportStatus,
        waterReaderSupportReason: polygon.waterReaderSupportReason,
        polygonQaFlags: polygon.polygonQaFlags,
        hasRuntimeGeoJson: Boolean(polygon.geojson),
        runtimeGeoJsonBytes: polygon.geojson ? JSON.stringify(polygon.geojson).length : 0,
        originalVertexCount: polygon.originalVertexCount,
        runtimeVertexCount: polygon.runtimeVertexCount,
        runtimeComponentCount: polygon.runtimeComponentCount,
        runtimeInteriorRingCount: polygon.runtimeInteriorRingCount,
        runtimeSimplified: polygon.runtimeSimplified,
        runtimeSimplificationTolerance: polygon.runtimeSimplificationTolerance,
        seasonContextKey: seasonContext.seasonContextKey,
        timings: { fetchMs, metadataMs, totalMs: metadataMs + fetchMs },
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  if (!polygon.geojson) {
    await cancelGenerationJob({
      supabase,
      jobId: durableJob?.id ?? null,
      reason: "This waterbody does not have polygon geometry available for a Water Reader map yet.",
    });
    await upsertUserHistory({
      supabase,
      userId: user.id,
      lakeId: polygon.lakeId,
      seasonContextKey: seasonContext.seasonContextKey,
      status: "failed",
      generationJobId: null,
    });
    return new Response(
      JSON.stringify(fallbackReadResponse({
        polygon,
        currentDate,
        fallbackMessage: "This waterbody does not have polygon geometry available for a Water Reader map yet.",
        fetchMs,
        metadataMs,
        cacheMs,
      })),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  if (!polygon.geometryIsValid) {
    await cancelGenerationJob({
      supabase,
      jobId: durableJob?.id ?? null,
      reason: "This polygon needs geometry cleanup before Water Reader can draw a trustworthy structure map.",
    });
    await upsertUserHistory({
      supabase,
      userId: user.id,
      lakeId: polygon.lakeId,
      seasonContextKey: seasonContext.seasonContextKey,
      status: "failed",
      generationJobId: null,
    });
    return new Response(
      JSON.stringify(fallbackReadResponse({
        polygon,
        currentDate,
        fallbackMessage: "This polygon needs geometry cleanup before Water Reader can draw a trustworthy structure map.",
        fetchMs,
        metadataMs,
        cacheMs,
      })),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  if (polygon.waterReaderSupportStatus === "not_supported") {
    await cancelGenerationJob({
      supabase,
      jobId: durableJob?.id ?? null,
      reason: polygon.waterReaderSupportReason || "This polygon is not supported for a Water Reader map yet.",
    });
    await upsertUserHistory({
      supabase,
      userId: user.id,
      lakeId: polygon.lakeId,
      seasonContextKey: seasonContext.seasonContextKey,
      status: "failed",
      generationJobId: null,
    });
    return new Response(
      JSON.stringify(fallbackReadResponse({
        polygon,
        currentDate,
        fallbackMessage: polygon.waterReaderSupportReason || "This polygon is not supported for a Water Reader map yet.",
        fetchMs,
        metadataMs,
        cacheMs,
      })),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const heavy = heavyRouteInfo(polygon);
  const routeViaHeavyWorker = routeAllCacheMissesThroughHeavyWorker() ||
    (heavy.heavy && heavyGeneratorConfigured());
  if (routeViaHeavyWorker && allowDirectHeavyGeneration()) {
    const routedHeavy = workerRouteInfo(heavy);
    const result = await requestHeavyGenerator({
      lakeId: polygon.lakeId,
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      heavy: routedHeavy,
    });
    if (result.read) {
      if (result.read.cacheWriteStatus !== "failed") {
        await markGenerationJobComplete({ supabase, jobId: durableJob?.id ?? null });
        await upsertUserHistory({
          supabase,
          userId: user.id,
          lakeId: polygon.lakeId,
          seasonContextKey: seasonContext.seasonContextKey,
          status: "ready",
          generationJobId: null,
        });
      }
      await markFreeWaterReadTrialUsedIfNeeded(supabase, user.id, profile, tier);
      return new Response(
        JSON.stringify(result.read),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
      );
    }
    if (allowEdgeHeavyLocalFallback()) {
      try {
        const generatedRead = buildServerWaterReaderRead({
          polygonPayload: polygon,
          currentDate,
          fetchMs,
        });
        const cacheWrite = await upsertGeneratedRead({
          supabase,
          read: generatedRead,
          seasonContextKey: seasonContext.seasonContextKey,
        });
        if (cacheWrite.cacheWriteStatus === "stored") {
          await markGenerationJobComplete({ supabase, jobId: durableJob?.id ?? null });
          await upsertUserHistory({
            supabase,
            userId: user.id,
            lakeId: polygon.lakeId,
            seasonContextKey: seasonContext.seasonContextKey,
            status: "ready",
            generationJobId: null,
          });
        } else if (durableJob?.status === "queued") {
          runInBackground(kickGenerationWorker({
            jobId: durableJob.id,
            lakeId: polygon.lakeId,
            seasonContextKey: seasonContext.seasonContextKey,
          }));
        }
        await markFreeWaterReadTrialUsedIfNeeded(supabase, user.id, profile, tier);
        return new Response(
          JSON.stringify({
            ...generatedRead,
            generationStatus: "ready",
            generationJobId: null,
            retryAfterMs: null,
            cacheStatus: "miss",
            ...cacheWrite,
            operationalDiagnostics: {
              ...result.diagnostics,
              localFallbackStatus: generatedRead.fallbackMessage ? "fallback_no_map" : "generated",
            },
            seasonContextKey: seasonContext.seasonContextKey,
            mapWidth: WATER_READER_APP_SVG_WIDTH,
            engineVersion: WATER_READER_ENGINE_VERSION,
            timings: {
              ...(generatedRead.timings ?? {}),
              metadataMs,
              cacheMs,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
        );
      } catch (localError) {
        console.error("[water-reader-read] local heavy fallback failed", {
          lakeId: polygon.lakeId,
          heavyReason: routedHeavy.reason,
          message: localError instanceof Error ? localError.message : String(localError),
        });
      }
    }
    console.error("[water-reader-read] heavy generator unavailable for routed read", {
      lakeId: polygon.lakeId,
      heavyReason: routedHeavy.reason,
      diagnostics: result.diagnostics,
    });
    return await queueGenerationReadResponse({
      supabase,
      userId: user.id,
      polygon,
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      fetchMs,
      metadataMs,
      cacheMs,
    });
  }

  if (routeViaHeavyWorker) {
    return await queueGenerationReadResponse({
      supabase,
      userId: user.id,
      polygon,
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      fetchMs,
      metadataMs,
      cacheMs,
    });
  }

  let generatedRead: WaterReaderReadResponse;
  try {
    generatedRead = buildServerWaterReaderRead({
      polygonPayload: polygon,
      currentDate,
      fetchMs,
    });
  } catch (error) {
    console.error("[water-reader-read] inline generation failed; queueing worker job", {
      lakeId: polygon.lakeId,
      seasonContextKey: seasonContext.seasonContextKey,
      message: error instanceof Error ? error.message : String(error),
      originalVertexCount: polygon.originalVertexCount ?? null,
      runtimeVertexCount: polygon.runtimeVertexCount ?? null,
      runtimeComponentCount: polygon.runtimeComponentCount ?? null,
      runtimeInteriorRingCount: polygon.runtimeInteriorRingCount ?? null,
    });
    return await queueGenerationReadResponse({
      supabase,
      userId: user.id,
      polygon,
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      fetchMs,
      metadataMs,
      cacheMs,
    });
  }
  const cacheWrite = await upsertGeneratedRead({
    supabase,
    read: generatedRead,
    seasonContextKey: seasonContext.seasonContextKey,
  });

  if (cacheWrite.cacheWriteStatus === "stored") {
    await markGenerationJobComplete({ supabase, jobId: durableJob?.id ?? null });
    await upsertUserHistory({
      supabase,
      userId: user.id,
      lakeId: polygon.lakeId,
      seasonContextKey: seasonContext.seasonContextKey,
      status: "ready",
      generationJobId: null,
    });
  } else if (durableJob?.status === "queued") {
    runInBackground(kickGenerationWorker({
      jobId: durableJob.id,
      lakeId: polygon.lakeId,
      seasonContextKey: seasonContext.seasonContextKey,
    }));
  }

  await markFreeWaterReadTrialUsedIfNeeded(supabase, user.id, profile, tier);

  return new Response(
    JSON.stringify({
      ...generatedRead,
      generationStatus: "ready",
      generationJobId: null,
      retryAfterMs: null,
      cacheStatus: "miss",
      ...cacheWrite,
      seasonContextKey: seasonContext.seasonContextKey,
      mapWidth: WATER_READER_APP_SVG_WIDTH,
      engineVersion: WATER_READER_ENGINE_VERSION,
      timings: {
        ...(generatedRead.timings ?? {}),
        metadataMs,
        cacheMs,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
