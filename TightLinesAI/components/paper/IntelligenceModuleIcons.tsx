/**
 * Premium intelligence-module emblems for the home dashboard.
 *
 * Literal, readable marks at phone scale — bathymetric lake + hotspot pin,
 * a metallic crankbait lure, and a rising sun over water. Each emblem tile adds
 * a slow diagonal light sweep ("glint") and a subtle twinkle for a premium feel
 * (both respect the system Reduce Motion setting).
 * Compare on-device: /module-icons-preview
 */

import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export type IntelligenceModuleId =
  | 'water-read'
  | 'tackle-box'
  | 'todays-bite'
  | 'river-run';

export type IntelligenceModuleIconVariant = 'premium' | 'legacy';

/** Active variant for production surfaces. */
export const INTELLIGENCE_MODULE_ICON_VARIANT: IntelligenceModuleIconVariant = 'premium';

interface IntelligenceModuleIconProps {
  module: IntelligenceModuleId;
  variant?: IntelligenceModuleIconVariant;
  size?: number;
  color?: string;
}

interface IntelligenceModuleEmblemProps {
  module: IntelligenceModuleId;
  iconBg: [string, string];
  iconBorder: string;
  iconColor: string;
  size?: number;
  /** Disable the glint/twinkle animation (e.g. static previews). */
  animate?: boolean;
  style?: ViewStyle;
}

const VB = 32;

/** Stagger the glint per module so the three tiles never flash in unison. */
const SWEEP_STAGGER_MS: Record<IntelligenceModuleId, number> = {
  'water-read': 0,
  'tackle-box': 1300,
  'todays-bite': 2600,
  'river-run': 3900,
};

let _uidCounter = 0;

function useInstanceId(): string {
  const ref = useRef<string>('');
  if (!ref.current) {
    _uidCounter += 1;
    ref.current = `ime${_uidCounter}`;
  }
  return ref.current;
}

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReduce(value);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      setReduce(value);
    });
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);
  return reduce;
}

