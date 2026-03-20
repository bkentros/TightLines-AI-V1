/**
 * How's Fishing rebuild — Premium report card layout.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import type { HowsFishingReportV1 } from '../../lib/howFishing';

const BAND_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Excellent: { color: '#1B6B3A', bg: '#E8F5EC', icon: 'flame' },
  Good:      { color: '#2A7D4E', bg: '#EDF7F0', icon: 'thumbs-up' },
  Fair:      { color: '#B8862D', bg: '#FDF6E8', icon: 'remove-circle-outline' },
  Poor:      { color: '#9D5B42', bg: '#FDF0EB', icon: 'arrow-down-circle-outline' },
};

function displayScore(score: number): string {
  const outOfTen = Math.round(score) / 10;
  return Number.isInteger(outOfTen) ? outOfTen.toFixed(0) : outOfTen.toFixed(1);
}

export function RebuildReportView({ report }: { report: HowsFishingReportV1 }) {
  const config = BAND_CONFIG[report.band] ?? { color: colors.textMuted, bg: colors.backgroundAlt, icon: 'help-circle-outline' };

  return (
    <View style={styles.wrap}>
      {/* ─── Score Hero Card ─── */}
      <View style={[styles.scoreCard, { backgroundColor: config.bg }]}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNum, { color: config.color }]}>{displayScore(report.score)}</Text>
            <Text style={styles.scoreMax}>/10</Text>
          </View>
          <View style={styles.scoreMeta}>
            <View style={[styles.bandBadge, { backgroundColor: config.color }]}>
              <Ionicons name={config.icon as any} size={12} color="#FFFFFF" />
              <Text style={styles.bandBadgeText}>{report.band}</Text>
            </View>
            <Text style={styles.outlookLabel}>Today's full-day outlook</Text>
          </View>
        </View>
        <Text style={styles.summaryLine}>{report.summary_line}</Text>
      </View>

      {/* ─── Drivers & Suppressors ─── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="analytics-outline" size={16} color={colors.primary} />
          <Text style={styles.cardTitle}>Why today looks this way</Text>
        </View>
        {report.drivers.length > 0 ? (
          <View style={styles.tagGroup}>
            {report.drivers.map((d, i) => (
              <View key={`d-${i}`} style={styles.driverTag}>
                <View style={styles.driverDot} />
                <Text style={styles.driverText}>{d.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noFactors}>No strong positive factors stood out.</Text>
        )}
        {report.suppressors.length > 0 && (
          <View style={[styles.tagGroup, { marginTop: spacing.sm + 2 }]}>
            {report.suppressors.map((s, i) => (
              <View key={`s-${i}`} style={styles.suppressorTag}>
                <View style={styles.suppressorDot} />
                <Text style={styles.suppressorText}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ─── Actionable Tip ─── */}
      <View style={styles.tipCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="bulb-outline" size={16} color={colors.primary} />
          <Text style={styles.cardTitle}>What to do with it</Text>
        </View>
        <Text style={styles.tipText}>{report.actionable_tip}</Text>
      </View>

      {/* ─── Timing Note ─── */}
      {report.daypart_note ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.cardTitle}>Timing</Text>
          </View>
          <Text style={styles.daypartText}>{report.daypart_note}</Text>
        </View>
      ) : null}

      {/* ─── Confidence ─── */}
      {report.reliability !== 'high' && report.reliability_note ? (
        <View style={styles.confidenceCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>Confidence</Text>
          </View>
          <Text style={styles.confidenceText}>{report.reliability_note}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },

  /* Score Hero */
  scoreCard: {
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  scoreNum: {
    fontFamily: fonts.serif,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
  },
  scoreMax: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -4,
  },
  scoreMeta: {
    flex: 1,
    gap: spacing.xs + 2,
  },
  bandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.full,
  },
  bandBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  outlookLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  summaryLine: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '500',
  },

  /* Standard Cards */
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm + 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Drivers & Suppressors */
  tagGroup: {
    gap: spacing.sm,
  },
  driverTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  driverDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  driverText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  suppressorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  suppressorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C4876C',
  },
  suppressorText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    flex: 1,
  },
  noFactors: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },

  /* Tip */
  tipCard: {
    backgroundColor: colors.primaryMist,
    borderRadius: radius.md,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    ...shadows.sm,
  },
  tipText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '600',
  },

  /* Timing */
  daypartText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },

  /* Confidence */
  confidenceCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confidenceText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
