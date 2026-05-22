import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { paper, paperFonts, paperSpacing } from "../lib/theme";
import { getEnvironment } from "../lib/env";
import { getValidAccessToken, invokeEdgeFunction } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import {
  type EngineContextKey,
  getCachedForecastRebuild,
  getCachedMultiRebuild,
  howFishingMultiContexts,
  type HowFishingRebuildBundle,
  type HowFishingRebuildMultiBundle,
  setCachedForecastRebuild,
  setCachedMultiRebuild,
  setCurrentMultiRebuild,
} from "../lib/howFishing";
import {
  getForecastScores,
  mergeMeasuredWaterTempFields,
  stripMeasuredWaterTempFields,
} from "../lib/forecastScores";
import {
  materializeForecastEnvForDate,
  shouldUseMeasuredWaterTempForForecastReport,
} from "../lib/forecastSnapshot";
import { useEnvStore } from "../store/envStore";
import type { EnvironmentData } from "../lib/env/types";
import { oceanCoastalZoneLabel } from "../lib/coastalProximity";
import { RebuildReportView } from "../components/fishing/RebuildReportView";
import { HowFishingLoadingSkeleton } from "../components/fishing/HowFishingLoadingSkeleton";
import { SubscribePrompt } from "../components/SubscribePrompt";
import { TopographicLines } from "../components/paper";
import { getEffectiveTier } from "../lib/subscription";
import { FeedbackCard } from "../components/FeedbackCard";

/* ─── Date/time helpers ─────────────────────────────────────────────────── */

function currentLocationDateString(timezone?: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    })
      .format(new Date())
      .toUpperCase();
  } catch {
    return new Date()
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
  }
}

function formatGeneratedTime(iso: string, timezone?: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

/* ─── Context tabs ──────────────────────────────────────────────────────── */

// Tab labels tuned to fit cleanly when all four are visible (coastal
// cities split the bar 25% each). Two-word "LAKE / POND" was the only
// label that got smooshed against its icon and the active-pill edge —
// dropped the spaces so it reads as one tight token like the others.
const TAB_CONFIG: {
  key: EngineContextKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "freshwater_lake_pond", label: "LAKE/POND", icon: "water" },
  { key: "freshwater_river", label: "RIVER", icon: "git-merge-outline" },
  { key: "coastal", label: "INSHORE", icon: "boat-outline" },
  { key: "coastal_flats_estuary", label: "FLATS", icon: "resize-outline" },
];

const TAB_ERROR_LABEL: Record<EngineContextKey, string> = {
  freshwater_lake_pond: "lake or pond",
  freshwater_river: "river",
  coastal: "inshore",
  coastal_flats_estuary: "flats or estuary",
};

function friendlyHowFishingError(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("engine_context") ||
    lower.includes("invalid response") ||
    lower.includes("hows_fishing_rebuild")
  ) {
    return "We could not build a clean fishing read for this spot. Try again from Home.";
  }
  if (lower.includes("subscribe")) {
    return "A subscription is needed to use this feature.";
  }
  if (lower.includes("coastal reports")) {
    return "Coastal reads are only available where coastal conditions are supported.";
  }
  if (lower.includes("env_data") || lower.includes("live conditions")) {
    return "We could not load today's conditions for this spot.";
  }
  return message;
}

/* ─── Location helpers ──────────────────────────────────────────────────── */

function geocodeToDisplayLabel(
  g: Location.LocationGeocodedAddress,
): string | null {
  const city = g.city ?? g.subregion ?? g.district ?? g.name ?? undefined;
  const region = g.region ?? "";
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
  if (currentLabel !== "Current location") {
    return currentLabel;
  }
  try {
    const geo = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });
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

function todayDateFromForecastSnapshot(
  forecastSnapshot: Awaited<ReturnType<typeof getForecastScores>> | null,
): string | null {
  return forecastSnapshot?.forecast.find((day) => day.day_offset === 0)?.date ??
    null;
}

