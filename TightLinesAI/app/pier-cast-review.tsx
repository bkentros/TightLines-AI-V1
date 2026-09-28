import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  PierCastConditionsCityReport,
  PierCastConditionsLanding,
} from "../components/pier-cast/PierCastConditionsUI";
import {
  PierCastAccessNotice,
  PierCastConditionsSkeleton,
  PierCastCoverageRequest,
  PierCastNearbyPorts,
  PierCastPiersCovered,
} from "../components/pier-cast/PierCastConditionsSupport";
import { SubscribePrompt } from "../components/SubscribePrompt";
import {
  fetchPierCastConditionsCatalog,
  fetchPierCastConditionsCityReport,
  fetchPierCastConditionsLeaderboard,
  fetchSavedPierCastConditionsReport,
  PierCastRequestError,
} from "../lib/pierCast";
import type {
  PierCastCityReportReadV4,
  PierCastConditionsCatalogResponseV4,
  PierCastLeaderboardResponseV4,
} from "../lib/pierCastConditionsV4";
import type {
  PierCastSpeciesId,
} from "../lib/pierCastContracts";
import { PIER_CAST_MAP_REFRESH_INTERVAL_MS } from "../lib/pierCastMap";
import { hapticSelection } from "../lib/safeHaptics";
import {
  parsePierCastTargetSpecies,
  readPierCastTargetPreference,
  writePierCastTargetPreference,
} from "../lib/pierCastTargetPreference";
import {
  fetchPierCastHourlyWeather,
  type PierCastHourlyWeatherPoint,
} from "../lib/pierCastWeather";
import { paper, paperFonts } from "../lib/theme";
import { useAuthStore } from "../store/authStore";

