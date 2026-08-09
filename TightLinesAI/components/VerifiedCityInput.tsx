import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { searchUsCities, type PlaceResult } from '../lib/locationSearch';
import { paper, paperFonts, paperSpacing } from '../lib/theme';

type VerifiedCityInputProps = {
  value: string;
  stateCode: string;
  verified: boolean;
  onChangeText: (value: string) => void;
  onSelect: (city: string, stateCode: string, place: PlaceResult) => void;
  placeholder?: string;
  inputStyle?: StyleProp<TextStyle>;
};

const MIN_QUERY_LENGTH = 2;

function splitPlaceLabel(label: string): { city: string; stateCode: string } | null {
  const comma = label.lastIndexOf(',');
  if (comma < 1) return null;
  const city = label.slice(0, comma).trim();
  const stateCode = label.slice(comma + 1).trim().toUpperCase();
  if (!city || !/^[A-Z]{2}$/.test(stateCode)) return null;
  return { city, stateCode };
}

export function VerifiedCityInput({
  value,
  stateCode,
  verified,
  onChangeText,
  onSelect,
  placeholder = 'Search for your city',
  inputStyle,
}: VerifiedCityInputProps) {
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searched, setSearched] = useState(false);
  const requestRef = useRef(0);

  useEffect(() => {
    const trimmed = value.trim();
    if (verified || trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      return;
    }

    const request = ++requestRef.current;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      const query = stateCode ? `${trimmed}, ${stateCode}` : trimmed;
      void searchUsCities(query, controller.signal)
        .then((matches) => {
          if (request !== requestRef.current) return;
          const inState = stateCode
            ? matches.filter((match) => match.label.endsWith(`, ${stateCode}`))
            : matches;
          setResults(inState.slice(0, 4));
          setSearched(true);
        })
        .catch((error: unknown) => {
          if ((error as Error)?.name === 'AbortError') return;
          if (request !== requestRef.current) return;
          setResults([]);
          setSearched(true);
        })
        .finally(() => {
          if (request === requestRef.current) setLoading(false);
        });
    }, 160);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [stateCode, value, verified]);

  const choose = (place: PlaceResult) => {
    const parsed = splitPlaceLabel(place.label);
    if (!parsed) return;
    onSelect(parsed.city, parsed.stateCode, place);
    setResults([]);
    setSearched(false);
    setFocused(false);
  };

  const showResults = !verified && results.length > 0;
  const showEmpty = !verified && searched && !loading &&
    value.trim().length >= MIN_QUERY_LENGTH && results.length === 0;
  const showHint = focused && !verified && value.trim().length < MIN_QUERY_LENGTH;

  return (
    <View style={styles.root}>
      <View style={[styles.inputShell, focused && styles.inputShellFocused, verified && styles.inputShellVerified]}>
        <Ionicons
          name={verified ? 'checkmark-circle' : 'search-outline'}
          size={16}
          color={verified ? paper.bandPrime : paper.dashboardBlue}
        />
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={paper.dashboardInk + '70'}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          maxLength={60}
          selectionColor={paper.dashboardBlue}
        />
        {loading ? <ActivityIndicator size="small" color={paper.dashboardBlue} /> : null}
      </View>

      {showHint ? (
        <View style={styles.hintRow}>
          <Ionicons name="information-circle-outline" size={13} color={paper.dashboardBlue} />
          <Text style={styles.hintText}>Type at least two letters, then tap a verified match.</Text>
        </View>
      ) : null}

      {showResults ? (
        <View style={styles.results}>
          <Text style={styles.resultsEyebrow}>SELECT A VERIFIED CITY</Text>
          {results.map((place) => (
            <Pressable
              key={`${place.label}-${place.lat}-${place.lon}`}
              style={({ pressed }) => [styles.result, pressed && styles.resultPressed]}
              onPress={() => choose(place)}
            >
              <View style={styles.resultIcon}>
                <Ionicons name="location-outline" size={14} color={paper.dashboardBlue} />
              </View>
              <Text style={styles.resultLabel}>{place.label}</Text>
              <Ionicons name="chevron-forward" size={13} color={paper.dashboardMuted} />
            </Pressable>
          ))}
        </View>
      ) : null}

      {showEmpty ? (
        <View style={styles.emptyRow}>
          <Ionicons name="alert-circle-outline" size={13} color={paper.dashboardMuted} />
          <Text style={styles.emptyText}>No verified city found. Try another spelling or leave city blank.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative', flex: 1, minWidth: 0 },
  inputShell: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
  },
  inputShellFocused: { borderColor: paper.dashboardBlue },
  inputShellVerified: {
    borderColor: 'rgba(61,149,90,0.55)',
    backgroundColor: '#F4FAF6',
  },
  input: {
    flex: 1,
    paddingVertical: paperSpacing.md - 2,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  results: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  resultsEyebrow: {
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 6,
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.3,
    color: paper.dashboardBlue,
    backgroundColor: '#F2F7FA',
  },
  result: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardLine,
  },
  resultPressed: { backgroundColor: '#F2F7FA' },
  resultIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardBlueSky,
  },
  resultLabel: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardInk,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 7,
  },
  emptyText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 15,
    color: paper.dashboardMuted,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },
  hintText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: paper.dashboardMuted,
  },
});
