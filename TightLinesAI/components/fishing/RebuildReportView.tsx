/**
 * How's Fishing — Immersive visual report.
 * Lush Forest palette · Bricolage Grotesque headings · Inter body
 * Each section: scored gauge, timing tiles, numbered reasons, tip card.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import type { HowsFishingReportV1 } from '../../lib/howFishing';
import type { DaypartNotePreset } from '../../lib/howFishingRebuildContracts';

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreOutOf10(score: number): number {
  return Math.round(score / 10);
}

function displayScore(score: number): string {
  const v = Math.round(score) / 10;
  return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
}

/** Per-segment color: deep gradient red → amber → forest green */
function segmentColor(idx: number): string {
  if (idx <= 2) return '#C0504A';
  if (idx <= 4) return '#D4842A';
  if (idx <= 6) return '#C29B2A';
  if (idx <= 8) return '#5EA86A';
  return '#2E6F40';
}

function scoreTextColor(score: number): string {
  const v = scoreOutOf10(score);
  if (v <= 3) return '#C0504A';
  if (v <= 6) return '#C29B2A';
  return '#2E6F40';
}

// ─── Band config ──────────────────────────────────────────────────────────────

const BAND_CONFIG: Record<string, {
  color: string; bg: string; border: string; icon: keyof typeof Ionicons.glyphMap;
}> = {
  Excellent: { color: '#2E6F40', bg: '#E6F5EB', border: '#2E6F4030', icon: 'flame' },
  Good:      { color: '#3A8A54', bg: '#EEF8F2', border: '#3A8A5428', icon: 'thumbs-up' },
  Fair:      { color: '#C29B2A', bg: '#FDF6E8', border: '#C29B2A28', icon: 'partly-sunny-outline' },
  Poor:      { color: '#C0504A', bg: '#FDF0EF', border: '#C0504A28', icon: 'arrow-down-circle-outline' },
};

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const filled = scoreOutOf10(score);
  return (
    <View style={gaugeStyles.wrap}>
      <View style={gaugeStyles.track}>
        {Array.from({ length: 10 }, (_, i) => {
          const idx = i + 1;
          const active = idx <= filled;
          const isLast = idx === filled;
          return (
            <View
              key={i}
              style={[
                gaugeStyles.segment,
                active
                  ? { backgroundColor: segmentColor(idx) }
                  : gaugeStyles.segmentInactive,
                isLast && gaugeStyles.segmentTip,
              ]}
            />
          );
        })}
      </View>
      <View style={gaugeStyles.labelRow}>
        <Text style={gaugeStyles.labelLeft}>0</Text>
        <Text style={gaugeStyles.labelCenter}>5</Text>
        <Text style={gaugeStyles.labelRight}>10</Text>
      </View>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  wrap: { marginTop: spacing.md, marginBottom: spacing.sm },
  track: {
    flexDirection: 'row',
    gap: 3,
    height: 14,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    borderRadius: 3,
  },
  segmentInactive: {
    backgroundColor: '#D4E8D8',
  },
  segmentTip: {
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 1,
  },
  labelLeft:   { fontFamily: fonts.bodySemiBold, fontSize: 10, color: colors.textMuted },
  labelCenter: { fontFamily: fonts.bodySemiBold, fontSize: 10, color: colors.textMuted },
  labelRight:  { fontFamily: fonts.bodySemiBold, fontSize: 10, color: colors.textMuted },
});

// ─── Timing periods ───────────────────────────────────────────────────────────

type PeriodSlot = { label: string; icon: keyof typeof Ionicons.glyphMap; highlighted: boolean };

const PERIOD_PRESETS: Record<string, boolean[]> = {
  early_late_low_light:    [true,  false, false, true],
  warmest_part_may_help:   [false, false, true,  false],
  cooler_low_light_better: [true,  true,  false, true],
  moving_water_periods:    [true,  true,  true,  true],
};

const PERIOD_DEFS: { label: string; icon: keyof typeof Ionicons.glyphMap; subLabel: string }[] = [
  { label: 'Dawn',      subLabel: '5–7am',   icon: 'partly-sunny-outline' },
  { label: 'Morning',   subLabel: '7–11am',  icon: 'sunny-outline' },
  { label: 'Afternoon', subLabel: '11–5pm',  icon: 'sunny' },
  { label: 'Evening',   subLabel: '5–9pm',   icon: 'moon-outline' },
];

function getTimingPeriods(preset: DaypartNotePreset | null): PeriodSlot[] | null {
  if (!preset || preset === 'no_timing_edge') return null;
  const flags = PERIOD_PRESETS[preset];
  if (!flags) return null;
  return PERIOD_DEFS.map((p, i) => ({ label: p.label, icon: p.icon, highlighted: flags[i] }));
}

