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
 *   2. Tap "Get Recommendations" → loading state
 *   3. RecommenderView with results
 *   4. Pull-to-refresh for fresh results
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
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
import { Asset } from 'expo-asset';
import { useAuthStore } from '../store/authStore';
import { fetchRecommendation } from '../lib/recommender';
import { fetchFreshEnvironment, getEnvironment } from '../lib/env';
import type { EnvironmentData } from '../lib/env';
import { RecommenderView } from '../components/fishing/RecommenderView';
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

// ─── Static preload list — rendered off-screen so images are decoded before page shows ──
const ALL_PRELOAD_IMAGES: ReturnType<typeof require>[] = [
  ...RECOMMENDER_V3_UI_SPECIES
    .map((sp) => getSpeciesImage(sp))
    .filter((img): img is ReturnType<typeof require> => img !== null),
  ...ALL_WATERTYPE_IMAGES,
  ...ALL_WATERCLARITY_IMAGES,
  ...ALL_COLOR_PALETTE_IMAGES,
  ...ALL_LURE_IMAGES,
];

// ─── Context helpers ──────────────────────────────────────────────────────────

const ENGINE_CONTEXTS: EngineContext[] = [
  ...RECOMMENDER_V3_UI_CONTEXTS,
];

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':  return 'Lake / Pond';
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
    case 'freshwater_river':      return colors.contextRiver;
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
  return 'When you run or refresh this, we pull a fresh live conditions snapshot first.';
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

// ─── Mini Conditions Card (≈60% of LiveConditionsWidget) ─────────────────────

