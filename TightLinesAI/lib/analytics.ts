import { PostHog } from 'posthog-react-native';
import type { UserProfile } from './types';

const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com';

export const posthogApiKey =
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim() ?? '';
export const posthogHost =
  process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || DEFAULT_POSTHOG_HOST;

export const analyticsEnabled = posthogApiKey.length > 0;

export const posthogClient = analyticsEnabled
  ? new PostHog(posthogApiKey, {
      host: posthogHost,
      captureAppLifecycleEvents: true,
      enableSessionReplay: false,
      personProfiles: 'identified_only',
      flushAt: __DEV__ ? 1 : 20,
      flushInterval: __DEV__ ? 2000 : 10000,
    })
  : null;

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProperties = Record<string, AnalyticsValue>;
type AnalyticsPostHogProperties = Record<string, string | number | boolean | null>;

function compactProperties(
  properties?: AnalyticsProperties,
): AnalyticsPostHogProperties | undefined {
  if (!properties) return undefined;
  const compacted: AnalyticsPostHogProperties = {};
  Object.entries(properties).forEach(([key, value]) => {
    if (value !== undefined) compacted[key] = value;
  });
  return compacted;
}

export function captureAnalytics(
  eventName: string,
  properties?: AnalyticsProperties,
): void {
  posthogClient?.capture(eventName, compactProperties(properties));
}

export function screenAnalytics(
  screenName: string,
  properties?: AnalyticsProperties,
): void {
  void posthogClient?.screen(screenName, compactProperties(properties));
}

export function resetAnalyticsUser(): void {
  posthogClient?.reset();
}

export function identifyAnalyticsUser(args: {
  userId: string;
  email?: string | null;
  profile?: UserProfile | null;
}): void {
  const emailDomain = args.email?.split('@')[1]?.toLowerCase() ?? null;
  const profile = args.profile;

  posthogClient?.identify(args.userId, {
    email_domain: emailDomain,
    home_state: profile?.home_state ?? null,
    fishing_mode: profile?.fishing_mode ?? null,
    preferred_units: profile?.preferred_units ?? null,
    subscription_tier: profile?.subscription_tier ?? 'free',
    onboarding_complete: profile?.onboarding_complete ?? false,
    target_species_count: profile?.target_species?.length ?? 0,
  });
}

export function routeScreenName(pathname: string): string {
  const normalized = pathname.replace(/\?.*$/, '').replace(/^\/+|\/+$/g, '');
  if (!normalized) return 'home';
  return normalized
    .replace(/\([^)]*\)\//g, '')
    .replace(/[^\w/.-]+/g, '_')
    .replace(/\//g, '.');
}

export function routeGroup(pathname: string): string {
  const firstPart = pathname.replace(/^\/+/, '').split('/').filter(Boolean)[0];
  return firstPart?.replace(/[()]/g, '') || 'root';
}
