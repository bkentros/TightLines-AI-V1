/**
 * Premium intelligence-module emblems for the home dashboard.
 *
 * Literal, readable marks at phone scale — lake map, fish, sun/conditions.
 * Compare on-device: /module-icons-preview
 */

import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';

export type IntelligenceModuleId = 'water-read' | 'tackle-box' | 'todays-bite';

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
  style?: ViewStyle;
}

const VB = 32;

export function IntelligenceModuleEmblem({
  module,
  iconBg,
  iconBorder,
  iconColor,
  size = 50,
  style,
}: IntelligenceModuleEmblemProps) {
  const markSize = Math.round(size * 0.76);

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
          <EmblemArt module={module} color={iconColor} />
        </Svg>
      </View>
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
  if (variant === 'legacy') {
    return (
      <Svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}>
        <LegacyEmblemArt module={module} color={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`}>
      <EmblemArt module={module} color={color} />
    </Svg>
  );
}

function EmblemArt({
  module,
  color,
}: {
  module: IntelligenceModuleId;
  color: string;
}) {
  if (module === 'water-read') return <WaterReadEmblem color={color} />;
  if (module === 'tackle-box') return <TackleBoxEmblem color={color} />;
  return <TodaysBiteEmblem color={color} />;
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

/** Top-down lake on a map card — water ripples + zone pin. */
function WaterReadEmblem({ color }: { color: string }) {
  const water = `${color}55`;

  return (
    <>
      <Rect
        x={5}
        y={6}
        width={22}
        height={20}
        rx={2.5}
        fill="#FFFFFF"
        fillOpacity={0.55}
        stroke={color}
        strokeWidth={1.4}
      />
      <Path
        d="M9 23 C9 18 11 13 15 11 C19 9 23 12 24 17 C25 21 21 24 16 24 C12 24 9 23 9 23Z"
        fill={water}
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M12 18 C14 16 17 16 19 18"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={0.55}
      />
      <Path
        d="M13 20.5 C15 19.5 17 19.5 18.5 20.5"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        opacity={0.4}
      />
      <Circle cx={19.5} cy={14.5} r={3.2} fill={color} />
      <Circle cx={19.5} cy={14.5} r={1.2} fill="#FFFFFF" />
      <Path
        d="M19.5 11.3 V9.2 M19.5 19.8 V17.7 M16.3 14.5 H14.2 M24.8 14.5 H22.7"
        stroke="#FFFFFF"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </>
  );
}

/** Side-profile fish — unmistakable tackle / species mark. */
function TackleBoxEmblem({ color }: { color: string }) {
  return (
    <>
      <Path
        d="M6 16 C6 12 9 9 14 9 C18 9 21 11 23 14 C25 16 26 18 26 18 C26 18 24 17 22 17 C20 17 19 18 17 19 C14 21 10 21 8 19 C6.5 17.5 6 16 6 16Z"
        fill={color}
        stroke={color}
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
      <Path
        d="M6 16 L3 14 L3.5 17 L3 20 L6 18"
        fill={color}
        stroke={color}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
      <Path
        d="M14 9 L15 6.5 L17 9"
        fill={color}
        stroke={color}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
      <Path
        d="M10 19 L9 22 L11.5 20.5"
        fill={color}
        stroke={color}
        strokeWidth={0.5}
        strokeLinejoin="round"
      />
      <Circle cx={19.5} cy={13.5} r={1.35} fill="#FFFFFF" />
      <Circle cx={19.8} cy={13.5} r={0.55} fill={color} />
      <Path
        d="M21.5 17.5 C23 18.5 24.5 19 26 19"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.45}
      />
    </>
  );
}

/** Sun + cloud over horizon — daily conditions at a glance. */
function TodaysBiteEmblem({ color }: { color: string }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <>
      <Line
        x1={4}
        y1={24}
        x2={28}
        y2={24}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.35}
      />
      <Path
        d="M5 24 C8 20 12 18 16 18 C20 18 24 20 27 24"
        fill={`${color}33`}
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 21 + Math.cos(rad) * 6.2;
        const y1 = 11 + Math.sin(rad) * 6.2;
        const x2 = 21 + Math.cos(rad) * 8.4;
        const y2 = 11 + Math.sin(rad) * 8.4;
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
      <Circle cx={21} cy={11} r={5.2} fill={color} />
      <Ellipse
        cx={10}
        cy={14.5}
        rx={3.2}
        ry={2.6}
        fill="#FFFFFF"
        fillOpacity={0.95}
        stroke={color}
        strokeWidth={1.3}
      />
      <Ellipse
        cx={15.5}
        cy={14.8}
        rx={3.5}
        ry={2.5}
        fill="#FFFFFF"
        fillOpacity={0.95}
        stroke={color}
        strokeWidth={1.3}
      />
      <Ellipse
        cx={12.5}
        cy={13.5}
        rx={5.5}
        ry={3.8}
        fill="#FFFFFF"
        fillOpacity={0.95}
        stroke={color}
        strokeWidth={1.5}
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
  emblemSheen: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    zIndex: 3,
  },
});
