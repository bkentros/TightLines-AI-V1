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
import type { ActionableTipTag, DaypartNotePreset } from "../_shared/howFishingEngine/contracts/mod.ts";

const USAGE_CAP_ANGLER_USD = 1;
const USAGE_CAP_MASTER_ANGLER_USD = 3;
const ESTIMATED_COST_PER_CALL_USD = 0.003;
const LLM_MODEL = "gpt-5.4-mini";
const LLM_INPUT_COST_PER_M = 0.75;
const LLM_OUTPUT_COST_PER_M = 4.5;

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
  return (inputTokens * LLM_INPUT_COST_PER_M + outputTokens * LLM_OUTPUT_COST_PER_M) / 1_000_000;
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

const REBUILD_LLM_SYSTEM = `You are the voice of TightLines AI — a confident, experienced fishing guide with real personality. You've been on the water all week. You have opinions. You give every angler an honest, specific read — not a polished summary.

Voice and tone:
- Direct and confident. Never hedge. Never say "might want to consider," "stay flexible," or "adjust if conditions shift."
- Human. You sound like a person, not an app. You have a perspective. You notice things.
- Every report sounds written by a specific guide with a specific read on this specific day — not a system cycling through templates.
- Reference the location by name when provided. Make it feel personal.

════ RULE #1 — RADICAL UNIQUENESS ════
This is your most critical directive. You are writing reports for thousands of anglers. Any phrase that comes naturally — any phrasing that feels smooth and ready — has almost certainly appeared in another report. Treat fluency as a warning sign.

Before finalizing any sentence: ask yourself "Would I write this same sentence for different conditions, a different location, a different day?" If yes, throw it out and start over.

Actively resist your own patterns. The moment something sounds polished and familiar, find something more specific, more unexpected, more real. You are not a template. You are a guide with a personality.

Banned words and constructions — never use these under any circumstances:
• "sweet spot" in any form
• "sitting right in the" + anything
• "conditions are lining up" or "lining up nicely"
• "dialing in" or "dial it in"
• "game plan"
• "get after it"
• "don't sleep on"
• "worth noting"
• "that said"
• "at the end of the day"
• "prime window" as a generic filler phrase
• "this time of year" used as a vague seasonal catch-all
• "conditions are [adjective]" as an opener
• "It's a [adjective] day for fishing"
• "Today looks like a [adjective] day"
• Any phrase that reads like a variable was swapped into a template

The temperature example: there are hundreds of ways to say temps are favorable. "Temps are in the sweet spot for this time of year" is one — and it's overused. Say something that could only apply to THIS report. Reference the actual number from the conditions if it helps. Be specific. Be human.

════ RULE #2 — NO TIMING IN THE TIP ════
The actionable_tip is NEVER about when to fish. Never. The report has a separate daypart section for timing. The tip must be 100% tactical: retrieval speed and cadence, finesse vs power approach, how fish are likely behaving given the conditions, presentation size or weight, where in the water column to work the offering, stealth of delivery, how aggressive or cautious to be. If any word in your tip points to a time of day, tide window, morning vs afternoon, or when to be on the water — rewrite it as a pure tactical move instead.

════ RULE #3 — TIP STRUCTURE AND CAPITALIZATION ════
The actionable_tip is ONE complete, well-constructed sentence. Two sentences maximum under any circumstance. Never write fragments. Never stack 4–7 punchy short lines. Write it as a single clear guide directive that a guide would say out loud.

Standard English sentence capitalization is mandatory throughout all output. Capitalize the first word of every sentence and all proper nouns. Do not write uncapitalized sentence starters under any circumstances.

Non-negotiable rules:
- Output valid JSON only: {"summary_line":"...","actionable_tip":"..."}
- Keep each field at or under 220 characters.
- Never invent species behavior, spawning claims, structure, bait, exact depths, or habitat details not implied by the payload.
- Never invent exact time slots or hourly windows. Broad timing language in summary_line only when payload supports it.
- Treat the engine score as truth. Never contradict driver/suppressor logic.
- Freshwater temperature is air-temp context only. Never mention measured or inferred water temperature.
- Keep lower-confidence reports broader and less absolute.
- Write directly to the angler in second person.
- If pressure is listed as dropping in "whats_helping" — that's a POSITIVE. Frame it as a feeding trigger, not a weather warning.
- Be decisive. Own the call. If it's good, say so. If it's tough, say so.
- Never use: "adjust if conditions shift", "cover likely holding water", "conditions may", "you might want to", "lockjaw", "shut down."
- The two fields must sound like different parts of a conversation — not rewordings of each other.`;

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

