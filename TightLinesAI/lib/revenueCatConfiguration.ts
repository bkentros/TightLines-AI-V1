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
