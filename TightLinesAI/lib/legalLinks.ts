import { Linking, Platform } from 'react-native';

const DEFAULT_LEGAL_BASE_URL = 'https://finfindr.app';

function envUrl(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && /^https?:\/\//i.test(value) ? value : fallback;
}

export const LEGAL_URLS = {
  privacy: envUrl('EXPO_PUBLIC_PRIVACY_POLICY_URL', `${DEFAULT_LEGAL_BASE_URL}/privacy`),
  terms: envUrl('EXPO_PUBLIC_TERMS_URL', `${DEFAULT_LEGAL_BASE_URL}/terms`),
  safety: envUrl('EXPO_PUBLIC_SAFETY_NOTICE_URL', `${DEFAULT_LEGAL_BASE_URL}/safety`),
  support: envUrl('EXPO_PUBLIC_SUPPORT_URL', `${DEFAULT_LEGAL_BASE_URL}/support`),
};

export function storeSubscriptionManagementUrl(): string {
  if (Platform.OS === 'android') {
    return 'https://play.google.com/store/account/subscriptions';
  }
  return 'https://apps.apple.com/account/subscriptions';
}

export function storeSubscriptionManagementLabel(): string {
  if (Platform.OS === 'android') return 'Manage Play subscription';
  return 'Manage App Store subscription';
}

export async function openExternalUrl(url: string): Promise<void> {
  const canOpen = await Linking.canOpenURL(url).catch(() => true);
  if (!canOpen) {
    throw new Error('Device cannot open this link.');
  }
  await Linking.openURL(url);
}

export async function openStoreSubscriptionManagement(): Promise<void> {
  await openExternalUrl(storeSubscriptionManagementUrl());
}
