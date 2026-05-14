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
 *   • Hero: dashboard eyebrow + Fraunces title + italic subhead.
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
  paperSpacing,
} from '../../lib/theme';
import { PaperNavHeader } from '../../components/paper';
import { hapticImpact, ImpactFeedbackStyle } from '../../lib/safeHaptics';
import { useAuthStore } from '../../store/authStore';

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  {
    icon: 'pulse-outline',
    title: 'The Daily Read',
    desc: "Today's score, best windows, and a straight answer on whether to go before you leave the truck.",
  },
  {
    icon: 'fish-outline',
    title: 'The Tackle Box',
    desc: 'Two lures and two flies, ranked for weather, water, and the season you fish.',
  },
  {
    icon: 'scan-outline',
    title: 'Water Read',
    desc: 'Pull a hydrography polygon for any supported lake and read the structure zones before you cast.',
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
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="WELCOME"
          onBack={handleBack}
          right={<StepPill step={1} total={2} />}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroPanel}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadge}>
                <Ionicons name="sparkles-outline" size={21} color={paper.dashboardCream} />
              </View>
              <View style={styles.heroKickerWrap}>
                <Text style={styles.pageEyebrow}>FISHING INTELLIGENCE</Text>
                <Text style={styles.heroMeta}>Built for the water you fish</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>
              Welcome to{'\n'}<Text style={styles.heroTitleBrand}>FINFINDR</Text>
              <Text style={styles.heroDot}>.</Text>
            </Text>
            <Text style={styles.heroLede}>
              Live conditions, forecast confidence, and tackle logic pulled
              into one clean read before you ever leave the house.
            </Text>

            <View style={styles.insightRail}>
              <View style={styles.insightCell}>
                <Text style={styles.insightValue}>01</Text>
                <Text style={styles.insightLabel}>Local read</Text>
              </View>
              <View style={styles.insightCell}>
                <Text style={styles.insightValue}>02</Text>
                <Text style={styles.insightLabel}>Bite score</Text>
              </View>
              <View style={styles.insightCell}>
                <Text style={styles.insightValue}>03</Text>
                <Text style={styles.insightLabel}>Tackle plan</Text>
              </View>
            </View>
          </View>

          {/* Feature cards */}
          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.icon} style={styles.featureCard}>
                <View style={styles.featureBadge}>
                  <Ionicons name={f.icon} size={20} color={paper.dashboardCream} />
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
            <Ionicons name="arrow-forward" size={16} color={paper.dashboardCream} />
          </Pressable>

          <Text style={styles.footnote}>
            — STEP 1 OF 2 ·  USERNAME & HOME WATER —
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/**
 * StepPill — small "STEP 1 / N" badge that lives in the right slot of
 * the paper nav header. Reused across onboarding steps.
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
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  flex: { flex: 1, backgroundColor: paper.dashboardCream },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  heroPanel: {
    backgroundColor: paper.dashboardInk,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: paperSpacing.lg,
    marginBottom: paperSpacing.xl,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  heroBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroKickerWrap: { flex: 1 },
  pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardBlueLight,
    fontWeight: '700',
  },
  heroMeta: {
    marginTop: 4,
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.68)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 40,
    color: paper.dashboardCream,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 43,
    marginBottom: paperSpacing.sm,
  },
  heroTitleBrand: {
    color: paper.dashboardCream,
  },
  heroDot: { color: paper.dashboardBlueLight },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 22,
    marginBottom: paperSpacing.lg,
  },
  insightRail: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  insightCell: {
    flex: 1,
    paddingVertical: paperSpacing.sm,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.12)',
  },
  insightValue: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardCream,
    fontWeight: '700',
    textAlign: 'center',
  },
  insightLabel: {
    marginTop: 2,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: 'rgba(255,255,255,0.58)',
    letterSpacing: 0.9,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  features: {
    gap: paperSpacing.md,
    marginBottom: paperSpacing.section,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    padding: paperSpacing.md,
    gap: paperSpacing.md,
    alignItems: 'flex-start',
      },
  featureBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardBlue,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontFamily: paperFonts.display,
    fontSize: 16,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 3,
  },
  featureDesc: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 18,
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardBlue,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
    borderRadius: 8,
    paddingVertical: paperSpacing.md,
      },
  ctaPressed: { backgroundColor: paper.dashboardBlue },
  ctaText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardCream,
    letterSpacing: 2.8,
  },

  footnote: {
    marginTop: paperSpacing.md,
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardInk,
    opacity: 0.55,
    letterSpacing: 2.2,
    textAlign: 'center',
  },

  stepPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  stepPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardCream,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
});
