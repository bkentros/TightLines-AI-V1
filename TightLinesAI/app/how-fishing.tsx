import { useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
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
import {
  paper,
  paperFonts,
  paperSpacing,
  paperRadius,
  paperShadows,
  paperBorders,
} from '../lib/theme';
import { getEnvironment } from '../lib/env';
import { invokeEdgeFunction, getValidAccessToken } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import {
  getCachedMultiRebuild,
  setCachedMultiRebuild,
  setCurrentMultiRebuild,
  getCachedForecastRebuild,
  setCachedForecastRebuild,
  howFishingMultiContexts,
  type HowFishingRebuildBundle,
  type HowFishingRebuildMultiBundle,
  type EngineContextKey,
} from '../lib/howFishing';
import { getForecastScores } from '../lib/forecastScores';
import { useEnvStore } from '../store/envStore';
import type { EnvironmentData } from '../lib/env/types';
import { oceanCoastalZoneLabel } from '../lib/coastalProximity';
import { RebuildReportView } from '../components/fishing/RebuildReportView';
import {
  PaperBackground,
  CornerMarkSet,
  SectionEyebrow,
  TopographicLines,
} from '../components/paper';
import type { ForecastSnapshotEnv } from '../lib/forecastScores';

/* ─── Date/time helpers ─────────────────────────────────────────────────── */

function currentLocationDateString(timezone?: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
      .format(new Date())
      .toUpperCase();
  } catch {
    return new Date()
      .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      .toUpperCase();
  }
}

function formatGeneratedTime(iso: string, timezone?: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
}

/* ─── Context tabs ──────────────────────────────────────────────────────── */

const TAB_CONFIG: { key: EngineContextKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'freshwater_lake_pond', label: 'LAKE / POND', icon: 'water' },
  { key: 'freshwater_river', label: 'RIVER', icon: 'git-merge-outline' },
  { key: 'coastal', label: 'INSHORE', icon: 'boat-outline' },
  { key: 'coastal_flats_estuary', label: 'FLATS / EST', icon: 'resize-outline' },
];

/* ─── Location helpers ──────────────────────────────────────────────────── */

function geocodeToDisplayLabel(g: Location.LocationGeocodedAddress): string | null {
  const city = g.city ?? g.subregion ?? g.district ?? g.name ?? undefined;
  const region = g.region ?? '';
  if (city && region) return `${city}, ${region}`;
  if (city) return city;
  if (region) return region;
  if (g.subregion) return g.subregion;
  return null;
}

async function resolveLocationLabelForPolish(
  lat: number,
  lon: number,
  currentLabel: string,
  allowCoastalFallback: boolean,
): Promise<string | null> {
  if (currentLabel !== 'Current location') {
    return currentLabel;
  }
  try {
    const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    const fromGeo = geo[0] ? geocodeToDisplayLabel(geo[0]) : null;
    if (fromGeo) return fromGeo;
  } catch {
    /* fall through */
  }
  return allowCoastalFallback ? oceanCoastalZoneLabel(lat, lon) : null;
}

function firstContextWithReport(
  bundles: Partial<Record<EngineContextKey, HowFishingRebuildBundle>>,
  contexts: EngineContextKey[],
): EngineContextKey | null {
  const hit = contexts.find((c) => bundles[c] != null);
  return hit ?? null;
}

function materializeForecastEnvForDate(
  snapshot: ForecastSnapshotEnv | null,
  targetDate: string | null,
): Record<string, unknown> | null {
  if (!snapshot) return null;
  const tideForDate =
    targetDate != null
      ? snapshot.forecast_tides_by_date?.find((entry) => entry.date === targetDate) ?? null
      : null;

  return {
    ...snapshot,
    coastal: tideForDate != null ? true : Boolean(snapshot.coastal),
    tides_available: tideForDate != null,
    nearest_tide_station_id: tideForDate?.station_id ?? snapshot.nearest_tide_station_id ?? null,
    tides: tideForDate
      ? {
          station_id: tideForDate.station_id,
          station_name: tideForDate.station_name,
          high_low: tideForDate.high_low,
          phase: tideForDate.phase,
          unit: tideForDate.unit,
        }
      : null,
  };
}

