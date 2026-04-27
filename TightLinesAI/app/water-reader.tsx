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
const SEARCH_DEBOUNCE_MS = 450;

type AerialPhase = 'idle' | 'loading' | 'loaded' | 'timeout' | 'error' | 'blocked';

function formatAvailability(r: WaterbodySearchResult): string {
  const parts: string[] = [];
  if (r.aerialAvailable) parts.push('aerial');
  if (r.depthAvailable) parts.push('depth');
  if (parts.length === 0) return 'limited / none';
  return parts.join(' + ');
}

/** Map Edge/client errors to honest, specific copy (no generic "Search failed"). */
function userFacingSearchError(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  const m = raw.toLowerCase();
  if (m.includes('not signed in') || m.includes('sign in')) {
    return 'Sign in to search waterbodies.';
  }
  if (m.includes('subscribe') || m.includes('subscription')) {
    return 'Waterbody search requires an active subscription.';
  }
  if (m.includes('unauthorized') || raw === 'Unauthorized') {
    return 'Session invalid. Sign in again to search.';
  }
  if (m.includes('failed to search waterbodies') || m.includes('search_failed')) {
    return 'Search is temporarily unavailable. Try again in a moment.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Network error. Check connection and try again.';
  }
  return raw;
}

export default function WaterReaderScreen() {
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
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

  /** New query/state invalidates previous selection and preview. */
  useEffect(() => {
    setSelected(null);
  }, [query, stateFilter]);

  const getStateParamForSearch = useCallback((): { ok: true; state?: string } | { ok: false; reason: string } => {
    const st = stateFilter.trim();
    if (st.length === 0) return { ok: true, state: undefined };
    if (st.length === 1) {
      return { ok: false, reason: 'Enter a 2-letter state (e.g. MI) or leave state blank.' };
    }
    if (st.length === 2) {
      const n = normalizeUsWaterbodyStateCode(st);
      if (n == null) {
        return {
          ok: false,
          reason: 'State code not recognized. Use a 2-letter U.S. code (e.g. MI) or leave blank.',
        };
      }
      return { ok: true, state: n };
    }
    return { ok: false, reason: 'State filter must be two letters (e.g. MI) or blank.' };
  }, [stateFilter]);

  const runSearch = useCallback(
    async (requestId: number) => {
      const q = query.trim();
      if (q.length < 2) {
        setResults([]);
        setSearchEmpty(false);
        setSearchError(null);
        setSearching(false);
        return;
      }
      const sp = getStateParamForSearch();
      if (!sp.ok) {
        setSearchError(sp.reason);
        setResults([]);
        setSearchEmpty(false);
        setSearching(false);
        return;
      }
      setSearching(true);
      setSearchError(null);
      setSearchEmpty(false);
      try {
        const res = await searchWaterbodies({
          query: q,
          state: sp.state,
          limit: 15,
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
    [query, getStateParamForSearch],
  );

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearchError(null);
      setSearchEmpty(false);
      setSearching(false);
      return;
    }
    const sp = getStateParamForSearch();
    if (!sp.ok) {
      setSearchError(sp.reason);
      setResults([]);
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
  }, [query, stateFilter, getStateParamForSearch, runSearch]);

  const refreshSearch = useCallback(() => {
    const sp = getStateParamForSearch();
    const q = query.trim();
    if (q.length < 2) {
      setSearchError('Type at least 2 characters.');
      return;
    }
    if (!sp.ok) {
      setSearchError(sp.reason);
      return;
    }
    const id = ++searchRequestId.current;
    void runSearch(id);
  }, [query, getStateParamForSearch, runSearch]);

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
          On-demand USGS ortho source preview (lake, pond, reservoir lookup). Not fishing advice, a
          finished product, or a structural readout — a single on-screen fetch where policy allows.
        </Text>

        <Text style={styles.section}>Find a waterbody</Text>
        <Text style={styles.hint}>
          Type at least 2 characters; results update as you type. You can use natural name order
          (e.g. “Lake Oakland” or “Oakland Lake”).
        </Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputGrow]}
            placeholder="Lake name (type to search)"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="words"
            accessibilityLabel="Waterbody name search"
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputGrow]}
            placeholder="State optional (e.g. MI)"
            placeholderTextColor={colors.textMuted}
            value={stateFilter}
            onChangeText={(t) => setStateFilter(t.toUpperCase().replace(/[^A-Z]/g, ''))}
            autoCorrect={false}
            autoCapitalize="characters"
            maxLength={2}
            accessibilityLabel="Optional two-letter state filter"
          />
          <Pressable
            style={({ pressed }) => [styles.searchBtn, pressed && styles.pressed]}
            onPress={refreshSearch}
            disabled={searching}
            accessibilityLabel="Refresh search"
          >
            {searching ? (
              <ActivityIndicator color={colors.textLight} size="small" />
            ) : (
              <Text style={styles.searchBtnText}>Refresh</Text>
            )}
          </Pressable>
        </View>
        {searching && (
          <View style={styles.searchingRow}>
            <ActivityIndicator size="small" color={colors.sage} />
            <Text style={styles.searchingText}>Searching…</Text>
          </View>
        )}
        {searchError && <Text style={styles.warn}>{searchError}</Text>}
        {searchEmpty && !searchError && !searching && (
          <Text style={styles.info}>
            No matching lakes. Try different spelling, a shorter search, or adjust the state filter.
          </Text>
        )}

        {results.length > 0 && (
          <>
            <Text style={styles.sectionMuted}>Tap a result to select</Text>
            {results.map((r) => (
              <Pressable
                key={r.lakeId}
                style={({ pressed }) => [
                  styles.resultRow,
                  selected?.lakeId === r.lakeId && styles.resultRowSelected,
                  pressed && styles.pressed,
                ]}
                onPress={() => setSelected(r)}
              >
                <Text style={styles.resultTitle}>
                  {r.name}
                  <Text style={styles.resultMeta}>
                    {' '}
                    · {r.state}
                    {r.county ? ` · ${r.county}` : ''} · {r.waterbodyType}
                  </Text>
                </Text>
                <Text style={styles.resultSub}>
                  Source availability: {formatAvailability(r)} · {r.availability} · {r.sourceStatus}
                </Text>
              </Pressable>
            ))}
          </>
        )}

        <View style={styles.snapshotSection}>
          <Text style={styles.section}>Aerial source preview</Text>
          {!selected && (
            <Text style={styles.muted}>Select a waterbody from the list above to load a one-time preview.</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl + 32 },
  disclaimer: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  hint: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  section: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionMuted: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'center' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 15,
    color: colors.text,
  },
  inputGrow: { flex: 1 },
  searchBtn: {
    backgroundColor: colors.sage,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: { fontSize: 14, fontWeight: '600', color: colors.textLight },
  pressed: { opacity: 0.85 },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchingText: { fontSize: 13, color: colors.textSecondary },
  warn: { color: colors.reportScoreRed, fontSize: 13, marginBottom: spacing.sm },
  info: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm, lineHeight: 19 },
  resultRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  resultRowSelected: {
    borderColor: colors.sage,
    borderWidth: 2,
  },
  resultTitle: { fontFamily: fonts.serif, fontSize: 16, color: colors.text },
  resultMeta: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
  resultSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
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
});
