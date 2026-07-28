import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  AppState,
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
import { FeedbackCard } from "../components/FeedbackCard";
import { fetchRiverRunCatalog, fetchRiverRunSnapshot } from "../lib/riverRun";
import {
  formatRiverRunSeason,
  formatRiverRunSpecies,
  resolveRiverRunTarget,
  riverRunRiverChoices,
  riverRunSeasonChoices,
  riverRunSpeciesChoices,
  riverRunStateChoices,
  type RiverRunChoice,
} from "../lib/riverRunCatalogSelection";
import type {
  RiverRunCatalogResponse,
  RiverRunPrimitiveDisplay,
  RiverRunSeason,
  RiverRunSnapshotResponse,
} from "../lib/riverRunContracts";
import {
  RIVER_RUN_REVIEW_GROUPS,
  type RiverRunReviewGroup,
  type RiverRunReviewScenario,
} from "../lib/riverRunReviewFixtures";
import { getRiverRunSpeciesImage } from "../lib/riverRunSpeciesImages";
import {
  hapticImpact,
  hapticSelection,
  ImpactFeedbackStyle,
} from "../lib/safeHaptics";
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
} from "../lib/theme";
import { useAuthStore } from "../store/authStore";

type WizardStep = 1 | 2 | 3 | 4;
type ScreenState = "setup" | "result";

const RIVER_RUN_REVIEW_ENABLED = __DEV__ &&
  process.env.EXPO_PUBLIC_RIVER_RUN_REVIEW_MODE === "true";
const CHINOOK_IMAGE = getRiverRunSpeciesImage("chinook_salmon");

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
  }
> = {
  1: {
    label: "STATE",
    eyebrow: "CHOOSE A REGION",
    question: "Where is the run?",
    caption: "Select a state with a fully audited River Run.",
    icon: "map-outline",
  },
  2: {
    label: "RUN TYPE",
    eyebrow: "CHOOSE A SEASON",
    question: "Which run are you following?",
    caption: "Select the seasonal migration you want FinFindr to read.",
    icon: "calendar-outline",
  },
  3: {
    label: "SPECIES",
    eyebrow: "CHOOSE A SPECIES",
    question: "What is moving?",
    caption: "Select the migratory species you want to follow.",
    icon: "fish-outline",
  },
  4: {
    label: "RIVER",
    eyebrow: "CHOOSE A RIVER",
    question: "Which river should we read?",
    caption: "Only audited rivers with complete data coverage appear here.",
    icon: "water-outline",
  },
};