function todayDateFromForecastSnapshot(
  forecastSnapshot: Awaited<ReturnType<typeof getForecastScores>> | null,
): string | null {
  return forecastSnapshot?.forecast.find((day) => day.day_offset === 0)?.date ?? null;
}

function dayLabelFromDateStr(dateStr: string): string {
  try {
    return new Date(dateStr + 'T12:00:00')
      .toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
      .toUpperCase();
  } catch {
    return dateStr;
  }
}

/* ─── Screen ────────────────────────────────────────────────────────────── */

export default function HowFishingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    location_label?: string;
    day_offset?: string;
    target_date?: string;
  }>();
  const lat = params.lat != null ? parseFloat(params.lat) : NaN;
  const lon = params.lon != null ? parseFloat(params.lon) : NaN;
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lon);

  // Forecast day support: day_offset > 0 means this is a future-day report
  const dayOffset = params.day_offset != null ? parseInt(params.day_offset, 10) : 0;
  const targetDate = params.target_date ?? null;
  const isForecastDay = targetDate != null;
  const requestedLocationLabel =
    typeof params.location_label === 'string' && params.location_label.trim().length > 0
      ? params.location_label.trim()
      : null;

  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';
  const setLastReportEnv = useEnvStore((s) => s.setLastReportEnv);

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState<string>('Current location');
  const [forecastSnapshotCoastalEligible, setForecastSnapshotCoastalEligible] = useState<boolean | null>(null);

  const coastalEligible = useMemo(
    () => forecastSnapshotCoastalEligible ?? Boolean(env?.coastal),
    [forecastSnapshotCoastalEligible, env?.coastal],
  );
  const availableContexts: EngineContextKey[] = useMemo(
    () => howFishingMultiContexts(coastalEligible),
    [coastalEligible],
  );

  const availableTabs = useMemo(
    () => TAB_CONFIG.filter((t) => availableContexts.includes(t.key)),
    [availableContexts],
  );

  // Multi-report state
  const [multiBundles, setMultiBundles] = useState<Record<EngineContextKey, HowFishingRebuildBundle> | null>(null);
  const [activeTab, setActiveTab] = useState<EngineContextKey>('freshwater_lake_pond');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Keep the active tab valid when availableContexts shrinks (e.g. coastal drop).
  useEffect(() => {
    setActiveTab((prev) =>
      availableContexts.includes(prev) ? prev : (availableContexts[0] ?? 'freshwater_lake_pond'),
    );
  }, [availableContexts]);

  // Before paint: if the visible tab has no report (partial cache, race), jump to the first tab that does.
  useLayoutEffect(() => {
    if (!multiBundles) return;
    if (multiBundles[activeTab]) return;
    const next = firstContextWithReport(multiBundles, availableContexts);
    if (next) setActiveTab(next);
  }, [multiBundles, activeTab, availableContexts]);

  // Load env + geocode on mount
  useEffect(() => {
    if (!hasCoords) return;
    let cancelled = false;
    (async () => {
      setEnvLoading(true);
      try {
        if (requestedLocationLabel) {
          setLocationLabel(requestedLocationLabel);
        }
        const [cachedEnv, forecastSnapshot, geo] = await Promise.all([
          getEnvironment({ latitude: lat, longitude: lon, units }),
          getForecastScores(lat, lon).catch(() => null),
          requestedLocationLabel
            ? Promise.resolve([])
            : Location.reverseGeocodeAsync({ latitude: lat, longitude: lon }).catch(() => []),
        ]);
        if (cancelled) return;
        setEnv(cachedEnv as EnvironmentData);
        setForecastSnapshotCoastalEligible(
          Boolean((forecastSnapshot as Awaited<ReturnType<typeof getForecastScores>> | null)?.snapshot_env?.coastal),
        );
        if (requestedLocationLabel) {
          setLocationLabel(requestedLocationLabel);
        } else if (geo?.[0]) {
          const fromGeo = geocodeToDisplayLabel(geo[0]);
          setLocationLabel(
            fromGeo ??
              (((cachedEnv as EnvironmentData).coastal) ? oceanCoastalZoneLabel(lat, lon) : null) ??
              'Current location',
          );
        } else {
          setLocationLabel(
            (((cachedEnv as EnvironmentData).coastal) ? oceanCoastalZoneLabel(lat, lon) : null) ??
              'Current location',
          );
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
  }, [hasCoords, lat, lon, units, requestedLocationLabel]);

  // Check cache on mount, show confirm if not cached.
  // Forecast day reports use a separate per-(lat,lon,target_date,ctx) cache that
  // expires at tonight's midnight — so same-day re-opens are instant cache hits,
  // but the next calendar day always fetches fresh weather data.
  useEffect(() => {
    if (!hasCoords || envLoading) return;
    let cancelled = false;
    (async () => {
      if (isForecastDay && targetDate) {
        const cached = await getCachedForecastRebuild(lat, lon, targetDate, availableContexts);
        if (cancelled) return;
        if (cached) {
          const tab = firstContextWithReport(cached, availableContexts);
          if (tab) setActiveTab(tab);
          setMultiBundles(cached);
        } else {
          setShowConfirm(true);
        }
        return;
      }
      const cached = await getCachedMultiRebuild(lat, lon, availableContexts);
      if (cancelled) return;
      if (cached) {
        const tab = firstContextWithReport(cached, availableContexts);
        if (tab) setActiveTab(tab);
        setMultiBundles(cached);
        setCurrentMultiRebuild(lat, lon, cached);
      } else {
        setShowConfirm(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasCoords, envLoading, lat, lon, availableContexts, isForecastDay, targetDate]);

  const generateReports = useCallback(async () => {
    if (!hasCoords) return;
    setAnalysisLoading(true);
    setAnalysisError(null);
    setShowConfirm(false);
    try {
      const accessToken = await getValidAccessToken();
      const forecastSnapshot = await getForecastScores(lat, lon);
      const sharedForecastEnv = forecastSnapshot?.snapshot_env ?? null;
      const snapshotDateForReport = isForecastDay
        ? targetDate
        : todayDateFromForecastSnapshot(forecastSnapshot);
      const forecastEnvForReport = materializeForecastEnvForDate(
        sharedForecastEnv,
        snapshotDateForReport,
      );
      const envForReport =
        forecastEnvForReport ??
        env ??
        (await getEnvironment({ latitude: lat, longitude: lon, units }));

      const polishLocationName = await resolveLocationLabelForPolish(
        lat,
        lon,
        locationLabel,
        Boolean((forecastEnvForReport ?? env)?.coastal),
      );
      if (polishLocationName && locationLabel === 'Current location') {
        setLocationLabel(polishLocationName);
      }

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
          env_data: envForReport,
          use_forecast_snapshot: Boolean(forecastEnvForReport),
          location_name: polishLocationName,
          ...(isForecastDay && { day_offset: dayOffset, target_date: targetDate }),
        },
      });

      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error(
          (result as { message?: string }).message ?? (result as { error: string }).error,
        );
      }

      const multi = result as HowFishingRebuildMultiBundle;
      if (!multi || multi.feature !== 'hows_fishing_rebuild_v1' || !multi.reports) {
        throw new Error('Invalid response from server');
      }

      const bundles = multi.reports as Record<EngineContextKey, HowFishingRebuildBundle>;
      const tabWithReport = firstContextWithReport(bundles, availableContexts);
      if (!tabWithReport) {
        const failed = multi.failed_contexts?.join(', ') ?? '';
        throw new Error(
          failed
            ? `Reports failed for: ${failed}. Try again from the home screen.`
            : 'No fishing report was returned for this location. Try again from the home screen.',
        );
      }
      if (isForecastDay && targetDate) {
        await setCachedForecastRebuild(lat, lon, targetDate, multi);
      } else {
        await setCachedMultiRebuild(lat, lon, multi);
        setCurrentMultiRebuild(lat, lon, bundles);
      }
      setLastReportEnv((envForReport as EnvironmentData) ?? env);
      setActiveTab(tabWithReport);
      setMultiBundles(bundles);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setAnalysisError(msg);
      Alert.alert('Unable to generate reports', msg);
    } finally {
      setAnalysisLoading(false);
    }
  }, [
    hasCoords,
    lat,
    lon,
    units,
    availableContexts,
    locationLabel,
    setLastReportEnv,
    isForecastDay,
    dayOffset,
    targetDate,
    env,
  ]);

  // Pull-to-refresh / header Refresh: reload cached report if still valid; regenerate only on miss/expiry.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      let cached: Record<EngineContextKey, HowFishingRebuildBundle> | null = null;
      if (isForecastDay && targetDate) {
        cached = await getCachedForecastRebuild(lat, lon, targetDate, availableContexts);
      } else {
        cached = await getCachedMultiRebuild(lat, lon, availableContexts);
      }

      if (cached) {
        const tab = firstContextWithReport(cached, availableContexts);
        if (tab) setActiveTab(tab);
        setMultiBundles(cached);
        if (!isForecastDay) {
          setCurrentMultiRebuild(lat, lon, cached);
        }
        try {
          const refreshed = await getEnvironment({ latitude: lat, longitude: lon, units });
          setEnv(refreshed);
        } catch {
          /* keep existing env */
        }
        return;
      }

      await generateReports();
    } finally {
      setRefreshing(false);
    }
  }, [generateReports, availableContexts, lat, lon, units, isForecastDay, targetDate]);

  const activeBundle = multiBundles?.[activeTab] ?? null;
  const activeTz = activeBundle?.report.location.timezone ?? env?.timezone;
  const heroDateLabel = isForecastDay && targetDate
    ? dayLabelFromDateStr(targetDate)
    : `TODAY · ${currentLocationDateString(activeTz)}`;
  const reportDateLabel = isForecastDay && targetDate
    ? dayLabelFromDateStr(targetDate)
    : currentLocationDateString(activeTz);

  /* ── No coords ───────────────────────────────────────────────────── */
  if (!hasCoords) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PaperBackground style={styles.background}>
          <View style={styles.centered}>
            <View style={styles.noLocationIcon}>
              <Ionicons name="location-outline" size={28} color={paper.ink} />
            </View>
            <Text style={styles.messageTitle}>LOCATION REQUIRED</Text>
            <Text style={styles.messageSub}>
              How's Fishing needs your location so we can pull live conditions and build your report.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryBtnText}>GO BACK</Text>
            </Pressable>
          </View>
        </PaperBackground>
      </SafeAreaView>
    );
  }

  /* ── Confirmation / Generate surface ─────────────────────────────── */
  if (!multiBundles) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PaperBackground style={styles.background}>
          <TopLevelHeader
            dateLabel={heroDateLabel}
            locationLabel={locationLabel}
            onBack={() => router.back()}
          />

          <View style={styles.confirmOuter}>
            <TopographicLines style={styles.confirmLines} count={5} />

            {analysisLoading ? (
              <View style={styles.confirmCard}>
                <CornerMarkSet color={paper.red} />
                <View style={styles.loadingHub}>
                  <ActivityIndicator size="small" color={paper.ink} />
                </View>
                <Text style={styles.confirmTitle}>BUILDING YOUR REPORT</Text>
                <Text style={styles.confirmSub}>
                  Pulling live conditions for {availableContexts.length} water type
                  {availableContexts.length > 1 ? 's' : ''}…
                </Text>
              </View>
            ) : showConfirm ? (
              <View style={styles.confirmCard}>
                <CornerMarkSet color={paper.red} />

                <SectionEyebrow color={paper.red} size={10} tracking={3.5}>
                  {isForecastDay ? 'FORECAST' : "TODAY'S REPORT"}
                </SectionEyebrow>

                <Text style={styles.confirmTitle}>
                  HOW'S FISHING{'\n'}
                  <Text style={{ color: paper.forest }}>{isForecastDay ? 'ON THIS DAY?' : 'RIGHT NOW?'}</Text>
                </Text>

                <View style={styles.confirmMetaRow}>
                  <Ionicons name="location" size={12} color={paper.ink} />
                  <Text style={styles.confirmMetaText} numberOfLines={1}>
                    {locationLabel}
                  </Text>
                </View>
                <View style={styles.confirmMetaRow}>
                  <Ionicons name="calendar-outline" size={12} color={paper.ink} />
                  <Text style={styles.confirmMetaText}>{reportDateLabel}</Text>
                </View>

                <View style={styles.confirmContextList}>
                  {availableTabs.map((t) => (
                    <View key={t.key} style={styles.confirmContextChip}>
                      <Ionicons name={t.icon} size={12} color={paper.ink} />
                      <Text style={styles.confirmContextLabel}>{t.label}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={({ pressed }) => [styles.generateBtn, pressed && styles.generateBtnPressed]}
                  onPress={generateReports}
                  disabled={envLoading}
                >
                  <Ionicons name="sparkles" size={14} color={paper.paper} />
                  <Text style={styles.generateBtnText}>
                    {isForecastDay ? 'GENERATE FORECAST REPORT' : "GENERATE TODAY'S REPORT"}
                  </Text>
                </Pressable>

                {analysisError ? <Text style={styles.errorInline}>{analysisError}</Text> : null}
              </View>
            ) : null}
          </View>
        </PaperBackground>
      </SafeAreaView>
    );
  }

  /* ── Report view ─────────────────────────────────────────────────── */

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.background}>
        <TopLevelHeader
          dateLabel={heroDateLabel}
          locationLabel={locationLabel}
          generatedAt={
            activeBundle
              ? formatGeneratedTime(activeBundle.generated_at, activeTz)
              : undefined
          }
          onBack={() => router.back()}
        />

        {/* Context switcher — paper-styled tabs that span the full width
            equally so the user can clearly see which context is active. The
            bar is rendered only when there are at least 2 tabs. Preserves
            multi-context behavior (disabled state for tabs without a report). */}
        {availableTabs.length > 1 && (
          <View style={styles.contextTabBar}>
            {availableTabs.map((t) => {
              const isActive = activeTab === t.key;
              const hasReport = !!multiBundles[t.key];
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setActiveTab(t.key)}
                  disabled={!hasReport}
                  style={({ pressed }) => [
                    styles.contextTab,
                    isActive && styles.contextTabActive,
                    !hasReport && { opacity: 0.35 },
                    pressed && !isActive && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons
                    name={t.icon}
                    size={12}
                    color={isActive ? paper.paper : paper.ink}
                  />
                  <Text
                    style={[styles.contextTabLabel, isActive && styles.contextTabLabelActive]}
                    numberOfLines={1}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.reportContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={paper.ink}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {activeBundle ? (
            <RebuildReportView
              report={activeBundle.report}
              solunarData={env?.solunar}
              dateLabel={heroDateLabel}
            />
          ) : (
            <View style={styles.noReportCard}>
              <Text style={styles.noReportText}>Report unavailable for this water type.</Text>
            </View>
          )}
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

/* ─── Top header component ──────────────────────────────────────────────── */

function TopLevelHeader({
  dateLabel,
  locationLabel,
  generatedAt,
  onBack,
}: {
  dateLabel: string;
  locationLabel: string;
  /** Optional generated-at time string ("12:10 PM") shown next to the date. */
  generatedAt?: string;
  onBack: () => void;
}) {
  return (
    <View style={headerStyles.root}>
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={({ pressed }) => [headerStyles.backBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="chevron-back" size={14} color={paper.ink} />
        <Text style={headerStyles.backLabel}>BACK</Text>
      </Pressable>

      <View style={headerStyles.meta}>
        <Text style={headerStyles.metaDate} numberOfLines={1}>
          {dateLabel}
        </Text>
        <Text style={headerStyles.metaLoc} numberOfLines={1}>
          {locationLabel}
        </Text>
        {generatedAt ? (
          <Text style={headerStyles.metaTime} numberOfLines={1}>
            {`Generated ${generatedAt}`}
          </Text>
        ) : null}
      </View>

      {/* Right spacer balances the BACK button so the center block stays centered. */}
      <View style={headerStyles.rightSpacer} />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: 8,
    paddingBottom: 10,
    gap: paperSpacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
  },
  backLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.5,
    color: paper.ink,
    fontWeight: '700',
  },
  meta: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  metaDate: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    // Reduced from 3 → 1.8 so the "· 12:10 PM" tail never clips on narrow
    // devices. The date block still reads as an editorial eyebrow thanks to
    // uppercase/bold + the color accent.
    letterSpacing: 1.8,
    color: paper.red,
    fontWeight: '700',
    textAlign: 'center',
  },
  metaLoc: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12,
    color: paper.ink,
    opacity: 0.75,
    marginTop: 2,
    textAlign: 'center',
  },
  metaTime: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9.5,
    color: paper.ink,
    opacity: 0.55,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  rightSpacer: {
    // Balances the BACK button width visually. Slimmed so the center meta
    // block has enough room for "SAT, APR 25 · 12:10 PM" without clipping.
    width: 58,
  },
});

/* ─── Styles ────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  background: { flex: 1 },
  scroll: { flex: 1 },
  reportContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
    paddingTop: paperSpacing.sm,
  },

  /* Context switcher — full-width tab bar. Each tab is `flex: 1` so two tabs
     split 50/50 and four tabs split 25/25/25/25. Active tab fills with ink
     and inverts its label color; inactive tabs are subdued so the selection
     is visually obvious. */
  contextTabBar: {
    flexDirection: 'row',
    marginHorizontal: paperSpacing.lg,
    marginBottom: paperSpacing.md,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
    overflow: 'hidden',
  },
  contextTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 4,
    // Vertical divider between inactive tabs so the split is obvious even
    // before a tab is active.
    borderRightWidth: 1,
    borderRightColor: paper.inkHair,
  },
  contextTabActive: {
    backgroundColor: paper.ink,
    borderRightColor: paper.ink,
  },
  contextTabLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.5,
    color: paper.ink,
    fontWeight: '700',
  },
  contextTabLabelActive: {
    color: paper.paper,
  },

  /* Confirmation surface */
  confirmOuter: {
    flex: 1,
    padding: paperSpacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  confirmLines: {
    // Absolute; positioned relative to the container around the card.
    top: 40,
    left: 0,
    right: 0,
    bottom: 40,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg + 6,
    paddingBottom: paperSpacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  confirmTitle: {
    fontFamily: paperFonts.display,
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -0.8,
    fontWeight: '700',
    color: paper.ink,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.md,
  },
  confirmSub: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: paperSpacing.sm,
  },
  confirmMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  confirmMetaText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.8,
  },
  confirmContextList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: paperSpacing.md,
    marginBottom: paperSpacing.md + 2,
  },
  confirmContextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
  },
  confirmContextLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.5,
    color: paper.ink,
    fontWeight: '700',
  },
  loadingHub: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: paper.ink,
    backgroundColor: paper.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: paperSpacing.sm,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: paper.ink,
    borderRadius: paperRadius.chip,
    borderWidth: 2,
    borderColor: paper.ink,
    minHeight: 48,
    paddingHorizontal: paperSpacing.lg,
    width: '100%',
    ...paperShadows.hard,
  },
  generateBtnPressed: {
    backgroundColor: paper.forest,
    borderColor: paper.forest,
  },
  generateBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    color: paper.paper,
    fontWeight: '700',
  },

  /* No-coords centered */
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: paperSpacing.xl,
    gap: paperSpacing.md,
  },
  noLocationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: paper.ink,
    backgroundColor: paper.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: paperSpacing.sm,
  },
  messageTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    letterSpacing: -0.4,
    fontWeight: '700',
    color: paper.ink,
    textAlign: 'center',
  },
  messageSub: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: paperSpacing.md,
  },
  primaryBtn: {
    backgroundColor: paper.ink,
    borderRadius: paperRadius.chip,
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: paperSpacing.xl,
    marginTop: paperSpacing.sm,
    ...paperShadows.hard,
  },
  primaryBtnPressed: { backgroundColor: paper.forest, borderColor: paper.forest },
  primaryBtnText: {
    color: paper.paper,
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '700',
  },

  errorInline: {
    fontFamily: paperFonts.body,
    color: paper.red,
    textAlign: 'center',
    marginTop: paperSpacing.sm,
    fontSize: 13,
  },

  noReportCard: {
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    padding: paperSpacing.lg,
    alignItems: 'center',
  },
  noReportText: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
    textAlign: 'center',
  },
});
