import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const PENDING_CODE_KEY = 'finfindr_pending_creator_code_v1';
const PENDING_CLICK_KEY = 'finfindr_pending_creator_click_v1';
const CREATOR_LINK_SESSION_KEY = 'finfindr_creator_link_session_v1';
/** Legacy key — cleared on read so old sessions do not leak discount UI. */
const LEGACY_CREATOR_OFFER_UI_KEY = 'finfindr_creator_offer_ui_v1';
const LEGACY_CREATOR_SUBSCRIBE_INTENT_KEY = 'finfindr_creator_subscribe_intent_v1';

const APPLE_APP_ID = '6769178136';
const LINK_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export const CREATOR_DISCOUNT_PERCENT = 10;
export const CREATOR_DISCOUNT_MONTHS = 3;

export type PendingCreatorAttribution = {
  code: string;
  referralClickToken?: string | null;
};

export type CreatorOfferContext = {
  code: string;
  creatorName: string;
  redemptionUrl: string;
  discountPercent: number;
  discountMonths: number;
};

export type CreatorAttributionResult = {
  ok: boolean;
  status?: string;
  code?: string;
  creator_name?: string;
  redemption_url?: string | null;
  message?: string;
  error?: string;
};

type CreatorLinkSession = {
  active: boolean;
  dismissed: boolean;
  code: string;
  referralClickToken?: string | null;
  creatorName?: string;
  redemptionUrl?: string;
  startedAt: number;
  routedToSubscribe?: boolean;
};

export function buildOfferFromCode(
  code: string,
  creatorName = 'Creator partner',
  redemptionUrl?: string | null,
): CreatorOfferContext {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return {
    code: normalized,
    creatorName,
    redemptionUrl: redemptionUrl?.trim() || buildAppStoreRedemptionUrl(normalized),
    discountPercent: CREATOR_DISCOUNT_PERCENT,
    discountMonths: CREATOR_DISCOUNT_MONTHS,
  };
}

export function buildAppStoreRedemptionUrl(code: string): string {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `https://apps.apple.com/redeem?ctx=offercodes&id=${APPLE_APP_ID}&code=${encodeURIComponent(normalized)}`;
}

async function clearLegacyCreatorStorage(): Promise<void> {
  await AsyncStorage.multiRemove([
    LEGACY_CREATOR_OFFER_UI_KEY,
    LEGACY_CREATOR_SUBSCRIBE_INTENT_KEY,
  ]);
}

