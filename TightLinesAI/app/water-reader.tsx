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

type AerialPhase = "idle" | "loading" | "loaded" | "timeout" | "error" | "blocked";

function formatAvailability(r: WaterbodySearchResult): string {
  const parts: string[] = [];
  if (r.aerialAvailable) parts.push("aerial");
  if (r.depthAvailable) parts.push("depth");
  if (parts.length === 0) return "limited / none";
  return parts.join(" + ");
}

export default function WaterReaderScreen() {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<WaterbodySearchResult[]>([]);
  const [selected, setSelected] = useState<WaterbodySearchResult | null>(null);

  const [aerialPhase, setAerialPhase] = useState<AerialPhase>("idle");
  /** Active export only after validation; `gen` pairs image callbacks to this request. */
  const [aerialLoad, setAerialLoad] = useState<{ gen: number; uri: string } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadGenerationRef = useRef(0);

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

  const runSearch = useCallback(async () => {
    const q = query.trim();
    if (q.length < 2) {
      setSearchError("Type at least 2 characters.");
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      const st = stateFilter.trim();
      const res = await searchWaterbodies({
        query: q,
        state: st.length > 0 ? st.toUpperCase() : undefined,
        limit: 15,
      });
      setResults(res.results);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Search failed.";
      setSearchError(
        msg.includes("Subscribe") || msg.includes("subscription")
          ? "Waterbody search requires an active subscription."
          : msg,
      );
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [query, stateFilter]);

  useEffect(() => {
    loadGenerationRef.current += 1;
    clearSnapshotTimer();
    setAerialPhase("idle");
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
    const st = normalizeUsWaterbodyStateCode(String(selected.state ?? ""));

    const eligible =
      selected.aerialAvailable === true &&
      st != null &&
      !stateExcludedFromConusAerial(st) &&
      isValidWgs84Centroid(typeof lat === "number" ? lat : NaN, typeof lon === "number" ? lon : NaN);

    if (!eligible) {
      setAerialPhase("blocked");
      return onSnapshotCleanup;
    }

    const bbox = wgs84BboxFromCentroidAcres(
      lat!,
      lon!,
      selected.surfaceAreaAcres ?? undefined,
    );
    if (!isValidWgs84Bbox(bbox)) {
      setAerialPhase("blocked");
      return onSnapshotCleanup;
    }
    const url = buildNaipPlusExportImageUrl(bbox, { size: 512 });
    if (!url) {
      setAerialPhase("blocked");
      return onSnapshotCleanup;
    }

    const myGen = ++loadGenerationRef.current;

    setAerialPhase("loading");
    setAerialLoad({ gen: myGen, uri: url });

    clearSnapshotTimer();
    timeoutRef.current = setTimeout(() => {
      if (loadGenerationRef.current !== myGen) return;
      loadGenerationRef.current += 1;
      setAerialLoad(null);
      setAerialPhase("timeout");
    }, SNAPSHOT_TIMEOUT_MS);

    return onSnapshotCleanup;
  }, [selected]);

  const onSnapshotLoaded = useCallback((generation: number) => {
    if (loadGenerationRef.current !== generation) return;
    clearSnapshotTimer();
    setAerialPhase("loaded");
  }, []);

  const onSnapshotError = useCallback((generation: number) => {
    if (loadGenerationRef.current !== generation) return;
    clearSnapshotTimer();
    loadGenerationRef.current += 1;
    setAerialLoad(null);
    setAerialPhase("error");
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputGrow]}
            placeholder="Name (min 2 characters)"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputGrow]}
            placeholder="State (optional, e.g. MN)"
            placeholderTextColor={colors.textMuted}
            value={stateFilter}
            onChangeText={setStateFilter}
            autoCorrect={false}
            autoCapitalize="characters"
            maxLength={2}
          />
          <Pressable
            style={({ pressed }) => [styles.searchBtn, pressed && styles.pressed]}
            onPress={() => void runSearch()}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator color={colors.textLight} size="small" />
            ) : (
              <Text style={styles.searchBtnText}>Search</Text>
            )}
          </Pressable>
        </View>
        {searchError && <Text style={styles.warn}>{searchError}</Text>}

        {results.length > 0 && (
          <>
            <Text style={styles.sectionMuted}>Results — tap one row</Text>
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
                    {" "}
                    · {r.state}
                    {r.county ? ` · ${r.county}` : ""} · {r.waterbodyType}
                  </Text>
                </Text>
                <Text style={styles.resultSub}>
                  Source availability: {formatAvailability(r)} · {r.availability} ·{" "}
                  {r.sourceStatus}
                </Text>
              </Pressable>
            ))}
          </>
        )}

        <View style={styles.snapshotSection}>
          <Text style={styles.section}>Aerial source preview</Text>
          {!selected && (
            <Text style={styles.muted}>Select a waterbody above to load a one-time preview.</Text>
          )}
          {selected && aerialPhase === "blocked" && (
            <Text style={styles.fallback}>
              Aerial source preview unavailable for this selected waterbody.
            </Text>
          )}
          {selected && aerialPhase === "loading" && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.sage} />
              <Text style={styles.loadingText}>Loading imagery from USGS (often 10s+)…</Text>
            </View>
          )}
          {selected && aerialPhase === "timeout" && (
            <Text style={styles.fallback}>
              Aerial source preview unavailable for this selected waterbody (request timed out).
            </Text>
          )}
          {selected && aerialPhase === "error" && (
            <Text style={styles.fallback}>
              Aerial source preview unavailable for this selected waterbody (request error).
            </Text>
          )}
          {selected &&
            aerialLoad &&
            (aerialPhase === "loading" || aerialPhase === "loaded") && (
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
          {selected && aerialPhase === "loaded" && (
            <Text style={styles.attr}>{USGS_TNM_ATTRIBUTION}</Text>
          )}
          {selected && aerialPhase === "loading" && (
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
  section: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionMuted: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm, alignItems: "center" },
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    minWidth: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: { fontSize: 15, fontWeight: "600", color: colors.textLight },
  pressed: { opacity: 0.85 },
  warn: { color: colors.reportScoreRed, fontSize: 13, marginBottom: spacing.sm },
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
  resultMeta: { fontSize: 14, fontWeight: "400", color: colors.textSecondary },
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
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  loadingText: { fontSize: 13, color: colors.textSecondary, textAlign: "center" },
  imageWrap: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: "hidden",
    minHeight: 220,
  },
  snapshotImage: {
    width: "100%",
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
