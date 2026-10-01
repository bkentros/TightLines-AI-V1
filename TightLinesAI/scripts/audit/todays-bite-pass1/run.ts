/** Immutable baseline capture and replay. No provider calls or production writes.
 * Capture before edits: deno run --no-lock --allow-read --allow-write scripts/audit/todays-bite-pass1/run.ts capture
 * Compare after edits: same command with compare. Baseline will never be overwritten.
 */
import { boundaryFixtures, fixtures } from "./fixtures.ts";
import { materializeForecastEnvForDate } from "../../../lib/forecastSnapshot.ts";
const here = new URL("../../../supabase/functions/_shared/", import.meta.url);
const arg = Deno.args.find((x) => x.startsWith("--engine-root="))?.split(
  "=",
)[1];
const root = arg ? new URL(`file://${arg.replace(/\/$/, "")}/`) : here;
const { runHowFishingReport, runHowFishingScoreOnly } = await import(
  new URL("howFishingEngine/runHowFishingReport.ts", root).href
);
const { analyzeSharedConditions } = await import(
  new URL("howFishingEngine/analyzeSharedConditions.ts", root).href
);
const { resolveRegionForCoordinates } = await import(
  new URL("howFishingEngine/context/resolveRegion.ts", root).href
);
const { runDailyPicksSurface } = await import(
  new URL("recommenderEngine/dailyPicks/runDailyPicksSurface.ts", root).href
);
const { resolveDailyPicksSeasonalRow } = await import(
  new URL("recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts", root)
    .href
);
const { buildSharedEngineRequestFromEnvData } = await import(
  new URL("howFishingEngine/request/buildFromEnvData.ts", root).href
);
const boundaries = Deno.args.includes("--boundaries");
const prefix = boundaries ? "boundaries-" : "";
const dir = Deno.args.find((x) => x.startsWith("--output-dir="))?.slice(
  "--output-dir=".length,
) ?? "docs/audits/todays-bite-pass1";
await Deno.mkdir(dir, { recursive: true });
const mode = Deno.args[0];
if (!["capture", "compare"].includes(mode)) {
  throw Error("Specify capture or compare");
}
const path = `${dir}/${prefix}${
  mode === "capture" ? "baseline" : "candidate"
}.jsonl.gz`;
const file = await Deno.open(path, {
  write: true,
  create: mode !== "capture",
  createNew: mode === "capture",
  truncate: mode !== "capture",
});
const zip = new CompressionStream("gzip");
const pump = zip.readable.pipeTo(file.writable);
const writer = zip.writable.getWriter();
const encoder = new TextEncoder();
let count = 0, picks = 0, missing = 0;
for (const f of boundaries ? boundaryFixtures() : fixtures()) {
  let req = structuredClone(f.request);
  if ("raw" in f) {
    req = buildSharedEngineRequestFromEnvData(
      req.latitude,
      req.longitude,
      req.local_date,
      req.local_timezone,
      req.context,
      materializeForecastEnvForDate(f.raw, req.local_date, {
        allowMeasuredWaterTemp: f.offset === 0,
      }),
      f.offset,
      { useCalendarDayProfileForToday: true },
    );
  }
  if ("city" in f && f.city) {
    const loc = resolveRegionForCoordinates(req.latitude, req.longitude);
    req.region_key = loc.region_key;
    req.state_code = loc.state_code;
  }
  const report = runHowFishingReport(req);
  const analysis = analyzeSharedConditions(req);
  if (report.score !== runHowFishingScoreOnly(req)) {
    throw Error(`Score/report mismatch ${f.id}`);
  }
  const recommendations = [];
  if (f.offset === 0 && !req.context.startsWith("coastal")) {
    for (
      const species of [
        "largemouth_bass",
        "smallmouth_bass",
        "pike_musky",
        "river_trout",
      ]
    ) {
      if (
        species === "river_trout" && req.context !== "freshwater_river"
      ) continue;
      try {
        resolveDailyPicksSeasonalRow({
          species,
          region_key: req.region_key,
          month: Number(req.local_date.slice(5, 7)),
          water_type: req.context,
        });
      } catch (e) {
        if (
          e instanceof Error && e.name === "DailyPicksSeasonalRowMissingError"
        ) {
          missing++;
          continue;
        }
        throw e;
      }
      for (const goal of ["all_purpose", "big_fish"]) {
        const recReq = {
          location: {
            latitude: req.latitude,
            longitude: req.longitude,
            state_code: req.state_code ?? "TN",
            region_key: req.region_key,
            local_date: req.local_date,
            local_timezone: req.local_timezone,
            month: Number(req.local_date.slice(5, 7)),
          },
          species,
          context: req.context,
          water_clarity: goal === "all_purpose" ? "clear" : "stained",
          recommendation_goal: goal,
          env_data: req.environment,
        };
        const rec = runDailyPicksSurface(recReq, {
          seed: `pass1|${f.id}|${species}|${goal}`,
          variant: "A",
          analysis,
        });
        recommendations.push({ species, goal, response: rec });
        picks++;
      }
    }
  }
  await writer.write(
    encoder.encode(
      JSON.stringify({
        id: f.id,
        offset: f.offset,
        input: req,
        normalized: analysis.norm,
        report,
        recommendations,
      }) + "\n",
    ),
  );
  count++;
  if (count % 4000 === 0) {
    console.log(`${mode}: ${count} fixtures, ${picks} recommendation sets`);
  }
}
await writer.close();
await pump;
const bytes = await Deno.readFile(path);
const hash = Array.from(
  new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
).map((x) => x.toString(16).padStart(2, "0")).join("");
await Deno.writeTextFile(
  `${dir}/${prefix}${
    mode === "capture" ? "baseline" : "candidate"
  }.manifest.json`,
  JSON.stringify(
    {
      schema: 1,
      baseline_commit: "7c245d2ca84f6c4c9d73bd87d45695656ab6ef1e",
      fixtures: count,
      recommendation_sets: picks,
      missing_seasonal_rows: missing,
      sha256: hash,
      bytes: bytes.length,
      scope: boundaries
        ? "Raw adapter + forecast materialization; four southern cities, seven month/year boundaries, four contexts, offsets 0..6, cooling/warming/missing-data profiles."
        : "Synthetic direct-engine fixtures; all 18 regions, 12 months, 4 contexts, offsets 0..6, southern Sep-Mar sequences and city routing. Raw request-builder forecast coverage is tested separately.",
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    mode,
    count,
    picks,
    missing,
    bytes: bytes.length,
    sha256: hash,
  }),
);
