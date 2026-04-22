import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';

const FEATURES = [
  {
    icon: 'fish-outline',
    title: 'Condition-Based Picks',
    desc: 'Get ranked lure and fly suggestions tuned to weather, tide where available, and seasonal patterns.',
  },
  {
    icon: 'scan-outline',
    title: 'Water Reader',
    desc: 'Use photos or maps to spot structure, cover, and likely holding water.',
  },
  {
    icon: 'calendar-outline',
    title: 'Trip Planning',
    desc: 'Check the week ahead so you can pick better windows before you go.',
  },
];

export default function OnboardingStep1() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleBack = () => {
    Alert.alert(
      'Leave setup?',
      'You\'ll be signed out and can sign in again later.',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Back */}
        <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>

        {/* Progress indicator */}
        <View style={styles.progress}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.progressDot, i === 0 && styles.progressDotActive]}
            />
          ))}
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Ionicons name="fish" size={32} color={colors.sage} />
          </View>
          <Text style={styles.title}>Welcome to{'\n'}FINFINDR</Text>
          <View style={styles.accentLine} />
          <Text style={styles.subtitle}>
            Your fishing companion. Let&apos;s get your first read and tackle picks
            set up around the water you fish.
          </Text>
        </View>

        {/* Feature cards */}
        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.icon} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon as any} size={20} color={colors.sage} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            pressed && styles.btnPressed,
          ]}
          onPress={() => router.push('/(onboarding)/step-2-preferences')}
        >
          <Text style={styles.btnText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.textLight} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingTop: spacing.md,
    alignSelf: 'flex-start',
  },

  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  progressDotActive: { backgroundColor: colors.sage, width: 24 },

  hero: { alignItems: 'center', paddingTop: spacing.lg },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.sage + '40',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  accentLine: {
    width: 48,
    height: 3,
    backgroundColor: colors.sage,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },

  features: { gap: spacing.sm },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sage,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  btnPressed: { backgroundColor: colors.sageDark },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.textLight },
});
