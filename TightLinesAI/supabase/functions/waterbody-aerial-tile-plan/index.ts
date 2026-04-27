import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATERBODY_AERIAL_TILE_PLAN_FEATURE,
  type AerialTilePlan,
  type AerialTilePlanLabel,
  type AerialTilePlanResponse,
  type WaterbodyPreviewBbox,
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

interface TilePlanRow {
  tile_kind: "context" | "close";
  tile_id: number;
  priority: number;
  label: AerialTilePlanLabel;
  min_lon: number;
  min_lat: number;
  max_lon: number;
  max_lat: number;
  water_fraction: number | null;
  shoreline_score: number | null;
  max_close_tiles: number;
  prototype_only: boolean;
}

function isValidBbox(bbox: WaterbodyPreviewBbox): boolean {
  const { minLon, minLat, maxLon, maxLat } = bbox;
  return (
    [minLon, minLat, maxLon, maxLat].every((n) => Number.isFinite(n)) &&
    minLon >= -180 &&
    maxLon <= 180 &&
    minLat >= -90 &&
    maxLat <= 90 &&
    minLon < maxLon &&
    minLat < maxLat
  );
}

function bboxFromRow(row: TilePlanRow): WaterbodyPreviewBbox | null {
  const bbox = {
    minLon: row.min_lon,
    minLat: row.min_lat,
    maxLon: row.max_lon,
    maxLat: row.max_lat,
  };
  return isValidBbox(bbox) ? bbox : null;
}

function optionalFinite(value: number | null): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function mapRows(lakeId: string, rows: TilePlanRow[]): AerialTilePlanResponse {
  const contextRow = rows.find((row) => row.tile_kind === "context");
  const contextBbox = contextRow ? bboxFromRow(contextRow) : null;
  if (!contextRow || !contextBbox) {
    return {
      feature: WATERBODY_AERIAL_TILE_PLAN_FEATURE,
      lakeId,
      plan: null,
    };
  }

  const maxCloseTiles = Math.min(
    12,
    Math.max(1, Math.floor(contextRow.max_close_tiles || 3)),
  );
  const tiles = rows
    .filter((row) => row.tile_kind === "close")
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxCloseTiles)
    .flatMap((row) => {
      const bbox = bboxFromRow(row);
      if (!bbox) return [];
      return [{
        id: row.tile_id,
        bbox,
        priority: row.priority,
        label: row.label,
        waterFraction: optionalFinite(row.water_fraction),
        shorelineScore: optionalFinite(row.shoreline_score),
      }];
    });

  const plan: AerialTilePlan = {
    contextBbox,
    tiles,
    source: "serverGeometry",
    maxCloseTiles,
    prototypeOnly: true,
  };

  return {
    feature: WATERBODY_AERIAL_TILE_PLAN_FEATURE,
    lakeId,
    plan,
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

  const rawMax = Number(body.maxCloseTiles ?? 3);
  const maxCloseTiles = Number.isFinite(rawMax) ? Math.min(12, Math.max(1, Math.floor(rawMax))) : 3;

  const { data, error } = await supabase.rpc("plan_waterbody_aerial_tiles", {
    lake_id: lakeId,
    requested_max_close_tiles: maxCloseTiles,
  });
  if (error) {
    console.error("[waterbody-aerial-tile-plan] rpc failed", error);
    return jsonError("Failed to plan aerial tiles", "tile_plan_failed", 500);
  }

  const rows = Array.isArray(data) ? data as TilePlanRow[] : [];
  const response = mapRows(lakeId, rows);
  return new Response(
    JSON.stringify(response),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
