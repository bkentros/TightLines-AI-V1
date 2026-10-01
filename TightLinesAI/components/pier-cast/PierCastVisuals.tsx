import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import {
  buildPierCastChartModel,
  pierCastDeltaLabel,
  pierCastReadoutTime,
  pierCastSmoothPath,
  type PierCastShiftCard,
  type PierCastTimelinePoint,
} from "../../lib/pierCastCityReportPresentation";
import { pierCastWaterTemperatureColor } from "../../lib/pierCastTemperatureScale";
import { paper, paperFonts } from "../../lib/theme";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const INK = paper.dashboardInk;
const AXIS_INK = "rgba(10,27,46,0.6)";
const COOL = "#2F86C9";
const WARM = "#E0772F";
const COOL_INK = "#1F5E8C";
const WARM_INK = "#B4541F";
const CHART_HEIGHT = 262;
const LAYOUT_PADDING = { left: 38, right: 12, top: 32, bottom: 52 };
const DRAW_LENGTH = 2400;

/**
 * Five-day modeled water-temperature chart for the city report.
 *
 * - Left axis: °F ticks every 1, 2, 4, 5 or 10° depending on the forecast's spread.
 * - Bottom axis: one label per local day ("TODAY", "WED 30" …) with that day's
 *   low–high underneath. Days roll forward on their own because the modeled
 *   timeline always starts at "now".
 * - Shaded windows are the detected water-temp shifts (↓ DROP / ↑ RISE).
 * - The stroke color follows the shared Great Lakes water palette, so the
 *   line's color and height say the same thing.
 * - Press and drag anywhere on the chart to read any hour.
 */
