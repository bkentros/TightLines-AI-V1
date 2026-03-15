/**
 * ScoreBreakdown — component bar chart showing weighted score per variable.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../lib/theme';
import type { EngineScoring } from '../../lib/howFishing';

function reliabilityColor(tier: string): string {
  if (tier === 'high') return colors.sage;
  if (tier === 'degraded') return '#E8A838';
  return '#E05252';
}

function reliabilityLabel(tier: string): string {
  if (tier === 'high') return 'High confidence';
  if (tier === 'degraded') return 'Reduced confidence — some data unavailable';
  if (tier === 'low_confidence') return 'Low confidence — missing key data';
  return 'Very low confidence — limited data';
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Solunar', 'Feeding window')
    .replace('Water Temp', 'Water temperature')
    .replace('Temp Trend', 'Temperature trend');
}

export { reliabilityColor, reliabilityLabel };

interface ScoreBreakdownProps {
  scoring: EngineScoring;
  embedded?: boolean;
}

export function ScoreBreakdown({ scoring, embedded = false }: ScoreBreakdownProps) {
  const entries = Object.entries(scoring.components)
    .map(([key, score]) => ({
      key,
      score,
      weight: scoring.weights[key] ?? 0,
      status: scoring.component_status[key] ?? 'available',
    }))
    .sort((a, b) => b.weight - a.weight);

  const hasContext =
    typeof scoring.seasonal_baseline_score === 'number' ||
    typeof scoring.daily_opportunity_score === 'number';

  return (
    <View style={[styles.breakdownCard, embedded && styles.breakdownCardEmbedded]}>
      {!embedded ? <Text style={styles.breakdownTitle}>Raw Score Breakdown</Text> : null}
      {hasContext ? (
        <View style={styles.contextSummaryRow}>
          {typeof scoring.seasonal_baseline_score === 'number' ? (
            <Text style={styles.contextSummaryText}>Seasonal base: {scoring.seasonal_baseline_score}</Text>
          ) : null}
          {typeof scoring.daily_opportunity_score === 'number' ? (
            <Text style={styles.contextSummaryText}>Today's opportunity: {scoring.daily_opportunity_score}</Text>
          ) : null}
        </View>
      ) : null}
      {entries.map(({ key, score, weight, status }) => {
        const pct = weight > 0 ? score / weight : 0;
        const label = humanizeKey(key);
        const barColor = pct >= 0.7 ? colors.sage : pct >= 0.4 ? '#E8A838' : '#E05252';
        const isFallback = status === 'fallback_used';
        return (
          <View key={key} style={styles.breakdownRow}>
            <View style={styles.breakdownLabelRow}>
              <Text style={styles.breakdownLabel}>{label}</Text>
              {isFallback && <Text style={styles.fallbackBadge}>estimated</Text>}
              <Text style={styles.breakdownScore}>{score}/{weight}</Text>
            </View>
            <View style={styles.breakdownBarBg}>
              <View style={[styles.breakdownBarFill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
            </View>
          </View>
        );
      })}
      <View style={styles.coverageRow}>
        <Text style={styles.coverageLabel}>
          Data coverage: {scoring.coverage_pct}% ·{' '}
          <Text style={{ color: reliabilityColor(scoring.reliability_tier) }}>
            {reliabilityLabel(scoring.reliability_tier)}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownCardEmbedded: {
    marginBottom: 0,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  contextSummaryText: {
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: '#00000008',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
  },
  breakdownRow: { marginBottom: spacing.sm },
  breakdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  breakdownLabel: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  fallbackBadge: {
    fontSize: 10,
    color: '#E8A838',
    fontStyle: 'italic',
    marginHorizontal: 4,
  },
  breakdownScore: { fontSize: 12, fontWeight: '600', color: colors.text },
  breakdownBarBg: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownBarFill: { height: '100%', borderRadius: 2 },
  coverageRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  coverageLabel: { fontSize: 11, color: colors.textMuted },
});
