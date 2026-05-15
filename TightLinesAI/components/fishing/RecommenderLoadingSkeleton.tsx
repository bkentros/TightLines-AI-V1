/**
 * RecommenderLoadingSkeleton
 *
 * Paper-language placeholder that mirrors the shape of the renovated
 * "Tackle Box" picks page so the loading → ready transition feels
 * continuous. Matches RecommenderView in every meaningful structural
 * dimension:
 *   • Hero card with eyebrow, large title + species portrait, two hero tiles
 *   • Theme-note band (engine read summary)
 *   • Scenario summary card with 4 preference chips + condition tag row
 *   • DAILY PICKS section divider
 *   • LURE PICKS masthead → TopPick bone (gold ribbon + big image)
 *                         → HonorableMention bone (compact horizontal)
 *   • FLY PICKS masthead  → TopPick bone
 *                         → HonorableMention bone
 *
 * Visual-only: no data, no state. One pulse value (native driver) drives
 * every bone via React context — same pattern as HowFishingLoadingSkeleton.
 */

import React, { createContext, useContext } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import {
  paper,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  CornerMarkSet,
  TopographicLines,
} from '../paper';
import { usePaperBonePulse } from '../../lib/usePaperBonePulse';

/**
 * Tackle-box brand gold — mirrors the constants in RecommenderView so
 * the skeleton's TOP PICK ribbon reads as the same chromatic accent.
 */
const GOLD_ACCENT = '#C99B2D';
const GOLD_SOFT = '#FBF1D9';
const GOLD_INK = '#8A6A1A';

const PulseCtx = createContext<Animated.Value | null>(null);

function Bone({ style }: { style?: object }) {
  const pulse = useContext(PulseCtx);
  return <Animated.View style={[styles.bone, style, pulse ? { opacity: pulse } : null]} />;
}

// ─── Section masthead bone ─────────────────────────────────────────────

function PicksMastheadSkel() {
  return (
    <View style={styles.picksMasthead}>
      <View style={styles.picksMastheadRuleRow}>
        <View style={styles.picksMastheadCap} />
        <View style={styles.picksMastheadRule} />
        <View style={styles.picksMastheadOrnament} />
      </View>
      <View style={styles.picksMastheadInner}>
        <Bone style={styles.picksMastheadTitleBone} />
        <Bone style={styles.picksMastheadMetaBone} />
      </View>
      <View style={[styles.picksMastheadRule, { opacity: 0.45 }]} />
    </View>
  );
}

// ─── Top pick bone (mirrors TopPickCard) ───────────────────────────────

function TopPickSkel() {
  return (
    <View style={styles.topPickCard}>
      {/* Gold ribbon header */}
      <View style={styles.topPickRibbon}>
        <View style={styles.topPickRibbonDot} />
        <View style={styles.topPickRibbonStar} />
        <Bone style={styles.topPickRibbonBone} />
        <View style={styles.topPickRibbonOrnament} />
      </View>

      {/* Corner crosses on the card */}
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossTL]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossTR]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossBL]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>
      <View style={[styles.topPickCornerCross, styles.topPickCornerCrossBR]}>
        <View style={styles.topPickCornerCrossH} />
        <View style={styles.topPickCornerCrossV} />
      </View>

      <View style={styles.topPickImageBand}>
        <Bone style={styles.topPickImageBone} />
      </View>

      <View style={styles.topPickBody}>
        <View style={styles.topPickTitleRow}>
          <View style={styles.topPickTitleStack}>
            <Bone style={styles.topPickTitleBone} />
            <Bone style={styles.topPickSubtitleBone} />
          </View>
          <View style={styles.topPickSeal}>
            <Bone style={styles.topPickSealBone} />
          </View>
        </View>

        {/* Meta row — 3 cells */}
        <View style={styles.metaRow}>
          <View style={styles.metaCell}>
            <Bone style={styles.metaLabelBone} />
            <Bone style={styles.metaValueBone} />
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCell}>
            <Bone style={styles.metaLabelBone} />
            <Bone style={styles.metaValueBone} />
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCell}>
            <Bone style={styles.metaLabelBone} />
            <Bone style={styles.metaValueBone} />
          </View>
        </View>

        {/* Water column diagram — 4 bars */}
        <View style={styles.columnRow}>
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} style={styles.columnBar} />
          ))}
        </View>

        {/* WHY THIS */}
        <View style={styles.topPickReasonBlock}>
          <View style={styles.topPickReasonHead}>
            <View style={styles.topPickReasonCap} />
            <Bone style={styles.topPickReasonEyebrowBone} />
          </View>
          <Bone style={styles.topPickReasonLineBone} />
          <Bone style={[styles.topPickReasonLineBone, { width: '88%' }]} />
          <Bone style={[styles.topPickReasonLineBone, { width: '72%' }]} />
        </View>

        {/* HOW TO FISH IT */}
        <View style={styles.topPickReasonBlock}>
          <View style={styles.topPickReasonHead}>
            <View style={styles.topPickReasonCap} />
            <Bone style={styles.topPickReasonEyebrowBone} />
          </View>
          <Bone style={styles.topPickReasonLineBone} />
          <Bone style={[styles.topPickReasonLineBone, { width: '92%' }]} />
        </View>

        {/* Signoff strip */}
        <View style={styles.topPickSignoffRow}>
          <View style={styles.topPickSignoffRule} />
          <View style={styles.topPickSignoffOrnament} />
          <Bone style={styles.topPickSignoffBone} />
        </View>
      </View>
    </View>
  );
}

