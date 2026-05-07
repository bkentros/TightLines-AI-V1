/**
 * Analytics — descriptive aggregates over logged catches (first MVP screen).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';
import {
  defaultFishingAnalyticsFilter,
  getFishingAnalytics,
  type DatePreset,
  type FishingAnalyticsFilter,
  type FishingAnalyticsResult,
  type GearMode,
  type EntryModeFilter,
  MAX_ANALYTICS_CATCH_ROWS,
} from '../lib/fishingAnalytics';
import {
  PaperBackground,
  PaperColophon,
  PaperNavHeader,
  SectionEyebrow,
} from '../components/paper';
import {
  hapticImpact,
  hapticSelection,
  ImpactFeedbackStyle,
} from '../lib/safeHaptics';
import { usePaperBonePulse } from '../lib/usePaperBonePulse';

function fmtLb(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return `${n.toFixed(n >= 10 ? 0 : 1)} lb`;
}

function fmtIn(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return `${n.toFixed(1)} in`;
}

function fmtAvgLb(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return `${n.toFixed(2)} lb`;
}

function fmtAvgIn(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return `${n.toFixed(1)} in`;
}

const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'all', label: 'All time' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '365d', label: 'Last 365 days' },
];

const GEAR_OPTIONS: { key: 'all' | GearMode; label: string }[] = [
  { key: 'all', label: 'All gear' },
  { key: 'lure', label: 'Lure' },
  { key: 'fly', label: 'Fly' },
  { key: 'bait', label: 'Bait' },
];

const ENTRY_OPTIONS: { key: EntryModeFilter; label: string }[] = [
  { key: 'all', label: 'All entries' },
  { key: 'ai', label: 'AI-assisted trips' },
  { key: 'manual', label: 'Manual trips' },
];

export default function AnalyticsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FishingAnalyticsFilter>(
    defaultFishingAnalyticsFilter(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FishingAnalyticsResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (opts?: { background?: boolean }) => {
    const background = opts?.background === true;
    if (!background) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await getFishingAnalytics(filter);
      if (!res.ok) {
        setError(res.error);
        setData(null);
        return;
      }
      setData(res.data);
    } finally {
      if (!background) {
        setLoading(false);
      }
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = useCallback(async () => {
    hapticImpact(ImpactFeedbackStyle.Light);
    setRefreshing(true);
    try {
      await load({ background: true });
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const clearFilters = () => setFilter(defaultFishingAnalyticsFilter());

  const emptyBecauseNoLog =
    data &&
    data.totalCatchRowsLoaded === 0 &&
    filter.speciesQuery.trim() === '' &&
    filter.datePreset === 'all' &&
    filter.gearMode === 'all' &&
    filter.entryMode === 'all';

  const emptyBecauseFilters =
    data &&
    data.totalCatchRowsLoaded > 0 &&
    data.matchingCatchRows === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ANALYTICS"
          title="ANALYTICS"
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={paper.forest}
              colors={[paper.forest]}
              progressBackgroundColor={paper.paper}
            />
          }
        >
          <View style={styles.topBar}>
            <SectionEyebrow dashes size={11} color={paper.red}>
              YOUR NUMBERS, IN INK
            </SectionEyebrow>
          </View>

          <Text style={styles.heroTitle}>Your numbers.</Text>
          <Text style={styles.heroLede}>
            Totals and rankings use only what you logged. Missing length or weight is
            skipped for those math lines — counts tell you how many fish measured up.
          </Text>

          <Text style={styles.sectionLabel}>Time range</Text>
          <View style={styles.pillRow}>
            {DATE_PRESETS.map((p) => (
              <Pressable
                key={p.key}
                style={[styles.pill, filter.datePreset === p.key && styles.pillActive]}
                onPress={() => {
                  hapticSelection();
                  setFilter((f) => ({ ...f, datePreset: p.key }));
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    filter.datePreset === p.key && styles.pillTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Species contains</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. bass, trout"
            placeholderTextColor={`${paper.ink}55`}
            value={filter.speciesQuery}
            onChangeText={(speciesQuery) => setFilter((f) => ({ ...f, speciesQuery }))}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.sectionLabel}>Gear type (estimated)</Text>
          <View style={styles.pillRow}>
            {GEAR_OPTIONS.map((p) => (
              <Pressable
                key={p.key}
                style={[styles.pill, filter.gearMode === p.key && styles.pillActive]}
                onPress={() => {
                  hapticSelection();
                  setFilter((f) => ({
                    ...f,
                    gearMode: p.key,
                  }));
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    filter.gearMode === p.key && styles.pillTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Trip source</Text>
          <View style={styles.pillRow}>
            {ENTRY_OPTIONS.map((p) => (
              <Pressable
                key={p.key}
                style={[styles.pill, filter.entryMode === p.key && styles.pillActive]}
                onPress={() => {
                  hapticSelection();
                  setFilter((f) => ({ ...f, entryMode: p.key }));
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    filter.entryMode === p.key && styles.pillTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.clearBtn} onPress={clearFilters}>
            <Text style={styles.clearBtnText}>Clear filters</Text>
          </Pressable>

          {loading && <AnalyticsLoadingPanel />}

          {error && !loading && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && data && (
            <>
              {data.rowCapHit && (
                <Text style={styles.capNote}>
                  Showing up to the {MAX_ANALYTICS_CATCH_ROWS.toLocaleString()} newest logged
                  catches. Totals reflect that window only.
                </Text>
              )}

              {emptyBecauseNoLog && (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>No catches logged yet.</Text>
                  <Text style={styles.emptyBody}>
                    Log a trip from My Log → New Entry and add fish with species (and length or
                    weight when you can). Analytics will fill in automatically.
                  </Text>
                </View>
              )}

              {emptyBecauseFilters && (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>Nothing matches these filters.</Text>
                  <Text style={styles.emptyBody}>
                    Try clearing filters or widening the date range.
                  </Text>
                </View>
              )}

              {!emptyBecauseNoLog && !emptyBecauseFilters && (
                <>
                  <Text style={styles.blockTitle}>Overview</Text>
                  <View style={styles.summaryGrid}>
                    <SummaryTile
                      label="Fish logged"
                      value={String(data.summary.catchCount)}
                      caption="Sum of quantities on matching rows."
                    />
                    <SummaryTile
                      label="Total weight"
                      value={fmtLb(data.summary.totalWeightLb)}
                      caption={
                        data.summary.weightSampleCount > 0
                          ? `Weight from ${data.summary.weightSampleCount} measured fish. Does not include fish without weight.`
                          : 'No weight measurements in this view.'
                      }
                    />
                    <SummaryTile
                      label="Average weight"
                      value={fmtAvgLb(data.summary.averageWeightLb)}
                      caption={
                        data.summary.weightSampleCount > 0
                          ? `Among ${data.summary.weightSampleCount} measured fish only.`
                          : '—'
                      }
                    />
                    <SummaryTile
                      label="Average length"
                      value={fmtAvgIn(data.summary.averageLengthIn)}
                      caption={
                        data.summary.lengthSampleCount > 0
                          ? `Among ${data.summary.lengthSampleCount} measured fish only.`
                          : 'No length measurements in this view.'
                      }
                    />
                    <SummaryTile
                      label="Longest logged"
                      value={fmtIn(data.summary.biggestLengthIn)}
                      caption="Single longest measurement in this view."
                    />
                    <SummaryTile
                      label="Heaviest logged"
                      value={fmtLb(data.summary.biggestWeightLb)}
                      caption="Single heaviest measurement in this view."
                    />
                  </View>

                  <Text style={styles.blockTitle}>Biggest logged fish</Text>

                  {data.summary.biggestLengthCatchId &&
                    data.summary.biggestLengthIn != null && (
                      <Pressable
                        style={({ pressed }) => [
                          styles.bigFishRow,
                          pressed && styles.bigFishRowPressed,
                        ]}
                        onPress={() =>
                          router.push({
                            pathname: '/log-detail',
                            params: { id: data.summary.biggestLengthCatchId! },
                          })
                        }
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.bigFishTitle}>Longest by length</Text>
                          <Text style={styles.bigFishMeta}>
                            {data.summary.biggestLengthSpeciesLabel ?? 'Species'}{' '}
                            · {fmtIn(data.summary.biggestLengthIn)}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={paper.ink} />
                      </Pressable>
                    )}

                  {data.summary.biggestWeightCatchId &&
                    data.summary.biggestWeightLb != null && (
                      <Pressable
                        style={({ pressed }) => [
                          styles.bigFishRow,
                          pressed && styles.bigFishRowPressed,
                        ]}
                        onPress={() =>
                          router.push({
                            pathname: '/log-detail',
                            params: { id: data.summary.biggestWeightCatchId! },
                          })
                        }
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.bigFishTitle}>Heaviest by weight</Text>
                          <Text style={styles.bigFishMeta}>
                            {data.summary.biggestWeightSpeciesLabel ?? 'Species'}{' '}
                            · {fmtLb(data.summary.biggestWeightLb)}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={paper.ink} />
                      </Pressable>
                    )}

                  {!data.summary.biggestLengthCatchId && !data.summary.biggestWeightCatchId && (
                    <Text style={styles.muted}>No length or weight recorded in this view.</Text>
                  )}

                  <RankedTable
                    title="Species breakdown"
                    hint="Sorted by number of fish logged."
                    rows={data.speciesBreakdown.map((r) => ({
                      key: r.speciesKey,
                      rankLabel: r.speciesLabel,
                      primary: `${r.catchCount} fish`,
                      secondary: `Wt ${r.weightSampleCount ? fmtLb(r.totalWeightLb) : '—'} (${r.weightSampleCount} measured) · Len avg ${r.lengthSampleCount ? fmtAvgIn(r.averageLengthIn) : '—'}`,
                    }))}
                  />

                  <RankedTable
                    title="Tackle rankings"
                    hint="Grouped by lure/fly name and type (estimated gear)."
                    rows={data.tackleRankings.map((r) => ({
                      key: r.tackleKey,
                      rankLabel: `${r.gearMode.toUpperCase()} · ${r.tackleLabel}`,
                      primary: `${r.catchCount} fish`,
                      secondary: `Wt ${r.weightSampleCount ? fmtLb(r.totalWeightLb) : '—'} · Len avg ${r.lengthSampleCount ? fmtAvgIn(r.averageLengthIn) : '—'}`,
                    }))}
                  />

                  <RankedTable
                    title="Places"
                    hint="From trip location fields."
                    rows={data.waterbodyBreakdown.map((r) => ({
                      key: r.waterbodyLabel,
                      rankLabel: r.waterbodyLabel,
                      primary: `${r.catchCount} fish`,
                      secondary: `Wt ${r.weightSampleCount ? fmtLb(r.totalWeightLb) : '—'} · biggest ${r.biggestLengthIn != null ? fmtIn(r.biggestLengthIn) : '—'}`,
                    }))}
                  />
                </>
              )}
            </>
          )}

          {!loading && (
            <PaperColophon
              section="ANALYTICS"
              tagline={(edition) =>
                `NO. ${edition} · TOTALS, RANKINGS, RECEIPTS`
              }
            />
          )}
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

/**
 * AnalyticsLoadingPanel — paper-language placeholder shown while
 * `getFishingAnalytics` resolves. Replaces the bare ActivityIndicator
 * the screen used to render. Three pulsing "bones" approximate the
 * Overview tile grid + Big Fish row + ranked table that arrives next,
 * so the layout doesn't jump on data arrival.
 *
 * Pulse uses `usePaperBonePulse` so it shares tempo with every other
 * paper skeleton in the app (Water Reader silhouette, How's Fishing).
 */
