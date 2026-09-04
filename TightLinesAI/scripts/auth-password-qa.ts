import assert from 'node:assert/strict';

import {
  getPasswordValidationError,
  isCompromisedPasswordError,
  isPasswordValid,
} from '../lib/passwordValidation';
import { isRefreshTokenRevokedError } from '../lib/authSessionErrors';

assert.equal(getPasswordValidationError('short1'), 'Password must be at least 10 characters.');
assert.equal(getPasswordValidationError('1234567890'), 'Password must include at least one letter.');
assert.equal(getPasswordValidationError('abcdefghij'), 'Password must include at least one number.');
assert.equal(isPasswordValid('unique-pass9'), true);

assert.equal(isCompromisedPasswordError({ code: 'weak_password' }), true);
assert.equal(isCompromisedPasswordError(new Error('Password is known to be weak')), true);
assert.equal(
  isCompromisedPasswordError(new Error('Password was found in a data breach')),
  true,
);
assert.equal(isCompromisedPasswordError(new Error('Email rate limit exceeded')), false);

assert.equal(isRefreshTokenRevokedError(new Error('Invalid Refresh Token')), true);
assert.equal(isRefreshTokenRevokedError({ message: 'Session not found' }), true);
assert.equal(
  isRefreshTokenRevokedError(new Error('User from sub claim in JWT does not exist')),
  true,
);
assert.equal(isRefreshTokenRevokedError(new Error('Network request failed')), false);

console.log('Auth password and stale-session QA passed.');