export default function RiverRunScreen() {
  const router = useRouter();
  const { profile, user } = useAuthStore();
  const [screenState, setScreenState] = useState<ScreenState>("setup");
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [reviewMode, setReviewMode] = useState(RIVER_RUN_REVIEW_ENABLED);
  const [reviewGroupId, setReviewGroupId] = useState(
    RIVER_RUN_REVIEW_GROUPS[0]?.id ?? "",
  );
  const [reviewScenarioId, setReviewScenarioId] = useState(
    RIVER_RUN_REVIEW_GROUPS[0]?.scenarios[0]?.id ?? "",
  );
  const [catalog, setCatalog] = useState<RiverRunCatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(!reviewMode);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] =
    useState<RiverRunSeason | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedRiverId, setSelectedRiverId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<RiverRunSnapshotResponse | null>(
    null,
  );
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const snapshotRequestRef = useRef(0);

  const reviewGroup = useMemo(
    () =>
      RIVER_RUN_REVIEW_GROUPS.find((group) => group.id === reviewGroupId) ??
        RIVER_RUN_REVIEW_GROUPS[0],
    [reviewGroupId],
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
        error instanceof Error ? error.message : "River Run failed to load.",
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
      activeCatalog
        ? riverRunSeasonChoices(activeCatalog, selectedState)
        : [],
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
      });
      if (requestId === snapshotRequestRef.current) setSnapshot(next);
    } catch (error) {
      if (requestId === snapshotRequestRef.current) {
        setSnapshot(null);
        setSnapshotError(
          error instanceof Error
            ? error.message
            : "River Run snapshot failed to load.",
        );
      }
    } finally {
      if (requestId === snapshotRequestRef.current) {
        setLoadingSnapshot(false);
      }
    }
  }, [reviewMode, screenState, selectedTarget]);

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
    currentChoices.some((choice) => choice.id === currentSelection);

  const selectChoice = useCallback((choice: RiverRunChoice) => {
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

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    if (wizardStep < 4) {
      hapticSelection();
      setWizardStep((wizardStep + 1) as WizardStep);
      return;
    }
    hapticImpact(ImpactFeedbackStyle.Medium);
    setSnapshot(null);
    setSnapshotError(null);
    setScreenState("result");
    if (!reviewMode) setLoadingSnapshot(true);
  }, [canContinue, reviewMode, wizardStep]);

  const handleModeChange = useCallback((nextReviewMode: boolean) => {
    if (nextReviewMode === reviewMode) return;
    hapticSelection();
    setReviewMode(nextReviewMode);
    setScreenState("setup");
    resetSelection();
  }, [resetSelection, reviewMode]);

  const resultSnapshot = reviewMode ? reviewScenario?.snapshot : snapshot;
  const resultSeason = selectedTarget?.run.season ?? selectedSeason ?? "fall";
  const resultSpecies = selectedTarget?.run.species ??
    selectedSpecies ??
    "chinook_salmon";
  const navSpecies = formatRiverRunSpecies(resultSpecies)
    .replace(/\s+Salmon$/i, "");
  const navTitle = screenState === "result"
    ? `${formatRiverRunSeason(resultSeason).toUpperCase()} ${
      navSpecies.toUpperCase()
    }`
    : "RIVER RUN";

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
      <PaperNavHeader
        eyebrow={screenState === "result"
          ? "FINFINDR · RIVER RUN"
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
            />
          )
          : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.resultContent}
              showsVerticalScrollIndicator={false}
              refreshControl={reviewMode
                ? undefined
                : (
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
              />

              {RIVER_RUN_REVIEW_ENABLED
                ? (
                  <ReviewControl
                    reviewMode={reviewMode}
                    activeGroup={reviewGroup}
                    activeScenario={reviewScenario}
                    onModeChange={handleModeChange}
                    onGroupChange={(group) => {
                      setReviewGroupId(group.id);
                      setReviewScenarioId(group.scenarios[0]?.id ?? "");
                    }}
                    onScenarioChange={(scenario) =>
                      setReviewScenarioId(scenario.id)}
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
                    <SnapshotView snapshot={resultSnapshot} />
                    <FeedbackCard
                      featureName="River Run Coverage"
                      topic="feature"
                      variant="request"
                      eyebrow="EXPAND RIVER RUN"
                      title="What should we add next?"
                      body="Request a state, river, run type, or species. Your requests help decide where FinFindr expands next."
                      actionLabel="REQUEST COVERAGE"
                      profile={profile}
                      user={user}
                      contextLines={[
                        "Request category: River Run coverage",
                        `Current state: ${
                          selectedTarget?.state.displayName ??
                            selectedTarget?.state.state ??
                            "unknown"
                        }`,
                        `Current run type: ${
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
                    body="FinFindr could not find a completed River Run snapshot for this selection."
                    actionLabel="BACK TO SETUP"
                    onAction={returnToSetup}
                  />
                )}
            </ScrollView>
          )}
      </View>
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
      accessibilityLabel="Edit River Run selection"
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
}) {
  const config = STEP_CONFIG[step];
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.setupContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.setupHero}>
        <SectionEyebrow color={paper.red}>RIVER RUN SETUP</SectionEyebrow>
        <Text style={styles.setupHeroTitle} allowFontScaling={false}>
          FOLLOW THE{"\n"}
          <Text style={styles.setupHeroAccent}>MIGRATION.</Text>
        </Text>
        <Text style={styles.setupHeroSubtitle}>
          Choose an audited run and FinFindr will assemble today&apos;s measured
          river read.
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
              REVIEW BUILD · LOCAL FIXTURES · NO LIVE RIVER RUN REQUESTS
            </Text>
          </View>
        )
        : null}

      <WizardProgress current={step} />

      {loading
        ? <LoadingState label="Loading supported River Runs" compact />
        : error
        ? (
          <MessageState
            icon="warning-outline"
            title="River Run is unavailable"
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
                    FinFindr only shows combinations with completed River Run
                    configuration and evidence coverage.
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
                {step === 4 ? "VIEW RIVER RUN" : "CONTINUE"}
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

      <Text style={styles.setupDisclaimer}>
        Only river, run, gauge, and measured-water configurations that pass
        FinFindr&apos;s audit appear here.
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
  const speciesImage = step === 3
    ? getRiverRunSpeciesImage(choice.id)
    : null;
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
        speciesImage && styles.speciesChoiceCard,
        selected && styles.choiceCardSelected,
        pressed && { opacity: 0.88 },
      ]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
    >
      {speciesImage
        ? (
          <View style={styles.speciesChoiceImageStage}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlue}
              count={4}
            />
            <Image
              source={speciesImage}
              style={styles.speciesChoiceImage}
              resizeMode="contain"
            />
          </View>
        )
        : (
          <View
            style={[
              styles.choiceIcon,
              selected && styles.choiceIconSelected,
            ]}
          >
            <Ionicons
              name={icon}
              size={22}
              color={selected ? paper.redDk : paper.dashboardBlue}
            />
          </View>
        )}
      <View
        style={[
          styles.choiceCopy,
          speciesImage && styles.speciesChoiceCopy,
        ]}
      >
        <Text
          style={styles.choiceTitle}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.84}
        >
          {choice.label}
        </Text>
        {choice.subtitle
          ? <Text style={styles.choiceSubtitle}>{choice.subtitle}</Text>
          : null}
      </View>
      <View
        style={[
          styles.choiceCheck,
          speciesImage && styles.speciesChoiceCheck,
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
}: {
  season: RiverRunSeason;
  species: string;
  snapshot?: RiverRunSnapshotResponse | null;
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
        Today&apos;s measured read of movement, river conditions, fishability,
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
            {snapshot ? formatLocalDate(snapshot.localDate) : "Preview"}
          </Text>
        </View>
        <View style={styles.resultHeroMetaRule} />
        <View style={styles.resultHeroMetaItem}>
          <Text style={styles.resultHeroMetaLabel}>EVIDENCE</Text>
          <Text style={styles.resultHeroMetaValue}>
            {snapshot?.dataQuality.label ?? "Review"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ReviewControl({
  reviewMode,
  activeGroup,
  activeScenario,
  onModeChange,
  onGroupChange,
  onScenarioChange,
}: {
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
              ? `${activeGroup?.label ?? "River Run"} · ${
                activeScenario?.label ?? "State"
              }`
              : "Current-date River Run response"}
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
              Fixtures stay on this phone and make no River Run API request.
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
                    {RIVER_RUN_REVIEW_GROUPS.map((group) => (
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
                        label={scenario.label}
                        active={scenario.id === activeScenario?.id}
                        onPress={() => onScenarioChange(scenario)}
                      />
                    ))}
                  </ReviewChipRow>
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

function SnapshotView({ snapshot }: { snapshot: RiverRunSnapshotResponse }) {
  return (
    <View style={styles.snapshotStack}>
      <View style={styles.primitiveStack}>
        <PrimitiveSection
          index="01"
          title="Run Stage"
          primitive={snapshot.runStage}
        />
        <PrimitiveSection
          index="02"
          title="Conditions Suggest"
          primitive={snapshot.conditionsSuggest}
        />
        <PrimitiveSection
          index="03"
          title="Push"
          primitive={snapshot.push}
          contextLine={formatPushHistory(snapshot)}
        />
        <PrimitiveSection
          index="04"
          title="Fishability"
          primitive={snapshot.fishability}
        />
        <PrimitiveSection
          index="05"
          title="Fish In River"
          primitive={snapshot.fishInRiver}
        />
      </View>

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

      {snapshot.secondaryNote
        ? (
          <EditorialNote
            eyebrow="FORECAST NOTE"
            body={snapshot.secondaryNote}
            icon="telescope-outline"
            tint="#EAF3FA"
            accent={paper.dashboardBlue}
          />
        )
        : null}

      <EvidenceSection snapshot={snapshot} />

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
        <Text style={styles.safetySub}>{snapshot.safety.gaugeBasis}</Text>
        <Text style={styles.safetySub}>
          {snapshot.safety.activityDisclaimer}
        </Text>
      </View>
    </View>
  );
}

function PrimitiveSection({
  index,
  title,
  primitive,
  contextLine,
}: {
  index: string;
  title: string;
  primitive: RiverRunPrimitiveDisplay;
  contextLine?: string;
}) {
  const unavailable = primitive.score === null ||
    primitive.label === "Unavailable";
  return (
    <View
      style={[
        styles.primitiveCard,
        !primitive.tip && styles.primitiveCardWithoutTip,
      ]}
    >
      <View style={styles.primitiveAccent} />
      <View style={styles.primitiveHeader}>
        <View style={styles.primitiveIdentity}>
          <Text style={styles.primitiveIndex}>{index}</Text>
          <Text style={styles.primitiveTitle}>{title.toUpperCase()}</Text>
        </View>
        {typeof primitive.score === "number"
          ? (
            <View style={styles.primitiveScore}>
              <Text
                style={[
                  styles.primitiveScoreValue,
                  unavailable && styles.unavailable,
                ]}
              >
                {Math.round(primitive.score)}
              </Text>
              {typeof primitive.maximum === "number"
                ? (
                  <Text style={styles.primitiveScoreMax}>
                    / {Math.round(primitive.maximum)}
                  </Text>
                )
                : null}
            </View>
          )
          : (
            <View style={styles.primitiveNoScore}>
              <Text style={styles.primitiveNoScoreText}>CONTEXT</Text>
            </View>
          )}
      </View>

      <Text
        style={[
          styles.primitiveLabel,
          unavailable && styles.unavailable,
        ]}
      >
        {primitive.label}
      </Text>

      {primitive.headline
        ? <Text style={styles.primitiveHeadline}>{primitive.headline}</Text>
        : null}

      {contextLine
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
        : null}

      {primitive.detail
        ? <Text style={styles.primitiveDetail}>{primitive.detail}</Text>
        : null}

      {primitive.tip
        ? (
          <View style={styles.primitiveTip}>
            <Text style={styles.primitiveTipLabel}>GUIDE&apos;S READ</Text>
            <Text style={styles.primitiveTipText}>{primitive.tip}</Text>
          </View>
        )
        : null}
    </View>
  );
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

function EvidenceSection({
  snapshot,
}: {
  snapshot: RiverRunSnapshotResponse;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.evidenceCard}>
      <Pressable
        style={({ pressed }) => [
          styles.evidenceSummary,
          pressed && { opacity: 0.84 },
        ]}
        onPress={() => {
          hapticSelection();
          setExpanded((current) => !current);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <View style={styles.evidenceSummaryIcon}>
          <Ionicons
            name="analytics-outline"
            size={19}
            color={paper.dashboardBlue}
          />
        </View>
        <View style={styles.evidenceSummaryCopy}>
          <Text style={styles.cardEyebrow}>DATA BEHIND THIS READ</Text>
          <Text style={styles.evidenceTitle}>
            {snapshot.dataQuality.label} evidence
          </Text>
          <Text style={styles.evidenceMeta}>
            {formatLocalDate(snapshot.localDate)} · {snapshot.refreshSlot}
          </Text>
        </View>
        <View style={styles.evidenceAction}>
          <Text style={styles.evidenceActionText}>
            {expanded ? "HIDE" : "VIEW"}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={15}
            color={paper.dashboardInk}
          />
        </View>
      </Pressable>

      {expanded
        ? (
          <View style={styles.evidenceExpanded}>
            <Text style={styles.evidenceGroupTitle}>FRESHNESS</Text>
            <View style={styles.metaGrid}>
              <MetaItem
                label="Gauge"
                value={formatMeta(snapshot.freshness.gauge)}
              />
              <MetaItem
                label="Weather"
                value={formatMeta(snapshot.freshness.weather)}
              />
              <MetaItem
                label="Water temp"
                value={formatMeta(snapshot.freshness.waterTemperature)}
              />
              <MetaItem
                label="Next refresh"
                value={formatLocalDateTime(snapshot.nextConditionRefreshAt)}
              />
            </View>

            <Text style={styles.evidenceGroupTitle}>MEASURED INPUTS</Text>
            <View style={styles.metaGrid}>
              <MetaItem
                label="Gauge reading"
                value={formatGaugeReading(snapshot)}
              />
              <MetaItem
                label="River band"
                value={formatMeta(snapshot.gauge?.band ?? undefined)}
              />
              <MetaItem
                label="24h trend"
                value={formatMeta(snapshot.gauge?.trend ?? undefined)}
              />
              <MetaItem
                label="Rain estimate · 48h"
                value={formatRain(snapshot.weather?.rain48hIn)}
              />
              <MetaItem
                label="Water temp"
                value={formatWaterTemperature(snapshot)}
              />
              <MetaItem
                label="Temp source"
                value={formatWaterTemperatureSource(snapshot)}
              />
              <MetaItem
                label="Gauge source"
                value={snapshot.gauge?.provider && snapshot.gauge?.siteId
                  ? `${snapshot.gauge.provider} ${snapshot.gauge.siteId}`
                  : "Unknown"}
              />
              <MetaItem
                label="Weather source"
                value={formatWeatherSource(snapshot)}
              />
            </View>
          </View>
        )
        : null}
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
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

function formatMeta(value: string | undefined): string {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function formatLocalDateTime(value: string): string {
  if (!value) return "Unknown";
  return value.replace("T", " ").slice(0, 16);
}

function formatPushHistory(
  snapshot: RiverRunSnapshotResponse,
): string | undefined {
  const history = snapshot.pushHistory;
  if (!history) return undefined;
  if (history.status === "not_started" || history.status === "complete") {
    return undefined;
  }
  if (history.status === "active_now") {
    const current = history.lastSupportiveConditions;
    return current
      ? `Current supportive Push signal: ${current.label} · ${
        formatLocalDate(current.localDate)
      }`
      : "A supportive Push signal is active today.";
  }
  if (history.status === "unavailable") {
    return "Supportive Push-signal history is temporarily unavailable.";
  }
  if (
    history.status === "previously_recorded" &&
    history.lastSupportiveConditions
  ) {
    const last = history.lastSupportiveConditions;
    return `Last supportive Push signal: ${last.label} · ${
      formatLocalDate(last.localDate)
    }`;
  }
  return "No supportive Push signal has been recorded yet this run.";
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

function formatGaugeReading(snapshot: RiverRunSnapshotResponse): string {
  const value = snapshot.gauge?.value;
  if (typeof value !== "number") return "Unavailable";
  const metric = snapshot.gauge?.primaryMetric;
  const unit = metric === "flow_cfs"
    ? "cfs"
    : metric === "gage_height_ft"
    ? "ft"
    : "";
  return `${Math.round(value * 10) / 10}${unit ? ` ${unit}` : ""}`;
}

function formatWaterTemperature(
  snapshot: RiverRunSnapshotResponse,
): string {
  const value = snapshot.waterTemperature?.waterTempF;
  const trend = formatMeta(snapshot.waterTemperature?.trend);
  if (typeof value !== "number" || !Number.isFinite(value)) return trend;
  return `${value.toFixed(1)}°F · ${trend}`;
}

function formatWaterTemperatureSource(
  snapshot: RiverRunSnapshotResponse,
): string {
  const source = snapshot.waterTemperature;
  if (!source?.sourceId) return "Unavailable";
  return `${source.provider ?? "Measured"} · ${source.sourceId}${
    source.isUpstreamFallback ? " (upstream)" : ""
  }`;
}

function formatRain(value: number | null | undefined): string {
  return typeof value === "number" ? `${value.toFixed(2)} in` : "Unavailable";
}

function formatWeatherSource(snapshot: RiverRunSnapshotResponse): string {
  const weather = snapshot.weather;
  if (!weather?.provider) return "Unavailable";
  return weather.evidenceType === "modeled_grid"
    ? `${weather.provider} · modeled grid`
    : weather.provider;
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
    paddingTop: 22,
    paddingBottom: 64,
    gap: 16,
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
    minHeight: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 9,
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
    paddingVertical: 22,
    gap: 18,
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
  choiceStack: { gap: 12 },
  choiceCard: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 13,
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
  choiceIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.22)",
    backgroundColor: "#EAF3FA",
  },
  choiceIconSelected: {
    borderColor: "rgba(192,57,43,0.25)",
    backgroundColor: "#FBE4E1",
  },
  choiceCopy: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  choiceTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: paper.dashboardInk,
  },
  choiceSubtitle: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    color: paper.dashboardMuted,
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
  speciesChoiceCheck: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  speciesChoiceCard: {
    minHeight: 230,
    flexDirection: "column",
    padding: 0,
    gap: 0,
    overflow: "hidden",
  },
  speciesChoiceImageStage: {
    width: "100%",
    height: 165,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
  },
  speciesChoiceImage: {
    width: "94%",
    height: "94%",
  },
  speciesChoiceCopy: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    height: 190,
    alignItems: "center",
    justifyContent: "center",
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
  snapshotStack: { gap: 16 },
  primitiveStack: { gap: 14 },
  primitiveCard: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
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
  primitiveScore: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
  },
  primitiveScoreValue: {
    fontFamily: paperFonts.monoBold,
    fontSize: 28,
    lineHeight: 32,
    color: paper.dashboardInk,
  },
  primitiveScoreMax: {
    fontFamily: paperFonts.monoBold,
    fontSize: 11,
    color: paper.dashboardMuted,
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
  primitiveLabel: {
    marginTop: 6,
    fontFamily: paperFonts.display,
    fontSize: 29,
    lineHeight: 33,
    color: paper.dashboardInk,
  },
  primitiveHeadline: {
    marginTop: 11,
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
  primitiveDetail: {
    marginTop: 11,
    marginBottom: 17,
    fontFamily: paperFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: paper.dashboardMuted,
  },
  primitiveTip: {
    marginHorizontal: -18,
    marginTop: 1,
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
  primitiveTipText: {
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
  evidenceCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 11,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  evidenceSummary: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
  },
  evidenceSummaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,99,176,0.2)",
    backgroundColor: "#EAF3FA",
  },
  evidenceSummaryCopy: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  evidenceTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    color: paper.dashboardInk,
  },
  evidenceMeta: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11.5,
    color: paper.dashboardMuted,
  },
  evidenceAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  evidenceActionText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1,
    color: paper.dashboardInk,
  },
  evidenceExpanded: {
    gap: 11,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
    backgroundColor: "#FAFAF8",
  },
  evidenceGroupTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: paper.dashboardBlue,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  metaItem: {
    width: "47%",
    minWidth: 135,
    flexGrow: 1,
    padding: 11,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    borderRadius: 7,
    backgroundColor: paper.dashboardWhite,
  },
  metaLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: paper.dashboardMuted,
  },
  metaValue: {
    marginTop: 5,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    lineHeight: 17,
    textTransform: "capitalize",
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
