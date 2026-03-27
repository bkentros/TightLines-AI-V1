import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Select from '../components/Select';
import { SubscribePrompt } from '../components/SubscribePrompt';
import { colors, fonts, radius, shadows, spacing } from '../lib/theme';
import { fetchFreshEnvironment, getEnvironment } from '../lib/env';
import type { EnvironmentData } from '../lib/env/types';
import { getValidAccessToken, invokeEdgeFunction } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { isCoastalContextEligible } from '../lib/coastalProximity';
import type { EngineContextKey } from '../lib/howFishingRebuildContracts';
import {
  RECOMMENDER_HABITAT_OPTIONS,
  RECOMMENDER_FEATURE,
  type RecommenderGearMode,
  type RecommenderResponse,
  type RecommenderRefinements,
  type WaterClarity,
  type VegetationDensity,
} from '../lib/recommenderContracts';
import {
  getCachedRecommendation,
  setCachedRecommendation,
  setCurrentRecommendation,
} from '../lib/recommender';

const TAB_CONFIG: { key: EngineContextKey; label: string; icon: string; color: string }[] = [
  { key: 'freshwater_lake_pond', label: 'Lake / Pond', icon: 'water', color: colors.contextFreshwater },
  { key: 'freshwater_river', label: 'River', icon: 'git-merge-outline', color: colors.contextRiver },
  { key: 'coastal', label: 'Inshore', icon: 'boat-outline', color: colors.contextCoastal },
  {
    key: 'coastal_flats_estuary',
    label: 'Flats / Est',
    icon: 'resize-outline',
    color: colors.contextFlatsEstuary,
  },
];

const CLARITY_OPTIONS: Array<{ label: string; value: WaterClarity }> = [
  { label: 'Clear', value: 'clear' },
  { label: 'Stained', value: 'stained' },
  { label: 'Dirty', value: 'dirty' },
];

