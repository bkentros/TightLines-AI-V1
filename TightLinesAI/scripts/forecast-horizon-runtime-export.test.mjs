import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../lib/forecastScores.ts", import.meta.url),
  "utf8",
);

test("forecast slot builder is exported from its defining module", () => {
  assert.match(
    source,
    /import\s*\{[\s\S]*?buildFutureForecastSlots[\s\S]*?\}\s*from\s*[\r\n\s]*["']\.\.\/supabase\/functions\/_shared\/forecastHorizon["']/,
  );
  assert.match(source, /export\s*\{\s*buildFutureForecastSlots\s*\}/);
  assert.doesNotMatch(
    source,
    /export\s*\{[\s\S]*?buildFutureForecastSlots[\s\S]*?\}\s*from\s*["']\.\/forecastSnapshot["']/,
  );
});
