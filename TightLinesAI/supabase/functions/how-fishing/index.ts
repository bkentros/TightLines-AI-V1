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
  type EngineContext,
  type HowsFishingReport,
} from "../_shared/howFishingEngine/index.ts";
import {
  estimatePolishCostUsd,
  LLM_MODEL,
} from "../_shared/howFishingPolish/mod.ts";
import {
  buildNarrationBrief,
  type TipFocusLane,
} from "../_shared/howFishingEngine/narration/buildNarrationBrief.ts";

const USAGE_CAP_ANGLER_USD = 1;
const USAGE_CAP_MASTER_ANGLER_USD = 3;
const ESTIMATED_COST_PER_CALL_USD = 0.003;

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
  return estimatePolishCostUsd(inputTokens, outputTokens);
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

const REBUILD_LLM_SYSTEM = `You are a friendly, confident fishing guide writing daily conditions reports for everyday anglers — mostly beginners and intermediates who want to know what to do, not how the science works.

Your voice is warm and direct. Occasionally enthusiastic on great days, honest and constructive on tough ones. You write like someone who was on this water type recently — with a clear, specific opinion, not a template. Reference the location by name when provided.

Never use internal data labels, technical jargon, or score numbers in any field. Write natural, conversational English. Always second person (“you”, “your”).

Output exactly this JSON — no extra fields, no markdown:
{“summary_line”:”...”,”driver_labels”:[“...”],”suppressor_labels”:[“...”],”timing_insight”:”...”,”solunar_note”:”...”,”actionable_tip”:”...”}

Field rules:
- summary_line: 1-2 sentences (max 200 chars). Overall mood and vibe of the day. Reference the location.
- driver_labels: one short natural phrase per positive factor listed in the brief, same order, max 70 chars each.
- suppressor_labels: one short natural phrase per limiting factor listed in the brief, same order, max 70 chars each. If the brief says empty array, return [].
- timing_insight: 1 sentence about when to fish and why (max 140 chars).
- solunar_note: 1 soft sentence framing moon timing as interesting context, not a guarantee (max 120 chars).
- actionable_tip: 1-2 sentences. ONE concrete mechanical change — how to work the lure or fly. Must align with the fish metabolic state constraint in the brief. Never mention where to fish, structure, depth, tides, time of day, or approach/stealth.`;

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
 * Tip focus lanes — must match the four pillars in REBUILD_LLM_SYSTEM.
 * One lane is randomly assigned per API call so tips don't drift into location/timing/fish-psych.
 */
const TIP_FOCUS_INSTRUCTIONS: Record<TipFocusLane, readonly string[]> = {
  offering_size_profile: [
    "Make exactly ONE call on offering size or profile: downsize, upsize, slimmer bulk, more or less vibration/thump, heavier or lighter head *as tackle choice* — tied to today's drivers/suppressors. No depth or spot advice.",
    "Commit to a profile change the data supports: smaller vs larger, subtler vs louder action, finesse plastic vs hard bait energy — one clear mechanical choice.",
    "Name the size or silhouette shift that fits engine_verdict today (e.g. trim profile, bulk up, swap to something they can find without chasing).",
  ],
  retrieval_method: [
    "Name ONE retrieve *pattern* to own today: steady wind, twitch-pause, rip-and-fall, dead drift, slow roll, short pops — pick one and justify with conditions in half a clause max.",
    "Pick a single cadence recipe (e.g. two turns, pause, tick) vs steady crawl — the tip is the pattern, not the spot.",
    "Choose between reaction-style snaps vs smooth continuous motion — one method only, spelled out so they can replicate it.",
  ],
  speed_aggression: [
    "Pick ONE pace: crawl, slow, medium steady, fast, aggressive rip — what speed matches fish_activity_level and the top suppressors today?",
    "Commit to slower *or* more aggressive rod work on the retrieve — not both as equals; one dominant speed story.",
    "Should they earn bites with patience or trigger them with tempo? One explicit speed call.",
  ],
  finesse_vs_power: [
    "Finesse vs power on the *rod and retrieve*: light touch, long hangs vs confident snaps — one stance for today.",
    "Delicate vs authoritative with the same lure family — which side does the score and temperature story support?",
    "Soft hands and micro-movements vs assertive strips — pick the side and name what that looks like mechanically.",
  ],
};

function pickTipFocus(): { lane: TipFocusLane; instruction: string } {
  const lanes: TipFocusLane[] = [
    "offering_size_profile",
    "retrieval_method",
    "speed_aggression",
    "finesse_vs_power",
  ];
  const lane = lanes[Math.floor(Math.random() * lanes.length)]!;
  const pool = TIP_FOCUS_INSTRUCTIONS[lane];
  return { lane, instruction: pool[Math.floor(Math.random() * pool.length)]! };
}

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

