/**
 * forecast-scores — Supabase Edge Function
 *
 * Runs the deterministic fishing engine for 7 days × 3 contexts.
 * No LLM, no auth required — returns raw scores only.
 * Used to populate the 7-day forecast calendar on the home screen.
 *
 * Open-Meteo: past_days=2 + forecast_days=7 → 9 daily entries
 *   Index 0 = 2 days ago, Index 1 = yesterday, Index 2 = today (TODAY_DAILY_IDX)
 *   Indices 3–8 = D+1 through D+6
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  runHowFishingReport,
  type EngineContext,
  type SharedEngineRequest,
} from "../_shared/howFishingEngine/index.ts";
import { resolveRegionForCoordinates } from "../_shared/howFishingEngine/context/resolveRegion.ts";

const MM_TO_INCHES = 1 / 25.4;
const CONTEXTS: EngineContext[] = ["freshwater_lake_pond", "freshwater_river", "coastal"];
// With past_days=2: index 0 = 2 days ago, index 1 = yesterday, index 2 = today
const TODAY_DAILY_IDX = 2;
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

function safeNum(arr: number[], idx: number): number | null {
  return idx >= 0 && idx < arr.length ? (arr[idx] ?? null) : null;
}

function dailyMean(highs: number[], lows: number[], idx: number): number | null {
  const h = safeNum(highs, idx);
  const l = safeNum(lows, idx);
  if (h == null || l == null) return null;
  return (h + l) / 2;
}

async function fetchOpenMeteoForecast(
  lat: number,
  lon: number,
): Promise<Record<string, unknown> | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    // Hourly: pressure (48h window per day), cloud cover, precip, wind
    hourly: "pressure_msl,cloud_cover,wind_speed_10m,precipitation",
    // Daily: temp highs/lows, precip totals, max wind, dates
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
    past_days: "2",     // indices 0-1 = history, index 2 = today
    forecast_days: "7", // indices 2-8 (today + 6 ahead)
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TightLinesAI/2.0 (fishing app)" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
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

  const omData = await fetchOpenMeteoForecast(latitude, longitude);
  if (!omData) {
    return new Response(
      JSON.stringify({ error: "Weather data unavailable" }),
      { status: 503, headers: { ...corsHeaders(), "Content-Type": "application/json" } },
    );
  }

  const daily = omData.daily as Record<string, unknown[]> | undefined;
  const hourly = omData.hourly as Record<string, unknown[]> | undefined;
  const timezone = typeof omData.timezone === "string" ? omData.timezone : "UTC";

  if (!daily || !hourly) {
    return new Response(
      JSON.stringify({ error: "Incomplete weather response" }),
      { status: 503, headers: { ...corsHeaders(), "Content-Type": "application/json" } },
    );
  }

  // Parse arrays
  const dailyDates = (daily.time ?? []) as string[];
  const dailyHighs = ((daily.temperature_2m_max ?? []) as (number | null)[]).map(
    (v) => num(v) ?? 0,
  );
  const dailyLows = ((daily.temperature_2m_min ?? []) as (number | null)[]).map(
    (v) => num(v) ?? 0,
  );
  const dailyPrecipMm = ((daily.precipitation_sum ?? []) as (number | null)[]).map(
    (v) => num(v) ?? 0,
  );
  const dailyWindMax = ((daily.wind_speed_10m_max ?? []) as (number | null)[]).map(
    (v) => num(v) ?? 0,
  );
  const hourlyPressure = ((hourly.pressure_msl ?? []) as (number | null)[]).map(
    (v) => num(v) ?? 0,
  );
  const hourlyCloud = ((hourly.cloud_cover ?? []) as (number | null)[]).map(
    (v) => num(v) ?? 0,
  );
  // wind_speed_10m is already in the hourly request — use it for daily mean wind
  // instead of wind_speed_10m_max (daily peak), which overstates suppression vs
  // the point-in-time wind a live report would use.
  const hourlyWind = ((hourly.wind_speed_10m ?? []) as (number | null)[]).map(
    (v) => num(v) ?? 0,
  );

  const { state_code, region_key } = resolveRegionForCoordinates(latitude, longitude);

  const forecast = [];

  for (let D = 0; D < 7; D++) {
    const dailyIdx = TODAY_DAILY_IDX + D;
    if (dailyIdx >= dailyDates.length) break;

    const localDate = String(dailyDates[dailyIdx] ?? "");
    if (!localDate) break;

    // Noon hourly index for this day (hourly array: 9 days × 24 = 216 entries)
    const noonHourlyIdx = dailyIdx * 24 + 12;

    // 48-hour pressure window ending at noon of target day
    const pressureStart = Math.max(0, noonHourlyIdx - 47);
    const pressureSlice = hourlyPressure.slice(pressureStart, noonHourlyIdx + 1);
    const pressureNoon = safeNum(hourlyPressure, noonHourlyIdx);

    // Mean cloud cover and mean wind speed for the target day
    // (24-hour mean is more representative of angler conditions than the daily peak)
    const cloudStart = dailyIdx * 24;
    const cloudSlice = hourlyCloud.slice(cloudStart, cloudStart + 24);
    const cloudMean =
      cloudSlice.length > 0
        ? cloudSlice.reduce((a, b) => a + b, 0) / cloudSlice.length
        : null;

    const windSlice = hourlyWind.slice(cloudStart, cloudStart + 24);
    const windMean =
      windSlice.length > 0
        ? windSlice.reduce((a, b) => a + b, 0) / windSlice.length
        : safeNum(dailyWindMax, dailyIdx);

    // Precipitation totals (mm → inches)
    const precip24h =
      safeNum(dailyPrecipMm, dailyIdx) != null
        ? (dailyPrecipMm[dailyIdx]! * MM_TO_INCHES)
        : null;
    const precip72h = [dailyIdx - 2, dailyIdx - 1, dailyIdx]
      .filter((i) => i >= 0 && i < dailyPrecipMm.length)
      .reduce((sum, i) => sum + (dailyPrecipMm[i] ?? 0) * MM_TO_INCHES, 0);
    const precip7d = Array.from({ length: 7 }, (_, i) => dailyIdx - 6 + i)
      .filter((i) => i >= 0 && i < dailyPrecipMm.length)
      .reduce((sum, i) => sum + (dailyPrecipMm[i] ?? 0) * MM_TO_INCHES, 0);

    // Day label and display date
    const [yr, mo, dy] = localDate.split("-").map(Number);
    const dateObj = new Date(Date.UTC(yr!, (mo ?? 1) - 1, dy ?? 1));
    const dayOfWeek = dateObj.getUTCDay();
    const dayLabel =
      D === 0 ? "Today" : D === 1 ? "Tmrw" : (DAY_NAMES[dayOfWeek] ?? "");
    const monthDay = `${mo}/${dy}`;

    // Run engine for each context
    const scores: Record<string, number> = {};
    for (const context of CONTEXTS) {
      const req: SharedEngineRequest = {
        latitude,
        longitude,
        state_code,
        region_key,
        local_date: localDate,
        local_timezone: timezone,
        context,
        environment: {
          daily_mean_air_temp_f: dailyMean(dailyHighs, dailyLows, dailyIdx),
          prior_day_mean_air_temp_f:
            dailyIdx > 0 ? dailyMean(dailyHighs, dailyLows, dailyIdx - 1) : null,
          day_minus_2_mean_air_temp_f:
            dailyIdx > 1 ? dailyMean(dailyHighs, dailyLows, dailyIdx - 2) : null,
          pressure_mb: pressureNoon,
          pressure_history_mb: pressureSlice.length >= 2 ? pressureSlice : null,
          wind_speed_mph: windMean,
          cloud_cover_pct: cloudMean,
          precip_24h_in: precip24h,
          precip_72h_in: precip72h,
          precip_7d_in: precip7d,
          active_precip_now: false,
        },
        data_coverage: {},
      };

      try {
        const report = runHowFishingReport(req);
        scores[context] = report.score;
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
    });
  }

  return new Response(JSON.stringify({ forecast, timezone }), {
    status: 200,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
});
