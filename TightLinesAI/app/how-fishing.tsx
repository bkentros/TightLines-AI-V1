/**
 * How's Fishing — Expanded Conditions Page (Section 4)
 *
 * Shows all 8 condition cards before the user triggers the AI analysis:
 *   Card 1 — Weather Conditions
 *   Card 2 — Pressure History (sparkline)
 *   Card 3 — Temperature Trend
 *   Card 4 — Lunar & Solunar
 *   Card 5 — Tide Conditions (saltwater/brackish only)
 *   Card 6 — Light Conditions
 *   Card 7 — Water Temperature
 *   Card 8 — Conditions Score (placeholder — populated by scoring engine in Section 5)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius } from '../lib/theme';
import { getEnvironment, fetchFreshEnvironment } from '../lib/env';
import { invokeEdgeFunction, supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import {
  getCachedHowFishingBundle,
  setCachedHowFishingBundle,
  setCurrentHowFishingBundle,
  type HowFishingBundle,
} from '../lib/howFishing';
import { useEnvStore } from '../store/envStore';
import type { EnvironmentData, SolunarPeriod } from '../lib/env/types';

// =============================================================================
// Utilities
// =============================================================================

function windDirectionLabel(deg: number): string {
  const cards = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const i = Math.round(((deg % 360) + 360) / 22.5) % 16;
  return cards[i] ?? '—';
}

function cloudLabel(pct: number): string {
  if (pct <= 15) return 'Clear';
  if (pct <= 35) return 'Partly Cloudy';
  if (pct <= 65) return 'Cloudy';
  return 'Overcast';
}

/** Convert "HH:mm" to minutes since midnight for comparison */
function hhmmToMins(t: string): number {
  const parts = t.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  return h * 60 + m;
}

