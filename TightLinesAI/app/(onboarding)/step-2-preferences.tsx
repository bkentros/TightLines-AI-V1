/**
 * Onboarding profile setup.
 * Username format validates on-device (instant). Uniqueness is enforced by one
 * `upsert` on Finish — no Supabase round trip while typing.
 */

import { useEffect, useRef, useState } from 'react';
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
import { BrandEmblem, PaperNavHeader, TopographicLines } from '../../components/paper';
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
  const { session, user, setProfile, clearOnboardingPrefs, signOut } = useAuthStore();

  const [username, setUsername] = useState('');
  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showStateList, setShowStateList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Real-time username availability — debounced supabase check that
  // tells the user immediately if the handle they typed is already
  // taken (the original on-device validator only checked format and
  // surfaced uniqueness AFTER the upsert at "Finish setup").
  type AvailabilityState = 'idle' | 'checking' | 'available' | 'taken';
  const [usernameAvailability, setUsernameAvailability] =
    useState<AvailabilityState>('idle');
  const usernameDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (usernameDebounce.current) clearTimeout(usernameDebounce.current);

    const trimmed = username.trim().toLowerCase();
    if (trimmed.length < 3 || !/^[a-z0-9_]+$/.test(trimmed)) {
      setUsernameAvailability('idle');
      return;
    }

    setUsernameAvailability('checking');
    usernameDebounce.current = setTimeout(async () => {
      try {
        let query = supabase
          .from('profiles')
          .select('id')
          .eq('username', trimmed)
          .limit(1);
        if (user?.id) query = query.neq('id', user.id);

        const { data, error } = await query;
        if (error) {
          // Network/RLS hiccup — fall back to idle so the upsert can
          // still validate at submit time. We don't want to block the
          // user just because the live check failed.
          setUsernameAvailability('idle');
          return;
        }
        setUsernameAvailability(data && data.length > 0 ? 'taken' : 'available');
      } catch {
        setUsernameAvailability('idle');
      }
    }, 450);

    return () => {
      if (usernameDebounce.current) clearTimeout(usernameDebounce.current);
    };
  }, [username, user?.id]);

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
          'Location helps your reads',
          'Allow location to fill your home water and sync local weather, tides when relevant, and fishing conditions. You can also enter it manually.',
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

  const handleBack = () => {
    Alert.alert(
      'Leave setup?',
      "You'll be signed out and can sign in again later.",
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          },
        },
      ],
    );
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
  const usernameFormatOk =
    trimmedUsernamePreview.length >= 3 &&
    /^[a-z0-9_]+$/.test(trimmedUsernamePreview);
  const usernameFieldInvalidChars =
    trimmedUsernamePreview.length > 0 && !/^[a-z0-9_]*$/.test(trimmedUsernamePreview);

  // Combined "good to go" — format-valid AND availability-cleared.
  const usernameFieldGood =
    usernameFormatOk && usernameAvailability === 'available';
  const usernameFieldBad =
    usernameFieldInvalidChars || usernameAvailability === 'taken';

  // Single-page setup meter. It still fills as the required details are
  // completed, but the visible copy reflects that onboarding is one page.
  const completionFraction =
    (usernameFieldGood ? 0.5 : 0) + (homeState ? 0.5 : 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="YOUR PROFILE"
          onBack={handleBack}
          right={<StepPill step={1} total={1} />}
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
            <View style={styles.heroPanel}>
              <TopographicLines
                style={styles.heroTopo}
                color={paper.dashboardBlue}
                count={5}
              />

              <View style={styles.heroMasthead}>
                <View style={styles.heroEmblemWrap}>
                  <BrandEmblem
                    size={58}
                    halo
                    haloColor={paper.dashboardBlue}
                    haloOpacity={0.08}
                  />
                </View>
                <View style={styles.heroCopy}>
                  <View style={styles.heroMetaRow}>
                    <Text style={styles.pageEyebrow}>FINFINDR · PROFILE</Text>
                    <Text style={styles.heroPageChip}>1 / 1</Text>
                  </View>
                  <Text style={styles.heroTitle} allowFontScaling={false}>
                    Set your{'\n'}
                    <Text style={styles.heroTitleAccent}>home base.</Text>
                  </Text>
                  <Text style={styles.heroLede}>
                    Choose a handle and home water so FinFindr opens with your
                    local read ready.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <BenefitPill icon="person-outline" label="Handle" />
                <BenefitPill icon="location-outline" label="Home water" />
                <BenefitPill icon="partly-sunny-outline" label="Weather sync" />
              </View>
            </View>

            <SetupPanel
              icon="person-circle-outline"
              label="USERNAME"
              hint="This is your public handle. Keep it short and easy to recognize."
            >
              <View style={styles.usernameRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.usernameInput,
                    usernameFieldBad && styles.inputError,
                    usernameFieldGood && styles.inputSuccess,
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
                  {usernameAvailability === 'checking' && usernameFormatOk ? (
                    <ActivityIndicator size="small" color={paper.dashboardBlue} />
                  ) : usernameAvailability === 'available' ? (
                    <Ionicons name="checkmark-circle" size={20} color={paper.bandPrime} />
                  ) : usernameAvailability === 'taken' || usernameFieldInvalidChars ? (
                    <Ionicons name="close-circle" size={20} color={paper.bandTough} />
                  ) : null}
                </View>
              </View>
              {usernameFieldInvalidChars && (
                <Text style={styles.errorText}>
                  Only letters, numbers, and underscores.
                </Text>
              )}
              {!usernameFieldInvalidChars &&
                usernameAvailability === 'taken' && (
                  <Text style={styles.errorText}>
                    Already taken — try another handle.
                  </Text>
                )}
              {!usernameFieldInvalidChars &&
                usernameAvailability === 'checking' &&
                usernameFormatOk && (
                  <Text style={styles.checkingText}>
                    Checking availability…
                  </Text>
                )}
              {usernameFieldGood && (
                <Text style={styles.successText}>
                  Available — we&apos;ll claim it when you finish.
                </Text>
              )}
            </SetupPanel>

            <SetupPanel
              icon="location-outline"
              label="HOME WATER"
              hint="State is required. City helps FinFindr start with conditions close to where you fish."
              action={
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
                    {locationLoading ? 'FINDING...' : 'USE LOCATION'}
                  </Text>
                </Pressable>
              }
            >
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
            </SetupPanel>

            {/* Single-page setup meter — fills as required details are entered. */}
            <View style={styles.meter}>
              <View style={styles.meterRow}>
                <Text style={styles.meterLabel}>PROFILE SETUP</Text>
                <Text
                  style={[
                    styles.meterCount,
                    completionFraction === 1 && styles.meterCountReady,
                  ]}
                >
                  PAGE 1 / 1
                </Text>
              </View>
              <View style={styles.meterTrack}>
                <View
                  style={[
                    styles.meterFill,
                    {
                      width: `${Math.round(completionFraction * 100)}%`,
                      backgroundColor:
                        completionFraction === 1
                          ? paper.bandPrime
                          : paper.dashboardBlue,
                    },
                  ]}
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.cta,
                completionFraction === 1 && styles.ctaReady,
                pressed && styles.ctaPressed,
                (loading ||
                  usernameAvailability === 'checking' ||
                  usernameAvailability === 'taken' ||
                  usernameFieldInvalidChars ||
                  !homeState) &&
                  styles.btnDisabled,
              ]}
              onPress={handleContinue}
              disabled={
                loading ||
                usernameAvailability === 'checking' ||
                usernameAvailability === 'taken' ||
                usernameFieldInvalidChars ||
                !homeState
              }
            >
              {loading ? (
                <ActivityIndicator color={paper.dashboardCream} />
              ) : (
                <>
                  <Text style={styles.ctaText}>FINISH SETUP</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={paper.dashboardCream}
                  />
                </>
              )}
            </Pressable>

            <Text style={styles.footnote}>— PROFILE SETUP —</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function BenefitPill({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.benefitPill}>
      <Ionicons name={icon} size={11} color={paper.dashboardBlue} />
      <Text style={styles.benefitPillText}>{label}</Text>
    </View>
  );
}

