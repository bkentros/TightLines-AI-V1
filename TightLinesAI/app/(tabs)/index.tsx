import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { LiveConditionsWidget } from '../../components/LiveConditionsWidget';
import { useAuthStore } from '../../store/authStore';
import { useDevTestingStore } from '../../store/devTestingStore';
import { useEnvStore } from '../../store/envStore';

/* ─── Brand mark — fish + crosshair ─── */
const MARK_SIZE = 30;
function BrandMark() {
  const tick = { backgroundColor: colors.sage, borderRadius: 1 };
  return (
    <View style={markStyles.wrap}>
      <View style={markStyles.ring} />
      <View style={[markStyles.tickH, tick, markStyles.tickN]} />
      <View style={[markStyles.tickV, tick, markStyles.tickE]} />
      <View style={[markStyles.tickH, tick, markStyles.tickS]} />
      <View style={[markStyles.tickV, tick, markStyles.tickW]} />
      <Ionicons name="fish" size={14} color={colors.sage} />
    </View>
  );
}

const markStyles = StyleSheet.create({
  wrap: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: MARK_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.sage,
  },
  tickH: { position: 'absolute', width: 6, height: 1.5 },
  tickV: { position: 'absolute', width: 1.5, height: 6 },
  tickN: { top: -1, alignSelf: 'center' },
  tickS: { bottom: -1, alignSelf: 'center' },
  tickE: { right: -1 },
  tickW: { left: -1 },
});

/* ─── Scan-target icon composition ─── */
function ScanIcon({
  icon,
  iconColor,
  ringColor,
}: {
  icon: string;
  iconColor: string;
  ringColor: string;
}) {
  const tickStyle = { backgroundColor: ringColor, borderRadius: 1 };

  return (
    <View style={scanStyles.wrap}>
      <View style={[scanStyles.ring, { borderColor: ringColor }]} />
      <View style={[scanStyles.tickH, tickStyle, scanStyles.tickN]} />
      <View style={[scanStyles.tickV, tickStyle, scanStyles.tickE]} />
      <View style={[scanStyles.tickH, tickStyle, scanStyles.tickS]} />
      <View style={[scanStyles.tickV, tickStyle, scanStyles.tickW]} />
      <Ionicons name={icon as any} size={22} color={iconColor} />
    </View>
  );
}

