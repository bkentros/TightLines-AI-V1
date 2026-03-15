/**
 * WeeklyForecastStrip — 7-day forecast with /10 display.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import type { ForecastDay, OverallRating } from '../../lib/howFishing';

function ratingToLabel(rating: OverallRating): string {
  switch (rating) {
    case 'Exceptional':
    case 'Excellent':
      return 'PRIME';
    case 'Good':
      return 'GOOD';
    case 'Fair':
      return 'FAIR';
    case 'Poor':
    case 'Tough':
      return 'SLOW';
    default:
      return 'FAIR';
  }
}

function ratingBadgeStyle(rating: OverallRating) {
  const label = ratingToLabel(rating);
  switch (label) {
    case 'PRIME': return { bg: colors.sage, text: '#fff' };
    case 'GOOD': return { bg: '#4A9ECC', text: '#fff' };
    case 'FAIR': return { bg: '#B8860B', text: '#fff' };
    case 'SLOW': return { bg: '#E05252', text: '#fff' };
    default: return { bg: colors.textMuted, text: '#fff' };
  }
}

function getDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  try {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return `Day ${index + 1}`;
  }
}

function getWeatherIcon(day: ForecastDay): keyof typeof Ionicons.glyphMap {
  if (day.precip_chance_pct > 60) return 'rainy-outline';
  if (day.wind_mph_avg > 20) return 'flag-outline';
  if (day.precip_chance_pct > 30) return 'cloudy-outline';
  return 'sunny-outline';
}

function scoreOutOfTen(score: number): string {
  const value = Math.round(score) / 10;
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

interface WeeklyForecastStripProps {
  forecastDays: ForecastDay[];
  selectedDate?: string | null;
  onDayPress: (date: string, index: number) => void;
  isLoading?: boolean;
  todayOverride?: Partial<ForecastDay> | null;
}

export function WeeklyForecastStrip({ forecastDays, selectedDate, onDayPress, isLoading, todayOverride }: WeeklyForecastStripProps) {
  if (isLoading && forecastDays.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.sage} />
        <Text style={styles.loadingText}>Loading forecast…</Text>
      </View>
    );
  }
  if (forecastDays.length === 0) return null;

  const days = forecastDays.map((day, idx) => (idx === 0 && todayOverride ? { ...day, ...todayOverride } : day));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>7-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {days.map((day, idx) => {
          const isSelected = selectedDate === day.date || (!selectedDate && idx === 0);
          const badge = ratingBadgeStyle(day.overall_rating);
          return (
            <Pressable
              key={`${day.date}-${idx}`}
              style={({ pressed }) => [styles.card, isSelected && styles.cardSelected, pressed && { opacity: 0.85 }]}
              onPress={() => onDayPress(day.date, idx)}
            >
              <Text style={styles.dayLabel}>{getDayLabel(day.date, idx).toUpperCase()}</Text>
              <Text style={[styles.score, { color: badge.bg }]}>{scoreOutOfTen(day.daily_score)}</Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>{ratingToLabel(day.overall_rating)}</Text>
              </View>
              <Ionicons name={getWeatherIcon(day)} size={18} color={colors.textMuted} style={styles.icon} />
              <Text style={styles.temps}>{Math.round(day.high_temp_f)}/{Math.round(day.low_temp_f)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  scrollContent: { gap: spacing.sm, paddingRight: spacing.md },
  card: {
    width: 88,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cardSelected: { borderColor: colors.sage, borderWidth: 2 },
  dayLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: 6, letterSpacing: 0.3 },
  score: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 28, fontWeight: '700' },
  badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  icon: { marginTop: spacing.sm },
  temps: { marginTop: 6, fontSize: 12, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  loadingText: { fontSize: 13, color: colors.textMuted },
});
