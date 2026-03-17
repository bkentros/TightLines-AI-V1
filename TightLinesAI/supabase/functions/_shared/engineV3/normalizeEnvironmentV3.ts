// =============================================================================
// ENGINE V3 — Normalized Environment
// Phase 2: Converts raw environment data into strict V3 contract.
// Populates historical_context_inputs from baseline lookups.
// =============================================================================

import type {
  NormalizedEnvironmentV3,
  TypedValue,
  ValueProvenance,
  HistoricalContextInputsV3,
} from './types.ts';
import { buildDataCoverageV3 } from './dataCoverage.ts';
import type { GeoContextV3 } from './types.ts';
import {
  getAirTempBaseline,
  getPrecipBaseline,
  getFreshwaterTempBaseline,
  getCoastalWaterTempBaseline,
} from './baselines/index.ts';

// Raw shape from get-environment
// Typed for V3 normalization; unknown fields are omitted at runtime.
interface RawEnv {
  lat?: number;
  lon?: number;
  timezone?: string | null;
  tz_offset_hours?: number | null;
  altitude_ft?: number | null;
  coastal?: boolean;
  weather?: {
    temperature?: number | null;
    wind_speed?: number | null;
    wind_direction?: number | null;
    cloud_cover?: number | null;
    pressure?: number | null;
    pressure_trend?: string | null;
    pressure_change_rate_mb_hr?: number | null;
    temp_trend_3day?: string | null;
    temp_trend_direction_f?: number | null;
    precip_48hr_inches?: number | null;
    precip_7day_inches?: number | null;
    precipitation?: number | null;
  } | null;
  sun?: {
    sunrise?: string | null;
    sunset?: string | null;
    twilight_begin?: string | null;
    civil_twilight_begin?: string | null;
    twilight_end?: string | null;
    civil_twilight_end?: string | null;
  } | null;
  moon?: {
    phase?: string | null;
    illumination?: number | null;
    is_waxing?: boolean | null;
  } | null;
  solunar?: {
    major_periods?: Array<{ start?: string; start_local?: string; end?: string; end_local?: string }> | null;
    minor_periods?: Array<{ start?: string; start_local?: string; end?: string; end_local?: string }> | null;
  } | null;
  tides?: {
    high_low?: Array<{ time?: string; time_local?: string; type?: string; value?: number; height_ft?: number }> | null;
    predictions_today?: Array<{ time?: string; time_local?: string; type?: string; value?: number; height_ft?: number }> | null;
    predictions_30day?: Array<{ date: string; high_ft: number; low_ft: number }> | null;
    phase?: string | null;
    station_id?: unknown;
  } | null;
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }> | null;
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }> | null;
  daily_air_temp_high_f?: Array<number | null> | null;
  daily_air_temp_low_f?: Array<number | null> | null;
  precip_48hr_inches?: number | null;
  precip_7day_inches?: number | null;
  tide_predictions_30day?: Array<{ date: string; high_ft: number; low_ft: number }> | null;
  measured_water_temp_f?: number | null;
  measured_water_temp_source?: string | null;
  measured_water_temp_72h_ago_f?: number | null;
}

function tv<T>(value: T | null | undefined, provenance: ValueProvenance): TypedValue<T> {
  const v = value ?? null;
  return { value: v, provenance: v != null ? provenance : 'missing' };
}

function tvMeasured<T>(value: T | null | undefined): TypedValue<T> {
  return tv(value, 'measured');
}

function tvDerived<T>(value: T | null | undefined): TypedValue<T> {
  return tv(value, 'derived_from_measured');
}

/**
 * Normalizes raw environment data into V3 contract.
 * Requires geoContext for data_coverage; use resolveGeoContextV3 first.
 */
