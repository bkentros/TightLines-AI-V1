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
import type { WaterType, OverallRating, ForecastDay } from "../_shared/coreIntelligence/types.ts";

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

const HOW_FISHING_SYSTEM_PROMPT = `You are an experienced fishing guide giving a quick, honest rundown of today's fishing conditions. Write like you're talking to a fellow angler — plain language, no jargon, no science terms.

Rules:
- The engine numbers are final. Never recalculate or contradict the score, time windows, or alerts.
- Be direct. Good conditions? Say so. Tough day? Say that clearly too.
- Explain WHY fish will or won't bite — in fish-behavior terms, not meteorological ones.
- Keep it tight. Anglers should understand the situation in a few seconds.
- Never suggest specific lures, species, or tactics.
- Use exactly the time windows the engine provides. Never invent your own.

Language rules:
- Do not use these words: "cold-stunned" (freshwater), "peak water temp", "meteorological", "thermocline", "lethargic" (use "sluggish" instead), "suppressed" (use "slow" or "shut down"), "biological", "solunar" (use "feeding window" or "feeding cycle"), "barometric" (use "pressure"), "thermal stress" (use "too hot" or "heat stress").
- "peak_aggression" zone means fish are in their optimal temperature range — describe it as "fish are comfortable and feeding well" or similar.
- When talking about temperature trends, refer to air temperature for freshwater/inland. Only say "water temperature" trend for coastal when measured data is available (water_temp_is_estimated: false).
- Do not tell the user to check conditions themselves, verify anything, or monitor anything. Give them the answer.
- If water_temp_is_estimated is true, you may mention the water temp is estimated once in the tips — don't dwell on it.
- Use the seasonal_fish_behavior field to frame fish activity: deep_winter_survival means fish are barely moving and holding deep; pre_spawn_buildup means fish are starting to move and feed aggressively; spawn_period means fish are distracted and location-shifted; post_spawn_recovery means fish are scattered and selective; summer_peak_activity means fish are active on dawn/dusk edges; summer_heat_suppression means fish are pushed deep to cool water; fall_feed_buildup means fish are gorging hard before winter; late_fall_slowdown means fish are slowing down; mild_winter_active means fish are comfortable and feeding normally despite winter — treat as a good fishing day, not a survival situation.
- If saltwater_seasonal_state is present: sw_cold_inactive means fish are sluggish and deep, requiring slow presentations; sw_cold_mild_active means fish are feeding but slower — focus on midday warming periods; sw_transitional_feed means fish are actively transitioning and feeding well; sw_summer_peak means summer prime time — fish are aggressive; sw_summer_heat_stress means fish are avoiding heat — focus on dawn, dusk, and night.
- If severe_weather_alert is true: START your headline with a weather safety warning. Mention the specific dangers (from severe_weather_reasons). Still provide the fishing score and times, but lead with safety.

Length limits:
- headline_summary: exactly 1 sentence, max 20 words
- overall_fishing_rating.summary: 1 sentence, max 24 words
- best_times_to_fish_today: max 2 items, reasoning max 16 words each
- worst_times_to_fish_today: max 2 items, reasoning max 16 words each
- decent_times_today: max 2 items, reasoning max 16 words each
- key_factors values: short phrases, max 16 words each
- tips_for_today: exactly 3 tips, max 12 words each — make them actionable, specific to today

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
  "decent_times_today": [
    {
      "time_range": "string",
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
// River-specific system prompt — emphasizes current, structure, presentation
// ---------------------------------------------------------------------------

const RIVER_SYSTEM_PROMPT = `You are an experienced river fishing guide giving a quick, honest rundown of today's river fishing conditions. Write like you're talking to a fellow angler — plain language, no jargon, no science terms.

Rules:
- The engine numbers are final. Never recalculate or contradict the score, time windows, or alerts.
- Be direct. Good conditions? Say so. Tough day? Say that clearly too.
- Explain WHY fish will or won't bite — in fish-behavior terms, not meteorological ones.
- Keep it tight. Anglers should understand the situation in a few seconds.
- Never suggest specific lures, species, or tactics.
- Use exactly the time windows the engine provides. Never invent your own.
- RIVER-SPECIFIC: Always frame advice in terms of current flow and river structure:
  - Where fish hold relative to current (eddies, seams, tailouts, pools, cut banks)
  - How current speed affects fish positioning (slack water behind structure, inside bends)
  - Presentation relative to current (upstream, downstream, dead drift, swing)
  - Depth changes near river structure (bridge pilings, log jams, deep bends)
  - Water clarity and its effect on fish visibility and feeding

