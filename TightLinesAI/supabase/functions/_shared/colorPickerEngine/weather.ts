import type { LightState } from "./researchSchema.ts";
export class ColorServiceError extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}
export const localDate = (ms: number, zone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(ms);
  return ["year", "month", "day"].map(k => parts.find(p => p.type === k)!.value).join("-");
};
export interface WeatherRequest { date: string; timezone: string; latitude: number; longitude: number; window?: { start: string; end: string } }
export interface WeatherData { timezone: string; sunrise: number; sunset: number; unit: "percent" | "fraction"; hours: { start: number; cloud: unknown }[] }
export interface WeatherSnapshot {
  source: "open_meteo" | "manual";
  date: string; timezone: string;
  window: { start: string; end: string } | null;
  meanCloudPercent: number | null; coverage: number | null;
  hourly: { start: string; durationSeconds: number; cloudPercent: number | null }[];
  groups: { light: LightState; label: string }[];
  manualReason?: string;
}
const badWeather = (message: string): never => { throw new ColorServiceError("weather_unavailable", message, 422); };
export function normalizeCloud(value: unknown, unit: WeatherData["unit"]): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > (unit === "fraction" ? 1 : 100)) return null;
  return unit === "fraction" ? value * 100 : value;
}
export function summarizeWeather(request: WeatherRequest, data: WeatherData): WeatherSnapshot {
  const canonicalZone = (zone: string) => new Intl.DateTimeFormat("en-US", { timeZone: zone }).resolvedOptions().timeZone;
  if (typeof data.timezone !== "string") return badWeather("Missing weather timezone.");
  let matches = false;
  try { matches = canonicalZone(data.timezone) === canonicalZone(request.timezone); } catch { return badWeather("Invalid weather timezone."); }
  if (!matches) return badWeather("Weather timezone does not match the report location timezone.");
  const { sunrise, sunset } = data;
  if (!Number.isFinite(sunrise) || !Number.isFinite(sunset)) return badWeather("Daylight times unavailable.");
  if (sunset <= sunrise) throw new ColorServiceError("daylight_required", "Choose a date with daylight color guidance.", 422);
  if (localDate(sunrise, request.timezone) !== request.date || localDate(sunset - 1, request.timezone) !== request.date) return badWeather("Daylight times belong to another date.");
  const start = Math.max(sunrise, request.window ? Date.parse(request.window.start) : sunrise);
  const end = Math.min(sunset, request.window ? Date.parse(request.window.end) : sunset);
  if (end <= start) throw new ColorServiceError("daylight_required", "This window is outside daylight. Choose the next daylight window.", 422);
  const seen = new Set<number>();
  let valid = 0, weighted = 0;
  const hourly: WeatherSnapshot["hourly"] = [];
  let previous = -Infinity;
  for (const hour of [...data.hours].sort((a, b) => a.start - b.start)) {
    if (!Number.isFinite(hour.start) || hour.start < previous + 3600000 || seen.has(hour.start)) return badWeather("Invalid or duplicate hourly timestamps.");
    seen.add(hour.start);
    previous = hour.start;
    const duration = Math.max(0, Math.min(end, hour.start + 3600000) - Math.max(start, hour.start));
    if (!duration) continue;
    const pct = normalizeCloud(hour.cloud, data.unit);
    hourly.push({ start: new Date(hour.start).toISOString(), durationSeconds: duration / 1000, cloudPercent: pct });
    if (pct !== null) { valid += duration; weighted += duration * pct; }
  }
  const coverage = valid / (end - start);
  if (coverage < 0.75) throw new ColorServiceError("weather_unavailable", "Weather coverage is insufficient. Please retry the forecast.", 422);
  const mean = weighted / valid;
  // Both are conditional guides, irrespective of today's average cloud cover.
  const groups: WeatherSnapshot["groups"] = [
    { light: "sunny", label: "When the sun is out" },
    { light: "cloudy", label: "Under cloud cover" },
  ];
  return { source: "open_meteo", date: request.date, timezone: request.timezone, window: { start: new Date(start).toISOString(), end: new Date(end).toISOString() }, meanCloudPercent: mean, coverage, hourly, groups };
}
/** Raw epoch times preserve DST and partial sunrise/sunset hours; no magnitude-based unit guessing. */
export async function fetchColorWeather(request: WeatherRequest, config: { baseUrl?: string; apiKey?: string; timeoutMs?: number } = {}, fetcher: typeof fetch = fetch): Promise<WeatherData> {
  const url = new URL(config.baseUrl || (config.apiKey ? "https://customer-api.open-meteo.com/v1/forecast" : "https://api.open-meteo.com/v1/forecast"));
  for (const [key, value] of Object.entries({ latitude: request.latitude, longitude: request.longitude, timezone: "auto", start_date: request.date, end_date: request.date, hourly: "cloud_cover", daily: "sunrise,sunset", timeformat: "unixtime" })) url.searchParams.set(key, String(value));
  if (config.apiKey) url.searchParams.set("apikey", config.apiKey);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs ?? 10000);
  try {
    const response = await fetcher(url, { signal: controller.signal });
    if (!response.ok) return badWeather("Weather provider unavailable.");
    const raw = await response.json();
    if (raw.hourly_units?.cloud_cover !== "%" || !Array.isArray(raw.hourly?.time) || !Array.isArray(raw.hourly?.cloud_cover) || raw.hourly.time.length !== raw.hourly.cloud_cover.length || raw.daily?.sunrise?.length !== 1 || raw.daily?.sunset?.length !== 1) return badWeather("Invalid weather provider schema.");
    const epoch = (v: unknown) => typeof v === "number" && Number.isFinite(v) ? v * 1000 : NaN;
    return { timezone: raw.timezone, sunrise: epoch(raw.daily.sunrise[0]), sunset: epoch(raw.daily.sunset[0]), unit: "percent", hours: raw.hourly.time.map((t: unknown, i: number) => ({ start: epoch(t), cloud: raw.hourly.cloud_cover[i] })) };
  } catch (error) {
    if (error instanceof ColorServiceError) throw error;
    return badWeather("Weather provider unavailable. Please retry the forecast.");
  } finally { clearTimeout(timer); }
}
