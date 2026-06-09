/**
 * Sign-up email rules: basic shape only. Inbox delivery is handled by the
 * verification email — we do not block custom or business domains client-side.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mailboxDomain(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  if (at < 0 || at === trimmed.length - 1) return '';
  return trimmed.slice(at + 1);
}

/** True when the address has a plausible mailbox shape for sign-up. */
export function isSignUpEmailFormatAcceptable(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) return false;
  const domain = mailboxDomain(trimmed);
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }
  const tld = domain.split('.').pop() ?? '';
  return tld.length >= 2;
}
