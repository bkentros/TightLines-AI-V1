import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  AppState,
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
  fetchRiverRunSnapshot,
  RiverRunRequestError,
} from "../lib/riverRun";
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
  RiverRunPrimitiveDisplay,
  RiverRunSeason,
  RiverRunSnapshotResponse,
} from "../lib/riverRunContracts";
import {
  RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS,
  RIVER_RUN_BETSIE_REVIEW_GROUPS,
  RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS,
  RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS,
  RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS,
  RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS,
  RIVER_RUN_COHO_REVIEW_GROUPS,
  RIVER_RUN_MUSKEGON_COHO_REVIEW_GROUPS,
  RIVER_RUN_MUSKEGON_REVIEW_GROUPS,
  RIVER_RUN_MUSKEGON_STEELHEAD_REVIEW_GROUPS,
  RIVER_RUN_REVIEW_GROUPS,
  RIVER_RUN_STEELHEAD_REVIEW_GROUPS,
  type RiverRunReviewGroup,
  type RiverRunReviewScenario,
} from "../lib/riverRunReviewFixtures";
import {
  formatRiverRunTabStatus,
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
} from "../lib/riverRunVisuals";
import { getRiverRunSpeciesImage } from "../lib/riverRunSpeciesImages";
import { getRiverRunRiverImage } from "../lib/riverRunChoiceImages";
import {
  RIVER_RUN_REGULATION_REMINDER,
  riverRunFishingGuideForSpecies,
} from "../lib/riverRunFishingGuides";
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
type PrimitiveTabId = RiverRunVisualKind;

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
    id: "run_timing",
    index: "02",
    tabTitle: "TIMING",
    cardTitle: "Migration Timing",
    icon: "speedometer-outline",
  },
  {
    id: "push",
    index: "03",
    tabTitle: "PUSH",
    cardTitle: "Push",
    icon: "pulse-outline",
  },
  {
    id: "fishability",
    index: "04",
    tabTitle: "FISHABILITY",
    cardTitle: "Fishability",
    icon: "water-outline",
  },
  {
    id: "activity",
    index: "05",
    tabTitle: "ACTIVITY",
    cardTitle: "Activity Outlook",
    icon: "flash-outline",
  },
  {
    id: "fish_in_river",
    index: "06",
    tabTitle: "PRESENCE",
    cardTitle: "Fish In River",
    icon: "fish-outline",
  },
];

const REVIEW_GROUP_TAB: Partial<Record<string, PrimitiveTabId>> = {
  run_stage: "run_stage",
  conditions: "run_timing",
  push: "push",
  fishability: "fishability",
  fish_in_river: "fish_in_river",
  activity: "activity",
};

const RIVER_RUN_REVIEW_ENABLED = __DEV__ &&
  process.env.EXPO_PUBLIC_RIVER_RUN_REVIEW_MODE === "true";
const CHINOOK_IMAGE = getRiverRunSpeciesImage("chinook_salmon");
const COHO_IMAGE = getRiverRunSpeciesImage("coho_salmon");
const STEELHEAD_IMAGE = getRiverRunSpeciesImage("steelhead");
const ATLANTIC_IMAGE = getRiverRunSpeciesImage("atlantic_salmon");
const RIVER_RUN_TAB_BLUE = "#1B4B68";
const BIG_MANISTEE_RIVER_ID = "big_manistee";

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

const REVIEW_CATALOG: RiverRunCatalogResponse = {
  states: [
    {
      state: "MI",
      displayName: "Michigan",
      rivers: [
        {
          riverId: "pere_marquette",
          displayName: "Pere Marquette River",
          state: "MI",
          timezone: "America/Detroit",
          runs: [
            {
              runId: "pere_marquette_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "pere_marquette_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "pere_marquette_fall_steelhead",
              displayName: "Fall Steelhead",
              species: "steelhead",
              season: "fall",
              runType: "fall_entry",
              supportStatus: "beta",
            },
          ],
        },
        {
          riverId: "betsie",
          displayName: "Betsie River",
          state: "MI",
          timezone: "America/Detroit",
          runs: [
            {
              runId: "betsie_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "betsie_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "betsie_fall_steelhead",
              displayName: "Fall Steelhead",
              species: "steelhead",
              season: "fall",
              runType: "fall_entry",
              supportStatus: "beta",
            },
          ],
        },
        {
          riverId: "big_manistee",
          displayName: "Big Manistee River",
          state: "MI",
          timezone: "America/Detroit",
          runs: [
            {
              runId: "big_manistee_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "big_manistee_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "big_manistee_fall_steelhead",
              displayName: "Fall Steelhead",
              species: "steelhead",
              season: "fall",
              runType: "fall_entry",
              supportStatus: "beta",
            },
          ],
        },
        {
          riverId: "muskegon",
          displayName: "Muskegon River",
          state: "MI",
          timezone: "America/Detroit",
          runs: [
            {
              runId: "muskegon_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "muskegon_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
              runType: "fall_spawn",
              supportStatus: "beta",
            },
            {
              runId: "muskegon_fall_steelhead",
              displayName: "Fall Steelhead",
              species: "steelhead",
              season: "fall",
              runType: "fall_entry",
              supportStatus: "beta",
            },
          ],
        },
      ],
    },
  ],
};

