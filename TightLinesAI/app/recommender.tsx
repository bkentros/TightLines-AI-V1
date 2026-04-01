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
  RefreshControl,
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
  SPECIES_GROUPS,
  SPECIES_WATER_TYPE,
  WATER_CLARITY_LABELS,
  getSpeciesForState,
  getContextsForState,
  getContextsForStateSpecies,
} from '../lib/recommenderContracts';

// ─── Context helpers ──────────────────────────────────────────────────────────

const ENGINE_CONTEXTS: EngineContext[] = [
  'freshwater_lake_pond',
  'freshwater_river',
  'coastal',
  'coastal_flats_estuary',
];

function contextLabel(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':  return 'Lake / Pond';
    case 'freshwater_river':      return 'River';
    case 'coastal':               return 'Coastal Inshore';
    case 'coastal_flats_estuary': return 'Flats & Estuary';
  }
}

function contextAccentColor(ctx: EngineContext): string {
  switch (ctx) {
    case 'freshwater_lake_pond':  return colors.contextFreshwater;
    case 'freshwater_river':      return colors.contextRiver;
    case 'coastal':               return colors.contextCoastal;
    case 'coastal_flats_estuary': return colors.contextFlatsEstuary;
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
    // isoCountryCode + region covers US states directly
    const region = geo.region ?? '';
    // If it's already a 2-letter code
    if (region.length === 2 && /^[A-Z]{2}$/.test(region)) return region;
    // Try mapping from full name
    return STATE_NAME_TO_CODE[region] ?? 'XX';
  } catch {
    return 'XX';
  }
}

