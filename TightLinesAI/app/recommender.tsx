/**
 * app/recommender.tsx — Lure & Fly Recommender screen.
 *
 * Receives from router params:
 *   latitude    number (string in params)
 *   longitude   number (string in params)
 *   species?    SpeciesGroup (pre-selected from home card)
 *   context?    EngineContext (pre-selected)
 *
 * Screen flow:
 *   1. Setup form: species selector + context selector + water clarity chips + goal chips
 *   2. Tap "Build plan" → loading state
 *   3. RecommenderView with results
 *   4. Pull-to-refresh for fresh results
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import {
  hapticImpact,
  hapticSelection,
  ImpactFeedbackStyle,
} from "../lib/safeHaptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  colors,
  fonts,
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
  radius,
  shadows,
  spacing,
} from "../lib/theme";
import {
  CornerMarkSet,
  PaperBackground,
  SectionEyebrow,
  TopographicLines,
} from "../components/paper";
import { getSpeciesImage } from "../lib/speciesImages";
import { getWatertypeImage } from "../lib/watertypeImages";
import { getWaterclarityImage } from "../lib/waterclarityImages";
import { getRecommendationGoalImage } from "../lib/recommendationGoalImages";
import { Asset } from "expo-asset";
import { useAuthStore } from "../store/authStore";
import { fetchRecommendation } from "../lib/recommender";
import { nearestUsStateCode } from "../lib/locationSearch";
import {
  getForecastScores,
  mergeMeasuredWaterTempFields,
} from "../lib/forecastScores";
import { getEnvironment } from "../lib/env";
import { RecommenderView } from "../components/fishing/RecommenderView";
import { RecommenderLoadingSkeleton } from "../components/fishing/RecommenderLoadingSkeleton";
import { SubscribePrompt } from "../components/SubscribePrompt";
import type {
  DailyPicksSpecies,
  DailyPicksVariant,
  EngineContext,
  RecommendationGoal,
  RecommenderResponse,
  SpeciesGroup,
  WaterClarity,
} from "../lib/recommenderContracts";
import {
  canContinueRecommenderSession,
  canGenerateRecommenderReport,
  getEffectiveTier,
} from "../lib/subscription";
import {
  DAILY_PICKS_UI_CONTEXTS,
  DAILY_PICKS_UI_SPECIES,
  getRecommenderContextsForState,
  getRecommenderContextsForStateSpecies,
  getRecommenderSpeciesForState,
  isDailyPicksUiContext,
  isDailyPicksUiSpecies,
  SPECIES_DISPLAY,
} from "../lib/recommenderContracts";

const RIPPLE = { color: "rgba(10,22,40,0.08)" };

const DAILY_PICKS_SPECIES_IMAGE_KEY: Record<DailyPicksSpecies, SpeciesGroup> = {
  largemouth_bass: "largemouth_bass",
  smallmouth_bass: "smallmouth_bass",
  northern_pike: "pike_musky",
  trout: "river_trout",
};

function getRecommenderResultSpeciesImage(result: RecommenderResponse) {
  return getSpeciesImage(DAILY_PICKS_SPECIES_IMAGE_KEY[result.species]);
}

// ─── Context helpers ──────────────────────────────────────────────────────────

const ENGINE_CONTEXTS: EngineContext[] = [
  ...DAILY_PICKS_UI_CONTEXTS,
];

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case "freshwater_lake_pond":
      return "Lake / Pond";
    case "freshwater_river":
      return "River / Stream";
    case "coastal":
      return "Coastal";
    case "coastal_flats_estuary":
      return "Flats / Estuary";
    default:
      return "Freshwater";
  }
}

function contextIcon(ctx: EngineContext): string {
  switch (ctx) {
    case "freshwater_lake_pond":
      return "water-outline";
    case "freshwater_river":
      return "git-merge-outline";
    default:
      return "water-outline";
  }
}

function contextAccentColor(ctx: EngineContext): string {
  switch (ctx) {
    case "freshwater_lake_pond":
      return colors.contextFreshwater;
    case "freshwater_river":
      return colors.contextFreshwater;
    default:
      return colors.contextFreshwater;
  }
}

function defaultContextsForSpecies(species: SpeciesGroup): EngineContext[] {
  switch (species) {
    case "river_trout":
      return ["freshwater_river"];
    case "largemouth_bass":
    case "smallmouth_bass":
    case "pike_musky":
      return [...ENGINE_CONTEXTS];
    default:
      return [];
  }
}

// ─── State code extraction ────────────────────────────────────────────────────

const STATE_NAME_TO_CODE: Record<string, string> = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY",
};

async function resolveStateCode(lat: number, lon: number): Promise<string> {
  try {
    const [geo] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });
    if (!geo) return "XX";
    const region = geo.region ?? "";
    if (region.length === 2 && /^[A-Z]{2}$/.test(region)) return region;
    return STATE_NAME_TO_CODE[region] ?? "XX";
  } catch {
    return "XX";
  }
}

function stateCodeFromLocationLabel(label: string | undefined): string | null {
  if (!label) return null;
  const region = label.split(",").at(-1)?.trim() ?? "";
  if (/^[A-Z]{2}$/.test(region) && Object.values(STATE_NAME_TO_CODE).includes(region)) {
    return region;
  }
  return STATE_NAME_TO_CODE[region] ?? null;
}

function recommenderErrorMessage(
  error: unknown,
  species: SpeciesGroup,
  context: EngineContext,
): string {
  const msg = error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
  if (msg === "species_not_available") {
    return `${SPECIES_DISPLAY[species]} is not supported here for ${
      contextLabel(context)
    } yet. Try a different species or water type.`;
  }
  if (msg === "unsupported_recommender_scope") {
    return "Right now, FinFindr supports freshwater largemouth, smallmouth, northern pike, and trout.";
  }
  if (msg === "seasonal_row_missing") {
    return "We do not have seasonal guidance for this spot, month, and water type yet. Try another water type or move your pin nearby.";
  }
  if (msg === "state_resolution_failed") {
    return "We could not read the state for this spot. Move the pin or refresh your location before building a plan.";
  }
  if (msg === "daily_snapshot_unavailable") {
    return "We could not load today's conditions for this spot. Please try again in a moment.";
  }
  if (msg === "subscription_required" || /subscribe/i.test(msg)) {
    return "subscription_required";
  }
  return msg;
}

function isRecommenderSubscriptionError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return msg === "subscription_required" || /subscribe to use/i.test(msg);
}

function readinessMessage(args: {
  hasCoords: boolean;
  resolvingRegion: boolean;
  stateCode: string | null;
  species: SpeciesGroup | null;
  context: EngineContext | null;
  clarity: WaterClarity | null;
}): string | null {
  const { hasCoords, resolvingRegion, stateCode, species, context, clarity } =
    args;
  if (!hasCoords) {
    return "Add a location first so today's local conditions can shape your picks.";
  }
  if (resolvingRegion) {
    return "Checking your spot so we only show species and water types that fit.";
  }
  if (!stateCode) {
    return "We need a readable location before we can build your tackle plan.";
  }
  if (!species) {
    return "Choose the species you are fishing for so we can match the season.";
  }
  if (!context) {
    return "Choose the type of water you are fishing so the picks fit the spot.";
  }
  if (!clarity) {
    return "Choose water clarity so color and profile guidance stay accurate.";
  }
  return "When you run or refresh this, today's conditions keep your picks steady all day.";
}

function getTodaySnapshotRequest(
  forecastSnapshot: Awaited<ReturnType<typeof getForecastScores>> | null,
  measuredWaterEnv?: Record<string, unknown> | null,
): { envData: Record<string, unknown>; targetDate: string } | null {
  const targetDate =
    forecastSnapshot?.forecast.find((day) => day.day_offset === 0)?.date ??
      null;
  const envData = forecastSnapshot?.snapshot_env &&
      typeof forecastSnapshot.snapshot_env === "object"
    ? (forecastSnapshot.snapshot_env as unknown as Record<string, unknown>)
    : null;

  if (!targetDate || !envData) return null;
  return {
    envData: mergeMeasuredWaterTempFields(envData, measuredWaterEnv),
    targetDate,
  };
}

// ─── Conditions helpers ───────────────────────────────────────────────────────

const STATE_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_CODE).map(([name, code]) => [code, name]),
);

function getCurrentSeason(): string {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "Spring";
  if (m >= 5 && m <= 7) return "Summer";
  if (m >= 8 && m <= 10) return "Fall";
  return "Winter";
}

function windCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8] ?? "N";
}

function cloudCoverLabel(pct: number): string {
  if (pct <= 15) return "Clear";
  if (pct <= 35) return "Partly";
  if (pct <= 65) return "Cloudy";
  return "Overcast";
}

function windDirectionLabel16(deg: number): string {
  const cards = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? "—";
}

function moonPhaseLabel(
  phase: string | undefined,
  illumination: number | undefined,
): string {
  if (phase && phase !== "Unknown") return phase;
  if (illumination == null) return "—";
  if (illumination <= 0.05) return "New Moon";
  if (illumination <= 0.4) return "Crescent";
  if (illumination <= 0.6) return "Half";
  if (illumination <= 0.9) return "Gibbous";
  return "Full Moon";
}

function pressureTrendInfo(
  trend: string,
): { label: string; color: string } | null {
  switch (trend) {
    case "rapidly_falling":
      return { label: "↓↓ Rapidly Falling", color: paper.bandPrime };
    case "slowly_falling":
      return { label: "↓ Falling", color: paper.bandGood };
    case "stable":
      return { label: "Stable", color: colors.textMuted };
    case "slowly_rising":
      return { label: "↑ Rising", color: paper.bandFair };
    case "rapidly_rising":
      return { label: "↑↑ Rapidly Rising", color: paper.bandTough };
    default:
      return null;
  }
}

// ─── Wizard sub-components (FinFindr tackle language) ────────────────────────

const SPECIES_SUBTITLE: Record<SpeciesGroup, string> = {
  largemouth_bass: "Micropterus nigricans",
  smallmouth_bass: "Micropterus dolomieu",
  pike_musky: "Esox lucius",
  river_trout: "Salmonidae spp.",
  walleye: "Sander vitreus",
  redfish: "Sciaenops ocellatus",
  snook: "Centropomus undecimalis",
  seatrout: "Cynoscion nebulosus",
  striped_bass: "Morone saxatilis",
  tarpon: "Megalops atlanticus",
};

/**
 * One-liner copy shown under each water-type card. These mirror the
 * FinFindr reference phrasing ("still water…", "moving water…") and are
 * adapted for the two coastal contexts the engine supports, so the flow
 * stays truthful if a state adds them in the future.
 */
