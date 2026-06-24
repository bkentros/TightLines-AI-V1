import { supabase } from './supabase';

export type UsernameAvailabilityResult =
  | { status: 'available' }
  | { status: 'taken' }
  | { status: 'invalid' }
  | { status: 'error' };

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isUsernameFormatValid(value: string): boolean {
  const normalized = normalizeUsername(value);
  return normalized.length >= 3 && /^[a-z0-9_]+$/.test(normalized);
}

export async function checkUsernameAvailability(
  username: string,
  excludeUserId?: string | null,
): Promise<UsernameAvailabilityResult> {
  const normalized = normalizeUsername(username);
  if (!isUsernameFormatValid(normalized)) {
    return { status: 'invalid' };
  }

  const { data, error } = await supabase.rpc('is_username_available', {
    check_username: normalized,
    exclude_user_id: excludeUserId ?? null,
  });

  if (error) {
    return { status: 'error' };
  }

  return data === true ? { status: 'available' } : { status: 'taken' };
}
