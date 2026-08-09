/**
 * WaterReadEditionStamp — top-left FinFindr brand chip on the map plate.
 *
 * Single horizontal pill containing: logo • "FinFindr." wordmark •
 * "WATER READ · POLYGON SCAN" eyebrow. Combining the brand mark + edition
 * tagline into one compact pill keeps the map's top-left clean (one mark,
 * not two) and ensures the chip fits within the engine's typical land
 * margin even on wide lakes.
 *
 * White-pill background with a hairline ink stroke so the chip reads
 * cleanly against either the tan land OR the gradient lake water — i.e.
 * even if a very wide lake brings the polygon close to the corner, the
 * pill maintains contrast.
 */

import { Image, StyleSheet, Text, View } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

export function WaterReadEditionStamp() {
  return (
    <View
      style={styles.root}
      pointerEvents="none"
      accessibilityElementsHidden
    >
      <Image
        source={require('../../assets/images/finfindr-dashboard-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.wordmark} numberOfLines={1}>
        FinFindr<Text style={styles.wordmarkDot}>.</Text>
      </Text>
      <View style={styles.divider} />
      <Text style={styles.edition} numberOfLines={1}>
        WATER READ · POLYGON SCAN
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(28, 36, 25, 0.22)',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    // Subtle ink shadow so the chip lifts off the paper texture.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    alignSelf: 'flex-start',
  },
  logo: {
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  wordmark: {
    fontFamily: paperFonts.display,
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0,
    color: paper.dashboardInk,
    lineHeight: 14,
  },
  wordmarkDot: {
    color: paper.dashboardBlue,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 14,
    backgroundColor: 'rgba(28, 36, 25, 0.28)',
    marginHorizontal: 1,
  },
  edition: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.3,
    color: paper.dashboardMuted,
    lineHeight: 10,
  },
});
