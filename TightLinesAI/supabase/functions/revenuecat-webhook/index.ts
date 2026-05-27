import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  calculateNetProceedsUsd,
  candidateRevenueCatUserIds,
  cleanString,
  isPaidRevenueEvent,
  isRefundRevenueEvent,
  isUuid,
  type ParsedRevenueCatWebhook,
  parseRevenueCatWebhookPayload,
  sanitizeRevenueCatWebhookPayload,
} from "../_shared/creatorProgram.ts";

type SupabaseClient = {
  auth: ReturnType<typeof createClient>["auth"];
  from: (table: string) => any;
};

type AttributionRow = {
  id: string;
  creator_id: string;
  creator_code_id: string | null;
  code: string | null;
  commission_rate_bps_snapshot: number;
  commission_month_cap_snapshot: number;
  status: string;
};

type SubscriptionPeriodRow = {
  id: string;
  net_proceeds_usd: number | null;
};

type LedgerRow = {
  id: string;
  creator_id: string;
  creator_code_id: string | null;
  user_attribution_id: string | null;
  user_id: string | null;
  subscription_period_id: string;
  revenuecat_event_id: string;
  transaction_id: string;
  original_transaction_id: string | null;
  product_id: string | null;
  event_type: string;
  earning_month_number: number;
  commission_rate_bps: number;
  gross_revenue_usd: number | null;
  tax_percentage: number | null;
  store_commission_percentage: number | null;
  net_proceeds_usd: number | null;
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function webhookSecret(): string | null {
  return Deno.env.get("REVENUECAT_WEBHOOK_AUTH_TOKEN")?.trim() ||
    Deno.env.get("REVENUECAT_WEBHOOK_SECRET")?.trim() ||
    null;
}

function requestHasValidSecret(req: Request): { ok: true } | {
  ok: false;
  status: number;
  error: string;
} {
  const expected = webhookSecret();
  if (!expected || expected.length < 16) {
    return {
      ok: false,
      status: 500,
      error: "revenuecat_webhook_secret_missing",
    };
  }

  const authHeader = req.headers.get("authorization")?.trim() ?? "";
  const expectedBare = expected.replace(/^Bearer\s+/i, "").trim();
  const actualBare = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (authHeader === expected || actualBare === expectedBare) {
    return { ok: true };
  }

  return { ok: false, status: 401, error: "unauthorized" };
}

function dbErrorCode(error: unknown): string | null {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : null;
  }
  return null;
}

async function markEventStatus(
  supabase: SupabaseClient,
  eventId: string,
  status: "processed" | "ignored" | "failed",
  processingError: string | null = null,
) {
  await supabase
    .from("revenuecat_events")
    .update({
      processing_status: status,
      processing_error: processingError,
      processed_at: new Date().toISOString(),
    })
    .eq("id", eventId);
}

async function findProfileId(
  supabase: SupabaseClient,
  event: ParsedRevenueCatWebhook,
): Promise<string | null> {
  for (const candidate of candidateRevenueCatUserIds(event)) {
    if (!isUuid(candidate)) continue;
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();
    if (error) {
      console.warn("[revenuecat-webhook] profile lookup failed", {
        candidate,
        error: error.message,
      });
      continue;
    }
    if (data?.id) return data.id as string;
  }
  return null;
}

async function getExistingAttribution(
  supabase: SupabaseClient,
  userId: string,
): Promise<AttributionRow | null> {
  const { data, error } = await supabase
    .from("user_attributions")
    .select(
      "id, creator_id, creator_code_id, code, commission_rate_bps_snapshot, commission_month_cap_snapshot, status",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[revenuecat-webhook] attribution lookup failed", {
      userId,
      error: error.message,
    });
    return null;
  }

  if (!data || data.status !== "active") return null;
  return data as AttributionRow;
}

