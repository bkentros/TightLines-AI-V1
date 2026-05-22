import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperNavHeader, TopographicLines } from '../components/paper';
import {
  paper,
  paperFonts,
  paperRadius,
  paperShadows,
  paperSpacing,
} from '../lib/theme';

type IconName = keyof typeof Ionicons.glyphMap;

type FeatureSection = {
  code: string;
  title: string;
  kicker: string;
  icon: IconName;
  color: string;
  tint: string;
  summary: string;
  inputs: string[];
  outputs: string[];
  note?: string;
};

const DATA_SIGNALS: { label: string; detail: string; icon: IconName }[] = [
  { label: 'Place', detail: 'area, region, timezone', icon: 'location-outline' },
  { label: 'Season', detail: 'month and local timing', icon: 'calendar-outline' },
  { label: 'Water', detail: 'lake, river, coast, flats', icon: 'water-outline' },
  { label: 'Weather', detail: 'temperature, wind, rain, sky', icon: 'partly-sunny-outline' },
  { label: 'Movement', detail: 'pressure, flow, tide/current', icon: 'pulse-outline' },
  { label: 'Light', detail: 'sun, clouds, low-light edges', icon: 'sunny-outline' },
  { label: 'Timing', detail: 'daypart opportunities', icon: 'time-outline' },
  { label: 'Coverage', detail: 'available data and confidence', icon: 'shield-checkmark-outline' },
];

const FEATURE_SECTIONS: FeatureSection[] = [
  {
    code: '01',
    title: "Today's Bite",
    kicker: 'Condition read',
    icon: 'analytics-outline',
    color: paper.bandPrime,
    tint: '#E8F4DF',
    summary:
      "Today’s Bite turns local conditions into a practical fishing read for the water type you choose.",
    inputs: [
      'your area, season, and selected water type',
      'temperature, pressure, wind, sky, and precipitation patterns',
      'river movement or coastal tide/current context when relevant',
      'light, sun timing, solunar context, and fresh forecast updates',
    ],
    outputs: [
      'score, band, and plain-language daily summary',
      'helping conditions and limiting conditions',
      'best timing windows for the day',
      'practical field strategy and confidence context',
    ],
    note:
      'The score is deterministic. It is guidance from weighted conditions, not a guarantee that fish will bite.',
  },
  {
    code: '02',
    title: '6-Day Forecast',
    kicker: 'Forward read',
    icon: 'calendar-number-outline',
    color: paper.bandFair,
    tint: '#FAF1CF',
    summary:
      'The forecast reuses the same condition engine on future daily snapshots so the outlook stays consistent with Today’s Bite.',
    inputs: [
      'upcoming weather and seasonal context',
      'the same water-type logic behind Today’s Bite',
      'fresh location-aware forecast updates',
    ],
    outputs: [
      'six forward bite scores for Angler members',
      'tomorrow preview score for the free tier',
      'future report entry points for planning ahead',
    ],
    note:
      'Forecast days can move as weather updates. The app treats them as planning signals, not fixed outcomes.',
  },
  {
    code: '03',
    title: 'Tackle Box',
    kicker: 'Daily picks',
    icon: 'fish-outline',
    color: '#C99B2D',
    tint: '#FBF1D9',
    summary:
      'Tackle Box starts with the same day-read, then adds species and setup choices to recommend a focused lure-and-fly plan.',
    inputs: [
      'target species, region, season, and water type',
      'water clarity and your goal for the day',
      'the current condition read from Today’s Bite',
      'curated lure and fly options filtered for fit',
    ],
    outputs: [
      'lure of the day plus honorable lure',
      'fly of the day plus honorable fly',
      'why each pick fits the day',
      'how to fish each pick',
      'one daily Changeup angle when you want a second look',
    ],
    note:
      'The recommender avoids random grab-bag picks. It filters first, then scores and selects from condition-matched options.',
  },
  {
    code: '04',
    title: 'Water Read',
    kicker: 'Structure map',
    icon: 'map-outline',
    color: paper.dashboardBlue,
    tint: '#E8F2FA',
    summary:
      'Water Read studies supported lake shapes and turns polygon geometry into a conservative structure map.',
    inputs: [
      'supported lake outline geometry',
      'shoreline shape and major structure forms',
      'season context for map notes',
      'quality checks that keep uncertain reads conservative',
    ],
    outputs: [
      'stylized lake outline',
      'numbered structured fishing zones',
      'season-aware map key',
      'support status for limited or unavailable waters',
    ],
    note:
      'Water Read does not use photos, depth charts, species, weather, your live position, or exact fishing coordinates in this version.',
  },
];

const GUARDRAILS = [
  'FinFindr is informational fishing guidance only.',
  'Coverage varies by location, water type, and available data.',
  'Always check local regulations, access rules, weather, water levels, and safety conditions before fishing.',
];

