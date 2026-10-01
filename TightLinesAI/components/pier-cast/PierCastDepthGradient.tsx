import { useId } from "react";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

const DEPTH_STOPS = [
  { offset: "0%", tone: "#001B62" },
  { offset: "28%", tone: "#07558B" },
  { offset: "52%", tone: "#109AB3" },
  { offset: "76%", tone: "#7AD2CB" },
  { offset: "100%", tone: "#FFFFE5" },
] as const;

/** Mirrors NOAA's verified default bathymetry palette from shore to basin. */
export function PierCastDepthGradient() {
  const gradientId = `pierCastDepth-${useId().replace(/:/g, "")}`;
  return (
    <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {DEPTH_STOPS.map((stop) => (
            <Stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.tone}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
