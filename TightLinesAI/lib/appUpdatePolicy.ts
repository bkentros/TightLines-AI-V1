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
      /^https:\/\//i.test(policy.store_url),
  );
}

export function appUpdateDismissalKey(
  platform: AppUpdatePlatform,
  latestBuild: number,
): string {
  return `app-update-dismissed:${platform}:${latestBuild}`;
}
