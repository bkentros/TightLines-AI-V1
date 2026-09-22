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
