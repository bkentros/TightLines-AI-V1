/**
 * Subscribe screen.
 *
 * This screen does not sell plans directly. It opens the single RevenueCat
 * paywall configured in RevenueCat, then provides restore and App Store
 * subscription management actions.
 */

import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { paper, paperFonts, paperSpacing } from '../lib/theme';
import { PaperNavHeader, TopographicLines } from '../components/paper';
import { AuthFooterStamp } from '../components/paper/auth';
import {
  openStoreSubscriptionManagement,
  storeSubscriptionManagementLabel,
} from '../lib/legalLinks';
import { hapticImpact, ImpactFeedbackStyle } from '../lib/safeHaptics';
import { useRevenueCatStore } from '../store/revenueCatStore';

const ANGLER_FEATURES: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  copy: string;
}> = [
  {
    icon: 'analytics-outline',
    title: 'Bite reports',
    copy: 'Full reports for today plus the next 6 days, including score, drivers, windows, and context.',
  },
  {
    icon: 'fish-outline',
    title: 'Tackle Box',
    copy: 'Condition-matched lure and fly picks tuned to species, water type, clarity, and the day.',
  },
  {
    icon: 'scan-outline',
    title: 'Water Read',
    copy: 'Structure intelligence for supported waters, built to highlight higher-percentage zones.',
  },
];

