export type AppUpdatePlatform = "ios" | "android";

export type AppReleasePolicy = {
  platform: AppUpdatePlatform;
  enabled: boolean;
  latest_build: number;
  latest_version: string;
  store_url: string;
  title: string;
  message: string;
};

const IOS_APP_ID = "6769178136";
const ANDROID_PACKAGE = "com.finseekr.finfindr";

export const VERIFIED_STORE_URLS: Record<AppUpdatePlatform, string> = {
  ios: `https://apps.apple.com/app/id${IOS_APP_ID}`,
  android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
};

export function isVerifiedStoreUrl(
  platform: AppUpdatePlatform,
  value: unknown,
): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (platform === "ios") {
      return url.hostname === "apps.apple.com" &&
        new RegExp(`/id${IOS_APP_ID}(?:/|$)`).test(url.pathname);
    }
    return url.hostname === "play.google.com" &&
      url.pathname === "/store/apps/details" &&
      url.searchParams.get("id") === ANDROID_PACKAGE;
  } catch {
    return false;
  }
}

function boundedString(value: unknown, max: number, allowEmpty = false): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if ((!allowEmpty && !normalized) || normalized.length > max) return null;
  return normalized;
}

/** Treat remote rows as untrusted input; malformed policy must fail closed. */
export function parseAppReleasePolicy(
  value: unknown,
  expectedPlatform: AppUpdatePlatform,
): AppReleasePolicy | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (row.platform !== expectedPlatform || typeof row.enabled !== "boolean") return null;
  if (!Number.isSafeInteger(row.latest_build) || (row.latest_build as number) < 0) return null;
  const latestVersion = boundedString(row.latest_version, 32, true);
  const title = boundedString(row.title, 80);
  const message = boundedString(row.message, 300);
  if (
    latestVersion == null || title == null || message == null ||
    !isVerifiedStoreUrl(expectedPlatform, row.store_url)
  ) return null;
  return {
    platform: expectedPlatform,
    enabled: row.enabled,
    latest_build: row.latest_build as number,
    latest_version: latestVersion,
    store_url: row.store_url,
    title,
    message,
  };
}

export function parseNativeBuildNumber(value: string | null | undefined): number | null {
  const normalized = value?.trim();
  if (!normalized || !/^\d+$/.test(normalized)) return null;
  const build = Number(normalized);
  return Number.isSafeInteger(build) && build >= 0 ? build : null;
}

export function shouldOfferAppUpdate(input: {
  platform: AppUpdatePlatform;
  installedBuild: number | null;
  policy: AppReleasePolicy | null;
}): input is {
  platform: AppUpdatePlatform;
  installedBuild: number;
  policy: AppReleasePolicy;
} {
  const { platform, installedBuild, policy } = input;
  return Boolean(
    policy?.enabled &&
      policy.platform === platform &&
      Number.isSafeInteger(policy.latest_build) &&
      policy.latest_build > 0 &&
      installedBuild != null &&
      policy.latest_build > installedBuild &&
      isVerifiedStoreUrl(platform, policy.store_url),
  );
}

export function shouldPresentAppUpdate(input: {
  platform: AppUpdatePlatform;
  installedBuild: number | null;
  policy: AppReleasePolicy | null;
  dismissed: boolean;
  alreadyOfferedThisSession: boolean;
}): boolean {
  return !input.dismissed && !input.alreadyOfferedThisSession &&
    shouldOfferAppUpdate(input);
}

export function appUpdateDismissalKey(
  platform: AppUpdatePlatform,
  latestBuild: number,
): string {
  return `app-update-dismissed:${platform}:${latestBuild}`;
}
