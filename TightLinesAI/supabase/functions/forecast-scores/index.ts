/**
 * forecast-scores — Supabase Edge Function
 *
 * Runs the deterministic fishing engine for 7 days × 4 contexts (inland scores
 * for all four still returned; clients use lake+river only when not coastal-eligible).
 * No LLM, no auth required — returns raw scores only.
 * Used to populate the 7-day forecast calendar on the home screen.
 *
 * Uses the same Open-Meteo bundle as get-environment (past_days=14, forecast_days=7)
 * and buildSharedEngineRequestFromEnvData. The response also returns the exact weather
 * snapshot that generated the scores so future-day reports can reuse it until midnight.
 *
 * Per day: one buildFromEnvData (expensive Intl/hourly work), then shallow-clone the
 * request with each context — environment is identical; only context affects scoring.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { fetchOpenMeteo14Day } from "../_shared/openMeteo14DayFetch.ts";
import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingScoreOnly,
  type EngineContext,
} from "../_shared/howFishingEngine/index.ts";

const CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token",
  };
}

function num(x: unknown): number | null {
  if (x == null) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    });
  }

  const latitude = num(body.latitude);
  const longitude = num(body.longitude);
  if (latitude == null || longitude == null) {
    return new Response(
      JSON.stringify({ error: "latitude and longitude required" }),
      { status: 400, headers: { ...corsHeaders(), "Content-Type": "application/json" } },
    );
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 600;
  let om = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      om = await fetchOpenMeteo14Day(latitude, longitude, "imperial");
      if (om?.weather) break;
      if (om == null && attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      }
    } catch {
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }

  if (!om?.weather) {
    return new Response(
      JSON.stringify({ error: "Weather data unavailable" }),
      { status: 503, headers: { ...corsHeaders(), "Content-Type": "application/json" } },
    );
  }

  const timezone = om.timezone ?? "UTC";
  const envRecord: Record<string, unknown> = {
    timezone: om.timezone,
    tz_offset_hours: om.tz_offset_hours,
    weather: om.weather,
    hourly_pressure_mb: om.hourly_pressure_mb ?? [],
    hourly_air_temp_f: om.hourly_air_temp_f ?? [],
    hourly_cloud_cover_pct: om.hourly_cloud_cover_pct ?? [],
    hourly_wind_speed: om.hourly_wind_speed ?? [],
  };

  const days = om.forecast_daily ?? [];
  if (days.length === 0) {
    return new Response(
      JSON.stringify({ error: "Incomplete weather response" }),
      { status: 503, headers: { ...corsHeaders(), "Content-Type": "application/json" } },
    );
  }

  // Pre-extract full hourly arrays once so we can slice a tight window per day.
  // hourlyPointsTo24ArrayForLocalDate iterates every entry with an Intl call — passing
  // the full 504-entry (21-day) array 7× blows the edge function compute limit.
  // Slicing air/cloud/wind to ~3 days (~72 entries) per day offset reduces that by ~7×.
  //
  // NOTE: hourly_pressure_mb is NOT sliced here — buildSharedEngineRequestFromEnvData
  // accesses it by absolute index ((14+D)*24+12 as the noon anchor) and a relative slice
  // must preserve those absolute offsets. Pressure arrays are small objects so the cost
  // of passing them full is negligible compared to the Intl-heavy air/cloud/wind scans.
  const INTL_HEAVY_KEYS = [
    "hourly_air_temp_f",
    "hourly_cloud_cover_pct",
    "hourly_wind_speed",
  ] as const;

  const fullHourly: Record<string, Array<{ time_utc: string; value: number }>> = {};
  for (const key of INTL_HEAVY_KEYS) {
    const arr = envRecord[key];
    fullHourly[key] = Array.isArray(arr)
      ? (arr as Array<{ time_utc: string; value: number }>)
      : [];
  }

  const forecast = [];

  for (let D = 0; D < 7 && D < days.length; D++) {
    const localDate = days[D]!.date;
    if (!localDate || localDate.length !== 10) break;

    const [yr, mo, dy] = localDate.split("-").map(Number);
    const dateObj = new Date(Date.UTC(yr!, (mo ?? 1) - 1, dy ?? 1));
    const dayOfWeek = dateObj.getUTCDay();
    const dayLabel =
      D === 0 ? "Today" : D === 1 ? "Tmrw" : (DAY_NAMES[dayOfWeek] ?? "");
    const monthDay = `${mo}/${dy}`;

    // Slice air/cloud/wind arrays to a ~3-day window around the target day.
    // Index layout: past_days=14 → index 14*24=336 = today's midnight UTC.
    // Include one day before and one after to cover any timezone offset.
    const targetIdx = (14 + D) * 24;
    const sliceStart = Math.max(0, targetIdx - 24);
    const sliceEnd = targetIdx + 48; // exclusive — covers target + 1 buffer day
    const slicedEnvRecord: Record<string, unknown> = { ...envRecord };
    for (const key of INTL_HEAVY_KEYS) {
      slicedEnvRecord[key] = fullHourly[key]!.slice(sliceStart, sliceEnd);
    }

    const baseReq = buildSharedEngineRequestFromEnvData(
      latitude,
      longitude,
      localDate,
      timezone,
      "freshwater_lake_pond",
      slicedEnvRecord,
      D,
    );

    const scores: Record<string, number> = {};
    for (const context of CONTEXTS) {
      const sharedReq =
        context === "freshwater_lake_pond"
          ? baseReq
          : { ...baseReq, context };
      try {
        scores[context] = runHowFishingScoreOnly(sharedReq);
      } catch {
        scores[context] = 50;
      }
    }

    forecast.push({
      date: localDate,
      day_offset: D,
      day_label: dayLabel,
      month_day: monthDay,
      freshwater_lake_pond: scores["freshwater_lake_pond"] ?? 50,
      freshwater_river: scores["freshwater_river"] ?? 50,
      coastal: scores["coastal"] ?? 50,
      coastal_flats_estuary: scores["coastal_flats_estuary"] ?? 50,
    });
  }

  return new Response(JSON.stringify({ forecast, timezone, snapshot_env: envRecord }), {
    status: 200,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
});
