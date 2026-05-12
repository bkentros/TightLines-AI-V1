import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { paper } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';

/**
 * Legacy route: onboarding is now two steps (welcome + username/location).
 * Old sessions or deep links still point here — bounce to the right place.
 */
export default function OnboardingStep3Redirect() {
  const router = useRouter();
  const isOnboarded = useAuthStore((s) => s.isOnboarded);

  useEffect(() => {
    if (isOnboarded) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(onboarding)/step-2-preferences');
    }
  }, [isOnboarded, router]);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={paper.dashboardBlue} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardCream,
  },
});
