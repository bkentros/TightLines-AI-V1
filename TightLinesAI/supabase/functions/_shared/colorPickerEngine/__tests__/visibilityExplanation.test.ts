import test from "node:test";
import assert from "node:assert/strict";
import { PICKER_CHOICES } from "../pickerChoices.ts";
import { compileResearchMatrix } from "../researchMatrix.ts";
import { COLOR_PATTERNS } from "../colorPatterns.ts";
import { explainColorVisibility } from "../visibilityExplanation.ts";
const pattern = (id: string) => COLOR_PATTERNS.find(p => p.id === id)!;

test("Firetiger consistently includes green, yellow-green, black and orange", () => {
  for (const id of ["hard_firetiger", "metal_firetiger", "inline_firetiger", "bucktail_firetiger"]) {
    const p = pattern(id);
    assert.deepEqual(p.swatches, ["#208E38", "#C9E63D", "#171819", "#E87524"]);
    assert.match(p.visualDescription, /green/i);
    assert.match(p.visualDescription, /orange/i);
    assert.match(p.visualDescription, /black/i);
    assert.match(explainColorVisibility(p, "dirty", "sunny", "crankbait"), /contrast/);
    assert.equal(explainColorVisibility(p, "dirty", "sunny", "crankbait"), explainColorVisibility(p, "dirty", "cloudy", "crankbait"));
  }
});
test("named palettes keep body color first and omit incidental hardware", () => {
  assert.equal(pattern("plastic_green_pumpkin").swatches[0], "#59603A");
  assert.equal(pattern("plastic_watermelon_seed").swatches[0], "#658044");
  assert.deepEqual(pattern("buzz_chartreuse").swatches, ["#C9E63D"]);
  assert.deepEqual(pattern("toad_white").swatches, ["#F5F3E9"]);
  assert(!pattern("popper_white").swatches.includes("#B73529"));
  assert.match(pattern("plastic_junebug").components.flake, /emerald-green/);
});
test("visibility copy states mechanisms and their physical limits", () => {
  assert.match(explainColorVisibility(pattern("frog_black"), "dirty", "cloudy", "hollow_frog"), /against the brighter sky/);
  assert.match(explainColorVisibility(pattern("metal_silver"), "clear", "sunny", "spoon"), /catch sunlight/);
  assert.match(explainColorVisibility(pattern("metal_silver"), "clear", "cloudy", "spoon"), /diffuse daylight/);
  assert.match(explainColorVisibility(pattern("hard_ghost"), "clear", "sunny", "hard_jerkbait"), /softening its outline/);
  assert.match(explainColorVisibility(pattern("hard_ghost"), "dirty", "cloudy", "hard_jerkbait"), /limits how far/);
});


test("surface copy uses the underside, including soft toads and blue poppers", () => {
  for (const light of ["sunny", "cloudy"] as const) {
    assert.match(explainColorVisibility(pattern("toad_black"), "dirty", light, "soft_toad"), /underside.*silhouette/);
    assert.match(explainColorVisibility(pattern("frog_white"), "clear", light, "hollow_frog"), /pale underside/);
    assert.match(explainColorVisibility(pattern("popper_blue"), "clear", light, "fly_popper"), /colored underside/);
    assert.doesNotMatch(explainColorVisibility(pattern("popper_yellow_orange"), "clear", light, "fly_popper"), /pale|earth/);
    assert.match(explainColorVisibility(pattern("hard_ghost"), "clear", light, "topwater"), /translucent underside/);
  }
});
test("fibers, paint, flake and incidental hardware are not interchangeable", () => {
  assert.match(explainColorVisibility(pattern("fly_white"), "dirty", "cloudy", "streamer"), /pale areas.*dark background/);
  assert.match(explainColorVisibility(pattern("hair_olive"), "clear", "sunny", "hair_jig"), /Gaps between the fibers/);
  assert.match(explainColorVisibility(pattern("inline_black_chartreuse"), "stained", "sunny", "inline_spinner"), /dots.*blade/);
  assert.match(explainColorVisibility(pattern("spinner_white_silver"), "clear", "sunny", "spinnerbait"), /pale areas/);
  assert.doesNotMatch(explainColorVisibility(pattern("plastic_pbj"), "clear", "sunny", "soft_plastic_worm"), /reflective/);
  assert.match(explainColorVisibility(pattern("plastic_red_shad"), "dirty", "cloudy", "soft_plastic_worm"), /dark body/);
});

test("every live eligible color has a specific brief explanation", () => {
  const pools = compileResearchMatrix().pools;
  let reviewed = 0;
  for (const bait of PICKER_CHOICES) {
    for (const pool of pools.filter(p => p.typeId === bait.poolTypeId)) {
      for (const id of pool.patternIds) {
        const text = explainColorVisibility(pattern(id), pool.clarity, pool.light, bait.id);
        assert(text.length >= 20 && text.length <= 180, `${bait.id}/${id}: ${text}`);
        assert(!text.startsWith("The pattern can contrast"), `Unclassified live pattern: ${bait.id}/${id}`);
        assert.doesNotMatch(text, /guarantee|glow|best|always|earth tones/i);
        reviewed++;
      }
    }
  }
  assert.equal(reviewed, 614);
});

test("new recipes retain their actual accents and concise physical explanations", () => {
  assert.equal(pattern("plastic_blue_black").components.belly, "black");
  assert.match(pattern("plastic_gp_chart_tail").components.tail, /only the final tail/);
  assert.match(pattern("plastic_gp_red").components.flake, /red/);
  assert.deepEqual(pattern("metal_five_diamonds").swatches, ["#E4C63A", "#B73529"]);
  for (const id of ["metal_red_white", "metal_five_diamonds"]) {
    assert.match(explainColorVisibility(pattern(id), "dirty", "cloudy", "spoon"), /red markings.*darker/);
  }
  assert.match(explainColorVisibility(pattern("plastic_gp_chart_tail"), "dirty", "sunny", "soft_plastic_worm"), /tail contrasts/);
  assert.match(explainColorVisibility(pattern("underspin_junebug"), "dirty", "cloudy", "underspin"), /dark body/);
});
