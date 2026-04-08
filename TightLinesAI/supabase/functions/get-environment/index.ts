/**
 * get-environment — Supabase Edge Function
 *
 * Fetches weather (Open-Meteo), tides (NOAA CO-OPS), moon/sun (USNO), and
 * civil twilight (Sunrise-Sunset.org) in parallel. Returns a unified
 * EnvironmentData payload for the dashboard and AI features.
 *
 * v2: adds 7-day historical pressure, temperature, and precipitation;
 * civil twilight from Sunrise-Sunset.org; standardizes all time strings
 * to "HH:mm" local format before returning to the client.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchOpenMeteo14Day } from "../_shared/openMeteo14DayFetch.ts";
import {
  buildEnvironmentSnapshotKey,
  hasSufficientHourlyWeather,
  isEnvironmentSnapshotUsable,
  localDateFromUtcIso,
  mergeEnvironmentWithSnapshot,
  type EnvironmentSnapshotLike,
} from "./cache.ts";

// -----------------------------------------------------------------------------
// Types (mirror lib/env/types.ts — Edge Functions are isolated)
// -----------------------------------------------------------------------------

interface WeatherData {
  temperature: number;
  humidity: number;
  cloud_cover: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  gust_speed: number | null;
  temp_unit: string;
  wind_speed_unit: string;
  // Pressure trend
  pressure_trend?: 'rapidly_falling' | 'slowly_falling' | 'stable' | 'slowly_rising' | 'rapidly_rising';
  pressure_change_rate_mb_hr?: number;
  pressure_48hr?: number[];
  // Temp trend
  temp_trend_3day?: 'rapid_warming' | 'warming' | 'stable' | 'cooling' | 'rapid_cooling';
  temp_trend_direction_f?: number;
  temp_7day_high?: number[];
  temp_7day_low?: number[];
  // Precip history
  precip_48hr_inches?: number;
  precip_7day_inches?: number;
  precip_7day_daily?: number[];
  wind_speed_10m_max_daily?: number[];
}

interface TideData {
  station_id: string;
  station_name: string;
  high_low: { time: string; type: 'H' | 'L'; value: number }[];
  phase?: string;
  unit: string;
}

interface MoonData {
  phase: string;
  illumination: number;
  rise: string | null;
  set: string | null;
  upper_transit: string | null;
  lower_transit: string | null;
  is_waxing?: boolean | null;
}

interface SunData {
  sunrise: string;
  sunset: string;
  twilight_begin?: string;
  twilight_end?: string;
}

interface SolunarPeriod {
  start: string;
  end: string;
  type?: 'overhead' | 'underfoot';
}

interface SolunarData {
  major_periods: SolunarPeriod[];
  minor_periods: SolunarPeriod[];
}

interface EnvironmentData {
  weather_available: boolean;
  tides_available: boolean;
  moon_available: boolean;
  sun_available: boolean;
  weather?: WeatherData;
  tides?: TideData | null;
  moon?: MoonData;
  sun?: SunData;
  solunar?: SolunarData;
  fetched_at: string;
  // Added for core intelligence engine consumption
  timezone?: string;
  tz_offset_hours?: number;
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }>;
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }>;
  hourly_cloud_cover_pct?: Array<{ time_utc: string; value: number }>;
  /** Hourly wind — same unit as weather.wind_speed (mph or km/h) */
  hourly_wind_speed?: Array<{ time_utc: string; value: number }>;
  tide_predictions_30day?: Array<{ date: string; high_ft: number; low_ft: number }>;
  measured_water_temp_f?: number | null;
  measured_water_temp_source?: string | null;
  measured_water_temp_24h_ago_f?: number | null;
  measured_water_temp_72h_ago_f?: number | null;
  coastal?: boolean;
  nearest_tide_station_id?: string | null;
  altitude_ft?: number | null;
  forecast_daily?: Array<{
    date: string;
    high_temp_f: number;
    low_temp_f: number;
    precip_chance_pct: number;
    wind_mph_max: number;
    sunrise_local: string;
    sunset_local: string;
  }>;
  source_notes?: string[];
}

