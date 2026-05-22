# FinFindr App Store Submission Checklist

Last updated: 2026-05-22

This is the living launch checklist for getting FinFindr through Apple review with the best chance of a fast approval. Check items off only when verified on the actual production or review build, not just assumed from code.

Apple can still reject an app for reviewer-specific findings, policy interpretation, backend outages, or bugs we miss. This checklist is built around the current Apple docs plus what is visible in the codebase.

## Current Top Risks

- [x] **Publish Privacy Policy, Terms of Service, and Support URL.** Public web URLs are live at `https://finfindr.app/privacy`, `https://finfindr.app/terms`, and `https://finfindr.app/support`.
- [ ] **BLOCKER: Final owner/legal review of Terms and Privacy copy.** Current in-app copy is an app-specific launch draft. Review entity name, retention/deletion promises, third-party providers, subscription terms, jurisdiction, refunds, IP ownership, and liability language before submission.
- [ ] **BLOCKER: Finish LLC/EIN and Apple paid-app business setup.** Florida LLC filing has been submitted and paid. Wait for approval, apply for the IRS EIN, then complete Apple/App Store Connect tax, banking, and paid-app agreement setup under the correct seller identity.
- [ ] **BLOCKER: Fix App Store Connect subscription product availability.** Fresh iOS dev-build logs on 2026-05-21 still show RevenueCat offering fetch failing with `None of the products registered in the RevenueCat dashboard could be fetched from App Store Connect`. Products are configured and RevenueCat is attached; finish Apple business setup, attach the first subscriptions to the app version, allow propagation, then retry sandbox/TestFlight.
- [x] **Make subscription/paywall metadata review-ready in RevenueCat.** RevenueCat template paywall is published and attached to the `default` offering with Terms/Privacy URLs.
- [ ] **BLOCKER: Complete real iOS dev build RevenueCat sandbox test.** Fresh EAS development build was installed and RevenueCat native logging works on 2026-05-21, but sandbox purchase cannot pass while StoreKit/App Store Connect returns empty offerings.
- [x] **Remove `ios.infoPlist.UIDesignRequiresCompatibility`.** Removed from `app.json` on 2026-05-20 so the app uses the default current iOS UI behavior; iPhone-only support is still controlled separately by `supportsTablet: false`.
- [x] **Resolve Supabase `public.spatial_ref_sys` RLS/security alert.** Warning no longer appears in Supabase dashboard; `supabase db lint --linked --schema public` returned no schema errors on 2026-05-20.
- [x] **Code-level free vs Angler gates are centralized and enforced.** Commit `65a4bd8` makes new/free users limited, allows tomorrow-only forecast preview, gates future forecast reads, gates recommender generation after step 4, gates Water Read generation after lake selection, and keeps Angler unrestricted.
- [x] **Confirm reviewer can access every gated feature.** `finfindr@hotmail.com` is configured as complimentary Angler access and successfully reached Angler-gated features in the fresh iOS dev build on 2026-05-21. This validates reviewer feature access, not the App Store purchase path.
- [x] **Account/auth lifecycle E2E is passing in the fresh iOS dev build.** Email signup, verification email, account deletion, recreating the same email after deletion, password reset email/link, and returning-user Sign in with Apple were QA-verified on device by 2026-05-22.
- [x] **Legal/safety page presentation QA passed.** Terms, Privacy, and Safety pages render with the corrected navy safe-area/header treatment and were visually checked on device by 2026-05-22. Final legal/entity copy review remains blocked on LLC/EIN.
- [ ] **HIGH: Use EAS Cloud or update local Xcode before native iOS builds.** `expo-doctor` now passes dependency checks, but the selected local Xcode is 15.2 and Expo SDK 55 expects Xcode 26 or newer.

## Proper Order

### 1. Freeze The Submission Surface

