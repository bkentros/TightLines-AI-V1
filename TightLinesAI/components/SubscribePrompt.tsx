/**
 * Subscribe Prompt — shown when a free user taps a gated feature.
 *
 * Visual layer (May 2026 field-edition pass):
 *   The modal is rebuilt as an extension of the FinFindr home dashboard's
 *   "field-edition" voice — navy header strip with a pulsing live dot, ink
 *   corner brackets and a vertical scan-line sweep on the body, a 6-tile
 *   forecast teaser using the 5-band scoring palette, three numbered
 *   "intelligence module" rows that mirror the home modules pattern (sky /
 *   gold / green icon tiles, mono TAG labels, Fraunces titles), and a
 *   primary Annual CTA decorated with a traveling sine wave, a shimmer
 *   sweep, and a floating BEST VALUE stamp. A signal-bars footer with a
 *   live pulse anchors the bottom edge.
 *
 * Functionality is unchanged from the prior implementation — same
 * `useRevenueCatStore` wiring, same purchase / refresh / dismiss /
 * unlocked callbacks, same Modal behavior, same scrollable card so the
 * content fits on every device.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PurchasesPackage } from 'react-native-purchases';
import { paper, paperFonts, paperSpacing } from '../lib/theme';
import {
  CornerMarkSet,
  PaperBestValueStamp,
  TopographicLines,
} from './paper';
import { useRevenueCatStore } from '../store/revenueCatStore';

// ─── Font shortcuts (match the home dashboard exactly) ───────────────────────
const SERIF_BOLD = paperFonts.display;
const SERIF_SEMI = paperFonts.displaySemiBold;
const SERIF_ITALIC = paperFonts.displayItalic;
const MONO = paperFonts.metaMono;
const MONO_BOLD = paperFonts.metaMonoBold;
const SANS_MEDIUM = paperFonts.bodyMedium;

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

/**
 * Approximate "save vs monthly" percent — used as the BEST VALUE stamp's
 * second line when both an annual and monthly package are present and
 * priced. We fall back to the static "BEST VALUE" label when the math
 * isn't trustworthy.
 */
function annualSavingsPercent(
  annual: PurchasesPackage | null,
  monthly: PurchasesPackage | null,
): number | null {
  const a = typeof annual?.product.price === 'number' ? annual.product.price : null;
  const m = typeof monthly?.product.price === 'number' ? monthly.product.price : null;
  if (a == null || m == null || a <= 0 || m <= 0) return null;
  const monthlyTotal = m * 12;
  if (monthlyTotal <= a) return null;
  return Math.round(((monthlyTotal - a) / monthlyTotal) * 100);
}

interface ModuleSpec {
  code: string;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  tag: string;
  desc: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
}

/**
 * Three intelligence modules — exact same accent palette / icon language /
 * mono TAG voice as the home dashboard's "INTELLIGENCE MODULES" section,
 * so the modal reads as a natural teaser of the unlocked dashboard.
 */
const UNLOCK_MODULES: ModuleSpec[] = [
  {
    code: '01',
    iconName: 'sparkles-outline',
    title: "Today's Bite",
    tag: 'CONDITIONS',
    desc: 'Full breakdown · windows · limiting factors',
    iconBg: '#C5E0B5',
    iconBorder: '#3DA85F',
    iconColor: '#1F6B38',
  },
  {
    code: '02',
    iconName: 'fish-outline',
    title: 'Tackle Box',
    tag: 'RECOMMENDER',
    desc: "Tuned picks for today's conditions & species",
    iconBg: '#F4DFA4',
    iconBorder: '#C99B2D',
    iconColor: '#8A6A1A',
  },
  {
    code: '03',
    iconName: 'layers-outline',
    title: 'Water Read',
    tag: 'POLYGON',
    desc: 'Most lakes: structure + potential hotspots',
    iconBg: '#C8DFF2',
    iconBorder: '#0F63B0',
    iconColor: '#0A4A87',
  },
];

/**
 * 5-band forecast teaser tiles — uses the same band ordering and colors as
 * the home forecast strip's legend (Tough → Prime), plus a leading TODAY
 * placeholder to evoke the full 6-tile row.
 */
