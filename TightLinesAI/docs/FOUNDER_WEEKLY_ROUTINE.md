# FinFindr — Founder Weekly Routine

Short checklist for monitoring the live app. You do **not** need to code.

---

## Every week (~15 min)

### 1. App Store Connect
**https://appstoreconnect.apple.com** → FinFindr

| Check | Where |
|-------|--------|
| Crashes | **Analytics → Metrics → Crashes** |
| Bad reviews | **Ratings and Reviews** |
| Version live | **App Store → iOS App** (build number) |

### 2. Friend / user feedback
Ask anyone who reports a problem:
- What were you doing right before it broke?
- iPhone model?
- Screenshot or screen recording?
- Exact error message (if any)?

### 3. Supabase (only if something “won’t load”)
**https://supabase.com** → TightLines project → **Edge Functions → Logs**

Look for red errors on: `how-fishing`, `recommender`, `water-reader-read`

### 4. RevenueCat (only if subscription is wrong)
**https://app.revenuecat.com** → **Customers** → search user → check **angler** entitlement

---

## When something breaks — copy this to your agent

```text
FinFindr bug report
- Build: (e.g. 1.0.0 build 13) — App Store or TestFlight
- Device: (e.g. iPhone 15 Pro Max, iOS version)
- Steps: 1) … 2) … 3) …
- Expected: …
- Actual: …
- Screenshot: (attach)
- How many people: just me / one friend / everyone
```

---

## What gets fixed how fast

| Problem | Usually needs |
|---------|----------------|
| Report won’t generate, API errors | Server fix — **no** new App Store build |
| Free Angler for a friend | RevenueCat promo grant — **no** new build |
| App crash, UI bug | New app build + App Review |

---

## Support email (support@finfindr.app)

In-app feedback uses **Resend outbound** → your Hotmail. **Inbound** mail to `support@finfindr.app` needs **Cloudflare Email Routing** (MX records). See `docs/FINFINDR_EMAIL_SETUP.md` if external emails bounce or never arrive.

---

## Soft launch reminders

- **Release** approved build in App Store Connect when ready.
- Tell comped friends: **don’t tap Subscribe** if you gave them free Angler.
- **Don’t** promise a public launch date until you’re ready to market.
- **LLC migration:** wait for Apple email; developer name updates automatically after.

---

## Your logins (bookmark these)

- App Store Connect — crashes, reviews, release
- Supabase — API logs
- RevenueCat — subscriptions
- Expo — new builds (when agent says you need one)
- PostHog — analytics (after 1.0.1 with PostHog enabled)

---

## When to ping an agent

- Any crash you or a friend can repeat
- Any paid user who can’t access Angler features
- Spikes in Supabase errors
- Second App Store rejection (if it ever happens)

You watch and report. The agent fixes.
