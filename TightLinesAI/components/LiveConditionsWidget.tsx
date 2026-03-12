/**
 * Live Conditions Widget — Dashboard environmental data display
 *
 * Shows weather, tides, moon, and sun from the get-environment Edge Function.
 * Requires coordinates from parent; displays placeholder or message when no location.
 *
 * @see docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../lib/theme';
import { useEnvStore } from '../store/envStore';
import { useAuthStore } from '../store/authStore';
import type { EnvironmentData } from '../lib/env';
import { CACHE_TTL_MS } from '../lib/env/constants';

/** Convert wind direction degrees to cardinal (e.g. 170 → "S") */
function windDirectionLabel(deg: number): string {
  const cards = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? '—';
}

/**
 * Derive moon phase from illumination (0-1) when API returns Unknown.
 * Note: USNO can return "Unknown" intermittently; when it does, we fall back to
 * illumination thresholds. A sudden phase change (e.g. New Moon → Waning Gibbous)
 * can occur if the API toggles between returning a phase and "Unknown", or if
 * timezone/date affects which day's data is fetched.
 */
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

/** Map cloud cover % to short label — simple words that fit in the box */
function cloudLabel(pct: number): string {
  if (pct <= 15) return 'Clear';
  if (pct <= 35) return 'Partly';
  if (pct <= 65) return 'Cloudy';
  return 'Overcast';
}

