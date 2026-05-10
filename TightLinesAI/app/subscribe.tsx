/**
 * Subscribe / Plans screen — FinFindr membership screen.
 *
 * V1: Visual migration into the FinFindr dashboard language. RevenueCat
 * subscription UI will be integrated in the Monetization phase.
 */

import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../lib/theme';
import {
  PaperBestValueStamp,  PaperNavHeader,} from '../components/paper';
import { hapticImpact, ImpactFeedbackStyle } from '../lib/safeHaptics';

export default function SubscribeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · MEMBERSHIP"
          eyebrowColor={paper.bandFair}
          title="SUBSCRIBE"
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eyebrowRow}><Text style={styles.pageEyebrow}>MEMBERSHIP OPTIONS</Text></View>

          <Text style={styles.title}>Subscribe.</Text>
          <Text style={styles.lede}>
            Unlock the Daily Read, the full Tackle Box, and planning tools
            built around the water you fish.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.planCard,
              pressed && styles.planCardPressed,
            ]}
            onPress={() => hapticImpact(ImpactFeedbackStyle.Light)}
          >
            <View style={styles.planHeader}>
              <Ionicons name="fish" size={14} color={paper.dashboardBlue} />
              <Text style={styles.planLabel}>ANGLER</Text>
              <View style={styles.priceBlock}>
                <Text style={styles.priceNum}>$9.99</Text>
                <Text style={styles.priceUnit}>/MO</Text>
              </View>
            </View>
            <Text style={styles.planHint}>
              Daily Read and Tackle Box picks for the water you fish most.
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
            <PaperBestValueStamp />
            <View style={styles.masterBar} />
            <View style={styles.planHeader}>
              <Ionicons name="trophy" size={14} color={paper.bandFair} />
              <Text style={styles.planLabel}>MASTER ANGLER</Text>
              <View style={styles.priceBlock}>
                <Text style={styles.priceNum}>$14.99</Text>
                <Text style={styles.priceUnit}>/MO</Text>
              </View>
            </View>
            <Text style={styles.planHint}>
              Everything in Angler plus Water Read, multi-day planning,
              and deeper guide notes.
            </Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              Plans and subscription management are coming soon. Pricing shown
              is the intended launch rate.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardCream },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xl,
  },eyebrowRow: { marginBottom: paperSpacing.md },
pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 38,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: paperSpacing.xs,
  },
  lede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: paper.dashboardInk,
    opacity: 0.75,
    lineHeight: 22,
    marginBottom: paperSpacing.xl,
  },

  planCard: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    padding: paperSpacing.lg,
    // Bumped from `md` to `lg` so the two plan cards (Angler / Master Angler)
    // read as visually independent options rather than two stacked rows.
    marginBottom: paperSpacing.lg,
      },
  planCardPressed: {
    backgroundColor: '#F6F9FB',
  },
  planCardMaster: {
    paddingLeft: paperSpacing.md + 8,
    // The BEST VALUE badge floats above the card edge; reserve headroom so it
    // does not visually collide with the section lede or the Angler border.
    marginTop: paperSpacing.xs,
  },
  masterBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: paper.bandFair,
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
    color: paper.dashboardInk,
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
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
  },
  priceUnit: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    opacity: 0.65,
    letterSpacing: 1.6,
  },
  planHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.75,
    lineHeight: 19,
  },

  footerRow: {
    marginTop: paperSpacing.md,
    paddingTop: paperSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
  },
  footerText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.6,
    lineHeight: 18,
    textAlign: 'center',
  },
});
