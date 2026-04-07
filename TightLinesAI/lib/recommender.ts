/**
 * Recommender client — AsyncStorage + in-memory cache layer.
 *
 * Cache key includes the request day and a compact environment fingerprint so
 * recommendations turn over when today's weather payload changes materially.
 * TTL: respects cache_expires_at from server response (6-hour rolling).
 *
 * Mirrors the howFishing.ts cache pattern exactly.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { invokeEdgeFunction, getValidAccessToken } from './supabase';
import type {
  EngineContext,
  RecommenderCallParams,
  RecommenderResponse,
  SpeciesGroup,
  WaterClarity,
} from './recommenderContracts';

const COORD_THRESHOLD = 0.01;

function normalizeTimezone(raw: unknown): string {
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : 'America/New_York';
}

function localDayKey(timezone: string, reference: Date): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(reference);
  } catch {
    return reference.toISOString().slice(0, 10);
  }
}

function stableHash(input: string): string {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function extractEnvFingerprint(envData: Record<string, unknown>): { dayKey: string; envHash: string } {
  const fetchedAtRaw = typeof envData.fetched_at === 'string' ? envData.fetched_at : null;
  const timezone = normalizeTimezone(envData.timezone);
  const fetchedAt = fetchedAtRaw ? new Date(fetchedAtRaw) : new Date();
  const referenceDate = Number.isFinite(fetchedAt.getTime()) ? fetchedAt : new Date();
  const weather =
    envData.weather && typeof envData.weather === 'object'
      ? (envData.weather as Record<string, unknown>)
      : null;

  const payload = JSON.stringify({
    fetched_at: fetchedAtRaw,
    timezone,
    weather: weather
      ? {
          temperature: weather.temperature ?? null,
          pressure: weather.pressure ?? null,
          wind_speed: weather.wind_speed ?? null,
          cloud_cover: weather.cloud_cover ?? null,
          precipitation: weather.precipitation ?? null,
        }
      : null,
  });

  return {
    dayKey: localDayKey(timezone, referenceDate),
    envHash: stableHash(payload),
  };
}

function cacheKey(
  params: Pick<
    RecommenderCallParams,
    'latitude' | 'longitude' | 'state_code' | 'context' | 'species' | 'water_clarity' | 'env_data'
  >,
): string {
  const { dayKey, envHash } = extractEnvFingerprint(params.env_data);
  return [
    'recommender_v4',
    params.latitude.toFixed(3),
    params.longitude.toFixed(3),
    params.state_code.toUpperCase(),
    params.context,
    params.species,
    params.water_clarity,
    dayKey,
    envHash,
  ].join('_');
}

function coordsMatch(a: number, b: number, c: number, d: number): boolean {
  return Math.abs(a - c) < COORD_THRESHOLD && Math.abs(b - d) < COORD_THRESHOLD;
}

// ─── In-memory cache ──────────────────────────────────────────────────────────

interface CacheEntry {
  lat: number;
  lon: number;
  state_code: string;
  context: EngineContext;
  species: SpeciesGroup;
  clarity: WaterClarity;
  day_key: string;
  env_hash: string;
  cache_expires_at: string;
  result: RecommenderResponse;
}

const _memCache = new Map<string, CacheEntry>();

// ─── Shape validation ─────────────────────────────────────────────────────────

/**
 * Guards against stale cached results from older API shapes.
 * - behavior_summary must be [{label,detail}] objects (not plain strings)
 * - color_of_day must be present as a top-level string (added in current shape)
 */
function isCachedResultValid(result: RecommenderResponse): boolean {
  const summary = result.behavior?.behavior_summary;
  if (!Array.isArray(summary) || summary.length === 0) return false;
  if (typeof (summary[0] as Record<string, unknown>)?.label !== 'string') return false;
  if (typeof result.color_of_day !== 'string') return false;
  return true;
}

// ─── Read cache ───────────────────────────────────────────────────────────────

async function getCachedResult(
  params: RecommenderCallParams,
): Promise<RecommenderResponse | null> {
  const { latitude, longitude } = params;
  const key = cacheKey(params);

  // 1. In-memory first
  const mem = _memCache.get(key);
  if (mem && coordsMatch(mem.lat, mem.lon, latitude, longitude)) {
    const expires = new Date(mem.cache_expires_at).getTime();
    if (Number.isFinite(expires) && Date.now() < expires) {
      if (!isCachedResultValid(mem.result)) {
        _memCache.delete(key);
        return null;
      }
      return mem.result;
    }
    _memCache.delete(key);
  }

  // 2. AsyncStorage
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;
    const expires = new Date(entry.cache_expires_at).getTime();
    if (!Number.isFinite(expires) || Date.now() >= expires) return null;
    // Discard if shape is stale (old string-array format)
    if (!isCachedResultValid(entry.result)) {
      await AsyncStorage.removeItem(key).catch(() => {});
      return null;
    }
    // Warm in-memory cache
    _memCache.set(key, entry);
    return entry.result;
  } catch {
    return null;
  }
}

// ─── Write cache ──────────────────────────────────────────────────────────────

async function setCachedResult(
  params: RecommenderCallParams,
  result: RecommenderResponse,
): Promise<void> {
  const { dayKey, envHash } = extractEnvFingerprint(params.env_data);
  const key = cacheKey(params);
  const entry: CacheEntry = {
    lat: params.latitude,
    lon: params.longitude,
    state_code: params.state_code.toUpperCase(),
    context: params.context,
    species: params.species,
    clarity: params.water_clarity,
    day_key: dayKey,
    env_hash: envHash,
    cache_expires_at: result.cache_expires_at,
    result,
  };
  _memCache.set(key, entry);
  try {
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // non-fatal
  }
}

// ─── Main fetch function ──────────────────────────────────────────────────────

export async function fetchRecommendation(
  params: RecommenderCallParams,
  opts: { forceRefresh?: boolean } = {},
): Promise<RecommenderResponse> {
  // Check cache unless force refresh
  if (!opts.forceRefresh) {
    const cached = await getCachedResult(params);
    if (cached) return cached;
  }

  // Fetch from edge function
  const token = await getValidAccessToken();
  const result = await invokeEdgeFunction<RecommenderResponse>('recommender', {
    accessToken: token,
    body: params,
  });

  // Cache the result
  await setCachedResult(params, result);

  return result;
}

// ─── Cache invalidation ───────────────────────────────────────────────────────

export async function clearRecommenderCache(): Promise<void> {
  _memCache.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const toRemove = keys.filter(
      (k) =>
        k.startsWith('recommender_v1_') ||
        k.startsWith('recommender_v3_') ||
        k.startsWith('recommender_v4_'),
    );
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
    }
  } catch {
    // non-fatal
  }
}
