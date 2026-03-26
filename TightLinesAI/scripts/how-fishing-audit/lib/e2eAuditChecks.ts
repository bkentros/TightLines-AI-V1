/**
 * Automated flags for How's Fishing E2E audit (LLM + engine + env).
 */

import type { HowsFishingReport } from "../../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { TipFocusLane } from "../../../supabase/functions/_shared/howFishingPolish/mod.ts";
import { buildWeatherSnapshot } from "../../../supabase/functions/_shared/howFishingPolish/mod.ts";
import { compositeScoreActivityTier } from "../../../supabase/functions/_shared/howFishingEngine/index.ts";

export type AuditSeverity = "blocker" | "major" | "minor" | "info";

export type AuditFlag = {
  code: string;
  severity: AuditSeverity;
  detail: string;
};

const BANNED_PHRASES = [
  "sweet spot", "lining up", "dial it in", "dialing in", "game plan",
  "get after it", "don't sleep on", "worth noting", "that said",
  "at the end of the day", "this time of year", "erratic",
  "barometric pressure has been", "pressure is unstable", "pressure has been unstable",
  "bouncing around", "pressure-sensitive", "fish are likely less active",
  "fish activity may be reduced", "activity is suppressed", "fish may be shut down",
  "suppressive", "fish tend to shut down", "adjust your presentation",
  "match the conditions", "read the water", "let the fish tell you",
  "shape your retrieve", "slow things down", "keep things light", "be deliberate",
  "cover water", "lockjaw", "shut down", "conditions may", "you might want to",
  "adjust if conditions shift",
];

const TIP_TIMING_WORDS = [
  "dawn", "dusk", "morning", "afternoon", "evening", "first light", "last light",
  "sunrise", "sunset", "o'clock", "a.m.", "p.m.", "am ", "pm ", "before the heat",
  "tide", "tidal", "slack", "flood", "ebb", "exchange window", "solunar",
];

/** Location / where-to-fish cues in tips (not retrieve verbs like "work the bait"). */
const TIP_LOCATION_WORDS = [
  "bank", "point", "points", "structure", "current seam", "seam", "depth",
  "shallow", "deep", "bottom", "water column", "edge", "pocket", "cove",
  "channel", "flat", "reef", "ledge", "vegetation",
  "keep it high", "bounce bottom", "position",
];

const TIP_WORK_THE_SPOT = /\bwork the\s+(point|bank|shore|flat|ledge|edge|pocket|cove|bar|break|rip|hole)\b/i;

const ECHO_LABELS = [
  "optimal", "suppressive", "erratic regime", "volatile", "moderate-high",
  "falling_slow", "falling_moderate", "rising_slow", "heat_limited", "cold_limited",
];

const POOR_BAND_WORDS = ["hopeless", "waste of time", "don't bother", "stay home", "awful day"];
const EXCELLENT_BAND_WORDS = ["perfect storm", "dream day", "can't miss", "red hot", "on fire"];
const MIDDAY_PRAISE = ["midday", "mid-day", "noon", "peak sun", "high sun", "middle of the day"];

/**
 * Midday/noon words often appear in honest negatives ("midday is the weak patch").
 * Only treat as praise if the surrounding text doesn't frame that window as bad/skip.
 */
