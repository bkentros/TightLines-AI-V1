import { Ionicons } from "@expo/vector-icons";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

import type { RiverRunPrimitiveDisplay } from "../../lib/riverRunContracts";
import {
  resolveRiverRunVisualModel,
  type RiverRunVisualKind,
  type RiverRunVisualModel,
} from "../../lib/riverRunVisuals";
import { paper, paperFonts } from "../../lib/theme";

type VisualPrimitive = RiverRunPrimitiveDisplay & {
  stage?: string;
  timingLabel?: string | null;
  curveDirection?: string;
  historicalRunStrength?: "limited" | "moderate" | "strong";
};

const ART_HEIGHT = 76;
const MARKER_SIZE = 28;
const KIND_STAGGER: Record<RiverRunVisualKind, number> = {
  run_stage: 0,
  run_timing: 460,
  push: 920,
  fishability: 1380,
  fish_in_river: 1840,
};

export function RiverRunVisual({
  kind,
  primitive,
}: {
  kind: RiverRunVisualKind;
  primitive: VisualPrimitive;
}) {
  const model = useMemo(
    () => resolveRiverRunVisualModel({ kind, primitive }),
    [kind, primitive],
  );
  const reduceMotion = useReduceMotion();
  const [panelWidth, setPanelWidth] = useState(0);
  const position = useRef(new Animated.Value(model.position)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const ceilingPercent = Math.max(
    0,
    Math.min(100, (model.ceilingPosition ?? 1) * 100),
  );
  const presenceAccessibility = model.kind === "fish_in_river"
    ? ` River and species ceiling ${model.riverMaximum} out of 100. Historical migration strength on this river ${model.historicalRunStrength}. Seasonal presence index ${
      model.score ?? 0
    } out of 100.`
    : "";

  useEffect(() => {
    if (reduceMotion) {
      position.setValue(model.position);
      entrance.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(position, {
        toValue: model.position,
        damping: 16,
        stiffness: 105,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(entrance, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [entrance, model.position, position, reduceMotion]);

  useEffect(() => {
    pulse.setValue(0);
    shimmer.setValue(0);
    drift.setValue(0);
    if (reduceMotion) return;

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1250,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1250,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(KIND_STAGGER[kind]),
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1150,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(3600),
      ]),
    );
    pulseLoop.start();
    driftLoop.start();
    shimmerLoop.start();
    return () => {
      pulseLoop.stop();
      driftLoop.stop();
      shimmerLoop.stop();
    };
  }, [drift, kind, pulse, reduceMotion, shimmer]);

  const markerTranslate = position.interpolate({
    inputRange: [0, 1],
    outputRange: [
      -MARKER_SIZE / 2,
      Math.max(-MARKER_SIZE / 2, panelWidth - 26 - MARKER_SIZE / 2),
    ],
  });
  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-110, Math.max(180, panelWidth + 80)],
  });
  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1.18],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 0.16],
  });
  const driftY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-2.5, 2.5],
  });
  const entranceY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });
  const entranceOpacity = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <Animated.View
      style={[
        styles.shell,
        {
          opacity: entranceOpacity,
          transform: [{ translateY: entranceY }],
        },
      ]}
      onLayout={(event) => setPanelWidth(event.nativeEvent.layout.width)}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${model.artLabel}. ${model.stateLabel}. ${model.stateNote}.${presenceAccessibility}`}
    >
      <View style={styles.panel} pointerEvents="none">
        <VisualBackground uid={uid} accent={model.accent} />

        <View style={styles.topRow}>
          <View style={styles.identity}>
            <View
              style={[
                styles.iconTile,
                { borderColor: `${model.accent}88` },
              ]}
            >
              <Ionicons name={model.icon} size={16} color="#FFFFFF" />
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.kicker}>{model.kicker}</Text>
              <Text style={styles.artLabel}>{model.artLabel}</Text>
            </View>
          </View>
          {model.kind === "fish_in_river"
            ? (
              <View style={styles.riverCeilingBadge}>
                <Text style={styles.riverCeilingLabel}>RIVER CEILING</Text>
                <View style={styles.riverCeilingValueRow}>
                  <Text style={styles.riverCeilingValue}>
                    {model.riverMaximum}
                  </Text>
                  <Text style={styles.riverCeilingMaximum}>/100</Text>
                </View>
              </View>
            )
            : null}
        </View>

        <View style={styles.artStage}>
          <VisualArt
            model={model}
            width={panelWidth}
            position={position}
            pulse={pulse}
            pulseScale={pulseScale}
            pulseOpacity={pulseOpacity}
            driftY={driftY}
          />
        </View>

        <View style={styles.readRow}>
          <Text style={styles.stateNote} numberOfLines={1}>
            {model.stateNote}
          </Text>
        </View>

        {model.kind === "fish_in_river"
          ? (
            <View style={styles.presenceContextRow}>
              <View style={styles.presenceContextItem}>
                <Text style={styles.presenceContextLabel}>
                  HISTORICAL MIGRATION STRENGTH
                </Text>
                <Text
                  style={[
                    styles.presenceContextValue,
                    {
                      color: historicalStrengthColor(
                        model.historicalRunStrength,
                      ),
                    },
                  ]}
                >
                  {model.historicalRunStrength?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.presenceContextDivider} />
              <View style={styles.presenceContextItem}>
                <Text style={styles.presenceContextLabel}>
                  PRESENCE INDEX
                </Text>
                <View style={styles.presenceIndexValueRow}>
                  <Text
                    style={[
                      styles.presenceIndexScore,
                      { color: model.accent },
                    ]}
                  >
                    {model.score}
                  </Text>
                  <Text style={styles.presenceIndexMaximum}>/100</Text>
                </View>
              </View>
            </View>
          )
          : null}

        <View style={styles.meterRegion}>
          <View style={styles.track}>
            {model.stops.map((stop, index) => {
              const selected = index === model.selectedIndex;
              const dimmed = model.specialState != null;
              return (
                <View
                  key={`${model.kind}-${stop.label}`}
                  style={[
                    styles.trackSegment,
                    {
                      backgroundColor: stop.color,
                      opacity: dimmed ? 0.22 : selected ? 1 : 0.48,
                    },
                    selected && styles.trackSegmentSelected,
                  ]}
                />
              );
            })}
            {model.kind === "fish_in_river" && ceilingPercent < 100
              ? (
                <View
                  style={[
                    styles.presenceAboveCeiling,
                    { left: `${ceilingPercent}%` },
                  ]}
                />
              )
              : null}
            {model.kind === "fish_in_river"
              ? (
                <View
                  style={[
                    styles.presenceCeilingMarker,
                    {
                      left: `${
                        Math.max(
                          0.5,
                          Math.min(99.5, ceilingPercent),
                        )
                      }%`,
                    },
                  ]}
                />
              )
              : null}
            {model.selectedIndex != null && !model.specialState
              ? (
                <Animated.View
                  style={[
                    styles.markerHalo,
                    {
                      borderColor: model.accent,
                      opacity: pulseOpacity,
                      transform: [
                        { translateX: markerTranslate },
                        { scale: pulseScale },
                      ],
                    },
                  ]}
                />
              )
              : null}
            {model.selectedIndex != null
              ? (
                <Animated.View
                  style={[
                    styles.marker,
                    {
                      borderColor: model.accent,
                      transform: [{ translateX: markerTranslate }],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.markerCore,
                      { backgroundColor: model.accent },
                    ]}
                  />
                </Animated.View>
              )
              : (
                <View style={styles.specialTrackBadge}>
                  <Ionicons
                    name={specialStateIcon(model.specialState)}
                    size={13}
                    color="#DCE6EC"
                  />
                </View>
              )}
          </View>
          {model.ticks
            ? (
              <View style={styles.meterTicks}>
                {model.ticks.map((tick, index) => {
                  const first = index === 0;
                  const last = index === model.ticks!.length - 1;
                  return (
                    <Text
                      key={`${model.kind}-${tick.label}-tick`}
                      style={[
                        styles.meterTick,
                        {
                          left: `${tick.position * 100}%`,
                          marginLeft: first ? 0 : last ? -32 : -16,
                          textAlign: first ? "left" : last ? "right" : "center",
                        },
                        index === (model.selectedIndex ?? -2) + 1 &&
                        styles.stopLabelSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {tick.label}
                    </Text>
                  );
                })}
              </View>
            )
            : (
              <View style={styles.stopLabels}>
                {model.stops.map((stop, index) => (
                  <Text
                    key={`${model.kind}-${stop.label}-label`}
                    style={[
                      styles.stopLabel,
                      index === model.selectedIndex &&
                      styles.stopLabelSelected,
                    ]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                  >
                    {stop.shortLabel}
                  </Text>
                ))}
              </View>
            )}
        </View>

        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ rotate: "18deg" }, {
                translateX: shimmerTranslate,
              }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.sparkle,
            {
              opacity: pulse.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.22, 0.9, 0.22],
              }),
              transform: [{ scale: pulseScale }],
            },
          ]}
        >
          <Ionicons name="sparkles" size={12} color="#FFFFFF" />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

function VisualBackground({
  uid,
  accent,
}: {
  uid: string;
  accent: string;
}) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 212"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <LinearGradient id={`${uid}bg`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#071829" />
          <Stop offset="0.62" stopColor="#102D42" />
          <Stop offset="1" stopColor={accent} stopOpacity="0.72" />
        </LinearGradient>
        <LinearGradient id={`${uid}glow`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.12" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect width="360" height="212" rx="13" fill={`url(#${uid}bg)`} />
      <Circle cx="330" cy="22" r="74" fill={accent} opacity="0.12" />
      <Circle cx="38" cy="190" r="92" fill="#2A6E96" opacity="0.11" />
      <Path
        d="M-18 53 C52 17 79 79 145 46 S255 20 380 68"
        stroke="#FFFFFF"
        strokeOpacity="0.08"
        strokeWidth="1"
        fill="none"
      />
      <Path
        d="M-10 72 C50 39 95 96 160 64 S274 42 378 86"
        stroke="#FFFFFF"
        strokeOpacity="0.055"
        strokeWidth="1"
        fill="none"
      />
      <Rect
        x="0"
        y="0"
        width="360"
        height="212"
        fill={`url(#${uid}glow)`}
      />
    </Svg>
  );
}

