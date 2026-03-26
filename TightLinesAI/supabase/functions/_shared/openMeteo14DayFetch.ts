/**
 * Open-Meteo past_days=14 + forecast_days=7 fetch — shared by get-environment,
 * forecast-scores, and how-fishing (server-side forecast-day weather merge).
 */

const MM_TO_INCHES = 1 / 25.4;

function getTzOffsetHours(lon: number): number {
  if (lon >= -81) return -5;
  if (lon >= -96) return -6;
  if (lon >= -114) return -7;
  return -8;
}

function parseOpenMeteoUnixSeconds(t: unknown): number | null {
  if (typeof t === "number" && Number.isFinite(t)) return t;
  if (typeof t === "string" && t.length > 0) {
    const n = Number(t);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function unixSecToLocalDateYmd(unixSec: number, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(unixSec * 1000));
}

function unixSecToLocalHHMM(unixSec: number, timeZone: string): string {
  const d = new Date(unixSec * 1000);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

function findCurrentHourlyIndex(hourlyUnix: number[], observationUnix: number | null): number {
  if (!hourlyUnix.length) return -1;
  if (observationUnix == null || !Number.isFinite(observationUnix)) {
    return hourlyUnix.length - 1;
  }
  let found = -1;
  for (let i = 0; i < hourlyUnix.length; i++) {
    const t = hourlyUnix[i];
    if (t != null && t <= observationUnix) found = i;
    else break;
  }
  return found >= 0 ? found : 0;
}

type PressureTrend =
  | "rapidly_falling"
  | "slowly_falling"
  | "stable"
  | "slowly_rising"
  | "rapidly_rising";

function classifyPressureTrend(rateMbPerHr: number): PressureTrend {
  if (rateMbPerHr < -1.5) return "rapidly_falling";
  if (rateMbPerHr < -0.5) return "slowly_falling";
  if (rateMbPerHr <= 0.5) return "stable";
  if (rateMbPerHr <= 1.5) return "slowly_rising";
  return "rapidly_rising";
}

type TempTrend3Day = "rapid_warming" | "warming" | "stable" | "cooling" | "rapid_cooling";

function classifyTempTrend(deltaF72hr: number, maxDrop24hr: number): TempTrend3Day {
  if (maxDrop24hr > 3) return "rapid_cooling";
  if (deltaF72hr >= 4) return "rapid_warming";
  if (deltaF72hr >= 2) return "warming";
  if (deltaF72hr > -2) return "stable";
  return "cooling";
}

export interface OpenMeteo14DayWeather {
  temperature: number;
  humidity: number;
  cloud_cover: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  gust_speed: number | null;
  temp_unit: string;
  wind_speed_unit: string;
  pressure_trend?: PressureTrend;
  pressure_change_rate_mb_hr?: number;
  pressure_48hr?: number[];
  temp_trend_3day?: TempTrend3Day;
  temp_trend_direction_f?: number;
  temp_7day_high?: number[];
  temp_7day_low?: number[];
  precip_48hr_inches?: number;
  precip_7day_inches?: number;
  precip_7day_daily?: number[];
  /** Daily max wind (same unit as wind_speed), 21 entries: index 14 = today */
  wind_speed_10m_max_daily?: number[];
}

export interface OpenMeteo14DaySun {
  sunrise: string;
  sunset: string;
  twilight_begin?: string;
  twilight_end?: string;
}

export interface OpenMeteo14DayForecastDay {
  date: string;
  high_temp_f: number;
  low_temp_f: number;
  precip_chance_pct: number;
  wind_mph_max: number;
  sunrise_local: string;
  sunset_local: string;
}

export interface OpenMeteo14DayResult {
  weather?: OpenMeteo14DayWeather;
  sun?: OpenMeteo14DaySun;
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }>;
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }>;
  hourly_cloud_cover_pct?: Array<{ time_utc: string; value: number }>;
  /** Same unit as weather.wind_speed (mph or km/h per request) */
  hourly_wind_speed?: Array<{ time_utc: string; value: number }>;
  timezone?: string;
  tz_offset_hours?: number;
  forecast_daily?: OpenMeteo14DayForecastDay[];
}

