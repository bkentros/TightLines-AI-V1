# FinFindr App Store Submission Checklist

Last updated: 2026-05-27

This is the living launch checklist for getting FinFindr through Apple review with the best chance of a fast approval. Check items off only when verified on the actual production or review build, not just assumed from code.

Apple can still reject an app for reviewer-specific findings, policy interpretation, backend outages, or bugs we miss. This checklist is built around the current Apple docs plus what is visible in the codebase.

## Current Top Risks

- [x] **Publish Privacy Policy, Terms of Service, and Support URL.** Public web URLs are live at `https://finfindr.app/privacy`, `https://finfindr.app/terms`, and `https://finfindr.app/support`.
- [x] **Complete app-review consistency pass for Terms, Privacy, Safety, and Support copy.** In-app copy and public legal pages were reconciled on 2026-05-27 for `FinFindr LLC` operator language, subscription restore behavior, refunds/store billing, account deletion, third-party providers, fishing safety limits, outdoor-risk assumption, warranty disclaimers, liability limits, and public contact paths. This is not a formal attorney opinion.
- [ ] **BLOCKER FOR PUBLIC LAUNCH: Finish D-U-N-S and Apple organization conversion.** `FinFindr LLC` is approved, the EIN is saved, and the D-U-N-S request has been submitted. Fast-track plan is to keep moving toward App Review under the current individual developer account if needed, keep the app on Manual Release, then convert the Apple Developer membership/seller identity to `FinFindr LLC` before public launch if Apple timing allows.
- [x] **Activate Paid Apps Agreement.** App Store Connect now shows Paid Apps Agreement, bank account, and U.S. Form W-9 as Active on 2026-05-23. Current setup is still under the individual account; convert/update to `FinFindr LLC` after Apple organization conversion if Apple timing allows.
- [x] **Remove fingerprint-based creator attribution from the shipping app.** Completed August 5, 2026: Instally was removed from the dependency bundle and runtime, creator attribution no longer runs in onboarding/deep links/paywall flows, and public creator/referral pages were removed. Publish the complete App Store privacy response in `docs/APP_PRIVACY_UPDATE_20260805.md` before submission/release.
- [x] **Resolve App Store Connect subscription product availability.** RevenueCat now returns the monthly and annual App Store products in the iOS dev build, and the paywall loads after Paid Apps/tax/banking became active on 2026-05-23.
- [x] **Make subscription/paywall metadata review-ready in RevenueCat.** RevenueCat template paywall is published and attached to the `default` offering with Terms/Privacy URLs.
- [x] **HIGH: Finish the subscription regression pass.** Sandbox purchase succeeds, canceling from the Apple purchase sheet returns cleanly without unlocking, same-account restore works, active Angler access survives sign-out/sign-in, and RevenueCat now blocks restoring the same App Store receipt onto a different/recreated FinFindr account. Final TestFlight/App Store build `1.0.0 (6)` was smoke-tested on 2026-05-27 and another sandbox subscription granted full Angler access.
- [x] **Remove `ios.infoPlist.UIDesignRequiresCompatibility`.** Removed from `app.json` on 2026-05-20 and explicitly pinned to `false` again on 2026-05-27 so the app uses the default current iOS UI behavior; iPhone-only support is still controlled separately by `supportsTablet: false`.
- [x] **Resolve Supabase `public.spatial_ref_sys` RLS/security alert.** Warning no longer appears in Supabase dashboard; `supabase db lint --linked --schema public` returned no schema errors on 2026-05-20.
- [x] **Code-level free vs Angler gates are centralized and enforced.** Commit `65a4bd8` makes new/free users limited, allows tomorrow-only forecast preview, gates future forecast reads, gates recommender generation after step 4, gates Water Read generation after lake selection, and keeps Angler unrestricted. Free-user 6-day forecast taps now route into the upgrade/paywall path from both Home and the limited read teaser.
- [x] **Confirm reviewer can access every gated feature.** `finfindr@hotmail.com` is configured as complimentary Angler access and successfully reached Angler-gated features in the fresh iOS dev build on 2026-05-21. This validates reviewer feature access, not the App Store purchase path.
- [x] **Account/auth lifecycle E2E is passing in the fresh iOS dev build.** Email signup, verification email, account deletion, recreating the same email after deletion, password reset email/link, and returning-user Sign in with Apple were QA-verified on device by 2026-05-22.
- [x] **Legal/safety page presentation QA passed.** Terms, Privacy, and Safety pages render with the corrected navy safe-area/header treatment and were visually checked on device by 2026-05-22. Legal copy was reconciled across in-app and public pages again on 2026-05-27 after LLC/EIN approval.
- [ ] **HIGH: Use EAS Cloud or update local Xcode before native iOS builds.** `expo-doctor` now passes dependency checks, but the selected local Xcode is 15.2 and Expo SDK 55 expects Xcode 26 or newer.