type EnvironmentSnapshotRow = {
  snapshot_key: string;
  latitude_bucket: number;
  longitude_bucket: number;
  units: "imperial" | "metric";
  local_date: string;
  payload: EnvironmentData;
  captured_at: string;
  has_hourly_weather: boolean;
  weather_available: boolean;
  tides_available: boolean;
  water_temp_available: boolean;
};

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const TIDE_STATION_MAX_MILES = 10;
/** NOAA returns ~300 water-level stations (~766KB JSON). Cache in-process to avoid re-downloading every request (timeouts → missing tides). */
const WATERLEVEL_STATIONS_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_TIDE_STATION_CANDIDATES = 8;
const MAX_HILO_PREDICTIONS_RETURNED = 56;
const EARTH_RADIUS_MILES = 3958.8;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function derivePhaseFromIllumination(frac: number): string {
  // NOTE: illumination alone cannot distinguish waxing vs waning.
  // This fallback is only used when USNO curphase is unavailable.
  if (frac <= 0.05) return 'New Moon';
  if (frac <= 0.4) return 'Crescent';  // waxing/waning unknown
  if (frac <= 0.6) return 'Quarter';   // first/third unknown
  if (frac <= 0.9) return 'Gibbous';   // waxing/waning unknown
  return 'Full Moon';
}

/**
 * Rough US timezone offset from longitude.
 * Only used as a fallback when live provider offsets are unavailable.
 */
function getTzOffsetHours(lon: number): number {
  if (lon >= -81) return -5;   // Eastern
  if (lon >= -96) return -6;   // Central
  if (lon >= -114) return -7;  // Mountain
  return -8;                   // Pacific
}

/**
 * Convert a UTC ISO string to local "HH:mm" using the given tz offset.
 * e.g. "2026-03-11T12:08:00Z" with tz=-5 → "07:08"
 */
function isoUtcToLocalHHMM(isoStr: string, tzHours: number): string {
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return '—';
  const utcH = d.getUTCHours();
  const utcM = d.getUTCMinutes();
  let localH = utcH + tzHours;
  if (localH < 0) localH += 24;
  if (localH >= 24) localH -= 24;
  return `${String(localH).padStart(2, '0')}:${String(utcM).padStart(2, '0')}`;
}

/**
 * Add minutes to a local "HH:mm" time and return a local "HH:mm" string.
 * Handles wrapping past midnight.
 */
