/**
 * LocationPickerModal
 *
 * Full-screen city search modal. Uses a U.S.-focused geocoding flow with
 * exact city/state handling, request cancellation, and cached results so the
 * picker feels fast and reliable for U.S. city lookup.
 *
 * Visual system: FinFindr paper/ink (matches Home, How's Fishing, Recommender,
 * My Log, Settings, Auth). Behavior, props, and data flow are unchanged from
 * the previous version — this is a pure visual migration.
 *
 * Props:
 *   visible       — controls modal visibility
 *   currentLabel  — currently active location label
 *   onSelect      — called with { lat, lon, label } when user picks a city
 *   onUseGPS      — called when user taps "Use my current location"
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  paper,
  paperFonts,
  paperSpacing,
} from '../lib/theme';
import type { SavedLocation } from '../store/locationStore';
import { getRecentLocations, type RecentLocation } from '../lib/recentLocations';
import { searchUsCities, type PlaceResult } from '../lib/locationSearch';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

    if (!text.trim() || text.trim().length < 2) {
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
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') return;
        if (requestId !== requestIdRef.current) return;
        setResults([]);
        setError(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 200);
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
  const showPinned = shortQuery && savedLocation != null;
  const showHint = shortQuery && !showRecent && !showPinned;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: paper.dashboardCream }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>

          {/* ── Header ── */}
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <View style={styles.headerSide} />
            <View style={styles.headerTitleWrap} pointerEvents="none">
              <Text style={styles.title}>Choose Your Location</Text>
            </View>
            <View style={styles.headerSide}>
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
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* ── Search Input ── */}
          <View style={styles.searchWrap}>
            <Ionicons
              name="search-outline"
              size={16}
              color={paper.dashboardInk}
              style={styles.searchIcon}
            />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search a city or town..."
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
              <Pressable onPress={handleClear} hitSlop={10} style={styles.clearBtn}>
                <Ionicons name="close" size={16} color={paper.dashboardInk} />
              </Pressable>
            ) : null}
          </View>

          {/* ── GPS Option ── */}
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
                styles.gpsIconWrap,
                !isUsingCustom && styles.gpsIconWrapActive,
              ]}
            >
              <Ionicons
                name="locate"
                size={16}
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
                Use my current location
              </Text>
              <Text
                style={[
                  styles.gpsSub,
                  !isUsingCustom && styles.gpsSubActive,
                ]}
              >
                {isUsingCustom
                  ? 'Use where you are right now'
                  : `Fishing near ${currentLabel}`}
              </Text>
            </View>
            {!isUsingCustom && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>ACTIVE</Text>
              </View>
            )}
          </Pressable>

          {/* ── Divider ── */}
          <View style={styles.dividerWrap}>
            <View style={styles.dividerRule} />
            <Text style={styles.dividerLabel}>OR PICK A CITY</Text>
            <View style={styles.dividerRule} />
          </View>

          {/* ── Results ── */}
          {showResults && (
            <FlatList
              data={results}
              keyExtractor={(item) => `${item.lat}_${item.lon}`}
              keyboardShouldPersistTaps="handled"
              style={styles.resultsList}
              contentContainerStyle={styles.resultsListContent}
              ItemSeparatorComponent={() => <View style={styles.resultSep} />}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.resultRow,
                    pressed && styles.resultRowPressed,
                  ]}
                  onPress={() =>
                    onSelect({ lat: item.lat, lon: item.lon, label: item.label })
                  }
                >
                  <View style={styles.resultIconWrap}>
                    <Ionicons name="pin" size={14} color={paper.dashboardInk} />
                  </View>
                  <View style={styles.resultTextWrap}>
                    <Text style={styles.resultLabel} numberOfLines={1}>
                      {item.label}
                    </Text>
                    <Text style={styles.resultSub}>PIN THIS SPOT</Text>
                  </View>
                  <Pressable
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.pinBtn,
                      pressed && styles.pinBtnPressed,
                    ]}
                    onPress={() =>
                      onSelect({ lat: item.lat, lon: item.lon, label: item.label })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Pin ${item.label}`}
                  >
                    <Ionicons name="pin" size={12} color="#FFFFFF" />
                    <Text style={styles.pinBtnText}>PIN</Text>
                  </Pressable>
                </Pressable>
              )}
            />
          )}

          {/* ── Recents + pinned (when no query) ── */}
          {!showResults && (
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollBodyContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* ── Currently pinned custom location ── */}
              {showPinned && savedLocation && (
                <Pressable
                  style={({ pressed }) => [
                    styles.currentCustomWrap,
                    pressed && styles.currentCustomWrapPressed,
                  ]}
                  onPress={() => onSelect(savedLocation)}
                >
                  <Text style={styles.currentCustomHead}>
                    PINNED SPOT
                  </Text>
                  <View style={styles.currentCustomRow}>
                    <Ionicons name="pin" size={16} color={paper.dashboardInk} />
                    <Text style={styles.currentCustomLabel} numberOfLines={1}>
                      {savedLocation.label}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={paper.dashboardInk}
                    />
                  </View>
                  <Text style={styles.currentCustomSub}>
                    Tap to use this pinned spot. Search above to pin a different city.
                  </Text>
                </Pressable>
              )}

              {showRecent && (
                <View style={styles.recentSection}>
                  <Text style={styles.recentSectionHead}>RECENT SPOTS</Text>
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
                            onSelect({ lat: r.lat, lon: r.lon, label: r.label })
                          }
                        >
                          <View style={styles.resultIconWrap}>
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={paper.dashboardInk}
                            />
                          </View>
                          <View style={styles.resultTextWrap}>
                            <Text style={styles.resultLabel} numberOfLines={1}>
                              {r.label}
                            </Text>
                            <Text style={styles.resultSub}>PIN THIS SPOT</Text>
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={14}
                            color={paper.dashboardInk}
                          />
                        </Pressable>
                      </React.Fragment>
                    ))}
                  </View>
                </View>
              )}

              {/* ── Hint when no query and no custom pinned ── */}
              {showHint && (
                <View style={styles.hintWrap}>
                  <Ionicons
                    name="map-outline"
                    size={28}
                    color={paper.dashboardBlue}
                    style={{ marginBottom: 10, opacity: 0.5 }}
                  />
                  <Text style={styles.hintTitle}>Planning a fishing trip?</Text>
                  <Text style={styles.hintSub}>
                    Search a U.S. city to check conditions and the 7-day
                    fishing outlook there.
                  </Text>
                </View>
              )}

              {/* ── Empty results ── */}
              {showEmpty && (
                <View style={styles.hintWrap}>
                  <Text style={styles.hintTitle}>No matching spots for “{query}”</Text>
                  <Text style={styles.hintSub}>
                    Try a nearby city or check the spelling.
                  </Text>
                </View>
              )}

              {/* ── Network error ── */}
              {error && (
                <View style={styles.hintWrap}>
                  <Text style={styles.hintTitle}>Could not search right now</Text>
                  <Text style={styles.hintSub}>
                    Check your connection and try again.
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles — FinFindr paper/ink language
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: paper.dashboardInk,
  },
  headerSide: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  closeBtnPressed: {
    opacity: 0.7,
  },

  /* Search */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    marginHorizontal: paperSpacing.lg,
    marginTop: paperSpacing.md,
    paddingLeft: 12,
    paddingRight: 6,
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* GPS Row */
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: paperSpacing.lg,
    marginTop: paperSpacing.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  gpsRowActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  gpsRowPressed: {
    opacity: 0.85,
  },
  gpsIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F6F9FB',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsIconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.24)',
  },
  gpsTextWrap: { flex: 1 },
  gpsLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    color: paper.dashboardInk,
    marginBottom: 2,
  },
  gpsLabelActive: {
    color: '#FFFFFF',
  },
  gpsSub: {
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    color: paper.dashboardMuted,
    opacity: 0.72,
    lineHeight: 15,
  },
  gpsSubActive: {
    color: 'rgba(255,255,255,0.75)',
    opacity: 0.85,
  },
  activePill: {
    backgroundColor: paper.bandPrime,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  activePillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 1.4,
  },

  /* Divider with label */
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: paperSpacing.lg,
    marginTop: paperSpacing.lg,
    marginBottom: paperSpacing.sm,
    gap: 10,
  },
  dividerRule: {
    flex: 1,
    height: 1,
    backgroundColor: paper.dashboardLine,
  },
  dividerLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardMuted,
    letterSpacing: 2.2,
    opacity: 0.75,
  },

  /* Scroll body for recents / pinned / hints */
  scrollBody: { flex: 1 },
  scrollBodyContent: {
    paddingBottom: paperSpacing.xl,
  },

  /* Recent */
  recentSection: {
    marginHorizontal: paperSpacing.lg,
    marginTop: paperSpacing.sm,
  },
  recentSectionHead: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardBlue,
    letterSpacing: 2.2,
    marginBottom: paperSpacing.sm,
    opacity: 0.75,
  },
  recentList: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  /* Results list */
  resultsList: {
    flex: 1,
    marginHorizontal: paperSpacing.lg,
  },
  resultsListContent: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 0,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  resultRowPressed: {
    backgroundColor: '#F6F9FB',
  },
  resultSep: {
    height: 1,
    backgroundColor: paper.dashboardHair,
    marginHorizontal: 14,
  },
  resultIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: paper.dashboardBlueSky,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTextWrap: { flex: 1 },
  resultLabel: {
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 15,
    color: paper.dashboardInk,
    marginBottom: 2,
  },
  resultSub: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardMuted,
    letterSpacing: 1.4,
    opacity: 0.65,
  },
  pinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: paper.dashboardInk,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  pinBtnPressed: {
    backgroundColor: paper.dashboardBlue,
  },
  pinBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },

  /* Currently pinned location */
  currentCustomWrap: {
    marginHorizontal: paperSpacing.lg,
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.md,
    padding: 14,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  currentCustomWrapPressed: {
    backgroundColor: '#F6F9FB',
  },
  currentCustomHead: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardBlue,
    letterSpacing: 2.2,
    marginBottom: 8,
    opacity: 0.75,
  },
  currentCustomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  currentCustomLabel: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardInk,
    flex: 1,
    letterSpacing: 0,
  },
  currentCustomSub: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardMuted,
    opacity: 0.72,
    lineHeight: 17,
  },

  /* Hint / empty states */
  hintWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: paperSpacing.xl,
    paddingTop: paperSpacing.xxl,
    paddingBottom: paperSpacing.xl,
  },
  hintTitle: {
    fontFamily: paperFonts.display,
    fontSize: 18,
    color: paper.dashboardInk,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0,
  },
  hintSub: {
    fontFamily: paperFonts.body,
    fontSize: 13.5,
    color: paper.dashboardMuted,
    opacity: 0.72,
    textAlign: 'center',
    lineHeight: 19,
  },
});
