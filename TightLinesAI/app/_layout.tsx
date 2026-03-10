import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
  const { session, isOnboarded, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const inTabs = segments[0] === '(tabs)';

    if (!session) {
      // No session → send to auth
      if (!inAuth) router.replace('/(auth)/welcome');
      return;
    }

    if (!isOnboarded) {
      // Logged in but hasn't completed onboarding
      if (!inOnboarding) router.replace('/(onboarding)/step-1-welcome');
      return;
    }

    // Fully authenticated + onboarded → send to app
    if (inAuth || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [session, isOnboarded, isLoading, segments, router]);
}

export default function RootLayout() {
  const { hydrate, setSession, setProfile, fetchProfile } = useAuthStore();

  // Hydrate session from AsyncStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Listen for auth state changes (sign in, sign out, token refresh)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
