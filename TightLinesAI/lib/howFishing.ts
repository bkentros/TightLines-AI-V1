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

function coordsMatch(a: number, b: number, c: number, d: number): boolean {
  return Math.abs(a - c) < COORD_MATCH_THRESHOLD && Math.abs(b - d) < COORD_MATCH_THRESHOLD;
}

function rebuildCacheKey(lat: number, lon: number, ctx: EngineContextKey): string {
  return `how_fishing_rebuild_${lat.toFixed(3)}_${lon.toFixed(3)}_${ctx}`;
}

function forecastCacheKey(
  lat: number,
  lon: number,
  targetDate: string,
  ctx: EngineContextKey,
): string {
  return `how_fishing_forecast_${lat.toFixed(3)}_${lon.toFixed(3)}_${targetDate}_${ctx}`;
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
): Promise<HowFishingRebuildBundle | null> {
  try {
    const key = rebuildCacheKey(latitude, longitude, engineContext);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as RebuildCacheEntry;
    if (!coordsMatch(entry.lat, entry.lon, latitude, longitude)) return null;
    const expires = new Date(entry.cache_expires_at).getTime();
    if (Number.isFinite(expires) && Date.now() >= expires) return null;
    return entry.bundle;
  } catch {
    return null;
  }
}

async function setCachedHowFishingRebuild(
  latitude: number,
  longitude: number,
  bundle: HowFishingRebuildBundle,
): Promise<void> {
  try {
    const key = rebuildCacheKey(latitude, longitude, bundle.engine_context);
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
): Promise<Record<EngineContextKey, HowFishingRebuildBundle> | null> {
  const results: Partial<Record<EngineContextKey, HowFishingRebuildBundle>> = {};
  for (const ctx of contexts) {
    try {
      const key = forecastCacheKey(latitude, longitude, targetDate, ctx);
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
): Promise<void> {
  for (const ctx of multi.contexts) {
    const bundle = (multi.reports as Partial<Record<EngineContextKey, HowFishingRebuildBundle>>)[ctx];
    if (!bundle) continue;
    const key = forecastCacheKey(latitude, longitude, targetDate, ctx);
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
): Promise<Record<EngineContextKey, HowFishingRebuildBundle> | null> {
  const results: Partial<Record<EngineContextKey, HowFishingRebuildBundle>> = {};
  for (const ctx of contexts) {
    const cached = await getCachedHowFishingRebuild(latitude, longitude, ctx);
    if (!cached) return null;
    results[ctx] = cached;
  }
  return results as Record<EngineContextKey, HowFishingRebuildBundle>;
}

export async function setCachedMultiRebuild(
  latitude: number,
  longitude: number,
  multi: HowFishingRebuildMultiBundle,
): Promise<void> {
  for (const ctx of multi.contexts) {
    const bundle = multi.reports[ctx];
    if (bundle) {
      await setCachedHowFishingRebuild(latitude, longitude, bundle);
    }
  }
}

let currentMultiRebuildEntry: {
  lat: number;
  lon: number;
  bundles: Record<EngineContextKey, HowFishingRebuildBundle>;
} | null = null;

export function setCurrentMultiRebuild(
  latitude: number,
  longitude: number,
  bundles: Record<EngineContextKey, HowFishingRebuildBundle>,
): void {
  currentMultiRebuildEntry = { lat: latitude, lon: longitude, bundles };
}

export function getCurrentMultiRebuild(
  latitude?: number,
  longitude?: number,
): Record<EngineContextKey, HowFishingRebuildBundle> | null {
  if (!currentMultiRebuildEntry) return null;
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
