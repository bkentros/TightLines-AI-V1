import { assert } from "jsr:@std/assert";
import { LURE_FAMILIES } from "../config/lureFamilies.ts";
import { FLY_FAMILIES } from "../config/flyFamilies.ts";

const BANNED = [
  "craft fur streamer",
  "lead head jig",
  "medium diver",
  "dahlberg diver",
  "merkin",
  "crazy charlie",
];

function normalize(value: string): string {
  return value.toLowerCase();
}

Deno.test("family examples avoid banned obscure and generic names", () => {
  for (const family of [...Object.values(LURE_FAMILIES), ...Object.values(FLY_FAMILIES)]) {
    for (const example of family.examples) {
      const normalized = normalize(example);
      assert(!BANNED.includes(normalized), `${family.display_name} includes banned example "${example}"`);
      assert(!normalized.includes("style bait"), `${family.display_name} includes generic style-bait example "${example}"`);
      assert(!normalized.includes(" pattern"), `${family.display_name} includes generic pattern example "${example}"`);
    }
  }
});
