// Shared TypeScript types used across auth, store, and onboarding

export type FishingMode = 'conventional' | 'fly' | 'both';
export type SubscriptionTier = 'free' | 'angler' | 'master_angler';
export type PrivacyLevel = 'exact' | 'regional' | 'hidden';

export interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  home_region: string | null;
  home_state: string | null;
  home_city: string | null;
  fishing_mode: FishingMode;
  preferred_units: 'imperial' | 'metric';
  target_species: string[];
  subscription_tier: SubscriptionTier;
  onboarding_complete: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Partial profile used during onboarding step 2 before the row exists in DB
export interface OnboardingPrefs {
  username: string;
  display_name: string;
  fishing_mode: FishingMode;
  target_species: string[];
  home_region: string;
  home_state: string;
  home_city: string;
}
