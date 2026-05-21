/**
 * Subscription tier and usage cap utilities
 *
 * Used for feature gating and usage cap checks.
 */

import type { SubscriptionTier } from './types';
import type { UserProfile } from './types';
import { hasComplimentaryAnglerAccess } from './adminAccess';

/** Usage cap (API cost in USD) per tier per billing period */
export const USAGE_CAP_ANGLER_USD = 1;
export const USAGE_CAP_MASTER_ANGLER_USD = 3;

/**
 * Resolve effective subscription tier for feature gating.
 * New/unknown profiles are always free. Complimentary access is limited to the
 * explicit allow-list in adminAccess.ts.
 */
export function getEffectiveTier(
  profile: UserProfile | null,
  userEmail?: string | null
): SubscriptionTier {
  if (hasComplimentaryAnglerAccess(userEmail)) {
    return 'angler';
  }
  return profile?.subscription_tier ?? 'free';
}

/** True if user can use AI features (Angler or Master Angler) */
export function canUseAIFeatures(tier: SubscriptionTier): boolean {
  return tier === 'angler' || tier === 'master_angler';
}

/**
 * Free users may see tomorrow's 6-day score/color as a preview, but all
 * generated planning products remain Angler-only.
 */
export const FREE_FORECAST_PREVIEW_DAY_OFFSET = 1;

export function canViewForecastScore(
  tier: SubscriptionTier,
  dayOffset: number,
): boolean {
  return canUseAIFeatures(tier) ||
    dayOffset === FREE_FORECAST_PREVIEW_DAY_OFFSET;
}

export function canGenerateForecastReport(tier: SubscriptionTier): boolean {
  return canUseAIFeatures(tier);
}

export function canGenerateRecommenderReport(tier: SubscriptionTier): boolean {
  return canUseAIFeatures(tier);
}

export function canGenerateWaterRead(tier: SubscriptionTier): boolean {
  return canUseAIFeatures(tier);
}

/** Usage cap in USD for the given tier */
export function getUsageCapUsd(tier: SubscriptionTier): number {
  switch (tier) {
    case 'angler':
      return USAGE_CAP_ANGLER_USD;
    case 'master_angler':
      return USAGE_CAP_MASTER_ANGLER_USD;
    default:
      return 0;
  }
}
