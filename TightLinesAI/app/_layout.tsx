import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
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
    const inResetPassword = segments[1] === 'reset-password';

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

  // Hydrate session from AsyncStorage on mount
  useEffect(() => {
    hydrate();
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
          headerTintColor: colors.sage,
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
        <Stack.Screen name="recommender" options={{ title: 'Recommender' }} />
        <Stack.Screen name="water-reader" options={{ title: 'Water Reader' }} />
        <Stack.Screen name="new-entry" options={{ title: 'New Entry' }} />
        <Stack.Screen name="log-detail" options={{ title: 'Trip Details' }} />
        <Stack.Screen
          name="personal-bests"
          options={{ title: 'Personal Bests' }}
        />
      </Stack>
    </>
  );
}
