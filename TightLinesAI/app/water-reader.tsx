/**
 * Water Reader screen — FinFindr paper migration.
 *
 * Visual layer: FinFindr "paper / ink" design system (see `components/paper/*`
 * and the `paper*` tokens in `lib/theme.ts`). Every piece of business logic
 * — the search debounce, the request-id race guards, the read state machine,
 * the friendly error mapping, the state-picker modal — was preserved from
 * the prior implementation. Only the JSX / StyleSheet changed, plus:
 *
 *   • The `Stack.Screen` for this route now renders no header (set in
 *     `app/_layout.tsx`); we own a custom paper nav bar that mirrors the
 *     Recommender shell so the page feels first-class.
 *   • The map + legend presentation moved into `WaterReaderMapCard`, which
 *     also fires a parallel polygon prefetch (via the lightweight waterbody
 *     polygon edge function) so the loading state paints the actual lake
 *     silhouette as a topographic-pulse skeleton.
 *
 * Nothing about the edge-function contract, request shape, or response
 * handling changed.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  type ImageStyle,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../lib/theme';
import { SubscribePrompt } from '../components/SubscribePrompt';
import { FeedbackCard } from '../components/FeedbackCard';
import { fetchWaterReaderRead, searchWaterbodies } from '../lib/waterReader';
import { TopographicLines } from '../components/paper';
import { useAuthStore } from '../store/authStore';
import { useDevTestingStore } from '../store/devTestingStore';
import { canUseAIFeatures, getEffectiveTier } from '../lib/subscription';
import { WaterReaderMapCard } from '../components/water-reader/WaterReaderMapCard';
import type { WaterReaderMapCardState } from '../components/water-reader/WaterReaderMapCard';
import type {
  WaterbodySearchResult,
  WaterReaderEngineSupportStatus,
  WaterReaderPolygonSupportStatus,
  WaterReaderReadResponse,
} from '../lib/waterReaderContracts';

const SEARCH_DEBOUNCE_MS = 650;
const SEARCH_MIN_CHARS = 3;
const SEARCH_RESULT_LIMIT = 20;

const SERIF_BOLD = 'Fraunces_700Bold';
const SERIF_ITALIC = 'Fraunces_500Medium_Italic';
const SERIF_SEMI = 'Fraunces_600SemiBold';
const MONO = 'JetBrainsMono_500Medium';
const MONO_BOLD = 'JetBrainsMono_600SemiBold';
const SANS = 'Inter_400Regular';
const SANS_MEDIUM = 'Inter_500Medium';

const STATE_NAME_TO_CODE: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR',
  California: 'CA', Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE',
  Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
  Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS',
  Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY',
};

const US_STATE_OPTIONS = Object.entries(STATE_NAME_TO_CODE)
  .map(([name, code]) => ({ name, code }))
  .sort((a, b) => a.name.localeCompare(b.name));

function stateDisplayLabel(code: string | null): string {
  if (!code) return 'CHOOSE A STATE';
  const row = US_STATE_OPTIONS.find((o) => o.code === code);
  return row ? `${row.name.toUpperCase()} · ${row.code}` : code;
}

function stateNameForCode(code: string | null): string | null {
  if (!code) return null;
  const row = US_STATE_OPTIONS.find((o) => o.code === code);
  return row?.name ?? null;
}

function parseEdgeErrorMessage(raw: string): { surface: string; details?: string } {
  if (raw.includes('|details:')) {
    const [surface, details] = raw.split('|details:');
    return { surface, details };
  }
  return { surface: raw };
}

function userFacingReadError(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  const { surface, details = '' } = parseEdgeErrorMessage(raw);
  const m = `${surface} ${details}`.toLowerCase();
  if (m.includes('not signed in') || m.includes('sign in')) return 'Sign in to load the Water Read map.';
  if (m.includes('subscribe') || m.includes('subscription')) return 'An active subscription is required to load Water Read.';
  if (m.includes('unauthorized') || surface === 'Unauthorized') return 'Session invalid. Sign in again.';
  if (m.includes('network') || m.includes('fetch') || m.includes('network request failed')) {
    return 'Network error loading Water Read. Try again.';
  }
  if (m.includes('not_found') || surface.toLowerCase().includes('not found')) return 'This waterbody was not found.';
  if (m.includes('water_reader_read_failed') || m.includes('polygon_fetch_failed') || m.includes('500')) {
    return 'Water Read could not complete a trustworthy polygon read for this waterbody.';
  }
  return surface.length < 200 ? surface : 'Could not load Water Read.';
}

function userFacingSearchError(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  const { surface, details = '' } = parseEdgeErrorMessage(raw);
  const m = `${surface} ${details}`.toLowerCase();
  if (m.includes('not signed in') || m.includes('sign in')) return 'Sign in to search waterbodies.';
  if (m.includes('subscribe') || m.includes('subscription')) return 'Waterbody search requires an active subscription.';
  if (m.includes('unauthorized') || surface === 'Unauthorized') return 'Session invalid. Sign in again to search.';
  if (m.includes('network') || m.includes('fetch') || m.includes('network request failed')) {
    return 'Network error. Check connection and try again.';
  }
  if (details.includes('statement timeout') || details.includes('canceling statement') || m.includes('57014')) {
    return 'Search timed out. Try a more specific name.';
  }
  if (surface.toLowerCase().includes('failed to search waterbodies') || m.includes('search_failed') || m.includes('500')) {
    return details && !details.toLowerCase().includes('timeout')
      ? `Search failed (${details.length > 120 ? 'try again' : details})`
      : "We couldn't run that search. Please try again.";
  }
  return surface.length < 200 ? surface : "We couldn't run that search.";
}

function canOpenWaterReaderRead(r: WaterbodySearchResult): boolean {
  return r.hasPolygonGeometry && r.waterReaderSupportStatus !== 'not_supported';
}

function supportPillLabel(status: WaterReaderPolygonSupportStatus): string {
  switch (status) {
    case 'supported': return 'SUPPORTED';
    case 'limited': return 'LIMITED';
    case 'needs_review': return 'NEEDS REVIEW';
    case 'not_supported': return 'NOT SUPPORTED';
    default: return 'UNKNOWN';
  }
}

interface SupportPillTone {
  bg: string;
  fg: string;
  border: string;
}

function supportPillTone(status: WaterReaderPolygonSupportStatus): SupportPillTone {
  switch (status) {
    case 'supported':
      return { bg: paper.bandPrime, fg: paper.dashboardInk, border: 'rgba(0,0,0,0.18)' };
    case 'limited':
      return { bg: paper.bandFair, fg: paper.dashboardInk, border: 'rgba(0,0,0,0.18)' };
    case 'needs_review':
      return { bg: paper.bandPoor, fg: paper.dashboardInk, border: 'rgba(0,0,0,0.18)' };
    case 'not_supported':
    default:
      return { bg: '#ECECEC', fg: paper.dashboardMuted, border: paper.dashboardLine };
  }
}

function resultPrimaryLine(r: WaterbodySearchResult): string {
  const county = r.county ? ` · ${r.county} County` : '';
  return `${r.name}${county}`;
}

function resultSecondaryLine(r: WaterbodySearchResult): string {
  const acres =
    typeof r.polygonAreaAcres === 'number'
      ? `${Math.round(r.polygonAreaAcres).toLocaleString()} ACRES`
      : typeof r.surfaceAreaAcres === 'number'
        ? `~${Math.round(r.surfaceAreaAcres).toLocaleString()} ACRES`
        : '— ACRES';
  return `${r.state} · ${r.waterbodyType.toUpperCase()} · ${acres}`;
}

function selectionContextLine(r: WaterbodySearchResult): string {
  const county = r.county ? ` · ${r.county} County` : '';
  const acres =
    typeof r.polygonAreaAcres === 'number'
      ? `~${Math.round(r.polygonAreaAcres).toLocaleString()} acres`
      : typeof r.surfaceAreaAcres === 'number'
        ? `~${Math.round(r.surfaceAreaAcres).toLocaleString()} acres`
        : null;
  const tail = acres ? ` · ${acres}` : '';
  return `${r.state}${county}${tail}`;
}

function ambiguityLine(r: WaterbodySearchResult): string | null {
  if (!r.isAmbiguousNameInState || !r.sameNameStateCandidateCount || r.sameNameStateCandidateCount <= 1) return null;
  return `Multiple same-name ${r.state} results; compare county and acres.`;
}

function limitedReadNote(
  status: WaterReaderPolygonSupportStatus | WaterReaderEngineSupportStatus,
  reason?: string,
): string | null {
  if (status === 'limited') {
    return reason
      ? `Limited read — ${reason}`
      : 'Limited read — the polygon supports a conservative map, but some geometry quality checks are constrained.';
  }
  if (status === 'needs_review') {
    return reason
      ? `Review-needed read — ${reason}`
      : 'Review-needed read — the polygon can render, but its geometry should be reviewed before treating every structure label as app-ready.';
  }
  return null;
}

type WaterReaderReadState =
  | { status: 'idle'; read: null; errorMessage: null }
  | { status: 'reading'; read: null; errorMessage: null }
  | { status: 'ready'; read: WaterReaderReadResponse; errorMessage: null }
  | { status: 'error'; read: null; errorMessage: string };

export default function WaterReaderScreen() {
  const router = useRouter();
  const { profile, user } = useAuthStore();
  const overrideSubscriptionTier = useDevTestingStore((s) => s.overrideSubscriptionTier);
  const effectiveTier = getEffectiveTier(profile, overrideSubscriptionTier ?? null);
  const hasSubscription = canUseAIFeatures(effectiveTier);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);

  const [stateCode, setStateCode] = useState<string | null>(null);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [results, setResults] = useState<WaterbodySearchResult[]>([]);
  const [countyFilter, setCountyFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<WaterbodySearchResult | null>(null);
  const searchRequestId = useRef(0);
  const readRequestId = useRef(0);
  const [readState, setReadState] = useState<WaterReaderReadState>({
    status: 'idle',
    read: null,
    errorMessage: null,
  });

  useEffect(() => {
    setSelected(null);
  }, [stateCode]);

  useEffect(() => {
    if (!selected || !canOpenWaterReaderRead(selected)) {
      readRequestId.current += 1;
      setReadState({ status: 'idle', read: null, errorMessage: null });
      return;
    }
    const reqId = ++readRequestId.current;
    setReadState({ status: 'reading', read: null, errorMessage: null });
    const lakeId = selected.lakeId;
    void (async () => {
      try {
        const res = await fetchWaterReaderRead({ lakeId });
        if (readRequestId.current !== reqId) return;
        setReadState({ status: 'ready', read: res, errorMessage: null });
      } catch (e) {
        if (readRequestId.current !== reqId) return;
        setReadState({ status: 'error', read: null, errorMessage: userFacingReadError(e) });
      }
    })();
    return () => {
      readRequestId.current += 1;
    };
  }, [selected]);

  const runSearch = useCallback(
    async (requestId: number) => {
      const q = query.trim();
      if (!stateCode || q.length < SEARCH_MIN_CHARS) {
        setResults([]);
        setCountyFilter(null);
        setSearchEmpty(false);
        setSearchError(null);
        setSearching(false);
        setSearchExpanded(false);
        return;
      }
      setSearching(true);
      setSearchExpanded(false);
      setSearchError(null);
      setSearchEmpty(false);
      const expandedTimer = setTimeout(() => {
        if (searchRequestId.current === requestId) setSearchExpanded(true);
      }, 900);
      try {
        const res = await searchWaterbodies({ query: q, state: stateCode, limit: SEARCH_RESULT_LIMIT });
        if (searchRequestId.current !== requestId) return;
        setResults(res.results);
        setCountyFilter((current) =>
          current && res.results.some((row) => row.county === current)
            ? current
            : null,
        );
        setSearchEmpty(res.results.length === 0);
      } catch (e) {
        if (searchRequestId.current !== requestId) return;
        setSearchError(userFacingSearchError(e));
        setResults([]);
        setCountyFilter(null);
        setSearchEmpty(false);
      } finally {
        clearTimeout(expandedTimer);
        if (searchRequestId.current === requestId) setSearching(false);
      }
    },
    [query, stateCode],
  );

  useEffect(() => {
    const q = query.trim();
    if (!stateCode || q.length < SEARCH_MIN_CHARS) {
      setResults([]);
      setCountyFilter(null);
      setSearchError(null);
      setSearchEmpty(false);
      setSearching(false);
      setSearchExpanded(false);
      return;
    }
    setSearchError(null);
    const id = ++searchRequestId.current;
    const t = setTimeout(() => {
      void runSearch(id);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query, stateCode, runSearch]);

  const openStatePicker = useCallback(() => {
    if (!hasSubscription) {
      setShowSubscribePrompt(true);
      return;
    }
    setStateModalOpen(true);
  }, [hasSubscription]);

  const onChangeState = useCallback(() => {
    if (!hasSubscription) {
      setShowSubscribePrompt(true);
      return;
    }
    setStateCode(null);
    setQuery('');
    setResults([]);
    setCountyFilter(null);
    setSearchError(null);
    setSearchEmpty(false);
    setSearchExpanded(false);
    setStateModalOpen(true);
  }, [hasSubscription]);

  const onChangeLake = useCallback(() => {
    setSelected(null);
    setQuery('');
  }, []);

  const showResultsPanel =
    !selected && stateCode && (query.trim().length >= SEARCH_MIN_CHARS || searching || (searchError != null && query.trim().length >= SEARCH_MIN_CHARS));

  const stateNameForEmpty =
    (stateCode && US_STATE_OPTIONS.find((o) => o.code === stateCode)?.name) || 'this state';

  const countyOptions = useMemo(
    () =>
      Array.from(
        new Set(
          results
            .map((row) => row.county)
            .filter((county): county is string => Boolean(county)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [results],
  );
  const filteredResults = useMemo(
    () =>
      countyFilter
        ? results.filter((row) => row.county === countyFilter)
        : results,
    [countyFilter, results],
  );
  const showCountyFilters = countyOptions.length > 1 && results.length >= 4;

  const engineRead = readState.status === 'ready' ? readState.read : null;
  const polygonLimitedNote =
    engineRead ? limitedReadNote(engineRead.waterReaderSupportStatus, engineRead.waterReaderSupportReason) : null;
  const engineLimitedNote =
    engineRead ? limitedReadNote(engineRead.engineSupportStatus, engineRead.engineSupportReason) : null;

  // ── Map card state mapping ──────────────────────────────────────────────
  // The wrapper component takes its own enum so the page doesn't have to
  // think about renderer-internal nuances.
  const mapCardState: WaterReaderMapCardState = (() => {
    if (!selected) return { status: 'idle' };
    if (readState.status === 'reading') return { status: 'reading' };
    if (readState.status === 'ready') return { status: 'ready', read: readState.read };
    if (readState.status === 'error')
      return { status: 'error', errorMessage: readState.errorMessage };
    return { status: 'idle' };
  })();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeNav} edges={['top']}>
        <View style={styles.navHeader}>
          <Pressable
            style={({ pressed }) => [
              styles.navBackBtn,
              pressed && styles.navBackBtnPressed,
            ]}
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          </Pressable>

          <View style={styles.navBrand}>
            <Image
              source={require('../assets/images/finfindr-logo.png')}
              style={styles.navLogo as ImageStyle}
              resizeMode="contain"
            />
            <View style={styles.navTitleWrap} pointerEvents="none">
              <View style={styles.navTitleRow}>
                <Text style={styles.navTitle} numberOfLines={1}>
                  Water Read
                </Text>
                <Text style={styles.navTitlePeriod}>.</Text>
              </View>
              <Text style={styles.navEyebrow}>POLYGON SCAN</Text>
            </View>
          </View>

          <View style={styles.navRight}>
            {stateCode ? (
              <Pressable
                style={({ pressed }) => [
                  styles.navStatePill,
                  pressed && styles.navStatePillPressed,
                ]}
                onPress={onChangeState}
                hitSlop={8}
                accessibilityLabel="Change state"
              >
                <View style={styles.navStateDot} />
                <Text style={styles.navStatePillText}>{stateCode}</Text>
                <Ionicons name="chevron-down" size={11} color="#FFFFFF" style={{ opacity: 0.7 }} />
              </Pressable>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.navStatePill,
                  pressed && styles.navStatePillPressed,
                ]}
                onPress={openStatePicker}
                hitSlop={8}
                accessibilityLabel="Select state"
              >
                <Text style={styles.navStatePillText}>STATE</Text>
                <Ionicons name="chevron-down" size={11} color="#FFFFFF" style={{ opacity: 0.7 }} />
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Hero ── */}
            <View style={styles.hero}>
              <Text style={styles.heroEyebrow}>WATER READ  ·  POLYGON INTELLIGENCE</Text>
              <View style={styles.heroHeadlineRow}>
                <View style={styles.heroHeadlineText}>
                  <Text style={styles.heroHeadline} allowFontScaling={false}>
                    Map the structure{'\n'}
                    <Text style={styles.heroHeadlineAccent}>before you cast.</Text>
                  </Text>
                  <Text style={styles.heroSubline}>
                    Public hydrography outlines, structure zones, and seasonal notes for supported lakes.
                  </Text>
                </View>
                <Image
                  source={require('../assets/images/water-read-hero.png')}
                  style={styles.heroPines as ImageStyle}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* ── Search console card ── */}
            <View style={styles.searchCard}>
              <TopographicLines
                style={StyleSheet.absoluteFill}
                color={paper.dashboardBlue}
                count={4}
              />

              <Text style={styles.searchCardEyebrow}>STEP 1 · STATE</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.stateButton,
                  pressed && styles.stateButtonPressed,
                ]}
                onPress={openStatePicker}
                accessibilityLabel="Select U.S. state"
              >
                <Ionicons name="location-outline" size={14} color={paper.dashboardInk} />
                <Text
                  style={[
                    styles.stateButtonText,
                    !stateCode && styles.stateButtonTextEmpty,
                  ]}
                  numberOfLines={1}
                >
                  {stateDisplayLabel(stateCode)}
                </Text>
                <Ionicons name="chevron-down" size={12} color={paper.dashboardInk} />
              </Pressable>

              {!stateCode && (
                <Text style={styles.searchHint}>
                  Pick a state to search for a lake, pond, or reservoir.
                </Text>
              )}

              {stateCode && (
                <>
                  <Text
                    style={[
                      styles.searchCardEyebrow,
                      styles.searchCardEyebrowStep,
                    ]}
                  >
                    STEP 2 · LAKE NAME
                  </Text>
                  <View style={styles.searchInputWrap}>
                    <Ionicons name="search" size={14} color={paper.dashboardInk} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder={`Lakes in ${stateNameForCode(stateCode) ?? stateCode}…`}
                      placeholderTextColor="rgba(28,36,25,0.42)"
                      value={query}
                      onChangeText={setQuery}
                      autoCorrect={false}
                      autoCapitalize="words"
                      accessibilityLabel="Waterbody name search"
                      editable={!selected}
                      pointerEvents={selected ? 'none' : 'auto'}
                    />
                    {query.length > 0 && !selected && (
                      <Pressable
                        onPress={() => setQuery('')}
                        hitSlop={8}
                        style={({ pressed }) => [
                          styles.clearBtn,
                          pressed && { opacity: 0.6 },
                        ]}
                        accessibilityLabel="Clear search"
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={paper.dashboardMuted}
                        />
                      </Pressable>
                    )}
                  </View>
                  {!selected && query.trim().length < SEARCH_MIN_CHARS && !searching && (
                    <Text style={styles.searchHint}>
                      Type at least 3 letters of the lake name.
                    </Text>
                  )}
                </>
              )}

              {/* Selected-lake summary inline (collapsed search). */}
              {stateCode && selected && (
                <View style={styles.selectedRow}>
                  <View style={styles.selectedTextStack}>
                    <Text style={styles.selectedTitle} numberOfLines={2}>
                      {selected.name}
                    </Text>
                    <Text style={styles.selectedContext} numberOfLines={2}>
                      {selectionContextLine(selected)}
                    </Text>
                    <View style={styles.selectedActions}>
                      <Pressable
                        onPress={onChangeLake}
                        style={({ pressed }) => [
                          styles.linkBtn,
                          pressed && styles.linkBtnPressed,
                        ]}
                        hitSlop={6}
                      >
                        <Text style={styles.linkBtnText} numberOfLines={1}>
                          CHANGE LAKE
                        </Text>
                      </Pressable>
                      <Text style={styles.linkSep}>·</Text>
                      <Pressable
                        onPress={onChangeState}
                        style={({ pressed }) => [
                          styles.linkBtn,
                          pressed && styles.linkBtnPressed,
                        ]}
                        hitSlop={6}
                      >
                        <Text style={styles.linkBtnText} numberOfLines={1}>
                          CHANGE STATE
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <SupportPill
                    status={selected.waterReaderSupportStatus}
                  />
                </View>
              )}

              {/* Results dropdown. */}
              {showResultsPanel && (
                <View style={styles.dropdown}>
                  {searching && (
                    <View style={styles.dropdownLoadingRow}>
                      <ActivityIndicator
                        size="small"
                        color={paper.dashboardBlue}
                      />
                      <Text style={styles.dropdownLoadingText}>
                        {searchExpanded
                          ? 'CHECKING NATIONAL HYDROGRAPHY…'
                          : 'SEARCHING…'}
                      </Text>
                    </View>
                  )}
                  {searchError && (
                    <View style={styles.dropdownErrorRow}>
                      <Ionicons
                        name="alert-circle"
                        size={14}
                        color={paper.dashboardBlue}
                      />
                      <Text style={styles.dropdownErrorText}>
                        {searchError}
                      </Text>
                    </View>
                  )}
                  {searchEmpty && !searchError && !searching && (
                    <View style={styles.dropdownEmptyRow}>
                      <Ionicons
                        name="cloud-offline-outline"
                        size={16}
                        color={paper.dashboardMuted}
                      />
                      <Text style={styles.dropdownEmptyText}>
                        No matching lakes in {stateNameForEmpty}. Try another
                        spelling.
                      </Text>
                    </View>
                  )}
                  {!searching && results.length > 0 && (
                    <>
                      {showCountyFilters && (
                        <View style={styles.countyFilterWrap}>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.countyFilterContent}
                          >
                            <CountyFilterChip
                              label="ALL COUNTIES"
                              active={countyFilter == null}
                              onPress={() => setCountyFilter(null)}
                            />
                            {countyOptions.map((county) => (
                              <CountyFilterChip
                                key={county}
                                label={county.toUpperCase()}
                                active={countyFilter === county}
                                onPress={() => setCountyFilter(county)}
                              />
                            ))}
                          </ScrollView>
                        </View>
                      )}
                      <ScrollView
                        style={styles.dropdownList}
                        contentContainerStyle={styles.dropdownListContent}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={filteredResults.length > 5}
                      >
                        {filteredResults.map((r, idx) => {
                          const open = canOpenWaterReaderRead(r);
                          return (
                            <Pressable
                              key={r.lakeId}
                              style={({ pressed }) => [
                                styles.resultRow,
                                idx > 0 && styles.resultRowDivider,
                                !open && styles.resultRowDisabled,
                                pressed && open && styles.resultRowPressed,
                              ]}
                              onPress={() => {
                                if (canOpenWaterReaderRead(r)) setSelected(r);
                              }}
                              disabled={!open}
                            >
                              <View style={styles.resultRowMain}>
                                <Text
                                  style={styles.resultPrimary}
                                  numberOfLines={2}
                                >
                                  {resultPrimaryLine(r)}
                                </Text>
                                <Text style={styles.resultSecondary} numberOfLines={2}>
                                  {resultSecondaryLine(r)}
                                </Text>
                                {ambiguityLine(r) && (
                                  <Text style={styles.resultAmbiguity} numberOfLines={2}>
                                    {ambiguityLine(r)}
                                  </Text>
                                )}
                                {!open && (
                                  <Text style={styles.resultBlocked} numberOfLines={2}>
                                    Water Read not available for this row.
                                  </Text>
                                )}
                              </View>
                              <SupportPill
                                status={r.waterReaderSupportStatus}
                                compact
                              />
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </>
                  )}
                </View>
              )}
            </View>

            {/* ── Map + legend ── */}
            {!selected ? (
              <WaterReadIdlePreview />
            ) : (
              <>
                <WaterReaderMapCard
                  lakeId={selected.lakeId}
                  lakeName={selected.name}
                  lakeContextLine={selectionContextLine(selected)}
                  state={mapCardState}
                  bottomSlot={
                    (polygonLimitedNote || engineLimitedNote) && engineRead ? (
                      <View style={styles.limitedNotesStack}>
                        {polygonLimitedNote && (
                          <Text style={styles.limitedNote}>
                            {polygonLimitedNote}
                          </Text>
                        )}
                        {engineLimitedNote &&
                          engineLimitedNote !== polygonLimitedNote && (
                            <Text style={styles.limitedNote}>
                              {engineLimitedNote}
                            </Text>
                          )}
                      </View>
                    ) : null
                  }
                />
                <FeedbackCard
                  featureName="Water Read"
                  topic="water_read"
                  profile={profile}
                  user={user}
                  contextLines={[
                    `Lake: ${selected.name}`,
                    `Context: ${selectionContextLine(selected)}`,
                    `State: ${stateCode ?? 'unknown'}`,
                    `Lake ID: ${selected.lakeId}`,
                    `Read state: ${mapCardState.status}`,
                  ]}
                />
              </>
            )}

            {/* ── Guardrails ── */}
            <View style={styles.guardrailCard}>
              <TopographicLines
                style={StyleSheet.absoluteFill}
                color={paper.dashboardBlue}
                count={5}
              />
              <Text style={styles.guardrailEyebrow}>GUARDRAILS</Text>
              <Text style={styles.guardrailHeadline}>
                Read it like a guide&apos;s scribble.
              </Text>
              <Text style={styles.guardrailBody}>
                Zones come from polygon geometry only. They do not use photos,
                depth, species, weather, your position, or exact coordinates.
              </Text>
            </View>

            {/* ── Footer ── */}
            <View style={styles.footer}>
              <Text style={styles.footerLeft} numberOfLines={1}>
                FINFINDR
              </Text>
              <Text style={styles.footerRight} numberOfLines={2}>
                POLYGON ONLY · MADE FOR THE WATER
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      {/* ── State picker modal ── */}
      <Modal
        visible={stateModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setStateModalOpen(false)}
      >
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Text style={styles.modalEyebrow}>WATER READ</Text>
              <Text style={styles.modalTitle}>Choose a state</Text>
            </View>
            <Pressable
              onPress={() => setStateModalOpen(false)}
              style={({ pressed }) => [
                styles.modalDoneBtn,
                pressed && styles.modalDoneBtnPressed,
              ]}
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalListContent}>
            {US_STATE_OPTIONS.map((option) => {
              const active = option.code === stateCode;
              return (
                <Pressable
                  key={option.code}
                  style={({ pressed }) => [
                    styles.modalRow,
                    active && styles.modalRowActive,
                    pressed && styles.modalRowPressed,
                  ]}
                  onPress={() => {
                    setStateCode(option.code);
                    setStateModalOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalRowName,
                      active && styles.modalRowNameActive,
                    ]}
                    numberOfLines={1}
                  >
                    {option.name}
                  </Text>
                  <Text
                    style={[
                      styles.modalRowCode,
                      active && styles.modalRowCodeActive,
                    ]}
                  >
                    {option.code}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
      <SubscribePrompt
        visible={showSubscribePrompt}
        onDismiss={() => setShowSubscribePrompt(false)}
        onUnlocked={() => {
          setShowSubscribePrompt(false);
        }}
      />
    </View>
  );
}

// ─── Idle preview plate ──────────────────────────────────────────────────────
//
// Replaces the prior "Choose a lake" body card with a small teaser plate that
// previews exactly what Water Read produces — a stylized lake outline, three
// patterned structure zones (point / cove / island), a numbered callout, and
// FinFindr brand marginalia mirroring the real map plate. Gives first-time
// visitors something to see before they pick a state, so the page no longer
// feels bland on arrival.

// Sample plate is a bundled snapshot generated from the real Pontiac Lake
// Water Read renderer. It must never call search/read endpoints: the idle
// screen is product chrome, not a live generation request.
const SAMPLE_PREVIEW_ACRES = 633;
const SAMPLE_PREVIEW_STRUCTURE_COUNT = 11;
const SAMPLE_PREVIEW_SEASON_LABEL = 'SPRING';
const SAMPLE_PREVIEW_ASPECT_RATIO = 1;

function WaterReadIdlePreview() {
  const windowDims = useWindowDimensions();

  // Plate-only sample preview at ~60% of normal width. Renders just the
  // map plate (FULL/DETAIL toolbar, polygon SVG, brand chip, scale bar,
  // bottom colophon) and the acres/structures/season meta ribbon — no
  // cartouche, no lake-name display, no legend, no outer colophon.
  // Anonymized: the engine generates the actual Pontiac polygon, but we
  // don't surface the lake's identity on the idle screen.

  // Compute preview width: 80% of the available content width. Available
  // content = window width minus the page's horizontal padding (20 each
  // side). At 80% the plate is clearly smaller than a full read but
  // doesn't leave awkward empty gutters on either side.
  const contentWidth = Math.max(240, windowDims.width - 40);
  const previewWidth = Math.round(contentWidth * 0.8);
  // Snapshot is square, matching the generated static preview asset.
  const aspectRatio = SAMPLE_PREVIEW_ASPECT_RATIO;
  // Outer card (plate + meta ribbon) is sized by the SVG aspect plus
  // chrome padding; we just need the plate's pixel dimensions for the
  // SvgXml renderer so it picks a sharp size.
  const platePixelWidth = previewWidth - 26; // minus mapCard padding + plateOuter padding
  const platePixelHeight = Math.round(platePixelWidth / Math.max(0.3, aspectRatio));

  return (
    <View style={styles.idleOuter}>
      <View style={styles.idleHeaderText}>
        <Text style={styles.idleEyebrow}>SAMPLE PLATE · PREVIEW</Text>
        <Text style={styles.idleHeadline}>See structure before you cast.</Text>
        <Text style={styles.idleSubline}>
          Pick a state and a lake above. Every Water Read is delivered as a
          signed FinFindr plate like this one.
        </Text>
      </View>

      <View style={styles.idlePreviewCenter}>
        <View style={[styles.idleMapCard, { width: previewWidth }]}>
          {/* FULL/DETAIL toolbar (visual placeholders — not interactive). */}
          <View style={styles.idleViewerToolbar}>
            <View style={[styles.idleViewerChip, styles.idleViewerChipActive]}>
              <Ionicons name="scan-outline" size={9} color="#FFFFFF" />
              <Text
                style={[
                  styles.idleViewerChipText,
                  styles.idleViewerChipTextActive,
                ]}
              >
                FULL
              </Text>
            </View>
            <View style={styles.idleViewerChip}>
              <Ionicons
                name="move-outline"
                size={9}
                color={paper.dashboardInk}
              />
              <Text style={styles.idleViewerChipText}>DETAIL</Text>
            </View>
          </View>

          <View style={styles.idlePlateOuter}>
            <View
              style={[
                styles.idlePlateInner,
                {
                  width: platePixelWidth,
                  height: platePixelHeight,
                },
              ]}
            >
              <Image
                source={require('../assets/images/water-reader-pontiac-sample.png')}
                style={[
                  styles.idlePreviewImage as ImageStyle,
                  {
                    width: platePixelWidth,
                    height: platePixelHeight,
                  },
                ]}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />

              {/* FinFindr brand chip — smaller version of WaterReadEditionStamp. */}
              <View style={styles.idleBrandChip} pointerEvents="none">
                <Image
                  source={require('../assets/images/finfindr-logo.png')}
                  style={styles.idleBrandLogo as ImageStyle}
                  resizeMode="contain"
                />
                <Text style={styles.idleBrandText} numberOfLines={1}>
                  FinFindr<Text style={styles.idleBrandDot}>.</Text>
                </Text>
                <View style={styles.idleBrandDivider} />
                <Text style={styles.idleBrandEdition} numberOfLines={1}>
                  WATER READ
                </Text>
              </View>

              {/* Scale bar — smaller version of WaterReadScaleBar. */}
              <View style={styles.idleScaleBar} pointerEvents="none">
                <View style={styles.idleScaleBarRow}>
                  <View style={styles.idleScaleTickEnd} />
                  <View style={styles.idleScaleBarSegment} />
                  <View style={styles.idleScaleTickMid} />
                  <View style={styles.idleScaleBarSegment} />
                  <View style={styles.idleScaleTickEnd} />
                </View>
                <Text style={styles.idleScaleLabel}>SAMPLE</Text>
              </View>
            </View>
          </View>

          {/* Meta ribbon — acres · structures · season. */}
          <View style={styles.idleMetaRibbon}>
            <View style={styles.idleMetaRule} />
            <View style={styles.idleMetaRow}>
              <Text style={styles.idleMetaText} numberOfLines={1}>
                {`${SAMPLE_PREVIEW_ACRES.toLocaleString()} ACRES`}
              </Text>
              <Text style={styles.idleMetaDivider}>·</Text>
              <Text style={styles.idleMetaText} numberOfLines={1}>
                {`${SAMPLE_PREVIEW_STRUCTURE_COUNT} STRUCTURES`}
              </Text>
              <Text style={styles.idleMetaDivider}>·</Text>
              <Text style={styles.idleMetaText} numberOfLines={1}>
                {SAMPLE_PREVIEW_SEASON_LABEL}
              </Text>
            </View>
            <View style={styles.idleMetaRule} />
          </View>
        </View>
      </View>

      <View style={styles.idleCta}>
        <Ionicons
          name="arrow-up-outline"
          size={13}
          color={paper.dashboardBlue}
        />
        <Text style={styles.idleCtaText}>
          Pick a state above to scan a real lake.
        </Text>
      </View>
    </View>
  );
}



// ─── Support pill ────────────────────────────────────────────────────────────

function SupportPill({
  status,
  compact,
}: {
  status: WaterReaderPolygonSupportStatus;
  compact?: boolean;
}) {
  const tone = supportPillTone(status);
  return (
    <View
      style={[
        styles.supportPill,
        compact && styles.supportPillCompact,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
        },
      ]}
    >
      <Text
        style={[
          styles.supportPillText,
          compact && styles.supportPillTextCompact,
          { color: tone.fg },
        ]}
        numberOfLines={1}
      >
        {supportPillLabel(status)}
      </Text>
    </View>
  );
}

function CountyFilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.countyFilterChip,
        active && styles.countyFilterChipActive,
        pressed && styles.countyFilterChipPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[
          styles.countyFilterChipText,
          active && styles.countyFilterChipTextActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safeNav: { backgroundColor: paper.dashboardInk },
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 40,
    gap: 22,
  },

  navHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: paper.dashboardInk,
  },
  navBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBackBtnPressed: { opacity: 0.7 },
  navBrand: {
    position: 'absolute',
    left: 58,
    right: 118,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navLogo: {
    width: 34,
    height: 38,
  },
  navTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  navEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    color: 'rgba(255,255,255,0.62)',
    letterSpacing: 1.6,
    marginTop: -1,
  },
  navTitle: {
    fontFamily: SERIF_BOLD,
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 0,
    lineHeight: 26,
  },
  navTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 0,
  },
  navTitlePeriod: {
    fontFamily: SERIF_BOLD,
    fontSize: 24,
    color: paper.dashboardBlueLight,
    marginLeft: 1,
    lineHeight: 26,
  },
  navRight: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
  },
  navStatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  navStatePillPressed: { opacity: 0.7 },
  navStateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandPrime,
  },
  navStatePillText: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },

  hero: {
    marginBottom: 2,
  },
  heroEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 2.1,
    color: '#444444',
    marginBottom: 10,
  },
  heroHeadlineRow: {
    position: 'relative',
    minHeight: 120,
    justifyContent: 'center',
    overflow: 'visible',
  },
  heroHeadlineText: {
    maxWidth: 270,
    position: 'relative',
    zIndex: 1,
  },
  heroHeadline: {
    fontFamily: SERIF_BOLD,
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: 0,
    color: paper.dashboardInk,
  },
  heroHeadlineAccent: {
    fontFamily: SERIF_ITALIC,
    fontStyle: 'italic',
    color: paper.dashboardBlue,
  },
  heroSubline: {
    marginTop: 8,
    fontFamily: SANS_MEDIUM,
    fontSize: 12,
    lineHeight: 17,
    color: '#555555',
  },
  heroPines: {
    position: 'absolute',
    right: -36,
    top: -14,
    width: 204,
    height: 128,
    opacity: 0.48,
    zIndex: 0,
  },

  // Search card. Slimmed in Pass-3 so the map plate below it dominates
  // the page; the search console is utility, the map is the hero.
  // Pass-5: bumped paddingBottom slightly so the CHANGE LAKE / CHANGE
  // STATE action row in the selected-lake summary clears the bottom-
  // left corner mark (red ▾) — those two were visually colliding.
  searchCard: {
    overflow: 'hidden',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    gap: 8,
  },
  searchCardEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.7,
    color: paper.dashboardBlue,
  },
  searchCardEyebrowStep: {
    marginTop: paperSpacing.xs + 2,
  },
  stateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: '#FAFAF7',
  },
  stateButtonPressed: { transform: [{ translateY: 1 }] },
  stateButtonText: {
    flex: 1,
    minWidth: 0,
    fontFamily: MONO_BOLD,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 1.2,
  },
  stateButtonTextEmpty: {
    opacity: 0.55,
  },
  searchHint: {
    fontFamily: SANS_MEDIUM,
    fontSize: 12,
    color: '#555555',
    lineHeight: 17,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: '#FAFAF7',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontFamily: SANS_MEDIUM,
    fontSize: 14.5,
    color: paper.dashboardInk,
    paddingVertical: 0,
  },
  clearBtn: { padding: 2 },

  // Inline selected row
  selectedRow: {
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.sm + 2,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardLine,
  },
  selectedTextStack: { width: '100%', gap: 3, alignItems: 'center' },
  selectedTitle: {
    fontFamily: SERIF_SEMI,
    fontSize: 16,
    color: paper.dashboardInk,
    textAlign: 'center',
  },
  selectedContext: {
    fontFamily: SANS_MEDIUM,
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
    textAlign: 'center',
  },
  selectedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  linkBtn: { paddingVertical: 2 },
  linkBtnPressed: { opacity: 0.6 },
  linkBtnText: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 1.4,
    color: paper.dashboardBlue,
    lineHeight: 13,
  },
  linkSep: { color: paper.dashboardMuted, fontSize: 11 },

  // Dropdown
  dropdown: {
    marginTop: paperSpacing.sm + 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
  },
  dropdownLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
  },
  dropdownLoadingText: {
    flexShrink: 1,
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 1.5,
    color: paper.dashboardMuted,
    lineHeight: 14,
  },
  dropdownErrorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
    backgroundColor: '#FAFAF7',
  },
  dropdownErrorText: {
    flex: 1,
    minWidth: 0,
    fontFamily: SANS,
    fontSize: 12.5,
    lineHeight: 17,
    color: paper.dashboardBlue,
  },
  dropdownEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
  },
  dropdownEmptyText: {
    flex: 1,
    minWidth: 0,
    fontFamily: SANS,
    fontSize: 12.5,
    lineHeight: 17,
    color: '#555555',
  },
  countyFilterWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: paper.dashboardHair,
    backgroundColor: '#FAFAF7',
  },
  countyFilterContent: {
    gap: paperSpacing.xs,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs,
  },
  countyFilterChip: {
    maxWidth: 138,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
  },
  countyFilterChipActive: {
    borderColor: 'rgba(42,110,150,0.45)',
    backgroundColor: paper.dashboardBlueSky,
  },
  countyFilterChipPressed: {
    opacity: 0.75,
  },
  countyFilterChipText: {
    fontFamily: MONO_BOLD,
    fontSize: 8.5,
    lineHeight: 11,
    letterSpacing: 1.1,
    color: paper.dashboardInk,
  },
  countyFilterChipTextActive: {
    color: paper.dashboardInk,
  },
  dropdownList: { maxHeight: 430 },
  dropdownListContent: {
    paddingBottom: paperSpacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
    backgroundColor: paper.dashboardWhite,
  },
  resultRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardHair,
  },
  resultRowDisabled: { opacity: 0.5 },
  resultRowPressed: { backgroundColor: '#FAFAF7' },
  resultRowMain: { flex: 1, minWidth: 0, gap: 3 },
  resultPrimary: {
    fontFamily: SERIF_SEMI,
    fontSize: 14.5,
    color: paper.dashboardInk,
    lineHeight: 18,
  },
  resultSecondary: {
    fontFamily: MONO,
    fontSize: 10.5,
    letterSpacing: 0.6,
    color: paper.dashboardMuted,
    lineHeight: 14,
  },
  resultAmbiguity: {
    fontFamily: SANS_MEDIUM,
    fontSize: 11,
    lineHeight: 14,
    color: paper.dashboardBlue,
    marginTop: 2,
  },
  resultBlocked: {
    fontFamily: SANS,
    fontSize: 11,
    lineHeight: 14,
    color: paper.dashboardMuted,
    marginTop: 2,
  },

  // Support pill
  supportPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexShrink: 0,
    maxWidth: 142,
  },
  supportPillCompact: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    maxWidth: 118,
  },
  supportPillText: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.2,
    textAlign: 'center',
    lineHeight: 12,
  },
  supportPillTextCompact: {
    fontSize: 8.5,
    letterSpacing: 1.4,
  },

  // Idle state — sample plate preview that mirrors WaterReaderMapCard
  // chrome exactly (FULL/DETAIL toolbar, plate frame with tan beige,
  // brand chip top-left, scale bar bottom-left, bottom colophon, meta
  // ribbon). The preview is a faithful "this is what you'll see"
  // rather than a stylized abstraction.
  idleOuter: {
    width: '100%',
    gap: paperSpacing.md,
  },
  idleHeaderText: {
    paddingHorizontal: 2,
    gap: 4,
  },
  idleEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.7,
    color: paper.dashboardBlue,
    lineHeight: 12,
  },
  idleHeadline: {
    fontFamily: SERIF_BOLD,
    fontSize: 22,
    lineHeight: 26,
    color: paper.dashboardInk,
    marginTop: 2,
  },
  idleSubline: {
    marginTop: 2,
    fontFamily: SANS_MEDIUM,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#555555',
  },

  // Fallback card when the preview fetch fails (auth / network / etc.).
  idleErrorCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    gap: 8,
  },

  // ── Plate-only sample preview chrome ───────────────────────────────────
  // Smaller variants of WaterReaderMapCard's plate chrome (mapCard,
  // viewerToolbar, plateOuter, plateInner, brand chip, scale bar, meta
  // ribbon). 60% width of the content area. Layout-natural (no transform:
  // scale) so the surrounding flow stays clean.
  idlePreviewCenter: {
    width: '100%',
    alignItems: 'center',
  },
  idleMapCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  idleViewerToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  idleViewerChip: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 5,
    backgroundColor: '#FAFAF7',
  },
  idleViewerChipActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  idleViewerChipText: {
    fontFamily: MONO_BOLD,
    fontSize: 7.5,
    letterSpacing: 1,
    color: paper.dashboardInk,
    lineHeight: 10,
  },
  idleViewerChipTextActive: { color: '#FFFFFF' },
  idlePlateOuter: {
    width: '100%',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 6,
    padding: 2,
    backgroundColor: '#FAFAF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idlePlateInner: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#EFE4C8',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardHair,
  },
  idlePlateLoading: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idlePreviewImage: {
    width: '100%',
    height: '100%',
  },

  // Compact brand chip — top-left corner of preview plate.
  idleBrandChip: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(28, 36, 25, 0.22)',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  idleBrandLogo: {
    width: 11,
    height: 13,
    backgroundColor: paper.dashboardInk,
    borderRadius: 3,
  },
  idleBrandText: {
    fontFamily: SERIF_BOLD,
    fontSize: 8.5,
    fontWeight: '800',
    color: paper.dashboardInk,
    lineHeight: 10,
  },
  idleBrandDot: { color: paper.dashboardBlue },
  idleBrandDivider: {
    width: StyleSheet.hairlineWidth,
    height: 9,
    backgroundColor: 'rgba(28, 36, 25, 0.28)',
    marginHorizontal: 1,
  },
  idleBrandEdition: {
    fontFamily: MONO_BOLD,
    fontSize: 6.2,
    letterSpacing: 1.1,
    color: paper.dashboardMuted,
    lineHeight: 8,
  },

  // Compact scale bar — bottom-left corner of preview plate.
  idleScaleBar: {
    position: 'absolute',
    bottom: 12,
    left: 8,
    alignItems: 'flex-start',
    gap: 2,
  },
  idleScaleBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idleScaleTickEnd: {
    width: 1,
    height: 6,
    backgroundColor: paper.dashboardInk,
  },
  idleScaleTickMid: {
    width: 1,
    height: 3,
    backgroundColor: paper.dashboardInk,
    opacity: 0.7,
  },
  idleScaleBarSegment: {
    width: 18,
    height: 1,
    backgroundColor: paper.dashboardInk,
  },
  idleScaleLabel: {
    fontFamily: MONO_BOLD,
    fontSize: 6.2,
    letterSpacing: 1,
    color: paper.dashboardInk,
    lineHeight: 8,
  },

  // Meta ribbon — acres · structures · season.
  idleMetaRibbon: {
    marginTop: 6,
    gap: 3,
  },
  idleMetaRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
  },
  idleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 5,
    paddingVertical: 3,
  },
  idleMetaText: {
    fontFamily: MONO_BOLD,
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
    lineHeight: 10,
  },
  idleMetaDivider: {
    fontFamily: SANS,
    fontSize: 8,
    color: paper.dashboardMuted,
    lineHeight: 10,
  },

  // CTA below — pointer back to the search.
  idleCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingTop: 4,
    paddingHorizontal: 2,
  },
  idleCtaText: {
    flex: 1,
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 1.4,
    color: paper.dashboardBlue,
    lineHeight: 13,
  },

  // Limited / review notes under the map
  limitedNotesStack: { gap: paperSpacing.xs },
  limitedNote: {
    fontFamily: SANS_MEDIUM,
    fontSize: 12,
    lineHeight: 17,
    color: '#555555',
  },

  // Guardrails card
  guardrailCard: {
    overflow: 'hidden',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    gap: 10,
  },
  guardrailEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 3,
    color: paper.dashboardBlue,
  },
  guardrailHeadline: {
    fontFamily: SERIF_SEMI,
    fontSize: 18,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  guardrailBody: {
    fontFamily: SANS_MEDIUM,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#555555',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: paperSpacing.sm,
    paddingTop: paperSpacing.md,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  footerLeft: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.5,
    color: paper.dashboardMuted,
  },
  footerRight: {
    flexShrink: 1,
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.3,
    color: paper.dashboardMuted,
    textAlign: 'right',
    lineHeight: 14,
  },

  // State picker modal
  modalRoot: { flex: 1, backgroundColor: paper.dashboardCream },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.16)',
    backgroundColor: paper.dashboardInk,
  },
  modalHeaderLeft: { flex: 1, minWidth: 0, gap: 1 },
  modalEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.8,
    color: 'rgba(255,255,255,0.62)',
  },
  modalTitle: {
    fontFamily: SERIF_BOLD,
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: 0,
    lineHeight: 30,
  },
  modalDoneBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDoneBtnPressed: { opacity: 0.85 },
  modalListContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 44,
  },
  modalRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  modalRowActive: {
    backgroundColor: '#E8F2FA',
    borderColor: 'rgba(42,110,150,0.45)',
  },
  modalRowPressed: {
    opacity: 0.82,
  },
  modalRowName: {
    flex: 1,
    minWidth: 0,
    fontFamily: SERIF_SEMI,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  modalRowNameActive: { color: paper.dashboardInk },
  modalRowCode: {
    fontFamily: MONO_BOLD,
    fontSize: 11,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
    marginLeft: paperSpacing.md,
  },
  modalRowCodeActive: { color: paper.dashboardInk },
});