// ─── Honorable mention bone (mirrors HonorableMentionCard) ─────────────

function HonorableSkel() {
  return (
    <View style={styles.honorableCard}>
      <View style={styles.honorableEyebrowRow}>
        <View style={styles.honorableEyebrowDot} />
        <Bone style={styles.honorableEyebrowBone} />
      </View>

      <View style={styles.honorableBody}>
        <View style={styles.honorableImageWrap}>
          <Bone style={styles.honorableImage} />
        </View>
        <View style={styles.honorableContent}>
          <Bone style={styles.honorableTitleBone} />
          <Bone style={styles.honorableSubtitleBone} />
          <View style={styles.honorableMetaRow}>
            <View style={styles.honorableMetaCell}>
              <Bone style={styles.honorableMetaLabelBone} />
              <Bone style={styles.honorableMetaValueBone} />
            </View>
            <View style={styles.honorableMetaCell}>
              <Bone style={styles.honorableMetaLabelBone} />
              <Bone style={styles.honorableMetaValueBone} />
            </View>
            <View style={styles.honorableMetaCell}>
              <Bone style={styles.honorableMetaLabelBone} />
              <Bone style={styles.honorableMetaValueBone} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.honorableRule} />

      <View style={styles.honorableReasonStack}>
        <Bone style={styles.honorableReasonEyebrowBone} />
        <Bone style={styles.honorableReasonLineBone} />
        <Bone style={[styles.honorableReasonLineBone, { width: '78%' }]} />
        <Bone
          style={[styles.honorableReasonEyebrowBone, { marginTop: paperSpacing.sm }]}
        />
        <Bone style={styles.honorableReasonLineBone} />
        <Bone style={[styles.honorableReasonLineBone, { width: '82%' }]} />
      </View>
    </View>
  );
}

// ─── Main skeleton ─────────────────────────────────────────────────────

