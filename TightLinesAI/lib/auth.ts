import { getAuthEmailRedirectUrl } from './authEmailRedirect';
import { useAuthStore } from '../store/authStore';
import { supabase } from './supabase';

/** True when Apple / Expo reports the user dismissed the sheet. */
export function isAppleUserCancellation(err: unknown): boolean {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: unknown }).code;
    if (code === 'ERR_REQUEST_CANCELED' || code === 'ERR_CANCELED') return true;
    // ASAuthorizationError.canceled (native)
    if (code === 1001) return true;
  }
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  if (message.includes('ERR_REQUEST_CANCELED')) return true;
  if (
    lower.includes('asauthorizationerror') &&
    (lower.includes('1001') || lower.includes('canceled'))
  ) {
    return true;
  }
  return false;
}

const APPLE_SIGN_IN_FAILURE_POLL_MS = 100;
/** First Apple sign-in on device can lag behind `onAuthStateChange` / storage; stay generous. */
const APPLE_SIGN_IN_FAILURE_MAX_WAIT_MS = 12000;

async function hasAnyAuthSession(): Promise<boolean> {
  if (useAuthStore.getState().session != null) return true;
  const { data } = await supabase.auth.getSession();
  return data.session != null;
}

/**
 * The auth listener updates Zustand slightly after Supabase persists the session.
 * Only tell the user sign-in failed if both the store and the client still show
 * no session after a generous wait (avoids first-login false alarms).
 */
export async function reportAppleSignInFailureIfStillSignedOut(
  err: unknown,
  report: (err: unknown) => void,
): Promise<void> {
  if (isAppleUserCancellation(err)) return;
  const deadline = Date.now() + APPLE_SIGN_IN_FAILURE_MAX_WAIT_MS;
  while (Date.now() < deadline) {
    try {
      if (await hasAnyAuthSession()) return;
    } catch {
      /* ignore transient getSession errors during handoff */
    }
    await new Promise((r) => setTimeout(r, APPLE_SIGN_IN_FAILURE_POLL_MS));
  }
  try {
    if (await hasAnyAuthSession()) return;
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) return;
  } catch {
    /* fall through to report */
  }
  report(err);
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthEmailRedirectUrl(),
    },
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithApple(
  identityToken: string,
  nonce: string,
) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: identityToken,
    nonce,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
}
