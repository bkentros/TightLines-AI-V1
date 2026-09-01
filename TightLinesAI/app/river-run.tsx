import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  Easing,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CornerMarkSet,
  PaperNavHeader,
  SectionEyebrow,
  TopographicLines,
} from "../components/paper";
import { RiverRunVisual } from "../components/river-run/RiverRunVisual";
import { FeedbackCard } from "../components/FeedbackCard";
import { SubscribePrompt } from "../components/SubscribePrompt";
import {
  fetchRiverRunCatalog,
  fetchRiverRunOwnerReviewCatalog,
  fetchRiverRunOwnerReviewSnapshot,
  fetchRiverRunSnapshot,
  RiverRunRequestError,
} from "../lib/riverRun";
import { isAdminEmail } from "../lib/adminAccess";
import {
  formatRiverRunSeason,
  formatRiverRunSpecies,
  resolveRiverRunTarget,
  type RiverRunChoice,
  riverRunRiverChoices,
  riverRunSeasonChoices,
  riverRunSpeciesChoices,
  riverRunStateChoices,
} from "../lib/riverRunCatalogSelection";
import type {
  RiverRunCatalogResponse,
  RiverRunLiveConditionMetric,
  RiverRunLiveConditions,
  RiverRunPrimitiveDisplay,
  RiverRunSeason,
  RiverRunSnapshotResponse,
} from "../lib/riverRunContracts";
import {
  formatRiverRunTabStatus,
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";
import {
  getRiverRunSpeciesHeroScale,
  getRiverRunSpeciesImage,
} from "../lib/riverRunSpeciesImages";
import { getRiverRunRiverImage } from "../lib/riverRunChoiceImages";
import {
  RIVER_RUN_REGULATION_REMINDER,
  riverRunFishingGuideForSpecies,
} from "../lib/riverRunFishingGuides";
import {
  resolveRiverSpotFinderRecommendedSections,
  RIVER_ACCESS_CLOSURES_URL,
  RIVER_ACCESS_GENERAL_WARNING,
  type RiverAccessKind,
  type RiverAccessSection,
  riverAccessSectionLabel,
  riverRunSpotFinderForRiver,
  type RiverSpotFinder,
} from "../lib/riverRunSpotFinder";
import {
  hapticImpact,
  hapticSelection,
  ImpactFeedbackStyle,
} from "../lib/safeHaptics";
import { paper, paperFonts, paperRadius, paperShadows } from "../lib/theme";
import {
  canAttemptRiverRunReport,
  getEffectiveTier,
} from "../lib/subscription";
import { useAuthStore } from "../store/authStore";

type WizardStep = 1 | 2 | 3 | 4;
type ScreenState = "setup" | "result";
type PrimitiveTabId = Extract<
  RiverRunVisualKind,
  "run_stage" | "activity" | "fish_in_river"
>;

type PrimitiveTabDefinition = {
  id: PrimitiveTabId;
  index: string;
  tabTitle: string;
  cardTitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PRIMITIVE_TABS: PrimitiveTabDefinition[] = [
  {
    id: "run_stage",
    index: "01",
    tabTitle: "STAGE",
    cardTitle: "Migration Stage",
    icon: "calendar-outline",
  },
  {
    id: "activity",
    index: "02",
    tabTitle: "ACTIVITY",
    cardTitle: "Activity Outlook",
    icon: "flash-outline",
  },
  {
    id: "fish_in_river",
    index: "03",
    tabTitle: "PRESENCE",
    cardTitle: "Seasonal Presence",
    icon: "fish-outline",
  },
];

const CHINOOK_IMAGE = getRiverRunSpeciesImage("chinook_salmon");
const COHO_IMAGE = getRiverRunSpeciesImage("coho_salmon");
const STEELHEAD_IMAGE = getRiverRunSpeciesImage("steelhead");
const ATLANTIC_IMAGE = getRiverRunSpeciesImage("atlantic_salmon");
const MIGRATORY_BROWN_IMAGE = getRiverRunSpeciesImage(
  "lake_run_brown_trout",
);
const RIVER_RUN_TAB_BLUE = "#1B4B68";

type ChoiceIconTheme = {
  background: string;
  foreground: string;
};

const STATE_ICON_THEMES: Record<string, ChoiceIconTheme> = {
  MI: {
    background: "#EAF4FC",
    foreground: "#4F91BA",
  },
  NY: {
    background: "#F2ECFA",
    foreground: "#9B78B6",
  },
  WI: {
    background: "#EAF5ED",
    foreground: "#68A17B",
  },
  OH: {
    background: "#FFF1E3",
    foreground: "#CF955C",
  },
  IN: {
    background: "#FFF3DF",
    foreground: "#B77A2F",
  },
  WA: {
    background: "#E8F3EE",
    foreground: "#34775F",
  },
};

const SEASON_ICON_THEMES: Record<
  string,
  ChoiceIconTheme & { icon: keyof typeof Ionicons.glyphMap }
> = {
  fall: {
    background: "#FFF0E5",
    foreground: "#C8793E",
    icon: "leaf",
  },
  winter: {
    background: "#EAF4FC",
    foreground: "#4F91BA",
    icon: "snow",
  },
  spring: {
    background: "#EEF7EA",
    foreground: "#70A45D",
    icon: "flower",
  },
  summer: {
    background: "#FFF7D9",
    foreground: "#D3A42F",
    icon: "sunny",
  },
};

const STEP_CONFIG: Record<
  WizardStep,
  {
    label: string;
    eyebrow: string;
    question: string;
    caption: string;
    icon: keyof typeof Ionicons.glyphMap;
    requestTitle?: string;
    requestAction?: string;
  }
> = {
  1: {
    label: "STATE",
    eyebrow: "CHOOSE A REGION",
    question: "Which state?",
    caption: "Choose an available state. Planned regions are marked below.",
    icon: "map-outline",
    requestTitle: "Need another state?",
    requestAction: "Request a state",
  },
  2: {
    label: "SEASON",
    eyebrow: "CHOOSE A SEASON",
    question: "Which migration season are you following?",
    caption: "Fall is available now. Planned seasons are marked below.",
    icon: "calendar-outline",
  },
  3: {
    label: "SPECIES",
    eyebrow: "CHOOSE A SPECIES",
    question: "What is moving?",
    caption: "Choose an available species. Planned additions stay visible.",
    icon: "fish-outline",
    requestTitle: "Need another species?",
    requestAction: "Request a species",
  },
  4: {
    label: "RIVER",
    eyebrow: "CHOOSE A RIVER",
    question: "Which river should we read?",
    caption: "Rivers are filtered by species. Planned coverage is marked.",
    icon: "water-outline",
    requestTitle: "Need another river?",
    requestAction: "Request a river",
  },
};

export default function RiverRunScreen() {
  const router = useRouter();
  const { profile, user, fetchProfile } = useAuthStore();
  const ownerReviewMode = isAdminEmail(user?.email);
  const effectiveTier = getEffectiveTier(profile, user?.email);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>("setup");
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [activePrimitive, setActivePrimitive] = useState<PrimitiveTabId>(
    "run_stage",
  );
  const [catalog, setCatalog] = useState<RiverRunCatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<RiverRunSeason | null>(
    null,
  );
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedRiverId, setSelectedRiverId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<RiverRunSnapshotResponse | null>(
    null,
  );
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const snapshotRequestRef = useRef(0);
  const resultScrollRef = useRef<ScrollView>(null);
  const primitiveTabsYRef = useRef(0);

  const loadCatalog = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoadingCatalog(true);
    setCatalogError(null);
    try {
      setCatalog(
        await (ownerReviewMode
          ? fetchRiverRunOwnerReviewCatalog()
          : fetchRiverRunCatalog()),
      );
    } catch (error) {
      setCatalogError(
        error instanceof Error
          ? error.message
          : "River Migration failed to load.",
      );
    } finally {
      if (!isRefresh) setLoadingCatalog(false);
    }
  }, [ownerReviewMode]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const activeCatalog = catalog;
  const stateChoices = useMemo(
    () => activeCatalog ? riverRunStateChoices(activeCatalog) : [],
    [activeCatalog],
  );
  const seasonChoices = useMemo(
    () =>
      activeCatalog ? riverRunSeasonChoices(activeCatalog, selectedState) : [],
    [activeCatalog, selectedState],
  );
  const speciesChoices = useMemo(
    () =>
      activeCatalog
        ? riverRunSpeciesChoices(
          activeCatalog,
          selectedState,
          selectedSeason,
        )
        : [],
    [activeCatalog, selectedSeason, selectedState],
  );
  const riverChoices = useMemo(
    () =>
      activeCatalog
        ? riverRunRiverChoices(
          activeCatalog,
          selectedState,
          selectedSeason,
          selectedSpecies,
        )
        : [],
    [activeCatalog, selectedSeason, selectedSpecies, selectedState],
  );
  const selectedTarget = useMemo(
    () =>
      activeCatalog
        ? resolveRiverRunTarget(activeCatalog, {
          stateCode: selectedState,
          season: selectedSeason,
          species: selectedSpecies,
          riverId: selectedRiverId,
        })
        : null,
    [
      activeCatalog,
      selectedRiverId,
      selectedSeason,
      selectedSpecies,
      selectedState,
    ],
  );

  const loadSnapshot = useCallback(async (showLoading = true) => {
    if (screenState !== "result") {
      setLoadingSnapshot(false);
      return;
    }
    if (!selectedTarget) {
      setSnapshot(null);
      return;
    }
    const requestId = ++snapshotRequestRef.current;
    if (showLoading) setLoadingSnapshot(true);
    setSnapshotError(null);
    try {
      const next = await (ownerReviewMode
        ? fetchRiverRunOwnerReviewSnapshot
        : fetchRiverRunSnapshot)({
          riverId: selectedTarget.river.riverId,
          runId: selectedTarget.run.runId,
          presentationState: selectedTarget.state.state,
        });
      if (requestId === snapshotRequestRef.current) {
        setSnapshot(next);
        if (next.accessTier === "free_trial" && user?.id) {
          void fetchProfile(user.id);
        }
      }
    } catch (error) {
      if (requestId === snapshotRequestRef.current) {
        setSnapshot(null);
        if (
          error instanceof RiverRunRequestError &&
          error.code === "subscription_required"
        ) {
          setSnapshotError(null);
          setScreenState("setup");
          setWizardStep(1);
          setShowSubscribePrompt(true);
          if (user?.id) void fetchProfile(user.id);
          return;
        }
        setSnapshotError(
          error instanceof Error
            ? error.message
            : "River Migration snapshot failed to load.",
        );
      }
    } finally {
      if (requestId === snapshotRequestRef.current) {
        setLoadingSnapshot(false);
      }
    }
  }, [fetchProfile, ownerReviewMode, screenState, selectedTarget, user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (screenState !== "result") {
        return () => {
          snapshotRequestRef.current++;
        };
      }
      void loadSnapshot();
      const subscription = AppState.addEventListener("change", (nextState) => {
        if (nextState !== "active") return;
        void loadSnapshot(false);
      });
      return () => {
        snapshotRequestRef.current++;
        subscription.remove();
      };
    }, [loadSnapshot, screenState]),
  );

  const returnToSetup = useCallback(() => {
    hapticSelection();
    snapshotRequestRef.current++;
    setSnapshotError(null);
    setScreenState("setup");
    setWizardStep(1);
  }, []);

  const handleBack = useCallback(() => {
    if (screenState === "result") {
      returnToSetup();
      return;
    }
    if (wizardStep === 1) {
      router.back();
      return;
    }
    hapticSelection();
    setWizardStep((current) => (current - 1) as WizardStep);
  }, [returnToSetup, router, screenState, wizardStep]);

  const currentChoices = wizardStep === 1
    ? stateChoices
    : wizardStep === 2
    ? seasonChoices
    : wizardStep === 3
    ? speciesChoices
    : riverChoices;
  const currentSelection = wizardStep === 1
    ? selectedState
    : wizardStep === 2
    ? selectedSeason
    : wizardStep === 3
    ? selectedSpecies
    : selectedRiverId;
  const canContinue = currentSelection !== null &&
    currentChoices.some((choice) =>
      choice.id === currentSelection && !choice.disabled
    );
  const coverageContextLines = [
    `Setup step: ${STEP_CONFIG[wizardStep].label}`,
    selectedState
      ? `Selected state: ${
        stateChoices.find((choice) => choice.id === selectedState)?.label ??
          selectedState
      }`
      : null,
    selectedSeason
      ? `Selected migration season: ${formatRiverRunSeason(selectedSeason)}`
      : null,
    selectedSpecies
      ? `Selected species: ${formatRiverRunSpecies(selectedSpecies)}`
      : null,
    selectedRiverId
      ? `Selected river: ${
        riverChoices.find((choice) => choice.id === selectedRiverId)?.label ??
          selectedRiverId
      }`
      : null,
  ].filter((line): line is string => line !== null);

  const selectChoice = useCallback((choice: RiverRunChoice) => {
    if (choice.disabled) return;
    hapticSelection();
    if (wizardStep === 1) {
      setSelectedState(choice.id);
      setSelectedSeason(null);
      setSelectedSpecies(null);
      setSelectedRiverId(null);
    } else if (wizardStep === 2) {
      setSelectedSeason(choice.id as RiverRunSeason);
      setSelectedSpecies(null);
      setSelectedRiverId(null);
    } else if (wizardStep === 3) {
      setSelectedSpecies(choice.id);
      setSelectedRiverId(null);
    } else {
      setSelectedRiverId(choice.id);
    }
  }, [wizardStep]);

  const openSelectedReport = useCallback(() => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    setActivePrimitive("run_stage");
    setSnapshot(null);
    setSnapshotError(null);
    setScreenState("result");
    setLoadingSnapshot(true);
  }, []);

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    if (wizardStep < 4) {
      hapticSelection();
      setWizardStep((wizardStep + 1) as WizardStep);
      return;
    }
    const canAttemptReport = canAttemptRiverRunReport(
      effectiveTier,
      profile,
      selectedTarget
        ? {
          riverId: selectedTarget.river.riverId,
          runId: selectedTarget.run.runId,
          presentationState: selectedTarget.state.state,
        }
        : null,
    );
    if (!canAttemptReport) {
      hapticSelection();
      setShowSubscribePrompt(true);
      return;
    }
    openSelectedReport();
  }, [
    canContinue,
    effectiveTier,
    openSelectedReport,
    profile,
    selectedTarget,
    wizardStep,
  ]);

  const handlePrimitiveTabChange = useCallback((tab: PrimitiveTabId) => {
    setActivePrimitive(tab);
    requestAnimationFrame(() => {
      resultScrollRef.current?.scrollTo({
        y: Math.max(0, primitiveTabsYRef.current - 1),
        animated: true,
      });
    });
  }, []);

  const resultSnapshot = snapshot;
  const publicRiverConditions = resultSnapshot
    ? resultSnapshot.riverConditions ??
      unavailableRiverConditions(resultSnapshot)
    : undefined;
  const resultRiverConditions = publicRiverConditions;
  const resultSeason = selectedTarget?.run.season ?? selectedSeason ?? "fall";
  const resultSpecies = selectedTarget?.run.species ??
    selectedSpecies ??
    "chinook_salmon";
  const resultSpotFinder = riverRunSpotFinderForRiver(
    resultSnapshot?.riverId,
    resultSpecies,
    resultSnapshot?.presentation?.state,
  );
  const primitiveTabStickyIndex = 2 +
    (resultSnapshot?.fishCounts ? 1 : 0) +
    (resultSpotFinder ? 1 : 0);
  const navSpecies = formatRiverRunSpecies(resultSpecies)
    .replace(/\s+Salmon$/i, "");
  const navTitle = screenState === "result"
    ? `${
      formatRiverRunSeason(resultSeason).toUpperCase()
    } ${navSpecies.toUpperCase()}`
    : "RIVER MIGRATION";

  return (
    <SafeAreaView style={styles.safeRoot} edges={["top"]}>
      <StatusBar style="light" backgroundColor={paper.dashboardInk} />
      {CHINOOK_IMAGE
        ? (
          <View pointerEvents="none" style={styles.preloadImage}>
            <Image source={CHINOOK_IMAGE} style={styles.preloadImageAsset} />
          </View>
        )
        : null}
      {COHO_IMAGE
        ? (
          <View pointerEvents="none" style={styles.preloadImage}>
            <Image source={COHO_IMAGE} style={styles.preloadImageAsset} />
          </View>
        )
        : null}
      {STEELHEAD_IMAGE
        ? (
          <View pointerEvents="none" style={styles.preloadImage}>
            <Image source={STEELHEAD_IMAGE} style={styles.preloadImageAsset} />
          </View>
        )
        : null}
      {MIGRATORY_BROWN_IMAGE
        ? (
          <View pointerEvents="none" style={styles.preloadImage}>
            <Image
              source={MIGRATORY_BROWN_IMAGE}
              style={styles.preloadImageAsset}
            />
          </View>
        )
        : null}
      {ATLANTIC_IMAGE
        ? (
          <View pointerEvents="none" style={styles.preloadImage}>
            <Image source={ATLANTIC_IMAGE} style={styles.preloadImageAsset} />
          </View>
        )
        : null}
      <PaperNavHeader
        eyebrow={screenState === "result"
          ? "FINFINDR · RIVER MIGRATION"
          : "FINFINDR"}
        title={navTitle}
        onBack={handleBack}
        backLabel={screenState === "result" ? "SETUP" : "BACK"}
        right={screenState === "result"
          ? <HeaderEditButton onPress={returnToSetup} />
          : undefined}
      />

      <View style={styles.body}>
        {screenState === "setup"
          ? (
            <SetupView
              loading={loadingCatalog}
              error={catalogError}
              choices={currentChoices}
              selectedId={currentSelection}
              step={wizardStep}
              onSelect={selectChoice}
              onBack={handleBack}
              onContinue={handleContinue}
              canContinue={canContinue}
              onRetry={() => void loadCatalog()}
              profile={profile}
              user={user}
              coverageContextLines={coverageContextLines}
            />
          )
          : (
            <ScrollView
              ref={resultScrollRef}
              style={styles.scroll}
              contentContainerStyle={styles.resultContent}
              showsVerticalScrollIndicator={false}
              stickyHeaderIndices={resultSnapshot
                ? [primitiveTabStickyIndex]
                : undefined}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    const refresh = Promise.all([
                      loadCatalog(true),
                      loadSnapshot(false),
                    ]);
                    void refresh.finally(() => setRefreshing(false));
                  }}
                  tintColor={paper.dashboardInk}
                />
              }
            >
              <ResultHero
                season={resultSeason}
                species={resultSpecies}
                snapshot={resultSnapshot}
                readDate={currentDeviceLocalDate()}
              />

              {resultRiverConditions
                ? (
                  <LiveRiverConditionsCard
                    conditions={resultRiverConditions}
                    fishingShape={resultSnapshot?.fishability}
                  />
                )
                : null}

              {resultSnapshot?.fishCounts
                ? <FishCountsCard counts={resultSnapshot.fishCounts} />
                : null}

              {resultSpotFinder
                ? (
                  <SpotFinderCard
                    key={`${resultSpotFinder.riverId}:${resultSpecies}:${
                      resultSnapshot?.presentation?.state ?? ""
                    }`}
                    finder={resultSpotFinder}
                    runStage={resultSnapshot?.runStage}
                    seasonalZone={resultSnapshot?.seasonalZone}
                  />
                )
                : null}

              {resultSnapshot
                ? (
                  <PrimitiveTabBar
                    snapshot={resultSnapshot}
                    activeTab={activePrimitive}
                    onChange={handlePrimitiveTabChange}
                    onLayoutY={(value) => {
                      primitiveTabsYRef.current = value;
                    }}
                  />
                )
                : null}

              {loadingSnapshot
                ? <LoadingState label="Reading current river conditions" />
                : snapshotError
                ? (
                  <MessageState
                    icon="alert-circle-outline"
                    title="Snapshot unavailable"
                    body={snapshotError}
                    actionLabel="TRY AGAIN"
                    onAction={() => void loadSnapshot()}
                  />
                )
                : resultSnapshot
                ? (
                  <View style={styles.snapshotResultStack}>
                    <SnapshotView
                      snapshot={resultSnapshot}
                      activePrimitive={activePrimitive}
                      species={resultSpecies}
                    />
                    <FeedbackCard
                      featureName="River Migration Coverage"
                      topic="feature"
                      variant="request"
                      eyebrow="EXPAND RIVER MIGRATION"
                      title="What should we add next?"
                      body="Request a state, river, migration season, or species. Your requests help decide where FinFindr expands next."
                      actionLabel="REQUEST COVERAGE"
                      profile={profile}
                      user={user}
                      contextLines={[
                        "Request category: River Migration coverage",
                        `Current state: ${
                          selectedTarget?.state.displayName ??
                            selectedTarget?.state.state ??
                            "unknown"
                        }`,
                        `Current migration season: ${
                          formatRiverRunSeason(resultSeason)
                        }`,
                        `Current species: ${
                          formatRiverRunSpecies(resultSpecies)
                        }`,
                        `Current river: ${
                          selectedTarget?.river.displayName ?? "unknown"
                        }`,
                      ]}
                    />
                  </View>
                )
                : (
                  <MessageState
                    icon="water-outline"
                    title="No current read"
                    body="FinFindr could not find a completed River Migration snapshot for this selection."
                    actionLabel="BACK TO SETUP"
                    onAction={returnToSetup}
                  />
                )}
            </ScrollView>
          )}
      </View>
      <SubscribePrompt
        visible={showSubscribePrompt}
        onDismiss={() => setShowSubscribePrompt(false)}
        onUnlocked={() => {
          setShowSubscribePrompt(false);
          openSelectedReport();
        }}
      />
    </SafeAreaView>
  );
}

