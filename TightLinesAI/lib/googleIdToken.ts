const BASE64URL_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** Read the ASCII nonce claim without relying on browser-only `atob`. */
export function readGoogleIdTokenNonce(idToken: string): string | null {
  const payload = idToken.split('.')[1];
  if (!payload) return null;

  let decoded = '';
  let queue = 0;
  let queuedBits = 0;

  for (const char of payload) {
    const value = BASE64URL_ALPHABET.indexOf(char);
    if (value < 0) return null;
    queue = (queue << 6) | value;
    queuedBits += 6;
    while (queuedBits >= 8) {
      queuedBits -= 8;
      decoded += String.fromCharCode((queue >> queuedBits) & 0xff);
    }
  }

  const match = decoded.match(/"nonce"\s*:\s*"([^"\\]+)"/);
  return match?.[1] ?? null;
}
