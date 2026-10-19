/**
 * PierCast landing art: a red Great Lakes pierhead lighthouse on a breakwater
 * at first light, with an angler casting off the catwalk pier. Drawn entirely
 * in react-native-svg in the field-guide palette (navy, gold, cream, pier red),
 * so it is crisp at every size and ships no image files. The lantern beam
 * breathes slowly unless Reduce Motion is on.
 */
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const W = 400;
const H = 230;
const HORIZON = 158;
const SUN_X = 124;

const STARS: ReadonlyArray<readonly [number, number, number]> = [
  [36, 22, 1.1], [74, 48, 0.8], [128, 18, 1], [176, 40, 0.7], [214, 14, 1.2], [262, 34, 0.8],
  [301, 12, 0.9], [338, 44, 1.1], [372, 20, 0.8], [392, 58, 0.7], [152, 66, 0.6], [246, 62, 0.7],
  [20, 70, 0.7], [318, 76, 0.6],
];

/** Broken gold sun-glitter dashes on the water, widest near the horizon. */
const GLITTER = Array.from({ length: 13 }, (_, row) => {
  const y = HORIZON + 3 + row * 5.4 + row * row * 0.12;
  const spread = 34 - row * 1.6;
  const pieces = 2 + (row % 3);
  return Array.from({ length: pieces }, (_, k) => {
    const seed = (row * 7 + k * 13) % 17;
    const width = 5 + ((row * 11 + k * 7) % 14) - row * 0.25;
    const x = SUN_X - spread + (k + 0.5) * ((spread * 2) / pieces) - width / 2 + (seed - 8) * 0.9;
    return { x, y, width: Math.max(3, width), opacity: Math.max(0.12, 0.7 - row * 0.045 - (seed % 4) * 0.05) };
  });
}).flat();

/** Faint ripple lines across the open water. */
const RIPPLES = Array.from({ length: 16 }, (_, i) => {
  const y = HORIZON + 8 + i * 4.3;
  const x = (i * 97) % 330;
  const width = 26 + ((i * 41) % 46);
  return { x, y, width };
});

