#!/usr/bin/env node
/**
 * Cold-water surge / warm-water push events for every pier, using the same
 * rule the app uses (src/engine/signals.js).
 *   node job/events.mjs series.json events.json
 * series.json: { start, unit: 'F', piers: { cityId: [°F per hour | null] } }
 */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { detectEvents, SURGE_RULE } from '../src/engine/signals.js';

/** Fill short gaps (≤ 3 h) by straight lines; longer gaps end the usable series. */
export function cleanSeries(raw) {
  const s = raw.map((v) => (Number.isFinite(v) ? v : NaN));
  let end = s.length;
  for (let i = 0; i < s.length; i++) {
    if (Number.isFinite(s[i])) continue;
    let j = i; while (j < s.length && !Number.isFinite(s[j])) j++;
    if (i === 0 || j === s.length || j - i > 3) { end = i === 0 ? 0 : i; break; }
    for (let k = i; k < j; k++) s[k] = s[i - 1] + (s[j] - s[i - 1]) * (k - i + 1) / (j - i + 1);
    i = j - 1;
  }
  return s.slice(0, end);
}

export function buildEvents(series) {
  const events = [];
  for (const [cityId, raw] of Object.entries(series.piers)) {
    const s = cleanSeries(raw);
    if (s.length < 24) continue;
    for (const e of detectEvents(s)) events.push({ cityId, ...e });
  }
  events.sort((a, b) => a.startHour - b.startHour || a.cityId.localeCompare(b.cityId));
  return { rule: SURGE_RULE.version, start: series.start, events };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output] = process.argv.slice(2);
  const out = buildEvents(JSON.parse(fs.readFileSync(input, 'utf8')));
  fs.writeFileSync(output, JSON.stringify(out));
}
