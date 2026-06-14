/**
 * How's Fishing rebuild contracts and cache helpers.
 *
 * The live app now uses the deterministic rebuild flow only:
 * - today's per-context report cache
 * - forecast-day per-context report cache
 * - current in-memory multi-context bundle
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  EngineContextKey,
  HowFishingRebuildBundle,
  HowFishingRebuildMultiBundle,
} from './howFishingRebuildContracts';

export type {
  EngineContextKey,
  RebuildScoreBand,
  RebuildReliability,
  ActionableTipTag,
  DaypartNotePreset,
  HowsFishingReportV1,
  HowFishingRebuildBundle,
  HowFishingRebuildMultiBundle,
  HowFishingRebuildResponse,
  RegionKey as RebuildRegionKey,
} from './howFishingRebuildContracts';
export { HOWS_FISHING_REBUILD_FEATURE, howFishingMultiContexts } from './howFishingRebuildContracts';

const COORD_MATCH_THRESHOLD = 0.01;
const ANON_CACHE_OWNER = 'anon';

function coordsMatch(a: number, b: number, c: number, d: number): boolean {
  return Math.abs(a - c) < COORD_MATCH_THRESHOLD && Math.abs(b - d) < COORD_MATCH_THRESHOLD;
}

function ownerSegment(ownerKey?: string | null): string {
  const raw = ownerKey && ownerKey.trim().length > 0 ? ownerKey.trim() : ANON_CACHE_OWNER;
  return encodeURIComponent(raw);
}

function rebuildCacheKey(
  lat: number,
  lon: number,
  ctx: EngineContextKey,
  ownerKey?: string | null,
): string {
  return `how_fishing_rebuild_v4_${ownerSegment(ownerKey)}_${lat.toFixed(3)}_${lon.toFixed(3)}_${ctx}`;
}

function forecastCacheKey(
  lat: number,
  lon: number,
  targetDate: string,
  ctx: EngineContextKey,
  ownerKey?: string | null,
): string {
  return `how_fishing_forecast_v4_${ownerSegment(ownerKey)}_${lat.toFixed(3)}_${lon.toFixed(3)}_${targetDate}_${ctx}`;
}

interface ReportCacheReadOptions {
  allowLimited?: boolean;
}

interface RebuildCacheEntry {
  lat: number;
  lon: number;
  cache_expires_at: string;
  timezone: string | null;
  bundle: HowFishingRebuildBundle;
}

interface ForecastCacheEntry {
  lat: number;
  lon: number;
  target_date: string;
  cache_expires_at: string;
  bundle: HowFishingRebuildBundle;
}

async function getCachedHowFishingRebuild(
  latitude: number,
  longitude: number,
  engineContext: EngineContextKey,
  ownerKey?: string | null,
  options: ReportCacheReadOptions = {},
): Promise<HowFishingRebuildBundle | null> {
  try {
    const key = rebuildCacheKey(latitude, longitude, engineContext, ownerKey);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as RebuildCacheEntry;
    if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;
    const expires = new Date(entry.cache_expires_at).getTime();
    if (!Number.isFinite(expires) || Date.now() >= expires) return null;
    if (entry.bundle.access_tier === 'free_limited' && !options.allowLimited) return null;
    return entry.bundle;
  } catch {
    return null;
  }
}

async function setCachedHowFishingRebuild(
  latitude: number,
  longitude: number,
  bundle: HowFishingRebuildBundle,
  ownerKey?: string | null,
): Promise<void> {
  try {
    const key = rebuildCacheKey(latitude, longitude, bundle.engine_context, ownerKey);
    const entry: RebuildCacheEntry = {
      lat: latitude,
      lon: longitude,
      cache_expires_at: bundle.cache_expires_at,
      timezone: bundle.report.location.timezone,
      bundle,
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // non-fatal
  }
}

export async function getCachedForecastRebuild(
  latitude: number,
  longitude: number,
  targetDate: string,
  contexts: EngineContextKey[],
  ownerKey?: string | null,
): Promise<Record<EngineContextKey, HowFishingRebuildBundle> | null> {
  const results: Partial<Record<EngineContextKey, HowFishingRebuildBundle>> = {};
  for (const ctx of contexts) {
    try {
      const key = forecastCacheKey(latitude, longitude, targetDate, ctx, ownerKey);
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      const entry = JSON.parse(raw) as ForecastCacheEntry;
      if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;
      const expires = new Date(entry.cache_expires_at).getTime();
      if (Number.isFinite(expires) && Date.now() >= expires) return null;
      results[ctx] = entry.bundle;
    } catch {
      return null;
    }
  }
  return results as Record<EngineContextKey, HowFishingRebuildBundle>;
}

export async function setCachedForecastRebuild(
  latitude: number,
  longitude: number,
  targetDate: string,
  multi: HowFishingRebuildMultiBundle,
  ownerKey?: string | null,
): Promise<void> {
  for (const ctx of multi.contexts) {
    const bundle = (multi.reports as Partial<Record<EngineContextKey, HowFishingRebuildBundle>>)[ctx];
    if (!bundle) continue;
    const key = forecastCacheKey(latitude, longitude, targetDate, ctx, ownerKey);
    const entry: ForecastCacheEntry = {
      lat: latitude,
      lon: longitude,
      target_date: targetDate,
      cache_expires_at: multi.cache_expires_at,
      bundle,
    };
    try {
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // non-fatal
    }
  }
}

export async function getCachedMultiRebuild(
  latitude: number,
  longitude: number,
  contexts: EngineContextKey[],
  ownerKey?: string | null,
  options: ReportCacheReadOptions = {},
): Promise<Record<EngineContextKey, HowFishingRebuildBundle> | null> {
  const results: Partial<Record<EngineContextKey, HowFishingRebuildBundle>> = {};
  for (const ctx of contexts) {
    const cached = await getCachedHowFishingRebuild(latitude, longitude, ctx, ownerKey, options);
    if (!cached) return null;
    results[ctx] = cached;
  }
  return results as Record<EngineContextKey, HowFishingRebuildBundle>;
}

export async function setCachedMultiRebuild(
  latitude: number,
  longitude: number,
  multi: HowFishingRebuildMultiBundle,
  ownerKey?: string | null,
): Promise<void> {
  for (const ctx of multi.contexts) {
    const bundle = multi.reports[ctx];
    if (bundle) {
      await setCachedHowFishingRebuild(latitude, longitude, bundle, ownerKey);
    }
  }
}

let currentMultiRebuildEntry: {
  ownerKey: string;
  lat: number;
  lon: number;
  cacheExpiresAtMs: number;
  bundles: Record<EngineContextKey, HowFishingRebuildBundle>;
} | null = null;

function multiCacheExpiresAtMs(
  bundles: Record<EngineContextKey, HowFishingRebuildBundle>,
): number {
  const expiries = Object.values(bundles)
    .map((bundle) => new Date(bundle.cache_expires_at).getTime())
    .filter(Number.isFinite);
  return expiries.length > 0 ? Math.min(...expiries) : 0;
}

export function setCurrentMultiRebuild(
  latitude: number,
  longitude: number,
  bundles: Record<EngineContextKey, HowFishingRebuildBundle>,
  ownerKey?: string | null,
): void {
  currentMultiRebuildEntry = {
    ownerKey: ownerSegment(ownerKey),
    lat: latitude,
    lon: longitude,
    cacheExpiresAtMs: multiCacheExpiresAtMs(bundles),
    bundles,
  };
}

export function getCurrentMultiRebuild(
  latitude?: number,
  longitude?: number,
  ownerKey?: string | null,
): Record<EngineContextKey, HowFishingRebuildBundle> | null {
  if (!currentMultiRebuildEntry) return null;
  if (
    !Number.isFinite(currentMultiRebuildEntry.cacheExpiresAtMs) ||
    Date.now() >= currentMultiRebuildEntry.cacheExpiresAtMs
  ) {
    currentMultiRebuildEntry = null;
    return null;
  }
  if (currentMultiRebuildEntry.ownerKey !== ownerSegment(ownerKey)) {
    return null;
  }
  if (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !coordsMatch(currentMultiRebuildEntry.lat, currentMultiRebuildEntry.lon, latitude, longitude)
  ) {
    return null;
  }
  return currentMultiRebuildEntry.bundles;
}

export async function clearHowFishingReportCaches(): Promise<void> {
  currentMultiRebuildEntry = null;
  try {
    const keys = await AsyncStorage.getAllKeys();
    const toRemove = keys.filter(
      (k) =>
        k.startsWith('how_fishing_rebuild_') ||
        k.startsWith('how_fishing_forecast_'),
    );
    if (toRemove.length > 0) {
      await AsyncStorage.multiRemove(toRemove);
    }
  } catch {
    // non-fatal
  }
}
