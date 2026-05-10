import React, { createContext, useContext } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { paper, paperSpacing } from '../../lib/theme';
import { TopographicLines } from '../paper';
import { usePaperBonePulse } from '../../lib/usePaperBonePulse';

/**
 * One pulse value drives every bone in the skeleton — both for perf
 * (one Animated.Value, one looping animation, native driver) and so
 * every placeholder breathes in perfect sync. The pulse is created at
 * the root and shared via React context to the `<Bone />` factory.
 *
 * Range 0.32 → 0.72 matches the prior static opacities the bones used
 * (~0.5) so the skeleton still reads as substantial, just alive.
 */
const PulseCtx = createContext<Animated.Value | null>(null);

function Bone({ style }: { style?: object }) {
  const pulse = useContext(PulseCtx);
  return <Animated.View style={[styles.bone, style, pulse ? { opacity: pulse } : null]} />;
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
        highlighted && { borderColor: paper.bandPrime, borderWidth: 2 },
      ]}
    >
      <View style={styles.timeTileTop}>
        <View
          style={[
            styles.timeTileIcon,
            highlighted && { backgroundColor: paper.bandPrime, opacity: 0.25 },
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
  const pulse = usePaperBonePulse({ from: 0.32, to: 0.72, duration: 1700 });
  return (
    <PulseCtx.Provider value={pulse}>
    <View style={styles.root}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <View style={styles.heroCard}>
        <View style={styles.heroEyebrow}>
          <Bone style={styles.heroEyebrowBone} />
        </View>

        <View style={styles.heroHeadlineWrap}>
          <Bone style={styles.heroHeadlineBone} />
          <Bone style={[styles.heroHeadlineBone, styles.heroHeadlineBoneAccent]} />
        </View>

        <View style={styles.gaugeWrap}>
          <View style={styles.gaugePanel}>
            <View style={styles.gaugePanelHeader}>
              <Bone style={styles.gaugePanelLabelBone} />
              <View style={styles.gaugeBandPill}>
                <Bone style={styles.gaugeBandPillBone} />
              </View>
            </View>
            <View style={styles.gaugeScoreRow}>
              <Bone style={styles.gaugeScoreHalo} />
              <Bone style={styles.gaugeScoreBone} />
              <Bone style={styles.gaugeScoreMaxBone} />
            </View>
            <View style={styles.gaugeTrackRow}>
              <View style={styles.gaugeTrack}>
                <View style={[styles.gaugeStop, { flex: 3.5, backgroundColor: paper.bandTough, opacity: 0.45 }]} />
                <View style={[styles.gaugeStop, { flex: 1.5, backgroundColor: paper.bandPoor, opacity: 0.45 }]} />
                <View style={[styles.gaugeStop, { flex: 1.5, backgroundColor: paper.bandFair, opacity: 0.45 }]} />
                <View style={[styles.gaugeStop, { flex: 1.5, backgroundColor: paper.bandGood, opacity: 0.45 }]} />
                <View style={[styles.gaugeStop, { flex: 2, backgroundColor: paper.bandPrime, opacity: 0.45 }]} />
              </View>
            </View>
            <View style={styles.gaugeScaleRow}>
              <Bone style={styles.gaugeScaleBone} />
              <Bone style={styles.gaugeScaleBone} />
              <Bone style={styles.gaugeScaleBone} />
            </View>
          </View>
        </View>

        <View style={styles.outlookRule} />

        <Bone style={styles.outlookEyebrowBone} />
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
        <View style={[styles.factorHeader, { backgroundColor: paper.bandPrime }]}>
          <View style={styles.factorHeaderIcon} />
          <Bone style={styles.factorHeaderLabelBone} />
        </View>
        <View style={styles.factorBody}>
          <FactorRowSkeleton tint={paper.bandPrime} />
          <FactorRowSkeleton tint={paper.bandPrime} />
          <FactorRowSkeleton tint={paper.bandPrime} isLast />
        </View>
      </View>

      {/* ── WATCH OUT FOR ──────────────────────────────────────────────── */}
      <View style={styles.factorCard}>
        <View style={[styles.factorHeader, { backgroundColor: '#F8E7E2' }]}>
          <View style={styles.factorHeaderIcon} />
          <Bone style={styles.factorHeaderLabelBone} />
        </View>
        <View style={styles.factorBody}>
          <FactorRowSkeleton tint={paper.bandTough} />
          <FactorRowSkeleton tint={paper.bandTough} isLast />
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

      <View style={styles.guideCard}>
        <TopographicLines
          style={styles.guideLines}
          color={paper.dashboardBlue}
          count={5}
        />
        <View style={styles.guideRow}>
          <View style={styles.guideBadge} />
          <View style={styles.guideBody}>
            <Bone style={styles.guideEyebrowBone} />
            <Bone style={styles.guideTextBone} />
            <Bone style={[styles.guideTextBone, { width: '94%' }]} />
            <Bone style={[styles.guideTextBone, { width: '68%' }]} />
          </View>
        </View>
      </View>

      <View style={styles.footerRule} />
    </View>
    </PulseCtx.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: paperSpacing.md + 2,
  },
  bone: {
    backgroundColor: paper.dashboardHair,
    borderRadius: 999,
    opacity: 0.6,
  },

  // ── HERO ──────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
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
  heroEyebrowBone: {
    width: 128,
    height: 10,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.32,
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
    backgroundColor: paper.dashboardBlue,
    opacity: 0.22,
  },

  // Gauge
  gaugeWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.xs,
  },
  gaugePanel: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: '#F7FAFB',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  gaugePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 2,
  },
  gaugePanelLabelBone: {
    height: 9,
    width: 112,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.3,
  },
  gaugeScoreRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 4,
    position: 'relative',
  },
  gaugeScoreHalo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.1,
  },
  gaugeScoreBone: {
    height: 38,
    width: 74,
    borderRadius: 6,
    backgroundColor: paper.dashboardInk,
    opacity: 0.22,
  },
  gaugeScoreMaxBone: {
    height: 16,
    width: 32,
    marginBottom: 6,
    opacity: 0.35,
  },
  gaugeTrackRow: {
    width: '100%',
    height: 22,
    justifyContent: 'center',
  },
  gaugeTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: 'hidden',
  },
  gaugeStop: {},
  gaugeScaleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  gaugeScaleBone: {
    height: 9,
    width: 14,
  },
  gaugeBandPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: paper.dashboardInk,
    opacity: 0.35,
  },
  gaugeBandPillBone: {
    height: 9,
    width: 54,
    backgroundColor: paper.dashboardWhite,
    opacity: 0.6,
  },

  outlookRule: {
    width: '80%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
    opacity: 0.35,
    marginVertical: paperSpacing.sm + 2,
  },
  outlookEyebrowBone: {
    height: 10,
    width: 104,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.28,
  },
  heroSublineBone: {
    height: 14,
    width: '65%',
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: paper.dashboardBlue,
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
    backgroundColor: paper.dashboardBlue,
    opacity: 0.3,
  },
  airRangeBone: {
    height: 11,
    width: 96,
  },

  // ── Factor cards ──────────────────────────────────────────────────────
  factorCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: 'hidden',
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md + 2,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.dashboardLine,
  },
  factorHeaderIcon: {
    width: 15,
    height: 15,
    borderRadius: 2,
    backgroundColor: paper.dashboardWhite,
    opacity: 0.5,
  },
  factorHeaderLabelBone: {
    height: 11,
    width: 118,
    backgroundColor: paper.dashboardWhite,
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
    borderBottomColor: paper.dashboardHair,
    borderStyle: 'solid',
  },
  factorSign: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
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
    borderBottomColor: paper.dashboardLine,
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
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
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
    backgroundColor: paper.dashboardHair,
    opacity: 0.65,
  },
  timeTileBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
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
    backgroundColor: paper.dashboardInk,
    paddingHorizontal: 6,
    paddingVertical: 3,
    opacity: 0.9,
  },
  bestBadgeBone: {
    height: 7,
    width: 28,
    backgroundColor: paper.dashboardWhite,
    opacity: 0.9,
  },
  daypartBone: {
    height: 11,
    width: '100%',
    marginTop: paperSpacing.sm + 2,
    opacity: 0.5,
  },

  guideCard: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
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
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    opacity: 0.55,
    flexShrink: 0,
  },
  guideBody: { flex: 1, gap: 6 },
  guideEyebrowBone: {
    height: 10,
    width: 112,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.32,
  },
  guideTextBone: {
    height: 13,
    width: '100%',
    opacity: 0.5,
    marginVertical: 2,
  },

  footerRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
    opacity: 0.3,
    marginBottom: paperSpacing.sm,
  },
});
