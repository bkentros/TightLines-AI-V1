/**
 * Haptics via dynamic import so a dev client missing the ExpoHaptics native
 * module never crashes at bundle load — effects simply no-op.
 */
export const ImpactFeedbackStyle = {
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy',
  Soft: 'soft',
  Rigid: 'rigid',
} as const;

export type ImpactFeedbackStyle =
  (typeof ImpactFeedbackStyle)[keyof typeof ImpactFeedbackStyle];

export function hapticSelection(): void {
  void import('expo-haptics')
    .then((H) => H.selectionAsync())
    .catch(() => {});
}

export function hapticImpact(style: ImpactFeedbackStyle): void {
  type HapticsImpact = import('expo-haptics').ImpactFeedbackStyle;
  void import('expo-haptics')
    .then((H) => H.impactAsync(style as HapticsImpact))
    .catch(() => {});
}