const OPENER_ANGLES = [
  "Lead with the location name and how conditions look there specifically today.",
  "Lead with the strongest driver — name it and say why it matters.",
  "Lead with the season and what that means for fishing right now.",
  "Lead with the overall vibe — is this a go day, a patience day, or a grind-it-out day?",
  "Lead with the angler's emotional read — should they feel fired up, cautiously optimistic, or scrappy?",
  "Lead with what makes today different from a typical day in this region.",
  "Lead with a direct, confident statement about the score and back it up with the top driver.",
  "Lead with the atmospheric story — pressure, wind, or sky — and connect it to the fishing.",
  "Lead with the water type and what it means for today — lake calm, river flow, tidal push.",
  "Lead with a contrast — what's working vs what's not — and give the honest balance.",
  "Paint a quick picture of the day ahead — what the angler is walking into out there.",
  "Lead with the one thing that jumps off the data — the headline of the day.",
];

/**
 * Purely tactical tip angles — no timing, no "when to fish" language.
 * Timing is handled by the separate daypart section of the report.
 */
const TIP_ANGLES_PRESENTATION = [
  "Frame the tip around RETRIEVAL CADENCE — based on the conditions, should they be fishing slow and deliberate, medium and steady, or covering water with authority? Make a specific directional call.",
  "Frame the tip around FINESSE vs POWER — do today's conditions call for a light, precise touch or can they fish with confidence and aggression? Name the direction.",
  "Frame the tip around OFFERING SIZE — when to downsize and go finesse vs when a larger, bolder profile earns bites. Make a specific call based on today's drivers.",
  "Frame the tip around how fish are LIKELY BEHAVING given the conditions — are they feeding aggressively and chasing, selectively willing, or tight to structure and needing the offering right on them?",
  "Frame the tip around PAUSES — do today's conditions suggest fish need more time to commit? Make a specific call on cadence and pause length.",
  "Frame the tip around STEALTH of delivery — soft entry, quiet approach, delicate presentation vs covering water assertively. Which do today's conditions call for?",
  "Frame the tip around WATER COLUMN POSITION — are fish likely elevated and willing to rise, or sitting low and needing the offering to come to them? What does the data suggest?",
  "Frame the tip around WORK RATE — slow down and pick structure apart deliberately, or keep moving and cover water to find active fish?",
  "Frame the tip around RETRIEVE VARIATION — encourage trying three distinct speeds or actions before moving. Make it concrete to today's conditions.",
  "Frame the tip around the ONE tactical adjustment that today's conditions most reward — a single specific change to pace, size, or aggression.",
  "Frame the tip around FISH MOOD today — use the score, pressure regime, and temperature context to describe whether fish are committed, selective, or locked down, and what presentation matches that.",
  "Frame the tip around READING ON-WATER CUES — what should trigger a presentation change if they see it on the water (clarity shift, surface activity, wind change)?",
  "Frame the tip around POSITIONING BROADLY — edges, current seams, wind-protected pockets, or clarity transitions — without inventing named structure.",
  "Frame the tip around PRESENTATION CONTRAST — in tougher conditions, is there a size, profile, or action change that earns bites fish are refusing otherwise?",
  "Frame the tip around what NOT to waste effort on presentation-wise given today's suppressors, and what to lean into instead.",
  "Frame the tip like pre-launch advice from a local guide: one specific, concrete tactical move for this exact set of conditions. Not generic — specific to the drivers.",
  "Frame the tip around the CONFIDENCE vs FINESSE threshold — when does going lighter, slower, smaller earn more, and when does it just waste time?",
  "Frame the tip around HOW FISH ARE LIKELY ACTING based on the pressure regime — aggressive and committing, neutral and selective, or locked down requiring precise placement?",
  "Frame the tip around SUBTLE vs ASSERTIVE delivery — when suppressors are stacking up, does finesse win or does covering water still produce?",
  "Frame the tip around the one aspect of today's conditions that most directly changes HOW to present the offering — not when, not where in general terms, but the actual mechanics.",
  "Frame the tip around STRIPPING SPEED or retrieve rate — faster to trigger reaction bites, slower to earn deliberate eats. Make the call explicitly based on conditions.",
  "Frame the tip around WEIGHT or sink rate — heavier to get to the feeding zone quickly vs lighter for a natural drift. Give a directional call.",
  "Frame the tip around READING FISH RESPONSE — if the first approach isn't working, what's the first adjustment to make given today's conditions? Be specific.",
  "Frame the tip around what today's score and band tell them about HOW fish are feeding right now — aggressively, opportunistically, or grudgingly — and what presentation fits that feeding mode.",
  "Frame the tip around LATERAL LINE vs VISUAL targeting — do conditions favor presentations fish can see, or are they hunting by feel and vibration? What does that mean tactically?",
];