const STEP_CONFIG: Record<
  WizardStep,
  {
    label: string;
    eyebrow: string;
    question: string;
    caption: string;
    icon: keyof typeof Ionicons.glyphMap;
    requestTitle: string;
    requestAction: string;
  }
> = {
  1: {
    label: "STATE",
    eyebrow: "CHOOSE A REGION",
    question: "Which state?",
    caption: "Michigan is available now. Planned regions are marked below.",
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
    requestTitle: "Need another season?",
    requestAction: "Request a season",
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
  const effectiveTier = getEffectiveTier(profile, user?.email);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>("setup");
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [reviewMode, setReviewMode] = useState(RIVER_RUN_REVIEW_ENABLED);
  const [reviewGroupId, setReviewGroupId] = useState(
    RIVER_RUN_REVIEW_GROUPS[0]?.id ?? "",
  );
  const [reviewScenarioId, setReviewScenarioId] = useState(
    RIVER_RUN_REVIEW_GROUPS[0]?.scenarios[0]?.id ?? "",
  );
  const [activePrimitive, setActivePrimitive] = useState<PrimitiveTabId>(
    "run_stage",
  );
  const [catalog, setCatalog] = useState<RiverRunCatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(!reviewMode);
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

  const reviewGroups = selectedRiverId === "betsie" &&
      selectedSpecies === "steelhead"
    ? RIVER_RUN_BETSIE_STEELHEAD_REVIEW_GROUPS
    : selectedRiverId === "betsie" && selectedSpecies === "coho_salmon"
    ? RIVER_RUN_BETSIE_COHO_REVIEW_GROUPS
    : selectedRiverId === "betsie"
    ? RIVER_RUN_BETSIE_REVIEW_GROUPS
    : selectedRiverId === BIG_MANISTEE_RIVER_ID &&
        selectedSpecies === "coho_salmon"
    ? RIVER_RUN_BIG_MANISTEE_COHO_REVIEW_GROUPS
    : selectedRiverId === BIG_MANISTEE_RIVER_ID &&
        selectedSpecies === "steelhead"
    ? RIVER_RUN_BIG_MANISTEE_STEELHEAD_REVIEW_GROUPS
    : selectedRiverId === BIG_MANISTEE_RIVER_ID
    ? RIVER_RUN_BIG_MANISTEE_REVIEW_GROUPS
    : selectedRiverId === "muskegon" && selectedSpecies === "steelhead"
    ? RIVER_RUN_MUSKEGON_STEELHEAD_REVIEW_GROUPS
    : selectedRiverId === "muskegon" && selectedSpecies === "coho_salmon"
    ? RIVER_RUN_MUSKEGON_COHO_REVIEW_GROUPS
    : selectedRiverId === "muskegon" && selectedSpecies === "chinook_salmon"
    ? RIVER_RUN_MUSKEGON_REVIEW_GROUPS
    : selectedRiverId === "muskegon"
    ? []
    : selectedSpecies === "coho_salmon"
    ? RIVER_RUN_COHO_REVIEW_GROUPS
    : selectedSpecies === "steelhead"
    ? RIVER_RUN_STEELHEAD_REVIEW_GROUPS
    : RIVER_RUN_REVIEW_GROUPS;

  const reviewGroup = useMemo(
    () =>
      reviewGroups.find((group) => group.id === reviewGroupId) ??
        reviewGroups[0],
    [reviewGroupId, reviewGroups],
  );
  const reviewScenario = useMemo(
    () =>
      reviewGroup?.scenarios.find((item) => item.id === reviewScenarioId) ??
        reviewGroup?.scenarios[0],
    [reviewGroup, reviewScenarioId],
  );

  const loadCatalog = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoadingCatalog(true);
    setCatalogError(null);
    try {
      setCatalog(await fetchRiverRunCatalog());
    } catch (error) {
      setCatalogError(
        error instanceof Error
          ? error.message
          : "River Migration failed to load.",
      );
    } finally {
      if (!isRefresh) setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    if (reviewMode) {
      setLoadingCatalog(false);
      return;
    }
    void loadCatalog();
  }, [loadCatalog, reviewMode]);

  const activeCatalog = reviewMode ? REVIEW_CATALOG : catalog;
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
    if (reviewMode || screenState !== "result") {
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
      const next = await fetchRiverRunSnapshot({
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
  }, [fetchProfile, reviewMode, screenState, selectedTarget, user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (reviewMode || screenState !== "result") {
        return () => {
          snapshotRequestRef.current++;
        };
      }
      void loadSnapshot();
      const subscription = AppState.addEventListener("change", (nextState) => {
        if (nextState === "active") void loadSnapshot(false);
      });
      return () => {
        snapshotRequestRef.current++;
        subscription.remove();
      };
    }, [loadSnapshot, reviewMode, screenState]),
  );

  const resetSelection = useCallback(() => {
    snapshotRequestRef.current++;
    setSnapshot(null);
    setSnapshotError(null);
    setSelectedState(null);
    setSelectedSeason(null);
    setSelectedSpecies(null);
    setSelectedRiverId(null);
    setActivePrimitive("run_stage");
    setWizardStep(1);
  }, []);

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
    if (!reviewMode) setLoadingSnapshot(true);
  }, [reviewMode]);

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
    if (!reviewMode && !canAttemptReport) {
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
    reviewMode,
    selectedTarget,
    wizardStep,
  ]);

  const handleModeChange = useCallback((nextReviewMode: boolean) => {
    if (nextReviewMode === reviewMode) return;
    hapticSelection();
    setReviewMode(nextReviewMode);
    setScreenState("setup");
    resetSelection();
  }, [resetSelection, reviewMode]);

  const handlePrimitiveTabChange = useCallback((tab: PrimitiveTabId) => {
    setActivePrimitive(tab);
    requestAnimationFrame(() => {
      resultScrollRef.current?.scrollTo({
        y: Math.max(0, primitiveTabsYRef.current - 1),
        animated: true,
      });
    });
  }, []);

  const reviewSnapshot = reviewScenario?.snapshot;
  const reviewSnapshotMatchesSelection = !!reviewSnapshot && !!selectedTarget &&
    reviewSnapshot.riverId === selectedTarget.river.riverId &&
    reviewSnapshot.runId === selectedTarget.run.runId;
  const resultSnapshot = reviewMode
    ? reviewSnapshotMatchesSelection ? reviewSnapshot : undefined
    : snapshot;
  const primitiveTabStickyIndex = RIVER_RUN_REVIEW_ENABLED ? 2 : 1;
  const resultSeason = selectedTarget?.run.season ?? selectedSeason ?? "fall";
  const resultSpecies = selectedTarget?.run.species ??
    selectedSpecies ??
    "chinook_salmon";
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
              loading={loadingCatalog && !reviewMode}
              error={catalogError}
              choices={currentChoices}
              selectedId={currentSelection}
              step={wizardStep}
              onSelect={selectChoice}
              onBack={handleBack}
              onContinue={handleContinue}
              canContinue={canContinue}
              onRetry={() => void loadCatalog()}
              reviewMode={reviewMode}
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
              refreshControl={reviewMode ? undefined : (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    void Promise.all([
                      loadCatalog(true),
                      loadSnapshot(false),
                    ]).finally(() => setRefreshing(false));
                  }}
                  tintColor={paper.dashboardInk}
                />
              )}
            >
              <ResultHero
                season={resultSeason}
                species={resultSpecies}
                snapshot={resultSnapshot}
                readDate={currentDeviceLocalDate()}
              />

              {RIVER_RUN_REVIEW_ENABLED
                ? (
                  <ReviewControl
                    groups={reviewGroups}
                    reviewMode={reviewMode}
                    activeGroup={reviewGroup}
                    activeScenario={reviewScenario}
                    onModeChange={handleModeChange}
                    onGroupChange={(group) => {
                      setReviewGroupId(group.id);
                      setReviewScenarioId(group.scenarios[0]?.id ?? "");
                      const matchingTab = REVIEW_GROUP_TAB[group.id];
                      if (matchingTab) setActivePrimitive(matchingTab);
                    }}
                    onScenarioChange={(scenario) =>
                      setReviewScenarioId(scenario.id)}
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

              {loadingSnapshot && !reviewMode
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
                  <>
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
                  </>
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
  reviewMode,
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
  reviewMode: boolean;
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

      {reviewMode
        ? (
          <View style={styles.fixtureNotice}>
            <Ionicons
              name="flask-outline"
              size={14}
              color={paper.redDk}
            />
            <Text style={styles.fixtureNoticeText}>
              REVIEW BUILD · LOCAL FIXTURES · NO LIVE RIVER MIGRATION REQUESTS
            </Text>
          </View>
        )
        : null}

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

      {!loading && !error
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
        Today&apos;s read of movement, activity, river conditions, fishability,
        and seasonal presence.
      </Text>
      {speciesImage
        ? (
          <View style={styles.resultFishStage}>
            <Image
              source={speciesImage}
              style={styles.resultFishImage}
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
            {snapshot?.dataQuality.label ?? "Review"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReviewControl({
  groups,
  reviewMode,
  activeGroup,
  activeScenario,
  onModeChange,
  onGroupChange,
  onScenarioChange,
}: {
  groups: RiverRunReviewGroup[];
  reviewMode: boolean;
  activeGroup?: RiverRunReviewGroup;
  activeScenario?: RiverRunReviewScenario;
  onModeChange: (enabled: boolean) => void;
  onGroupChange: (group: RiverRunReviewGroup) => void;
  onScenarioChange: (scenario: RiverRunReviewScenario) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.reviewControl}>
      <Pressable
        style={({ pressed }) => [
          styles.reviewSummary,
          pressed && { opacity: 0.84 },
        ]}
        onPress={() => {
          hapticSelection();
          setExpanded((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <View style={styles.reviewSummaryIcon}>
          <Ionicons name="flask" size={15} color={paper.redDk} />
        </View>
        <View style={styles.reviewSummaryCopy}>
          <Text style={styles.reviewSummaryEyebrow}>
            DEVELOPMENT REVIEW · {reviewMode ? "LOCAL FIXTURE" : "LIVE API"}
          </Text>
          <Text style={styles.reviewSummaryTitle} numberOfLines={1}>
            {reviewMode
              ? `${activeGroup?.label ?? "River Migration"} · ${
                activeScenario?.label ?? "State"
              } · ${
                activeScenario
                  ? formatLocalDate(activeScenario.snapshot.localDate)
                  : "Date unavailable"
              }`
              : "Current-date River Migration response"}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={17}
          color={paper.dashboardInk}
        />
      </Pressable>

      {expanded
        ? (
          <View style={styles.reviewExpanded}>
            <Text style={styles.reviewHelp}>
              Fixtures stay on this phone and make no River Migration API
              request.
            </Text>
            <ReviewChipRow>
              <ReviewChip
                label="Review fixtures"
                active={reviewMode}
                onPress={() => onModeChange(true)}
              />
              <ReviewChip
                label="Live API"
                active={!reviewMode}
                onPress={() => onModeChange(false)}
              />
            </ReviewChipRow>
            {reviewMode
              ? (
                <>
                  <Text style={styles.reviewSectionLabel}>
                    PRIMITIVE OR TEST AREA
                  </Text>
                  <ReviewChipRow>
                    {groups.map((group) => (
                      <ReviewChip
                        key={group.id}
                        label={group.label}
                        active={group.id === activeGroup?.id}
                        onPress={() => onGroupChange(group)}
                      />
                    ))}
                  </ReviewChipRow>
                  <Text style={styles.reviewSectionLabel}>STATE</Text>
                  <ReviewChipRow>
                    {(activeGroup?.scenarios ?? []).map((scenario) => (
                      <ReviewChip
                        key={scenario.id}
                        label={`${scenario.label} · ${
                          formatLocalDate(scenario.snapshot.localDate)
                        }`}
                        active={scenario.id === activeScenario?.id}
                        onPress={() => onScenarioChange(scenario)}
                      />
                    ))}
                  </ReviewChipRow>
                  {activeScenario?.note
                    ? (
                      <Text style={styles.reviewHelp}>
                        {activeScenario.note}
                      </Text>
                    )
                    : null}
                  {activeScenario
                    ? (
                      <Text style={styles.reviewHelp}>
                        {reviewScenarioDateCopy(
                          activeGroup?.id,
                          activeScenario,
                        )}
                      </Text>
                    )
                    : null}
                </>
              )
              : null}
          </View>
        )
        : null}
    </View>
  );
}

function ReviewChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.reviewChip,
        active && styles.reviewChipActive,
        pressed && { opacity: 0.82 },
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.reviewChipText,
          active && styles.reviewChipTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ReviewChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.reviewChipRow}>{children}</View>;
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
            {String(activeIndex + 1).padStart(2, "0")} / 06
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
          contextLine={tab.id === "run_timing"
            ? formatPreviousTimingRead(snapshot)
            : undefined}
          contextContent={tab.id === "push"
            ? <PushHistoryDropdown history={snapshot.pushHistory} />
            : tab.id === "activity" && snapshot.activity
            ? <ActivityBreakdown activity={snapshot.activity} />
            : undefined}
        />
      </ActivePrimitivePanel>

      {snapshot.interpretationNote
        ? (
          <EditorialNote
            eyebrow="HOW TO READ TODAY"
            title={snapshot.interpretationNote.headline}
            body={snapshot.interpretationNote.detail}
            icon="compass-outline"
            tint="#FFF6E0"
            accent="#C99B2D"
          />
        )
        : null}

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
    case "run_timing":
      return snapshot.conditionsSuggest;
    case "push":
      return snapshot.push;
    case "fishability":
      return snapshot.fishability;
    case "activity":
      return snapshot.activity ?? {
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

function ActivityBreakdown(
  { activity }: { activity: NonNullable<RiverRunSnapshotResponse["activity"]> },
) {
  const weatherOnly = activity.reasonCodes?.includes("activity_weather_only") ??
    false;
  return (
    <View style={styles.activityBreakdown}>
      {weatherOnly
        ? (
          <View
            style={styles.activityWeatherOnlyNotice}
            accessible
            accessibilityRole="text"
            accessibilityLabel="Limited for this river. Weather-only activity. No live river metrics. Weather inputs only; no measured water temperature, river level, or clarity."
          >
            <View style={styles.activityWeatherOnlyIcon}>
              <Ionicons
                name="cloud-outline"
                size={18}
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
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.9}
              >
                No live river metrics—weather inputs only; no measured water
                temperature, level, or clarity.
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
      {activity.blocks.map((block) => (
        <View
          key={block.id}
          style={[
            styles.activityBlock,
            {
              borderColor: `${activityBlockColor(block.score)}66`,
              backgroundColor: `${activityBlockColor(block.score)}0D`,
            },
          ]}
          accessible
          accessibilityLabel={`${block.label}. ${block.score} out of 100. ${block.activityLabel}.`}
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
                <Text style={styles.activityBlockTime}>{block.label}</Text>
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
      ))}
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

function PrimitiveSection({
  index,
  title,
  visualKind,
  primitive,
  contextLine,
  contextContent,
}: {
  index: string;
  title: string;
  visualKind: RiverRunVisualKind;
  primitive: RiverRunPrimitiveDisplay;
  contextLine?: string;
  contextContent?: ReactNode;
}) {
  const [detailExpanded, setDetailExpanded] = useState(false);
  const unavailable = primitive.score === null ||
    primitive.label === "Unavailable";
  const detailPointCount = primitive.detail
    ? splitPrimitiveDetail(primitive.detail).length
    : 0;
  const visual = resolveRiverRunVisualModel({
    kind: visualKind,
    primitive,
  });
  useEffect(() => {
    setDetailExpanded(false);
  }, [primitive.detail, visualKind]);
  return (
    <View style={styles.primitiveFrame}>
      <View
        style={[
          styles.primitiveCard,
          !primitive.tip && styles.primitiveCardWithoutTip,
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

        <RiverRunVisual kind={visualKind} primitive={primitive} />

        {primitive.headline
          ? (
            <View style={styles.primitiveResult}>
              <PrimitiveHeadlineCopy value={primitive.headline} />
            </View>
          )
          : null}

        {primitive.whereToStart
          ? (
            <View style={styles.primitiveLocation}>
              <View style={styles.primitiveLocationHeading}>
                <Ionicons
                  name="navigate-outline"
                  size={14}
                  color={paper.dashboardBlue}
                />
                <Text style={styles.primitiveLocationLabel}>
                  WHERE TO START
                </Text>
              </View>
              <Text style={styles.primitiveLocationText}>
                {primitive.whereToStart}
              </Text>
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

        {primitive.detail
          ? (
            <View style={styles.primitiveDetail}>
              <Pressable
                style={({ pressed }) => [
                  styles.primitiveDetailHeading,
                  pressed && styles.primitiveDetailHeadingPressed,
                ]}
                onPress={() => {
                  hapticSelection();
                  setDetailExpanded((current) => !current);
                }}
                accessibilityRole="button"
                accessibilityState={{ expanded: detailExpanded }}
                accessibilityLabel={`Why this read. ${detailPointCount} ${
                  detailPointCount === 1 ? "point" : "points"
                }. ${detailExpanded ? "Collapse" : "Expand"}.`}
                hitSlop={6}
              >
                <Ionicons
                  name="reader-outline"
                  size={17}
                  color={paper.dashboardBlue}
                />
                <Text style={styles.primitiveDetailLabel}>WHY THIS READ</Text>
                <Text style={styles.primitiveDetailCount}>
                  {detailPointCount}{" "}
                  {detailPointCount === 1 ? "POINT" : "POINTS"}
                </Text>
                <Ionicons
                  name={detailExpanded ? "chevron-up" : "chevron-down"}
                  size={15}
                  color={paper.dashboardBlue}
                />
              </Pressable>
              {detailExpanded
                ? <PrimitiveDetailCopy value={primitive.detail} />
                : null}
            </View>
          )
          : null}

        {primitive.tip
          ? (
            <View style={styles.primitiveTip}>
              <Text style={styles.primitiveTipLabel}>GUIDE&apos;S READ</Text>
              <PrimitiveGuideReadCopy value={primitive.tip} />
            </View>
          )
          : null}
      </View>
    </View>
  );
}

function PrimitiveHeadlineCopy({ value }: { value: string }) {
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

function PrimitiveDetailCopy({ value }: { value: string }) {
  const detailLines = splitPrimitiveDetail(value);
  return (
    <View
      style={styles.primitiveDetailList}
      accessible
      accessibilityRole="text"
      accessibilityLabel={value}
    >
      {detailLines.map((line, lineIndex) => (
        <View
          key={`${lineIndex}:${line}`}
          style={styles.primitiveDetailBulletRow}
          accessible={false}
        >
          <View style={styles.primitiveDetailBullet} />
          <PrimitiveDetailWordFlow value={line} />
        </View>
      ))}
    </View>
  );
}

function PrimitiveDetailWordFlow({ value }: { value: string }) {
  const words = value.trim().split(/\s+/);
  return (
    <View style={styles.primitiveDetailTextFlow}>
      {words.map((word, wordIndex) => (
        <Text
          key={`${wordIndex}:${word}`}
          style={styles.primitiveDetailWord}
          accessible={false}
        >
          {word}
        </Text>
      ))}
    </View>
  );
}

function PrimitiveGuideReadCopy({ value }: { value: string }) {
  const words = value.trim().split(/\s+/);
  return (
    <View
      key={value}
      style={styles.primitiveTipTextFlow}
      accessible
      accessibilityRole="text"
      accessibilityLabel={value}
    >
      {words.map((word, wordIndex) => (
        <Text
          key={`${wordIndex}:${word}`}
          style={styles.primitiveTipWord}
          accessible={false}
        >
          {word}
        </Text>
      ))}
    </View>
  );
}

function splitPrimitiveDetail(value: string): string[] {
  const sentences = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return (sentences ?? [value])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
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
          {snapshot.safety.gaugeBasis}
        </Text>
      </View>
      {snapshot.secondaryNote
        ? (
          <View style={styles.resultDropdownSection}>
            <Text style={styles.resultDropdownSectionLabel}>FORECAST NOTE</Text>
            <Text style={styles.resultDropdownBody}>
              {snapshot.secondaryNote}
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

function PushHistoryDropdown({
  history,
}: {
  history: RiverRunSnapshotResponse["pushHistory"];
}) {
  const [expanded, setExpanded] = useState(false);
  if (!history) return null;
  if (history.status === "not_started") return null;
  const reads = history.recentDailyReads ?? [];
  const readsAvailable = history.recentDailyReadsStatus !== "unavailable";
  if (history.status === "complete" && reads.length === 0 && readsAvailable) {
    return null;
  }
  const countLabel = reads.length === 1 ? "1 day" : `${reads.length} days`;
  const summary = !readsAvailable
    ? "Recent Push windows are temporarily unavailable"
    : reads.length === 0
    ? "No prior Push windows yet"
    : `Recent Push windows · ${countLabel}`;
  const supportiveSummary = formatLastSupportivePush(history);

  return (
    <View style={styles.pushHistoryCard}>
      <Pressable
        style={({ pressed }) => [
          styles.pushHistorySummary,
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => {
          hapticSelection();
          setExpanded((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${summary}. ${
          expanded ? "Collapse" : "Expand"
        } recent Push windows.`}
      >
        <Ionicons
          name="time-outline"
          size={15}
          color={paper.dashboardBlue}
        />
        <Text style={styles.pushHistorySummaryText}>{summary}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={15}
          color={paper.dashboardBlue}
        />
      </Pressable>
      {expanded
        ? (
          <View style={styles.pushHistoryExpanded}>
            {readsAvailable && reads.length > 0
              ? reads.map((read) => (
                <View key={read.localDate} style={styles.pushHistoryRow}>
                  <View
                    style={[
                      styles.pushHistoryDot,
                      {
                        backgroundColor: pushHistoryColor(
                          read.label,
                          read.status,
                        ),
                      },
                    ]}
                  />
                  <Text style={styles.pushHistoryDate}>
                    {formatLocalDate(read.localDate)}
                  </Text>
                  <Text style={styles.pushHistoryLabel}>
                    {formatPushHistoryWindow(read)}
                  </Text>
                </View>
              ))
              : (
                <Text style={styles.pushHistoryEmpty}>
                  {readsAvailable
                    ? "The first completed daily read will appear tomorrow."
                    : "Check again after the next successful refresh."}
                </Text>
              )}
            {supportiveSummary
              ? (
                <View style={styles.pushHistorySupportive}>
                  <Text style={styles.pushHistorySupportiveText}>
                    {supportiveSummary}
                  </Text>
                </View>
              )
              : null}
          </View>
        )
        : null}
    </View>
  );
}

function formatLastSupportivePush(
  history: RiverRunSnapshotResponse["pushHistory"],
): string | undefined {
  if (
    (history.status === "active_now" ||
      history.status === "previously_recorded") &&
    history.lastSupportiveConditions
  ) {
    const signal = history.lastSupportiveConditions;
    return `${
      history.status === "active_now"
        ? "Supportive signal today"
        : "Last supportive signal this season"
    }: ${signal.label} · ${formatLocalDate(signal.localDate)}`;
  }
  if (history.status === "none_recorded") {
    return "No Possible-or-stronger signal has been recorded this season.";
  }
  if (history.status === "unavailable") {
    return "The last-supportive-signal lookup is temporarily unavailable.";
  }
  return undefined;
}

function pushHistoryColor(
  label: string,
  status: "supportive_window" | "no_supportive_window" | "missing",
): string {
  if (
    status === "missing" ||
    status === "no_supportive_window" ||
    label === "Unavailable"
  ) {
    return paper.dashboardMuted;
  }
  switch (label) {
    case "Weak":
      return "#D94A3A";
    case "No clear push":
      return "#D58B32";
    case "Possible":
      return "#D6AD31";
    case "Strong":
      return "#58A85D";
    case "Very strong":
      return "#27874D";
    default:
      return paper.dashboardMuted;
  }
}

function formatPushHistoryWindow(
  read: NonNullable<
    RiverRunSnapshotResponse["pushHistory"]["recentDailyReads"]
  >[number],
): string {
  if (read.status !== "supportive_window" || !read.refreshSlot) {
    return read.label;
  }
  return `${read.label} · peak ${formatRefreshSlotTime(read.refreshSlot)}`;
}

function formatRefreshSlotTime(value: string): string {
  const [rawHour, rawMinute = "00"] = value.split(":");
  const hour = Number(rawHour);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${rawMinute} ${suffix}`;
}

function formatPreviousTimingRead(
  snapshot: RiverRunSnapshotResponse,
): string | undefined {
  const timing = snapshot.conditionsSuggest;
  if (!timing.previousCheckpointDate || !timing.previousTimingLabel) {
    return undefined;
  }
  return `Previous timing read: ${timing.previousTimingLabel} · ${
    formatLocalDate(timing.previousCheckpointDate)
  }`;
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

function reviewScenarioDateCopy(
  groupId: string | undefined,
  scenario: RiverRunReviewScenario,
): string {
  const date = formatLocalDate(scenario.snapshot.localDate);
  switch (groupId) {
    case "run_stage":
      if (
        scenario.snapshot.runId === "pere_marquette_fall_steelhead" &&
        scenario.id === "stage_offseason"
      ) {
        return `AUDIT ONLY · Representative offseason review date: ${date}.`;
      }
      return `AUDIT ONLY · State begins ${date}.`;
    case "conditions":
      if (scenario.snapshot.conditionsSuggest.label === "Unavailable") {
        return `AUDIT ONLY · Unavailable for this river at every date; fixture date: ${date}.`;
      }
      return `AUDIT ONLY · Checkpoint or review date: ${date}.`;
    case "push":
      if (scenario.snapshot.push.label === "Unavailable") {
        return `AUDIT ONLY · Unavailable for this river at every date; fixture date: ${date}.`;
      }
      return `AUDIT ONLY · Condition example dated ${date}; Push states are driven by live conditions, not a fixed calendar date.`;
    case "fishability":
      if (scenario.snapshot.fishability.label === "Unavailable") {
        return `AUDIT ONLY · Unavailable for this river at every date; fixture date: ${date}.`;
      }
      return `AUDIT ONLY · Condition example dated ${date}; Fishability states are driven by live flow, not a fixed calendar date.`;
    case "fish_in_river":
      return `AUDIT ONLY · Seasonal curve date: ${date}; the value can change daily between configured anchors.`;
    default:
      return `AUDIT ONLY · Review fixture date: ${date}.`;
  }
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
  fixtureNotice: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "rgba(192,57,43,0.22)",
    borderRadius: 8,
    backgroundColor: "#FBE8E4",
  },
  fixtureNoticeText: {
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    lineHeight: 13,
    letterSpacing: 1.1,
    textAlign: "center",
    color: paper.redDk,
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
    transform: [{ scale: 1.48 }],
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
  reviewControl: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(192,57,43,0.25)",
    borderRadius: 10,
    backgroundColor: "#FFF7F2",
  },
  reviewSummary: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  reviewSummaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBE4E1",
  },
  reviewSummaryCopy: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  reviewSummaryEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1,
    color: paper.redDk,
  },
  reviewSummaryTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12.5,
    color: paper.dashboardInk,
  },
  reviewExpanded: {
    gap: 12,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(192,57,43,0.18)",
  },
  reviewHelp: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  reviewSectionLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
  },
  reviewChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  reviewChip: {
    minHeight: 37,
    justifyContent: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 7,
    backgroundColor: paper.dashboardWhite,
  },
  reviewChipActive: {
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardInk,
  },
  reviewChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.dashboardInk,
  },
  reviewChipTextActive: { color: "#FFFFFF" },
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
    lineHeight: 23,
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
  unavailable: { color: paper.dashboardMuted },
  primitiveResult: {
    alignSelf: "stretch",
    minWidth: 0,
    marginTop: 17,
    paddingBottom: 1,
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
  primitiveLocation: {
    marginTop: 13,
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.18)",
    borderRadius: 8,
    backgroundColor: "#EEF6FB",
  },
  primitiveLocationHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  primitiveLocationLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1.35,
    color: paper.dashboardBlue,
  },
  primitiveLocationText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 19,
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
  pushHistoryCard: {
    marginTop: 13,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.16)",
    borderRadius: 8,
    backgroundColor: "#EEF6FB",
  },
  pushHistorySummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pushHistorySummaryText: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  pushHistoryExpanded: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(15,99,176,0.12)",
  },
  pushHistoryRow: {
    minHeight: 33,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(17,45,64,0.12)",
  },
  pushHistoryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pushHistoryDate: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.8,
    color: paper.dashboardMuted,
  },
  pushHistoryLabel: {
    flexShrink: 0,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 17,
    color: paper.dashboardInk,
  },
  pushHistoryEmpty: {
    paddingTop: 10,
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: paper.dashboardMuted,
  },
  pushHistorySupportive: {
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(17,45,64,0.16)",
  },
  pushHistorySupportiveText: {
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  primitiveDetail: {
    marginHorizontal: -18,
    marginTop: 15,
    paddingHorizontal: 18,
    paddingVertical: 15,
    gap: 7,
    borderTopWidth: 1,
    borderTopColor: "rgba(15,99,176,0.14)",
    backgroundColor: "#F2F6F8",
  },
  primitiveDetailHeading: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  primitiveDetailHeadingPressed: {
    opacity: 0.72,
  },
  primitiveDetailLabel: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    letterSpacing: 1.45,
    color: paper.dashboardBlue,
  },
  primitiveDetailCount: {
    flexShrink: 0,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 0.9,
    color: paper.dashboardMuted,
  },
  primitiveDetailList: {
    alignSelf: "stretch",
    gap: 8,
  },
  primitiveDetailBulletRow: {
    position: "relative",
    alignSelf: "stretch",
    paddingLeft: 15,
  },
  primitiveDetailBullet: {
    position: "absolute",
    top: 8,
    left: 1,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(15,99,176,0.55)",
  },
  primitiveDetailTextFlow: {
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 3.5,
    rowGap: 0,
  },
  primitiveDetailWord: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 21,
    color: "#52606A",
  },
  primitiveTip: {
    marginHorizontal: -18,
    marginTop: 0,
    paddingHorizontal: 18,
    paddingVertical: 15,
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
    backgroundColor: "#F8F6EF",
  },
  primitiveTipLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: paper.redDk,
  },
  primitiveTipTextFlow: {
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 3.5,
    rowGap: 0,
    paddingBottom: 2,
  },
  primitiveTipWord: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 14,
    lineHeight: 21,
    color: paper.dashboardInk,
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
  activityBreakdown: { gap: 10, paddingTop: 4 },
  activityWeatherOnlyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(197,103,43,0.42)",
    borderRadius: 10,
    backgroundColor: "#FFF3E8",
  },
  activityWeatherOnlyIcon: {
    width: 26,
    height: 26,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "rgba(216,120,53,0.14)",
  },
  activityWeatherOnlyCopy: {
    minWidth: 0,
    flex: 1,
    gap: 1,
  },
  activityWeatherOnlyEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 1,
    color: "#A85220",
  },
  activityWeatherOnlyTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: paper.dashboardInk,
  },
  activityWeatherOnlyBody: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 10.5,
    lineHeight: 14,
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
