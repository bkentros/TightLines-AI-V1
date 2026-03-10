import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { signInWithEmail, signInWithApple } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';

export default function SignInScreen() {
  const router = useRouter();
  const { fetchProfile, setSession } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signInWithEmail(trimmedEmail, password);
      if (error) {
        Alert.alert('Sign In Failed', error.message);
        return;
      }
      if (data.session) {
        setSession(data.session);
        await fetchProfile(data.session.user.id);
        // Navigation handled by root layout guard
      }
    } finally {
      setLoading(false);
    }
  };

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
        throw new Error('No identity token');
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
        return;
      }
      Alert.alert('Apple Sign-In Failed', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={12}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.forgotLink}
              onPress={() =>
                Alert.alert(
                  'Reset Password',
                  'Password reset is coming soon. Contact support if needed.',
                )
              }
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                styles.btnPrimary,
                pressed && styles.btnPrimaryPressed,
                loading && styles.btnDisabled,
              ]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.btnPrimaryText}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Text>
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

            <Pressable
              style={styles.switchLink}
              onPress={() => router.replace('/(auth)/sign-up')}
            >
              <Text style={styles.switchText}>
                Don't have an account?{' '}
                <Text style={styles.switchTextBold}>Create one</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },

  header: { paddingTop: spacing.md, marginBottom: spacing.xl },
  backBtn: { marginBottom: spacing.lg },
  title: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: { fontSize: 15, color: colors.textSecondary },

  form: { gap: spacing.md, marginBottom: spacing.xl },
  field: { gap: spacing.xs + 2 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: 16,
    color: colors.text,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotLink: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, color: colors.sage, fontWeight: '500' },

  actions: { gap: spacing.sm },
  btn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: colors.sage },
  btnPrimaryPressed: { backgroundColor: colors.sageDark },
  btnPrimaryText: { fontSize: 16, fontWeight: '600', color: colors.textLight },
  btnDisabled: { opacity: 0.6 },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 13, color: colors.textMuted },

  appleBtn: { height: 50, width: '100%' },

  switchLink: { alignItems: 'center', paddingTop: spacing.sm },
  switchText: { fontSize: 14, color: colors.textSecondary },
  switchTextBold: { fontWeight: '600', color: colors.sage },
});
