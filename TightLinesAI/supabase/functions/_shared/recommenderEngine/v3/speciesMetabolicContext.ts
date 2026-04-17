import type { TemperatureMetabolicContext } from "../../howFishingEngine/contracts/variableState.ts";
import type { RecommenderV3Species } from "./contracts.ts";

/**
 * Species-specific water-temperature thresholds for classifying
 * `temperature_metabolic_context` inside the V3 recommender.
 *
 * The upstream howFishingEngine classifier (`deriveTemperatureMetabolicContext`
 * in `howFishingEngine/narration/deriveNarrationHints.ts`) operates on a
 * single species-agnostic band_label + final_score pipeline tuned primarily
 * for warmwater bass thermoregulation. Applying those thresholds to pike and
 * trout produces biologically wrong day reads on fall-feed pike and any
 * mid-50s trout scenario (see `docs/audits/recommender-v3/` P0 finding).
 *
 * These thresholds express the species-correct cold/optimal/warm tipping
 * points in raw Fahrenheit water temperature. They are used only inside
 * `resolveDailyPayloadV3` when water temperature is present; otherwise the
 * upstream air-based classification is preserved as a fallback.
 *
 * Keep this table conservative — the tipping points below should only move
 * on real-world evidence, not on individual scenario tuning.
 */
export type SpeciesMetabolicThresholds = {
  /** Below this water temp → `cold_limited`. */
  readonly cold_limited_below_f: number;
  /** Low edge of the species' optimal range (documentation only — not used by the classifier). */
  readonly optimal_low_f: number;
  /** High edge of the species' optimal range (documentation only — not used by the classifier). */
  readonly optimal_high_f: number;
  /** Above this water temp → `heat_limited`. */
  readonly warm_limited_above_f: number;
};

export const SPECIES_METABOLIC_THRESHOLDS: Readonly<
  Record<RecommenderV3Species, SpeciesMetabolicThresholds>
> = {
  largemouth_bass: {
    cold_limited_below_f: 52,
    optimal_low_f: 65,
    optimal_high_f: 80,
    warm_limited_above_f: 86,
  },
  smallmouth_bass: {
    cold_limited_below_f: 48,
    optimal_low_f: 58,
    optimal_high_f: 75,
    warm_limited_above_f: 80,
  },
  northern_pike: {
    cold_limited_below_f: 40,
    optimal_low_f: 45,
    optimal_high_f: 65,
    warm_limited_above_f: 72,
  },
  trout: {
    cold_limited_below_f: 40,
    optimal_low_f: 45,
    optimal_high_f: 65,
    warm_limited_above_f: 68,
  },
};

/**
 * Classify a raw water temperature against species-specific thresholds.
 * Returns `null` when water temperature is not usable; callers should then
 * fall back to the upstream air-based classification.
 */
export function classifySpeciesMetabolicContext(
  species: RecommenderV3Species,
  waterTempF: number | null | undefined,
): TemperatureMetabolicContext | null {
  if (waterTempF == null || !Number.isFinite(waterTempF)) return null;
  const t = SPECIES_METABOLIC_THRESHOLDS[species];
  if (waterTempF < t.cold_limited_below_f) return "cold_limited";
  if (waterTempF > t.warm_limited_above_f) return "heat_limited";
  return "neutral";
}

/**
 * Species for which the recommender applies the species-specific water-temp
 * override. Bass are intentionally excluded: the upstream air-based classifier
 * produces the reference behavior on LMB/SMB, and the audit acceptance criteria
 * for Phase 0 of the V3 recommender correction plan explicitly require that
 * "smallmouth and largemouth bass scenario reports remain unchanged"
 * (`docs/audits/recommender-v3/_correction_plan.md` §0.2).
 *
 * The bass threshold rows in `SPECIES_METABOLIC_THRESHOLDS` are retained as
 * documentation of species biology but are not consulted at runtime.
 */
const OVERRIDE_SPECIES: ReadonlySet<RecommenderV3Species> = new Set([
  "northern_pike",
  "trout",
]);

/**
 * Resolve the effective metabolic context for a V3 recommender request.
 *
 * For pike and trout, prefers a species-specific classification on the measured
 * water temperature because the upstream bass-tuned air-temperature classifier
 * produced biologically wrong day reads (pike-02 fall-feed at 63°F →
 * `cold_limited`; trt-02/05 mid-50s → `cold_limited`). For bass, the upstream
 * classification is always preserved — see `OVERRIDE_SPECIES` for rationale.
 *
 * Falls back to the upstream air-based classification when:
 *   - no species is provided (shared tests, legacy call sites),
 *   - the species is not in `OVERRIDE_SPECIES` (e.g. bass), or
 *   - no usable water temperature is present.
 */
export function resolveRecommenderMetabolicContext(
  upstream: TemperatureMetabolicContext,
  species: RecommenderV3Species | null | undefined,
  waterTempF: number | null | undefined,
): TemperatureMetabolicContext {
  if (!species) return upstream;
  if (!OVERRIDE_SPECIES.has(species)) return upstream;
  const speciesBased = classifySpeciesMetabolicContext(species, waterTempF);
  return speciesBased ?? upstream;
}
