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
import { colors, fonts, radius, spacing } from '../lib/theme';
import { fetchWaterReaderRead, searchWaterbodies } from '../lib/waterReader';
import { WaterReaderProductionMap } from '../components/water-reader/WaterReaderProductionMap';
import type {
  WaterbodySearchResult,
  WaterReaderEngineSupportStatus,
  WaterReaderPolygonSupportStatus,
  WaterReaderReadResponse,
} from '../lib/waterReaderContracts';

const SEARCH_DEBOUNCE_MS = 400;
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
  if (!code) return 'Choose a state';
  const row = US_STATE_OPTIONS.find((o) => o.code === code);
  return row ? `${row.name} (${row.code})` : code;
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
  return r.waterReaderSupportStatus === 'supported' || r.waterReaderSupportStatus === 'limited';
}

function supportChipLabel(status: WaterReaderPolygonSupportStatus): string {
  switch (status) {
    case 'supported':
      return 'Supported';
    case 'limited':
      return 'Limited';
    case 'needs_review':
      return 'Needs review';
    case 'not_supported':
      return 'Not supported';
    default:
      return 'Unknown';
  }
}

function supportChipStyle(status: WaterReaderPolygonSupportStatus) {
  switch (status) {
    case 'supported':
      return styles.chipSupported;
    case 'limited':
      return styles.chipLimited;
    case 'needs_review':
      return styles.chipReview;
    case 'not_supported':
    default:
      return styles.chipBlocked;
  }
}

function resultPrimaryLine(r: WaterbodySearchResult): string {
  const county = r.county ? ` - ${r.county} County` : '';
  return `${r.name}${county} · ${r.waterbodyType}`;
}

function resultSecondaryLine(r: WaterbodySearchResult): string {
  const acres =
    typeof r.polygonAreaAcres === 'number'
      ? ` · ${Math.round(r.polygonAreaAcres).toLocaleString()} poly acres`
      : typeof r.surfaceAreaAcres === 'number'
        ? ` · ${Math.round(r.surfaceAreaAcres).toLocaleString()} acres (index)`
        : '';
  return `${r.state}${acres}`;
}

function selectionSummaryLine(r: WaterbodySearchResult): string {
  const county = r.county ? ` · ${r.county} County` : '';
  return `${r.name}${county} · ${r.state} · ${r.waterbodyType}`;
}

function limitedReadNote(
  status: WaterReaderPolygonSupportStatus | WaterReaderEngineSupportStatus,
  reason?: string,
): string | null {
  if (status === 'limited') {
    return reason
      ? `Limited read: ${reason}`
      : 'Limited read: the polygon supports a conservative map, but some geometry quality checks are constrained.';
  }
  if (status === 'needs_review') {
    return reason
      ? `Review-needed read: ${reason}`
      : 'Review-needed read: the polygon can render, but its geometry should be reviewed before treating every structure label as app-ready.';
  }
  return null;
}

type WaterReaderReadState =
  | { status: 'idle'; read: null; errorMessage: null }
  | { status: 'reading'; read: null; errorMessage: null }
  | { status: 'ready'; read: WaterReaderReadResponse; errorMessage: null }
  | { status: 'error'; read: null; errorMessage: string };

