/**
 * SubscribePrompt
 *
 * Headless upgrade trigger. All upgrade CTAs use the single RevenueCat-hosted
 * paywall configured in RevenueCat, not a custom in-app paywall.
 */

import { useEffect, useRef } from 'react';
import { useRevenueCatStore } from '../store/revenueCatStore';
import {
  showAnglerUnlockedCelebration,
  showSubscriptionNotice,
} from '../store/subscriptionCelebrationStore';

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

  // Route callbacks through refs so parent re-renders never re-run or cancel an
  // in-flight paywall. The present effect intentionally keys only on `visible`:
  // depending on the inline parent callbacks here previously cancelled the
  // dismiss when the parent re-rendered mid-paywall, leaving `visible` stuck
  // true and silently swallowing every subsequent open.
  const onDismissRef = useRef(onDismiss);
  const onUnlockedRef = useRef(onUnlocked);
  const presentPaywallRef = useRef(presentPaywall);
  onDismissRef.current = onDismiss;
  onUnlockedRef.current = onUnlocked;
  presentPaywallRef.current = presentPaywall;

  const presenting = useRef(false);

  useEffect(() => {
    if (!visible) {
      presenting.current = false;
      return;
    }
    if (presenting.current) return;
    presenting.current = true;

    void (async () => {
      try {
        const unlocked = await presentPaywallRef.current();
        if (unlocked) {
          showAnglerUnlockedCelebration();
          onUnlockedRef.current?.();
        } else {
          const message = useRevenueCatStore.getState().error;
          if (message) {
            showSubscriptionNotice({
              title: 'Subscriptions temporarily unavailable',
              message,
              tone: 'error',
            });
          }
          onDismissRef.current();
        }
      } catch {
        onDismissRef.current();
      } finally {
        presenting.current = false;
      }
    })();
  }, [visible]);

  return null;
}
