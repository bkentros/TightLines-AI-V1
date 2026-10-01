export const REVENUECAT_CONFIGURATION_RETRY_DELAYS_MS = [
  25,
  50,
  100,
  200,
  400,
  800,
  1_000,
] as const;

type Pause = (milliseconds: number) => Promise<void>;

export type RevenueCatNativeState = {
  configured: boolean;
  appUserId: string | null;
};

const pause: Pause = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * `Purchases.configure()` returns before the native SDK promises that its
 * singleton is ready. Wait for that explicit readiness signal before any
 * customer-info, offerings, or paywall call is allowed through.
 */
export async function waitForRevenueCatConfiguration(
  isConfigured: () => Promise<boolean>,
  sleep: Pause = pause,
  retryDelays: readonly number[] = REVENUECAT_CONFIGURATION_RETRY_DELAYS_MS,
): Promise<boolean> {
  for (let attempt = 0; attempt <= retryDelays.length; attempt += 1) {
    try {
      if (await isConfigured()) return true;
    } catch {
      // A bridge call can fail transiently while the native module starts.
    }

    if (attempt < retryDelays.length) {
      await sleep(retryDelays[attempt]);
    }
  }

  return false;
}

/**
 * Determine whether the native singleton already exists without relying on a
 * single bridge method. Development/Fast Refresh can temporarily pair newer
 * JavaScript with an older installed native SDK; in that state `isConfigured`
 * may throw even though `getAppUserID` can prove the singleton is alive.
 * Treating that throw as "not configured" would call `configure` twice and
 * raise an iOS HostFunction exception.
 */
export async function detectRevenueCatNativeState(
  isConfigured: () => Promise<boolean>,
  getAppUserId: () => Promise<string>,
): Promise<RevenueCatNativeState> {
  let configured: boolean | null = null;
  try {
    configured = await isConfigured();
  } catch {
    // Fall through to the stable identity probe below.
  }

  if (configured === false || configured === null) {
    try {
      return {
        configured: true,
        appUserId: await getAppUserId(),
      };
    } catch {
      return { configured: false, appUserId: null };
    }
  }

  try {
    return {
      configured: true,
      appUserId: await getAppUserId(),
    };
  } catch {
    return { configured: true, appUserId: null };
  }
}

/**
 * The native RevenueCat singleton survives a JavaScript/Fast Refresh reload,
 * while module-scoped JavaScript state does not. Trust the SDK's native App
 * User ID before deciding to call `logIn`; repeating `logIn` for the same user
 * is unnecessary and has triggered iOS TurboModule failures in some SDK/RN
 * combinations.
 */
export function revenueCatUserNeedsLogin(
  nativeUserId: string,
  requestedUserId: string,
): boolean {
  return nativeUserId !== requestedUserId;
}
