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
const TIDE_STATION_MAX_MILES = 10;
const WATERLEVEL_STATIONS_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_TIDE_STATION_CANDIDATES = 8;
const MAX_HILO_PREDICTIONS_RETURNED = 56;
const EARTH_RADIUS_MILES = 3958.8;

interface NOAAStation {
  id?: string;
  name?: string;
  lat?: number;
  lon?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
}

interface TideEntry {
  time: string;
  type: "H" | "L";
  value: number;
}

interface ForecastTideDay {
  date: string;
  station_id: string;
  station_name: string;
  high_low: TideEntry[];
  phase?: string;
  unit: string;
}

let waterLevelStationsCache: { fetchedAt: number; stations: NOAAStation[] } | null = null;

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

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getWaterLevelStationsCached(): Promise<NOAAStation[] | null> {
  if (
    waterLevelStationsCache &&
    Date.now() - waterLevelStationsCache.fetchedAt < WATERLEVEL_STATIONS_TTL_MS
  ) {
    return waterLevelStationsCache.stations;
  }
  const stationsUrl =
    "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=waterlevels";
  try {
    const response = await fetch(stationsUrl, {
      headers: { "User-Agent": "TightLinesAI/2.0 (fishing app)" },
    });
    if (!response.ok) return waterLevelStationsCache?.stations ?? null;
    const json = await response.json();
    const stations: NOAAStation[] = json?.stations ?? json?.data?.stations ?? [];
    if (!Array.isArray(stations) || stations.length === 0) {
      return waterLevelStationsCache?.stations ?? null;
    }
    waterLevelStationsCache = { fetchedAt: Date.now(), stations };
    return stations;
  } catch {
    return waterLevelStationsCache?.stations ?? null;
  }
}

function rankNearbyTideStations(
  lat: number,
  lon: number,
  stations: NOAAStation[],
): Array<{ station: NOAAStation; miles: number }> {
  const out: Array<{ station: NOAAStation; miles: number }> = [];
  for (const station of stations) {
    const slat = Number(station.lat ?? station.latitude);
    const slon = Number(station.lng ?? station.lon ?? station.longitude);
    if (isNaN(slat) || isNaN(slon) || !station.id) continue;
    const miles = haversineMiles(lat, lon, slat, slon);
    if (miles <= TIDE_STATION_MAX_MILES) out.push({ station, miles });
  }
  out.sort((a, b) => a.miles - b.miles);
  return out.slice(0, MAX_TIDE_STATION_CANDIDATES);
}

function formatDateInZone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function tideDateRangeYyyymmdd(timezone: string): { beginDate: string; endDate: string } {
  const now = new Date();
  const beginDate = formatDateInZone(now, timezone).replace(/-/g, "");
  const endCap = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const endDate = formatDateInZone(endCap, timezone).replace(/-/g, "");
  return { beginDate, endDate };
}

function mapPredictionsToHighLow(
  preds: unknown,
): TideEntry[] {
  const arr = Array.isArray(preds) ? preds : [];
  return arr.slice(0, MAX_HILO_PREDICTIONS_RETURNED).map(
    (p: { t?: string; v?: string; type?: string }) => ({
      time: String(p.t ?? ""),
      type: p.type === "L" ? "L" : "H",
      value: parseFloat(String(p.v ?? 0)) || 0,
    }),
  );
}

