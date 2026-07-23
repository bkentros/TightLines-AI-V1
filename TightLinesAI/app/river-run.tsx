import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PaperBackground,
  PaperCard,
  PaperNavHeader,
} from '../components/paper';
import { fetchRiverRunCatalog, fetchRiverRunSnapshot } from '../lib/riverRun';
import type {
  RiverRunCatalogResponse,
  RiverRunCatalogRiver,
  RiverRunCatalogRun,
  RiverRunCatalogState,
  RiverRunPrimitiveDisplay,
  RiverRunSeason,
  RiverRunSnapshotResponse,
} from '../lib/riverRunContracts';
import { paper, paperFonts, paperRadius, paperSpacing } from '../lib/theme';

const SEASONS: RiverRunSeason[] = ['spring', 'summer', 'fall', 'winter'];
const SEASON_LABELS: Record<RiverRunSeason, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

export default function RiverRunScreen() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<RiverRunCatalogResponse | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedRiverId, setSelectedRiverId] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<RiverRunSeason>('fall');
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<RiverRunSnapshotResponse | null>(
    null,
  );
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);

  const loadCatalog = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoadingCatalog(true);
    setCatalogError(null);
    try {
      setCatalog(await fetchRiverRunCatalog());
    } catch (error) {
      setCatalogError(
        error instanceof Error ? error.message : 'River Run failed to load.',
      );
    } finally {
      setLoadingCatalog(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const states = catalog?.states ?? [];
  const activeState = useMemo(
    () => states.find((item) => item.state === selectedState) ?? states[0],
    [selectedState, states],
  );
  const rivers = activeState?.rivers ?? [];
  const activeRiver = useMemo(
    () => rivers.find((item) => item.riverId === selectedRiverId) ?? rivers[0],
    [rivers, selectedRiverId],
  );
  const runsForSeason = useMemo(
    () =>
      activeRiver?.runs.filter((run) => run.season === selectedSeason) ?? [],
    [activeRiver, selectedSeason],
  );
  const activeRun = useMemo(
    () =>
      runsForSeason.find((item) => item.runId === selectedRunId) ??
      runsForSeason[0],
    [runsForSeason, selectedRunId],
  );

  useEffect(() => {
    if (!activeState) return;
    setSelectedState((current) => current ?? activeState.state);
  }, [activeState]);

  useEffect(() => {
    if (!activeRiver) return;
    setSelectedRiverId((current) => current ?? activeRiver.riverId);
    const availableSeason = SEASONS.find((season) =>
      activeRiver.runs.some((run) => run.season === season),
    );
    if (
      availableSeason &&
      !activeRiver.runs.some((run) => run.season === selectedSeason)
    ) {
      setSelectedSeason(availableSeason);
    }
  }, [activeRiver, selectedSeason]);

  useEffect(() => {
    setSelectedRunId(activeRun?.runId ?? null);
  }, [activeRun?.runId]);

  useEffect(() => {
    if (!activeRiver || !activeRun) {
      setSnapshot(null);
      return;
    }
    let cancelled = false;
    setLoadingSnapshot(true);
    setSnapshotError(null);
    fetchRiverRunSnapshot({
      riverId: activeRiver.riverId,
      runId: activeRun.runId,
    })
      .then((next) => {
        if (!cancelled) setSnapshot(next);
      })
      .catch((error) => {
        if (!cancelled) {
          setSnapshot(null);
          setSnapshotError(
            error instanceof Error
              ? error.message
              : 'River Run snapshot failed to load.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSnapshot(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeRiver?.riverId, activeRun?.runId]);

  const hasCatalog = states.some((state) =>
    state.rivers.some((river) => river.runs.length > 0),
  );

  return (
    <PaperBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PaperNavHeader
          eyebrow="FINFINDR"
          title="RIVER RUN"
          onBack={() => router.back()}
        />
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void loadCatalog(true)}
              tintColor={paper.dashboardInk}
            />
          }
        >
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>MIGRATION CONDITIONS</Text>
            <Text style={styles.title}>Daily run primitives</Text>
            <Text style={styles.subtitle}>
              Stage, schedule, push, fishability, and in-river context for
              audited migratory river runs.
            </Text>
          </View>

          {loadingCatalog ? (
            <LoadingCard label="Loading River Run catalog" />
          ) : catalogError ? (
            <MessageCard
              icon="warning-outline"
              title="River Run is unavailable"
              body={catalogError}
            />
          ) : !hasCatalog ? (
            <MessageCard
              icon="shield-checkmark-outline"
              title="River runs are being audited"
              body="Supported river runs will appear here after gauge history, baseline coverage, and source notes pass review."
            />
          ) : (
            <>
              <SelectorBlock
                states={states}
                activeState={activeState}
                rivers={rivers}
                activeRiver={activeRiver}
                selectedSeason={selectedSeason}
                activeRun={activeRun}
                onStateChange={(state) => {
                  setSelectedState(state.state);
                  setSelectedRiverId(state.rivers[0]?.riverId ?? null);
                  setSelectedRunId(null);
                }}
                onRiverChange={(river) => {
                  setSelectedRiverId(river.riverId);
                  setSelectedRunId(null);
                }}
                onSeasonChange={setSelectedSeason}
                onRunChange={(run) => setSelectedRunId(run.runId)}
              />

              {loadingSnapshot ? (
                <LoadingCard label="Loading River Run snapshot" />
              ) : snapshotError ? (
                <MessageCard
                  icon="alert-circle-outline"
                  title="Snapshot unavailable"
                  body={snapshotError}
                />
              ) : snapshot ? (
                <SnapshotView snapshot={snapshot} />
              ) : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </PaperBackground>
  );
}

function SelectorBlock({
  states,
  activeState,
  rivers,
  activeRiver,
  selectedSeason,
  activeRun,
  onStateChange,
  onRiverChange,
  onSeasonChange,
  onRunChange,
}: {
  states: RiverRunCatalogState[];
  activeState?: RiverRunCatalogState;
  rivers: RiverRunCatalogRiver[];
  activeRiver?: RiverRunCatalogRiver;
  selectedSeason: RiverRunSeason;
  activeRun?: RiverRunCatalogRun;
  onStateChange: (state: RiverRunCatalogState) => void;
  onRiverChange: (river: RiverRunCatalogRiver) => void;
  onSeasonChange: (season: RiverRunSeason) => void;
  onRunChange: (run: RiverRunCatalogRun) => void;
}) {
  const runsForSeason =
    activeRiver?.runs.filter((run) => run.season === selectedSeason) ?? [];
  return (
    <PaperCard style={styles.selectorCard}>
      <Text style={styles.cardEyebrow}>SUPPORTED RUN</Text>
      <ChipRow>
        {states.map((state) => (
          <SelectorChip
            key={state.state}
            label={state.displayName ?? state.state}
            active={state.state === activeState?.state}
            onPress={() => onStateChange(state)}
          />
        ))}
      </ChipRow>
      <ChipRow>
        {rivers.map((river) => (
          <SelectorChip
            key={river.riverId}
            label={river.displayName}
            active={river.riverId === activeRiver?.riverId}
            onPress={() => onRiverChange(river)}
          />
        ))}
      </ChipRow>
      <ChipRow>
        {SEASONS.map((season) => {
          const enabled = !!activeRiver?.runs.some(
            (run) => run.season === season,
          );
          return (
            <SelectorChip
              key={season}
              label={
                enabled
                  ? SEASON_LABELS[season]
                  : `${SEASON_LABELS[season]} soon`
              }
              active={season === selectedSeason}
              disabled={!enabled}
              onPress={() => enabled && onSeasonChange(season)}
            />
          );
        })}
      </ChipRow>
      <ChipRow>
        {runsForSeason.map((run) => (
          <SelectorChip
            key={run.runId}
            label={run.displayName}
            active={run.runId === activeRun?.runId}
            onPress={() => onRunChange(run)}
          />
        ))}
      </ChipRow>
    </PaperCard>
  );
}

function SnapshotView({ snapshot }: { snapshot: RiverRunSnapshotResponse }) {
  return (
    <View style={styles.snapshotStack}>
      <View style={styles.primitiveGrid}>
        <PrimitiveCard title="Run Stage" primitive={snapshot.runStage} />
        <PrimitiveCard title="Schedule" primitive={snapshot.schedule} />
        <PrimitiveCard title="Push" primitive={snapshot.push} />
        <PrimitiveCard title="Fishability" primitive={snapshot.fishability} />
        <PrimitiveCard
          title="Fish In River"
          primitive={snapshot.fishInRiver}
          wide
        />
      </View>

      {snapshot.interpretationNote ? (
        <PaperCard tint="#FFF7E2" style={styles.noteCard}>
          <Text style={styles.cardEyebrow}>INTERPRETATION</Text>
          <Text style={styles.noteTitle}>
            {snapshot.interpretationNote.headline}
          </Text>
          {snapshot.interpretationNote.detail ? (
            <Text style={styles.noteBody}>
              {snapshot.interpretationNote.detail}
            </Text>
          ) : null}
        </PaperCard>
      ) : null}

      {snapshot.secondaryNote ? (
        <PaperCard tint="#E8F2FA" style={styles.noteCard}>
          <Text style={styles.cardEyebrow}>FORECAST NOTE</Text>
          <Text style={styles.noteBody}>{snapshot.secondaryNote}</Text>
        </PaperCard>
      ) : null}

      <PaperCard style={styles.detailsCard}>
        <Text style={styles.cardEyebrow}>DATA QUALITY</Text>
        <View style={styles.qualityRow}>
          <Text style={styles.qualityLabel}>{snapshot.dataQuality.label}</Text>
          <Text style={styles.detailMeta}>
            {snapshot.localDate} · {snapshot.refreshSlot}
          </Text>
        </View>
        <View style={styles.metaGrid}>
          <MetaItem
            label="Gauge"
            value={formatMeta(snapshot.freshness.gauge)}
          />
          <MetaItem
            label="Weather"
            value={formatMeta(snapshot.freshness.weather)}
          />
          <MetaItem
            label="Water temp"
            value={formatMeta(snapshot.freshness.waterTemperature)}
          />
          <MetaItem
            label="Next refresh"
            value={formatLocalDateTime(snapshot.nextConditionRefreshAt)}
          />
        </View>
      </PaperCard>

      <PaperCard tint="#F8E8E4" style={styles.detailsCard}>
        <Text style={styles.cardEyebrow}>SAFETY</Text>
        <Text style={styles.noteBody}>
          {snapshot.safety.regulationReminder}
        </Text>
        <Text style={styles.safetySub}>{snapshot.safety.gaugeBasis}</Text>
      </PaperCard>
    </View>
  );
}

function PrimitiveCard({
  title,
  primitive,
  wide = false,
}: {
  title: string;
  primitive: RiverRunPrimitiveDisplay;
  wide?: boolean;
}) {
  const unavailable =
    primitive.score === null || primitive.label === 'Unavailable';
  return (
    <PaperCard
      style={
        wide
          ? [styles.primitiveCard, styles.primitiveWide]
          : styles.primitiveCard
      }
    >
      <View style={styles.primitiveTop}>
        <Text style={styles.cardEyebrow}>{title}</Text>
        {typeof primitive.score === 'number' ? (
          <Text style={[styles.score, unavailable && styles.unavailable]}>
            {Math.round(primitive.score)}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.primitiveLabel, unavailable && styles.unavailable]}>
        {primitive.label}
      </Text>
      {primitive.headline ? (
        <Text style={styles.primitiveHeadline}>{primitive.headline}</Text>
      ) : null}
      {primitive.detail ? (
        <Text style={styles.primitiveDetail}>{primitive.detail}</Text>
      ) : null}
      {primitive.tip ? (
        <Text style={styles.primitiveTip}>{primitive.tip}</Text>
      ) : null}
    </PaperCard>
  );
}

function SelectorChip({
  label,
  active,
  disabled,
  onPress,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        disabled && styles.chipDisabled,
        pressed && !disabled && styles.chipPressed,
      ]}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.chipText,
          active && styles.chipTextActive,
          disabled && styles.chipTextDisabled,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.chipRow}>{children}</View>;
}

function LoadingCard({ label }: { label: string }) {
  return (
    <PaperCard style={styles.messageCard}>
      <ActivityIndicator color={paper.dashboardInk} />
      <Text style={styles.messageTitle}>{label}</Text>
    </PaperCard>
  );
}

function MessageCard({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  return (
    <PaperCard style={styles.messageCard}>
      <View style={styles.messageIcon}>
        <Ionicons name={icon} size={22} color={paper.dashboardInk} />
      </View>
      <Text style={styles.messageTitle}>{title}</Text>
      <Text style={styles.messageBody}>{body}</Text>
    </PaperCard>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function formatMeta(value: string | undefined): string {
  return value ? value.replaceAll('_', ' ') : 'Unknown';
}

function formatLocalDateTime(value: string): string {
  if (!value) return 'Unknown';
  return value.replace('T', ' ').slice(0, 16);
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    padding: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
    gap: paperSpacing.lg,
  },
  intro: { gap: 6 },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.red,
    letterSpacing: 0,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 30,
    lineHeight: 34,
    color: paper.dashboardInk,
  },
  subtitle: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: paper.dashboardMuted,
  },
  selectorCard: {
    padding: paperSpacing.md,
    gap: paperSpacing.sm,
  },
  cardEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardMuted,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: '100%',
  },
  chipActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipPressed: {
    opacity: 0.82,
  },
  chipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardInk,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextDisabled: {
    color: paper.dashboardMuted,
  },
  snapshotStack: { gap: paperSpacing.lg },
  primitiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primitiveCard: {
    width: '48%',
    minWidth: 150,
    flexGrow: 1,
    padding: paperSpacing.md,
    gap: 8,
  },
  primitiveWide: {
    width: '100%',
  },
  primitiveTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  score: {
    fontFamily: paperFonts.monoBold,
    fontSize: 24,
    color: paper.dashboardInk,
  },
  unavailable: {
    color: paper.dashboardMuted,
  },
  primitiveLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 23,
    color: paper.dashboardInk,
  },
  primitiveHeadline: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    lineHeight: 18,
    color: paper.dashboardInk,
  },
  primitiveDetail: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  primitiveTip: {
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
    paddingTop: 8,
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
    color: paper.dashboardInk,
  },
  noteCard: {
    padding: paperSpacing.md,
    gap: 8,
  },
  noteTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: paper.dashboardInk,
  },
  noteBody: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: paper.dashboardInk,
  },
  detailsCard: {
    padding: paperSpacing.md,
    gap: 12,
  },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  qualityLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 22,
    color: paper.dashboardInk,
  },
  detailMeta: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    width: '47%',
    minWidth: 130,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    backgroundColor: paper.dashboardWhite,
    padding: 10,
  },
  metaLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardMuted,
    textTransform: 'uppercase',
  },
  metaValue: {
    marginTop: 4,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
    textTransform: 'capitalize',
  },
  safetySub: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: paper.dashboardMuted,
  },
  messageCard: {
    alignItems: 'center',
    padding: paperSpacing.xl,
    gap: 12,
  },
  messageIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: paper.dashboardHair,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTitle: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 22,
    textAlign: 'center',
    color: paper.dashboardInk,
  },
  messageBody: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: paper.dashboardMuted,
  },
});
