/**
 * LocationPickerModal — FinFindr "field navigation" edition.
 *
 * Props, data flow, search logic, GPS handling, recent-location cache,
 * and abort/debounce mechanics are preserved exactly. Only the
 * presentation layer was rebuilt to match the premium paper/ink language
 * of the auth, onboarding, and confirm-card screens.
 *
 * Visual concept — "FIELD NAVIGATION · CITY SEARCH":
 *   - Navy header panel with topographic contour lines, corner crosshairs,
 *     a live-pulse beacon dot, and a Fraunces "Choose location." title with
 *     italic accent + blue period.
 *   - Active-location card: a cream-on-ink "dispatch card" with source pill
 *     (CUSTOM / GPS) and the current label in serif type — reads like a
 *     mission-briefing entry.
 *   - Search field: clean ink-bordered input with live result count and
 *     italic italic help copy.
 *   - GPS row: a field-style "USE GPS" selector with animated-state tinting.
 *   - Results / recents presented as numbered "sounding" rows with compass
 *     icon accents.
 *   - "SAVED SPOT" (renamed from duplicate "CURRENT READ") for the saved
 *     custom location when no query is active.
 *
 * No business logic changed.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { paper, paperFonts, paperSpacing } from '../lib/theme';
import type { SavedLocation } from '../store/locationStore';
import { getRecentLocations, type RecentLocation } from '../lib/recentLocations';
import { searchUsCities, type PlaceResult } from '../lib/locationSearch';
import { TopographicLines } from './paper';

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_CITY_QUERY_LENGTH = 1;

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  currentLabel: string;
  isUsingCustom: boolean;
  savedLocation: SavedLocation | null;
  onSelect: (loc: SavedLocation) => void;
  onUseGPS: () => void;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

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
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
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

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
  }, []);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    setError(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (!text.trim() || text.trim().length < MIN_CITY_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const r = await searchUsCities(text, controller.signal);
        if (requestId !== requestIdRef.current) return;
        setResults(r);
        setError(false);
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        if (requestId !== requestIdRef.current) return;
        setResults([]);
        setError(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 140);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setLoading(false);
    inputRef.current?.focus();
  }, []);

  const showResults = results.length > 0;
  const showEmpty =
    query.trim().length >= MIN_CITY_QUERY_LENGTH &&
    !loading &&
    !showResults &&
    !error;
  const shortQuery = query.trim().length < MIN_CITY_QUERY_LENGTH;
  const hasQuery = !shortQuery;
  const showRecent = shortQuery && recentLocations.length > 0;
  const showSelectedLocation = shortQuery && savedLocation != null;
  const showHint = shortQuery && !showRecent && !showSelectedLocation;

  const sourceLabel = isUsingCustom ? 'CUSTOM' : 'GPS';
  let sectionLabel = 'SAVED SPOT & RECENT';
  if (hasQuery) {
    sectionLabel = showResults ? 'TAP A CITY TO USE IT' : 'CITY SUGGESTIONS';
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>

          {/* ── Premium nav header ─────────────────────────────────────── */}
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            {/* Topographic backdrop */}
            <TopographicLines
              style={styles.headerTopo}
              color="#FFFFFF"
              count={5}
            />

            {/* Corner crosshairs — 4 corners of the header */}
            <CornerMark position="topLeft" />
            <CornerMark position="topRight" />
            <CornerMark position="bottomLeft" />
            <CornerMark position="bottomRight" />

            {/* Rubric strip */}
            <View style={styles.headerRubricRow}>
              <View style={styles.headerRubricRule} />
              <Text style={styles.headerRubricText}>
                FIELD NAVIGATION · CITY SEARCH
              </Text>
              <View style={styles.headerRubricRule} />
            </View>

            {/* Title row */}
            <View style={styles.headerTitleRow}>
              {/* Live beacon */}
              <View style={styles.headerBeacon}>
                <View style={styles.headerBeaconRing} />
                <View style={styles.headerBeaconDot} />
              </View>

              <View style={styles.headerTitleWrap}>
                <Text style={styles.headerTitle}>
                  Choose{' '}
                  <Text style={styles.headerTitleItalic}>location</Text>
                  <Text style={styles.headerTitleDot}>.</Text>
                </Text>
                <Text style={styles.headerSubtitle}>
                  Set the place behind every local FinFindr read.
                </Text>
              </View>

              {/* Close button */}
              <Pressable
                onPress={onClose}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && styles.closeBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </Pressable>
            </View>

          </View>

          {/* ── Body ───────────────────────────────────────────────────── */}
          <View style={styles.body}>

            {/* ── Current read scope ──────────────────────────────────── */}
            <View style={styles.scopeDeck}>
              <View style={styles.dispatchCard}>
                <View style={styles.dispatchIconTile}>
                  <Ionicons
                    name={isUsingCustom ? 'location' : 'navigate'}
                    size={17}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.dispatchLeft}>
                  <View style={styles.dispatchSourcePill}>
                    <View
                      style={[
                        styles.dispatchDot,
                        isUsingCustom
                          ? styles.dispatchDotCustom
                          : styles.dispatchDotGps,
                      ]}
                    />
                    <Text style={styles.dispatchSourceText}>READING NOW · {sourceLabel}</Text>
                  </View>
                  <Text
                    style={styles.dispatchLabel}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {currentLabel}
                  </Text>
                </View>
                <View style={styles.dispatchActiveBadge}>
                  <Text style={styles.dispatchActiveBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <View style={styles.scopeNote}>
                <Ionicons name="pulse-outline" size={12} color={paper.dashboardBlue} />
                <Text style={styles.scopeNoteText} numberOfLines={2}>
                  This location powers Live Conditions, Today&apos;s Bite, and the Tackle Box.
                </Text>
              </View>
            </View>

            {/* ── Search field ─────────────────────────────────────────── */}
            <View style={styles.searchBlock}>
              <Text style={styles.searchEyebrow}>SEARCH FOR A DIFFERENT PLACE</Text>
              <View style={styles.searchWrap}>
                <View style={styles.searchIconTile}>
                  <Ionicons
                    name="search-outline"
                    size={15}
                    color={paper.dashboardInk}
                  />
                </View>
                <TextInput
                  ref={inputRef}
                  style={styles.searchInput}
                  placeholder="City, town, or state…"
                  placeholderTextColor={paper.dashboardMuted}
                  value={query}
                  onChangeText={handleQueryChange}
                  autoFocus
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="search"
                  selectionColor={paper.dashboardBlue}
                />
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={paper.dashboardInk}
                    style={{ marginRight: 12 }}
                  />
                ) : query.length > 0 ? (
                  <Pressable
                    onPress={handleClear}
                    hitSlop={10}
                    style={styles.clearBtn}
                  >
                    <Ionicons
                      name="close-circle"
                      size={17}
                      color={paper.dashboardInk}
                      style={{ opacity: 0.55 }}
                    />
                  </Pressable>
                ) : null}
              </View>
              <Text style={styles.searchHelper}>
                {showResults
                  ? `${results.length} matching ${results.length === 1 ? 'city' : 'cities'} — tap to use`
                  : 'Try: Tampa, Duluth MN, Lake Placid, San Diego'}
              </Text>
            </View>

            {/* ── GPS / auto-detect row ─────────────────────────────────── */}
            <Pressable
              style={({ pressed }) => [
                styles.gpsRow,
                !isUsingCustom && styles.gpsRowActive,
                pressed && styles.gpsRowPressed,
              ]}
              onPress={onUseGPS}
            >
              <View
                style={[
                  styles.gpsIconTile,
                  !isUsingCustom && styles.gpsIconTileActive,
                ]}
              >
                <Ionicons
                  name="navigate"
                  size={14}
                  color={!isUsingCustom ? '#FFFFFF' : paper.dashboardInk}
                />
              </View>
              <View style={styles.gpsTextWrap}>
                <Text
                  style={[
                    styles.gpsLabel,
                    !isUsingCustom && styles.gpsLabelActive,
                  ]}
                >
                  {isUsingCustom
                    ? 'Use my current location'
                    : 'Current location active'}
                </Text>
                <Text
                  style={[
                    styles.gpsSub,
                    !isUsingCustom && styles.gpsSubActive,
                  ]}
                >
                  {isUsingCustom
                    ? 'Switch to live GPS weather and fishing conditions'
                    : `Fishing near ${currentLabel}`}
                </Text>
              </View>
              {!isUsingCustom ? (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={paper.bandPrime}
                />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={paper.dashboardInk}
                  style={{ opacity: 0.4 }}
                />
              )}
            </Pressable>

            {/* ── Section divider ───────────────────────────────────────── */}
            <View style={styles.sectionDivider}>
              <View style={styles.dividerRule} />
              <Text style={styles.dividerLabel}>{sectionLabel}</Text>
              <View style={styles.dividerRule} />
            </View>

            {/* ── Search results ────────────────────────────────────────── */}
            {showResults && (
              <FlatList
                data={results}
                keyExtractor={(item) => `${item.lat}_${item.lon}`}
                keyboardShouldPersistTaps="handled"
                style={styles.resultsList}
                contentContainerStyle={styles.resultsListContent}
                ItemSeparatorComponent={() => (
                  <View style={styles.resultSep} />
                )}
                renderItem={({ item, index }) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.resultRow,
                      pressed && styles.resultRowPressed,
                    ]}
                    onPress={() =>
                      onSelect({ lat: item.lat, lon: item.lon, label: item.label })
                    }
                  >
                    <View style={styles.resultOrdinalWrap}>
                      <Text style={styles.resultOrdinal}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                    </View>
                    <View style={styles.resultTextWrap}>
                      <Text style={styles.resultLabel} numberOfLines={1}>
                        {item.label}
                      </Text>
                      <Text style={styles.resultSub}>
                        U.S. freshwater · inshore reads available
                      </Text>
                    </View>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={paper.dashboardBlue}
                      style={{ opacity: 0.7 }}
                    />
                  </Pressable>
                )}
              />
            )}

            {/* ── Recents + saved spot (when no query) ─────────────────── */}
            {!showResults && (
              <ScrollView
                style={styles.scrollBody}
                contentContainerStyle={styles.scrollBodyContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* ── Saved spot — renamed from "CURRENT READ" to avoid dupe ── */}
                {showSelectedLocation && savedLocation && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.savedSpotCard,
                      pressed && styles.savedSpotCardPressed,
                    ]}
                    onPress={() => onSelect(savedLocation)}
                  >
                    <View style={styles.savedSpotLeft}>
                      <View style={styles.savedSpotIconTile}>
                        <Ionicons
                          name="bookmark"
                          size={13}
                          color={paper.dashboardBlue}
                        />
                      </View>
                      <View style={styles.savedSpotTextWrap}>
                        <Text style={styles.savedSpotHead}>SAVED SPOT</Text>
                        <Text
                          style={styles.savedSpotLabel}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {savedLocation.label}
                        </Text>
                        <Text style={styles.savedSpotSub}>
                          Tap to keep this spot, or search above for a new one.
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={paper.dashboardBlue}
                    />
                  </Pressable>
                )}

                {/* ── Recent locations ─────────────────────────────────── */}
                {showRecent && (
                  <View style={styles.recentSection}>
                    <View style={styles.recentSectionHeaderRow}>
                      <Text style={styles.recentSectionHead}>RECENT SPOTS</Text>
                      <View style={styles.recentSectionRule} />
                    </View>
                    <View style={styles.recentList}>
                      {recentLocations.map((r, i) => (
                        <React.Fragment key={`${r.lat}_${r.lon}_${r.label}`}>
                          {i > 0 && <View style={styles.resultSep} />}
                          <Pressable
                            style={({ pressed }) => [
                              styles.recentRow,
                              pressed && styles.resultRowPressed,
                            ]}
                            onPress={() =>
                              onSelect({
                                lat: r.lat,
                                lon: r.lon,
                                label: r.label,
                              })
                            }
                          >
                            <View style={styles.resultOrdinalWrap}>
                              <Ionicons
                                name="time-outline"
                                size={13}
                                color={paper.dashboardInk}
                                style={{ opacity: 0.55 }}
                              />
                            </View>
                            <View style={styles.resultTextWrap}>
                              <Text
                                style={styles.resultLabel}
                                numberOfLines={1}
                              >
                                {r.label}
                              </Text>
                              <Text style={styles.resultSub}>
                                Recent — tap to load local conditions
                              </Text>
                            </View>
                            <Ionicons
                              name="arrow-forward"
                              size={14}
                              color={paper.dashboardInk}
                              style={{ opacity: 0.35 }}
                            />
                          </Pressable>
                        </React.Fragment>
                      ))}
                    </View>
                  </View>
                )}

                {/* ── Hint when no query + no saved location ─────────── */}
                {showHint && (
                  <View style={styles.hintCard}>
                    <View style={styles.hintIconTile}>
                      <Ionicons
                        name="compass-outline"
                        size={22}
                        color={paper.dashboardBlue}
                      />
                    </View>
                    <Text style={styles.hintTitle}>
                      Planning a trip?
                    </Text>
                    <Text style={styles.hintSub}>
                      Start typing a U.S. city, town, or state above. Results
                      narrow as you type — most spots need only a few letters.
                    </Text>
                    <View style={styles.hintExampleRow}>
                      {['Tampa', 'Duluth MN', 'Lake Placid'].map((ex) => (
                        <Pressable
                          key={ex}
                          style={({ pressed }) => [
                            styles.hintExamplePill,
                            pressed && { opacity: 0.7 },
                          ]}
                          onPress={() => handleQueryChange(ex)}
                        >
                          <Text style={styles.hintExampleText}>{ex}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {/* ── Empty results ────────────────────────────────────── */}
                {showEmpty && (
                  <View style={styles.hintCard}>
                    <View style={styles.hintIconTile}>
                      <Ionicons
                        name="search-outline"
                        size={22}
                        color={paper.dashboardInk}
                        style={{ opacity: 0.4 }}
                      />
                    </View>
                    <Text style={styles.hintTitle}>
                      No spots matching &quot;{query}&quot;
                    </Text>
                    <Text style={styles.hintSub}>
                      Try adding a state abbreviation — "Madison WI" — or
                      double-check the spelling.
                    </Text>
                  </View>
                )}

                {/* ── Network error ────────────────────────────────────── */}
                {error && (
                  <View style={styles.hintCard}>
                    <View style={styles.hintIconTile}>
                      <Ionicons
                        name="wifi-outline"
                        size={22}
                        color={paper.bandTough}
                        style={{ opacity: 0.7 }}
                      />
                    </View>
                    <Text style={styles.hintTitle}>
                      Could not search right now
                    </Text>
                    <Text style={styles.hintSub}>
                      Check your connection and try again.
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── CornerMark — L-shaped bracket for the header corners ────────────────────

function CornerMark({
  position,
}: {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}) {
  const isTop = position === 'topLeft' || position === 'topRight';
  const isLeft = position === 'topLeft' || position === 'bottomLeft';
  return (
    <View
      pointerEvents="none"
      style={[
        cornerStyles.wrap,
        isTop ? { top: 8 } : { bottom: 8 },
        isLeft ? { left: 8 } : { right: 8 },
      ]}
    >
      <View
        style={[
          cornerStyles.armH,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
      <View
        style={[
          cornerStyles.armV,
          isTop ? { top: 0 } : { bottom: 0 },
          isLeft ? { left: 0 } : { right: 0 },
        ]}
      />
    </View>
  );
}

const cornerStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: 14,
    height: 14,
  },
  armH: {
    position: 'absolute',
    width: 14,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  armV: {
    position: 'absolute',
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: paper.dashboardInk },
  container: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    position: 'relative',
    backgroundColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.md,
    overflow: 'hidden',
  },
  headerTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.18,
  },
  headerRubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    zIndex: 1,
  },
  headerRubricRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  headerRubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 2.2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    zIndex: 1,
    marginBottom: paperSpacing.md,
  },
  headerBeacon: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerBeaconRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: paper.bandPrime,
    opacity: 0.45,
  },
  headerBeaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandPrime,
  },
  headerTitleWrap: { flex: 1 },
  headerTitle: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  headerTitleItalic: {
    fontFamily: paperFonts.displayItalic,
    color: '#FFFFFF',
  },
  headerTitleDot: {
    color: paper.dashboardBlueLight,
  },
  headerSubtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 16,
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexShrink: 0,
  },
  closeBtnPressed: { opacity: 0.7 },

  // ── Dispatch card (active location) ────────────────────────────────────────
  dispatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  dispatchIconTile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: paper.dashboardInk,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dispatchLeft: { flex: 1, gap: 3 },
  dispatchSourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  dispatchDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dispatchDotCustom: { backgroundColor: paper.dashboardBlueLight },
  dispatchDotGps: { backgroundColor: paper.bandPrime },
  dispatchSourceText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardBlue,
    letterSpacing: 1.6,
  },
  dispatchLabel: {
    fontFamily: paperFonts.display,
    fontSize: 17,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  dispatchActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: paper.dashboardBlueSky,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.3)',
  },
  dispatchActiveBadgeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 1.4,
  },

  // ── Body ───────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },

  scopeDeck: {
    marginHorizontal: paperSpacing.lg,
    marginTop: paperSpacing.md,
    padding: 6,
    borderRadius: 13,
    backgroundColor: '#EAF3F7',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.20)',
  },
  scopeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 3,
  },
  scopeNoteText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardInk,
    opacity: 0.68,
  },

  // ── Search ─────────────────────────────────────────────────────────────────
  searchBlock: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.sm + 2,
    paddingBottom: paperSpacing.sm,
    backgroundColor: paper.dashboardCream,
  },
  searchEyebrow: {
    marginBottom: 6,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
    opacity: 0.62,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    height: 48,
    paddingLeft: 4,
    paddingRight: 6,
  },
  searchIconTile: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchHelper: {
    marginTop: 6,
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.55,
    letterSpacing: 0.1,
  },

  // ── GPS row ────────────────────────────────────────────────────────────────
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginHorizontal: paperSpacing.lg,
    marginBottom: paperSpacing.sm,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.25,
    borderColor: paper.dashboardLine,
  },
  gpsRowActive: {
    borderColor: paper.bandPrime,
    backgroundColor: '#F0FAF3',
  },
  gpsRowPressed: { opacity: 0.8 },
  gpsIconTile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardLine,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  gpsIconTileActive: {
    backgroundColor: paper.bandPrime,
    borderColor: paper.bandPrime,
  },
  gpsTextWrap: { flex: 1 },
  gpsLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
    letterSpacing: 0.1,
  },
  gpsLabelActive: { color: paper.bandPrime },
  gpsSub: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.65,
    lineHeight: 15,
    marginTop: 1,
  },
  gpsSubActive: { color: paper.bandPrime, opacity: 0.8 },

  // ── Section divider ────────────────────────────────────────────────────────
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: paperSpacing.lg,
    marginTop: 2,
    marginBottom: paperSpacing.sm,
  },
  dividerRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.22,
  },
  dividerLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
    opacity: 0.65,
  },

  // ── Results list ───────────────────────────────────────────────────────────
  resultsList: { flex: 1 },
  resultsListContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: 32,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  resultRowPressed: { opacity: 0.75 },
  resultSep: {
    height: 6,
    backgroundColor: 'transparent',
  },
  resultOrdinalWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultOrdinal: {
    fontFamily: paperFonts.display,
    fontSize: 12,
    color: paper.dashboardBlue,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 14,
  },
  resultTextWrap: { flex: 1 },
  resultLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  resultSub: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.55,
    lineHeight: 14,
    marginTop: 2,
  },

  // ── Scroll body (when no results) ─────────────────────────────────────────
  scrollBody: { flex: 1 },
  scrollBodyContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: 32,
    gap: paperSpacing.sm,
  },

  // ── Saved spot card (was: current custom read) ─────────────────────────────
  savedSpotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: paper.dashboardBlue,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: paper.dashboardBlue,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  savedSpotCardPressed: { opacity: 0.78 },
  savedSpotLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  savedSpotIconTile: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardBlueSky,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.25)',
  },
  savedSpotTextWrap: { flex: 1 },
  savedSpotHead: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardBlue,
    letterSpacing: 2,
    marginBottom: 2,
  },
  savedSpotLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  savedSpotSub: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.6,
    lineHeight: 14,
    marginTop: 2,
  },

  // ── Recent section ─────────────────────────────────────────────────────────
  recentSection: { gap: paperSpacing.xs },
  recentSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentSectionHead: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.7,
  },
  recentSectionRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.2,
  },
  recentList: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: 'hidden',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  // ── Hint / empty / error cards ─────────────────────────────────────────────
  hintCard: {
    alignItems: 'center',
    paddingVertical: paperSpacing.xl,
    paddingHorizontal: paperSpacing.lg,
    gap: paperSpacing.sm,
  },
  hintIconTile: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.25,
    borderColor: paper.dashboardLine,
    marginBottom: 4,
  },
  hintTitle: {
    fontFamily: paperFonts.display,
    fontSize: 17,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  hintSub: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.65,
    lineHeight: 18,
    textAlign: 'center',
  },
  hintExampleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  hintExamplePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1.25,
    borderColor: paper.dashboardBlue,
  },
  hintExampleText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.dashboardBlue,
    letterSpacing: 0.5,
  },
});
