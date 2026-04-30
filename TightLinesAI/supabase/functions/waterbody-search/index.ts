import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATERBODY_SEARCH_FEATURE,
  type WaterbodySearchResult,
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

interface SearchRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: WaterbodySearchResult["waterbodyType"];
  surface_area_acres: number | null;
  centroid_lat: number;
  centroid_lon: number;
  preview_bbox_min_lon: number | null;
  preview_bbox_min_lat: number | null;
  preview_bbox_max_lon: number | null;
  preview_bbox_max_lat: number | null;
  data_tier: WaterbodySearchResult["dataTier"];
  aerial_available: boolean;
  depth_available: boolean;
  depth_usability_status: WaterbodySearchResult["depthUsabilityStatus"];
  availability: WaterbodySearchResult["availability"];
  source_status: WaterbodySearchResult["sourceStatus"];
  best_available_mode: WaterbodySearchResult["bestAvailableMode"];
  confidence: WaterbodySearchResult["confidence"];
  water_reader_support_status: WaterbodySearchResult["waterReaderSupportStatus"];
  water_reader_support_reason: string;
  has_polygon_geometry: boolean;
  polygon_area_acres: number | null;
  polygon_qa_flags: string[] | null;
}

function mapPreviewBbox(row: SearchRow): WaterbodySearchResult["previewBbox"] {
  const minLon = row.preview_bbox_min_lon;
  const minLat = row.preview_bbox_min_lat;
  const maxLon = row.preview_bbox_max_lon;
  const maxLat = row.preview_bbox_max_lat;
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

function mapRow(row: SearchRow): WaterbodySearchResult {
  return {
    lakeId: row.lake_id,
    name: row.name,
    state: row.state,
    county: row.county,
    waterbodyType: row.waterbody_type,
    surfaceAreaAcres: row.surface_area_acres,
    centroid: {
      lat: row.centroid_lat,
      lon: row.centroid_lon,
    },
    previewBbox: mapPreviewBbox(row),
    dataTier: row.data_tier,
    aerialAvailable: row.aerial_available,
    depthAvailable: row.depth_available,
    depthUsabilityStatus: row.depth_usability_status,
    availability: row.availability,
    sourceStatus: row.source_status,
    bestAvailableMode: row.best_available_mode,
    confidence: row.confidence,
    waterReaderSupportStatus: row.water_reader_support_status,
    waterReaderSupportReason: row.water_reader_support_reason,
    hasPolygonGeometry: row.has_polygon_geometry,
    polygonAreaAcres: row.polygon_area_acres,
    polygonQaFlags: row.polygon_qa_flags ?? [],
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

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (query.length < 2) {
    return jsonError("query must be at least 2 characters", "invalid_query", 400);
  }

  const state = typeof body.state === "string" && body.state.trim().length > 0
    ? body.state.trim().toUpperCase()
    : null;
  const limitRaw = Number(body.limit ?? 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(25, Math.max(1, Math.floor(limitRaw))) : 10;

  const { data, error } = await supabase.rpc("search_waterbodies", {
    query_text: query,
    state_filter: state,
    result_limit: limit,
  });
  if (error) {
    console.error("[waterbody-search] rpc failed", error);
    return jsonError("Failed to search waterbodies", "search_failed", 500);
  }

  const rows = Array.isArray(data) ? data as SearchRow[] : [];
  return new Response(
    JSON.stringify({
      feature: WATERBODY_SEARCH_FEATURE,
      query,
      state,
      results: rows.map(mapRow),
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
