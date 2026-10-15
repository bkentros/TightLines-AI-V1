import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { readoutDisplay } from '../src/engine/readout.js';
import { SPECIES } from '../src/engine/scales.js';
import { TEMP_DEPTHS_FT } from '../src/engine/tempDepth.js';

const units = { temp: 'F', wind: 'mph', length: 'ft' };
const valid = {
  temp: 62.4,
  tempReady: true,
  wind: 15,
  windFrom: 0,
  waves: 1.8,
  depth: 200,
  depthNear: 200,
  tempDepth: 55,
  tempDepthReady: true,
  onWater: true,
  harbor: false,
  outsideCoverage: false,
};

function display(layer, sample, depthFt = 30) {
  return readoutDisplay({ layer, sample: { ...valid, ...sample }, units, depthFt, species: SPECIES[0] });
}

function assertClean(output, reason) {
  assert.equal(output.val, '—');
  assert.equal(output.unit, '');
  assert.match(output.sub, reason);
  for (const value of Object.values(output)) {
    assert.equal(typeof value, 'string');
    assert.doesNotMatch(value, /NaN|undefined|null/i);
  }
}

test('surface readout distinguishes loading, masks, land and outside coverage', () => {
  assertClean(display('temp', { temp: NaN, tempReady: false }), /Loading surface temperature/);
  assertClean(display('temp', { temp: NaN, tempReady: true }), /No surface temperature here/);
  assertClean(display('temp', { temp: NaN, onWater: false, kind: 'land' }), /over land/);
  assertClean(display('temp', { temp: NaN, onWater: false, outsideCoverage: true }), /outside model coverage/);
  assertClean(display('species', { temp: NaN, tempReady: true }), /No surface temperature here/);
});

test('every launch depth handles loading, bottom masks, other masks, land and outside coverage', () => {
  for (const depthFt of TEMP_DEPTHS_FT) {
    assertClean(display('temp_depth', { tempDepth: NaN, tempDepthReady: false }, depthFt), /Loading depth temperature/);
    assertClean(display('temp_depth', { tempDepth: NaN, depthNear: depthFt - 1 }, depthFt), /below the bottom/);
    assertClean(display('temp_depth', { tempDepth: NaN, depthNear: depthFt + 20 }, depthFt), /No depth temperature here/);
    assertClean(display('temp_depth', { tempDepth: NaN, onWater: false }, depthFt), /over land/);
    assertClean(display('temp_depth', { tempDepth: NaN, onWater: false, outsideCoverage: true }, depthFt), /outside model coverage/);
  }
});

test('valid surface and depth values remain formatted without unsafe text', () => {
  for (const [layer, sample] of [
    ['temp', {}],
    ['temp_depth', {}],
    ['wind', {}],
    ['waves', {}],
    ['depth', {}],
    ['species', {}],
  ]) {
    const output = display(layer, sample);
    for (const value of Object.values(output)) assert.doesNotMatch(value, /NaN|undefined|null/i);
  }
});

test('the live sample exposes surface readiness and the page uses the safe formatter', () => {
  const engine = readFileSync(new URL('../src/engine/index.js', import.meta.url), 'utf8');
  const page = readFileSync(new URL('../src/prototype.js', import.meta.url), 'utf8');
  assert.match(engine, /tempReady: store\.isLoaded\('temp', t\)/);
  assert.match(engine, /outsideCoverage: !inModelDomain/);
  assert.match(page, /readoutDisplay\(\{ layer: ui\.layer, sample: s/);
  assert.doesNotMatch(page, /toTemp\(s\.temp, u\.temp\)\.toFixed/);
});
