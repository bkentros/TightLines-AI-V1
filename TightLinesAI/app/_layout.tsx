import { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, LogBox, View, Text, StyleSheet } from 'react-native';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
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
import {
  activateCreatorLinkSession,
  dismissCreatorLinkSession,
  markPendingCreatorAutoRouted,
  parseCreatorDeepLink,
  resolveDeferredCreatorReferral,
  resolvePendingCreatorReferralRoute,
  storeCreatorReferralPendingOnly,
  syncCreatorReferralAttribution,
} from '../lib/creatorAttribution';
import {
  ensureInstallyConfigured,
  syncInstallyUserId,
  trackInstallyInstall,
} from '../lib/installyAttribution';
import { isCreatorReferralEligible } from '../lib/creatorReferralEligibility';
import { useAuthStore } from '../store/authStore';
import { useEnvStore } from '../store/envStore';
import { useRevenueCatStore } from '../store/revenueCatStore';
import { AnglerUnlockedModal } from '../components/paper/AnglerUnlockedModal';
import { showSubscriptionNotice } from '../store/subscriptionCelebrationStore';
import { useBiometricLock } from '../hooks/useBiometricLock';
import { AnalyticsProvider } from '../components/AnalyticsProvider';
import { AppErrorBoundary } from '../components/AppErrorBoundary';
import { paper, paperFonts } from '../lib/theme';

if (__DEV__) {
  LogBox.ignoreLogs([
    'AuthApiError: Invalid Refresh Token: Refresh Token Not Found',
    'Invalid Refresh Token: Refresh Token Not Found',
  ]);
}

