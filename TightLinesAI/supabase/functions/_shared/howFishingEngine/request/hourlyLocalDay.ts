/**
 * Map UTC-timestamped hourly samples into a 24-length array for one local calendar day.
 * Index 0 = local midnight, index 23 = 11pm — matches timing engine convention.
 */

const MIN_VALID_HOURS = 12;

export function utcIsoToLocalDateHour(iso: string, timeZone: string): { ymd: string; hour: number } | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    hour12: false,
  }).formatToParts(d);
  const hp = parts.find((p) => p.type === "hour");
  const hour = hp ? parseInt(hp.value, 10) : 0;
  return { ymd, hour: hour % 24 };
}

function fillHourGaps(raw: (number | null)[]): number[] {
  const out: (number | null)[] = raw.slice();
  const first = out.findIndex((x) => x != null && Number.isFinite(x));
  let last = -1;
  for (let i = 23; i >= 0; i--) {
    if (out[i] != null && Number.isFinite(out[i]!)) {
      last = i;
      break;
    }
  }
  if (first < 0 || last < 0) return new Array(24).fill(0);
  const leftVal = out[first]!;
  const rightVal = out[last]!;
  for (let i = 0; i < first; i++) out[i] = leftVal;
  for (let i = last + 1; i < 24; i++) out[i] = rightVal;
  for (let i = first; i <= last; i++) {
    if (out[i] != null && Number.isFinite(out[i]!)) continue;
    let j = i + 1;
    while (j <= last && (out[j] == null || !Number.isFinite(out[j]!))) j++;
    const v0 = out[i - 1]!;
    const v1 = j <= last ? out[j]! : v0;
    const span = j - (i - 1);
    for (let k = i; k < j; k++) {
      const t = (k - (i - 1)) / span;
      out[k] = v0 + (v1 - v0) * t;
    }
  }
  return out.map((x) => x ?? 0);
}

export function hourlyPointsTo24ArrayForLocalDate(
  points: Array<{ time_utc: string; value: number }>,
  localDate: string,
  timeZone: string,
): number[] | null {
  if (!points.length || !localDate || !timeZone) return null;
  const raw: (number | null)[] = new Array(24).fill(null);
  for (const p of points) {
    const lh = utcIsoToLocalDateHour(p.time_utc, timeZone);
    if (!lh || lh.ymd !== localDate) continue;
    if (lh.hour >= 0 && lh.hour < 24 && Number.isFinite(p.value)) raw[lh.hour] = p.value;
  }
  let valid = 0;
  for (const x of raw) {
    if (x != null && Number.isFinite(x)) valid++;
  }
  if (valid < MIN_VALID_HOURS) return null;
  return fillHourGaps(raw);
}
