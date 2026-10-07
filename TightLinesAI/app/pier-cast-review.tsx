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
  PierCastStandings,
  PierCastStandingsSkeleton,
} from "../components/pier-cast/PierCastStandings";
import {
  PierCastConditionsSkeleton,
  PierCastCoverageRequest,
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
  PierCastGreatLakeIdV4,
  PierCastLeaderboardResponseV4,
} from "../lib/pierCastConditionsV4";
import type {
  PierCastSpeciesId,
} from "../lib/pierCastContracts";
import { pierCastReportSpeciesOrBest } from "../lib/pierCastCityReportPresentation";
import { PIER_CAST_MAP_REFRESH_INTERVAL_MS } from "../lib/pierCastMap";
import { hapticSelection } from "../lib/safeHaptics";
import {
  finderReportSpecies,
  mergePierCastCityLakes,
  PIER_CAST_SALMONID_ORDER,
  type PierCastLakeFilter,
  pickDefaultStandingsSpecies,
  pickFallbackStandingsSpecies,
} from "../lib/pierCastStandingsPresentation";
import {
  parsePierCastTargetSpecies,
  readPierCastCityLakes,
  readPierCastLakeFilter,
  readPierCastTargetPreference,
  writePierCastCityLakes,
  writePierCastLakeFilter,
  writePierCastTargetPreference,
} from "../lib/pierCastTargetPreference";
import {
  fetchPierCastHourlyWeather,
  type PierCastHourlyWeatherPoint,
} from "../lib/pierCastWeather";
import { paper, paperFonts } from "../lib/theme";
import { useAuthStore } from "../store/authStore";

