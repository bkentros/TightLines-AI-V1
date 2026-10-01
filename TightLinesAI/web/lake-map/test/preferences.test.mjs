import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  DEFAULT_MAP_LAYER,
  MAP_LAYERS,
  resolveInitialMapLayer,
} from '../src/engine/preferences.js';

const pageShell = readFileSync(new URL('../src/prototype.js', import.meta.url), 'utf8');

test('a first-ever map visit starts on temperature', () => {
  assert.equal(DEFAULT_MAP_LAYER, 'temp');
  assert.equal(resolveInitialMapLayer(undefined), 'temp');
  assert.equal(resolveInitialMapLayer(null), 'temp');
});

test('later visits restore whichever valid layer was left selected', () => {
  for (const layer of MAP_LAYERS) {
    assert.equal(resolveInitialMapLayer(layer), layer);
  }
});

test('bad or obsolete saved layers fall back to temperature', () => {
  assert.equal(resolveInitialMapLayer('fish'), 'temp');
  assert.equal(resolveInitialMapLayer({}), 'temp');
});

test('a routed species does not override the initial or saved layer', () => {
  assert.doesNotMatch(pageShell, /speciesFromRoute/);
  assert.match(pageShell, /if \(routed\) ui\.species = routed/);
});
