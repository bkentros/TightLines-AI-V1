export type RevenueCatEventRecord = Record<string, unknown>;

export type ParsedRevenueCatWebhook = {
  apiVersion: string | null;
  event: RevenueCatEventRecord;
  eventId: string | null;
  type: string | null;
  appUserId: string | null;
  originalAppUserId: string | null;
  aliases: string[];
  transactionId: string | null;
  originalTransactionId: string | null;
  productId: string | null;
  entitlementIds: string[];
  store: string | null;
  environment: string | null;
  periodType: string | null;
  offerCode: string | null;
  renewalNumber: number | null;
  currency: string | null;
  priceUsd: number | null;
  priceInPurchasedCurrency: number | null;
  taxPercentage: number | null;
  commissionPercentage: number | null;
  eventTimestampAt: string | null;
  purchasedAt: string | null;
  expirationAt: string | null;
};

const PAID_EVENT_TYPES = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "NON_RENEWING_PURCHASE",
]);

/** Click → sign-up attribution window (does not limit renewal commissions). */
export const REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS = 60;

/** Allowed per-creator commission earning caps (months of paid subscription). */
export const COMMISSION_MONTH_CAP_OPTIONS = [12, 24] as const;
export type CommissionMonthCap = typeof COMMISSION_MONTH_CAP_OPTIONS[number];

export function normalizeCommissionMonthCap(value: unknown): CommissionMonthCap {
  const parsed = typeof value === "number"
    ? value
    : typeof value === "string"
    ? Number(value)
    : NaN;
  if (parsed === 24) return 24;
  return 12;
}

/** Positive ledger rows used to determine the next earning month for an attribution. */
export type CreatorEarningLedgerRow = {
  id: string;
  status: string;
  reversal_of: string | null;
};

/**
 * Counts paid billing periods that still consume the creator's month cap.
 * Churn gaps do not count — only actual paid (non-reversed) ledger rows.
 */
export function countActiveCreatorEarningMonths(
  positiveRows: CreatorEarningLedgerRow[],
  reversedOriginalIds: Iterable<string>,
): number {
  const reversed = new Set(reversedOriginalIds);
  return positiveRows.filter(
    (row) =>
      row.reversal_of == null &&
      row.status !== "void" &&
      row.status !== "reversed" &&
      !reversed.has(row.id),
  ).length;
}

/** Returns the next earning month number, or null when the per-user cap is reached. */
export function nextCreatorEarningMonthNumber(
  activePaidMonths: number,
  monthCap: number,
): number | null {
  const next = activePaidMonths + 1;
  return next <= monthCap ? next : null;
}

/** Sign-up qualifies if click is recent OR we already matched an app install for this click. */
export function referralClickQualifiesForAttribution(input: {
  createdAt: string | null | undefined;
  appOpenedAt?: string | null;
  nowMs?: number;
}): boolean {
  if (input.appOpenedAt?.trim()) return true;
  return isReferralClickWithinAttributionWindow(input.createdAt, input.nowMs);
}

/** Probabilistic install match: click must be this recent (hours). */
export const FINGERPRINT_MATCH_WINDOW_HOURS = 72;

export function isReferralClickWithinAttributionWindow(
  createdAt: string | null | undefined,
  nowMs = Date.now(),
): boolean {
  if (!createdAt) return false;
  const clickedAt = Date.parse(createdAt);
  if (!Number.isFinite(clickedAt)) return false;
  const windowMs = REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  return nowMs - clickedAt <= windowMs;
}

export type CreatorReferralLinkParams = {
  code: string;
  referralClickToken: string;
};

export function buildCreatorReferralWebUrl(
  code: string,
  clickToken: string,
): string {
  const normalized = normalizeCreatorCode(code);
  if (!normalized || !clickToken.trim()) return "";
  return `https://finfindr.app/r?click=${
    encodeURIComponent(clickToken.trim())
  }&code=${encodeURIComponent(normalized)}`;
}

/** Parse finfindr://creator or https://finfindr.app/r referral payloads. */
export function parseCreatorReferralPayload(
  raw: string,
): CreatorReferralLinkParams | null {
  const trimmed = raw.trim();
  if (!trimmed.includes("://")) return null;
  try {
    const parsed = new URL(trimmed);
    const code = normalizeCreatorCode(parsed.searchParams.get("code"));
    const clickRaw = parsed.searchParams.get("click") ??
      parsed.searchParams.get("referral_click_token");
    const referralClickToken = clickRaw?.trim() ?? "";
    if (!code || !referralClickToken || !isUuid(referralClickToken)) {
      return null;
    }

    const scheme = parsed.protocol.replace(":", "").toLowerCase();
    const host = parsed.hostname.toLowerCase();
    const isAppCreator = scheme === "finfindr" &&
      parsed.host.toLowerCase().includes("creator");
    const isWebReferral = host === "finfindr.app" &&
      (parsed.pathname === "/r" || parsed.pathname.startsWith("/r/"));

    if (!isAppCreator && !isWebReferral) return null;
    return { code, referralClickToken };
  } catch {
    return null;
  }
}

