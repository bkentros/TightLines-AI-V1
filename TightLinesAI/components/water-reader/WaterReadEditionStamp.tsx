/**
 * WaterReadEditionStamp — small FinFindr publication mark for the
 * top-right corner of the map plate.
 *
 * The earlier circular rubber-stamp design was too visually loud (the
 * circle competed with the lake) and at smaller diameters the rotated
 * text bled past the ring border. We now render the FinFindr wordmark
 * with a red period, plus a tiny tracked "NO. {edition}" line beneath
 * — same publication-mark voice, far less footprint, and no chance of
 * the corner element overlapping the lake polygon.
 */

import { StyleSheet, Text, View } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

export interface WaterReadEditionStampProps {
  edition: string;
}

export function WaterReadEditionStamp({ edition }: WaterReadEditionStampProps) {
  return (
    <View
      style={styles.root}
      pointerEvents="none"
      accessibilityElementsHidden
    >
      <Text style={styles.wordmark} numberOfLines={1}>
        FinFindr<Text style={styles.wordmarkDot}>.</Text>
      </Text>
      <Text style={styles.edition} numberOfLines={1}>
        NO. {edition}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-end',
    gap: 1,
  },
  wordmark: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: paper.ink,
    lineHeight: 16,
  },
  wordmarkDot: {
    color: paper.red,
  },
  edition: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8,
    letterSpacing: 1.6,
    color: paper.ink,
    opacity: 0.55,
    fontWeight: '700',
    lineHeight: 10,
  },
});
