import React, { useId, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import type { PierCastReviewTemperaturePointRead } from "../../lib/pierCastContracts";
import { paper, paperFonts, scoreAccentColor } from "../../lib/theme";

function celsiusToFahrenheit(value: number): number {
  return (value * 9) / 5 + 32;
}

export function PierCastScoreGauge({
  score,
  label,
  size = 132,
}: {
  score: number | null;
  label: string;
  size?: number;
}) {
  const accent = score === null ? "#8A969E" : scoreAccentColor(score);
  const compact = size < 90;
  const medium = size >= 70 && size < 110;
  const strokeWidth = compact ? 5 : 10;
  const radius = (size - strokeWidth - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score === null ? 0 : Math.max(0, Math.min(1, score / 10));

  return (
    <View
      style={[styles.gauge, { width: size, height: size }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        score === null
          ? `${label}. Rating unavailable.`
          : `${label}. ${score.toFixed(1)} out of 10.`
      }
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="#FFFFFF"
          stroke="rgba(10,27,46,0.09)"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
        {Array.from({ length: 10 }).map((_, index) => {
          const angle = ((index * 36 - 90) * Math.PI) / 180;
          const inner = radius - (compact ? 9 : 15);
          const outer = radius - (compact ? 7 : 12);
          return (
            <Line
              key={index}
              x1={size / 2 + Math.cos(angle) * inner}
              y1={size / 2 + Math.sin(angle) * inner}
              x2={size / 2 + Math.cos(angle) * outer}
              y2={size / 2 + Math.sin(angle) * outer}
              stroke="rgba(10,27,46,0.19)"
              strokeWidth={1}
            />
          );
        })}
      </Svg>
      <View
        style={[styles.gaugeReadout, compact && styles.gaugeReadoutCompact]}
        pointerEvents="none"
      >
        <View style={styles.gaugeValueRow}>
          <Text
            style={[
              styles.gaugeValue,
              compact && styles.gaugeValueCompact,
              medium && styles.gaugeValueMedium,
              { color: accent },
            ]}
          >
            {score === null ? "—" : score.toFixed(1)}
          </Text>
          <Text
            style={[
              styles.gaugeMaximum,
              compact && styles.gaugeMaximumCompact,
              medium && styles.gaugeMaximumMedium,
            ]}
          >
            /10
          </Text>
        </View>
        <Text
          style={[
            styles.gaugeLabel,
            compact && styles.gaugeLabelCompact,
            medium && styles.gaugeLabelMedium,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

type ChartPoint = { x: number; y: number };

function smoothPath(points: ChartPoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0]!.x},${points[0]!.y}`;
  let path = `M${points[0]!.x.toFixed(2)},${points[0]!.y.toFixed(2)}`;
  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1]!;
    const current = points[index]!;
    const middleX = (previous.x + current.x) / 2;
    path += ` C${middleX.toFixed(2)},${previous.y.toFixed(2)} ${middleX.toFixed(2)},${current.y.toFixed(2)} ${current.x.toFixed(2)},${current.y.toFixed(2)}`;
  }
  return path;
}

function formatHour(value: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    timeZone: timezone,
  })
    .format(new Date(value))
    .replace(" ", "");
}

type AxisTick = {
  pointIndex: number;
  label: string;
  anchor: "start" | "middle" | "end";
  labelX?: number;
};

/**
 * Five-day nearshore water-temperature chart.
 *
 * Design notes:
 *  - The stroke carries a VERTICAL gradient, so color encodes temperature:
 *    warm rust at the top of the plot, cool blue at the bottom. Reading the
 *    line's color tells you the same thing as reading its height.
 *  - Day boundaries are drawn as hairlines with their own labels, so a
 *    five-day series stops reading as one undifferentiated squiggle.
 *  - The warmest and coolest hours are annotated in place — the two values
 *    an angler actually looks for.
 */
export function PierCastTemperatureChart({
  points,
  timezone,
  xAxisMode = "hours",
}: {
  points: PierCastReviewTemperaturePointRead[];
  timezone: string;
  xAxisMode?: "hours" | "days";
}) {
  const width = 356;
  const height = 212;
  const plot = { left: 40, right: 12, top: 26, bottom: 38 };
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const values = points.map((point) => celsiusToFahrenheit(point.temperatureC));
  const rawMin = values.length ? Math.min(...values) : 0;
  const rawMax = values.length ? Math.max(...values) : 1;
  const low = Math.floor((rawMin - 1) / 2) * 2;
  const high = Math.max(low + 4, Math.ceil((rawMax + 1) / 2) * 2);
  const range = high - low;
  const coordinates = values.map((value, index) => ({
    x:
      plot.left +
      (values.length === 1
        ? plotWidth / 2
        : (index / (values.length - 1)) * plotWidth),
    y: plot.top + ((high - value) / range) * plotHeight,
  }));
  const linePath = smoothPath(coordinates);
  const baseline = plot.top + plotHeight;
  const areaPath =
    linePath && coordinates.length
      ? `${linePath} L${coordinates[coordinates.length - 1]!.x},${baseline} L${coordinates[0]!.x},${baseline} Z`
      : "";
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const areaId = `pierTempArea${rawId}`;
  const strokeId = `pierTempStroke${rawId}`;
  const yTicks = [high, high - range / 3, high - (2 * range) / 3, low];

  // Warmest / coolest hour, annotated in place.
  const maxIndex = values.length ? values.indexOf(rawMax) : -1;
  const minIndex = values.length ? values.indexOf(rawMin) : -1;
  const extremes =
    values.length > 3 && maxIndex !== minIndex
      ? [
          { index: maxIndex, value: rawMax, warm: true },
          { index: minIndex, value: rawMin, warm: false },
        ]
      : [];

  // Local-day spans. We need the whole span, not just the first point, so a
  // label can sit over the middle of its day instead of on its left edge.
  const dayBoundaries = useMemo(() => {
    const marks: Array<{
      index: number;
      endIndex: number;
      label: string;
    }> = [];
    let currentKey: string | null = null;
    points.forEach((point, index) => {
      const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(point.validAt));
      if (key === currentKey) {
        marks[marks.length - 1]!.endIndex = index;
        return;
      }
      currentKey = key;
      marks.push({
        index,
        endIndex: index,
        label:
          marks.length === 0
            ? "TODAY"
            : new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                timeZone: timezone,
              })
                .format(new Date(point.validAt))
                .toUpperCase(),
      });
    });
    return marks;
  }, [points, timezone]);

  // Every local day in the series gets a label, always — a day must never
  // vanish from the axis just because its slice is short. Labels want to sit
  // at their day's midpoint; a two-pass declutter then spreads any that would
  // collide, so positions stay predictable instead of dropping in and out.
  const MIN_LABEL_GAP = 46;
  const EDGE_PAD = 13;
  const xAt = (index: number) =>
    plot.left +
    (values.length === 1
      ? plotWidth / 2
      : (index / (values.length - 1)) * plotWidth);

  const axisTicks: AxisTick[] = values.length
    ? xAxisMode === "days"
      ? (() => {
          const leftLimit = plot.left;
          const rightLimit = plot.left + plotWidth - EDGE_PAD;
          // 1. desired position: the middle of each day's actual span.
          const desired = dayBoundaries.map(({ index, endIndex }, dayIndex) =>
            dayIndex === 0 ? leftLimit : (xAt(index) + xAt(endIndex)) / 2,
          );
          // 2. push right so nothing overlaps its left neighbour.
          const placed = [...desired];
          for (let i = 1; i < placed.length; i++) {
            placed[i] = Math.max(placed[i]!, placed[i - 1]! + MIN_LABEL_GAP);
          }
          // 3. pull back from the right edge, preserving the same gap.
          placed[placed.length - 1] = Math.min(
            placed[placed.length - 1]!,
            rightLimit,
          );
          for (let i = placed.length - 2; i >= 0; i--) {
            placed[i] = Math.min(placed[i]!, placed[i + 1]! - MIN_LABEL_GAP);
          }
          // 4. the first label never slides left of the plot.
          placed[0] = Math.max(placed[0]!, leftLimit);
          return dayBoundaries.map(({ index, label }, dayIndex) => ({
            pointIndex: index,
            label,
            anchor:
              dayIndex === 0
                ? ("start" as const)
                : dayIndex === dayBoundaries.length - 1 &&
                    placed[dayIndex]! >= rightLimit - 1
                  ? ("end" as const)
                  : ("middle" as const),
            labelX: placed[dayIndex]!,
          }));
        })()
      : Array.from(
          new Set([
            0,
            Math.round((values.length - 1) / 3),
            Math.round(((values.length - 1) * 2) / 3),
            values.length - 1,
          ]),
        ).map((pointIndex) => ({
          pointIndex,
          label: formatHour(points[pointIndex]!.validAt, timezone),
          anchor:
            pointIndex === 0
              ? ("start" as const)
              : pointIndex === values.length - 1
                ? ("end" as const)
                : ("middle" as const),
        }))
    : [];

  if (points.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyChartText}>TEMPERATURE TREND UNAVAILABLE</Text>
      </View>
    );
  }

  const startPoint = coordinates[0]!;

  return (
    <View
      style={styles.chartShell}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Hourly surface water temperature ranges from ${rawMin.toFixed(1)} to ${rawMax.toFixed(1)} degrees Fahrenheit.`}
    >
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4E9BC4" stopOpacity="0.42" />
            <Stop offset="0.55" stopColor={paper.dashboardBlueSky} stopOpacity="0.2" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
          {/* Warm at the top of the plot, cool at the bottom — the line's
              color and its height say the same thing. */}
          <LinearGradient
            id={strokeId}
            x1="0"
            y1={plot.top}
            x2="0"
            y2={baseline}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#CC6A22" />
            <Stop offset="0.45" stopColor="#3E8FB0" />
            <Stop offset="1" stopColor="#1E5C80" />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid */}
        {yTicks.map((tick, index) => {
          const y = plot.top + (index / (yTicks.length - 1)) * plotHeight;
          return (
            <Line
              key={`grid-${tick}`}
              x1={plot.left}
              x2={plot.left + plotWidth}
              y1={y}
              y2={y}
              stroke="rgba(10,27,46,0.10)"
              strokeWidth="1"
              strokeDasharray={index === yTicks.length - 1 ? undefined : "2 6"}
            />
          );
        })}
        {yTicks.map((tick, index) => (
          <SvgText
            key={`ylabel-${tick}`}
            x={plot.left - 8}
            y={plot.top + (index / (yTicks.length - 1)) * plotHeight + 3.5}
            textAnchor="end"
            fill="rgba(10,27,46,0.52)"
            fontFamily={paperFonts.metaMonoBold}
            fontSize="9"
          >
            {`${Math.round(tick)}°`}
          </SvgText>
        ))}

        {/* Day boundary hairlines */}
        {xAxisMode === "days"
          ? dayBoundaries.slice(1).map(({ index }) => {
              const coordinate = coordinates[index];
              if (!coordinate) return null;
              return (
                <Line
                  key={`day-${index}`}
                  x1={coordinate.x}
                  x2={coordinate.x}
                  y1={plot.top - 6}
                  y2={baseline}
                  stroke="rgba(10,27,46,0.13)"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              );
            })
          : null}

        <Path d={areaPath} fill={`url(#${areaId})`} />
        <Path
          d={linePath}
          fill="none"
          stroke={`url(#${strokeId})`}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Warmest / coolest hour */}
        {extremes.map(({ index, value, warm }) => {
          const coordinate = coordinates[index];
          if (!coordinate) return null;
          const color = warm ? "#C05F1C" : "#1E5C80";
          const labelY = warm
            ? Math.max(plot.top - 8, coordinate.y - 11)
            : Math.min(baseline + 13, coordinate.y + 16);
          const anchor =
            coordinate.x < plot.left + 34
              ? ("start" as const)
              : coordinate.x > plot.left + plotWidth - 34
                ? ("end" as const)
                : ("middle" as const);
          return (
            <React.Fragment key={`extreme-${warm ? "max" : "min"}`}>
              <Circle
                cx={coordinate.x}
                cy={coordinate.y}
                r="4"
                fill="#FFFFFF"
                stroke={color}
                strokeWidth="2.4"
              />
              <SvgText
                x={coordinate.x}
                y={labelY}
                textAnchor={anchor}
                fill={color}
                fontFamily={paperFonts.metaMonoBold}
                fontSize="9.5"
              >
                {`${value.toFixed(1)}°`}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Forecast start */}
        <Circle
          cx={startPoint.x}
          cy={startPoint.y}
          r="3.4"
          fill={paper.dashboardInk}
        />
        <SvgText
          x={plot.left}
          y={plot.top - 12}
          textAnchor="start"
          fill="rgba(10,27,46,0.5)"
          fontFamily={paperFonts.metaMonoBold}
          fontSize="8.5"
        >
          NOW
        </SvgText>

        {/* X axis */}
        {axisTicks.map(({ pointIndex, label, anchor, labelX }) => {
          const coordinate = coordinates[pointIndex];
          if (!coordinate) return null;
          return (
            <SvgText
              key={`time-${pointIndex}`}
              x={labelX ?? coordinate.x}
              y={height - 12}
              textAnchor={anchor}
              fill="rgba(10,27,46,0.55)"
              fontFamily={paperFonts.metaMonoBold}
              fontSize="9"
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

export function PierCastMiniBar({
  value,
  color,
}: {
  value: number | null;
  color: string;
}) {
  const percent = value === null ? 0 : Math.max(0, Math.min(100, value * 10));
  return (
    <View style={styles.miniTrack}>
      <View
        style={[
          styles.miniFill,
          {
            width: `${percent}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gauge: { alignItems: "center", justifyContent: "center" },
  gaugeReadout: {
    position: "absolute",
    left: 12,
    right: 12,
    alignItems: "center",
  },
  gaugeReadoutCompact: { left: 5, right: 5 },
  gaugeValueRow: { flexDirection: "row", alignItems: "baseline" },
  gaugeValue: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1.2,
  },
  gaugeValueCompact: { fontSize: 15, lineHeight: 18, letterSpacing: -0.4 },
  gaugeValueMedium: { fontSize: 23, lineHeight: 27, letterSpacing: -0.8 },
  gaugeMaximum: {
    color: "rgba(10,27,46,0.48)",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 0.25,
  },
  gaugeMaximumCompact: { fontSize: 4.5, letterSpacing: 0 },
  gaugeMaximumMedium: { fontSize: 6 },
  gaugeLabel: {
    marginTop: 1,
    color: "rgba(10,27,46,0.64)",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.5,
    letterSpacing: 0.9,
  },
  gaugeLabelCompact: { marginTop: 0, fontSize: 4.2, letterSpacing: 0.35 },
  gaugeLabelMedium: { fontSize: 5.4, letterSpacing: 0.5 },
  chartShell: { height: 212, overflow: "hidden" },
  emptyChart: {
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: "#F8FAF9",
  },
  emptyChartText: {
    color: "rgba(10,27,46,0.48)",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    letterSpacing: 0.9,
  },
  miniTrack: {
    height: 6,
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: "rgba(10,27,46,0.09)",
  },
  miniFill: { height: "100%", borderRadius: 3 },
});
