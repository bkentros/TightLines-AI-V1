export const PASSWORD_POLICY_LABEL =
  '10+ characters with a number and letter; avoid reused passwords';

export const COMPROMISED_PASSWORD_GUIDANCE =
  'Choose a unique password you have not used for another account. Avoid common phrases, names, and predictable number substitutions.';

function passwordErrorText(error: unknown): string {
  if (error == null) return '';
  if (error instanceof Error) return error.message.toLowerCase();
  if (typeof error === 'object') {
    const candidate = error as { code?: unknown; message?: unknown };
    return [candidate.code, candidate.message]
      .filter((value): value is string => typeof value === 'string')
      .join(' ')
      .toLowerCase();
  }
  return String(error).toLowerCase();
}

/** Matches Supabase's weak/leaked-password responses without relying on one SDK version. */
export function isCompromisedPasswordError(error: unknown): boolean {
  const text = passwordErrorText(error);
  return (
    text.includes('weak_password') ||
    text.includes('weak password') ||
    text.includes('known to be weak') ||
    text.includes('compromised password') ||
    text.includes('found in a data breach') ||
    text.includes('easy to guess') ||
    text.includes('pwned')
  );
}

export function getPasswordValidationError(password: string): string | null {
  if (password.length < 10) {
    return 'Password must be at least 10 characters.';
  }
  if (!/[A-Za-z]/.test(password)) {
    return 'Password must include at least one letter.';
  }
  if (!/\d/.test(password)) {
    return 'Password must include at least one number.';
  }
  return null;
}

export function isPasswordValid(password: string): boolean {
  return getPasswordValidationError(password) == null;
}
