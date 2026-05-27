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
import { getValidAccessToken, invokeEdgeFunction } from "../lib/supabase";
import { useAuthStore } from "./authStore";
import type { SubscriptionTier, UserProfile } from "../lib/types";
import { hasComplimentaryAnglerAccess } from "../lib/adminAccess";
import { captureAnalytics } from "../lib/analytics";

const ANGLER_ENTITLEMENT_ID = "angler";
const NATIVE_UNAVAILABLE_MESSAGE =
  "This installed app does not include the subscription module yet. Create and install a fresh iOS development build, then reopen FinFindr.";
const PAYWALL_NATIVE_UNAVAILABLE_MESSAGE =
  "This installed app does not include the subscription paywall module yet. Create and install a fresh iOS development build, then reopen FinFindr.";
const OFFERINGS_UNAVAILABLE_MESSAGE =
  "Angler plans are not available from the App Store yet. Your free access still works; please try upgrading again later.";
const RECEIPT_ALREADY_OWNED_MESSAGE =
  "This App Store subscription is already connected to another FinFindr account. Sign in to that original FinFindr account to restore access, or contact support if you need account recovery.";

type SyncSubscriptionTierResponse = {
  subscription_tier: SubscriptionTier;
  has_angler: boolean;
  profile: UserProfile | null;
};

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

function hasEffectiveAnglerAccess(info: CustomerInfo | null): boolean {
  return tierFromCustomerInfo(info) === "angler" ||
    hasComplimentaryAnglerAccess(useAuthStore.getState().user?.email);
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
      if (
        message.includes("already another active subscriber") ||
        message.includes("same receipt") ||
        message.includes("ReceiptAlreadyInUse")
      ) {
        return RECEIPT_ALREADY_OWNED_MESSAGE;
      }
      return message;
    }
  }
  return "RevenueCat could not complete that request.";
}

function classifyRevenueCatError(message: string): string {
  if (!message) return "cancelled_or_unknown";
  if (message === NATIVE_UNAVAILABLE_MESSAGE) return "native_unavailable";
  if (message === PAYWALL_NATIVE_UNAVAILABLE_MESSAGE) return "paywall_native_unavailable";
  if (message === OFFERINGS_UNAVAILABLE_MESSAGE) return "offerings_unavailable";
  if (message === RECEIPT_ALREADY_OWNED_MESSAGE) return "receipt_already_owned";
  if (/sign in/i.test(message)) return "auth_required";
  return "revenuecat_error";
}

