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
  /** True when in Great Lakes region — show "Coming soon" for tides */
  tides_coming_soon?: boolean;
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
