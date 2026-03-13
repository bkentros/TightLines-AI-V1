import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in .env',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function invokeEdgeFunction<TResponse>(
  functionName: string,
  options: {
    accessToken: string;
    body: unknown;
  }
): Promise<TResponse> {
  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'x-user-token': options.accessToken,
    },
    body: JSON.stringify(options.body),
  });

  const text = await response.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text || null;
  }

  if (!response.ok) {
    if (__DEV__) {
      console.log(`[invokeEdgeFunction] ${functionName} FAILED`, {
        status: response.status,
        responseBody: text?.slice(0, 500),
        tokenPrefix: options.accessToken?.slice(0, 20),
        tokenLength: options.accessToken?.length,
        url: `${supabaseUrl}/functions/v1/${functionName}`,
      });
    }
    const message =
      parsed &&
      typeof parsed === 'object' &&
      'error' in parsed &&
      typeof (parsed as { error?: unknown }).error === 'string'
        ? (parsed as { error: string }).error
        : typeof parsed === 'string' && parsed
          ? parsed
          : `Edge Function returned ${response.status}`;
    throw new Error(message);
  }

  return parsed as TResponse;
}

/**
 * Returns a guaranteed-valid access token, refreshing the session if the
 * token is expired or within 60 seconds of expiry. Throws if not signed in.
 *
 * Checks the Zustand auth store FIRST (set synchronously on sign-in),
 * then falls back to supabase.auth.getSession() (AsyncStorage-backed,
 * which can lag behind after a fresh sign-in and cause 401s).
 */
export async function getValidAccessToken(): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);

  // 1. Try the Zustand store first — it's set synchronously after sign-in.
  //    Lazy import to avoid circular dependency (authStore imports supabase).
  const { useAuthStore } = require('../store/authStore');
  const storeSession = useAuthStore.getState().session;

  if (__DEV__) {
    console.log('[getValidAccessToken] Zustand session:', {
      hasSession: !!storeSession,
      hasToken: !!storeSession?.access_token,
      tokenPrefix: storeSession?.access_token?.slice(0, 20),
      expiresAt: storeSession?.expires_at,
      nowSec,
      ttl: storeSession?.expires_at ? storeSession.expires_at - nowSec : 'N/A',
    });
  }

  if (storeSession?.access_token) {
    const storeExpiry = storeSession.expires_at ?? 0;
    if (storeExpiry - nowSec >= 60) {
      if (__DEV__) console.log('[getValidAccessToken] Using Zustand token (valid)');
      return storeSession.access_token;
    }
    // Near-expiry — refresh and update the store
    const { data: refreshed, error } = await supabase.auth.refreshSession();
    if (!error && refreshed.session) {
      useAuthStore.getState().setSession(refreshed.session);
      return refreshed.session.access_token;
    }
  }

  // 2. Fallback to supabase-js internal cache (AsyncStorage-backed)
  if (__DEV__) console.log('[getValidAccessToken] Falling back to supabase.auth.getSession()');
  const { data: { session } } = await supabase.auth.getSession();

  if (__DEV__) {
    console.log('[getValidAccessToken] supabase.auth.getSession() result:', {
      hasSession: !!session,
      hasToken: !!session?.access_token,
      tokenPrefix: session?.access_token?.slice(0, 20),
      expiresAt: session?.expires_at,
      ttl: session?.expires_at ? session.expires_at - nowSec : 'N/A',
    });
  }

  if (!session) {
    throw new Error('Not signed in. Please sign in to continue.');
  }

  const expiresAt = session.expires_at ?? 0;
  if (expiresAt - nowSec < 60) {
    const { data: refreshed, error } = await supabase.auth.refreshSession();
    if (error || !refreshed.session) {
      throw new Error('Session expired. Please sign out and sign back in.');
    }
    useAuthStore.getState().setSession(refreshed.session);
    return refreshed.session.access_token;
  }

  return session.access_token;
}

export type { Session, User } from '@supabase/supabase-js';
