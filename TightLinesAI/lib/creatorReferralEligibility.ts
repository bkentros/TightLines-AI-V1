import type { CustomerInfo } from 'react-native-purchases';

export const ANGLER_PRODUCT_IDS = [
  'finfindr_angler_monthly',
  'finfindr_angler_annual',
] as const;

/** True when this Apple ID has ever purchased Angler via RevenueCat. */
export function hasPriorAnglerPurchase(customerInfo: CustomerInfo | null): boolean {
  if (!customerInfo) return false;

  const purchased = customerInfo.allPurchasedProductIdentifiers ?? [];
  if (ANGLER_PRODUCT_IDS.some((id) => purchased.includes(id))) {
    return true;
  }

  const purchaseDates = customerInfo.allPurchaseDates ?? {};
  return ANGLER_PRODUCT_IDS.some((id) => Boolean(purchaseDates[id]));
}

/** Client-side gate before showing creator referral subscribe UI. */
export function isCreatorReferralEligible(input: {
  customerInfo: CustomerInfo | null;
  hasAngler: boolean;
  profileTier?: string | null;
}): boolean {
  if (input.hasAngler || input.profileTier === 'angler') return false;
  return !hasPriorAnglerPurchase(input.customerInfo);
}

/** @deprecated Use isCreatorReferralEligible */
export const isCreatorOfferEligible = isCreatorReferralEligible;
