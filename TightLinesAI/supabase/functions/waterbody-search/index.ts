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

function normalizeWaterbodyName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function openableSupport(row: SearchRow): boolean {
  return row.has_polygon_geometry && row.water_reader_support_status !== "not_supported";
}

function rowAreaAcres(row: SearchRow): number {
  return row.polygon_area_acres ?? row.surface_area_acres ?? 0;
}

function sortedRowsForDisplay(rows: SearchRow[], query: string): SearchRow[] {
  const normQuery = normalizeWaterbodyName(query);
  return [...rows]
    .map((row, originalIndex) => ({ row, originalIndex }))
    .sort((a, b) => {
      const aExact = normalizeWaterbodyName(a.row.name) === normQuery ? 0 : 1;
      const bExact = normalizeWaterbodyName(b.row.name) === normQuery ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      const aOpen = openableSupport(a.row) ? 0 : 1;
      const bOpen = openableSupport(b.row) ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      if (
        aExact === 0 &&
        bExact === 0 &&
        a.row.state === b.row.state &&
        normalizeWaterbodyName(a.row.name) === normalizeWaterbodyName(b.row.name)
      ) {
        const areaDelta = rowAreaAcres(b.row) - rowAreaAcres(a.row);
        if (Math.abs(areaDelta) > 0.001) return areaDelta;
      }
      if (a.originalIndex !== b.originalIndex) return a.originalIndex - b.originalIndex;
      return (a.row.county ?? "").localeCompare(b.row.county ?? "") ||
        a.row.name.localeCompare(b.row.name);
    })
    .map(({ row }) => row);
}

function sameNameStateCounts(rows: SearchRow[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = `${row.state}|${normalizeWaterbodyName(row.name)}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function mapRow(row: SearchRow, sameNameCount: number): WaterbodySearchResult {
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
    sameNameStateCandidateCount: sameNameCount,
    isAmbiguousNameInState: sameNameCount > 1,
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

  const rows = sortedRowsForDisplay(Array.isArray(data) ? data as SearchRow[] : [], query);
  const sameNameCounts = sameNameStateCounts(rows);
  return new Response(
    JSON.stringify({
      feature: WATERBODY_SEARCH_FEATURE,
      query,
      state,
      results: rows.map((row) => mapRow(row, sameNameCounts.get(`${row.state}|${normalizeWaterbodyName(row.name)}`) ?? 1)),
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