function FishCountsCard({
  counts,
}: {
  counts: NonNullable<RiverRunSnapshotResponse["fishCounts"]>;
}) {
  const [open, setOpen] = useState(false);
  const available = counts.status === "available";
  const stale = counts.status === "stale";
  const periodLabel = counts.period === "weekly"
    ? "LAST REPORTED WEEK"
    : "SEASON TO DATE";
  const dateLabel = counts.observedThrough
    ? new Date(`${counts.observedThrough}T12:00:00`).toLocaleDateString(
      undefined,
      { month: "short", day: "numeric", year: "numeric" },
    )
    : null;
  const reportDateLabel = counts.reportDate
    ? new Date(`${counts.reportDate}T12:00:00`).toLocaleDateString(
      undefined,
      { month: "short", day: "numeric", year: "numeric" },
    )
    : null;
  const collapsedSummary = available || stale
    ? `${(counts.observedTotal ?? 0).toLocaleString()} reported${
      dateLabel ? ` · observed through ${dateLabel}` : ""
    }`
    : "No current numerical report for this species";
  return (
    <View
      style={styles.fishCountsCard}
      testID="river-fish-counts"
      accessible={false}
    >
      <Pressable
        style={({ pressed }) => [
          styles.fishCountsToggle,
          pressed && { opacity: 0.82 },
        ]}
        onPress={() => {
          hapticSelection();
          setOpen((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Fish Counts at ${counts.facilityName}. ${collapsedSummary}. ${
          open ? "Collapse" : "Expand"
        } details. Facility observations are not total river abundance.`}
      >
        <View style={styles.fishCountsIcon}>
          <Ionicons name="fish-outline" size={19} color="#7E382C" />
        </View>
        <View style={styles.fishCountsHeadingCopy}>
          <Text style={styles.fishCountsTitle}>Fish Counts</Text>
          <Text style={styles.fishCountsFacility} numberOfLines={2}>
            {counts.facilityName} · {collapsedSummary}
          </Text>
        </View>
        <View
          style={[
            styles.fishCountsStatus,
            available
              ? styles.fishCountsStatusCurrent
              : stale
              ? styles.fishCountsStatusStale
              : styles.fishCountsStatusUnavailable,
          ]}
        >
          <Text style={styles.fishCountsStatusText}>
            {available ? "CURRENT" : stale ? "STALE" : "NO COUNT"}
          </Text>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={19}
          color="#7E382C"
        />
      </Pressable>

      {open
        ? (
          <View style={styles.fishCountsContent}>
            <Text style={styles.fishCountsEyebrow}>
              OFFICIAL FACILITY REPORT
            </Text>
            {available || stale
              ? (
                <View style={styles.fishCountsBody}>
                  <View style={styles.fishCountsTotalRow}>
                    <View>
                      <Text style={styles.fishCountsPeriod}>{periodLabel}</Text>
                      <Text style={styles.fishCountsTotal}>
                        {(counts.observedTotal ?? 0).toLocaleString()}
                      </Text>
                      <Text style={styles.fishCountsDate}>
                        {reportDateLabel
                          ? `Official report issued ${reportDateLabel}`
                          : "Report date supplied by source"}
                      </Text>
                      <Text style={styles.fishCountsDate}>
                        {dateLabel
                          ? `Facility observations through ${dateLabel}`
                          : "Observation date supplied by source"}
                      </Text>
                    </View>
                    {counts.adultTotal != null || counts.jackTotal != null
                      ? (
                        <View style={styles.fishCountsBreakdown}>
                          <View style={styles.fishCountsBreakdownItem}>
                            <Text style={styles.fishCountsBreakdownValue}>
                              {(counts.adultTotal ?? 0).toLocaleString()}
                            </Text>
                            <Text style={styles.fishCountsBreakdownLabel}>
                              ADULTS
                            </Text>
                          </View>
                          <View style={styles.fishCountsBreakdownItem}>
                            <Text style={styles.fishCountsBreakdownValue}>
                              {(counts.jackTotal ?? 0).toLocaleString()}
                            </Text>
                            <Text style={styles.fishCountsBreakdownLabel}>
                              JACKS
                            </Text>
                          </View>
                        </View>
                      )
                      : null}
                  </View>
                  {counts.preliminary
                    ? (
                      <Text style={styles.fishCountsPreliminary}>
                        PRELIMINARY · SOURCE MAY REVISE
                      </Text>
                    )
                    : null}
                </View>
              )
              : (
                <View style={styles.fishCountsUnavailable}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={paper.dashboardMuted}
                  />
                  <Text style={styles.fishCountsUnavailableText}>
                    The official source has no current numerical row for this
                    species, or the latest report could not be verified. No
                    value is inferred.
                  </Text>
                </View>
              )}

            <Text style={styles.fishCountsLimitation}>{counts.limitation}</Text>
            <Pressable
              style={(
                { pressed },
              ) => [
                styles.fishCountsSourceButton,
                pressed && { opacity: 0.72 },
              ]}
              onPress={() => void Linking.openURL(counts.sourceUrl)}
              accessibilityRole="link"
              accessibilityLabel={`Open official fish-count source from ${counts.attribution}`}
            >
              <Text style={styles.fishCountsSourceText}>
                OPEN OFFICIAL SOURCE
              </Text>
              <Ionicons name="open-outline" size={14} color="#7E382C" />
            </Pressable>
          </View>
        )
        : null}
    </View>
  );
}

function HeaderEditButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.headerEdit,
        pressed && { opacity: 0.72 },
      ]}
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Edit River Migration selection"
    >
      <Ionicons name="options-outline" size={13} color="#FFFFFF" />
      <Text style={styles.headerEditText}>EDIT</Text>
    </Pressable>
  );
}

function SetupView({
  loading,
  error,
  choices,
  selectedId,
  step,
  onSelect,
  onBack,
  onContinue,
  canContinue,
  onRetry,
  profile,
  user,
  coverageContextLines,
}: {
  loading: boolean;
  error: string | null;
  choices: RiverRunChoice[];
  selectedId: string | null;
  step: WizardStep;
  onSelect: (choice: RiverRunChoice) => void;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
  onRetry: () => void;
  profile: ReturnType<typeof useAuthStore.getState>["profile"];
  user: ReturnType<typeof useAuthStore.getState>["user"];
  coverageContextLines: string[];
}) {
  const config = STEP_CONFIG[step];
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.setupContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.setupHero}>
        <SectionEyebrow color={paper.red}>RIVER MIGRATION SETUP</SectionEyebrow>
        <Text style={styles.setupHeroTitle} allowFontScaling={false}>
          FOLLOW THE{"\n"}
          <Text style={styles.setupHeroAccent}>MIGRATION.</Text>
        </Text>
        <Text style={styles.setupHeroSubtitle}>
          Choose an audited migration and FinFindr will assemble today&apos;s
          measured river read.
        </Text>
      </View>

      <WizardProgress current={step} />

      {loading
        ? <LoadingState label="Loading supported river migrations" compact />
        : error
        ? (
          <MessageState
            icon="warning-outline"
            title="River Migration is unavailable"
            body={error}
            actionLabel="TRY AGAIN"
            onAction={onRetry}
          />
        )
        : (
          <View style={styles.stepCard}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.red}
              count={5}
            />
            <CornerMarkSet color={paper.red} size={13} inset={10} />
            <View style={styles.stepHeader}>
              <Text style={styles.stepEyebrow}>
                STEP {step} OF 4 · {config.eyebrow}
              </Text>
              <Text style={styles.stepTitle} allowFontScaling={false}>
                {config.question}
              </Text>
              <Text style={styles.stepCaption}>{config.caption}</Text>
            </View>

            {choices.length > 0
              ? (
                <View style={styles.choiceStack}>
                  {choices.map((choice) => (
                    <ChoiceCard
                      key={choice.id}
                      choice={choice}
                      selected={selectedId === choice.id}
                      step={step}
                      onPress={() => onSelect(choice)}
                    />
                  ))}
                </View>
              )
              : (
                <View style={styles.noChoiceState}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={24}
                    color={paper.dashboardMuted}
                  />
                  <Text style={styles.noChoiceTitle}>
                    No audited options yet
                  </Text>
                  <Text style={styles.noChoiceBody}>
                    FinFindr only shows combinations with completed river
                    migration configuration and evidence coverage.
                  </Text>
                </View>
              )}
          </View>
        )}

      {!loading && !error
        ? (
          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.82 },
              ]}
              onPress={onBack}
              accessibilityRole="button"
            >
              <Ionicons
                name="chevron-back"
                size={14}
                color={paper.dashboardInk}
              />
              <Text style={styles.secondaryButtonText}>
                {step === 1 ? "CANCEL" : "BACK"}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                !canContinue && styles.primaryButtonDisabled,
                pressed && canContinue && { opacity: 0.9 },
              ]}
              onPress={onContinue}
              disabled={!canContinue}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  !canContinue && styles.primaryButtonTextDisabled,
                ]}
              >
                {step === 4 ? "VIEW RIVER MIGRATION" : "CONTINUE"}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={canContinue ? "#FFFFFF" : paper.dashboardMuted}
              />
            </Pressable>
          </View>
        )
        : null}

      {!loading && !error && config.requestTitle && config.requestAction
        ? (
          <FeedbackCard
            featureName="River Migration Coverage"
            topic="feature"
            variant="request"
            compact
            eyebrow="REQUEST COVERAGE"
            title={config.requestTitle}
            actionLabel={config.requestAction}
            profile={profile}
            user={user}
            contextLines={[
              "Request category: River Migration setup coverage",
              ...coverageContextLines,
            ]}
          />
        )
        : null}

      <Text style={styles.setupDisclaimer}>
        Available reads are backed by dependable local water data and seasonal
        evidence. Planned choices cannot be selected.
      </Text>
    </ScrollView>
  );
}

function WizardProgress({ current }: { current: WizardStep }) {
  return (
    <View style={styles.progressRow}>
      {([1, 2, 3, 4] as WizardStep[]).map((step) => {
        const config = STEP_CONFIG[step];
        const active = current === step;
        const complete = current > step;
        return (
          <View
            key={step}
            style={[
              styles.progressTile,
              active && styles.progressTileActive,
              complete && styles.progressTileComplete,
            ]}
          >
            <View
              style={[
                styles.progressIcon,
                active && styles.progressIconActive,
                complete && styles.progressIconComplete,
              ]}
            >
              <Ionicons
                name={complete ? "checkmark" : config.icon}
                size={15}
                color={active || complete ? "#FFFFFF" : paper.dashboardInk}
              />
            </View>
            <Text
              style={[
                styles.progressLabel,
                complete && styles.progressLabelComplete,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.72}
            >
              {config.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function StateChoiceIcon({ stateCode, disabled }: {
  stateCode: string;
  disabled: boolean;
}) {
  const theme = STATE_ICON_THEMES[stateCode] ?? STATE_ICON_THEMES.MI;
  return (
    <View
      style={[
        styles.illustratedChoiceIcon,
        { backgroundColor: theme.background },
        disabled && styles.illustratedChoiceIconDisabled,
      ]}
    >
      <TopographicLines
        style={StyleSheet.absoluteFill}
        color={theme.foreground}
        count={3}
      />
      <Text
        style={[styles.stateChoiceMonogram, { color: theme.foreground }]}
        allowFontScaling={false}
      >
        {stateCode}
      </Text>
    </View>
  );
}

function SeasonChoiceIcon({ season, disabled }: {
  season: string;
  disabled: boolean;
}) {
  const theme = SEASON_ICON_THEMES[season] ?? SEASON_ICON_THEMES.fall;
  return (
    <View
      style={[
        styles.illustratedChoiceIcon,
        { backgroundColor: theme.background },
        disabled && styles.illustratedChoiceIconDisabled,
      ]}
    >
      <Ionicons name={theme.icon} size={27} color={theme.foreground} />
    </View>
  );
}

function ChoiceCard({
  choice,
  selected,
  step,
  onPress,
}: {
  choice: RiverRunChoice;
  selected: boolean;
  step: WizardStep;
  onPress: () => void;
}) {
  const speciesImage = step === 3 ? getRiverRunSpeciesImage(choice.id) : null;
  const riverImage = step === 4 ? getRiverRunRiverImage(choice.id) : null;
  const disabled = choice.disabled === true;
  const icon = step === 1
    ? "map"
    : step === 2
    ? "leaf"
    : step === 4
    ? "water"
    : "fish";
  return (
    <Pressable
      style={({ pressed }) => [
        styles.choiceCard,
        step === 3 && styles.speciesChoiceCard,
        disabled && styles.choiceCardDisabled,
        selected && styles.choiceCardSelected,
        pressed && !disabled && { opacity: 0.88 },
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
    >
      {step === 1
        ? <StateChoiceIcon stateCode={choice.id} disabled={disabled} />
        : step === 2
        ? <SeasonChoiceIcon season={choice.id} disabled={disabled} />
        : speciesImage
        ? (
          <View style={styles.speciesChoiceImageStage}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlue}
              count={4}
            />
            <Image
              source={speciesImage}
              style={[
                styles.speciesChoiceImage,
                (choice.id === "steelhead" ||
                  choice.id === "lake_run_brown_trout" ||
                  choice.id === "atlantic_salmon") &&
                styles.speciesChoiceImageSteelhead,
                disabled && styles.choiceImageDisabled,
              ]}
              resizeMode="contain"
            />
          </View>
        )
        : riverImage
        ? (
          <View style={styles.riverChoiceImageStage}>
            <Image
              source={riverImage}
              style={[
                styles.riverChoiceImage,
                disabled && styles.choiceImageDisabled,
              ]}
              resizeMode="contain"
            />
          </View>
        )
        : step === 3
        ? (
          <View style={styles.speciesChoiceImageStage}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlue}
              count={4}
            />
            <Ionicons name="fish" size={24} color={paper.dashboardMuted} />
          </View>
        )
        : (
          <View
            style={[
              styles.choiceIcon,
              disabled && styles.choiceIconDisabled,
              selected && styles.choiceIconSelected,
            ]}
          >
            <Ionicons
              name={icon}
              size={22}
              color={disabled
                ? paper.dashboardMuted
                : selected
                ? paper.redDk
                : paper.dashboardBlue}
            />
          </View>
        )}
      <View
        style={[
          styles.choiceCopy,
          step === 3 && styles.speciesChoiceCopy,
        ]}
      >
        <Text
          style={[styles.choiceTitle, disabled && styles.choiceTextDisabled]}
          numberOfLines={1}
        >
          {choice.label}
        </Text>
        {choice.subtitle
          ? (
            <Text
              style={[
                styles.choiceSubtitle,
                disabled && styles.choiceSubtitleDisabled,
              ]}
            >
              {choice.subtitle}
            </Text>
          )
          : null}
      </View>
      <View
        style={[
          styles.choiceCheck,
          step === 3 && styles.speciesChoiceCheck,
          disabled && styles.choiceCheckDisabled,
          selected && styles.choiceCheckSelected,
        ]}
      >
        {selected
          ? <Ionicons name="checkmark" size={15} color="#FFFFFF" />
          : null}
      </View>
    </Pressable>
  );
}

function ResultHero({
  season,
  species,
  snapshot,
  readDate,
}: {
  season: RiverRunSeason;
  species: string;
  snapshot?: RiverRunSnapshotResponse | null;
  readDate: string;
}) {
  const speciesImage = getRiverRunSpeciesImage(species);
  const speciesHeroScale = getRiverRunSpeciesHeroScale(species);
  return (
    <View style={styles.resultHero}>
      <TopographicLines
        style={StyleSheet.absoluteFill}
        color={paper.dashboardBlue}
        count={7}
      />
      <CornerMarkSet color={paper.red} size={16} thickness={2} inset={11} />
      <SectionEyebrow color={paper.red} size={10.5}>
        {`${formatRiverRunSeason(season).toUpperCase()} MIGRATION`}
      </SectionEyebrow>
      <Text style={styles.resultHeroTitle} allowFontScaling={false}>
        {formatRiverRunSpecies(species).toUpperCase()}
      </Text>
      <Text style={styles.resultHeroSubtitle}>
        Today&apos;s read of migration stage, activity, seasonal presence, and
        river conditions.
      </Text>
      {speciesImage
        ? (
          <View style={styles.resultFishStage}>
            <Image
              source={speciesImage}
              style={[
                styles.resultFishImage,
                { transform: [{ scale: speciesHeroScale }] },
              ]}
              resizeMode="contain"
            />
          </View>
        )
        : null}
      <View style={styles.resultHeroMeta}>
        <View style={styles.resultHeroMetaItem}>
          <Text style={styles.resultHeroMetaLabel}>READ DATE</Text>
          <Text style={styles.resultHeroMetaValue}>
            {formatLocalDate(readDate)}
          </Text>
        </View>
        <View style={styles.resultHeroMetaRule} />
        <View style={styles.resultHeroMetaItem}>
          <Text style={styles.resultHeroMetaLabel}>DATA</Text>
          <Text style={styles.resultHeroMetaValue}>
            {snapshot?.dataQuality.label ?? "Pending"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function unavailableRiverConditions(
  snapshot: RiverRunSnapshotResponse,
): RiverRunLiveConditions {
  return {
    riverId: snapshot.riverId,
    status: "unavailable",
    refreshedAt: snapshot.conditionRefreshAt,
    localDate: snapshot.localDate,
    refreshSlot: snapshot.refreshSlot,
    metrics: [],
    limitation: snapshot.safety.gaugeBasis,
    dataVersion: "river-live-conditions-missing-payload",
  };
}

function publicRiverRunTerminology(value: string): string {
  return value
    .replaceAll("Fishability", "Fishing Shape")
    .replaceAll("Fish In River", "Seasonal Presence");
}

const FISHING_SHAPE_METER = [
  { label: "Poor", color: "#D94B3A" },
  { label: "Tough", color: "#E89647" },
  { label: "Fishable", color: "#E8C547" },
  { label: "Good", color: "#7CC36A" },
  { label: "Excellent", color: "#3DA85F" },
] as const;

function FishingShapeMeter({ label }: { label: string }) {
  const selectedIndex = FISHING_SHAPE_METER.findIndex((stop) =>
    stop.label.toLowerCase() === label.trim().toLowerCase()
  );
  return (
    <View
      style={styles.fishingShapeMeter}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Fishing Shape: ${label}. Scale from Poor to Excellent.`}
      accessibilityValue={{
        min: 1,
        max: FISHING_SHAPE_METER.length,
        now: selectedIndex >= 0 ? selectedIndex + 1 : undefined,
        text: label,
      }}
    >
      <View style={styles.fishingShapeMeterTrack}>
        {FISHING_SHAPE_METER.map((stop, index) => {
          const selected = index === selectedIndex;
          return (
            <View
              key={stop.label}
              style={[
                styles.fishingShapeMeterSegment,
                { backgroundColor: stop.color },
                selected && styles.fishingShapeMeterSegmentSelected,
              ]}
            >
              {selected
                ? <View style={styles.fishingShapeMeterMarker} />
                : null}
            </View>
          );
        })}
      </View>
      <View style={styles.fishingShapeMeterLabels}>
        <Text style={styles.fishingShapeMeterLabel}>POOR</Text>
        <Text style={styles.fishingShapeMeterLabel}>EXCELLENT</Text>
      </View>
    </View>
  );
}

function LiveRiverConditionsCard({ conditions, fishingShape }: {
  conditions: RiverRunLiveConditions;
  fishingShape?: RiverRunSnapshotResponse["fishability"];
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { width, fontScale } = useWindowDimensions();
  const metricColumns = fontScale >= 1.25 ? 1 : width >= 380 ? 3 : 2;
  const hasMeasurements = conditions.metrics.some((metric) =>
    metric.value != null
  );
  const readableMetrics = conditions.metrics.filter((metric) =>
    metric.value != null
  );
  const displayStatus = conditions.metrics.length > 0 && !hasMeasurements
    ? "unreadable"
    : conditions.status === "partial"
    ? "partial"
    : readableMetrics.some((metric) => metric.freshness !== "fresh")
    ? "delayed"
    : "current";
  const orderedMetrics = [...conditions.metrics].sort((left, right) => {
    const priority: Record<RiverRunLiveConditionMetric["metric"], number> = {
      flow_cfs: 0,
      water_temp_f: 1,
      gage_height_ft: 2,
    };
    return priority[left.metric] - priority[right.metric];
  });
  return (
    <View
      style={styles.liveConditionsCard}
      accessible={false}
      testID="river-live-conditions"
    >
      <View style={styles.liveConditionsHeader}>
        <View style={styles.liveConditionsIcon}>
          <Ionicons
            name="analytics-outline"
            size={18}
            color={paper.dashboardBlue}
          />
        </View>
        <View style={styles.liveConditionsHeadingCopy}>
          <Text style={styles.liveConditionsEyebrow}>
            LIVE RIVER CONDITIONS
          </Text>
          <Text style={styles.liveConditionsTitle}>Gauge Read</Text>
          <Text
            style={styles.liveConditionsSubtitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.88}
          >
            Real provider readings · observation age shown.
          </Text>
        </View>
        <View
          style={[
            styles.liveConditionsStatus,
            displayStatus === "current"
              ? styles.liveConditionsStatusAvailable
              : displayStatus === "partial" || displayStatus === "delayed"
              ? styles.liveConditionsStatusPartial
              : styles.liveConditionsStatusUnavailable,
          ]}
        >
          <Text style={styles.liveConditionsStatusText}>
            {displayStatus === "current"
              ? "CURRENT"
              : displayStatus === "partial"
              ? "PARTIAL"
              : displayStatus === "delayed"
              ? "DELAYED"
              : "UNREADABLE"}
          </Text>
        </View>
      </View>

      {hasMeasurements || conditions.metrics.length > 0
        ? (
          <View style={styles.liveMetricGrid}>
            {orderedMetrics.map((metric) => (
              <LiveMetricTile
                key={metric.sourceId + ":" + metric.metric}
                metric={metric}
                columns={metricColumns}
              />
            ))}
          </View>
        )
        : (
          <View
            style={styles.liveConditionsEmpty}
            accessible
            accessibilityRole="text"
            accessibilityLabel="Live river measurements unavailable. No accepted gauge or water temperature sensor currently represents this river."
          >
            <Ionicons
              name="cloud-offline-outline"
              size={22}
              color={paper.dashboardMuted}
            />
            <View style={styles.liveConditionsEmptyCopy}>
              <Text style={styles.liveConditionsEmptyTitle}>
                Live river measurements unavailable
              </Text>
              <Text style={styles.liveConditionsEmptyBody}>
                No accepted gauge or water-temperature sensor currently
                represents this river. Modeled weather is not substituted.
              </Text>
            </View>
          </View>
        )}

      {fishingShape?.score != null
        ? (
          <View style={styles.fishingShapeSummary}>
            <View style={styles.fishingShapeIdentity}>
              <Ionicons name="water-outline" size={17} color="#167B78" />
              <View style={styles.fishingShapeCopy}>
                <Text style={styles.fishingShapeEyebrow}>FISHING SHAPE</Text>
                <Text style={styles.fishingShapeLabel}>
                  {fishingShape.label}
                </Text>
              </View>
            </View>
            <FishingShapeMeter label={fishingShape.label} />
          </View>
        )
        : null}

      <Pressable
        style={({ pressed }) => [
          styles.liveConditionsDetailsButton,
          pressed && { opacity: 0.78 },
        ]}
        onPress={() => {
          hapticSelection();
          setDetailsOpen((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded: detailsOpen }}
        accessibilityLabel={"Station and data details. " +
          (detailsOpen ? "Collapse." : "Expand.")}
      >
        <View style={styles.liveConditionsDetailsButtonCopy}>
          <Ionicons
            name="location-outline"
            size={15}
            color={paper.dashboardBlue}
          />
          <Text style={styles.liveConditionsDetailsButtonText}>
            SOURCES & DATA AGE
          </Text>
        </View>
        <Ionicons
          name={detailsOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={paper.dashboardBlue}
        />
      </Pressable>

      {detailsOpen
        ? (
          <View style={styles.liveConditionsDetails}>
            {orderedMetrics.map((metric) => (
              <View
                key={"details:" + metric.sourceId + ":" + metric.metric}
                style={styles.liveConditionsDetailSection}
              >
                <View style={styles.liveConditionsDetailHeading}>
                  <View
                    style={[
                      styles.liveConditionsDetailMetricIcon,
                      {
                        backgroundColor: liveMetricVisual(metric.metric).tint,
                      },
                    ]}
                  >
                    <Ionicons
                      name={liveMetricVisual(metric.metric).icon}
                      size={13}
                      color={liveMetricVisual(metric.metric).accent}
                    />
                  </View>
                  <View style={styles.liveConditionsDetailIdentity}>
                    <Text style={styles.liveConditionsDetailLabel}>
                      {metric.label.toUpperCase()} ·{" "}
                      {liveMetricProviderLabel(metric.provider)}
                    </Text>
                  </View>
                  <View style={styles.liveConditionsDetailFreshnessBadge}>
                    <View
                      style={[
                        styles.liveConditionsDetailFreshnessDot,
                        {
                          backgroundColor: liveMetricFreshnessColor(
                            metric.freshness,
                          ),
                        },
                      ]}
                    />
                    <Text style={styles.liveConditionsDetailFreshnessText}>
                      {liveMetricFreshnessLabel(metric.freshness)}
                    </Text>
                  </View>
                </View>
                <Text
                  style={styles.liveConditionsDetailStation}
                  numberOfLines={2}
                >
                  {metric.stationName}
                </Text>
                <View style={styles.liveConditionsDetailFacts}>
                  <View style={styles.liveConditionsDetailFact}>
                    <Ionicons
                      name="time-outline"
                      size={13}
                      color={paper.dashboardMuted}
                    />
                    <Text style={styles.liveConditionsDetailMeta}>
                      {liveMetricFreshnessCopy(metric)}
                    </Text>
                  </View>
                  <View style={styles.liveConditionsDetailFact}>
                    <Ionicons
                      name="calendar-outline"
                      size={13}
                      color={paper.dashboardMuted}
                    />
                    <Text style={styles.liveConditionsDetailMeta}>
                      {liveMetricBaselineCopy(metric)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.liveConditionsAttribution}>
                  {metric.attribution}
                </Text>
              </View>
            ))}
            <View style={styles.liveConditionsLimitation}>
              <Text style={styles.liveConditionsDetailLabel}>
                WHAT THIS GAUGE REPRESENTS
              </Text>
              <Text style={styles.liveConditionsDetailBody}>
                {publicRiverRunTerminology(conditions.limitation)}
              </Text>
            </View>
            <Text style={styles.liveConditionsMethodNote}>
              {orderedMetrics.some(isHistoricalOnlyMetric)
                ? "Flow typical ranges use the same calendar date ±3 days. Historical-only water temperature shows its labeled archival calendar window and qualifying-year count; it is not today's temperature. Provider readings may be revised."
                : "Typical ranges and medians use approved observations from the same calendar date ±3 days across prior years. Provider readings may be revised."}
            </Text>
          </View>
        )
        : null}
    </View>
  );
}

const RIVER_ACCESS_KIND_LABELS: Record<RiverAccessKind, string> = {
  shore_fishing: "SHORE",
  wade_access: "WADE",
  fishing_platform: "PLATFORM",
  boat_ramp: "RAMP",
  carry_in: "CARRY-IN",
  walk_in: "WALK-IN",
};

function SpotFinderCard({
  finder,
  runStage,
  seasonalZone,
}: {
  finder: RiverSpotFinder;
  runStage?: RiverRunSnapshotResponse["runStage"];
  seasonalZone?: RiverRunSnapshotResponse["seasonalZone"];
}) {
  const [open, setOpen] = useState(false);
  const recommendation = useMemo(
    () => resolveRiverSpotFinderRecommendedSections(finder, seasonalZone),
    [finder, seasonalZone],
  );
  const recommendationSignature = recommendation.recommendedSections
    .map((section) => section.id)
    .join(":");
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);
  const [expandedSpotIds, setExpandedSpotIds] = useState<string[]>([]);
  const [orientationOpen, setOrientationOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const spotCount = finder.sections.reduce(
    (total, section) => total + section.spots.length,
    0,
  );
  const safetyLink = finder.safetyLink ?? {
    label: "CHECK CURRENT DNR CLOSURES →",
    url: RIVER_ACCESS_CLOSURES_URL,
  };

  useEffect(() => {
    setExpandedSectionIds([]);
    setExpandedSpotIds([]);
  }, [recommendationSignature]);

  const openExternalUrl = useCallback((url: string, errorCopy: string) => {
    void Linking.openURL(url).catch(() => {
      Alert.alert("Unable to open link", errorCopy);
    });
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    hapticSelection();
    setExpandedSectionIds((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId]
    );
  }, []);

  const toggleSpot = useCallback((spotId: string) => {
    hapticSelection();
    setExpandedSpotIds((current) =>
      current.includes(spotId)
        ? current.filter((id) => id !== spotId)
        : [...current, spotId]
    );
  }, []);

  const renderSection = (
    section: RiverAccessSection,
    recommended: boolean,
  ) => {
    const sectionOpen = expandedSectionIds.includes(section.id);
    const sectionLabel = riverAccessSectionLabel(section.position);
    return (
      <View
        key={section.id}
        style={[
          styles.spotFinderSection,
          recommended && styles.spotFinderSectionRecommended,
          sectionOpen && styles.spotFinderSectionOpen,
          recommended && sectionOpen && styles.spotFinderSectionRecommendedOpen,
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.spotFinderSectionToggle,
            pressed && { opacity: 0.78 },
          ]}
          onPress={() => toggleSection(section.id)}
          accessibilityRole="button"
          accessibilityState={{ expanded: sectionOpen }}
          accessibilityLabel={`${sectionLabel}. ${section.rangeLabel}. ${section.spots.length} source-listed access ${
            section.spots.length === 1 ? "name" : "names"
          }. ${
            recommended ? "Recommended section for this migration stage. " : ""
          }${sectionOpen ? "Collapse" : "Expand"}.`}
        >
          <View style={styles.spotFinderSectionCopy}>
            {recommended
              ? (
                <View style={styles.spotFinderRecommendedBadge}>
                  <Ionicons name="checkmark" size={9} color="#FFFFFF" />
                  <Text style={styles.spotFinderRecommendedLabel}>
                    RECOMMENDED
                  </Text>
                </View>
              )
              : null}
            <Text style={styles.spotFinderSectionLabel}>
              {sectionLabel}
            </Text>
            <Text style={styles.spotFinderSectionRange}>
              {section.rangeLabel}
            </Text>
          </View>
          <View
            style={[
              styles.spotFinderSectionCountBadge,
              recommended && styles.spotFinderSectionCountBadgeRecommended,
            ]}
          >
            <Text
              style={[
                styles.spotFinderSectionCount,
                recommended && styles.spotFinderSectionCountRecommended,
              ]}
            >
              {section.spots.length}{" "}
              {section.spots.length === 1 ? "ACCESS POINT" : "ACCESS POINTS"}
            </Text>
          </View>
          <Ionicons
            name={sectionOpen ? "chevron-up" : "chevron-down"}
            size={17}
            color={recommended ? "#167B78" : paper.dashboardBlue}
          />
        </Pressable>

        {sectionOpen
          ? (
            <View style={styles.spotFinderAccessList}>
              {section.spots.map((spot) => {
                const spotKey = `${section.id}:${spot.id}`;
                const spotOpen = expandedSpotIds.includes(spotKey);
                return (
                  <View key={spotKey} style={styles.spotFinderAccessRow}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.spotFinderAccessToggle,
                        pressed && { opacity: 0.76 },
                      ]}
                      onPress={() => toggleSpot(spotKey)}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: spotOpen }}
                      accessibilityLabel={`${spot.name}. ${
                        spot.accessKinds.map((kind) =>
                          RIVER_ACCESS_KIND_LABELS[kind]
                        ).join(", ")
                      }. ${spot.caution ? "Important access note. " : ""}${
                        spotOpen ? "Collapse details" : "Expand details"
                      }.`}
                    >
                      <View style={styles.spotFinderAccessIdentity}>
                        <Text style={styles.spotFinderSpotName}>
                          {spot.name}
                        </Text>
                        <View style={styles.spotFinderKinds}>
                          {spot.accessKinds.map((kind) => (
                            <Text key={kind} style={styles.spotFinderKindText}>
                              {RIVER_ACCESS_KIND_LABELS[kind]}
                            </Text>
                          ))}
                        </View>
                      </View>
                      {spot.caution
                        ? (
                          <Ionicons
                            name="warning-outline"
                            size={16}
                            color="#A65A2E"
                          />
                        )
                        : null}
                      <Ionicons
                        name={spotOpen ? "chevron-up" : "chevron-forward"}
                        size={16}
                        color={paper.dashboardMuted}
                      />
                    </Pressable>

                    {spotOpen
                      ? (
                        <View style={styles.spotFinderAccessDetail}>
                          <Text style={styles.spotFinderSpotDetail}>
                            {spot.detail}
                          </Text>
                          {spot.caution
                            ? (
                              <View style={styles.spotFinderCaution}>
                                <Ionicons
                                  name="warning-outline"
                                  size={14}
                                  color="#A65A2E"
                                />
                                <Text style={styles.spotFinderCautionText}>
                                  {spot.caution}
                                </Text>
                              </View>
                            )
                            : null}
                          <Pressable
                            style={({ pressed }) => [
                              styles.spotFinderSource,
                              pressed && { opacity: 0.72 },
                            ]}
                            onPress={() => {
                              hapticSelection();
                              openExternalUrl(
                                spot.sourceUrl,
                                "The access source could not be opened.",
                              );
                            }}
                            accessibilityRole="link"
                            accessibilityLabel={`Open official location source for ${spot.name}`}
                          >
                            <Text style={styles.spotFinderSourceText}>
                              VIEW OFFICIAL SOURCE
                            </Text>
                            <Ionicons
                              name="open-outline"
                              size={14}
                              color={paper.dashboardBlue}
                            />
                          </Pressable>
                          <View style={styles.spotFinderSourceDetails}>
                            <Text style={styles.spotFinderSourceLocator}>
                              {spot.sourceLocator}
                            </Text>
                            <Text style={styles.spotFinderSourceIdentity}>
                              {spot.sourceLabel} · checked {spot.verifiedOn}
                            </Text>
                          </View>
                        </View>
                      )
                      : null}
                  </View>
                );
              })}
            </View>
          )
          : null}
      </View>
    );
  };

  return (
    <View
      style={styles.spotFinderCard}
      testID="river-spot-finder"
      accessible={false}
    >
      <Pressable
        style={({ pressed }) => [
          styles.spotFinderToggle,
          pressed && { opacity: 0.82 },
        ]}
        onPress={() => {
          hapticSelection();
          setExpandedSectionIds([]);
          setExpandedSpotIds([]);
          setOrientationOpen(false);
          setSafetyOpen(false);
          setOpen((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Spot Finder. Recommended river sections and public access for ${finder.riverName}. ${spotCount} source-listed access names. ${
          open ? "Collapse" : "Expand"
        }.`}
      >
        <View style={styles.spotFinderHeaderIcon}>
          <Ionicons name="map-outline" size={20} color="#167B78" />
        </View>
        <View style={styles.spotFinderHeaderCopy}>
          <Text style={styles.spotFinderTitle}>Spot Finder</Text>
          <Text style={styles.spotFinderSubtitle}>
            Recommended run sections and public access
          </Text>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={19}
          color="#167B78"
        />
      </Pressable>

      {open
        ? (
          <View style={styles.spotFinderContent}>
            {seasonalZone?.earlyApproach
              ? (
                <View style={styles.spotFinderEarlyApproach}>
                  <View style={styles.spotFinderEarlyApproachHeading}>
                    <Ionicons
                      name="compass-outline"
                      size={16}
                      color="#0F63B0"
                    />
                    <Text style={styles.spotFinderEarlyApproachLabel}>
                      EARLY-SEASON DIRECTION
                    </Text>
                  </View>
                  <Text style={styles.spotFinderEarlyApproachTitle}>
                    {seasonalZone.earlyApproach.label}
                  </Text>
                  <Text style={styles.spotFinderEarlyApproachText}>
                    {seasonalZone.earlyApproach.phase === "before_migration"
                      ? "A broad area to consider before dependable in-river migration—not a verified access point or live fish-location report. Check separate lake, harbor, marine, or boundary-water rules before fishing."
                      : recommendation.hasRecommendation
                      ? "Consider this broad approach area with the highlighted audited in-river section below. It is calendar-based direction, not a live fish-location report."
                      : "Consider this broad approach area during the opening phase. No verified public fishing access overlaps the active starting reach, so no specific access is being recommended here."}
                  </Text>
                </View>
              )
              : null}
            {recommendation.hasRecommendation
              ? (
                <View style={styles.spotFinderRecommendationIntro}>
                  <View style={styles.spotFinderRecommendationIntroHeading}>
                    <Ionicons name="leaf-outline" size={16} color="#167B78" />
                    <Text style={styles.spotFinderRecommendationIntroLabel}>
                      RECOMMENDED{" "}
                      {recommendation.recommendedSections.length === 1
                        ? "SECTION"
                        : "SECTIONS"}
                    </Text>
                  </View>
                  <Text style={styles.spotFinderRecommendationIntroTitle}>
                    Current phase: {runStage?.label}
                  </Text>
                  <Text style={styles.spotFinderRecommendationIntroText}>
                    Broad starting areas—not a live fish-location report.
                  </Text>
                </View>
              )
              : (
                <View style={styles.spotFinderNoRecommendation}>
                  <Text style={styles.spotFinderNoRecommendationLabel}>
                    {seasonalZone?.earlyApproach
                      ? "NO IN-RIVER SECTION RECOMMENDATION"
                      : "NO RUN-BASED RECOMMENDATION"}
                  </Text>
                  <Text style={styles.spotFinderNoRecommendationText}>
                    {seasonalZone?.earlyApproach?.phase === "before_migration"
                      ? "Use the early-season direction above. Dependable in-river migration is not active, so the accesses below are not highlighted as run-based starting sections."
                      : seasonalZone?.status === "active"
                      ? "No audited public-access section overlaps this phase's river reach. Browse supported-corridor access below without treating it as a run-based recommendation."
                      : "The migration is not in an active river stage. Browse supported-corridor access below."}
                  </Text>
                </View>
              )}

            {recommendation.hasRecommendation
              ? (
                <View
                  style={[
                    styles.spotFinderSectionGroup,
                    styles.spotFinderRecommendedSectionGroup,
                  ]}
                >
                  {recommendation.recommendedSections.map((section) =>
                    renderSection(section, true)
                  )}
                </View>
              )
              : (
                <View
                  style={[
                    styles.spotFinderSectionGroup,
                    styles.spotFinderOtherSectionGroup,
                  ]}
                >
                  <Text style={styles.spotFinderGroupLabel}>
                    ALL RIVER ACCESS
                  </Text>
                  {recommendation.otherSections.map((section) =>
                    renderSection(section, false)
                  )}
                </View>
              )}

            {recommendation.hasRecommendation &&
                recommendation.otherSections.length > 0
              ? (
                <View
                  style={[
                    styles.spotFinderSectionGroup,
                    styles.spotFinderOtherSectionGroup,
                  ]}
                >
                  <Text style={styles.spotFinderGroupLabel}>
                    OTHER RIVER ACCESS
                  </Text>
                  {recommendation.otherSections.map((section) =>
                    renderSection(section, false)
                  )}
                </View>
              )
              : null}

            <View style={styles.spotFinderFooterGroup}>
              <Pressable
                style={styles.spotFinderFooterToggle}
                onPress={() => {
                  hapticSelection();
                  setOrientationOpen((current) => !current);
                }}
                accessibilityRole="button"
                accessibilityState={{ expanded: orientationOpen }}
              >
                <Text style={styles.spotFinderFooterTitle}>
                  ABOUT THESE SECTIONS
                </Text>
                <Ionicons
                  name={orientationOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={paper.dashboardBlue}
                />
              </Pressable>
              {orientationOpen
                ? (
                  <Text style={styles.spotFinderFooterText}>
                    Sections describe the supported migration corridor, not the
                    entire river. {finder.orientationNote}
                  </Text>
                )
                : null}
            </View>

            <View style={styles.spotFinderSafety}>
              <Pressable
                style={styles.spotFinderFooterToggle}
                onPress={() => {
                  hapticSelection();
                  setSafetyOpen((current) => !current);
                }}
                accessibilityRole="button"
                accessibilityState={{ expanded: safetyOpen }}
              >
                <View style={styles.spotFinderSafetyHeading}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={16}
                    color="#A65A2E"
                  />
                  <Text style={styles.spotFinderSafetyTitle}>
                    BEFORE YOU GO
                  </Text>
                </View>
                <Ionicons
                  name={safetyOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#A65A2E"
                />
              </Pressable>
              {safetyOpen
                ? (
                  <View style={styles.spotFinderSafetyContent}>
                    <Text style={styles.spotFinderSafetyText}>
                      {RIVER_ACCESS_GENERAL_WARNING}
                    </Text>
                    <Pressable
                      onPress={() =>
                        openExternalUrl(
                          safetyLink.url,
                          "The current DNR safety information could not be opened.",
                        )}
                      accessibilityRole="link"
                      accessibilityLabel={safetyLink.label.replace(" →", "")}
                    >
                      <Text style={styles.spotFinderClosuresLink}>
                        {safetyLink.label}
                      </Text>
                    </Pressable>
                  </View>
                )
                : null}
            </View>
          </View>
        )
        : null}
    </View>
  );
}

function LiveMetricTile({
  metric,
  columns,
}: {
  metric: RiverRunLiveConditionMetric;
  columns: 1 | 2 | 3;
}) {
  const visual = liveMetricVisual(metric.metric);
  const freshness = `${liveMetricFreshnessLabel(metric.freshness)}. ${
    liveMetricFreshnessCopy(metric)
  }`;
  const trend = liveMetricTrendCopy(metric);
  const typicalRange = liveMetricTypicalRange(metric);
  const historicalAverage = metric.seasonalContext
    ? formatLiveMetricValue(metric, metric.seasonalContext.average)
    : null;
  const historicalOnly = isHistoricalOnlyMetric(metric);
  const accessibilityLabel = [
    metric.label,
    metric.value == null
      ? "Current reading unavailable"
      : formatLiveMetricValue(metric, metric.value),
    typicalRange
      ? "Typical range " + typicalRange
      : historicalAverage
      ? "Historical average " + historicalAverage
      : "Historical context unavailable",
    liveMetricDetailedTrendCopy(metric),
    metric.seasonalContext?.comparisonLabel,
    freshness,
  ].filter(Boolean).join(". ");
  return (
    <View
      style={[
        styles.liveMetricTile,
        columns === 3
          ? styles.liveMetricTileThree
          : columns === 2
          ? styles.liveMetricTileTwo
          : styles.liveMetricTileSingle,
        { borderTopColor: visual.accent },
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.liveMetricHeading}>
        <View style={[styles.liveMetricIcon, { backgroundColor: visual.tint }]}>
          <Ionicons name={visual.icon} size={14} color={visual.accent} />
        </View>
        <Text
          style={styles.liveMetricLabel}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          {liveMetricShortLabel(metric.metric)}
        </Text>
      </View>
      {historicalOnly
        ? (
          <Text
            style={styles.liveMetricValue}
            allowFontScaling={false}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {historicalAverage ?? "—"}
          </Text>
        )
        : metric.value == null
        ? (
          <Text
            style={styles.liveMetricUnavailable}
            allowFontScaling={false}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
          >
            Unreadable
          </Text>
        )
        : (
          <Text
            style={styles.liveMetricValue}
            allowFontScaling={false}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {formatLiveMetricValue(metric, metric.value)}
          </Text>
        )}
      <Text
        style={styles.liveMetricAverage}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {historicalOnly
          ? "HISTORICAL DATE AVG"
          : `Typical · ${typicalRange ?? "Unavailable"}`}
      </Text>
      {historicalOnly
        ? (
          <View
            style={[
              styles.liveMetricComparisonPill,
              { backgroundColor: visual.tint },
            ]}
          >
            <Text
              style={[styles.liveMetricComparison, { color: visual.accent }]}
              numberOfLines={1}
            >
              NO LIVE SENSOR
            </Text>
          </View>
        )
        : metric.seasonalContext
        ? (
          <View
            style={[
              styles.liveMetricComparisonPill,
              { backgroundColor: visual.tint },
            ]}
          >
            <Text
              style={[styles.liveMetricComparison, { color: visual.accent }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.76}
            >
              {liveMetricCompactComparison(
                metric.seasonalContext.comparisonLabel,
              )}
            </Text>
          </View>
        )
        : (
          <View style={styles.liveMetricComparisonUnavailablePill}>
            <Text style={styles.liveMetricComparisonUnavailable}>
              NO CONTEXT
            </Text>
          </View>
        )}
      <View style={styles.liveMetricTrendRow}>
        <Text style={styles.liveMetricTrendLabel}>
          {historicalOnly ? "ARCHIVE" : "24H"}
        </Text>
        <Text
          style={styles.liveMetricTrend}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
        >
          {historicalOnly ? "No 24H trend" : trend}
        </Text>
      </View>
    </View>
  );
}

function liveMetricShortLabel(
  metric: RiverRunLiveConditionMetric["metric"],
): string {
  if (metric === "flow_cfs") return "FLOW";
  if (metric === "water_temp_f") return "WATER TEMP";
  return "GAUGE HEIGHT";
}

function liveMetricProviderLabel(
  provider: RiverRunLiveConditionMetric["provider"],
): string {
  if (provider === "USGS") return "USGS";
  if (provider === "WA_ECOLOGY") return "Washington Ecology";
  return "Monitor My Watershed";
}

function liveMetricCompactComparison(label?: string): string {
  if (!label) return "DATE CONTEXT";
  const normalized = label.toLowerCase();
  if (normalized.includes("much colder")) return "MUCH COLDER";
  if (normalized.includes("colder")) return "COLDER";
  if (normalized.includes("much warmer")) return "MUCH WARMER";
  if (normalized.includes("warmer")) return "WARMER";
  if (normalized.includes("much below")) return "MUCH LOWER";
  if (normalized.includes("below")) return "LOWER";
  if (normalized.includes("much above")) return "MUCH HIGHER";
  if (normalized.includes("above")) return "HIGHER";
  if (normalized.includes("near") || normalized === "normal") return "NORMAL";
  return label.toUpperCase();
}

function liveMetricVisual(metric: RiverRunLiveConditionMetric["metric"]): {
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  tint: string;
} {
  if (metric === "water_temp_f") {
    return {
      icon: "thermometer-outline",
      accent: "#A85220",
      tint: "#FFF0E6",
    };
  }
  if (metric === "gage_height_ft") {
    return { icon: "resize-outline", accent: "#236B63", tint: "#E8F5F2" };
  }
  return {
    icon: "water-outline",
    accent: paper.dashboardBlue,
    tint: "#EAF2F7",
  };
}

function formatLiveMetricValue(
  metric: RiverRunLiveConditionMetric,
  value: number,
): string {
  if (metric.metric === "flow_cfs") {
    return Math.round(value).toLocaleString("en-US") + " CFS";
  }
  if (metric.metric === "gage_height_ft") return value.toFixed(2) + " ft";
  return value.toFixed(1) + "°F";
}

function liveMetricTrendCopy(metric: RiverRunLiveConditionMetric): string {
  const delta = metric.trend24h.delta;
  if (delta == null) return "24-hour trend unavailable";
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  const absolute = Math.abs(delta);
  const formatted = metric.metric === "flow_cfs"
    ? sign + Math.round(absolute).toLocaleString("en-US") + " CFS"
    : metric.metric === "gage_height_ft"
    ? sign + absolute.toFixed(2) + " ft"
    : sign + absolute.toFixed(1) + "°F";
  const direction = metric.trend24h.direction;
  return formatted + " · " +
    direction.charAt(0).toUpperCase() + direction.slice(1);
}

function liveMetricDetailedTrendCopy(
  metric: RiverRunLiveConditionMetric,
): string {
  const trend = liveMetricTrendCopy(metric);
  const percent = metric.metric === "flow_cfs" &&
      metric.trend24h.percentDelta != null
    ? ` · ${metric.trend24h.percentDelta >= 0 ? "+" : "−"}${
      Math.abs(metric.trend24h.percentDelta).toFixed(1)
    }%`
    : "";
  return `24-hour change · ${trend}${percent}`;
}

function liveMetricFreshnessLabel(
  freshness: RiverRunLiveConditionMetric["freshness"],
): string {
  if (freshness === "fresh") return "CURRENT";
  if (freshness === "delayed") return "DELAYED";
  if (freshness === "older_than_24h") return "STALE";
  return "UNREADABLE";
}

function isHistoricalOnlyMetric(metric: RiverRunLiveConditionMetric): boolean {
  return metric.metric === "water_temp_f" &&
    metric.value == null &&
    metric.seasonalContext?.source.endsWith("_archive") === true;
}

function liveMetricFreshnessColor(
  freshness: RiverRunLiveConditionMetric["freshness"],
): string {
  if (freshness === "fresh") return "#207B53";
  if (freshness === "delayed") return "#C49A24";
  return paper.dashboardMuted;
}

function liveMetricBaselineCopy(metric: RiverRunLiveConditionMetric): string {
  const context = metric.seasonalContext;
  if (!context) return "Historical context unavailable";
  if (isHistoricalOnlyMetric(metric)) {
    return context.windowRadiusDays === 0
      ? `${context.historicalYears}-year exact-date average · ${
        formatMonthDay(context.windowStartMonthDay)
      }`
      : `${context.historicalYears}-year historical ±${context.windowRadiusDays}-day average · ${
        formatMonthDay(context.windowStartMonthDay)
      }–${formatMonthDay(context.windowEndMonthDay)}`;
  }
  const median = formatLiveMetricValue(metric, context.median);
  const era = context.recordKind === "recent" ? "recent-era" : "historical";
  return `${context.historicalYears}-year ${era} typical range · median ${median} · ${
    formatMonthDay(context.windowStartMonthDay)
  }–${formatMonthDay(context.windowEndMonthDay)}`;
}

function liveMetricTypicalRange(
  metric: RiverRunLiveConditionMetric,
): string | null {
  const context = metric.seasonalContext;
  if (!context || isHistoricalOnlyMetric(metric)) return null;
  if (metric.metric === "flow_cfs") {
    return `${Math.round(context.p25).toLocaleString("en-US")}–${
      Math.round(context.p75).toLocaleString("en-US")
    } CFS`;
  }
  if (metric.metric === "gage_height_ft") {
    return `${context.p25.toFixed(2)}–${context.p75.toFixed(2)} ft`;
  }
  return `${context.p25.toFixed(1)}–${context.p75.toFixed(1)}°F`;
}

function liveMetricFreshnessCopy(
  metric: RiverRunLiveConditionMetric,
): string {
  if (isHistoricalOnlyMetric(metric)) {
    return "Current measured reading unavailable; historical date context only";
  }
  if (!metric.observedAt || metric.freshness === "missing") {
    return "Provider reading currently unreadable";
  }
  const ageMinutes = Math.max(
    0,
    Math.floor((Date.now() - Date.parse(metric.observedAt)) / 60000),
  );
  const observed = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(metric.observedAt));
  const age = metric.freshness === "older_than_24h"
    ? `Last readable ${observed}`
    : ageMinutes < 1
    ? "Updated just now"
    : ageMinutes < 60
    ? "Updated " + ageMinutes + "m ago"
    : ageMinutes < 24 * 60
    ? "Updated " + Math.floor(ageMinutes / 60) + "h ago"
    : "Updated " + observed;
  const withObservedTime = metric.freshness === "older_than_24h" ||
      ageMinutes >= 24 * 60
    ? age
    : `${age} · ${observed}`;
  const provisional = metric.approvalStatus?.toLowerCase().includes(
      "provisional",
    )
    ? " · Provisional"
    : "";
  return withObservedTime + provisional;
}

function formatMonthDay(monthDay: string): string {
  const [month, day] = monthDay.split("-").map(Number);
  if (!month || !day) return monthDay;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2024, month - 1, day)));
}

function PrimitiveTabBar({
  snapshot,
  activeTab,
  onChange,
  onLayoutY,
}: {
  snapshot: RiverRunSnapshotResponse;
  activeTab: PrimitiveTabId;
  onChange: (tab: PrimitiveTabId) => void;
  onLayoutY: (value: number) => void;
}) {
  const activeIndex = PRIMITIVE_TABS.findIndex((tab) => tab.id === activeTab);
  return (
    <View
      style={styles.primitiveTabSticky}
      onLayout={(event) => onLayoutY(event.nativeEvent.layout.y)}
    >
      <View style={styles.primitiveTabShell}>
        <View style={styles.primitiveTabHeading}>
          <View style={styles.primitiveTabInstruction}>
            <Ionicons
              name="hand-left-outline"
              size={11}
              color="#FFFFFF"
            />
            <Text style={styles.primitiveTabEyebrow}>
              TAP A READ TO OPEN
            </Text>
          </View>
          <Text style={styles.primitiveTabPosition}>
            {String(activeIndex + 1).padStart(2, "0")} / 03
          </Text>
        </View>
        <View style={styles.primitiveTabRow}>
          {PRIMITIVE_TABS.map((tab) => {
            const primitive = primitiveForTab(snapshot, tab.id);
            const visual = resolveRiverRunVisualModel({
              kind: tab.id,
              primitive,
            });
            const active = tab.id === activeTab;
            const status = formatRiverRunTabStatus(tab.id, primitive);
            return (
              <Pressable
                key={tab.id}
                style={({ pressed }) => [
                  styles.primitiveTab,
                  active && styles.primitiveTabActive,
                  active && { borderColor: visual.accent },
                  pressed && styles.primitiveTabPressed,
                ]}
                onPress={() => {
                  if (active) return;
                  hapticSelection();
                  onChange(tab.id);
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${tab.cardTitle}: ${status}`}
              >
                <View
                  style={[
                    styles.primitiveTabIcon,
                    {
                      borderColor: `${visual.accent}${active ? "88" : "55"}`,
                      backgroundColor: `${visual.accent}${
                        active ? "20" : "12"
                      }`,
                    },
                  ]}
                >
                  <Ionicons
                    name={tab.icon}
                    size={14}
                    color={active ? visual.accent : "#DCE5EA"}
                  />
                </View>
                <Text
                  style={[
                    styles.primitiveTabTitle,
                    active && styles.primitiveTabTitleActive,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {tab.tabTitle}
                </Text>
                <View style={styles.primitiveTabState}>
                  <View
                    style={[
                      styles.primitiveTabDot,
                      { backgroundColor: visual.accent },
                    ]}
                  />
                  <Text
                    style={[
                      styles.primitiveTabStateText,
                      active && { color: visual.accent },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.68}
                  >
                    {status}
                  </Text>
                  <Ionicons
                    name={active ? "checkmark" : "chevron-down"}
                    size={8}
                    color={active ? visual.accent : "rgba(255,255,255,0.68)"}
                  />
                </View>
                {active
                  ? (
                    <View
                      style={[
                        styles.primitiveTabIndicator,
                        { backgroundColor: visual.accent },
                      ]}
                    />
                  )
                  : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function SnapshotView({
  snapshot,
  activePrimitive,
  species,
}: {
  snapshot: RiverRunSnapshotResponse;
  activePrimitive: PrimitiveTabId;
  species: string;
}) {
  const tab = PRIMITIVE_TABS.find((item) => item.id === activePrimitive) ??
    PRIMITIVE_TABS[0];
  const primitive = primitiveForTab(snapshot, tab.id);
  return (
    <View style={styles.snapshotStack}>
      <ActivePrimitivePanel key={tab.id}>
        <PrimitiveSection
          index={tab.index}
          title={tab.cardTitle}
          visualKind={tab.id}
          primitive={primitive}
          contextContent={tab.id === "activity" && snapshot.activity
            ? <ActivityBreakdown activity={snapshot.activity} />
            : undefined}
        />
      </ActivePrimitivePanel>

      <GaugeForecastDropdown snapshot={snapshot} />

      <FishingMethodsDropdown species={species} />

      <View style={styles.safetyCard}>
        <View style={styles.safetyHeading}>
          <View style={styles.safetyIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={paper.redDk}
            />
          </View>
          <View style={styles.safetyHeadingCopy}>
            <Text style={styles.cardEyebrow}>SAFETY & RESPONSIBILITY</Text>
            <Text style={styles.safetyTitle}>Use the read as context.</Text>
          </View>
        </View>
        <Text style={styles.safetyBody}>
          {snapshot.safety.regulationReminder}
        </Text>
        <View style={styles.safetyRule} />
        <Text style={styles.safetySub}>
          {snapshot.safety.activityDisclaimer}
        </Text>
      </View>
    </View>
  );
}

function ActivePrimitivePanel({ children }: { children: ReactNode }) {
  const reduceMotion = useReduceMotionPreference();
  const entrance = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      entrance.setValue(1);
      return;
    }
    Animated.timing(entrance, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance, reduceMotion]);

  return (
    <Animated.View
      style={{
        opacity: entrance,
        transform: [{
          translateY: entrance.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        }],
      }}
    >
      {children}
    </Animated.View>
  );
}

function primitiveForTab(
  snapshot: RiverRunSnapshotResponse,
  tab: PrimitiveTabId,
): RiverRunPrimitiveDisplay {
  switch (tab) {
    case "run_stage":
      return snapshot.runStage;
    case "activity":
      if (snapshot.activity) return snapshot.activity;
      if (snapshot.runStage.label === "Fall entry complete") {
        return {
          score: null,
          label: "Fall entry complete",
          headline: "Steelhead fall-entry Activity is complete.",
          detail:
            "Steelhead may remain in the river. This fall-entry model no longer scores their current responsiveness.",
          tip:
            "Do not use this completed fall outlook to infer current activity. Check back in early September.",
        };
      }
      if (snapshot.runStage.label === "Fall run complete") {
        const checkpoint = fallReturnCheckpoint(snapshot.runId);
        return {
          score: null,
          label: "Fall run complete",
          headline: `${checkpoint.species} fall Activity is complete.`,
          detail:
            `${checkpoint.species} staging typically begins in ${checkpoint.window}. This Activity model is inactive until then.`,
          tip:
            `Check back in ${checkpoint.window} when ${checkpoint.species} fall monitoring resumes.`,
        };
      }
      return {
        score: null,
        label: "Not monitoring yet",
        headline: "Daily activity monitoring has not started yet.",
        detail:
          "Activity Outlook is configured for this migration and will begin during its seasonal staging window.",
        tip:
          "Check back as the migration approaches. Migration Stage will show when early staging and river entry become realistic.",
      };
    case "fish_in_river":
      return snapshot.fishInRiver;
  }
}

function fallReturnCheckpoint(runId: string): {
  species: string;
  window: string;
} {
  if (runId.includes("_coho")) {
    return { species: "Coho salmon", window: "late August" };
  }
  if (runId.includes("_steelhead")) {
    return { species: "Steelhead", window: "early September" };
  }
  return { species: "Chinook salmon", window: "late July" };
}

function ActivityBreakdown(
  { activity }: { activity: NonNullable<RiverRunSnapshotResponse["activity"]> },
) {
  const weatherOnly = activity.reasonCodes?.includes("activity_weather_only") ??
    false;
  const forecast = activity.targetDayLabel === "Tomorrow" ||
    activity.reasonCodes?.includes("activity_forecast") === true;
  const bestScore = Math.max(...activity.blocks.map((block) => block.score));
  const bestBlocks = activity.blocks.filter((block) =>
    block.score === bestScore
  );
  const bestBlock = bestBlocks[0];
  return (
    <View style={styles.activityBreakdown}>
      {forecast
        ? (
          <View
            style={styles.activityForecastNotice}
            accessible
            accessibilityRole="text"
            accessibilityLabel="Tomorrow forecast. Current river measurements are combined with forecast weather. This outlook updates after midnight and shortly after 4 AM."
          >
            <Ionicons name="calendar-outline" size={18} color="#1B4B68" />
            <View style={styles.activityForecastCopy}>
              <Text style={styles.activityForecastEyebrow}>
                TOMORROW · FORECAST
              </Text>
              <Text style={styles.activityForecastBody}>
                Current river measurements + forecast weather. Updates after
                midnight and shortly after 4 AM.
              </Text>
            </View>
          </View>
        )
        : null}
      {weatherOnly
        ? (
          <View
            style={styles.activityWeatherOnlyNotice}
            accessible
            accessibilityRole="text"
            accessibilityLabel="Limited for this river. Weather-only activity. No accepted measured river inputs represent this Activity reach. Verify water temperature, level, and clarity before fishing."
          >
            <View style={styles.activityWeatherOnlyIcon}>
              <Ionicons
                name="cloud-outline"
                size={15}
                color="#A85220"
              />
            </View>
            <View style={styles.activityWeatherOnlyCopy}>
              <Text style={styles.activityWeatherOnlyEyebrow}>
                WEATHER-ONLY ACTIVITY
              </Text>
              <Text style={styles.activityWeatherOnlyTitle}>
                Limited for this river
              </Text>
              <Text
                style={styles.activityWeatherOnlyBody}
                numberOfLines={3}
                adjustsFontSizeToFit
                minimumFontScale={0.9}
              >
                No accepted measured river inputs represent this Activity reach.
                Verify water temperature, level, and clarity before fishing.
              </Text>
            </View>
          </View>
        )
        : null}
      <View style={styles.activityMetaRow}>
        <Text style={styles.activityMeta}>
          {activity.targetDayLabel.toUpperCase()} ·{" "}
          {formatLocalDate(activity.targetDate)}
        </Text>
        <Text style={styles.activityMeta}>
          {weatherOnly
            ? "LIMITED · WEATHER ONLY"
            : `${activity.confidence.toUpperCase()} DATA`}
        </Text>
      </View>
      {activity.blocks.map((block) => {
        const status = block.status ?? "upcoming";
        return (
          <View
            key={block.id}
            style={[
              styles.activityBlock,
              status === "ended" && styles.activityBlockEnded,
              {
                borderColor: `${activityBlockColor(block.score)}66`,
                backgroundColor: `${activityBlockColor(block.score)}0D`,
              },
              status === "current" && styles.activityBlockCurrent,
            ]}
            accessible
            accessibilityLabel={`${block.label}. ${status}. ${block.score} out of 100. ${block.activityLabel}.`}
          >
            <View style={styles.activityBlockHeading}>
              <View style={styles.activityBlockIdentity}>
                <View
                  style={[
                    styles.activityBlockDot,
                    { backgroundColor: activityBlockColor(block.score) },
                  ]}
                />
                <View>
                  <View style={styles.activityBlockTimeRow}>
                    <Text style={styles.activityBlockTime}>{block.label}</Text>
                    <View
                      style={[
                        styles.activityBlockStatus,
                        status === "current" &&
                        styles.activityBlockStatusCurrent,
                        status === "ended" && styles.activityBlockStatusEnded,
                      ]}
                    >
                      <Text
                        style={[
                          styles.activityBlockStatusText,
                          status === "current" &&
                          styles.activityBlockStatusTextCurrent,
                        ]}
                      >
                        {status === "current"
                          ? "NOW"
                          : status === "ended"
                          ? "ENDED"
                          : "UPCOMING"}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.activityBlockLabel,
                      { color: activityBlockColor(block.score) },
                    ]}
                  >
                    {block.activityLabel.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.activityBlockScoreRow}>
                <Text
                  style={[
                    styles.activityBlockScore,
                    { color: activityBlockColor(block.score) },
                  ]}
                >
                  {block.score}
                </Text>
                <Text style={styles.activityBlockMaximum}>/100</Text>
              </View>
            </View>
            <View style={styles.activityTrack}>
              <View
                style={[
                  styles.activityFill,
                  {
                    width: `${block.score}%`,
                    backgroundColor: activityBlockColor(block.score),
                  },
                ]}
              />
            </View>
            <View style={styles.activityScaleLabels}>
              <Text style={styles.activityScaleLabel}>LOW</Text>
              <Text style={styles.activityScaleLabel}>HIGH</Text>
            </View>
          </View>
        );
      })}
      {bestBlock
        ? (
          <View
            style={styles.activityEvidence}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Best window: ${
              bestBlocks.map((block) => block.label).join(", ")
            }. Favorable factor: ${bestBlock.positiveDriver} Limiting factor: ${bestBlock.limitingFactor}`}
          >
            <Text style={styles.activityEvidenceEyebrow}>BEST WINDOW</Text>
            <Text style={styles.activityEvidenceWindow}>
              {bestBlocks.map((block) => block.label).join(" · ")}
            </Text>
            <View style={styles.activityEvidenceRow}>
              <Ionicons name="add-circle-outline" size={14} color="#2F8F55" />
              <Text style={styles.activityEvidenceText}>
                {bestBlock.positiveDriver}
              </Text>
            </View>
            <View style={styles.activityEvidenceRow}>
              <Ionicons
                name="remove-circle-outline"
                size={14}
                color="#A85220"
              />
              <Text style={styles.activityEvidenceText}>
                {bestBlock.limitingFactor}
              </Text>
            </View>
          </View>
        )
        : null}
    </View>
  );
}

function activityBlockColor(score: number): string {
  return score >= 80
    ? "#2F8F55"
    : score >= 60
    ? "#65A653"
    : score >= 40
    ? "#C49A24"
    : score >= 20
    ? "#D97835"
    : "#C94A42";
}

function migrationStageSummary(
  primitive: RiverRunSnapshotResponse["runStage"],
): string {
  switch (primitive.stage) {
    case "pre_run":
      return "The river is ahead of its dependable migration window; occasional early arrivals can occur before the run is established.";
    case "beginning":
      return "The dependable migration window is opening, but the run is not yet broadly established.";
    case "building":
      return "The run is progressing toward its strongest seasonal window.";
    case "peak":
      return "This is historically the strongest portion of the migration window.";
    case "tapering":
      return "The strongest window has passed, but the seasonal migration period continues.";
    case "ending":
      return "The dependable migration window is approaching its end.";
    case "post_run":
      return "The tracked seasonal migration window has ended.";
    default:
      return primitive.label === "Before migration"
        ? "The dependable seasonal river migration has not started yet."
        : "This seasonal migration model is complete.";
  }
}

function PrimitiveSection({
  index,
  title,
  visualKind,
  primitive,
  headerMeta,
  contextLine,
  contextContent,
}: {
  index: string;
  title: string;
  visualKind: RiverRunVisualKind;
  primitive: RiverRunPrimitiveDisplay;
  headerMeta?: string;
  contextLine?: string;
  contextContent?: ReactNode;
}) {
  const unavailable = primitive.score === null ||
    primitive.label === "Unavailable";
  const visual = resolveRiverRunVisualModel({
    kind: visualKind,
    primitive,
  });
  const stageOnly = visualKind === "run_stage";
  const publicHeadline = stageOnly
    ? migrationStageSummary(primitive as RiverRunSnapshotResponse["runStage"])
    : visualKind === "activity" && unavailable
    ? primitive.headline
    : undefined;
  const scopeNote = visualKind === "run_stage"
    ? "Seasonal timing context · not live movement or a fish-location report"
    : visualKind === "activity"
    ? "Expected responsiveness if fish are present · not abundance or catch probability"
    : "Seasonal presence estimate · not a live fish count or today’s river conditions";
  return (
    <View style={styles.primitiveFrame}>
      <View
        style={[
          styles.primitiveCard,
          styles.primitiveCardWithoutTip,
        ]}
      >
        <View
          style={[
            styles.primitiveAccent,
            { backgroundColor: visual.accent },
          ]}
        />
        <View style={styles.primitiveHeader}>
          <View style={styles.primitiveIdentity}>
            <Text style={[styles.primitiveIndex, { color: visual.accent }]}>
              {index}
            </Text>
            <Text style={styles.primitiveTitle}>{title.toUpperCase()}</Text>
            <View style={styles.primitiveHeaderRule} />
            <Text
              style={[
                styles.primitiveHeaderState,
                unavailable && styles.unavailable,
                !unavailable && { color: visual.accent },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {visual.stateLabel}
            </Text>
          </View>
          <View style={styles.primitiveNoScore}>
            <Text style={styles.primitiveNoScoreText}>CONTEXT</Text>
          </View>
        </View>

        {headerMeta
          ? <Text style={styles.primitiveHeaderMeta}>{headerMeta}</Text>
          : null}

        {visualKind === "activity"
          ? (
            <View style={styles.activityConditionalNotice}>
              <Text style={styles.activityConditionalNoticeLabel}>
                ONLY IF FISH ARE PRESENT
              </Text>
              <Text style={styles.activityConditionalNoticeText}>
                This estimates likely responsiveness—not whether fish are in the
                river, how many are present, or your chance of catching one.
              </Text>
            </View>
          )
          : null}

        <RiverRunVisual kind={visualKind} primitive={primitive} />

        {publicHeadline
          ? (
            <View style={styles.primitiveResult}>
              <PrimitiveHeadlineCopy value={publicHeadline} />
            </View>
          )
          : null}

        {contextContent ?? (contextLine
          ? (
            <View style={styles.primitiveContext}>
              <Ionicons
                name="time-outline"
                size={15}
                color={paper.dashboardBlue}
              />
              <Text style={styles.primitiveContextText}>{contextLine}</Text>
            </View>
          )
          : null)}
        <Text style={styles.primitiveScopeNote}>{scopeNote}</Text>
      </View>
    </View>
  );
}

function PrimitiveHeadlineCopy({ value }: { value: string }) {
  if (Platform.OS !== "android") {
    const words = value.trim().split(/\s+/);
    return (
      <View
        style={styles.primitiveHeadlineFlow}
        accessible
        accessibilityRole="text"
        accessibilityLabel={value}
      >
        {words.map((word, wordIndex) => (
          <Text
            key={`${wordIndex}:${word}`}
            style={styles.primitiveHeadlineWord}
            accessible={false}
          >
            {word}
          </Text>
        ))}
      </View>
    );
  }
  return (
    <Text
      style={styles.primitiveHeadlineText}
      accessible
      accessibilityRole="text"
      accessibilityLabel={value}
    >
      {value.trim()}
    </Text>
  );
}

function useReduceMotionPreference(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  return reduceMotion;
}

function EditorialNote({
  eyebrow,
  title,
  body,
  icon,
  tint,
  accent,
}: {
  eyebrow: string;
  title?: string;
  body?: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  accent: string;
}) {
  return (
    <View style={[styles.editorialNote, { backgroundColor: tint }]}>
      <View style={[styles.editorialNoteRail, { backgroundColor: accent }]} />
      <View style={styles.editorialNoteIcon}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <View style={styles.editorialNoteCopy}>
        <Text style={[styles.cardEyebrow, { color: accent }]}>{eyebrow}</Text>
        {title ? <Text style={styles.editorialNoteTitle}>{title}</Text> : null}
        {body ? <Text style={styles.editorialNoteBody}>{body}</Text> : null}
      </View>
    </View>
  );
}

function ResultDropdown({
  eyebrow,
  title,
  summary,
  icon,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.resultDropdownCard}>
      <Pressable
        style={({ pressed }) => [
          styles.resultDropdownSummary,
          pressed && { opacity: 0.82 },
        ]}
        onPress={() => {
          hapticSelection();
          setExpanded((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${title}. ${summary}. ${
          expanded ? "Collapse" : "Expand"
        }.`}
      >
        <View style={[styles.resultDropdownIcon, { borderColor: accent }]}>
          <Ionicons name={icon} size={18} color={accent} />
        </View>
        <View style={styles.resultDropdownHeadingCopy}>
          <Text style={[styles.cardEyebrow, { color: accent }]}>{eyebrow}</Text>
          <Text style={styles.resultDropdownTitle}>{title}</Text>
          <Text style={styles.resultDropdownSummaryText}>{summary}</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={accent}
        />
      </Pressable>
      {expanded
        ? <View style={styles.resultDropdownExpanded}>{children}</View>
        : null}
    </View>
  );
}

function GaugeForecastDropdown({
  snapshot,
}: {
  snapshot: RiverRunSnapshotResponse;
}) {
  return (
    <ResultDropdown
      eyebrow="GAUGE & FORECAST CONTEXT"
      title="How this read uses river data"
      summary="Open for gauge limits and forecast context."
      icon="telescope-outline"
      accent={paper.dashboardBlue}
    >
      <View style={styles.resultDropdownSection}>
        <Text style={styles.resultDropdownSectionLabel}>GAUGE BASIS</Text>
        <Text style={styles.resultDropdownBody}>
          {publicRiverRunTerminology(snapshot.safety.gaugeBasis)}
        </Text>
      </View>
      {snapshot.weather?.forecastDaily?.length
        ? (
          <View style={styles.resultDropdownSection}>
            <Text style={styles.resultDropdownSectionLabel}>FORECAST NOTE</Text>
            <Text style={styles.resultDropdownBody}>
              Forecast weather informs Activity Outlook only; Fishing Shape
              remains observation-led.
            </Text>
          </View>
        )
        : null}
    </ResultDropdown>
  );
}

function FishingMethodsDropdown({ species }: { species: string }) {
  const guide = riverRunFishingGuideForSpecies(species);
  return (
    <ResultDropdown
      eyebrow="WAYS TO FISH THIS RUN"
      title={guide.title}
      summary="Methods, bite behavior and regulation reminder."
      icon="fish-outline"
      accent="#207B53"
    >
      <View style={styles.fishingBehaviorNote}>
        <Text style={styles.resultDropdownSectionLabel}>HOW THEY TAKE</Text>
        <Text style={styles.resultDropdownBody}>{guide.biteContext}</Text>
      </View>
      <View style={styles.fishingMethodList}>
        {guide.methods.map((method) => (
          <View key={method.title} style={styles.fishingMethodRow}>
            <View style={styles.fishingMethodDot} />
            <View style={styles.fishingMethodCopy}>
              <Text style={styles.fishingMethodTitle}>{method.title}</Text>
              <Text style={styles.resultDropdownBody}>{method.detail}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.fishingRegulationBox}>
        <Ionicons name="warning-outline" size={17} color={paper.redDk} />
        <Text style={styles.fishingRegulationText}>
          {RIVER_RUN_REGULATION_REMINDER}
        </Text>
      </View>
    </ResultDropdown>
  );
}

function LoadingState({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.messageCard, compact && styles.messageCardCompact]}>
      <View style={styles.loadingIcon}>
        <ActivityIndicator color={paper.redDk} />
      </View>
      <Text style={styles.messageTitle}>{label}</Text>
      <Text style={styles.messageBody}>
        Checking audited configurations and measured inputs.
      </Text>
    </View>
  );
}

function MessageState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.messageCard}>
      <View style={styles.messageIcon}>
        <Ionicons name={icon} size={22} color={paper.dashboardInk} />
      </View>
      <Text style={styles.messageTitle}>{title}</Text>
      <Text style={styles.messageBody}>{body}</Text>
      {actionLabel && onAction
        ? (
          <Pressable
            style={({ pressed }) => [
              styles.messageAction,
              pressed && { opacity: 0.86 },
            ]}
            onPress={onAction}
          >
            <Text style={styles.messageActionText}>{actionLabel}</Text>
          </Pressable>
        )
        : null}
    </View>
  );
}

function formatLocalDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
}

function currentDeviceLocalDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: paper.dashboardInk,
  },
  preloadImage: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  preloadImageAsset: {
    width: 1,
    height: 1,
  },
  body: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },
  scroll: { flex: 1 },
  setupContent: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 12,
  },
  resultContent: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 72,
    gap: 16,
  },
  headerEdit: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerEditText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: "#FFFFFF",
  },
  setupHero: {
    alignItems: "center",
    paddingTop: 4,
    paddingHorizontal: 8,
    gap: 8,
  },
  setupHeroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 35,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  setupHeroAccent: { color: paper.red },
  setupHeroSubtitle: {
    maxWidth: 390,
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  progressRow: {
    flexDirection: "row",
    gap: 7,
  },
  progressTile: {
    flex: 1,
    minWidth: 0,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 6,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
  },
  progressTileActive: {
    backgroundColor: "#FBE8E4",
    borderColor: paper.red,
    ...paperShadows.hard,
  },
  progressTileComplete: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  progressIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  progressIconActive: {
    backgroundColor: paper.red,
    borderColor: paper.redDk,
  },
  progressIconComplete: {
    backgroundColor: paper.red,
    borderColor: paper.red,
  },
  progressLabel: {
    width: "100%",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.8,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  progressLabelComplete: { color: "#FFFFFF" },
  stepCard: {
    position: "relative",
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 13,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  stepHeader: {
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 7,
  },
  stepEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 1.8,
    textAlign: "center",
    color: paper.redDk,
  },
  stepTitle: {
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 31,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  stepCaption: {
    maxWidth: 370,
    fontFamily: paperFonts.displayItalic,
    fontSize: 13.5,
    lineHeight: 19,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  choiceStack: { gap: 8 },
  choiceCard: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  choiceCardSelected: {
    borderColor: paper.red,
    backgroundColor: "#FFF7F4",
    ...paperShadows.lift,
  },
  choiceCardDisabled: {
    borderColor: "#D8DADA",
    backgroundColor: "#F1F2F1",
    shadowOpacity: 0,
    elevation: 0,
  },
  choiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.22)",
    backgroundColor: "#EAF3FA",
  },
  illustratedChoiceIcon: {
    width: 48,
    height: 48,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.13)",
    borderRadius: 11,
  },
  illustratedChoiceIconDisabled: { opacity: 0.62 },
  stateChoiceMonogram: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0.7,
  },
  choiceIconSelected: {
    borderColor: "rgba(192,57,43,0.25)",
    backgroundColor: "#FBE4E1",
  },
  choiceIconDisabled: {
    borderColor: "#D2D5D5",
    backgroundColor: "#E5E7E7",
  },
  choiceCopy: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  choiceTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  choiceSubtitle: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: paper.dashboardMuted,
  },
  choiceTextDisabled: { color: "#777D80" },
  choiceSubtitleDisabled: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#8B9092",
  },
  choiceCheck: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardCream,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceCheckSelected: {
    borderColor: paper.red,
    backgroundColor: paper.red,
  },
  choiceCheckDisabled: {
    borderColor: "#D2D5D5",
    backgroundColor: "#E5E7E7",
  },
  speciesChoiceCheck: {
    backgroundColor: paper.dashboardCream,
  },
  speciesChoiceCard: {
    minHeight: 72,
  },
  speciesChoiceImageStage: {
    width: 92,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.16)",
    borderRadius: 9,
    backgroundColor: "rgba(234,243,250,0.52)",
  },
  speciesChoiceImage: {
    width: 72,
    height: 52,
  },
  speciesChoiceImageSteelhead: {
    width: 52,
    height: 39,
  },
  choiceImageDisabled: { opacity: 0.5 },
  speciesChoiceCopy: {
    alignItems: "flex-start",
  },
  riverChoiceImageStage: {
    width: 92,
    height: 52,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.14)",
    borderRadius: 9,
    backgroundColor: "#EDF5F8",
  },
  riverChoiceImage: {
    width: 86,
    height: 48,
  },
  noChoiceState: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  noChoiceTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 20,
    color: paper.dashboardInk,
  },
  noChoiceBody: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
    backgroundColor: paper.dashboardWhite,
  },
  secondaryButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: paper.dashboardInk,
  },
  primaryButton: {
    minHeight: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 9,
    backgroundColor: paper.dashboardInk,
    ...paperShadows.hard,
  },
  primaryButtonDisabled: {
    borderColor: paper.dashboardLine,
    backgroundColor: "#E7E8E8",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: "#FFFFFF",
  },
  primaryButtonTextDisabled: { color: paper.dashboardMuted },
  setupDisclaimer: {
    paddingHorizontal: 20,
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  resultHero: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 23,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  resultHeroTitle: {
    marginTop: 7,
    fontFamily: paperFonts.display,
    fontSize: 31,
    lineHeight: 35,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  resultHeroSubtitle: {
    maxWidth: 410,
    marginTop: 7,
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  resultFishStage: {
    width: "100%",
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  resultFishImage: {
    width: "100%",
    height: "100%",
  },
  resultHeroMeta: {
    width: "100%",
    minHeight: 64,
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  resultHeroMetaItem: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 11,
  },
  resultHeroMetaRule: {
    width: 1,
    backgroundColor: paper.dashboardLine,
  },
  resultHeroMetaLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.6,
    color: paper.dashboardMuted,
  },
  resultHeroMetaValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardInk,
  },
  liveConditionsCard: {
    overflow: "hidden",
    gap: 11,
    padding: 13,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 13,
    backgroundColor: "#FDFDFC",
    ...paperShadows.hard,
  },
  fishCountsCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(126,56,44,0.28)",
    borderRadius: 13,
    backgroundColor: "#FFF9F6",
    ...paperShadows.hard,
  },
  fishCountsToggle: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderTopWidth: 3,
    borderTopColor: "#A95A4C",
    backgroundColor: "#FFF9F6",
  },
  fishCountsContent: {
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(126,56,44,0.18)",
    backgroundColor: "#FDF7F4",
  },
  fishCountsIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F8E4DD",
  },
  fishCountsHeadingCopy: { flex: 1, minWidth: 0, gap: 2 },
  fishCountsEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#9A5548",
  },
  fishCountsTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 21,
    color: paper.dashboardInk,
  },
  fishCountsFacility: {
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  fishCountsStatus: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  fishCountsStatusCurrent: {
    backgroundColor: "#E8F4E8",
    borderColor: "#8FBC8F",
  },
  fishCountsStatusStale: { backgroundColor: "#FFF0D2", borderColor: "#D7AA4A" },
  fishCountsStatusUnavailable: {
    backgroundColor: "#F1EFEC",
    borderColor: paper.dashboardLine,
  },
  fishCountsStatusText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 0.8,
    color: paper.dashboardInk,
  },
  fishCountsBody: {
    gap: 7,
    padding: 11,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(126,56,44,0.14)",
  },
  fishCountsTotalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  fishCountsPeriod: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.1,
    color: "#9A5548",
  },
  fishCountsTotal: {
    fontFamily: paperFonts.display,
    fontSize: 35,
    lineHeight: 39,
    color: "#7E382C",
  },
  fishCountsDate: {
    fontFamily: paperFonts.body,
    fontSize: 9,
    lineHeight: 13,
    color: paper.dashboardMuted,
  },
  fishCountsBreakdown: { flexDirection: "row", gap: 7 },
  fishCountsBreakdownItem: {
    minWidth: 52,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: "#F8EEE9",
  },
  fishCountsBreakdownValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  fishCountsBreakdownLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 0.8,
    color: paper.dashboardMuted,
  },
  fishCountsPreliminary: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 0.8,
    color: "#9A5548",
  },
  fishCountsUnavailable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 11,
    borderRadius: 9,
    backgroundColor: paper.dashboardCream,
  },
  fishCountsUnavailableText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  fishCountsLimitation: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  fishCountsSourceButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  fishCountsSourceText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1,
    color: "#7E382C",
  },
  spotFinderCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(22,123,120,0.3)",
    borderRadius: 13,
    backgroundColor: "#FCFDFC",
    ...paperShadows.hard,
  },
  spotFinderToggle: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderTopWidth: 3,
    borderTopColor: "#2E9B97",
    backgroundColor: "#F7FBFA",
  },
  spotFinderHeaderIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#E6F5F2",
  },
  spotFinderHeaderCopy: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  spotFinderTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 21,
    color: paper.dashboardInk,
  },
  spotFinderSubtitle: {
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  spotFinderContent: {
    gap: 12,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
    backgroundColor: "#F5F8F7",
  },
  spotFinderEarlyApproach: {
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.22)",
    borderRadius: 9,
    backgroundColor: "#EEF6FB",
  },
  spotFinderEarlyApproachHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  spotFinderEarlyApproachLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.25,
    color: paper.dashboardBlue,
  },
  spotFinderEarlyApproachTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
    lineHeight: 19,
    color: paper.dashboardInk,
  },
  spotFinderEarlyApproachText: {
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  spotFinderRecommendationIntro: {
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "rgba(22,123,120,0.38)",
    borderLeftWidth: 5,
    borderLeftColor: "#2E9B97",
    borderRadius: 10,
    backgroundColor: "#E4F4F0",
  },
  spotFinderRecommendationIntroHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  spotFinderRecommendationIntroLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.25,
    letterSpacing: .85,
    color: "#167B78",
  },
  spotFinderRecommendationIntroTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: paper.dashboardInk,
  },
  spotFinderRecommendationIntroText: {
    fontFamily: paperFonts.body,
    fontSize: 9.75,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  spotFinderSectionGroup: {
    gap: 10,
  },
  spotFinderRecommendedSectionGroup: {
    padding: 6,
    borderRadius: 11,
    backgroundColor: "rgba(22,123,120,0.055)",
  },
  spotFinderOtherSectionGroup: {
    marginTop: 2,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: "rgba(27,75,104,0.16)",
  },
  spotFinderGroupLabel: {
    paddingHorizontal: 4,
    paddingBottom: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: .9,
    color: paper.dashboardBlue,
  },
  spotFinderSection: {
    overflow: "hidden",
    borderWidth: 1.25,
    borderColor: "rgba(27,75,104,0.2)",
    borderRadius: 10,
    backgroundColor: "#FCFDFE",
  },
  spotFinderSectionRecommended: {
    borderWidth: 1.5,
    borderLeftWidth: 5,
    borderColor: "rgba(22,123,120,0.52)",
    borderLeftColor: "#2E9B97",
    backgroundColor: "#F1FAF7",
  },
  spotFinderSectionOpen: {
    borderColor: "rgba(27,75,104,0.42)",
    backgroundColor: "#F9FBFC",
  },
  spotFinderSectionRecommendedOpen: {
    borderColor: "rgba(22,123,120,0.72)",
    borderLeftColor: "#167B78",
    backgroundColor: "#EDF8F5",
  },
  spotFinderSectionToggle: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  spotFinderSectionCopy: {
    minWidth: 0,
    flex: 1,
    gap: 1,
  },
  spotFinderRecommendedBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#167B78",
  },
  spotFinderRecommendedLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.25,
    lineHeight: 9,
    letterSpacing: .7,
    color: "#FFFFFF",
  },
  spotFinderNoRecommendation: {
    gap: 3,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.14)",
    borderRadius: 9,
    backgroundColor: "#F7F8F6",
  },
  spotFinderNoRecommendationLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.75,
    letterSpacing: .75,
    color: paper.dashboardMuted,
  },
  spotFinderNoRecommendationText: {
    fontFamily: paperFonts.body,
    fontSize: 9.75,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  spotFinderSectionLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12.5,
    lineHeight: 16,
    color: paper.dashboardInk,
  },
  spotFinderSectionRange: {
    fontFamily: paperFonts.body,
    fontSize: 9.25,
    lineHeight: 13,
    color: paper.dashboardMuted,
  },
  spotFinderSectionCountBadge: {
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.16)",
    borderRadius: 12,
    backgroundColor: "#EDF2F5",
  },
  spotFinderSectionCountBadgeRecommended: {
    borderColor: "rgba(22,123,120,0.22)",
    backgroundColor: "#DCEFEB",
  },
  spotFinderSectionCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: .35,
    color: paper.dashboardBlue,
  },
  spotFinderSectionCountRecommended: {
    color: "#0D6663",
  },
  spotFinderAccessList: {
    gap: 8,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(22,123,120,0.2)",
    backgroundColor: "#E5F1EF",
  },
  spotFinderAccessRow: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.18)",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  spotFinderAccessToggle: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  spotFinderAccessIdentity: {
    minWidth: 0,
    flex: 1,
    gap: 4,
  },
  spotFinderSpotName: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
    color: paper.dashboardInk,
  },
  spotFinderKinds: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  spotFinderKindText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.25,
    letterSpacing: .45,
    color: "#167B78",
  },
  spotFinderAccessDetail: {
    gap: 8,
    paddingHorizontal: 11,
    paddingTop: 9,
    paddingBottom: 11,
    borderTopWidth: 1,
    borderTopColor: "rgba(27,75,104,0.12)",
    backgroundColor: "#F8FBFA",
  },
  spotFinderSpotDetail: {
    fontFamily: paperFonts.body,
    fontSize: 10.25,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  spotFinderCaution: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: "#FFF4EA",
  },
  spotFinderCautionText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 9.5,
    lineHeight: 13,
    color: "#7C4527",
  },
  spotFinderSource: {
    minHeight: 34,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.2)",
    borderRadius: 7,
    backgroundColor: "#F3F7F9",
  },
  spotFinderSourceText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.25,
    letterSpacing: .75,
    color: paper.dashboardBlue,
  },
  spotFinderSourceDetails: {
    gap: 3,
    paddingTop: 1,
  },
  spotFinderSourceLocator: {
    fontFamily: paperFonts.body,
    fontSize: 9.25,
    lineHeight: 13,
    color: paper.dashboardInk,
  },
  spotFinderSourceIdentity: {
    fontFamily: paperFonts.metaMono,
    fontSize: 6.25,
    lineHeight: 10,
    letterSpacing: .3,
    color: paper.dashboardMuted,
  },
  spotFinderFooterGroup: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.2)",
    borderRadius: 9,
    backgroundColor: "#F3F7F9",
  },
  spotFinderFooterToggle: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  spotFinderFooterTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: .7,
    color: paper.dashboardBlue,
  },
  spotFinderFooterText: {
    paddingHorizontal: 11,
    paddingBottom: 11,
    fontFamily: paperFonts.body,
    fontSize: 10,
    lineHeight: 15,
    color: paper.dashboardInk,
  },
  spotFinderSafety: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(166,90,46,0.22)",
    borderRadius: 9,
    backgroundColor: "#FFF9F3",
  },
  spotFinderSafetyHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  spotFinderSafetyTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: .85,
    color: "#A65A2E",
  },
  spotFinderSafetyContent: {
    gap: 8,
    paddingHorizontal: 11,
    paddingBottom: 11,
  },
  spotFinderSafetyText: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    lineHeight: 14.5,
    color: paper.dashboardInk,
  },
  spotFinderClosuresLink: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.25,
    letterSpacing: .7,
    color: paper.dashboardBlue,
  },
  liveConditionsHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  liveConditionsIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "#EAF2F7",
  },
  liveConditionsHeadingCopy: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  liveConditionsEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.35,
    color: paper.dashboardBlue,
  },
  liveConditionsTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  liveConditionsSubtitle: {
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
  liveConditionsStatus: {
    flexShrink: 0,
    minHeight: 21,
    justifyContent: "center",
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 12,
  },
  liveConditionsStatusAvailable: {
    borderColor: "rgba(32,123,83,0.28)",
    backgroundColor: "#EAF6EF",
  },
  liveConditionsStatusPartial: {
    borderColor: "rgba(196,154,36,0.35)",
    backgroundColor: "#FFF7DD",
  },
  liveConditionsStatusUnavailable: {
    borderColor: "rgba(117,126,133,0.28)",
    backgroundColor: "#F0F2F3",
  },
  liveConditionsStatusText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: .9,
    color: paper.dashboardInk,
  },
  liveMetricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  liveMetricTile: {
    minWidth: 0,
    gap: 6,
    padding: 9,
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
    backgroundColor: "#FCFCFA",
  },
  liveMetricTileThree: {
    flexBasis: "31%",
    flexGrow: 1,
  },
  liveMetricTileTwo: {
    flexBasis: "47%",
    flexGrow: 1,
  },
  liveMetricTileSingle: {
    minWidth: "100%",
    flexBasis: "100%",
    flexGrow: 1,
  },
  liveMetricHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  liveMetricIcon: {
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  liveMetricLabel: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: .85,
    color: paper.dashboardMuted,
  },
  liveMetricValue: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 21,
    lineHeight: 24,
    color: paper.dashboardInk,
  },
  liveMetricUnavailable: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 13.5,
    lineHeight: 18,
    minHeight: 24,
    textAlignVertical: "center",
    color: paper.dashboardMuted,
  },
  liveMetricAverage: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    lineHeight: 13,
    color: paper.dashboardInk,
  },
  liveMetricComparisonPill: {
    maxWidth: "100%",
    alignSelf: "flex-start",
    justifyContent: "center",
    minHeight: 19,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  liveMetricComparison: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 9,
    letterSpacing: .45,
  },
  liveMetricComparisonUnavailablePill: {
    alignSelf: "flex-start",
    justifyContent: "center",
    minHeight: 19,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: "#F0F2F3",
  },
  liveMetricComparisonUnavailable: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    lineHeight: 9,
    letterSpacing: .45,
    color: paper.dashboardMuted,
  },
  liveMetricTrendRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  liveMetricTrendLabel: {
    flexShrink: 0,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: .7,
    color: paper.dashboardMuted,
  },
  liveMetricTrend: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 8.5,
    lineHeight: 12,
    color: paper.dashboardInk,
  },
  liveConditionsEmpty: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    padding: 13,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    backgroundColor: paper.dashboardCream,
  },
  liveConditionsEmptyCopy: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  liveConditionsEmptyTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  liveConditionsEmptyBody: {
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  fishingShapeSummary: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: "rgba(22,123,120,0.24)",
    borderRadius: 9,
    backgroundColor: "rgba(22,123,120,0.07)",
  },
  fishingShapeIdentity: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fishingShapeCopy: {
    minWidth: 0,
    flex: 1,
  },
  fishingShapeEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.1,
    color: "#167B78",
  },
  fishingShapeLabel: {
    marginTop: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    color: paper.dashboardInk,
  },
  fishingShapeMeter: {
    width: 142,
    flexShrink: 0,
    gap: 5,
  },
  fishingShapeMeterTrack: {
    height: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  fishingShapeMeterSegment: {
    position: "relative",
    height: 6,
    flex: 1,
    opacity: 0.42,
    borderRadius: 3,
  },
  fishingShapeMeterSegmentSelected: {
    height: 10,
    opacity: 1,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#102D3A",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  fishingShapeMeterMarker: {
    position: "absolute",
    top: -4,
    left: "50%",
    width: 3,
    height: 3,
    marginLeft: -1.5,
    borderRadius: 2,
    backgroundColor: paper.dashboardInk,
  },
  fishingShapeMeterLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fishingShapeMeterLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.7,
    color: paper.dashboardMuted,
  },
  liveConditionsDetailsButton: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.18)",
    borderRadius: 8,
    backgroundColor: "#F3F7F9",
  },
  liveConditionsDetailsButtonCopy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  liveConditionsDetailsButtonText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: .95,
    color: paper.dashboardBlue,
  },
  liveConditionsDetails: {
    gap: 8,
    paddingTop: 2,
  },
  liveConditionsDetailSection: {
    gap: 7,
    padding: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 9,
    backgroundColor: "#FAFAF8",
  },
  liveConditionsDetailLabel: {
    minWidth: 0,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1,
    color: paper.dashboardBlue,
  },
  liveConditionsDetailHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  liveConditionsDetailMetricIcon: {
    width: 26,
    height: 26,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  liveConditionsDetailIdentity: {
    minWidth: 0,
    flex: 1,
    gap: 1,
  },
  liveConditionsDetailFreshnessBadge: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 9,
    backgroundColor: "#F0F3F2",
  },
  liveConditionsDetailFreshnessDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  liveConditionsDetailFreshnessText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: .6,
    color: paper.dashboardInk,
  },
  liveConditionsDetailMeta: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 9.5,
    lineHeight: 13,
    color: paper.dashboardMuted,
  },
  liveConditionsDetailFacts: {
    gap: 4,
    paddingLeft: 33,
  },
  liveConditionsDetailFact: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveConditionsDetailStation: {
    paddingLeft: 33,
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    lineHeight: 15,
    color: paper.dashboardInk,
  },
  liveConditionsDetailBody: {
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  liveConditionsAttribution: {
    fontFamily: paperFonts.body,
    fontSize: 8.5,
    lineHeight: 12,
    paddingLeft: 33,
    color: paper.dashboardMuted,
  },
  liveConditionsLimitation: {
    gap: 3,
    padding: 11,
    borderRadius: 8,
    backgroundColor: paper.dashboardCream,
  },
  liveConditionsMethodNote: {
    fontFamily: paperFonts.body,
    fontSize: 9.5,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  primitiveTabSticky: {
    zIndex: 30,
    marginHorizontal: -18,
    paddingHorizontal: 18,
    paddingTop: 7,
    paddingBottom: 8,
    backgroundColor: paper.dashboardCream,
    shadowColor: paper.dashboardInk,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  primitiveTabShell: {
    overflow: "hidden",
    paddingHorizontal: 5,
    paddingTop: 6,
    paddingBottom: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 14,
    backgroundColor: RIVER_RUN_TAB_BLUE,
    shadowColor: "#071829",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  primitiveTabHeading: {
    minHeight: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 4,
  },
  primitiveTabInstruction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  primitiveTabEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.25,
    color: "rgba(255,255,255,0.66)",
  },
  primitiveTabPosition: {
    fontFamily: paperFonts.monoBold,
    fontSize: 7.5,
    letterSpacing: 0.7,
    color: "rgba(255,255,255,0.46)",
  },
  primitiveTabRow: {
    minHeight: 65,
    flexDirection: "row",
    gap: 4,
  },
  primitiveTab: {
    position: "relative",
    overflow: "hidden",
    minWidth: 0,
    minHeight: 65,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 2,
    paddingTop: 5,
    paddingBottom: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.075)",
    shadowColor: "#071829",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 3,
    elevation: 2,
  },
  primitiveTabActive: {
    borderWidth: 1.5,
    backgroundColor: "#FFFFFF",
  },
  primitiveTabPressed: { opacity: 0.72 },
  primitiveTabIcon: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  primitiveTabTitle: {
    width: "100%",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.2,
    letterSpacing: 0.28,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
  },
  primitiveTabTitleActive: { color: paper.dashboardInk },
  primitiveTabState: {
    maxWidth: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 2,
  },
  primitiveTabDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  primitiveTabStateText: {
    minWidth: 0,
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.4,
    letterSpacing: 0.2,
    textAlign: "center",
    color: "rgba(255,255,255,0.68)",
  },
  primitiveTabIndicator: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 0,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  snapshotStack: { gap: 16 },
  snapshotResultStack: { gap: 16 },
  primitiveFrame: {
    width: "100%",
    padding: 2,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(7,24,41,0.42)",
    borderRadius: 15,
    backgroundColor: paper.dashboardInk,
    ...paperShadows.lift,
  },
  primitiveCard: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 0,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
  },
  primitiveCardWithoutTip: { paddingBottom: 18 },
  primitiveAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: paper.red,
  },
  primitiveHeader: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  primitiveIdentity: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  primitiveIndex: {
    fontFamily: paperFonts.monoBold,
    fontSize: 10,
    color: paper.red,
  },
  primitiveTitle: {
    minWidth: 0,
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.7,
    color: paper.dashboardMuted,
  },
  primitiveHeaderRule: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(17,45,64,0.18)",
  },
  primitiveHeaderState: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.display,
    fontSize: 20,
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: "center",
    color: paper.dashboardInk,
  },
  primitiveNoScore: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: paper.dashboardCream,
  },
  primitiveNoScoreText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.1,
    color: paper.dashboardMuted,
  },
  primitiveHeaderMeta: {
    marginTop: 4,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    lineHeight: 13,
    letterSpacing: 0.8,
    color: paper.dashboardMuted,
  },
  activityConditionalNotice: {
    gap: 4,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(22,123,120,0.3)",
    borderLeftWidth: 5,
    borderLeftColor: "#167B78",
    borderRadius: 8,
    backgroundColor: "#EDF8F6",
  },
  activityConditionalNoticeLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#11635F",
  },
  activityConditionalNoticeText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 11.5,
    lineHeight: 17,
    color: paper.dashboardInk,
  },
  unavailable: { color: paper.dashboardMuted },
  primitiveResult: {
    alignSelf: "stretch",
    minWidth: 0,
    marginTop: 17,
    paddingBottom: 1,
  },
  primitiveHeadlineText: {
    alignSelf: "stretch",
    minWidth: 0,
    fontFamily: paperFonts.bodyBold,
    fontSize: 16,
    lineHeight: 23,
    includeFontPadding: false,
    color: paper.dashboardInk,
  },
  primitiveHeadlineFlow: {
    alignSelf: "stretch",
    minWidth: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 4,
    rowGap: 0,
  },
  primitiveHeadlineWord: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 16,
    lineHeight: 23,
    color: paper.dashboardInk,
  },
  primitiveContext: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.16)",
    borderRadius: 8,
    backgroundColor: "#EEF6FB",
  },
  primitiveContextText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  primitiveScopeNote: {
    marginTop: 13,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  editorialNote: {
    position: "relative",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 11,
  },
  editorialNoteRail: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
  },
  editorialNoteIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  editorialNoteCopy: {
    minWidth: 0,
    flex: 1,
    gap: 6,
  },
  cardEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: paper.dashboardMuted,
  },
  editorialNoteTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 21,
    lineHeight: 25,
    color: paper.dashboardInk,
  },
  editorialNoteBody: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: paper.dashboardInk,
  },
  resultDropdownCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 11,
    backgroundColor: "#F7FAFC",
  },
  resultDropdownSummary: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    padding: 14,
  },
  resultDropdownIcon: {
    width: 38,
    height: 38,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
  },
  resultDropdownHeadingCopy: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  resultDropdownTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  resultDropdownSummaryText: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardMuted,
  },
  resultDropdownExpanded: {
    gap: 14,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
    backgroundColor: "#FFFFFF",
  },
  resultDropdownSection: {
    gap: 5,
  },
  resultDropdownSectionLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.35,
    color: paper.dashboardBlue,
  },
  resultDropdownBody: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: paper.dashboardInk,
  },
  fishingBehaviorNote: {
    gap: 5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#EDF7F1",
  },
  fishingMethodList: {
    gap: 13,
  },
  fishingMethodRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  fishingMethodDot: {
    width: 7,
    height: 7,
    marginTop: 7,
    borderRadius: 4,
    backgroundColor: "#207B53",
  },
  fishingMethodCopy: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  fishingMethodTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
    color: paper.dashboardInk,
  },
  fishingRegulationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(192,57,43,0.18)",
    borderRadius: 8,
    backgroundColor: "#FAECE8",
  },
  fishingRegulationText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  safetyCard: {
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(192,57,43,0.18)",
    borderRadius: 11,
    backgroundColor: "#FAECE8",
  },
  safetyHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  safetyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  safetyHeadingCopy: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  safetyTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    color: paper.dashboardInk,
  },
  activityBreakdown: { gap: 9, paddingTop: 8 },
  activityForecastNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.34)",
    borderRadius: 10,
    backgroundColor: "rgba(231,242,248,0.82)",
  },
  activityForecastCopy: { minWidth: 0, flex: 1, gap: 2 },
  activityForecastEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1,
    color: paper.dashboardBlue,
  },
  activityForecastBody: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 15,
    color: "#4F6673",
  },
  activityWeatherOnlyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(197,103,43,0.42)",
    borderRadius: 10,
    backgroundColor: "#FFF3E8",
  },
  activityWeatherOnlyIcon: {
    width: 22,
    height: 22,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "rgba(216,120,53,0.14)",
  },
  activityWeatherOnlyCopy: {
    minWidth: 0,
    flex: 1,
    gap: 1,
  },
  activityWeatherOnlyEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.85,
    color: "#A85220",
  },
  activityWeatherOnlyTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    lineHeight: 15,
    color: paper.dashboardInk,
  },
  activityWeatherOnlyBody: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 9.25,
    lineHeight: 12.5,
    color: "#6F5548",
  },
  activityMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  activityMeta: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardBlue,
    letterSpacing: 0.7,
  },
  activityBlock: {
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 11,
    borderWidth: 1,
  },
  activityBlockEnded: { opacity: 0.58 },
  activityBlockCurrent: {
    borderWidth: 1.5,
    shadowColor: "#1B4B68",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  activityBlockHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityBlockTime: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  activityBlockTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  activityBlockStatus: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(27,75,104,0.09)",
  },
  activityBlockStatusCurrent: { backgroundColor: paper.dashboardBlue },
  activityBlockStatusEnded: { backgroundColor: "rgba(73,88,96,0.13)" },
  activityBlockStatusText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.7,
    color: paper.dashboardBlue,
  },
  activityBlockStatusTextCurrent: { color: "#FFFFFF" },
  activityBlockIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activityBlockDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activityBlockLabel: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.8,
  },
  activityBlockScoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  activityBlockScore: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 25,
    lineHeight: 28,
  },
  activityBlockMaximum: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardMuted,
    marginLeft: 2,
  },
  activityTrack: {
    height: 9,
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "rgba(27,75,104,0.12)",
  },
  activityFill: { height: 9, borderRadius: 5 },
  activityScaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -4,
  },
  activityScaleLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 0.7,
    color: paper.dashboardMuted,
  },
  activityEvidence: {
    gap: 7,
    padding: 11,
    borderWidth: 1,
    borderColor: "rgba(27,75,104,0.18)",
    borderRadius: 9,
    backgroundColor: "#F3F7F9",
  },
  activityEvidenceEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.1,
    color: paper.dashboardBlue,
  },
  activityEvidenceWindow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  activityEvidenceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  activityEvidenceText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: paper.dashboardMuted,
  },
  safetyBody: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13.5,
    lineHeight: 20,
    color: paper.dashboardInk,
  },
  safetyRule: {
    height: 1,
    backgroundColor: "rgba(192,57,43,0.14)",
  },
  safetySub: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: paper.dashboardMuted,
  },
  messageCard: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 34,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 11,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  messageCardCompact: { minHeight: 260, justifyContent: "center" },
  messageIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paper.dashboardCream,
  },
  loadingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBE4E1",
  },
  messageTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 22,
    lineHeight: 27,
    textAlign: "center",
    color: paper.dashboardInk,
  },
  messageBody: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: "center",
    color: paper.dashboardMuted,
  },
  messageAction: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: paper.dashboardInk,
  },
  messageActionText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#FFFFFF",
  },
});
