import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_EMAIL_COOLDOWN_SECONDS = 60;
export const SIGNUP_VERIFICATION_EMAIL_COOLDOWN_KEY =
  'auth_signup_verification_email_cooldown_until';
export const PASSWORD_RESET_EMAIL_COOLDOWN_KEY =
  'auth_password_reset_email_cooldown_until';

export function getRemainingCooldownSeconds(untilMs: number): number {
  const remainingMs = untilMs - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

export async function readAuthEmailCooldownSeconds(key: string): Promise<number> {
  const raw = await AsyncStorage.getItem(key);
  const until = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(until) ? getRemainingCooldownSeconds(until) : 0;
}

export async function setAuthEmailCooldown(
  key: string,
  seconds = AUTH_EMAIL_COOLDOWN_SECONDS,
): Promise<void> {
  await AsyncStorage.setItem(key, String(Date.now() + seconds * 1000));
}

export async function clearAuthEmailCooldown(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
