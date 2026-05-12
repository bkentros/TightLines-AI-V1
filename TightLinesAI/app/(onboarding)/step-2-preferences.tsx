/**
 * Onboarding Step 2 — Username + home water only.
 * Username format validates on-device (instant). Uniqueness is enforced by one
 * `upsert` on Finish — no Supabase round trip while typing.
 */

import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { paper, paperFonts, paperSpacing } from '../../lib/theme';
import { PaperNavHeader } from '../../components/paper';
import { hapticImpact, ImpactFeedbackStyle, hapticSelection } from '../../lib/safeHaptics';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../lib/types';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const PROFILE_SAVE_DEADLINE_MS = 35_000;
const SESSION_LOOKUP_DEADLINE_MS = 5_000;

function withDeadline<T>(factory: () => PromiseLike<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('deadline')), ms);
    Promise.resolve(factory())
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

const STATE_NAME_TO_ABBR: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI',
  Wyoming: 'WY',
};

export default function OnboardingStep2() {
  const router = useRouter();
  const { session, user, setProfile, clearOnboardingPrefs } = useAuthStore();

  const [username, setUsername] = useState('');
  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showStateList, setShowStateList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? '';
    if (name) {
      const suggested = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .slice(0, 30);
      if (suggested.length >= 3) {
        setUsername(suggested);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const buildHomeRegion = () => {
    if (homeCity.trim() && homeState) return `${homeCity.trim()}, ${homeState}`;
    if (homeState) return homeState;
    return '';
  };

  const autoFillLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location permission needed',
          'Allow location to fill your state and city, or enter them manually.',
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo) {
        if (geo.region) {
          const stateAbbr = STATE_NAME_TO_ABBR[geo.region] ?? geo.region;
          if (US_STATES.includes(stateAbbr)) setHomeState(stateAbbr);
        }
        if (geo.city) setHomeCity(geo.city);
      }
    } catch {
      Alert.alert(
        'Could not find your location',
        'Please enter your home state and city manually.',
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleContinue = async () => {
    const trimmedUsername = username.trim().toLowerCase();
    if (trimmedUsername.length < 3) {
      Alert.alert('Username required', 'Username must be at least 3 characters.');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      Alert.alert('Invalid username', 'Use letters, numbers, and underscores only.');
      return;
    }
    if (!homeState) {
      Alert.alert('Home state required', 'Select the state where you fish most.');
      return;
    }

    hapticImpact(ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      if (!user) throw new Error('No authenticated user');

      const activeSession =
        session ??
        (await withDeadline(
          () => supabase.auth.getSession().then(({ data }) => data.session),
          SESSION_LOOKUP_DEADLINE_MS,
        ));
      if (!activeSession) {
        Alert.alert(
          'Session expired',
          'Sign in again from the welcome screen, then finish setup.',
        );
        return;
      }
      if (activeSession.user.id !== user.id) {
        throw new Error('Signed-in user changed. Please sign in again.');
      }

      const profileData = {
        id: user.id,
        username: trimmedUsername,
        display_name: null,
        home_region: buildHomeRegion() || null,
        home_state: homeState || null,
        home_city: homeCity.trim() || null,
        fishing_mode: 'both' as const,
        target_species: [] as string[],
        preferred_units: 'imperial' as const,
        subscription_tier: 'free' as const,
        onboarding_complete: true,
      };

      const { data, error } = await withDeadline(
        () =>
          supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' })
            .select()
            .single(),
        PROFILE_SAVE_DEADLINE_MS,
      );

      if (error) {
        if (error.code === '23505') {
          const hint = `${error.message ?? ''} ${(error as { details?: string }).details ?? ''}`;
          const usernameUniqueViolation =
            /username/i.test(hint) || /profiles_username/i.test(hint);
          Alert.alert(
            usernameUniqueViolation ? 'Username taken' : 'Could not save profile',
            usernameUniqueViolation
              ? 'That username is already in use. Pick another and tap Finish again.'
              : 'Please try again in a moment.',
          );
          return;
        }
        throw error;
      }

      if (!data) {
        throw new Error('No profile row returned after save');
      }

      clearOnboardingPrefs();
      setProfile(data as UserProfile);
      setLoading(false);
      router.replace('/(tabs)');
      return;
    } catch (err) {
      if (err instanceof Error && err.message === 'deadline') {
        Alert.alert(
          'Could not reach FinFindr',
          'Saving your profile timed out. Check Wi‑Fi or cell data and tap Finish again.',
        );
        console.error('[onboarding] profile save deadline');
        return;
      }
      const msg =
        err && typeof err === 'object' && 'message' in err && typeof (err as Error).message === 'string'
          ? (err as Error).message.slice(0, 200)
          : 'Please try again.';
      Alert.alert('Could not finish setup', msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const trimmedUsernamePreview = username.trim().toLowerCase();
  const usernameFieldOk =
    trimmedUsernamePreview.length >= 3 &&
    /^[a-z0-9_]+$/.test(trimmedUsernamePreview);
  const usernameFieldInvalidChars =
    trimmedUsernamePreview.length > 0 && !/^[a-z0-9_]*$/.test(trimmedUsernamePreview);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="YOUR PROFILE"
          onBack={() => router.back()}
          right={<StepPill step={2} total={2} />}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.eyebrowRow}>
              <Text style={styles.pageEyebrow}>USERNAME & HOME WATER</Text>
            </View>

            <Text style={styles.heroTitle}>Almost fishing.</Text>
            <Text style={styles.heroLede}>
              Pick a public username and where you usually fish — that&apos;s all we need
              to personalize your read.
            </Text>

            <Section
              label="USERNAME"
              hint="3–30 characters, letters, numbers, underscores. Uniqueness is checked when you finish."
            >
              <View style={styles.usernameRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.usernameInput,
                    usernameFieldInvalidChars && styles.inputError,
                    usernameFieldOk && styles.inputSuccess,
                  ]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="e.g. redfish_brandon"
                  placeholderTextColor={paper.dashboardInk + '70'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={30}
                />
                <View style={styles.usernameStatusSlot}>
                  {usernameFieldOk ? (
                    <Ionicons name="checkmark-circle" size={20} color={paper.dashboardBlue} />
                  ) : null}
                </View>
              </View>
              {usernameFieldInvalidChars && (
                <Text style={styles.errorText}>Only letters, numbers, and underscores.</Text>
              )}
              {usernameFieldOk && (
                <Text style={styles.successText}>Good format — tap Finish to claim it.</Text>
              )}
            </Section>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>HOME WATER</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.locAutoBtn,
                    pressed && styles.locAutoBtnPressed,
                    locationLoading && styles.btnDisabled,
                  ]}
                  onPress={autoFillLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <ActivityIndicator size="small" color={paper.dashboardBlue} />
                  ) : (
                    <Ionicons name="location-outline" size={13} color={paper.dashboardBlue} />
                  )}
                  <Text style={styles.locAutoBtnText}>
                    {locationLoading ? 'FINDING…' : 'USE LOCATION'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.sectionHint}>
                State is required. City helps local conditions on Home.
              </Text>

              <Pressable
                style={styles.statePicker}
                onPress={() => {
                  hapticSelection();
                  setShowStateList((v) => !v);
                }}
              >
                <Text
                  style={[styles.statePickerText, !homeState && styles.statePickerPlaceholder]}
                >
                  {homeState || 'Select your state'}
                </Text>
                <Ionicons
                  name={showStateList ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={paper.dashboardInk}
                />
              </Pressable>

              {showStateList && (
                <View style={styles.stateList}>
                  <ScrollView
                    style={styles.stateScroll}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  >
                    {US_STATES.map((state) => (
                      <Pressable
                        key={state}
                        style={[styles.stateOption, homeState === state && styles.stateOptionActive]}
                        onPress={() => {
                          hapticSelection();
                          setHomeState(state);
                          setShowStateList(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.stateOptionText,
                            homeState === state && styles.stateOptionTextActive,
                          ]}
                        >
                          {state}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TextInput
                style={[styles.input, { marginTop: paperSpacing.sm }]}
                value={homeCity}
                onChangeText={setHomeCity}
                placeholder="City (optional)"
                placeholderTextColor={paper.dashboardInk + '70'}
                autoCorrect={false}
                returnKeyType="done"
                maxLength={60}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
                loading && styles.btnDisabled,
              ]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={paper.dashboardCream} />
              ) : (
                <>
                  <Text style={styles.ctaText}>FINISH & GO FISHING</Text>
                  <Ionicons name="arrow-forward" size={16} color={paper.dashboardCream} />
                </>
              )}
            </Pressable>

            <Text style={styles.footnote}>— STEP 2 OF 2 —</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function Section({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
      {children}
    </View>
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
  safe: { flex: 1, backgroundColor: paper.dashboardCream },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  eyebrowRow: { marginBottom: paperSpacing.md },
  pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    letterSpacing: 2,
    color: paper.dashboardBlue,
    fontWeight: '700',
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 38,
    marginBottom: paperSpacing.xs,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: paperSpacing.section,
  },
  section: { marginBottom: paperSpacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: paperSpacing.xs,
  },
  sectionLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
    marginBottom: paperSpacing.xs,
    fontWeight: '700',
  },
  sectionHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.65,
    marginBottom: paperSpacing.sm,
  },
  input: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  inputError: { borderColor: paper.dashboardBlue },
  inputSuccess: { borderColor: paper.dashboardBlue },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: paperSpacing.sm },
  usernameInput: { flex: 1 },
  usernameStatusSlot: { width: 26, alignItems: 'center' },
  errorText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.dashboardBlue,
    marginTop: paperSpacing.xs,
    letterSpacing: 0.4,
  },
  successText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.dashboardBlue,
    marginTop: paperSpacing.xs,
    letterSpacing: 0.4,
  },
  locAutoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardWhite,
  },
  locAutoBtnPressed: { backgroundColor: '#F6F9FB' },
  locAutoBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 1.6,
  },
  statePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
  },
  statePickerText: {
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  statePickerPlaceholder: { opacity: 0.55 },
  stateList: {
    marginTop: paperSpacing.xs,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
  },
  stateScroll: { maxHeight: 200 },
  stateOption: {
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 4,
  },
  stateOptionActive: { backgroundColor: '#F6F9FB' },
  stateOptionText: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  stateOptionTextActive: {
    color: paper.dashboardBlue,
    fontFamily: paperFonts.bodyBold,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardBlue,
    borderWidth: 2,
    borderColor: paper.dashboardInk,
    borderRadius: 12,
    paddingVertical: paperSpacing.md,
    marginTop: paperSpacing.sm,
  },
  ctaPressed: { backgroundColor: paper.dashboardBlue },
  btnDisabled: { opacity: 0.55 },
  ctaText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.dashboardCream,
    letterSpacing: 2.8,
  },
  footnote: {
    marginTop: paperSpacing.md,
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardInk,
    opacity: 0.55,
    letterSpacing: 2.2,
    textAlign: 'center',
  },
  stepPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
  },
  stepPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
});
