/**
 * Sharp-cornered pill used for GO / FAIR / SKIP tier labels and similar ink-
 * on-color chips (e.g. "● EXCELLENT" next to the hero score).
 */

import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import {
  paper,
  paperFonts,
  paperRadius,
  paperTier,
  type PaperTier,
} from '../../lib/theme';

interface TierPillProps {
  /** Preset tier — fills the background with its mapped color. */
  tier?: PaperTier;
  /** Custom text label. Defaults to the tier's preset label. */
  label?: string;
  /** Override background/foreground when not using a preset tier. */
  background?: string;
  color?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function TierPill({
  tier,
  label,
  background,
  color,
  size = 'sm',
  style,
}: TierPillProps) {
  const resolvedBg = background ?? (tier ? paperTier[tier].bg : paper.forest);
  const resolvedFg = color ?? (tier ? paperTier[tier].fg : paper.paper);
  const resolvedLabel = label ?? (tier ? paperTier[tier].label : '');
  return (
    <View
      style={[
        styles.pill,
        size === 'md' && styles.md,
        { backgroundColor: resolvedBg },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'md' && styles.textMd,
          { color: resolvedFg },
        ]}
        numberOfLines={1}
      >
        {resolvedLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: paperRadius.chip,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  text: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
  textMd: {
    fontSize: 11,
    letterSpacing: 2,
  },
});
