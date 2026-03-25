/**
 * Fetches historical weather data from Open-Meteo Archive API.
 *
 * Fetch window: targetDate-15 through targetDate+7 (23 calendar days of dailies).
 * Leaves room to slice 21 rows ending the day after the 6-day “forward” tail so
 * findDailyIndex(target) can sit as high as 16 when Open-Meteo shifts buckets.
 */

import { addDays, parseUnixSeconds } from "./dateUtils.ts";

export interface ArchiveWeatherResult {
  raw: unknown; // Full API response (for raw_weather in JSONL output)
  timezone: string; // IANA timezone from API (e.g. "America/Boise")
  tz_offset_seconds: number; // UTC offset in seconds (for USNO tz= param)
  // Hourly parallel arrays (full fetch window, ~504 entries)
  hourly_times_unix: number[];
  hourly_pressure_msl: number[];  // mb
  hourly_temp_f: number[];        // °F
  hourly_cloud_cover: number[];   // 0–100
  hourly_wind_mph: number[];      // mph
  hourly_precip_mm: number[];     // mm/hr (instantaneous)
  // Daily parallel arrays (21 entries: targetDate-14 to targetDate+6)
  daily_times_unix: number[];
  daily_temp_max_f: number[];
  daily_temp_min_f: number[];
  daily_precip_mm: number[];  // mm (daily total — kept as mm for weather.precipitation)
  daily_precip_in: number[];  // inches (daily total — for precip_7day_daily)
  daily_wind_max_mph: number[];
}

export async function fetchArchiveWeather(
  lat: number,
  lon: number,
  targetDate: string, // YYYY-MM-DD local date
): Promise<ArchiveWeatherResult | null> {
  const startDate = addDays(targetDate, -15);
  const endDate = addDays(targetDate, 7);

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: startDate,
    end_date: endDate,
    hourly: "temperature_2m,pressure_msl,cloud_cover,wind_speed_10m,precipitation",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
    timeformat: "unixtime",
  });

  const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.error(`Archive fetch failed: ${res.status} ${res.statusText} for ${url}`);
      return null;
    }

    const json = await res.json();
    const hourly = json?.hourly;
    const daily = json?.daily;

    if (!hourly || !daily) {
      console.error(`Archive response missing hourly/daily for ${targetDate} lat=${lat} lon=${lon}`);
      return null;
    }

    const timezone: string =
      typeof json?.timezone === "string" ? json.timezone : "UTC";
    const tzOffsetSeconds: number =
      typeof json?.utc_offset_seconds === "number" ? json.utc_offset_seconds : 0;

    // Parse hourly arrays
    const hourlyTimes = (hourly.time as unknown[]).map((t) => parseUnixSeconds(t) ?? 0);
    const hourlyPressure = (hourly.pressure_msl as (number | null)[]).map((v) =>
      Number(v) || 0
    );
    const hourlyTemp = (hourly.temperature_2m as (number | null)[]).map((v) =>
      Number(v) || 0
    );
    const hourlyCloud = (hourly.cloud_cover as (number | null)[]).map((v) =>
      Number(v) || 0
    );
    const hourlyWind = (hourly.wind_speed_10m as (number | null)[]).map((v) =>
      Number(v) || 0
    );
    const hourlyPrecip = (hourly.precipitation as (number | null)[]).map((v) =>
      Number(v) || 0
    );

    // Parse daily arrays
    const dailyTimes = (daily.time as unknown[]).map((t) => parseUnixSeconds(t) ?? 0);
    const dailyMaxF = (daily.temperature_2m_max as (number | null)[]).map((v) =>
      Number(v) || 0
    );
    const dailyMinF = (daily.temperature_2m_min as (number | null)[]).map((v) =>
      Number(v) || 0
    );
    const dailyPrecipMm = (daily.precipitation_sum as (number | null)[]).map((v) =>
      Number(v) || 0
    );
    const dailyPrecipIn = dailyPrecipMm.map((mm) => mm / 25.4);
    const dailyWindMax = (daily.wind_speed_10m_max as (number | null)[]).map((v) =>
      Number(v) || 0
    );

    return {
      raw: json,
      timezone,
      tz_offset_seconds: tzOffsetSeconds,
      hourly_times_unix: hourlyTimes,
      hourly_pressure_msl: hourlyPressure,
      hourly_temp_f: hourlyTemp,
      hourly_cloud_cover: hourlyCloud,
      hourly_wind_mph: hourlyWind,
      hourly_precip_mm: hourlyPrecip,
      daily_times_unix: dailyTimes,
      daily_temp_max_f: dailyMaxF,
      daily_temp_min_f: dailyMinF,
      daily_precip_mm: dailyPrecipMm,
      daily_precip_in: dailyPrecipIn,
      daily_wind_max_mph: dailyWindMax,
    };
  } catch (err) {
    console.error(
      `Archive fetch error for ${targetDate} lat=${lat} lon=${lon}:`,
      err instanceof Error ? err.message : String(err),
    );
    return null;
  }
}
