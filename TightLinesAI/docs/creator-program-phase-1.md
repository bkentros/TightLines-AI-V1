# FinFindr Creator Program Phase 1

> Archived August 5, 2026. The creator program is disabled and is not part of
> the current app release. This document is retained only as historical design
> context.

This file locks the first creator-program rules before we wire the public
landing pages, RevenueCat webhook, admin dashboard, and creator dashboard.

## Commercial Rules

- Default creator commission is 25% of net subscription proceeds.
- Maximum creator commission is 35% of net subscription proceeds.
- Commission rates are stored as basis points:
  - 25% = `2500`
  - 35% = `3500`
- A creator can earn for up to 12 eligible paid subscription periods from an
  attributed subscriber.
- Commission is calculated from RevenueCat webhook economics:
  - `net_proceeds = price * (1 - tax_percentage - commission_percentage)`
  - `creator_commission = net_proceeds * commission_rate_bps / 10000`
- Free trials and zero-price transactions do not create positive commission.
- Refunds or negative transactions must create reversals against the ledger,
  not silent edits to paid history.

## User Discount Rules

The creator discount must be real App Store billing, not a FinFindr-only label.

- Standard creator offer is 10% off for the first 3 months.
- The App Store Connect offer type must be `Pay as you go`.
- The offer duration must be 3 months.
- The discounted Apple price point should be the closest available price to
  10% off the normal monthly Angler subscription.
- The offer should renew to the normal subscription price after the offer
  period.
- Do not stack the creator offer with another introductory offer unless we
  intentionally decide to support that later.
- Each creator code in Supabase must mirror an actual App Store custom offer
  code before it is marked active.

## Attribution Rules

- Codes beat links. If a user redeems a creator code, that code is the strongest
  attribution signal.
- Direct creator links are useful for click/signup attribution, but App Store
  code redemption is the billing source of truth for the discount.
- A subscriber should have one primary active creator attribution.
- The creator commission rate is snapshotted at attribution/ledger time so
  historical payouts do not change if the creator's future rate changes.

## First Implementation Scope

Phase 1 creates the database foundation only:

- creators
- creator codes
- referral clicks
- user attribution
- raw RevenueCat webhook events
- subscription period records
- creator commission ledger
- payout batches for future manual payout tracking

The tables are service-role only for now. Public pages, app attribution capture,
RevenueCat webhook processing, admin views, and creator-facing views come next.
