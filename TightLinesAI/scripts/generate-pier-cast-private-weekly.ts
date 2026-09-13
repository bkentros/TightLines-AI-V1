import {
  evaluatePierCastSeasonalOpportunity,
  getPierCastPrivateSeasonalCurve,
  getPierCastPrivateSpeciesIds,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_PRIVATE_ROSTER_VERSION,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";
const rows = [
  "cityId,speciesId,week,midpointDate,seasonalRating,curveId,rosterVersion,publicEnabled",
];
for (const city of PIER_CAST_CITY_PROFILES) {
  for (const speciesId of getPierCastPrivateSpeciesIds(city.cityId)) {
    for (let w = 0; w < 52; w++) {
      const date = new Date(Date.UTC(2025, 0, 4 + w * 7)).toISOString().slice(
        0,
        10,
      );
      const curve = getPierCastPrivateSeasonalCurve(city.cityId, speciesId)!;
      const value = evaluatePierCastSeasonalOpportunity({
        curve,
        localDate: date,
        ratingEnabled: true,
        mode: "review",
      });
      if (value.rating === null) {
        throw Error("Missing private annual baseline");
      }
      rows.push(
        [
          city.cityId,
          speciesId,
          w + 1,
          date,
          value.rating.toFixed(6),
          curve.curveId,
          PIER_CAST_PRIVATE_ROSTER_VERSION,
          false,
        ].join(","),
      );
    }
  }
}
const target = "docs/PierCast_Private_Lineup_Weekly_Ratings.csv",
  text = rows.join("\n") + "\n";
if (Deno.args.includes("--check")) {
  if (await Deno.readTextFile(target) !== text) {
    throw Error("Regenerate private weekly ratings");
  }
} else await Deno.writeTextFile(target, text);
console.log(
  `Verified ${
    rows.length - 1
  } weekly private seasonal samples; not temperature-adjusted forecasts.`,
);