function VisualArt({
  model,
  width,
  position,
  pulse,
  pulseScale,
  pulseOpacity,
  driftY,
}: {
  model: RiverRunVisualModel;
  width: number;
  position: Animated.Value;
  pulse: Animated.Value;
  pulseScale: Animated.AnimatedInterpolation<number>;
  pulseOpacity: Animated.AnimatedInterpolation<number>;
  driftY: Animated.AnimatedInterpolation<number>;
}) {
  switch (model.kind) {
    case "run_stage":
      return (
        <StageArt
          width={width}
          position={position}
          accent={model.accent}
          driftY={driftY}
        />
      );
    case "run_timing":
      return (
        <TimingArt
          position={position}
          accent={model.accent}
          pulseScale={pulseScale}
          pulseOpacity={pulseOpacity}
          special={model.specialState}
          hasRead={model.selectedIndex != null}
        />
      );
    case "push":
      return (
        <PushArt
          accent={model.accent}
          score={model.score}
          pulse={pulse}
          pulseScale={pulseScale}
          pulseOpacity={pulseOpacity}
          driftY={driftY}
          special={model.specialState}
        />
      );
    case "fishability":
      return (
        <FishabilityArt
          accent={model.accent}
          driftY={driftY}
          pulse={pulse}
          special={model.specialState}
        />
      );
    case "fish_in_river":
      return (
        <PresenceArt
          model={model}
          pulse={pulse}
          driftY={driftY}
        />
      );
  }
}