export default function HowItWorksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <PaperNavHeader
          eyebrow="FINFINDR · TRANSPARENCY"
          eyebrowColor={paper.dashboardBlueLight}
          title="HOW IT READS"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlueLight}
              count={6}
            />
            <View style={styles.heroTopRow}>
              <View style={styles.heroSignalPill}>
                <View style={styles.liveDot} />
                <Text style={styles.heroSignalText}>ENGINE NOTES</Text>
              </View>
              <Text style={styles.heroEdition}>MAY · 2026</Text>
            </View>
            <Text style={styles.heroTitle}>
              How FinFindr reads{'\n'}
              <Text style={styles.heroTitleAccent}>a fishing day.</Text>
            </Text>
            <Text style={styles.heroBody}>
              FinFindr does not promise fish. It weighs the signals that shape a day,
              explains what helped or hurt the read, and turns that into practical
              planning guidance without exposing the private formulas behind it.
            </Text>
            <View style={styles.heroFooter}>
              <SignalMini label="Weighted" icon="scale-outline" />
              <SignalMini label="Local" icon="navigate-outline" />
              <SignalMini label="Explainable" icon="list-outline" />
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>DATA LAYER</Text>
            <Text style={styles.sectionTitle}>The signals underneath the read.</Text>
            <Text style={styles.sectionIntro}>
              The app pulls together environmental context first, then each feature
              uses the categories that apply to its job. This page explains the
              approach, not the exact recipe.
            </Text>
          </View>

          <View style={styles.signalGrid}>
            {DATA_SIGNALS.map((signal) => (
              <View key={signal.label} style={styles.signalCard}>
                <View style={styles.signalIcon}>
                  <Ionicons name={signal.icon} size={15} color={paper.dashboardBlue} />
                </View>
                <Text style={styles.signalLabel}>{signal.label}</Text>
                <Text style={styles.signalDetail}>{signal.detail}</Text>
              </View>
            ))}
          </View>

          <View style={styles.flowCard}>
            <View style={styles.flowNode}>
              <Text style={styles.flowNodeLabel}>01</Text>
              <Text style={styles.flowNodeTitle}>Collect</Text>
            </View>
            <View style={styles.flowLine} />
            <View style={styles.flowNode}>
              <Text style={styles.flowNodeLabel}>02</Text>
              <Text style={styles.flowNodeTitle}>Weight</Text>
            </View>
            <View style={styles.flowLine} />
            <View style={styles.flowNode}>
              <Text style={styles.flowNodeLabel}>03</Text>
              <Text style={styles.flowNodeTitle}>Explain</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>FEATURES</Text>
            <Text style={styles.sectionTitle}>What each module considers.</Text>
          </View>

          {FEATURE_SECTIONS.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}

          <View style={styles.guardrailCard}>
            <View style={styles.guardrailTitleRow}>
              <View style={styles.guardrailIcon}>
                <Ionicons name="shield-checkmark-outline" size={17} color="#FFFFFF" />
              </View>
              <View style={styles.guardrailTitleText}>
                <Text style={styles.guardrailEyebrow}>BOUNDARIES</Text>
                <Text style={styles.guardrailTitle}>What this is, and is not.</Text>
              </View>
            </View>
            {GUARDRAILS.map((item) => (
              <View key={item} style={styles.guardrailRow}>
                <Ionicons name="checkmark-circle" size={15} color={paper.bandPrime} />
                <Text style={styles.guardrailText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.footerStamp}>FINFINDR · TRANSPARENCY READ</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function SignalMini({ label, icon }: { label: string; icon: IconName }) {
  return (
    <View style={styles.signalMini}>
      <Ionicons name={icon} size={12} color={paper.dashboardBlue} />
      <Text style={styles.signalMiniText}>{label}</Text>
    </View>
  );
}

function FeatureCard({ feature }: { feature: FeatureSection }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureTop}>
        <View style={[styles.featureCode, { borderColor: feature.color }]}>
          <Text style={[styles.featureCodeText, { color: feature.color }]}>
            {feature.code}
          </Text>
        </View>
        <View style={[styles.featureIcon, { backgroundColor: feature.tint }]}>
          <Ionicons name={feature.icon} size={20} color={feature.color} />
        </View>
        <View style={styles.featureTitleBlock}>
          <Text style={styles.featureKicker}>{feature.kicker}</Text>
          <Text style={styles.featureTitle}>{feature.title}</Text>
        </View>
      </View>

      <Text style={styles.featureSummary}>{feature.summary}</Text>

      <View style={styles.detailBlock}>
        <Text style={styles.detailLabel}>What it considers</Text>
        {feature.inputs.map((input) => (
          <DetailRow key={input} text={input} toneColor={feature.color} />
        ))}
      </View>

      <View style={styles.detailBlock}>
        <Text style={styles.detailLabel}>What it returns</Text>
        {feature.outputs.map((output) => (
          <DetailRow key={output} text={output} toneColor={paper.dashboardBlue} />
        ))}
      </View>

      {feature.note ? (
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={15} color={paper.dashboardBlue} />
          <Text style={styles.noteText}>{feature.note}</Text>
        </View>
      ) : null}
    </View>
  );
}

function DetailRow({ text, toneColor }: { text: string; toneColor: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailDot, { backgroundColor: toneColor }]} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: paper.dashboardInk,
  },
  screen: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },
  scroll: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
  },
  scrollContent: {
    paddingHorizontal: paperSpacing.lg,
    paddingTop: paperSpacing.lg,
    paddingBottom: paperSpacing.xxl,
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E4F1F7',
    borderRadius: paperRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.18)',
    padding: paperSpacing.lg,
    marginBottom: paperSpacing.section,
    ...paperShadows.lift,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: paperSpacing.md,
  },
  heroSignalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.64)',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.18)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: paper.bandPrime,
  },
  heroSignalText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: paper.dashboardInk,
  },
  heroEdition: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 2,
    color: 'rgba(10,27,46,0.48)',
  },
  heroTitle: {
    fontFamily: paperFonts.display,
    fontSize: 39,
    lineHeight: 42,
    color: paper.dashboardInk,
    letterSpacing: 0,
    marginBottom: paperSpacing.md,
  },
  heroTitleAccent: {
    color: paper.dashboardBlueLight,
  },
  heroBody: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 17,
    lineHeight: 27,
    color: 'rgba(10,27,46,0.70)',
    letterSpacing: 0,
    marginBottom: paperSpacing.lg,
  },
  heroFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  signalMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.18)',
  },
  signalMiniText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 11,
    color: paper.dashboardInk,
  },
  sectionHeader: {
    marginBottom: paperSpacing.md,
  },
  sectionEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 2.3,
    color: paper.dashboardBlue,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: paperFonts.display,
    fontSize: 27,
    lineHeight: 31,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  sectionIntro: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(10,27,46,0.72)',
    marginTop: 9,
  },
  signalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: paperSpacing.lg,
  },
  signalCard: {
    width: '48.5%',
    minHeight: 118,
    backgroundColor: paper.dashboardWhite,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: 13,
  },
  signalIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(42,110,150,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signalLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    letterSpacing: 1.8,
    color: paper.dashboardInk,
    marginBottom: 5,
  },
  signalDetail: {
    fontFamily: paperFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(10,27,46,0.68)',
  },
  flowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF7',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: 12,
    marginBottom: paperSpacing.section,
  },
  flowNode: {
    flex: 1,
    alignItems: 'center',
  },
  flowNodeLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: paper.dashboardBlue,
    marginBottom: 3,
  },
  flowNodeTitle: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 13,
    color: paper.dashboardInk,
  },
  flowLine: {
    width: 22,
    height: 1,
    backgroundColor: 'rgba(10,27,46,0.18)',
  },
  featureCard: {
    backgroundColor: paper.dashboardWhite,
    borderRadius: paperRadius.card,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    padding: paperSpacing.lg,
    marginBottom: paperSpacing.lg,
    ...paperShadows.hard,
  },
  featureTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: paperSpacing.md,
  },
  featureCode: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureCodeText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTitleBlock: {
    flex: 1,
  },
  featureKicker: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: paper.dashboardBlue,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  featureTitle: {
    fontFamily: paperFonts.display,
    fontSize: 23,
    color: paper.dashboardInk,
    letterSpacing: 0,
  },
  featureSummary: {
    fontFamily: paperFonts.displayItalic,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(10,27,46,0.72)',
    marginBottom: paperSpacing.lg,
  },
  detailBlock: {
    marginBottom: paperSpacing.md,
  },
  detailLabel: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9.5,
    letterSpacing: 2,
    color: paper.dashboardInk,
    marginBottom: 9,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 8,
  },
  detailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  detailText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(10,27,46,0.76)',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(42,110,150,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.16)',
  },
  noteText: {
    flex: 1,
    fontFamily: paperFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(10,27,46,0.72)',
  },
  guardrailCard: {
    backgroundColor: paper.dashboardInk,
    borderRadius: paperRadius.card,
    padding: paperSpacing.lg,
    marginTop: paperSpacing.sm,
    marginBottom: paperSpacing.lg,
    overflow: 'hidden',
  },
  guardrailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: paperSpacing.md,
  },
  guardrailIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginRight: 12,
  },
  guardrailTitleText: {
    flex: 1,
  },
  guardrailEyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: paper.dashboardBlueLight,
    marginBottom: 3,
  },
  guardrailTitle: {
    fontFamily: paperFonts.display,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  guardrailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 9,
  },
  guardrailText: {
    flex: 1,
    fontFamily: paperFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.78)',
  },
  footerStamp: {
    textAlign: 'center',
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 2.4,
    color: 'rgba(10,27,46,0.34)',
    marginTop: paperSpacing.md,
  },
});