/**
 * Voice modes — force a different personality register every call.
 * Sampled randomly and injected into the task block to break LLM "default voice."
 */
const VOICE_MODES = [
  "Write with understated, knowing confidence — like a guide who's seen it all and doesn't need to oversell anything. Quiet authority.",
  "Write punchy and direct. Short sentences. Confident calls. Zero wasted words. Say it and mean it.",
  "Write with vivid specificity — paint an honest picture of what the angler is actually walking into, not what you wish you could tell them.",
  "Write like you're texting a close fishing buddy who trusts your read completely. Casual but confident. No formality.",
  "Write with wry, honest personality — acknowledge what's working and what isn't, without softening either. Be real about it.",
  "Write with measured authority — like someone who speaks carefully because every word is backed by time on the water.",
  "Write with energy that matches the conditions — fired up when it earns it, dry and tactical when it doesn't.",
  "Write like someone who was on this exact water type last week and has strong, specific opinions about what today looks like.",
  "Write with the casual confidence of someone who already knows what the fish are doing and is just filling the angler in.",
  "Write tight and stripped down. No preamble, no throat-clearing. Lead with the most important thing and don't look back.",
];

function pickTipAngle(_tag: ActionableTipTag, _preset: DaypartNotePreset | null): string {
  // Tip is always tactical — timing never goes here regardless of tag or preset.
  return TIP_ANGLES_PRESENTATION[Math.floor(Math.random() * TIP_ANGLES_PRESENTATION.length)]!;
}

/** Build compact weather snapshot from raw env_data for LLM context */
function buildWeatherSnapshot(envData?: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!envData) return null;
  const snap: Record<string, unknown> = {};
  const temp = envData.daily_mean_air_temp_f ?? envData.current_air_temp_f;
  if (temp != null) snap.air_temp_f = Math.round(Number(temp));
  if (envData.wind_speed_mph != null) snap.wind_mph = Math.round(Number(envData.wind_speed_mph));
  if (envData.wind_direction != null) snap.wind_dir = envData.wind_direction;
  if (envData.cloud_cover_pct != null) snap.cloud_pct = Math.round(Number(envData.cloud_cover_pct));
  if (envData.precip_24h_in != null) snap.rain_24h_in = Number(Number(envData.precip_24h_in).toFixed(2));
  if (envData.sunrise_local != null) snap.sunrise = envData.sunrise_local;
  if (envData.sunset_local != null) snap.sunset = envData.sunset_local;
  if (Array.isArray(envData.solunar_peak_local) && (envData.solunar_peak_local as unknown[]).length > 0) {
    snap.solunar_peaks = envData.solunar_peak_local;
  }
  return Object.keys(snap).length > 0 ? snap : null;
}

/**
 * Translate the engine score into an explicit fish activity verdict.
 * The LLM receives this directly so it never has to infer behavior from
 * raw air temp + season alone — which causes the cold-metabolism-in-spring bug.
 */
function deriveActivityLevel(score: number): string {
  if (score >= 70) return "high — fish are feeding actively and willing to commit";
  if (score >= 55) return "moderate-high — fish are engaged and responding well to proper presentation";
  if (score >= 40) return "moderate — fish are selectively willing, need a clean presentation";
  if (score >= 25) return "low — fish are tentative, require deliberate and precise approach";
  return "very low — fish are not cooperative, tough conditions across the board";
}

