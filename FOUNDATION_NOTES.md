# TightLines AI — Foundation Layer Notes

## What Was Built (Foundation Layer)

### Auth
- Supabase Auth with email/password sign-up + sign-in
- Apple Sign-In (iOS native) via `expo-apple-authentication`
- Email verification flow: sign-up → verify-email holding screen → sign in → onboarding
- Session persisted to device via `AsyncStorage` (auto-refreshed in background)
- Face ID / biometric re-entry via `expo-local-authentication`: prompts when app returns to foreground with an expired token

### Database Schema
All tables live in `public` schema with Row Level Security enabled.

| Table | Purpose |
|---|---|
| `profiles` | User profile — created at end of onboarding, one row per auth user |
| `sessions` | Fishing sessions (trips) — parent of catches |
| `catches` | Individual fish caught — conservation-grade richness per record |
| `ai_sessions` | Every AI call logged with input/response payload and cost |
| `usage_tracking` | Per-user per-billing-period cost counter for tier enforcement |

### Navigation Guard
`app/_layout.tsx` checks session + `onboarding_complete` flag on every auth state change and redirects to the correct route group:
- No session → `(auth)/welcome`
- Session + not onboarded → `(onboarding)/step-1-welcome`
- Session + onboarded → `(tabs)`

### Onboarding (3 screens, non-skippable)
1. **Welcome & value prop** — feature overview, "Get Started" CTA
2. **Preferences** — username (with real-time availability check), display name, fishing mode toggle, species multi-select (25 species), home state + city
3. **Location permission** — GPS request with clear value explanation; "Skip for now" allowed here only. On completion writes full `profiles` row with `onboarding_complete = true`.

### State Management
`store/authStore.ts` — Zustand store holding session, user, profile, onboarding draft state, and all auth actions.

---

## Email verification deep link (required for “Confirm your email” to open the app)

The default Supabase confirmation email uses an `https://` link that opens in the browser, so the app never receives the link. To have “Confirm your email” open the app and then onboarding:

### 1. Redirect URLs

**Authentication** → **URL Configuration** → **Redirect URLs** must include:

- `tightlinesai://**`
- `https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/auth-redirect**`

The second URL is used by the email link; when the user taps it, the Edge Function redirects to the app.

### 2. Where to find the Confirm signup template

- Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project (**TightLines AI V1**).
- **Authentication** → **Emails** → **Templates** → **Confirm sign up**.

### 3. Use Source/HTML mode and this Body

Many email clients do not turn `tightlinesai://` links into clickable hyperlinks. So the email should use an **https** link that redirects to the app:

1. Open the **Confirm sign up** template.
2. Switch the **Body** editor to **Source** (or **Code** / **HTML**) mode — not Preview. If you paste HTML in a visual/rich-text mode, it can appear as plain text and the link will not be clickable.
3. Replace the entire Body with this (copy everything between the angle brackets, paste into Body, then Save):

```html
<html>
<body>
<h2>Confirm your signup</h2>
<p>Thanks for signing up for TightLines AI. Tap the link below to confirm your email and open the app:</p>
<p><a href="https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/auth-redirect?token_hash={{ .TokenHash }}&type=email">Confirm your email</a></p>
</body>
</html>
```

4. Click **Save**.

The link is a normal https URL, so it will show as a hyperlink in Gmail, Outlook, Apple Mail, etc. When the user taps it, the browser opens the Edge Function, which immediately redirects to `tightlinesai://auth/confirm?...` and the app opens.

### 4. Reset password (optional but recommended)

- In **Authentication** → **Emails** → **Templates**, open **Reset password**.
- Use **Source** mode for the Body, then replace the entire Body with:

```html
<html>
<body>
<h2>Reset password</h2>
<p>You requested a password reset for TightLines AI. Tap the link below to open the app and set a new password:</p>
<p><a href="https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/auth-redirect?token_hash={{ .TokenHash }}&type=recovery">Reset password</a></p>
</body>
</html>
```

- Save. Same as confirm: the https link is clickable everywhere; the Edge Function redirects to the app.

---

## Pre-Launch Checklist (Before App Store Submission)

These items were deferred from the Foundation pass and **must be completed before launch**.

### High Priority

