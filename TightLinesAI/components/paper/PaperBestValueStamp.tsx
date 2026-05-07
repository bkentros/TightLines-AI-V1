/**
 * PaperBestValueStamp — an editorial "rubber stamp" badge tilted into
 * the corner of a card. Drawn with the paper system's accent red on
 * paper-light, double-ruled border, all-caps Fraunces interior.
 *
 *   ┌───────────────┐
 *   │  ╔══════════╗ │   ← tilted stamp, sits absolute over a card
 *   │  ║ ★ BEST ★ ║ │
 *   │  ║   VALUE   ║ │
 *   │  ╚══════════╝ │
 *   └───────────────┘
 *
 * Designed for the Subscribe screen's Master Angler tier so the
 * upgraded plan stands out without breaking the paper voice. The
 * component renders absolutely positioned by default — wrap the parent
 * in a `position: 'relative'` container.
 */

import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { paper, paperFonts } from '../../lib/theme';

interface PaperBestValueStampProps {
  /** Header word, default "BEST". */
  topLine?: string;
  /** Bigger second word, default "VALUE". */
  bottomLine?: string;
  /**
   * Tilt in degrees applied via transform. Default `-8` (slightly
   * leftward — feels like a real ink stamp).
   */
  tilt?: number;
  /**
   * Pinning. Defaults to top-right corner with comfortable insets.
   * Pass `style` to override. Use `inline` to render statically.
   */
  inline?: boolean;
  style?: ViewStyle;
}

export function PaperBestValueStamp({
  topLine = 'BEST',
  bottomLine = 'VALUE',
  tilt = -8,
  inline = false,
  style,
}: PaperBestValueStampProps) {
  return (
    <View
      style={[
        inline ? styles.inlineWrap : styles.absoluteWrap,
        { transform: [{ rotate: `${tilt}deg` }] },
        style,
      ]}
      accessibilityLabel={`${topLine} ${bottomLine}`}
    >
      {/* Outer ruled border + inner ruled border = the "double rule"
          that makes this read as a stamp rather than a button. */}
      <View style={styles.outer}>
        <View style={styles.inner}>
          <Text style={styles.topLine}>★ {topLine} ★</Text>
          <Text style={styles.bottomLine}>{bottomLine}</Text>
        </View>
      </View>
    </View>
  );
}

const STAMP_WIDTH = 92;

const styles = StyleSheet.create({
  absoluteWrap: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: STAMP_WIDTH,
    zIndex: 10,
  },
  inlineWrap: {
    width: STAMP_WIDTH,
  },
  outer: {
    borderWidth: 2,
    borderColor: paper.red,
    backgroundColor: paper.paperLight,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  inner: {
    borderWidth: 1,
    borderColor: paper.red,
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  topLine: {
    fontFamily: paperFonts.bodyBold,
    color: paper.red,
    fontSize: 8.5,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
  bottomLine: {
    fontFamily: paperFonts.display,
    color: paper.red,
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: '800',
  },
});
