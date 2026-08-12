import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
  type StyleProp,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isSuccessResponse,
  type OneTapSuccessData,
} from 'react-native-nitro-google-signin';
import {
  clearGoogleSignInNonce,
  isGoogleUserCancellation,
  prepareGoogleSignIn,
} from '../../lib/googleAuth';
import { paper, paperFonts } from '../../lib/theme';

type GoogleAuthButtonProps = {
  onSignInStart?: () => void;
  onSignInSuccess: (data: OneTapSuccessData) => void | Promise<void>;
  onSignInError: (error: unknown) => void;
  style?: StyleProp<ViewStyle>;
};

/** Full-width Google-branded control backed by the native account picker. */
export function GoogleAuthButton({
  onSignInStart,
  onSignInSuccess,
  onSignInError,
  style,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePress = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      onSignInStart?.();
      await prepareGoogleSignIn();
      await GoogleOneTapSignIn.checkPlayServices();

      // A visible button must use the explicit flow. On iOS, signIn() may
      // restore a cached user and return an older token that was not minted
      // with the nonce prepared immediately above.
      const response = await GoogleOneTapSignIn.presentExplicitSignIn();

      if (isSuccessResponse(response)) {
        await onSignInSuccess(response.data);
        return;
      }

      clearGoogleSignInNonce();
      if (!isCancelledResponse(response)) {
        onSignInError(new Error('No Google account was selected.'));
      }
    } catch (error) {
      clearGoogleSignInNonce();
      if (!isGoogleUserCancellation(error)) onSignInError(error);
    } finally {
      setLoading(false);
    }
  }, [loading, onSignInError, onSignInStart, onSignInSuccess]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        loading && styles.buttonLoading,
        style,
      ]}
    >
      <View style={styles.iconSlot}>
        {loading ? <ActivityIndicator size="small" color="#4285F4" /> : <GoogleG />}
      </View>
      <Text style={styles.label}>{loading ? 'Signing in…' : 'Sign in with Google'}</Text>
      <View style={styles.balanceSlot} />
    </Pressable>
  );
}

function GoogleG() {
  return (
    <Svg width={21} height={21} viewBox="0 0 18 18" accessibilityElementsHidden>
      <Path
        fill="#4285F4"
        d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844c-.209 1.125-.843 2.078-1.797 2.716v2.258h2.909c1.702-1.567 2.684-3.874 2.684-6.615Z"
      />
      <Path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.258c-.806.54-1.835.859-3.047.859-2.344 0-4.329-1.585-5.037-3.711H.956v2.333A9 9 0 0 0 9 18Z"
      />
      <Path
        fill="#FBBC05"
        d="M3.963 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.281-1.71V4.957H.956A9 9 0 0 0 0 9c0 1.452.348 2.827.956 4.043l3.007-2.333Z"
      />
      <Path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.442 1.345l2.582-2.581C13.463.892 11.426 0 9 0A9 9 0 0 0 .956 4.957L3.963 7.29C4.671 5.164 6.656 3.58 9 3.58Z"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C9CDD1',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  buttonPressed: {
    backgroundColor: '#F7F8F8',
    borderColor: '#AEB4BA',
  },
  buttonLoading: {
    opacity: 0.72,
  },
  iconSlot: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceSlot: {
    width: 24,
  },
  label: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 16,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
});
