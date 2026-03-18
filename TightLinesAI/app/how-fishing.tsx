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
import { colors, fonts, spacing, radius } from '../lib/theme';
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

const CONTEXT_OPTIONS: { key: EngineContextKey; label: string }[] = [
  { key: 'freshwater_lake_pond', label: 'Freshwater Lake/Pond' },
  { key: 'freshwater_river', label: 'Freshwater River' },
  { key: 'coastal', label: 'Coastal' },
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
    return () => {
      cancelled = true;
    };
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
    } catch {
      /* ignore */
    }
    setRebuildBundle(null);
    await generateReport();
    setRefreshing(false);
  }, [generateReport, engineContext, lat, lon]);

  const activeTz = rebuildBundle?.report.location.timezone ?? env?.timezone;
  const topMeta = rebuildBundle
    ? `${locationLabel} • ${currentLocationDateString(activeTz)} • ${formatGeneratedTime(rebuildBundle.generated_at, activeTz)}`
    : locationLabel;

  if (!hasCoords) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={36} color={colors.textMuted} />
          <Text style={styles.messageText}>How's Fishing needs your location</Text>
          <Text style={styles.messageSub}>Enable location so TightLines can pull live conditions.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
            <Text style={styles.primaryBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!rebuildBundle) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable style={styles.navBack} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={colors.sage} />
          </Pressable>
          <Text style={styles.heading}>How's Fishing</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.preflightContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.preflightMeta}>{locationLabel}</Text>

          <View style={styles.preflightConditionsCard}>
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

          <View style={styles.setupCard}>
            <Text style={styles.setupCardTitle}>Where are you fishing?</Text>
            <View style={styles.segmentWrap}>
              {contextChoices.map((o) => (
                <Pressable
                  key={o.key}
                  style={[styles.segmentBtn, engineContext === o.key && styles.segmentBtnActive]}
                  onPress={() => setEngineContext(o.key)}
                >
                  <Text style={[styles.segmentText, engineContext === o.key && styles.segmentTextActive]}>
                    {o.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {engineContext === 'coastal' ? (
              <Text style={styles.setupHint}>
                Coastal uses air temperature only for conditions — no separate salt/brackish paths.
              </Text>
            ) : null}
          </View>

          <Pressable
            style={[styles.primaryBtn, (!engineContext || analysisLoading || envLoading) && { opacity: 0.6 }]}
            onPress={() => generateReport()}
            disabled={!engineContext || analysisLoading || envLoading}
          >
            {analysisLoading ? (
              <ActivityIndicator size="small" color={colors.textLight} />
            ) : (
              <Text style={styles.primaryBtnText}>Generate today's report</Text>
            )}
          </Pressable>

          {analysisError ? <Text style={styles.errorInline}>{analysisError}</Text> : null}
        </ScrollView>

        {analysisLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingOverlayCard}>
              <ActivityIndicator size="large" color={colors.sage} />
              <Text style={styles.loadingOverlayTitle}>Building report…</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable style={styles.navBack} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.sage} />
        </Pressable>
        <Text style={styles.heading}>How's Fishing</Text>
        <Pressable onPress={() => setRebuildBundle(null)}>
          <Text style={styles.newReport}>New</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.sage} />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.reportMeta}>{topMeta}</Text>
        <Text style={styles.contextPill}>{rebuildBundle.report.display_context_label}</Text>
        <RebuildReportView report={rebuildBundle.report} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, paddingTop: spacing.xs },
  preflightContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, paddingTop: spacing.xs },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: 2,
    paddingBottom: 6,
  },
  navBack: { padding: 4 },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  newReport: { fontSize: 15, fontWeight: '600', color: colors.sage },
  reportMeta: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs, textAlign: 'center' },
  contextPill: {
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: colors.sage,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  preflightMeta: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xs },
  preflightConditionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  setupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setupCardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  setupHint: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs, fontStyle: 'italic' },
  segmentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 3,
  },
  segmentBtn: { flexGrow: 1, minWidth: '30%', paddingVertical: 10, borderRadius: radius.sm, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: colors.sage },
  segmentText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  segmentTextActive: { color: colors.textLight },
  primaryBtn: {
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: spacing.sm,
  },
  primaryBtnText: { color: colors.textLight, fontSize: 15, fontWeight: '700' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  messageText: {
    fontSize: 22,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  messageSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  errorInline: { color: '#C64545', textAlign: 'center', marginTop: spacing.sm },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F0E8CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingOverlayTitle: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.text },
});
