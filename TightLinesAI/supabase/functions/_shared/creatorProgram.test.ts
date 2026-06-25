import { assertEquals } from "jsr:@std/assert";
import {
  attributionQualifiesForCommission,
  buildCreatorReferralWebUrl,
  calculateCreatorCommissionUsd,
  calculateNetProceedsUsd,
  candidateRevenueCatUserIds,
  COMMISSION_MONTH_CAP_OPTIONS,
  countActiveCreatorEarningMonths,
  FINGERPRINT_MATCH_WINDOW_HOURS,
  isReferralClickWithinAttributionWindow,
  isReferralClickWithinFingerprintWindow,
  normalizeCommissionMonthCap,
  normalizeCreatorCode,
  nextCreatorEarningMonthNumber,
  pickReferralClickForInstallyMatch,
  parseCreatorReferralPayload,
  parseRevenueCatWebhookPayload,
  referralClickQualifiesForAttribution,
  REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS,
  sanitizeRevenueCatWebhookPayload,
} from "./creatorProgram.ts";

Deno.test("creator program: normalizes creator codes for matching", () => {
  assertEquals(normalizeCreatorCode(" fin-findr_10 "), "FINFINDR10");
  assertEquals(normalizeCreatorCode("test 10"), "TEST10");
  assertEquals(normalizeCreatorCode(""), null);
});

Deno.test("creator program: calculates net proceeds and creator commission", () => {
  const net = calculateNetProceedsUsd({
    priceUsd: 7.99,
    taxPercentage: 0,
    commissionPercentage: 0.3,
  });
  assertEquals(net, 5.593);
  assertEquals(
    calculateCreatorCommissionUsd({
      netProceedsUsd: net,
      commissionRateBps: 2500,
    }),
    1.3983,
  );
});

Deno.test("creator program: referral click attribution window is 60 days", () => {
  assertEquals(REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS, 60);
  const now = Date.parse("2026-06-15T12:00:00.000Z");
  assertEquals(
    isReferralClickWithinAttributionWindow("2026-05-01T12:00:00.000Z", now),
    true,
  );
  assertEquals(
    isReferralClickWithinAttributionWindow("2026-04-15T11:59:59.000Z", now),
    false,
  );
});

Deno.test("creator program: attribution allows install-matched clicks past click window", () => {
  const now = Date.parse("2026-06-15T12:00:00.000Z");
  assertEquals(
    referralClickQualifiesForAttribution({
      createdAt: "2026-01-01T12:00:00.000Z",
      appOpenedAt: "2026-01-02T08:00:00.000Z",
      nowMs: now,
    }),
    true,
  );
  assertEquals(
    referralClickQualifiesForAttribution({
      createdAt: "2026-01-01T12:00:00.000Z",
      nowMs: now,
    }),
    false,
  );
});

Deno.test("creator program: commission month cap normalizes to 12 or 24", () => {
  assertEquals(COMMISSION_MONTH_CAP_OPTIONS, [12, 24]);
  assertEquals(normalizeCommissionMonthCap(24), 24);
  assertEquals(normalizeCommissionMonthCap("24"), 24);
  assertEquals(normalizeCommissionMonthCap(18), 12);
  assertEquals(normalizeCommissionMonthCap(null), 12);
});

Deno.test("creator program: earning months count only paid non-reversed periods", () => {
  const rows = [
    { id: "a", status: "paid", reversal_of: null },
    { id: "b", status: "pending", reversal_of: null },
    { id: "c", status: "reversed", reversal_of: null },
  ];
  assertEquals(countActiveCreatorEarningMonths(rows, ["b"]), 1);
  assertEquals(countActiveCreatorEarningMonths(rows, []), 2);
});

Deno.test("creator program: churn gap then resubscribe continues month counter", () => {
  assertEquals(nextCreatorEarningMonthNumber(1, 12), 2);
  assertEquals(nextCreatorEarningMonthNumber(1, 24), 2);
  assertEquals(nextCreatorEarningMonthNumber(12, 12), null);
  assertEquals(nextCreatorEarningMonthNumber(23, 24), 24);
  assertEquals(nextCreatorEarningMonthNumber(24, 24), null);
});

Deno.test("creator program: commission requires tracked creator referral", () => {
  assertEquals(
    attributionQualifiesForCommission({
      attribution_source: "direct_link",
      referral_click_id: "11111111-1111-4111-8111-111111111111",
    }),
    true,
  );
  assertEquals(
    attributionQualifiesForCommission({
      attribution_source: "direct_link",
      referral_click_id: null,
    }),
    false,
  );
  assertEquals(
    attributionQualifiesForCommission({
      attribution_source: "instally",
      referral_click_id: null,
      instally_click_id: "clk_123",
    }),
    true,
  );
  assertEquals(
    attributionQualifiesForCommission({
      attribution_source: "revenuecat_offer_code",
      referral_click_id: null,
    }),
    false,
  );
  assertEquals(
    attributionQualifiesForCommission({
      attribution_source: "manual_admin",
      referral_click_id: null,
    }),
    true,
  );
});

