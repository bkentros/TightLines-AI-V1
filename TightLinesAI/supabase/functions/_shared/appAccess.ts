const FULL_ACCESS_EMAILS = [
  "brandonkentros@icloud.com",
  "finfindr@hotmail.com",
];

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email || typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function hasFullAccessEmail(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return FULL_ACCESS_EMAILS.includes(normalized);
}

const ADMIN_EMAILS = [
  "brandonkentros@icloud.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return ADMIN_EMAILS.includes(normalized);
}

export function resolveServerSubscriptionTier(
  profileTier: string | null | undefined,
  email: string | null | undefined,
): "free" | "angler" | "master_angler" {
  if (hasFullAccessEmail(email)) return "angler";
  if (profileTier === "angler" || profileTier === "master_angler") {
    return profileTier;
  }
  return "free";
}
