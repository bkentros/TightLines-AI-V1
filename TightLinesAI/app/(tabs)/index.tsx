import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus, View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius, shadows } from '../../lib/theme';
import { LiveConditionsWidget } from '../../components/LiveConditionsWidget';
import { SubscribePrompt } from '../../components/SubscribePrompt';
import { useAuthStore } from '../../store/authStore';
import { useDevTestingStore } from '../../store/devTestingStore';
import { useEnvStore } from '../../store/envStore';
import { getEffectiveTier, canUseAIFeatures } from '../../lib/subscription';
import { getCurrentMultiRebuild, getCachedMultiRebuild } from '../../lib/howFishing';
import type { EngineContextKey } from '../../lib/howFishingRebuildContracts';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { ignoreGps, overrideLocation, overrideSubscriptionTier, load: loadDevTesting } = useDevTestingStore();
  const { loadEnv } = useEnvStore();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastAutoRefreshAtRef = useRef(0);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsLocationLabel, setGpsLocationLabel] = useState<string | null>(null);
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [cachedScore, setCachedScore] = useState<string | null>(null);

  useEffect(() => {
    if (!gpsCoords) {
      setGpsLocationLabel(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: gpsCoords.lat,
          longitude: gpsCoords.lon,
        });
        if (cancelled || !geo) return;
        const city = geo.city ?? geo.subregion ?? geo.district;
        const region = geo.region ?? '';
        const label = city && region ? `${city}, ${region}` : city ?? region ?? null;
        if (!cancelled) setGpsLocationLabel(label);
      } catch {
        if (!cancelled) setGpsLocationLabel(null);
      }
    })();
    return () => { cancelled = true; };
  }, [gpsCoords?.lat, gpsCoords?.lon]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setGpsCoords({
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          });
        }
      } catch {
        // Silently fail
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (__DEV__) loadDevTesting();
  }, [loadDevTesting]);

  // Read the cached fishing score — no API call, purely local cache.
  // Since the engine is deterministic, the score from the last generated
  // report is valid for today. Shows the best score across all water types.
  useEffect(() => {
    const ALL_CONTEXTS: EngineContextKey[] = ['freshwater_lake_pond', 'freshwater_river', 'coastal'];
    let cancelled = false;

    async function loadCachedScore() {
      const lat = coords?.lat;
      const lon = coords?.lon;
      if (lat == null || lon == null) return;

      // Try in-memory first (instant, no I/O)
      const inMemory = getCurrentMultiRebuild(lat, lon);
      const source = inMemory
        ?? await getCachedMultiRebuild(lat, lon, ALL_CONTEXTS);

      if (cancelled || !source) return;

      // Take the best score across all available water types
      const best = Math.max(
        ...ALL_CONTEXTS.map(ctx => source[ctx]?.report.score ?? -1)
      );
      if (best < 0) return;

      const v = Math.round(best) / 10;
      const display = Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
      if (!cancelled) setCachedScore(display);
    }

    loadCachedScore();
    return () => { cancelled = true; };
  }, [coords?.lat, coords?.lon]);

  const coords =
    __DEV__ && ignoreGps
      ? null
      : __DEV__ && overrideLocation
        ? { lat: overrideLocation.lat, lon: overrideLocation.lon }
        : gpsCoords;

  const locationLabel =
    __DEV__ && overrideLocation
      ? overrideLocation.label
      : gpsLocationLabel ?? 'Current location';

  const refreshLiveConditions = useCallback(() => {
    const now = Date.now();
    if (now - lastAutoRefreshAtRef.current < 3000) return;
    lastAutoRefreshAtRef.current = now;

    const units = profile?.preferred_units ?? 'imperial';
    const currentCoords =
      __DEV__ && overrideLocation
        ? { lat: overrideLocation.lat, lon: overrideLocation.lon }
        : __DEV__ && ignoreGps
          ? null
          : gpsCoords;

    if (currentCoords) {
      loadEnv(currentCoords.lat, currentCoords.lon, { units });
    }
  }, [profile?.preferred_units, overrideLocation, ignoreGps, gpsCoords, loadEnv]);

  useFocusEffect(
    useCallback(() => {
      refreshLiveConditions();
      // Refresh the cached score when user returns to the home tab,
      // so a newly-generated report immediately updates the displayed number.
      if (coords) {
        const ALL_CONTEXTS: EngineContextKey[] = ['freshwater_lake_pond', 'freshwater_river', 'coastal'];
        const inMemory = getCurrentMultiRebuild(coords.lat, coords.lon);
        if (inMemory) {
          const best = Math.max(...ALL_CONTEXTS.map(ctx => inMemory[ctx]?.report.score ?? -1));
          if (best >= 0) {
            const v = Math.round(best) / 10;
            setCachedScore(Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1));
          }
        }
      }
    }, [refreshLiveConditions, coords])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const wasBackgrounded =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';
      if (wasBackgrounded && nextAppState === 'active') {
        refreshLiveConditions();
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, [refreshLiveConditions]);

  const effectiveTier = getEffectiveTier(profile, overrideSubscriptionTier ?? null);
  const hasSubscription = canUseAIFeatures(effectiveTier);

  const handleHowFishingPress = useCallback(() => {
    if (!hasSubscription) {
      setShowSubscribePrompt(true);
      return;
    }
    if (!coords) {
      router.push({ pathname: '/how-fishing' });
      return;
    }
    router.push({
      pathname: '/how-fishing',
      params: { lat: String(coords.lat), lon: String(coords.lon) },
    });
  }, [hasSubscription, coords, router]);

  const handleRequestLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setGpsCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 5) return 'Up early';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Evening';
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <Ionicons name="fish" size={16} color={colors.textOnPrimary} />
            </View>
            <Text style={styles.brand}>TightLines AI</Text>
          </View>
          <Text style={styles.greeting}>
            {getGreeting()}. What's the plan?
          </Text>
        </View>

        {/* ─── Hero: How's Fishing Right Now? ─── */}
        <Pressable
          style={({ pressed }) => [
            styles.heroCard,
            pressed && styles.heroCardPressed,
          ]}
          onPress={handleHowFishingPress}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <View style={styles.heroBadge}>
                <Ionicons name="sparkles" size={10} color={colors.primary} />
                <Text style={styles.heroBadgeText}>AI-Enhanced</Text>
              </View>
              <Text style={styles.heroTitle}>How's Fishing{'\n'}Right Now?</Text>
              <Text style={styles.heroSubtitle}>
                Real-time conditions, timing, and strategy
              </Text>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.heroPulseOuter}>
                <View style={styles.heroPulseInner}>
                  <Ionicons name="pulse" size={24} color={colors.primary} />
                </View>
              </View>
              {cachedScore !== null && (
                <Text style={styles.heroScoreNum}>{cachedScore}</Text>
              )}
            </View>
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>View today's report</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </View>
        </Pressable>

        <SubscribePrompt
          visible={showSubscribePrompt}
          onDismiss={() => setShowSubscribePrompt(false)}
          onViewPlans={() => {
            setShowSubscribePrompt(false);
            router.push('/subscribe');
          }}
        />

        {/* ─── Live Conditions ─── */}
        <LiveConditionsWidget
          latitude={coords?.lat}
          longitude={coords?.lon}
          locationLabel={locationLabel}
          onRequestLocation={
            __DEV__ && ignoreGps ? undefined : handleRequestLocation
          }
          onPress={handleHowFishingPress}
        />

        {/* ─── Section Label ─── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tools</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* ─── Feature Tiles ─── */}
        <View style={styles.tiles}>
          {/* Lure & Fly Recommender */}
          <Pressable
            style={({ pressed }) => [
              styles.featureCard,
              pressed && styles.featureCardPressed,
            ]}
            onPress={() => router.push('/recommender')}
          >
            <View style={styles.featureTop}>
              <View style={[styles.featureIconWrap, { backgroundColor: colors.primaryMist }]}>
                <Ionicons name="fish" size={20} color={colors.primary} />
              </View>
              <View style={styles.featureArrow}>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </View>
            <Text style={styles.featureTitle}>Lure & Fly Recommender</Text>
            <Text style={styles.featureDesc}>
              AI-powered tackle picks tailored to real-time conditions and target species.
            </Text>
            <View style={[styles.aiBadge, { backgroundColor: colors.primaryMist }]}>
              <Ionicons name="sparkles" size={10} color={colors.primary} />
              <Text style={[styles.aiBadgeText, { color: colors.primary }]}>AI-Powered</Text>
            </View>
          </Pressable>

          {/* Water Reader */}
          <Pressable
            style={({ pressed }) => [
              styles.featureCard,
              pressed && styles.featureCardPressed,
            ]}
            onPress={() => router.push('/water-reader')}
          >
            <View style={styles.featureTop}>
              <View style={[styles.featureIconWrap, { backgroundColor: colors.waterBlue + '14' }]}>
                <Ionicons name="scan" size={20} color={colors.waterBlue} />
              </View>
              <View style={styles.featureArrow}>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </View>
            <Text style={styles.featureTitle}>Water Reader</Text>
            <Text style={styles.featureDesc}>
              Analyze river photos and satellite images with AI-powered visual overlays.
            </Text>
            <View style={[styles.aiBadge, { backgroundColor: colors.waterBlue + '14' }]}>
              <Ionicons name="sparkles" size={10} color={colors.waterBlue} />
              <Text style={[styles.aiBadgeText, { color: colors.waterBlue }]}>AI-Powered</Text>
            </View>
          </Pressable>

          {/* Trip Planner — Coming Soon */}
          <View style={styles.featureCardDisabled}>
            <View style={styles.featureTop}>
              <View style={[styles.featureIconWrap, { backgroundColor: colors.plannerYellow + '14' }]}>
                <Ionicons name="calendar-outline" size={20} color={colors.plannerYellow} />
              </View>
              <View style={styles.comingSoonPill}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            </View>
            <Text style={styles.featureTitleDisabled}>Trip Planner</Text>
            <Text style={styles.featureDescDisabled}>
              Plan your trip with ranked fishing windows from weather, tides, and solunar data.
            </Text>
          </View>
        </View>

        {/* ─── Tagline ─── */}
        <Text style={styles.tagline}>
          Tight lines start with better intel.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: spacing.xxl },

  /* Header */
  header: { paddingTop: spacing.xl, marginBottom: spacing.lg },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  brandIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    letterSpacing: 0.3,
  },
  greeting: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  /* Hero Card — How's Fishing */
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    ...shadows.lg,
  },
  heroCardPressed: {
    backgroundColor: colors.primaryMist,
    transform: [{ scale: 0.985 }],
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  heroLeft: { flex: 1, paddingRight: spacing.md },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryMist,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm + 2,
  },
  heroBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.text,
    lineHeight: 30,
    marginBottom: spacing.xs + 2,
  },
  heroSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
  },
  heroPulseOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPulseInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroScoreNum: {
    fontFamily: fonts.serifBold,
    fontSize: 17,
    color: colors.primary,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heroFooterText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary,
  },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  /* Feature Cards */
  tiles: { gap: spacing.md },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  featureCardPressed: {
    backgroundColor: colors.surfacePressed,
    transform: [{ scale: 0.985 }],
  },
  featureCardDisabled: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.55,
  },
  featureTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureTitleDisabled: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  featureDescDisabled: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm + 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  aiBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  comingSoonPill: {
    backgroundColor: colors.plannerYellow,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  comingSoonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  tagline: {
    fontFamily: fonts.bodyItalic,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
});
