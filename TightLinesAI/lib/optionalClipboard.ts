import { requireOptionalNativeModule } from 'expo-modules-core';

type ExpoClipboardNative = {
  getStringAsync(): Promise<string>;
};

const nativeClipboard =
  requireOptionalNativeModule<ExpoClipboardNative>('ExpoClipboard');

/**
 * Reads clipboard text when the native ExpoClipboard module is present
 * (EAS/dev client build with expo-clipboard). Returns null otherwise so
 * older dev clients and first launch never crash on missing native code.
 */
export async function getOptionalClipboardString(): Promise<string | null> {
  if (!nativeClipboard?.getStringAsync) {
    return null;
  }
  try {
    const value = await nativeClipboard.getStringAsync();
    return typeof value === 'string' && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

export function isClipboardNativeModuleAvailable(): boolean {
  return Boolean(nativeClipboard?.getStringAsync);
}
