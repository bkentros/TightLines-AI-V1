import { addDays, parseUnixSeconds } from "./dateUtils.ts";

export interface ArchiveWeatherResult {
  raw: unknown;
  timezone: string;
  tz_offset_seconds: number;
  hourly_times_unix: number[];
  hourly_pressure_msl: number[];
  hourly_temp_f: number[];
  hourly_cloud_cover: number[];
  hourly_wind_mph: number[];
  hourly_precip_mm: number[];
  daily_times_unix: number[];
  daily_temp_max_f: number[];
  daily_temp_min_f: number[];
  daily_precip_mm: number[];
  daily_precip_in: number[];
  daily_wind_max_mph: number[];
}

export async function fetchArchiveWeather(
  latitude: number,
  longitude: number,
  targetDate: string,
): Promise<ArchiveWeatherResult | null> {
  const startDate = addDays(targetDate, -15);
  const endDate = addDays(targetDate, 7);

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
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
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let timeoutId: number | undefined;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 20_000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
      });

      if (!response.ok) {
        const retryable = response.status >= 500 || response.status === 429;
        if (retryable && attempt < maxAttempts) {
          console.warn(
            `Archive weather fetch retry ${attempt}/${maxAttempts} after ${response.status} ${response.statusText} for ${url}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
          continue;
        }
        console.error(`Archive weather fetch failed: ${response.status} ${response.statusText} for ${url}`);
        return null;
      }

      const json = await response.json();
      const hourly = json?.hourly;
      const daily = json?.daily;

      if (!hourly || !daily) {
        console.error(
          `Archive weather response missing hourly/daily arrays for ${targetDate} lat=${latitude} lon=${longitude}`,
        );
        return null;
      }

      const timezone = typeof json?.timezone === "string" ? json.timezone : "UTC";
      const tzOffsetSeconds = typeof json?.utc_offset_seconds === "number" ? json.utc_offset_seconds : 0;

      const hourlyTimes = (hourly.time as unknown[]).map((value) => parseUnixSeconds(value) ?? 0);
      const hourlyPressure = (hourly.pressure_msl as Array<number | null>).map((value) => Number(value) || 0);
      const hourlyTemp = (hourly.temperature_2m as Array<number | null>).map((value) => Number(value) || 0);
      const hourlyCloud = (hourly.cloud_cover as Array<number | null>).map((value) => Number(value) || 0);
      const hourlyWind = (hourly.wind_speed_10m as Array<number | null>).map((value) => Number(value) || 0);
      const hourlyPrecip = (hourly.precipitation as Array<number | null>).map((value) => Number(value) || 0);

      const dailyTimes = (daily.time as unknown[]).map((value) => parseUnixSeconds(value) ?? 0);
      const dailyMax = (daily.temperature_2m_max as Array<number | null>).map((value) => Number(value) || 0);
      const dailyMin = (daily.temperature_2m_min as Array<number | null>).map((value) => Number(value) || 0);
      const dailyPrecipMm = (daily.precipitation_sum as Array<number | null>).map((value) => Number(value) || 0);
      const dailyPrecipIn = dailyPrecipMm.map((value) => value / 25.4);
      const dailyWindMax = (daily.wind_speed_10m_max as Array<number | null>).map((value) => Number(value) || 0);

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
        daily_temp_max_f: dailyMax,
        daily_temp_min_f: dailyMin,
        daily_precip_mm: dailyPrecipMm,
        daily_precip_in: dailyPrecipIn,
        daily_wind_max_mph: dailyWindMax,
      };
    } catch (error) {
      const retryable = attempt < maxAttempts;
      if (retryable) {
        console.warn(
          `Archive weather fetch retry ${attempt}/${maxAttempts} after error for ${targetDate} lat=${latitude} lon=${longitude}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
        continue;
      }
      console.error(
        `Archive weather fetch error for ${targetDate} lat=${latitude} lon=${longitude}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }
  }

  return null;
}
