/**
 * FinFindr "paper card" — a 2px ink-stroked rectangle with a hard 2px ink
 * shadow beneath. Used everywhere: live conditions card, forecast tiles, CTAs,
 * report panels, etc.
 *
 * Supports optional corner marks, an internal tint, and a `pressed` variant
 * for tappable cards.
 */

import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import {
  paper,
  paperBorders,
  paperRadius,
  paperShadows,
} from '../../lib/theme';
import { CornerMarkSet } from './CornerMark';

export interface PaperCardProps {
  children?: ReactNode;
  /** Background of the card (default paperLight). */
  tint?: string;
  /** Render the four red corner brackets inside. */
  corners?: boolean;
  cornerColor?: string;
  /** Soft "lift" when pressed (supplied by parent Pressable). */
  pressed?: boolean;
  /** Wrap with overflow: hidden. Default true. */
  clip?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export function PaperCard({
  children,
  tint = paper.paperLight,
  corners = false,
  cornerColor,
  pressed,
  clip = true,
  style,
}: PaperCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: tint },
        clip && styles.clip,
        pressed && styles.pressed,
        style,
      ]}
    >
      {corners && <CornerMarkSet color={cornerColor} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
  },
  clip: {
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ translateY: 1 }],
    shadowOpacity: 0.4,
  },
});
