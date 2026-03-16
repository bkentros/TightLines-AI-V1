/**
 * EngineDriversPanel — displays V2 engine top drivers and suppressors.
 * Replaces the empty ScoreBreakdown bar chart when V2 fields are available.
 * Shows driver/suppressor tags, confidence band, and optional timing hint.
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
    // Clean up common prefixes
    .replace('Tide ', '')
    .replace('Current ', '')
    .replace('Solunar ', 'Feeding window ')
    .replace('Inferred Freshwater', 'Estimated water temp')
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
    case 'high': return colors.sage;
    case 'moderate': return '#E8A838';
    default: return '#E05252';
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

  // If no V2 data available (old cached report), show nothing
  if (drivers.length === 0 && suppressors.length === 0) return null;

  const modeLabel = mode ? mode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null;

  return (
    <View style={styles.container}>
      {/* Mode badge */}
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

      {/* Timing hint */}
      {timingHint ? (
        <View style={styles.timingHintRow}>
          <Ionicons name="time-outline" size={13} color={colors.textMuted} />
          <Text style={styles.timingHintText}>{timingHint}</Text>
        </View>
      ) : null}

      {/* Drivers */}
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

      {/* Suppressors */}
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
    gap: spacing.sm,
  },
  modeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  modeBadge: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
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
  timingHintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timingHintText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },
  tagBlock: {
    gap: 6,
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
    backgroundColor: colors.sage + '18',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.sage + '50',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  driverTagText: {
    fontSize: 12,
    color: colors.sage,
    fontWeight: '500',
  },
  suppressorTag: {
    backgroundColor: '#FFF3F0',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E0523030',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  suppressorTagText: {
    fontSize: 12,
    color: '#C04040',
    fontWeight: '500',
  },
});
