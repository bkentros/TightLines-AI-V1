import type { PoolResearchProfile } from "./researchSchema.ts";

export const RESEARCH_PROFILES: readonly PoolResearchProfile[] = [
  {
    "id": "bottom_plastic",
    "sourceIds": [
      "plastic_clarity",
      "pumpkin_variants",
      "hard_light"
    ],
    "principle": "Natural plastic palettes and darker opaque alternatives are both represented.",
    "extension": "Texas-rig color guidance is extended to other bottom-plastic shapes. Restricting the most translucent recipes in cloudy sets is editorial, not direct evidence for every worm, craw or tube. Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion.",
    "cells": {
      "clear_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_seed",
        "plastic_watermelon_red",
        "plastic_pumpkinseed",
        "plastic_smoke",
        "plastic_brown",
        "plastic_black"
      ],
      "clear_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug"
      ],
      "stained_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_red",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug"
      ],
      "stained_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug"
      ],
      "dirty_sunny": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin"
      ],
      "dirty_cloudy": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion.",
      "clear_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion.",
      "stained_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion.",
      "stained_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion.",
      "dirty_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion.",
      "dirty_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion."
    }
  },
  {
    "id": "baitfish_plastic",
    "sourceIds": [
      "plastic_clarity",
      "plastic_jerk",
      "hard_light"
    ],
    "principle": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives.",
    "extension": "White soft-jerkbait guidance is extended to soft minnows/swimbaits. Chartreuse and the precise sky intersections are editorial applications of opacity/contrast, not sourced species preferences. Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
    "cells": {
      "clear_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_smoke_silver",
        "plastic_smoke",
        "plastic_green_pumpkin"
      ],
      "clear_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_black"
      ],
      "stained_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_chartreuse",
        "plastic_black"
      ],
      "stained_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_chartreuse",
        "plastic_black"
      ],
      "dirty_sunny": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl"
      ],
      "dirty_cloudy": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "clear_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "stained_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "stained_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "dirty_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "dirty_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive."
    }
  },
  {
    "id": "bottom_jig",
    "sourceIds": [
      "jig_bottom",
      "jig_muddy",
      "skirt_palette",
      "jig_green_muddy",
      "jig_pbj",
      "jig_pbj_recipe"
    ],
    "principle": "Bottom jigs retain coordinated earth-tone or dark skirt/trailer recipes.",
    "extension": "PB&J adds documented brown/purple skirt contrast, including clear-water jig guidance. Stained and murky eligibility and matching brown trailer are editorial extensions. Existing entries retain their cited profile guidance; no exact commercial SKU is required.",
    "cells": {
      "clear_sunny": [
        "jig_green_pumpkin",
        "jig_brown",
        "jig_brown_orange",
        "jig_bluegill",
        "jig_pbj"
      ],
      "clear_cloudy": [
        "jig_green_pumpkin",
        "jig_brown",
        "jig_brown_orange",
        "jig_bluegill",
        "jig_pbj"
      ],
      "stained_sunny": [
        "jig_green_pumpkin",
        "jig_brown",
        "jig_brown_orange",
        "jig_black_blue",
        "jig_black",
        "jig_pbj"
      ],
      "stained_cloudy": [
        "jig_green_pumpkin",
        "jig_brown",
        "jig_brown_orange",
        "jig_black_blue",
        "jig_black",
        "jig_pbj"
      ],
      "dirty_sunny": [
        "jig_black_blue",
        "jig_black",
        "jig_brown",
        "jig_green_pumpkin",
        "jig_pbj"
      ],
      "dirty_cloudy": [
        "jig_black_blue",
        "jig_black",
        "jig_brown",
        "jig_green_pumpkin",
        "jig_pbj"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Bottom jigs retain coordinated earth-tone or dark skirt/trailer recipes. PB&J adds documented brown/purple skirt contrast, including clear-water jig guidance. Stained and murky eligibility and matching brown trailer are editorial extensions. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Bottom jigs retain coordinated earth-tone or dark skirt/trailer recipes. PB&J adds documented brown/purple skirt contrast, including clear-water jig guidance. Stained and murky eligibility and matching brown trailer are editorial extensions. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Bottom jigs retain coordinated earth-tone or dark skirt/trailer recipes. PB&J adds documented brown/purple skirt contrast, including clear-water jig guidance. Stained and murky eligibility and matching brown trailer are editorial extensions. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_cloudy": "Bottom jigs retain coordinated earth-tone or dark skirt/trailer recipes. PB&J adds documented brown/purple skirt contrast, including clear-water jig guidance. Stained and murky eligibility and matching brown trailer are editorial extensions. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_sunny": "Bottom jigs retain coordinated earth-tone or dark skirt/trailer recipes. PB&J adds documented brown/purple skirt contrast, including clear-water jig guidance. Stained and murky eligibility and matching brown trailer are editorial extensions. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Bottom jigs retain coordinated earth-tone or dark skirt/trailer recipes. PB&J adds documented brown/purple skirt contrast, including clear-water jig guidance. Stained and murky eligibility and matching brown trailer are editorial extensions. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "swim_jig",
    "sourceIds": [
      "swim_jig",
      "skirt_palette"
    ],
    "principle": "Swim-jig recipes distinguish baitfish skirts from darker silhouettes.",
    "extension": "Whole skirt/trailer matches and solid-black extension are editorial. There is no evidence-based reason to force a different sky pool.",
    "cells": {
      "clear_sunny": [
        "jig_white",
        "jig_green_pumpkin",
        "jig_bluegill",
        "jig_white_chartreuse"
      ],
      "clear_cloudy": [
        "jig_white",
        "jig_green_pumpkin",
        "jig_bluegill",
        "jig_white_chartreuse"
      ],
      "stained_sunny": [
        "jig_white",
        "jig_white_chartreuse",
        "jig_green_pumpkin",
        "jig_black_blue",
        "jig_bluegill"
      ],
      "stained_cloudy": [
        "jig_white",
        "jig_white_chartreuse",
        "jig_green_pumpkin",
        "jig_black_blue",
        "jig_bluegill"
      ],
      "dirty_sunny": [
        "jig_white",
        "jig_white_chartreuse",
        "jig_black_blue",
        "jig_black"
      ],
      "dirty_cloudy": [
        "jig_white",
        "jig_white_chartreuse",
        "jig_black_blue",
        "jig_black"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Swim-jig recipes distinguish baitfish skirts from darker silhouettes. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "clear_cloudy": "Swim-jig recipes distinguish baitfish skirts from darker silhouettes. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_sunny": "Swim-jig recipes distinguish baitfish skirts from darker silhouettes. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_cloudy": "Swim-jig recipes distinguish baitfish skirts from darker silhouettes. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "dirty_sunny": "Swim-jig recipes distinguish baitfish skirts from darker silhouettes. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "dirty_cloudy": "Swim-jig recipes distinguish baitfish skirts from darker silhouettes. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity."
    }
  },
  {
    "id": "hair_jig",
    "sourceIds": [
      "hair_palette",
      "hair_dark",
      "metal_blade"
    ],
    "principle": "Hair-jig choices retain fiber-appropriate dark, natural and light palettes.",
    "extension": "Olive is an editorial natural-fiber extension; white/chartreuse uses an accent rather than inferring a solid chartreuse species preference. Murky sets are contrast-based extensions. Dark-brown fibers were excluded too aggressively despite their dark profile; restored as an editorial alternative.",
    "cells": {
      "clear_sunny": [
        "hair_black",
        "hair_brown",
        "hair_olive",
        "hair_white"
      ],
      "clear_cloudy": [
        "hair_black",
        "hair_brown",
        "hair_olive",
        "hair_white"
      ],
      "stained_sunny": [
        "hair_black",
        "hair_brown",
        "hair_white",
        "hair_white_chartreuse"
      ],
      "stained_cloudy": [
        "hair_black",
        "hair_brown",
        "hair_white",
        "hair_white_chartreuse"
      ],
      "dirty_sunny": [
        "hair_black",
        "hair_white",
        "hair_white_chartreuse",
        "hair_brown"
      ],
      "dirty_cloudy": [
        "hair_black",
        "hair_white",
        "hair_white_chartreuse",
        "hair_brown"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Hair-jig choices retain fiber-appropriate dark, natural and light palettes. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Dark-brown fibers were excluded too aggressively despite their dark profile; restored as an editorial alternative.",
      "clear_cloudy": "Hair-jig choices retain fiber-appropriate dark, natural and light palettes. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Dark-brown fibers were excluded too aggressively despite their dark profile; restored as an editorial alternative.",
      "stained_sunny": "Hair-jig choices retain fiber-appropriate dark, natural and light palettes. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Dark-brown fibers were excluded too aggressively despite their dark profile; restored as an editorial alternative.",
      "stained_cloudy": "Hair-jig choices retain fiber-appropriate dark, natural and light palettes. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Dark-brown fibers were excluded too aggressively despite their dark profile; restored as an editorial alternative.",
      "dirty_sunny": "Hair-jig choices retain fiber-appropriate dark, natural and light palettes. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Dark-brown fibers were excluded too aggressively despite their dark profile; restored as an editorial alternative.",
      "dirty_cloudy": "Hair-jig choices retain fiber-appropriate dark, natural and light palettes. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Dark-brown fibers were excluded too aggressively despite their dark profile; restored as an editorial alternative."
    }
  },
  {
    "id": "spinner",
    "sourceIds": [
      "spinner_components",
      "skirt_palette",
      "swim_jig",
      "buzz_bluegill",
      "spinner_bluegill_known"
    ],
    "principle": "Each choice pairs a skirt/trailer palette with an explicit blade finish.",
    "extension": "Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Bluegill replaces the overly specific green-pumpkin/black-blade recipe; spinnerbait application follows cited skirt palettes.",
    "cells": {
      "clear_sunny": [
        "spinner_white_silver",
        "spinner_white_chartreuse",
        "spinner_bluegill"
      ],
      "clear_cloudy": [
        "spinner_white_silver",
        "spinner_bluegill",
        "spinner_black_blue"
      ],
      "stained_sunny": [
        "spinner_white_silver",
        "spinner_white_chartreuse",
        "spinner_bluegill",
        "spinner_chartreuse",
        "spinner_black_blue"
      ],
      "stained_cloudy": [
        "spinner_white_silver",
        "spinner_white_chartreuse",
        "spinner_bluegill",
        "spinner_chartreuse",
        "spinner_black_blue"
      ],
      "dirty_sunny": [
        "spinner_chartreuse",
        "spinner_white_chartreuse",
        "spinner_black_blue",
        "spinner_white_silver"
      ],
      "dirty_cloudy": [
        "spinner_chartreuse",
        "spinner_white_chartreuse",
        "spinner_black_blue",
        "spinner_white_silver"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Bluegill replaces the overly specific green-pumpkin/black-blade recipe; spinnerbait application follows cited skirt palettes. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "clear_cloudy": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Bluegill replaces the overly specific green-pumpkin/black-blade recipe; spinnerbait application follows cited skirt palettes. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_sunny": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Bluegill replaces the overly specific green-pumpkin/black-blade recipe; spinnerbait application follows cited skirt palettes. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_cloudy": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Bluegill replaces the overly specific green-pumpkin/black-blade recipe; spinnerbait application follows cited skirt palettes. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_sunny": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Bluegill replaces the overly specific green-pumpkin/black-blade recipe; spinnerbait application follows cited skirt palettes. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_cloudy": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Bluegill replaces the overly specific green-pumpkin/black-blade recipe; spinnerbait application follows cited skirt palettes. Exact clarity/light membership remains an editorial application of the cited guidance."
    }
  },
  {
    "id": "bladed",
    "sourceIds": [
      "spinner_components",
      "skirt_palette",
      "swim_jig",
      "bladed_finish",
      "bladed_known"
    ],
    "principle": "Each choice pairs a skirt/trailer palette with an explicit blade finish.",
    "extension": "Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint.",
    "cells": {
      "clear_sunny": [
        "bladed_white_silver",
        "bladed_white_chartreuse",
        "bladed_green_pumpkin"
      ],
      "clear_cloudy": [
        "bladed_white_silver",
        "bladed_green_pumpkin",
        "bladed_black_blue"
      ],
      "stained_sunny": [
        "bladed_white_silver",
        "bladed_white_chartreuse",
        "bladed_green_pumpkin",
        "bladed_chartreuse",
        "bladed_black_blue"
      ],
      "stained_cloudy": [
        "bladed_white_silver",
        "bladed_white_chartreuse",
        "bladed_green_pumpkin",
        "bladed_chartreuse",
        "bladed_black_blue"
      ],
      "dirty_sunny": [
        "bladed_chartreuse",
        "bladed_white_chartreuse",
        "bladed_black_blue",
        "bladed_white_silver"
      ],
      "dirty_cloudy": [
        "bladed_chartreuse",
        "bladed_white_chartreuse",
        "bladed_black_blue",
        "bladed_white_silver"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "clear_cloudy": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_sunny": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_cloudy": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_sunny": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_cloudy": "Each choice pairs a skirt/trailer palette with an explicit blade finish. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance."
    }
  },
  {
    "id": "buzz",
    "sourceIds": [
      "buzz_palette",
      "buzz_bluegill",
      "buzz_mixed"
    ],
    "principle": "White, black and chartreuse remain documented buzzbait alternatives.",
    "extension": "Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint.",
    "cells": {
      "clear_sunny": [
        "buzz_white",
        "buzz_black",
        "buzz_chartreuse",
        "buzz_bluegill",
        "buzz_white_chartreuse"
      ],
      "clear_cloudy": [
        "buzz_white",
        "buzz_black",
        "buzz_chartreuse",
        "buzz_bluegill",
        "buzz_white_chartreuse"
      ],
      "stained_sunny": [
        "buzz_white",
        "buzz_black",
        "buzz_chartreuse",
        "buzz_white_chartreuse"
      ],
      "stained_cloudy": [
        "buzz_white",
        "buzz_black",
        "buzz_chartreuse",
        "buzz_white_chartreuse"
      ],
      "dirty_sunny": [
        "buzz_white",
        "buzz_black",
        "buzz_chartreuse",
        "buzz_white_chartreuse"
      ],
      "dirty_cloudy": [
        "buzz_white",
        "buzz_black",
        "buzz_chartreuse",
        "buzz_white_chartreuse"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "White, black and chartreuse remain documented buzzbait alternatives. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "clear_cloudy": "White, black and chartreuse remain documented buzzbait alternatives. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_sunny": "White, black and chartreuse remain documented buzzbait alternatives. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_cloudy": "White, black and chartreuse remain documented buzzbait alternatives. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_sunny": "White, black and chartreuse remain documented buzzbait alternatives. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_cloudy": "White, black and chartreuse remain documented buzzbait alternatives. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance."
    }
  },
  {
    "id": "inline",
    "sourceIds": [
      "metal_contrast",
      "metal_trout",
      "spinner_components",
      "spinner_contrast"
    ],
    "principle": "Blade and dressing combinations provide different contrast treatments.",
    "extension": "Black/white-dot blade adds documented dark/light contrast. Black/chartreuse also remains eligible in clear water: the source supports dark dotted blades in sun and low light. Dressing and exact clarity application are editorial. Existing entries retain their cited profile guidance; no exact commercial SKU is required.",
    "cells": {
      "clear_sunny": [
        "inline_silver",
        "inline_gold",
        "inline_copper",
        "inline_black_white",
        "inline_black_chartreuse"
      ],
      "clear_cloudy": [
        "inline_silver",
        "inline_gold",
        "inline_copper",
        "inline_black_white",
        "inline_black_chartreuse"
      ],
      "stained_sunny": [
        "inline_silver",
        "inline_gold",
        "inline_firetiger",
        "inline_black_chartreuse",
        "inline_black_white"
      ],
      "stained_cloudy": [
        "inline_silver",
        "inline_gold",
        "inline_firetiger",
        "inline_black_chartreuse",
        "inline_black_white"
      ],
      "dirty_sunny": [
        "inline_silver",
        "inline_firetiger",
        "inline_black_chartreuse",
        "inline_black_white"
      ],
      "dirty_cloudy": [
        "inline_silver",
        "inline_firetiger",
        "inline_black_chartreuse",
        "inline_black_white"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast. Black/chartreuse also remains eligible in clear water: the source supports dark dotted blades in sun and low light. Dressing and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast. Black/chartreuse also remains eligible in clear water: the source supports dark dotted blades in sun and low light. Dressing and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast. Black/chartreuse also remains eligible in clear water: the source supports dark dotted blades in sun and low light. Dressing and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_cloudy": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast. Black/chartreuse also remains eligible in clear water: the source supports dark dotted blades in sun and low light. Dressing and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_sunny": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast. Black/chartreuse also remains eligible in clear water: the source supports dark dotted blades in sun and low light. Dressing and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast. Black/chartreuse also remains eligible in clear water: the source supports dark dotted blades in sun and low light. Dressing and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "bucktail",
    "sourceIds": [
      "metal_contrast",
      "metal_trout",
      "spinner_components",
      "spinner_contrast"
    ],
    "principle": "Blade and dressing combinations provide different contrast treatments.",
    "extension": "Black/white-dot blade adds documented dark/light contrast with realistic black hair dressing. Black/chartreuse also remains eligible in clear water; the dressing transfer and exact clarity application are editorial. Existing entries retain their cited profile guidance; no exact commercial SKU is required.",
    "cells": {
      "clear_sunny": [
        "bucktail_silver",
        "bucktail_gold",
        "bucktail_copper",
        "bucktail_black_white",
        "bucktail_black_chartreuse"
      ],
      "clear_cloudy": [
        "bucktail_silver",
        "bucktail_gold",
        "bucktail_copper",
        "bucktail_black_white",
        "bucktail_black_chartreuse"
      ],
      "stained_sunny": [
        "bucktail_silver",
        "bucktail_gold",
        "bucktail_firetiger",
        "bucktail_black_chartreuse",
        "bucktail_black_white"
      ],
      "stained_cloudy": [
        "bucktail_silver",
        "bucktail_gold",
        "bucktail_firetiger",
        "bucktail_black_chartreuse",
        "bucktail_black_white"
      ],
      "dirty_sunny": [
        "bucktail_silver",
        "bucktail_firetiger",
        "bucktail_black_chartreuse",
        "bucktail_black_white"
      ],
      "dirty_cloudy": [
        "bucktail_silver",
        "bucktail_firetiger",
        "bucktail_black_chartreuse",
        "bucktail_black_white"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast with realistic black hair dressing. Black/chartreuse also remains eligible in clear water; the dressing transfer and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast with realistic black hair dressing. Black/chartreuse also remains eligible in clear water; the dressing transfer and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast with realistic black hair dressing. Black/chartreuse also remains eligible in clear water; the dressing transfer and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_cloudy": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast with realistic black hair dressing. Black/chartreuse also remains eligible in clear water; the dressing transfer and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_sunny": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast with realistic black hair dressing. Black/chartreuse also remains eligible in clear water; the dressing transfer and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Blade and dressing combinations provide different contrast treatments. Black/white-dot blade adds documented dark/light contrast with realistic black hair dressing. Black/chartreuse also remains eligible in clear water; the dressing transfer and exact clarity application are editorial. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "underspin",
    "sourceIds": [
      "spinner_components",
      "plastic_jerk",
      "metal_contrast",
      "underspin_known",
      "underspin_body_guidance"
    ],
    "principle": "A baitfish body and blade are treated as one coordinated pattern.",
    "extension": "Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially.",
    "cells": {
      "clear_sunny": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold"
      ],
      "clear_cloudy": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold"
      ],
      "stained_sunny": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold",
        "underspin_chartreuse",
        "underspin_white_chartreuse"
      ],
      "stained_cloudy": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold",
        "underspin_chartreuse",
        "underspin_white_chartreuse"
      ],
      "dirty_sunny": [
        "underspin_pearl_silver",
        "underspin_chartreuse",
        "underspin_white_chartreuse"
      ],
      "dirty_cloudy": [
        "underspin_pearl_silver",
        "underspin_chartreuse",
        "underspin_white_chartreuse"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "clear_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance."
    }
  },
  {
    "id": "tailspin",
    "sourceIds": [
      "spinner_components",
      "hard_multi",
      "metal_contrast",
      "tailspin_palette"
    ],
    "principle": "A baitfish body and blade are treated as one coordinated pattern.",
    "extension": "Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint.",
    "cells": {
      "clear_sunny": [
        "tailspin_pearl_silver",
        "tailspin_olive_silver",
        "tailspin_gold",
        "tailspin_perch"
      ],
      "clear_cloudy": [
        "tailspin_pearl_silver",
        "tailspin_olive_silver",
        "tailspin_gold",
        "tailspin_perch"
      ],
      "stained_sunny": [
        "tailspin_pearl_silver",
        "tailspin_olive_silver",
        "tailspin_gold",
        "tailspin_chartreuse",
        "tailspin_perch"
      ],
      "stained_cloudy": [
        "tailspin_pearl_silver",
        "tailspin_olive_silver",
        "tailspin_gold",
        "tailspin_chartreuse",
        "tailspin_perch"
      ],
      "dirty_sunny": [
        "tailspin_pearl_silver",
        "tailspin_chartreuse",
        "tailspin_perch"
      ],
      "dirty_cloudy": [
        "tailspin_pearl_silver",
        "tailspin_chartreuse",
        "tailspin_perch"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "clear_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "dirty_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. Exact clarity/light membership remains an editorial application of the cited guidance."
    }
  },
  {
    "id": "hard_crank",
    "sourceIds": [
      "hard_light",
      "hard_natural",
      "hard_opaque",
      "hard_multi",
      "jigging_catalog"
    ],
    "principle": "Hard-bait recipes distinguish translucent, metallic, natural painted and opaque contrasting finishes.",
    "extension": "Lipless opacity/light guidance is extended to lipped crankbaits. Craw patterns describe paint, not observed crawfish or season; bright paint in murk is an editorial contrast application.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_gold_black",
        "hard_perch",
        "hard_bluegill",
        "hard_brown_craw"
      ],
      "clear_cloudy": [
        "hard_pearl",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_gold_black",
        "hard_perch",
        "hard_brown_craw"
      ],
      "stained_sunny": [
        "hard_pearl",
        "hard_gold_black",
        "hard_perch",
        "hard_bluegill",
        "hard_brown_craw",
        "hard_red_craw",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "stained_cloudy": [
        "hard_pearl",
        "hard_gold_black",
        "hard_brown_craw",
        "hard_red_craw",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_sunny": [
        "hard_pearl",
        "hard_red_craw",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_cloudy": [
        "hard_pearl",
        "hard_red_craw",
        "hard_chartreuse_back",
        "hard_firetiger"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Hard-bait recipes distinguish translucent, metallic, natural painted and opaque contrasting finishes. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "clear_cloudy": "Hard-bait recipes distinguish translucent, metallic, natural painted and opaque contrasting finishes. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "stained_sunny": "Hard-bait recipes distinguish translucent, metallic, natural painted and opaque contrasting finishes. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "stained_cloudy": "Hard-bait recipes distinguish translucent, metallic, natural painted and opaque contrasting finishes. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "dirty_sunny": "Hard-bait recipes distinguish translucent, metallic, natural painted and opaque contrasting finishes. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "dirty_cloudy": "Hard-bait recipes distinguish translucent, metallic, natural painted and opaque contrasting finishes. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible."
    }
  },
  {
    "id": "hard_baitfish",
    "sourceIds": [
      "hard_light",
      "hard_natural",
      "hard_opaque",
      "hard_multi"
    ],
    "principle": "Baitfish hard bodies retain natural, metallic and opaque contrast patterns.",
    "extension": "Applying lipless guidance to jerk/minnow/glide/jointed bodies is editorial. Paint compatibility is explicit; no swimbait is claimed ideal for murky water just because colors are supplied.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_gold_black",
        "hard_perch",
        "hard_bluegill"
      ],
      "clear_cloudy": [
        "hard_pearl",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_gold_black",
        "hard_perch",
        "hard_bluegill"
      ],
      "stained_sunny": [
        "hard_pearl",
        "hard_gold_black",
        "hard_perch",
        "hard_bluegill",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "stained_cloudy": [
        "hard_pearl",
        "hard_gold_black",
        "hard_perch",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_sunny": [
        "hard_pearl",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_black"
      ],
      "dirty_cloudy": [
        "hard_pearl",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_black"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Baitfish hard bodies retain natural, metallic and opaque contrast patterns. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "clear_cloudy": "Baitfish hard bodies retain natural, metallic and opaque contrast patterns. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "stained_sunny": "Baitfish hard bodies retain natural, metallic and opaque contrast patterns. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "stained_cloudy": "Baitfish hard bodies retain natural, metallic and opaque contrast patterns. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "dirty_sunny": "Baitfish hard bodies retain natural, metallic and opaque contrast patterns. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible.",
      "dirty_cloudy": "Baitfish hard bodies retain natural, metallic and opaque contrast patterns. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible."
    }
  },
  {
    "id": "jigging_minnow",
    "sourceIds": [
      "jigging_colors",
      "jigging_catalog",
      "hard_multi"
    ],
    "principle": "Horizontal jigging minnows retain painted baitfish and bright-barred alternatives.",
    "extension": "Stained-water panfish examples inform ordinary paint contrast. Exact firetiger/chartreuse recipes are editorial; no UV/glow efficacy or actual fishing depth is inferred. Opaque barred perch retains a contrasting pattern; existing stained-water guidance does not justify rejecting all perch recipes in murk.",
    "cells": {
      "clear_sunny": [
        "hard_pearl",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_gold_black",
        "hard_perch",
        "hard_bluegill"
      ],
      "clear_cloudy": [
        "hard_pearl",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_gold_black",
        "hard_perch",
        "hard_bluegill"
      ],
      "stained_sunny": [
        "hard_pearl",
        "hard_gold_black",
        "hard_perch",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "stained_cloudy": [
        "hard_pearl",
        "hard_gold_black",
        "hard_perch",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_sunny": [
        "hard_pearl",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_perch"
      ],
      "dirty_cloudy": [
        "hard_pearl",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_perch"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Horizontal jigging minnows retain painted baitfish and bright-barred alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Opaque barred perch retains a contrasting pattern; existing stained-water guidance does not justify rejecting all perch recipes in murk.",
      "clear_cloudy": "Horizontal jigging minnows retain painted baitfish and bright-barred alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Opaque barred perch retains a contrasting pattern; existing stained-water guidance does not justify rejecting all perch recipes in murk.",
      "stained_sunny": "Horizontal jigging minnows retain painted baitfish and bright-barred alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Opaque barred perch retains a contrasting pattern; existing stained-water guidance does not justify rejecting all perch recipes in murk.",
      "stained_cloudy": "Horizontal jigging minnows retain painted baitfish and bright-barred alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Opaque barred perch retains a contrasting pattern; existing stained-water guidance does not justify rejecting all perch recipes in murk.",
      "dirty_sunny": "Horizontal jigging minnows retain painted baitfish and bright-barred alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Opaque barred perch retains a contrasting pattern; existing stained-water guidance does not justify rejecting all perch recipes in murk.",
      "dirty_cloudy": "Horizontal jigging minnows retain painted baitfish and bright-barred alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Opaque barred perch retains a contrasting pattern; existing stained-water guidance does not justify rejecting all perch recipes in murk."
    }
  },
  {
    "id": "metal",
    "sourceIds": [
      "metal_contrast",
      "metal_trout",
      "metal_blade",
      "spinner_components"
    ],
    "principle": "Metal bait finishes distinguish reflection from opaque painted contrast.",
    "extension": "Transfer of blade/contrast guidance to spoon constructions is editorial. Cloud alone does not invalidate silver; darker water does not identify a particular tint.",
    "cells": {
      "clear_sunny": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "clear_cloudy": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "stained_sunny": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger"
      ],
      "stained_cloudy": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger"
      ],
      "dirty_sunny": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black"
      ],
      "dirty_cloudy": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "clear_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "dirty_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "dirty_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity."
    }
  },
  {
    "id": "topwater",
    "sourceIds": [
      "topwater_light",
      "topwater_bone",
      "topwater_chartreuse",
      "topwater_view",
      "surface_firetiger"
    ],
    "principle": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives.",
    "extension": "Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Existing entries retain their cited profile guidance; no exact commercial SKU is required.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "clear_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_silver_black",
        "hard_firetiger"
      ],
      "stained_sunny": [
        "hard_silver_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_black",
        "hard_firetiger"
      ],
      "stained_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_sunny": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "frog",
    "sourceIds": [
      "frog_palette",
      "frog_white",
      "topwater_view",
      "frog_stripe"
    ],
    "principle": "Frog/toad patterns are distinguished by black, white or yellow underside.",
    "extension": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
    "cells": {
      "clear_sunny": [
        "frog_black",
        "frog_white",
        "frog_yellow"
      ],
      "clear_cloudy": [
        "frog_black",
        "frog_white",
        "frog_yellow"
      ],
      "stained_sunny": [
        "frog_black",
        "frog_white",
        "frog_yellow"
      ],
      "stained_cloudy": [
        "frog_black",
        "frog_white",
        "frog_yellow"
      ],
      "dirty_sunny": [
        "frog_black",
        "frog_white",
        "frog_yellow"
      ],
      "dirty_cloudy": [
        "frog_black",
        "frog_white",
        "frog_yellow"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "clear_cloudy": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "stained_sunny": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "stained_cloudy": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "dirty_sunny": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "dirty_cloudy": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations."
    }
  },
  {
    "id": "toad",
    "sourceIds": [
      "frog_palette",
      "frog_white",
      "topwater_view",
      "frog_stripe"
    ],
    "principle": "Frog/toad patterns are distinguished by black, white or yellow underside.",
    "extension": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
    "cells": {
      "clear_sunny": [
        "toad_black",
        "toad_white",
        "toad_yellow"
      ],
      "clear_cloudy": [
        "toad_black",
        "toad_white",
        "toad_yellow"
      ],
      "stained_sunny": [
        "toad_black",
        "toad_white",
        "toad_yellow"
      ],
      "stained_cloudy": [
        "toad_black",
        "toad_white",
        "toad_yellow"
      ],
      "dirty_sunny": [
        "toad_black",
        "toad_white",
        "toad_yellow"
      ],
      "dirty_cloudy": [
        "toad_black",
        "toad_white",
        "toad_yellow"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "clear_cloudy": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "stained_sunny": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "stained_cloudy": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "dirty_sunny": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations.",
      "dirty_cloudy": "Retain black, white and green/yellow-belly palettes. Remove narrow chartreuse-stripe variants rather than inflate the surface pool with a transferred custom marking. Underside emphasis and six-cell use are editorial; three choices cannot rotate combinations."
    }
  },
  {
    "id": "bugger_leech",
    "sourceIds": [
      "streamer_palette",
      "streamer_light"
    ],
    "principle": "Bugger and leech palettes use established natural, black and white fiber colors.",
    "extension": "White/black light guidance is a starting suggestion, not grounds for rejecting either. Reduced-visibility retention of brown and white is editorial. Olive fiber patterns remain a broadly documented streamer choice; do not impose an unsupported muddy-water exclusion.",
    "cells": {
      "clear_sunny": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "fly_white"
      ],
      "clear_cloudy": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "fly_white"
      ],
      "stained_sunny": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "fly_white"
      ],
      "stained_cloudy": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "fly_white"
      ],
      "dirty_sunny": [
        "fly_black",
        "fly_brown",
        "fly_white",
        "fly_olive"
      ],
      "dirty_cloudy": [
        "fly_black",
        "fly_brown",
        "fly_white",
        "fly_olive"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Bugger and leech palettes use established natural, black and white fiber colors. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Olive fiber patterns remain a broadly documented streamer choice; do not impose an unsupported muddy-water exclusion.",
      "clear_cloudy": "Bugger and leech palettes use established natural, black and white fiber colors. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Olive fiber patterns remain a broadly documented streamer choice; do not impose an unsupported muddy-water exclusion.",
      "stained_sunny": "Bugger and leech palettes use established natural, black and white fiber colors. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Olive fiber patterns remain a broadly documented streamer choice; do not impose an unsupported muddy-water exclusion.",
      "stained_cloudy": "Bugger and leech palettes use established natural, black and white fiber colors. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Olive fiber patterns remain a broadly documented streamer choice; do not impose an unsupported muddy-water exclusion.",
      "dirty_sunny": "Bugger and leech palettes use established natural, black and white fiber colors. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Olive fiber patterns remain a broadly documented streamer choice; do not impose an unsupported muddy-water exclusion.",
      "dirty_cloudy": "Bugger and leech palettes use established natural, black and white fiber colors. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Re-audit: Olive fiber patterns remain a broadly documented streamer choice; do not impose an unsupported muddy-water exclusion."
    }
  },
  {
    "id": "baitfish_fly",
    "sourceIds": [
      "streamer_light",
      "streamer_palette",
      "clouser_recipe",
      "clouser_black"
    ],
    "principle": "Baitfish streamers use explicit upper/lower fiber colors with light or dark alternatives.",
    "extension": "Gray/white, chartreuse/white and black/purple are editorial material/palette extensions, including application to larger/articulated bodies. The precise cloudy pruning is not experimentally established. Olive-over-white retains a pale lower body in poor visibility; no evidence justified dropping it solely at the dirty boundary.",
    "cells": {
      "clear_sunny": [
        "fly_white",
        "fly_olive_white",
        "fly_gray_white",
        "fly_olive",
        "fly_black"
      ],
      "clear_cloudy": [
        "fly_white",
        "fly_olive_white",
        "fly_olive",
        "fly_brown",
        "fly_black"
      ],
      "stained_sunny": [
        "fly_white",
        "fly_olive_white",
        "fly_chartreuse_white",
        "fly_black",
        "fly_black_purple"
      ],
      "stained_cloudy": [
        "fly_white",
        "fly_olive_white",
        "fly_chartreuse_white",
        "fly_black",
        "fly_black_purple"
      ],
      "dirty_sunny": [
        "fly_white",
        "fly_chartreuse_white",
        "fly_black",
        "fly_black_purple",
        "fly_olive_white"
      ],
      "dirty_cloudy": [
        "fly_white",
        "fly_chartreuse_white",
        "fly_black",
        "fly_black_purple",
        "fly_olive_white"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Baitfish streamers use explicit upper/lower fiber colors with light or dark alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Olive-over-white retains a pale lower body in poor visibility; no evidence justified dropping it solely at the dirty boundary.",
      "clear_cloudy": "Baitfish streamers use explicit upper/lower fiber colors with light or dark alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Olive-over-white retains a pale lower body in poor visibility; no evidence justified dropping it solely at the dirty boundary.",
      "stained_sunny": "Baitfish streamers use explicit upper/lower fiber colors with light or dark alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Olive-over-white retains a pale lower body in poor visibility; no evidence justified dropping it solely at the dirty boundary.",
      "stained_cloudy": "Baitfish streamers use explicit upper/lower fiber colors with light or dark alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Olive-over-white retains a pale lower body in poor visibility; no evidence justified dropping it solely at the dirty boundary.",
      "dirty_sunny": "Baitfish streamers use explicit upper/lower fiber colors with light or dark alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Olive-over-white retains a pale lower body in poor visibility; no evidence justified dropping it solely at the dirty boundary.",
      "dirty_cloudy": "Baitfish streamers use explicit upper/lower fiber colors with light or dark alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Olive-over-white retains a pale lower body in poor visibility; no evidence justified dropping it solely at the dirty boundary."
    }
  },
  {
    "id": "sculpin",
    "sourceIds": [
      "sculpin_conditions",
      "streamer_light",
      "streamer_palette",
      "sculpin_contrast"
    ],
    "principle": "Sculpin flies use natural, pale and dark fiber recipes appropriate to their shape.",
    "extension": "Black/white is documented on Sculpzilla. A realistic black upper-fur/white lower-body recipe retains sculpin anatomy. Reduced-visibility inclusion is editorial dark/light-contrast reasoning; no sky-only exclusion is supported for this added recipe. Existing entries retain their cited profile guidance; no exact commercial SKU is required.",
    "cells": {
      "clear_sunny": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "fly_tan",
        "fly_gray_white",
        "sculpin_black_white"
      ],
      "clear_cloudy": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "fly_tan",
        "sculpin_black_white"
      ],
      "stained_sunny": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "sculpin_black_white"
      ],
      "stained_cloudy": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "sculpin_black_white"
      ],
      "dirty_sunny": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "sculpin_black_white"
      ],
      "dirty_cloudy": [
        "fly_olive",
        "fly_brown",
        "fly_black",
        "sculpin_black_white"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Sculpin flies use natural, pale and dark fiber recipes appropriate to their shape. Black/white is documented on Sculpzilla. A realistic black upper-fur/white lower-body recipe retains sculpin anatomy. Reduced-visibility inclusion is editorial dark/light-contrast reasoning; no sky-only exclusion is supported for this added recipe. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Sculpin flies use natural, pale and dark fiber recipes appropriate to their shape. Black/white is documented on Sculpzilla. A realistic black upper-fur/white lower-body recipe retains sculpin anatomy. Reduced-visibility inclusion is editorial dark/light-contrast reasoning; no sky-only exclusion is supported for this added recipe. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Sculpin flies use natural, pale and dark fiber recipes appropriate to their shape. Black/white is documented on Sculpzilla. A realistic black upper-fur/white lower-body recipe retains sculpin anatomy. Reduced-visibility inclusion is editorial dark/light-contrast reasoning; no sky-only exclusion is supported for this added recipe. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_cloudy": "Sculpin flies use natural, pale and dark fiber recipes appropriate to their shape. Black/white is documented on Sculpzilla. A realistic black upper-fur/white lower-body recipe retains sculpin anatomy. Reduced-visibility inclusion is editorial dark/light-contrast reasoning; no sky-only exclusion is supported for this added recipe. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_sunny": "Sculpin flies use natural, pale and dark fiber recipes appropriate to their shape. Black/white is documented on Sculpzilla. A realistic black upper-fur/white lower-body recipe retains sculpin anatomy. Reduced-visibility inclusion is editorial dark/light-contrast reasoning; no sky-only exclusion is supported for this added recipe. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Sculpin flies use natural, pale and dark fiber recipes appropriate to their shape. Black/white is documented on Sculpzilla. A realistic black upper-fur/white lower-body recipe retains sculpin anatomy. Reduced-visibility inclusion is editorial dark/light-contrast reasoning; no sky-only exclusion is supported for this added recipe. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "craw_fly",
    "sourceIds": [
      "craw_palette",
      "craw_expanded"
    ],
    "principle": "Documented crawfish-fly palettes include brown, olive, black, orange-accented tan/brown, and black/purple.",
    "extension": "Fly-specific guidance supports black/purple in dirtier water and documents orange-accented craw combinations. Each cell contains five choices; the exact six-cell application is editorial, with no supported sky-only exclusion.",
    "cells": {
      "clear_sunny": [
        "fly_brown",
        "fly_olive",
        "fly_black",
        "craw_brown_orange",
        "craw_tan_orange"
      ],
      "clear_cloudy": [
        "fly_brown",
        "fly_olive",
        "fly_black",
        "craw_brown_orange",
        "craw_tan_orange"
      ],
      "stained_sunny": [
        "fly_brown",
        "fly_olive",
        "fly_black",
        "craw_black_purple",
        "craw_brown_orange"
      ],
      "stained_cloudy": [
        "fly_brown",
        "fly_olive",
        "fly_black",
        "craw_black_purple",
        "craw_brown_orange"
      ],
      "dirty_sunny": [
        "fly_brown",
        "fly_olive",
        "fly_black",
        "craw_black_purple",
        "craw_brown_orange"
      ],
      "dirty_cloudy": [
        "fly_brown",
        "fly_olive",
        "fly_black",
        "craw_black_purple",
        "craw_brown_orange"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Brown, olive and black remain core fiber choices. Tan/orange and brown/orange extend the clear-water palette using documented crawfish recipes. This condition-specific application is editorial; no sky-only exclusion or measured equality is claimed.",
      "clear_cloudy": "Brown, olive and black remain core fiber choices. Tan/orange and brown/orange extend the clear-water palette using documented crawfish recipes. This condition-specific application is editorial; no sky-only exclusion or measured equality is claimed.",
      "stained_sunny": "Brown, olive and black remain core fiber choices. Black/purple follows dirty-water fly guidance; brown/orange supplies a documented contrasting crawfish recipe. This condition-specific application is editorial; no sky-only exclusion or measured equality is claimed.",
      "stained_cloudy": "Brown, olive and black remain core fiber choices. Black/purple follows dirty-water fly guidance; brown/orange supplies a documented contrasting crawfish recipe. This condition-specific application is editorial; no sky-only exclusion or measured equality is claimed.",
      "dirty_sunny": "Brown, olive and black remain core fiber choices. Black/purple follows dirty-water fly guidance; brown/orange supplies a documented contrasting crawfish recipe. This condition-specific application is editorial; no sky-only exclusion or measured equality is claimed.",
      "dirty_cloudy": "Brown, olive and black remain core fiber choices. Black/purple follows dirty-water fly guidance; brown/orange supplies a documented contrasting crawfish recipe. This condition-specific application is editorial; no sky-only exclusion or measured equality is claimed."
    }
  },
  {
    "id": "flash_fly",
    "sourceIds": [
      "flash_conditions",
      "fly_catalog"
    ],
    "principle": "Flash-heavy streamers retain their material identity in both sky conditions.",
    "extension": "Two metallic pairs have direct clear/dirty anecdotal support. Purple/copper and the three-metal recipe are editorial extensions of documented catalog palettes. No sky-dependent exclusion or nighttime guarantee is invented.",
    "cells": {
      "clear_sunny": [
        "flash_silver_gold",
        "flash_copper_gold",
        "flash_purple_copper",
        "flash_copper_gold_silver"
      ],
      "clear_cloudy": [
        "flash_silver_gold",
        "flash_copper_gold",
        "flash_purple_copper",
        "flash_copper_gold_silver"
      ],
      "stained_sunny": [
        "flash_silver_gold",
        "flash_copper_gold",
        "flash_purple_copper",
        "flash_copper_gold_silver"
      ],
      "stained_cloudy": [
        "flash_silver_gold",
        "flash_copper_gold",
        "flash_purple_copper",
        "flash_copper_gold_silver"
      ],
      "dirty_sunny": [
        "flash_silver_gold",
        "flash_copper_gold",
        "flash_purple_copper",
        "flash_copper_gold_silver"
      ],
      "dirty_cloudy": [
        "flash_silver_gold",
        "flash_copper_gold",
        "flash_purple_copper",
        "flash_copper_gold_silver"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Flash fibers remain the defining construction in this set. Clear/dirty-water reports support retaining reflective pairs; the two additional catalog-derived recipes are editorial extensions. No supported sky-only exclusion was found, so all four remain available without claiming equal effectiveness.",
      "clear_cloudy": "Flash fibers remain the defining construction in this set. Clear/dirty-water reports support retaining reflective pairs; the two additional catalog-derived recipes are editorial extensions. No supported sky-only exclusion was found, so all four remain available without claiming equal effectiveness.",
      "stained_sunny": "Flash fibers remain the defining construction in this set. Clear/dirty-water reports support retaining reflective pairs; the two additional catalog-derived recipes are editorial extensions. No supported sky-only exclusion was found, so all four remain available without claiming equal effectiveness.",
      "stained_cloudy": "Flash fibers remain the defining construction in this set. Clear/dirty-water reports support retaining reflective pairs; the two additional catalog-derived recipes are editorial extensions. No supported sky-only exclusion was found, so all four remain available without claiming equal effectiveness.",
      "dirty_sunny": "Flash fibers remain the defining construction in this set. Clear/dirty-water reports support retaining reflective pairs; the two additional catalog-derived recipes are editorial extensions. No supported sky-only exclusion was found, so all four remain available without claiming equal effectiveness.",
      "dirty_cloudy": "Flash fibers remain the defining construction in this set. Clear/dirty-water reports support retaining reflective pairs; the two additional catalog-derived recipes are editorial extensions. No supported sky-only exclusion was found, so all four remain available without claiming equal effectiveness."
    }
  },
  {
    "id": "fly_popper",
    "sourceIds": [
      "popper_clear",
      "popper_light",
      "popper_catalog"
    ],
    "principle": "Fly poppers retain clear-water color variety and distinct opaque contrast choices.",
    "extension": "Murky-cell retention is an editorial extension of surface contrast and documented popper palettes. Black under clouds remains eligible without falsely excluding white or yellow.",
    "cells": {
      "clear_sunny": [
        "popper_white",
        "popper_black",
        "popper_yellow",
        "popper_blue",
        "popper_green_white"
      ],
      "clear_cloudy": [
        "popper_white",
        "popper_black",
        "popper_yellow",
        "popper_blue",
        "popper_green_white"
      ],
      "stained_sunny": [
        "popper_white",
        "popper_black",
        "popper_yellow",
        "popper_chartreuse",
        "popper_yellow_orange"
      ],
      "stained_cloudy": [
        "popper_white",
        "popper_black",
        "popper_yellow",
        "popper_chartreuse",
        "popper_yellow_orange"
      ],
      "dirty_sunny": [
        "popper_white",
        "popper_black",
        "popper_yellow",
        "popper_chartreuse"
      ],
      "dirty_cloudy": [
        "popper_white",
        "popper_black",
        "popper_yellow",
        "popper_chartreuse"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Fly poppers retain clear-water color variety and distinct opaque contrast choices. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "clear_cloudy": "Fly poppers retain clear-water color variety and distinct opaque contrast choices. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_sunny": "Fly poppers retain clear-water color variety and distinct opaque contrast choices. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_cloudy": "Fly poppers retain clear-water color variety and distinct opaque contrast choices. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "dirty_sunny": "Fly poppers retain clear-water color variety and distinct opaque contrast choices. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "dirty_cloudy": "Fly poppers retain clear-water color variety and distinct opaque contrast choices. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity."
    }
  },
  {
    "id": "worm_expanded",
    "sourceIds": [
      "plastic_clarity",
      "pumpkin_variants",
      "hard_light",
      "senko_palette_expanded",
      "senko_blue_tip",
      "worm_pbj",
      "jig_pbj"
    ],
    "principle": "Natural plastic palettes and darker opaque alternatives are both represented.",
    "extension": "PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Existing entries retain their cited profile guidance; no exact commercial SKU is required.",
    "cells": {
      "clear_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_seed",
        "plastic_watermelon_red",
        "plastic_pumpkinseed",
        "plastic_smoke",
        "plastic_brown",
        "plastic_black",
        "plastic_pbj"
      ],
      "clear_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_pbj"
      ],
      "stained_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_red",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj"
      ],
      "stained_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj"
      ],
      "dirty_sunny": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj"
      ],
      "dirty_cloudy": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "verified_20260908_stick_worm",
    "sourceIds": [
      "plastic_clarity",
      "pumpkin_variants",
      "hard_light",
      "senko_palette_expanded",
      "senko_blue_tip",
      "worm_pbj",
      "jig_pbj",
      "verified_senko_2026"
    ],
    "principle": "Natural plastic palettes and darker opaque alternatives are both represented.",
    "extension": "PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_seed",
        "plastic_watermelon_red",
        "plastic_pumpkinseed",
        "plastic_smoke",
        "plastic_brown",
        "plastic_black",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "clear_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "stained_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_red",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "stained_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_sunny": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_cloudy": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "clear_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_finesse_worm",
    "sourceIds": [
      "plastic_clarity",
      "pumpkin_variants",
      "hard_light",
      "senko_palette_expanded",
      "senko_blue_tip",
      "worm_pbj",
      "jig_pbj",
      "verified_senko_2026"
    ],
    "principle": "Natural plastic palettes and darker opaque alternatives are both represented.",
    "extension": "PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_seed",
        "plastic_watermelon_red",
        "plastic_pumpkinseed",
        "plastic_smoke",
        "plastic_brown",
        "plastic_black",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "clear_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "stained_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_red",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "stained_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_sunny": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_cloudy": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "clear_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_ribbon_tail_worm",
    "sourceIds": [
      "plastic_clarity",
      "pumpkin_variants",
      "hard_light",
      "senko_palette_expanded",
      "senko_blue_tip",
      "worm_pbj",
      "jig_pbj",
      "verified_senko_2026"
    ],
    "principle": "Natural plastic palettes and darker opaque alternatives are both represented.",
    "extension": "PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_seed",
        "plastic_watermelon_red",
        "plastic_pumpkinseed",
        "plastic_smoke",
        "plastic_brown",
        "plastic_black",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "clear_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "stained_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_red",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "stained_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_sunny": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_cloudy": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_black_red",
        "plastic_black_blue_tip",
        "plastic_plum_emerald",
        "plastic_red_shad",
        "plastic_pbj",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "clear_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. PB&J adds a documented brown/purple worm palette. Clear and stained use follows natural/dark-plastic guidance; murky inclusion is an explicit dark-palette inference, not a visibility promise. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_ned_bait",
    "sourceIds": [
      "plastic_clarity",
      "pumpkin_variants",
      "hard_light",
      "verified_senko_2026"
    ],
    "principle": "Natural plastic palettes and darker opaque alternatives are both represented.",
    "extension": "Texas-rig color guidance is extended to other bottom-plastic shapes. Restricting the most translucent recipes in cloudy sets is editorial, not direct evidence for every worm, craw or tube. Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_seed",
        "plastic_watermelon_red",
        "plastic_pumpkinseed",
        "plastic_smoke",
        "plastic_brown",
        "plastic_black",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "clear_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_blue_black"
      ],
      "stained_sunny": [
        "plastic_green_pumpkin",
        "plastic_watermelon_red",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "stained_cloudy": [
        "plastic_green_pumpkin",
        "plastic_brown",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_gp_red",
        "plastic_gp_watermelon",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_sunny": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ],
      "dirty_cloudy": [
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_green_pumpkin",
        "plastic_gp_chart_tail",
        "plastic_blue_black"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "clear_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Natural plastic palettes and darker opaque alternatives are both represented. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Natural plastic palettes and darker opaque alternatives are both represented. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Re-audit restores opaque green pumpkin as a versatile clarity option and expands worm patterns using documented Senko recipes; dark-palette compatibility, not product availability alone, supports murky inclusion. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_soft_jerkbait",
    "sourceIds": [
      "plastic_clarity",
      "plastic_jerk",
      "hard_light",
      "junebug_definition",
      "senko_palette_expanded",
      "verified_fluke_junebug"
    ],
    "principle": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives.",
    "extension": "White soft-jerkbait guidance is extended to soft minnows/swimbaits. Chartreuse and the precise sky intersections are editorial applications of opacity/contrast, not sourced species preferences. Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_smoke_silver",
        "plastic_smoke",
        "plastic_green_pumpkin"
      ],
      "clear_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_black"
      ],
      "stained_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_junebug"
      ],
      "stained_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_junebug"
      ],
      "dirty_sunny": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl",
        "plastic_junebug"
      ],
      "dirty_cloudy": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl",
        "plastic_junebug"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "clear_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "stained_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_paddle_tail_swimbait",
    "sourceIds": [
      "plastic_clarity",
      "plastic_jerk",
      "hard_light",
      "junebug_definition",
      "senko_palette_expanded",
      "verified_keitech_2026",
      "verified_fluke_junebug"
    ],
    "principle": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives.",
    "extension": "White soft-jerkbait guidance is extended to soft minnows/swimbaits. Chartreuse and the precise sky intersections are editorial applications of opacity/contrast, not sourced species preferences. Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_smoke_silver",
        "plastic_smoke",
        "plastic_green_pumpkin",
        "plastic_black_blue"
      ],
      "clear_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_black",
        "plastic_black_blue"
      ],
      "stained_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_chart_white"
      ],
      "stained_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_chart_white"
      ],
      "dirty_sunny": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_chart_white"
      ],
      "dirty_cloudy": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl",
        "plastic_black_blue",
        "plastic_junebug",
        "plastic_chart_white"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "clear_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_straight_tail_minnow",
    "sourceIds": [
      "plastic_clarity",
      "plastic_jerk",
      "hard_light",
      "junebug_definition",
      "senko_palette_expanded",
      "verified_fluke_junebug"
    ],
    "principle": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives.",
    "extension": "White soft-jerkbait guidance is extended to soft minnows/swimbaits. Chartreuse and the precise sky intersections are editorial applications of opacity/contrast, not sourced species preferences. Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_smoke_silver",
        "plastic_smoke",
        "plastic_green_pumpkin"
      ],
      "clear_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_black"
      ],
      "stained_sunny": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_green_pumpkin",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_junebug"
      ],
      "stained_cloudy": [
        "plastic_pearl",
        "plastic_olive_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_junebug"
      ],
      "dirty_sunny": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl",
        "plastic_junebug"
      ],
      "dirty_cloudy": [
        "plastic_pearl",
        "plastic_chartreuse",
        "plastic_black",
        "plastic_olive_pearl",
        "plastic_junebug"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "clear_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive.",
      "stained_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The sunny set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Baitfish plastics use pearl, natural bodies and opaque contrast alternatives. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. The cloudy set applies the cited light direction conservatively; overlapping colors remain eligible. Re-audit: Opaque olive/pearl already has the light belly and defined outline used by this profile; removing it solely at the murky boundary was unnecessarily restrictive. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_underspin",
    "sourceIds": [
      "spinner_components",
      "plastic_jerk",
      "metal_contrast",
      "underspin_known",
      "underspin_body_guidance",
      "verified_keitech_2026",
      "verified_fluke_junebug"
    ],
    "principle": "A baitfish body and blade are treated as one coordinated pattern.",
    "extension": "Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold"
      ],
      "clear_cloudy": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold"
      ],
      "stained_sunny": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold",
        "underspin_chartreuse",
        "underspin_white_chartreuse",
        "underspin_black_blue",
        "underspin_junebug"
      ],
      "stained_cloudy": [
        "underspin_pearl_silver",
        "underspin_olive_silver",
        "underspin_gold",
        "underspin_chartreuse",
        "underspin_white_chartreuse",
        "underspin_black_blue",
        "underspin_junebug"
      ],
      "dirty_sunny": [
        "underspin_pearl_silver",
        "underspin_chartreuse",
        "underspin_white_chartreuse",
        "underspin_black_blue",
        "underspin_junebug"
      ],
      "dirty_cloudy": [
        "underspin_pearl_silver",
        "underspin_chartreuse",
        "underspin_white_chartreuse",
        "underspin_black_blue",
        "underspin_junebug"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "clear_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance.",
      "stained_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "A baitfish body and blade are treated as one coordinated pattern. Color choices concern the body, head or skirt palette. Neutral hardware in artwork is illustrative, not a prescribed blade finish. Hardware-only white variants are merged; no extra color choice is created from blade paint. White/chartreuse head and white body replace the white-painted-blade recipe using documented underspin combinations; murky inclusion applies pale/bright contrast guidance editorially. Exact clarity/light membership remains an editorial application of the cited guidance. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_casting_spoon",
    "sourceIds": [
      "metal_contrast",
      "metal_trout",
      "metal_blade",
      "spinner_components",
      "verified_dardevle_patterns"
    ],
    "principle": "Metal bait finishes distinguish reflection from opaque painted contrast.",
    "extension": "Transfer of blade/contrast guidance to spoon constructions is editorial. Cloud alone does not invalidate silver; darker water does not identify a particular tint. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "clear_cloudy": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "stained_sunny": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "stained_cloudy": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_sunny": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_cloudy": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "clear_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_weedless_spoon",
    "sourceIds": [
      "metal_contrast",
      "metal_trout",
      "metal_blade",
      "spinner_components",
      "verified_dardevle_patterns"
    ],
    "principle": "Metal bait finishes distinguish reflection from opaque painted contrast.",
    "extension": "Transfer of blade/contrast guidance to spoon constructions is editorial. Cloud alone does not invalidate silver; darker water does not identify a particular tint. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "clear_cloudy": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "stained_sunny": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "stained_cloudy": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_sunny": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_cloudy": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "clear_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_trolling_spoon",
    "sourceIds": [
      "metal_contrast",
      "metal_trout",
      "metal_blade",
      "spinner_components",
      "verified_dardevle_patterns"
    ],
    "principle": "Metal bait finishes distinguish reflection from opaque painted contrast.",
    "extension": "Transfer of blade/contrast guidance to spoon constructions is editorial. Cloud alone does not invalidate silver; darker water does not identify a particular tint. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "clear_cloudy": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "stained_sunny": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "stained_cloudy": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_sunny": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_cloudy": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "clear_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_jigging_spoon",
    "sourceIds": [
      "metal_contrast",
      "metal_trout",
      "metal_blade",
      "spinner_components",
      "verified_dardevle_patterns"
    ],
    "principle": "Metal bait finishes distinguish reflection from opaque painted contrast.",
    "extension": "Transfer of blade/contrast guidance to spoon constructions is editorial. Cloud alone does not invalidate silver; darker water does not identify a particular tint. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "clear_cloudy": [
        "metal_silver",
        "metal_silver_blue",
        "metal_gold",
        "metal_copper"
      ],
      "stained_sunny": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "stained_cloudy": [
        "metal_silver",
        "metal_gold",
        "metal_copper",
        "metal_white",
        "metal_firetiger",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_sunny": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ],
      "dirty_cloudy": [
        "metal_white",
        "metal_chartreuse",
        "metal_firetiger",
        "metal_black",
        "metal_red_white",
        "metal_five_diamonds"
      ]
    },
    "lightPolicy": "retain_without_supported_exclusion",
    "rationale": {
      "clear_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "clear_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The clear-water set retains the explicitly listed natural, reflective or contrast recipes appropriate to this construction. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity.",
      "stained_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The stained-water set uses the listed recipes without assuming tannin, algae, or a known forage base. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_cloudy": "Metal bait finishes distinguish reflection from opaque painted contrast. The murky-water set retains the listed opaque, dark or contrasting recipes; it makes no promise of visibility at a particular distance. No supported sky-only exclusion was found for this palette, so both light groups retain the same choices at this clarity. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color."
    }
  },
  {
    "id": "verified_20260908_walking_bait",
    "sourceIds": [
      "topwater_light",
      "topwater_bone",
      "topwater_chartreuse",
      "topwater_view",
      "surface_firetiger",
      "verified_topwater_clown"
    ],
    "principle": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives.",
    "extension": "Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "clear_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_silver_black",
        "hard_firetiger"
      ],
      "stained_sunny": [
        "hard_silver_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_black",
        "hard_firetiger",
        "hard_clown"
      ],
      "stained_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_clown"
      ],
      "dirty_sunny": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "verified_20260908_hard_popper",
    "sourceIds": [
      "topwater_light",
      "topwater_bone",
      "topwater_chartreuse",
      "topwater_view",
      "surface_firetiger",
      "verified_topwater_clown"
    ],
    "principle": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives.",
    "extension": "Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "clear_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_silver_black",
        "hard_firetiger"
      ],
      "stained_sunny": [
        "hard_silver_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_black",
        "hard_firetiger",
        "hard_clown"
      ],
      "stained_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_clown"
      ],
      "dirty_sunny": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "verified_20260908_prop_bait",
    "sourceIds": [
      "topwater_light",
      "topwater_bone",
      "topwater_chartreuse",
      "topwater_view",
      "surface_firetiger",
      "verified_topwater_clown"
    ],
    "principle": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives.",
    "extension": "Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "clear_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_silver_black",
        "hard_firetiger"
      ],
      "stained_sunny": [
        "hard_silver_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_black",
        "hard_firetiger",
        "hard_clown"
      ],
      "stained_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_clown"
      ],
      "dirty_sunny": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "verified_20260908_plopper_bait",
    "sourceIds": [
      "topwater_light",
      "topwater_bone",
      "topwater_chartreuse",
      "topwater_view",
      "surface_firetiger",
      "verified_topwater_clown"
    ],
    "principle": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives.",
    "extension": "Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "clear_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_silver_black",
        "hard_firetiger"
      ],
      "stained_sunny": [
        "hard_silver_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_black",
        "hard_firetiger",
        "hard_clown"
      ],
      "stained_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_clown"
      ],
      "dirty_sunny": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank."
    }
  },
  {
    "id": "verified_20260908_wake_bait",
    "sourceIds": [
      "topwater_light",
      "topwater_bone",
      "topwater_chartreuse",
      "topwater_view",
      "surface_firetiger",
      "verified_topwater_clown"
    ],
    "principle": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives.",
    "extension": "Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Existing entries retain their cited profile guidance; no exact commercial SKU is required. September 8 verified expansion: catalog existence is direct evidence; clarity placement and transfer among the broad category’s related rigs are editorial.",
    "cells": {
      "clear_sunny": [
        "hard_ghost",
        "hard_silver_black",
        "hard_silver_blue",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "clear_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_silver_black",
        "hard_firetiger"
      ],
      "stained_sunny": [
        "hard_silver_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_black",
        "hard_firetiger",
        "hard_clown"
      ],
      "stained_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger",
        "hard_clown"
      ],
      "dirty_sunny": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ],
      "dirty_cloudy": [
        "hard_black",
        "hard_bone",
        "hard_chartreuse_back",
        "hard_firetiger"
      ]
    },
    "lightPolicy": "documented_direction_editorial_application",
    "rationale": {
      "clear_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "clear_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "stained_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "stained_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank. Verified bait-specific palettes added for natural body tone, dark profile or contrasting painted areas. Visibility remains background-dependent; no extra advantage is claimed for flake color.",
      "dirty_sunny": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank.",
      "dirty_cloudy": "Surface-plug patterns include translucent/reflective options and distinct black, bone and chartreuse alternatives. Firetiger is documented on a hard popper. Its orange underside and barred chartreuse sides add a distinct surface recipe. Transfers to other painted topwater shapes and reduced-visibility eligibility are editorial; no claim that bars remain visible at distance. Condition membership is an editorial application of cited guidance, not a rank."
    }
  }
];
