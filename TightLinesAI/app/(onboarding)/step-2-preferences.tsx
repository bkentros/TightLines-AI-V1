/**
 * Onboarding Step 2 — Preferences.
 *
 * Visual migration into the FinFindr paper system. Behavior is unchanged
 * from the prior implementation:
 *   • Username uniqueness check (debounced, 400ms) against `profiles`.
 *   • Display-name suggestion from Apple/email metadata on mount.
 *   • Fishing-mode toggle, target-species multi-select, units toggle.
 *   • Location auto-fill via `expo-location` + reverse geocode → state +
 *     city, with the same alerts on permission denial / failure.
 *   • Final validation guards (length, charset, taken-username, missing
 *     home state) and final pre-commit username re-check.
 *   • `setOnboardingPrefs(...)` then push to `/(onboarding)/step-3-location`.
 *
 * Visual structure mirrors step 1: paper nav header (BACK + STEP 2/3),
 * editorial eyebrow, big Fraunces title, italic subhead, and a sequence
 * of "section" blocks (eyebrow label + paper inputs/chip pills/picker).
 * The same submit-CTA chrome is used as the Welcome screen.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
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
import { hapticImpact, ImpactFeedbackStyle, hapticSelection } from '../../lib/safeHaptics';
import { useAuthStore } from '../../store/authStore';
import type { FishingMode } from '../../lib/types';
import { supabase } from '../../lib/supabase';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const SPECIES_LIST = [
  'Bass',
  'Trout',
  'Salmon',
  'Redfish (Red Drum)',
  'Snook',
  'Tarpon',
  'Walleye',
  'Pike / Muskie',
  'Tuna',
  'Mahi-Mahi',
];

const FISHING_MODES: { value: FishingMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'conventional', label: 'Conventional', icon: 'fish-outline' },
  { value: 'fly', label: 'Fly Fishing', icon: 'leaf-outline' },
  { value: 'both', label: 'Both', icon: 'options-outline' },
];

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
  const { setOnboardingPrefs, user } = useAuthStore();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fishingMode, setFishingMode] = useState<FishingMode>('both');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showStateList, setShowStateList] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [locationLoading, setLocationLoading] = useState(false);

  // Pre-fill a username suggestion from the Apple/email display name.
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
        checkUsernameValue(suggested);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkUsernameValue = useCallback(async (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmed)
        .maybeSingle();
      setUsernameAvailable(data === null);
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameAvailable(null);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      checkUsernameValue(value);
    }, 400);
  };

  const toggleSpecies = (species: string) => {
    hapticSelection();
    setSelectedSpecies((prev) =>
      prev.includes(species)
        ? prev.filter((s) => s !== species)
        : [...prev, species],
    );
  };

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
          'Allow location access to fill in your home water region, or enter it manually below.',
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
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
      Alert.alert('Could not find your location', 'Please enter your home water region manually.');
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
      Alert.alert('Invalid username', 'Username may only contain letters, numbers, and underscores.');
      return;
    }
    if (usernameAvailable === false) {
      Alert.alert('Username taken', 'Please choose a different username.');
      return;
    }
    if (!homeState) {
      Alert.alert('Home state required', 'Please select your home state.');
      return;
    }

    hapticImpact(ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      if (!user) throw new Error('No authenticated user');
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (existing) {
        Alert.alert('Username taken', 'Please choose a different username.');
        return;
      }

      setOnboardingPrefs({
        username: trimmedUsername,
        display_name: displayName.trim(),
        fishing_mode: fishingMode,
        target_species: selectedSpecies,
        home_region: buildHomeRegion(),
        home_state: homeState,
        home_city: homeCity.trim(),
        preferred_units: units,
      });

      router.push('/(onboarding)/step-3-location');
    } catch (err) {
      Alert.alert('Something went wrong', 'Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const usernameStatus = (() => {
    const trimmed = username.trim();
    if (trimmed.length < 3) return null;
    if (checkingUsername) return 'checking';
    if (usernameAvailable === true) return 'available';
    if (usernameAvailable === false) return 'taken';
    return null;
  })();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PaperBackground style={styles.flex}>
        <PaperNavHeader
          eyebrow="FINFINDR · ONBOARDING"
          title="PREFERENCES"
          onBack={() => router.back()}
          right={<StepPill step={2} total={3} />}
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
              <SectionEyebrow dashes size={11} color={paper.red}>
                A FEW QUESTIONS
              </SectionEyebrow>
            </View>

            <Text style={styles.heroTitle}>Your preferences.</Text>
            <Text style={styles.heroLede}>
              These basics help shape your first fishing read.
            </Text>

            {/* Username */}
            <Section label="USERNAME" hint="Public on your profile.">
              <View style={styles.usernameRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.usernameInput,
                    usernameStatus === 'taken' && styles.inputError,
                    usernameStatus === 'available' && styles.inputSuccess,
                  ]}
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="e.g. redfish_brandon"
                  placeholderTextColor={paper.ink + '70'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={30}
                />
                <View style={styles.usernameStatusSlot}>
                  {usernameStatus === 'checking' && (
                    <ActivityIndicator size="small" color={paper.forest} />
                  )}
                  {usernameStatus === 'available' && (
                    <Ionicons name="checkmark-circle" size={20} color={paper.forest} />
                  )}
                  {usernameStatus === 'taken' && (
                    <Ionicons name="close-circle" size={20} color={paper.red} />
                  )}
                </View>
              </View>
              {usernameStatus === 'taken' && (
                <Text style={styles.errorText}>Username is already taken.</Text>
              )}
              {usernameStatus === 'available' && (
                <Text style={styles.successText}>Username is available!</Text>
              )}
            </Section>

            {/* Display name */}
            <Section label="DISPLAY NAME" hint="Optional — what people see in feeds.">
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="e.g. Brandon K."
                placeholderTextColor={paper.ink + '70'}
                autoCorrect={false}
                returnKeyType="next"
                maxLength={50}
              />
            </Section>

            {/* Fishing mode */}
            <Section label="PREFERRED GEAR">
              <View style={styles.modeRow}>
                {FISHING_MODES.map((mode) => {
                  const active = fishingMode === mode.value;
                  return (
                    <Pressable
                      key={mode.value}
                      style={[styles.modeBtn, active && styles.modeBtnActive]}
                      onPress={() => {
                        hapticSelection();
                        setFishingMode(mode.value);
                      }}
                    >
                      <Ionicons
                        name={mode.icon}
                        size={15}
                        color={active ? paper.paper : paper.ink}
                      />
                      <Text
                        style={[
                          styles.modeBtnText,
                          active && styles.modeBtnTextActive,
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            {/* Target species */}
            <Section
              label="FAVORITE SPECIES"
              hint="Helps tailor your first tackle picks. Skip if you fish everything."
            >
              <View style={styles.chipGrid}>
                {SPECIES_LIST.map((species) => {
                  const active = selectedSpecies.includes(species);
                  return (
                    <Pressable
                      key={species}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleSpecies(species)}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {species}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            {/* Home region */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>HOME WATER REGION</Text>
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
                    <ActivityIndicator size="small" color={paper.forest} />
                  ) : (
                    <Ionicons name="location-outline" size={13} color={paper.forest} />
                  )}
                  <Text style={styles.locAutoBtnText}>
                    {locationLoading ? 'FINDING…' : 'USE LOCATION'}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.statePicker}
                onPress={() => {
                  hapticSelection();
                  setShowStateList((v) => !v);
                }}
              >
                <Text
                  style={[
                    styles.statePickerText,
                    !homeState && styles.statePickerPlaceholder,
                  ]}
                >
                  {homeState || 'Select your state'}
                </Text>
                <Ionicons
                  name={showStateList ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={paper.ink}
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
                        style={[
                          styles.stateOption,
                          homeState === state && styles.stateOptionActive,
                        ]}
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
                placeholder="City (e.g. Tampa)"
                placeholderTextColor={paper.ink + '70'}
                autoCorrect={false}
                returnKeyType="done"
                maxLength={60}
              />
            </View>

            {/* Units */}
            <Section label="PREFERRED UNITS">
              <View style={styles.modeRow}>
                {(['imperial', 'metric'] as const).map((u) => {
                  const active = units === u;
                  return (
                    <Pressable
                      key={u}
                      style={[styles.modeBtn, active && styles.modeBtnActive]}
                      onPress={() => {
                        hapticSelection();
                        setUnits(u);
                      }}
                    >
                      <Text
                        style={[
                          styles.modeBtnText,
                          active && styles.modeBtnTextActive,
                        ]}
                      >
                        {u === 'imperial'
                          ? 'Imperial (lbs, in, °F)'
                          : 'Metric (kg, cm, °C)'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>

            {/* CTA */}
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
                <ActivityIndicator color={paper.paper} />
              ) : (
                <>
                  <Text style={styles.ctaText}>CONTINUE</Text>
                  <Ionicons name="arrow-forward" size={16} color={paper.paper} />
                </>
              )}
            </Pressable>

            <Text style={styles.footnote}>
              — STEP 2 OF 3 ·  ONE MORE TO GO —
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </PaperBackground>
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
  safe: { flex: 1, backgroundColor: paper.paper },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  eyebrowRow: { marginBottom: paperSpacing.md },

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
    color: paper.ink,
    letterSpacing: 2.2,
    marginBottom: paperSpacing.xs,
    fontWeight: '700',
  },
  sectionHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.65,
    marginBottom: paperSpacing.sm,
  },

  input: {
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.ink,
  },
  inputError: { borderColor: paper.red },
  inputSuccess: { borderColor: paper.forest },

  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: paperSpacing.sm },
  usernameInput: { flex: 1 },
  usernameStatusSlot: { width: 26, alignItems: 'center' },
  errorText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.red,
    marginTop: paperSpacing.xs,
    letterSpacing: 0.4,
  },
  successText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11.5,
    color: paper.forest,
    marginTop: paperSpacing.xs,
    letterSpacing: 0.4,
  },

  modeRow: { flexDirection: 'row', gap: paperSpacing.sm },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.xs + 2,
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.md - 2,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  modeBtnActive: {
    backgroundColor: paper.ink,
  },
  modeBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 1.4,
  },
  modeBtnTextActive: { color: paper.paper },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: paperSpacing.xs + 2 },
  chip: {
    paddingHorizontal: paperSpacing.md - 2,
    paddingVertical: paperSpacing.sm - 1,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  chipActive: { backgroundColor: paper.forest },
  chipText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    color: paper.ink,
  },
  chipTextActive: {
    color: paper.paper,
    fontFamily: paperFonts.bodyBold,
  },

  locAutoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: 4,
    borderRadius: paperRadius.chip,
    borderWidth: 1.5,
    borderColor: paper.forest,
    backgroundColor: paper.paperLight,
  },
  locAutoBtnPressed: { backgroundColor: paper.paperDark },
  locAutoBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.forest,
    letterSpacing: 1.6,
  },

  statePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: paper.paperLight,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
  },
  statePickerText: {
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.ink,
  },
  statePickerPlaceholder: { color: paper.ink, opacity: 0.55 },
  stateList: {
    marginTop: paperSpacing.xs,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    backgroundColor: paper.paperLight,
    overflow: 'hidden',
  },
  stateScroll: { maxHeight: 200 },
  stateOption: {
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 4,
  },
  stateOptionActive: { backgroundColor: paper.paperDark },
  stateOptionText: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.ink,
  },
  stateOptionTextActive: {
    color: paper.forest,
    fontFamily: paperFonts.bodyBold,
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
    marginTop: paperSpacing.sm,
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
