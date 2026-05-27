import { assertEquals } from "jsr:@std/assert";
import {
  buildAppStoreRedemptionUrl,
  calculateCreatorCommissionUsd,
  calculateNetProceedsUsd,
  candidateRevenueCatUserIds,
  normalizeCreatorCode,
  parseRevenueCatWebhookPayload,
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

Deno.test("creator program: builds App Store offer-code redemption URLs", () => {
  assertEquals(
    buildAppStoreRedemptionUrl({
      code: "TEST10",
      appleAppId: "6769178136",
    }),
    "https://apps.apple.com/redeem?ctx=offercodes&id=6769178136&code=TEST10",
  );
  assertEquals(
    buildAppStoreRedemptionUrl({
      code: "test-10",
      template:
        "https://apps.apple.com/redeem?ctx=offercodes&id=6769178136&code=CODE",
    }),
    "https://apps.apple.com/redeem?ctx=offercodes&id=6769178136&code=TEST10",
  );
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
