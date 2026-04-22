/**
 * Paper-styled Live Conditions card — the FinFindr "RIGHT NOW" block.
 *
 * This is the Home-screen rendering of the same data that powers
 * `LiveConditionsWidget`. We read from the same stores (`useEnvStore`,
 * `useAuthStore`) so any refresh/fetch logic is unchanged; only the visual
 * layer differs. The older widget file is still intact and available for any
 * screen that hasn't been migrated yet.
 *
 * Data source: identical to `LiveConditionsWidget` — see that file's comments.
 * We keep ALL of its behavior concerns:
 *   - auto-load env on coord changes
 *   - 60s clock tick for "N min ago"
 *   - rate-limit banner for error strings containing "Please wait"
 *   - location permission prompt when coords are missing
 *
 * Visual refinements (Home fidelity correction pass):
 *   - Big air temperature renders on its own line below the sky headline so
 *     large numbers never clip on narrow screens.
 *   - Faint compass rose sits behind the header for the map/marginalia feel.
 *   - A swimming fish drifts across the card bottom.
 *   - Four equal metric columns with dashed vertical separators.
 *   - "WATER" tile dropped in favor of HUMIDITY, which is reliably returned
 *     from `weather.humidity` (measured water temp is coastal-only and was
 *     rendering "—" most of the time).
 */

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEnvStore } from '../../store/envStore';
import { useAuthStore } from '../../store/authStore';
import type { EnvironmentData } from '../../lib/env';
import type { WeatherData } from '../../lib/env/types';
import { CACHE_TTL_MS } from '../../lib/env/constants';
import {
  paper,
  paperFonts,
  paperRadius,
  paperSpacing,
  paperShadows,
  paperBorders,
} from '../../lib/theme';
import { CornerMarkSet } from './CornerMark';
import { CompassRose } from './CompassRose';
import { SwimmingFish } from './SwimmingFish';

function windDirectionLabel(deg: number): string {
  const cards = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? '—';
}

function moonLabel(phase: string | undefined, illumination: number | undefined): string {
  if (phase && phase !== 'Unknown') return phase;
  if (illumination == null) return '—';
  if (illumination <= 0.05) return 'New Moon';
  if (illumination <= 0.4) return 'Crescent';
  if (illumination <= 0.6) return 'Half';
  if (illumination <= 0.9) return 'Gibbous';
  return 'Full Moon';
}

function cloudSkyLabel(pct: number): string {
  if (pct <= 15) return 'Clear Skies';
  if (pct <= 35) return 'Partly Cloudy';
  if (pct <= 65) return 'Cloudy';
  return 'Overcast';
}

function pressureTrendWord(
  trend: string | undefined,
): { word: string; sub: string } {
  switch (trend) {
    case 'rapidly_falling': return { word: 'Dropping', sub: 'rapid' };
    case 'slowly_falling':  return { word: 'Falling',  sub: 'steady' };
    case 'stable':          return { word: 'Steady',   sub: 'flat' };
    case 'slowly_rising':   return { word: 'Rising',   sub: 'steady' };
    case 'rapidly_rising':  return { word: 'Rising',   sub: 'rapid' };
    default:                return { word: 'Steady',   sub: '—' };
  }
}

function humiditySubLabel(pct: number): string {
  if (pct <= 35) return 'dry air';
  if (pct <= 55) return 'comfortable';
  if (pct <= 75) return 'moist';
  return 'heavy / sticky';
}

function skyMoodLine(pct: number | undefined): string {
  if (pct == null) return '';
  if (pct <= 15) return 'bright and clear on the water';
  if (pct <= 35) return 'some sun, some cover';
  if (pct <= 65) return 'cloud cover softens the light';
  return 'overcast can stretch the bite';
}

function friendlyConditionsError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('please wait')) {
    return 'Conditions are refreshing too often. Give it a moment and try again.';
  }
  if (
    lower.includes('network') ||
    lower.includes('fetch') ||
    lower.includes('server') ||
    lower.includes('timeout')
  ) {
    return 'Could not load conditions for this spot. Check your connection and try again.';
  }
  return message;
}

export interface LiveConditionsPaperCardProps {
  latitude?: number | null;
  longitude?: number | null;
  locationLabel?: string;
  onRequestLocation?: () => Promise<void>;
  onPress?: () => void;
}

