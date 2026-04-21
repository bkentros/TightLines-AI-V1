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
 *   1. Setup form: species selector + context selector + water clarity chips
 *   2. Tap "Build plan" → loading state
 *   3. RecommenderView with results
 *   4. Pull-to-refresh for fresh results
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { hapticSelection, hapticImpact, ImpactFeedbackStyle } from '../lib/safeHaptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {
  colors,
  fonts,
  spacing,
  radius,
  shadows,
  paper,
  paperFonts,
  paperSpacing,
  paperRadius,
  paperShadows,
} from '../lib/theme';
import {
  PaperBackground,
  SectionEyebrow,
  CornerMarkSet,
  TopographicLines,
} from '../components/paper';
import { getSpeciesImage } from '../lib/speciesImages';
import { getWatertypeImage, ALL_WATERTYPE_IMAGES } from '../lib/watertypeImages';
import { getWaterclarityImage, ALL_WATERCLARITY_IMAGES } from '../lib/waterclarityImages';
import { ALL_COLOR_PALETTE_IMAGES } from '../lib/colorPaletteImages';
import { ALL_LURE_IMAGES } from '../lib/lureImages';
import { ALL_FLY_IMAGES } from '../lib/flyImages';
import { Asset } from 'expo-asset';
import { useAuthStore } from '../store/authStore';
import { fetchRecommendation } from '../lib/recommender';
import { getForecastScores } from '../lib/forecastScores';
import { RecommenderView } from '../components/fishing/RecommenderView';
import { RecommenderLoadingSkeleton } from '../components/fishing/RecommenderLoadingSkeleton';
import type {
  EngineContext,
  RecommenderResponse,
  SpeciesGroup,
  WaterClarity,
} from '../lib/recommenderContracts';
import {
  SPECIES_DISPLAY,
  RECOMMENDER_V3_UI_CONTEXTS,
  RECOMMENDER_V3_UI_SPECIES,
  getRecommenderSpeciesForState,
  getRecommenderContextsForState,
  getRecommenderContextsForStateSpecies,
  isRecommenderV3UiContext,
  isRecommenderV3UiSpecies,
} from '../lib/recommenderContracts';

const RIPPLE = { color: 'rgba(10,22,40,0.08)' };
const IMG_IN = { duration: 200 } as const;

// ─── Static preload list — rendered off-screen so images are decoded before page shows ──
const ALL_PRELOAD_IMAGES: ReturnType<typeof require>[] = [
  ...RECOMMENDER_V3_UI_SPECIES
    .map((sp) => getSpeciesImage(sp))
    .filter((img): img is ReturnType<typeof require> => img !== null),
  ...ALL_WATERTYPE_IMAGES,
  ...ALL_WATERCLARITY_IMAGES,
  ...ALL_COLOR_PALETTE_IMAGES,
  ...ALL_LURE_IMAGES,
  ...ALL_FLY_IMAGES,
];

// ─── Context helpers ──────────────────────────────────────────────────────────

const ENGINE_CONTEXTS: EngineContext[] = [
  ...RECOMMENDER_V3_UI_CONTEXTS,
];

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':    return 'Lake / Pond';
    case 'freshwater_river':        return 'River / Stream';
    case 'coastal':                 return 'Coastal';
    case 'coastal_flats_estuary':   return 'Flats / Estuary';
    default: return 'Freshwater';
  }
}

function contextIcon(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':  return 'water-outline';
    case 'freshwater_river':      return 'git-merge-outline';
    default: return 'water-outline';
  }
}

function contextAccentColor(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':  return colors.contextFreshwater;
    case 'freshwater_river':      return colors.contextFreshwater;
    default: return colors.contextFreshwater;
  }
}

function defaultContextsForSpecies(species: SpeciesGroup): EngineContext[] {
  switch (species) {
    case 'river_trout':
      return ['freshwater_river'];
    case 'largemouth_bass':
    case 'smallmouth_bass':
    case 'pike_musky':
      return [...ENGINE_CONTEXTS];
    default:
      return [];
  }
}

// ─── State code extraction ────────────────────────────────────────────────────

const STATE_NAME_TO_CODE: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY',
};

async function resolveStateCode(lat: number, lon: number): Promise<string> {
  try {
    const [geo] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    if (!geo) return 'XX';
    const region = geo.region ?? '';
    if (region.length === 2 && /^[A-Z]{2}$/.test(region)) return region;
    return STATE_NAME_TO_CODE[region] ?? 'XX';
  } catch {
    return 'XX';
  }
}

function recommenderErrorMessage(error: unknown, species: SpeciesGroup, context: EngineContext): string {
  const msg =
    error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.';
  if (msg === 'species_not_available') {
    return `${SPECIES_DISPLAY[species]} isn't available in this region for ${contextLabel(context)}. Try a different species or context.`;
  }
  if (msg === 'unsupported_recommender_scope') {
    return 'This recommender currently supports freshwater largemouth, smallmouth, northern pike, and trout only.';
  }
  if (msg === 'seasonal_row_missing') {
    return 'There is no published seasonal baseline for this spot, month, and water type. Try another month, switch lake vs river, or move your pin.';
  }
  if (msg === 'state_resolution_failed') {
    return 'We could not verify your state from this location. Move the pin or refresh location before building a plan.';
  }
  if (msg === 'daily_snapshot_unavailable') {
    return 'We could not load today\'s midnight conditions snapshot. Please try again in a moment.';
  }
  return msg;
}

