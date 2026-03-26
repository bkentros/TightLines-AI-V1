import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus, View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import { LiveConditionsWidget } from '../../components/LiveConditionsWidget';
import { SubscribePrompt } from '../../components/SubscribePrompt';
import { LocationPickerModal } from '../../components/LocationPickerModal';
import { useAuthStore } from '../../store/authStore';
import { useDevTestingStore } from '../../store/devTestingStore';
import { useEnvStore } from '../../store/envStore';
import { useLocationStore } from '../../store/locationStore';
import { getEffectiveTier, canUseAIFeatures } from '../../lib/subscription';
import { getCurrentMultiRebuild, getCachedMultiRebuild } from '../../lib/howFishing';
import type { EngineContextKey } from '../../lib/howFishingRebuildContracts';
import { isCoastalContextEligible } from '../../lib/coastalProximity';
import {
  getForecastScores,
  invalidateForecastCache,
  formatScoreDisplay,
  meanDayScore,
  scoreColor,
  type DayForecastScore,
} from '../../lib/forecastScores';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const {
    ignoreGps,
    overrideLocation,
    overrideSubscriptionTier,
    load: loadDevTesting,
    clearOverride,
    setIgnoreGps,
  } = useDevTestingStore();
  const { loadEnv } = useEnvStore();
  const {
    savedLocation,
    useCustom,
    setSavedLocation,
    clearSavedLocation,
    setUseCustom,
    load: loadLocationStore,
  } = useLocationStore();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastAutoRefreshAtRef = useRef(0);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsLocationLabel, setGpsLocationLabel] = useState<string | null>(null);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [cachedScore, setCachedScore] = useState<string | null>(null);
  /** Mean 0–100 across today's multi-tab cached reports — aligns hero + "Today" chip with Lake/River/Coastal tabs. */
  const [cachedMeanRaw, setCachedMeanRaw] = useState<number | null>(null);
  const [forecastDays, setForecastDays] = useState<DayForecastScore[] | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  // ── Active coordinates and label ──────────────────────────────────────────
  // Priority: saved custom pin > DEV ignoreGps (no coords) > DEV override > GPS
  // Dev presets (Settings) override GPS until the user syncs GPS or taps "Use my GPS"
  // in the picker — then we clear override + ignore (see handleUseGPS / handleRequestLocation).
  const coords =
    useCustom && savedLocation
      ? { lat: savedLocation.lat, lon: savedLocation.lon }
      : __DEV__ && ignoreGps
        ? null
        : __DEV__ && overrideLocation
          ? { lat: overrideLocation.lat, lon: overrideLocation.lon }
          : gpsCoords;

  const locationLabel =
    useCustom && savedLocation
      ? savedLocation.label
      : __DEV__ && overrideLocation
        ? overrideLocation.label
        : gpsLocationLabel ?? 'Current location';

  // GPS label for use in the picker ("you are here" context)
  const gpsLabel = gpsLocationLabel ?? 'Current location';

  useEffect(() => {
    if (!gpsCoords) {
      setGpsLocationLabel(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: gpsCoords.lat,
          longitude: gpsCoords.lon,
        });
        if (cancelled || !geo) return;
        const city = geo.city ?? geo.subregion ?? geo.district;
        const region = geo.region ?? '';
        const label = city && region ? `${city}, ${region}` : city ?? region ?? null;
        if (!cancelled) setGpsLocationLabel(label);
      } catch {
        if (!cancelled) setGpsLocationLabel(null);
      }
    })();
    return () => { cancelled = true; };
  }, [gpsCoords?.lat, gpsCoords?.lon]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setGpsCoords({
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          });
        }
      } catch {
        // Silently fail
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (__DEV__) loadDevTesting();
  }, [loadDevTesting]);

  // Load persisted location preference on mount
  useEffect(() => {
    loadLocationStore();
  }, [loadLocationStore]);

  const cacheMeanRequestSeq = useRef(0);

  const loadCachedReportMean = useCallback(async () => {
    const req = ++cacheMeanRequestSeq.current;
    const lat = coords?.lat;
    const lon = coords?.lon;
    if (lat == null || lon == null) {
      if (req === cacheMeanRequestSeq.current) {
        setCachedMeanRaw(null);
        setCachedScore(null);
      }
      return;
    }

    const coastal = isCoastalContextEligible(lat, lon);
    const contexts: EngineContextKey[] = coastal
      ? ['freshwater_lake_pond', 'freshwater_river', 'coastal']
      : ['freshwater_lake_pond', 'freshwater_river'];

    const inMemory = getCurrentMultiRebuild(lat, lon);
    const hasAllInMemory =
      inMemory != null && contexts.every((ctx) => inMemory[ctx] != null);
    const source = hasAllInMemory
      ? inMemory!
      : await getCachedMultiRebuild(lat, lon, contexts);

    if (req !== cacheMeanRequestSeq.current) return;

    if (!source) {
      setCachedMeanRaw(null);
      setCachedScore(null);
      return;
    }

    const scores = contexts.map((ctx) => source[ctx]!.report.score);
    const meanRaw = scores.reduce((a, b) => a + b, 0) / scores.length;

    const v = Math.round(meanRaw) / 10;
    const display = Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
    setCachedMeanRaw(meanRaw);
    setCachedScore(display);
  }, [coords?.lat, coords?.lon]);

  // Read cached multi-tab mean — matches How's Fishing tabs (same contexts as meanDayScore).
  useEffect(() => {
    void loadCachedReportMean();
  }, [loadCachedReportMean]);

  // Refresh when returning from How's Fishing so today's chip matches freshly generated tabs.
  useFocusEffect(
    useCallback(() => {
      void loadCachedReportMean();
    }, [loadCachedReportMean]),
  );

  // Load 7-day forecast scores — cached up to 6h, no API call if fresh
  useEffect(() => {
    const lat = coords?.lat;
    const lon = coords?.lon;
    if (lat == null || lon == null) return;
    let cancelled = false;

    (async () => {
      setForecastLoading(true);
      try {
        const result = await getForecastScores(lat, lon);
        if (!cancelled && result) setForecastDays(result.forecast);
      } catch {
        // Silent fail — calendar just won't show
      } finally {
        if (!cancelled) setForecastLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [coords?.lat, coords?.lon]);

  const refreshLiveConditions = useCallback(() => {
    const now = Date.now();
    if (now - lastAutoRefreshAtRef.current < 3000) return;
    lastAutoRefreshAtRef.current = now;

    const units = profile?.preferred_units ?? 'imperial';
    if (coords) {
      loadEnv(coords.lat, coords.lon, { units });
    }
  }, [profile?.preferred_units, coords, loadEnv]);

  useFocusEffect(
    useCallback(() => {
      refreshLiveConditions();
      // Refresh the cached score when user returns to the home tab,
      // so a newly-generated report immediately updates the displayed number.
      if (coords) {
        const coastal = isCoastalContextEligible(coords.lat, coords.lon);
        const contexts: EngineContextKey[] = coastal
          ? ['freshwater_lake_pond', 'freshwater_river', 'coastal']
          : ['freshwater_lake_pond', 'freshwater_river'];
        const inMemory = getCurrentMultiRebuild(coords.lat, coords.lon);
        if (inMemory && contexts.every((ctx) => inMemory[ctx] != null)) {
          const meanRaw =
            contexts.reduce((sum, ctx) => sum + inMemory[ctx]!.report.score, 0) / contexts.length;
          const v = Math.round(meanRaw) / 10;
          setCachedScore(Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1));
        }
      }
    }, [refreshLiveConditions, coords])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const wasBackgrounded =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';
      if (wasBackgrounded && nextAppState === 'active') {
        refreshLiveConditions();
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, [refreshLiveConditions]);

  const effectiveTier = getEffectiveTier(profile, overrideSubscriptionTier ?? null);
  const hasSubscription = canUseAIFeatures(effectiveTier);

  // ── Location picker handlers ──────────────────────────────────────────────

  const handleLocationSelect = useCallback(async (loc: { lat: number; lon: number; label: string }) => {
    // Invalidate forecast cache for the OLD location before switching
    if (coords) invalidateForecastCache(coords.lat, coords.lon);
    await setSavedLocation(loc);
    setShowLocationPicker(false);
    // Clear stale forecast/score data — fresh data will load via useEffect deps
    setForecastDays(null);
    setCachedScore(null);
    // Immediately load env for the new location
    const units = profile?.preferred_units ?? 'imperial';
    loadEnv(loc.lat, loc.lon, { units });
  }, [coords, setSavedLocation, profile?.preferred_units, loadEnv]);

  const handleUseGPS = useCallback(async () => {
    if (coords && useCustom) invalidateForecastCache(coords.lat, coords.lon);
    if (__DEV__) {
      await clearOverride();
      await setIgnoreGps(false);
    }
    await clearSavedLocation();
    setShowLocationPicker(false);
    setForecastDays(null);
    setCachedScore(null);
    setCachedMeanRaw(null);
  }, [coords, useCustom, clearSavedLocation, clearOverride, setIgnoreGps]);

  const handleHowFishingPress = useCallback(() => {
    if (!hasSubscription) {
      setShowSubscribePrompt(true);
      return;
    }
    if (!coords) {
      router.push({ pathname: '/how-fishing' });
      return;
    }
    router.push({
      pathname: '/how-fishing',
      params: { lat: String(coords.lat), lon: String(coords.lon) },
    });
  }, [hasSubscription, coords, router]);

  const handleRequestLocation = useCallback(async () => {
    if (__DEV__) {
      await clearOverride();
      await setIgnoreGps(false);
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setGpsCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
  }, [clearOverride, setIgnoreGps]);

  const isCoastal = coords ? isCoastalContextEligible(coords.lat, coords.lon) : false;

  const combinedOutlookScore = (day: DayForecastScore): number =>
    meanDayScore(day, isCoastal);

  const getQualityLabel = (raw: number): string => {
    if (raw >= 80) return 'EXCELLENT';
    if (raw >= 60) return 'GOOD';
    if (raw >= 40) return 'FAIR';
    return 'POOR';
  };

  // Hero + "Today" chip: prefer mean of cached multi-tab reports (same math as tabs) when available;
  // otherwise deterministic 7-day strip (Open-Meteo–only engine — can diverge slightly from full env).
  const todayForecast = forecastDays?.[0] ?? null;
  const heroScore =
    cachedMeanRaw != null
      ? formatScoreDisplay(cachedMeanRaw)
      : todayForecast
        ? formatScoreDisplay(combinedOutlookScore(todayForecast))
        : cachedScore;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 5) return 'Up early';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Evening';
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <Ionicons name="fish" size={16} color={colors.textOnPrimary} />
            </View>
            <Text style={styles.brand}>TightLines AI</Text>
          </View>
          <Text style={styles.greeting}>
            {getGreeting()}. What's the plan?
          </Text>

          {/* ── Location Row ── */}
          <Pressable
            style={({ pressed }) => [
              styles.locationRow,
              pressed && styles.locationRowPressed,
            ]}
            onPress={() => setShowLocationPicker(true)}
          >
            <Ionicons
              name={useCustom && savedLocation ? 'pin' : 'locate-outline'}
              size={13}
              color={useCustom && savedLocation ? colors.primary : colors.textMuted}
            />
            <Text style={styles.locationRowLabel} numberOfLines={1}>
              {locationLabel}
            </Text>
            {useCustom && savedLocation ? (
              <View style={styles.locationCustomChip}>
                <Text style={styles.locationCustomChipText}>Custom</Text>
              </View>
            ) : (
              <View style={styles.locationGpsChip}>
                <Text style={styles.locationGpsChipText}>GPS</Text>
              </View>
            )}
            <Ionicons name="chevron-down" size={11} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* ─── Location Picker Modal ─── */}
        <LocationPickerModal
          visible={showLocationPicker}
          currentLabel={useCustom && savedLocation ? savedLocation.label : gpsLabel}
          isUsingCustom={useCustom && savedLocation != null}
          savedLocation={useCustom && savedLocation ? savedLocation : null}
          onSelect={handleLocationSelect}
          onUseGPS={handleUseGPS}
          onClose={() => setShowLocationPicker(false)}
        />

        {/* ─── 7-Day Forecast Calendar ─── */}
        {coords && (forecastLoading || (forecastDays && forecastDays.length > 0)) && (
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <View style={styles.calendarTitleRow}>
                <Ionicons name="calendar-outline" size={12} color={colors.primary} />
                <Text style={styles.calendarTitle}>7-Day Outlook</Text>
              </View>
              <Text style={styles.calendarHint}>Tap any day</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarRow}
            >
              {forecastLoading && !forecastDays
                ? Array.from({ length: 7 }).map((_, i) => (
                    <View key={i} style={[styles.calendarDay, styles.calendarDaySkeleton]} />
                  ))
                : forecastDays?.map((day) => {
                    const raw =
                      day.day_offset === 0 && cachedMeanRaw != null
                        ? cachedMeanRaw
                        : combinedOutlookScore(day);
                    const display = formatScoreDisplay(raw);
                    const color = scoreColor(raw);
                    const isToday = day.day_offset === 0;
                    const quality = getQualityLabel(raw);
                    return (
                      <Pressable
                        key={day.date}
                        style={({ pressed }) => [
                          styles.calendarDay,
                          isToday && styles.calendarDayToday,
                          pressed && styles.calendarDayPressed,
                        ]}
                        onPress={() => {
                          if (!hasSubscription) {
                            setShowSubscribePrompt(true);
                            return;
                          }
                          if (!coords) return;
                          if (day.day_offset === 0) {
                            router.push({
                              pathname: '/how-fishing',
                              params: { lat: String(coords.lat), lon: String(coords.lon) },
                            });
                            return;
                          }
                          router.push({
                            pathname: '/how-fishing',
                            params: {
                              lat: String(coords.lat),
                              lon: String(coords.lon),
                              day_offset: String(day.day_offset),
                              target_date: day.date,
                            },
                          });
                        }}
                      >
                        <Text style={[styles.calendarDayLabel, isToday && styles.calendarDayLabelToday]}>
                          {day.day_label}
                        </Text>
                        <Text style={[styles.calendarDateNum, isToday && styles.calendarDateNumToday]}>
                          {day.month_day}
                        </Text>
                        <View style={styles.calendarScoreWrap}>
                          <Text style={[styles.calendarScore, { color }]}>{display}</Text>
                        </View>
                        <Text style={[styles.calendarQuality, { color }]}>{quality}</Text>
                        <View style={[styles.calendarBar, { backgroundColor: color }]} />
                      </Pressable>
                    );
                  })}
            </ScrollView>
          </View>
        )}

        {/* ─── Hero: How's Fishing Right Now? ─── */}
        <Pressable
          style={({ pressed }) => [
            styles.heroCard,
            pressed && styles.heroCardPressed,
          ]}
          onPress={handleHowFishingPress}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <View style={styles.heroBadge}>
                <Ionicons name="sparkles" size={10} color={colors.primary} />
                <Text style={styles.heroBadgeText}>AI-Enhanced</Text>
              </View>
              <Text style={styles.heroTitle}>How's Fishing{'\n'}Right Now?</Text>
              <Text style={styles.heroSubtitle}>
                Real-time conditions, timing, and strategy
              </Text>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.heroPulseOuter}>
                <View style={styles.heroPulseInner}>
                  <Ionicons name="pulse" size={24} color={colors.primary} />
                </View>
              </View>
              {heroScore !== null && (
                <Text style={styles.heroScoreNum}>{heroScore}</Text>
              )}
            </View>
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>View today's report</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </View>
        </Pressable>

        <SubscribePrompt
          visible={showSubscribePrompt}
          onDismiss={() => setShowSubscribePrompt(false)}
          onViewPlans={() => {
            setShowSubscribePrompt(false);
            router.push('/subscribe');
          }}
        />

        {/* ─── Live Conditions ─── */}
        <LiveConditionsWidget
          latitude={coords?.lat}
          longitude={coords?.lon}
          locationLabel={locationLabel}
          onRequestLocation={
            __DEV__ && ignoreGps ? undefined : handleRequestLocation
          }
          onPress={handleHowFishingPress}
        />

        {/* ─── Section Label ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tools</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* ─── Feature Tiles ─── */}
        <View style={styles.tiles}>
          {/* Lure & Fly Recommender */}
          <Pressable
            style={({ pressed }) => [
              styles.featureCard,
              pressed && styles.featureCardPressed,
            ]}
            onPress={() => router.push('/recommender')}
          >
            <View style={styles.featureTop}>
              <View style={[styles.featureIconWrap, { backgroundColor: colors.primaryMist }]}>
                <Ionicons name="fish" size={20} color={colors.primary} />
              </View>
              <View style={styles.featureArrow}>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </View>
            <Text style={styles.featureTitle}>Lure & Fly Recommender</Text>
            <Text style={styles.featureDesc}>
              AI-powered tackle picks tailored to real-time conditions and target species.
            </Text>
            <View style={[styles.aiBadge, { backgroundColor: colors.primaryMist }]}>
              <Ionicons name="sparkles" size={10} color={colors.primary} />
              <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI-Powered</Text>
            </View>
          </Pressable>

          {/* Water Reader */}
          <Pressable
            style={({ pressed }) => [
              styles.featureCard,
              pressed && styles.featureCardPressed,
            ]}
            onPress={() => router.push('/water-reader')}
          >
            <View style={styles.featureTop}>
              <View style={[styles.featureIconWrap, { backgroundColor: colors.waterBlue + '14' }]}>
                <Ionicons name="scan" size={20} color={colors.waterBlue} />
              </View>
              <View style={styles.featureArrow}>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </View>
            <Text style={styles.featureTitle}>Water Reader</Text>
            <Text style={styles.featureDesc}>
              Analyze river photos and satellite images with AI-powered visual overlays.
            </Text>
            <View style={[styles.aiBadge, { backgroundColor: colors.waterBlue + '14' }]}>
              <Ionicons name="sparkles" size={10} color={colors.waterBlue} />
              <Text style={[styles.aiBadgeText, { color: colors.waterBlue }]}>AI-Powered</Text>
            </View>
          </Pressable>

          {/* Trip Planner — Coming Soon */}
          <View style={styles.featureCardDisabled}>
            <View style={styles.featureTop}>
              <View style={[styles.featureIconWrap, { backgroundColor: colors.plannerYellow + '14' }]}>
                <Ionicons name="calendar-outline" size={20} color={colors.plannerYellow} />
              </View>
              <View style={styles.comingSoonPill}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            </View>
            <Text style={styles.featureTitleDisabled}>Trip Planner</Text>
            <Text style={styles.featureDescDisabled}>
              Plan your trip with ranked fishing windows from weather, tides, and solunar data.
            </Text>
          </View>
        </View>

        {/* ─── Tagline ─── */}
        <Text style={styles.tagline}>
          Tight lines start with better intel.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: spacing.xxl },

  /* Header */
  header: { paddingTop: spacing.xl, marginBottom: spacing.lg },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  brandIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    letterSpacing: 0.3,
  },
  greeting: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },

  /* Location Row */
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationRowPressed: {
    backgroundColor: colors.primaryMist,
    borderColor: colors.primary + '40',
  },
  locationRowLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.text,
    maxWidth: 180,
  },
  locationCustomChip: {
    backgroundColor: colors.primary + '18',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  locationCustomChipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationGpsChip: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  locationGpsChipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Hero Card — How's Fishing */
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    ...shadows.lg,
  },
  heroCardPressed: {
    backgroundColor: colors.primaryMist,
    transform: [{ scale: 0.985 }],
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroLeft: { flex: 1, paddingRight: spacing.md },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMist,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm + 2,
  },
  heroBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.text,
    lineHeight: 28,
    marginBottom: spacing.xs + 2,
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
  },
  heroPulseOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPulseInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroScoreNum: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.primary,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heroFooterText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary,
  },

  /* 7-Day Forecast Calendar */
  calendarSection: {
    marginBottom: spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 2,
  },
  calendarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  calendarTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  calendarHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  calendarRow: {
    gap: 8,
    paddingRight: 4,
  },
  calendarDay: {
    width: 76,
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.sm,
  },
  calendarDayToday: {
    borderColor: colors.primary + '55',
    backgroundColor: colors.primaryMist,
  },
  calendarDayPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.95 }],
  },
  calendarDaySkeleton: {
    height: 124,
    backgroundColor: colors.border,
    opacity: 0.35,
  },
  calendarDayLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    textAlign: 'center',
  },
  calendarDayLabelToday: {
    color: colors.primary,
  },
  calendarDateNum: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 6,
  },
  calendarDateNumToday: {
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
  },
  calendarScoreWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  calendarScore: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  calendarQuality: {
    fontFamily: fonts.bodyBold,
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    textAlign: 'center',
    marginBottom: 10,
  },
  calendarBar: {
    width: '100%',
    height: 4,
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  /* Feature Cards */
  tiles: { gap: spacing.md },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  featureCardPressed: {
    backgroundColor: colors.surfacePressed,
    transform: [{ scale: 0.985 }],
  },
  featureCardDisabled: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.55,
  },
  featureTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureTitleDisabled: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  featureDescDisabled: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm + 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  aiBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  comingSoonPill: {
    backgroundColor: colors.plannerYellow,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  comingSoonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  tagline: {
    fontFamily: fonts.bodyItalic,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
});
