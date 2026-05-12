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

export function getAuthEmailRedirectUrl(): string {
  return (
    process.env.EXPO_PUBLIC_AUTH_EMAIL_REDIRECT?.trim() || DEFAULT_HTTPS_AUTH_BRIDGE
  );
}

export function getPasswordResetEmailRedirectUrl(): string {
  const dedicated = process.env.EXPO_PUBLIC_AUTH_PASSWORD_EMAIL_REDIRECT?.trim();
  if (dedicated) return dedicated;
  return (
    process.env.EXPO_PUBLIC_AUTH_EMAIL_REDIRECT?.trim() || DEFAULT_HTTPS_AUTH_BRIDGE
  );
}
