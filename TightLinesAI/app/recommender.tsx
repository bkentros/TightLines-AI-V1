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

/**
 * Section header — matches the Dashboard `sectionDividerRow` language
 * (line · icon · uppercase label · line) with a serif headline directly below.
 * Keeps the builder rhythm aligned with the rest of the app.
 */
function SectionHeader({
  step,
  eyebrow,
  title,
}: {
  step: number;
  eyebrow: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionEyebrowRow}>
        <View style={styles.sectionEyebrowLine} />
        <Text style={styles.sectionEyebrowStep}>{`STEP 0${step}`}</Text>
        <View style={styles.sectionEyebrowDot} />
        <Text style={styles.sectionEyebrowLabel}>{eyebrow}</Text>
        <View style={styles.sectionEyebrowLine} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
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
          What to Throw
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
          {/* Hero headline — mirrors Dashboard brand row rhythm */}
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={11} color={colors.primary} />
              <Text style={styles.heroBadgeText}>Lure & Fly Recommender</Text>
            </View>
            <Text style={styles.heroTitle}>
              Pick the right lure or fly
            </Text>
            <Text style={styles.heroSubtitle}>
              Tailored to today's conditions and your water.
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

          {/* 01 — Target Species */}
          <SectionHeader step={1} eyebrow="Target Species" title="What are you after?" />
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
          <SectionHeader step={2} eyebrow="Body of Water" title="Where are you fishing?" />
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
          <SectionHeader step={3} eyebrow="Water Clarity" title="How's the water today?" />
          <View style={styles.sectionCard}>
            <ClaritySelector
              selected={clarity}
              onSelect={setClarity}
              accentColor={accentColor}
            />
          </View>

          {/* CTA */}
          <View style={styles.ctaWrap}>
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
              Recommendations are based on your location's seasonal baseline, today's conditions, and water clarity.
            </Text>
          </View>
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
