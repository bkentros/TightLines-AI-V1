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
  isContextAllowedForRecommenderV3,
  runRecommenderV3Surface,
  toRecommenderV3Species,
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

function isIsoDateString(raw: unknown): raw is string {
  return typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw);
}

function extractTimezone(envData: Record<string, unknown>): string {
  if (typeof envData.timezone === "string" && envData.timezone.length > 0) {
    return envData.timezone;
  }
  return "America/New_York";
}

export function buildRecommenderEngineRequest(body: Record<string, unknown>) {
  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  const state_code = typeof body.state_code === "string" ? body.state_code.toUpperCase() : "";
  const species = body.species as SpeciesGroup;
  const context = body.context as EngineContext;
  const water_clarity = body.water_clarity as WaterClarity;
  const envData = body.env_data as Record<string, unknown>;
  const timezone = extractTimezone(envData);
  const target_date = isIsoDateString(body.target_date) ? body.target_date : null;
  const local_date = target_date ?? localDateInTz(timezone);
  const month = parseInt(local_date.slice(5, 7), 10);

  const shared_req = buildSharedEngineRequestFromEnvData(
    lat,
    lon,
    local_date,
    timezone,
    context,
    envData,
    0,
    { useCalendarDayProfileForToday: true },
  );

  return {
    timezone,
    local_date,
    month,
    shared_req,
    engineReq: {
      location: {
        latitude: lat,
        longitude: lon,
        state_code,
        region_key: shared_req.region_key,
        local_date,
        local_timezone: timezone,
        month,
      },
      species,
      context,
      water_clarity,
      env_data: shared_req.environment as Record<string, unknown>,
    },
  };
}

export async function handleRecommenderRequest(
  req: Request,
  deps?: {
    createAdminClient?: () => ReturnType<typeof createClient>;
  },
): Promise<Response> {
  const createAdminClient =
    deps?.createAdminClient ??
    (() => {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      return createClient(supabaseUrl, supabaseServiceKey);
    });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", "method_not_allowed", 405);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = createAdminClient();

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
    .single<{ subscription_tier: string | null }>();
  const tier = profile?.subscription_tier ?? "free";
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
  if (!isSpeciesValidForState(state_code, species as SpeciesGroup, context as EngineContext)) {
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
  if (body.target_date != null && !isIsoDateString(body.target_date)) {
    return jsonError("Invalid target_date. Must be YYYY-MM-DD.", "invalid_input", 400);
  }

  const { engineReq } = buildRecommenderEngineRequest(body);

  // ── Run recommender ───────────────────────────────────────────────────────
  // The recommender is now a freshwater V3-only flagship path. We keep the
  // current frontend response shape, but all fish logic, seasonal tables,
  // and scoring come from V3.
  let result;
  try {
    const v3Species = toRecommenderV3Species(engineReq.species);
    if (v3Species === null || !isContextAllowedForRecommenderV3(v3Species, engineReq.context)) {
      return jsonError(
        "The recommender currently supports freshwater V3 species and water types only.",
        "unsupported_recommender_scope",
        422,
      );
    }

    result = runRecommenderV3Surface(engineReq);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Engine error";
    console.error("[recommender] engine error:", msg);
    return jsonError("Engine computation failed", "engine_error", 500);
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

// ─── Handler ──────────────────────────────────────────────────────────────────

if (import.meta.main) {
  Deno.serve((req: Request) => handleRecommenderRequest(req));
}
