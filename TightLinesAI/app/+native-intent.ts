/**
 * Intercept finfindr://creator deep links before Expo Router treats them as
 * unmatched routes. Opens subscribe when the app launches from a creator link;
 * _layout also handles the URL for session activation and auth gating.
 */
export function redirectSystemPath({
  path,
}: {
  path: string;
  initial: boolean;
}): string {
  try {
    const lower = path.toLowerCase();
    if (lower.includes('creator') && lower.includes('code=')) {
      return '/subscribe?creator=1';
    }
  } catch {
    // Fall through to default handling.
  }
  return path;
}
