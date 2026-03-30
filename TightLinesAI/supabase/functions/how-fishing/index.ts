/**
 * how-fishing — Supabase Edge Function
 *
 * Rebuild path: single daily full-day report via howFishingEngine.
 * Contexts: freshwater_lake_pond | freshwater_river | coastal | coastal_flats_estuary
 * No 7-day weekly path. No exact timing windows. No V2/V3 engine.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildEngineLedSummaryLine,
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
  type EngineContext,
  type HowsFishingReport,
} from "../_shared/howFishingEngine/index.ts";
import { fetchOpenMeteo14Day } from "../_shared/openMeteo14DayFetch.ts";

const VALID_CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
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

function normalizeSurfaceText(text: string | null | undefined): string | null {
  if (!text) return null;
  return text.replace(/\s+/g, " ").trim();
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
  let envData = body.env_data as Record<string, unknown>;

  // day_offset > 0 means this is a forecast day report, not today's report.
  // target_date: caller-supplied YYYY-MM-DD for the forecast day.
  const dayOffset = typeof body.day_offset === "number" && body.day_offset > 0
    ? Math.min(Math.floor(body.day_offset), 6)
    : 0;
  const targetDateStr = dayOffset > 0 && typeof body.target_date === "string" && body.target_date.length === 10
    ? body.target_date
    : null;

  // Forecast-day reports: replace Open-Meteo-derived fields with a fresh server fetch so
  // scores match forecast-scores and client env_data cannot drift or omit hourly wind.
  if (dayOffset > 0) {
    const om = await fetchOpenMeteo14Day(lat, lon, "imperial");
    if (om?.weather) {
      envData = {
        ...envData,
        timezone: om.timezone ?? envData.timezone,
        tz_offset_hours: om.tz_offset_hours ?? envData.tz_offset_hours,
        weather: om.weather,
        hourly_pressure_mb: om.hourly_pressure_mb ?? [],
        hourly_air_temp_f: om.hourly_air_temp_f ?? [],
        hourly_cloud_cover_pct: om.hourly_cloud_cover_pct ?? [],
        hourly_wind_speed: om.hourly_wind_speed ?? [],
      };
    }
  }

  const timezone = extractTimezone(envData);
  const localDate = targetDateStr ?? localDateInTz(timezone);

  const locationName = typeof body.location_name === "string" && body.location_name.length > 0
    ? body.location_name
    : typeof body.city === "string" && body.city.length > 0
      ? body.city
      : null;
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
    const report = runHowFishingReport(sharedReq);
    const surfaced: HowsFishingReport = {
      ...report,
      summary_line: normalizeSurfaceText(buildEngineLedSummaryLine(report, locationName)) ?? report.summary_line,
      actionable_tip: normalizeSurfaceText(report.actionable_tip) ?? report.actionable_tip,
      timing_insight: normalizeSurfaceText(report.timing_insight) ?? null,
      solunar_note: normalizeSurfaceText(report.solunar_note) ?? null,
      drivers: report.drivers.map((d) => ({
        ...d,
        label: normalizeSurfaceText(d.label) ?? d.label,
      })),
      suppressors: report.suppressors.map((s) => ({
        ...s,
        label: normalizeSurfaceText(s.label) ?? s.label,
      })),
    };
    return { report: surfaced, inT: 0, outT: 0 };
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
          usage: { input_tokens: inT, output_tokens: outT, token_cost_usd: 0 },
        };
      } catch (e) {
        console.error("[how-fishing] generateSingleReport failed:", ctx, e);
        failedContexts.push(ctx);
      }
    }

    const totalCost = 0;
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
        message: `engine_context must be one of: ${VALID_CONTEXTS.join(", ")} (legacy saltwater/brackish map to coastal inshore)`,
      }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const { report: singleReport, inT: singleInT, outT: singleOutT } = await generateSingleReport(context);
  const singleCost = 0;

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
