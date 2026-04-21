/**
 * Subscribe / Plans screen — FinFindr paper placeholder.
 *
 * V1: Visual migration into the FinFindr paper language. RevenueCat
 * subscription UI will be integrated in the Monetization phase.
 */

import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';
import { PaperBackground, SectionEyebrow } from '../components/paper';

export default function SubscribeScreen() {
  return (
    <PaperBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.eyebrowRow}>
            <SectionEyebrow dashes size={11} color={paper.gold}>
              FINFINDR · MEMBERSHIP
            </SectionEyebrow>
          </View>

          <Text style={styles.title}>Subscribe.</Text>
          <Text style={styles.lede}>
            Unlock unlimited How&apos;s Fishing reports, the full tackle recommender,
            and every signal the engine can read.
          </Text>

          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="fish" size={14} color={paper.forest} />
              <Text style={styles.planLabel}>ANGLER</Text>
              <View style={styles.priceBlock}>
                <Text style={styles.priceNum}>$9.99</Text>
                <Text style={styles.priceUnit}>/MO</Text>
              </View>
            </View>
            <Text style={styles.planHint}>
              Core daily reports, tackle picks, and your full catch log.
            </Text>
          </View>

          <View style={[styles.planCard, styles.planCardMaster]}>
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
              Everything in Angler plus the water reader, multi-day planning,
              and premium guide notes.
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              Plans and subscription management are coming soon. Pricing shown
              is the intended launch rate.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
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
    padding: paperSpacing.md + 2,
    marginBottom: paperSpacing.md,
    ...paperShadows.hard,
  },
  planCardMaster: {
    paddingLeft: paperSpacing.md + 8,
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
    marginTop: 'auto',
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
