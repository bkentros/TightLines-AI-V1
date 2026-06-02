/**
 * Onboarding Step 1 — Welcome (compact field-guide cover).
 *
 * Behavior: unchanged — back still prompts to sign out, "BEGIN" routes
 * to `/(onboarding)/step-2-preferences`.
 *
 * Design goals for this revision:
 *  - Everything fits on one screen, no scrolling required.
 *  - Cover card is compact: small emblem, short title, short dek.
 *  - Chapter preview icons on the right look like the actual app UI
 *    vocabulary — no foreign animations. Specifically:
 *      01 Today's Bite → a green score chip (same band + number style as
 *                        the dashboard hero score)
 *      02 Tackle Box  → two stacked lure-name pills (same style as the
 *                        recommender's lure chips)
 *      03 Water Read  → three nested contour ovals (static; matches the
 *                        map/structure visual from the water reader)
 *  - Only two animations remain: the live-pulse dot on the cover eyebrow
 *    and the shimmer sweep on the BEGIN button — both are used elsewhere
 *    in the app and feel native.
 */

import { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../../lib/theme';
import {
  BrandScopeStage,
  PaperNavHeader,
  TopographicLines,
} from '../../components/paper';
import { hapticImpact, ImpactFeedbackStyle } from '../../lib/safeHaptics';
import { useAuthStore } from '../../store/authStore';
import { useAuthScrollLayout } from '../../hooks/useAuthScrollLayout';

export default function OnboardingStep1() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { contentContainerStyle: scrollLayout } = useAuthScrollLayout('spread', 72);

  // Live pulse on the eyebrow dot
  const livePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(livePulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [livePulse]);

  // CTA shimmer
  const shimmerX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(1100),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerX]);

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

  const today = new Date();
  const editionMonth = today
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();
  const editionYear = today.getFullYear();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.root}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="WELCOME"
          onBack={handleBack}
          right={<StepPill step={1} total={1} />}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, scrollLayout]}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Compact cover card ──────────────────────────────────── */}
          <View style={styles.cover}>
            <TopographicLines
              style={styles.coverTopo}
              color={paper.dashboardInk}
              count={5}
            />

            <View style={styles.coverRubricRow}>
              <View style={styles.coverRubricRule} />
              <Text style={styles.coverRubricText}>
                FIELD GUIDE · NO. 001 · {editionMonth} {editionYear}
              </Text>
              <View style={styles.coverRubricRule} />
            </View>

            <View style={styles.coverMain}>
              {/* Scope-target stage — compact size */}
              <BrandScopeStage size={88} emblemSize={58} style={styles.coverStage} />

              <View style={styles.coverTextCol}>
                <View style={styles.coverEyebrowRow}>
                  <View style={styles.coverPulseDotWrap}>
                    <View style={styles.coverPulseDotRing} />
                    <Animated.View style={[styles.coverPulseDot, { opacity: livePulse }]} />
                  </View>
                  <Text style={styles.coverEyebrowText}>CH. 01 · WELCOME</Text>
                </View>
                <Text style={styles.coverTitle}>
                  Welcome to{'\n'}
                  <Text style={styles.coverTitleItalic}>FinFindr</Text>
                  <Text style={styles.coverTitleDot}>.</Text>
                </Text>
                <Text style={styles.coverDek}>
                  Built for the way you actually fish.
                </Text>
              </View>
            </View>
          </View>

          {/* ── "What's inside" masthead ──────────────────────────────── */}
          <View style={styles.mastheadRow}>
            <Text style={styles.mastheadText}>WHAT'S INSIDE</Text>
            <View style={styles.mastheadRule} />
            <Text style={styles.mastheadOrnament}>◆</Text>
          </View>

          {/* ── 3 compact chapter rows ────────────────────────────────── */}
          <View style={styles.chapters}>

            {/* Chapter I — Today's Bite */}
            <View style={[styles.chapterRow, { borderLeftColor: paper.bandPrime }]}>
              <View style={styles.chapterLeft}>
                <View style={[styles.chapterNumeralBadge, { borderColor: paper.bandPrime }]}>
                  <Text style={[styles.chapterNumeral, { color: paper.bandPrime }]}>01</Text>
                </View>
                <View style={styles.chapterTextCol}>
                  <Text style={styles.chapterTitle}>Today's Bite</Text>
                  <Text style={styles.chapterBlurb}>
                    Today's score, best windows, whether to go.
                  </Text>
                  <View style={[styles.chapterTagPill, { borderColor: `${paper.bandPrime}60`, backgroundColor: `${paper.bandPrime}14` }]}>
                    <Text style={[styles.chapterTagText, { color: paper.bandPrime }]}>SCORE · WINDOWS · WHY</Text>
                  </View>
                </View>
              </View>
              {/* In-app style: score chip (mirrors dashboard band display) */}
              <View style={styles.previewScoreChip}>
                <Text style={styles.previewScoreNumber}>78</Text>
                <Text style={styles.previewScoreLabel}>PRIME</Text>
              </View>
            </View>

            {/* Chapter II — The Tackle Box */}
            <View style={[styles.chapterRow, { borderLeftColor: paper.dashboardBlue }]}>
              <View style={styles.chapterLeft}>
                <View style={[styles.chapterNumeralBadge, { borderColor: paper.dashboardBlue }]}>
                  <Text style={[styles.chapterNumeral, { color: paper.dashboardBlue }]}>02</Text>
                </View>
                <View style={styles.chapterTextCol}>
                  <Text style={styles.chapterTitle}>The Tackle Box</Text>
                  <Text style={styles.chapterBlurb}>
                    Two lures, two flies — ranked for today.
                  </Text>
                  <View style={[styles.chapterTagPill, { borderColor: `${paper.dashboardBlue}60`, backgroundColor: `${paper.dashboardBlueSky}55` }]}>
                    <Text style={[styles.chapterTagText, { color: paper.dashboardBlue }]}>LURES · FLIES · COLORS</Text>
                  </View>
                </View>
              </View>
              {/* In-app style: lure-name pill stack (mirrors recommender chips) */}
              <View style={styles.previewLureStack}>
                <View style={styles.previewLureChip}>
                  <Ionicons name="ellipse" size={7} color={paper.dashboardBlue} />
                  <Text style={styles.previewLureText}>SPINNERBAIT</Text>
                </View>
                <View style={[styles.previewLureChip, { backgroundColor: `${paper.dashboardBlueSky}66` }]}>
                  <Ionicons name="ellipse" size={7} color={paper.dashboardBlue} style={{ opacity: 0.6 }} />
                  <Text style={[styles.previewLureText, { opacity: 0.7 }]}>WOOLY BUGGER</Text>
                </View>
              </View>
            </View>

            {/* Chapter III — Water Read */}
            <View style={[styles.chapterRow, { borderLeftColor: '#2A6E96' }]}>
              <View style={styles.chapterLeft}>
                <View style={[styles.chapterNumeralBadge, { borderColor: '#2A6E96' }]}>
                  <Text style={[styles.chapterNumeral, { color: '#2A6E96' }]}>03</Text>
                </View>
                <View style={styles.chapterTextCol}>
                  <Text style={styles.chapterTitle}>Water Read</Text>
                  <Text style={styles.chapterBlurb}>
                    Creates structure-related high-probability fishing zones for any supported lake.
                  </Text>
                  <View style={[styles.chapterTagPill, { borderColor: 'rgba(42,110,150,0.4)', backgroundColor: 'rgba(42,110,150,0.08)' }]}>
                    <Text style={[styles.chapterTagText, { color: '#2A6E96' }]}>STRUCTURE · COVER · HOLDING</Text>
                  </View>
                </View>
              </View>
              {/* In-app style: static contour rings (mirrors water reader map icon) */}
              <View style={styles.previewContour}>
                <View style={[styles.previewContourRing, { width: 54, height: 40, opacity: 0.22 }]} />
                <View style={[styles.previewContourRing, { width: 38, height: 28, opacity: 0.45, top: 6, left: 8 }]} />
                <View style={[styles.previewContourRing, { width: 22, height: 16, opacity: 0.78, top: 12, left: 16 }]} />
                <View style={styles.previewContourDot} />
              </View>
            </View>

          </View>

          {/* ── BEGIN CTA ─────────────────────────────────────────────── */}
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            onPress={() => {
              hapticImpact(ImpactFeedbackStyle.Medium);
              router.push('/(onboarding)/step-2-preferences');
            }}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                styles.ctaShimmer,
                {
                  transform: [
                    {
                      translateX: shimmerX.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-160, 360],
                      }),
                    },
                    { skewX: '-18deg' },
                  ],
                },
              ]}
            />
            <View style={styles.ctaInner}>
              <Text style={styles.ctaText}>BEGIN</Text>
              <View style={styles.ctaArrowTile}>
                <Ionicons name="arrow-forward" size={13} color={paper.dashboardCream} />
              </View>
            </View>
          </Pressable>

          <View style={styles.footerRow}>
            <View style={styles.footerRule} />
            <Text style={styles.footerText}>PAGE 01 OF 01 · PROFILE SETUP</Text>
            <View style={styles.footerRule} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ─── Step pill ───────────────────────────────────────────────────────────────