export function isReferralClickWithinFingerprintWindow(
  createdAt: string | null | undefined,
  nowMs = Date.now(),
): boolean {
  if (!createdAt) return false;
  const clickedAt = Date.parse(createdAt);
  if (!Number.isFinite(clickedAt)) return false;
  const windowMs = FINGERPRINT_MATCH_WINDOW_HOURS * 60 * 60 * 1000;
  return nowMs - clickedAt <= windowMs;
}

export function normalizeCreatorCode(rawCode: unknown): string | null {
  if (typeof rawCode !== "string" && typeof rawCode !== "number") return null;
  const normalized = String(rawCode).trim().toUpperCase().replace(
    /[^A-Z0-9]/g,
    "",
  );
  return normalized.length > 0 ? normalized : null;
}

export function cleanString(value: unknown, maxLength = 500): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export function numberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function integerOrNull(value: unknown): number | null {
  const parsed = numberOrNull(value);
  return parsed == null ? null : Math.trunc(parsed);
}

export function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => cleanString(item, 500))
    .filter((item): item is string => Boolean(item));
}

export function millisToIso(value: unknown): string | null {
  const millis = numberOrNull(value);
  if (millis == null) return null;
  const date = new Date(millis);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

export function calculateNetProceedsUsd(input: {
  priceUsd: number | null;
  taxPercentage?: number | null;
  commissionPercentage?: number | null;
}): number | null {
  if (input.priceUsd == null) return null;
  const tax = input.taxPercentage ?? 0;
  const commission = input.commissionPercentage ?? 0;
  const multiplier = Math.max(0, 1 - tax - commission);
  return roundCurrency(input.priceUsd * multiplier);
}

export function calculateCreatorCommissionUsd(input: {
  netProceedsUsd: number | null;
  commissionRateBps: number | null;
}): number | null {
  if (input.netProceedsUsd == null || input.commissionRateBps == null) {
    return null;
  }
  return roundCurrency(
    input.netProceedsUsd * (input.commissionRateBps / 10000),
  );
}

export function parseRevenueCatWebhookPayload(
  payload: unknown,
): ParsedRevenueCatWebhook | null {
  if (!payload || typeof payload !== "object") return null;
  const body = payload as Record<string, unknown>;
  const event = body.event;
  if (!event || typeof event !== "object" || Array.isArray(event)) return null;

  const record = event as RevenueCatEventRecord;
  const offerCode = normalizeCreatorCode(record.offer_code);
  const entitlementIds = stringArray(record.entitlement_ids);
  const legacyEntitlementId = cleanString(record.entitlement_id);

  return {
    apiVersion: cleanString(body.api_version, 40),
    event: record,
    eventId: cleanString(record.id, 200),
    type: cleanString(record.type, 80),
    appUserId: cleanString(record.app_user_id, 500),
    originalAppUserId: cleanString(record.original_app_user_id, 500),
    aliases: stringArray(record.aliases),
    transactionId: cleanString(record.transaction_id, 500),
    originalTransactionId: cleanString(record.original_transaction_id, 500),
    productId: cleanString(record.product_id, 500),
    entitlementIds: entitlementIds.length > 0
      ? entitlementIds
      : legacyEntitlementId
      ? [legacyEntitlementId]
      : [],
    store: cleanString(record.store, 80),
    environment: cleanString(record.environment, 80),
    periodType: cleanString(record.period_type, 80),
    offerCode,
    renewalNumber: integerOrNull(record.renewal_number),
    currency: cleanString(record.currency, 20),
    priceUsd: numberOrNull(record.price),
    priceInPurchasedCurrency: numberOrNull(record.price_in_purchased_currency),
    taxPercentage: numberOrNull(record.tax_percentage),
    commissionPercentage: numberOrNull(record.commission_percentage),
    eventTimestampAt: millisToIso(record.event_timestamp_ms),
    purchasedAt: millisToIso(record.purchased_at_ms),
    expirationAt: millisToIso(record.expiration_at_ms),
  };
}

export function sanitizeRevenueCatWebhookPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  const body = { ...(payload as Record<string, unknown>) };
  if (
    !body.event || typeof body.event !== "object" || Array.isArray(body.event)
  ) {
    return body;
  }

  const event = { ...(body.event as RevenueCatEventRecord) };
  if ("subscriber_attributes" in event) {
    event.subscriber_attributes = "[redacted]";
  }
  if ("metadata" in event) {
    event.metadata = event.metadata == null ? null : "[redacted]";
  }

  return { ...body, event };
}

export function isPaidRevenueEvent(event: ParsedRevenueCatWebhook): boolean {
  return Boolean(
    event.type &&
      PAID_EVENT_TYPES.has(event.type) &&
      event.priceUsd != null &&
      event.priceUsd > 0,
  );
}

export function isRefundRevenueEvent(event: ParsedRevenueCatWebhook): boolean {
  if (event.priceUsd != null && event.priceUsd < 0) return true;
  return event.type === "CANCELLATION" &&
    cleanString(event.event.cancel_reason, 80) === "CUSTOMER_SUPPORT";
}

