/**
 * WaterReadEditionStamp — circular hand-pressed stamp for the lower-right
 * corner of the map plate. Paper-warm body, ink-red type, double-rule
 * border, slight tilt so it reads as ink-pressed rather than CSS-rendered.
 *
 * Mirrors the voice of `PaperBestValueStamp` (the only other "stamp"
 * primitive in the system) but stripped of stars and tuned for the
 * cartographic context — three stacked lines (FINFINDR / NO. {edition} /
 * WATER READ) instead of a two-line marketing badge.
 */

import { StyleSheet, Text, View } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

export interface WaterReadEditionStampProps {
  edition: string;
  /** Tilt in degrees. Default -7 (gentle counter-clockwise — feels stamped). */
  tilt?: number;
  /** Outer diameter in px. Default 64. */
  size?: number;
}

export function WaterReadEditionStamp({
  edition,
  tilt = -7,
  size = 64,
}: WaterReadEditionStampProps) {
  return (
    <View
      style={[styles.root, { transform: [{ rotate: `${tilt}deg` }] }]}
      pointerEvents="none"
      accessibilityElementsHidden
    >
      <View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <View
          style={[
            styles.innerRing,
            {
              borderRadius: size / 2 - 4,
            },
          ]}
        >
          <Text style={styles.topArc}>FINFINDR</Text>
          <View style={styles.dividerRow}>
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
          </View>
          <Text style={styles.editionNum}>{edition}</Text>
          <View style={styles.dividerRow}>
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
          </View>
          <Text style={styles.bottomArc}>WATER READ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    // Caller positions absolutely.
  },
  outerRing: {
    borderWidth: 2,
    borderColor: paper.red,
    backgroundColor: paper.paperLight,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    flex: 1,
    width: '100%',
    borderWidth: 0.6,
    borderColor: paper.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 1,
  },
  topArc: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 7.5,
    letterSpacing: 1.4,
    color: paper.red,
    fontWeight: '700',
    lineHeight: 9,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    opacity: 0.7,
  },
  dividerDot: {
    width: 1.5,
    height: 1.5,
    borderRadius: 0.75,
    backgroundColor: paper.red,
  },
  dividerLine: {
    width: 14,
    height: 0.6,
    backgroundColor: paper.red,
  },
  editionNum: {
    fontFamily: paperFonts.display,
    fontSize: 13,
    color: paper.red,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 15,
  },
  bottomArc: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 7,
    letterSpacing: 1.3,
    color: paper.red,
    fontWeight: '700',
    lineHeight: 9,
  },
});
