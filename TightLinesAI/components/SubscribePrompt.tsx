/**
 * Subscribe Prompt — shown when unsubscribed user taps a gated feature
 *
 * Generic locked-feature message with View plans CTA.
 * Reusable for How's Fishing, Recommender, Water Reader, etc.
 */

import { Image, Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paper, paperFonts, paperSpacing } from '../lib/theme';
import { TopographicLines } from './paper';

export interface SubscribePromptProps {
  visible: boolean;
  onDismiss: () => void;
  onViewPlans?: () => void;
}

export function SubscribePrompt({
  visible,
  onDismiss,
  onViewPlans,
}: SubscribePromptProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TopographicLines
            style={styles.topoLines}
            color={paper.dashboardBlue}
            count={5}
          />
          <Pressable
            style={styles.closeBtn}
            onPress={onDismiss}
            hitSlop={12}
            accessibilityLabel="Close upgrade prompt"
          >
            <Ionicons name="close" size={17} color={paper.dashboardInk} />
          </Pressable>
          <View style={styles.brandLockup}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../assets/images/finfindr-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandText}>
              FinFindr<Text style={styles.brandDot}>.</Text>
            </Text>
          </View>
          <Text style={styles.eyebrow}>FINFINDR · ANGLER</Text>
          <Text style={styles.title}>
            UNLOCK FISHING{'\n'}
            <Text style={styles.titleAccent}>INTELLIGENCE.</Text>
          </Text>
          <Text style={styles.message}>
            Angler opens full bite reports, tactical tackle direction, and
            structure intelligence for supported waters.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="analytics-outline" size={14} color={paper.dashboardBlue} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>Bite reports</Text>
                <Text style={styles.featureCopy}>
                  Full reports for today plus the next 6 days, including score,
                  drivers, windows, and guide-level context.
                </Text>
              </View>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="fish-outline" size={14} color={paper.dashboardBlue} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>Tackle Box</Text>
                <Text style={styles.featureCopy}>
                  Condition-matched lure and presentation picks tuned to your
                  water type, species, season, and daily conditions.
                </Text>
              </View>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="scan-outline" size={14} color={paper.dashboardBlue} />
              </View>
              <View style={styles.featureBody}>
                <Text style={styles.featureTitle}>Water Read</Text>
                <Text style={styles.featureCopy}>
                  Advanced intelligence that reads geometrical structure to
                  identify high percentage fishing zones.
                </Text>
              </View>
              <View style={styles.featureCheck}>
                <Ionicons name="checkmark" size={11} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {onViewPlans && (
            <Pressable
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
              onPress={onViewPlans}
            >
              <Text style={styles.ctaText}>UPGRADE TO ANGLER</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,27,46,0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: paperSpacing.lg,
  },
  card: {
    position: 'relative',
    backgroundColor: paper.dashboardWhite,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: paper.dashboardInk,
    paddingHorizontal: paperSpacing.lg,
    paddingTop: 14,
    paddingBottom: paperSpacing.lg,
    width: '100%',
    maxWidth: 382,
    maxHeight: '75%',
    overflow: 'hidden',
  },
  topoLines: {
    top: -34,
    left: -20,
    right: -20,
    height: 124,
    opacity: 0.1,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: paper.dashboardHair,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLockup: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: paper.dashboardInk,
    borderWidth: 1,
    borderColor: 'rgba(42,110,150,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: paper.dashboardInk,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    marginBottom: 4,
  },
  logo: {
    width: 38,
    height: 38,
    tintColor: '#FFFFFF',
  },
  brandText: {
    fontFamily: paperFonts.display,
    fontSize: 19,
    lineHeight: 20,
    color: paper.dashboardInk,
    fontWeight: '700',
  },
  brandDot: {
    color: paper.dashboardBlue,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 9,
    letterSpacing: 1.8,
    color: paper.dashboardBlue,
    textAlign: 'center',
    marginBottom: 3,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 29,
    lineHeight: 31,
    color: paper.dashboardInk,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  titleAccent: {
    color: paper.dashboardBlue,
  },
  message: {
    fontFamily: paperFonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: paper.dashboardInk,
    opacity: 0.76,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 5,
    marginBottom: paperSpacing.sm,
  },
  featureList: {
    gap: 8,
    marginBottom: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    position: 'relative',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.25,
    borderColor: 'rgba(61,168,95,0.30)',
    backgroundColor: '#FBFCF8',
  },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(61,168,95,0.34)',
    backgroundColor: 'rgba(61,168,95,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBody: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: paper.dashboardInk,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  featureCopy: {
    fontFamily: paperFonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: paper.dashboardInk,
    opacity: 0.78,
  },
  featureCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: paper.bandPrime,
    borderWidth: 1,
    borderColor: 'rgba(10,27,46,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: paper.dashboardInk,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    minHeight: 54,
  },
  ctaPressed: { opacity: 0.84 },
  ctaText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 12,
    letterSpacing: 2.2,
    color: '#FFFFFF',
  },
});