function middayMentionIsPraiseful(summaryLower: string): boolean {
  for (const w of MIDDAY_PRAISE) {
    let from = 0;
    while (true) {
      const idx = summaryLower.indexOf(w, from);
      if (idx < 0) break;
      const lo = Math.max(0, idx - 55);
      const hi = Math.min(summaryLower.length, idx + w.length + 55);
      const chunk = summaryLower.slice(lo, hi);
      const neg =
        /\b(not |no |isn't|is not|without |except |skip |avoid |weak |drag|grind|stern |dead |tough|slow |bad |worst |grindy|patch\b|parade\b|honest\b)/i
          .test(chunk) ||
        /\b(is|feels|'s)\s+(a\s+)?(drag|grind|tough|bad|weak|dead|slow|stern)\b/i.test(chunk) ||
        (/\b(the\s+)?(middle of the day|midday|noon)\s+is\s+/i.test(chunk) &&
          /\b(drag|grind|weak|dead|tough|slow|bad|worst|patch)\b/i.test(chunk)) ||
        // Synoptic / transition wording: "noon push ... favor the afternoon" is not "fish at noon".
        /\bnoon push\b/i.test(chunk) ||
        /\bfavou?r(s|\s+the)?\s+afternoon\b/i.test(chunk) ||
        /\bafternoon\b[^\n]{0,48}\bbetter\b/i.test(chunk) ||
        /\bbetter\b[^\n]{0,48}\bafternoon\b/i.test(chunk) ||
        /\bmidday\b[^\n]{0,40}\b(loud|harsh|glare|brutal|rough|honest)\b/i.test(chunk) ||
        /\b(middle of the day|midday|mid-day)\b[^\n]{0,65}\b(trailing|behind|flat|brute)\b/i.test(chunk) ||
        /\bmidday\b[^\n]{0,50}\b(feels\s+flat|just\s+brute)\b/i.test(chunk);
      if (!neg) return true;
      from = idx + w.length;
    }
  }
  return false;
}

const GROUNDING_SPECIES = [
  "bass", "trout", "salmon", "steelhead", "walleye", "pike", "muskie", "redfish",
  "snook", "tarpon", "halibut", "cod", "tuna", "perch", "crappie",
];
const GROUNDING_SPAWN = ["spawn", "spawning", "pre-spawn", "post-spawn", "bedding"];

const SPEED_AGGRESSION_WORDS = ["burn", "ripp", "fast", "aggressive", "snap hard", "horse"];
const FINESSE_WORDS = ["finesse", "light touch", "crawl", "dead slow", "micro"];

function severityRank(s: AuditSeverity): number {
  return { blocker: 4, major: 3, minor: 2, info: 1 }[s];
}

export function worstSeverity(flags: AuditFlag[]): AuditSeverity | null {
  let w: AuditSeverity | null = null;
  for (const f of flags) {
    if (!w || severityRank(f.severity) > severityRank(w)) w = f.severity;
  }
  return w;
}

export function e2eAuditPass(flags: AuditFlag[]): boolean {
  for (const f of flags) {
    if (f.severity === "blocker" || f.severity === "major") return false;
  }
  return true;
}

export function failureModeSummary(flags: AuditFlag[]): string {
  if (flags.length === 0) return "pass";
  const b = flags.find((f) => f.severity === "blocker");
  if (b) return `${b.code}: ${b.detail}`;
  const m = flags.find((f) => f.severity === "major");
  if (m) return `${m.code}: ${m.detail}`;
  const i = flags.find((f) => f.severity === "info");
  if (i) return `minor/info: ${flags.length} flags`;
  return `${flags.length} minor flags`;
}

function num(x: unknown): number | null {
  if (x == null) return null;
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

export function runE2eAuditChecks(input: {
  summary: string;
  tip: string;
  report: HowsFishingReport;
  assigned_tip_lane: TipFocusLane;
  env_data: Record<string, unknown> | null;
  raw_weather?: Record<string, unknown> | null;
}): AuditFlag[] {
  const flags: AuditFlag[] = [];
  const { summary, tip, report, assigned_tip_lane, env_data, raw_weather } = input;
  const summaryLow = summary.toLowerCase();
  const tipLow = tip.toLowerCase();
  const allText = (summary + " " + tip).toLowerCase();
  const cc = report.condition_context;
  const hp = report.highlighted_periods;

  // ── Style / policy ─────────────────────────────────────────────────────
  if (summary.length > 220) {
    flags.push({ code: "summary_over_220", severity: "minor", detail: String(summary.length) });
  }
  if (tip.length > 220) {
    flags.push({ code: "tip_over_220", severity: "minor", detail: String(tip.length) });
  }

  for (const phrase of BANNED_PHRASES) {
    if (allText.includes(phrase)) {
      flags.push({ code: "banned_phrase", severity: "minor", detail: phrase });
    }
  }

  for (const word of TIP_TIMING_WORDS) {
    if (word === "slack") {
      if (/\bslack\b/i.test(tipLow) && !/\bslack\s*[- ]?line\b/i.test(tipLow)) {
        flags.push({ code: "tip_timing_violation", severity: "blocker", detail: word });
        break;
      }
      continue;
    }
    if (tipLow.includes(word)) {
      flags.push({ code: "tip_timing_violation", severity: "blocker", detail: word });
      break;
    }
  }
  for (const word of TIP_LOCATION_WORDS) {
    if (word === "point") {
      if (/\bpoint\b/i.test(tipLow) && !/\bwhole\s+point\b/i.test(tipLow)) {
        flags.push({ code: "tip_location_violation", severity: "blocker", detail: word });
        break;
      }
      continue;
    }
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(tipLow)) {
      flags.push({ code: "tip_location_violation", severity: "blocker", detail: word });
      break;
    }
  }
  // "drop" alone hits size tips ("drop a notch"); only flag structural drop language.
  if (
    /\b(drop-off|dropoff)\b/i.test(tipLow) ||
    /\b(fish|work|hit|target)\s+the\s+drop\b/i.test(tipLow) ||
    /\bdrop\s+(zone|edge)\b/i.test(tipLow)
  ) {
    flags.push({ code: "tip_location_violation", severity: "blocker", detail: "drop_structure" });
  }
  if (TIP_WORK_THE_SPOT.test(tip)) {
    flags.push({ code: "tip_location_violation", severity: "blocker", detail: "work_the_[spot]" });
  }

  for (const label of ECHO_LABELS) {
    if (allText.includes(label)) {
      flags.push({ code: "echoes_engine_label", severity: "minor", detail: label });
      break;
    }
  }

  // ── Band polarity ──────────────────────────────────────────────────────
  if (report.band === "Poor" || report.band === "Fair") {
    for (const w of EXCELLENT_BAND_WORDS) {
      if (summaryLow.includes(w)) {
        flags.push({ code: "band_narrative_mismatch", severity: "blocker", detail: `band=${report.band} but ${w}` });
        break;
      }
    }
  }
  if (report.band === "Excellent" || report.band === "Good") {
    for (const w of POOR_BAND_WORDS) {
      if (summaryLow.includes(w)) {
        flags.push({ code: "band_narrative_mismatch", severity: "blocker", detail: `band=${report.band} but ${w}` });
        break;
      }
    }
  }

  if (report.score < 40 && (summaryLow.includes("on fire") || summaryLow.includes("crushing"))) {
    flags.push({
      code: "score_narrative_mismatch",
      severity: "major",
      detail: `score=${report.score} vs enthusiastic summary`,
    });
  }
  if (report.score >= 70) {
    const graveyard = summaryLow.includes("graveyard");
    const deadIdiom =
      /\bdead-still\b|\bdead calm\b|\bdead quiet\b|\bdead[- ]air\b|\bdead flat\b|\bdead-gray\b|\bdead grey\b/i
        .test(summaryLow);
    const deadAsBiteWord = /\bdead\b/i.test(summaryLow) && !deadIdiom;
    if (graveyard || deadAsBiteWord) {
      flags.push({
        code: "score_narrative_mismatch",
        severity: "major",
        detail: `score=${report.score} vs dead summary`,
      });
    }
  }

  // ── Metabolic / heat ─────────────────────────────────────────────────────
  if (cc) {
    if (cc.temperature_metabolic_context === "heat_limited") {
      if (summaryLow.includes("cold") || summaryLow.includes("winter") || tipLow.includes("ice")) {
        flags.push({
          code: "metabolic_contradiction",
          severity: "major",
          detail: "heat_limited but cold/winter/ice language",
        });
      }
    }
    if (cc.temperature_metabolic_context === "cold_limited") {
      if (summaryLow.includes("heat stress") || summaryLow.includes("oppressive heat")) {
        flags.push({
          code: "metabolic_contradiction",
          severity: "major",
          detail: "cold_limited but heat-stress language",
        });
      }
    }
    if (cc.avoid_midday_for_heat && middayMentionIsPraiseful(summaryLow)) {
      flags.push({ code: "midday_timing_contradiction", severity: "blocker", detail: "midday framed as favorable under avoid_midday" });
    }
  }

  // ── Highlighted dayparts: if afternoon not highlighted, midday *praise* is risky ──
  if (hp && hp.length >= 4 && !hp[2] && middayMentionIsPraiseful(summaryLow)) {
    flags.push({
      code: "daypart_mismatch",
      severity: "major",
      detail: "afternoon not highlighted but summary praises midday/noon window",
    });
  }

  // ── Solunar-first vs anchor driver ───────────────────────────────────────
  const anchor = report.timing_debug?.anchor_driver ?? "";
  const anchorIsSolunar = anchor.toLowerCase().includes("solunar");
  if (!anchorIsSolunar && (summaryLow.includes("solunar") || summaryLow.includes("moon overhead"))) {
    flags.push({
      code: "solunar_priority_mismatch",
      severity: "info",
      detail: `anchor_driver=${anchor} solunar in summary`,
    });
  }

  // ── Grounding / biology proxies ──────────────────────────────────────────
  for (const s of GROUNDING_SPAWN) {
    if (summaryLow.includes(s) || tipLow.includes(s)) {
      flags.push({ code: "unsupported_spawn_claim", severity: "major", detail: s });
    }
  }
  for (const sp of GROUNDING_SPECIES) {
    const re = new RegExp(`\\b${sp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(summary) || re.test(tip)) {
      const labeled = report.drivers.some((d) => d.label.toLowerCase().includes(sp)) ||
        report.suppressors.some((d) => d.label.toLowerCase().includes(sp));
      if (!labeled) {
        flags.push({ code: "unsupported_species_mention", severity: "info", detail: sp });
      }
    }
  }

  // ── Tip lane consistency (keyword heuristics) ───────────────────────────
  if (assigned_tip_lane === "offering_size_profile") {
    const hasSize = /downsize|upsize|smaller|larger|slim|bulk|profile|skirt|weight|head/i.test(tip);
    if (!hasSize) {
      flags.push({ code: "tip_lane_mismatch", severity: "major", detail: "offering_size_profile weak cues" });
    }
  } else if (assigned_tip_lane === "retrieval_method") {
    const hasPat =
      /twitch|pause|wind|strip|roll|jig|drift|rip|cadence|retrieve|continuous|steady|smooth\s+retrieve|cleanly|nervous|snap-free|dead\s+drift/i
        .test(tip);
    if (!hasPat) {
      flags.push({ code: "tip_lane_mismatch", severity: "major", detail: "retrieval_method weak cues" });
    }
  } else if (assigned_tip_lane === "speed_aggression") {
    const hasSpeed = /crawl|slow|medium|fast|burn|pace|tempo|speed/i.test(tip);
    if (!hasSpeed) {
      flags.push({ code: "tip_lane_mismatch", severity: "major", detail: "speed_aggression weak cues" });
    }
  } else if (assigned_tip_lane === "finesse_vs_power") {
    const hasFvP =
      /finesse|vs\.?\s*power|power\s+stance|light touch|lighter touch|lighter rod|rod hand|soft\s+hands|heavy\s+hand|heavier hand|timid|authoritative|firmer|\bfirm\b|softer|wrist|muscle|delicate|delicacy|assertive|aggressive\s+rod|rod\s+work|pauses?\s+cut|leave(s)?\s+bites|micro-?tap|tiny\s+twitch|aggressive\s+strip|forceful|dainty|shuffle|slimmer|subtler|subtle|soft finish|lighter weight|cleaner presentation|confident\s+rod|rod\s+snap|purposeful\s+retrieve|mushy\s+pauses|no\s+mushy|lazy\s+cadence/i
        .test(tip);
    if (!hasFvP) {
      flags.push({ code: "tip_lane_mismatch", severity: "major", detail: "finesse_vs_power weak cues" });
    }
  }

  // Heuristic: aggressive tip with strong wind suppressor
  const topSup = report.suppressors[0]?.variable ?? "";
  if (topSup.includes("wind") || topSup.includes("runoff")) {
    if (SPEED_AGGRESSION_WORDS.some((w) => tipLow.includes(w)) && !FINESSE_WORDS.some((w) => tipLow.includes(w))) {
      flags.push({
        code: "tip_plausibility_wind",
        severity: "info",
        detail: "aggressive pace with wind/runoff top suppressor",
      });
    }
  }

  // ── Water type stray tides on freshwater ────────────────────────────────
  if (report.context !== "coastal" && (summaryLow.includes("slack tide") || summaryLow.includes("high tide"))) {
    flags.push({ code: "water_type_tone", severity: "major", detail: "tide-specific on freshwater context" });
  }

  // ── Solunar plumbing: peaks exist in env → snapshot should expose ───────
  const snap = buildWeatherSnapshot(env_data);
  const solunarFromEnv =
    (env_data?.solunar as { major_periods?: unknown[] } | undefined)?.major_periods?.length ?? 0;
  const peaksInSnap = snap && Array.isArray((snap as { solunar_peaks?: unknown }).solunar_peaks)
    ? ((snap as { solunar_peaks: unknown[] }).solunar_peaks.length)
    : 0;
  if (solunarFromEnv > 0 && peaksInSnap === 0) {
    flags.push({
      code: "solunar_snapshot_missing",
      severity: "major",
      detail: "solunar in env_data but not in LLM conditions snapshot",
    });
  }

  // ── Weather consistency (engine merge + noon scalar alignment) ──────────
  if (raw_weather && env_data?.weather && typeof env_data.weather === "object") {
    const ww = env_data.weather as Record<string, unknown>;
    const noonTemp = num(raw_weather.noon_temp_f);
    const wTemp = num(ww.temperature);
    if (noonTemp != null && wTemp != null && Math.abs(noonTemp - wTemp) > 2) {
      flags.push({
        code: "weather_noon_scalar_mismatch",
        severity: "minor",
        detail: `noon_idx temp=${noonTemp} vs weather.temperature=${wTemp}`,
      });
    }

    const dmMerged = num(env_data.daily_mean_air_temp_f);
    const dmEngine = num(raw_weather.engine_daily_mean_air_temp_f);
    if (dmEngine != null && dmMerged != null && Math.abs(dmEngine - dmMerged) > 1.5) {
      flags.push({
        code: "weather_daily_mean_merge_mismatch",
        severity: "major",
        detail: `engine daily_mean=${dmEngine} vs merged env daily_mean=${dmMerged}`,
      });
    }

    const th = ww.temp_7day_high as number[] | undefined;
    const tl = ww.temp_7day_low as number[] | undefined;
    if (dmMerged != null && th?.[14] != null && tl?.[14] != null) {
      const inferred = (Number(th[14]) + Number(tl[14])) / 2;
      if (Math.abs(dmMerged - inferred) > 4) {
        flags.push({
          code: "weather_daily_mean_vs_7day_slice",
          severity: "minor",
          detail: `daily_mean=${dmMerged} vs (high+low)/2@14=${inferred.toFixed(1)}`,
        });
      }
    }

    const snap = buildWeatherSnapshot(env_data);
    const snapT = snap != null ? num((snap as { air_temp_f?: unknown }).air_temp_f) : null;
    if (dmMerged != null && snapT != null && Math.abs(dmMerged - snapT) > 2) {
      flags.push({
        code: "weather_snapshot_vs_engine_mean",
        severity: "major",
        detail: `conditions.air_temp_f=${snapT} vs daily_mean_air_temp_f=${dmMerged}`,
      });
    }
  }

  // ── Driver echo: top suppressor framed positive ────────────────────────
  const topS = report.suppressors[0];
  if (topS) {
    const vk = topS.variable.replace(/_/g, " ").split(" ")[0] ?? "";
    if (vk.length > 3 && summaryLow.includes(vk) && /great|ideal|perfect|helping|boost/.test(summaryLow)) {
      flags.push({
        code: "suppressor_framing_risk",
        severity: "info",
        detail: `top suppressor ${topS.variable} with positive adjectives`,
      });
    }
  }

  const summaryWords = summaryLow.split(/\s+/).slice(0, 10);
  const tipWords = tipLow.split(/\s+/).slice(0, 10);
  const overlap = summaryWords.filter((w) => w.length > 4 && tipWords.includes(w));
  if (overlap.length >= 4) {
    flags.push({
      code: "summary_tip_overlap",
      severity: "minor",
      detail: overlap.slice(0, 4).join(", "),
    });
  }

  if (summary.length > 0 && summary[0] !== summary[0]!.toUpperCase()) {
    flags.push({ code: "summary_uncapitalized", severity: "minor", detail: "" });
  }
  if (tip.length > 0 && tip[0] !== tip[0]!.toUpperCase()) {
    flags.push({ code: "tip_uncapitalized", severity: "minor", detail: "" });
  }

  // Composite tier sanity (soft)
  const tier = compositeScoreActivityTier(report.score).toLowerCase();
  if (tier.includes("very low") && summaryLow.includes("excellent")) {
    flags.push({ code: "activity_tier_mismatch", severity: "major", detail: "very low tier vs excellent wording" });
  }

  return flags;
}
