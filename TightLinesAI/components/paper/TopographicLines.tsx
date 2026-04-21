/**
 * Faint topographic contour hint — a stack of very wide, very flat ellipses
 * clipped by the parent card's bounds. The visible arc of each ellipse reads
 * like a subtle sinusoidal contour line, matching the feel of the SVG paths
 * in `finfindr.jsx`:
 *
 *   <path d="M-50,400 Q100,340 250,390 T550,400 T850,390" ... />
 *
 * The trick: each line is actually the stroke of a huge ellipse (width much
 * larger than the viewport) positioned so only its upper arc pokes through
 * the card's visible area. Because the ellipse is tall (e.g. 800×160) and
 * stroked only, it looks like a wave, not a circle.
 *
 * The parent MUST have `overflow: 'hidden'` for the clip to work.
 */

import { StyleSheet, View, type ViewStyle } from 'react-native';
import { paper } from '../../lib/theme';

interface TopographicLinesProps {
  /** Layout style for the absolute-positioned wrapper (required). */
  style?: ViewStyle;
  color?: string;
  /** Number of contour curves to draw. Default 5. */
  count?: number;
}

export function TopographicLines({
  style,
  color = paper.forestDk,
  count = 5,
}: TopographicLinesProps) {
  return (
    <View
      pointerEvents="none"
      style={[styles.root, style]}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isMajor = i % 2 === 0;
        // Each contour is a huge shallow ellipse. Stagger their vertical
        // position and horizontal offset so adjacent lines read as separate
        // undulations rather than concentric rings.
        const widthMult = 3.2 + (i % 3) * 0.25;
        const top = 10 + i * 22;
        const leftOffsetPct = (i % 2 === 0 ? -0.9 : -1.15) * 100;
        return (
          <View
            key={i}
            style={[
              styles.contour,
              {
                top,
                left: `${leftOffsetPct}%`,
                width: `${widthMult * 100}%`,
                height: 120 + (i % 3) * 20,
                borderWidth: isMajor ? 1 : 0.6,
                borderColor: color,
                opacity: isMajor ? 0.08 : 0.05,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  contour: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'transparent',
  },
});
