# Pre-build iOS smoke test (dev client — no new TestFlight)

Run this on your **EAS development build** + Metro. Same JavaScript as the next production build; only native code differs if you changed native modules.

## 0. One-time setup

```bash
cd TightLinesAI
npm run prebuild:check-env
```

## 1. Pass A — Store-like (matches EAS **production**)

Production builds **do not** set `EXPO_PUBLIC_POSTHOG_API_KEY`. Analytics must be off without crashing.

1. In `.env`, **comment out** `EXPO_PUBLIC_POSTHOG_API_KEY` (and restart Metro after any `.env` change).
2. `npm run prebuild:check-env` → should say **store-like**.
3. Delete FinFindr from the phone → reinstall **dev client** (optional but best for cold start).
4. `npm run start:dev-client` → open app from QR / dev servers.
5. Run checklist **Pass A** below.

## 2. Pass B — PostHog on (verify analytics works)

1. In `.env`, **uncomment** `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`.
2. Restart Metro (`npm run start:dev-client` with cache clear if needed: `npm run start:dev-client:lan:clear`).
3. `npm run prebuild:check-env` → should say **posthog-enabled**.
4. Sign in → **Settings → ADMIN TOOLS → Send analytics test event**.
5. PostHog → **Activity** / **Live events** → look for `prebuild_smoke_test` within ~2 minutes (filter project US host if needed).

## 3. Checklists

### Pass A — Store-like (required before submit)

- [ ] Cold launch — no crash, welcome layout OK
- [ ] Sign in with Apple — no Recovery screen, lands in app
- [ ] Force-quit → reopen — no crash loop
- [ ] Email sign-in `finfindr@hotmail.com` — Home loads
- [ ] Tabs: Home, Tackle Box, Settings
- [ ] Sign out → welcome again

### Pass B — PostHog (before enabling key in EAS production)

- [ ] Settings shows **Analytics: enabled (client ready)**
- [ ] **Send analytics test event** → success notice
- [ ] PostHog live events show `prebuild_smoke_test` with your user id

## 4. When both passes pass

Commit crash-fix + analytics changes, then:

```bash
eas build --platform ios --profile production
```

TestFlight smoke → submit for review.

## Notes

- **TestFlight build 12** was from git commit `70ec2a9` **without** uncommitted fixes. Dev client + Metro tests **current disk code**, not build 12.
- Apple Sign-In needs the **dev client** binary (same as production native stack for auth).
- If Recovery screen appears, read the gray error line (AppErrorBoundary) and fix before building.
