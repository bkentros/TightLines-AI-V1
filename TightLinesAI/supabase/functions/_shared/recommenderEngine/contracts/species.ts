/**
 * Species groups supported in V1.
 * Salmon deferred. Lake trout / steelhead deferred. Nymphs / dry flies deferred.
 */

export const SPECIES_GROUPS = [
  "largemouth_bass",
  "smallmouth_bass",
  "pike_musky",
  "river_trout",
  "walleye",
  "redfish",
  "snook",
  "seatrout",
  "striped_bass",
  "tarpon",
] as const;

export type SpeciesGroup = (typeof SPECIES_GROUPS)[number];

export function isSpeciesGroup(x: string): x is SpeciesGroup {
  return (SPECIES_GROUPS as readonly string[]).includes(x);
}

export type SpeciesWaterType = "freshwater" | "saltwater";

export const SPECIES_META: Record<
  SpeciesGroup,
  { display_name: string; water_type: SpeciesWaterType; short_label: string }
> = {
  largemouth_bass: {
    display_name: "Largemouth Bass",
    water_type: "freshwater",
    short_label: "Largemouth",
  },
  smallmouth_bass: {
    display_name: "Smallmouth Bass",
    water_type: "freshwater",
    short_label: "Smallmouth",
  },
  pike_musky: {
    display_name: "Pike / Musky",
    water_type: "freshwater",
    short_label: "Pike / Musky",
  },
  river_trout: {
    display_name: "River Trout",
    water_type: "freshwater",
    short_label: "River Trout",
  },
  walleye: {
    display_name: "Walleye",
    water_type: "freshwater",
    short_label: "Walleye",
  },
  redfish: {
    display_name: "Redfish",
    water_type: "saltwater",
    short_label: "Redfish",
  },
  snook: {
    display_name: "Snook",
    water_type: "saltwater",
    short_label: "Snook",
  },
  seatrout: {
    display_name: "Seatrout",
    water_type: "saltwater",
    short_label: "Seatrout",
  },
  striped_bass: {
    display_name: "Striped Bass",
    water_type: "saltwater",
    short_label: "Striped Bass",
  },
  tarpon: {
    display_name: "Tarpon",
    water_type: "saltwater",
    short_label: "Tarpon",
  },
};