function MiniConditionsCard({
  stateCode,
  loading,
  env,
}: {
  stateCode: string | null;
  loading: boolean;
  env: EnvironmentData | null;
}) {
  const season = getCurrentSeason();
  const stateName = stateCode ? (STATE_CODE_TO_NAME[stateCode] ?? stateCode) : null;
  if (!stateName && !loading) return null;

  const w = env?.weather;
  const moon = env?.moon;

  // Air temp tile — prefer today's high/low, fall back to current temp
  let tempValue = '—';
  let tempLabel = 'Temp';
  if (w) {
    const hi = w.temp_7day_high && w.temp_7day_high.length > 14 ? w.temp_7day_high[14] : null;
    const lo = w.temp_7day_low  && w.temp_7day_low.length  > 14 ? w.temp_7day_low[14]  : null;
    if (hi != null && lo != null && Number.isFinite(hi) && Number.isFinite(lo)) {
      tempValue = `${Math.round(lo)}–${Math.round(hi)}${w.temp_unit}`;
      tempLabel = 'Air today';
    } else {
      tempValue = `${Math.round(w.temperature)}${w.temp_unit}`;
    }
  }

  const skyValue      = w ? cloudCoverLabel(w.cloud_cover) : '—';
  const windValue     = w ? `${windDirectionLabel16(w.wind_direction)} ${Math.round(w.wind_speed)}` : '—';
  const pressureValue = w ? String(w.pressure) : '—';
  const pTrend        = w?.pressure_trend ? pressureTrendInfo(w.pressure_trend) : null;
  const moonLabel     = moon ? moonPhaseLabel(moon.phase, moon.illumination) : null;
  const humidLabel    = w?.humidity != null ? `${Math.round(w.humidity)}%` : null;

  const fetchedAt = env?.fetched_at ? new Date(env.fetched_at).getTime() : 0;
  const ageMs     = fetchedAt ? Math.max(0, Date.now() - fetchedAt) : 0;
  const ageLabel  = fetchedAt ? `${Math.floor(ageMs / 60000)}m ago` : null;

  return (
    <View style={styles.miniCondCard}>
      {/* Header row */}
      <View style={styles.miniCondHeader}>
        <View style={styles.miniCondHeaderLeft}>
          <View style={styles.miniCondDot} />
          <View>
            <Text style={styles.miniCondLabel}>Live Conditions</Text>
            <Text style={styles.miniCondLocation}>{stateName ?? '—'}  ·  {season}</Text>
          </View>
        </View>
        <View style={styles.miniCondHeaderRight}>
          {ageLabel && !loading && (
            <Text style={styles.miniCondAge}>{ageLabel}</Text>
          )}
          {loading && (
            <ActivityIndicator size="small" color={colors.primary} style={{ transform: [{ scale: 0.6 }] }} />
          )}
        </View>
      </View>

      {/* Metric grid */}
      {w ? (
        <>
          <View style={styles.miniCondGrid}>
            <View style={styles.miniCondTile}>
              <Ionicons name="thermometer-outline" size={10} color={colors.primary} />
              <Text style={styles.miniCondValue} numberOfLines={1}>{tempValue}</Text>
              <Text style={styles.miniCondTileLabel}>{tempLabel}</Text>
            </View>
            <View style={styles.miniCondTile}>
              <Ionicons name="cloud-outline" size={10} color={colors.primary} />
              <Text style={styles.miniCondValue} numberOfLines={1}>{skyValue}</Text>
              <Text style={styles.miniCondTileLabel}>Sky</Text>
            </View>
            <View style={styles.miniCondTile}>
              <Ionicons name="flag-outline" size={10} color={colors.primary} />
              <Text style={styles.miniCondValue} numberOfLines={1}>{windValue}</Text>
              <Text style={styles.miniCondTileLabel}>{w.wind_speed_unit}</Text>
            </View>
            <View style={styles.miniCondTile}>
              <Ionicons name="speedometer-outline" size={10} color={colors.primary} />
              <Text style={styles.miniCondValue} numberOfLines={1}>{pressureValue}</Text>
              {pTrend ? (
                <Text style={[styles.miniCondTileLabel, { color: pTrend.color }]} numberOfLines={1}>
                  {pTrend.label}
                </Text>
              ) : (
                <Text style={styles.miniCondTileLabel}>Press.</Text>
              )}
            </View>
          </View>

          {/* Footer pills */}
          {(moonLabel || humidLabel) && (
            <View style={styles.miniCondFooter}>
              {moonLabel && (
                <View style={styles.miniCondPill}>
                  <Ionicons name="moon-outline" size={8} color={colors.textSecondary} />
                  <Text style={styles.miniCondPillText}>{moonLabel}</Text>
                </View>
              )}
              {humidLabel && (
                <View style={styles.miniCondPill}>
                  <Ionicons name="water-outline" size={8} color={colors.textSecondary} />
                  <Text style={styles.miniCondPillText}>{humidLabel}</Text>
                </View>
              )}
            </View>
          )}
        </>
      ) : loading ? (
        <View style={styles.miniCondLoading}>
          <Text style={styles.miniCondLoadingText}>Pulling live conditions…</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Setup sub-components ─────────────────────────────────────────────────────

function SectionLabel({ label, step }: { label: string; step: number }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionStep}>{`0${step}`}</Text>
      <View style={styles.sectionLabelDivider} />
      <Text style={styles.sectionLabel}>{label.toUpperCase()}</Text>
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
    <TouchableOpacity
      style={[styles.speciesCard, isActive && styles.speciesCardActive]}
      onPress={() => { if (!isDisabled) onSelect(sp); }}
      activeOpacity={isDisabled ? 1 : 0.88}
    >
      {/* Explicit pixel height — the only reliable way in RN to get
          width:'100%' / height:'100%' on the Image to scale against. */}
      <View style={[styles.speciesFishArea, { height: fishAreaHeight }]}>
        {img && (
          <Image source={img} style={styles.speciesImage} resizeMode="contain" />
        )}
      </View>
      <View style={styles.speciesNameFooter}>
        <Text style={styles.speciesCardText} numberOfLines={1}>
          {SPECIES_DISPLAY[sp]}
        </Text>
      </View>
      {isActive && (
        <View style={styles.speciesCheckBadge}>
          <Ionicons name="checkmark" size={13} color="#fff" />
        </View>
      )}
      {/* Grey hue overlay when this species is incompatible with selected water type */}
      {isDisabled && <View style={styles.cardDisabledOverlay} pointerEvents="none" />}
    </TouchableOpacity>
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
          <TouchableOpacity
            key={opt}
            style={[styles.contextCard, isActive && { borderColor: accentColor, borderWidth: 2 }]}
            onPress={() => { if (!isDisabled) onSelect(opt); }}
            activeOpacity={isDisabled ? 1 : 0.88}
          >
            {/* Image area — aspectRatio matches the 3:2 source images exactly */}
            <View style={styles.contextImageArea}>
              {img && (
                <Image
                  source={img}
                  style={styles.contextCardImage}
                  resizeMode="contain"
                />
              )}
            </View>
            {/* Name footer — same pattern as fish cards */}
            <View style={styles.contextNameFooter}>
              <Text style={[styles.contextCardText, isActive && { color: accentColor, fontFamily: fonts.bodySemiBold }]}>
                {contextLabel(opt)}
              </Text>
            </View>
            {/* Selection badge */}
            {isActive && (
              <View style={[styles.contextCheckBadge, { backgroundColor: accentColor }]}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
            {/* Grey hue when incompatible with selected species */}
            {isDisabled && <View style={styles.cardDisabledOverlay} pointerEvents="none" />}
          </TouchableOpacity>
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
    { value: 'clear',   label: 'Clear',   sub: 'Glass clear' },
    { value: 'stained', label: 'Stained', sub: 'Tea / green tint' },
    { value: 'dirty',   label: 'Murky',   sub: '2 ft or less' },
  ];

  return (
    <View style={styles.clarityRow}>
      {options.map(({ value, label, sub }) => {
        const isActive = selected === value;
        const img = getWaterclarityImage(value);
        return (
          <TouchableOpacity
            key={value}
            style={[styles.clarityCard, isActive && { borderColor: accentColor, borderWidth: 2 }]}
            onPress={() => onSelect(value)}
            activeOpacity={0.88}
          >
            {/* Underwater scene image */}
            <View style={styles.clarityImageArea}>
              <Image
                source={img}
                style={styles.clarityCardImage}
                resizeMode="cover"
              />
            </View>
            {/* Name + sub footer */}
            <View style={styles.clarityNameFooter}>
              <Text style={[styles.clarityCardTitle, { color: isActive ? accentColor : colors.text }]}>
                {label}
              </Text>
              <Text style={[styles.clarityCardSub, isActive && { color: accentColor + 'BB' }]}>
                {sub}
              </Text>
            </View>
            {isActive && (
              <View style={[styles.clarityCheck, { backgroundColor: accentColor }]}>
                <Ionicons name="checkmark" size={9} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
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

  // Live conditions for the setup card — uses 15-min cache so it's fast and cheap
  const [liveConditions, setLiveConditions] = useState<EnvironmentData | null>(null);
  const [conditionsLoading, setConditionsLoading] = useState(false);

  useEffect(() => {
    if (!hasCoords) return;
    setConditionsLoading(true);
    const units = profile?.preferred_units ?? 'imperial';
    getEnvironment({ latitude: lat, longitude: lon, units })
      .then((data) => setLiveConditions(data))
      .catch(() => { /* silently fail — card just shows location + season */ })
      .finally(() => setConditionsLoading(false));
  }, [hasCoords, lat, lon, profile?.preferred_units]);

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
        const units = profile?.preferred_units ?? 'imperial';
        const liveEnvData = await fetchFreshEnvironment({
          latitude: lat,
          longitude: lon,
          units,
        });
        const res = await fetchRecommendation(
          {
            latitude: lat,
            longitude: lon,
            state_code,
            species,
            context,
            water_clarity: clarity,
            env_data: liveEnvData as unknown as Record<string, unknown>,
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
    [isReady, species, context, clarity, lat, lon, profile?.preferred_units, result, screenState],
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
          <Image
            key={i}
            source={img}
            style={styles.preloadImage}
            onLoad={handlePreloadImage}
            onError={handlePreloadImage}
          />
        ))}
      </View>

      {/* Nav header */}
      <View style={[styles.navHeader, screenState === 'setup' && styles.navHeaderBorderless]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (screenState === 'result' || screenState === 'error') {
              handleReset();
            } else {
              router.back();
            }
          }}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {screenState !== 'result' && (
          <Text style={styles.navTitle}>
            {screenState === 'setup' ? 'Lure & Fly Recommender' : 'What to Throw'}
          </Text>
        )}
        {screenState === 'result' && <View style={{ flex: 1 }} />}

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
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset} hitSlop={12}>
            <Ionicons name="options-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
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
          {/* Location warning — only when no coords */}
          {!hasCoords && (
            <View style={styles.warningBanner}>
              <Ionicons name="location-outline" size={14} color={colors.reportScoreYellow} />
              <Text style={styles.warningText}>
                Location needed to pull today&apos;s conditions.
              </Text>
            </View>
          )}

          {/* Mini live conditions card */}
          <MiniConditionsCard
            stateCode={stateCode}
            loading={conditionsLoading}
            env={liveConditions}
          />

          {/* 01 — Target Species */}
          <View style={styles.sectionCard}>
            <SectionLabel label="Target Species" step={1} />
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
          <View style={styles.sectionCard}>
            <SectionLabel label="Body of Water" step={2} />
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
          <View style={styles.sectionCard}>
            <SectionLabel label="Water Clarity" step={3} />
            <ClaritySelector
              selected={clarity}
              onSelect={setClarity}
              accentColor={accentColor}
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              { backgroundColor: isReady ? accentColor : colors.disabled },
              isReady && shadows.md,
            ]}
            disabled={!isReady}
            onPress={() => handleFetch(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Get Recommendations</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.setupDisclaimer}>
            Lure and fly recommendations are based around your location&apos;s seasonal characteristics, influence from daily conditions, and water clarity.
          </Text>
        </ScrollView>
      )}

      {/* ── Loading ── */}
      {screenState === 'loading' && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text style={styles.loadingText}>
            Determining lures and flies for your current conditions…
          </Text>
        </View>
      )}

      {/* ── Error ── */}
      {screenState === 'error' && (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.reportScoreRed} />
          <Text style={styles.errorTitle}>Could not build your plan</Text>
          <Text style={styles.errorMsg}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => handleFetch(true)}>
            <Text style={styles.retryBtnText}>Refresh and Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleReset}>
            <Text style={styles.secondaryBtnText}>Back to Setup</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Result ── */}
      {screenState === 'result' && result && (
        <RecommenderView
          result={result}
          style={styles.resultView}
          isRefreshing={isRefreshing}
          onRefresh={() => {
            void handleFetch(true);
          }}
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
    gap: 14,
    borderWidth: 1.5,
    borderColor: colors.primaryMistDark,
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  // Mini conditions card — 60% scale of LiveConditionsWidget
  miniCondCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  miniCondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniCondHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniCondHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  miniCondDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  miniCondLabel: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  miniCondLocation: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  miniCondAge: {
    fontSize: 9,
    color: colors.textMuted,
  },
  miniCondGrid: {
    flexDirection: 'row',
    gap: 5,
  },
  miniCondTile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingVertical: 8,
    gap: 2,
  },
  miniCondValue: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.text,
  },
  miniCondTileLabel: {
    fontSize: 8,
    color: colors.textMuted,
    letterSpacing: 0.2,
    textAlign: 'center' as const,
  },
  miniCondFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: 5,
  },
  miniCondPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  miniCondPillText: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  miniCondLoading: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  miniCondLoadingText: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // Sections
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionStep: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  sectionLabelDivider: {
    width: 1.5,
    height: 13,
    backgroundColor: colors.primaryMistDark,
  },
  sectionLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.primaryDark,
    letterSpacing: 1.4,
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
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingSubtext: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
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
