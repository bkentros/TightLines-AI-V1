import AsyncStorage from '@react-native-async-storage/async-storage';
import { instally } from 'instally-react-native';

const INSTALLY_APP_ID = process.env.EXPO_PUBLIC_INSTALLY_APP_ID?.trim() ?? '';
const INSTALLY_API_KEY = process.env.EXPO_PUBLIC_INSTALLY_API_KEY?.trim() ?? '';

const PENDING_INSTALLY_KEY = 'finfindr_instally_pending_v1';
const CONFIGURED_KEY = 'finfindr_instally_configured_v1';

export type InstallyPendingAttribution = {
  matched: boolean;
  clickId: string | null;
  attributionId: string | null;
  method: string;
  confidence: number;
  trackedAt: number;
};

export function isInstallyConfigured(): boolean {
  return Boolean(INSTALLY_APP_ID && INSTALLY_API_KEY);
}

let configurePromise: Promise<void> | null = null;

export function ensureInstallyConfigured(): Promise<void> {
  if (!isInstallyConfigured()) {
    return Promise.resolve();
  }
  if (!configurePromise) {
    configurePromise = (async () => {
      instally.configure({
        appId: INSTALLY_APP_ID,
        apiKey: INSTALLY_API_KEY,
      });
      await AsyncStorage.setItem(CONFIGURED_KEY, '1');
    })();
  }
  return configurePromise;
}

async function persistPending(result: InstallyPendingAttribution): Promise<void> {
  await AsyncStorage.setItem(PENDING_INSTALLY_KEY, JSON.stringify(result));
}

export async function getPendingInstallyAttribution(): Promise<InstallyPendingAttribution | null> {
  const raw = await AsyncStorage.getItem(PENDING_INSTALLY_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as InstallyPendingAttribution;
    if (!parsed || typeof parsed.matched !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearPendingInstallyAttribution(): Promise<void> {
  await AsyncStorage.removeItem(PENDING_INSTALLY_KEY);
}

/** Idempotent per install — matches this device to an Instally tracking link click. */
export async function trackInstallyInstall(): Promise<InstallyPendingAttribution | null> {
  if (!isInstallyConfigured()) return null;

  await ensureInstallyConfigured();

  try {
    const result = await instally.trackInstall();
    const pending: InstallyPendingAttribution = {
      matched: Boolean(result.matched),
      clickId: result.clickId?.trim() || null,
      attributionId: result.attributionId?.trim() || null,
      method: result.method ?? 'unknown',
      confidence: typeof result.confidence === 'number' ? result.confidence : 0,
      trackedAt: Date.now(),
    };
    await persistPending(pending);
    return pending;
  } catch (err) {
    if (__DEV__) {
      console.warn('[instally] trackInstall failed', err);
    }
    return null;
  }
}

/** Links RevenueCat app user ID for future Instally Growth webhook (optional). */
export async function syncInstallyUserId(userId: string | null | undefined): Promise<void> {
  if (!isInstallyConfigured() || !userId?.trim()) return;
  await ensureInstallyConfigured();
  try {
    await instally.setUserId(userId.trim());
  } catch (err) {
    if (__DEV__) {
      console.warn('[instally] setUserId failed', err);
    }
  }
}

export async function resetInstallyForTesting(): Promise<void> {
  if (!__DEV__ || !isInstallyConfigured()) return;
  await ensureInstallyConfigured();
  try {
    await instally.resetForTesting();
    await clearPendingInstallyAttribution();
  } catch {
    // ignore
  }
}