export function PierCastLighthouseArt({
  width,
  reduceMotion,
}: {
  width: number;
  reduceMotion: boolean;
}) {
  const height = Math.round((width * H) / W);
  const beam = useRef(new Animated.Value(reduceMotion ? 0.85 : 0.55)).current;
  useEffect(() => {
    if (reduceMotion) {
      beam.setValue(0.85);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(beam, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(beam, { toValue: 0.45, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [beam, reduceMotion]);

  return (
    <View
      style={{ width, height }}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Illustration: a red pierhead lighthouse at sunrise with an angler casting from the pier"
    >
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="pcSky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0} stopColor="#0A1B2E" />
            <Stop offset={0.5} stopColor="#14304C" />
            <Stop offset={0.78} stopColor="#3E4E63" />
            <Stop offset={0.91} stopColor="#A9714A" />
            <Stop offset={1} stopColor="#EDAA52" />
          </LinearGradient>
          <LinearGradient id="pcWater" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0} stopColor="#2B4A63" />
            <Stop offset={0.35} stopColor="#173550" />
            <Stop offset={1} stopColor="#0A1B2E" />
          </LinearGradient>
          <RadialGradient id="pcGlow" cx={SUN_X} cy={HORIZON} r={120} gradientUnits="userSpaceOnUse">
            <Stop offset={0} stopColor="#F6C66A" stopOpacity={0.55} />
            <Stop offset={0.45} stopColor="#E8A02E" stopOpacity={0.16} />
            <Stop offset={1} stopColor="#E8A02E" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="pcSun" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0} stopColor="#FFE7AE" />
            <Stop offset={1} stopColor="#F0A63A" />
          </LinearGradient>
          <LinearGradient id="pcTower" x1="0" y1="0" x2="1" y2="0">
            <Stop offset={0} stopColor="#E0483C" />
            <Stop offset={0.55} stopColor="#C8352C" />
            <Stop offset={1} stopColor="#8E241E" />
          </LinearGradient>
        </Defs>

        {/* Sky, stars and sun */}
        <Rect x={0} y={0} width={W} height={HORIZON + 1} fill="url(#pcSky)" />
        {STARS.map(([x, y, r]) => (
          <Circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#F4EBD6" opacity={0.55} />
        ))}
        <Circle cx={SUN_X} cy={HORIZON} r={120} fill="url(#pcGlow)" />
        <Circle cx={SUN_X} cy={HORIZON + 2} r={27} fill="url(#pcSun)" />

        {/* Distant dune shoreline */}
        <Path
          d={`M0 ${HORIZON} L0 151 C 18 148, 34 150, 50 152 C 62 150, 74 152, 84 155 L 86 ${HORIZON} Z`}
          fill="#13283C"
          opacity={0.9}
        />
        <Path
          d={`M300 ${HORIZON} C 320 154, 344 152, 362 153 C 378 151, 392 152, 400 151 L 400 ${HORIZON} Z`}
          fill="#13283C"
          opacity={0.7}
        />

        {/* Gulls */}
        <Path d="M150 92 q 5 -5 10 0 q 5 -5 10 0" stroke="#0E1E2F" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <Path d="M176 104 q 3.5 -3.5 7 0 q 3.5 -3.5 7 0" stroke="#0E1E2F" strokeWidth={1.3} fill="none" strokeLinecap="round" />

        {/* Water */}
        <Rect x={0} y={HORIZON} width={W} height={H - HORIZON} fill="url(#pcWater)" />
        <Line x1={0} y1={HORIZON + 0.5} x2={W} y2={HORIZON + 0.5} stroke="#F6C66A" strokeOpacity={0.5} strokeWidth={0.8} />
        {RIPPLES.map((ripple, i) => (
          <Line
            key={`r${i}`}
            x1={ripple.x}
            y1={ripple.y}
            x2={ripple.x + ripple.width}
            y2={ripple.y}
            stroke="#C9E4F2"
            strokeOpacity={0.1}
            strokeWidth={0.8}
            strokeLinecap="round"
          />
        ))}
        {GLITTER.map((g, i) => (
          <Rect key={`g${i}`} x={g.x} y={g.y} width={g.width} height={1.4} rx={0.7} fill="#F8CF7C" opacity={g.opacity} />
        ))}

        {/* Lighthouse reflection */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Rect
            key={`lr${i}`}
            x={214 + ((i * 5) % 7) - 2}
            y={193 + i * 5}
            width={14 - i * 1.2}
            height={1.8}
            rx={0.9}
            fill="#C8352C"
            opacity={0.42 - i * 0.05}
          />
        ))}
        <Rect x={220} y={194} width={5} height={1.6} rx={0.8} fill="#FFD27A" opacity={0.5} />

        {/* Breakwater pier with its catwalk */}
        <Polygon points={`198,176 400,168 400,190 198,188`} fill="#08131F" />
        <Line x1={198} y1={176} x2={400} y2={168} stroke="#2B4A63" strokeWidth={1.2} />
        <Rect x={198} y={186} width={202} height={6} fill="#0A1B2E" opacity={0.6} />
        <Line x1={244} y1={150} x2={400} y2={142} stroke="#08131F" strokeWidth={2} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 252 + i * 18;
          const top = 150 - (x - 244) * (8 / 156);
          const base = 176 - (x - 198) * (8 / 202);
          return <Line key={`p${i}`} x1={x} y1={top} x2={x} y2={base} stroke="#08131F" strokeWidth={1.6} />;
        })}

        {/* Angler casting from the pier */}
        <G>
          <Circle cx={336} cy={150.5} r={3.2} fill="#08131F" />
          <Path d="M332.5 154 L 339.5 154 L 340.5 165 L 338 165 L 337.5 171 L 334.5 171 L 334 165 L 331.5 165 Z" fill="#08131F" />
          <Path d="M339 157 L 345 151" stroke="#08131F" strokeWidth={1.8} strokeLinecap="round" />
          <Line x1={344} y1={152} x2={371} y2={119} stroke="#08131F" strokeWidth={1.3} strokeLinecap="round" />
          <Path d="M371 119 C 386 132, 384 170, 372 206" stroke="#F4EBD6" strokeOpacity={0.55} strokeWidth={0.6} fill="none" />
          <Circle cx={372} cy={206} r={1.2} fill="#E8A02E" />
        </G>

        {/* Lighthouse */}
        <G>
          <Rect x={205} y={168} width={36} height={9} rx={1.5} fill="#08131F" />
          <Polygon points="210,170 236,170 232,104 214,104" fill="url(#pcTower)" />
          <Line x1={211.4} y1={150} x2={234.6} y2={150} stroke="#F4EBD6" strokeOpacity={0.35} strokeWidth={1} />
          <Rect x={219.5} y={158} width={7} height={12} rx={3.5} fill="#08131F" />
          <Rect x={221.3} y={124} width={3.4} height={6} rx={1.7} fill="#08131F" opacity={0.8} />
          <Rect x={221.3} y={137} width={3.4} height={6} rx={1.7} fill="#08131F" opacity={0.8} />
          <Rect x={209} y={100} width={28} height={5} rx={1} fill="#08131F" />
          {[211, 216, 221, 226, 231, 236].map((x) => (
            <Line key={`rail${x}`} x1={x} y1={96} x2={x} y2={100} stroke="#08131F" strokeWidth={0.9} />
          ))}
          <Line x1={209} y1={96} x2={237} y2={96} stroke="#08131F" strokeWidth={1} />
          <Rect x={215} y={85} width={16} height={12} rx={1} fill="#0E1C2B" />
          <Rect x={217.5} y={87} width={11} height={8} rx={1} fill="#FFD27A" />
          <Polygon points="212.5,86 233.5,86 223,74" fill="#08131F" />
          <Circle cx={223} cy={72.5} r={1.8} fill="#08131F" />
        </G>
      </Svg>

      {/* Lantern beam (animated layer) */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: beam }]}>
        <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <LinearGradient id="pcBeam" x1="1" y1="0" x2="0" y2="0">
              <Stop offset={0} stopColor="#FFE7AE" stopOpacity={0.55} />
              <Stop offset={0.6} stopColor="#F6C66A" stopOpacity={0.12} />
              <Stop offset={1} stopColor="#F6C66A" stopOpacity={0} />
            </LinearGradient>
            <RadialGradient id="pcLamp" cx={223} cy={91} r={22} gradientUnits="userSpaceOnUse">
              <Stop offset={0} stopColor="#FFE7AE" stopOpacity={0.9} />
              <Stop offset={1} stopColor="#FFE7AE" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Polygon points="221,89 40,58 40,120 221,94" fill="url(#pcBeam)" />
          <Circle cx={223} cy={91} r={22} fill="url(#pcLamp)" />
        </Svg>
      </Animated.View>
    </View>
  );
}
