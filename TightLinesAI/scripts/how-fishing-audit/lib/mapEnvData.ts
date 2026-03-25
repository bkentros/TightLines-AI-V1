/**
 * Maps ArchiveWeatherResult + optional auxiliary data into the env_data shape
 * that buildSharedEngineRequestFromEnvData expects.
 *
 * Key contracts (from buildFromEnvData.ts):
 *   weather.pressure_48hr           → flat number[] (read directly at dayOffset=0)
 *   weather.temp_7day_high/low      → 21-length slice, targetDate at index 14
 *   weather.precip_7day_daily       → same; inches
 *   weather.precipitation           → mm (divided by 25.4 for precip_rate_now)
 *   hourly_air_temp_f               → Array<{ time_utc: string; value: number }>
 *   hourly_cloud_cover_pct          → same shape
 *   solunar.major_periods[].start   → "HH:mm" (only .start used by engine)
 */

import type { ArchiveWeatherResult } from "./fetchArchiveWeather.ts";
import type { USNOMoonResult } from "./fetchUSNOMoon.ts";
import type { TidesResult } from "./fetchNOAATides.ts";
import type { SunResult } from "./fetchSunriseSunset.ts";
import {
  findNoonHourIndex,
  findMidnightHourIndex,
  findDailyIndex,
} from "./dateUtils.ts";

