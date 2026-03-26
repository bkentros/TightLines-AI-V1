/**
 * How's Fishing Results — Redirect Stub
 *
 * Phase 2: Results are now displayed inline in how-fishing.tsx.
 * This file exists as a fallback for deep links or back-navigation.
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fonts, spacing } from '../lib/theme';

export default function HowFishingResultsRedirect() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    day_offset?: string;
    target_date?: string;
  }>();

  useEffect(() => {
    // Redirect to the unified how-fishing screen
    router.replace({
      pathname: '/how-fishing',
      params: {
        ...(params.lat ? { lat: params.lat } : {}),
        ...(params.lon ? { lon: params.lon } : {}),
        ...(params.day_offset ? { day_offset: params.day_offset } : {}),
        ...(params.target_date ? { target_date: params.target_date } : {}),
      },
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading report...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: fonts.serif,
  },
});