/** Short pressure trend label + color for the dashboard tile */
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
  /** Coordinates — when set, loads env data */
  latitude?: number | null;
  longitude?: number | null;
  /** Location label for display (e.g. "Tampa Bay, FL") */
  locationLabel?: string;
  /** Called when refresh button is pressed */
  onRefresh?: () => void;
  /** Called when user taps "Enable location" or "Sync location" — parent should request permission and fetch GPS */
  onRequestLocation?: () => Promise<void>;
  /** Called when the user taps the card to open the expanded conditions page */
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
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestLocation = async () => {
    if (!onRequestLocation) return;
    setLocationSyncing(true);
    try {
      await onRequestLocation();
    } catch {
      Alert.alert(
        'Could not get location',
        'Please enable location in Settings or check your connection.'
      );
    } finally {
      setLocationSyncing(false);
    }
  };

  if (!hasCoords) {
    return (
      <View style={styles.condCard}>
        <View style={styles.condHeader}>
          <View style={styles.condHeaderLeft}>
            <View style={[styles.liveDot, { backgroundColor: colors.stone }]} />
            <Text style={[styles.condLabel, { color: colors.textMuted }]}>Live Conditions</Text>
          </View>
        </View>
        <View style={styles.noLocation}>
          <Ionicons name="location-outline" size={24} color={colors.textMuted} />
          <Text style={styles.noLocationText}>
            Sync location to see weather, tides, and moon conditions.
          </Text>
          {onRequestLocation && (
            <Pressable
              style={({ pressed }) => [
                styles.syncLocationBtn,
                pressed && styles.syncLocationBtnPressed,
                locationSyncing && styles.syncLocationBtnDisabled,
              ]}
              onPress={handleRequestLocation}
              disabled={locationSyncing}
            >
              {locationSyncing ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <>
                  <Ionicons name="location" size={16} color={colors.textLight} />
                  <Text style={styles.syncLocationBtnText}>Enable location</Text>
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
      <View style={styles.condCard}>
        <View style={styles.condHeader}>
          <View style={styles.condHeaderLeft}>
            <View style={[styles.liveDot, { backgroundColor: colors.stone }]} />
            <View>
              <Text style={[styles.condLabel, { color: colors.textMuted }]}>Live Conditions</Text>
              <Text style={styles.condLocation}>{locationLabel}</Text>
            </View>
          </View>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
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
      <View style={styles.condCard}>
        <View style={styles.condHeader}>
          <View style={styles.condHeaderLeft}>
            <View style={styles.liveDot} />
            <View>
              <Text style={styles.condLabel}>Live Conditions</Text>
              <Text style={styles.condLocation}>{locationLabel}</Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={colors.sage} />
          <Text style={styles.loadingText}>Loading conditions…</Text>
        </View>
      </View>
    );
  }

  const env = envData as EnvironmentData | null;
  const w = env?.weather;
  const t = env?.tides;
  const moon = env?.moon;

  const fetchedAt = env?.fetched_at ? new Date(env.fetched_at).getTime() : 0;
  const ageMs = fetchedAt ? Math.max(0, nowMs - fetchedAt) : 0;
  const isStale = ageMs > CACHE_TTL_MS;
  const staleMinutes = Math.floor(ageMs / 60000);
  const ageLabel = fetchedAt ? `As of ${staleMinutes} min ago` : null;

  const showErrorBanner = error && (isRateLimitError || env);
  const pressureTrend = w?.pressure_trend ? pressureTrendInfo(w.pressure_trend) : null;

  const cardContent = (
    <>
      {showErrorBanner && (
        <View style={[styles.rateLimitBanner, !isRateLimitError && styles.errorBanner]}>
          <Text style={styles.rateLimitText}>{error}</Text>
          {!isRateLimitError && env && (
            <Pressable
              style={({ pressed }) => [styles.retryBtn, pressed && styles.retryBtnPressed]}
              onPress={() => loadEnv(latitude!, longitude!, { units, forceRefresh: true })}
            >
              <Text style={styles.retryBtnText}>Try Again</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* ── Header row: label + dot on left, refresh icon on right ── */}
      <View style={styles.condHeader}>
        <View style={styles.condHeaderLeft}>
          <View style={styles.liveDot} />
          <View>
            <Text style={styles.condLabel}>Live Conditions</Text>
            <Text style={styles.condLocation}>{locationLabel}</Text>
          </View>
        </View>
        <View style={styles.condHeaderRight}>
          {isLoading && (
            <Text style={styles.updatingText}>Updating…</Text>
          )}
          <Pressable
            hitSlop={12}
            style={({ pressed }) => [
              styles.refreshBtn,
              pressed && styles.refreshBtnPressed,
              isLoading && styles.refreshBtnDisabled,
            ]}
            disabled={isLoading}
            onPress={() => {
              loadEnv(latitude!, longitude!, { units, forceRefresh: true });
              onRefresh?.();
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.sage} />
            ) : (
              <Ionicons name="refresh-outline" size={16} color={colors.sage} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.condGrid}>
        <View style={styles.condTile}>
          <Ionicons name="thermometer-outline" size={15} color={colors.stone} />
          <View style={styles.condValueBox}>
            <Text style={styles.condValue} numberOfLines={1}>
              {w ? `${Math.round(w.temperature)}${w.temp_unit}` : '—'}
            </Text>
          </View>
          <Text style={styles.condCaption}>Temp</Text>
        </View>
        <View style={styles.condTile}>
          <Ionicons name="cloud-outline" size={15} color={colors.stone} />
          <View style={styles.condValueBox}>
            <Text style={styles.condValue} numberOfLines={1}>
              {w ? cloudLabel(w.cloud_cover) : '—'}
            </Text>
          </View>
          <Text style={styles.condCaption}>Sky</Text>
        </View>
        <View style={styles.condTile}>
          <Ionicons name="flag-outline" size={15} color={colors.stone} />
          <View style={styles.condValueBox}>
            <Text style={styles.condValue} numberOfLines={1}>
              {w ? `${windDirectionLabel(w.wind_direction)} ${Math.round(w.wind_speed)}` : '—'}
            </Text>
          </View>
          <Text style={styles.condCaption}>Wind</Text>
        </View>
        <View style={styles.condTile}>
          <Ionicons name="trending-down" size={15} color={colors.stone} />
          <View style={styles.condValueBox}>
            <Text style={styles.condValue} numberOfLines={1}>
              {w ? String(w.pressure) : '—'}
            </Text>
          </View>
          {pressureTrend ? (
            <Text style={[styles.condCaption, { color: pressureTrend.color }]} numberOfLines={1}>
              {pressureTrend.label}
            </Text>
          ) : (
            <Text style={styles.condCaption}>Press.</Text>
          )}
        </View>
      </View>

      <View style={styles.condFooter}>
        <View style={styles.condPill}>
          <Ionicons name="moon-outline" size={11} color={colors.textSecondary} />
          <Text style={styles.condPillText}>
            {moonPhaseLabel(moon?.phase, moon?.illumination)}
          </Text>
        </View>
        <View style={styles.condPill}>
          <Ionicons name="water-outline" size={11} color={colors.textSecondary} />
          <Text style={styles.condPillText}>
            {t && t.high_low?.length
              ? `${t.high_low[0]?.type === 'H' ? 'High' : 'Low'} ${(t.high_low[0]?.time ?? '').split(' ')[1] ?? ''}`
              : '—'}
          </Text>
        </View>
        {ageLabel && (
          <Text style={[styles.staleLabel, isStale && styles.staleLabelExpired]}>
            {ageLabel}
          </Text>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.condCard, pressed && styles.condCardPressed]}
        onPress={onPress}
      >
        {cardContent}
      </Pressable>
    );
  }

  return (
    <View style={styles.condCard}>
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  condCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  condCardPressed: {
    backgroundColor: colors.surfacePressed,
  },
  condHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  condHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  condHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  updatingText: { fontSize: 11, color: colors.sage, fontWeight: '500' },
  refreshBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sageLight,
  },
  refreshBtnPressed: { backgroundColor: colors.sage + '50', opacity: 1 },
  refreshBtnDisabled: { opacity: 0.6 },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
  condLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sage,
    letterSpacing: 0.3,
  },
  condLocation: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  condGrid: { flexDirection: 'row', gap: spacing.sm },
  condTile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2,
    gap: 4,
  },
  condValueBox: {
    minHeight: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  condValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  condCaption: { fontSize: 10, color: colors.textMuted, letterSpacing: 0.3 },
  condFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  staleLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 'auto',
  },
  staleLabelExpired: {
    color: colors.textSecondary,
  },
  condPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
  },
  condPillText: { fontSize: 11, color: colors.textSecondary },
  noLocation: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  noLocationText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  syncLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.sage,
    borderRadius: radius.md,
  },
  syncLocationBtnPressed: { backgroundColor: colors.sageDark, opacity: 1 },
  syncLocationBtnDisabled: { opacity: 0.8 },
  syncLocationBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  loadingText: { fontSize: 13, color: colors.textMuted },
  errorBox: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.sageLight,
    borderRadius: radius.sm,
  },
  retryBtnPressed: { backgroundColor: colors.sage + '40' },
  rateLimitBanner: {
    backgroundColor: colors.warmTan,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  errorBanner: {
    backgroundColor: colors.surfacePressed,
    gap: spacing.xs,
  },
  rateLimitText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sage,
  },
});
