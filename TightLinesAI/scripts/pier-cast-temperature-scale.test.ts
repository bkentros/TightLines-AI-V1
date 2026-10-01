import assert from "node:assert/strict";
import test from "node:test";

import {
  formatPierCastWaterScaleEnd,
  pierCastWaterTemperatureColor,
  pierCastWaterTemperatureFraction,
  PIER_CAST_WATER_SCALE_STOPS,
} from "../lib/pierCastTemperatureScale";

test("PierCast water scale clamps at 32F and 78F", () => {
  assert.equal(pierCastWaterTemperatureFraction(31), 0);
  assert.equal(pierCastWaterTemperatureFraction(32), 0);
  assert.equal(pierCastWaterTemperatureFraction(78), 1);
  assert.equal(pierCastWaterTemperatureFraction(85), 1);
  assert.equal(
    pierCastWaterTemperatureColor(31),
    PIER_CAST_WATER_SCALE_STOPS[0].tone,
  );
  assert.equal(
    pierCastWaterTemperatureColor(85),
    PIER_CAST_WATER_SCALE_STOPS.at(-1)!.tone,
  );
});

test("PierCast water scale labels its warm edge as overflow", () => {
  assert.equal(formatPierCastWaterScaleEnd("minimum"), "32°");
  assert.equal(formatPierCastWaterScaleEnd("maximum"), "78°+");
});

test("PierCast water colors interpolate between fixed shared stops", () => {
  assert.equal(pierCastWaterTemperatureColor(44), "#0087E6");
  assert.equal(pierCastWaterTemperatureColor(51), "#73CE69");
  assert.notEqual(
    pierCastWaterTemperatureColor(55),
    pierCastWaterTemperatureColor(60),
  );
});