function dayLabelFromDateStr(dateStr: string): string {
  try {
    return new Date(dateStr + "T12:00:00")
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
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
  const dayOffset = params.day_offset != null
    ? parseInt(params.day_offset, 10)
    : 0;
  const targetDate = params.target_date ?? null;
  const isForecastDay = targetDate != null;
  const requestedLocationLabel = typeof params.location_label === "string" &&
      params.location_label.trim().length > 0
    ? params.location_label.trim()
    : null;

  const { profile, user } = useAuthStore();
  const reportCacheOwnerKey = user?.id ?? user?.email ?? null;
  const effectiveTier = getEffectiveTier(
    profile,
    user?.email,
  );
  const isFreeTier = effectiveTier === "free";
  const isLimitedFreeRead = isFreeTier && !isForecastDay;
  const units = profile?.preferred_units ?? "imperial";
  const setLastReportEnv = useEnvStore((s) => s.setLastReportEnv);

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);

  const [locationLabel, setLocationLabel] = useState<string>(
    "Current location",
  );
  const [forecastSnapshotCoastalEligible, setForecastSnapshotCoastalEligible] =
    useState<boolean | null>(null);

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
  const [multiBundles, setMultiBundles] = useState<
    Record<EngineContextKey, HowFishingRebuildBundle> | null
  >(null);
  const [activeTab, setActiveTab] = useState<EngineContextKey>(
    "freshwater_lake_pond",
  );
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);

  // Horizontal pager ref + width for swipe-between-contexts. The pager only
  // renders when there are ≥2 available tabs; otherwise we keep the simpler
  // single-vertical-scroll path.
  const pagerRef = useRef<ScrollView>(null);
  const { width: windowWidth } = useWindowDimensions();

  // Keep the active tab valid when availableContexts shrinks (e.g. coastal drop).
  useEffect(() => {
    setActiveTab((prev) =>
      availableContexts.includes(prev)
        ? prev
        : (availableContexts[0] ?? "freshwater_lake_pond")
    );
  }, [availableContexts]);

  // Before paint: if the visible tab has no report (partial cache, race), jump to the first tab that does.
  useLayoutEffect(() => {
    if (!multiBundles) return;
    if (multiBundles[activeTab]) return;
    const next = firstContextWithReport(multiBundles, availableContexts);
    if (next) setActiveTab(next);
  }, [multiBundles, activeTab, availableContexts]);

  // Keep the horizontal pager's scroll position synced with `activeTab` when
  // it changes from a tab tap (or from a programmatic jump above). If the
  // change came from a swipe, the pager is already at the right x so this is
  // a no-op.
  const activeTabIndex = availableTabs.findIndex((t) => t.key === activeTab);
  useEffect(() => {
    if (availableTabs.length < 2) return;
    if (activeTabIndex < 0) return;
    pagerRef.current?.scrollTo({
      x: activeTabIndex * windowWidth,
      y: 0,
      animated: true,
    });
  }, [activeTabIndex, availableTabs.length, windowWidth]);

  const handlePagerMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (availableTabs.length < 2 || windowWidth <= 0) return;
      const idx = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
      const next = availableTabs[idx]?.key;
      if (next && next !== activeTab) setActiveTab(next);
    },
    [availableTabs, windowWidth, activeTab],
  );

  const shouldLimitReportSurface = useCallback(
    (bundle: HowFishingRebuildBundle | null | undefined): boolean =>
      isLimitedFreeRead || bundle?.access_tier === "free_limited",
    [isLimitedFreeRead],
  );

  const accessLabelForBundle = useCallback(
    (bundle: HowFishingRebuildBundle | null | undefined): string =>
      shouldLimitReportSurface(bundle)
        ? "free_limited"
        : bundle?.access_tier ?? "angler",
    [shouldLimitReportSurface],
  );

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
          getForecastScores(
            lat,
            lon,
            isFreeTier
              ? { maxDayOffset: 0, includeSnapshotEnv: false }
              : undefined,
          ).catch(() => null),
          requestedLocationLabel
            ? Promise.resolve([])
            : Location.reverseGeocodeAsync({ latitude: lat, longitude: lon })
              .catch(() => []),
        ]);
        if (cancelled) return;
        setEnv(cachedEnv as EnvironmentData);
        setForecastSnapshotCoastalEligible(
          Boolean(
            (forecastSnapshot as
              | Awaited<ReturnType<typeof getForecastScores>>
              | null)?.snapshot_env?.coastal,
          ),
        );
        if (requestedLocationLabel) {
          setLocationLabel(requestedLocationLabel);
        } else if (geo?.[0]) {
          const fromGeo = geocodeToDisplayLabel(geo[0]);
          setLocationLabel(
            fromGeo ??
              (((cachedEnv as EnvironmentData).coastal)
                ? oceanCoastalZoneLabel(lat, lon)
                : null) ??
              "Current location",
          );
        } else {
          setLocationLabel(
            (((cachedEnv as EnvironmentData).coastal)
              ? oceanCoastalZoneLabel(lat, lon)
              : null) ??
              "Current location",
          );
        }
      } catch {
        if (!cancelled) {
          setAnalysisError("We could not load today's conditions.");
        }
      } finally {
        if (!cancelled) setEnvLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasCoords, lat, lon, units, requestedLocationLabel, isFreeTier]);

  // Check cache on mount, show confirm if not cached.
  // Forecast day reports use a separate per-(lat,lon,target_date,ctx) cache that
  // expires at the fishing location's next local midnight — so same-day re-opens
  // are instant cache hits, but the next local calendar day fetches a fresh
  // midnight forecast snapshot.
  useEffect(() => {
    if (!hasCoords || envLoading) return;
    let cancelled = false;
    (async () => {
      if (isFreeTier && isForecastDay) {
        setMultiBundles(null);
        setShowConfirm(false);
        setShowSubscribePrompt(true);
        return;
      }
      if (isForecastDay && targetDate) {
        const cached = await getCachedForecastRebuild(
          lat,
          lon,
          targetDate,
          availableContexts,
          reportCacheOwnerKey,
        );
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
      const cached = await getCachedMultiRebuild(
        lat,
        lon,
        availableContexts,
        reportCacheOwnerKey,
        { allowLimited: isLimitedFreeRead },
      );
      if (cancelled) return;
      if (cached) {
        const tab = firstContextWithReport(cached, availableContexts);
        if (tab) setActiveTab(tab);
        setMultiBundles(cached);
        setCurrentMultiRebuild(lat, lon, cached, reportCacheOwnerKey);
      } else {
        setShowConfirm(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    hasCoords,
    envLoading,
    lat,
    lon,
    availableContexts,
    isForecastDay,
    targetDate,
    isFreeTier,
    isLimitedFreeRead,
    reportCacheOwnerKey,
  ]);

  const generateReports = useCallback(async () => {
    if (!hasCoords) return;
    if (isFreeTier && isForecastDay) {
      setShowConfirm(false);
      setShowSubscribePrompt(true);
      return;
    }
    setAnalysisLoading(true);
    setAnalysisError(null);
    setShowConfirm(false);
    try {
      const accessToken = await getValidAccessToken();
      const forecastSnapshot = await getForecastScores(
        lat,
        lon,
        isLimitedFreeRead
          ? { maxDayOffset: 0, includeSnapshotEnv: true }
          : undefined,
      );
      const sharedForecastEnv = forecastSnapshot?.snapshot_env ?? null;
      const todaySnapshotDate = todayDateFromForecastSnapshot(forecastSnapshot);
      const snapshotDateForReport = isForecastDay
        ? targetDate
        : todaySnapshotDate;
      const shouldUseMeasuredWaterTemp =
        shouldUseMeasuredWaterTempForForecastReport({
          isForecastDay,
          snapshotDateForReport,
          todaySnapshotDate,
        });
      const forecastEnvForReport = materializeForecastEnvForDate(
        sharedForecastEnv,
        snapshotDateForReport,
        { allowMeasuredWaterTemp: shouldUseMeasuredWaterTemp },
      );
      let envForReport: Record<string, unknown> | EnvironmentData;
      if (forecastEnvForReport) {
        if (shouldUseMeasuredWaterTemp) {
          const envMeasuredWaterSource = env ??
            (await getEnvironment({ latitude: lat, longitude: lon, units }));
          envForReport = mergeMeasuredWaterTempFields(
            forecastEnvForReport,
            envMeasuredWaterSource,
          );
        } else {
          envForReport = forecastEnvForReport;
        }
      } else {
        const envFallback = env ??
          (await getEnvironment({ latitude: lat, longitude: lon, units }));
        envForReport = shouldUseMeasuredWaterTemp
          ? envFallback
          : stripMeasuredWaterTempFields(
            envFallback as unknown as Record<string, unknown>,
          );
      }

      const polishLocationName = await resolveLocationLabelForPolish(
        lat,
        lon,
        locationLabel,
        Boolean((forecastEnvForReport ?? env)?.coastal),
      );
      if (polishLocationName && locationLabel === "Current location") {
        setLocationLabel(polishLocationName);
      }

      const result = await invokeEdgeFunction<
        HowFishingRebuildMultiBundle | { error: string; message?: string }
      >("how-fishing", {
        accessToken,
        body: {
          latitude: lat,
          longitude: lon,
          units,
          mode: "multi",
          contexts: availableContexts,
          env_data: envForReport,
          use_forecast_snapshot: Boolean(forecastEnvForReport),
          location_name: polishLocationName,
          ...(isForecastDay &&
            { day_offset: dayOffset, target_date: targetDate }),
        },
      });

      if (result && typeof result === "object" && "error" in result) {
        throw new Error(
          (result as { message?: string }).message ??
            (result as { error: string }).error,
        );
      }

      const multi = result as HowFishingRebuildMultiBundle;
      if (
        !multi || multi.feature !== "hows_fishing_rebuild_v1" || !multi.reports
      ) {
        throw new Error(
          "We could not build a clean fishing read for this spot. Try again from Home.",
        );
      }

      const bundles = multi.reports as Record<
        EngineContextKey,
        HowFishingRebuildBundle
      >;
      const tabWithReport = firstContextWithReport(bundles, availableContexts);
      if (!tabWithReport) {
        const failed = multi.failed_contexts
          ?.map((ctx) => TAB_ERROR_LABEL[ctx as EngineContextKey] ?? null)
          .filter(Boolean)
          .join(", ") ?? "";
        throw new Error(
          failed
            ? `Could not build a read for ${failed}. Try again from Home.`
            : "No fishing read came back for this spot. Try again from Home.",
        );
      }
      if (isForecastDay && targetDate) {
        await setCachedForecastRebuild(
          lat,
          lon,
          targetDate,
          multi,
          reportCacheOwnerKey,
        );
      } else {
        await setCachedMultiRebuild(lat, lon, multi, reportCacheOwnerKey);
      }
      if (!isForecastDay) {
        setCurrentMultiRebuild(lat, lon, bundles, reportCacheOwnerKey);
      }
      setLastReportEnv((envForReport as EnvironmentData) ?? env);
      setActiveTab(tabWithReport);
      setMultiBundles(bundles);
    } catch (err) {
      const rawMsg = err instanceof Error
        ? err.message
        : "Something went wrong.";
      const msg = friendlyHowFishingError(rawMsg);
      setAnalysisError(msg);
      Alert.alert("Could not build your fishing read", msg);
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
    isLimitedFreeRead,
    isFreeTier,
    dayOffset,
    targetDate,
    env,
    reportCacheOwnerKey,
  ]);

  // Pull-to-refresh / header Refresh: reload cached report if still valid; regenerate only on miss/expiry.
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (isFreeTier && isForecastDay) {
        setShowSubscribePrompt(true);
        return;
      }
      let cached: Record<EngineContextKey, HowFishingRebuildBundle> | null =
        null;
      if (isForecastDay && targetDate) {
        cached = await getCachedForecastRebuild(
          lat,
          lon,
          targetDate,
          availableContexts,
          reportCacheOwnerKey,
        );
      } else {
        cached = await getCachedMultiRebuild(
          lat,
          lon,
          availableContexts,
          reportCacheOwnerKey,
          { allowLimited: isLimitedFreeRead },
        );
      }

      if (cached) {
        const tab = firstContextWithReport(cached, availableContexts);
        if (tab) setActiveTab(tab);
        setMultiBundles(cached);
        if (!isForecastDay) {
          setCurrentMultiRebuild(lat, lon, cached, reportCacheOwnerKey);
        }
        try {
          const refreshed = await getEnvironment({
            latitude: lat,
            longitude: lon,
            units,
          });
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
  }, [
    generateReports,
    availableContexts,
    lat,
    lon,
    units,
    isForecastDay,
    isLimitedFreeRead,
    isFreeTier,
    targetDate,
    reportCacheOwnerKey,
  ]);

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
      <View style={styles.root}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeNav} edges={["top"]}>
          <TopLevelHeader
            dateLabel={heroDateLabel}
            locationLabel={locationLabel}
            onBack={() => router.back()}
          />
        </SafeAreaView>
        <View style={styles.background}>
          <View style={styles.centered}>
            <View style={styles.noLocationIcon}>
              <Ionicons
                name="location-outline"
                size={28}
                color={paper.dashboardInk}
              />
            </View>
            <Text style={styles.messageTitle}>ADD A LOCATION</Text>
            <Text style={styles.messageSub}>
              Add your spot so we can read today's conditions for the water near
              you.
            </Text>
            <Pressable
              style={(
                { pressed },
              ) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryBtnText}>GO BACK</Text>
            </Pressable>
          </View>
        </View>
        <SubscribePrompt
          visible={showSubscribePrompt}
          onDismiss={() => setShowSubscribePrompt(false)}
          onUnlocked={() => setShowSubscribePrompt(false)}
        />
      </View>
    );
  }

  /* ── Confirmation / Generate surface ─────────────────────────────── */
  if (!multiBundles) {
    // While conditions load, render the final layout shell so the result lands in the exact
    // same layout the user is already looking at.
    if (analysisLoading) {
      return (
        <View style={styles.root}>
          <StatusBar style="light" />
          <SafeAreaView style={styles.safeNav} edges={["top"]}>
            <TopLevelHeader
              dateLabel={heroDateLabel}
              locationLabel={locationLabel}
              onBack={() => router.back()}
            />
          </SafeAreaView>
          <View style={styles.background}>
            <View style={styles.loadingWrap}>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.reportContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              >
                <HowFishingLoadingSkeleton />
              </ScrollView>
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator size="small" color={paper.dashboardBlue} />
                <Text style={styles.loadingCaption}>
                  READING CONDITIONS
                  {availableContexts.length > 1
                    ? ` · ${availableContexts.length} WATER TYPES`
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeNav} edges={["top"]}>
          <TopLevelHeader
            dateLabel={heroDateLabel}
            locationLabel={locationLabel}
            onBack={() => router.back()}
          />
        </SafeAreaView>

        <View style={styles.background}>
          {/* Topographic backdrop behind the card */}
          <TopographicLines
            style={styles.confirmBgLines}
            color={paper.dashboardInk}
            count={6}
          />

          <View style={styles.confirmOuter}>
            {showConfirm
              ? (
                <View style={styles.confirmCard}>
                  {/* Corner crosshairs inside the card */}
                  <ConfirmCorner position="topLeft" />
                  <ConfirmCorner position="topRight" />
                  <ConfirmCorner position="bottomLeft" />
                  <ConfirmCorner position="bottomRight" />

                  {/* Rubric strip */}
                  <View style={styles.confirmRubricRow}>
                    <View style={styles.confirmRubricRule} />
                    <Text style={styles.confirmRubric}>
                      {isForecastDay
                        ? "FORECAST BRIEFING"
                        : "FIELD BRIEFING"}
                    </Text>
                    <View style={styles.confirmRubricRule} />
                  </View>

                  {/* Mission icon — sonar beacon */}
                  <View style={styles.confirmIconStage}>
                    <View style={styles.confirmIconRingOuter} />
                    <View style={styles.confirmIconRingInner} />
                    <View style={styles.confirmIconDisk}>
                      <Ionicons
                        name={isForecastDay
                          ? "calendar-outline"
                          : "pulse"}
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.confirmTitle}>
                    {isForecastDay
                      ? (
                        <>
                          Build{" "}
                          <Text style={styles.confirmTitleItalic}>
                            forecast
                          </Text>
                          <Text style={styles.confirmTitleDot}>.</Text>
                        </>
                      )
                      : (
                        <>
                          Build{" "}
                          <Text style={styles.confirmTitleItalic}>
                            today's bite
                          </Text>
                          <Text style={styles.confirmTitleDot}>.</Text>
                        </>
                      )}
                  </Text>

                  {/* Divider hairline */}
                  <View style={styles.confirmHairline} />

                  {/* Mission brief — location + date */}
                  <View style={styles.confirmBriefPanel}>
                    <View style={styles.confirmBriefRow}>
                      <View style={styles.confirmBriefIconTile}>
                        <Ionicons
                          name="location"
                          size={11}
                          color={paper.dashboardBlue}
                        />
                      </View>
                      <Text
                        style={styles.confirmBriefText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {locationLabel}
                      </Text>
                    </View>
                    <View style={styles.confirmBriefRow}>
                      <View style={styles.confirmBriefIconTile}>
                        <Ionicons
                          name="calendar-outline"
                          size={11}
                          color={paper.dashboardBlue}
                        />
                      </View>
                      <Text style={styles.confirmBriefText}>
                        {reportDateLabel}
                      </Text>
                    </View>
                  </View>

                  {/* Water types being built */}
                  <View style={styles.confirmContextBlock}>
                    <Text style={styles.confirmContextHeading}>
                      WATER TYPES INCLUDED
                    </Text>
                    <View style={styles.confirmContextList}>
                      {availableTabs.map((t) => (
                        <View key={t.key} style={styles.confirmContextChip}>
                          <Ionicons
                            name={t.icon}
                            size={11}
                            color={paper.dashboardBlue}
                          />
                          <Text style={styles.confirmContextLabel}>
                            {t.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Generate CTA */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.generateBtn,
                      pressed && styles.generateBtnPressed,
                      envLoading && { opacity: 0.6 },
                    ]}
                    onPress={generateReports}
                    disabled={envLoading}
                  >
                    <View style={styles.generateBtnInner}>
                      {envLoading
                        ? (
                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                          />
                        )
                        : (
                          <Ionicons
                            name="sparkles"
                            size={15}
                            color="#FFFFFF"
                          />
                        )}
                      <Text style={styles.generateBtnText}>
                        {envLoading
                          ? "LOADING CONDITIONS…"
                          : isForecastDay
                          ? "BUILD FORECAST READ"
                          : "BUILD TODAY'S READ"}
                      </Text>
                      {!envLoading && (
                        <View style={styles.generateBtnArrow}>
                          <Ionicons
                            name="arrow-forward"
                            size={12}
                            color={paper.dashboardCream}
                          />
                        </View>
                      )}
                    </View>
                  </Pressable>

                  {analysisError
                    ? (
                      <Text style={styles.errorInline}>
                        {analysisError}
                      </Text>
                    )
                    : null}
                </View>
              )
              : null}
          </View>
        </View>
        <SubscribePrompt
          visible={showSubscribePrompt}
          onDismiss={() => setShowSubscribePrompt(false)}
          onUnlocked={() => setShowSubscribePrompt(false)}
        />
      </View>
    );
  }

  /* ── Report view ─────────────────────────────────────────────────── */

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeNav} edges={["top"]}>
        <TopLevelHeader
          dateLabel={heroDateLabel}
          locationLabel={locationLabel}
          generatedAt={activeBundle
            ? formatGeneratedTime(activeBundle.generated_at, activeTz)
            : undefined}
          onBack={() => router.back()}
        />
      </SafeAreaView>

      <View style={styles.background}>
        {
          /* Context switcher — paper-styled tabs that span the full width
            equally so the user can clearly see which context is active. The
            bar is rendered only when there are at least 2 tabs. Preserves
            multi-context behavior (disabled state for tabs without a report). */
        }
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
                    size={11}
                    color={isActive ? "#FFFFFF" : paper.dashboardInk}
                  />
                  <Text
                    style={[
                      styles.contextTabLabel,
                      isActive && styles.contextTabLabelActive,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {availableTabs.length > 1
          ? (
            <ScrollView
              ref={pagerRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handlePagerMomentumEnd}
              scrollEventThrottle={16}
              style={styles.pager}
              // Disable bounce on iOS so the first/last page doesn't rubber-band
              // past the edge — keeps the page boundaries crisp.
              bounces={false}
              // iOS-only: lock the gesture to one axis so vertical scrolls inside
              // a page don't accidentally drag the pager sideways.
              directionalLockEnabled
              // Ensure we start anchored on the active tab's page.
              contentOffset={{
                x: Math.max(0, activeTabIndex) * windowWidth,
                y: 0,
              }}
            >
              {availableTabs.map((t) => {
                const bundle = multiBundles?.[t.key] ?? null;
                return (
                  <View key={t.key} style={{ width: windowWidth }}>
                    <ScrollView
                      style={styles.scroll}
                      contentContainerStyle={styles.reportContent}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={handleRefresh}
                          tintColor={paper.dashboardInk}
                        />
                      }
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled
                    >
                      {bundle
                        ? (
                          <>
                            <RebuildReportView
                              report={bundle.report}
                              solunarData={env?.solunar}
                              dateLabel={heroDateLabel}
                              isLimited={shouldLimitReportSurface(bundle)}
                              onAnglerUnlocked={() => {
                                void generateReports();
                              }}
                            />
                            <FeedbackCard
                              featureName="Today's Bite"
                              topic="todays_bite"
                              compact
                              profile={profile}
                              user={user}
                              contextLines={[
                                `Location: ${locationLabel}`,
                                `Date: ${heroDateLabel}`,
                                `Water type: ${t.label}`,
                                `Access: ${accessLabelForBundle(bundle)}`,
                              ]}
                            />
                          </>
                        )
                        : (
                          <View style={styles.noReportCard}>
                            <Text style={styles.noReportText}>
                              No read available for this water type.
                            </Text>
                          </View>
                        )}
                    </ScrollView>
                  </View>
                );
              })}
            </ScrollView>
          )
          : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.reportContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={paper.dashboardInk}
                />
              }
              showsVerticalScrollIndicator={false}
            >
              {activeBundle
                ? (
                  <>
                    <RebuildReportView
                      report={activeBundle.report}
                      solunarData={env?.solunar}
                      dateLabel={heroDateLabel}
                      isLimited={shouldLimitReportSurface(activeBundle)}
                      onAnglerUnlocked={() => {
                        void generateReports();
                      }}
                    />
                    <FeedbackCard
                      featureName="Today's Bite"
                      topic="todays_bite"
                      compact
                      profile={profile}
                      user={user}
                      contextLines={[
                        `Location: ${locationLabel}`,
                        `Date: ${heroDateLabel}`,
                        `Water type: ${
                          availableTabs[0]?.label ?? "single context"
                        }`,
                        `Access: ${accessLabelForBundle(activeBundle)}`,
                      ]}
                    />
                  </>
                )
                : (
                  <View style={styles.noReportCard}>
                    <Text style={styles.noReportText}>
                      No read available for this water type.
                    </Text>
                  </View>
                )}
            </ScrollView>
          )}
      </View>
      <SubscribePrompt
        visible={showSubscribePrompt}
        onDismiss={() => setShowSubscribePrompt(false)}
        onUnlocked={() => setShowSubscribePrompt(false)}
      />
    </View>
  );
}

/* ─── Confirm card corner brackets ─────────────────────────────────────── */

function ConfirmCorner({
  position,
}: {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
}) {
  const isTop = position === "topLeft" || position === "topRight";
  const isLeft = position === "topLeft" || position === "bottomLeft";
  return (
    <View
      pointerEvents="none"
      style={[
        confirmCornerStyles.wrap,
        isTop ? { top: 8 } : { bottom: 8 },
        isLeft ? { left: 8 } : { right: 8 },
      ]}
    >
      <View
        style={[
          confirmCornerStyles.armH,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      <View
        style={[
          confirmCornerStyles.armV,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
    </View>
  );
}

const confirmCornerStyles = StyleSheet.create({
  wrap: {
    position: "absolute",
    width: 14,
    height: 14,
  },
  armH: {
    position: "absolute",
    width: 14,
    height: 1,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  armV: {
    position: "absolute",
    width: 1,
    height: 14,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.4,
  },
});

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
        style={(
          { pressed },
        ) => [headerStyles.backBtn, pressed && headerStyles.backBtnPressed]}
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
      </Pressable>

      <View style={headerStyles.brand}>
        <Image
          source={require("../assets/images/finfindr-logo.png")}
          style={headerStyles.logo}
          resizeMode="contain"
        />
        <View style={headerStyles.titleWrap} pointerEvents="none">
          <View style={headerStyles.titleRow}>
            <Text style={headerStyles.titleText} numberOfLines={1}>
              Today&apos;s Bite
            </Text>
            <Text style={headerStyles.titlePeriod}>.</Text>
          </View>
          <Text style={headerStyles.titleEyebrow}>CONDITION READ</Text>
        </View>
      </View>

      <View style={headerStyles.metaPill}>
        <View style={headerStyles.metaDot} />
        <Text style={headerStyles.metaPillText} numberOfLines={1}>
          {generatedAt ? generatedAt : locationLabel}
        </Text>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  root: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: paper.dashboardInk,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnPressed: { opacity: 0.7 },
  brand: {
    position: "absolute",
    left: 58,
    right: 130,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 34,
    height: 38,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  titleEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: "rgba(255,255,255,0.62)",
    letterSpacing: 1.6,
    marginTop: -1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    minWidth: 0,
  },
  titleText: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    color: "#FFFFFF",
    letterSpacing: 0,
    lineHeight: 26,
    fontWeight: "800",
  },
  titlePeriod: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    color: paper.dashboardBlueLight,
    marginLeft: 1,
    lineHeight: 26,
    fontWeight: "800",
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 124,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandPrime,
  },
  metaPillText: {
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});

/* ─── Styles ────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safeNav: { backgroundColor: paper.dashboardInk },
  background: { flex: 1, backgroundColor: paper.dashboardCream },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  pager: { flex: 1 },
  reportContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
    paddingTop: paperSpacing.md,
  },

  /* Context switcher — full-width tab bar. Each tab is `flex: 1` so two tabs
     split 50/50 and four tabs split 25/25/25/25. Active tab fills with ink
     and inverts its label color; inactive tabs are subdued so the selection
     is visually obvious. */
  contextTabBar: {
    flexDirection: "row",
    marginHorizontal: paperSpacing.lg,
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.md,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    overflow: "hidden",
  },
  contextTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Tightened from 6→4 px gap + 4→3 px horizontal padding so 4-tab
    // mode (coastal cities) gives each label room to breathe inside
    // its 25 % width slice — the prior values left "LAKE/POND"
    // smooshed against its icon and the active-pill edge.
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 3,
    borderRightWidth: 1,
    borderRightColor: paper.dashboardHair,
  },
  contextTabActive: {
    backgroundColor: paper.dashboardInk,
    borderRightColor: paper.dashboardInk,
  },
  contextTabLabel: {
    fontFamily: paperFonts.bodyBold,
    // 10.5 → 9.5 and letterSpacing 1.5 → 1.1: enough to comfortably fit
    // every label at four-tab width while keeping the all-caps tracked
    // editorial voice consistent with the rest of the app.
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: paper.dashboardInk,
    fontWeight: "700",
  },
  contextTabLabelActive: {
    color: "#FFFFFF",
  },

  /* Confirmation surface */
  confirmBgLines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  confirmOuter: {
    flex: 1,
    padding: paperSpacing.lg,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  confirmCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md + 4,
    paddingBottom: paperSpacing.lg,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    position: "relative",
  },

  // Rubric strip
  confirmRubricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
    marginBottom: paperSpacing.sm,
    zIndex: 1,
  },
  confirmRubricRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.3,
  },
  confirmRubric: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.65,
  },

  // Mission icon stage — beacon sonar rings + center disk
  confirmIconStage: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: paperSpacing.sm,
    zIndex: 1,
  },
  confirmIconRingOuter: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.2,
  },
  confirmIconRingInner: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.35,
  },
  confirmIconDisk: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: paper.dashboardInk,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: paper.dashboardWhite,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  // Title
  confirmTitle: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.3,
    fontWeight: "700",
    color: paper.dashboardInk,
    textAlign: "center",
    marginBottom: paperSpacing.md,
    zIndex: 1,
  },
  confirmTitleItalic: {
    fontFamily: paperFonts.displayItalic,
    color: paper.dashboardInk,
  },
  confirmTitleDot: {
    color: paper.dashboardBlue,
  },

  // Hairline divider
  confirmHairline: {
    alignSelf: "stretch",
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.15,
    marginBottom: paperSpacing.sm,
    zIndex: 1,
  },

  // Mission brief panel
  confirmBriefPanel: {
    alignSelf: "stretch",
    backgroundColor: paper.dashboardCream,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
    marginBottom: paperSpacing.md,
    zIndex: 1,
  },
  confirmBriefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmBriefIconTile: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: paper.dashboardBlueSky,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(42,110,150,0.2)",
  },
  confirmBriefText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 12,
    color: paper.dashboardInk,
    flex: 1,
  },

  // Water type chips
  confirmContextBlock: {
    alignSelf: "stretch",
    marginBottom: paperSpacing.md,
    zIndex: 1,
  },
  confirmContextHeading: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.55,
    marginBottom: 8,
    textAlign: "center",
  },
  confirmContextList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  confirmContextChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: paper.dashboardBlueSky,
    borderRadius: 999,
    backgroundColor: "#EDF5FA",
  },
  confirmContextLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    letterSpacing: 1.4,
    color: paper.dashboardBlue,
    fontWeight: "700",
  },
  loadingWrap: {
    flex: 1,
    position: "relative",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: paperSpacing.xl + paperSpacing.md,
    gap: paperSpacing.sm,
  },
  loadingCaption: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardInk,
    opacity: 0.75,
    textAlign: "center",
    fontWeight: "700",
  },
  generateBtn: {
    overflow: "hidden",
    backgroundColor: paper.dashboardInk,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    minHeight: 50,
    paddingHorizontal: paperSpacing.lg,
    width: "100%",
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 1,
  },
  generateBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 50,
  },
  generateBtnArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  generateBtnPressed: {
    opacity: 0.82,
  },
  generateBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* No-coords centered */
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: paperSpacing.xl,
    gap: paperSpacing.md,
  },
  noLocationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: paperSpacing.sm,
  },
  messageTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    letterSpacing: 0,
    fontWeight: "700",
    color: paper.dashboardInk,
    textAlign: "center",
  },
  messageSub: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
    fontSize: 14,
    color: paper.dashboardMuted,
    opacity: 0.75,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: paperSpacing.md,
  },
  primaryBtn: {
    backgroundColor: paper.dashboardInk,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: paperSpacing.xl,
    marginTop: paperSpacing.sm,
  },
  primaryBtnPressed: { opacity: 0.82 },
  primaryBtnText: {
    color: "#FFFFFF",
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
  },

  errorInline: {
    fontFamily: paperFonts.body,
    color: paper.bandTough,
    textAlign: "center",
    marginTop: paperSpacing.sm,
    fontSize: 13,
  },

  noReportCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: paperSpacing.lg,
    alignItems: "center",
  },
  noReportText: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: "italic",
    fontSize: 14,
    color: paper.dashboardMuted,
    opacity: 0.75,
    textAlign: "center",
  },
});
