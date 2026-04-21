/**
 * Swimming fish that drifts across the bottom of the Live Conditions card.
 *
 * Earlier attempts hand-assembled the fish from plain Views + rounded
 * rectangles. That approach drifted quickly on-device: the silhouette was
 * ambiguous, didn't read clearly as a fish, and looked like a random shape.
 *
 * We now use Ionicons' built-in `fish` glyph instead. It renders identically
 * on iOS/Android with no native module dependency, always reads as a proper
 * fish, and keeps the component trivially small.
 *
 * The icon is rendered in muted grey at low opacity so it sits like a
 * marginalia sketch — present, not distracting — and animated left-to-right
 * via `Animated.Value` with `useNativeDriver: true` for smooth motion.
 */

import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SwimmingFishProps {
  bottom?: number;
  /** One-way travel time in ms. Default 18s (matches the mock). */
  duration?: number;
  /** Total travel width. Defaults to the window width. */
  trackWidth?: number;
  /** Icon size in px. Default 30. */
  size?: number;
  /** Fill color for the fish. Default is a muted pencil-grey. */
  color?: string;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

export function SwimmingFish({
  bottom = 18,
  duration = 18_000,
  trackWidth,
  size = 30,
  color = '#7A7A75',
  opacity = 0.45,
  style,
}: SwimmingFishProps) {
  const { width: windowW } = useWindowDimensions();
  const track = trackWidth ?? windowW;
  const translate = useRef(new Animated.Value(-size - 20)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: track + 40,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [translate, track, duration]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: 0,
          bottom,
          width: size + 4,
          height: size + 4,
          opacity,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ translateX: translate }],
        },
        style,
      ]}
    >
      <Ionicons name="fish" size={size} color={color} />
    </Animated.View>
  );
}