async function createAttributionFromOfferCode(
  supabase: SupabaseClient,
  userId: string,
  event: ParsedRevenueCatWebhook,
): Promise<AttributionRow | null> {
  if (!event.offerCode) return null;

  const { data: codeRow, error: codeError } = await supabase
    .from("creator_codes")
    .select("id, creator_id, code")
    .eq("code", event.offerCode)
    .maybeSingle();
  if (codeError || !codeRow) {
    if (codeError) {
      console.warn("[revenuecat-webhook] creator code lookup failed", {
        code: event.offerCode,
        error: codeError.message,
      });
    }
    return null;
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creators")
    .select("id, commission_rate_bps, commission_month_cap, status")
    .eq("id", codeRow.creator_id)
    .maybeSingle();
  if (creatorError || !creator || creator.status !== "active") {
    if (creatorError) {
      console.warn("[revenuecat-webhook] creator lookup failed", {
        creatorId: codeRow.creator_id,
        error: creatorError.message,
      });
    }
    return null;
  }

  const insertPayload = {
    user_id: userId,
    creator_id: creator.id,
    creator_code_id: codeRow.id,
    attribution_source: "revenuecat_offer_code",
    code: event.offerCode,
    commission_rate_bps_snapshot: creator.commission_rate_bps,
    commission_month_cap_snapshot: creator.commission_month_cap,
    status: "active",
  };

  const { data, error } = await supabase
    .from("user_attributions")
    .insert(insertPayload)
    .select(
      "id, creator_id, creator_code_id, code, commission_rate_bps_snapshot, commission_month_cap_snapshot, status",
    )
    .single();

  if (error) {
    if (dbErrorCode(error) === "23505") {
      return await getExistingAttribution(supabase, userId);
    }
    console.warn("[revenuecat-webhook] attribution insert failed", {
      userId,
      code: event.offerCode,
      error: error.message,
    });
    return null;
  }

  return data as AttributionRow;
}

async function resolveAttribution(
  supabase: SupabaseClient,
  userId: string | null,
  event: ParsedRevenueCatWebhook,
): Promise<AttributionRow | null> {
  if (!userId) return null;
  const existing = await getExistingAttribution(supabase, userId);
  if (existing) return existing;
  return await createAttributionFromOfferCode(supabase, userId, event);
}

async function storeRevenueCatEvent(
  supabase: SupabaseClient,
  event: ParsedRevenueCatWebhook,
  rawPayload: unknown,
) {
  const { error } = await supabase.from("revenuecat_events").upsert({
    id: event.eventId,
    event_type: event.type,
    app_user_id: event.appUserId,
    original_app_user_id: event.originalAppUserId,
    aliases: event.aliases,
    transaction_id: event.transactionId,
    original_transaction_id: event.originalTransactionId,
    product_id: event.productId,
    entitlement_ids: event.entitlementIds,
    store: event.store,
    environment: event.environment,
    period_type: event.periodType,
    offer_code: event.offerCode,
    renewal_number: event.renewalNumber,
    currency: event.currency,
    price_usd: event.priceUsd,
    price_in_purchased_currency: event.priceInPurchasedCurrency,
    tax_percentage: event.taxPercentage,
    commission_percentage: event.commissionPercentage,
    event_timestamp_at: event.eventTimestampAt,
    purchased_at: event.purchasedAt,
    expiration_at: event.expirationAt,
    raw_event: sanitizeRevenueCatWebhookPayload(rawPayload),
    processing_status: "received",
    processing_error: null,
  }, { onConflict: "id" });

  if (error) {
    throw new Error(`Could not store RevenueCat event: ${error.message}`);
  }
}

async function upsertSubscriptionPeriod(
  supabase: SupabaseClient,
  userId: string | null,
  event: ParsedRevenueCatWebhook,
): Promise<SubscriptionPeriodRow | null> {
  if (!event.transactionId || !event.type || !event.eventId) return null;

  const row = {
    user_id: userId,
    revenuecat_event_id: event.eventId,
    transaction_id: event.transactionId,
    original_transaction_id: event.originalTransactionId,
    product_id: event.productId,
    store: event.store,
    environment: event.environment,
    event_type: event.type,
    period_type: event.periodType,
    renewal_number: event.renewalNumber,
    offer_code: event.offerCode,
    period_start_at: event.purchasedAt,
    period_end_at: event.expirationAt,
    currency: event.currency,
    gross_revenue_usd: event.priceUsd,
    tax_percentage: event.taxPercentage,
    store_commission_percentage: event.commissionPercentage,
  };

  const { data, error } = await supabase
    .from("subscription_periods")
    .upsert(row, { onConflict: "revenuecat_event_id" })
    .select("id, net_proceeds_usd")
    .single();

  if (!error) return data as SubscriptionPeriodRow;
  if (dbErrorCode(error) !== "23505") {
    throw new Error(`Could not store subscription period: ${error.message}`);
  }

  const { data: existing, error: lookupError } = await supabase
    .from("subscription_periods")
    .select("id, net_proceeds_usd")
    .eq("transaction_id", event.transactionId)
    .eq("event_type", event.type)
    .maybeSingle();
  if (lookupError) {
    throw new Error(
      `Could not load subscription period: ${lookupError.message}`,
    );
  }
  return existing as SubscriptionPeriodRow | null;
}

async function nextEarningMonth(
  supabase: SupabaseClient,
  attribution: AttributionRow,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("creator_commission_ledger")
    .select("id")
    .eq("user_attribution_id", attribution.id)
    .is("reversal_of", null)
    .neq("status", "void");
  if (error) {
    throw new Error(`Could not count creator earnings: ${error.message}`);
  }
  const next = (data?.length ?? 0) + 1;
  return next <= attribution.commission_month_cap_snapshot ? next : null;
}

async function createPositiveLedgerRow(
  supabase: SupabaseClient,
  userId: string | null,
  event: ParsedRevenueCatWebhook,
  attribution: AttributionRow | null,
  period: SubscriptionPeriodRow | null,
): Promise<"created" | "duplicate" | "capped" | "skipped"> {
  if (
    !attribution || !period || !userId || !event.eventId ||
    !event.transactionId || !event.type
  ) {
    return "skipped";
  }
  if (!isPaidRevenueEvent(event)) return "skipped";

  const earningMonth = await nextEarningMonth(supabase, attribution);
  if (earningMonth == null) return "capped";

  const { error } = await supabase.from("creator_commission_ledger").insert({
    creator_id: attribution.creator_id,
    creator_code_id: attribution.creator_code_id,
    user_attribution_id: attribution.id,
    user_id: userId,
    subscription_period_id: period.id,
    revenuecat_event_id: event.eventId,
    transaction_id: event.transactionId,
    original_transaction_id: event.originalTransactionId,
    product_id: event.productId,
    event_type: event.type,
    earning_month_number: earningMonth,
    commission_rate_bps: attribution.commission_rate_bps_snapshot,
    gross_revenue_usd: event.priceUsd,
    tax_percentage: event.taxPercentage,
    store_commission_percentage: event.commissionPercentage,
    net_proceeds_usd: period.net_proceeds_usd ??
      calculateNetProceedsUsd({
        priceUsd: event.priceUsd,
        taxPercentage: event.taxPercentage,
        commissionPercentage: event.commissionPercentage,
      }),
    currency: "USD",
    status: "pending",
  });

  if (!error) return "created";
  if (dbErrorCode(error) === "23505") return "duplicate";
  throw new Error(`Could not create commission ledger row: ${error.message}`);
}

async function findLedgerToReverse(
  supabase: SupabaseClient,
  attribution: AttributionRow,
  event: ParsedRevenueCatWebhook,
): Promise<LedgerRow | null> {
  let query = supabase
    .from("creator_commission_ledger")
    .select(
      "id, creator_id, creator_code_id, user_attribution_id, user_id, subscription_period_id, revenuecat_event_id, transaction_id, original_transaction_id, product_id, event_type, earning_month_number, commission_rate_bps, gross_revenue_usd, tax_percentage, store_commission_percentage, net_proceeds_usd",
    )
    .eq("user_attribution_id", attribution.id)
    .is("reversal_of", null)
    .neq("status", "void")
    .order("created_at", { ascending: false })
    .limit(1);

  if (event.transactionId) {
    query = query.eq("transaction_id", event.transactionId);
  } else if (event.originalTransactionId) {
    query = query.eq("original_transaction_id", event.originalTransactionId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(`Could not find ledger reversal target: ${error.message}`);
  }
  return data as LedgerRow | null;
}

async function createReversalLedgerRow(
  supabase: SupabaseClient,
  userId: string | null,
  event: ParsedRevenueCatWebhook,
  attribution: AttributionRow | null,
  period: SubscriptionPeriodRow | null,
): Promise<"created" | "duplicate" | "skipped"> {
  if (
    !attribution || !period || !userId || !event.eventId ||
    !event.transactionId || !event.type
  ) {
    return "skipped";
  }
  if (!isRefundRevenueEvent(event)) return "skipped";

  const original = await findLedgerToReverse(supabase, attribution, event);
  if (!original) return "skipped";

  const { data: existing, error: existingError } = await supabase
    .from("creator_commission_ledger")
    .select("id")
    .eq("reversal_of", original.id)
    .eq("revenuecat_event_id", event.eventId)
    .maybeSingle();
  if (existingError) {
    throw new Error(
      `Could not check reversal ledger row: ${existingError.message}`,
    );
  }
  if (existing) return "duplicate";

  const refundGross = event.priceUsd != null && event.priceUsd < 0
    ? event.priceUsd
    : original.gross_revenue_usd == null
    ? null
    : -Math.abs(original.gross_revenue_usd);
  const refundNet = event.priceUsd != null && event.priceUsd < 0
    ? period.net_proceeds_usd
    : original.net_proceeds_usd == null
    ? null
    : -Math.abs(original.net_proceeds_usd);

  const { error } = await supabase.from("creator_commission_ledger").insert({
    creator_id: original.creator_id,
    creator_code_id: original.creator_code_id,
    user_attribution_id: original.user_attribution_id,
    user_id: userId,
    subscription_period_id: period.id,
    revenuecat_event_id: event.eventId,
    transaction_id: event.transactionId,
    original_transaction_id: event.originalTransactionId,
    product_id: event.productId ?? original.product_id,
    event_type: event.type,
    earning_month_number: original.earning_month_number,
    commission_rate_bps: original.commission_rate_bps,
    gross_revenue_usd: refundGross,
    tax_percentage: event.taxPercentage ?? original.tax_percentage,
    store_commission_percentage: event.commissionPercentage ??
      original.store_commission_percentage,
    net_proceeds_usd: refundNet,
    currency: "USD",
    status: "reversed",
    reversal_of: original.id,
    notes: "RevenueCat refund/cancellation reversal.",
  });

  if (!error) return "created";
  if (dbErrorCode(error) === "23505") return "duplicate";
  throw new Error(`Could not create reversal ledger row: ${error.message}`);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const auth = requestHasValidSecret(req);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const event = parseRevenueCatWebhookPayload(payload);
  if (!event?.eventId || !event.type) {
    return json({ error: "invalid_revenuecat_event" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "supabase_service_role_missing" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    await storeRevenueCatEvent(supabase, event, payload);

    const userId = await findProfileId(supabase, event);
    const attribution = await resolveAttribution(supabase, userId, event);
    const shouldStorePeriod = Boolean(
      event.transactionId &&
        (isPaidRevenueEvent(event) || isRefundRevenueEvent(event)),
    );
    const period = shouldStorePeriod
      ? await upsertSubscriptionPeriod(supabase, userId, event)
      : null;

    const positiveLedgerAction = await createPositiveLedgerRow(
      supabase,
      userId,
      event,
      attribution,
      period,
    );
    const reversalLedgerAction = await createReversalLedgerRow(
      supabase,
      userId,
      event,
      attribution,
      period,
    );

    const status =
      userId || attribution || period || positiveLedgerAction !== "skipped" ||
        reversalLedgerAction !== "skipped"
        ? "processed"
        : "ignored";
    await markEventStatus(supabase, event.eventId, status);

    return json({
      ok: true,
      event_id: event.eventId,
      event_type: event.type,
      processing_status: status,
      user_id: userId,
      attribution_id: attribution?.id ?? null,
      subscription_period_id: period?.id ?? null,
      positive_ledger_action: positiveLedgerAction,
      reversal_ledger_action: reversalLedgerAction,
    });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : "Unknown webhook processing error.";
    console.error("[revenuecat-webhook] processing failed", {
      eventId: event.eventId,
      eventType: event.type,
      message,
    });
    await markEventStatus(
      supabase,
      event.eventId,
      "failed",
      cleanString(message, 1000),
    );
    return json({ error: "webhook_processing_failed", message }, 500);
  }
});
