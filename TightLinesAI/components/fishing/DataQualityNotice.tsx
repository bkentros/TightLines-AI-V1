/**
 * DataQualityNotice — shows data quality warnings when confidence is reduced.
 * Extracted from how-fishing-results.tsx for reuse.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../lib/theme';
import { reliabilityLabel } from './ScoreBreakdown';
import type { DataQuality } from '../../lib/howFishing';

interface DataQualityNoticeProps {
  quality: DataQuality;
  tier: string;
  hideWaterTempFallbackOnly?: boolean;
  embedded?: boolean;
}

function prettyVariableName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Water Temp Zone', 'Water temperature')
    .replace('Temp Trend', 'Temperature trend');
}

function formatVariableList(values: string[]): string {
  return values.map(prettyVariableName).join(', ');
}

export function DataQualityNotice({ quality, tier, hideWaterTempFallbackOnly, embedded = false }: DataQualityNoticeProps) {
  if (tier === 'high' && quality.missing_variables.length === 0 && quality.fallback_variables.length === 0) {
    return null;
  }
  if (
    hideWaterTempFallbackOnly &&
    tier === 'high' &&
    quality.missing_variables.length === 0 &&
    quality.fallback_variables.length === 1 &&
    quality.fallback_variables[0] === 'water_temp_zone'
  ) {
    return null;
  }
  const isSerious = tier === 'low_confidence' || tier === 'very_low_confidence';
  return (
    <View style={[styles.qualityNotice, isSerious && styles.qualityNoticeSevere, embedded && styles.qualityEmbedded]}>
      <Ionicons
        name="information-circle"
        size={16}
        color={isSerious ? '#E05252' : '#E8A838'}
        style={{ marginRight: 6 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.qualityTitle, isSerious && { color: '#E05252' }]}>
          {reliabilityLabel(tier)}
        </Text>
        {quality.missing_variables.length > 0 && (
          <Text style={styles.qualityDetail}>Missing inputs: {formatVariableList(quality.missing_variables)}</Text>
        )}
        {quality.fallback_variables.length > 0 && (
          <Text style={styles.qualityDetail}>Estimated inputs: {formatVariableList(quality.fallback_variables)}</Text>
        )}
        {quality.notes.map((n, i) => <Text key={i} style={styles.qualityDetail}>{n}</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  qualityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E6',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#E8A838',
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  qualityNoticeSevere: { backgroundColor: '#FFF0F0', borderColor: '#E05252' },
  qualityEmbedded: { marginBottom: 0 },
  qualityTitle: { fontSize: 12, fontWeight: '600', color: '#E8A838', marginBottom: 2 },
  qualityDetail: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});