/** Format "HH:mm" to "h:mm AM/PM" */
function formatTime12(t: string | null | undefined): string {
  if (!t) return '—';
  const parts = t.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  if (isNaN(h) || isNaN(m)) return t;
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function getLocationLocalDate(env: Pick<EnvironmentData, 'tz_offset_hours'>): Date {
  const tzHours = env.tz_offset_hours ?? new Date().getTimezoneOffset() / -60;
  return new Date(Date.now() + tzHours * 3600 * 1000);
}

function getLocationNowMinutes(env: Pick<EnvironmentData, 'tz_offset_hours'>): number {
  const locationDate = getLocationLocalDate(env);
  return locationDate.getUTCHours() * 60 + locationDate.getUTCMinutes();
}

function getLocationDateTimeKey(env: Pick<EnvironmentData, 'tz_offset_hours'>): string {
  const locationDate = getLocationLocalDate(env);
  const year = locationDate.getUTCFullYear();
  const month = String(locationDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(locationDate.getUTCDate()).padStart(2, '0');
  const hours = String(locationDate.getUTCHours()).padStart(2, '0');
  const minutes = String(locationDate.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatWaterTempValue(tempF: number, units: string): string {
  if (units === '°C') {
    const tempC = (tempF - 32) * (5 / 9);
    return `${Math.round(tempC * 10) / 10}°C`;
  }
  return `${Math.round(tempF * 10) / 10}°F`;
}

/** Derive current light condition label from sun times */
function getLightCondition(sun: EnvironmentData['sun'], env: Pick<EnvironmentData, 'tz_offset_hours'>): string {
  if (!sun?.sunrise || !sun?.sunset) return 'Unknown';
  const nowMins = getLocationNowMinutes(env);

  const twBegin = sun.twilight_begin ? hhmmToMins(sun.twilight_begin) : null;
  const sunriseMins = hhmmToMins(sun.sunrise);
  const sunsetMins = hhmmToMins(sun.sunset);
  const twEnd = sun.twilight_end ? hhmmToMins(sun.twilight_end) : null;

  const dawnEnd = sunriseMins + 90;
  const duskStart = sunsetMins - 90;

  if (twBegin !== null && nowMins < twBegin) return 'Pre-Dawn';
  if (twBegin !== null && nowMins < sunriseMins) return 'Dawn Window';
  if (nowMins < dawnEnd) return 'Dawn Window';
  if (nowMins < duskStart) {
    // Midday: 3 hrs after sunrise to 3 hrs before sunset
    const midfishStart = sunriseMins + 180;
    const midfishEnd = sunsetMins - 180;
    if (nowMins < midfishStart) return 'Morning';
    if (nowMins > midfishEnd) return 'Evening';
    return 'Midday';
  }
  if (nowMins < sunsetMins) return 'Dusk Window';
  if (twEnd !== null && nowMins < twEnd) return 'Dusk Window';
  return 'Night';
}

/** Human-readable pressure trend label */
function pressureTrendLabel(trend: string | undefined): string {
  switch (trend) {
    case 'rapidly_falling': return 'Rapidly Falling';
    case 'slowly_falling': return 'Slowly Falling';
    case 'stable': return 'Stable';
    case 'slowly_rising': return 'Slowly Rising';
    case 'rapidly_rising': return 'Rapidly Rising';
    default: return '—';
  }
}

/** Color for pressure trend */
function pressureTrendColor(trend: string | undefined): string {
  switch (trend) {
    case 'rapidly_falling': return '#2E7D32';  // deep green — best for fishing
    case 'slowly_falling': return '#388E3C';   // green
    case 'stable': return colors.textMuted;
    case 'slowly_rising': return '#E65100';    // amber
    case 'rapidly_rising': return '#B71C1C';   // red — worst
    default: return colors.textMuted;
  }
}

/** Human-readable temp trend label */
function tempTrendLabel(trend: string | undefined): { label: string; color: string } {
  switch (trend) {
    case 'rapid_warming': return { label: 'Rapid Warming ↑', color: '#388E3C' };
    case 'warming': return { label: 'Warming ↑', color: '#43A047' };
    case 'stable': return { label: 'Stable', color: colors.textMuted };
    case 'cooling': return { label: 'Cooling ↓', color: '#E65100' };
    case 'rapid_cooling': return { label: 'URGENT: Rapid Drop ↓', color: '#B71C1C' };
    default: return { label: '—', color: colors.textMuted };
  }
}

/** Day labels for 7-day temp chart — index 0 = 7 days ago, index 7 = today */
function dayLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yest.';
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

/** Hours until a future "HH:mm" time */
function hoursUntil(targetHHMM: string, env: Pick<EnvironmentData, 'tz_offset_hours'>): number | null {
  const parts = targetHHMM.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  if (isNaN(h) || isNaN(m)) return null;
  const nowMins = getLocationNowMinutes(env);
  const targetMins = h * 60 + m;
  let diffMins = targetMins - nowMins;
  if (diffMins < 0) diffMins += 24 * 60; // next occurrence (tomorrow)
  return Math.round(diffMins / 6) / 10; // round to 1 decimal hour
}

// =============================================================================
// Sub-components
// =============================================================================

function SectionCard({
  title,
  icon,
  accentColor,
  children,
}: {
  title: string;
  icon: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  const accent = accentColor ?? colors.sage;
  return (
    <View style={[cardStyles.card, { borderLeftColor: accent }]}>
      <View style={cardStyles.cardHeader}>
        <Ionicons name={icon as any} size={16} color={accent} />
        <Text style={[cardStyles.cardTitle, { color: accent }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function DataRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={cardStyles.dataRow}>
      <Text style={cardStyles.dataLabel}>{label}</Text>
      <Text style={[cardStyles.dataValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

/** Pure-View sparkline for pressure history */
function PressureSparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) {
    return <Text style={sparkStyles.empty}>No pressure history available</Text>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const BAR_WIDTH = 4;
  const MAX_HEIGHT = 48;
  const GAP = 1;

  return (
    <View style={sparkStyles.container}>
      <View style={sparkStyles.chart}>
        {data.map((v, i) => {
          const heightPct = (v - min) / range;
          const barHeight = Math.max(3, Math.round(heightPct * MAX_HEIGHT));
          // Color the bar: lower pressure = greener (better fishing), higher = more orange
          const normalized = heightPct;
          const isHigh = normalized > 0.66;
          const barColor = isHigh ? '#E65100' : normalized > 0.33 ? colors.warmTan : '#388E3C';
          return (
            <View
              key={i}
              style={[
                sparkStyles.bar,
                { width: BAR_WIDTH, height: barHeight, backgroundColor: barColor, marginRight: i < data.length - 1 ? GAP : 0 },
              ]}
            />
          );
        })}
      </View>
      <View style={sparkStyles.axisRow}>
        <Text style={sparkStyles.axisLabel}>{Math.round(min)} hPa</Text>
        <Text style={sparkStyles.axisLabel}>{Math.round(max)} hPa</Text>
      </View>
    </View>
  );
}

/** Solunar period row */
function SolunarRow({ period, type }: { period: SolunarPeriod; type: 'major' | 'minor' }) {
  const isMajor = type === 'major';
  const label = isMajor
    ? period.type === 'overhead' ? 'Major (Overhead)' : 'Major (Underfoot)'
    : 'Minor';
  const dotColor = isMajor ? colors.sage : colors.warmTan;
  return (
    <View style={solunarStyles.row}>
      <View style={[solunarStyles.dot, { backgroundColor: dotColor }]} />
      <Text style={solunarStyles.label}>{label}</Text>
      <Text style={solunarStyles.time}>
        {formatTime12(period.start)} – {formatTime12(period.end)}
      </Text>
    </View>
  );
}

// =============================================================================
// Card 1 — Weather Conditions
// =============================================================================

function WeatherCard({ env }: { env: EnvironmentData }) {
  const w = env.weather;
  if (!w) return null;

  const trendLabel = pressureTrendLabel(w.pressure_trend);
  const trendColor = pressureTrendColor(w.pressure_trend);
  const tempInfo = tempTrendLabel(w.temp_trend_3day);

  return (
    <SectionCard title="Weather Conditions" icon="thermometer-outline" accentColor="#B87333">
      <DataRow label="Temperature" value={`${Math.round(w.temperature)}${w.temp_unit}`} />
      {w.temp_trend_3day && (
        <DataRow label="3-Day Trend" value={tempInfo.label} valueColor={tempInfo.color} />
      )}
      <DataRow
        label="Wind"
        value={`${windDirectionLabel(w.wind_direction)} ${Math.round(w.wind_speed)} ${w.wind_speed_unit}`}
      />
      <DataRow label="Pressure" value={`${w.pressure} hPa`} />
      {w.pressure_trend && (
        <DataRow label="Pressure Trend" value={trendLabel} valueColor={trendColor} />
      )}
      {w.pressure_change_rate_mb_hr !== undefined && (
        <DataRow
          label="Rate of Change"
          value={`${w.pressure_change_rate_mb_hr > 0 ? '+' : ''}${w.pressure_change_rate_mb_hr} mb/hr`}
          valueColor={trendColor}
        />
      )}
      <DataRow label="Sky" value={`${cloudLabel(w.cloud_cover)} (${w.cloud_cover}%)`} />
      <DataRow
        label="Precipitation"
        value={w.precipitation > 0 ? `${w.precipitation} mm` : 'None'}
      />
      <DataRow label="Humidity" value={`${w.humidity}%`} />
    </SectionCard>
  );
}

// =============================================================================
// Card 2 — Pressure History
// =============================================================================

function PressureHistoryCard({ env }: { env: EnvironmentData }) {
  const w = env.weather;
  return (
    <SectionCard title="Pressure History" icon="trending-down-outline" accentColor="#7B1FA2">
      <Text style={cardStyles.cardSubtitle}>Last 48 hours · Barometric Pressure</Text>
      <PressureSparkline data={w?.pressure_48hr ?? []} />
      {w?.precip_48hr_inches !== undefined && (
        <DataRow label="Rain (48 hrs)" value={`${w.precip_48hr_inches.toFixed(2)} in`} />
      )}
      {w?.precip_7day_inches !== undefined && (
        <DataRow label="Rain (7 days)" value={`${w.precip_7day_inches.toFixed(2)} in`} />
      )}
      <Text style={cardStyles.cardNote}>
        Cold front detection · scoring engine coming in next update
      </Text>
    </SectionCard>
  );
}

// =============================================================================
// Card 3 — Temperature Trend
// =============================================================================

function TemperatureTrendCard({ env }: { env: EnvironmentData }) {
  const w = env.weather;
  if (!w) return null;

  const tempInfo = tempTrendLabel(w.temp_trend_3day);
  const highs = w.temp_7day_high ?? [];
  const lows = w.temp_7day_low ?? [];
  // Entries: index 0 = 7 days ago, index 7 = today
  // Show in reverse: today first (most relevant)
  const days = highs.length > 0 ? highs.map((_, i) => i) : [];
  const reversed = [...days].reverse();

  return (
    <SectionCard title="Temperature Trend" icon="flame-outline" accentColor="#B87333">
      <DataRow label="Current Temp" value={`${Math.round(w.temperature)}${w.temp_unit}`} />
      {w.temp_trend_3day && (
        <DataRow label="72-Hour Trend" value={tempInfo.label} valueColor={tempInfo.color} />
      )}
      {w.temp_trend_direction_f !== undefined && (
        <DataRow
          label="Delta (72 hrs)"
          value={`${w.temp_trend_direction_f > 0 ? '+' : ''}${w.temp_trend_direction_f}${w.temp_unit}`}
          valueColor={tempInfo.color}
        />
      )}
      {w.temp_trend_3day === 'rapid_cooling' && (
        <View style={alertStyles.urgentBanner}>
          <Ionicons name="warning-outline" size={14} color="#B71C1C" />
          <Text style={alertStyles.urgentText}>
            Rapid temperature drop — active feed-up window. Fish are gorging before cold water slows their metabolism.
          </Text>
        </View>
      )}
      {reversed.length > 0 && (
        <>
          <View style={cardStyles.divider} />
          <Text style={cardStyles.cardSubtitle}>7-Day High / Low</Text>
          {reversed.map((i) => {
            const daysAgo = 7 - i; // index 7 = today → daysAgo=0
            const hi = highs[i];
            const lo = lows[i];
            if (hi === undefined && lo === undefined) return null;
            return (
              <View key={i} style={tempStyles.dayRow}>
                <Text style={tempStyles.dayLabel}>{dayLabel(daysAgo)}</Text>
                <Text style={tempStyles.hiVal}>
                  {hi !== undefined ? `${Math.round(hi)}°` : '—'}
                </Text>
                <Text style={tempStyles.sep}>/</Text>
                <Text style={tempStyles.loVal}>
                  {lo !== undefined ? `${Math.round(lo)}°` : '—'}
                </Text>
              </View>
            );
          })}
        </>
      )}
    </SectionCard>
  );
}

// =============================================================================
// Card 4 — Lunar & Solunar
// =============================================================================

function LunarCard({ env }: { env: EnvironmentData }) {
  const moon = env.moon;
  const solunar = env.solunar;

  if (!moon && !solunar) {
    return (
      <SectionCard title="Lunar Conditions" icon="moon-outline" accentColor="#3A5F8A">
        <Text style={cardStyles.emptyText}>Lunar data unavailable</Text>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Lunar & Solunar" icon="moon-outline" accentColor="#3A5F8A">
      {moon && (
        <>
          <DataRow label="Moon Phase" value={moon.phase} />
          <DataRow label="Illumination" value={`${Math.round(moon.illumination * 100)}%`} />
          {moon.rise && <DataRow label="Moonrise" value={formatTime12(moon.rise)} />}
          {moon.set && <DataRow label="Moonset" value={formatTime12(moon.set)} />}
        </>
      )}
      {solunar && (solunar.major_periods.length > 0 || solunar.minor_periods.length > 0) && (
        <>
          <View style={cardStyles.divider} />
          <Text style={cardStyles.cardSubtitle}>Solunar Feeding Windows</Text>
          {solunar.major_periods.map((p, i) => (
            <SolunarRow key={`maj-${i}`} period={p} type="major" />
          ))}
          {solunar.minor_periods.map((p, i) => (
            <SolunarRow key={`min-${i}`} period={p} type="minor" />
          ))}
          <Text style={cardStyles.cardNote}>
            Major windows: 2 hrs · Minor windows: 1 hr
          </Text>
        </>
      )}
      {(!solunar || (solunar.major_periods.length === 0 && solunar.minor_periods.length === 0)) && (
        <Text style={cardStyles.emptyText}>Solunar windows unavailable</Text>
      )}
    </SectionCard>
  );
}

// =============================================================================
// Card 5 — Tide Conditions
// =============================================================================

function TideCard({ env }: { env: EnvironmentData }) {
  if (!env.tides_available || !env.tides) return null;

  const t = env.tides;
  const highLow = t.high_low ?? [];

  // Find next high and next low
  const nowStr = getLocationDateTimeKey(env);
  const future = highLow.filter((p) => p.time > nowStr);
  const nextHigh = future.find((p) => p.type === 'H');
  const nextLow = future.find((p) => p.type === 'L');

  // Tidal range: max high minus min low for today
  const todayHighs = highLow.filter((p) => p.type === 'H').map((p) => p.value);
  const todayLows = highLow.filter((p) => p.type === 'L').map((p) => p.value);
  const maxHigh = todayHighs.length > 0 ? Math.max(...todayHighs) : null;
  const minLow = todayLows.length > 0 ? Math.min(...todayLows) : null;
  const tidalRange = maxHigh !== null && minLow !== null
    ? Math.round((maxHigh - minLow) * 10) / 10
    : null;

  // Hours until next change
  const nextPred = future[0];
  const hoursToNext = nextPred
    ? (() => {
        const nextTimeParts = nextPred.time.split(' ');
        const timePart = nextTimeParts[1] ?? '';
        return hoursUntil(timePart, env);
      })()
    : null;

  const phaseLabel = t.phase
    ? t.phase.charAt(0).toUpperCase() + t.phase.slice(1)
    : 'Unknown';

  return (
    <SectionCard title="Tide Conditions" icon="water-outline" accentColor="#0097A7">
      <DataRow label="Station" value={t.station_name} />
      <DataRow label="Current Phase" value={phaseLabel} />
      {nextHigh && (
        <DataRow
          label="Next High"
          value={`${nextHigh.time.split(' ')[1] ?? '—'} · ${nextHigh.value} ${t.unit}`}
        />
      )}
      {nextLow && (
        <DataRow
          label="Next Low"
          value={`${nextLow.time.split(' ')[1] ?? '—'} · ${nextLow.value} ${t.unit}`}
        />
      )}
      {tidalRange !== null && (
        <DataRow label="Tidal Range" value={`${tidalRange} ${t.unit}`} />
      )}
      {hoursToNext !== null && nextPred && (
        <DataRow
          label={`hrs to next ${nextPred.type === 'H' ? 'high' : 'low'}`}
          value={`${hoursToNext} hrs`}
        />
      )}
      <Text style={cardStyles.cardNote}>
        Current height — real-time water level coming soon
      </Text>
    </SectionCard>
  );
}

// =============================================================================
// Card 6 — Light Conditions
// =============================================================================

function LightCard({ env }: { env: EnvironmentData }) {
  const sun = env.sun;
  if (!sun?.sunrise || !sun?.sunset) {
    return (
      <SectionCard title="Light Conditions" icon="sunny-outline" accentColor="#E6980A">
        <Text style={cardStyles.emptyText}>Light data unavailable</Text>
      </SectionCard>
    );
  }

  const currentCondition = getLightCondition(sun, env);

  // Classify label color
  const conditionColor =
    currentCondition === 'Dawn Window' || currentCondition === 'Dusk Window'
      ? '#388E3C'
      : currentCondition === 'Midday'
        ? '#E65100'
        : currentCondition === 'Night'
          ? '#3A5F8A'
          : colors.text;

  return (
    <SectionCard title="Light Conditions" icon="sunny-outline" accentColor="#E6980A">
      <DataRow label="Sunrise" value={formatTime12(sun.sunrise)} />
      <DataRow label="Sunset" value={formatTime12(sun.sunset)} />
      {sun.twilight_begin && (
        <DataRow label="Dawn Begins" value={formatTime12(sun.twilight_begin)} />
      )}
      {sun.twilight_end && (
        <DataRow label="Dusk Ends" value={formatTime12(sun.twilight_end)} />
      )}
      <View style={cardStyles.divider} />
      <View style={lightStyles.conditionRow}>
        <Text style={lightStyles.conditionLabel}>Current Light</Text>
        <View style={[lightStyles.conditionBadge, { borderColor: conditionColor }]}>
          <Text style={[lightStyles.conditionValue, { color: conditionColor }]}>
            {currentCondition}
          </Text>
        </View>
      </View>
      {(currentCondition === 'Dawn Window' || currentCondition === 'Dusk Window') && (
        <View style={alertStyles.primeWindowBanner}>
          <Ionicons name="star" size={13} color={colors.sage} />
          <Text style={alertStyles.primeWindowText}>
            Prime feeding window active — predators are pushing to edges now.
          </Text>
        </View>
      )}
    </SectionCard>
  );
}

// =============================================================================
// Card 7 — Water Temperature
// Shows inferred (freshwater) or measured (coastal) water temp context.
// The exact engine-derived water_temp_f is computed server-side; this card
// surfaces context and sets transparency expectations before the full report.
// =============================================================================

function WaterTemperatureCard({ env }: { env: EnvironmentData }) {
  const isCoastal = env.tides_available;
  const airTemp = env.weather?.temperature;
  const tempUnit = env.weather?.temp_unit ?? '°F';
  const measuredWaterTemp = env.measured_water_temp_f;

  return (
    <SectionCard title="Water Temperature" icon="water-outline" accentColor="#4A9ECC">
      {isCoastal ? (
        <>
          <DataRow label="Source" value="NOAA CO-OPS tide station" />
          {measuredWaterTemp !== null && measuredWaterTemp !== undefined ? (
            <DataRow label="Measured Water Temp" value={formatWaterTempValue(measuredWaterTemp, tempUnit)} />
          ) : (
            <DataRow label="Measured Water Temp" value="Unavailable" valueColor={colors.textMuted} />
          )}
          {airTemp !== undefined && (
            <DataRow label="Air Temp" value={`${airTemp}${tempUnit}`} />
          )}
          <View style={waterTempStyles.notice}>
            <Ionicons
              name={measuredWaterTemp !== null && measuredWaterTemp !== undefined ? 'checkmark-circle-outline' : 'information-circle-outline'}
              size={14}
              color={measuredWaterTemp !== null && measuredWaterTemp !== undefined ? '#4A9ECC' : '#E8A838'}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                waterTempStyles.noticeText,
                measuredWaterTemp !== null && measuredWaterTemp !== undefined ? null : { color: '#C47B00' },
              ]}
            >
              {measuredWaterTemp !== null && measuredWaterTemp !== undefined
                ? 'Measured coastal water temperature from NOAA is being used in analysis.'
                : 'Measured coastal water temperature is temporarily unavailable. Coastal scoring may run with reduced confidence.'}
            </Text>
          </View>
        </>
      ) : (
        <>
          {airTemp !== undefined && (
            <DataRow label="Air Temp" value={`${airTemp}${tempUnit}`} />
          )}
          <DataRow label="Water Temp" value="Inferred" valueColor={colors.textMuted} />
          <View style={waterTempStyles.notice}>
            <Ionicons name="information-circle-outline" size={14} color="#E8A838" style={{ marginRight: 5 }} />
            <Text style={[waterTempStyles.noticeText, { color: '#C47B00' }]}>
              Freshwater temperature is estimated from 7-day air temperature history. Not a measured value. See score report for exact estimate.
            </Text>
          </View>
        </>
      )}
    </SectionCard>
  );
}

// =============================================================================
// Card 8 — Conditions Score Preview
// Shows placeholder until the engine has run (after CTA press).
// Once a bundle is returned, shows the freshwater adjusted_score as a preview.
// =============================================================================

function ScoreCard({ previewScore, previewRating }: { previewScore?: number; previewRating?: string }) {
  const hasScore = previewScore !== undefined && previewScore !== null;
  const band = hasScore
    ? previewScore <= 37 ? 'red' : previewScore <= 71 ? 'yellow' : 'green'
    : null;
  const accentColor = band === 'green' ? colors.sage : band === 'yellow' ? '#E8A838' : band === 'red' ? '#E05252' : colors.sage;

  return (
    <SectionCard title="Conditions Score" icon="analytics-outline" accentColor={accentColor}>
      <View style={scoreStyles.placeholder}>
        {hasScore ? (
          <>
            <Text style={[scoreStyles.placeholderScore, { color: accentColor }]}>{previewScore} / 100</Text>
            {previewRating && <Text style={[scoreStyles.placeholderLabel, { color: accentColor }]}>{previewRating}</Text>}
            <Text style={scoreStyles.scoreSub}>Tap "How's Fishing?" to see the full breakdown</Text>
          </>
        ) : (
          <>
            <Text style={scoreStyles.placeholderScore}>— / 100</Text>
            <Text style={scoreStyles.placeholderLabel}>
              Tap "How's Fishing Right Now?" below to generate your deterministic conditions score.
            </Text>
          </>
        )}
      </View>
    </SectionCard>
  );
}

// =============================================================================
// Main screen
// =============================================================================

export default function HowFishingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lat?: string; lon?: string }>();
  const lat = params.lat != null ? parseFloat(params.lat) : NaN;
  const lon = params.lon != null ? parseFloat(params.lon) : NaN;
  const hasCoords =
    !isNaN(lat) && lat >= -90 && lat <= 90 && !isNaN(lon) && lon >= -180 && lon <= 180;

  const { profile } = useAuthStore();
  const units = profile?.preferred_units ?? 'imperial';

  const [env, setEnv] = useState<EnvironmentData | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [envError, setEnvError] = useState<string | null>(null);

  const [reportLoading, setReportLoading] = useState(false);
  const [previewScore, setPreviewScore] = useState<number | undefined>(undefined);
  const [previewRating, setPreviewRating] = useState<string | undefined>(undefined);
  const setLastReportEnv = useEnvStore((s) => s.setLastReportEnv);

  useEffect(() => {
    if (!hasCoords) {
      setEnvLoading(false);
      setEnvError('Location required');
      return;
    }
    let cancelled = false;
    setEnvLoading(true);
    setEnvError(null);
    // Show cached data (same as the dashboard widget) — no fresh fetch on page open.
    // The AI button will force-fetch fresh data before calling Claude.
    getEnvironment({ latitude: lat, longitude: lon, units })
      .then((data) => { if (!cancelled) setEnv(data); })
      .catch((e) => {
        if (!cancelled) setEnvError(e instanceof Error ? e.message : 'Failed to load conditions');
      })
      .finally(() => { if (!cancelled) setEnvLoading(false); });
    // Also pre-populate score preview from any cached bundle so Card 8
    // shows the last known score on page open (not just after AI runs).
    getCachedHowFishingBundle(lat, lon).then((cached) => {
      if (!cancelled && cached) {
        const fwReport = cached.reports?.freshwater;
        if (fwReport?.engine?.scoring) {
          setPreviewScore(fwReport.engine.scoring.adjusted_score);
          setPreviewRating(fwReport.engine.scoring.overall_rating);
        }
      }
    }).catch(() => { /* non-fatal — score preview stays as placeholder */ });
    return () => { cancelled = true; };
  }, [hasCoords, lat, lon, units]);

  const handleGetReport = useCallback(async () => {
    if (!hasCoords) return;
    // Check cache first (new bundle format)
    const cached = await getCachedHowFishingBundle(lat, lon);
    if (cached) {
      // Show preview score from cached freshwater report
      const fwReport = cached.reports?.freshwater;
      if (fwReport?.engine?.scoring) {
        setPreviewScore(fwReport.engine.scoring.adjusted_score);
        setPreviewRating(fwReport.engine.scoring.overall_rating);
      }
      setCurrentHowFishingBundle(lat, lon, cached);
      setLastReportEnv(env);
      router.push({
        pathname: '/how-fishing-results',
        params: { lat: String(lat), lon: String(lon) },
      });
      return;
    }
    setReportLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        Alert.alert('Session expired', 'Please sign out and sign back in.');
        return;
      }
      // Force-fetch fresh environment data before the AI call so the engine
      // always gets the most current conditions — not the potentially-stale cached version.
      const freshEnv = await fetchFreshEnvironment({ latitude: lat, longitude: lon, units });
      // Also update the local display so cards reflect what the engine is analyzing
      setEnv(freshEnv);

      const data = await invokeEdgeFunction<HowFishingBundle | { error: string; message?: string }>(
        'how-fishing',
        {
          accessToken: session.access_token,
          body: { latitude: lat, longitude: lon, units },
        }
      );
      const errObj =
        data && typeof data === 'object' && 'error' in data
          ? (data as { error: string; message?: string })
          : null;
      if (errObj?.error === 'usage_cap_exceeded') {
        Alert.alert('Usage limit reached', errObj.message ?? 'Upgrade or wait for next billing period.');
        return;
      }
      if (errObj?.error === 'subscription_required') {
        Alert.alert('Subscription required', errObj.message ?? 'Subscribe to use this feature.');
        return;
      }
      const bundle = data as HowFishingBundle;
      if (!bundle || typeof bundle !== 'object' || bundle.feature !== 'hows_fishing_feature_v1') {
        throw new Error('Invalid response format');
      }
      // Show freshwater score preview on Card 7
      const fwReport = bundle.reports?.freshwater;
      if (fwReport?.engine?.scoring) {
        setPreviewScore(fwReport.engine.scoring.adjusted_score);
        setPreviewRating(fwReport.engine.scoring.overall_rating);
      }
      await setCachedHowFishingBundle(lat, lon, bundle);
      setCurrentHowFishingBundle(lat, lon, bundle);
      setLastReportEnv(freshEnv);
      router.push({
        pathname: '/how-fishing-results',
        params: { lat: String(lat), lon: String(lon) },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      Alert.alert('Could not load analysis', msg);
    } finally {
      setReportLoading(false);
    }
  }, [hasCoords, lat, lon, units, env, router, setLastReportEnv]);

  // ─── No location state ────────────────────────────────────────────────────
  if (!hasCoords) {
    const handleEnableLocation = async () => {
      const { status: existing } = await Location.getForegroundPermissionsAsync();
      if (existing === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          router.replace({ pathname: '/how-fishing', params: { lat: String(loc.coords.latitude), lon: String(loc.coords.longitude) } });
        } catch {
          Alert.alert('Location error', 'Could not get your location. Please try again.');
        }
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          router.replace({ pathname: '/how-fishing', params: { lat: String(loc.coords.latitude), lon: String(loc.coords.longitude) } });
        } catch {
          Alert.alert('Location error', 'Could not get your location. Please try again.');
        }
      } else {
        Alert.alert(
          'Location permission denied',
          'Location is required for this feature. Enable it in Settings → TightLines AI → Location.',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }
    };

    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={52} color={colors.sage} />
          <Text style={styles.messageText}>Location needed</Text>
          <Text style={styles.messageSub}>
            How's Fishing requires your GPS location to pull current conditions.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.enableBtn, pressed && styles.enableBtnPressed]}
            onPress={handleEnableLocation}
          >
            <Ionicons name="locate" size={18} color={colors.textLight} />
            <Text style={styles.enableBtnText}>Enable Location</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Loading state ────────────────────────────────────────────────────────
  if (envLoading && !env) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.navBack, pressed && styles.navBackPressed]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.heading}>Current Conditions</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.sage} />
          <Text style={styles.loadingText}>Loading conditions…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Error state ──────────────────────────────────────────────────────────
  if (envError && !env) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            style={({ pressed }) => [styles.navBack, pressed && styles.navBackPressed]}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.heading}>Current Conditions</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{envError}</Text>
          <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={colors.sage} />
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main content ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Fixed top bar */}
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [styles.navBack, pressed && styles.navBackPressed]}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerTextBlock}>
          <Text style={styles.heading}>Current Conditions</Text>
          <Text style={styles.subheading}>
            Review conditions below, then tap to get your AI fishing report.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {env && (
          <>
            <WeatherCard env={env} />
            <PressureHistoryCard env={env} />
            <TemperatureTrendCard env={env} />
            <LunarCard env={env} />
            {env.tides_available && <TideCard env={env} />}
            <LightCard env={env} />
            <WaterTemperatureCard env={env} />
            <ScoreCard previewScore={previewScore} previewRating={previewRating} />
          </>
        )}

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
            (reportLoading || !env) && styles.ctaButtonDisabled,
          ]}
          onPress={handleGetReport}
          disabled={reportLoading || !env}
        >
          {reportLoading ? (
            <View style={styles.ctaInner}>
              <ActivityIndicator size="small" color={colors.textLight} />
              <Text style={styles.ctaButtonText}>Analyzing conditions…</Text>
            </View>
          ) : (
            <View style={styles.ctaInner}>
              <Ionicons name="sparkles" size={20} color={colors.textLight} />
              <Text style={styles.ctaButtonText}>How's Fishing Right Now?</Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          Powered by live weather, moon phase, solunar windows, and tides — tailored to your exact location.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================================
// Styles
// =============================================================================

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  cardNote: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  dataLabel: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});

