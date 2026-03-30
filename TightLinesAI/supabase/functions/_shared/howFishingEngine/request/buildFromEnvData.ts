import type { EngineContext, SharedEngineRequest } from "../contracts/mod.ts";
import { resolveRegionForCoordinates } from "../context/resolveRegion.ts";
import {
  countValidHoursForLocalDate,
  hourlyPointsTo24ArrayForLocalDate,
  MIN_LOCAL_DAY_HOURS,
} from "./hourlyLocalDay.ts";

function num(x: unknown): number | null {
  if (x == null) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

/** Convert wind speed to mph using `weather.wind_speed_unit` when present. */
function windToMph(speed: number | null, windUnitRaw: unknown): number | null {
  if (speed == null || !Number.isFinite(speed)) return null;
  const u = String(windUnitRaw ?? "mph").toLowerCase();
  if (u.includes("km")) return speed * 0.621371;
  return speed;
}

function mean24(values: number[] | null | undefined): number | null {
  if (!values || values.length === 0) return null;
  let s = 0;
  for (const v of values) {
    if (!Number.isFinite(v)) return null;
    s += v;
  }
  return s / values.length;
}

function readWeather(env: Record<string, unknown>): Record<string, unknown> | null {
  const w = env.weather;
  return w && typeof w === "object" ? (w as Record<string, unknown>) : null;
}

function readDailyMean(
  highs: number[] | undefined,
  lows: number[] | undefined,
  idx: number | null,
): number | null {
  if (idx == null || !highs || !lows) return null;
  if (highs[idx] == null || lows[idx] == null) return null;
  return (highs[idx]! + lows[idx]!) / 2;
}

function currentDailyIndex(values: unknown[] | undefined, dayOffset = 0): number | null {
  if (!values || values.length === 0) return null;
  // Base index 14 = today in a past_days=14 array. dayOffset shifts forward for forecast days.
  return Math.min(14 + dayOffset, values.length - 1);
}

function sumRecent(values: number[] | undefined, endIdx: number | null, days: number): number | null {
  if (!values || values.length === 0 || endIdx == null) return null;
  const start = Math.max(0, endIdx - (days - 1));
  let total = 0;
  for (let i = start; i <= endIdx; i++) total += values[i] ?? 0;
  return total;
}

/**
 * Maps client get-environment payload into SharedEngineRequest.
 *
 * **Precip contract (tight):**
 * - When `weather.precip_7day_daily` exists for the target day index, fills
 *   `precip_24h_in`, `precip_72h_in` (rolling 3d), and `precip_7d_in` (rolling 7d)
 *   so river runoff can score without imputing missing windows as zero.
 * - `precip_7day_inches` is only a fallback when the daily series cannot supply 7d.
 * - River + partial precip (e.g. only 48h-derived 24/72) yields a `data_coverage`
 *   note; the engine omits `runoff_flow_disruption` until `precip_7d_in` exists.
 *
 * @param dayOffset - 0 = today (default), 1 = tomorrow, etc.
 *   When > 0, shifts all daily array lookups forward and extracts the
 *   appropriate hourly pressure window for the target forecast day.
 * @param opts.useCalendarDayProfileForToday — with `dayOffset === 0`, use noon/mean scalars and
 *   a fixed pressure window to **local noon** (same convention as future forecast days) instead of
 *   live `weather.*` + sliding `pressure_48hr`. **forecast-scores** sets this so 7-day chips do not
 *   jitter on every cache clear / refetch; **how-fishing** / get-environment omit it for true “now”.
 */
export type BuildFromEnvDataOptions = {
  useCalendarDayProfileForToday?: boolean;
};

export function buildSharedEngineRequestFromEnvData(
  latitude: number,
  longitude: number,
  localDate: string,
  localTimezone: string,
  context: EngineContext,
  envData: Record<string, unknown>,
  dayOffset = 0,
  opts?: BuildFromEnvDataOptions,
): SharedEngineRequest {
  const { state_code, region_key: baseRegionKey } = resolveRegionForCoordinates(latitude, longitude);

  // ── Altitude and latitude-based region overrides ──────────────────────────
  // These apply AFTER state-based resolution and can override to a sub-region.
  const altitudeFt = num(envData.altitude_ft);
  let region_key = baseRegionKey;

  // mountain_alpine: >5,500ft anywhere in the continental US (all high-altitude western fishing).
  // E.g.: Dillon CO (9,017ft), Yellowstone Lake WY (7,733ft), Lake Tahoe CA (6,225ft),
  //        Big Bear Lake CA (6,752ft), Strawberry Reservoir UT (7,597ft).
  // Below 5,500ft (e.g., Flathead Lake MT at 2,893ft) stays in its base region.
  // Applied BEFORE the NorCal check so CA alpine (Tahoe) routes to mountain_alpine, not northern_california.
  if (altitudeFt != null && altitudeFt > 5500) {
    region_key = "mountain_alpine";
  }

  // northern_california: CA above 37.5°N — NorCal inland/foothills/coast.
  // Applies AFTER alpine check so high-elevation NorCal (e.g. Lake Tahoe CA side)
  // still routes to mountain_alpine.
  if (state_code === "CA" && latitude > 37.5 && region_key !== "mountain_alpine") {
    region_key = "northern_california";
  }

  // Inland Pacific Northwest — east-of-Cascades OR/WA (continental / rain-shadow).
  // Distinct from maritime pacific_northwest for temp/runoff behavior (e.g. Hells Canyon corridor).
  if (
    region_key === "pacific_northwest" &&
    (altitudeFt == null || altitudeFt <= 5500) &&
    ((state_code === "OR" && longitude >= -118.2) ||
      (state_code === "WA" && latitude >= 45.5 && longitude >= -119.8))
  ) {
    region_key = "inland_northwest";
  }
  // ─────────────────────────────────────────────────────────────────────────

  const w = readWeather(envData);

  const calDayToday =
    opts?.useCalendarDayProfileForToday === true && dayOffset === 0;
  /** Pressure series ending at target calendar day's local noon (not “current hour”). */
  const noonAnchoredPressure = dayOffset > 0 || calDayToday;

  let pressure_history_mb: number[] | null = null;

  if (dayOffset === 0 && w && Array.isArray(w.pressure_48hr) && !calDayToday) {
    // Live “today”: pre-built 48hr ending at current hour (changes as the clock moves).
    pressure_history_mb = (w.pressure_48hr as unknown[])
      .map((x) => num(x))
      .filter((x): x is number => x != null);
  }

  if (!pressure_history_mb || pressure_history_mb.length < 2) {
    const hourly = envData.hourly_pressure_mb;
    if (Array.isArray(hourly)) {
      let trimmed: unknown[];
      if (noonAnchoredPressure) {
        // 48 readings ending at target day local noon (D=0 → today noon; D=1 → tomorrow noon).
        const targetNoonIdx = (14 + dayOffset) * 24 + 12;
        trimmed = hourly.slice(Math.max(0, targetNoonIdx - 47), targetNoonIdx + 1);
      } else {
        trimmed = hourly.slice(Math.max(0, hourly.length - 48));
      }
      pressure_history_mb = trimmed
        .map((h: unknown) => {
          if (h && typeof h === "object" && "value" in h) return num((h as { value: unknown }).value);
          return null;
        })
        .filter((x): x is number => x != null);
    }
  }

  const th = w?.temp_7day_high as number[] | undefined;
  const tl = w?.temp_7day_low as number[] | undefined;
  const tempIdx = currentDailyIndex(th && th.length ? th : tl, dayOffset);
  const daily_mean = readDailyMean(th, tl, tempIdx) ?? num(w?.temperature);
  const prior_mean = readDailyMean(th, tl, tempIdx != null ? tempIdx - 1 : null);
  const d2_mean = readDailyMean(th, tl, tempIdx != null ? tempIdx - 2 : null);
  const daily_low_air =
    tempIdx != null && tl && tl[tempIdx] != null ? num(tl[tempIdx]) : null;
  const daily_high_air =
    tempIdx != null && th && th[tempIdx] != null ? num(th[tempIdx]) : null;

  const pd = w?.precip_7day_daily as number[] | undefined;
  const precipIdx = currentDailyIndex(pd, dayOffset);

  let precip_24h: number | null = null;
  let precip_72h: number | null = null;
  let precip_7d_in: number | null = null;

  if (precipIdx != null && Array.isArray(pd) && pd.length > 0) {
    precip_24h = pd[precipIdx] ?? 0;
    precip_72h = sumRecent(pd, precipIdx, 3);
    precip_7d_in = sumRecent(pd, precipIdx, 7);
  }

  if (precip_24h == null && num(w?.precip_48hr_inches) != null) {
    precip_24h = num(w!.precip_48hr_inches)! / 2;
  }
  if (precip_72h == null && num(w?.precip_48hr_inches) != null) {
    precip_72h = num(w!.precip_48hr_inches)!;
  }

  if (precip_7d_in == null) {
    precip_7d_in = num(w?.precip_7day_inches) ?? null;
  }

  const precip_mm = num(w?.precipitation);
  // When `weather.precipitation` is the same magnitude as 24h inches (common for archive /
  // daily-total payloads), it is not an hourly rate — omit fake `precip_rate_now` and
  // `active_precip_now` or normalizePrecip treats trace rain as active / high-rate rain.
  const precipInFromMm = precip_mm != null ? precip_mm / 25.4 : null;
  const precipitationMatches24h =
    precipInFromMm != null &&
    precip_24h != null &&
    Math.abs(precipInFromMm - precip_24h) < 0.02;
  const precip_rate_now = precipitationMatches24h ? null : precipInFromMm;

  const tides = envData.tides as Record<string, unknown> | null | undefined;
  const tidePhase = tides && typeof tides.phase === "string" ? tides.phase : null;
  const highLow = tides?.high_low as Array<{ time: string; type?: string; value: number }> | undefined;
  const tide_high_low =
    Array.isArray(highLow) && highLow.length >= 2
      ? highLow
          .map((x) => ({
            time: x.time,
            value: Number(x.value),
            ...(typeof x.type === "string" ? { type: x.type } : {}),
          }))
          .filter((x) => x.time && Number.isFinite(x.value))
      : null;

  const currentKts = tides && typeof tides === "object" && "current_speed_knots_max" in tides
    ? num((tides as { current_speed_knots_max?: unknown }).current_speed_knots_max)
    : null;

  const sun = envData.sun as Record<string, unknown> | null | undefined;

  const solunar = envData.solunar as { major_periods?: Array<{ start: string }> } | undefined;
  const solunar_peak_local =
    solunar?.major_periods?.map((p) => p.start).filter((s) => typeof s === "string" && s.length > 0) ??
    undefined;

  const envTzRaw = typeof envData.timezone === "string" ? envData.timezone.trim() : "";
  const reqTzRaw = typeof localTimezone === "string" ? localTimezone.trim() : "";
  const tzForHourly = envTzRaw.length > 0 ? envTzRaw : reqTzRaw;

  const source_notes: string[] = [];
  if (envTzRaw.length > 0 && reqTzRaw.length > 0 && envTzRaw !== reqTzRaw) {
    source_notes.push(
      `hourly_series_timezone_mismatch: env_timezone=${envTzRaw} request_local_timezone=${reqTzRaw} (bucketing uses env_timezone)`,
    );
  }

  const hourlyAirRaw = envData.hourly_air_temp_f;
  const hourlyCloudRaw = envData.hourly_cloud_cover_pct;
  const hourlyAirPts = Array.isArray(hourlyAirRaw) && hourlyAirRaw.length > 0
    ? (hourlyAirRaw as Array<{ time_utc: string; value: number }>)
    : null;
  const hourlyCloudPts = Array.isArray(hourlyCloudRaw) && hourlyCloudRaw.length > 0
    ? (hourlyCloudRaw as Array<{ time_utc: string; value: number }>)
    : null;

  const hourlyAirTemp24 = hourlyAirPts
    ? hourlyPointsTo24ArrayForLocalDate(hourlyAirPts, localDate, tzForHourly)
    : null;
  if (hourlyAirPts && hourlyAirTemp24 == null) {
    const n = countValidHoursForLocalDate(hourlyAirPts, localDate, tzForHourly);
    source_notes.push(
      `hourly_air_temp_f: ${n} valid local hours for ${localDate} (need ${MIN_LOCAL_DAY_HOURS}); timing uses non-hourly temp`,
    );
  }

  const hourlyCloudPct24 = hourlyCloudPts
    ? hourlyPointsTo24ArrayForLocalDate(hourlyCloudPts, localDate, tzForHourly)
    : null;
  if (hourlyCloudPts && hourlyCloudPct24 == null) {
    const n = countValidHoursForLocalDate(hourlyCloudPts, localDate, tzForHourly);
    source_notes.push(
      `hourly_cloud_cover_pct: ${n} valid local hours for ${localDate} (need ${MIN_LOCAL_DAY_HOURS}); timing uses non-hourly cloud`,
    );
  }

  const windUnitLabel = w?.wind_speed_unit;
  const windNowMph = windToMph(num(w?.wind_speed), windUnitLabel);
  const measuredWaterTempF = num(envData.measured_water_temp_f);
  const measuredWaterTemp24hAgoF = num(envData.measured_water_temp_24h_ago_f);
  const measuredWaterTemp72hAgoF = num(envData.measured_water_temp_72h_ago_f);
  const measuredWaterTempSource =
    typeof envData.measured_water_temp_source === "string"
      ? envData.measured_water_temp_source
      : null;

  let daily_mean_air_temp_f = daily_mean;
  let current_air_temp_f = num(w?.temperature);
  let pressure_mb_out = num(w?.pressure);
  let wind_speed_mph_out: number | null = windNowMph;
  let cloud_cover_pct_out = num(w?.cloud_cover);
  let active_precip_now =
    !precipitationMatches24h &&
    precip_mm != null &&
    precip_mm > 0.5;
  let precip_rate_now_out: number | null = precip_rate_now;

  if (dayOffset > 0 || calDayToday) {
    const noonAir =
      hourlyAirTemp24 != null && Number.isFinite(hourlyAirTemp24[12]) ? hourlyAirTemp24[12]! : null;
    daily_mean_air_temp_f = noonAir ?? daily_mean;
    current_air_temp_f = noonAir ?? daily_mean;

    if (pressure_history_mb && pressure_history_mb.length > 0) {
      const last = pressure_history_mb[pressure_history_mb.length - 1];
      if (last != null && Number.isFinite(last)) pressure_mb_out = last;
    }

    const cloudMean = mean24(hourlyCloudPct24 ?? undefined);
    if (cloudMean != null) {
      cloud_cover_pct_out = cloudMean;
    } else {
      source_notes.push(
        `${calDayToday ? "calendar_today" : "forecast_day"}_cloud_scalar_fallback: insufficient hourly cloud for ${localDate} — cloud_cover_pct uses current weather`,
      );
    }

    const hourlyWindRaw = envData.hourly_wind_speed;
    const hourlyWindPts = Array.isArray(hourlyWindRaw) && hourlyWindRaw.length > 0
      ? (hourlyWindRaw as Array<{ time_utc: string; value: number }>)
      : null;
    const hourlyWind24 = hourlyWindPts
      ? hourlyPointsTo24ArrayForLocalDate(hourlyWindPts, localDate, tzForHourly)
      : null;
    const windMeanMph = (() => {
      if (!hourlyWind24 || hourlyWind24.length === 0) return null;
      let s = 0;
      for (const v of hourlyWind24) {
        const m = windToMph(v, windUnitLabel);
        if (m == null || !Number.isFinite(m)) return null;
        s += m;
      }
      return s / hourlyWind24.length;
    })();
    if (windMeanMph != null) {
      wind_speed_mph_out = windMeanMph;
    } else {
      const wmaxArr = w?.wind_speed_10m_max_daily as number[] | undefined;
      const wmax = tempIdx != null && wmaxArr && wmaxArr[tempIdx] != null
        ? num(wmaxArr[tempIdx])
        : null;
      wind_speed_mph_out = windToMph(wmax, windUnitLabel) ?? windNowMph;
      if (windMeanMph == null && hourlyWindPts) {
        source_notes.push(
          `${calDayToday ? "calendar_today" : "forecast_day"}_wind_scalar_fallback: insufficient hourly wind for ${localDate} — using daily max or current`,
        );
      }
    }

    active_precip_now = false;
    precip_rate_now_out = null;
  }

  if (
    context === "freshwater_river" &&
    precip_7d_in == null &&
    (precip_24h != null || precip_72h != null)
  ) {
    source_notes.push(
      "river_runoff: precip_7d_in missing while other precip totals exist — runoff_flow_disruption omitted until 7-day total is available",
    );
  }

  return {
    latitude,
    longitude,
    state_code,
    region_key,
    local_date: localDate,
    local_timezone: localTimezone,
    context,
    environment: {
      current_air_temp_f,
      daily_mean_air_temp_f,
      measured_water_temp_f: measuredWaterTempF,
      measured_water_temp_24h_ago_f: measuredWaterTemp24hAgoF,
      measured_water_temp_72h_ago_f: measuredWaterTemp72hAgoF,
      measured_water_temp_source: measuredWaterTempSource,
      daily_low_air_temp_f: daily_low_air,
      daily_high_air_temp_f: daily_high_air,
      prior_day_mean_air_temp_f: prior_mean,
      day_minus_2_mean_air_temp_f: d2_mean,
      pressure_mb: pressure_mb_out,
      pressure_history_mb,
      wind_speed_mph: wind_speed_mph_out,
      cloud_cover_pct: cloud_cover_pct_out,
      precip_24h_in: precip_24h,
      precip_72h_in: precip_72h,
      precip_7d_in: precip_7d_in,
      active_precip_now,
      precip_rate_now_in_per_hr: precip_rate_now_out,
      tide_movement_state: tidePhase,
      tide_station_id: tides && typeof tides.station_id === "string" ? tides.station_id : null,
      tide_high_low,
      current_speed_knots_max: currentKts,
      tide_height_hourly_ft: null,
      sunrise_local: sun && typeof sun.sunrise === "string" ? sun.sunrise : null,
      sunset_local: sun && typeof sun.sunset === "string" ? sun.sunset : null,
      solunar_peak_local: solunar_peak_local?.length ? solunar_peak_local : undefined,
      hourly_air_temp_f: hourlyAirTemp24,
      hourly_cloud_cover_pct: hourlyCloudPct24,
    },
    data_coverage: source_notes.length ? { source_notes } : {},
  };
}