function citySupportsSpecies(
  city: PierCastConditionsCatalogResponseV4["cities"][number],
  speciesId: PierCastSpeciesId,
): boolean {
  return Array.isArray(city.supportedSpeciesIds) &&
    city.supportedSpeciesIds.includes(speciesId);
}

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
  const [reportFallback, setReportFallback] = useState<{
    requestedSpeciesId: PierCastSpeciesId;
  } | null>(null);
  const [showingSavedCopy, setShowingSavedCopy] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routeReportLoading, setRouteReportLoading] = useState(Boolean(routeCityId && routeSpeciesId));
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<PierCastHourlyWeatherPoint[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [lakeFilter, setLakeFilter] = useState<PierCastLakeFilter>("all");
  const [cityLakes, setCityLakes] = useState<Record<string, PierCastGreatLakeIdV4>>({});
  const [cityLakesHydrated, setCityLakesHydrated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pageScrollRef = useRef<ScrollView>(null);
  const requestedCity = useRef<string | null>(null);
  const openingCity = useRef(false);
  const cityReportRequest = useRef(0);
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

  useEffect(() => {
    let active = true;
    void Promise.all([readPierCastLakeFilter(), readPierCastCityLakes()]).then(
      ([rememberedLake, rememberedLakes]) => {
        if (!active) return;
        setLakeFilter(rememberedLake);
        setCityLakes((current) => ({ ...rememberedLakes, ...current }));
        setCityLakesHydrated(true);
      },
    );
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (cityLakesHydrated) void writePierCastCityLakes(cityLakes);
  }, [cityLakes, cityLakesHydrated]);

  const rememberLakes = useCallback((boards: PierCastLeaderboardResponseV4[]) => {
    setCityLakes((current) => mergePierCastCityLakes(current, boards));
  }, []);

  const changeLake = useCallback((lake: PierCastLakeFilter) => {
    setLakeFilter(lake);
    void writePierCastLakeFilter(lake);
  }, []);

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
      let board = nextLeaderboard;
      const seenBoards = [nextLeaderboard];
      if (!requestedTarget) {
        // First visit (no remembered target): open on the salmon/trout whose
        // #1 city is best today. The automatic pick is not saved as a
        // preference, so it is re-evaluated on every visit until the angler
        // chooses a species themselves.
        const candidates = PIER_CAST_SALMONID_ORDER.filter((speciesId) =>
          nextLeaderboard.targetSpecies.some((option) => option.speciesId === speciesId)
        );
        const settled = await Promise.allSettled(
          candidates.map((speciesId) => fetchPierCastConditionsLeaderboard(speciesId)),
        );
        const boards = settled.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : []
        );
        seenBoards.push(...boards);
        let picked = pickDefaultStandingsSpecies(boards);
        let pickedBoard = boards.find((candidate) => candidate.selectedSpeciesId === picked) ?? null;
        if (!picked) {
          const fallback = pickFallbackStandingsSpecies(nextLeaderboard.targetSpecies);
          if (fallback) {
            try {
              pickedBoard = await fetchPierCastConditionsLeaderboard(fallback);
              seenBoards.push(pickedBoard);
              picked = fallback;
            } catch {
              pickedBoard = null;
            }
          }
        }
        if (
          picked && pickedBoard &&
          selectionRequest.current === requestId &&
          selectedSpeciesRef.current === null &&
          accountId.current === userId
        ) {
          selectedSpeciesRef.current = picked;
          setSelectedSpeciesId(picked);
          board = pickedBoard;
        }
      }
      rememberLakes(seenBoards);
      if (
        selectionRequest.current === requestId &&
        selectedSpeciesRef.current === board.selectedSpeciesId
      ) {
        setLeaderboard(board);
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
  }, [preferenceHydrated, rememberLakes, user?.id]);

  useEffect(() => {
    selectionRequest.current += 1;
    setSelectedCityId(null);
    setCityReport(null);
    setReportFallback(null);
    setShowingSavedCopy(false);
    setLeaderboard(null);
    setCatalog(null);
    setPaywall(false);
    setError(null);
    requestedCity.current = null;
    routeOpenedCity.current = null;
    setRouteReportLoading(Boolean(routeCityId && selectedSpeciesRef.current));
  }, [routeCityId, user?.id]);

  const loadCityReport = useCallback(async (
    cityId: string,
    target: PierCastSpeciesId,
    silent = false,
    selectionGuard: PierCastSpeciesId = target,
  ) => {
    if (silent && openingCity.current) return;
    const reportRequestId = ++cityReportRequest.current;
    const userId = user?.id;
    if (!silent) {
      requestedCity.current = cityId;
      openingCity.current = true;
    }
    try {
      const envelope = await fetchPierCastConditionsCityReport(cityId, target);
      if (
        cityReportRequest.current !== reportRequestId ||
        accountId.current !== userId || selectedSpeciesRef.current !== selectionGuard ||
        (!silent && requestedCity.current !== cityId)
      ) return;
      const shownSpeciesId = pierCastReportSpeciesOrBest(
        envelope.report,
        selectionGuard,
      ) ?? target;
      const report = shownSpeciesId === envelope.report.selectedSpeciesId
        ? envelope.report
        : { ...envelope.report, selectedSpeciesId: shownSpeciesId };
      if (silent) {
        setCityReport((current) => current?.cityId === cityId ? report : current);
      } else {
        setCityReport(report);
        setReportFallback(shownSpeciesId === selectionGuard ? null : {
          requestedSpeciesId: selectionGuard,
        });
        setSelectedCityId(cityId);
        setError(null);
      }
      setShowingSavedCopy(false);
    } catch (caught) {
      if (
        cityReportRequest.current !== reportRequestId ||
        accountId.current !== userId || selectedSpeciesRef.current !== selectionGuard ||
        (!silent && requestedCity.current !== cityId)
      ) return;
      if (caught instanceof PierCastRequestError && caught.code === "subscription_required") {
        if (!silent) setPaywall(true);
      } else if (!silent) {
        try {
          const saved = await fetchSavedPierCastConditionsReport(target);
          if (
            cityReportRequest.current !== reportRequestId ||
            accountId.current !== userId ||
            selectedSpeciesRef.current !== selectionGuard ||
            requestedCity.current !== cityId
          ) return;
          if (
            saved.status === "available" &&
            saved.envelope.report.cityId === cityId &&
            saved.envelope.report.species.some((species) => species.speciesId === target)
          ) {
            const shownSpeciesId = pierCastReportSpeciesOrBest(
              saved.envelope.report,
              selectionGuard,
            ) ?? target;
            setCityReport(shownSpeciesId === saved.envelope.report.selectedSpeciesId
              ? saved.envelope.report
              : { ...saved.envelope.report, selectedSpeciesId: shownSpeciesId });
            setReportFallback(shownSpeciesId === selectionGuard ? null : {
              requestedSpeciesId: selectionGuard,
            });
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
          if (
            cityReportRequest.current === reportRequestId &&
            accountId.current === userId &&
            selectedSpeciesRef.current === selectionGuard &&
            requestedCity.current === cityId
          ) {
            setError(caught instanceof Error ? caught.message : "Report could not load.");
          }
        }
      }
    } finally {
      if (!silent && cityReportRequest.current === reportRequestId) {
        openingCity.current = false;
      }
    }
  }, [user?.id]);

  const openCity = useCallback(async (cityId: string, silent = false) => {
    const target = selectedSpeciesRef.current;
    if (!target) return;
    const city = catalog?.cities.find((candidate) => candidate.cityId === cityId);
    if (!city) return;
    const reportSpeciesId = finderReportSpecies(city, target);
    if (!reportSpeciesId) {
      if (!silent) {
        setError("No PierCast species are available for the selected city.");
      }
      return;
    }
    await loadCityReport(cityId, reportSpeciesId, silent, target);
  }, [catalog, loadCityReport]);

  const selectCityReportSpecies = useCallback((speciesId: PierCastSpeciesId) => {
    setCityReport((current) => {
      if (!current?.species.some((species) => species.speciesId === speciesId)) {
        return current;
      }
      return { ...current, selectedSpeciesId: speciesId };
    });
  }, []);

  const openCityForSpecies = useCallback(async (
    cityId: string,
    speciesId: PierCastSpeciesId,
  ) => {
    const city = catalog?.cities.find((candidate) => candidate.cityId === cityId);
    if (!city || !citySupportsSpecies(city, speciesId)) {
      setError("This target species is not available for the selected PierCast city.");
      return;
    }
    const requestId = ++selectionRequest.current;
    selectedSpeciesRef.current = speciesId;
    setSelectedSpeciesId(speciesId);
    setReportFallback(null);
    setError(null);
    setLoading(false);
    setSelectionLoading(true);
    void writePierCastTargetPreference(speciesId);
    router.setParams({ speciesId });
    try {
      const next = await fetchPierCastConditionsLeaderboard(speciesId);
      rememberLakes([next]);
      if (
        selectionRequest.current !== requestId ||
        selectedSpeciesRef.current !== speciesId
      ) return;
      setLeaderboard(next);
      if (!next.cities.some((candidate) => candidate.cityId === cityId)) {
        setError("This target species is not available for the selected PierCast city.");
        return;
      }
      await loadCityReport(cityId, speciesId);
    } catch (caught) {
      if (
        selectionRequest.current === requestId &&
        selectedSpeciesRef.current === speciesId
      ) {
        setError(caught instanceof Error ? caught.message : "The city report could not load.");
      }
    } finally {
      if (selectedSpeciesRef.current === speciesId) setSelectionLoading(false);
    }
  }, [catalog, loadCityReport, rememberLakes, router]);

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
        rememberLakes([next]);
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
  }, [cityReport, rememberLakes, router]);

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

  const openFinderCity = useCallback((cityId: string) => {
    const city = catalog?.cities.find((candidate) => candidate.cityId === cityId);
    if (!city) return;
    const speciesId = finderReportSpecies(city, selectedSpeciesRef.current);
    if (!speciesId) {
      setError("This PierCast city has no species report available yet.");
      return;
    }
    if (
      speciesId === selectedSpeciesRef.current &&
      leaderboard?.selectedSpeciesId === speciesId &&
      leaderboard.cities.some((row) => row.cityId === cityId)
    ) {
      void openCity(cityId);
      return;
    }
    void openCityForSpecies(cityId, speciesId);
  }, [catalog, leaderboard, openCity, openCityForSpecies]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load({ silent: true });
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  /** A species on a city report opens that species' standings. */
  const openStandingsFor = useCallback((speciesId: PierCastSpeciesId) => {
    requestedCity.current = null;
    setError(null);
    setSelectedCityId(null);
    setCityReport(null);
    setShowingSavedCopy(false);
    selectSpecies(speciesId);
  }, [selectSpecies]);

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

  const showingLanding = Boolean(catalog && leaderboard && !selectedCity) &&
    !loading && !routeReportLoading && !error;
  const landingLayout = !selectedCity && !routeReportLoading && !(loading && routeCityId);

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
            ? returnToMap ? "Back to PierCast conditions map" : "Back to PierCast standings"
            : returnToMap ? "Back to PierCast conditions map" : "Back"}
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
              router.push({
                pathname: "/pier-cast-map",
                params: selectedSpeciesId ? { speciesId: selectedSpeciesId } : {},
              });
            }}
            accessibilityRole="button"
            accessibilityLabel="Open the PierCast visual map"
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
        contentContainerStyle={styles.landingContent}
        showsVerticalScrollIndicator={false}
        refreshControl={showingLanding
          ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void refresh()}
              tintColor={paper.dashboardBlue}
              colors={[paper.dashboardBlue]}
            />
          )
          : undefined}
      >
        {catalog?.cities.length === 0 ? (
          <View style={styles.landingPad}>
            <MessageCard icon="lock-closed-outline" title="PierCast is coming soon" />
          </View>
        ) : loading || routeReportLoading ? (
          landingLayout ? <PierCastStandingsSkeleton /> : <PierCastConditionsSkeleton />
        ) : error ? (
          <View style={styles.landingPad}>
            <MessageCard
              icon="alert-circle-outline"
              title="PierCast could not load"
              body={error}
              actionLabel="TRY AGAIN"
              onAction={() => void load()}
            />
          </View>
        ) : catalog && leaderboard ? (
          selectedCity ? (
            cityReport && selectedSpeciesId ? (
              <PierCastConditionsCityReport
                city={selectedCity}
                cities={catalog.cities}
                report={cityReport}
                weather={weather}
                weatherLoading={weatherLoading}
                savedCopy={showingSavedCopy}
                fallbackFromSpeciesId={reportFallback?.requestedSpeciesId ?? null}
                onSelectReportSpecies={selectCityReportSpecies}
                onOpenStandings={openStandingsFor}
                onOpenCity={openFinderCity}
                onOpenMap={() => router.push({
                  pathname: "/pier-cast-map",
                  params: {
                    cityId: selectedCity.cityId,
                    ...(selectedSpeciesId ? { speciesId: selectedSpeciesId } : {}),
                  },
                })}
              />
            ) : (
              <PierCastConditionsSkeleton />
            )
          ) : (
            <PierCastStandings
              catalog={catalog}
              leaderboard={leaderboard}
              selectedSpeciesId={selectedSpeciesId}
              selectionLoading={selectionLoading}
              lakeFilter={lakeFilter}
              cityLakes={cityLakes}
              onChangeLake={changeLake}
              onSelectSpecies={selectSpecies}
              onOpenCity={(cityId) => void openCity(cityId)}
              onOpenFinderCity={openFinderCity}
              onOpenMap={() => router.push({
                pathname: "/pier-cast-map",
                params: selectedSpeciesId ? { speciesId: selectedSpeciesId } : {},
              })}
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
  landingContent: { paddingBottom: 44 },
  landingPad: { paddingHorizontal: 14, paddingTop: 15 },
  messageCard: { minHeight: 210, alignItems: "center", justifyContent: "center", marginTop: 12, borderWidth: 2, borderColor: paper.dashboardInk, borderRadius: 11, padding: 24, backgroundColor: paper.dashboardWhite },
  messageTitle: { marginTop: 10, color: paper.dashboardInk, fontFamily: paperFonts.display, fontSize: 23, textAlign: "center" },
  messageCopy: { marginTop: 7, color: paper.dashboardMuted, fontFamily: paperFonts.body, fontSize: 13, lineHeight: 19, textAlign: "center" },
  retryButton: { marginTop: 18, borderRadius: 7, paddingHorizontal: 18, paddingVertical: 11, backgroundColor: paper.dashboardBlue },
  retryButtonText: { color: "#FFFFFF", fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.1 },
});
