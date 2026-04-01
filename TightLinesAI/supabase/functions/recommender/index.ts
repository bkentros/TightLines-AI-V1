/**
 * recommender — Supabase Edge Function
 *
 * Deterministic, species-first lure/fly recommender.
 * No LLM. No external AI calls. Pure engine compute.
 *
 * Required POST body:
 *   latitude       number
 *   longitude      number
 *   state_code     string (2-letter US state)
 *   species        SpeciesGroup
 *   context        EngineContext
 *   water_clarity  "clear" | "stained" | "dirty"
 *   env_data       Record<string, unknown>  (same shape as how-fishing env_data)
 *
 * Optional:
 *   region_key     RegionKey (auto-resolved from coords if omitted)
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildSharedEngineRequestFromEnvData,
  type EngineContext,
} from "../_shared/howFishingEngine/index.ts";
import {
  ENGINE_CONTEXTS,
} from "../_shared/howFishingEngine/contracts/context.ts";
import { resolveRegionForCoordinates } from "../_shared/howFishingEngine/context/resolveRegion.ts";
import {
  SPECIES_GROUPS,
  type SpeciesGroup,
  type WaterClarity,
  runRecommender,
  isSpeciesValidForState,
} from "../_shared/recommenderEngine/index.ts";

const VALID_WATER_CLARITY: WaterClarity[] = ["clear", "stained", "dirty"];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
}

function jsonError(msg: string, code: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: code, message: msg }),
    { status, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
}

function localDateInTz(timezone: string, d = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function extractTimezone(envData: Record<string, unknown>): string {
  if (typeof envData.timezone === "string" && envData.timezone.length > 0) {
    return envData.timezone;
  }
  return "America/New_York";
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", "method_not_allowed", 405);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken ?? (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) return jsonError("Missing authentication token", "unauthorized", 401);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return jsonError("Unauthorized", "unauthorized", 401);

  // ── Subscription gate ─────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();
  const tier = (profile?.subscription_tier as string) ?? "free";
  if (tier === "free") {
    return jsonError("Subscribe to use this feature", "subscription_required", 403);
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", "invalid_body", 400);
  }

  // ── Validate coords ───────────────────────────────────────────────────────
  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  if (isNaN(lat) || lat < -90 || lat > 90) return jsonError("Invalid latitude", "invalid_input", 400);
  if (isNaN(lon) || lon < -180 || lon > 180) return jsonError("Invalid longitude", "invalid_input", 400);

  // ── Validate species ──────────────────────────────────────────────────────
  const species = body.species as string;
  if (!species || !(SPECIES_GROUPS as readonly string[]).includes(species)) {
    return jsonError(`Invalid species. Must be one of: ${SPECIES_GROUPS.join(", ")}`, "invalid_species", 400);
  }

  // ── Validate context ──────────────────────────────────────────────────────
  const context = body.context as string;
  if (!context || !(ENGINE_CONTEXTS as readonly string[]).includes(context)) {
    return jsonError(`Invalid context. Must be one of: ${ENGINE_CONTEXTS.join(", ")}`, "invalid_context", 400);
  }

  // ── Validate water_clarity ────────────────────────────────────────────────
  const water_clarity = body.water_clarity as string;
  if (!water_clarity || !VALID_WATER_CLARITY.includes(water_clarity as WaterClarity)) {
    return jsonError("Invalid water_clarity. Must be: clear | stained | dirty", "invalid_clarity", 400);
  }

  // ── Validate state_code ───────────────────────────────────────────────────
  const state_code = typeof body.state_code === "string" ? body.state_code.toUpperCase() : "";
  if (!state_code || state_code.length !== 2) {
    return jsonError("Invalid state_code. Must be a 2-letter US state abbreviation.", "invalid_input", 400);
  }

  // ── State × species gate ──────────────────────────────────────────────────
  if (!isSpeciesValidForState(species as SpeciesGroup, state_code, context as EngineContext)) {
    return jsonError(
      `Species '${species}' is not available in ${state_code} for context '${context}'.`,
      "species_not_available",
      422,
    );
  }

  // ── Validate env_data ─────────────────────────────────────────────────────
  if (!body.env_data || typeof body.env_data !== "object") {
    return jsonError("env_data is required", "missing_env_data", 400);
  }
  const envData = body.env_data as Record<string, unknown>;

  // ── Resolve timezone + date ───────────────────────────────────────────────
  const timezone = extractTimezone(envData);
  const local_date = localDateInTz(timezone);
  const month = parseInt(local_date.slice(5, 7), 10);

  // ── Resolve region key ────────────────────────────────────────────────────
  const region_key = resolveRegionForCoordinates(lat, lon);

  // ── Build SharedEngineRequest (env normalizer) ────────────────────────────
  const shared_req = buildSharedEngineRequestFromEnvData(
    lat,
    lon,
    local_date,
    timezone,
    context as EngineContext,
    envData,
    0, // day_offset = 0 (always today)
  );

  // ── Run recommender ───────────────────────────────────────────────────────
  let result;
  try {
    result = runRecommender({
      location: {
        latitude: lat,
        longitude: lon,
        state_code,
        region_key,
        local_date,
        local_timezone: timezone,
        month,
      },
      species: species as SpeciesGroup,
      context: context as EngineContext,
      water_clarity: water_clarity as WaterClarity,
      env_data: shared_req.environment as Record<string, unknown>,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Engine error";
    console.error("[recommender] engine error:", msg);
    return jsonError("Engine computation failed", "engine_error", 500);
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
});
