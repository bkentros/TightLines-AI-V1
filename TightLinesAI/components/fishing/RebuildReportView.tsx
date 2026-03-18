/**
 * How's Fishing rebuild — UI_UX_REBUILD_SPEC card layout.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { HowsFishingReportV1 } from '../../lib/howFishing';

const BAND_COLOR: Record<string, string> = {
  Excellent: '#2d6a4f',
  Good: '#40916c',
  Fair: '#d4a373',
  Poor: '#9d6b53',
};

export function RebuildReportView({ report }: { report: HowsFishingReportV1 }) {
  const bandColor = BAND_COLOR[report.band] ?? colors.textMuted;

  return (
    <View style={styles.wrap}>
      <View style={[styles.scoreCard, { borderLeftColor: bandColor }]}>
        <Text style={styles.scoreNum}>{report.score}</Text>
        <View style={styles.scoreRight}>
          <Text style={[styles.band, { color: bandColor }]}>{report.band}</Text>
          <Text style={styles.fullDay}>Today&apos;s full-day outlook</Text>
          <Text style={styles.summary}>{report.summary_line}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why today looks this way</Text>
        {report.drivers.length > 0 ? (
          report.drivers.map((d, i) => (
            <Text key={`d-${i}`} style={styles.driver}>
              + {d.label}
            </Text>
          ))
        ) : (
          <Text style={styles.muted}>No strong positive factors stood out.</Text>
        )}
        {report.suppressors.length > 0 ? (
          report.suppressors.map((s, i) => (
            <Text key={`s-${i}`} style={styles.suppressor}>
              − {s.label}
            </Text>
          ))
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What to do with it</Text>
        <Text style={styles.tip}>{report.actionable_tip}</Text>
      </View>

      {report.daypart_note ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Timing note</Text>
          <Text style={styles.daypart}>{report.daypart_note}</Text>
        </View>
      ) : null}

      {report.reliability !== 'high' && report.reliability_note ? (
        <View style={styles.reliabilityCard}>
          <Text style={styles.reliabilityTitle}>Confidence</Text>
          <Text style={styles.reliabilityText}>{report.reliability_note}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    gap: spacing.md,
  },
  scoreNum: {
    fontFamily: fonts.serif,
    fontSize: 44,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 48,
  },
  scoreRight: { flex: 1 },
  band: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  fullDay: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  summary: { fontSize: 15, color: colors.text, lineHeight: 22 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  driver: { fontSize: 15, color: colors.text, lineHeight: 22, marginBottom: 6 },
  suppressor: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 6 },
  muted: { fontSize: 14, color: colors.textMuted, fontStyle: 'italic' },
  tip: { fontSize: 16, color: colors.text, lineHeight: 24, fontWeight: '600' },
  daypart: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  reliabilityCard: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reliabilityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reliabilityText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
});
