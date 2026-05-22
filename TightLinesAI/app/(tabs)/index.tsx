/**
 * Home — FinFindr field-edition dashboard (May 2026 redesign).
 *
 * Visual layer: dark navy header strip + cream body with a 24px grid +
 * Fraunces serif headlines + JetBrains Mono eyebrows + Inter body text +
 * the 5-band scoring palette (Tough/Poor/Fair/Good/Prime). Every piece of
 * business logic, store wiring, navigation, and gating was preserved from
 * the prior paper-migration phase — only the JSX render tree, StyleSheet,
 * and a few pure-presentational helpers changed.
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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  AppState,
  type AppStateStatus,
  Dimensions,
  Easing,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

import {
  dashboardBandColor,
  paper,
  paperBandForScore,
  type PaperScoreBand,
  scoreAccentColor,
} from "../../lib/theme";
import { hapticImpact, ImpactFeedbackStyle } from "../../lib/safeHaptics";
import { SubscribePrompt } from "../../components/SubscribePrompt";
import { LocationPickerModal } from "../../components/LocationPickerModal";
import { useAuthStore } from "../../store/authStore";
import { useDevTestingStore } from "../../store/devTestingStore";
import { useEnvStore } from "../../store/envStore";
import { useLocationStore } from "../../store/locationStore";
import {
  canGenerateForecastReport,
  canUseAIFeatures,
  canViewForecastScore,
  FREE_FORECAST_PREVIEW_DAY_OFFSET,
  getEffectiveTier,
} from "../../lib/subscription";
import { isAdminEmail } from "../../lib/adminAccess";
import {
  getCachedMultiRebuild,
  getCurrentMultiRebuild,
} from "../../lib/howFishing";
import { howFishingMultiContexts } from "../../lib/howFishingRebuildContracts";
import {
  type DayForecastScore,
  formatScoreDisplay,
  getForecastScores,
  invalidateForecastCache,
  meanDayScore,
  nextMidnightInTimeZoneMs,
  roundedScore10FromRaw,
} from "../../lib/forecastScores";
import { recordRecentLocation } from "../../lib/recentLocations";
import { searchUsCities } from "../../lib/locationSearch";

// ─── Layout constants ────────────────────────────────────────────────────────
const SCREEN_W = Dimensions.get("window").width;
const HOME_H_PADDING = 20;
const FORECAST_GAP = 6;
const FORECAST_COLS = 6;
const FORECAST_TILE_W = Math.max(
  46,
  Math.floor(
    (SCREEN_W - HOME_H_PADDING * 2 - FORECAST_GAP * (FORECAST_COLS - 1)) /
      FORECAST_COLS,
  ),
);
type LockedForecastPlaceholder = {
  kind: "locked";
  key: string;
  dayLabel: string;
  dateNum: string;
  color: string;
};

const LOCKED_FORECAST_BANDS: PaperScoreBand[] = [
  "Tough",
  "Poor",
  "Fair",
  "Good",
  "Prime",
];

function hashForecastSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededUnit(seed: number): number {
  const next = Math.imul(seed ^ (seed >>> 15), 2246822507);
  return ((next ^ (next >>> 13)) >>> 0) / 4294967295;
}

function buildLockedForecastPlaceholders(
  seedInput: string,
): LockedForecastPlaceholder[] {
  const seed = hashForecastSeed(seedInput);
  const bands = [...LOCKED_FORECAST_BANDS];
  for (let i = bands.length - 1; i > 0; i--) {
    const j = Math.floor(seededUnit(seed + i * 101) * (i + 1));
    [bands[i], bands[j]] = [bands[j]!, bands[i]!];
  }

  const [seedDate] = seedInput.split("|");
  const [year, month, day] = (seedDate ?? "").split("-").map(Number);
  const start =
    Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
      ? new Date(year!, month! - 1, day! + 1, 12)
      : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return bands.map((band, i) => {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    return {
      kind: "locked",
      key: `locked-${i}-${band}`,
      dayLabel: abbreviateDay(
        date.toLocaleDateString("en-US", { weekday: "short" }),
      ),
      dateNum: String(date.getDate()),
      color: dashboardBandColor[band].bg,
    };
  });
}

// ─── Font tokens (loaded by app/_layout.tsx) ─────────────────────────────────
const SERIF_BOLD = "Fraunces_700Bold";
const SERIF_MEDIUM = "Fraunces_500Medium";
const SERIF_ITALIC = "Fraunces_500Medium_Italic";
const SERIF_SEMI = "Fraunces_600SemiBold";
const MONO = "JetBrainsMono_500Medium";
const MONO_BOLD = "JetBrainsMono_600SemiBold";
const SANS = "Inter_400Regular";
const SANS_MEDIUM = "Inter_500Medium";
const SANS_SEMI = "Inter_600SemiBold";
const SANS_BOLD = "Inter_700Bold";

export default function HomeScreen() {
  const router = useRouter();
  const { profile, user } = useAuthStore();
  const reportCacheOwnerKey = user?.id ?? user?.email ?? null;
  const {
    ignoreGps,
    load: loadDevTesting,
    setIgnoreGps,
  } = useDevTestingStore();
  const loadEnv = useEnvStore((s) => s.loadEnv);
  const envData = useEnvStore((s) => s.envData);
  const envLastCoords = useEnvStore((s) => s.lastCoords);
  const envLastFetchedAt = useEnvStore((s) => s.envData?.fetched_at);
  const {
    savedLocation,
    useCustom,
    setSavedLocation,
    seedFromProfileHome,
    clearSavedLocation,
    profileHomeSeededFor,
    load: loadLocationStore,
  } = useLocationStore();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastAutoRefreshAtRef = useRef(0);
  const profileHomeSeedAttemptRef = useRef<string | null>(null);
  const [locationPrefsLoaded, setLocationPrefsLoaded] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<
    { lat: number; lon: number } | null
  >(null);
  const [gpsLocationLabel, setGpsLocationLabel] = useState<string | null>(null);
  const [gpsRegionLabel, setGpsRegionLabel] = useState<string | null>(null);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  /** Latest generated live-report score for today, when available. */
  const [cachedScore, setCachedScore] = useState<string | null>(null);
  /** Mean 0–100 across today's multi-tab cached reports — only populated after report generation. */
  const [cachedMeanRaw, setCachedMeanRaw] = useState<number | null>(null);
  const [cachedScoreExpiresAtMs, setCachedScoreExpiresAtMs] = useState<
    number | null
  >(null);
  const [forecastDays, setForecastDays] = useState<DayForecastScore[] | null>(
    null,
  );
  const [forecastCoastalEligible, setForecastCoastalEligible] = useState<
    boolean | null
  >(null);
  const [forecastExpiresAtMs, setForecastExpiresAtMs] = useState<number | null>(
    null,
  );
  const [forecastLoading, setForecastLoading] = useState(false);
  /**
   * 21-entry hi/lo arrays from the forecast snapshot. Index 14 is "today";
   * indices 15–20 are tomorrow → 6 days out. We snapshot them on the
   * forecast fetch so each forecast tile can render its own daily high/low
   * without re-querying the env API per tile.
   */
  const [forecastHighs, setForecastHighs] = useState<number[] | null>(null);
  const [forecastLows, setForecastLows] = useState<number[] | null>(null);

  // ── Active coordinates and label ──────────────────────────────────────────
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

  const locationLabel = useCustom && savedLocation
    ? savedLocation.label
    : gpsLocationLabel ?? "Current location";

  const gpsLabel = gpsLocationLabel ?? "Current location";
  const envMatchesCoords = coords != null &&
    envData != null &&
    envLastCoords != null &&
    Math.abs(envLastCoords.lat - coords.lat) < 0.01 &&
    Math.abs(envLastCoords.lon - coords.lon) < 0.01;
  const locationCoastalEligible = envMatchesCoords
    ? Boolean(envData?.coastal)
    : (forecastCoastalEligible ?? false);

  // ── Subscription gating ───────────────────────────────────────────────────
  const effectiveTier = getEffectiveTier(
    profile,
    user?.email,
  );
  const hasSubscription = canUseAIFeatures(effectiveTier);
  const canGenerateForecast = canGenerateForecastReport(effectiveTier);

  useEffect(() => {
    if (!gpsCoords) {
      setGpsLocationLabel(null);
      setGpsRegionLabel(null);
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
        const region = geo.region ?? "";
        const label = city && region
          ? `${city}, ${region}`
          : city ?? region ?? null;
        if (!cancelled) {
          setGpsLocationLabel(label);
          setGpsRegionLabel(region || null);
        }
      } catch {
        if (!cancelled) {
          setGpsLocationLabel(null);
          setGpsRegionLabel(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gpsCoords?.lat, gpsCoords?.lon]);

  /** Load GPS when permission allows; request once when still `undetermined` (fresh install). */
  const tryAcquireGpsCoords = useCallback(
    async (opts?: { requestIfUndetermined?: boolean }) => {
      const requestIfUndetermined = opts?.requestIfUndetermined ?? false;
      if (__DEV__ && ignoreGps) return;
      if (useCustom && savedLocation) return;
      try {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status === "undetermined" && requestIfUndetermined) {
          ({ status } = await Location.requestForegroundPermissionsAsync());
        }
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setGpsCoords({
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
        });
      } catch {
        // Silently fail — user can open the location picker or fix permission in Settings.
      }
    },
    [ignoreGps, useCustom, savedLocation],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (cancelled) return;
      await tryAcquireGpsCoords({ requestIfUndetermined: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [tryAcquireGpsCoords]);

  // If the user enables Location in Settings (or load was still in flight), pick up coords on focus.
  useFocusEffect(
    useCallback(() => {
      if (gpsCoords != null) return;
      if (__DEV__ && ignoreGps) return;
      if (useCustom && savedLocation) return;
      void tryAcquireGpsCoords({ requestIfUndetermined: false });
    }, [
      gpsCoords,
      ignoreGps,
      useCustom,
      savedLocation,
      tryAcquireGpsCoords,
    ]),
  );

  useEffect(() => {
    if (isAdminEmail(user?.email)) loadDevTesting();
  }, [loadDevTesting, user?.email]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await loadLocationStore();
      if (!cancelled) setLocationPrefsLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadLocationStore]);

  useEffect(() => {
    if (!locationPrefsLoaded) return;
    if (!profile?.id || !profile.home_state || !profile.home_city) return;
    if (savedLocation || useCustom) return;
    if (profileHomeSeededFor === profile.id) return;

    const homeCity = profile.home_city.trim();
    if (homeCity.length < 2) return;
    const homeQuery = `${homeCity}, ${profile.home_state}`;
    if (profileHomeSeedAttemptRef.current === homeQuery) return;
    profileHomeSeedAttemptRef.current = homeQuery;

    let cancelled = false;
    void (async () => {
      const [match] = await searchUsCities(homeQuery);
      if (cancelled || !match) return;
      await seedFromProfileHome(profile.id, match);
      await recordRecentLocation(match);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    locationPrefsLoaded,
    profile?.id,
    profile?.home_state,
    profile?.home_city,
    savedLocation,
    useCustom,
    profileHomeSeededFor,
    seedFromProfileHome,
  ]);

  // ── Cached multi-rebuild mean (today's score) ────────────────────────────
  const cacheMeanRequestSeq = useRef(0);
  const loadCachedReportMean = useCallback(async () => {
    const req = ++cacheMeanRequestSeq.current;
    const lat = coords?.lat;
    const lon = coords?.lon;
    if (lat == null || lon == null) {
      if (req === cacheMeanRequestSeq.current) {
        setCachedMeanRaw(null);
        setCachedScore(null);
        setCachedScoreExpiresAtMs(null);
      }
      return;
    }
    const contexts = howFishingMultiContexts(locationCoastalEligible);
    const inMemory = getCurrentMultiRebuild(lat, lon, reportCacheOwnerKey);
    const hasAllInMemory = inMemory != null &&
      contexts.every((ctx) => inMemory[ctx] != null);
    const source = hasAllInMemory
      ? inMemory!
      : await getCachedMultiRebuild(
        lat,
        lon,
        contexts,
        reportCacheOwnerKey,
        { allowLimited: true },
      );
    if (req !== cacheMeanRequestSeq.current) return;
    if (!source) {
      setCachedMeanRaw(null);
      setCachedScore(null);
      setCachedScoreExpiresAtMs(null);
      return;
    }
    const scores = contexts.map((ctx) => source[ctx]!.report.score);
    const meanRaw = scores.reduce((a, b) => a + b, 0) / scores.length;
    const expiresAtMs = Math.min(
      ...contexts
        .map((ctx) => new Date(source[ctx]!.cache_expires_at).getTime())
        .filter(Number.isFinite),
    );
    const v = Math.round(meanRaw) / 10;
    const display = Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
    setCachedMeanRaw(meanRaw);
    setCachedScore(display);
    setCachedScoreExpiresAtMs(Number.isFinite(expiresAtMs) ? expiresAtMs : null);
  }, [coords?.lat, coords?.lon, locationCoastalEligible, reportCacheOwnerKey]);

  useEffect(() => {
    void loadCachedReportMean();
  }, [loadCachedReportMean]);

  useEffect(() => {
    if (cachedScoreExpiresAtMs == null) return;
    const delayMs = Math.max(1000, cachedScoreExpiresAtMs - Date.now() + 1000);
    const timer = setTimeout(() => {
      setCachedMeanRaw(null);
      setCachedScore(null);
      setCachedScoreExpiresAtMs(null);
      void loadCachedReportMean();
    }, delayMs);
    return () => clearTimeout(timer);
  }, [cachedScoreExpiresAtMs, loadCachedReportMean]);

  useFocusEffect(
    useCallback(() => {
      void loadCachedReportMean();
    }, [loadCachedReportMean]),
  );

  // ── Forecast fetch ─────────────────────────────────────────────────────────
  const forecastFetchSeq = useRef(0);
  const loadForecastScores = useCallback(async () => {
    const lat = coords?.lat;
    const lon = coords?.lon;
    if (lat == null || lon == null) {
      setForecastDays(null);
      setForecastExpiresAtMs(null);
      return;
    }
    const mySeq = ++forecastFetchSeq.current;
    setForecastLoading(true);
    try {
      const result = await getForecastScores(
        lat,
        lon,
        hasSubscription
          ? undefined
          : { maxDayOffset: 1, includeSnapshotEnv: true },
      );
      if (mySeq !== forecastFetchSeq.current) return;
      if (result) {
        setForecastDays(result.forecast);
        setForecastCoastalEligible(Boolean(result.snapshot_env?.coastal));
        setForecastExpiresAtMs(nextMidnightInTimeZoneMs(result.timezone));
        const w = result.snapshot_env?.weather;
        setForecastHighs(w?.temp_7day_high ?? null);
        setForecastLows(w?.temp_7day_low ?? null);
      }
    } catch {
      if (mySeq === forecastFetchSeq.current) {
        setForecastDays(null);
        setForecastCoastalEligible(null);
        setForecastExpiresAtMs(null);
        setForecastHighs(null);
        setForecastLows(null);
      }
    } finally {
      if (mySeq === forecastFetchSeq.current) setForecastLoading(false);
    }
  }, [coords?.lat, coords?.lon, hasSubscription]);

  useEffect(() => {
    void loadForecastScores();
    return () => {
      forecastFetchSeq.current++;
    };
  }, [loadForecastScores]);

  useEffect(() => {
    if (forecastExpiresAtMs == null) return;
    const delayMs = Math.max(1000, forecastExpiresAtMs - Date.now() + 1000);
    const timer = setTimeout(() => {
      void loadForecastScores();
    }, delayMs);
    return () => clearTimeout(timer);
  }, [forecastExpiresAtMs, loadForecastScores]);

  // ── Live conditions auto-refresh ──────────────────────────────────────────
  const refreshLiveConditions = useCallback(() => {
    const now = Date.now();
    if (now - lastAutoRefreshAtRef.current < 3000) return;
    lastAutoRefreshAtRef.current = now;
    const units = profile?.preferred_units ?? "imperial";
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
        const inMemory = getCurrentMultiRebuild(
          coords.lat,
          coords.lon,
          reportCacheOwnerKey,
        );
        if (inMemory && contexts.every((ctx) => inMemory[ctx] != null)) {
          const meanRaw = contexts.reduce((sum, ctx) =>
            sum + inMemory[ctx]!.report.score, 0) / contexts.length;
          const v = Math.round(meanRaw) / 10;
          setCachedScore(Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1));
        }
      }
    }, [
      refreshLiveConditions,
      loadForecastScores,
      coords?.lat,
      coords?.lon,
      locationCoastalEligible,
      reportCacheOwnerKey,
    ]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasBackgrounded = appStateRef.current === "background" ||
        appStateRef.current === "inactive";
      if (wasBackgrounded && nextAppState === "active") {
        refreshLiveConditions();
        void loadForecastScores();
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, [refreshLiveConditions, loadForecastScores]);

  // ── Location picker handlers ──────────────────────────────────────────────
  const handleLocationSelect = useCallback(
    async (loc: { lat: number; lon: number; label: string }) => {
      if (coords) invalidateForecastCache(coords.lat, coords.lon);
      await recordRecentLocation({
        lat: loc.lat,
        lon: loc.lon,
        label: loc.label,
      });
      await setSavedLocation(loc);
      setShowLocationPicker(false);
      setForecastDays(null);
      setForecastCoastalEligible(null);
      setForecastExpiresAtMs(null);
      setForecastHighs(null);
      setForecastLows(null);
      setCachedScore(null);
      setCachedMeanRaw(null);
      setCachedScoreExpiresAtMs(null);
      const units = profile?.preferred_units ?? "imperial";
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
    setForecastDays(null);
    setForecastCoastalEligible(null);
    setForecastExpiresAtMs(null);
    setCachedScore(null);
    setCachedMeanRaw(null);
    setCachedScoreExpiresAtMs(null);
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status === "undetermined") {
        ({ status } = await Location.requestForegroundPermissionsAsync());
      }
      if (status !== "granted") {
        Alert.alert(
          "Location access",
          "To use your current spot, allow location access for FinFindr in Settings, or pick a city below.",
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;
      setGpsCoords({ lat, lon });
      const units = profile?.preferred_units ?? "imperial";
      await loadEnv(lat, lon, { units });

      let label = "Current location";
      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lon,
        });
        if (geo) {
          const city = geo.city ?? geo.subregion ?? geo.district;
          const region = geo.region ?? "";
          label = city && region
            ? `${city}, ${region}`
            : city ?? region ?? label;
        }
      } catch {
        /* keep default label */
      }
      await recordRecentLocation({ lat, lon, label });
    } catch {
      Alert.alert(
        "Could not get location",
        "Check that Location Services are on and try again, or pick a city below.",
      );
    } finally {
      setShowLocationPicker(false);
    }
  }, [
    coords,
    useCustom,
    clearSavedLocation,
    setIgnoreGps,
    profile?.preferred_units,
    loadEnv,
  ]);

  const handleHowFishingPress = useCallback(() => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    if (!coords) {
      router.push({ pathname: "/how-fishing" });
      return;
    }
    router.push({
      pathname: "/how-fishing",
      params: {
        lat: String(coords.lat),
        lon: String(coords.lon),
        location_label: locationLabel,
      },
    });
  }, [coords, locationLabel, router]);

  const handleRecommenderPress = useCallback(() => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    const params: Record<string, string> = {};
    if (coords) {
      params.latitude = String(coords.lat);
      params.longitude = String(coords.lon);
      params.location_label = locationLabel;
    }
    router.push({ pathname: "/recommender", params });
  }, [coords, locationLabel, router]);

  const handleWaterReadPress = useCallback(() => {
    hapticImpact(ImpactFeedbackStyle.Light);
    router.push("/water-reader");
  }, [router]);

  const handleHowItWorksPress = useCallback(() => {
    hapticImpact(ImpactFeedbackStyle.Light);
    router.push("/how-it-works");
  }, [router]);

  const handleSettingsPress = useCallback(() => {
    hapticImpact(ImpactFeedbackStyle.Light);
    router.push("/(tabs)/settings");
  }, [router]);

  const handleForecastDayPress = useCallback(
    (day: DayForecastScore) => {
      hapticImpact(ImpactFeedbackStyle.Light);
      if (!canGenerateForecast) {
        setShowSubscribePrompt(true);
        return;
      }
      if (!coords) return;
      router.push({
        pathname: "/how-fishing",
        params: {
          lat: String(coords.lat),
          lon: String(coords.lon),
          location_label: locationLabel,
          day_offset: String(day.day_offset),
          target_date: day.date,
        },
      });
    },
    [canGenerateForecast, coords, locationLabel, router],
  );

  // ── Derived presentation values ───────────────────────────────────────────
  const combinedOutlookScore = useCallback(
    (day: DayForecastScore): number =>
      meanDayScore(day, locationCoastalEligible),
    [locationCoastalEligible],
  );

  const heroScore = cachedMeanRaw != null
    ? formatScoreDisplay(cachedMeanRaw)
    : cachedScore;
  const hasReport = cachedMeanRaw != null;
  const heroScore10 = cachedMeanRaw != null
    ? roundedScore10FromRaw(cachedMeanRaw)
    : null;
  const heroBand = heroScore10 != null ? paperBandForScore(heroScore10) : null;
  const heroBandStyle = heroBand ? dashboardBandColor[heroBand] : null;

  const forecastDisplayDays =
    (forecastDays?.filter((d) => d.day_offset > 0) ?? []).slice(
      0,
      FORECAST_COLS,
    );
  const lockedForecastSeedDate = forecastDisplayDays[0]?.date ??
    forecastDays?.find((d) => d.day_offset === 0)?.date ?? "";
  const freeForecastPreviewDay =
    forecastDisplayDays.find((d) =>
      canViewForecastScore(effectiveTier, d.day_offset) &&
      d.day_offset === FREE_FORECAST_PREVIEW_DAY_OFFSET
    ) ?? null;
  const lockedForecastPlaceholders = useMemo(
    () =>
      buildLockedForecastPlaceholders(
        `${lockedForecastSeedDate}|${coords?.lat ?? ""}|${coords?.lon ?? ""}`,
      ),
    [lockedForecastSeedDate, coords?.lat, coords?.lon],
  );
  const forecastTileSlots: Array<
    DayForecastScore | LockedForecastPlaceholder | null
  > = hasSubscription
    ? forecastDisplayDays.length > 0
      ? forecastDisplayDays
      : Array.from({ length: FORECAST_COLS }).map(() => null)
    : freeForecastPreviewDay
    ? [freeForecastPreviewDay, ...lockedForecastPlaceholders].slice(
      0,
      FORECAST_COLS,
    )
    : lockedForecastPlaceholders.length > 0
    ? lockedForecastPlaceholders.slice(0, FORECAST_COLS)
    : Array.from({ length: FORECAST_COLS }).map(() => null);

  // ── Live wall-clock + greeting ────────────────────────────────────────────
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const msUntilNextMinute = 60_000 - (Date.now() % 60_000);
    const align = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60_000);
    }, msUntilNextMinute);
    return () => {
      clearTimeout(align);
      if (interval) clearInterval(interval);
    };
  }, []);
  const hhmm = useMemo(() => {
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    return `${h}${m}`;
  }, [now]);
  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 5) return "UP EARLY, ANGLER";
    if (h < 12) return "GOOD MORNING, ANGLER";
    if (h < 17) return "GOOD AFTERNOON, ANGLER";
    if (h < 21) return "GOOD EVENING, ANGLER";
    return "LATE NIGHT, ANGLER";
  }, [now]);

  // ── Live conditions derived strings (from envData) ───────────────────────
  const currentTemp = envData?.weather?.temperature;
  const tempUnit = envData?.weather?.temp_unit ?? "°F";
  const conditionsSubline = useMemo(
    () =>
      deriveConditionsSubline(
        envData?.weather?.cloud_cover,
        envData?.weather?.precipitation,
      ),
    [envData?.weather?.cloud_cover, envData?.weather?.precipitation],
  );
  const windCardinal = envData?.weather?.wind_direction != null
    ? cardinal8(envData.weather.wind_direction)
    : null;
  const windMph = envData?.weather?.wind_speed;
  const humidityPct = envData?.weather?.humidity;
  const pressureInches = envData?.weather?.pressure != null
    ? (envData.weather.pressure / 33.8639).toFixed(1)
    : null;
  const pressureTrendLabel = pressureTrendDisplay(
    envData?.weather?.pressure_trend,
  );
  // 6-hour temp trend computed from the actual hourly_air_temp_f series.
  // We look at each entry's `time_utc` and pick the one closest to "now"
  // (latest) and the one closest to "now − 6h" (past), so the delta is
  // always (current − 6h ago) regardless of array order or whether the
  // series mixes past + forecast hours.
  const tempTrendDisplay = useMemo(() => {
    const series = envData?.hourly_air_temp_f;
    if (!series || series.length < 2) return null;
    const nowMs = Date.now();
    const sixHoursAgoMs = nowMs - 6 * 60 * 60 * 1000;
    let nowIdx = -1;
    let nowDelta = Infinity;
    let pastIdx = -1;
    let pastDelta = Infinity;
    for (let i = 0; i < series.length; i++) {
      const t = Date.parse(series[i].time_utc);
      if (Number.isNaN(t)) continue;
      // "Now" candidate: closest entry that's not in the future.
      if (t <= nowMs) {
        const d = nowMs - t;
        if (d < nowDelta) {
          nowDelta = d;
          nowIdx = i;
        }
      }
      // Past candidate: closest entry to 6 hours ago (either side).
      const d6 = Math.abs(t - sixHoursAgoMs);
      if (d6 < pastDelta) {
        pastDelta = d6;
        pastIdx = i;
      }
    }
    if (nowIdx === -1 || pastIdx === -1 || nowIdx === pastIdx) return null;
    const currentTempReading = series[nowIdx]?.value;
    const pastTempReading = series[pastIdx]?.value;
    if (currentTempReading == null || pastTempReading == null) return null;
    return sixHourTrendChip(currentTempReading - pastTempReading);
  }, [envData?.hourly_air_temp_f]);
  // Today's air temp range — index 14 of the 21-entry hi/lo arrays is "today".
  const todayHi = envData?.weather?.temp_7day_high?.[14];
  const todayLo = envData?.weather?.temp_7day_low?.[14];

  // Hourly temp sparkline points (last 6h leading up to now).
  const sparklinePoints = useMemo(() => {
    const series = envData?.hourly_air_temp_f;
    if (!series || series.length < 2) return null;
    const tail = series.slice(-6);
    return tail.map((p) => p.value);
  }, [envData?.hourly_air_temp_f]);

  // ── Synced/Ago meter (footer) ────────────────────────────────────────────
  const [agoSeconds, setAgoSeconds] = useState<number | null>(null);
  useEffect(() => {
    if (!envLastFetchedAt) {
      setAgoSeconds(null);
      return;
    }
    const fetched = new Date(envLastFetchedAt).getTime();
    const tick = () => {
      const diff = Math.max(0, Math.round((Date.now() - fetched) / 1000));
      setAgoSeconds(diff);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [envLastFetchedAt]);

  // ── Pull-to-refresh ──────────────────────────────────────────────────────
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    hapticImpact(ImpactFeedbackStyle.Light);
    setRefreshing(true);
    try {
      // Pull-to-refresh only re-fetches LIVE CONDITIONS — it does not
      // re-run the day's bite report (which the user generates manually
      // by tapping "Get your read") and it does not re-fetch the 6-day
      // forecast (which the engine produces on a slower cadence).
      lastAutoRefreshAtRef.current = 0;
      refreshLiveConditions();
      // Briefly hold the spinner so the gesture feels intentional even
      // when the env API responds in a few hundred milliseconds from
      // cache. ~600 ms is the sweet spot.
      await new Promise((resolve) => setTimeout(resolve, 600));
    } finally {
      setRefreshing(false);
    }
  }, [refreshLiveConditions]);

  const handleRequestLocation = useCallback(async () => {
    if (__DEV__) {
      await setIgnoreGps(false);
    }
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setGpsCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
  }, [setIgnoreGps]);

  // ── Animations ───────────────────────────────────────────────────────────
  // Period pulse on the FinFindr "." in the nav header.
  const periodPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(periodPulse, {
          toValue: 1.18,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(periodPulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [periodPulse]);

  // Live-dot pulse (scale + opacity).
  const livePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(livePulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [livePulse]);

  // Scan-line drift down the live conditions card.
  const scanY = useRef(new Animated.Value(0)).current;
  const [scanHeight, setScanHeight] = useState(0);
  useEffect(() => {
    if (scanHeight === 0) return;
    scanY.setValue(0);
    const loop = Animated.loop(
      Animated.timing(scanY, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [scanY, scanHeight]);

  // Shimmer sweep across the bite CTA.
  const shimmerX = useRef(new Animated.Value(0)).current;
  const [shimmerWidth, setShimmerWidth] = useState(0);
  useEffect(() => {
    if (shimmerWidth === 0) return;
    shimmerX.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerX, shimmerWidth]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* Light status bar text/icons so they read against the navy header. */}
      <StatusBar style="light" />
      <SafeAreaView edges={["top"]} style={styles.safeNav}>
        <View style={styles.navBar}>
          <View style={styles.navBarLeft}>
            <FinFindrEmblemView />
            <View style={styles.navWordmarkRow}>
              <Text style={styles.navWordmark}>FinFindr</Text>
              <Animated.Text
                style={[styles.navWordmarkPeriod, {
                  transform: [{ scale: periodPulse }],
                }]}
              >
                .
              </Animated.Text>
            </View>
          </View>

          <View style={styles.navBarRight}>
            <Pressable
              style={(
                { pressed },
              ) => [styles.livePill, pressed && { opacity: 0.7 }]}
              onPress={() => setShowLocationPicker(true)}
              hitSlop={8}
            >
              <Animated.View
                style={[styles.livePillDot, { opacity: livePulse }]}
              />
              <Text
                style={styles.livePillText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {(locationLabel ?? "LIVE").toUpperCase()}
              </Text>
              <Ionicons
                name="chevron-down"
                size={11}
                color="#FFFFFF"
                style={{ opacity: 0.7, marginLeft: 1 }}
              />
            </Pressable>
            <Pressable
              style={(
                { pressed },
              ) => [styles.overflowBtn, pressed && { opacity: 0.7 }]}
              onPress={handleSettingsPress}
              hitSlop={8}
            >
              <Ionicons name="ellipsis-horizontal" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={paper.dashboardInk}
            colors={[paper.dashboardInk]}
            progressBackgroundColor={paper.dashboardCream}
          />
        }
      >
        {/* ─── Headline band ───────────────────────────────────────────── */}
        <View style={styles.headlineBand}>
          <View style={styles.headlineEyebrowRow}>
            <Text style={styles.headlineEyebrow}>{hhmm} · {greeting}</Text>
          </View>

          <View style={styles.headlineWaitingRow}>
            <View style={styles.headlineWaitingText}>
              {hasReport && heroBandStyle
                ? (
                  <>
                    <Text style={styles.headlineWaiting}>
                      {verdictLeading(heroBand!)}
                    </Text>
                    <Text style={styles.headlineWaitingItalic}>
                      <Text style={{ color: heroBandStyle.verdictColor }}>
                        {heroBandStyle.verdict}
                      </Text>
                      <Text style={styles.headlineWaitingDot}>.</Text>
                    </Text>
                  </>
                )
                : (
                  <>
                    <Text style={styles.headlineWaiting}>The water is</Text>
                    <Text style={styles.headlineWaitingItalic}>
                      waiting<Text style={styles.headlineWaitingDot}>.</Text>
                    </Text>
                  </>
                )}
            </View>
            <View pointerEvents="none" style={styles.headlinePines}>
              <MistyPinesView />
            </View>
          </View>
        </View>

        {/* ─── Live Conditions card ──────────────────────────────────────── */}
        <View
          style={styles.liveCard}
          onLayout={(e) => setScanHeight(e.nativeEvent.layout.height)}
        >
          {/* Corner crosses */}
          <View style={[styles.cornerCross, styles.cornerCrossTL]} />
          <View style={[styles.cornerCross, styles.cornerCrossTR]} />
          <View style={[styles.cornerCross, styles.cornerCrossBL]} />
          <View style={[styles.cornerCross, styles.cornerCrossBR]} />

          {/* Scan line overlay */}
          {scanHeight > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.scanLine,
                {
                  transform: [
                    {
                      translateY: scanY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, scanHeight + 50],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}

          {/* Card header bar */}
          <Pressable
            style={(
              { pressed },
            ) => [styles.liveCardHeader, pressed && { opacity: 0.85 }]}
            onPress={() => setShowLocationPicker(true)}
            hitSlop={6}
          >
            <View style={styles.liveCardHeaderLeft}>
              <Animated.View
                style={[styles.liveCardHeaderDot, { opacity: livePulse }]}
              />
              <Text style={styles.liveCardHeaderLabel} numberOfLines={1}>
                LIVE · {(locationLabel ?? "Pick a spot").toUpperCase()}
              </Text>
            </View>
            <View style={styles.liveCardHeaderRight}>
              {coords && (
                <Text style={styles.liveCardHeaderCoords}>
                  {coords.lat.toFixed(2)}°N ·{" "}
                  {Math.abs(coords.lon).toFixed(2)}°W
                </Text>
              )}
              <Ionicons
                name="chevron-forward"
                size={14}
                color={paper.dashboardInk}
                style={{ opacity: 0.6, marginLeft: 4 }}
              />
            </View>
          </Pressable>

          {/* Body */}
          <View style={styles.liveCardBody}>
            <View style={styles.liveCardTopRow}>
              {/* Optional score chip on the left */}
              {hasReport && heroBandStyle && (
                <View
                  style={[
                    styles.liveCardScoreChip,
                    {
                      backgroundColor: heroBandStyle.chipBg,
                      borderColor: heroBandStyle.chipBorder,
                    },
                  ]}
                >
                  <Text
                    style={[styles.liveCardScoreEyebrow, {
                      color: heroBandStyle.verdictColor,
                    }]}
                  >
                    TODAY'S SCORE
                  </Text>
                  <View style={styles.liveCardScoreNumberRow}>
                    <Text style={styles.liveCardScoreNumber}>{heroScore}</Text>
                    <Text style={styles.liveCardScoreUnit}>/10</Text>
                  </View>
                  <View
                    style={[styles.liveCardScoreBandPill, {
                      backgroundColor: heroBandStyle.bg,
                    }]}
                  >
                    <View
                      style={[styles.liveCardScoreBandDot, {
                        backgroundColor: heroBandStyle.fg,
                      }]}
                    />
                    <Text
                      style={[styles.liveCardScoreBandText, {
                        color: heroBandStyle.fg,
                      }]}
                    >
                      {heroBandStyle.label.toUpperCase()}
                    </Text>
                  </View>
                </View>
              )}

              {/* Temp + sparkline */}
              <View
                style={[
                  styles.liveCardTempCol,
                  hasReport && { paddingLeft: 14 },
                ]}
              >
                <View style={styles.liveCardTempRow}>
                  <Text style={styles.liveCardTempNumber}>
                    {currentTemp != null ? Math.round(currentTemp) : "—"}
                  </Text>
                  <Text style={styles.liveCardTempUnit}>
                    {tempUnit || "°F"}
                  </Text>
                </View>
                <Text style={styles.liveCardTempSubline}>
                  {conditionsSubline ?? "Conditions loading…"}
                </Text>
              </View>

              {/* Sparkline (right-aligned) */}
              <View style={styles.liveCardSparkCol}>
                <Text style={styles.liveCardSparkEyebrow}>
                  HOURLY TEMP · 6H
                </Text>
                <SparklineBars
                  points={sparklinePoints}
                  width={108}
                  height={36}
                />
                {tempTrendDisplay && (
                  <Text
                    style={[styles.liveCardSparkTrend, {
                      color: tempTrendDisplay.color,
                    }]}
                  >
                    {tempTrendDisplay.label}
                  </Text>
                )}
              </View>
            </View>

            {/* Today's bite CTA */}
            <Pressable
              style={(
                { pressed },
              ) => [styles.biteCta, pressed && { opacity: 0.92 }]}
              onPress={handleHowFishingPress}
              onLayout={(e) => setShimmerWidth(e.nativeEvent.layout.width)}
            >
              {shimmerWidth > 0 && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.biteCtaShimmer,
                    {
                      transform: [
                        {
                          translateX: shimmerX.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-shimmerWidth, shimmerWidth * 1.5],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              )}
              <View style={styles.biteCtaLeft}>
                <View style={styles.biteCtaIconTile}>
                  <Ionicons name="pulse" size={16} color="#2A6E96" />
                </View>
                <View>
                  <Text style={styles.biteCtaEyebrow}>TODAY'S BITE</Text>
                  <Text style={styles.biteCtaTitle}>
                    {hasReport ? "View today's report" : "Get your read"}
                  </Text>
                </View>
              </View>
              <View style={styles.biteCtaRight}>
                <BiteCtaWaveView />
                <View style={styles.biteCtaArrowTile}>
                  <Ionicons
                    name="arrow-up"
                    size={12}
                    color="#2A6E96"
                    style={{ transform: [{ rotate: "45deg" }] }}
                  />
                </View>
              </View>
            </Pressable>

            {/* Metric grid */}
            <View style={styles.metricsGrid}>
              <MetricCell
                icon="leaf-outline"
                label="WIND"
                value={windMph != null ? String(Math.round(windMph)) : "—"}
                unit="mph"
                sub={windCardinal ?? "—"}
              />
              <MetricCell
                icon="water-outline"
                label="HUMIDITY"
                value={humidityPct != null
                  ? String(Math.round(humidityPct))
                  : "—"}
                unit="%"
                sub={humidityDisplay(envData?.weather?.humidity)}
              />
              <MetricCell
                icon="thermometer-outline"
                label="TODAY"
                value={todayHi != null && todayLo != null
                  ? `${Math.round(todayHi)}/${Math.round(todayLo)}`
                  : "—"}
                unit="°F"
                sub="HI / LO"
              />
              <MetricCell
                icon="speedometer-outline"
                label="PRESSURE"
                value={pressureInches ?? "—"}
                unit="in"
                sub={pressureTrendLabel}
                last
              />
            </View>

            <View style={styles.liveRefreshHint}>
              <View style={styles.liveRefreshHintIcon}>
                <Ionicons
                  name={refreshing ? "sync" : "arrow-down"}
                  size={10}
                  color={paper.dashboardBlue}
                />
              </View>
              <Text
                style={styles.liveRefreshHintText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {refreshing
                  ? "Checking live conditions..."
                  : agoSeconds == null
                  ? "Live conditions ready · hourly updates"
                  : `Checked ${
                    formatAgo(agoSeconds).toLowerCase()
                  } · hourly updates`}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── 6-Day Bite Forecast ───────────────────────────────────────── */}
        <View style={styles.forecast}>
          <View style={styles.forecastHeaderRow}>
            <Text style={styles.forecastEyebrow}>── 6-DAY BITE FORECAST</Text>
            <Text style={styles.forecastUnit}>
              <Text style={{ color: paper.bandPrime }}>▲</Text>SCORE / 10
            </Text>
          </View>

          <View style={styles.forecastGrid}>
            {forecastTileSlots.map(
              (day, i) => {
                if (!day) {
                  return (
                    <View
                      key={`skel-${i}`}
                      style={[
                        styles.forecastTile,
                        styles.forecastTileSkeleton,
                      ]}
                    >
                      <View style={styles.forecastTileHeaderSkeleton} />
                      <View style={styles.forecastTileBodySkeleton} />
                    </View>
                  );
                }
                if ("kind" in day && day.kind === "locked") {
                  return (
                    <Pressable
                      key={day.key}
                      onPress={() => setShowSubscribePrompt(true)}
                      accessibilityLabel="Locked Angler forecast day"
                      style={({ pressed }) => [
                        styles.forecastTile,
                        styles.forecastTileLocked,
                        pressed && { opacity: 0.85 },
                      ]}
                    >
                      <View style={styles.forecastTileHead}>
                        <Text style={styles.forecastTileDay} numberOfLines={1}>
                          {day.dayLabel}
                        </Text>
                        <Text style={styles.forecastTileDate}>
                          {day.dateNum}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.forecastTileScoreBlock,
                          styles.forecastTileLockedScoreBlock,
                          { backgroundColor: day.color },
                        ]}
                      >
                        <View
                          pointerEvents="none"
                          style={styles.forecastTileLockVeil}
                        />
                        <Ionicons
                          name="lock-closed"
                          size={15}
                          color="rgba(10,27,46,0.58)"
                          style={styles.forecastTileLockIcon}
                        />
                      </View>
                      <View style={styles.forecastTileHiLo}>
                        <Text style={styles.forecastTileLockedHint}>
                          ANGLER
                        </Text>
                      </View>
                    </Pressable>
                  );
                }
                const realDay = day as DayForecastScore;
                const raw = combinedOutlookScore(realDay);
                const score10 = roundedScore10FromRaw(raw);
                const tileBg = scoreAccentColor(score10);
                const isFreePreview = !hasSubscription;
                const isFirst = i === 0;
                const dateNum = realDay.month_day?.split(/[ /-]/).pop() ?? "";
                const dayLabel = isFirst
                  ? "TOMORROW"
                  : abbreviateDay(realDay.day_label);
                // 21-entry hi/lo arrays: index 14 = today, so 14 + day_offset
                // gives this forecast day's slot. Fallback to em-dashes when
                // the forecast snapshot didn't carry the temperature arrays.
                const tIdx = 14 + realDay.day_offset;
                const tileHi = forecastHighs?.[tIdx];
                const tileLo = forecastLows?.[tIdx];
                return (
                  <Pressable
                    key={realDay.date}
                    onPress={() => handleForecastDayPress(realDay)}
                    style={(
                      { pressed },
                    ) => [
                      styles.forecastTile,
                      pressed && { opacity: 0.85 },
                    ]}
                    accessibilityLabel={isFreePreview
                      ? "Tomorrow forecast score preview"
                      : "Open forecast day report"}
                  >
                    {isFirst && (
                      <Text style={styles.forecastTileTomorrow}>
                        TOMORROW
                      </Text>
                    )}
                    <View style={styles.forecastTileHead}>
                      <Text style={styles.forecastTileDay} numberOfLines={1}>
                        {isFirst ? abbreviateDay(realDay.day_label) : dayLabel}
                      </Text>
                      <Text style={styles.forecastTileDate}>{dateNum}</Text>
                    </View>
                    <View
                      style={[
                        styles.forecastTileScoreBlock,
                        { backgroundColor: tileBg },
                      ]}
                    >
                      <Text
                        style={[styles.forecastTileScore, {
                          color: paper.dashboardInk,
                        }]}
                      >
                        {formatScoreDisplay(raw)}
                      </Text>
                    </View>
                    <View style={styles.forecastTileHiLo}>
                      <Text
                        style={styles.forecastTileHiLoText}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                      >
                        {tileHi != null ? `${Math.round(tileHi)}°` : "—"}
                        <Text style={styles.forecastTileHiLoSep}>/</Text>
                        {tileLo != null ? `${Math.round(tileLo)}°` : "—"}
                      </Text>
                    </View>
                  </Pressable>
                );
              },
            )}
          </View>

          <Text style={styles.forecastDisclaimer}>
            Forecast days may change as weather conditions update.
          </Text>

          <View style={styles.forecastLegend}>
            {(["Tough", "Poor", "Fair", "Good", "Prime"] as const).map((b) => (
              <View key={b} style={styles.forecastLegendItem}>
                <View
                  style={[styles.forecastLegendSwatch, {
                    backgroundColor: dashboardBandColor[b].bg,
                  }]}
                />
                <Text style={styles.forecastLegendLabel}>
                  {b.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Intelligence Modules ─────────────────────────────────────── */}
        <View style={styles.modules}>
          <View style={styles.modulesHeader}>
            <Text style={styles.modulesEyebrow}>── INTELLIGENCE MODULES</Text>
            <Text style={styles.modulesCount}>3 / 3</Text>
          </View>

          <ModuleRow
            code="01"
            title="Water Read"
            tag="POLYGON"
            desc="Most lakes: structure + potential hotspots"
            iconBg={["#E8F2FA", "#C8DFF2"]}
            iconBorder="#0F63B0"
            iconColor="#0A4A87"
            iconName="layers-outline"
            onPress={handleWaterReadPress}
          />
          <ModuleRow
            code="02"
            title="Tackle Box"
            tag="RECOMMENDER"
            desc="Tuned picks for today's conditions & species"
            iconBg={["#FBF1D9", "#F4DFA4"]}
            iconBorder="#C99B2D"
            iconColor="#8A6A1A"
            iconName="fish-outline"
            onPress={handleRecommenderPress}
          />
          <ModuleRow
            code="03"
            title="Today's Bite"
            tag="CONDITIONS"
            desc="Full breakdown · windows · limiting factors"
            iconBg={["#E5F2DD", "#C5E0B5"]}
            iconBorder="#3DA85F"
            iconColor="#1F6B38"
            iconName="sparkles-outline"
            onPress={handleHowFishingPress}
          />
          <Pressable
            style={({ pressed }) => [
              styles.howWorksCta,
              pressed && { opacity: 0.86 },
            ]}
            onPress={handleHowItWorksPress}
            accessibilityRole="button"
            accessibilityLabel="Open How FinFindr Reads A Day"
          >
            <View style={styles.howWorksLeft}>
              <View style={styles.howWorksIconTile}>
                <Ionicons
                  name="information-circle-outline"
                  size={15}
                  color={paper.dashboardBlue}
                />
              </View>
              <View style={styles.howWorksTextCol}>
                <Text style={styles.howWorksEyebrow}>TRANSPARENCY</Text>
                <Text style={styles.howWorksTitle}>
                  How FinFindr reads a day
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={15}
              color={paper.dashboardInk}
              style={{ opacity: 0.62 }}
            />
          </Pressable>
        </View>

        {/* ─── Footer ────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Ionicons
              name="boat-outline"
              size={11}
              color={paper.dashboardMuted}
            />
            <Text style={styles.footerSync}>
              SYNCED · {agoSeconds == null ? "—" : formatAgo(agoSeconds)}
            </Text>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.signalBars}>
              <View
                style={[styles.signalBar, {
                  height: 5,
                  backgroundColor: paper.bandPrime,
                }]}
              />
              <View
                style={[styles.signalBar, {
                  height: 7,
                  backgroundColor: paper.bandPrime,
                }]}
              />
              <View
                style={[styles.signalBar, {
                  height: 9,
                  backgroundColor: paper.bandPrime,
                }]}
              />
              <View
                style={[styles.signalBar, {
                  height: 11,
                  backgroundColor: paper.bandPrime,
                }]}
              />
            </View>
            <Text style={styles.footerStamp}>
              FINFINDR{gpsRegionLabel || (savedLocation && useCustom)
                ? " · "
                : ""}
              {savedLocation && useCustom
                ? regionStamp(savedLocation.label)
                : (gpsRegionLabel ? regionStamp(gpsRegionLabel) : "")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <LocationPickerModal
        visible={showLocationPicker}
        currentLabel={useCustom && savedLocation
          ? savedLocation.label
          : gpsLabel}
        isUsingCustom={useCustom && savedLocation != null}
        savedLocation={savedLocation}
        onSelect={handleLocationSelect}
        onUseGPS={handleUseGPS}
        onClose={() => setShowLocationPicker(false)}
      />
      <SubscribePrompt
        visible={showSubscribePrompt}
        onDismiss={() => setShowSubscribePrompt(false)}
        onUnlocked={() => {
          setShowSubscribePrompt(false);
        }}
      />
      {/* GPS-permission gate (silent if granted; prompts if not) */}
      {!coords && !__DEV__ && (
        <Pressable style={styles.gpsGate} onPress={handleRequestLocation}>
          <Text style={styles.gpsGateText}>Tap to enable location</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bar-style sparkline — column chart instead of a curve, so it renders with
 * pure RN primitives and doesn't need the react-native-svg native bridge.
 * Visually still reads as "temperature trend over the last 6 hours".
 */
function SparklineBars(
  { points, width, height }: {
    points: number[] | null;
    width: number;
    height: number;
  },
) {
  if (!points || points.length < 2) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontFamily: MONO, fontSize: 9, color: paper.dashboardMuted }}
        >
          —
        </Text>
      </View>
    );
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const gap = 2;
  const barW = (width - gap * (points.length - 1)) / points.length;
  return (
    <View
      style={{ width, height, flexDirection: "row", alignItems: "flex-end" }}
    >
      {points.map((v, i) => {
        const ratio = (v - min) / range;
        const h = Math.max(3, 6 + ratio * (height - 6));
        const isLast = i === points.length - 1;
        return (
          <View
            key={i}
            style={{
              width: barW,
              height: h,
              marginRight: i === points.length - 1 ? 0 : gap,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              backgroundColor: isLast ? "#4F95C2" : "#7CB8DA",
              opacity: isLast ? 1 : 0.55,
            }}
          />
        );
      })}
    </View>
  );
}

/**
 * Pulsating wave for the bite CTA — a row of small dash segments whose
 * vertical positions trace a traveling sine wave. The wave's amplitude
 * itself pulses (0 → max → 0), so the line morphs from STRAIGHT into a
 * SQUIGGLE and back into a STRAIGHT line continuously, just like the
 * reference design's animated SVG path.
 *
 * Built from pure RN Views + Animated. `phase` drives the traveling-wave
 * (each segment is interpolated against a sine-wave keyframe table with
 * a per-segment phase offset). `amp` drives the breathe-in / breathe-out
 * of the wave height.
 */
/**
 * Pulsating wave for the bite CTA — a row of edge-touching segments whose
 * vertical positions trace a traveling sine wave. Because the segments
 * touch each other (no horizontal gap), the line reads as a continuous
 * SOLID horizontal line when the wave's amplitude collapses to zero, and
 * morphs into a smooth squiggle when amplitude rises. No dashes ever.
 *
 * `phase` drives the traveling-wave (each segment is interpolated against
 * a sine-wave keyframe table with a per-segment phase offset). `amp`
 * drives the breathe-in / breathe-out of the wave height.
 */
function BiteCtaWaveView() {
  const N = 22;
  const SEG_W = 2.4;
  const TOTAL_W = N * SEG_W;
  const phase = useRef(new Animated.Value(0)).current;
  const amp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const phaseLoop = Animated.loop(
      Animated.timing(phase, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const ampLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(amp, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(250),
        Animated.timing(amp, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(700),
      ]),
    );
    phaseLoop.start();
    ampLoop.start();
    return () => {
      phaseLoop.stop();
      ampLoop.stop();
    };
  }, [phase, amp]);

  const segs = useMemo(() => {
    return Array.from({ length: N }, (_, i) => {
      const offset = i / N;
      const inputRange = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
      const outputRange = inputRange.map((t) =>
        Math.sin((t + offset) * 2 * Math.PI) * 4.5
      );
      const sineY = phase.interpolate({ inputRange, outputRange });
      return Animated.multiply(sineY, amp);
    });
  }, [phase, amp]);

  return (
    <View
      style={{
        width: TOTAL_W,
        height: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {segs.map((ty, i) => (
        <Animated.View
          key={i}
          style={{
            width: SEG_W,
            height: 1.5,
            backgroundColor: "rgba(42,110,150,0.85)",
            transform: [{ translateY: ty }],
          }}
        />
      ))}
    </View>
  );
}

/**
 * FinFindr brand emblem rendered from the bundled PNG asset.
 * The logo file has a transparent background so it sits cleanly on the
 * dark navy header without a visible white block.
 */
function FinFindrEmblemView() {
  return (
    <Image
      source={require("../../assets/images/finfindr-logo.png")}
      style={{ width: 36, height: 47 }}
      resizeMode="contain"
    />
  );
}

/**
 * Decorative misty-lake illustration at the right edge of the headline
 * area — a square pen-and-ink PNG of a sun rising over a pine-fringed
 * lake. Bundled at `assets/images/misty-pines.png` and rendered with
 * `resizeMode="contain"` so it scales cleanly inside its container
 * without depending on `react-native-svg`.
 */
function MistyPinesView() {
  return (
    <Image
      source={require("../../assets/images/misty-pines.png")}
      style={{ width: 280, height: 200 }}
      resizeMode="contain"
    />
  );
}

function MetricCell({
  icon,
  label,
  value,
  unit,
  sub,
  last,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  unit: string;
  sub: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.metricCell, !last && styles.metricCellDivider]}>
      <View style={styles.metricCellTopRow}>
        <Ionicons name={icon} size={10} color={paper.dashboardMuted} />
        <Text style={styles.metricCellLabel}>{label}</Text>
      </View>
      <View style={styles.metricCellValueRow}>
        <Text
          style={styles.metricCellValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {value}
        </Text>
        <Text style={styles.metricCellUnit}>{unit}</Text>
      </View>
      <Text style={styles.metricCellSub}>{sub}</Text>
    </View>
  );
}

function ModuleRow({
  code,
  title,
  tag,
  desc,
  iconBg,
  iconBorder,
  iconColor,
  iconName,
  onPress,
}: {
  code: string;
  title: string;
  tag: string;
  desc: string;
  iconBg: [string, string];
  iconBorder: string;
  iconColor: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}) {
  return (
    <Pressable
      style={(
        { pressed },
      ) => [
        styles.moduleRow,
        pressed && { opacity: 0.92, transform: [{ translateY: -1 }] },
      ]}
      onPress={onPress}
    >
      <View style={styles.moduleDots}>
        <View
          style={[styles.moduleDot, {
            backgroundColor: iconBorder,
            opacity: 0.5,
          }]}
        />
        <View
          style={[styles.moduleDot, {
            backgroundColor: iconBorder,
            opacity: 0.7,
          }]}
        />
        <View style={[styles.moduleDot, { backgroundColor: iconBorder }]} />
      </View>
      <Text style={styles.moduleCode}>{code}</Text>
      <View
        style={[styles.moduleIcon, {
          backgroundColor: iconBg[1],
          borderColor: iconBorder + "60",
        }]}
      >
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.moduleTextCol}>
        <View style={styles.moduleTitleRow}>
          <Text style={styles.moduleTitle}>{title}</Text>
          <Text style={styles.moduleTag}>{tag}</Text>
        </View>
        <Text
          style={styles.moduleDesc}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.9}
        >
          {desc}
        </Text>
      </View>
      <Ionicons
        name="arrow-up"
        size={16}
        color={paper.dashboardInk}
        style={{ transform: [{ rotate: "45deg" }] }}
      />
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Leading copy for the post-report headline. Pairs with the verdict word
 * from `dashboardBandColor` so the line reads naturally for each band:
 *   Prime → "Today looks {prime}."
 *   Good  → "Today looks {strong}."
 *   Fair  → "Today looks {workable}."
 *   Poor  → "Today looks {slow}."
 *   Tough → "Today looks {tough}."
 */
function verdictLeading(band: PaperScoreBand): string {
  return "Today looks";
}

function abbreviateDay(label: string): string {
  const clean = label.trim().toUpperCase();
  if (clean === "TODAY") return "TODAY";
  if (clean === "TMRW" || clean === "TOMORROW") return "FRI";
  // Backend day_label is "Mon"/"Tue"/…; uppercasing is the abbrev.
  return clean.slice(0, 3);
}

function cardinal8(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round((deg % 360) / 45) % 8;
  return dirs[idx];
}

function deriveConditionsSubline(
  cloudCover?: number,
  precip?: number,
): string | null {
  if (cloudCover == null && precip == null) return null;
  const cloud = cloudCover ?? 0;
  const sky = cloud >= 80
    ? "Overcast"
    : cloud >= 50
    ? "Mostly cloudy"
    : cloud >= 25
    ? "Partly cloudy"
    : "Clear skies";
  const precipMm = precip ?? 0;
  if (precipMm <= 0) return sky;
  const wet = precipMm < 0.5
    ? "Light drizzle"
    : precipMm < 2
    ? "Light rain"
    : precipMm < 6
    ? "Steady rain"
    : "Heavy rain";
  return `${sky} · ${wet}`;
}

function pressureTrendDisplay(t?: string): string {
  switch (t) {
    case "rapidly_falling":
      return "FALLING";
    case "slowly_falling":
      return "FALLING";
    case "slowly_rising":
      return "RISING";
    case "rapidly_rising":
      return "RISING";
    case "stable":
      return "STEADY";
    default:
      return "—";
  }
}

function humidityDisplay(h?: number): string {
  if (h == null) return "—";
  if (h >= 80) return "HIGH";
  if (h >= 50) return "MODERATE";
  return "LOW";
}

/**
 * 6-hour temp trend chip. Takes the signed delta (now − 6h ago) in °F
 * and produces a human-friendly label + color. Anything within ±0.5°F
 * reads as STEADY; outside that we show the actual delta as "+3°F" or
 * "-2°F" with an arrow that matches direction.
 */
function sixHourTrendChip(deltaF: number): { label: string; color: string } {
  const rounded = Math.round(deltaF);
  if (Math.abs(deltaF) < 0.5) {
    return { label: "→ STEADY · 6H", color: paper.dashboardMuted };
  }
  const sign = rounded > 0 ? `+${rounded}°F` : `${rounded}°F`;
  if (deltaF > 0) {
    return { label: `↑ ${sign} · 6H`, color: paper.bandPrime };
  }
  return { label: `↓ ${sign} · 6H`, color: "#4F95C2" };
}

function formatAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s AGO`;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m AGO`;
  const h = Math.round(m / 60);
  return `${h}h AGO`;
}

function regionStamp(label: string): string {
  // Pull the trailing region/state code from a "City, ST" or "Wayzata, MN" string.
  const m = label.match(/,\s*([A-Z]{2,})$/);
  if (m) return m[1];
  // Otherwise return the last 2-3 word fragment uppercased for stamp use.
  const last = label.split(/[,\s]+/).pop() ?? "";
  return last.slice(0, 3).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },

  // ─── Nav bar (dark navy strip) ───────────────────────────────────────────
  safeNav: { backgroundColor: paper.dashboardInk },
  navBar: {
    height: 66,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: paper.dashboardInk,
  },
  navBarLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  navWordmarkRow: { flexDirection: "row", alignItems: "baseline" },
  navWordmark: {
    fontFamily: SERIF_BOLD,
    fontSize: 30,
    color: "#FFFFFF",
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  navWordmarkPeriod: {
    fontFamily: SERIF_BOLD,
    fontSize: 30,
    color: "#7CB8DA",
    marginLeft: 1,
    lineHeight: 32,
  },
  navBarRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  livePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    gap: 5,
    maxWidth: 130,
    flexShrink: 1,
  },
  livePillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.bandPrime,
    flexShrink: 0,
  },
  livePillText: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.0,
    color: "#FFFFFF",
    flexShrink: 1,
  },

  overflowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ─── Scroll content ──────────────────────────────────────────────────────
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  scrollContent: {
    paddingHorizontal: HOME_H_PADDING,
    paddingBottom: 32,
    paddingTop: 22,
  },

  // ─── Headline band ───────────────────────────────────────────────────────
  headlineBand: { marginBottom: 22 },
  headlineEyebrowRow: { marginBottom: 10 },
  headlineEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 2.2,
    color: "#444",
  },
  headlineWaitingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 110,
  },
  headlineWaitingText: { flex: 1, paddingTop: 4 },
  headlineWaiting: {
    fontFamily: SERIF_BOLD,
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: paper.dashboardInk,
  },
  headlineWaitingItalic: {
    fontFamily: SERIF_ITALIC,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.6,
    color: paper.dashboardInk,
    fontStyle: "italic",
  },
  headlineWaitingDot: {
    fontFamily: SERIF_BOLD,
    color: paper.dashboardBlue,
  },
  headlinePines: {
    position: "absolute",
    right: -36,
    top: -36,
    opacity: 0.95,
  },

  headlineReadRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  headlineScoreChip: {
    width: 118,
    height: 78,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headlineScoreChipCornerTL: {
    position: "absolute",
    top: 4,
    left: 4,
    width: 3,
    height: 3,
    borderRadius: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  headlineScoreChipCornerTR: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 3,
    height: 3,
    borderRadius: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  headlineScoreChipCornerBL: {
    position: "absolute",
    bottom: 4,
    left: 4,
    width: 3,
    height: 3,
    borderRadius: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  headlineScoreChipCornerBR: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 3,
    height: 3,
    borderRadius: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  headlineScoreChipInner: { flexDirection: "row", alignItems: "baseline" },
  headlineScoreNumber: {
    fontFamily: SERIF_BOLD,
    fontSize: 50,
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  headlineScoreUnit: {
    fontFamily: MONO_BOLD,
    fontSize: 13,
    marginLeft: 3,
  },
  headlineVerdictCol: { flex: 1 },
  headlineVerdictEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 2,
    color: "#666",
    marginBottom: 4,
  },
  headlineVerdictLine: {
    fontFamily: SERIF_BOLD,
    fontSize: 24,
    lineHeight: 26,
    letterSpacing: -0.5,
    color: paper.dashboardInk,
  },
  headlineVerdictWord: {
    fontFamily: SERIF_ITALIC,
    fontSize: 24,
    fontStyle: "italic",
  },

  // ─── Live conditions card ───────────────────────────────────────────────
  liveCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: "hidden",
    position: "relative",
    marginBottom: 22,
  },
  cornerCross: { position: "absolute", width: 9, height: 9, zIndex: 2 },
  cornerCrossTL: { top: -5, left: -5 },
  cornerCrossTR: { top: -5, right: -5 },
  cornerCrossBL: { bottom: -5, left: -5 },
  cornerCrossBR: { bottom: -5, right: -5 },

  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: "rgba(124,184,218,0.10)",
    zIndex: 1,
  },

  liveCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FAFAF7",
    borderBottomWidth: 1,
    borderColor: paper.dashboardHair,
  },
  liveCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
  },
  liveCardHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandPrime,
  },
  liveCardHeaderLabel: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 1.6,
    color: paper.dashboardInk,
    flexShrink: 1,
  },
  liveCardHeaderRight: { flexDirection: "row", alignItems: "center" },
  liveCardHeaderCoords: {
    fontFamily: MONO,
    fontSize: 9.5,
    color: paper.dashboardMuted,
  },

  liveCardBody: { padding: 16 },
  liveCardTopRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  liveCardScoreChip: {
    backgroundColor: "#FAF6E5",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 90,
  },
  liveCardScoreEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.6,
    color: "#8A6A1A",
    marginBottom: 2,
  },
  liveCardScoreNumberRow: { flexDirection: "row", alignItems: "baseline" },
  liveCardScoreNumber: {
    fontFamily: SERIF_BOLD,
    fontSize: 32,
    letterSpacing: -1.2,
    lineHeight: 34,
    color: paper.dashboardInk,
  },
  liveCardScoreUnit: {
    fontFamily: MONO_BOLD,
    fontSize: 11,
    color: paper.dashboardMuted,
    marginLeft: 2,
  },
  liveCardScoreBandPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  liveCardScoreBandDot: { width: 4, height: 4, borderRadius: 2 },
  liveCardScoreBandText: {
    fontFamily: MONO_BOLD,
    fontSize: 8.5,
    letterSpacing: 1.3,
  },

  liveCardTempCol: { flex: 1 },
  liveCardTempRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  liveCardTempNumber: {
    fontFamily: SERIF_MEDIUM,
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -2,
    color: paper.dashboardInk,
  },
  liveCardTempUnit: {
    fontFamily: MONO_BOLD,
    fontSize: 14,
    color: paper.dashboardMuted,
  },
  liveCardTempSubline: {
    fontFamily: SANS_MEDIUM,
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },

  liveCardSparkCol: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  liveCardSparkEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
    marginBottom: 3,
  },
  liveCardSparkTrend: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.4,
    marginTop: 2,
  },
  liveRefreshHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
    marginTop: 9,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(31,58,74,0.08)",
  },
  liveRefreshHintIcon: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79,149,194,0.10)",
    borderWidth: 1,
    borderColor: "rgba(79,149,194,0.18)",
  },
  liveRefreshHintText: {
    flex: 1,
    fontFamily: MONO,
    fontSize: 8.5,
    color: paper.dashboardMuted,
    letterSpacing: 0,
    textAlign: "left",
    opacity: 0.78,
  },

  // bite CTA
  biteCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: paper.dashboardBlueSky,
    borderWidth: 1,
    borderColor: "rgba(79,149,194,0.45)",
    borderRadius: 8,
    marginBottom: 14,
    overflow: "hidden",
    position: "relative",
  },
  biteCtaShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  biteCtaLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  biteCtaIconTile: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  biteCtaEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.8,
    color: "rgba(42,110,150,0.85)",
  },
  biteCtaTitle: {
    fontFamily: SERIF_SEMI,
    fontSize: 17,
    color: "#1A3A52",
    marginTop: 2,
  },
  biteCtaRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  biteCtaArrowTile: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(42,110,150,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  howWorksCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FAFAF7",
    borderWidth: 1,
    borderColor: "rgba(10,27,46,0.10)",
    borderRadius: 8,
    marginBottom: 14,
  },
  howWorksLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  howWorksIconTile: {
    width: 31,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: "rgba(42,110,150,0.10)",
    borderWidth: 1,
    borderColor: "rgba(42,110,150,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  howWorksTextCol: { flex: 1 },
  howWorksEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.6,
    color: paper.dashboardBlue,
    marginBottom: 2,
  },
  howWorksTitle: {
    fontFamily: SANS_SEMI,
    fontSize: 13,
    color: paper.dashboardInk,
  },

  // metric grid
  metricsGrid: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 6,
    overflow: "hidden",
  },
  metricCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: paper.dashboardLine,
  },
  metricCellDivider: { borderRightWidth: 1 },
  metricCellTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  metricCellLabel: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
  },
  metricCellValueRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  metricCellValue: {
    fontFamily: SERIF_SEMI,
    fontSize: 18,
    color: paper.dashboardInk,
    lineHeight: 20,
  },
  metricCellUnit: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    color: paper.dashboardMuted,
  },
  metricCellSub: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.4,
    color: "#333",
    marginTop: 4,
  },

  // ─── Forecast ────────────────────────────────────────────────────────────
  forecast: { marginBottom: 22 },
  forecastHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  forecastEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 2.2,
    color: "#444",
  },
  forecastUnit: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    color: paper.dashboardMuted,
    letterSpacing: 0.5,
  },
  forecastGrid: { flexDirection: "row", gap: FORECAST_GAP },
  forecastDisclaimer: {
    marginTop: 7,
    paddingHorizontal: 2,
    fontFamily: MONO,
    fontSize: 8,
    lineHeight: 10,
    color: paper.dashboardMuted,
    opacity: 0.72,
  },
  forecastTile: {
    width: FORECAST_TILE_W,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
    paddingTop: 0,
  },
  forecastTileLocked: {
    borderColor: "rgba(10,27,46,0.16)",
  },
  forecastTileSkeleton: { height: 76, backgroundColor: "#EEE9DC" },
  forecastTileHeaderSkeleton: {
    height: 22,
    borderBottomWidth: 1,
    borderColor: paper.dashboardHair,
    backgroundColor: "#F4EEDF",
  },
  forecastTileBodySkeleton: { flex: 1, backgroundColor: "#EFE7CE" },
  forecastTileTomorrow: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: MONO_BOLD,
    fontSize: 7,
    letterSpacing: 1.2,
    color: paper.dashboardInk,
  },
  forecastTileHead: {
    paddingVertical: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: paper.dashboardHair,
  },
  forecastTileDay: {
    fontFamily: MONO_BOLD,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
    lineHeight: 10,
  },
  forecastTileDate: {
    fontFamily: SERIF_SEMI,
    fontSize: 13,
    color: paper.dashboardInk,
    marginTop: 2,
    lineHeight: 14,
  },
  forecastTileScoreBlock: {
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  forecastTileLockedScoreBlock: {
    position: "relative",
    overflow: "hidden",
  },
  forecastTileScore: {
    fontFamily: SERIF_BOLD,
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: -0.5,
  },
  forecastTileLockVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  forecastTileLockIcon: {
    opacity: 0.72,
  },
  forecastTileHiLo: {
    paddingVertical: 3,
    paddingHorizontal: 2,
    alignItems: "center",
    backgroundColor: "#FAFAF7",
    borderTopWidth: 1,
    borderColor: paper.dashboardHair,
  },
  forecastTileHiLoText: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 0.1,
    color: paper.dashboardMuted,
    lineHeight: 10,
  },
  forecastTileHiLoSep: {
    fontFamily: MONO,
    color: paper.dashboardMuted,
    opacity: 0.5,
  },
  forecastTileLockedHint: {
    fontFamily: MONO_BOLD,
    fontSize: 7.5,
    letterSpacing: 0.6,
    color: paper.dashboardMuted,
    opacity: 0.72,
    lineHeight: 10,
  },

  forecastLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    paddingHorizontal: 2,
  },
  forecastLegendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  forecastLegendSwatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
  },
  forecastLegendLabel: {
    fontFamily: MONO_BOLD,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: "#444",
  },

  // ─── Modules ─────────────────────────────────────────────────────────────
  modules: { marginBottom: 18 },
  modulesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modulesEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 2.2,
    color: "#444",
  },
  modulesCount: { fontFamily: MONO_BOLD, fontSize: 8, color: "#888" },

  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    position: "relative",
  },
  moduleDots: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    gap: 1.5,
  },
  moduleDot: { width: 3, height: 3, borderRadius: 1.5 },
  moduleCode: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1,
    color: "#AAA",
  },
  moduleIcon: {
    width: 42,
    height: 42,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moduleTextCol: { flex: 1 },
  moduleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  moduleTitle: {
    fontFamily: SERIF_SEMI,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  moduleTag: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.3,
    color: paper.dashboardMuted,
  },
  moduleDesc: {
    fontFamily: SANS_MEDIUM,
    fontSize: 11,
    lineHeight: 14,
    color: "#555",
  },

  // ─── Footer ──────────────────────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 6,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerSync: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
  },
  footerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  signalBars: { flexDirection: "row", alignItems: "flex-end", gap: 1.5 },
  signalBar: { width: 2, borderRadius: 1 },
  footerStamp: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.5,
    color: paper.dashboardMuted,
  },

  // ─── GPS gate (rare fallback) ────────────────────────────────────────────
  gpsGate: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: paper.dashboardInk,
    alignItems: "center",
  },
  gpsGateText: {
    fontFamily: SANS_BOLD,
    fontSize: 13,
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },
});
