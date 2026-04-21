/**
 * Small topwater-popper glyph used on the "WHAT TO THROW?" CTA in place of a
 * generic fish icon. Matches FinFindr's tackle iconography language.
 *
 * Construction (pure RN, no SVG):
 *   - Cupped head: a small rounded rectangle, slightly tilted.
 *   - Body: a larger rounded rectangle forming the lure body.
 *   - Line tie: small circle at the nose.
 *   - Hook: a thin curved arc fashioned from a bordered square with
 *           borderBottom + borderLeft only, rotated.
 *   - Tail feather: 3 thin strokes fanning out.
 */

import { StyleSheet, View, type ViewStyle } from 'react-native';
import { paper } from '../../lib/theme';

interface LurePopperProps {
  size?: number;
  color?: string;
  outline?: string;
  style?: ViewStyle;
}

export function LurePopper({
  size = 30,
  color = paper.ink,
  outline = paper.ink,
  style,
}: LurePopperProps) {
  const scale = size / 30;

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size },
        style,
      ]}
      pointerEvents="none"
    >
      {/* Body */}
      <View
        style={[
          styles.body,
          {
            width: 18 * scale,
            height: 9 * scale,
            borderRadius: 4 * scale,
            borderWidth: 1.5,
            backgroundColor: paper.paperLight,
            borderColor: outline,
            left: 4 * scale,
            top: 11 * scale,
          },
        ]}
      />
      {/* Cupped head (darker) */}
      <View
        style={[
          styles.head,
          {
            width: 6 * scale,
            height: 9 * scale,
            borderRadius: 3 * scale,
            borderWidth: 1.5,
            borderColor: outline,
            backgroundColor: color,
            left: 1 * scale,
            top: 11 * scale,
          },
        ]}
      />
      {/* Line tie (tiny circle at nose) */}
      <View
        style={[
          styles.tie,
          {
            width: 3 * scale,
            height: 3 * scale,
            borderRadius: (3 * scale) / 2,
            borderWidth: 1,
            borderColor: outline,
            left: 0,
            top: 14 * scale,
          },
        ]}
      />
      {/* Treble hook — simple arc via bordered box */}
      <View
        style={{
          position: 'absolute',
          left: 14 * scale,
          top: 18 * scale,
          width: 7 * scale,
          height: 7 * scale,
          borderBottomWidth: 1.25,
          borderRightWidth: 1.25,
          borderColor: outline,
          borderBottomRightRadius: 4 * scale,
        }}
      />
      {/* Tail feather (three tick strokes) */}
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: 23 * scale,
            top: (11 + i * 2.75) * scale,
            width: 5 * scale,
            height: 1.25,
            backgroundColor: outline,
            transform: [{ rotate: `${-8 + i * 8}deg` }],
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  body: {
    position: 'absolute',
  },
  head: {
    position: 'absolute',
  },
  tie: {
    position: 'absolute',
  },
});
