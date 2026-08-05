import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CornerMarkSet, PaperNavHeader, TopographicLines } from '../components/paper';
import { paper, paperFonts, paperRadius, paperShadows, paperSpacing } from '../lib/theme';
import { useAuthStore } from '../store/authStore';
import { submitFeedback } from '../lib/feedback';
import type { FeedbackSentiment, FeedbackTopic } from '../lib/feedback';

const TOPIC_OPTIONS: { topic: FeedbackTopic; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { topic: 'general', label: 'Support', icon: 'chatbubble-ellipses-outline' },
  { topic: 'bug', label: 'Bug', icon: 'bug-outline' },
  { topic: 'feature', label: 'Idea', icon: 'bulb-outline' },
  { topic: 'subscription', label: 'Billing', icon: 'card-outline' },
];

const VALID_TOPICS: FeedbackTopic[] = [
  'general',
  'bug',
  'feature',
  'subscription',
  'todays_bite',
  'tackle_box',
  'water_read',
  'smart_log',
];

const TOPIC_TITLE: Record<FeedbackTopic, string> = {
  general: 'Contact support',
  bug: 'Report a bug',
  feature: 'Suggest a feature',
  subscription: 'Subscription help',
  todays_bite: "Today's Bite feedback",
  tackle_box: 'Tackle Box feedback',
  water_read: 'Water Read feedback',
  smart_log: 'Smart Log feedback',
};

function parseTopic(value: string | string[] | undefined): FeedbackTopic {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && VALID_TOPICS.includes(raw as FeedbackTopic) ? raw as FeedbackTopic : 'general';
}

function parseSentiment(value: string | string[] | undefined): FeedbackSentiment | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'looks_right' || raw === 'needs_work' || raw === 'note' ? raw : null;
}

function parseContextLines(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line): line is string => typeof line === 'string' && line.trim().length > 0);
  } catch {
    return [];
  }
}

