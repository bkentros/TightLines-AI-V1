/**
 * Faint target / compass rose used inside the Live Conditions card. Matches
 * the decorative SVG compass in `finfindr.jsx`:
 *
 *   <svg width=240 height=240 style="right:-60; top:-60; opacity:0.09">
 *     <circle r=110 /> <circle r=85 /> <circle r=55 />
 *     16 radial ticks (every 22.5°), thicker on the 4 cardinals.
 *     "N" marker at the top (in red, Fraunces 700)
 *
 * We recreate it with plain Views (no `react-native-svg`) so the dev client
 * does not need a native rebuild.
 *
 * Implementation notes:
 *   - `size` controls the overall diameter (default 240 to match the mock).
 *   - The parent is expected to position this absolutely in the card's top-
 *     right, with negative offsets so ~⅓ of the rose bleeds off the edge
 *     (matches the reference's `right:-60; top:-60`).
 *   - Ticks are absolute-positioned radial bars rotated around the compass
 *     center. Each tick sits on the outer rim and extends inward; the
 *     cardinal ticks (N/E/S/W) are longer and thicker than the interspersed
 *     ticks so the rose reads as a compass, not a dotted ring.
 *   - Ring strokes thin out from outer to inner, matching the reference.
 */

import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

interface CompassRoseProps {
  /** Outer diameter in px. Default 240 (matches the mock). */
  size?: number;
  color?: string;
  /** Max opacity for the whole rose. Default 0.09 — stay subtle. */
  opacity?: number;
  /** Optional "N" marker on the top rim (matches the reference). */
  showNorthLabel?: boolean;
  style?: ViewStyle;
}

const TICK_COUNT = 16;

export function CompassRose({
  size = 240,
  color = paper.ink,
  opacity = 0.09,
  showNorthLabel = true,
  style,
}: CompassRoseProps) {
  const half = size / 2;
  // Match the reference's three rings: r = 110, 85, 55 on a 240 canvas.
  const ring1 = size * (110 / 120); // outer
  const ring2 = size * (85 / 120);
  const ring3 = size * (55 / 120);

  // Tick bars originate from the compass center and extend *up* along the
  // radius. We render a short colored bar positioned near the outer ring and
  // rotate the whole thing around the center.
  const tickLength = size * (10 / 120); // ~10px on a 240 canvas

  return (
    <View
      pointerEvents="none"
      style={[
        styles.root,
        { width: size, height: size, opacity },
        style,
      ]}
    >
      {/* 3 concentric rings, decreasing stroke weight. */}
      <Ring diameter={ring1} color={color} strokeWidth={1} />
      <Ring diameter={ring2} color={color} strokeWidth={0.6} />
      <Ring diameter={ring3} color={color} strokeWidth={0.6} />

      {/* Radial ticks — a short bar near the outer rim, rotated around the
          compass center. */}
      {Array.from({ length: TICK_COUNT }).map((_, i) => {
        const rotation = (i / TICK_COUNT) * 360;
        const isCardinal = i % 4 === 0;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: half,
              top: half,
              width: 0,
              height: 0,
              transform: [{ rotate: `${rotation}deg` }],
            }}
          >
            <View
              style={{
                position: 'absolute',
                left: isCardinal ? -1 : -0.5,
                top: -(ring1 / 2) + 2,
                width: isCardinal ? 1.5 : 0.7,
                height: isCardinal ? tickLength + 4 : tickLength,
                backgroundColor: color,
                opacity: isCardinal ? 1 : 0.7,
              }}
            />
          </View>
        );
      })}

      {/* "N" marker at the top */}
      {showNorthLabel && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: Math.max(0, half - ring1 / 2 - 2),
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: paperFonts.display,
              fontSize: size * (12 / 240),
              color: paper.red,
              fontWeight: '700',
            }}
          >
            N
          </Text>
        </View>
      )}
    </View>
  );
}

function Ring({
  diameter,
  color,
  strokeWidth,
}: {
  diameter: number;
  color: string;
  strokeWidth: number;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          borderWidth: strokeWidth,
          borderColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
  },
});
