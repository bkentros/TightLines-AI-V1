import type { DailyScenario } from "./buildDailyScenario.ts";

/**
 * Single daily tackle color guidance for the 2×2 recommender response.
 *
 * Natural / bright / dark are presentation families; this is derived from the
 * same `DailyScenario` fields the engine already uses (light_mode, water_clarity,
 * scenario_tags). Priority: low-light silhouette first, then murky/reaction, then
 * stained+sun, else natural — so chop/vibration tags do not override true low light.
 */
export type DailyColorPaletteTheme = "natural" | "bright" | "dark";

export function resolveColorPaletteTheme(
  scenario: DailyScenario,
): DailyColorPaletteTheme {
  const tags = new Set(scenario.scenario_tags);
  const { water_clarity: clarity, light_mode: light } = scenario;

  // Thin / flat light → silhouette palette first (wins over chop/vibration tags).
  if (light === "low_light") return "dark";
  if (tags.has("low_light_surface")) return "dark";

  // Murky water → high-contrast reaction palette
  if (clarity === "dirty") return "bright";

  // Runoff / mud / active fine-sediment water
  if (tags.has("dirty_vibration")) return "bright";

  // Stained + high sun or hard glare → punch-through colors
  if (clarity === "stained" && (light === "bright" || light === "glare")) {
    return "bright";
  }

  // Clear bright days, mixed light, unknown light, or cold finesse windows
  return "natural";
}
