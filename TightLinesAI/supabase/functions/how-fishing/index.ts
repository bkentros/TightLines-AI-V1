/**
 * how-fishing — Supabase Edge Function
 *
 * Daily path (V3):
 *   1. Auth + subscription + usage cap validation
 *   2. Parse and validate confirmed environment_mode from request
 *   3. Accept env_data from client (client pre-fetches environment)
 *   4. Run V3 engine: normalize → geo → score → windows → narration payload
 *   5. Build Claude payload from V3 narration payload
 *   6. Call Claude once for narrative (or deterministic fallback if unavailable)
 *   7. Shape V3 output to frontend EngineOutput contract
 *   8. Return bundle with reports keyed by environment_mode
 *
 * Weekly overview path:
 *   - Lightweight deterministic forecast scoring only
 *   - Uses environment_mode for context
 *   - No LLM call
 *
 * Retained for compatibility (frontend consumes these):
 *   - feature: 'hows_fishing_feature_v2'
 *   - reports[environmentMode] shape with engine.v2_drivers, v2_suppressors, etc.
 *   - context.seasonal_state (null; V3 does not compute it)
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  normalizeEnvironmentV3,
  resolveGeoContextV3,
  runScoreEngineV3,
  runWindowEngineV3,
  buildNarrationPayloadV3,
  shapeV3ToEngineOutput,
  type NarrationPayloadV3,
} from "../_shared/engineV3/index.ts";
import type {
  EnvironmentMode,
  WaterType,
  FreshwaterSubtype,
} from "../_shared/engineV2/types/contracts.ts";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const USAGE_CAP_ANGLER_USD = 1;
const USAGE_CAP_MASTER_ANGLER_USD = 3;
const ESTIMATED_COST_PER_CALL_USD = 0.006; // Single Claude call estimate
const CLAUDE_MODEL = "claude-haiku-4-5";
const CLAUDE_INPUT_COST_PER_M = 1;
const CLAUDE_OUTPUT_COST_PER_M = 5;

// ---------------------------------------------------------------------------
// Valid values for request parsing
// ---------------------------------------------------------------------------

const VALID_ENVIRONMENT_MODES = [
  "freshwater_lake",
  "freshwater_river",
  "brackish",
  "saltwater",
] as const;

const VALID_WATER_TYPES = ["freshwater", "brackish", "saltwater"] as const;
const VALID_FRESHWATER_SUBTYPES = ["lake", "river_stream", "reservoir"] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function locationLocalMidnightIso(timezone: string, now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((p) => [p.type, p.value])
  );
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);
  const hh = Number(parts.hour);
  const mm = Number(parts.minute);
  const ss = Number(parts.second);
  const localNowUtcMillis = Date.UTC(y, m - 1, d, hh, mm, ss);
  const offsetMillis = localNowUtcMillis - now.getTime();
  const nextLocalMidnightUtcMillis = Date.UTC(y, m - 1, d + 1, 0, 0, 0) - offsetMillis;
  return new Date(nextLocalMidnightUtcMillis).toISOString();
}

function timezoneAbbreviation(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
      hour: "numeric",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? timezone;
  } catch {
    return timezone;
  }
}

function formatTimeForDisplay(raw: string): string {
  const match = raw.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return raw.trim();
  const hour24 = Number(match[1]);
  const minute = match[2];
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute} ${suffix}`;
}

function normalizeTimeRange(value: string, timezone: string): string {
  const trimmed = value.replace(/\s+/g, " ").trim();
  const rangeMatch = trimmed.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  const zone = timezoneAbbreviation(timezone);
  if (rangeMatch) {
    return `${formatTimeForDisplay(rangeMatch[1])} – ${formatTimeForDisplay(rangeMatch[2])} ${zone}`;
  }
  const singleMatch = trimmed.match(/^(\d{1,2}:\d{2})$/);
  if (singleMatch) return `${formatTimeForDisplay(singleMatch[1])} ${zone}`;
  return trimmed;
}

function truncateWords(value: string, maxWords: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const words = normalized.split(" ");
  return words.length <= maxWords ? normalized : words.slice(0, maxWords).join(" ").trim();
}

function sanitizeTopLevelText(value: unknown, maxWords: number): string {
  return typeof value === "string" ? truncateWords(value, maxWords) : "";
}

// ---------------------------------------------------------------------------
// System prompts — V2 engine narrates from structured payload
// Updated in Phase 7 to use timingNarrationHint, tide/temp approved facts,
// and stronger guidance for each environment mode.
// ---------------------------------------------------------------------------

const HOW_FISHING_SYSTEM_PROMPT = `You are the user's fishing buddy — the friend who's already been on the water this morning and is giving them the honest scoop before they head out. You're knowledgeable but never preachy. You talk about fish like they're critters with habits, not data points.

Core rules:
- The engine numbers are FINAL. Never recalculate or contradict the score, time windows, or alerts.
- Be straight with them. Great day? Get them fired up. Tough day? Tell them honestly, but keep it encouraging — there's always a way to scratch out a bite.
- Explain why fish will or won't be cooperating in plain, relatable terms — think campfire conversation, not weather channel.
- Keep it tight. A quick glance should tell them everything they need.
- Front-load the answer: first tell them how good today is, when to go, and one practical adjustment.
- Don't repeat the same point across headline, rating summary, and tips. Each field should add something new.
- Never suggest specific lures, species, or tactics — you don't know what they're targeting.
- Use exactly the time windows the engine provides. Never invent your own.
- NEVER combine separate windows into one span that crosses midnight. Each window is for TODAY only (12:00 AM to 11:59 PM). If the engine gives you two poor windows (e.g., "6:00 PM – 11:45 PM" and "12:00 AM – 5:30 AM"), present them as separate periods — do NOT combine them as "6:00 PM – 5:30 AM".
- All windows must stay within today's calendar date. Do not reference times for tomorrow.

Using the structured engine payload:
- The payload includes top_drivers and suppressors — translate these directly into your reasoning.
- timing_narration_hint tells you what period to emphasize. Use it.
- pressure_state_summary explains the pressure story. Use it — don't just say "pressure is good."
- If claim_guard_active is true: follow claim_guard_instructions. Soften biological claims. Say "conditions suggest" not "fish are definitely."
- If severe_suppression is true: START your headline with a safety-first warning.
- V3: Freshwater has no measured water temp. Use air temp and conditions only. Never state water temp as fact for freshwater.

Freshwater lake framing:
- Dawn and dusk windows are your go-to anchors.
- Air temp and conditions matter — warming trend = rising activity potential, cooling = still good, heat stress = tell them to go early.
- Stable pressure for a few days = fish have settled into a pattern. Mention it.
- Post-front = fish are uncomfortable, even if weather looks nice.
- V3: No measured water temp for freshwater. Use air temp and conditions only.

Voice & language:
- Write in second person — "you'll want to…", "your best shot is…"
- Short punchy sentences. Contractions are good. "Fish aren't moving much" > "Fish are not exhibiting significant activity."
- BANNED words: "cold-stunned" (freshwater), "peak water temp", "meteorological", "thermocline", "lethargic" (say "sluggish"), "suppressed" (say "slow" or "shut down"), "biological", "solunar" (say "feeding window" or "feeding cycle"), "barometric" (say "pressure"), "thermal stress" (say "too hot" or "heat stress"), "optimal" (say "sweet spot" or "comfortable range"), "suboptimal", "conditions are presenting", "anglers should note".
- Temperature references: use air temp for freshwater. Never state water temp as measured for freshwater.
- Don't tell them to "check" or "monitor" anything. You're giving them THE answer.

Strategy section — think like a guide:
- presentation_speed: How should they work their bait/lure?
- depth_focus: Where are fish sitting?
- approach_note: One tactical sentence. What would YOU do right now?

Length limits:
- headline_summary: exactly 1 sentence, max 20 words
- overall_fishing_rating.summary: 1 sentence, max 24 words
- best_times_to_fish_today: max 2 items, reasoning max 16 words each
- worst_times_to_fish_today: max 2 items, reasoning max 16 words each
- decent_times_today: max 2 items, reasoning max 16 words each
- key_factors values: short phrases, max 16 words each — top 3-5 drivers only
- tips_for_today: exactly 3 tips, max 12 words each
- strategy.presentation_speed: max 8 words
- strategy.depth_focus: max 10 words
- strategy.approach_note: 1 sentence, max 20 words

Output valid JSON only matching this schema:
{
  "headline_summary": "string",
  "overall_fishing_rating": { "label": "Poor | Fair | Good | Great", "summary": "string" },
  "best_times_to_fish_today": [{ "time_range": "string", "label": "PRIME | GOOD", "reasoning": "string" }],
  "decent_times_today": [{ "time_range": "string", "reasoning": "string" }],
  "worst_times_to_fish_today": [{ "time_range": "string", "reasoning": "string" }],
  "key_factors": {
    "barometric_pressure": "string",
    "temperature_trend": "string",
    "light_conditions": "string",
    "tide_or_solunar": "string",
    "moon_phase": "string",
    "wind": "string",
    "precipitation_recent_rain": "string"
  },
  "tips_for_today": ["string", "string", "string"],
  "strategy": { "presentation_speed": "string", "depth_focus": "string", "approach_note": "string" }
}`;

const RIVER_SYSTEM_PROMPT = `You are the user's fishing buddy who knows rivers inside and out. Think current, structure, and flow.

Core rules:
- Engine numbers are FINAL.
- RIVER-SPECIFIC — always think: eddies, seams, tailouts, pools, cut banks, slack pockets.
- Never suggest specific lures, species, or tactics.
- Use exactly the time windows provided. Never invent your own.
- If severe_suppression is true: safety warning FIRST.

Using the structured engine payload:
- timing_narration_hint tells you when flow and light align best. Use it.
- suppressors may include runoff or thermal suppression — describe them in river terms.
- top_drivers may include warming trend, dawn window — lead with whichever is strongest.
- If claim_guard_active is true: soften biological claims. Follow claim_guard_instructions.
- V3: No measured flow or water temp for rivers. Do not imply measured flow — only precipitation effects.
- Air temp and conditions matter — warming = better; recent cold front = fish uncomfortable.

River framing:
- Mention runoff or recent rain when in suppressors — affects clarity and conditions.
- Dawn and early-morning windows in rivers are often the safest bite windows — mention if they're best.
- Heat stress in rivers = fish pushed to deeper pools and cooler tributaries — be honest about midday difficulty.
- Do not imply measured flow or current — only precipitation/runoff effects when present.

Voice: second person, short punchy sentences. Same banned words as standard prompt.

Length limits — same as standard prompt.
Output valid JSON only — same schema as standard prompt.`;

const SALTWATER_SYSTEM_PROMPT = `You are the user's saltwater fishing buddy — honest, sharp, tuned into tides and current.

Core rules:
- Engine numbers are FINAL. Use only the provided time windows.
- If severe_suppression is true: safety warning FIRST.
- TIDES AND CURRENT COME FIRST — this is saltwater. Movement matters more than most other variables.
- Never suggest specific lures, species, or tactics.

Using the structured engine payload:
- tide_state_summary tells you the current tidal stage. Lead with it when it's strong or weak.
- timing_narration_hint tells you when moving water aligns with other windows. Use it in reasoning.
- top_drivers will often include tide/current labels — translate to "moving water" language, not "solunar."
- suppressors like dead_slack_water, dangerous wind, or heavy runoff should be explained plainly.
- If claim_guard_active is true: soften biological claims.
- pressure_state_summary: use it to explain why fish may or may not be actively feeding.
- If water_temp_is_estimated is false and temp is available: you can reference actual water temp.

Saltwater framing: speak to bays, inlets, flats, passes, nearshore structure. Say "feeding window" or "moving water" not "solunar." Say "pressure" not "barometric."
Use 12-hour local time with timezone abbreviation for all time ranges.

Voice: second person, punchy, practical. Same banned words as standard prompt.
Length limits — same as standard prompt.
Output valid JSON only — same schema, label values Poor | Fair | Good | Great.`;

const BRACKISH_SYSTEM_PROMPT = `You are the user's brackish-water fishing buddy — focused on tides, salinity, and moving water in estuaries, marsh drains, and tidal creeks.

Core rules:
- Engine numbers are FINAL. Use only the provided time windows.
- If severe_suppression is true: safety warning FIRST.
- MOVEMENT IS THE MAIN STORY in brackish water. Tide state and water movement dominate.
- Never suggest specific lures, species, or tactics.

Using the structured engine payload:
- tide_state_summary tells you the tidal stage — this is your lead story when significant.
- timing_narration_hint gives you the best window alignment — use it.
- top_drivers: tide/current labels → describe as "moving water" in the marsh system.
- suppressors: heavy rain/runoff in brackish systems often means salinity disruption and reduced clarity. Mention it if present.
- If claim_guard_active is true: soften biological claims.
- If water_temp_is_estimated is false: you can reference actual water temp.
- pressure_state_summary: use to explain fish comfort/discomfort in the system.

Brackish framing: estuaries, mangroves, oyster edges, back bays, tidal creeks. Emphasize moving water and when it's most useful in the current tidal cycle.
Use 12-hour local time with timezone abbreviation for all time ranges.

Voice: second person, punchy, practical. Same banned words as standard prompt.
Length limits — same as standard prompt.
Output valid JSON only — same schema, label values Poor | Fair | Good | Great.`;

// ---------------------------------------------------------------------------
// Select system prompt by environment mode
// ---------------------------------------------------------------------------

function selectSystemPrompt(mode: EnvironmentMode): string {
  switch (mode) {
    case "freshwater_river": return RIVER_SYSTEM_PROMPT;
    case "saltwater":        return SALTWATER_SYSTEM_PROMPT;
    case "brackish":         return BRACKISH_SYSTEM_PROMPT;
    default:                 return HOW_FISHING_SYSTEM_PROMPT;
  }
}

// ---------------------------------------------------------------------------
// LLM output types (internal — what Claude returns)
// ---------------------------------------------------------------------------

interface LLMStrategy {
  presentation_speed: string;
  depth_focus: string;
  approach_note: string;
}

interface LLMOutput {
  headline_summary: string;
  overall_fishing_rating: { label: string; summary: string };
  best_times_to_fish_today: Array<{ time_range: string; label: string; reasoning: string }>;
  decent_times_today?: Array<{ time_range: string; reasoning: string }>;
  worst_times_to_fish_today: Array<{ time_range: string; reasoning: string }>;
  key_factors: Record<string, string>;
  tips_for_today: string[];
  strategy?: LLMStrategy;
}

// ---------------------------------------------------------------------------
// LLM output sanitizers — preserved from V1, unchanged
// ---------------------------------------------------------------------------

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
    barometric_pressure: readString("barometric_pressure", "pressure"),
    temperature_trend: readString("temperature_trend", "temp_trend"),
    light_conditions: readString("light_conditions", "light"),
    tide_or_solunar: readString("tide_or_solunar", "tide", "solunar"),
    moon_phase: readString("moon_phase", "moon"),
    wind: readString("wind", "wind_conditions"),
    precipitation_recent_rain: readString("precipitation_recent_rain", "precipitation", "recent_rain"),
  };
}

function sanitizeKeyFactorMap(input: unknown): Record<string, string> {
  const normalized = normalizeKeyFactors(input);
  return Object.fromEntries(
    Object.entries(normalized).map(([key, value]) => [key, truncateWords(value, 18)])
  );
}

function sanitizeBestTimes(input: unknown, timezone: string): LLMOutput["best_times_to_fish_today"] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .slice(0, 2)
    .map((item) => ({
      time_range: normalizeTimeRange(sanitizeTopLevelText(item.time_range, 8), timezone),
      label: item.label === "PRIME" ? "PRIME" : "GOOD",
      reasoning: sanitizeTopLevelText(item.reasoning, 18),
    }))
    .filter((item) => item.time_range.length > 0 && item.reasoning.length > 0);
}

function sanitizeWorstTimes(input: unknown, timezone: string): LLMOutput["worst_times_to_fish_today"] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .slice(0, 2)
    .map((item) => ({
      time_range: normalizeTimeRange(sanitizeTopLevelText(item.time_range, 8), timezone),
      reasoning: sanitizeTopLevelText(item.reasoning, 18),
    }))
    .filter((item) => item.time_range.length > 0 && item.reasoning.length > 0);
}

function sanitizeDecentTimes(input: unknown, timezone: string): Array<{ time_range: string; reasoning: string }> {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .slice(0, 2)
    .map((item) => ({
      time_range: normalizeTimeRange(sanitizeTopLevelText(item.time_range, 8), timezone),
      reasoning: sanitizeTopLevelText(item.reasoning, 18),
    }))
    .filter((item) => item.time_range.length > 0 && item.reasoning.length > 0);
}

function sanitizeTips(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((v): v is string => typeof v === "string")
    .slice(0, 3)
    .map((v) => truncateWords(v, 12))
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Claude call helper — preserved from V1, unchanged
// ---------------------------------------------------------------------------

interface ClaudeCallResult {
  llm: LLMOutput | null;
  inputTokens: number;
  outputTokens: number;
  error: string | null;
}

async function callClaudeForReport(
  anthropicKey: string,
  enginePayload: Record<string, unknown>,
  timezone: string,
  systemPrompt: string
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
        max_tokens: 1024,
        system: systemPrompt,
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
      const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      const parsed = JSON.parse(cleaned) as Record<string, unknown>;
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
      const rawStrategy = parsed.strategy as Record<string, unknown> | undefined;
      const strategy: LLMStrategy | undefined = rawStrategy && typeof rawStrategy === "object"
        ? {
            presentation_speed: truncateWords(typeof rawStrategy.presentation_speed === "string" ? rawStrategy.presentation_speed : "", 8),
            depth_focus: truncateWords(typeof rawStrategy.depth_focus === "string" ? rawStrategy.depth_focus : "", 10),
            approach_note: truncateWords(typeof rawStrategy.approach_note === "string" ? rawStrategy.approach_note : "", 22),
          }
        : undefined;
      return {
        headline_summary: sanitizeTopLevelText(parsed.headline_summary, 22),
        overall_fishing_rating: {
          label: sanitizeTopLevelText(overall.label, 2),
          summary: sanitizeTopLevelText(overall.summary, 26),
        },
        best_times_to_fish_today: sanitizeBestTimes(parsed.best_times_to_fish_today, timezone),
        decent_times_today: sanitizeDecentTimes(parsed.decent_times_today, timezone),
        worst_times_to_fish_today: sanitizeWorstTimes(parsed.worst_times_to_fish_today, timezone),
        key_factors: sanitizeKeyFactorMap(parsed.key_factors),
        tips_for_today: sanitizeTips(parsed.tips_for_today),
        strategy,
      };
    } catch {
      return null;
    }
  }

  const attempt1 = await attemptCall();
  if (attempt1) {
    const parsed = parseLLMOutput(attempt1.text);
    if (parsed) return { llm: parsed, inputTokens: attempt1.inputTokens, outputTokens: attempt1.outputTokens, error: null };
  }

  const attempt2 = await attemptCall();
  if (attempt2) {
    const parsed = parseLLMOutput(attempt2.text);
    if (parsed) return { llm: parsed, inputTokens: attempt2.inputTokens, outputTokens: attempt2.outputTokens, error: null };
    return { llm: null, inputTokens: attempt2.inputTokens, outputTokens: attempt2.outputTokens, error: "malformed_response" };
  }

  return { llm: null, inputTokens: 0, outputTokens: 0, error: "claude_unavailable" };
}

// ---------------------------------------------------------------------------
// V3 Claude payload — from NarrationPayloadV3 only. No inferred freshwater temp.
// ---------------------------------------------------------------------------

function buildClaudePayloadFromV3(
  payload: NarrationPayloadV3,
  analysisDateLocal: string,
  currentTimeLocal: string,
  timezone: string
): Record<string, unknown> {
  const facts = payload.approvedFacts;
  return {
    environment_mode: payload.environmentMode,
    region: payload.region,
    seasonal_state: null,

    score: payload.score,
    score_band: payload.scoreBand,
    confidence: payload.confidence,

    best_windows: payload.bestWindows.map((w) => ({
      time_range: normalizeTimeRange(`${w.startLocal} – ${w.endLocal}`, timezone),
      score: w.score,
      drivers: w.reasons,
    })),
    fair_windows: payload.fairWindows.map((w) => ({
      time_range: normalizeTimeRange(`${w.startLocal} – ${w.endLocal}`, timezone),
      score: w.score,
    })),
    poor_windows: payload.poorWindows.map((w) => ({
      time_range: normalizeTimeRange(`${w.startLocal} – ${w.endLocal}`, timezone),
    })),

    top_drivers: payload.topDrivers,
    suppressors: payload.topSuppressors,
    severe_suppression: payload.severeSuppression,
    severe_suppression_reasons: payload.severeSuppressionReasons,

    activity_state: null,
    feeding_readiness: null,
    broad_positioning_tendency: null,
    presentation_speed_bias: null,

    claim_guard_active: payload.claimGuardActive,
    claim_guard_instructions: payload.claimGuardInstructions,
    data_quality_notes: payload.dataCoverageSummary,
    water_temp_is_estimated: false,

    air_temp_f: facts.airTempF,
    water_temp_f: facts.coastalWaterTempF,
    water_temp_source: facts.waterTempIsMeasured ? "measured_coastal" : "unavailable",
    wind_speed_mph: facts.windSpeedMph,
    pressure_state_summary: facts.pressureStateSummary,
    moon_phase: facts.moonPhase,
    precip_summary: facts.precipSummary,
    tide_state_summary: facts.tideStateSummary ?? null,
    timing_narration_hint: payload.timingNarrationHint ?? null,

    key_reasons_for_best: payload.keyReasonsForBest,
    key_reasons_for_poor: payload.keyReasonsForPoor,
    regime_limited: payload.regimeLimited,
    tide_overlap_major_factor: payload.tideOverlapMajorFactor,

    historical_context_flags: payload.historicalContextFlags,
    relative_to_normal_notes: payload.relativeToNormalNotes,

    analysis_date_local: analysisDateLocal,
    current_time_local: currentTimeLocal,
    timezone,
  };
}

// ---------------------------------------------------------------------------
// Deterministic fallback — generates LLM-shaped output from V3 narration payload.
// Called when Claude is unavailable or returns malformed responses.
// ---------------------------------------------------------------------------

function generateDeterministicFallbackV3(
  payload: NarrationPayloadV3,
  timezone: string
): LLMOutput {
  const score = payload.score;
  const scoreBand = payload.scoreBand;

  let headline: string;
  if (payload.severeSuppression) {
    const reason = payload.severeSuppressionReasons[0] ?? "tough conditions";
    headline = `Stay safe — ${reason}. Fishing is possible but conditions are difficult.`;
  } else if (score >= 75) {
    headline = `${scoreBand} day — conditions are stacking up nicely, get out there.`;
  } else if (score >= 55) {
    headline = `Solid ${scoreBand.toLowerCase()} day — hit the right windows and you'll find fish.`;
  } else if (score >= 35) {
    headline = `${scoreBand} day — fish are around but not in a rush to bite.`;
  } else {
    headline = "Tough one today — conditions are working against you.";
  }

  let ratingSummary: string;
  if (score >= 75) ratingSummary = "Multiple factors lining up — this is a day worth getting out for.";
  else if (score >= 55) ratingSummary = "Solid conditions with a few limiting factors. Target the best windows.";
  else if (score >= 35) ratingSummary = "Mixed bag today — patience and timing will make the difference.";
  else ratingSummary = "Difficult conditions — go slow, downsize, and target sheltered structure.";

  const bestTimes = payload.bestWindows.slice(0, 2).map((w) => ({
    time_range: normalizeTimeRange(`${w.startLocal} – ${w.endLocal}`, timezone),
    label: "PRIME" as const,
    reasoning: w.reasons.length > 0 ? w.reasons.slice(0, 2).join(" + ").replace(/_/g, " ") : "Best available window",
  }));

  const worstTimes = payload.poorWindows.slice(0, 2).map((w) => ({
    time_range: normalizeTimeRange(`${w.startLocal} – ${w.endLocal}`, timezone),
    reasoning: "Lowest activity period",
  }));

  const decentTimes = payload.fairWindows.slice(0, 2).map((w) => ({
    time_range: normalizeTimeRange(`${w.startLocal} – ${w.endLocal}`, timezone),
    reasoning: w.reasons.length > 0 ? w.reasons.slice(0, 2).join(", ").replace(/_/g, " ") : "Fair conditions",
  }));

  const mode = payload.environmentMode;
  const isFreshwater = mode === "freshwater_lake" || mode === "freshwater_river";

  const keyFactors: Record<string, string> = {
    barometric_pressure: payload.topSuppressors.find((s) => s.includes("pressure")) ?? "Stable",
    temperature_trend: isFreshwater ? "Air temp trend (no water temp measured)" : "Water temp conditions",
    light_conditions: payload.topDrivers.find((d) => d.includes("overcast") || d.includes("cloud"))
      ? "Overcast extends activity windows"
      : "Check prime windows above for best light",
    wind: payload.approvedFacts.windSpeedMph != null ? `${payload.approvedFacts.windSpeedMph} mph` : "Data unavailable",
    precipitation_recent_rain: payload.approvedFacts.precipSummary ?? "Check local conditions",
  };

  if (!isFreshwater) {
    keyFactors.tide_or_solunar = payload.tideOverlapMajorFactor ? "Moving water improves main window" : "Feeding windows above";
  }
  if (score >= 40) {
    keyFactors.moon_phase = payload.approvedFacts.moonPhase ?? "Data unavailable";
  }

  const tips: string[] = [];
  if (score < 35) tips.push("Fish are sluggish — go slow and stay near bottom");
  else if (score >= 75) tips.push("They're fired up — cover water and keep moving");
  else tips.push("Match your pace to today's moderate activity level");

  tips.push("Work structure edges and depth transitions");

  if (payload.severeSuppression) {
    tips.push("Tough conditions — downsize, slow way down, target sheltered spots");
  } else if (score >= 55) {
    tips.push("Your best shot is during the prime feeding windows above");
  } else {
    tips.push("Patience is key today — let the fish come to you");
  }

  const truncatedTips = tips.slice(0, 3).map((t) => {
    const words = t.split(" ");
    return words.length > 12 ? words.slice(0, 12).join(" ") : t;
  });

  let presentationSpeed: string;
  let depthFocus: string;
  let approachNote: string;

  if (score < 35) {
    presentationSpeed = "Slow and deliberate";
    depthFocus = "Deep — bottom near structure";
  } else if (score >= 75) {
    presentationSpeed = "Aggressive — cover water fast";
    depthFocus = "Shallow feeding edges";
  } else {
    presentationSpeed = "Normal retrieve, moderate pace";
    depthFocus = "Mid-column near structure";
  }

  if (payload.severeSuppression) {
    approachNote = "Severe conditions — stay safe and fish cautiously near sheltered structure.";
  } else if (score >= 75) {
    approachNote = "Conditions are stacked in your favor — fish the prime windows hard.";
  } else if (score >= 55) {
    approachNote = "Decent setup today — time your windows and you'll get bites.";
  } else {
    approachNote = "Tough bite — slow down, downsize, and focus on the best windows.";
  }

  return {
    headline_summary: headline,
    overall_fishing_rating: { label: scoreBand, summary: ratingSummary },
    best_times_to_fish_today: bestTimes,
    decent_times_today: decentTimes,
    worst_times_to_fish_today: worstTimes,
    key_factors: keyFactors,
    tips_for_today: truncatedTips,
    strategy: { presentation_speed: presentationSpeed, depth_focus: depthFocus, approach_note: approachNote },
  };
}

// ---------------------------------------------------------------------------
// Weekly overview — lightweight deterministic forecast scoring.
// Uses environment_mode for context. No V3 engine; no LLM.
// ---------------------------------------------------------------------------

type OverallRatingLegacy = "Exceptional" | "Excellent" | "Good" | "Fair" | "Poor" | "Tough";

function getOverallRatingFromScore(score: number): OverallRatingLegacy {
  if (score >= 88) return "Exceptional";
  if (score >= 72) return "Excellent";
  if (score >= 55) return "Good";
  if (score >= 38) return "Fair";
  if (score >= 20) return "Poor";
  return "Tough";
}

interface ForecastDayData {
  date: string;
  high_temp_f: number;
  low_temp_f: number;
  precip_chance_pct: number;
  wind_mph_max: number;
  sunrise_local: string;
  sunset_local: string;
}

function scoreForecastDay(
  day: ForecastDayData,
  mode: EnvironmentMode
): {
  date: string;
  daily_score: number;
  overall_rating: OverallRatingLegacy;
  summary_line: string;
  high_temp_f: number;
  low_temp_f: number;
  wind_mph_avg: number;
  precip_chance_pct: number;
  front_label: null;
} {
  let score = 50;
  const avgTemp = (day.high_temp_f + day.low_temp_f) / 2;
  const isFreshwater = mode === "freshwater_lake" || mode === "freshwater_river";
  const isCoastal = mode === "saltwater" || mode === "brackish";

  // Thermal scoring — V2-aligned bands
  if (isFreshwater) {
    // Standard freshwater band: comfortLow=50, peakLow=60, peakHigh=72, heatStressFloor=84, severeHeatFloor=90
    if (avgTemp >= 60 && avgTemp <= 72) score += 18;       // peak comfort
    else if (avgTemp >= 50 && avgTemp <= 84) score += 8;   // comfortable/warm
    else if (avgTemp >= 40 && avgTemp < 50) score += 0;    // cool, neutral
    else if (avgTemp >= 84 && avgTemp < 90) score -= 8;    // heat stress
    else if (avgTemp >= 90) score -= 20;                   // severe heat
    else if (avgTemp < 40) score -= 15;                    // cold stress
  } else if (isCoastal) {
    // Coastal band: comfortLow=55, peakLow=65, peakHigh=80, heatStressFloor=87, severeHeatFloor=92
    if (avgTemp >= 65 && avgTemp <= 80) score += 15;       // peak comfort
    else if (avgTemp >= 55 && avgTemp <= 87) score += 6;   // comfortable
    else if (avgTemp >= 87 && avgTemp < 92) score -= 6;    // heat stress
    else if (avgTemp >= 92) score -= 18;                   // severe heat
    else if (avgTemp < 45) score -= 12;                    // cold stress
  }

  // Precipitation scoring
  if (day.precip_chance_pct < 20) score += 6;
  else if (day.precip_chance_pct < 40) score += 3;
  else if (day.precip_chance_pct < 65) score -= 5;
  else score -= 14;

  // Wind scoring — V2-aligned thresholds
  const windStrong = isCoastal ? 25 : 28; // saltwater more sensitive (V2-aligned)
  const windHeavy = isCoastal ? 18 : 22;
  if (day.wind_mph_max <= 10) score += 8;
  else if (day.wind_mph_max <= windHeavy) score += 2;
  else if (day.wind_mph_max <= windStrong) score -= 8;
  else score -= 18;

  // Daylight context
  const sunriseMin = parseInt(day.sunrise_local.split(":")[0]) * 60 + parseInt(day.sunrise_local.split(":")[1]);
  const sunsetMin = parseInt(day.sunset_local.split(":")[0]) * 60 + parseInt(day.sunset_local.split(":")[1]);
  const daylightHours = (sunsetMin - sunriseMin) / 60;
  if (daylightHours >= 13) score += 3;
  else if (daylightHours >= 11) score += 1;
  else if (daylightHours < 9) score -= 2;

  score = Math.max(0, Math.min(100, score));
  const rating = getOverallRatingFromScore(score);

  // Summary line
  let summaryLine: string;
  if (score >= 72) summaryLine = `Strong conditions — high ${day.high_temp_f}°F, light wind.`;
  else if (score >= 55) summaryLine = `Good day — ${day.precip_chance_pct > 40 ? "some rain possible but" : "conditions"} look favorable.`;
  else if (score >= 38) summaryLine = `Mixed — ${day.wind_mph_max > windStrong ? "windy" : day.precip_chance_pct > 60 ? "rain likely" : "average"}, target best windows.`;
  else summaryLine = `Tough — ${avgTemp < 40 ? "very cold" : avgTemp >= 90 ? "severe heat stress" : day.wind_mph_max > windStrong ? "high winds" : "unfavorable"} expected.`;

  return {
    date: day.date,
    daily_score: score,
    overall_rating: rating,
    summary_line: summaryLine,
    high_temp_f: day.high_temp_f,
    low_temp_f: day.low_temp_f,
    wind_mph_avg: Math.round(day.wind_mph_max * 0.65),
    precip_chance_pct: day.precip_chance_pct,
    front_label: null,
  };
}

// ---------------------------------------------------------------------------
// Derive timezone from raw env_data
// ---------------------------------------------------------------------------

function extractTimezone(envData: Record<string, unknown>): string {
  if (typeof envData.timezone === "string" && envData.timezone.length > 0) {
    return envData.timezone;
  }
  return "America/New_York";
}

// ---------------------------------------------------------------------------
// Format local date/time from UTC timestamp + timezone
// ---------------------------------------------------------------------------

function getLocalDateAndTime(utcIso: string, timezone: string): { date: string; time: string } {
  try {
    const d = new Date(utcIso);
    const dateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    }).format(d);
    const timeParts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone, hour: "numeric", minute: "2-digit", hour12: true,
    }).format(d);
    return { date: dateParts, time: `${timeParts} ${timezoneAbbreviation(timezone)}` };
  } catch {
    return { date: utcIso.slice(0, 10), time: "Unknown" };
  }
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
      status: 405, headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // ── 1. Auth ────────────────────────────────────────────────────────────────
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken || (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing authentication token" }), {
      status: 401, headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  const userId = user.id;

  // ── 2. Parse body ──────────────────────────────────────────────────────────
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // Coordinates
  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return new Response(JSON.stringify({ error: "Invalid latitude" }), {
      status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    return new Response(JSON.stringify({ error: "Invalid longitude" }), {
      status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const units = body.units === "metric" ? "metric" : "imperial";
  const requestMode = body.mode === "weekly_overview" ? "weekly_overview" : "daily_detail";

  // ── 3. Validate and resolve environment_mode ───────────────────────────────

  const rawMode = body.environment_mode as string | undefined;
  const rawWaterType = body.water_type as string | undefined;
  const rawFreshwaterSubtype = body.freshwater_subtype as string | undefined;

  // Validate environment_mode
  if (!rawMode || !VALID_ENVIRONMENT_MODES.includes(rawMode as EnvironmentMode)) {
    return new Response(
      JSON.stringify({
        error: "invalid_environment_mode",
        message: `environment_mode must be one of: ${VALID_ENVIRONMENT_MODES.join(", ")}`,
      }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }
  const environmentMode = rawMode as EnvironmentMode;

  // Derive water_type from mode
  function modeToWaterType(mode: EnvironmentMode): WaterType {
    if (mode === "freshwater_lake" || mode === "freshwater_river") return "freshwater";
    if (mode === "saltwater") return "saltwater";
    return "brackish";
  }
  const waterType: WaterType = modeToWaterType(environmentMode);

  // Validate water_type field consistency (warn only — mode is truth)
  if (rawWaterType && VALID_WATER_TYPES.includes(rawWaterType as WaterType) && rawWaterType !== waterType) {
    console.warn(`water_type mismatch: body says ${rawWaterType} but environment_mode ${environmentMode} implies ${waterType}. Using mode.`);
  }

  // Freshwater subtype — required for freshwater modes, must be null for others
  let freshwaterSubtype: FreshwaterSubtype | null = null;
  if (waterType === "freshwater") {
    const validSubtype = VALID_FRESHWATER_SUBTYPES.includes(rawFreshwaterSubtype as FreshwaterSubtype)
      ? (rawFreshwaterSubtype as FreshwaterSubtype)
      : null;
    // Derive from mode if not explicitly provided
    if (validSubtype) {
      freshwaterSubtype = validSubtype;
    } else {
      freshwaterSubtype = environmentMode === "freshwater_river" ? "river_stream" : "lake";
    }
  }

  const targetDate = typeof body.target_date === "string" ? body.target_date : null;

  // ── 4. Subscription tier check ─────────────────────────────────────────────
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

  // ── 5. Usage cap pre-check ─────────────────────────────────────────────────
  const cap = getUsageCapUsd(tier);
  const billingPeriod = new Date().toISOString().slice(0, 7);
  const { data: usageRow } = await supabase
    .from("usage_tracking")
    .select("id, total_cost_usd, call_count")
    .eq("user_id", userId)
    .eq("billing_period", billingPeriod)
    .maybeSingle();
  const currentCost = Number((usageRow as { total_cost_usd?: number } | null)?.total_cost_usd ?? 0);
  if (currentCost + ESTIMATED_COST_PER_CALL_USD > cap) {
    return new Response(
      JSON.stringify({
        error: "usage_cap_exceeded",
        message: "You've reached your monthly usage limit. Upgrade or wait for next billing period.",
      }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // ── 6. Validate env_data ───────────────────────────────────────────────────
  if (!body.env_data || typeof body.env_data !== "object") {
    return new Response(
      JSON.stringify({ error: "missing_env_data", message: "env_data is required in the request body" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }
  const envData = body.env_data as Record<string, unknown>;
  const timezone = extractTimezone(envData);
  const timestampUtc = new Date().toISOString();
  const { date: analysisDateLocal, time: currentTimeLocal } = getLocalDateAndTime(timestampUtc, timezone);

  // ── 7. Weekly overview mode ────────────────────────────────────────────────
  // Deterministic only — no LLM, no V2 engine call needed.
  // Uses environment_mode for context (V2 improvement over old water_type|auto).
  // Full V2 weekly rebuild deferred to a later phase.
  if (requestMode === "weekly_overview") {
    const forecastDaily = Array.isArray(envData.forecast_daily)
      ? envData.forecast_daily as ForecastDayData[]
      : [];
    if (forecastDaily.length === 0) {
      return new Response(
        JSON.stringify({ error: "missing_forecast_data", message: "forecast_daily required for weekly_overview" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    // Score today from first forecast entry baseline + future days
    const todayScore = 50; // V2 stub — will be replaced when full engine lands
    const todayEntry = forecastDaily[0];
    const todayForecast = {
      date: todayEntry?.date ?? timestampUtc.slice(0, 10),
      daily_score: todayScore,
      overall_rating: getOverallRatingFromScore(todayScore),
      summary_line: "Live conditions analyzed — see full report for details.",
      high_temp_f: todayEntry?.high_temp_f ?? 70,
      low_temp_f: todayEntry?.low_temp_f ?? 55,
      wind_mph_avg: Math.round((todayEntry?.wind_mph_max ?? 10) * 0.65),
      precip_chance_pct: todayEntry?.precip_chance_pct ?? 0,
      front_label: null,
    };
    const futureDays = forecastDaily.slice(1, 7).map((day) => scoreForecastDay(day, environmentMode));

    const weeklyBundle = {
      feature: "hows_fishing_feature_v1" as const,
      mode: "weekly_overview" as const,
      water_type: waterType,
      environment_mode: environmentMode,
      generated_at: timestampUtc,
      is_coastal: waterType !== "freshwater",
      forecast_days: [todayForecast, ...futureDays],
      today: {
        daily_score: todayScore,
        overall_rating: getOverallRatingFromScore(todayScore),
        summary_line: todayForecast.summary_line,
      },
    };

    await supabase.from("ai_sessions").insert({
      user_id: userId,
      session_type: "fishing_weekly",
      input_payload: { latitude: lat, longitude: lon, units, mode: "weekly_overview", environment_mode: environmentMode },
      response_payload: weeklyBundle,
      token_cost_usd: 0,
    });

    return new Response(JSON.stringify(weeklyBundle), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // ── 8. V3 daily path: normalize → geo → score → windows → narration ───────
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const waterTypeV3 = waterType as "freshwater" | "brackish" | "saltwater";
  const freshwaterSubtypeV3 = freshwaterSubtype as "lake" | "river_stream" | "reservoir" | null;

  const geoContext = resolveGeoContextV3({
    latitude: lat,
    longitude: lon,
    waterType: waterTypeV3,
    freshwaterSubtype: freshwaterSubtypeV3,
    environmentMode,
    targetDate,
  });

  const rawEnv = { ...envData, lat: (envData as Record<string, unknown>).lat ?? lat, lon: (envData as Record<string, unknown>).lon ?? lon } as Record<string, unknown>;
  const env = normalizeEnvironmentV3(rawEnv, geoContext);
  const scoreResult = runScoreEngineV3(env, geoContext);
  const windowResult = runWindowEngineV3(env, geoContext, scoreResult);
  const narrationPayload = buildNarrationPayloadV3(env, geoContext, scoreResult, windowResult, timezone);

  // ── 9. Build Claude payload and call LLM ────────────────────────────────────
  const claudePayload = buildClaudePayloadFromV3(narrationPayload, analysisDateLocal, currentTimeLocal, timezone);
  const systemPrompt = selectSystemPrompt(environmentMode);

  let llmOutput: LLMOutput;
  let inputTokens = 0;
  let outputTokens = 0;

  const claudeResult = await callClaudeForReport(anthropicKey, claudePayload, timezone, systemPrompt);
  inputTokens = claudeResult.inputTokens;
  outputTokens = claudeResult.outputTokens;

  if (claudeResult.llm) {
    llmOutput = claudeResult.llm;
  } else {
    llmOutput = generateDeterministicFallbackV3(narrationPayload, timezone);
  }

  // ── 11. Compute cost ────────────────────────────────────────────────────────
  const actualCostUsd = computeCallCost(inputTokens, outputTokens);

  // ── 12. Shape response ─────────────────────────────────────────────────────
  const cacheExpiresAt = locationLocalMidnightIso(timezone);

  // Compatibility: feature + reports shape for frontend. EngineOutput uses v2_*
  // field names for ReportView/EngineDriversPanel compatibility.
  const engineOutput = shapeV3ToEngineOutput(
    narrationPayload,
    lat,
    lon,
    timezone,
    environmentMode,
    freshwaterSubtype
  );

  const reportEntry = {
    status: "ok" as const,
    water_type: waterType,
    engine: engineOutput,
    // V1-compatible LLM shape for ReportView component
    llm: {
      headline_summary: llmOutput.headline_summary,
      overall_fishing_rating: llmOutput.overall_fishing_rating,
      best_times_to_fish_today: llmOutput.best_times_to_fish_today,
      decent_times_today: llmOutput.decent_times_today,
      worst_times_to_fish_today: llmOutput.worst_times_to_fish_today,
      key_factors: llmOutput.key_factors,
      tips_for_today: llmOutput.tips_for_today,
      strategy: llmOutput.strategy,
    },
    error: null,
    usage: { input_tokens: inputTokens, output_tokens: outputTokens, token_cost_usd: actualCostUsd },
  };

  const responseBundle = {
    feature: "hows_fishing_feature_v2" as const,
    mode: "single" as const,
    default_tab: environmentMode,
    generated_at: timestampUtc,
    cache_expires_at: cacheExpiresAt,
    freshwater_subtype: freshwaterSubtype,
    context: {
      water_type: waterType,
      freshwater_subtype: freshwaterSubtype,
      environment_mode: environmentMode,
      region: geoContext.region,
      seasonal_state: null,
    },
    // Reports map — single entry keyed by environment_mode.
    // The frontend availableTabs logic in how-fishing.tsx handles this gracefully.
    reports: {
      [environmentMode]: reportEntry,
    },
    failed_reports: [] as string[],
  };

  // ── 13. Log ai_sessions ────────────────────────────────────────────────────
  const { error: aiError } = await supabase.from("ai_sessions").insert({
    user_id: userId,
    session_type: "fishing_now",
    input_payload: { latitude: lat, longitude: lon, units, environment_mode: environmentMode },
    response_payload: responseBundle,
    token_cost_usd: actualCostUsd,
  });
  if (aiError) {
    console.error("ai_sessions insert error:", aiError);
  }

  // ── 14. Log usage_tracking ─────────────────────────────────────────────────
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
