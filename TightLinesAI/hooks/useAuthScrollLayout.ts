import { useMemo } from 'react';
import { type ViewStyle, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type AuthScrollLayoutMode = 'spread' | 'form';

/**
 * Responsive scroll content sizing for auth / onboarding screens.
 *
 * Tall iPhones (15/16/17 Pro Max, Plus/Max sizes) get content that fills the
 * viewport instead of a dead cream gap below the footer. Shorter phones still
 * scroll when content overflows.
 */
export function useAuthScrollLayout(
  mode: AuthScrollLayoutMode = 'form',
  reservedVerticalSpace = 0,
) {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const minHeight = Math.max(
      0,
      windowHeight - insets.top - insets.bottom - reservedVerticalSpace,
    );

    const contentContainerStyle: ViewStyle = {
      minHeight,
      flexGrow: 1,
      ...(mode === 'spread' ? { justifyContent: 'space-between' as const } : {}),
    };

    return { minHeight, contentContainerStyle };
  }, [windowHeight, insets.top, insets.bottom, mode, reservedVerticalSpace]);
}
