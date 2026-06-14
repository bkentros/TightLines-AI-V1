/** Portrait logical sizes (pt) for common iPhones — design + QA reference. */
export const IPHONE_LAYOUT_PROFILES = [
  { id: 'se-320', label: 'SE 1st gen', width: 320, height: 568 },
  { id: 'se-375', label: 'SE 2/3', width: 375, height: 667 },
  { id: 'mini-375', label: '12/13 Mini', width: 375, height: 812 },
  { id: 'std-393', label: '14/15/16', width: 393, height: 852 },
  { id: 'plus-428', label: 'Plus / Pro', width: 428, height: 926 },
  { id: 'promax-430', label: 'Pro Max', width: 430, height: 932 },
] as const;

export type AuthLayoutTier = 'compact' | 'standard' | 'tall';

/** Minimum readable size for mono/meta labels on auth screens. */
export const AUTH_META_FONT_MIN = 11;

/**
 * Classify the current device for auth/onboarding layout decisions.
 * `usableHeight` should subtract safe-area insets.
 */
export function getAuthLayoutTier(
  width: number,
  usableHeight: number,
  fontScale = 1,
): AuthLayoutTier {
  if (usableHeight < 700 || fontScale >= 1.2) return 'compact';
  // Pro Max / Plus land ~830–840pt usable; 820 keeps them on the tall tier.
  if (usableHeight >= 820 && width >= 393) return 'tall';
  if (width <= 375 && usableHeight < 780) return 'compact';
  return 'standard';
}

/** Typical safe-area insets for layout QA (portrait, notch vs home button). */
export const IPHONE_SAFE_AREA_ESTIMATES = {
  notch: { top: 59, bottom: 34 },
  homeButton: { top: 20, bottom: 0 },
} as const;

export function estimateUsableHeight(
  profile: (typeof IPHONE_LAYOUT_PROFILES)[number],
  insetKind: keyof typeof IPHONE_SAFE_AREA_ESTIMATES = 'notch',
): number {
  const insets = IPHONE_SAFE_AREA_ESTIMATES[insetKind];
  return profile.height - insets.top - insets.bottom;
}

export function authScopeStageSize(tier: AuthLayoutTier): {
  stage: number;
  emblem: number;
} {
  switch (tier) {
    case 'compact':
      return { stage: 80, emblem: 52 };
    case 'tall':
      return { stage: 108, emblem: 72 };
    default:
      return { stage: 92, emblem: 62 };
  }
}

export function authHeroTitleSize(tier: AuthLayoutTier): number {
  switch (tier) {
    case 'compact':
      return 24;
    case 'tall':
      return 30;
    default:
      return 27;
  }
}
