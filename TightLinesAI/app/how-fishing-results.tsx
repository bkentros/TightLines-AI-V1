import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { paper, paperFonts, paperSpacing } from '../lib/theme';

export default function HowFishingResultsRedirect() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    day_offset?: string;
    target_date?: string;
  }>();

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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>FINFINDR CONDITIONS</Text>
        <Text style={styles.title}>Loading Today&apos;s Bite.</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: paperSpacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: paperSpacing.md,
    paddingHorizontal: paperSpacing.lg,
    paddingVertical: paperSpacing.xl,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 26,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: paperSpacing.sm,
  },
  subtitle: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardMuted,
    opacity: 0.7,
    textAlign: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: paper.bandPrime,
    marginTop: paperSpacing.md,
  },
});
