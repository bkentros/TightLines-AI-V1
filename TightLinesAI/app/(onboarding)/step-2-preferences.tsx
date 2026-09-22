/**
 * Onboarding profile setup — "Find your home water".
 *
 * Username format validates on-device; availability uses is_username_available RPC.
 *
 * Visual language (Sept 2026 redesign): this screen now speaks the same
 * dialect as the Home dashboard instead of a standalone dark hero —
 *   - Cream canvas + mono eyebrow + big Fraunces headline with the graphite
 *     misty-pines sketch, mirroring Home's "Today looks prime." band.
 *   - The form lives inside a white "live card" (blue-tint header strip,
 *     corner marks, topo lines, slow scan line) — the header previews the
 *     user's location label and handle as they fill it in.
 *   - A faint 6-day forecast strip teases what unlocks once a state is set.
 * Behavior (validation, availability check, Find Me, save) is unchanged.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  dashboardBandColor,
  paper,
  paperFonts,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import {
  CornerMarkSet,
  PaperNavHeader,
  TopographicLines,
} from '../../components/paper';
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
import { VerifiedCityInput } from '../../components/VerifiedCityInput';

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

const STATE_ABBR_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_ABBR).map(([name, abbr]) => [abbr, name]),
);

/** Decorative band tints for the forecast teaser (no real scores shown). */
const TEASER_BANDS = [
  paper.bandFair,
  paper.bandGood,
  paper.bandPrime,
  paper.bandGood,
  paper.bandPoor,
  paper.bandPrime,
];

const DAY_ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function greetingForHour(hour: number): string {
  if (hour < 5) return 'LATE NIGHT';
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  if (hour < 21) return 'GOOD EVENING';
  return 'LATE NIGHT';
}

