/**
 * PaperNavHeader — the FinFindr "editorial" top bar.
 *
 * Lifted out of `app/water-reader.tsx` (and mirrored from
 * `app/recommender.tsx` / `app/how-fishing.tsx`) so every paper screen
 * with a back affordance can render the same chrome instead of falling
 * back to the system Stack header.
 *
 * Visual anatomy (matches the existing Water Reader / Recommender shell):
 *
 *   ┌───────────────────────────────────────────────────────┐
 *   │ [⟵ BACK]      ─── FINFINDR ───       [right slot] │  ← navHeader
 *   │                  WATER READER                          │
 *   └───────────────────────────────────────────────────────┘
 *
 * The eyebrow line (default "FINFINDR" in accent red) and the bigger
 * Fraunces title sit absolute-positioned in the center so the back chip
 * and an optional right slot can flank them without nudging the title.
 *
 * The component is layout-only — it does NOT call `router.back()`
 * itself. Callers wire whatever back behavior they need (most do
 * `router.back()`; a few prompt with `Alert.alert` first).
 *
 * USAGE
 *
 *   <PaperNavHeader
 *     title="ANALYTICS"
 *     onBack={() => router.back()}
 *   />
 *
 *   <PaperNavHeader
 *     eyebrow="FINFINDR · TRIP RECORD"
 *     title="LOG DETAIL"
 *     onBack={() => router.back()}
 *     right={
 *       <Pressable onPress={onShare}><ShareIcon /></Pressable>
 *     }
 *   />
 *
 * Pair the screen with `headerShown: false` in `app/_layout.tsx` so this
 * is the only top bar.
 */

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperSpacing,
} from '../../lib/theme';

interface PaperNavHeaderProps {
  /**
   * The big Fraunces title line (rendered uppercase). Required — every
   * paper screen has a section identity (e.g. "WATER READER", "TRIP
   * DETAILS", "ANALYTICS").
   */
  title: string;
  /**
   * Editorial eyebrow above the title. Defaults to `FINFINDR`. Pass a
   * specific section eyebrow like `FINFINDR · TRIP RECORD` to mirror
   * the way the body screens use `<SectionEyebrow>` at the top.
   */
  eyebrow?: string;
  /** Color for the eyebrow line. Default `paper.red`. */
  eyebrowColor?: string;
  /**
   * Back press handler. Renders a `[⟵ BACK]` chip on the left when
   * supplied, or an empty 62px spacer when omitted (so the centered
   * title stays optically centered).
   */
  onBack?: () => void;
  /** Override the back chip label. Defaults to "BACK". */
  backLabel?: string;
  /**
   * Right-side slot for an action chip (e.g. a state picker pill, a
   * share icon, etc.). When omitted, an invisible 62px spacer is
   * rendered to keep the title centered.
   */
  right?: ReactNode;
  /** Outer container style override. */
  style?: ViewStyle;
}

export function PaperNavHeader({
  title,
  eyebrow = 'FINFINDR',
  eyebrowColor = paper.red,
  onBack,
  backLabel = 'BACK',
  right,
  style,
}: PaperNavHeaderProps) {
  return (
    <View style={[styles.navHeader, style]}>
      {/* ── Left slot: back chip or spacer ─────────────────────────── */}
      {onBack ? (
        <Pressable
          style={({ pressed }) => [
            styles.navBackBtn,
            pressed && styles.navBackBtnPressed,
          ]}
          onPress={onBack}
          hitSlop={12}
          accessibilityLabel={backLabel}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={14} color={paper.ink} />
          <Text style={styles.navBackBtnText}>{backLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.navSlotSpacer} />
      )}

      {/* ── Centered title block (absolute, doesn't disturb flanks) ── */}
      <View style={styles.navTitleWrap} pointerEvents="none">
        <Text style={[styles.navEyebrow, { color: eyebrowColor }]}>{eyebrow}</Text>
        <Text style={styles.navTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* ── Right slot: action chip or spacer ──────────────────────── */}
      <View style={styles.navRight}>{right ?? <View style={styles.navSlotSpacer} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
    backgroundColor: paper.paper,
    borderBottomWidth: 1,
    borderBottomColor: paper.inkHairSoft,
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: 'transparent',
  },
  navBackBtnPressed: { opacity: 0.7 },
  navBackBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
  navTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: paperSpacing.sm,
    bottom: paperSpacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    letterSpacing: 2.6,
  },
  navTitle: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    color: paper.ink,
    letterSpacing: -0.2,
    marginTop: 1,
    fontWeight: '700',
  },
  navRight: {
    minWidth: 62,
    alignItems: 'flex-end',
  },
  navSlotSpacer: { width: 62, height: 1 },
});
