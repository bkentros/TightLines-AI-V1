export type RiverRunFishingMethod = {
  title: string;
  detail: string;
};

export type RiverRunFishingGuide = {
  title: string;
  biteContext: string;
  methods: RiverRunFishingMethod[];
};

const PACIFIC_SALMON_GUIDE: RiverRunFishingGuide = {
  title: "Chinook & Coho approaches",
  biteContext:
    "Mature Chinook and Coho in the river are usually not feeding consistently. Most takes are reactionary or territorial, so every presentation must give the fish a fair chance to take it voluntarily.",
  methods: [
    {
      title: "Float or centerpin eggs",
      detail:
        "Drifting cured skein or spawn beneath a float is a highly effective salmon presentation where bait is legal.",
    },
    {
      title: "Spinners and plugs",
      detail:
        "Cast or work spinners and minnow-style plugs such as ThunderSticks for a reaction bite without crowding or lining fish.",
    },
    {
      title: "Bottom-drift or chuck-and-duck",
      detail:
        "On fly or gear tackle, use a legal weight setup to drift egg-yarn or egg-sucking-leech patterns naturally through travel lanes and holding water.",
    },
    {
      title: "Beads",
      detail:
        "Fish an egg-imitation bead only with a legal hook, attachment and spacing setup for the water you are fishing.",
    },
    {
      title: "Swinging flies",
      detail:
        "Use a sink tip to swing streamers or other wet flies across likely lanes for a controlled reaction presentation.",
    },
  ],
};

const STEELHEAD_GUIDE: RiverRunFishingGuide = {
  title: "Steelhead approaches",
  biteContext:
    "Steelhead continue to feed in rivers, though reaction strikes matter too. Match the method to depth, speed and the water the fish are using.",
  methods: [
    {
      title: "Float or centerpin presentations",
      detail:
        "Drift spawn bags, legal beads, jigs, egg patterns or nymphs beneath a float through seams, pools and travel lanes.",
    },
    {
      title: "Indicator nymphing",
      detail:
        "Present egg patterns and aquatic-insect imitations such as stonefly, caddis or mayfly nymphs close to the fish at a natural pace.",
    },
    {
      title: "Swinging flies",
      detail:
        "Swing streamers, wet flies or egg-sucking leeches with a floating, intermediate or sink-tip setup suited to the run.",
    },
    {
      title: "Stripping flies",
      detail:
        "Retrieve streamers through pools, current breaks and softer edges with a controlled strip, varying speed and pause length until the fish show a preference.",
    },
    {
      title: "Spinners, spoons and plugs",
      detail:
        "Cover holding water with hardware or minnow-style plugs for feeding or reaction bites where those lures are legal.",
    },
    {
      title: "Bottom drifting",
      detail:
        "Drift spawn, egg patterns, nymphs or a legal bead setup with only enough weight to maintain a natural presentation.",
    },
  ],
};

const GENERAL_GUIDE: RiverRunFishingGuide = {
  title: "River-run approaches",
  biteContext:
    "Fish behavior changes by species, season and river reach. Use a controlled presentation that the fish can take voluntarily.",
  methods: [
    {
      title: "Drift presentations",
      detail:
        "Present legal bait, flies or egg imitations naturally through travel lanes and holding water.",
    },
    {
      title: "Swing or cast",
      detail:
        "Cover likely water with legal flies or lures while maintaining control of the presentation.",
    },
  ],
};

export const RIVER_RUN_REGULATION_REMINDER =
  "CHECK BEFORE FISHING: Rules vary by river and by reach. Water may be flies-only or artificial-lures-only and may have bait, bead, hook, weight, seasonal-closure, dam or weir restrictions. Check the current regulations and every signed boundary before fishing. Never snag, attempt to snag or keep a fish that was not hooked voluntarily in the mouth.";

export function riverRunFishingGuideForSpecies(
  species: string,
): RiverRunFishingGuide {
  if (species === "chinook_salmon" || species === "coho_salmon") {
    return PACIFIC_SALMON_GUIDE;
  }
  if (species === "steelhead") return STEELHEAD_GUIDE;
  return GENERAL_GUIDE;
}
