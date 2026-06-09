import {
  analyticsEnabled,
  captureAnalytics,
  getPostHogClient,
  posthogHost,
} from './analytics';

export type AnalyticsDiagnostics = {
  enabled: boolean;
  clientReady: boolean;
  host: string;
  /** Human-readable status for Settings admin tools. */
  statusLabel: string;
};

export function getAnalyticsDiagnostics(): AnalyticsDiagnostics {
  const client = analyticsEnabled ? getPostHogClient() : null;
  let statusLabel = 'disabled in this app build';
  if (analyticsEnabled && client) {
    statusLabel = 'enabled (client ready)';
  } else if (analyticsEnabled && !client) {
    statusLabel = 'key in bundle but client failed init';
  } else if (__DEV__) {
    statusLabel =
      'disabled — uncomment EXPO_PUBLIC_POSTHOG_API_KEY in .env, restart Metro, reload dev client';
  } else {
    statusLabel = 'disabled in this App Store build (analytics ships in 1.0.1+)';
  }
  return {
    enabled: analyticsEnabled,
    clientReady: Boolean(client),
    host: posthogHost,
    statusLabel,
  };
}

/** Dev/admin smoke — appears in PostHog Live events as `prebuild_smoke_test`. */
export async function sendAnalyticsDiagnosticsPing(userId?: string): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!analyticsEnabled) {
    const hint = __DEV__
      ? 'Uncomment EXPO_PUBLIC_POSTHOG_API_KEY in .env, fully restart Metro (npm run start:dev-client), then reload the dev client — not the App Store app.'
      : 'This installed build does not include PostHog. Test on a new 1.0.1 build or dev client with PostHog in .env.';
    return {
      ok: false,
      message: `Analytics disabled in this bundle. ${hint}`,
    };
  }

  const client = getPostHogClient();
  if (!client) {
    return {
      ok: false,
      message: 'PostHog client failed to initialize.',
    };
  }

  try {
    captureAnalytics('prebuild_smoke_test', {
      source: 'settings_admin',
      user_id: userId ?? null,
    });
    const flush = (client as { flush?: () => Promise<void> }).flush;
    if (flush) await flush.call(client);
    return {
      ok: true,
      message: 'Sent prebuild_smoke_test — check PostHog Live events in ~2 min.',
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Failed to send test event.',
    };
  }
}
