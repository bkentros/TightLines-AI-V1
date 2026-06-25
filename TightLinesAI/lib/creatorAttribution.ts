import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearPendingInstallyAttribution,
  getPendingInstallyAttribution,
  trackInstallyInstall,
} from './installyAttribution';
import { getOptionalClipboardString } from './optionalClipboard';
import { isCreatorReferralEligible } from './creatorReferralEligibility';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const PENDING_CODE_KEY = 'finfindr_pending_creator_code_v1';
const PENDING_CLICK_KEY = 'finfindr_pending_creator_click_v1';
const PENDING_AUTO_ROUTED_KEY = 'finfindr_creator_pending_auto_routed_v1';
const CREATOR_LINK_SESSION_KEY = 'finfindr_creator_link_session_v1';
/** Legacy key — cleared on read so old sessions do not leak referral UI. */
const LEGACY_CREATOR_OFFER_UI_KEY = 'finfindr_creator_offer_ui_v1';
const LEGACY_CREATOR_SUBSCRIBE_INTENT_KEY = 'finfindr_creator_subscribe_intent_v1';

/** Align with server REFERRAL_CLICK_ATTRIBUTION_WINDOW_DAYS (60). */
const LINK_SESSION_TTL_MS = 60 * 24 * 60 * 60 * 1000;

export type PendingCreatorAttribution = {
  code: string;
  referralClickToken?: string | null;
};

export type CreatorReferralContext = {
  code: string;
  creatorName: string;
};

/** @deprecated Use CreatorReferralContext */
export type CreatorOfferContext = CreatorReferralContext;

export type CreatorAttributionResult = {
  ok: boolean;
  status?: string;
  code?: string;
  creator_name?: string;
  message?: string;
  error?: string;
};

type CreatorLinkSession = {
  active: boolean;
  dismissed: boolean;
  code: string;
  referralClickToken?: string | null;
  creatorName?: string;
  startedAt: number;
};

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

/** Called only from a tracked creator deep link — starts an in-app referral session. */
export async function activateCreatorLinkSession(
  input: PendingCreatorAttribution,
): Promise<void> {
  const code = input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const referralClickToken = input.referralClickToken?.trim();
  if (!code || !referralClickToken) return;

  await recordCreatorReferralAppOpen(input, 'deep_link');

  await storePendingCreatorAttribution(input);
  await writeCreatorLinkSession({
    active: true,
    dismissed: false,
    code,
    referralClickToken: input.referralClickToken?.trim() || null,
    startedAt: Date.now(),
  });
  await AsyncStorage.removeItem(PENDING_AUTO_ROUTED_KEY);
}

export async function hasActiveCreatorLinkSession(): Promise<boolean> {
  return (await readCreatorLinkSession()) != null;
}

/** True only when the user opened a tracked creator landing link (click token present). */
export async function hasVerifiedCreatorReferralSession(): Promise<boolean> {
  const session = await readCreatorLinkSession();
  return Boolean(session?.referralClickToken?.trim());
}

/**
 * Records referral click for later attribution without starting in-app UI
 * (used when the user is not signed in or has not finished onboarding).
 */
export async function storeCreatorReferralPendingOnly(
  input: PendingCreatorAttribution,
  matchMethod: ReferralAppOpenMatchMethod = 'deep_link',
): Promise<void> {
  const code = input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const referralClickToken = input.referralClickToken?.trim();
  if (!code || !referralClickToken) return;

  await recordCreatorReferralAppOpen(input, matchMethod);

  await storePendingCreatorAttribution(input);
  await AsyncStorage.removeItem(CREATOR_LINK_SESSION_KEY);
  await AsyncStorage.removeItem(PENDING_AUTO_ROUTED_KEY);
}

export async function clearCreatorLinkUiSession(): Promise<void> {
  await AsyncStorage.removeItem(CREATOR_LINK_SESSION_KEY);
}

export async function promotePendingReferralToActiveSession(): Promise<boolean> {
  if (await hasVerifiedCreatorReferralSession()) return true;

  const pending = await getPendingCreatorAttribution();
  if (!pending?.referralClickToken?.trim() || !pending.code?.trim()) {
    return false;
  }

  await activateCreatorLinkSession(pending);
  return true;
}

export async function dismissCreatorLinkSession(): Promise<void> {
  await clearPendingCreatorAttribution();
  await AsyncStorage.multiRemove([
    CREATOR_LINK_SESSION_KEY,
    PENDING_AUTO_ROUTED_KEY,
  ]);
  await clearLegacyCreatorStorage();
}

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

export async function hasPendingCreatorReferralClick(): Promise<boolean> {
  const pending = await getPendingCreatorAttribution();
  return Boolean(pending?.referralClickToken?.trim() && pending.code?.trim());
}

async function hasPendingCreatorAutoRouted(): Promise<boolean> {
  return (await AsyncStorage.getItem(PENDING_AUTO_ROUTED_KEY)) === '1';
}

export async function markPendingCreatorAutoRouted(): Promise<void> {
  await AsyncStorage.setItem(PENDING_AUTO_ROUTED_KEY, '1');
}