- [ ] **Google Sign-In** — Add `expo-auth-session` + configure Google OAuth credentials in Supabase dashboard. Requires adding Google client ID to `app.json` and the OAuth consent screen in Google Cloud Console. Deferred to avoid complexity in this pass.

- [ ] **Password Reset flow** — `lib/auth.ts` has `resetPassword()` helper. Build the forgot-password screen (`app/(auth)/forgot-password.tsx`) and a reset-password deep link handler (Supabase sends a link; handle via `tightlinesai://` scheme redirect back into app).

- [ ] **Apple Sign-In nonce testing** — Test the full Apple Sign-In flow on a real device with a real Apple ID. Verify nonce round-trip is correct end-to-end with Supabase.

- [ ] **Supabase email template customization** — Customize the verification email in Supabase Auth → Email Templates to use TightLines branding (logo, brand colors, clear call-to-action). **Required for “Confirm your email” to open the app:** see “Email verification deep link” below.

- [ ] **Username real-time debounce** — Currently `checkUsername` fires on `onEndEditing`. Add debounced checking on every keystroke with a 400ms delay for better UX (prevents the user from submitting before the check resolves).

- [ ] **Profile photo upload** — Avatar picker using `expo-image-picker` + Supabase Storage bucket `avatars`. Add avatar display to the profile section in the My Log tab.

### Before Launch

- [ ] **RLS policy audit** — Run Supabase security advisor after all features are built. Review all policies, especially `ai_sessions` and `usage_tracking` (Edge Functions use service role key and bypass RLS — confirm this is correct).

- [ ] **Full DB schema review** — Before launch, review `catches` + `sessions` schema against conservation data capture requirements. Consider: GPS precision requirements for fishery submissions, additional species metadata fields, water body identifiers.

- [ ] **Subscription tier enforcement (RevenueCat)** — Integrate RevenueCat SDK. Connect webhook to Supabase to update `profiles.subscription_tier` on subscription events. Build the upgrade prompt modal used throughout the app when free-tier users tap gated features.

- [ ] **Analytics integration** — Add Mixpanel, Amplitude, or PostHog from day one before real users onboard. Key events to track: `sign_up`, `onboarding_complete`, `sign_in`, `feature_used` (which AI features), `usage_cap_hit`, `upgrade_prompted`.

- [ ] **Error monitoring** — Integrate Sentry or similar for crash reporting before launch. Critical for a solo founder — you need to know when things break in production.

- [ ] **Offline support** — Implement local SQLite queue for manual log entries (`expo-sqlite`) and voice recording queue. Build sync-on-reconnect logic.

- [ ] **Push notification permissions** — Request at an appropriate moment (after user has had a positive interaction, not on first launch). Build the approaching-usage-cap notification.

- [ ] **App Store metadata** — Privacy manifest, app description, screenshots, age rating, privacy policy URL.

### Post-Launch / V2

- [ ] **Google Sign-In** (see above — V1.1 target)
- [ ] Community Feed shared-location aggregation (PostGIS `ST_ClusterKMeans` or regional polygon join)
- [ ] AI Trip Summary Narrative (Master Angler) — Claude call on day's voice log entries
- [ ] Catch Log Export CSV/PDF Edge Function
- [ ] Hatch Chart Reference Document (explicit V1 dependency for fly recommender)

---

## Architecture Notes

### AI API Call Pattern (all future features follow this)
```
Client → Supabase Edge Function → Environmental APIs → Claude API → Structured JSON → Client
```
API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are injected as Edge Function secrets — never on the client.

### Cost Tracking
After every Claude/Whisper call, Edge Function upserts:
```sql
INSERT INTO usage_tracking (user_id, billing_period, total_cost_usd, call_count)
VALUES ($1, to_char(now(), 'YYYY-MM'), $2, 1)
ON CONFLICT (user_id, billing_period)
DO UPDATE SET
  total_cost_usd = usage_tracking.total_cost_usd + EXCLUDED.total_cost_usd,
  call_count = usage_tracking.call_count + 1;
```

### Personal Bests Query (no separate table needed)
```sql
SELECT DISTINCT ON (species) *
FROM catches
WHERE user_id = $1
ORDER BY species, length_in DESC NULLS LAST;
```
