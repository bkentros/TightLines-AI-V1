import {
  hourlyPointsTo24ArrayForLocalDate,
} from "../../howFishingEngine/request/hourlyLocalDay.ts";

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

/**
 * Mean wind speed (mph) from 5:00 AM through 9:00 PM **local** time on `local_date`.
 * Uses hourly samples when sufficient; falls back to scalar `weather.wind_speed`.
 */
export function meanDaylightWindMph(args: {
  env_data: Record<string, unknown>;
  local_date: string;
  local_timezone: string;
}): number {
  const { env_data, local_date, local_timezone } = args;
  const w = env_data.weather && typeof env_data.weather === "object"
    ? (env_data.weather as Record<string, unknown>)
    : null;

  const hourlyRaw = env_data.hourly_wind_speed;
  const hourlyPts = Array.isArray(hourlyRaw) && hourlyRaw.length > 0
    ? (hourlyRaw as Array<{ time_utc: string; value: number }>)
    : null;

  const windUnit = w?.wind_speed_unit;

  if (hourlyPts) {
    const arr = hourlyPointsTo24ArrayForLocalDate(
      hourlyPts,
      local_date,
      local_timezone,
    );
    if (arr && arr.length === 24) {
      let s = 0;
      let n = 0;
      // local hours 5–21 inclusive (5am–9pm)
      for (let h = 5; h <= 21; h++) {
        const mph = windToMph(arr[h]!, windUnit);
        if (mph != null && Number.isFinite(mph)) {
          s += mph;
          n++;
        }
      }
      if (n > 0) return s / n;
    }
  }

  const fallback = windToMph(num(w?.wind_speed), windUnit);
  return fallback ?? 0;
}
