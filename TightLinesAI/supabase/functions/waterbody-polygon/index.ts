import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { WATERBODY_POLYGON_FEATURE } from "../_shared/waterReader/index.ts";

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
  source_dataset: string | null;
  source_feature_id: string | null;
  source_summary: Record<string, unknown> | null;
  geometry_is_valid: boolean;
  geometry_validity_detail: string | null;
  component_count: number;
  interior_ring_count: number;
  water_reader_support_status: string;
  water_reader_support_reason: string;
  polygon_qa_flags: string[] | null;
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

  const { data, error } = await supabase.rpc("get_waterbody_polygon_for_reader", {
    in_lake_id: lakeIdRaw,
  });

  if (error) {
    console.error("[waterbody-polygon] rpc failed", error);
    return jsonError("Failed to load waterbody polygon", "polygon_fetch_failed", 500);
  }

  const rows = Array.isArray(data) ? data as PolygonRpcRow[] : [];
  if (rows.length === 0) {
    return new Response(
      JSON.stringify({
        feature: WATERBODY_POLYGON_FEATURE,
        lakeId: lakeIdRaw,
        error: "not_found",
        message: "No waterbody found for this id.",
      }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const row = rows[0]!;
  const bbox =
    row.bbox_min_lon != null &&
      row.bbox_min_lat != null &&
      row.bbox_max_lon != null &&
      row.bbox_max_lat != null &&
      Number.isFinite(row.bbox_min_lon) &&
      Number.isFinite(row.bbox_min_lat) &&
      Number.isFinite(row.bbox_max_lon) &&
      Number.isFinite(row.bbox_max_lat) &&
      row.bbox_min_lon < row.bbox_max_lon &&
      row.bbox_min_lat < row.bbox_max_lat
      ? {
        minLon: row.bbox_min_lon,
        minLat: row.bbox_min_lat,
        maxLon: row.bbox_max_lon,
        maxLat: row.bbox_max_lat,
      }
      : null;

  return new Response(
    JSON.stringify({
      feature: WATERBODY_POLYGON_FEATURE,
      lakeId: row.lake_id,
      name: row.name,
      state: row.state,
      county: row.county,
      waterbodyType: row.waterbody_type,
      centroid: { lat: row.centroid_lat, lon: row.centroid_lon },
      bbox,
      areaSqM: row.area_sq_m,
      areaAcres: row.area_acres,
      perimeterM: row.perimeter_m,
      geojson: row.geojson,
      sourceDataset: row.source_dataset,
      sourceFeatureId: row.source_feature_id,
      sourceSummary: row.source_summary,
      geometryIsValid: row.geometry_is_valid,
      geometryValidityDetail: row.geometry_validity_detail,
      componentCount: row.component_count,
      interiorRingCount: row.interior_ring_count,
      waterReaderSupportStatus: row.water_reader_support_status,
      waterReaderSupportReason: row.water_reader_support_reason,
      polygonQaFlags: row.polygon_qa_flags ?? [],
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
