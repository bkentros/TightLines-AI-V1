import { useId } from "react";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { PIER_CAST_WIND_SCALE_STOPS } from "../../lib/pierCastWind";

export function PierCastWindGradient() {
  const gradientId = `pierCastWind-${useId().replace(/:/g, "")}`;
  const maximum = PIER_CAST_WIND_SCALE_STOPS.at(-1)!.speedMph;
  return (
    <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {PIER_CAST_WIND_SCALE_STOPS.map((stop) => (
            <Stop
              key={stop.speedMph}
              offset={`${stop.speedMph / maximum * 100}%`}
              stopColor={stop.tone}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
