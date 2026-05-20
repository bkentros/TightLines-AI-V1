const ADMIN_EMAILS = [
  'brandonkentros@icloud.com',
];

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
}
