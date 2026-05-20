import { NativeModules, Platform } from "react-native";
import { create } from "zustand";
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type CustomerInfoUpdateListener,
  type LogHandler,
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "./authStore";
import type { SubscriptionTier } from "../lib/types";

const ANGLER_ENTITLEMENT_ID = "angler";
const NATIVE_UNAVAILABLE_MESSAGE =
  "This installed app does not include the RevenueCat native module yet. Create and install a fresh iOS development build, then reopen FinFindr.";
const PAYWALL_NATIVE_UNAVAILABLE_MESSAGE =
  "This installed app does not include the RevenueCat Paywalls native module yet. Create and install a fresh iOS development build, then reopen FinFindr.";
const OFFERINGS_UNAVAILABLE_MESSAGE =
  "RevenueCat is connected, but Apple StoreKit is not returning the FinFindr Angler products yet. Finish any remaining App Store Connect paid-app agreement, tax, banking, and first-subscription submission steps, then test again in a fresh development or TestFlight build.";

function revenueCatNativeAvailable(): boolean {
  if (Platform.OS === "web") return false;
  return Boolean((NativeModules as Record<string, unknown>).RNPurchases);
}

function revenueCatPaywallsNativeAvailable(): boolean {
  if (Platform.OS === "web") return false;
  const modules = NativeModules as Record<string, unknown>;
  return Boolean(modules.RNPaywalls && modules.RNCustomerCenter);
}

function revenueCatApiKey(): string | null {
  const platformKey = Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
    : Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
    : process.env.EXPO_PUBLIC_REVENUECAT_WEB_API_KEY;
  return platformKey?.trim() ||
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim() || null;
}

function tierFromCustomerInfo(info: CustomerInfo | null): SubscriptionTier {
  if (!info) return "free";
  return info.entitlements.active[ANGLER_ENTITLEMENT_ID]?.isActive
    ? "angler"
    : "free";
}

function isOfferingsConfigurationError(message: string): boolean {
  return (
    message.includes("None of the products registered") ||
    message.includes("could be fetched from App Store Connect") ||
    message.includes("StoreKit Configuration file") ||
    message.includes("OfferingsManager.Error error 1") ||
    message.includes("why-are-offerings-empty")
  );
}

function errorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const maybe = err as { message?: string; userCancelled?: boolean | null };
    if (maybe.userCancelled) return "";
    if (typeof maybe.message === "string") {
      const message = maybe.message;
      if (
        message.includes("no singleton instance") ||
        message.includes("configure Purchases")
      ) {
        return "Purchases are still connecting. Close this panel, wait a moment, and try again.";
      }
      if (
        message.includes("RevenueCatUI") ||
        message.includes("RNPaywalls") ||
        message.includes("RNCustomerCenter")
      ) {
        return PAYWALL_NATIVE_UNAVAILABLE_MESSAGE;
      }
      if (
        message.includes("RNPurchases") ||
        message.includes("Native module") ||
        message.includes("native modules are unavailable") ||
        message.includes("not properly linked")
      ) {
        return NATIVE_UNAVAILABLE_MESSAGE;
      }
      if (isOfferingsConfigurationError(message)) {
        return OFFERINGS_UNAVAILABLE_MESSAGE;
      }
      return message;
    }
  }
  return "RevenueCat could not complete that request.";
}

async function syncProfileTier(
  customerInfo: CustomerInfo | null,
): Promise<void> {
  const user = useAuthStore.getState().user;
  const profile = useAuthStore.getState().profile;
  if (!user || !profile) return;
  const nextTier = tierFromCustomerInfo(customerInfo);
  if (profile.subscription_tier === nextTier) return;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      subscription_tier: nextTier,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
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
  presentingPaywall: boolean;
  restoring: boolean;
  error: string | null;
  customerInfo: CustomerInfo | null;
  offering: PurchasesOffering | null;
  hasAngler: boolean;
  initialize: (userId: string) => Promise<void>;
  refresh: () => Promise<void>;
  presentPaywall: () => Promise<boolean>;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
}

let configuredUserId: string | null = null;
let customerInfoListener: CustomerInfoUpdateListener | null = null;
let initializationPromise: Promise<void> | null = null;
let revenueCatLogsConfigured = false;

function configureRevenueCatLogs(): void {
  if (revenueCatLogsConfigured || !revenueCatNativeAvailable()) return;

  try {
    const logHandler: LogHandler = (level, message) => {
      if (!__DEV__) return;
      console.log(`[RevenueCat:${level}] ${message}`);
    };
    Purchases.setLogHandler(logHandler);
    revenueCatLogsConfigured = true;
    void Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.WARN : LOG_LEVEL.ERROR)
      .catch(() => undefined);
  } catch {
    revenueCatLogsConfigured = false;
  }
}

async function refreshCustomerInfoOnly(
  set: (partial: Partial<RevenueCatState>) => void,
): Promise<void> {
  const customerInfo = await Purchases.getCustomerInfo();
  set({
    customerInfo,
    hasAngler: tierFromCustomerInfo(customerInfo) === "angler",
  });
  await syncProfileTier(customerInfo);
}

