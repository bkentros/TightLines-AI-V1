/**
 * FinFindr paper backdrop — full-bleed warm paper canvas.
 *
 * Kept intentionally flat. The earlier version tiled faint contour lines
 * across the entire page, but the reference shell concentrates the
 * topographic hint behind the Live Conditions card, not over the whole
 * surface. The contour band now lives in `TopographicLines` and is
 * positioned locally where it belongs, so this component just paints the
 * warm paper color and hosts children.
 */

import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { paper } from '../../lib/theme';

interface PaperBackgroundProps {
  children?: ReactNode;
  style?: ViewStyle;
}

export function PaperBackground({ children, style }: PaperBackgroundProps) {
  return <View style={[styles.root, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: paper.paper,
  },
});
