/**
 * Engine-driven tip focus lane: weights lanes from normalized variables + metabolic state,
 * then weighted-random choice among lanes (small floor keeps originality on similar days).
 */

import type { HowsFishingReport } from "../contracts/report.ts";
import { engineScoreTier, ENGINE_SCORE_EPSILON } from "../score/engineScoreMath.ts";
import { deriveMetabolicState, type TipFocusLane } from "./buildNarrationBrief.ts";

export type TipFocusRng = { next: () => number };

const ALL_LANES: readonly TipFocusLane[] = [
  "offering_size_profile",
  "retrieval_method",
  "speed_aggression",
  "finesse_vs_power",
] as const;

/** Instruction pools — same semantics as howFishingPolish (voice unchanged; pick within lane for variety). */
export const TIP_FOCUS_INSTRUCTIONS: Record<TipFocusLane, readonly string[]> = {
  offering_size_profile: [
    "Make exactly ONE call on offering size or profile: downsize, upsize, slimmer bulk, more or less vibration/thump, heavier or lighter head *as tackle choice* — tied to today's drivers/suppressors. No depth or spot advice.",
    "Commit to a profile change the data supports: smaller vs larger, subtler vs louder action, finesse plastic vs hard bait energy — one clear mechanical choice.",
    "Name the size or silhouette shift that fits engine_verdict today (e.g. trim profile, bulk up, swap to something they can find without chasing).",
  ],
  retrieval_method: [
    "Name ONE retrieve *pattern* to own today: steady wind, twitch-pause, rip-and-fall, dead drift, slow roll, short pops — pick one and justify with conditions in half a clause max.",
    "Pick a single cadence recipe (e.g. two turns, pause, tick) vs steady crawl — the tip is the pattern, not the spot.",
    "Choose between reaction-style snaps vs smooth continuous motion — one method only, spelled out so they can replicate it.",
  ],
  speed_aggression: [
    "Pick ONE pace: crawl, slow, medium steady, fast, aggressive rip — what speed matches fish_activity_level and the top suppressors today?",
    "Commit to slower *or* more aggressive rod work on the retrieve — not both as equals; one dominant speed story.",
    "Should they earn bites with patience or trigger them with tempo? One explicit speed call.",
  ],
  finesse_vs_power: [
    "Finesse vs power on the *rod and retrieve*: light touch, long hangs vs confident snaps — one stance for today.",
    "Delicate vs authoritative with the same lure family — which side does the score and temperature story support?",
    "Soft hands and micro-movements vs assertive strips — pick the side and name what that looks like mechanically.",
  ],
};

const LANE_FLOOR = 0.45;

function addW(m: Map<TipFocusLane, number>, lane: TipFocusLane, delta: number) {
  m.set(lane, (m.get(lane) ?? 0) + delta);
}

function weightedLanePick(weights: Map<TipFocusLane, number>, rng: TipFocusRng): TipFocusLane {
  let total = 0;
  for (const w of weights.values()) total += w;
  if (total <= 0) return ALL_LANES[0]!;
  let r = rng.next() * total;
  for (const lane of ALL_LANES) {
    const w = weights.get(lane) ?? 0;
    r -= w;
    if (r <= 0) return lane;
  }
  return ALL_LANES[ALL_LANES.length - 1]!;
}

/**
 * Score each tip pillar from engine output; sample lane with probability ∝ weight.
 * Small per-lane floor preserves variety when signals are similar across days.
 */
