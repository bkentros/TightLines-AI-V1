// =============================================================================
// ENGINE V2 — Normalization Layer
// Converts raw EnvironmentData into NormalizedEnvironmentV2.
// This is the only place that reads raw API data; all downstream engine
// modules consume the normalized form.
//
// NOTE: Accepts both the actual get-environment output shape (EnvironmentData)
// and the idealized RawEnvironmentData contract shape. Field aliasing handles
// the gaps between them.
// =============================================================================

import type {
  RawEnvironmentData,
  NormalizedEnvironmentV2,
} from '../types/contracts.ts';

/**
 * Normalizes raw environment data from get-environment into the V2 engine contract.
 * Never throws — returns best-effort normalized object with null fields where data missing.
 *
 * Field aliasing notes (get-environment vs RawEnvironmentData contract):
 *   - hourly_pressure_mb (actual) vs hourly_pressure (contract) → reads both
 *   - tides.high_low (actual) vs tides.predictions_today (contract) → reads both
 *   - solunar periods: start/end (actual) vs start_local/end_local (contract) → reads both
 *   - tide_predictions_30day at top level (actual) vs tides.predictions_30day (contract) → reads both
 */
export function normalizeEnvironment(raw: RawEnvironmentData): NormalizedEnvironmentV2 {
  const lat = typeof raw.lat === 'number' ? raw.lat : 0;
  const lon = typeof raw.lon === 'number' ? raw.lon : 0;
  const timezone = typeof raw.timezone === 'string' ? raw.timezone : 'America/New_York';

  // ── Hourly pressure — aliased between both shapes ─────────────────────────
  // get-environment uses 'hourly_pressure_mb', RawEnvironmentData contract uses 'hourly_pressure'
  const hourlyPressureSource = (raw as Record<string, unknown>).hourly_pressure_mb ?? raw.hourly_pressure;

  // ── Tide predictions today — aliased between both shapes ──────────────────
  // get-environment: tides.high_low (TidePrediction[]) with {time, type, value}
  // RawEnvironmentData contract: tides.predictions_today with {time_local, type, height_ft}
  const tidesRaw = raw.tides as Record<string, unknown> | null | undefined;
  let tidePredictionsToday: Array<{ timeLocal: string; type: 'H' | 'L'; heightFt: number }> | undefined;
  if (tidesRaw) {
    // Try contract shape first
    if (Array.isArray(tidesRaw.predictions_today)) {
      tidePredictionsToday = normalizeTidePredictions(
        tidesRaw.predictions_today as Array<{ time_local: string; type: 'H' | 'L'; height_ft: number }>
      );
    // Fallback: actual get-environment shape (high_low with {time, type, value})
    } else if (Array.isArray(tidesRaw.high_low)) {
      tidePredictionsToday = (tidesRaw.high_low as Array<{ time: string; type: 'H' | 'L'; value: number }>)
        .filter((p) => typeof p.time === 'string' && (p.type === 'H' || p.type === 'L') && typeof p.value === 'number')
        .map((p) => ({ timeLocal: p.time, type: p.type, heightFt: p.value }));
    }
  }

  // ── 30-day tide predictions — aliased between both shapes ─────────────────
  // get-environment: tide_predictions_30day at top level
  // RawEnvironmentData contract: tides.predictions_30day
  const tidePredictions30day: Array<{ date: string; high_ft: number; low_ft: number }> | undefined =
    Array.isArray(tidesRaw?.predictions_30day)
      ? tidesRaw!.predictions_30day as Array<{ date: string; high_ft: number; low_ft: number }>
      : Array.isArray((raw as Record<string, unknown>).tide_predictions_30day)
        ? (raw as Record<string, unknown>).tide_predictions_30day as Array<{ date: string; high_ft: number; low_ft: number }>
        : undefined;

  // ── Solunar periods — aliased between both shapes ─────────────────────────
  // get-environment: {start, end} (via SolunarPeriod)
  // RawEnvironmentData contract: {start_local, end_local}
  const solunarRaw = raw.solunar as Record<string, unknown> | null | undefined;
  const solunarMajorPeriods = normalizeSolunarPeriods(
    (solunarRaw?.major_periods as Array<Record<string, string>> | null | undefined)
  );
  const solunarMinorPeriods = normalizeSolunarPeriods(
    (solunarRaw?.minor_periods as Array<Record<string, string>> | null | undefined)
  );

  // ── Sun data — get-environment returns twilight_begin/end, not civil_twilight ──
  const sunRaw = raw.sun as Record<string, unknown> | null | undefined;
  const sunriseLocal: string | null = typeof sunRaw?.sunrise === 'string' ? sunRaw.sunrise : null;
  const sunsetLocal: string | null = typeof sunRaw?.sunset === 'string' ? sunRaw.sunset : null;
  const civilTwilightBeginLocal: string | null =
    typeof sunRaw?.civil_twilight_begin === 'string'
      ? sunRaw.civil_twilight_begin
      : typeof sunRaw?.twilight_begin === 'string'
        ? sunRaw.twilight_begin
        : null;
  const civilTwilightEndLocal: string | null =
    typeof sunRaw?.civil_twilight_end === 'string'
      ? sunRaw.civil_twilight_end
      : typeof sunRaw?.twilight_end === 'string'
        ? sunRaw.twilight_end
        : null;

  return {
    location: {
      lat,
      lon,
      timezone,
      tzOffsetHours: typeof (raw as Record<string, unknown>).tz_offset_hours === 'number'
        ? (raw as Record<string, unknown>).tz_offset_hours as number
        : null,
      coastalHint: Boolean(raw.coastal),
      nearestTideStationId: raw.nearest_tide_station_id ?? null,
      altitudeFt: raw.altitude_ft ?? null,
    },

    current: {
      airTempF: raw.weather?.temperature ?? null,
      pressureMb: raw.weather?.pressure ?? null,
      windSpeedMph: raw.weather?.wind_speed ?? null,
      windDirectionDeg: raw.weather?.wind_direction ?? null,
      cloudCoverPct: raw.weather?.cloud_cover ?? null,
      precipInHr: raw.weather?.current_precip_in_hr ?? (raw.weather as Record<string, unknown> | undefined)?.precipitation as number ?? null,
    },

    histories: {
      hourlyPressureMb: normalizeTimeSeriesArray(
        hourlyPressureSource as Array<{ time_utc: string; value: number }> | null | undefined
      ),
      hourlyAirTempF: normalizeTimeSeriesArray(raw.hourly_air_temp_f),
      dailyAirTempHighF: Array.isArray(raw.daily_air_temp_high_f)
        ? raw.daily_air_temp_high_f
        : undefined,
      dailyAirTempLowF: Array.isArray(raw.daily_air_temp_low_f)
        ? raw.daily_air_temp_low_f
        : undefined,
      // precip can live at top level (RawEnvironmentData) or inside weather (actual EnvironmentData)
      precip48hrInches:
        raw.precip_48hr_inches ??
        (raw.weather as Record<string, unknown> | undefined)?.precip_48hr_inches as number ?? null,
      precip7dayInches:
        raw.precip_7day_inches ??
        (raw.weather as Record<string, unknown> | undefined)?.precip_7day_inches as number ?? null,
    },

    solarLunar: {
      sunriseLocal,
      sunsetLocal,
      civilTwilightBeginLocal,
      civilTwilightEndLocal,
      moonPhase: raw.moon?.phase ?? null,
      moonIlluminationPct: raw.moon?.illumination ?? null,
      moonIsWaxing: raw.moon?.is_waxing ?? null,
      solunarMajorPeriods,
      solunarMinorPeriods,
    },

    marine: {
      tidePredictionsToday,
      tidePredictions30day,
      measuredWaterTempF: raw.measured_water_temp_f ?? null,
      measuredWaterTempSource: raw.measured_water_temp_source ?? null,
      measuredWaterTemp72hAgoF: raw.measured_water_temp_72h_ago_f ?? null,
    },

    userOverrides: {
      manualFreshwaterWaterTempF: raw.manual_freshwater_water_temp_f ?? null,
    },
  };
}

