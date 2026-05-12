/**
 * URLs Supabase follows after the user taps links in auth emails.
 *
 * Never default to `finfindr://` here: Email → Safari cannot open that scheme
 * and shows "address is invalid". The https bridge on finfindr.app forwards
 * tokens into the app.
 *
 * Override with EXPO_PUBLIC_AUTH_EMAIL_REDIRECT for staging / another domain.
 */
const DEFAULT_HTTPS_AUTH_BRIDGE = 'https://finfindr.app/auth/confirm/';
const PASSWORD_RESET_FLOW_PARAM = 'flow=password-reset';

function withPasswordResetMarker(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return `${DEFAULT_HTTPS_AUTH_BRIDGE}?${PASSWORD_RESET_FLOW_PARAM}`;
  if (/[?&]flow=password-reset(?:&|$)/.test(trimmed)) return trimmed;
  const separator = trimmed.includes('?') ? '&' : '?';
  return `${trimmed}${separator}${PASSWORD_RESET_FLOW_PARAM}`;
}

export function getAuthEmailRedirectUrl(): string {
  return (
    process.env.EXPO_PUBLIC_AUTH_EMAIL_REDIRECT?.trim() || DEFAULT_HTTPS_AUTH_BRIDGE
  );
}

export function getPasswordResetEmailRedirectUrl(): string {
  const dedicated = process.env.EXPO_PUBLIC_AUTH_PASSWORD_EMAIL_REDIRECT?.trim();
  if (dedicated) return withPasswordResetMarker(dedicated);
  return withPasswordResetMarker(
    process.env.EXPO_PUBLIC_AUTH_EMAIL_REDIRECT?.trim() || DEFAULT_HTTPS_AUTH_BRIDGE,
  );
}
