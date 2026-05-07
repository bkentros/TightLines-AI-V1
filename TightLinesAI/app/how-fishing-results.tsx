/**
 * How's Fishing Results — Redirect Stub
 *
 * Phase 2: Results are now displayed inline in how-fishing.tsx.
 * This file exists as a fallback for deep links or back-navigation;
 * it briefly shows a paper-language "loading your read…" interstitial
 * while we redirect.
 *
 * Visual: matches the rest of the FinFindr paper system (PaperBackground
 * + Fraunces title + breathing forest dot) so the half-second the user
 * sees this stub never feels like a different app.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { paper, paperFonts, paperSpacing } from '../lib/theme';
import { PaperBackground, SectionEyebrow } from '../components/paper';

export default function HowFishingResultsRedirect() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    day_offset?: string;
    target_date?: string;
  }>();

  // Soft breathing dot — same opacity loop the Water Reader skeleton uses.
  const pulse = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    router.replace({
      pathname: '/how-fishing',
      params: {
        ...(params.lat ? { lat: params.lat } : {}),
        ...(params.lon ? { lon: params.lon } : {}),
        ...(params.day_offset ? { day_offset: params.day_offset } : {}),
        ...(params.target_date ? { target_date: params.target_date } : {}),
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaperBackground style={styles.container}>
      <SectionEyebrow size={11} dashes color={paper.red}>
        FINFINDR · DAILY READ
      </SectionEyebrow>
      <Text style={styles.title}>Loading your read…</Text>
      <Text style={styles.subtitle}>
        Pulling today&apos;s conditions for your spot.
      </Text>
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: pulse,
            transform: [
              {
                scale: pulse.interpolate({
                  inputRange: [0.35, 1],
                  outputRange: [0.85, 1.15],
                }),
              },
            ],
          },
        ]}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: paperSpacing.lg,
    gap: paperSpacing.md,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginTop: paperSpacing.sm,
  },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.7,
    textAlign: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: paper.forest,
    marginTop: paperSpacing.md,
  },
});
