/**
 * State-level species availability gating.
 *
 * Rules:
 *   primary  — meaningful, reliable fishery that anglers specifically target.
 *   marginal — present but limited (stocked-only, edge of range, niche).
 *   absent   — not listed = not a real target fishery in this state.
 *
 * contexts array — which engine contexts the species is valid in for this state.
 * Prevents invalid combos (e.g. tarpon in freshwater_lake_pond).
 */

import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { SpeciesGroup } from "../contracts/species.ts";

export type SpeciesAvailabilityTier = "primary" | "marginal";

export type StateSpeciesEntry = {
  tier: SpeciesAvailabilityTier;
  contexts: EngineContext[];
};

export type StateSpeciesMap = Partial<Record<SpeciesGroup, StateSpeciesEntry>>;

const FW: EngineContext[] = ["freshwater_lake_pond", "freshwater_river"];
const FW_LAKE: EngineContext[] = ["freshwater_lake_pond"];
const FW_RIVER: EngineContext[] = ["freshwater_river"];
const COAST: EngineContext[] = ["coastal", "coastal_flats_estuary"];
const COAST_ONLY: EngineContext[] = ["coastal"];
const ALL_FW: EngineContext[] = FW;

export const STATE_SPECIES_MAP: Record<string, StateSpeciesMap> = {
  // ─── Alabama ──────────────────────────────────────────────────────────────
  AL: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
    redfish:         { tier: "primary",  contexts: COAST },
    seatrout:        { tier: "primary",  contexts: COAST },
  },

  // ─── Alaska ───────────────────────────────────────────────────────────────
  AK: {
    river_trout:  { tier: "primary", contexts: FW_RIVER },
    pike_musky:   { tier: "primary", contexts: FW_LAKE },
  },

  // ─── Arizona ──────────────────────────────────────────────────────────────
  AZ: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Arkansas ─────────────────────────────────────────────────────────────
  AR: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    walleye:         { tier: "primary",  contexts: FW },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
  },

  // ─── California ───────────────────────────────────────────────────────────
  CA: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    striped_bass:    { tier: "primary",  contexts: ["freshwater_lake_pond", "freshwater_river", "coastal"] },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Colorado ─────────────────────────────────────────────────────────────
  CO: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    pike_musky:      { tier: "primary",  contexts: FW },
  },

  // ─── Connecticut ──────────────────────────────────────────────────────────
  CT: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: COAST_ONLY },
  },

  // ─── Delaware ─────────────────────────────────────────────────────────────
  DE: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    striped_bass:    { tier: "primary",  contexts: COAST_ONLY },
    seatrout:        { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── District of Columbia ────────────────────────────────────────────────
  DC: {
    largemouth_bass: { tier: "marginal", contexts: FW },
    striped_bass:    { tier: "primary",  contexts: ["freshwater_river", "coastal"] },
  },

  // ─── Florida ──────────────────────────────────────────────────────────────
  FL: {
    largemouth_bass: { tier: "primary", contexts: FW },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
    redfish:         { tier: "primary", contexts: COAST },
    snook:           { tier: "primary", contexts: COAST },
    seatrout:        { tier: "primary", contexts: COAST },
    tarpon:          { tier: "primary", contexts: COAST },
  },

  // ─── Georgia ──────────────────────────────────────────────────────────────
  GA: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    redfish:         { tier: "primary",  contexts: COAST },
    seatrout:        { tier: "primary",  contexts: COAST },
    tarpon:          { tier: "marginal", contexts: COAST },
  },

  // ─── Hawaii ───────────────────────────────────────────────────────────────
  HI: {
    largemouth_bass: { tier: "marginal", contexts: FW },
  },

  // ─── Idaho ────────────────────────────────────────────────────────────────
  ID: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Illinois ─────────────────────────────────────────────────────────────
  IL: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "primary",  contexts: FW },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Indiana ──────────────────────────────────────────────────────────────
  IN: {
    largemouth_bass: { tier: "primary", contexts: FW },
    smallmouth_bass: { tier: "primary", contexts: FW },
    walleye:         { tier: "primary", contexts: FW },
    pike_musky:      { tier: "primary", contexts: FW },
  },

  // ─── Iowa ─────────────────────────────────────────────────────────────────
  IA: {
    largemouth_bass: { tier: "primary", contexts: FW },
    smallmouth_bass: { tier: "primary", contexts: FW },
    walleye:         { tier: "primary", contexts: FW },
    pike_musky:      { tier: "primary", contexts: FW },
  },

  // ─── Kansas ───────────────────────────────────────────────────────────────
  KS: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
  },

  // ─── Kentucky ─────────────────────────────────────────────────────────────
  KY: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Louisiana ────────────────────────────────────────────────────────────
  LA: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
    redfish:         { tier: "primary",  contexts: COAST },
    seatrout:        { tier: "primary",  contexts: COAST },
    snook:           { tier: "marginal", contexts: COAST },
    tarpon:          { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── Maine ────────────────────────────────────────────────────────────────
  ME: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    pike_musky:      { tier: "primary",  contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: COAST_ONLY },
  },

  // ─── Maryland ─────────────────────────────────────────────────────────────
  MD: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: ["freshwater_river", "coastal"] },
    seatrout:        { tier: "marginal", contexts: COAST_ONLY },
    redfish:         { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── Massachusetts ────────────────────────────────────────────────────────
  MA: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: COAST_ONLY },
  },

  // ─── Michigan ─────────────────────────────────────────────────────────────
  MI: {
    largemouth_bass: { tier: "primary", contexts: FW },
    smallmouth_bass: { tier: "primary", contexts: FW },
    river_trout:     { tier: "primary", contexts: FW_RIVER },
    walleye:         { tier: "primary", contexts: FW },
    pike_musky:      { tier: "primary", contexts: FW },
  },

  // ─── Minnesota ────────────────────────────────────────────────────────────
  MN: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "primary",  contexts: FW },
  },

  // ─── Mississippi ──────────────────────────────────────────────────────────
  MS: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
    redfish:         { tier: "primary",  contexts: COAST },
    seatrout:        { tier: "primary",  contexts: COAST },
  },

  // ─── Missouri ─────────────────────────────────────────────────────────────
  MO: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
  },

  // ─── Montana ──────────────────────────────────────────────────────────────
  MT: {
    largemouth_bass: { tier: "marginal", contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    pike_musky:      { tier: "primary",  contexts: FW },
  },

  // ─── Nebraska ─────────────────────────────────────────────────────────────
  NE: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Nevada ───────────────────────────────────────────────────────────────
  NV: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── New Hampshire ────────────────────────────────────────────────────────
  NH: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── New Jersey ───────────────────────────────────────────────────────────
  NJ: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: COAST_ONLY },
    seatrout:        { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── New Mexico ───────────────────────────────────────────────────────────
  NM: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── New York ─────────────────────────────────────────────────────────────
  NY: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "primary",  contexts: FW },
    striped_bass:    { tier: "primary",  contexts: COAST_ONLY },
  },

  // ─── North Carolina ───────────────────────────────────────────────────────
  NC: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: ["freshwater_lake_pond", "coastal"] },
    redfish:         { tier: "primary",  contexts: COAST },
    seatrout:        { tier: "primary",  contexts: COAST },
    tarpon:          { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── North Dakota ─────────────────────────────────────────────────────────
  ND: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "primary",  contexts: FW },
  },

  // ─── Ohio ─────────────────────────────────────────────────────────────────
  OH: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "marginal", contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "primary",  contexts: FW },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Oklahoma ─────────────────────────────────────────────────────────────
  OK: {
    largemouth_bass: { tier: "primary", contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
  },

  // ─── Oregon ───────────────────────────────────────────────────────────────
  OR: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    striped_bass:    { tier: "marginal", contexts: ["freshwater_river", "coastal"] },
  },

  // ─── Pennsylvania ─────────────────────────────────────────────────────────
  PA: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "primary",  contexts: FW },
    striped_bass:    { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── Rhode Island ─────────────────────────────────────────────────────────
  RI: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    river_trout:     { tier: "marginal", contexts: FW_RIVER },
    striped_bass:    { tier: "primary",  contexts: COAST_ONLY },
  },

  // ─── South Carolina ───────────────────────────────────────────────────────
  SC: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: ["freshwater_lake_pond", "coastal"] },
    redfish:         { tier: "primary",  contexts: COAST },
    seatrout:        { tier: "primary",  contexts: COAST },
    tarpon:          { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── South Dakota ─────────────────────────────────────────────────────────
  SD: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "primary",  contexts: FW },
  },

  // ─── Tennessee ────────────────────────────────────────────────────────────
  TN: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
    river_trout:     { tier: "marginal", contexts: FW_RIVER },
  },

  // ─── Texas ────────────────────────────────────────────────────────────────
  TX: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: FW_LAKE },
    redfish:         { tier: "primary",  contexts: COAST },
    seatrout:        { tier: "primary",  contexts: COAST },
    snook:           { tier: "marginal", contexts: COAST },
    tarpon:          { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── Utah ─────────────────────────────────────────────────────────────────
  UT: {
    largemouth_bass: { tier: "primary",  contexts: FW_LAKE },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Vermont ──────────────────────────────────────────────────────────────
  VT: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    pike_musky:      { tier: "primary",  contexts: FW_LAKE },
  },

  // ─── Virginia ─────────────────────────────────────────────────────────────
  VA: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "marginal", contexts: FW_LAKE },
    striped_bass:    { tier: "primary",  contexts: ["freshwater_lake_pond", "coastal"] },
    redfish:         { tier: "marginal", contexts: COAST_ONLY },
    seatrout:        { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── Washington ───────────────────────────────────────────────────────────
  WA: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    striped_bass:    { tier: "marginal", contexts: COAST_ONLY },
  },

  // ─── West Virginia ────────────────────────────────────────────────────────
  WV: {
    largemouth_bass: { tier: "primary",  contexts: FW },
    smallmouth_bass: { tier: "primary",  contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
  },

  // ─── Wisconsin ────────────────────────────────────────────────────────────
  WI: {
    largemouth_bass: { tier: "primary", contexts: FW },
    smallmouth_bass: { tier: "primary", contexts: FW },
    river_trout:     { tier: "primary", contexts: FW_RIVER },
    walleye:         { tier: "primary", contexts: FW },
    pike_musky:      { tier: "primary", contexts: FW },
  },

  // ─── Wyoming ──────────────────────────────────────────────────────────────
  WY: {
    largemouth_bass: { tier: "marginal", contexts: FW_LAKE },
    smallmouth_bass: { tier: "marginal", contexts: FW },
    river_trout:     { tier: "primary",  contexts: FW_RIVER },
    walleye:         { tier: "primary",  contexts: FW_LAKE },
    pike_musky:      { tier: "marginal", contexts: FW_LAKE },
  },
};

// ─── Query helpers ────────────────────────────────────────────────────────────

export function getValidSpeciesForState(
  state_code: string,
  context: EngineContext,
): Array<{ species: SpeciesGroup; tier: SpeciesAvailabilityTier }> {
  const stateMap = STATE_SPECIES_MAP[state_code.toUpperCase()] ?? {};
  return (Object.entries(stateMap) as [SpeciesGroup, StateSpeciesEntry][])
    .filter(([, entry]) => entry.contexts.includes(context))
    .map(([species, entry]) => ({ species, tier: entry.tier }));
}

export function isSpeciesValidForState(
  state_code: string,
  species: SpeciesGroup,
  context: EngineContext,
): boolean {
  const entry = STATE_SPECIES_MAP[state_code.toUpperCase()]?.[species];
  return entry != null && entry.contexts.includes(context);
}

export function getSpeciesTierForState(
  state_code: string,
  species: SpeciesGroup,
): SpeciesAvailabilityTier | null {
  return STATE_SPECIES_MAP[state_code.toUpperCase()]?.[species]?.tier ?? null;
}
