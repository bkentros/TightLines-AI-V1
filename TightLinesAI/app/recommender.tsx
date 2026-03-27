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
import { TimingTilesRow, resolveTimingPeriods } from '../components/fishing/TimingTiles';
import { SubscribePrompt } from '../components/SubscribePrompt';
import { colors, fonts, radius, shadows, spacing } from '../lib/theme';
import { fetchFreshEnvironment, getEnvironment } from '../lib/env';
import type { EnvironmentData } from '../lib/env/types';
import { getValidAccessToken, invokeEdgeFunction } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { isCoastalContextEligible } from '../lib/coastalProximity';
import type { EngineContextKey } from '../lib/howFishingRebuildContracts';
import {
  RECOMMENDER_FEATURE,
  type RecommenderGearMode,
  type RecommenderResponse,
  type RecommenderRefinements,
  type WaterClarity,
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

function geocodeToDisplayLabel(g: Location.LocationGeocodedAddress): string | null {
  const city = g.city ?? g.subregion ?? g.district ?? g.name ?? undefined;
  const region = g.region ?? '';
  if (city && region) return `${city}, ${region}`;
  if (city) return city;
  if (region) return region;
  if (g.subregion) return g.subregion;
  return null;
}

function defaultGearMode(profileMode?: string | null): RecommenderGearMode {
  if (profileMode === 'fly') return 'fly';
  return 'lure';
}

function scorePillColor(score: number): { bg: string; text: string } {
  if (score >= 70) return { bg: colors.reportScoreGreenBg, text: colors.reportScoreGreen };
  if (score >= 45) return { bg: colors.reportScoreYellowBg, text: colors.reportScoreYellow };
  return { bg: colors.reportScoreRedBg, text: colors.reportScoreRed };
}

function confidenceLabel(level: 'high' | 'medium' | 'low'): string {
  if (level === 'high') return 'High';
  if (level === 'medium') return 'Med';
  return 'Low';
}

function titleizePresentationValue(value: string): string {
  return value
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function deterministicHeadline(
  family: RecommenderResponse['lure_rankings'][number] | RecommenderResponse['fly_rankings'][number] | null,
): string {
  if (!family) return 'Start with the top-ranked family and keep the presentation clean and controlled.';
  return `Start with ${family.display_name}. ${family.best_method.presentation_guide.summary}`;
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
  const [confidenceExpanded, setConfidenceExpanded] = useState(false);

  const [waterClarity, setWaterClarity] = useState<WaterClarity | null>(null);

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
    }),
    [waterClarity],
  );

  const hasActiveRefinements = Boolean(refinements.water_clarity);

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
          location_name: locationLabel !== 'Current location' ? locationLabel : undefined,
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
  }, [hasCoords, lat, lon, units, activeContext, refinements, hasActiveRefinements, locationLabel]);

  const visibleFamilies = gearMode === 'lure' ? result?.lure_rankings ?? [] : result?.fly_rankings ?? [];
  const activeFamily = visibleFamilies[0] ?? null;
  const polishMatchesActiveTrack = result?.polished?.track_kind === gearMode;
  const timingPeriods = result?.shared_condition_summary.highlighted_periods
    ? resolveTimingPeriods(result.shared_condition_summary.highlighted_periods)
    : null;

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
        {/* ── Location + live badge ─────────────────────────────────── */}
        <View style={styles.metaRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metaLocation}>{locationLabel}</Text>
          </View>
          {envLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View style={styles.liveChip}>
              <Ionicons name="pulse" size={12} color={colors.primary} />
              <Text style={styles.liveChipText}>Live</Text>
            </View>
          )}
        </View>

        {/* ── Context tabs ──────────────────────────────────────────── */}
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

        {/* ── Refinements ───────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Refine</Text>
            <Text style={styles.sectionHint}>Optional</Text>
          </View>

          <View style={styles.field}>
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
        </View>

        {/* ── Generate button ───────────────────────────────────────── */}
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
                : 'Tap Generate to see where fish are, how they\'re behaving, what to throw, and how to fish it.'}
            </Text>
          </View>
        ) : (
          <>
            {/* ── 1. Hero Card — headline ─────────────────────────── */}
            <View style={styles.heroCard}>
              <View style={[styles.contextPill, { backgroundColor: activeTabConfig.color + '14' }]}>
                <Ionicons name={activeTabConfig.icon as any} size={13} color={activeTabConfig.color} />
                <Text style={[styles.contextPillText, { color: activeTabConfig.color }]}>{activeTabConfig.label}</Text>
              </View>
              <Text style={styles.heroHeadline}>
                {(polishMatchesActiveTrack ? result.polished?.headline : null) ?? deterministicHeadline(activeFamily)}
              </Text>
            </View>

            {/* ── 2. Where & How Card ─────────────────────────────── */}
            <View style={styles.sectionCard}>
              <View style={styles.insightRow}>
                <Ionicons name="navigate-outline" size={16} color={colors.primary} style={{ marginTop: 2 }} />
                <Text style={styles.insightText}>
                  {result.polished?.where_insight ?? result.narration_payload.position_points[0] ?? ''}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.insightRow}>
                <Ionicons name="fish-outline" size={16} color={colors.primary} style={{ marginTop: 2 }} />
                <Text style={styles.insightText}>
                  {result.polished?.behavior_read ?? result.narration_payload.behavior_points[0] ?? ''}
                </Text>
              </View>
            </View>

            {/* ── 3. Gear Toggle + Top Families ───────────────────── */}
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
              <Text style={styles.sectionTitle}>Top {gearMode === 'lure' ? 'Lure' : 'Fly'} Families</Text>
              {visibleFamilies.slice(0, 3).map((family) => {
                const pill = scorePillColor(family.score);
                return (
                  <View key={family.family_id} style={styles.familyCard}>
                    <View style={styles.familyHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.familyName}>{family.display_name}</Text>
                        <Text style={styles.familyExamples} numberOfLines={1}>
                          {family.examples.join(' \u2022 ')}
                        </Text>
                      </View>
                      <View style={[styles.scorePill, { backgroundColor: pill.bg }]}>
                        <Text style={[styles.scorePillText, { color: pill.text }]}>
                          {family.score.toFixed(0)}
                        </Text>
                      </View>
                    </View>
                    {family.color_profile_guidance?.length ? (
                      <Text style={styles.familyColor}>
                        {family.color_profile_guidance.join(' \u2022 ')}
                      </Text>
                    ) : null}
                    <Text style={styles.familyMethodLabel}>Best setup: {family.best_method.setup_label}</Text>
                    <Text style={styles.familyMethodNote}>
                      {titleizePresentationValue(family.best_method.presentation_guide.pace)} pace {'\u2022'}{' '}
                      {titleizePresentationValue(family.best_method.presentation_guide.lane)} lane {'\u2022'}{' '}
                      {titleizePresentationValue(family.best_method.presentation_guide.action)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* ── 4. Timing Tiles ─────────────────────────────────── */}
            {timingPeriods ? (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Best Timing</Text>
                <TimingTilesRow periods={timingPeriods} />
              </View>
            ) : null}

            {/* ── 5. Presentation Tip ─────────────────────────────── */}
            {(result.polished?.presentation_tip || activeFamily?.best_method.presentation_guide.summary) ? (
              <View style={styles.tipCard}>
                <View style={styles.tipAccent} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipLabel}>Presentation</Text>
                  <Text style={styles.tipText}>
                    {(polishMatchesActiveTrack ? result.polished?.presentation_tip : null) ??
                      activeFamily?.best_method.presentation_guide.summary}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* ── 6. Confidence footer (collapsed) ────────────────── */}
            <Pressable
              style={styles.confidenceBar}
              onPress={() => setConfidenceExpanded((prev) => !prev)}
            >
              <Text style={styles.confidenceText}>
                Behavior: {confidenceLabel(result.confidence.behavior_confidence)} {'\u00B7'}{' '}
                Presentation: {confidenceLabel(result.confidence.presentation_confidence)} {'\u00B7'}{' '}
                Family: {confidenceLabel(result.confidence.family_confidence)}
              </Text>
              <Ionicons
                name={confidenceExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={colors.textMuted}
              />
            </Pressable>

            {confidenceExpanded ? (
              <View style={styles.confidenceDetail}>
                {result.shared_condition_summary.drivers.length > 0 ? (
                  <View style={styles.driverRow}>
                    <Ionicons name="trending-up" size={14} color={colors.reportScoreGreen} />
                    <Text style={styles.driverText}>
                      {result.shared_condition_summary.drivers.map((d) => d.label).join(' \u2022 ')}
                    </Text>
                  </View>
                ) : null}
                {result.shared_condition_summary.suppressors.length > 0 ? (
                  <View style={styles.driverRow}>
                    <Ionicons name="trending-down" size={14} color={colors.reportScoreRed} />
                    <Text style={styles.driverText}>
                      {result.shared_condition_summary.suppressors.map((s) => s.label).join(' \u2022 ')}
                    </Text>
                  </View>
                ) : null}
                {result.confidence.reasons.length > 0 ? (
                  <View style={styles.reasonBlock}>
                    {result.confidence.reasons.map((reason) => (
                      <Text key={reason} style={styles.reasonText}>{'\u2022'} {reason}</Text>
                    ))}
                  </View>
                ) : null}
              </View>
            ) : null}
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

  // ── Top bar ──────────────────────────────────────────────────────
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

  // ── No-coords fallback ───────────────────────────────────────────
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

  // ── Meta row ─────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metaLocation: {
    fontSize: 16,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMist,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  liveChipText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },

  // ── Tab bar ──────────────────────────────────────────────────────
  tabBarScroll: { marginHorizontal: -4 },
  tabBarScrollContent: { paddingHorizontal: 4, gap: 4 },
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
  tabLabel: { fontSize: 14, color: colors.textMuted },

  // ── Section card (reused) ────────────────────────────────────────
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
    fontSize: 17,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
  },
  sectionHint: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },

  // ── Refinements ──────────────────────────────────────────────────
  field: { gap: 6 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipLabel: { marginTop: 4 },
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
  chipTextSelected: { color: colors.primary },

  // ── Generate button ──────────────────────────────────────────────
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

  // ── Empty state ──────────────────────────────────────────────────
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

  // ── Hero card ────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 10,
    ...shadows.md,
  },
  contextPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  contextPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroHeadline: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
  },

  // ── Where & How card ─────────────────────────────────────────────
  insightRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 2,
  },

  // ── Gear toggle ──────────────────────────────────────────────────
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
  toggleActive: { backgroundColor: colors.primary },
  toggleText: { color: colors.textMuted, fontWeight: '700' },
  toggleTextActive: { color: colors.textOnPrimary },

  // ── Family cards ─────────────────────────────────────────────────
  familyCard: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    gap: 4,
  },
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  familyName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  familyExamples: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  scorePill: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  scorePillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  familyColor: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
  familyMethodLabel: {
    marginTop: 2,
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.bodySemiBold,
  },
  familyMethodNote: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
  },

  // ── Presentation tip card ────────────────────────────────────────
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEF',
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  tipAccent: {
    width: 4,
    backgroundColor: colors.gold,
  },
  tipContent: {
    flex: 1,
    padding: spacing.md,
    gap: 6,
  },
  tipLabel: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    color: '#B8862D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },

  // ── Confidence footer ────────────────────────────────────────────
  confidenceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    ...shadows.sm,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.bodySemiBold,
  },
  confidenceDetail: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 8,
    ...shadows.sm,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  driverText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  reasonBlock: { gap: 4, paddingTop: 4 },
  reasonText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
});
