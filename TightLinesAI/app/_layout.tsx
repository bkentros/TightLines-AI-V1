import { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Fraunces_500Medium,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useBiometricLock } from '../hooks/useBiometricLock';
import { paper, paperFonts } from '../lib/theme';

/**
 * Determines where the user should be based on auth + onboarding state.
 * Called after every auth change and on initial hydration.
 */
function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isOnboarded, isLoading, isProfileLoading } = useAuthStore();

  useEffect(() => {
    // Wait for both initial hydration AND profile fetch to complete
    if (isLoading || isProfileLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const inResetPassword = segments.includes('reset-password');

    if (!session) {
      if (!inAuth) router.replace('/(auth)/welcome');
      return;
    }

    // Don't redirect away from reset-password screen — user arrived via recovery link
    if (inResetPassword) return;

    if (!isOnboarded) {
      if (!inOnboarding) router.replace('/(onboarding)/step-1-welcome');
      return;
    }

    if (inAuth || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [session, isOnboarded, isLoading, isProfileLoading, segments, router]);
}

export default function RootLayout() {
  const router = useRouter();
  const { hydrate, setSession, setProfile, fetchProfile } = useAuthStore();

  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Fraunces_500Medium,
    Fraunces_500Medium_Italic,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  // Hydrate session from AsyncStorage on mount
  useEffect(() => {
    hydrate().then(() => {
      // After hydration, sync the functions client auth header with whatever
      // session was restored from AsyncStorage. onAuthStateChange fires
      // INITIAL_SESSION which also does this, but the explicit sync here
      // ensures the header is set before any invoke() call can race.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.access_token) {
          supabase.functions.setAuth(session.access_token);
        } else {
          supabase.functions.setAuth('');
        }
      });
    });
  }, [hydrate]);

  // Handle deep links — email verification & password reset tokens
  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (!url) return;

      const [base, hash] = url.split('#');
      const parsed = Linking.parse(base);
      const queryParams = parsed.queryParams ?? {};
      const fragmentParams: Record<string, string> = {};
      if (hash) {
        hash.split('&').forEach((pair) => {
          const [k, v] = pair.split('=');
          if (k && v) fragmentParams[decodeURIComponent(k)] = decodeURIComponent(v);
        });
      }
      const params = { ...queryParams, ...fragmentParams };

      const accessToken = params['access_token'] as string | undefined;
      const refreshToken = params['refresh_token'] as string | undefined;
      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error && data.session) {
          setSession(data.session);
          await fetchProfile(data.session.user.id);
        }
        return;
      }

      const tokenHash = (params['token_hash'] ?? params['token']) as string | undefined;
      const type = params['type'] as string | undefined;
      if (tokenHash && type) {
        const otpType = type === 'signup' ? 'signup' : type as 'email' | 'recovery' | 'invite';
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        });
        if (!error && data.session) {
          setSession(data.session);
          await fetchProfile(data.session.user.id);

          if (type === 'recovery') {
            router.replace('/(auth)/reset-password');
          }
        }
        return;
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, [router, setSession, fetchProfile]);

  // Listen for auth state changes (sign in, sign out, token refresh)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignore SIGNED_IN events for unconfirmed email signups —
        // Supabase fires SIGNED_IN immediately after signUp even before
        // the user clicks the verification link. We only want to act on
        // a real confirmed sign-in.
        if (
          event === 'SIGNED_IN' &&
          session?.user &&
          !session.user.email_confirmed_at &&
          session.user.app_metadata?.provider === 'email'
        ) {
          return;
        }

        // Keep the functions client's Authorization header in sync with the
        // current session. supabase-js does NOT do this automatically —
        // without this, supabase.functions.invoke() sends no user token.
        if (session?.access_token) {
          supabase.functions.setAuth(session.access_token);
        } else {
          supabase.functions.setAuth('');
        }

        setSession(session);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setSession, setProfile, fetchProfile]);

  useProtectedRoute();
  useBiometricLock();

  if (!fontsLoaded) {
    return (
      <>
        <StatusBar style="dark" />
        <BootScreen />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: paper.paper },
          headerTintColor: paper.ink,
          headerTitleStyle: {
            fontFamily: paperFonts.display,
            fontSize: 17,
            color: paper.ink,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: paper.paper },
          headerBackTitle: '',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="water-reader" options={{ headerShown: false }} />
        {/*
          The following five screens used to render the system Stack header
          (a thin grey bar with a default Back button) which clashed with
          the FinFindr paper voice everywhere else. They now render their
          own <PaperNavHeader> inside the screen body — the editorial
          BACK chip, FINFINDR · <SECTION> eyebrow, and Fraunces title.
          Keep `headerShown: false` here so the system bar does not draw
          on top of it.
        */}
        <Stack.Screen name="new-entry" options={{ headerShown: false }} />
        <Stack.Screen name="log-detail" options={{ headerShown: false }} />
        <Stack.Screen name="personal-bests" options={{ headerShown: false }} />
        <Stack.Screen name="subscribe" options={{ headerShown: false }} />
        <Stack.Screen
          name="recommender"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="how-fishing"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="how-fishing-results"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="analytics" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

/**
 * BootScreen — the briefly-visible interstitial while the Google Fonts
 * bundle resolves. Previously a centered wordmark on a flat paper
 * background; now adds a soft topographic-line hint behind the title
 * and a breathing forest dot below it so the very first thing the user
 * sees already feels like the rest of the app instead of a placeholder.
 *
 * Implementation notes:
 *   • We render only with the on-device system font here. Once `useFonts`
 *     resolves we re-enter the normal Stack which mounts the app fonts.
 *   • The pulse uses the native driver — no JS work, even before fonts.
 */
function BootScreen() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.bootScreen}>
      {/* Three soft horizontal contour rules behind the title — the same
          topographic motif used on the paper LiveConditions card and the
          Recommender hero. Drawn with plain Views so we don't need fonts
          or react-native-svg up before the font bundle resolves. */}
      <View style={styles.bootTopo} pointerEvents="none">
        <View style={[styles.bootTopoLine, { width: 220, opacity: 0.28 }]} />
        <View style={[styles.bootTopoLine, { width: 180, opacity: 0.22, marginTop: 14 }]} />
        <View style={[styles.bootTopoLine, { width: 240, opacity: 0.18, marginTop: 14 }]} />
      </View>
      <Text style={styles.bootEyebrow}>— FINFINDR · BOOTING —</Text>
      <Text style={styles.bootTitle}>FINFINDR</Text>
      <Text style={styles.bootSubtitle}>your fishing companion</Text>
      <Animated.View
        style={[
          styles.bootDot,
          {
            opacity: pulse,
            transform: [
              {
                scale: pulse.interpolate({
                  inputRange: [0.4, 1],
                  outputRange: [0.85, 1.15],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bootScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.paper,
    paddingHorizontal: 24,
  },
  bootTopo: {
    position: 'absolute',
    alignItems: 'center',
    opacity: 0.85,
  },
  bootTopoLine: {
    height: 1,
    backgroundColor: paper.ink,
    borderRadius: 1,
  },
  bootEyebrow: {
    // Pre-fonts on purpose — system font; the styling (tracking + size)
    // is what carries the editorial voice while the real fonts load.
    fontSize: 9,
    color: paper.red,
    letterSpacing: 2.6,
    fontWeight: '700',
    marginBottom: 14,
  },
  bootTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    fontWeight: '700',
    color: paper.ink,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  bootSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.65,
    letterSpacing: 1.2,
  },
  bootDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: paper.forest,
    marginTop: 22,
  },
});
