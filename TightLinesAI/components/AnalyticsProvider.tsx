import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname, useSegments } from 'expo-router';
import { PostHogProvider } from 'posthog-react-native';
import type { PostHog } from 'posthog-react-native';
import { useAuthStore } from '../store/authStore';
import {
  analyticsEnabled,
  captureAnalytics,
  getPostHogClient,
  identifyAnalyticsUser,
  resetAnalyticsUser,
  routeGroup,
  routeScreenName,
  screenAnalytics,
} from '../lib/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
}

/** If PostHogProvider throws, keep the app running without analytics. */
class AnalyticsShellBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) {
      console.warn('[analytics] PostHog shell failed — analytics disabled:', error);
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function AnalyticsRuntime() {
  const pathname = usePathname();
  const segments = useSegments();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const lastPathname = useRef<string | null>(null);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    captureAnalytics('app_opened', {
      environment: __DEV__ ? 'development' : 'production',
    });
  }, []);

  useEffect(() => {
    if (!pathname || lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    screenAnalytics(routeScreenName(pathname), {
      pathname,
      route_group: routeGroup(pathname),
      route_depth: segments.length,
    });
  }, [pathname, segments.length]);

  useEffect(() => {
    if (!user?.id) {
      if (lastUserId.current) {
        resetAnalyticsUser();
        lastUserId.current = null;
      }
      return;
    }

    lastUserId.current = user.id;
    identifyAnalyticsUser({
      userId: user.id,
      email: user.email,
      profile,
    });
  }, [
    profile?.fishing_mode,
    profile?.home_state,
    profile?.onboarding_complete,
    profile?.preferred_units,
    profile?.subscription_tier,
    profile?.target_species?.length,
    user?.email,
    user?.id,
  ]);

  return null;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [client, setClient] = useState<PostHog | null>(null);

  useEffect(() => {
    if (!analyticsEnabled) return;
    try {
      setClient(getPostHogClient());
    } catch (err) {
      if (__DEV__) {
        console.warn('[analytics] PostHog client setup failed:', err);
      }
      setClient(null);
    }
  }, []);

  if (!analyticsEnabled || !client) {
    return <>{children}</>;
  }

  const shell = (
    <PostHogProvider
      client={client}
      autocapture={{ captureScreens: false, captureTouches: false }}
    >
      <AnalyticsRuntime />
      {children}
    </PostHogProvider>
  );

  return (
    <AnalyticsShellBoundary fallback={<>{children}</>}>
      {shell}
    </AnalyticsShellBoundary>
  );
}
