/**
 * WaterReadEditionStamp — small FinFindr product mark for the map plate.
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
        source={require('../../assets/images/finfindr-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.typeStack}>
        <Text style={styles.wordmark} numberOfLines={1}>
          FinFindr<Text style={styles.wordmarkDot}>.</Text>
        </Text>
        <Text style={styles.edition} numberOfLines={1}>
          WATER READ
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(10, 27, 46, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  logo: {
    width: 24,
    height: 28,
    backgroundColor: paper.dashboardInk,
    borderRadius: 7,
  },
  typeStack: {
    alignItems: 'flex-start',
    gap: 0,
  },
  wordmark: {
    fontFamily: paperFonts.display,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    color: paper.dashboardInk,
    lineHeight: 15,
  },
  wordmarkDot: {
    color: paper.dashboardBlue,
  },
  edition: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
    lineHeight: 10,
  },
});
