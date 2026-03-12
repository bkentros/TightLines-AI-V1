/**
 * how-fishing — Supabase Edge Function v2
 *
 * Orchestrator for the "How's Fishing Right Now?" feature.
 * Architecture:
 *   1. Auth + subscription + usage cap validation
 *   2. Fetch fresh environment via get-environment
 *   3. Convert to EngineSnapshot via adapter
 *   4. Run core intelligence engine 1x (inland) or 3x in parallel (coastal)
 *   5. Build LLM payload from engine outputs — NOT from raw weather
 *   6. Call Claude 1x or 3x in parallel for narrative only
 *   7. Package FeatureBundle and return to client
 *   8. Log usage and ai_sessions row
 *
 * Spec reference: hows_fishing_feature_spec.md, core_intelligence_spec.md
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { runCoreIntelligence } from "../_shared/coreIntelligence/index.ts";
import { toEngineSnapshot } from "../_shared/envAdapter.ts";
import type { WaterType } from "../_shared/coreIntelligence/types.ts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const USAGE_CAP_ANGLER_USD = 1;
const USAGE_CAP_MASTER_ANGLER_USD = 3;
// Coastal uses 3 Claude calls; inland uses 1. Use coastal max for pre-check.
const ESTIMATED_COST_COASTAL_USD = 0.018;
const ESTIMATED_COST_INLAND_USD = 0.006;
const CLAUDE_MODEL = "claude-haiku-4-5";

// Claude Haiku 4.5 pricing per 1M tokens
const CLAUDE_INPUT_COST_PER_M = 1;
const CLAUDE_OUTPUT_COST_PER_M = 5;

// ---------------------------------------------------------------------------
// Verbatim system prompt from hows_fishing_feature_spec.md Section 7A
// ---------------------------------------------------------------------------

const HOW_FISHING_SYSTEM_PROMPT = `You are a professional fishing guide writing a short, honest fishing-conditions brief from authoritative deterministic engine output.

Rules:
- The engine is authoritative. Never recalculate or contradict score, alerts, timing windows, or water type.
- Be concise. Anglers should understand the situation in seconds, not minutes.
- Be honest. If conditions are poor, say so directly.
- Explain only the main biological drivers.
- Never give species-specific advice, lure advice, or made-up tactics.
- Respect missing-data boundaries. If water temperature is estimated rather than measured, say estimated. If data quality is reduced, say so briefly.
- Use the exact best and worst windows provided. Never invent windows.

Length limits:
- headline_summary: exactly 1 sentence, max 22 words
- overall_fishing_rating.summary: 1 sentence, max 26 words
- best_times_to_fish_today: max 2 items, reasoning max 18 words each
- worst_times_to_fish_today: max 2 items, reasoning max 18 words each
- key_factors values: short sentence fragments, max 18 words each
- tips_for_today: exactly 3 tips, max 14 words each

Water temperature wording:
- If water_temp_source is freshwater_air_model, call it an estimate from recent air-temperature history.
- If water_temp_source is noaa_coops, call it a measured coastal water temperature.

Output valid JSON only matching this schema:
{
  "headline_summary": "string",
  "overall_fishing_rating": {
    "label": "Exceptional | Excellent | Good | Fair | Poor | Tough",
    "summary": "string"
  },
  "best_times_to_fish_today": [
    {
      "time_range": "string",
      "label": "PRIME | GOOD",
      "reasoning": "string"
    }
  ],
  "worst_times_to_fish_today": [
    {
      "time_range": "string",
      "reasoning": "string"
    }
  ],
  "key_factors": {
    "barometric_pressure": "string",
    "temperature_trend": "string",
    "light_conditions": "string",
    "tide_or_solunar": "string",
    "moon_phase": "string",
    "wind": "string",
    "precipitation_recent_rain": "string"
  },
  "tips_for_today": ["string", "string", "string"]
}`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function getUsageCapUsd(tier: string): number {
  if (tier === "angler") return USAGE_CAP_ANGLER_USD;
  if (tier === "master_angler") return USAGE_CAP_MASTER_ANGLER_USD;
  return 0;
}

function computeCallCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens * CLAUDE_INPUT_COST_PER_M + outputTokens * CLAUDE_OUTPUT_COST_PER_M) / 1_000_000;
}

// ---------------------------------------------------------------------------
// Claude call helper
// ---------------------------------------------------------------------------

interface LLMOutput {
  headline_summary: string;
  overall_fishing_rating: { label: string; summary: string };
  best_times_to_fish_today: Array<{ time_range: string; label: string; reasoning: string }>;
  worst_times_to_fish_today: Array<{ time_range: string; reasoning: string }>;
  key_factors: Record<string, string>;
  tips_for_today: string[];
}

interface ClaudeCallResult {
  llm: LLMOutput | null;
  inputTokens: number;
  outputTokens: number;
  error: string | null;
}

function normalizeKeyFactors(input: unknown): Record<string, string> {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const readString = (...keys: string[]): string => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === "string" && value.trim().length > 0) return value.trim();
    }
    return "";
  };

  return {
    barometric_pressure: readString("barometric_pressure", "pressure", "pressure_state"),
    temperature_trend: readString("temperature_trend", "temp_trend", "water_temperature_trend"),
    light_conditions: readString("light_conditions", "light", "light_condition"),
    tide_or_solunar: readString("tide_or_solunar", "tide", "solunar", "timing"),
    moon_phase: readString("moon_phase", "moon"),
    wind: readString("wind", "wind_conditions"),
    precipitation_recent_rain: readString("precipitation_recent_rain", "precipitation", "recent_rain", "rain"),
  };
}

function truncateWords(value: string, maxWords: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const words = normalized.split(" ");
  if (words.length <= maxWords) return normalized;
  return words.slice(0, maxWords).join(" ").trim();
}

function sanitizeTopLevelText(value: unknown, maxWords: number): string {
  return typeof value === "string" ? truncateWords(value, maxWords) : "";
}

function sanitizeKeyFactorMap(input: unknown): Record<string, string> {
  const normalized = normalizeKeyFactors(input);
  return Object.fromEntries(
    Object.entries(normalized).map(([key, value]) => [key, truncateWords(value, 18)])
  );
}

function sanitizeBestTimes(input: unknown): LLMOutput["best_times_to_fish_today"] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .slice(0, 2)
    .map((item) => ({
      time_range: sanitizeTopLevelText(item.time_range, 6),
      label: item.label === "PRIME" ? "PRIME" : "GOOD",
      reasoning: sanitizeTopLevelText(item.reasoning, 18),
    }))
    .filter((item) => item.time_range.length > 0 && item.reasoning.length > 0);
}

function sanitizeWorstTimes(input: unknown): LLMOutput["worst_times_to_fish_today"] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .slice(0, 2)
    .map((item) => ({
      time_range: sanitizeTopLevelText(item.time_range, 6),
      reasoning: sanitizeTopLevelText(item.reasoning, 18),
    }))
    .filter((item) => item.time_range.length > 0 && item.reasoning.length > 0);
}

function sanitizeTips(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((value): value is string => typeof value === "string")
    .slice(0, 3)
    .map((value) => truncateWords(value, 14))
    .filter(Boolean);
}

async function callClaudeForReport(
  anthropicKey: string,
  enginePayload: Record<string, unknown>
): Promise<ClaudeCallResult> {
  const userContent = `Environmental and engine data for this analysis:\n${JSON.stringify(enginePayload, null, 2)}\n\nProduce the fishing conditions analysis JSON.`;

  async function attemptCall(): Promise<{ text: string; inputTokens: number; outputTokens: number } | null> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 900,
        system: HOW_FISHING_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      }),
    });
    if (!res.ok) return null;
    const json = await res.json() as {
      content?: { type: string; text?: string }[];
      usage?: { input_tokens: number; output_tokens: number };
    };
    const text = json.content?.find((c) => c.type === "text")?.text ?? "";
    return {
      text,
      inputTokens: json.usage?.input_tokens ?? 0,
      outputTokens: json.usage?.output_tokens ?? 0,
    };
  }

  function parseLLMOutput(rawText: string): LLMOutput | null {
    try {
      // Strip markdown code fences if present
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      const parsed = JSON.parse(cleaned) as Record<string, unknown>;
      // Validate required top-level keys
      if (
        typeof parsed.headline_summary !== "string" ||
        !parsed.overall_fishing_rating ||
        !Array.isArray(parsed.best_times_to_fish_today) ||
        !Array.isArray(parsed.worst_times_to_fish_today) ||
        !parsed.key_factors ||
        !Array.isArray(parsed.tips_for_today)
      ) {
        return null;
      }
      const overall = parsed.overall_fishing_rating as Record<string, unknown>;
      return {
        headline_summary: sanitizeTopLevelText(parsed.headline_summary, 22),
        overall_fishing_rating: {
          label: sanitizeTopLevelText(overall.label, 2),
          summary: sanitizeTopLevelText(overall.summary, 26),
        },
        best_times_to_fish_today: sanitizeBestTimes(parsed.best_times_to_fish_today),
        worst_times_to_fish_today: sanitizeWorstTimes(parsed.worst_times_to_fish_today),
        key_factors: sanitizeKeyFactorMap(parsed.key_factors),
        tips_for_today: sanitizeTips(parsed.tips_for_today),
      };
    } catch {
      return null;
    }
  }

  // Attempt 1
  const attempt1 = await attemptCall();
  if (attempt1) {
    const parsed = parseLLMOutput(attempt1.text);
    if (parsed) {
      return { llm: parsed, inputTokens: attempt1.inputTokens, outputTokens: attempt1.outputTokens, error: null };
    }
  }

  // Retry once (Section 7B)
  const attempt2 = await attemptCall();
  if (attempt2) {
    const parsed = parseLLMOutput(attempt2.text);
    if (parsed) {
      return { llm: parsed, inputTokens: attempt2.inputTokens, outputTokens: attempt2.outputTokens, error: null };
    }
    return { llm: null, inputTokens: attempt2.inputTokens, outputTokens: attempt2.outputTokens, error: "malformed_response" };
  }

  return { llm: null, inputTokens: 0, outputTokens: 0, error: "claude_unavailable" };
}

// ---------------------------------------------------------------------------
// LLM payload builder (Section 6)
// ---------------------------------------------------------------------------

function buildLLMPayload(
  engineOutput: ReturnType<typeof runCoreIntelligence>,
  analysisDateLocal: string,
  currentTimeLocal: string
): Record<string, unknown> {
  const waterTempNarrative =
    engineOutput.environment.water_temp_source === "freshwater_air_model"
      ? "estimated from recent air-temperature history"
      : engineOutput.environment.water_temp_source === "noaa_coops"
        ? "measured coastal water temperature from NOAA CO-OPS"
        : "unavailable";

  return {
    feature: "hows_fishing_feature_v1",
    water_type: engineOutput.water_type,
    location: engineOutput.location,
    score: {
      adjusted_score: engineOutput.scoring.adjusted_score,
      raw_score: engineOutput.scoring.raw_score,
      overall_rating: engineOutput.scoring.overall_rating,
      recovery_multiplier: engineOutput.scoring.recovery_multiplier,
    },
    conditions: {
      air_temp_f: engineOutput.environment.air_temp_f,
      water_temp_f: engineOutput.environment.water_temp_f,
      water_temp_source: engineOutput.environment.water_temp_source,
      water_temp_note: waterTempNarrative,
      water_temp_zone: engineOutput.environment.water_temp_zone,
      pressure_mb: engineOutput.environment.pressure_mb,
      pressure_change_rate_mb_hr: engineOutput.environment.pressure_change_rate_mb_hr,
      pressure_state: engineOutput.environment.pressure_state,
      temp_trend_state: engineOutput.environment.temp_trend_state,
      temp_trend_direction_f: engineOutput.environment.temp_trend_direction_f,
      light_condition: engineOutput.environment.light_condition,
      tide_phase_state: engineOutput.environment.tide_phase_state,
      tide_strength_state: engineOutput.environment.tide_strength_state,
      solunar_state: engineOutput.environment.solunar_state,
      moon_phase: engineOutput.environment.moon_phase,
      moon_illumination_pct: engineOutput.environment.moon_illumination_pct,
      wind_speed_mph: engineOutput.environment.wind_speed_mph,
      wind_direction: engineOutput.environment.wind_direction,
      cloud_cover_pct: engineOutput.environment.cloud_cover_pct,
      precip_48hr_inches: engineOutput.environment.precip_48hr_inches,
      precip_7day_inches: engineOutput.environment.precip_7day_inches,
      precip_condition: engineOutput.environment.precip_condition,
      days_since_front: engineOutput.environment.days_since_front,
    },
    behavior_summary: {
      metabolic_state: engineOutput.behavior.metabolic_state,
      aggression_state: engineOutput.behavior.aggression_state,
      feeding_timer: engineOutput.behavior.feeding_timer,
      presentation_difficulty: engineOutput.behavior.presentation_difficulty,
      positioning_bias: engineOutput.behavior.positioning_bias,
      dominant_positive_drivers: engineOutput.behavior.dominant_positive_drivers,
      dominant_negative_drivers: engineOutput.behavior.dominant_negative_drivers,
    },
    data_quality: engineOutput.data_quality,
    alerts: engineOutput.alerts,
    best_windows: engineOutput.time_windows.slice(0, 2),
    worst_windows: engineOutput.worst_windows.slice(0, 2),
    analysis_date_local: analysisDateLocal,
    current_time_local: currentTimeLocal,
  };
}

// ---------------------------------------------------------------------------
// Get local date/time from UTC + offset
// ---------------------------------------------------------------------------

function getLocalDateAndTime(utcIso: string, tzOffsetHours: number): { date: string; time: string } {
  const ms = new Date(utcIso).getTime() + tzOffsetHours * 3600 * 1000;
  const d = new Date(ms);
  const date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  const time = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  return { date, time };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // --- 1. Auth ---
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  const userId = user.id;

  // --- 2. Parse body ---
  let body: { latitude?: number; longitude?: number; units?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  const units = body.units === "metric" ? "metric" : "imperial";
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return new Response(JSON.stringify({ error: "Invalid latitude" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    return new Response(JSON.stringify({ error: "Invalid longitude" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // --- 3. Subscription tier check ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  const tier = (profile?.subscription_tier as string) ?? "free";
  if (tier === "free") {
    return new Response(
      JSON.stringify({ error: "subscription_required", message: "Subscribe to use this feature" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // --- 4. Usage cap pre-check ---
  const cap = getUsageCapUsd(tier);
  const billingPeriod = new Date().toISOString().slice(0, 7);

  const { data: usageRow } = await supabase
    .from("usage_tracking")
    .select("id, total_cost_usd, call_count")
    .eq("user_id", userId)
    .eq("billing_period", billingPeriod)
    .maybeSingle();

  const currentCost = Number((usageRow as { total_cost_usd?: number } | null)?.total_cost_usd ?? 0);
  const estimatedCost = ESTIMATED_COST_COASTAL_USD; // use worst case for pre-check
  if (currentCost + estimatedCost > cap) {
    return new Response(
      JSON.stringify({
        error: "usage_cap_exceeded",
        message: "You've reached your monthly usage limit. Upgrade or wait for next billing period.",
      }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // --- 5. Fetch fresh environment (always forced fresh per spec Section 4D) ---
  const envUrl = `${supabaseUrl}/functions/v1/get-environment`;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const envRes = await fetch(envUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseAnonKey,
      "Authorization": authHeader,
    },
    body: JSON.stringify({ latitude: lat, longitude: lon, units }),
  });
  if (!envRes.ok) {
    return new Response(
      JSON.stringify({ error: "environment_fetch_failed", message: "Failed to fetch environment data" }),
      { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const envData = await envRes.json() as Record<string, unknown>;
  const timestampUtc = new Date().toISOString();

  // Convert to engine snapshot using adapter
  const engineSnapshot = toEngineSnapshot(
    envData as Parameters<typeof toEngineSnapshot>[0],
    lat,
    lon,
    timestampUtc,
    typeof (envData as { timezone?: unknown }).timezone === "string"
      ? (envData as { timezone: string }).timezone
      : "UTC"
  );

  // --- 6. Determine coastal vs inland ---
  const isCoastal = engineSnapshot.coastal;

  // --- 7. Run core intelligence engine ---
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const { date: analysisDateLocal, time: currentTimeLocal } = getLocalDateAndTime(
    timestampUtc,
    engineSnapshot.tz_offset_hours
  );

  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  interface ReportEntry {
    status: "ok" | "error";
    water_type: WaterType;
    engine: ReturnType<typeof runCoreIntelligence> | null;
    llm: LLMOutput | null;
    error: string | null;
  }

  async function runReportForWaterType(waterType: WaterType): Promise<ReportEntry> {
    let engineOutput: ReturnType<typeof runCoreIntelligence>;
    try {
      engineOutput = runCoreIntelligence(engineSnapshot, waterType);
    } catch (e) {
      return {
        status: "error",
        water_type: waterType,
        engine: null,
        llm: null,
        error: `engine_error: ${String(e)}`,
      };
    }

    const llmPayload = buildLLMPayload(engineOutput, analysisDateLocal, currentTimeLocal);
    const { llm, inputTokens, outputTokens, error: llmError } = await callClaudeForReport(
      anthropicKey,
      llmPayload
    );
    totalInputTokens += inputTokens;
    totalOutputTokens += outputTokens;

    if (llmError || !llm) {
      return {
        status: "error",
        water_type: waterType,
        engine: engineOutput,
        llm: null,
        error: llmError === "claude_unavailable" || llmError === "malformed_response"
          ? llmError
          : "claude_unavailable",
      };
    }

    return { status: "ok", water_type: waterType, engine: engineOutput, llm, error: null };
  }

  let reports: Record<string, ReportEntry>;
  let mode: "single" | "coastal_multi";
  let failedReports: string[] = [];

  if (isCoastal) {
    mode = "coastal_multi";
    // Section 5B/5C — three parallel runs
    const [fwResult, swResult, bkResult] = await Promise.all([
      runReportForWaterType("freshwater"),
      runReportForWaterType("saltwater"),
      runReportForWaterType("brackish"),
    ]);
    reports = { freshwater: fwResult, saltwater: swResult, brackish: bkResult };
    for (const [key, r] of Object.entries(reports)) {
      if (r.status === "error") failedReports.push(key);
    }
  } else {
    mode = "single";
    const fwResult = await runReportForWaterType("freshwater");
    reports = { freshwater: fwResult };
    if (fwResult.status === "error") failedReports.push("freshwater");
  }

  // --- 8. Calculate actual cost and log usage ---
  const actualCostUsd = computeCallCost(totalInputTokens, totalOutputTokens);
  const cacheExpiresAt = new Date(Date.now() + 45 * 60 * 1000).toISOString();

  // Build response bundle (Section 8)
  const responseBundle = {
    feature: "hows_fishing_feature_v1",
    mode,
    default_tab: "freshwater",
    generated_at: timestampUtc,
    cache_expires_at: cacheExpiresAt,
    reports: Object.fromEntries(
      Object.entries(reports).map(([key, r]) => [
        key,
        {
          status: r.status,
          water_type: r.water_type,
          engine: r.engine
            ? {
                environment: r.engine.environment,
                scoring: r.engine.scoring,
                behavior: r.engine.behavior,
                data_quality: r.engine.data_quality,
                alerts: r.engine.alerts,
                time_windows: r.engine.time_windows,
                worst_windows: r.engine.worst_windows,
              }
            : null,
          llm: r.llm,
          error: r.error,
        },
      ])
    ),
    failed_reports: failedReports,
  };

  // --- 9. Log ai_sessions ---
  const { error: aiError } = await supabase
    .from("ai_sessions")
    .insert({
      user_id: userId,
      session_type: "fishing_now",
      input_payload: { latitude: lat, longitude: lon, units, mode },
      response_payload: responseBundle,
      token_cost_usd: actualCostUsd,
    });

  if (aiError) {
    console.error("ai_sessions insert error:", aiError);
  }

  // --- 10. Log usage_tracking ---
  if ((usageRow as { id?: string } | null)?.id) {
    const prevCallCount = Number((usageRow as { call_count?: number } | null)?.call_count ?? 0);
    await supabase
      .from("usage_tracking")
      .update({
        total_cost_usd: currentCost + actualCostUsd,
        call_count: prevCallCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (usageRow as { id: string }).id);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      billing_period: billingPeriod,
      total_cost_usd: actualCostUsd,
      call_count: 1,
    });
  }

  return new Response(JSON.stringify(responseBundle), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
});