export type PendingCreatorRouteResult = 'none' | 'subscribe' | 'ineligible';

export async function resolvePendingCreatorReferralRoute(input: {
  hasSession: boolean;
  isOnboarded: boolean;
  hasAngler: boolean;
  customerInfo: import('react-native-purchases').CustomerInfo | null;
  profileTier?: string | null;
}): Promise<PendingCreatorRouteResult> {
  if (!input.hasSession || !input.isOnboarded) return 'none';
  if (!(await hasPendingCreatorReferralClick())) return 'none';
  if (await hasPendingCreatorAutoRouted()) return 'none';

  if (!isCreatorReferralEligible({
    customerInfo: input.customerInfo,
    hasAngler: input.hasAngler,
    profileTier: input.profileTier,
  })) {
    await dismissCreatorLinkSession();
    return 'ineligible';
  }

  await promotePendingReferralToActiveSession();
  return 'subscribe';
}

export async function clearPendingCreatorAttribution(): Promise<void> {
  await AsyncStorage.multiRemove([PENDING_CODE_KEY, PENDING_CLICK_KEY]);
}

function referralFromAttributionResult(
  code: string,
  result: CreatorAttributionResult,
): CreatorReferralContext {
  const resolvedCode = (result.code ?? code).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return {
    code: resolvedCode,
    creatorName: result.creator_name?.trim() || 'Creator partner',
  };
}

export async function applyCreatorReferral(
  accessToken: string,
  input: {
    code?: string | null;
    referralClickToken?: string | null;
    installyClickId?: string | null;
  },
): Promise<CreatorAttributionResult> {
  const normalized = input.code?.trim()
    ? input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    : '';
  const referralClickToken = input.referralClickToken?.trim() ?? '';
  const installyClickId = input.installyClickId?.trim() ?? '';

  if (!normalized && !referralClickToken && !installyClickId) {
    return { ok: false, error: 'referral_click_required' };
  }

  if (normalized && input.referralClickToken?.trim()) {
    await recordCreatorReferralAppOpen(
      { code: normalized, referralClickToken: input.referralClickToken },
      'deep_link',
    );
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
          ...(normalized ? { code: normalized } : {}),
          ...(input.referralClickToken
            ? { referral_click_token: input.referralClickToken }
            : {}),
          ...(input.installyClickId
            ? { instally_click_id: input.installyClickId }
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
    const message = err instanceof Error ? err.message : 'Could not apply creator referral.';
    return { ok: false, error: message };
  }
}

/** @deprecated Use applyCreatorReferral */
export const applyCreatorCode = applyCreatorReferral;

async function persistSessionReferralDetails(
  session: CreatorLinkSession,
  referral: CreatorReferralContext,
): Promise<void> {
  await writeCreatorLinkSession({
    ...session,
    creatorName: referral.creatorName,
  });
}

/**
 * Confirms creator referral ONLY when the user arrived via a tracked creator link.
 * Returns null for organic Manage Membership visits.
 */
export async function loadCreatorReferralForLinkSession(
  accessToken: string | null,
): Promise<CreatorReferralContext | null> {
  const session = await readCreatorLinkSession();
  if (!session?.referralClickToken?.trim()) {
    return null;
  }

  if (!accessToken) {
    return null;
  }

  const pending = await getPendingCreatorAttribution();
  const result = await applyCreatorReferral(accessToken, {
    code: session.code,
    referralClickToken: pending?.referralClickToken ?? session.referralClickToken,
  });

  if (
    result.error === 'creator_referral_ineligible' ||
    result.error === 'creator_offer_ineligible'
  ) {
    await dismissCreatorLinkSession();
    return null;
  }

  if (!result.ok) {
    if (
      result.error === 'referral_click_required' ||
      result.error === 'referral_click_not_found' ||
      result.error === 'referral_click_code_mismatch' ||
      result.error === 'referral_click_expired'
    ) {
      await dismissCreatorLinkSession();
    }
    return null;
  }

  const referral = referralFromAttributionResult(session.code, result);
  await persistSessionReferralDetails(session, referral);
  return referral;
}

/** @deprecated Use loadCreatorReferralForLinkSession */
export const loadCreatorOfferForLinkSession = loadCreatorReferralForLinkSession;

type CreatorReferralResolveResult = {
  ok: boolean;
  match_method?: string;
  click_token?: string;
  code?: string;
  creator_name?: string;
  error?: string;
};

type ReferralAppOpenMatchMethod = 'clipboard' | 'fingerprint' | 'install_recent' | 'deep_link' | 'universal_link';

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

/** Parse finfindr://creator or https://finfindr.app/r referral payloads. */
export function parseCreatorReferralPayload(
  raw: string,
): PendingCreatorAttribution | null {
  const trimmed = raw.trim();
  if (!trimmed.includes('://')) return null;
  try {
    const parsed = new URL(trimmed);
    const code = parsed.searchParams.get('code')?.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const clickRaw = parsed.searchParams.get('click') ??
      parsed.searchParams.get('referral_click_token');
    const referralClickToken = clickRaw?.trim() ?? '';
    if (!code || !referralClickToken || !isUuid(referralClickToken)) {
      return null;
    }

    const scheme = parsed.protocol.replace(':', '').toLowerCase();
    const host = parsed.hostname.toLowerCase();
    const isAppCreator = scheme === 'finfindr' &&
      parsed.host.toLowerCase().includes('creator');
    const isWebReferral = host === 'finfindr.app' &&
      (parsed.pathname === '/r' || parsed.pathname.startsWith('/r/'));

    if (!isAppCreator && !isWebReferral) return null;
    return { code, referralClickToken };
  } catch {
    return null;
  }
}

async function callCreatorReferralResolve(
  body: Record<string, unknown>,
): Promise<CreatorReferralResolveResult> {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/creator-referral-resolve`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify(body),
      },
    );
    const parsed = (await response.json()) as CreatorReferralResolveResult;
    return parsed?.ok ? parsed : { ok: false, error: parsed?.error ?? `HTTP ${response.status}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Resolve failed';
    return { ok: false, error: message };
  }
}

