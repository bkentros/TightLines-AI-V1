/**
 * how-fishing — Supabase Edge Function
 *
 * Rebuild path: single daily full-day report via howFishingEngine.
 * Contexts: freshwater_lake_pond | freshwater_river | coastal
 * No 7-day weekly path. No exact timing windows. No V2/V3 engine.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
  buildNarrationPayloadFromReport,
  type EngineContext,
  type HowsFishingReport,
} from "../_shared/howFishingEngine/index.ts";

const USAGE_CAP_ANGLER_USD = 1;
const USAGE_CAP_MASTER_ANGLER_USD = 3;
const ESTIMATED_COST_PER_CALL_USD = 0.006;
const CLAUDE_MODEL = "claude-haiku-4-5";
const CLAUDE_INPUT_COST_PER_M = 1;
const CLAUDE_OUTPUT_COST_PER_M = 5;

const VALID_CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
];

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
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
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

function extractTimezone(envData: Record<string, unknown>): string {
  if (typeof envData.timezone === "string" && envData.timezone.length > 0) {
    return envData.timezone;
  }
  return "America/New_York";
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

const REBUILD_LLM_SYSTEM = `You are the voice of TightLines AI — a confident, knowledgeable fishing guide who speaks with authority and warmth. You sound like a trusted local pro who's been on the water all week and is giving a friend an honest read on the day.

Voice and tone:
- Confident and direct — never hedge, never say "might want to consider" or "adjust if conditions shift."
- Warm but concise — you respect the angler's time.
- Speak like a real guide, not a weather app or a chatbot. Use natural, varied language.
- Every report should feel like it was written fresh for this specific day, location, and conditions. Never sound templated.
- Vary your sentence structure, word choice, and phrasing every single time. If you catch yourself falling into a pattern, break it.
- Reference the location name when provided — make the angler feel like this report was made for their spot.
- Reference the season or time of year naturally when it adds context.

Non-negotiable rules:
- Output valid JSON only: {"summary_line":"...","actionable_tip":"..."}
- Keep each field at or under 220 characters.
- Never invent species behavior, spawning claims, structure, bait, depth, or habitat details not already implied by the payload.
- Never invent exact time slots, hourly windows, or ranked timing tables.
- Use broad timing language only when the payload supports it.
- Treat the engine as the source of truth. Rewrite; do not reinterpret the score or contradict the driver/suppressor logic.
- Freshwater temperature framing is air-temperature context only. Do not mention measured water temperature or inferred water temperature.
- Keep lower-confidence reports broader and less absolute.
- Write directly to the angler in second person.
- Never use these phrases: "adjust if conditions shift", "stay flexible", "cover likely holding water", "conditions may", "you might want to", "consider adjusting."
- Be decisive. If the data says it's good, say it's good. If it's tough, say it's tough. Own the call.`;

function displayScoreOutOfTen(score: number): string {
  const outOfTen = Math.round(score) / 10;
  return Number.isInteger(outOfTen) ? outOfTen.toFixed(0) : outOfTen.toFixed(1);
}

function contextGuide(context: EngineContext): string {
  if (context === "freshwater_lake_pond") {
    return [
      "Write specifically for a freshwater lake or pond.",
      "Use language about covering water, staying flexible, lower-light periods, wind-protected banks, and broad seasonal positioning.",
      "Do not sound like a river report and do not mention tides or current windows.",
    ].join(" ");
  }
  if (context === "freshwater_river") {
    return [
      "Write specifically for a freshwater river.",
      "Use language about current seams, reduced flows, slower or clearer water, runoff carryover, and river stability.",
      "Do not sound like a lake report and do not mention tides.",
    ].join(" ");
  }
  return [
    "Write specifically for a coastal saltwater or brackish setting.",
    "Use language about moving water, tide-driven positioning, wind exposure, cleaner water, and broad shoreline or marsh adjustments.",
    "Do not sound like a lake or river report.",
  ].join(" ");
}

function buildNarrationPrompt(
  narration: ReturnType<typeof buildNarrationPayloadFromReport>,
  locationName?: string | null,
  localDate?: string | null
): string {
  const scoreOutOfTen = displayScoreOutOfTen(narration.score);
  const seasonLabel = localDate ? describeSeasonFromDate(localDate) : null;
  const locationCtx = locationName || null;

  return [
    "<task>",
    "Write a fresh, confident fishing outlook and one actionable tip for today. Sound like a seasoned local guide giving a friend the honest read — not a weather app spitting out data.",
    "Every report must feel uniquely written for this day and place. Vary your language, structure, and angle every time.",
    "</task>",
    locationCtx ? `<location>${locationCtx}</location>` : "",
    localDate ? `<date>${localDate}</date>` : "",
    seasonLabel ? `<season>${seasonLabel}</season>` : "",
    "<context_guide>",
    contextGuide(narration.context),
    "</context_guide>",
    "<tip_tag_guide>",
    "temperature_intraday_flex = tell the angler exactly when to lean in based on warming or cooling trends. Be specific about the approach, not vague.",
    "runoff_clarity_flow = direct the angler toward cleaner, slower water. Say it with authority.",
    "wind_shelter = tell them where to position — sheltered banks, lee shorelines, wind-blocked coves. Be confident.",
    "coastal_tide_positive = tell them to be on the water when it's moving. Tidal flow is the play today.",
    "lean_into_top_driver = build a clear, actionable tip around whatever is working best today. Name it.",
    "general_flexibility = give one sharp, practical read on how to approach the day. No hedging.",
    "</tip_tag_guide>",
    "<daypart_guide>",
    "no_timing_edge = no obvious timing window stands out — keep the outlook honest about that without sounding negative.",
    "moving_water_periods = the tidal movement windows are where the action will be. Say it directly.",
    "early_late_low_light = early morning or late afternoon is the move today. Commit to that call.",
    "warmest_part_may_help = the afternoon warmth will wake things up. Tell them to plan around it.",
    "cooler_low_light_better = the heat is a factor — low-light windows and cooler stretches are the play.",
    "</daypart_guide>",
    "<payload>",
    JSON.stringify({
      location_name: locationCtx,
      date: localDate,
      season: seasonLabel,
      display_context_label: narration.display_context_label,
      score: narration.score,
      score_out_of_10: scoreOutOfTen,
      band: narration.band,
      summary_line_seed: narration.summary_line_seed,
      drivers: narration.drivers,
      suppressors: narration.suppressors,
      actionable_tip_seed: narration.actionable_tip_seed,
      actionable_tip_tag: narration.actionable_tip_tag,
      daypart_note_seed: narration.daypart_note_seed ?? null,
      daypart_preset: narration.daypart_preset,
      reliability: narration.reliability,
      reliability_note_seed: narration.reliability_note_seed ?? null,
    }, null, 2),
    "</payload>",
    "<output_contract>",
    "summary_line: one confident full-day outlook sentence. Reference the location if provided. Make the angler feel informed within seconds.",
    "actionable_tip: one decisive, practical tip the angler can act on today. No hedging. No \"consider\" or \"might want to.\" Tell them what to do.",
    "Do not repeat the same sentence structure in both fields.",
    "Do not mention JSON, payload, or scoring math.",
    "Do not reuse phrasing from previous reports. Write this one fresh.",
    "</output_contract>",
  ].filter(Boolean).join("\n");
}

function describeSeasonFromDate(iso: string): string {
  const month = parseInt(iso.slice(5, 7), 10) || 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

async function polishReportCopy(
  anthropicKey: string,
  _report: HowsFishingReport,
  narration: ReturnType<typeof buildNarrationPayloadFromReport>,
  locationName?: string | null,
  localDate?: string | null
): Promise<{ summary: string; tip: string; inT: number; outT: number } | null> {
  const user = buildNarrationPrompt(narration, locationName, localDate);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 400,
      temperature: 0.85,
      system: REBUILD_LLM_SYSTEM,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) return null;
  const json = await res.json() as {
    content?: { type: string; text?: string }[];
    usage?: { input_tokens: number; output_tokens: number };
  };
  const text = json.content?.find((c) => c.type === "text")?.text ?? "";
  const inT = json.usage?.input_tokens ?? 0;
  const outT = json.usage?.output_tokens ?? 0;
  try {
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    const p = JSON.parse(cleaned) as { summary_line?: string; actionable_tip?: string };
    const summary = typeof p.summary_line === "string" ? p.summary_line.slice(0, 280) : "";
    const tip = typeof p.actionable_tip === "string" ? p.actionable_tip.slice(0, 280) : "";
    if (summary && tip) return { summary, tip, inT, outT };
  } catch {
    /* fall through */
  }
  return null;
}

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

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const token = userToken || (authHeader ? authHeader.replace("Bearer ", "") : null);
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing authentication token" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
  const userId = user.id;

  let body: Record<string, unknown> = {};
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

  if (body.mode === "weekly_overview") {
    return new Response(
      JSON.stringify({
        error: "weekly_overview_removed",
        message: "7-day forecast reports are not available in this app version.",
      }),
      { status: 410, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const rawCtx = body.engine_context ?? body.environment_mode;
  const ctxStr = typeof rawCtx === "string" ? rawCtx : "";
  let context: EngineContext;
  if (ctxStr === "freshwater_lake_pond" || ctxStr === "freshwater_lake") {
    context = "freshwater_lake_pond";
  } else if (ctxStr === "freshwater_river") {
    context = "freshwater_river";
  } else if (ctxStr === "coastal" || ctxStr === "saltwater" || ctxStr === "brackish") {
    context = "coastal";
  } else if (VALID_CONTEXTS.includes(ctxStr as EngineContext)) {
    context = ctxStr as EngineContext;
  } else {
    return new Response(
      JSON.stringify({
        error: "invalid_engine_context",
        message: `engine_context must be one of: ${VALID_CONTEXTS.join(", ")} (legacy saltwater/brackish map to coastal)`,
      }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

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
        message: "You've reached your monthly usage limit.",
      }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  if (!body.env_data || typeof body.env_data !== "object") {
    return new Response(
      JSON.stringify({ error: "missing_env_data", message: "env_data is required" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }
  const envData = body.env_data as Record<string, unknown>;
  const timezone = extractTimezone(envData);
  const localDate = localDateInTz(timezone);

  const locationName = typeof body.location_name === "string" && body.location_name.length > 0
    ? body.location_name
    : typeof body.city === "string" && body.city.length > 0
      ? body.city
      : null;

  const sharedReq = buildSharedEngineRequestFromEnvData(lat, lon, localDate, timezone, context, envData);
  let report = runHowFishingReport(sharedReq);

  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  let inputTokens = 0;
  let outputTokens = 0;
  if (anthropicKey) {
    const narr = buildNarrationPayloadFromReport(report);
    const polished = await polishReportCopy(anthropicKey, report, narr, locationName, localDate);
    if (polished) {
      report = {
        ...report,
        summary_line: polished.summary,
        actionable_tip: polished.tip,
      };
      inputTokens = polished.inT;
      outputTokens = polished.outT;
    }
  }

  const actualCostUsd = computeCallCost(inputTokens, outputTokens);
  const timestampUtc = new Date().toISOString();
  const cacheExpiresAt = locationLocalMidnightIso(timezone);

  const responseBundle = {
    feature: "hows_fishing_rebuild_v1" as const,
    generated_at: timestampUtc,
    cache_expires_at: cacheExpiresAt,
    engine_context: context,
    report,
    usage: { input_tokens: inputTokens, output_tokens: outputTokens, token_cost_usd: actualCostUsd },
  };

  await supabase.from("ai_sessions").insert({
    user_id: userId,
    session_type: "fishing_now",
    input_payload: { latitude: lat, longitude: lon, engine_context: context },
    response_payload: responseBundle,
    token_cost_usd: actualCostUsd,
  });

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
