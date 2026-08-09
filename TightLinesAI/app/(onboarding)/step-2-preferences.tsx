/**
 * Onboarding profile setup.
 * Username format validates on-device; availability uses is_username_available RPC.
 */

import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
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
import { PaperNavHeader, TopographicLines } from '../../components/paper';
import { hapticImpact, ImpactFeedbackStyle, hapticSelection } from '../../lib/safeHaptics';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import {
  checkUsernameAvailability,
  isUsernameFormatValid,
  normalizeUsername,
} from '../../lib/usernameAvailability';
import type { UserProfile } from '../../lib/types';
import { useAuthScrollLayout } from '../../hooks/useAuthScrollLayout';

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
  const { contentContainerStyle: scrollLayout, keyboardVerticalOffset } =
    useAuthScrollLayout('form', 56);

  // Live pulse on the hero eyebrow dot — shared paper-system anatomy.
  const livePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(livePulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [livePulse]);

  // Slow premium light sheen sweeping across the hero cover.
  const heroSheen = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroSheen, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
        Animated.timing(heroSheen, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(3400),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [heroSheen]);

  // Real-time username availability — debounced supabase check that
  // tells the user immediately if the handle they typed is already
  // taken (the original on-device validator only checked format and
  // surfaced uniqueness AFTER the upsert at "Finish setup").
  type AvailabilityState = 'idle' | 'checking' | 'available' | 'taken';
  const [usernameAvailability, setUsernameAvailability] =
    useState<AvailabilityState>('idle');
  const usernameDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const usernameCheckSeq = useRef(0);

  useEffect(() => {
    if (usernameDebounce.current) clearTimeout(usernameDebounce.current);

    const trimmed = normalizeUsername(username);
    if (!isUsernameFormatValid(trimmed)) {
      setUsernameAvailability('idle');
      return;
    }

    setUsernameAvailability('checking');
    const seq = ++usernameCheckSeq.current;
    usernameDebounce.current = setTimeout(async () => {
      const result = await checkUsernameAvailability(trimmed, user?.id);
      if (seq !== usernameCheckSeq.current) return;

      if (result.status === 'available') {
        setUsernameAvailability('available');
      } else if (result.status === 'taken') {
        setUsernameAvailability('taken');
      } else {
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
    const trimmedUsername = normalizeUsername(username);
    if (trimmedUsername.length < 3) {
      Alert.alert('Username required', 'Username must be at least 3 characters.');
      return;
    }
    if (!isUsernameFormatValid(trimmedUsername)) {
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

      const availability = await checkUsernameAvailability(trimmedUsername, user.id);
      if (availability.status === 'taken') {
        setUsernameAvailability('taken');
        Alert.alert(
          'Username taken',
          'That username is already in use. Pick another and tap Finish again.',
        );
        return;
      }
      if (availability.status === 'error') {
        Alert.alert(
          'Could not verify username',
          'Check your connection and try again.',
        );
        return;
      }

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

  const trimmedUsernamePreview = normalizeUsername(username);
  const usernameFormatOk = isUsernameFormatValid(trimmedUsernamePreview);
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
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, scrollLayout]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.heroPanel}>
              <TopographicLines
                style={styles.heroTopo}
                color={paper.dashboardInk}
                count={5}
              />
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.heroSheen,
                  {
                    opacity: heroSheen.interpolate({
                      inputRange: [0, 0.12, 0.88, 1],
                      outputRange: [0, 0.16, 0.16, 0],
                    }),
                    transform: [
                      {
                        translateX: heroSheen.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-140, 520],
                        }),
                      },
                      { skewX: '-18deg' },
                    ],
                  },
                ]}
              />

              <View style={styles.heroTopRow}>
                <View style={styles.heroLogoStage}>
                  <View style={styles.heroLogoOrbit} />
                  <View style={[styles.heroLogoSpark, styles.heroLogoSparkTop]} />
                  <View style={[styles.heroLogoSpark, styles.heroLogoSparkBottom]} />
                  <Image
                    source={require('../../assets/images/finfindr-dashboard-logo-transparent.png')}
                    style={styles.heroLogo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.heroWelcomePill}>
                  <View style={styles.heroPulseWrap}>
                    <View style={styles.heroPulseRing} />
                    <Animated.View
                      style={[styles.heroPulseDot, { opacity: livePulse }]}
                    />
                  </View>
                  <Text style={styles.heroWelcomeText}>WELCOME ABOARD</Text>
                </View>
              </View>

              <Text style={styles.heroTitle} allowFontScaling={false}>
                Let&apos;s find your{`\n`}
                <Text style={styles.heroTitleAccent}>home water.</Text>
              </Text>
              <Text style={styles.heroLede}>
                Tell us where you fish and what to call you. FinFindr will open tuned to your local conditions.
              </Text>

              <View style={styles.heroBenefitsRow}>
                <HeroBenefit icon="navigate-outline" label="LOCAL READS" />
                <HeroBenefit icon="book-outline" label="YOUR LOG" />
                <HeroBenefit icon="sparkles-outline" label="READY TO FISH" />
              </View>
            </View>

            <View style={styles.setupCard}>
              <View style={styles.setupIntro}>
                <Text style={styles.setupEyebrow}>MAKE FINFINDR YOURS</Text>
                <Text style={styles.setupTitle}>Two quick details.</Text>
                <Text style={styles.setupIntroCopy}>
                  You can update both later from your account.
                </Text>
                <View style={styles.setupMap}>
                  <View style={styles.setupMapItem}>
                    <Text style={styles.setupMapLabel}>HANDLE</Text>
                    <Text style={styles.setupMapMeta}>REQUIRED</Text>
                  </View>
                  <View style={styles.setupMapItem}>
                    <Text style={styles.setupMapLabel}>STATE</Text>
                    <Text style={styles.setupMapMeta}>REQUIRED</Text>
                  </View>
                  <View style={styles.setupMapItem}>
                    <Text style={styles.setupMapLabel}>CITY · OPT.</Text>
                    <Text style={styles.setupMapMeta}>OPTIONAL</Text>
                  </View>
                </View>
              </View>

              <SetupPanel
                icon="at-outline"
                label="CHOOSE YOUR HANDLE"
                hint="The name shown on your fishing logs and account."
              >
              <View
                style={[
                  styles.usernameField,
                  usernameFieldBad && styles.inputError,
                  usernameFieldGood && styles.inputSuccess,
                ]}
              >
                <Text
                  style={[
                    styles.usernameAt,
                    usernameFieldGood && { color: paper.bandPrime },
                    usernameFieldBad && { color: paper.bandTough },
                  ]}
                >
                  @
                </Text>
                <TextInput
                  style={styles.usernameInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="yourhandle"
                  placeholderTextColor={paper.dashboardInk + '4D'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username-new"
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

              <View style={styles.setupDivider} />

              <SetupPanel
                icon="location-outline"
                label="SET YOUR HOME WATER"
                hint="Your state sets the region. A city makes your first local read even more precise."
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
                      <Ionicons name="navigate-outline" size={13} color={paper.dashboardBlue} />
                    )}
                    <Text style={styles.locAutoBtnText}>
                      {locationLoading ? 'FINDING...' : 'FIND ME'}
                    </Text>
                  </Pressable>
                }
              >
              <View style={styles.locationFieldsRow}>
                <View style={styles.locationFieldState}>
                  <Text style={styles.miniFieldLabel}>STATE · REQUIRED</Text>
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
                      {homeState || 'State'}
                    </Text>
                    <Ionicons
                      name={showStateList ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={paper.dashboardInk}
                    />
                  </Pressable>
                </View>

                <View style={styles.locationFieldCity}>
                  <Text style={styles.miniFieldLabel}>CITY · OPTIONAL</Text>
                  <TextInput
                    style={styles.input}
                    value={homeCity}
                    onChangeText={setHomeCity}
                    placeholder="Your city"
                    placeholderTextColor={paper.dashboardInk + '70'}
                    autoCorrect={false}
                    returnKeyType="done"
                    maxLength={60}
                  />
                </View>
              </View>

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

              </SetupPanel>
            </View>

            {/* Single-page setup meter — fills as required details are entered. */}
            <View style={styles.meter}>
              <View style={styles.meterRow}>
                <Text style={styles.meterLabel}>REQUIRED DETAILS</Text>
                <Text
                  style={[
                    styles.meterCount,
                    completionFraction === 1 && styles.meterCountReady,
                  ]}
                >
                  {Math.round(completionFraction * 2)} / 2 READY
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

            <View style={styles.privacyNote}>
              <Ionicons name="shield-checkmark-outline" size={13} color={paper.dashboardMuted} />
              <Text style={styles.footnote}>YOUR LOCATION STAYS PRIVATE</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function HeroBenefit({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.heroBenefit}>
      <Ionicons name={icon} size={13} color={paper.dashboardBlueLight} />
      <Text style={styles.heroBenefitLabel}>{label}</Text>
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
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xxl,
  },
  heroPanel: {
    position: 'relative',
    alignItems: 'stretch',
    backgroundColor: paper.dashboardInk,
    borderRadius: 24,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.lg,
    marginBottom: paperSpacing.lg,
    overflow: 'hidden',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
  },
  heroTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.11,
  },
  heroSheen: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 64,
    backgroundColor: 'rgba(124,184,218,0.32)',
    zIndex: 2,
  },
  heroTopRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: paperSpacing.sm,
    zIndex: 3,
  },
  heroLogoStage: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogoOrbit: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(124,184,218,0.38)',
  },
  heroLogo: {
    width: 58,
    height: 58,
  },
  heroLogoSpark: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: paper.dashboardBlueLight,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    zIndex: 2,
  },
  heroLogoSparkTop: { top: 0, left: 34 },
  heroLogoSparkBottom: { right: 2, bottom: 13 },
  heroWelcomePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(124,184,218,0.28)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 4,
  },
  heroWelcomeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardBlueLight,
    letterSpacing: 1.7,
  },
  heroRubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: paperSpacing.sm,
    zIndex: 1,
  },
  heroRubricRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardInk,
    opacity: 0.3,
  },
  heroRubricText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
    opacity: 0.62,
  },
  heroMasthead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.md,
    marginBottom: paperSpacing.xs,
    zIndex: 1,
  },
  heroSealWrap: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  heroSealRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: paper.dashboardBlue,
    opacity: 0.5,
  },
  heroSealDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: paper.dashboardBlue,
    opacity: 0.55,
  },
  heroSealDotTop: { top: 0, alignSelf: 'center' },
  heroSealDotBottom: { bottom: 0, alignSelf: 'center' },
  heroSealDotLeft: { left: 0, top: '50%', marginTop: -2 },
  heroSealDotRight: { right: 0, top: '50%', marginTop: -2 },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },
  heroPulseWrap: {
    width: 9,
    height: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPulseRing: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
    borderColor: paper.dashboardBlueLight,
    opacity: 0.5,
  },
  heroPulseDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: paper.dashboardBlueLight,
  },
  heroEyebrowText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardBlue,
    letterSpacing: 2.2,
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 33,
    color: paper.dashboardWhite,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 36,
    textAlign: 'left',
    zIndex: 1,
  },
  heroTitleAccent: {
    color: paper.dashboardBlueLight,
    fontFamily: paperFonts.displayItalic,
  },
  heroLede: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardWhite,
    opacity: 0.72,
    lineHeight: 19,
    textAlign: 'left',
    marginTop: paperSpacing.sm,
    zIndex: 1,
  },
  heroBenefitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.16)',
    zIndex: 1,
  },
  heroBenefit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  heroBenefitLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    color: paper.dashboardWhite,
    letterSpacing: 0.8,
    opacity: 0.72,
  },
  setupCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.sm,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
  },
  setupIntro: {
    marginBottom: paperSpacing.lg,
  },
  setupEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    color: paper.dashboardBlue,
    letterSpacing: 2,
    marginBottom: 5,
  },
  setupTitle: {
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '700',
    color: paper.dashboardInk,
  },
  setupIntroCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardMuted,
    marginTop: 4,
  },
  setupMap: {
    flexDirection: 'row',
    gap: 7,
    marginTop: paperSpacing.md,
  },
  setupMapItem: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#F2F7FA',
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  setupMapLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    color: paper.dashboardInk,
    letterSpacing: 1,
  },
  setupMapMeta: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 7,
    color: paper.dashboardBlue,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  setupDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
    marginHorizontal: -paperSpacing.lg,
    marginBottom: paperSpacing.lg,
  },
  heroIndexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: paperSpacing.md,
    paddingTop: paperSpacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: paper.dashboardInk,
    zIndex: 1,
  },
  heroIndexItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  heroIndexNumeral: {
    fontFamily: paperFonts.display,
    fontSize: 14,
    fontWeight: '700',
    color: paper.dashboardBlue,
    lineHeight: 16,
  },
  heroIndexLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 1.2,
    opacity: 0.7,
  },
  heroIndexDivider: {
    width: StyleSheet.hairlineWidth,
    height: 22,
    backgroundColor: paper.dashboardInk,
    opacity: 0.2,
  },
  setupPanel: {
    marginBottom: paperSpacing.lg,
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
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: paper.dashboardBlueSky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 2.2,
    fontWeight: '700',
  },
  sectionHint: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.62,
    lineHeight: 18,
    marginBottom: paperSpacing.md,
  },
  input: {
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  locationFieldsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: paperSpacing.sm,
  },
  locationFieldState: {
    width: 112,
    gap: 5,
  },
  locationFieldCity: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  miniFieldLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8,
    color: paper.dashboardMuted,
    letterSpacing: 1.2,
  },
  inputError: { borderColor: paper.bandTough, borderWidth: 1.5 },
  inputSuccess: { borderColor: paper.bandPrime, borderWidth: 1.5 },
  usernameField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
  },
  usernameAt: {
    fontFamily: paperFonts.display,
    fontSize: 20,
    fontWeight: '700',
    color: paper.dashboardBlue,
    lineHeight: 24,
    marginRight: 5,
  },
  usernameInput: {
    flex: 1,
    paddingVertical: paperSpacing.md - 2,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  usernameStatusSlot: { width: 26, alignItems: 'center', marginLeft: paperSpacing.xs },
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
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
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
    marginTop: paperSpacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
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
    backgroundColor: paper.dashboardInk,
    borderWidth: 0,
    borderRadius: 14,
    paddingVertical: paperSpacing.md + 2,
    marginTop: paperSpacing.sm,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaReady: {
    backgroundColor: paper.dashboardBlue,
    shadowColor: paper.dashboardBlue,
    shadowOpacity: 0.28,
    shadowRadius: 12,
  },
  ctaPressed: { opacity: 0.82 },
  btnDisabled: { opacity: 0.55 },

  // Completion meter ──────────────────────────────────────────────────────
  meter: {
    marginTop: paperSpacing.lg,
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
    fontSize: 11,
    color: paper.dashboardInk,
    letterSpacing: 1.8,
    opacity: 0.6,
  },
  meterCount: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12,
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
    fontFamily: paperFonts.bodyBold,
    fontSize: 9,
    color: paper.dashboardInk,
    opacity: 0.48,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: paperSpacing.md,
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
    fontSize: 12,
    color: paper.dashboardCream,
    letterSpacing: 1.6,
    fontWeight: '700',
  },
});
