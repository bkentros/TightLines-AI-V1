/**
 * TimeWindows — best, fair, and slow sections.
 * Always normalizes displayed ranges to 12-hour local time.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { LLMOutput, TimeWindow as EngineTimeWindow } from '../../lib/howFishing';

function formatClock(raw: string): string {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return raw.trim();
  const h24 = Number(m[1]);
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m[2]} ${suffix}`;
}

function zoneAbbreviation(timezone?: string): string {
  if (!timezone) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
      hour: 'numeric',
    }).formatToParts(new Date()).find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

function normalizeDisplayRange(value: string, timezone?: string): string {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  const rangeMatch = trimmed.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})(?:\s+[A-Z]{2,4})?$/i);
  if (rangeMatch) {
    const zone = zoneAbbreviation(timezone);
    return `${formatClock(rangeMatch[1])} – ${formatClock(rangeMatch[2])}${zone ? ` ${zone}` : ''}`;
  }
  return trimmed;
}

function Reason({ children, muted = false }: { children: string; muted?: boolean }) {
  return <Text style={muted ? styles.timeReasoningMuted : styles.timeReasoning}>{children}</Text>;
}

export function BestTimesSection({ windows, timezone }: { windows: LLMOutput['best_times_to_fish_today']; timezone?: string }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Best windows</Text>
      {windows.map((w, i) => (
        <View key={i} style={[styles.timeCard, w.label === 'PRIME' && styles.timeCardPrime]}>
          <View style={styles.timeCardHeader}>
            <Text style={styles.timeWindow}>{normalizeDisplayRange(w.time_range, timezone)}</Text>
            <View style={[styles.labelBadge, BADGE_MAP[w.label ?? 'GOOD'] ?? styles.badgeGood]}>
              <Text style={styles.labelBadgeText}>{w.label}</Text>
            </View>
          </View>
          <Reason>{w.reasoning}</Reason>
        </View>
      ))}
    </View>
  );
}

export function DecentTimesSection({ windows, timezone }: { windows?: Array<{ time_range: string; reasoning: string }>; timezone?: string }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fair windows</Text>
      {windows.map((w, i) => (
        <View key={i} style={styles.timeCardDecent}>
          <View style={styles.timeCardHeader}>
            <Text style={styles.timeWindow}>{normalizeDisplayRange(w.time_range, timezone)}</Text>
            <View style={[styles.labelBadge, styles.badgeFair]}>
              <Text style={styles.labelBadgeText}>FAIR</Text>
            </View>
          </View>
          <Reason>{w.reasoning}</Reason>
        </View>
      ))}
    </View>
  );
}

export function DecentTimesFromReport({ llmDecent, engineFair, timezone }: { llmDecent?: LLMOutput['decent_times_today']; engineFair?: EngineTimeWindow[]; timezone?: string; }) {
  if (llmDecent && llmDecent.length > 0) {
    return <DecentTimesSection windows={llmDecent} timezone={timezone} />;
  }
  if (engineFair && engineFair.length > 0) {
    return (
      <DecentTimesSection
        timezone={timezone}
        windows={engineFair.slice(0, 2).map((w) => ({
          time_range: `${w.start_local} – ${w.end_local}`,
          reasoning: w.drivers.length > 0 ? w.drivers.slice(0, 2).join(', ').replace(/_/g, ' ') : 'Fair conditions',
        }))}
      />
    );
  }
  return null;
}

export function WorstTimesSection({ windows, timezone }: { windows: LLMOutput['worst_times_to_fish_today']; timezone?: string }) {
  if (!windows || windows.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Slow windows</Text>
      {windows.map((w, i) => (
        <View key={i} style={styles.timeCardMuted}>
          <Text style={styles.timeWindow}>{normalizeDisplayRange(w.time_range, timezone)}</Text>
          <Reason muted>{w.reasoning}</Reason>
        </View>
      ))}
    </View>
  );
}

const BADGE_MAP: Record<string, object> = {
  PRIME: { backgroundColor: colors.sage },
  GOOD: { backgroundColor: '#4A9ECC' },
  FAIR: { backgroundColor: '#B8860B' },
};

const styles = StyleSheet.create({
  section: { marginBottom: spacing.md },
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
    padding: spacing.sm + 2,
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
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeCardDecent: {
    backgroundColor: '#FFF8E6',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8A83840',
  },
  timeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: spacing.sm,
  },
  timeWindow: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  timeReasoning: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  timeReasoningMuted: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  labelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeGood: { backgroundColor: '#4A9ECC' },
  badgeFair: { backgroundColor: '#B8860B' },
  labelBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase' },
});
