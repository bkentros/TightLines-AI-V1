import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { WaterReaderProductionSvgLegendEntry, WaterReaderProductionSvgResult } from '../../lib/waterReaderContracts';
import { colors } from '../../lib/theme';

export function WaterReaderProductionMap({
  result,
}: {
  result: WaterReaderProductionSvgResult;
}) {
  const width = Math.max(1, result.summary.width);
  const height = Math.max(1, result.summary.height);
  const aspectRatio = width / height;
  const legendEntries = result.legendEntries ?? [];

  return (
    <View style={styles.container}>
      <View style={[styles.mapWrap, { aspectRatio }]}>
        <SvgXml
          xml={result.svg}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      </View>
      {legendEntries.length > 0 && (
        <View style={styles.legend}>
          {legendEntries.map((entry) => (
            <LegendRow key={`${entry.number ?? entry.zoneId}-${entry.zoneIds.join('|')}`} entry={entry} />
          ))}
        </View>
      )}
    </View>
  );
}

function LegendRow({ entry }: { entry: WaterReaderProductionSvgLegendEntry }) {
  return (
    <View style={styles.legendRow}>
      <View style={styles.legendMarker}>
        <View style={[styles.swatch, { backgroundColor: entry.colorHex }]} />
        <Text style={styles.legendNumber}>{entry.number ?? '•'}</Text>
      </View>
      <View style={styles.legendCopy}>
        <Text style={styles.legendTitle}>{entry.title}</Text>
        <Text style={styles.legendBody}>{entry.body}</Text>
        {entry.transitionWarning ? (
          <Text style={styles.legendWarning}>{entry.transitionWarning}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    width: '100%',
    gap: 10,
  },
  mapWrap: {
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
  },
  legend: {
    alignSelf: 'stretch',
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  legendMarker: {
    width: 34,
    alignItems: 'center',
    gap: 4,
    paddingTop: 1,
  },
  swatch: {
    width: 18,
    height: 8,
    borderRadius: 2,
  },
  legendNumber: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: colors.text,
  },
  legendCopy: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  legendTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    color: colors.text,
  },
  legendBody: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  legendWarning: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.gold,
    fontWeight: '700',
  },
});
