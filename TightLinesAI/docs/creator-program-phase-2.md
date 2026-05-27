# FinFindr Creator Program Phase 2

Phase 2 wires the creator-program tables into real event flow while Apple is
still blocking custom code generation until the app/subscription is approved.

## What Exists Now

- `revenuecat-webhook` stores every RevenueCat webhook event.
- Paid subscription events create `subscription_periods`.
- If the RevenueCat event includes an `offer_code`, the webhook can create the
  user's creator attribution from `creator_codes`.
- Positive paid periods create pending `creator_commission_ledger` rows.
- Refund-like events can create negative reversal rows against prior commission.
- `creator-code-attribution` lets a signed-in user submit a creator code from
  the app or a future landing page.
- `TEST10` is seeded as an inactive placeholder code for launch testing.

## Apple Offer Code State

App Store Connect currently blocks custom code creation until the subscription
is approved and the app is Ready for Distribution. Until then:

- Keep seeded `TEST10` inactive.
- Do not show it publicly as a working discount.
- The webhook can still process real offer codes later without an app update.
- Once Apple allows custom codes, create the actual code and update/insert the
  matching `creator_codes` row with `is_active = true`.

The offer you created should remain:

- Reference name: `Creator 10 Off 3 Months`
- Product: `finfindr_angler_monthly`
- Billing mode: pay as you go
- Duration: 3 months
- Introductory offers: no stacking
- Auto-renew after offer: yes
- App ID: `6769178136`

## Required Secrets

Set these in Supabase Edge Function secrets before deploying the webhook:

```sh
npx supabase secrets set REVENUECAT_WEBHOOK_AUTH_TOKEN="replace-with-a-long-random-secret"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must also be present in the Edge
Function environment, as they are for the existing server-side functions.

## Deployment

Deploy the RevenueCat webhook without Supabase JWT verification because
RevenueCat is not a Supabase user:

```sh
npx supabase functions deploy revenuecat-webhook --no-verify-jwt
```

Deploy the authenticated creator-code endpoint normally:

```sh
npx supabase functions deploy creator-code-attribution
```

RevenueCat webhook URL:

```text
https://<your-supabase-project-ref>.supabase.co/functions/v1/revenuecat-webhook
```

RevenueCat authorization header:

```text
Bearer <same value as REVENUECAT_WEBHOOK_AUTH_TOKEN>
```

## RevenueCat Dashboard Setup

In RevenueCat, create a Webhook integration:

- URL: the Supabase function URL above.
- Authorization header: `Bearer <REVENUECAT_WEBHOOK_AUTH_TOKEN>`.
- Events: include at least `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`,
  `NON_RENEWING_PURCHASE`, and `REFUND_REVERSED`.
- Environment: use sandbox while testing, production when the app is live.

## First Live Creator Code Activation

After Apple lets you generate custom codes, create the actual creator code in
App Store Connect, then mirror it in Supabase. Example for replacing `TEST10`:

```sql
update public.creator_codes
set code = public.normalize_creator_code('REALCODE10'),
    app_store_redemption_url =
      'https://apps.apple.com/redeem?ctx=offercodes&id=6769178136&code=REALCODE10',
    is_active = true,
    updated_at = now()
where code = 'TEST10';
```

For additional creators, insert a new row in `creators` with
`commission_rate_bps` between `2500` and `3500`, then insert a matching
`creator_codes` row for the App Store code.

## Commission Rule

Ledger rows use:

```text
net_proceeds = price * (1 - tax_percentage - commission_percentage)
creator_commission = net_proceeds * commission_rate_bps / 10000
```

The rate is snapshotted when attribution is created, so changing a creator's
future rate does not rewrite past subscribers.
