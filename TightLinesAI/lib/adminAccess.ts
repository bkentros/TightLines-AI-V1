const ADMIN_EMAILS = [
  'brandonkentros@icloud.com',
];

const COMPLIMENTARY_ANGLER_EMAILS = [
  'brandonkentros@icloud.com',
  'finfindr@hotmail.com',
  'play-review@finfindr.app',
];

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}

export function hasComplimentaryAnglerAccess(email: string | undefined | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return COMPLIMENTARY_ANGLER_EMAILS.some(
    (allowedEmail) => allowedEmail.toLowerCase() === normalized
  );
}
