/**
 * FinFindr "score gauge" — a half-circle gauge ringed with tick marks and
 * anchored by a big Space Mono score in the center.
 *
 * FinFindr draws this as an SVG arc with a gradient stroke and tick marks.
 * To avoid adding `react-native-svg` (which needs a native rebuild), we
 * reproduce the same reading with pure Views:
 *
 *   - A ring of 11 tick marks arranged across the 180° arc using rotate
 *     transforms. Major ticks (0, 5, 10) are heavier.
 *   - A "progress ring" — a thick-bordered circle clipped to its top half,
 *     then rotated from -90° to clamp at the score position. Color segments
 *     (red / gold / forest) are layered so the ring transitions as you go.
 *   - A central Space Mono score with an "OUT OF 10" caption.
 *
 * This version intentionally keeps the gauge decorative. It visually communicates
 * the tier (red / yellow / green) and the score, matching the mock, without
 * requiring SVG or a new native module.
 */

import { StyleSheet, Text, View } from 'react-native';
import {
  paper,
  paperFonts,
  paperTierForScore,
} from '../../lib/theme';

interface ScoreGaugeProps {
  /** Score out of 10 (e.g. 8.4). Clamped to [0, 10]. */
  score: number;
  /** Overall gauge width in px. Default 220. */
  size?: number;
  /** Hide the tick marks for tight layouts. */
  hideTicks?: boolean;
}

const TICK_COUNT = 11;

export function ScoreGauge({ score, size = 220, hideTicks = false }: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(10, Number.isFinite(score) ? score : 0));
  const tier = paperTierForScore(clamped);
  const tierColor =
    tier === 'green' ? paper.forest : tier === 'yellow' ? paper.gold : paper.red;

  const half = size / 2;
  const ringDiameter = size - 24;
  const ringRadius = ringDiameter / 2;
  const ringThickness = 10;

  // Angular progress: 0 ⇒ -90°, 10 ⇒ +90°.
  const progressDeg = -90 + (clamped / 10) * 180;

  return (
    <View style={[styles.wrap, { width: size, height: half + 44 }]}>
      {/* Track: a ring clipped to top half only. */}
      <View
        style={[
          styles.ringMask,
          {
            width: ringDiameter,
            height: ringRadius,
            left: half - ringRadius,
            top: 12,
          },
        ]}
      >
        <View
          style={[
            styles.ring,
            {
              width: ringDiameter,
              height: ringDiameter,
              borderRadius: ringRadius,
              borderWidth: ringThickness,
              borderColor: paper.inkHairSoft,
            },
          ]}
        />
      </View>

      {/* Active segment — color-coded, rotated from left edge. */}
      <View
        style={[
          styles.ringMask,
          {
            width: ringDiameter,
            height: ringRadius,
            left: half - ringRadius,
            top: 12,
            transform: [
              { translateY: ringRadius / 2 },
              { rotate: `${progressDeg - 90}deg` },
              { translateY: -ringRadius / 2 },
            ],
            overflow: 'hidden',
          },
        ]}
        pointerEvents="none"
      >
        <View
          style={[
            styles.ring,
            {
              width: ringDiameter,
              height: ringDiameter,
              borderRadius: ringRadius,
              borderWidth: ringThickness,
              borderTopColor: tierColor,
              borderRightColor: 'transparent',
              borderLeftColor: tierColor,
              borderBottomColor: 'transparent',
            },
          ]}
        />
      </View>

      {/* Tick marks around the top arc. */}
      {!hideTicks && (
        <View style={[styles.tickLayer, { width: size, height: half + 10 }]} pointerEvents="none">
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const isMajor = i % 5 === 0;
            const rotation = -90 + (i / (TICK_COUNT - 1)) * 180;
            return (
              <View
                key={i}
                style={[
                  styles.tickOrigin,
                  {
                    left: half,
                    top: half,
                    transform: [
                      { rotate: `${rotation}deg` },
                      { translateY: -(ringRadius + 10) },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.tick,
                    {
                      height: isMajor ? 10 : 6,
                      width: isMajor ? 2 : 1,
                      opacity: isMajor ? 0.75 : 0.3,
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      )}

      {/* Center readout. */}
      <View style={[styles.readout, { top: 20, width: size }]} pointerEvents="none">
        <Text
          style={[
            styles.score,
            { color: paper.ink, fontSize: Math.round(size * 0.26) },
          ]}
          numberOfLines={1}
        >
          {clamped.toFixed(1)}
        </Text>
        <Text style={styles.outOf}>OUT OF 10</Text>
      </View>

      {/* Hub dot for visual anchor. */}
      <View
        pointerEvents="none"
        style={[
          styles.hubOuter,
          { left: half - 7, top: half - 7 },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.hubInner,
          { left: half - 2, top: half - 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    position: 'relative',
  },
  ringMask: {
    position: 'absolute',
    overflow: 'hidden',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tickLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tickOrigin: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
  },
  tick: {
    backgroundColor: paper.ink,
    borderRadius: 1,
  },
  readout: {
    position: 'absolute',
    alignItems: 'center',
  },
  score: {
    fontFamily: paperFonts.monoBold,
    fontWeight: '700',
    letterSpacing: -2,
  },
  outOf: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 3,
    marginTop: 4,
    fontWeight: '600',
  },
  hubOuter: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: paper.ink,
  },
  hubInner: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: paper.gold,
  },
});
