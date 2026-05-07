/**
 * Onboarding Step 1 — Welcome.
 *
 * Visual migration into the FinFindr paper system. Behavior is unchanged:
 * the back button still prompts the user with `Alert.alert("Leave setup?")`
 * and signs them out via `useAuthStore.signOut()`; "Get Started" still
 * routes to `/(onboarding)/step-2-preferences`.
 *
 * Visual structure (matches the rest of the paper screens):
 *   • Editorial nav header (BACK chip + "FINFINDR · ONBOARDING" + step pill).
 *   • Step indicator (3 dots, the active one elongated).
 *   • Hero: SectionEyebrow + Fraunces title + italic subhead.
 *   • Three feature cards using the paper card language (forest accent
 *     icons, ink hairline borders, Fraunces titles, italic descriptions).
 *   • Primary forest CTA with paper hard-shadow.
 *
 * No business logic changed.
 */

import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  PaperBackground,
  PaperNavHeader,
  SectionEyebrow,
} from '../../components/paper';
import { hapticImpact, ImpactFeedbackStyle } from '../../lib/safeHaptics';
import { useAuthStore } from '../../store/authStore';

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
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
      "You'll be signed out and can sign in again later.",
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="WELCOME"
          onBack={handleBack}
          right={<StepPill step={1} total={3} />}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eyebrowRow}>
            <SectionEyebrow dashes size={11} color={paper.red}>
              YOUR FISHING COMPANION
            </SectionEyebrow>
          </View>

          <Text style={styles.heroTitle}>
            Welcome to{'\n'}<Text style={styles.heroTitleBrand}>FINFINDR</Text>
            <Text style={styles.heroDot}>.</Text>
          </Text>
          <Text style={styles.heroLede}>
            Let&apos;s get your first read and tackle picks set up around the
            water you fish.
          </Text>

          {/* Feature cards */}
          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.icon} style={styles.featureCard}>
                <View style={styles.featureBadge}>
                  <Ionicons name={f.icon} size={20} color={paper.paper} />
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
              styles.cta,
              pressed && styles.ctaPressed,
            ]}
            onPress={() => {
              hapticImpact(ImpactFeedbackStyle.Medium);
              router.push('/(onboarding)/step-2-preferences');
            }}
          >
            <Text style={styles.ctaText}>GET STARTED</Text>
            <Ionicons name="arrow-forward" size={16} color={paper.paper} />
          </Pressable>

          <Text style={styles.footnote}>
            — STEP 1 OF 3 ·  TAKES ABOUT A MINUTE —
          </Text>
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

/**
 * StepPill — small "STEP 1 / 3" badge that lives in the right slot of
 * the paper nav header. Reused across all three onboarding steps via
 * the same anatomy so the chrome stays consistent screen-to-screen.
 */
function StepPill({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.stepPill}>
      <Text style={styles.stepPillText}>
        STEP {step} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },

  eyebrowRow: { marginBottom: paperSpacing.md },

  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 38,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -1.4,
    lineHeight: 42,
    marginBottom: paperSpacing.xs,
  },
  heroTitleBrand: {
    color: paper.ink,
  },
  heroDot: { color: paper.red },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.ink,
    opacity: 0.75,
    lineHeight: 22,
    marginBottom: paperSpacing.section,
  },

  features: {
    gap: paperSpacing.md,
    marginBottom: paperSpacing.section,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    padding: paperSpacing.md,
    gap: paperSpacing.md,
    alignItems: 'flex-start',
    ...paperShadows.hard,
  },
  featureBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paper.ink,
    backgroundColor: paper.forest,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  featureDesc: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.72,
    lineHeight: 18,
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.forest,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.md,
    ...paperShadows.hard,
  },
  ctaPressed: { backgroundColor: paper.forestDk },
  ctaText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.paper,
    letterSpacing: 2.8,
  },

  footnote: {
    marginTop: paperSpacing.md,
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 2.2,
    textAlign: 'center',
  },

  stepPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paperLight,
  },
  stepPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.ink,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
});
