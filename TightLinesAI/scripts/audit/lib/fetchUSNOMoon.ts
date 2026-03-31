function addMinutesToHHMM(timeStr: string, minutes: number): string {
  const [hours, mins] = timeStr.split(":").map(Number);
  if (hours == null || mins == null || Number.isNaN(hours) || Number.isNaN(mins)) return "00:00";
  const totalMinutes = hours * 60 + mins + minutes;
  const wrapped = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function derivePhaseFromIllumination(fraction: number): string {
  if (fraction <= 0.05) return "New Moon";
  if (fraction <= 0.4) return "Crescent";
  if (fraction <= 0.6) return "Quarter";
  if (fraction <= 0.9) return "Gibbous";
  return "Full Moon";
}

function getSolunarHalfWindow(phase: string | null, periodType: "major" | "minor"): number {
  const normalized = (phase ?? "").toLowerCase();
  if (normalized.includes("new") || normalized.includes("full")) return periodType === "major" ? 75 : 45;
  if (normalized.includes("gibbous")) return periodType === "major" ? 65 : 35;
  if (normalized.includes("quarter")) return periodType === "major" ? 50 : 28;
  if (normalized.includes("crescent")) return periodType === "major" ? 35 : 20;
  return periodType === "major" ? 60 : 30;
}

export interface SolunarPeriod {
  start: string;
  end: string;
  type?: "overhead" | "underfoot";
}

export interface USNOMoonResult {
  raw: unknown;
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

export async function fetchUSNOMoon(
  latitude: number,
  longitude: number,
  date: string,
  tzOffsetHours: number,
): Promise<USNOMoonResult | null> {
  const tz = Math.round(tzOffsetHours * 2) / 2;
  const coords = `${latitude},${longitude}`;
  const url = `https://aa.usno.navy.mil/api/rstt/oneday?date=${date}&coords=${coords}&tz=${tz}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const json = await response.json();
    const data = json?.properties?.data ?? json ?? {};
    const moondata: Array<{ phen?: string; time?: string }> = data?.moondata ?? [];
    const sundata: Array<{ phen?: string; time?: string }> = data?.sundata ?? [];

    let rise: string | null = null;
    let set: string | null = null;
    let upperTransit: string | null = null;

    for (const item of moondata) {
      const phase = String(item?.phen ?? "").toLowerCase();
      const time = item?.time ?? "";
      if (phase === "rise") rise = time;
      else if (phase === "set") set = time;
      else if (phase.includes("upper transit")) upperTransit = time;
    }

    let sunRise: string | null = null;
    let sunSet: string | null = null;
    for (const item of sundata) {
      const phase = String(item?.phen ?? "").toLowerCase();
      const time = item?.time ?? "";
      if (phase === "rise") sunRise = time;
      else if (phase === "set") sunSet = time;
    }

    let phase = data?.curphase ?? data?.phase ?? null;
    let fraction = data?.frac;
    if (fraction == null && data?.fracillum != null) {
      fraction = Number.parseFloat(String(data.fracillum).replace("%", "")) / 100;
    }
    const illumination = typeof fraction === "number"
      ? fraction
      : Number.parseFloat(String(fraction ?? 0)) || 0;

    if (!phase || String(phase).toLowerCase() === "unknown") {
      phase = derivePhaseFromIllumination(illumination);
    }

    const lowerTransit = upperTransit ? addMinutesToHHMM(upperTransit, 12 * 60) : null;
    const phaseString = String(phase);
    const majorHalfWindow = getSolunarHalfWindow(phaseString, "major");
    const minorHalfWindow = getSolunarHalfWindow(phaseString, "minor");

    const majorPeriods: SolunarPeriod[] = [];
    const minorPeriods: SolunarPeriod[] = [];

    const addPeriod = (
      timeStr: string | null,
      halfWindowMinutes: number,
      type?: "overhead" | "underfoot",
    ) => {
      if (!timeStr || !timeStr.includes(":")) return;
      const start = addMinutesToHHMM(timeStr, -halfWindowMinutes);
      const end = addMinutesToHHMM(timeStr, halfWindowMinutes);
      if (type) {
        majorPeriods.push({ start, end, type });
        return;
      }
      minorPeriods.push({ start, end });
    };

    addPeriod(upperTransit, majorHalfWindow, "overhead");
    addPeriod(lowerTransit, majorHalfWindow, "underfoot");
    addPeriod(rise, minorHalfWindow);
    addPeriod(set, minorHalfWindow);

    return {
      raw: json,
      rise,
      set,
      upper_transit: upperTransit,
      lower_transit: lowerTransit,
      phase: phaseString,
      illumination,
      sun_rise: sunRise,
      sun_set: sunSet,
      solunar: {
        major_periods: majorPeriods,
        minor_periods: minorPeriods,
      },
    };
  } catch {
    return null;
  }
}