function SetupPanel({
  icon,
  label,
  hint,
  action,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.setupPanel}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIcon}>
            <Ionicons name={icon} size={16} color={paper.dashboardBlue} />
          </View>
          <Text style={styles.sectionLabel}>{label}</Text>
        </View>
        {action}
      </View>
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
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  flex: { flex: 1, backgroundColor: paper.dashboardCream },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  heroPanel: {
    position: 'relative',
    alignItems: 'stretch',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.md,
    marginBottom: paperSpacing.lg,
    overflow: 'hidden',
  },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.11,
  },
  heroMasthead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    marginBottom: paperSpacing.sm,
    zIndex: 1,
  },
  heroEmblemWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F9FB',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
    marginBottom: 3,
  },
  pageEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 2.2,
    color: paper.dashboardBlue,
    fontWeight: '700',
    flexShrink: 1,
  },
  heroPageChip: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardInk,
    letterSpacing: 1.2,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: paper.dashboardCream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 31,
    color: paper.dashboardInk,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 32,
    textAlign: 'left',
    marginBottom: 4,
    zIndex: 1,
  },
  heroTitleAccent: {
    color: paper.bandPrime,
  },
  heroLede: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 18,
    textAlign: 'left',
    zIndex: 1,
  },
  benefitRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  benefitPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    opacity: 0.72,
  },
  setupPanel: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: paperSpacing.md,
    marginBottom: paperSpacing.xs,
  },
  sectionTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: paper.dashboardBlueSky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
  sectionHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.65,
    lineHeight: 18,
    marginBottom: paperSpacing.md,
  },
  input: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  inputError: { borderColor: paper.bandTough, borderWidth: 1.5 },
  inputSuccess: { borderColor: paper.bandPrime, borderWidth: 1.5 },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: paperSpacing.sm },
  usernameInput: { flex: 1 },
  usernameStatusSlot: { width: 26, alignItems: 'center' },
  errorText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.bandTough,
    marginTop: paperSpacing.xs,
    letterSpacing: 0.4,
  },
  successText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.bandPrime,
    marginTop: paperSpacing.xs,
    letterSpacing: 0.4,
  },
  checkingText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.55,
    marginTop: paperSpacing.xs,
    letterSpacing: 0.2,
  },
  locAutoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: 6,
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
    borderRadius: 8,
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
    borderRadius: 8,
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
    borderRadius: 8,
    paddingVertical: paperSpacing.md,
    marginTop: paperSpacing.sm,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaReady: {
    backgroundColor: paper.bandPrime,
    borderColor: paper.bandPrime,
    shadowColor: paper.bandPrime,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ctaPressed: { backgroundColor: paper.dashboardBlue },
  btnDisabled: { opacity: 0.55 },

  // Completion meter ──────────────────────────────────────────────────────
  meter: {
    marginTop: paperSpacing.md,
    paddingHorizontal: 2,
    gap: 6,
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meterLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardInk,
    letterSpacing: 2.4,
    opacity: 0.6,
  },
  meterCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    color: paper.dashboardInk,
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  meterCountReady: {
    color: paper.bandPrime,
    opacity: 1,
  },
  meterTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: paper.dashboardLine,
    overflow: 'hidden',
  },
  meterFill: {
    height: 3,
    borderRadius: 2,
  },
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  stepPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 9.5,
    color: paper.dashboardCream,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
});
