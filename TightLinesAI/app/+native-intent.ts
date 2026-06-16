/**
 * Intercept finfindr://creator deep links before Expo Router treats them as
 * unmatched routes (which breaks Back from /subscribe).
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