## Proper Order

### 1. Freeze The Submission Surface

- [x] Create a `release/app-store-v1` branch after current visual/subscription work is stable. Created and pushed from commit `a0afd89` on 2026-05-26.
- [ ] Decide final scope for v1: no half-enabled screens, no “coming soon” promises unless non-blocking and polished.
- [ ] Remove or hide any dev-only controls from production users.
- [x] Dev tier override is limited to `__DEV__` or admin email in `app/(tabs)/settings.tsx`.
- [ ] Confirm no placeholder text, placeholder images, temporary debug alerts, console-only failure states, or broken empty states remain.
- [ ] Confirm all network-dependent screens have graceful outage messaging.

### 2. App Identity And Build Configuration

- [x] App display name is `FinFindr` in `app.json`.
- [x] iOS bundle identifier is `com.finseekr.finfindr`.
- [x] App version is `1.0.0`.
- [x] App icon exists at 1024 x 1024.
- [x] Confirm Apple Developer app record uses the same bundle ID.
- [ ] Confirm SKU, primary language, category, age rating, copyright, and contact information in App Store Connect.
- [x] Verify `ITSAppUsesNonExemptEncryption: false` is accurate for your app’s use of standard HTTPS/TLS only.
- [x] Decide on iPhone-only vs iPad support. Current config has `supportsTablet: false`; v1 will launch iPhone-only.
- [x] Review and remove `UIDesignRequiresCompatibility: true` unless you intentionally need iPhone compatibility mode.
- [ ] Increment build number for every uploaded build.

### 3. RevenueCat / In-App Purchase Readiness

