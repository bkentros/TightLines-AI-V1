import type { ArchiveWeatherResult } from "./fetchArchiveWeather.ts";
import type { TidesResult } from "./fetchNOAATides.ts";
import type { SunResult } from "./fetchSunriseSunset.ts";
import type { USNOMoonResult } from "./fetchUSNOMoon.ts";
import {
  findDailyIndex,
  findMidnightHourIndex,
  findNoonHourIndex,
} from "./dateUtils.ts";

export function mapArchiveToEnvData(
  archive: ArchiveWeatherResult,
  targetDate: string,
  ianaTimezone: string,
  sun: SunResult | null,
  moon: USNOMoonResult | null,
  tides: TidesResult | null,
): Record<string, unknown> {
  const noonHourIndex = findNoonHourIndex(archive.hourly_times_unix, targetDate, ianaTimezone);
  const midnightHourIndex = findMidnightHourIndex(archive.hourly_times_unix, targetDate, ianaTimezone);
  const targetDailyIndex = findDailyIndex(archive.daily_times_unix, targetDate, ianaTimezone);

  let dailyTimesUnix = archive.daily_times_unix;
  let dailyTempMax = archive.daily_temp_max_f;
  let dailyTempMin = archive.daily_temp_min_f;
  let dailyPrecipMm = archive.daily_precip_mm;
  let dailyPrecipIn = archive.daily_precip_in;
  let dailyWindMax = archive.daily_wind_max_mph;

  if (targetDailyIndex >= 14 && archive.daily_temp_max_f.length >= targetDailyIndex + 7) {
    const start = targetDailyIndex - 14;
    const end = start + 21;
    dailyTimesUnix = dailyTimesUnix.slice(start, end);
    dailyTempMax = dailyTempMax.slice(start, end);
    dailyTempMin = dailyTempMin.slice(start, end);
    dailyPrecipMm = dailyPrecipMm.slice(start, end);
    dailyPrecipIn = dailyPrecipIn.slice(start, end);
    dailyWindMax = dailyWindMax.slice(start, end);
  } else if (targetDailyIndex >= 0 && targetDailyIndex < 14) {
    console.warn(
      `mapArchiveToEnvData: targetDate ${targetDate} at daily index ${targetDailyIndex} (<14); using untrimmed arrays.`,
    );
  } else if (targetDailyIndex >= 0 && archive.daily_temp_max_f.length < targetDailyIndex + 7) {
    console.warn(
      `mapArchiveToEnvData: daily series too short (targetIdx=${targetDailyIndex} len=${archive.daily_temp_max_f.length}); using untrimmed arrays.`,
    );
  }

  const noonIndex = noonHourIndex >= 0 ? noonHourIndex : Math.max(0, midnightHourIndex + 12);
  const rebasedDailyIndex = Math.min(14, dailyWindMax.length - 1);

  const temperature = archive.hourly_temp_f[noonIndex] ?? 0;
  const pressure = archive.hourly_pressure_msl[noonIndex] ?? 0;
  const cloudCover = archive.hourly_cloud_cover[noonIndex] ?? 0;
  const windSpeed = dailyWindMax[rebasedDailyIndex] ?? 0;
  const precipitation = dailyPrecipMm[rebasedDailyIndex] ?? 0;

  const pressure48HourStart = Math.max(0, noonIndex - 47);
  const pressure48hr = archive.hourly_pressure_msl.slice(pressure48HourStart, noonIndex + 1);

  const hourlyAirTempF: Array<{ time_utc: string; value: number }> = [];
  const hourlyCloudCoverPct: Array<{ time_utc: string; value: number }> = [];
  const hourlyWindSpeed: Array<{ time_utc: string; value: number }> = [];

  if (midnightHourIndex >= 0) {
    for (let hour = 0; hour < 24; hour++) {
      const index = midnightHourIndex + hour;
      if (index >= archive.hourly_times_unix.length) break;
      const timeUtc = new Date(archive.hourly_times_unix[index]! * 1000).toISOString();
      hourlyAirTempF.push({ time_utc: timeUtc, value: archive.hourly_temp_f[index] ?? 0 });
      hourlyCloudCoverPct.push({ time_utc: timeUtc, value: archive.hourly_cloud_cover[index] ?? 0 });
      hourlyWindSpeed.push({ time_utc: timeUtc, value: archive.hourly_wind_mph[index] ?? 0 });
    }
  }

  const sunObject: Record<string, string> | undefined =
    moon?.sun_rise && moon?.sun_set
      ? { sunrise: moon.sun_rise, sunset: moon.sun_set }
      : sun
      ? { sunrise: sun.sunrise, sunset: sun.sunset }
      : undefined;

  const solunarObject = moon?.solunar && moon.solunar.major_periods.length > 0
    ? { major_periods: moon.solunar.major_periods, minor_periods: moon.solunar.minor_periods }
    : undefined;

  const tidesObject = tides
    ? {
      station_id: tides.station_id,
      phase: tides.phase ?? null,
      high_low: tides.high_low,
    }
    : undefined;

  return {
    timezone: ianaTimezone,
    weather: {
      temperature,
      pressure,
      wind_speed: windSpeed,
      wind_speed_unit: "mph",
      wind_speed_10m_max_daily: dailyWindMax,
      cloud_cover: cloudCover,
      precipitation,
      pressure_48hr: pressure48hr,
      temp_7day_high: dailyTempMax,
      temp_7day_low: dailyTempMin,
      precip_7day_daily: dailyPrecipIn,
    },
    sun: sunObject,
    solunar: solunarObject,
    tides: tidesObject,
    hourly_air_temp_f: hourlyAirTempF,
    hourly_cloud_cover_pct: hourlyCloudCoverPct,
    hourly_wind_speed: hourlyWindSpeed,
  };
}
