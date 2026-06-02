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
};

export function getAnalyticsDiagnostics(): AnalyticsDiagnostics {
  const client = analyticsEnabled ? getPostHogClient() : null;
  return {
    enabled: analyticsEnabled,
    clientReady: Boolean(client),
    host: posthogHost,
  };
}

/** Dev/admin smoke — appears in PostHog Live events as `prebuild_smoke_test`. */
export async function sendAnalyticsDiagnosticsPing(userId?: string): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!analyticsEnabled) {
    return {
      ok: false,
      message: 'PostHog key not in .env — analytics disabled (store-like mode).',
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