export const useRevenueCatStore = create<RevenueCatState>((set, get) => ({
  configured: false,
  loading: false,
  purchasing: null,
  presentingPaywall: false,
  restoring: false,
  error: null,
  customerInfo: null,
  offering: null,
  hasAngler: false,

  initialize: async (userId) => {
    if (!revenueCatNativeAvailable()) {
      set({
        configured: false,
        loading: false,
        error: NATIVE_UNAVAILABLE_MESSAGE,
        customerInfo: null,
        offering: null,
        hasAngler: false,
      });
      return;
    }

    const apiKey = revenueCatApiKey();
    if (!apiKey) {
      set({
        configured: false,
        loading: false,
        error:
          "Add EXPO_PUBLIC_REVENUECAT_IOS_API_KEY and/or EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY.",
      });
      return;
    }

    configureRevenueCatLogs();
    set({ loading: true, error: null });
    try {
      if (!initializationPromise) {
        initializationPromise = (async () => {
          const alreadyConfigured = await Purchases.isConfigured().catch(() =>
            false
          );
          if (!alreadyConfigured) {
            Purchases.configure({ apiKey, appUserID: userId });
          } else if (configuredUserId !== userId) {
            await Purchases.logIn(userId);
          }
          configuredUserId = userId;

          if (!customerInfoListener) {
            customerInfoListener = (info) => {
              set({
                customerInfo: info,
                hasAngler: tierFromCustomerInfo(info) === "angler",
              });
              void syncProfileTier(info);
            };
            Purchases.addCustomerInfoUpdateListener(customerInfoListener);
          }
        })().finally(() => {
          initializationPromise = null;
        });
      }

      await initializationPromise;

      set({ configured: true });
      await refreshCustomerInfoOnly(set);
    } catch (err) {
      set({ error: errorMessage(err), configured: false });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    if (!revenueCatNativeAvailable()) {
      set({
        configured: false,
        loading: false,
        error: NATIVE_UNAVAILABLE_MESSAGE,
        customerInfo: null,
        offering: null,
        hasAngler: false,
      });
      return;
    }

    configureRevenueCatLogs();
    set({ loading: true, error: null });
    try {
      if (initializationPromise) await initializationPromise;
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured) {
        const userId = useAuthStore.getState().user?.id;
        if (userId) {
          await get().initialize(userId);
        } else {
          set({
            configured: false,
            error: "Sign in before loading subscription plans.",
          });
        }
        return;
      }

      const customerInfo = await Purchases.getCustomerInfo();
      set({
        customerInfo,
        hasAngler: tierFromCustomerInfo(customerInfo) === "angler",
      });
      await syncProfileTier(customerInfo);

      const offerings = await Purchases.getOfferings();
      const offering = offerings.current ?? null;
      set({
        offering,
        error: offering ? null : OFFERINGS_UNAVAILABLE_MESSAGE,
      });
    } catch (err) {
      set({ error: errorMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  presentPaywall: async () => {
    if (!revenueCatNativeAvailable()) {
      set({ presentingPaywall: false, error: NATIVE_UNAVAILABLE_MESSAGE });
      return false;
    }
    if (!revenueCatPaywallsNativeAvailable()) {
      set({
        presentingPaywall: false,
        error: PAYWALL_NATIVE_UNAVAILABLE_MESSAGE,
      });
      return false;
    }

    configureRevenueCatLogs();
    set({ presentingPaywall: true, error: null });
    try {
      if (initializationPromise) await initializationPromise;
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured) {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set({ error: "Sign in before purchasing Angler." });
          return false;
        }
        await get().initialize(userId);
      }

      const configured = await Purchases.isConfigured().catch(() => false);
      if (!configured) return false;

      const offerings = await Purchases.getOfferings();
      const offering = offerings.current ?? null;
      if (!offering || offering.availablePackages.length === 0) {
        set({ offering, error: OFFERINGS_UNAVAILABLE_MESSAGE });
        return false;
      }
      set({ offering, error: null });

      const result = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: ANGLER_ENTITLEMENT_ID,
        displayCloseButton: true,
      });

      const customerInfo = await Purchases.getCustomerInfo();
      const hasAngler = tierFromCustomerInfo(customerInfo) === "angler";
      set({
        customerInfo,
        hasAngler,
        error: result === PAYWALL_RESULT.ERROR
          ? "RevenueCat could not complete the paywall purchase. Check the subscription setup and try again."
          : null,
      });
      await syncProfileTier(customerInfo);

      return hasAngler || result === PAYWALL_RESULT.NOT_PRESENTED;
    } catch (err) {
      const message = errorMessage(err);
      if (message) set({ error: message });
      return false;
    } finally {
      set({ presentingPaywall: false });
    }
  },

  purchase: async (pkg) => {
    if (!revenueCatNativeAvailable()) {
      set({ purchasing: null, error: NATIVE_UNAVAILABLE_MESSAGE });
      return false;
    }

    configureRevenueCatLogs();
    set({ purchasing: pkg.identifier, error: null });
    try {
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured) {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set({ error: "Sign in before purchasing Angler." });
          return false;
        }
        await get().initialize(userId);
      }

      const result = await Purchases.purchasePackage(pkg);
      const hasAngler = tierFromCustomerInfo(result.customerInfo) === "angler";
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
    if (!revenueCatNativeAvailable()) {
      set({ restoring: false, error: NATIVE_UNAVAILABLE_MESSAGE });
      return false;
    }

    configureRevenueCatLogs();
    set({ restoring: true, error: null });
    try {
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured) {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set({ error: "Sign in before restoring purchases." });
          return false;
        }
        await get().initialize(userId);
      }

      const customerInfo = await Purchases.restorePurchases();
      const hasAngler = tierFromCustomerInfo(customerInfo) === "angler";
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
