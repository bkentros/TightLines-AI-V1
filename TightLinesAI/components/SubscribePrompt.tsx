/**
 * SubscribePrompt
 *
 * Headless upgrade trigger. All upgrade CTAs use the single RevenueCat-hosted
 * paywall configured in RevenueCat, not a custom in-app paywall.
 */

import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useRevenueCatStore } from '../store/revenueCatStore';

export interface SubscribePromptProps {
  visible: boolean;
  onDismiss: () => void;
  onViewPlans?: () => void;
  onUnlocked?: () => void;
}

export function SubscribePrompt({
  visible,
  onDismiss,
  onUnlocked,
}: SubscribePromptProps) {
  const presentPaywall = useRevenueCatStore((s) => s.presentPaywall);
  const attemptedForOpen = useRef(false);

  useEffect(() => {
    if (!visible) {
      attemptedForOpen.current = false;
      return;
    }
    if (attemptedForOpen.current) return;
    attemptedForOpen.current = true;

    let cancelled = false;
    void (async () => {
      const unlocked = await presentPaywall();
      if (cancelled) return;

      if (unlocked) {
        Alert.alert('Angler unlocked', 'You now have full access to FinFindr.');
        onUnlocked?.();
      } else {
        const message = useRevenueCatStore.getState().error;
        if (message) Alert.alert('Subscriptions temporarily unavailable', message);
        onDismiss();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onDismiss, onUnlocked, presentPaywall, visible]);

  return null;
}