function contextSubtitle(ctx: EngineContext): string {
  switch (ctx) {
    case "freshwater_lake_pond":
      return "Still water: lakes, ponds, reservoirs";
    case "freshwater_river":
      return "Moving water: rivers, creeks, tailwaters";
    case "coastal":
      return "Inshore saltwater: beaches, piers, jetties";
    case "coastal_flats_estuary":
      return "Shallow inshore: flats, marshes, estuaries";
    default:
      return "";
  }
}

/** Visibility subtitle shown under each clarity card — matches the mock. */
const CLARITY_SUBTITLE: Record<WaterClarity, string> = {
  clear: "Visibility 4+ feet",
  stained: "Visibility 1–3 feet",
  dirty: "Visibility under 1 foot",
};

const GOAL_LABELS: Record<RecommendationGoal, string> = {
  all_purpose: "Catch Fish",
  big_fish: "Catch a PB",
};

/** Short lure metaphors — pairs with regenerated goal chip art. */
const GOAL_SUBTITLE: Record<RecommendationGoal, string> = {
  all_purpose: "Catch more fish with big-fish potential",
  big_fish: "Target a trophy or personal-best fish",
};

// ─── Wizard step progress ────────────────────────────────────────────────────

/**
 * 4-step progress bar — each step is a compact tile with a numbered /
 * checkmark medallion. The active step uses the dashboard blue accent.
 *
 * Matches the FinFindr `tackleStep` progress grid one-for-one in
 * proportion and affordance, adapted for React Native flex layout.
 */
