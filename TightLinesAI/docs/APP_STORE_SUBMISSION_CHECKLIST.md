# FinFindr App Store Submission Checklist

Last updated: 2026-05-20

This is the living launch checklist for getting FinFindr through Apple review with the best chance of a fast approval. Check items off only when verified on the actual production or review build, not just assumed from code.

Apple can still reject an app for reviewer-specific findings, policy interpretation, backend outages, or bugs we miss. This checklist is built around the current Apple docs plus what is visible in the codebase.

## Current Top Risks

- [x] **Publish Privacy Policy, Terms of Service, and Support URL.** Public web URLs are live at `https://finfindr.app/privacy`, `https://finfindr.app/terms`, and `https://finfindr.app/support`.
- [ ] **BLOCKER: Final owner/legal review of Terms and Privacy copy.** Current in-app copy is an app-specific launch draft. Review entity name, retention/deletion promises, third-party providers, subscription terms, jurisdiction, refunds, IP ownership, and liability language before submission.
- [ ] **BLOCKER: Finish LLC/EIN and Apple paid-app business setup.** Florida LLC filing has been submitted and paid. Wait for approval, apply for the IRS EIN, then complete Apple/App Store Connect tax, banking, and paid-app agreement setup under the correct seller identity.
- [ ] **BLOCKER: Fix App Store Connect subscription product availability.** Current dev-build logs show RevenueCat requesting `finfindr_angler_monthly` and `finfindr_angler_annual`, but StoreKit returns zero products. Products are configured and RevenueCat is attached; finish Apple business setup, attach the first subscriptions to the app version, allow propagation, then retry sandbox/TestFlight.
- [x] **Make subscription/paywall metadata review-ready in RevenueCat.** RevenueCat template paywall is published and attached to the `default` offering with Terms/Privacy URLs.
- [ ] **BLOCKER: Complete real iOS dev build RevenueCat sandbox test.** Expo Go cannot test `react-native-purchases` or `react-native-purchases-ui`; use a fresh EAS development build on a physical iPhone after native dependency changes.
- [x] **Remove `ios.infoPlist.UIDesignRequiresCompatibility`.** Removed from `app.json` on 2026-05-20 so the app uses the default current iOS UI behavior; iPhone-only support is still controlled separately by `supportsTablet: false`.
- [ ] **HIGH: Resolve or document the Supabase `public.spatial_ref_sys` RLS alert.** This may be a PostGIS/system-table false positive, but keep Supabase ticket details in review/ops notes and do not leave avoidable database warnings unexamined.
- [ ] **HIGH: Confirm reviewer can access every gated feature.** Apple requires full review access when login/subscription/backends are involved.

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
- [ ] Confirm Apple Developer app record uses the same bundle ID.
- [ ] Confirm SKU, primary language, category, age rating, copyright, and contact information in App Store Connect.
- [ ] Verify `ITSAppUsesNonExemptEncryption: false` is accurate for your app’s use of standard HTTPS/TLS only.
- [x] Decide on iPhone-only vs iPad support. Current config has `supportsTablet: false`; v1 will launch iPhone-only.
- [x] Review and remove `UIDesignRequiresCompatibility: true` unless you intentionally need iPhone compatibility mode.
- [ ] Increment build number for every uploaded build.

### 3. RevenueCat / In-App Purchase Readiness

- [x] `react-native-purchases` is installed.
- [x] `react-native-purchases-ui` is installed for RevenueCat template paywalls.
- [x] RevenueCat store supports iOS key lookup via `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`.
- [x] Purchase, restore, customer info refresh, and entitlement sync flows exist.
- [x] Limited report CTA, subscribe prompts, and membership screen can present RevenueCat template paywalls through `presentPaywallIfNeeded`.
- [x] Entitlement ID in code is `angler`.
- [x] Confirm RevenueCat entitlement exactly matches `angler`.
- [x] Confirm RevenueCat offering is current and has all products attached.
- [x] Attach a RevenueCat paywall/template to the current `default` offering.
- [x] Add App Store Connect API credentials in RevenueCat for the FinFindr iOS app.
- [x] Create matching auto-renewable subscription products in App Store Connect.
- [x] Confirm product IDs in App Store Connect match RevenueCat products exactly.
- [x] Add subscription group, reference names, localized display names, descriptions, prices, availability, and review screenshots.
- [x] Confirm both App Store Connect subscriptions no longer show `Missing Metadata`.
- [ ] Confirm RevenueCat no longer reports empty offerings in a fresh dev/TestFlight build.
- [ ] Complete Apple Paid Apps Agreement, banking, and tax forms after the LLC/EIN path is ready.
- [ ] Confirm App Store Connect business agreements show active/accepted, not pending.
- [ ] Ensure each first-time subscription/IAP is selected with the app version submission.
- [ ] Add the monthly and annual subscriptions to App Store Connect app version `1.0` before submitting the app/subscriptions for review.
- [ ] Allow App Store Connect/StoreKit propagation after business/subscription changes, then restart the app and retry.
- [ ] Test sandbox purchase on a physical iPhone dev build.
- [ ] Test cancel from purchase sheet.
- [ ] Test restore purchase after reinstall/sign out/sign in.
- [ ] Test entitlement changes update Supabase `profiles.subscription_tier`.
- [ ] Test free user gating for Today's Bite, Tackle Box/recommender, and Water Read.
- [ ] Add App Store review notes explaining how to find and test subscription-gated features.
- [ ] Add a reviewer account that either has an active sandbox subscription or can purchase using Apple sandbox.
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
- [ ] Test delete account on real device and confirm the user cannot sign back in.
- [ ] Confirm Apple private relay email works for support/password flows.
- [ ] Confirm email confirmation and password reset deep links work from the production domain.