export function IntelligenceModuleEmblem({
  module,
  iconBg,
  iconBorder,
  iconColor,
  size = 50,
  animate = true,
  style,
}: IntelligenceModuleEmblemProps) {
  const uid = useInstanceId();
  const markSize = Math.round(size * 0.76);

  const reduceMotion = useReduceMotion();
  const active = animate && !reduceMotion;

  const sweep = useRef(new Animated.Value(0)).current;
  const twinkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      sweep.setValue(0);
      twinkle.setValue(0);
      return;
    }
    const stagger = SWEEP_STAGGER_MS[module] ?? 0;

    const sweepLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, {
          toValue: 1,
          duration: 1150,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sweep, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(3200),
      ]),
    );
    const twinkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 1,
          duration: 640,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: 0,
          duration: 880,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(2600),
      ]),
    );

    const startTimer = setTimeout(() => {
      sweepLoop.start();
      twinkleLoop.start();
    }, stagger);

    return () => {
      clearTimeout(startTimer);
      sweepLoop.stop();
      twinkleLoop.stop();
    };
  }, [active, module, sweep, twinkle]);

  const streakW = Math.round(size * 0.42);
  const streakH = Math.round(size * 2);
  const sweepTranslate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 0.95, size * 1.2],
  });
  const twinkleOpacity = twinkle.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.95],
  });
  const twinkleScale = twinkle.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 1],
  });
  const sparkleSize = Math.round(size * 0.2);

  return (
    <View
      style={[
        styles.emblemTile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.2,
          backgroundColor: iconBg[0],
          borderColor: `${iconBorder}55`,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.emblemInner,
          {
            borderRadius: size * 0.16,
            backgroundColor: iconBg[1],
          },
        ]}
      />
      <View style={styles.emblemArt} pointerEvents="none">
        <Svg width={markSize} height={markSize} viewBox={`0 0 ${VB} ${VB}`}>
          <EmblemArt module={module} color={iconColor} uid={uid} />
        </Svg>
      </View>

      <Animated.View
        style={[
          styles.emblemSparkle,
          {
            top: size * 0.12,
            right: size * 0.12,
            opacity: twinkleOpacity,
            transform: [{ scale: twinkleScale }],
          },
        ]}
        pointerEvents="none"
      >
        <Svg width={sparkleSize} height={sparkleSize} viewBox="0 0 12 12">
          <Path
            d="M6 0 C6.5 3.4 8.6 5.5 12 6 C8.6 6.5 6.5 8.6 6 12 C5.5 8.6 3.4 6.5 0 6 C3.4 5.5 5.5 3.4 6 0Z"
            fill="#FFFFFF"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.emblemShine,
          {
            width: streakW,
            height: streakH,
            left: size * 0.5 - streakW / 2,
            top: -size * 0.5,
            transform: [{ rotate: '18deg' }, { translateX: sweepTranslate }],
          },
        ]}
        pointerEvents="none"
      >
        <Svg width={streakW} height={streakH}>
          <Defs>
            <LinearGradient id={`${uid}shine`} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
              <Stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.6} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect width={streakW} height={streakH} fill={`url(#${uid}shine)`} />
        </Svg>
      </Animated.View>

      <View
        style={[
          styles.emblemSheen,
          { borderRadius: size * 0.2, borderColor: `${iconBorder}22` },
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

export function IntelligenceModuleIcon({
  module,
  variant = INTELLIGENCE_MODULE_ICON_VARIANT,
  size = 30,
  color = '#0A1B2E',
}: IntelligenceModuleIconProps) {
  const uid = useInstanceId();

  if (variant === 'legacy') {
    return (
      <Svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}>
        <LegacyEmblemArt module={module} color={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}>
      <EmblemArt module={module} color={color} uid={uid} />
    </Svg>
  );
}

function EmblemArt({
  module,
  color,
  uid,
}: {
  module: IntelligenceModuleId;
  color: string;
  uid: string;
}) {
  if (module === 'water-read') return <WaterReadEmblem color={color} uid={uid} />;
  if (module === 'tackle-box') return <TackleBoxEmblem color={color} uid={uid} />;
  if (module === 'todays-bite') return <TodaysBiteEmblem color={color} uid={uid} />;
  return <RiverRunEmblem color={color} uid={uid} />;
}

function LegacyEmblemArt({
  module,
  color,
}: {
  module: IntelligenceModuleId;
  color: string;
}) {
  if (module === 'water-read') {
    return (
      <>
        <Path
          d="M5 22 8 12 14 10 22 13 26 20 20 26 11 25Z"
          fill={color}
          fillOpacity={0.12}
          stroke={color}
          strokeWidth={1.35}
          strokeLinejoin="round"
        />
        <Circle cx={20} cy={14} r={1.4} fill={color} />
      </>
    );
  }
  if (module === 'tackle-box') {
    return (
      <>
        <Path d="M8 26 Q8 18 12 14" stroke={color} strokeWidth={1.25} fill="none" />
        <Path d="M12 14 24 10" stroke={color} strokeWidth={2.1} strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <Line x1={4} y1={22} x2={28} y2={22} stroke={color} strokeWidth={1.05} />
      <Circle cx={24} cy={10} r={3.1} fill={color} fillOpacity={0.16} stroke={color} />
    </>
  );
}

/** Top-down bathymetric lake with depth contours + a hotspot map pin. */
function WaterReadEmblem({ color, uid }: { color: string; uid: string }) {
  return (
    <>
      <Defs>
        <LinearGradient id={`${uid}wrWater`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.72} />
        </LinearGradient>
      </Defs>
      {/* lake body */}
      <Path
        d="M6.5 15 C6.5 10.3 10.6 7.3 15.8 7.8 C21 8.3 25.4 10.8 25.8 15.6 C26.2 20.4 21.8 24.8 15.8 24.8 C10 24.8 6.5 19.7 6.5 15Z"
        fill={`url(#${uid}wrWater)`}
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* depth contours */}
      <Path
        d="M10.4 15.4 C10.4 12.3 13 10.6 16 10.8 C19.6 11 22 13 22 16.1 C22 19.2 18.9 22 15.7 22 C12.1 22 10.4 18.5 10.4 15.4Z"
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.42}
        strokeLinejoin="round"
      />
      <Path
        d="M13.4 16 C13.4 14.2 14.7 13.3 16 13.4 C17.9 13.5 19.2 14.8 19.2 16.5"
        fill="none"
        stroke={color}
        strokeWidth={0.9}
        strokeOpacity={0.34}
        strokeLinecap="round"
      />
      {/* hotspot map pin */}
      <Path
        d="M20.6 6 C22.8 6 24.5 7.7 24.5 9.9 C24.5 12.6 20.6 16.1 20.6 16.1 C20.6 16.1 16.7 12.6 16.7 9.9 C16.7 7.7 18.4 6 20.6 6Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <Circle cx={20.6} cy={9.9} r={1.5} fill="#FFFFFF" />
    </>
  );
}

/** Metallic crankbait lure — split ring, lip, eye, treble hook. Reads "tackle". */
function TackleBoxEmblem({ color, uid }: { color: string; uid: string }) {
  return (
    <>
      <Defs>
        <LinearGradient id={`${uid}tbBody`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.96} />
          <Stop offset="52%" stopColor={color} stopOpacity={0.64} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.95} />
        </LinearGradient>
      </Defs>
      {/* split ring / line tie */}
      <Circle cx={8.8} cy={9.2} r={1.7} fill="none" stroke={color} strokeWidth={1.2} />
      {/* diving lip */}
      <Path d="M10 11 L7.4 13.8" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      {/* body */}
      <Path
        d="M10.4 10.9 C14.1 8.8 19.2 9.4 22.7 12.9 C24.7 14.9 25.2 17.1 24.1 18.7 C23 20.3 20.4 20.7 17.8 19.7 C14.2 18.2 10.8 15.6 9.8 13 C9.4 12 9.7 11.3 10.4 10.9Z"
        fill={`url(#${uid}tbBody)`}
        stroke={color}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      {/* belly highlight */}
      <Path
        d="M12.6 12 C15.1 11 18.2 11.5 20.7 13.4"
        stroke="#FFFFFF"
        strokeWidth={1}
        strokeOpacity={0.5}
        strokeLinecap="round"
      />
      {/* eye */}
      <Circle cx={13.4} cy={12.7} r={1.5} fill="#FFFFFF" />
      <Circle cx={13.6} cy={12.7} r={0.62} fill={color} />
      {/* treble hook */}
      <Path
        d="M24.1 18.7 C25.7 20.7 25.2 23.2 23.1 24.2"
        stroke={color}
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M23.1 24.2 L21.8 22.7 M23.1 24.2 L24.8 23.5"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </>
  );
}

