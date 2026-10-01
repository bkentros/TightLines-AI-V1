import { useId } from "react";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import {
  PIER_CAST_WATER_SCALE_MAX_F,
  PIER_CAST_WATER_SCALE_MIN_F,
  PIER_CAST_WATER_SCALE_STOPS,
} from "../../lib/pierCastTemperatureScale";

/**
 * The exact continuous visual key shared by the map and report surfaces.
 * NOAA's raster uses 250 x-Sst bands; SVG interpolation keeps the compact
 * mobile legend equally fluid rather than presenting seven hard color boxes.
 */
export function PierCastTemperatureGradient() {
  const gradientId = `pierCastWater-${useId().replace(/:/g, "")}`;
  const span = PIER_CAST_WATER_SCALE_MAX_F - PIER_CAST_WATER_SCALE_MIN_F;

  return (
    <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          {PIER_CAST_WATER_SCALE_STOPS.map((stop) => (
            <Stop
              key={stop.valueF}
              offset={`${(stop.valueF - PIER_CAST_WATER_SCALE_MIN_F) / span * 100}%`}
              stopColor={stop.tone}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
    </Svg>
  );
}
