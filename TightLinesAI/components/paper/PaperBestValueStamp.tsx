/**
 * PaperBestValueStamp — a compact membership badge for the Master Angler
 * card. It uses the dashboard palette so the upgrade callout feels native
 * to the current FinFindr shell.
 *
 *   ┌───────────────┐
 *   │  ╔══════════╗ │   ← compact badge, sits absolute over a card
 *   │  ║ ★ BEST ★ ║ │
 *   │  ║   VALUE   ║ │
 *   │  ╚══════════╝ │
 *   └───────────────┘
 *
 * Designed for the Subscribe screen's Master Angler tier so the
 * upgraded plan stands out without turning into a separate ad. The
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
   * Tilt in degrees applied via transform. Default `0` keeps it aligned
   * with the dashboard chrome.
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
  tilt = 0,
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
      <View style={styles.outer}>
        <View style={styles.inner}>
          <Text style={styles.topLine}>{topLine}</Text>
          <Text style={styles.bottomLine}>{bottomLine}</Text>
        </View>
      </View>
    </View>
  );
}

const STAMP_WIDTH = 86;

const styles = StyleSheet.create({
  absoluteWrap: {
    position: 'absolute',
    top: -8,
    right: 10,
    width: STAMP_WIDTH,
    zIndex: 10,
  },
  inlineWrap: {
    width: STAMP_WIDTH,
  },
  outer: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: '#F7FAFB',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  inner: {
    borderWidth: 1,
    borderColor: `${paper.dashboardBlue}44`,
    paddingVertical: 3,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderRadius: 6,
  },
  topLine: {
    fontFamily: paperFonts.metaMonoBold,
    color: paper.dashboardBlue,
    fontSize: 8,
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  bottomLine: {
    fontFamily: paperFonts.display,
    color: paper.dashboardInk,
    fontSize: 13,
    letterSpacing: 0,
    fontWeight: '800',
  },
});
