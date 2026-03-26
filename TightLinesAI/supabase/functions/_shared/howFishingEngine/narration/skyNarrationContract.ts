import type { EngineContext, LlmSkyNarrationContract } from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";

export function buildSkyNarrationContract(
  cloudPct: number | null | undefined,
  context: EngineContext,
): LlmSkyNarrationContract | null {
  if (cloudPct == null || Number.isNaN(cloudPct)) return null;
  const c = Math.max(0, Math.min(100, cloudPct));
  const cloud_cover_pct_rounded = Math.round(c);
  const coastal = isCoastalFamilyContext(context);

  if (c >= 85) {
    return {
      sky_character: "heavy_overcast",
      cloud_cover_pct_rounded,
      allowed_sky_descriptors: [
        "heavy cloud deck",
        "solid overcast",
        "low gray light",
      ],
      forbidden_sky_terms: [
        "bluebird",
        "clear sky",
        "full sun",
        "mostly sunny",
        "hardly any clouds",
      ],
    };
  }

  if (c >= 60) {
    return {
      sky_character: "cloud_dominant",
      cloud_cover_pct_rounded,
      allowed_sky_descriptors: [
        "cloud-dominant sky",
        "mostly cloudy",
        "limited direct sun",
      ],
      forbidden_sky_terms: [
        "bluebird",
        "crystal clear",
        "no clouds",
        "full blazing sun",
      ],
    };
  }

  if (c >= 30) {
    return {
      sky_character: "mixed_sky",
      cloud_cover_pct_rounded,
      allowed_sky_descriptors: [
        "mixed clouds and sun",
        "broken sky",
        "partly cloudy",
      ],
      forbidden_sky_terms: coastal
        ? ["bluebird", "completely clear", "zero cloud cover"]
        : [
          "bluebird",
          "completely clear",
          "no cloud cover",
          "cloudless",
        ],
    };
  }

  return {
    sky_character: "mostly_clear",
    cloud_cover_pct_rounded,
    allowed_sky_descriptors: coastal
      ? ["bright conditions", "plenty of sun", "clear to mostly clear"]
      : ["bright sun", "clear sky", "high sun / glare potential"],
    forbidden_sky_terms: [
      "heavy overcast",
      "solid gray sky",
      "no sun at all",
      "completely socked in",
    ],
  };
}
