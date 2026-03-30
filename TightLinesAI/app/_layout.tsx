import { useEffect } from 'react';
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
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useBiometricLock } from '../hooks/useBiometricLock';
import { colors, fonts } from '../lib/theme';

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

  useFonts({
    ...Ionicons.font,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
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

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontFamily: fonts.serif,
            fontSize: 17,
            color: colors.text,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          headerBackTitle: '',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="water-reader" options={{ title: 'Water Reader' }} />
        <Stack.Screen name="new-entry" options={{ title: 'New Entry' }} />
        <Stack.Screen name="log-detail" options={{ title: 'Trip Details' }} />
        <Stack.Screen
          name="personal-bests"
          options={{ title: 'Personal Bests' }}
        />
        <Stack.Screen name="subscribe" options={{ title: 'Subscribe' }} />
        <Stack.Screen
          name="how-fishing"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="how-fishing-results"
          options={{ title: 'Your Report', headerRight: () => null }}
        />
      </Stack>
    </>
  );
}