function AnalyticsLoadingPanel() {
  const pulse = usePaperBonePulse();
  return (
    <View style={styles.loadingPanel} accessibilityLabel="Loading analytics">
      <View style={styles.loadingHeaderRow}>
        <Animated.View style={[styles.boneTitle, { opacity: pulse }]} />
        <Animated.View style={[styles.boneEyebrow, { opacity: pulse }]} />
      </View>
      <View style={styles.loadingTileGrid}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.loadingTile}>
            <Animated.View style={[styles.boneTileLabel, { opacity: pulse }]} />
            <Animated.View style={[styles.boneTileValue, { opacity: pulse }]} />
            <Animated.View style={[styles.boneTileCaption, { opacity: pulse }]} />
          </View>
        ))}
      </View>
      <View style={styles.loadingBigFishRow}>
        <View style={{ flex: 1, gap: 6 }}>
          <Animated.View style={[styles.boneTileLabel, { opacity: pulse }]} />
          <Animated.View style={[styles.boneTileValue, { opacity: pulse }]} />
        </View>
      </View>
      <View style={styles.loadingFooter}>
        <Animated.View style={[styles.bonePulseDot, { opacity: pulse }]} />
        <Text style={styles.loadingFooterText}>READING YOUR LOG…</Text>
      </View>
    </View>
  );
}

