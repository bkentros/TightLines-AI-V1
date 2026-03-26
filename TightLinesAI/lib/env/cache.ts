/**
 * Environmental API Integration — Client-Side Cache
 *
 * 15-minute TTL cache for dashboard. Single AsyncStorage key with coords in value
 * (avoids key length limits per audit #10). Buckets coords to 4 decimals for
 * cache hits on "same" location (audit #18).
 *
 * @see docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EnvironmentData } from './types';
import { CACHE_TTL_MS, ENV_CACHE_KEY, CACHE_COORD_PRECISION } from './constants';

/** Clear the single global env payload (live conditions / get-environment cache). */
export async function clearEnvCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ENV_CACHE_KEY);
  } catch {
    // non-fatal
  }
}

export interface CachedEnvPayload {
  latitude: number;
  longitude: number;
  data: EnvironmentData;
  fetched_at: string;
}

function roundCoord(coord: number): number {
  const factor = 10 ** CACHE_COORD_PRECISION;
  return Math.round(coord * factor) / factor;
}

/** Check if cached data is for the same location (within bucket) and still fresh */
export function isCacheValid(
  cached: CachedEnvPayload,
  latitude: number,
  longitude: number
): boolean {
  const latMatch = roundCoord(cached.latitude) === roundCoord(latitude);
  const lonMatch = roundCoord(cached.longitude) === roundCoord(longitude);
  if (!latMatch || !lonMatch) return false;

  const fetchedAt = new Date(cached.fetched_at).getTime();
  const now = Date.now();
  return now - fetchedAt < CACHE_TTL_MS;
}

/** Get cached env data if valid for this location (within TTL) */
export async function getCachedEnv(
  latitude: number,
  longitude: number
): Promise<EnvironmentData | null> {
  try {
    const cached = await getCachedPayload(latitude, longitude);
    if (!cached?.data?.fetched_at) return null;
    if (isCacheValid(cached, latitude, longitude)) return cached.data;
  } catch {
    // Parse error or storage error — treat as cache miss
  }
  return null;
}

/**
 * Get cached env data for this location even if expired (stale).
 * Use for stale-while-revalidate: show last-known data immediately when
 * returning to the app, then refresh in background.
 */
export async function getStaleCachedEnv(
  latitude: number,
  longitude: number
): Promise<EnvironmentData | null> {
  try {
    const cached = await getCachedPayload(latitude, longitude);
    return cached?.data?.fetched_at ? cached.data : null;
  } catch {
    return null;
  }
}

/** Get cache payload for this location if present (ignores TTL). */
async function getCachedPayload(
  latitude: number,
  longitude: number
): Promise<CachedEnvPayload | null> {
  const raw = await AsyncStorage.getItem(ENV_CACHE_KEY);
  if (!raw) return null;
  const cached: CachedEnvPayload = JSON.parse(raw);
  if (!cached?.data?.fetched_at) return null;
  const latMatch = roundCoord(cached.latitude) === roundCoord(latitude);
  const lonMatch = roundCoord(cached.longitude) === roundCoord(longitude);
  if (!latMatch || !lonMatch) return null;
  return cached;
}

/** Store env data in cache */
export async function setCachedEnv(
  latitude: number,
  longitude: number,
  data: EnvironmentData
): Promise<void> {
  try {
    const payload: CachedEnvPayload = {
      latitude: roundCoord(latitude),
      longitude: roundCoord(longitude),
      data,
      fetched_at: data.fetched_at,
    };
    await AsyncStorage.setItem(ENV_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or quota — non-fatal; next fetch will retry
  }
}
