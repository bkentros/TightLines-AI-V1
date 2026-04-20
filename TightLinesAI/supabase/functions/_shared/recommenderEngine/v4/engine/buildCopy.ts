import type { ArchetypeProfileV4, SeasonalRowV4 } from "../contracts.ts";
import type { DailyPayloadV4 } from "../contracts.ts";
import type { WaterClarity } from "../../contracts/input.ts";
import type { HeadlineFallbackVariant } from "./buildEligiblePool.ts";
import type { SlotRole } from "./pickTop3.ts";
import {
  TACTICAL_COLUMNS_V4,
  type TacticalColumn,
  type TacticalPace,
} from "../contracts.ts";

function posturePhrase(p: DailyPayloadV4["posture"]): string {
  switch (p) {
    case "aggressive":
      return "aggressive feeding";
    case "neutral":
      return "neutral, workable";
    case "suppressed":
      return "suppressed, tight";
  }
}

function forageLabel(f: SeasonalRowV4["primary_forage"]): string {
  switch (f) {
    case "crawfish":
      return "crawfish";
    case "baitfish":
      return "baitfish";
    case "bluegill_perch":
      return "bluegill and perch";
    case "leech_worm":
      return "leech and worm";
    case "insect_misc":
      return "insect forage";
    case "surface_prey":
      return "surface prey";
  }
}

function columnPhrase(c: TacticalColumn): string {
  switch (c) {
    case "bottom":
      return "bottom";
    case "mid":
      return "mid-column";
    case "upper":
      return "upper column";
    case "surface":
      return "surface";
  }
}

function pacePhrase(p: TacticalPace): string {
  switch (p) {
    case "slow":
      return "slow";
    case "medium":
      return "steady medium";
    case "fast":
      return "fast";
  }
}

function directionPhrase(anchor: TacticalColumn, outward: TacticalColumn): string {
  const canon = [...TACTICAL_COLUMNS_V4];
  const ai = canon.indexOf(anchor);
  const oi = canon.indexOf(outward);
  if (oi < ai) return "deeper";
  return "higher";
}

export type ForageCopyMode = "forage_claim_ok" | "no_forage_claim";

export function resolveHeadlineForageCopyMode(
  headline_fallback: HeadlineFallbackVariant,
): ForageCopyMode {
  if (headline_fallback === "forage_relaxed" || headline_fallback === "both_relaxed") {
    return "no_forage_claim";
  }
  return "forage_claim_ok";
}

export function pickHowToFish(
  archetype: ArchetypeProfileV4,
  water_clarity: WaterClarity,
): string {
  switch (water_clarity) {
    case "clear":
      return archetype.how_to_fish_variants[0]!;
    case "stained":
      return archetype.how_to_fish_variants[1]!;
    case "dirty":
      return archetype.how_to_fish_variants[2]!;
  }
}

export function buildWhyChosenV4(input: {
  archetype: ArchetypeProfileV4;
  slot_role: SlotRole;
  posture: DailyPayloadV4["posture"];
  column_shape_spread: boolean;
  headline_forage_copy: ForageCopyMode;
  pick_is_surface: boolean;
  anchor_column: TacticalColumn;
  outward_column: TacticalColumn;
  slot_column: TacticalColumn;
  slot_pace: TacticalPace;
  row: SeasonalRowV4;
}): string {
  const {
    archetype,
    slot_role,
    posture,
    column_shape_spread,
    headline_forage_copy,
    pick_is_surface,
    anchor_column,
    outward_column,
    slot_column,
    slot_pace,
    row,
  } = input;
  const display = archetype.display_name;
  const pp = posturePhrase(posture);
  const fl = forageLabel(row.primary_forage);
  const cp = columnPhrase(slot_column);
  const pap = pacePhrase(slot_pace);
  const is_degenerate_outward = anchor_column === outward_column;

  if (slot_role === "headline") {
    if (headline_forage_copy === "forage_claim_ok") {
      if (pick_is_surface) {
        return `Surface window is open and ${fl} is on the menu — start with ${display} on top before committing to subsurface.`;
      }
      return `Today's ${fl} read lines up with a ${pp} day — ${display} leads the ${cp} ${pap} line.`;
    }
    if (pick_is_surface) {
      return `Surface window is open — ${display} gives you a top-of-column look while subsurface patterns reset.`;
    }
    return `On a ${pp} day the ${cp} ${pap} lane is the play — ${display} fits the lane even though today's forage doesn't line up perfectly.`;
  }

  if (slot_role === "secondary") {
    if (column_shape_spread) {
      return `If fish are willing to feed up today, ${display} works the ${cp} ${pap} lane — one tier above the baseline.`;
    }
    return `${display} doubles down on the ${cp} ${pap} lane — a change of profile without changing the lane.`;
  }

  // outward
  if (is_degenerate_outward) {
    return `${display} keeps you in the ${cp} lane with a ${pap} change-up — the range doesn't open a deeper or higher option today.`;
  }
  if (column_shape_spread) {
    return `If the bite is tight today, ${display} drops you to the ${cp} ${pap} lane — a conservative hedge from the baseline.`;
  }
  const dir = directionPhrase(anchor_column, outward_column);
  const ocp = columnPhrase(outward_column);
  return `If the lane isn't producing, ${display} pulls you ${dir} to ${ocp} with a ${pacePhrase(
    slot_pace,
  )} look.`;
}
