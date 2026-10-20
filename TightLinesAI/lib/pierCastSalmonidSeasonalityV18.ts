import type {
  PierCastV3AvailabilityKnot,
  PierCastV3OpportunityMode,
  PierCastV3PairCalibration,
} from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";
import { evaluatePierCastV3ModePotential } from "../supabase/functions/_shared/pierCastEngine/scoring/modesV3.ts";
import type { PierCastLakeTroutV5Calibration } from "../supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate.ts";

export const PIER_CAST_SALMONID_SEASONALITY_V18_VERSION =
  "piercast-salmonid-seasonality-1.18-v2" as const;

const CALIBRATION_SUFFIX = "__seasonality_1_18_v1";
const BROWN_TROUT_PASS3_SUFFIX = "__brown_trout_pass3_1_18_v1";
const LIMITATION =
  "The 1.18 taper calibration preserves the evidence-reviewed fishery-strength ceiling and does not imply uniform daily catchability.";
const BROWN_TROUT_WISCONSIN_LIMITATION =
  "The 1.18 Wisconsin brown-trout correction repairs recurring-season continuity without raising the evidence-reviewed fishery-strength ceiling or transferring tributary and boat success to the pier.";

/** Evidence-reviewed Wisconsin pairs changed by the brown-trout Pass 3 correction. */
export const PIER_CAST_V18_BROWN_TROUT_CORRECTION_CITY_IDS = [
  "algoma_wi",
  "kenosha_wi",
  "kewaunee_wi",
  "manitowoc_wi",
  "milwaukee_wi",
  "port_washington_wi",
  "racine_wi",
  "two_rivers_wi",
] as const;

const BROWN_TROUT_SOUTHERN_WISCONSIN_CITY_IDS = [
  "kenosha_wi",
  "milwaukee_wi",
  "port_washington_wi",
  "racine_wi",
] as const;

const BROWN_TROUT_NORTHERN_WISCONSIN_CITY_IDS = [
  "algoma_wi",
  "kewaunee_wi",
  "manitowoc_wi",
  "two_rivers_wi",
] as const;

/** Strong fall fisheries where the prior curve collapsed before late October. */
export const PIER_CAST_V18_STRONG_CHINOOK_TAIL_CITY_IDS = [
  "algoma_wi",
  "frankfort_elberta_mi",
  "kewaunee_wi",
  "ludington_mi",
  "manistee_mi",
  "manitowoc_wi",
  "port_washington_wi",
  "sheboygan_wi",
  "two_rivers_wi",
  "whitehall_mi",
] as const;

const STRONG_CHINOOK_TAIL = [
  { monthDay: "10-01", availability: 0.55 },
  { monthDay: "10-15", availability: 0.45 },
  { monthDay: "11-01", availability: 0.30 },
  { monthDay: "11-15", availability: 0.10 },
  { monthDay: "12-01", availability: 0 },
] as const satisfies readonly PierCastV3AvailabilityKnot[];

const CHINOOK_LATE_REGION_TAILS = new Map<
  string,
  readonly PierCastV3AvailabilityKnot[]
>([
  [
    "grand_haven_mi",
    [
      { monthDay: "10-15", availability: 0.37 },
      { monthDay: "11-01", availability: 0.20 },
      { monthDay: "11-15", availability: 0.05 },
      { monthDay: "12-01", availability: 0 },
    ],
  ],
  [
    "alpena_mi",
    [
      { monthDay: "10-15", availability: 0.70 },
      { monthDay: "11-01", availability: 0.50 },
      { monthDay: "11-15", availability: 0.25 },
      { monthDay: "12-01", availability: 0.08 },
      { monthDay: "12-15", availability: 0 },
    ],
  ],
  [
    "harrisville_mi",
    [
      { monthDay: "10-15", availability: 0.74 },
      { monthDay: "11-01", availability: 0.55 },
      { monthDay: "11-15", availability: 0.32 },
      { monthDay: "12-01", availability: 0.15 },
      { monthDay: "12-15", availability: 0.05 },
      { monthDay: "12-31", availability: 0 },
    ],
  ],
  [
    "lexington_mi",
    [
      { monthDay: "10-15", availability: 0.74 },
      { monthDay: "11-01", availability: 0.55 },
      { monthDay: "11-15", availability: 0.32 },
      { monthDay: "12-01", availability: 0.15 },
      { monthDay: "12-15", availability: 0.05 },
      { monthDay: "12-31", availability: 0 },
    ],
  ],
  [
    "port_sanilac_mi",
    [
      { monthDay: "10-15", availability: 0.54 },
      { monthDay: "11-01", availability: 0.34 },
      { monthDay: "11-15", availability: 0.15 },
      { monthDay: "12-01", availability: 0 },
    ],
  ],
]);

