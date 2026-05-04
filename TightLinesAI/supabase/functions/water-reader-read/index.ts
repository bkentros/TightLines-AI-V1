import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATER_READER_APP_SVG_WIDTH,
  WATER_READER_ENGINE_VERSION,
  WATER_READER_READ_FEATURE,
  type WaterbodyPolygonForWaterReaderRead,
  type WaterReaderReadResponse,
} from "../_shared/waterReaderRead/contracts.ts";
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
}

interface CacheRow {
  read_response: WaterReaderReadResponse;
  generated_at: string;
  timings: Record<string, unknown> | null;
  qa_flags: string[] | null;
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
  };
}

function fallbackReadResponse(params: {
  polygon: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  fallbackMessage: string;
  fetchMs: number;
  cacheMs: number;
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
    timings: {
      fetchMs: params.fetchMs,
      preprocessMs: 0,
      featuresMs: 0,
      zonesMs: 0,
      legendMs: 0,
      displayMs: 0,
      renderMs: 0,
      totalMs: params.fetchMs + params.cacheMs,
    },
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

  const fetchStarted = Date.now();
  const { data, error } = await supabase.rpc("get_waterbody_polygon_for_reader", {
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
  const seasonContext = buildWaterReaderSeasonContext(polygon.state, currentDate);

  if (!polygon.geojson) {
    return new Response(
      JSON.stringify(fallbackReadResponse({
        polygon,
        currentDate,
        fallbackMessage: "This waterbody does not have polygon geometry available for a Water Reader map yet.",
        fetchMs,
        cacheMs: 0,
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
        cacheMs: 0,
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
        cacheMs: 0,
      })),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const cacheStarted = Date.now();
  const { data: cacheRow, error: cacheError } = await supabase
    .from("water_reader_engine_read_cache")
    .select("read_response, generated_at, timings, qa_flags")
    .eq("lake_id", polygon.lakeId)
    .eq("season_context_key", seasonContext.seasonContextKey)
    .eq("map_width", WATER_READER_APP_SVG_WIDTH)
    .eq("engine_version", WATER_READER_ENGINE_VERSION)
    .maybeSingle<CacheRow>();
  const cacheMs = Date.now() - cacheStarted;

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
          fetchMs,
          cacheMs,
          totalMs: fetchMs + cacheMs,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  return new Response(
    JSON.stringify(fallbackReadResponse({
      polygon,
      currentDate,
      fallbackMessage: "This Water Reader map is still being prepared.",
      fetchMs,
      cacheMs,
    })),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
