import { useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { getRecommenderArtworkBounds } from '../../lib/recommenderArtworkBounds';
import { fitArtwork } from '../../lib/fitArtwork';

/** Fit the entire illustrated specimen, including hooks, inside its card.
 * Asset bounds describe whitespace only; the original pixels stay untouched.
 */
export function RecommenderArtwork({ source, style, accessibilityLabel, selectionColor }: {
  source: ImageProps['source'];
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  /** Let the white paper in selector artwork pick up the selected card color. */
  selectionColor?: string;
}) {
  const [box, setBox] = useState({ width: 0, height: 0 });
  const bounds = getRecommenderArtworkBounds(source);
  const frame = bounds && box.width > 0 && box.height > 0
    ? fitArtwork(bounds, box.width, box.height)
    : { left: 0, top: 0, width: box.width, height: box.height };
  return (
    <View
      style={[style, {
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        isolation: 'isolate',
      }]}
      onLayout={({ nativeEvent: { layout } }) => setBox(previous =>
        previous.width === layout.width && previous.height === layout.height
          ? previous : { width: layout.width, height: layout.height })}
    >
      <Image
        source={source}
        accessibilityLabel={accessibilityLabel}
        style={{ position: 'absolute', ...frame }}
        contentFit="contain"
        transition={150}
      />
      {selectionColor && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
            backgroundColor: selectionColor,
            mixBlendMode: 'multiply',
          }}
        />
      )}
    </View>
  );
}
