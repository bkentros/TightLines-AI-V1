import { LEGAL_URLS } from './legalLinks';

export type LegalDocumentKey = 'privacy' | 'terms' | 'safety';

export interface LegalDocumentSection {
  title: string;
  body: string[];
}

export interface LegalDocument {
  key: LegalDocumentKey;
  eyebrow: string;
  navTitle: string;
  title: string;
  subtitle: string;
  updated: string;
  externalUrl?: string;
  sections: LegalDocumentSection[];
}

// The public pages under legal-site/{privacy,terms,safety}/ are generated from
// this file. Edit here, then regenerate them so the app and web always match.
const updated = 'October 2, 2026';

export const LEGAL_DOCUMENTS: Record<LegalDocumentKey, LegalDocument> = {
  privacy: {
    key: 'privacy',
    eyebrow: 'FINFINDR · PRIVACY',
    navTitle: 'PRIVACY',
    title: 'Privacy Policy.',
    subtitle:
      'How FinFindr LLC handles account data, fishing context, device permissions, purchases, maps, and support messages.',
    updated,
    externalUrl: LEGAL_URLS.privacy,
    sections: [
      {
        title: 'Who Operates FinFindr',
        body: [
          'FinFindr is operated by FinFindr LLC, a Florida limited liability company. In this Privacy Policy, FinFindr, we, us, and our refer to FinFindr LLC and the FinFindr app, websites, and related services, including PierCast and the Live Lake Map.',
          'Questions about privacy or data deletion can be sent to support@finfindr.app.',
        ],
      },
      {
        title: 'Information We Collect',
        body: [
          'Account information such as email address (including business or custom domains you can verify), username, authentication provider, profile settings, home region, subscription tier, and onboarding preferences.',
          'Fishing and app data you choose to create, including catches, sessions, locations, species preferences, photos or water images, voice logs if enabled, support messages, and feedback.',
          'Location information when you grant permission or manually choose a location. FinFindr uses this to build weather, tide, moon, river-migration, and fishing-condition context. PierCast and the Live Lake Map do not need your device location.',
          'River Migration selections and interactions, such as the selected river, species, season, presentation state, report requests, and feature usage. Spot Finder access names and river sections are configured public-location content and do not, by themselves, reveal that you visited or were physically present at a listed place.',
          'PierCast and Live Lake Map information, such as your target species, the cities, lakes, layers, and forecast hours you view, piers, buoys, and weather alerts you open, and records of map visits and access passes used to provide free previews, confirm subscription access, and prevent abuse. Map display settings, such as units and layers, are saved on your device.',
          'Purchase and entitlement status from the app store used for purchase, including the App Store, Google Play where supported, and RevenueCat. FinFindr does not receive full payment card numbers from Apple or Google.',
          'Product analytics and interaction data, such as app opens, screen views, feature usage, request performance, paywall events, purchase and restore events, subscription tier, region settings, onboarding status, and similar product-quality signals. Analytics may be associated with an account or user identifier when you are signed in.',
          'Operational data such as device platform, app version, IP address, rate-limit records, cache identifiers, error context, and diagnostics needed to run, secure, and improve the service.',
        ],
      },
      {
        title: 'How We Use Information',
        body: [
          'To create and secure your account, sync your profile, and provide forecasts, tackle recommendations, color picks, water reads, River Migration reads, Spot Finder content, PierCast rankings and city reports, the Live Lake Map, fishing logs, and subscription-gated features.',
          'To respond to support requests, troubleshoot bugs, prevent abuse, enforce rate limits and free-preview limits, improve app quality, maintain production systems, and protect users and FinFindr.',
          'To measure product usage and subscription flows, understand which app areas need improvement, and confirm that subscription and restore systems are working correctly.',
          'To send transactional emails such as account verification, password reset, support messages, and important account or service notices.',
        ],
      },
      {
        title: 'Third-Party Services',
        body: [
          'FinFindr uses service providers for app infrastructure, including Supabase (accounts and databases), Cloudflare (hosting for finfindr.app and the Live Lake Map, security, and rate limiting), RevenueCat (subscriptions), PostHog (product analytics), Resend (email), Apple platform services, and Google platform services where supported.',
          'FinFindr uses public data sources for core functionality, including Open-Meteo, NOAA/NWS, NOAA CO-OPS, NOAA National Data Buoy Center, NOAA Great Lakes forecast models, the Great Lakes Observing System (GLOS), the U.S. Geological Survey (USGS), Monitor My Watershed, USNO, Sunrise-Sunset.org, mapping and geocoding providers, and similar sources.',
          'Weather, water, sun, moon, map, and geocoding providers may receive coordinates, search terms, or request context needed to return app data. They are not given your FinFindr account profile.',
          'When you open the Live Lake Map, your device loads content directly from Cloudflare, OpenFreeMap (map tiles based on OpenStreetMap data), Google Fonts, and the National Weather Service (weather alerts). These providers receive your IP address and standard browser information, and process it under their own privacy policies.',
          'Spot Finder can open official agency, land-manager, municipal, mapping, or other source pages in your browser or another app. Once opened, those third parties process information under their own privacy policies and practices.',
          'PostHog is used for product analytics, not advertising. Session replay is disabled in the app configuration, and FinFindr does not use PostHog to sell data or track you across other companies\' apps or websites.',
          'Store providers and RevenueCat process purchase and entitlement records under their own policies. App Store billing, cancellation, renewal, and refund decisions are handled by Apple for App Store purchases.',
          'We require service providers that process personal information on our behalf to protect it consistently with our agreements and applicable law. Their services may also be governed by their own privacy policies.',
          'We do not sell your personal information, share it for cross-context behavioral advertising, or use it to serve targeted third-party advertising in the app.',
        ],
      },
      {
        title: 'Permissions',
        body: [
          'Location, camera, photo library, microphone, notifications, and biometric permissions are requested only when a feature needs them. You can deny or revoke permissions in device settings.',
          'Denying a permission may limit related features, but unrelated app areas should remain available whenever possible.',
        ],
      },
      {
        title: 'Account Deletion And Subscription Records',
        body: [
          'You can request account deletion from Settings. Deletion removes your FinFindr authentication account and app-owned data tied to your profile where deletion is required and technically available.',
          'Some records may be retained, anonymized, or aggregated when needed for security, legal compliance, payment records, fraud prevention, dispute handling, or service operations.',
          'Deleting your FinFindr account does not automatically cancel an auto-renewable subscription managed by Apple or Google. Cancel subscriptions from your store account settings.',
          'If you delete an account with an active or historical subscription, Restore Purchases may not reconnect that subscription to a new or recreated FinFindr account unless support can verify recovery.',
          'Store providers and RevenueCat may keep purchase and entitlement records under their own policies.',
        ],
      },
      {
        title: 'Security And Retention',
        body: [
          'We use reasonable administrative, technical, and organizational measures intended to protect app data, but no internet or mobile service can be guaranteed to be perfectly secure.',
          'We keep personal information for as long as needed to provide the app, comply with law, resolve disputes, enforce agreements, prevent abuse, and maintain records required for subscriptions, refunds, tax, accounting, or security purposes.',
          'FinFindr is operated from the United States, and information is processed and stored in the United States.',
        ],
      },
      {
        title: 'Your Choices And Rights',
        body: [
          'You can update certain profile settings in the app, revoke device permissions in system settings, clear map settings by removing the app or its data, and request account deletion from Settings.',
          'Depending on where you live, including California and other U.S. states with privacy laws, you may have rights to request access to, correction of, deletion of, or a copy of certain personal information, and to opt out of sale, sharing, or targeted advertising. FinFindr does not sell or share personal information for those purposes.',
          'Contact support@finfindr.app to make a request. We may need to verify your identity, will respond within the time required by applicable law, and will not discriminate against you for exercising your rights. If we deny your request, you may appeal by replying to our response.',
        ],
      },
      {
        title: 'Children',
        body: [
          'FinFindr is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child provided personal information, contact support@finfindr.app so we can review and delete it.',
        ],
      },
      {
        title: 'Changes And Contact',
        body: [
          'We may update this Privacy Policy as the app, legal requirements, or our practices change. The updated date above shows when it last changed, and material updates will be reflected in the app or on the published web version.',
          'Questions about privacy or data deletion can be sent to support@finfindr.app.',
        ],
      },
    ],
  },
  terms: {
    key: 'terms',
    eyebrow: 'FINFINDR · TERMS',
    navTitle: 'TERMS',
    title: 'Terms of Service.',
    subtitle:
      'The rules for using FinFindr, subscriptions, account access, app content, and fishing-condition guidance. Includes a binding arbitration agreement and class action waiver.',
    updated,
    externalUrl: LEGAL_URLS.terms,
    sections: [
      {
        title: 'Agreement',
        body: [
          'FinFindr is operated by FinFindr LLC, a Florida limited liability company. In these Terms, FinFindr, we, us, and our refer to FinFindr LLC and the FinFindr app, websites, and related services, including PierCast and the Live Lake Map.',
          'These Terms apply to the FinFindr mobile app, the Live Lake Map, public legal and support pages, and related services.',
          'By creating an account, subscribing, accessing paid features, or using FinFindr, you agree to these Terms, the Privacy Policy, the Safety Notice, and any app-store terms that apply to your download or subscription.',
          'IMPORTANT: The Dispute Resolution section below requires most disputes to be resolved through binding individual arbitration instead of court, and waives class actions and jury trials. You can opt out within 30 days as described there.',
          'If you do not agree, do not use the app.',
        ],
      },
      {
        title: 'Eligibility And Accounts',
        body: [
          'You must be at least 13 years old to use FinFindr. If you are under the age of majority where you live, you may use FinFindr only with the involvement and permission of a parent or legal guardian, who agrees to these Terms on your behalf.',
          'You are responsible for the activity on your account and for keeping your sign-in credentials secure.',
          'You must provide accurate account information and use FinFindr only where you are legally permitted to do so. You may sign up with any valid email address you can verify, including business or custom domains.',
          'You may not misuse the app, interfere with the service, attempt to bypass subscription gates or free-preview limits, create multiple accounts to obtain free access, scrape or reverse engineer the service, or use FinFindr for unlawful or unsafe activity.',
        ],
      },
      {
        title: 'Subscriptions',
        body: [
          'Angler subscriptions unlock paid features while the subscription is active. Subscription pricing, billing period, renewal, cancellation, and refunds are handled by the app store account used for purchase, including the App Store or Google Play where supported.',
          'Subscription access is tied to the FinFindr account that originally purchased or restored the active subscription. Restore Purchases is intended to reconnect that subscription to the original FinFindr account and may not transfer access to a different FinFindr account.',
          'Subscriptions renew automatically unless canceled through your store account settings before renewal. Deleting your FinFindr account does not cancel store billing and may prevent subscription access from being restored to a new or recreated FinFindr account.',
          'Features included in a subscription may change over time as we add, improve, or retire features.',
          'FinFindr does not provide external purchase links for digital subscription access inside the app.',
        ],
      },
      {
        title: 'Free Previews',
        body: [
          'FinFindr may offer limited free uses of paid features, such as free reports or free Live Lake Map visits. Free previews are limited to one per account unless stated otherwise, have no cash value, and may be changed, limited, or ended at any time.',
        ],
      },
      {
        title: 'Refunds And Store Billing',
        body: [
          'FinFindr LLC does not directly process App Store or Google Play subscription payments, cancellations, renewals, or refunds.',
          'Refund requests for store purchases must be submitted through the store account used for purchase and are handled under that store provider\'s policies, except where applicable law requires otherwise.',
          'Deleting a FinFindr account, losing access because a subscription is linked to another FinFindr account, or choosing not to use paid features does not automatically create a separate refund obligation from FinFindr LLC.',
        ],
      },
      {
        title: 'Fishing Content',
        body: [
          'Forecasts, tackle recommendations, color picks, water reads, River Migration reads, PierCast rankings and city reports, Live Lake Map layers, scores, timing windows, species suggestions, and related content are informational planning tools. They are not professional, legal, navigational, emergency, medical, environmental, boating, or safety advice.',
          'Much of this content is estimated or modeled from public data and researched patterns. It can be wrong, delayed, or different from the conditions you find on the water.',
          'Maps, structure reads, river-section guidance, and location-related features are not depth charts, property boundary tools, marine charts, emergency routes, official access maps, or substitutes for official maps and local sources.',
          'You are responsible for checking local laws, licensing, access rules, harvest limits, weather, water conditions, hazards, closures, and safety risks before fishing.',
        ],
      },
      {
        title: 'PierCast And The Live Lake Map',
        body: [
          'PierCast rankings combine a typical seasonal outlook for your target species with modeled nearshore water temperature. They are planning estimates, not observations of fish, catch probabilities, or statements that a pier is open, accessible, safe, or productive.',
          'Water temperature, wind, wave, and current forecasts on PierCast and the Live Lake Map come from NOAA Great Lakes forecast models and other public sources. Model values describe broad areas and can differ substantially from conditions at a specific pier, beach, or depth, especially near shore, during upwelling, and around storms.',
          'Temperatures below the surface are modeled estimates.',
          'Wave heights shown are modeled averages. Individual waves can be much larger, nearly twice the height shown, and conditions can change faster than forecasts update.',
          'Buoy, station, and sensor readings are provided by third parties such as NOAA and the Great Lakes Observing System. They may be delayed, offline, provisional, or incorrect, and describe only the instrument\'s location.',
          'Weather alerts shown on the map come from the National Weather Service and may be incomplete, delayed, or missing. The map is not a warning service. Check weather.gov and official alerts before and during any trip.',
          'Pier, breakwall, and shoreline locations and depth shading are for orientation only. They are not navigation charts, access maps, or statements that a structure is public, open, or safe to walk on.',
        ],
      },
      {
        title: 'River Migration And Spot Finder',
        body: [
          'River Migration stage, activity, presence, and section outputs are estimates and inferences based on configured seasonal patterns, researched fishery context, and available environmental data. They are not direct observations, biological surveys, sonar readings, catch probabilities, or guarantees that fish are present, active, moving, or catchable in a stated section or at a stated time. When an official Fish Counts card is shown, its number is a direct observation only at the named facility and for the labeled period and categories; it is not total river abundance, a live fish-location report, catch probability, or a guarantee that fish are present, active, moving, or catchable elsewhere.',
          'Migration Stage estimates seasonal progression. Activity Outlook estimates conditional fish movement or responsiveness. Seasonal Presence provides seasonal and historical context. Fishing Shape describes presentation workability. Gauge Read summarizes available monitoring data. Each answers a limited question and none determines safety, legal access, or whether fish occupy every part of a river.',
          'Spot Finder identifies configured public-access names and broad, stage-based starting sections inside the supported migration corridor. A recommendation is planning context, not live fish tracking, a precise fish location, an access inspection, route guidance, or a statement that every listed site is productive, open, reachable, or safe.',
          'Labels such as Lower, Middle, and Upper describe relative portions of FinFindr\'s supported migration corridor, not necessarily the entire named river. They do not establish property boundaries, public-entry rights, navigability, fishing legality, or uniform fish distribution. Dams, weirs, fish ladders, refuges, closures, and species passage limits can restrict the corridor and nearby activity.',
        ],
      },
      {
        title: 'Access, Regulations And External Sources',
        body: [
          'A listed access name, pier, or city does not guarantee legal parking, shore or pier fishing, launch suitability, open roads, operating hours, fee status, safe wading or boating, or permission to enter or cross neighboring land. Posted signs, current property boundaries, closures, and instructions from the responsible agency, land manager, or property owner control.',
          'Fishing regulations, emergency orders, refuge boundaries, dam-safety zones, pier closures, access conditions, and third-party pages can change without notice. FinFindr reminders and source links may be incomplete, delayed, moved, corrected, or unavailable and are not a complete statement of current law or site conditions.',
          'Links and source attributions are provided for research and convenience. FinFindr does not control third-party content, and a link or attribution does not mean that the third party endorses FinFindr or has independently approved FinFindr\'s interpretation.',
        ],
      },
      {
        title: 'Our Content And Your License',
        body: [
          'FinFindr LLC owns the app, websites, scores, rankings, maps, map frames, reports, text, designs, artwork, and data compilations we create, and they are protected by intellectual property laws. Third-party data and map content remain the property of their owners and are used under their licenses, including OpenStreetMap data under the Open Database License.',
          'We grant you a limited, personal, non-exclusive, non-transferable, revocable license to use FinFindr for your own non-commercial fishing planning while you follow these Terms.',
          'You may not copy, scrape, harvest, frame, resell, redistribute, or build a competing product or dataset from FinFindr content, forecasts, rankings, or map data, or access the service through bots or other automated means, except as allowed by law.',
        ],
      },
      {
        title: 'User Content And Feedback',
        body: [
          'You keep ownership of the catch logs, photos, notes, feedback, and other content you submit.',
          'You grant FinFindr LLC permission to host, process, display, and use that content as needed to operate, secure, support, analyze, and improve the app.',
          'If you send ideas or suggestions, we may use them without any obligation to you.',
          'Do not submit unlawful, harmful, infringing, private, unsafe, misleading, or abusive content.',
        ],
      },
      {
        title: 'Service Availability',
        body: [
          'FinFindr depends on network services, public data sources, device permissions, store systems, and third-party providers. Features may be unavailable, delayed, incomplete, or inaccurate.',
          'River and lake conditions may be measured at configured gauges, buoys, or monitoring stations and may differ from the conditions at another location or time. Gauge, buoy, weather, and forecast data may also be delayed, provisional, modeled, corrected, incomplete, or unavailable. When fresh data is unavailable, FinFindr may show the most recent available forecast.',
          'Coverage for water bodies and data sources varies by region. Unsupported or limited waters may show limited guidance rather than a full read.',
          'We may change, suspend, limit, or discontinue features at any time, including where needed for safety, reliability, legal compliance, abuse prevention, or product changes.',
        ],
      },
      {
        title: 'Suspension And Termination',
        body: [
          'You may stop using FinFindr and delete your account at any time from Settings.',
          'We may suspend or end your access if you violate these Terms, misuse the service, create risk or legal exposure for FinFindr or others, or if we discontinue the service. Sections that by their nature should survive, including ownership, disclaimers, limitation of liability, your responsibility for claims, and dispute resolution, survive termination.',
        ],
      },
      {
        title: 'No Guarantees',
        body: [
          'FinFindr is provided for planning and informational use. We do not guarantee catches, fishing results, outcomes, water access, legal access, coverage, uptime, safety, weather or water-temperature accuracy, data availability, or that app guidance will be accurate for the exact conditions you encounter.',
          'To the fullest extent allowed by law, FinFindr is provided as is and as available, without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, title, accuracy, and non-infringement.',
        ],
      },
      {
        title: 'Assumption Of Outdoor Risk',
        body: [
          'Fishing and related travel involve inherent risks, including injury, drowning, boating accidents, waves washing over piers and breakwalls, slippery or icy surfaces, dangerous currents, cold water, weather exposure, lightning, heat, ice, deep or moving water, wildlife, trespass, equipment failure, remote areas, limited cell service, and changing water conditions.',
          'You are responsible for your own decisions, safety gear, legal compliance, route choices, launch, pier, and access choices, water access, and whether conditions are safe enough for you to fish.',
          'You voluntarily assume the risks of fishing, boating, wading, pier fishing, travel, and outdoor activity. To the fullest extent allowed by law, FinFindr LLC is not responsible for injuries, deaths, losses, citations, property damage, or other consequences from your fishing activity, travel, or reliance on app information.',
        ],
      },
      {
        title: 'Limitation Of Liability',
        body: [
          'To the fullest extent allowed by law, FinFindr LLC and its owners, officers, employees, contractors, service providers, data providers, and affiliates will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or for lost profits, lost data, lost opportunities, outdoor incidents, personal injury, death, property damage, or third-party claims connected to use of the app.',
          'To the fullest extent allowed by law, FinFindr LLC\'s total liability for any claim related to the app or these Terms will not exceed the greater of the amount you paid to FinFindr through app-store subscriptions in the 12 months before the claim or $100.',
          'Some jurisdictions do not allow certain limitations, so parts of this section may not apply to every user.',
        ],
      },
      {
        title: 'Your Responsibility For Claims',
        body: [
          'To the fullest extent allowed by law, you will defend, indemnify, and hold harmless FinFindr LLC and its owners, officers, employees, and contractors from claims, losses, damages, liabilities, costs, and expenses, including reasonable attorneys\' fees, that arise from your unlawful conduct, unsafe activity, submitted content, breach of these Terms, violation of another person\'s rights, or misuse of FinFindr.',
        ],
      },
      {
        title: 'Dispute Resolution And Arbitration',
        body: [
          'Informal resolution first. Before starting arbitration or a lawsuit, you and FinFindr agree to try to resolve any dispute informally for at least 60 days. Send a written description of the dispute and the relief you want to support@finfindr.app.',
          'Binding individual arbitration. If the dispute is not resolved informally, you and FinFindr LLC agree that any dispute, claim, or controversy arising out of or relating to FinFindr or these Terms will be resolved by binding individual arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules, rather than in court. The Federal Arbitration Act governs this section. The arbitrator decides all issues, including the scope and enforceability of this agreement, except as stated below. Hearings may take place by video, by phone, in your county of residence, or as the arbitrator decides. Payment of filing and arbitrator fees follows the AAA Consumer Arbitration Rules.',
          'Exceptions. Either party may bring an individual claim in small claims court if it qualifies, and either party may seek court relief to stop infringement or misuse of intellectual property or unauthorized access to the service.',
          'Class action and jury trial waiver. You and FinFindr may bring claims only in an individual capacity, not as a plaintiff or class member in any class, collective, consolidated, or representative proceeding. The arbitrator may not consolidate claims or award relief to anyone other than the individual party. You and FinFindr waive the right to a jury trial. If this class action waiver is found unenforceable for a claim, that claim must be decided by a court, not an arbitrator.',
          'Opt-out. You may opt out of this arbitration agreement by emailing support@finfindr.app within 30 days after you first accept these Terms, with the subject line "Arbitration Opt-Out" and your name and account email. Opting out does not affect the rest of these Terms.',
          'Changes. If we change this section, the change will not apply to a dispute you already notified us about.',
        ],
      },
      {
        title: 'Governing Law And Venue',
        body: [
          'These Terms are governed by the laws of the State of Florida, without regard to conflict-of-law rules, and by applicable federal law. Any claim not subject to arbitration must be brought exclusively in the state or federal courts located in Florida, and you and FinFindr consent to personal jurisdiction there.',
          'Nothing in these Terms limits consumer rights that cannot be waived under the law where you live.',
        ],
      },
      {
        title: 'Apple And Google',
        body: [
          'These Terms are between you and FinFindr LLC only, not Apple Inc. or Google LLC. FinFindr LLC, not Apple or Google, is solely responsible for the app and its content.',
          'Apple has no obligation to provide maintenance or support for the app. If the app fails to conform to an applicable warranty, you may notify Apple, and Apple may refund the purchase price, if any; to the maximum extent permitted by law, Apple has no other warranty obligation for the app.',
          'Apple is not responsible for addressing claims relating to the app, including product liability claims, claims that the app fails to meet legal or regulatory requirements, consumer protection or privacy claims, or claims that the app infringes a third party\'s intellectual property rights. FinFindr LLC is responsible for investigating and resolving those claims as required by these Terms.',
          'You represent that you are not located in a country subject to a U.S. Government embargo or designated as a terrorist-supporting country, and that you are not on any U.S. Government list of prohibited or restricted parties.',
          'You must comply with applicable third-party terms when using the app. Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you as a third-party beneficiary.',
        ],
      },
      {
        title: 'General',
        body: [
          'These Terms, together with the Privacy Policy and Safety Notice, are the entire agreement between you and FinFindr about the service. If any part is found unenforceable, the rest remains in effect. Our failure to enforce a provision is not a waiver. You may not transfer these Terms; we may transfer them in connection with a merger, acquisition, or sale of assets.',
          'We are not responsible for delays or failures caused by events outside our reasonable control, such as outages of data providers, networks, or hosting services.',
        ],
      },
      {
        title: 'Changes And Contact',
        body: [
          'We may update these Terms as the app, legal requirements, or our business changes. The updated date above shows when they last changed, and material updates will be reflected in the app or on the published web version. Continuing to use FinFindr after an update means you accept the updated Terms.',
          'Questions can be sent to support@finfindr.app.',
        ],
      },
    ],
  },
  safety: {
    key: 'safety',
    eyebrow: 'FINFINDR · SAFETY',
    navTitle: 'SAFETY',
    title: 'Safety Notice.',
    subtitle:
      'Fishing recommendations are planning context, not a substitute for field judgment or official safety sources.',
    updated,
    externalUrl: LEGAL_URLS.safety,
    sections: [
      {
        title: 'Use Field Judgment',
        body: [
          'FinFindr is operated by FinFindr LLC and provides informational fishing guidance, including River Migration, Spot Finder, PierCast, and Live Lake Map planning context, based on configured seasonal patterns, forecast models, and available weather, water, species, location, and public-source information. Conditions can change quickly.',
          'Always verify current weather, water levels, waves, closures, hazards, access rules, and local fishing regulations before you go.',
          'Do not rely on FinFindr to decide whether a trip, route, launch, pier, breakwall, crossing, wade, ice condition, or waterbody is safe.',
          'You are responsible for your own field decisions and for stopping, changing plans, or leaving when conditions are unsafe.',
        ],
      },
      {
        title: 'Not Navigation Or Emergency Advice',
        body: [
          'FinFindr is not a marine navigation tool, emergency alert system, weather warning service, legal compliance service, or replacement for official safety sources.',
          'Maps, water reads, the Live Lake Map, and River Migration river-section guidance are not depth charts, property boundary tools, marine charts, emergency routes, official access maps, safe-access directions, or safe-wading or boating instructions.',
          'Weather alerts shown in FinFindr may be incomplete or delayed. Use official weather alerts, charts, local agencies, fish and wildlife agencies, land managers, emergency services, and local authorities when safety or legal decisions matter. In an emergency, call 911.',
        ],
      },
      {
        title: 'Great Lakes Piers And Breakwalls',
        body: [
          'Waves can wash over piers and breakwalls without warning, especially with onshore wind, and can sweep people into the water. Do not go out on a pier or breakwall when waves are breaking over it or high-wave, beach-hazard, or small craft alerts are in effect.',
          'Pier surfaces can be wet, algae-covered, or icy, and many have no railings. Dangerous currents run along piers and breakwalls, and the water beside them is often deep and cold.',
          'Great Lakes water can be cold enough to cause cold-water shock at any time of year, and upwelling can drop nearshore temperatures by many degrees within hours. Water temperatures in FinFindr are estimates, not a measure of whether it is safe to enter the water.',
          'Wave heights shown are modeled averages. Individual waves can be nearly twice as high. Avoid piers during thunderstorms, and stay off winter ice shelves and ice-covered structures.',
          'Obey pier closures and posted signs, wear a life jacket where it makes sense, fish with a partner, and know where life rings and emergency call points are.',
        ],
      },
      {
        title: 'Licenses And Access',
        body: [
          'You are responsible for fishing licenses, seasons, harvest limits, method restrictions, boating rules, access permission, private property boundaries, closures, and local rules.',
          'A Spot Finder listing, recommended river section, or PierCast city does not confirm legal parking, public shore or pier access, launch suitability, open roads, operating hours, fee status, safe wading or boating, or permission to cross neighboring property. Verify the linked source, current property and access information, and every posted sign before traveling or entering.',
          'Lower, Middle, and Upper labels orient you within FinFindr\'s supported migration corridor; they are not property, navigation, regulation, or safety boundaries and do not mean fish are distributed throughout the labeled section.',
          'When in doubt, check the relevant fish and wildlife agency, land manager, marina, harbor authority, property owner, or local authority before fishing.',
        ],
      },
      {
        title: 'Dams, Refuges And Changing Conditions',
        body: [
          'Dams, weirs, fish ladders, spillways, refuges, construction areas, and fish-passage facilities can have dangerous water, restricted zones, permanent or temporary closures, and species-specific rules. Never enter a closed or posted area or treat a migration endpoint as permission to approach or fish it.',
          'Roads, launches, piers, parking, water levels, currents, waves, weather, ice, closures, and emergency orders can change after FinFindr or a linked source was last reviewed. Current official notices and conditions at the site control.',
          'If an official source, posted sign, alert, or field condition conflicts with FinFindr, follow the official source or posted restriction and use the more cautious course.',
        ],
      },
      {
        title: 'Water And Outdoor Risk',
        body: [
          'Fishing can involve boating, wading, piers, ice, cold water, storms, lightning, heat, current, waves, remote areas, wildlife, private property, limited cell service, and other risks.',
          'A Fishing Shape description addresses expected presentation workability only. It does not determine whether travel, access, boating, floating, crossing, or wading is safe.',
          'Migration Stage, Activity Outlook, Seasonal Presence, Gauge Read, Fish Counts, a Spot Finder recommendation, a PierCast ranking, and Live Lake Map layers do not determine whether a trip, access point, pier, route, crossing, launch, wade, or waterbody is safe.',
          'Wear appropriate safety gear, follow boating and access laws, tell someone your plan, and leave when conditions are unsafe.',
          'No app can remove the risks of fishing or guarantee that a waterbody, access point, forecast, or recommendation is safe.',
        ],
      },
    ],
  },
};
