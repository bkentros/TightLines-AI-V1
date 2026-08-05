import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
  CornerMarkSet,
  PaperNavHeader,
  SectionEyebrow,
  TopographicLines,
} from '../../components/paper';
import { useAuthStore } from '../../store/authStore';
import { useDevTestingStore } from '../../store/devTestingStore';
import { IPHONE_LAYOUT_PREVIEW_PRESETS } from '../../lib/iphoneLayoutPreview';
import { getValidAccessToken, invokeEdgeFunction, supabase } from '../../lib/supabase';
import { clearOwnerFishCaches } from '../../lib/clearOwnerFishCaches';
import { resetFreeTierState } from '../../lib/resetFreeTierState';
import { hapticImpact, ImpactFeedbackStyle, hapticSelection } from '../../lib/safeHaptics';
import type { UserProfile } from '../../lib/types';
import { isAdminEmail } from '../../lib/adminAccess';
import {
  getAnalyticsDiagnostics,
  sendAnalyticsDiagnosticsPing,
} from '../../lib/analyticsDiagnostics';
import { getEffectiveTier } from '../../lib/subscription';
import { checkUsernameAvailability } from '../../lib/usernameAvailability';
import type { FeedbackTopic } from '../../lib/feedback';
import {
  openStoreSubscriptionManagement,
  storeSubscriptionManagementLabel,
} from '../../lib/legalLinks';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
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

