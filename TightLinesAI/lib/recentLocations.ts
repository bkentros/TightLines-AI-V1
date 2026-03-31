/**
 * Last few locations the user opened (search picks or GPS). Separate from the active "pinned" slot.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tightlines_recent_locations_v1';
const MAX = 3;

export interface RecentLocation {
  lat: number;
  lon: number;
  label: string;
}

function isPlausibleUsRecentLocation(x: RecentLocation): boolean {
  return Number.isFinite(x.lat) && Number.isFinite(x.lon) && x.lon < 0 && x.lat >= 15 && x.lat <= 72;
}

function nearSame(a: RecentLocation, b: RecentLocation): boolean {
  return (
    Math.abs(a.lat - b.lat) < 0.02 &&
    Math.abs(a.lon - b.lon) < 0.02 &&
    a.label.trim().toLowerCase() === b.label.trim().toLowerCase()
  );
}

export async function getRecentLocations(): Promise<RecentLocation[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is RecentLocation =>
          x != null &&
          typeof (x as RecentLocation).lat === 'number' &&
          typeof (x as RecentLocation).lon === 'number' &&
          typeof (x as RecentLocation).label === 'string' &&
          isPlausibleUsRecentLocation(x as RecentLocation),
      )
      .slice(0, MAX);
  } catch {
    return [];
  }
}

/** Prepend loc, dedupe by ~same coords+label, keep at most MAX. */
export async function recordRecentLocation(loc: RecentLocation): Promise<void> {
  try {
    const prev = await getRecentLocations();
    const rest = prev.filter((p) => !nearSame(p, loc));
    const next = [{ lat: loc.lat, lon: loc.lon, label: loc.label.trim() || 'Location' }, ...rest].slice(0, MAX);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // non-fatal
  }
}
