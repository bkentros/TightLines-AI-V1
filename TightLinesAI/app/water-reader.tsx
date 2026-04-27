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
import { fetchWaterbodyAerialTilePlan, searchWaterbodies } from '../lib/waterReader';
import type { AerialTilePlan, AerialTilePlanLabel, WaterbodySearchResult } from '../lib/waterReaderContracts';
import {
  buildNaipPlusExportImageUrl,
  isValidWgs84Bbox,
  isValidWgs84Centroid,
  normalizeUsWaterbodyStateCode,
  stateExcludedFromConusAerial,
  USGS_TNM_ATTRIBUTION,
  wgs84BboxFromCentroidAcres,
} from '../lib/usgsTnmAerialSnapshot';
import { planAerialReadTiles, type Wgs84Bbox } from '../lib/waterReaderAerialTilePlan';

const SNAPSHOT_TIMEOUT_MS = 28_000;
const IMAGERY_PROOF_TIMEOUT_MS = 28_000;
const IMAGERY_PROOF_CLOSE_TILE_LIMIT = 3;
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
type TilePlanPhase = 'idle' | 'loading' | 'loaded' | 'error';
type ImageryProofPhase = 'loading' | 'loaded' | 'timeout' | 'error';

interface ImageryProofImage {
  key: string;
  label: string;
  bbox: Wgs84Bbox;
  uri: string;
  phase: ImageryProofPhase;
  prototypeVisibleCategory?: string;
}

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

function formatBbox(bbox: Wgs84Bbox): string {
  return [
    bbox.minLon.toFixed(5),
    bbox.minLat.toFixed(5),
    bbox.maxLon.toFixed(5),
    bbox.maxLat.toFixed(5),
  ].join(', ');
}

function sourceLabel(source: string): string {
  if (source === 'serverGeometry') return 'server geometry tile plan';
  if (source === 'previewBbox') return 'geometry preview bbox';
  return 'centroid/acres fallback';
}