function normalizeTimeSeriesArray(
  arr: Array<{ time_utc: string; value: number }> | null | undefined
): Array<{ timeUtc: string; value: number }> | undefined {
  if (!Array.isArray(arr)) return undefined;
  return arr
    .filter((e) => typeof e.time_utc === 'string' && typeof e.value === 'number')
    .map((e) => ({ timeUtc: e.time_utc, value: e.value }));
}

function normalizeSolunarPeriods(
  arr: Array<Record<string, string>> | null | undefined
): Array<{ startLocal: string; endLocal: string }> {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((p) => {
      // Accept both {start_local, end_local} (contract) and {start, end} (actual get-env output)
      return (typeof p.start_local === 'string' || typeof p.start === 'string') &&
             (typeof p.end_local === 'string' || typeof p.end === 'string');
    })
    .map((p) => ({
      startLocal: p.start_local ?? p.start,
      endLocal: p.end_local ?? p.end,
    }));
}

function normalizeTidePredictions(
  arr: Array<{ time_local: string; type: 'H' | 'L'; height_ft: number }> | null | undefined
): Array<{ timeLocal: string; type: 'H' | 'L'; heightFt: number }> | undefined {
  if (!Array.isArray(arr)) return undefined;
  return arr
    .filter(
      (p) =>
        typeof p.time_local === 'string' &&
        (p.type === 'H' || p.type === 'L') &&
        typeof p.height_ft === 'number'
    )
    .map((p) => ({ timeLocal: p.time_local, type: p.type, heightFt: p.height_ft }));
}
