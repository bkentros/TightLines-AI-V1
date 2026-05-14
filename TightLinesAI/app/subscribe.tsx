/**
 * Subscribe / Plans screen — FinFindr membership screen.
 *
 * Uses RevenueCat offerings for live subscription purchase + restore.
 */

import { ActivityIndicator, Alert, ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { PurchasesPackage } from 'react-native-purchases';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../lib/theme';
import {
  PaperBestValueStamp,
  PaperNavHeader,
} from '../components/paper';
import { AuthFooterStamp } from '../components/paper/auth';
import { hapticImpact, ImpactFeedbackStyle } from '../lib/safeHaptics';
import { useAuthStore } from '../store/authStore';
import { useRevenueCatStore } from '../store/revenueCatStore';

function packageLabel(pkg: PurchasesPackage): string {
  const id = `${pkg.identifier} ${pkg.product.identifier}`.toLowerCase();
  if (id.includes('annual') || id.includes('year')) return 'ANGLER ANNUAL';
  if (id.includes('month')) return 'ANGLER MONTHLY';
  if (id.includes('week')) return 'ANGLER WEEKLY';
  return pkg.product.title?.toUpperCase() || 'FINFINDR ANGLER';
}

function packageHint(pkg: PurchasesPackage): string {
  const id = `${pkg.identifier} ${pkg.product.identifier}`.toLowerCase();
  if (id.includes('annual') || id.includes('year')) {
    return 'Full access for a year, including forecast reads, Tackle Box, and Water Read.';
  }
  return 'Full access to every FinFindr feature while your subscription is active.';
}

export default function SubscribeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const {
    configured,
    loading,
    purchasing,
    restoring,
    error,
    offering,
    hasAngler,
    initialize,
    purchase,
    restore,
  } = useRevenueCatStore();
  const packages = offering?.availablePackages ?? [];

  const handlePurchase = async (pkg: PurchasesPackage) => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    const unlocked = await purchase(pkg);
    if (unlocked) {
      Alert.alert('Angler unlocked', 'You now have full access to FinFindr.', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)') },
      ]);
    }
  };

  const handleRestore = async () => {
    hapticImpact(ImpactFeedbackStyle.Light);
    const unlocked = await restore();
    Alert.alert(
      unlocked ? 'Purchases restored' : 'No active Angler subscription found',
      unlocked
        ? 'Your FinFindr Angler access is active.'
        : 'We could not find an active subscription for this store account.',
    );
  };

  const handleRetry = () => {
    if (user?.id) void initialize(user.id);
  };

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
            Free anglers get a limited Today's Bite for today. Angler unlocks
            every read, forecast day, Tackle Box, and Water Read.
          </Text>

          <View style={styles.freeBox}>
            <Text style={styles.freeLabel}>FREE</Text>
            <Text style={styles.freeCopy}>Limited Today's Bite for the current date only.</Text>
          </View>

          {hasAngler ? (
            <View style={styles.unlockedBox}>
              <Ionicons name="checkmark-circle" size={18} color={paper.bandPrime} />
              <Text style={styles.unlockedText}>ANGLER IS ACTIVE</Text>
            </View>
          ) : null}

          {loading && packages.length === 0 ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={paper.dashboardBlue} />
              <Text style={styles.loadingText}>LOADING PLANS...</Text>
            </View>
          ) : null}

          {packages.length > 0 ? (
            packages.map((pkg, index) => {
              const isPurchasing = purchasing === pkg.identifier;
              return (
                <Pressable
                  key={pkg.identifier}
                  style={({ pressed }) => [
                    styles.planCard,
                    index === 0 && styles.planCardMaster,
                    pressed && styles.planCardPressed,
                    (isPurchasing || restoring) && styles.planCardDisabled,
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={isPurchasing || restoring || hasAngler}
                >
                  {index === 0 ? <PaperBestValueStamp /> : null}
                  {index === 0 ? <View style={styles.masterBar} /> : null}
                  <View style={styles.planHeader}>
                    <Ionicons
                      name={index === 0 ? 'trophy' : 'fish'}
                      size={14}
                      color={index === 0 ? paper.bandFair : paper.dashboardBlue}
                    />
                    <Text style={styles.planLabel}>{packageLabel(pkg)}</Text>
                    <View style={styles.priceBlock}>
                      {isPurchasing ? (
                        <ActivityIndicator size="small" color={paper.dashboardBlue} />
                      ) : (
                        <>
                          <Text style={styles.priceNum}>{pkg.product.priceString}</Text>
                          <Text style={styles.priceUnit}>
                            {packageLabel(pkg).includes('ANNUAL') ? '/YR' : '/MO'}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Text style={styles.planHint}>{packageHint(pkg)}</Text>
                </Pressable>
              );
            })
          ) : !loading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>
                {configured ? 'NO LIVE PLANS FOUND' : 'REVENUECAT NEEDS KEYS'}
              </Text>
              <Text style={styles.emptyCopy}>
                {configured
                  ? 'Add products to the current RevenueCat offering, then reopen this screen.'
                  : 'Set your Expo public RevenueCat API key env vars and restart the app.'}
              </Text>
              <Pressable style={styles.retryBtn} onPress={handleRetry}>
                <Text style={styles.retryText}>RETRY</Text>
              </Pressable>
            </View>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.restoreBtn,
              pressed && styles.restoreBtnPressed,
              restoring && styles.restoreBtnDisabled,
            ]}
            onPress={handleRestore}
            disabled={restoring || purchasing != null}
          >
            {restoring ? <ActivityIndicator size="small" color={paper.dashboardBlue} /> : null}
            <Text style={styles.restoreText}>{restoring ? 'RESTORING...' : 'RESTORE PURCHASES'}</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              Subscriptions renew automatically unless canceled in your App Store
              or Google Play account settings.
            </Text>
          </View>

          {/* Same pressed-edition stamp the auth screens and the Today's
              Bite report use — gives every surface the same finishing
              "this is an issue" voice. */}
          <AuthFooterStamp />
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

  freeBox: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    borderRadius: 10,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  freeLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
    marginBottom: 4,
  },
  freeCopy: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardInk,
    lineHeight: 19,
    opacity: 0.72,
  },
  unlockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.bandPrime,
    borderRadius: 10,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  unlockedText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: paperSpacing.xl,
  },
  loadingText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardBlue,
    letterSpacing: 1.6,
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
  planCardDisabled: {
    opacity: 0.65,
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

  emptyBox: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    borderRadius: 10,
    padding: paperSpacing.lg,
    marginBottom: paperSpacing.lg,
  },
  emptyTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2,
    marginBottom: 8,
  },
  emptyCopy: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardInk,
    lineHeight: 19,
    opacity: 0.72,
  },
  retryBtn: {
    alignSelf: 'flex-start',
    marginTop: paperSpacing.md,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 8,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: 9,
  },
  retryText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
  },
  errorText: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.bandTough,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: -paperSpacing.xs,
    marginBottom: paperSpacing.md,
  },
  restoreBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 8,
    backgroundColor: paper.dashboardWhite,
    marginTop: paperSpacing.xs,
  },
  restoreBtnPressed: {
    backgroundColor: '#F6F9FB',
  },
  restoreBtnDisabled: {
    opacity: 0.65,
  },
  restoreText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2,
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
