import { useState, useEffect, useRef } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { signUpWithEmail } from '../../lib/auth';

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

  // Real-time confirm password match
  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    if (!value) { setConfirmStatus('idle'); return; }
    setConfirmStatus(value === password ? 'valid' : 'invalid');
  };

  // Also re-evaluate confirm when password changes
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

  // Derived border colors
  const emailBorderColor =
    emailStatus === 'valid' ? colors.sage :
    emailStatus === 'invalid' ? '#E05C5C' :
    colors.border;

  const confirmBorderColor =
    confirmStatus === 'valid' ? colors.sage :
    confirmStatus === 'invalid' ? '#E05C5C' :
    colors.border;

  const canSubmit =
    cooldownSeconds === 0 &&
    emailStatus === 'valid' &&
    password.length >= 8 &&
    confirmStatus === 'valid' &&
    !loading;

  const cooldownLabel =
    cooldownSeconds > 0
      ? `Try again in ${Math.floor(cooldownSeconds / 60)}:${(cooldownSeconds % 60).toString().padStart(2, '0')}`
      : null;

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
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Join TightLines AI and start catching more fish.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon, { borderColor: emailBorderColor }]}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                />
                <View style={styles.inputIcon}>
                  {emailStatus === 'valid' && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.sage} />
                  )}
                  {emailStatus === 'invalid' && (
                    <Ionicons name="close-circle" size={20} color="#E05C5C" />
                  )}
                </View>
              </View>
              {emailStatus === 'invalid' && emailError ? (
                <Text style={styles.fieldError}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="At least 8 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn} hitSlop={8}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { borderColor: confirmBorderColor },
                  ]}
                  value={confirmPassword}
                  onChangeText={handleConfirmChange}
                  placeholder="Re-enter your password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
                <Pressable onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn} hitSlop={8}>
                  {confirmStatus === 'valid' ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.sage} />
                  ) : confirmStatus === 'invalid' ? (
                    <Ionicons name="close-circle" size={20} color="#E05C5C" />
                  ) : (
                    <Ionicons
                      name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                    />
                  )}
                </Pressable>
              </View>
              {confirmStatus === 'invalid' && (
                <Text style={styles.fieldError}>Passwords do not match</Text>
              )}
              {confirmStatus === 'valid' && (
                <Text style={styles.fieldSuccess}>Passwords match</Text>
              )}
            </View>

            <Text style={styles.tosText}>
              By creating an account you agree to our{' '}
              <Text style={styles.tosLink}>Terms of Service</Text> and{' '}
              <Text style={styles.tosLink}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Action */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                styles.btnPrimary,
                pressed && canSubmit && styles.btnPrimaryPressed,
                (!canSubmit || loading) && styles.btnDisabled,
              ]}
              onPress={handleSignUp}
              disabled={!canSubmit || loading}
            >
              <Text style={styles.btnPrimaryText}>
                {loading ? 'Creating account…' : cooldownLabel ?? 'Create Account'}
              </Text>
            </Pressable>

            <Pressable style={styles.switchLink} onPress={() => router.replace('/(auth)/sign-in')}>
              <Text style={styles.switchText}>
                Already have an account?{' '}
                <Text style={styles.switchTextBold}>Sign in</Text>
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
  inputRow: { position: 'relative' },
  inputWithIcon: { paddingRight: 48 },
  inputIcon: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
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
  fieldError: { fontSize: 12, color: '#E05C5C', marginTop: 2 },
  fieldSuccess: { fontSize: 12, color: colors.sage, marginTop: 2 },

  tosText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  tosLink: { color: colors.sage, fontWeight: '500' },

  actions: { gap: spacing.sm },
  btn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: colors.sage },
  btnPrimaryPressed: { backgroundColor: colors.sageDark },
  btnPrimaryText: { fontSize: 16, fontWeight: '600', color: colors.textLight },
  btnDisabled: { opacity: 0.45 },

  switchLink: { alignItems: 'center', paddingTop: spacing.sm },
  switchText: { fontSize: 14, color: colors.textSecondary },
  switchTextBold: { fontWeight: '600', color: colors.sage },
});