function StageArt({
  width,
  position,
  accent,
  driftY,
}: {
  width: number;
  position: Animated.Value;
  accent: string;
  driftY: Animated.AnimatedInterpolation<number>;
}) {
  const travel = position.interpolate({
    inputRange: [0, 1],
    outputRange: [2, Math.max(8, width - 68)],
  });
  return (
    <View style={styles.fill}>
      <Svg width="100%" height={ART_HEIGHT} viewBox="0 0 320 76">
        <Path
          d="M7 56 C52 23 82 67 127 43 S205 20 313 34"
          stroke="#8DD5E8"
          strokeOpacity="0.42"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M7 56 C52 23 82 67 127 43 S205 20 313 34"
          stroke="#E8F8FF"
          strokeOpacity="0.68"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          fill="none"
        />
        {[24, 80, 136, 192, 248, 304].map((x) => (
          <Circle
            key={x}
            cx={x}
            cy={x < 120 ? 47 : x < 220 ? 34 : 32}
            r="2.6"
            fill="#FFFFFF"
            opacity="0.65"
          />
        ))}
      </Svg>
      <Animated.View
        style={[
          styles.stageFish,
          {
            borderColor: accent,
            transform: [{ translateX: travel }, { translateY: driftY }],
          },
        ]}
      >
        <Ionicons name="fish" size={24} color="#FFFFFF" />
      </Animated.View>
    </View>
  );
}

