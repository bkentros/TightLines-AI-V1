/**
 * Home screen — FinFindr paper-UI migration (Phase 1).
 *
 * Visual layer: FinFindr "paper/ink" design system (see `components/paper/*`
 * and the `paper*` tokens in `lib/theme.ts`). Every piece of business logic,
 * store wiring, navigation, and gating was intentionally preserved from the
 * prior implementation — only the JSX render tree and StyleSheet changed.
 *
 * Preserved behaviors (DO NOT regress):
 *   - GPS permission probe + reverse geocode label.
 *   - `useDevTestingStore`'s `ignoreGps` dev switch.
 *   - Saved-location store wiring with custom-pin precedence.
 *   - `useEnvStore.loadEnv` auto-refresh on focus / app resume.
 *   - `getForecastScores` 7-day fetch + cache invalidation on location change.
 *   - Cached mean-across-contexts score from `getCurrentMultiRebuild` /
 *     `getCachedMultiRebuild`, refreshed on focus so freshly generated reports
 *     update the hero number without a re-fetch.
 *   - Subscription gating via `getEffectiveTier` / `canUseAIFeatures`.
 *   - Location picker modal + Subscribe prompt surface.
 *   - Navigation handlers pass exactly the same query params as before, so
 *     `/how-fishing` and `/recommender` keep their existing deep-link contracts.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  AppState,
  type AppStateStatus,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
// Home content padding (edge) + internal gutter between forecast tiles.
const HOME_H_PADDING = 20;
const FORECAST_GAP = 8;
/**
 * Forecast grid is laid out as 6 fixed-width tiles inside a horizontal
 * ScrollView. On phones where 6 tiles would be cramped, we let the user scroll
 * instead of forcing a narrow column.
 */
