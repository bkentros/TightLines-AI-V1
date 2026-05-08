/**
 * WaterReadEditionStamp — circular hand-pressed stamp for the lower-right
 * corner of the map plate. Paper-warm body, ink-red type, single bold ring
 * with generous internal breathing room so FINFINDR / NO. {edition} /
 * WATER READ all sit clearly inside the stamp rather than crowding the
 * border. Slight tilt sells the "ink-pressed" feel.
 *
 * Mirrors the voice of `PaperBestValueStamp` (the only other "stamp"
 * primitive in the system) but stripped of stars and tuned for the
 * cartographic context — three calmly-stacked lines instead of a two-line
 * marketing badge.
 */

import { StyleSheet, Text, View } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

export interface WaterReadEditionStampProps {
  edition: string;
  /**
   * Tilt in degrees. Default -4 (slight counter-clockwise — still reads as
   * "ink-pressed" without rotating the text bbox far enough that the
   * corners of FINFINDR / WATER READ poke past the circle's border. The
   * earlier -7° caused exactly that visual bleed at smaller diameters.
   */
  tilt?: number;
  /**
   * Outer diameter in px. Default 90 — sized so 8pt FINFINDR / 18pt
   * edition / 8pt WATER READ all sit clearly inside the ring with at
   * least 6 px of margin on every side, even at the rotated text bbox.
   */
  size?: number;
}

export function WaterReadEditionStamp({
  edition,
  tilt = -4,
  size = 90,
}: WaterReadEditionStampProps) {
  // Inner padding scales with diameter so the stamp keeps the same visual
  // breathing rhythm at any size override the caller might pass. Bumped
  // 16% → 18% so the text rows always stay comfortably inside the ring.
  const innerPad = Math.round(size * 0.18);

  return (
    <View
      style={[styles.root, { transform: [{ rotate: `${tilt}deg` }] }]}
      pointerEvents="none"
      accessibilityElementsHidden
    >
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            paddingHorizontal: innerPad,
            paddingVertical: innerPad,
          },
        ]}
      >
        <Text style={styles.topLine} numberOfLines={1}>
          FINFINDR
        </Text>
        <Text style={styles.editionNum} numberOfLines={1}>
          {edition}
        </Text>
        <Text style={styles.bottomLine} numberOfLines={1}>
          WATER READ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    // Caller positions absolutely.
  },
  ring: {
    borderWidth: 2.2,
    borderColor: paper.red,
    backgroundColor: paper.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLine: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: paper.red,
    fontWeight: '700',
    lineHeight: 10,
  },
  editionNum: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.red,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 20,
    marginVertical: 3,
  },
  bottomLine: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8,
    letterSpacing: 1.3,
    color: paper.red,
    fontWeight: '700',
    lineHeight: 9.5,
  },
});
