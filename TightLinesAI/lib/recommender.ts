/**
 * Recommender client — AsyncStorage + in-memory cache layer.
 *
 * Cache key is calendar-day based so a given lure/fly report stays stable for
 * the rest of the local day.
 * TTL: respects cache_expires_at from server response (location midnight).
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
import { RECOMMENDER_FEATURE } from './recommenderContracts';

const COORD_THRESHOLD = 0.01;

function normalizeTimezone(raw: unknown): string {
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : 'America/New_York';
}

function isIsoDate(raw: unknown): raw is string {
  return typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw);
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

function extractRequestDay(params: Pick<RecommenderCallParams, 'target_date' | 'env_data'>): string {
  if (isIsoDate(params.target_date)) {
    return params.target_date;
  }
  return localDayKey(normalizeTimezone(params.env_data.timezone), new Date());
}

function cacheKey(
  params: Pick<
    RecommenderCallParams,
    'latitude' | 'longitude' | 'state_code' | 'context' | 'species' | 'water_clarity' | 'env_data' | 'target_date'
  >,
): string {
  const dayKey = extractRequestDay(params);
  return [
    // Prefix must change when the edge response contract or selection rules change.
    'recommender_rebuild_tacv2_copyv1',
    params.latitude.toFixed(3),
    params.longitude.toFixed(3),
    params.state_code.toUpperCase(),
    params.context,
    params.species,
    params.water_clarity,
    dayKey,
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
  cache_expires_at: string;
  result: RecommenderResponse;
}

const _memCache = new Map<string, CacheEntry>();

// ─── Shape validation ─────────────────────────────────────────────────────────

/**
 * Guards against stale cached results from older API shapes.
 */
function isCachedResultValid(result: RecommenderResponse): boolean {
  if (result.feature !== RECOMMENDER_FEATURE) return false;
  const lures = result.lure_recommendations;
  const flies = result.fly_recommendations;
  if (!Array.isArray(lures) || !Array.isArray(flies)) return false;
  if (lures.length > 3 || flies.length > 3) return false;
  if (lures.length + flies.length < 1) return false;
  for (const rec of [...lures, ...flies]) {
    if (!rec || typeof rec.id !== 'string' || typeof rec.why_chosen !== 'string') {
      return false;
    }
  }
  if (typeof result.summary?.daily_tactical_preference?.posture_band !== 'string') {
    return false;
  }
  if (typeof result.summary?.daily_tactical_preference?.preferred_column !== 'string') {
    return false;
  }
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
  if (!isCachedResultValid(result)) return;
  const dayKey = extractRequestDay(params);
  const key = cacheKey(params);
  const entry: CacheEntry = {
    lat: params.latitude,
    lon: params.longitude,
    state_code: params.state_code.toUpperCase(),
    context: params.context,
    species: params.species,
    clarity: params.water_clarity,
    day_key: dayKey,
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

/** AsyncStorage keys owned by this module (`cacheKey` + legacy `recommender_v*` prefixes). */
const RECOMMENDER_ASYNC_STORAGE_KEY = /^recommender_/;

/** Clears in-memory cache and all AsyncStorage keys under the recommender namespace. */
export async function clearRecommenderCache(): Promise<void> {
  _memCache.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const toRemove = keys.filter((k) => RECOMMENDER_ASYNC_STORAGE_KEY.test(k));
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
    }
  } catch {
    // non-fatal
  }
}
