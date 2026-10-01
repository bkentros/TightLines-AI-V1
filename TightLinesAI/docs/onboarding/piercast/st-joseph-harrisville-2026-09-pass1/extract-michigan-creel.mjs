import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORT_KEY = "9d96412b-b1db-4c26-9110-2306139a9b37";
const MODEL_ID = 176006;
const QUERY_URL =
  "https://wabi-us-gov-iowa-api.analysis.usgovcloudapi.net/public/reports/querydata?synchronous=true";
const TARGET_PORTS = [
  "ST. JOSEPH",
  "ST JOSEPH",
  "ST.JOSEPH",
  "ST. JOSEPH-BENTON HARBOR",
  "ST.JOSEPH-BENTON HARBOR",
  "ST JOSEPH-BENTON HARBOR",
  "ST. JOSEPH/BENTON HARBOR",
  "ST.JOSEPH/BENTON HARBOR",
  "ST JOSEPH/BENTON HARBOR",
  "SOUTH HAVEN",
  "HOLLAND",
  "LEXINGTON",
  "HARRISVILLE",
];
const SOURCE_LAST_REFRESHED = "2025-04-23";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(scriptDir, "michigan-creel-pier-dock-raw.json");

function encodedLiteral(value) {
  return typeof value === "number" ? `${value}L` : `'${value}'`;
}

function inFilter(property, values) {
  return {
    Condition: {
      In: {
        Expressions: [
          {
            Column: {
              Expression: { SourceRef: { Source: "c" } },
              Property: property,
            },
          },
        ],
        Values: values.map((value) => [
          { Literal: { Value: encodedLiteral(value) } },
        ]),
      },
    },
  };
}

function column(property) {
  return {
    Column: {
      Expression: { SourceRef: { Source: "c" } },
      Property: property,
    },
    Name: `Combined.${property}`,
  };
}

async function executeQuery(select, where, count = 30000) {
  const command = {
    SemanticQueryDataShapeCommand: {
      Query: {
        Version: 2,
        From: [{ Name: "c", Entity: "Combined", Type: 0 }],
        Select: select,
        Where: where,
      },
      Binding: {
        Primary: {
          Groupings: [{ Projections: select.map((_, index) => index) }],
        },
        DataReduction: { DataVolume: 6, Primary: { Window: { Count: count } } },
        Version: 1,
      },
      ExecutionMetricsKind: 1,
    },
  };
  const response = await fetch(QUERY_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-PowerBI-ResourceKey": REPORT_KEY,
      ActivityId: crypto.randomUUID(),
      RequestId: crypto.randomUUID(),
      Origin: "https://app.powerbigov.us",
    },
    body: JSON.stringify({
      version: "1.0.0",
      queries: [
        {
          Query: { Commands: [command] },
          ApplicationContext: { DatasetId: String(MODEL_ID) },
        },
      ],
      cancelQueries: [],
      modelId: MODEL_ID,
    }),
  });
  if (!response.ok) {
    throw new Error(`Power BI query failed (${response.status})`);
  }
  const payload = await response.json();
  const result = payload.results?.[0]?.result?.data;
  const shapeError = result?.dsr?.DataShapes?.[0]?.["odata.error"];
  if (shapeError) throw new Error(shapeError.message?.value ?? shapeError.code);
  return result;
}

function decodeRows(result) {
  const dataSet = result.dsr.DS[0];
  const compactRows = dataSet.PH?.[0]?.DM0 ?? [];
  if (compactRows.length === 0) return [];
  const schema = compactRows[0].S;
  const dictionaries = dataSet.ValueDicts ?? {};
  const names = result.descriptor.Select.map((entry) => entry.Name);
  const previous = Array(schema.length).fill(undefined);
  return compactRows.map((row) => {
    const values = [];
    let cursor = 0;
    for (let index = 0; index < schema.length; index += 1) {
      const repeated = Boolean((row.R ?? 0) & (1 << index));
      const isNull = Boolean((row["Ø"] ?? 0) & (1 << index));
      let value;
      if (repeated) {
        value = previous[index];
      } else if (isNull) {
        value = null;
      } else {
        value = row.C?.[cursor];
        cursor += 1;
        const dictionaryName = schema[index].DN;
        if (dictionaryName) value = dictionaries[dictionaryName][value];
      }
      previous[index] = value;
      values.push(value);
    }
    return Object.fromEntries(names.map((name, index) => [name, values[index]]));
  });
}

if (process.argv.includes("--list-ports")) {
  const result = await executeQuery([column("PORT")], [], 1000);
  const ports = decodeRows(result)
    .map((row) => row["Combined.PORT"])
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
  console.log(JSON.stringify(ports, null, 2));
  process.exit(0);
}

const dimensions = [
  "Year",
  "PORT",
  "Mode",
  "SpeciesName",
  "Month",
  "MonthName",
  "Estimate Type",
];
const select = dimensions.map(column);
select.push({
  Aggregation: {
    Expression: {
      Column: {
        Expression: { SourceRef: { Source: "c" } },
        Property: "Estimate",
      },
    },
    Function: 0,
  },
  Name: "Sum(Combined.Estimate)",
});

const rows = [];
for (const port of TARGET_PORTS) {
  const result = await executeQuery(select, [
    inFilter("PORT", [port]),
    inFilter("Mode", ["Pier/Dock"]),
    inFilter("Estimate Type", ["Angler Hours", "Catch", "Harvest"]),
  ]);
  for (const row of decodeRows(result)) {
    rows.push({
      year: row["Combined.Year"],
      port: row["Combined.PORT"],
      mode: row["Combined.Mode"],
      species: row["Combined.SpeciesName"],
      month: row["Combined.Month"],
      month_name: row["Combined.MonthName"],
      estimate_type: row["Combined.Estimate Type"],
      estimate: row["Sum(Combined.Estimate)"],
    });
  }
}

rows.sort(
  (left, right) =>
    left.port.localeCompare(right.port) ||
    left.year - right.year ||
    left.month - right.month ||
    String(left.species).localeCompare(String(right.species)) ||
    left.estimate_type.localeCompare(right.estimate_type),
);

const artifact = {
  schema_version: 1,
  retrieved_at: new Date().toISOString(),
  source: "Michigan DNR Creel Sportfishing Estimates dashboard",
  source_url:
    "https://www.michigan.gov/dnr/managing-resources/fisheries/research/creel-reports",
  source_last_refreshed: SOURCE_LAST_REFRESHED,
  report_key: REPORT_KEY,
  model_id: MODEL_ID,
  filters: {
    ports: TARGET_PORTS,
    mode: "Pier/Dock",
    estimate_types: ["Angler Hours", "Catch", "Harvest"],
  },
  limitations: [
    "A port row is not automatically allocable to every structure inside that port boundary.",
    "A sampled zero outside a species season is not evidence of absence.",
    "Annual and monthly estimates retain the dashboard's survey coverage and estimation limitations.",
  ],
  rows,
};
fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(`Wrote ${rows.length} rows to ${outputPath}`);
