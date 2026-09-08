import assert from "node:assert/strict";
import { colorTypeForArchetype } from "../lib/colorPickerRouting";
import { LURE_ARCHETYPES_V4, FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/index";
import { PICKER_CHOICES } from "../supabase/functions/_shared/colorPickerEngine/pickerChoices";

// Explicit expectations for every current recommendation, independent of the resolver.
const groups: Record<string, string[]> = {
  soft_plastic_worm: ["weightless_stick_worm", "carolina_rigged_stick_worm", "shaky_head_worm", "magnum_worm", "drop_shot_worm", "ned_rig"],
  soft_jerkbait: ["drop_shot_minnow", "soft_jerkbait"],
  soft_tube: ["tube_jig", "big_smallmouth_tube", "large_pike_tube"],
  soft_craw: ["texas_rigged_soft_plastic_craw"],
  skirted_jig: ["football_jig", "compact_flipping_jig", "finesse_jig", "swim_jig"],
  hair_jig: ["hair_jig"],
  inline_spinner: ["inline_spinner", "large_bucktail_spinner"],
  spinnerbait: ["spinnerbait", "pike_spinnerbait"],
  bladed_jig: ["bladed_jig"],
  paddle_tail_swimbait: ["paddle_tail_swimbait", "large_profile_pike_swimbait", "pike_jig_and_plastic"],
  hard_swimbait: ["glidebait", "compact_glidebait", "pike_glidebait"],
  hard_jerkbait: ["suspending_jerkbait", "magnum_jerkbait", "small_floating_trout_plug", "shallow_minnowbait", "pike_jerkbait"],
  crankbait: ["squarebill_crankbait", "flat_sided_crankbait", "medium_diving_crankbait", "deep_diving_crankbait"],
  lipless_crankbait: ["lipless_crankbait"],
  spoon: ["casting_spoon", "weedless_spoon"],
  topwater: ["walking_topwater", "popping_topwater", "prop_bait", "wake_bait", "large_pike_topwater"],
  buzzbait: ["buzzbait"],
  hollow_frog: ["hollow_body_frog"],
  fly_popper: ["popper_fly"],
  streamer: ["clouser_minnow", "deceiver", "bucktail_baitfish_streamer", "slim_minnow_streamer", "articulated_baitfish_streamer", "articulated_dungeon_streamer", "game_changer", "woolly_bugger", "rabbit_strip_leech", "jighead_marabou_leech", "lead_eye_leech", "feather_jig_leech", "balanced_leech", "zonker_streamer", "conehead_streamer", "pike_bunny_streamer", "large_articulated_pike_streamer", "unweighted_baitfish_streamer", "pike_flash_fly"],
};
const noLink = ["sculpin_streamer", "sculpzilla", "muddler_sculpin", "crawfish_streamer", "warmwater_crawfish_fly", "bluegill_streamer", "mouse_fly", "blade_bait", "warmwater_worm_fly", "baitfish_slider_fly", "deer_hair_slider", "foam_gurgler_fly", "frog_fly"];
const checked = new Set<string>();
for (const [target, ids] of Object.entries(groups)) {
  assert(PICKER_CHOICES.some(choice => choice.id === target), `Missing destination ${target}`);
  for (const id of ids) {
    assert(!checked.has(id), `Duplicate expectation ${id}`);
    checked.add(id);
    assert.equal(colorTypeForArchetype(id), target, id);
  }
}
for (const id of noLink) {
  assert(!checked.has(id));
  checked.add(id);
  assert.equal(colorTypeForArchetype(id), undefined, id);
}
assert.deepEqual([...checked].sort(), [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4].map(x => x.id).sort());
assert.equal(colorTypeForArchetype("unknown_bait"), undefined);
console.log(`PASS: ${checked.size} archetypes; ${checked.size - noLink.length} correct destinations; ${noLink.length} deliberate omissions; unknown IDs rejected.`);
