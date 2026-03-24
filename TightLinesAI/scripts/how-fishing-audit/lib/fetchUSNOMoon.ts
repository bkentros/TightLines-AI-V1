/**
 * Fetches moon rise/set/transit data from the USNO API for a past date,
 * then computes solunar periods. Logic copied from get-environment/index.ts.
 */

// ── Helpers (copied from get-environment/index.ts) ───────────────────────────

function addMinsToHHMM(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  if (h === undefined || m === undefined || isNaN(h) || isNaN(m)) return "—";
  const totalMins = h * 60 + m + minutes;
  const wrapped = ((totalMins % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function derivePhaseFromIllumination(frac: number): string {
  if (frac <= 0.05) return "New Moon";
  if (frac <= 0.4) return "Crescent";
  if (frac <= 0.6) return "Quarter";
  if (frac <= 0.9) return "Gibbous";
  return "Full Moon";
}

function getSolunarHalfWindow(
  moonPhase: string | null,
  periodType: "major" | "minor",
): number {
  const phase = (moonPhase ?? "").toLowerCase();
  if (phase.includes("new") || phase.includes("full")) {
    return periodType === "major" ? 75 : 45;
  }
  if (phase.includes("gibbous")) {
    return periodType === "major" ? 65 : 35;
  }
  if (phase.includes("quarter")) {
    return periodType === "major" ? 50 : 28;
  }
  if (phase.includes("crescent")) {
    return periodType === "major" ? 35 : 20;
  }
  return periodType === "major" ? 60 : 30;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface SolunarPeriod {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
  type?: "overhead" | "underfoot";
}

export interface USNOMoonResult {
  raw: unknown; // Full API response
  rise: string | null;
  set: string | null;
  upper_transit: string | null;
  lower_transit: string | null;
  phase: string;
  illumination: number;
  sun_rise: string | null;
  sun_set: string | null;
  solunar: {
    major_periods: SolunarPeriod[];
    minor_periods: SolunarPeriod[];
  };
}

// ── Main fetch ───────────────────────────────────────────────────────────────

export async function fetchUSNOMoon(
  lat: number,
  lon: number,
  date: string,         // YYYY-MM-DD
  tzOffsetHours: number, // numeric offset for USNO tz= param
): Promise<USNOMoonResult | null> {
  // Round to nearest 0.5 to avoid USNO rejecting fractional tz values
  const tz = Math.round(tzOffsetHours * 2) / 2;
  const coords = `${lat},${lon}`;
  const url = `https://aa.usno.navy.mil/api/rstt/oneday?date=${date}&coords=${coords}&tz=${tz}`;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.properties?.data ?? json ?? {};
    const moondata: { phen?: string; time?: string }[] = data?.moondata ?? [];
    const sundata: { phen?: string; time?: string }[] = data?.sundata ?? [];

    let rise: string | null = null;
    let set: string | null = null;
    let upperTransit: string | null = null;

    for (const m of moondata) {
      const phen = String(m?.phen ?? "").toLowerCase();
      const t = m?.time ?? "";
      if (phen === "rise") rise = t;
      else if (phen === "set") set = t;
      else if (phen.includes("upper transit")) upperTransit = t;
    }

    let sunRise: string | null = null;
    let sunSet: string | null = null;
    for (const s of sundata) {
      const phen = String(s?.phen ?? "").toLowerCase();
      const t = s?.time ?? "";
      if (phen === "rise") sunRise = t;
      else if (phen === "set") sunSet = t;
    }

    let phase = data?.curphase ?? data?.phase ?? null;
    let frac = data?.frac;
    if (frac == null && data?.fracillum != null) {
      const str = String(data.fracillum).replace("%", "");
      frac = parseFloat(str) / 100;
    }
    const illumination =
      typeof frac === "number" ? frac : parseFloat(String(frac ?? 0)) || 0;

    if (!phase || String(phase).toLowerCase() === "unknown") {
      phase = derivePhaseFromIllumination(illumination);
    }

    const lowerTransit = upperTransit ? addMinsToHHMM(upperTransit, 12 * 60) : null;

    const phaseStr = String(phase);
    const majorHalf = getSolunarHalfWindow(phaseStr, "major");
    const minorHalf = getSolunarHalfWindow(phaseStr, "minor");

    const major: SolunarPeriod[] = [];
    const minor: SolunarPeriod[] = [];

    const addPeriod = (
      timeStr: string | null,
      halfMins: number,
      type?: "overhead" | "underfoot",
    ) => {
      if (!timeStr || !timeStr.includes(":")) return;
      const start = addMinsToHHMM(timeStr, -halfMins);
      const end = addMinsToHHMM(timeStr, halfMins);
      if (type) major.push({ start, end, type });
      else minor.push({ start, end });
    };

    addPeriod(upperTransit, majorHalf, "overhead");
    addPeriod(lowerTransit, majorHalf, "underfoot");
    addPeriod(rise, minorHalf);
    addPeriod(set, minorHalf);

    return {
      raw: json,
      rise,
      set,
      upper_transit: upperTransit,
      lower_transit: lowerTransit,
      phase: phaseStr,
      illumination,
      sun_rise: sunRise,
      sun_set: sunSet,
      solunar: { major_periods: major, minor_periods: minor },
    };
  } catch {
    return null;
  }
}