- [ ] Create a `release/app-store-v1` branch after current visual/subscription work is stable.
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
- [x] New accounts are created as `free` by default. Database default is `subscription_tier = 'free'`, onboarding explicitly upserts `subscription_tier: 'free'`, and missing/unknown tiers resolve to `free` in app gating.
- [x] Free vs Angler access policy is centralized in `lib/subscription.ts`.
- [x] Free users can preview tomorrow's forecast score/color, generate only the limited current-day Today's Bite report, complete recommender setup before the paywall, and search/select Water Read lakes before the paywall.
- [x] Angler users have full access to forecast reports, full Today's Bite, recommender generation, and Water Read generation.
- [x] Entitlement ID in code is `angler`.
- [x] Confirm RevenueCat entitlement exactly matches `angler`.
- [x] Confirm RevenueCat offering is current and has all products attached.
- [x] Attach a RevenueCat paywall/template to the current `default` offering.
- [x] Add App Store Connect API credentials in RevenueCat for the FinFindr iOS app.
- [x] Create matching auto-renewable subscription products in App Store Connect.
- [x] Confirm product IDs in App Store Connect match RevenueCat products exactly.
- [x] Add subscription group, reference names, localized display names, descriptions, prices, availability, and review screenshots.
- [x] Confirm both App Store Connect subscriptions no longer show `Missing Metadata`.
- [ ] Confirm RevenueCat no longer reports empty offerings in a fresh dev/TestFlight build. Still failing with empty offerings in the fresh iOS dev build on 2026-05-21.
- [ ] Complete Apple Paid Apps Agreement, banking, and tax forms after the LLC/EIN path is ready.
- [ ] Confirm App Store Connect business agreements show active/accepted, not pending.
- [ ] Ensure each first-time subscription/IAP is selected with the app version submission.
- [ ] Add the monthly and annual subscriptions to App Store Connect app version `1.0` before submitting the app/subscriptions for review.
- [ ] Allow App Store Connect/StoreKit propagation after business/subscription changes, then restart the app and retry.
- [ ] Test sandbox purchase on a physical iPhone dev build.
- [ ] Test cancel from purchase sheet.
- [ ] Test restore purchase after reinstall/sign out/sign in.
- [ ] Test entitlement changes update Supabase `profiles.subscription_tier`.
- [ ] Harden final subscription tier write path before launch: RevenueCat/server-confirmed entitlement should be the trusted way to update `profiles.subscription_tier`; users must not be able to self-spoof Angler from the client.
- [x] Test free user gating for Today's Bite, Tackle Box/recommender, and Water Read. Verified in the fresh iOS dev build on 2026-05-21; gated CTAs route into the subscription flow and currently show the unavailable fallback while App Store products are not returned.
- [x] Add App Store review notes explaining how to find and test subscription-gated features.
- [x] Add a reviewer account that either has an active sandbox subscription or can purchase using Apple sandbox. Current reviewer login is entered in App Store Connect; subscription purchase still needs sandbox validation after build upload.
- [x] Add Terms and Privacy links to subscription screen.
- [ ] Confirm paywall clearly shows subscription title, price, billing period, what unlocks, auto-renewal/cancel language, and any trial details before purchase.
- [ ] Confirm there are no external purchase links or CTAs for digital subscription access outside Apple IAP.
- [x] Add a clear “manage subscription” path or instructions from Settings, especially near account deletion.

### 4. Apple Login, Accounts, And Account Deletion

