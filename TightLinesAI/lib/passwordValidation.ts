export const PASSWORD_POLICY_LABEL =
  'At least 10 characters with a number and a letter';

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
