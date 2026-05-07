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
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { WaterReaderProductionSvgResult } from '../../lib/waterReaderContracts';
import { paper, paperRadius } from '../../lib/theme';
import { paperifyWaterReaderSvg } from '../../lib/water-reader-paperify-svg';

export interface WaterReaderProductionMapProps {
  result: WaterReaderProductionSvgResult;
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  selectedNumber?: number | string | null;
}

export function WaterReaderProductionMap({
  result,
  width = '100%',
  height = '100%',
  style,
  selectedNumber = null,
}: WaterReaderProductionMapProps) {
  const paperifiedSvg = useMemo(() => {
    const svg = paperifyWaterReaderSvg(result.svg).svg;
    return emphasizeDisplayNumber(svg, selectedNumber);
  }, [result.svg, selectedNumber]);

  return (
    <View style={[styles.mapWrap, style]}>
      <SvgXml
        xml={paperifiedSvg}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
      />
    </View>
  );
}

function emphasizeDisplayNumber(svg: string, selectedNumber?: number | string | null): string {
  const displayNumber = selectedNumber == null ? '' : String(selectedNumber).trim();
  if (!displayNumber) return svg;
  const filter = `
    <filter id="wr-selected-emphasis" x="-24%" y="-24%" width="148%" height="148%">
      <feDropShadow dx="0" dy="0" stdDeviation="2.2" flood-color="${paper.gold}" flood-opacity="0.75"/>
      <feDropShadow dx="0" dy="0" stdDeviation="4.2" flood-color="${paper.gold}" flood-opacity="0.28"/>
    </filter>`;
  const withFilter = svg.includes('id="wr-selected-emphasis"')
    ? svg
    : svg.replace('</defs>', `${filter}\n  </defs>`);
  const escaped = displayNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(
    `<(path|g)(?=[^>]*data-display-number="${escaped}")((?:(?!filter=)[^>])*)>`,
    'g',
  );
  return withFilter.replace(tagPattern, '<$1$2 filter="url(#wr-selected-emphasis)">');
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
