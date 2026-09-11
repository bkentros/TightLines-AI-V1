import { useId } from "react";
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

function formatDay(value: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    timeZone: timezone,
  })
    .format(new Date(value))
    .replace(",", "")
    .toUpperCase();
}

type AxisTick = {
  pointIndex: number;
  label: string;
  anchor: "start" | "middle" | "end";
  labelX?: number;
};

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
  const height = 188;
  const plot = { left: 42, right: 10, top: 15, bottom: 34 };
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
  const areaPath =
    linePath && coordinates.length
      ? `${linePath} L${coordinates[coordinates.length - 1]!.x},${plot.top + plotHeight} L${coordinates[0]!.x},${plot.top + plotHeight} Z`
      : "";
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientId = `pierTemp${rawId}`;
  const yTicks = [high, high - range / 3, high - (2 * range) / 3, low];
  const axisTicks: AxisTick[] = values.length
    ? xAxisMode === "days"
      ? (() => {
          const lastIndex = values.length - 1;
          return Array.from(
            new Set(
              Array.from({ length: 6 }, (_, index) =>
                Math.round((lastIndex * index) / 5),
              ),
            ),
          ).map((pointIndex) => ({
            pointIndex,
            label:
              pointIndex === 0
                ? "TODAY"
                : formatDay(points[pointIndex]!.validAt, timezone),
            anchor:
              pointIndex === 0
                ? ("start" as const)
                : pointIndex === lastIndex
                  ? ("end" as const)
                  : ("middle" as const),
            labelX:
              pointIndex === 0
                ? plot.left
                : pointIndex === lastIndex
                  ? plot.left + plotWidth
                  : undefined,
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

  return (
    <View
      style={styles.chartShell}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Hourly surface water temperature ranges from ${rawMin.toFixed(1)} to ${rawMax.toFixed(1)} degrees Fahrenheit.`}
    >
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop
              offset="0"
              stopColor={paper.dashboardBlueSky}
              stopOpacity="0.8"
            />
            <Stop
              offset="0.7"
              stopColor={paper.dashboardBlueSky}
              stopOpacity="0.22"
            />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {yTicks.map((tick, index) => {
          const y = plot.top + (index / (yTicks.length - 1)) * plotHeight;
          return (
            <Line
              key={tick}
              x1={plot.left}
              x2={plot.left + plotWidth}
              y1={y}
              y2={y}
              stroke="rgba(10,27,46,0.11)"
              strokeWidth="1"
              strokeDasharray={index === yTicks.length - 1 ? undefined : "3 5"}
            />
          );
        })}
        {yTicks.map((tick, index) => (
          <SvgText
            key={`label-${tick}`}
            x={plot.left - 7}
            y={plot.top + (index / (yTicks.length - 1)) * plotHeight + 3}
            textAnchor="end"
            fill="rgba(10,27,46,0.58)"
            fontFamily={paperFonts.metaMonoBold}
            fontSize="8"
          >
            {`${Math.round(tick)}°`}
          </SvgText>
        ))}
        {axisTicks.map(({ pointIndex }) => {
          const coordinate = coordinates[pointIndex]!;
          return (
            <Line
              key={`vertical-${pointIndex}`}
              x1={coordinate.x}
              x2={coordinate.x}
              y1={plot.top}
              y2={plot.top + plotHeight}
              stroke="rgba(10,27,46,0.055)"
              strokeWidth="1"
            />
          );
        })}
        <Path d={areaPath} fill={`url(#${gradientId})`} />
        <Path
          d={linePath}
          fill="none"
          stroke={paper.dashboardBlue}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {axisTicks.map(({ pointIndex }) => {
          const coordinate = coordinates[pointIndex]!;
          return (
            <Circle
              key={`dot-${pointIndex}`}
              cx={coordinate.x}
              cy={coordinate.y}
              r="3.2"
              fill="#FFFFFF"
              stroke={paper.dashboardBlue}
              strokeWidth="2"
            />
          );
        })}
        {axisTicks.map(({ pointIndex, label, anchor, labelX }) => {
          const coordinate = coordinates[pointIndex]!;
          return (
            <SvgText
              key={`time-${pointIndex}`}
              x={labelX ?? coordinate.x}
              y={height - 9}
              textAnchor={anchor}
              fill="rgba(10,27,46,0.58)"
              fontFamily={paperFonts.metaMonoBold}
              fontSize="8"
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
  chartShell: { height: 188, overflow: "hidden" },
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