function addMinsToHHMM(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  if (h === undefined || m === undefined || isNaN(h) || isNaN(m)) return '—';
  const totalMins = h * 60 + m + minutes;
  const wrapped = ((totalMins % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function latBucket(lat: number): number {
  return Math.round(lat * 100) / 100;
}

function lonBucket(lon: number): number {
  return Math.round(lon * 100) / 100;
}

async function readEnvironmentSnapshot(
  supabase: any,
  snapshotKey: string,
): Promise<EnvironmentData | null> {
  try {
    const { data, error } = await supabase
      .from("environment_snapshots")
      .select("payload")
      .eq("snapshot_key", snapshotKey)
      .maybeSingle();
    const row = data as { payload?: EnvironmentData } | null;
    if (error || !row?.payload) return null;
    return row.payload;
  } catch {
    return null;
  }
}

async function writeEnvironmentSnapshot(
  supabase: any,
  snapshotKey: string,
  lat: number,
  lon: number,
  units: "imperial" | "metric",
  localDate: string,
  payload: EnvironmentData,
): Promise<void> {
  if (!isEnvironmentSnapshotUsable(payload as EnvironmentSnapshotLike)) return;

  const row: EnvironmentSnapshotRow = {
    snapshot_key: snapshotKey,
    latitude_bucket: latBucket(lat),
    longitude_bucket: lonBucket(lon),
    units,
    local_date: localDate,
    payload,
    captured_at: payload.fetched_at,
    has_hourly_weather: hasSufficientHourlyWeather(payload as EnvironmentSnapshotLike),
    weather_available: payload.weather_available,
    tides_available: payload.tides_available,
    water_temp_available: payload.measured_water_temp_f != null,
  };

  try {
    await supabase.from("environment_snapshots").upsert(row as any, {
      onConflict: "snapshot_key",
    });
  } catch {
    // Snapshot fallback is a reliability enhancement, never a hard dependency.
  }
}


// -----------------------------------------------------------------------------
// Sunrise-Sunset.org — civil twilight
// -----------------------------------------------------------------------------

async function fetchCivilTwilight(
  lat: number,
  lon: number,
  tzHours: number
): Promise<{ twilight_begin: string; twilight_end: string } | null> {
  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today&formatted=0`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TightLinesAI/2.0 (fishing app)' } });
    if (!res.ok) return null;
    const json = await res.json();
    const results = json?.results;
    if (!results) return null;

    const begin = results.civil_twilight_begin;
    const end = results.civil_twilight_end;
    if (!begin || !end) return null;

    return {
      twilight_begin: isoUtcToLocalHHMM(String(begin), tzHours),
      twilight_end: isoUtcToLocalHHMM(String(end), tzHours),
    };
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// NOAA CO-OPS — tides
// -----------------------------------------------------------------------------

interface NOAAStation {
  id?: string;
  name?: string;
  lat?: number;
  lon?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
}

let waterLevelStationsCache: { fetchedAt: number; stations: NOAAStation[] } | null = null;

interface NOAAResult {
  tides: TideData | null;
  nearestMiles: number;
  stationId: string | null;
  tide_predictions_30day?: Array<{ date: string; high_ft: number; low_ft: number }>;
  measured_water_temp_f?: number | null;
  measured_water_temp_24h_ago_f?: number | null;
  measured_water_temp_72h_ago_f?: number | null;
  measured_water_temp_source?: "noaa_coops" | null;
}

interface NOAAObservation {
  t?: string;
  v?: string;
}

function parseNoaaLocalTimeToUtcMs(localTime: string, tzHours: number): number {
  const asIfUtcMs = new Date(localTime.replace(' ', 'T') + ':00Z').getTime();
  return asIfUtcMs - tzHours * 3600 * 1000;
}

function pickClosestObservationValueF(
  observations: NOAAObservation[],
  tzHours: number,
  targetUtcMs: number,
  maxDiffHours: number
): number | null {
  let closest: { value: number; diff: number } | null = null;
  for (const obs of observations) {
    const time = String(obs.t ?? '');
    const value = parseFloat(String(obs.v ?? ''));
    if (!time || !Number.isFinite(value)) continue;
    const diff = Math.abs(parseNoaaLocalTimeToUtcMs(time, tzHours) - targetUtcMs);
    if (!closest || diff < closest.diff) {
      closest = { value, diff };
    }
  }
  if (!closest || closest.diff > maxDiffHours * 3600 * 1000) return null;
  return Math.round(closest.value * 10) / 10;
}

async function fetchNoaaWaterTemperature(
  stationId: string,
  tzHours: number
): Promise<{
  measured_water_temp_f: number | null;
  measured_water_temp_24h_ago_f: number | null;
  measured_water_temp_72h_ago_f: number | null;
  measured_water_temp_source: "noaa_coops" | null;
}> {
  try {
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_temperature&station=${stationId}&format=json&units=english&time_zone=lst_ldt&range=96`;
    const res = await fetch(url, { headers: { 'User-Agent': 'TightLinesAI/2.0 (fishing app)' } });
    if (!res.ok) {
      return {
        measured_water_temp_f: null,
        measured_water_temp_24h_ago_f: null,
        measured_water_temp_72h_ago_f: null,
        measured_water_temp_source: null,
      };
    }
    const json = await res.json();
    const observations: NOAAObservation[] = Array.isArray(json?.data) ? json.data : [];
    if (observations.length === 0) {
      return {
        measured_water_temp_f: null,
        measured_water_temp_24h_ago_f: null,
        measured_water_temp_72h_ago_f: null,
        measured_water_temp_source: null,
      };
    }

    const latest = pickClosestObservationValueF(observations, tzHours, Date.now(), 12);
    const twentyFourHoursAgo = pickClosestObservationValueF(
      observations,
      tzHours,
      Date.now() - 24 * 3600 * 1000,
      12
    );
    const seventyTwoHoursAgo = pickClosestObservationValueF(
      observations,
      tzHours,
      Date.now() - 72 * 3600 * 1000,
      12
    );

    if (latest === null) {
      return {
        measured_water_temp_f: null,
        measured_water_temp_24h_ago_f: null,
        measured_water_temp_72h_ago_f: null,
        measured_water_temp_source: null,
      };
    }

    return {
      measured_water_temp_f: latest,
      measured_water_temp_24h_ago_f: twentyFourHoursAgo,
      measured_water_temp_72h_ago_f: seventyTwoHoursAgo,
      measured_water_temp_source: "noaa_coops",
    };
  } catch {
    return {
      measured_water_temp_f: null,
      measured_water_temp_24h_ago_f: null,
      measured_water_temp_72h_ago_f: null,
      measured_water_temp_source: null,
    };
  }
}

/** Local calendar begin/end for NOAA begin_date/end_date (aligns with Open-Meteo IANA tz). */
function tideHiloDateRangeYyyymmdd(ianaTimeZone: string): { beginDate: string; endDate: string } {
  try {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: ianaTimeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const toCompact = (d: Date) => fmt.format(d).replace(/-/g, '');
    const beginDate = toCompact(now);
    const endCap = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endDate = toCompact(endCap);
    return { beginDate, endDate };
  } catch {
    const now = new Date();
    const beginDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return { beginDate, endDate: end.toISOString().slice(0, 10).replace(/-/g, '') };
  }
}

async function getWaterLevelStationsCached(): Promise<NOAAStation[] | null> {
  if (
    waterLevelStationsCache &&
    Date.now() - waterLevelStationsCache.fetchedAt < WATERLEVEL_STATIONS_TTL_MS
  ) {
    return waterLevelStationsCache.stations;
  }
  const stationsUrl =
    'https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=waterlevels';
  try {
    const stationsRes = await fetch(stationsUrl, {
      headers: { 'User-Agent': 'TightLinesAI/2.0 (fishing app)' },
    });
    if (!stationsRes.ok) return waterLevelStationsCache?.stations ?? null;
    const stationsJson = await stationsRes.json();
    const stations: NOAAStation[] = stationsJson?.stations ?? stationsJson?.data?.stations ?? [];
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
  maxMiles: number,
  limit: number,
): Array<{ station: NOAAStation; miles: number }> {
  const out: Array<{ station: NOAAStation; miles: number }> = [];
  for (const s of stations) {
    const slat = Number(s.lat ?? s.latitude);
    const slon = Number(s.lng ?? s.lon ?? s.longitude);
    if (isNaN(slat) || isNaN(slon) || !s.id) continue;
    const miles = haversineMiles(lat, lon, slat, slon);
    if (miles <= maxMiles) out.push({ station: s, miles });
  }
  out.sort((a, b) => a.miles - b.miles);
  return out.slice(0, limit);
}

function mapPredictionsToHighLow(
  preds: unknown,
): Array<{ time: string; type: 'H' | 'L'; value: number }> {
  const arr = Array.isArray(preds) ? preds : [];
  return arr.slice(0, MAX_HILO_PREDICTIONS_RETURNED).map(
    (p: { t?: string; v?: string; type?: string }) => ({
      time: String(p.t ?? ''),
      type: (p.type === 'L' ? 'L' : 'H') as 'H' | 'L',
      value: parseFloat(String(p.v ?? 0)) || 0,
    }),
  );
}

async function fetchHiloPredictions(
  stationId: string,
  units: 'imperial' | 'metric',
  beginDate: string,
  endDate: string,
): Promise<Array<{ time: string; type: 'H' | 'L'; value: number }>> {
  const unitsParam = units === 'imperial' ? 'english' : 'metric';
  const predUrl =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${stationId}&format=json&interval=hilo&units=${unitsParam}&datum=mllw&begin_date=${beginDate}&end_date=${endDate}&time_zone=lst_ldt`;
  try {
    const predRes = await fetch(predUrl, { headers: { 'User-Agent': 'TightLinesAI/2.0 (fishing app)' } });
    if (!predRes.ok) return [];
    const predJson = await predRes.json();
    return mapPredictionsToHighLow(predJson?.predictions ?? []);
  } catch {
    return [];
  }
}

function deriveTidePhaseFromHighLow(
  highLow: Array<{ time: string; type: 'H' | 'L'; value: number }>,
  tzHours: number,
): string | undefined {
  if (highLow.length < 2) return undefined;
  const nowMs = Date.now();
  const parseNOAALocalTime = (t: string) => parseNoaaLocalTimeToUtcMs(t, tzHours);
  const pastPreds = highLow.filter((p) => parseNOAALocalTime(p.time) <= nowMs);
  const futurePreds = highLow.filter((p) => parseNOAALocalTime(p.time) > nowMs);
  if (pastPreds.length > 0 && futurePreds.length > 0) {
    const lastPred = pastPreds[pastPreds.length - 1]!;
    const nextPred = futurePreds[0]!;
    const minsToNext = (parseNOAALocalTime(nextPred.time) - nowMs) / 60000;
    if (minsToNext <= 30) {
      return 'approaching slack';
    }
    if (lastPred.type === 'L') {
      return 'incoming';
    }
    return 'outgoing';
  }
  return undefined;
}

async function fetchNOAA(
  lat: number,
  lon: number,
  units: 'imperial' | 'metric',
  tzHours: number,
  ianaTimeZone: string,
): Promise<NOAAResult | null> {
  const stations = await getWaterLevelStationsCached();
  if (!stations || stations.length === 0) return null;

  const candidates = rankNearbyTideStations(
    lat,
    lon,
    stations,
    TIDE_STATION_MAX_MILES,
    MAX_TIDE_STATION_CANDIDATES,
  );

  if (candidates.length === 0) {
    return {
      tides: null,
      nearestMiles: Infinity,
      stationId: null,
      measured_water_temp_f: null,
      measured_water_temp_24h_ago_f: null,
      measured_water_temp_72h_ago_f: null,
      measured_water_temp_source: null,
    };
  }

  const { beginDate, endDate } = tideHiloDateRangeYyyymmdd(ianaTimeZone);

  for (const { station, miles } of candidates) {
    const stationId = String(station.id);
    const highLow = await fetchHiloPredictions(stationId, units, beginDate, endDate);
    if (highLow.length < 2) continue;

    const phase = deriveTidePhaseFromHighLow(highLow, tzHours);
    const waterTemp = await fetchNoaaWaterTemperature(stationId, tzHours);

    return {
      tides: {
        station_id: stationId,
        station_name: String(station.name ?? stationId),
        high_low: highLow,
        phase,
        unit: units === 'imperial' ? 'ft' : 'm',
      },
      nearestMiles: miles,
      stationId,
      tide_predictions_30day: await fetch30DayTideRange(stationId, units, tzHours),
      ...waterTemp,
    };
  }

  const fallback = candidates[0]!;
  const stationId = String(fallback.station.id);
  const waterTemp = await fetchNoaaWaterTemperature(stationId, tzHours);
  return {
    tides: null,
    nearestMiles: fallback.miles,
    stationId,
    tide_predictions_30day: [],
    ...waterTemp,
  };
}

// Fetch 30-day daily tide range for tide strength calculation (Section 4E)
async function fetch30DayTideRange(
  stationId: string,
  units: 'imperial' | 'metric',
  tzHours: number
): Promise<Array<{ date: string; high_ft: number; low_ft: number }>> {
  try {
    const today = new Date();
    const endDate = today.toISOString().slice(0, 10).replace(/-/g, '');
    const start = new Date(today.getTime() - 30 * 24 * 3600 * 1000);
    const beginDate = start.toISOString().slice(0, 10).replace(/-/g, '');
    const unitsParam = units === 'imperial' ? 'english' : 'metric';

    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${stationId}&format=json&interval=hilo&units=${unitsParam}&datum=mllw&begin_date=${beginDate}&end_date=${endDate}&time_zone=lst_ldt`;
    const res = await fetch(url, { headers: { 'User-Agent': 'TightLinesAI/2.0 (fishing app)' } });
    if (!res.ok) return [];

    const json = await res.json();
    const preds: Array<{ t?: string; v?: string; type?: string }> = json?.predictions ?? [];
    if (!Array.isArray(preds) || preds.length === 0) return [];

    // Group predictions by date
    const byDate: Record<string, { highs: number[]; lows: number[] }> = {};
    for (const p of preds) {
      const date = String(p.t ?? '').slice(0, 10);
      if (!date) continue;
      if (!byDate[date]) byDate[date] = { highs: [], lows: [] };
      const val = parseFloat(String(p.v ?? '0')) || 0;
      if (p.type === 'H') byDate[date].highs.push(val);
      else byDate[date].lows.push(val);
    }

    return Object.entries(byDate)
      .filter(([, v]) => v.highs.length > 0 && v.lows.length > 0)
      .map(([date, v]) => ({
        date,
        high_ft: Math.max(...v.highs),
        low_ft: Math.min(...v.lows),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

// -----------------------------------------------------------------------------
// USNO — moon phase and rise/set times
// -----------------------------------------------------------------------------

interface USNOResult {
  moon?: MoonData;
  sun?: SunData;
}

async function fetchUSNO(lat: number, lon: number, tzHours: number): Promise<USNOResult | null> {
  const today = new Date().toISOString().slice(0, 10);
  const coords = `${lat},${lon}`;
  const url = `https://aa.usno.navy.mil/api/rstt/oneday?date=${today}&coords=${coords}&tz=${tzHours}`;

  const res = await fetch(url, { headers: { 'User-Agent': 'TightLinesAI/2.0 (fishing app)' } });
  if (!res.ok) return null;

  const json = await res.json();
  // USNO v4 API nests all data under properties.data
  const data = json?.properties?.data ?? json ?? {};
  const moondata: { phen?: string; time?: string }[] = data?.moondata ?? [];
  const sundata: { phen?: string; time?: string }[] = data?.sundata ?? [];
  const phasedata = data;

  let rise: string | null = null;
  let set: string | null = null;
  let upperTransit: string | null = null;

  // USNO returns full phenomenon strings: "Rise", "Set", "Upper Transit"
  for (const m of moondata) {
    const phen = String(m?.phen ?? '').toLowerCase();
    const t = m?.time ?? '';
    if (phen === 'rise') rise = t;
    else if (phen === 'set') set = t;
    else if (phen.includes('upper transit')) upperTransit = t;
  }

  let sunRise: string | null = null;
  let sunSet: string | null = null;
  let civilTwilightBegin: string | null = null;
  let civilTwilightEnd: string | null = null;
  for (const s of sundata) {
    const phen = String(s?.phen ?? '').toLowerCase();
    const t = s?.time ?? '';
    if (phen === 'rise') sunRise = t;
    else if (phen === 'set') sunSet = t;
    else if (phen.includes('begin civil twilight')) civilTwilightBegin = t;
    else if (phen.includes('end civil twilight')) civilTwilightEnd = t;
  }

  let phase = phasedata?.curphase ?? phasedata?.phase ?? null;
  let frac = phasedata?.frac;
  if (frac == null && phasedata?.fracillum != null) {
    const s = String(phasedata.fracillum).replace('%', '');
    frac = parseFloat(s) / 100;
  }
  const illumination = typeof frac === 'number' ? frac : parseFloat(String(frac ?? 0)) || 0;

  // Determine waxing/waning from curphase text before falling back to illumination
  let isWaxing: boolean | null = null;
  if (phase) {
    const phaseStr = String(phase).toLowerCase();
    if (phaseStr.includes('waxing')) isWaxing = true;
    else if (phaseStr.includes('waning')) isWaxing = false;
    else if (phaseStr.includes('new moon')) isWaxing = null; // N/A
    else if (phaseStr.includes('full moon')) isWaxing = null; // N/A
  }

  if (!phase || String(phase).toLowerCase() === 'unknown') {
    phase = derivePhaseFromIllumination(illumination);
  }

  // Compute lower transit (underfoot) = upper transit + 12 hours
  let lowerTransit: string | null = null;
  if (upperTransit) {
    lowerTransit = addMinsToHHMM(upperTransit, 12 * 60);
  }

  const moon: MoonData = {
    phase: String(phase),
    illumination,
    rise,
    set,
    upper_transit: upperTransit,
    lower_transit: lowerTransit,
    is_waxing: isWaxing,
  };

  let sun: SunData | undefined;
  if (sunRise && sunSet) {
    // USNO returns local "HH:mm" — already in correct format
    // Civil twilight also sourced from USNO sundata
    sun = {
      sunrise: sunRise,
      sunset: sunSet,
      twilight_begin: civilTwilightBegin ?? undefined,
      twilight_end: civilTwilightEnd ?? undefined,
    };
  }

  return { moon, sun };
}

// -----------------------------------------------------------------------------
// Open-Meteo — elevation
// -----------------------------------------------------------------------------

async function fetchElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    // Open-Meteo returns elevation in meters; convert to feet
    const meters = data?.elevation?.[0] ?? data?.elevation ?? null;
    if (meters === null || meters === undefined) return null;
    return Math.round(Number(meters) * 3.28084);
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Solunar computation — uses HH:mm strings throughout
// -----------------------------------------------------------------------------

// Phase-modulated solunar window duration
function getSolunarHalfWindow(
  moonPhase: string | null,
  periodType: "major" | "minor"
): number {
  const phase = (moonPhase ?? "").toLowerCase();
  if (phase.includes("new") || phase.includes("full")) {
    return periodType === "major" ? 75 : 45;
  }
  if (phase.includes("gibbous")) {
    return periodType === "major" ? 65 : 35;
  }
  if (phase.includes("quarter")) {
    return periodType === "major" ? 50 : 28;
  }
  if (phase.includes("crescent")) {
    return periodType === "major" ? 35 : 20;
  }
  return periodType === "major" ? 60 : 30;
}

function computeSolunar(moon: MoonData): SolunarData {
  const major: SolunarPeriod[] = [];
  const minor: SolunarPeriod[] = [];

  const majorHalf = getSolunarHalfWindow(moon.phase, "major");
  const minorHalf = getSolunarHalfWindow(moon.phase, "minor");

  const addPeriod = (
    timeStr: string | null,
    halfMins: number,
    type?: 'overhead' | 'underfoot'
  ) => {
    if (!timeStr) return;
    // Ensure "HH:mm" format (USNO returns "HH:mm" already)
    const t = timeStr.includes(':') ? timeStr : null;
    if (!t) return;
    const start = addMinsToHHMM(t, -halfMins);
    const end = addMinsToHHMM(t, halfMins);
    if (type) {
      major.push({ start, end, type });
    } else {
      minor.push({ start, end });
    }
  };

  addPeriod(moon.upper_transit, majorHalf, 'overhead');
  addPeriod(moon.lower_transit, majorHalf, 'underfoot');
  addPeriod(moon.rise, minorHalf);
  addPeriod(moon.set, minorHalf);

  return { major_periods: major, minor_periods: minor };
}

// -----------------------------------------------------------------------------
// Main handler
// -----------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-user-token',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Auth: accept x-user-token (ES256 client), Authorization bearer, or service role key (internal calls)
  const userToken = req.headers.get("x-user-token");
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader ? authHeader.replace("Bearer ", "") : null;
  const isServiceCall = bearerToken === supabaseServiceKey;

  if (!isServiceCall) {
    // Client call — validate user token
    const token = userToken || bearerToken;
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing authentication token" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }
  // Service role calls (from how-fishing) skip user auth — caller already validated the user

  let body: { latitude?: number; longitude?: number; units?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  const units = body.units === 'metric' ? 'metric' : 'imperial';

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return new Response(JSON.stringify({ error: 'Invalid latitude' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
  if (isNaN(lon) || lon < -180 || lon > 180) {
    return new Response(JSON.stringify({ error: 'Invalid longitude' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const meteo = await fetchOpenMeteo14Day(lat, lon, units);
  const tzHours = meteo?.tz_offset_hours ?? getTzOffsetHours(lon);
  const timezone = meteo?.timezone ?? "UTC";
  const fetchedAt = new Date().toISOString();
  const localDate = localDateFromUtcIso(fetchedAt, tzHours);
  const snapshotKey = buildEnvironmentSnapshotKey(lat, lon, units, localDate);

  // Fetch all remaining sources in parallel once the live timezone offset is known.
  const [snapshotResult, twilightResult, noaaResult, usnoResult, elevationResult] = await Promise.allSettled([
    readEnvironmentSnapshot(supabase, snapshotKey),
    fetchCivilTwilight(lat, lon, tzHours),
    fetchNOAA(lat, lon, units, tzHours, timezone),
    fetchUSNO(lat, lon, tzHours),
    fetchElevation(lat, lon),
  ]);

  const cachedSnapshot = snapshotResult.status === 'fulfilled' ? snapshotResult.value : null;
  const twilight = twilightResult.status === 'fulfilled' ? twilightResult.value : null;
  const noaa = noaaResult.status === 'fulfilled' ? noaaResult.value : null;
  const usno = usnoResult.status === 'fulfilled' ? usnoResult.value : null;
  const altitude_ft = elevationResult.status === 'fulfilled' ? elevationResult.value : null;

  // ─── Tides ─────────────────────────────────────────────────────────────────
  let tides_available = false;
  let tides: TideData | null = null;

  if (noaa?.tides) {
    tides_available = true;
    tides = noaa.tides;
  }

  // ─── Sun — merge USNO (preferred) + Open-Meteo fallback + twilight ─────────
  // USNO now provides civil twilight directly in sundata, so use it when available.
  // Fall back to the Sunrise-Sunset.org result only if USNO didn't supply twilight.
  const rawSun = usno?.sun ?? meteo?.sun;
  let sun: SunData | undefined;
  if (rawSun) {
    sun = {
      sunrise: rawSun.sunrise,
      sunset: rawSun.sunset,
      twilight_begin: rawSun.twilight_begin ?? twilight?.twilight_begin,
      twilight_end: rawSun.twilight_end ?? twilight?.twilight_end,
    };
  }

  // ─── Moon + Solunar ────────────────────────────────────────────────────────
  const moon = usno?.moon;
  const solunar = moon ? computeSolunar(moon) : undefined;

  const liveResponse: EnvironmentData = {
    weather_available: Boolean(meteo?.weather && typeof meteo.weather.temperature === 'number'),
    tides_available,
    moon_available: Boolean(moon?.phase),
    sun_available: Boolean(sun?.sunrise && sun?.sunset),
    weather: meteo?.weather,
    tides,
    moon,
    sun,
    solunar,
    fetched_at: fetchedAt,
    // Engine snapshot fields — used by how-fishing and future AI features
    timezone,
    tz_offset_hours: tzHours,
    hourly_pressure_mb: meteo?.hourly_pressure_mb ?? [],
    hourly_air_temp_f: meteo?.hourly_air_temp_f ?? [],
    hourly_cloud_cover_pct: meteo?.hourly_cloud_cover_pct ?? [],
    hourly_wind_speed: meteo?.hourly_wind_speed ?? [],
    tide_predictions_30day: noaa?.tide_predictions_30day ?? [],
    measured_water_temp_f: noaa?.measured_water_temp_f ?? null,
    measured_water_temp_source: noaa?.measured_water_temp_source ?? null,
    measured_water_temp_24h_ago_f: noaa?.measured_water_temp_24h_ago_f ?? null,
    measured_water_temp_72h_ago_f: noaa?.measured_water_temp_72h_ago_f ?? null,
    coastal: Boolean(noaa?.tides),
    nearest_tide_station_id: noaa?.stationId ?? null,
    altitude_ft: altitude_ft,
    forecast_daily: meteo?.forecast_daily ?? [],
  };

  const response = mergeEnvironmentWithSnapshot(
    liveResponse as EnvironmentSnapshotLike,
    cachedSnapshot as EnvironmentSnapshotLike | null,
  ) as EnvironmentData;

  await writeEnvironmentSnapshot(
    supabase,
    snapshotKey,
    lat,
    lon,
    units,
    localDate,
    response,
  );

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
