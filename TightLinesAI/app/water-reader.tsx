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

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  paper,
  paperBorders,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';
import { fetchWaterReaderRead, searchWaterbodies } from '../lib/waterReader';
import {
  CornerMarkSet,
  PaperBackground,
  SectionEyebrow,
  TopographicLines,
} from '../components/paper';
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
const SEARCH_RESULT_LIMIT = 16;

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
  if (m.includes('not signed in') || m.includes('sign in')) return 'Sign in to load the Water Reader map.';
  if (m.includes('subscribe') || m.includes('subscription')) return 'An active subscription is required to load Water Reader.';
  if (m.includes('unauthorized') || surface === 'Unauthorized') return 'Session invalid. Sign in again.';
  if (m.includes('network') || m.includes('fetch') || m.includes('network request failed')) {
    return 'Network error loading Water Reader. Try again.';
  }
  if (m.includes('not_found') || surface.toLowerCase().includes('not found')) return 'This waterbody was not found.';
  if (m.includes('water_reader_read_failed') || m.includes('polygon_fetch_failed') || m.includes('500')) {
    return 'Water Reader could not complete a trustworthy polygon read for this waterbody.';
  }
  return surface.length < 200 ? surface : 'Could not load Water Reader.';
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
      return { bg: paper.forest, fg: paper.paper, border: paper.ink };
    case 'limited':
      return { bg: paper.paperLight, fg: paper.goldDk, border: paper.goldDk };
    case 'needs_review':
      return { bg: paper.paperLight, fg: paper.rust, border: paper.rust };
    case 'not_supported':
    default:
      return { bg: paper.paperLight, fg: paper.ink, border: paper.inkHair };
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

  const [stateCode, setStateCode] = useState<string | null>(null);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [results, setResults] = useState<WaterbodySearchResult[]>([]);
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
        setSearchEmpty(res.results.length === 0);
      } catch (e) {
        if (searchRequestId.current !== requestId) return;
        setSearchError(userFacingSearchError(e));
        setResults([]);
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

  const onChangeState = useCallback(() => {
    setStateCode(null);
    setQuery('');
    setResults([]);
    setSearchError(null);
    setSearchEmpty(false);
    setSearchExpanded(false);
    setStateModalOpen(true);
  }, []);

  const onChangeLake = useCallback(() => {
    setSelected(null);
    setQuery('');
  }, []);

  const showResultsPanel =
    !selected && stateCode && (query.trim().length >= SEARCH_MIN_CHARS || searching || (searchError != null && query.trim().length >= SEARCH_MIN_CHARS));

  const stateNameForEmpty =
    (stateCode && US_STATE_OPTIONS.find((o) => o.code === stateCode)?.name) || 'this state';

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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.pageBg}>
        {/* ── Custom paper nav header (mirrors Recommender shell) ── */}
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
            <Ionicons name="chevron-back" size={14} color={paper.ink} />
            <Text style={styles.navBackBtnText}>BACK</Text>
          </Pressable>

          <View style={styles.navTitleWrap} pointerEvents="none">
            <Text style={styles.navEyebrow}>FINFINDR</Text>
            <Text style={styles.navTitle} numberOfLines={1}>
              WATER READER
            </Text>
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
                <Ionicons name="location" size={10} color={paper.ink} />
                <Text style={styles.navStatePillText}>{stateCode}</Text>
              </Pressable>
            ) : (
              <View style={styles.navStateSpacer} />
            )}
          </View>
        </View>

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
              <SectionEyebrow size={10} tracking={3.5}>
                READ THE WATER
              </SectionEyebrow>
              <Text style={styles.heroHeadline} allowFontScaling={false}>
                Find the structure{'\n'}
                <Text style={styles.heroHeadlineAccent}>before you cast.</Text>
              </Text>
              <Text style={styles.heroSubline}>
                Pull a public-domain hydrography polygon for any supported lake
                and read its deterministic structure areas.
              </Text>
            </View>

            {/* ── Search console card ── */}
            <View style={styles.searchCard}>
              <TopographicLines
                style={StyleSheet.absoluteFill}
                color={paper.forestDk}
                count={4}
              />
              <CornerMarkSet color={paper.red} inset={10} size={12} />

              <Text style={styles.searchCardEyebrow}>STEP 1 · STATE</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.stateButton,
                  pressed && styles.stateButtonPressed,
                ]}
                onPress={() => setStateModalOpen(true)}
                accessibilityLabel="Select U.S. state"
              >
                <Ionicons name="location-outline" size={14} color={paper.ink} />
                <Text
                  style={[
                    styles.stateButtonText,
                    !stateCode && styles.stateButtonTextEmpty,
                  ]}
                  numberOfLines={1}
                >
                  {stateDisplayLabel(stateCode)}
                </Text>
                <Ionicons name="chevron-down" size={12} color={paper.ink} />
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
                    <Ionicons name="search" size={14} color={paper.ink} />
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
                          color={paper.inkHair}
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
                        color={paper.forest}
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
                        color={paper.red}
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
                        color={paper.ink}
                      />
                      <Text style={styles.dropdownEmptyText}>
                        No matching lakes in {stateNameForEmpty}. Try another
                        spelling.
                      </Text>
                    </View>
                  )}
                  {!searching && results.length > 0 && (
                    <View style={styles.dropdownList}>
                      {results.map((r, idx) => {
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
                                  Water Reader read not available for this row.
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
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* ── Map + legend ── */}
            {!selected ? (
              <View style={styles.idleCard}>
                <CornerMarkSet color={paper.walnut} inset={10} size={12} />
                <View style={styles.idleBadge}>
                  <Ionicons
                    name="scan-outline"
                    size={20}
                    color={paper.paper}
                  />
                </View>
                <SectionEyebrow
                  color={paper.red}
                  size={10}
                  tracking={3}
                  align="left"
                  dashes={false}
                >
                  POLYGON STRUCTURE READ
                </SectionEyebrow>
                <Text style={styles.idleHeadline}>
                  Choose a lake to see its read.
                </Text>
                <Text style={styles.idleBody}>
                  Water Reader pulls the actual hydrography outline and marks
                  the structure areas — points, coves, necks, islands — that
                  matter for the season. No GPS, no exact spots, no promises.
                </Text>
              </View>
            ) : (
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
            )}

            {/* ── Guardrails ── */}
            <View style={styles.guardrailCard}>
              <TopographicLines
                style={StyleSheet.absoluteFill}
                color={paper.walnut}
                count={5}
              />
              <CornerMarkSet color={paper.walnut} inset={10} size={12} />
              <SectionEyebrow
                color={paper.red}
                size={10}
                tracking={3}
                align="left"
                dashes={false}
              >
                GUARDRAILS
              </SectionEyebrow>
              <Text style={styles.guardrailHeadline}>
                Read it like a guide&apos;s scribble — not a treasure map.
              </Text>
              <Text style={styles.guardrailBody}>
                Zones are computed from polygon geometry alone. State and date
                only shape the seasonal guidance in the legend. Water Reader
                does not use photos, depth, species, weather, your position,
                or exact coordinates.
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
      </PaperBackground>

      {/* ── State picker modal ── */}
      <Modal
        visible={stateModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setStateModalOpen(false)}
      >
        <PaperBackground style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Text style={styles.modalEyebrow}>FINFINDR</Text>
              <Text style={styles.modalTitle}>CHOOSE A STATE</Text>
            </View>
            <Pressable
              onPress={() => setStateModalOpen(false)}
              style={({ pressed }) => [
                styles.modalDoneBtn,
                pressed && styles.modalDoneBtnPressed,
              ]}
              hitSlop={8}
            >
              <Text style={styles.modalDoneText}>DONE</Text>
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
        </PaperBackground>
      </Modal>
    </SafeAreaView>
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

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  pageBg: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xxl,
    // Top-level vertical gap between major Water Reader sections (hero,
    // search console, selected lake summary, map card, legend, guardrails).
    // Bumped from `lg` (was 20, now 24) to `section` (32) in the May 2026
    // spacing pass so each card reads as a clearly separated beat instead
    // of a tightly stacked column.
    gap: paperSpacing.section,
  },

  // Custom paper nav header
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
    backgroundColor: paper.paper,
    borderBottomWidth: 1,
    borderBottomColor: paper.inkHairSoft,
  },
  navBackBtn: {
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
  navBackBtnPressed: { opacity: 0.7 },
  navBackBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
  navTitleWrap: {
    position: 'absolute',
    left: 96,
    right: 96,
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
    letterSpacing: 0,
    marginTop: 1,
    fontWeight: '700',
  },
  navRight: {
    minWidth: 62,
    alignItems: 'flex-end',
  },
  navStateSpacer: { width: 62, height: 1 },
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
  navStatePillPressed: { opacity: 0.7 },
  navStatePillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    letterSpacing: 1.6,
    fontWeight: '700',
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: paperSpacing.sm,
    gap: 10,
  },
  heroHeadline: {
    fontFamily: paperFonts.display,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: 0,
    color: paper.ink,
    textAlign: 'center',
  },
  heroHeadlineAccent: {
    color: paper.forest,
  },
  heroSubline: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
    color: paper.ink,
    opacity: 0.72,
    textAlign: 'center',
    maxWidth: 320,
  },

  // Search card
  searchCard: {
    overflow: 'hidden',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperBorders.card,
    ...paperShadows.hard,
    gap: paperSpacing.sm,
  },
  searchCardEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.6,
    color: paper.red,
    fontWeight: '700',
  },
  searchCardEyebrowStep: {
    marginTop: paperSpacing.sm + 2,
  },
  stateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    minHeight: 48,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
    borderRadius: paperRadius.chip,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paper,
  },
  stateButtonPressed: { transform: [{ translateY: 1 }] },
  stateButtonText: {
    flex: 1,
    minWidth: 0,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.ink,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
  stateButtonTextEmpty: {
    opacity: 0.55,
  },
  searchHint: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.6,
    lineHeight: 17,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    minHeight: 48,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
    borderRadius: paperRadius.chip,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paper,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 14.5,
    color: paper.ink,
    paddingVertical: 0,
  },
  clearBtn: { padding: 2 },

  // Inline selected row
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.sm + 2,
    paddingTop: paperSpacing.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.inkHair,
    flexWrap: 'wrap',
  },
  selectedTextStack: { flex: 1, minWidth: 0, gap: 3 },
  selectedTitle: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: paper.ink,
    letterSpacing: 0,
  },
  selectedContext: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.7,
    lineHeight: 16,
  },
  selectedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  linkBtn: { paddingVertical: 2 },
  linkBtnPressed: { opacity: 0.6 },
  linkBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: paper.forest,
    fontWeight: '700',
    lineHeight: 13,
  },
  linkSep: { color: paper.inkHair, fontSize: 11 },

  // Dropdown
  dropdown: {
    marginTop: paperSpacing.sm + 2,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paper,
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
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: paper.ink,
    opacity: 0.7,
    lineHeight: 14,
  },
  dropdownErrorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
    backgroundColor: paper.paperLight,
  },
  dropdownErrorText: {
    flex: 1,
    minWidth: 0,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: paper.red,
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
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: paper.ink,
    opacity: 0.7,
  },
  dropdownList: { maxHeight: 320 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
    backgroundColor: paper.paper,
  },
  resultRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.inkHair,
  },
  resultRowDisabled: { opacity: 0.5 },
  resultRowPressed: { backgroundColor: paper.paperLight },
  resultRowMain: { flex: 1, minWidth: 0, gap: 3 },
  resultPrimary: {
    fontFamily: paperFonts.display,
    fontSize: 14.5,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 18,
  },
  resultSecondary: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10.5,
    letterSpacing: 0.6,
    color: paper.ink,
    opacity: 0.62,
    lineHeight: 14,
  },
  resultAmbiguity: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    color: paper.goldDk,
    marginTop: 2,
  },
  resultBlocked: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    lineHeight: 14,
    color: paper.ink,
    opacity: 0.55,
    marginTop: 2,
  },

  // Support pill
  supportPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: paperRadius.chip,
    borderWidth: 1.5,
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
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 12,
  },
  supportPillTextCompact: {
    fontSize: 8.5,
    letterSpacing: 1.4,
  },

  // Idle state card (no lake selected)
  idleCard: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    ...paperBorders.card,
    ...paperShadows.hard,
    gap: paperSpacing.sm,
  },
  idleBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: paper.walnut,
    borderWidth: 1.5,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...paperShadows.hard,
    marginBottom: paperSpacing.xs,
  },
  idleHeadline: {
    fontFamily: paperFonts.display,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0,
    color: paper.ink,
  },
  idleBody: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: paper.ink,
    opacity: 0.78,
  },

  // Limited / review notes under the map
  limitedNotesStack: { gap: paperSpacing.xs },
  limitedNote: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 17,
    color: paper.ink,
    opacity: 0.7,
  },

  // Guardrails card
  guardrailCard: {
    overflow: 'hidden',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    ...paperBorders.card,
    ...paperShadows.hard,
    gap: paperSpacing.sm,
  },
  guardrailHeadline: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    lineHeight: 22,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: 0,
  },
  guardrailBody: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.ink,
    opacity: 0.78,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: paperSpacing.sm,
    paddingTop: paperSpacing.md,
    borderTopWidth: 1.5,
    borderTopColor: paper.ink,
  },
  footerLeft: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.5,
    color: paper.ink,
    opacity: 0.55,
  },
  footerRight: {
    flexShrink: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.55,
    textAlign: 'right',
    lineHeight: 14,
  },

  // State picker modal
  modalRoot: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md,
    borderBottomWidth: 1.5,
    borderBottomColor: paper.ink,
    backgroundColor: paper.paper,
  },
  modalHeaderLeft: { flex: 1, minWidth: 0, gap: 1 },
  modalEyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2.6,
    color: paper.red,
    fontWeight: '700',
  },
  modalTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: paper.ink,
    letterSpacing: 0,
    fontWeight: '700',
  },
  modalDoneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.forest,
  },
  modalDoneBtnPressed: { opacity: 0.85 },
  modalDoneText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.paper,
    fontWeight: '700',
  },
  modalListContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.xxl,
  },
  modalRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
    borderRadius: paperRadius.card,
    marginBottom: 2,
  },
  modalRowActive: {
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  modalRowPressed: {
    backgroundColor: paper.paperLight,
  },
  modalRowName: {
    flex: 1,
    minWidth: 0,
    fontFamily: paperFonts.display,
    fontSize: 16,
    color: paper.ink,
    letterSpacing: 0,
  },
  modalRowNameActive: { fontWeight: '700' },
  modalRowCode: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: paper.ink,
    opacity: 0.6,
    marginLeft: paperSpacing.md,
  },
  modalRowCodeActive: { color: paper.forest, opacity: 1 },
});
