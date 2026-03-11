/**
 * Environmental API Integration — Constants
 *
 * Centralized config for cache TTL, API behavior, and thresholds.
 * Change these values here rather than scattering magic numbers.
 *
 * @see docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

/** Cache TTL for dashboard — refresh at most every 15 minutes */
export const CACHE_TTL_MS = 15 * 60 * 1000;

/** Max time to wait for env API before failing (prevents endless loading) */
export const ENV_FETCH_TIMEOUT_MS = 30 * 1000;

/** Max manual refreshes (forceRefresh) allowed per REFRESH_RATE_LIMIT_WINDOW_MS */
export const MANUAL_REFRESH_LIMIT = 2;

/** Time window for manual refresh rate limit */
export const REFRESH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** AsyncStorage key prefix for env cache (single key; coords stored in value per audit #10) */
export const ENV_CACHE_KEY = 'env_cache';

/** Coordinate precision for cache key bucketing (4 decimals ≈ 10m; avoids float noise per audit #18) */
export const CACHE_COORD_PRECISION = 4;

/**
 * Max distance (miles) from user to nearest NOAA tide station.
 * Beyond this, treat as inland — no tide data.
 * ~50 miles per spec/plan.
 */
export const TIDE_STATION_MAX_DISTANCE_MILES = 50;

/**
 * Great Lakes bounding box for "Coming soon" detection.
 * [south, west, north, east] — lat/lon decimal degrees.
 * Covers: Superior, Michigan, Huron, Erie, Ontario and immediate coasts.
 */
export const GREAT_LAKES_BBOX: [number, number, number, number] = [
  41.3,  // south
  -93,   // west
  49,    // north
  -76,   // east
];

/** Major solunar period duration (minutes) — 2 hours centered on overhead/underfoot */
export const SOLUNAR_MAJOR_MINUTES = 60;

/** Minor solunar period duration (minutes) — 1 hour centered on rise/set */
export const SOLUNAR_MINOR_MINUTES = 30;
