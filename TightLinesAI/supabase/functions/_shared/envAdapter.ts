// =============================================================================
// ENVIRONMENT SNAPSHOT ADAPTER
// Converts the get-environment EnvironmentData response into the
// EnvironmentSnapshot format required by the core intelligence engine.
// =============================================================================

import type { EnvironmentSnapshot, SolunarPeriod, TidePrediction } from "./coreIntelligence/types.ts";

// The EnvironmentData shape from get-environment (reproduced here for isolation)
interface EnvironmentData {
  weather_available: boolean;
  tides_available: boolean;
  moon_available: boolean;
  sun_available: boolean;
  weather?: {
    temperature: number;
    humidity: number;
    cloud_cover: number;
    pressure: number;
    wind_speed: number;
    wind_direction: number;
    precipitation: number;
    temp_unit: string;
    wind_speed_unit: string;
    pressure_trend?: string;
    pressure_change_rate_mb_hr?: number;
    pressure_48hr?: number[];
    temp_trend_3day?: string;
    temp_trend_direction_f?: number;
    temp_7day_high?: number[];
    temp_7day_low?: number[];
    precip_48hr_inches?: number;
    precip_7day_inches?: number;
    precip_7day_daily?: number[];
  };
  tides?: {
    station_id: string;
    station_name: string;
    high_low: Array<{ time: string; type: "H" | "L"; value: number }>;
    phase?: string;
    unit: string;
  } | null;
  moon?: {
    phase: string;
    illumination: number;
    rise: string | null;
    set: string | null;
    upper_transit: string | null;
    lower_transit: string | null;
    is_waxing?: boolean | null;
  };
  sun?: {
    sunrise: string;
    sunset: string;
    twilight_begin?: string;
    twilight_end?: string;
  };
  solunar?: {
    major_periods: Array<{ start: string; end: string; type?: string }>;
    minor_periods: Array<{ start: string; end: string }>;
  };
  fetched_at: string;
  timezone?: string;
  tz_offset_hours?: number;
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }>;
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }>;
  tide_predictions_30day?: Array<{ date: string; high_ft: number; low_ft: number }>;
  measured_water_temp_f?: number | null;
  measured_water_temp_source?: string | null;
  measured_water_temp_72h_ago_f?: number | null;
  coastal?: boolean;
  nearest_tide_station_id?: string | null;
}

// Wind direction helper
function degreesToCardinal(deg: number): string {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const idx = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return dirs[idx];
}

export function toEngineSnapshot(
  env: EnvironmentData,
  lat: number,
  lon: number,
  timestampUtc: string,
  timezone: string
): EnvironmentSnapshot {
  const tzOffset = env.tz_offset_hours ?? 0;

  // Build tide predictions in engine format
  const tidePredictionsToday: TidePrediction[] = (env.tides?.high_low ?? []).map((p) => ({
    time_local: p.time,
    type: p.type,
    height_ft: p.value,
  }));

  // Build solunar periods in engine format
  const majorPeriods: SolunarPeriod[] = (env.solunar?.major_periods ?? []).map((p) => ({
    start_local: p.start,
    end_local: p.end,
  }));
  const minorPeriods: SolunarPeriod[] = (env.solunar?.minor_periods ?? []).map((p) => ({
    start_local: p.start,
    end_local: p.end,
  }));

  // Daily high/low arrays: get-environment returns 8 entries (7 past + 1 forecast)
  // Engine expects index 0=6 days ago, index 6=today (7 entries)
  // Use last 7 entries of the 8 that come from Open-Meteo
  const rawHighs = env.weather?.temp_7day_high ?? [];
  const rawLows = env.weather?.temp_7day_low ?? [];
  const dailyHighs = rawHighs.slice(-7).map((v) => (v !== null && v !== undefined ? Number(v) : null));
  const dailyLows = rawLows.slice(-7).map((v) => (v !== null && v !== undefined ? Number(v) : null));
  // Pad to 7 if shorter
  while (dailyHighs.length < 7) dailyHighs.unshift(null);
  while (dailyLows.length < 7) dailyLows.unshift(null);

  return {
    lat,
    lon,
    timestamp_utc: timestampUtc,
    timezone,
    tz_offset_hours: tzOffset,
    coastal: env.coastal ?? (env.tides_available && Boolean(env.tides)),
    nearest_tide_station_id: env.nearest_tide_station_id ?? env.tides?.station_id ?? null,

    air_temp_f: env.weather?.temperature ?? null,
    wind_speed_mph: env.weather?.wind_speed ?? null,
    wind_direction_deg: env.weather?.wind_direction ?? null,
    wind_direction_label: env.weather?.wind_direction != null
      ? degreesToCardinal(env.weather.wind_direction)
      : null,
    gust_speed_mph: null, // not fetched by get-environment currently
    cloud_cover_pct: env.weather?.cloud_cover ?? null,
    current_precip_in_hr: env.weather?.precipitation != null
      ? env.weather.precipitation * (1 / 25.4) // Open-Meteo returns mm/hr; convert to in/hr
      : null,
    humidity_pct: env.weather?.humidity ?? null,
    pressure_mb: env.weather?.pressure ?? null,

    hourly_pressure_mb: env.hourly_pressure_mb ?? [],
    hourly_air_temp_f: env.hourly_air_temp_f ?? [],

    daily_air_temp_high_f: dailyHighs,
    daily_air_temp_low_f: dailyLows,

    precip_48hr_inches: env.weather?.precip_48hr_inches ?? null,
    precip_7day_inches: env.weather?.precip_7day_inches ?? null,

    sunrise_local: env.sun?.sunrise ?? null,
    sunset_local: env.sun?.sunset ?? null,
    civil_twilight_begin_local: env.sun?.twilight_begin ?? null,
    civil_twilight_end_local: env.sun?.twilight_end ?? null,

    moon_phase_label: env.moon?.phase ?? null,
    moon_phase_is_waxing: env.moon?.is_waxing ?? null,
    moon_illumination_pct: env.moon?.illumination != null
      ? env.moon.illumination * 100  // USNO returns 0–1; normalize to 0–100
      : null,
    moonrise_local: env.moon?.rise ?? null,
    moonset_local: env.moon?.set ?? null,

    solunar_major_periods: majorPeriods,
    solunar_minor_periods: minorPeriods,

    tide_predictions_today: tidePredictionsToday,
    tide_predictions_30day: env.tide_predictions_30day ?? [],

    measured_water_temp_f: env.measured_water_temp_f ?? null,
    measured_water_temp_source: (env.measured_water_temp_source as any) ?? null,
    measured_water_temp_72h_ago_f: env.measured_water_temp_72h_ago_f ?? null,
  };
}