export default function SubscribeScreen() {
  const router = useRouter();
  const {
    presentingPaywall,
    restoring,
    error,
    hasAngler,
    presentPaywall,
    restore,
  } = useRevenueCatStore();

  const handleOpenPaywall = async () => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    const unlocked = await presentPaywall();
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
        : 'We could not find an active subscription for this App Store account.',
    );
  };

  const handleManageStoreSubscription = async () => {
    try {
      await openStoreSubscriptionManagement();
    } catch {
      Alert.alert(
        'Could not open subscriptions',
        'Open your App Store account settings to manage or cancel your subscription.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · MEMBERSHIP"
          eyebrowColor={paper.bandFair}
          title="ANGLER"
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroPanel}>
            <TopographicLines
              style={styles.heroTopo}
              color={paper.dashboardBlueLight}
              count={6}
            />
            <View style={styles.brandLockup}>
              <View style={styles.logoBadge}>
                <Image
                  source={require('../assets/images/finfindr-logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandText}>
                FinFindr<Text style={styles.brandDot}>.</Text>
              </Text>
            </View>

            <Text style={styles.pageEyebrow}>FINFINDR · ANGLER</Text>
            <Text style={styles.title}>
              UNLOCK FISHING{'\n'}
              <Text style={styles.titleAccent}>INTELLIGENCE.</Text>
            </Text>
            <Text style={styles.lede}>
              Angler opens full bite reports, tactical tackle direction, and
              structure intelligence for supported waters.
            </Text>
          </View>

          <View style={styles.featureList}>
            {ANGLER_FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={14} color={paper.dashboardBlue} />
                </View>
                <View style={styles.featureBody}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureCopy}>{feature.copy}</Text>
                </View>
                <View style={styles.featureCheck}>
                  <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.freeBox}>
            <View style={styles.freeHeader}>
              <Text style={styles.freeLabel}>FREE TIER</Text>
              <Ionicons name="lock-open-outline" size={14} color={paper.dashboardBlue} />
            </View>
            <Text style={styles.freeCopy}>
              Includes a limited Today&apos;s Bite, today&apos;s dashboard score after
              generation, and one tomorrow preview. Future reports stay locked.
            </Text>
          </View>

          {hasAngler ? (
            <View style={styles.unlockedBox}>
              <Ionicons name="checkmark-circle" size={18} color={paper.bandPrime} />
              <Text style={styles.unlockedText}>ANGLER IS ACTIVE</Text>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.nativePaywallBtn,
                pressed && styles.nativePaywallBtnPressed,
                (presentingPaywall || restoring) && styles.btnDisabled,
              ]}
              onPress={handleOpenPaywall}
              disabled={presentingPaywall || restoring}
            >
              {presentingPaywall ? (
                <ActivityIndicator size="small" color={paper.dashboardCream} />
              ) : (
                <Ionicons name="card-outline" size={15} color={paper.dashboardCream} />
              )}
              <Text style={styles.nativePaywallText}>
                {presentingPaywall ? 'OPENING PAYWALL...' : 'OPEN ANGLER PAYWALL'}
              </Text>
            </Pressable>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.managementCard}>
            <Text style={styles.managementTitle}>Subscription management</Text>
            <Text style={styles.managementCopy}>
              Purchases and cancellations are handled by the App Store. Use Restore
              Purchases after reinstalling or signing in on a new device.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.restoreBtn,
                pressed && styles.restoreBtnPressed,
                (restoring || presentingPaywall) && styles.btnDisabled,
              ]}
              onPress={handleRestore}
              disabled={restoring || presentingPaywall}
            >
              {restoring ? <ActivityIndicator size="small" color={paper.dashboardBlue} /> : null}
              <Text style={styles.restoreText}>
                {restoring ? 'RESTORING...' : 'RESTORE PURCHASES'}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.manageStoreBtn,
                pressed && styles.manageStoreBtnPressed,
              ]}
              onPress={handleManageStoreSubscription}
            >
              <Text style={styles.manageStoreText}>
                {storeSubscriptionManagementLabel().toUpperCase()}
              </Text>
            </Pressable>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              Subscriptions renew automatically unless canceled in your App Store
              account settings.
            </Text>
            <Text style={styles.footerText}>
              By subscribing, you agree to the{' '}
              <Text style={styles.footerLink} onPress={() => router.push('/legal/terms')}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={styles.footerLink} onPress={() => router.push('/legal/privacy')}>
                Privacy Policy
              </Text>.
            </Text>
          </View>

          <AuthFooterStamp />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  flex: { flex: 1, backgroundColor: paper.dashboardCream },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xl,
  },
  heroPanel: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: paper.dashboardInk,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xl,
    marginBottom: paperSpacing.lg,
  },
  heroTopo: {
    top: -28,
    left: -18,
    right: -18,
    height: 122,
    opacity: 0.13,
  },
  brandLockup: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: paperSpacing.sm,
  },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 42,
    height: 42,
  },
  brandText: {
    fontFamily: paperFonts.display,
    fontSize: 20,
    lineHeight: 22,
    color: paper.dashboardCream,
    fontWeight: '700',
  },
  brandDot: {
    color: paper.dashboardBlueLight,
  },
  pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.9,
    color: paper.dashboardBlueLight,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    lineHeight: 36,
    color: paper.dashboardCream,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  titleAccent: {
    color: paper.dashboardBlueLight,
  },
  lede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 15,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: paperSpacing.sm,
  },
  featureList: {
    gap: 8,
    marginBottom: paperSpacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: paperSpacing.md,
    borderRadius: 8,
    borderWidth: 1.25,
    borderColor: 'rgba(61,168,95,0.30)',
    backgroundColor: paper.dashboardWhite,
  },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(61,168,95,0.34)',
    backgroundColor: 'rgba(61,168,95,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBody: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: paper.dashboardInk,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  featureCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: paper.dashboardInk,
    opacity: 0.78,
  },
  featureCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: paper.bandPrime,
    borderWidth: 1,
    borderColor: 'rgba(10,27,46,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  freeBox: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.25,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  freeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
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
    fontSize: 12.5,
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
  nativePaywallBtn: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: paper.dashboardInk,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    marginBottom: paperSpacing.lg,
  },
  nativePaywallBtnPressed: {
    backgroundColor: '#13314F',
  },
  nativePaywallText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardCream,
    letterSpacing: 2,
  },
  btnDisabled: {
    opacity: 0.65,
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
  managementCard: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    padding: paperSpacing.md,
    gap: paperSpacing.sm,
  },
  managementTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardBlue,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  managementCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
    opacity: 0.72,
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
  },
  restoreBtnPressed: {
    backgroundColor: '#F6F9FB',
  },
  restoreText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2,
  },
  manageStoreBtn: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: paperSpacing.md,
  },
  manageStoreBtnPressed: { backgroundColor: '#F6F9FB' },
  manageStoreText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
  },
  footerRow: {
    marginTop: paperSpacing.md,
    paddingTop: paperSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: paper.dashboardHair,
    gap: paperSpacing.sm,
  },
  footerText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.6,
    lineHeight: 18,
    textAlign: 'center',
  },
  footerLink: {
    fontFamily: paperFonts.bodyBold,
    color: paper.dashboardBlue,
    opacity: 1,
  },
});
