/**
 * Small L-shaped bracket that clamps onto the inside corners of a paper card.
 * Matches the "CornerMark" helper from `finfindr.jsx` — four instances per
 * card, one per corner, usually rendered in the accent red.
 *
 * Uses plain borders so no SVG dependency is required.
 */

import { StyleSheet, View } from 'react-native';
import { paper } from '../../lib/theme';

export type CornerMarkPosition = 'tl' | 'tr' | 'bl' | 'br';

interface CornerMarkProps {
  position: CornerMarkPosition;
  color?: string;
  /** Edge length of the bracket (default 14, matching mock). */
  size?: number;
  /** Stroke width (default 2, matching mock). */
  thickness?: number;
  /** Offset from the parent's inside edge (default 8). */
  inset?: number;
}

export function CornerMark({
  position,
  color = paper.ink,
  size = 14,
  thickness = 2,
  inset = 8,
}: CornerMarkProps) {
  const common = {
    position: 'absolute' as const,
    width: size,
    height: size,
  };
  const border = { borderColor: color };
  const byPosition = {
    tl: {
      top: inset,
      left: inset,
      borderTopWidth: thickness,
      borderLeftWidth: thickness,
    },
    tr: {
      top: inset,
      right: inset,
      borderTopWidth: thickness,
      borderRightWidth: thickness,
    },
    bl: {
      bottom: inset,
      left: inset,
      borderBottomWidth: thickness,
      borderLeftWidth: thickness,
    },
    br: {
      bottom: inset,
      right: inset,
      borderBottomWidth: thickness,
      borderRightWidth: thickness,
    },
  }[position];

  return <View pointerEvents="none" style={[common, border, byPosition]} />;
}

/**
 * Convenience: four red corner marks framing the inside of a card.
 */
export function CornerMarkSet({
  color = paper.red,
  size = 14,
  thickness = 2,
  inset = 8,
}: Omit<CornerMarkProps, 'position'> = {}) {
  return (
    <>
      <CornerMark position="tl" color={color} size={size} thickness={thickness} inset={inset} />
      <CornerMark position="tr" color={color} size={size} thickness={thickness} inset={inset} />
      <CornerMark position="bl" color={color} size={size} thickness={thickness} inset={inset} />
      <CornerMark position="br" color={color} size={size} thickness={thickness} inset={inset} />
    </>
  );
}

// Silence unused-import warning for the `StyleSheet` helper above on some RN
// versions where `pointerEvents` is typed differently.
void StyleSheet;
