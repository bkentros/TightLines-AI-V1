/**
 * Subscribe Prompt — shown when unsubscribed user taps a gated feature
 *
 * Generic locked-feature paywall with direct RevenueCat purchase CTAs.
 * Reusable for How's Fishing, Recommender, Water Reader, etc.
 */

import { useEffect } from 'react';
import { ActivityIndicator, Alert, Image, Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PurchasesPackage } from 'react-native-purchases';
import { paper, paperFonts, paperSpacing } from '../lib/theme';
import { TopographicLines } from './paper';
import { useRevenueCatStore } from '../store/revenueCatStore';

export interface SubscribePromptProps {
  visible: boolean;
  onDismiss: () => void;
  onViewPlans?: () => void;
  onUnlocked?: () => void;
}

function isAnnualPackage(pkg: PurchasesPackage): boolean {
  const id = `${pkg.identifier} ${pkg.product.identifier}`.toLowerCase();
  return id.includes('annual') || id.includes('year');
}

function isMonthlyPackage(pkg: PurchasesPackage): boolean {
  const id = `${pkg.identifier} ${pkg.product.identifier}`.toLowerCase();
  return id.includes('month');
}

function sortedPackages(packages: PurchasesPackage[]): PurchasesPackage[] {
  const annual = packages.find(isAnnualPackage);
  const monthly = packages.find(isMonthlyPackage);
  return [annual, monthly, ...packages.filter((pkg) => pkg !== annual && pkg !== monthly)]
    .filter(Boolean) as PurchasesPackage[];
}

function monthlyEquivalentLabel(pkg: PurchasesPackage): string | null {
  const price = typeof pkg.product.price === 'number' ? pkg.product.price : null;
  if (price == null || !Number.isFinite(price)) return null;
  return `$${(price / 12).toFixed(2)} monthly`;
}

