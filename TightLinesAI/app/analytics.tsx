/**
 * Analytics — descriptive aggregates over logged catches (first MVP screen).
 */

import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
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
import { PaperBackground, SectionEyebrow } from '../components/paper';

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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getFishingAnalytics(filter);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      setData(null);
      return;
    }
    setData(res.data);
  }, [filter]);

  useEffect(() => {
    load();
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
    <PaperBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <SectionEyebrow dashes size={11} color={paper.red}>
              FINFINDR · ANALYTICS
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
                onPress={() => setFilter((f) => ({ ...f, datePreset: p.key }))}
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
                onPress={() =>
                  setFilter((f) => ({
                    ...f,
                    gearMode: p.key,
                  }))
                }
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
                onPress={() => setFilter((f) => ({ ...f, entryMode: p.key }))}
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

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={paper.ink} />
              <Text style={styles.loadingText}>Loading analytics…</Text>
            </View>
          )}

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
        </ScrollView>
      </SafeAreaView>
    </PaperBackground>
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
  safe: { flex: 1 },
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.md,
  },
  loadingText: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
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
