import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
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
  getCachedHowFishingBundle,
  setCachedHowFishingBundle,
  setCurrentHowFishingBundle,
  type HowFishingBundle,
  type WaterTypeReport,
  type ForecastDay,
} from '../lib/howFishing';
import { useEnvStore } from '../store/envStore';
import { useForecastStore } from '../store/forecastStore';
import type { EnvironmentData } from '../lib/env/types';
import {
  type EnvironmentModeV2,
  type WaterTypeV2,
  type FreshwaterSubtypeV2,
} from '../lib/howFishingV2';
import { getAvailableWaterTypes } from '../lib/coastalProximity';
import {
  ReportView,
  WaterTypeTabBar,
  WeeklyForecastStrip,
} from '../components/fishing';
import { CondensedLoadingView } from '../components/fishing/CondensedLoadingView';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function currentLocationDateKey(timezone?: string, iso: string = new Date().toISOString()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toISOString().slice(0, 10);
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

function dayLabel(dateStr: string): string {
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function windDirectionLabel(deg?: number | null): string | null {
  if (typeof deg !== 'number' || Number.isNaN(deg)) return null;
  const cards = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? null;
}

/**
 * Derives environment mode from water type + freshwater subtype.
 * This is the canonical mapping per the spec.
 */
function deriveEnvironmentMode(
  waterType: WaterTypeV2,
  freshwaterSubtype: FreshwaterSubtypeV2 | null
): EnvironmentModeV2 {
  if (waterType === 'saltwater') return 'saltwater';
  if (waterType === 'brackish') return 'brackish';
  // freshwater — default to lake if no subtype selected yet
  if (freshwaterSubtype === 'river_stream') return 'freshwater_river';
  return 'freshwater_lake';
}

/** Suggests a likely starting water type from coastal env hint. Does NOT confirm it. */
function suggestWaterType(env: EnvironmentData | null): WaterTypeV2 {
  if (env?.coastal) return 'saltwater';
  return 'freshwater';
}

function bundleTimezoneFromBundle(bundle: HowFishingBundle): string | null {
  return bundle.reports.freshwater_lake?.engine?.location?.timezone
    ?? bundle.reports.freshwater?.engine?.location?.timezone
    ?? bundle.reports.saltwater?.engine?.location?.timezone
    ?? bundle.reports.brackish?.engine?.location?.timezone
    ?? bundle.reports.freshwater_river?.engine?.location?.timezone
    ?? null;
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function HowFishingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lat?: string; lon?: string }>();
  const lat = params.lat != null ? parseFloat(params.lat) : NaN;
  const lon = params.lon != null ? parseFloat(params.lon) : NaN;
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lon);

  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';
  const setLastReportEnv = useEnvStore((s) => s.setLastReportEnv);
  const { forecast, isLoading: forecastLoading, loadForecast } = useForecastStore();

  // ---------------------------------------------------------------------------
  // Environment state
  // ---------------------------------------------------------------------------
  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState<string>('Current location');

  // ---------------------------------------------------------------------------
  // V2 confirmed context state — this is the source of truth for report generation
  // ---------------------------------------------------------------------------
  const [selectedWaterType, setSelectedWaterType] = useState<WaterTypeV2 | null>(null);
  const [freshwaterSubtype, setFreshwaterSubtype] = useState<FreshwaterSubtypeV2>('lake');

  // Derived — never stored separately to avoid stale state
  const environmentMode: EnvironmentModeV2 = deriveEnvironmentMode(
    selectedWaterType ?? 'freshwater',
    selectedWaterType === 'freshwater' ? freshwaterSubtype : null
  );

  const contextIsValid = selectedWaterType !== null;

  // ---------------------------------------------------------------------------
  // Report / bundle state
  // ---------------------------------------------------------------------------
  const [bundle, setBundle] = useState<HowFishingBundle | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [reportDateKey, setReportDateKey] = useState<string | null>(null);
  const [forecastPromptDay, setForecastPromptDay] = useState<{ day: ForecastDay; index: number } | null>(null);

  // Active tab tracks which context is displayed.
  // The V2 backend returns a single report, wrapped in the legacy multi-report shape
  // for backwards compatibility with the ReportView component.
  // The active tab always points to environmentMode for new reports.
  const [activeTab, setActiveTab] = useState<string>('freshwater_lake');

  // ---------------------------------------------------------------------------
  // Load environment on mount
  // ---------------------------------------------------------------------------
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

        // Suggest — but do NOT automatically confirm — a water type from env hint.
        // The user must make an explicit selection.
        if (selectedWaterType === null) {
          const suggested = suggestWaterType(cachedEnv);
          setSelectedWaterType(suggested);
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCoords, lat, lon, units]);

  // ---------------------------------------------------------------------------
  // Keep forecast in sync with confirmed environment mode
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!env || !hasCoords) return;
    loadForecast(lat, lon, env, { environmentMode });
  // Only re-run when env or environmentMode changes — not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env, hasCoords, environmentMode]);

  // ---------------------------------------------------------------------------
  // Available tabs for the post-run report display.
  // The frozen V1 backend may still return a multi-report bundle;
  // we display only the tab matching the confirmed environment mode.
  // When the backend is migrated to V2 this logic simplifies to a single report.
  // ---------------------------------------------------------------------------
  const availableTabs = useMemo(() => {
    if (!bundle) return [] as string[];
    // V2 backend returns a single report in the environmentMode key.
    // Show only reports that actually exist (there should be exactly one).
    const allKeys: string[] = ['freshwater_lake', 'freshwater_river', 'freshwater', 'saltwater', 'brackish'];
    return allKeys.filter((k) => (bundle.reports as Record<string, unknown>)[k] != null);
  }, [bundle]);

  const activeReport: WaterTypeReport | null = useMemo(() => {
    if (!bundle) return null;
    return (bundle.reports as Record<string, WaterTypeReport>)[activeTab] ?? null;
  }, [bundle, activeTab]);

  // ---------------------------------------------------------------------------
  // Generate report
  // ---------------------------------------------------------------------------
  const generateReport = useCallback(async (targetDate?: string) => {
    if (!hasCoords || !contextIsValid) return;
    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const accessToken = await getValidAccessToken();
      const freshEnv = await fetchFreshEnvironment({ latitude: lat, longitude: lon, units });
      setEnv(freshEnv);

      const envPayload: EnvironmentData = freshEnv;

      // Try cache first (only for today's runs)
      if (!targetDate) {
        const cached = await getCachedHowFishingBundle(lat, lon, environmentMode);
        if (cached) {
          setBundle(cached);
          // Prefer the tab that matches the confirmed environment mode
          const preferredTab = environmentMode;
          const cachedReports = cached.reports as Record<string, unknown>;
          const tabToShow = cachedReports[preferredTab] != null
            ? preferredTab
            : (cached.default_tab ?? Object.keys(cachedReports).find((k) => cachedReports[k] != null) ?? preferredTab);
          setActiveTab(tabToShow);
          setReportDateKey(
            currentLocationDateKey(bundleTimezoneFromBundle(cached) ?? freshEnv.timezone, cached.generated_at)
          );
          setLastReportEnv(freshEnv);
          loadForecast(lat, lon, envPayload, { environmentMode });
          setAnalysisLoading(false);
          return;
        }
      }

      // Build the V2-aligned request body.
      const requestBody = {
        latitude: lat,
        longitude: lon,
        units,
        freshwater_subtype: selectedWaterType === 'freshwater' ? freshwaterSubtype : null,
        water_type: selectedWaterType,
        environment_mode: environmentMode,
        env_data: envPayload,
        ...(targetDate ? { target_date: targetDate } : {}),
      };

      const result = await invokeEdgeFunction<HowFishingBundle | { error: string; message?: string }>(
        'how-fishing',
        { accessToken, body: requestBody }
      );

      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error((result as { error: string; message?: string }).message ?? (result as { error: string }).error);
      }

      const bundleResult = result as HowFishingBundle;
      if (
        !bundleResult ||
        (bundleResult.feature !== 'hows_fishing_feature_v1' && bundleResult.feature !== 'hows_fishing_feature_v2')
      ) {
        throw new Error('Invalid response format');
      }

      if (!targetDate) {
        await setCachedHowFishingBundle(lat, lon, bundleResult, environmentMode);
        setCurrentHowFishingBundle(lat, lon, bundleResult);
      }

      setLastReportEnv(freshEnv);
      setBundle(bundleResult);

      // Point the active tab at the confirmed environment mode.
      // Fall back to the bundle's default_tab if the mode isn't in the bundle
      // (can happen with the V1 backend that still runs its own context logic).
      const reports = bundleResult.reports as Record<string, unknown>;
      const preferredTab = environmentMode;
      const tabToShow = reports[preferredTab] != null
        ? preferredTab
        : (bundleResult.default_tab ?? Object.keys(reports).find((k) => reports[k] != null) ?? preferredTab);
      setActiveTab(tabToShow);

      setReportDateKey(
        targetDate ?? currentLocationDateKey(bundleTimezoneFromBundle(bundleResult) ?? freshEnv.timezone, bundleResult.generated_at)
      );
      loadForecast(lat, lon, envPayload, { environmentMode });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setAnalysisError(msg);
      Alert.alert('Unable to generate report', msg);
    } finally {
      setAnalysisLoading(false);
      setForecastPromptDay(null);
    }
  }, [
    hasCoords, contextIsValid, lat, lon, units,
    selectedWaterType, freshwaterSubtype, environmentMode,
    setLastReportEnv, loadForecast,
  ]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await generateReport(
      reportDateKey && forecast?.forecast_days?.some((d) => d.date === reportDateKey)
        ? reportDateKey
        : undefined
    );
    setRefreshing(false);
  }, [generateReport, reportDateKey, forecast]);

  const handleForecastDayPress = useCallback((date: string, index: number) => {
    const day = forecast?.forecast_days?.[index];
    if (!day) return;
    if (index === 0) {
      void generateReport();
      return;
    }
    setForecastPromptDay({ day, index });
  }, [forecast, generateReport]);

  // ---------------------------------------------------------------------------
  // Derived display values
  // ---------------------------------------------------------------------------
  const activeTimezone = activeReport?.engine?.location?.timezone ?? env?.timezone;
  const topMeta = activeReport?.engine?.location?.timezone
    ? `${locationLabel} • ${reportDateKey ? dayLabel(reportDateKey) : currentLocationDateString(activeReport.engine.location.timezone)} • ${formatGeneratedTime(bundle?.generated_at ?? new Date().toISOString(), activeReport.engine.location.timezone)}`
    : locationLabel;

  const localTodayKey = currentLocationDateKey(activeTimezone);
  const todayOverride = activeReport?.engine && reportDateKey === localTodayKey
    ? {
        daily_score: activeReport.engine.scoring.adjusted_score,
        overall_rating: activeReport.engine.scoring.overall_rating,
      }
    : null;

  // ---------------------------------------------------------------------------
  // No-coords guard
  // ---------------------------------------------------------------------------
  if (!hasCoords) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={36} color={colors.textMuted} />
          <Text style={styles.messageText}>How's Fishing needs your location</Text>
          <Text style={styles.messageSub}>Enable location so TightLines can pull live conditions and build your report.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
            <Text style={styles.primaryBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Pre-report setup screen
  // ---------------------------------------------------------------------------
  if (!bundle) {
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
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.preflightMeta}>{locationLabel}</Text>

          {/* Live conditions preview */}
          <View style={styles.preflightConditionsCard}>
            <CondensedLoadingView
              conditions={env ? {
                air_temp_f: env.weather?.temperature ?? null,
                wind_speed_mph: env.weather?.wind_speed ?? null,
                wind_direction: windDirectionLabel(env.weather?.wind_direction),
                pressure_mb: env.weather?.pressure ?? null,
                pressure_state: env.weather?.pressure_trend ?? null,
                cloud_cover_pct: env.weather?.cloud_cover ?? null,
                moon_phase: env.moon?.phase ?? null,
                moon_illumination_pct: env.moon?.illumination ?? null,
                // Only show tide for confirmed coastal selection
                tide_phase_state: (selectedWaterType === 'saltwater' || selectedWaterType === 'brackish')
                  ? (env.tides?.phase ?? null)
                  : null,
                solunar_state: null,
              } : null}
              statusText={analysisLoading ? 'Generating your report…' : 'Live conditions are ready.'}
            />
          </View>

          {/* ── Step 1: Water type selection ─────────────────────────── */}
          <View style={styles.setupCard}>
            <Text style={styles.setupCardTitle}>What type of water are you fishing?</Text>
            <View style={styles.segmentWrap}>
              {(getAvailableWaterTypes(lat, lon) as WaterTypeV2[]).map((wt) => (
                <Pressable
                  key={wt}
                  style={[styles.segmentBtn, selectedWaterType === wt && styles.segmentBtnActive]}
                  onPress={() => {
                    setSelectedWaterType(wt);
                    // Reset freshwater subtype when switching water types
                    if (wt !== 'freshwater') {
                      // Keep freshwaterSubtype state intact but it won't be used
                    } else {
                      setFreshwaterSubtype('lake');
                    }
                  }}
                >
                  <Text style={[styles.segmentText, selectedWaterType === wt && styles.segmentTextActive]}>
                    {wt === 'freshwater' ? 'Freshwater' : wt === 'saltwater' ? 'Saltwater' : 'Brackish'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Coastal auto-suggest hint — informational only, not confirmation */}
            {env?.coastal && selectedWaterType === 'freshwater' && (
              <Text style={styles.setupHint}>
                Tip: coastal water detected nearby — consider Saltwater or Brackish if that's where you're fishing.
              </Text>
            )}
            {!env?.coastal && (selectedWaterType === 'saltwater' || selectedWaterType === 'brackish') && (
              <Text style={styles.setupHint}>
                Note: no coastal water detected nearby — make sure you're heading to salt or brackish water.
              </Text>
            )}
          </View>

          {/* ── Step 2: Freshwater subtype (only for freshwater) ──────── */}
          {selectedWaterType === 'freshwater' && (
            <View style={styles.setupCard}>
              <Text style={styles.setupCardTitle}>What kind of freshwater?</Text>
              <View style={styles.segmentWrap}>
                <Pressable
                  style={[styles.segmentBtn, freshwaterSubtype === 'lake' && styles.segmentBtnActive]}
                  onPress={() => setFreshwaterSubtype('lake')}
                >
                  <Text style={[styles.segmentText, freshwaterSubtype === 'lake' && styles.segmentTextActive]}>
                    Lake / Pond
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.segmentBtn, freshwaterSubtype === 'river_stream' && styles.segmentBtnActive]}
                  onPress={() => setFreshwaterSubtype('river_stream')}
                >
                  <Text style={[styles.segmentText, freshwaterSubtype === 'river_stream' && styles.segmentTextActive]}>
                    River / Stream
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Saltwater/brackish: explain that water temp is auto-sourced */}
          {(selectedWaterType === 'saltwater' || selectedWaterType === 'brackish') && (
            <View style={styles.infoCard}>
              <Ionicons name="thermometer-outline" size={16} color={colors.textMuted} />
              <Text style={styles.infoCardText}>
                Water temperature is automatically sourced from coastal sensors for salt and brackish reports.
              </Text>
            </View>
          )}

          {/* ── Generate button ───────────────────────────────────────── */}
          <Pressable
            style={[
              styles.primaryBtn,
              (!contextIsValid || analysisLoading || envLoading) && { opacity: 0.6 },
            ]}
            onPress={() => generateReport()}
            disabled={!contextIsValid || analysisLoading || envLoading}
          >
            {analysisLoading
              ? <ActivityIndicator size="small" color={colors.textLight} />
              : <Text style={styles.primaryBtnText}>Generate report</Text>
            }
          </Pressable>

          {analysisError ? <Text style={styles.errorInline}>{analysisError}</Text> : null}
        </ScrollView>

        {analysisLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingOverlayCard}>
              <ActivityIndicator size="large" color={colors.sage} />
              <Text style={styles.loadingOverlayTitle}>Building report…</Text>
              <Text style={styles.loadingOverlaySub}>
                Using live conditions.
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // Report display screen
  // ---------------------------------------------------------------------------
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
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.sage} />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.reportMeta}>{topMeta}</Text>

        {/* Only show tab bar when bundle contains multiple reports.
            V2 backend returns a single report — tab bar typically hidden. */}
        {availableTabs.length > 1 && (
          <WaterTypeTabBar
            tabs={availableTabs}
            active={activeTab}
            onPress={setActiveTab}
            failed={bundle.failed_reports ?? []}
          />
        )}

        {forecast?.forecast_days && forecast.forecast_days.length > 0 ? (
          <WeeklyForecastStrip
            forecastDays={forecast.forecast_days}
            selectedDate={
              forecast.forecast_days.some((d) => d.date === reportDateKey)
                ? reportDateKey
                : forecast.forecast_days[0]?.date
            }
            onDayPress={handleForecastDayPress}
            isLoading={forecastLoading}
            todayOverride={todayOverride}
          />
        ) : null}

        {activeReport ? <ReportView report={activeReport} /> : null}
      </ScrollView>

      <Modal
        visible={!!forecastPromptDay}
        transparent
        animationType="fade"
        onRequestClose={() => setForecastPromptDay(null)}
      >
        <View style={styles.modalScrim}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {forecastPromptDay ? dayLabel(forecastPromptDay.day.date) : 'Forecast day'}
            </Text>
            <Text style={styles.modalBody}>{forecastPromptDay?.day.summary_line}</Text>
            <Text style={styles.modalSub}>
              Future-day reports are forecast-based and get more reliable as the date gets closer.
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.smallBtnGhost} onPress={() => setForecastPromptDay(null)}>
                <Text style={styles.smallBtnGhostText}>Close</Text>
              </Pressable>
              <Pressable
                style={styles.smallBtn}
                onPress={() => forecastPromptDay && generateReport(forecastPromptDay.day.date)}
              >
                <Text style={styles.smallBtnText}>Generate report</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

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
  reportMeta: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs, textAlign: 'center' },
  preflightMeta: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xs },
  preflightConditionsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },

  // Setup cards
  setupCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setupCardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  setupCardSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.sm },
  setupHint: { fontSize: 12, color: colors.textMuted, lineHeight: 17, marginTop: spacing.xs, fontStyle: 'italic' },
  // Info card (salt/brackish water temp note)
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCardText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 18 },

  // Segment controls
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 3,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: colors.sage },
  segmentText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  segmentTextActive: { color: colors.textLight },

  // Buttons
  primaryBtn: {
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  primaryBtnText: { color: colors.textLight, fontSize: 15, fontWeight: '700' },
  smallBtn: {
    backgroundColor: colors.sage,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnText: { color: colors.textLight, fontWeight: '700' },
  smallBtnGhost: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnGhostText: { color: colors.text, fontWeight: '600' },

  // States
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

  // Loading overlay
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
  loadingOverlaySub: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },

  // Modal
  modalScrim: {
    flex: 1,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalBody: { fontSize: 15, color: colors.text, lineHeight: 22, textAlign: 'center' },
  modalSub: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
});