/** Pairs whose Pass 3 audit found an October 15 to November 1 coho cliff. */
export const PIER_CAST_V18_COHO_TAPER_PAIR_KEYS = [
  "algoma_wi/coho_salmon",
  "alpena_mi/coho_salmon",
  "chicago_il/coho_salmon",
  "frankfort_elberta_mi/coho_salmon",
  "grand_haven_mi/coho_salmon",
  "harrisville_mi/coho_salmon",
  "holland_mi/coho_salmon",
  "kewaunee_wi/coho_salmon",
  "lexington_mi/coho_salmon",
  "manistee_mi/coho_salmon",
  "manitowoc_wi/coho_salmon",
  "michigan_city_in/coho_salmon",
  "milwaukee_wi/coho_salmon",
  "muskegon_mi/coho_salmon",
  "pentwater_mi/coho_salmon",
  "south_haven_mi/coho_salmon",
  "st_joseph_mi/coho_salmon",
  "two_rivers_wi/coho_salmon",
  "whitehall_mi/coho_salmon",
] as const;

function availabilityAt(
  mode: PierCastV3OpportunityMode,
  monthDay: string,
): number {
  return evaluatePierCastV3ModePotential({
    localDate: `2028-${monthDay}`,
    mode,
  })?.seasonalAvailability ?? 0;
}

function replaceWindow(input: {
  mode: PierCastV3OpportunityMode;
  startMonthDay: string;
  endMonthDay: string;
  knots: readonly PierCastV3AvailabilityKnot[];
  limitation?: string;
  calibrationSuffix?: string;
}): PierCastV3OpportunityMode {
  const retained = input.mode.availabilityKnots.filter((knot) =>
    knot.monthDay < input.startMonthDay || knot.monthDay > input.endMonthDay
  );
  return {
    ...input.mode,
    modeCalibrationId: input.mode.modeCalibrationId.endsWith(
        input.calibrationSuffix ?? CALIBRATION_SUFFIX,
      )
      ? input.mode.modeCalibrationId
      : `${input.mode.modeCalibrationId}${
        input.calibrationSuffix ?? CALIBRATION_SUFFIX
      }`,
    availabilityKnots: [...retained, ...input.knots].sort((left, right) =>
      left.monthDay.localeCompare(right.monthDay)
    ),
    limitations: input.mode.limitations.includes(input.limitation ?? LIMITATION)
      ? input.mode.limitations
      : [...input.mode.limitations, input.limitation ?? LIMITATION],
  };
}

function smoothCohoTaper(
  mode: PierCastV3OpportunityMode,
): PierCastV3OpportunityMode {
  const october15 = availabilityAt(mode, "10-15");
  const currentNovember1 = availabilityAt(mode, "11-01");
  const november1 = Math.max(currentNovember1, october15 - 0.20);
  const november15 = Math.max(
    availabilityAt(mode, "11-15"),
    november1 - 0.25,
  );
  const december1 = Math.max(
    availabilityAt(mode, "12-01"),
    november15 - 0.25,
  );
  return replaceWindow({
    mode,
    startMonthDay: "10-15",
    endMonthDay: "12-15",
    knots: [
      { monthDay: "10-15", availability: october15 },
      { monthDay: "11-01", availability: november1 },
      { monthDay: "11-15", availability: november15 },
      { monthDay: "12-01", availability: december1 },
      { monthDay: "12-15", availability: 0 },
    ],
  });
}

function applyChinookCalibration(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  const strongTail =
    (PIER_CAST_V18_STRONG_CHINOOK_TAIL_CITY_IDS as readonly string[])
      .includes(pair.cityId);
  const regionalTail = CHINOOK_LATE_REGION_TAILS.get(pair.cityId);
  if (!strongTail && !regionalTail) return pair;
  return {
    ...pair,
    modes: pair.modes.map((mode) => {
      if (mode.modeId !== "fall_harbor_staging") return mode;
      const knots = strongTail ? STRONG_CHINOOK_TAIL : regionalTail!;
      return replaceWindow({
        mode,
        startMonthDay: knots[0]!.monthDay,
        endMonthDay: knots.at(-1)!.monthDay,
        knots,
      });
    }),
  };
}

function applyCohoCalibration(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (
    !(PIER_CAST_V18_COHO_TAPER_PAIR_KEYS as readonly string[]).includes(
      pair.pairKey,
    )
  ) {
    return pair;
  }
  return {
    ...pair,
    modes: pair.modes.map((mode) =>
      mode.modeId.startsWith("fall_") ? smoothCohoTaper(mode) : mode
    ),
  };
}

function applySteelheadCalibration(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (pair.pairKey !== "harbor_beach_mi/steelhead") return pair;
  return {
    ...pair,
    modes: pair.modes.map((mode) =>
      mode.modeId === "coolwater_port_opportunity"
        ? replaceWindow({
          mode,
          startMonthDay: "10-15",
          endMonthDay: "12-15",
          knots: [
            { monthDay: "10-15", availability: 0.62 },
            { monthDay: "11-01", availability: 0.42 },
            { monthDay: "11-15", availability: 0.28 },
            { monthDay: "12-15", availability: 0.10 },
          ],
        })
        : mode
    ),
  };
}

