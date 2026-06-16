import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CreatorOfferContext } from '../lib/creatorAttribution';
import { paper, paperFonts, paperSpacing } from '../lib/theme';

type Props = {
  offer: CreatorOfferContext;
  onApplyDiscount: () => void;
  applying: boolean;
};

export function CreatorOfferBanner({ offer, onApplyDiscount, applying }: Props) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Ionicons name="gift-outline" size={16} color={paper.dashboardBlue} />
        <Text style={styles.eyebrow}>CREATOR OFFER</Text>
      </View>
      <Text style={styles.title}>
        {offer.creatorName} sent you {offer.discountPercent}% off
      </Text>
      <Text style={styles.copy}>
        Sign in with this FinFindr account, apply the discount below, then upgrade to Angler.
        Your first {offer.discountMonths} months stay discounted on this account.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.applyBtn,
          pressed && styles.applyBtnPressed,
          applying && styles.btnDisabled,
        ]}
        onPress={onApplyDiscount}
        disabled={applying}
      >
        {applying ? (
          <ActivityIndicator size="small" color={paper.dashboardInk} />
        ) : (
          <Ionicons name="pricetag-outline" size={15} color={paper.dashboardInk} />
        )}
        <Text style={styles.applyText}>
          {applying ? 'OPENING APPLE OFFER...' : `APPLY ${offer.discountPercent}% OFF`}
        </Text>
      </Pressable>
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
  applyBtn: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: paper.dashboardInk,
    borderRadius: 8,
    backgroundColor: paper.dashboardWhite,
    marginTop: 2,
  },
  applyBtnPressed: {
    backgroundColor: '#F6F9FB',
  },
  applyText: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10.5,
    color: paper.dashboardInk,
    letterSpacing: 1.6,
  },
  btnDisabled: {
    opacity: 0.65,
  },
});
