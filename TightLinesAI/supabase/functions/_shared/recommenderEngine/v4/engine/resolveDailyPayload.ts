import type { SharedConditionAnalysis } from "../../../howFishingEngine/analyzeSharedConditions.ts";
import type { WaterClarity } from "../../contracts/input.ts";
import {
  POSTURE_AGGRESSIVE_THRESHOLD,
  POSTURE_SUPPRESSED_THRESHOLD,
} from "../constants.ts";
import type { DailyPayloadV4 } from "../contracts.ts";

/** P24 / G4: missing or non-numeric wind closes surface downstream (treated as strong wind). */
const WIND_MISSING_DEFAULT_MPH = 99;

export function resolvePostureV4(score: number): DailyPayloadV4["posture"] {
  if (score >= POSTURE_AGGRESSIVE_THRESHOLD) return "aggressive";
  if (score <= POSTURE_SUPPRESSED_THRESHOLD) return "suppressed";
  return "neutral";
}

function resolveWindMph(env_data: Record<string, unknown>): number {
  const raw = env_data.wind_speed_mph;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return WIND_MISSING_DEFAULT_MPH;
}

export function resolveDailyPayloadV4(
  analysis: SharedConditionAnalysis,
  env_data: Record<string, unknown>,
  water_clarity: WaterClarity,
): DailyPayloadV4 {
  const score = analysis.scored.score;
  return {
    posture: resolvePostureV4(score),
    wind_mph: resolveWindMph(env_data),
    water_clarity,
    hows_fishing_score: score,
  };
}