async function readCreatorLinkSession(): Promise<CreatorLinkSession | null> {
  await clearLegacyCreatorStorage();
  const raw = await AsyncStorage.getItem(CREATOR_LINK_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CreatorLinkSession;
    if (!parsed?.active || parsed.dismissed || !parsed.code) return null;
    if (Date.now() - parsed.startedAt > LINK_SESSION_TTL_MS) {
      await AsyncStorage.removeItem(CREATOR_LINK_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function writeCreatorLinkSession(session: CreatorLinkSession): Promise<void> {
  await AsyncStorage.setItem(CREATOR_LINK_SESSION_KEY, JSON.stringify(session));
}

/** Called only from a creator deep link — starts a one-time in-app offer session. */
export async function activateCreatorLinkSession(
  input: PendingCreatorAttribution,
): Promise<void> {
  const code = input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!code) return;

  await storePendingCreatorAttribution(input);
  await writeCreatorLinkSession({
    active: true,
    dismissed: false,
    code,
    referralClickToken: input.referralClickToken?.trim() || null,
    startedAt: Date.now(),
  });
}

export async function hasActiveCreatorLinkSession(): Promise<boolean> {
  return (await readCreatorLinkSession()) != null;
}

export async function shouldAutoRouteCreatorSubscribe(): Promise<boolean> {
  const session = await readCreatorLinkSession();
  return Boolean(session && !session.routedToSubscribe);
}

export async function markCreatorLinkRouted(): Promise<void> {
  const session = await readCreatorLinkSession();
  if (!session) return;
  await writeCreatorLinkSession({ ...session, routedToSubscribe: true });
}

/** User closed subscribe / declined — stop showing creator discount UI. */
export async function dismissCreatorLinkSession(): Promise<void> {
  await clearPendingCreatorAttribution();
  await AsyncStorage.removeItem(CREATOR_LINK_SESSION_KEY);
  await clearLegacyCreatorStorage();
}

/** Successful Angler purchase through creator flow. */
export async function completeCreatorLinkSession(): Promise<void> {
  await dismissCreatorLinkSession();
}

export async function storePendingCreatorAttribution(
  input: PendingCreatorAttribution,
): Promise<void> {
  const code = input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!code) return;
  await AsyncStorage.multiSet([
    [PENDING_CODE_KEY, code],
    [PENDING_CLICK_KEY, input.referralClickToken?.trim() ?? ''],
  ]);
}

export async function getPendingCreatorAttribution(): Promise<PendingCreatorAttribution | null> {
  const pairs = await AsyncStorage.multiGet([PENDING_CODE_KEY, PENDING_CLICK_KEY]);
  const code = pairs[0]?.[1]?.trim();
  if (!code) return null;
  const click = pairs[1]?.[1]?.trim();
  return {
    code,
    referralClickToken: click || null,
  };
}

export async function clearPendingCreatorAttribution(): Promise<void> {
  await AsyncStorage.multiRemove([PENDING_CODE_KEY, PENDING_CLICK_KEY]);
}

function offerFromAttributionResult(
  code: string,
  result: CreatorAttributionResult,
): CreatorOfferContext {
  const resolvedCode = (result.code ?? code).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return buildOfferFromCode(
    resolvedCode,
    result.creator_name?.trim() || 'Creator partner',
    result.redemption_url,
  );
}

export async function applyCreatorCode(
  accessToken: string,
  input: { code: string; referralClickToken?: string | null },
): Promise<CreatorAttributionResult> {
  const normalized = input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!normalized) {
    return { ok: false, error: 'invalid_creator_code' };
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/creator-code-attribution`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          'x-user-token': accessToken,
        },
        body: JSON.stringify({
          code: normalized,
          ...(input.referralClickToken
            ? { referral_click_token: input.referralClickToken }
            : {}),
        }),
      },
    );

    const parsed = (await response.json()) as CreatorAttributionResult;
    if (parsed?.ok) {
      await clearPendingCreatorAttribution();
    }
    if (!response.ok && !parsed?.status) {
      return {
        ok: false,
        error: parsed?.error ?? parsed?.message ?? `Request failed (${response.status})`,
        message: parsed?.message,
      };
    }
    return parsed;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not apply creator code.';
    return { ok: false, error: message };
  }
}

async function persistSessionOfferDetails(
  session: CreatorLinkSession,
  offer: CreatorOfferContext,
): Promise<void> {
  await writeCreatorLinkSession({
    ...session,
    creatorName: offer.creatorName,
    redemptionUrl: offer.redemptionUrl,
  });
}

/**
 * Loads creator offer ONLY when the user arrived via an active creator link session.
 * Returns null for organic Manage Membership visits.
 */
export async function loadCreatorOfferForLinkSession(
  accessToken: string | null,
): Promise<CreatorOfferContext | null> {
  const session = await readCreatorLinkSession();
  if (!session) return null;

  if (session.creatorName && session.redemptionUrl) {
    return buildOfferFromCode(session.code, session.creatorName, session.redemptionUrl);
  }

  if (!accessToken) {
    return buildOfferFromCode(session.code);
  }

  const pending = await getPendingCreatorAttribution();
  const result = await applyCreatorCode(accessToken, {
    code: session.code,
    referralClickToken: pending?.referralClickToken ?? session.referralClickToken,
  });

  if (result.error === 'creator_offer_ineligible') {
    await dismissCreatorLinkSession();
    return null;
  }

  if (!result.ok) {
    return buildOfferFromCode(session.code);
  }

  const offer = offerFromAttributionResult(session.code, result);
  await persistSessionOfferDetails(session, offer);
  return offer;
}

export async function openCreatorOfferRedemption(
  redemptionUrl: string,
): Promise<boolean> {
  const url = redemptionUrl.trim() || '';
  if (!url) return false;
  if (Platform.OS === 'web') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }
  await Linking.openURL(url);
  return true;
}

export function parseCreatorDeepLink(url: string): PendingCreatorAttribution | null {
  const lower = url.toLowerCase();
  if (!lower.startsWith('finfindr://') || !lower.includes('creator')) {
    return null;
  }

  const queryStart = url.indexOf('?');
  if (queryStart === -1) return null;

  const params = new URLSearchParams(url.slice(queryStart + 1));
  const code = params.get('code');
  if (!code) return null;

  const referralClickToken = params.get('click') ??
    params.get('referral_click_token');

  return {
    code,
    referralClickToken,
  };
}
