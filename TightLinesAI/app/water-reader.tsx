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
import { searchWaterbodies } from '../lib/waterReader';
import type { WaterbodySearchResult } from '../lib/waterReaderContracts';

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

function resultPrimaryLine(r: WaterbodySearchResult): string {
  const county = r.county ? ` - ${r.county} County` : '';
  return `${r.name}${county} · ${r.waterbodyType}`;
}

function resultSecondaryLine(r: WaterbodySearchResult): string {
  const acres = typeof r.surfaceAreaAcres === 'number' ? ` · ${Math.round(r.surfaceAreaAcres).toLocaleString()} acres` : '';
  return `${r.state} · polygon source ${r.sourceStatus}${acres}`;
}

function selectionSummaryLine(r: WaterbodySearchResult): string {
  const county = r.county ? ` · ${r.county} County` : '';
  return `${r.name}${county} · ${r.state} · ${r.waterbodyType}`;
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
  const searchRequestId = useRef(0);

  useEffect(() => {
    setSelected(null);
  }, [stateCode]);

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

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.disclaimer}>
          Polygon-only Water Reader V1. Uses public-domain hydrography polygons for geometry context. No source
          photos, depth charts, seasonal logic, species logic, or fishing-spot claims.
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
                  {results.map((r) => (
                    <Pressable
                      key={r.lakeId}
                      style={({ pressed }) => [styles.resultRow, pressed && styles.pressed]}
                      onPress={() => setSelected(r)}
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

        <View style={styles.mapSection}>
          <Text style={styles.section}>Vector lake map</Text>
          {!selected && (
            <Text style={styles.muted}>
              Select a waterbody to frame the polygon-only map. Highlighted structure zones will come from polygon
              geometry only.
            </Text>
          )}
          {selected && (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderTitle}>Polygon renderer pending</Text>
              <Text style={styles.placeholderCopy}>
                Search is connected. The next V1 slice retrieves the selected hydrography polygon and runs the
                polygon-only structure detector before rendering 3-5 branded vector zones.
              </Text>
            </View>
          )}
        </View>

        {selected && (
          <View style={styles.limitsSection}>
            <Text style={styles.section}>V1 guardrails</Text>
            <Text style={styles.limitCopy}>
              This version will not use source photos, depth charts, species behavior, month, weather, or conditions.
              Output is a conservative geometry preview, not fishing advice or exact GPS guidance.
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
  placeholderTitle: { fontFamily: fonts.serif, fontSize: 16, color: colors.text },
  placeholderCopy: { marginTop: spacing.xs, color: colors.textSecondary, lineHeight: 20 },
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
