/** Pass-one catalog contracts. Taxonomy inclusion does not authorize a color pool. */
export type GearMode = "lure" | "fly";
export type ColorComponent = "body" | "back" | "belly" | "accent" | "flake" |
  "skirt" | "trailer" | "blade" | "wing" | "tail" | "legs" | "head";

export interface PickerCategory {
  id: string;
  label: string;
  description: string;
  gearMode: GearMode;
  imageId: string;
}

export interface PickerBaitType {
  id: string;
  categoryId: string;
  label: string;
  description: string;
  searchAliases: string[];
  /** Authoring organization only; never inherit eligibility from this field. */
  ruleFamily: string;
  components: ColorComponent[];
  recipePolicy: "single_pattern" | "coordinated_components";
  imageId: string;
  /** Research readiness only; never a substitute for the explicit condition matrix. */
  poolStatus: "research_pending" | "reviewed_heuristic";
}

export type ArchetypeMapping = {
  gearMode: GearMode;
  archetypeId: string;
  reason: string;
} & (
  | { disposition: "mapped"; typeId: string }
  | { disposition: "choose_type"; typeIds: string[] }
  | { disposition: "excluded"; exclusion: string }
);

export interface PickerImageRequirement {
  id: string;
  role: "category" | "bait_type" | "clarity";
  subjectId: string;
  targetPath: string;
  referencePaths: string[];
  status: "reference_review_pending" | "generation_needed";
  brief: string;
}

export interface PickerTaxonomy {
  version: string;
  scope: string;
  categories: PickerCategory[];
  baitTypes: PickerBaitType[];
  archetypeMappings: ArchetypeMapping[];
  imageRequirements: PickerImageRequirement[];
  deferredTypes: { id: string; reason: string }[];
}