export default function OnboardingStep2() {
  const router = useRouter();
  const { session, user, setProfile, clearOnboardingPrefs, signOut } = useAuthStore();

  const [username, setUsername] = useState('');
  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [homeCityVerified, setHomeCityVerified] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { contentContainerStyle: scrollLayout, keyboardVerticalOffset } =
    useAuthScrollLayout('form', 56);

  // Live pulse on the card header dot — same rhythm as Home's LIVE pill.
  const livePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, {
          toValue: 0.35,
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

  // Slow scan line across the setup card — borrowed from Home's live card.
  const [cardHeight, setCardHeight] = useState(0);
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(2400),
        Animated.timing(scanY, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanY]);

  // Forecast teaser fades from neutral to band tints once a state is set.
  const teaserReveal = useRef(new Animated.Value(0)).current;

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
        if (geo.city) {
          setHomeCity(geo.city);
          setHomeCityVerified(true);
        }
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
    if (homeCity.trim() && !homeCityVerified) {
      Alert.alert(
        'Choose a verified city',
        'Select your city from the suggestions, or clear the optional city field.',
      );
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

  useEffect(() => {
    Animated.timing(teaserReveal, {
      toValue: homeState ? 1 : 0,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [homeState, teaserReveal]);

  const now = useMemo(() => new Date(), []);
  const hhmm = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const greeting = greetingForHour(now.getHours());

  const teaserDays = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        return { key: i, day: DAY_ABBR[d.getDay()], date: d.getDate() };
      }),
    [now],
  );

  const handleReady = usernameFieldGood;
  const stateReady = !!homeState;
  const allReady = completionFraction === 1;

  const previewPlace = homeState
    ? homeCity.trim() && homeCityVerified
      ? `${homeCity.trim()}, ${homeState}`
      : STATE_ABBR_TO_NAME[homeState] ?? homeState
    : null;
  const previewHandle = trimmedUsernamePreview.length > 0 ? `@${trimmedUsernamePreview}` : 'NEW ANGLER';

  const ctaDisabled =
    loading ||
    usernameAvailability === 'checking' ||
    usernameAvailability === 'taken' ||
    usernameFieldInvalidChars ||
    !homeState;

  const readyBand = dashboardBandColor.Prime;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="YOUR PROFILE"
          onBack={handleBack}
          right={<SetupPill />}
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
            {/* ─── Headline band (mirrors Home) ─────────────────────────── */}
            <View style={styles.headlineBand}>
              <View pointerEvents="none" style={styles.headlinePines}>
                <Image
                  source={require('../../assets/images/misty-pines.png')}
                  style={styles.headlinePinesImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.headlineEyebrow}>
                {hhmm} · {greeting}, ANGLER
              </Text>
              <Text style={styles.headlineTitle} allowFontScaling={false}>
                Let&apos;s find your
              </Text>
              <Text style={styles.headlineTitleItalic} allowFontScaling={false}>
                home water<Text style={styles.headlineDot}>.</Text>
              </Text>
              <Text style={styles.headlineLede}>
                Two quick details and FinFindr opens tuned to the water you fish most.
              </Text>
            </View>

            {/* ─── Setup card (live-card anatomy) ───────────────────────── */}
            <View
              style={styles.card}
              onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
            >
              <TopographicLines
                style={StyleSheet.absoluteFill}
                color={paper.dashboardBlue}
                count={4}
              />
              <CornerMarkSet
                color={paper.dashboardBlue}
                size={10}
                thickness={1.1}
                inset={7}
              />
              {cardHeight > 0 && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.scanLine,
                    {
                      transform: [
                        {
                          translateY: scanY.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, cardHeight + 50],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              )}

              {/* Header strip — live preview of what Home will show */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Animated.View
                    style={[
                      styles.cardHeaderDot,
                      {
                        opacity: livePulse,
                        backgroundColor: allReady ? paper.bandPrime : paper.bandFair,
                      },
                    ]}
                  />
                  <Text style={styles.cardHeaderLabel} numberOfLines={1}>
                    {allReady ? 'LIVE' : 'SETTING UP'} ·{' '}
                    {(previewPlace ?? 'Your home water').toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[styles.cardHeaderHandle, handleReady && styles.cardHeaderHandleReady]}
                  numberOfLines={1}
                >
                  {previewHandle}
                </Text>
              </View>

              <View style={styles.cardBody}>
                {/* ── 01 · Handle ─────────────────────────────────────── */}
                <Station
                  number="01"
                  title="Your handle"
                  hint="Shown on your fishing log and account."
                  status={handleReady ? 'ready' : 'required'}
                >
                  <View
                    style={[
                      styles.field,
                      usernameFieldBad && styles.fieldError,
                      usernameFieldGood && styles.fieldSuccess,
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
                      style={styles.fieldInput}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="yourhandle"
                      placeholderTextColor={paper.dashboardInk + '55'}
                      selectionColor={paper.dashboardBlue}
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
                  {!usernameFieldInvalidChars && usernameAvailability === 'taken' && (
                    <Text style={styles.errorText}>
                      Already taken — try another handle.
                    </Text>
                  )}
                  {!usernameFieldInvalidChars &&
                    usernameAvailability === 'checking' &&
                    usernameFormatOk && (
                      <Text style={styles.checkingText}>Checking availability…</Text>
                    )}
                  {usernameFieldGood && (
                    <Text style={styles.successText}>
                      Available — we&apos;ll claim it when you finish.
                    </Text>
                  )}
                </Station>

                <View style={styles.dashedDivider} />

                {/* ── 02 · Home water ─────────────────────────────────── */}
                <Station
                  number="02"
                  title="Home water"
                  hint="Your state sets the region. A city sharpens your first local read."
                  status={stateReady ? 'ready' : 'required'}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.findMe,
                      pressed && styles.findMePressed,
                      locationLoading && styles.btnDisabled,
                    ]}
                    onPress={autoFillLocation}
                    disabled={locationLoading}
                  >
                    <View style={styles.findMeIcon}>
                      {locationLoading ? (
                        <ActivityIndicator size="small" color={paper.dashboardBlue} />
                      ) : (
                        <Ionicons name="navigate" size={14} color={paper.dashboardBlue} />
                      )}
                    </View>
                    <View style={styles.findMeCopy}>
                      <Text style={styles.findMeTitle}>
                        {locationLoading ? 'Finding you…' : 'Use my location'}
                      </Text>
                      <Text style={styles.findMeSub}>Fills state and city in one tap</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={paper.dashboardInk}
                      style={{ opacity: 0.45 }}
                    />
                  </Pressable>

                  <View style={styles.orRow}>
                    <View style={styles.orRule} />
                    <Text style={styles.orText}>OR CHOOSE</Text>
                    <View style={styles.orRule} />
                  </View>

                  <Text style={styles.miniFieldLabel}>STATE</Text>
                  <Pressable
                    style={[
                      styles.field,
                      styles.statePicker,
                      showStateList && styles.fieldFocused,
                      stateReady && !showStateList && styles.fieldSuccess,
                    ]}
                    onPress={() => {
                      hapticSelection();
                      setShowStateList((v) => !v);
                    }}
                  >
                    {homeState ? (
                      <View style={styles.statePickerValue}>
                        <View style={styles.stateBadge}>
                          <Text style={styles.stateBadgeText}>{homeState}</Text>
                        </View>
                        <Text style={styles.statePickerText}>
                          {STATE_ABBR_TO_NAME[homeState] ?? homeState}
                        </Text>
                      </View>
                    ) : (
                      <Text style={[styles.statePickerText, styles.statePickerPlaceholder]}>
                        Select a state
                      </Text>
                    )}
                    <Ionicons
                      name={showStateList ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={paper.dashboardInk}
                      style={{ opacity: 0.6 }}
                    />
                  </Pressable>

                  {showStateList && (
                    <View style={styles.stateGridWrap}>
                      <ScrollView
                        style={styles.stateScroll}
                        contentContainerStyle={styles.stateGrid}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                      >
                        {US_STATES.map((state) => {
                          const active = homeState === state;
                          return (
                            <Pressable
                              key={state}
                              style={({ pressed }) => [
                                styles.stateChip,
                                active && styles.stateChipActive,
                                pressed && !active && styles.stateChipPressed,
                              ]}
                              onPress={() => {
                                hapticSelection();
                                setHomeState(state);
                                setHomeCity('');
                                setHomeCityVerified(false);
                                setShowStateList(false);
                              }}
                            >
                              <Text
                                style={[styles.stateChipText, active && styles.stateChipTextActive]}
                              >
                                {state}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  <View style={styles.cityLabelRow}>
                    <Text style={styles.miniFieldLabel}>CITY</Text>
                    <Text style={styles.miniFieldOptional}>
                      {homeCityVerified ? 'VERIFIED' : 'OPTIONAL'}
                    </Text>
                  </View>
                  <VerifiedCityInput
                    value={homeCity}
                    stateCode={homeState}
                    verified={homeCityVerified}
                    onChangeText={(next) => {
                      setHomeCity(next);
                      setHomeCityVerified(false);
                    }}
                    onSelect={(city, stateCode) => {
                      setHomeCity(city);
                      setHomeState(stateCode);
                      setHomeCityVerified(true);
                    }}
                    placeholder={homeState ? `Search cities in ${homeState}` : 'Search for a city'}
                  />
                </Station>
              </View>
            </View>

            {/* ─── Forecast teaser ──────────────────────────────────────── */}
            <View style={styles.teaser}>
              <View style={styles.teaserHeader}>
                <View style={styles.teaserEyebrowRow}>
                  <View style={styles.teaserEyebrowRule} />
                  <Text style={styles.teaserEyebrow}>YOUR 6-DAY BITE FORECAST</Text>
                </View>
                <Text style={[styles.teaserMeta, stateReady && styles.teaserMetaReady]}>
                  {stateReady ? `UNLOCKS FOR ${homeState}` : 'AWAITS HOME WATER'}
                </Text>
              </View>
              <View style={styles.teaserRow}>
                {teaserDays.map((d, i) => (
                  <View key={d.key} style={styles.teaserTile}>
                    <View style={styles.teaserTileTop}>
                      <Text style={styles.teaserDay}>{d.day}</Text>
                      <Text style={styles.teaserDate}>{d.date}</Text>
                    </View>
                    <View style={styles.teaserTileBottom}>
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          StyleSheet.absoluteFill,
                          {
                            backgroundColor: TEASER_BANDS[i],
                            opacity: teaserReveal.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 0.42],
                            }),
                          },
                        ]}
                      />
                      <Text style={styles.teaserScore}>–.–</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* ─── Progress + CTA ───────────────────────────────────────── */}
            <View style={styles.progressRow}>
              <View style={styles.progressSegments}>
                <View style={[styles.progressSeg, handleReady && styles.progressSegDone]} />
                <View style={[styles.progressSeg, stateReady && styles.progressSegDone]} />
              </View>
              <Text style={[styles.progressText, allReady && { color: readyBand.verdictColor }]}>
                {allReady ? 'PROFILE READY' : `${Math.round(completionFraction * 2)} OF 2 READY`}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.cta,
                allReady && styles.ctaReady,
                pressed && styles.ctaPressed,
                ctaDisabled && styles.btnDisabled,
              ]}
              onPress={handleContinue}
              disabled={ctaDisabled}
            >
              {loading ? (
                <ActivityIndicator color={paper.dashboardCream} />
              ) : (
                <>
                  <Text style={styles.ctaText}>
                    {allReady ? 'OPEN MY DASHBOARD' : 'FINISH SETUP'}
                  </Text>
                  <View style={styles.ctaArrow}>
                    <Ionicons name="arrow-forward" size={13} color={paper.dashboardCream} />
                  </View>
                </>
              )}
            </Pressable>

            <View style={styles.privacyNote}>
              <Ionicons name="lock-closed-outline" size={11} color={paper.dashboardMuted} />
              <Text style={styles.footnote}>
                Your location stays private. Change both anytime in Settings.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

// ─── Station (numbered form section) ─────────────────────────────────────────

function Station({
  number,
  title,
  hint,
  status,
  children,
}: {
  number: string;
  title: string;
  hint?: string;
  status: 'ready' | 'required';
  children: React.ReactNode;
}) {
  const ready = status === 'ready';
  const band = dashboardBandColor.Prime;
  return (
    <View style={styles.station}>
      <View style={styles.stationHeader}>
        <View style={styles.stationNumber}>
          <Text style={styles.stationNumberText}>{number}</Text>
        </View>
        <Text style={styles.stationTitle}>{title}</Text>
        <View
          style={[
            styles.statusChip,
            ready && { backgroundColor: band.chipBg, borderColor: band.chipBorder },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: ready ? paper.bandPrime : paper.bandFair },
            ]}
          />
          <Text style={[styles.statusText, ready && { color: band.verdictColor }]}>
            {ready ? 'READY' : 'REQUIRED'}
          </Text>
        </View>
      </View>
      {hint ? <Text style={styles.stationHint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

function SetupPill() {
  return (
    <View style={styles.setupPill}>
      <Ionicons name="time-outline" size={11} color={paper.dashboardBlueLight} />
      <Text style={styles.setupPillText}>30 SEC</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const FIELD_BG = '#F7F9FA';
const TINT_BG = '#F2F7FA';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  flex: { flex: 1, backgroundColor: paper.dashboardCream },
  scroll: { flex: 1, backgroundColor: paper.dashboardCream },
  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: paperSpacing.xl,
  },

  // ── Headline band ─────────────────────────────────────────────────────────
  headlineBand: {
    position: 'relative',
    marginBottom: 22,
  },
  headlinePines: {
    position: 'absolute',
    right: -30,
    top: 6,
    opacity: 0.9,
  },
  headlinePinesImage: {
    width: 180,
    height: 180,
  },
  headlineEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: '#444',
    marginBottom: 12,
  },
  headlineTitle: {
    fontFamily: paperFonts.display,
    fontSize: 36,
    lineHeight: 39,
    letterSpacing: -0.6,
    color: paper.dashboardInk,
  },
  headlineTitleItalic: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 36,
    lineHeight: 41,
    letterSpacing: -0.6,
    color: paper.dashboardBlue,
    fontStyle: 'italic',
  },
  headlineDot: {
    fontFamily: paperFonts.display,
    color: paper.dashboardInk,
    fontStyle: 'normal',
  },
  headlineLede: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: '#4A4A4A',
    marginTop: 12,
    maxWidth: 300,
  },

  // ── Setup card ────────────────────────────────────────────────────────────
  card: {
    ...paperShadows.hard,
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    overflow: 'hidden',
    marginBottom: 22,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: 'rgba(124,184,218,0.08)',
    zIndex: 1,
  },
  cardHeader: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: TINT_BG,
    borderBottomWidth: 1,
    borderColor: 'rgba(42,110,150,0.14)',
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minWidth: 0,
  },
  cardHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardHeaderLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: paper.dashboardInk,
    flexShrink: 1,
  },
  cardHeaderHandle: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
    maxWidth: 130,
  },
  cardHeaderHandleReady: {
    color: paper.dashboardBlue,
  },
  cardBody: {
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },

  // ── Station ───────────────────────────────────────────────────────────────
  station: {},
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  stationNumber: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: paper.dashboardBlueSky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationNumberText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 0.5,
  },
  stationTitle: {
    flex: 1,
    fontFamily: paperFonts.display,
    fontSize: 19,
    lineHeight: 23,
    color: paper.dashboardInk,
    letterSpacing: -0.2,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
  },
  statusDot: { width: 5, height: 5, borderRadius: 2.5 },
  statusText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.3,
    color: '#555',
  },
  stationHint: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: paper.dashboardMuted,
    marginLeft: 36,
    marginBottom: 14,
  },

  // ── Fields ────────────────────────────────────────────────────────────────
  field: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FIELD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
  },
  fieldFocused: { borderColor: paper.dashboardBlue },
  fieldError: { borderColor: paper.bandTough, borderWidth: 1.5 },
  fieldSuccess: {
    borderColor: 'rgba(61,149,90,0.55)',
    backgroundColor: '#F4FAF6',
  },
  fieldInput: {
    flex: 1,
    paddingVertical: paperSpacing.md - 2,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  usernameAt: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    color: paper.dashboardBlue,
    lineHeight: 24,
    marginRight: 5,
  },
  usernameStatusSlot: { width: 26, alignItems: 'center', marginLeft: paperSpacing.xs },
  errorText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    color: paper.bandTough,
    marginTop: 8,
  },
  successText: {
    fontFamily: paperFonts.bodySemiBold,
    fontSize: 12,
    color: dashboardBandColor.Prime.verdictColor,
    marginTop: 8,
  },
  checkingText: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardMuted,
    marginTop: 8,
  },

  dashedDivider: {
    height: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(42,110,150,0.25)',
    marginVertical: 22,
  },

  // Find me row
  findMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.22)',
    backgroundColor: TINT_BG,
  },
  findMePressed: { backgroundColor: '#E6F0F6' },
  findMeIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findMeCopy: { flex: 1, minWidth: 0 },
  findMeTitle: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  findMeSub: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.dashboardMuted,
    marginTop: 1,
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  orRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: paper.dashboardLine,
  },
  orText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: '#888',
  },

  miniFieldLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    color: '#555',
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  miniFieldOptional: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9.5,
    color: '#999',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  cityLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  // State picker
  statePicker: {
    justifyContent: 'space-between',
  },
  statePickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stateBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: paper.dashboardInk,
  },
  stateBadgeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 11,
    color: paper.dashboardWhite,
    letterSpacing: 1,
  },
  statePickerText: {
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
  },
  statePickerPlaceholder: { color: paper.dashboardInk + '70' },
  stateGridWrap: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
    ...paperShadows.hard,
  },
  stateScroll: { maxHeight: 228 },
  stateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
    padding: 8,
  },
  stateChip: {
    width: '18.6%',
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    backgroundColor: FIELD_BG,
  },
  stateChipPressed: { backgroundColor: paper.dashboardBlueSky },
  stateChipActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  stateChipText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12,
    color: paper.dashboardInk,
    letterSpacing: 0.8,
  },
  stateChipTextActive: { color: paper.dashboardWhite },

  // ── Forecast teaser ───────────────────────────────────────────────────────
  teaser: { marginBottom: 24 },
  teaserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  teaserEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  teaserEyebrowRule: {
    width: 14,
    height: 1.5,
    backgroundColor: '#444',
  },
  teaserEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 2,
    color: '#444',
    flexShrink: 1,
  },
  teaserMeta: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 8.5,
    letterSpacing: 1.2,
    color: '#999',
  },
  teaserMetaReady: { color: dashboardBandColor.Prime.verdictColor },
  teaserRow: {
    flexDirection: 'row',
    gap: 6,
  },
  teaserTile: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
    overflow: 'hidden',
  },
  teaserTileTop: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  teaserDay: {
    fontFamily: paperFonts.metaMono,
    fontSize: 9,
    letterSpacing: 1.4,
    color: '#666',
  },
  teaserDate: {
    fontFamily: paperFonts.display,
    fontSize: 15,
    color: paper.dashboardInk,
    marginTop: 1,
  },
  teaserTileBottom: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    backgroundColor: '#EEEEEA',
  },
  teaserScore: {
    fontFamily: paperFonts.display,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.4,
  },

  // ── Progress + CTA ────────────────────────────────────────────────────────
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressSegments: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.09)',
  },
  progressSegDone: { backgroundColor: paper.bandPrime },
  progressText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: '#555',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: paper.dashboardInk,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  ctaReady: {
    backgroundColor: paper.dashboardBlue,
    shadowColor: paper.dashboardBlue,
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  ctaPressed: { opacity: 0.85 },
  ctaText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardCream,
    letterSpacing: 2.6,
  },
  ctaArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  footnote: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.dashboardMuted,
    textAlign: 'center',
  },

  // ── Nav pill ──────────────────────────────────────────────────────────────
  setupPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  setupPillText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardCream,
    letterSpacing: 1.6,
  },
});
