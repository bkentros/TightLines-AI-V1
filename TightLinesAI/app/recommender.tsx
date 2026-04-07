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

import { useState, useEffect, useCallback } from 'react';
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
import { useAuthStore } from '../store/authStore';
import { fetchRecommendation } from '../lib/recommender';
import { fetchFreshEnvironment } from '../lib/env';
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

// ─── Setup sub-components ─────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

// ─── Species Card ─────────────────────────────────────────────────────────────

function SpeciesCard({
  sp,
  isActive,
  onSelect,
}: {
  sp: SpeciesGroup;
  isActive: boolean;
  onSelect: (s: SpeciesGroup) => void;
}) {
  const img = getSpeciesImage(sp);
  return (
    <TouchableOpacity
      style={[styles.speciesCard, isActive && styles.speciesCardActive]}
      onPress={() => onSelect(sp)}
      activeOpacity={0.85}
    >
      {img && (
        <Image source={img} style={styles.speciesImage} resizeMode="contain" />
      )}
      {/* Name strip overlaid at bottom */}
      <View style={styles.speciesNameStrip}>
        <Text style={styles.speciesCardText} numberOfLines={1}>
          {SPECIES_DISPLAY[sp]}
        </Text>
      </View>
      {/* Selection badge */}
      {isActive && (
        <View style={styles.speciesCheckBadge}>
          <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Species Grid ─────────────────────────────────────────────────────────────

function SpeciesGrid({
  options,
  selected,
  onSelect,
}: {
  options: SpeciesGroup[];
  selected: SpeciesGroup | null;
  onSelect: (s: SpeciesGroup) => void;
}) {
  // Single species → full-width card
  if (options.length === 1) {
    return (
      <View style={styles.speciesGrid}>
        <SpeciesCard sp={options[0]} isActive={selected === options[0]} onSelect={onSelect} />
      </View>
    );
  }

  const rows: SpeciesGroup[][] = [];
  for (let i = 0; i < options.length; i += 2) {
    rows.push(options.slice(i, i + 2));
  }

  return (
    <View style={styles.speciesGrid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.speciesRow}>
          {row.map((sp) => (
            <SpeciesCard key={sp} sp={sp} isActive={selected === sp} onSelect={onSelect} />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}

// ─── Context selector (Body of Water) ────────────────────────────────────────

function ContextSelector({
  options,
  selected,
  onSelect,
  accentColor,
}: {
  options: EngineContext[];
  selected: EngineContext | null;
  onSelect: (v: EngineContext) => void;
  accentColor: string;
}) {
  return (
    <View style={styles.contextRow}>
      {options.map((opt) => {
        const isActive = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.contextCard,
              isActive
                ? { backgroundColor: accentColor, borderColor: accentColor }
                : { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={contextIcon(opt) as never}
              size={17}
              color={isActive ? '#fff' : colors.textMuted}
            />
            <Text
              style={[
                styles.contextCardText,
                { color: isActive ? '#fff' : colors.text },
                isActive && { fontFamily: fonts.bodySemiBold },
              ]}
            >
              {contextLabel(opt)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Clarity selector ─────────────────────────────────────────────────────────

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
        return (
          <TouchableOpacity
            key={value}
            style={[
              styles.clarityCard,
              isActive
                ? { borderColor: accentColor, backgroundColor: accentColor + '12' }
                : { borderColor: colors.borderLight, backgroundColor: colors.surface },
            ]}
            onPress={() => onSelect(value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.clarityCardTitle, { color: isActive ? accentColor : colors.text }]}>
              {label}
            </Text>
            <Text style={[styles.clarityCardSub, isActive && { color: accentColor + 'AA' }]}>
              {sub}
            </Text>
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

  // Derived chip options — always state-aware
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

        {(screenState === 'loading' || screenState === 'error') && (
          <Text style={styles.navTitle}>What to Throw</Text>
        )}
        {screenState === 'result' && <View style={{ flex: 1 }} />}

        {/* Region pill — only in setup, right side */}
        {screenState === 'setup' && (
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
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

      {/* ── Setup form ── */}
      {screenState === 'setup' && (
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

          {/* Species */}
          <View style={styles.section}>
            <SectionLabel label="Target Species" />
            <SpeciesGrid
              options={availableSpecies}
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

          {/* Body of Water */}
          <View style={styles.section}>
            <SectionLabel label="Body of Water" />
            <ContextSelector
              options={availableContexts}
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

          {/* Water Clarity */}
          <View style={styles.section}>
            <SectionLabel label="Water Clarity" />
            <ClaritySelector
              selected={clarity}
              onSelect={setClarity}
              accentColor={accentColor}
            />
          </View>

          {/* Inline hint above CTA */}
          {!!setupHint && !isReady && (
            <Text style={styles.setupHint}>{setupHint}</Text>
          )}

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
            Freshwater-only · built around your location and today&apos;s conditions
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
    fontSize: 18,
    color: colors.text,
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
    paddingBottom: 56,
    gap: 28,
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
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.reportScoreYellow,
  },

  // Sections
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.text,
    letterSpacing: -0.2,
  },

  // Species grid
  speciesGrid: {
    gap: spacing.sm,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  speciesCard: {
    flex: 1,
    height: 165,
    borderRadius: radius.lg,
    backgroundColor: '#1C2B1E',
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  speciesCardActive: {
    borderColor: colors.primary,
  },
  speciesImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  speciesNameStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  speciesCardText: {
    fontFamily: fonts.serifBold,
    fontSize: 14,
    color: '#fff',
    letterSpacing: 0.1,
  },
  speciesCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 99,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Body of Water — context selector
  contextRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contextCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  contextCardText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },

  // Water clarity
  clarityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  clarityCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 5,
  },
  clarityCardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
  clarityCardSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  clarityCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
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
    marginTop: -8,
  },

  // CTA
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 17,
    borderRadius: radius.lg,
  },
  ctaBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#fff',
  },
  setupDisclaimer: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -8,
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
    borderRadius: radius.md,
  },
  retryBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: '#fff',
  },
  secondaryBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
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
