/**
 * Subscription tier and usage cap utilities
 *
 * Used for feature gating and usage cap checks.
 * Tier preview override takes precedence in dev, or when a trusted caller
 * explicitly allows it for an admin/testing account.
 */

import type { SubscriptionTier } from './types';
import type { UserProfile } from './types';
import type { DevSubscriptionTier } from '../store/devTestingStore';

/** Usage cap (API cost in USD) per tier per billing period */
export const USAGE_CAP_ANGLER_USD = 1;
export const USAGE_CAP_MASTER_ANGLER_USD = 3;

/**
 * Resolve effective subscription tier for feature gating.
 * In __DEV__, override takes precedence when set. Production callers must pass
 * allowOverride=true only after checking admin access.
 */
export function getEffectiveTier(
  profile: UserProfile | null,
  devOverride: DevSubscriptionTier | null,
  allowOverride = __DEV__
): SubscriptionTier {
  if (allowOverride && devOverride != null) {
    return devOverride;
  }
  return profile?.subscription_tier ?? 'free';
}

/** True if user can use AI features (Angler or Master Angler) */
export function canUseAIFeatures(tier: SubscriptionTier): boolean {
  return tier === 'angler' || tier === 'master_angler';
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