- [x] Sign in with Apple is enabled in `app.json`.
- [x] Sign in with Apple buttons exist on welcome/sign-in for iOS.
- [x] Email/password account creation exists.
- [x] Account deletion is exposed in Settings.
- [x] Account deletion calls a Supabase Edge Function that deletes the Supabase Auth user.
- [ ] Confirm account deletion removes or anonymizes associated profile/log/feedback/app data as promised in the Privacy Policy.
- [x] Add subscription warning before deletion: Apple says users with auto-renewing subscriptions should be told billing continues through Apple and asked to cancel first.
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
- [ ] Wait for Florida Sunbiz approval for `FinFindr LLC`; save the filed Articles, document number, and any Certificate of Status.
- [ ] Apply for the free IRS EIN only after the LLC is approved; use exact legal name `FinFindr LLC` and save the EIN confirmation letter.
- [ ] Update Terms/Privacy company/entity references after the LLC is officially approved.
- [ ] Decide Apple seller path: keep individual Apple developer account for now or start Apple organization enrollment / seller identity update after LLC/EIN documents are ready.
- [ ] Complete App Store Connect Digital Services Act/trader compliance if distributing in the EU.
- [ ] Confirm policy covers account data, email, location, photos/camera uploads, microphone/voice logs if enabled, fishing logs, support messages, purchases, diagnostics, and third parties.
- [ ] Document third parties: Supabase, RevenueCat, Resend, Open-Meteo, NOAA/NWS, USNO/Sunrise-Sunset, geocoding provider, and any AI/image providers actually used in production.
- [ ] Confirm no App Tracking Transparency prompt is needed. Current code does not show ad tracking or cross-app tracking SDKs.
- [ ] Confirm no third-party ads, gambling, contests, medical/safety claims, or regulated activity language appears.
- [x] Add safety disclaimer if fishing recommendations could be interpreted as navigation/safety guidance: conditions are informational, users are responsible for local laws/weather/water safety.
- [x] Confirm App Store age rating answers match camera, location, UGC/logging, and web/network content behavior. App Store Connect calculated 4+ with regional equivalents on 2026-05-20.

### 6. Permissions And Device Capabilities

- [x] Location permission purpose text exists.
- [x] Camera permission purpose text exists.
- [x] Photo permission purpose text exists.
- [x] Microphone permission purpose text exists.
- [ ] Verify iOS generated `Info.plist` contains `NSLocationWhenInUseUsageDescription`; current config only sets `locationAlwaysAndWhenInUsePermission`.
- [ ] Confirm app does not require location permission to access unrelated functionality.
- [ ] Test denial states for location, camera, photos, microphone, notifications, and biometrics.
- [ ] Confirm camera/photo/microphone features are complete, hidden, or gracefully unavailable.
- [ ] Confirm push notification permission is requested only in context, if used at all.

### 7. Backend And Supabase Launch Readiness

- [x] Resolve Supabase RLS/security alert or attach Supabase support/ticket outcome to launch notes.
- [ ] Confirm all required Edge Functions are deployed in the production Supabase project.
- [ ] Confirm required function secrets are set: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, feedback email vars, and any water-reader internal keys.
- [ ] Run production smoke tests for auth, profile creation, environment fetch, forecast scores, how-fishing, recommender, waterbody search, water-reader polygon/read, feedback, and delete-account.
- [ ] Confirm database migrations are applied in production.
- [ ] Confirm Row Level Security is enabled on user-owned app tables and service-role functions enforce authenticated user access.
- [ ] Confirm Supabase Auth redirect URLs include `https://finfindr.app/auth/confirm/` and app scheme links as needed.
- [ ] Confirm production domain forwards auth confirmation links into the app.
- [ ] Confirm backend rate limits and failure messages will not look like app bugs to reviewers.

### 8. App Completeness QA

- [x] Run TypeScript check. Latest pass was 2026-05-22 after auth resend cooldown updates: `npm run qa:water-reader-typecheck`.
- [x] Fix Expo SDK package version drift. `npx expo install --check` passed on 2026-05-21 after updating SDK 55 patch-level package versions.
- [ ] Local native iOS build toolchain: selected Xcode is 15.2; install/select Xcode 26+ before relying on local iOS native builds. EAS Cloud build remains the recommended path for the dev client.
- [ ] Run key Supabase/Deno tests for recommender and water-reader shared modules.
- [x] Run app on a physical iPhone from a development build. Fresh iOS dev client was installed and used for account/subscription-access QA on 2026-05-21/2026-05-22.
- [ ] Run app on a production-like TestFlight build.
- [x] Test cold install, sign-up, email verification, onboarding, sign-in, sign-out. Email account flow was verified E2E on device by 2026-05-22.
- [x] Test Sign in with Apple first-time and returning-user flows. Fresh iOS dev build logs showed Supabase Apple session creation on 2026-05-21; returning-user one-tap Sign in with Apple was verified on device by 2026-05-22.
- [x] Test password reset from email link. Verified on device by 2026-05-22.
- [x] Test every tab and every major screen without a subscription. Free-account gates were verified on device; gated CTAs route into the subscription flow and currently show the unavailable fallback while Apple products are unavailable.
- [x] Test every major screen with active Angler access. Verified on device using complimentary Angler reviewer access; actual paid sandbox subscription still must be tested after App Store products are returned.
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
- [x] Pricing and availability. App download is free and availability is United States only.
- [x] Manual release selected if you want control after approval.

