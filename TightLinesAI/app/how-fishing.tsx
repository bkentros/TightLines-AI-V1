import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius, shadows } from '../lib/theme';
import { getEnvironment, fetchFreshEnvironment } from '../lib/env';
import { invokeEdgeFunction, getValidAccessToken } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import {
  getCachedHowFishingRebuild,
  setCachedHowFishingRebuild,
  setCurrentHowFishingRebuild,
  type HowFishingRebuildBundle,
  type EngineContextKey,
} from '../lib/howFishing';
import { useEnvStore } from '../store/envStore';
import type { EnvironmentData } from '../lib/env/types';
import { isCoastalContextEligible } from '../lib/coastalProximity';
import { CondensedLoadingView } from '../components/fishing/CondensedLoadingView';
import { RebuildReportView } from '../components/fishing/RebuildReportView';

function currentLocationDateString(timezone?: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date());
  } catch {
    return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

function formatGeneratedTime(iso: string, timezone?: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}

function windDirectionLabel(deg?: number | null): string | null {
  if (typeof deg !== 'number' || Number.isNaN(deg)) return null;
  const cards = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? null;
}

const CONTEXT_OPTIONS: { key: EngineContextKey; label: string; icon: string; color: string; description: string }[] = [
  { key: 'freshwater_lake_pond', label: 'Lake / Pond', icon: 'water', color: colors.contextFreshwater, description: 'Still freshwater' },
  { key: 'freshwater_river', label: 'River / Stream', icon: 'git-merge-outline', color: colors.contextRiver, description: 'Moving freshwater' },
  { key: 'coastal', label: 'Coastal', icon: 'boat-outline', color: colors.contextCoastal, description: 'Salt & brackish' },
];

export default function HowFishingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lat?: string; lon?: string }>();
  const lat = params.lat != null ? parseFloat(params.lat) : NaN;
  const lon = params.lon != null ? parseFloat(params.lon) : NaN;
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lon);

  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';
  const setLastReportEnv = useEnvStore((s) => s.setLastReportEnv);

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState<string>('Current location');

  const coastalEligible = useMemo(() => isCoastalContextEligible(lat, lon), [lat, lon]);
  const contextChoices = useMemo(
    () => CONTEXT_OPTIONS.filter((o) => o.key !== 'coastal' || coastalEligible),
    [coastalEligible]
  );

  const [engineContext, setEngineContext] = useState<EngineContextKey | null>(null);

  const [rebuildBundle, setRebuildBundle] = useState<HowFishingRebuildBundle | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (engineContext === null && contextChoices.length > 0) {
      setEngineContext(contextChoices[0]!.key);
    }
  }, [engineContext, contextChoices]);

  useEffect(() => {
    if (!hasCoords) return;
    let cancelled = false;
    (async () => {
      setEnvLoading(true);
      try {
        const [cachedEnv, geo] = await Promise.all([
          getEnvironment({ latitude: lat, longitude: lon, units }),
          Location.reverseGeocodeAsync({ latitude: lat, longitude: lon }).catch(() => []),
        ]);
        if (cancelled) return;
        setEnv(cachedEnv);
        if (geo?.[0]) {
          const g = geo[0];
          const city = g.city ?? g.subregion ?? g.district;
          const region = g.region ?? '';
          setLocationLabel(city && region ? `${city}, ${region}` : city ?? region ?? 'Current location');
        }
      } catch {
        if (!cancelled) setAnalysisError('Unable to load live conditions.');
      } finally {
        if (!cancelled) setEnvLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hasCoords, lat, lon, units]);

  const generateReport = useCallback(async () => {
    if (!hasCoords || !engineContext) return;
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      const accessToken = await getValidAccessToken();
      const freshEnv = await fetchFreshEnvironment({ latitude: lat, longitude: lon, units });
      setEnv(freshEnv);

      const cached = await getCachedHowFishingRebuild(lat, lon, engineContext);
      if (cached) {
        setRebuildBundle(cached);
        setCurrentHowFishingRebuild(lat, lon, cached);
        setLastReportEnv(freshEnv);
        setAnalysisLoading(false);
        return;
      }

      const result = await invokeEdgeFunction<
        HowFishingRebuildBundle | { error: string; message?: string }
      >('how-fishing', {
        accessToken,
        body: {
          latitude: lat,
          longitude: lon,
          units,
          engine_context: engineContext,
          env_data: freshEnv,
        },
      });

      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error((result as { message?: string }).message ?? (result as { error: string }).error);
      }

      const bundle = result as HowFishingRebuildBundle;
      if (!bundle || bundle.feature !== 'hows_fishing_rebuild_v1' || !bundle.report) {
        throw new Error('Invalid response from server');
      }

      await setCachedHowFishingRebuild(lat, lon, bundle);
      setCurrentHowFishingRebuild(lat, lon, bundle);
      setLastReportEnv(freshEnv);
      setRebuildBundle(bundle);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setAnalysisError(msg);
      Alert.alert('Unable to generate report', msg);
    } finally {
      setAnalysisLoading(false);
    }
  }, [hasCoords, engineContext, lat, lon, units, setLastReportEnv]);

  const handleRefresh = useCallback(async () => {
    if (!engineContext) return;
    setRefreshing(true);
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.removeItem(
        `how_fishing_rebuild_${lat.toFixed(3)}_${lon.toFixed(3)}_${engineContext}`
      );
    } catch { /* ignore */ }
    setRebuildBundle(null);
    await generateReport();
    setRefreshing(false);
  }, [generateReport, engineContext, lat, lon]);

  const activeTz = rebuildBundle?.report.location.timezone ?? env?.timezone;
  const topMeta = rebuildBundle
    ? `${locationLabel}  •  ${currentLocationDateString(activeTz)}  •  ${formatGeneratedTime(rebuildBundle.generated_at, activeTz)}`
    : locationLabel;

  // ─── No coords ───
  if (!hasCoords) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <View style={styles.noLocationIcon}>
            <Ionicons name="location-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.messageTitle}>Location Required</Text>
          <Text style={styles.messageSub}>
            How's Fishing needs your location to pull live conditions and generate your report.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Preflight — context selection ───
  if (!rebuildBundle) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable style={styles.navBack} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={colors.primary} />
          </Pressable>
          <Text style={styles.heading}>How's Fishing</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.preflightContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Location & Date */}
          <View style={styles.preflightHeader}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.preflightLocation}>{locationLabel}</Text>
          </View>

          {/* Live Conditions */}
          <View style={styles.conditionsCard}>
            <CondensedLoadingView
              conditions={
                env
                  ? {
                      air_temp_f: env.weather?.temperature ?? null,
                      wind_speed_mph: env.weather?.wind_speed ?? null,
                      wind_direction: windDirectionLabel(env.weather?.wind_direction),
                      pressure_mb: env.weather?.pressure ?? null,
                      pressure_state: env.weather?.pressure_trend ?? null,
                      cloud_cover_pct: env.weather?.cloud_cover ?? null,
                      moon_phase: env.moon?.phase ?? null,
                      moon_illumination_pct: env.moon?.illumination ?? null,
                      tide_phase_state: engineContext === 'coastal' ? (env.tides?.phase ?? null) : null,
                      solunar_state: null,
                    }
                  : null
              }
              statusText={analysisLoading ? 'Generating…' : 'Live conditions'}
            />
          </View>

          {/* Context Selection */}
          <View style={styles.contextCard}>
            <Text style={styles.contextCardTitle}>Where are you fishing?</Text>
            <View style={styles.contextGrid}>
              {contextChoices.map((o) => {
                const isActive = engineContext === o.key;
                return (
                  <Pressable
                    key={o.key}
                    style={[
                      styles.contextOption,
                      isActive && styles.contextOptionActive,
                      isActive && { borderColor: o.color },
                    ]}
                    onPress={() => setEngineContext(o.key)}
                  >
                    <View style={[
                      styles.contextIconWrap,
                      { backgroundColor: isActive ? o.color + '18' : colors.backgroundAlt },
                    ]}>
                      <Ionicons
                        name={o.icon as any}
                        size={20}
                        color={isActive ? o.color : colors.textMuted}
                      />
                    </View>
                    <Text style={[
                      styles.contextLabel,
                      isActive && { color: o.color, fontWeight: '700' },
                    ]}>
                      {o.label}
                    </Text>
                    <Text style={styles.contextDesc}>{o.description}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Generate Button */}
          <Pressable
            style={({ pressed }) => [
              styles.generateBtn,
              pressed && styles.generateBtnPressed,
              (!engineContext || analysisLoading || envLoading) && { opacity: 0.5 },
            ]}
            onPress={() => generateReport()}
            disabled={!engineContext || analysisLoading || envLoading}
          >
            {analysisLoading ? (
              <ActivityIndicator size="small" color={colors.textOnPrimary} />
            ) : (
              <>
                <Ionicons name="sparkles" size={16} color={colors.textOnPrimary} />
                <Text style={styles.generateBtnText}>Generate today's report</Text>
              </>
            )}
          </Pressable>

          {analysisError ? <Text style={styles.errorInline}>{analysisError}</Text> : null}
        </ScrollView>

        {/* Loading Overlay */}
        {analysisLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <View style={styles.loadingPulse}>
                <Ionicons name="fish-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.loadingTitle}>Building your report</Text>
              <Text style={styles.loadingSub}>Analyzing conditions and generating insights…</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ─── Report View ───
  const activeContext = contextChoices.find((o) => o.key === rebuildBundle.engine_context);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable style={styles.navBack} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.primary} />
        </Pressable>
        <Text style={styles.heading}>How's Fishing</Text>
        <Pressable
          style={({ pressed }) => [styles.newReportBtn, pressed && { opacity: 0.7 }]}
          onPress={() => setRebuildBundle(null)}
        >
          <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.newReportText}>New</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.reportContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Meta */}
        <Text style={styles.reportMeta}>{topMeta}</Text>

        {/* Context Pill */}
        {activeContext && (
          <View style={[styles.contextPill, { backgroundColor: activeContext.color + '14' }]}>
            <Ionicons name={activeContext.icon as any} size={13} color={activeContext.color} />
            <Text style={[styles.contextPillText, { color: activeContext.color }]}>
              {rebuildBundle.report.display_context_label}
            </Text>
          </View>
        )}

        <RebuildReportView report={rebuildBundle.report} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  preflightContent: { paddingHorizontal: 20, paddingBottom: spacing.xl, paddingTop: spacing.xs },
  reportContent: { paddingHorizontal: 20, paddingBottom: spacing.xl, paddingTop: spacing.xs },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  navBack: { padding: 4 },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  newReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  newReportText: { fontSize: 14, fontWeight: '600', color: colors.primary },

  /* Preflight */
  preflightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  preflightLocation: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },

  conditionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },

  /* Context Selection */
  contextCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md + 2,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  contextCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  contextGrid: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  contextOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs + 2,
  },
  contextOptionActive: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    ...shadows.sm,
  },
  contextIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  contextLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  contextDesc: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },

  /* Generate Button */
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 52,
    ...shadows.md,
  },
  generateBtnPressed: { backgroundColor: colors.primaryDark },
  generateBtnText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  /* Report Meta */
  reportMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  contextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'center',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  contextPillText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* No coords */
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  noLocationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  messageTitle: {
    fontSize: 22,
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
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  primaryBtnPressed: { backgroundColor: colors.primaryDark },
  primaryBtnText: { color: colors.textOnPrimary, fontSize: 15, fontWeight: '700' },

  errorInline: { color: '#C64545', textAlign: 'center', marginTop: spacing.sm },

  /* Loading Overlay */
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background + 'E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm + 2,
    ...shadows.xl,
  },
  loadingPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '30',
    marginBottom: spacing.xs,
  },
  loadingTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  loadingSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
