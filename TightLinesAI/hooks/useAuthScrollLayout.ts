import { useMemo } from 'react';
import {
  type ViewStyle,
  PixelRatio,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  type AuthLayoutTier,
  getAuthLayoutTier,
} from '../lib/responsiveAuth';

export type AuthScrollLayoutMode = 'spread' | 'form';

/**
 * Responsive scroll content sizing for auth / onboarding screens.
 *
 * Tall iPhones get content that fills the viewport. Compact phones (SE,
 * large Dynamic Type) always scroll and never use space-between spread,
 * which was crushing hero copy off-screen.
 */
export function useAuthScrollLayout(
  mode: AuthScrollLayoutMode = 'form',
  reservedVerticalSpace = 0,
) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const fontScale = PixelRatio.getFontScale();

  return useMemo(() => {
    const fullUsableHeight = Math.max(
      0,
      windowHeight - insets.top - insets.bottom,
    );

    // Tier is based on the device only — not reduced by fixed headers
    // (e.g. onboarding nav). Otherwise iPhone 15/16 falsely land in
    // "compact" when a 72pt header is reserved.
    const layoutTier: AuthLayoutTier = getAuthLayoutTier(
      windowWidth,
      fullUsableHeight,
      fontScale,
    );

    // Only Plus / Pro Max use space-between fill. Standard-size iPhones
    // scroll naturally — avoids crushing copy when content is close to
    // viewport height (the reported "can't see text" failure mode).
    const effectiveMode: AuthScrollLayoutMode =
      mode === 'spread' && layoutTier === 'tall' ? 'spread' : 'form';

    const minHeight = Math.max(0, fullUsableHeight - reservedVerticalSpace);
    const isCompact = layoutTier === 'compact';

    const contentContainerStyle: ViewStyle = {
      minHeight,
      flexGrow: 1,
      paddingBottom: isCompact ? 24 : 12,
      ...(effectiveMode === 'spread'
        ? { justifyContent: 'space-between' as const }
        : {}),
    };

    const keyboardVerticalOffset =
      Platform.OS === 'ios' ? insets.top + 4 : 0;

    return {
      minHeight,
      usableHeight: fullUsableHeight,
      layoutTier,
      isCompact,
      effectiveMode,
      keyboardVerticalOffset,
      contentContainerStyle,
    };
  }, [
    windowWidth,
    windowHeight,
    insets.top,
    insets.bottom,
    mode,
    reservedVerticalSpace,
    fontScale,
  ]);
}
