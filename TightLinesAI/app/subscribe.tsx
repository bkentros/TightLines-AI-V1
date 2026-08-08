/**
 * Subscribe screen.
 *
 * This screen does not sell plans directly. It opens the single RevenueCat
 * paywall configured in RevenueCat, then provides restore and App Store
 * subscription management actions.
 */

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { paper, paperFonts, paperShadows, paperSpacing } from '../lib/theme';
import {
  CornerMarkSet,
  IntelligenceModuleEmblem,
  PaperNavHeader,
  SectionEyebrow,
  TopographicLines,
  type IntelligenceModuleId,
} from '../components/paper';
import { AuthFooterStamp } from '../components/paper/auth';
import {
  openStoreSubscriptionManagement,
  storeSubscriptionManagementLabel,
} from '../lib/legalLinks';
import { hapticImpact, ImpactFeedbackStyle } from '../lib/safeHaptics';
import { useRevenueCatStore } from '../store/revenueCatStore';
import { showAnglerUnlockedCelebration, showSubscriptionNotice } from '../store/subscriptionCelebrationStore';

const ANGLER_FEATURES: Array<{
  module: IntelligenceModuleId;
  title: string;
  copy: string;
  iconBg: [string, string];
  accent: string;
  iconColor: string;
}> = [
  {
    module: 'todays-bite',
    title: "Today's Bite",
    copy: 'Full reports for today plus the next 6 days, including score, drivers, windows, and context.',
    iconBg: ['#E5F2DD', '#C5E0B5'],
    accent: '#3D955A',
    iconColor: '#1F6B38',
  },
  {
    module: 'river-run',
    title: 'River Migration',
    copy: 'Audited migration reads for supported rivers, seasons, and species—including stage, movement, fishability, and presence.',
    iconBg: ['#FBE4E1', '#F3C2BC'],
    accent: paper.red,
    iconColor: '#9A2B20',
  },
  {
    module: 'tackle-box',
    title: 'Tackle Box',
    copy: 'Condition-matched lure and fly picks tuned to species, water type, clarity, and the day.',
    iconBg: ['#FBF1D9', '#F4DFA4'],
    accent: '#C99B2D',
    iconColor: '#8A6A1A',
  },
  {
    module: 'water-read',
    title: 'Water Read',
    copy: 'Structure intelligence for supported waters, built to highlight higher-percentage zones.',
    iconBg: ['#E8F2FA', '#C8DFF2'],
    accent: paper.dashboardBlue,
    iconColor: '#0A4A87',
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
  const handleOpenPaywall = useCallback(async () => {
    hapticImpact(ImpactFeedbackStyle.Medium);
    const unlocked = await presentPaywall();
    if (unlocked) {
      showAnglerUnlockedCelebration();
      router.replace('/(tabs)');
    }
  }, [presentPaywall, router]);

  const handleLeaveSubscribe = useCallback(async () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }, [router]);

  const heroTitle = hasAngler
    ? (
      <>
        ANGLER MEMBERSHIP{'\n'}
        <Text style={styles.titleAccent}>ACTIVE.</Text>
      </>
    )
    : (
      <>
        UNLOCK FISHING{'\n'}
        <Text style={styles.titleAccent}>INTELLIGENCE.</Text>
      </>
    );
  const heroCopy = hasAngler
    ? "Your App Store subscription is connected. Today's Bite, River Migration, Tackle Box, and Water Read are unlocked."
    : "One membership unlocks Today's Bite, River Migration, Tackle Box, and Water Read.";

  const handleRestore = async () => {
    hapticImpact(ImpactFeedbackStyle.Light);
    const unlocked = await restore();
    const restoreError = useRevenueCatStore.getState().error;
    const receiptBelongsToAnotherAccount = Boolean(
      restoreError?.includes('already connected to another FinFindr account'),
    );
    if (unlocked) {
      showAnglerUnlockedCelebration();
      router.replace('/(tabs)');
      return;
    }
    showSubscriptionNotice({
      title: receiptBelongsToAnotherAccount
        ? 'Subscription linked elsewhere'
        : 'No App Store subscription found',
      message: restoreError ||
        'Restore Purchases only reconnects an active Angler subscription already purchased with this Apple ID. If that subscription is tied to another FinFindr account, sign in to that original account or contact support.',
      tone: receiptBelongsToAnotherAccount ? 'error' : 'info',
    });
  };

  const handleManageStoreSubscription = async () => {
    try {
      await openStoreSubscriptionManagement();
    } catch {
      showSubscriptionNotice({
        title: 'Could not open subscriptions',
        message: 'Open your App Store account settings to manage or cancel your subscription.',
        tone: 'info',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · MEMBERSHIP"
          eyebrowColor={paper.bandFair}
          title="ANGLER"
          onBack={handleLeaveSubscribe}
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
            <CornerMarkSet
              color={paper.bandFair}
              size={16}
              thickness={2}
              inset={11}
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
            <Text style={styles.title}>{heroTitle}</Text>
            <Text style={styles.lede}>{heroCopy}</Text>
            <View style={styles.heroMembershipStamp}>
              <Ionicons name="sparkles" size={12} color={paper.bandFair} />
              <Text style={styles.heroMembershipStampText}>
                FOUR INTELLIGENCE TOOLS · ONE MEMBERSHIP
              </Text>
            </View>
          </View>

          {hasAngler ? (
            <View style={styles.statusPanel}>
              <View style={styles.statusIcon}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <View style={styles.statusBody}>
                <Text style={styles.statusTitle}>Angler is active</Text>
                <Text style={styles.statusCopy}>
                  This FinFindr account is connected to an active App Store subscription.
                </Text>
              </View>
            </View>
          ) : null}

          <SectionEyebrow
            dashes={false}
            align="left"
            color={paper.redDk}
            size={9.5}
            tracking={2}
            style={styles.featureSectionEyebrow}
          >
            {hasAngler ? 'INCLUDED WITH ANGLER' : 'WHAT ANGLER UNLOCKS'}
          </SectionEyebrow>
          <View style={styles.featureList}>
            {ANGLER_FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureItem}>
                <View style={[styles.featureAccentRail, { backgroundColor: feature.accent }]} />
                <IntelligenceModuleEmblem
                  module={feature.module}
                  iconBg={feature.iconBg}
                  iconBorder={feature.accent}
                  iconColor={feature.iconColor}
                  size={42}
                  animate={false}
                />
                <View style={styles.featureBody}>
                  <Text style={[styles.featureTitle, { color: feature.accent }]}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureCopy}>{feature.copy}</Text>
                </View>
                <View style={styles.featureCheck}>
                  <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                </View>
              </View>
            ))}
          </View>

          {!hasAngler ? (
            <>
              <View style={styles.freeBox}>
                <View style={styles.freeHeader}>
                  <Text style={styles.freeLabel}>FREE TIER</Text>
                  <Ionicons name="lock-open-outline" size={14} color={paper.dashboardBlue} />
                </View>
                <Text style={styles.freeCopy}>
                  Try one full Today&apos;s Bite, one River Migration read, one
                  Tackle Box session (including Changeup), and one Water Read lake.
                  Your River Migration read can be reopened until conditions refresh.
                  Tomorrow&apos;s score preview stays free; future forecast reports stay locked.
                </Text>
              </View>

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
                  {presentingPaywall ? 'OPENING PAYWALL...' : 'UPGRADE TO ANGLER'}
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.memberNote}>
              <Ionicons name="sparkles-outline" size={15} color={paper.dashboardBlue} />
              <Text style={styles.memberNoteText}>
                Premium features are ready. Use the App Store controls below to restore,
                manage, or cancel billing.
              </Text>
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.managementCard}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlue}
              count={4}
            />
            <View style={styles.managementHeader}>
              <View style={styles.managementIcon}>
                <Ionicons name="card-outline" size={16} color={paper.dashboardBlue} />
              </View>
              <View style={styles.managementHeaderCopy}>
                <Text style={styles.managementEyebrow}>ACCOUNT CONTROLS</Text>
                <Text style={styles.managementTitle}>Subscription management</Text>
              </View>
            </View>
            <Text style={styles.managementCopy}>
              Purchases and cancellations are handled by the App Store. Restore
              Purchases reconnects an active subscription from the Apple ID currently
              signed into the App Store.
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
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
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
  heroMembershipStamp: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(231,193,88,0.3)',
    borderRadius: 999,
    backgroundColor: 'rgba(231,193,88,0.08)',
  },
  heroMembershipStampText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.1,
    color: paper.bandFair,
  },
  statusPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(61,168,95,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(61,168,95,0.35)',
    borderRadius: 8,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  statusIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: paper.bandPrime,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  statusBody: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statusCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
    opacity: 0.74,
  },
  featureSectionEyebrow: {
    marginBottom: 9,
  },
  featureList: {
    gap: 8,
    marginBottom: paperSpacing.lg,
  },
  featureItem: {
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    minHeight: 78,
    paddingVertical: 11,
    paddingLeft: paperSpacing.md,
    paddingRight: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    ...paperShadows.hard,
  },
  featureAccentRail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
  },
  featureBody: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 1.4,
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
  memberNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 8,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
  },
  memberNoteText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
    opacity: 0.74,
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
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    padding: 14,
    gap: paperSpacing.sm,
    ...paperShadows.hard,
  },
  managementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  managementIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.22)',
    borderRadius: 18,
    backgroundColor: '#EAF3FA',
  },
  managementHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  managementEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.3,
    color: paper.dashboardBlue,
  },
  managementTitle: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 19,
    color: paper.dashboardInk,
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
