import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const sourcePath = path.join(
  repoRoot,
  "docs/PierCast_Core_Species_Seasonal_Curves.json",
);

// This map is intentionally selective. It re-anchors evidence-supported peaks,
// shoulders, and genuinely negligible intervals; it is not an additive or
// multiplicative transform of the v0.3 ratings.
const revisions = {
  "ludington_mi|chinook_salmon": {
    "01-15": 1.0,
    "04-15": 1.3,
    "06-03": 5.0,
    "08-21": 7.1,
    "08-30": 8.3,
    "09-08": 8.0,
    "11-01": 1.2,
    "12-15": 1.0,
  },
  "ludington_mi|coho_salmon": {
    "01-15": 1.3,
    "09-26": 5.0,
    "10-20": 5.6,
    "11-08": 4.7,
    "12-05": 1.7,
  },
  "ludington_mi|steelhead": {
    "04-05": 6.0,
    "10-20": 8.1,
    "11-08": 7.2,
  },
  "ludington_mi|brown_trout": {
    "01-15": 4.0,
    "03-10": 5.6,
    "04-05": 7.6,
    "04-25": 7.2,
    "05-20": 5.6,
    "08-15": 1.2,
    "12-31": 4.0,
  },
  "grand_haven_mi|chinook_salmon": {
    "01-15": 1.0,
    "08-26": 6.8,
    "09-08": 7.8,
    "09-28": 5.5,
    "12-15": 1.0,
  },
  "grand_haven_mi|coho_salmon": {
    "03-15": 5.0,
    "04-15": 6.0,
    "05-07": 6.8,
    "08-25": 5.3,
    "09-10": 8.8,
    "10-27": 6.0,
    "11-20": 2.5,
  },
  "grand_haven_mi|steelhead": {
    "04-20": 6.5,
    "06-15": 8.8,
    "07-22": 8.7,
    "08-20": 6.0,
    "10-30": 9.2,
    "11-10": 7.2,
  },
  "grand_haven_mi|brown_trout": {
    "03-10": 5.8,
    "04-15": 7.6,
    "05-10": 6.0,
    "08-15": 1.0,
  },
  "manistee_mi|chinook_salmon": {
    "01-15": 1.0,
    "04-15": 1.2,
    "06-03": 6.5,
    "08-05": 5.5,
    "08-20": 8.5,
    "08-30": 9.5,
    "09-07": 9.0,
    "09-24": 5.5,
    "10-12": 5.8,
    "12-31": 1.0,
  },
  "manistee_mi|coho_salmon": {
    "01-15": 1.5,
    "09-10": 6.5,
    "10-05": 8.2,
    "11-05": 6.2,
    "12-10": 1.8,
  },
  "manistee_mi|steelhead": {
    "03-12": 5.7,
    "04-10": 6.8,
    "10-05": 8.3,
    "10-28": 10.0,
    "11-10": 8.2,
    "12-05": 6.0,
  },
  "manistee_mi|brown_trout": {
    "03-10": 6.0,
    "04-10": 8.2,
    "04-30": 7.8,
    "05-15": 6.3,
    "06-20": 4.2,
    "08-15": 1.0,
  },
  "frankfort_elberta_mi|chinook_salmon": {
    "01-15": 1.0,
    "04-15": 1.2,
    "07-20": 5.8,
    "08-05": 8.0,
    "08-16": 9.7,
    "08-27": 9.4,
    "09-10": 9.2,
    "09-26": 7.2,
    "11-15": 1.0,
    "12-31": 1.0,
  },
  "frankfort_elberta_mi|coho_salmon": {
    "01-15": 1.2,
    "08-16": 6.2,
    "09-15": 8.6,
    "10-05": 7.2,
    "11-01": 5.3,
    "12-01": 1.7,
  },
  "frankfort_elberta_mi|steelhead": {
    "03-10": 6.0,
    "04-02": 7.0,
    "07-15": 5.2,
    "10-16": 9.8,
    "11-01": 8.0,
    "11-25": 5.2,
  },
  "frankfort_elberta_mi|brown_trout": {
    "03-10": 6.0,
    "04-05": 7.5,
    "05-10": 7.0,
    "06-25": 4.5,
    "09-01": 1.3,
  },
  "sheboygan_wi|chinook_salmon": {
    "01-15": 1.0,
    "05-15": 1.4,
    "07-20": 4.8,
    "08-05": 7.0,
    "08-18": 8.6,
    "08-31": 9.6,
    "09-12": 8.8,
    "10-01": 6.0,
    "12-15": 1.0,
  },
  "sheboygan_wi|coho_salmon": {
    "01-15": 1.2,
    "03-15": 5.2,
    "04-15": 7.7,
    "05-15": 7.0,
    "06-20": 4.5,
    "07-15": 7.5,
    "08-13": 6.2,
    "09-09": 7.0,
    "10-19": 5.4,
    "12-31": 1.2,
  },
  "sheboygan_wi|steelhead": {
    "03-15": 5.2,
    "04-20": 6.8,
    "05-25": 5.5,
    "07-15": 7.3,
    "08-25": 5.3,
    "10-10": 6.3,
  },
  "sheboygan_wi|brown_trout": {
    "01-15": 4.2,
    "03-10": 6.8,
    "04-15": 7.8,
    "05-20": 7.2,
    "07-15": 2.0,
    "12-31": 4.2,
  },
};

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (source.researchVersion === "piercast-core-seasonal-v0.4.0") {
  console.log("PierCast seasonal curves are already calibrated to v0.4.");
  process.exit(0);
}
if (source.researchVersion !== "piercast-core-seasonal-v0.3.0") {
  throw new Error(`Expected v0.3 source, found ${source.researchVersion}.`);
}
if (source.curves.length !== 20 || Object.keys(revisions).length !== 20) {
  throw new Error("The v0.4 migration must cover exactly 20 curves.");
}

for (const curve of source.curves) {
  const key = `${curve.cityId}|${curve.speciesId}`;
  const curveRevisions = revisions[key];
  if (!curveRevisions) throw new Error(`Missing v0.4 revisions for ${key}.`);
  const knotDates = new Set(curve.knots.map((knot) => knot.monthDay));
  for (const monthDay of Object.keys(curveRevisions)) {
    if (!knotDates.has(monthDay)) {
      throw new Error(`Unknown v0.4 knot ${key}/${monthDay}.`);
    }
  }
  curve.knots = curve.knots.map((knot) => ({
    ...knot,
    rating: curveRevisions[knot.monthDay] ?? knot.rating,
  }));
  for (const knot of curve.knots) {
    if (
      knot.rating < 1 || knot.rating > 10 ||
      !Number.isInteger(knot.rating * 10)
    ) {
      throw new Error(`Invalid v0.4 rating ${key}/${knot.monthDay}.`);
    }
  }
  curve.curveId = curve.curveId.replace(/__v0_3$/, "__v0_4");
}

source.researchVersion = "piercast-core-seasonal-v0.4.0";
source.sharedCalibrationEvidence.michiganCurveIds = ["M3", "M4", "M5"];
fs.writeFileSync(sourcePath, `${JSON.stringify(source, null, 2)}\n`);
console.log(`Recalibrated ${source.curves.length} PierCast curves to v0.4.`);
