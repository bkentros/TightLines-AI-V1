import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { paper, paperFonts } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';

const FALLBACK_MS = 20000;

/**
 * Matched by finfindr://auth/confirm?code=... from the https email bridge.
 * Session exchange runs in root `_layout` `Linking` handler; this screen only
 * provides a real route (avoids Expo Router “Unmatched”) and a safe fallback
 * if the exchange never completes. Navigation after sign-in is handled by
 * `useProtectedRoute` in `_layout` (onboarding vs tabs).
 */
export default function AuthConfirmScreen() {
  const router = useRouter();
  const timedOut = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      timedOut.current = true;
      if (!useAuthStore.getState().session) {
        router.replace('/(auth)/welcome');
      }
    }, FALLBACK_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Signing you in…</Text>
      <ActivityIndicator size="large" color={paper.dashboardBlue} style={styles.spin} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardCream,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardInk,
    marginBottom: 20,
    textAlign: 'center',
  },
  spin: { marginTop: 8 },
});