export function candidateRevenueCatUserIds(
  event: ParsedRevenueCatWebhook,
): string[] {
  const seen = new Set<string>();
  const candidates = [
    event.appUserId,
    event.originalAppUserId,
    ...event.aliases,
  ];

  for (const candidate of candidates) {
    const cleaned = cleanString(candidate, 500);
    if (cleaned) seen.add(cleaned);
  }

  return [...seen];
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(value);
}

type CountQueryResult = Promise<{
  count: number | null;
  error: { message: string } | null;
}> & {
  eq: (column: string, value: string) => CountQueryResult;
  neq: (column: string, value: string) => CountQueryResult;
  in: (column: string, values: string[]) => CountQueryResult;
};

type SupabaseCountClient = {
  from: (table: string) => {
    select: (
      columns: string,
      options?: { count: string; head: boolean },
    ) => CountQueryResult;
  };
};

type SupabaseProfileClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{
          data: { subscription_tier?: string | null } | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

export async function userHasPaidSubscriptionHistory(
  supabase: SupabaseCountClient,
  userId: string,
): Promise<boolean> {
  const { count: periodCount, error: periodError } = await supabase
    .from("subscription_periods")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (periodError) throw new Error(periodError.message);
  if ((periodCount ?? 0) > 0) return true;

  const paidEventTypes = [
    "INITIAL_PURCHASE",
    "RENEWAL",
    "NON_RENEWING_PURCHASE",
    "PRODUCT_CHANGE",
  ];
  const { count: eventCount, error: eventError } = await supabase
    .from("revenuecat_events")
    .select("id", { count: "exact", head: true })
    .eq("app_user_id", userId)
    .in("event_type", paidEventTypes);
  if (eventError) throw new Error(eventError.message);
  return (eventCount ?? 0) > 0;
}

export async function userHasActiveAnglerProfile(
  supabase: SupabaseProfileClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.subscription_tier === "angler";
}

export async function isCreatorReferralEligibleUser(
  supabase: SupabaseCountClient & SupabaseProfileClient,
  userId: string,
): Promise<{ eligible: boolean; reason?: string }> {
  if (await userHasActiveAnglerProfile(supabase, userId)) {
    return { eligible: false, reason: "already_subscribed" };
  }
  if (await userHasPaidSubscriptionHistory(supabase, userId)) {
    return { eligible: false, reason: "prior_subscriber" };
  }
  return { eligible: true };
}

/** @deprecated Use isCreatorReferralEligibleUser */
export const isCreatorOfferEligibleUser = isCreatorReferralEligibleUser;

export function attributionQualifiesForCommission(attribution: {
  attribution_source: string;
  referral_click_id: string | null;
}): boolean {
  if (attribution.attribution_source === "manual_admin") return true;
  return attribution.attribution_source === "direct_link" &&
    Boolean(attribution.referral_click_id);
}

/** True when this Apple subscription chain already paid under another FinFindr account. */
export async function originalTransactionIdHasCrossAccountHistory(
  supabase: SupabaseCountClient,
  originalTransactionId: string,
  userId: string,
): Promise<boolean> {
  const { count: periodCount, error: periodError } = await supabase
    .from("subscription_periods")
    .select("id", { count: "exact", head: true })
    .eq("original_transaction_id", originalTransactionId)
    .neq("user_id", userId);
  if (periodError) throw new Error(periodError.message);
  if ((periodCount ?? 0) > 0) return true;

  const paidEventTypes = [
    "INITIAL_PURCHASE",
    "RENEWAL",
    "NON_RENEWING_PURCHASE",
    "PRODUCT_CHANGE",
  ];
  const { count: eventCount, error: eventError } = await supabase
    .from("revenuecat_events")
    .select("id", { count: "exact", head: true })
    .eq("original_transaction_id", originalTransactionId)
    .neq("app_user_id", userId)
    .in("event_type", paidEventTypes);
  if (eventError) throw new Error(eventError.message);
  return (eventCount ?? 0) > 0;
}

/** True when RevenueCat linked this purchase to another FinFindr account with paid history. */
export async function linkedRevenueCatAccountsHavePaidHistory(
  supabase: SupabaseCountClient,
  event: ParsedRevenueCatWebhook,
  userId: string,
): Promise<boolean> {
  for (const candidate of candidateRevenueCatUserIds(event)) {
    if (!isUuid(candidate) || candidate === userId) continue;
    if (await userHasPaidSubscriptionHistory(supabase, candidate)) {
      return true;
    }
  }
  return false;
}

export async function userHadPriorAnglerPeriods(
  supabase: {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          neq: (column: string, value: string) => {
            limit: (count: number) => Promise<{
              data: Array<{ id: string }> | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  },
  userId: string,
  currentPeriodId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("subscription_periods")
    .select("id")
    .eq("user_id", userId)
    .neq("id", currentPeriodId)
    .limit(1);
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}
