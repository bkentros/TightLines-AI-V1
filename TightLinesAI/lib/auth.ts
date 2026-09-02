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

function authErrorText(err: unknown): string {
  return getAuthErrorMessage(err).toLowerCase();
}

/** Apple ID email already tied to an email/password FinFindr account. */
export function isAppleEmailAccountConflict(err: unknown): boolean {
  const text = authErrorText(err);
  if (!text) return false;
  return (
    text.includes('already registered')
    || text.includes('already exists')
    || text.includes('user already')
    || text.includes('email already')
    || text.includes('identity is already')
    || text.includes('identity already')
    || text.includes('already linked')
    || text.includes('different provider')
    || text.includes('different credential')
    || text.includes('account exists')
    || text.includes('unable to link')
  );
}

export type AppleSignInNoticeContext = 'welcome' | 'sign-in';

/** User-facing copy only — does not change auth behavior. */
export function getAppleSignInFailureNotice(
  err: unknown,
  context: AppleSignInNoticeContext = 'welcome',
): { title: string; message: string } {
  if (isAppleEmailAccountConflict(err)) {
    if (context === 'sign-in') {
      return {
        title: 'Use your email sign-in',
        message:
          'This Apple ID email is already tied to a FinFindr email/password account. Sign in with your email and password above, or reset your password.',
      };
    }
    return {
      title: 'Use your email sign-in',
      message:
        'This email already has a FinFindr account. Sign in with your email and password, or reset your password.',
    };
  }

  const text = authErrorText(err);
  if (text.includes('took too long') || text.includes('network')) {
    return {
      title: 'Connection issue',
      message: 'The request took too long. Check your connection and try again.',
    };
  }

  if (__DEV__) {
    return {
      title: 'Apple Sign-In failed',
      message: getAuthErrorMessage(err),
    };
  }

  return {
    title: 'Apple Sign-In failed',
    message: 'Please try again.',
  };
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

export async function signInWithGoogle(
  identityToken: string,
  nonce: string,
  accessToken: string,
) {
  const { data, error } = await withAuthTimeout(supabase.auth.signInWithIdToken({
    provider: 'google',
    token: identityToken,
    nonce,
    access_token: accessToken,
  })).catch((err) => authFailure({ user: null, session: null }, err));
  if (__DEV__) {
    if (error) {
      console.warn(
        '[auth] Supabase Google signInWithIdToken failed:',
        getAuthErrorMessage(error),
        error,
      );
    } else if (data.session) {
      console.info('[auth] Supabase Google session created');
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
