import type { Clarity, ColorPattern, LightState } from "./researchSchema.ts";

type LightContext = LightState | "shared";

/** Visibility mechanisms, not measured catch advantages. Background, depth and
 * turbidity composition are unknown: never infer a guaranteed visible hue or range.
 * Inspect the viewing surface first; incidental metal hardware is not a color choice. */
export function explainColorVisibility(pattern: ColorPattern, clarity: Clarity, light: LightContext, typeId: string): string {
  const c = pattern.components;
  const primary = c.skirt ?? c.body ?? c.belly ?? c.wing ?? "";
  const surface = ["topwater", "hollow_frog", "soft_toad", "fly_popper", "buzzbait", "walking_bait", "hard_popper", "walking_topwater", "popping_topwater", "prop_bait", "wake_bait"].includes(typeId);
  const dark = (value: string) => /^(black|opaque (near-)?black|deep aubergine|wine-plum|deep burgundy)/i.test(value);
  if (surface) {
    const underside = c.belly ?? c.skirt ?? primary;
    if (pattern.opacity === "translucent") return "The translucent underside lets some light through; viewed from below, its outline depends on the sky and reflections.";
    if (dark(underside)) return "The dark underside can form a silhouette against the brighter sky, in sunshine or under clouds.";
    if (/white|pearl|bone/i.test(underside)) return "The pale underside can contrast with dark reflections; against bright sky, its outline matters more than its hue.";
    return "Viewed from below, the colored underside and outline matter more than the back pattern; contrast depends on the sky and reflections.";
  }
  if (pattern.id === "metal_red_white" || pattern.id === "metal_five_diamonds") return "The light background and red markings offer contrast at close range; filtered light can make the red markings appear darker.";
  if (pattern.id === "plastic_gp_chart_tail") return "The chartreuse tail contrasts with the darker green-pumpkin body at close range; murk limits how far the accent can be seen.";
  if (pattern.id.includes("firetiger")) return clarity === "clear"
    ? "Bright areas and black markings create light–dark contrast without needing direct sun."
    : "Bright areas and black markings offer contrast at close range; murk limits how far the pattern remains visible.";
  if (pattern.id.startsWith("inline_black_")) return "Light dots contrast with the black blade as it turns; the pattern does not need metallic flash to create contrast.";
  if (pattern.finish === "metallic" || (pattern.flash === "strong" && c.blade)) return light === "shared"
    ? clarity === "clear"
      ? "Reflective surfaces can flash as the bait moves; intensity depends on the available light and viewing angle."
      : "Reflective surfaces can flash at close range; available light, viewing angle, and reduced clarity limit that flash."
    : light === "sunny"
    ? clarity === "clear"
      ? "Reflective surfaces can catch sunlight and flash as the bait moves."
      : "Reflective surfaces can catch sunlight at close range; reduced clarity limits how far the flash travels."
    : "Reflective surfaces can catch diffuse daylight under clouds; flash still depends on available light and viewing angle.";
  if (dark(primary)) return clarity === "clear"
    ? "The dark body can contrast with brighter water or bottom; that contrast does not require direct sun."
    : "The dark body can contrast with a lighter background at close range; murk still reduces visibility.";
  if (pattern.opacity === "translucent") {
    if (clarity !== "clear") return "Translucency gives a subtler profile at close range; reduced clarity limits how far it can be seen.";
    return light === "shared"
      ? "The partly see-through body offers a subtle profile; its outline changes with the available light and background."
      : light === "sunny"
      ? "Light can pass through the body, softening its outline in clear, sunlit water."
      : "The partly see-through body offers a subtle profile where clear water still preserves detail under clouds.";
  }
  if (/white|pearl|bone/i.test(primary)) return clarity === "clear"
    ? "The pale areas can contrast with darker cover or bottom, using available daylight even under clouds."
    : "The pale areas can contrast with a dark background at close range; murk still limits visibility.";
  if (/chartreuse|yellow/i.test(primary)) return clarity === "clear"
    ? "The yellow-green or yellow areas can contrast with darker surroundings without relying on metallic flash."
    : "The bright areas can contrast with darker surroundings at close range; their visible hue depends on the light reaching them.";
  if (pattern.id === "hard_red_craw") return "Red areas and black markings offer contrast at close range; red may appear darker as the water filters the light.";
  if (pattern.opacity === "sparse_fiber") return clarity === "clear"
    ? "Gaps between the fibers soften the outline; clear water allows the finer dressing to remain visible."
    : "The fiber dressing offers a soft outline at close range; reduced clarity obscures its finer detail.";
  if (/brown|olive|green pumpkin/i.test(primary)) return clarity === "clear"
    ? "Brown or olive tones offer a subdued presentation; clear water allows their outline and small details to remain visible."
    : "Brown or olive tones provide a subdued presentation at close range; reduced clarity hides smaller details.";
  // A neutral fallback must not invent earth tones, opacity, fluorescence or flash.
  return "The pattern can contrast with a different-colored background at close range; visibility depends on the light and background.";
}
