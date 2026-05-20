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

const updated = 'May 18, 2026';

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
          'Purchase and entitlement status from the App Store, Google Play, and RevenueCat. FinFindr does not receive full payment card numbers from Apple or Google.',
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
          'FinFindr uses service providers for app infrastructure and core functionality, including Supabase, RevenueCat, Apple, Google, Resend, weather and water data providers, mapping/geocoding providers, NOAA/NWS, USNO or sunrise-sunset data sources, and similar operational vendors.',
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
        ],
      },
      {
        title: 'Contact',
        body: [
          'Questions about privacy or data deletion can be sent to finfindr@hotmail.com.',
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
          'Angler subscriptions unlock paid features while the subscription is active. Subscription pricing, billing period, renewal, cancellation, and refunds are handled by the App Store or Google Play account used for purchase.',
          'Subscriptions renew automatically unless canceled through your store account settings before renewal. Deleting your FinFindr account does not cancel store billing.',
          'FinFindr does not provide external purchase links for digital subscription access inside the app.',
        ],
      },
      {
        title: 'Fishing Content',
        body: [
          'Forecasts, tackle recommendations, water reads, maps, scores, timing windows, and related content are informational planning tools. They are not professional, legal, navigational, emergency, or safety advice.',
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
        title: 'Changes And Contact',
        body: [
          'We may update these Terms as the app changes. Material updates will be reflected in the app or on the published web version.',
          'Questions can be sent to finfindr@hotmail.com.',
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
        ],
      },
      {
        title: 'Not Navigation Or Emergency Advice',
        body: [
          'FinFindr is not a marine navigation tool, emergency alert system, weather warning service, or replacement for official safety sources.',
          'Use official weather alerts, charts, local agencies, and emergency services when safety decisions matter.',
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
