/**
 * TimeWindows — Best, decent, and worst fishing time sections with badges.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { LLMOutput, TimeWindow as EngineTimeWindow } from '../../lib/howFishing';

// ---------------------------------------------------------------------------
// Best Times
// ---------------------------------------------------------------------------

export function BestTimesSection({ windows }: { windows: LLMOutput['best_times_to_fish_today'] }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Best Times to Fish Today</Text>
      {windows.map((w, i) => (
        <View key={i} style={[styles.timeCard, w.label === 'PRIME' && styles.timeCardPrime]}>
          <View style={styles.timeCardHeader}>
            <Text style={styles.timeWindow}>{w.time_range}</Text>
            <View style={[styles.labelBadge, BADGE_MAP[w.label ?? 'GOOD'] ?? styles.badgeGood]}>
              <Text style={styles.labelBadgeText}>{w.label}</Text>
            </View>
          </View>
          <Text style={styles.timeReasoning}>{w.reasoning}</Text>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Decent Times
// ---------------------------------------------------------------------------

export function DecentTimesSection({
  windows,
}: {
  windows?: Array<{ time_range: string; reasoning: string }>;
}) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Decent Times</Text>
      {windows.map((w, i) => (
        <View key={i} style={styles.timeCardDecent}>
          <View style={styles.timeCardHeader}>
            <Text style={styles.timeWindow}>{w.time_range}</Text>
            <View style={[styles.labelBadge, styles.badgeFair]}>
              <Text style={styles.labelBadgeText}>FAIR</Text>
            </View>
          </View>
          <Text style={styles.timeReasoningDecent}>{w.reasoning}</Text>
        </View>
      ))}
    </View>
  );
}

/** Build decent windows from LLM or engine fallback. */
export function DecentTimesFromReport({
  llmDecent,
  engineFair,
}: {
  llmDecent?: LLMOutput['decent_times_today'];
  engineFair?: EngineTimeWindow[];
}) {
  if (llmDecent && llmDecent.length > 0) {
    return <DecentTimesSection windows={llmDecent} />;
  }
  if (engineFair && engineFair.length > 0) {
    return (
      <DecentTimesSection
        windows={engineFair.slice(0, 2).map((w) => ({
          time_range: `${w.start_local} \u2013 ${w.end_local}`,
          reasoning:
            w.drivers.length > 0
              ? w.drivers.slice(0, 2).join(', ').replace(/_/g, ' ')
              : 'Fair conditions',
        }))}
      />
    );
  }
  return null;
}

// ---------------------------------------------------------------------------
// Worst Times
// ---------------------------------------------------------------------------

export function WorstTimesSection({ windows }: { windows: LLMOutput['worst_times_to_fish_today'] }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Worst Times Today</Text>
      {windows.map((w, i) => (
        <View key={i} style={styles.timeCardMuted}>
          <Text style={styles.timeWindow}>{w.time_range}</Text>
          <Text style={styles.timeReasoningMuted}>{w.reasoning}</Text>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Badge mapping
// ---------------------------------------------------------------------------

const BADGE_MAP: Record<string, object> = {
  PRIME: { backgroundColor: colors.sage },
  GOOD: { backgroundColor: '#4A9ECC' },
  FAIR: { backgroundColor: '#B8860B' },
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  timeCard: {
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.sage + '40',
  },
  timeCardPrime: {
    backgroundColor: colors.sage + '18',
    borderColor: colors.sage,
  },
  timeCardMuted: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeCardDecent: {
    backgroundColor: '#FFF8E6',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8A838' + '40',
  },
  timeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeWindow: { fontSize: 15, fontWeight: '600', color: colors.text },
  timeReasoning: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  timeReasoningMuted: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  timeReasoningDecent: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  labelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeGood: { backgroundColor: '#4A9ECC' },
  badgeFair: { backgroundColor: '#B8860B' },
  labelBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase' },
});