export function SubscribePrompt({
  visible,
  onDismiss,
  onViewPlans,
  onUnlocked,
}: SubscribePromptProps) {
  const { loading, purchasing, error, offering, purchase, refresh } = useRevenueCatStore();
  const packages = sortedPackages(offering?.availablePackages ?? []);
  const annualPackage = packages.find(isAnnualPackage) ?? packages[0] ?? null;
  const monthlyPackage = packages.find(isMonthlyPackage) ?? packages.find((pkg) => pkg !== annualPackage) ?? null;
  const primarySubtitle = annualPackage && isAnnualPackage(annualPackage)
    ? monthlyEquivalentLabel(annualPackage)
    : null;

  const handlePurchase = async (pkg: PurchasesPackage | null) => {
    if (!pkg || purchasing) return;
    const unlocked = await purchase(pkg);
    if (unlocked) {
      Alert.alert('Angler unlocked', 'You now have full access to FinFindr.');
      onDismiss();
      onUnlocked?.();
    }
  };

  useEffect(() => {
    if (!visible) return;
    if (packages.length > 0 || loading) return;
    void refresh();
  }, [loading, packages.length, refresh, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TopographicLines
            style={styles.topoLines}
            color={paper.dashboardBlue}
            count={5}
          />
          <Pressable
            style={styles.closeBtn}
            onPress={onDismiss}
            hitSlop={12}
            accessibilityLabel="Close upgrade prompt"
          >
            <Ionicons name="close" size={17} color={paper.dashboardInk} />
          </Pressable>
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
          <Text style={styles.eyebrow}>FINFINDR · ANGLER</Text>
          <Text style={styles.title}>
            UNLOCK FISHING{'\n'}
            <Text style={styles.titleAccent}>INTELLIGENCE.</Text>
          </Text>
          <Text style={styles.message}>
            Angler opens full bite reports, tactical tackle direction, and
            structure intelligence for supported waters.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="analytics-outline" size={14} color={paper.dashboardBlue} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>Bite reports</Text>
                <Text style={styles.featureCopy}>
                  Full reports for today plus the next 6 days, including score,
                  drivers, windows, and guide-level context.
                </Text>
              </View>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="fish-outline" size={14} color={paper.dashboardBlue} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>Tackle Box</Text>
                <Text style={styles.featureCopy}>
                  Condition-matched lure and presentation picks tuned to your
                  water type, species, season, and daily conditions.
                </Text>
              </View>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="scan-outline" size={14} color={paper.dashboardBlue} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>Water Read</Text>
                <Text style={styles.featureCopy}>
                  Advanced intelligence that reads geometrical structure to
                  identify high percentage fishing zones.
                </Text>
              </View>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <View style={styles.planList}>
            {annualPackage ? (
              <Pressable
                style={({ pressed }) => [
                  styles.cta,
                  pressed && styles.ctaPressed,
                  purchasing === annualPackage.identifier && styles.planDisabled,
                ]}
                onPress={() => handlePurchase(annualPackage)}
                disabled={purchasing != null}
              >
                <View style={styles.planCopy}>
                  <Text style={styles.ctaText}>ANGLER ANNUAL</Text>
                  {primarySubtitle ? (
                    <Text style={styles.ctaSubtext}>({primarySubtitle})</Text>
                  ) : null}
                </View>
                <View style={styles.priceRow}>
                  {purchasing === annualPackage.identifier ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.ctaPrice}>{annualPackage.product.priceString}</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </>
                  )}
                </View>
              </Pressable>
            ) : loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={paper.dashboardBlue} />
                <Text style={styles.loadingText}>LOADING PLANS...</Text>
              </View>
            ) : (
              <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>PLANS NEED AN IOS DEV BUILD</Text>
              </View>
            )}

            {monthlyPackage ? (
              <Pressable
                style={({ pressed }) => [
                  styles.monthlyCta,
                  pressed && styles.monthlyCtaPressed,
                  purchasing === monthlyPackage.identifier && styles.planDisabled,
                ]}
                onPress={() => handlePurchase(monthlyPackage)}
                disabled={purchasing != null}
              >
                <View style={styles.planCopy}>
                  <Text style={styles.monthlyText}>ANGLER MONTHLY</Text>
                  <Text style={styles.monthlySubtext}>Flexible monthly access</Text>
                </View>
                {purchasing === monthlyPackage.identifier ? (
                  <ActivityIndicator size="small" color={paper.dashboardBlue} />
                ) : (
                  <Text style={styles.monthlyPrice}>{monthlyPackage.product.priceString}</Text>
                )}
              </Pressable>
            ) : null}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {onViewPlans ? (
            <Pressable
              style={({ pressed }) => [styles.secondaryLink, pressed && styles.secondaryLinkPressed]}
              onPress={onViewPlans}
            >
              <Text style={styles.secondaryLinkText}>VIEW MEMBERSHIP PAGE</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,27,46,0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: paperSpacing.lg,
  },
  card: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: 14,
    paddingBottom: paperSpacing.lg,
    width: '100%',
    maxWidth: 382,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  topoLines: {
    top: -34,
    left: -20,
    right: -20,
    height: 124,
    opacity: 0.1,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLockup: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: paper.dashboardInk,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    marginBottom: 4,
  },
  logo: {
    width: 38,
    height: 38,
    tintColor: '#FFFFFF',
  },
  brandText: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    lineHeight: 20,
    color: paper.dashboardInk,
    fontWeight: '700',
  },
  brandDot: {
    color: paper.dashboardBlue,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: paper.dashboardBlue,
    textAlign: 'center',
    marginBottom: 3,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 29,
    lineHeight: 31,
    color: paper.dashboardInk,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  titleAccent: {
    color: paper.dashboardBlue,
  },
  message: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.76,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 5,
    marginBottom: paperSpacing.sm,
  },
  featureList: {
    gap: 8,
    marginBottom: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    position: 'relative',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.25,
    borderColor: 'rgba(61,168,95,0.30)',
    backgroundColor: '#FBFCF8',
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
    fontSize: 12,
    lineHeight: 16,
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
  planList: {
    gap: paperSpacing.sm,
  },
  planCopy: {
    flex: 1,
    minWidth: 0,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: paperSpacing.sm,
  },
  planDisabled: {
    opacity: 0.72,
  },
  cta: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: paper.dashboardInk,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
  },
  ctaPressed: { opacity: 0.84 },
  ctaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: '#FFFFFF',
  },
  ctaSubtext: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 3,
  },
  ctaPrice: {
    fontFamily: paperFonts.display,
    fontSize: 21,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 0,
    color: '#FFFFFF',
  },
  monthlyCta: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1.25,
    borderColor: paper.dashboardInk,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
  },
  monthlyCtaPressed: { opacity: 0.78 },
  monthlyText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    letterSpacing: 1.8,
    color: paper.dashboardInk,
  },
  monthlySubtext: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11.5,
    lineHeight: 16,
    color: paper.dashboardMuted,
    marginTop: 3,
  },
  monthlyPrice: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '700',
    letterSpacing: 0,
    color: paper.dashboardInk,
  },
  loadingBox: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.7,
    color: paper.dashboardBlue,
  },
  errorText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
    color: paper.bandTough,
    textAlign: 'center',
    marginTop: paperSpacing.sm,
  },
  secondaryLink: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: paperSpacing.sm,
    marginTop: paperSpacing.xs,
  },
  secondaryLinkPressed: {
    opacity: 0.68,
  },
  secondaryLinkText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.7,
    color: paper.dashboardMuted,
  },
});
