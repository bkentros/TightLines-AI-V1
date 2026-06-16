# Creator program readiness

Living checklist for launching FinFindr creator / affiliate partnerships.

**Status:** Phase 0–2 implementation in progress on `release/app-store-v1`.

---

## What each creator gets

| Asset | Example |
|---|---|
| Tracked link | `https://finfindr.app/c/their-slug` |
| Creator code | `JOHN10` (App Store offer code) |
| User discount | 10% off first 3 months (real App Store billing) |
| Your payout basis | % of **net** proceeds after Apple/tax (per-creator rate, up to 12 paid months) |

---

## Build status

| Item | Status |
|---|---|
| DB schema (creators, codes, clicks, attributions, ledger) | ✅ Shipped (migrations) |
| Commission rate 20–50% per creator | ✅ Migration `20260615220000_widen_creator_commission_rate_cap.sql` |
| `revenuecat-webhook` (paid events + refund reversals) | ✅ Exists — verify deployed |
| `creator-code-attribution` (silent deep-link attribution) | ✅ Exists — verify deployed |
| `creator-referral-click` (landing click logging) | ✅ New — deploy with `--no-verify-jwt` |
| Creator landing page `finfindr.app/c/{slug}` | ✅ Live — redeploy after copy updates |
| In-app Settings code entry | ❌ Removed — link + App Store redeem only |
| Creator deep link `finfindr://creator?code=&click=` | ✅ Silent attribution only (no UI) |
| Creator dashboard (self-serve stats) | ⬜ Planned |
| W-9 / 1099 / contracts | ⬜ Before first payout |

---

## Your action items (in order)

### 1. Supabase — apply migration + deploy functions

```bash
cd TightLinesAI
npx supabase db push
npx supabase functions deploy creator-referral-click --no-verify-jwt
npx supabase functions deploy creator-code-attribution
npx supabase functions deploy revenuecat-webhook --no-verify-jwt
```

Confirm secrets exist:

- `REVENUECAT_WEBHOOK_AUTH_TOKEN`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (auto-injected)

Optional: `CREATOR_REFERRAL_HASH_PEPPER` (defaults to a static v1 pepper if unset).

### 2. RevenueCat — confirm webhook

- URL: `https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/revenuecat-webhook`
- Authorization: `Bearer <REVENUECAT_WEBHOOK_AUTH_TOKEN>`
- Sandbox + Production enabled when ready

### 3. Cloudflare Pages — deploy legal-site + env var

Deploy `legal-site/` (same flow as privacy/terms).

In Cloudflare Pages → Settings → Environment variables, add:

| Name | Value |
|---|---|
| `SUPABASE_ANON_KEY` | Same as `EXPO_PUBLIC_SUPABASE_ANON_KEY` |

Test: `https://finfindr.app/c/launch-test-creator` (seed slug — code inactive until App Store code is live).

### 4. App Store Connect — create real offer codes

For each creator:

1. Generate custom offer code (10% off, 3 months, pay-as-you-go, monthly Angler).
2. Insert/update `creators` + `creator_codes` in Supabase with `is_active = true` and redemption URL.

Example SQL after creating `JOHN10` in App Store Connect:

```sql
insert into public.creators (display_name, slug, commission_rate_bps, commission_month_cap, status, email)
values ('John Angler', 'john-angler', 5000, 12, 'active', 'john@example.com')
on conflict (slug) do update
  set display_name = excluded.display_name,
      commission_rate_bps = excluded.commission_rate_bps,
      email = excluded.email,
      updated_at = now();

insert into public.creator_codes (
  creator_id, code, subscription_product_id, app_store_offer_reference_name,
  apple_app_id, app_store_redemption_url, is_active
)
select id, 'JOHN10', 'finfindr_angler_monthly', 'Creator 10 Off 3 Months',
  '6769178136',
  'https://apps.apple.com/redeem?ctx=offercodes&id=6769178136&code=JOHN10',
  true
from public.creators where slug = 'john-angler'
on conflict (code) do update
  set is_active = true,
      app_store_redemption_url = excluded.app_store_redemption_url,
      updated_at = now();
```

### 5. Sandbox pipeline test (before any real creator promotes)

1. Open `https://finfindr.app/c/<slug>` → page loads, click logged in `referral_clicks`.
2. Tap **Redeem in App Store** on the landing page (or use the redemption URL from Supabase).
3. Sandbox subscribe with offer code → ledger row in `creator_commission_ledger`.
4. Sandbox refund → reversal row.

Optional: tap **Open in FinFindr app** on the landing page after sign-in — silently ties the click token via deep link (no Settings UI).

### 6. App release

**No app update required** for the creator link flow — landing page + RevenueCat webhook handle attribution today. Ship client changes in the next build (1.0.3+) only if you want silent deep-link attribution in production.

---

## Admin payout SQL (run in Supabase SQL Editor)

**Per-creator summary:**

```sql
select
  c.display_name,
  c.slug,
  c.commission_rate_bps / 100.0 as commission_pct,
  (select count(*) from referral_clicks rc where rc.creator_id = c.id) as clicks,
  (select count(*) from user_attributions ua where ua.creator_id = c.id and ua.status = 'active') as attributed_users,
  coalesce((select sum(l.commission_amount_usd) from creator_commission_ledger l
    where l.creator_id = c.id and l.status not in ('void')), 0) as lifetime_earned_usd,
  coalesce((select sum(l.commission_amount_usd) from creator_commission_ledger l
    where l.creator_id = c.id and l.status = 'paid'), 0) as already_paid_usd,
  coalesce((select sum(l.commission_amount_usd) from creator_commission_ledger l
    where l.creator_id = c.id
      and l.status in ('pending', 'approved')
      and l.eligible_at <= now()), 0) as payable_now_usd
from creators c
where c.status = 'active'
order by payable_now_usd desc;
```

**Mark approved (after manual refund review):**

```sql
update creator_commission_ledger
set status = 'approved', approved_at = now()
where creator_id = (select id from creators where slug = 'john-angler')
  and status = 'pending'
  and eligible_at <= now();
```

**Mark paid (after Venmo/Zelle):**

```sql
insert into creator_payout_batches (label, status, paid_at)
values ('April 2026 payout', 'paid', now())
returning id;

-- use returned id:
update creator_commission_ledger
set status = 'paid', paid_at = now(), payout_batch_id = '<batch-uuid>'
where creator_id = (select id from creators where slug = 'john-angler')
  and status = 'approved';
```

---

## Payout rules (operational)

1. **Never pay from clicks alone** — only from `creator_commission_ledger`.
2. **30-day hold** — built into `eligible_at` on each row.
3. **Refunds** — reversal rows subtract automatically; pay net balance only.
4. **Manual payout** — Venmo/Zelle/bank until volume justifies automation.
5. **W-9 before first dollar** — 1099-NEC if $600+ paid in a calendar year.

---

## Related docs

- `creator-program-phase-1.md` — commercial rules
- `creator-program-phase-2.md` — webhook setup
- `creator-program-post-approval-checklist.md` — App Store go-live
