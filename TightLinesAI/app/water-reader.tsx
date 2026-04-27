import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { colors, fonts, spacing, radius } from '../lib/theme';
import { searchWaterbodies } from '../lib/waterReader';
import type { WaterbodySearchResult } from '../lib/waterReaderContracts';
import {
  buildNaipPlusExportImageUrl,
  isValidWgs84Bbox,
  isValidWgs84Centroid,
  normalizeUsWaterbodyStateCode,
  stateExcludedFromConusAerial,
  USGS_TNM_ATTRIBUTION,
  wgs84BboxFromCentroidAcres,
} from '../lib/usgsTnmAerialSnapshot';

const SNAPSHOT_TIMEOUT_MS = 28_000;
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

type AerialPhase = 'idle' | 'loading' | 'loaded' | 'timeout' | 'error' | 'blocked';

function formatAvailability(r: WaterbodySearchResult): string {
  const parts: string[] = [];
  if (r.aerialAvailable) parts.push('aerial');
  if (r.depthAvailable) parts.push('depth');
  if (parts.length === 0) return 'limited / none';
  return parts.join(' + ');
}

function parseEdgeErrorMessage(raw: string): { surface: string; details?: string } {
  if (raw.includes('|details:')) {
    const [a, b] = raw.split('|details:');
    return { surface: a, details: b };
  }
  return { surface: raw };
}

function userFacingSearchError(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  const { surface, details = '' } = parseEdgeErrorMessage(raw);
  const m = (surface + ' ' + details).toLowerCase();
  if (m.includes('not signed in') || m.includes('sign in')) {
    return 'Sign in to search waterbodies.';
  }
  if (m.includes('subscribe') || m.includes('subscription')) {
    return 'Waterbody search requires an active subscription.';
  }
  if (m.includes('unauthorized') || surface === 'Unauthorized') {
    return 'Session invalid. Sign in again to search.';
  }
  if (m.includes('network') || m.includes('fetch') || m.includes('network request failed')) {
    return 'Network error. Check connection and try again.';
  }
  if (
    details.includes('statement timeout') ||
    details.includes('canceling statement') ||
    m.includes('57014')
  ) {
    return 'Search timed out. Try a more specific name.';
  }
  if (
    surface.toLowerCase().includes('failed to search waterbodies') ||
    m.includes('search_failed') ||
    m.includes('500')
  ) {
    if (details && !details.toLowerCase().includes('timeout')) {
      return `Search failed (${details.length > 120 ? 'try again' : details})`;
    }
    return "We couldn't run that search. Please try again.";
  }
  return surface.length < 200 ? surface : "We couldn't run that search.";
}

function resultPrimaryLine(r: WaterbodySearchResult): string {
  const co = r.county ? ` — ${r.county} County` : '';
  return `${r.name}${co} · ${r.waterbodyType}`;
}

function resultSecondaryLine(r: WaterbodySearchResult): string {
  return `${formatAvailability(r)} · ${r.sourceStatus} · ${r.availability}`;
}

function selectionSummaryLine(r: WaterbodySearchResult): string {
  const co = r.county ? ` · ${r.county} County` : '';
  return `${r.name}${co} · ${r.state} · ${r.waterbodyType}`;
}

function selectionSubLine(r: WaterbodySearchResult): string {
  return resultSecondaryLine(r);
}

