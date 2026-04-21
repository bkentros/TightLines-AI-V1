/**
 * Medal badge — a circular gold/silver/bronze token stroked with 2px ink and
 * a Roman numeral (I, II, III) in Fraunces. Used on the Home "What to Throw"
 * preview and (future) on the recommender results list.
 */

import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

export type MedalTier = 'gold' | 'silver' | 'bronze';

interface MedalBadgeProps {
  tier: MedalTier;
  size?: number;
  style?: ViewStyle;
  /** Label override (defaults to I / II / III for gold/silver/bronze). */
  label?: string;
}

const TIER_COLOR: Record<MedalTier, string> = {
  gold: paper.medalGold,
  silver: paper.medalSilver,
  bronze: paper.medalBronze,
};

const TIER_LABEL: Record<MedalTier, string> = {
  gold: 'I',
  silver: 'II',
  bronze: 'III',
};

export function MedalBadge({ tier, size = 30, style, label }: MedalBadgeProps) {
  return (
    <View
      style={[
        styles.medal,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: TIER_COLOR[tier],
        },
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize: size * 0.38 }]} numberOfLines={1}>
        {label ?? TIER_LABEL[tier]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  medal: {
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: paperFonts.display,
    color: paper.ink,
    fontWeight: '700',
  },
});
