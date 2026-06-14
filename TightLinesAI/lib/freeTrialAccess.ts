import type { UserProfile } from './types';

export function freeRecommenderTrialAvailable(
  profile: UserProfile | null | undefined,
): boolean {
  return profile?.free_recommender_trial_used_at == null;
}

export function freeWaterReadTrialAvailable(
  profile: UserProfile | null | undefined,
): boolean {
  return profile?.free_water_read_trial_used_at == null;
}

export function freeTodayBiteFullTrialAvailable(
  profile: UserProfile | null | undefined,
): boolean {
  return profile?.free_today_bite_full_used_at == null;
}
