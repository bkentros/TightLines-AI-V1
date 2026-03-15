/**
 * KeyFactors — displays LLM-generated key factor explanations.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { LLMKeyFactors } from '../../lib/howFishing';

interface KeyFactorsProps {
  factors: LLMKeyFactors;
  embedded?: boolean;
}

export function KeyFactorsSection({ factors, embedded = false }: KeyFactorsProps) {
  const entries = Object.entries(factors).filter(([, v]) => v && typeof v === 'string');
  if (entries.length === 0) return null;
  return (
    <View style={embedded ? undefined : styles.section}>
      {!embedded ? <Text style={styles.sectionTitle}>Key Factors</Text> : null}
      <View style={styles.descCard}>
        {entries.map(([key, val]) => (
          <View key={key} style={styles.whyRow}>
            <Text style={styles.whyFactor}>
              {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>
            <Text style={styles.whyVal}>{val}</Text>
          </View>
        ))}
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
  descCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  whyRow: { marginBottom: spacing.sm },
  whyFactor: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 },
  whyVal: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
});
