/**
 * Sign-up screen — FinFindr paper language.
 *
 * All validation, rate-limit, duplicate-account handling, and navigation
 * behavior are preserved exactly from the previous version. Only the
 * presentation layer was migrated.
 */

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import { signUpWithEmail } from '../../lib/auth';
import { PaperBackground } from '../../components/paper';
import {
  AuthBackButton,
  AuthField,
  AuthHeader,
  AuthPrimaryButton,
  AuthTextLink,
} from '../../components/paper/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_COOLDOWN_MINUTES = 15;
const RATE_LIMIT_STORAGE_KEY = 'signup_rate_limit_until';

type FieldStatus = 'idle' | 'valid' | 'invalid';

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailStatus, setEmailStatus] = useState<FieldStatus>('idle');
  const [emailError, setEmailError] = useState('');
  const [confirmStatus, setConfirmStatus] = useState<FieldStatus>('idle');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const emailDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore cooldown from storage on mount, then count down every second (no async in interval so UI updates reliably)
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY);
      const until = raw ? parseInt(raw, 10) : 0;
      const now = Date.now();
      if (until > now) {
        setCooldownSeconds(Math.ceil((until - now) / 1000));
      }
    })();

    const id = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 0) return 0;
        const next = prev - 1;
        if (next <= 0) {
          AsyncStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Real-time email FORMAT only. We do NOT check "does email exist" via API —
  // Supabase returns "invalid credentials" for both unknown email and wrong
  // password, so we cannot reliably tell. Duplicate accounts are detected only
  // when the user submits and signUp returns the existing-account response.
  const validateEmailFormat = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      setEmailStatus('idle');
      setEmailError('');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailStatus('invalid');
      setEmailError('Invalid email address');
      return;
    }
    setEmailStatus('valid');
    setEmailError('');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailStatus('idle');
    setEmailError('');
    if (emailDebounce.current) clearTimeout(emailDebounce.current);
    emailDebounce.current = setTimeout(() => validateEmailFormat(value), 400);
  };

  useEffect(() => {
    return () => {
      if (emailDebounce.current) clearTimeout(emailDebounce.current);
    };
  }, []);

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    if (!value) { setConfirmStatus('idle'); return; }
    setConfirmStatus(value === password ? 'valid' : 'invalid');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword) {
      setConfirmStatus(confirmPassword === value ? 'valid' : 'invalid');
    }
  };

  const handleSignUp = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (cooldownSeconds > 0) {
      const m = Math.floor(cooldownSeconds / 60);
      const s = cooldownSeconds % 60;
      Alert.alert(
        'Please wait',
        `Too many sign-up attempts. Try again in ${m}:${s.toString().padStart(2, '0')}.`,
      );
      return;
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      Alert.alert('Check your details', 'Please enter a valid email address.');
      return;
    }
    if (emailStatus === 'invalid') {
      Alert.alert('Check your details', emailError || 'Please fix your email.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Check your details', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Check your details', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUpWithEmail(trimmedEmail, password);

      if (error) {
        const msg = (error.message || '').toLowerCase();
        const isRateLimit =
          msg.includes('rate limit') || msg.includes('429') || msg.includes('too many');
        const isAlreadyRegistered =
          msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already');

        if (isRateLimit) {
          const raw = await AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY);
          const existingUntil = raw ? parseInt(raw, 10) : 0;
          const now = Date.now();
          if (existingUntil <= now) {
            const until = now + RATE_LIMIT_COOLDOWN_MINUTES * 60 * 1000;
            await AsyncStorage.setItem(RATE_LIMIT_STORAGE_KEY, String(until));
            setCooldownSeconds(RATE_LIMIT_COOLDOWN_MINUTES * 60);
          }
          Alert.alert(
            'Email limit reached',
            'Sign-up emails are limited to 3 per hour. Try again in about an hour, or use Sign in with Apple to continue now.',
          );
        } else if (isAlreadyRegistered) {
          setEmailStatus('invalid');
          setEmailError('An account with this email already exists');
          Alert.alert(
            'Account already exists',
            'An account with this email already exists. Please sign in or reset your password.',
            [
              { text: 'Sign In', onPress: () => router.replace('/(auth)/sign-in') },
              { text: 'Cancel', style: 'cancel' },
            ],
          );
        } else {
          Alert.alert('Sign Up Failed', error.message);
        }
        return;
      }

      if (data.user && !data.session) {
        const isExistingAccount =
          data.user.email_confirmed_at != null ||
          (data.user.identities && data.user.identities.length === 0);

        if (isExistingAccount) {
          setEmailStatus('invalid');
          setEmailError('An account with this email already exists');
          Alert.alert(
            'Account already exists',
            'An account with this email already exists. Please sign in or reset your password.',
            [
              { text: 'Sign In', onPress: () => router.replace('/(auth)/sign-in') },
              { text: 'Cancel', style: 'cancel' },
            ],
          );
        } else {
          // New unverified account — go to verify screen.
          // Pass the email as a param so the verify screen can show it and resend.
          // Do NOT set session here — route guard must not fire until email verified.
          router.push({ pathname: '/(auth)/verify-email', params: { email: trimmedEmail } });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    cooldownSeconds === 0 &&
    emailStatus === 'valid' &&
    password.length >= 8 &&
    confirmStatus === 'valid' &&
    !loading;

  const cooldownLabel =
    cooldownSeconds > 0
      ? `TRY AGAIN IN ${Math.floor(cooldownSeconds / 60)}:${(cooldownSeconds % 60).toString().padStart(2, '0')}`
      : null;

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
                eyebrow="— FINFINDR · NEW ACCOUNT —"
                title={'Create\naccount.'}
                subtitle="Join FinFindr and start catching more fish with AI-driven intel for every cast."
              />
            </View>

            <View style={styles.form}>
              <AuthField
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                status={emailStatus === 'idle' ? undefined : emailStatus}
                errorText={emailStatus === 'invalid' ? emailError : undefined}
              />

              <AuthField
                label="Password"
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="At least 8 characters"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
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

              <AuthField
                label="Confirm password"
                value={confirmPassword}
                onChangeText={handleConfirmChange}
                placeholder="Re-enter your password"
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                status={confirmStatus === 'idle' ? undefined : confirmStatus}
                errorText={confirmStatus === 'invalid' ? 'Passwords do not match' : undefined}
                successText={confirmStatus === 'valid' ? 'Passwords match' : undefined}
                reserveTrailingSpace
                trailing={
                  <Pressable
                    onPress={() => setShowConfirm((v) => !v)}
                    hitSlop={8}
                  >
                    {confirmStatus === 'valid' ? (
                      <Ionicons name="checkmark-circle" size={18} color={paper.forest} />
                    ) : confirmStatus === 'invalid' ? (
                      <Ionicons name="close-circle" size={18} color={paper.red} />
                    ) : (
                      <Ionicons
                        name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={paper.ink}
                      />
                    )}
                  </Pressable>
                }
              />

              <Text style={styles.tosText}>
                By creating an account you agree to our{' '}
                <Text style={styles.tosLink}>Terms of Service</Text> and{' '}
                <Text style={styles.tosLink}>Privacy Policy</Text>.
              </Text>
            </View>

            <View style={styles.actions}>
              <AuthPrimaryButton
                label={cooldownLabel ?? 'Create account'}
                loading={loading}
                loadingLabel="CREATING ACCOUNT…"
                disabled={!canSubmit}
                onPress={handleSignUp}
              />

              <AuthTextLink
                leadText="Already have an account?"
                linkText="SIGN IN"
                onPress={() => router.replace('/(auth)/sign-in')}
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
    gap: paperSpacing.xl,
  },
  topSection: {
    gap: paperSpacing.xl,
  },
  form: {
    gap: paperSpacing.md,
  },
  tosText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.65,
    lineHeight: 18,
    marginTop: paperSpacing.xs,
  },
  tosLink: {
    fontFamily: paperFonts.bodyBold,
    color: paper.forest,
    opacity: 1,
    letterSpacing: 0.3,
  },
  actions: {
    gap: paperSpacing.sm,
  },
});
