import {
  GoogleOneTapSignIn,
  isErrorWithCode,
  statusCodes,
} from 'react-native-nitro-google-signin';
import * as Crypto from 'expo-crypto';

export const GOOGLE_WEB_CLIENT_ID =
  '655199773804-mbrmk6l4ndce33iqo9bptogucqmgo8mq.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID =
  '655199773804-0r0e6np654jqvtop64bdpg7fjrfs2i76.apps.googleusercontent.com';

const GOOGLE_SIGN_IN_CONFIG = {
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
  autoSelectOnSignIn: false,
} as const;

GoogleOneTapSignIn.configure(GOOGLE_SIGN_IN_CONFIG);

let pendingGoogleRawNonce: string | null = null;

/**
 * Configure the native Google request with a nonce whose original value is
 * retained for Supabase. The native library otherwise generates its own
 * nonce, but only returns the ID token (not the original nonce), which makes
 * Supabase reject the exchange.
 */
export async function prepareGoogleSignIn(): Promise<void> {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  pendingGoogleRawNonce = rawNonce;
  GoogleOneTapSignIn.configure({
    ...GOOGLE_SIGN_IN_CONFIG,
    nonce: hashedNonce,
  });
}

/** A nonce is single-use and must be consumed by the matching token exchange. */
export function consumeGoogleSignInNonce(): string | null {
  const nonce = pendingGoogleRawNonce;
  pendingGoogleRawNonce = null;
  return nonce;
}

export function clearGoogleSignInNonce(): void {
  pendingGoogleRawNonce = null;
}

export function isGoogleUserCancellation(err: unknown): boolean {
  return isErrorWithCode(err) && err.code === statusCodes.SIGN_IN_CANCELLED;
}

export function getGoogleSignInFailureNotice(err: unknown): {
  title: string;
  message: string;
} {
  if (isErrorWithCode(err)) {
    if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        title: 'Google Play services required',
        message: 'Update Google Play services, then try signing in again.',
      };
    }
    if (err.code === statusCodes.DEVELOPER_ERROR) {
      return {
        title: 'Google Sign-In configuration issue',
        message: __DEV__
          ? err.message
          : 'Google Sign-In is temporarily unavailable. Please use email sign-in.',
      };
    }
  }

  return {
    title: 'Google Sign-In failed',
    message: __DEV__ && err instanceof Error
      ? err.message
      : 'Please try again.',
  };
}