function readinessMessage(args: {
  hasCoords: boolean;
  resolvingRegion: boolean;
  stateCode: string | null;
  species: SpeciesGroup | null;
  context: EngineContext | null;
  clarity: WaterClarity | null;
}): string | null {
  const { hasCoords, resolvingRegion, stateCode, species, context, clarity } = args;
  if (!hasCoords) {
    return 'Add a location first so we can verify your state and pull today\'s conditions.';
  }
  if (resolvingRegion) {
    return 'Verifying your state so we only show valid species and water types.';
  }
  if (!stateCode) {
    return 'We need a verified state from your location before we can build your plan.';
  }
  if (!species) {
    return 'Choose your target species so we can lock in the seasonal baseline.';
  }
  if (!context) {
    return 'Choose the body of water so we can use the right behavior model.';
  }
  if (!clarity) {
    return 'Choose water clarity so the visibility and color guidance stay accurate.';
  }
  return 'When you run or refresh this, we use today\'s midnight conditions snapshot so the plan stays stable all day.';
}

function getTodaySnapshotRequest(
  forecastSnapshot: Awaited<ReturnType<typeof getForecastScores>> | null,
): { envData: Record<string, unknown>; targetDate: string } | null {
  const targetDate = forecastSnapshot?.forecast.find((day) => day.day_offset === 0)?.date ?? null;
  const envData =
    forecastSnapshot?.snapshot_env && typeof forecastSnapshot.snapshot_env === 'object'
      ? (forecastSnapshot.snapshot_env as unknown as Record<string, unknown>)
      : null;

  if (!targetDate || !envData) return null;
  return { envData, targetDate };
}

// ─── Conditions helpers ───────────────────────────────────────────────────────

const STATE_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_CODE).map(([name, code]) => [code, name])
);

function getCurrentSeason(): string {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'Spring';
  if (m >= 5 && m <= 7) return 'Summer';
  if (m >= 8 && m <= 10) return 'Fall';
  return 'Winter';
}

function windCardinal(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8] ?? 'N';
}

function cloudCoverLabel(pct: number): string {
  if (pct <= 15) return 'Clear';
  if (pct <= 35) return 'Partly';
  if (pct <= 65) return 'Cloudy';
  return 'Overcast';
}

function windDirectionLabel16(deg: number): string {
  const cards = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? '—';
}

function moonPhaseLabel(phase: string | undefined, illumination: number | undefined): string {
  if (phase && phase !== 'Unknown') return phase;
  if (illumination == null) return '—';
  if (illumination <= 0.05) return 'New Moon';
  if (illumination <= 0.4)  return 'Crescent';
  if (illumination <= 0.6)  return 'Half';
  if (illumination <= 0.9)  return 'Gibbous';
  return 'Full Moon';
}

function pressureTrendInfo(trend: string): { label: string; color: string } | null {
  switch (trend) {
    case 'rapidly_falling': return { label: '↓↓ Rapidly Falling', color: '#2E7D32' };
    case 'slowly_falling':  return { label: '↓ Falling',          color: '#388E3C' };
    case 'stable':          return { label: 'Stable',             color: colors.textMuted };
    case 'slowly_rising':   return { label: '↑ Rising',           color: '#E65100' };
    case 'rapidly_rising':  return { label: '↑↑ Rapidly Rising',  color: '#B71C1C' };
    default: return null;
  }
}

// ─── Wizard sub-components (paper / FinFindr tackle language) ────────────────

/**
 * Species subtitle — a Latin-ish tag that mirrors the FinFindr tackle card
 * mock. Purely editorial and safe to show across regions since it's derived
 * from the species identity, not location data.
 */
const SPECIES_SUBTITLE: Record<SpeciesGroup, string> = {
  largemouth_bass: 'M. salmoides',
  smallmouth_bass: 'M. dolomieu',
  pike_musky:      'Esox lucius',
  river_trout:     'Salmonidae',
  walleye:         'S. vitreus',
  redfish:         'S. ocellatus',
  snook:           'C. undecimalis',
  seatrout:        'C. nebulosus',
  striped_bass:    'M. saxatilis',
  tarpon:          'M. atlanticus',
};

/**
 * One-liner copy shown under each water-type card. These mirror the
 * FinFindr reference phrasing ("still water…", "moving water…") and are
 * adapted for the two coastal contexts the engine supports, so the flow
 * stays truthful if a state adds them in the future.
 */
function contextSubtitle(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':
      return 'Still water — reservoirs, ponds, lakes';
    case 'freshwater_river':
      return 'Moving water — rivers, creeks, tailwaters';
    case 'coastal':
      return 'Saltwater shorelines — surf, piers, jetties';
    case 'coastal_flats_estuary':
      return 'Inshore flats, bays, and estuaries';
    default:
      return '';
  }
}

/** Visibility subtitle shown under each clarity card — matches the mock. */
const CLARITY_SUBTITLE: Record<WaterClarity, string> = {
  clear:   'Visibility 4+ feet',
  stained: 'Visibility 1–3 feet',
  dirty:   'Visibility under 1 foot',
};

// ─── Wizard step progress ────────────────────────────────────────────────────