export async function fetchOpenMeteo14Day(
  lat: number,
  lon: number,
  units: "imperial" | "metric",
): Promise<OpenMeteo14DayResult | null> {
  const tempUnit = units === "imperial" ? "fahrenheit" : "celsius";
  const windUnit = units === "imperial" ? "mph" : "kmh";

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,precipitation,wind_gusts_10m",
    hourly: "pressure_msl,temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation",
    daily:
      "sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
    temperature_unit: tempUnit,
    wind_speed_unit: windUnit,
    timezone: "auto",
    past_days: "14",
    forecast_days: "7",
    timeformat: "unixtime",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url, { headers: { "User-Agent": "TightLinesAI/2.0 (fishing app)" } });
  if (!res.ok) return null;

  const json = await res.json();
  const current = json?.current;
  const daily = json?.daily;
  const hourly = json?.hourly;
  if (!current || !daily || !hourly) return null;
  const tzOffsetHoursRaw = Number(json?.utc_offset_seconds);
  const tzOffsetHours = Number.isFinite(tzOffsetHoursRaw)
    ? tzOffsetHoursRaw / 3600
    : getTzOffsetHours(lon);
  const timezone = typeof json?.timezone === "string" ? json.timezone : "UTC";

  const weather: OpenMeteo14DayWeather = {
    temperature: Number(current.temperature_2m) || 0,
    humidity: Number(current.relative_humidity_2m) || 0,
    cloud_cover: Number(current.cloud_cover) || 0,
    pressure: Number(current.pressure_msl) || 0,
    wind_speed: Number(current.wind_speed_10m) || 0,
    wind_direction: Number(current.wind_direction_10m) || 0,
    precipitation: Number(current.precipitation) || 0,
    gust_speed: Number(current.wind_gusts_10m) || null,
    temp_unit: units === "imperial" ? "°F" : "°C",
    wind_speed_unit: units === "imperial" ? "mph" : "km/h",
  };

  const hourlyUnix: number[] = Array.isArray(hourly.time)
    ? (hourly.time as unknown[]).map((x) => parseOpenMeteoUnixSeconds(x)).filter((x): x is number => x != null)
    : [];
  const currentUnix = parseOpenMeteoUnixSeconds(current.time);
  const pressureHourly: number[] = Array.isArray(hourly.pressure_msl)
    ? (hourly.pressure_msl as (number | null)[]).map((v) => Number(v) || 0)
    : [];

  const currentHourIdx = findCurrentHourlyIndex(hourlyUnix, currentUnix);

  if (pressureHourly.length > 0 && currentHourIdx >= 0) {
    const lookbackIdx = Math.max(0, currentHourIdx - 3);
    const pressureNow = pressureHourly[currentHourIdx] ?? 0;
    const pressure3hAgo = pressureHourly[lookbackIdx] ?? pressureNow;
    const hoursElapsed = currentHourIdx - lookbackIdx || 1;
    const rateMbPerHr = (pressureNow - pressure3hAgo) / hoursElapsed;

    weather.pressure_trend = classifyPressureTrend(rateMbPerHr);
    weather.pressure_change_rate_mb_hr = Math.round(rateMbPerHr * 100) / 100;

    const startIdx = Math.max(0, currentHourIdx - 47);
    weather.pressure_48hr = pressureHourly.slice(startIdx, currentHourIdx + 1);
  }

  const tempHourly: number[] = Array.isArray(hourly.temperature_2m)
    ? (hourly.temperature_2m as (number | null)[]).map((v) => Number(v) || 0)
    : [];
  const cloudHourly: number[] = Array.isArray(hourly.cloud_cover)
    ? (hourly.cloud_cover as (number | null)[]).map((v) => Math.max(0, Math.min(100, Number(v) || 0)))
    : [];
  const windHourly: number[] = Array.isArray(hourly.wind_speed_10m)
    ? (hourly.wind_speed_10m as (number | null)[]).map((v) => Number(v) || 0)
    : [];

  if (tempHourly.length > 0 && currentHourIdx >= 0) {
    const idx72hAgo = Math.max(0, currentHourIdx - 72);
    const idx24hAgo = Math.max(0, currentHourIdx - 24);
    const tempNow = tempHourly[currentHourIdx] ?? 0;
    const temp72hAgo = tempHourly[idx72hAgo] ?? tempNow;
    const temp24hAgo = tempHourly[idx24hAgo] ?? tempNow;

    const delta72hr = tempNow - temp72hAgo;
    const drop24hr = temp24hAgo - tempNow;

    weather.temp_trend_3day = classifyTempTrend(delta72hr, drop24hr);
    weather.temp_trend_direction_f = Math.round(delta72hr * 10) / 10;
  }

  const dailyHighs: (number | null)[] = Array.isArray(daily.temperature_2m_max)
    ? daily.temperature_2m_max
    : [];
  const dailyLows: (number | null)[] = Array.isArray(daily.temperature_2m_min)
    ? daily.temperature_2m_min
    : [];
  const dailyWindMax: (number | null)[] = Array.isArray(daily.wind_speed_10m_max)
    ? daily.wind_speed_10m_max
    : [];

  if (dailyHighs.length > 0) {
    weather.temp_7day_high = dailyHighs.map((v) => Math.round((Number(v) || 0) * 10) / 10);
  }
  if (dailyLows.length > 0) {
    weather.temp_7day_low = dailyLows.map((v) => Math.round((Number(v) || 0) * 10) / 10);
  }
  if (dailyWindMax.length > 0) {
    weather.wind_speed_10m_max_daily = dailyWindMax.map((v) =>
      Math.round((Number(v) || 0) * 10) / 10
    );
  }

  const dailyPrecipMm: (number | null)[] = Array.isArray(daily.precipitation_sum)
    ? daily.precipitation_sum
    : [];

  if (dailyPrecipMm.length > 0) {
    const dailyPrecipIn = dailyPrecipMm.map((v) =>
      Math.round((Number(v) || 0) * MM_TO_INCHES * 1000) / 1000
    );
    weather.precip_7day_daily = dailyPrecipIn;

    const todayPrecipIdx = Math.min(14, dailyPrecipIn.length - 1);
    const yesterdayIn = todayPrecipIdx >= 1 ? (dailyPrecipIn[todayPrecipIdx - 1] ?? 0) : 0;
    const todayIn = todayPrecipIdx >= 0 ? (dailyPrecipIn[todayPrecipIdx] ?? 0) : 0;
    weather.precip_48hr_inches = Math.round((yesterdayIn + todayIn) * 1000) / 1000;
    const precip7Start = Math.max(0, todayPrecipIdx - 6);
    weather.precip_7day_inches = Math.round(
      dailyPrecipIn.slice(precip7Start, todayPrecipIdx + 1).reduce((sum, v) => sum + (v ?? 0), 0) * 1000
    ) / 1000;
  }

  const sunriseArr = Array.isArray(daily.sunrise) ? daily.sunrise : [];
  const sunsetArr = Array.isArray(daily.sunset) ? daily.sunset : [];
  const todayIdx = Math.min(14, Math.max(0, sunriseArr.length - 1));
  const todaySunriseUnix = parseOpenMeteoUnixSeconds(sunriseArr[todayIdx]);
  const todaySunsetUnix = parseOpenMeteoUnixSeconds(sunsetArr[todayIdx]);
  const sunriseHHMM =
    todaySunriseUnix != null ? unixSecToLocalHHMM(todaySunriseUnix, timezone) : "";
  const sunsetHHMM =
    todaySunsetUnix != null ? unixSecToLocalHHMM(todaySunsetUnix, timezone) : "";

  const sun: OpenMeteo14DaySun | undefined =
    sunriseHHMM && sunsetHHMM
      ? { sunrise: sunriseHHMM, sunset: sunsetHHMM }
      : undefined;

  const hourlyPressureMb: Array<{ time_utc: string; value: number }> = [];
  const hourlyAirTempF: Array<{ time_utc: string; value: number }> = [];
  const hourlyCloudCoverPct: Array<{ time_utc: string; value: number }> = [];
  const hourlyWindSpeed: Array<{ time_utc: string; value: number }> = [];

  if (hourlyUnix.length > 0) {
    for (let i = 0; i < hourlyUnix.length; i++) {
      const sec = hourlyUnix[i];
      if (sec == null || !Number.isFinite(sec)) continue;
      const utcIso = new Date(sec * 1000).toISOString();

      if (pressureHourly.length > i) {
        hourlyPressureMb.push({ time_utc: utcIso, value: pressureHourly[i] });
      }
      if (tempHourly.length > i) {
        hourlyAirTempF.push({ time_utc: utcIso, value: tempHourly[i] });
      }
      if (cloudHourly.length > i) {
        hourlyCloudCoverPct.push({ time_utc: utcIso, value: cloudHourly[i] });
      }
      if (windHourly.length > i) {
        hourlyWindSpeed.push({ time_utc: utcIso, value: windHourly[i] });
      }
    }
  }

  const dailyTimeAxis: unknown[] = Array.isArray(daily.time) ? daily.time : [];
  const dailyPrecipProb: (number | null)[] = Array.isArray(daily.precipitation_probability_max)
    ? daily.precipitation_probability_max
    : [];

  const forecastDaily: OpenMeteo14DayForecastDay[] = [];
  const todayDailyIdx = 14;
  for (let d = todayDailyIdx; d < Math.min(todayDailyIdx + 7, dailyTimeAxis.length); d++) {
    const dayUnix = parseOpenMeteoUnixSeconds(dailyTimeAxis[d]);
    if (dayUnix == null) continue;
    const dateStr = unixSecToLocalDateYmd(dayUnix, timezone);
    const srU = parseOpenMeteoUnixSeconds(sunriseArr[d]);
    const ssU = parseOpenMeteoUnixSeconds(sunsetArr[d]);
    const sr = srU != null ? unixSecToLocalHHMM(srU, timezone) : "";
    const ss = ssU != null ? unixSecToLocalHHMM(ssU, timezone) : "";
    forecastDaily.push({
      date: dateStr,
      high_temp_f: Math.round(Number(dailyHighs[d] ?? 0) * 10) / 10,
      low_temp_f: Math.round(Number(dailyLows[d] ?? 0) * 10) / 10,
      precip_chance_pct: Math.round(Number(dailyPrecipProb[d] ?? 0)),
      wind_mph_max: Math.round(Number(dailyWindMax[d] ?? 0) * 10) / 10,
      sunrise_local: sr,
      sunset_local: ss,
    });
  }

  return {
    weather,
    sun,
    hourly_pressure_mb: hourlyPressureMb,
    hourly_air_temp_f: hourlyAirTempF,
    hourly_cloud_cover_pct: hourlyCloudCoverPct,
    hourly_wind_speed: hourlyWindSpeed,
    timezone,
    tz_offset_hours: tzOffsetHours,
    forecast_daily: forecastDaily,
  };
}
