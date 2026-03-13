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
      Authorization: `Bearer ${options.accessToken}`,
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
 * Always use this instead of `supabase.auth.getSession()` before calling
 * an edge function — getSession() returns the cached (possibly expired) token.
 */
export async function getValidAccessToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not signed in. Please sign in to continue.');
  }

  // Refresh if expired or within 60 seconds of expiry
  const expiresAt = session.expires_at ?? 0;
  const nowSec = Math.floor(Date.now() / 1000);
  if (expiresAt - nowSec < 60) {
    const { data: refreshed, error } = await supabase.auth.refreshSession();
    if (error || !refreshed.session) {
      throw new Error('Session expired. Please sign out and sign back in.');
    }
    return refreshed.session.access_token;
  }

  return session.access_token;
}

export type { Session, User } from '@supabase/supabase-js';