const SCAN_SIZE = 52;
const scanStyles = StyleSheet.create({
  wrap: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SCAN_SIZE / 2,
    borderWidth: 1.5,
  },
  tickH: { position: 'absolute', width: 8, height: 1.5 },
  tickV: { position: 'absolute', width: 1.5, height: 8 },
  tickN: { top: -1, alignSelf: 'center' },
  tickS: { bottom: -1, alignSelf: 'center' },
  tickE: { right: -1 },
  tickW: { left: -1 },
});

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { ignoreGps, overrideLocation, load: loadDevTesting } = useDevTestingStore();
  const { loadEnv } = useEnvStore();
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsLocationLabel, setGpsLocationLabel] = useState<string | null>(null);

  // Reverse-geocode GPS to get "City, State" for the location label
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

  // Auto-sync Live Conditions when returning to Home tab (uses cache; refetches if > 15 min)
  useFocusEffect(
    useCallback(() => {
      const units = profile?.preferred_units ?? 'imperial';
      const c =
        __DEV__ && overrideLocation
          ? { lat: overrideLocation.lat, lon: overrideLocation.lon }
          : __DEV__ && ignoreGps
            ? null
            : gpsCoords;
      if (c) {
        loadEnv(c.lat, c.lon, { units });
      }
    }, [profile?.preferred_units, overrideLocation, ignoreGps, gpsCoords, loadEnv])
  );

  // Always use active GPS; dev overrides only affect what we pass to Live Conditions
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
        // Silently fail — widget will show "Sync location"
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (__DEV__) loadDevTesting();
  }, [loadDevTesting]);

  // Dev overrides: ignore GPS = no location; override = use manual coords
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
            <BrandMark />
            <Text style={styles.brand}>TightLines AI</Text>
          </View>
          <View style={styles.accentLine} />
          <Text style={styles.greeting}>
            {getGreeting()}. What's the plan?
          </Text>
        </View>

        {/* ─── Live Conditions Widget ─── */}
        <LiveConditionsWidget
          latitude={coords?.lat}
          longitude={coords?.lon}
          locationLabel={locationLabel}
        />

        {/* ─── How's Fishing Right Now? ─── */}
        <Pressable
          style={({ pressed }) => [
            styles.fishingBtn,
            pressed && styles.fishingBtnPressed,
          ]}
        >
          <View style={styles.fishingBtnLeft}>
            <Ionicons name="pulse" size={18} color={colors.sage} />
            <Text style={styles.fishingBtnText}>
              How's Fishing Right Now?
            </Text>
          </View>
          <View style={styles.tierPill}>
            <Text style={styles.tierPillText}>Angler+</Text>
          </View>
        </Pressable>

        {/* ─── Feature Tiles ─── */}
        <View style={styles.tiles}>
          {/* Lure & Fly Recommender */}
          <Pressable
            style={({ pressed }) => [
              styles.tile,
              styles.tileSage,
              pressed && styles.tileLightPressed,
            ]}
            onPress={() => router.push('/recommender')}
          >
            <View style={styles.tileInner}>
              <View style={styles.tileTop}>
                <ScanIcon
                  icon="fish"
                  iconColor={colors.sage}
                  ringColor={colors.sage}
                />
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
              <Text style={styles.tileTitle}>
                Lure & Fly Recommender
              </Text>
              <Text style={styles.tileDesc}>
                AI-powered tackle recommendations tailored to real-time
                conditions, target species, and water.
              </Text>
              <View style={[styles.aiBadgeDark, styles.aiBadgeSage]}>
                <Ionicons name="sparkles" size={11} color={colors.sage} />
                <Text style={[styles.aiBadgeDarkText, { color: colors.sage }]}>AI-Powered</Text>
              </View>
            </View>
          </Pressable>

          {/* Water Reader */}
          <Pressable
            style={({ pressed }) => [
              styles.tile,
              styles.tileBlue,
              pressed && styles.tileLightPressed,
            ]}
            onPress={() => router.push('/water-reader')}
          >
            <View style={styles.tileInner}>
              <View style={styles.tileTop}>
                <ScanIcon
                  icon="scan"
                  iconColor={colors.waterBlue}
                  ringColor={colors.waterBlue}
                />
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
              <Text style={styles.tileTitle}>Water Reader</Text>
              <Text style={styles.tileDesc}>
                Analyze river photos, satellite lake images, and depth charts
                with AI-powered visual overlays.
              </Text>
              <View style={[styles.aiBadgeDark, styles.aiBadgeBlue]}>
                <Ionicons name="sparkles" size={11} color={colors.waterBlue} />
                <Text style={[styles.aiBadgeDarkText, { color: colors.waterBlue }]}>
                  AI-Powered
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Trip Planner — Coming Soon */}
          <View style={[styles.tile, styles.tileComingSoon]}>
            <View style={styles.tileInner}>
              <View style={styles.tileTop}>
                <View style={styles.iconCirclePlanner}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={colors.plannerYellow}
                  />
                </View>
                <View style={styles.comingSoon}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </View>
              <Text style={styles.tileTitlePlanner}>Trip Planner</Text>
              <Text style={styles.tileDescPlanner}>
                Plan your next trip with ranked fishing windows based on
                weather, tides, and solunar data.
              </Text>
            </View>
            {/* Tinted overlay */}
            <View style={styles.plannerOverlay} pointerEvents="none" />
          </View>
        </View>

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
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  /* Header */
  header: { paddingTop: spacing.xl, marginBottom: spacing.lg },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  brand: {
    fontFamily: fonts.serif,
    fontSize: 34,
    color: colors.text,
    letterSpacing: 0.5,
  },
  accentLine: {
    width: 48,
    height: 3,
    backgroundColor: colors.sage,
    borderRadius: 2,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  greeting: { fontSize: 16, color: colors.textSecondary },

  /* Fishing Button */
  fishingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.sage + '40',
  },
  fishingBtnPressed: { backgroundColor: colors.sageLight },
  fishingBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fishingBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.sage,
  },
  tierPill: {
    backgroundColor: colors.warmTan,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  tierPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textLight,
    letterSpacing: 0.3,
  },

  /* Tiles */
  tiles: { gap: spacing.md },
  tile: {
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  tileSage: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sage,
  },
  tileBlue: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.waterBlue,
  },
  tileLightPressed: {
    backgroundColor: colors.surfacePressed,
  },
  tileComingSoon: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.plannerYellow + '99',
    position: 'relative',
  },
  plannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background + 'A0',
    borderRadius: radius.md,
  },
  tileInner: { padding: spacing.md + 2 },
  tileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  tileTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tileDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  tileTitleLight: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.tileDarkText,
    marginBottom: spacing.xs,
  },
  tileDescLight: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.tileDarkSub,
  },
  tileTitlePlanner: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tileDescPlanner: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  iconCirclePlanner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.plannerYellow + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBadgeDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  aiBadgeSage: {
    backgroundColor: colors.sageLight,
  },
  aiBadgeBlue: {
    backgroundColor: colors.waterBlue + '22',
  },
  aiBadgeDarkText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.sage,
    letterSpacing: 0.2,
  },
  comingSoon: {
    backgroundColor: colors.plannerYellow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tagline: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