export function normalizeEnvironmentV3(
  raw: RawEnv,
  geoContext: GeoContextV3
): NormalizedEnvironmentV3 {
  const lat = typeof raw.lat === 'number' ? raw.lat : 0;
  const lon = typeof raw.lon === 'number' ? raw.lon : 0;
  const timezone = typeof raw.timezone === 'string' ? raw.timezone : 'America/New_York';
  const tzHours = typeof raw.tz_offset_hours === 'number' ? raw.tz_offset_hours : 0;

  const now = new Date();
  const reportTimestampUtc = now.toISOString();
  const reportDateLocal = formatLocalDateKey(now, timezone);
  const month = now.getMonth() + 1;

  const weather = raw.weather ?? {};
  const sun = raw.sun ?? {};
  const moon = raw.moon ?? {};
  const solunar = raw.solunar ?? {};
  const tides = raw.tides ?? {};

  // Tide predictions
  const highLow = (tides.high_low ?? tides.predictions_today ?? []) as Array<{ time?: string; time_local?: string; type?: string; value?: number; height_ft?: number }>;
  const tidePredictionsToday = highLow
    .filter((p) => p && (p.type === 'H' || p.type === 'L'))
    .map((p) => ({
      timeLocal: (p.time_local ?? p.time ?? '') as string,
      type: p.type as 'H' | 'L',
      heightFt: (p.height_ft ?? p.value ?? 0) as number,
    }))
    .filter((p) => p.timeLocal);

  const tidePredictions30day = (raw.tide_predictions_30day ?? tides.predictions_30day ?? []) as Array<{ date: string; high_ft: number; low_ft: number }>;

  const majorPeriods = (solunar.major_periods ?? []) as Array<{ start?: string; start_local?: string; end?: string; end_local?: string }>;
  const minorPeriods = (solunar.minor_periods ?? []) as Array<{ start?: string; start_local?: string; end?: string; end_local?: string }>;

  const env: NormalizedEnvironmentV3 = {
    geo: {
      lat,
      lon,
      timezone,
      tzOffsetHours: typeof raw.tz_offset_hours === 'number' ? raw.tz_offset_hours : null,
      altitudeFt: tvMeasured(raw.altitude_ft),
    },
    time: {
      reportTimestampUtc,
      reportDateLocal,
      month,
    },
    atmospheric: {
      airTempF: tvMeasured(weather.temperature),
      airTempTrend3Day: tvDerived(weather.temp_trend_3day),
      airTempTrendDirectionF: tvDerived(weather.temp_trend_direction_f),
      pressureMb: tvMeasured(weather.pressure),
      pressureTrend: tvDerived(weather.pressure_trend),
      pressureChangeRateMbHr: tvDerived(weather.pressure_change_rate_mb_hr),
      windSpeedMph: tvMeasured(weather.wind_speed),
      windDirectionDeg: tvMeasured(weather.wind_direction),
      cloudCoverPct: tvMeasured(weather.cloud_cover),
    },
    light_daylight: {
      sunriseLocal: tvMeasured(sun.sunrise),
      sunsetLocal: tvMeasured(sun.sunset),
      civilTwilightBegin: tvMeasured(sun.twilight_begin ?? sun.civil_twilight_begin),
      civilTwilightEnd: tvMeasured(sun.twilight_end ?? sun.civil_twilight_end),
    },
    precipitation: {
      precip48hrInches: tvMeasured(raw.precip_48hr_inches ?? weather.precip_48hr_inches),
      precip7dayInches: tvMeasured(raw.precip_7day_inches ?? weather.precip_7day_inches),
      currentPrecipInHr: tvMeasured(weather.precipitation),
    },
    lunar_solunar: {
      moonPhase: tvMeasured(moon.phase),
      moonIlluminationPct: tvMeasured(moon.illumination != null ? (moon.illumination as number) * 100 : null),
      moonIsWaxing: tvMeasured(moon.is_waxing),
      solunarMajorPeriods: majorPeriods
        .filter((p) => (p.start_local ?? p.start) && (p.end_local ?? p.end))
        .map((p) => ({
          startLocal: (p.start_local ?? p.start) as string,
          endLocal: (p.end_local ?? p.end) as string,
        })),
      solunarMinorPeriods: minorPeriods
        .filter((p) => (p.start_local ?? p.start) && (p.end_local ?? p.end))
        .map((p) => ({
          startLocal: (p.start_local ?? p.start) as string,
          endLocal: (p.end_local ?? p.end) as string,
        })),
    },
    marine_tide: {
      tidePredictionsToday,
      tidePredictions30day: Array.isArray(tidePredictions30day) ? tidePredictions30day : [],
      tidePhase: tvMeasured(tides.phase),
      coastalHint: Boolean(raw.coastal ?? tides.station_id),
    },
    water_temperature: {
      coastalMeasuredF: tvMeasured(raw.measured_water_temp_f),
      coastalMeasured72hAgoF: tvMeasured(raw.measured_water_temp_72h_ago_f),
      coastalSource: tvMeasured(raw.measured_water_temp_source),
      freshwaterMeasuredF: { value: null, provenance: 'missing' as const },
    },
    historical_context_inputs: buildHistoricalContextInputs(geoContext),
    data_coverage: {
      variableGroupsPresent: [],
      variableGroupsMissing: [],
      partialDataGroups: [],
      historicalBaselineAvailable: false,
      stateResolved: false,
      airTempBaselineAvailable: false,
      precipBaselineAvailable: false,
      freshwaterTempBaselineAvailable: false,
      coastalWaterTempBaselineAvailable: false,
      marineTideRelevant: false,
      marineTidePresent: false,
      waterTempRelevant: false,
      waterTempPresent: false,
      freshwaterWaterTempRelevant: false,
      freshwaterWaterTempPresent: false,
    },
  };

  env.data_coverage = buildDataCoverageV3(env, geoContext);
  return env;
}

