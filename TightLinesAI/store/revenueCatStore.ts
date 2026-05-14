import { Platform } from 'react-native';
import { create } from 'zustand';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type CustomerInfoUpdateListener,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import type { SubscriptionTier } from '../lib/types';

const ANGLER_ENTITLEMENT_ID = 'angler';

function revenueCatApiKey(): string | null {
  const platformKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
      : Platform.OS === 'android'
        ? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
        : process.env.EXPO_PUBLIC_REVENUECAT_WEB_API_KEY;
  return platformKey?.trim() || process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim() || null;
}

function tierFromCustomerInfo(info: CustomerInfo | null): SubscriptionTier {
  if (!info) return 'free';
  return info.entitlements.active[ANGLER_ENTITLEMENT_ID]?.isActive
    ? 'angler'
    : 'free';
}

function errorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const maybe = err as { message?: string; userCancelled?: boolean | null };
    if (maybe.userCancelled) return '';
    if (typeof maybe.message === 'string') {
      const message = maybe.message;
      if (
        message.includes('RNPurchases') ||
        message.includes('Native module') ||
        message.includes('native modules are unavailable') ||
        message.includes('not properly linked')
      ) {
        return 'Purchases need an iOS development build. Expo Go cannot show the App Store payment sheet.';
      }
      return message;
    }
  }
  return 'RevenueCat could not complete that request.';
}

async function syncProfileTier(customerInfo: CustomerInfo | null): Promise<void> {
  const user = useAuthStore.getState().user;
  const profile = useAuthStore.getState().profile;
  if (!user || !profile) return;
  const nextTier = tierFromCustomerInfo(customerInfo);
  if (profile.subscription_tier === nextTier) return;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      subscription_tier: nextTier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (!error && data) {
    useAuthStore.getState().setProfile(data);
  }
}

interface RevenueCatState {
  configured: boolean;
  loading: boolean;
  purchasing: string | null;
  restoring: boolean;
  error: string | null;
  customerInfo: CustomerInfo | null;
  offering: PurchasesOffering | null;
  hasAngler: boolean;
  initialize: (userId: string) => Promise<void>;
  refresh: () => Promise<void>;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
}

let configuredUserId: string | null = null;
let customerInfoListener: CustomerInfoUpdateListener | null = null;

export const useRevenueCatStore = create<RevenueCatState>((set, get) => ({
  configured: false,
  loading: false,
  purchasing: null,
  restoring: false,
  error: null,
  customerInfo: null,
  offering: null,
  hasAngler: false,

  initialize: async (userId) => {
    const apiKey = revenueCatApiKey();
    if (!apiKey) {
      set({
        configured: false,
        loading: false,
        error: 'Add EXPO_PUBLIC_REVENUECAT_IOS_API_KEY and/or EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY.',
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      const alreadyConfigured = await Purchases.isConfigured().catch(() => false);
      if (!alreadyConfigured) {
        Purchases.configure({ apiKey, appUserID: userId });
        await Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
      } else if (configuredUserId !== userId) {
        await Purchases.logIn(userId);
      }
      configuredUserId = userId;

      if (!customerInfoListener) {
        customerInfoListener = (info) => {
          set({ customerInfo: info, hasAngler: tierFromCustomerInfo(info) === 'angler' });
          void syncProfileTier(info);
        };
        Purchases.addCustomerInfoUpdateListener(customerInfoListener);
      }

      await get().refresh();
      set({ configured: true });
    } catch (err) {
      set({ error: errorMessage(err), configured: false });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const [customerInfo, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);
      const offering = offerings.current ?? null;
      set({
        customerInfo,
        offering,
        hasAngler: tierFromCustomerInfo(customerInfo) === 'angler',
      });
      await syncProfileTier(customerInfo);
    } catch (err) {
      set({ error: errorMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  purchase: async (pkg) => {
    set({ purchasing: pkg.identifier, error: null });
    try {
      const result = await Purchases.purchasePackage(pkg);
      const hasAngler = tierFromCustomerInfo(result.customerInfo) === 'angler';
      set({ customerInfo: result.customerInfo, hasAngler });
      await syncProfileTier(result.customerInfo);
      return hasAngler;
    } catch (err) {
      const message = errorMessage(err);
      if (message) set({ error: message });
      return false;
    } finally {
      set({ purchasing: null });
    }
  },

  restore: async () => {
    set({ restoring: true, error: null });
    try {
      const customerInfo = await Purchases.restorePurchases();
      const hasAngler = tierFromCustomerInfo(customerInfo) === 'angler';
      set({ customerInfo, hasAngler });
      await syncProfileTier(customerInfo);
      return hasAngler;
    } catch (err) {
      set({ error: errorMessage(err) });
      return false;
    } finally {
      set({ restoring: false });
    }
  },
}));
