import { getPierCastPrivateSpeciesIds, getPierCastPrivateAdmission, getPierCastPrivateTemperatureCurve, PIER_CAST_PRIVATE_ROSTER_VERSION } from "../config/privateCalibration.ts";
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import {
  applyPierCastDailyScoreSnapshot,
  archivePierCastDailyScoreSnapshot,
  buildPierCastDailyScoreSnapshot,
  buildPierCastReviewOutlook,
  PIER_CAST_ENGINE_VERSION,
  type PierCastArchiveClient,
  pierCastDailyScoreLakeDateForCycle,
  readPublishedPierCastDailyScoreSnapshot,
  withholdPierCastCurrentDayScores,
} from "../index.ts";
import { completeLmhofsBatch } from "./fixtures/lmhofs.ts";

function dailySnapshot() {
  return buildPierCastDailyScoreSnapshot({
    batch: completeLmhofsBatch(),
    lakeDate: "2026-09-10",
    generatedAt: "2026-09-10T00:36:00.000Z",
    engineVersion: PIER_CAST_ENGINE_VERSION,
  });
}

Deno.test("daily score snapshots use a full Lake Michigan day and publish at Central midnight", () => {
  const snapshot = dailySnapshot();

  assertEquals(snapshot.status, "locked_daily_snapshot");
  assertEquals(snapshot.lakeDate, "2026-09-10");
  assertEquals(snapshot.scoreTimezone, "America/Chicago");
  assertEquals(snapshot.publishAt, "2026-09-10T05:00:00.000Z");
  assertEquals(snapshot.cities.length, 5);
  for (const city of snapshot.cities) {
    assertEquals(city.date.localDate, "2026-09-10");
    assertEquals(city.date.scope, "full_day");
    assertEquals(city.date.headline.overall.status, "available");
    assertEquals(city.date.species.map(s=>s.speciesId), getPierCastPrivateSpeciesIds(city.cityId));
  }
});

Deno.test("locked scores merge into today's live report without freezing environmental data", () => {
  const snapshot = dailySnapshot();
  const live = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T12:15:00.000Z",
  });
  const before = live.cities[0]!.dates[0]!;
  const locked =
    snapshot.cities.find((city) => city.cityId === live.cities[0]!.cityId)!
      .date;
  const merged = applyPierCastDailyScoreSnapshot(live, snapshot);
  const after = merged.cities[0]!.dates[0]!;

  assertEquals(merged.dailyScoreSnapshot, snapshot);
  assertEquals(after.scope, "remaining_day");
  assertEquals(after.requestedInterval, before.requestedInterval);
  assertEquals(after.waterTemperature, before.waterTemperature);
  assertEquals(after.headline, locked.headline);
  assertEquals(after.species, locked.species);
  assertNotEquals(after.requestedInterval, locked.requestedInterval);
});

Deno.test("daily score lake dates use an evening cycle to precompute the upcoming Central day", () => {
  assertEquals(
    pierCastDailyScoreLakeDateForCycle("2026-09-10T18:00:00.000Z"),
    "2026-09-11",
  );
  assertEquals(
    pierCastDailyScoreLakeDateForCycle("2026-09-11T00:00:00.000Z"),
    "2026-09-11",
  );
  assertEquals(
    pierCastDailyScoreLakeDateForCycle("2026-09-11T06:00:00.000Z"),
    "2026-09-11",
  );
  assertEquals(
    pierCastDailyScoreLakeDateForCycle("2026-09-11T18:00:00.000Z"),
    "2026-09-12",
  );
});

Deno.test("the Central daily lock remains stable during the Eastern midnight seam", () => {
  const snapshot = dailySnapshot();
  const live = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-11T04:30:00.000Z",
  });
  const merged = applyPierCastDailyScoreSnapshot(live, snapshot);
  const michigan = merged.cities.find((city) =>
    city.cityId === "grand_haven_mi"
  )!;
  const wisconsin = merged.cities.find((city) =>
    city.cityId === "sheboygan_wi"
  )!;

  assertEquals(michigan.dates[0]!.localDate, "2026-09-11");
  assertEquals(wisconsin.dates[0]!.localDate, "2026-09-10");
  assertEquals(
    michigan.dates[0]!.headline,
    snapshot.cities.find((city) => city.cityId === "grand_haven_mi")!.date
      .headline,
  );
  assertEquals(
    wisconsin.dates[0]!.headline,
    snapshot.cities.find((city) => city.cityId === "sheboygan_wi")!.date
      .headline,
  );
});

Deno.test("missing daily snapshots withhold today's scores without withholding live conditions", () => {
  const live = buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T12:15:00.000Z",
  });
  const withheld = withholdPierCastCurrentDayScores(live);

  for (const city of withheld.cities) {
    assertEquals(city.dates[0]!.headline.overall.status, "unavailable");
    assertEquals(
      city.dates[0]!.waterTemperature,
      live.cities.find((candidate) => candidate.cityId === city.cityId)!
        .dates[0]!.waterTemperature,
    );
    assertEquals(
      city.dates[0]!.species.every((species) =>
        species.biological.status === "unavailable"
      ),
      true,
    );
    assertEquals(city.dates[1]!.headline.overall.status, "available");
  }
});

Deno.test("daily score snapshot archive is immutable and published reads are validated", async () => {
  const snapshot = dailySnapshot();
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  const database: PierCastArchiveClient = {
    rpc: (name, args) => {
      calls.push({ name, args });
      if (name === "commit_pier_cast_daily_score_snapshot") {
        return Promise.resolve({
          data: {
            status: "already_committed",
            lakeDate: snapshot.lakeDate,
            setAt: snapshot.setAt,
            publishAt: "2026-09-10T05:00:00+00:00",
            cityCount: 5,
          },
          error: null,
        });
      }
      return Promise.resolve({ data: snapshot, error: null });
    },
  };

  const committed = await archivePierCastDailyScoreSnapshot({
    database,
    snapshot,
  });
  assertEquals(committed.status, "already_committed");
  const published = await readPublishedPierCastDailyScoreSnapshot(
    database,
    new Date("2026-09-10T12:00:00.000Z"),
  );
  assertEquals(published, snapshot);
  assertEquals(calls.map((call) => call.name), [
    "commit_pier_cast_daily_score_snapshot",
    "read_published_pier_cast_daily_score_snapshot",
  ]);
});

Deno.test("daily score snapshot migration keeps the ledger private and immutable", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260911021500_create_pier_cast_daily_score_snapshots.sql",
      import.meta.url,
    ),
  );
  assertEquals(sql.includes("lake_date date primary key"), true);
  assertEquals(sql.includes("on conflict (lake_date) do nothing"), true);
  assertEquals(sql.includes("enable row level security"), true);
  assertEquals(
    sql.includes("revoke all on table public.pier_cast_daily_score_snapshots"),
    true,
  );
  assertEquals(
    sql.includes("read_published_pier_cast_daily_score_snapshot"),
    true,
  );
});
