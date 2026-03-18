import type { EngineContext, VariableState } from "../contracts/mod.ts";

export function normalizeLight(
  cloudPct: number | null | undefined,
  context: EngineContext
): VariableState | null {
  if (cloudPct == null || Number.isNaN(cloudPct)) return null;
  const c = Math.max(0, Math.min(100, cloudPct));
  let label: "bright" | "mixed" | "low_light";
  if (c <= 25) label = "bright";
  else if (c <= 69) label = "mixed";
  else label = "low_light";

  let score: -2 | -1 | 0 | 1 | 2;
  if (context === "coastal") {
    if (label === "bright") score = 0;
    else if (label === "mixed") score = 0;
    else score = 1;
  } else {
    if (label === "bright") score = -1;
    else if (label === "mixed") score = 0;
    else score = 1;
  }
  return { label, score, detail: `${Math.round(c)}% cloud` };
}
