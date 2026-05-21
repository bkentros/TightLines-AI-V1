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
  DailyPicksVariant,
  RecommendationGoal,
  RecommenderCallParams,
  RecommenderResponse,
  SpeciesGroup,
  WaterClarity,
} from './recommenderContracts';
import {
  DAILY_PICKS_RESPONSE_FEATURE,
  DAILY_PICKS_RESPONSE_VERSION,
  DAILY_PICKS_SESSION_ENGINE_VERSION,
  isDailyPicksResponse,
} from './recommenderContracts';

const COORD_THRESHOLD = 0.01;
const DEFAULT_RECOMMENDATION_GOAL: RecommendationGoal = 'all_purpose';

type GoalAwareRecommenderCallParams = RecommenderCallParams & {
  recommendation_goal: RecommendationGoal;
};

type CacheOwnerId = string;

function normalizeRecommendationGoal(goal?: RecommendationGoal): RecommendationGoal {
  return goal ?? DEFAULT_RECOMMENDATION_GOAL;
}

function withDefaultRecommendationGoal(
  params: RecommenderCallParams,
): GoalAwareRecommenderCallParams {
  return {
    ...params,
    recommendation_goal: normalizeRecommendationGoal(params.recommendation_goal),
  };
}

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
    'latitude' | 'longitude' | 'state_code' | 'context' | 'species' | 'water_clarity' | 'recommendation_goal' | 'env_data' | 'target_date'
  >,
  variant: DailyPicksVariant,
  ownerId: CacheOwnerId,
): string {
  const dayKey = extractRequestDay(params);
  return [
    // Prefix must change when the edge response contract or selection rules change.
    DAILY_PICKS_SESSION_ENGINE_VERSION,
    `user_${ownerId}`,
    params.latitude.toFixed(3),
    params.longitude.toFixed(3),
    params.state_code.toUpperCase(),
    params.context,
    params.species,
    params.water_clarity,
    normalizeRecommendationGoal(params.recommendation_goal),
    dayKey,
    `set_${variant}`,
  ].join('_');
}

function coordsMatch(a: number, b: number, c: number, d: number): boolean {
  return Math.abs(a - c) < COORD_THRESHOLD && Math.abs(b - d) < COORD_THRESHOLD;
}

function currentCacheOwnerId(): CacheOwnerId | null {
  try {
    const { useAuthStore } = require('../store/authStore');
    const userId = useAuthStore.getState().user?.id;
    return typeof userId === 'string' && userId.length > 0 ? userId : null;
  } catch {
    return null;
  }
}

// ─── In-memory cache ──────────────────────────────────────────────────────────

interface CacheEntry {
  user_id: CacheOwnerId;
  lat: number;
  lon: number;
  state_code: string;
  context: EngineContext;
  species: SpeciesGroup;
  clarity: WaterClarity;
  recommendation_goal: RecommendationGoal;
  variant: DailyPicksVariant;
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
  if (!isDailyPicksResponse(result)) return false;
  if (result.feature !== DAILY_PICKS_RESPONSE_FEATURE) return false;
  if (result.engine_version !== DAILY_PICKS_RESPONSE_VERSION) return false;
  if (
    result.recommendation_goal !== 'all_purpose' &&
    result.recommendation_goal !== 'big_fish'
  ) return false;
  const picks = result.picks;
  const ordered = [
    picks.lure_of_the_day,
    picks.honorable_lure,
    picks.fly_of_the_day,
    picks.honorable_fly,
  ];
  for (const rec of ordered) {
    if (
      !rec ||
      typeof rec.id !== 'string' ||
      typeof rec.why_chosen !== 'string' ||
      typeof rec.how_to_fish !== 'string'
    ) {
      return false;
    }
  }
  if (typeof result.scenario_summary?.activity_level !== 'string') return false;
  if (typeof result.scenario_summary?.surface_daily_gate !== 'string') return false;
  if (typeof result.scenario_summary?.confidence !== 'string') return false;
  if (typeof result.scenario_summary?.color_palette_theme !== "string") {
    return false;
  }
  const palette = result.scenario_summary.color_palette_theme;
  if (palette !== "natural" && palette !== "bright" && palette !== "dark") {
    return false;
  }
  const session = result.recommendation_session;
  if (!session) return false;
  if (session.variant !== 'A' && session.variant !== 'B') return false;
  if (
    !Array.isArray(session.available_variants) ||
    session.available_variants.some((variant) => variant !== 'A' && variant !== 'B')
  ) {
    return false;
  }
  if (typeof session.local_date !== 'string') return false;
  if (typeof session.locked_until !== 'string') return false;
  if (typeof session.can_refresh !== 'boolean') return false;
  if (session.refreshes_remaining !== 0 && session.refreshes_remaining !== 1) {
    return false;
  }
  if (session.locked_until !== result.cache_expires_at) return false;
  return true;
}

