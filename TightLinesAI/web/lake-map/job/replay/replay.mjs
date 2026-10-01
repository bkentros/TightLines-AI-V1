#!/usr/bin/env node
/**
 * Replays the cold-water surge / warm-water push rule (src/engine/signals.js)
 * on real buoy seasons (job/replay/series.py output) to see how often it fires
 * and how sensitive it is to its thresholds.
 *   node job/replay/replay.mjs seasons.json > replay.json
 */
import fs from 'node:fs';
import { detectEvents, SURGE_RULE } from '../../src/engine/signals.js';

const BASE = { ...SURGE_RULE };
export const VARIANTS = {
  'current (10°F/24h or 8°F/12h, ends ≤60°F, holds 6 h)': {},
  'looser: 8°F/24h or 6°F/12h': { change24F: 8, change12F: 6 },
  'stricter: 12°F/24h or 10°F/12h': { change24F: 12, change12F: 10 },
  'no ≤60°F end rule': { endF: 999 },
  'hold 3 h instead of 6': { holdHours: 3 },
  'hold 12 h instead of 6': { holdHours: 12 },
  'raw swings (no end or hold rule)': { endF: 999, holdHours: 0 },
};

/** Split at gaps > 3 h; fill shorter gaps with straight lines. */
export function segments(values) {
  const out = []; let cur = [], gap = [];
  const flush = () => { if (cur.length >= 48) out.push(cur); cur = []; };
  for (let h = 0; h < values.length; h++) {
    const v = values[h];
    if (v == null) { gap.push(h); if (gap.length > 3) { flush(); gap = []; } continue; }
    if (gap.length && cur.length) { const a = cur[cur.length - 1].v; gap.forEach((g, k) => cur.push({ h: g, v: a + (v - a) * (k + 1) / (gap.length + 1) })); }
    gap = []; cur.push({ h, v });
  }
  flush();
  return out;
}

export function replay(seasons, overrides = {}) {
  Object.assign(SURGE_RULE, BASE, overrides);
  const events = [];
  for (const [key, s] of Object.entries(seasons)) {
    const t0 = Date.parse(s.start);
    for (const seg of segments(s.values)) {
      for (const e of detectEvents(seg.map((x) => x.v))) {
        const h0 = seg[0].h;
        const bottomF = e.endF, after = seg.slice(e.bottomHour).map((x) => x.v);
        // how long the water stayed within 3 °F of the extreme
        let held = 0; while (held < after.length && Math.abs(after[held] - bottomF) <= 3) held++;
        events.push({ key, station: key.slice(0, 5), year: +key.slice(6), kind: e.kind, start: new Date(t0 + (h0 + e.startHour) * 3600e3).toISOString(),
          hoursToExtreme: e.bottomHour - e.startHour, startF: e.startF, endF: e.endF, sizeF: e.sizeF, strong: e.strong, heldHours: held });
      }
    }
  }
  Object.assign(SURGE_RULE, BASE);
  return events;
}

if (process.argv[1] && process.argv[1].endsWith('replay.mjs')) {
  const seasons = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const out = {};
  for (const [name, o] of Object.entries(VARIANTS)) out[name] = replay(seasons, o);
  process.stdout.write(JSON.stringify({ seasons: Object.keys(seasons).length, variants: out }));
}
