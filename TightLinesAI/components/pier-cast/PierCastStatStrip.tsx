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
 * `compact` uses smaller type and padding for dense lists; every tile keeps
 * the same label-over-value shape so mixed bands line up.
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
import { PIER_CAST_SPECIES_IMAGE_BOUNDS } from "../../lib/pierCastSpeciesImageBounds";
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
  /**
   * Dense list mode (city report species cards and standings rows): each tile
   * is a single label-and-value line, roughly half the height of the full tile.
   */
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
  const valueSize = compact ? 14 : 20;
  const valueType = { fontSize: valueSize, lineHeight: valueSize + 4 };
  const tileBase = [
    styles.tile,
    compact && styles.tileCompact,
    !stacked && styles.tileSide,
  ];

  const spoken = [
    bandStyle ? `Today: ${bandStyle.label}` : `Not rated${unratedReason ? `: ${unratedReason}` : ""}`,
    season ? `Season: ${season}` : null,
  ].filter(Boolean).join(". ");

  return (
    <View
      onLayout={onLayout}
      style={[styles.strip, compact && styles.stripCompact, stacked && styles.stripStacked, style]}
      accessible
      accessibilityLabel={spoken}
    >
      {bandStyle ? (
        <View
          style={[
            ...tileBase,
            { backgroundColor: bandStyle.chip, borderColor: bandStyle.color },
          ]}
        >
          <Text style={[styles.tileLabel, compact && styles.tileLabelCompact, { color: bandStyle.ink }]}>TODAY</Text>
          <Text style={[styles.tileValue, compact && styles.tileValueCompact, valueType, { color: bandStyle.ink }]}>
            {bandStyle.label}
          </Text>
          {compact ? null : <BandTicks level={bandStyle.level} color={bandStyle.color} />}
        </View>
      ) : (
        <View style={[...tileBase, styles.tileUnrated]}>
          <Text style={[styles.tileLabel, compact && styles.tileLabelCompact, styles.tileLabelUnrated]}>NOT RATED</Text>
          <Text style={[styles.tileUnratedText, compact && styles.tileUnratedTextCompact]}>
            {unratedReason ?? "No rating today"}
          </Text>
        </View>
      )}
      {season ? (
        <View style={[...tileBase, styles.tileSeason, compact && !stacked && styles.tileSeasonWide]}>
          <View style={styles.tileLabelRow}>
            <Ionicons name={seasonIcon(season)} size={compact ? 10 : 12} color={paper.dashboardBlue} />
            <Text style={[styles.tileLabel, compact && styles.tileLabelCompact, styles.tileLabelSeason]}>SEASON</Text>
          </View>
          <Text
            style={[
              styles.tileValue,
              compact && styles.tileValueCompact,
              styles.tileValueSeason,
              compact ? valueType : { fontSize: valueSize - 1, lineHeight: valueSize + 3 },
            ]}
          >
            {season}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/**
 * Species art fitted to a fixed box using the measured bounds of the visible
 * fish, so every species (long pike or deep-bodied drum) shows whole, centered
 * and as large as the box allows. Nothing is clipped.
 */
export function PierCastFishCrop({
  speciesId,
  width,
  height = Math.round(width * 0.46),
  style,
}: {
  speciesId: PierCastSpeciesId;
  width: number;
  height?: number;
  style?: ViewStyle;
}) {
  const bounds = PIER_CAST_SPECIES_IMAGE_BOUNDS[speciesId];
  const fishWidth = bounds.right - bounds.left;
  const fishHeight = bounds.bottom - bounds.top;
  const scale = Math.min(width / fishWidth, height / fishHeight);
  const offsetX = (width - fishWidth * scale) / 2 - bounds.left * scale;
  const offsetY = (height - fishHeight * scale) / 2 - bounds.top * scale;
  return (
    <View
      style={[styles.fishCrop, { width, height }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={getPierCastSpeciesImage(speciesId) as ImageSourcePropType}
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: bounds.imageWidth * scale,
          height: bounds.imageHeight * scale,
        }}
        resizeMode="stretch"
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
  stripCompact: { gap: 6 },
  stripStacked: { flexDirection: "column" },
  tile: {
    minWidth: 0,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 10,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  // Every compact tile is the same shape: small label on top, value below,
  // vertically centered. Side-by-side tiles share one height, so centering
  // keeps a short value ("Fair") from leaving a gap beside a wrapped one.
  tileCompact: {
    justifyContent: "center",
    gap: 1,
    paddingHorizontal: 9,
    paddingTop: 5,
    paddingBottom: 6,
    borderWidth: 1,
    borderRadius: 8,
  },
  /** Season labels run longer than Today's one-word bands. */
  tileSeasonWide: { flexGrow: 1.35 },
  tileSide: { flex: 1, flexBasis: 0 },
  tileLabelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  tileLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
  },
  tileLabelCompact: { fontSize: 8.5, letterSpacing: 1.2 },
  tileValueCompact: { marginTop: 0 },
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
  tileUnratedTextCompact: { marginTop: 0, flexShrink: 1, fontSize: 12.5, lineHeight: 16 },
  tileUnratedText: {
    marginTop: 4,
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: INK,
  },
  fishCrop: { overflow: "hidden" },
  gaugeWrap: { marginTop: 5, height: 10, justifyContent: "center" },
  gaugeBar: { flexDirection: "row", height: 4, borderRadius: 2, overflow: "hidden", gap: 2 },
  gaugeBarEmpty: { marginTop: 8, backgroundColor: "#E6E6E0" },
  gaugeSeg: { height: 4 },
  gaugePin: { position: "absolute", top: 0, width: 10, height: 10, marginLeft: -5, borderRadius: 5, borderWidth: 2.5, borderColor: INK, backgroundColor: "#FFFFFF" },
});