type NoticeTone = 'info' | 'success' | 'error';

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, user, setProfile, signOut, fetchProfile } = useAuthStore();
  const {
    ignoreGps,
    homeLayoutPreviewWidth,
    load: loadDevTesting,
    setIgnoreGps,
    setHomeLayoutPreviewWidth,
  } = useDevTestingStore();

  const [homeState, setHomeState] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [usernameDraft, setUsernameDraft] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [creatorPortalAccess, setCreatorPortalAccess] = useState<{
    portalEligible: boolean;
    isAdmin: boolean;
    portalUrl: string | null;
    creatorName: string | null;
  } | null>(null);
  const [clearingCaches, setClearingCaches] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState<{
    title: string;
    message?: string;
    tone?: NoticeTone;
  } | null>(null);
  const canSeeTestingTools = isAdminEmail(user?.email);
  const effectiveTier = getEffectiveTier(profile, user?.email);
  const analyticsDiag = getAnalyticsDiagnostics();
  const [analyticsPingLoading, setAnalyticsPingLoading] = useState(false);
  const [resettingFreeTrials, setResettingFreeTrials] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setHomeState(profile.home_state ?? '');
    setHomeCity(profile.home_city ?? '');
    setUsernameDraft(profile.username ?? '');
  }, [profile?.id, profile?.username]);

  useEffect(() => {
    if (canSeeTestingTools) loadDevTesting();
  }, [canSeeTestingTools, loadDevTesting]);

  useEffect(() => {
    if (!user?.id) {
      setCreatorPortalAccess(null);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const accessToken = await getValidAccessToken();
        const result = await invokeEdgeFunction<{
          portal_eligible: boolean;
          is_admin: boolean;
          portal_url: string | null;
          creator_name: string | null;
        }>('creator-portal-access', {
          accessToken,
          body: {},
        });
        if (cancelled) return;
        setCreatorPortalAccess({
          portalEligible: Boolean(result.portal_eligible),
          isAdmin: Boolean(result.is_admin),
          portalUrl: result.portal_url,
          creatorName: result.creator_name,
        });
      } catch {
        if (!cancelled) setCreatorPortalAccess(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const buildHomeRegion = () => {
    if (homeCity.trim() && homeState) return `${homeCity.trim()}, ${homeState}`;
    if (homeState) return homeState;
    return '';
  };

  const autoFillLocation = async () => {
    setNotice(null);
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setNotice({
          title: 'Location permission needed',
          message: 'Allow location access to fill your state and city, or enter them manually.',
          tone: 'error',
        });
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
        const stateAbbr = STATE_NAME_TO_ABBR[geo.region ?? ''] ?? geo.region;
        if (stateAbbr && US_STATES.includes(stateAbbr)) setHomeState(stateAbbr);
        if (geo.city) setHomeCity(geo.city);
      }
    } catch {
      setNotice({
        title: 'Could not find your location',
        message: 'Please enter your home state and city manually.',
        tone: 'error',
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!user) return;
    setNotice(null);
    hapticImpact(ImpactFeedbackStyle.Medium);
    setSaving(true);
    try {
      const updates = {
        home_region: buildHomeRegion() || null,
        home_state: homeState || null,
        home_city: homeCity.trim() || null,
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
      setNotice({
        title: 'Location saved',
        message: 'Your home water location has been updated.',
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not save',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!user || !profile) return;

    const trimmedUsername = usernameDraft.trim().toLowerCase();
    if (trimmedUsername === profile.username) {
      setEditingUsername(false);
      return;
    }
    if (trimmedUsername.length < 3) {
      setNotice({
        title: 'Username too short',
        message: 'Use at least 3 characters.',
        tone: 'error',
      });
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      setNotice({
        title: 'Invalid username',
        message: 'Use letters, numbers, and underscores only.',
        tone: 'error',
      });
      return;
    }

    setNotice(null);
    hapticImpact(ImpactFeedbackStyle.Medium);
    setUsernameSaving(true);
    try {
      const availability = await checkUsernameAvailability(trimmedUsername, user.id);
      if (availability.status === 'taken') {
        setNotice({
          title: 'Username taken',
          message: 'Pick another handle and try again.',
          tone: 'error',
        });
        return;
      }
      if (availability.status === 'error') {
        setNotice({
          title: 'Could not verify username',
          message: 'Please try again in a moment.',
          tone: 'error',
        });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: trimmedUsername,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
      setEditingUsername(false);
      setNotice({
        title: 'Username saved',
        message: `Your handle is now @${trimmedUsername}.`,
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not save username',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
    } finally {
      setUsernameSaving(false);
    }
  };

  const handleClearCaches = async () => {
    setNotice(null);
    setClearingCaches(true);
    try {
      await clearOwnerFishCaches();
      setNotice({
        title: 'Caches cleared',
        message: 'Fresh fishing data will load the next time you open Home, Daily Read, or Tackle Box.',
        tone: 'success',
      });
    } catch {
      setNotice({
        title: 'Could not clear caches',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
    } finally {
      setClearingCaches(false);
    }
  };

  const handleResetFreeTierState = async (targetEmail?: string | null) => {
    if (!user?.id) return;
    setNotice(null);
    setResettingFreeTrials(true);
    try {
      const result = await resetFreeTierState(
        targetEmail?.trim() ? { targetEmail: targetEmail.trim() } : undefined,
      );
      if (!targetEmail?.trim() || targetEmail.trim().toLowerCase() === user.email?.toLowerCase()) {
        await fetchProfile(user.id);
      }
      setNotice({
        title: 'Free tier reset complete',
        message:
          `Server reset for ${result.targetEmail ?? user.email ?? 'this account'} (user ${result.targetUserId?.slice(0, 8) ?? 'unknown'}…). Cleared ${result.water_read_history_deleted} Water Read history row(s), ${result.recommender_sessions_deleted} Tackle Box session(s). Device caches cleared on this phone.${result.water_read_history_deleted === 0 && result.recommender_sessions_deleted === 0 && targetEmail?.trim() ? ' If you expected server rows to clear, double-check the email.' : ''}`,
        tone: 'success',
      });
    } catch (err) {
      setNotice({
        title: 'Reset failed',
        message: err instanceof Error ? err.message : 'Could not reset free tier state.',
        tone: 'error',
      });
    } finally {
      setResettingFreeTrials(false);
    }
  };

  const promptAdminFreeTierReset = () => {
    Alert.prompt(
      'Reset free tier state',
      'Enter the FREE test account email (required). Leaving blank only resets your admin account on the server — not other logins. Device caches always clear on this phone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: (value?: string) => {
            if (!value?.trim()) {
              setNotice({
                title: 'Enter the free account email',
                message:
                  'Blank reset only clears server state for your signed-in admin account. Type the free test email (e.g. the Gmail you use for free-tier smoke tests).',
                tone: 'error',
              });
              return;
            }
            void handleResetFreeTierState(value);
          },
        },
      ],
      'plain-text',
      '',
    );
  };

  const openSupportForm = (topic: FeedbackTopic) => {
    router.push({
      pathname: '/support',
      params: {
        topic,
        contextLines: JSON.stringify([
          `Tier: ${effectiveTier}`,
          `Home: ${buildHomeRegion() || 'not set'}`,
        ]),
      },
    });
  };

  const handleOpenStoreSubscriptions = async () => {
    setNotice(null);
    try {
      await openStoreSubscriptionManagement();
    } catch {
      setNotice({
        title: 'Could not open subscriptions',
        message: 'Open your App Store or Google Play account settings to manage or cancel your subscription.',
        tone: 'error',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setNotice(null);
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    try {
      const accessToken = await getValidAccessToken();
      await invokeEdgeFunction<{ ok: true }>('delete-account', {
        accessToken,
        body: {},
      });
      await signOut();
    } catch {
      setNotice({
        title: 'Could not delete account',
        message: 'Please try again in a moment.',
        tone: 'error',
      });
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (!profile) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeTop} edges={['top']} />
        <SafeAreaView style={styles.loadingSafe} edges={['bottom']}>
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={paper.dashboardBlue} />
            <Text style={styles.loadingText}>READING YOUR PROFILE...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <PaperNavHeader
          eyebrow="FINFINDR · YOUR ACCOUNT"
          eyebrowColor={paper.bandFair}
          title="SETTINGS"
          right={
            <View style={styles.headerTierPill}>
              <Ionicons
                name={effectiveTier === 'free' ? 'person-outline' : 'ribbon-outline'}
                size={11}
                color="#FFFFFF"
              />
              <Text style={styles.headerTierText}>
                {effectiveTier === 'free' ? 'FREE' : 'ANGLER'}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
      <SafeAreaView style={styles.safeBody} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <SettingsHero
              username={profile.username}
              homeRegion={buildHomeRegion() || 'Not set'}
              tier={effectiveTier}
            />

            {notice ? (
              <NoticeCard
                title={notice.title}
                message={notice.message}
                tone={notice.tone}
                onDismiss={() => setNotice(null)}
              />
            ) : null}

            <View style={styles.section}>
              <SettingsSectionHeading
                code="01"
                icon="person-outline"
                title="Account & membership"
                subtitle="Your identity and FinFindr access."
                color={paper.red}
              />
              <View style={styles.summaryList}>
                <SettingsSummaryRow
                  icon="mail-outline"
                  title="Email"
                  value={user?.email ?? 'Not available'}
                />
                <SettingsSummaryRow
                  icon="person-circle-outline"
                  title="Username"
                  value={`@${profile.username}`}
                  actionLabel="Edit"
                  onAction={() => {
                    setUsernameDraft(profile.username ?? '');
                    setEditingUsername(true);
                  }}
                />
                {editingUsername ? (
                  <View style={styles.usernameEditor}>
                    <TextInput
                      style={[styles.input, styles.usernameInput]}
                      value={usernameDraft}
                      onChangeText={setUsernameDraft}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder="username"
                      placeholderTextColor={paper.dashboardMuted}
                    />
                    <Pressable
                      style={({ pressed }) => [
                        styles.inlineButton,
                        pressed && styles.smallActionPressed,
                        usernameSaving && styles.btnDisabled,
                      ]}
                      onPress={handleSaveUsername}
                      disabled={usernameSaving}
                    >
                      {usernameSaving ? (
                        <ActivityIndicator size="small" color={paper.dashboardBlue} />
                      ) : (
                        <Text style={styles.inlineButtonText}>SAVE</Text>
                      )}
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.inlineButton,
                        styles.inlineButtonGhost,
                        pressed && styles.smallActionPressed,
                      ]}
                      onPress={() => {
                        setUsernameDraft(profile.username ?? '');
                        setEditingUsername(false);
                      }}
                      disabled={usernameSaving}
                    >
                      <Text style={styles.inlineButtonText}>CANCEL</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
              <MembershipSettingsCard
                tier={effectiveTier}
                onPress={() => router.push('/subscribe')}
              />
              {creatorPortalAccess?.portalEligible ? (
                <PrimaryAction
                  label={
                    creatorPortalAccess.isAdmin
                      ? 'Creator admin'
                      : 'Creator portal'
                  }
                  icon="stats-chart-outline"
                  onPress={() => {
                    const url = creatorPortalAccess.portalUrl ?? 'https://finfindr.app/creators/';
                    void Linking.openURL(url);
                  }}
                  variant="secondary"
                />
              ) : null}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionLabelRow}>
                <SettingsSectionHeading
                  code="02"
                  icon="navigate-outline"
                  title="Home water profile"
                  subtitle="The home base attached to your account."
                  color={paper.dashboardBlue}
                  compact
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.smallAction,
                    pressed && styles.smallActionPressed,
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
                  <Text style={styles.smallActionText}>
                    {locationLoading ? 'FINDING...' : 'USE LOCATION'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.sectionHint}>
                Saved to your profile for support and account context. The dashboard location picker controls the active report location.
              </Text>

              <View style={styles.locationFields}>
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

                <TextInput
                  style={styles.input}
                  value={homeCity}
                  onChangeText={setHomeCity}
                  placeholder="City (optional)"
                  placeholderTextColor={paper.dashboardInk + '70'}
                  autoCorrect={false}
                  maxLength={60}
                />
              </View>

              {showStateList && (
                <View style={styles.stateList}>
                  <ScrollView style={styles.stateScroll} nestedScrollEnabled>
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

              <PrimaryAction
                label="Save location"
                icon="checkmark"
                loading={saving}
                onPress={handleSaveLocation}
              />
            </View>

            <View style={styles.section}>
              <SettingsSectionHeading
                code="03"
                icon="chatbubble-ellipses-outline"
                title="Contact & feedback"
                subtitle="Reach the FinFindr team with account context attached."
                color={paper.bandPrime}
              />
              <View style={styles.contactList}>
                <ContactRow
                  icon="chatbubble-ellipses-outline"
                  title="Contact support"
                  subtitle="Account, app, or launch questions."
                  onPress={() => openSupportForm('general')}
                />
                <ContactRow
                  icon="bug-outline"
                  title="Report a bug"
                  subtitle="Broken screens, wrong reads, or weird behavior."
                  onPress={() => openSupportForm('bug')}
                />
                <ContactRow
                  icon="bulb-outline"
                  title="Suggest a feature"
                  subtitle="Coverage, workflow, or fishing-read ideas."
                  onPress={() => openSupportForm('feature')}
                />
              </View>
            </View>

            <View style={styles.section}>
              <SettingsSectionHeading
                code="04"
                icon="shield-checkmark-outline"
                title="Legal & safety"
                subtitle="The boundaries that protect your account and time on the water."
                color="#68757E"
              />
              <View style={styles.contactList}>
                <ContactRow
                  icon="document-text-outline"
                  title="Terms of Service"
                  subtitle="Account, subscription, and usage terms."
                  onPress={() => router.push('/legal/terms')}
                />
                <ContactRow
                  icon="shield-checkmark-outline"
                  title="Privacy Policy"
                  subtitle="Data, permissions, purchases, and deletion."
                  onPress={() => router.push('/legal/privacy')}
                />
                <ContactRow
                  icon="warning-outline"
                  title="Safety Notice"
                  subtitle="Fishing recommendations are informational."
                  onPress={() => router.push('/legal/safety')}
                />
                <ContactRow
                  icon="chatbubble-ellipses-outline"
                  title="Support"
                  subtitle="Contact FinFindr support from the app."
                  onPress={() => openSupportForm('general')}
                />
              </View>
            </View>

            {canSeeTestingTools ? (
              <View style={styles.section}>
                <SettingsSectionHeading
                  code="05"
                  icon="phone-portrait-outline"
                  title="Device storage"
                  subtitle="Private testing controls for this phone."
                  color={paper.dashboardBlue}
                />
                <Text style={styles.sectionHint}>
                  Clears saved Daily Read, forecast, live conditions, and Tackle Box data on this device.
                </Text>
                <PrimaryAction
                  label="Clear cache"
                  icon="trash-outline"
                  loading={clearingCaches}
                  onPress={handleClearCaches}
                  variant="secondary"
                />
              </View>
            ) : null}

            {canSeeTestingTools && (
              <View style={styles.section}>
                <SettingsSectionHeading
                  code="06"
                  icon="construct-outline"
                  title="Admin tools"
                  subtitle="Internal diagnostics and release checks."
                  color={paper.bandFair}
                />
                <Text style={styles.sectionHint}>
                  Analytics: {analyticsDiag.statusLabel}
                </Text>
                <PrimaryAction
                  label="Send analytics test event"
                  icon="pulse-outline"
                  loading={analyticsPingLoading}
                  onPress={async () => {
                    setAnalyticsPingLoading(true);
                    try {
                      const result = await sendAnalyticsDiagnosticsPing(user?.id);
                      setNotice({
                        title: result.ok ? 'Analytics ping sent' : 'Analytics ping failed',
                        message: result.message,
                        tone: result.ok ? 'success' : 'error',
                      });
                    } finally {
                      setAnalyticsPingLoading(false);
                    }
                  }}
                  variant="secondary"
                />
                <PrimaryAction
                  label="Module icon preview"
                  icon="color-palette-outline"
                  onPress={() => router.push('/module-icons-preview')}
                  variant="secondary"
                />
                <PrimaryAction
                  label="Reset free tier state (server + device)"
                  icon="refresh-outline"
                  loading={resettingFreeTrials}
                  onPress={promptAdminFreeTierReset}
                  variant="secondary"
                />
                <View style={styles.testingRow}>
                  <Text style={styles.testingLabel}>Ignore GPS</Text>
                  <Switch
                    value={ignoreGps}
                    onValueChange={(v) => setIgnoreGps(v)}
                    trackColor={{ false: paper.dashboardHair, true: paper.dashboardBlue }}
                    thumbColor={paper.dashboardWhite}
                  />
                </View>
                <Text style={[styles.sectionHint, { marginTop: 14 }]}>
                  Scaled layout preview (approximate). Tap Off before judging the real
                  App Store layout on your phone.
                </Text>
                <View style={styles.presetRow}>
                  {IPHONE_LAYOUT_PREVIEW_PRESETS.map((preset) => {
                    const active = homeLayoutPreviewWidth === preset.width;
                    return (
                      <Pressable
                        key={preset.id}
                        onPress={() => setHomeLayoutPreviewWidth(preset.width)}
                        style={({ pressed }) => [
                          styles.presetBtn,
                          active && styles.presetBtnActive,
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.presetBtnText,
                            active && styles.presetBtnTextActive,
                          ]}
                        >
                          {preset.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            <PrimaryAction
              label="Sign out"
              icon="log-out-outline"
              onPress={() => signOut()}
              variant="secondary"
            />

            <View style={styles.dangerSection}>
              <Text style={styles.dangerTitle}>DELETE ACCOUNT</Text>
              <Text style={styles.dangerCopy}>
                Permanently removes your FinFindr account. This cannot be undone. Deleting your
                FinFindr account does not cancel App Store billing, so cancel any active
                auto-renewing subscription from your store account first. If you delete this
                account while Angler is active, Restore Purchases may not reconnect that
                subscription to a new or recreated FinFindr account.
              </Text>
              {confirmDelete ? (
                <View style={styles.deleteWarning}>
                  <View style={styles.deleteWarningHeader}>
                    <Ionicons name="warning-outline" size={15} color={paper.bandTough} />
                    <Text style={styles.deleteWarningTitle}>FINAL CHECK</Text>
                  </View>
                  <Text style={styles.deleteWarningCopy}>
                    Tap Delete account forever to permanently delete your FinFindr account and
                    sign out. Store subscriptions must still be canceled from your App Store or
                    Google Play account. Active Angler access is tied to this FinFindr account, so
                    a newly created account may not be able to restore it.
                  </Text>
                </View>
              ) : null}
              <PrimaryAction
                label={storeSubscriptionManagementLabel()}
                icon="open-outline"
                onPress={handleOpenStoreSubscriptions}
                variant="secondary"
              />
              <PrimaryAction
                label={confirmDelete ? 'Delete account forever' : 'Delete account'}
                icon="trash-outline"
                loading={deleting}
                onPress={handleDeleteAccount}
                variant="danger"
              />
              {confirmDelete ? (
                <Pressable
                  style={styles.cancelDelete}
                  onPress={() => {
                    setConfirmDelete(false);
                    setNotice(null);
                  }}
                >
                  <Text style={styles.cancelDeleteText}>CANCEL DELETE</Text>
                </Pressable>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function SettingsHero({
  username,
  homeRegion,
  tier,
}: {
  username: string;
  homeRegion: string;
  tier: string;
}) {
  const tierLabel = tier === 'free' ? 'Free' : 'Angler';
  return (
    <View style={styles.settingsHero}>
      <TopographicLines
        style={StyleSheet.absoluteFill}
        color={paper.dashboardBlue}
        count={7}
      />
      <CornerMarkSet color={paper.red} size={15} thickness={2} inset={11} />
      <View style={styles.settingsHeroIcon}>
        <Ionicons name="settings-outline" size={21} color="#FFFFFF" />
      </View>
      <SectionEyebrow color={paper.redDk} size={9} tracking={2.1}>
        YOUR FINFINDR
      </SectionEyebrow>
      <Text style={styles.settingsHeroTitle} allowFontScaling={false}>
        BUILT AROUND{`\n`}
        <Text style={styles.settingsHeroAccent}>YOUR WATER.</Text>
      </Text>
      <Text style={styles.settingsHeroBody}>
        Keep your account, home base, membership, and support details in one
        dependable place.
      </Text>
      <View style={styles.settingsHeroMeta}>
        <SettingsHeroMeta label="ANGLER" value={`@${username}`} />
        <View style={styles.settingsHeroRule} />
        <SettingsHeroMeta label="HOME" value={homeRegion} />
        <View style={styles.settingsHeroRule} />
        <SettingsHeroMeta label="ACCESS" value={tierLabel} />
      </View>
    </View>
  );
}

function SettingsHeroMeta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingsHeroMetaItem}>
      <Text style={styles.settingsHeroMetaLabel}>{label}</Text>
      <Text style={styles.settingsHeroMetaValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function SettingsSectionHeading({
  code,
  icon,
  title,
  subtitle,
  color,
  compact = false,
}: {
  code: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.sectionHeading, compact && styles.sectionHeadingCompact]}>
      <View style={[styles.sectionHeadingIcon, { backgroundColor: `${color}16`, borderColor: `${color}38` }]}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <View style={styles.sectionHeadingCopy}>
        <Text style={[styles.sectionHeadingCode, { color }]}>
          {code} · ACCOUNT FIELD NOTE
        </Text>
        <Text style={styles.sectionHeadingTitle}>{title}</Text>
        {!compact ? (
          <Text style={styles.sectionHeadingSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

function MembershipSettingsCard({
  tier,
  onPress,
}: {
  tier: string;
  onPress: () => void;
}) {
  const active = tier !== 'free';
  return (
    <Pressable
      style={({ pressed }) => [
        styles.membershipCard,
        pressed && styles.membershipCardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Manage membership"
    >
      <TopographicLines
        style={StyleSheet.absoluteFill}
        color={paper.dashboardBlueLight}
        count={5}
      />
      <View style={styles.membershipCardIcon}>
        <Ionicons
          name={active ? 'ribbon' : 'ribbon-outline'}
          size={18}
          color={paper.bandFair}
        />
      </View>
      <View style={styles.membershipCardCopy}>
        <Text style={styles.membershipCardEyebrow}>
          {active ? 'ANGLER · ACTIVE' : 'ANGLER MEMBERSHIP'}
        </Text>
        <Text style={styles.membershipCardTitle}>Manage membership</Text>
        <Text style={styles.membershipCardBody} numberOfLines={2}>
          {active
            ? 'Review included features, restore purchases, or manage billing.'
            : 'See the fishing intelligence included with Angler.'}
        </Text>
      </View>
      <View style={styles.membershipCardArrow}>
        <Ionicons name="arrow-forward" size={15} color={paper.dashboardInk} />
      </View>
    </Pressable>
  );
}

function ContactRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.contactRow, pressed && styles.contactRowPressed]}
      onPress={onPress}
    >
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={16} color={paper.dashboardBlue} />
      </View>
      <View style={styles.contactCopy}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={15} color={paper.dashboardMuted} />
    </Pressable>
  );
}

function SettingsSummaryRow({
  icon,
  title,
  value,
  detail,
  actionLabel,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>
        <Ionicons name={icon} size={16} color={paper.dashboardBlue} />
      </View>
      <View style={styles.summaryCopy}>
        <Text style={styles.summaryTitle}>{title}</Text>
        {detail ? <Text style={styles.summaryDetail}>{detail}</Text> : null}
      </View>
      <View style={styles.summaryTrailing}>
        <Text style={styles.summaryValue} numberOfLines={1}>{value}</Text>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={styles.summaryAction}>{actionLabel.toUpperCase()}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function NoticeCard({
  title,
  message,
  tone = 'info',
  onDismiss,
}: {
  title: string;
  message?: string;
  tone?: NoticeTone;
  onDismiss: () => void;
}) {
  const color =
    tone === 'success' ? paper.bandPrime
    : tone === 'error' ? paper.bandTough
    : paper.dashboardBlue;
  return (
    <View style={[styles.notice, { borderColor: color }]}>
      <View style={styles.noticeHeader}>
        <Ionicons
          name={tone === 'success' ? 'checkmark-circle-outline' : tone === 'error' ? 'alert-circle-outline' : 'information-circle-outline'}
          size={18}
          color={color}
        />
        <Text style={styles.noticeTitle}>{title}</Text>
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={16} color={paper.dashboardInk} />
        </Pressable>
      </View>
      {message ? <Text style={styles.noticeMessage}>{message}</Text> : null}
    </View>
  );
}

function PrimaryAction({
  label,
  icon,
  loading,
  onPress,
  variant = 'primary',
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionBtn,
        variant === 'secondary' && styles.actionBtnSecondary,
        variant === 'danger' && styles.actionBtnDanger,
        pressed && !loading && styles.actionBtnPressed,
        loading && styles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? paper.dashboardInk : '#FFFFFF'} />
      ) : (
        <>
          <Ionicons
            name={icon}
            size={16}
            color={variant === 'secondary' ? paper.dashboardInk : '#FFFFFF'}
          />
          <Text
            style={[
              styles.actionBtnText,
              variant === 'secondary' && styles.actionBtnTextSecondary,
            ]}
          >
            {label.toUpperCase()}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: paper.dashboardInk },
  safeTop: { backgroundColor: paper.dashboardInk },
  safeBody: { flex: 1, backgroundColor: paper.dashboardCream },
  loadingSafe: { flex: 1, backgroundColor: paper.dashboardCream },
  headerTierPill: {
    minWidth: 62,
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerTierText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  kav: { flex: 1, backgroundColor: paper.dashboardCream },
  scroll: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xxl,
    gap: paperSpacing.md,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardCream,
  },
  loadingText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 2.2,
    color: paper.dashboardInk,
    opacity: 0.6,
  },
  settingsHero: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.2)',
    borderRadius: paperRadius.card,
    backgroundColor: '#EAF3F7',
    ...paperShadows.hard,
  },
  settingsHeroIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 21,
    backgroundColor: paper.dashboardInk,
  },
  settingsHeroTitle: {
    marginTop: 9,
    fontFamily: paperFonts.display,
    fontSize: 30,
    lineHeight: 33,
    textAlign: 'center',
    color: paper.dashboardInk,
  },
  settingsHeroAccent: {
    color: paper.red,
  },
  settingsHeroBody: {
    maxWidth: 380,
    marginTop: 9,
    marginBottom: 18,
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: paper.dashboardMuted,
  },
  settingsHeroMeta: {
    width: '100%',
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: 1,
    borderTopColor: 'rgba(42,110,150,0.18)',
  },
  settingsHeroMetaItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 5,
  },
  settingsHeroRule: {
    width: 1,
    backgroundColor: 'rgba(42,110,150,0.18)',
  },
  settingsHeroMetaLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: paper.dashboardBlue,
  },
  settingsHeroMetaValue: {
    maxWidth: '100%',
    fontFamily: paperFonts.bodyBold,
    fontSize: 10.5,
    color: paper.dashboardInk,
  },
  section: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: paper.dashboardWhite,
    borderRadius: paperRadius.card,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: 14,
    gap: 10,
    ...paperShadows.hard,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  sectionHeading: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 2,
  },
  sectionHeadingCompact: {
    paddingBottom: 0,
  },
  sectionHeadingIcon: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 18,
  },
  sectionHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  sectionHeadingCode: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    lineHeight: 10,
    letterSpacing: 1.1,
  },
  sectionHeadingTitle: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  sectionHeadingSubtitle: {
    marginTop: 1,
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: paper.dashboardMuted,
  },
  sectionHint: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.68,
    lineHeight: 18,
  },
  summaryList: {
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    overflow: 'hidden',
  },
  membershipCard: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(231,193,88,0.42)',
    borderRadius: 10,
    backgroundColor: paper.dashboardInk,
  },
  membershipCardPressed: {
    backgroundColor: '#132C46',
    opacity: 0.94,
  },
  membershipCardIcon: {
    width: 38,
    height: 38,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231,193,88,0.35)',
    borderRadius: 19,
    backgroundColor: 'rgba(231,193,88,0.1)',
  },
  membershipCardCopy: {
    flex: 1,
    minWidth: 0,
  },
  membershipCardEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: paper.bandFair,
  },
  membershipCardTitle: {
    marginTop: 2,
    fontFamily: paperFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 21,
    color: '#FFFFFF',
  },
  membershipCardBody: {
    marginTop: 3,
    fontFamily: paperFonts.body,
    fontSize: 10.5,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.68)',
  },
  membershipCardArrow: {
    width: 30,
    height: 30,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  summaryRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: '#F8FAFC',
  },
  summaryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    color: paper.dashboardInk,
  },
  summaryDetail: {
    marginTop: 1,
    fontFamily: paperFonts.displayItalic,
    fontSize: 11.5,
    color: paper.dashboardInk,
    opacity: 0.6,
  },
  summaryValue: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12.5,
    color: paper.dashboardInk,
    textAlign: 'right',
  },
  summaryTrailing: {
    maxWidth: '52%',
    alignItems: 'flex-end',
    gap: 3,
  },
  summaryAction: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 1.2,
  },
  usernameEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: paper.dashboardLine,
    backgroundColor: paper.dashboardWhite,
  },
  usernameInput: {
    minHeight: 42,
  },
  inlineButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: paperSpacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardWhite,
  },
  inlineButtonGhost: {
    borderColor: paper.dashboardLine,
  },
  inlineButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 1.3,
  },
  readOnlyValue: {
    fontFamily: paperFonts.body,
    fontSize: 16,
    color: paper.dashboardInk,
    backgroundColor: '#F6F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md - 2,
    textTransform: 'capitalize',
  },
  input: {
    flex: 1,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm,
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  smallAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: paper.dashboardBlue,
    backgroundColor: paper.dashboardWhite,
  },
  smallActionPressed: { backgroundColor: '#F6F9FB' },
  smallActionText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 1.6,
  },
  statePicker: {
    width: 104,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm,
  },
  statePickerText: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
  },
  locationFields: {
    flexDirection: 'row',
    gap: paperSpacing.xs + 2,
    alignItems: 'center',
  },
  statePickerPlaceholder: { opacity: 0.55 },
  stateList: {
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
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardInk,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 10,
    paddingVertical: paperSpacing.sm + 2,
    marginTop: paperSpacing.xs,
  },
  actionBtnSecondary: {
    backgroundColor: paper.dashboardWhite,
    borderColor: paper.dashboardLine,
  },
  actionBtnDanger: {
    backgroundColor: paper.bandTough,
    borderColor: paper.bandTough,
  },
  actionBtnPressed: { opacity: 0.85 },
  actionBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2.2,
  },
  actionBtnTextSecondary: {
    color: paper.dashboardInk,
  },
  btnDisabled: { opacity: 0.5 },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs + 2,
  },
  presetBtn: {
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.xs + 1,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  presetBtnActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  presetBtnText: {
    fontFamily: paperFonts.bodyMedium,
    fontSize: 12,
    color: paper.dashboardInk,
    textTransform: 'capitalize',
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
    fontFamily: paperFonts.bodyBold,
  },
  testingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testingLabel: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.82,
  },
  contactList: {
    gap: paperSpacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 10,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.xs + 4,
  },
  contactRowPressed: { backgroundColor: '#F6F9FB' },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F9FB',
    borderWidth: 1,
    borderColor: paper.dashboardLine,
  },
  contactCopy: {
    flex: 1,
    minWidth: 0,
  },
  contactTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13.5,
    color: paper.dashboardInk,
  },
  contactSubtitle: {
    marginTop: 2,
    fontFamily: paperFonts.displayItalic,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.66,
  },
  notice: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: paperSpacing.md,
    gap: paperSpacing.xs,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs + 2,
  },
  noticeTitle: {
    flex: 1,
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
  },
  noticeMessage: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.75,
    lineHeight: 18,
  },
  dangerSection: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: paperSpacing.sm + 2,
    gap: paperSpacing.sm,
  },
  dangerTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.bandTough,
    letterSpacing: 2.2,
  },
  dangerCopy: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 18,
  },
  deleteWarning: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${paper.bandTough}66`,
    backgroundColor: '#FFF6F3',
    paddingHorizontal: paperSpacing.sm,
    paddingVertical: paperSpacing.sm,
    gap: paperSpacing.xs,
  },
  deleteWarningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.xs,
  },
  deleteWarningTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.bandTough,
    letterSpacing: 1.8,
  },
  deleteWarningCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    lineHeight: 18,
    opacity: 0.78,
  },
  cancelDelete: {
    alignItems: 'center',
    paddingVertical: paperSpacing.sm,
  },
  cancelDeleteText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
});