function TimingArt({
  position,
  accent,
  pulseScale,
  pulseOpacity,
  special,
  hasRead,
}: {
  position: Animated.Value;
  accent: string;
  pulseScale: Animated.AnimatedInterpolation<number>;
  pulseOpacity: Animated.AnimatedInterpolation<number>;
  special?: RiverRunVisualModel["specialState"];
  hasRead: boolean;
}) {
  const rotation = position.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["-48deg", "0deg", "48deg"],
  });
  return (
    <View style={styles.centerArt}>
      <View style={styles.timingDial}>
        <View style={styles.timingArc} />
        {[-46, -23, 0, 23, 46].map((rotationValue) => (
          <View
            key={rotationValue}
            style={[
              styles.timingTick,
              { transform: [{ rotate: `${rotationValue}deg` }] },
            ]}
          />
        ))}
        {hasRead
          ? (
            <>
              <Animated.View
                style={[
                  styles.timingHand,
                  {
                    backgroundColor: special ? "#93A3AF" : accent,
                    transform: [{ rotate: rotation }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.timingPulse,
                  {
                    borderColor: accent,
                    opacity: pulseOpacity,
                    transform: [{ scale: pulseScale }],
                  },
                ]}
              />
              <View style={[styles.timingHub, { backgroundColor: accent }]} />
            </>
          )
          : (
            <View style={styles.timingSpecial}>
              <Ionicons
                name={specialStateIcon(special)}
                size={17}
                color="#DCE6EC"
              />
            </View>
          )}
      </View>
      <View style={styles.timingLabels}>
        <Text style={styles.artMiniLabel}>DELAYED</Text>
        <Text style={styles.artMiniLabel}>TYPICAL</Text>
        <Text style={styles.artMiniLabel}>AHEAD</Text>
      </View>
    </View>
  );
}

function PushArt({
  accent,
  score,
  pulse,
  pulseScale,
  pulseOpacity,
  driftY,
  special,
}: {
  accent: string;
  score?: number | null;
  pulse: Animated.Value;
  pulseScale: Animated.AnimatedInterpolation<number>;
  pulseOpacity: Animated.AnimatedInterpolation<number>;
  driftY: Animated.AnimatedInterpolation<number>;
  special?: RiverRunVisualModel["specialState"];
}) {
  const normalizedScore = Math.max(0, Math.min(100, score ?? 0)) / 100;
  const signalTravel = special ? 0 : 3 + normalizedScore * 34;
  const signalX = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-signalTravel / 2, signalTravel / 2],
  });
  return (
    <View style={styles.pushArt}>
      <View style={styles.lakeOrb}>
        <Ionicons name="water" size={22} color="#A9E3F2" />
        <Animated.View
          style={[
            styles.lakePulse,
            {
              borderColor: accent,
              opacity: pulseOpacity,
              transform: [{ scale: pulseScale }],
            },
          ]}
        />
      </View>
      <View style={styles.pushChannel}>
        <View style={styles.pushChannelLine} />
        <Animated.View
          style={[
            styles.pushArrow,
            {
              backgroundColor: special ? "#81909C" : accent,
              opacity: special ? 0.48 : 0.58 + normalizedScore * 0.42,
              transform: [{ translateX: signalX }, { translateY: driftY }],
            },
          ]}
        >
          <Ionicons name="chevron-forward" size={15} color="#FFFFFF" />
        </Animated.View>
        <View style={[styles.pushEventDot, { backgroundColor: accent }]} />
      </View>
      <View style={styles.riverGate}>
        <Ionicons name="git-merge-outline" size={24} color="#FFFFFF" />
      </View>
    </View>
  );
}

