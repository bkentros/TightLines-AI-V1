/**
 * PierCast 1.17 shared "stat strip" + cropped fish art.
 *
 * One visual language for every place PierCast shows a rating:
 *   ┌──────────────┬──────────────┐
 *   │ TODAY        │ SEASON       │
 *   │ Prime        │ Approaching  │
 *   │ ▮▮▮▮         │ peak         │
 *   └──────────────┴──────────────┘
 *
 * Invariants (see the 1.17 handoff):
 * - never shows a numeric score;
 * - values wrap, they never truncate or ellipsize;
 * - Today and Season stay separate tiles;
 * - tiles stack vertically on narrow widths or large accessibility text.
 */
import { Ionicons } from "@expo/vector-icons";
import { type ComponentProps, useCallback, useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

import type { PierCastSeasonalBandV4 } from "../../lib/pierCastConditionsV4";
import type { PierCastWaterFit } from "../../lib/pierCastCityReportPresentation";
import type { PierCastSpeciesId } from "../../lib/pierCastContracts";
import { getPierCastSpeciesImage } from "../../lib/pierCastSpeciesImages";
import { PIER_CAST_STANDINGS_BANDS } from "../../lib/pierCastStandingsPresentation";
import { paper, paperFonts } from "../../lib/theme";

const INK = paper.dashboardInk;
/** Below this width (or at large text), the two tiles stack. */
const STACK_BELOW_WIDTH = 270;
const STACK_AT_FONT_SCALE = 1.35;

type IoniconName = ComponentProps<typeof Ionicons>["name"];

function seasonIcon(label: string): IoniconName {
  const value = label.toLowerCase();
  if (value.startsWith("peak")) return "star";
  if (value.startsWith("approaching")) return "trending-up";
  if (value.startsWith("past")) return "trending-down";
  if (value.startsWith("off")) return "moon-outline";
  if (value.startsWith("in season")) return "checkmark-circle-outline";
  return "calendar-outline";
}

/** Four quiet ticks under the Today value: Poor → Prime. No numbers. */
function BandTicks({ level, color }: { level: number; color: string }) {
  const filled = Math.max(0, Math.min(4, level - 1));
  return (
    <View
      style={styles.ticks}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {[0, 1, 2, 3].map((index) => (
        <View
          key={index}
          style={[
            styles.tick,
            { backgroundColor: index < filled ? color : "rgba(10,27,46,0.12)" },
          ]}
        />
      ))}
    </View>
  );
}

export function PierCastStatStrip({
  band,
  season,
  unratedReason,
  compact = false,
  style,
}: {
  /** Today's band. `null` renders an explicit "NOT RATED" tile. */
  band: PierCastSeasonalBandV4 | null;
  /** Season timing label ("Approaching peak"); omitted tile when null. */
  season: string | null;
  /** Shown inside the NOT RATED tile (research holds, closures, missing data). */
  unratedReason?: string | null;
  /** Slightly smaller type for dense lists. */
  compact?: boolean;
  style?: ViewStyle;
}) {
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    setWidth((current) => (current === next ? current : next));
  }, []);
  const stacked = fontScale >= STACK_AT_FONT_SCALE ||
    (width > 0 && width < STACK_BELOW_WIDTH);
  const bandStyle = band ? PIER_CAST_STANDINGS_BANDS[band] : null;
  const valueSize = compact ? 18 : 20;

  const spoken = [
    bandStyle ? `Today: ${bandStyle.label}` : `Not rated${unratedReason ? `: ${unratedReason}` : ""}`,
    season ? `Season: ${season}` : null,
  ].filter(Boolean).join(". ");

  return (
    <View
      onLayout={onLayout}
      style={[styles.strip, stacked && styles.stripStacked, style]}
      accessible
      accessibilityLabel={spoken}
    >
      {bandStyle ? (
        <View
          style={[
            styles.tile,
            !stacked && styles.tileSide,
            { backgroundColor: bandStyle.chip, borderColor: bandStyle.color },
          ]}
        >
          <Text style={[styles.tileLabel, { color: bandStyle.ink }]}>TODAY</Text>
          <Text style={[styles.tileValue, { fontSize: valueSize, lineHeight: valueSize + 4, color: bandStyle.ink }]}>
            {bandStyle.label}
          </Text>
          <BandTicks level={bandStyle.level} color={bandStyle.color} />
        </View>
      ) : (
        <View style={[styles.tile, !stacked && styles.tileSide, styles.tileUnrated]}>
          <Text style={[styles.tileLabel, styles.tileLabelUnrated]}>NOT RATED</Text>
          <Text style={styles.tileUnratedText}>
            {unratedReason ?? "No rating today"}
          </Text>
        </View>
      )}
      {season ? (
        <View style={[styles.tile, !stacked && styles.tileSide, styles.tileSeason]}>
          <View style={styles.tileLabelRow}>
            <Ionicons name={seasonIcon(season)} size={12} color={paper.dashboardBlue} />
            <Text style={[styles.tileLabel, styles.tileLabelSeason]}>SEASON</Text>
          </View>
          <Text style={[styles.tileValue, styles.tileValueSeason, { fontSize: valueSize - 1, lineHeight: valueSize + 3 }]}>
            {season}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Species art cropped to the fish itself. The source PNGs carry generous
 * transparent padding above and below the fish, so rendering them square at
 * `width` and clipping to a ~0.44 aspect window shows the whole fish large.
 */
export function PierCastFishCrop({
  speciesId,
  width,
  style,
}: {
  speciesId: PierCastSpeciesId;
  width: number;
  style?: ViewStyle;
}) {
  const height = Math.round(width * 0.44);
  return (
    <View
      style={[styles.fishCrop, { width, height }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={getPierCastSpeciesImage(speciesId) as ImageSourcePropType}
        style={{ width, height: width }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

/** Cool · ideal · warm water bar with a pin, matching the city report gauge. */
export function PierCastWaterGauge({ fit }: { fit: PierCastWaterFit | null }) {
  if (!fit) return <View style={[styles.gaugeBar, styles.gaugeBarEmpty]} />;
  return (
    <View
      style={styles.gaugeWrap}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.gaugeBar}>
        <View style={[styles.gaugeSeg, { flex: fit.coolWeight, backgroundColor: GAUGE_COOL }]} />
        <View style={[styles.gaugeSeg, { flex: fit.idealWeight, backgroundColor: paper.bandPrime }]} />
        <View style={[styles.gaugeSeg, { flex: fit.warmWeight, backgroundColor: GAUGE_WARM }]} />
      </View>
      <View style={[styles.gaugePin, { left: `${fit.pin * 100}%` }]} />
    </View>
  );
}

const GAUGE_COOL = "#2F86C9";
const GAUGE_WARM = "#E0772F";

const styles = StyleSheet.create({
  strip: { flexDirection: "row", alignItems: "stretch", gap: 8 },
  stripStacked: { flexDirection: "column" },
  tile: {
    minWidth: 0,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 10,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  tileSide: { flex: 1, flexBasis: 0 },
  tileLabelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  tileLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
  },
  tileValue: {
    marginTop: 3,
    fontFamily: paperFonts.display,
    flexShrink: 1,
  },
  ticks: { flexDirection: "row", gap: 3, marginTop: 7 },
  tick: { flex: 1, maxWidth: 18, height: 4, borderRadius: 2 },
  tileSeason: { backgroundColor: "#EEF5FA", borderColor: "#B9D7EA" },
  tileLabelSeason: { color: paper.dashboardBlue },
  tileValueSeason: { color: "#173E5C", fontFamily: paperFonts.displaySemiBold },
  tileUnrated: { backgroundColor: paper.dashboardCream, borderColor: "rgba(0,0,0,0.16)" },
  tileLabelUnrated: { color: "#555555" },
  tileUnratedText: {
    marginTop: 4,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: INK,
  },
  fishCrop: { overflow: "hidden", alignItems: "center", justifyContent: "center" },
  gaugeWrap: { marginTop: 7, height: 14, justifyContent: "center" },
  gaugeBar: { flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden", gap: 2 },
  gaugeBarEmpty: { marginTop: 11, backgroundColor: "#E6E6E0" },
  gaugeSeg: { height: 6 },
  gaugePin: { position: "absolute", top: 0, width: 14, height: 14, marginLeft: -7, borderRadius: 7, borderWidth: 3, borderColor: INK, backgroundColor: "#FFFFFF" },
});
