/**
 * EngineDriversPanel — displays engine top drivers and suppressors.
 * Premium pill-tag design with soft color coding.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../lib/theme';
import type { EngineOutput } from '../../lib/howFishing';

function humanizeTag(tag: string): string {
  return tag
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Tide ', '')
    .replace('Current ', '')
    .replace('Solunar ', 'Feeding window ')
    .replace('Post Front ', 'Post-front ')
    .replace('Overcast ', 'Overcast — ');
}

function confidenceLabel(band?: string): string {
  switch (band) {
    case 'very_high': return 'Very high confidence';
    case 'high': return 'High confidence';
    case 'moderate': return 'Moderate confidence';
    case 'low': return 'Low confidence';
    case 'very_low': return 'Very low confidence — limited data';
    default: return 'Confidence unavailable';
  }
}

function confidenceColor(band?: string): string {
  switch (band) {
    case 'very_high':
    case 'high': return colors.primary;
    case 'moderate': return '#C29B2A';
    default: return '#C06040';
  }
}

interface EngineDriversPanelProps {
  engine: EngineOutput;
}

export function EngineDriversPanel({ engine }: EngineDriversPanelProps) {
  const drivers = engine.v2_drivers ?? [];
  const suppressors = engine.v2_suppressors ?? [];
  const confidence = engine.v2_confidence;
  const timingHint = engine.v2_timing_hint;
  const mode = engine.v2_environment_mode;

  if (drivers.length === 0 && suppressors.length === 0) return null;

  const modeLabel = mode ? mode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null;

  return (
    <View style={styles.container}>
      {modeLabel ? (
        <View style={styles.modeBadgeRow}>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{modeLabel}</Text>
          </View>
          <Text style={[styles.confidenceText, { color: confidenceColor(confidence) }]}>
            {confidenceLabel(confidence)}
          </Text>
        </View>
      ) : null}

      {timingHint ? (
        <View style={styles.timingRow}>
          <Ionicons name="time-outline" size={13} color={colors.primary} />
          <Text style={styles.timingText}>{timingHint}</Text>
        </View>
      ) : null}

      {drivers.length > 0 ? (
        <View style={styles.tagBlock}>
          <Text style={styles.tagBlockLabel}>What's helping</Text>
          <View style={styles.tagRow}>
            {drivers.slice(0, 4).map((tag, i) => (
              <View key={i} style={styles.driverTag}>
                <Text style={styles.driverTagText}>{humanizeTag(tag)}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {suppressors.length > 0 ? (
        <View style={styles.tagBlock}>
          <Text style={styles.tagBlockLabel}>What's limiting</Text>
          <View style={styles.tagRow}>
            {suppressors.slice(0, 4).map((tag, i) => (
              <View key={i} style={styles.suppressorTag}>
                <Text style={styles.suppressorTagText}>{humanizeTag(tag)}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm + 2,
  },
  modeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  modeBadge: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.primaryMist,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
  },
  timingText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  tagBlock: {
    gap: spacing.xs + 2,
  },
  tagBlockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  driverTag: {
    backgroundColor: colors.primary + '14',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  driverTagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  suppressorTag: {
    backgroundColor: '#FFF3EF',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  suppressorTagText: {
    fontSize: 12,
    color: '#B05A3A',
    fontWeight: '600',
  },
});
