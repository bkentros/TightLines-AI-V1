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

const updated = 'June 2, 2026';

export const LEGAL_DOCUMENTS: Record<LegalDocumentKey, LegalDocument> = {
  privacy: {
    key: 'privacy',
    eyebrow: 'FINFINDR · PRIVACY',
    navTitle: 'PRIVACY',
    title: 'Privacy Policy.',
    subtitle:
      'How FinFindr LLC handles account data, fishing context, device permissions, purchases, and support messages.',
    updated,
    externalUrl: LEGAL_URLS.privacy,
    sections: [
      {
        title: 'Who Operates FinFindr',
        body: [
          'FinFindr is operated by FinFindr LLC. In this Privacy Policy, FinFindr, we, us, and our refer to FinFindr LLC and the FinFindr app and related services.',
          'Questions about privacy or data deletion can be sent to support@finfindr.app.',
        ],
      },
      {
        title: 'Information We Collect',
        body: [
          'Account information such as email address (including business or custom domains you can verify), username, authentication provider, profile settings, home region, subscription tier, and onboarding preferences.',
          'Fishing and app data you choose to create, including catches, sessions, locations, species preferences, photos or water images, voice logs if enabled, support messages, and feedback.',
          'Location information when you grant permission or manually choose a location. FinFindr uses this to build weather, tide, moon, and fishing-condition context.',
          'Purchase and entitlement status from the app store used for purchase, including the App Store, Google Play where supported, and RevenueCat. FinFindr does not receive full payment card numbers from Apple or Google.',
          'Product analytics and interaction data, such as app opens, screen views, feature usage, paywall events, purchase and restore events, subscription tier, region settings, onboarding status, and similar product-quality signals.',
          'Creator, referral, and offer-code information if you use or arrive through a creator code, redemption link, or promotional campaign. This may include the code, creator attribution, subscription product, RevenueCat event details, payout ledger records, redemption URLs, and limited anti-abuse or attribution diagnostics such as hashed IP address or hashed user-agent information for web referral clicks.',
          'Operational data such as device platform, app version, rate-limit records, cache identifiers, error context, and diagnostics needed to run, secure, and improve the service.',
        ],
      },
      {
        title: 'How We Use Information',
        body: [
          'To create and secure your account, sync your profile, provide forecasts, tackle recommendations, water reads, fishing logs, and subscription-gated features.',
          'To respond to support requests, troubleshoot bugs, prevent abuse, enforce rate limits, improve app quality, maintain production systems, and protect users and FinFindr.',
          'To measure product usage and subscription flows, understand which app areas need improvement, and confirm that subscription, restore, and creator-code attribution systems are working correctly.',
          'To administer creator, referral, offer-code, commission, refund, reversal, payout, and attribution records where a creator program or promotional code is used.',
          'To send transactional emails such as account verification, password reset, support messages, and important account or service notices.',
        ],
      },
      {
        title: 'Third-Party Services',
        body: [
          'FinFindr uses service providers for app infrastructure and core functionality, including Supabase, RevenueCat, PostHog, Apple platform services, Google platform services where supported, Resend, Open-Meteo, NOAA/NWS, NOAA CO-OPS, USNO, Sunrise-Sunset.org, mapping/geocoding providers, analytics and diagnostics providers, and similar operational vendors.',
          'Weather, water, sun, moon, map, and geocoding providers may receive coordinates, search terms, or request context needed to return app data. They are not given your full FinFindr account profile unless needed for the service.',
          'PostHog is used for product analytics, not advertising. Session replay is disabled in the app configuration, and FinFindr does not use PostHog to sell data or track you across other companies\' apps or websites.',
          'Store providers and RevenueCat process purchase, offer-code, and entitlement records under their own policies. App Store billing, cancellation, renewal, offer redemption, and refund decisions are handled by Apple for App Store purchases.',
          'We do not sell your personal information or use third-party advertising trackers in the app.',
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
          'We keep personal information for as long as needed to provide the app, comply with law, resolve disputes, enforce agreements, prevent abuse, and maintain records required for subscriptions, creator attribution, payouts, refunds, tax, accounting, or security purposes.',
        ],
      },
      {
        title: 'Your Choices',
        body: [
          'You can update certain profile settings in the app, revoke device permissions in system settings, and request account deletion from Settings.',
          'Depending on where you live, you may have rights to request access, correction, deletion, or a copy of certain personal information. Contact support@finfindr.app to make a request.',
        ],
      },
      {
        title: 'Children',
        body: [
          'FinFindr is not directed to children under 13. If you believe a child provided personal information without appropriate permission, contact support@finfindr.app so we can review the request.',
        ],
      },
      {
        title: 'Changes And Contact',
        body: [
          'We may update this Privacy Policy as the app, legal requirements, or our practices change. Material updates will be reflected in the app or on the published web version.',
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
      'The rules for using FinFindr, subscriptions, account access, app content, and fishing-condition guidance.',
    updated,
    externalUrl: LEGAL_URLS.terms,
    sections: [
      {
        title: 'Agreement',
        body: [
          'FinFindr is operated by FinFindr LLC. In these Terms, FinFindr, we, us, and our refer to FinFindr LLC and the FinFindr app and related services.',
          'These Terms apply to the FinFindr mobile app, public legal and support pages, and related services.',
          'By creating an account, subscribing, accessing paid features, or using FinFindr, you agree to these Terms, the Privacy Policy, the Safety Notice, and any app-store terms that apply to your download or subscription.',
          'If you do not agree, do not use the app.',
        ],
      },
      {
        title: 'Accounts',
        body: [
          'You are responsible for the activity on your account and for keeping your sign-in credentials secure.',
          'You must provide accurate account information and use FinFindr only where you are legally permitted to do so. You may sign up with any valid email address you can verify, including business or custom domains.',
          'You may not misuse the app, interfere with the service, attempt to bypass subscription gates, scrape or reverse engineer the service, or use FinFindr for unlawful or unsafe activity.',
        ],
      },
      {
        title: 'Subscriptions',
        body: [
          'Angler subscriptions unlock paid features while the subscription is active. Subscription pricing, billing period, renewal, cancellation, and refunds are handled by the app store account used for purchase, including the App Store or Google Play where supported.',
          'Subscription access is tied to the FinFindr account that originally purchased or restored the active subscription. Restore Purchases is intended to reconnect that subscription to the original FinFindr account and may not transfer access to a different FinFindr account.',
          'Subscriptions renew automatically unless canceled through your store account settings before renewal. Deleting your FinFindr account does not cancel store billing and may prevent subscription access from being restored to a new or recreated FinFindr account.',
          'Creator, referral, promotional, or offer codes may be subject to Apple, RevenueCat, and FinFindr eligibility rules. Codes, discounts, redemptions, creator attribution, and related commission records may be tracked to administer the offer and are not guaranteed to remain available indefinitely.',
          'FinFindr does not provide external purchase links for digital subscription access inside the app.',
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
          'Forecasts, tackle recommendations, water reads, maps, scores, timing windows, species suggestions, and related content are informational planning tools. They are not professional, legal, navigational, emergency, medical, environmental, boating, or safety advice.',
          'Maps, structure reads, and location-related features are not depth charts, property boundary tools, marine charts, emergency routes, official access maps, or substitutes for official maps and local sources.',
          'You are responsible for checking local laws, licensing, access rules, harvest limits, weather, water conditions, hazards, closures, and safety risks before fishing.',
        ],
      },
      {
        title: 'User Content',
        body: [
          'You keep ownership of the catch logs, photos, notes, feedback, and other content you submit.',
          'You grant FinFindr LLC permission to host, process, display, and use that content as needed to operate, secure, support, analyze, and improve the app.',
          'Do not submit unlawful, harmful, infringing, private, unsafe, misleading, or abusive content.',
        ],
      },
      {
        title: 'Service Availability',
        body: [
          'FinFindr depends on network services, public data sources, device permissions, store systems, and third-party providers. Features may be unavailable, delayed, incomplete, or inaccurate.',
          'Coverage for water bodies and data sources varies by region. Unsupported or limited waters may show limited guidance rather than a full read.',
          'We may change, suspend, limit, or discontinue features at any time, including where needed for safety, reliability, legal compliance, abuse prevention, or product changes.',
        ],
      },
      {
        title: 'No Guarantees',
        body: [
          'FinFindr is provided for planning and informational use. We do not guarantee catches, fishing results, outcomes, water access, legal access, coverage, uptime, safety, weather accuracy, data availability, or that app guidance will be accurate for the exact conditions you encounter.',
          'To the fullest extent allowed by law, FinFindr is provided as is and as available, without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.',
        ],
      },
      {
        title: 'Assumption Of Outdoor Risk',
        body: [
          'Fishing and related travel involve inherent risks, including injury, drowning, boating accidents, weather exposure, lightning, heat, cold, ice, current, deep or moving water, wildlife, trespass, equipment failure, remote areas, limited cell service, and changing water conditions.',
          'You are responsible for your own decisions, safety gear, legal compliance, route choices, launch and access choices, water access, and whether conditions are safe enough for you to fish.',
          'You voluntarily assume the risks of fishing, boating, wading, travel, and outdoor activity. To the fullest extent allowed by law, FinFindr LLC is not responsible for injuries, deaths, losses, citations, property damage, or other consequences from your fishing activity, travel, or reliance on app information.',
        ],
      },
      {
        title: 'Limitation Of Liability',
        body: [
          'To the fullest extent allowed by law, FinFindr LLC and its owners, officers, employees, contractors, service providers, and affiliates will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or for lost profits, lost data, lost opportunities, outdoor incidents, personal injury, death, property damage, or third-party claims connected to use of the app.',
          'To the fullest extent allowed by law, FinFindr LLC\'s total liability for any claim related to the app or these Terms will not exceed the greater of the amount you paid to FinFindr through app-store subscriptions in the 12 months before the claim or $100.',
          'Some jurisdictions do not allow certain limitations, so parts of this section may not apply to every user.',
        ],
      },
      {
        title: 'Your Responsibility For Claims',
        body: [
          'To the fullest extent allowed by law, you are responsible for claims, losses, damages, liabilities, costs, and expenses that arise from your unlawful conduct, unsafe activity, submitted content, breach of these Terms, violation of another person\'s rights, or misuse of FinFindr.',
        ],
      },
      {
        title: 'Changes And Contact',
        body: [
          'We may update these Terms as the app, legal requirements, or our business changes. Material updates will be reflected in the app or on the published web version.',
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
    sections: [
      {
        title: 'Use Field Judgment',
        body: [
          'FinFindr is operated by FinFindr LLC and provides informational fishing guidance based on available weather, water, season, species, and location inputs. Conditions can change quickly.',
          'Always verify current weather, water levels, closures, hazards, access rules, and local fishing regulations before you go.',
          'Do not rely on FinFindr to decide whether a trip, route, launch, crossing, wade, ice condition, or waterbody is safe.',
          'You are responsible for your own field decisions and for stopping, changing plans, or leaving when conditions are unsafe.',
        ],
      },
      {
        title: 'Not Navigation Or Emergency Advice',
        body: [
          'FinFindr is not a marine navigation tool, emergency alert system, weather warning service, legal compliance service, or replacement for official safety sources.',
          'Maps and water reads are not depth charts, property boundary tools, marine charts, emergency routes, or official access maps.',
          'Use official weather alerts, charts, local agencies, fish and wildlife agencies, land managers, emergency services, and local authorities when safety or legal decisions matter.',
        ],
      },
      {
        title: 'Licenses And Access',
        body: [
          'You are responsible for fishing licenses, seasons, harvest limits, method restrictions, boating rules, access permission, private property boundaries, closures, and local rules.',
          'When in doubt, check the relevant fish and wildlife agency, land manager, marina, property owner, or local authority before fishing.',
        ],
      },
      {
        title: 'Water And Outdoor Risk',
        body: [
          'Fishing can involve boating, wading, ice, cold water, storms, lightning, heat, current, remote areas, wildlife, private property, limited cell service, and other risks.',
          'Wear appropriate safety gear, follow boating and access laws, tell someone your plan, and leave when conditions are unsafe.',
          'No app can remove the risks of fishing or guarantee that a waterbody, access point, forecast, or recommendation is safe.',
        ],
      },
    ],
  },
};
