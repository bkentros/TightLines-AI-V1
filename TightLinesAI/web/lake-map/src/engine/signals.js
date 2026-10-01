/**
 * Cold-water surge / warm-water push rule (piercast-surge-v1), shared by the
 * data job and the app so the map, the alert list and the city report agree.
 *
 * Input: hourly modeled surface temperature (°F) at a pier, index = hour.
 * An event needs a change of 10 °F within 24 h (or 8 °F within 12 h), must end
 * at 60 °F or cooler for a surge (60 °F or warmer for a push), and must hold
 * within 3 °F of its extreme for at least 6 hours. One event per 48 hours.
 */
export const SURGE_RULE = { version: 'piercast-surge-v1', change24F: 10, change12F: 8, endF: 60, holdHours: 6, holdToleranceF: 3, guardHours: 48, strongF: 15 };

export function detectEvents(s) {
  const out = [];
  for (const [kind, sign] of [['cold', -1], ['warm', 1]]) {
    let guard = -1;
    for (let i = 0; i < s.length; i++) {
      if (i < guard) continue;
      let hit = -1; for (let j = i + 1; j <= Math.min(s.length - 1, i + 24); j++) { const ch = (s[j] - s[i]) * sign; if (ch >= SURGE_RULE.change24F || (j - i <= 12 && ch >= SURGE_RULE.change12F)) { hit = j; break; } }
      if (hit < 0) continue;
      let begin = i; for (let b = i; b < hit; b++) if ((s[b] - s[i]) * sign < 1) begin = b;
      let ext = hit; for (let k = hit; k < s.length && k < hit + 36; k++) if ((s[k] - s[ext]) * sign > 0) ext = k;
      const endT = s[ext]; if (sign < 0 ? endT > SURGE_RULE.endF : endT < SURGE_RULE.endF) continue;
      let held = 0; for (let k = ext; k < s.length; k++) { if (Math.abs(s[k] - endT) <= SURGE_RULE.holdToleranceF) held++; else break; } if (held < SURGE_RULE.holdHours) continue;
      let settled = ext; for (let k = begin; k <= ext; k++) if (Math.abs(s[k] - s[begin]) >= 0.9 * Math.abs(endT - s[begin])) { settled = k; break; }
      out.push({ kind, startHour: begin, bottomHour: ext, settledHour: settled, startF: +s[begin].toFixed(1), endF: +endT.toFixed(1), sizeF: +Math.abs(endT - s[begin]).toFixed(1), strong: Math.abs(endT - s[begin]) >= SURGE_RULE.strongF });
      guard = ext + SURGE_RULE.guardHours;
    }
  }
  return out;
}