// ─── Setup form ───────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function ChipRow<T extends string>({
  options,
  selected,
  onSelect,
  labelFor,
  colorFor,
}: {
  options: T[];
  selected: T | null;
  onSelect: (v: T) => void;
  labelFor: (v: T) => string;
  colorFor?: (v: T) => string;
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

function SpeciesGrid({
  options,
  selected,
  onSelect,
}: {
  options: SpeciesGroup[];
  selected: SpeciesGroup | null;
  onSelect: (s: SpeciesGroup) => void;
}) {
  return (
    <View style={styles.speciesGrid}>
      {options.map((sp) => {
        const isActive = selected === sp;
        return (
          <TouchableOpacity
            key={sp}
            style={[
              styles.speciesChip,
              isActive
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => onSelect(sp)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.speciesChipText,
                { color: isActive ? '#fff' : colors.text },
                isActive && { fontFamily: fonts.bodySemiBold },
              ]}
            >
              {SPECIES_DISPLAY[sp]}
            </Text>
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

  const [species, setSpecies] = useState<SpeciesGroup | null>(
    (params.species as SpeciesGroup) ?? null,
  );
  const [context, setContext] = useState<EngineContext | null>(
    (params.context as EngineContext) ?? null,
  );
  const [clarity, setClarity] = useState<WaterClarity | null>(null);

  // Resolved state code — drives chip filtering
  const [stateCode, setStateCode] = useState<string | null>(null);
  const [resolvingRegion, setResolvingRegion] = useState(false);

  const [screenState, setScreenState] = useState<ScreenState>('setup');
  const [result, setResult] = useState<RecommenderResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Resolve state code as soon as we have coords — don't wait for the fetch
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
    const validSpecies = getSpeciesForState(stateCode);
    if (species && !validSpecies.includes(species)) {
      setSpecies(null);
      setContext(null);
      return;
    }
    if (species && context) {
      const validCtxs = getContextsForStateSpecies(stateCode, species);
      if (!validCtxs.includes(context)) setContext(null);
    }
  }, [stateCode]);

  // Derived chip options — always state-aware
  const availableSpecies: SpeciesGroup[] = stateCode
    ? getSpeciesForState(stateCode)
    : SPECIES_GROUPS;

  const availableContexts: EngineContext[] = stateCode && species
    ? getContextsForStateSpecies(stateCode, species)
    : stateCode
      ? getContextsForState(stateCode)
      : ENGINE_CONTEXTS;

  // Validation
  const isReady =
    species !== null &&
    context !== null &&
    clarity !== null &&
    hasCoords &&
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
        } else {
          setErrorMsg(msg);
        }
        setScreenState('error');
      }
    },
    [isReady, species, context, clarity, envData, lat, lon],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await handleFetch(true);
    setIsRefreshing(false);
  }, [handleFetch]);

  const handleReset = useCallback(() => {
    setScreenState('setup');
    setResult(null);
    setErrorMsg(null);
  }, []);

  // ── Header ──────────────────────────────────────────────────────────────────

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
            ? `${SPECIES_DISPLAY[result.species]}`
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
          {!hasCoords && (
            <View style={styles.warningBanner}>
              <Ionicons name="location-outline" size={16} color={colors.reportScoreYellow} />
              <Text style={styles.warningText}>
                Location unavailable. Results may be less accurate.
              </Text>
            </View>
          )}

          {/* Region detection indicator */}
          {resolvingRegion && (
            <View style={styles.regionBanner}>
              <ActivityIndicator size="small" color={colors.textMuted} />
              <Text style={styles.regionBannerText}>Detecting your region…</Text>
            </View>
          )}
          {!resolvingRegion && stateCode && (
            <View style={styles.regionBanner}>
              <Ionicons name="location" size={14} color={colors.textMuted} />
              <Text style={styles.regionBannerText}>
                Showing species available in {stateCode}
              </Text>
            </View>
          )}

          {/* Species */}
          <SectionLabel label="Target Species" />
          <SpeciesGrid
            options={availableSpecies}
            selected={species}
            onSelect={(sp) => {
              setSpecies(sp);
              // If current context isn't valid for this species in this state, clear it
              if (context && stateCode) {
                const validCtxs = getContextsForStateSpecies(stateCode, sp);
                if (!validCtxs.includes(context)) setContext(null);
              } else if (context) {
                // Fallback to water-type check when state unknown
                const wt = SPECIES_WATER_TYPE[sp];
                const isCoastal = context === 'coastal' || context === 'coastal_flats_estuary';
                if ((wt === 'saltwater' && !isCoastal) || (wt === 'freshwater' && isCoastal)) {
                  setContext(null);
                }
              }
            }}
          />

          {/* Context */}
          <SectionLabel label="Body of Water" />
          <ChipRow
            options={availableContexts}
            selected={context}
            onSelect={setContext}
            labelFor={contextLabel}
            colorFor={contextAccentColor}
          />

          {/* Water clarity */}
          <SectionLabel label="Water Clarity" />
          <View style={styles.clarityRow}>
            {(['clear', 'stained', 'dirty'] as WaterClarity[]).map((c) => {
              const isActive = clarity === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.clarityChip,
                    isActive
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                  onPress={() => setClarity(c)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.clarityChipText,
                      { color: isActive ? '#fff' : colors.textSecondary },
                      isActive && { fontFamily: fonts.bodySemiBold },
                    ]}
                  >
                    {WATER_CLARITY_LABELS[c]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* If context chip area is empty (no valid contexts for selection), show a note */}
          {availableContexts.length === 0 && species && (
            <Text style={styles.validationNote}>
              No water types available for {SPECIES_DISPLAY[species]} in this region.
            </Text>
          )}

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              { backgroundColor: isReady ? accentColor : colors.disabled },
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
    paddingBottom: spacing.xxl,
    gap: spacing.md,
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
  sectionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: -spacing.xs,
  },

  // Species grid
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  speciesChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  speciesChipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  // Context chips
  chipRowContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  // Water clarity
  clarityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  clarityChip: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  clarityChipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  // Region banner
  regionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  regionBannerText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },

  // Validation
  validationNote: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.reportScoreYellow,
    textAlign: 'center',
    lineHeight: 18,
  },

  // CTA
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xs,
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
