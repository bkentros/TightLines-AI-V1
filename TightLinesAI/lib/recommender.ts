/**
 * Recommender client — AsyncStorage + in-memory cache layer.
 *
 * Cache key: `recommender_v1_{lat}_{lon}_{context}_{species}_{clarity}`
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

function cacheKey(
  lat: number,
  lon: number,
  context: EngineContext,
  species: SpeciesGroup,
  clarity: WaterClarity,
): string {
  return `recommender_v1_${lat.toFixed(3)}_${lon.toFixed(3)}_${context}_${species}_${clarity}`;
}

function coordsMatch(a: number, b: number, c: number, d: number): boolean {
  return Math.abs(a - c) < COORD_THRESHOLD && Math.abs(b - d) < COORD_THRESHOLD;
}

// ─── In-memory cache ──────────────────────────────────────────────────────────

interface CacheEntry {
  lat: number;
  lon: number;
  context: EngineContext;
  species: SpeciesGroup;
  clarity: WaterClarity;
  cache_expires_at: string;
  result: RecommenderResponse;
}

const _memCache = new Map<string, CacheEntry>();

// ─── Read cache ───────────────────────────────────────────────────────────────

async function getCachedResult(
  lat: number,
  lon: number,
  context: EngineContext,
  species: SpeciesGroup,
  clarity: WaterClarity,
): Promise<RecommenderResponse | null> {
  const key = cacheKey(lat, lon, context, species, clarity);

  // 1. In-memory first
  const mem = _memCache.get(key);
  if (mem && coordsMatch(mem.lat, mem.lon, lat, lon)) {
    const expires = new Date(mem.cache_expires_at).getTime();
    if (Number.isFinite(expires) && Date.now() < expires) {
      return mem.result;
    }
    _memCache.delete(key);
  }

  // 2. AsyncStorage
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (!coordsMatch(entry.lat, entry.lon, lat, lon)) return null;
    const expires = new Date(entry.cache_expires_at).getTime();
    if (!Number.isFinite(expires) || Date.now() >= expires) return null;
    // Warm in-memory cache
    _memCache.set(key, entry);
    return entry.result;
  } catch {
    return null;
  }
}

// ─── Write cache ──────────────────────────────────────────────────────────────

async function setCachedResult(
  lat: number,
  lon: number,
  context: EngineContext,
  species: SpeciesGroup,
  clarity: WaterClarity,
  result: RecommenderResponse,
): Promise<void> {
  const key = cacheKey(lat, lon, context, species, clarity);
  const entry: CacheEntry = {
    lat,
    lon,
    context,
    species,
    clarity,
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
  const { latitude, longitude, context, species, water_clarity: clarity } = params;

  // Check cache unless force refresh
  if (!opts.forceRefresh) {
    const cached = await getCachedResult(latitude, longitude, context, species, clarity);
    if (cached) return cached;
  }

  // Fetch from edge function
  const token = await getValidAccessToken();
  const result = await invokeEdgeFunction<RecommenderResponse>('recommender', {
    accessToken: token,
    body: params,
  });

  // Cache the result
  await setCachedResult(latitude, longitude, context, species, clarity, result);

  return result;
}

// ─── Cache invalidation ───────────────────────────────────────────────────────

export async function clearRecommenderCache(): Promise<void> {
  _memCache.clear();
  try {
    const keys = await AsyncStorage.getAllKeys();
    const toRemove = keys.filter((k) => k.startsWith('recommender_v1_'));
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
    }
  } catch {
    // non-fatal
  }
}
