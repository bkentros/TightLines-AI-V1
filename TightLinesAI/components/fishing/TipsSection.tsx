/**
 * TipsSection — actionable fishing tips list.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';

interface TipsSectionProps {
  tips: string[];
}

function cleanTip(t: string): string {
  return (t || '').replace(/\\u2192/g, '→').replace(/\s+/g, ' ').trim();
}

export function TipsSection({ tips }: TipsSectionProps) {
  const cleaned = (tips ?? []).map(cleanTip).filter(Boolean);
  if (cleaned.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tips for Today</Text>
      <View style={styles.tipsCard}>
        {cleaned.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Ionicons name="bulb" size={18} color={colors.sage} style={styles.tipIcon} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 8,
  },
  tipIcon: { marginTop: 2 },
  tipText: { flexShrink: 1, flex: 1, fontSize: 14, color: colors.text, lineHeight: 21 },
});
