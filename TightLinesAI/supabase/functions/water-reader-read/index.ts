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
}

type CacheWriteResult = Pick<WaterReaderReadResponse, "cacheWriteStatus" | "cacheWriteError">;

interface HeavyRouteInfo {
  heavy: boolean;
  reason: string | null;
  runtimeGeoJsonBytes: number | null;
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
  const interiorRingCount = polygon.runtimeInteriorRingCount ?? polygon.interiorRingCount ?? 0;
  const qaFlags = polygon.polygonQaFlags ?? [];
  const reasons = [
    originalVertexCount >= 25000 ? `original_vertex_count:${originalVertexCount}` : null,
    runtimeVertexCount >= 8000 ? `runtime_vertex_count:${runtimeVertexCount}` : null,
    bytes != null && bytes >= 200000 ? `runtime_geojson_bytes:${bytes}` : null,
    interiorRingCount >= 25 ? `interior_ring_count:${interiorRingCount}` : null,
    qaFlags.includes("high_vertex_count") ? "qa_flag:high_vertex_count" : null,
  ].filter(Boolean) as string[];
  return {
    heavy: reasons.length > 0,
    reason: reasons.join(",") || null,
    runtimeGeoJsonBytes: bytes,
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
      },
    };
  }

  const timeoutMsRaw = Number(Deno.env.get("WATER_READER_HEAVY_GENERATOR_TIMEOUT_MS") ?? 25000);
  const timeoutMs = Number.isFinite(timeoutMsRaw) ? Math.max(1000, Math.min(60000, Math.floor(timeoutMsRaw))) : 25000;
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
          operationalDiagnostics: {
            code: "heavy_generator_routed",
            message: "Heavy Water Reader generation completed by worker.",
            heavyGenerationStatus: "routed",
            heavyGenerationReason: params.heavy.reason,
            workerHttpStatus: response.status,
            workerElapsedMs: elapsedMs,
            runtimeGeoJsonBytes: params.heavy.runtimeGeoJsonBytes,
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: string | null }>();
  const tier = profile?.subscription_tier ?? "free";
  if (tier === "free") {
    return jsonError("Subscribe to use this feature", "subscription_required", 403);
  }

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

  const currentDate = parseCurrentDate(body.currentDate);
  if (currentDate instanceof Response) return currentDate;
  const diagnosticMode = body.diagnosticMode === "runtime_payload_only" ? "runtime_payload_only" : null;
  if (diagnosticMode && !internalKeyValid(req)) {
    return jsonError("Forbidden", "forbidden", 403);
  }

  const metadataStarted = Date.now();
  const { data: metadata, error: metadataError } = await supabase
    .from("waterbody_index")
    .select("id, canonical_name, state_code")
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
      return new Response(
        JSON.stringify({
          ...cacheRow.read_response,
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

  const fetchStarted = Date.now();
  const { data, error } = await supabase.rpc("get_waterbody_polygon_runtime_for_reader", {
    in_lake_id: lakeIdRaw,
  });
  const fetchMs = Date.now() - fetchStarted;

  if (error) {
    console.error("[water-reader-read] polygon rpc failed", error);
    return jsonError("Failed to load waterbody polygon", "polygon_fetch_failed", 500);
  }

  const rows = Array.isArray(data) ? data as PolygonRpcRow[] : [];
  if (rows.length === 0) {
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
  if (heavy.heavy) {
    const result = await requestHeavyGenerator({
      lakeId: polygon.lakeId,
      currentDate,
      seasonContextKey: seasonContext.seasonContextKey,
      heavy,
    });
    if (result.read) {
      return new Response(
        JSON.stringify(result.read),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
      );
    }
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
      return new Response(
        JSON.stringify({
          ...generatedRead,
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
        heavyReason: heavy.reason,
        message: localError instanceof Error ? localError.message : String(localError),
      });
    }
    return new Response(
      JSON.stringify(fallbackReadResponse({
        polygon,
        currentDate,
        fallbackMessage: "This Water Reader map needs the heavy generation worker. Try again shortly.",
        fetchMs,
        metadataMs,
        cacheMs,
        operationalDiagnostics: result.diagnostics,
      })),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

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

  return new Response(
    JSON.stringify({
      ...generatedRead,
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