export default function WaterReaderScreen() {
  const [stateCode, setStateCode] = useState<string | null>(null);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [results, setResults] = useState<WaterbodySearchResult[]>([]);
  const [selected, setSelected] = useState<WaterbodySearchResult | null>(null);

  const [aerialPhase, setAerialPhase] = useState<AerialPhase>('idle');
  const [aerialLoad, setAerialLoad] = useState<{ gen: number; uri: string } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadGenerationRef = useRef(0);
  const searchRequestId = useRef(0);

  const clearSnapshotTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(
    () => () => {
      clearSnapshotTimer();
    },
    [],
  );

  useEffect(() => {
    setSelected(null);
  }, [stateCode]);

  const onQueryChange = useCallback((t: string) => {
    setQuery(t);
  }, []);

  const runSearch = useCallback(
    async (requestId: number) => {
      const q = query.trim();
      if (!stateCode) {
        setResults([]);
        setSearchEmpty(false);
        setSearchError(null);
        setSearching(false);
        return;
      }
      if (q.length < 2) {
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
        const res = await searchWaterbodies({
          query: q,
          state: stateCode,
          limit: SEARCH_RESULT_LIMIT,
        });
        if (searchRequestId.current !== requestId) return;
        setResults(res.results);
        setSearchEmpty(res.results.length === 0);
        if (res.results.length === 0) {
          setSearchError(null);
        }
      } catch (e) {
        if (searchRequestId.current !== requestId) return;
        setSearchError(userFacingSearchError(e));
        setResults([]);
        setSearchEmpty(false);
      } finally {
        if (searchRequestId.current === requestId) {
          setSearching(false);
        }
      }
    },
    [query, stateCode],
  );

  useEffect(() => {
    if (!stateCode) {
      setResults([]);
      setSearchError(null);
      setSearchEmpty(false);
      setSearching(false);
      return;
    }
    const q = query.trim();
    if (q.length < 2) {
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

  const onPickResult = useCallback((r: WaterbodySearchResult) => {
    setSelected(r);
  }, []);

  const onChangeState = useCallback(() => {
    setStateCode(null);
    setQuery('');
    setResults([]);
    setSearchError(null);
    setSearchEmpty(false);
    setStateModalOpen(true);
  }, []);

  const onChangeLake = useCallback(() => {
    setSelected(null);
  }, []);

  useEffect(() => {
    loadGenerationRef.current += 1;
    clearSnapshotTimer();
    setAerialPhase('idle');
    setAerialLoad(null);

    const onSnapshotCleanup = () => {
      clearSnapshotTimer();
      loadGenerationRef.current += 1;
    };

    if (!selected) {
      return onSnapshotCleanup;
    }

    const lat = selected.centroid?.lat;
    const lon = selected.centroid?.lon;
    const st = normalizeUsWaterbodyStateCode(String(selected.state ?? ''));

    const eligible =
      selected.aerialAvailable === true &&
      st != null &&
      !stateExcludedFromConusAerial(st) &&
      isValidWgs84Centroid(typeof lat === 'number' ? lat : NaN, typeof lon === 'number' ? lon : NaN);

    if (!eligible) {
      setAerialPhase('blocked');
      return onSnapshotCleanup;
    }

    const bbox = wgs84BboxFromCentroidAcres(
      lat!,
      lon!,
      selected.surfaceAreaAcres ?? undefined,
    );
    if (!isValidWgs84Bbox(bbox)) {
      setAerialPhase('blocked');
      return onSnapshotCleanup;
    }
    const url = buildNaipPlusExportImageUrl(bbox, { size: 512 });
    if (!url) {
      setAerialPhase('blocked');
      return onSnapshotCleanup;
    }

    const myGen = ++loadGenerationRef.current;

    setAerialPhase('loading');
    setAerialLoad({ gen: myGen, uri: url });

    clearSnapshotTimer();
    timeoutRef.current = setTimeout(() => {
      if (loadGenerationRef.current !== myGen) return;
      loadGenerationRef.current += 1;
      setAerialLoad(null);
      setAerialPhase('timeout');
    }, SNAPSHOT_TIMEOUT_MS);

    return onSnapshotCleanup;
  }, [selected]);

  const onSnapshotLoaded = useCallback((generation: number) => {
    if (loadGenerationRef.current !== generation) return;
    clearSnapshotTimer();
    setAerialPhase('loaded');
  }, []);

  const onSnapshotError = useCallback((generation: number) => {
    if (loadGenerationRef.current !== generation) return;
    clearSnapshotTimer();
    loadGenerationRef.current += 1;
    setAerialLoad(null);
    setAerialPhase('error');
  }, []);

  const qTrim = query.trim();
  const stateNameForEmpty =
    (stateCode && US_STATE_OPTIONS.find((o) => o.code === stateCode)?.name) || 'this state';
  const showResultsPanel =
    !selected && stateCode && (qTrim.length >= 2 || searching || (searchError != null && qTrim.length >= 2));

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.disclaimer}>
          USGS ortho preview (lake, pond, reservoir). One on-demand fetch; not fishing advice.
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

          {!stateCode && (
            <Text style={styles.calmHint}>Choose a state to start.</Text>
          )}

          {stateCode && (
            <>
              <Text style={styles.inputLabel}>Lake, pond, or reservoir</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Name (2+ characters)…"
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={onQueryChange}
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
                  {selectionSubLine(selected)}
                </Text>
                <View style={styles.selectedActions}>
                  <Pressable
                    onPress={onChangeState}
                    style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.linkBtnText}>Change state</Text>
                  </Pressable>
                  <Text style={styles.actionSep}>·</Text>
                  <Pressable
                    onPress={onChangeLake}
                    style={({ pressed }) => [styles.linkBtn, pressed && styles.pressed]}
                  >
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
                  <Text style={styles.searchingText}>Searching…</Text>
                </View>
              )}
              {searchError && <Text style={styles.dropdownError}>{searchError}</Text>}
              {searchEmpty && !searchError && !searching && (
                <Text style={styles.dropdownEmpty}>
                  {`No matching lakes in ${stateNameForEmpty}. Try another spelling.`}
                </Text>
              )}
              {!searching && results.length > 0 && (
                <ScrollView
                  style={styles.dropdownList}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {results.map((r) => (
                    <Pressable
                      key={r.lakeId}
                      style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]}
                      onPress={() => onPickResult(r)}
                    >
                      <Text style={styles.resultLine} numberOfLines={2}>
                        {resultPrimaryLine(r)}
                      </Text>
                      <Text style={styles.resultMeta} numberOfLines={2}>
                        {resultSecondaryLine(r)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        <View style={styles.snapshotSection}>
          <Text style={styles.section}>Aerial source preview</Text>
          {!selected && (
            <Text style={styles.muted}>Select a state, pick a waterbody, then a one-time preview can load here.</Text>
          )}
          {selected && aerialPhase === 'blocked' && (
            <Text style={styles.fallback}>
              Aerial source preview unavailable for this selected waterbody.
            </Text>
          )}
          {selected && aerialPhase === 'loading' && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.sage} />
              <Text style={styles.loadingText}>Loading imagery from USGS (often 10s+)…</Text>
            </View>
          )}
          {selected && aerialPhase === 'timeout' && (
            <Text style={styles.fallback}>
              Aerial source preview unavailable for this selected waterbody (request timed out).
            </Text>
          )}
          {selected && aerialPhase === 'error' && (
            <Text style={styles.fallback}>
              Aerial source preview unavailable for this selected waterbody (request error).
            </Text>
          )}
          {selected && aerialLoad && (aerialPhase === 'loading' || aerialPhase === 'loaded') && (
            <View style={styles.imageWrap}>
              <ExpoImage
                key={aerialLoad.gen}
                source={{ uri: aerialLoad.uri }}
                style={styles.snapshotImage}
                contentFit="contain"
                cachePolicy="none"
                recyclingKey={String(aerialLoad.gen)}
                accessibilityLabel="USGS TNM NAIP Plus on-demand ortho source preview for selected waterbody centroid"
                onLoad={() => onSnapshotLoaded(aerialLoad.gen)}
                onError={() => onSnapshotError(aerialLoad.gen)}
              />
            </View>
          )}
          {selected && aerialPhase === 'loaded' && (
            <Text style={styles.attr}>{USGS_TNM_ATTRIBUTION}</Text>
          )}
          {selected && aerialPhase === 'loading' && (
            <Text style={styles.attrSmall}>{USGS_TNM_ATTRIBUTION}</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={stateModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setStateModalOpen(false)}
      >
        <View style={styles.modalWrap}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select state</Text>
            <Pressable
              onPress={() => setStateModalOpen(false)}
              style={({ pressed }) => [styles.modalClose, pressed && styles.pressed]}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
            {US_STATE_OPTIONS.map((o) => (
              <Pressable
                key={o.code}
                style={({ pressed }) => [styles.stateRow, pressed && styles.pressed]}
                onPress={() => {
                  setStateCode(o.code);
                  setStateModalOpen(false);
                  setQuery('');
                  setResults([]);
                  setSearchError(null);
                }}
              >
                <Text style={styles.stateRowText}>
                  {o.name} ({o.code})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl + 32 },
  disclaimer: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  section: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  combobox: { marginBottom: spacing.md, zIndex: 20 },
  inputLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 6, marginTop: spacing.sm },
  stateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  stateButtonText: { flex: 1, fontSize: 16, color: colors.text, marginRight: spacing.sm },
  stateChevron: { fontSize: 12, color: colors.textMuted },
  calmHint: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 19 },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    color: colors.text,
  },
  selectedSummary: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.sage,
    padding: spacing.md,
  },
  selectedSummaryText: { flex: 1, minWidth: 0 },
  selectedTitle: { fontFamily: fonts.serif, fontSize: 16, color: colors.text, lineHeight: 22 },
  selectedSub: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 17 },
  selectedActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 6 },
  linkBtn: { paddingVertical: 4 },
  linkBtnText: { fontSize: 14, color: colors.sage, fontWeight: '600' },
  actionSep: { color: colors.textMuted, fontSize: 14 },
  pressed: { opacity: 0.85 },
  dropdown: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    maxHeight: 320,
    overflow: 'hidden',
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  searchingText: { fontSize: 13, color: colors.textSecondary },
  dropdownError: { color: colors.reportScoreRed, fontSize: 13, padding: spacing.md, paddingBottom: 0 },
  dropdownEmpty: { fontSize: 13, color: colors.textSecondary, padding: spacing.md, lineHeight: 19 },
  dropdownList: { maxHeight: 220 },
  resultRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  resultLine: { fontSize: 15, color: colors.text, lineHeight: 20 },
  resultMeta: { fontSize: 11, color: colors.textMuted, marginTop: 4, lineHeight: 16 },
  snapshotSection: { marginTop: spacing.xl },
  muted: { fontSize: 13, color: colors.textMuted },
  fallback: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  loadingText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  imageWrap: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    minHeight: 220,
  },
  snapshotImage: {
    width: '100%',
    height: 280,
    backgroundColor: colors.backgroundAlt,
  },
  attr: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.md,
    lineHeight: 16,
  },
  attrSmall: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 14,
  },
  modalWrap: { flex: 1, backgroundColor: colors.background, paddingTop: 8 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.text },
  modalClose: { padding: spacing.sm },
  modalCloseText: { fontSize: 16, color: colors.sage, fontWeight: '600' },
  modalList: { flex: 1 },
  stateRow: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  stateRowText: { fontSize: 16, color: colors.text },
});
