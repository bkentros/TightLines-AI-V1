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
import { colors, fonts, spacing, radius, shadows } from '../lib/theme';
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
  WATER_CLARITY_LABELS,
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
    case 'freshwater_lake_pond':  return 'Lake';
    case 'freshwater_river':      return 'River';
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

// ─── Setup sub-components ─────────────────────────────────────────────────────

/** Floats above each section card — step pill + guiding question */
function StepQuestion({ step, label, question }: { step: number; label: string; question: string }) {
  return (
    <View style={styles.stepQuestion}>
      <View style={styles.stepQuestionAccent} />
      <View style={styles.stepQuestionBody}>
        <Text style={styles.stepQuestionLabel}>{`0${step}  ·  ${label.toUpperCase()}`}</Text>
        <Text style={styles.stepQuestionText}>{question}</Text>
      </View>
    </View>
  );
}

// ─── Species Card ─────────────────────────────────────────────────────────────

function SpeciesCard({
  sp,
  isActive,
  isDisabled,
  onSelect,
  fishAreaHeight,
}: {
  sp: SpeciesGroup;
  isActive: boolean;
  isDisabled: boolean;
  onSelect: (s: SpeciesGroup) => void;
  fishAreaHeight: number;
}) {
  const img = getSpeciesImage(sp);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.speciesCard,
        isActive && styles.speciesCardActive,
        Platform.OS === 'ios' && pressed && !isDisabled && { opacity: 0.88 },
      ]}
      onPress={() => {
        if (isDisabled) return;
        hapticSelection();
        onSelect(sp);
      }}
      android_ripple={isDisabled ? undefined : RIPPLE}
      disabled={isDisabled}
    >
      <View style={[styles.speciesFishArea, { height: fishAreaHeight }]}>
        {img && (
          <ExpoImage
            source={img}
            style={styles.speciesImage}
            contentFit="contain"
            transition={IMG_IN}
            cachePolicy="memory-disk"
          />
        )}
      </View>
      <View style={styles.speciesNameFooter}>
        <Text style={styles.speciesCardText} numberOfLines={1} ellipsizeMode="tail">
          {SPECIES_DISPLAY[sp]}
        </Text>
      </View>
      {isActive && (
        <View style={styles.speciesCheckBadge}>
          <Ionicons name="checkmark" size={13} color="#fff" />
        </View>
      )}
      {isDisabled && <View style={styles.cardDisabledOverlay} pointerEvents="none" />}
    </Pressable>
  );
}

// ─── Species Grid ─────────────────────────────────────────────────────────────

function fishAreaHeightForCount(count: number): number {
  if (count === 1) return 160; // was 200 → −20%
  if (count === 2) return 128; // was 160 → −20%
  return 104;                  // was 130 → −20%
}

