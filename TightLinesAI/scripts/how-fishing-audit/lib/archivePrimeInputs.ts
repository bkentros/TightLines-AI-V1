/**
 * Derive evaluatePrimeGates() inputs from Open-Meteo archive (same MSL pressure
 * slice contract as mapArchiveToEnvData / get-environment).
 */
import type { EngineContext } from "../../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { ArchiveWeatherResult } from "./fetchArchiveWeather.ts";
import type { TidesResult } from "./fetchNOAATides.ts";
import { findDailyIndex, findMidnightHourIndex, findNoonHourIndex } from "./dateUtils.ts";

function sumPrecip7dEndingAtIndex(dailyPrecipIn: number[] | undefined, endIdx: number): number | null {
  if (!dailyPrecipIn || endIdx < 6) return null;
  const start = endIdx - 6;
  let t = 0;
  for (let i = start; i <= endIdx; i++) t += dailyPrecipIn[i] ?? 0;
  return t;
}

/** Mean cloud cover % for local hours 6–20 inclusive (fishing-day window). */
function meanCloudFishingHours(
  archive: ArchiveWeatherResult,
  targetDate: string,
  ianaTimezone: string,
): number | null {
  const mid = findMidnightHourIndex(archive.hourly_times_unix, targetDate, ianaTimezone);
  if (mid < 0) return null;
  let sum = 0;
  let n = 0;
  for (let h = 6; h <= 20; h++) {
    const idx = mid + h;
    const v = archive.hourly_cloud_cover[idx];
    if (typeof v === "number" && Number.isFinite(v)) {
      sum += v;
      n++;
    }
  }
  return n > 0 ? sum / n : null;
}

export type ArchivePrimeInputs = {
  context: EngineContext;
  pressure_history_msl: number[];
  cloud_cover_mean_pct: number;
  wind_max_mph: number;
  precip_7d_sum_in: number | null;
  has_valid_tide: boolean;
};

export function buildPrimeGateInputsFromArchive(
  archive: ArchiveWeatherResult,
  targetDate: string,
  ianaTimezone: string,
  context: EngineContext,
  tides: TidesResult | null,
): ArchivePrimeInputs | null {
  const noonIdx = findNoonHourIndex(archive.hourly_times_unix, targetDate, ianaTimezone);
  if (noonIdx < 0) return null;
  const p48Start = Math.max(0, noonIdx - 47);
  const pressure_history_msl = archive.hourly_pressure_msl.slice(p48Start, noonIdx + 1);
  if (pressure_history_msl.length < 2) return null;

  const cloud_cover_mean_pct = meanCloudFishingHours(archive, targetDate, ianaTimezone);
  if (cloud_cover_mean_pct == null) return null;

  const dIdx = findDailyIndex(archive.daily_times_unix, targetDate, ianaTimezone);
  const windAt =
    dIdx >= 0 ? archive.daily_wind_max_mph[dIdx] : archive.daily_wind_max_mph[14];
  const wind_max_mph = typeof windAt === "number" && Number.isFinite(windAt) ? windAt : NaN;
  if (!Number.isFinite(wind_max_mph)) return null;

  const precip_7d_sum_in =
    context === "freshwater_river" && dIdx >= 0
      ? sumPrecip7dEndingAtIndex(archive.daily_precip_in, dIdx)
      : context === "freshwater_river"
      ? sumPrecip7dEndingAtIndex(archive.daily_precip_in, 14)
      : null;

  const has_valid_tide =
    context === "coastal" &&
    tides != null &&
    Array.isArray(tides.high_low) &&
    tides.high_low.length >= 2;

  return {
    context,
    pressure_history_msl,
    cloud_cover_mean_pct,
    wind_max_mph,
    precip_7d_sum_in,
    has_valid_tide: context === "coastal" ? has_valid_tide : false,
  };
}
