import type {
  RawRainSignal,
  RiverRunReasonCode,
  WeatherFreshness,
} from "../types.ts";
import {
  type RainSignalResult,
  type RainTotals,
  resolveRainSignal,
} from "../metrics/rain.ts";
export type RiverRunEnvironmentSnapshot = {
  weather_available?: boolean;
  fetched_at?: string;
  timezone?: string;
  weather?: {
    precip_48hr_inches?: number;
    precip_7day_daily?: number[];
  } | Record<string, unknown>;
  hourly_precipitation_in?: Array<{ time_utc: string; value: number | null }>;
  hourly_activity_weather?: Array<{
    time_local: string;
    cloud_cover_pct: number | null;
    shortwave_w_m2: number | null;
    clear_sky_shortwave_w_m2: number | null;
    precipitation_in: number | null;
  }>;
  forecast_daily?: Array<Record<string, unknown>>;
};

export type NormalizedWeatherSnapshot = {
  observedAt: string | null;
  weatherFreshness: WeatherFreshness;
  rainTotals: RainTotals;
  rainSignal: RainSignalResult;
  forecastDaily?: Array<Record<string, unknown>>;
  hourlyActivityWeather: NonNullable<
    RiverRunEnvironmentSnapshot["hourly_activity_weather"]
  >;
  reasonCodes: RiverRunReasonCode[];
};

export type RiverRunWeatherFetch = (
  input: string | URL,
  init?: RequestInit,
) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export async function fetchRiverRunWeatherSnapshot(input: {
  fetchFn: RiverRunWeatherFetch;
  lat: number;
  lon: number;
  fetchedAtUtc?: string;
}): Promise<RiverRunEnvironmentSnapshot | null> {
  const params = new URLSearchParams({
    latitude: String(input.lat),
    longitude: String(input.lon),
    hourly:
      "precipitation,cloud_cover,shortwave_radiation,shortwave_radiation_clear_sky",
    daily: "precipitation_probability_max",
    precipitation_unit: "inch",
    timezone: "auto",
    past_days: "4",
    forecast_days: "3",
    timeformat: "iso8601",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  type Payload = {
    hourly?: {
      time?: string[];
      precipitation?: Array<number | null>;
      cloud_cover?: Array<number | null>;
      shortwave_radiation?: Array<number | null>;
      shortwave_radiation_clear_sky?: Array<number | null>;
    };
    daily?: {
      time?: string[];
      precipitation_probability_max?: Array<number | null>;
    };
    timezone?: string;
  };
  let payload: Payload | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await input.fetchFn(url);
      if (!response.ok) continue;
      const candidate = await response.json() as Payload;
      if (
        !Array.isArray(candidate.hourly?.time) ||
        candidate.hourly.time.length === 0
      ) continue;
      payload = candidate;
      break;
    } catch {
      // A second bounded attempt protects a new refresh slot from a single
      // transient provider or network failure. The caller still fails closed
      // if both attempts fail.
    }
  }
  if (!payload) return null;
  const hourlyTimes = Array.isArray(payload.hourly?.time)
    ? payload.hourly.time
    : [];
  const hourlyPrecip = Array.isArray(payload.hourly?.precipitation)
    ? payload.hourly.precipitation
    : [];
  const dailyTimes = Array.isArray(payload.daily?.time)
    ? payload.daily.time
    : [];
  const precipChance = Array.isArray(
      payload.daily?.precipitation_probability_max,
    )
    ? payload.daily.precipitation_probability_max
    : [];

  return {
    weather_available: true,
    fetched_at: input.fetchedAtUtc ?? new Date().toISOString(),
    timezone: payload.timezone,
    hourly_precipitation_in: hourlyTimes.map((time, index) => ({
      time_utc: normalizeIso(time) ?? time,
      value: typeof hourlyPrecip[index] === "number"
        ? hourlyPrecip[index]
        : null,
    })),
    hourly_activity_weather: hourlyTimes.map((time, index) => ({
      time_local: time,
      cloud_cover_pct: numberOrNull(payload.hourly?.cloud_cover?.[index]),
      shortwave_w_m2: numberOrNull(
        payload.hourly?.shortwave_radiation?.[index],
      ),
      clear_sky_shortwave_w_m2: numberOrNull(
        payload.hourly?.shortwave_radiation_clear_sky?.[index],
      ),
      precipitation_in: numberOrNull(hourlyPrecip[index]),
    })),
    forecast_daily: dailyTimes.map((date, index) => ({
      date,
      precip_chance_pct: precipChance[index],
    })),
  };
}