function labelDisplay(label: AerialTilePlanLabel): string {
  return label.replace(/_/g, ' ');
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
  const [serverTilePlanPhase, setServerTilePlanPhase] = useState<TilePlanPhase>('idle');
  const [serverTilePlan, setServerTilePlan] = useState<AerialTilePlan | null>(null);
  const [serverTilePlanError, setServerTilePlanError] = useState<string | null>(null);
  const [imageryProofImages, setImageryProofImages] = useState<ImageryProofImage[] | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const proofTimeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const loadGenerationRef = useRef(0);
  const searchRequestId = useRef(0);

  const clearSnapshotTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const clearProofTimer = (key: string) => {
    if (proofTimeoutRefs.current[key]) {
      clearTimeout(proofTimeoutRefs.current[key]);
      delete proofTimeoutRefs.current[key];
    }
  };

  const clearProofTimers = () => {
    for (const key of Object.keys(proofTimeoutRefs.current)) {
      clearProofTimer(key);
    }
  };

  useEffect(
    () => () => {
      clearSnapshotTimer();
      clearProofTimers();
    },
    [],
  );

  useEffect(() => {
    setSelected(null);
  }, [stateCode]);

  useEffect(() => {
    setImageryProofImages(null);
    setServerTilePlan(null);
    setServerTilePlanError(null);
    setServerTilePlanPhase('idle');
    clearProofTimers();
  }, [selected]);

  useEffect(() => {
    if (!selected || selected.aerialAvailable !== true) return;

    let cancelled = false;
    setServerTilePlanPhase('loading');
    setServerTilePlanError(null);

    void fetchWaterbodyAerialTilePlan({
      lakeId: selected.lakeId,
      maxCloseTiles: IMAGERY_PROOF_CLOSE_TILE_LIMIT,
    }).then((response) => {
      if (cancelled) return;
      setServerTilePlan(response.plan);
      setServerTilePlanPhase(response.plan ? 'loaded' : 'error');
      setServerTilePlanError(response.plan ? null : 'No server geometry tile plan returned.');
      setImageryProofImages(null);
      clearProofTimers();
    }).catch((e) => {
      if (cancelled) return;
      setServerTilePlan(null);
      setServerTilePlanPhase('error');
      setServerTilePlanError(e instanceof Error ? e.message : 'Server geometry tile plan unavailable.');
    });

    return () => {
      cancelled = true;
    };
  }, [selected]);

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

    const previewBbox = selected.previewBbox;
    const bbox = previewBbox && isValidWgs84Bbox(previewBbox)
      ? previewBbox
      : wgs84BboxFromCentroidAcres(
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

  const updateImageryProofPhase = useCallback((key: string, phase: ImageryProofPhase) => {
    clearProofTimer(key);
    setImageryProofImages((current) =>
      current?.map((image) => (image.key === key ? { ...image, phase } : image)) ?? null,
    );
  }, []);

  const qTrim = query.trim();
  const stateNameForEmpty =
    (stateCode && US_STATE_OPTIONS.find((o) => o.code === stateCode)?.name) || 'this state';
  const showResultsPanel =
    !selected && stateCode && (qTrim.length >= 2 || searching || (searchError != null && qTrim.length >= 2));
  const fallbackAerialTilePlan = selected ? planAerialReadTiles(selected) : null;
  const serverDisplayTilePlan = serverTilePlan
    ? {
        contextBbox: serverTilePlan.contextBbox,
        closeTiles: serverTilePlan.tiles.map((tile, index) => ({
          id: tile.id,
          row: 0,
          col: index,
          bbox: tile.bbox,
          prototypeVisibleCategory: labelDisplay(tile.label),
        })),
        gridRows: 1,
        gridCols: Math.max(1, serverTilePlan.tiles.length),
        overlapRatio: 0,
        source: serverTilePlan.source,
      }
    : null;
  const aerialTilePlan = serverDisplayTilePlan ?? fallbackAerialTilePlan;
  const canLoadImageryProof = selected != null && aerialTilePlan != null;

  const onLoadImageryProof = useCallback(() => {
    if (!aerialTilePlan) return;

    clearProofTimers();
    const contextUri = buildNaipPlusExportImageUrl(aerialTilePlan.contextBbox, { size: 512 });
    const images: ImageryProofImage[] = contextUri
      ? [{
          key: 'context',
          label: 'Whole-lake context',
          bbox: aerialTilePlan.contextBbox,
          uri: contextUri,
          phase: 'loading',
        }]
      : [];

    for (const tile of aerialTilePlan.closeTiles.slice(0, IMAGERY_PROOF_CLOSE_TILE_LIMIT)) {
      const uri = buildNaipPlusExportImageUrl(tile.bbox, { size: 512 });
      if (!uri) continue;
      images.push({
        key: `tile-${tile.id}`,
        label: `Close tile ${tile.id}`,
        bbox: tile.bbox,
        uri,
        phase: 'loading',
        prototypeVisibleCategory: tile.prototypeVisibleCategory,
      });
    }

    setImageryProofImages(images);
  }, [aerialTilePlan]);

  useEffect(() => {
    if (!imageryProofImages) return;
    for (const image of imageryProofImages) {
      if (image.phase !== 'loading' || proofTimeoutRefs.current[image.key]) continue;
      proofTimeoutRefs.current[image.key] = setTimeout(() => {
        updateImageryProofPhase(image.key, 'timeout');
      }, IMAGERY_PROOF_TIMEOUT_MS);
    }
  }, [imageryProofImages, updateImageryProofPhase]);

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

        <View style={styles.planningSection}>
          <Text style={styles.section}>Aerial read planning preview</Text>
          {!selected && (
            <Text style={styles.muted}>Select a waterbody to see the deterministic tile plan prototype.</Text>
          )}
          {selected && !aerialTilePlan && (
            <Text style={styles.fallback}>
              Planning preview unavailable because this waterbody does not have a valid bbox or centroid.
            </Text>
          )}
          {selected && aerialTilePlan && (
            <View style={styles.planningCard}>
              <Text style={styles.prototypeBadge}>Prototype only</Text>
              <Text style={styles.prototypeCopy}>
                Planning proof only — no imagery analysis, no depth, no fish-zone scoring.
              </Text>
              <Text style={styles.prototypeCopy}>
                These tiles are deterministic bbox plans and mock visible-category labels, not fishing recommendations.
              </Text>

              <View style={styles.planMetaBlock}>
                <Text style={styles.planMetaLabel}>Whole-lake context bbox</Text>
                <Text style={styles.planBboxText}>{formatBbox(aerialTilePlan.contextBbox)}</Text>
                <Text style={styles.planMetaHint}>
                  Source: {sourceLabel(aerialTilePlan.source)} · Close tiles: {aerialTilePlan.closeTiles.length} · Overlap: {Math.round(aerialTilePlan.overlapRatio * 100)}%
                </Text>
                {serverTilePlanPhase === 'loading' && (
                  <Text style={styles.planMetaHint}>
                    Loading server geometry tile plan metadata. Falling back to the client bbox grid until it is available.
                  </Text>
                )}
                {serverTilePlanPhase === 'error' && serverTilePlanError && (
                  <Text style={styles.planMetaHint}>
                    Server geometry tile plan unavailable; prototype is using the client bbox-grid fallback.
                  </Text>
                )}
              </View>

              <View style={styles.tileSchematic}>
                {aerialTilePlan.closeTiles.map((tile) => (
                  <View
                    key={`tile-schematic-${tile.id}`}
                    style={[
                      styles.tileSchematicBox,
                      {
                        left: `${(tile.col / aerialTilePlan.gridCols) * 100}%`,
                        top: `${(tile.row / aerialTilePlan.gridRows) * 100}%`,
                        width: `${100 / aerialTilePlan.gridCols}%`,
                        height: `${100 / aerialTilePlan.gridRows}%`,
                      },
                    ]}
                  >
                    <Text style={styles.tileSchematicText}>{tile.id}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.tileList}>
                {aerialTilePlan.closeTiles.map((tile) => (
                  <View key={tile.id} style={styles.tileCard}>
                    <View style={styles.tileHeader}>
                      <Text style={styles.tileTitle}>Tile {tile.id}</Text>
                      <Text style={styles.tileCategory}>{tile.prototypeVisibleCategory}</Text>
                    </View>
                    <Text style={styles.tileBboxText}>{formatBbox(tile.bbox)}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.imageryProofBlock}>
                <Text style={styles.planMetaLabel}>Imagery retrieval proof only</Text>
                <Text style={styles.prototypeCopy}>
                  No analysis, no depth, no fish-zone scoring. Images are fetched on demand and not stored.
                </Text>
                <Pressable
                  onPress={onLoadImageryProof}
                  disabled={!canLoadImageryProof}
                  style={({ pressed }) => [
                    styles.proofButton,
                    pressed && styles.pressed,
                    !canLoadImageryProof && styles.proofButtonDisabled,
                  ]}
                >
                  <Text style={styles.proofButtonText}>Load close-up imagery proof</Text>
                </Pressable>
                <Text style={styles.planMetaHint}>
                  Request budget for this proof: whole-lake context + up to {IMAGERY_PROOF_CLOSE_TILE_LIMIT} close tiles at 512px. This does not cache imagery.
                </Text>

                {imageryProofImages && (
                  <View style={styles.proofImageList}>
                    {imageryProofImages.map((image) => (
                      <View key={image.key} style={styles.proofImageCard}>
                        <View style={styles.tileHeader}>
                          <Text style={styles.tileTitle}>{image.label}</Text>
                          <Text style={styles.proofStatus}>{image.phase}</Text>
                        </View>
                        {image.prototypeVisibleCategory && (
                          <Text style={styles.tileCategoryInline}>
                            Mock planning category: {image.prototypeVisibleCategory}
                          </Text>
                        )}
                        <Text style={styles.tileBboxText}>{formatBbox(image.bbox)}</Text>
                        <View style={styles.proofImageWrap}>
                          {(image.phase === 'loading' || image.phase === 'loaded') && (
                            <ExpoImage
                              source={{ uri: image.uri }}
                              style={styles.proofImage}
                              contentFit="cover"
                              cachePolicy="none"
                              recyclingKey={image.key}
                              accessibilityLabel={`${image.label} USGS imagery retrieval proof`}
                              onLoad={() => updateImageryProofPhase(image.key, 'loaded')}
                              onError={() => updateImageryProofPhase(image.key, 'error')}
                            />
                          )}
                          {image.phase === 'loading' && (
                            <View style={styles.proofLoadingOverlay}>
                              <ActivityIndicator size="small" color={colors.sage} />
                              <Text style={styles.proofLoadingText}>Loading on-demand image…</Text>
                            </View>
                          )}
                          {image.phase === 'timeout' && (
                            <Text style={styles.proofFallback}>This proof image timed out.</Text>
                          )}
                          {image.phase === 'error' && (
                            <Text style={styles.proofFallback}>This proof image could not load.</Text>
                          )}
                        </View>
                      </View>
                    ))}
                    <Text style={styles.attrSmall}>{USGS_TNM_ATTRIBUTION}</Text>
                  </View>
                )}
              </View>
            </View>
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
  planningSection: { marginTop: spacing.xl },
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
  planningCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  prototypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundAlt,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prototypeCopy: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  planMetaBlock: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  planMetaLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  planBboxText: { fontSize: 12, color: colors.text, fontFamily: 'SpaceMono_400Regular', lineHeight: 18 },
  planMetaHint: { fontSize: 11, color: colors.textMuted, marginTop: 4, lineHeight: 16 },
  tileSchematic: {
    height: 160,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    overflow: 'hidden',
    position: 'relative',
  },
  tileSchematicBox: {
    position: 'absolute',
    width: '32%',
    height: '40%',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.sage,
    backgroundColor: 'rgba(107, 126, 86, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSchematicText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  tileList: { gap: spacing.sm, marginTop: spacing.xs },
  tileCard: {
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.sm,
    backgroundColor: colors.background,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  tileTitle: { fontSize: 13, color: colors.text, fontWeight: '700' },
  tileCategory: { flex: 1, textAlign: 'right', fontSize: 12, color: colors.textSecondary },
  tileBboxText: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'SpaceMono_400Regular',
    lineHeight: 16,
  },
  imageryProofBlock: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  proofButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },
  proofButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  proofButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  proofImageList: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  proofImageCard: {
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.sm,
  },
  proofStatus: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tileCategoryInline: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  proofImageWrap: {
    minHeight: 180,
    marginTop: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.backgroundAlt,
  },
  proofLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(242, 250, 244, 0.78)',
  },
  proofLoadingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  proofFallback: {
    padding: spacing.md,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
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
