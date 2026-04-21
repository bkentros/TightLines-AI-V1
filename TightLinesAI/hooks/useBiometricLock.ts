import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

/**
 * Watches app foreground transitions. If a stored Supabase session is present
 * but the access token has expired, we prompt for Face ID / biometrics before
 * silently refreshing the token. This gives seamless re-entry without forcing
 * a full password sign-in.
 *
 * If biometrics are unavailable or the user cancels, the session is signed out
 * and the user is redirected to auth (handled by the root layout guard).
 */
export function useBiometricLock() {
  const { session, signOut } = useAuthStore();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const biometricLocked = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextState) => {
        const wasBackground =
          appState.current === 'background' ||
          appState.current === 'inactive';
        const nowActive = nextState === 'active';

        appState.current = nextState;

        if (!wasBackground || !nowActive) return;
        if (!session) return; // No session — nothing to protect
        if (biometricLocked.current) return; // Already handling

        // Check if the access token has expired
        const expiresAt = session.expires_at; // seconds since epoch
        const nowSeconds = Math.floor(Date.now() / 1000);
        const tokenExpired = expiresAt !== undefined && expiresAt < nowSeconds;

        if (!tokenExpired) return; // Token still valid — no prompt needed

        // Check if biometrics are available on this device
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
          // No biometrics available — refresh token silently without prompt
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
          // Refresh the Supabase session silently
          const { error } = await supabase.auth.refreshSession();
          if (error) await signOut();
        } else {
          // User cancelled biometric or tapped "Sign Out"
          await signOut();
        }
      },
    );

    return () => subscription.remove();
  }, [session, signOut]);
}