- [x] `react-native-purchases` is installed.
- [x] `react-native-purchases-ui` is installed for RevenueCat template paywalls.
- [x] RevenueCat store supports iOS key lookup via `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`.
- [x] Purchase, restore, customer info refresh, and entitlement sync flows exist.
- [x] Limited report CTA, subscribe prompts, and membership screen can present RevenueCat template paywalls through `presentPaywallIfNeeded`.
- [x] New accounts are created as `free` by default. Database default is `subscription_tier = 'free'`, onboarding no longer writes the tier from the client, and missing/unknown tiers resolve to `free` in app gating.
- [x] Free vs Angler access policy is centralized in `lib/subscription.ts`.
- [x] Free users can preview tomorrow's forecast score/color, generate only the limited current-day Today's Bite report, complete recommender setup before the paywall, and search/select Water Read lakes before the paywall.
- [x] Angler users have full access to forecast reports, full Today's Bite, recommender generation, and Water Read generation.
- [x] Entitlement ID in code is `angler`.
- [x] Confirm RevenueCat entitlement exactly matches `angler`.
- [x] Confirm RevenueCat offering is current and has all products attached.
- [x] Attach a RevenueCat paywall/template to the current `default` offering.
- [x] RevenueCat SDK is configured with the signed-in Supabase user id as the identified App User ID before purchase/restore attempts.
- [x] RevenueCat local membership state is cleared when no FinFindr user is signed in, preventing stale premium UI after sign-out/account switching.
- [x] Add App Store Connect API credentials in RevenueCat for the FinFindr iOS app.
- [x] Create matching auto-renewable subscription products in App Store Connect.
- [x] Confirm product IDs in App Store Connect match RevenueCat products exactly.
- [x] Add subscription group, reference names, localized display names, descriptions, prices, availability, and review screenshots.
- [x] Confirm both App Store Connect subscriptions no longer show `Missing Metadata`.
- [x] Confirm RevenueCat no longer reports empty offerings in a fresh dev/TestFlight build. Paywall loaded monthly/annual App Store products in the iOS dev build on 2026-05-23 after Paid Apps/tax/banking became active.
- [x] Complete Apple Paid Apps Agreement, banking, and tax forms enough to make Paid Apps active for subscription testing. Current fast-track path used the individual/disregarded-entity W-9 first; update/convert to `FinFindr LLC` before public release if Apple timing allows.
- [x] Confirm App Store Connect business agreements show active/accepted, not pending. Paid Apps Agreement, bank account, and U.S. Form W-9 were shown Active on 2026-05-23.
- [ ] Ensure each first-time subscription/IAP is selected with the app version submission.
- [ ] Add the monthly and annual subscriptions to App Store Connect app version `1.0` before submitting the app/subscriptions for review.
- [x] Allow App Store Connect/StoreKit propagation after business/subscription changes, then restart the app and retry. Product fetch/paywall succeeded on 2026-05-23.
- [x] Test sandbox purchase on a physical iPhone dev build. Sandbox purchase showed Apple success confirmation on 2026-05-23.
- [x] Test cancel from purchase sheet. Verified on device that canceling from Apple's sandbox purchase sheet returns cleanly without unlocking Angler.
- [ ] Test restore purchase after reinstall/sign out/sign in. Restore immediately after sandbox purchase showed Angler active on 2026-05-23, and same-account sign-out/sign-in kept access in the dev build; still needs reinstall/new-session validation on the final review/TestFlight build.
- [x] Set/confirm RevenueCat restore behavior for launch. RevenueCat is using `Keep with original App User ID`; sandbox testing confirmed the same active App Store receipt does not transfer to a different or recreated FinFindr account and instead shows the "Subscription linked elsewhere" recovery message.
- [x] Test entitlement changes update Supabase `profiles.subscription_tier`. Final TestFlight/App Store build `1.0.0 (6)` sandbox subscription granted full Angler access on 2026-05-27.
- [x] Harden final subscription tier write path before launch. Added a database trigger that blocks authenticated/anon clients from changing `profiles.subscription_tier`, moved tier sync behind the `sync-subscription-tier` Edge Function, and made RevenueCat/server-confirmed entitlement the trusted write path.
- [x] Test free user gating for Today's Bite, Tackle Box/recommender, and Water Read. Verified in the fresh iOS dev build on 2026-05-21; gated CTAs route into the subscription flow and currently show the unavailable fallback while App Store products are not returned.
- [x] Add App Store review notes explaining how to find and test subscription-gated features.
- [x] Add a reviewer account that either has an active sandbox subscription or can purchase using Apple sandbox. Current reviewer login is entered in App Store Connect; sandbox subscription purchase was validated on uploaded build `1.0.0 (6)` on 2026-05-27.
- [x] Add Terms and Privacy links to subscription screen.
- [x] Confirm RevenueCat paywall clearly shows subscription title, price, billing period, what unlocks, and purchase/restore actions. RevenueCat paywall footer `Terms` and `Privacy` open the live public URLs, and `Restore Purchases` connects only the original App User ID under the launch restore policy.
- [x] Confirm there are no external purchase links or CTAs for digital subscription access outside Apple IAP. Code search found only the native RevenueCat/App Store purchase path plus Apple subscription management/legal/support URLs.
- [x] Add a clear “manage subscription” path or instructions from Settings, especially near account deletion.

### 4. Apple Login, Accounts, And Account Deletion

- [x] Sign in with Apple is enabled in `app.json`.
- [x] Sign in with Apple buttons exist on welcome/sign-in for iOS.
- [x] Email/password account creation exists.
- [x] Account deletion is exposed in Settings.
- [x] Account deletion calls a Supabase Edge Function that deletes the Supabase Auth user.
- [ ] Confirm account deletion removes or anonymizes associated profile/log/feedback/app data as promised in the Privacy Policy.
- [x] Add subscription warning before deletion: Apple says users with auto-renewing subscriptions should be told billing continues through Apple and asked to cancel first. Settings now also warns that active Angler access may not restore to a new/recreated FinFindr account after deletion.
- [x] Provide manage subscription link or native subscription management before/near deletion.
- [x] Test delete account on real device and confirm the user cannot sign back in / can recreate with the same email. Verified with `kentrosbrandon@gmail` on 2026-05-22.
- [ ] Confirm Apple private relay email works for support/password flows.
- [x] Confirm email confirmation and password reset deep links work from the production domain. Signup verification and password reset email flows were verified E2E from device on 2026-05-22.

### 5. Privacy, Legal, And Data Disclosures

