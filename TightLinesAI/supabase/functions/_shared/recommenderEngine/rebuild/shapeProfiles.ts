import type { SeasonalRowV4 } from "../v4/contracts.ts";
import type { TacticalColumn, TacticalPace } from "../v4/contracts.ts";
import { legalColumnChain, paceIndex } from "./constants.ts";

export type DailyRegime = "aggressive" | "neutral" | "suppressive";

/** Maps How's Fishing 10–100 score to architecture regime thresholds (3.5 / 7.0 on a 1–10 scale). */
export function regimeFromHowsScore(score0to100: number): DailyRegime {
  const s = score0to100 / 10;
  if (s <= 3.5) return "suppressive";
  if (s >= 7.0) return "aggressive";
  return "neutral";
}

function shallowColumn(
  col: TacticalColumn,
  legalOrdered: TacticalColumn[],
): TacticalColumn | undefined {
  const i = legalOrdered.indexOf(col);
  if (i < 0) return undefined;
  return legalOrdered[i + 1];
}

function deepColumn(
  col: TacticalColumn,
  legalOrdered: TacticalColumn[],
): TacticalColumn | undefined {
  const i = legalOrdered.indexOf(col);
  if (i <= 0) return undefined;
  return legalOrdered[i - 1];
}

/** Remove surface when wind-blocked; order remaining legal columns bottom→surface */
export function effectiveLegalColumns(args: {
  row: SeasonalRowV4;
  surfaceBlocked: boolean;
}): TacticalColumn[] {
  const { row, surfaceBlocked } = args;
  let range = [...row.column_range];
  if (surfaceBlocked) {
    range = range.filter((c) => c !== "surface");
  }
  return legalColumnChain(range);
}

function rankThreeColumns(args: {
  legalOrdered: TacticalColumn[];
  anchorCol: TacticalColumn;
  regime: DailyRegime;
}): [TacticalColumn, TacticalColumn, TacticalColumn] {
  const { legalOrdered, anchorCol, regime } = args;
  if (legalOrdered.length === 0) {
    throw new Error("rebuild: empty legal column range after wind filter");
  }

  const deepest = legalOrdered[0]!;
  const shallowest = legalOrdered[legalOrdered.length - 1]!;
  const anchor = legalOrdered.includes(anchorCol)
    ? anchorCol
    : legalOrdered[0]!;

  const shallow = shallowColumn(anchor, legalOrdered);
  const deep = deepColumn(anchor, legalOrdered);
  const surfaceLegal = legalOrdered.includes("surface");
  const surfaceCanLead = surfaceLegal && anchor === "upper" &&
    regime === "aggressive";

  if (regime === "neutral") {
    const r1 = anchor;
    const r2 = shallow ?? anchor;
    const r3 = deep ?? deepest;
    return [r1, r2, r3];
  }

  if (regime === "aggressive") {
    if (surfaceCanLead) {
      return ["surface", "upper", deepColumn("upper", legalOrdered) ?? anchor];
    }

    const nonSurface = legalOrdered.filter((c) => c !== "surface");
    const shallowestNonSurface = nonSurface[nonSurface.length - 1] ?? anchor;
    const r1 = shallowestNonSurface;
    const r2 = anchor;
    const r3 = surfaceLegal ? "surface" : deep ?? anchor;
    return [r1, r2, r3];
  }

  // suppressive
  const r1 = deep ?? anchor;
  const r2 = deepest;
  const r3 = anchor;
  return [r1, r2, r3];
}

function clampPaceToLegal(
  desired: TacticalPace,
  legal: readonly TacticalPace[],
): TacticalPace {
  if (legal.includes(desired)) return desired;
  const di = paceIndex(desired);
  let best = legal[0]!;
  let bestDist = 999;
  for (const p of legal) {
    const d = Math.abs(paceIndex(p) - di);
    if (d < bestDist || (d === bestDist && paceIndex(p) < paceIndex(best))) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

function paceTripleForRegime(args: {
  anchor: TacticalPace;
  regime: DailyRegime;
  legal: readonly TacticalPace[];
}): [TacticalPace, TacticalPace, TacticalPace] {
  const { anchor, regime, legal } = args;

  const narrow = legal.length === 1;
  if (narrow) {
    const only = legal[0]!;
    return [only, only, only];
  }

  let p1: TacticalPace;
  let p2: TacticalPace;
  let p3: TacticalPace;

  if (anchor === "fast") {
    if (regime === "aggressive") {
      p1 = "fast";
      p2 = "fast";
      p3 = "medium";
    } else if (regime === "neutral") {
      p1 = "fast";
      p2 = "medium";
      p3 = "medium";
    } else {
      p1 = "medium";
      p2 = "medium";
      p3 = "medium";
    }
  } else if (anchor === "medium") {
    if (regime === "aggressive") {
      p1 = "fast";
      p2 = "medium";
      p3 = "medium";
    } else if (regime === "neutral") {
      p1 = "medium";
      p2 = "medium";
      p3 = "medium";
    } else {
      p1 = "slow";
      p2 = "slow";
      p3 = "slow";
    }
  } else {
    // slow anchor
    if (regime === "aggressive") {
      p1 = "medium";
      p2 = "slow";
      p3 = "slow";
    } else if (regime === "neutral") {
      p1 = "slow";
      p2 = "slow";
      p3 = "slow";
    } else {
      p1 = "slow";
      p2 = "slow";
      p3 = "slow";
    }
  }

  return [
    clampPaceToLegal(p1, legal),
    clampPaceToLegal(p2, legal),
    clampPaceToLegal(p3, legal),
  ];
}

export type TargetProfile = { column: TacticalColumn; pace: TacticalPace };

function rowHasSlowSurfaceSpecialist(row: SeasonalRowV4): boolean {
  return row.primary_lure_ids.includes("hollow_body_frog") ||
    row.primary_fly_ids.includes("frog_fly") ||
    row.primary_fly_ids.includes("mouse_fly");
}

export function buildTargetProfiles(args: {
  row: SeasonalRowV4;
  regime: DailyRegime;
  surfaceBlocked: boolean;
}): TargetProfile[] {
  const { row, regime, surfaceBlocked } = args;

  const legalCols = effectiveLegalColumns({ row, surfaceBlocked });
  const anchorCol = row.column_baseline;
  const [c1, c2, c3] = rankThreeColumns({
    legalOrdered: legalCols,
    anchorCol,
    regime,
  });

  const [p1, p2, p3] = paceTripleForRegime({
    anchor: row.pace_baseline,
    regime,
    legal: row.pace_range,
  });

  const profiles = [
    { column: c1, pace: p1 },
    { column: c2, pace: p2 },
    { column: c3, pace: p3 },
  ];

  return profiles.map((profile) =>
    profile.column === "surface" && row.pace_range.includes("slow") &&
      rowHasSlowSurfaceSpecialist(row)
      ? { ...profile, pace: "slow" }
      : profile
  );
}

/** Surface is wind-blocked only when seasonally legal and daylight mean wind > 14 mph */
export function computeSurfaceBlocked(args: {
  row: SeasonalRowV4;
  daylightWindMph: number;
}): boolean {
  const { row, daylightWindMph } = args;
  const surfaceInSeason = row.column_range.includes("surface") &&
    row.surface_seasonally_possible;
  if (!surfaceInSeason) return false;
  return daylightWindMph > 14;
}
