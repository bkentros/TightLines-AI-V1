/**
 * usePaperBonePulse
 *
 * Shared opacity-pulse used by every paper-language skeleton ("bone")
 * placeholder so they all breathe at the same tempo. Mirrors the pulse
 * we shipped on the Water Reader lake skeleton — slow ease-in-out
 * between two opacity stops on the native driver, which means zero JS
 * work per frame and a perfectly smooth 60fps glow.
 *
 *   const pulse = usePaperBonePulse();
 *   <Animated.View style={[styles.bone, { opacity: pulse }]} />
 *
 * Stops at 0.18 → 0.42 by default (matches the silhouette skeleton).
 * Override per-skeleton if you need a brighter or dimmer rhythm
 * (e.g. brighter for thin micro-bones, dimmer for full-card headers):
 *
 *   const pulse = usePaperBonePulse({ from: 0.32, to: 0.65, duration: 1600 });
 *
 * The hook intentionally returns the raw `Animated.Value` rather than
 * a styled component so callers can freely interpolate it into other
 * properties (e.g. transform scale on a "live" dot).
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UsePaperBonePulseOptions {
  /** Opacity at the dim end of the cycle. Default 0.18. */
  from?: number;
  /** Opacity at the bright end of the cycle. Default 0.42. */
  to?: number;
  /** One-way cycle duration in ms. Default 2200 (slow, editorial). */
  duration?: number;
  /** Skip starting the loop (use to pause via prop). Default false. */
  paused?: boolean;
}

/**
 * Returns an `Animated.Value` looping between `from` and `to` on the
 * native driver. Suitable for `opacity` and any other native-driver
 * compatible style prop.
 */
export function usePaperBonePulse({
  from = 0.18,
  to = 0.42,
  duration = 2200,
  paused = false,
}: UsePaperBonePulseOptions = {}): Animated.Value {
  const pulseRef = useRef<Animated.Value | null>(null);
  if (pulseRef.current === null) {
    pulseRef.current = new Animated.Value(from);
  }
  const pulse = pulseRef.current;

  useEffect(() => {
    if (paused) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: to,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: from,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [pulse, from, to, duration, paused]);

  return pulse;
}