const FORECAST_TEASER_TILES: Array<{
  day: string;
  date: string;
  color: string;
  label: string;
}> = [
  { day: 'MON', date: '17', color: paper.bandFair, label: 'FAIR' },
  { day: 'TUE', date: '18', color: paper.bandGood, label: 'GOOD' },
  { day: 'WED', date: '19', color: paper.bandPrime, label: 'PRIME' },
  { day: 'THU', date: '20', color: paper.bandGood, label: 'GOOD' },
  { day: 'FRI', date: '21', color: paper.bandPoor, label: 'POOR' },
  { day: 'SAT', date: '22', color: paper.bandFair, label: 'FAIR' },
];

export function SubscribePrompt({
  visible,
  onDismiss,
  onViewPlans,
  onUnlocked,
}: SubscribePromptProps) {
  const { loading, purchasing, error, offering, purchase, refresh } = useRevenueCatStore();
  const packages = sortedPackages(offering?.availablePackages ?? []);
  const annualPackage = packages.find(isAnnualPackage) ?? packages[0] ?? null;
  const monthlyPackage =
    packages.find(isMonthlyPackage) ?? packages.find((pkg) => pkg !== annualPackage) ?? null;
  const primarySubtitle =
    annualPackage && isAnnualPackage(annualPackage)
      ? monthlyEquivalentLabel(annualPackage)
      : null;
  const savings = annualSavingsPercent(annualPackage, monthlyPackage);

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

  // Live pulse for the header strip's dot — matches the home nav `livePill`.
  const headerPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(headerPulse, {
          toValue: 0.35,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(headerPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [headerPulse, visible]);

  // Vertical scan-line sweep — same animation language as the home live
  // conditions card. We measure the modules section so the sweep tracks the
  // actual unlocked-features area, not the full modal.
  const [scanHeight, setScanHeight] = useState(0);
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible || scanHeight <= 0) return;
    scanY.setValue(0);
    const loop = Animated.loop(
      Animated.timing(scanY, {
        toValue: 1,
        duration: 5200,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [scanHeight, scanY, visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* ─── Header strip (navy) ────────────────────────────────────── */}
          <View style={styles.headerStrip}>
            <View style={styles.headerLeft}>
              <View style={styles.headerLogoBadge}>
                <Image
                  source={require('../assets/images/finfindr-logo.png')}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.headerLockup}>
                <View style={styles.headerEyebrowRow}>
                  <Animated.View
                    style={[styles.headerLiveDot, { opacity: headerPulse }]}
                  />
                  <Text style={styles.headerEyebrow}>FINFINDR · ANGLER</Text>
                </View>
                <View style={styles.headerWordmarkRow}>
                  <Text style={styles.headerWordmark}>Field-Edition Access</Text>
                  <Text style={styles.headerWordmarkDot}>.</Text>
                </View>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.headerClose,
                pressed && { opacity: 0.7 },
              ]}
              onPress={onDismiss}
              hitSlop={12}
              accessibilityLabel="Close upgrade prompt"
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* ─── Body ──────────────────────────────────────────────────── */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.bodyInner}>
              <TopographicLines
                style={styles.topoLines}
                color={paper.dashboardBlue}
                count={5}
              />
              <CornerMarkSet
                color={paper.dashboardBlue}
                size={14}
                thickness={1.5}
                inset={10}
              />

              {/* Headline band */}
              <View style={styles.headlineBand}>
                <Text style={styles.headlineEyebrow}>── ALL-ACCESS · UNLOCK</Text>
                <Text style={styles.headline}>
                  Unlock fishing{'\n'}
                  <Text style={styles.headlineAccent}>intelligence</Text>
                  <Text style={styles.headlineDot}>.</Text>
                </Text>
                <Text style={styles.headlineKicker}>
                  Open the full field-edition planning system — built for the way
                  you actually fish.
                </Text>
              </View>

              {/* Forecast teaser strip */}
              <View style={styles.teaserSection}>
                <View style={styles.teaserHeaderRow}>
                  <Text style={styles.teaserEyebrow}>── 6-DAY BITE FORECAST</Text>
                  <View style={styles.teaserLockedChip}>
                    <Ionicons
                      name="lock-closed"
                      size={9}
                      color={paper.dashboardBlue}
                    />
                    <Text style={styles.teaserLockedText}>ANGLER</Text>
                  </View>
                </View>
                <View style={styles.teaserGrid}>
                  {FORECAST_TEASER_TILES.map((t, i) => (
                    <View key={i} style={styles.teaserTile}>
                      <View style={styles.teaserTileHead}>
                        <Text style={styles.teaserTileDay}>{t.day}</Text>
                        <Text style={styles.teaserTileDate}>{t.date}</Text>
                      </View>
                      <View
                        style={[
                          styles.teaserTileScore,
                          { backgroundColor: t.color },
                        ]}
                      >
                        <View style={styles.teaserTileLockVeil} />
                        <Ionicons
                          name="lock-closed"
                          size={11}
                          color="rgba(10,27,46,0.62)"
                        />
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.teaserLegend}>
                  {(['Tough', 'Poor', 'Fair', 'Good', 'Prime'] as const).map(
                    (band) => (
                      <View key={band} style={styles.teaserLegendItem}>
                        <View
                          style={[
                            styles.teaserLegendSwatch,
                            { backgroundColor: bandColor(band) },
                          ]}
                        />
                        <Text style={styles.teaserLegendLabel}>
                          {band.toUpperCase()}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>

              {/* Intelligence modules — wrapped in a sage-tinted "unlock" frame */}
              <View
                style={styles.modulesSection}
                onLayout={(e) => setScanHeight(e.nativeEvent.layout.height)}
              >
                <View style={styles.modulesHeaderRow}>
                  <View style={styles.modulesHeaderLeft}>
                    <View style={styles.modulesUnlockBadge}>
                      <Ionicons
                        name="lock-open"
                        size={10}
                        color="#1F6B38"
                      />
                    </View>
                    <Text style={styles.modulesEyebrow}>WHAT YOU UNLOCK</Text>
                  </View>
                  <View style={styles.modulesCountChip}>
                    <Text style={styles.modulesCount}>3 / 3</Text>
                  </View>
                </View>

                {/* Scan line sweep across the modules area */}
                {scanHeight > 0 && (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.scanLine,
                      {
                        transform: [
                          {
                            translateY: scanY.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-40, scanHeight + 40],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                )}

                {UNLOCK_MODULES.map((m) => (
                  <View key={m.code} style={styles.moduleRow}>
                    <View style={styles.moduleDots}>
                      <View
                        style={[
                          styles.moduleDot,
                          { backgroundColor: m.iconBorder, opacity: 0.5 },
                        ]}
                      />
                      <View
                        style={[
                          styles.moduleDot,
                          { backgroundColor: m.iconBorder, opacity: 0.7 },
                        ]}
                      />
                      <View
                        style={[
                          styles.moduleDot,
                          { backgroundColor: m.iconBorder },
                        ]}
                      />
                    </View>
                    <Text style={styles.moduleCode}>{m.code}</Text>
                    <View
                      style={[
                        styles.moduleIcon,
                        {
                          backgroundColor: m.iconBg,
                          borderColor: m.iconBorder + '60',
                        },
                      ]}
                    >
                      <Ionicons
                        name={m.iconName}
                        size={18}
                        color={m.iconColor}
                      />
                    </View>
                    <View style={styles.moduleTextCol}>
                      <View style={styles.moduleTitleRow}>
                        <Text style={styles.moduleTitle}>{m.title}</Text>
                        <Text style={styles.moduleTag}>{m.tag}</Text>
                      </View>
                      <Text
                        style={styles.moduleDesc}
                        numberOfLines={2}
                      >
                        {m.desc}
                      </Text>
                    </View>
                    <View style={styles.moduleCheck}>
                      <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                    </View>
                  </View>
                ))}
              </View>

              {/* Plans section */}
              <View style={styles.plansSection}>
                <Text style={styles.plansEyebrow}>── CHOOSE YOUR PLAN</Text>

                {annualPackage ? (
                  <View style={styles.annualWrap}>
                    <PaperBestValueStamp
                      topLine={savings != null ? `SAVE ${savings}%` : 'BEST'}
                      bottomLine="VALUE"
                      style={styles.bestValueStamp}
                    />
                    <Pressable
                      style={({ pressed }) => [
                        styles.annualCta,
                        pressed && styles.annualCtaPressed,
                        purchasing === annualPackage.identifier &&
                          styles.planDisabled,
                      ]}
                      onPress={() => handlePurchase(annualPackage)}
                      disabled={purchasing != null}
                    >
                      <CtaShimmer />
                      <View style={styles.annualCtaLeft}>
                        <View style={styles.annualCtaEyebrowRow}>
                          <View style={styles.annualCtaIconTile}>
                            <Ionicons
                              name="trophy"
                              size={12}
                              color={paper.dashboardInk}
                            />
                          </View>
                          <Text style={styles.annualCtaEyebrow}>
                            ANGLER · ANNUAL
                          </Text>
                        </View>
                        {primarySubtitle ? (
                          <Text style={styles.annualCtaSubtext}>
                            {primarySubtitle}
                          </Text>
                        ) : null}
                      </View>
                      <View style={styles.annualCtaRight}>
                        {purchasing === annualPackage.identifier ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <CtaWave />
                            <View style={styles.annualPriceCol}>
                              <Text style={styles.annualCtaPrice}>
                                {annualPackage.product.priceString}
                              </Text>
                              <Text style={styles.annualCtaPriceUnit}>/YR</Text>
                            </View>
                            <View style={styles.annualCtaArrowTile}>
                              <Ionicons
                                name="arrow-forward"
                                size={14}
                                color={paper.dashboardInk}
                              />
                            </View>
                          </>
                        )}
                      </View>
                    </Pressable>
                  </View>
                ) : loading ? (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator
                      size="small"
                      color={paper.dashboardBlue}
                    />
                    <Text style={styles.loadingText}>LOADING PLANS...</Text>
                  </View>
                ) : (
                  <View style={styles.loadingBox}>
                    <Text style={styles.loadingText}>
                      PLANS NEED AN IOS DEV BUILD
                    </Text>
                  </View>
                )}

                {monthlyPackage ? (
                  <Pressable
                    style={({ pressed }) => [
                      styles.monthlyCta,
                      pressed && styles.monthlyCtaPressed,
                      purchasing === monthlyPackage.identifier &&
                        styles.planDisabled,
                    ]}
                    onPress={() => handlePurchase(monthlyPackage)}
                    disabled={purchasing != null}
                  >
                    <View style={styles.monthlyLeft}>
                      <View style={styles.monthlyEyebrowRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={11}
                          color={paper.dashboardMuted}
                        />
                        <Text style={styles.monthlyEyebrow}>
                          ANGLER · MONTHLY
                        </Text>
                      </View>
                      <Text style={styles.monthlySubtext}>
                        Flexible · cancel any time
                      </Text>
                    </View>
                    {purchasing === monthlyPackage.identifier ? (
                      <ActivityIndicator
                        size="small"
                        color={paper.dashboardBlue}
                      />
                    ) : (
                      <View style={styles.monthlyPriceCol}>
                        <Text style={styles.monthlyPrice}>
                          {monthlyPackage.product.priceString}
                        </Text>
                        <Text style={styles.monthlyPriceUnit}>/MO</Text>
                      </View>
                    )}
                  </Pressable>
                ) : null}

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {onViewPlans ? (
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryLink,
                      pressed && styles.secondaryLinkPressed,
                    ]}
                    onPress={onViewPlans}
                  >
                    <Text style={styles.secondaryLinkText}>
                      VIEW MEMBERSHIP PAGE
                    </Text>
                    <Ionicons
                      name="arrow-up"
                      size={11}
                      color={paper.dashboardMuted}
                      style={{ transform: [{ rotate: '45deg' }] }}
                    />
                  </Pressable>
                ) : null}
              </View>

              {/* Footer stamp */}
              <View style={styles.footer}>
                <View style={styles.footerLeft}>
                  <Ionicons
                    name="boat-outline"
                    size={11}
                    color={paper.dashboardMuted}
                  />
                  <Text style={styles.footerStamp}>FINFINDR · ANGLER</Text>
                </View>
                <View style={styles.footerRight}>
                  <FooterLivePulse />
                  <View style={styles.signalBars}>
                    <View
                      style={[
                        styles.signalBar,
                        { height: 5, backgroundColor: paper.bandPrime },
                      ]}
                    />
                    <View
                      style={[
                        styles.signalBar,
                        { height: 7, backgroundColor: paper.bandPrime },
                      ]}
                    />
                    <View
                      style={[
                        styles.signalBar,
                        { height: 9, backgroundColor: paper.bandPrime },
                      ]}
                    />
                    <View
                      style={[
                        styles.signalBar,
                        { height: 11, backgroundColor: paper.bandPrime },
                      ]}
                    />
                  </View>
                  <Text style={styles.footerSecure}>SECURE · APP STORE</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal animated helpers — each is a tiny native-driven loop that mirrors
// the corresponding home-dashboard animation so the modal reads as part of
// the same instrument-panel family.
// ─────────────────────────────────────────────────────────────────────────────

/** Translates a soft vertical highlight across the Annual CTA. */
function CtaShimmer() {
  const [width, setWidth] = useState(0);
  const shimmerX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (width <= 0) return;
    shimmerX.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerX, width]);

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <Animated.View
          style={[
            styles.ctaShimmer,
            {
              transform: [
                {
                  translateX: shimmerX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-110, width + 110],
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
}

/**
 * Compact traveling sine-wave — visual echo of the home dashboard's
 * "Today's bite" CTA wave. Lives between the eyebrow text and the price
 * column inside the Annual CTA.
 */
function CtaWave() {
  const N = 14;
  const SEG_W = 2.2;
  const TOTAL_W = N * SEG_W;
  const phase = useRef(new Animated.Value(0)).current;
  const amp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const phaseLoop = Animated.loop(
      Animated.timing(phase, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const ampLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(amp, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(150),
        Animated.timing(amp, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ]),
    );
    phaseLoop.start();
    ampLoop.start();
    return () => {
      phaseLoop.stop();
      ampLoop.stop();
    };
  }, [phase, amp]);

  const segs = useMemo(() => {
    return Array.from({ length: N }, (_, i) => {
      const offset = i / N;
      const inputRange = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
      const outputRange = inputRange.map(
        (t) => Math.sin((t + offset) * 2 * Math.PI) * 3.5,
      );
      const sineY = phase.interpolate({ inputRange, outputRange });
      return Animated.multiply(sineY, amp);
    });
  }, [phase, amp]);

  return (
    <View
      style={{
        width: TOTAL_W,
        height: 14,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.85,
      }}
    >
      {segs.map((ty, i) => (
        <Animated.View
          key={i}
          style={{
            width: SEG_W,
            height: 1.3,
            backgroundColor: 'rgba(255,255,255,0.78)',
            transform: [{ translateY: ty }],
          }}
        />
      ))}
    </View>
  );
}

/** Pulsing dot used in the footer — mirrors the home dashboard footer. */
function FooterLivePulse() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <Animated.View style={[styles.footerLiveDot, { opacity: pulse }]} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

function bandColor(b: 'Tough' | 'Poor' | 'Fair' | 'Good' | 'Prime'): string {
  switch (b) {
    case 'Tough':
      return paper.bandTough;
    case 'Poor':
      return paper.bandPoor;
    case 'Fair':
      return paper.bandFair;
    case 'Good':
      return paper.bandGood;
    case 'Prime':
      return paper.bandPrime;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,27,46,0.68)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: paperSpacing.md,
  },
  card: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    width: '100%',
    maxWidth: 360,
    maxHeight: '88%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 14,
  },

  // ─── Header strip ────────────────────────────────────────────────────────
  headerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: paper.dashboardInk,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerLogoBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 28,
    height: 28,
  },
  headerLockup: {
    flex: 1,
  },
  headerEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  headerLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandPrime,
  },
  headerEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.6,
    color: 'rgba(255,255,255,0.78)',
  },
  headerWordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerWordmark: {
    fontFamily: SERIF_BOLD,
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 19,
  },
  headerWordmarkDot: {
    fontFamily: SERIF_BOLD,
    fontSize: 17,
    color: paper.dashboardBlueLight,
    lineHeight: 19,
    marginLeft: 1,
  },
  headerClose: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Body ────────────────────────────────────────────────────────────────
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingBottom: 0,
  },
  bodyInner: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    position: 'relative',
  },
  topoLines: {
    top: -20,
    left: -40,
    right: -40,
    height: 180,
    opacity: 0.09,
  },

  // ─── Headline band ───────────────────────────────────────────────────────
  headlineBand: {
    marginBottom: 14,
  },
  headlineEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#444',
    marginBottom: 6,
  },
  headline: {
    fontFamily: SERIF_BOLD,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: paper.dashboardInk,
  },
  headlineAccent: {
    fontFamily: SERIF_ITALIC,
    fontStyle: 'italic',
    color: paper.dashboardBlue,
    fontSize: 26,
    lineHeight: 29,
  },
  headlineDot: {
    fontFamily: SERIF_BOLD,
    color: paper.dashboardBlue,
  },
  headlineKicker: {
    fontFamily: SERIF_ITALIC,
    fontStyle: 'italic',
    fontSize: 12.5,
    lineHeight: 17,
    color: paper.dashboardInk,
    opacity: 0.7,
    marginTop: 7,
  },

  // ─── Forecast teaser (slim) ──────────────────────────────────────────────
  teaserSection: {
    marginBottom: 14,
  },
  teaserHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teaserEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.8,
    color: '#444',
  },
  teaserLockedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.30)',
    backgroundColor: 'rgba(42,110,150,0.08)',
  },
  teaserLockedText: {
    fontFamily: MONO_BOLD,
    fontSize: 7.5,
    letterSpacing: 1.3,
    color: paper.dashboardBlue,
  },
  teaserGrid: {
    flexDirection: 'row',
    gap: 4,
  },
  teaserTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(10,27,46,0.14)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  teaserTileHead: {
    paddingVertical: 3,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardHair,
  },
  teaserTileDay: {
    fontFamily: MONO_BOLD,
    fontSize: 7,
    letterSpacing: 0.9,
    color: paper.dashboardMuted,
    lineHeight: 8,
  },
  teaserTileDate: {
    fontFamily: SERIF_SEMI,
    fontSize: 10,
    color: paper.dashboardInk,
    marginTop: 1,
    lineHeight: 11,
  },
  teaserTileScore: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  teaserTileLockVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  teaserLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  teaserLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  teaserLegendSwatch: {
    width: 6,
    height: 6,
    borderRadius: 1.5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
  },
  teaserLegendLabel: {
    fontFamily: MONO_BOLD,
    fontSize: 7,
    letterSpacing: 1,
    color: '#444',
  },

  // ─── Modules (sage-tinted "unlock" frame) ────────────────────────────────
  modulesSection: {
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#F2FAF4',
    borderWidth: 1.25,
    borderColor: 'rgba(61,168,95,0.38)',
    borderRadius: 12,
    padding: 10,
    paddingTop: 8,
    overflow: 'hidden',
  },
  modulesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  modulesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modulesUnlockBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#CFEFD7',
    borderWidth: 1,
    borderColor: 'rgba(31,107,56,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modulesEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9.5,
    letterSpacing: 1.8,
    color: '#1F6B38',
  },
  modulesCountChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(61,168,95,0.30)',
  },
  modulesCount: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 0.8,
    color: '#1F6B38',
  },
  scanLine: {
    position: 'absolute',
    left: -8,
    right: -8,
    height: 40,
    backgroundColor: 'rgba(61,168,95,0.10)',
    borderRadius: 4,
    zIndex: 1,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFEFB',
    borderWidth: 1,
    borderColor: 'rgba(61,168,95,0.32)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    gap: 9,
    position: 'relative',
    zIndex: 2,
  },
  moduleDots: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    gap: 1.5,
  },
  moduleDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  moduleCode: {
    fontFamily: MONO_BOLD,
    fontSize: 8.5,
    letterSpacing: 1,
    color: 'rgba(31,107,56,0.55)',
  },
  moduleIcon: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTextCol: {
    flex: 1,
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 1,
  },
  moduleTitle: {
    fontFamily: SERIF_SEMI,
    fontSize: 14,
    color: paper.dashboardInk,
  },
  moduleTag: {
    fontFamily: MONO_BOLD,
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
  },
  moduleDesc: {
    fontFamily: SANS_MEDIUM,
    fontSize: 10.5,
    lineHeight: 13,
    color: '#555',
  },
  moduleCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: paper.bandPrime,
    borderWidth: 1,
    borderColor: 'rgba(10,27,46,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Plans ───────────────────────────────────────────────────────────────
  plansSection: {
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.md,
  },
  plansEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 9.5,
    letterSpacing: 2,
    color: '#444',
    marginBottom: 4,
  },
  annualWrap: {
    position: 'relative',
  },
  bestValueStamp: {
    position: 'absolute',
    top: -10,
    right: 8,
    zIndex: 4,
    transform: [{ rotate: '4deg' }],
  },
  annualCta: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: paper.dashboardInk,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    paddingHorizontal: 14,
    paddingVertical: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  annualCtaPressed: {
    opacity: 0.86,
  },
  ctaShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 110,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  annualCtaLeft: {
    flex: 1,
    minWidth: 0,
  },
  annualCtaEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  annualCtaIconTile: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: paper.bandFair,
    alignItems: 'center',
    justifyContent: 'center',
  },
  annualCtaEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 11,
    letterSpacing: 1.8,
    color: '#FFFFFF',
  },
  annualCtaSubtext: {
    fontFamily: SERIF_ITALIC,
    fontStyle: 'italic',
    fontSize: 12.5,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.74)',
    marginTop: 4,
  },
  annualCtaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  annualPriceCol: {
    alignItems: 'flex-end',
  },
  annualCtaPrice: {
    fontFamily: SERIF_BOLD,
    fontSize: 22,
    lineHeight: 24,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  annualCtaPriceUnit: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 1,
  },
  annualCtaArrowTile: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthlyCta: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1.25,
    borderColor: paper.dashboardInk,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  monthlyCtaPressed: {
    opacity: 0.82,
  },
  monthlyLeft: {
    flex: 1,
    minWidth: 0,
  },
  monthlyEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthlyEyebrow: {
    fontFamily: MONO_BOLD,
    fontSize: 10.5,
    letterSpacing: 1.8,
    color: paper.dashboardInk,
  },
  monthlySubtext: {
    fontFamily: SERIF_ITALIC,
    fontStyle: 'italic',
    fontSize: 11.5,
    lineHeight: 16,
    color: paper.dashboardMuted,
    marginTop: 3,
  },
  monthlyPriceCol: {
    alignItems: 'flex-end',
  },
  monthlyPrice: {
    fontFamily: SERIF_BOLD,
    fontSize: 19,
    lineHeight: 21,
    color: paper.dashboardInk,
    letterSpacing: -0.4,
  },
  monthlyPriceUnit: {
    fontFamily: MONO_BOLD,
    fontSize: 8,
    letterSpacing: 1.2,
    color: paper.dashboardMuted,
    marginTop: 1,
  },

  planDisabled: {
    opacity: 0.72,
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
    fontFamily: MONO_BOLD,
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
    flexDirection: 'row',
    gap: 6,
    paddingVertical: paperSpacing.sm,
    marginTop: paperSpacing.xs,
  },
  secondaryLinkPressed: {
    opacity: 0.6,
  },
  secondaryLinkText: {
    fontFamily: MONO_BOLD,
    fontSize: 10,
    letterSpacing: 1.7,
    color: paper.dashboardMuted,
  },

  // ─── Footer ──────────────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.10)',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerStamp: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.bandPrime,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
  },
  signalBar: {
    width: 2,
    borderRadius: 1,
  },
  footerSecure: {
    fontFamily: MONO_BOLD,
    fontSize: 9,
    letterSpacing: 1.4,
    color: paper.dashboardMuted,
  },
});

// Silence unused `MONO` warning on TS configs where it's only conditionally
// referenced — it's part of the public font shortcut block so future styles
// can use it without re-importing from theme.
void MONO;