export function LiveConditionsPaperCard({
  latitude,
  longitude,
  onRequestLocation,
  onPress,
}: LiveConditionsPaperCardProps) {
  const { envData, isLoading, error, loadEnv } = useEnvStore();
  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';
  const [locationSyncing, setLocationSyncing] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const hasCoords =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  useEffect(() => {
    if (hasCoords) loadEnv(latitude!, longitude!, { units });
  }, [hasCoords, latitude, longitude, units]);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const handleRequestLocation = async () => {
    if (!onRequestLocation) return;
    setLocationSyncing(true);
    try {
      await onRequestLocation();
    } catch {
      Alert.alert('Could not get location', 'Enable location in Settings or check your connection.');
    } finally {
      setLocationSyncing(false);
    }
  };

  // ── No coordinates: prompt for location ──────────────────────────────────
  if (!hasCoords) {
    return (
      <View style={styles.card}>
        <CompassRose
          size={200}
          opacity={0.07}
          style={{ right: -50, top: -50 }}
        />
        <CornerMarkSet color={paper.red} />
        <View style={styles.emptyState}>
          <Text style={styles.eyebrow}>RIGHT NOW</Text>
          <Text style={styles.emptyHeadline}>Set your spot.</Text>
          <Text style={styles.emptyBody}>
            Add a location to read wind, pressure, sky, and tide where available.
          </Text>
          {onRequestLocation && (
            <Pressable
              style={({ pressed }) => [
                styles.locationBtn,
                pressed && { opacity: 0.85 },
                locationSyncing && { opacity: 0.7 },
              ]}
              onPress={handleRequestLocation}
              disabled={locationSyncing}
            >
              {locationSyncing ? (
                <ActivityIndicator size="small" color={paper.paper} />
              ) : (
                <>
                  <Ionicons name="locate" size={13} color={paper.paper} />
                  <Text style={styles.locationBtnText}>ENABLE LOCATION</Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  const isRateLimit = error?.includes('Please wait') ?? false;

  // ── Hard error with no cached data: show retry state ─────────────────────
  if (error && !envData && !isRateLimit) {
    return (
      <View style={styles.card}>
        <CompassRose
          size={200}
          opacity={0.07}
          style={{ right: -50, top: -50 }}
        />
        <CornerMarkSet color={paper.red} />
        <View style={styles.emptyState}>
          <Text style={styles.eyebrow}>RIGHT NOW</Text>
          <Text style={styles.emptyHeadline}>Couldn&apos;t load conditions.</Text>
          <Text style={styles.emptyBody}>{friendlyConditionsError(error)}</Text>
          <Pressable
            style={({ pressed }) => [styles.locationBtn, pressed && { opacity: 0.85 }]}
            onPress={() => loadEnv(latitude!, longitude!, { units, forceRefresh: true })}
          >
            <Text style={styles.locationBtnText}>TRY AGAIN</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Still loading with no cached data: render a skeleton that mirrors
  // the final card layout so the content lands in place without a jump.
  if (isLoading && !envData) {
    return <LiveConditionsSkeletonCard />;
  }

  const env = envData as EnvironmentData | null;
  const w: WeatherData | undefined = env?.weather;
  const moon = env?.moon;

  const fetchedAt = env?.fetched_at ? new Date(env.fetched_at).getTime() : 0;
  const ageMs = fetchedAt ? Math.max(0, nowMs - fetchedAt) : 0;
  const isStale = ageMs > CACHE_TTL_MS;
  const ageMin = Math.floor(ageMs / 60000);
  const ageLabel = fetchedAt ? (ageMin < 1 ? 'JUST NOW' : `${ageMin}M AGO`) : null;

  const sky = w ? cloudSkyLabel(w.cloud_cover) : '—';
  const mood = skyMoodLine(w?.cloud_cover);
  const airTemp = w?.temperature != null ? Math.round(w.temperature) : null;

  const humidityPct =
    w?.humidity != null && Number.isFinite(w.humidity) ? Math.round(w.humidity) : null;
  const humidityLabel = humidityPct != null ? `${humidityPct}%` : '—';
  const humiditySub = humidityPct != null ? humiditySubLabel(humidityPct) : '—';

  const windSpeedRaw = w?.wind_speed;
  const windSpeed = windSpeedRaw != null ? Math.round(windSpeedRaw) : null;
  const windDir = w?.wind_direction != null ? windDirectionLabel(w.wind_direction) : '—';

  const pressureTrend = pressureTrendWord(w?.pressure_trend);
  const pressureSubInHg =
    w?.pressure != null ? `${(w.pressure * 0.02953).toFixed(2)}"` : '—';

  const moonIllum =
    moon?.illumination != null ? `${Math.round(moon.illumination * 100)}%` : '—';
  const moonSub = moonLabel(moon?.phase, moon?.illumination).toLowerCase();

  const content = (
    <>
      {/*
        Decorative marginalia layer — the compass bleeds off the top-right
        corner like the reference (`right:-60; top:-60` on a 240 canvas).
        Swimming fish drifts across the bottom.
      */}
      <CompassRose
        size={240}
        opacity={0.09}
        style={{ right: -60, top: -60 }}
      />
      <SwimmingFish bottom={14} />

      <CornerMarkSet color={paper.red} />

      {/*
        Freshness stamp — parked in the top-right corner. On the mock there
        is no meta/refresh control; we keep ours but out of the way so the
        card's two-column layout (sky | temp) matches the reference.
      */}
      <View style={styles.freshnessRow}>
        {isLoading ? (
          <Text style={styles.metaText}>REFRESHING</Text>
        ) : ageLabel ? (
          <Text
            style={[
              styles.metaText,
              isStale && { color: paper.red, opacity: 1 },
            ]}
          >
            {ageLabel}
          </Text>
        ) : null}
        <Pressable
          hitSlop={12}
          onPress={() =>
            loadEnv(latitude!, longitude!, { units, forceRefresh: true })
          }
          disabled={isLoading}
          style={({ pressed }) => [
            styles.refreshBtn,
            pressed && { opacity: 0.6 },
            isLoading && { opacity: 0.4 },
          ]}
        >
          <Ionicons name="refresh" size={13} color={paper.ink} />
        </Pressable>
      </View>

      {/*
        Main two-column row — matches the reference's flex layout:
        left column has the RIGHT NOW eyebrow + sky phrase + mood italic;
        right column has the big air temperature with its AIR caption.
      */}
      <View style={styles.mainRow}>
        <View style={styles.mainLeft}>
          <Text style={styles.eyebrow}>RIGHT NOW</Text>
          <Text style={styles.skyHeadline} numberOfLines={2}>
            {sky}
          </Text>
          {!!mood && <Text style={styles.skyMood}>{mood}</Text>}
        </View>
        <View style={styles.mainRight}>
          <View style={styles.tempLine}>
            <Text
              style={styles.bigTemp}
              numberOfLines={1}
              allowFontScaling={false}
            >
              {airTemp != null ? `${airTemp}` : '—'}
            </Text>
            {airTemp != null && (
              <Text style={styles.bigTempDegree} allowFontScaling={false}>
                °
              </Text>
            )}
          </View>
          <Text style={styles.tinyCaption}>AIR</Text>
        </View>
      </View>

      {/* 4-tile conditions strip — ink top rule + dashed vertical dividers. */}
      <View style={styles.tilesRule} />
      <View style={styles.tiles}>
        <MetricTile
          icon="water-outline"
          label="HUMIDITY"
          value={humidityLabel}
          sub={humiditySub}
        />
        <Divider />
        <MetricTile
          icon="navigate-outline"
          label="WIND"
          value={windSpeed != null ? `${windSpeed}` : '—'}
          unit={windSpeed != null ? ' mph' : undefined}
          sub={windDir}
        />
        <Divider />
        <MetricTile
          icon="speedometer-outline"
          label="PRESSURE"
          value={pressureTrend.word}
          sub={pressureSubInHg}
        />
        <Divider />
        <MetricTile
          icon="moon-outline"
          label="MOON"
          value={moonIllum}
          sub={moonSub}
        />
      </View>

      {/* Error banner for rate-limits or recoverable errors. */}
      {error && (isRateLimit || env) && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{friendlyConditionsError(error)}</Text>
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={styles.card}>{content}</View>;
}

function MetricTile({
  icon,
  label,
  value,
  unit,
  sub,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit?: string;
  sub: string;
}) {
  return (
    <View style={styles.tile}>
      <Ionicons name={icon} size={14} color={paper.red} style={{ marginBottom: 6 }} />
      <Text style={styles.tileLabel}>{label}</Text>
      <View style={styles.tileValueRow}>
        <Text style={styles.tileValue} numberOfLines={1}>
          {value}
        </Text>
        {unit && (
          <Text style={styles.tileUnit} numberOfLines={1}>
            {unit}
          </Text>
        )}
      </View>
      <Text style={styles.tileSub} numberOfLines={1}>
        {sub}
      </Text>
    </View>
  );
}

/**
 * FinFindr's "1px dashed" divider between metric columns. RN's dashed borders
 * are unreliable cross-platform, so we render a stack of small vertical
 * segments to simulate a dashed rule.
 */
function Divider() {
  const segments = 9;
  return (
    <View style={styles.divider} pointerEvents="none">
      {Array.from({ length: segments }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 1,
            height: 2.5,
            backgroundColor: paper.ink,
            opacity: 0.35,
            marginVertical: 1.5,
          }}
        />
      ))}
    </View>
  );
}

function Bone({ style }: { style?: object }) {
  return <View style={[styles.bone, style]} />;
}

function SkeletonTile({ iconTint }: { iconTint?: string }) {
  return (
    <View style={styles.tile}>
      <View
        style={[
          styles.skeletonTileIcon,
          { backgroundColor: iconTint ?? paper.red, opacity: 0.28 },
        ]}
      />
      <Bone style={styles.skeletonTileLabel} />
      <Bone style={styles.skeletonTileValue} />
      <Bone style={styles.skeletonTileSub} />
    </View>
  );
}

/** Skeleton placeholder that mirrors the final card shape while the env
 *  payload is in flight. Keeps the marginalia (compass, corner marks,
 *  freshness row) so the transition to real data feels seamless. */
function LiveConditionsSkeletonCard() {
  return (
    <View style={styles.card}>
      <CompassRose
        size={240}
        opacity={0.09}
        style={{ right: -60, top: -60 }}
      />
      <SwimmingFish bottom={14} />
      <CornerMarkSet color={paper.red} />

      <View style={styles.freshnessRow}>
        <Text style={styles.metaText}>REFRESHING</Text>
        <View style={[styles.refreshBtn, { opacity: 0.4 }]}>
          <Ionicons name="refresh" size={13} color={paper.ink} />
        </View>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.mainLeft}>
          <Text style={styles.eyebrow}>RIGHT NOW</Text>
          <Bone style={styles.skeletonSkyLine1} />
          <Bone style={styles.skeletonSkyLine2} />
          <Bone style={styles.skeletonMood} />
        </View>
        <View style={styles.mainRight}>
          <Bone style={styles.skeletonTemp} />
          <Bone style={styles.skeletonTempCaption} />
        </View>
      </View>

      <View style={styles.tilesRule} />
      <View style={styles.tiles}>
        <SkeletonTile />
        <Divider />
        <SkeletonTile />
        <Divider />
        <SkeletonTile />
        <Divider />
        <SkeletonTile />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    ...paperBorders.card,
    ...paperShadows.hard,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.lg + 24, // room for the swimming fish
    overflow: 'hidden',
    marginBottom: paperSpacing.lg,
    position: 'relative',
  },
  cardPressed: {
    transform: [{ translateY: 1 }],
  },

  freshnessRow: {
    position: 'absolute',
    top: 10,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs,
    zIndex: 3,
  },
  eyebrow: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 3,
    color: paper.red,
    fontWeight: '700',
    marginBottom: 6,
  },
  metaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.5,
    color: paper.ink,
    opacity: 0.55,
  },
  refreshBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.inkHair,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Main content row — the reference uses
   *   `display: flex; justify-content: space-between; align-items: center;`
   * and splits the card into (1) left column with RIGHT NOW + sky + mood,
   * and (2) right column with the big temperature + AIR caption.
   */
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.lg,
    marginBottom: paperSpacing.md + 2,
    zIndex: 2,
  },
  mainLeft: {
    flex: 1,
    paddingRight: paperSpacing.sm,
  },
  mainRight: {
    alignItems: 'flex-end',
    minWidth: 130,
  },
  skyHeadline: {
    fontFamily: paperFonts.display,
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 28,
    color: paper.ink,
    letterSpacing: -0.6,
  },
  skyMood: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: paper.ink,
    opacity: 0.72,
    marginTop: 4,
  },
  tempLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bigTemp: {
    fontFamily: paperFonts.monoBold,
    fontWeight: '700',
    fontSize: 64,
    // Reference uses `lineHeight: 0.9`. On RN, setting lineHeight below the
    // font size can clip the glyph top. We give it a little headroom
    // (lineHeight = fontSize) and rely on the parent row being tall enough.
    lineHeight: 68,
    letterSpacing: -3,
    color: paper.ink,
    includeFontPadding: false,
  },
  // The degree mark is drawn separately so it renders consistently across
  // platforms (the `°` glyph in Space Mono can sit low or tall depending on
  // the platform). We use a sans-serif weight-bold `°` at ~44% of the
  // number's size, baseline-aligned to the top of the digits.
  bigTempDegree: {
    fontFamily: paperFonts.bodyBold,
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 28,
    color: paper.ink,
    marginLeft: 2,
    marginTop: 6,
  },
  tinyCaption: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2,
    color: paper.ink,
    opacity: 0.65,
    marginTop: 2,
    fontWeight: '700',
  },
  tilesRule: {
    height: 1.5,
    backgroundColor: paper.ink,
    marginBottom: paperSpacing.md,
  },
  tiles: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tile: {
    flex: 1,
    paddingHorizontal: 6,
  },
  tileLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: paper.ink,
    opacity: 0.6,
    marginBottom: 4,
    fontWeight: '700',
  },
  tileValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tileValue: {
    fontFamily: paperFonts.monoBold,
    fontWeight: '700',
    fontSize: 16,
    color: paper.ink,
    letterSpacing: -0.4,
    lineHeight: 19,
  },
  tileUnit: {
    fontFamily: paperFonts.mono,
    fontSize: 9,
    color: paper.ink,
    opacity: 0.55,
    marginLeft: 2,
  },
  tileSub: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: paper.ink,
    opacity: 0.65,
    marginTop: 3,
  },
  divider: {
    width: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },

  // ── Skeleton bones (for the in-flight loading state) ─────────────────
  bone: {
    backgroundColor: paper.inkHair,
    borderRadius: paperRadius.chip,
    opacity: 0.6,
  },
  skeletonSkyLine1: {
    height: 22,
    width: '85%',
    marginBottom: 6,
    borderRadius: 4,
  },
  skeletonSkyLine2: {
    height: 22,
    width: '55%',
    borderRadius: 4,
  },
  skeletonMood: {
    height: 11,
    width: '70%',
    marginTop: 8,
    opacity: 0.45,
  },
  skeletonTemp: {
    height: 58,
    width: 110,
    borderRadius: 6,
    marginBottom: 4,
  },
  skeletonTempCaption: {
    height: 9,
    width: 28,
    opacity: 0.45,
    alignSelf: 'flex-end',
  },
  skeletonTileIcon: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginBottom: 6,
  },
  skeletonTileLabel: {
    height: 9,
    width: '70%',
    opacity: 0.55,
    marginBottom: 4,
  },
  skeletonTileValue: {
    height: 14,
    width: '55%',
    marginVertical: 2,
  },
  skeletonTileSub: {
    height: 9,
    width: '60%',
    opacity: 0.4,
    marginTop: 3,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: paperSpacing.lg,
    gap: paperSpacing.sm,
  },
  emptyHeadline: {
    fontFamily: paperFonts.display,
    fontWeight: '700',
    fontSize: 22,
    color: paper.ink,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  emptyBody: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: paper.ink,
    opacity: 0.7,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: paper.ink,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: paperRadius.chip,
    marginTop: paperSpacing.xs,
  },
  locationBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 2,
    color: paper.paper,
  },

  banner: {
    marginTop: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs,
    borderWidth: 1,
    borderColor: paper.inkHair,
    borderRadius: paperRadius.chip,
  },
  bannerText: {
    fontFamily: paperFonts.body,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.75,
    textAlign: 'center',
  },
});