function SpeciesGrid({
  allOptions,
  availableOptions,
  selected,
  onSelect,
}: {
  allOptions: SpeciesGroup[];      // every species for this state — always rendered
  availableOptions: SpeciesGroup[]; // subset compatible with current water-type selection
  selected: SpeciesGroup | null;
  onSelect: (s: SpeciesGroup) => void;
}) {
  // Base size on the full allOptions count so cards never resize when a selection greys some out
  const fishAreaHeight = fishAreaHeightForCount(allOptions.length);

  if (allOptions.length === 1) {
    return (
      <View style={styles.speciesGrid}>
        <SpeciesCard
          sp={allOptions[0]}
          isActive={selected === allOptions[0]}
          isDisabled={!availableOptions.includes(allOptions[0])}
          onSelect={onSelect}
          fishAreaHeight={fishAreaHeight}
        />
      </View>
    );
  }

  const rows: SpeciesGroup[][] = [];
  for (let i = 0; i < allOptions.length; i += 2) {
    rows.push(allOptions.slice(i, i + 2));
  }

  return (
    <View style={styles.speciesGrid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.speciesRow}>
          {row.map((sp) => (
            <SpeciesCard
              key={sp}
              sp={sp}
              isActive={selected === sp}
              isDisabled={!availableOptions.includes(sp)}
              onSelect={onSelect}
              fishAreaHeight={fishAreaHeight}
            />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}

// ─── Context selector (Body of Water) — image cards ──────────────────────────

function ContextSelector({
  allOptions,
  availableOptions,
  selected,
  onSelect,
  accentColor,
}: {
  allOptions: EngineContext[];      // every water type for this state — always rendered
  availableOptions: EngineContext[]; // subset compatible with selected species
  selected: EngineContext | null;
  onSelect: (v: EngineContext) => void;
  accentColor: string;
}) {
  return (
    <View style={styles.contextRow}>
      {allOptions.map((opt) => {
        const isActive = selected === opt;
        const isDisabled = !availableOptions.includes(opt);
        const img = getWatertypeImage(opt);
        return (
          <Pressable
            key={opt}
            style={({ pressed }) => [
              styles.contextCard,
              isActive && { borderColor: accentColor, borderWidth: 2 },
              Platform.OS === 'ios' && pressed && !isDisabled && { opacity: 0.88 },
            ]}
            onPress={() => {
              if (isDisabled) return;
              hapticSelection();
              onSelect(opt);
            }}
            android_ripple={isDisabled ? undefined : RIPPLE}
            disabled={isDisabled}
          >
            <View style={styles.contextImageArea}>
              {img && (
                <ExpoImage
                  source={img}
                  style={styles.contextCardImage}
                  contentFit="contain"
                  transition={IMG_IN}
                  cachePolicy="memory-disk"
                />
              )}
            </View>
            <View style={styles.contextNameFooter}>
              <Text
                style={[styles.contextCardText, isActive && { color: accentColor, fontFamily: fonts.bodySemiBold }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {contextLabel(opt)}
              </Text>
            </View>
            {isActive && (
              <View style={[styles.contextCheckBadge, { backgroundColor: accentColor }]}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
            {isDisabled && <View style={styles.cardDisabledOverlay} pointerEvents="none" />}
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Clarity selector — image cards ──────────────────────────────────────────

function ClaritySelector({
  selected,
  onSelect,
  accentColor,
}: {
  selected: WaterClarity | null;
  onSelect: (c: WaterClarity) => void;
  accentColor: string;
}) {
  const options: { value: WaterClarity; label: string; sub: string }[] = [
    { value: 'clear',   label: 'Clear',   sub: 'High visibility' },
    { value: 'stained', label: 'Stained', sub: 'Tinted water' },
    { value: 'dirty',   label: 'Murky',   sub: 'Low visibility' },
  ];

  return (
    <View style={styles.clarityRow}>
      {options.map(({ value, label, sub }) => {
        const isActive = selected === value;
        const img = getWaterclarityImage(value);
        return (
          <Pressable
            key={value}
            style={({ pressed }) => [
              styles.clarityCard,
              isActive && { borderColor: accentColor, borderWidth: 2 },
              Platform.OS === 'ios' && pressed && { opacity: 0.88 },
            ]}
            onPress={() => {
              hapticSelection();
              onSelect(value);
            }}
            android_ripple={RIPPLE}
          >
            <View style={styles.clarityImageArea}>
              <ExpoImage
                source={img}
                style={styles.clarityCardImage}
                contentFit="cover"
                transition={IMG_IN}
                cachePolicy="memory-disk"
              />
            </View>
            <View style={styles.clarityNameFooter}>
              <Text
                style={[styles.clarityCardTitle, { color: isActive ? accentColor : colors.text }]}
                numberOfLines={1}
              >
                {label}
              </Text>
              <Text
                style={[styles.clarityCardSub, isActive && { color: accentColor + 'BB' }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {sub}
              </Text>
            </View>
            {isActive && (
              <View style={[styles.clarityCheck, { backgroundColor: accentColor }]}>
                <Ionicons name="checkmark" size={9} color="#fff" />
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

      {/* Nav header */}
      <View style={[
        styles.navHeader,
        screenState === 'setup' && styles.navHeaderBorderless,
      ]}>
        <Pressable
          style={({ pressed }) => [
            styles.backBtn,
            Platform.OS === 'ios' && pressed && { opacity: 0.6 },
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
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>

        <Text style={styles.navTitle} numberOfLines={1} ellipsizeMode="tail">
          Lure & Fly Recommender
        </Text>

        {/* Region pill — only in setup, right side */}
        {screenState === 'setup' && (
          <View style={styles.navRight}>
            {resolvingRegion ? (
              <ActivityIndicator size="small" color={colors.textMuted} style={{ transform: [{ scale: 0.7 }] }} />
            ) : stateCode ? (
              <View style={styles.regionPill}>
                <Ionicons name="location" size={11} color={colors.primaryLight} />
                <Text style={styles.regionPillText}>{stateCode}</Text>
              </View>
            ) : null}
          </View>
        )}

        {screenState === 'result' && (
          <Pressable
            style={({ pressed }) => [styles.resetBtn, Platform.OS === 'ios' && pressed && { opacity: 0.6 }]}
            onPress={() => {
              hapticSelection();
              handleReset();
            }}
            hitSlop={12}
            android_ripple={RIPPLE}
          >
            <Ionicons name="options-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* ── Setup: waiting for images ── */}
      {screenState === 'setup' && !setupImagesReady && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={accentColor} />
        </View>
      )}

      {/* ── Setup form ── */}
      {screenState === 'setup' && setupImagesReady && (
        <ScrollView
          style={styles.setupScroll}
          contentContainerStyle={styles.setupContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero headline */}
          <View style={styles.heroHeader}>
            <View style={styles.heroAccent}>
              <View style={styles.heroAccentLine} />
              <Ionicons name="fish-outline" size={13} color={colors.primary} />
              <View style={styles.heroAccentLine} />
            </View>
            <Text style={styles.heroTitle}>
              {"Pick the right lure or fly\nfor where you’re fishing now."}
            </Text>
          </View>

          {/* Location warning — only when no coords */}
          {!hasCoords && (
            <View style={styles.warningBanner}>
              <Ionicons name="location-outline" size={14} color={colors.reportScoreYellow} />
              <Text style={styles.warningText}>
                Add a location for today&apos;s conditions.
              </Text>
            </View>
          )}

          {/* Decorative bridge — separates hero from the step cards */}
          <View style={styles.sectionBridge}>
            <View style={styles.sectionBridgeLine} />
            <Ionicons name="fish-outline" size={12} color={colors.primary + '70'} />
            <Text style={styles.sectionBridgeText}>3 quick questions</Text>
            <Ionicons name="fish-outline" size={12} color={colors.primary + '70'} style={{ transform: [{ scaleX: -1 }] }} />
            <View style={styles.sectionBridgeLine} />
          </View>

          {/* 01 — Target Species */}
          <StepQuestion step={1} label="Target Species" question="Click your target species." />
          <View style={styles.sectionCard}>
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
          </View>

          {/* 02 — Body of Water */}
          <StepQuestion step={2} label="Body of Water" question="Where are you fishing today?" />
          <View style={styles.sectionCard}>
            <ContextSelector
              allOptions={allContextsForState}
              availableOptions={availableContexts}
              selected={context}
              onSelect={setContext}
              accentColor={accentColor}
            />
            {availableContexts.length === 0 && species && (
              <Text style={styles.validationNote}>
                No water types available for {SPECIES_DISPLAY[species]} in this region.
              </Text>
            )}
          </View>

          {/* 03 — Water Clarity */}
          <StepQuestion step={3} label="Water Clarity" question="How's the water looking today?" />
          <View style={styles.sectionCard}>
            <ClaritySelector
              selected={clarity}
              onSelect={setClarity}
              accentColor={accentColor}
            />
          </View>

          {/* CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: isReady ? accentColor : colors.disabled },
              isReady && shadows.md,
              Platform.OS === 'ios' && pressed && isReady && { opacity: 0.92 },
            ]}
            disabled={!isReady}
            onPress={() => {
              if (!isReady) return;
              hapticImpact(ImpactFeedbackStyle.Medium);
              handleFetch(false);
            }}
            android_ripple={isReady ? { color: 'rgba(255,255,255,0.25)' } : undefined}
          >
            <Text style={styles.ctaBtnText}>Build plan</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>

          <Text style={styles.setupDisclaimer}>
            Lure and fly recommendations are based around your location&apos;s seasonal characteristics, influence from daily conditions, and water clarity.
          </Text>
        </ScrollView>
      )}

      {/* ── Loading ── */}
      {screenState === 'loading' && (
        <View style={styles.loadingWrap}>
          <RecommenderLoadingSkeleton />
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator size="small" color={accentColor} />
            <Text style={styles.loadingCaption}>Matching lures & flies…</Text>
          </View>
        </View>
      )}

      {/* ── Error ── */}
      {screenState === 'error' && (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.reportScoreRed} />
          <Text style={styles.errorTitle}>Could not build your plan</Text>
          <Text style={styles.errorMsg}>{errorMsg}</Text>
          <Pressable
            style={({ pressed }) => [styles.retryBtn, Platform.OS === 'ios' && pressed && { opacity: 0.88 }]}
            onPress={() => {
              hapticImpact(ImpactFeedbackStyle.Light);
              handleFetch(true);
            }}
            android_ripple={RIPPLE}
          >
            <Text style={styles.retryBtnText}>Try again</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, Platform.OS === 'ios' && pressed && { opacity: 0.88 }]}
            onPress={() => {
              hapticSelection();
              handleReset();
            }}
            android_ripple={RIPPLE}
          >
            <Text style={styles.secondaryBtnText}>Back to setup</Text>
          </Pressable>
        </View>
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
    backgroundColor: colors.background,
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 64,
    gap: 14,
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
    borderColor: colors.borderLight,
  },
  regionPillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.primaryLight,
  },

  // Hero headline
  heroHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: 4,
    gap: 10,
  },
  heroAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroAccentLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primaryMistDark,
    maxWidth: 44,
  },
  heroTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.4,
  },

  // Warning
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.reportScoreYellowBg,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.reportScoreYellow,
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

  // Page title
  pageTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.text,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: -4,
  },

  // Section card — each step gets its own floating white card
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.primary + '55',
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  // Decorative bridge between hero and section cards
  sectionBridge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  sectionBridgeLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  sectionBridgeText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },

  // Step question — floats above each section card
  stepQuestion: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 11,
    paddingHorizontal: 2,
    marginBottom: -4,
  },
  stepQuestionAccent: {
    width: 3,
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  stepQuestionBody: {
    gap: 3,
    paddingVertical: 2,
  },
  stepQuestionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.primaryLight,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
  stepQuestionText: {
    fontFamily: fonts.serifBold,
    fontSize: 19,
    color: colors.text,
    letterSpacing: -0.3,
    lineHeight: 24,
  },

  // Sections
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionStep: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  sectionLabelDivider: {
    width: 1.5,
    height: 15,
    backgroundColor: colors.primaryMistDark,
  },
  sectionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.primaryDark,
    letterSpacing: 1.6,
  },

  // Species grid
  speciesGrid: {
    gap: 10,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  // No fixed height — card auto-sizes to fishAreaHeight (inline) + footer
  speciesCard: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  speciesCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  // width: '100%' + explicit height (set inline from prop) = reliable image sizing in RN
  speciesFishArea: {
    width: '100%',
  },
  speciesImage: {
    width: '100%',
    height: '100%',
  },
  speciesNameFooter: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  speciesCardText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  speciesCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 99,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  // Shared disabled overlay — grey hue over species and water-type cards
  // when they are incompatible with the current selection.
  cardDisabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(180,195,183,0.52)',
    borderRadius: radius.xl,
  },

  // Body of Water — image cards (same pattern as species cards)
  contextRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contextCard: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  // aspectRatio: 1.5 matches the 600×400 (3:2) source images — ensures full image shows
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
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  contextCardText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
  },
  contextCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Water clarity — image cards (3-col)
  clarityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  clarityCard: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  // cover for underwater scenes — fills the card nicely for tall-ish crops
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
    paddingHorizontal: 8,
    paddingVertical: 9,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 1,
  },
  clarityCardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  clarityCardSub: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  clarityCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Validation note
  validationNote: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.reportScoreYellow,
    lineHeight: 18,
  },

  // Inline hint above CTA
  setupHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: -4,
  },

  // CTA — pill shaped, taller, premium
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 19,
    borderRadius: radius.full,
  },
  ctaBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    color: '#fff',
    letterSpacing: 0.2,
  },
  setupDisclaimer: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
    marginTop: -2,
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
