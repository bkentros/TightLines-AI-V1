/**
 * Wraps expo-haptics so missing native module (old dev client, Expo Go mismatch, etc.)
 * never rejects an unhandled promise — haptics simply no-op.
 */
import * as Haptics from 'expo-haptics';

export { ImpactFeedbackStyle } from 'expo-haptics';

const swallow = (): void => {};

export function hapticSelection(): void {
  void Haptics.selectionAsync().catch(swallow);
}

export function hapticImpact(style: Haptics.ImpactFeedbackStyle): void {
  void Haptics.impactAsync(style).catch(swallow);
}
