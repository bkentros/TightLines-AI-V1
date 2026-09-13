import { assert, assertEquals } from "jsr:@std/assert";
import { getPierCastPrivateAdmission } from "../config/privateCalibration.ts";
Deno.test("all 45 reconciled decisions use recurring covered-pier catches and agree with runtime", async () => {
  const path = new URL(
    "../../../../../docs/PierCast_Phase2_Onboarding_Decisions.json",
    import.meta.url,
  );
  const data = JSON.parse(await Deno.readTextFile(path));
  assertEquals(data.rows.length, 45);
  assertEquals(
    new Set(
      data.rows.map((r: { cityId: string; speciesId: string }) =>
        `${r.cityId}/${r.speciesId}`
      ),
    ).size,
    45,
  );
  for (const row of data.rows) {
    assertEquals(
      row.reconciliationStandard,
      "recurring_covered_pier_catches_v1",
    );
    assertEquals(
      !!getPierCastPrivateAdmission(row.cityId, row.speciesId),
      row.decision === "admit_private_provisional",
    );
    assert(
      !row.publicEnabled && row.rationale.length > 50 &&
        row.evidenceIds.length > 0,
    );
  }
  const added = getPierCastPrivateAdmission("manistee_mi", "smallmouth_bass")!;
  assert((added.evidenceIds as readonly string[]).includes("R_MAN_SMALL_NORTH2024"));
  assertEquals(added.structureId, "manistee_north_pier");
  assert(!getPierCastPrivateAdmission("manistee_mi", "largemouth_bass"));
});
Deno.test("reconciliation snapshots retain verified hashes and failed retrievals", async () => {
  const root = new URL("../../../../../", import.meta.url);
  const ledger = JSON.parse(
    await Deno.readTextFile(
      new URL(
        "docs/onboarding/piercast/remaining-species/reconciliation-retrieval-ledger.json",
        root,
      ),
    ),
  );
  for (const row of ledger) {
    if (row.status !== 200) {
      assert(row.error && !row.sha256);
      continue;
    }
    const bytes = await Deno.readFile(new URL(row.path, root));
    const hash = Array.from(
      new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    ).map((x) => x.toString(16).padStart(2, "0")).join("");
    assertEquals(hash, row.sha256);
    assertEquals(bytes.length, row.bytes);
  }
  assertEquals(
    ledger.find((r: { evidenceId: string }) => r.evidenceId === "R_AFS2023")
      .status,
    "unavailable",
  );
});