const VEGETATION_OPTIONS: Array<{ label: string; value: VegetationDensity }> = [
  { label: 'None', value: 'none' },
  { label: 'Sparse', value: 'sparse' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Heavy', value: 'heavy' },
];

const PLATFORM_OPTIONS = [
  { label: 'Bank', value: 'bank' as const },
  { label: 'Boat / Kayak', value: 'boat_kayak' as const },
];

function geocodeToDisplayLabel(g: Location.LocationGeocodedAddress): string | null {
  const city = g.city ?? g.subregion ?? g.district ?? g.name ?? undefined;
  const region = g.region ?? '';
  if (city && region) return `${city}, ${region}`;
  if (city) return city;
  if (region) return region;
  if (g.subregion) return g.subregion;
  return null;
}

function toTitle(text: string): string {
  return text
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function depthLaneLabel(id: string): string {
  switch (id) {
    case 'very_shallow':
      return 'Very shallow';
    case 'mid_depth':
      return 'Mid-depth';
    case 'upper_column':
      return 'Upper column';
    case 'lower_column':
      return 'Lower column';
    case 'bottom_oriented':
      return 'Bottom-oriented';
    default:
      return toTitle(id);
  }
}

function defaultGearMode(profileMode?: string | null): RecommenderGearMode {
  if (profileMode === 'fly') return 'fly';
  return 'lure';
}

export default function RecommenderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lat?: string; lon?: string }>();
  const lat = params.lat != null ? parseFloat(params.lat) : NaN;
  const lon = params.lon != null ? parseFloat(params.lon) : NaN;
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lon);
  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [locationLabel, setLocationLabel] = useState<string>('Current location');
  const [activeContext, setActiveContext] = useState<EngineContextKey>('freshwater_lake_pond');
  const [gearMode, setGearMode] = useState<RecommenderGearMode>(defaultGearMode(profile?.fishing_mode));
  const [result, setResult] = useState<RecommenderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);

  const [waterClarity, setWaterClarity] = useState<WaterClarity | null>(null);
  const [vegetation, setVegetation] = useState<VegetationDensity | null>(null);
  const [platform, setPlatform] = useState<'bank' | 'boat_kayak' | null>(null);
  const [habitatTags, setHabitatTags] = useState<string[]>([]);

  const coastalEligible = useMemo(() => isCoastalContextEligible(lat, lon), [lat, lon]);
  const availableContexts = useMemo<EngineContextKey[]>(
    () =>
      coastalEligible
        ? ['freshwater_lake_pond', 'freshwater_river', 'coastal', 'coastal_flats_estuary']
        : ['freshwater_lake_pond', 'freshwater_river'],
    [coastalEligible],
  );
  const availableTabs = useMemo(
    () => TAB_CONFIG.filter((tab) => availableContexts.includes(tab.key)),
    [availableContexts],
  );
  const activeTabConfig = availableTabs.find((tab) => tab.key === activeContext) ?? availableTabs[0]!;

  useEffect(() => {
    setGearMode(defaultGearMode(profile?.fishing_mode));
  }, [profile?.fishing_mode]);

  useEffect(() => {
    setActiveContext((current) => (availableContexts.includes(current) ? current : availableContexts[0]!));
  }, [availableContexts]);

  useEffect(() => {
    setHabitatTags((current) =>
      current.filter((tag) =>
        RECOMMENDER_HABITAT_OPTIONS[activeContext].some((option) => option.id === tag),
      ),
    );
  }, [activeContext]);

  useEffect(() => {
    if (!hasCoords) return;
    let cancelled = false;
    (async () => {
      setEnvLoading(true);
      try {
        const [cachedEnv, geo] = await Promise.all([
          getEnvironment({ latitude: lat, longitude: lon, units }),
          Location.reverseGeocodeAsync({ latitude: lat, longitude: lon }).catch(() => []),
        ]);
        if (cancelled) return;
        setEnv(cachedEnv);
        if (geo?.[0]) {
          setLocationLabel(geocodeToDisplayLabel(geo[0]) ?? 'Current location');
        }
      } catch {
        if (!cancelled) setError('Unable to load live conditions for this location.');
      } finally {
        if (!cancelled) setEnvLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasCoords, lat, lon, units]);

  const refinements = useMemo<RecommenderRefinements>(
    () => ({
      ...(waterClarity ? { water_clarity: waterClarity } : {}),
      ...(vegetation ? { vegetation } : {}),
      ...(platform ? { platform } : {}),
      ...(habitatTags.length > 0 ? { habitat_tags: habitatTags as RecommenderRefinements['habitat_tags'] } : {}),
    }),
    [waterClarity, vegetation, platform, habitatTags],
  );

  const hasActiveRefinements = Boolean(
    refinements.water_clarity ||
      refinements.vegetation ||
      refinements.platform ||
      (refinements.habitat_tags?.length ?? 0) > 0,
  );

  useEffect(() => {
    if (!hasCoords || envLoading || hasActiveRefinements) {
      if (hasActiveRefinements) setResult(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const cached = await getCachedRecommendation(lat, lon, activeContext);
      if (cancelled) return;
      setResult(cached);
      setError(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [hasCoords, envLoading, hasActiveRefinements, activeContext, lat, lon]);

  const generateRecommendation = useCallback(async () => {
    if (!hasCoords) return;
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getValidAccessToken();
      const freshEnv = await fetchFreshEnvironment({ latitude: lat, longitude: lon, units });
      setEnv(freshEnv);

      const response = await invokeEdgeFunction<RecommenderResponse>('recommender', {
        accessToken,
        body: {
          latitude: lat,
          longitude: lon,
          context: activeContext,
          env_data: freshEnv,
          refinements,
        },
      });

      if (!response || response.feature !== RECOMMENDER_FEATURE) {
        throw new Error('Invalid response from recommender service.');
      }

      setResult(response);
      setCurrentRecommendation(lat, lon, activeContext, response);
      if (!hasActiveRefinements) {
        await setCachedRecommendation(lat, lon, activeContext, response);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate recommendations.';
      setError(message);
      if (message.toLowerCase().includes('subscribe')) {
        setShowSubscribePrompt(true);
      } else {
        Alert.alert('Recommendation unavailable', message);
      }
    } finally {
      setLoading(false);
    }
  }, [hasCoords, lat, lon, units, activeContext, refinements, hasActiveRefinements]);

  const visibleFamilies = gearMode === 'lure' ? result?.lure_rankings ?? [] : result?.fly_rankings ?? [];
  const topArchetype = result?.presentation_archetypes[0] ?? null;

  if (!hasCoords) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centeredCard}>
          <View style={styles.centerIconWrap}>
            <Ionicons name="location-outline" size={30} color={colors.primary} />
          </View>
          <Text style={styles.messageTitle}>Location Required</Text>
          <Text style={styles.messageBody}>
            The recommender needs your location so it can use the same live environmental data flow as How&apos;s Fishing.
          </Text>
          <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]} onPress={() => router.back()}>
            <Text style={styles.primaryBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable style={styles.topBarIconBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.heading}>Recommender</Text>
        <Pressable
          style={({ pressed }) => [styles.refreshBtn, pressed && { opacity: 0.7 }]}
          onPress={generateRecommendation}
          disabled={loading || envLoading}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
          <Text style={styles.refreshBtnText}>Refresh</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metaCard}>
          <View style={styles.metaHeaderRow}>
            <View>
              <Text style={styles.metaTitle}>Fish Position + Presentation Recommender</Text>
              <Text style={styles.metaSubtitle}>{locationLabel}</Text>
            </View>
            {envLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <View style={styles.liveChip}>
                <Ionicons name="pulse" size={12} color={colors.primary} />
                <Text style={styles.liveChipText}>Live Conditions</Text>
              </View>
            )}
          </View>
          <Text style={styles.metaBody}>
            Month-by-month regional baseline logic first, daily modifiers second, and family recommendations only after the engine resolves presentation needs.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBarScroll}
          contentContainerStyle={styles.tabBarScrollContent}
        >
          {availableTabs.map((tab) => {
            const active = tab.key === activeContext;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tab, active && styles.tabActive, active && { borderBottomColor: tab.color }]}
                onPress={() => setActiveContext(tab.key)}
              >
                <Ionicons name={tab.icon as any} size={16} color={active ? tab.color : colors.textMuted} />
                <Text style={[styles.tabLabel, active && { color: tab.color, fontWeight: '700' }]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Refine The Recommendation</Text>
            <Text style={styles.sectionHint}>Optional</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Water Clarity</Text>
              <Select
                value={waterClarity ? CLARITY_OPTIONS.find((option) => option.value === waterClarity)?.label ?? null : null}
                options={CLARITY_OPTIONS.map((option) => option.label)}
                placeholder="Select clarity"
                onSelect={(value) =>
                  setWaterClarity(CLARITY_OPTIONS.find((option) => option.label === value)?.value ?? null)
                }
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Vegetation</Text>
              <Select
                value={vegetation ? VEGETATION_OPTIONS.find((option) => option.value === vegetation)?.label ?? null : null}
                options={VEGETATION_OPTIONS.map((option) => option.label)}
                placeholder="Select vegetation"
                onSelect={(value) =>
                  setVegetation(VEGETATION_OPTIONS.find((option) => option.label === value)?.value ?? null)
                }
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Platform</Text>
            <Select
              value={platform ? PLATFORM_OPTIONS.find((option) => option.value === platform)?.label ?? null : null}
              options={PLATFORM_OPTIONS.map((option) => option.label)}
              placeholder="Bank or boat"
              onSelect={(value) => setPlatform(PLATFORM_OPTIONS.find((option) => option.label === value)?.value ?? null)}
            />
          </View>

          <Text style={[styles.label, styles.chipLabel]}>Spot Details</Text>
          <View style={styles.chipWrap}>
            {RECOMMENDER_HABITAT_OPTIONS[activeContext].map((option) => {
              const selected = habitatTags.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() =>
                    setHabitatTags((current) =>
                      current.includes(option.id)
                        ? current.filter((tag) => tag !== option.id)
                        : [...current, option.id],
                    )
                  }
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.generateBtn,
            (loading || envLoading) && styles.generateBtnDisabled,
            pressed && !(loading || envLoading) && styles.generateBtnPressed,
          ]}
          onPress={generateRecommendation}
          disabled={loading || envLoading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.textOnPrimary} />
          ) : (
            <Ionicons name="sparkles" size={16} color={colors.textOnPrimary} />
          )}
          <Text style={styles.generateBtnText}>
            {result ? 'Update Recommendation' : 'Generate Recommendation'}
          </Text>
        </Pressable>

        {error ? <Text style={styles.inlineError}>{error}</Text> : null}

        {!result ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {envLoading ? 'Loading conditions...' : `Ready for ${activeTabConfig.label}`}
            </Text>
            <Text style={styles.emptyBody}>
              {envLoading
                ? 'Pulling the live environmental inputs the recommender depends on.'
                : 'Generate the recommendation to resolve likely fish position, presentation needs, and the top lure or fly families for this context.'}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.resultHero}>
              <View style={[styles.contextPill, { backgroundColor: activeTabConfig.color + '14' }]}>
                <Ionicons name={activeTabConfig.icon as any} size={13} color={activeTabConfig.color} />
                <Text style={[styles.contextPillText, { color: activeTabConfig.color }]}>{activeTabConfig.label}</Text>
              </View>
              <Text style={styles.resultSummary}>{result.narration_payload.summary_seed}</Text>
              {result.narration_payload.confidence_note ? (
                <Text style={styles.resultNote}>{result.narration_payload.confidence_note}</Text>
              ) : null}
            </View>

            <View style={styles.toggle}>
              <Pressable
                style={[styles.toggleOpt, gearMode === 'lure' && styles.toggleActive]}
                onPress={() => setGearMode('lure')}
              >
                <Text style={[styles.toggleText, gearMode === 'lure' && styles.toggleTextActive]}>Lures</Text>
              </Pressable>
              <Pressable
                style={[styles.toggleOpt, gearMode === 'fly' && styles.toggleActive]}
                onPress={() => setGearMode('fly')}
              >
                <Text style={[styles.toggleText, gearMode === 'fly' && styles.toggleTextActive]}>Flies</Text>
              </Pressable>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Where Fish Likely Are</Text>
              <Text style={styles.sectionBody}>
                Start around {depthLaneLabel(result.fish_behavior.position.depth_lanes[0]?.id ?? 'mid_depth').toLowerCase()} and
                key on {toTitle(result.fish_behavior.position.relation_tags[0]?.id ?? 'edge_oriented').toLowerCase()} first.
              </Text>
              <View style={styles.inlineChipRow}>
                {result.fish_behavior.position.depth_lanes.slice(0, 3).map((item) => (
                  <View key={item.id} style={styles.inlineChip}>
                    <Text style={styles.inlineChipText}>{depthLaneLabel(item.id)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.inlineChipRow}>
                {result.fish_behavior.position.relation_tags.slice(0, 4).map((item) => (
                  <View key={item.id} style={styles.inlineChip}>
                    <Text style={styles.inlineChipText}>{toTitle(item.id)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>How They&apos;re Likely Acting</Text>
              <Text style={styles.sectionBody}>
                Fish look {result.fish_behavior.behavior.activity} with a {result.fish_behavior.behavior.strike_zone} strike zone and a{' '}
                {result.fish_behavior.behavior.chase_radius} chase radius.
              </Text>
              <View style={styles.inlineChipRow}>
                {result.fish_behavior.behavior.style_flags.slice(0, 6).map((flag) => (
                  <View key={flag} style={styles.inlineChip}>
                    <Text style={styles.inlineChipText}>{toTitle(flag)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Best Presentation</Text>
              {topArchetype ? (
                <>
                  <Text style={styles.presentationLead}>
                    {toTitle(topArchetype.archetype_id)}: {toTitle(topArchetype.speed)} at {toTitle(topArchetype.depth_target)}.
                  </Text>
                  <Text style={styles.sectionBody}>
                    Motion: {topArchetype.motions.map(toTitle).join(', ')}. Triggers: {topArchetype.triggers.map(toTitle).join(', ')}.
                  </Text>
                  {topArchetype.reasons.length > 0 ? (
                    <View style={styles.inlineChipRow}>
                      {topArchetype.reasons.map((reason) => (
                        <View key={reason} style={styles.inlineChip}>
                          <Text style={styles.inlineChipText}>{reason}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={styles.sectionBody}>The engine did not surface a single dominant presentation lane yet.</Text>
              )}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Top {gearMode === 'lure' ? 'Lure' : 'Fly'} Families</Text>
              {visibleFamilies.map((family) => (
                <View key={family.family_id} style={styles.familyCard}>
                  <View style={styles.familyHeader}>
                    <View>
                      <Text style={styles.familyName}>{family.display_name}</Text>
                      <Text style={styles.familyExamples}>{family.examples.join(' • ')}</Text>
                    </View>
                    <View style={styles.scorePill}>
                      <Text style={styles.scorePillText}>{family.score.toFixed(0)}</Text>
                    </View>
                  </View>

                  {family.match_reasons.length > 0 ? (
                    <Text style={styles.familyBlock}>
                      Why: {family.match_reasons.join(' • ')}
                    </Text>
                  ) : null}
                  {family.color_profile_guidance?.length ? (
                    <Text style={styles.familyBlock}>
                      Color / profile: {family.color_profile_guidance.join(' • ')}
                    </Text>
                  ) : null}
                  <Text style={styles.familyBlock}>
                    How to fish it: {family.how_to_fish.join(' ')}
                  </Text>
                  <Text style={styles.familyBlock}>
                    Best windows: {family.best_dayparts.join(', ')}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Best Dayparts</Text>
              <View style={styles.inlineChipRow}>
                {Array.from(new Set(visibleFamilies.flatMap((family) => family.best_dayparts))).slice(0, 4).map((daypart) => (
                  <View key={daypart} style={styles.inlineChip}>
                    <Text style={styles.inlineChipText}>{daypart}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Confidence / What This Depends On</Text>
              <Text style={styles.sectionBody}>
                Behavior: {toTitle(result.confidence.behavior_confidence)} • Presentation: {toTitle(result.confidence.presentation_confidence)} • Family:{' '}
                {toTitle(result.confidence.family_confidence)}
              </Text>
              <View style={styles.reasonBlock}>
                {result.confidence.reasons.map((reason) => (
                  <Text key={reason} style={styles.reasonText}>• {reason}</Text>
                ))}
              </View>
              {(result.shared_condition_summary.drivers.length > 0 || result.shared_condition_summary.suppressors.length > 0) ? (
                <View style={styles.driverWrap}>
                  {result.shared_condition_summary.drivers.length > 0 ? (
                    <Text style={styles.driverText}>
                      Helpful today: {result.shared_condition_summary.drivers.map((item) => item.label).join(' • ')}
                    </Text>
                  ) : null}
                  {result.shared_condition_summary.suppressors.length > 0 ? (
                    <Text style={styles.driverText}>
                      Tightening factors: {result.shared_condition_summary.suppressors.map((item) => item.label).join(' • ')}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </>
        )}
      </ScrollView>

      <SubscribePrompt
        visible={showSubscribePrompt}
        onDismiss={() => setShowSubscribePrompt(false)}
        onViewPlans={() => {
          setShowSubscribePrompt(false);
          router.push('/subscribe');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
  },
  topBarIconBtn: {
    width: 80,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  heading: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  refreshBtn: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  refreshBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  centeredCard: {
    margin: 24,
    padding: 24,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 12,
    ...shadows.sm,
  },
  centerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryMist,
  },
  messageTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  messageBody: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryBtnPressed: { opacity: 0.85 },
  primaryBtnText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 10,
    ...shadows.sm,
  },
  metaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  metaTitle: {
    fontSize: 20,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
  },
  metaSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  metaBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryMist,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  liveChipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  tabBarScroll: {
    marginHorizontal: -4,
  },
  tabBarScrollContent: {
    paddingHorizontal: 4,
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  tabLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 10,
    ...shadows.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfField: {
    flex: 1,
    gap: 6,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipLabel: {
    marginTop: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMist,
  },
  chipText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.primary,
  },
  generateBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...shadows.sm,
  },
  generateBtnPressed: { opacity: 0.85 },
  generateBtnDisabled: { opacity: 0.7 },
  generateBtnText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  inlineError: {
    color: colors.reportScoreRed,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: 8,
    ...shadows.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  resultHero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 10,
    ...shadows.sm,
  },
  contextPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  contextPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultSummary: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.text,
    fontWeight: '600',
  },
  resultNote: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 4,
    ...shadows.sm,
  },
  toggleOpt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.full,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: colors.textOnPrimary,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  inlineChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inlineChip: {
    backgroundColor: colors.background,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inlineChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  presentationLead: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontWeight: '700',
  },
  familyCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 8,
  },
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  familyExamples: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  scorePill: {
    minWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMist,
  },
  scorePillText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  familyBlock: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  reasonBlock: {
    gap: 6,
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  driverWrap: {
    gap: 6,
    paddingTop: 4,
  },
  driverText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
