/**
 * Environmental API Integration — Public API
 *
 * Single entry point for environmental data. Use getEnvironment for dashboard
 * (respects 15-min cache) and fetchFreshEnvironment when the user confirms an
 * AI action (Recommend, How's Fishing, Water Reader).
 *
 * @see docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

import { invokeEdgeFunction, getValidAccessToken } from '../supabase';
import type { EnvironmentData, GetEnvironmentRequest } from './types';
import { getCachedEnv, getStaleCachedEnv, setCachedEnv } from './cache';
import {
  ENV_FETCH_TIMEOUT_MS,
  MANUAL_REFRESH_LIMIT,
  REFRESH_RATE_LIMIT_WINDOW_MS,
} from './constants';

export type { EnvironmentData, GetEnvironmentRequest } from './types';
export type { CachedEnvPayload } from './cache';
export { getStaleCachedEnv } from './cache';

/** Timestamps of recent manual refreshes (forceRefresh=true) for rate limiting */
const manualRefreshTimestamps: number[] = [];

function checkManualRefreshLimit(): void {
  const now = Date.now();
  const cutoff = now - REFRESH_RATE_LIMIT_WINDOW_MS;
  while (manualRefreshTimestamps.length > 0 && manualRefreshTimestamps[0]! < cutoff) {
    manualRefreshTimestamps.shift();
  }
  if (manualRefreshTimestamps.length >= MANUAL_REFRESH_LIMIT) {
    const nextAt = manualRefreshTimestamps[0]! + REFRESH_RATE_LIMIT_WINDOW_MS;
    const mins = Math.ceil((nextAt - now) / 60000);
    throw new Error(`Please wait ${mins} min before refreshing again.`);
  }
}

function recordManualRefresh(): void {
  manualRefreshTimestamps.push(Date.now());
}

/** Guard: only call when coordinates are valid numbers (audit #13) */
function isValidCoords(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    !isNaN(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    typeof longitude === 'number' &&
    !isNaN(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/** Call the get-environment Edge Function */
async function invokeGetEnvironment(
  latitude: number,
  longitude: number,
  units: 'imperial' | 'metric'
): Promise<EnvironmentData> {
  const accessToken = await getValidAccessToken();

  const data = await invokeEdgeFunction<EnvironmentData>('get-environment', {
    accessToken,
    body: { latitude, longitude, units } satisfies GetEnvironmentRequest,
  });

  const parsed = data as EnvironmentData | null;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid response from environment service');
  }

  if (!parsed.fetched_at) {
    parsed.fetched_at = new Date().toISOString();
  }

  return parsed;
}

const RETRY_DELAY_MS = 2000;

/** Wrap invoke with Promise.race for timeout (prevents endless loading if API hangs) */
async function invokeWithTimeout(
  latitude: number,
  longitude: number,
  units: 'imperial' | 'metric'
): Promise<EnvironmentData> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error('Request timed out. Check your connection and try again.')),
      ENV_FETCH_TIMEOUT_MS
    );
  });

  return Promise.race([
    invokeGetEnvironment(latitude, longitude, units),
    timeoutPromise,
  ]);
}

/** Attempt env fetch with one retry on timeout or network error */
async function invokeWithRetry(
  latitude: number,
  longitude: number,
  units: 'imperial' | 'metric'
): Promise<EnvironmentData> {
  const attempt = async (isRetry: boolean) => {
    if (__DEV__ && isRetry) {
      console.log('[env] Retrying env fetch after timeout/error...');
    }
    return invokeWithTimeout(latitude, longitude, units);
  };

  try {
    return await attempt(false);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = msg.includes('timed out');
    const isNetwork =
      msg.toLowerCase().includes('network') ||
      msg.toLowerCase().includes('connection') ||
      msg.toLowerCase().includes('fetch');
    if (__DEV__) {
      console.log('[env] First attempt failed:', isTimeout ? 'timeout' : msg);
    }
    if (isTimeout || isNetwork) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return attempt(true);
    }
    throw err;
  }
}

export interface GetEnvironmentParams {
  latitude: number;
  longitude: number;
  units?: 'imperial' | 'metric';
  forceRefresh?: boolean;
  /** When true, skips manual-refresh rate limit (for AI actions: Recommend, How's Fishing, etc.) */
  skipRateLimit?: boolean;
}

/**
 * Get environment data for the given coordinates.
 * Uses 15-min cache unless forceRefresh is true.
 * Use forceRefresh when the user confirms an AI action (Recommend, etc.).
 *
 * @throws Error if coordinates are invalid or the Edge Function fails
 */
export async function getEnvironment(params: GetEnvironmentParams): Promise<EnvironmentData> {
  const { latitude, longitude, units = 'imperial', forceRefresh = false, skipRateLimit = false } = params;

  if (!isValidCoords(latitude, longitude)) {
    throw new Error('Invalid coordinates: latitude and longitude must be valid numbers');
  }

  if (!forceRefresh) {
    const cached = await getCachedEnv(latitude, longitude);
    if (cached) {
      return cached;
    }
  } else if (!skipRateLimit) {
    checkManualRefreshLimit();
  }

  const data = await invokeWithRetry(latitude, longitude, units);
  if (forceRefresh && !skipRateLimit) {
    recordManualRefresh();
  }
  await setCachedEnv(latitude, longitude, data);
  return data;
}

/**
 * Fetch fresh environment data, bypassing cache.
 * Use when the user taps "Recommend", "How's Fishing Right Now?", or submits Water Reader.
 * Skips manual-refresh rate limit since these are intentional AI actions.
 */
export async function fetchFreshEnvironment(
  params: Omit<GetEnvironmentParams, 'forceRefresh'>
): Promise<EnvironmentData> {
  return getEnvironment({ ...params, forceRefresh: true, skipRateLimit: true });
}
