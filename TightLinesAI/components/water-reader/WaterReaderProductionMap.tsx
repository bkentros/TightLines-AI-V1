/**
 * WaterReaderProductionMap
 *
 * Pure renderer for the engine SVG, paperified for the FinFindr design
 * system. The legend is rendered separately by `WaterReaderLegend` (the
 * engine no longer ships its own embedded "Map Key" panel; cached rows from
 * the previous engine version are stripped client-side by `paperifySvg`).
 *
 * The component is intentionally trivial visually — it derives the map's
 * aspect ratio from `result.summary.{width,height}` (which the engine
 * guarantees are post-padding viewBox numbers) so the SVG never overflows
 * the host card and the parent can frame the skeleton at the same aspect
 * ahead of time.
 *
 * Two non-trivial behaviors live here:
 *
 *   1. **Split paperify / emphasize memoization.** Paperify runs the heavy
 *      string-replace pipeline that recolors and decorates the SVG; that
 *      result is cached per `result.svg` and never re-runs when the user
 *      taps a legend row. Selection-emphasis is a separate, cheap memo on
 *      top of the paperified base. Before this split, every legend tap
 *      re-paperified the entire string, which both wasted CPU and forced
 *      `SvgXml` to re-parse the SVG (a noticeable scroll-jank source).
 *
 *   2. **InteractionManager-gated initial mount.** The first `SvgXml` parse
 *      of a fresh lake is synchronous on the JS thread and can take
 *      100–200 ms on a complex polygon. We defer the mount until React
 *      Native finishes any in-flight interactions (scrolls, presses,
 *      animations) so the parse never lands inside an active gesture and
 *      drops frames. The pre-mount window renders a transparent placeholder
 *      that already occupies the final size, so there is no layout jump.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  InteractionManager,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
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
  // Heavy paperify pipeline runs once per lake (per `result.svg` change).
  // This is the expensive memo: 10+ regex sweeps + decoration injection.
  const paperifiedBase = useMemo(
    () => paperifyWaterReaderSvg(result.svg).svg,
    [result.svg],
  );

  // Cheap emphasis memo runs on every selection change — string replace
  // only, no re-paperify. Whether the SvgXml below re-parses is determined
  // by whether the resulting string actually changes (it only changes when
  // selectedNumber changes, since paperifiedBase is cached).
  const finalSvg = useMemo(
    () => emphasizeDisplayNumber(paperifiedBase, selectedNumber),
    [paperifiedBase, selectedNumber],
  );

  // Defer the initial SVG mount until after any active interaction settles,
  // so the parse cost lands in idle time rather than mid-scroll. We keep
  // the same handle pattern across `result.svg` changes so a fast
  // lake → lake switch also waits for interactions to quiet.
  const [mountReady, setMountReady] = useState(false);
  useEffect(() => {
    setMountReady(false);
    const handle = InteractionManager.runAfterInteractions(() => {
      setMountReady(true);
    });
    return () => handle.cancel();
  }, [result.svg]);

  // Settle animation — once the SVG mounts, fade + lift in over ~520ms so
  // the print "settles" onto the plate rather than popping. Native driver,
  // single tween value, cheap.
  const settle = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!mountReady) {
      settle.setValue(0);
      return;
    }
    Animated.timing(settle, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [mountReady, finalSvg, settle]);

  const animatedStyle = useMemo(
    () => ({
      opacity: settle,
      transform: [
        {
          translateY: settle.interpolate({
            inputRange: [0, 1],
            outputRange: [6, 0],
          }),
        },
        {
          scale: settle.interpolate({
            inputRange: [0, 1],
            outputRange: [0.985, 1],
          }),
        },
      ],
    }),
    [settle],
  );

  return (
    <View style={[styles.mapWrap, style]}>
      {mountReady ? (
        <Animated.View style={[styles.fillParent, animatedStyle]}>
          <SvgXml
            xml={finalSvg}
            width={width}
            height={height}
            preserveAspectRatio="xMidYMid meet"
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

/**
 * Inject a gold double-glow filter into the SVG defs and apply it to the
 * zone whose `data-display-number` matches the selection. Idempotent — the
 * filter is only inserted once, and the per-tag `filter=` attribute is
 * skipped if already present (regex `(?!filter=)`).
 */
function emphasizeDisplayNumber(
  svg: string,
  selectedNumber?: number | string | null,
): string {
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
  fillParent: {
    width: '100%',
    height: '100%',
  },
});