/**
 * Editorial 3-step progress bar — each step is a paper tile with an ink
 * border and a numbered / checkmark medallion. The active step gets a
 * red medallion; completed steps fill forest and swap to a check.
 *
 * Matches the FinFindr `tackleStep` progress grid one-for-one in
 * proportion and affordance, adapted for React Native flex layout.
 */
function WizardStepProgress({
  current,
  onJumpToStep,
  allowJumpToStep,
}: {
  current: 1 | 2 | 3;
  /** Tapping a completed step jumps back to it; active/pending tiles ignore taps. */
  onJumpToStep: (step: 1 | 2 | 3) => void;
  allowJumpToStep: (step: 1 | 2 | 3) => boolean;
}) {
  const steps: { num: 1 | 2 | 3; label: string }[] = [
    { num: 1, label: 'SPECIES' },
    { num: 2, label: 'WATER' },
    { num: 3, label: 'CLARITY' },
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
              {isDone ? (
                <Ionicons name="checkmark" size={14} color={paper.forest} />
              ) : (
                <Text
                  style={[
                    wizardStyles.progressBadgeNum,
                    isActive && { color: paper.paper },
                  ]}
                >
                  {step.num}
                </Text>
              )}
            </View>
            <View style={{ minWidth: 0, flexShrink: 1 }}>
              <Text
                style={[
                  wizardStyles.progressEyebrow,
                  isDone && { color: paper.paper, opacity: 0.8 },
                ]}
              >
                STEP {step.num}
              </Text>
              <Text
                style={[
                  wizardStyles.progressLabel,
                  isDone && { color: paper.paper },
                ]}
                numberOfLines={1}
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
        Platform.OS === 'ios' && pressed && !isDisabled && !isActive && { opacity: 0.9 },
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
          <ExpoImage
            source={img}
            style={wizardStyles.speciesImage}
            contentFit="contain"
            transition={IMG_IN}
            cachePolicy="memory-disk"
          />
        )}
      </View>
      <View style={wizardStyles.speciesFooter}>
        <Text style={wizardStyles.speciesTitle} numberOfLines={1} ellipsizeMode="tail">
          {SPECIES_DISPLAY[sp]}
        </Text>
        <Text style={wizardStyles.speciesSubtitle} numberOfLines={1} ellipsizeMode="tail">
          {SPECIES_SUBTITLE[sp]}
        </Text>
      </View>
      {isActive && (
        <View style={wizardStyles.selectBadge}>
          <Ionicons name="checkmark" size={13} color={paper.paper} />
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
  // Base the image-area height on the full `allOptions` count so cards never
  // resize when a selection greys some out — keeps the grid stable.
  const cardHeight = speciesCardHeightForCount(allOptions.length);

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
  for (let i = 0; i < allOptions.length; i += 2) {
    rows.push(allOptions.slice(i, i + 2));
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
          {row.length === 1 && <View style={{ flex: 1 }} />}
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
  return (
    <View style={wizardStyles.contextGrid}>
      {allOptions.map((opt) => {
        const isActive = selected === opt;
        const isDisabled = !availableOptions.includes(opt);
        const img = getWatertypeImage(opt);
        return (
          <Pressable
            key={opt}
            style={({ pressed }) => [
              wizardStyles.contextCard,
              isActive && wizardStyles.contextCardActive,
              Platform.OS === 'ios' && pressed && !isDisabled && !isActive && { opacity: 0.9 },
            ]}
            onPress={() => {
              if (isDisabled) return;
              hapticSelection();
              onSelect(opt);
            }}
            android_ripple={isDisabled ? undefined : RIPPLE}
            disabled={isDisabled}
          >
            <View style={wizardStyles.contextImageArea}>
              {img && (
                <ExpoImage
                  source={img}
                  style={wizardStyles.contextImage}
                  contentFit="contain"
                  transition={IMG_IN}
                  cachePolicy="memory-disk"
                />
              )}
            </View>
            <Text style={wizardStyles.contextTitle} numberOfLines={1} ellipsizeMode="tail">
              {contextLabel(opt)}
            </Text>
            <Text style={wizardStyles.contextSubtitle} numberOfLines={2} ellipsizeMode="tail">
              {contextSubtitle(opt)}
            </Text>
            {isActive && (
              <View style={wizardStyles.selectBadge}>
                <Ionicons name="checkmark" size={13} color={paper.paper} />
              </View>
            )}
            {isDisabled && (
              <View style={wizardStyles.cardDisabledOverlay} pointerEvents="none" />
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
  const options: { value: WaterClarity; label: string }[] = [
    { value: 'clear',   label: 'Clear'   },
    { value: 'stained', label: 'Stained' },
    { value: 'dirty',   label: 'Murky'   },
  ];

  return (
    <View style={wizardStyles.clarityGrid}>
      {options.map(({ value, label }) => {
        const isActive = selected === value;
        const img = getWaterclarityImage(value);
        return (
          <Pressable
            key={value}
            style={({ pressed }) => [
              wizardStyles.clarityCard,
              isActive && wizardStyles.clarityCardActive,
              Platform.OS === 'ios' && pressed && !isActive && { opacity: 0.9 },
            ]}
            onPress={() => {
              hapticSelection();
              onSelect(value);
            }}
            android_ripple={RIPPLE}
          >
            <View style={wizardStyles.clarityImageArea}>
              <ExpoImage
                source={img}
                style={wizardStyles.clarityImage}
                contentFit="cover"
                transition={IMG_IN}
                cachePolicy="memory-disk"
              />
            </View>
            <Text style={wizardStyles.clarityTitle} numberOfLines={1}>
              {label}
            </Text>
            <Text style={wizardStyles.claritySubtitle} numberOfLines={2} ellipsizeMode="tail">
              {CLARITY_SUBTITLE[value]}
            </Text>
            {isActive && (
              <View style={wizardStyles.selectBadge}>
                <Ionicons name="checkmark" size={13} color={paper.paper} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type ScreenState = 'setup' | 'loading' | 'result' | 'error';

export default function RecommenderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    latitude?: string;
    longitude?: string;
    species?: string;
    context?: string;
  }>();

  const { profile } = useAuthStore();

  const lat = parseFloat(params.latitude ?? '');
  const lon = parseFloat(params.longitude ?? '');
  const hasCoords = !isNaN(lat) && !isNaN(lon);

  const initialSpecies =
    typeof params.species === 'string' && isRecommenderV3UiSpecies(params.species)
      ? params.species
      : null;
  const initialContext =
    typeof params.context === 'string' && isRecommenderV3UiContext(params.context)
      ? params.context
      : null;

  const [species, setSpecies] = useState<SpeciesGroup | null>(
    initialSpecies,
  );
  const [context, setContext] = useState<EngineContext | null>(
    initialContext,
  );
  const [clarity, setClarity] = useState<WaterClarity | null>(null);

  // Resolved state code — drives chip filtering
  const [stateCode, setStateCode] = useState<string | null>(null);
  const [resolvingRegion, setResolvingRegion] = useState(false);

  const [screenState, setScreenState] = useState<ScreenState>('setup');
  const [result, setResult] = useState<RecommenderResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Wizard step (setup phase only) ──────────────────────────────────────
  // `wizardStep` is purely a UI convenience; the underlying selection state
  // (`species`, `context`, `clarity`) is still the source of truth for
  // readiness/build-plan. Whenever we come back to the setup screen (initial
  // mount, or bounce from result/error), we reset the wizard to step 1.
  type WizardStep = 1 | 2 | 3;
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  useEffect(() => {
    if (screenState === 'setup') {
      setWizardStep((prev) => {
        // If we're on step 2 but species got wiped (state-change invalidation),
        // or on step 3 but species/context got wiped, bounce back rather than
        // letting the user sit on an empty step.
        if (prev === 2 && !species) return 1;
        if (prev === 3 && (!species || !context)) return species ? 2 : 1;
        return prev;
      });
    }
  }, [screenState, species, context]);

  // Each image in ALL_PRELOAD_IMAGES is rendered off-screen at 1×1px.
  // onLoad / onError fires when the native image pipeline finishes decoding it.
  // We count completions with a ref (avoids stale-closure issues) and only flip
  // setupImagesReady to true once every image has settled — guaranteeing zero
  // pop-in when the setup form appears.
  const preloadCountRef = useRef(0);
  const [setupImagesReady, setSetupImagesReady] = useState(false);
  const handlePreloadImage = useCallback(() => {
    preloadCountRef.current += 1;
    if (preloadCountRef.current >= ALL_PRELOAD_IMAGES.length) {
      setSetupImagesReady(true);
    }
  }, []);

  // Resolve state code as soon as we have coords
  useEffect(() => {
    if (!hasCoords) return;
    setResolvingRegion(true);
    resolveStateCode(lat, lon).then((code) => {
      setStateCode(code === 'XX' ? null : code);
      setResolvingRegion(false);
    });
  }, [lat, lon, hasCoords]);

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
      const validCtxs = getRecommenderContextsForStateSpecies(stateCode, species);
      if (!validCtxs.includes(context)) setContext(null);
    }
  }, [stateCode, species, context]);

  useEffect(() => {
    if (!context || !species) return;
    if (stateCode) {
      const validCtxs = getRecommenderContextsForStateSpecies(stateCode, species);
      if (!validCtxs.includes(context)) setContext(null);
      return;
    }
    if (!defaultContextsForSpecies(species).includes(context)) {
      setContext(null);
    }
  }, [context, stateCode, species]);

  // All species/contexts for the current state — these drive what cards are rendered.
  // We never remove cards from the grid; instead we grey out incompatible ones below.
  const allSpeciesForState: SpeciesGroup[] = stateCode
    ? getRecommenderSpeciesForState(stateCode)
    : RECOMMENDER_V3_UI_SPECIES;

  const allContextsForState: EngineContext[] = stateCode
    ? getRecommenderContextsForState(stateCode)
    : ENGINE_CONTEXTS;

  // Derived chip options — always state-aware (subset of the above)
  const availableSpecies: SpeciesGroup[] = stateCode
    ? getRecommenderSpeciesForState(stateCode).filter(
        (sp) => !context || getRecommenderContextsForStateSpecies(stateCode, sp).includes(context),
      )
    : RECOMMENDER_V3_UI_SPECIES.filter(
        (sp) => !context || defaultContextsForSpecies(sp).includes(context),
      );

  const availableContexts: EngineContext[] = stateCode && species
    ? getRecommenderContextsForStateSpecies(stateCode, species)
    : stateCode
      ? getRecommenderContextsForState(stateCode)
      : species
        ? defaultContextsForSpecies(species)
        : ENGINE_CONTEXTS;

  // Validation
  const isReady =
    species !== null &&
    context !== null &&
    clarity !== null &&
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
    async (forceRefresh = false) => {
      if (!isReady || !species || !context || !clarity) return;
      const isInlineRefresh = forceRefresh && screenState === 'result' && result !== null;

      if (isInlineRefresh) {
        setIsRefreshing(true);
      } else {
        setScreenState('loading');
        setErrorMsg(null);
      }

      try {
        const state_code = await resolveStateCode(lat, lon);
        if (state_code === 'XX') {
          throw new Error('state_resolution_failed');
        }
        const dailySnapshot = getTodaySnapshotRequest(await getForecastScores(lat, lon));
        if (!dailySnapshot) {
          throw new Error('daily_snapshot_unavailable');
        }
        const res = await fetchRecommendation(
          {
            latitude: lat,
            longitude: lon,
            state_code,
            species,
            context,
            water_clarity: clarity,
            env_data: dailySnapshot.envData,
            target_date: dailySnapshot.targetDate,
          },
          { forceRefresh },
        );

        // Preload the fish image so it's decoded before we flip to result —
        // everything renders together instead of popping in at different speeds.
        const img = getSpeciesImage(res.species);
        if (img) {
          await Asset.fromModule(img).downloadAsync();
        }

        setResult(res);
        setScreenState('result');
      } catch (err: unknown) {
        const friendlyMessage = recommenderErrorMessage(err, species, context);
        if (isInlineRefresh) {
          Alert.alert('Could not refresh recommendations', friendlyMessage);
        } else {
          setErrorMsg(friendlyMessage);
          setScreenState('error');
        }
      } finally {
        if (isInlineRefresh) {
          setIsRefreshing(false);
        }
      }
    },
    [isReady, species, context, clarity, lat, lon, result, screenState],
  );

  const handleReset = useCallback(() => {
    setScreenState('setup');
    setResult(null);
    setErrorMsg(null);
  }, []);

  const accentColor = context ? contextAccentColor(context) : colors.primary;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Off-screen image preloader — 1×1px, invisible.
          Renders every setup image immediately so the native pipeline decodes them
          before the form appears. onLoad/onError count up; page only shows once all settle. */}
      <View pointerEvents="none" style={styles.preloadContainer}>
        {ALL_PRELOAD_IMAGES.map((img, i) => (
          <ExpoImage
            key={i}
            source={img}
            style={styles.preloadImage}
            onLoadEnd={handlePreloadImage}
            onError={handlePreloadImage}
          />
        ))}
      </View>

      {/* Nav header — FinFindr paper language, shared across every state. */}
      <View style={wizardStyles.navHeader}>
        <Pressable
          style={({ pressed }) => [
            wizardStyles.navIconButton,
            Platform.OS === 'ios' && pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            if (screenState === 'result' || screenState === 'error') {
              handleReset();
            } else {
              router.back();
            }
          }}
          hitSlop={12}
          android_ripple={RIPPLE}
        >
          <Ionicons name="chevron-back" size={14} color={paper.ink} />
          <Text style={wizardStyles.navIconButtonText}>
            {screenState === 'result' || screenState === 'error' ? 'SETUP' : 'BACK'}
          </Text>
        </Pressable>

        <View style={wizardStyles.navTitleWrap} pointerEvents="none">
          <Text style={wizardStyles.navEyebrow}>FINFINDR</Text>
          <Text style={wizardStyles.navTitle} numberOfLines={1} ellipsizeMode="tail">
            WHAT TO THROW
          </Text>
        </View>

        {/* Right slot — state pill during setup, reset affordance on result. */}
        <View style={wizardStyles.navRight}>
          {screenState === 'setup' && (resolvingRegion ? (
            <ActivityIndicator
              size="small"
              color={paper.ink}
              style={{ transform: [{ scale: 0.7 }] }}
            />
          ) : stateCode ? (
            <View style={wizardStyles.navStatePill}>
              <Ionicons name="location" size={10} color={paper.ink} />
              <Text style={wizardStyles.navStatePillText}>{stateCode}</Text>
            </View>
          ) : null)}

          {screenState === 'result' && (
            <Pressable
              style={({ pressed }) => [
                wizardStyles.navIconButton,
                Platform.OS === 'ios' && pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                hapticSelection();
                handleReset();
              }}
              hitSlop={12}
              android_ripple={RIPPLE}
            >
              <Ionicons name="options-outline" size={14} color={paper.ink} />
              <Text style={wizardStyles.navIconButtonText}>EDIT</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Setup: waiting for images ── */}
      {screenState === 'setup' && !setupImagesReady && (
        <PaperBackground style={{ flex: 1 }}>
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={paper.forest} />
          </View>
        </PaperBackground>
      )}

      {/* ── Setup form (FinFindr tackle wizard) ── */}
      {screenState === 'setup' && setupImagesReady && (() => {
        const stepConfig: { num: 1 | 2 | 3; question: string; caption: string }[] = [
          { num: 1, question: 'What are you after?',       caption: 'Pick a target species.' },
          { num: 2, question: 'Where are you fishing?',    caption: 'Pick the body of water you are on.' },
          { num: 3, question: "How's the water today?",    caption: 'Pick the clarity you are seeing.' },
        ];
        const current = stepConfig[wizardStep - 1];

        const canContinue =
          wizardStep === 1 ? species !== null && availableSpecies.includes(species)
          : wizardStep === 2 ? context !== null && availableContexts.includes(context)
          : clarity !== null;

        const allowJumpToStep = (step: 1 | 2 | 3) => {
          if (step === 1) return true;
          if (step === 2) return species !== null && availableSpecies.includes(species);
          return species !== null && context !== null;
        };

        const handleBack = () => {
          if (wizardStep === 1) {
            router.back();
            return;
          }
          hapticSelection();
          setWizardStep((prev) => (prev === 3 ? 2 : 1));
        };

        const handleContinueOrSubmit = () => {
          if (!canContinue) return;
          if (wizardStep < 3) {
            hapticSelection();
            setWizardStep((prev) => (prev === 1 ? 2 : 3));
            return;
          }
          if (!isReady) return;
          hapticImpact(ImpactFeedbackStyle.Medium);
          handleFetch(false);
        };

        const contextInvalidNote =
          wizardStep === 2 && species && availableContexts.length === 0
            ? `No water types available for ${SPECIES_DISPLAY[species]} in this region.`
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
                  LET'S DIAL IN{'\n'}
                  <Text style={wizardStyles.heroTitleAccent}>YOUR PICKS.</Text>
                </Text>
                <Text style={wizardStyles.heroSubtitle}>
                  Three quick questions and we'll rank the best lures and flies for today.
                </Text>
              </View>

              {/* Location warning — only when no coords */}
              {!hasCoords && (
                <View style={wizardStyles.warningBanner}>
                  <Ionicons name="location-outline" size={14} color={paper.red} />
                  <Text style={wizardStyles.warningText}>
                    Add a location on the home screen for today's conditions.
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
                  color={paper.forestDk}
                  count={4}
                />
                <CornerMarkSet color={paper.red} inset={10} size={12} />

                <View style={wizardStyles.stepCardHeader}>
                  <Text style={wizardStyles.stepCardEyebrow}>
                    STEP {wizardStep} OF 3
                  </Text>
                  <Text style={wizardStyles.stepCardTitle} allowFontScaling={false}>
                    {current.question}
                  </Text>
                  <Text style={wizardStyles.stepCardCaption}>
                    {current.caption}
                  </Text>
                </View>

                {wizardStep === 1 && (
                  <SpeciesGrid
                    allOptions={allSpeciesForState}
                    availableOptions={availableSpecies}
                    selected={species}
                    onSelect={(sp) => {
                      setSpecies(sp);
                      if (context) {
                        const validCtxs = stateCode
                          ? getRecommenderContextsForStateSpecies(stateCode, sp)
                          : defaultContextsForSpecies(sp);
                        if (!validCtxs.includes(context)) setContext(null);
                      }
                    }}
                  />
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
              </View>

              {/* Readiness hint on the last step only — so users understand
                  what's blocking the final CTA (e.g. location not resolved). */}
              {wizardStep === 3 && !isReady && setupHint && (
                <Text style={wizardStyles.readinessHint}>{setupHint}</Text>
              )}

              {/* Wizard actions */}
              <View style={wizardStyles.actionsRow}>
                <Pressable
                  style={({ pressed }) => [
                    wizardStyles.backButton,
                    Platform.OS === 'ios' && pressed && { opacity: 0.85 },
                  ]}
                  onPress={handleBack}
                  android_ripple={{ color: 'rgba(10,22,40,0.08)' }}
                  hitSlop={8}
                >
                  <Ionicons name="chevron-back" size={14} color={paper.ink} />
                  <Text style={wizardStyles.backButtonText}>
                    {wizardStep === 1 ? 'CANCEL' : 'BACK'}
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    wizardStyles.continueButton,
                    !canContinue && wizardStyles.continueButtonDisabled,
                    wizardStep === 3 && canContinue && isReady && wizardStyles.continueButtonFinal,
                    Platform.OS === 'ios' && pressed && canContinue && { opacity: 0.9 },
                  ]}
                  onPress={handleContinueOrSubmit}
                  disabled={!canContinue || (wizardStep === 3 && !isReady)}
                  android_ripple={
                    canContinue ? { color: 'rgba(255,255,255,0.18)' } : undefined
                  }
                >
                  <Text
                    style={[
                      wizardStyles.continueButtonText,
                      !canContinue && wizardStyles.continueButtonTextDisabled,
                    ]}
                  >
                    {wizardStep === 3 ? 'GENERATE PICKS' : 'CONTINUE'}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={canContinue ? paper.paper : paper.ink}
                  />
                </Pressable>
              </View>

              <Text style={wizardStyles.disclaimer}>
                Recommendations use your location's seasonal baseline, today's midnight conditions, and water clarity.
              </Text>
            </ScrollView>
          </PaperBackground>
        );
      })()}

      {/* ── Loading ── */}
      {screenState === 'loading' && (
        <PaperBackground style={{ flex: 1 }}>
          <View style={styles.loadingWrap}>
            <RecommenderLoadingSkeleton />
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator size="small" color={paper.forest} />
              <Text style={wizardStyles.loadingCaption}>
                MATCHING LURES &amp; FLIES…
              </Text>
            </View>
          </View>
        </PaperBackground>
      )}

      {/* ── Error ── */}
      {screenState === 'error' && (
        <PaperBackground style={{ flex: 1 }}>
          <View style={wizardStyles.errorState}>
            <View style={wizardStyles.errorBadge}>
              <Ionicons name="alert" size={22} color={paper.paper} />
            </View>
            <Text style={wizardStyles.errorTitle}>
              COULD NOT BUILD YOUR PLAN
            </Text>
            <Text style={wizardStyles.errorBody}>{errorMsg}</Text>
            <View style={wizardStyles.errorActions}>
              <Pressable
                style={({ pressed }) => [
                  wizardStyles.errorPrimary,
                  Platform.OS === 'ios' && pressed && { opacity: 0.9 },
                ]}
                onPress={() => {
                  hapticImpact(ImpactFeedbackStyle.Light);
                  handleFetch(true);
                }}
                android_ripple={{ color: 'rgba(255,255,255,0.18)' }}
              >
                <Text style={wizardStyles.errorPrimaryText}>TRY AGAIN</Text>
                <Ionicons name="refresh" size={14} color={paper.paper} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  wizardStyles.errorSecondary,
                  Platform.OS === 'ios' && pressed && { opacity: 0.85 },
                ]}
                onPress={() => {
                  hapticSelection();
                  handleReset();
                }}
                android_ripple={RIPPLE}
              >
                <Ionicons name="chevron-back" size={12} color={paper.ink} />
                <Text style={wizardStyles.errorSecondaryText}>BACK TO SETUP</Text>
              </Pressable>
            </View>
          </View>
        </PaperBackground>
      )}

      {/* ── Result ── */}
      {screenState === 'result' && result && (
        <RecommenderView
          result={result}
          style={styles.resultView}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // Paper canvas, so the nav header + every sub-state sits on the same
    // warm surface and transitions don't flash white.
    backgroundColor: paper.paper,
  },

  // Nav
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderBottomWidth: 2,
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
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  navRight: {
    alignItems: 'flex-end',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.xs + 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: fonts.bodyItalic,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Warning — soft alert matching the Dashboard tint system
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.reportScoreYellowBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.reportScoreYellow + '22',
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.reportScoreYellow,
    lineHeight: 18,
  },

  // Off-screen image preloader
  preloadContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    opacity: 0,
  },
  preloadImage: {
    width: 1,
    height: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: colors.primary + '55',
  },
  sectionEyebrowLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.text,
    letterSpacing: -0.3,
    lineHeight: 26,
    textAlign: 'center',
  },

  // Species grid
  speciesGrid: {
    gap: spacing.sm + 2,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  // Selection tiles — unified treatment across species, context, clarity
  speciesCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  speciesCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryMist,
    ...shadows.md,
  },
  speciesFishArea: {
    width: '100%',
  },
  speciesImage: {
    width: '100%',
    height: '100%',
  },
  speciesNameFooter: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  speciesCardText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  speciesCheckBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 99,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  // Shared disabled overlay — soft mint tint over incompatible cards
  cardDisabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(180,195,183,0.52)',
    borderRadius: radius.md,
  },

  // Body of Water — same treatment as species tiles
  contextRow: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  contextCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  contextImageArea: {
    width: '100%',
    aspectRatio: 1.5,
  },
  contextCardImage: {
    width: '100%',
    height: '100%',
  },
  contextNameFooter: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  contextCardText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.text,
    letterSpacing: -0.1,
  },
  contextCheckBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  // Water clarity — 3-col, same treatment as species/context tiles
  clarityRow: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  clarityCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  clarityImageArea: {
    width: '100%',
    aspectRatio: 1.2,
  },
  clarityCardImage: {
    width: '100%',
    height: '100%',
  },
  clarityNameFooter: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 2,
  },
  clarityCardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: -0.1,
  },
  clarityCardSub: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  clarityCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  // Validation note
  validationNote: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.reportScoreYellow,
    lineHeight: 18,
  },

  // CTA — matches How's Fishing generateBtn (rounded md, shadow md)
  ctaWrap: {
    marginTop: spacing.sm,
    gap: spacing.sm + 2,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
  },

  // Loading / error
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  loadingWrap: {
    flex: 1,
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl * 2,
    gap: spacing.sm,
  },
  loadingCaption: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
  },
  errorMsg: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
    color: '#fff',
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
// Paper / FinFindr tackle-setup language. Sits alongside the legacy `styles`
// block because the wizard lives only in the setup phase — the loading /
// error / result phases still use the original system.

const wizardStyles = StyleSheet.create({
  // ─── Shared nav header (paper language) ─────────────────────────────────
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.sm,
    backgroundColor: paper.paper,
    borderBottomWidth: 1,
    borderBottomColor: paper.inkHairSoft,
    gap: paperSpacing.sm,
  },
  navTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: paperSpacing.sm,
    bottom: paperSpacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    color: paper.red,
    letterSpacing: 2.6,
  },
  navTitle: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    color: paper.ink,
    letterSpacing: -0.2,
    marginTop: 1,
  },
  navIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: 'transparent',
  },
  navIconButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 2.2,
  },
  navRight: {
    minWidth: 62,
    alignItems: 'flex-end',
  },
  navStatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paperLight,
  },
  navStatePillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 1.6,
  },

  scrollContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xl + paperSpacing.md,
    gap: paperSpacing.md,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: paperSpacing.xs,
    paddingBottom: paperSpacing.sm,
    gap: paperSpacing.xs,
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.ink,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -1,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  heroTitleAccent: {
    color: paper.forest,
  },
  heroSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
    paddingHorizontal: paperSpacing.sm,
  },

  // Warning banner
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.red,
    borderRadius: paperRadius.chip,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
  },
  warningText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.ink,
    lineHeight: 17,
  },

  // Step progress — three paper tiles in a row
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: paperSpacing.xs,
    marginBottom: paperSpacing.sm,
  },
  progressTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paper,
  },
  progressTileActive: {
    backgroundColor: paper.paperLight,
    ...paperShadows.hard,
  },
  progressTileDone: {
    backgroundColor: paper.forest,
    borderColor: paper.ink,
  },
  progressBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  progressBadgeActive: {
    backgroundColor: paper.red,
    borderColor: paper.ink,
  },
  progressBadgeDone: {
    backgroundColor: paper.paper,
    borderColor: paper.paper,
  },
  progressBadgeNum: {
    fontFamily: paperFonts.display,
    fontSize: 13,
    color: paper.ink,
    includeFontPadding: false,
  },
  progressEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 8.5,
    color: paper.ink,
    opacity: 0.6,
    letterSpacing: 2,
  },
  progressLabel: {
    fontFamily: paperFonts.display,
    fontSize: 12,
    color: paper.ink,
    letterSpacing: -0.2,
    marginTop: 1,
  },

  // Step content card
  stepCard: {
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.lg,
    paddingHorizontal: paperSpacing.md,
    gap: paperSpacing.md,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  stepCardHeader: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: paperSpacing.xs,
  },
  stepCardEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.red,
    letterSpacing: 2.6,
  },
  stepCardTitle: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    color: paper.ink,
    letterSpacing: -0.6,
    textAlign: 'center',
    lineHeight: 28,
  },
  stepCardCaption: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Species grid
  speciesGrid: {
    gap: 12,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  speciesCard: {
    flex: 1,
    backgroundColor: paper.paper,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    overflow: 'hidden',
    position: 'relative',
    ...paperShadows.hard,
  },
  speciesCardActive: {
    borderColor: paper.red,
    backgroundColor: paper.paperLight,
    ...paperShadows.lift,
  },
  speciesImageArea: {
    width: '100%',
    backgroundColor: paper.paper,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: paper.ink,
  },
  speciesImage: {
    width: '92%',
    height: '92%',
  },
  speciesFooter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  speciesTitle: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    color: paper.ink,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  speciesSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.6,
    textAlign: 'center',
  },

  // Context (water-type) grid
  contextGrid: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  contextCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: paper.paper,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
    position: 'relative',
    ...paperShadows.hard,
  },
  contextCardActive: {
    borderColor: paper.red,
    backgroundColor: paper.paperLight,
    ...paperShadows.lift,
  },
  contextImageArea: {
    width: '100%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contextImage: {
    width: '88%',
    height: '88%',
  },
  contextTitle: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.ink,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  contextSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.65,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },

  // Clarity grid
  clarityGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  clarityCard: {
    flex: 1,
    backgroundColor: paper.paper,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: 'center',
    position: 'relative',
    ...paperShadows.hard,
  },
  clarityCardActive: {
    borderColor: paper.red,
    backgroundColor: paper.paperLight,
    ...paperShadows.lift,
  },
  clarityImageArea: {
    width: 68,
    height: 68,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: paper.ink,
    overflow: 'hidden',
    marginBottom: 10,
  },
  clarityImage: {
    width: '100%',
    height: '100%',
  },
  clarityTitle: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.ink,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  claritySubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.65,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 13,
  },

  // Shared select badge
  selectBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: paper.red,
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  cardDisabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(232,223,201,0.62)',
  },

  // Validation notes / readiness hint
  validationNote: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.red,
    textAlign: 'center',
    paddingHorizontal: paperSpacing.sm,
    lineHeight: 17,
  },
  readinessHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.65,
    textAlign: 'center',
    paddingHorizontal: paperSpacing.md,
    lineHeight: 17,
    marginTop: -paperSpacing.xs,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: paperSpacing.xs,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paper,
  },
  backButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.4,
  },
  continueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.forest,
    ...paperShadows.hard,
  },
  continueButtonFinal: {
    backgroundColor: paper.forest,
  },
  continueButtonDisabled: {
    backgroundColor: paper.paper,
    ...paperShadows.hard,
  },
  continueButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.paper,
    letterSpacing: 2.6,
  },
  continueButtonTextDisabled: {
    color: paper.ink,
    opacity: 0.45,
  },

  disclaimer: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.55,
    textAlign: 'center',
    paddingHorizontal: paperSpacing.sm,
    lineHeight: 16,
    marginTop: paperSpacing.xs,
  },

  // ─── Loading caption (field-guide tone) ───────────────────────────────
  loadingCaption: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 3,
    opacity: 0.7,
    textAlign: 'center',
  },

  // ─── Error state (paper) ──────────────────────────────────────────────
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: paperSpacing.xl,
    gap: paperSpacing.sm,
  },
  errorBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: paper.red,
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...paperShadows.hard,
  },
  errorTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.red,
    letterSpacing: 2.8,
    textAlign: 'center',
    marginTop: paperSpacing.xs,
  },
  errorBody: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: paperSpacing.sm,
    opacity: 0.8,
  },
  errorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.sm,
  },
  errorPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: paper.forest,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    ...paperShadows.hard,
  },
  errorPrimaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.paper,
    letterSpacing: 2.4,
  },
  errorSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: paper.paper,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
  },
  errorSecondaryText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.2,
  },
});
