/**
 * LocationPickerModal
 *
 * Full-screen city search modal. Uses OpenStreetMap Nominatim (free, no key
 * required) with a 350ms debounce. US-only results, filtered to populated
 * places (cities, towns, villages).
 *
 * Props:
 *   visible       — controls modal visibility
 *   currentLabel  — currently active location label (shown as context)
 *   onSelect      — called with { lat, lon, label } when user picks a city
 *   onUseGPS      — called when user taps "Use my GPS location"
 *   onClose       — called when user dismisses without selecting
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radius } from '../lib/theme';
import type { SavedLocation } from '../store/locationStore';
import { getRecentLocations, type RecentLocation } from '../lib/recentLocations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlaceResult {
  lat: number;
  lon: number;
  label: string; // "City, ST"
}

interface Props {
  visible: boolean;
  currentLabel: string;
  isUsingCustom: boolean;
  savedLocation: SavedLocation | null;
  onSelect: (loc: SavedLocation) => void;
  onUseGPS: () => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// State abbreviation lookup — Nominatim sometimes returns full state names
// ---------------------------------------------------------------------------

const STATE_ABBR: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY',
};

function toStateAbbr(stateName: string): string {
  return STATE_ABBR[stateName] ?? stateName;
}

const ABBR_TO_STATE_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ABBR).map(([name, abbr]) => [abbr, name]),
) as Record<string, string>;

/** "Charleston, SC" → structured Nominatim city + state name */
function parseCityCommaState(q: string): { city: string; state: string } | null {
  const m = q.match(/^([^,]{2,}),\s*([A-Za-z.\s]{2,})\s*$/);
  if (!m) return null;
  const city = m[1].trim();
  let state = m[2].trim();
  if (/^[A-Z]{2}$/i.test(state)) {
    const full = ABBR_TO_STATE_NAME[state.toUpperCase()];
    if (full) state = full;
  }
  if (city.length < 2 || state.length < 2) return null;
  return { city, state };
}

// ---------------------------------------------------------------------------
// Nominatim search
// ---------------------------------------------------------------------------

interface NominatimItem {
  lat: string;
  lon: string;
  place_id?: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    borough?: string;
    hamlet?: string;
    municipality?: string;
    county?: string;
    state?: string;
    'ISO3166-2-lvl4'?: string;
  };
  type?: string;
  class?: string;
}

const NOMINATIM_HEADERS = {
  'User-Agent': 'TightLinesAI/2.0 (fishing app; contact@tightlines.ai)',
  Accept: 'application/json',
} as const;