export function laneWeightsFromReport(report: HowsFishingReport): Map<TipFocusLane, number> {
  const weights = new Map<TipFocusLane, number>();
  for (const lane of ALL_LANES) weights.set(lane, LANE_FLOOR);

  const cc = report.condition_context;
  if (!cc) return weights;

  // ─── Shared size anchor (cross-context consistency) ────────────────────────
  // Temperature band + light score drive size direction universally across all
  // water types. This ensures lake/pond, river, coastal tabs agree on whether
  // today is a "go bigger/bolder" or "go smaller/finesse" day, regardless of
  // water-type-specific weights (runoff, tide, etc.).
  //
  // This is computed FIRST so it seeds the baseline before context-specific
  // variables adjust it.
  const tempBandLabel = cc.temperature_band ?? cc.temperature_metabolic_context ?? "neutral";
  const lightNorm = cc.normalized_variable_scores.find(
    (v) => v.variable_key === "light_cloud_condition",
  );
  const lightScore = lightNorm?.engine_score ?? 0;
  // tempFinalScore available for future use if needed:
  // cc.normalized_variable_scores.find(v => v.variable_key === "temperature_condition")
  //   ?.temperature_breakdown?.final_score ?? 0

  // Heavy overcast = bolder/larger presentation appropriate
  if (lightScore >= 1.0) {
    addW(weights, "offering_size_profile", 1.4);
  }
  // Glare / bright sun = finesse/smaller appropriate
  if (lightScore <= -0.5) {
    addW(weights, "offering_size_profile", 0.9);
    addW(weights, "finesse_vs_power", 0.9);
  }
  // Cold temp (very_cold or cool band) = finesse/smaller baseline
  if (tempBandLabel === "very_cold" || tempBandLabel === "cool") {
    addW(weights, "finesse_vs_power", 1.1);
    addW(weights, "offering_size_profile", 0.8);
  }
  // ───────────────────────────────────────────────────────────────────────────

  const metabolic = deriveMetabolicState(report);
  const slowFinesse =
    metabolic === "cold_limited" ||
    metabolic === "post_front_recovery" ||
    metabolic === "tough";

  for (const norm of cc.normalized_variable_scores) {
    const { variable_key: key, engine_score: score, engine_label: label } = norm;

    switch (key) {
      case "light_cloud_condition": {
        if (score >= 1.5) addW(weights, "offering_size_profile", 2.1);
        if (score <= -ENGINE_SCORE_EPSILON) addW(weights, "offering_size_profile", 2.4);
        break;
      }
      case "precipitation_disruption": {
        if (score <= -ENGINE_SCORE_EPSILON) addW(weights, "offering_size_profile", 1.7);
        if (score >= ENGINE_SCORE_EPSILON) addW(weights, "offering_size_profile", 1.35);
        break;
      }
      case "runoff_flow_disruption": {
        if (score <= -ENGINE_SCORE_EPSILON) addW(weights, "offering_size_profile", 1.75);
        if (score >= ENGINE_SCORE_EPSILON) addW(weights, "offering_size_profile", 1.15);
        break;
      }
      case "pressure_regime": {
        if (label === "falling_hard") {
          addW(weights, "retrieval_method", slowFinesse ? 1.25 : 2.75);
          if (!slowFinesse) addW(weights, "speed_aggression", 1.35);
        } else if (label === "volatile") {
          addW(weights, "retrieval_method", 1.95);
        } else if (label === "rising_slow") {
          addW(weights, "retrieval_method", 1.55);
        }
        break;
      }
      case "tide_current_movement": {
        if (score >= ENGINE_SCORE_EPSILON) {
          addW(weights, "retrieval_method", slowFinesse ? 1.1 : 1.85);
        } else if (score <= -ENGINE_SCORE_EPSILON) {
          addW(weights, "retrieval_method", 1.15);
        }
        break;
      }
      case "wind_condition": {
        const wt = engineScoreTier(score);
        if (wt <= -1) addW(weights, "finesse_vs_power", 2.55);
        if (wt === 2) addW(weights, "finesse_vs_power", 0.85);
        break;
      }
      default:
        break;
    }
  }

  if (metabolic === "active") {
    addW(weights, "speed_aggression", 2.15);
    addW(weights, "finesse_vs_power", 0.35);
  } else if (metabolic === "selective") {
    addW(weights, "speed_aggression", 1.05);
    addW(weights, "finesse_vs_power", 1.1);
  }

  if (slowFinesse) {
    addW(weights, "finesse_vs_power", 2.05);
    addW(weights, "speed_aggression", 0.55);
  }
  if (metabolic === "heat_limited") {
    addW(weights, "finesse_vs_power", 1.85);
    addW(weights, "speed_aggression", 0.45);
  }

  const s = report.score;
  if (s >= 68) addW(weights, "speed_aggression", 0.95);
  if (s <= 44) addW(weights, "finesse_vs_power", 0.75);

  return weights;
}

function pickInstructionForLane(lane: TipFocusLane, rng: TipFocusRng): string {
  const pool = TIP_FOCUS_INSTRUCTIONS[lane];
  const idx = Math.min(pool.length - 1, Math.floor(rng.next() * pool.length));
  return pool[idx]!;
}

/**
 * Choose tip lane from engine signals (weighted, not uniform random).
 * Instruction text is still randomly picked within the chosen lane for phrasing variety.
 */
export function pickTipFocusFromEngine(
  report: HowsFishingReport,
  rng: TipFocusRng,
): { lane: TipFocusLane; instruction: string } {
  const w = laneWeightsFromReport(report);
  const lane = weightedLanePick(w, rng);
  return { lane, instruction: pickInstructionForLane(lane, rng) };
}
