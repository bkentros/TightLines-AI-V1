/**
 * Live Lake Map passes: short-lived signed tickets that let the FinFindr app
 * open the map. The gatekeeper Worker in front of the map storage
 * (web/lake-map/gate/worker.js) checks them with the same shared secret
 * (PIER_CAST_MAP_PASS_SECRET here, MAP_PASS_SECRET in the Worker).
 *
 * Format: v1.<expiry unix seconds>.<random nonce>.<HMAC-SHA256 signature>, all base64url.
 * Plain Web Crypto, so it runs in Supabase Edge Functions, Workers and Node tests.
 */
export const PIER_CAST_MAP_PASS_TTL_SECONDS = 2 * 60 * 60;

function base64url(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64url(new Uint8Array(signature));
}

export async function createPierCastMapPass(
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  ttlSeconds = PIER_CAST_MAP_PASS_TTL_SECONDS,
): Promise<{ pass: string; expiresAt: string }> {
  if (!secret || secret.length < 32) throw new Error("Map pass secret is not configured.");
  const expiry = nowSeconds + ttlSeconds;
  const nonce = base64url(crypto.getRandomValues(new Uint8Array(12)));
  const payload = `v1.${expiry}.${nonce}`;
  return {
    pass: `${payload}.${await sign(secret, payload)}`,
    expiresAt: new Date(expiry * 1000).toISOString(),
  };
}