function mapNominatimToPlaces(data: NominatimItem[], max = 8): PlaceResult[] {
  const seen = new Set<string>();
  const results: PlaceResult[] = [];

  for (const item of data) {
    const addr = item.address;
    if (!addr) continue;

    const city =
      addr.city ??
      addr.town ??
      addr.village ??
      addr.borough ??
      addr.hamlet ??
      addr.municipality ??
      addr.county;
    const state = addr.state ?? '';
    if (!city || !state) continue;

    const isoCode = addr['ISO3166-2-lvl4']?.replace('US-', '');
    const stateCode = isoCode ?? toStateAbbr(state);
    const label = stateCode ? `${city}, ${stateCode}` : `${city}, ${state}`;
    const key = `${label}|${item.place_id ?? `${item.lat},${item.lon}`}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      label,
    });

    if (results.length >= max) break;
  }

  return results;
}

async function nominatimFetch(params: URLSearchParams): Promise<NominatimItem[]> {
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const res = await fetch(url, { headers: NOMINATIM_HEADERS });
  if (!res.ok) return [];
  return (await res.json()) as NominatimItem[];
}

async function searchCities(query: string): Promise<PlaceResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    // 1) US settlements (strict)
    let data = await nominatimFetch(
      new URLSearchParams({
        q: trimmed,
        countrycodes: 'us',
        format: 'jsonv2',
        limit: '12',
        addressdetails: '1',
        featuretype: 'settlement',
        dedupe: '1',
      }),
    );
    let places = mapNominatimToPlaces(data);
    if (places.length > 0) return places;

    // 2) Same query without featuretype (admin areas, neighborhoods)
    data = await nominatimFetch(
      new URLSearchParams({
        q: trimmed,
        countrycodes: 'us',
        format: 'jsonv2',
        limit: '12',
        addressdetails: '1',
        dedupe: '1',
      }),
    );
    places = mapNominatimToPlaces(data);
    if (places.length > 0) return places;

    // 3) Structured "City, ST" (helps Charleston, SC style queries)
    const parsed = parseCityCommaState(trimmed);
    if (parsed) {
      data = await nominatimFetch(
        new URLSearchParams({
          city: parsed.city,
          state: parsed.state,
          country: 'usa',
          format: 'jsonv2',
          limit: '10',
          addressdetails: '1',
        }),
      );
      places = mapNominatimToPlaces(data);
    }

    return places;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LocationPickerModal({
  visible,
  currentLabel,
  isUsingCustom,
  savedLocation,
  onSelect,
  onUseGPS,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [recentLocations, setRecentLocations] = useState<RecentLocation[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Reset state when modal opens; reload recent picks from storage
  useEffect(() => {
    if (visible) {
      setQuery('');
      setResults([]);
      setLoading(false);
      setError(false);
      void getRecentLocations().then(setRecentLocations);
    }
  }, [visible]);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    setError(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim() || text.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await searchCities(text);
        setResults(r);
        setError(false);
      } catch {
        setResults([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 150);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setLoading(false);
    inputRef.current?.focus();
  }, []);

  const showResults = results.length > 0;
  const showEmpty = query.trim().length >= 2 && !loading && !showResults && !error;
  const shortQuery = query.trim().length < 2;
  const showRecent = shortQuery && recentLocations.length > 0;
  const showHint = shortQuery && !isUsingCustom && !showRecent;
  const showCurrentCustom = shortQuery && isUsingCustom;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { paddingTop: insets.top > 0 ? 8 : 16 }]}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={{ width: 32 }} />
            <Text style={styles.title}>Fishing Location</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* ── Search Input ── */}
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={17} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search any city…"
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={handleQueryChange}
              autoFocus
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
            />
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 12 }} />
            ) : query.length > 0 ? (
              <Pressable onPress={handleClear} hitSlop={10} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>

          {/* ── GPS Option ── */}
          <Pressable
            style={({ pressed }) => [
              styles.gpsRow,
              pressed && styles.gpsRowPressed,
              !isUsingCustom && styles.gpsRowActive,
            ]}
            onPress={onUseGPS}
          >
            <View style={[styles.gpsIconWrap, !isUsingCustom && styles.gpsIconWrapActive]}>
              <Ionicons
                name="locate"
                size={18}
                color={isUsingCustom ? colors.primary : colors.textOnPrimary}
              />
            </View>
            <View style={styles.gpsTextWrap}>
              <Text style={[styles.gpsLabel, !isUsingCustom && styles.gpsLabelActive]}>
                Use my GPS location
              </Text>
              <Text style={styles.gpsSub}>
                {isUsingCustom ? 'Switch back to real-time GPS position' : `Active — ${currentLabel}`}
              </Text>
            </View>
            {!isUsingCustom && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Active</Text>
              </View>
            )}
          </Pressable>

          {showRecent && (
            <View style={styles.recentSection}>
              <Text style={styles.recentSectionHead}>Recent locations</Text>
              {recentLocations.map((r) => (
                <Pressable
                  key={`${r.lat}_${r.lon}_${r.label}`}
                  style={({ pressed }) => [
                    styles.recentRow,
                    pressed && styles.resultRowPressed,
                  ]}
                  onPress={() => onSelect({ lat: r.lat, lon: r.lon, label: r.label })}
                >
                  <View style={styles.resultIconWrap}>
                    <Ionicons name="time-outline" size={15} color={colors.primary} />
                  </View>
                  <View style={styles.resultTextWrap}>
                    <Text style={styles.resultLabel}>{r.label}</Text>
                    <Text style={styles.resultSub}>Tap to use</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={15} color={colors.border} />
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.divider}>
            <Text style={styles.dividerLabel}>OR SEARCH A CITY</Text>
          </View>

          {/* ── Results ── */}
          {showResults && (
            <FlatList
              data={results}
              keyExtractor={(item) => `${item.lat}_${item.lon}`}
              keyboardShouldPersistTaps="handled"
              style={styles.resultsList}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.resultRow,
                    pressed && styles.resultRowPressed,
                  ]}
                  onPress={() => onSelect({ lat: item.lat, lon: item.lon, label: item.label })}
                >
                  <View style={styles.resultIconWrap}>
                    <Ionicons name="pin" size={15} color={colors.primary} />
                  </View>
                  <View style={styles.resultTextWrap}>
                    <Text style={styles.resultLabel}>{item.label}</Text>
                    <Text style={styles.resultSub}>United States</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={15} color={colors.border} />
                </Pressable>
              )}
            />
          )}

          {/* ── Currently pinned custom location ── */}
          {showCurrentCustom && savedLocation && (
            <Pressable
              style={({ pressed }) => [
                styles.currentCustomWrap,
                pressed && styles.currentCustomWrapPressed,
              ]}
              onPress={() => onSelect(savedLocation)}
            >
              <Text style={styles.currentCustomHead}>Pinned Location — tap to activate</Text>
              <View style={styles.currentCustomRow}>
                <Ionicons name="pin" size={16} color={colors.primary} />
                <Text style={styles.currentCustomLabel}>{currentLabel}</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </View>
              <Text style={styles.currentCustomSub}>
                Search above to pin a different city, or tap "Use my GPS location" to switch back.
              </Text>
            </Pressable>
          )}

          {/* ── Hint when no query ── */}
          {showHint && (
            <View style={styles.hintWrap}>
              <Ionicons name="map-outline" size={32} color={colors.border} style={{ marginBottom: 8 }} />
              <Text style={styles.hintTitle}>Planning a fishing trip?</Text>
              <Text style={styles.hintSub}>
                Search any US city to see conditions and the 7-day outlook for that location.
              </Text>
            </View>
          )}

          {/* ── Empty results ── */}
          {showEmpty && (
            <View style={styles.hintWrap}>
              <Text style={styles.hintTitle}>No results for "{query}"</Text>
              <Text style={styles.hintSub}>Try a different spelling or a nearby city.</Text>
            </View>
          )}

          {/* ── Network error ── */}
          {error && (
            <View style={styles.hintWrap}>
              <Text style={styles.hintTitle}>Search unavailable</Text>
              <Text style={styles.hintSub}>Check your connection and try again.</Text>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Search */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginTop: 14,
    paddingLeft: 12,
    paddingRight: 4,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 8,
  },

  /* GPS Row */
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gpsRowActive: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.primaryMist,
  },
  gpsRowPressed: {
    opacity: 0.75,
  },
  gpsIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsIconWrapActive: {
    backgroundColor: colors.primary,
  },
  gpsTextWrap: { flex: 1 },
  gpsLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  gpsLabelActive: {
    color: colors.primaryDark,
  },
  gpsSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  activePill: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activePillText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    color: colors.textOnPrimary,
    letterSpacing: 0.3,
  },

  /* Divider with label */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 4,
    gap: 8,
  },
  dividerLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  recentSection: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  recentSectionHead: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  /* Results list */
  resultsList: {
    marginTop: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  resultRowPressed: {
    backgroundColor: colors.primaryMist,
  },
  resultIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTextWrap: { flex: 1 },
  resultLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 1,
  },
  resultSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },

  /* Currently pinned location */
  currentCustomWrap: {
    margin: 16,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  currentCustomWrapPressed: {
    backgroundColor: colors.primaryMist,
    borderColor: colors.primary + '60',
  },
  currentCustomHead: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  currentCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 8,
  },
  currentCustomLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  currentCustomSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },

  /* Hint / empty states */
  hintWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  hintTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  hintSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
