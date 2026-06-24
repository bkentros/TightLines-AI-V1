import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CreatorReferralContext } from '../lib/creatorAttribution';
import { paper, paperFonts, paperSpacing } from '../lib/theme';

type Props = {
  referral: CreatorReferralContext;
};

export function CreatorReferralBanner({ referral }: Props) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Ionicons name="link-outline" size={16} color={paper.dashboardBlue} />
        <Text style={styles.eyebrow}>CREATOR REFERRAL</Text>
      </View>
      <Text style={styles.title}>
        You came from {referral.creatorName}
      </Text>
      <Text style={styles.copy}>
        Subscribe to Angler below to unlock full FinFindr intelligence. Your signup
        is linked to this creator referral.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: 'rgba(31,111,151,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(31,111,151,0.28)',
    borderRadius: 8,
    padding: paperSpacing.md,
    marginBottom: paperSpacing.lg,
    gap: paperSpacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    color: paper.dashboardBlue,
    letterSpacing: 2,
  },
  title: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    color: paper.dashboardInk,
  },
  copy: {
    fontFamily: paperFonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: paper.dashboardInk,
    opacity: 0.78,
  },
});
