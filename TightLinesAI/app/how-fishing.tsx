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
  getCachedMultiRebuild,
  setCachedMultiRebuild,
  setCurrentMultiRebuild,
  getCachedForecastRebuild,
  setCachedForecastRebuild,
  type HowFishingRebuildBundle,
  type HowFishingRebuildMultiBundle,
  type EngineContextKey,
} from '../lib/howFishing';
import { useEnvStore } from '../store/envStore';
import type { EnvironmentData } from '../lib/env/types';
import { isCoastalContextEligible } from '../lib/coastalProximity';
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

const TAB_CONFIG: { key: EngineContextKey; label: string; icon: string; color: string }[] = [
  { key: 'freshwater_lake_pond', label: 'Lake / Pond', icon: 'water', color: colors.contextFreshwater },
  { key: 'freshwater_river', label: 'River', icon: 'git-merge-outline', color: colors.contextRiver },
  { key: 'coastal', label: 'Coastal', icon: 'boat-outline', color: colors.contextCoastal },
];

export default function HowFishingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    day_offset?: string;
    target_date?: string;
  }>();
  const lat = params.lat != null ? parseFloat(params.lat) : NaN;
  const lon = params.lon != null ? parseFloat(params.lon) : NaN;
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lon);

  // Forecast day support: day_offset > 0 means this is a future-day report
  const dayOffset = params.day_offset != null ? parseInt(params.day_offset, 10) : 0;
  const targetDate = params.target_date ?? null;
  const isForecastDay = dayOffset > 0 && targetDate != null;

  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';
  const setLastReportEnv = useEnvStore((s) => s.setLastReportEnv);

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState<string>('Current location');

  const coastalEligible = useMemo(() => isCoastalContextEligible(lat, lon), [lat, lon]);
  const availableContexts: EngineContextKey[] = useMemo(() => {
    const ctxs: EngineContextKey[] = ['freshwater_lake_pond', 'freshwater_river'];
    if (coastalEligible) ctxs.push('coastal');
    return ctxs;
  }, [coastalEligible]);

  const availableTabs = useMemo(
    () => TAB_CONFIG.filter((t) => availableContexts.includes(t.key)),
    [availableContexts]
  );

  // Multi-report state
  const [multiBundles, setMultiBundles] = useState<Record<EngineContextKey, HowFishingRebuildBundle> | null>(null);
  const [activeTab, setActiveTab] = useState<EngineContextKey>('freshwater_lake_pond');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Load env + geocode on mount
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

  // Check cache on mount, show confirm if not cached.
  // Forecast day reports use a separate per-(lat,lon,target_date,ctx) cache that
  // expires at tonight's midnight — so same-day re-opens are instant cache hits,
  // but the next calendar day always fetches fresh weather data.
  useEffect(() => {
    if (!hasCoords || envLoading) return;
    let cancelled = false;
    (async () => {
      if (isForecastDay && targetDate) {
        // Check the dedicated forecast-day cache first
        const cached = await getCachedForecastRebuild(lat, lon, targetDate, availableContexts);
        if (cancelled) return;
        if (cached) {
          setMultiBundles(cached);
          // Do NOT write to the in-memory today store — forecast days are separate
        } else {
          setShowConfirm(true);
        }
        return;
      }
      const cached = await getCachedMultiRebuild(lat, lon, availableContexts);
      if (cancelled) return;
      if (cached) {
        setMultiBundles(cached);
        setCurrentMultiRebuild(lat, lon, cached);
      } else {
        setShowConfirm(true);
      }
    })();
    return () => { cancelled = true; };
  }, [hasCoords, envLoading, lat, lon, availableContexts, isForecastDay, targetDate]);

  const generateReports = useCallback(async () => {
    if (!hasCoords) return;
    setAnalysisLoading(true);
    setAnalysisError(null);
    setShowConfirm(false);
    try {
      const accessToken = await getValidAccessToken();
      const freshEnv = await fetchFreshEnvironment({ latitude: lat, longitude: lon, units });
      setEnv(freshEnv);

      const result = await invokeEdgeFunction<
        HowFishingRebuildMultiBundle | { error: string; message?: string }
      >('how-fishing', {
        accessToken,
        body: {
          latitude: lat,
          longitude: lon,
          units,
          mode: 'multi',
          contexts: availableContexts,
          env_data: freshEnv,
          location_name: locationLabel !== 'Current location' ? locationLabel : null,
          ...(isForecastDay && { day_offset: dayOffset, target_date: targetDate }),
        },
      });

      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error((result as { message?: string }).message ?? (result as { error: string }).error);
      }

      const multi = result as HowFishingRebuildMultiBundle;
      if (!multi || multi.feature !== 'hows_fishing_rebuild_v1' || !multi.reports) {
        throw new Error('Invalid response from server');
      }

      const bundles = multi.reports as Record<EngineContextKey, HowFishingRebuildBundle>;
      if (isForecastDay && targetDate) {
        // Forecast day: write to dedicated (lat,lon,target_date,ctx) cache.
        // Expires at tonight's midnight — same-day re-opens are instant hits;
        // next calendar day always generates fresh.
        // Do NOT touch today's daily cache or in-memory store.
        await setCachedForecastRebuild(lat, lon, targetDate, multi);
      } else {
        // Today's report: write to daily cache and in-memory store as normal.
        await setCachedMultiRebuild(lat, lon, multi);
        setCurrentMultiRebuild(lat, lon, bundles);
      }
      setLastReportEnv(freshEnv);
      setMultiBundles(bundles);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setAnalysisError(msg);
      Alert.alert('Unable to generate reports', msg);
    } finally {
      setAnalysisLoading(false);
    }
  }, [hasCoords, lat, lon, units, availableContexts, locationLabel, setLastReportEnv, isForecastDay, dayOffset, targetDate]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      if (isForecastDay && targetDate) {
        // Clear the dedicated forecast-day cache so a fresh generation runs
        for (const ctx of availableContexts) {
          await AsyncStorage.removeItem(
            `how_fishing_forecast_${lat.toFixed(3)}_${lon.toFixed(3)}_${targetDate}_${ctx}`
          );
        }
      } else {
        // Clear today's daily cache
        for (const ctx of availableContexts) {
          await AsyncStorage.removeItem(`how_fishing_rebuild_${lat.toFixed(3)}_${lon.toFixed(3)}_${ctx}`);
        }
      }
    } catch { /* ignore */ }
    setMultiBundles(null);
    await generateReports();
    setRefreshing(false);
  }, [generateReports, availableContexts, lat, lon, isForecastDay, targetDate]);

  const activeBundle = multiBundles?.[activeTab] ?? null;
  const activeTz = activeBundle?.report.location.timezone ?? env?.timezone;
  // For forecast days, show the target date; for today show current date
  const reportDateLabel = isForecastDay && targetDate
    ? new Date(targetDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : currentLocationDateString(activeTz);
  const topMeta = activeBundle
    ? `${locationLabel}  •  ${reportDateLabel}  •  ${formatGeneratedTime(activeBundle.generated_at, activeTz)}`
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

  // ─── Confirmation / Generate screen ───
  if (!multiBundles) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable style={styles.navBack} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={colors.primary} />
          </Pressable>
          <Text style={styles.heading}>How's Fishing</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.confirmContainer}>
          {analysisLoading ? (
            <View style={styles.loadingCard}>
              <View style={styles.loadingPulse}>
                <Ionicons name="fish-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.loadingTitle}>Building your reports</Text>
              <Text style={styles.loadingSub}>
                Analyzing conditions for {availableContexts.length} water type{availableContexts.length > 1 ? 's' : ''}…
              </Text>
            </View>
          ) : showConfirm ? (
            <View style={styles.confirmCard}>
              <View style={styles.confirmIconWrap}>
                <Ionicons name="sparkles" size={32} color={colors.primary} />
              </View>
              <Text style={styles.confirmTitle}>Ready to generate?</Text>
              <Text style={styles.confirmSub}>
                {isForecastDay && targetDate
                  ? `We'll build the forecast report for ${reportDateLabel} at`
                  : `We'll build today's fishing report for`}
                {'\n'}
                <Text style={{ fontWeight: '700' }}>{locationLabel}</Text>
              </Text>
              <View style={styles.confirmContextList}>
                {availableTabs.map((t) => (
                  <View key={t.key} style={styles.confirmContextRow}>
                    <Ionicons name={t.icon as any} size={16} color={t.color} />
                    <Text style={[styles.confirmContextLabel, { color: t.color }]}>{t.label}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                style={({ pressed }) => [styles.generateBtn, pressed && styles.generateBtnPressed]}
                onPress={generateReports}
                disabled={envLoading}
              >
                <Ionicons name="sparkles" size={16} color={colors.textOnPrimary} />
                <Text style={styles.generateBtnText}>
                  {isForecastDay ? `Generate forecast report` : `Generate today's reports`}
                </Text>
              </Pressable>
              {analysisError ? <Text style={styles.errorInline}>{analysisError}</Text> : null}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  // ─── Tabbed Report View ───
  const activeTabConfig = availableTabs.find((t) => t.key === activeTab) ?? availableTabs[0]!;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable style={styles.navBack} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.primary} />
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.heading}>How's Fishing</Text>
          {isForecastDay && (
            <View style={styles.forecastBadge}>
              <Ionicons name="calendar-outline" size={10} color="#4F61A3" />
              <Text style={styles.forecastBadgeText}>{reportDateLabel}</Text>
            </View>
          )}
        </View>
        <Pressable
          style={({ pressed }) => [styles.newReportBtn, pressed && { opacity: 0.7 }]}
          onPress={handleRefresh}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
          <Text style={styles.newReportText}>Refresh</Text>
        </Pressable>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {availableTabs.map((t) => {
          const isActive = activeTab === t.key;
          const hasReport = !!multiBundles[t.key];
          return (
            <Pressable
              key={t.key}
              style={[styles.tab, isActive && styles.tabActive, isActive && { borderBottomColor: t.color }]}
              onPress={() => setActiveTab(t.key)}
              disabled={!hasReport}
            >
              <Ionicons
                name={t.icon as any}
                size={16}
                color={isActive ? t.color : hasReport ? colors.textMuted : colors.border}
              />
              <Text style={[
                styles.tabLabel,
                isActive && { color: t.color, fontWeight: '700' },
                !hasReport && { color: colors.border },
              ]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
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
        <View style={[styles.contextPill, { backgroundColor: activeTabConfig.color + '14' }]}>
          <Ionicons name={activeTabConfig.icon as any} size={13} color={activeTabConfig.color} />
          <Text style={[styles.contextPillText, { color: activeTabConfig.color }]}>
            {activeBundle?.report.display_context_label ?? activeTabConfig.label}
          </Text>
        </View>

        {activeBundle ? (
          <RebuildReportView report={activeBundle.report} solunarData={env?.solunar} />
        ) : (
          <View style={styles.noReportCard}>
            <Text style={styles.noReportText}>Report unavailable for this water type.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
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

  /* Forecast Day Badge */
  forecastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#4F61A3' + '15',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
    alignSelf: 'center',
  },
  forecastBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    color: '#4F61A3',
    letterSpacing: 0.2,
  },

  /* Tab Bar */
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: 20,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 3,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },

  /* Confirmation */
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  confirmCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    ...shadows.lg,
  },
  confirmIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  confirmTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  confirmSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  confirmContextList: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  confirmContextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  confirmContextLabel: {
    fontSize: 13,
    fontWeight: '600',
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
    width: '100%',
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

  /* Loading */
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

  /* No report fallback */
  noReportCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  noReportText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
