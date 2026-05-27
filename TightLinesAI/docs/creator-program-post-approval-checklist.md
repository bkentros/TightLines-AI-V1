# Creator Program Post-Approval Checklist

Use this after Apple approves the first FinFindr build and the Angler
subscriptions are Ready for Distribution.

## App Store Connect

- Confirm `finfindr_angler_monthly` and `finfindr_angler_annual` are approved.
- Confirm the creator offer remains:
  - Reference name: `Creator 10 Off 3 Months`
  - Product: `finfindr_angler_monthly`
  - Type: pay as you go
  - Duration: 3 months
  - Intro offers: no stacking
  - Auto-renew after offer: yes
- Generate custom offer codes for each creator.
- Save each production redemption URL from App Store Connect.
- Do a sandbox redemption test with one real code before sharing publicly.

## Supabase

- Replace the placeholder `TEST10` row or create a new `creator_codes` row for
  each real App Store custom code.
- Set each launch-ready code to `is_active = true`.
- Confirm each creator commission rate is correct:
  - Default: `2500` basis points, or 25%.
  - Maximum: `3500` basis points, or 35%.
- Confirm each creator keeps `commission_month_cap = 12`.
- Confirm RevenueCat test and sandbox purchase events are still arriving in
  `revenuecat_events`.

Example activation query:

```sql
update public.creator_codes
set code = public.normalize_creator_code('REALCODE10'),
    app_store_redemption_url =
      'https://apps.apple.com/redeem?ctx=offercodes&id=6769178136&code=REALCODE10',
    is_active = true,
    updated_at = now()
where code = 'TEST10';
```

## RevenueCat

- Confirm the webhook remains active:
  - URL: `https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/revenuecat-webhook`
  - Environment: both Production and Sandbox
  - App: FinFindr App Store app
  - Events: all events
- Confirm a real sandbox purchase creates:
  - one `revenuecat_events` row
  - one `subscription_periods` row
  - one `user_attributions` row if an offer code was used
  - one pending `creator_commission_ledger` row for paid purchases

## Launch Operations

- Give each creator their App Store redemption link.
- Keep a private record of each creator's rate, code, and payout method.
- Do not promise payout until a ledger row has passed the refund buffer.
- Review pending ledger rows at least monthly.
- Approve payout rows only after checking refunds/cancellations.
- Mark paid rows with payout date and batch once money is sent.

## First Public Creator Test

- Create one internal creator code.
- Redeem it on a sandbox or low-risk test account.
- Confirm the first paid transaction appears in the ledger.
- Confirm the creator commission amount equals:

```text
price * (1 - tax_percentage - commission_percentage) * creator_rate
```

- Only then start issuing codes to outside creators.