export function RecommenderLoadingSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.32, to: 0.72, duration: 1700 });
  return (
    <PulseCtx.Provider value={pulse}>
      <View style={styles.root}>
        {/* ── HERO ────────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <TopographicLines
            style={styles.heroTopo}
            color={paper.dashboardBlue}
            count={7}
          />
          <CornerMarkSet color={paper.dashboardBlue} size={16} thickness={2} inset={10} />

          <View style={styles.heroHeader}>
            <Bone style={styles.heroEyebrowBone} />
          </View>

          <View style={styles.heroTitleRow}>
            <View style={styles.heroTitleCol}>
              <Bone style={styles.heroTitleBone} />
              <Bone style={[styles.heroTitleBone, styles.heroTitleBoneAccent]} />
              <Bone style={styles.heroLedeBone} />
              <Bone style={[styles.heroLedeBone, { width: '60%' }]} />
            </View>

            <View style={styles.heroPortraitWrap}>
              <View style={styles.heroPortrait}>
                <Bone style={styles.heroPortraitBone} />
              </View>
              <View style={styles.heroPortraitPill}>
                <Bone style={styles.heroPortraitPillBone} />
              </View>
            </View>
          </View>

          <View style={styles.heroTileRow}>
            <View style={styles.heroTile}>
              <Bone style={styles.heroTileLabelBone} />
              <Bone style={styles.heroTileValueBone} />
              <Bone style={styles.heroTileSubBone} />
            </View>
            <View style={styles.heroTile}>
              <Bone style={styles.heroTileLabelBone} />
              <Bone style={styles.heroTileValueBone} />
              <Bone style={styles.heroTileSubBone} />
            </View>
          </View>
        </View>

        {/* ── THEME NOTE BAND ─────────────────────────────────────── */}
        <View style={styles.themeNote}>
          <Bone style={styles.themeEyebrowBone} />
          <Bone style={styles.themeLineBone} />
          <Bone style={[styles.themeLineBone, { width: '72%' }]} />
        </View>

        {/* ── SCENARIO SUMMARY CARD ───────────────────────────────── */}
        <View style={styles.preferenceCard}>
          <Bone style={styles.preferenceHeaderBone} />
          <View style={styles.preferenceChipRow}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.preferenceChip}>
                <Bone style={styles.preferenceChipLabelBone} />
                <Bone style={styles.preferenceChipValueBone} />
              </View>
            ))}
          </View>
          <View style={styles.tagRow}>
            {[60, 80, 50, 70].map((w, i) => (
              <Bone key={i} style={[styles.tagPillBone, { width: w }]} />
            ))}
          </View>
        </View>

        {/* ── Color palette strip ─────────────────────────────────── */}
        <View style={styles.paletteSkelCard}>
          <View style={styles.paletteSkelRow}>
            <Bone style={styles.paletteSkelPlate} />
            <View style={styles.paletteSkelText}>
              <Bone style={styles.paletteSkelEyebrow} />
              <Bone style={styles.paletteSkelTitle} />
              <Bone style={[styles.paletteSkelLine, { width: '100%' }]} />
              <Bone style={[styles.paletteSkelLine, { width: '82%' }]} />
            </View>
          </View>
        </View>

        {/* ── DAILY PICKS section divider ─────────────────────────── */}
        <View style={styles.sectionDivider}>
          <View style={styles.sectionTitleRow}>
            <Bone style={styles.sectionTitleBone} />
            <Bone style={styles.sectionCountBone} />
          </View>
          <Bone style={styles.sectionMonoBone} />
        </View>

        {/* ── LURE PICKS section ──────────────────────────────────── */}
        <View style={styles.gearSection}>
          <PicksMastheadSkel />
          <TopPickSkel />
          <HonorableSkel />
        </View>

        {/* ── FLY PICKS section ───────────────────────────────────── */}
        <View style={styles.gearSection}>
          <PicksMastheadSkel />
          <TopPickSkel />
          <HonorableSkel />
        </View>
      </View>
    </PulseCtx.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xl * 2,
    gap: paperSpacing.md,
  },
  bone: {
    backgroundColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    opacity: 0.6,
  },

  // ── Hero ─────────────────────────────────────────────────────────────
  hero: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    overflow: 'hidden',
    ...paperShadows.lift,
  },
  heroTopo: {
    position: 'absolute',
    top: -16,
    right: -24,
    opacity: 0.2,
  },
  heroHeader: {
    marginBottom: paperSpacing.md,
  },
  heroEyebrowBone: {
    height: 11,
    width: 160,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.32,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.md,
  },
  heroTitleCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  heroTitleBone: {
    height: 42,
    width: '70%',
    borderRadius: 4,
  },
  heroTitleBoneAccent: {
    width: '55%',
    backgroundColor: paper.dashboardBlue,
    opacity: 0.2,
  },
  heroLedeBone: {
    marginTop: paperSpacing.sm,
    height: 11,
    width: '90%',
    opacity: 0.45,
  },
  heroPortraitWrap: {
    width: 112,
    alignItems: 'center',
  },
  heroPortrait: {
    width: 104,
    height: 104,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
  },
  heroPortraitBone: {
    width: '100%',
    height: '100%',
    opacity: 0.45,
    borderRadius: 0,
  },
  heroPortraitPill: {
    marginTop: -10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroPortraitPillBone: {
    height: 8,
    width: 70,
  },
  heroTileRow: {
    marginTop: paperSpacing.md,
    flexDirection: 'row',
    gap: paperSpacing.sm,
  },
  heroTile: {
    flex: 1,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardWhite,
    padding: paperSpacing.sm,
    gap: 5,
  },
  heroTileLabelBone: {
    height: 8,
    width: '40%',
    backgroundColor: paper.dashboardBlue,
    opacity: 0.35,
  },
  heroTileValueBone: {
    height: 14,
    width: '78%',
  },
  heroTileSubBone: {
    height: 8,
    width: '50%',
    opacity: 0.4,
  },

  // ── Theme note band ──────────────────────────────────────────────────
  themeNote: {
    flexDirection: 'column',
    gap: 6,
    borderLeftWidth: 4,
    borderLeftColor: paper.dashboardBlue,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    padding: paperSpacing.md,
  },
  themeEyebrowBone: {
    height: 9,
    width: 60,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.35,
  },
  themeLineBone: {
    height: 12,
    width: '92%',
  },

  // ── Scenario summary card ────────────────────────────────────────────
  preferenceCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  preferenceHeaderBone: {
    height: 10,
    width: 110,
    marginBottom: paperSpacing.sm,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.35,
  },
  preferenceChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.sm,
  },
  preferenceChip: {
    flexGrow: 1,
    flexBasis: '42%',
    minWidth: 128,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
    gap: 4,
  },
  preferenceChipLabelBone: {
    height: 8,
    width: '50%',
    backgroundColor: paper.dashboardBlue,
    opacity: 0.3,
  },
  preferenceChipValueBone: {
    height: 14,
    width: '75%',
  },

  // ── Color palette strip skeleton ─────────────────────────────────
  paletteSkelCard: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardWhite,
    padding: paperSpacing.md,
    ...paperShadows.lift,
  },
  paletteSkelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
  },
  paletteSkelPlate: {
    width: 84,
    height: 84,
    borderRadius: paperRadius.chip,
  },
  paletteSkelText: {
    flex: 1,
    gap: 8,
  },
  paletteSkelEyebrow: {
    height: 9,
    width: '55%',
    opacity: 0.45,
  },
  paletteSkelTitle: {
    height: 22,
    width: '72%',
  },
  paletteSkelLine: {
    height: 11,
  },

  tagRow: {
    marginTop: paperSpacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  tagPillBone: {
    height: 18,
    borderRadius: 999,
    backgroundColor: paper.dashboardLine,
    opacity: 0.55,
  },

  // ── DAILY PICKS section divider ─────────────────────────────────────
  sectionDivider: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: paper.dashboardLine,
    paddingVertical: paperSpacing.sm,
    gap: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  sectionTitleBone: {
    height: 26,
    width: 130,
  },
  sectionCountBone: {
    height: 11,
    width: 80,
    opacity: 0.5,
  },
  sectionMonoBone: {
    height: 9,
    width: 180,
    opacity: 0.4,
    marginTop: 2,
  },

  // ── Gear section + picks masthead ────────────────────────────────────
  gearSection: {
    gap: paperSpacing.md + 2,
    marginTop: paperSpacing.lg,
  },
  picksMasthead: {
    width: '100%',
    gap: 4,
    marginBottom: paperSpacing.xs,
  },
  picksMastheadRuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
  picksMastheadCap: {
    width: 5,
    height: 5,
    borderRadius: 1,
    backgroundColor: paper.dashboardInk,
    opacity: 0.55,
  },
  picksMastheadOrnament: {
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
    backgroundColor: paper.dashboardInk,
    opacity: 0.4,
  },
  picksMastheadRule: {
    height: 1.6,
    flex: 1,
    backgroundColor: paper.dashboardInk,
    opacity: 0.55,
  },
  picksMastheadInner: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  picksMastheadTitleBone: {
    height: 14,
    width: 100,
  },
  picksMastheadMetaBone: {
    height: 11,
    width: 140,
    opacity: 0.45,
  },

  // ── TOP PICK CARD bone ──────────────────────────────────────────────
  topPickCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    position: 'relative',
    ...paperShadows.lift,
  },
  topPickRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: 9,
    backgroundColor: GOLD_SOFT,
    borderBottomWidth: 1,
    borderBottomColor: GOLD_ACCENT,
  },
  topPickRibbonDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: GOLD_ACCENT,
  },
  topPickRibbonStar: {
    width: 11,
    height: 11,
    borderRadius: 2,
    backgroundColor: GOLD_INK,
    opacity: 0.65,
  },
  topPickRibbonBone: {
    flex: 1,
    height: 11,
    backgroundColor: GOLD_INK,
    opacity: 0.4,
  },
  topPickRibbonOrnament: {
    width: 7,
    height: 7,
    transform: [{ rotate: '45deg' }],
    backgroundColor: GOLD_ACCENT,
    opacity: 0.55,
  },

  topPickCornerCross: {
    position: 'absolute',
    width: 10,
    height: 10,
    zIndex: 3,
  },
  topPickCornerCrossTL: { top: 46, left: 8 },
  topPickCornerCrossTR: { top: 46, right: 8 },
  topPickCornerCrossBL: { bottom: 8, left: 8 },
  topPickCornerCrossBR: { bottom: 8, right: 8 },
  topPickCornerCrossH: {
    position: 'absolute',
    top: 4.5,
    left: 0,
    width: 10,
    height: 1,
    backgroundColor: 'rgba(28, 36, 25, 0.32)',
  },
  topPickCornerCrossV: {
    position: 'absolute',
    left: 4.5,
    top: 0,
    width: 1,
    height: 10,
    backgroundColor: 'rgba(28, 36, 25, 0.32)',
  },

  topPickImageBand: {
    minHeight: 200,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: paperSpacing.md,
  },
  topPickImageBone: {
    width: '85%',
    height: 168,
    borderRadius: paperRadius.chip,
    opacity: 0.4,
  },

  topPickBody: {
    padding: paperSpacing.md + 2,
    gap: paperSpacing.sm + 2,
  },
  topPickTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
  },
  topPickTitleStack: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  topPickTitleBone: {
    height: 28,
    width: '85%',
    borderRadius: 4,
  },
  topPickSubtitleBone: {
    height: 10,
    width: '60%',
    opacity: 0.45,
  },
  topPickSeal: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: paperRadius.chip,
    backgroundColor: GOLD_SOFT,
    borderWidth: 1,
    borderColor: GOLD_ACCENT,
  },
  topPickSealBone: {
    height: 10,
    width: 74,
    backgroundColor: GOLD_INK,
    opacity: 0.45,
  },

  metaRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: paper.dashboardLine,
    paddingVertical: paperSpacing.xs + 2,
    backgroundColor: paper.dashboardWhite,
  },
  metaCell: {
    flex: 1,
    gap: 4,
    paddingHorizontal: paperSpacing.sm,
  },
  metaDivider: {
    width: 2,
    alignSelf: 'stretch',
    backgroundColor: paper.dashboardInk,
    opacity: 0.5,
  },
  metaLabelBone: {
    height: 8,
    width: 44,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.3,
  },
  metaValueBone: {
    height: 12,
    width: 64,
  },

  columnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: paperSpacing.xs,
  },
  columnBar: {
    flex: 1,
    height: 22,
    borderRadius: 2,
    backgroundColor: paper.dashboardHair,
  },

  topPickReasonBlock: {
    gap: 4,
  },
  topPickReasonHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topPickReasonCap: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: GOLD_ACCENT,
  },
  topPickReasonEyebrowBone: {
    height: 10,
    width: 70,
    backgroundColor: GOLD_INK,
    opacity: 0.4,
  },
  topPickReasonLineBone: {
    height: 12,
    width: '100%',
    marginTop: 2,
    opacity: 0.5,
  },

  topPickSignoffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: paperSpacing.sm,
    paddingTop: paperSpacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
  },
  topPickSignoffRule: {
    height: StyleSheet.hairlineWidth,
    flex: 1,
    maxWidth: 32,
    backgroundColor: GOLD_ACCENT,
    opacity: 0.45,
  },
  topPickSignoffOrnament: {
    width: 5,
    height: 5,
    transform: [{ rotate: '45deg' }],
    backgroundColor: GOLD_ACCENT,
    opacity: 0.45,
  },
  topPickSignoffBone: {
    height: 9,
    width: 130,
    backgroundColor: GOLD_INK,
    opacity: 0.35,
  },

  // ── HONORABLE MENTION CARD bone ─────────────────────────────────────
  honorableCard: {
    backgroundColor: '#FAFAF7',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.sm + 2,
    paddingBottom: paperSpacing.md,
    overflow: 'hidden',
  },
  honorableEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: paperSpacing.sm,
  },
  honorableEyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardMuted,
    opacity: 0.55,
  },
  honorableEyebrowBone: {
    height: 10,
    width: 200,
    opacity: 0.5,
  },
  honorableBody: {
    flexDirection: 'row',
    gap: paperSpacing.md,
    alignItems: 'flex-start',
  },
  honorableImageWrap: {
    width: 96,
    height: 96,
    borderRadius: paperRadius.chip,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    padding: 6,
    flexShrink: 0,
    overflow: 'hidden',
  },
  honorableImage: {
    width: '100%',
    height: '100%',
    opacity: 0.45,
    borderRadius: 0,
  },
  honorableContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  honorableTitleBone: {
    height: 20,
    width: '85%',
    borderRadius: 3,
  },
  honorableSubtitleBone: {
    height: 9,
    width: '60%',
    opacity: 0.4,
    marginBottom: 6,
  },
  honorableMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  honorableMetaCell: {
    minWidth: 0,
    gap: 3,
  },
  honorableMetaLabelBone: {
    height: 7,
    width: 36,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.3,
  },
  honorableMetaValueBone: {
    height: 11,
    width: 52,
  },
  honorableRule: {
    marginTop: paperSpacing.sm + 2,
    marginBottom: paperSpacing.sm,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardHair,
  },
  honorableReasonStack: {
    gap: 4,
  },
  honorableReasonEyebrowBone: {
    height: 9,
    width: 64,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.3,
  },
  honorableReasonLineBone: {
    height: 11,
    width: '100%',
    opacity: 0.5,
  },
});
