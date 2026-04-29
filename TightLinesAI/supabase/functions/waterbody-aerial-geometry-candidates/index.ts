import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATERBODY_AERIAL_GEOMETRY_CANDIDATES_FEATURE,
  type AerialGeometryCandidateFeatureTag,
  type AerialGeometryCandidateReasonCode,
  type WaterbodyAerialGeometryCandidateRow,
  type WaterbodyAerialGeometryCandidatesResponse,
  type WaterbodyPreviewBbox,
  isWaterbodyType,
} from "../_shared/waterReader/contracts.ts";

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

interface RpcGeometryCandidateRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  waterbody_type: string;
  context_min_lon: number;
  context_min_lat: number;
  context_max_lon: number;
  context_max_lat: number;
  candidate_id: number;
  feature_tag: string;
  candidate_source: string;
  reason_code: string;
  anchor_lon: number;
  anchor_lat: number;
  normalized_anchor_x: number;
  normalized_anchor_y: number;
  overlay_x: number;
  overlay_y: number;
  overlay_w: number;
  overlay_h: number;
  base_score: number;
  geometry_qa: Record<string, unknown> | null;
  requested_month: number | null;
}

const FEATURE_TAGS: readonly AerialGeometryCandidateFeatureTag[] = [
  "shoreline_complexity",
  "coverage_distribution",
];

const REASON_CODES: readonly AerialGeometryCandidateReasonCode[] = [
  "shoreline_area_geometry_context",
  "map_region_callout",
];

function isFeatureTag(v: string): v is AerialGeometryCandidateFeatureTag {
  return (FEATURE_TAGS as readonly string[]).includes(v);
}

function isReasonCode(v: string): v is AerialGeometryCandidateReasonCode {
  return (REASON_CODES as readonly string[]).includes(v);
}

function mapRpcRow(row: RpcGeometryCandidateRow): WaterbodyAerialGeometryCandidateRow | null {
  if (!isWaterbodyType(row.waterbody_type)) return null;
  if (row.candidate_source !== "geometry_candidate") return null;
  if (!isFeatureTag(row.feature_tag)) return null;
  if (!isReasonCode(row.reason_code)) return null;

  const contextBbox: WaterbodyPreviewBbox = {
    minLon: row.context_min_lon,
    minLat: row.context_min_lat,
    maxLon: row.context_max_lon,
    maxLat: row.context_max_lat,
  };

  return {
    lakeId: row.lake_id,
    name: row.name,
    state: row.state,
    county: row.county,
    waterbodyType: row.waterbody_type,
    contextBbox,
    candidateId: row.candidate_id,
    featureTag: row.feature_tag,
    candidateSource: "geometry_candidate",
    reasonCode: row.reason_code,
    anchorLon: row.anchor_lon,
    anchorLat: row.anchor_lat,
    normalizedAnchorX: row.normalized_anchor_x,
    normalizedAnchorY: row.normalized_anchor_y,
    overlayX: row.overlay_x,
    overlayY: row.overlay_y,
    overlayW: row.overlay_w,
    overlayH: row.overlay_h,
    baseScore: row.base_score,
    geometryQa: row.geometry_qa && typeof row.geometry_qa === "object" ? row.geometry_qa : {},
    requestedMonth: row.requested_month,
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

  const lakeId = typeof body.lakeId === "string" ? body.lakeId.trim() : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lakeId)) {
    return jsonError("lakeId must be a valid UUID", "invalid_lake_id", 400);
  }

  let monthEcho: number | null = null;
  if (body.month !== undefined && body.month !== null) {
    const raw = typeof body.month === "number" ? body.month : Number(body.month);
    if (!Number.isFinite(raw) || Math.floor(raw) !== raw || raw < 1 || raw > 12) {
      return jsonError("month must be an integer between 1 and 12", "invalid_month", 400);
    }
    monthEcho = raw;
  }

  const rawMax = body.maxZones !== undefined && body.maxZones !== null ? Number(body.maxZones) : 5;
  const maxZones = Number.isFinite(rawMax)
    ? Math.min(5, Math.max(3, Math.floor(rawMax)))
    : 5;

  const { data, error } = await supabase.rpc("plan_waterbody_aerial_geometry_candidates", {
    in_lake_id: lakeId,
    in_requested_month: monthEcho,
    in_requested_max_zones: maxZones,
  });

  if (error) {
    console.error("[waterbody-aerial-geometry-candidates] rpc failed", error);
    return jsonError("Failed to load aerial geometry candidates", "geometry_candidates_failed", 500);
  }

  const rows = Array.isArray(data) ? data as RpcGeometryCandidateRow[] : [];
  const candidates: WaterbodyAerialGeometryCandidateRow[] = [];
  for (const row of rows) {
    const mapped = mapRpcRow(row);
    if (mapped) candidates.push(mapped);
  }

  const response: WaterbodyAerialGeometryCandidatesResponse = {
    feature: WATERBODY_AERIAL_GEOMETRY_CANDIDATES_FEATURE,
    lakeId,
    month: monthEcho,
    maxZones,
    candidates,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
});
