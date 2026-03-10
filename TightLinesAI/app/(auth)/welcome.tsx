import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { signInWithApple } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';

function BrandMark() {
  const tick = { backgroundColor: colors.sage, borderRadius: 1 as const };
  return (
    <View style={markStyles.wrap}>
      <View style={markStyles.ring} />
      <View style={[markStyles.tickH, tick, markStyles.tickN]} />
      <View style={[markStyles.tickV, tick, markStyles.tickE]} />
      <View style={[markStyles.tickH, tick, markStyles.tickS]} />
      <View style={[markStyles.tickV, tick, markStyles.tickW]} />
      <Ionicons name="fish" size={18} color={colors.sage} />
    </View>
  );
}

const MARK = 38;
const markStyles = StyleSheet.create({
  wrap: {
    width: MARK,
    height: MARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: MARK / 2,
    borderWidth: 2,
    borderColor: colors.sage,
  },
  tickH: { position: 'absolute', width: 7, height: 2 },
  tickV: { position: 'absolute', width: 2, height: 7 },
  tickN: { top: -1, alignSelf: 'center' },
  tickS: { bottom: -1, alignSelf: 'center' },
  tickE: { right: -1 },
  tickW: { left: -1 },
});

export default function WelcomeScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();

  const handleAppleSignIn = async () => {
    try {
      const nonce = Crypto.randomUUID();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce,
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        throw new Error('Apple Sign-In: no identity token returned');
      }

      const { data, error } = await signInWithApple(
        credential.identityToken,
        nonce,
      );

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        await fetchProfile(data.session.user.id);
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err.message.includes('ERR_REQUEST_CANCELED')
      ) {
        return; // User cancelled — do nothing
      }
      console.error('Apple Sign-In error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Brand */}
        <View style={styles.brandSection}>
          <BrandMark />
          <Text style={styles.wordmark}>TightLines AI</Text>
          <View style={styles.accentLine} />
          <Text style={styles.tagline}>
            Tight lines start with better intel.
          </Text>
        </View>

        {/* Value props */}
        <View style={styles.valueProps}>
          {[
            { icon: 'fish-outline', text: 'AI-powered lure & fly recommendations' },
            { icon: 'camera-outline', text: 'Water Reader — analyze any body of water' },
            { icon: 'mic-outline', text: 'Voice-to-text fishing log' },
          ].map((item) => (
            <View key={item.icon} style={styles.valueProp}>
              <Ionicons name={item.icon as any} size={18} color={colors.sage} />
              <Text style={styles.valuePropText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnPrimary,
              pressed && styles.btnPrimaryPressed,
            ]}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.btnPrimaryText}>Create Account</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnSecondary,
              pressed && styles.btnSecondaryPressed,
            ]}
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.btnSecondaryText}>Sign In</Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={radius.md}
                style={styles.appleBtn}
                onPress={handleAppleSignIn}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
  },

  brandSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.lg,
    gap: spacing.sm,
  },
  wordmark: {
    fontFamily: fonts.serif,
    fontSize: 36,
    color: colors.text,
    letterSpacing: 0.5,
    marginTop: spacing.sm,
  },
  accentLine: {
    width: 48,
    height: 3,
    backgroundColor: colors.sage,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontFamily: fonts.serif,
  },

  valueProps: {
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  valuePropText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },

  actions: { gap: spacing.sm },
  btn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: colors.sage },
  btnPrimaryPressed: { backgroundColor: colors.sageDark },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnSecondaryPressed: { backgroundColor: colors.surfacePressed },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 13, color: colors.textMuted },

  appleBtn: { height: 50, width: '100%' },
});
