/**
 * Subscribe / Plans screen — FinFindr paper placeholder.
 *
 * V1: Visual migration into the FinFindr paper language. RevenueCat
 * subscription UI will be integrated in the Monetization phase.
 */

import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';
import {
  PaperBackground,
  PaperBestValueStamp,
  PaperColophon,
  PaperNavHeader,
  SectionEyebrow,
} from '../components/paper';
import { hapticImpact, ImpactFeedbackStyle } from '../lib/safeHaptics';

export default function SubscribeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · MEMBERSHIP"
          eyebrowColor={paper.gold}
          title="SUBSCRIBE"
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eyebrowRow}>
            <SectionEyebrow dashes size={11} color={paper.gold}>
              CHOOSE YOUR EDITION
            </SectionEyebrow>
          </View>

          <Text style={styles.title}>Subscribe.</Text>
          <Text style={styles.lede}>
            Unlock unlimited fishing reads, the full tackle recommender,
            and planning tools built around your conditions.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.planCard,
              pressed && styles.planCardPressed,
            ]}
            onPress={() => hapticImpact(ImpactFeedbackStyle.Light)}
          >
            <View style={styles.planHeader}>
              <Ionicons name="fish" size={14} color={paper.forest} />
              <Text style={styles.planLabel}>ANGLER</Text>
              <View style={styles.priceBlock}>
                <Text style={styles.priceNum}>$9.99</Text>
                <Text style={styles.priceUnit}>/MO</Text>
              </View>
            </View>
            <Text style={styles.planHint}>
              Daily fishing reads and tackle picks for the water you fish most.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.planCard,
              styles.planCardMaster,
              pressed && styles.planCardPressed,
            ]}
            onPress={() => hapticImpact(ImpactFeedbackStyle.Medium)}
          >
            {/* The "BEST VALUE" stamp tilts into the upper-right corner of
                the Master Angler card. It is purely editorial — no interaction
                — so it's marked accessibility-hidden via the stamp primitive. */}
            <PaperBestValueStamp />
            <View style={styles.masterBar} />
            <View style={styles.planHeader}>
              <Ionicons name="trophy" size={14} color={paper.gold} />
              <Text style={styles.planLabel}>MASTER ANGLER</Text>
              <View style={styles.priceBlock}>
                <Text style={styles.priceNum}>$14.99</Text>
                <Text style={styles.priceUnit}>/MO</Text>
              </View>
            </View>
            <Text style={styles.planHint}>
              Everything in Angler plus Water Reader, multi-day planning,
              and deeper guide notes.
            </Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              Plans and subscription management are coming soon. Pricing shown
              is the intended launch rate.
            </Text>
          </View>

          <PaperColophon
            section="MEMBERSHIP"
            tagline={(edition) => `NO. ${edition} · A SMALL PRESS BY ANGLERS`}
          />
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xl,
  },

  eyebrowRow: { marginBottom: paperSpacing.md },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 38,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -1.2,
    marginBottom: paperSpacing.xs,
  },
  lede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.ink,
    opacity: 0.75,
    lineHeight: 22,
    marginBottom: paperSpacing.xl,
  },

  planCard: {
    position: 'relative',
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    // Bumped from `md` to `lg` so the two plan cards (Angler / Master Angler)
    // read as visually independent options rather than two stacked rows.
    marginBottom: paperSpacing.lg,
    ...paperShadows.hard,
  },
  planCardPressed: {
    backgroundColor: paper.paperDark,
  },
  planCardMaster: {
    paddingLeft: paperSpacing.md + 8,
    // The BEST VALUE stamp pokes ~10px above & right of the card; reserve
    // headroom on the row above so it does not visually collide with the
    // section lede or the Angler card border.
    marginTop: paperSpacing.xs,
  },
  masterBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: paper.gold,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.xs + 2,
  },
  planLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.6,
  },
  priceBlock: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  priceNum: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.ink,
    opacity: 0.65,
    letterSpacing: 1.6,
  },
  planHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.75,
    lineHeight: 19,
  },

  footerRow: {
    marginTop: paperSpacing.md,
    paddingTop: paperSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: paper.inkHair,
  },
  footerText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.6,
    lineHeight: 18,
    textAlign: 'center',
  },
});
