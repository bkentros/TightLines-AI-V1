/**
 * HowFishingLoadingSkeleton
 *
 * Paper-language placeholder that mirrors the shape of the final
 * How's Fishing report (`RebuildReportView`) so the transition feels
 * continuous while the engine pulls conditions + builds the bundle:
 *   • Hero card (eyebrow / HOW'S FISHING headline / linear score gauge /
 *     outlook line / summary / air-range strip)
 *   • WHAT'S HELPING card (forest header + factor rows)
 *   • WATCH OUT FOR card (red header + factor rows)
 *   • WHEN TO GO section (4 time-window tiles + daypart note)
 *   • Ornamental divider
 *   • GUIDE'S NOTE card
 *
 * Visual-only; no data or state is touched here.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  paper,
  paperBorders,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  CornerMarkSet,
  SectionEyebrow,
  TopographicLines,
} from '../paper';

function Bone({ style }: { style?: object }) {
  return <View style={[styles.bone, style]} />;
}

function FactorRowSkeleton({ tint, isLast }: { tint: string; isLast?: boolean }) {
  return (
    <View style={[styles.factorRow, !isLast && styles.factorRowDivider]}>
      <View style={[styles.factorSign, { backgroundColor: tint }]} />
      <Bone style={styles.factorLabelBone} />
    </View>
  );
}

function TimeWindowSkeleton({ highlighted }: { highlighted?: boolean }) {
  return (
    <View
      style={[
        styles.timeTile,
        highlighted && { borderColor: paper.forest, borderWidth: 2 },
      ]}
    >
      <View style={styles.timeTileTop}>
        <View
          style={[
            styles.timeTileIcon,
            highlighted && { backgroundColor: paper.forest, opacity: 0.25 },
          ]}
        />
      </View>
      <View style={styles.timeTileBody}>
        <Bone style={styles.timeTileLabelBone} />
        <Bone style={styles.timeTileRangeBone} />
      </View>
      {highlighted && (
        <View style={styles.bestBadge}>
          <Bone style={styles.bestBadgeBone} />
        </View>
      )}
    </View>
  );
}

export function HowFishingLoadingSkeleton() {
  return (
    <View style={styles.root}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <View style={styles.heroCard}>
        <CornerMarkSet color={paper.red} />

        <View style={styles.heroEyebrow}>
          <SectionEyebrow color={paper.red} size={9} tracking={3}>
            BUILDING REPORT
          </SectionEyebrow>
        </View>

        <View style={styles.heroHeadlineWrap}>
          <Bone style={styles.heroHeadlineBone} />
          <Bone style={[styles.heroHeadlineBone, styles.heroHeadlineBoneAccent]} />
        </View>

        {/* Linear score gauge — score number + track + scale + band pill. */}
        <View style={styles.gaugeWrap}>
          <View style={styles.gaugeScoreRow}>
            <Bone style={styles.gaugeScoreBone} />
            <Bone style={styles.gaugeScoreMaxBone} />
          </View>
          <View style={styles.gaugeTrackRow}>
            <View style={styles.gaugeTrack}>
              <View style={[styles.gaugeStop, { backgroundColor: paper.red, opacity: 0.45 }]} />
              <View style={[styles.gaugeStop, { backgroundColor: paper.gold, opacity: 0.45 }]} />
              <View style={[styles.gaugeStop, { backgroundColor: paper.forest, opacity: 0.45 }]} />
            </View>
          </View>
          <View style={styles.gaugeScaleRow}>
            <Bone style={styles.gaugeScaleBone} />
            <Bone style={styles.gaugeScaleBone} />
            <Bone style={styles.gaugeScaleBone} />
          </View>
          <View style={styles.gaugeBandPill}>
            <Bone style={styles.gaugeBandPillBone} />
          </View>
        </View>

        <View style={styles.outlookRule} />

        <SectionEyebrow color={paper.red} size={9} tracking={3}>
          {"TODAY'S OUTLOOK"}
        </SectionEyebrow>
        <Bone style={styles.heroSublineBone} />
        <Bone style={styles.heroSummaryBone} />
        <Bone style={[styles.heroSummaryBone, { width: '78%' }]} />

        <View style={styles.airRow}>
          <Bone style={styles.airLabelBone} />
          <Bone style={styles.airRangeBone} />
        </View>
      </View>

      {/* ── WHAT'S HELPING ─────────────────────────────────────────────── */}
      <View style={styles.factorCard}>
        <View style={[styles.factorHeader, { backgroundColor: paper.forest }]}>
          <View style={styles.factorHeaderIcon} />
          <Bone style={styles.factorHeaderLabelBone} />
        </View>
        <View style={styles.factorBody}>
          <FactorRowSkeleton tint={paper.forest} />
          <FactorRowSkeleton tint={paper.forest} />
          <FactorRowSkeleton tint={paper.forest} isLast />
        </View>
      </View>

      {/* ── WATCH OUT FOR ──────────────────────────────────────────────── */}
      <View style={styles.factorCard}>
        <View style={[styles.factorHeader, { backgroundColor: paper.red }]}>
          <View style={styles.factorHeaderIcon} />
          <Bone style={styles.factorHeaderLabelBone} />
        </View>
        <View style={styles.factorBody}>
          <FactorRowSkeleton tint={paper.red} />
          <FactorRowSkeleton tint={paper.red} isLast />
        </View>
      </View>

      {/* ── WHEN TO GO ────────────────────────────────────────────────── */}
      <View style={styles.timingSection}>
        <View style={styles.timingHeader}>
          <Bone style={styles.timingEyebrowBone} />
          <Bone style={styles.timingMetaBone} />
        </View>
        <View style={styles.timingRow}>
          <TimeWindowSkeleton />
          <TimeWindowSkeleton highlighted />
          <TimeWindowSkeleton />
          <TimeWindowSkeleton />
        </View>
        <Bone style={styles.daypartBone} />
        <Bone style={[styles.daypartBone, { width: '82%' }]} />
      </View>

      {/* ── Ornamental divider ─────────────────────────────────────────── */}
      <View style={styles.ornamentRow}>
        <View style={[styles.ornamentRule, { borderBottomColor: paper.ink }]} />
        <View style={[styles.ornamentGlyph, { borderColor: paper.ink }]} />
        <View style={[styles.ornamentRule, { borderBottomColor: paper.ink }]} />
      </View>

      {/* ── GUIDE'S NOTE ───────────────────────────────────────────────── */}
      <View style={styles.guideCard}>
        <TopographicLines
          style={styles.guideLines}
          color={paper.walnut}
          count={5}
        />
        <CornerMarkSet color={paper.walnut} />
        <View style={styles.guideRow}>
          <View style={styles.guideBadge} />
          <View style={styles.guideBody}>
            <SectionEyebrow color={paper.red} size={10} tracking={3.5}>
              GUIDE'S NOTE
            </SectionEyebrow>
            <Bone style={styles.guideQuoteMarkBone} />
            <Bone style={styles.guideTextBone} />
            <Bone style={[styles.guideTextBone, { width: '94%' }]} />
            <Bone style={[styles.guideTextBone, { width: '68%' }]} />
          </View>
        </View>
      </View>

      {/* ── Colophon ───────────────────────────────────────────────────── */}
      <View style={styles.colophonRow}>
        <View style={styles.colophonRule} />
        <Bone style={styles.colophonBone} />
        <View style={styles.colophonRule} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: paperSpacing.md + 2,
  },
  bone: {
    backgroundColor: paper.inkHair,
    borderRadius: paperRadius.chip,
    opacity: 0.6,
  },

  // ── HERO ──────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md,
    overflow: 'hidden',
    alignItems: 'center',
  },
  heroEyebrow: {
    marginBottom: 4,
    alignItems: 'center',
  },
  heroHeadlineWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  heroHeadlineBone: {
    height: 22,
    width: '60%',
    borderRadius: 4,
  },
  heroHeadlineBoneAccent: {
    width: '45%',
    backgroundColor: paper.forest,
    opacity: 0.22,
  },

  // Gauge
  gaugeWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: paperSpacing.sm + 2,
    marginBottom: paperSpacing.xs + 2,
  },
  gaugeScoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 10,
  },
  gaugeScoreBone: {
    height: 40,
    width: 72,
    borderRadius: 6,
    backgroundColor: paper.forest,
    opacity: 0.25,
  },
  gaugeScoreMaxBone: {
    height: 16,
    width: 32,
    marginBottom: 6,
    opacity: 0.35,
  },
  gaugeTrackRow: {
    width: '92%',
    marginBottom: 6,
  },
  gaugeTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: paper.ink,
    overflow: 'hidden',
  },
  gaugeStop: {
    flex: 1,
  },
  gaugeScaleRow: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  gaugeScaleBone: {
    height: 9,
    width: 14,
  },
  gaugeBandPill: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: paper.forest,
    opacity: 0.35,
  },
  gaugeBandPillBone: {
    height: 10,
    width: 68,
    backgroundColor: paper.paper,
    opacity: 0.6,
  },

  outlookRule: {
    width: '80%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.ink,
    opacity: 0.35,
    marginVertical: paperSpacing.sm + 2,
  },
  heroSublineBone: {
    height: 14,
    width: '65%',
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: paper.forest,
    opacity: 0.28,
    borderRadius: 4,
  },
  heroSummaryBone: {
    height: 12,
    width: '88%',
    marginVertical: 3,
    opacity: 0.5,
  },
  airRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: paperSpacing.sm + 2,
  },
  airLabelBone: {
    height: 9,
    width: 28,
    backgroundColor: paper.red,
    opacity: 0.3,
  },
  airRangeBone: {
    height: 11,
    width: 96,
  },

  // ── Factor cards ──────────────────────────────────────────────────────
  factorCard: {
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    overflow: 'hidden',
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md + 2,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  factorHeaderIcon: {
    width: 15,
    height: 15,
    borderRadius: 2,
    backgroundColor: paper.paper,
    opacity: 0.5,
  },
  factorHeaderLabelBone: {
    height: 11,
    width: 118,
    backgroundColor: paper.paper,
    opacity: 0.7,
  },
  factorBody: {
    paddingHorizontal: paperSpacing.md + 4,
    paddingTop: 4,
    paddingBottom: paperSpacing.sm + 2,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
  },
  factorRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: paper.ink,
    borderStyle: 'solid',
  },
  factorSign: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paper.ink,
    opacity: 0.4,
    flexShrink: 0,
  },
  factorLabelBone: {
    flex: 1,
    height: 14,
    opacity: 0.55,
  },

  // ── Timing section ────────────────────────────────────────────────────
  timingSection: {
    marginTop: paperSpacing.xs,
  },
  timingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: paperSpacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
    marginBottom: paperSpacing.sm + 2,
  },
  timingEyebrowBone: {
    height: 12,
    width: 90,
  },
  timingMetaBone: {
    height: 10,
    width: 110,
    opacity: 0.45,
  },
  timingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeTile: {
    flex: 1,
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    overflow: 'hidden',
    minHeight: 104,
    position: 'relative',
  },
  timeTileTop: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  timeTileIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: paper.inkHair,
    opacity: 0.65,
  },
  timeTileBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.ink,
    alignItems: 'center',
    gap: 4,
  },
  timeTileLabelBone: {
    height: 13,
    width: '65%',
  },
  timeTileRangeBone: {
    height: 9,
    width: '55%',
    opacity: 0.45,
  },
  bestBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: paper.forest,
    paddingHorizontal: 6,
    paddingVertical: 3,
    opacity: 0.9,
  },
  bestBadgeBone: {
    height: 7,
    width: 28,
    backgroundColor: paper.paper,
    opacity: 0.9,
  },
  daypartBone: {
    height: 11,
    width: '100%',
    marginTop: paperSpacing.sm + 2,
    opacity: 0.5,
  },

  // ── Ornamental divider ───────────────────────────────────────────────
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: paperSpacing.md,
    gap: paperSpacing.sm,
  },
  ornamentRule: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.45,
  },
  ornamentGlyph: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    opacity: 0.5,
  },

  // ── Guide's note ─────────────────────────────────────────────────────
  guideCard: {
    position: 'relative',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    paddingHorizontal: paperSpacing.lg,
    paddingVertical: paperSpacing.lg,
    overflow: 'hidden',
  },
  guideLines: {
    left: undefined,
    right: -30,
    top: -20,
    width: 260,
    height: 260,
    opacity: 0.35,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md + 4,
  },
  guideBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: paper.walnut,
    backgroundColor: paper.paper,
    opacity: 0.55,
    flexShrink: 0,
  },
  guideBody: { flex: 1, gap: 6 },
  guideQuoteMarkBone: {
    height: 28,
    width: 22,
    backgroundColor: paper.walnut,
    opacity: 0.3,
    marginTop: 4,
    marginBottom: 2,
    borderRadius: 4,
  },
  guideTextBone: {
    height: 13,
    width: '100%',
    opacity: 0.5,
    marginVertical: 2,
  },

  // ── Colophon ─────────────────────────────────────────────────────────
  colophonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.lg,
    marginBottom: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
  },
  colophonRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.ink,
    opacity: 0.3,
  },
  colophonBone: {
    height: 9,
    width: 160,
    opacity: 0.45,
  },
});
