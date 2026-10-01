import { getEnvironment } from "./env";
import type { EnvironmentData } from "./env/types";

export type PierCastHourlyWeatherPoint = {
  localTime: string;
  airTemperatureF: number | null;
  windSpeedMph: number | null;
  windDirectionDegrees: number | null;
};

type HourlyPoint = { time_utc: string; value: number };

function abortError(): Error {
  const error = new Error("Hourly weather request was cancelled.");
  error.name = "AbortError";
  return error;
}

function waitForResult<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(abortError());
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(abortError());
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}

function numberByTime(series: HourlyPoint[] | undefined): Map<string, number> {
  const result = new Map<string, number>();
  for (const point of series ?? []) {
    if (
      typeof point?.time_utc === "string" &&
      typeof point.value === "number" &&
      Number.isFinite(point.value)
    ) {
      result.set(point.time_utc, point.value);
    }
  }
  return result;
}

export function pierCastLocalHour(
  timeUtc: string,
  timezone: string,
): string | null {
  const date = new Date(timeUtc);
  if (Number.isNaN(date.getTime())) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value;
    const year = get("year");
    const month = get("month");
    const day = get("day");
    const hour = get("hour");
    return year && month && day && hour
      ? `${year}-${month}-${day}T${hour}:00`
      : null;
  } catch {
    return null;
  }
}

export function pierCastHourlyWeatherFromEnvironment(
  environment: Pick<
    EnvironmentData,
    | "timezone"
    | "hourly_air_temp_f"
    | "hourly_wind_speed"
    | "hourly_wind_direction_deg"
  >,
): { timezone: string | null; points: PierCastHourlyWeatherPoint[] } {
  const timezone = environment.timezone?.trim() || "UTC";
  const air = numberByTime(environment.hourly_air_temp_f);
  const wind = numberByTime(environment.hourly_wind_speed);
  const direction = numberByTime(environment.hourly_wind_direction_deg);
  const points: PierCastHourlyWeatherPoint[] = [];
  for (const [timeUtc, airTemperatureF] of air) {
    const localTime = pierCastLocalHour(timeUtc, timezone);
    if (!localTime) continue;
    points.push({
      localTime,
      airTemperatureF,
      windSpeedMph: wind.get(timeUtc) ?? null,
      windDirectionDegrees: direction.get(timeUtc) ?? null,
    });
  }
  return {
    timezone: environment.timezone?.trim() || null,
    points,
  };
}

export async function fetchPierCastHourlyWeather(input: {
  latitude: number;
  longitude: number;
  signal?: AbortSignal;
}): Promise<{
  timezone: string | null;
  points: PierCastHourlyWeatherPoint[];
}> {
  const environment = await waitForResult(
    getEnvironment({
      latitude: input.latitude,
      longitude: input.longitude,
      units: "imperial",
    }),
    input.signal,
  );
  const weather = pierCastHourlyWeatherFromEnvironment(environment);
  if (weather.points.length === 0) {
    throw new Error("Hourly weather is unavailable.");
  }
  return weather;
}
