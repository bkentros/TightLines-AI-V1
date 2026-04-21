/**
 * Sign-in screen — FinFindr paper language.
 *
 * Visual migration only. Auth behavior is identical to the previous version:
 *   - email/password via `signInWithEmail`
 *   - Apple Sign-In via `signInWithApple`
 *   - error alerts, session storage, and profile fetch unchanged
 */

import { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
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
import {
  paper,
  paperFonts,
  paperRadius,
  paperSpacing,
} from '../../lib/theme';
import { signInWithEmail, signInWithApple } from '../../lib/auth';
import { useAuthStore } from '../../store/authStore';
import { PaperBackground } from '../../components/paper';
import {
  AuthBackButton,
  AuthDivider,
  AuthField,
  AuthHeader,
  AuthPrimaryButton,
  AuthTextLink,
} from '../../components/paper/auth';

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
    <PaperBackground>
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
            <View style={styles.topSection}>
              <AuthBackButton onPress={() => router.back()} />

              <AuthHeader
                eyebrow="— FINFINDR · SIGN IN —"
                title={'Welcome\nback.'}
                subtitle="Sign in to pick up your log, reports, and tackle recommendations right where you left them."
              />
            </View>

            <View style={styles.form}>
              <AuthField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />

              <AuthField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                reserveTrailingSpace
                trailing={
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={paper.ink}
                    />
                  </Pressable>
                }
              />

              <Pressable
                style={styles.forgotLink}
                onPress={() => router.push('/(auth)/forgot-password')}
                hitSlop={8}
              >
                <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
              </Pressable>
            </View>

            <View style={styles.actions}>
              <AuthPrimaryButton
                label="Sign in"
                loading={loading}
                loadingLabel="SIGNING IN…"
                onPress={handleSignIn}
              />

              {Platform.OS === 'ios' && (
                <>
                  <AuthDivider />

                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={
                      AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                    }
                    buttonStyle={
                      AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                    }
                    cornerRadius={paperRadius.card}
                    style={styles.appleBtn}
                    onPress={handleAppleSignIn}
                  />
                </>
              )}

              <AuthTextLink
                leadText="Don't have an account?"
                linkText="CREATE ONE"
                onPress={() => router.replace('/(auth)/sign-up')}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    paddingTop: paperSpacing.md,
    justifyContent: 'space-between',
    gap: paperSpacing.xl,
  },
  topSection: {
    gap: paperSpacing.xl,
  },
  form: {
    gap: paperSpacing.md,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  forgotText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.forest,
    letterSpacing: 2.4,
  },
  actions: {
    gap: paperSpacing.sm,
  },
  appleBtn: {
    height: 52,
    width: '100%',
  },
});
