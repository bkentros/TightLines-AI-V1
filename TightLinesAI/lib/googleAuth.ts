import {
  GoogleOneTapSignIn,
  isErrorWithCode,
  statusCodes,
} from 'react-native-nitro-google-signin';

export const GOOGLE_WEB_CLIENT_ID =
  '655199773804-mbrmk6l4ndce33iqo9bptogucqmgo8mq.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID =
  '655199773804-0r0e6np654jqvtop64bdpg7fjrfs2i76.apps.googleusercontent.com';

GoogleOneTapSignIn.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
  autoSelectOnSignIn: false,
});

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
