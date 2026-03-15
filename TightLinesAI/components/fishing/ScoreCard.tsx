/**
 * ScoreCard — displays the big fishing score (0-100) with rating and water temp.
 * Extracted from how-fishing-results.tsx for reuse across results + forecast drill-down.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { EngineScoring } from '../../lib/howFishing';

export function getScoreBand(score: number): 'red' | 'yellow' | 'green' {
  if (score <= 37) return 'red';
  if (score <= 71) return 'yellow';
  return 'green';
}

const BAND_STYLES = {
  red: { bg: '#FFF0F0', border: '#E05252', text: '#E05252' },
  yellow: { bg: '#FFF8E6', border: '#E8A838', text: '#C47B00' },
  green: { bg: '#F0F8F0', border: colors.sage, text: colors.sage },
} as const;

interface ScoreCardProps {
  scoring: EngineScoring;
  waterType: string;
  waterTempLine: string | null;
}

function confidenceLine(scoring: EngineScoring): string | null {
  if (typeof scoring.water_temp_confidence !== 'number') return null;
  const pct = Math.round(scoring.water_temp_confidence * 100);
  if (pct >= 90) return null;
  return `Freshwater temperature confidence: ${pct}%`;
}

export function ScoreCard({ scoring, waterType, waterTempLine }: ScoreCardProps) {
  const band = getScoreBand(scoring.adjusted_score);
  const style = BAND_STYLES[band];

  const frontNote =
    scoring.recovery_multiplier < 1.0
      ? 'Score reduced due to recent cold front activity.'
      : null;

  const confidenceNote = confidenceLine(scoring);
  const hasScoreContext =
    typeof scoring.seasonal_baseline_score === 'number' ||
    typeof scoring.daily_opportunity_score === 'number';

  return (
    <View style={[styles.scoreCard, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={[styles.scoreBig, { color: style.text }]}>{scoring.adjusted_score}</Text>
      <Text style={styles.scoreOutOf}>out of 100</Text>
      <Text style={[styles.scoreRating, { color: style.text }]}>{scoring.overall_rating}</Text>
      <Text style={styles.scoreWaterType}>{waterType.charAt(0).toUpperCase() + waterType.slice(1)}</Text>
      {hasScoreContext ? (
        <View style={styles.contextRow}>
          {typeof scoring.seasonal_baseline_score === 'number' ? (
            <View style={styles.contextPill}>
              <Text style={styles.contextLabel}>Seasonal base</Text>
              <Text style={styles.contextValue}>{scoring.seasonal_baseline_score}</Text>
            </View>
          ) : null}
          {typeof scoring.daily_opportunity_score === 'number' ? (
            <View style={styles.contextPill}>
              <Text style={styles.contextLabel}>Today's boost</Text>
              <Text style={styles.contextValue}>{scoring.daily_opportunity_score}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {frontNote && <Text style={styles.recoveryNote}>{frontNote}</Text>}
      {waterTempLine ? <Text style={styles.waterTempLine}>{waterTempLine}</Text> : null}
      {confidenceNote ? <Text style={styles.confidenceLine}>{confidenceNote}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  scoreBig: {
    fontFamily: fonts.serif,
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 72,
  },
  scoreOutOf: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: -4,
    marginBottom: spacing.xs,
  },
  scoreRating: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreWaterType: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  contextRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  contextPill: {
    backgroundColor: '#FFFFFFB3',
    borderWidth: 1,
    borderColor: '#00000010',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    minWidth: 110,
    alignItems: 'center',
  },
  contextLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
    fontWeight: '700',
  },
  contextValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  recoveryNote: {
    fontSize: 12,
    color: '#E8A838',
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  waterTempLine: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  confidenceLine: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
