import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AppState, type AppStateStatus, View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';

const LOGO = require('../../assets/images/fish/new_logo.png');

// Calendar sizing — 6 cards + 5 gaps must fit inside content width (screen - 40px padding)
const SCREEN_W = Dimensions.get('window').width;
const CAL_GAP = 6;
const CAL_CARD_W = Math.floor((SCREEN_W - 40 - CAL_GAP * 5) / 6);
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
import { howFishingMultiContexts } from '../../lib/howFishingRebuildContracts';
import {
  getForecastScores,
  invalidateForecastCache,
  formatScoreDisplay,
  meanDayScore,
  scoreColor,
  type DayForecastScore,
} from '../../lib/forecastScores';
import { recordRecentLocation } from '../../lib/recentLocations';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const {
    ignoreGps,
    overrideSubscriptionTier,
    load: loadDevTesting,
    setIgnoreGps,
  } = useDevTestingStore();
  const loadEnv = useEnvStore((s) => s.loadEnv);
  const envData = useEnvStore((s) => s.envData);
  const envLastCoords = useEnvStore((s) => s.lastCoords);
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
  /** Latest generated live-report score for today, when available. */
  const [cachedScore, setCachedScore] = useState<string | null>(null);
  /** Mean 0–100 across today's multi-tab cached reports — only populated after report generation. */
  const [cachedMeanRaw, setCachedMeanRaw] = useState<number | null>(null);
  const [forecastDays, setForecastDays] = useState<DayForecastScore[] | null>(null);
  const [forecastCoastalEligible, setForecastCoastalEligible] = useState<boolean | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  // ── Active coordinates and label ──────────────────────────────────────────
  // Priority: saved custom pin > DEV ignoreGps (no coords) > GPS
  // Dev: ignore GPS simulates missing location until the user taps "Use my GPS" in the picker.
  //
  // Memoize `{ lat, lon }` so the reference is stable when values are unchanged. A fresh object
  // every render breaks useFocusEffect / useCallback deps and causes an infinite loop (loadEnv →
  // re-render → new coords ref → focus effect re-runs → loadEnv).
  const coords = useMemo(() => {
    if (useCustom && savedLocation) {
      return { lat: savedLocation.lat, lon: savedLocation.lon };
    }
    if (__DEV__ && ignoreGps) return null;
    return gpsCoords;
  }, [
    useCustom,
    savedLocation?.lat,
    savedLocation?.lon,
    ignoreGps,
    gpsCoords?.lat,
    gpsCoords?.lon,
  ]);

  const locationLabel =
    useCustom && savedLocation
      ? savedLocation.label
      : gpsLocationLabel ?? 'Current location';

  // GPS label for use in the picker ("you are here" context)
  const gpsLabel = gpsLocationLabel ?? 'Current location';
  const envMatchesCoords =
    coords != null &&
    envData != null &&
    envLastCoords != null &&
    Math.abs(envLastCoords.lat - coords.lat) < 0.01 &&
    Math.abs(envLastCoords.lon - coords.lon) < 0.01;
  const locationCoastalEligible = envMatchesCoords
    ? Boolean(envData?.coastal)
    : (forecastCoastalEligible ?? false);

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

    const contexts = howFishingMultiContexts(locationCoastalEligible);

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
  }, [coords?.lat, coords?.lon, locationCoastalEligible]);

  // Read cached multi-tab mean — matches How's Fishing tabs (same contexts as meanDayScore).
  useEffect(() => {
    void loadCachedReportMean();
  }, [loadCachedReportMean]);

  // Refresh when returning from How's Fishing so the hero reflects freshly generated tabs.
  useFocusEffect(
    useCallback(() => {
      void loadCachedReportMean();
    }, [loadCachedReportMean]),
  );

  const forecastFetchSeq = useRef(0);
  const loadForecastScores = useCallback(async () => {
    const lat = coords?.lat;
    const lon = coords?.lon;
    if (lat == null || lon == null) {
      setForecastDays(null);
      return;
    }
    const mySeq = ++forecastFetchSeq.current;
    setForecastLoading(true);
    try {
      const result = await getForecastScores(lat, lon);
      if (mySeq !== forecastFetchSeq.current) return;
      if (result) {
        setForecastDays(result.forecast);
        setForecastCoastalEligible(Boolean(result.snapshot_env?.coastal));
      }
    } catch {
      if (mySeq === forecastFetchSeq.current) {
        setForecastDays(null);
        setForecastCoastalEligible(null);
      }
    } finally {
      if (mySeq === forecastFetchSeq.current) setForecastLoading(false);
    }
  }, [coords?.lat, coords?.lon]);

  // Load 7-day forecast scores — stable until fishing-location midnight.
  useEffect(() => {
    void loadForecastScores();
    return () => {
      forecastFetchSeq.current++;
    };
  }, [loadForecastScores]);

  const refreshLiveConditions = useCallback(() => {
    const now = Date.now();
    if (now - lastAutoRefreshAtRef.current < 3000) return;
    lastAutoRefreshAtRef.current = now;

    const units = profile?.preferred_units ?? 'imperial';
    const lat = coords?.lat;
    const lon = coords?.lon;
    if (lat != null && lon != null) {
      loadEnv(lat, lon, { units });
    }
  }, [profile?.preferred_units, coords?.lat, coords?.lon, loadEnv]);

  useFocusEffect(
    useCallback(() => {
      refreshLiveConditions();
      void loadForecastScores();
      // Refresh the cached score when user returns to the home tab,
      // so a newly-generated report immediately updates the displayed number.
      if (coords) {
        const contexts = howFishingMultiContexts(locationCoastalEligible);
        const inMemory = getCurrentMultiRebuild(coords.lat, coords.lon);
        if (inMemory && contexts.every((ctx) => inMemory[ctx] != null)) {
          const meanRaw =
            contexts.reduce((sum, ctx) => sum + inMemory[ctx]!.report.score, 0) / contexts.length;
          const v = Math.round(meanRaw) / 10;
          setCachedScore(Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1));
        }
      }
    }, [refreshLiveConditions, loadForecastScores, coords?.lat, coords?.lon, locationCoastalEligible])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const wasBackgrounded =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';
      if (wasBackgrounded && nextAppState === 'active') {
        refreshLiveConditions();
        void loadForecastScores();
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, [refreshLiveConditions, loadForecastScores]);

  const effectiveTier = getEffectiveTier(profile, overrideSubscriptionTier ?? null);
  const hasSubscription = canUseAIFeatures(effectiveTier);

  // ── Location picker handlers ──────────────────────────────────────────────

  const handleLocationSelect = useCallback(async (loc: { lat: number; lon: number; label: string }) => {
    // Invalidate forecast cache for the OLD location before switching
    if (coords) invalidateForecastCache(coords.lat, coords.lon);
    await recordRecentLocation({ lat: loc.lat, lon: loc.lon, label: loc.label });
    await setSavedLocation(loc);
    setShowLocationPicker(false);
    // Clear stale forecast/score data — fresh data will load via useEffect deps
    setForecastDays(null);
    setForecastCoastalEligible(null);
    setCachedScore(null);
    setCachedMeanRaw(null);
    // Immediately load env for the new location
    const units = profile?.preferred_units ?? 'imperial';
    loadEnv(loc.lat, loc.lon, { units });
  }, [coords, setSavedLocation, profile?.preferred_units, loadEnv]);

  const handleUseGPS = useCallback(async () => {
    if (coords && useCustom) invalidateForecastCache(coords.lat, coords.lon);
    if (__DEV__) {
      await setIgnoreGps(false);
    }
    await clearSavedLocation();
    setShowLocationPicker(false);
    setForecastDays(null);
    setForecastCoastalEligible(null);
    setCachedScore(null);
    setCachedMeanRaw(null);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const label = gpsLocationLabel ?? 'Current location';
        await recordRecentLocation({
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          label,
        });
      }
    } catch {
      /* non-fatal */
    }
  }, [coords, useCustom, clearSavedLocation, setIgnoreGps, gpsLocationLabel]);

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
      params: { lat: String(coords.lat), lon: String(coords.lon), location_label: locationLabel },
    });
  }, [hasSubscription, coords, locationLabel, router]);

  const handleRecommenderPress = useCallback(() => {
    if (!hasSubscription) {
      setShowSubscribePrompt(true);
      return;
    }
    const params: Record<string, string> = {};
    if (coords) {
      params.latitude = String(coords.lat);
      params.longitude = String(coords.lon);
    }
    router.push({ pathname: '/recommender', params });
  }, [hasSubscription, coords, router]);

  const handleRequestLocation = useCallback(async () => {
    if (__DEV__) {
      await setIgnoreGps(false);
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setGpsCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
  }, [setIgnoreGps]);

  const combinedOutlookScore = (day: DayForecastScore): number =>
    meanDayScore(day, locationCoastalEligible);

  const getQualityLabel = (raw: number): string => {
    if (raw >= 80) return 'EXCELLENT';
    if (raw >= 60) return 'GOOD';
    if (raw >= 40) return 'FAIR';
    return 'POOR';
  };

  const heroScore =
    cachedMeanRaw != null ? formatScoreDisplay(cachedMeanRaw) : cachedScore;
  const forecastDisplayDays = forecastDays?.filter((day) => day.day_offset > 0) ?? [];

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
          {/* Row 1: FinFindr left — location pill right, perfectly baseline-aligned */}
          <View style={styles.headerTopRow}>
            <View style={styles.brandRow}>
              <Image source={LOGO} style={styles.brandLogo} resizeMode="contain" />
              <Text style={styles.brand}>FinFindr</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.locationRow,
                pressed && styles.locationRowPressed,
              ]}
              onPress={() => setShowLocationPicker(true)}
            >
              <Ionicons
                name={useCustom && savedLocation ? 'pin' : 'locate-outline'}
                size={12}
                color={useCustom && savedLocation ? colors.primary : colors.textMuted}
              />
              <Text style={styles.locationRowLabel} numberOfLines={1} ellipsizeMode="tail">
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
              <Ionicons name="chevron-down" size={10} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Full-width green accent line — clean visual break */}
          <View style={styles.headerLine} />

          {/* Tagline centered */}
          <Text style={styles.greeting}>We help you find more fins.</Text>
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
        {coords && (forecastLoading || forecastDisplayDays.length > 0) && (
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <View style={styles.calendarTitleRow}>
                <Ionicons name="calendar-outline" size={12} color={colors.primary} />
                <Text style={styles.calendarTitle}>Forecast Ahead</Text>
              </View>
              <Text style={styles.calendarHint}>Tap any day</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.calendarRow}
            >
              {forecastLoading && !forecastDays
                ? Array.from({ length: 6 }).map((_, i) => (
                    <View key={i} style={[styles.calendarDay, styles.calendarDaySkeleton]} />
                  ))
                : forecastDisplayDays.map((day) => {
                    const raw = combinedOutlookScore(day);
                    const display = formatScoreDisplay(raw);
                    const color = scoreColor(raw);
                    const quality = getQualityLabel(raw);
                    return (
                      <Pressable
                        key={day.date}
                        style={({ pressed }) => [
                          styles.calendarDay,
                          pressed && styles.calendarDayPressed,
                        ]}
                        onPress={() => {
                          if (!hasSubscription) {
                            setShowSubscribePrompt(true);
                            return;
                          }
                          if (!coords) return;
                          router.push({
                            pathname: '/how-fishing',
                            params: {
                              lat: String(coords.lat),
                              lon: String(coords.lon),
                              location_label: locationLabel,
                              day_offset: String(day.day_offset),
                              target_date: day.date,
                            },
                          });
                        }}
                      >
                        <Text style={styles.calendarDayLabel}>{day.day_label}</Text>
                        <Text style={styles.calendarDateNum}>{day.month_day}</Text>
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
              <Text style={styles.heroTitle} numberOfLines={1} adjustsFontSizeToFit>{"How's Fishing Right Now?"}</Text>
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

        {/* ─── Recommender Card ─── */}
        <Pressable
          style={({ pressed }) => [
            styles.recommenderCard,
            pressed && styles.recommenderCardPressed,
          ]}
          onPress={handleRecommenderPress}
        >
          <View style={styles.recommenderAccentBar} />
          <View style={styles.recommenderBody}>
            <View style={styles.recommenderLeft}>
              <View style={styles.recommenderIconWrap}>
                <Ionicons name="fish-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.recommenderTextBlock}>
                <Text style={styles.recommenderTitle}>What to Throw</Text>
                <Text style={styles.recommenderSubtitle}>
                  Top lures & flies for your target species
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </Pressable>

        {/* ─── Water Reader Card ─── */}
        <Pressable
          style={({ pressed }) => [
            styles.recommenderCard,
            pressed && styles.recommenderCardPressed,
          ]}
          onPress={() => {/* placeholder — page coming soon */}}
        >
          <View style={[styles.recommenderAccentBar, { backgroundColor: colors.waterBlue }]} />
          <View style={styles.recommenderBody}>
            <View style={styles.recommenderLeft}>
              <View style={[styles.recommenderIconWrap, { backgroundColor: colors.waterBlue + '18' }]}>
                <Ionicons name="scan-outline" size={18} color={colors.waterBlue} />
              </View>
              <View style={styles.recommenderTextBlock}>
                <Text style={styles.recommenderTitle}>Water Reader</Text>
                <Text style={styles.recommenderSubtitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                  Identify where to fish in your lake or pond
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
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

        {/* ─── Live Conditions section label ─── */}
        <View style={styles.sectionDividerRow}>
          <View style={styles.sectionDividerLine} />
          <Ionicons name="radio-outline" size={11} color={colors.primary} />
          <Text style={styles.sectionDividerText}>LIVE CONDITIONS</Text>
          <View style={styles.sectionDividerLine} />
        </View>

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

        {/* ─── Tagline ─── */}
        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Ionicons name="fish-outline" size={12} color={colors.textMuted} style={{ opacity: 0.5 }} />
          <Text style={styles.tagline}>Tight lines start with better intel.</Text>
          <Ionicons name="fish-outline" size={12} color={colors.textMuted} style={{ opacity: 0.5 }} />
          <View style={styles.taglineLine} />
        </View>
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
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLine: {
    height: 2,
    borderRadius: 99,
    backgroundColor: colors.primary,
    opacity: 0.45,
    marginTop: 8,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  brandLogo: {
    width: 44,
    height: 44,
  },
  brand: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.text,
    letterSpacing: -0.3,
  },
  greeting: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 10,
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  /* Location Row */
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 210,
  },
  locationRowPressed: {
    backgroundColor: colors.primaryMist,
    borderColor: colors.primary + '40',
  },
  locationRowLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.text,
    maxWidth: 120,
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
    borderRadius: radius.xl,
    padding: 14,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primaryMistDark,
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
    marginBottom: spacing.sm,
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
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.xs + 2,
    letterSpacing: -0.2,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPulseInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    gap: CAL_GAP,
  },
  calendarDay: {
    width: CAL_CARD_W,
    paddingTop: 9,
    paddingHorizontal: 4,
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
    height: 104,
    backgroundColor: colors.border,
    opacity: 0.35,
  },
  calendarDayLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  calendarDayLabelToday: {
    color: colors.primary,
  },
  calendarDateNum: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 4,
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
    fontSize: 21,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  calendarQuality: {
    fontFamily: fonts.bodyBold,
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    textAlign: 'center',
    marginBottom: 7,
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
  // Section divider (before Live Conditions)
  sectionDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  sectionDividerText: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1.2,
  },

  // Tagline row
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  tagline: {
    fontFamily: fonts.bodyItalic,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    flexShrink: 1,
  },

  // ── Recommender card ──────────────────────────────────────────────────────
  recommenderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  recommenderCardPressed: {
    backgroundColor: colors.surfacePressed,
    transform: [{ scale: 0.985 }],
  },
  recommenderAccentBar: {
    width: 4,
    backgroundColor: colors.primary,
  },
  recommenderBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  recommenderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recommenderIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommenderTextBlock: {
    flex: 1,
  },
  recommenderTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  recommenderSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