/** expo-linking query values can be string | string[] */
function linkingParam(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function isPasswordResetLink(params: Record<string, unknown>): boolean {
  const type = linkingParam(params['type'] as string | string[] | undefined);
  const flow = linkingParam(params['flow'] as string | string[] | undefined);
  const mode = linkingParam(params['mode'] as string | string[] | undefined);
  return (
    type === 'recovery' ||
    flow === 'password-reset' ||
    flow === 'reset-password' ||
    mode === 'password-reset' ||
    mode === 'reset-password'
  );
}

async function hasExistingCompletedProfile(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,onboarding_complete')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return false;
  return data.onboarding_complete === true;
}

const ONBOARDING_STEP_SEGMENTS = new Set([
  'step-1-welcome',
  'step-2-preferences',
  'step-3-location',
]);

const AUTH_ROUTE_SEGMENTS = new Set([
  'welcome',
  'sign-in',
  'sign-up',
  'verify-email',
  'forgot-password',
  'reset-password',
]);

const PUBLIC_LEGAL_ROUTE_SEGMENTS = new Set([
  'legal',
  'privacy',
  'terms',
  'safety',
]);

function pathParts(pathname: string): string[] {
  return pathname.replace(/^\/+/, '').split('/').filter(Boolean);
}

/**
 * Expo Router often omits `(onboarding)` / `(auth)` from `useSegments()`.
 * Also consult the pathname so guards match real screens.
 */
function routeContextFlags(pathname: string, segments: string[]) {
  const parts = new Set([...segments, ...pathParts(pathname)]);
  const inOnboarding =
    segments[0] === '(onboarding)' ||
    [...parts].some((s) => ONBOARDING_STEP_SEGMENTS.has(s));
  const inAuth =
    segments[0] === '(auth)' ||
    [...parts].some((s) => AUTH_ROUTE_SEGMENTS.has(s));
  const inAuthEmailConfirm =
    (segments[0] === 'auth' && segments[1] === 'confirm') ||
    (parts.has('auth') && parts.has('confirm')) ||
    pathname.includes('auth/confirm');
  const inPublicLegal =
    segments[0] === 'legal' ||
    pathname.startsWith('/legal/') ||
    [...parts].some((s) => PUBLIC_LEGAL_ROUTE_SEGMENTS.has(s));
  return { inAuth, inOnboarding, inAuthEmailConfirm, inPublicLegal };
}

/**
 * Determines where the user should be based on auth + onboarding state.
 * Called after every auth change and on initial hydration.
 */
function useProtectedRoute(passwordRecoveryInFlight: boolean) {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const { session, isOnboarded, isLoading, isProfileLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const { inAuth, inOnboarding, inAuthEmailConfirm, inPublicLegal } = routeContextFlags(
      pathname,
      segments as string[],
    );
    const inResetPassword = segments.includes('reset-password');

    // Email PKCE: redirect as soon as `exchangeCodeForSession` sets session.
    // Do not wait for `fetchProfile` — that query can hang on bad networks and
    // `isProfileLoading` would block this effect forever (spinner on auth/confirm).
    if (inAuthEmailConfirm && session && !passwordRecoveryInFlight) {
      if (!isOnboarded) {
        router.replace('/(onboarding)/step-2-preferences');
      } else {
        router.replace('/(tabs)');
      }
      return;
    }

    // Onboarding just wrote onboarding_complete — leave the stack even if a
    // background `fetchProfile` from email sign-in is still in flight (same
    // isProfileLoading deadlock as auth/confirm).
    if (session && isOnboarded && inOnboarding) {
      router.replace('/(tabs)');
      return;
    }

    if (isProfileLoading) return;

    if (!session) {
      if (!inAuth && !inAuthEmailConfirm && !inPublicLegal) router.replace('/(auth)/welcome');
      return;
    }

    // Don't redirect away from reset-password screen — user arrived via recovery link
    if (inResetPassword) return;

    if (!isOnboarded) {
      if (!inOnboarding) router.replace('/(onboarding)/step-2-preferences');
      return;
    }

    if (inAuth || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [
    session,
    isOnboarded,
    isLoading,
    isProfileLoading,
    segments,
    pathname,
    router,
    passwordRecoveryInFlight,
  ]);
}

export default function RootLayout() {
  const router = useRouter();
  const { hydrate, setSession, setProfile, fetchProfile, user, isOnboarded } = useAuthStore();
  const initializeRevenueCat = useRevenueCatStore((s) => s.initialize);
  const resetRevenueCat = useRevenueCatStore((s) => s.reset);
  const [passwordRecoveryInFlight, setPasswordRecoveryInFlight] = useState(false);
  const routingPendingCreatorRef = useRef(false);

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

  useEffect(() => {
    if (!user?.id) {
      resetRevenueCat();
      routingPendingCreatorRef.current = false;
      return;
    }
    void initializeRevenueCat(user.id);
  }, [initializeRevenueCat, resetRevenueCat, user?.id]);

  // Creator link clicked while logged out → after sign-in + onboarding, open subscribe.
  useEffect(() => {
    if (!user?.id || !isOnboarded || routingPendingCreatorRef.current) return;

    void (async () => {
      routingPendingCreatorRef.current = true;
      try {
        const authState = useAuthStore.getState();
        if (!authState.profile && authState.user?.id) {
          await useAuthStore.getState().fetchProfile(authState.user.id);
        }

        const { hasAngler, customerInfo } = useRevenueCatStore.getState();
        const profileTier = useAuthStore.getState().profile?.subscription_tier;
        const route = await resolvePendingCreatorReferralRoute({
          hasSession: Boolean(useAuthStore.getState().session),
          isOnboarded: useAuthStore.getState().isOnboarded,
          hasAngler,
          customerInfo,
          profileTier,
        });

        if (route === 'subscribe') {
          await markPendingCreatorAutoRouted();
          const authSession = useAuthStore.getState().session;
          if (authSession?.access_token) {
            await syncCreatorReferralAttribution(authSession.access_token);
          }
          router.replace('/subscribe?creator=1');
          return;
        }

        if (route === 'ineligible') {
          showSubscriptionNotice({
            title: 'Creator referral unavailable',
            message:
              'Creator referrals are for first-time Angler subscribers. Your account may already have an active membership.',
            tone: 'info',
          });
        }
      } finally {
        routingPendingCreatorRef.current = false;
      }
    })();
  }, [user?.id, isOnboarded, router]);

  // Instally install match + legacy deferred resolve on launch and foreground.
  useEffect(() => {
    void ensureInstallyConfigured().then(() => trackInstallyInstall());
    void resolveDeferredCreatorReferral();

    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void trackInstallyInstall();
        void resolveDeferredCreatorReferral();
      }
    });
    return () => sub.remove();
  }, []);

  // Handle deep links — email verification & password reset tokens
  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (!url) return;

      const creatorLink = parseCreatorDeepLink(url);
      if (creatorLink) {
        let authState = useAuthStore.getState();
        if (!authState.session) {
          await storeCreatorReferralPendingOnly(creatorLink);
          return;
        }

        if (!authState.profile && authState.user?.id) {
          await useAuthStore.getState().fetchProfile(authState.user.id);
          authState = useAuthStore.getState();
        }

        if (!authState.isOnboarded) {
          await storeCreatorReferralPendingOnly(creatorLink);
          return;
        }

        const { hasAngler: storeHasAngler, customerInfo } = useRevenueCatStore.getState();
        const profileTier = authState.profile?.subscription_tier;
        const eligible = isCreatorReferralEligible({
          customerInfo,
          hasAngler: storeHasAngler,
          profileTier,
        });

        if (!eligible) {
          await dismissCreatorLinkSession();
          showSubscriptionNotice({
            title: 'Creator referral unavailable',
            message:
              'Creator referrals are for first-time Angler subscribers. Your account may already have subscribed before.',
            tone: 'info',
          });
          return;
        }

        await activateCreatorLinkSession(creatorLink);
        router.replace('/subscribe?creator=1');
        return;
      }

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
      const type = linkingParam(params['type'] as string | string[] | undefined);
      const isRecoveryLink = isPasswordResetLink(params);
      const hasAuthPayload =
        Boolean(params['access_token'] && params['refresh_token']) ||
        Boolean(params['code']) ||
        Boolean(params['token_hash'] ?? params['token']);

      if (hasAuthPayload) {
        setPasswordRecoveryInFlight(true);
      }

      const accessToken = linkingParam(params['access_token'] as string | string[] | undefined);
      const refreshToken = linkingParam(params['refresh_token'] as string | string[] | undefined);
      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error && data.session) {
          const shouldReset =
            isRecoveryLink ||
            (!type && (await hasExistingCompletedProfile(data.session.user.id)));
          setSession(data.session);
          void fetchProfile(data.session.user.id);
          if (shouldReset) {
            router.replace('/(auth)/reset-password');
          } else {
            setPasswordRecoveryInFlight(false);
          }
        } else {
          setPasswordRecoveryInFlight(false);
        }
        return;
      }

      const authCode = linkingParam(params['code'] as string | string[] | undefined);
      if (authCode) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);
        if (__DEV__ && error) {
          console.warn('[deep link] exchangeCodeForSession failed', error.message);
        }
        if (!error && data.session) {
          const shouldReset =
            isRecoveryLink ||
            (!type && (await hasExistingCompletedProfile(data.session.user.id)));
          setSession(data.session);
          void fetchProfile(data.session.user.id);
          if (shouldReset) {
            router.replace('/(auth)/reset-password');
          } else {
            setPasswordRecoveryInFlight(false);
          }
        } else {
          setPasswordRecoveryInFlight(false);
        }
        return;
      }

      const tokenHash = linkingParam(
        (params['token_hash'] ?? params['token']) as string | string[] | undefined,
      );
      if (tokenHash && type) {
        const otpType = type === 'signup' ? 'signup' : type as 'email' | 'recovery' | 'invite';
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        });
        if (!error && data.session) {
          setSession(data.session);
          void fetchProfile(data.session.user.id);

          if (type === 'recovery') {
            router.replace('/(auth)/reset-password');
          } else {
            setPasswordRecoveryInFlight(false);
          }
        } else {
          setPasswordRecoveryInFlight(false);
        }
        return;
      }
    };

    Linking.getInitialURL().then(async (url) => {
      if (url) {
        const creatorFromUrl = parseCreatorDeepLink(url);
        if (creatorFromUrl) {
          await handleUrl(url);
        } else {
          await resolveDeferredCreatorReferral();
          await handleUrl(url);
        }
        return;
      }
      await resolveDeferredCreatorReferral();
    });

    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, [router, setSession, fetchProfile]);

  // Listen for auth state changes (sign in, sign out, token refresh)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Ignore SIGNED_IN events for unconfirmed email signups —
        // Supabase fires SIGNED_IN immediately after signUp even before
        // the user clicks the verification link. We only want to act on
        // a real confirmed sign-in.
        if (event === 'PASSWORD_RECOVERY' && session?.user) {
          setPasswordRecoveryInFlight(true);
          supabase.functions.setAuth(session.access_token);
          setSession(session);
          setTimeout(() => {
            void fetchProfile(session.user.id);
          }, 0);
          router.replace('/(auth)/reset-password');
          return;
        }

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
          void syncInstallyUserId(session.user.id);
        } else {
          supabase.functions.setAuth('');
        }

        if (event === 'SIGNED_OUT') {
          setPasswordRecoveryInFlight(false);
        }

        setSession(session);

        if (session?.user) {
          setTimeout(() => {
            void fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          if (event === 'SIGNED_OUT') {
            useEnvStore.getState().clear();
          }
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, setSession, setProfile, fetchProfile]);

  useProtectedRoute(passwordRecoveryInFlight);
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
    <AppErrorBoundary>
      <AnalyticsProvider>
        <StatusBar style="dark" />
        <AnglerUnlockedModal />
        <Stack
        screenOptions={{
          headerStyle: { backgroundColor: paper.dashboardInk },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: paperFonts.display,
            fontSize: 17,
            color: '#FFFFFF',
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: paper.dashboardCream },
          headerBackTitle: '',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="legal" options={{ headerShown: false }} />
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
        <Stack.Screen name="support" options={{ headerShown: false }} />
        <Stack.Screen name="how-it-works" options={{ headerShown: false }} />
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
      </AnalyticsProvider>
    </AppErrorBoundary>
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
    backgroundColor: paper.dashboardCream,
    paddingHorizontal: 24,
  },
  bootTopo: {
    position: 'absolute',
    alignItems: 'center',
    opacity: 0.85,
  },
  bootTopoLine: {
    height: 1,
    backgroundColor: paper.dashboardLine,
    borderRadius: 1,
  },
  bootEyebrow: {
    // Pre-fonts on purpose — system font; the styling (tracking + size)
    // is what carries the editorial voice while the real fonts load.
    fontSize: 9,
    color: paper.dashboardBlue,
    letterSpacing: 2.6,
    fontWeight: '700',
    marginBottom: 14,
  },
  bootTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    fontWeight: '700',
    color: paper.dashboardInk,
    letterSpacing: 0,
    marginBottom: 6,
  },
  bootSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.65,
    letterSpacing: 1.2,
  },
  bootDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: paper.dashboardBlue,
    marginTop: 22,
  },
});
