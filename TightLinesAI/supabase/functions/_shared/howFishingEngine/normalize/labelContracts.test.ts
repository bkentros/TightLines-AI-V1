import { assert, assertEquals } from "jsr:@std/assert";
import type { EngineContext } from "../contracts/context.ts";
import {
  LIGHT_LABELS,
  isLightLabel,
  normalizeLight,
  type LightLabel,
} from "./normalizeLight.ts";

const CLOUD_INPUTS = [
  -1,
  0,
  10,
  25,
  26,
  50,
  69,
  70,
  85,
  86,
  100,
] as const;

const CONTEXTS: EngineContext[] = ["freshwater_lake_pond", "coastal"];

Deno.test(
  "normalizeLight emits only labels declared in LIGHT_LABELS, and every LIGHT_LABELS entry is reachable",
  () => {
    const seen = new Set<LightLabel>();

    for (const cloudPct of CLOUD_INPUTS) {
      for (const context of CONTEXTS) {
        for (const opts of [
          undefined,
          { temperatureBandLabel: "cool" as const },
          { temperatureBandLabel: "very_cold" as const },
        ]) {
          const result = normalizeLight(cloudPct, context, opts);
          if (result !== null) {
            assert(
              isLightLabel(result.label),
              `unexpected label ${JSON.stringify(result.label)} for cloudPct=${cloudPct} context=${context}`,
            );
            seen.add(result.label);
          }
        }
      }
    }

    // Explicit reachability anchors (deterministic; not random).
    assertEquals(normalizeLight(5, "coastal")!.label, "glare");
    seen.add("glare");
    assertEquals(
      normalizeLight(5, "freshwater_lake_pond", { temperatureBandLabel: "cool" })!.label,
      "bright",
    );
    seen.add("bright");
    assertEquals(normalizeLight(40, "freshwater_lake_pond")!.label, "mixed");
    seen.add("mixed");
    assertEquals(normalizeLight(75, "freshwater_lake_pond")!.label, "low_light");
    seen.add("low_light");
    assertEquals(normalizeLight(95, "freshwater_lake_pond")!.label, "heavy_overcast");
    seen.add("heavy_overcast");

    for (const label of LIGHT_LABELS) {
      assert(seen.has(label), `LIGHT_LABELS entry never emitted: ${label}`);
    }
  },
);
