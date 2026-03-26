/**
 * Live Conditions Widget — Premium environmental data card
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius, shadows } from '../lib/theme';
import { useEnvStore } from '../store/envStore';
import { useAuthStore } from '../store/authStore';
import type { EnvironmentData } from '../lib/env';
import type { WeatherData } from '../lib/env/types';
import { CACHE_TTL_MS } from '../lib/env/constants';

function windDirectionLabel(deg: number): string {
  const cards = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? '—';
}

function moonPhaseLabel(phase: string | undefined, illumination: number | undefined): string {
  if (phase && phase !== 'Unknown') return phase;
  if (illumination == null) return '—';
  const f = illumination;
  if (f <= 0.05) return 'New Moon';
  if (f <= 0.4) return 'Crescent';
  if (f <= 0.6) return 'Half';
  if (f <= 0.9) return 'Gibbous';
  return 'Full Moon';
}

function cloudLabel(pct: number): string {
  if (pct <= 15) return 'Clear';
  if (pct <= 35) return 'Partly';
  if (pct <= 65) return 'Cloudy';
  return 'Overcast';
}

/** Index 14 = today in 21-slot 7-day history arrays from get-environment. */
function airTempTileContent(w: WeatherData): { value: string; label: string } {
  const hiArr = w.temp_7day_high;
  const loArr = w.temp_7day_low;
  const hi = hiArr && hiArr.length > 14 ? hiArr[14] : null;
  const lo = loArr && loArr.length > 14 ? loArr[14] : null;
  if (hi != null && lo != null && Number.isFinite(hi) && Number.isFinite(lo)) {
    return { value: `${Math.round(lo)}–${Math.round(hi)}${w.temp_unit}`, label: 'Air today' };
  }
  return { value: `${Math.round(w.temperature)}${w.temp_unit}`, label: 'Temp' };
}

function pressureTrendInfo(trend: string | undefined): { label: string; color: string } | null {
  switch (trend) {
    case 'rapidly_falling': return { label: '↓↓ Rapidly Falling', color: '#2E7D32' };
    case 'slowly_falling': return { label: '↓ Falling', color: '#388E3C' };
    case 'stable': return { label: 'Stable', color: colors.textMuted };
    case 'slowly_rising': return { label: '↑ Rising', color: '#E65100' };
    case 'rapidly_rising': return { label: '↑↑ Rapidly Rising', color: '#B71C1C' };
    default: return null;
  }
}

export interface LiveConditionsWidgetProps {
  latitude?: number | null;
  longitude?: number | null;
  locationLabel?: string;
  onRefresh?: () => void;
  onRequestLocation?: () => Promise<void>;
  onPress?: () => void;
}

