export type SnapshotUnits = "imperial" | "metric";

export type EnvironmentSnapshotLike = {
  weather_available: boolean;
  tides_available: boolean;
  moon_available: boolean;
  sun_available: boolean;
  weather?: Record<string, unknown>;
  tides?: Record<string, unknown> | null;
  moon?: Record<string, unknown>;
  sun?: Record<string, unknown>;
  solunar?: Record<string, unknown>;
  fetched_at: string;
  timezone?: string;
  tz_offset_hours?: number;
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }>;
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }>;
  hourly_cloud_cover_pct?: Array<{ time_utc: string; value: number }>;
  hourly_wind_speed?: Array<{ time_utc: string; value: number }>;
  tide_predictions_30day?: Array<Record<string, unknown>>;
  measured_water_temp_f?: number | null;
  measured_water_temp_source?: string | null;
  measured_water_temp_24h_ago_f?: number | null;
  measured_water_temp_72h_ago_f?: number | null;
  coastal?: boolean;
  nearest_tide_station_id?: string | null;
  altitude_ft?: number | null;
  forecast_daily?: Array<Record<string, unknown>>;
  source_notes?: string[];
};

const MIN_HOURLY_ENV_POINTS = 12;

function roundBucket(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

export function buildEnvironmentSnapshotKey(
  lat: number,
  lon: number,
  units: SnapshotUnits,
  localDate: string,
): string {
  return `${roundBucket(lat)}:${roundBucket(lon)}:${units}:${localDate}`;
}

export function localDateFromUtcIso(iso: string, tzOffsetHours: number): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "1970-01-01";
  const shifted = new Date(d.getTime() + tzOffsetHours * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

export function hasSufficientHourlySeries(
  series: Array<{ time_utc: string; value: number }> | undefined | null,
): boolean {
  return Array.isArray(series) && series.length >= MIN_HOURLY_ENV_POINTS;
}

export function hasSufficientHourlyWeather(env: EnvironmentSnapshotLike): boolean {
  return hasSufficientHourlySeries(env.hourly_air_temp_f) &&
    hasSufficientHourlySeries(env.hourly_cloud_cover_pct);
}

export function isEnvironmentSnapshotUsable(env: EnvironmentSnapshotLike | null | undefined): boolean {
  if (!env) return false;
  return env.weather_available ||
    env.tides_available ||
    env.measured_water_temp_f != null ||
    hasSufficientHourlyWeather(env);
}

export function mergeEnvironmentWithSnapshot(
  live: EnvironmentSnapshotLike,
  cached: EnvironmentSnapshotLike | null,
): EnvironmentSnapshotLike {
  if (!cached || !isEnvironmentSnapshotUsable(cached)) {
    return live;
  }

  const merged = structuredClone(live);
  const notes = [...(live.source_notes ?? [])];
  const addNote = (note: string) => {
    if (!notes.includes(note)) notes.push(note);
  };

  if ((!merged.weather_available || !merged.weather) && cached.weather_available && cached.weather) {
    merged.weather_available = true;
    merged.weather = cached.weather;
    if (!merged.forecast_daily?.length && cached.forecast_daily?.length) {
      merged.forecast_daily = cached.forecast_daily;
    }
    if ((!merged.hourly_pressure_mb || merged.hourly_pressure_mb.length === 0) && cached.hourly_pressure_mb?.length) {
      merged.hourly_pressure_mb = cached.hourly_pressure_mb;
    }
    if ((!merged.hourly_wind_speed || merged.hourly_wind_speed.length === 0) && cached.hourly_wind_speed?.length) {
      merged.hourly_wind_speed = cached.hourly_wind_speed;
    }
    if (merged.altitude_ft == null && cached.altitude_ft != null) {
      merged.altitude_ft = cached.altitude_ft;
    }
    addNote("snapshot_fallback:weather");
  }

  if (!hasSufficientHourlyWeather(merged) && hasSufficientHourlyWeather(cached)) {
    merged.hourly_air_temp_f = cached.hourly_air_temp_f;
    merged.hourly_cloud_cover_pct = cached.hourly_cloud_cover_pct;
    if ((!merged.hourly_pressure_mb || merged.hourly_pressure_mb.length === 0) && cached.hourly_pressure_mb?.length) {
      merged.hourly_pressure_mb = cached.hourly_pressure_mb;
    }
    if ((!merged.hourly_wind_speed || merged.hourly_wind_speed.length === 0) && cached.hourly_wind_speed?.length) {
      merged.hourly_wind_speed = cached.hourly_wind_speed;
    }
    addNote("snapshot_fallback:hourly_weather");
  }

  if ((!merged.sun_available || !merged.sun) && cached.sun_available && cached.sun) {
    merged.sun_available = true;
    merged.sun = cached.sun;
    addNote("snapshot_fallback:sun");
  }

  if ((!merged.moon_available || !merged.moon) && cached.moon_available && cached.moon) {
    merged.moon_available = true;
    merged.moon = cached.moon;
    if (!merged.solunar && cached.solunar) {
      merged.solunar = cached.solunar;
    }
    addNote("snapshot_fallback:moon_solunar");
  }

  if ((!merged.tides_available || !merged.tides) && cached.tides_available && cached.tides) {
    merged.tides_available = true;
    merged.tides = cached.tides;
    if (!merged.tide_predictions_30day?.length && cached.tide_predictions_30day?.length) {
      merged.tide_predictions_30day = cached.tide_predictions_30day;
    }
    if (!merged.nearest_tide_station_id && cached.nearest_tide_station_id) {
      merged.nearest_tide_station_id = cached.nearest_tide_station_id;
    }
    merged.coastal = cached.coastal ?? merged.coastal;
    addNote("snapshot_fallback:tides");
  }

  if (merged.measured_water_temp_f == null && cached.measured_water_temp_f != null) {
    merged.measured_water_temp_f = cached.measured_water_temp_f;
    merged.measured_water_temp_24h_ago_f = cached.measured_water_temp_24h_ago_f ?? null;
    merged.measured_water_temp_72h_ago_f = cached.measured_water_temp_72h_ago_f ?? null;
    merged.measured_water_temp_source = cached.measured_water_temp_source ?? null;
    addNote("snapshot_fallback:water_temp");
  }

  if (!merged.timezone && cached.timezone) {
    merged.timezone = cached.timezone;
  }
  if (merged.tz_offset_hours == null && cached.tz_offset_hours != null) {
    merged.tz_offset_hours = cached.tz_offset_hours;
  }

  merged.source_notes = notes.length > 0 ? notes : undefined;
  return merged;
}
