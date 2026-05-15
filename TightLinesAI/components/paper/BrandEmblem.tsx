/**
 * BrandEmblem — the FinFindr pin logo, sized and dressed for hero panels.
 *
 * Used on the auth + onboarding screens to give each entry point a calm,
 * premium centerpiece without copy/pasting the dashboard nav's tiny chip.
 *
 * Anatomy:
 *   - Outer halo: faint navy hairline rings ("compass field") behind the pin
 *     — purely decorative, optional via the `halo` prop. Three concentric
 *     rings of decreasing stroke weight, all sized off the emblem's own
 *     diameter so the proportions stay tight at any size.
 *   - Cardinal ticks: 4 short hairline bars at N · E · S · W, just outside
 *     the outermost halo ring. Reinforces the "field guide" voice without
 *     drawing attention away from the brand mark.
 *   - Emblem: the bundled `finfindr-logo.png` rendered with `resizeMode='contain'`
 *     so the pin shape stays crisp at any size.
 *   - Breath animation (opt-in via `breath`): native-driver scale loop between
 *     1.0 and 1.045, 2.8s round-trip — reads as a slow inhale/exhale and gives
 *     the brand mark life without being distracting.
 *
 * No `react-native-svg`, `expo-linear-gradient`, or `expo-blur`. Nothing here
 * forces a native rebuild.
 */

import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { paper } from '../../lib/theme';

interface BrandEmblemProps {
  /** Emblem (image) diameter in px. The halo extends ~1.6× beyond this. */
  size?: number;
  /** Show the decorative halo (3 concentric rings + N/E/S/W ticks). */
  halo?: boolean;
  /** Animate a slow breath (scale 1.0 ↔ 1.045). Native driver. */
  breath?: boolean;
  /** Halo ring + tick color. Defaults to navy. */
  haloColor?: string;
  /** Halo opacity. Defaults to 0.14 (subtle on cream). */
  haloOpacity?: number;
  /** Container style override. */
  style?: StyleProp<ViewStyle>;
  /** Emblem image style override (e.g. tintColor for inverted contexts). */
  imageStyle?: StyleProp<ImageStyle>;
}

export function BrandEmblem({
  size = 96,
  halo = true,
  breath = false,
  haloColor = paper.dashboardInk,
  haloOpacity = 0.14,
  style,
  imageStyle,
}: BrandEmblemProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!breath) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.045,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breath, scale]);

  // Halo is sized off the emblem so proportions stay tight at any size.
  // Three rings (outer/mid/inner) and four hairline cardinal ticks just
  // outside the outermost ring.
  const haloOuter = size * 1.55;
  const haloMid = size * 1.22;
  const haloInner = size * 0.92;
  const tickLength = size * 0.07;
  const tickInset = (haloOuter - size) / 2 - tickLength - 4;

  return (
    <View
      style={[styles.root, { width: haloOuter, height: haloOuter }, style]}
      pointerEvents="none"
    >
      {halo ? (
        <>
          <Ring diameter={haloOuter} color={haloColor} opacity={haloOpacity * 0.9} strokeWidth={1} />
          <Ring diameter={haloMid} color={haloColor} opacity={haloOpacity * 0.7} strokeWidth={0.7} />
          <Ring diameter={haloInner} color={haloColor} opacity={haloOpacity * 0.5} strokeWidth={0.5} />
          {/* N · E · S · W cardinal ticks */}
          <CardinalTick position="top" length={tickLength} inset={tickInset} color={haloColor} opacity={haloOpacity * 1.6} />
          <CardinalTick position="right" length={tickLength} inset={tickInset} color={haloColor} opacity={haloOpacity * 1.6} />
          <CardinalTick position="bottom" length={tickLength} inset={tickInset} color={haloColor} opacity={haloOpacity * 1.6} />
          <CardinalTick position="left" length={tickLength} inset={tickInset} color={haloColor} opacity={haloOpacity * 1.6} />
        </>
      ) : null}

      <Animated.View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
        }}
      >
        <Image
          source={require('../../assets/images/finfindr-logo.png')}
          style={[{ width: size, height: size }, imageStyle]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

function Ring({
  diameter,
  color,
  strokeWidth,
  opacity,
}: {
  diameter: number;
  color: string;
  strokeWidth: number;
  opacity: number;
}) {
  return (
    <View style={styles.ringWrap}>
      <View
        style={{
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          opacity,
        }}
      />
    </View>
  );
}

function CardinalTick({
  position,
  length,
  inset,
  color,
  opacity,
}: {
  position: 'top' | 'right' | 'bottom' | 'left';
  length: number;
  inset: number;
  color: string;
  opacity: number;
}) {
  const base = {
    position: 'absolute' as const,
    backgroundColor: color,
    opacity,
  };
  if (position === 'top') {
    return (
      <View style={[base, { top: inset, left: 0, right: 0, alignItems: 'center' }]}>
        <View style={{ width: 1, height: length, backgroundColor: color }} />
      </View>
    );
  }
  if (position === 'bottom') {
    return (
      <View style={[base, { bottom: inset, left: 0, right: 0, alignItems: 'center' }]}>
        <View style={{ width: 1, height: length, backgroundColor: color }} />
      </View>
    );
  }
  if (position === 'left') {
    return (
      <View
        style={[
          base,
          { left: inset, top: 0, bottom: 0, justifyContent: 'center' },
        ]}
      >
        <View style={{ height: 1, width: length, backgroundColor: color }} />
      </View>
    );
  }
  // right
  return (
    <View
      style={[
        base,
        { right: inset, top: 0, bottom: 0, justifyContent: 'center' },
      ]}
    >
      <View style={{ height: 1, width: length, backgroundColor: color }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