async function polishReportCopy(
  openaiKey: string,
  report: HowsFishingReport,
  locationName: string | null,
  localDate: string | null,
): Promise<{
  summary: string;
  driverLabels: string[];
  suppressorLabels: string[];
  timingInsight: string;
  solunarNote: string;
  tip: string;
  inT: number;
  outT: number;
} | null> {
  try {
    const date = localDate ?? report.location.local_date;
    const tipFocus = pickTipFocus();
    const voiceMode = VOICE_MODES[Math.floor(Math.random() * VOICE_MODES.length)]!;
    const openerAngle = OPENER_ANGLES[Math.floor(Math.random() * OPENER_ANGLES.length)]!;

    const { briefText, positiveCount, limitingCount } = buildNarrationBrief(
      report,
      locationName,
      date,
      tipFocus.lane,
      tipFocus.instruction,
      voiceMode,
      openerAngle,
    );

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_completion_tokens: 1024,
        reasoning_effort: "none",
        temperature: 0.82,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: REBUILD_LLM_SYSTEM },
          { role: "user", content: briefText },
        ],
      }),
    });
    if (!res.ok) return null;

    let json: {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens: number; completion_tokens: number };
    };
    try {
      json = await res.json() as typeof json;
    } catch {
      return null;
    }

    const text = json.choices?.[0]?.message?.content ?? "";
    const inT = json.usage?.prompt_tokens ?? 0;
    const outT = json.usage?.completion_tokens ?? 0;

    try {
      const p = JSON.parse(text) as {
        summary_line?: string;
        driver_labels?: unknown;
        suppressor_labels?: unknown;
        timing_insight?: string;
        solunar_note?: string;
        actionable_tip?: string;
      };

      const summary = typeof p.summary_line === "string" ? p.summary_line.slice(0, 280) : "";
      const tip = typeof p.actionable_tip === "string" ? p.actionable_tip.slice(0, 280) : "";

      // Parse label arrays — must match expected counts; fall back gracefully
      const rawDrivers = Array.isArray(p.driver_labels) ? p.driver_labels : [];
      const rawSupps = Array.isArray(p.suppressor_labels) ? p.suppressor_labels : [];
      const driverLabels = rawDrivers
        .slice(0, positiveCount)
        .map((l) => (typeof l === "string" ? l.slice(0, 120) : ""));
      const suppressorLabels = rawSupps
        .slice(0, limitingCount)
        .map((l) => (typeof l === "string" ? l.slice(0, 120) : ""));

      const timingInsight = typeof p.timing_insight === "string" ? p.timing_insight.slice(0, 200) : "";
      const solunarNote = typeof p.solunar_note === "string" ? p.solunar_note.slice(0, 160) : "";

      if (summary && tip) {
        return { summary, driverLabels, suppressorLabels, timingInsight, solunarNote, tip, inT, outT };
      }
    } catch {
      /* fall through to null */
    }
    return null;
  } catch (e) {
    console.error("[how-fishing] polishReportCopy error:", e);
    return null;
  }
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
      try {
        const polished = await polishReportCopy(openaiKey, report, locationName, localDate);
        if (polished) {
          // Apply LLM-voiced labels to drivers and suppressors (fallback to engine label if count short)
          const updatedDrivers = report.drivers.map((d, i) => ({
            ...d,
            label: polished.driverLabels[i] && polished.driverLabels[i].length > 0
              ? polished.driverLabels[i]
              : d.label,
          }));
          const updatedSuppressors = report.suppressors.map((s, i) => ({
            ...s,
            label: polished.suppressorLabels[i] && polished.suppressorLabels[i].length > 0
              ? polished.suppressorLabels[i]
              : s.label,
          }));
          report = {
            ...report,
            summary_line: polished.summary,
            actionable_tip: polished.tip,
            drivers: updatedDrivers,
            suppressors: updatedSuppressors,
            timing_insight: polished.timingInsight || null,
            solunar_note: polished.solunarNote || null,
          };
          inT = polished.inT;
          outT = polished.outT;
        }
      } catch (e) {
        // Never fail the whole report if narration/OpenAI hiccups — ship engine copy.
        console.error("[how-fishing] polish path failed, using engine copy:", ctx, e);
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
      } catch (e) {
        console.error("[how-fishing] generateSingleReport failed:", ctx, e);
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
