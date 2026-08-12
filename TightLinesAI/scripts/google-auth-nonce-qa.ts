/**
 * Static regression guard for the native Google -> Supabase nonce handoff.
 * Run with: npx tsx scripts/google-auth-nonce-qa.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const googleAuth = fs.readFileSync(path.join(root, 'lib/googleAuth.ts'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'lib/auth.ts'), 'utf8');
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
if (!auth.includes("provider: 'google'") || !auth.includes('nonce,')) {
  failures.push('Supabase Google token exchange does not receive the nonce');
}

for (const { file, source } of screens) {
  if (!source.includes('await prepareGoogleSignIn()')) {
    failures.push(`${file} does not prepare a nonce before native sign-in`);
  }
  if (!source.includes('consumeGoogleSignInNonce()')) {
    failures.push(`${file} does not consume the matching nonce`);
  }
  if (!source.includes('clearGoogleSignInNonce()')) {
    failures.push(`${file} does not clear abandoned nonce state`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log('PASS Google native sign-in and Supabase share a single-use nonce.');
