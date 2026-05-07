/**
 * Onboarding Step 3 — Location.
 *
 * Visual migration into the FinFindr paper system. Behavior is unchanged:
 *   • `requestLocation` calls `expo-location.requestForegroundPermissionsAsync`
 *     and tracks granted/denied state.
 *   • `saveProfileAndFinish` inserts the profile (with the same shape and
 *     duplicate-username `23505` handling) and then clears the onboarding
 *     prefs so the root-layout guard navigates to the tabs.
 *   • Continue/Skip semantics preserved.
 *
 * Visual structure mirrors steps 1 + 2: paper nav header (BACK + STEP 3/3),
 * Fraunces hero title, italic subhead, three benefit rows on paper cards,
 * a forest CTA chrome, and a privacy ledger note at the bottom.
 */

import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  PaperBackground,
  PaperNavHeader,
  SectionEyebrow,
} from '../../components/paper';
import { hapticImpact, ImpactFeedbackStyle } from '../../lib/safeHaptics';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../lib/types';

const BENEFITS = [
  'Pulls weather, tide, and moon details',
  'Tailors reads to the water near you',
  'Powers live conditions on Home',
];

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
    hapticImpact(ImpactFeedbackStyle.Light);
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

    hapticImpact(ImpactFeedbackStyle.Medium);
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
      // Root layout guard navigates to (tabs) automatically once profile lands.
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="LOCATION"
          onBack={() => router.back()}
          right={<StepPill step={3} total={3} />}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eyebrowRow}>
            <SectionEyebrow dashes size={11} color={paper.red}>
              ONE LAST PERMISSION
            </SectionEyebrow>
          </View>

          <View style={styles.iconWrap}>
            <Ionicons
              name={locationGranted ? 'location' : 'location-outline'}
              size={32}
              color={locationGranted ? paper.forest : paper.ink}
            />
          </View>

          <Text style={styles.heroTitle}>Location access.</Text>
          <Text style={styles.heroLede}>
            FinFindr can use your current spot for reports and tackle picks,
            including weather, tide where available, and moon data.
          </Text>

          {/* Benefit rows */}
          <View style={styles.benefits}>
            {BENEFITS.map((b) => (
              <View key={b} style={styles.benefitRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={paper.forest}
                />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>

          {/* Privacy note */}
          <View style={styles.privacyNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={paper.ink}
            />
            <Text style={styles.privacyText}>
              Your exact coordinates are never shared. Location data is used
              only to fetch conditions for your spot.
            </Text>
          </View>

          {/* State banner */}
          {locationGranted && (
            <View style={[styles.banner, styles.bannerGranted]}>
              <Ionicons name="checkmark-circle" size={18} color={paper.forest} />
              <Text style={styles.bannerGrantedText}>
                Location access granted!
              </Text>
            </View>
          )}
          {locationDenied && (
            <View style={[styles.banner, styles.bannerDenied]}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={paper.red}
              />
              <Text style={styles.bannerDeniedText}>
                Location denied. You can turn it on later in Settings.
              </Text>
            </View>
          )}

          {/* Permission CTA */}
          {!locationGranted && !locationDenied && (
            <Pressable
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.secondaryBtnPressed,
                locationStatus === 'requesting' && styles.btnDisabled,
              ]}
              onPress={requestLocation}
              disabled={locationStatus === 'requesting'}
            >
              <Ionicons name="location" size={16} color={paper.ink} />
              <Text style={styles.secondaryBtnText}>
                {locationStatus === 'requesting'
                  ? 'REQUESTING…'
                  : 'USE CURRENT LOCATION'}
              </Text>
            </Pressable>
          )}

          {/* Primary CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
              saving && styles.btnDisabled,
            ]}
            onPress={
              locationGranted || locationDenied ? handleContinue : handleSkip
            }
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={paper.paper} />
            ) : (
              <>
                <Text style={styles.ctaText}>
                  {locationGranted ? 'START FISHING' : 'SKIP FOR NOW'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={paper.paper} />
              </>
            )}
          </Pressable>

          <Text style={styles.footnote}>— STEP 3 OF 3 · ALMOST THERE —</Text>
        </ScrollView>
      </PaperBackground>
    </SafeAreaView>
  );
}

function StepPill({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.stepPill}>
      <Text style={styles.stepPillText}>
        STEP {step} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.paper },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },

  eyebrowRow: { marginBottom: paperSpacing.md },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: paper.paperLight,
    borderWidth: 2,
    borderColor: paper.ink,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: paperSpacing.md,
    ...paperShadows.hard,
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -1.2,
    lineHeight: 38,
    marginBottom: paperSpacing.xs,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.75,
    lineHeight: 21,
    marginBottom: paperSpacing.section,
  },

  benefits: {
    gap: paperSpacing.sm,
    marginBottom: paperSpacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
    ...paperShadows.hard,
  },
  benefitText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.ink,
    lineHeight: 20,
  },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.xs,
    marginBottom: paperSpacing.lg,
  },
  privacyText: {
    flex: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.65,
    lineHeight: 18,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
    borderWidth: 1.5,
    borderRadius: paperRadius.card,
    marginBottom: paperSpacing.md,
  },
  bannerGranted: {
    backgroundColor: paper.paperLight,
    borderColor: paper.forest,
  },
  bannerGrantedText: {
    flex: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.forest,
    letterSpacing: 0.4,
  },
  bannerDenied: {
    backgroundColor: paper.paperLight,
    borderColor: paper.red,
  },
  bannerDeniedText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.85,
    lineHeight: 18,
  },

  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.md,
    marginBottom: paperSpacing.md,
  },
  secondaryBtnPressed: { backgroundColor: paper.paperDark },
  secondaryBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.4,
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.forest,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.md,
    ...paperShadows.hard,
  },
  ctaPressed: { backgroundColor: paper.forestDk },
  btnDisabled: { opacity: 0.55 },
  ctaText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.paper,
    letterSpacing: 2.8,
  },

  footnote: {
    marginTop: paperSpacing.md,
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.ink,
    opacity: 0.55,
    letterSpacing: 2.2,
    textAlign: 'center',
  },

  stepPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: paper.ink,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paperLight,
  },
  stepPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.ink,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
});