- [x] Publish Privacy Policy URL: `https://finfindr.app/privacy`.
- [x] Publish Terms of Service URL: `https://finfindr.app/terms`.
- [x] Publish Support URL or support page: `https://finfindr.app/support`.
- [x] Make Terms/Privacy tappable from sign-up.
- [x] Require explicit Terms/Privacy checkbox acceptance during email sign-up.
- [ ] For stronger audit evidence, store Terms/Privacy acceptance timestamp and document version on the user profile or a legal acceptance table.
- [x] Make Privacy/Terms/Support reachable from Settings.
- [x] Make Safety reachable from Settings.
- [x] Complete App Privacy Nutrition Label in App Store Connect. Published on 2026-05-20 with Contact Info, Location, User Content, Identifiers, Purchases, and Usage Data linked to the user; no tracking.
- [x] Wait for Florida Sunbiz approval for `FinFindr LLC`; save the filed Articles, document number, and any Certificate of Status. LLC approval was confirmed and saved on 2026-05-27.
- [x] Apply for the free IRS EIN only after the LLC is approved; use exact legal name `FinFindr LLC` and save the EIN confirmation letter. EIN was obtained and saved on 2026-05-27.
- [x] Update Terms/Privacy/Safety/Support company/entity references after the LLC is officially approved. In-app and public legal pages were updated to `FinFindr LLC` on 2026-05-27.
- [x] Decide Apple seller path for the fast-track review plan: submit for review from the individual account with Manual Release if D-U-N-S/organization conversion is still pending, then request Apple Developer membership conversion to `FinFindr LLC` after D-U-N-S is ready.
- [ ] Complete App Store Connect Digital Services Act/trader compliance before EU distribution. Current app availability is United States only, so this is not intended to block U.S.-only submission unless App Store Connect requires a declaration before review.
- [x] Confirm policy covers account data, email, location, photos/camera uploads, microphone/voice logs if enabled, fishing logs, support messages, purchases, diagnostics, account deletion, subscription restore behavior, retention/security, creator/referral attribution, PostHog product analytics, and third parties. Reconciled on 2026-05-27.
- [x] Document third parties: Supabase, RevenueCat, PostHog, Apple platform services, Google platform services where supported, Resend, Open-Meteo, NOAA/NWS, NOAA CO-OPS, USNO, Sunrise-Sunset.org, mapping/geocoding providers, analytics/diagnostics providers, and similar operational vendors. Reconciled on 2026-05-27.
- [ ] Confirm no App Tracking Transparency prompt is needed. Current code does not show ad tracking or cross-app tracking SDKs.
- [ ] Confirm no third-party ads, gambling, contests, medical/safety claims, or regulated activity language appears.
- [x] Add safety disclaimer if fishing recommendations could be interpreted as navigation/safety guidance: conditions are informational, users are responsible for local laws/weather/water safety.
- [x] Confirm App Store age rating answers match camera, location, UGC/logging, and web/network content behavior. App Store Connect calculated 4+ with regional equivalents on 2026-05-20.

### 6. Permissions And Device Capabilities

- [x] Location permission purpose text exists.
- [x] Camera permission is not requested in the v1 submission build.
- [x] Photo permission is not requested in the v1 submission build.
- [x] Microphone permission is not requested in the v1 submission build.
- [x] Verify iOS generated `Info.plist` contains `NSLocationWhenInUseUsageDescription`. Explicit foreground location copy was added to `app.json` on 2026-05-27.
- [ ] Confirm app does not require location permission to access unrelated functionality.
- [ ] Test denial states for location and biometrics. Camera, photos, microphone, and notifications are not requested in the v1 submission build.
- [x] Confirm camera/photo/microphone features are complete, hidden, or gracefully unavailable. No shipping code path imports camera, image picker, audio, or notifications; unused native packages were removed from the v1 submission branch on 2026-05-27 to keep the App Store permission surface accurate.
- [ ] Confirm push notification permission is requested only in context, if used at all.

### 7. Backend And Supabase Launch Readiness

