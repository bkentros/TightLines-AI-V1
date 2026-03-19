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

const REBUILD_LLM_SYSTEM = `You rewrite TightLines How's Fishing reports into premium, practical copy for anglers.

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
- Avoid filler, hype, and generic fishing-app language.`;

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

function buildNarrationPrompt(narration: ReturnType<typeof buildNarrationPayloadFromReport>): string {
  const scoreOutOfTen = displayScoreOutOfTen(narration.score);
  return [
    "<task>",
    "Rewrite the deterministic report into two short fields that feel polished, body-of-water-specific, and useful for today's fishing decisions.",
    "</task>",
    "<context_guide>",
    contextGuide(narration.context),
    "</context_guide>",
    "<tip_tag_guide>",
    "temperature_intraday_flex = adjust within the day around warming or cooling.",
    "runoff_clarity_flow = emphasize reduced flow, slower water, or clearer water in rivers.",
    "wind_shelter = emphasize protected banks, lee shorelines, or less exposed water.",
    "coastal_tide_positive = emphasize moving-water periods or stronger tidal movement in coastal settings.",
    "lean_into_top_driver = build the tip around the top positive driver without sounding robotic.",
    "general_flexibility = give one broad, practical adjustment without inventing details.",
    "</tip_tag_guide>",
    "<daypart_guide>",
    "no_timing_edge = keep timing broad and avoid forcing a timing angle.",
    "moving_water_periods = mention moving water broadly, not exact tide windows.",
    "early_late_low_light = mention early, late, or lower-light periods broadly.",
    "warmest_part_may_help = mention the warmer part of the day broadly.",
    "cooler_low_light_better = mention cooler or lower-light periods broadly.",
    "</daypart_guide>",
    "<payload>",
    JSON.stringify({
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
    "summary_line: one concise full-day outlook sentence, tailored to the body of water.",
    "actionable_tip: one practical adjustment the angler can actually use today.",
    "Do not repeat the same sentence structure in both fields.",
    "Do not mention JSON, payload, or scoring math.",
    "</output_contract>",
  ].join("\n");
}

async function polishReportCopy(
  anthropicKey: string,
  _report: HowsFishingReport,
  narration: ReturnType<typeof buildNarrationPayloadFromReport>
): Promise<{ summary: string; tip: string; inT: number; outT: number } | null> {
  const user = buildNarrationPrompt(narration);
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

  const sharedReq = buildSharedEngineRequestFromEnvData(lat, lon, localDate, timezone, context, envData);
  let report = runHowFishingReport(sharedReq);

  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  let inputTokens = 0;
  let outputTokens = 0;
  if (anthropicKey) {
    const narr = buildNarrationPayloadFromReport(report);
    const polished = await polishReportCopy(anthropicKey, report, narr);
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
