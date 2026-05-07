/**
 * WaterReadScaleBar — editorial scale-bar marginalia for the lower-left
 * corner of the map plate.
 *
 * The Water Read engine renders polygons fit-to-viewport for visual
 * clarity, not navigation, so this bar is intentionally an editorial
 * gesture rather than a precise ruler. We pick a sensible round number
 * from the lake's surface area (which loosely correlates with how big
 * the rendered polygon will appear) and prefix the label with "≈" so
 * users read it as a guide note. Honors the user's units pref.
 */

import { StyleSheet, Text, View } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

export interface WaterReadScaleBarProps {
  areaAcres?: number | null;
  units?: 'imperial' | 'metric';
}

export function WaterReadScaleBar({
  areaAcres,
  units = 'imperial',
}: WaterReadScaleBarProps) {
  const label = pickScaleLabel(areaAcres ?? null, units);

  return (
    <View style={styles.root} pointerEvents="none" accessibilityElementsHidden>
      <View style={styles.barRow}>
        <View style={styles.tickEnd} />
        <View style={styles.bar} />
        <View style={styles.tickMid} />
        <View style={styles.bar} />
        <View style={styles.tickEnd} />
      </View>
      <Text style={styles.label}>≈ {label}</Text>
    </View>
  );
}

function pickScaleLabel(
  acres: number | null,
  units: 'imperial' | 'metric',
): string {
  // Round ground distance choices keyed off lake size buckets. Buckets are
  // generous so most lakes land on a clean number.
  if (units === 'metric') {
    if (acres == null || acres <= 0) return '500 M';
    if (acres < 50) return '100 M';
    if (acres < 500) return '300 M';
    if (acres < 5_000) return '1 KM';
    if (acres < 50_000) return '3 KM';
    return '10 KM';
  }
  if (acres == null || acres <= 0) return '0.25 MI';
  if (acres < 50) return '300 FT';
  if (acres < 500) return '1000 FT';
  if (acres < 5_000) return '0.5 MI';
  if (acres < 50_000) return '2 MI';
  return '5 MI';
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-start',
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickEnd: {
    width: 1.5,
    height: 9,
    backgroundColor: paper.ink,
  },
  tickMid: {
    width: 1.5,
    height: 5,
    backgroundColor: paper.ink,
    opacity: 0.7,
  },
  bar: {
    width: 32,
    height: 1.5,
    backgroundColor: paper.ink,
  },
  label: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: paper.ink,
    opacity: 0.78,
    fontWeight: '700',
    lineHeight: 11,
  },
});