export function mapArchiveToEnvData(
  archive: ArchiveWeatherResult,
  targetDate: string,
  ianaTimezone: string,
  sun: SunResult | null,
  moon: USNOMoonResult | null,
  tides: TidesResult | null,
): Record<string, unknown> {
  // ── 1. Locate target date indices ─────────────────────────────────────────
  const noonHourIdx = findNoonHourIndex(
    archive.hourly_times_unix,
    targetDate,
    ianaTimezone,
  );
  const midnightHourIdx = findMidnightHourIndex(
    archive.hourly_times_unix,
    targetDate,
    ianaTimezone,
  );
  const targetDailyIdx = findDailyIndex(
    archive.daily_times_unix,
    targetDate,
    ianaTimezone,
  );

  // Rebase parallel daily arrays so targetDate is always at index 14 (engine contract).
  let daily_times_unix = archive.daily_times_unix;
  let daily_temp_max_f = archive.daily_temp_max_f;
  let daily_temp_min_f = archive.daily_temp_min_f;
  let daily_precip_mm = archive.daily_precip_mm;
  let daily_precip_in = archive.daily_precip_in;
  let daily_wind_max_mph = archive.daily_wind_max_mph;

  if (targetDailyIdx >= 14 && archive.daily_temp_max_f.length >= targetDailyIdx + 7) {
    const a = targetDailyIdx - 14;
    const b = a + 21;
    daily_times_unix = daily_times_unix.slice(a, b);
    daily_temp_max_f = daily_temp_max_f.slice(a, b);
    daily_temp_min_f = daily_temp_min_f.slice(a, b);
    daily_precip_mm = daily_precip_mm.slice(a, b);
    daily_precip_in = daily_precip_in.slice(a, b);
    daily_wind_max_mph = daily_wind_max_mph.slice(a, b);
  } else if (targetDailyIdx >= 0 && targetDailyIdx < 14) {
    console.warn(
      `mapEnvData: targetDate ${targetDate} at daily index ${targetDailyIdx} (<14) — cannot rebase; check archive start_date`,
    );
  } else if (targetDailyIdx >= 0 && archive.daily_temp_max_f.length < targetDailyIdx + 7) {
    console.warn(
      `mapEnvData: daily series too short (targetIdx=${targetDailyIdx} len=${archive.daily_temp_max_f.length}) for 7d lookahead; using raw arrays`,
    );
  }

  // ── 2. Current (noon) scalar values ──────────────────────────────────────
  const noonIdx = noonHourIdx >= 0 ? noonHourIdx : Math.max(0, midnightHourIdx + 12);

  const temperature = archive.hourly_temp_f[noonIdx] ?? 0;
  const pressure = archive.hourly_pressure_msl[noonIdx] ?? 0;
  const cloud_cover = archive.hourly_cloud_cover[noonIdx] ?? 0;

  // Daily max wind / precip for target calendar day (rebased → index 14)
  const dailyIdx = Math.min(14, daily_wind_max_mph.length - 1);
  const wind_speed = daily_wind_max_mph[dailyIdx] ?? 0;

  // Daily precip total in mm for weather.precipitation
  // (buildFromEnvData divides by 25.4 to get in/hr — for archive this is the
  // daily total, not an instantaneous rate, but the sign/magnitude is correct
  // for active_precip_now detection: > 0.5mm means it rained that day)
  const precipitation = daily_precip_mm[dailyIdx] ?? 0;

  // ── 3. pressure_48hr: 48 hourly readings ending at noon ──────────────────
  const p48Start = Math.max(0, noonIdx - 47);
  const pressure_48hr = archive.hourly_pressure_msl.slice(p48Start, noonIdx + 1);

  // ── 4. Daily arrays (21 entries: targetDate at index 14 after rebase) ─────
  const temp_7day_high = daily_temp_max_f;
  const temp_7day_low = daily_temp_min_f;
  const precip_7day_daily = daily_precip_in; // inches

  // ── 5. Hourly UTC-stamped point arrays ────────────────────────────────────
  // buildFromEnvData feeds these through hourlyPointsTo24ArrayForLocalDate which
  // converts each time_utc back to local date+hour. We emit 24 entries for the
  // target day (hours 0–23 local).
  const hourly_air_temp_f: Array<{ time_utc: string; value: number }> = [];
  const hourly_cloud_cover_pct: Array<{ time_utc: string; value: number }> = [];

  if (midnightHourIdx >= 0) {
    for (let h = 0; h < 24; h++) {
      const idx = midnightHourIdx + h;
      if (idx >= archive.hourly_times_unix.length) break;
      const utcIso = new Date(archive.hourly_times_unix[idx]! * 1000).toISOString();
      hourly_air_temp_f.push({ time_utc: utcIso, value: archive.hourly_temp_f[idx] ?? 0 });
      hourly_cloud_cover_pct.push({
        time_utc: utcIso,
        value: archive.hourly_cloud_cover[idx] ?? 0,
      });
    }
  }

  // ── 6. Sun ────────────────────────────────────────────────────────────────
  // Prefer USNO sun data (already HH:mm local); fall back to sunrise-sunset.org
  const sunObj: Record<string, string> | undefined =
    moon?.sun_rise && moon?.sun_set
      ? { sunrise: moon.sun_rise, sunset: moon.sun_set }
      : sun
      ? { sunrise: sun.sunrise, sunset: sun.sunset }
      : undefined;

  // ── 7. Solunar ────────────────────────────────────────────────────────────
  const solunarObj = moon?.solunar && moon.solunar.major_periods.length > 0
    ? { major_periods: moon.solunar.major_periods, minor_periods: moon.solunar.minor_periods }
    : undefined;

  // ── 8. Tides ──────────────────────────────────────────────────────────────
  const tidesObj = tides
    ? {
        station_id: tides.station_id,
        phase: tides.phase ?? null,
        high_low: tides.high_low,
      }
    : undefined;

  // ── 9. Assemble env_data ──────────────────────────────────────────────────
  return {
    timezone: ianaTimezone,
    weather: {
      temperature,
      pressure,
      wind_speed,
      cloud_cover,
      precipitation,        // mm daily total (engine reads as precip_mm → /25.4)
      pressure_48hr,        // flat number[] — used directly at dayOffset=0
      temp_7day_high,       // 21-entry array, targetDate at index 14
      temp_7day_low,
      precip_7day_daily,    // 21-entry array in inches, targetDate at index 14
    },
    sun: sunObj,
    solunar: solunarObj,
    tides: tidesObj,
    hourly_air_temp_f,      // Array<{ time_utc, value }> — engine maps to 24-slot array
    hourly_cloud_cover_pct,
  };
}