async function fetchHiloPredictions(
  stationId: string,
  beginDate: string,
  endDate: string,
): Promise<TideEntry[]> {
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${stationId}` +
    `&format=json&interval=hilo&units=english&datum=mllw&begin_date=${beginDate}&end_date=${endDate}&time_zone=lst_ldt`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "TightLinesAI/2.0 (fishing app)" },
    });
    if (!response.ok) return [];
    const json = await response.json();
    return mapPredictionsToHighLow(json?.predictions ?? []);
  } catch {
    return [];
  }
}

function parseNoaaLocalTimeToUtcMs(localTime: string, tzHours: number): number {
  const asIfUtcMs = new Date(localTime.replace(" ", "T") + ":00Z").getTime();
  return asIfUtcMs - tzHours * 3600 * 1000;
}

function deriveTidePhaseForDate(
  highLow: TideEntry[],
  tzHours: number,
  date: string,
): string | undefined {
  if (highLow.length < 2) return undefined;
  const noonLocalMs = new Date(date + "T12:00:00Z").getTime() - tzHours * 3600 * 1000;
  const pastPreds = highLow.filter((entry) => parseNoaaLocalTimeToUtcMs(entry.time, tzHours) <= noonLocalMs);
  const futurePreds = highLow.filter((entry) => parseNoaaLocalTimeToUtcMs(entry.time, tzHours) > noonLocalMs);

  if (pastPreds.length > 0 && futurePreds.length > 0) {
    const lastPred = pastPreds[pastPreds.length - 1]!;
    const nextPred = futurePreds[0]!;
    const minsToNext = (parseNoaaLocalTimeToUtcMs(nextPred.time, tzHours) - noonLocalMs) / 60_000;
    if (minsToNext <= 30) return "approaching slack";
    return lastPred.type === "L" ? "incoming" : "outgoing";
  }
  if (pastPreds.length === 0 && futurePreds.length > 0) {
    const nextPred = futurePreds[0]!;
    const minsToNext = (parseNoaaLocalTimeToUtcMs(nextPred.time, tzHours) - noonLocalMs) / 60_000;
    if (minsToNext <= 30) return "approaching slack";
    return nextPred.type === "H" ? "incoming" : "outgoing";
  }
  if (futurePreds.length === 0 && pastPreds.length > 0) {
    const lastPred = pastPreds[pastPreds.length - 1]!;
    const minsSinceLast = (noonLocalMs - parseNoaaLocalTimeToUtcMs(lastPred.time, tzHours)) / 60_000;
    if (minsSinceLast <= 30) return "approaching slack";
    return lastPred.type === "L" ? "incoming" : "outgoing";
  }
  return undefined;
}

async function fetchForecastTides(
  latitude: number,
  longitude: number,
  timezone: string,
  tzOffsetHours: number,
): Promise<{
  coastal: boolean;
  nearest_tide_station_id: string | null;
  forecast_tides_by_date: ForecastTideDay[];
}> {
  const stations = await getWaterLevelStationsCached();
  if (!stations || stations.length === 0) {
    return { coastal: false, nearest_tide_station_id: null, forecast_tides_by_date: [] };
  }

  const candidates = rankNearbyTideStations(latitude, longitude, stations);
  if (candidates.length === 0) {
    return { coastal: false, nearest_tide_station_id: null, forecast_tides_by_date: [] };
  }

  const { beginDate, endDate } = tideDateRangeYyyymmdd(timezone);

  for (const { station } of candidates) {
    const stationId = String(station.id);
    const highLow = await fetchHiloPredictions(stationId, beginDate, endDate);
    if (highLow.length < 2) continue;

    const byDate = new Map<string, TideEntry[]>();
    for (const entry of highLow) {
      const date = String(entry.time).slice(0, 10);
      if (!date) continue;
      const bucket = byDate.get(date) ?? [];
      bucket.push(entry);
      byDate.set(date, bucket);
    }

    const forecast_tides_by_date = Array.from(byDate.entries())
      .map(([date, entries]) => ({
        date,
        station_id: stationId,
        station_name: String(station.name ?? stationId),
        high_low: entries,
        phase: deriveTidePhaseForDate(entries, tzOffsetHours, date),
        unit: "ft",
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (forecast_tides_by_date.length > 0) {
      return {
        coastal: true,
        nearest_tide_station_id: stationId,
        forecast_tides_by_date,
      };
    }
  }

  return { coastal: false, nearest_tide_station_id: null, forecast_tides_by_date: [] };
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
  const tideSnapshot = await fetchForecastTides(
    latitude,
    longitude,
    timezone,
    om.tz_offset_hours ?? 0,
  );
  const envRecord: Record<string, unknown> = {
    timezone: om.timezone,
    tz_offset_hours: om.tz_offset_hours,
    coastal: tideSnapshot.coastal,
    tides_available: tideSnapshot.forecast_tides_by_date.length > 0,
    nearest_tide_station_id: tideSnapshot.nearest_tide_station_id,
    weather: om.weather,
    hourly_pressure_mb: om.hourly_pressure_mb ?? [],
    hourly_air_temp_f: om.hourly_air_temp_f ?? [],
    hourly_cloud_cover_pct: om.hourly_cloud_cover_pct ?? [],
    hourly_wind_speed: om.hourly_wind_speed ?? [],
    forecast_tides_by_date: tideSnapshot.forecast_tides_by_date,
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
    const tideForDay =
      tideSnapshot.forecast_tides_by_date.find((entry) => entry.date === localDate) ?? null;
    slicedEnvRecord.tides_available = tideForDay != null;
    slicedEnvRecord.tides = tideForDay
      ? {
          station_id: tideForDay.station_id,
          station_name: tideForDay.station_name,
          high_low: tideForDay.high_low,
          phase: tideForDay.phase,
          unit: tideForDay.unit,
        }
      : null;

    const baseReq = buildSharedEngineRequestFromEnvData(
      latitude,
      longitude,
      localDate,
      timezone,
      "freshwater_lake_pond",
      slicedEnvRecord,
      D,
      D === 0 ? { useCalendarDayProfileForToday: true } : undefined,
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