Language rules:
- Do not use these words: "cold-stunned", "peak water temp", "meteorological", "thermocline", "lethargic" (use "sluggish" instead), "suppressed" (use "slow" or "shut down"), "biological", "solunar" (use "feeding window" or "feeding cycle"), "barometric" (use "pressure"), "thermal stress" (use "too hot" or "heat stress").
- "peak_aggression" zone means fish are in their optimal temperature range — describe it as "fish are comfortable and feeding well" or similar.
- When talking about temperature trends, refer to air temperature. Rivers track air temps more closely than lakes.
- Do not tell the user to check conditions themselves, verify anything, or monitor anything. Give them the answer.
- If water_temp_is_estimated is true, you may mention the water temp is estimated once — don't dwell on it.
- Use the seasonal_fish_behavior field to frame fish activity (same rules as standard prompt).
- If severe_weather_alert is true: START your headline with a weather safety warning.

Length limits:
- headline_summary: exactly 1 sentence, max 20 words
- overall_fishing_rating.summary: 1 sentence, max 24 words
- best_times_to_fish_today: max 2 items, reasoning max 16 words each
- worst_times_to_fish_today: max 2 items, reasoning max 16 words each
- decent_times_today: max 2 items, reasoning max 16 words each
- key_factors values: short phrases, max 16 words each
- tips_for_today: exactly 3 tips, max 12 words each — make them actionable and RIVER-SPECIFIC

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
  "decent_times_today": [
    {
      "time_range": "string",
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

/**
 * Approximate coastal check using latitude/longitude heuristics.
 * Used as a fallback when NOAA station lookup fails.
 * Returns true if the location is likely within ~15 miles of a US coast.
 */
function isLikelyCoastal(lat: number, lon: number): boolean {
  // Florida peninsula: anywhere south of 30°N and east of -87.5°W
  if (lat < 30 && lon > -87.5 && lat > 24) return true;
  // Florida Keys
  if (lat < 25.5 && lat > 24 && lon > -82) return true;
  // US East Coast: within ~0.15° of coast (very rough)
  if (lat > 30 && lat < 45 && lon > -76 && lon < -74) return true; // NJ/NY/CT
  if (lat > 25 && lat < 31 && lon > -81.5 && lon < -79.5) return true; // FL/GA/SC east
  // Gulf Coast
  if (lat > 28 && lat < 31 && lon > -97 && lon < -88 && lat < 30.5) return true;
  // Southern California
  if (lat > 32 && lat < 35 && lon > -120 && lon < -117) return true;
  // Pacific Northwest coast
  if (lat > 42 && lat < 49 && lon > -125 && lon < -123.5) return true;

  return false;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
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
// Deterministic Fallback — generates LLM-shaped output from engine data alone
// Used when Claude is unavailable or returns malformed responses.
// ---------------------------------------------------------------------------

function generateDeterministicFallback(
  engineOutput: ReturnType<typeof runCoreIntelligence>,
  subtypeOrWaterType: string
): LLMOutput {
  const score = engineOutput.scoring.adjusted_score;
  const rating = engineOutput.scoring.overall_rating;
  const env = engineOutput.environment;
  const behavior = engineOutput.behavior;
  const alerts = engineOutput.alerts;

  // Headline
  let headline: string;
  if (alerts.severe_weather_alert) {
    headline = "Severe weather warning — check conditions before heading out.";
  } else if (alerts.cold_stun_alert) {
    headline = "Fish activity near zero — extremely cold water conditions.";
  } else if (score >= 80) {
    headline = `${rating} conditions — fish are feeding actively today.`;
  } else if (score >= 60) {
    headline = `${rating} conditions — decent opportunities if you time it right.`;
  } else if (score >= 40) {
    headline = `${rating} conditions — fish are present but not aggressive.`;
  } else {
    headline = `${rating} conditions — tough fishing expected today.`;
  }

  // Rating summary
  let ratingSummary: string;
  if (score >= 80) {
    ratingSummary = "Strong conditions across the board — multiple factors working in your favor.";
  } else if (score >= 60) {
    ratingSummary = "Conditions are favorable with some factors holding things back slightly.";
  } else if (score >= 40) {
    ratingSummary = "Mixed conditions — target the best time windows for your best shot.";
  } else {
    ratingSummary = "Conditions are working against the bite — patience and finesse will be key.";
  }

  // Best times from engine windows
  const bestTimes = engineOutput.time_windows.slice(0, 2).map((w) => ({
    time_range: `${w.start_local} – ${w.end_local}`,
    label: w.label as "PRIME" | "GOOD",
    reasoning: w.drivers.length > 0
      ? w.drivers.slice(0, 2).join(" + ").replace(/_/g, " ")
      : "Best available window",
  }));

  // Worst times
  const worstTimes = engineOutput.worst_windows.slice(0, 2).map((w) => ({
    time_range: `${w.start_local} – ${w.end_local}`,
    reasoning: "Lowest activity period",
  }));

  // Key factors from engine state
  const keyFactors: Record<string, string> = {
    barometric_pressure: env.pressure_state
      ? env.pressure_state.replace(/_/g, " ")
      : "Data unavailable",
    temperature_trend: env.temp_trend_state
      ? env.temp_trend_state.replace(/_/g, " ")
      : "Data unavailable",
    light_conditions: env.light_condition
      ? env.light_condition.replace(/_/g, " ")
      : "Data unavailable",
    tide_or_solunar: env.solunar_state
      ? env.solunar_state.replace(/_/g, " ")
      : (env.tide_phase_state ? env.tide_phase_state.replace(/_/g, " ") : "Data unavailable"),
    moon_phase: env.moon_phase ?? "Data unavailable",
    wind: env.wind_speed_mph !== null
      ? `${env.wind_speed_mph} mph ${env.wind_direction ?? ""}`
      : "Data unavailable",
    precipitation_recent_rain: env.precip_condition
      ? env.precip_condition.replace(/_/g, " ")
      : "Data unavailable",
  };

  // Tips based on behavior state
  const tips: string[] = [];
  if (behavior.metabolic_state === "shutdown" || behavior.metabolic_state === "lethargic") {
    tips.push("Fish are sluggish — use slow presentations");
  } else if (behavior.metabolic_state === "aggressive") {
    tips.push("Fish are aggressive — cover water quickly");
  } else {
    tips.push("Match your presentation to fish activity level");
  }

  if (behavior.positioning_bias) {
    const pos = behavior.positioning_bias.replace(/_/g, " ");
    tips.push(`Target ${pos}`);
  } else {
    tips.push("Focus on structure and depth transitions");
  }

  if (alerts.recovery_active && alerts.front_label) {
    tips.push("Cold front recovery — slow down your approach");
  } else if (env.pressure_state === "slowly_falling") {
    tips.push("Falling pressure often triggers feeding activity");
  } else {
    tips.push("Fish the prime windows for your best chance");
  }

  // Truncate tips to 12 words max
  const truncatedTips = tips.map((t) => {
    const words = t.split(" ");
    return words.length > 12 ? words.slice(0, 12).join(" ") : t;
  });

  return {
    headline_summary: headline,
    overall_fishing_rating: {
      label: rating,
      summary: ratingSummary,
    },
    best_times_to_fish_today: bestTimes,
    worst_times_to_fish_today: worstTimes,
    key_factors: keyFactors,
    tips_for_today: truncatedTips.slice(0, 3),
  };
}

// ---------------------------------------------------------------------------
// Claude call helper
// ---------------------------------------------------------------------------

interface LLMOutput {
  headline_summary: string;
  overall_fishing_rating: { label: string; summary: string };
  best_times_to_fish_today: Array<{ time_range: string; label: string; reasoning: string }>;
  decent_times_today?: Array<{ time_range: string; reasoning: string }>;  // NEW
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

function sanitizeDecentTimes(input: unknown): Array<{ time_range: string; reasoning: string }> {
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
    .map((value) => truncateWords(value, 12))
    .filter(Boolean);
}

async function callClaudeForReport(
  anthropicKey: string,
  enginePayload: Record<string, unknown>,
  systemPrompt?: string
): Promise<ClaudeCallResult> {
  const prompt = systemPrompt ?? HOW_FISHING_SYSTEM_PROMPT;
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
        system: prompt,
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
        decent_times_today: sanitizeDecentTimes(parsed.decent_times_today),  // NEW
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

  const isFreshwaterEstimated = engineOutput.environment.water_temp_source !== "noaa_coops";
  const measuredTrendAvailable =
    engineOutput.water_type !== "freshwater" &&
    engineOutput.environment.water_temp_source === "noaa_coops";

  return {
    feature: "hows_fishing_feature_v1",
    water_type: engineOutput.water_type,
    freshwater_subtype: engineOutput.environment.freshwater_subtype ?? null,
    seasonal_fish_behavior: engineOutput.environment.seasonal_fish_behavior ?? null,
    saltwater_seasonal_state: engineOutput.environment.saltwater_seasonal_state ?? null,  // NEW
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
      water_temp_is_estimated: isFreshwaterEstimated,
      measured_water_temp_trend_available: measuredTrendAvailable,
      // For inland/freshwater only reference air_temp_trend_direction_f as the trend signal
      air_temp_trend_direction_f: engineOutput.environment.temp_trend_direction_f,
      water_temp_zone: engineOutput.environment.water_temp_zone,
      pressure_mb: engineOutput.environment.pressure_mb,
      pressure_change_rate_mb_hr: engineOutput.environment.pressure_change_rate_mb_hr,
      pressure_state: engineOutput.environment.pressure_state,
      temp_trend_state: engineOutput.environment.temp_trend_state,
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
      front_label: engineOutput.alerts.front_label ?? null,
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
    alerts: {
      ...engineOutput.alerts,
      severe_weather_alert: engineOutput.alerts.severe_weather_alert ?? false,        // NEW
      severe_weather_reasons: engineOutput.alerts.severe_weather_reasons ?? [],       // NEW
    },
    best_windows: engineOutput.time_windows.slice(0, 2),
    fair_windows: (engineOutput.fair_windows ?? []).slice(0, 2),                     // NEW
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
// Weekly Overview — deterministic 7-day forecast scoring (no LLM)
// ---------------------------------------------------------------------------

function getOverallRatingFromScore(score: number): OverallRating {
  if (score >= 88) return "Exceptional";
  if (score >= 72) return "Excellent";
  if (score >= 55) return "Good";
  if (score >= 38) return "Fair";
  if (score >= 20) return "Poor";
  return "Tough";
}

/**
 * Compute a simplified daily score for a forecast day based on
 * high/low temps, precip chance, wind, and daylight hours.
 * Uses today's engine output as a baseline reference.
 */
function scoreForecastDay(
  day: { date: string; high_temp_f: number; low_temp_f: number; precip_chance_pct: number; wind_mph_max: number; sunrise_local: string; sunset_local: string },
  todayScore: number,
  waterType: WaterType,
  lat: number
): ForecastDay {
  let score = 50; // Start at neutral baseline

  const avgTemp = (day.high_temp_f + day.low_temp_f) / 2;

  // Temperature scoring — varies by water type
  if (waterType === "freshwater") {
    // Optimal avg air temp range: 55-75°F
    if (avgTemp >= 55 && avgTemp <= 75) score += 15;
    else if (avgTemp >= 45 && avgTemp <= 85) score += 5;
    else if (avgTemp < 35) score -= 15;
    else if (avgTemp > 90) score -= 10;
    // Warm-up days (high swing) can trigger feeding
    const swing = day.high_temp_f - day.low_temp_f;
    if (swing >= 15 && avgTemp < 60) score += 5; // warming swing in cool weather = good
  } else {
    // Salt/brackish — wider comfort zone
    if (avgTemp >= 60 && avgTemp <= 85) score += 12;
    else if (avgTemp >= 50 && avgTemp <= 90) score += 4;
    else if (avgTemp < 45) score -= 12;
    else if (avgTemp > 95) score -= 8;
  }

  // Precipitation penalty/bonus
  if (day.precip_chance_pct < 20) score += 5;        // clear day
  else if (day.precip_chance_pct < 50) score += 8;    // light rain chance = good
  else if (day.precip_chance_pct < 75) score -= 3;    // moderate rain
  else score -= 12;                                    // heavy rain likely

  // Wind scoring
  if (day.wind_mph_max <= 12) score += 8;              // light wind
  else if (day.wind_mph_max <= 20) score += 2;         // moderate
  else if (day.wind_mph_max <= 30) score -= 8;         // heavy
  else score -= 18;                                     // dangerous

  // Daylight hours bonus (more fishing time)
  const sunriseMin = parseInt(day.sunrise_local.split(":")[0]) * 60 + parseInt(day.sunrise_local.split(":")[1]);
  const sunsetMin = parseInt(day.sunset_local.split(":")[0]) * 60 + parseInt(day.sunset_local.split(":")[1]);
  const daylightHours = (sunsetMin - sunriseMin) / 60;
  if (daylightHours >= 13) score += 4;
  else if (daylightHours >= 11) score += 2;
  else if (daylightHours < 9) score -= 3;

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  const rating = getOverallRatingFromScore(score);

  // Build summary line
  let summaryLine: string;
  if (score >= 72) {
    summaryLine = `Strong conditions expected — high ${day.high_temp_f}°F, light wind.`;
  } else if (score >= 55) {
    summaryLine = `Good day ahead — ${day.precip_chance_pct > 40 ? "some rain possible but" : "conditions"} look favorable.`;
  } else if (score >= 38) {
    summaryLine = `Mixed conditions — ${day.wind_mph_max > 20 ? "windy" : day.precip_chance_pct > 60 ? "rain likely" : "average day"}, target best windows.`;
  } else {
    summaryLine = `Tough conditions — ${avgTemp < 35 ? "very cold" : day.wind_mph_max > 25 ? "high winds" : "unfavorable"} expected.`;
  }

  return {
    date: day.date,
    daily_score: score,
    overall_rating: rating,
    summary_line: summaryLine,
    high_temp_f: day.high_temp_f,
    low_temp_f: day.low_temp_f,
    wind_mph_avg: Math.round(day.wind_mph_max * 0.65), // rough avg from max
    precip_chance_pct: day.precip_chance_pct,
    front_label: null, // no front detection for forecast days
  };
}

/**
 * Build the weekly overview response from today's engine output and forecast_daily data.
 * Returns a complete response bundle for the weekly_overview mode.
 */
function buildWeeklyOverviewResponse(
  todayEngineOutput: ReturnType<typeof runCoreIntelligence>,
  forecastDaily: Array<{ date: string; high_temp_f: number; low_temp_f: number; precip_chance_pct: number; wind_mph_max: number; sunrise_local: string; sunset_local: string }>,
  waterType: WaterType,
  lat: number,
  timestampUtc: string
): { forecast_days: ForecastDay[]; today_summary: { daily_score: number; overall_rating: OverallRating; summary_line: string } } {
  const todayOutlook = todayEngineOutput.daily_outlook;

  // Today entry from full engine
  const todayForecast: ForecastDay = {
    date: forecastDaily[0]?.date ?? new Date(timestampUtc).toISOString().slice(0, 10),
    daily_score: todayOutlook.daily_score,
    overall_rating: todayOutlook.overall_rating,
    summary_line: todayOutlook.summary_line,
    high_temp_f: forecastDaily[0]?.high_temp_f ?? (todayEngineOutput.environment.air_temp_f ?? 70),
    low_temp_f: forecastDaily[0]?.low_temp_f ?? ((todayEngineOutput.environment.air_temp_f ?? 70) - 15),
    wind_mph_avg: todayEngineOutput.environment.wind_speed_mph ?? 0,
    precip_chance_pct: forecastDaily[0]?.precip_chance_pct ?? 0,
    front_label: todayEngineOutput.alerts.front_label ?? null,
  };

  // Forecast days 2-7 (indices 1-6)
  const futureDays: ForecastDay[] = forecastDaily.slice(1, 7).map((day) =>
    scoreForecastDay(day, todayOutlook.daily_score, waterType, lat)
  );

  return {
    forecast_days: [todayForecast, ...futureDays],
    today_summary: {
      daily_score: todayOutlook.daily_score,
      overall_rating: todayOutlook.overall_rating,
      summary_line: todayOutlook.summary_line,
    },
  };
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

  // Read user token from x-user-token header (ES256), falling back to Authorization (HS256 legacy)
  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken || (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Missing authentication token" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  const userId = user.id;

  // --- 2. Parse body ---
  let body: { latitude?: number; longitude?: number; units?: string; freshwater_subtype?: string; env_data?: Record<string, unknown>; mode?: string } = {};
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
  // Validate and normalize freshwater subtype; defaults to "lake" if unrecognized/absent
  const VALID_SUBTYPES = ["lake", "river_stream", "reservoir"] as const;
  type FwSubtype = typeof VALID_SUBTYPES[number];
  const freshwaterSubtype: FwSubtype =
    VALID_SUBTYPES.includes(body.freshwater_subtype as FwSubtype)
      ? (body.freshwater_subtype as FwSubtype)
      : "lake";
  const requestMode = body.mode === "weekly_overview" ? "weekly_overview" : "daily_detail";
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

  // --- 5. Use env_data from client (client already fetched fresh environment) ---
  if (!body.env_data || typeof body.env_data !== "object") {
    return new Response(
      JSON.stringify({ error: "missing_env_data", message: "env_data is required in the request body" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const envData = body.env_data as Record<string, unknown>;
  const timestampUtc = new Date().toISOString();

  // Convert to engine snapshot using adapter
  const engineSnapshot = toEngineSnapshot(
    envData as Parameters<typeof toEngineSnapshot>[0],
    lat,
    lon,
    timestampUtc,
    typeof (envData as { timezone?: unknown }).timezone === "string"
      ? (envData as { timezone: string }).timezone
      : "UTC",
    freshwaterSubtype
  );

  // --- 6. Determine coastal vs inland ---
  const isCoastal = engineSnapshot.coastal || isLikelyCoastal(lat, lon);

  // --- 7. Run core intelligence engine ---
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // --- 7a. Weekly overview mode — deterministic only, no LLM calls ---
  if (requestMode === "weekly_overview") {
    const forecastDaily = Array.isArray((envData as Record<string, unknown>).forecast_daily)
      ? (envData as Record<string, unknown>).forecast_daily as Array<{ date: string; high_temp_f: number; low_temp_f: number; precip_chance_pct: number; wind_mph_max: number; sunrise_local: string; sunset_local: string }>
      : [];

    if (forecastDaily.length === 0) {
      return new Response(
        JSON.stringify({ error: "missing_forecast_data", message: "forecast_daily is required for weekly_overview mode" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    // Run engine once for today (use freshwater as default for inland, saltwater for coastal)
    const todayWaterType: WaterType = isCoastal ? "saltwater" : "freshwater";
    let todayEngine: ReturnType<typeof runCoreIntelligence>;
    try {
      todayEngine = runCoreIntelligence(engineSnapshot, todayWaterType);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "engine_error", message: String(e) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    const weeklyResult = buildWeeklyOverviewResponse(
      todayEngine, forecastDaily, todayWaterType, lat, timestampUtc
    );

    const weeklyBundle = {
      feature: "hows_fishing_feature_v1",
      mode: "weekly_overview" as const,
      water_type: todayWaterType,
      generated_at: timestampUtc,
      is_coastal: isCoastal,
      forecast_days: weeklyResult.forecast_days,
      today: {
        daily_score: weeklyResult.today_summary.daily_score,
        overall_rating: weeklyResult.today_summary.overall_rating,
        summary_line: weeklyResult.today_summary.summary_line,
        environment: todayEngine.environment,
        alerts: todayEngine.alerts,
        fishable_hours: todayEngine.daily_outlook.fishable_hours,
      },
    };

    // Log usage (zero cost — no LLM)
    await supabase.from("ai_sessions").insert({
      user_id: userId,
      session_type: "fishing_weekly",
      input_payload: { latitude: lat, longitude: lon, units, mode: "weekly_overview" },
      response_payload: weeklyBundle,
      token_cost_usd: 0,
    });

    return new Response(JSON.stringify(weeklyBundle), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
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
    input_tokens?: number;
    output_tokens?: number;
    token_cost_usd?: number;
  }

  let reports: Record<string, ReportEntry>;
  let mode: "single" | "coastal_multi" | "inland_dual";
  let failedReports: string[] = [];

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
    const tokenCostUsd = computeCallCost(inputTokens, outputTokens);

    if (llmError || !llm) {
      // LLM failed — generate deterministic fallback instead of returning error
      const fallbackLlm = generateDeterministicFallback(engineOutput, waterType);
      return {
        status: "ok",
        water_type: waterType,
        engine: engineOutput,
        llm: fallbackLlm,
        error: null,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        token_cost_usd: tokenCostUsd,
      };
    }

    return {
      status: "ok",
      water_type: waterType,
      engine: engineOutput,
      llm,
      error: null,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      token_cost_usd: tokenCostUsd,
    };
  }

  async function runReportForWaterTypeWithSnapshot(
    snapshot: typeof engineSnapshot,
    waterType: WaterType,
    subtypeLabel: string
  ): Promise<ReportEntry> {
    let engineOutput: ReturnType<typeof runCoreIntelligence>;
    try {
      engineOutput = runCoreIntelligence(snapshot, waterType);
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
    // Add subtype label to payload for LLM context
    (llmPayload as Record<string, unknown>).freshwater_subtype_label = subtypeLabel;

    // Use river-specific prompt for river tabs
    const systemPrompt = subtypeLabel === "river" ? RIVER_SYSTEM_PROMPT : undefined;

    const { llm, inputTokens, outputTokens, error: llmError } = await callClaudeForReport(
      anthropicKey,
      llmPayload,
      systemPrompt
    );
    totalInputTokens += inputTokens;
    totalOutputTokens += outputTokens;
    const tokenCostUsd = computeCallCost(inputTokens, outputTokens);

    if (llmError || !llm) {
      // LLM failed — generate deterministic fallback (Change 3.6)
      const fallbackLlm = generateDeterministicFallback(engineOutput, subtypeLabel);
      return {
        status: "ok",
        water_type: waterType,
        engine: engineOutput,
        llm: fallbackLlm,
        error: null,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        token_cost_usd: tokenCostUsd,
      };
    }

    return {
      status: "ok",
      water_type: waterType,
      engine: engineOutput,
      llm,
      error: null,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      token_cost_usd: tokenCostUsd,
    };
  }

  if (isCoastal) {
    mode = "coastal_multi";
    // Section 5B/5C — three parallel runs for coastal
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
    // Inland: run BOTH lake and river_stream in parallel
    mode = "inland_dual";

    // Create separate snapshots with different freshwater subtype hints
    const lakeSnapshot = { ...engineSnapshot, freshwater_subtype_hint: "lake" as const };
    const riverSnapshot = { ...engineSnapshot, freshwater_subtype_hint: "river_stream" as const };

    // Run both in parallel
    const [lakeResult, riverResult] = await Promise.all([
      runReportForWaterTypeWithSnapshot(lakeSnapshot, "freshwater", "lake"),
      runReportForWaterTypeWithSnapshot(riverSnapshot, "freshwater", "river_stream"),
    ]);

    reports = {
      freshwater_lake: lakeResult,
      freshwater_river: riverResult,
    };

    for (const [key, r] of Object.entries(reports)) {
      if (r.status === "error") failedReports.push(key);
    }
  }

  // --- 8. Calculate actual cost and log usage ---
  const actualCostUsd = computeCallCost(totalInputTokens, totalOutputTokens);
  const cacheExpiresAt = new Date(Date.now() + 45 * 60 * 1000).toISOString();

  // Build response bundle (Section 8)
  const responseBundle = {
    feature: "hows_fishing_feature_v1",
    mode,
    default_tab: mode === "inland_dual" ? "freshwater_lake" : "freshwater",
    generated_at: timestampUtc,
    cache_expires_at: cacheExpiresAt,
    freshwater_subtype: freshwaterSubtype,
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
                fair_windows: r.engine.fair_windows ?? [],
                worst_windows: r.engine.worst_windows,
                daily_outlook: r.engine.daily_outlook,
                all_blocks: r.engine.all_blocks,
              }
            : null,
          llm: r.llm,
          error: r.error,
          ...(r.input_tokens !== undefined && r.output_tokens !== undefined && r.token_cost_usd !== undefined
            ? {
                usage: {
                  input_tokens: r.input_tokens,
                  output_tokens: r.output_tokens,
                  token_cost_usd: r.token_cost_usd,
                },
              }
            : {}),
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
