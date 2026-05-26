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

const updated = 'May 26, 2026';

export const LEGAL_DOCUMENTS: Record<LegalDocumentKey, LegalDocument> = {
  privacy: {
    key: 'privacy',
    eyebrow: 'FINFINDR · PRIVACY',
    navTitle: 'PRIVACY',
    title: 'Privacy Policy.',
    subtitle:
      'How FinFindr handles account data, fishing context, device permissions, purchases, and support messages.',
    updated,
    externalUrl: LEGAL_URLS.privacy,
    sections: [
      {
        title: 'Information We Collect',
        body: [
          'Account information such as email address, username, authentication provider, profile settings, home region, subscription tier, and onboarding preferences.',
          'Fishing and app data you choose to create, including catches, sessions, locations, species preferences, photos or water images, voice logs if enabled, support messages, and feedback.',
          'Location information when you grant permission or manually choose a location. FinFindr uses this to build weather, tide, moon, and fishing-condition context.',
          'Purchase and entitlement status from the app store used for purchase, including the App Store, Google Play where supported, and RevenueCat. FinFindr does not receive full payment card numbers from Apple or Google.',
          'Operational data such as device platform, app version, rate-limit records, cache identifiers, error context, and diagnostics needed to run and secure the service.',
        ],
      },
      {
        title: 'How We Use Information',
        body: [
          'To create and secure your account, sync your profile, provide forecasts, tackle recommendations, water reads, fishing logs, and subscription-gated features.',
          'To respond to support requests, troubleshoot bugs, prevent abuse, enforce rate limits, improve app quality, and maintain production systems.',
          'To send transactional emails such as account verification, password reset, and support messages.',
        ],
      },
      {
        title: 'Third-Party Services',
        body: [
          'FinFindr uses service providers for app infrastructure and core functionality, including Supabase, RevenueCat, Apple platform services, Google platform services where supported, Resend, Open-Meteo, NOAA/NWS, NOAA CO-OPS, USNO, Sunrise-Sunset.org, mapping/geocoding providers, and similar operational vendors.',
          'Weather, water, sun, moon, map, and geocoding providers may receive coordinates, search terms, or request context needed to return app data. They are not given your full FinFindr account profile unless needed for the service.',
          'These providers process data only as needed to provide their services to FinFindr and its users. We do not sell your personal information or use third-party advertising trackers in the app.',
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
        title: 'Account Deletion',
        body: [
          'You can request account deletion from Settings. Deletion removes your FinFindr authentication account and app-owned data tied to your profile where deletion is required and technically available.',
          'Some records may be retained, anonymized, or aggregated when needed for security, legal compliance, payment records, fraud prevention, or service operations.',
          'Deleting your FinFindr account does not automatically cancel an auto-renewable subscription managed by Apple or Google. Cancel subscriptions from your store account settings.',
          'If you delete an account with an active or historical subscription, Restore Purchases may not reconnect that subscription to a new or recreated FinFindr account unless support can verify recovery.',
          'Store providers and RevenueCat may keep purchase and entitlement records under their own policies.',
        ],
      },
      {
        title: 'Children',
        body: [
          'FinFindr is not directed to children under 13. If you believe a child provided personal information without appropriate permission, contact support@finfindr.app so we can review the request.',
        ],
      },
      {
        title: 'Contact',
        body: [
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
          'These Terms apply to the FinFindr mobile app, public legal and support pages, and related services.',
          'By creating an account, subscribing, or using FinFindr, you agree to these Terms and to any app-store terms that apply to your download or subscription.',
          'If you do not agree, do not use the app.',
        ],
      },
      {
        title: 'Accounts',
        body: [
          'You are responsible for the activity on your account and for keeping your sign-in credentials secure.',
          'You must provide accurate account information and use FinFindr only where you are legally permitted to do so.',
        ],
      },
      {
        title: 'Subscriptions',
        body: [
          'Angler subscriptions unlock paid features while the subscription is active. Subscription pricing, billing period, renewal, cancellation, and refunds are handled by the app store account used for purchase, including the App Store or Google Play where supported.',
          'Subscription access is tied to the FinFindr account that originally purchased or restored the active subscription. Restore Purchases is intended to reconnect that subscription to the original FinFindr account and may not transfer access to a different FinFindr account.',
          'Subscriptions renew automatically unless canceled through your store account settings before renewal. Deleting your FinFindr account does not cancel store billing and may prevent subscription access from being restored to a new or recreated FinFindr account.',
          'FinFindr does not provide external purchase links for digital subscription access inside the app.',
        ],
      },
      {
        title: 'Refunds And Store Billing',
        body: [
          'FinFindr does not directly process App Store or Google Play subscription payments, cancellations, renewals, or refunds.',
          'Refund requests for store purchases must be submitted through the store account used for purchase and are handled under that store provider\'s policies, except where applicable law requires otherwise.',
          'Deleting a FinFindr account, losing access because a subscription is linked to another FinFindr account, or choosing not to use paid features does not automatically create a separate refund obligation from FinFindr.',
        ],
      },
      {
        title: 'Fishing Content',
        body: [
          'Forecasts, tackle recommendations, water reads, maps, scores, timing windows, and related content are informational planning tools. They are not professional, legal, navigational, emergency, or safety advice.',
          'Maps, structure reads, and location-related features are not depth charts, property boundary tools, marine charts, or a substitute for official maps and local sources.',
          'You are responsible for checking local laws, licensing, access rules, harvest limits, weather, water conditions, and safety risks before fishing.',
        ],
      },
      {
        title: 'User Content',
        body: [
          'You keep ownership of the catch logs, photos, notes, feedback, and other content you submit.',
          'You grant FinFindr permission to host, process, display, and use that content as needed to operate, secure, support, and improve the app.',
          'Do not submit unlawful, harmful, infringing, private, or abusive content.',
        ],
      },
      {
        title: 'Service Availability',
        body: [
          'FinFindr depends on network services, public data sources, device permissions, and third-party providers. Features may be unavailable, delayed, incomplete, or inaccurate.',
          'Coverage for water bodies and data sources varies by region. Unsupported or limited waters may show limited guidance rather than a full read.',
        ],
      },
      {
        title: 'No Guarantees',
        body: [
          'FinFindr is provided for planning and informational use. We do not guarantee catches, outcomes, water access, coverage, uptime, or that app guidance will be accurate for the exact conditions you encounter.',
          'To the fullest extent allowed by law, FinFindr is provided as is and as available.',
        ],
      },
      {
        title: 'Assumption Of Outdoor Risk',
        body: [
          'Fishing and related travel involve inherent risks, including injury, drowning, boating accidents, weather exposure, ice, current, wildlife, trespass, equipment failure, and changing water conditions.',
          'You are responsible for your own decisions, safety gear, legal compliance, route choices, water access, and whether conditions are safe enough for you to fish.',
          'To the fullest extent allowed by law, FinFindr is not responsible for injuries, losses, citations, property damage, or other consequences from your fishing activity, travel, or reliance on app information.',
        ],
      },
      {
        title: 'Limitation Of Liability',
        body: [
          'To the fullest extent allowed by law, FinFindr will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or for lost profits, lost data, lost opportunities, outdoor incidents, or personal injury connected to use of the app.',
          'Some jurisdictions do not allow certain limitations, so parts of this section may not apply to every user.',
        ],
      },
      {
        title: 'Your Responsibility For Claims',
        body: [
          'You are responsible for claims, losses, or expenses that arise from your unlawful conduct, your submitted content, your breach of these Terms, or your misuse of FinFindr.',
        ],
      },
      {
        title: 'Changes And Contact',
        body: [
          'We may update these Terms as the app changes. Material updates will be reflected in the app or on the published web version.',
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
      'A plain reminder that fishing recommendations are planning context, not a substitute for field judgment.',
    updated,
    sections: [
      {
        title: 'Use Field Judgment',
        body: [
          'FinFindr provides informational fishing guidance based on available weather, water, season, species, and location inputs. Conditions can change quickly.',
          'Always verify current weather, water levels, closures, hazards, access rules, and local fishing regulations before you go.',
          'Do not rely on FinFindr to decide whether a trip, route, launch, crossing, wade, ice condition, or waterbody is safe.',
        ],
      },
      {
        title: 'Not Navigation Or Emergency Advice',
        body: [
          'FinFindr is not a marine navigation tool, emergency alert system, weather warning service, or replacement for official safety sources.',
          'Maps and water reads are not depth charts, property boundary tools, marine charts, or official access maps.',
          'Use official weather alerts, charts, local agencies, and emergency services when safety decisions matter.',
        ],
      },
      {
        title: 'Licenses And Access',
        body: [
          'You are responsible for fishing licenses, seasons, harvest limits, method restrictions, access permission, private property boundaries, and local rules.',
          'When in doubt, check the relevant fish and wildlife agency, land manager, marina, or local authority before fishing.',
        ],
      },
      {
        title: 'Water And Outdoor Risk',
        body: [
          'Fishing can involve boating, wading, ice, cold water, storms, current, remote areas, wildlife, private property, and other risks.',
          'Wear appropriate safety gear, follow boating and access laws, tell someone your plan, and leave when conditions are unsafe.',
        ],
      },
    ],
  },
};