- [x] Resolve Supabase RLS/security alert or attach Supabase support/ticket outcome to launch notes.
- [x] Confirm all required Edge Functions are deployed in the production Supabase project. Verified with `supabase functions list` on 2026-05-22; `sync-subscription-tier` is active.
- [x] Confirm required function secrets are set: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `REVENUECAT_SECRET_API_KEY`, `RESEND_API_KEY`, feedback email vars, and any water-reader internal keys. Verified by secret name/digest with `supabase secrets list` on 2026-05-22.
- [ ] Run production smoke tests for auth, profile creation, environment fetch, forecast scores, how-fishing, recommender, waterbody search, water-reader polygon/read, feedback, and delete-account.
- [x] Confirm database migrations are applied in production. `20260522190000_protect_profile_subscription_tier` was pushed and appears in the remote migration list on 2026-05-22.
- [ ] Confirm Row Level Security is enabled on user-owned app tables and service-role functions enforce authenticated user access.
- [ ] Confirm Supabase Auth redirect URLs include `https://finfindr.app/auth/confirm/` and app scheme links as needed.
- [ ] Confirm production domain forwards auth confirmation links into the app.
- [ ] Confirm backend rate limits and failure messages will not look like app bugs to reviewers.

### 8. App Completeness QA

- [x] Run TypeScript check. Latest pass was 2026-05-27: `npm run qa:water-reader-typecheck`.
- [x] Fix Expo SDK package version drift. `npx expo install --check` passed on 2026-05-27.
- [ ] Local native iOS build toolchain: selected Xcode is 15.2; install/select Xcode 26+ before relying on local iOS native builds. EAS Cloud build remains the recommended path for the dev client.
- [x] Run key Supabase/Deno tests for recommender and water-reader shared modules. `find supabase/functions -name '*.test.ts' -print0 | xargs -0 deno test -A` passed on 2026-05-27 with `581 passed / 0 failed`.
- [x] Run app on a physical iPhone from a development build. Fresh iOS dev client was installed and used for account/subscription-access QA on 2026-05-21/2026-05-22.
- [x] Run app on a production-like TestFlight build. Build `1.0.0 (6)` smoke test passed on 2026-05-27, including sandbox subscription purchase and Angler unlock.
- [x] Test cold install, sign-up, email verification, onboarding, sign-in, sign-out. Email account flow was verified E2E on device by 2026-05-22.
- [x] Test Sign in with Apple first-time and returning-user flows. Fresh iOS dev build logs showed Supabase Apple session creation on 2026-05-21; returning-user one-tap Sign in with Apple was verified on device by 2026-05-22.
- [x] Test password reset from email link. Verified on device by 2026-05-22.
- [x] Test every tab and every major screen without a subscription. Free-account gates were verified on device; gated CTAs route into the subscription flow and currently show the unavailable fallback while Apple products are unavailable.
- [x] Test every major screen with active Angler access. Verified on device using complimentary Angler reviewer access, then rechecked with a real sandbox subscription after App Store products became available.
- [ ] Test airplane mode / poor network states.
- [ ] Test small screen iPhone and large iPhone layouts.
- [ ] Test light mode only behavior since `userInterfaceStyle` is `light`.
- [ ] Confirm no crashes in Xcode device logs during a full walkthrough.
- [ ] Confirm no secret keys are exposed in public env vars beyond allowed public SDK keys.
- [ ] Review bundle size and remove unused backup images/assets if they ship in the app bundle.

### 9. App Store Connect Metadata

- [x] App name: `FinFindr: Fishing Intelligence`.
- [x] Subtitle: `Bite Forecasts & Tackle`.
- [x] Promotional text.
- [x] Description.
- [x] Keywords: `bass,smallmouth,largemouth,trout,pike,lure,fly,moon,tide,weather,lake,river,pond,map,solunar,angler`.
- [x] Support URL.
- [x] Marketing URL.
- [x] Privacy Policy URL.
- [x] App category: Primary `Sports`, secondary `Weather` if available.
- [x] Age rating questionnaire.
- [x] Screenshots for required iPhone sizes. Six 6.5-inch iPhone portrait screenshots uploaded at 1242 x 2688; this satisfies the required iPhone screenshot set when no 6.9-inch screenshots are provided, and App Store Connect scales them for other iPhone display sizes.
- [ ] App preview video, optional.
- [x] Review contact name, phone, and email.
- [x] Demo account username/password.
- [x] Review notes covering subscription test path, location usage, any limited water coverage, and Supabase known issue if relevant.
- [ ] Export compliance. `ITSAppUsesNonExemptEncryption: false` is set in app config; final App Store Connect export prompt should be verified after the production build is uploaded.
- [x] Content rights.
- [x] Pricing and availability. App download is free and availability is United States only. App availability has been confirmed as `1 of 175 countries or regions`; the `175 countries or regions` shown under Business agreements is agreement scope, not live app availability.
- [x] Manual release selected if you want control after approval.