Deno.test("creator program: picks referral click for instally install match", () => {
  const nowMs = Date.parse("2026-06-15T12:00:00.000Z");
  const creatorId = "11111111-1111-4111-8111-111111111111";
  const installyCreators = new Set([creatorId]);
  const attributed = new Set<string>();

  const picked = pickReferralClickForInstallyMatch({
    installyClickId: "clk_abc",
    installyEnabledCreatorIds: installyCreators,
    attributedClickIds: attributed,
    nowMs,
    candidates: [
      {
        id: "click-1",
        creator_id: creatorId,
        code: "FIN10",
        created_at: "2026-06-15T11:50:00.000Z",
        app_opened_at: null,
        instally_click_id: null,
      },
    ],
  });

  assertEquals(picked?.id, "click-1");

  const alreadyLinked = pickReferralClickForInstallyMatch({
    installyClickId: "clk_existing",
    installyEnabledCreatorIds: installyCreators,
    attributedClickIds: attributed,
    nowMs,
    candidates: [
      {
        id: "click-linked",
        creator_id: creatorId,
        code: "FIN10",
        created_at: "2026-06-15T11:00:00.000Z",
        app_opened_at: "2026-06-15T11:05:00.000Z",
        instally_click_id: "clk_existing",
      },
    ],
  });
  assertEquals(alreadyLinked?.id, "click-linked");
});

Deno.test("creator program: parses RevenueCat webhook payloads", () => {
  const parsed = parseRevenueCatWebhookPayload({
    api_version: "1.0",
    event: {
      id: "evt_123",
      type: "INITIAL_PURCHASE",
      app_user_id: "11111111-1111-4111-8111-111111111111",
      original_app_user_id: "22222222-2222-4222-8222-222222222222",
      aliases: ["33333333-3333-4333-8333-333333333333"],
      transaction_id: "tx_123",
      product_id: "finfindr_angler_monthly",
      entitlement_ids: ["angler"],
      store: "APP_STORE",
      environment: "SANDBOX",
      period_type: "NORMAL",
      offer_code: "test-10",
      renewal_number: 1,
      currency: "USD",
      price: 7.99,
      price_in_purchased_currency: 7.99,
      tax_percentage: 0,
      commission_percentage: 0.3,
      event_timestamp_ms: 1_800_000_000_000,
      purchased_at_ms: 1_800_000_000_000,
      expiration_at_ms: 1_802_592_000_000,
    },
  });

  assertEquals(parsed?.eventId, "evt_123");
  assertEquals(parsed?.offerCode, "TEST10");
  assertEquals(parsed?.eventTimestampAt, "2027-01-15T08:00:00.000Z");
  assertEquals(parsed?.entitlementIds, ["angler"]);
  assertEquals(candidateRevenueCatUserIds(parsed!), [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
    "33333333-3333-4333-8333-333333333333",
  ]);
});

Deno.test("creator program: parses creator referral web and app links", () => {
  const click = "11111111-1111-4111-8111-111111111111";
  assertEquals(
    parseCreatorReferralPayload(
      "https://finfindr.app/r?click=" + click + "&code=FIN10",
    ),
    { code: "FIN10", referralClickToken: click },
  );
  assertEquals(
    parseCreatorReferralPayload(
      "finfindr://creator?code=FIN10&click=" + click,
    ),
    { code: "FIN10", referralClickToken: click },
  );
  assertEquals(parseCreatorReferralPayload("https://example.com/r"), null);
});

Deno.test("creator program: builds referral web URL for clipboard pass-through", () => {
  const click = "22222222-2222-4222-8222-222222222222";
  assertEquals(
    buildCreatorReferralWebUrl("fin10", click),
    "https://finfindr.app/r?click=" + encodeURIComponent(click) + "&code=FIN10",
  );
});

Deno.test("creator program: fingerprint match window is 72 hours", () => {
  assertEquals(FINGERPRINT_MATCH_WINDOW_HOURS, 72);
  const now = Date.parse("2026-06-15T12:00:00.000Z");
  assertEquals(
    isReferralClickWithinFingerprintWindow("2026-06-14T12:00:00.000Z", now),
    true,
  );
  assertEquals(
    isReferralClickWithinFingerprintWindow("2026-06-12T11:59:59.000Z", now),
    false,
  );
});

Deno.test("creator program: redacts sensitive RevenueCat raw webhook fields", () => {
  assertEquals(
    sanitizeRevenueCatWebhookPayload({
      api_version: "1.0",
      event: {
        id: "evt_123",
        subscriber_attributes: {
          "$email": { value: "person@example.com" },
        },
        metadata: { internal_note: "private" },
        product_id: "finfindr_angler_monthly",
      },
    }),
    {
      api_version: "1.0",
      event: {
        id: "evt_123",
        subscriber_attributes: "[redacted]",
        metadata: "[redacted]",
        product_id: "finfindr_angler_monthly",
      },
    },
  );
});
