/**
 * Sign-up screen — FinFindr paper edition (premium intake form).
 *
 * Validation, rate-limit, duplicate-account handling, and navigation
 * behavior are preserved EXACTLY from the previous version. Only the
 * presentation layer was rebuilt to match the renovated welcome screen.
 *
 * Visual intent
 *  - Light "account signal" masthead with dashboard-style scan lines,
 *    live status, feature metrics, and a topographic backdrop.
 *  - Three-step progress beacon so the user sees the path:
 *    SECURE → VERIFY → DASHBOARD.
 *  - Compact intelligence preview cards for Today's Bite, Tackle Box,
 *    and Water Read before the account fields.
 *  - Each form field is presented as a numbered secure setup line.
 *  - Edition stamp + trust line at the bottom (preserved).
 *
 * No business logic touched.
 */

import { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TextInput,
  type TextInputProps,
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
import {
  EMAIL_REGEX,
  isSignUpEmailFormatAcceptable,
} from '../../lib/emailValidation';
import {
  AUTH_EMAIL_COOLDOWN_SECONDS,
  SIGNUP_VERIFICATION_EMAIL_COOLDOWN_KEY,
  clearAuthEmailCooldown,
  readAuthEmailCooldownSeconds,
  setAuthEmailCooldown,
} from '../../lib/authEmailCooldown';
import {
  getPasswordValidationError,
  isPasswordValid,
  PASSWORD_POLICY_LABEL,
} from '../../lib/passwordValidation';
import { TopographicLines } from '../../components/paper';
import {
  AuthBackButton,
  AuthFooterStamp,
  AuthNotice,
  AuthPrimaryButton,
  AuthTextLink,
} from '../../components/paper/auth';

const RATE_LIMIT_COOLDOWN_MINUTES = 15;
const RATE_LIMIT_STORAGE_KEY = 'signup_rate_limit_until';

type FieldStatus = 'idle' | 'valid' | 'invalid';
type Notice = {
  title: string;
  message?: string;
  tone?: 'info' | 'success' | 'error';
  actionLabel?: string;
  onAction?: () => void;
};

const STEPS: { numeral: string; label: string }[] = [
  { numeral: '01', label: 'SECURE' },
  { numeral: '02', label: 'VERIFY' },
  { numeral: '03', label: 'DASHBOARD' },
];

const INTELLIGENCE_PREVIEW: {
  code: string;
  title: string;
  caption: string;
  iconName: keyof typeof Ionicons.glyphMap;
  accent: string;
}[] = [
  {
    code: '01',
    title: "Today's Bite",
    caption: 'Daily score and timing windows',
    iconName: 'analytics-outline',
    accent: paper.bandPrime,
  },
  {
    code: '02',
    title: 'Tackle Box',
    caption: 'Condition-matched lure and fly picks',
    iconName: 'fish-outline',
    accent: paper.dashboardBlue,
  },
  {
    code: '03',
    title: 'Water Read',
    caption: 'Structure guidance for supported waters',
    iconName: 'map-outline',
    accent: paper.bandFair,
  },
];

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  const [emailStatus, setEmailStatus] = useState<FieldStatus>('idle');
  const [emailError, setEmailError] = useState('');
  const [confirmStatus, setConfirmStatus] = useState<FieldStatus>('idle');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [verificationCooldownSeconds, setVerificationCooldownSeconds] = useState(0);
  const [notice, setNotice] = useState<Notice | null>(null);

  const emailDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live pulse on the eyebrow dot
  const livePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(livePulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [livePulse]);

  // Restore cooldown from storage on mount, then count down every second
  useEffect(() => {
    (async () => {
      const [raw, verificationSeconds] = await Promise.all([
        AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY),
        readAuthEmailCooldownSeconds(SIGNUP_VERIFICATION_EMAIL_COOLDOWN_KEY),
      ]);
      const until = raw ? parseInt(raw, 10) : 0;
      const now = Date.now();
      if (until > now) {
        setCooldownSeconds(Math.ceil((until - now) / 1000));
      }
      setVerificationCooldownSeconds(verificationSeconds);
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
      setVerificationCooldownSeconds((prev) => {
        if (prev <= 0) return 0;
        const next = prev - 1;
        if (next <= 0) {
          void clearAuthEmailCooldown(SIGNUP_VERIFICATION_EMAIL_COOLDOWN_KEY);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

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
    if (!isSignUpEmailFormatAcceptable(trimmed)) {
      setEmailStatus('invalid');
      setEmailError(
        'Use a major email provider (Gmail, Yahoo, Outlook, iCloud, etc.)',
      );
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
    setNotice(null);

    if (cooldownSeconds > 0) {
      const m = Math.floor(cooldownSeconds / 60);
      const s = cooldownSeconds % 60;
      setNotice({
        title: 'Please wait',
        message: `Too many sign-up attempts. Try again in ${m}:${s.toString().padStart(2, '0')}.`,
        tone: 'error',
      });
      return;
    }
    if (verificationCooldownSeconds > 0) {
      const m = Math.floor(verificationCooldownSeconds / 60);
      const s = verificationCooldownSeconds % 60;
      setNotice({
        title: 'Verification email sent',
        message: `Please wait ${m}:${s.toString().padStart(2, '0')} before sending another verification email from this device.`,
        tone: 'info',
      });
      return;
    }
    if (!trimmedEmail || !isSignUpEmailFormatAcceptable(trimmedEmail)) {
      setNotice({
        title: 'Check your details',
        message: 'Enter a valid email from a supported provider (Gmail, Yahoo, Outlook, iCloud, etc.).',
        tone: 'error',
      });
      return;
    }
    if (emailStatus === 'invalid') {
      setNotice({
        title: 'Check your details',
        message: emailError || 'Please fix your email.',
        tone: 'error',
      });
      return;
    }
    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setNotice({
        title: 'Check your details',
        message: passwordError,
        tone: 'error',
      });
      return;
    }
    if (password !== confirmPassword) {
      setNotice({
        title: 'Check your details',
        message: 'Passwords do not match.',
        tone: 'error',
      });
      return;
    }
    if (!acceptedLegal) {
      setNotice({
        title: 'Terms required',
        message: 'Review and accept the Terms of Service and Privacy Policy before creating your account.',
        tone: 'error',
      });
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
          setNotice({
            title: 'Email limit reached',
            message: 'Sign-up emails are limited to 3 per hour. Try again in about an hour, or use Sign in with Apple to continue now.',
            tone: 'error',
          });
        } else if (isAlreadyRegistered) {
          setEmailStatus('invalid');
          setEmailError('An account with this email already exists');
          setNotice({
            title: 'Account already exists',
            message: 'An account with this email already exists. Please sign in or reset your password.',
            tone: 'error',
            actionLabel: 'Sign in',
            onAction: () => router.replace('/(auth)/sign-in'),
          });
        } else {
          setNotice({ title: 'Sign up failed', message: error.message, tone: 'error' });
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
          setNotice({
            title: 'Account already exists',
            message: 'An account with this email already exists. Please sign in or reset your password.',
            tone: 'error',
            actionLabel: 'Sign in',
            onAction: () => router.replace('/(auth)/sign-in'),
          });
        } else {
          await setAuthEmailCooldown(
            SIGNUP_VERIFICATION_EMAIL_COOLDOWN_KEY,
            AUTH_EMAIL_COOLDOWN_SECONDS,
          );
          setVerificationCooldownSeconds(AUTH_EMAIL_COOLDOWN_SECONDS);
          router.push({ pathname: '/(auth)/verify-email', params: { email: trimmedEmail } });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    cooldownSeconds === 0 &&
    verificationCooldownSeconds === 0 &&
    emailStatus === 'valid' &&
    isPasswordValid(password) &&
    confirmStatus === 'valid' &&
    acceptedLegal &&
    !loading;

  const cooldownLabel =
    cooldownSeconds > 0
      ? `TRY AGAIN IN ${Math.floor(cooldownSeconds / 60)}:${(cooldownSeconds % 60).toString().padStart(2, '0')}`
      : verificationCooldownSeconds > 0
        ? `VERIFY AGAIN IN ${Math.floor(verificationCooldownSeconds / 60)}:${(verificationCooldownSeconds % 60).toString().padStart(2, '0')}`
        : null;

  // Edition rubric
  const today = new Date();
  const editionMonth = today
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const editionYear = today.getFullYear();

  return (
    <View style={styles.root}>
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
            {/* ─── Top rail: back chip + edition rubric ──────────────── */}
            <View style={styles.topRail}>
              <AuthBackButton onPress={() => router.back()} />
              <Text style={styles.editionRubric}>
                {editionMonth} {editionYear}
              </Text>
            </View>

            {/* ─── Hero — account signal masthead ──────────────────────── */}
            <View style={styles.hero}>
              <TopographicLines
                style={styles.heroTopo}
                color={paper.dashboardInk}
                count={5}
              />

              <View style={styles.heroGrid} pointerEvents="none">
                <View style={[styles.heroGridLine, { top: '34%' }]} />
                <View style={[styles.heroGridLine, { top: '68%' }]} />
                <View style={[styles.heroGridCol, { left: '36%' }]} />
                <View style={[styles.heroGridCol, { left: '72%' }]} />
              </View>

              <View style={styles.heroTopRow}>
                <View style={styles.heroBrandRow}>
                  <Image
                    source={require('../../assets/images/finfindr-logo.png')}
                    style={styles.heroEmblem}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.heroWordmark}>
                      FinFindr<Text style={styles.heroTitleDot}>.</Text>
                    </Text>
                    <Text style={styles.heroRubricText}>ACCOUNT SIGNAL</Text>
                  </View>
                </View>

                <View style={styles.liveBadge}>
                  <Animated.View
                    style={[styles.liveBadgeDot, { opacity: livePulse }]}
                  />
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              </View>

              <Text style={styles.heroKicker}>FISHING INTELLIGENCE</Text>
              <Text style={styles.heroTitle}>
                Build your{'\n'}
                <Text style={styles.heroTitleItalic}>angler dashboard</Text>
                <Text style={styles.heroTitleDot}>.</Text>
              </Text>

              <Text style={styles.heroDek}>
                One secure sign-in unlocks your daily read, forecast preview,
                tackle signals, and supported-water structure.
              </Text>

              <View style={styles.heroMetricRow}>
                <View style={styles.heroMetric}>
                  <Text style={styles.heroMetricValue}>7.0</Text>
                  <Text style={styles.heroMetricLabel}>SCORE</Text>
                </View>
                <View style={styles.heroMetric}>
                  <Text style={styles.heroMetricValue}>6</Text>
                  <Text style={styles.heroMetricLabel}>DAYS</Text>
                </View>
                <View style={styles.heroMetric}>
                  <Text style={styles.heroMetricValue}>3</Text>
                  <Text style={styles.heroMetricLabel}>MODULES</Text>
                </View>
              </View>
            </View>

            {/* ─── Step beacons — 01 SECURE · 02 VERIFY · 03 DASHBOARD ─── */}
            <View style={styles.beacons}>
              {STEPS.map((step, idx) => {
                const isActive = idx === 0;
                const isPast = idx < 0;
                return (
                  <View key={step.numeral} style={styles.beaconCol}>
                    <View
                      style={[
                        styles.beaconDot,
                        isActive && styles.beaconDotActive,
                        isPast && styles.beaconDotPast,
                      ]}
                    >
                      <Text
                        style={[
                          styles.beaconNumeral,
                          (isActive || isPast) && styles.beaconNumeralActive,
                        ]}
                      >
                        {step.numeral}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.beaconLabel,
                        isActive && styles.beaconLabelActive,
                      ]}
                    >
                      {step.label}
                    </Text>
                    {idx < STEPS.length - 1 ? (
                      <View
                        style={[
                          styles.beaconConnector,
                          isActive && styles.beaconConnectorActive,
                        ]}
                      />
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View style={styles.previewPanel}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewEyebrow}>WHAT OPENS NEXT</Text>
                <Text style={styles.previewCount}>3 SIGNALS</Text>
              </View>
              <View style={styles.previewDeck}>
                {INTELLIGENCE_PREVIEW.map((item) => (
                  <IntelligencePreviewCard key={item.code} item={item} />
                ))}
              </View>
            </View>

            {/* ─── Form — numbered intake lines ────────────────────────── */}
            <View style={styles.form}>
              {notice ? (
                <AuthNotice
                  title={notice.title}
                  message={notice.message}
                  tone={notice.tone}
                  actionLabel={notice.actionLabel}
                  onAction={notice.onAction}
                />
              ) : null}

              <IntakeLine
                ordinal="01"
                label="EMAIL"
                hint="Where we'll send your verification link"
                status={emailStatus}
                error={emailStatus === 'invalid' ? emailError : undefined}
              >
                <FieldInput
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  status={emailStatus}
                />
              </IntakeLine>

              <IntakeLine
                ordinal="02"
                label="PASSWORD"
                hint={`Secure access. ${PASSWORD_POLICY_LABEL}`}
              >
                <FieldInput
                  value={password}
                  onChangeText={handlePasswordChange}
                  placeholder="create password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  trailing={
                    <Pressable
                      onPress={() => setShowPassword((v) => !v)}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={paper.dashboardInk}
                      />
                    </Pressable>
                  }
                />
              </IntakeLine>

              <IntakeLine
                ordinal="03"
                label="CONFIRM"
                hint="One more check before the dashboard"
                status={confirmStatus}
                error={confirmStatus === 'invalid' ? 'Passwords do not match' : undefined}
                success={confirmStatus === 'valid' ? 'Passwords match' : undefined}
              >
                <FieldInput
                  value={confirmPassword}
                  onChangeText={handleConfirmChange}
                  placeholder="confirm password"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                  status={confirmStatus}
                  trailing={
                    <Pressable
                      onPress={() => setShowConfirm((v) => !v)}
                      hitSlop={8}
                    >
                      {confirmStatus === 'valid' ? (
                        <Ionicons name="checkmark-circle" size={18} color={paper.bandPrime} />
                      ) : confirmStatus === 'invalid' ? (
                        <Ionicons name="close-circle" size={18} color={paper.bandTough} />
                      ) : (
                        <Ionicons
                          name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                          size={18}
                          color={paper.dashboardInk}
                        />
                      )}
                    </Pressable>
                  }
                />
              </IntakeLine>

              <Pressable
                style={({ pressed }) => [
                  styles.legalConsentRow,
                  acceptedLegal && styles.legalConsentRowAccepted,
                  pressed && styles.legalConsentRowPressed,
                ]}
                onPress={() => setAcceptedLegal((v) => !v)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acceptedLegal }}
                accessibilityLabel="Accept Terms of Service and Privacy Policy"
              >
                <View
                  style={[
                    styles.legalCheckbox,
                    acceptedLegal && styles.legalCheckboxAccepted,
                  ]}
                >
                  {acceptedLegal ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : null}
                </View>
                <Text style={styles.tosText}>
                  I have read and agree to the{' '}
                  <Text
                    style={styles.tosLink}
                    onPress={(event) => {
                      event.stopPropagation();
                      router.push('/legal/terms');
                    }}
                  >
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text
                    style={styles.tosLink}
                    onPress={(event) => {
                      event.stopPropagation();
                      router.push('/legal/privacy');
                    }}
                  >
                    Privacy Policy
                  </Text>.
                </Text>
              </Pressable>
            </View>

            {/* ─── Actions ───────────────────────────────────────────────── */}
            <View style={styles.actions}>
              <AuthPrimaryButton
                label={cooldownLabel ?? 'Create account'}
                loading={loading}
                loadingLabel="CREATING ACCOUNT…"
                disabled={!canSubmit}
                onPress={handleSignUp}
              />

              {/* Trust strip */}
              <View style={styles.trustStrip}>
                <View style={styles.trustItem}>
                  <Ionicons name="lock-closed-outline" size={11} color={paper.dashboardInk} />
                  <Text style={styles.trustText}>ENCRYPTED</Text>
                </View>
                <View style={styles.trustDivider} />
                <View style={styles.trustItem}>
                  <Ionicons name="shield-checkmark-outline" size={11} color={paper.dashboardInk} />
                  <Text style={styles.trustText}>NO RESALE</Text>
                </View>
                <View style={styles.trustDivider} />
                <View style={styles.trustItem}>
                  <Ionicons name="boat-outline" size={11} color={paper.dashboardInk} />
                  <Text style={styles.trustText}>ANGLER-OWNED</Text>
                </View>
              </View>

              <AuthTextLink
                leadText="Already have an account?"
                linkText="SIGN IN"
                onPress={() => router.replace('/(auth)/sign-in')}
              />
            </View>

            <AuthFooterStamp />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ─── Inline primitives ───────────────────────────────────────────────────

/**
 * IntakeLine — a labeled "field requisition" row. Hairline numbered
 * ordinal on the left ("01" / "02" / "03") with a faint blue rule
 * underneath, then a label + italic hint, the input itself, and a
 * tonal status message on the bottom.
 */
function IntakeLine({
  ordinal,
  label,
  hint,
  status,
  error,
  success,
  children,
}: {
  ordinal: string;
  label: string;
  hint?: string;
  status?: FieldStatus;
  error?: string;
  success?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.line}>
      <View style={styles.lineHeader}>
        <View style={styles.lineOrdinalCol}>
          <Text style={styles.lineOrdinal}>{ordinal}</Text>
          <View style={styles.lineOrdinalRule} />
        </View>
        <View style={styles.lineLabelWrap}>
          <Text style={styles.lineLabel}>{label}</Text>
          {hint ? <Text style={styles.lineHint}>{hint}</Text> : null}
        </View>
        <View style={styles.lineStatusCap}>
          {status === 'valid' ? (
            <Ionicons name="checkmark" size={11} color={paper.bandPrime} />
          ) : status === 'invalid' ? (
            <Ionicons name="close" size={11} color={paper.bandTough} />
          ) : (
            <Text style={styles.lineStatusEllipsis}>···</Text>
          )}
        </View>
      </View>
      <View style={styles.lineInputWrap}>{children}</View>
      {error ? (
        <Text style={styles.lineError}>{error}</Text>
      ) : success ? (
        <Text style={styles.lineSuccess}>{success}</Text>
      ) : null}
    </View>
  );
}

function IntelligencePreviewCard({
  item,
}: {
  item: (typeof INTELLIGENCE_PREVIEW)[number];
}) {
  return (
    <View style={styles.previewCard}>
      <View style={[styles.previewIcon, { borderColor: item.accent }]}>
        <Ionicons name={item.iconName} size={17} color={item.accent} />
      </View>
      <Text style={styles.previewCode}>{item.code}</Text>
      <Text style={styles.previewTitle} numberOfLines={1} adjustsFontSizeToFit>
        {item.title}
      </Text>
      <Text style={styles.previewCaption} numberOfLines={2}>
        {item.caption}
      </Text>
    </View>
  );
}

/**
 * FieldInput — a small wrapper around the AuthField visuals so
 * IntakeLine can supply its own label + hint chrome above the input.
 * Borrows the border-tint pattern and trailing slot.
 */
function FieldInput({
  status,
  trailing,
  ...inputProps
}: TextInputProps & {
  status?: FieldStatus;
  trailing?: React.ReactNode;
}) {
  const borderColor =
    status === 'valid' ? paper.bandPrime
    : status === 'invalid' ? paper.bandTough
    : paper.dashboardLine;
  const showTrailing = trailing !== undefined;
  return (
    <View style={[styles.input, { borderColor }]}>
      <TextInput
        placeholderTextColor={paper.dashboardMuted}
        {...inputProps}
        style={[
          styles.inputText,
          showTrailing && styles.inputTextWithTrailing,
        ]}
      />
      {showTrailing ? (
        <View style={styles.trailingSlot} pointerEvents="box-none">
          {trailing}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xl + paperSpacing.lg,
    paddingTop: paperSpacing.sm,
    gap: paperSpacing.md,
  },

  // ── Top rail ──────────────────────────────────────────────────────────
  topRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editionRubric: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.5,
  },

  // ── Hero ──────────────────────────────────────────────────────────────
  hero: {
    position: 'relative',
    backgroundColor: '#FBFCFD',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(10,27,46,0.18)',
    paddingHorizontal: paperSpacing.md + 4,
    paddingTop: paperSpacing.md + 2,
    paddingBottom: paperSpacing.md + 4,
    overflow: 'hidden',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.18,
  },
  heroGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  heroGridLine: {
    position: 'absolute',
    left: paperSpacing.md,
    right: paperSpacing.md,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardHair,
  },
  heroGridCol: {
    position: 'absolute',
    top: paperSpacing.md,
    bottom: paperSpacing.md,
    width: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardHair,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
    zIndex: 1,
    marginBottom: paperSpacing.md,
  },
  heroBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    minWidth: 0,
  },
  heroEmblem: {
    width: 34,
    height: 44,
  },
  heroWordmark: {
    fontFamily: paperFonts.display,
    fontSize: 21,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 23,
  },
  heroRubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardBlue,
    letterSpacing: 2.1,
    marginTop: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(61,168,95,0.32)',
    backgroundColor: 'rgba(61,168,95,0.09)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  liveBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: paper.bandPrime,
  },
  liveBadgeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
  },
  heroKicker: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2.8,
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 36,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 4,
    zIndex: 1,
  },
  heroTitleItalic: {
    fontFamily: paperFonts.displayItalic,
    color: paper.dashboardInk,
  },
  heroTitleDot: {
    color: paper.dashboardBlue,
  },
  heroDek: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 20,
    marginTop: paperSpacing.sm,
    zIndex: 1,
  },
  heroMetricRow: {
    flexDirection: 'row',
    gap: paperSpacing.xs,
    marginTop: paperSpacing.md,
    zIndex: 1,
  },
  heroMetric: {
    flex: 1,
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(10,27,46,0.12)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 2,
    justifyContent: 'center',
  },
  heroMetricValue: {
    fontFamily: paperFonts.display,
    fontSize: 23,
    color: paper.dashboardInk,
    fontWeight: '700',
    lineHeight: 25,
  },
  heroMetricLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardBlue,
    letterSpacing: 1.7,
    marginTop: 1,
  },

  // ── Step beacons ──────────────────────────────────────────────────────
  beacons: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 2,
    marginTop: paperSpacing.xs,
  },
  beaconCol: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  beaconDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconDotActive: {
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlue,
  },
  beaconDotPast: {
    borderColor: paper.bandPrime,
    backgroundColor: paper.bandPrime,
  },
  beaconNumeral: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 0.5,
    opacity: 0.5,
  },
  beaconNumeralActive: {
    color: '#FFFFFF',
    opacity: 1,
  },
  beaconLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
    opacity: 0.55,
    marginTop: 4,
  },
  beaconLabelActive: {
    color: paper.dashboardBlue,
    opacity: 1,
  },
  beaconConnector: {
    position: 'absolute',
    top: 13,
    left: '60%',
    right: '-40%',
    height: 1,
    backgroundColor: paper.dashboardLine,
  },
  beaconConnectorActive: {
    backgroundColor: paper.dashboardBlue,
    opacity: 0.5,
  },

  // ── Intelligence preview ───────────────────────────────────────────────
  previewPanel: {
    gap: paperSpacing.sm,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  previewEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    letterSpacing: 2.3,
    opacity: 0.78,
  },
  previewCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardBlue,
    letterSpacing: 1.8,
  },
  previewDeck: {
    flexDirection: 'row',
    gap: paperSpacing.xs + 2,
  },
  previewCard: {
    flex: 1,
    minHeight: 104,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.xs + 2,
    paddingVertical: paperSpacing.sm,
    alignItems: 'center',
  },
  previewIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFB',
    marginBottom: 5,
  },
  previewCode: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardBlue,
    letterSpacing: 1.4,
    marginBottom: 3,
  },
  previewTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 0,
    lineHeight: 14,
    textAlign: 'center',
  },
  previewCaption: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.58,
    lineHeight: 13,
    textAlign: 'center',
    marginTop: 3,
  },

  // ── Form — intake lines ───────────────────────────────────────────────
  form: {
    gap: paperSpacing.md,
    marginTop: paperSpacing.xs,
  },
  line: {
    gap: paperSpacing.xs + 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: 'rgba(255,255,255,0.84)',
    paddingHorizontal: paperSpacing.sm + 2,
    paddingTop: paperSpacing.sm + 2,
    paddingBottom: paperSpacing.sm,
  },
  lineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
  },
  lineOrdinalCol: {
    width: 26,
    alignItems: 'center',
  },
  lineOrdinal: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    color: paper.dashboardBlue,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 16,
  },
  lineOrdinalRule: {
    width: 14,
    height: 1,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.5,
    marginTop: 2,
  },
  lineLabelWrap: {
    flex: 1,
    gap: 1,
  },
  lineLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
  },
  lineHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.55,
    lineHeight: 14,
  },
  lineStatusCap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineStatusEllipsis: {
    fontFamily: paperFonts.body,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.4,
    lineHeight: 11,
  },
  lineInputWrap: {
    paddingLeft: 0,
  },
  lineError: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11.5,
    color: paper.bandTough,
    letterSpacing: 0.1,
    paddingLeft: 34,
  },
  lineSuccess: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 11.5,
    color: paper.bandPrime,
    letterSpacing: 0.1,
    paddingLeft: 34,
  },

  // ── Inputs ────────────────────────────────────────────────────────────
  input: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: paper.dashboardWhite,
  },
  inputText: {
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: 13,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  inputTextWithTrailing: {
    paddingRight: 44,
  },
  trailingSlot: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── TOS ───────────────────────────────────────────────────────────────
  legalConsentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.74)',
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
    marginTop: paperSpacing.xs,
  },
  legalConsentRowAccepted: {
    borderColor: paper.dashboardBlue,
    backgroundColor: '#F6F9FB',
  },
  legalConsentRowPressed: {
    opacity: 0.86,
  },
  legalCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  legalCheckboxAccepted: {
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardBlue,
  },
  tosText: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.78,
    lineHeight: 18,
  },
  tosLink: {
    fontFamily: paperFonts.bodyBold,
    color: paper.dashboardBlue,
    opacity: 1,
    letterSpacing: 0.3,
  },

  // ── Actions ───────────────────────────────────────────────────────────
  actions: {
    gap: paperSpacing.sm,
  },
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    paddingTop: paperSpacing.xs,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
    opacity: 0.55,
  },
  trustDivider: {
    width: 1,
    height: 9,
    backgroundColor: paper.dashboardInk,
    opacity: 0.25,
  },
});