### 5. Privacy, Legal, And Data Disclosures

- [x] Publish Privacy Policy URL: `https://finfindr.app/privacy`.
- [x] Publish Terms of Service URL: `https://finfindr.app/terms`.
- [x] Publish Support URL or support page: `https://finfindr.app/support`.
- [x] Make Terms/Privacy tappable from sign-up.
- [x] Require explicit Terms/Privacy checkbox acceptance during email sign-up.
- [ ] For stronger audit evidence, store Terms/Privacy acceptance timestamp and document version on the user profile or a legal acceptance table.
- [x] Make Privacy/Terms/Support reachable from Settings.
- [ ] Complete App Privacy Nutrition Label in App Store Connect.
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
- [ ] Confirm App Store age rating answers match camera, location, UGC/logging, and web/network content behavior.

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

- [ ] Resolve Supabase RLS alert or attach Supabase support/ticket outcome to launch notes.
- [ ] Confirm all required Edge Functions are deployed in the production Supabase project.
- [ ] Confirm required function secrets are set: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, feedback email vars, and any water-reader internal keys.
- [ ] Run production smoke tests for auth, profile creation, environment fetch, forecast scores, how-fishing, recommender, waterbody search, water-reader polygon/read, feedback, and delete-account.
- [ ] Confirm database migrations are applied in production.
- [ ] Confirm Row Level Security is enabled on user-owned app tables and service-role functions enforce authenticated user access.
- [ ] Confirm Supabase Auth redirect URLs include `https://finfindr.app/auth/confirm/` and app scheme links as needed.
- [ ] Confirm production domain forwards auth confirmation links into the app.
- [ ] Confirm backend rate limits and failure messages will not look like app bugs to reviewers.

### 8. App Completeness QA

- [ ] Run TypeScript check: `npm run qa:water-reader-typecheck`.
- [ ] Run key Supabase/Deno tests for recommender and water-reader shared modules.
- [ ] Run app on a physical iPhone from a development build.
- [ ] Run app on a production-like TestFlight build.
- [ ] Test cold install, sign-up, email verification, onboarding, sign-in, sign-out.
- [ ] Test Sign in with Apple first-time and returning-user flows.
- [ ] Test password reset from email link.
- [ ] Test every tab and every major screen without a subscription.
- [ ] Test every major screen with an active Angler subscription.
- [ ] Test airplane mode / poor network states.
- [ ] Test small screen iPhone and large iPhone layouts.
- [ ] Test light mode only behavior since `userInterfaceStyle` is `light`.
- [ ] Confirm no crashes in Xcode device logs during a full walkthrough.
- [ ] Confirm no secret keys are exposed in public env vars beyond allowed public SDK keys.
- [ ] Review bundle size and remove unused backup images/assets if they ship in the app bundle.

### 9. App Store Connect Metadata

- [ ] App name: `FinFindr`.
- [ ] Subtitle.
- [ ] Promotional text.
- [ ] Description.
- [ ] Keywords.
- [ ] Support URL.
- [ ] Marketing URL, if available.
- [ ] Privacy Policy URL.
- [ ] App category.
- [ ] Age rating questionnaire.
- [x] Screenshots for required iPhone sizes. Six 6.5-inch iPhone portrait screenshots uploaded at 1242 x 2688; this satisfies the required iPhone screenshot set when no 6.9-inch screenshots are provided, and App Store Connect scales them for other iPhone display sizes.
- [ ] App preview video, optional.
- [ ] Review contact name, phone, and email.
- [ ] Demo account username/password.
- [ ] Review notes covering subscription test path, location usage, any limited water coverage, and Supabase known issue if relevant.
- [ ] Export compliance.
- [ ] Content rights.
- [ ] Pricing and availability.
- [ ] Manual release selected if you want control after approval.

### 9A. Business / LLC / Tax Follow-Up

- [ ] Watch for the Sunbiz approval email for the Florida LLC filing.
- [ ] Search Sunbiz once approved and save the public filing page/PDF for records.
- [ ] Apply for EIN directly through the IRS site; do not pay a third-party EIN site.
- [ ] Open/update a business bank account after EIN is available.
- [ ] Complete App Store Connect banking and tax forms with the final legal/tax identity.
- [ ] Confirm the Apple Paid Apps Agreement is active before expecting subscriptions to work reliably.
- [ ] Add the next Florida annual report reminder: file between January 1 and May 1 each year, starting the calendar year after formation.

### 10. Build, Upload, And Submit

- [ ] Build dev client: `eas build --profile development --platform ios`.
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
- Apple App Review Guidelines: https://developer.apple.com/appstore/resources/approval/guidelines.html
- Apple account deletion guidance: https://developer.apple.com/support/offering-account-deletion-in-your-app/
- Apple app privacy details: https://developer.apple.com/app-store/app-privacy-details/
- App Store Connect app submission help: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app
- App Store Connect first-time IAP/subscription submission help: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase
- App Store Connect IAP metadata fields: https://developer.apple.com/help/app-store-connect/reference/in-app-purchase-information
- Apple App Store Connect IAP setup overview: https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/overview-for-configuring-in-app-purchases/
- RevenueCat offerings-empty troubleshooting: https://revenuecat.github.io/codelabs/troubleshooting/fetching-offerings/
- IRS EIN official application page: https://www.irs.gov/businesses/employer-identification-number
- Florida LLC fee reference: https://dos.fl.gov/sunbiz/forms/fees/llc-fees/
- Florida annual report reference: https://dos.fl.gov/sunbiz/manage-business/efile/annual-report/
