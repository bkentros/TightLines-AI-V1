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
const AUTH_REQUEST_TIMEOUT_MS = 20_000;

async function withAuthTimeout<T>(request: Promise<T>): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('The request took too long. Check your connection and try again.'));
    }, AUTH_REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([request, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function authFailure<TData>(data: TData, err: unknown) {
  return {
    data,
    error: { message: getAuthErrorMessage(err) },
  };
}

export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === 'object') {
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeMessage === 'string' && maybeMessage) return maybeMessage;
    const maybeErrorDescription = (err as { error_description?: unknown }).error_description;
    if (typeof maybeErrorDescription === 'string' && maybeErrorDescription) {
      return maybeErrorDescription;
    }
    const maybeCode = (err as { code?: unknown }).code;
    if (typeof maybeCode === 'string' || typeof maybeCode === 'number') {
      return `Error code ${maybeCode}`;
    }
  }
  return String(err);
}

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
  if (__DEV__) {
    console.warn('[auth] Apple Sign-In did not create a session:', getAuthErrorMessage(err), err);
  }
  report(err);
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    return await withAuthTimeout(supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthEmailRedirectUrl(),
      },
    }));
  } catch (err) {
    return authFailure({ user: null, session: null }, err);
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    return await withAuthTimeout(supabase.auth.signInWithPassword({
      email,
      password,
    }));
  } catch (err) {
    return authFailure({ user: null, session: null }, err);
  }
}

export async function signInWithApple(
  identityToken: string,
  nonce: string,
) {
  const { data, error } = await withAuthTimeout(supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: identityToken,
    nonce,
  })).catch((err) => authFailure({ user: null, session: null }, err));
  if (__DEV__) {
    if (error) {
      console.warn(
        '[auth] Supabase Apple signInWithIdToken failed:',
        getAuthErrorMessage(error),
        error,
      );
    } else if (data.session) {
      console.info('[auth] Supabase Apple session created');
    }
  }
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  try {
    return await withAuthTimeout(supabase.auth.resetPasswordForEmail(email));
  } catch (err) {
    return authFailure({}, err);
  }
}
