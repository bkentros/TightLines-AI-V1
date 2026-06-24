const CREATOR_PORTAL_ADMIN_EMAILS = [
  "brandonkentros@icloud.com",
  "finfindr@hotmail.com",
];
export const CREATOR_PORTAL_URL = "https://finfindr.app/creators/";
export const CREATOR_PORTAL_AUTH_CALLBACK =
  "https://finfindr.app/creators/auth/callback/";

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function isCreatorPortalAdminEmail(
  email: string | null | undefined,
): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return CREATOR_PORTAL_ADMIN_EMAILS.includes(normalized);
}

type CreatorLookupClient = {
  from: (table: string) => {
    select: (columns: string) => {
      ilike: (column: string, value: string) => {
        in: (column: string, values: string[]) => {
          maybeSingle: () => Promise<{
            data: {
              id: string;
              display_name: string;
              slug: string;
              status: string;
            } | null;
            error: { message: string } | null;
          }>;
        };
      };
      eq: (column: string, value: string) => {
        in: (column: string, values: string[]) => {
          maybeSingle: () => Promise<{
            data: {
              id: string;
              display_name: string;
              slug: string;
              status: string;
            } | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  };
};

export async function findActiveCreatorByEmail(
  supabase: CreatorLookupClient,
  email: string | null | undefined,
): Promise<{
  id: string;
  display_name: string;
  slug: string;
  status: string;
} | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const { data, error } = await supabase
    .from("creators")
    .select("id, display_name, slug, status")
    .ilike("email", normalized)
    .in("status", ["active", "paused"])
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function findActiveCreatorForUser(
  supabase: CreatorLookupClient,
  input: { userId: string; email: string | null | undefined },
): Promise<{
  id: string;
  display_name: string;
  slug: string;
  status: string;
} | null> {
  const byUser = await supabase
    .from("creators")
    .select("id, display_name, slug, status")
    .eq("owner_user_id", input.userId)
    .in("status", ["active", "paused"])
    .maybeSingle();
  if (byUser.error) throw new Error(byUser.error.message);
  if (byUser.data) return byUser.data;
  return await findActiveCreatorByEmail(supabase, input.email);
}

export async function isCreatorPortalLoginAllowed(
  supabase: CreatorLookupClient,
  email: string | null | undefined,
): Promise<{ allowed: boolean; isAdmin: boolean; creatorSlug: string | null }> {
  if (isCreatorPortalAdminEmail(email)) {
    return { allowed: true, isAdmin: true, creatorSlug: null };
  }
  const creator = await findActiveCreatorByEmail(supabase, email);
  return {
    allowed: Boolean(creator),
    isAdmin: false,
    creatorSlug: creator?.slug ?? null,
  };
}

const APPLE_APP_ID = "6769178136";
const DEFAULT_OFFER_REFERENCE = "Creator 10 Off 3 Months";

export function slugifyCreatorName(rawName: string): string {
  const base = rawName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = base.length >= 3 ? base : "creator-partner";
  if (!/^[a-z0-9]/.test(slug)) slug = `c-${slug}`;
  if (!/[a-z0-9]$/.test(slug)) slug = `${slug}0`;
  if (slug.length < 3) slug = `${slug}-partner`;
  return slug.slice(0, 64).replace(/-+$/g, "0");
}

export function suggestCreatorReferralCode(input: {
  displayName: string;
  slug: string;
}): string {
  const fromName = input.displayName.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const fromSlug = input.slug.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const stem = (fromName.length >= 3 ? fromName : fromSlug).slice(0, 8);
  const code = `${stem}10`.slice(0, 12);
  return code.length >= 4 ? code : "CREATOR10";
}

/** @deprecated Use suggestCreatorReferralCode */
export const suggestCreatorOfferCode = suggestCreatorReferralCode;

type CreatorSlugClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{
          data: { id: string } | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

type CreatorCodeClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{
          data: { id: string } | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

export async function reserveUniqueCreatorSlug(
  supabase: CreatorSlugClient,
  preferred: string,
): Promise<string> {
  let candidate = slugifyCreatorName(preferred);
  for (let i = 0; i < 20; i += 1) {
    const trySlug = i === 0 ? candidate : `${candidate}-${i + 1}`.slice(0, 64);
    const { data, error } = await supabase
      .from("creators")
      .select("id")
      .eq("slug", trySlug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return trySlug;
  }
  throw new Error("Could not reserve a unique creator slug.");
}

export async function reserveUniqueCreatorCode(
  supabase: CreatorCodeClient,
  preferred: string,
): Promise<string> {
  let candidate = preferred.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  if (candidate.length < 4) candidate = "CREATOR10";
  for (let i = 0; i < 20; i += 1) {
    const tryCode = i === 0 ? candidate : `${candidate.slice(0, 10)}${i}`.slice(0, 12);
    const { data, error } = await supabase
      .from("creator_codes")
      .select("id")
      .eq("code", tryCode)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return tryCode;
  }
  throw new Error("Could not reserve a unique creator referral code.");
}

export { APPLE_APP_ID, DEFAULT_OFFER_REFERENCE };
