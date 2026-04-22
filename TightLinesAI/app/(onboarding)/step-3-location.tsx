import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, fonts, spacing, radius } from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../lib/types';

export default function OnboardingStep3() {
  const router = useRouter();
  const {
    user,
    onboardingPrefs,
    setProfile,
    clearOnboardingPrefs,
  } = useAuthStore();

  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'denied'
  >('idle');
  const [saving, setSaving] = useState(false);

  const requestLocation = async () => {
    setLocationStatus('requesting');
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationStatus(status === 'granted' ? 'granted' : 'denied');
  };

  const saveProfileAndFinish = async () => {
    if (!user) {
      Alert.alert('Error', 'No authenticated user found. Please sign in again.');
      return;
    }

    if (!onboardingPrefs.username) {
      Alert.alert(
        'Missing preferences',
        'Something went wrong. Please go back and complete step 2.',
      );
      return;
    }

    setSaving(true);
    try {
      const profileData = {
        id: user.id,
        username: onboardingPrefs.username,
        display_name: onboardingPrefs.display_name || null,
        home_region: onboardingPrefs.home_region || null,
        home_state: onboardingPrefs.home_state || null,
        home_city: onboardingPrefs.home_city || null,
        fishing_mode: onboardingPrefs.fishing_mode ?? 'both',
        target_species: onboardingPrefs.target_species ?? [],
        preferred_units: (onboardingPrefs.preferred_units ?? 'imperial') as 'imperial' | 'metric',
        subscription_tier: 'free' as const,
        onboarding_complete: true,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        // Handle duplicate username race condition
        if (error.code === '23505') {
          Alert.alert(
            'Username taken',
            'That username was just taken. Please go back and choose a different one.',
          );
          return;
        }
        throw error;
      }

      setProfile(data as UserProfile);
      clearOnboardingPrefs();
      // Root layout guard will navigate to (tabs) automatically
    } catch (err) {
      console.error('Profile save error:', err);
      Alert.alert(
        'Could not save profile',
        'Please check your connection and try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    if (locationStatus === 'idle') {
      // They haven't tried yet — ask them to try or skip
      Alert.alert(
        'Location not set yet',
        'You can use your current location now or skip and add a spot later.',
      );
      return;
    }
    await saveProfileAndFinish();
  };

  const handleSkip = async () => {
    await saveProfileAndFinish();
  };

  const locationGranted = locationStatus === 'granted';
  const locationDenied = locationStatus === 'denied';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>

        {/* Progress */}
        <View style={styles.progress}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < 2 && styles.progressDotDone,
                i === 2 && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Ionicons
              name={locationGranted ? 'location' : 'location-outline'}
              size={36}
              color={locationGranted ? colors.sage : colors.stone}
            />
          </View>

          <Text style={styles.title}>Location access</Text>
          <View style={styles.accentLine} />
          <Text style={styles.subtitle}>
            FinFindr can use your current spot for reports and tackle picks,
            including weather, tide where available, and moon data.
          </Text>

          {/* Benefits */}
          <View style={styles.benefits}>
            {[
              'Pulls weather, tide, and moon details',
              'Tailors reads to the water near you',
              'Powers live conditions on Home',
            ].map((b) => (
              <View key={b} style={styles.benefit}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.sage}
                />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.privacyNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={colors.textSecondary}
            />
            <Text style={styles.privacyText}>
              Your exact coordinates are never shared. Location data is used
              only to fetch conditions for your spot.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {locationGranted && (
            <View style={styles.grantedBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.sage} />
              <Text style={styles.grantedText}>
                Location access granted!
              </Text>
            </View>
          )}

          {locationDenied && (
            <View style={styles.deniedBanner}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.warmTan}
              />
              <Text style={styles.deniedText}>
                Location denied. You can turn it on later in Settings.
              </Text>
            </View>
          )}

          {!locationGranted && !locationDenied && (
            <Pressable
              style={({ pressed }) => [
                styles.locationBtn,
                pressed && styles.locationBtnPressed,
                locationStatus === 'requesting' && styles.btnDisabled,
              ]}
              onPress={requestLocation}
              disabled={locationStatus === 'requesting'}
            >
              <Ionicons name="location" size={18} color={colors.textLight} />
              <Text style={styles.locationBtnText}>
                {locationStatus === 'requesting'
                  ? 'Requesting…'
                  : 'Use Current Location'}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnPrimary,
              pressed && styles.btnPrimaryPressed,
              saving && styles.btnDisabled,
            ]}
            onPress={
              locationGranted || locationDenied ? handleContinue : handleSkip
            }
            disabled={saving}
          >
            <Text style={styles.btnText}>
              {saving
                ? 'Setting up your account…'
                : locationGranted
                  ? 'Start Fishing'
                  : 'Skip for now'}
            </Text>
            {!saving && (
              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.textLight}
              />
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingTop: spacing.md,
    alignSelf: 'flex-start',
  },

  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  progressDotActive: { backgroundColor: colors.sage, width: 24 },
  progressDotDone: { backgroundColor: colors.sage },

  content: { flex: 1, justifyContent: 'center', paddingVertical: spacing.lg },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.sageLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.sage + '30',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  accentLine: {
    width: 40,
    height: 3,
    backgroundColor: colors.sage,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },

  benefits: { gap: spacing.sm, marginBottom: spacing.lg },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  privacyText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    flex: 1,
  },

  actions: { gap: spacing.sm },

  grantedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.sageLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  grantedText: { fontSize: 14, fontWeight: '600', color: colors.sageDark },

  deniedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warmTan + '18',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.warmTan + '40',
  },
  deniedText: {
    fontSize: 13,
    color: colors.stone,
    flex: 1,
    lineHeight: 18,
  },

  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.tileDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  locationBtnPressed: { backgroundColor: colors.tileDarkPressed },
  locationBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  btnPrimary: { backgroundColor: colors.sage },
  btnPrimaryPressed: { backgroundColor: colors.sageDark },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.textLight },
});