export default function PierCastReviewScreen() {
  const router = useRouter();
  const routeParams = useLocalSearchParams<{
    cityId?: string | string[];
    from?: string | string[];
    speciesId?: string | string[];
  }>();
  const routeCityId = Array.isArray(routeParams.cityId)
    ? routeParams.cityId[0]
    : routeParams.cityId;
  const routeSpeciesId = parsePierCastTargetSpecies(
    Array.isArray(routeParams.speciesId)
      ? routeParams.speciesId[0]
      : routeParams.speciesId,
  );
  const returnToMap = (Array.isArray(routeParams.from)
    ? routeParams.from[0]
    : routeParams.from) === "map";
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const [catalog, setCatalog] = useState<PierCastConditionsCatalogResponseV4 | null>(null);
  const [leaderboard, setLeaderboard] = useState<PierCastLeaderboardResponseV4 | null>(null);
  const [cityReport, setCityReport] = useState<PierCastCityReportReadV4 | null>(null);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<PierCastSpeciesId | null>(routeSpeciesId);
  const selectedSpeciesRef = useRef<PierCastSpeciesId | null>(routeSpeciesId);
  const [preferenceHydrated, setPreferenceHydrated] = useState(Boolean(routeSpeciesId));
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [showingSavedCopy, setShowingSavedCopy] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routeReportLoading, setRouteReportLoading] = useState(Boolean(routeCityId && routeSpeciesId));
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<PierCastHourlyWeatherPoint[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const pageScrollRef = useRef<ScrollView>(null);
  const requestedCity = useRef<string | null>(null);
  const openingCity = useRef(false);
  const routeOpenedCity = useRef<string | null>(null);
  const accountId = useRef(user?.id);
  const selectionRequest = useRef(0);
  accountId.current = user?.id;

  useEffect(() => {
    pageScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [selectedCityId]);

  useEffect(() => {
    let active = true;
    if (routeSpeciesId) {
      selectedSpeciesRef.current = routeSpeciesId;
      setSelectedSpeciesId(routeSpeciesId);
      setPreferenceHydrated(true);
      void writePierCastTargetPreference(routeSpeciesId);
      return () => { active = false; };
    }
    void readPierCastTargetPreference().then((remembered) => {
      if (!active) return;
      selectedSpeciesRef.current = remembered;
      setSelectedSpeciesId(remembered);
      setPreferenceHydrated(true);
    });
    return () => { active = false; };
  }, [routeSpeciesId]);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    if (!preferenceHydrated) return;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    const userId = user?.id;
    const requestedTarget = selectedSpeciesRef.current;
    const requestId = ++selectionRequest.current;
    try {
      const [nextCatalog, nextLeaderboard] = await Promise.all([
        fetchPierCastConditionsCatalog(),
        fetchPierCastConditionsLeaderboard(requestedTarget ?? undefined),
      ]);
      if (accountId.current !== userId) return;
      setCatalog(nextCatalog);
      if (
        selectionRequest.current === requestId &&
        selectedSpeciesRef.current === requestedTarget
      ) {
        setLeaderboard(nextLeaderboard);
        setSelectionLoading(false);
        setError(null);
      }
      setSelectedCityId((current) =>
        nextCatalog.cities.some((city) => city.cityId === current) ? current : null
      );
    } catch (caught) {
      if (
        !silent && selectionRequest.current === requestId &&
        selectedSpeciesRef.current === requestedTarget
      ) {
        setRouteReportLoading(false);
        setError(
          caught instanceof PierCastRequestError
            ? caught.message
            : caught instanceof Error
              ? caught.message
              : "PierCast could not be loaded.",
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [preferenceHydrated, user?.id]);

  useEffect(() => {
    selectionRequest.current += 1;
    setSelectedCityId(null);
    setCityReport(null);
    setShowingSavedCopy(false);
    setLeaderboard(null);
    setCatalog(null);
    setPaywall(false);
    setError(null);
    requestedCity.current = null;
    routeOpenedCity.current = null;
    setRouteReportLoading(Boolean(routeCityId && selectedSpeciesRef.current));
  }, [routeCityId, user?.id]);

  const openCity = useCallback(async (cityId: string, silent = false) => {
    const target = selectedSpeciesRef.current;
    if (!target) {
      if (!silent) setError("Choose a target species before opening a city report.");
      return;
    }
    if (!catalog?.cities.some((city) => city.cityId === cityId)) return;
    if (
      leaderboard?.selectedSpeciesId !== target ||
      !leaderboard.cities.some((city) => city.cityId === cityId)
    ) {
      if (!silent) {
        setError("This target species is not available for the selected PierCast city.");
      }
      return;
    }
    if (openingCity.current) return;
    const userId = user?.id;
    if (!silent) {
      requestedCity.current = cityId;
      openingCity.current = true;
    }
    try {
      const envelope = await fetchPierCastConditionsCityReport(cityId, target);
      if (
        accountId.current !== userId || selectedSpeciesRef.current !== target ||
        (!silent && requestedCity.current !== cityId)
      ) return;
      if (silent) {
        setCityReport((current) => current?.cityId === cityId ? envelope.report : current);
      } else {
        setCityReport(envelope.report);
        setSelectedCityId(cityId);
        setError(null);
      }
      setShowingSavedCopy(false);
    } catch (caught) {
      if (
        accountId.current !== userId || selectedSpeciesRef.current !== target ||
        (!silent && requestedCity.current !== cityId)
      ) return;
      if (caught instanceof PierCastRequestError && caught.code === "subscription_required") {
        if (!silent) setPaywall(true);
      } else if (!silent) {
        try {
          const saved = await fetchSavedPierCastConditionsReport(target);
          if (
            saved.status === "available" &&
            saved.envelope.report.cityId === cityId &&
            saved.envelope.report.species.some((species) => species.speciesId === target)
          ) {
            setCityReport(saved.envelope.report);
            setShowingSavedCopy(true);
            setSelectedCityId(cityId);
            setError(null);
          } else {
            setError(
              saved.status === "archived_legacy"
                ? "Your previous score report is archived. Refresh to create a current conditions report."
                : caught instanceof Error
                  ? caught.message
                  : "Report could not load.",
            );
          }
        } catch {
          setError(caught instanceof Error ? caught.message : "Report could not load.");
        }
      }
    } finally {
      if (!silent) openingCity.current = false;
    }
  }, [catalog, leaderboard, user?.id]);

  const selectSpecies = useCallback((speciesId: PierCastSpeciesId) => {
    const requestId = ++selectionRequest.current;
    selectedSpeciesRef.current = speciesId;
    setSelectedSpeciesId(speciesId);
    setError(null);
    setLoading(false);
    setSelectionLoading(true);
    void writePierCastTargetPreference(speciesId);
    router.setParams({ speciesId });
    void fetchPierCastConditionsLeaderboard(speciesId)
      .then((next) => {
        if (
          selectionRequest.current === requestId &&
          selectedSpeciesRef.current === speciesId
        ) setLeaderboard(next);
      })
      .catch((caught) => {
        if (selectionRequest.current === requestId) {
          const reportAlreadySupportsTarget = cityReport?.species.some(
            (species) => species.speciesId === speciesId,
          ) === true;
          if (!reportAlreadySupportsTarget) {
            setError(caught instanceof Error ? caught.message : "The standings could not load.");
          }
        }
      })
      .finally(() => {
        if (selectedSpeciesRef.current === speciesId) setSelectionLoading(false);
      });
  }, [cityReport, router]);

  useEffect(() => {
    if (!routeCityId || !catalog || !leaderboard || !selectedSpeciesId) {
      if (routeCityId && preferenceHydrated && !selectedSpeciesId) setRouteReportLoading(false);
      return;
    }
    if (routeOpenedCity.current === routeCityId) return;
    if (!catalog.cities.some((city) => city.cityId === routeCityId)) {
      routeOpenedCity.current = routeCityId;
      setRouteReportLoading(false);
      setError("This PierCast city is not available.");
      return;
    }
    routeOpenedCity.current = routeCityId;
    setRouteReportLoading(true);
    void openCity(routeCityId).finally(() => setRouteReportLoading(false));
  }, [catalog, leaderboard, openCity, preferenceHydrated, routeCityId, selectedSpeciesId]);

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
      void load();
      const timer = setInterval(
        () => void load({ silent: true }),
        PIER_CAST_MAP_REFRESH_INTERVAL_MS,
      );
      return () => clearInterval(timer);
    }, [load]),
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

  const leaveReport = () => {
    hapticSelection();
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
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.navHeader}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={leaveReport}
          accessibilityRole="button"
          accessibilityLabel={selectedCityId
            ? returnToMap ? "Back to PierCast conditions map" : "Back to PierCast leaderboard"
            : returnToMap ? "Back to PierCast conditions map" : "Back"}
        >
          <Ionicons name="chevron-back" size={25} color="#FFFFFF" />
        </Pressable>
        <View style={styles.navTitleWrap} pointerEvents="none">
          <Text style={styles.navEyebrow}>GREAT LAKES · PIER FORECAST</Text>
          <Text style={styles.navTitle}>PIERCAST</Text>
        </View>
        <View style={styles.navSpacer} />
      </View>
      <ScrollView
        ref={pageScrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {catalog?.cities.length === 0 ? (
          <MessageCard icon="lock-closed-outline" title="PierCast is coming soon" />
        ) : loading || routeReportLoading ? (
          <PierCastConditionsSkeleton />
        ) : error ? (
          <MessageCard
            icon="alert-circle-outline"
            title="PierCast could not load"
            body={error}
            actionLabel="TRY AGAIN"
            onAction={() => void load()}
          />
        ) : catalog && leaderboard ? (
          selectedCity ? (
            <>
              {cityReport && selectedSpeciesId ? (
                <>
                  <PierCastConditionsCityReport
                    city={selectedCity}
                    report={cityReport}
                    selectedSpeciesId={selectedSpeciesId}
                    targetOptions={leaderboard.targetSpecies}
                    weather={weather}
                    weatherLoading={weatherLoading}
                    savedCopy={showingSavedCopy}
                    onSelectSpecies={selectSpecies}
                  />
                  <PierCastNearbyPorts
                    selectedCity={selectedCity}
                    cities={catalog.cities.filter((city) =>
                      leaderboard.selectedSpeciesId === selectedSpeciesId &&
                      leaderboard.cities.some((row) => row.cityId === city.cityId)
                    )}
                    onOpenCity={(cityId) => void openCity(cityId)}
                  />
                  <PierCastPiersCovered city={selectedCity} />
                </>
              ) : null}
              <PierCastAccessNotice city={selectedCity} />
              <PierCastCoverageRequest profile={profile} user={user} city={selectedCity} cities={catalog.cities} />
            </>
          ) : (
            <>
              <PierCastConditionsLanding
                catalog={catalog}
                leaderboard={leaderboard}
                selectedSpeciesId={selectedSpeciesId}
                selectionLoading={selectionLoading}
                onSelectSpecies={selectSpecies}
                onOpenCity={(cityId) => {
                  hapticSelection();
                  void openCity(cityId);
                }}
                onOpenMap={() => router.push({
                  pathname: "/pier-cast-map",
                  params: selectedSpeciesId ? { speciesId: selectedSpeciesId } : {},
                })}
              />
              <PierCastCoverageRequest profile={profile} user={user} city={null} cities={catalog.cities} />
            </>
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
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: { paddingHorizontal: 14, paddingTop: 15, paddingBottom: 40 },
  messageCard: { minHeight: 210, alignItems: "center", justifyContent: "center", marginTop: 12, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 24, backgroundColor: paper.dashboardWhite },
  messageTitle: { marginTop: 10, color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 23, textAlign: "center" },
  messageCopy: { marginTop: 7, color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 13, lineHeight: 19, textAlign: "center" },
  retryButton: { marginTop: 18, borderRadius: 7, paddingHorizontal: 18, paddingVertical: 11, backgroundColor: paper.dashboardBlue },
  retryButtonText: { color: "#FFFFFF", fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.1 },
});
