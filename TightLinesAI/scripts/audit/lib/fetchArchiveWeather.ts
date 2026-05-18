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

export interface ArchiveWeatherCacheStats {
  cache_dir: string;
  hits: number;
  misses: number;
  live_fetches: number;
  writes: number;
  failures: number;
  corrupt_entries: number;
}

let cacheDir: string | URL = new URL(
  "../.cache/open-meteo-archive/",
  import.meta.url,
);

const cacheStats: ArchiveWeatherCacheStats = {
  cache_dir: String(cacheDir),
  hits: 0,
  misses: 0,
  live_fetches: 0,
  writes: 0,
  failures: 0,
  corrupt_entries: 0,
};

export function setArchiveWeatherCacheDir(path: string): void {
  cacheDir = path;
  cacheStats.cache_dir = path;
}

export function getArchiveWeatherCacheStats(): ArchiveWeatherCacheStats {
  return { ...cacheStats, cache_dir: String(cacheDir) };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryAfterMs(raw: string | null): number | null {
  if (!raw) return null;
  const seconds = Number.parseFloat(raw);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(60_000, seconds * 1_000);
  }
  const dateMs = Date.parse(raw);
  if (!Number.isNaN(dateMs)) {
    return Math.min(60_000, Math.max(0, dateMs - Date.now()));
  }
  return null;
}

function retryDelayMs(response: Response, attempt: number): number {
  const retryAfter = retryAfterMs(response.headers.get("retry-after"));
  if (retryAfter != null) return retryAfter;
  if (response.status === 429) {
    return Math.min(30_000, 2_500 * 2 ** (attempt - 1));
  }
  return Math.min(10_000, 1_000 * attempt);
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function cachePathForHash(hash: string): string | URL {
  if (cacheDir instanceof URL) return new URL(`${hash}.json`, cacheDir);
  return `${cacheDir.replace(/[\\\/]+$/g, "")}/${hash}.json`;
}

async function readCachedArchiveJson(url: string): Promise<unknown | null> {
  const hash = await sha256Hex(url);
  const path = cachePathForHash(hash);
  try {
    const cached = JSON.parse(await Deno.readTextFile(path));
    if (cached?.url !== url || cached?.json == null) {
      cacheStats.corrupt_entries += 1;
      return null;
    }
    cacheStats.hits += 1;
    return cached.json;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      cacheStats.corrupt_entries += 1;
      console.warn(
        `Archive weather cache read failed for ${url}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
    cacheStats.misses += 1;
    return null;
  }
}

async function writeCachedArchiveJson(
  url: string,
  json: unknown,
): Promise<void> {
  const hash = await sha256Hex(url);
  const path = cachePathForHash(hash);
  try {
    await Deno.mkdir(cacheDir, { recursive: true });
    await Deno.writeTextFile(
      path,
      JSON.stringify({
        url,
        cached_at: new Date().toISOString(),
        json,
      }),
    );
    cacheStats.writes += 1;
  } catch (error) {
    console.warn(
      `Archive weather cache write failed for ${url}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function parseArchiveWeatherJson(
  json: any,
  targetDate: string,
  latitude: number,
  longitude: number,
): ArchiveWeatherResult | null {
  const hourly = json?.hourly;
  const daily = json?.daily;

  if (!hourly || !daily) {
    console.error(
      `Archive weather response missing hourly/daily arrays for ${targetDate} lat=${latitude} lon=${longitude}`,
    );
    return null;
  }

  const timezone = typeof json?.timezone === "string" ? json.timezone : "UTC";
  const tzOffsetSeconds = typeof json?.utc_offset_seconds === "number"
    ? json.utc_offset_seconds
    : 0;

  const hourlyTimes = (hourly.time as unknown[]).map((value) =>
    parseUnixSeconds(value) ?? 0
  );
  const hourlyPressure = (hourly.pressure_msl as Array<number | null>).map((
    value,
  ) => Number(value) || 0);
  const hourlyTemp = (hourly.temperature_2m as Array<number | null>).map((
    value,
  ) => Number(value) || 0);
  const hourlyCloud = (hourly.cloud_cover as Array<number | null>).map((
    value,
  ) => Number(value) || 0);
  const hourlyWind = (hourly.wind_speed_10m as Array<number | null>).map((
    value,
  ) => Number(value) || 0);
  const hourlyPrecip = (hourly.precipitation as Array<number | null>).map((
    value,
  ) => Number(value) || 0);

  const dailyTimes = (daily.time as unknown[]).map((value) =>
    parseUnixSeconds(value) ?? 0
  );
  const dailyMax = (daily.temperature_2m_max as Array<number | null>).map((
    value,
  ) => Number(value) || 0);
  const dailyMin = (daily.temperature_2m_min as Array<number | null>).map((
    value,
  ) => Number(value) || 0);
  const dailyPrecipMm = (daily.precipitation_sum as Array<number | null>).map((
    value,
  ) => Number(value) || 0);
  const dailyPrecipIn = dailyPrecipMm.map((value) => value / 25.4);
  const dailyWindMax = (daily.wind_speed_10m_max as Array<number | null>).map((
    value,
  ) => Number(value) || 0);

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
    hourly:
      "temperature_2m,pressure_msl,cloud_cover,wind_speed_10m,precipitation",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
    timeformat: "unixtime",
  });

  const url =
    `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;
  const maxAttempts = 5;
  const cachedJson = await readCachedArchiveJson(url);
  if (cachedJson != null) {
    return parseArchiveWeatherJson(
      cachedJson,
      targetDate,
      latitude,
      longitude,
    );
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let timeoutId: number | undefined;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 20_000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
      });
      cacheStats.live_fetches += 1;

      if (!response.ok) {
        const retryable = response.status >= 500 || response.status === 429;
        if (retryable && attempt < maxAttempts) {
          const delayMs = retryDelayMs(response, attempt);
          console.warn(
            `Archive weather fetch retry ${attempt}/${maxAttempts} after ${response.status} ${response.statusText}; waiting ${delayMs}ms for ${url}`,
          );
          await sleep(delayMs);
          continue;
        }
        console.error(
          `Archive weather fetch failed: ${response.status} ${response.statusText} for ${url}`,
        );
        cacheStats.failures += 1;
        return null;
      }

      const json = await response.json();
      const parsed = parseArchiveWeatherJson(
        json,
        targetDate,
        latitude,
        longitude,
      );
      if (!parsed) return null;
      await writeCachedArchiveJson(url, json);
      return parsed;
    } catch (error) {
      const retryable = attempt < maxAttempts;
      if (retryable) {
        const delayMs = Math.min(10_000, 1_000 * attempt);
        console.warn(
          `Archive weather fetch retry ${attempt}/${maxAttempts} after error; waiting ${delayMs}ms for ${targetDate} lat=${latitude} lon=${longitude}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        await sleep(delayMs);
        continue;
      }
      console.error(
        `Archive weather fetch error for ${targetDate} lat=${latitude} lon=${longitude}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      cacheStats.failures += 1;
      return null;
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }
  }

  return null;
}
