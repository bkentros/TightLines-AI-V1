/**
 * Static regression guard for the native Google -> Supabase nonce handoff.
 * Run with: npx tsx scripts/google-auth-nonce-qa.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const googleAuth = fs.readFileSync(path.join(root, 'lib/googleAuth.ts'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'lib/auth.ts'), 'utf8');
const googleButton = fs.readFileSync(
  path.join(root, 'components/auth/GoogleAuthButton.tsx'),
  'utf8',
);
const screens = [
  'app/(auth)/welcome.tsx',
  'app/(auth)/sign-in.tsx',
].map((file) => ({
  file,
  source: fs.readFileSync(path.join(root, file), 'utf8'),
}));

const failures: string[] = [];

if (!googleAuth.includes('Crypto.CryptoDigestAlgorithm.SHA256')) {
  failures.push('Google request nonce is not SHA-256 hashed');
}
if (!googleAuth.includes('pendingGoogleRawNonce = rawNonce')) {
  failures.push('Raw Google nonce is not retained for Supabase');
}
if (!googleAuth.includes('tokenNonce === doubleHashedNonce')) {
  failures.push('Google nonce handoff does not account for the iOS SDK hash');
}
if (!auth.includes("provider: 'google'") || !auth.includes('nonce,')) {
  failures.push('Supabase Google token exchange does not receive the nonce');
}

for (const { file, source } of screens) {
  if (!source.includes('<GoogleAuthButton')) {
    failures.push(`${file} does not use the shared Google sign-in control`);
  }
  if (!source.includes('consumeGoogleSignInNonce(result.idToken)')) {
    failures.push(`${file} does not consume the matching nonce`);
  }
}

const welcome = screens.find(({ file }) => file.endsWith('welcome.tsx'))?.source ?? '';
if (!welcome.includes('useAuthScrollLayout("form")')) {
  failures.push('Welcome layout can distribute oversized gaps on tall iPhones');
}
if (!welcome.includes('scrollEnabled={layoutTier === "compact" || notice != null}')) {
  failures.push('Welcome layout does not preserve compact/error scrolling fallback');
}

if (!googleButton.includes('await prepareGoogleSignIn()')) {
  failures.push('Google button does not prepare a nonce before native sign-in');
}
if (!googleButton.includes('clearGoogleSignInNonce()')) {
  failures.push('Google button does not clear abandoned nonce state');
}
if (!googleButton.includes("width: '100%'")) {
  failures.push('Google button is not a genuinely full-width control');
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log('PASS Google native sign-in and Supabase share a single-use nonce.');