### 9A. While LLC / EIN Is Pending

These are useful next moves that do not require the LLC approval, EIN, or Apple paid-app agreement to be active:

- [x] Choose and enter the final App Store subtitle: `Bite Forecasts & Tackle`.
- [x] Choose and confirm the primary App Store category: `Sports`.
- [ ] Re-read App Store description, promotional text, and keywords against the current product: free tier, Angler subscription, supported-water limits, no external purchase path.
- [ ] Review uploaded screenshots for fictional/non-sensitive account data, clear in-app use, and no misleading paid-feature promises.
- [ ] Confirm the Support URL page has a clear support email/contact path and loads without auth.
- [ ] Confirm public Privacy/Terms/Safety/Support URLs load cleanly in Safari, not just in-app.
- [ ] Prepare final App Review notes with exact demo credentials, reviewer account, feature test path, supported-water guidance, and the subscription status note.
- [ ] Run a final free-account walkthrough on a second email and capture short notes/screenshots for yourself.
- [ ] Create a sandbox Apple tester account in App Store Connect, even if purchases cannot complete until paid-app setup is active.
- [ ] Confirm all production Supabase Edge Functions and secrets are deployed/set before the TestFlight build.

### 9B. Business / LLC / Tax Follow-Up

- [ ] Watch for the Sunbiz approval email for the Florida LLC filing.
- [ ] Search Sunbiz once approved and save the public filing page/PDF for records.
- [ ] Apply for EIN directly through the IRS site; do not pay a third-party EIN site.
- [ ] Open/update a business bank account after EIN is available.
- [ ] Complete App Store Connect banking and tax forms with the final legal/tax identity.
- [ ] Confirm the Apple Paid Apps Agreement is active before expecting subscriptions to work reliably.
- [ ] Add the next Florida annual report reminder: file between January 1 and May 1 each year, starting the calendar year after formation.

### 10. Build, Upload, And Submit

- [ ] Build dev client: `eas build --profile development --platform ios`.
- [x] Confirm EAS production and development env vars are present for iOS builds: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`, and `EXPO_PUBLIC_AUTH_EMAIL_REDIRECT` verified on 2026-05-21.
- [ ] Install dev build on physical iPhone.
- [ ] Start Metro with env vars loaded and test RevenueCat sandbox.
- [ ] Build production: `eas build --profile production --platform ios`.
- [ ] Upload to App Store Connect.
- [ ] Add the build to the app version.
- [ ] Attach first-time IAP/subscriptions to the version submission.
- [ ] Submit for review.
- [ ] Monitor App Review messages and respond with exact steps, credentials, and screenshots/video if asked.

## Review Notes Draft

Use this as a starting point in App Store Connect after the unchecked items are done:

```text
FinFindr is a fishing forecast and tackle recommendation app. Reviewers can create an account with email/password or Sign in with Apple. A demo account is provided below.

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
- App Store Connect IAP metadata fields: https://developer.apple.com/help/app-store-connect/reference/in-app-purchase-information
- Apple App Store Connect IAP setup overview: https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/overview-for-configuring-in-app-purchases/
- RevenueCat offerings-empty troubleshooting: https://revenuecat.github.io/codelabs/troubleshooting/fetching-offerings/
- IRS EIN official application page: https://www.irs.gov/businesses/employer-identification-number
- Florida LLC fee reference: https://dos.fl.gov/sunbiz/forms/fees/llc-fees/
- Florida annual report reference: https://dos.fl.gov/sunbiz/manage-business/efile/annual-report/
