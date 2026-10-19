/**
 * PierCast screen: the landing page (live map hero, search, My Piers,
 * What's moving) and, once a city is chosen, its City Report.
 *
 * 1.18 retired the Standings leaderboard. Nothing here ranks cities against
 * each other; the landing loads only the catalog, and each city opens its own
 * report (which still applies the free-report limit server-side).
 */
import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PierCastConditionsCityReport } from "../components/pier-cast/PierCastConditionsUI";
import {
  PierCastConditionsSkeleton,
  PierCastCoverageRequest,
} from "../components/pier-cast/PierCastConditionsSupport";
import { PierCastLanding, PierCastLandingSkeleton } from "../components/pier-cast/PierCastLanding";
import { SubscribePrompt } from "../components/SubscribePrompt";
import { captureAnalytics } from "../lib/analytics";
import {
  fetchPierCastConditionsCatalog,
  fetchPierCastConditionsCityReportForApp,
  fetchSavedPierCastConditionsReport,
  PierCastRequestError,
} from "../lib/pierCast";
import { pierCastReportSpeciesOrBest } from "../lib/pierCastCityReportPresentation";
import type {
  PierCastCityReportReadV4,
  PierCastConditionsCatalogResponseV4,
} from "../lib/pierCastConditionsV4";
import type { PierCastSpeciesId } from "../lib/pierCastContracts";
import {
  PIER_CAST_MAX_SAVED_CITIES,
  readPierCastSavedCities,
  togglePierCastSavedCity,
  writePierCastSavedCities,
} from "../lib/pierCastLanding";
import { PIER_CAST_MAP_REFRESH_INTERVAL_MS } from "../lib/pierCastMap";
import { finderReportSpecies } from "../lib/pierCastStandingsPresentation";
import {
  parsePierCastTargetSpecies,
  readPierCastTargetPreference,
  writePierCastTargetPreference,
} from "../lib/pierCastTargetPreference";
import {
  fetchPierCastHourlyWeather,
  type PierCastHourlyWeatherPoint,
} from "../lib/pierCastWeather";
import { hapticSelection } from "../lib/safeHaptics";
import { paper, paperFonts } from "../lib/theme";
import { useAuthStore } from "../store/authStore";

const FULL_NOTICE = `My Piers holds ${PIER_CAST_MAX_SAVED_CITIES}. Remove one to save another.`;

