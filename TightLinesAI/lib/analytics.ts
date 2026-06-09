import { PostHog } from 'posthog-react-native';
import type { UserProfile } from './types';

const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com';

function isValidPostHogApiKey(key: string): boolean {
  return key.startsWith('phc_') && key.length >= 24;
}

function isValidPostHogHost(host: string): boolean {
  try {
    const url = new URL(host);
    return url.protocol === 'https:' && url.hostname.includes('.');
  } catch {
    return false;
  }
}

const rawPostHogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim() ?? '';
const rawPostHogHost =
  process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || DEFAULT_POSTHOG_HOST;

export const posthogApiKey = isValidPostHogApiKey(rawPostHogApiKey)
  ? rawPostHogApiKey
  : '';
export const posthogHost = isValidPostHogHost(rawPostHogHost)
  ? rawPostHogHost
  : DEFAULT_POSTHOG_HOST;

/** Off unless key + host look valid — bad EAS secrets must not crash the app. */
export const analyticsEnabled =
  posthogApiKey.length > 0 && isValidPostHogHost(posthogHost);

/** Lazy singleton — never construct PostHog at module import (can crash launch). */
let posthogClientInstance: PostHog | null | undefined;

export function getPostHogClient(): PostHog | null {
  if (!analyticsEnabled) return null;
  if (posthogClientInstance !== undefined) return posthogClientInstance;

  try {
    posthogClientInstance = new PostHog(posthogApiKey, {
      host: posthogHost,
      captureAppLifecycleEvents: false,
      enableSessionReplay: false,
      personProfiles: 'identified_only',
      flushAt: __DEV__ ? 1 : 20,
      flushInterval: __DEV__ ? 2000 : 10000,
    });
  } catch (err) {
    posthogClientInstance = null;
    if (__DEV__) {
      console.warn('[analytics] PostHog init failed:', err);
    }
  }

  return posthogClientInstance;
}

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

function safeAnalyticsCall(action: () => void): void {
  try {
    action();
  } catch (err) {
    if (__DEV__) {
      console.warn('[analytics] call failed:', err);
    }
  }
}

export function captureAnalytics(
  eventName: string,
  properties?: AnalyticsProperties,
): void {
  safeAnalyticsCall(() => {
    getPostHogClient()?.capture(eventName, compactProperties(properties));
  });
}

export function screenAnalytics(
  screenName: string,
  properties?: AnalyticsProperties,
): void {
  safeAnalyticsCall(() => {
    void getPostHogClient()?.screen(screenName, compactProperties(properties));
  });
}

export function resetAnalyticsUser(): void {
  safeAnalyticsCall(() => {
    getPostHogClient()?.reset();
  });
}

export function identifyAnalyticsUser(args: {
  userId: string;
  email?: string | null;
  profile?: UserProfile | null;
}): void {
  safeAnalyticsCall(() => {
    const emailDomain = args.email?.split('@')[1]?.toLowerCase() ?? null;
    const profile = args.profile;

    getPostHogClient()?.identify(args.userId, {
      email_domain: emailDomain,
      home_state: profile?.home_state ?? null,
      fishing_mode: profile?.fishing_mode ?? null,
      preferred_units: profile?.preferred_units ?? null,
      subscription_tier: profile?.subscription_tier ?? 'free',
      onboarding_complete: profile?.onboarding_complete ?? false,
      target_species_count: profile?.target_species?.length ?? 0,
    });
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
