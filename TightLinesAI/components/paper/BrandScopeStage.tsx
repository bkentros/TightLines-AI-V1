/**
 * BrandScopeStage — the FinFindr pin emblem inside a "field-scope target."
 *
 * Used as the centrepiece on the welcome (sign-in) screen and the
 * onboarding step-1 cover. Replaces the static halo + cardinal-tick ring
 * we had before with a more alive, scanning vocabulary that matches the
 * dashboard's intelligence-module + Today's Bite scan effects.
 *
 * Anatomy:
 *   - 4 corner crosshairs (L-shape + inside-vertex tick dot) anchor the
 *     emblem inside a bounded region — without ever forming a circle or
 *     square frame around it.
 *   - 1 horizontal scan beam travels vertically through the stage
 *     (top → bottom → top, ~2.2 s each way), with a soft blue glow.
 *   - 2 staggered sonar pings expand outward from the emblem's centre
 *     and fade as they grow (offset by ~1.3 s).
 *   - The emblem itself breathes (native scale loop) — passed through
 *     to BrandEmblem with `halo={false}` so no ring surrounds it.
 *
 * No `react-native-svg`, `expo-linear-gradient`, or `expo-blur`. All
 * animations use the native driver — transform + opacity only.
 */

import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { paper } from '../../lib/theme';
import { BrandEmblem } from './BrandEmblem';

interface BrandScopeStageProps {
  /** Stage outer dimensions (square) in px. Default 132. */
  size?: number;
  /** Emblem (logo) image diameter inside the stage. Default 86. */
  emblemSize?: number;
  /** Beam + ping + corner-dot accent color. Default navy blue. */
  accentColor?: string;
  /** Crosshair arm color. Default ink. */
  crosshairColor?: string;
  /** Scan beam loop duration in ms (one direction). Default 2200. */
  scanDurationMs?: number;
  /** Sonar ping interval in ms. Default 2600. */
  pingDurationMs?: number;
  style?: StyleProp<ViewStyle>;
}

export function BrandScopeStage({
  size = 132,
  emblemSize = 86,
  accentColor = paper.dashboardBlue,
  crosshairColor = paper.dashboardInk,
  scanDurationMs = 2200,
  pingDurationMs = 2600,
  style,
}: BrandScopeStageProps) {
  const padding = Math.round(size * 0.075);

  // Scan beam — translateY across the stage interior
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: 1,
          duration: scanDurationMs,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanY, {
          toValue: 0,
          duration: scanDurationMs,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanY, scanDurationMs]);
  const scanTranslate = scanY.interpolate({
    inputRange: [0, 1],
    outputRange: [padding, size - padding - 1.5],
  });

  // Sonar pings — two staggered concentric rings
  const ping1 = useRef(new Animated.Value(0)).current;
  const ping2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const start = (v: Animated.Value, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: pingDurationMs,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ).start();
    start(ping1, 0);
    start(ping2, Math.round(pingDurationMs / 2));
  }, [ping1, ping2, pingDurationMs]);
  const ping1Scale = ping1.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.25] });
  const ping1Opacity = ping1.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.45, 0] });
  const ping2Scale = ping2.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.25] });
  const ping2Opacity = ping2.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.4, 0] });

  const pingDiameter = size - padding * 2 - 14;
  const beamHorizontalInset = padding;

  return (
    <View
      style={[
        styles.stage,
        { width: size, height: size },
        style,
      ]}
      pointerEvents="none"
    >
      {/* 4 corner crosshairs */}
      <CornerCrosshair position="topLeft" armColor={crosshairColor} dotColor={accentColor} />
      <CornerCrosshair position="topRight" armColor={crosshairColor} dotColor={accentColor} />
      <CornerCrosshair position="bottomLeft" armColor={crosshairColor} dotColor={accentColor} />
      <CornerCrosshair position="bottomRight" armColor={crosshairColor} dotColor={accentColor} />

      {/* Sonar pings */}
      <Animated.View
        style={[
          styles.sonarPing,
          {
            width: pingDiameter,
            height: pingDiameter,
            borderRadius: pingDiameter / 2,
            borderColor: accentColor,
            transform: [{ scale: ping1Scale }],
            opacity: ping1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.sonarPing,
          {
            width: pingDiameter,
            height: pingDiameter,
            borderRadius: pingDiameter / 2,
            borderColor: accentColor,
            transform: [{ scale: ping2Scale }],
            opacity: ping2Opacity,
          },
        ]}
      />

      {/* Horizontal scan beam — translates vertically */}
      <Animated.View
        style={[
          styles.scanBeam,
          {
            left: beamHorizontalInset,
            right: beamHorizontalInset,
            backgroundColor: accentColor,
            shadowColor: accentColor,
            transform: [{ translateY: scanTranslate }],
          },
        ]}
      />

      {/* The emblem itself — no halo, breathing */}
      <BrandEmblem size={emblemSize} halo={false} breath />
    </View>
  );
}

function CornerCrosshair({
  position,
  armColor,
  dotColor,
}: {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  armColor: string;
  dotColor: string;
}) {
  const isTop = position === 'topLeft' || position === 'topRight';
  const isLeft = position === 'topLeft' || position === 'bottomLeft';
  return (
    <View
      pointerEvents="none"
      style={[
        styles.corner,
        isTop ? { top: 4 } : { bottom: 4 },
        isLeft ? { left: 4 } : { right: 4 },
      ]}
    >
      <View
        style={[
          styles.cornerArmH,
          { backgroundColor: armColor },
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      <View
        style={[
          styles.cornerArmV,
          { backgroundColor: armColor },
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      <View
        style={[
          styles.cornerDot,
          { backgroundColor: dotColor },
          isTop ? { top: 9 } : { bottom: 9 },
          isLeft ? { left: 9 } : { right: 9 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
  },
  cornerArmH: {
    position: 'absolute',
    width: 16,
    height: 1.25,
    opacity: 0.6,
  },
  cornerArmV: {
    position: 'absolute',
    width: 1.25,
    height: 16,
    opacity: 0.6,
  },
  cornerDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.85,
  },
  sonarPing: {
    position: 'absolute',
    borderWidth: 1,
  },
  scanBeam: {
    position: 'absolute',
    top: 0,
    height: 1.5,
    opacity: 0.55,
    shadowOpacity: 0.55,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});
