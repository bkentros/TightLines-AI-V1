import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPORT_KEY = "9d96412b-b1db-4c26-9110-2306139a9b37";
const MODEL_ID = 176006;
const QUERY_URL =
  "https://wabi-us-gov-iowa-api.analysis.usgovcloudapi.net/public/reports/querydata?synchronous=true";

const PORTS = ["LUDINGTON", "GRAND HAVEN", "MANISTEE", "FRANKFORT-ELBERTA"];
const SPECIES = ["Chinook Salmon", "Coho Salmon", "Steelhead", "Brown Trout"];
const OUTPUT_COLUMNS = [
  "year",
  "port",
  "mode",
  "species",
  "month",
  "month_name",
  "estimate_type",
  "estimate",
  "source",
  "source_last_refreshed",
];

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outputPath = path.join(
  repoRoot,
  "docs/PierCast_Michigan_Pier_Creel_Estimates_1989_2022.csv",
);

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

async function executeQuery(select, where, count = 10000) {
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
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-PowerBI-ResourceKey": REPORT_KEY,
    ActivityId: crypto.randomUUID(),
    RequestId: crypto.randomUUID(),
    Origin: "https://app.powerbigov.us",
  };
  const body = {
    version: "1.0.0",
    queries: [
      {
        Query: { Commands: [command] },
        ApplicationContext: { DatasetId: String(MODEL_ID) },
      },
    ],
    cancelQueries: [],
    modelId: MODEL_ID,
  };
  const response = await fetch(QUERY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Power BI query failed (${response.status})`);
  }
  const payload = await response.json();
  const result = payload.results?.[0]?.result?.data;
  const dataShapeError = result?.dsr?.DataShapes?.[0]?.["odata.error"];
  if (dataShapeError) {
    throw new Error(dataShapeError.message?.value ?? dataShapeError.code);
  }
  return result;
}

function decodeRows(result) {
  const dataSet = result.dsr.DS[0];
  const compactRows = dataSet.PH[0].DM0;
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
        value = row.C[cursor];
        cursor += 1;
        const dictionaryName = schema[index].DN;
        if (dictionaryName) value = dictionaries[dictionaryName][value];
      }
      previous[index] = value;
      values.push(value);
    }
    return Object.fromEntries(
      names.map((name, index) => [name, values[index]]),
    );
  });
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
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

const extracted = [];
for (const port of PORTS) {
  const result = await executeQuery(select, [
    inFilter("PORT", [port]),
    inFilter("Mode", ["Pier/Dock"]),
    inFilter("Estimate Type", ["Angler Hours", "Catch", "Harvest"]),
  ]);
  for (const row of decodeRows(result)) {
    const species = row["Combined.SpeciesName"];
    const estimateType = row["Combined.Estimate Type"];
    if (estimateType !== "Angler Hours" && !SPECIES.includes(species)) continue;
    extracted.push([
      row["Combined.Year"],
      row["Combined.PORT"],
      row["Combined.Mode"],
      species,
      row["Combined.Month"],
      row["Combined.MonthName"],
      estimateType,
      row["Sum(Combined.Estimate)"],
      "Michigan DNR Creel Sportfishing Estimates dashboard",
      "2025-04-23",
    ]);
  }
}

extracted.sort((left, right) =>
  left[1].localeCompare(right[1]) ||
  left[0] - right[0] ||
  left[4] - right[4] ||
  String(left[3]).localeCompare(String(right[3])) ||
  left[6].localeCompare(right[6])
);
const csv = [OUTPUT_COLUMNS, ...extracted]
  .map((row) => row.map(csvCell).join(","))
  .join("\n");
fs.writeFileSync(outputPath, `${csv}\n`);
console.log(
  `Wrote ${extracted.length} official creel-estimate rows to ${outputPath}`,
);
