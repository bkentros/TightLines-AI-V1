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
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { signUpWithEmail } from '../../lib/auth';

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      return 'Please enter a valid email address.';
    if (password.length < 8)
      return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSignUp = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Check your details', validationError);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUpWithEmail(
        email.trim().toLowerCase(),
        password,
      );

      if (error) {
        Alert.alert('Sign Up Failed', error.message);
        return;
      }

      if (data.user && !data.session) {
        // Email confirmation required
        router.push('/(auth)/verify-email');
      }
    } finally {
      setLoading(false);
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
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Join TightLines AI and start catching more fish.
            </Text>
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
                  placeholder="At least 8 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
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

            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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
                <Pressable
                  onPress={() => setShowConfirm((v) => !v)}
                  style={styles.eyeBtn}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
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
                pressed && styles.btnPrimaryPressed,
                loading && styles.btnDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.btnPrimaryText}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.switchLink}
              onPress={() => router.replace('/(auth)/sign-in')}
            >
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
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  tosText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
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
  btnDisabled: { opacity: 0.6 },

  switchLink: { alignItems: 'center', paddingTop: spacing.sm },
  switchText: { fontSize: 14, color: colors.textSecondary },
  switchTextBold: { fontWeight: '600', color: colors.sage },
});
