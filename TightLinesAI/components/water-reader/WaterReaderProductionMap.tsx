import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { WaterReaderProductionSvgResult } from '../../lib/water-reader-engine';
import { colors } from '../../lib/theme';

export function WaterReaderProductionMap({
  result,
}: {
  result: WaterReaderProductionSvgResult;
}) {
  const width = Math.max(1, result.summary.width);
  const height = Math.max(1, result.summary.height);
  const aspectRatio = width / height;

  return (
    <View style={[styles.wrap, { aspectRatio }]}>
      <SvgXml
        xml={result.svg}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
  },
});