function isForecastDelayedError(error: unknown): boolean {
  return error instanceof PierCastRequestError &&
    (error.code === "pier_cast_conditions_unavailable" ||
      error.code === "report_unavailable");
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function PierCastReviewScreen() {
  const router = useRouter();
  const routeParams = useLocalSearchParams<{
    cityId?: string | string[];
    from?: string | string[];
    speciesId?: string | string[];
  }>();
  const routeCityId = firstParam(routeParams.cityId);
  const routeSpeciesId = parsePierCastTargetSpecies(firstParam(routeParams.speciesId));
  const returnToMap = firstParam(routeParams.from) === "map";
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const [catalog, setCatalog] = useState<PierCastConditionsCatalogResponseV4 | null>(null);
  const [cityReport, setCityReport] = useState<PierCastCityReportReadV4 | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [showingSavedCopy, setShowingSavedCopy] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(Boolean(routeCityId));
  const [error, setError] = useState<string | null>(null);
  const [forecastDelayed, setForecastDelayed] = useState(false);
  const [weather, setWeather] = useState<PierCastHourlyWeatherPoint[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [savedCityIds, setSavedCityIds] = useState<string[]>([]);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const pageScrollRef = useRef<ScrollView>(null);
  const targetRef = useRef<PierCastSpeciesId | null>(routeSpeciesId);
  const requestedCity = useRef<string | null>(null);
  const cityReportRequest = useRef(0);
  // True while a city the angler tapped is loading; background refreshes wait.
  const openingCity = useRef(false);
  const savedCityIdsRef = useRef<string[]>([]);
  const savedHydrated = useRef(false);
  const routeOpenedCity = useRef<string | null>(null);
  const accountId = useRef(user?.id);
  accountId.current = user?.id;

  useEffect(() => {
    pageScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedCityId]);

  // The last species the angler looked at decides which report species a city
  // opens on. A map deep link can set it.
  useEffect(() => {
    if (routeSpeciesId) {
      targetRef.current = routeSpeciesId;
      void writePierCastTargetPreference(routeSpeciesId);
      return;
    }
    void readPierCastTargetPreference().then((remembered) => {
      if (!targetRef.current) targetRef.current = remembered;
    });
  }, [routeSpeciesId]);

  useEffect(() => {
    let active = true;
    void readPierCastSavedCities().then((stored) => {
      if (!active) return;
      savedHydrated.current = true;
      // Keep anything saved while storage was still loading.
      const merged = [...stored];
      for (const cityId of savedCityIdsRef.current) {
        if (!merged.includes(cityId)) merged.push(cityId);
      }
      const next = merged.slice(0, PIER_CAST_MAX_SAVED_CITIES);
      savedCityIdsRef.current = next;
      setSavedCityIds(next);
      if (next.length !== stored.length) void writePierCastSavedCities(next);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!saveNotice) return;
    const timer = setTimeout(() => setSaveNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [saveNotice]);

  const toggleSaved = useCallback((cityId: string) => {
    const result = togglePierCastSavedCity(savedCityIdsRef.current, cityId);
    if (result.status === "full") {
      setSaveNotice(FULL_NOTICE);
      return;
    }
    setSaveNotice(null);
    savedCityIdsRef.current = result.cityIds;
    setSavedCityIds(result.cityIds);
    if (savedHydrated.current) void writePierCastSavedCities(result.cityIds);
    captureAnalytics("pier_cast_city_saved", {
      city_id: cityId,
      saved: result.status === "saved",
      saved_count: result.cityIds.length,
    });
  }, []);

  const loadCatalog = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
      setForecastDelayed(false);
    }
    const userId = user?.id;
    try {
      const next = await fetchPierCastConditionsCatalog();
      if (accountId.current !== userId) return;
      setCatalog(next);
      setSelectedCityId((current) =>
        next.cities.some((city) => city.cityId === current) ? current : null
      );
    } catch (caught) {
      if (!silent) {
        // A map deep link waiting on the catalog shows this error, not a skeleton.
        setReportLoading(false);
        setForecastDelayed(isForecastDelayedError(caught));
        setError(caught instanceof Error ? caught.message : "PierCast could not be loaded.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    setSelectedCityId(null);
    setCityReport(null);
    setShowingSavedCopy(false);
    setCatalog(null);
    setPaywall(false);
    setError(null);
    setForecastDelayed(false);
    requestedCity.current = null;
    routeOpenedCity.current = null;
    setReportLoading(Boolean(routeCityId));
  }, [routeCityId, user?.id]);

  const loadCityReport = useCallback(async (
    cityId: string,
    speciesId: PierCastSpeciesId,
    silent = false,
  ) => {
    // A background refresh never interrupts a city the angler just tapped.
    if (silent && openingCity.current) return;
    const reportRequestId = ++cityReportRequest.current;
    const userId = user?.id;
    if (!silent) requestedCity.current = cityId;
    const stale = () =>
      cityReportRequest.current !== reportRequestId ||
      accountId.current !== userId ||
      (!silent && requestedCity.current !== cityId);
    const shown = (report: PierCastCityReportReadV4) => {
      const best = pierCastReportSpeciesOrBest(report, speciesId) ?? speciesId;
      return best === report.selectedSpeciesId ? report : { ...report, selectedSpeciesId: best };
    };
    try {
      const envelope = await fetchPierCastConditionsCityReportForApp(cityId, speciesId);
      if (stale()) return;
      if (silent) {
        setCityReport((current) => current?.cityId === cityId ? shown(envelope.report) : current);
      } else {
        setCityReport(shown(envelope.report));
        setSelectedCityId(cityId);
        setError(null);
        setForecastDelayed(false);
      }
      setShowingSavedCopy(false);
    } catch (caught) {
      if (stale() || silent) return;
      if (caught instanceof PierCastRequestError && caught.code === "subscription_required") {
        setPaywall(true);
        return;
      }
      try {
        const saved = await fetchSavedPierCastConditionsReport(speciesId);
        if (stale()) return;
        if (
          saved.status === "available" &&
          saved.envelope.report.cityId === cityId &&
          saved.envelope.report.species.some((species) => species.speciesId === speciesId)
        ) {
          setCityReport(shown(saved.envelope.report));
          setShowingSavedCopy(true);
          setSelectedCityId(cityId);
          setError(null);
          setForecastDelayed(false);
        } else {
          setForecastDelayed(isForecastDelayedError(caught));
          setError(
            saved.status === "archived_legacy"
              ? "Your previous score report is archived. Refresh to create a current conditions report."
              : caught instanceof Error
              ? caught.message
              : "Report could not load.",
          );
        }
      } catch {
        if (!stale()) {
          setForecastDelayed(isForecastDelayedError(caught));
          setError(caught instanceof Error ? caught.message : "Report could not load.");
        }
      }
    }
  }, [user?.id]);

  const openCity = useCallback(async (cityId: string, silent = false) => {
    const city = catalog?.cities.find((candidate) => candidate.cityId === cityId);
    if (!city) return;
    const speciesId = finderReportSpecies(city, targetRef.current);
    if (!speciesId) {
      if (!silent) {
        setForecastDelayed(false);
        setError("This PierCast city has no species report available yet.");
      }
      return;
    }
    if (!silent) {
      openingCity.current = true;
      setReportLoading(true);
      captureAnalytics("pier_cast_city_opened", { city_id: cityId, species_id: speciesId });
    }
    try {
      await loadCityReport(cityId, speciesId, silent);
    } finally {
      if (!silent) {
        openingCity.current = false;
        setReportLoading(false);
      }
    }
  }, [catalog, loadCityReport]);

  useEffect(() => {
    if (!routeCityId || !catalog) return;
    if (routeOpenedCity.current === routeCityId) return;
    routeOpenedCity.current = routeCityId;
    if (!catalog.cities.some((city) => city.cityId === routeCityId)) {
      setReportLoading(false);
      setError("This PierCast city is not available.");
      return;
    }
    void openCity(routeCityId);
  }, [catalog, openCity, routeCityId]);

  useEffect(() => {
    if (!selectedCityId) return;
    const timer = setInterval(
      () => void openCity(selectedCityId, true),
      PIER_CAST_MAP_REFRESH_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [selectedCityId, openCity]);

  useFocusEffect(
    useCallback(() => {
      void loadCatalog();
      const timer = setInterval(() => void loadCatalog(true), PIER_CAST_MAP_REFRESH_INTERVAL_MS);
      return () => clearInterval(timer);
    }, [loadCatalog]),
  );

  const selectedCity = catalog?.cities.find((city) => city.cityId === selectedCityId) ?? null;
  useEffect(() => {
    const location = selectedCity?.waterTemperatureSource?.configuredLocation;
    if (!location) {
      setWeather([]);
      setWeatherLoading(false);
      return;
    }
    const controller = new AbortController();
    let disposed = false;
    const timeout = setTimeout(() => controller.abort(), 12_000);
    setWeather([]);
    setWeatherLoading(true);
    void fetchPierCastHourlyWeather({
      latitude: location.referencePoint.latitude,
      longitude: location.referencePoint.longitude,
      signal: controller.signal,
    })
      .then((result) => {
        if (!disposed) setWeather(result.points);
      })
      .catch((caught) => {
        if (!disposed && !(caught instanceof Error && caught.name === "AbortError")) setWeather([]);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!disposed) setWeatherLoading(false);
      });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [cityReport?.generatedAt, selectedCity]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setRefreshToken((value) => value + 1);
      await loadCatalog(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadCatalog]);

  const openMap = useCallback((cityId?: string) => {
    router.push({
      pathname: "/pier-cast-map",
      params: {
        ...(cityId ? { cityId } : {}),
        ...(targetRef.current ? { speciesId: targetRef.current } : {}),
      },
    });
  }, [router]);

  const leaveReport = () => {
    hapticSelection();
    if (reportLoading && !selectedCityId && !returnToMap) {
      // Back while a tapped city is still loading returns to the landing.
      requestedCity.current = null;
      cityReportRequest.current += 1;
      openingCity.current = false;
      setReportLoading(false);
      return;
    }
    if (selectedCityId && returnToMap) {
      router.back();
      return;
    }
    if (selectedCityId) {
      requestedCity.current = null;
      setError(null);
      setSelectedCityId(null);
      setCityReport(null);
      setShowingSavedCopy(false);
      return;
    }
    if (error && requestedCity.current) {
      requestedCity.current = null;
      setError(null);
      return;
    }
    router.back();
  };

  const showingLanding = Boolean(catalog && !selectedCity) && !loading && !reportLoading && !error;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Stack.Screen options={{ gestureEnabled: !selectedCityId }} />
      <StatusBar style="light" />
      <View style={styles.navHeader}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={leaveReport}
          accessibilityRole="button"
          accessibilityLabel={selectedCityId
            ? returnToMap ? "Back to the Live Lake Map" : "Back to PierCast"
            : "Back"}
        >
          <Ionicons name="chevron-back" size={25} color="#FFFFFF" />
        </Pressable>
        <View style={styles.navTitleWrap} pointerEvents="none">
          <Text style={styles.navEyebrow}>GREAT LAKES · PIER FORECAST</Text>
          <Text style={styles.navTitle}>PIERCAST</Text>
        </View>
        {showingLanding ? (
          <Pressable
            style={({ pressed }) => [styles.mapHeaderButton, pressed && styles.pressed]}
            onPress={() => {
              hapticSelection();
              openMap();
            }}
            accessibilityRole="button"
            accessibilityLabel="Open the Live Lake Map"
          >
            <Ionicons name="map-outline" size={20} color={paper.gold} />
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>
      <ScrollView
        ref={pageScrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={showingLanding
          ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void refresh()}
              tintColor={paper.gold}
              colors={[paper.dashboardBlue]}
            />
          )
          : undefined}
      >
        {catalog?.cities.length === 0 ? (
          <View style={styles.pad}>
            <MessageCard icon="lock-closed-outline" title="PierCast is coming soon" />
          </View>
        ) : reportLoading ? (
          <PierCastConditionsSkeleton />
        ) : loading && !catalog ? (
          <PierCastLandingSkeleton />
        ) : error ? (
          <View style={styles.pad}>
            <MessageCard
              icon={forecastDelayed ? "time-outline" : "alert-circle-outline"}
              title={forecastDelayed ? "Forecast delayed" : "PierCast could not load"}
              body={error}
              actionLabel="TRY AGAIN"
              onAction={() => {
                const city = requestedCity.current;
                setError(null);
                if (city && catalog) void openCity(city);
                else void loadCatalog();
              }}
            />
          </View>
        ) : catalog ? (
          selectedCity ? (
            cityReport ? (
              <PierCastConditionsCityReport
                city={selectedCity}
                cities={catalog.cities}
                report={cityReport}
                weather={weather}
                weatherLoading={weatherLoading}
                savedCopy={showingSavedCopy}
                saved={savedCityIds.includes(selectedCity.cityId)}
                saveNotice={saveNotice}
                onToggleSaved={() => toggleSaved(selectedCity.cityId)}
                onOpenCity={(cityId) => void openCity(cityId)}
                onOpenMap={() => openMap(selectedCity.cityId)}
              />
            ) : (
              <PierCastConditionsSkeleton />
            )
          ) : (
            <PierCastLanding
              catalog={catalog}
              savedCityIds={savedCityIds}
              saveNotice={saveNotice}
              refreshToken={refreshToken}
              onToggleSaved={toggleSaved}
              onOpenCity={(cityId) => void openCity(cityId)}
              onOpenMap={() => openMap()}
              onRevealSearch={(y) => pageScrollRef.current?.scrollTo({ y, animated: true })}
              footer={
                <PierCastCoverageRequest profile={profile} user={user} city={null} cities={catalog.cities} />
              }
            />
          )
        ) : null}
      </ScrollView>
      <SubscribePrompt
        visible={paywall}
        onDismiss={() => setPaywall(false)}
        onUnlocked={() => {
          setPaywall(false);
          if (requestedCity.current) void openCity(requestedCity.current);
        }}
      />
    </SafeAreaView>
  );
}

function MessageCard({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.messageCard} accessibilityRole={body ? "alert" : undefined}>
      <Ionicons name={icon} size={25} color={paper.dashboardBlue} />
      <Text style={styles.messageTitle}>{title}</Text>
      {body ? <Text style={styles.messageCopy}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]} onPress={onAction}>
          <Text style={styles.retryButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  navHeader: { minHeight: 62, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingBottom: 8, backgroundColor: paper.dashboardInk, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.12)" },
  backButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21 },
  pressed: { opacity: 0.72 },
  navTitleWrap: { flex: 1, alignItems: "center" },
  navEyebrow: { color: "rgba(255,255,255,0.58)", fontFamily: paperFonts.metaMonoBold, fontSize: 7.5, letterSpacing: 1.35 },
  navTitle: { marginTop: 1, color: "#FFFFFF", fontFamily: paperFonts.display, fontSize: 24, lineHeight: 27, letterSpacing: 1.1 },
  navSpacer: { width: 42 },
  mapHeaderButton: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.22)" },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: { paddingBottom: 44 },
  pad: { paddingHorizontal: 14, paddingTop: 15 },
  messageCard: { minHeight: 210, alignItems: "center", justifyContent: "center", marginTop: 12, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 24, backgroundColor: paper.dashboardWhite },
  messageTitle: { marginTop: 10, color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 23, textAlign: "center" },
  messageCopy: { marginTop: 7, color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 13, lineHeight: 19, textAlign: "center" },
  retryButton: { marginTop: 18, borderRadius: 7, paddingHorizontal: 18, paddingVertical: 11, backgroundColor: paper.dashboardBlue },
  retryButtonText: { color: "#FFFFFF", fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.1 },
});
