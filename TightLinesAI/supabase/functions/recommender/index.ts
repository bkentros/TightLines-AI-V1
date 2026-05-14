/**
 * recommender — Supabase Edge Function
 *
 * Deterministic, species-first lure/fly recommender.
 * No generative calls. No external AI calls. Pure engine compute.
 *
 * **Live runtime:** auth + subscription gate + validation here; recommendation math is
 * `resolveDailyPicksSession` → daily-picks 2x2 (`recommenderEngine/dailyPicks/**`)
 * using v4 seasonal rows and v4 archetype catalogs.
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
 *   recommendation_goal "all_purpose" | "big_fish" (defaults to all_purpose)
 *   refresh_requested boolean (server-authoritative one alternate set)
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
import {
  isSpeciesValidForState,
} from "../_shared/recommenderEngine/config/stateSpeciesGating.ts";
import {
  type RecommendationGoal,
  type WaterClarity,
} from "../_shared/recommenderEngine/contracts/input.ts";
import {
  SPECIES_GROUPS,
  type SpeciesGroup,
} from "../_shared/recommenderEngine/contracts/species.ts";
import {
  isContextAllowedForRecommenderV4,
  toRecommenderV4Species,
} from "../_shared/recommenderEngine/v4/scope.ts";
import {
  DailyPicksVariantUnavailableError,
  resolveDailyPicksSession,
} from "./dailyPicksSession.ts";
import {
  DailyPicksSeasonalRowMissingError,
} from "../_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";

const VALID_WATER_CLARITY: WaterClarity[] = ["clear", "stained", "dirty"];
const VALID_RECOMMENDATION_GOALS: RecommendationGoal[] = [
  "all_purpose",
  "big_fish",
];
const DEFAULT_RECOMMENDATION_GOAL: RecommendationGoal = "all_purpose";
const DAILY_PICKS_PREVIEW_HEADER = "x-recommender-preview";
const VALID_DAILY_PICKS_VIEW_VARIANTS = ["A", "B"] as const;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      `Content-Type, Authorization, apikey, x-user-token, ${DAILY_PICKS_PREVIEW_HEADER}`,
  };
}

function jsonError(msg: string, code: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: code, message: msg }),
    {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    },
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

function buildRecommenderEnvData(
  sharedEnvironment: Record<string, unknown>,
  rawEnvData: Record<string, unknown>,
): Record<string, unknown> {
  const envForEngine: Record<string, unknown> = { ...sharedEnvironment };

  if (Array.isArray(rawEnvData.hourly_wind_speed)) {
    envForEngine.hourly_wind_speed = rawEnvData.hourly_wind_speed;
  }

  const rawWeather =
    rawEnvData.weather && typeof rawEnvData.weather === "object"
      ? rawEnvData.weather as Record<string, unknown>
      : null;
  if (rawWeather && "wind_speed_unit" in rawWeather) {
    const existingWeather =
      envForEngine.weather && typeof envForEngine.weather === "object"
        ? envForEngine.weather as Record<string, unknown>
        : {};
    envForEngine.weather = {
      ...existingWeather,
      wind_speed_unit: rawWeather.wind_speed_unit,
    };
  }

  return envForEngine;
}

export function buildRecommenderEngineRequest(body: Record<string, unknown>) {
  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  const state_code = typeof body.state_code === "string"
    ? body.state_code.toUpperCase()
    : "";
  const species = body.species as SpeciesGroup;
  const context = body.context as EngineContext;
  const water_clarity = body.water_clarity as WaterClarity;
  const recommendation_goal = (body.recommendation_goal ??
    DEFAULT_RECOMMENDATION_GOAL) as RecommendationGoal;
  const envData = body.env_data as Record<string, unknown>;
  const timezone = extractTimezone(envData);
  const target_date = isIsoDateString(body.target_date)
    ? body.target_date
    : null;
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
      recommendation_goal,
      env_data: buildRecommenderEnvData(
        shared_req.environment as Record<string, unknown>,
        envData,
      ),
    },
  };
}

export async function handleRecommenderRequest(
  req: Request,
  deps?: {
    createAdminClient?: () => ReturnType<typeof createClient>;
  },
): Promise<Response> {
  const createAdminClient = deps?.createAdminClient ??
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
  const token = userToken ??
    (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return jsonError("Missing authentication token", "unauthorized", 401);
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    token,
  );
  if (authError || !user) return jsonError("Unauthorized", "unauthorized", 401);

  // ── Subscription gate ─────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single<{ subscription_tier: string | null }>();
  const tier = profile?.subscription_tier ?? "free";
  if (tier === "free") {
    return jsonError(
      "Subscribe to use this feature",
      "subscription_required",
      403,
    );
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
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return jsonError("Invalid latitude", "invalid_input", 400);
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    return jsonError("Invalid longitude", "invalid_input", 400);
  }

  // ── Validate species ──────────────────────────────────────────────────────
  const species = body.species as string;
  if (!species || !(SPECIES_GROUPS as readonly string[]).includes(species)) {
    return jsonError(
      `Invalid species. Must be one of: ${SPECIES_GROUPS.join(", ")}`,
      "invalid_species",
      400,
    );
  }

  // ── Validate context ──────────────────────────────────────────────────────
  const context = body.context as string;
  if (!context || !(ENGINE_CONTEXTS as readonly string[]).includes(context)) {
    return jsonError(
      `Invalid context. Must be one of: ${ENGINE_CONTEXTS.join(", ")}`,
      "invalid_context",
      400,
    );
  }

  // ── Validate water_clarity ────────────────────────────────────────────────
  const water_clarity = body.water_clarity as string;
  if (
    !water_clarity ||
    !VALID_WATER_CLARITY.includes(water_clarity as WaterClarity)
  ) {
    return jsonError(
      "Invalid water_clarity. Must be: clear | stained | dirty",
      "invalid_clarity",
      400,
    );
  }

  // ── Validate recommendation_goal ─────────────────────────────────────────
  const recommendationGoal = body.recommendation_goal;
  if (
    recommendationGoal != null &&
    !VALID_RECOMMENDATION_GOALS.includes(
      recommendationGoal as RecommendationGoal,
    )
  ) {
    return jsonError(
      "Invalid recommendation_goal. Must be: all_purpose | big_fish",
      "invalid_goal",
      400,
    );
  }

  // ── Validate state_code ───────────────────────────────────────────────────
  const state_code = typeof body.state_code === "string"
    ? body.state_code.toUpperCase()
    : "";
  if (!state_code || state_code.length !== 2) {
    return jsonError(
      "Invalid state_code. Must be a 2-letter US state abbreviation.",
      "invalid_input",
      400,
    );
  }

  // ── State × species gate ──────────────────────────────────────────────────
  if (
    !isSpeciesValidForState(
      state_code,
      species as SpeciesGroup,
      context as EngineContext,
    )
  ) {
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
    return jsonError(
      "Invalid target_date. Must be YYYY-MM-DD.",
      "invalid_input",
      400,
    );
  }
  if (
    body.refresh_requested != null &&
    typeof body.refresh_requested !== "boolean"
  ) {
    return jsonError(
      "Invalid refresh_requested. Must be boolean.",
      "invalid_input",
      400,
    );
  }
  if (
    body.view_variant != null &&
    !VALID_DAILY_PICKS_VIEW_VARIANTS.includes(
      body.view_variant as typeof VALID_DAILY_PICKS_VIEW_VARIANTS[number],
    )
  ) {
    return jsonError(
      "Invalid view_variant. Must be: A | B",
      "invalid_view_variant",
      400,
    );
  }
  if (body.refresh_requested === true && body.view_variant != null) {
    return jsonError(
      "refresh_requested and view_variant cannot be combined.",
      "invalid_input",
      400,
    );
  }

  const { engineReq } = buildRecommenderEngineRequest(body);
  const refreshRequested = body.refresh_requested === true;
  const viewVariant = body.view_variant as "A" | "B" | undefined;

  // ── Run recommender ───────────────────────────────────────────────────────
  let result;
  try {
    const v4Species = toRecommenderV4Species(engineReq.species);
    if (
      v4Species === null ||
      !isContextAllowedForRecommenderV4(v4Species, engineReq.context)
    ) {
      return jsonError(
        "The recommender currently supports freshwater daily-picks species and water types only.",
        "unsupported_recommender_scope",
        422,
      );
    }

    const session = await resolveDailyPicksSession({
      supabase,
      userId: user.id,
      req: engineReq,
      refreshRequested,
      viewVariant,
      seed: `${user.id}|daily-picks-default|${engineReq.location.local_date}`,
    });
    result = session.result;
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (err) {
    if (err instanceof DailyPicksVariantUnavailableError) {
      return jsonError(
        err.message,
        "variant_unavailable",
        409,
      );
    }
    if (err instanceof DailyPicksSeasonalRowMissingError) {
      return jsonError(
        "No exact daily-picks seasonal biology row exists for this species, region, month, and water type.",
        "seasonal_row_missing",
        422,
      );
    }
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