function SummaryTile(props: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{props.label}</Text>
      <Text style={styles.tileValue}>{props.value}</Text>
      <Text style={styles.tileCaption}>{props.caption}</Text>
    </View>
  );
}

function RankedTable(props: {
  title: string;
  hint: string;
  rows: { key: string; rankLabel: string; primary: string; secondary: string }[];
}) {
  if (props.rows.length === 0) {
    return (
      <View style={styles.tableBlock}>
        <Text style={styles.blockTitle}>{props.title}</Text>
        <Text style={styles.muted}>No rows for this view.</Text>
      </View>
    );
  }

  return (
    <View style={styles.tableBlock}>
      <Text style={styles.blockTitle}>{props.title}</Text>
      <Text style={styles.tableHint}>{props.hint}</Text>
      {props.rows.map((row, idx) => (
        <View key={`${row.key}-${idx}`} style={styles.tableRow}>
          <Text style={styles.rankCol}>{idx + 1}</Text>
          <View style={styles.tableMain}>
            <Text style={styles.rankTitle} numberOfLines={2}>
              {row.rankLabel}
            </Text>
            <Text style={styles.rankPrimary}>{row.primary}</Text>
            <Text style={styles.rankSecondary}>{row.secondary}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  topBar: {
    paddingTop: paperSpacing.sm,
    paddingBottom: paperSpacing.sm,
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    fontWeight: '700',
    color: paper.ink,
    letterSpacing: -0.5,
    marginBottom: paperSpacing.sm,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.78,
    lineHeight: 21,
    marginBottom: paperSpacing.lg,
  },
  sectionLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.65,
    marginBottom: paperSpacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs,
    marginBottom: paperSpacing.md,
  },
  pill: {
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: 8,
    borderRadius: paperRadius.chip,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paperLight,
  },
  pillActive: {
    backgroundColor: paper.ink,
  },
  pillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 0.8,
  },
  pillTextActive: {
    color: paper.paper,
  },
  input: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
    marginBottom: paperSpacing.md,
    backgroundColor: paper.paperLight,
    color: paper.ink,
  },
  clearBtn: {
    alignSelf: 'flex-start',
    marginBottom: paperSpacing.lg,
    paddingVertical: paperSpacing.xs,
  },
  clearBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.forest,
    letterSpacing: 0.6,
  },
  loadingPanel: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.section,
    gap: paperSpacing.md,
    ...paperShadows.hard,
  },
  loadingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingTileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.sm,
  },
  loadingTile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    borderWidth: 1,
    borderColor: paper.inkHair,
    padding: paperSpacing.sm + 2,
    gap: 6,
  },
  loadingBigFishRow: {
    flexDirection: 'row',
    backgroundColor: paper.paper,
    borderRadius: paperRadius.card,
    borderWidth: 1,
    borderColor: paper.inkHair,
    padding: paperSpacing.md,
    gap: paperSpacing.sm,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
    paddingTop: paperSpacing.xs,
  },
  loadingFooterText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.4,
    color: paper.ink,
    opacity: 0.55,
  },
  bonePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: paper.forest,
  },
  boneEyebrow: {
    width: 80,
    height: 9,
    borderRadius: 2,
    backgroundColor: paper.red,
  },
  boneTitle: {
    width: 140,
    height: 16,
    borderRadius: 3,
    backgroundColor: paper.ink,
  },
  boneTileLabel: {
    width: 60,
    height: 8,
    borderRadius: 2,
    backgroundColor: paper.red,
  },
  boneTileValue: {
    width: 90,
    height: 22,
    borderRadius: 4,
    backgroundColor: paper.ink,
  },
  boneTileCaption: {
    width: '90%',
    height: 8,
    borderRadius: 2,
    backgroundColor: paper.inkHair,
  },
  errorBox: {
    padding: paperSpacing.md,
    borderWidth: 1.5,
    borderColor: paper.red,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paperLight,
  },
  errorText: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.ink,
  },
  capNote: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.72,
    marginBottom: paperSpacing.md,
    lineHeight: 19,
  },
  emptyBox: {
    padding: paperSpacing.lg,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paperLight,
    ...paperShadows.hard,
    marginBottom: paperSpacing.lg,
  },
  emptyTitle: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: paper.ink,
    marginBottom: paperSpacing.sm,
  },
  emptyBody: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.82,
    lineHeight: 21,
  },
  blockTitle: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: paper.ink,
    // Bumped from `md` to `lg` so analytics block headers visibly break
    // away from the previous block instead of feeling like a continuation.
    marginTop: paperSpacing.lg,
    marginBottom: paperSpacing.sm,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.lg,
  },
  tile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    ...paperShadows.hard,
  },
  tileLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.65,
    marginBottom: 4,
  },
  tileValue: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    fontWeight: '700',
    color: paper.ink,
    marginBottom: 6,
  },
  tileCaption: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.72,
    lineHeight: 15,
  },
  bigFishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: paperSpacing.md,
    marginBottom: paperSpacing.md,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    backgroundColor: paper.paperLight,
    gap: paperSpacing.sm,
    ...paperShadows.hard,
  },
  bigFishRowPressed: {
    backgroundColor: paper.paperDark,
  },
  bigFishTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.8,
    color: paper.ink,
    opacity: 0.75,
    marginBottom: 4,
  },
  bigFishMeta: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: paper.ink,
  },
  muted: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.65,
    marginBottom: paperSpacing.md,
  },
  tableBlock: {
    marginBottom: paperSpacing.section,
  },
  tableHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.65,
    marginBottom: paperSpacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    gap: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: `${paper.ink}22`,
  },
  rankCol: {
    fontFamily: paperFonts.mono,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.55,
    width: 22,
    paddingTop: 2,
  },
  tableMain: { flex: 1 },
  rankTitle: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    fontWeight: '700',
    color: paper.ink,
    marginBottom: 2,
  },
  rankPrimary: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.85,
  },
  rankSecondary: {
    fontFamily: paperFonts.mono,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.62,
    marginTop: 2,
    lineHeight: 15,
  },
});