export function PierCastCityTemperatureChart({
  points,
  shifts,
  todayDate,
  reduceMotion,
}: {
  points: readonly PierCastTimelinePoint[];
  shifts: readonly PierCastShiftCard[];
  todayDate: string | null;
  reduceMotion: boolean;
}) {
  const [width, setWidth] = useState(0);
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const areaId = `cityTempArea${rawId}`;
  const strokeId = `cityTempStroke${rawId}`;
  const draw = useRef(new Animated.Value(reduceMotion ? 0 : DRAW_LENGTH)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const model = useMemo(
    () => width > 0
      ? buildPierCastChartModel({
        points,
        shifts,
        todayDate,
        layout: { width, height: CHART_HEIGHT, ...LAYOUT_PADDING },
      })
      : null,
    [points, shifts, todayDate, width],
  );

  const firstValidAt = points[0]?.validAt ?? "";
  useEffect(() => {
    if (reduceMotion || !model) {
      draw.setValue(0);
      return;
    }
    draw.setValue(DRAW_LENGTH);
    const animation = Animated.timing(draw, {
      toValue: 0,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
    // Redraw when the forecast itself changes, not on every layout pass.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draw, reduceMotion, firstValidAt, model !== null]);

  useEffect(() => {
    if (reduceMotion) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== width) setWidth(next);
  };

  const scrubAt = (event: GestureResponderEvent) => {
    if (!model) return;
    const x = event.nativeEvent.locationX;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    model.points.forEach((point, index) => {
      const delta = Math.abs(point.x - x);
      if (delta < distance) {
        distance = delta;
        nearest = index;
      }
    });
    if (nearest !== scrubIndex) setScrubIndex(nearest);
  };

  if (points.length < 2) return null;

  const layout = model?.layout;
  const plotBottom = layout ? layout.height - layout.bottom : 0;
  const plotRight = layout ? layout.width - layout.right : 0;
  const linePath = model ? pierCastSmoothPath(model.points) : "";
  const last = model?.points[model.points.length - 1];
  const areaPath = model && last
    ? `${linePath} L${last.x.toFixed(1)},${plotBottom} L${model.points[0]!.x.toFixed(1)},${plotBottom} Z`
    : "";
  const scrub = model && scrubIndex !== null ? model.points[scrubIndex] ?? null : null;
  const nowF = points[0]!.temperatureF;
  const pulseRadius = pulse.interpolate({ inputRange: [0, 1], outputRange: [5, 14] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });
  const readoutLeft = scrub && width > 0
    ? Math.min(width - 72, Math.max(72, scrub.x))
    : 0;

  return (
    <View
      style={styles.wrap}
      onLayout={onLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel={model
        ? `Modeled water temperature for the next five days, between ${model.points.reduce((low, point) => Math.min(low, point.temperatureF), Number.POSITIVE_INFINITY).toFixed(0)} and ${model.points.reduce((high, point) => Math.max(high, point.temperatureF), Number.NEGATIVE_INFINITY).toFixed(0)} degrees Fahrenheit.`
        : "Modeled water temperature chart"}
    >
      {model && layout ? (
        <Svg width={width} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#4E9BC4" stopOpacity={0.26} />
              <Stop offset="1" stopColor="#4E9BC4" stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
              id={strokeId}
              x1="0"
              y1={layout.top}
              x2="0"
              y2={plotBottom}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={pierCastWaterTemperatureColor(model.highF)} />
              <Stop offset="0.5" stopColor={pierCastWaterTemperatureColor((model.highF + model.lowF) / 2)} />
              <Stop offset="1" stopColor={pierCastWaterTemperatureColor(model.lowF)} />
            </LinearGradient>
          </Defs>

          {model.shifts.map((shift) => (
            <Rect
              key={`band-${shift.id}`}
              x={shift.x0}
              y={layout.top}
              width={Math.max(1, shift.x1 - shift.x0)}
              height={plotBottom - layout.top}
              fill={shift.direction === "cooling" ? COOL : WARM}
              opacity={0.1}
            />
          ))}
          {model.shifts.map((shift) => (
            <SvgText
              key={`label-${shift.id}`}
              x={Math.min(plotRight - 22, Math.max(layout.left + 22, (shift.x0 + shift.x1) / 2))}
              y={layout.top - 9}
              textAnchor="middle"
              fontFamily={paperFonts.metaMonoBold}
              fontSize={9}
              letterSpacing={0.8}
              fill={shift.direction === "cooling" ? COOL_INK : WARM_INK}
            >
              {shift.label}
            </SvgText>
          ))}

          <SvgText
            x={layout.left - 6}
            y={layout.top - 9}
            textAnchor="end"
            fontFamily={paperFonts.metaMonoBold}
            fontSize={9}
            fill={INK}
          >
            °F
          </SvgText>
          {model.yTicks.map((tick) => (
            <Line
              key={`grid-${tick.label}`}
              x1={layout.left}
              x2={plotRight}
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(10,27,46,0.12)"
              strokeDasharray="2 5"
            />
          ))}
          {model.yTicks.map((tick) => (
            <SvgText
              key={`tick-${tick.label}`}
              x={layout.left - 6}
              y={tick.y + 3.5}
              textAnchor="end"
              fontFamily={paperFonts.metaMonoBold}
              fontSize={10}
              fill={AXIS_INK}
            >
              {tick.label}
            </SvgText>
          ))}

          {model.boundaries.map((x) => (
            <Line
              key={`day-${x.toFixed(1)}`}
              x1={x}
              x2={x}
              y1={layout.top}
              y2={plotBottom}
              stroke="rgba(10,27,46,0.16)"
              strokeDasharray="3 4"
            />
          ))}
          <Line
            x1={layout.left}
            x2={plotRight}
            y1={plotBottom}
            y2={plotBottom}
            stroke="rgba(10,27,46,0.3)"
          />

          <Path d={areaPath} fill={`url(#${areaId})`} />
          <AnimatedPath
            d={linePath}
            fill="none"
            stroke={`url(#${strokeId})`}
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={[DRAW_LENGTH, DRAW_LENGTH]}
            strokeDashoffset={draw}
          />

          {model.high ? (
            <>
              <Circle cx={model.high.x} cy={model.high.y} r={4} fill="#FFFFFF" stroke={WARM_INK} strokeWidth={2.4} />
              <SvgText
                x={model.high.x}
                y={model.high.y - 10}
                textAnchor={anchorFor(model.high.x, layout.left, plotRight)}
                fontFamily={paperFonts.metaMonoBold}
                fontSize={10}
                fill={WARM_INK}
              >
                {model.high.label}
              </SvgText>
            </>
          ) : null}
          {model.low ? (
            <>
              <Circle cx={model.low.x} cy={model.low.y} r={4} fill="#FFFFFF" stroke={COOL_INK} strokeWidth={2.4} />
              <SvgText
                {...lowLabelPlacement(model.low, layout.left, plotRight, plotBottom)}
                fontFamily={paperFonts.metaMonoBold}
                fontSize={10}
                fill={COOL_INK}
              >
                {model.low.label}
              </SvgText>
            </>
          ) : null}

          {model.now ? (
            <>
              <AnimatedCircle cx={model.now.x} cy={model.now.y} r={pulseRadius} fill={INK} opacity={pulseOpacity} />
              <Circle cx={model.now.x} cy={model.now.y} r={5} fill={INK} stroke="#FFFFFF" strokeWidth={2} />
              <Rect
                x={model.now.x + 8}
                y={model.now.y - 21}
                width={model.now.label.length * 6.3 + 8}
                height={15}
                rx={4}
                fill="rgba(255,255,255,0.9)"
              />
              <SvgText
                x={model.now.x + 12}
                y={model.now.y - 10}
                fontFamily={paperFonts.metaMonoBold}
                fontSize={10}
                fill={INK}
              >
                {model.now.label}
              </SvgText>
            </>
          ) : null}

          {scrub ? (
            <>
              <Line x1={scrub.x} x2={scrub.x} y1={layout.top} y2={plotBottom} stroke={INK} strokeWidth={1.4} />
              <Circle cx={scrub.x} cy={scrub.y} r={6} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
            </>
          ) : null}

          {model.days.filter((day) => day.visible).map((day) => (
            <SvgText
              key={`dl-${day.localDate}`}
              x={day.x}
              y={plotBottom + 16}
              textAnchor={day.align === "end" ? "end" : "middle"}
              fontFamily={paperFonts.metaMonoBold}
              fontSize={10}
              letterSpacing={0.4}
              fill={INK}
            >
              {day.label}
            </SvgText>
          ))}
          {model.days.filter((day) => day.visible && day.range).map((day) => {
            const chipWidth = (day.range?.length ?? 0) * 5.8 + 8;
            return (
              <Rect
                key={`rc-${day.localDate}`}
                x={day.x - chipWidth / 2}
                y={plotBottom + 23}
                width={chipWidth}
                height={15}
                rx={4}
                fill="rgba(10,27,46,0.05)"
              />
            );
          })}
          {model.days.filter((day) => day.visible && day.range).map((day) => (
            <SvgText
              key={`rt-${day.localDate}`}
              x={day.x}
              y={plotBottom + 34}
              textAnchor="middle"
              fontFamily={paperFonts.metaMonoBold}
              fontSize={9}
              fill={AXIS_INK}
            >
              {day.range}
            </SvgText>
          ))}
        </Svg>
      ) : (
        <View style={{ height: CHART_HEIGHT }} />
      )}
      <View
        style={StyleSheet.absoluteFill}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={scrubAt}
        onResponderMove={scrubAt}
        onResponderRelease={() => setScrubIndex(null)}
        onResponderTerminate={() => setScrubIndex(null)}
        onResponderTerminationRequest={() => true}
      />
      {scrub ? (
        <View pointerEvents="none" style={[styles.readout, { left: readoutLeft }]}>
          <Text style={styles.readoutTime}>{pierCastReadoutTime(scrub, todayDate).toUpperCase()}</Text>
          <Text style={styles.readoutValue}>{scrub.temperatureF.toFixed(1)}°F</Text>
          <Text style={styles.readoutDelta}>
            {scrubIndex === 0 ? "Now" : pierCastDeltaLabel(scrub.temperatureF, nowF)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}


/** Beside the point when it sits on the floor of the plot, else below it. */
function lowLabelPlacement(
  low: { x: number; y: number },
  left: number,
  right: number,
  bottom: number,
): { x: number; y: number; textAnchor: "start" | "middle" | "end" } {
  if (low.y <= bottom - 18) {
    return { x: low.x, y: low.y + 17, textAnchor: anchorFor(low.x, left, right) };
  }
  return low.x > right - 76
    ? { x: low.x - 9, y: low.y + 3.5, textAnchor: "end" }
    : { x: low.x + 9, y: low.y + 3.5, textAnchor: "start" };
}

function anchorFor(x: number, left: number, right: number): "start" | "middle" | "end" {
  if (x > right - 34) return "end";
  if (x < left + 34) return "start";
  return "middle";
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12, marginHorizontal: -4 },
  readout: {
    position: "absolute",
    top: 0,
    width: 144,
    marginLeft: -72,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: INK,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  readoutTime: { fontFamily: paperFonts.metaMonoBold, fontSize: 10, letterSpacing: 1.2, color: "rgba(255,255,255,0.7)" },
  readoutValue: { fontFamily: paperFonts.display, fontSize: 17, lineHeight: 21, color: "#FFFFFF" },
  readoutDelta: { fontFamily: paperFonts.bodySemiBold, fontSize: 11, color: "rgba(255,255,255,0.78)" },
});
