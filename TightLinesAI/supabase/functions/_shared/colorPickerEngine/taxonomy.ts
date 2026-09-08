import type { PickerTaxonomy } from "./catalogSchema.ts";

/** Pass-one source of truth. No color eligibility is asserted by this catalog. */
export const COLOR_PICKER_TAXONOMY: PickerTaxonomy = {
  "version": "1.0.0-research.2",
  "scope": "Freshwater conventional artificial lures, streamer flies, and fly poppers; daylight guidance.",
  "categories": [
    {
      "id": "soft_plastics",
      "label": "Soft plastics",
      "description": "Worms, craws, tubes, and soft baitfish.",
      "gearMode": "lure",
      "imageId": "category_soft_plastics"
    },
    {
      "id": "jigs",
      "label": "Jigs",
      "description": "Skirted, hair, and marabou jigs.",
      "gearMode": "lure",
      "imageId": "category_jigs"
    },
    {
      "id": "bladed_wire",
      "label": "Bladed & wire baits",
      "description": "Spinnerbaits, bladed jigs, and inline spinners.",
      "gearMode": "lure",
      "imageId": "category_bladed_wire"
    },
    {
      "id": "hard_baits",
      "label": "Hard baits",
      "description": "Crankbaits, jerkbaits, and hard swimbaits.",
      "gearMode": "lure",
      "imageId": "category_hard_baits"
    },
    {
      "id": "metal_baits",
      "label": "Spoons & metal baits",
      "description": "Reflective and painted metal lures.",
      "gearMode": "lure",
      "imageId": "category_metal_baits"
    },
    {
      "id": "topwater_lures",
      "label": "Topwater lures",
      "description": "Walking baits, hard poppers, and frogs.",
      "gearMode": "lure",
      "imageId": "category_topwater_lures"
    },
    {
      "id": "streamers",
      "label": "Streamers",
      "description": "Baitfish, leech, sculpin, and crawfish flies.",
      "gearMode": "fly",
      "imageId": "category_streamers"
    },
    {
      "id": "surface_flies",
      "label": "Surface flies",
      "description": "Fly poppers with their own color patterns.",
      "gearMode": "fly",
      "imageId": "category_surface_flies"
    }
  ],
  "baitTypes": [
    {
      "id": "stick_worm",
      "categoryId": "soft_plastics",
      "label": "Stick worm",
      "description": "A thick, straight soft-plastic worm with a tapered end.",
      "searchAliases": [
        "stick bait",
        "wacky worm",
        "Senko"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_stick_worm",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "finesse_worm",
      "categoryId": "soft_plastics",
      "label": "Finesse / straight-tail worm",
      "description": "A slender worm with a straight or gently tapered tail.",
      "searchAliases": [
        "shaky head worm",
        "drop shot worm"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_finesse_worm",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "ribbon_tail_worm",
      "categoryId": "soft_plastics",
      "label": "Ribbon-tail worm",
      "description": "A worm with a long, curling ribbon tail.",
      "searchAliases": [
        "ribbontail",
        "curly tail worm"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_ribbon_tail_worm",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "ned_bait",
      "categoryId": "soft_plastics",
      "label": "Ned-style bait",
      "description": "A short, blunt soft-plastic stick bait.",
      "searchAliases": [
        "Ned rig",
        "TRD"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_ned_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "soft_craw",
      "categoryId": "soft_plastics",
      "label": "Soft craw",
      "description": "A soft-plastic crawfish with two distinct claws.",
      "searchAliases": [
        "crawfish",
        "crayfish",
        "Texas rig craw"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_soft_craw",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "creature_bait",
      "categoryId": "soft_plastics",
      "label": "Creature / beaver bait",
      "description": "A broad soft body with appendages or paddle-shaped tails.",
      "searchAliases": [
        "brush hog",
        "beaver",
        "creature"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_creature_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "soft_tube",
      "categoryId": "soft_plastics",
      "label": "Tube",
      "description": "A hollow cylindrical body with a fringed tail.",
      "searchAliases": [
        "tube jig"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_soft_tube",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "curly_tail_grub",
      "categoryId": "soft_plastics",
      "label": "Curly-tail grub",
      "description": "A short grub body with one curved swimming tail.",
      "searchAliases": [
        "twister tail",
        "grub"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_curly_tail_grub",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "soft_jerkbait",
      "categoryId": "soft_plastics",
      "label": "Soft jerkbait",
      "description": "A soft minnow profile with a forked or pointed tail.",
      "searchAliases": [
        "fluke"
      ],
      "ruleFamily": "baitfish_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_soft_jerkbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "paddle_tail_swimbait",
      "categoryId": "soft_plastics",
      "label": "Paddle-tail swimbait",
      "description": "A soft baitfish body ending in a paddle tail.",
      "searchAliases": [
        "paddletail",
        "boot tail"
      ],
      "ruleFamily": "baitfish_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_paddle_tail_swimbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "straight_tail_minnow",
      "categoryId": "soft_plastics",
      "label": "Straight-tail minnow",
      "description": "A slender soft minnow with a straight, non-paddle tail.",
      "searchAliases": [
        "drop shot minnow",
        "finesse minnow"
      ],
      "ruleFamily": "baitfish_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_straight_tail_minnow",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "soft_toad",
      "categoryId": "soft_plastics",
      "label": "Soft toad",
      "description": "A solid soft-plastic frog with two swimming legs.",
      "searchAliases": [
        "buzz frog",
        "soft frog"
      ],
      "ruleFamily": "bottom_plastic",
      "components": [
        "body",
        "accent",
        "flake"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_soft_toad",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "structure_jig",
      "categoryId": "jigs",
      "label": "Flipping / structure jig",
      "description": "A compact skirted jig for a coordinated skirt and trailer pattern.",
      "searchAliases": [
        "casting jig",
        "flipping jig"
      ],
      "ruleFamily": "bottom_skirt",
      "components": [
        "head",
        "skirt",
        "trailer"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_structure_jig",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "football_jig",
      "categoryId": "jigs",
      "label": "Football jig",
      "description": "A skirted jig with a wide football-shaped head.",
      "searchAliases": [
        "football head"
      ],
      "ruleFamily": "bottom_skirt",
      "components": [
        "head",
        "skirt",
        "trailer"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_football_jig",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "finesse_jig",
      "categoryId": "jigs",
      "label": "Finesse jig",
      "description": "A small skirted jig with a compact trailer.",
      "searchAliases": [
        "compact skirt jig"
      ],
      "ruleFamily": "bottom_skirt",
      "components": [
        "head",
        "skirt",
        "trailer"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_finesse_jig",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "swim_jig",
      "categoryId": "jigs",
      "label": "Swim jig",
      "description": "A streamlined skirted jig with a swimming trailer.",
      "searchAliases": [
        "swimming jig"
      ],
      "ruleFamily": "moving_skirt",
      "components": [
        "head",
        "skirt",
        "trailer"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_swim_jig",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "hair_jig",
      "categoryId": "jigs",
      "label": "Hair / marabou jig",
      "description": "A jig dressed with hair or soft feathers rather than a silicone skirt.",
      "searchAliases": [
        "bucktail jig",
        "marabou jig"
      ],
      "ruleFamily": "hair_jig",
      "components": [
        "head",
        "body",
        "tail"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_hair_jig",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "spinnerbait",
      "categoryId": "bladed_wire",
      "label": "Spinnerbait",
      "description": "A bent-wire lure with blades above a skirted hook.",
      "searchAliases": [
        "safety pin spinner"
      ],
      "ruleFamily": "moving_components",
      "components": [
        "blade",
        "skirt",
        "trailer"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_spinnerbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "bladed_jig",
      "categoryId": "bladed_wire",
      "label": "Bladed jig",
      "description": "A skirted jig with a vibration blade at its head.",
      "searchAliases": [
        "ChatterBait",
        "vibrating jig"
      ],
      "ruleFamily": "moving_components",
      "components": [
        "blade",
        "skirt",
        "trailer"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_bladed_jig",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "buzzbait",
      "categoryId": "bladed_wire",
      "label": "Buzzbait",
      "description": "A wire lure with a surface propeller above a skirted hook.",
      "searchAliases": [
        "buzz bait"
      ],
      "ruleFamily": "moving_components",
      "components": [
        "blade",
        "skirt",
        "trailer"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_buzzbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "inline_spinner",
      "categoryId": "bladed_wire",
      "label": "Inline spinner",
      "description": "A blade rotating around a straight wire body.",
      "searchAliases": [
        "Rooster Tail",
        "Mepps"
      ],
      "ruleFamily": "metal_components",
      "components": [
        "body",
        "blade",
        "tail"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_inline_spinner",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "bucktail_spinner",
      "categoryId": "bladed_wire",
      "label": "Large bucktail spinner",
      "description": "An inline spinner with a substantial bucktail or skirt dressing.",
      "searchAliases": [
        "musky bucktail"
      ],
      "ruleFamily": "moving_components",
      "components": [
        "blade",
        "body",
        "tail"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_bucktail_spinner",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "underspin",
      "categoryId": "bladed_wire",
      "label": "Underspin",
      "description": "A baitfish-shaped soft body with a small blade suspended beneath.",
      "searchAliases": [
        "under spin"
      ],
      "ruleFamily": "moving_components",
      "components": [
        "body",
        "blade",
        "head"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_underspin",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "squarebill",
      "categoryId": "hard_baits",
      "label": "Squarebill crankbait",
      "description": "A hard diving bait with a short square lip.",
      "searchAliases": [
        "square bill"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_squarebill",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "flat_sided_crankbait",
      "categoryId": "hard_baits",
      "label": "Flat-sided crankbait",
      "description": "A narrow hard crankbait with flattened sides.",
      "searchAliases": [
        "flat side crank"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_flat_sided_crankbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "medium_crankbait",
      "categoryId": "hard_baits",
      "label": "Medium-diving crankbait",
      "description": "A rounded hard crankbait with a medium diving lip.",
      "searchAliases": [
        "medium diver"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_medium_crankbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "deep_crankbait",
      "categoryId": "hard_baits",
      "label": "Deep-diving crankbait",
      "description": "A hard crankbait with an extended diving lip.",
      "searchAliases": [
        "deep diver"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_deep_crankbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "lipless_crankbait",
      "categoryId": "hard_baits",
      "label": "Lipless crankbait",
      "description": "A flat-sided sinking hard bait with no diving lip.",
      "searchAliases": [
        "rattle trap"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_lipless_crankbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "hard_jerkbait",
      "categoryId": "hard_baits",
      "label": "Hard jerkbait",
      "description": "A slender hard minnow with a small lip for darting retrieves.",
      "searchAliases": [
        "suspending jerkbait"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_hard_jerkbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "floating_minnow",
      "categoryId": "hard_baits",
      "label": "Floating minnow plug",
      "description": "A buoyant slender minnow plug with a diving lip.",
      "searchAliases": [
        "trout plug",
        "floating minnowbait"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_floating_minnow",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "hard_swimbait",
      "categoryId": "hard_baits",
      "label": "Hard swimbait",
      "description": "A jointed hard baitfish body; distinct from a soft paddle tail.",
      "searchAliases": [
        "jointed swimbait"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_hard_swimbait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "glidebait",
      "categoryId": "hard_baits",
      "label": "Glidebait",
      "description": "A hard baitfish lure designed for a side-to-side glide.",
      "searchAliases": [
        "glide bait"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_glidebait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "pull_jerk_bait",
      "categoryId": "hard_baits",
      "label": "Pull / jerk bait",
      "description": "An elongated hard pull bait, distinct from a small-lipped minnow jerkbait.",
      "searchAliases": [
        "musky jerk bait",
        "pull bait"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_pull_jerk_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "tail_spinner",
      "categoryId": "hard_baits",
      "label": "Tail spinner",
      "description": "A compact weighted baitfish body with a spinner blade at the tail.",
      "searchAliases": [
        "tailspin"
      ],
      "ruleFamily": "metal_components",
      "components": [
        "body",
        "blade",
        "tail"
      ],
      "recipePolicy": "coordinated_components",
      "imageId": "type_tail_spinner",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "horizontal_jigging_minnow",
      "categoryId": "hard_baits",
      "label": "Horizontal jigging minnow",
      "description": "A balanced hard minnow with a tail fin for horizontal jigging.",
      "searchAliases": [
        "Jigging Rap",
        "gliding jig"
      ],
      "ruleFamily": "hard_pattern",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_horizontal_jigging_minnow",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "casting_spoon",
      "categoryId": "metal_baits",
      "label": "Casting spoon",
      "description": "A curved metal spoon with a trailing hook.",
      "searchAliases": [
        "casting metal spoon"
      ],
      "ruleFamily": "metal_finish",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_casting_spoon",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "weedless_spoon",
      "categoryId": "metal_baits",
      "label": "Weedless spoon",
      "description": "A metal spoon with a single guarded hook.",
      "searchAliases": [
        "weed guard spoon"
      ],
      "ruleFamily": "metal_finish",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_weedless_spoon",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "trolling_spoon",
      "categoryId": "metal_baits",
      "label": "Trolling spoon",
      "description": "A thin, curved metal spoon intended for trolling.",
      "searchAliases": [
        "flutter trolling spoon"
      ],
      "ruleFamily": "metal_finish",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_trolling_spoon",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "jigging_spoon",
      "categoryId": "metal_baits",
      "label": "Jigging spoon",
      "description": "A compact weighted metal spoon for vertical presentations.",
      "searchAliases": [
        "vertical spoon"
      ],
      "ruleFamily": "metal_finish",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_jigging_spoon",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "blade_bait",
      "categoryId": "metal_baits",
      "label": "Blade bait",
      "description": "A thin metal baitfish plate with a weighted belly.",
      "searchAliases": [
        "metal vibration bait"
      ],
      "ruleFamily": "metal_finish",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_blade_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "walking_bait",
      "categoryId": "topwater_lures",
      "label": "Walking bait",
      "description": "A lipless floating hard bait with an elongated body.",
      "searchAliases": [
        "walk the dog",
        "spook"
      ],
      "ruleFamily": "surface_belly",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_walking_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "hard_popper",
      "categoryId": "topwater_lures",
      "label": "Hard-bait popper",
      "description": "A hard floating plug with a cupped face and treble hooks.",
      "searchAliases": [
        "conventional popper",
        "pop r"
      ],
      "ruleFamily": "surface_belly",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_hard_popper",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "prop_bait",
      "categoryId": "topwater_lures",
      "label": "Prop bait",
      "description": "A hard floating lure with small metal propellers.",
      "searchAliases": [
        "propeller bait"
      ],
      "ruleFamily": "surface_belly",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_prop_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "plopper_bait",
      "categoryId": "topwater_lures",
      "label": "Plopper bait",
      "description": "A hard floating lure with a large rotating tail paddle.",
      "searchAliases": [
        "rotating tail topwater"
      ],
      "ruleFamily": "surface_belly",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_plopper_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "wake_bait",
      "categoryId": "topwater_lures",
      "label": "Wake bait",
      "description": "A hard shallow-running bait designed to leave a surface wake.",
      "searchAliases": [
        "surface wakebait"
      ],
      "ruleFamily": "surface_belly",
      "components": [
        "body",
        "back",
        "belly",
        "accent"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_wake_bait",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "hollow_frog",
      "categoryId": "topwater_lures",
      "label": "Hollow-body frog",
      "description": "A collapsible frog body with an upward-facing double hook.",
      "searchAliases": [
        "hollow frog"
      ],
      "ruleFamily": "surface_belly",
      "components": [
        "back",
        "belly",
        "legs"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_hollow_frog",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "woolly_bugger",
      "categoryId": "streamers",
      "label": "Woolly Bugger",
      "description": "A fly with a hackled body and flowing marabou tail.",
      "searchAliases": [
        "wooly bugger"
      ],
      "ruleFamily": "woolly_bugger",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_woolly_bugger",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "leech_streamer",
      "categoryId": "streamers",
      "label": "Leech streamer",
      "description": "An elongated leech-shaped fly made from fur or feathers.",
      "searchAliases": [
        "rabbit strip leech",
        "balanced leech"
      ],
      "ruleFamily": "leech_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_leech_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "baitfish_streamer",
      "categoryId": "streamers",
      "label": "Baitfish / minnow streamer",
      "description": "A non-articulated streamer with a recognizable baitfish profile.",
      "searchAliases": [
        "Deceiver",
        "bucktail streamer",
        "Zonker"
      ],
      "ruleFamily": "baitfish_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_baitfish_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "clouser_streamer",
      "categoryId": "streamers",
      "label": "Clouser-style streamer",
      "description": "A sparse baitfish fly with weighted eyes and separate upper and lower wings.",
      "searchAliases": [
        "Clouser minnow"
      ],
      "ruleFamily": "clouser_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_clouser_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "articulated_streamer",
      "categoryId": "streamers",
      "label": "Articulated streamer",
      "description": "A streamer with multiple connected body segments.",
      "searchAliases": [
        "Game Changer",
        "Dungeon"
      ],
      "ruleFamily": "articulated_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_articulated_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "sculpin_streamer",
      "categoryId": "streamers",
      "label": "Sculpin streamer",
      "description": "A bottom-oriented baitfish fly with a broad sculpin head.",
      "searchAliases": [
        "sculpzilla",
        "muddler"
      ],
      "ruleFamily": "sculpin_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_sculpin_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "crawfish_streamer",
      "categoryId": "streamers",
      "label": "Crawfish streamer",
      "description": "A crawfish-shaped fly with paired claws and a segmented body.",
      "searchAliases": [
        "crayfish fly",
        "craw fly"
      ],
      "ruleFamily": "crawfish_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_crawfish_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "pike_streamer",
      "categoryId": "streamers",
      "label": "Large pike streamer",
      "description": "A long, substantial predator fly with flowing materials.",
      "searchAliases": [
        "pike bunny",
        "large predator streamer"
      ],
      "ruleFamily": "pike_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_pike_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "flash_streamer",
      "categoryId": "streamers",
      "label": "Flash streamer",
      "description": "A baitfish streamer whose visible body is predominantly reflective flash material.",
      "searchAliases": [
        "Flash Fly"
      ],
      "ruleFamily": "flash_streamer",
      "components": [
        "body",
        "wing",
        "tail",
        "head"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_flash_streamer",
      "poolStatus": "reviewed_heuristic"
    },
    {
      "id": "fly_popper",
      "categoryId": "surface_flies",
      "label": "Fly popper",
      "description": "A cupped foam, cork, or hair fly head with a dressed single hook, tail, and optional legs.",
      "searchAliases": [
        "bass bug",
        "foam popper",
        "deer hair popper"
      ],
      "ruleFamily": "fly_surface",
      "components": [
        "body",
        "belly",
        "tail",
        "legs"
      ],
      "recipePolicy": "single_pattern",
      "imageId": "type_fly_popper",
      "poolStatus": "reviewed_heuristic"
    }
  ],
  "archetypeMappings": [
    {
      "gearMode": "lure",
      "archetypeId": "weightless_stick_worm",
      "disposition": "mapped",
      "typeId": "stick_worm",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "carolina_rigged_stick_worm",
      "disposition": "mapped",
      "typeId": "stick_worm",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "shaky_head_worm",
      "disposition": "mapped",
      "typeId": "finesse_worm",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "drop_shot_worm",
      "disposition": "mapped",
      "typeId": "finesse_worm",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "ned_rig",
      "disposition": "mapped",
      "typeId": "ned_bait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "texas_rigged_soft_plastic_craw",
      "disposition": "mapped",
      "typeId": "soft_craw",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "tube_jig",
      "disposition": "mapped",
      "typeId": "soft_tube",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "big_smallmouth_tube",
      "disposition": "mapped",
      "typeId": "soft_tube",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "large_pike_tube",
      "disposition": "mapped",
      "typeId": "soft_tube",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "soft_jerkbait",
      "disposition": "mapped",
      "typeId": "soft_jerkbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "paddle_tail_swimbait",
      "disposition": "mapped",
      "typeId": "paddle_tail_swimbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "large_profile_pike_swimbait",
      "disposition": "mapped",
      "typeId": "paddle_tail_swimbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "pike_jig_and_plastic",
      "disposition": "mapped",
      "typeId": "paddle_tail_swimbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "drop_shot_minnow",
      "disposition": "mapped",
      "typeId": "straight_tail_minnow",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "compact_flipping_jig",
      "disposition": "mapped",
      "typeId": "structure_jig",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "football_jig",
      "disposition": "mapped",
      "typeId": "football_jig",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "finesse_jig",
      "disposition": "mapped",
      "typeId": "finesse_jig",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "swim_jig",
      "disposition": "mapped",
      "typeId": "swim_jig",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "hair_jig",
      "disposition": "mapped",
      "typeId": "hair_jig",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "spinnerbait",
      "disposition": "mapped",
      "typeId": "spinnerbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "pike_spinnerbait",
      "disposition": "mapped",
      "typeId": "spinnerbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "bladed_jig",
      "disposition": "mapped",
      "typeId": "bladed_jig",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "buzzbait",
      "disposition": "mapped",
      "typeId": "buzzbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "inline_spinner",
      "disposition": "mapped",
      "typeId": "inline_spinner",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "large_bucktail_spinner",
      "disposition": "mapped",
      "typeId": "bucktail_spinner",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "squarebill_crankbait",
      "disposition": "mapped",
      "typeId": "squarebill",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "flat_sided_crankbait",
      "disposition": "mapped",
      "typeId": "flat_sided_crankbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "medium_diving_crankbait",
      "disposition": "mapped",
      "typeId": "medium_crankbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "deep_diving_crankbait",
      "disposition": "mapped",
      "typeId": "deep_crankbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "lipless_crankbait",
      "disposition": "mapped",
      "typeId": "lipless_crankbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "suspending_jerkbait",
      "disposition": "mapped",
      "typeId": "hard_jerkbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "magnum_jerkbait",
      "disposition": "mapped",
      "typeId": "hard_jerkbait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "small_floating_trout_plug",
      "disposition": "mapped",
      "typeId": "floating_minnow",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "shallow_minnowbait",
      "disposition": "mapped",
      "typeId": "floating_minnow",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "glidebait",
      "disposition": "mapped",
      "typeId": "glidebait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "compact_glidebait",
      "disposition": "mapped",
      "typeId": "glidebait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "pike_glidebait",
      "disposition": "mapped",
      "typeId": "glidebait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "casting_spoon",
      "disposition": "mapped",
      "typeId": "casting_spoon",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "weedless_spoon",
      "disposition": "mapped",
      "typeId": "weedless_spoon",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "blade_bait",
      "disposition": "mapped",
      "typeId": "blade_bait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "walking_topwater",
      "disposition": "mapped",
      "typeId": "walking_bait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "large_pike_topwater",
      "disposition": "mapped",
      "typeId": "walking_bait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "popping_topwater",
      "disposition": "mapped",
      "typeId": "hard_popper",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "prop_bait",
      "disposition": "mapped",
      "typeId": "prop_bait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "wake_bait",
      "disposition": "mapped",
      "typeId": "wake_bait",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "hollow_body_frog",
      "disposition": "mapped",
      "typeId": "hollow_frog",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "woolly_bugger",
      "disposition": "mapped",
      "typeId": "woolly_bugger",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "rabbit_strip_leech",
      "disposition": "mapped",
      "typeId": "leech_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "jighead_marabou_leech",
      "disposition": "mapped",
      "typeId": "leech_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "lead_eye_leech",
      "disposition": "mapped",
      "typeId": "leech_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "feather_jig_leech",
      "disposition": "mapped",
      "typeId": "leech_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "balanced_leech",
      "disposition": "mapped",
      "typeId": "leech_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "deceiver",
      "disposition": "mapped",
      "typeId": "baitfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "bucktail_baitfish_streamer",
      "disposition": "mapped",
      "typeId": "baitfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "slim_minnow_streamer",
      "disposition": "mapped",
      "typeId": "baitfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "zonker_streamer",
      "disposition": "mapped",
      "typeId": "baitfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "unweighted_baitfish_streamer",
      "disposition": "mapped",
      "typeId": "baitfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "bluegill_streamer",
      "disposition": "mapped",
      "typeId": "baitfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "conehead_streamer",
      "disposition": "mapped",
      "typeId": "baitfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "clouser_minnow",
      "disposition": "mapped",
      "typeId": "clouser_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "articulated_baitfish_streamer",
      "disposition": "mapped",
      "typeId": "articulated_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "articulated_dungeon_streamer",
      "disposition": "mapped",
      "typeId": "articulated_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "game_changer",
      "disposition": "mapped",
      "typeId": "articulated_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "sculpin_streamer",
      "disposition": "mapped",
      "typeId": "sculpin_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "sculpzilla",
      "disposition": "mapped",
      "typeId": "sculpin_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "muddler_sculpin",
      "disposition": "mapped",
      "typeId": "sculpin_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "crawfish_streamer",
      "disposition": "mapped",
      "typeId": "crawfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "warmwater_crawfish_fly",
      "disposition": "mapped",
      "typeId": "crawfish_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "pike_bunny_streamer",
      "disposition": "mapped",
      "typeId": "pike_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "large_articulated_pike_streamer",
      "disposition": "mapped",
      "typeId": "pike_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "pike_flash_fly",
      "disposition": "mapped",
      "typeId": "flash_streamer",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "fly",
      "archetypeId": "popper_fly",
      "disposition": "mapped",
      "typeId": "fly_popper",
      "reason": "Existing archetype shape maps to this type; size and rigging do not create a separate color pool."
    },
    {
      "gearMode": "lure",
      "archetypeId": "magnum_worm",
      "disposition": "choose_type",
      "typeIds": [
        "finesse_worm",
        "ribbon_tail_worm"
      ],
      "reason": "Magnum specifies size, not straight versus ribbon tail; ask for the actual shape."
    },
    {
      "gearMode": "lure",
      "archetypeId": "pike_jerkbait",
      "disposition": "choose_type",
      "typeIds": [
        "hard_jerkbait",
        "pull_jerk_bait"
      ],
      "reason": "Existing description permits darting/sinking pull baits and does not establish a lip or construction."
    },
    {
      "gearMode": "fly",
      "archetypeId": "warmwater_worm_fly",
      "disposition": "excluded",
      "exclusion": "deferred_fly_type",
      "reason": "Worm fly is outside the committed streamer and fly-popper scope; do not relabel it as a plastic worm."
    },
    {
      "gearMode": "fly",
      "archetypeId": "baitfish_slider_fly",
      "disposition": "excluded",
      "exclusion": "deferred_fly_type",
      "reason": "Slider coverage is deferred; do not silently alias a slider to a popper or sinking streamer."
    },
    {
      "gearMode": "fly",
      "archetypeId": "deer_hair_slider",
      "disposition": "excluded",
      "exclusion": "deferred_fly_type",
      "reason": "Surface slider/diver pools are a later extension."
    },
    {
      "gearMode": "fly",
      "archetypeId": "foam_gurgler_fly",
      "disposition": "excluded",
      "exclusion": "deferred_fly_type",
      "reason": "Gurgler pools are a later extension."
    },
    {
      "gearMode": "fly",
      "archetypeId": "frog_fly",
      "disposition": "excluded",
      "exclusion": "deferred_fly_type",
      "reason": "Frog-fly pools are a later extension; conventional hollow-body frogs have different construction."
    },
    {
      "gearMode": "fly",
      "archetypeId": "mouse_fly",
      "disposition": "excluded",
      "exclusion": "deferred_fly_type",
      "reason": "Mouse-fly pools are a later extension."
    }
  ],
  "imageRequirements": [
    {
      "id": "type_stick_worm",
      "role": "bait_type",
      "subjectId": "stick_worm",
      "targetPath": "assets/images/color-picker/types/stick_worm.png",
      "referencePaths": [
        "assets/images/lures/weightless_stick_worm.png",
        "assets/images/lures/carolina_rigged_stick_worm.png"
      ],
      "status": "reference_review_pending",
      "brief": "Stick worm: A thick, straight soft-plastic worm with a tapered end. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_finesse_worm",
      "role": "bait_type",
      "subjectId": "finesse_worm",
      "targetPath": "assets/images/color-picker/types/finesse_worm.png",
      "referencePaths": [
        "assets/images/lures/shaky_head_worm.png",
        "assets/images/lures/drop_shot_worm.png"
      ],
      "status": "reference_review_pending",
      "brief": "Finesse / straight-tail worm: A slender worm with a straight or gently tapered tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_ribbon_tail_worm",
      "role": "bait_type",
      "subjectId": "ribbon_tail_worm",
      "targetPath": "assets/images/color-picker/types/ribbon_tail_worm.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Ribbon-tail worm: A worm with a long, curling ribbon tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_ned_bait",
      "role": "bait_type",
      "subjectId": "ned_bait",
      "targetPath": "assets/images/color-picker/types/ned_bait.png",
      "referencePaths": [
        "assets/images/lures/ned_rig.png"
      ],
      "status": "reference_review_pending",
      "brief": "Ned-style bait: A short, blunt soft-plastic stick bait. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_soft_craw",
      "role": "bait_type",
      "subjectId": "soft_craw",
      "targetPath": "assets/images/color-picker/types/soft_craw.png",
      "referencePaths": [
        "assets/images/lures/texas_rigged_soft_plastic_craw.png"
      ],
      "status": "reference_review_pending",
      "brief": "Soft craw: A soft-plastic crawfish with two distinct claws. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_creature_bait",
      "role": "bait_type",
      "subjectId": "creature_bait",
      "targetPath": "assets/images/color-picker/types/creature_bait.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Creature / beaver bait: A broad soft body with appendages or paddle-shaped tails. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_soft_tube",
      "role": "bait_type",
      "subjectId": "soft_tube",
      "targetPath": "assets/images/color-picker/types/soft_tube.png",
      "referencePaths": [
        "assets/images/lures/tube_jig.png",
        "assets/images/lures/big_smallmouth_tube.png",
        "assets/images/lures/large_pike_tube.png"
      ],
      "status": "reference_review_pending",
      "brief": "Tube: A hollow cylindrical body with a fringed tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_curly_tail_grub",
      "role": "bait_type",
      "subjectId": "curly_tail_grub",
      "targetPath": "assets/images/color-picker/types/curly_tail_grub.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Curly-tail grub: A short grub body with one curved swimming tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_soft_jerkbait",
      "role": "bait_type",
      "subjectId": "soft_jerkbait",
      "targetPath": "assets/images/color-picker/types/soft_jerkbait.png",
      "referencePaths": [
        "assets/images/lures/soft_jerkbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Soft jerkbait: A soft minnow profile with a forked or pointed tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_paddle_tail_swimbait",
      "role": "bait_type",
      "subjectId": "paddle_tail_swimbait",
      "targetPath": "assets/images/color-picker/types/paddle_tail_swimbait.png",
      "referencePaths": [
        "assets/images/lures/paddle_tail_swimbait.png",
        "assets/images/lures/large_profile_pike_swimbait.png",
        "assets/images/lures/pike_jig_and_plastic.png"
      ],
      "status": "reference_review_pending",
      "brief": "Paddle-tail swimbait: A soft baitfish body ending in a paddle tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_straight_tail_minnow",
      "role": "bait_type",
      "subjectId": "straight_tail_minnow",
      "targetPath": "assets/images/color-picker/types/straight_tail_minnow.png",
      "referencePaths": [
        "assets/images/lures/drop_shot_minnow.png"
      ],
      "status": "reference_review_pending",
      "brief": "Straight-tail minnow: A slender soft minnow with a straight, non-paddle tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_soft_toad",
      "role": "bait_type",
      "subjectId": "soft_toad",
      "targetPath": "assets/images/color-picker/types/soft_toad.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Soft toad: A solid soft-plastic frog with two swimming legs. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_structure_jig",
      "role": "bait_type",
      "subjectId": "structure_jig",
      "targetPath": "assets/images/color-picker/types/structure_jig.png",
      "referencePaths": [
        "assets/images/lures/compact_flipping_jig.png"
      ],
      "status": "reference_review_pending",
      "brief": "Flipping / structure jig: A compact skirted jig for a coordinated skirt and trailer pattern. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_football_jig",
      "role": "bait_type",
      "subjectId": "football_jig",
      "targetPath": "assets/images/color-picker/types/football_jig.png",
      "referencePaths": [
        "assets/images/lures/football_jig.png"
      ],
      "status": "reference_review_pending",
      "brief": "Football jig: A skirted jig with a wide football-shaped head. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_finesse_jig",
      "role": "bait_type",
      "subjectId": "finesse_jig",
      "targetPath": "assets/images/color-picker/types/finesse_jig.png",
      "referencePaths": [
        "assets/images/lures/finesse_jig.png"
      ],
      "status": "reference_review_pending",
      "brief": "Finesse jig: A small skirted jig with a compact trailer. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_swim_jig",
      "role": "bait_type",
      "subjectId": "swim_jig",
      "targetPath": "assets/images/color-picker/types/swim_jig.png",
      "referencePaths": [
        "assets/images/lures/swim_jig.png"
      ],
      "status": "reference_review_pending",
      "brief": "Swim jig: A streamlined skirted jig with a swimming trailer. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_hair_jig",
      "role": "bait_type",
      "subjectId": "hair_jig",
      "targetPath": "assets/images/color-picker/types/hair_jig.png",
      "referencePaths": [
        "assets/images/lures/hair_jig.png"
      ],
      "status": "reference_review_pending",
      "brief": "Hair / marabou jig: A jig dressed with hair or soft feathers rather than a silicone skirt. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_spinnerbait",
      "role": "bait_type",
      "subjectId": "spinnerbait",
      "targetPath": "assets/images/color-picker/types/spinnerbait.png",
      "referencePaths": [
        "assets/images/lures/spinnerbait.png",
        "assets/images/lures/pike_spinnerbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Spinnerbait: A bent-wire lure with blades above a skirted hook. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_bladed_jig",
      "role": "bait_type",
      "subjectId": "bladed_jig",
      "targetPath": "assets/images/color-picker/types/bladed_jig.png",
      "referencePaths": [
        "assets/images/lures/bladed_jig.png"
      ],
      "status": "reference_review_pending",
      "brief": "Bladed jig: A skirted jig with a vibration blade at its head. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_buzzbait",
      "role": "bait_type",
      "subjectId": "buzzbait",
      "targetPath": "assets/images/color-picker/types/buzzbait.png",
      "referencePaths": [
        "assets/images/lures/buzzbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Buzzbait: A wire lure with a surface propeller above a skirted hook. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_inline_spinner",
      "role": "bait_type",
      "subjectId": "inline_spinner",
      "targetPath": "assets/images/color-picker/types/inline_spinner.png",
      "referencePaths": [
        "assets/images/lures/inline_spinner.png"
      ],
      "status": "reference_review_pending",
      "brief": "Inline spinner: A blade rotating around a straight wire body. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_bucktail_spinner",
      "role": "bait_type",
      "subjectId": "bucktail_spinner",
      "targetPath": "assets/images/color-picker/types/bucktail_spinner.png",
      "referencePaths": [
        "assets/images/lures/large_bucktail_spinner.png"
      ],
      "status": "reference_review_pending",
      "brief": "Large bucktail spinner: An inline spinner with a substantial bucktail or skirt dressing. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_underspin",
      "role": "bait_type",
      "subjectId": "underspin",
      "targetPath": "assets/images/color-picker/types/underspin.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Underspin: A baitfish-shaped soft body with a small blade suspended beneath. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_squarebill",
      "role": "bait_type",
      "subjectId": "squarebill",
      "targetPath": "assets/images/color-picker/types/squarebill.png",
      "referencePaths": [
        "assets/images/lures/squarebill_crankbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Squarebill crankbait: A hard diving bait with a short square lip. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_flat_sided_crankbait",
      "role": "bait_type",
      "subjectId": "flat_sided_crankbait",
      "targetPath": "assets/images/color-picker/types/flat_sided_crankbait.png",
      "referencePaths": [
        "assets/images/lures/flat_sided_crankbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Flat-sided crankbait: A narrow hard crankbait with flattened sides. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_medium_crankbait",
      "role": "bait_type",
      "subjectId": "medium_crankbait",
      "targetPath": "assets/images/color-picker/types/medium_crankbait.png",
      "referencePaths": [
        "assets/images/lures/medium_diving_crankbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Medium-diving crankbait: A rounded hard crankbait with a medium diving lip. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_deep_crankbait",
      "role": "bait_type",
      "subjectId": "deep_crankbait",
      "targetPath": "assets/images/color-picker/types/deep_crankbait.png",
      "referencePaths": [
        "assets/images/lures/deep_diving_crankbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Deep-diving crankbait: A hard crankbait with an extended diving lip. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_lipless_crankbait",
      "role": "bait_type",
      "subjectId": "lipless_crankbait",
      "targetPath": "assets/images/color-picker/types/lipless_crankbait.png",
      "referencePaths": [
        "assets/images/lures/lipless_crankbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Lipless crankbait: A flat-sided sinking hard bait with no diving lip. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_hard_jerkbait",
      "role": "bait_type",
      "subjectId": "hard_jerkbait",
      "targetPath": "assets/images/color-picker/types/hard_jerkbait.png",
      "referencePaths": [
        "assets/images/lures/suspending_jerkbait.png",
        "assets/images/lures/magnum_jerkbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Hard jerkbait: A slender hard minnow with a small lip for darting retrieves. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_floating_minnow",
      "role": "bait_type",
      "subjectId": "floating_minnow",
      "targetPath": "assets/images/color-picker/types/floating_minnow.png",
      "referencePaths": [
        "assets/images/lures/small_floating_trout_plug.png",
        "assets/images/lures/shallow_minnowbait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Floating minnow plug: A buoyant slender minnow plug with a diving lip. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_hard_swimbait",
      "role": "bait_type",
      "subjectId": "hard_swimbait",
      "targetPath": "assets/images/color-picker/types/hard_swimbait.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Hard swimbait: A jointed hard baitfish body; distinct from a soft paddle tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_glidebait",
      "role": "bait_type",
      "subjectId": "glidebait",
      "targetPath": "assets/images/color-picker/types/glidebait.png",
      "referencePaths": [
        "assets/images/lures/glidebait.png",
        "assets/images/lures/compact_glidebait.png",
        "assets/images/lures/pike_glidebait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Glidebait: A hard baitfish lure designed for a side-to-side glide. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_pull_jerk_bait",
      "role": "bait_type",
      "subjectId": "pull_jerk_bait",
      "targetPath": "assets/images/color-picker/types/pull_jerk_bait.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Pull / jerk bait: An elongated hard pull bait, distinct from a small-lipped minnow jerkbait. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_tail_spinner",
      "role": "bait_type",
      "subjectId": "tail_spinner",
      "targetPath": "assets/images/color-picker/types/tail_spinner.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Tail spinner: A compact weighted baitfish body with a spinner blade at the tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_horizontal_jigging_minnow",
      "role": "bait_type",
      "subjectId": "horizontal_jigging_minnow",
      "targetPath": "assets/images/color-picker/types/horizontal_jigging_minnow.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Horizontal jigging minnow: A balanced hard minnow with a tail fin for horizontal jigging. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_casting_spoon",
      "role": "bait_type",
      "subjectId": "casting_spoon",
      "targetPath": "assets/images/color-picker/types/casting_spoon.png",
      "referencePaths": [
        "assets/images/lures/casting_spoon.png"
      ],
      "status": "reference_review_pending",
      "brief": "Casting spoon: A curved metal spoon with a trailing hook. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_weedless_spoon",
      "role": "bait_type",
      "subjectId": "weedless_spoon",
      "targetPath": "assets/images/color-picker/types/weedless_spoon.png",
      "referencePaths": [
        "assets/images/lures/weedless_spoon.png"
      ],
      "status": "reference_review_pending",
      "brief": "Weedless spoon: A metal spoon with a single guarded hook. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_trolling_spoon",
      "role": "bait_type",
      "subjectId": "trolling_spoon",
      "targetPath": "assets/images/color-picker/types/trolling_spoon.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Trolling spoon: A thin, curved metal spoon intended for trolling. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_jigging_spoon",
      "role": "bait_type",
      "subjectId": "jigging_spoon",
      "targetPath": "assets/images/color-picker/types/jigging_spoon.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Jigging spoon: A compact weighted metal spoon for vertical presentations. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_blade_bait",
      "role": "bait_type",
      "subjectId": "blade_bait",
      "targetPath": "assets/images/color-picker/types/blade_bait.png",
      "referencePaths": [
        "assets/images/lures/blade_bait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Blade bait: A thin metal baitfish plate with a weighted belly. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_walking_bait",
      "role": "bait_type",
      "subjectId": "walking_bait",
      "targetPath": "assets/images/color-picker/types/walking_bait.png",
      "referencePaths": [
        "assets/images/lures/walking_topwater.png",
        "assets/images/lures/large_pike_topwater.png"
      ],
      "status": "reference_review_pending",
      "brief": "Walking bait: A lipless floating hard bait with an elongated body. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_hard_popper",
      "role": "bait_type",
      "subjectId": "hard_popper",
      "targetPath": "assets/images/color-picker/types/hard_popper.png",
      "referencePaths": [
        "assets/images/lures/popping_topwater.png"
      ],
      "status": "reference_review_pending",
      "brief": "Hard-bait popper: A hard floating plug with a cupped face and treble hooks. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_prop_bait",
      "role": "bait_type",
      "subjectId": "prop_bait",
      "targetPath": "assets/images/color-picker/types/prop_bait.png",
      "referencePaths": [
        "assets/images/lures/prop_bait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Prop bait: A hard floating lure with small metal propellers. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_plopper_bait",
      "role": "bait_type",
      "subjectId": "plopper_bait",
      "targetPath": "assets/images/color-picker/types/plopper_bait.png",
      "referencePaths": [],
      "status": "generation_needed",
      "brief": "Plopper bait: A hard floating lure with a large rotating tail paddle. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_wake_bait",
      "role": "bait_type",
      "subjectId": "wake_bait",
      "targetPath": "assets/images/color-picker/types/wake_bait.png",
      "referencePaths": [
        "assets/images/lures/wake_bait.png"
      ],
      "status": "reference_review_pending",
      "brief": "Wake bait: A hard shallow-running bait designed to leave a surface wake. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_hollow_frog",
      "role": "bait_type",
      "subjectId": "hollow_frog",
      "targetPath": "assets/images/color-picker/types/hollow_frog.png",
      "referencePaths": [
        "assets/images/lures/hollow_body_frog.png"
      ],
      "status": "reference_review_pending",
      "brief": "Hollow-body frog: A collapsible frog body with an upward-facing double hook. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_woolly_bugger",
      "role": "bait_type",
      "subjectId": "woolly_bugger",
      "targetPath": "assets/images/color-picker/types/woolly_bugger.png",
      "referencePaths": [
        "assets/images/flies/woolly_bugger.png"
      ],
      "status": "reference_review_pending",
      "brief": "Woolly Bugger: A fly with a hackled body and flowing marabou tail. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_leech_streamer",
      "role": "bait_type",
      "subjectId": "leech_streamer",
      "targetPath": "assets/images/color-picker/types/leech_streamer.png",
      "referencePaths": [
        "assets/images/flies/rabbit_strip_leech.png",
        "assets/images/flies/jighead_marabou_leech.png",
        "assets/images/flies/lead_eye_leech.png",
        "assets/images/flies/feather_jig_leech.png",
        "assets/images/flies/balanced_leech.png"
      ],
      "status": "reference_review_pending",
      "brief": "Leech streamer: An elongated leech-shaped fly made from fur or feathers. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_baitfish_streamer",
      "role": "bait_type",
      "subjectId": "baitfish_streamer",
      "targetPath": "assets/images/color-picker/types/baitfish_streamer.png",
      "referencePaths": [
        "assets/images/flies/deceiver.png",
        "assets/images/flies/bucktail_baitfish_streamer.png",
        "assets/images/flies/slim_minnow_streamer.png",
        "assets/images/flies/zonker_streamer.png",
        "assets/images/flies/unweighted_baitfish_streamer.png",
        "assets/images/flies/bluegill_streamer.png",
        "assets/images/flies/conehead_streamer.png"
      ],
      "status": "reference_review_pending",
      "brief": "Baitfish / minnow streamer: A non-articulated streamer with a recognizable baitfish profile. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_clouser_streamer",
      "role": "bait_type",
      "subjectId": "clouser_streamer",
      "targetPath": "assets/images/color-picker/types/clouser_streamer.png",
      "referencePaths": [
        "assets/images/flies/clouser_minnow.png"
      ],
      "status": "reference_review_pending",
      "brief": "Clouser-style streamer: A sparse baitfish fly with weighted eyes and separate upper and lower wings. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_articulated_streamer",
      "role": "bait_type",
      "subjectId": "articulated_streamer",
      "targetPath": "assets/images/color-picker/types/articulated_streamer.png",
      "referencePaths": [
        "assets/images/flies/articulated_baitfish_streamer.png",
        "assets/images/flies/articulated_dungeon_streamer.png",
        "assets/images/flies/game_changer.png"
      ],
      "status": "reference_review_pending",
      "brief": "Articulated streamer: A streamer with multiple connected body segments. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_sculpin_streamer",
      "role": "bait_type",
      "subjectId": "sculpin_streamer",
      "targetPath": "assets/images/color-picker/types/sculpin_streamer.png",
      "referencePaths": [
        "assets/images/flies/sculpin_streamer.png",
        "assets/images/flies/sculpzilla.png",
        "assets/images/flies/muddler_sculpin.png"
      ],
      "status": "reference_review_pending",
      "brief": "Sculpin streamer: A bottom-oriented baitfish fly with a broad sculpin head. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_crawfish_streamer",
      "role": "bait_type",
      "subjectId": "crawfish_streamer",
      "targetPath": "assets/images/color-picker/types/crawfish_streamer.png",
      "referencePaths": [
        "assets/images/flies/crawfish_streamer.png",
        "assets/images/flies/warmwater_crawfish_fly.png"
      ],
      "status": "reference_review_pending",
      "brief": "Crawfish streamer: A crawfish-shaped fly with paired claws and a segmented body. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_pike_streamer",
      "role": "bait_type",
      "subjectId": "pike_streamer",
      "targetPath": "assets/images/color-picker/types/pike_streamer.png",
      "referencePaths": [
        "assets/images/flies/pike_bunny_streamer.png",
        "assets/images/flies/large_articulated_pike_streamer.png"
      ],
      "status": "reference_review_pending",
      "brief": "Large pike streamer: A long, substantial predator fly with flowing materials. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_flash_streamer",
      "role": "bait_type",
      "subjectId": "flash_streamer",
      "targetPath": "assets/images/color-picker/types/flash_streamer.png",
      "referencePaths": [
        "assets/images/flies/pike_flash_fly.png"
      ],
      "status": "reference_review_pending",
      "brief": "Flash streamer: A baitfish streamer whose visible body is predominantly reflective flash material. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "type_fly_popper",
      "role": "bait_type",
      "subjectId": "fly_popper",
      "targetPath": "assets/images/color-picker/types/fly_popper.png",
      "referencePaths": [
        "assets/images/flies/popper_fly.png"
      ],
      "status": "reference_review_pending",
      "brief": "Fly popper: A cupped foam, cork, or hair fly head with a dressed single hook, tail, and optional legs. Square field-guide illustration, transparent background, neutral lighting, complete hook and tail within frame. Existing references require visual review; no current color implies eligibility."
    },
    {
      "id": "category_soft_plastics",
      "role": "category",
      "subjectId": "soft_plastics",
      "targetPath": "assets/images/color-picker/categories/soft_plastics.png",
      "referencePaths": [
        "assets/images/lures/weightless_stick_worm.png"
      ],
      "status": "generation_needed",
      "brief": "Soft plastics: one clearly recognizable representative bait, visually consistent with type tiles. Worms, craws, tubes, and soft baitfish. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "category_jigs",
      "role": "category",
      "subjectId": "jigs",
      "targetPath": "assets/images/color-picker/categories/jigs.png",
      "referencePaths": [
        "assets/images/lures/compact_flipping_jig.png"
      ],
      "status": "generation_needed",
      "brief": "Jigs: one clearly recognizable representative bait, visually consistent with type tiles. Skirted, hair, and marabou jigs. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "category_bladed_wire",
      "role": "category",
      "subjectId": "bladed_wire",
      "targetPath": "assets/images/color-picker/categories/bladed_wire.png",
      "referencePaths": [
        "assets/images/lures/spinnerbait.png"
      ],
      "status": "generation_needed",
      "brief": "Bladed & wire baits: one clearly recognizable representative bait, visually consistent with type tiles. Spinnerbaits, bladed jigs, and inline spinners. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "category_hard_baits",
      "role": "category",
      "subjectId": "hard_baits",
      "targetPath": "assets/images/color-picker/categories/hard_baits.png",
      "referencePaths": [
        "assets/images/lures/squarebill_crankbait.png"
      ],
      "status": "generation_needed",
      "brief": "Hard baits: one clearly recognizable representative bait, visually consistent with type tiles. Crankbaits, jerkbaits, and hard swimbaits. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "category_metal_baits",
      "role": "category",
      "subjectId": "metal_baits",
      "targetPath": "assets/images/color-picker/categories/metal_baits.png",
      "referencePaths": [
        "assets/images/lures/casting_spoon.png"
      ],
      "status": "generation_needed",
      "brief": "Spoons & metal baits: one clearly recognizable representative bait, visually consistent with type tiles. Reflective and painted metal lures. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "category_topwater_lures",
      "role": "category",
      "subjectId": "topwater_lures",
      "targetPath": "assets/images/color-picker/categories/topwater_lures.png",
      "referencePaths": [
        "assets/images/lures/walking_topwater.png"
      ],
      "status": "generation_needed",
      "brief": "Topwater lures: one clearly recognizable representative bait, visually consistent with type tiles. Walking baits, hard poppers, and frogs. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "category_streamers",
      "role": "category",
      "subjectId": "streamers",
      "targetPath": "assets/images/color-picker/categories/streamers.png",
      "referencePaths": [
        "assets/images/flies/woolly_bugger.png"
      ],
      "status": "generation_needed",
      "brief": "Streamers: one clearly recognizable representative bait, visually consistent with type tiles. Baitfish, leech, sculpin, and crawfish flies. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "category_surface_flies",
      "role": "category",
      "subjectId": "surface_flies",
      "targetPath": "assets/images/color-picker/categories/surface_flies.png",
      "referencePaths": [
        "assets/images/flies/popper_fly.png"
      ],
      "status": "generation_needed",
      "brief": "Surface flies: one clearly recognizable representative bait, visually consistent with type tiles. Fly poppers with their own color patterns. Square transparent field-guide illustration with generous margins."
    },
    {
      "id": "clarity_clear",
      "role": "clarity",
      "subjectId": "clear",
      "targetPath": "assets/images/waterclarity/clear.png",
      "referencePaths": [
        "assets/images/waterclarity/clear.png"
      ],
      "status": "reference_review_pending",
      "brief": "Review existing clarity thumbnail at final selector size. Reuse when visually consistent; text must describe visibility rather than water tint."
    },
    {
      "id": "clarity_stained",
      "role": "clarity",
      "subjectId": "stained",
      "targetPath": "assets/images/waterclarity/stained_circle.png",
      "referencePaths": [
        "assets/images/waterclarity/stained_circle.png"
      ],
      "status": "reference_review_pending",
      "brief": "Review existing clarity thumbnail at final selector size. Reuse when visually consistent; text must describe visibility rather than water tint."
    },
    {
      "id": "clarity_dirty",
      "role": "clarity",
      "subjectId": "dirty",
      "targetPath": "assets/images/waterclarity/murky_circle.png",
      "referencePaths": [
        "assets/images/waterclarity/murky_circle.png"
      ],
      "status": "reference_review_pending",
      "brief": "Review existing clarity thumbnail at final selector size. Reuse when visually consistent; text must describe visibility rather than water tint."
    }
  ],
  "deferredTypes": [
    {
      "id": "warmwater_worm_fly",
      "reason": "Worm fly is outside the committed streamer and fly-popper scope; do not relabel it as a plastic worm."
    },
    {
      "id": "baitfish_slider_fly",
      "reason": "Slider coverage is deferred; do not silently alias a slider to a popper or sinking streamer."
    },
    {
      "id": "deer_hair_slider",
      "reason": "Surface slider/diver pools are a later extension."
    },
    {
      "id": "foam_gurgler_fly",
      "reason": "Gurgler pools are a later extension."
    },
    {
      "id": "frog_fly",
      "reason": "Frog-fly pools are a later extension; conventional hollow-body frogs have different construction."
    },
    {
      "id": "mouse_fly",
      "reason": "Mouse-fly pools are a later extension."
    }
  ]
};
