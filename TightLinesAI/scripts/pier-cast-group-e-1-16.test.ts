import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const review = readFileSync(new URL("../app/pier-cast-review.tsx", import.meta.url), "utf8");
const map = readFileSync(new URL("../app/pier-cast-map.tsx", import.meta.url), "utf8");

test("map-routed reports do not wait for leaderboard state", () => {
  const routeEffect = review.slice(
    review.indexOf("if (!routeCityId || !catalog || !selectedSpeciesId)"),
    review.indexOf("useFocusEffect(", review.indexOf("if (!routeCityId || !catalog || !selectedSpeciesId)")),
  );
  assert.ok(routeEffect.length > 0);
  assert.doesNotMatch(routeEffect, /!leaderboard/);
  assert.match(routeEffect, /openCity\(routeCityId\)/);
  assert.match(review, /\) : catalog \? \(/);
  assert.match(review, /selectedCity \? \(/);
  assert.doesNotMatch(review, /\) : catalog && leaderboard \? \(/);
  assert.match(review, /if \(routeCityId && !silent\) setLoading\(false\)/);
});

test("first visit never fans out across all species leaderboards", () => {
  const start = review.indexOf("const load = useCallback");
  const load = review.slice(start, review.indexOf("useEffect(() =>", start));
  assert.match(load, /pickFallbackStandingsSpecies\(nextLeaderboard\.targetSpecies\)/);
  assert.doesNotMatch(load, /Promise\.allSettled/);
  assert.doesNotMatch(load, /candidates\.map/);
});

test("map access begins during initial render and is consumed by the effect", () => {
  assert.match(map, /\(\) => requestPierCastMapPass\(visitId\.current\)/);
  assert.match(map, /const pending = !renew && !initialAccessConsumed\.current/);
});