async function syncProfileTier(
  customerInfo: CustomerInfo | null,
): Promise<void> {
  const user = useAuthStore.getState().user;
  const profile = useAuthStore.getState().profile;
  if (!user || !profile) return;
  const observedTier = tierFromCustomerInfo(customerInfo);
  const hasComplimentaryAccess = hasComplimentaryAnglerAccess(user.email);
  const shouldConfirmServerTier = hasComplimentaryAccess
    ? profile.subscription_tier !== "angler"
    : profile.subscription_tier !== observedTier ||
      profile.subscription_tier !== "free" ||
      observedTier !== "free";
  if (!shouldConfirmServerTier) return;

  const accessToken = await getValidAccessToken();
  const result = await invokeEdgeFunction<SyncSubscriptionTierResponse>(
    "sync-subscription-tier",
    {
      accessToken,
      body: {},
    },
  );

  if (result.profile) {
    useAuthStore.getState().setProfile(result.profile);
  }

  captureAnalytics("subscription_tier_synced", {
    subscription_tier: result.subscription_tier,
    has_angler: result.has_angler,
  });
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
  reset: () => void;
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
    hasAngler: hasEffectiveAnglerAccess(customerInfo),
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
        hasAngler: hasEffectiveAnglerAccess(null),
      });
      return;
    }

    const apiKey = revenueCatApiKey();
    if (!apiKey) {
      set({
        configured: false,
        loading: false,
        hasAngler: hasEffectiveAnglerAccess(null),
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
              if (!useAuthStore.getState().user?.id) return;
              set({
                customerInfo: info,
                hasAngler: hasEffectiveAnglerAccess(info),
              });
              void syncProfileTier(info).catch((err) => {
                if (__DEV__) console.warn("[RevenueCat] tier sync failed", err);
              });
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
        hasAngler: hasEffectiveAnglerAccess(null),
      });
      return;
    }

    configureRevenueCatLogs();
    set({ loading: true, error: null });
    try {
      if (initializationPromise) await initializationPromise;
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        set({
          configured: false,
          customerInfo: null,
          offering: null,
          hasAngler: false,
          error: "Sign in before loading subscription plans.",
        });
        return;
      }
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured || configuredUserId !== userId) {
        await get().initialize(userId);
      }

      const customerInfo = await Purchases.getCustomerInfo();
      set({
        customerInfo,
        hasAngler: hasEffectiveAnglerAccess(customerInfo),
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
    if (hasComplimentaryAnglerAccess(useAuthStore.getState().user?.email)) {
      set({ presentingPaywall: false, error: null, hasAngler: true });
      return true;
    }
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
    captureAnalytics("paywall_opened", {
      entitlement_id: ANGLER_ENTITLEMENT_ID,
    });
    set({ presentingPaywall: true, error: null });
    try {
      if (initializationPromise) await initializationPromise;
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        set({ error: "Sign in before purchasing Angler." });
        return false;
      }
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured || configuredUserId !== userId) {
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
      const hasAngler = hasEffectiveAnglerAccess(customerInfo);
      set({
        customerInfo,
        hasAngler,
        error: result === PAYWALL_RESULT.ERROR
          ? "RevenueCat could not complete the paywall purchase. Check the subscription setup and try again."
          : null,
      });
      await syncProfileTier(customerInfo);

      captureAnalytics("paywall_closed", {
        result,
        has_angler: hasAngler,
      });
      if (hasAngler) {
        captureAnalytics("subscription_unlocked", {
          source: "paywall",
          entitlement_id: ANGLER_ENTITLEMENT_ID,
        });
      }

      return hasAngler || result === PAYWALL_RESULT.NOT_PRESENTED;
    } catch (err) {
      const message = errorMessage(err);
      if (message) set({ error: message });
      captureAnalytics("paywall_failed", {
        reason: classifyRevenueCatError(message),
      });
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
    captureAnalytics("purchase_started", {
      package_identifier: pkg.identifier,
    });
    set({ purchasing: pkg.identifier, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        set({ error: "Sign in before purchasing Angler." });
        return false;
      }
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured || configuredUserId !== userId) {
        await get().initialize(userId);
      }

      const result = await Purchases.purchasePackage(pkg);
      const hasAngler = hasEffectiveAnglerAccess(result.customerInfo);
      set({ customerInfo: result.customerInfo, hasAngler });
      await syncProfileTier(result.customerInfo);
      captureAnalytics("purchase_completed", {
        package_identifier: pkg.identifier,
        has_angler: hasAngler,
      });
      return hasAngler;
    } catch (err) {
      const message = errorMessage(err);
      if (message) set({ error: message });
      captureAnalytics("purchase_failed", {
        package_identifier: pkg.identifier,
        reason: classifyRevenueCatError(message),
      });
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
    captureAnalytics("restore_started");
    set({ restoring: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        set({ error: "Sign in before restoring purchases." });
        return false;
      }
      const alreadyConfigured = await Purchases.isConfigured().catch(() =>
        false
      );
      if (!alreadyConfigured || configuredUserId !== userId) {
        await get().initialize(userId);
      }

      const customerInfo = await Purchases.restorePurchases();
      const hasAngler = hasEffectiveAnglerAccess(customerInfo);
      set({ customerInfo, hasAngler });
      await syncProfileTier(customerInfo);
      captureAnalytics("restore_completed", {
        has_angler: hasAngler,
      });
      return hasAngler;
    } catch (err) {
      const message = errorMessage(err);
      set({ error: message });
      captureAnalytics("restore_failed", {
        reason: classifyRevenueCatError(message),
      });
      return false;
    } finally {
      set({ restoring: false });
    }
  },

  reset: () => {
    configuredUserId = null;
    set({
      configured: false,
      loading: false,
      purchasing: null,
      presentingPaywall: false,
      restoring: false,
      error: null,
      customerInfo: null,
      offering: null,
      hasAngler: false,
    });
  },
}));
