/**
 * PaperColophon — the editorial sign-off rendered at the bottom of every
 * long-scroll paper screen.
 *
 * Shape:
 *
 *           ─────────────────────────────────────────
 *                       FINFINDR · DAILY
 *                NO. 1402 · ESTABLISHED ON THE BANK
 *           ─────────────────────────────────────────
 *
 * Two ink rules sandwich a small Fraunces section name and a mono-style
 * "edition" stamp. Mirrors the publication-footer the rest of the paper
 * system gestures toward (small caps + tracked uppercase + dashes).
 *
 *     <PaperColophon section="DAILY" />
 *     <PaperColophon section="LOG" tagline="ALL CAUGHT, NEVER LOST" />
 *     <PaperColophon section="ANALYTICS" />
 */

import { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { paper, paperFonts, paperSpacing } from '../../lib/theme';

interface PaperColophonProps {
  /**
   * The section name printed in the masthead — e.g. "DAILY" renders
   * "FINFINDR · DAILY". Defaults to "DAILY".
   */
  section?: string;
  /**
   * Replace the lower line ("ESTABLISHED ON THE BANK") with a custom
   * tagline. Receives the rendered edition number (e.g. "1402") so
   * callers can write `(edition) => `NO. ${edition} · YOUR LINE``.
   *
   * If omitted we render `NO. <edition> · ESTABLISHED ON THE BANK`.
   */
  tagline?: string | ((edition: string) => string);
  /**
   * Fix the edition number (otherwise it is derived from the day-of-year
   * so it changes daily but is stable within a single render — important
   * because we do NOT want this to look like a dynamic counter, just a
   * publication touch).
   */
  edition?: string | number;
  style?: ViewStyle;
}

export function PaperColophon({
  section = 'DAILY',
  tagline,
  edition,
  style,
}: PaperColophonProps) {
  const editionStamp = useMemo(() => {
    if (edition !== undefined) return String(edition);
    // Day-of-year — small editorial flourish so the masthead reads
    // "freshly printed" without becoming a real counter the user has
    // to interpret.
    const now = new Date();
    const start = Date.UTC(now.getUTCFullYear(), 0, 0);
    const diff = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start;
    const dayOfYear = Math.floor(diff / 86_400_000);
    return String(1000 + dayOfYear);
  }, [edition]);

  const lowerLine = useMemo(() => {
    if (typeof tagline === 'function') return tagline(editionStamp);
    if (typeof tagline === 'string') return tagline;
    return `NO. ${editionStamp} · ESTABLISHED ON THE BANK`;
  }, [tagline, editionStamp]);

  return (
    <View style={[styles.wrap, style]} accessibilityElementsHidden>
      <View style={styles.rule} />
      <Text style={styles.masthead}>FINFINDR · {section.toUpperCase()}</Text>
      <Text style={styles.tagline}>{lowerLine.toUpperCase()}</Text>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: paperSpacing.lg,
    gap: paperSpacing.xs + 2,
  },
  rule: {
    height: 1,
    backgroundColor: paper.ink,
    width: '70%',
    opacity: 0.55,
  },
  masthead: {
    fontFamily: paperFonts.display,
    fontSize: 12,
    color: paper.ink,
    letterSpacing: 2.4,
    fontWeight: '700',
  },
  tagline: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.inkSoft,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
});
