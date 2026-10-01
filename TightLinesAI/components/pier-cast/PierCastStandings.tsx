import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  type ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type {
  PierCastConditionsCatalogCityV4,
  PierCastConditionsCatalogResponseV4,
  PierCastGreatLakeIdV4,
  PierCastLeaderboardCityReadV4,
  PierCastLeaderboardResponseV4,
  PierCastSeasonalBandV4,
  PierCastTargetSpeciesOptionV4,
} from "../../lib/pierCastConditionsV4";
import {
  formatConditionsFreshness,
  PIER_CAST_SPECIES_LABELS,
  PIER_CAST_STATE_LABELS,
} from "../../lib/pierCastConditionsPresentation";
import type { PierCastSpeciesId } from "../../lib/pierCastContracts";
import { selectPierCastCoveredStructures } from "../../lib/pierCastCoveredStructures";
import { getPierCastSpeciesImage } from "../../lib/pierCastSpeciesImages";
import {
  isPierCastSalmonid,
  PIER_CAST_LAKE_ORDER,
  PIER_CAST_SALMONID_ORDER,
  PIER_CAST_STANDINGS_BAND_MEANINGS,
  PIER_CAST_STANDINGS_BANDS,
  PIER_CAST_STANDINGS_METER,
  PIER_CAST_STANDINGS_TOP_COUNT,
  type PierCastLakeFilter,
  pierCastLakeName,
  standingsBandRank,
  standingsForecastDate,
  standingsLeaderSummary,
  standingsStageLabel,
  standingsTrendCue,
  standingsUnrankedReason,
  standingsWaterLine,
} from "../../lib/pierCastStandingsPresentation";
import { hapticSelection } from "../../lib/safeHaptics";
import { paper, paperFonts } from "../../lib/theme";
import { usePaperBonePulse } from "../../lib/usePaperBonePulse";
import { TopographicLines } from "../paper";

const INK = paper.dashboardInk;
const GOLD = paper.medalGold;
const GOLD_INK = "#6B5310";
const CORNER_RED = paper.red;

/** Short names keep headings and rows readable. */
const SPECIES_SHORT: Partial<Record<PierCastSpeciesId, string>> = {
  chinook_salmon: "Chinook",
  coho_salmon: "Coho",
  yellow_perch: "Perch",
  lake_whitefish: "Whitefish",
  smallmouth_bass: "Smallmouth",
  largemouth_bass: "Largemouth",
  freshwater_drum: "Drum",
  channel_catfish: "Catfish",
  northern_pike: "Pike",
};

function speciesName(speciesId: PierCastSpeciesId): string {
  return PIER_CAST_SPECIES_LABELS[speciesId] ?? speciesId;
}

function speciesShort(speciesId: PierCastSpeciesId): string {
  return SPECIES_SHORT[speciesId] ?? speciesName(speciesId);
}

function stateName(code: string): string {
  return PIER_CAST_STATE_LABELS[code] ?? code;
}

export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduce(value);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduce,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  return reduce;
}

/** Fades/slides children in whenever `token` changes. */
export function Reveal({
  token,
  delay = 0,
  from = "below",
  reduceMotion,
  children,
}: {
  token: string;
  delay?: number;
  from?: "below" | "left";
  reduceMotion: boolean;
  children: ReactNode;
}) {
  const progress = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: from === "left" ? 650 : 480,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, from, progress, reduceMotion, token]);
  const offset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [from === "left" ? -26 : 16, 0],
  });
  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: from === "left" ? [{ translateX: offset }] : [{ translateY: offset }],
      }}
    >
      {children}
    </Animated.View>
  );
}