const sparkStyles = StyleSheet.create({
  container: { marginVertical: spacing.sm },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 52,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 1,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  axisLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  empty: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
});

const solunarStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 1,
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});

const tempStyles = StyleSheet.create({
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textMuted,
    width: 40,
  },
  hiVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B87333',
    width: 38,
    textAlign: 'right',
  },
  sep: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  loVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A5F8A',
    width: 38,
  },
});

const alertStyles = StyleSheet.create({
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FFEBEE',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  urgentText: {
    flex: 1,
    fontSize: 12,
    color: '#B71C1C',
    lineHeight: 18,
  },
  primeWindowBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.sageLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.sage + '40',
  },
  primeWindowText: {
    flex: 1,
    fontSize: 12,
    color: colors.sageDark,
    lineHeight: 18,
  },
});

const lightStyles = StyleSheet.create({
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  conditionLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  conditionBadge: {
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  conditionValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});

const scoreStyles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  placeholderScore: {
    fontFamily: fonts.serif,
    fontSize: 40,
    fontWeight: '700',
    color: colors.disabled,
  },
  placeholderLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  scoreSub: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },

  topBar: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.background,
  },
  navBack: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  navBackPressed: { opacity: 0.45 },
  headerTextBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 3,
  },
  subheading: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },

  ctaButton: {
    backgroundColor: colors.sage,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 4,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: colors.sageDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaButtonPressed: { backgroundColor: colors.sageDark, shadowOpacity: 0.12 },
  ctaButtonDisabled: { opacity: 0.65 },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.2,
  },

  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: { marginTop: spacing.md, fontSize: 15, color: colors.textSecondary },
  messageText: {
    fontSize: 20,
    fontFamily: fonts.serif,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  messageSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  errorText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    alignSelf: 'center',
  },
  backBtnPressed: { opacity: 0.6 },
  backBtnText: { fontSize: 15, fontWeight: '600', color: colors.sage },

  enableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.sage,
    borderRadius: radius.lg,
    minWidth: 220,
    shadowColor: colors.sageDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  enableBtnPressed: { backgroundColor: colors.sageDark, shadowOpacity: 0.1 },
  enableBtnText: { fontSize: 16, fontWeight: '700', color: colors.textLight },
});

const waterTempStyles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  noticeText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    flex: 1,
  },
});