function buildHistoricalContextInputs(ctx: GeoContextV3): HistoricalContextInputsV3 {
  const state = ctx.state;
  const month = ctx.month;
  const stateResolved = Boolean(state);

  const air = state ? getAirTempBaseline(state, month) : null;
  const precip = state ? getPrecipBaseline(state, month) : null;
  const freshwaterSubtype = ctx.freshwaterSubtype ?? 'lake';
  const freshwater =
    state && (ctx.waterType === 'freshwater')
      ? getFreshwaterTempBaseline(state, month, freshwaterSubtype)
      : null;
  const coastal =
    state && (ctx.waterType === 'saltwater' || ctx.waterType === 'brackish')
      ? getCoastalWaterTempBaseline(state, month)
      : null;

  return {
    stateResolved,
    airTempBaseline: air
      ? {
          avgTempNormalF: air.avgTempNormalF,
          avgHighNormalF: air.avgHighNormalF,
          avgLowNormalF: air.avgLowNormalF,
          rangeLowF: air.rangeLowF,
          rangeHighF: air.rangeHighF,
          quality: air.quality,
          sourceName: air.sourceName,
        }
      : null,
    precipBaseline: precip
      ? {
          precipTotalNormalInches: precip.precipTotalNormalInches,
          rangeLowInches: precip.rangeLowInches,
          rangeHighInches: precip.rangeHighInches,
          quality: precip.quality,
          sourceName: precip.sourceName,
        }
      : null,
    freshwaterTempBaseline: freshwater
      ? {
          tempRangeLowF: freshwater.tempRangeLowF,
          tempRangeHighF: freshwater.tempRangeHighF,
          subtype: freshwater.subtype,
          quality: 'approximation' as const,
          methodologyNote: freshwater.methodologyNote,
          sourceName: freshwater.sourceName,
        }
      : null,
    coastalWaterTempBaseline: coastal
      ? {
          tempRangeLowF: coastal.tempRangeLowF,
          tempRangeHighF: coastal.tempRangeHighF,
          quality: coastal.quality,
          sourceName: coastal.sourceName,
        }
      : null,
  };
}

function formatLocalDateKey(d: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