function WizardStepProgress({
  current,
  onJumpToStep,
  allowJumpToStep,
}: {
  current: 1 | 2 | 3 | 4;
  /** Tapping a completed step jumps back to it; active/pending tiles ignore taps. */
  onJumpToStep: (step: 1 | 2 | 3 | 4) => void;
  allowJumpToStep: (step: 1 | 2 | 3 | 4) => boolean;
}) {
  const steps: {
    num: 1 | 2 | 3 | 4;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { num: 1, label: "SPECIES", icon: "fish-outline" },
    { num: 2, label: "WATER", icon: "water-outline" },
    { num: 3, label: "CLARITY", icon: "eye-outline" },
    { num: 4, label: "GOAL", icon: "trophy-outline" },
  ];
  return (
    <View style={wizardStyles.progressRow}>
      {steps.map((step) => {
        const isActive = current === step.num;
        const isDone = current > step.num;
        const canTap = !isActive && allowJumpToStep(step.num);
        return (
          <Pressable
            key={step.num}
            style={({ pressed }) => [
              wizardStyles.progressTile,
              isDone && wizardStyles.progressTileDone,
              isActive && wizardStyles.progressTileActive,
              canTap && pressed && { opacity: 0.85 },
            ]}
            onPress={() => {
              if (!canTap) return;
              hapticSelection();
              onJumpToStep(step.num);
            }}
            disabled={!canTap}
          >
            <View
              style={[
                wizardStyles.progressBadge,
                isDone && wizardStyles.progressBadgeDone,
                isActive && wizardStyles.progressBadgeActive,
              ]}
            >
              {isDone
                ? (
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={paper.dashboardInk}
                  />
                )
                : (
                  <Ionicons
                    name={step.icon}
                    size={16}
                    color={isActive ? "#FFFFFF" : paper.dashboardInk}
                  />
                )}
            </View>
            <View style={wizardStyles.progressCopy}>
              <Text
                style={[
                  wizardStyles.progressEyebrow,
                  isDone && { color: paper.dashboardWhite, opacity: 0.8 },
                ]}
              >
                STEP {step.num}
              </Text>
              <Text
                style={[
                  wizardStyles.progressLabel,
                  isDone && { color: paper.dashboardWhite },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.72}
              >
                {step.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Species card (paper) ────────────────────────────────────────────────────

function SpeciesCard({
  sp,
  isActive,
  isDisabled,
  onSelect,
  cardHeight,
}: {
  sp: SpeciesGroup;
  isActive: boolean;
  isDisabled: boolean;
  onSelect: (s: SpeciesGroup) => void;
  cardHeight: number;
}) {
  const img = getSpeciesImage(sp);
  return (
    <Pressable
      style={({ pressed }) => [
        wizardStyles.speciesCard,
        isActive && wizardStyles.speciesCardActive,
        Platform.OS === "ios" && pressed && !isDisabled && !isActive &&
        { opacity: 0.9 },
      ]}
      onPress={() => {
        if (isDisabled) return;
        hapticSelection();
        onSelect(sp);
      }}
      android_ripple={isDisabled ? undefined : RIPPLE}
      disabled={isDisabled}
    >
      <View style={[wizardStyles.speciesImageArea, { height: cardHeight }]}>
        {img && (
          <Image
            source={img}
            style={wizardStyles.speciesImage}
            contentFit="contain"
          />
        )}
      </View>
      <View style={wizardStyles.speciesFooter}>
        <Text
          style={wizardStyles.speciesTitle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.62}
        >
          {SPECIES_DISPLAY[sp]}
        </Text>
        <Text
          style={wizardStyles.speciesSubtitle}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.68}
        >
          {SPECIES_SUBTITLE[sp]}
        </Text>
      </View>
      {isActive && (
        <View style={wizardStyles.selectBadge}>
          <Ionicons name="checkmark" size={13} color={paper.dashboardWhite} />
        </View>
      )}
      {isDisabled && (
        <View style={wizardStyles.cardDisabledOverlay} pointerEvents="none" />
      )}
    </Pressable>
  );
}

function speciesCardHeightForCount(count: number): number {
  if (count <= 1) return 170;
  if (count === 2) return 150;
  return 128;
}

function SpeciesGrid({
  allOptions,
  availableOptions,
  selected,
  onSelect,
}: {
  allOptions: SpeciesGroup[];
  availableOptions: SpeciesGroup[];
  selected: SpeciesGroup | null;
  onSelect: (s: SpeciesGroup) => void;
}) {
  const { width } = useWindowDimensions();
  const useNarrowCards = width <= 340;
  // Base the image-area height on the full `allOptions` count so cards never
  // resize when a selection greys some out — keeps the grid stable.
  const cardHeight = useNarrowCards
    ? 104
    : speciesCardHeightForCount(allOptions.length);

  if (allOptions.length === 1) {
    return (
      <View style={wizardStyles.speciesGrid}>
        <SpeciesCard
          sp={allOptions[0]}
          isActive={selected === allOptions[0]}
          isDisabled={!availableOptions.includes(allOptions[0])}
          onSelect={onSelect}
          cardHeight={cardHeight}
        />
      </View>
    );
  }

  const rows: SpeciesGroup[][] = [];
  const rowSize = useNarrowCards ? 1 : 2;
  for (let i = 0; i < allOptions.length; i += rowSize) {
    rows.push(allOptions.slice(i, i + rowSize));
  }

  return (
    <View style={wizardStyles.speciesGrid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={wizardStyles.speciesRow}>
          {row.map((sp) => (
            <SpeciesCard
              key={sp}
              sp={sp}
              isActive={selected === sp}
              isDisabled={!availableOptions.includes(sp)}
              onSelect={onSelect}
              cardHeight={cardHeight}
            />
          ))}
          {row.length === 1 && !useNarrowCards && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}

// ─── Context selector (paper) ────────────────────────────────────────────────

function ContextSelector({
  allOptions,
  availableOptions,
  selected,
  onSelect,
}: {
  allOptions: EngineContext[];
  availableOptions: EngineContext[];
  selected: EngineContext | null;
  onSelect: (v: EngineContext) => void;
}) {
  const { width } = useWindowDimensions();
  const useNarrowCards = width <= 340;
  return (
    <View
      style={[
        wizardStyles.contextGrid,
        useNarrowCards && wizardStyles.contextGridNarrow,
      ]}
    >
      {allOptions.map((opt) => {
        const isActive = selected === opt;
        const isDisabled = !availableOptions.includes(opt);
        const img = getWatertypeImage(opt);
        return (
          <Pressable
            key={opt}
            style={({ pressed }) => [
              wizardStyles.contextCard,
              useNarrowCards && wizardStyles.contextCardNarrow,
              isActive && wizardStyles.contextCardActive,
              Platform.OS === "ios" && pressed && !isDisabled && !isActive &&
              { opacity: 0.9 },
            ]}
            onPress={() => {
              if (isDisabled) return;
              hapticSelection();
              onSelect(opt);
            }}
            android_ripple={isDisabled ? undefined : RIPPLE}
            disabled={isDisabled}
          >
            <View
              style={[
                wizardStyles.contextImageArea,
                useNarrowCards && wizardStyles.contextImageAreaNarrow,
              ]}
            >
              {img && (
                <Image
                  source={img}
                  style={wizardStyles.contextImage}
                  contentFit="contain"
                />
              )}
            </View>
            <View style={useNarrowCards && wizardStyles.selectorCopyNarrow}>
              <Text
                style={wizardStyles.contextTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={useNarrowCards ? 0.9 : 0.78}
              >
                {contextLabel(opt)}
              </Text>
              <Text
                style={wizardStyles.contextSubtitle}
                numberOfLines={useNarrowCards ? undefined : 2}
                ellipsizeMode="tail"
              >
                {contextSubtitle(opt)}
              </Text>
            </View>
            {isActive && (
              <View style={wizardStyles.selectBadge}>
                <Ionicons
                  name="checkmark"
                  size={13}
                  color={paper.dashboardWhite}
                />
              </View>
            )}
            {isDisabled && (
              <View
                style={wizardStyles.cardDisabledOverlay}
                pointerEvents="none"
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Clarity selector (paper) ────────────────────────────────────────────────

function ClaritySelector({
  selected,
  onSelect,
}: {
  selected: WaterClarity | null;
  onSelect: (c: WaterClarity) => void;
}) {
  const { width } = useWindowDimensions();
  const useNarrowCards = width <= 340;
  const options: { value: WaterClarity; label: string }[] = [
    { value: "clear", label: "Clear" },
    { value: "stained", label: "Stained" },
    { value: "dirty", label: "Murky" },
  ];

  return (
    <View
      style={[
        wizardStyles.clarityGrid,
        useNarrowCards && wizardStyles.clarityGridNarrow,
      ]}
    >
      {options.map(({ value, label }) => {
        const isActive = selected === value;
        const img = getWaterclarityImage(value);
        return (
          <Pressable
            key={value}
            style={({ pressed }) => [
              wizardStyles.clarityCard,
              useNarrowCards && wizardStyles.clarityCardNarrow,
              isActive && wizardStyles.clarityCardActive,
              Platform.OS === "ios" && pressed && !isActive && { opacity: 0.9 },
            ]}
            onPress={() => {
              hapticSelection();
              onSelect(value);
            }}
            android_ripple={RIPPLE}
          >
            <View style={wizardStyles.clarityImageArea}>
              <Image
                source={img}
                style={wizardStyles.clarityImage}
                contentFit="cover"
              />
            </View>
            <View style={useNarrowCards && wizardStyles.selectorCopyNarrow}>
              <Text style={wizardStyles.clarityTitle} numberOfLines={1}>
                {label}
              </Text>
              <Text
                style={wizardStyles.claritySubtitle}
                numberOfLines={useNarrowCards ? undefined : 2}
                ellipsizeMode="tail"
              >
                {CLARITY_SUBTITLE[value]}
              </Text>
            </View>
            {isActive && (
              <View style={wizardStyles.selectBadge}>
                <Ionicons
                  name="checkmark"
                  size={13}
                  color={paper.dashboardWhite}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Goal selector (paper) ───────────────────────────────────────────────────

function GoalSelector({
  selected,
  onSelect,
}: {
  selected: RecommendationGoal;
  onSelect: (goal: RecommendationGoal) => void;
}) {
  const { width } = useWindowDimensions();
  const useNarrowCards = width <= 340;
  const options: RecommendationGoal[] = ["all_purpose", "big_fish"];

  return (
    <View
      style={[
        wizardStyles.goalGrid,
        useNarrowCards && wizardStyles.goalGridNarrow,
      ]}
    >
      {options.map((value) => {
        const isActive = selected === value;
        const img = getRecommendationGoalImage(value);
        return (
          <Pressable
            key={value}
            style={({ pressed }) => [
              wizardStyles.goalCard,
              useNarrowCards && wizardStyles.goalCardNarrow,
              isActive && wizardStyles.goalCardActive,
              Platform.OS === "ios" && pressed && !isActive && { opacity: 0.9 },
            ]}
            onPress={() => {
              hapticSelection();
              onSelect(value);
            }}
            android_ripple={RIPPLE}
          >
            <View style={wizardStyles.goalImageArea}>
              <Image
                source={img}
                style={wizardStyles.goalImage}
                contentFit="contain"
              />
            </View>
            <View style={useNarrowCards && wizardStyles.selectorCopyNarrow}>
              <Text style={wizardStyles.goalTitle} numberOfLines={2}>
                {GOAL_LABELS[value]}
              </Text>
              <Text
                style={wizardStyles.goalSubtitle}
                numberOfLines={useNarrowCards ? undefined : 2}
                ellipsizeMode="tail"
              >
                {GOAL_SUBTITLE[value]}
              </Text>
            </View>
            {isActive && (
              <View style={wizardStyles.selectBadge}>
                <Ionicons
                  name="checkmark"
                  size={13}
                  color={paper.dashboardWhite}
                />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type ScreenState = "setup" | "loading" | "result" | "error";

export default function RecommenderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
    location_label?: string;
    state_code?: string;
    species?: string;
    context?: string;
  }>();

  const { profile, user, fetchProfile } = useAuthStore();
  const effectiveTier = getEffectiveTier(
    profile,
    user?.email,
  );
  const canGenerateRecommendation = canGenerateRecommenderReport(
    effectiveTier,
    profile,
  );
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);

  const lat = parseFloat(params.latitude ?? "");
  const lon = parseFloat(params.longitude ?? "");
  const hasCoords = !isNaN(lat) && !isNaN(lon);
  const locationLabel =
    typeof params.location_label === "string" && params.location_label.trim().length > 0
      ? params.location_label.trim()
      : hasCoords
      ? `${lat.toFixed(3)}, ${lon.toFixed(3)}`
      : "Current location";
  const routeStateCode =
    typeof params.state_code === "string" &&
      Object.values(STATE_NAME_TO_CODE).includes(params.state_code)
      ? params.state_code
      : stateCodeFromLocationLabel(params.location_label) ??
        (hasCoords ? nearestUsStateCode(lat, lon) : null);

  const initialSpecies =
    typeof params.species === "string" && isDailyPicksUiSpecies(params.species)
      ? params.species
      : null;
  const initialContext =
    typeof params.context === "string" && isDailyPicksUiContext(params.context)
      ? params.context
      : null;

  const [species, setSpecies] = useState<SpeciesGroup | null>(
    initialSpecies,
  );
  const [context, setContext] = useState<EngineContext | null>(
    initialContext,
  );
  const [clarity, setClarity] = useState<WaterClarity | null>(null);
  const [recommendationGoal, setRecommendationGoal] = useState<
    RecommendationGoal
  >("all_purpose");

  // Resolved state code — drives chip filtering
  const [stateCode, setStateCode] = useState<string | null>(routeStateCode);
  const [resolvingRegion, setResolvingRegion] = useState(false);

  const [screenState, setScreenState] = useState<ScreenState>("setup");
  const [result, setResult] = useState<RecommenderResponse | null>(null);
  const [resultTimeZone, setResultTimeZone] = useState<string | undefined>(
    undefined,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const canUseRecommenderActions = canContinueRecommenderSession(
    effectiveTier,
    profile,
    screenState === "result" && result !== null,
  );

  // ─── Wizard step (setup phase only) ──────────────────────────────────────
  // `wizardStep` is purely a UI convenience; the underlying selection state
  // (`species`, `context`, `clarity`, `recommendationGoal`) is still the source of truth for
  // readiness/build-plan. Whenever we come back to the setup screen (initial
  // mount, or bounce from result/error), we reset the wizard to step 1.
  type WizardStep = 1 | 2 | 3 | 4;
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  useEffect(() => {
    if (screenState === "setup") {
      setWizardStep((prev) => {
        // If we're on step 2 but species got wiped (state-change invalidation),
        // or on later steps but species/context got wiped, bounce back rather than
        // letting the user sit on an empty step.
        if (prev === 2 && !species) return 1;
        if (prev === 3 && (!species || !context)) return species ? 2 : 1;
        if (prev === 4 && (!species || !context)) return species ? 2 : 1;
        return prev;
      });
    }
  }, [screenState, species, context]);

  // Resolve state code as soon as we have coords
  useEffect(() => {
    if (!hasCoords) return;
    setResolvingRegion(true);
    resolveStateCode(lat, lon).then((code) => {
      // Android's native reverse geocoder can be unavailable even when Home
      // already resolved a valid US fishing location. Preserve the route/label
      // state in that case so the final wizard action does not stay disabled.
      setStateCode((current) => code === "XX" ? current : code);
      setResolvingRegion(false);
    });
  }, [lat, lon, hasCoords, routeStateCode]);

  // When state resolves, clear any selections that are no longer valid
  useEffect(() => {
    if (!stateCode) return;
    const validSpecies = getRecommenderSpeciesForState(stateCode);
    if (species && !validSpecies.includes(species)) {
      setSpecies(null);
      setContext(null);
      return;
    }
    if (species && context) {
      const validCtxs = getRecommenderContextsForStateSpecies(
        stateCode,
        species,
      );
      if (!validCtxs.includes(context)) setContext(null);
    }
  }, [stateCode, species, context]);

  useEffect(() => {
    if (!context || !species) return;
    if (stateCode) {
      const validCtxs = getRecommenderContextsForStateSpecies(
        stateCode,
        species,
      );
      if (!validCtxs.includes(context)) setContext(null);
      return;
    }
    if (!defaultContextsForSpecies(species).includes(context)) {
      setContext(null);
    }
  }, [context, stateCode, species]);

  // Species cards always show the full UI roster (LMB / SMB / Pike / Trout).
  // We don't hide species that aren't supported in the user's state — instead
  // they render greyed-out in `SpeciesGrid`, mirroring how the context step
  // already shows both Lake/Pond and River but greys the one that doesn't
  // apply to the selected species. Keeps the "what's available here?"
  // surface discoverable so someone in a LMB-only state still sees that
  // trout/pike/smallmouth exist in the product.
  const allSpeciesForState: SpeciesGroup[] = DAILY_PICKS_UI_SPECIES;

  const allContextsForState: EngineContext[] = stateCode
    ? getRecommenderContextsForState(stateCode)
    : ENGINE_CONTEXTS;

  // Derived chip options — always state-aware (subset of the above)
  const availableSpecies: SpeciesGroup[] = stateCode
    ? getRecommenderSpeciesForState(stateCode)
    : DAILY_PICKS_UI_SPECIES;

  const availableContexts: EngineContext[] = stateCode && species
    ? getRecommenderContextsForStateSpecies(stateCode, species)
    : stateCode
    ? getRecommenderContextsForState(stateCode)
    : species
    ? defaultContextsForSpecies(species)
    : ENGINE_CONTEXTS;

  // Validation
  const isReady = species !== null &&
    context !== null &&
    clarity !== null &&
    recommendationGoal !== null &&
    hasCoords &&
    stateCode !== null &&
    availableSpecies.includes(species) &&
    availableContexts.includes(context);
  const setupHint = readinessMessage({
    hasCoords,
    resolvingRegion,
    stateCode,
    species,
    context,
    clarity,
  });

  const handleFetch = useCallback(
    async (
      forceRefresh = false,
      viewVariant?: DailyPicksVariant,
    ) => {
      if (!isReady || !species || !context || !clarity) return;
      const isInlineRefresh = (forceRefresh || viewVariant != null) &&
        screenState === "result" &&
        result !== null;

      if (isInlineRefresh) {
        setIsRefreshing(true);
      } else {
        setScreenState("loading");
        setErrorMsg(null);
      }

      try {
        const resolvedStateCode = await resolveStateCode(lat, lon);
        const state_code = resolvedStateCode === "XX"
          ? stateCode ?? "XX"
          : resolvedStateCode;
        if (state_code === "XX") {
          throw new Error("state_resolution_failed");
        }
        const [forecastSnapshot, measuredWaterEnv] = await Promise.all([
          getForecastScores(lat, lon),
          getEnvironment({ latitude: lat, longitude: lon }).catch(() => null),
        ]);
        const dailySnapshot = getTodaySnapshotRequest(
          forecastSnapshot,
          measuredWaterEnv as Record<string, unknown> | null,
        );
        if (!dailySnapshot) {
          throw new Error("daily_snapshot_unavailable");
        }
        const timeZone = typeof dailySnapshot.envData.timezone === "string"
          ? dailySnapshot.envData.timezone
          : undefined;
        const res = await fetchRecommendation(
          {
            latitude: lat,
            longitude: lon,
            state_code,
            species,
            context,
            water_clarity: clarity,
            recommendation_goal: recommendationGoal,
            env_data: dailySnapshot.envData,
            target_date: dailySnapshot.targetDate,
          },
          { forceRefresh, viewVariant },
        );

        // Preload the fish image so it's decoded before we flip to result —
        // everything renders together instead of popping in at different speeds.
        const img = getRecommenderResultSpeciesImage(res);
        if (img) {
          await Asset.fromModule(img).downloadAsync();
        }

        setResult(res);
        setResultTimeZone(timeZone);
        setScreenState("result");
        if (user?.id) {
          void fetchProfile(user.id);
        }
      } catch (err: unknown) {
        if (isRecommenderSubscriptionError(err)) {
          if (isInlineRefresh) {
            Alert.alert(
              "Angler feature",
              "Subscribe to refresh picks or start a new Tackle Box session.",
            );
            setIsRefreshing(false);
          } else {
            setShowSubscribePrompt(true);
            setScreenState("setup");
            setWizardStep(1);
            setErrorMsg(null);
          }
          return;
        }
        const friendlyMessage = recommenderErrorMessage(err, species, context);
        if (isInlineRefresh) {
          Alert.alert(
            viewVariant
              ? "Could not load saved picks"
              : "Could not refresh recommendations",
            friendlyMessage,
          );
        } else {
          setErrorMsg(friendlyMessage);
          setScreenState("error");
        }
      } finally {
        if (isInlineRefresh) {
          setIsRefreshing(false);
        }
      }
    },
    [
      isReady,
      species,
      context,
      clarity,
      recommendationGoal,
      lat,
      lon,
      stateCode,
      result,
      screenState,
      canUseRecommenderActions,
      canGenerateRecommendation,
      screenState,
      result,
      fetchProfile,
      user?.id,
    ],
  );

  const handleReset = useCallback(() => {
    setScreenState("setup");
    setWizardStep(1);
    setResult(null);
    setResultTimeZone(undefined);
    setErrorMsg(null);
    setIsRefreshing(false);
    setSpecies(null);
    setContext(null);
    setClarity(null);
    setRecommendationGoal("all_purpose");
  }, []);

  useEffect(() => {
    if (canGenerateRecommendation || screenState !== "result") return;
    if (result != null) return;
    setResultTimeZone(undefined);
    setScreenState("setup");
    setIsRefreshing(false);
  }, [canGenerateRecommendation, screenState, result]);

  const handleSubscribeUnlocked = useCallback(() => {
    setShowSubscribePrompt(false);
    if (user?.id) {
      void fetchProfile(user.id);
    }
    void handleFetch(false);
  }, [fetchProfile, handleFetch, user?.id]);

  const accentColor = context ? contextAccentColor(context) : colors.primary;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Nav header — shared across every state. */}
      <View style={wizardStyles.navHeader}>
        <Pressable
          style={({ pressed }) => [
            wizardStyles.navIconButton,
            Platform.OS === "ios" && pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            if (screenState === "result" || screenState === "error") {
              handleReset();
            } else {
              router.back();
            }
          }}
          hitSlop={12}
          android_ripple={RIPPLE}
        >
          <Ionicons name="chevron-back" size={16} color="#FFFFFF" />
          <Text style={wizardStyles.navIconButtonText}>
            {screenState === "result" || screenState === "error"
              ? "SETUP"
              : "BACK"}
          </Text>
        </Pressable>

        <View style={wizardStyles.navTitleWrap} pointerEvents="none">
          <Text style={wizardStyles.navEyebrow}>FINFINDR</Text>
          <Text
            style={wizardStyles.navTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            THE TACKLE BOX
          </Text>
        </View>

        {/* Right slot — state pill during setup, reset affordance on result. */}
        <View style={wizardStyles.navRight}>
          {screenState === "setup" && (resolvingRegion
            ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={{ transform: [{ scale: 0.7 }] }}
              />
            )
            : stateCode
            ? (
              <View style={wizardStyles.navStatePill}>
                <Ionicons name="location" size={10} color={paper.bandPrime} />
                <Text style={wizardStyles.navStatePillText}>{stateCode}</Text>
              </View>
            )
            : null)}

          {screenState === "result" && (
            <Pressable
              style={({ pressed }) => [
                wizardStyles.navIconButton,
                Platform.OS === "ios" && pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                hapticSelection();
                handleReset();
              }}
              hitSlop={12}
              android_ripple={RIPPLE}
            >
              <Ionicons name="options-outline" size={14} color="#FFFFFF" />
              <Text style={wizardStyles.navIconButtonText}>EDIT</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Setup form (FinFindr tackle wizard) ── */}
      {screenState === "setup" && (() => {
        const stepConfig: {
          num: 1 | 2 | 3 | 4;
          question: string;
          caption: string;
        }[] = [
          {
            num: 1,
            question: "What are you after?",
            caption: "Pick the species you are fishing for.",
          },
          {
            num: 2,
            question: "Where are you fishing?",
            caption: "Pick the type of water you are on.",
          },
          {
            num: 3,
            question: "How's the water today?",
            caption: "Pick the clarity you are seeing.",
          },
          {
            num: 4,
            question: "What's the goal?",
            caption: "Pick the style of recommendations.",
          },
        ];
        const current = stepConfig[wizardStep - 1];

        const canContinue = wizardStep === 1
          // SpeciesCard only calls onSelect for an available option. Do not
          // re-gate the selected card on the async region list here; while
          // that list is resolving Android could show a selected species
          // with a blank/disabled Continue CTA.
          ? species !== null
          : wizardStep === 2
          ? context !== null && availableContexts.includes(context)
          : wizardStep === 3
          ? clarity !== null
          : recommendationGoal !== null;
        const continueEnabled = canContinue &&
          (wizardStep !== 4 || isReady);

        const allowJumpToStep = (step: 1 | 2 | 3 | 4) => {
          if (step === 1) return true;
          if (step === 2) {
            return species !== null;
          }
          if (step === 3) return species !== null && context !== null;
          return species !== null && context !== null && clarity !== null;
        };

        const handleBack = () => {
          if (wizardStep === 1) {
            router.back();
            return;
          }
          hapticSelection();
          setWizardStep((prev) => {
            if (prev === 4) return 3;
            if (prev === 3) return 2;
            return 1;
          });
        };

        const handleContinueOrSubmit = () => {
          if (!canContinue) return;
          if (wizardStep < 4) {
            hapticSelection();
            setWizardStep((prev) => {
              if (prev === 1) return 2;
              if (prev === 2) return 3;
              return 4;
            });
            return;
          }
          if (!isReady) return;
          hapticImpact(ImpactFeedbackStyle.Medium);
          handleFetch(false);
        };

        const contextInvalidNote =
          wizardStep === 2 && species && availableContexts.length === 0
            ? `No supported water types for ${
              SPECIES_DISPLAY[species]
            } in this region yet.`
            : null;

        // Step 1 mirror: now that we render all 4 species cards everywhere
        // and grey out unsupported ones, surface a line when the selected
        // region doesn't back any of them yet — otherwise the grid reads
        // as "all disabled" with no explanation of why.
        const speciesInvalidNote =
          wizardStep === 1 && stateCode && availableSpecies.length === 0
            ? "No supported species for this region yet — check back as coverage expands."
            : null;

        return (
          <PaperBackground style={{ flex: 1 }}>
            <ScrollView
              style={styles.setupScroll}
              contentContainerStyle={wizardStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Hero — FinFindr tackle setup language */}
              <View style={wizardStyles.hero}>
                <SectionEyebrow>TACKLE BOX SETUP</SectionEyebrow>
                <Text style={wizardStyles.heroTitle} allowFontScaling={false}>
                  LET'S DIAL IN{"\n"}
                  <Text style={wizardStyles.heroTitleAccent}>YOUR PICKS.</Text>
                </Text>
                <Text style={wizardStyles.heroSubtitle}>
                  Four quick questions and we'll rank the best lures and flies
                  for today.
                </Text>
              </View>

              {/* Location warning — only when no coords */}
              {!hasCoords && (
                <View style={wizardStyles.warningBanner}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={paper.dashboardBlue}
                  />
                  <Text style={wizardStyles.warningText}>
                    Add a location on Home so today's conditions can be used.
                  </Text>
                </View>
              )}

              {/* Step progress */}
              <WizardStepProgress
                current={wizardStep}
                onJumpToStep={setWizardStep}
                allowJumpToStep={allowJumpToStep}
              />

              {/* Step content card */}
              <View style={wizardStyles.stepCard}>
                <TopographicLines
                  style={StyleSheet.absoluteFill}
                  color={paper.dashboardBlue}
                  count={4}
                />
                <CornerMarkSet
                  color={paper.dashboardBlue}
                  inset={10}
                  size={12}
                />

                <View style={wizardStyles.stepCardHeader}>
                  <Text style={wizardStyles.stepCardEyebrow}>
                    STEP {wizardStep} OF 4
                  </Text>
                  <Text
                    style={wizardStyles.stepCardTitle}
                    allowFontScaling={false}
                  >
                    {current.question}
                  </Text>
                  <Text style={wizardStyles.stepCardCaption}>
                    {current.caption}
                  </Text>
                </View>

                {wizardStep === 1 && (
                  <>
                    <SpeciesGrid
                      allOptions={allSpeciesForState}
                      availableOptions={availableSpecies}
                      selected={species}
                      onSelect={(sp) => {
                        if (sp !== species) {
                          setContext(null);
                          setClarity(null);
                          setRecommendationGoal("all_purpose");
                        }
                        setSpecies(sp);
                      }}
                    />
                    {speciesInvalidNote && (
                      <Text style={wizardStyles.validationNote}>
                        {speciesInvalidNote}
                      </Text>
                    )}
                  </>
                )}

                {wizardStep === 2 && (
                  <>
                    <ContextSelector
                      allOptions={allContextsForState}
                      availableOptions={availableContexts}
                      selected={context}
                      onSelect={setContext}
                    />
                    {contextInvalidNote && (
                      <Text style={wizardStyles.validationNote}>
                        {contextInvalidNote}
                      </Text>
                    )}
                  </>
                )}

                {wizardStep === 3 && (
                  <ClaritySelector
                    selected={clarity}
                    onSelect={setClarity}
                  />
                )}

                {wizardStep === 4 && (
                  <GoalSelector
                    selected={recommendationGoal}
                    onSelect={setRecommendationGoal}
                  />
                )}
              </View>

              {
                /* Readiness hint on the last step only — so users understand
                  what's blocking the final CTA (e.g. location not resolved). */
              }
              {wizardStep === 4 && !isReady && setupHint && (
                <Text style={wizardStyles.readinessHint}>{setupHint}</Text>
              )}

              {/* Wizard actions */}
              <View style={wizardStyles.actionsRow}>
                <Pressable
                  style={({ pressed }) => [
                    wizardStyles.backButton,
                    Platform.OS === "ios" && pressed && { opacity: 0.85 },
                  ]}
                  onPress={handleBack}
                  android_ripple={{ color: "rgba(10,22,40,0.08)" }}
                  hitSlop={8}
                >
                  <Ionicons
                    name="chevron-back"
                    size={14}
                    color={paper.dashboardInk}
                  />
                  <Text style={wizardStyles.backButtonText}>
                    {wizardStep === 1 ? "CANCEL" : "BACK"}
                  </Text>
                </Pressable>

                <Pressable
                  key={`wizard-action-${wizardStep}-${continueEnabled ? "ready" : "waiting"}`}
                  style={({ pressed }) => [
                    wizardStyles.continueButton,
                    !continueEnabled && wizardStyles.continueButtonDisabled,
                    wizardStep === 4 && continueEnabled &&
                    wizardStyles.continueButtonFinal,
                    Platform.OS === "ios" && pressed && continueEnabled &&
                    { opacity: 0.9 },
                  ]}
                  // Keep the native Pressable enabled so Android does not
                  // suppress the child label. The handler still no-ops while
                  // the CTA is unavailable, and accessibility exposes the
                  // disabled state to screen readers.
                  onPress={continueEnabled ? handleContinueOrSubmit : undefined}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !continueEnabled }}
                  android_ripple={continueEnabled
                    ? { color: "rgba(255,255,255,0.18)" }
                    : undefined}
                >
                  <Text
                    style={[
                      wizardStyles.continueButtonText,
                      continueEnabled
                        ? wizardStep === 4
                          ? wizardStyles.continueButtonTextFinal
                          : wizardStyles.continueButtonTextEnabled
                        : wizardStyles.continueButtonTextDisabled,
                    ]}
                  >
                    {wizardStep === 4
                      ? "GENERATE PICKS  >"
                      : "CONTINUE  >"}
                  </Text>
                </Pressable>
              </View>

              <Text style={wizardStyles.disclaimer}>
                Picks use your location, season, today's conditions, and water
                clarity.
              </Text>
            </ScrollView>
          </PaperBackground>
        );
      })()}

      {/* ── Loading ── */}
      {screenState === "loading" && (
        <PaperBackground style={{ flex: 1 }}>
          <View style={styles.loadingWrap}>
            <RecommenderLoadingSkeleton />
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator size="small" color={paper.bandPrime} />
              <Text style={wizardStyles.loadingCaption}>
                MATCHING LURES &amp; FLIES…
              </Text>
            </View>
          </View>
        </PaperBackground>
      )}

      {/* ── Error ── */}
      {screenState === "error" && (
        <PaperBackground style={{ flex: 1 }}>
          <View style={wizardStyles.errorState}>
            <View style={wizardStyles.errorBadge}>
              <Ionicons name="alert" size={22} color={paper.dashboardWhite} />
            </View>
            <Text style={wizardStyles.errorTitle}>
              COULD NOT BUILD YOUR PLAN
            </Text>
            <Text style={wizardStyles.errorBody}>{errorMsg}</Text>
            <View style={wizardStyles.errorActions}>
              <Pressable
                style={({ pressed }) => [
                  wizardStyles.errorPrimary,
                  Platform.OS === "ios" && pressed && { opacity: 0.9 },
                ]}
                onPress={() => {
                  hapticImpact(ImpactFeedbackStyle.Light);
                  handleFetch(true);
                }}
                android_ripple={{ color: "rgba(255,255,255,0.18)" }}
              >
                <Text style={wizardStyles.errorPrimaryText}>TRY AGAIN</Text>
                <Ionicons
                  name="refresh"
                  size={14}
                  color={paper.dashboardWhite}
                />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  wizardStyles.errorSecondary,
                  Platform.OS === "ios" && pressed && { opacity: 0.85 },
                ]}
                onPress={() => {
                  hapticSelection();
                  handleReset();
                }}
                android_ripple={RIPPLE}
              >
                <Ionicons
                  name="chevron-back"
                  size={12}
                  color={paper.dashboardInk}
                />
                <Text style={wizardStyles.errorSecondaryText}>
                  BACK TO SETUP
                </Text>
              </Pressable>
            </View>
          </View>
        </PaperBackground>
      )}

      {/* ── Result ── */}
      {screenState === "result" && result && (
        <RecommenderView
          result={result}
          style={styles.resultView}
          locationLabel={locationLabel}
          timeZone={resultTimeZone}
          onRefresh={() => handleFetch(true)}
          onViewVariant={(variant) => handleFetch(false, variant)}
          isRefreshing={isRefreshing}
        />
      )}

      <SubscribePrompt
        visible={showSubscribePrompt}
        onDismiss={() => {
          setShowSubscribePrompt(false);
          setScreenState("setup");
          setWizardStep(1);
          setIsRefreshing(false);
          setErrorMsg(null);
        }}
        onUnlocked={handleSubscribeUnlocked}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: paper.dashboardInk,
  },

  // Nav
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  navHeaderBorderless: {
    borderBottomWidth: 0,
  },
  navHeaderResult: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark,
  },
  backBtn: {
    padding: 4,
  },
  navTitle: {
    flex: 1,
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.text,
    letterSpacing: 0,
    textAlign: "center",
  },
  navRight: {
    alignItems: "flex-end",
    minWidth: 48,
  },
  resetBtn: {
    padding: 4,
  },

  // Setup
  setupScroll: {
    flex: 1,
  },
  setupContent: {
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // Region pill (in nav header)
  regionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  regionPillText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.4,
  },

  // Hero headline — Dashboard heroCard language
  heroHeader: {
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.xs + 2,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.primaryMist,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  heroBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.text,
    textAlign: "center",
    lineHeight: 32,
    letterSpacing: 0,
  },
  heroSubtitle: {
    fontFamily: fonts.bodyItalic,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Warning — soft alert matching the Dashboard tint system
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: paper.dashboardWhite,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: paper.dashboardBlue,
    lineHeight: 18,
  },

  // Section card — calm white surface, matching Dashboard heroCard / How's Fishing card
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    gap: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },

  // Section header — Dashboard sectionDividerRow + serif title below
  sectionHeader: {
    gap: spacing.xs + 2,
    marginTop: spacing.sm,
    marginBottom: -spacing.xs,
    paddingHorizontal: 2,
  },
  sectionEyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionEyebrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  sectionEyebrowStep: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 1.4,
  },
  sectionEyebrowDot: {
    width: 3,
    height: 3,
    borderRadius: 99,
    backgroundColor: colors.primary + "55",
  },
  sectionEyebrowLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.text,
    letterSpacing: 0,
    lineHeight: 26,
    textAlign: "center",
  },

  // Species grid
  speciesGrid: {
    gap: spacing.sm + 2,
  },
  speciesRow: {
    flexDirection: "row",
    gap: spacing.sm + 2,
  },
  // Selection tiles — unified treatment across species, context, clarity
  speciesCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  speciesCardActive: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.primaryMist,
    ...shadows.md,
  },
  speciesFishArea: {
    width: "100%",
  },
  speciesImage: {
    width: "100%",
    height: "100%",
  },
  speciesNameFooter: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 4,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  speciesCardText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    letterSpacing: 0,
  },
  speciesCheckBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 99,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  // Shared disabled overlay — soft mint tint over incompatible cards
  cardDisabledOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(180,195,183,0.52)",
    borderRadius: radius.md,
  },

  // Body of Water — same treatment as species tiles
  contextRow: {
    flexDirection: "row",
    gap: spacing.sm + 2,
  },
  contextCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  contextImageArea: {
    width: "100%",
    aspectRatio: 1.5,
  },
  contextCardImage: {
    width: "100%",
    height: "100%",
  },
  contextNameFooter: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  contextCardText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.text,
    letterSpacing: 0,
  },
  contextCheckBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },

  // Water clarity — 3-col, same treatment as species/context tiles
  clarityRow: {
    flexDirection: "row",
    gap: spacing.sm + 2,
  },
  clarityCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  clarityImageArea: {
    width: "100%",
    aspectRatio: 1.2,
  },
  clarityCardImage: {
    width: "100%",
    height: "100%",
  },
  clarityNameFooter: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 2,
  },
  clarityCardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 0,
  },
  clarityCardSub: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: "center",
    letterSpacing: 0.1,
  },
  clarityCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },

  // Validation note
  validationNote: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: paper.dashboardBlue,
    lineHeight: 18,
  },

  // CTA — matches How's Fishing generateBtn (rounded md, shadow md)
  ctaWrap: {
    marginTop: spacing.sm,
    gap: spacing.sm + 2,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 54,
  },
  ctaBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.textOnPrimary,
    letterSpacing: 0.2,
  },
  setupDisclaimer: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
  },

  // Loading / error
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  loadingWrap: {
    flex: 1,
    position: "relative",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: spacing.xl * 2,
    gap: spacing.sm,
  },
  loadingCaption: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.text,
    textAlign: "center",
  },
  errorMsg: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  retryBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  retryBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: "#fff",
  },
  secondaryBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.textSecondary,
  },

  // Result
  resultView: {
    flex: 1,
  },
});

// ─── Wizard styles ───────────────────────────────────────────────────────────
// FinFindr tackle-setup language. Sits alongside the legacy `styles`
// block because the wizard lives only in the setup phase.

const wizardStyles = StyleSheet.create({
  // ─── Shared nav header ──────────────────────────────────────────────────
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.md,
    backgroundColor: paper.dashboardInk,
    borderBottomWidth: 0,
    gap: paperSpacing.sm,
  },
  navTitleWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: paperSpacing.lg,
    bottom: paperSpacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  navEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: "rgba(255,255,255,0.58)",
    letterSpacing: 3,
  },
  navTitle: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    color: "#FFFFFF",
    letterSpacing: 0,
    marginTop: 0,
  },
  navIconButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  navIconButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: "#FFFFFF",
    letterSpacing: 1.6,
  },
  navRight: {
    minWidth: 62,
    alignItems: "flex-end",
  },
  navStatePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  navStatePillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 1.6,
  },

  scrollContent: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xl + paperSpacing.md,
    gap: paperSpacing.lg,
  },

  // Hero
  hero: {
    alignItems: "center",
    paddingTop: paperSpacing.xs,
    paddingBottom: paperSpacing.sm,
    gap: paperSpacing.xs,
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.dashboardInk,
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: 0,
    textTransform: "uppercase",
    marginTop: 6,
  },
  heroTitleAccent: {
    color: paper.bandPrime,
  },
  heroSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.75,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
    paddingHorizontal: paperSpacing.sm,
  },

  // Warning banner
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    borderRadius: paperRadius.chip,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
  },
  warningText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.dashboardInk,
    lineHeight: 17,
  },

  // Step progress — three paper tiles in a row
  progressRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: paperSpacing.xs,
    marginBottom: paperSpacing.sm,
  },
  progressTile: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
    minHeight: 82,
  },
  // Active step uses the tackle-box gold accent (matches the home
  // dashboard's Tackle Box module-row palette: iconBorder #C99B2D,
  // iconBg gradient ['#FBF1D9', '#F4DFA4']). Visually ties the wizard
  // to the feature's brand identity.
  progressTileActive: {
    backgroundColor: "#FBF1D9",
    borderColor: "#C99B2D",
    ...paperShadows.hard,
  },
  progressTileDone: {
    backgroundColor: paper.bandPrime,
    borderColor: paper.dashboardLine,
  },
  progressBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  progressBadgeActive: {
    backgroundColor: "#C99B2D",
    borderColor: "#8A6A1A",
  },
  progressBadgeDone: {
    backgroundColor: paper.dashboardWhite,
    borderColor: paper.dashboardWhite,
  },
  progressBadgeNum: {
    fontFamily: paperFonts.display,
    fontSize: 13,
    color: paper.dashboardInk,
    includeFontPadding: false,
  },
  progressCopy: {
    alignItems: "center",
    minWidth: 0,
    width: "100%",
  },
  progressEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardInk,
    opacity: 0.6,
    letterSpacing: 1.5,
  },
  progressLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 1,
    marginTop: 2,
  },

  // Step content card
  stepCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.lg,
    paddingHorizontal: paperSpacing.md,
    gap: paperSpacing.md,
    overflow: "hidden",
    ...paperShadows.hard,
  },
  stepCardHeader: {
    alignItems: "center",
    gap: 6,
    paddingBottom: paperSpacing.xs,
  },
  stepCardEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2.6,
  },
  stepCardTitle: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    color: paper.dashboardInk,
    letterSpacing: 0,
    textAlign: "center",
    lineHeight: 28,
  },
  stepCardCaption: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 18,
  },

  // Species grid
  speciesGrid: {
    gap: 12,
  },
  speciesRow: {
    flexDirection: "row",
    gap: 12,
  },
  speciesCard: {
    flex: 1,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    overflow: "hidden",
    position: "relative",
    ...paperShadows.hard,
  },
  speciesCardActive: {
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    ...paperShadows.lift,
  },
  speciesImageArea: {
    width: "100%",
    backgroundColor: paper.dashboardWhite,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
  },
  speciesImage: {
    width: "92%",
    height: "92%",
  },
  speciesFooter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 2,
  },
  speciesTitle: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    color: paper.dashboardInk,
    letterSpacing: 0,
    textAlign: "center",
  },
  speciesSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.6,
    textAlign: "center",
  },

  // Context (water-type) grid
  contextGrid: {
    flexDirection: "row",
    gap: 14,
    flexWrap: "wrap",
  },
  contextGridNarrow: {
    flexDirection: "column",
    flexWrap: "nowrap",
    gap: 10,
  },
  contextCard: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: "center",
    position: "relative",
    ...paperShadows.hard,
  },
  contextCardNarrow: {
    width: "100%",
    minWidth: 0,
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  contextCardActive: {
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    ...paperShadows.lift,
  },
  contextImageArea: {
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: "hidden",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  contextImageAreaNarrow: {
    width: 82,
    height: 82,
    borderRadius: 41,
    marginBottom: 0,
    flexShrink: 0,
  },
  contextImage: {
    width: "100%",
    height: "100%",
  },
  contextTitle: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    color: paper.dashboardInk,
    letterSpacing: 0,
    textAlign: "center",
    width: "100%",
  },
  contextSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11,
    color: paper.dashboardInk,
    opacity: 0.65,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 15,
  },

  // Clarity grid
  clarityGrid: {
    flexDirection: "row",
    gap: 10,
  },
  clarityGridNarrow: {
    flexDirection: "column",
  },
  clarityCard: {
    flex: 1,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: "center",
    position: "relative",
    ...paperShadows.hard,
  },
  clarityCardNarrow: {
    width: "100%",
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  clarityCardActive: {
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    ...paperShadows.lift,
  },
  clarityImageArea: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "transparent",
    overflow: "hidden",
    marginBottom: 10,
  },
  clarityImage: {
    width: "100%",
    height: "100%",
  },
  clarityTitle: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
    letterSpacing: 0,
    textAlign: "center",
  },
  claritySubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.65,
    textAlign: "center",
    marginTop: 3,
    lineHeight: 13,
  },

  // Goal grid
  goalGrid: {
    flexDirection: "row",
    gap: 14,
  },
  goalGridNarrow: {
    flexDirection: "column",
    gap: 10,
  },
  goalCard: {
    flex: 1,
    minHeight: 148,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    ...paperShadows.hard,
  },
  goalCardNarrow: {
    width: "100%",
    minHeight: 112,
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  goalCardActive: {
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlueSky,
    ...paperShadows.lift,
  },
  goalImageArea: {
    width: 86,
    height: 72,
    borderRadius: 0,
    borderWidth: 0,
    overflow: "visible",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  goalImage: {
    width: "100%",
    height: "100%",
  },
  goalTitle: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
    letterSpacing: 0,
    textAlign: "center",
  },
  goalSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.65,
    textAlign: "center",
    marginTop: 3,
    lineHeight: 13,
  },
  selectorCopyNarrow: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
  },

  // Shared select badge
  selectBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: paper.dashboardBlue,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  cardDisabledOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(246,247,245,0.72)",
  },

  // Validation notes / readiness hint
  validationNote: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardBlue,
    textAlign: "center",
    paddingHorizontal: paperSpacing.sm,
    lineHeight: 17,
  },
  readinessHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.65,
    textAlign: "center",
    paddingHorizontal: paperSpacing.md,
    lineHeight: 17,
    marginTop: -paperSpacing.xs,
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: paperSpacing.xs,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: paper.dashboardWhite,
  },
  backButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
  },
  continueButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    backgroundColor: paper.dashboardInk,
    ...paperShadows.hard,
  },
  continueButtonFinal: {
    backgroundColor: paper.bandPrime,
    borderColor: paper.bandPrime,
  },
  continueButtonDisabled: {
    backgroundColor: paper.dashboardWhite,
    borderColor: paper.dashboardLine,
    ...paperShadows.hard,
  },
  continueButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    lineHeight: 18,
    includeFontPadding: false,
    color: "#FFFFFF",
    letterSpacing: 2.6,
    textAlign: "center",
  },
  continueButtonTextDisabled: {
    color: paper.dashboardInk,
    // Keep the action label legible on Android. A partially transparent
    // Text style can be swallowed by the native disabled Pressable rendering,
    // leaving a blank button even though the label is mounted.
    opacity: 1,
  },
  continueButtonTextEnabled: {
    // Explicit color avoids Android retaining the disabled Text paint after
    // the Pressable changes state during a card-selection frame.
    color: paper.dashboardWhite,
    opacity: 1,
  },
  continueButtonTextFinal: {
    color: paper.dashboardWhite,
    opacity: 1,
  },

  disclaimer: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11,
    color: paper.dashboardInk,
    opacity: 0.55,
    textAlign: "center",
    paddingHorizontal: paperSpacing.sm,
    lineHeight: 16,
    marginTop: paperSpacing.xs,
  },

  // ─── Loading caption (field-guide tone) ───────────────────────────────
  loadingCaption: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 3,
    opacity: 0.7,
    textAlign: "center",
  },

  // ─── Error state (paper) ──────────────────────────────────────────────
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: paperSpacing.xl,
    gap: paperSpacing.sm,
  },
  errorBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: paper.dashboardBlue,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    alignItems: "center",
    justifyContent: "center",
    ...paperShadows.hard,
  },
  errorTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardBlue,
    letterSpacing: 2.8,
    textAlign: "center",
    marginTop: paperSpacing.xs,
  },
  errorBody: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: paperSpacing.sm,
    opacity: 0.8,
  },
  errorActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: paperSpacing.sm,
    marginTop: paperSpacing.sm,
  },
  errorPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: paper.bandPrime,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    ...paperShadows.hard,
  },
  errorPrimaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardWhite,
    letterSpacing: 2.4,
  },
  errorSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
  },
  errorSecondaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
  },
});