// ─── Timing Tile ─────────────────────────────────────────────────────────────

function TimingTile({ label, icon, highlighted, subLabel }: {
  label: string; icon: keyof typeof Ionicons.glyphMap;
  highlighted: boolean; subLabel: string;
}) {
  return (
    <View style={[
      timingStyles.tile,
      highlighted ? timingStyles.tileActive : timingStyles.tileInactive,
    ]}>
      <View style={[
        timingStyles.iconWrap,
        highlighted ? timingStyles.iconWrapActive : timingStyles.iconWrapInactive,
      ]}>
        <Ionicons
          name={icon}
          size={20}
          color={highlighted ? '#C29B2A' : colors.textMuted}
        />
      </View>
      <Text style={[timingStyles.tileLabel, highlighted && timingStyles.tileLabelActive]}>
        {label}
      </Text>
      <Text style={timingStyles.tileSubLabel}>{subLabel}</Text>
    </View>
  );
}

const timingStyles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: 1.5,
    gap: 4,
  },
  tileActive: {
    backgroundColor: '#FFFBEF',
    borderColor: '#C29B2A50',
  },
  tileInactive: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.borderLight,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapActive: {
    backgroundColor: '#FDF6E8',
  },
  iconWrapInactive: {
    backgroundColor: colors.background,
  },
  tileLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  tileLabelActive: {
    color: '#B8862D',
  },
  tileSubLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function RebuildReportView({ report }: { report: HowsFishingReportV1 }) {
  const config = BAND_CONFIG[report.band] ?? {
    color: colors.textMuted,
    bg: colors.backgroundAlt,
    border: colors.border,
    icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap,
  };

  const sc = scoreTextColor(report.score);
  const timingPeriods = getTimingPeriods(report.daypart_preset);
  const topDrivers = report.drivers.slice(0, 3);
  const topSuppressors = report.suppressors.slice(0, 2);
  const showTiming = !!(report.daypart_note || timingPeriods);

  return (
    <View style={styles.wrap}>

      {/* ══════════════════════════════════════════════════
          CARD 1 — Score + Gauge
      ══════════════════════════════════════════════════ */}
      <View style={[styles.scoreCard, { backgroundColor: config.bg, borderColor: config.border }]}>

        {/* Top row: band badge left, score right */}
        <View style={styles.scoreTopRow}>
          <View style={styles.scoreLeftCol}>
            <View style={[styles.bandBadge, { backgroundColor: config.color }]}>
              <Ionicons name={config.icon} size={11} color="#FFF" />
              <Text style={styles.bandBadgeText}>{report.band}</Text>
            </View>
            <Text style={styles.outlookLabel}>Today's Fishing Outlook</Text>
          </View>

          <View style={styles.scoreNumWrap}>
            <Text style={[styles.scoreNum, { color: sc }]}>{displayScore(report.score)}</Text>
            <Text style={[styles.scoreMax, { color: sc + 'AA' }]}>/10</Text>
          </View>
        </View>

        {/* Gauge bar */}
        <ScoreGauge score={report.score} />

        {/* Divider + summary */}
        <View style={styles.divider} />
        <Text style={styles.summaryLine}>{report.summary_line}</Text>
      </View>

      {/* ══════════════════════════════════════════════════
          CARD 2 — Top Reasons
      ══════════════════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconBox, { backgroundColor: colors.primaryMist }]}>
            <Ionicons name="stats-chart" size={14} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>Top Reasons</Text>
        </View>

        <View style={styles.reasonList}>
          {topDrivers.length > 0 ? topDrivers.map((d, i) => (
            <View key={`d-${i}`} style={styles.reasonRow}>
              <View style={[styles.reasonNum, { backgroundColor: colors.primary }]}>
                <Text style={styles.reasonNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.driverText}>{d.label}</Text>
            </View>
          )) : (
            <View style={styles.reasonRow}>
              <View style={[styles.reasonNum, { backgroundColor: colors.backgroundAlt }]}>
                <Ionicons name="remove" size={11} color={colors.textMuted} />
              </View>
              <Text style={styles.mutedText}>No strong positive factors today.</Text>
            </View>
          )}

          {topSuppressors.length > 0 && (
            <>
              <View style={styles.reasonSep}>
                <View style={styles.reasonSepLine} />
                <Text style={styles.reasonSepLabel}>Limiting Factors</Text>
                <View style={styles.reasonSepLine} />
              </View>
              {topSuppressors.map((s, i) => (
                <View key={`s-${i}`} style={styles.reasonRow}>
                  <View style={[styles.reasonNum, { backgroundColor: '#FDF0EF' }]}>
                    <Ionicons name="close" size={11} color="#C0504A" />
                  </View>
                  <Text style={styles.suppressorText}>{s.label}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>

      {/* ══════════════════════════════════════════════════
          CARD 3 — Best Timing
      ══════════════════════════════════════════════════ */}
      {showTiming && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FDF6E8' }]}>
              <Ionicons name="time" size={14} color="#C29B2A" />
            </View>
            <Text style={[styles.cardTitle, { color: '#B8862D' }]}>Best Timing</Text>
          </View>

          {timingPeriods && (
            <View style={styles.timingRow}>
              {PERIOD_DEFS.map((def, i) => {
                const slot = timingPeriods[i];
                return (
                  <TimingTile
                    key={i}
                    label={def.label}
                    subLabel={def.subLabel}
                    icon={def.icon}
                    highlighted={slot.highlighted}
                  />
                );
              })}
            </View>
          )}

          {report.daypart_note ? (
            <Text style={styles.daypartNote}>{report.daypart_note}</Text>
          ) : null}
        </View>
      )}

      {/* ══════════════════════════════════════════════════
          CARD 4 — Tip of the Day
      ══════════════════════════════════════════════════ */}
      <View style={styles.tipCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconBox, { backgroundColor: 'rgba(46,111,64,0.15)' }]}>
            <Ionicons name="bulb" size={14} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Tip of the Day</Text>
        </View>
        <View style={styles.tipQuoteWrap}>
          <View style={styles.tipAccentBar} />
          <Text style={styles.tipText}>{report.actionable_tip}</Text>
        </View>
      </View>

      {/* ══════════════════════════════════════════════════
          CARD 5 — Confidence (low/medium only)
      ══════════════════════════════════════════════════ */}
      {report.reliability !== 'high' && report.reliability_note ? (
        <View style={styles.confidenceCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: colors.backgroundAlt }]}>
              <Ionicons name="shield-checkmark-outline" size={13} color={colors.textMuted} />
            </View>
            <Text style={[styles.cardTitle, styles.cardTitleMuted]}>Confidence</Text>
            <View style={[styles.reliDot, {
              backgroundColor: report.reliability === 'medium' ? '#C29B2A' : '#C0504A',
            }]} />
            <Text style={[styles.reliLabel, {
              color: report.reliability === 'medium' ? '#C29B2A' : '#C0504A',
            }]}>
              {report.reliability === 'medium' ? 'Medium' : 'Low'}
            </Text>
          </View>
          <Text style={styles.confidenceText}>{report.reliability_note}</Text>
        </View>
      ) : null}

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },

  // ── Score Card ──────────────────────────────────────────────────
  scoreCard: {
    borderRadius: radius.lg,
    padding: 20,
    paddingBottom: spacing.md + 4,
    borderWidth: 1.5,
    ...shadows.lg,
  },
  scoreTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreLeftCol: {
    gap: spacing.xs + 2,
    flex: 1,
    paddingRight: spacing.md,
  },
  bandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  bandBadgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: '#FFF',
    letterSpacing: 0.4,
  },
  outlookLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scoreNumWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  scoreNum: {
    fontFamily: fonts.serifBold,
    fontSize: 68,
    lineHeight: 72,
  },
  scoreMax: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 20,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  summaryLine: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
  },

  // ── Generic Card ────────────────────────────────────────────────
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardIconBox: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },
  cardTitleMuted: { color: colors.textMuted },

  // ── Reasons ─────────────────────────────────────────────────────
  reasonList: { gap: spacing.sm + 2 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  reasonNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reasonNumText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#FFF',
  },
  driverText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
    flex: 1,
  },
  suppressorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    flex: 1,
  },
  mutedText: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  reasonSep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: 2,
  },
  reasonSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  reasonSepLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // ── Timing ──────────────────────────────────────────────────────
  timingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm + 4,
  },
  daypartNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },

  // ── Tip ─────────────────────────────────────────────────────────
  tipCard: {
    backgroundColor: 'rgba(207,255,220,0.5)',
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1.5,
    borderColor: 'rgba(46,111,64,0.18)',
    ...shadows.md,
  },
  tipQuoteWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tipAccentBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    alignSelf: 'stretch',
    minHeight: 20,
    opacity: 0.7,
  },
  tipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    flex: 1,
  },

  // ── Confidence ──────────────────────────────────────────────────
  confidenceCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reliDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reliLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  confidenceText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
