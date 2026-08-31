import { assertEquals } from "jsr:@std/assert";
import {
  COWLITZ_RIVER_PROFILE,
  readOrRefreshRiverRunFishCount,
} from "../index.ts";
import type {
  SupabaseLikeClient,
  SupabaseLikeQuery,
} from "../storage/types.ts";

class FishCountCacheQuery {
  private row: Record<string, unknown> | null = null;

  constructor(
    private readonly client: FishCountCacheClient,
    private readonly table: string,
  ) {}

  select(): FishCountCacheQuery {
    return this;
  }

  upsert(row: Record<string, unknown>): FishCountCacheQuery {
    this.row = row;
    if (this.table === "river_run_fish_count_source_cache") {
      this.client.cacheRow = row;
    } else if (this.table === "river_run_fish_count_reports") {
      this.client.archivedReports.push(row);
    }
    return this;
  }

  eq(): FishCountCacheQuery {
    return this;
  }

  gte(): FishCountCacheQuery {
    return this;
  }

  lte(): FishCountCacheQuery {
    return this;
  }

  order(): FishCountCacheQuery {
    return this;
  }

  limit(): FishCountCacheQuery {
    return this;
  }

  maybeSingle(): Promise<{
    data: Record<string, unknown> | null;
    error: null;
  }> {
    return Promise.resolve({
      data: this.row ??
        (this.table === "river_run_fish_count_source_cache"
          ? this.client.cacheRow
          : null),
      error: null,
    });
  }
}

class FishCountCacheClient implements SupabaseLikeClient {
  cacheRow: Record<string, unknown> | null = null;
  archivedReports: Record<string, unknown>[] = [];

  from(table: string): SupabaseLikeQuery {
    return new FishCountCacheQuery(this, table) as unknown as SupabaseLikeQuery;
  }
}

const REPORT_HTML =
  "<p><strong>Cowlitz Fish Report</strong></p><p>August 30, 2026</p>" +
  "<p>Last week, Tacoma Power employees recovered two Coho adults, " +
  "17 Fall Chinook adults and three Fall Chinook jacks over five days of " +
  "operations at the Cowlitz Salmon Hatchery separator.</p>";

Deno.test("fish-count source cache is reused across species and fails stale", async () => {
  const client = new FishCountCacheClient();
  let providerRequests = 0;
  const successFetch = async () => {
    providerRequests++;
    return {
      ok: true,
      json: async () => ({}),
      text: async () => REPORT_HTML,
    };
  };
  const chinook = await readOrRefreshRiverRunFishCount({
    client,
    river: COWLITZ_RIVER_PROFILE,
    species: "chinook_salmon",
    fetchFn: successFetch,
    now: new Date("2026-08-31T12:00:00Z"),
  });
  const coho = await readOrRefreshRiverRunFishCount({
    client,
    river: COWLITZ_RIVER_PROFILE,
    species: "coho_salmon",
    fetchFn: async () => {
      throw new Error("a current shared cache must not refetch");
    },
    now: new Date("2026-08-31T12:10:00Z"),
  });
  assertEquals(providerRequests, 1);
  assertEquals(chinook?.observedTotal, 20);
  assertEquals(coho?.observedTotal, 2);
  assertEquals(client.archivedReports.length, 1);

  const fallback = await readOrRefreshRiverRunFishCount({
    client,
    river: COWLITZ_RIVER_PROFILE,
    species: "chinook_salmon",
    fetchFn: async () => ({
      ok: false,
      json: async () => ({}),
      text: async () => "",
    }),
    now: new Date("2026-08-31T13:10:00Z"),
  });
  assertEquals(fallback?.observedTotal, 20);
  assertEquals(fallback?.status, "stale");
  assertEquals(client.archivedReports.length, 1);
});

Deno.test("fish-count cache storage failure cannot take down the report", async () => {
  const client = {
    from: () => {
      const query = {
        select: () => query,
        eq: () => query,
        maybeSingle: () =>
          Promise.resolve({
            data: null,
            error: { message: "cache temporarily unavailable" },
          }),
      };
      return query;
    },
  } as unknown as SupabaseLikeClient;
  let providerRequests = 0;
  const read = await readOrRefreshRiverRunFishCount({
    client,
    river: COWLITZ_RIVER_PROFILE,
    species: "chinook_salmon",
    fetchFn: async () => {
      providerRequests++;
      return {
        ok: true,
        json: async () => ({}),
        text: async () => REPORT_HTML,
      };
    },
    now: new Date("2026-08-31T12:00:00Z"),
  });
  assertEquals(providerRequests, 1);
  assertEquals(read?.observedTotal, 20);
});