export function normalizeWeatherSnapshot(input: {
  snapshot: RiverRunEnvironmentSnapshot | null | undefined;
  refreshAtUtc: string;
  localDate: string;
}): NormalizedWeatherSnapshot {
  const observedAt = normalizeIso(input.snapshot?.fetched_at);
  const weatherFreshness = computeWeatherFreshness({
    observedAt,
    refreshAtUtc: input.refreshAtUtc,
    weatherAvailable: input.snapshot?.weather_available,
  });
  const rainTotals = computeRainTotals(
    input.snapshot?.hourly_precipitation_in,
    input.refreshAtUtc,
  );
  const rainSignal = resolveRainSignal(rainTotals);
  const reasonCodes = dedupeReasonCodes([
    weatherReasonCode(weatherFreshness),
    ...rainSignal.reasonCodes,
  ]);

  return {
    observedAt,
    weatherFreshness,
    rainTotals,
    rainSignal,
    forecastDaily: input.snapshot?.forecast_daily,
    hourlyActivityWeather: input.snapshot?.hourly_activity_weather ?? [],
    reasonCodes,
  };
}

export function computeWeatherFreshness(input: {
  observedAt: string | null;
  refreshAtUtc: string;
  weatherAvailable?: boolean;
}): WeatherFreshness {
  if (input.weatherAvailable === false || !input.observedAt) return "missing";
  const ageHours =
    (Date.parse(input.refreshAtUtc) - Date.parse(input.observedAt)) /
    (60 * 60 * 1000);
  if (!Number.isFinite(ageHours) || ageHours < 0) return "missing";
  if (ageHours <= 12) return "fresh";
  if (ageHours <= 24) return "stale";
  return "missing";
}

export function computeRainTotals(
  hourlyPrecipitationIn:
    | Array<{ time_utc: string; value: number | null }>
    | undefined,
  refreshAtUtc: string,
): RainTotals {
  if (
    !Array.isArray(hourlyPrecipitationIn) || hourlyPrecipitationIn.length === 0
  ) {
    return { rain24hIn: null, rain48hIn: null, rain72hIn: null };
  }
  return {
    rain24hIn: sumPrecip(
      hoursBefore(refreshAtUtc, 24),
      refreshAtUtc,
      hourlyPrecipitationIn,
    ),
    rain48hIn: sumPrecip(
      hoursBefore(refreshAtUtc, 48),
      refreshAtUtc,
      hourlyPrecipitationIn,
    ),
    rain72hIn: sumPrecip(
      hoursBefore(refreshAtUtc, 72),
      refreshAtUtc,
      hourlyPrecipitationIn,
    ),
  };
}

function sumPrecip(
  startUtc: string,
  endUtc: string,
  series: Array<{ time_utc: string; value: number | null }>,
): number | null {
  let total = 0;
  let hasAny = false;
  const startMs = Date.parse(startUtc);
  const endMs = Date.parse(endUtc);
  for (const item of series) {
    const ms = Date.parse(item.time_utc);
    if (!Number.isFinite(ms) || ms <= startMs || ms > endMs) continue;
    if (typeof item.value !== "number" || !Number.isFinite(item.value)) {
      return null;
    }
    total += item.value;
    hasAny = true;
  }
  return hasAny ? round3(total) : null;
}

function weatherReasonCode(freshness: WeatherFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "weather_fresh";
    case "stale":
      return "weather_stale";
    case "missing":
      return "weather_missing";
  }
}

function hoursBefore(iso: string, hours: number): string {
  return new Date(Date.parse(iso) - hours * 60 * 60 * 1000).toISOString();
}

function normalizeIso(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function dedupeReasonCodes(codes: RiverRunReasonCode[]): RiverRunReasonCode[] {
  return [...new Set(codes)];
}

export type { RawRainSignal };
