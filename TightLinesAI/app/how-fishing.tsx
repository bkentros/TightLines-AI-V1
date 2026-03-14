/**
 * How's Fishing — Unified Screen (Phase 2 Redesign)
 *
 * Auto-runs analysis on mount. Shows condensed conditions as loading state,
 * then transitions to full results inline. No separate results screen.
 *
 * Flow: Home -> tap button -> this screen (auto-run) -> results inline
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Animated,
  Easing,
  RefreshControl,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius } from '../lib/theme';
import { getEnvironment, fetchFreshEnvironment } from '../lib/env';
import { invokeEdgeFunction, getValidAccessToken } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import {
  getCachedHowFishingBundle,
  setCachedHowFishingBundle,
  setCurrentHowFishingBundle,
  getCurrentHowFishingBundle,
  type HowFishingBundle,
  type WaterTypeReport,
} from '../lib/howFishing';
import { useEnvStore } from '../store/envStore';
import { useForecastStore } from '../store/forecastStore';
import type { EnvironmentData } from '../lib/env/types';
import {
  ReportView,
  WaterTypeTabBar,
  TAB_LABELS,
  WeeklyForecastStrip,
  CondensedLoadingView,
} from '../components/fishing';

// =============================================================================
// Helpers
// =============================================================================

function windDirLabel(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  const idx = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return dirs[idx] ?? '';
}

// =============================================================================
// Main Screen
// =============================================================================

export default function HowFishingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lat?: string; lon?: string }>();
  const lat = params.lat != null ? parseFloat(params.lat) : NaN;
  const lon = params.lon != null ? parseFloat(params.lon) : NaN;
  const hasCoords =
    !isNaN(lat) && lat >= -90 && lat <= 90 && !isNaN(lon) && lon >= -180 && lon <= 180;

  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);

  const [bundle, setBundle] = useState<HowFishingBundle | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('freshwater');
  const [freshwaterSubtype, setFreshwaterSubtype] = useState<'lake' | 'river_stream' | 'reservoir'>('lake');

  const setLastReportEnv = useEnvStore((s) => s.setLastReportEnv);
  const { forecast, isLoading: forecastLoading, loadForecast } = useForecastStore();

  // Fade animation for results transition
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasAutoRun = useRef(false);

  // ---------------------------------------------------------------------------
  // Phase detection: loading (conditions) vs results
  // ---------------------------------------------------------------------------

  const showResults = bundle !== null;
  const showLoading = !showResults && (envLoading || analysisLoading);

  // ---------------------------------------------------------------------------
  // Auto-run on mount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!hasCoords || hasAutoRun.current) return;
    hasAutoRun.current = true;

    let cancelled = false;

    (async () => {
      // 1. Load cached env for quick display
      setEnvLoading(true);
      try {
        const cachedEnv = await getEnvironment({ latitude: lat, longitude: lon, units });
        if (!cancelled) setEnv(cachedEnv);
      } catch {
        // Non-fatal — we'll show loading anyway
      }
      if (!cancelled) setEnvLoading(false);

      // 2. Check bundle cache first
      const cachedBundle = await getCachedHowFishingBundle(lat, lon);
      if (!cancelled && cachedBundle) {
        setBundle(cachedBundle);
        setActiveTab(cachedBundle.default_tab ?? 'freshwater');
        // Fade in results
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
        // Also load forecast in background
        try {
          const envForForecast = await getEnvironment({ latitude: lat, longitude: lon, units });
          loadForecast(lat, lon, envForForecast);
        } catch { /* non-fatal */ }
        return;
      }

      // 3. No cache — run full analysis
      if (!cancelled) {
        await runAnalysis(cancelled);
      }
    })();

    return () => { cancelled = true; };
  }, [hasCoords, lat, lon]);

  // ---------------------------------------------------------------------------
  // Analysis runner
  // ---------------------------------------------------------------------------

  const runAnalysis = useCallback(async (cancelled = false) => {
    if (!hasCoords) return;
    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const accessToken = await getValidAccessToken();

      // Force-fetch fresh environment
      const freshEnv = await fetchFreshEnvironment({ latitude: lat, longitude: lon, units });
      if (cancelled) return;
      setEnv(freshEnv);

      const data = await invokeEdgeFunction<HowFishingBundle | { error: string; message?: string }>(
        'how-fishing',
        {
          accessToken,
          body: {
            latitude: lat,
            longitude: lon,
            units,
            freshwater_subtype: freshwaterSubtype,
            env_data: freshEnv,
          },
        }
      );

      if (cancelled) return;

      // Handle error responses
      const errObj =
        data && typeof data === 'object' && 'error' in data
          ? (data as { error: string; message?: string })
          : null;
      if (errObj?.error === 'usage_cap_exceeded') {
        Alert.alert('Usage limit reached', errObj.message ?? 'Upgrade or wait for next billing period.');
        setAnalysisLoading(false);
        return;
      }
      if (errObj?.error === 'subscription_required') {
        Alert.alert('Subscription required', errObj.message ?? 'Subscribe to use this feature.');
        setAnalysisLoading(false);
        return;
      }

      const result = data as HowFishingBundle;
      if (!result || typeof result !== 'object' || result.feature !== 'hows_fishing_feature_v1') {
        throw new Error('Invalid response format');
      }

      // Cache and display
      await setCachedHowFishingBundle(lat, lon, result);
      setCurrentHowFishingBundle(lat, lon, result);
      setLastReportEnv(freshEnv);
      setBundle(result);
      setActiveTab(result.default_tab ?? 'freshwater');

      // Fade in results
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // Load forecast in background
      loadForecast(lat, lon, freshEnv);
    } catch (err) {
      if (cancelled) return;
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setAnalysisError(msg);
    } finally {
      setAnalysisLoading(false);
    }
  }, [hasCoords, lat, lon, units, freshwaterSubtype, setLastReportEnv, loadForecast, fadeAnim]);

  // ---------------------------------------------------------------------------
  // Pull-to-refresh
  // ---------------------------------------------------------------------------

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setBundle(null);
    fadeAnim.setValue(0);
    hasAutoRun.current = false;
    await runAnalysis();
    setRefreshing(false);
  }, [runAnalysis]);

  // ---------------------------------------------------------------------------
  // Forecast day press handler
  // ---------------------------------------------------------------------------

  const handleForecastDayPress = useCallback((date: string, index: number) => {
    if (index === 0) return; // Today is already shown
    const day = forecast?.forecast_days?.[index];
    if (!day) return;

    Alert.alert(
      `${getDayLabel(date, index)} \u2014 Score: ${day.daily_score}`,
      `${day.summary_line}\n\nHigh: ${Math.round(day.high_temp_f)}\u00B0F  Low: ${Math.round(day.low_temp_f)}\u00B0F\nWind: ${day.wind_mph_avg} mph  Rain: ${day.precip_chance_pct}%`,
      [
        { text: 'OK', style: 'cancel' },
        // Future: "Get Full Analysis" button here
      ]
    );
  }, [forecast]);

  // =========================================================================
  // No location state
  // =========================================================================

  if (!hasCoords) {
    const handleEnableLocation = async () => {
      const { status: existing } = await Location.getForegroundPermissionsAsync();
      if (existing === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          router.replace({ pathname: '/how-fishing', params: { lat: String(loc.coords.latitude), lon: String(loc.coords.longitude) } });
        } catch {
          Alert.alert('Location error', 'Could not get your location. Please try again.');
        }
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          router.replace({ pathname: '/how-fishing', params: { lat: String(loc.coords.latitude), lon: String(loc.coords.longitude) } });
        } catch {
          Alert.alert('Location error', 'Could not get your location. Please try again.');
        }
      } else {
        Alert.alert(
          'Location permission denied',
          'Location is required for this feature. Enable it in Settings \u2192 TightLines AI \u2192 Location.',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
    };

    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={52} color={colors.sage} />
          <Text style={styles.messageText}>Location needed</Text>
          <Text style={styles.messageSub}>
            How's Fishing requires your GPS location to pull current conditions.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.enableBtn, pressed && styles.enableBtnPressed]}
            onPress={handleEnableLocation}
          >
            <Ionicons name="locate" size={18} color={colors.textLight} />
            <Text style={styles.enableBtnText}>Enable Location</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // Loading state — condensed conditions + animation
  // =========================================================================

  if (showLoading && !showResults) {
    // Build conditions data from env for the condensed view
    const conditionsData = env ? {
      air_temp_f: env.weather?.temperature ?? null,
      wind_speed_mph: env.weather?.wind_speed ?? null,
      wind_direction: env.weather?.wind_direction != null
        ? windDirLabel(env.weather.wind_direction) : null,
      pressure_mb: env.weather?.pressure ?? null,
      pressure_state: env.weather?.pressure_trend ?? null,
      cloud_cover_pct: env.weather?.cloud_cover ?? null,
      moon_phase: env.moon?.phase ?? null,
      moon_illumination_pct: env.moon?.illumination != null ? env.moon.illumination * 100 : null,
      light_condition: null, // derived by engine, not in raw env
      tide_phase_state: null, // derived by engine
      solunar_state: null, // derived by engine
    } : null;

    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.navBack, pressed && { opacity: 0.45 }]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.heading}>How's Fishing?</Text>
        </View>

        <CondensedLoadingView
          conditions={conditionsData}
          statusText={analysisLoading ? 'Analyzing conditions...' : 'Loading conditions...'}
        />
      </SafeAreaView>
    );
  }

  // =========================================================================
  // Error state (analysis failed, no bundle)
  // =========================================================================

  if (analysisError && !bundle) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.navBack, pressed && { opacity: 0.45 }]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.heading}>How's Fishing?</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorBody}>{analysisError}</Text>
          <Pressable
            style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.7 }]}
            onPress={() => {
              setAnalysisError(null);
              hasAutoRun.current = false;
              runAnalysis();
            }}
          >
            <Ionicons name="refresh" size={18} color={colors.textLight} />
            <Text style={styles.retryBtnText}>Try Again</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // Results state
  // =========================================================================

  if (!bundle || !bundle.reports) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={styles.errorTitle}>Report not available</Text>
          <Text style={styles.errorBody}>Please go back and try again.</Text>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isCoastal = bundle.mode === 'coastal_multi';
  const isInlandDual = bundle.mode === 'inland_dual';
  const availableTabs: string[] = isCoastal
    ? ['freshwater', 'saltwater', 'brackish']
    : isInlandDual
      ? ['freshwater_lake', 'freshwater_river']
      : ['freshwater'];

  const activeReport = (bundle.reports as Record<string, WaterTypeReport | undefined>)[activeTab];

  const generatedAt = bundle.generated_at
    ? new Date(bundle.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.sage}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Pressable
              style={({ pressed }) => [styles.backBtnInline, pressed && { opacity: 0.7 }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color={colors.sage} />
              <Text style={styles.backBtnInlineText}>Back</Text>
            </Pressable>
            {generatedAt && (
              <Text style={styles.generatedAt}>Generated {generatedAt}</Text>
            )}
          </View>

          <Text style={styles.screenTitle}>How's Fishing?</Text>

          {/* Tab Bar */}
          {(isCoastal || isInlandDual) && (
            <WaterTypeTabBar
              tabs={availableTabs}
              active={activeTab}
              onPress={setActiveTab}
              failed={bundle.failed_reports ?? []}
            />
          )}

          {/* Weekly Forecast Strip */}
          {forecast?.forecast_days && forecast.forecast_days.length > 0 && (
            <WeeklyForecastStrip
              forecastDays={forecast.forecast_days}
              onDayPress={handleForecastDayPress}
              isLoading={forecastLoading}
            />
          )}
          {!forecast && forecastLoading && (
            <WeeklyForecastStrip
              forecastDays={[]}
              onDayPress={() => {}}
              isLoading={true}
            />
          )}

          {/* Active Report */}
          {activeReport ? (
            <ReportView report={activeReport} />
          ) : (
            <View style={styles.errorState}>
              <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />
              <Text style={styles.errorTitle}>Report unavailable</Text>
              <Text style={styles.errorBody}>
                The {(TAB_LABELS[activeTab] ?? activeTab).toLowerCase()} report could not be generated.
              </Text>
            </View>
          )}

          {/* Recommender CTA */}
          <Pressable
            style={({ pressed }) => [styles.recommenderCta, pressed && { opacity: 0.75 }]}
            onPress={() => router.push('/recommender')}
          >
            <Ionicons name="fish-outline" size={18} color={colors.sage} />
            <Text style={styles.recommenderCtaText}>
              Want species-specific lure recommendations? \u2192 Open Recommender
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.sage} />
          </Pressable>

          {/* Footer */}
          <Text style={styles.disclaimer}>
            Pull down to refresh. Powered by live weather, moon phase, solunar windows, and tides.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function getDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  try {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return `Day ${index + 1}`;
  }
}

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  topBar: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.background,
  },
  navBack: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 3,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtnInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnInlineText: { fontSize: 15, color: colors.sage, fontWeight: '600' },
  generatedAt: { fontSize: 12, color: colors.textMuted },

  screenTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },

  recommenderCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.sage + '40',
  },
  recommenderCtaText: { fontSize: 14, color: colors.text, flex: 1 },

  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  messageText: {
    fontSize: 20,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  messageSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },

  errorState: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center' },
  errorBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    alignSelf: 'center',
  },
  backBtnPressed: { opacity: 0.6 },
  backBtnText: { fontSize: 15, fontWeight: '600', color: colors.sage },

  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.sage,
    borderRadius: radius.lg,
    minWidth: 180,
  },
  retryBtnText: { fontSize: 16, fontWeight: '700', color: colors.textLight },

  enableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.sage,
    borderRadius: radius.lg,
    minWidth: 220,
    shadowColor: colors.sageDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  enableBtnPressed: { backgroundColor: colors.sageDark, shadowOpacity: 0.1 },
  enableBtnText: { fontSize: 16, fontWeight: '700', color: colors.textLight },
});