### 9A. While LLC / EIN Is Pending

These are useful next moves that do not require the LLC approval, EIN, or Apple paid-app agreement to be active:

- [x] Choose and enter the final App Store subtitle: `Bite Forecasts & Tackle`.
- [x] Choose and confirm the primary App Store category: `Sports`.
- [x] Re-read App Store description, promotional text, and keywords against the current product: free tier, Angler subscription, supported-water limits, no external purchase path. Description was tightened and entered on 2026-05-22.
- [x] Review uploaded screenshots for fictional/non-sensitive account data, clear in-app use, and no misleading paid-feature promises. Six iPhone screenshots reviewed on 2026-05-22; `Water Reader` label is acceptable as public feature framing.
- [x] Confirm the Support URL page has a clear support email/contact path and loads without auth. `https://finfindr.app/support` is public and lists `support@finfindr.app`.
- [x] Confirm public Privacy/Terms/Safety/Support URLs load cleanly in Safari, not just in-app. Verified live on 2026-05-22 after deploying the public Safety page.
- [x] Prepare final App Review notes with exact demo credentials, reviewer account, feature test path, supported-water guidance, free-tier lock explanation, and location guidance. Entered in App Store Connect on 2026-05-22.
- [ ] Run a final free-account walkthrough on a second email and capture short notes/screenshots for yourself.
- [x] Create a sandbox Apple tester account in App Store Connect, even if purchases cannot complete until paid-app setup is active. Sandbox tester `hooksettr@hotmail.com` exists in App Store Connect as of 2026-05-22.
- [x] Confirm all production Supabase Edge Functions and secrets are deployed/set before the TestFlight build, including `sync-subscription-tier` and `REVENUECAT_SECRET_API_KEY`.

### 9B. Business / LLC / Tax Follow-Up

- [x] Watch for the Sunbiz approval email for the Florida LLC filing. `FinFindr LLC` is approved.
- [x] Search Sunbiz once approved and save the public filing page/PDF for records.
- [x] Apply for EIN directly through the IRS site; do not pay a third-party EIN site. EIN is obtained and saved.
- [ ] Open/update a business bank account after EIN is available.
- [x] Complete current App Store Connect W-9/tax info and wait for banking to finish processing if using the fast-track individual-account path to unblock Paid Apps/subscription testing. Completed/active on 2026-05-23.
- [x] Confirm the Apple Paid Apps Agreement is active before expecting subscriptions to work reliably. Confirmed Active on 2026-05-23.
- [ ] Wait for D-U-N-S confirmation before expecting Apple to complete the Individual-to-Organization conversion request.
- [ ] After D-U-N-S confirmation, submit Apple Developer Support request to convert the Individual membership to an Organization membership for `FinFindr LLC`.
- [ ] Add the next Florida annual report reminder: file between January 1 and May 1 each year, starting the calendar year after formation.

### 9C. Manual Release / LLC Conversion Gate

These items must be checked before clicking the final public release button, especially if App Review approval happens before the LLC conversion is complete:

- [ ] Confirm the App Store version release option is still `Manually release this version` before submitting.
- [ ] If the app is approved before LLC conversion, leave it in `Pending Developer Release`; do not publicly release until the seller/entity plan is confirmed.
- [x] After `FinFindr LLC` is approved, apply for the EIN directly through the IRS and save the confirmation letter.
- [ ] Get or confirm the D-U-N-S number for `FinFindr LLC`. D-U-N-S request was submitted on 2026-05-27; waiting on D&B/Apple confirmation.
- [ ] Open Apple Developer Support request to convert the Individual membership to an Organization membership for `FinFindr LLC`.
- [ ] Confirm Apple Developer account / App Store Connect seller identity shows `FinFindr LLC` or intentionally approve launching under the individual seller name.
- [ ] Re-check Paid Apps Agreement, banking, tax forms, DSA/trader info, and public seller/contact information after Apple conversion.
- [x] Update Terms and Privacy entity references to `FinFindr LLC` once the entity is officially approved. Completed on 2026-05-27 across in-app and public legal pages; recheck after Apple seller conversion if public seller info changes.
- [ ] Re-check App Store Privacy labels against PostHog and current app data flows. Current expected stance: account, location, user content, search, product interaction, identifiers, purchases, and diagnostics are linked to the user; no tracking and no advertising/marketing purpose. Creator attribution is disabled for this release.
- [ ] Confirm app availability remains United States only.
- [ ] Confirm monthly and annual subscription availability is United States only.
- [ ] Re-check RevenueCat products, sandbox purchase, restore, cancel, and Supabase entitlement sync after any account/business conversion changes.

