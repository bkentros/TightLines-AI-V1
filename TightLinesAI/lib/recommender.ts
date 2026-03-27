import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EngineContextKey } from './howFishingRebuildContracts';
import type { RecommenderResponse } from './recommenderContracts';

const COORD_MATCH_THRESHOLD = 0.01;
const STORAGE_KEY = 'recommender_cache_v3';

type CachedRecommendation = {
  latitude: number;
  longitude: number;
  context: EngineContextKey;
  bundle: RecommenderResponse;
};

let currentRecommendation:
  | {
      latitude: number;
      longitude: number;
      context: EngineContextKey;
      bundle: RecommenderResponse;
    }
  | null = null;

function coordsMatch(a: number, b: number): boolean {
  return Math.abs(a - b) <= COORD_MATCH_THRESHOLD;
}

function notExpired(bundle: RecommenderResponse): boolean {
  return new Date(bundle.cache_expires_at).getTime() > Date.now();
}

export function getCurrentRecommendation(
  latitude: number,
  longitude: number,
  context: EngineContextKey,
): RecommenderResponse | null {
  if (!currentRecommendation) return null;
  if (currentRecommendation.context !== context) return null;
  if (!coordsMatch(currentRecommendation.latitude, latitude)) return null;
  if (!coordsMatch(currentRecommendation.longitude, longitude)) return null;
  return notExpired(currentRecommendation.bundle) ? currentRecommendation.bundle : null;
}

export function setCurrentRecommendation(
  latitude: number,
  longitude: number,
  context: EngineContextKey,
  bundle: RecommenderResponse,
): void {
  currentRecommendation = { latitude, longitude, context, bundle };
}

export async function getCachedRecommendation(
  latitude: number,
  longitude: number,
  context: EngineContextKey,
): Promise<RecommenderResponse | null> {
  const inMemory = getCurrentRecommendation(latitude, longitude, context);
  if (inMemory) return inMemory;

  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as CachedRecommendation[];
    const hit = parsed.find((entry) =>
      entry.context === context &&
      coordsMatch(entry.latitude, latitude) &&
      coordsMatch(entry.longitude, longitude) &&
      notExpired(entry.bundle)
    );
    if (!hit) return null;
    setCurrentRecommendation(latitude, longitude, context, hit.bundle);
    return hit.bundle;
  } catch {
    return null;
  }
}

export async function setCachedRecommendation(
  latitude: number,
  longitude: number,
  context: EngineContextKey,
  bundle: RecommenderResponse,
): Promise<void> {
  setCurrentRecommendation(latitude, longitude, context, bundle);
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  let existing: CachedRecommendation[] = [];
  try {
    existing = raw ? (JSON.parse(raw) as CachedRecommendation[]) : [];
  } catch {
    existing = [];
  }

  const next = existing.filter((entry) =>
    !(
      entry.context === context &&
      coordsMatch(entry.latitude, latitude) &&
      coordsMatch(entry.longitude, longitude)
    ) && notExpired(entry.bundle)
  );

  next.push({ latitude, longitude, context, bundle });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
