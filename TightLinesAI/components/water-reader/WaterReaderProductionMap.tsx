/**
 * WaterReaderProductionMap
 *
 * Pure renderer for the engine SVG, paperified for the FinFindr design
 * system. The legend is rendered separately by `WaterReaderLegend` (the
 * engine no longer ships its own embedded "Map Key" panel; cached rows from
 * the previous engine version are stripped client-side by `paperifySvg`).
 *
 * The component is intentionally trivial — it derives the map's aspect ratio
 * from `result.summary.{width,height}` (which the engine guarantees are
 * post-padding viewBox numbers) so the SVG never overflows the host card and
 * the parent can frame the skeleton at the same aspect ahead of time.
 */

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { WaterReaderProductionSvgResult } from '../../lib/waterReaderContracts';
import { paper, paperRadius } from '../../lib/theme';
import { paperifyWaterReaderSvg } from '../../lib/water-reader-paperify-svg';

export interface WaterReaderProductionMapProps {
  result: WaterReaderProductionSvgResult;
}

export function WaterReaderProductionMap({
  result,
}: WaterReaderProductionMapProps) {
  const width = Math.max(1, result.summary.width);
  const height = Math.max(1, result.summary.height);
  const aspectRatio = width / height;

  const paperifiedSvg = useMemo(() => {
    return paperifyWaterReaderSvg(result.svg).svg;
  }, [result.svg]);

  return (
    <View style={[styles.mapWrap, { aspectRatio }]}>
      <SvgXml
        xml={paperifiedSvg}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: paperRadius.card - 2,
    backgroundColor: paper.paper,
  },
});
