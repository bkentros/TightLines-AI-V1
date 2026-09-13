/** Deterministic annual configuration audit. Scenario scores are not forecasts. */
import { assert, assertEquals } from "jsr:@std/assert";
import {
  buildPierCastDailyScoreSnapshot,
  buildPierCastReviewOutlook,
  calculatePierCastInstantOpportunity,
  evaluatePierCastSeasonalOpportunity,
  evaluateTemperatureSuitability,
  getPierCastPrivateSeasonalCurve,
  getPierCastPrivateSpeciesIds,
  getPierCastPrivateTemperatureCurve,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_ENGINE_VERSION,
  PIER_CAST_PRIVATE_ADMISSIONS,
  toFinFindrOpportunityRating,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";
import { completeLmhofsBatch } from "../supabase/functions/_shared/pierCastEngine/tests/fixtures/lmhofs.ts";
const decisions = JSON.parse(
  await Deno.readTextFile("docs/PierCast_Phase2_Onboarding_Decisions.json"),
);
assertEquals(decisions.rows.length, 45);
assertEquals(
  new Set(
    decisions.rows.map((r: { cityId: string; speciesId: string }) =>
      `${r.cityId}/${r.speciesId}`
    ),
  ).size,
  45,
);
const seasonal = (
  cityId: typeof PIER_CAST_CITY_PROFILES[number]["cityId"],
  speciesId: ReturnType<typeof getPierCastPrivateSpeciesIds>[number],
  date: string,
) => {
  const value = evaluatePierCastSeasonalOpportunity({
    curve: getPierCastPrivateSeasonalCurve(cityId, speciesId),
    localDate: date,
    ratingEnabled: true,
    mode: "review",
  });
  assert(
    value.status === "available" && value.rating >= 1 && value.rating <= 10,
  );
  return value.rating;
};
const pairSummaries = [],
  weeklyRows = ["cityId,week,date,speciesId,seasonalRating,label"],
  citySummaries = [];
let dailyChecks = 0, temperatureScenarios = 0;
for (const city of PIER_CAST_CITY_PROFILES) {
  assert(!city.publicEnabled);
  const ids = getPierCastPrivateSpeciesIds(city.cityId);
  for (
    const row of decisions.rows.filter((r: { cityId: string }) =>
      r.cityId === city.cityId
    )
  ) {
    assertEquals(
      getPierCastPrivateSeasonalCurve(city.cityId, row.speciesId) !== null,
      row.decision === "admit_private_provisional",
    );
  }
  for (
    const admission of PIER_CAST_PRIVATE_ADMISSIONS.filter((r) =>
      r.cityId === city.cityId
    )
  ) {
    assert(
      city.structures.some((s) =>
        s.structureId === admission.structureId && s.disposition === "candidate"
      ),
    );
    assert(
      admission.methodConstraint && admission.evidenceIds.length &&
        !admission.publicEnabled,
    );
  }
  for (const speciesId of ids) {
    let min = 10, max = 1, maxDailyChange = 0, previous: number | undefined;
    const peakDates: string[] = [];
    for (
      let t = Date.UTC(2024, 0, 1);
      t < Date.UTC(2028, 0, 1);
      t += 86400000
    ) {
      const date = new Date(t).toISOString().slice(0, 10),
        v = seasonal(city.cityId, speciesId, date);
      dailyChecks++;
      if (previous !== undefined) {
        maxDailyChange = Math.max(maxDailyChange, Math.abs(v - previous));
      }
      previous = v;
      if (date.startsWith("2025")) {
        min = Math.min(min, v);
        if (v > max) {
          max = v;
          peakDates.length = 0;
        }
        if (v === max) {
          peakDates.push(date.slice(5));
        }
      }
    }
    const curve = getPierCastPrivateTemperatureCurve(speciesId)!;
    assert(curve);
    for (let w = 0; w < 52; w++) {
      const date = new Date(Date.UTC(2025, 0, 4 + w * 7)).toISOString().slice(
          0,
          10,
        ),
        v = seasonal(city.cityId, speciesId, date);
      const rating = toFinFindrOpportunityRating(v);
      assert(rating.status === "available");
      weeklyRows.push(
        [city.cityId, w + 1, date, speciesId, v.toFixed(6), rating.label].join(
          ",",
        ),
      );
      for (const temperature of [2, 6, 10, 14, 18, 22, 26, 30]) {
        const thermal = evaluateTemperatureSuitability({
          curve,
          waterTemperatureC: temperature,
          ratingEnabled: true,
          mode: "review",
          inputStatus: "valid",
          monthEvidenceState: "proposed_regional_transfer",
        });
        temperatureScenarios++;
        if (temperature > curve.acceptedDomainC[1]) {
          assertEquals(thermal.status, "unavailable");
          continue;
        }
        assert(thermal.status === "available");
        const score = calculatePierCastInstantOpportunity({
          seasonalRating: v,
          temperatureSuitability: thermal.suitability,
        });
        assert(
          score.status === "available" && score.rating.status === "available",
        );
        assert(score.rating.score >= 1 && score.rating.score <= 10);
        assert(
          score.rating.score >= 1 + (v - 1) * 0.3 - 1e-10 &&
            score.rating.score <= Math.min(10, 1 + (v - 1) * 1.05) + 1e-10,
        );
      }
    }
    assert(Number.isFinite(maxDailyChange));
    pairSummaries.push({
      cityId: city.cityId,
      speciesId,
      min,
      max,
      peakDates,
      maxDailyChange,
    });
  }
  let goodWeeks = 0, overlapWeeks = 0;
  const weakWeeks: number[] = [];
  for (let w = 0; w < 52; w++) {
    const date = new Date(Date.UTC(2025, 0, 4 + w * 7)).toISOString().slice(
      0,
      10,
    );
    const scores = ids.map((id) => seasonal(city.cityId, id, date));
    const good = scores.filter((v) => {
      const r = toFinFindrOpportunityRating(v);
      return r.status === "available" &&
        ["Good", "Excellent"].includes(r.label);
    }).length;
    if (good) goodWeeks++;
    if (good >= 2) overlapWeeks++;
    if (Math.max(...scores) < 4.05) weakWeeks.push(w + 1);
  }
  citySummaries.push({
    cityId: city.cityId,
    speciesCount: ids.length,
    goodWeeks,
    overlapWeeks,
    allLimitedOrPoorWeeks: weakWeeks,
  });
}
// Full runtime path, not just the seasonal evaluator: monthly, leap-day, DST and year wrap.
const dates = [
  ...Array.from(
    { length: 12 },
    (_, i) => `2026-${String(i + 1).padStart(2, "0")}-15`,
  ),
  "2024-02-29",
  "2026-03-08",
  "2026-11-01",
  "2026-12-31",
  "2027-01-01",
  "2027-04-01",
];
let pipelineSpeciesDays = 0;
for (const date of dates) {
  const batch = completeLmhofsBatch(),
    issued = new Date(Date.parse(date + "T00:00:00Z") - 6 * 3600000)
      .toISOString();
  batch.issuedAt = issued;
  batch.fetchedAt = date + "T00:00:00.000Z";
  for (const city of batch.cities) {
    assert(city.status === "available");
    city.issuedAt = issued;
    for (const s of city.samples) {
      s.issuedAt = issued;
      s.validAt = new Date(Date.parse(issued) + s.forecastHour * 3600000)
        .toISOString();
      s.temperatureC = 2;
    }
    city.coverageStart = city.samples[0].validAt;
    city.coverageEnd = city.samples[120].validAt;
  }
  const outlook = buildPierCastReviewOutlook({
    batch,
    evaluationTime: batch.fetchedAt,
  });
  for (const city of outlook.cities) {
    for (const day of city.dates) {
      for (const fish of day.species) {
        assert(
          fish.biological.status === "available",
          `${date}: ${city.cityId}/${fish.speciesId}: ${fish.reasonCodes}`,
        );
        assertEquals(fish.promotion.status, "blocked");
        pipelineSpeciesDays++;
      }
    }
  }
  const snapshot = buildPierCastDailyScoreSnapshot({
    batch,
    lakeDate: date,
    generatedAt: batch.fetchedAt,
    engineVersion: PIER_CAST_ENGINE_VERSION,
  });
  assertEquals(
    snapshot.cities.reduce((n, c) => n + c.date.species.length, 0),
    28,
  );
}
let thermalGridChecks = 0, thermalGateChecks = 0;
const thermalSpecies = [...new Set(pairSummaries.map((p) => p.speciesId))];
for (const speciesId of thermalSpecies) {
  const curve = getPierCastPrivateTemperatureCurve(speciesId)!;
  const base = {
    curve,
    ratingEnabled: true,
    mode: "review" as const,
    inputStatus: "valid" as const,
    monthEvidenceState: "proposed_regional_transfer" as const,
    waterTemperatureC: 10,
  };
  for (let i = 0; i <= 320; i++) {
    const c = i / 10,
      result = evaluateTemperatureSuitability({
        ...base,
        waterTemperatureC: c,
      });
    thermalGridChecks++;
    if (c < curve.acceptedDomainC[0] || c > curve.acceptedDomainC[1]) {
      assertEquals(result.status, "unavailable");
    } else {assert(
        result.status === "available" && result.suitability >= 0 &&
          result.suitability <= 1,
      );}
  }
  for (
    const overrides of [
      { mode: "public" as const },
      { ratingEnabled: false },
      { inputStatus: "missing" as const },
      { inputStatus: "stale" as const },
      { inputStatus: "unreviewed_representation" as const },
      { monthEvidenceState: "absent_biology_evidence" as const },
      { waterTemperatureC: NaN },
    ]
  ) {
    assertEquals(
      evaluateTemperatureSuitability({ ...base, ...overrides }).status,
      "unavailable",
    );
    thermalGateChecks++;
  }
}
const report = {
  auditDate: "2026-09-13",
  engineVersion: PIER_CAST_ENGINE_VERSION,
  publicEnabled: false,
  dailyChecks,
  temperatureScenarios,
  thermalGridChecks,
  thermalGateChecks,
  pipelineSpeciesDays,
  pipelineDates: dates,
  pairSummaries,
  citySummaries,
};
const heatmapRows = pairSummaries.map((p) => {
  const cells = weeklyRows.slice(1).map((r) => r.split(",")).filter((r) =>
    r[0] === p.cityId && r[3] === p.speciesId
  ).map((r) => {
    const value = Number(r[4]), lightness = 96 - (value - 1) * 5;
    return `<td style="background:hsl(205 65% ${lightness}%)" title="${r[2]}: ${
      value.toFixed(2)
    } (${r[5]})">${value.toFixed(1)}</td>`;
  }).join("");
  return `<tr data-city="${p.cityId}"><th>${p.cityId.replaceAll("_", " ")} · ${
    p.speciesId.replaceAll("_", " ")
  }</th>${cells}</tr>`;
}).join("\n");
const html =
  `<!doctype html><html lang="en"><meta charset="utf-8"><title>PierCast annual audit</title>
<style>body{font:14px system-ui;margin:24px;color:#142c40}table{border-collapse:collapse;font-size:10px}th{text-align:left;white-space:nowrap;padding:6px}td{text-align:center;min-width:24px;padding:5px 2px;border:1px solid white}select{font:inherit;padding:6px}.scroll{overflow:auto}thead th{position:sticky;top:0;background:white}</style>
<h1>PierCast annual lineup — private provisional calibration</h1>
<p>Seasonal scores only. Hover a cell for its date and label. Darker blue means stronger configured opportunity. These are not temperature-adjusted forecasts, observed catch rates, or proof of safe access.</p>
<label>City <select id="city"><option value="">All cities</option>${
    citySummaries.map((c) =>
      `<option value="${c.cityId}">${c.cityId.replaceAll("_", " ")}</option>`
    ).join("")
  }</select></label>
<div class="scroll"><table><thead><tr><th>City / species</th>${
    Array.from({ length: 52 }, (_, i) => `<th>W${i + 1}</th>`).join("")
  }</tr></thead><tbody>${heatmapRows}</tbody></table></div>
<p>52 seven-day-spaced reference dates: January 4–December 27, 2025. Runtime interpolates actual calendar dates continuously, including leap years and December–January. Weak-season values are provisional judgments. Public ratings remain disabled.</p>
<script>document.getElementById('city').addEventListener('change',e=>{document.querySelectorAll('tbody tr').forEach(r=>r.hidden=!!e.target.value&&r.dataset.city!==e.target.value)});</script></html>\n`;
const outputs: Array<[string, string]> = [
  [
    "docs/PierCast_Phase3_Audit.json",
    JSON.stringify(report, null, 2) + "\n",
  ],
  ["docs/PierCast_Phase3_Annual_Lineup.csv", weeklyRows.join("\n") + "\n"],
  ["docs/PierCast_Phase3_Annual_Lineup.html", html],
];
for (const [file, text] of outputs) {
  if (Deno.args.includes("--check")) {
    assertEquals(await Deno.readTextFile(file), text);
  } else await Deno.writeTextFile(file, text);
}
console.log(
  JSON.stringify(
    { dailyChecks, temperatureScenarios, pipelineSpeciesDays, citySummaries },
    null,
    2,
  ),
);
