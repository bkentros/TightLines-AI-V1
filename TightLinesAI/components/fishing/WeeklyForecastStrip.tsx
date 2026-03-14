/**
 * WeeklyForecastStrip — horizontal scrollable 7-day fishing forecast.
 * Each day card shows: score, rating badge, day label, high/low temp.
 * Today is visually highlighted. Tappable for drill-down.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { getScoreBand } from './ScoreCard';
import type { ForecastDay, OverallRating } from '../../lib/howFishing';

// ---------------------------------------------------------------------------
// Rating → strip label mapping
// ---------------------------------------------------------------------------

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
    case 'PRIME':
      return { bg: colors.sage, text: '#fff' };
    case 'GOOD':
      return { bg: '#4A9ECC', text: '#fff' };
    case 'FAIR':
      return { bg: '#B8860B', text: '#fff' };
    case 'SLOW':
      return { bg: '#E05252', text: '#fff' };
    default:
      return { bg: colors.textMuted, text: '#fff' };
  }
}

// ---------------------------------------------------------------------------
// Day label helper
// ---------------------------------------------------------------------------

function getDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  try {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return `Day ${index + 1}`;
  }
}

// ---------------------------------------------------------------------------
// Weather icon helper
// ---------------------------------------------------------------------------

function getWeatherIcon(day: ForecastDay): keyof typeof Ionicons.glyphMap {
  if (day.precip_chance_pct > 60) return 'rainy-outline';
  if (day.wind_mph_avg > 20) return 'flag-outline';
  if (day.precip_chance_pct > 30) return 'cloudy-outline';
  return 'sunny-outline';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface WeeklyForecastStripProps {
  forecastDays: ForecastDay[];
  selectedDate?: string | null;
  onDayPress: (date: string, index: number) => void;
  isLoading?: boolean;
}

export function WeeklyForecastStrip({
  forecastDays,
  selectedDate,
  onDayPress,
  isLoading,
}: WeeklyForecastStripProps) {
  if (isLoading && forecastDays.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.sage} />
        <Text style={styles.loadingText}>Loading forecast...</Text>
      </View>
    );
  }

  if (forecastDays.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>7-Day Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {forecastDays.map((day, idx) => {
          const isToday = idx === 0;
          const isSelected = day.date === selectedDate;
          const badge = ratingBadgeStyle(day.overall_rating);
          const label = ratingToLabel(day.overall_rating);
          const band = getScoreBand(day.daily_score);

          return (
            <Pressable
              key={day.date}
              onPress={() => onDayPress(day.date, idx)}
              style={({ pressed }) => [
                styles.dayCard,
                isToday && styles.dayCardToday,
                isSelected && styles.dayCardSelected,
                pressed && styles.dayCardPressed,
              ]}
            >
              {/* Day label */}
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                {getDayLabel(day.date, idx)}
              </Text>

              {/* Score number */}
              <Text
                style={[
                  styles.scoreNumber,
                  {
                    color:
                      band === 'green' ? colors.sage : band === 'yellow' ? '#C47B00' : '#E05252',
                  },
                ]}
              >
                {day.daily_score}
              </Text>

              {/* Rating badge */}
              <View style={[styles.ratingBadge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.ratingBadgeText, { color: badge.text }]}>{label}</Text>
              </View>

              {/* Weather icon */}
              <Ionicons
                name={getWeatherIcon(day) as any}
                size={16}
                color={colors.textMuted}
                style={styles.weatherIcon}
              />

              {/* High/Low */}
              <Text style={styles.tempText}>
                {Math.round(day.high_temp_f)}/{Math.round(day.low_temp_f)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const CARD_WIDTH = 72;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dayCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  dayCardToday: {
    borderColor: colors.sage,
    borderWidth: 2,
    backgroundColor: colors.sage + '08',
  },
  dayCardSelected: {
    borderColor: colors.sage,
    borderWidth: 2,
    backgroundColor: colors.sageLight,
  },
  dayCardPressed: {
    transform: [{ scale: 0.96 }],
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dayLabelToday: {
    color: colors.sage,
  },
  scoreNumber: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginTop: 3,
    marginBottom: 4,
  },
  ratingBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  weatherIcon: {
    marginBottom: 2,
  },
  tempText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
