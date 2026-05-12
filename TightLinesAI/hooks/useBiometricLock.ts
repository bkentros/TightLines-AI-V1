import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type LocalAuthModule = typeof import('expo-local-authentication');

/**
 * Watches app foreground transitions. If a stored Supabase session is present
 * but the access token has expired, we prompt for Face ID / biometrics before
 * silently refreshing the token. This gives seamless re-entry without forcing
 * a full password sign-in.
 *
 * If biometrics are unavailable or the user cancels, the session is signed out
 * and the user is redirected to auth (handled by the root layout guard).
 *
 * expo-local-authentication is loaded lazily so an older dev client binary
 * missing native modules does not crash on startup.
 */
export function useBiometricLock() {
  const { session, signOut } = useAuthStore();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const biometricLocked = useRef(false);

  useEffect(() => {
    let la: LocalAuthModule | null = null;
    let subscription: ReturnType<typeof AppState.addEventListener> | null =
      null;
    let cancelled = false;

    void (async () => {
      try {
        la = await import('expo-local-authentication');
      } catch {
        return;
      }
      if (cancelled || !la) return;

      subscription = AppState.addEventListener(
        'change',
        async (nextState) => {
          const LocalAuthentication = la;
          if (!LocalAuthentication) return;

          const wasBackground =
            appState.current === 'background' ||
            appState.current === 'inactive';
          const nowActive = nextState === 'active';

          appState.current = nextState;

          if (!wasBackground || !nowActive) return;
          if (!session) return;
          if (biometricLocked.current) return;

          const expiresAt = session.expires_at;
          const nowSeconds = Math.floor(Date.now() / 1000);
          const tokenExpired =
            expiresAt !== undefined && expiresAt < nowSeconds;

          if (!tokenExpired) return;

          try {
            const hasHardware =
              await LocalAuthentication.hasHardwareAsync();
            const isEnrolled =
              await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
              const { error } = await supabase.auth.refreshSession();
              if (error) await signOut();
              return;
            }

            biometricLocked.current = true;

            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Unlock FinFindr',
              fallbackLabel: 'Use Passcode',
              cancelLabel: 'Sign Out',
              disableDeviceFallback: false,
            });

            biometricLocked.current = false;

            if (result.success) {
              const { error } = await supabase.auth.refreshSession();
              if (error) await signOut();
            } else {
              await signOut();
            }
          } catch {
            biometricLocked.current = false;
            try {
              const { error } = await supabase.auth.refreshSession();
              if (error) await signOut();
            } catch {
              await signOut();
            }
          }
        },
      );
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [session, signOut]);
}
