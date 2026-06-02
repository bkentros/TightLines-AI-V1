import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PaperNavHeader, TopographicLines } from '../paper';
import { paper, paperFonts, paperSpacing } from '../../lib/theme';
import type { LegalDocument } from '../../lib/legalDocuments';
import { openExternalUrl } from '../../lib/legalLinks';

export function LegalDocumentScreen({ document }: { document: LegalDocument }) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openWebVersion = async () => {
    if (!document.externalUrl) return;
    setOpening(true);
    setError(null);
    try {
      await openExternalUrl(document.externalUrl);
    } catch {
      setError('Could not open the web version on this device.');
    } finally {
      setOpening(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.flex}>
        <PaperNavHeader
          eyebrow={document.eyebrow}
          eyebrowColor={paper.dashboardBlueLight}
          title={document.navTitle}
          onBack={() => router.back()}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <TopographicLines
              style={StyleSheet.absoluteFill}
              color={paper.dashboardBlue}
              count={5}
            />
            <Text style={styles.eyebrow}>UPDATED {document.updated.toUpperCase()}</Text>
            <Text style={styles.title}>{document.title}</Text>
            <Text style={styles.subtitle}>{document.subtitle}</Text>
          </View>

          {document.sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
              {section.body.map((paragraph) => (
                <Text key={paragraph} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}

          {document.externalUrl ? (
            <View style={styles.webCard}>
              <View style={styles.webCopy}>
                <Text style={styles.webTitle}>WEB VERSION</Text>
                <Text style={styles.webUrl} numberOfLines={1}>
                  {document.externalUrl}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.webButton,
                  pressed && styles.webButtonPressed,
                  opening && styles.webButtonDisabled,
                ]}
                onPress={openWebVersion}
                disabled={opening}
              >
                {opening ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.webButtonText}>OPEN</Text>
                    <Ionicons name="open-outline" size={14} color="#FFFFFF" />
                  </>
                )}
              </Pressable>
            </View>
          ) : null}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>
      </View>
    </SafeAreaView>
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
    gap: paperSpacing.md,
  },
  hero: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    padding: paperSpacing.md,
    overflow: 'hidden',
    gap: paperSpacing.xs,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
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
  section: {
    backgroundColor: paper.dashboardWhite,
    borderWidth: 1,
    borderColor: paper.dashboardLine,
    borderRadius: 12,
    padding: paperSpacing.md,
    gap: paperSpacing.sm,
  },
  sectionTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  paragraph: {
    fontFamily: paperFonts.body,
    fontSize: 14,
    color: paper.dashboardInk,
    lineHeight: 21,
    opacity: 0.82,
  },
  webCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paperSpacing.sm,
    backgroundColor: paper.dashboardInk,
    borderRadius: 12,
    padding: paperSpacing.md,
  },
  webCopy: {
    flex: 1,
    minWidth: 0,
  },
  webTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlueLight,
    letterSpacing: 2,
  },
  webUrl: {
    marginTop: 3,
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    color: '#FFFFFF',
    opacity: 0.82,
  },
  webButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: paperSpacing.md,
    paddingVertical: paperSpacing.sm,
    backgroundColor: paper.dashboardBlue,
  },
  webButtonPressed: { opacity: 0.82 },
  webButtonDisabled: { opacity: 0.55 },
  webButtonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  errorText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    color: paper.bandTough,
    textAlign: 'center',
  },
});