/** Five-segment Off-season → Prime meter that fills on reveal. */
export function BandMeter({
  level,
  token,
  delay = 0,
  compact = false,
  reduceMotion,
}: {
  level: number;
  token: string;
  delay?: number;
  compact?: boolean;
  reduceMotion: boolean;
}) {
  const fill = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  useEffect(() => {
    if (reduceMotion) {
      fill.setValue(1);
      return;
    }
    fill.setValue(0);
    const animation = Animated.timing(fill, {
      toValue: 1,
      duration: 800,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, fill, reduceMotion, token]);
  return (
    <View
      style={[styles.meter, compact && styles.meterCompact]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {PIER_CAST_STANDINGS_METER.map((color, index) => (
        <View key={color} style={[styles.meterSegment, compact && styles.meterSegmentCompact]}>
          <Animated.View
            style={[
              styles.meterFill,
              {
                backgroundColor: color,
                opacity: index < level ? 1 : 0.14,
                transform: [{ scaleX: fill }],
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

export function Fish({
  speciesId,
  width,
  height,
}: {
  speciesId: PierCastSpeciesId;
  width: number;
  height: number;
}) {
  return (
    <Image
      source={getPierCastSpeciesImage(speciesId) as ImageSourcePropType}
      style={{ width, height }}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}

export function BandChip({ band }: { band: PierCastSeasonalBandV4 }) {
  const style = PIER_CAST_STANDINGS_BANDS[band];
  return (
    <View style={[styles.chip, { backgroundColor: style.chip, borderColor: style.color }]}>
      <Text style={[styles.chipText, { color: style.ink }]}>{style.label.toUpperCase()}</Text>
    </View>
  );
}

export function TrendArrow({ trend }: { trend: "building" | "steady" | "fading" | null }) {
  const cue = standingsTrendCue(trend);
  if (!cue) return null;
  return (
    <View style={styles.trend}>
      <Ionicons name={cue.icon} size={12} color={cue.color} />
    </View>
  );
}

// ─── Sheets ───────────────────────────────────────────────────────────────

export function BottomSheet({
  visible,
  onClose,
  eyebrow,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.sheetWrap}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
        >
          <View style={styles.backdrop} />
        </Pressable>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
          <View style={styles.grab} />
          <View style={styles.sheetHead}>
            <View style={styles.flex}>
              <Text style={styles.sheetEyebrow}>{eyebrow}</Text>
              <Text style={styles.sheetTitle}>{title}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={({ pressed }) => [styles.sheetClose, pressed && styles.pressed]}
            >
              <Ionicons name="close" size={18} color={INK} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function SpeciesTile({
  option,
  selected,
  onPress,
}: {
  option: PierCastTargetSpeciesOptionV4;
  selected: boolean;
  onPress: () => void;
}) {
  const band = option.bestSeasonalBand ? PIER_CAST_STANDINGS_BANDS[option.bestSeasonalBand] : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${speciesName(option.speciesId)}${band ? `, best rating today ${band.label}` : ", not rated today"}, ${option.availableCityCount} cities`}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, selected && styles.tileOn, pressed && styles.pressed]}
    >
      <View style={styles.tileFish}>
        <Fish speciesId={option.speciesId} width={48} height={48} />
      </View>
      <View style={styles.flex}>
        <Text style={[styles.tileName, selected && styles.textOnInk]} numberOfLines={2}>
          {speciesName(option.speciesId)}
        </Text>
        <View style={styles.tileMeta}>
          <View style={[styles.dot, { backgroundColor: band?.color ?? "#999999" }]} />
          <Text style={[styles.tileMetaText, selected && styles.textOnInkSoft]} numberOfLines={1}>
            {band ? `Best: ${band.label}` : "Not rated"} · {option.availableCityCount}{" "}
            {option.availableCityCount === 1 ? "city" : "cities"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function SpeciesSheet({
  visible,
  options,
  selectedSpeciesId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: PierCastTargetSpeciesOptionV4[];
  selectedSpeciesId: PierCastSpeciesId | null;
  onSelect: (speciesId: PierCastSpeciesId) => void;
  onClose: () => void;
}) {
  const salmonids = PIER_CAST_SALMONID_ORDER.flatMap((speciesId) =>
    options.filter((option) => option.speciesId === speciesId)
  );
  const others = options.filter((option) => !isPierCastSalmonid(option.speciesId));
  const groups = [
    { label: "SALMON & TROUT", items: salmonids },
    {
      label: "IN SEASON NOW",
      items: others.filter((option) => option.placement === "commonly_targeted_now"),
    },
    {
      label: "OTHER SPECIES",
      items: others.filter((option) => option.placement !== "commonly_targeted_now"),
    },
  ].filter((group) => group.items.length > 0);
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      eyebrow="TARGET SPECIES"
      title="What are you after?"
    >
      {groups.map((group) => (
        <View key={group.label}>
          <Text style={styles.sheetGroupLabel}>{group.label}</Text>
          <View style={styles.tileGrid}>
            {group.items.map((option) => (
              <View key={option.speciesId} style={styles.tileCell}>
                <SpeciesTile
                  option={option}
                  selected={option.speciesId === selectedSpeciesId}
                  onPress={() => {
                    hapticSelection();
                    onSelect(option.speciesId);
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </BottomSheet>
  );
}

function InfoSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      eyebrow="HOW RATINGS WORK"
      title="Why a pier ranks where it does"
    >
      <View style={styles.infoStep}>
        <View style={styles.infoNumber}><Text style={styles.infoNumberText}>1</Text></View>
        <View style={styles.flex}>
          <Text style={styles.infoStepTitle}>Season comes first</Text>
          <Text style={styles.infoStepBody}>
            Every city gets one rating for your species today, based on when that fish usually shows up at that part of the lake.
          </Text>
        </View>
      </View>
      <View style={styles.infoStep}>
        <View style={styles.infoNumber}><Text style={styles.infoNumberText}>2</Text></View>
        <View style={styles.flex}>
          <Text style={styles.infoStepTitle}>Water-temp suitability orders the rest</Text>
          <Text style={styles.infoStepBody}>
            Among cities with the same rating, the one whose modeled water temperature best suits that fish ranks higher.
          </Text>
        </View>
      </View>
      <View style={styles.legend}>
        {PIER_CAST_STANDINGS_BAND_MEANINGS.map(({ band, meaning }, index) => {
          const style = PIER_CAST_STANDINGS_BANDS[band];
          return (
            <View key={band} style={[styles.legendRow, index > 0 && styles.legendRowBorder]}>
              <View style={[styles.legendSwatch, { backgroundColor: style.color }]} />
              <Text style={styles.legendLabel}>{style.label}</Text>
              <Text style={styles.legendMeaning}>{meaning}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legendTrendRow}>
        <Ionicons name="arrow-up" size={13} color="#1F6B3A" />
        <Text style={styles.legendMeaning}>Season building</Text>
        <Ionicons name="arrow-down" size={13} color="#9A4A12" style={styles.legendTrendGap} />
        <Text style={styles.legendMeaning}>Season fading</Text>
      </View>
      <Text style={styles.infoFine}>
        Ratings are research-based outlooks, not catch guarantees. Water temperatures are NOAA nearshore model estimates, not pier readings.
      </Text>
    </BottomSheet>
  );
}

// ─── Hero + species picker ────────────────────────────────────────────────

function Hero({
  speciesId,
  forecastDate,
  freshness,
  ratedLabel,
  primeLabel,
  primeValue,
  primeColor,
  token,
  reduceMotion,
}: {
  speciesId: PierCastSpeciesId | null;
  forecastDate: string;
  freshness: string;
  ratedLabel: string;
  primeLabel: string;
  primeValue: string;
  primeColor: string;
  token: string;
  reduceMotion: boolean;
}) {
  return (
    <View style={styles.hero}>
      <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={7} />
      <Reveal token="hero" reduceMotion={reduceMotion}>
        <Text style={styles.heroEyebrow}>— TODAY ON THE GREAT LAKES —</Text>
        <Text style={styles.heroTitle} accessibilityRole="header">THE STANDINGS</Text>
        <Text style={styles.heroSub}>
          {speciesId ? (
            <>
              The best piers for <Text style={styles.heroSubStrong}>{speciesName(speciesId)}</Text>, ranked for today.
            </>
          ) : (
            "Pick a species to rank today's piers."
          )}
        </Text>
        <View style={styles.scale} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={styles.scaleEnd}>OFF</Text>
          <View style={styles.scaleBar}>
            {PIER_CAST_STANDINGS_METER.map((color) => (
              <View key={color} style={[styles.scaleSegment, { backgroundColor: color }]} />
            ))}
          </View>
          <Text style={styles.scaleEnd}>PRIME</Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>FORECAST</Text>
            <Text style={styles.statValue}>{forecastDate}</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statLabel}>CITIES RATED</Text>
            <Text style={styles.statValue}>{ratedLabel}</Text>
          </View>
          <View style={[styles.stat, styles.statDivider]}>
            <Text style={styles.statLabel}>{primeLabel}</Text>
            <Text key={token} style={[styles.statValue, { color: primeColor }]}>{primeValue}</Text>
          </View>
        </View>
        <View style={styles.freshness}>
          <View style={styles.freshnessDot} />
          <Text style={styles.freshnessText}>{freshness} · NOAA nearshore model</Text>
        </View>
      </Reveal>
    </View>
  );
}

function SpeciesTab({
  option,
  selected,
  onPress,
}: {
  option: PierCastTargetSpeciesOptionV4;
  selected: boolean;
  onPress: () => void;
}) {
  const band = option.bestSeasonalBand ? PIER_CAST_STANDINGS_BANDS[option.bestSeasonalBand] : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${speciesName(option.speciesId)}${band ? `, best rating today ${band.label}` : ", not rated today"}`}
      onPress={onPress}
      style={({ pressed }) => [styles.tab, selected && styles.tabOn, pressed && styles.tabPressed]}
    >
      <View style={styles.tabFish}>
        <Fish speciesId={option.speciesId} width={86} height={86} />
      </View>
      <Text style={[styles.tabName, selected && styles.textOnInk]} numberOfLines={2}>
        {speciesName(option.speciesId)}
      </Text>
      <View style={styles.tabBest}>
        <View style={[styles.dot, { backgroundColor: band?.color ?? "#999999" }]} />
        <Text style={[styles.tabBestText, selected && styles.textOnInkSoft]} numberOfLines={1}>
          {band ? `Best: ${band.label}` : "Not rated"}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────

type RankedRow = { row: PierCastLeaderboardCityReadV4; rank: number };

function medalFor(rank: number) {
  if (rank === 2) return { ring: "#9C9C9C", fill: "#F1F1F1", ink: "#4A4A4A", label: "SILVER" };
  if (rank === 3) return { ring: paper.medalBronze, fill: "#FBEBDD", ink: "#7A4414", label: "BRONZE" };
  return { ring: "rgba(0,0,0,0.18)", fill: "#FFFFFF", ink: INK, label: "" };
}

function LeaderCard({
  entry,
  city,
  speciesId,
  weak,
  alternatives,
  onOpen,
  onSelectSpecies,
  token,
  reduceMotion,
}: {
  entry: RankedRow;
  city: PierCastConditionsCatalogCityV4 | null;
  speciesId: PierCastSpeciesId;
  weak: boolean;
  alternatives: PierCastTargetSpeciesOptionV4[];
  onOpen: () => void;
  onSelectSpecies: (speciesId: PierCastSpeciesId) => void;
  token: string;
  reduceMotion: boolean;
}) {
  const { row } = entry;
  const outlook = row.seasonalOutlook;
  const band = outlook.status === "available" ? outlook.band : null;
  const bandStyle = band ? PIER_CAST_STANDINGS_BANDS[band] : null;
  const structures = city ? selectPierCastCoveredStructures(city.structures) : [];
  const pierLine = structures.length === 0
    ? null
    : structures.length === 1
    ? structures[0]!.displayName
    : `${structures[0]!.displayName} + ${structures.length - 1} more`;
  const summary = standingsLeaderSummary(row, speciesShort(speciesId));
  const weakNote = band === "usually_off"
    ? `${speciesName(speciesId)} is mostly off-season right now.`
    : `${speciesName(speciesId)} fishing is slow everywhere right now.`;
  return (
    <View style={styles.leaderWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${weak ? "Best available" : "Today's leader"}: ${row.displayName}, ${stateName(row.stateCode)}. ${bandStyle?.label ?? "Unrated"}. ${summary} Opens full report.`}
        onPress={() => {
          hapticSelection();
          onOpen();
        }}
        style={({ pressed }) => [styles.leader, pressed && styles.leaderPressed]}
      >
        <View style={styles.leaderTopBar} />
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={styles.leaderBody}>
          <View style={styles.leaderHeadRow}>
            <View style={[styles.stamp, weak && styles.stampWeak]}>
              <Ionicons name={weak ? "compass-outline" : "trophy"} size={13} color={weak ? INK : "#8A6A14"} />
              <Text style={[styles.stampText, weak && styles.stampTextWeak]}>
                {weak ? "BEST AVAILABLE" : "TODAY'S LEADER"}
              </Text>
            </View>
            <View style={styles.bigMedal}>
              <View style={styles.bigMedalCircle}><Text style={styles.bigMedalNumber}>1</Text></View>
              <Text style={styles.bigMedalLabel}>GOLD</Text>
            </View>
          </View>
          <Text style={styles.leaderState}>{stateName(row.stateCode).toUpperCase()}</Text>
          <View style={styles.leaderIdentity}>
            <View style={styles.flex}>
              <Text style={styles.leaderCity} numberOfLines={2}>{row.displayName}</Text>
              {pierLine ? <Text style={styles.leaderPier} numberOfLines={1}>{pierLine}</Text> : null}
            </View>
            <Reveal token={token} from="left" delay={120} reduceMotion={reduceMotion}>
              <View style={styles.leaderFish}>
                <Fish speciesId={speciesId} width={96} height={96} />
              </View>
            </Reveal>
          </View>
          <View style={styles.rule} />
          <View style={styles.verdictRow}>
            <View style={styles.flex}>
              <Text style={styles.verdictLabel}>TODAY'S RATING</Text>
              <View style={styles.verdictLine}>
                <Text style={[styles.verdict, { color: bandStyle?.ink ?? INK }]}>
                  {(bandStyle?.label ?? "Unrated").toUpperCase()}
                </Text>
                <TrendArrow trend={outlook.status === "available" ? outlook.trend : null} />
              </View>
            </View>
            {outlook.status === "available" && bandStyle ? (
              <View style={[styles.chip, styles.stageChip, { backgroundColor: bandStyle.chip, borderColor: bandStyle.color }]}>
                <View style={[styles.dot, { backgroundColor: bandStyle.color }]} />
                <Text style={[styles.chipText, { color: bandStyle.ink }]} numberOfLines={1}>
                  {standingsStageLabel(outlook.stage, outlook.band).toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>
          <BandMeter level={bandStyle?.level ?? 0} token={token} delay={250} reduceMotion={reduceMotion} />
          {summary ? <Text style={styles.leaderWhy}>{summary}</Text> : null}
          {weak ? (
            <View style={styles.weakBox}>
              <Text style={styles.weakText}>{weakNote}</Text>
              {alternatives.length > 0 ? (
                <>
                  <Text style={styles.weakPrompt}>Try a species that's in season:</Text>
                  <View style={styles.weakChips}>
                    {alternatives.map((option) => {
                      const altBand = option.bestSeasonalBand
                        ? PIER_CAST_STANDINGS_BANDS[option.bestSeasonalBand]
                        : null;
                      return (
                        <Pressable
                          key={option.speciesId}
                          accessibilityRole="button"
                          accessibilityLabel={`Switch to ${speciesName(option.speciesId)}${altBand ? `, best rating ${altBand.label}` : ""}`}
                          onPress={() => {
                            hapticSelection();
                            onSelectSpecies(option.speciesId);
                          }}
                          style={({ pressed }) => [styles.weakChip, pressed && styles.pressed]}
                        >
                          <View style={[styles.dot, { backgroundColor: altBand?.color ?? "#999999" }]} />
                          <Text style={styles.weakChipText}>{speciesName(option.speciesId)}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              ) : null}
            </View>
          ) : null}
        </View>
        <View style={styles.leaderCta}>
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Text style={styles.leaderCtaText}>OPEN FULL PIERCAST</Text>
          <Ionicons name="arrow-forward" size={18} color={INK} />
        </View>
      </Pressable>
    </View>
  );
}

function ChaserRow({
  entry,
  speciesId,
  index,
  token,
  reduceMotion,
  onOpen,
}: {
  entry: RankedRow;
  speciesId: PierCastSpeciesId;
  index: number;
  token: string;
  reduceMotion: boolean;
  onOpen: () => void;
}) {
  const { row, rank } = entry;
  const outlook = row.seasonalOutlook;
  const band = outlook.status === "available" ? outlook.band : null;
  const bandStyle = band ? PIER_CAST_STANDINGS_BANDS[band] : null;
  const medal = medalFor(rank);
  const waterLine = standingsWaterLine(row.thermalMatch);
  const trend = outlook.status === "available" ? outlook.trend : null;
  const trendCue = standingsTrendCue(trend);
  const delay = 120 + Math.min(index, 8) * 60;
  return (
    <Reveal token={token} delay={delay} reduceMotion={reduceMotion}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Rank ${rank}, ${row.displayName}, ${stateName(row.stateCode)}. ${bandStyle?.label ?? "Unrated"}${trendCue ? `, ${trendCue.label.toLowerCase()}` : ""}. ${waterLine ?? ""}. Opens full report.`}
        onPress={() => {
          hapticSelection();
          onOpen();
        }}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <View style={[styles.rowEdge, { backgroundColor: rank <= 3 ? medal.ring : bandStyle?.color ?? "#999999" }]} />
        <View style={styles.medal}>
          <View style={[styles.medalCircle, { borderColor: medal.ring, backgroundColor: medal.fill }]}>
            <Text style={[styles.medalNumber, { color: medal.ink }]}>{rank}</Text>
          </View>
          {medal.label ? <Text style={styles.medalLabel}>{medal.label}</Text> : null}
        </View>
        <View style={styles.rowMain}>
          <Text style={styles.rowState}>{stateName(row.stateCode).toUpperCase()}</Text>
          <Text style={styles.rowCity} numberOfLines={1}>{row.displayName}</Text>
          {waterLine ? <Text style={styles.rowLine} numberOfLines={1}>{waterLine}</Text> : null}
          <BandMeter level={bandStyle?.level ?? 0} token={token} delay={delay + 180} compact reduceMotion={reduceMotion} />
        </View>
        <View style={styles.rowRight}>
          <View style={styles.rowFish}>
            <Fish speciesId={speciesId} width={48} height={48} />
          </View>
          <View style={styles.rowChipLine}>
            {band ? <BandChip band={band} /> : null}
            <TrendArrow trend={trend} />
          </View>
        </View>
        <View style={styles.go}>
          <Ionicons name="chevron-forward" size={16} color={INK} />
        </View>
      </Pressable>
    </Reveal>
  );
}

// ─── Find your PierCast ───────────────────────────────────────────────────

function FinderRow({
  city,
  lakeId,
  withState,
  onOpen,
}: {
  city: PierCastConditionsCatalogCityV4;
  lakeId: PierCastGreatLakeIdV4 | undefined;
  withState: boolean;
  onOpen: () => void;
}) {
  const speciesCount = Array.isArray(city.supportedSpeciesIds) ? city.supportedSpeciesIds.length : 0;
  const meta = [
    withState ? stateName(city.stateCode) : null,
    lakeId ? `Lake ${pierCastLakeName(lakeId)}` : null,
    `${speciesCount} ${speciesCount === 1 ? "species" : "species"}`,
  ].filter(Boolean).join(" · ");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${city.displayName}, ${stateName(city.stateCode)}. Opens full report.`}
      onPress={() => {
        hapticSelection();
        onOpen();
      }}
      style={({ pressed }) => [styles.finderRow, pressed && styles.finderRowPressed]}
    >
      <View style={styles.finderPin}>
        <Ionicons name="location" size={16} color={paper.dashboardBlue} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.finderCity}>{city.displayName}</Text>
        <Text style={styles.finderMeta}>{meta}</Text>
      </View>
      <Text style={styles.finderOpen}>REPORT</Text>
      <Ionicons name="chevron-forward" size={16} color={INK} style={styles.dim} />
    </Pressable>
  );
}

function Finder({
  cities,
  cityLakes,
  onOpenCity,
}: {
  cities: PierCastConditionsCatalogCityV4[];
  cityLakes: Readonly<Record<string, PierCastGreatLakeIdV4>>;
  onOpenCity: (cityId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const normalized = query.trim().toLocaleLowerCase();
  const byName = (a: PierCastConditionsCatalogCityV4, b: PierCastConditionsCatalogCityV4) =>
    a.displayName.localeCompare(b.displayName);
  const results = useMemo(
    () =>
      normalized
        ? cities.filter((city) =>
          `${city.displayName} ${stateName(city.stateCode)} ${city.stateCode}`
            .toLocaleLowerCase()
            .includes(normalized)
        ).sort(byName)
        : [],
    [cities, normalized],
  );
  const states = useMemo(() => {
    const codes = [...new Set(cities.map((city) => city.stateCode))];
    return codes
      .map((code) => {
        const stateCities = cities.filter((city) => city.stateCode === code).sort(byName);
        const lakeIds = PIER_CAST_LAKE_ORDER.filter((lakeId) =>
          stateCities.some((city) => cityLakes[city.cityId] === lakeId)
        );
        const allKnown = stateCities.every((city) => cityLakes[city.cityId] !== undefined);
        const groups = allKnown && lakeIds.length > 1
          ? lakeIds.map((lakeId) => ({
            lakeId: lakeId as PierCastGreatLakeIdV4 | null,
            cities: stateCities.filter((city) => cityLakes[city.cityId] === lakeId),
          }))
          : [{ lakeId: null as PierCastGreatLakeIdV4 | null, cities: stateCities }];
        return { code, cities: stateCities, lakeIds, groups };
      })
      .sort((a, b) => b.cities.length - a.cities.length || a.code.localeCompare(b.code));
  }, [cities, cityLakes]);

  return (
    <View style={styles.finder}>
      <View style={styles.finderCard}>
        <View style={styles.finderTop}>
          <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={4} />
          <View style={styles.finderBadge}>
            <Ionicons name="location" size={20} color={paper.gold} />
          </View>
          <Text style={styles.finderEyebrow}>— ANY PIER CITY —</Text>
          <Text style={styles.finderTitle} accessibilityRole="header">Find your PierCast</Text>
          <Text style={styles.finderSub}>{cities.length} pier cities · Tap one for its full report</Text>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color="#555555" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search a city"
              placeholderTextColor="#777777"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
              style={styles.searchInput}
              accessibilityLabel="Search PierCast cities"
            />
            {query.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={8}
                onPress={() => setQuery("")}
                style={styles.searchClear}
              >
                <Ionicons name="close" size={14} color={INK} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {normalized ? (
          <View style={styles.results}>
            <Text style={styles.resultsLabel}>
              {results.length} {results.length === 1 ? "CITY" : "CITIES"}
            </Text>
            {results.map((city) => (
              <FinderRow
                key={city.cityId}
                city={city}
                lakeId={cityLakes[city.cityId]}
                withState
                onOpen={() => onOpenCity(city.cityId)}
              />
            ))}
            {results.length === 0 ? (
              <Text style={styles.finderEmpty}>No pier cities match “{query.trim()}”.</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.accordionList}>
            {states.map((state, index) => {
              const open = Boolean(openStates[state.code]);
              return (
                <View key={state.code} style={index > 0 && styles.accordionBorder}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: open }}
                    accessibilityLabel={`${stateName(state.code)}, ${state.cities.length} pier cities`}
                    onPress={() => {
                      hapticSelection();
                      setOpenStates((current) => ({ ...current, [state.code]: !current[state.code] }));
                    }}
                    style={({ pressed }) => [styles.accordionHead, pressed && styles.finderRowPressed]}
                  >
                    <View style={styles.stateCode}><Text style={styles.stateCodeText}>{state.code}</Text></View>
                    <View style={styles.flex}>
                      <Text style={styles.stateName}>{stateName(state.code)}</Text>
                      {state.lakeIds.length > 0 ? (
                        <Text style={styles.stateLakes}>
                          {state.lakeIds.map((lakeId) => `Lake ${pierCastLakeName(lakeId)}`).join(" & ")}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.stateCount}><Text style={styles.stateCountText}>{state.cities.length}</Text></View>
                    <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color={INK} />
                  </Pressable>
                  {open ? (
                    <View style={styles.accordionBody}>
                      {state.groups.map((group) => (
                        <View key={group.lakeId ?? "all"}>
                          {group.lakeId ? (
                            <View style={styles.lakeLabelRow}>
                              <View style={styles.lakeDot} />
                              <Text style={styles.lakeLabel}>
                                LAKE {group.lakeId.toUpperCase()} · {group.cities.length}
                              </Text>
                            </View>
                          ) : null}
                          {group.cities.map((city) => (
                            <FinderRow
                              key={city.cityId}
                              city={city}
                              lakeId={cityLakes[city.cityId]}
                              withState={false}
                              onOpen={() => onOpenCity(city.cityId)}
                            />
                          ))}
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Screen body ──────────────────────────────────────────────────────────

export function PierCastStandings({
  catalog,
  leaderboard,
  selectedSpeciesId,
  selectionLoading,
  lakeFilter,
  cityLakes,
  onChangeLake,
  onSelectSpecies,
  onOpenCity,
  onOpenFinderCity,
  onOpenMap,
  footer,
}: {
  catalog: PierCastConditionsCatalogResponseV4;
  leaderboard: PierCastLeaderboardResponseV4;
  selectedSpeciesId: PierCastSpeciesId | null;
  selectionLoading: boolean;
  lakeFilter: PierCastLakeFilter;
  cityLakes: Readonly<Record<string, PierCastGreatLakeIdV4>>;
  onChangeLake: (lake: PierCastLakeFilter) => void;
  onSelectSpecies: (speciesId: PierCastSpeciesId) => void;
  onOpenCity: (cityId: string) => void;
  onOpenFinderCity: (cityId: string) => void;
  onOpenMap: () => void;
  footer?: ReactNode;
}) {
  const reduceMotion = useReduceMotion();
  const [expanded, setExpanded] = useState(false);
  const [unratedOpen, setUnratedOpen] = useState(false);
  const [sheet, setSheet] = useState<"species" | "info" | null>(null);

  const boardMatches = Boolean(
    selectedSpeciesId && leaderboard.selectedSpeciesId === selectedSpeciesId,
  );
  const allRows = boardMatches ? leaderboard.cities : [];

  const lakeCounts = useMemo(() => {
    const counts = new Map<PierCastGreatLakeIdV4, number>();
    allRows.forEach((row) => counts.set(row.lakeId, (counts.get(row.lakeId) ?? 0) + 1));
    return counts;
  }, [allRows]);
  const lakes = PIER_CAST_LAKE_ORDER.filter((lakeId) => (lakeCounts.get(lakeId) ?? 0) > 0);
  const effectiveLake: PierCastLakeFilter = lakeFilter !== "all" && !lakes.includes(lakeFilter)
    ? "all"
    : lakeFilter;
  const lakeRows = allRows.filter((row) => effectiveLake === "all" || row.lakeId === effectiveLake);
  // Server order is authoritative; ranks are re-numbered inside a lake filter.
  const ranked: RankedRow[] = lakeRows
    .filter((row) => row.rankingDisposition === "ranked")
    .map((row, index) => ({ row, rank: index + 1 }));
  const unranked = lakeRows.filter((row) => row.rankingDisposition !== "ranked");
  const token = `${selectedSpeciesId ?? "none"}|${effectiveLake}`;

  useEffect(() => {
    setExpanded(false);
    setUnratedOpen(false);
  }, [token]);

  const leader = ranked[0] ?? null;
  const leaderBand = leader?.row.seasonalOutlook.status === "available"
    ? leader.row.seasonalOutlook.band
    : null;
  const weakLeader = leaderBand === "poor" || leaderBand === "usually_off";
  const chasers = ranked.slice(1);
  const shownChasers = expanded ? chasers : chasers.slice(0, PIER_CAST_STANDINGS_TOP_COUNT - 1);
  const groups: Array<{ band: PierCastSeasonalBandV4; rows: RankedRow[] }> = [];
  shownChasers.forEach((entry) => {
    const band = entry.row.seasonalOutlook.status === "available" ? entry.row.seasonalOutlook.band : null;
    if (!band) return;
    const last = groups[groups.length - 1];
    if (last && last.band === band) last.rows.push(entry);
    else groups.push({ band, rows: [entry] });
  });

  const options = leaderboard.targetSpecies;
  const tabOptions = [
    ...PIER_CAST_SALMONID_ORDER.flatMap((speciesId) =>
      options.filter((option) => option.speciesId === speciesId)
    ),
    ...options.filter((option) =>
      !isPierCastSalmonid(option.speciesId) &&
      standingsBandRank(option.bestSeasonalBand) >= standingsBandRank("good")
    ),
  ];
  if (
    selectedSpeciesId && !tabOptions.some((option) => option.speciesId === selectedSpeciesId)
  ) {
    const selectedOption = options.find((option) => option.speciesId === selectedSpeciesId);
    if (selectedOption) tabOptions.unshift(selectedOption);
  }
  const alternatives = [
    ...PIER_CAST_SALMONID_ORDER.flatMap((speciesId) =>
      options.filter((option) => option.speciesId === speciesId)
    ),
    ...options.filter((option) => !isPierCastSalmonid(option.speciesId)),
  ]
    .filter((option) =>
      option.speciesId !== selectedSpeciesId &&
      standingsBandRank(option.bestSeasonalBand) >= standingsBandRank("good")
    )
    .slice(0, 3);

  const primeCount = ranked.filter((entry) =>
    entry.row.seasonalOutlook.status === "available" && entry.row.seasonalOutlook.band === "excellent"
  ).length;
  const primeLabel = primeCount > 0 || !leaderBand ? "PRIME TODAY" : "BEST TODAY";
  const primeValue = primeCount > 0 || !leaderBand
    ? String(primeCount).padStart(2, "0")
    : PIER_CAST_STANDINGS_BANDS[leaderBand].label;
  const primeColor = primeCount > 0 ? "#7EDC98" : "#FFFFFF";
  const catalogById = new Map(catalog.cities.map((city) => [city.cityId, city] as const));

  const sectionKicker = effectiveLake === "all"
    ? `ALL GREAT LAKES · ${ranked.length} RATED`
    : `LAKE ${effectiveLake.toUpperCase()} · ${ranked.length} RATED`;

  return (
    <View>
      <Hero
        speciesId={selectedSpeciesId}
        forecastDate={standingsForecastDate(leaderboard)}
        freshness={formatConditionsFreshness(leaderboard.generatedAt)}
        ratedLabel={boardMatches ? `${ranked.length}/${lakeRows.length}` : "—"}
        primeLabel={primeLabel}
        primeValue={boardMatches ? primeValue : "—"}
        primeColor={primeColor}
        token={token}
        reduceMotion={reduceMotion}
      />

      <View style={styles.target}>
        <View style={styles.targetHead}>
          <Text style={styles.targetEyebrow}>WHAT ARE YOU TARGETING?</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`See all ${options.length} species`}
            hitSlop={8}
            onPress={() => {
              hapticSelection();
              setSheet("species");
            }}
            style={({ pressed }) => [styles.targetAll, pressed && styles.pressed]}
          >
            <Text style={styles.targetAllText}>All species</Text>
            <Ionicons name="chevron-forward" size={14} color={INK} />
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {tabOptions.map((option) => (
            <SpeciesTab
              key={option.speciesId}
              option={option}
              selected={option.speciesId === selectedSpeciesId}
              onPress={() => {
                hapticSelection();
                if (option.speciesId !== selectedSpeciesId) onSelectSpecies(option.speciesId);
              }}
            />
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`See all ${options.length} species`}
            onPress={() => {
              hapticSelection();
              setSheet("species");
            }}
            style={({ pressed }) => [styles.tab, styles.tabMore, pressed && styles.tabPressed]}
          >
            <Ionicons name="ellipsis-horizontal" size={28} color={paper.dashboardBlue} />
            <Text style={styles.tabMoreText}>All {options.length} species</Text>
          </Pressable>
        </ScrollView>
        <View style={styles.sectionHead}>
          <View style={styles.flex}>
            <Text style={styles.sectionKicker}>{sectionKicker}</Text>
            <Text style={styles.sectionTitle} numberOfLines={2}>
              {selectedSpeciesId ? `Best for ${speciesShort(selectedSpeciesId)} today` : "Pick a species"}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="How ratings work"
            onPress={() => {
              hapticSelection();
              setSheet("info");
            }}
            style={({ pressed }) => [styles.infoButton, pressed && styles.pressed]}
          >
            <Ionicons name="information-circle-outline" size={17} color={INK} />
            <Text style={styles.infoButtonText}>How it works</Text>
          </Pressable>
        </View>
      </View>

      {lakes.length > 1 ? (
        <View style={styles.lakes} accessibilityRole="tablist">
          {(["all", ...lakes] as PierCastLakeFilter[]).map((lake) => {
            const selected = effectiveLake === lake;
            const count = lake === "all" ? allRows.length : lakeCounts.get(lake) ?? 0;
            return (
              <Pressable
                key={lake}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={`${lake === "all" ? "All lakes" : `Lake ${pierCastLakeName(lake)}`}, ${count} cities`}
                onPress={() => {
                  hapticSelection();
                  onChangeLake(lake);
                }}
                style={[styles.lake, selected && styles.lakeOn]}
              >
                <Text style={[styles.lakeText, selected && styles.textOnInk]}>
                  {lake === "all" ? "All lakes" : pierCastLakeName(lake)}
                </Text>
                <Text style={[styles.lakeCount, selected && styles.textOnInkSoft]}>{count}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {selectionLoading ? (
        <StandingsListSkeleton />
      ) : !selectedSpeciesId || leaderboard.selectionRequired || !boardMatches ? (
        <View style={styles.emptyCard}>
          <Ionicons name="fish-outline" size={26} color={paper.dashboardBlue} />
          <Text style={styles.emptyTitle}>Pick a species to see today's standings</Text>
          <Text style={styles.emptyBody}>Each species gets its own ranking. Choose one above.</Text>
        </View>
      ) : ranked.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="cloud-offline-outline" size={26} color={paper.dashboardBlue} />
          <Text style={styles.emptyTitle}>No rated cities {effectiveLake === "all" ? "right now" : "on this lake"}</Text>
          <Text style={styles.emptyBody}>
            Missing or updating data stays unrated instead of counting as poor fishing. Try another {effectiveLake === "all" ? "species" : "lake or species"}.
          </Text>
        </View>
      ) : (
        <>
          {leader && selectedSpeciesId ? (
            <Reveal token={token} reduceMotion={reduceMotion}>
              <LeaderCard
                entry={leader}
                city={catalogById.get(leader.row.cityId) ?? null}
                speciesId={selectedSpeciesId}
                weak={weakLeader}
                alternatives={alternatives}
                onOpen={() => onOpenCity(leader.row.cityId)}
                onSelectSpecies={onSelectSpecies}
                token={token}
                reduceMotion={reduceMotion}
              />
            </Reveal>
          ) : null}

          {chasers.length > 0 && selectedSpeciesId ? (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>CHASING THE LEADER</Text>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.tapHint}>
                <Ionicons name="hand-left-outline" size={14} color={paper.dashboardBlue} />
                <Text style={styles.tapHintText}>Tap any city for its full PierCast report</Text>
              </View>
              {groups.map((group) => {
                const style = PIER_CAST_STANDINGS_BANDS[group.band];
                return (
                  <View key={`${group.band}-${group.rows[0]!.rank}`}>
                    <View style={styles.groupHead}>
                      <View style={[styles.groupDot, { backgroundColor: style.color }]} />
                      <Text style={[styles.groupLabel, { color: style.ink }]}>{style.label.toUpperCase()}</Text>
                      <Text style={styles.groupCount}>
                        · {group.rows.length} {group.rows.length === 1 ? "CITY" : "CITIES"}
                      </Text>
                      {group.rows.length > 1 ? (
                        <Text style={styles.groupNote} numberOfLines={1}>Ordered by water-temp suitability</Text>
                      ) : null}
                    </View>
                    {group.rows.map((entry) => (
                      <ChaserRow
                        key={entry.row.cityId}
                        entry={entry}
                        speciesId={selectedSpeciesId}
                        index={entry.rank - 2}
                        token={token}
                        reduceMotion={reduceMotion}
                        onOpen={() => onOpenCity(entry.row.cityId)}
                      />
                    ))}
                  </View>
                );
              })}
              {ranked.length > PIER_CAST_STANDINGS_TOP_COUNT ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  onPress={() => {
                    hapticSelection();
                    setExpanded((value) => !value);
                  }}
                  style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
                >
                  <Text style={styles.moreButtonText}>
                    {expanded ? `Collapse to top ${PIER_CAST_STANDINGS_TOP_COUNT}` : `Show all ${ranked.length} cities`}
                  </Text>
                  <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={INK} />
                </Pressable>
              ) : null}
            </>
          ) : null}
        </>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open the PierCast visual map: water temps, wind and depth"
        onPress={() => {
          hapticSelection();
          onOpenMap();
        }}
        style={({ pressed }) => [styles.mapCard, pressed && styles.pressed]}
      >
        <View style={styles.mapArt}>
          <View style={[styles.mapLake, styles.mapLakeWest]} />
          <View style={[styles.mapLake, styles.mapLakeEast]} />
          <View style={[styles.mapPin, { top: 18, left: 16, backgroundColor: paper.bandPrime }]} />
          <View style={[styles.mapPin, { top: 36, left: 24, backgroundColor: paper.bandGood }]} />
          <View style={[styles.mapPin, { top: 30, left: 50, backgroundColor: paper.bandFair }]} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.mapEyebrow}>VISUAL MAP</Text>
          <Text style={styles.mapTitle}>See every pier on the map</Text>
          <Text style={styles.mapSub}>Water temps, wind and depth</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={paper.gold} />
      </Pressable>

      {!selectionLoading && boardMatches && unranked.length > 0 ? (
        <View style={styles.unrated}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: unratedOpen }}
            onPress={() => {
              hapticSelection();
              setUnratedOpen((value) => !value);
            }}
            style={styles.unratedHead}
          >
            <Ionicons name="time-outline" size={16} color="#555555" />
            <Text style={styles.unratedTitle}>Not rated today ({unranked.length})</Text>
            <Ionicons name={unratedOpen ? "chevron-up" : "chevron-down"} size={16} color="#333333" style={styles.pushRight} />
          </Pressable>
          {unratedOpen ? (
            <View style={styles.unratedList}>
              {unranked.map((row) => (
                <Pressable
                  key={row.cityId}
                  accessibilityRole="button"
                  accessibilityLabel={`${row.displayName}, not rated today: ${standingsUnrankedReason(row)}. Opens full report.`}
                  onPress={() => {
                    hapticSelection();
                    onOpenCity(row.cityId);
                  }}
                  style={({ pressed }) => [styles.unratedRow, pressed && styles.pressed]}
                >
                  <Text style={styles.unratedCity}>{row.displayName}, {row.stateCode}</Text>
                  <Text style={styles.unratedWhy}>{standingsUnrankedReason(row)}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      <Finder cities={catalog.cities} cityLakes={cityLakes} onOpenCity={onOpenFinderCity} />

      {footer ? <View style={styles.footer}>{footer}</View> : null}

      <Text style={styles.disclaimer}>
        Research-based outlooks, not catch guarantees. Water temps are NOAA nearshore model estimates. Always check pier conditions before you go.
      </Text>

      <SpeciesSheet
        visible={sheet === "species"}
        options={options}
        selectedSpeciesId={selectedSpeciesId}
        onSelect={(speciesId) => {
          setSheet(null);
          if (speciesId !== selectedSpeciesId) onSelectSpecies(speciesId);
        }}
        onClose={() => setSheet(null)}
      />
      <InfoSheet visible={sheet === "info"} onClose={() => setSheet(null)} />
    </View>
  );
}

// ─── Loading placeholders ─────────────────────────────────────────────────

function Bone({ pulse, width, height, style }: {
  pulse: Animated.Value;
  width: number | `${number}%`;
  height: number;
  style?: object;
}) {
  return <Animated.View style={[styles.bone, { opacity: pulse, width, height }, style]} />;
}

function StandingsListSkeleton() {
  const pulse = usePaperBonePulse({ from: 0.08, to: 0.2 });
  return (
    <View accessibilityLabel="Loading standings" accessibilityRole="progressbar">
      <View style={styles.skeletonLeader}>
        <Bone pulse={pulse} width={150} height={26} />
        <Bone pulse={pulse} width="60%" height={34} style={styles.boneGapLarge} />
        <Bone pulse={pulse} width="36%" height={14} style={styles.boneGap} />
        <Bone pulse={pulse} width="100%" height={9} style={styles.boneGapLarge} />
        <Bone pulse={pulse} width="85%" height={14} style={styles.boneGapLarge} />
      </View>
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.skeletonRow}>
          <Bone pulse={pulse} width={40} height={40} style={styles.boneRound} />
          <View style={styles.flex}>
            <Bone pulse={pulse} width="40%" height={10} />
            <Bone pulse={pulse} width="70%" height={20} style={styles.boneGap} />
            <Bone pulse={pulse} width="55%" height={10} style={styles.boneGap} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Full-page placeholder shaped like the Standings so nothing jumps on load. */
export function PierCastStandingsSkeleton() {
  const heroPulse = usePaperBonePulse({ from: 0.1, to: 0.24 });
  const pulse = usePaperBonePulse({ from: 0.08, to: 0.2 });
  return (
    <View accessibilityLabel="Loading PierCast standings" accessibilityRole="progressbar">
      <View style={[styles.hero, styles.skeletonHero]}>
        <TopographicLines style={StyleSheet.absoluteFill} color="#FFFFFF" count={7} />
        <View style={styles.skeletonCenter}>
          <Bone pulse={heroPulse} width={210} height={11} style={styles.boneLight} />
          <Bone pulse={heroPulse} width={260} height={40} style={[styles.boneLight, styles.boneGapLarge]} />
          <Bone pulse={heroPulse} width={240} height={14} style={[styles.boneLight, styles.boneGapLarge]} />
          <Bone pulse={heroPulse} width="100%" height={6} style={[styles.boneLight, styles.boneGapLarge]} />
          <Bone pulse={heroPulse} width="100%" height={46} style={[styles.boneLight, styles.boneGapLarge]} />
        </View>
      </View>
      <View style={styles.target}>
        <View style={styles.targetHead}>
          <Bone pulse={pulse} width={180} height={11} />
        </View>
        <View style={styles.tabs}>
          {[0, 1, 2].map((item) => <Bone key={item} pulse={pulse} width={108} height={112} style={styles.boneTab} />)}
        </View>
        <View style={styles.sectionHead}>
          <Bone pulse={pulse} width="60%" height={24} />
        </View>
      </View>
      <View style={styles.skeletonSpacer} />
      <StandingsListSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.72 },
  dim: { opacity: 0.5 },
  pushRight: { marginLeft: "auto" },
  textOnInk: { color: "#FFFFFF" },
  textOnInkSoft: { color: "rgba(255,255,255,0.8)" },
  dot: { width: 8, height: 8, borderRadius: 4 },

  hero: {
    overflow: "hidden",
    backgroundColor: INK,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 80,
  },
  heroEyebrow: {
    textAlign: "center",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 3,
    color: paper.gold,
  },
  heroTitle: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: paperFonts.display,
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  heroSub: {
    marginTop: 10,
    marginHorizontal: 8,
    textAlign: "center",
    fontFamily: paperFonts.body,
    fontSize: 15,
    lineHeight: 21,
    color: "rgba(255,255,255,0.78)",
  },
  heroSubStrong: { fontFamily: paperFonts.bodyBold, color: "#FFFFFF" },
  scale: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20 },
  scaleEnd: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.6, color: "rgba(255,255,255,0.6)" },
  scaleBar: { flex: 1, flexDirection: "row", gap: 4 },
  scaleSegment: { flex: 1, height: 6, borderRadius: 3 },
  stats: {
    flexDirection: "row",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.14)",
  },
  stat: { flex: 1, alignItems: "center", paddingTop: 14, paddingHorizontal: 4 },
  statDivider: { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.14)" },
  statLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: "rgba(255,255,255,0.58)" },
  statValue: { marginTop: 5, fontFamily: paperFonts.display, fontSize: 19, color: "#FFFFFF" },
  freshness: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 },
  freshnessDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: paper.bandPrime },
  freshnessText: { fontFamily: paperFonts.metaMono, fontSize: 11, letterSpacing: 0.4, color: "rgba(255,255,255,0.66)" },

  target: {
    zIndex: 2,
    marginTop: -58,
    marginHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 14,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  targetHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 },
  targetEyebrow: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: paper.dashboardBlue },
  targetAll: { flexDirection: "row", alignItems: "center", gap: 3, minHeight: 32 },
  targetAllText: { fontFamily: paperFonts.bodyBold, fontSize: 13, color: INK },
  tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4 },
  tab: {
    width: 108,
    minHeight: 112,
    padding: 8,
    paddingBottom: 9,
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
    borderRadius: 11,
    backgroundColor: paper.dashboardCream,
  },
  tabOn: {
    backgroundColor: INK,
    borderWidth: 2,
    borderColor: paper.gold,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  tabPressed: { transform: [{ scale: 0.97 }] },
  tabFish: { width: 86, height: 40, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  tabName: {
    marginTop: 4,
    minHeight: 32,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
    color: INK,
  },
  tabBest: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: "auto" },
  tabBestText: { flexShrink: 1, fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 0.4, color: "#555555" },
  tabMore: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderStyle: "dashed",
    borderColor: paper.dashboardBlue,
    backgroundColor: "#EEF6FA",
  },
  tabMoreText: { textAlign: "center", fontFamily: paperFonts.bodyBold, fontSize: 13, lineHeight: 16, color: paper.dashboardBlue },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 18,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  sectionKicker: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: paper.dashboardBlue },
  sectionTitle: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 23, lineHeight: 27, color: INK },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 36,
    paddingHorizontal: 11,
    borderWidth: 1.5,
    borderColor: INK,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  infoButtonText: { fontFamily: paperFonts.bodyBold, fontSize: 12, color: INK },

  lakes: {
    flexDirection: "row",
    gap: 6,
    marginTop: 16,
    marginHorizontal: 14,
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#E7E7E1",
  },
  lake: {
    flex: 1,
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 9,
  },
  lakeOn: {
    backgroundColor: INK,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 2,
  },
  lakeText: { fontFamily: paperFonts.bodyBold, fontSize: 13, color: "#444444" },
  lakeCount: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, color: "#666666" },

  leaderWrap: { marginTop: 18, marginHorizontal: 14 },
  leader: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 16,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 5,
  },
  leaderPressed: { opacity: 0.9 },
  leaderTopBar: { height: 6, backgroundColor: GOLD },
  corner: { position: "absolute", width: 18, height: 18, borderColor: CORNER_RED },
  cornerTL: { top: 16, left: 14, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 16, right: 14, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { top: -24, left: 14, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { top: -24, right: 14, borderBottomWidth: 3, borderRightWidth: 3 },
  leaderBody: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 30 },
  leaderHeadRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  stamp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: GOLD,
    borderRadius: 6,
    backgroundColor: "#FBF3DC",
  },
  stampWeak: { borderColor: "rgba(0,0,0,0.2)", backgroundColor: paper.dashboardCream },
  stampText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 2, color: GOLD_INK },
  stampTextWeak: { color: INK },
  bigMedal: { alignItems: "center", gap: 4 },
  bigMedalCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: GOLD,
    backgroundColor: "#FBF3DC",
    alignItems: "center",
    justifyContent: "center",
  },
  bigMedalNumber: { fontFamily: paperFonts.display, fontSize: 22, color: GOLD_INK },
  bigMedalLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.4, color: GOLD_INK },
  leaderState: { marginTop: 14, fontFamily: paperFonts.metaMonoBold, fontSize: 12, letterSpacing: 2.4, color: GOLD_INK },
  leaderIdentity: { flexDirection: "row", alignItems: "center", gap: 8 },
  leaderFish: { width: 104, height: 60, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  leaderCity: { fontFamily: paperFonts.display, fontSize: 34, lineHeight: 38, color: INK },
  leaderPier: { marginTop: 2, fontFamily: paperFonts.body, fontSize: 15, color: "#555555" },
  rule: { height: 1, marginVertical: 16, backgroundColor: paper.dashboardLine },
  verdictRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  verdictLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.6, color: "#555555" },
  verdictLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  verdict: { fontFamily: paperFonts.display, fontSize: 38, lineHeight: 44, letterSpacing: 0.5 },
  leaderWhy: { marginTop: 12, fontFamily: paperFonts.body, fontSize: 15, lineHeight: 21, color: "#1F2B38" },
  weakBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: paper.dashboardCream,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  weakText: { fontFamily: paperFonts.bodySemiBold, fontSize: 14, lineHeight: 19, color: INK },
  weakPrompt: { marginTop: 6, fontFamily: paperFonts.body, fontSize: 13, color: "#555555" },
  weakChips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 8 },
  weakChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 11,
    borderWidth: 1.5,
    borderColor: INK,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  weakChipText: { fontFamily: paperFonts.bodyBold, fontSize: 13, color: INK },
  leaderCta: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: paper.dashboardCream,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardLine,
  },
  leaderCtaText: { fontFamily: paperFonts.metaMonoBold, fontSize: 13, letterSpacing: 2.4, color: INK },

  meter: { flexDirection: "row", gap: 4, marginTop: 12 },
  meterCompact: { gap: 3, marginTop: 7, maxWidth: 150 },
  meterSegment: { flex: 1, height: 9, borderRadius: 5, overflow: "hidden", backgroundColor: "#E6E6E0" },
  meterSegmentCompact: { height: 6, borderRadius: 3 },
  meterFill: { flex: 1, borderRadius: 5, transformOrigin: "left" },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 26,
    paddingHorizontal: 9,
    borderWidth: 1.5,
    borderRadius: 6,
  },
  stageChip: { maxWidth: 150 },
  chipText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.1 },
  trend: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F1EC",
  },

  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 26, marginHorizontal: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(0,0,0,0.16)" },
  dividerText: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 2.6, color: "#333333" },
  tapHint: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 },
  tapHintText: { fontFamily: paperFonts.bodySemiBold, fontSize: 13, color: paper.dashboardBlue },
  groupHead: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16, marginBottom: 8, marginHorizontal: 18 },
  groupDot: { width: 10, height: 10, borderRadius: 5 },
  groupLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 12, letterSpacing: 1.8 },
  groupCount: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1, color: "#666666" },
  groupNote: { flex: 1, textAlign: "right", fontFamily: paperFonts.body, fontSize: 12, color: "#666666" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 92,
    marginHorizontal: 14,
    marginBottom: 10,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
    borderRadius: 14,
  },
  rowPressed: { backgroundColor: "#FAFAF7" },
  rowEdge: { position: "absolute", left: 0, top: 0, bottom: 0, width: 6 },
  medal: { width: 46, alignItems: "center", gap: 3 },
  medalCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  medalNumber: { fontFamily: paperFonts.display, fontSize: 18 },
  medalLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 9, letterSpacing: 1.2, color: "#555555" },
  rowMain: { flex: 1, minWidth: 0 },
  rowState: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: GOLD_INK },
  rowCity: { fontFamily: paperFonts.display, fontSize: 21, lineHeight: 25, color: INK },
  rowLine: { marginTop: 1, fontFamily: paperFonts.body, fontSize: 13, lineHeight: 17, color: "#555555" },
  rowRight: { alignItems: "flex-end", gap: 6 },
  rowFish: { width: 54, height: 30, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  rowChipLine: { flexDirection: "row", alignItems: "center", gap: 4 },
  go: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paper.dashboardCream,
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    marginTop: 6,
    marginHorizontal: 14,
    borderWidth: 1.5,
    borderColor: INK,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  moreButtonText: { fontFamily: paperFonts.bodyBold, fontSize: 14, color: INK },

  emptyCard: {
    alignItems: "center",
    gap: 7,
    marginTop: 18,
    marginHorizontal: 14,
    padding: 24,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: paper.dashboardBlueLight,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  emptyTitle: { textAlign: "center", fontFamily: paperFonts.display, fontSize: 20, lineHeight: 24, color: INK },
  emptyBody: { textAlign: "center", fontFamily: paperFonts.body, fontSize: 14, lineHeight: 20, color: "#555555" },

  mapCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 88,
    marginTop: 22,
    marginHorizontal: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: INK,
  },
  mapArt: { width: 74, height: 60, borderRadius: 10, overflow: "hidden", backgroundColor: "#123B5A" },
  mapLake: { position: "absolute", borderRadius: 20 },
  mapLakeWest: { top: 4, left: 14, width: 16, height: 54, backgroundColor: "#3A8FB7", transform: [{ rotate: "-8deg" }] },
  mapLakeEast: { top: 14, left: 44, width: 18, height: 42, backgroundColor: "#2D7AA2", transform: [{ rotate: "-20deg" }] },
  mapPin: { position: "absolute", width: 9, height: 9, borderRadius: 5, borderWidth: 1.5, borderColor: "#FFFFFF" },
  mapEyebrow: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.8, color: paper.gold },
  mapTitle: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 18, lineHeight: 22, color: "#FFFFFF" },
  mapSub: { marginTop: 2, fontFamily: paperFonts.body, fontSize: 13, color: "rgba(255,255,255,0.72)" },

  unrated: {
    marginTop: 14,
    marginHorizontal: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(0,0,0,0.22)",
    borderRadius: 12,
  },
  unratedHead: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 48, paddingHorizontal: 14 },
  unratedTitle: { fontFamily: paperFonts.bodyBold, fontSize: 14, color: "#333333" },
  unratedList: { paddingHorizontal: 14, paddingBottom: 8 },
  unratedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    minHeight: 44,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  unratedCity: { flexShrink: 1, fontFamily: paperFonts.bodyBold, fontSize: 14, color: INK },
  unratedWhy: { flexShrink: 1, textAlign: "right", fontFamily: paperFonts.body, fontSize: 12, color: "#666666" },

  finder: { marginTop: 30, marginHorizontal: 14 },
  finderCard: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: INK,
    borderRadius: 16,
  },
  finderTop: { overflow: "hidden", alignItems: "center", paddingHorizontal: 16, paddingTop: 22, paddingBottom: 18, backgroundColor: INK },
  finderBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: paper.gold,
    backgroundColor: "rgba(232,160,46,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  finderEyebrow: { marginTop: 10, fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 2.6, color: paper.gold },
  finderTitle: { marginTop: 4, fontFamily: paperFonts.display, fontSize: 28, lineHeight: 32, color: "#FFFFFF" },
  finderSub: { marginTop: 4, textAlign: "center", fontFamily: paperFonts.body, fontSize: 14, color: "rgba(255,255,255,0.74)" },
  search: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 50,
    marginTop: 16,
    paddingLeft: 14,
    paddingRight: 8,
    borderWidth: 2,
    borderColor: paper.gold,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 12, fontFamily: paperFonts.body, fontSize: 16, color: INK },
  searchClear: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDEDE8",
  },
  results: { paddingHorizontal: 14, paddingBottom: 8 },
  resultsLabel: { paddingTop: 10, paddingBottom: 4, fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.6, color: paper.dashboardBlue },
  finderEmpty: { paddingVertical: 22, textAlign: "center", fontFamily: paperFonts.body, fontSize: 14, color: "#666666" },
  accordionList: { paddingVertical: 4 },
  accordionBorder: { borderTopWidth: 1, borderTopColor: paper.dashboardHair },
  accordionHead: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 64, paddingHorizontal: 14, paddingVertical: 10 },
  stateCode: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: INK },
  stateCodeText: { fontFamily: paperFonts.metaMonoBold, fontSize: 13, letterSpacing: 0.8, color: "#FFFFFF" },
  stateName: { fontFamily: paperFonts.display, fontSize: 19, lineHeight: 23, color: INK },
  stateLakes: { fontFamily: paperFonts.body, fontSize: 13, color: "#666666" },
  stateCount: {
    minWidth: 30,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF6FA",
  },
  stateCountText: { fontFamily: paperFonts.metaMonoBold, fontSize: 12, color: paper.dashboardBlue },
  accordionBody: { paddingHorizontal: 14, paddingBottom: 10, backgroundColor: "#FAFAF7", borderTopWidth: 1, borderTopColor: paper.dashboardHair },
  lakeLabelRow: { flexDirection: "row", alignItems: "center", gap: 7, paddingTop: 12, paddingBottom: 4 },
  lakeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3A8FB7" },
  lakeLabel: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.6, color: paper.dashboardBlue },
  finderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 58,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardHair,
  },
  finderRowPressed: { backgroundColor: "#F1F1EC" },
  finderPin: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#E6F2F8" },
  finderCity: { fontFamily: paperFonts.bodyBold, fontSize: 16, color: INK },
  finderMeta: { fontFamily: paperFonts.body, fontSize: 13, color: "#666666" },
  finderOpen: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.2, color: paper.dashboardBlue },

  footer: { marginTop: 4, marginHorizontal: 14 },
  disclaimer: {
    marginTop: 18,
    marginHorizontal: 22,
    textAlign: "center",
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: "#777777",
  },

  sheetWrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { flex: 1, backgroundColor: "rgba(10,27,46,0.55)" },
  sheet: {
    maxHeight: "82%",
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: paper.dashboardCream,
  },
  grab: { alignSelf: "center", width: 42, height: 5, borderRadius: 3, marginBottom: 12, backgroundColor: "rgba(0,0,0,0.2)" },
  sheetHead: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 4 },
  sheetEyebrow: { fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: paper.dashboardBlue },
  sheetTitle: { marginTop: 3, fontFamily: paperFonts.display, fontSize: 25, lineHeight: 30, color: INK },
  sheetClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
  },
  sheetGroupLabel: { marginTop: 18, marginBottom: 8, fontFamily: paperFonts.metaMonoBold, fontSize: 11, letterSpacing: 1.8, color: "#555555" },
  tileGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  tileCell: { width: "50%", padding: 4 },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 64,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  tileOn: { backgroundColor: INK, borderWidth: 2, borderColor: paper.gold },
  tileFish: { width: 48, height: 32, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  tileName: { fontFamily: paperFonts.bodyBold, fontSize: 13, lineHeight: 16, color: INK },
  tileMeta: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
  tileMetaText: { flexShrink: 1, fontFamily: paperFonts.body, fontSize: 11, color: "#666666" },
  infoStep: { flexDirection: "row", gap: 12, marginTop: 16 },
  infoNumber: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: INK },
  infoNumberText: { fontFamily: paperFonts.display, fontSize: 15, color: "#FFFFFF" },
  infoStepTitle: { fontFamily: paperFonts.bodyBold, fontSize: 16, color: INK },
  infoStepBody: { marginTop: 2, fontFamily: paperFonts.body, fontSize: 14, lineHeight: 20, color: "#444444" },
  legend: {
    marginTop: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 11 },
  legendRowBorder: { borderTopWidth: 1, borderTopColor: paper.dashboardHair },
  legendSwatch: { width: 14, height: 14, borderRadius: 4 },
  legendLabel: { width: 90, fontFamily: paperFonts.bodyBold, fontSize: 14, color: INK },
  legendMeaning: { flexShrink: 1, fontFamily: paperFonts.body, fontSize: 13, color: "#555555" },
  legendTrendRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12, paddingHorizontal: 4 },
  legendTrendGap: { marginLeft: 12 },
  infoFine: { marginTop: 14, fontFamily: paperFonts.body, fontSize: 12, lineHeight: 17, color: "#777777" },

  bone: { borderRadius: 6, backgroundColor: INK },
  boneLight: { backgroundColor: "#FFFFFF" },
  boneGap: { marginTop: 8 },
  boneGapLarge: { marginTop: 14 },
  boneRound: { borderRadius: 20 },
  boneTab: { borderRadius: 11 },
  skeletonHero: { minHeight: 330 },
  skeletonCenter: { alignItems: "center" },
  skeletonSpacer: { height: 4 },
  skeletonLeader: {
    marginTop: 18,
    marginHorizontal: 14,
    padding: 22,
    borderWidth: 2,
    borderColor: "rgba(212,175,55,0.5)",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 92,
    marginTop: 10,
    marginHorizontal: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
});