export default function WaterReaderScreen() {
  const [stateCode, setStateCode] = useState<string | null>(null);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
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
      if (!stateCode || q.length < 2) {
        setResults([]);
        setSearchEmpty(false);
        setSearchError(null);
        setSearching(false);
        return;
      }
      setSearching(true);
      setSearchError(null);
      setSearchEmpty(false);
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
        if (searchRequestId.current === requestId) setSearching(false);
      }
    },
    [query, stateCode],
  );

  useEffect(() => {
    const q = query.trim();
    if (!stateCode || q.length < 2) {
      setResults([]);
      setSearchError(null);
      setSearchEmpty(false);
      setSearching(false);
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
    setStateModalOpen(true);
  }, []);

  const showResultsPanel =
    !selected && stateCode && (query.trim().length >= 2 || searching || (searchError != null && query.trim().length >= 2));
  const stateNameForEmpty =
    (stateCode && US_STATE_OPTIONS.find((o) => o.code === stateCode)?.name) || 'this state';

  const engineRead = readState.status === 'ready' ? readState.read : null;
  const polygonLimitedNote =
    engineRead ? limitedReadNote(engineRead.waterReaderSupportStatus, engineRead.waterReaderSupportReason) : null;
  const engineLimitedNote =
    engineRead ? limitedReadNote(engineRead.engineSupportStatus, engineRead.engineSupportReason) : null;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.disclaimer}>
          Water Reader uses public-domain hydrography polygons, state, and date to place deterministic seasonal
          structure zones. It does not use photos, depth, species, weather, exact locations, or promise results.
        </Text>

        <Text style={styles.section}>Find a waterbody</Text>

        <View style={styles.combobox}>
          <Text style={styles.inputLabel}>State</Text>
          <Pressable
            style={({ pressed }) => [styles.stateButton, pressed && styles.pressed]}
            onPress={() => setStateModalOpen(true)}
            accessibilityLabel="Select U.S. state"
          >
            <Text style={styles.stateButtonText} numberOfLines={1}>
              {stateDisplayLabel(stateCode)}
            </Text>
            <Text style={styles.stateChevron}>˅</Text>
          </Pressable>

          {!stateCode && <Text style={styles.calmHint}>Choose a state to start.</Text>}

          {stateCode && (
            <>
              <Text style={styles.inputLabel}>Lake, pond, or reservoir</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Name (2+ characters)..."
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                autoCapitalize="words"
                accessibilityLabel="Waterbody name search"
                editable={!selected}
                pointerEvents={selected ? 'none' : 'auto'}
              />
            </>
          )}

          {stateCode && selected && (
            <View style={styles.selectedSummary}>
              <View style={styles.selectedSummaryText}>
                <Text style={styles.selectedTitle} numberOfLines={2}>
                  {selectionSummaryLine(selected)}
                </Text>
                <Text style={styles.selectedSub} numberOfLines={2}>
                  {resultSecondaryLine(selected)}
                </Text>
                <View style={[styles.supportChip, supportChipStyle(selected.waterReaderSupportStatus), styles.selectedChip]}>
                  <Text style={styles.supportChipText}>{supportChipLabel(selected.waterReaderSupportStatus)}</Text>
                </View>
                <Text style={styles.selectedReason} numberOfLines={3}>
                  {selected.waterReaderSupportReason}
                </Text>
                <View style={styles.selectedActions}>
                  <Pressable onPress={onChangeState} style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}>
                    <Text style={styles.linkBtnText}>Change state</Text>
                  </Pressable>
                  <Text style={styles.actionSep}>·</Text>
                  <Pressable onPress={() => setSelected(null)} style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}>
                    <Text style={styles.linkBtnText}>Change lake</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {showResultsPanel && (
            <View style={styles.dropdown}>
              {searching && (
                <View style={styles.inlineLoading}>
                  <ActivityIndicator size="small" color={colors.sage} />
                  <Text style={styles.searchingText}>Searching...</Text>
                </View>
              )}
              {searchError && <Text style={styles.dropdownError}>{searchError}</Text>}
              {searchEmpty && !searchError && !searching && (
                <Text style={styles.dropdownEmpty}>{`No matching lakes in ${stateNameForEmpty}. Try another spelling.`}</Text>
              )}
              {!searching && results.length > 0 && (
                <ScrollView style={styles.dropdownList} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                  {results.map((r) => {
                    const open = canOpenWaterReaderRead(r);
                    return (
                      <Pressable
                        key={r.lakeId}
                        style={({ pressed }) => [
                          styles.resultRow,
                          !open && styles.resultRowDisabled,
                          pressed && open && styles.pressed,
                        ]}
                        onPress={() => {
                          if (canOpenWaterReaderRead(r)) setSelected(r);
                        }}
                      >
                        <View style={styles.resultRowTop}>
                          <Text style={[styles.resultLine, styles.resultLineFlex]} numberOfLines={2}>
                            {resultPrimaryLine(r)}
                          </Text>
                          <View style={[styles.supportChip, supportChipStyle(r.waterReaderSupportStatus)]}>
                            <Text style={styles.supportChipText}>{supportChipLabel(r.waterReaderSupportStatus)}</Text>
                          </View>
                        </View>
                        <Text style={styles.resultMeta} numberOfLines={2}>
                          {resultSecondaryLine(r)}
                        </Text>
                        {!open && (
                          <Text style={styles.resultBlockedHint} numberOfLines={2}>
                            Water Reader read not available for this row.
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.section}>Vector lake map</Text>
          {!selected && (
            <Text style={styles.muted}>
              Select a supported or limited waterbody to see a polygon-only seasonal structure map from public
              hydrography geometry.
            </Text>
          )}
          {selected && (
            <View style={styles.placeholderCard}>
              {readState.status === 'reading' && (
                <View style={styles.inlineLoading}>
                  <ActivityIndicator size="small" color={colors.sage} />
                  <Text style={styles.placeholderCopy}>Reading polygon geometry…</Text>
                </View>
              )}
              {readState.status === 'error' && (
                <>
                  <Text style={styles.placeholderTitle}>No map drawn</Text>
                  <Text style={styles.polygonErrorText}>{readState.errorMessage}</Text>
                </>
              )}
              {readState.status === 'ready' && (
                <>
                  {readState.read.productionSvgResult ? (
                    <WaterReaderProductionMap result={readState.read.productionSvgResult} />
                  ) : (
                    <View style={styles.engineFallback}>
                      <Text style={styles.placeholderTitle}>No map drawn</Text>
                      <Text style={styles.placeholderCopy}>
                        {readState.read.fallbackMessage ?? 'Water Reader could not build a polygon geometry read for this waterbody.'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.mapMetaRow}>
                    <View style={[styles.supportChip, supportChipStyle(readState.read.waterReaderSupportStatus)]}>
                      <Text style={styles.supportChipText}>
                        {supportChipLabel(readState.read.waterReaderSupportStatus)}
                      </Text>
                    </View>
                    <Text style={styles.mapMetaAcres}>
                      {typeof readState.read.areaAcres === 'number'
                        ? `~${Math.round(readState.read.areaAcres).toLocaleString()} acres (hydrography)`
                        : '—'}
                    </Text>
                  </View>
                  <Text style={styles.placeholderCopy}>
                    Zones are computed from polygon geometry in lake-space meters and clipped to the hydrography outline.
                    State and date select deterministic seasonal structure rules.
                  </Text>
                  {polygonLimitedNote && (
                    <Text style={styles.geometryLimitedNote}>
                      {polygonLimitedNote}
                    </Text>
                  )}
                  {engineLimitedNote && engineLimitedNote !== polygonLimitedNote && (
                    <Text style={styles.geometryLimitedNote}>
                      {engineLimitedNote}
                    </Text>
                  )}
                  {engineRead && engineRead.productionSvgResult && (
                    <Text style={styles.zoneSizingHint}>
                      {`${engineRead.displayedEntryCount} displayed structure ${engineRead.displayedEntryCount === 1 ? 'entry' : 'entries'} · ${engineRead.season}${engineRead.retainedEntryCount > 0 ? ` · ${engineRead.retainedEntryCount} retained off-map by display cap` : ''}${engineRead.rendererWarningCount > 0 ? ` · ${engineRead.rendererWarningCount} renderer warning${engineRead.rendererWarningCount === 1 ? '' : 's'}` : ''}`}
                    </Text>
                  )}
                </>
              )}
            </View>
          )}
        </View>

        {selected && (
          <View style={styles.limitsSection}>
            <Text style={styles.section}>Water Reader guardrails</Text>
            <Text style={styles.limitCopy}>
              This version stays on hydrography polygon geometry, state, and date. It does not use photos, depth,
              species, weather, user position, or exact coordinates. Read zones as educational structure references,
              not precise positions or promises.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={stateModalOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setStateModalOpen(false)}>
        <View style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose a state</Text>
            <Pressable onPress={() => setStateModalOpen(false)} style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.stateList}>
            {US_STATE_OPTIONS.map((option) => {
              const active = option.code === stateCode;
              return (
                <Pressable
                  key={option.code}
                  style={({ pressed }) => [styles.stateRow, active && styles.stateRowActive, pressed && styles.pressed]}
                  onPress={() => {
                    setStateCode(option.code);
                    setStateModalOpen(false);
                  }}
                >
                  <Text style={[styles.stateRowText, active && styles.stateRowTextActive]}>{option.name}</Text>
                  <Text style={[styles.stateRowCode, active && styles.stateRowTextActive]}>{option.code}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  disclaimer: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  section: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  combobox: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    zIndex: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  stateButton: {
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  stateButtonText: { color: colors.text, fontWeight: '700', flex: 1 },
  stateChevron: { color: colors.textSecondary, marginLeft: spacing.sm },
  calmHint: { marginTop: spacing.sm, color: colors.textSecondary, fontSize: 13 },
  searchInput: {
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.background,
  },
  selectedSummary: {
    marginTop: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
  },
  selectedSummaryText: { flex: 1 },
  selectedTitle: { color: colors.text, fontWeight: '800', fontSize: 15 },
  selectedSub: { color: colors.textSecondary, marginTop: 4, fontSize: 13 },
  selectedChip: { alignSelf: 'flex-start', marginTop: spacing.sm },
  selectedReason: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs, lineHeight: 16 },
  selectedActions: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  linkBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  linkBtnText: { color: colors.sage, fontWeight: '800' },
  actionSep: { marginHorizontal: spacing.sm, color: colors.textMuted },
  dropdown: {
    marginTop: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  dropdownList: { maxHeight: 260 },
  resultRowTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  resultLineFlex: { flex: 1, minWidth: 0 },
  resultRowDisabled: { opacity: 0.55 },
  resultBlockedHint: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  supportChip: {
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  supportChipText: { fontSize: 11, fontWeight: '800' },
  chipSupported: { backgroundColor: colors.surface, borderColor: colors.sage },
  chipLimited: { backgroundColor: colors.surface, borderColor: colors.textSecondary },
  chipReview: { backgroundColor: colors.surface, borderColor: '#b8860b' },
  chipBlocked: { backgroundColor: colors.backgroundAlt, borderColor: colors.border },
  resultRow: { padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  resultLine: { color: colors.text, fontWeight: '800' },
  resultMeta: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
  inlineLoading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  searchingText: { color: colors.textSecondary },
  dropdownError: { color: colors.reportScoreRed, padding: spacing.md },
  dropdownEmpty: { color: colors.textSecondary, padding: spacing.md },
  mapSection: { marginTop: spacing.lg },
  muted: { color: colors.textSecondary, lineHeight: 20 },
  placeholderCard: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  engineFallback: {
    minHeight: 180,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    justifyContent: 'center',
  },
  placeholderTitle: { fontFamily: fonts.serif, fontSize: 16, color: colors.text },
  placeholderCopy: { marginTop: spacing.xs, color: colors.textSecondary, lineHeight: 20 },
  zoneSizingHint: { marginTop: spacing.xs, color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  polygonErrorText: { marginTop: spacing.sm, color: colors.reportScoreRed, lineHeight: 20 },
  mapMetaRow: {
    marginTop: spacing.md,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  mapMetaAcres: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
    alignSelf: 'stretch',
  },
  geometryLimitedNote: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  limitsSection: { marginTop: spacing.lg },
  limitCopy: { color: colors.textSecondary, lineHeight: 20 },
  modalRoot: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.text },
  doneBtn: { padding: spacing.sm },
  doneText: { color: colors.sage, fontWeight: '800' },
  stateList: { padding: spacing.md },
  stateRow: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateRowActive: { backgroundColor: colors.surface },
  stateRowText: { color: colors.text, fontSize: 16 },
  stateRowCode: { color: colors.textSecondary, fontWeight: '800' },
  stateRowTextActive: { color: colors.sage },
  pressed: { opacity: 0.65 },
});
