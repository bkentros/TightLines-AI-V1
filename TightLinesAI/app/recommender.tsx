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
import { useEnvStore } from '../store/envStore';
import { useAuthStore } from '../store/authStore';
import { fetchRecommendation } from '../lib/recommender';
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

// ─── Setup sub-components ─────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

/** Horizontal scrolling chip row — used for Body of Water */
function ChipRow<T extends string>({
  options,
  selected,
  onSelect,
  labelFor,
  colorFor,
  iconFor,
}: {
  options: T[];
  selected: T | null;
  onSelect: (v: T) => void;
  labelFor: (v: T) => string;
  colorFor?: (v: T) => string;
  iconFor?: (v: T) => string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRowContent}
    >
      {options.map((opt) => {
        const isActive = selected === opt;
        const accent = colorFor ? colorFor(opt) : colors.primary;
        const icon = iconFor ? iconFor(opt) : null;
        return (
          <TouchableOpacity
            key={opt}
            style={[
              styles.chip,
              isActive
                ? { backgroundColor: accent, borderColor: accent }
                : { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            {icon && (
              <Ionicons
                name={icon as never}
                size={14}
                color={isActive ? '#fff' : colors.textSecondary}
              />
            )}
            <Text
              style={[
                styles.chipText,
                { color: isActive ? '#fff' : colors.textSecondary },
                isActive && { fontFamily: fonts.bodySemiBold },
              ]}
            >
              {labelFor(opt)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

/** Two-column grid of species selection cards */
function SpeciesGrid({
  options,
  selected,
  onSelect,
}: {
  options: SpeciesGroup[];
  selected: SpeciesGroup | null;
  onSelect: (s: SpeciesGroup) => void;
}) {
  // Pair items into rows of 2
  const rows: SpeciesGroup[][] = [];
  for (let i = 0; i < options.length; i += 2) {
    rows.push(options.slice(i, i + 2));
  }

  return (
    <View style={styles.speciesGrid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.speciesRow}>
          {row.map((sp) => {
            const isActive = selected === sp;
            return (
              <TouchableOpacity
                key={sp}
                style={[
                  styles.speciesCard,
                  shadows.sm,
                  isActive
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => onSelect(sp)}
                activeOpacity={0.75}
              >
                <View style={styles.speciesCardInner}>
                  {isActive ? (
                    <View style={styles.speciesCheckCircle}>
                      <Ionicons name="checkmark" size={11} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.speciesUncheckCircle} />
                  )}
                  <Text
                    style={[
                      styles.speciesCardText,
                      { color: isActive ? '#fff' : colors.text },
                      isActive && { fontFamily: fonts.bodySemiBold },
                    ]}
                    numberOfLines={2}
                  >
                    {SPECIES_DISPLAY[sp]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          {/* Spacer for odd last item */}
          {row.length === 1 && <View style={styles.speciesCardSpacer} />}
        </View>
      ))}
    </View>
  );
}

/** Three-column water clarity card selector */
function ClaritySelector({
  selected,
  onSelect,
  accentColor,
}: {
  selected: WaterClarity | null;
  onSelect: (c: WaterClarity) => void;
  accentColor: string;
}) {
  const options: { value: WaterClarity; icon: string; sub: string }[] = [
    { value: 'clear',   icon: 'eye-outline',          sub: 'Glass clear' },
    { value: 'stained', icon: 'water-outline',         sub: 'Tea / green tint' },
    { value: 'dirty',   icon: 'cloud-outline',         sub: '2 ft or less' },
  ];

  return (
    <View style={styles.clarityRow}>
      {options.map(({ value, icon, sub }) => {
        const isActive = selected === value;
        return (
          <TouchableOpacity
            key={value}
            style={[
              styles.clarityCard,
              isActive
                ? { borderColor: accentColor, backgroundColor: accentColor + '14' }
                : { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
            onPress={() => onSelect(value)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={icon as never}
              size={20}
              color={isActive ? accentColor : colors.textMuted}
            />
            <Text style={[styles.clarityCardTitle, { color: isActive ? accentColor : colors.text }]}>
              {WATER_CLARITY_LABELS[value]}
            </Text>
            <Text style={styles.clarityCardSub}>{sub}</Text>
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

  const envData = useEnvStore((s) => s.envData);
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
    availableSpecies.includes(species) &&
    availableContexts.includes(context);

  const handleFetch = useCallback(
    async (forceRefresh = false) => {
      if (!isReady || !species || !context || !clarity) return;
      if (!envData) {
        Alert.alert('No location data', 'Please wait for conditions to load on the home screen.');
        return;
      }

      setScreenState('loading');
      setErrorMsg(null);

      try {
        const state_code = await resolveStateCode(lat, lon);
        const res = await fetchRecommendation(
          {
            latitude: lat,
            longitude: lon,
            state_code,
            species,
            context,
            water_clarity: clarity,
            env_data: envData as unknown as Record<string, unknown>,
          },
          { forceRefresh },
        );
        setResult(res);
        setScreenState('result');
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.';
        if (msg === 'species_not_available') {
          setErrorMsg(
            `${SPECIES_DISPLAY[species]} isn't available in this region for ${contextLabel(context)}. Try a different species or context.`,
          );
        } else if (msg === 'unsupported_recommender_scope') {
          setErrorMsg(
            'This recommender currently supports freshwater largemouth, smallmouth, northern pike, and trout only.',
          );
        } else {
          setErrorMsg(msg);
        }
        setScreenState('error');
      }
    },
    [isReady, species, context, clarity, envData, lat, lon],
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
      <View style={styles.navHeader}>
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
          <Ionicons
            name={screenState === 'setup' ? 'chevron-back' : 'arrow-back-circle-outline'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          {screenState === 'result' && result
            ? SPECIES_DISPLAY[result.species]
            : 'What to Throw'}
        </Text>
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
          {/* Intro */}
          <View style={styles.setupIntro}>
            <Text style={styles.setupIntroText}>
              Freshwater-only V3 recommendations built around your state, today&apos;s conditions,
              and the exact species you&apos;re targeting.
            </Text>
            {/* Region detection */}
            {resolvingRegion ? (
              <View style={styles.regionRow}>
                <ActivityIndicator size="small" color={colors.textMuted} style={{ transform: [{ scale: 0.75 }] }} />
                <Text style={styles.regionText}>Detecting your region…</Text>
              </View>
            ) : stateCode ? (
              <View style={styles.regionRow}>
                <Ionicons name="location" size={12} color={colors.primaryLight} />
                <Text style={[styles.regionText, { color: colors.primaryLight }]}>
                  Showing species available in {stateCode}
                </Text>
              </View>
            ) : null}
          </View>

          {!hasCoords && (
            <View style={styles.warningBanner}>
              <Ionicons name="location-outline" size={15} color={colors.reportScoreYellow} />
              <Text style={styles.warningText}>
                Location unavailable — results may be less accurate.
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
            <ChipRow
              options={availableContexts}
              selected={context}
              onSelect={setContext}
              labelFor={contextLabel}
              colorFor={contextAccentColor}
              iconFor={contextIcon}
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
        </ScrollView>
      )}

      {/* ── Loading ── */}
      {screenState === 'loading' && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text style={styles.loadingText}>
            Analyzing conditions for{' '}
            {species ? SPECIES_DISPLAY[species] : 'your species'}…
          </Text>
        </View>
      )}

      {/* ── Error ── */}
      {screenState === 'error' && (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.reportScoreRed} />
          <Text style={styles.errorTitle}>Could not load recommendations</Text>
          <Text style={styles.errorMsg}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleReset}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
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
    paddingTop: spacing.md,
    paddingBottom: 48,
    gap: spacing.lg,
  },

  // Intro block
  setupIntro: {
    gap: 6,
  },
  setupIntroText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  regionText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },

  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.reportScoreYellowBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  warningText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.reportScoreYellow,
  },

  // Sections
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  // Species grid — 2 columns
  speciesGrid: {
    gap: spacing.sm,
  },
  speciesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  speciesCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
  },
  speciesCardSpacer: {
    flex: 1,
  },
  speciesCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speciesCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speciesUncheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  speciesCardText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
  },

  // Context chips
  chipRowContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  // Water clarity cards
  clarityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  clarityCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 5,
  },
  clarityCardTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  clarityCardSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Validation note
  validationNote: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.reportScoreYellow,
    lineHeight: 18,
  },

  // CTA
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 15,
    borderRadius: radius.md,
  },
  ctaBtnText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#fff',
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

  // Result
  resultView: {
    flex: 1,
  },
});