function StepPill({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.stepPill}>
      <Text style={styles.stepPillText}>STEP {step} / {total}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  root: { flex: 1, backgroundColor: paper.dashboardCream },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },

  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm + 2,
    paddingBottom: paperSpacing.sm,
    gap: paperSpacing.sm,
  },

  // ── Cover card ────────────────────────────────────────────────────────────
  cover: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    padding: paperSpacing.md,
    overflow: 'hidden',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  coverTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.28,
  },
  coverRubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: paperSpacing.sm,
    zIndex: 1,
  },
  coverRubricRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.3,
  },
  coverRubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
    opacity: 0.65,
  },
  coverMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    zIndex: 1,
  },
  coverStage: {
    flexShrink: 0,
  },
  coverTextCol: {
    flex: 1,
    gap: 4,
  },
  coverEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coverPulseDotWrap: {
    width: 9,
    height: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPulseDotRing: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    opacity: 0.4,
  },
  coverPulseDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: paper.dashboardBlue,
  },
  coverEyebrowText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardBlue,
    letterSpacing: 2.2,
  },
  coverTitle: {
    fontFamily: paperFonts.display,
    fontSize: 24,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 27,
  },
  coverTitleItalic: {
    fontFamily: paperFonts.displayItalic,
    color: paper.dashboardInk,
  },
  coverTitleDot: {
    color: paper.dashboardBlue,
  },
  coverDek: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.7,
    lineHeight: 17,
  },

  // ── Masthead ──────────────────────────────────────────────────────────────
  mastheadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
  },
  mastheadText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    letterSpacing: 3,
    opacity: 0.65,
  },
  mastheadRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.25,
  },
  mastheadOrnament: {
    fontFamily: paperFonts.body,
    fontSize: 9,
    color: paper.dashboardBlue,
    opacity: 0.5,
  },

  // ── Chapter rows ──────────────────────────────────────────────────────────
  chapters: {
    gap: paperSpacing.xs + 2,
    flex: 1,
    justifyContent: 'center',
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderLeftWidth: 4,
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 10,
    gap: 8,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  chapterLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chapterNumeralBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.25,
    backgroundColor: paper.dashboardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chapterNumeral: {
    fontFamily: paperFonts.display,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 13,
  },
  chapterTextCol: {
    flex: 1,
    gap: 3,
  },
  chapterTitle: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.15,
    lineHeight: 17,
  },
  chapterBlurb: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.7,
    lineHeight: 15,
  },
  chapterTagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  chapterTagText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.4,
  },

  // ── Chapter previews — in-app vocabulary ──────────────────────────────────

  // Score chip (mirrors dashboard band score display)
  previewScoreChip: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: paper.bandPrime,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: paper.bandPrime,
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  previewScoreNumber: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 24,
  },
  previewScoreLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    opacity: 0.9,
    marginTop: -1,
  },

  // Lure chip stack (mirrors recommender chip style)
  previewLureStack: {
    gap: 5,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  previewLureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: paper.dashboardBlueSky,
    borderWidth: 1,
    borderColor: `${paper.dashboardBlue}33`,
  },
  previewLureText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    color: paper.dashboardInk,
    letterSpacing: 1,
  },

  // Contour rings (mirrors water reader map style — static, no animation)
  previewContour: {
    width: 54,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  previewContourRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.25,
    borderColor: '#2A6E96',
  },
  previewContourDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2A6E96',
    opacity: 0.8,
    top: 17,
    left: 24,
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  cta: {
    overflow: 'hidden',
    backgroundColor: paper.dashboardInk,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  ctaPressed: { backgroundColor: paper.dashboardBlue },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: paperSpacing.md,
  },
  ctaText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardCream,
    letterSpacing: 3.2,
  },
  ctaArrowTile: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaShimmer: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  footerRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.35,
  },
  footerText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
    opacity: 0.65,
  },

  // ── Step pill ─────────────────────────────────────────────────────────────
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
  },
});
