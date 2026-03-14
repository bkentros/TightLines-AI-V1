/**
 * StrategySection — tactical approach recommendations.
 * Shows presentation speed, depth focus, and a guide-style approach note.
 * Phase 3: "fishing buddy" strategy advice from the LLM.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { LLMStrategy } from '../../lib/howFishing';

interface StrategySectionProps {
  strategy: LLMStrategy;
}

function StrategyRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon as any} size={18} color={colors.sage} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export function StrategySection({ strategy }: StrategySectionProps) {
  if (!strategy) return null;

  const hasContent =
    strategy.presentation_speed || strategy.depth_focus || strategy.approach_note;
  if (!hasContent) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Game Plan</Text>
      <View style={styles.card}>
        {strategy.presentation_speed ? (
          <StrategyRow
            icon="speedometer-outline"
            label="Presentation"
            value={strategy.presentation_speed}
          />
        ) : null}
        {strategy.depth_focus ? (
          <StrategyRow
            icon="arrow-down-outline"
            label="Target Depth"
            value={strategy.depth_focus}
          />
        ) : null}
        {strategy.approach_note ? (
          <View style={styles.approachWrap}>
            <Ionicons name="compass-outline" size={16} color={colors.sage} style={styles.approachIcon} />
            <Text style={styles.approachText}>{strategy.approach_note}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.sage + '25',
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginTop: 1,
  },
  approachWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  approachIcon: {
    marginTop: 3,
  },
  approachText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    fontStyle: 'italic',
  },
});
