/**
 * Subscription tier and usage cap utilities
 *
 * Used for feature gating and usage cap checks.
 */

import type { SubscriptionTier } from './types';
import type { UserProfile } from './types';
import { hasComplimentaryAnglerAccess } from './adminAccess';
import {
  freeRecommenderTrialAvailable,
  freeTodayBiteFullTrialAvailable,
  freeWaterReadTrialAvailable,
} from './freeTrialAccess';

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

/** Forecast day report generation — Angler only (6-day strip unchanged for free). */
export function canGenerateForecastReport(tier: SubscriptionTier): boolean {
  return canUseAIFeatures(tier);
}

/** New Tackle Box session — Angler or unused free trial. */
export function canGenerateRecommenderReport(
  tier: SubscriptionTier,
  profile?: UserProfile | null,
): boolean {
  if (canUseAIFeatures(tier)) return true;
  return freeRecommenderTrialAvailable(profile);
}

/** Changeup / variant actions on an in-flight Tackle Box result after trial spent. */
export function canContinueRecommenderSession(
  tier: SubscriptionTier,
  profile: UserProfile | null | undefined,
  hasActiveResult: boolean,
): boolean {
  if (canGenerateRecommenderReport(tier, profile)) return true;
  return hasActiveResult;
}

/** New Water Read lake — Angler or unused free trial. */
export function canGenerateWaterRead(
  tier: SubscriptionTier,
  profile?: UserProfile | null,
): boolean {
  if (canUseAIFeatures(tier)) return true;
  return freeWaterReadTrialAvailable(profile);
}

/** Today's Bite limited surface — free after the one full today report is consumed. */
export function shouldLimitFreeTodayBiteReport(
  tier: SubscriptionTier,
  profile?: UserProfile | null,
): boolean {
  if (canUseAIFeatures(tier)) return false;
  return !freeTodayBiteFullTrialAvailable(profile);
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