// ─── Read cache ───────────────────────────────────────────────────────────────

async function getCachedResult(
  params: GoalAwareRecommenderCallParams,
  variant: DailyPicksVariant,
  ownerId: CacheOwnerId,
): Promise<RecommenderResponse | null> {
  const { latitude, longitude } = params;
  const goal = normalizeRecommendationGoal(params.recommendation_goal);
  const key = cacheKey(params, variant, ownerId);

  // 1. In-memory first
  const mem = _memCache.get(key);
  if (mem && coordsMatch(mem.lat, mem.lon, latitude, longitude)) {
    const expires = new Date(mem.cache_expires_at).getTime();
    if (Number.isFinite(expires) && Date.now() < expires) {
      if (!isCachedResultValid(mem.result)) {
        _memCache.delete(key);
        return null;
      }
      if (
        mem.user_id !== ownerId ||
        mem.recommendation_goal !== goal ||
        mem.result.recommendation_goal !== goal ||
        mem.variant !== variant ||
        mem.result.recommendation_session.variant !== variant
      ) {
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
    if (
      entry.user_id !== ownerId ||
      entry.recommendation_goal !== goal ||
      entry.result.recommendation_goal !== goal ||
      entry.variant !== variant ||
      entry.result.recommendation_session.variant !== variant
    ) return null;
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
  params: GoalAwareRecommenderCallParams,
  result: RecommenderResponse,
  ownerId: CacheOwnerId,
): Promise<void> {
  if (!isCachedResultValid(result)) return;
  const goal = normalizeRecommendationGoal(params.recommendation_goal);
  if (result.recommendation_goal !== goal) return;
  const variant = result.recommendation_session.variant;
  const dayKey = extractRequestDay(params);
  const key = cacheKey(params, variant, ownerId);
  const entry: CacheEntry = {
    user_id: ownerId,
    lat: params.latitude,
    lon: params.longitude,
    state_code: params.state_code.toUpperCase(),
    context: params.context,
    species: params.species,
    clarity: params.water_clarity,
    recommendation_goal: goal,
    variant,
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
  opts: { forceRefresh?: boolean; viewVariant?: DailyPicksVariant } = {},
): Promise<RecommenderResponse> {
  const requestParams = withDefaultRecommendationGoal(params);
  const ownerId = currentCacheOwnerId();

  // Check cache unless this request is meant to generate Set B or read a
  // specific stored variant. Variant views go to the server so Set A metadata
  // cannot stay stale after Set B exists.
  if (ownerId && !opts.forceRefresh && !opts.viewVariant) {
    const cachedB = await getCachedResult(requestParams, 'B', ownerId);
    if (cachedB) return cachedB;
    const cachedA = await getCachedResult(requestParams, 'A', ownerId);
    if (cachedA) return cachedA;
  }

  // Fetch from edge function
  const token = await getValidAccessToken();
  const result = await invokeEdgeFunction<RecommenderResponse>('recommender', {
    accessToken: token,
    headers: {
      // Redundant after backend default cutover, but harmless for app builds
      // that still talk to a preview-gated edge function.
      'x-recommender-preview': 'daily_picks_2x2',
    },
    body: opts.forceRefresh
      ? { ...requestParams, refresh_requested: true }
      : opts.viewVariant
        ? { ...requestParams, view_variant: opts.viewVariant }
        : requestParams,
  });

  if (!isCachedResultValid(result) || result.recommendation_goal !== requestParams.recommendation_goal) {
    throw new Error('Unexpected recommender response shape. Please update and try again.');
  }

  // Cache only the daily-picks 2x2 result shape.
  const cacheOwner = ownerId ?? currentCacheOwnerId();
  if (cacheOwner) {
    await setCachedResult(requestParams, result, cacheOwner);
  }

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