export default function SupportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    topic?: string;
    featureName?: string;
    sentiment?: string;
    contextLines?: string;
    requestMode?: string;
  }>();
  const { profile, user } = useAuthStore();
  const [topic, setTopic] = useState<FeedbackTopic>(() => parseTopic(params.topic));
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ title: string; message?: string; tone: 'success' | 'error' } | null>(null);

  const featureName = typeof params.featureName === 'string' ? params.featureName : null;
  const requestMode = params.requestMode === 'true';
  const sentiment = parseSentiment(params.sentiment);
  const contextLines = useMemo(() => parseContextLines(params.contextLines), [params.contextLines]);
  const title = requestMode
    ? 'Request coverage'
    : featureName
      ? `${featureName} feedback`
      : TOPIC_TITLE[topic];
  const canSubmit = message.trim().length >= 8 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const result = await submitFeedback({
        topic,
        message: message.trim(),
        sentiment,
        featureName,
        contextLines,
      });
      setMessage('');
      setNotice({
        title: requestMode ? 'Request sent' : 'Sent',
        message: result.email_sent
          ? requestMode
            ? 'Thanks. Your coverage request was emailed to FinFindr with your account and app context.'
            : 'Thanks. Your note was emailed to FinFindr support with your account and app context.'
          : requestMode
            ? 'Thanks. Your coverage request is saved with your account and app context. Email delivery will be checked from the support queue.'
            : 'Thanks. Your note is saved with your account and app context. Email delivery will be checked from the support queue.',
        tone: 'success',
      });
    } catch (err) {
      setNotice({
        title: 'Could not send',
        message: err instanceof Error
          ? err.message
          : 'Please check your connection and try again.',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.screen}>
        <PaperNavHeader
          eyebrow={requestMode ? 'FINFINDR · COVERAGE' : 'FINFINDR · SUPPORT'}
          eyebrowColor={paper.dashboardBlueLight}
          title={requestMode ? 'REQUEST' : 'CONTACT'}
          onBack={() => router.back()}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <TopographicLines
                style={StyleSheet.absoluteFill}
                color={paper.dashboardBlue}
                count={4}
              />
              <CornerMarkSet color={requestMode ? paper.red : paper.dashboardBlue} size={11} thickness={1.2} inset={8} />
              <View style={styles.heroHeadingRow}>
                <View style={[styles.heroIcon, requestMode && styles.heroIconRequest]}>
                  <Ionicons
                    name={requestMode ? 'map-outline' : 'chatbubble-ellipses-outline'}
                    size={17}
                    color={requestMode ? paper.redDk : paper.dashboardBlue}
                  />
                </View>
                <Text style={[styles.eyebrow, requestMode && styles.eyebrowRequest]}>
                  {requestMode ? 'EXPANSION DESK' : 'SUPPORT DESK'}
                </Text>
              </View>
              <Text style={styles.title}>{title}.</Text>
              <Text style={styles.subtitle}>
                {requestMode
                  ? 'Tell us which river, species, state, or season you want FinFindr to add next.'
                  : 'Send the useful details. Your account and app context are attached automatically.'}
              </Text>
            </View>

            {notice ? (
              <View style={[styles.notice, notice.tone === 'error' && styles.noticeError]}>
                <Ionicons
                  name={notice.tone === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                  size={18}
                  color={notice.tone === 'success' ? paper.bandPrime : paper.bandTough}
                />
                <View style={styles.noticeCopy}>
                  <Text style={styles.noticeTitle}>{notice.title}</Text>
                  {notice.message ? <Text style={styles.noticeMessage}>{notice.message}</Text> : null}
                </View>
              </View>
            ) : null}

            {!featureName ? (
              <View style={styles.topicGrid}>
                {TOPIC_OPTIONS.map((option) => {
                  const active = option.topic === topic;
                  return (
                    <Pressable
                      key={option.topic}
                      style={({ pressed }) => [
                        styles.topicChip,
                        active && styles.topicChipActive,
                        pressed && styles.topicChipPressed,
                      ]}
                      onPress={() => setTopic(option.topic)}
                    >
                      <Ionicons
                        name={option.icon}
                        size={15}
                        color={active ? '#FFFFFF' : paper.dashboardInk}
                      />
                      <Text style={[styles.topicChipText, active && styles.topicChipTextActive]}>
                        {option.label.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <View style={styles.formCard}>
              <View style={styles.composerHeader}>
                <View style={[styles.composerRule, requestMode && styles.composerRuleRequest]} />
                <View style={styles.composerHeading}>
                  <Ionicons
                    name={requestMode ? 'navigate-outline' : 'create-outline'}
                    size={15}
                    color={requestMode ? paper.redDk : paper.dashboardBlue}
                  />
                  <Text style={[styles.fieldLabel, requestMode && styles.fieldLabelRequest]}>
                    {requestMode ? 'YOUR REQUEST' : 'YOUR MESSAGE'}
                  </Text>
                </View>
                <Text style={styles.composerHint}>
                  {requestMode ? 'Name the water or coverage you want.' : 'A few clear details help us respond faster.'}
                </Text>
              </View>
              <TextInput
                value={message}
                onChangeText={setMessage}
                style={styles.messageInput}
                placeholder="Type your message here."
                placeholderTextColor="rgba(10,27,46,0.42)"
                multiline
                textAlignVertical="top"
                maxLength={4000}
              />
              <View style={styles.formFooter}>
                <Text style={styles.countText}>{message.length}/4000</Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.submitBtn,
                    !canSubmit && styles.submitBtnDisabled,
                    pressed && canSubmit && styles.submitBtnPressed,
                  ]}
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.submitBtnText}>{requestMode ? 'SEND REQUEST' : 'SEND'}</Text>
                      <Ionicons name="send" size={13} color="#FFFFFF" />
                    </>
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.contextCard}>
              <View style={styles.contextHeadingRow}>
                <View style={styles.contextIcon}>
                  <Ionicons name="shield-checkmark-outline" size={14} color={paper.dashboardBlue} />
                </View>
                <View style={styles.contextHeadingCopy}>
                  <Text style={styles.contextTitle}>ATTACHED AUTOMATICALLY</Text>
                  <Text style={styles.contextSubtitle}>So you do not have to repeat the basics.</Text>
                </View>
              </View>
              <ContextLine label="Email" value={user?.email ?? 'Signed-in account'} />
              <ContextLine label="Username" value={profile?.username ? `@${profile.username}` : 'Not set'} />
              <ContextLine label="Tier" value={profile?.subscription_tier ?? 'Unknown'} />
              <ContextLine label="Home" value={profile?.home_region ?? 'Not set'} />
              <ContextLine label="Device" value={Platform.OS} />
              {featureName ? <ContextLine label="Feature" value={featureName} /> : null}
              {sentiment ? <ContextLine label="Signal" value={sentiment.replace('_', ' ')} /> : null}
              {contextLines.map((line) => (
                <Text key={line} style={styles.contextFreeLine} numberOfLines={2}>
                  {line}
                </Text>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function ContextLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.contextLine}>
      <Text style={styles.contextLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.contextValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: paper.dashboardInk },
  screen: { flex: 1, backgroundColor: paper.dashboardCream },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.md,
    paddingBottom: paperSpacing.xxl,
    gap: paperSpacing.md,
  },
  hero: {
    ...paperShadows.hard,
    position: 'relative',
    backgroundColor: '#F2F7FA',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.24)',
    borderRadius: paperRadius.card,
    paddingHorizontal: paperSpacing.md + 2,
    paddingVertical: paperSpacing.lg,
    overflow: 'hidden',
    gap: paperSpacing.xs,
  },
  heroHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    marginBottom: 2,
  },
  heroIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F0F7',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.24)',
  },
  heroIconRequest: {
    backgroundColor: '#FBE9E4',
    borderColor: 'rgba(155,40,34,0.20)',
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  eyebrowRequest: { color: paper.redDk },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 34,
    color: paper.dashboardInk,
    letterSpacing: 0,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 14,
    color: paper.dashboardInk,
    lineHeight: 20,
    opacity: 0.72,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.bandPrime,
    borderRadius: 12,
    padding: paperSpacing.md,
  },
  noticeError: { borderColor: paper.bandTough },
  noticeCopy: { flex: 1, minWidth: 0 },
  noticeTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
  },
  noticeMessage: {
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 18,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: paperSpacing.xs,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 999,
    backgroundColor: paper.dashboardWhite,
    paddingHorizontal: paperSpacing.sm + 2,
    paddingVertical: paperSpacing.sm,
  },
  topicChipActive: {
    backgroundColor: paper.dashboardInk,
    borderColor: paper.dashboardInk,
  },
  topicChipPressed: { opacity: 0.85 },
  topicChipText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: paper.dashboardInk,
    letterSpacing: 1.4,
  },
  topicChipTextActive: { color: '#FFFFFF' },
  formCard: {
    ...paperShadows.hard,
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    gap: paperSpacing.sm,
    overflow: 'hidden',
  },
  composerHeader: {
    gap: 3,
    marginBottom: 2,
  },
  composerRule: {
    position: 'absolute',
    left: -paperSpacing.md,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: paper.dashboardBlue,
  },
  composerRuleRequest: { backgroundColor: paper.red },
  composerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  composerHint: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: paper.dashboardMuted,
  },
  fieldLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  fieldLabelRequest: { color: paper.redDk },
  messageInput: {
    minHeight: 170,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    backgroundColor: '#F7F8F6',
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.md,
    fontFamily: paperFonts.body,
    fontSize: 15,
    color: paper.dashboardInk,
    lineHeight: 21,
  },
  formFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.sm,
  },
  countText: {
    fontFamily: paperFonts.metaMono,
    fontSize: 10,
    color: paper.dashboardMuted,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paperSpacing.xs,
    minWidth: 104,
    borderRadius: 12,
    backgroundColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm + 2,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnPressed: { opacity: 0.85 },
  submitBtnText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  contextCard: {
    backgroundColor: '#EEF5F8',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.18)',
    borderRadius: paperRadius.card,
    padding: paperSpacing.md,
    gap: paperSpacing.xs,
  },
  contextHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    paddingBottom: paperSpacing.sm,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,110,150,0.14)',
  },
  contextIcon: {
    width: 29,
    height: 29,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.18)',
  },
  contextHeadingCopy: { flex: 1, minWidth: 0 },
  contextTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  contextSubtitle: {
    marginTop: 2,
    fontFamily: paperFonts.body,
    fontSize: 11.5,
    color: paper.dashboardMuted,
  },
  contextLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paperSpacing.md,
  },
  contextLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    color: paper.dashboardMuted,
    letterSpacing: 1.4,
  },
  contextValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: paperFonts.bodyBold,
    fontSize: 12.5,
    color: paper.dashboardInk,
    textTransform: 'capitalize',
  },
  contextFreeLine: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    color: paper.dashboardInk,
    opacity: 0.72,
    lineHeight: 17,
  },
});
