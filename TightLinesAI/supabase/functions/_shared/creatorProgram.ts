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

export function buildAppStoreRedemptionUrl(input: {
  code: string;
  appleAppId?: string | null;
  template?: string | null;
}): string | null {
  const code = normalizeCreatorCode(input.code);
  if (!code) return null;

  if (input.template?.trim()) {
    return input.template.replace(/CODE/g, encodeURIComponent(code));
  }

  const appleAppId = cleanString(input.appleAppId, 80);
  if (!appleAppId) return null;
  return `https://apps.apple.com/redeem?ctx=offercodes&id=${
    encodeURIComponent(appleAppId)
  }&code=${encodeURIComponent(code)}`;
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