/** Rising sun + rays over layered water — daily conditions at a glance. */
function TodaysBiteEmblem({ color, uid }: { color: string; uid: string }) {
  const rays = [205, 240, 270, 300, 335, 155, 25];

  return (
    <>
      <Defs>
        <RadialGradient id={`${uid}tbiSun`} cx="50%" cy="42%" r="58%">
          <Stop offset="0%" stopColor={color} stopOpacity={1} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.68} />
        </RadialGradient>
      </Defs>
      {/* rays */}
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 16 + Math.cos(rad) * 6.2;
        const y1 = 13 + Math.sin(rad) * 6.2;
        const x2 = 16 + Math.cos(rad) * 8.1;
        const y2 = 13 + Math.sin(rad) * 8.1;
        return (
          <Line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* sun */}
      <Circle cx={16} cy={13} r={5} fill={`url(#${uid}tbiSun)`} />
      <Path
        d="M11.8 11.2 A5 5 0 0 1 20.2 11.2"
        stroke="#FFFFFF"
        strokeWidth={1}
        strokeOpacity={0.5}
        fill="none"
        strokeLinecap="round"
      />
      {/* water */}
      <Path
        d="M4 22 C8 20.3 11.5 20.3 16 22 C20.5 23.7 24 23.7 28 22"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M5 26 C9 24.5 12.2 24.5 16 26 C19.8 27.5 23 27.5 27 26"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.55}
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

/** Upstream-running salmon over river current — migratory run gauge. */
function RiverRunEmblem({ color, uid }: { color: string; uid: string }) {
  return (
    <>
      <Defs>
        <LinearGradient id={`${uid}rrBody`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.96} />
          <Stop offset="55%" stopColor={color} stopOpacity={0.6} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.95} />
        </LinearGradient>
      </Defs>
      {/* dorsal fin */}
      <Path
        d="M13.4 11 L15.6 6.6 L19.2 10.6Z"
        fill={color}
        stroke={color}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
      {/* adipose fin */}
      <Path d="M20.4 10.5 L21.9 8.7 L22.7 10.8Z" fill={color} />
      {/* anal fin */}
      <Path
        d="M13.8 20.8 L15.3 23.9 L18.2 20.6Z"
        fill={color}
        stroke={color}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
      {/* body */}
      <Path
        d="M5.8 16 C8.1 11.9 12.4 10.3 17.1 10.8 C20.7 11.2 23.3 12.6 24.8 14.6 C25.5 15.5 25.5 16.5 24.8 17.4 C23.3 19.4 20.7 20.8 17.1 21.2 C12.4 21.7 8.1 20.1 5.8 16Z"
        fill={`url(#${uid}rrBody)`}
        stroke={color}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      {/* forked tail */}
      <Path
        d="M24.4 16 L29.2 11.6 L27.5 16 L29.2 20.4Z"
        fill={color}
        stroke={color}
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
      {/* kype / hooked jaw */}
      <Path
        d="M5.8 16 C4.3 15.3 4.3 17.1 6.1 16.9"
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      {/* lateral line highlight */}
      <Path
        d="M8.8 15.1 C12.9 13.6 18 13.7 22.6 15.3"
        stroke="#FFFFFF"
        strokeWidth={0.9}
        strokeOpacity={0.42}
        strokeLinecap="round"
        fill="none"
      />
      {/* eye */}
      <Circle cx={9} cy={15} r={1.45} fill="#FFFFFF" />
      <Circle cx={9.2} cy={15} r={0.6} fill={color} />
      {/* river current */}
      <Path
        d="M5 24.6 C9 23.5 12 23.5 16 24.6"
        stroke={color}
        strokeWidth={1.4}
        strokeOpacity={0.5}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M13.5 26.8 C17.5 25.8 20.5 25.8 24.5 26.8"
        stroke={color}
        strokeWidth={1.2}
        strokeOpacity={0.34}
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

const styles = StyleSheet.create({
  emblemTile: {
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemInner: {
    ...StyleSheet.absoluteFillObject,
    margin: 2,
  },
  emblemArt: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emblemSparkle: {
    position: 'absolute',
    zIndex: 4,
  },
  emblemShine: {
    position: 'absolute',
    zIndex: 3,
  },
  emblemSheen: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    zIndex: 5,
  },
});
