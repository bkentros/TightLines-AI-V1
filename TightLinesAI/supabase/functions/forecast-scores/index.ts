/**
 * forecast-scores — Supabase Edge Function
 *
 * Runs the deterministic fishing engine for 7 days × 4 contexts (inland scores
 * for all four still returned; clients use lake+river only when not coastal-eligible).
 * No generative calls; requires a signed-in Supabase user token.
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
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchOpenMeteo14Day } from "../_shared/openMeteo14DayFetch.ts";
import {
  buildSharedEngineRequestFromEnvData,
  type EngineContext,
  runHowFishingScoreOnly,
} from "../_shared/howFishingEngine/index.ts";
import {
  checkUserRateLimit,
  rateLimitExceededResponse,
} from "../_shared/rateLimit.ts";

const CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
];
const FORECAST_SCORES_RATE_LIMITS = [
  { windowSeconds: 60, maxRequests: 45 },
  { windowSeconds: 86400, maxRequests: 500 },
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIDE_STATION_MAX_MILES = 10;
const WATERLEVEL_STATIONS_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_TIDE_STATION_CANDIDATES = 8;
const MAX_HILO_PREDICTIONS_RETURNED = 56;
const EARTH_RADIUS_MILES = 3958.8;
const SNAPSHOT_UNITS = "imperial";
const SNAPSHOT_CACHE_VERSION = "v1";
const NOAA_STATIONS_TIMEOUT_MS = 4_500;
const NOAA_PREDICTIONS_TIMEOUT_MS = 4_500;
const TIDE_SNAPSHOT_BUDGET_MS = 9_000;

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

let waterLevelStationsCache:
  | { fetchedAt: number; stations: NOAAStation[] }
  | null = null;
const forecastSnapshotMemoryCache = new Map<
  string,
  { expiresAtMs: number; payload: Record<string, unknown> }
>();

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, apikey, x-user-token",
  };
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function createServiceClient(): ReturnType<typeof createClient> | null {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

async function requireAuthenticatedUser(
  req: Request,
): Promise<Response | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) {
    return jsonError("Auth service is not configured", 500);
  }

  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader ? authHeader.replace("Bearer ", "") : null;
  const token = userToken ?? bearerToken;
  if (!token) {
    return jsonError("Missing authentication token", 401);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return jsonError("Unauthorized", 401);
  }

  const rateLimit = await checkUserRateLimit(supabase, {
    userId: user.id,
    feature: "forecast_scores",
    rules: FORECAST_SCORES_RATE_LIMITS,
  });
  if (!rateLimit.allowed) {
    return rateLimitExceededResponse(rateLimit, corsHeaders());
  }

  return null;
}

function num(x: unknown): number | null {
  if (x == null) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function latBucket(lat: number): number {
  return Math.round(lat * 100) / 100;
}

function lonBucket(lon: number): number {
  return Math.round(lon * 100) / 100;
}

function snapshotKey(lat: number, lon: number, localDate: string): string {
  return `${SNAPSHOT_CACHE_VERSION}:${latBucket(lat).toFixed(2)}:${
    lonBucket(lon).toFixed(2)
  }:${SNAPSHOT_UNITS}:${localDate}`;
}

function activeSnapshotMemoryKey(lat: number, lon: number): string {
  return `${SNAPSHOT_CACHE_VERSION}:${latBucket(lat).toFixed(2)}:${
    lonBucket(lon).toFixed(2)
  }:${SNAPSHOT_UNITS}`;
}

function nextMidnightInTimeZoneMs(
  timeZone: string,
  fromMs: number = Date.now(),
): number {
  const tz = typeof timeZone === "string" && timeZone.trim().length > 0
    ? timeZone.trim()
    : "UTC";
  try {
    const dayFmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const startKey = dayFmt.format(new Date(fromMs));
    let lo = fromMs;
    let hi = fromMs + 25 * 60 * 60 * 1000;
    if (dayFmt.format(new Date(hi)) === startKey) {
      hi = fromMs + 96 * 60 * 60 * 1000;
    }
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (dayFmt.format(new Date(mid)) === startKey) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  } catch {
    const midnight = new Date(fromMs);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime();
  }
}

function isUsableForecastSnapshotPayload(
  payload: unknown,
): payload is Record<string, unknown> {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      (payload as Record<string, unknown>).weather &&
      Array.isArray((payload as Record<string, unknown>).forecast_daily),
  );
}

async function readForecastScoreSnapshot(
  supabase: ReturnType<typeof createClient>,
  latitude: number,
  longitude: number,
): Promise<Record<string, unknown> | null> {
  const memoryKey = activeSnapshotMemoryKey(latitude, longitude);
  const memoryHit = forecastSnapshotMemoryCache.get(memoryKey);
  if (
    memoryHit &&
    memoryHit.expiresAtMs > Date.now() &&
    isUsableForecastSnapshotPayload(memoryHit.payload)
  ) {
    return memoryHit.payload;
  }

  try {
    const { data, error } = await supabase
      .from("forecast_score_snapshots")
      .select("payload,expires_at")
      .eq("latitude_bucket", latBucket(latitude))
      .eq("longitude_bucket", lonBucket(longitude))
      .eq("units", SNAPSHOT_UNITS)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const row = data as { payload?: unknown } | null;
    if (error || !isUsableForecastSnapshotPayload(row?.payload)) return null;
    forecastSnapshotMemoryCache.set(memoryKey, {
      expiresAtMs: new Date(
        (data as { expires_at?: string } | null)?.expires_at ?? 0,
      ).getTime(),
      payload: row.payload,
    });
    return row.payload;
  } catch {
    return null;
  }
}

async function writeForecastScoreSnapshot(
  supabase: ReturnType<typeof createClient>,
  latitude: number,
  longitude: number,
  timezone: string,
  localDate: string,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!isUsableForecastSnapshotPayload(payload)) return;
  const expiresAtMs = nextMidnightInTimeZoneMs(timezone);
  forecastSnapshotMemoryCache.set(
    activeSnapshotMemoryKey(latitude, longitude),
    {
      expiresAtMs,
      payload,
    },
  );
  const row = {
    snapshot_key: snapshotKey(latitude, longitude, localDate),
    latitude_bucket: latBucket(latitude),
    longitude_bucket: lonBucket(longitude),
    units: SNAPSHOT_UNITS,
    local_date: localDate,
    timezone,
    payload,
    expires_at: new Date(expiresAtMs).toISOString(),
  };
  try {
    await supabase.from("forecast_score_snapshots").upsert(row as any, {
      onConflict: "snapshot_key",
    });
  } catch {
    // Daily snapshot persistence is a determinism enhancement; never fail scoring.
  }
}

function intInRange(
  x: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  const n = Number(x);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function trimArray<T>(value: unknown, endExclusive: number): T[] | undefined {
  return Array.isArray(value)
    ? (value as T[]).slice(0, endExclusive)
    : undefined;
}

function trimSnapshotForMaxDayOffset(
  envRecord: Record<string, unknown>,
  maxDayOffset: number,
): Record<string, unknown> {
  const maxDailyLength = 14 + maxDayOffset + 1;
  const maxHourlyLength = maxDailyLength * 24;
  const weather = envRecord.weather && typeof envRecord.weather === "object"
    ? { ...(envRecord.weather as Record<string, unknown>) }
    : null;
  if (weather) {
    const highs = trimArray<number>(weather.temp_7day_high, maxDailyLength);
    const lows = trimArray<number>(weather.temp_7day_low, maxDailyLength);
    if (highs) weather.temp_7day_high = highs;
    if (lows) weather.temp_7day_low = lows;
  }
  return {
    ...envRecord,
    ...(weather ? { weather } : {}),
    forecast_daily: trimArray(envRecord.forecast_daily, maxDayOffset + 1) ?? [],
    hourly_pressure_mb:
      trimArray(envRecord.hourly_pressure_mb, maxHourlyLength) ?? [],
    hourly_air_temp_f:
      trimArray(envRecord.hourly_air_temp_f, maxHourlyLength) ?? [],
    hourly_cloud_cover_pct:
      trimArray(envRecord.hourly_cloud_cover_pct, maxHourlyLength) ?? [],
    hourly_wind_speed:
      trimArray(envRecord.hourly_wind_speed, maxHourlyLength) ?? [],
    hourly_weather_code:
      trimArray(envRecord.hourly_weather_code, maxHourlyLength) ?? [],
    hourly_precip_probability_pct:
      trimArray(envRecord.hourly_precip_probability_pct, maxHourlyLength) ??
        [],
    hourly_precipitation_in:
      trimArray(envRecord.hourly_precipitation_in, maxHourlyLength) ?? [],
    forecast_tides_by_date:
      trimArray(envRecord.forecast_tides_by_date, maxDayOffset + 1) ?? [],
  };
}

function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
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
    const response = await fetchWithTimeout(
      stationsUrl,
      {
        headers: { "User-Agent": "TightLinesAI/2.0 (fishing app)" },
      },
      NOAA_STATIONS_TIMEOUT_MS,
    );
    if (!response.ok) return waterLevelStationsCache?.stations ?? null;
    const json = await response.json();
    const stations: NOAAStation[] = json?.stations ?? json?.data?.stations ??
      [];
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

function tideDateRangeYyyymmdd(
  timezone: string,
): { beginDate: string; endDate: string } {
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
  timeoutMs: number = NOAA_PREDICTIONS_TIMEOUT_MS,
): Promise<TideEntry[]> {
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${stationId}` +
    `&format=json&interval=hilo&units=english&datum=mllw&begin_date=${beginDate}&end_date=${endDate}&time_zone=lst_ldt`;
  try {
    const response = await fetchWithTimeout(
      url,
      {
        headers: { "User-Agent": "TightLinesAI/2.0 (fishing app)" },
      },
      timeoutMs,
    );
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
  const noonLocalMs = new Date(date + "T12:00:00Z").getTime() -
    tzHours * 3600 * 1000;
  const pastPreds = highLow.filter((entry) =>
    parseNoaaLocalTimeToUtcMs(entry.time, tzHours) <= noonLocalMs
  );
  const futurePreds = highLow.filter((entry) =>
    parseNoaaLocalTimeToUtcMs(entry.time, tzHours) > noonLocalMs
  );

  if (pastPreds.length > 0 && futurePreds.length > 0) {
    const lastPred = pastPreds[pastPreds.length - 1]!;
    const nextPred = futurePreds[0]!;
    const minsToNext =
      (parseNoaaLocalTimeToUtcMs(nextPred.time, tzHours) - noonLocalMs) /
      60_000;
    if (minsToNext <= 30) return "approaching slack";
    return lastPred.type === "L" ? "incoming" : "outgoing";
  }
  if (pastPreds.length === 0 && futurePreds.length > 0) {
    const nextPred = futurePreds[0]!;
    const minsToNext =
      (parseNoaaLocalTimeToUtcMs(nextPred.time, tzHours) - noonLocalMs) /
      60_000;
    if (minsToNext <= 30) return "approaching slack";
    return nextPred.type === "H" ? "incoming" : "outgoing";
  }
  if (futurePreds.length === 0 && pastPreds.length > 0) {
    const lastPred = pastPreds[pastPreds.length - 1]!;
    const minsSinceLast =
      (noonLocalMs - parseNoaaLocalTimeToUtcMs(lastPred.time, tzHours)) /
      60_000;
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
  const deadlineMs = Date.now() + TIDE_SNAPSHOT_BUDGET_MS;
  const stations = await getWaterLevelStationsCached();
  if (!stations || stations.length === 0) {
    return {
      coastal: false,
      nearest_tide_station_id: null,
      forecast_tides_by_date: [],
    };
  }

  const candidates = rankNearbyTideStations(latitude, longitude, stations);
  if (candidates.length === 0) {
    return {
      coastal: false,
      nearest_tide_station_id: null,
      forecast_tides_by_date: [],
    };
  }

  const { beginDate, endDate } = tideDateRangeYyyymmdd(timezone);

  for (const { station } of candidates) {
    const remainingMs = deadlineMs - Date.now();
    if (remainingMs < 1_000) break;
    const stationId = String(station.id);
    const highLow = await fetchHiloPredictions(
      stationId,
      beginDate,
      endDate,
      Math.max(1_000, Math.min(NOAA_PREDICTIONS_TIMEOUT_MS, remainingMs)),
    );
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

  return {
    coastal: false,
    nearest_tide_station_id: null,
    forecast_tides_by_date: [],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405);
  }

  const authFailure = await requireAuthenticatedUser(req);
  if (authFailure) {
    return authFailure;
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const latitude = num(body.latitude);
  const longitude = num(body.longitude);
  if (latitude == null || latitude < -90 || latitude > 90) {
    return jsonError("Invalid latitude", 400);
  }
  if (longitude == null || longitude < -180 || longitude > 180) {
    return jsonError("Invalid longitude", 400);
  }
  const maxDayOffset = intInRange(body.max_day_offset, 6, 0, 6);
  const includeSnapshotEnv = body.include_snapshot_env !== false;

  const supabase = createServiceClient();
  if (!supabase) return jsonError("Auth service is not configured", 500);

  let envRecord = await readForecastScoreSnapshot(
    supabase,
    latitude,
    longitude,
  );

  if (!envRecord) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 600;
    let om = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        om = await fetchOpenMeteo14Day(latitude, longitude, SNAPSHOT_UNITS);
        if (om?.weather) break;
        if (om == null && attempt < MAX_RETRIES - 1) {
          await new Promise((r) =>
            setTimeout(r, RETRY_DELAY_MS * (attempt + 1))
          );
        }
      } catch {
        if (attempt < MAX_RETRIES - 1) {
          await new Promise((r) =>
            setTimeout(r, RETRY_DELAY_MS * (attempt + 1))
          );
        }
      }
    }

    if (!om?.weather) {
      return new Response(
        JSON.stringify({ error: "Weather data unavailable" }),
        {
          status: 503,
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        },
      );
    }

    const timezone = om.timezone ?? "UTC";
    const tideSnapshot = await fetchForecastTides(
      latitude,
      longitude,
      timezone,
      om.tz_offset_hours ?? 0,
    );

    envRecord = {
      timezone: om.timezone,
      tz_offset_hours: om.tz_offset_hours,
      coastal: tideSnapshot.coastal,
      tides_available: tideSnapshot.forecast_tides_by_date.length > 0,
      nearest_tide_station_id: tideSnapshot.nearest_tide_station_id,
      weather: om.weather,
      forecast_daily: om.forecast_daily ?? [],
      hourly_pressure_mb: om.hourly_pressure_mb ?? [],
      hourly_air_temp_f: om.hourly_air_temp_f ?? [],
      hourly_cloud_cover_pct: om.hourly_cloud_cover_pct ?? [],
      hourly_wind_speed: om.hourly_wind_speed ?? [],
      hourly_weather_code: om.hourly_weather_code ?? [],
      hourly_precip_probability_pct: om.hourly_precip_probability_pct ?? [],
      hourly_precipitation_in: om.hourly_precipitation_in ?? [],
      forecast_tides_by_date: tideSnapshot.forecast_tides_by_date,
    };

    const localDate = om.forecast_daily?.[0]?.date;
    if (localDate && localDate.length === 10) {
      await writeForecastScoreSnapshot(
        supabase,
        latitude,
        longitude,
        timezone,
        localDate,
        envRecord,
      );
    }
  }

  const timezone = typeof envRecord.timezone === "string"
    ? envRecord.timezone
    : "UTC";
  const days = Array.isArray(envRecord.forecast_daily)
    ? envRecord.forecast_daily as Array<{ date: string }>
    : [];
  if (days.length === 0) {
    return new Response(
      JSON.stringify({ error: "Incomplete weather response" }),
      {
        status: 503,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
      },
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
    "hourly_weather_code",
    "hourly_precip_probability_pct",
    "hourly_precipitation_in",
  ] as const;

  const fullHourly: Record<string, Array<{ time_utc: string; value: number }>> =
    {};
  for (const key of INTL_HEAVY_KEYS) {
    const arr = envRecord[key];
    fullHourly[key] = Array.isArray(arr)
      ? (arr as Array<{ time_utc: string; value: number }>)
      : [];
  }

  const forecastTidesByDate = Array.isArray(envRecord.forecast_tides_by_date)
    ? envRecord.forecast_tides_by_date as ForecastTideDay[]
    : [];
  const forecast = [];

  for (let D = 0; D <= maxDayOffset && D < days.length; D++) {
    const localDate = days[D]!.date;
    if (!localDate || localDate.length !== 10) break;

    const [yr, mo, dy] = localDate.split("-").map(Number);
    const dateObj = new Date(Date.UTC(yr!, (mo ?? 1) - 1, dy ?? 1));
    const dayOfWeek = dateObj.getUTCDay();
    const dayLabel = D === 0
      ? "Today"
      : D === 1
      ? "Tmrw"
      : (DAY_NAMES[dayOfWeek] ?? "");
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
    const tideForDay = forecastTidesByDate.find((entry) =>
      entry.date === localDate
    ) ?? null;
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
      const sharedReq = context === "freshwater_lake_pond"
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

  const responseBody = includeSnapshotEnv
    ? {
      forecast,
      timezone,
      snapshot_env: trimSnapshotForMaxDayOffset(envRecord, maxDayOffset),
    }
    : { forecast, timezone };

  return new Response(
    JSON.stringify(responseBody),
    {
      status: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
    },
  );
});
