import type { EngineContext, SharedEngineRequest } from "../contracts/mod.ts";
import { resolveRegionForCoordinates } from "../context/resolveRegion.ts";

function num(x: unknown): number | null {
  if (x == null) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function readWeather(env: Record<string, unknown>): Record<string, unknown> | null {
  const w = env.weather;
  return w && typeof w === "object" ? (w as Record<string, unknown>) : null;
}

/**
 * Maps client get-environment payload into SharedEngineRequest.
 */
export function buildSharedEngineRequestFromEnvData(
  latitude: number,
  longitude: number,
  localDate: string,
  localTimezone: string,
  context: EngineContext,
  envData: Record<string, unknown>
): SharedEngineRequest {
  const { state_code, region_key } = resolveRegionForCoordinates(latitude, longitude);

  const w = readWeather(envData);
  const hourly = envData.hourly_pressure_mb;
  let pressure_history_mb: number[] | null = null;
  if (Array.isArray(hourly)) {
    pressure_history_mb = hourly
      .map((h: unknown) => {
        if (h && typeof h === "object" && "value" in h) return num((h as { value: unknown }).value);
        return null;
      })
      .filter((x): x is number => x != null);
  }
  if ((!pressure_history_mb || pressure_history_mb.length < 2) && w && Array.isArray(w.pressure_48hr)) {
    pressure_history_mb = (w.pressure_48hr as unknown[]).map((x) => num(x)).filter((x): x is number => x != null);
  }

  const th = w?.temp_7day_high as number[] | undefined;
  const tl = w?.temp_7day_low as number[] | undefined;
  const daily_mean =
    th?.[7] != null && tl?.[7] != null ? (th[7]! + tl[7]!) / 2 : num(w?.temperature);
  const prior_mean =
    th?.[6] != null && tl?.[6] != null ? (th[6]! + tl[6]!) / 2 : null;
  const d2_mean =
    th?.[5] != null && tl?.[5] != null ? (th[5]! + tl[5]!) / 2 : null;

  const pd = w?.precip_7day_daily as number[] | undefined;
  const precip_24h = pd?.[7] ?? (num(w?.precip_48hr_inches) != null ? num(w!.precip_48hr_inches)! / 2 : null);
  let precip_72h: number | null = null;
  if (pd && pd.length >= 3) {
    precip_72h = (pd[5] ?? 0) + (pd[6] ?? 0) + (pd[7] ?? 0);
  } else if (num(w?.precip_48hr_inches) != null) {
    precip_72h = num(w!.precip_48hr_inches);
  }

  const precip_mm = num(w?.precipitation);
  const precip_rate_now = precip_mm != null ? precip_mm / 25.4 : null;

  const tides = envData.tides as Record<string, unknown> | null | undefined;
  const tidePhase = tides && typeof tides.phase === "string" ? tides.phase : null;
  const highLow = tides?.high_low as Array<{ time: string; type?: string; value: number }> | undefined;
  const tide_high_low =
    Array.isArray(highLow) && highLow.length >= 2
      ? highLow.map((x) => ({ time: x.time, value: Number(x.value) }))
      : null;

  const currentKts = tides && typeof tides === "object" && "current_speed_knots_max" in tides
    ? num((tides as { current_speed_knots_max?: unknown }).current_speed_knots_max)
    : null;

  const sun = envData.sun as Record<string, unknown> | null | undefined;

  const solunar = envData.solunar as { major_periods?: Array<{ start: string }> } | undefined;
  const solunar_peak_local =
    solunar?.major_periods?.map((p) => p.start).filter((s) => typeof s === "string" && s.length > 0) ??
    undefined;

  return {
    latitude,
    longitude,
    state_code: state_code,
    region_key: region_key,
    local_date: localDate,
    local_timezone: localTimezone,
    context,
    environment: {
      current_air_temp_f: num(w?.temperature),
      daily_mean_air_temp_f: daily_mean,
      prior_day_mean_air_temp_f: prior_mean,
      day_minus_2_mean_air_temp_f: d2_mean,
      pressure_mb: num(w?.pressure),
      pressure_history_mb,
      wind_speed_mph: num(w?.wind_speed),
      cloud_cover_pct: num(w?.cloud_cover),
      precip_24h_in: precip_24h,
      precip_72h_in: precip_72h,
      precip_7d_in: num(w?.precip_7day_inches),
      active_precip_now: precip_mm != null && precip_mm > 0.5,
      precip_rate_now_in_per_hr: precip_rate_now,
      tide_movement_state: tidePhase,
      tide_station_id: tides && typeof tides.station_id === "string" ? tides.station_id : null,
      tide_high_low,
      current_speed_knots_max: currentKts,
      tide_height_hourly_ft: null,
      sunrise_local: sun && typeof sun.sunrise === "string" ? sun.sunrise : null,
      sunset_local: sun && typeof sun.sunset === "string" ? sun.sunset : null,
      solunar_peak_local: solunar_peak_local?.length ? solunar_peak_local : undefined,
    },
    data_coverage: {},
  };
}