### 10. Build, Upload, And Submit

- [x] Build dev client: `eas build --profile development --platform ios`. Fresh iOS development build was created and installed on device for launch QA on 2026-05-21/2026-05-22.
- [x] Confirm EAS production and development env vars are present for iOS builds: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`, and `EXPO_PUBLIC_AUTH_EMAIL_REDIRECT` verified on 2026-05-21.
- [x] Install dev build on physical iPhone. Fresh iOS dev client was loaded on the iPhone 15 Pro Max for launch QA on 2026-05-21/2026-05-22.
- [x] Start Metro with env vars loaded and test RevenueCat sandbox. LAN dev-client testing confirmed paywall load, sandbox purchase, cancel-from-sheet, same-account restore, and strict restore blocking for a different/recreated FinFindr account.
- [x] Build production: `eas build --profile production --platform ios`. Build `1.0.0 (6)` completed on 2026-05-27.
- [x] Upload to App Store Connect. Build `1.0.0 (6)` uploaded on 2026-05-27.
- [ ] Add the build to the app version.
- [ ] Attach first-time IAP/subscriptions to the version submission.
- [ ] Submit for review.
- [ ] If approved before LLC conversion, keep the app in `Pending Developer Release` until the 9C launch gate is complete.
- [ ] Monitor App Review messages and respond with exact steps, credentials, and screenshots/video if asked.

## Review Notes Draft

Copy-paste version prepared on 2026-05-27: `docs/APP_REVIEW_NOTES_20260527.md`.

Use this as a starting point in App Store Connect after the unchecked items are done:

```text
FinFindr is a fishing forecast and tackle recommendation app. Reviewers can create an account with email/password or Sign in with Apple. A demo account is provided below.

Business/entity note:
FinFindr LLC has been approved and the EIN has been obtained. The app is currently being submitted from the existing individual Apple Developer account while D-U-N-S confirmation and Apple Developer Individual-to-Organization conversion are pending. The version is set to Manual Release, and the app will not be publicly released until seller/account information is reconciled or intentionally approved for launch. The Terms, Privacy Policy, Safety Notice, and Support pages identify FinFindr LLC as the app operator.

Core review path:
1. Sign in with the demo account.
2. Complete onboarding if prompted.
3. Open Home to view Today's Bite and live conditions.
4. Open Subscribe/Manage membership to view Angler subscription products.
5. Use the sandbox account to purchase or restore an Angler subscription.
6. After Angler is active, test Tackle Box/Recommender and Water Read.
7. Settings includes support/contact, cache clearing, sign out, and account deletion.

Water Read coverage is limited to supported waters in the app's database. If a searched water is unsupported, the app shows an in-app unsupported/limited message rather than crashing.

Location is used to fill weather, tide, moon, and local fishing-condition inputs. Users can also set location manually.
```

## Official References Used

- Apple App Review overview and common rejection issues: https://developer.apple.com/app-store/review/
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple account deletion guidance: https://developer.apple.com/support/offering-account-deletion-in-your-app/
- Apple app privacy details: https://developer.apple.com/app-store/app-privacy-details/
- App Store Connect app privacy fields: https://developer.apple.com/help/app-store-connect/reference/app-information/app-privacy
- App Store Connect version metadata fields: https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information
- App Store Connect app submission help: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app
- App Store Connect first-time IAP/subscription submission help: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase
- App Store Connect release option help: https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/select-an-app-store-version-release-option/
- Apple Developer account support / individual-to-organization conversion: https://developer.apple.com/support/account/
- App Store Connect IAP metadata fields: https://developer.apple.com/help/app-store-connect/reference/in-app-purchase-information
- Apple App Store Connect IAP setup overview: https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/overview-for-configuring-in-app-purchases/
- RevenueCat offerings-empty troubleshooting: https://revenuecat.github.io/codelabs/troubleshooting/fetching-offerings/
- IRS EIN official application page: https://www.irs.gov/businesses/employer-identification-number
- Florida LLC fee reference: https://dos.fl.gov/sunbiz/forms/fees/llc-fees/
- Florida annual report reference: https://dos.fl.gov/sunbiz/manage-business/efile/annual-report/
