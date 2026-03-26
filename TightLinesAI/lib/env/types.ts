/**
 * Environmental API Integration — Type Definitions
 *
 * Shared interfaces for the get-environment Edge Function and client.
 * Used by: lib/env/, store/envStore.ts, and future AI feature Edge Functions.
 *
 * @see docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

// =============================================================================
// Request
// =============================================================================

export interface GetEnvironmentRequest {
  latitude: number;
  longitude: number;
  units?: 'imperial' | 'metric';
}

// =============================================================================
// Response — Main payload
// =============================================================================

export interface EnvironmentData {
  /** Whether weather data is present and usable */
  weather_available: boolean;
  /** Whether tide data is present (coastal only) */
  tides_available: boolean;
  /** Whether moon data is present */
  moon_available: boolean;
  /** Whether sunrise/sunset data is present */
  sun_available: boolean;

  weather?: WeatherData;
  tides?: TideData | null;
  moon?: MoonData;
  sun?: SunData;
  solunar?: SolunarData;

  /** ISO timestamp when data was fetched */
  fetched_at: string;

  /** IANA timezone for the requested location, when available */
  timezone?: string;
  /** Current UTC offset for the requested location, DST-aware when provider supplies it */
  tz_offset_hours?: number;
  /** Hourly pressure history for deterministic engine input */
  hourly_pressure_mb?: Array<{ time_utc: string; value: number }>;
  /** Hourly air-temperature history for deterministic engine input */
  hourly_air_temp_f?: Array<{ time_utc: string; value: number }>;
  /** Hourly cloud cover 0–100, aligned timestamps with hourly_air_temp_f */
  hourly_cloud_cover_pct?: Array<{ time_utc: string; value: number }>;
  /** Hourly wind — same unit as weather.wind_speed (mph or km/h) */
  hourly_wind_speed?: Array<{ time_utc: string; value: number }>;
  /** 30-day tide range history for deterministic engine input */
  tide_predictions_30day?: Array<{ date: string; high_ft: number; low_ft: number }>;
  /** Measured coastal water temperature in °F when available */
  measured_water_temp_f?: number | null;
  /** Source label for measured coastal water temperature */
  measured_water_temp_source?: string | null;
  /** Measured coastal water temperature from roughly 72 hours ago for cold-stun evaluation */
  measured_water_temp_72h_ago_f?: number | null;
  /** Whether the location is treated as coastal for engine routing */
  coastal?: boolean;
  /** Nearest NOAA tide station used for coastal routing */
  nearest_tide_station_id?: string | null;
}

// =============================================================================
// Weather (Open-Meteo)
// =============================================================================

export interface WeatherData {
  /** Air temperature (2m) */
  temperature: number;
  /** Relative humidity % */
  humidity: number;
  /** Cloud cover % */
  cloud_cover: number;
  /** Sea-level pressure (hPa) */
  pressure: number;
  /** Wind speed */
  wind_speed: number;
  /** Wind direction (degrees, 0-360) */
  wind_direction: number;
  /** Precipitation (mm) */
  precipitation: number;
  /** Unit labels for display */
  temp_unit: string;
  wind_speed_unit: string;

  // ─── Pressure trend (from 7-day hourly history) ───────────────────────────
  /** Direction of pressure change over the last 3 hours */
  pressure_trend?: 'rapidly_falling' | 'slowly_falling' | 'stable' | 'slowly_rising' | 'rapidly_rising';
  /** Rate of pressure change in mb/hr (negative = falling) */
  pressure_change_rate_mb_hr?: number;
  /** Last 48 hourly pressure readings in hPa, oldest first — for sparkline */
  pressure_48hr?: number[];

  // ─── Temperature trend (from 7-day history) ───────────────────────────────
  /** 3-day temperature trend classification */
  temp_trend_3day?: 'rapid_warming' | 'warming' | 'stable' | 'cooling' | 'rapid_cooling';
  /** Temperature delta over 72 hours in °F (positive = warming) */
  temp_trend_direction_f?: number;
  /** Daily high temperatures, 21 entries: index 0 = 14 days ago, index 14 = today, 15-20 = forecast */
  temp_7day_high?: number[];
  /** Daily low temperatures, same indexing as temp_7day_high */
  temp_7day_low?: number[];

  // ─── Precipitation history (from 7-day history) ───────────────────────────
  /** Total precipitation in the last 48 hours (inches) */
  precip_48hr_inches?: number;
  /** Total precipitation in the last 7 days (inches) */
  precip_7day_inches?: number;
  /** Daily precipitation totals in inches, 21 entries: index 0 = 14 days ago, index 14 = today, 15-20 = forecast */
  precip_7day_daily?: number[];
  /** Daily max wind (same unit as wind_speed), aligned with temp_7day indices */
  wind_speed_10m_max_daily?: number[];
}

// =============================================================================
// Tides (NOAA CO-OPS)
// =============================================================================

export interface TidePrediction {
  /** ISO timestamp or "YYYY-MM-DD HH:mm" */
  time: string;
  /** "H" = high, "L" = low */
  type: 'H' | 'L';
  /** Water level (feet or meters) */
  value: number;
}

export interface TideData {
  /** Nearest station ID */
  station_id: string;
  /** Station display name */
  station_name: string;
  /** High/low predictions for today */
  high_low: TidePrediction[];
  /** e.g. "incoming", "outgoing", "high", "low" — derived from nearest prediction */
  phase?: string;
  /** Unit for water level */
  unit: string;
}

// =============================================================================
// Moon (USNO)
// =============================================================================

export interface MoonData {
  /** Phase name: "New Moon", "First Quarter", "Full Moon", "Last Quarter" */
  phase: string;
  /** Illumination fraction 0-1 */
  illumination: number;
  /** Moonrise time (local) */
  rise: string | null;
  /** Moonset time (local) */
  set: string | null;
  /** Upper transit / overhead (local) */
  upper_transit: string | null;
  /** Lower transit / underfoot (local) — computed */
  lower_transit: string | null;
}

// =============================================================================
// Sun (Open-Meteo or USNO)
// =============================================================================

export interface SunData {
  /** Sunrise time (local, ISO or HH:mm) */
  sunrise: string;
  /** Sunset time (local) */
  sunset: string;
  /** Optional: civil twilight begin/end */
  twilight_begin?: string;
  twilight_end?: string;
}

// =============================================================================
// Solunar (computed from USNO moon data)
// =============================================================================

export interface SolunarPeriod {
  /** Period start (local time) */
  start: string;
  /** Period end (local time) */
  end: string;
  /** For major periods: "overhead" | "underfoot" */
  type?: 'overhead' | 'underfoot';
}

export interface SolunarData {
  /** 2-hour windows centered on moon overhead and underfoot */
  major_periods: SolunarPeriod[];
  /** 1-hour windows centered on moonrise and moonset */
  minor_periods: SolunarPeriod[];
}
