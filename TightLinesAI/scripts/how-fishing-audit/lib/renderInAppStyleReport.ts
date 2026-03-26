/**
 * Renders an E2E audit row as plain text structured like RebuildReportView
 * (components/fishing/RebuildReportView.tsx) — what the user sees in-app.
 */

const PERIOD_DEFS: { label: string; subLabel: string }[] = [
  { label: "Dawn", subLabel: "5–7am" },
  { label: "Morning", subLabel: "7–11am" },
  { label: "Afternoon", subLabel: "11–5pm" },
  { label: "Evening", subLabel: "5–9pm" },
];

const PERIOD_PRESETS: Record<string, boolean[]> = {
  early_late_low_light: [true, false, false, true],
  warmest_part_may_help: [false, false, true, false],
  cooler_low_light_better: [true, true, false, true],
  moving_water_periods: [true, true, true, true],
};

function displayScore(score: number): string {
  const v = Math.round(score) / 10;
  return Number.isInteger(v) ? v.toFixed(0) : v.toFixed(1);
}

function contextTitle(context: string): string {
  if (context === "freshwater_lake_pond") return "Freshwater Lake/Pond";
  if (context === "freshwater_river") return "Freshwater River";
  if (context === "coastal") return "Coastal Inshore";
  if (context === "coastal_flats_estuary") return "Flats & Estuary";
  return context;
}

type ReportLike = {
  band: string;
  score: number;
  summary_line: string;
  actionable_tip: string;
  drivers: Array<{ label: string }>;
  suppressors: Array<{ label: string }>;
  daypart_note?: string | null;
  daypart_preset?: string | null;
  highlighted_periods?: boolean[];
  reliability: string;
  reliability_note?: string | null;
};

function getTimingHighlights(report: ReportLike): boolean[] | null {
  const hp = report.highlighted_periods;
  if (hp && hp.length === 4) {
    if (hp.every((p) => !p)) return null;
    return hp;
  }
  const preset = report.daypart_preset;
  if (!preset || preset === "no_timing_edge") return null;
  const flags = PERIOD_PRESETS[preset];
  if (!flags) return null;
  return flags;
}

/** HH:mm 24h → "9:15am" style (matches RebuildReportView.parseSolunarTime for plain HH:mm) */
function formatHm(t: string): string {
  const hmMatch = t.match(/^(\d{1,2}):(\d{2})/);
  if (!hmMatch) return t;
  const h = parseInt(hmMatch[1]!, 10);
  const m = parseInt(hmMatch[2]!, 10);
  const period = h < 12 ? "am" : "pm";
  const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${dh}:${String(m).padStart(2, "0")}${period}`;
}

function formatSolunarRange(start: string, end: string): string {
  return `${formatHm(start)} – ${formatHm(end)}`;
}

export type InAppStyleReportInput = {
  scenario: {
    id: string;
    location_name?: string | null;
    latitude: number;
    longitude: number;
    local_date: string;
    local_timezone: string;
    context: string;
    region_key?: string | null;
  };
  report: ReportLike;
  env_data: Record<string, unknown>;
  audit?: {
    pass: boolean;
    worst_severity: string;
    failure_mode_summary?: string;
    n_flags?: number;
  };
};

/**
 * Markdown block mirroring on-screen cards (RebuildReportView order).
 */
export function renderInAppStyleReport(input: InAppStyleReportInput): string {
  const { scenario, report, env_data, audit } = input;
  const loc =
    (scenario.location_name && String(scenario.location_name).trim()) ||
    `${scenario.latitude.toFixed(2)}, ${scenario.longitude.toFixed(2)}`;

  const lines: string[] = [];

  lines.push(`## How's Fishing`);
  lines.push("");
  lines.push(`**Location:** ${loc}`);
  lines.push(`**Date:** ${scenario.local_date} (${scenario.local_timezone})`);
  lines.push(`**Context:** ${contextTitle(scenario.context)}`);
  if (scenario.region_key) lines.push(`**Region:** ${scenario.region_key}`);
  lines.push(`_Audit scenario: \`${scenario.id}\`_`);
  lines.push("");

  // Card 1 — Score + summary
  lines.push(`### ${report.band} · ${displayScore(report.score)}/10`);
  lines.push("_Today's Fishing Outlook_");
  lines.push("");
  lines.push(report.summary_line.trim());
  lines.push("");

  // Card 2 — Top reasons
  lines.push("### Top Reasons");
  lines.push("");
  const drivers = report.drivers.slice(0, 3);
  const sups = report.suppressors.slice(0, 2);
  if (drivers.length > 0) {
    drivers.forEach((d, i) => {
      lines.push(`${i + 1}. ${d.label}`);
    });
  } else {
    lines.push("_No strong positive factors today._");
  }
  if (sups.length > 0) {
    lines.push("");
    lines.push("_Limiting factors_");
    sups.forEach((s) => {
      lines.push(`- ${s.label}`);
    });
  }
  lines.push("");

  // Card 3 — Best timing
  const hp = getTimingHighlights(report);
  const showTiming = !!(report.daypart_note?.trim() || hp);
  if (showTiming) {
    lines.push("### Best Timing");
    lines.push("");
    if (hp) {
      PERIOD_DEFS.forEach((def, i) => {
        const on = hp[i] ? " **highlight**" : "";
        lines.push(`- **${def.label}** (${def.subLabel})${on}`);
      });
      lines.push("");
    }
    if (report.daypart_note?.trim()) {
      lines.push(report.daypart_note.trim());
      lines.push("");
    }
  }

  // Card 4 — Solunar (same visibility rule as RebuildReportView)
  const sol = env_data.solunar as
    | {
      major_periods?: Array<{ start: string; end: string; type?: string }>;
      minor_periods?: Array<{ start: string; end: string }>;
    }
    | undefined;
  const majors = sol?.major_periods ?? [];
  const minors = sol?.minor_periods ?? [];
  if (majors.length > 0 || minors.length > 0) {
    lines.push("### Solunar Windows _(Bonus)_");
    lines.push("");
    if (majors.length > 0) {
      lines.push("_STRONG_");
      for (const p of majors) {
        const arrow = p.type === "overhead" ? " ↑" : p.type === "underfoot" ? " ↓" : "";
        lines.push(`- ${formatSolunarRange(p.start, p.end)}${arrow}`);
      }
      lines.push("");
    }
    if (minors.length > 0) {
      lines.push("_MINOR_");
      for (const p of minors) {
        lines.push(`- ${formatSolunarRange(p.start, p.end)}`);
      }
      lines.push("");
    }
  }

  // Card 5 — Tip
  lines.push("### Tip of the Day");
  lines.push("");
  lines.push(report.actionable_tip.trim());
  lines.push("");

  // Card 6 — Confidence (low/medium only)
  if (report.reliability !== "high" && report.reliability_note?.trim()) {
    const tier = report.reliability === "medium" ? "Medium" : "Low";
    lines.push(`### Confidence · ${tier}`);
    lines.push("");
    lines.push(report.reliability_note.trim());
    lines.push("");
  }

  if (audit) {
    lines.push("---");
    lines.push(
      `_Automated checks (not shown in app): **${audit.pass ? "PASS" : "FAIL"}** · worst: ${audit.worst_severity}` +
        (audit.n_flags != null ? ` · flags: ${audit.n_flags}` : "") + "_",
    );
    if (audit.failure_mode_summary?.trim()) {
      lines.push(`_${audit.failure_mode_summary.trim()}_`);
    }
  }

  return lines.join("\n");
}
