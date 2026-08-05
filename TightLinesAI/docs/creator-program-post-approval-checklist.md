# Creator Program Post-Approval Checklist

> Archived August 5, 2026. The creator program is disabled and is not part of
> the current app release. Do not execute this checklist unless the product
> owner explicitly reactivates the program and completes a new privacy review.

Use this after Apple approves the first FinFindr build and the Angler
subscriptions are Ready for Distribution.

## Do Not Manually Release Until

- App Store Connect shows the approved version in `Pending Developer Release`.
- The app release option is still `Manually release this version`.
- D-U-N-S confirmation is received or intentionally deferred for launch.
- If D-U-N-S is ready, the Apple Developer Support request to convert the
  Individual membership to the `FinFindr LLC` Organization membership has been
  submitted and tracked.
- Seller/entity, Paid Apps Agreement, tax, banking, DSA/trader info, and public
  support/contact information have been rechecked after any Apple account
  conversion.
- Public Terms, Privacy, Safety, and Support pages on `https://finfindr.app`
  are deployed with the latest `FinFindr LLC`, analytics, subscription,
  restore, and creator-code language. Manual Release only holds the App Store
  binary; it does not publish website/legal-site edits.
- App Store Connect App Privacy answers have been rechecked against the shipped
  build, especially PostHog analytics, creator attribution, purchase data, and
  usage data.
- RevenueCat, Supabase, and PostHog production settings are confirmed.
- A final production/TestFlight smoke test passes on a clean install.

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
- Confirm the App Store product page still shows the correct Privacy Policy URL,
  Support URL, copyright, app availability, subscription availability, and
  manual-release status.
- Re-open App Privacy and confirm the labels still match the production build:
  - Product interaction / usage analytics are collected and linked to the user.
  - Purchases and subscription status are collected and linked to the user.
  - Identifiers/account IDs are collected and linked to the user.
  - Add `Device ID` under Identifiers if PostHog or any analytics SDK stores an
    anonymous/device-level distinct ID in production.
  - Creator/referral code attribution is covered under purchase/usage/other
    app-functionality data as applicable.
  - Only keep any `Usage Data` under `Data Not Linked to You` if that data is
    truly anonymous and is not later connected to the signed-in FinFindr user.
  - No tracking is declared unless FinFindr starts using data to track users
    across other companies' apps or websites for advertising/measurement.

## Public Legal Site

- Open these URLs in a private/incognito browser and verify they show the latest
  post-PostHog / creator-code copy before manual release:
  - `https://finfindr.app/privacy`
  - `https://finfindr.app/terms`
  - `https://finfindr.app/safety`
  - `https://finfindr.app/support`
- Confirm the Privacy page names PostHog and product analytics.
- Confirm the Privacy page covers creator/referral/offer-code attribution.
- Confirm the Terms page covers creator/referral/promotional/offer-code rules.
- If the live pages do not show the latest copy, deploy/publish the `legal-site`
  changes before manual release.

## Apple Account / LLC Conversion Ticket

- Wait for D-U-N-S confirmation before expecting the conversion to complete.
- Submit the Apple Developer Support request:
  - Request: convert Individual Apple Developer Program membership to
    Organization.
  - Legal entity: `FinFindr LLC`.
  - Include D-U-N-S number, EIN confirmation, Sunbiz filing/document number,
    contact name, phone, and email.
  - Mention the app is approved but held on Manual Release pending seller/entity
    reconciliation.
- Save the Apple case/ticket number in this checklist.
- Do not publicly release until the case is resolved or you intentionally decide
  to launch under the individual seller name.
- After conversion, re-check:
  - Apple Developer account name.
  - App Store Connect seller name.
  - Agreements, Tax, and Banking.
  - DSA/trader compliance if expanding beyond U.S.-only availability.
  - App Store review notes and public legal pages.

## Supabase

- Confirm all creator-program migrations are applied in production.
- Confirm RLS/service-role restrictions are still in place for creator,
  attribution, RevenueCat event, subscription period, payout, and ledger tables.
- Deploy `creator-code-attribution`.
- Deploy `revenuecat-webhook` with JWT verification disabled.
- Confirm production Edge Function secrets are set:
  - `REVENUECAT_WEBHOOK_AUTH_TOKEN`.
  - Existing Supabase service-role secrets required by Edge Functions.
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
- Confirm the webhook Authorization header exactly matches the Supabase secret:
  `Bearer <REVENUECAT_WEBHOOK_AUTH_TOKEN>`.
- Confirm sandbox and production environments are both enabled only when you are
  ready to receive both.
- Confirm a real sandbox purchase creates:
  - one `revenuecat_events` row
  - one `subscription_periods` row
  - one `user_attributions` row if an offer code was used
  - one pending `creator_commission_ledger` row for paid purchases
- Confirm refund/cancellation events create a reversal ledger row before any
  creator payouts are approved.

## PostHog / Analytics

- Confirm the production EAS environment includes:
  - `EXPO_PUBLIC_POSTHOG_API_KEY`
  - `EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`
- Confirm PostHog receives only the intended explicit events:
  - app open
  - screen view
  - paywall opened/closed/failed
  - purchase started/completed/failed
  - restore started/completed/failed
  - subscription tier synced
- Keep PostHog session replay disabled unless Privacy Policy, App Store privacy
  labels, and any required user consent are reviewed again.
- Keep touch autocapture disabled unless Privacy Policy and App Store privacy
  labels are reviewed again.
- Confirm no PostHog data is used for third-party advertising or cross-app/site
  tracking unless the app adds ATT and updates App Store privacy answers.

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
