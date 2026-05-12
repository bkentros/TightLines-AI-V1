/**
 * Sign-up email rules: RFC-ish shape plus an allowlist of common mailbox hosts.
 * This does not prove an inbox exists (that requires verification email).
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Broad allowlist; expand as needed for your users. */
const ALLOWED_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'ymail.com',
  'rocketmail.com',
  'hotmail.com',
  'hotmail.co.uk',
  'outlook.com',
  'outlook.co.uk',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'pm.me',
  'zoho.com',
  'gmx.com',
  'gmx.net',
  'gmx.de',
  'mail.com',
  'email.com',
  'yandex.com',
  'yandex.ru',
  'tutanota.com',
  'tutamail.com',
  'fastmail.com',
  'fastmail.fm',
  'hey.com',
  'comcast.net',
  'verizon.net',
  'att.net',
  'bellsouth.net',
  'cox.net',
  'charter.net',
  'sbcglobal.net',
  'btinternet.com',
  'virgin.net',
  'virginmedia.com',
  'sky.com',
  'rogers.com',
  'shaw.ca',
  'bell.net',
  'telus.net',
  'naver.com',
  'daum.net',
  'qq.com',
  '163.com',
  '126.com',
  'ntlworld.com',
  'orange.fr',
  'free.fr',
  'sfr.fr',
  'web.de',
  't-online.de',
  'freenet.de',
  'libero.it',
  'virgilio.it',
  'uol.com.br',
  'terra.com.br',
  'bol.com.br',
]);

function mailboxDomain(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  if (at < 0 || at === trimmed.length - 1) return '';
  return trimmed.slice(at + 1);
}

export function isAllowlistedMailboxDomain(email: string): boolean {
  const domain = mailboxDomain(email);
  if (!domain) return false;
  if (ALLOWED_DOMAINS.has(domain)) return true;
  if (domain.endsWith('.edu') || domain.endsWith('.gov')) return true;
  return false;
}

/** Format OK and host is allowlisted — safe to show “valid” styling. */
export function isSignUpEmailFormatAcceptable(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) return false;
  return isAllowlistedMailboxDomain(trimmed);
}
