const ADMIN_EMAILS = [
  'brandonkentros@icloud.com',
];

// Keep complimentary Angler access admin-only. RevenueCat should be the only
// path that upgrades normal user accounts.
const COMPLIMENTARY_ANGLER_EMAILS = [
  'brandonkentros@icloud.com',
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
