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
  /** Server-set when the one free Tackle Box session is consumed. */
  free_recommender_trial_used_at?: string | null;
  /** Server-set when the one free Water Read lake is consumed. */
  free_water_read_trial_used_at?: string | null;
  /** Server-set after the one full Today's Bite report; later today reads are limited. */
  free_today_bite_full_used_at?: string | null;
  /** Server-owned lifetime River Migration trial and its one replayable refresh. */
  free_river_run_trial_used_at?: string | null;
  free_river_run_trial_river_id?: string | null;
  free_river_run_trial_run_id?: string | null;
  free_river_run_trial_presentation_state?: string | null;
  free_river_run_trial_local_date?: string | null;
  free_river_run_trial_refresh_slot?: string | null;
  free_river_run_trial_engine_version?: string | null;
  free_river_run_trial_config_version?: string | null;
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
  preferred_units: 'imperial' | 'metric';
}