/** Tell the server the app opened for this referral click (idempotent). */
export async function recordCreatorReferralAppOpen(
  input: PendingCreatorAttribution,
  matchMethod: ReferralAppOpenMatchMethod,
  options?: { clipboard_payload?: string },
): Promise<boolean> {
  const code = input.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const referralClickToken = input.referralClickToken?.trim();
  if (!code || !referralClickToken) return false;

  const body: Record<string, unknown> = {
    match_method: matchMethod,
    referral_click_token: referralClickToken,
    code,
  };
  if (options?.clipboard_payload) {
    body.clipboard_payload = options.clipboard_payload;
  }

  const result = await callCreatorReferralResolve(body);
  return result.ok;
}

/**
 * Recover a creator referral after App Store install (network fingerprint, then clipboard).
 * Persists click token in AsyncStorage so sign-up later still attributes.
 */
export async function resolveDeferredCreatorReferral(): Promise<boolean> {
  const existing = await getPendingCreatorAttribution();
  if (existing?.referralClickToken?.trim()) {
    await recordCreatorReferralAppOpen(existing, 'deep_link');
    return true;
  }

  const fingerprintResult = await callCreatorReferralResolve({
    match_method: 'fingerprint',
  });
  if (fingerprintResult.ok && fingerprintResult.code && fingerprintResult.click_token) {
    await storeCreatorReferralPendingOnly({
      code: fingerprintResult.code,
      referralClickToken: fingerprintResult.click_token,
    }, 'fingerprint');
    return true;
  }

  try {
    const clipboardText = await getOptionalClipboardString();
    const clipboardReferral = clipboardText
      ? parseCreatorReferralPayload(clipboardText)
      : null;
    if (clipboardReferral) {
      const result = await callCreatorReferralResolve({
        match_method: 'clipboard',
        clipboard_payload: clipboardText,
        code: clipboardReferral.code,
        referral_click_token: clipboardReferral.referralClickToken,
      });
      if (result.ok && result.code && result.click_token) {
        await storeCreatorReferralPendingOnly({
          code: result.code,
          referralClickToken: result.click_token,
        }, 'clipboard');
        return true;
      }
    }
  } catch {
    // Clipboard may be denied or empty on first launch.
  }

  return false;
}

/**
 * Match install → click if needed, then persist creator attribution for this account.
 * Safe to call after onboarding or before subscribe.
 */
export async function syncCreatorReferralAttribution(
  accessToken: string | null,
): Promise<CreatorAttributionResult | null> {
  if (!accessToken) return null;

  await trackInstallyInstall();
  await resolveDeferredCreatorReferral();
  await promotePendingReferralToActiveSession();

  const installyPending = await getPendingInstallyAttribution();
  const pending = await getPendingCreatorAttribution();
  const session = await readCreatorLinkSession();

  const code = session?.code ?? pending?.code ?? '';
  const referralClickToken = session?.referralClickToken ?? pending?.referralClickToken;
  const installyClickId = installyPending?.matched
    ? installyPending.clickId
    : null;

  if (!referralClickToken?.trim() && !installyClickId?.trim()) {
    return null;
  }

  const result = await applyCreatorReferral(accessToken, {
    ...(code.trim() ? { code } : {}),
    referralClickToken,
    installyClickId,
  });

  if (result.ok) {
    await clearPendingInstallyAttribution();
  }

  return result;
}

export function parseCreatorDeepLink(url: string): PendingCreatorAttribution | null {
  const fromPayload = parseCreatorReferralPayload(url);
  if (fromPayload) return fromPayload;

  const lower = url.toLowerCase();
  if (!lower.startsWith('finfindr://') || !lower.includes('creator')) {
    return null;
  }

  const queryStart = url.indexOf('?');
  if (queryStart === -1) return null;

  const params = new URLSearchParams(url.slice(queryStart + 1));
  const code = params.get('code');
  const referralClickToken = params.get('click') ??
    params.get('referral_click_token');
  if (!code?.trim() || !referralClickToken?.trim()) return null;

  return {
    code,
    referralClickToken: referralClickToken.trim(),
  };
}
