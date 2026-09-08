// Run from the project: node scripts/recommender-artwork-qa.cjs
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const manifest = require('../docs/recommender-artwork/generation_manifest.json');
const audit = require('../docs/recommender-artwork/asset_audit.json');
assert.equal(audit.missing.length, 0, 'Finish generating the missing assets');
const checked = new Set(audit.assets.map(a => a.path));
const crypto = require('crypto');
for (const asset of audit.assets) {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, asset.path))).digest('hex'), asset.sha256, 'Regenerate bounds after changing ' + asset.path);
}
for (const name of ['lureImages', 'flyImages', 'waterclarityImages', 'recommendationGoalImages', 'watertypeImages']) {
  const text = fs.readFileSync(path.join(root, 'lib', name + '.ts'), 'utf8');
  for (const match of text.matchAll(/require\(['"]\.\.\/(assets\/images\/[^'"]+)['"]\)/g)) {
    assert(checked.has(match[1]), 'Unreviewed or missing bounds: ' + match[1]);
  }
}
const esbuild = require('esbuild');
const code = esbuild.transformSync(fs.readFileSync(path.join(root, 'lib/fitArtwork.ts'), 'utf8'), {loader:'ts', format:'cjs'}).code;
const m = {exports:{}}; new Function('module','exports',code)(m,m.exports);
let cases = 0;
for (const {path: asset, bounds} of audit.assets) {
  const [left, top, right, bottom] = bounds;
  assert(left >= 0 && top >= 0 && right <= 1 && bottom <= 1 && right > left && bottom > top, asset);
  for (const [width,height] of [[220,158],[290,158],[350,158],[76,76],[86,72],[78,78],[82,82],[92,92]]) {
    const frame = m.exports.fitArtwork(bounds, width, height);
    const edges = [frame.left + left*frame.width, frame.top + top*frame.height, frame.left + right*frame.width, frame.top + bottom*frame.height];
    assert(edges[0] >= width*.029 && edges[1] >= height*.029 && edges[2] <= width*.971 && edges[3] <= height*.971, 'Clipped subject: '+asset);
    assert(Math.abs(edges[0] - (width-edges[2])) < .001 && Math.abs(edges[1] - (height-edges[3])) < .001, 'Off-center subject: '+asset);
    assert.equal(frame.width,frame.height,'Distorted square source');
    cases++;
  }
}
console.log(`PASS: ${audit.assets.length} asset hashes and mappings; ${cases} centered, undistorted card-fit cases.`);