export function LiveConditionsWidget({
  latitude,
  longitude,
  locationLabel = 'Your location',
  onRefresh,
  onRequestLocation,
  onPress,
}: LiveConditionsWidgetProps) {
  const { envData, isLoading, error, loadEnv } = useEnvStore();
  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';

  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude);
  const [locationSyncing, setLocationSyncing] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (hasCoords) {
      loadEnv(latitude!, longitude!, { units });
    }
  }, [hasCoords, latitude, longitude, units]);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestLocation = async () => {
    if (!onRequestLocation) return;
    setLocationSyncing(true);
    try {
      await onRequestLocation();
    } catch {
      Alert.alert('Could not get location', 'Please enable location in Settings or check your connection.');
    } finally {
      setLocationSyncing(false);
    }
  };

  if (!hasCoords) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: colors.stone }]} />
            <Text style={[styles.headerLabel, { color: colors.textMuted }]}>Live Conditions</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="location-outline" size={22} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyText}>
            Sync location to see weather, tides, and moon conditions.
          </Text>
          {onRequestLocation && (
            <Pressable
              style={({ pressed }) => [
                styles.locationBtn,
                pressed && styles.locationBtnPressed,
                locationSyncing && { opacity: 0.7 },
              ]}
              onPress={handleRequestLocation}
              disabled={locationSyncing}
            >
              {locationSyncing ? (
                <ActivityIndicator size="small" color={colors.textOnPrimary} />
              ) : (
                <>
                  <Ionicons name="location" size={15} color={colors.textOnPrimary} />
                  <Text style={styles.locationBtnText}>Enable location</Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  const isRateLimitError = error?.includes('Please wait');

  if (error && !envData && !isRateLimitError) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: colors.stone }]} />
            <View>
              <Text style={[styles.headerLabel, { color: colors.textMuted }]}>Live Conditions</Text>
              <Text style={styles.locationText}>{locationLabel}</Text>
            </View>
          </View>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.7 }]}
            onPress={() => loadEnv(latitude!, longitude!, { units, forceRefresh: true })}
          >
            <Text style={styles.retryBtnText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (isLoading && !envData) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.statusDot} />
            <View>
              <Text style={styles.headerLabel}>Live Conditions</Text>
              <Text style={styles.locationText}>{locationLabel}</Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading conditions…</Text>
        </View>
      </View>
    );
  }

  const env = envData as EnvironmentData | null;
  const w = env?.weather;
  const moon = env?.moon;

  const fetchedAt = env?.fetched_at ? new Date(env.fetched_at).getTime() : 0;
  const ageMs = fetchedAt ? Math.max(0, nowMs - fetchedAt) : 0;
  const isStale = ageMs > CACHE_TTL_MS;
  const staleMinutes = Math.floor(ageMs / 60000);
  const ageLabel = fetchedAt ? `${staleMinutes}m ago` : null;

  const showErrorBanner = error && (isRateLimitError || env);
  const pressureTrend = w?.pressure_trend ? pressureTrendInfo(w.pressure_trend) : null;
  const airTile = w ? airTempTileContent(w) : { value: '—', label: 'Temp' };

  const cardContent = (
    <>
      {showErrorBanner && (
        <View style={[styles.banner, !isRateLimitError && styles.errorBanner]}>
          <Text style={styles.bannerText}>{error}</Text>
          {!isRateLimitError && env && (
            <Pressable
              style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.7 }]}
              onPress={() => loadEnv(latitude!, longitude!, { units, forceRefresh: true })}
            >
              <Text style={styles.retryBtnText}>Try Again</Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.statusDot} />
          <View>
            <Text style={styles.headerLabel}>Live Conditions</Text>
            <Text style={styles.locationText}>{locationLabel}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {isLoading && <Text style={styles.updatingText}>Updating…</Text>}
          {ageLabel && !isLoading && (
            <Text style={[styles.ageText, isStale && { color: colors.textSecondary }]}>{ageLabel}</Text>
          )}
          <Pressable
            hitSlop={12}
            style={({ pressed }) => [
              styles.refreshBtn,
              pressed && styles.refreshBtnPressed,
              isLoading && { opacity: 0.5 },
            ]}
            disabled={isLoading}
            onPress={() => {
              loadEnv(latitude!, longitude!, { units, forceRefresh: true });
              onRefresh?.();
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="refresh-outline" size={15} color={colors.primary} />
            )}
          </Pressable>
        </View>
      </View>

      {/* Conditions Grid */}
      <View style={styles.grid}>
        <View style={styles.gridTile}>
          <Ionicons name="thermometer-outline" size={16} color={colors.primary} />
          <Text style={styles.gridValue} numberOfLines={1}>
            {airTile.value}
          </Text>
          <Text style={styles.gridLabel}>{airTile.label}</Text>
        </View>
        <View style={styles.gridTile}>
          <Ionicons name="cloud-outline" size={16} color={colors.primary} />
          <Text style={styles.gridValue} numberOfLines={1}>
            {w ? cloudLabel(w.cloud_cover) : '—'}
          </Text>
          <Text style={styles.gridLabel}>Sky</Text>
        </View>
        <View style={styles.gridTile}>
          <Ionicons name="flag-outline" size={16} color={colors.primary} />
          <Text style={styles.gridValue} numberOfLines={1}>
            {w ? `${windDirectionLabel(w.wind_direction)} ${Math.round(w.wind_speed)}` : '—'}
          </Text>
          <Text style={styles.gridLabel}>Wind</Text>
        </View>
        <View style={styles.gridTile}>
          <Ionicons name="speedometer-outline" size={16} color={colors.primary} />
          <Text style={styles.gridValue} numberOfLines={1}>
            {w ? String(w.pressure) : '—'}
          </Text>
          {pressureTrend ? (
            <Text style={[styles.gridLabel, { color: pressureTrend.color }]} numberOfLines={1}>
              {pressureTrend.label}
            </Text>
          ) : (
            <Text style={styles.gridLabel}>Press.</Text>
          )}
        </View>
      </View>

      {/* Footer Pills */}
      <View style={styles.footer}>
        <View style={styles.footerPill}>
          <Ionicons name="moon-outline" size={11} color={colors.textSecondary} />
          <Text style={styles.footerPillText}>
            {moonPhaseLabel(moon?.phase, moon?.illumination)}
          </Text>
        </View>
        <View style={styles.footerPill}>
          <Ionicons name="water-outline" size={11} color={colors.textSecondary} />
          <Text style={styles.footerPillText}>
            {w?.humidity != null ? `${Math.round(w.humidity)}%` : '—'}
          </Text>
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        {cardContent}
      </Pressable>
    );
  }

  return <View style={styles.card}>{cardContent}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardPressed: {
    backgroundColor: colors.surfacePressed,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  locationText: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  updatingText: { fontSize: 11, color: colors.primary, fontWeight: '500' },
  ageText: { fontSize: 10, color: colors.textMuted },

  /* Refresh */
  refreshBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryMist,
  },
  refreshBtnPressed: { backgroundColor: colors.primaryLight },

  /* Grid */
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gridTile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 4,
    gap: 3,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  gridLabel: { fontSize: 10, color: colors.textMuted, letterSpacing: 0.2 },

  /* Footer */
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm + 2,
  },
  footerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
  },
  footerPillText: { fontSize: 11, color: colors.textSecondary },

  /* Empty / No location */
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm + 2,
  },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  locationBtnPressed: { backgroundColor: colors.primaryDark },
  locationBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },

  /* Loading */
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  loadingText: { fontSize: 13, color: colors.textMuted },

  /* Error */
  errorBox: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  errorText: { fontSize: 13, color: colors.textMuted },
  retryBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    backgroundColor: colors.primaryMist,
    borderRadius: radius.sm,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  /* Banners */
  banner: {
    backgroundColor: colors.warmTan,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  errorBanner: {
    backgroundColor: colors.surfacePressed,
    gap: spacing.xs,
  },
  bannerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
