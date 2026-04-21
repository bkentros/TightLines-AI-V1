/**
 * Settings — FinFindr paper language.
 *
 * Visual migration only. All logic (profile load, Supabase update, location
 * autofill, species chips, units toggle, owner-only cache clear, dev-only
 * overrides, sign-out) is identical to the previous screen.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../../lib/theme';
import { useAuthStore } from '../../store/authStore';
import { useDevTestingStore } from '../../store/devTestingStore';
import type { FishingMode, UserProfile } from '../../lib/types';
import { supabase } from '../../lib/supabase';
import { clearOwnerFishCaches } from '../../lib/clearOwnerFishCaches';
import { PaperBackground, SectionEyebrow } from '../../components/paper';

/** Accounts that see owner-only cache tools in Settings (production + dev). */
const CACHE_OWNER_EMAILS = ['brandonkentros@icloud.com'];

function isCacheOwnerEmail(email: string | undefined | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const n = email.trim().toLowerCase();
  return CACHE_OWNER_EMAILS.some((e) => e.toLowerCase() === n);
}

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

const FISHING_MODES: { value: FishingMode; label: string; icon: string }[] = [
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

export default function SettingsScreen() {
  const { profile, user, setProfile, signOut } = useAuthStore();
  const {
    ignoreGps,
    overrideSubscriptionTier,
    load: loadDevTesting,
    setIgnoreGps,
    setOverrideSubscriptionTier,
  } = useDevTestingStore();

  const [displayName, setDisplayName] = useState('');
  const [fishingMode, setFishingMode] = useState<FishingMode>('both');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [showStateList, setShowStateList] = useState(false);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [locationLoading, setLocationLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clearingCaches, setClearingCaches] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? '');
    setFishingMode(profile.fishing_mode ?? 'both');
    setSelectedSpecies(profile.target_species ?? []);
    setHomeState(profile.home_state ?? '');
    setHomeCity(profile.home_city ?? '');
    setUnits((profile.preferred_units ?? 'imperial') as 'imperial' | 'metric');
  }, [profile?.id]);

  useEffect(() => {
    if (__DEV__) loadDevTesting();
  }, [loadDevTesting]);

  const toggleSpecies = (species: string) => {
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
          'Allow location access to auto-fill your home region, or enter it manually below.',
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo) {
        const stateAbbr = STATE_NAME_TO_ABBR[geo.region ?? ''] ?? geo.region;
        if (stateAbbr && US_STATES.includes(stateAbbr)) setHomeState(stateAbbr);
        if (geo.city) setHomeCity(geo.city);
      }
    } catch {
      Alert.alert('Could not get location', 'Please enter your home region manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updates = {
        display_name: displayName.trim() || null,
        fishing_mode: fishingMode,
        target_species: selectedSpecies,
        home_region: buildHomeRegion() || null,
        home_state: homeState || null,
        home_city: homeCity.trim() || null,
        preferred_units: units,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
      Alert.alert('Saved', 'Your preferences have been updated.');
    } catch (err) {
      console.error(err);
      Alert.alert('Could not save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
      ],
    );
  };

  if (!profile) {
    return (
      <PaperBackground>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={paper.forest} />
          </View>
        </SafeAreaView>
      </PaperBackground>
    );
  }

  return (
    <PaperBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.eyebrowRow}>
              <SectionEyebrow dashes size={11} color={paper.red}>
                FINFINDR · PREFERENCES
              </SectionEyebrow>
            </View>
            <Text style={styles.title}>Settings.</Text>
            <Text style={styles.subtitle}>
              Edit your preferences. These personalize your AI recommendations.
            </Text>

            {/* Username (read-only) */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>USERNAME</Text>
              <Text style={styles.readOnlyValue}>@{profile.username}</Text>
              <Text style={styles.sectionHint}>
                Public — visible on your profile and catch feed. Cannot be changed here.
              </Text>
            </View>

            {/* Display Name */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>DISPLAY NAME</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="e.g. Brandon K."
                placeholderTextColor={paper.ink + '70'}
                autoCorrect={false}
                maxLength={50}
              />
            </View>

            {/* Fishing Mode */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>FISHING MODE</Text>
              <View style={styles.modeRow}>
                {FISHING_MODES.map((mode) => {
                  const active = fishingMode === mode.value;
                  return (
                    <Pressable
                      key={mode.value}
                      style={[styles.modeBtn, active && styles.modeBtnActive]}
                      onPress={() => setFishingMode(mode.value)}
                    >
                      <Ionicons
                        name={mode.icon as any}
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
            </View>

            {/* Target Species */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>FAVORITE TARGET SPECIES</Text>
              <View style={styles.chipGrid}>
                {SPECIES_LIST.map((species) => {
                  const active = selectedSpecies.includes(species);
                  return (
                    <Pressable
                      key={species}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => toggleSpecies(species)}
                    >
                      <Text
                        style={[styles.chipText, active && styles.chipTextActive]}
                      >
                        {species}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Home Region */}
            <View style={styles.section}>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>HOME REGION</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.locationAutoBtn,
                    pressed && styles.locationAutoBtnPressed,
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
                  <Text style={styles.locationAutoBtnText}>
                    {locationLoading ? 'DETECTING…' : 'USE MY LOCATION'}
                  </Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.statePicker}
                onPress={() => setShowStateList((v) => !v)}
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
                maxLength={60}
              />
            </View>

            {/* Units */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PREFERRED UNITS</Text>
              <View style={styles.modeRow}>
                {(['imperial', 'metric'] as const).map((u) => {
                  const active = units === u;
                  return (
                    <Pressable
                      key={u}
                      style={[styles.modeBtn, active && styles.modeBtnActive]}
                      onPress={() => setUnits(u)}
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
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btn,
                pressed && styles.btnPressed,
                saving && styles.btnDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={paper.paper} />
              ) : (
                <>
                  <Text style={styles.btnText}>SAVE PREFERENCES</Text>
                  <Ionicons name="checkmark" size={16} color={paper.paper} />
                </>
              )}
            </Pressable>

            {/* Owner-only: clear on-device fish caches */}
            {isCacheOwnerEmail(user?.email) && (
              <View style={styles.ownerSection}>
                <Text style={styles.ownerSectionTitle}>DEVELOPER</Text>
                <Text style={styles.ownerSectionHint}>
                  Clear saved How&apos;s Fishing reports (today and forecast days), 7-day outlook chips,
                  and the live conditions cache. Open Home or How&apos;s Fishing again to regenerate.
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.ownerClearBtn,
                    pressed && styles.ownerClearBtnPressed,
                    clearingCaches && styles.btnDisabled,
                  ]}
                  onPress={() => {
                    if (clearingCaches) return;
                    Alert.alert(
                      'Clear local caches?',
                      "Removes this device's cached reports and outlook data. You'll fetch fresh data the next time you load Home or generate a report.",
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Clear caches',
                          style: 'destructive',
                          onPress: async () => {
                            setClearingCaches(true);
                            try {
                              await clearOwnerFishCaches();
                              Alert.alert(
                                'Caches cleared',
                                'Go to Home or How\'s Fishing to load new data.',
                              );
                            } catch {
                              Alert.alert('Could not clear', 'Try again in a moment.');
                            } finally {
                              setClearingCaches(false);
                            }
                          },
                        },
                      ],
                    );
                  }}
                  disabled={clearingCaches}
                >
                  {clearingCaches ? (
                    <ActivityIndicator color={paper.paper} size="small" />
                  ) : (
                    <>
                      <Ionicons name="trash-outline" size={16} color={paper.paper} />
                      <Text style={styles.ownerClearBtnText}>
                        CLEAR FISH REPORT CACHES
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}

            {/* Dev-only: subscription tier + ignore GPS */}
            {__DEV__ && (
              <View style={styles.testingSection}>
                <Text style={styles.testingTitle}>TESTING (DEV BUILD)</Text>
                <Text style={styles.testingHint}>
                  Subscription tier override and GPS simulation. Set your pin on the Home screen.
                </Text>

                <Text style={styles.testingLabel}>Override subscription tier</Text>
                <View style={styles.presetRow}>
                  {(['free', 'angler', 'master_angler', null] as const).map((t) => {
                    const label =
                      t === null
                        ? 'Use real'
                        : t === 'angler'
                          ? 'Angler'
                          : t === 'master_angler'
                            ? 'Master'
                            : t;
                    const isActive = overrideSubscriptionTier === t;
                    return (
                      <Pressable
                        key={String(label)}
                        style={[
                          styles.presetBtn,
                          isActive && styles.presetBtnActive,
                        ]}
                        onPress={() => setOverrideSubscriptionTier(t)}
                      >
                        <Text
                          style={[
                            styles.presetBtnText,
                            isActive && styles.presetBtnTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {overrideSubscriptionTier != null && (
                  <Text style={styles.currentOverride}>
                    Using tier: {overrideSubscriptionTier}
                  </Text>
                )}

                <View style={[styles.testingRow, { marginTop: paperSpacing.md }]}>
                  <Text style={styles.testingLabel}>
                    Ignore GPS (simulate no location)
                  </Text>
                  <Switch
                    value={ignoreGps}
                    onValueChange={(v) => setIgnoreGps(v)}
                    trackColor={{ false: paper.inkHair, true: paper.forest }}
                    thumbColor={ignoreGps ? paper.paperLight : paper.paper}
                  />
                </View>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.signOutBtn,
                pressed && styles.signOutBtnPressed,
              ]}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={16} color={paper.ink} />
              <Text style={styles.signOutText}>SIGN OUT</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: {
    paddingHorizontal: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  eyebrowRow: {
    paddingTop: paperSpacing.sm,
    marginBottom: paperSpacing.md,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.ink,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: paperSpacing.xs,
  },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.ink,
    opacity: 0.7,
    marginBottom: paperSpacing.xl,
    lineHeight: 20,
  },

  section: { marginBottom: paperSpacing.xl },
  sectionLabel: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.ink,
    letterSpacing: 2,
    marginBottom: paperSpacing.xs + 2,
  },
  sectionHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.ink,
    opacity: 0.65,
    marginTop: paperSpacing.xs,
  },
  readOnlyValue: {
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.ink,
    opacity: 0.75,
    backgroundColor: paper.paperDark,
    borderRadius: paperRadius.card,
    borderWidth: 1.5,
    borderColor: paper.ink,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
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
  chipActive: {
    backgroundColor: paper.forest,
  },
  chipText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    color: paper.ink,
  },
  chipTextActive: {
    color: paper.paper,
    fontFamily: paperFonts.bodyBold,
  },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: paperSpacing.xs + 2,
  },
  locationAutoBtn: {
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
  locationAutoBtnPressed: { backgroundColor: paper.paperDark },
  locationAutoBtnText: {
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
  statePickerPlaceholder: { color: paper.ink, opacity: 0.5 },
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

  btn: {
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
  btnPressed: { backgroundColor: paper.forestDk },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.paper,
    letterSpacing: 2.4,
  },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    marginTop: paperSpacing.xl,
    paddingVertical: paperSpacing.md,
    borderTopWidth: 1,
    borderTopColor: paper.inkHair,
  },
  signOutBtnPressed: { opacity: 0.6 },
  signOutText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.4,
  },

  ownerSection: {
    marginTop: paperSpacing.xl,
    paddingTop: paperSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: paper.inkHair,
  },
  ownerSectionTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.4,
    marginBottom: paperSpacing.xs,
  },
  ownerSectionHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.65,
    marginBottom: paperSpacing.md,
    lineHeight: 18,
  },
  ownerClearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.red,
    borderWidth: 2,
    borderColor: paper.ink,
    borderRadius: paperRadius.card,
    paddingVertical: paperSpacing.md,
    ...paperShadows.hard,
  },
  ownerClearBtnPressed: { opacity: 0.85 },
  ownerClearBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.paper,
    letterSpacing: 2,
  },

  testingSection: {
    marginTop: paperSpacing.xl,
    paddingTop: paperSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: paper.inkHair,
  },
  testingTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.ink,
    letterSpacing: 2.4,
    marginBottom: paperSpacing.xs,
  },
  testingHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.ink,
    opacity: 0.65,
    marginBottom: paperSpacing.md,
    lineHeight: 18,
  },
  testingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: paperSpacing.md,
  },
  testingLabel: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.ink,
    opacity: 0.8,
    marginBottom: paperSpacing.xs,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs + 2,
    marginBottom: paperSpacing.sm,
  },
  presetBtn: {
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.xs + 1,
    borderRadius: paperRadius.chip,
    backgroundColor: paper.paperLight,
    borderWidth: 1.5,
    borderColor: paper.ink,
  },
  presetBtnActive: {
    backgroundColor: paper.ink,
  },
  presetBtnText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    color: paper.ink,
  },
  presetBtnTextActive: {
    color: paper.paper,
    fontFamily: paperFonts.bodyBold,
  },
  currentOverride: {
    fontFamily: paperFonts.mono,
    fontSize: 11,
    color: paper.ink,
    opacity: 0.65,
    marginTop: paperSpacing.xs,
  },
});
