# Creator program — production readiness

Link-only creator affiliate program for FinFindr. Last updated: June 17, 2026.

---

## What each creator gets

| Asset | Example |
|---|---|
| Tracked link | `https://finfindr.app/c/their-slug` |
| Creator portal | `https://finfindr.app/creators/` |
| Commission | 20–50% of **net** proceeds after Apple/tax (per-creator rate) |
| Earning term | **12 or 24 paid billing periods** per referred user (snapshotted at sign-up) |

No App Store discount codes. Attribution is **click → install → sign-up → subscribe**.

---

## Build status

| Component | Status |
|---|---|
| DB schema + migrations | ✅ Applied |
| Click logging (`creator-referral-click`) | ✅ Deployed |
| Deferred install match (`creator-referral-resolve`) | ✅ Deployed |
| Sign-up attribution (`creator-code-attribution`) | ✅ Deployed |
| Commission ledger (`revenuecat-webhook`) | ✅ Deployed |
| Creator portal (funnel + ledger + admin onboard) | ✅ Built |
| Landing `/c/{slug}` + clipboard `/r` | ✅ Built — **deploy legal-site** |
| App deferred resolve (`expo-clipboard`) | ✅ Built — **new app build required** |
| Offer-code / redeem UX | ❌ Removed (link-only) |
| W-9 / 1099 / creator contracts | ⬜ Before first payout |

---

## How commission works

1. User clicks tracked link → server logs click.
2. Landing copies referral token → App Store (if app not installed).
3. First app open matches click (clipboard or fingerprint).
4. Sign-up creates `user_attributions` (first-time Angler only).
5. Each **paid** RevenueCat renewal creates a ledger row until the user's **12/24 period cap**.
6. Unsubscribed months pay **$0**. Resubscribe continues the period counter.
7. Refunds create reversal rows. Pay only from approved ledger past 30-day hold.

---

## Production checklist (your action items)

### 1. Deploy legal-site to Cloudflare Pages

Includes: privacy/terms updates, creator landing `/c/{slug}`, clipboard route `/r`, creator portal.

Env var required: `SUPABASE_ANON_KEY` (same as `EXPO_PUBLIC_SUPABASE_ANON_KEY`).

### 2. Build and ship the app

`expo-clipboard` is a native module — rebuild dev client / submit TestFlight or App Store build.

### 3. Verify RevenueCat webhook

- URL: `https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/revenuecat-webhook`
- Auth: `Bearer <REVENUECAT_WEBHOOK_AUTH_TOKEN>`
- Enable for Production when live

### 4. End-to-end test on a physical iPhone

**Path A — app not installed (most common):**

1. Open `https://finfindr.app/c/{slug}` in Safari.
2. Tap Get FinFindr → install from App Store.
3. Open app → allow/deny paste prompt.
4. Sign up (can be later same day).
5. Subscribe to Angler.
6. Confirm creator portal: click → app open → sign-up → paid sub → ledger row.

**Path B — app already installed:**

1. Tap creator link → deep link → subscribe flow.

### 5. Onboard the creator in admin portal

At `https://finfindr.app/creators/` (admin tab):

- Name, email, commission % (20–50), earning months (12 or 24).
- Share their tracked link only.

Deal changes apply to **new** attributions only.

### 6. Commit and push code

Large uncommitted creator diff on `release/app-store-v1` — commit before the creator posts.

### 7. Before first real payout

- Creator agreement / W-9
- Pay only from `creator_commission_ledger` (approved + past hold)
- Never pay from clicks alone

---

## Edge functions (reference)

```bash
cd TightLinesAI
npx supabase functions deploy creator-referral-click --no-verify-jwt
npx supabase functions deploy creator-referral-resolve --no-verify-jwt
npx supabase functions deploy creator-code-attribution
npx supabase functions deploy revenuecat-webhook --no-verify-jwt
npx supabase functions deploy creator-portal-admin-onboard
npx supabase functions deploy creator-portal-admin-creator
```

Optional secret: `CREATOR_REFERRAL_HASH_PEPPER` (fingerprint hashing; defaults if unset).

---

## SQL: update existing creator to 24 months

```sql
update public.creators
set commission_month_cap = 24
where slug = 'brandon';
```

Only affects **new** sign-ups after the change.

---

## What we intentionally removed

- App Store offer-code redemption for attribution
- In-app code entry / redeem sheet
- Branch / paid MMP (DIY deferred attribution instead)
- Admin “activate Apple code” workflow

Internal `creator_codes` rows remain as attribution keys — not user-facing discounts.