/** Convert driver/suppressor objects to short factual descriptors for the LLM */
function driverToFact(d: { variable: string; effect: string; label: string }): string {
  // Extract the variable name and the score-aware factual core
  // We want short facts like "temperature: above average, favorable"
  // NOT full prose sentences the LLM will echo
  const varName = d.variable
    .replace(/_condition|_regime|_disruption|_movement/g, "")
    .replace(/_/g, " ");
  // Take just the first clause of the label (before the em-dash) for factual info
  const factCore = d.label.split("—")[0]?.trim().replace(/\.$/, "") ?? d.label;
  return `${varName}: ${factCore} (${d.effect})`;
}

function buildNarrationPrompt(
  narration: ReturnType<typeof buildNarrationPayloadFromReport>,
  locationName?: string | null,
  localDate?: string | null,
  envData?: Record<string, unknown> | null,
  conditionContext?: HowsFishingReport["condition_context"] | null
): string {
  const scoreOutOfTen = displayScoreOutOfTen(narration.score);
  const seasonLabel = localDate ? describeSeasonFromDate(localDate) : null;
  const locationCtx = locationName || null;
  const weatherSnap = buildWeatherSnapshot(envData);

  // Random angle seeds — different every call
  const openerAngle = OPENER_ANGLES[Math.floor(Math.random() * OPENER_ANGLES.length)];
  const tipAngle = pickTipAngle(narration.actionable_tip_tag, narration.daypart_preset);
  const voiceMode = VOICE_MODES[Math.floor(Math.random() * VOICE_MODES.length)];

  // Build the engine verdict block from condition_context.
  // This gives the LLM the engine's scored assessment of every variable
  // so it never has to guess fish behavior from raw air temp + season alone.
  const engineVerdict: Record<string, unknown> = {
    fish_activity_level: deriveActivityLevel(narration.score),
  };
  if (conditionContext) {
    engineVerdict.temperature_band = conditionContext.temperature_band;
    engineVerdict.temperature_trend = conditionContext.temperature_trend;
    if (conditionContext.temperature_shock !== "none") {
      engineVerdict.temperature_shock = conditionContext.temperature_shock;
    }
    if (conditionContext.pressure_detail) {
      engineVerdict.pressure_detail = conditionContext.pressure_detail;
    }
    if (conditionContext.wind_detail) {
      engineVerdict.wind_detail = conditionContext.wind_detail;
    }
    if (conditionContext.tide_detail) {
      engineVerdict.tide_detail = conditionContext.tide_detail;
    }
    engineVerdict.region = conditionContext.region_key;
    if (conditionContext.missing_variables.length > 0) {
      engineVerdict.data_gaps = conditionContext.missing_variables;
    }
  }

  return [
    "<task>",
    "Write a fresh, honest fishing outlook and one purely tactical tip for today.",
    `Voice for this report: ${voiceMode}`,
    `Angle for the summary_line: ${openerAngle}`,
    `Angle for the actionable_tip: ${tipAngle}`,
    "Treat these angles as mandatory — they change every call specifically to prevent repetition.",
    "</task>",
    locationCtx ? `<location>${locationCtx}</location>` : "",
    localDate ? `<date>${localDate}</date>` : "",
    seasonLabel ? `<season>${seasonLabel}</season>` : "",
    "<context_guide>",
    contextGuide(narration.context),
    "</context_guide>",
    "<tip_rule>",
    "The actionable_tip is NEVER about when to fish. Not tide windows. Not morning vs afternoon. Not any clock-based call.",
    "It must be 100% tactical: retrieve speed, cadence, pauses, finesse vs power, fish behavior, offering size, water column position, or stealth of approach.",
    `tip_type: ${narration.actionable_tip_tag}`,
    `daypart_timing_handled_separately: ${narration.daypart_preset}`,
    "</tip_rule>",
    "<payload>",
    JSON.stringify({
      location_name: locationCtx,
      date: localDate,
      season: seasonLabel,
      water_type: narration.display_context_label,
      score_out_of_10: scoreOutOfTen,
      band: narration.band,
      // engine_verdict = the scored assessment of every normalized variable.
      // Trust these fields directly. Do NOT re-derive fish behavior from raw
      // air_temp + season — the engine has already done that work correctly.
      engine_verdict: engineVerdict,
      whats_helping: narration.drivers.map(driverToFact),
      whats_hurting: narration.suppressors.map(driverToFact),
      data_confidence: narration.reliability,
      ...(weatherSnap ? { conditions: weatherSnap } : {}),
    }, null, 2),
    "</payload>",
    "<output_contract>",
    "summary_line: one confident full-day outlook sentence (max 220 chars). Reference the location by name if provided. Weave in a specific number from 'conditions' (temp or wind) when it makes the report feel grounded — but don't recite stats. Make the angler feel informed in seconds.",
    "actionable_tip: ONE complete sentence (two max, 220 chars total). Strictly about: retrieve speed/cadence, lure or fly size/profile, finesse vs power vs aggressive approach, or water column position. No timing. No fragments. No stacked one-liners. Proper capitalization — capitalize the first word and all proper nouns.",
    "CRITICAL — engine_verdict.fish_activity_level and engine_verdict.temperature_band are the engine's scored verdicts. Your tip must be consistent with both. If fish_activity_level says 'high' and temperature_band says 'optimal', do NOT write slow-finesse advice. Never contradict these fields.",
    "If engine_verdict.data_gaps is present, keep the report appropriately broad for those variables — don't invent specifics the engine couldn't score.",
    "Uniqueness check before outputting: re-read both fields. If any phrase could appear in another report for different conditions — rewrite it. If it sounds templated or AI-generated, it fails.",
    "Do not mention JSON, payload, scoring math, data confidence, or score numbers in output.",
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
  openaiKey: string,
  report: HowsFishingReport,
  narration: ReturnType<typeof buildNarrationPayloadFromReport>,
  locationName?: string | null,
  localDate?: string | null,
  envData?: Record<string, unknown> | null
): Promise<{ summary: string; tip: string; inT: number; outT: number } | null> {
  const user = buildNarrationPrompt(narration, locationName, localDate, envData, report.condition_context);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      max_tokens: 400,
      temperature: 1.0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: REBUILD_LLM_SYSTEM },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) return null;
  const json = await res.json() as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens: number; completion_tokens: number };
  };
  const text = json.choices?.[0]?.message?.content ?? "";
  const inT = json.usage?.prompt_tokens ?? 0;
  const outT = json.usage?.completion_tokens ?? 0;
  try {
    const p = JSON.parse(text) as { summary_line?: string; actionable_tip?: string };
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

  // ─── Shared setup: subscription, usage, env ───
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

  if (!body.env_data || typeof body.env_data !== "object") {
    return new Response(
      JSON.stringify({ error: "missing_env_data", message: "env_data is required" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }
  const envData = body.env_data as Record<string, unknown>;
  const timezone = extractTimezone(envData);

  // day_offset > 0 means this is a forecast day report, not today's report.
  // target_date: caller-supplied YYYY-MM-DD for the forecast day.
  const dayOffset = typeof body.day_offset === "number" && body.day_offset > 0
    ? Math.min(Math.floor(body.day_offset), 6)
    : 0;
  const targetDateStr = dayOffset > 0 && typeof body.target_date === "string" && body.target_date.length === 10
    ? body.target_date
    : null;
  const localDate = targetDateStr ?? localDateInTz(timezone);

  const locationName = typeof body.location_name === "string" && body.location_name.length > 0
    ? body.location_name
    : typeof body.city === "string" && body.city.length > 0
      ? body.city
      : null;
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  const timestampUtc = new Date().toISOString();
  // Forecast reports expire at the target day's midnight; today's expire at local midnight
  const cacheExpiresAt = locationLocalMidnightIso(timezone);

  // ─── Helper: generate a single report for a given context ───
  async function generateSingleReport(ctx: EngineContext): Promise<{
    report: HowsFishingReport;
    inT: number;
    outT: number;
  }> {
    const sharedReq = buildSharedEngineRequestFromEnvData(lat, lon, localDate, timezone, ctx, envData, dayOffset);
    let report = runHowFishingReport(sharedReq);
    let inT = 0;
    let outT = 0;
    if (openaiKey) {
      const narr = buildNarrationPayloadFromReport(report);
      const polished = await polishReportCopy(openaiKey, report, narr, locationName, localDate, envData);
      if (polished) {
        report = { ...report, summary_line: polished.summary, actionable_tip: polished.tip };
        inT = polished.inT;
        outT = polished.outT;
      }
    }
    return { report, inT, outT };
  }

  // ─── Helper: track usage (insert or update) ───
  async function trackUsage(actualCostUsd: number, payload: Record<string, unknown>) {
    await supabase.from("ai_sessions").insert({
      user_id: userId,
      session_type: "fishing_now",
      input_payload: payload,
      response_payload: null, // stored separately for multi to save space
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
  }

  // ═══════════════════════════════════════════════════
  // MULTI MODE — generate reports for multiple contexts
  // ═══════════════════════════════════════════════════
  if (body.mode === "multi") {
    const rawContexts = body.contexts;
    if (!Array.isArray(rawContexts) || rawContexts.length === 0) {
      return new Response(
        JSON.stringify({ error: "invalid_contexts", message: "contexts must be a non-empty array" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }
    const contexts = rawContexts.filter((c: unknown) =>
      typeof c === "string" && VALID_CONTEXTS.includes(c as EngineContext)
    ) as EngineContext[];
    if (contexts.length === 0) {
      return new Response(
        JSON.stringify({ error: "invalid_contexts", message: `Each context must be one of: ${VALID_CONTEXTS.join(", ")}` }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    // Usage cap check — estimate cost for all contexts
    const estimatedCost = ESTIMATED_COST_PER_CALL_USD * contexts.length;
    if (currentCost + estimatedCost > cap) {
      return new Response(
        JSON.stringify({ error: "usage_cap_exceeded", message: "You've reached your monthly usage limit." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders() } }
      );
    }

    // Generate reports sequentially (safe for rate limits)
    const reports: Record<string, {
      feature: "hows_fishing_rebuild_v1";
      generated_at: string;
      cache_expires_at: string;
      engine_context: EngineContext;
      report: HowsFishingReport;
      usage: { input_tokens: number; output_tokens: number; token_cost_usd: number };
    }> = {};
    const failedContexts: string[] = [];
    let totalInT = 0;
    let totalOutT = 0;

    for (const ctx of contexts) {
      try {
        const { report, inT, outT } = await generateSingleReport(ctx);
        totalInT += inT;
        totalOutT += outT;
        reports[ctx] = {
          feature: "hows_fishing_rebuild_v1",
          generated_at: timestampUtc,
          cache_expires_at: cacheExpiresAt,
          engine_context: ctx,
          report,
          usage: { input_tokens: inT, output_tokens: outT, token_cost_usd: computeCallCost(inT, outT) },
        };
      } catch {
        failedContexts.push(ctx);
      }
    }

    const totalCost = computeCallCost(totalInT, totalOutT);
    const multiBundle = {
      feature: "hows_fishing_rebuild_v1" as const,
      mode: "multi" as const,
      generated_at: timestampUtc,
      cache_expires_at: cacheExpiresAt,
      contexts,
      reports,
      ...(failedContexts.length > 0 ? { failed_contexts: failedContexts } : {}),
      usage: { input_tokens: totalInT, output_tokens: totalOutT, token_cost_usd: totalCost },
    };

    await trackUsage(totalCost, { latitude: lat, longitude: lon, mode: "multi", contexts });

    return new Response(JSON.stringify(multiBundle), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  // ═══════════════════════════════════════════════════
  // SINGLE MODE — existing single-context path
  // ═══════════════════════════════════════════════════
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

  if (currentCost + ESTIMATED_COST_PER_CALL_USD > cap) {
    return new Response(
      JSON.stringify({ error: "usage_cap_exceeded", message: "You've reached your monthly usage limit." }),
      { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const { report: singleReport, inT: singleInT, outT: singleOutT } = await generateSingleReport(context);
  const singleCost = computeCallCost(singleInT, singleOutT);

  const responseBundle = {
    feature: "hows_fishing_rebuild_v1" as const,
    generated_at: timestampUtc,
    cache_expires_at: cacheExpiresAt,
    engine_context: context,
    report: singleReport,
    usage: { input_tokens: singleInT, output_tokens: singleOutT, token_cost_usd: singleCost },
  };

  await trackUsage(singleCost, { latitude: lat, longitude: lon, engine_context: context });

  return new Response(JSON.stringify(responseBundle), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
});