const FORECAST_COLS_FIT = 6;
const FORECAST_TILE_W = Math.max(
  58,
  Math.floor((SCREEN_W - HOME_H_PADDING * 2 - FORECAST_GAP * (FORECAST_COLS_FIT - 1)) / FORECAST_COLS_FIT),
);

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {
  paper,
  paperFonts,
  paperSpacing,
  paperRadius,
  paperShadows,
  paperBorders,
  paperTier,
  paperTierForScore,
  paperBandForScore,
  type PaperTier,
  type PaperScoreBand,
} from '../../lib/theme';
import {
  LiveConditionsPaperCard,
  SectionEyebrow,
  TierPill,
  MedalBadge,
  PaperCard,
  PaperBackground,
  LurePopper,
  TopographicLines,
} from '../../components/paper';
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
  /**
   * 7-day high/low arrays from the forecast snapshot. These live under
   * `snapshot_env.weather.temp_7day_high / temp_7day_low` as 21-element
   * arrays where index 14 is "today" (the array covers past+today+future).
   * We snapshot them so the forecast tiles can render hi/lo without having
   * to drill into the full result elsewhere.
   */
  const [forecastHighs, setForecastHighs] = useState<number[] | null>(null);
  const [forecastLows, setForecastLows] = useState<number[] | null>(null);

  // ── Active coordinates and label ──────────────────────────────────────────
  // Priority: saved custom pin > DEV ignoreGps (no coords) > GPS
  //
  // Memoize so the reference is stable when values are unchanged. A fresh
  // object every render would break useFocusEffect / useCallback deps and
  // cause an infinite loop (loadEnv → re-render → new coords ref → focus
  // effect re-runs → loadEnv).
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
        // Silently fail — widget will show the "enable location" state.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (__DEV__) loadDevTesting();
  }, [loadDevTesting]);

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

  useEffect(() => {
    void loadCachedReportMean();
  }, [loadCachedReportMean]);

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
        const w = result.snapshot_env?.weather;
        setForecastHighs(w?.temp_7day_high ?? null);
        setForecastLows(w?.temp_7day_low ?? null);
      }
    } catch {
      if (mySeq === forecastFetchSeq.current) {
        setForecastDays(null);
        setForecastCoastalEligible(null);
        setForecastHighs(null);
        setForecastLows(null);
      }
    } finally {
      if (mySeq === forecastFetchSeq.current) setForecastLoading(false);
    }
  }, [coords?.lat, coords?.lon]);

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

  const handleLocationSelect = useCallback(
    async (loc: { lat: number; lon: number; label: string }) => {
      if (coords) invalidateForecastCache(coords.lat, coords.lon);
      await recordRecentLocation({ lat: loc.lat, lon: loc.lon, label: loc.label });
      await setSavedLocation(loc);
      setShowLocationPicker(false);
      setForecastDays(null);
      setForecastCoastalEligible(null);
      setForecastHighs(null);
      setForecastLows(null);
      setCachedScore(null);
      setCachedMeanRaw(null);
      const units = profile?.preferred_units ?? 'imperial';
      loadEnv(loc.lat, loc.lon, { units });
    },
    [coords, setSavedLocation, profile?.preferred_units, loadEnv],
  );

  const handleUseGPS = useCallback(async () => {
    if (coords && useCustom) invalidateForecastCache(coords.lat, coords.lon);
    if (__DEV__) {
      await setIgnoreGps(false);
    }
    await clearSavedLocation();
    setShowLocationPicker(false);
    setForecastDays(null);
    setForecastCoastalEligible(null);
    setForecastHighs(null);
    setForecastLows(null);
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

  const heroScore =
    cachedMeanRaw != null ? formatScoreDisplay(cachedMeanRaw) : cachedScore;
  // Tier drives ONLY the color treatment (3-bucket red/yellow/green). The
  // human-readable verdict is derived separately from `paperBandForScore`
  // so the word always agrees with the number — "Excellent" is reserved
  // for 8.0+, matching the engine's `bandFromScore` thresholds.
  const heroTierKey: PaperTier | null =
    cachedMeanRaw != null ? paperTierForScore(cachedMeanRaw / 10) : null;
  const heroBand: PaperScoreBand | null =
    cachedMeanRaw != null ? paperBandForScore(cachedMeanRaw / 10) : null;
  const heroTierLabel = heroBand
    ? `${bandBullet(heroBand)} ${heroBand.toUpperCase()}`
    : null;

  const forecastDisplayDays = forecastDays?.filter((day) => day.day_offset > 0) ?? [];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return 'UP EARLY, ANGLER';
    if (h < 12) return 'GOOD MORNING, ANGLER';
    if (h < 17) return 'GOOD AFTERNOON, ANGLER';
    if (h < 21) return 'GOOD EVENING, ANGLER';
    return 'EVENING, ANGLER';
  })();

  /**
   * Hero messaging.
   *
   * Before the user has a generated report for today, we show the recruitment
   * line ("LET'S FIND YOUR BITE."). As soon as `cachedMeanRaw` becomes
   * non-null (meaning a cached multi-report exists for *today's* coordinates
   * — see `loadCachedReportMean`) we swap in a tier-colored line that calls
   * out today's quality.
   *
   * We keep the structure as
   *   `Today's a <tier phrase>.`
   *   `Today looks <tier phrase>.`
   * so the tier phrase is a predictable last-two-word slot that can be
   * rendered in a brand color via the welcomeHeadline renderer.
   */
  /**
   * Headline phrase is keyed to the engine band so the hero copy matches
   * the numeric verdict. "Prime day" is reserved for Excellent (8.0+);
   * Good (6.0–7.9) gets softer "solid" language; Fair and Poor each get
   * their own honest framing.
   */
  const heroHeadlineParts = useMemo<{
    leading: string;
    accent: string | null;
    tailPunct: string;
  }>(() => {
    switch (heroBand) {
      case 'Excellent':
        return { leading: "Today's a", accent: 'prime day', tailPunct: '.' };
      case 'Good':
        return { leading: "Today's looking", accent: 'solid', tailPunct: '.' };
      case 'Fair':
        return { leading: 'Today looks', accent: 'fair', tailPunct: '.' };
      case 'Poor':
        return { leading: 'A tough', accent: 'day ahead', tailPunct: '.' };
      default:
        return { leading: "LET'S FIND YOUR", accent: 'BITE', tailPunct: '.' };
    }
  }, [heroBand]);

  const heroHeadlineIsUppercase = heroBand == null;

  const heroAccentColor =
    heroTierKey === 'green' ? paper.forest :
    heroTierKey === 'yellow' ? paper.goldDk :
    heroTierKey === 'red' ? paper.redDk :
    paper.red;

  const heroSubline =
    heroBand === 'Excellent'
      ? 'Prime window — get on the water.'
      : heroBand === 'Good'
      ? 'A solid day to fish — play your windows right.'
      : heroBand === 'Fair'
      ? 'Pick your window carefully — the bite is narrow.'
      : heroBand === 'Poor'
      ? 'Tough conditions — patience and slow presentations.'
      : 'Tap into today’s report for the full picture.';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.pageBg}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/*
            Header — matches the reference:
              header { display: flex; justify-content: space-between;
                       align-items: flex-end }
            Wordmark + tagline on the left, location pin + LIVE stacked on
            the right at the same baseline as the wordmark.
          */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.brandWordmark}>
                FINFINDR<Text style={styles.brandDot}>.</Text>
              </Text>
              <Text style={styles.brandTagline}>YOUR FISHING COMPANION</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.headerRight,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setShowLocationPicker(true)}
              hitSlop={8}
            >
              <View style={styles.headerLocationLine}>
                <Ionicons
                  name={useCustom && savedLocation ? 'pin' : 'location-outline'}
                  size={13}
                  color={paper.ink}
                />
                <Text
                  style={styles.headerLocationText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {locationLabel}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={10}
                  color={paper.ink}
                  style={{ opacity: 0.5 }}
                />
              </View>
              <View style={styles.headerLiveLine}>
                <View style={styles.liveDot} />
                <Text style={styles.liveLabel}>LIVE</Text>
              </View>
            </Pressable>
          </View>

          {/* ─── Greeting hero ─── */}
          <View style={styles.welcome}>
            <SectionEyebrow size={10} tracking={3.5}>
              {greeting}
            </SectionEyebrow>
            <Text
              style={[
                styles.welcomeHeadline,
                heroHeadlineIsUppercase && styles.welcomeHeadlineUpper,
              ]}
            >
              {heroHeadlineParts.leading}{' '}
              <Text style={{ color: heroAccentColor }}>
                {heroHeadlineParts.accent}
              </Text>
              {heroHeadlineParts.tailPunct}
            </Text>
            <Text style={styles.welcomeSubline}>{heroSubline}</Text>
          </View>

          {/*
            Live Conditions — wrapped in a positioned band so the subtle
            topographic contours (wavy lines) sit behind it and bleed a
            little above the card, matching where the reference's `<pattern
            id="topo">` clusters on the page.
          */}
          <View style={styles.liveConditionsBand}>
            <TopographicLines
              style={styles.liveConditionsBandLines}
              count={5}
            />
            <LiveConditionsPaperCard
              latitude={coords?.lat}
              longitude={coords?.lon}
              onRequestLocation={__DEV__ && ignoreGps ? undefined : handleRequestLocation}
              onPress={handleHowFishingPress}
            />
          </View>

          {/* ─── Week Ahead forecast ─── */}
          {coords && (forecastLoading || forecastDisplayDays.length > 0) && (
            <View style={styles.forecastSection}>
              <View style={styles.forecastHeader}>
                <View style={styles.forecastHeaderLeft}>
                  <Text style={styles.forecastEyebrow}>THE WEEK AHEAD</Text>
                  <Text style={styles.forecastSub}>
                    next {forecastDisplayDays.length || 6} days
                  </Text>
                </View>
                <Text style={styles.forecastMeta}>TAP ANY DAY</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastRow}
              >
                {forecastLoading && !forecastDays
                  ? Array.from({ length: FORECAST_COLS_FIT }).map((_, i) => (
                      <View key={i} style={styles.forecastTile}>
                        <View
                          style={[
                            styles.forecastTileHeader,
                            styles.forecastTileHeaderSkeleton,
                          ]}
                        >
                          <View style={styles.forecastTileDayBone} />
                        </View>
                        <View style={styles.forecastTileBody}>
                          <View style={styles.forecastTileDateBone} />
                          <View style={styles.forecastTileScoreBone} />
                          <View style={styles.forecastTileHiLo}>
                            <View style={styles.forecastTileHiLoBone} />
                          </View>
                        </View>
                      </View>
                    ))
                  : forecastDisplayDays.map((day) => {
                      const raw = combinedOutlookScore(day);
                      const tier = paperTierForScore(raw / 10);
                      const tierColors = paperTier[tier];
                      const display = formatScoreDisplay(raw);
                      // Convert "Tmrw"/"Mon"/"Tue"/… into the FinFindr's
                      // tight uppercase abbreviations ("TMRW", "MON"…).
                      const dayLabelAbbrev = abbreviateDayLabel(day.day_label);
                      // 7-day temperature snapshot: index 14 = today, so
                      // index (14 + day_offset) gives the forecast day.
                      const idx = 14 + day.day_offset;
                      const hi = forecastHighs?.[idx];
                      const lo = forecastLows?.[idx];
                      return (
                        <Pressable
                          key={day.date}
                          style={({ pressed }) => [
                            styles.forecastTile,
                            pressed && styles.forecastTilePressed,
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
                          <View
                            style={[
                              styles.forecastTileHeader,
                              { backgroundColor: tierColors.bg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.forecastTileDay,
                                { color: tierColors.fg },
                              ]}
                              numberOfLines={1}
                            >
                              {dayLabelAbbrev}
                            </Text>
                          </View>
                          <View style={styles.forecastTileBody}>
                            <Text style={styles.forecastTileDate}>
                              {day.month_day}
                            </Text>
                            <Text
                              style={[
                                styles.forecastTileScore,
                                { color: tierColors.bg },
                              ]}
                              numberOfLines={1}
                              adjustsFontSizeToFit
                              minimumFontScale={0.8}
                            >
                              {display}
                            </Text>
                            {(hi != null || lo != null) && (
                              <View style={styles.forecastTileHiLo}>
                                <Text style={styles.forecastTileHi} numberOfLines={1}>
                                  {hi != null ? `${Math.round(hi)}°` : '—'}
                                </Text>
                                <Text style={styles.forecastTileDivider}>/</Text>
                                <Text style={styles.forecastTileLo} numberOfLines={1}>
                                  {lo != null ? `${Math.round(lo)}°` : '—'}
                                </Text>
                              </View>
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
              </ScrollView>
            </View>
          )}

          {/* ─── Where to next ─── */}
          <View style={styles.destinationsHeader}>
            <SectionEyebrow color={paper.ink} size={10} tracking={3}>
              WHERE TO NEXT?
            </SectionEyebrow>
          </View>

          <View style={styles.ctaRow}>
            {/* HOW'S FISHING NOW */}
            <Pressable
              style={({ pressed }) => [styles.ctaCard, pressed && styles.ctaCardPressed]}
              onPress={handleHowFishingPress}
            >
              <View style={styles.ctaCardBody}>
                <View style={[styles.ctaBadge, { backgroundColor: paper.forest }]}>
                  <Ionicons name="pulse" size={20} color={paper.paper} />
                </View>
                <Text style={styles.ctaTitle}>
                  HOW&rsquo;S{'\n'}
                  <Text style={{ color: paper.forest }}>FISHING</Text>{'\n'}
                  NOW?
                </Text>
                <Text style={styles.ctaBody}>
                  Today&apos;s score, best times, and a pro tip for the day.
                </Text>

                {heroScore !== null && heroTierKey ? (
                  <View style={styles.ctaScoreRow}>
                    <Text
                      style={[
                        styles.ctaScoreNum,
                        {
                          color:
                            heroTierKey === 'green' ? paper.forest :
                            heroTierKey === 'yellow' ? paper.goldDk :
                            paper.redDk,
                        },
                      ]}
                    >
                      {heroScore}
                    </Text>
                    <Text style={styles.ctaScoreUnit}>/ 10</Text>
                    {heroTierLabel && (
                      <TierPill
                        tier={heroTierKey}
                        label={heroTierLabel}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                ) : (
                  <View style={styles.ctaNoReport}>
                    <View style={styles.ctaNoReportDashes}>
                      <Text style={styles.ctaNoReportDashesText}>— — — —</Text>
                    </View>
                    <Text style={styles.ctaNoReportCaption}>
                      no report yet for today
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.ctaFooter}>
                <View style={styles.ctaFooterBtn}>
                  <Text style={styles.ctaFooterBtnText}>VIEW REPORT</Text>
                  <Text style={styles.ctaFooterBtnArrow}>→</Text>
                </View>
              </View>
            </Pressable>

            {/* WHAT TO THROW */}
            <Pressable
              style={({ pressed }) => [styles.ctaCard, pressed && styles.ctaCardPressed]}
              onPress={handleRecommenderPress}
            >
              <View style={styles.ctaCardBody}>
                <View style={[styles.ctaBadge, { backgroundColor: paper.gold }]}>
                  <LurePopper size={28} color={paper.ink} outline={paper.ink} />
                </View>
                <Text style={styles.ctaTitle}>
                  WHAT TO{'\n'}
                  <Text style={{ color: paper.goldDk }}>THROW</Text>?
                </Text>
                <Text style={styles.ctaBody}>
                  Three lures, three flies — ranked for today&apos;s conditions.
                </Text>

                <View style={styles.ctaMedalRow}>
                  <View style={styles.ctaMedalStack}>
                    <MedalBadge tier="gold" size={26} />
                    <MedalBadge tier="silver" size={26} style={{ marginLeft: -6 }} />
                    <MedalBadge tier="bronze" size={26} style={{ marginLeft: -6 }} />
                  </View>
                  <Text style={styles.ctaMedalCaption}>6 picks, ranked</Text>
                </View>
              </View>

              <View style={styles.ctaFooter}>
                <View style={styles.ctaFooterBtn}>
                  <Text style={styles.ctaFooterBtnText}>OPEN TACKLE BOX</Text>
                  <Text style={styles.ctaFooterBtnArrow}>→</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* ─── Water Reader (preserved stub, restyled) ─── */}
          <Pressable
            style={({ pressed }) => [styles.waterReaderCard, pressed && { opacity: 0.9 }]}
            onPress={() => {
              /* placeholder — page coming soon */
            }}
          >
            <PaperCard tint={paper.paperLight} corners cornerColor={paper.ink}>
              <View style={styles.waterReaderBody}>
                <View style={[styles.ctaBadge, { backgroundColor: paper.walnut }]}>
                  <Ionicons name="scan-outline" size={18} color={paper.paper} />
                </View>
                <View style={styles.waterReaderText}>
                  <Text style={styles.waterReaderTitle}>WATER READER</Text>
                  <Text style={styles.waterReaderSub}>
                    Identify where to fish in your lake or pond.
                  </Text>
                </View>
                <View style={styles.comingSoonChip}>
                  <Text style={styles.comingSoonChipText}>SOON</Text>
                </View>
              </View>
            </PaperCard>
          </Pressable>

          {/* ─── Footer rule ─── */}
          <View style={styles.footer}>
            <Text style={styles.footerLeft}>FINFINDR</Text>
            <Text style={styles.footerRight}>MADE FOR THE WATER</Text>
          </View>

          {/* Modals — preserved as-is. */}
          <LocationPickerModal
            visible={showLocationPicker}
            currentLabel={useCustom && savedLocation ? savedLocation.label : gpsLabel}
            isUsingCustom={useCustom && savedLocation != null}
            savedLocation={useCustom && savedLocation ? savedLocation : null}
            onSelect={handleLocationSelect}
            onUseGPS={handleUseGPS}
            onClose={() => setShowLocationPicker(false)}
          />
          <SubscribePrompt
            visible={showSubscribePrompt}
            onDismiss={() => setShowSubscribePrompt(false)}
            onViewPlans={() => {
              setShowSubscribePrompt(false);
              router.push('/subscribe');
            }}
          />
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

/**
 * Converts the backend's day labels ("Today", "Tmrw", "Mon", …) into the
 * FinFindr shell's tight uppercase abbreviations ("TMRW", "MON", …). We can't
 * just uppercase, since "Tmrw" renders as "TMRW" already but "Mon" should
 * also drop to the weekday short form.
 */
function abbreviateDayLabel(label: string): string {
  const clean = label.trim().toUpperCase();
  if (clean === 'TODAY') return 'TODAY';
  if (clean === 'TMRW' || clean === 'TOMORROW') return 'TMRW';
  // Backend day_label is already "Mon"/"Tue"/…; uppercasing is the abbrev.
  return clean.slice(0, 3);
}

/**
 * Compact glyph that accompanies the band word in the hero chip, echoing
 * the existing "●/◐/○" visual grammar but mapped to the 4-band engine
 * truth (Excellent/Good = filled, Fair = half-filled, Poor = empty).
 */
function bandBullet(band: PaperScoreBand): string {
  switch (band) {
    case 'Excellent':
      return '●';
    case 'Good':
      return '●';
    case 'Fair':
      return '◐';
    case 'Poor':
      return '○';
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  pageBg: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: HOME_H_PADDING,
    paddingBottom: 48,
  },

  /* ─── Header (wordmark left, location/LIVE right) ─── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: paperSpacing.md + 4,
    marginBottom: paperSpacing.lg,
  },
  headerLeft: {
    flex: 1,
    paddingRight: paperSpacing.sm,
  },
  headerRight: {
    alignItems: 'flex-end',
    paddingBottom: 2,
  },
  headerLocationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  headerLocationText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 13,
    color: paper.ink,
    letterSpacing: 0.1,
    maxWidth: 180,
  },
  headerLiveLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  brandWordmark: {
    fontFamily: paperFonts.display,
    fontSize: 38,
    letterSpacing: -1.3,
    color: paper.ink,
    fontWeight: '700',
    lineHeight: 38,
  },
  brandDot: { color: paper.red },
  brandTagline: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 2.6,
    color: paper.ink,
    opacity: 0.55,
    marginTop: 6,
    fontWeight: '500',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.moss,
  },
  liveLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.5,
    color: paper.forestDk,
    fontWeight: '700',
  },

  /* ─── Live Conditions band (hosts the topographic contour hint) ─── */
  liveConditionsBand: {
    position: 'relative',
    // The contour lines extend ~32px above the card so the hint bleeds a
    // little into the empty paper above the card, matching the reference.
    paddingTop: 32,
    marginTop: -32,
  },
  liveConditionsBandLines: {
    top: 0,
    bottom: paperSpacing.lg,
  },

  /* ─── Welcome hero ─── */
  welcome: {
    alignItems: 'center',
    marginBottom: paperSpacing.lg,
    paddingVertical: paperSpacing.sm,
  },
  welcomeHeadline: {
    fontFamily: paperFonts.display,
    fontSize: 36,
    lineHeight: 40,
    textAlign: 'center',
    letterSpacing: -1.4,
    color: paper.ink,
    fontWeight: '700',
    marginTop: 12,
  },
  welcomeHeadlineUpper: {
    textTransform: 'uppercase',
  },
  welcomeSubline: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 320,
    lineHeight: 20,
  },

  /* ─── Forecast ─── */
  forecastSection: {
    marginBottom: paperSpacing.lg,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: paperSpacing.sm,
    paddingBottom: paperSpacing.xs + 2,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  forecastHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: paperSpacing.sm + 2,
  },
  forecastEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 3,
    color: paper.ink,
    fontWeight: '700',
  },
  forecastSub: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.ink,
    opacity: 0.55,
  },
  forecastMeta: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: paper.ink,
    opacity: 0.55,
  },
  forecastRow: {
    gap: FORECAST_GAP,
    paddingRight: 2,
  },
  forecastTile: {
    width: FORECAST_TILE_W,
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    ...paperBorders.card,
    ...paperShadows.hard,
  },
  forecastTilePressed: {
    transform: [{ translateY: 1 }],
  },
  forecastTileHeaderSkeleton: {
    backgroundColor: paper.inkHairSoft,
    opacity: 0.7,
    paddingVertical: 8,
  },
  forecastTileDayBone: {
    height: 10,
    width: 30,
    borderRadius: 2,
    backgroundColor: paper.inkHair,
    opacity: 0.7,
  },
  forecastTileDateBone: {
    height: 9,
    width: 30,
    borderRadius: 2,
    backgroundColor: paper.inkHair,
    opacity: 0.5,
    marginBottom: 6,
  },
  forecastTileScoreBone: {
    height: 24,
    width: 36,
    borderRadius: 4,
    backgroundColor: paper.inkHair,
    opacity: 0.55,
  },
  forecastTileHiLoBone: {
    height: 9,
    width: 40,
    borderRadius: 2,
    backgroundColor: paper.inkHair,
    opacity: 0.45,
  },
  forecastTileHeader: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
  },
  forecastTileDay: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '700',
    textAlign: 'center',
  },
  forecastTileBody: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 10,
    alignItems: 'center',
  },
  forecastTileDate: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9.5,
    letterSpacing: 0.4,
    color: paper.ink,
    opacity: 0.55,
    marginBottom: 4,
  },
  forecastTileScore: {
    fontFamily: paperFonts.monoBold,
    fontSize: 26,
    letterSpacing: -1.5,
    fontWeight: '700',
    lineHeight: 28,
    textAlign: 'center',
  },
  forecastTileHiLo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 6,
    paddingTop: 5,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.ink,
    width: '100%',
  },
  forecastTileHi: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    fontWeight: '700',
  },
  forecastTileDivider: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.4,
    marginHorizontal: 3,
  },
  forecastTileLo: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.6,
  },

  /* ─── Destinations header ─── */
  destinationsHeader: {
    alignItems: 'center',
    marginBottom: paperSpacing.sm + 2,
    marginTop: paperSpacing.xs,
  },

  /* ─── CTA cards ─── */
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: paperSpacing.sm + 2,
    marginBottom: paperSpacing.lg,
  },
  /**
   * CTA cards are laid out as a column with `justifyContent: 'space-between'`
   * so the footer (View Report / Open Tackle Box button) naturally sits at
   * the bottom of the card, regardless of how much vertical content the body
   * takes. `ctaCardBody` holds everything above the footer.
   */
  ctaCard: {
    flex: 1,
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md + 2,
    ...paperBorders.card,
    ...paperShadows.hard,
    minHeight: 300,
    justifyContent: 'space-between',
  },
  ctaCardBody: {
    flexGrow: 1,
  },
  ctaCardPressed: {
    transform: [{ translateY: 1 }],
  },
  ctaBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: paperSpacing.sm + 2,
    ...paperShadows.hard,
  },
  ctaTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.8,
    color: paper.ink,
  },
  ctaBody: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.75,
    marginTop: 10,
    lineHeight: 18,
  },
  ctaScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: paperSpacing.md,
    flexWrap: 'wrap',
  },
  ctaScoreNum: {
    fontFamily: paperFonts.monoBold,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1.2,
    lineHeight: 30,
  },
  ctaScoreUnit: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.55,
    fontWeight: '700',
  },
  ctaMedalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: paperSpacing.md,
  },
  ctaMedalStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaMedalCaption: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.ink,
    opacity: 0.7,
    flexShrink: 1,
  },
  ctaNoReport: {
    marginTop: paperSpacing.md,
  },
  ctaNoReportDashes: {
    marginBottom: 2,
  },
  ctaNoReportDashesText: {
    fontFamily: paperFonts.monoBold,
    fontSize: 20,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.3,
  },
  ctaNoReportCaption: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.ink,
    opacity: 0.6,
  },
  ctaFooter: {
    marginTop: paperSpacing.md,
    paddingTop: paperSpacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: paper.inkHair,
    borderStyle: 'dashed',
  },
  ctaFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
  },
  ctaFooterBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 2,
    color: paper.ink,
    fontWeight: '700',
  },
  ctaFooterBtnArrow: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.ink,
    lineHeight: 14,
    marginTop: -2,
  },

  /* ─── Water Reader stub ─── */
  waterReaderCard: {
    marginBottom: paperSpacing.lg,
  },
  waterReaderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
  },
  waterReaderText: {
    flex: 1,
  },
  waterReaderTitle: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    letterSpacing: -0.4,
    color: paper.ink,
    fontWeight: '700',
  },
  waterReaderSub: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.7,
    marginTop: 2,
  },
  comingSoonChip: {
    backgroundColor: paper.gold,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comingSoonChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.ink,
    fontWeight: '700',
  },

  /* ─── Footer ─── */
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    borderTopWidth: 1.5,
    borderTopColor: paper.ink,
  },
  footerLeft: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.5,
    color: paper.ink,
    opacity: 0.55,
    fontWeight: '600',
  },
  footerRight: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.55,
  },
});