function FishabilityArt({
  accent,
  driftY,
  pulse,
  special,
}: {
  accent: string;
  driftY: Animated.AnimatedInterpolation<number>;
  pulse: Animated.Value;
  special?: RiverRunVisualModel["specialState"];
}) {
  const flowX = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });
  return (
    <View style={styles.fill}>
      <Animated.View
        style={[
          styles.fill,
          { transform: [{ translateX: flowX }, { translateY: driftY }] },
        ]}
      >
        <Svg width="100%" height={ART_HEIGHT} viewBox="0 0 320 76">
          <Path
            d="M-20 24 C22 8 48 38 91 23 S162 9 210 25 S282 37 340 17"
            stroke={special ? "#8B98A5" : accent}
            strokeWidth="8"
            strokeLinecap="round"
            strokeOpacity="0.36"
            fill="none"
          />
          <Path
            d="M-16 45 C29 27 67 59 111 43 S178 28 231 46 S300 58 342 40"
            stroke="#A9E3F2"
            strokeWidth="6"
            strokeLinecap="round"
            strokeOpacity="0.42"
            fill="none"
          />
          <Path
            d="M-10 61 C44 49 80 70 128 58 S215 48 266 62 S318 68 344 58"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeDasharray="8 6"
            strokeOpacity="0.64"
            fill="none"
          />
          {[54, 128, 204, 278].map((x, index) => (
            <Ellipse
              key={x}
              cx={x}
              cy={index % 2 ? 33 : 48}
              rx="10"
              ry="4"
              fill="#FFFFFF"
              opacity="0.16"
            />
          ))}
        </Svg>
      </Animated.View>
    </View>
  );
}

function PresenceArt({
  model,
  pulse,
  driftY,
}: {
  model: RiverRunVisualModel;
  pulse: Animated.Value;
  driftY: Animated.AnimatedInterpolation<number>;
}) {
  const ratio = typeof model.score === "number"
    ? Math.max(0, Math.min(1, model.score / 100))
    : 0;
  const visibleFish = Math.round(ratio * 8);
  const directionIcon = model.direction === "rising"
    ? "trending-up"
    : model.direction === "falling"
    ? "trending-down"
    : model.direction === "near_peak"
    ? "remove"
    : "close";
  return (
    <View style={styles.presenceArt}>
      <View style={styles.fishSchool}>
        {Array.from({ length: 8 }, (_, index) => {
          const active = index < visibleFish;
          const last = index === visibleFish - 1;
          return (
            <Animated.View
              key={index}
              style={[
                styles.schoolFish,
                {
                  opacity: last && active
                    ? pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.58, 1],
                    })
                    : active
                    ? 0.92
                    : 0.16,
                  transform: [
                    { translateY: index % 2 === 0 ? driftY : 0 },
                    { scaleX: index % 3 === 0 ? -1 : 1 },
                  ],
                },
              ]}
            >
              <Ionicons
                name="fish"
                size={index % 2 ? 18 : 21}
                color={active ? "#FFFFFF" : "#9AABB7"}
              />
            </Animated.View>
          );
        })}
      </View>
      <View
        style={[
          styles.directionBadge,
          { borderColor: `${model.accent}99` },
        ]}
      >
        <Ionicons
          name={directionIcon}
          size={17}
          color={model.accent}
        />
        <Text style={styles.directionText}>
          {directionLabel(model.direction)}
        </Text>
      </View>
    </View>
  );
}

