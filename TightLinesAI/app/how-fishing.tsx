import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
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
  ReportView,
  WaterTypeTabBar,
  WeeklyForecastStrip,
} from '../components/fishing';
import { CondensedLoadingView } from '../components/fishing/CondensedLoadingView';

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

function isCoastalFromEnv(env: EnvironmentData | null | undefined): boolean {
  return Boolean(env?.coastal);
}

function resolveForecastWaterType(isCoastal: boolean, activeTab: string): 'freshwater' | 'saltwater' | 'brackish' | 'auto' {
  if (!isCoastal) return 'freshwater';
  if (activeTab === 'brackish') return 'brackish';
  if (activeTab === 'freshwater') return 'freshwater';
  if (activeTab === 'saltwater') return 'saltwater';
  return 'saltwater';
}

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

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [bundle, setBundle] = useState<HowFishingBundle | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('freshwater_lake');
  const [freshwaterSubtype, setFreshwaterSubtype] = useState<'lake' | 'river_stream'>('lake');
  const [manualWaterTempInput, setManualWaterTempInput] = useState('');
  const [manualWaterTempApplied, setManualWaterTempApplied] = useState<number | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>('Current location');
  const [reportDateKey, setReportDateKey] = useState<string | null>(null);
  const [forecastPromptDay, setForecastPromptDay] = useState<{ day: ForecastDay; index: number } | null>(null);

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
        loadForecast(lat, lon, cachedEnv, { waterType: isCoastalFromEnv(cachedEnv) ? 'saltwater' : 'freshwater', freshwaterSubtype });
      } catch {
        if (!cancelled) setAnalysisError('Unable to load live conditions.');
      } finally {
        if (!cancelled) setEnvLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hasCoords, lat, lon, units, loadForecast, freshwaterSubtype]);

  const isCoastal = env?.coastal ?? false;
  const showManualTemp = !isCoastal;
  const availableTabs = useMemo(() => {
    if (!bundle) return [] as string[];
    return bundle.mode === 'inland_dual'
      ? ['freshwater_lake', 'freshwater_river']
      : ['freshwater', 'saltwater', 'brackish'].filter((k) => (bundle.reports as any)[k]);
  }, [bundle]);

  const activeReport: WaterTypeReport | null = useMemo(() => {
    if (!bundle) return null;
    return (bundle.reports as any)[activeTab] ?? null;
  }, [bundle, activeTab]);

  useEffect(() => {
    if (!env || !hasCoords || !bundle) return;
    loadForecast(lat, lon, manualWaterTempApplied !== null && !isCoastal ? { ...env, manual_freshwater_water_temp_f: manualWaterTempApplied } : env, {
      waterType: resolveForecastWaterType(isCoastal, activeTab),
      freshwaterSubtype,
    });
  }, [env, hasCoords, bundle, loadForecast, lat, lon, activeTab, freshwaterSubtype, manualWaterTempApplied, isCoastal]);

  const generateReport = useCallback(async (targetDate?: string) => {
    if (!hasCoords) return;
    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const accessToken = await getValidAccessToken();
      const freshEnv = await fetchFreshEnvironment({ latitude: lat, longitude: lon, units });
      setEnv(freshEnv);
      const selectedManualTemp = showManualTemp ? manualWaterTempApplied : null;
      const envPayload: EnvironmentData = selectedManualTemp !== null
        ? { ...freshEnv, manual_freshwater_water_temp_f: selectedManualTemp }
        : freshEnv;

      if (!targetDate && selectedManualTemp === null) {
        const cached = await getCachedHowFishingBundle(lat, lon);
        if (cached) {
          setBundle(cached);
          setActiveTab((prev) => prev && (cached.reports as any)[prev] ? prev : (cached.default_tab ?? 'freshwater_lake'));
          setReportDateKey(currentLocationDateKey(bundleTimezoneFromBundle(cached) ?? freshEnv.timezone, cached.generated_at));
          setLastReportEnv(freshEnv);
          loadForecast(lat, lon, envPayload, { waterType: resolveForecastWaterType(isCoastal, activeTab), freshwaterSubtype });
          setAnalysisLoading(false);
          return;
        }
      }

      const result = await invokeEdgeFunction<HowFishingBundle | { error: string; message?: string }>('how-fishing', {
        accessToken,
        body: {
          latitude: lat,
          longitude: lon,
          units,
          freshwater_subtype: freshwaterSubtype,
          env_data: envPayload,
          target_date: targetDate,
        },
      });

      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error(result.message ?? result.error);
      }

      const bundleResult = result as HowFishingBundle;
      if (!bundleResult || bundleResult.feature !== 'hows_fishing_feature_v1') {
        throw new Error('Invalid response format');
      }

      if (!targetDate && selectedManualTemp === null) {
        await setCachedHowFishingBundle(lat, lon, bundleResult);
        setCurrentHowFishingBundle(lat, lon, bundleResult);
      }

      setLastReportEnv(freshEnv);
      setBundle(bundleResult);
      setActiveTab((prev) => prev && (bundleResult.reports as any)[prev] ? prev : (bundleResult.default_tab ?? 'freshwater_lake'));
      setReportDateKey(targetDate ?? currentLocationDateKey(bundleTimezoneFromBundle(bundleResult) ?? freshEnv.timezone, bundleResult.generated_at));
      loadForecast(lat, lon, envPayload, { waterType: resolveForecastWaterType(isCoastal, activeTab), freshwaterSubtype });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setAnalysisError(msg);
      Alert.alert('Unable to generate report', msg);
    } finally {
      setAnalysisLoading(false);
      setForecastPromptDay(null);
    }
  }, [hasCoords, lat, lon, units, freshwaterSubtype, manualWaterTempApplied, showManualTemp, setLastReportEnv, loadForecast, activeTab, isCoastal]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await generateReport(reportDateKey && forecast?.forecast_days?.some((d) => d.date === reportDateKey) ? reportDateKey : undefined);
    setRefreshing(false);
  }, [generateReport, reportDateKey, forecast]);

  const applyManualTemp = useCallback(() => {
    if (!manualWaterTempInput.trim()) {
      setManualWaterTempApplied(null);
      return;
    }
    const parsed = Number(manualWaterTempInput);
    if (Number.isNaN(parsed)) {
      Alert.alert('Invalid water temperature', 'Enter a valid number between 32°F and 99°F.');
      return;
    }
    const clamped = Math.max(32, Math.min(99, Math.round(parsed * 10) / 10));
    setManualWaterTempInput(String(clamped));
    setManualWaterTempApplied(clamped);
  }, [manualWaterTempInput]);

  const clearManualTemp = useCallback(() => {
    setManualWaterTempInput('');
    setManualWaterTempApplied(null);
  }, []);

  const handleForecastDayPress = useCallback((date: string, index: number) => {
    const day = forecast?.forecast_days?.[index];
    if (!day) return;
    if (index === 0) {
      void generateReport();
      return;
    }
    setForecastPromptDay({ day, index });
  }, [forecast, generateReport]);

  const topMeta = activeReport?.engine?.location?.timezone
    ? `${locationLabel} • ${reportDateKey ? dayLabel(reportDateKey) : currentLocationDateString(activeReport.engine.location.timezone)} • ${formatGeneratedTime(bundle?.generated_at ?? new Date().toISOString(), activeReport.engine.location.timezone)}`
    : `${locationLabel}`;

  const activeTimezone = activeReport?.engine?.location?.timezone ?? env?.timezone;
  const localTodayKey = currentLocationDateKey(activeTimezone);
  const todayOverride = activeReport?.engine && reportDateKey === localTodayKey
    ? {
        daily_score: activeReport.engine.scoring.adjusted_score,
        overall_rating: activeReport.engine.scoring.overall_rating,
      }
    : null;

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
        <View style={styles.preflightWrap}>
          <Text style={styles.preflightMeta}>{locationLabel}</Text>
          <View style={styles.preflightConditionsCard}>
            <CondensedLoadingView
              conditions={env ? {
                air_temp_f: env?.weather?.temperature ?? null,
                wind_speed_mph: env?.weather?.wind_speed ?? null,
                wind_direction: windDirectionLabel(env?.weather?.wind_direction),
                pressure_mb: env?.weather?.pressure ?? null,
                pressure_state: env?.weather?.pressure_trend ?? null,
                cloud_cover_pct: env?.weather?.cloud_cover ?? null,
                moon_phase: env?.moon?.phase ?? null,
                moon_illumination_pct: env?.moon?.illumination ?? null,
                tide_phase_state: isCoastal ? env?.tides?.phase ?? null : null,
                solunar_state: null,
              } : null}
              statusText={analysisLoading ? 'Generating your report…' : 'Live conditions are ready.'}
            />
          </View>

          {showManualTemp ? (
            <View style={styles.manualTempCard}>
              <Text style={styles.manualTempTitle}>Optional freshwater water temp</Text>
              <Text style={styles.manualTempSub}>Add it before you generate the report if you know it.</Text>
              <View style={styles.manualTempRow}>
                <TextInput
                  value={manualWaterTempInput}
                  onChangeText={(value) => setManualWaterTempInput(value.replace(/[^0-9.]/g, '').slice(0, 5))}
                  onBlur={() => {
                    if (!manualWaterTempInput.trim()) setManualWaterTempApplied(null);
                  }}
                  placeholder="32–99°F"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  style={styles.manualTempInput}
                />
                <Pressable style={styles.smallBtn} onPress={applyManualTemp}>
                  <Text style={styles.smallBtnText}>{manualWaterTempApplied !== null ? 'Update' : 'Apply'}</Text>
                </Pressable>
                {manualWaterTempInput.length > 0 || manualWaterTempApplied !== null ? (
                  <Pressable style={styles.smallBtnGhost} onPress={clearManualTemp}>
                    <Text style={styles.smallBtnGhostText}>Clear</Text>
                  </Pressable>
                ) : null}
              </View>
              {manualWaterTempApplied !== null ? <Text style={styles.manualApplied}>Using {manualWaterTempApplied}°F for scoring.</Text> : null}
            </View>
          ) : null}

          {!isCoastal ? (
            <View style={styles.segmentWrap}>
              <Pressable style={[styles.segmentBtn, freshwaterSubtype === 'lake' && styles.segmentBtnActive]} onPress={() => setFreshwaterSubtype('lake')}>
                <Text style={[styles.segmentText, freshwaterSubtype === 'lake' && styles.segmentTextActive]}>Lake</Text>
              </Pressable>
              <Pressable style={[styles.segmentBtn, freshwaterSubtype === 'river_stream' && styles.segmentBtnActive]} onPress={() => setFreshwaterSubtype('river_stream')}>
                <Text style={[styles.segmentText, freshwaterSubtype === 'river_stream' && styles.segmentTextActive]}>River</Text>
              </Pressable>
            </View>
          ) : null}

          <Pressable style={[styles.primaryBtn, analysisLoading && { opacity: 0.8 }]} onPress={() => generateReport()} disabled={analysisLoading || envLoading}>
            {analysisLoading ? <ActivityIndicator size="small" color={colors.textLight} /> : <Text style={styles.primaryBtnText}>Generate report</Text>}
          </Pressable>
          {analysisError ? <Text style={styles.errorInline}>{analysisError}</Text> : null}

          {analysisLoading ? (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingOverlayCard}>
                <ActivityIndicator size="large" color={colors.sage} />
                <Text style={styles.loadingOverlayTitle}>Building report…</Text>
                <Text style={styles.loadingOverlaySub}>Using live conditions{manualWaterTempApplied !== null ? ' and your water-temp entry' : ''}.</Text>
              </View>
            </View>
          ) : null}
        </View>
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
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.sage} />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.reportMeta}>{topMeta}</Text>

        {(isCoastal || bundle.mode === 'inland_dual') && (
          <WaterTypeTabBar tabs={availableTabs} active={activeTab} onPress={setActiveTab} failed={bundle.failed_reports ?? []} />
        )}

        {forecast?.forecast_days && forecast.forecast_days.length > 0 ? (
          <WeeklyForecastStrip
            forecastDays={forecast.forecast_days}
            selectedDate={forecast?.forecast_days.some((d) => d.date === reportDateKey) ? reportDateKey : forecast.forecast_days[0]?.date}
            onDayPress={handleForecastDayPress}
            isLoading={forecastLoading}
            todayOverride={todayOverride}
          />
        ) : null}

        {activeReport ? <ReportView report={activeReport} /> : null}
      </ScrollView>

      <Modal visible={!!forecastPromptDay} transparent animationType="fade" onRequestClose={() => setForecastPromptDay(null)}>
        <View style={styles.modalScrim}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{forecastPromptDay ? dayLabel(forecastPromptDay.day.date) : 'Forecast day'}</Text>
            <Text style={styles.modalBody}>{forecastPromptDay?.day.summary_line}</Text>
            <Text style={styles.modalSub}>Future-day reports are forecast-based and get more reliable as the date gets closer.</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.smallBtnGhost} onPress={() => setForecastPromptDay(null)}>
                <Text style={styles.smallBtnGhostText}>Close</Text>
              </Pressable>
              <Pressable style={styles.smallBtn} onPress={() => forecastPromptDay && generateReport(forecastPromptDay.day.date)}>
                <Text style={styles.smallBtnText}>Generate report</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function bundleTimezoneFromBundle(bundle: HowFishingBundle): string | null {
  return bundle.reports.freshwater_lake?.engine?.location?.timezone
    ?? bundle.reports.freshwater?.engine?.location?.timezone
    ?? bundle.reports.saltwater?.engine?.location?.timezone
    ?? bundle.reports.brackish?.engine?.location?.timezone
    ?? bundle.reports.freshwater_river?.engine?.location?.timezone
    ?? null;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, paddingTop: spacing.xs },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: 2,
    paddingBottom: 6,
  },
  navBack: { padding: 4 },
  heading: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', flex: 1 },
  reportMeta: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.xs, textAlign: 'center' },
  preflightWrap: { flex: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.md, justifyContent: 'center' },
  preflightMeta: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xs },
  preflightConditionsCard: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm, overflow: 'hidden' },
  manualTempCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  manualTempTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4 },
  manualTempSub: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.sm },
  manualTempRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  manualTempInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: colors.text, backgroundColor: colors.background },
  manualApplied: { fontSize: 12, color: colors.sage, fontWeight: '700', marginTop: spacing.sm },
  segmentWrap: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  segmentBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.sm, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: colors.sage },
  segmentText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  segmentTextActive: { color: colors.textLight },
  primaryBtn: { backgroundColor: colors.sage, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.lg },
  primaryBtnText: { color: colors.textLight, fontSize: 15, fontWeight: '700' },
  smallBtn: { backgroundColor: colors.sage, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  smallBtnText: { color: colors.textLight, fontWeight: '700' },
  smallBtnGhost: { backgroundColor: colors.background, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  smallBtnGhostText: { color: colors.text, fontWeight: '600' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  messageText: { fontSize: 22, fontFamily: fonts.serif, fontWeight: '700', color: colors.text, textAlign: 'center' },
  messageSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  errorInline: { color: '#C64545', textAlign: 'center', marginTop: spacing.sm },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F5F0E8CC', alignItems: 'center', justifyContent: 'center' },
  loadingOverlayCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, alignItems: 'center', gap: spacing.sm },
  loadingOverlayTitle: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.text },
  loadingOverlaySub: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  modalScrim: { flex: 1, backgroundColor: '#00000066', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  modalCard: { width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  modalTitle: { fontFamily: fonts.serif, fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, textAlign: 'center' },
  modalBody: { fontSize: 15, color: colors.text, lineHeight: 22, textAlign: 'center' },
  modalSub: { fontSize: 12, color: colors.textMuted, lineHeight: 18, textAlign: 'center', marginTop: spacing.sm },
  modalActions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
});