function applyBrownTroutCalibrationBeforePass3(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (pair.pairKey !== "port_sanilac_mi/brown_trout") return pair;
  return {
    ...pair,
    modes: pair.modes.map((mode) =>
      mode.modeId === "fall_coolwater_return"
        ? replaceWindow({
          mode,
          startMonthDay: "10-15",
          endMonthDay: "12-10",
          knots: [
            { monthDay: "10-15", availability: 0.96 },
            { monthDay: "11-01", availability: 0.72 },
            { monthDay: "11-15", availability: 0.42 },
            { monthDay: "12-01", availability: 0.12 },
            { monthDay: "12-10", availability: 0 },
          ],
        })
        : mode
    ),
  };
}

function applyBrownTroutWisconsinPass3(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (
    (BROWN_TROUT_SOUTHERN_WISCONSIN_CITY_IDS as readonly string[]).includes(
      pair.cityId,
    )
  ) {
    return {
      ...pair,
      modes: pair.modes.map((mode) =>
        mode.modeId === "winter_harbor_open_water"
          ? replaceWindow({
            mode,
            startMonthDay: "08-01",
            endMonthDay: "11-15",
            knots: [
              { monthDay: "08-01", availability: 0 },
              { monthDay: "08-25", availability: 0.04 },
              { monthDay: "09-15", availability: 0.10 },
              { monthDay: "10-01", availability: 0.16 },
              { monthDay: "10-15", availability: 0.26 },
              { monthDay: "11-15", availability: 0.45 },
            ],
            limitation: BROWN_TROUT_WISCONSIN_LIMITATION,
            calibrationSuffix: BROWN_TROUT_PASS3_SUFFIX,
          })
          : mode
      ),
    };
  }
  if (
    (BROWN_TROUT_NORTHERN_WISCONSIN_CITY_IDS as readonly string[]).includes(
      pair.cityId,
    )
  ) {
    return {
      ...pair,
      modes: pair.modes.map((mode) =>
        mode.modeId === "fall_harbor"
          ? replaceWindow({
            mode,
            startMonthDay: "11-10",
            endMonthDay: "12-31",
            knots: [
              { monthDay: "11-10", availability: 1 },
              { monthDay: "12-01", availability: 0.80 },
              { monthDay: "12-20", availability: 0.45 },
              { monthDay: "12-31", availability: 0 },
            ],
            limitation: BROWN_TROUT_WISCONSIN_LIMITATION,
            calibrationSuffix: BROWN_TROUT_PASS3_SUFFIX,
          })
          : mode
      ),
    };
  }
  return pair;
}

function applyAtlanticCalibration(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (pair.pairKey !== "harbor_beach_mi/atlantic_salmon") return pair;
  return {
    ...pair,
    modes: pair.modes.map((mode) =>
      mode.modeId === "fall_harbor_return"
        ? replaceWindow({
          mode,
          startMonthDay: "10-15",
          endMonthDay: "12-01",
          knots: [
            { monthDay: "10-15", availability: 0.68 },
            { monthDay: "11-01", availability: 0.48 },
            { monthDay: "11-15", availability: 0.20 },
            { monthDay: "12-01", availability: 0 },
          ],
        })
        : mode
    ),
  };
}

/** Frozen state used by the completed brown-trout Pass 1 baseline. */
export function applyPierCastSalmonidSeasonalityV18BeforeBrownTroutPass3(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  if (pair.speciesId === "chinook_salmon") return applyChinookCalibration(pair);
  if (pair.speciesId === "coho_salmon") return applyCohoCalibration(pair);
  if (pair.speciesId === "steelhead") return applySteelheadCalibration(pair);
  if (pair.speciesId === "brown_trout") {
    return applyBrownTroutCalibrationBeforePass3(pair);
  }
  if (pair.speciesId === "atlantic_salmon") {
    return applyAtlanticCalibration(pair);
  }
  return pair;
}

/** Applies all reviewed 1.18 waves, including brown-trout Pass 3. */
export function applyPierCastSalmonidSeasonalityV18(
  pair: PierCastV3PairCalibration,
): PierCastV3PairCalibration {
  const prior = applyPierCastSalmonidSeasonalityV18BeforeBrownTroutPass3(pair);
  return pair.speciesId === "brown_trout"
    ? applyBrownTroutWisconsinPass3(prior)
    : prior;
}

const LAKE_TROUT_OCTOBER_BY_ARCHETYPE = new Map<number, number>([
  [0.72, 0.62],
  [0.82, 0.65],
  [0.70, 0.60],
  [0.76, 0.65],
]);

/**
 * Delays the open-water lake-trout ramp without moving the November high
 * point, changing a city ceiling, or scoring a research hold.
 */
export function pierCastLakeTroutMonthlyAvailabilityV18(
  candidate: PierCastLakeTroutV5Calibration,
): readonly number[] | null {
  if (candidate.monthlyAvailability === null) return null;
  const october = candidate.monthlyAvailability[9]!;
  const adjustedOctober = LAKE_TROUT_OCTOBER_BY_ARCHETYPE.get(october);
  if (adjustedOctober === undefined) return candidate.monthlyAvailability;
  const adjusted = [...candidate.monthlyAvailability];
  adjusted[9] = adjustedOctober;
  return adjusted;
}