function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  return reduceMotion;
}

function directionLabel(
  direction?: RiverRunVisualModel["direction"],
): string {
  switch (direction) {
    case "rising":
      return "RISING";
    case "falling":
      return "FALLING";
    case "near_peak":
      return "NEAR PEAK";
    case "outside":
      return "OUTSIDE";
    default:
      return "SEASONAL";
  }
}

function historicalStrengthColor(
  strength?: RiverRunVisualModel["historicalRunStrength"],
): string {
  switch (strength?.toLowerCase()) {
    case "strong":
      return "#48CF78";
    case "moderate":
      return "#F2C94C";
    case "limited":
    case "weak":
      return "#F06A61";
    default:
      return "#FFFFFF";
  }
}

function specialStateIcon(
  state?: RiverRunVisualModel["specialState"],
): keyof typeof Ionicons.glyphMap {
  switch (state) {
    case "waiting":
      return "hourglass-outline";
    case "complete":
      return "checkmark";
    case "unavailable":
    default:
      return "remove";
  }
}

const styles = StyleSheet.create({
  shell: {
    marginTop: 13,
    borderRadius: 13,
    backgroundColor: paper.dashboardInk,
    shadowColor: "#06111E",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 7,
  },
  panel: {
    position: "relative",
    overflow: "hidden",
    minHeight: 212,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 13,
  },
  topRow: {
    zIndex: 4,
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  riverCeilingBadge: {
    minWidth: 76,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 9,
    backgroundColor: "rgba(2,10,18,0.46)",
  },
  riverCeilingLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    letterSpacing: 0.65,
    color: "rgba(255,255,255,0.58)",
  },
  riverCeilingValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  riverCeilingValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 19,
    lineHeight: 21,
    color: "#FFFFFF",
  },
  riverCeilingMaximum: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    color: "rgba(255,255,255,0.58)",
  },
  identity: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.09)",
  },
  identityCopy: { minWidth: 0, flex: 1, gap: 1 },
  kicker: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.58)",
  },
  artLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.4,
    color: "#FFFFFF",
  },
  artStage: {
    zIndex: 2,
    height: ART_HEIGHT,
    marginTop: 3,
  },
  fill: { ...StyleSheet.absoluteFillObject },
  centerArt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stageFish: {
    position: "absolute",
    top: 24,
    left: 0,
    width: 40,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "rgba(5,22,35,0.82)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.24,
    shadowRadius: 8,
  },
  readRow: {
    zIndex: 4,
    minHeight: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
    marginBottom: 7,
  },
  stateNote: {
    minWidth: 0,
    flex: 1,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.8,
    letterSpacing: 0.75,
    color: "rgba(255,255,255,0.66)",
  },
  presenceContextRow: {
    zIndex: 5,
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 9,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 8,
    backgroundColor: "rgba(2,10,18,0.38)",
  },
  presenceContextItem: {
    minWidth: 0,
    flex: 1,
    gap: 2,
  },
  presenceContextDivider: {
    width: 1,
    marginHorizontal: 9,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  presenceContextLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.6,
    letterSpacing: 0.6,
    color: "rgba(255,255,255,0.52)",
  },
  presenceContextValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.35,
    color: "#FFFFFF",
  },
  presenceIndexValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  presenceIndexScore: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.25,
  },
  presenceIndexMaximum: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.25,
    color: "#FFFFFF",
  },
  meterRegion: { zIndex: 5 },
  track: {
    position: "relative",
    height: 13,
    flexDirection: "row",
    gap: 3,
    padding: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    backgroundColor: "rgba(2,10,18,0.64)",
  },
  trackSegment: {
    flex: 1,
    borderRadius: 999,
  },
  trackSegmentSelected: {
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.62,
    shadowRadius: 6,
  },
  presenceAboveCeiling: {
    position: "absolute",
    top: 2,
    right: 2,
    bottom: 2,
    borderRadius: 999,
    backgroundColor: "rgba(2,10,18,0.76)",
  },
  presenceCeilingMarker: {
    position: "absolute",
    top: -4,
    bottom: -4,
    width: 2,
    marginLeft: -1,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  markerHalo: {
    position: "absolute",
    top: -8,
    left: 0,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderWidth: 2,
    borderRadius: MARKER_SIZE / 2,
  },
  marker: {
    position: "absolute",
    top: -8,
    left: 0,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  markerCore: { width: 10, height: 10, borderRadius: 5 },
  specialTrackBadge: {
    position: "absolute",
    top: -7,
    left: "50%",
    width: 27,
    height: 27,
    marginLeft: -13.5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#8B98A5",
    borderRadius: 14,
    backgroundColor: "#122A3C",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 4,
  },
  stopLabels: {
    flexDirection: "row",
    gap: 3,
    marginTop: 8,
  },
  stopLabel: {
    flex: 1,
    minHeight: 16,
    textAlign: "center",
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    lineHeight: 7,
    letterSpacing: 0.15,
    color: "rgba(255,255,255,0.43)",
  },
  stopLabelSelected: { color: "#FFFFFF" },
  meterTicks: {
    position: "relative",
    height: 16,
    marginTop: 8,
  },
  meterTick: {
    position: "absolute",
    width: 32,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 5.8,
    lineHeight: 7,
    letterSpacing: 0.15,
    color: "rgba(255,255,255,0.43)",
  },
  shimmer: {
    position: "absolute",
    top: -60,
    bottom: -80,
    left: -45,
    width: 54,
    backgroundColor: "rgba(255,255,255,0.085)",
  },
  sparkle: {
    position: "absolute",
    top: 48,
    right: 18,
  },
  timingDial: {
    position: "relative",
    width: 104,
    height: 58,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  timingArc: {
    position: "absolute",
    bottom: 0,
    width: 92,
    height: 46,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "rgba(255,255,255,0.36)",
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
  },
  timingTick: {
    position: "absolute",
    bottom: 5,
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.17)",
    transformOrigin: "center bottom",
  },
  timingHand: {
    position: "absolute",
    bottom: 7,
    width: 3,
    height: 39,
    borderRadius: 2,
    transformOrigin: "center bottom",
  },
  timingHub: {
    position: "absolute",
    bottom: 1,
    width: 14,
    height: 14,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 7,
  },
  timingSpecial: {
    position: "absolute",
    bottom: -1,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(220,230,236,0.48)",
    borderRadius: 14,
    backgroundColor: "rgba(7,24,41,0.88)",
  },
  timingPulse: {
    position: "absolute",
    bottom: -4,
    width: 24,
    height: 24,
    borderWidth: 1.5,
    borderRadius: 12,
  },
  timingLabels: {
    width: 178,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  artMiniLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6,
    letterSpacing: 0.65,
    color: "rgba(255,255,255,0.48)",
  },
  pushArt: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  lakeOrb: {
    position: "relative",
    width: 49,
    height: 49,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(169,227,242,0.56)",
    borderRadius: 25,
    backgroundColor: "rgba(42,110,150,0.33)",
  },
  lakePulse: {
    position: "absolute",
    width: 57,
    height: 57,
    borderWidth: 1.5,
    borderRadius: 29,
  },
  pushChannel: {
    position: "relative",
    width: 124,
    height: 38,
    justifyContent: "center",
  },
  pushChannelLine: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(169,227,242,0.55)",
  },
  pushArrow: {
    position: "absolute",
    left: 49,
    width: 27,
    height: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  pushEventDot: {
    position: "absolute",
    right: 4,
    width: 8,
    height: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 4,
  },
  riverGate: {
    width: 44,
    height: 49,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  presenceArt: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  fishSchool: {
    width: "72%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 5,
  },
  schoolFish: {
    width: 26,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  directionBadge: {
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 9,
    backgroundColor: "rgba(3,14,24,0.48)",
  },
  directionText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 6.4,
    letterSpacing: 0.7,
    color: "#FFFFFF",
  },
});
