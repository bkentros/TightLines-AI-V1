import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const localCreel = process.argv.find((x) => x.startsWith("--creel-local="))?.split("=").slice(1).join("=");
const localStocking = process.argv.find((x) => x.startsWith("--stocking-local="))?.split("=").slice(1).join("=");
const ports = ["PENTWATER", "ROGERS CITY", "TAWAS", "TAWAS CITY", "EAST TAWAS", "TAWAS-EAST TAWAS", "TAWAS/EAST TAWAS", "TAWAS - EAST TAWAS", "CHARLEVOIX", "CASEVILLE", "CASEVILLE-PORT AUSTIN", "CASEVILLE/PORT AUSTIN", "CASEVILLE TO PORT AUSTIN"];
const counties = new Set(["Oceana", "Presque Isle", "Iosco", "Charlevoix", "Huron"]);
const creelOutput = path.join(dir, "michigan-creel-pier-dock-raw.csv");
const stockingOutput = path.join(dir, "michigan-stocking-target-counties-raw.csv");

function parseCsv(text) {
  const rows = []; let row = []; let field = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (c === '"') quoted = false; else field += c; }
    else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ""; }
    else if (c === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  return rows;
}
function cell(value) { const text = value == null ? "" : String(value); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function toCsv(rows) { return `${rows.map((r) => r.map(cell).join(",")).join("\n")}\n`; }

async function extractCreel() {
  if (localCreel) return fs.readFileSync(localCreel, "utf8");
  const REPORT_KEY = "9d96412b-b1db-4c26-9110-2306139a9b37";
  const MODEL_ID = 176006;
  const url = "https://wabi-us-gov-iowa-api.analysis.usgovcloudapi.net/public/reports/querydata?synchronous=true";
  const literal = (v) => typeof v === "number" ? `${v}L` : `'${v}'`;
  const filter = (property, values) => ({ Condition: { In: { Expressions: [{ Column: { Expression: { SourceRef: { Source: "c" } }, Property: property } }], Values: values.map((v) => [{ Literal: { Value: literal(v) } }]) } } });
  const column = (property) => ({ Column: { Expression: { SourceRef: { Source: "c" } }, Property: property }, Name: `Combined.${property}` });
  const dimensions = ["Year", "PORT", "Mode", "SpeciesName", "Month", "MonthName", "Estimate Type"];
  const select = dimensions.map(column);
  select.push({ Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "Estimate" } }, Function: 0 }, Name: "Sum(Combined.Estimate)" });
  async function query(port) {
    const command = { SemanticQueryDataShapeCommand: { Query: { Version: 2, From: [{ Name: "c", Entity: "Combined", Type: 0 }], Select: select, Where: [filter("PORT", [port]), filter("Mode", ["Pier/Dock"]), filter("Estimate Type", ["Angler Hours", "Catch", "Harvest"])] }, Binding: { Primary: { Groupings: [{ Projections: select.map((_, i) => i) }] }, DataReduction: { DataVolume: 6, Primary: { Window: { Count: 10000 } } }, Version: 1 }, ExecutionMetricsKind: 1 } };
    const response = await fetch(url, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json", "X-PowerBI-ResourceKey": REPORT_KEY, ActivityId: crypto.randomUUID(), RequestId: crypto.randomUUID(), Origin: "https://app.powerbigov.us" }, body: JSON.stringify({ version: "1.0.0", queries: [{ Query: { Commands: [command] }, ApplicationContext: { DatasetId: String(MODEL_ID) } }], cancelQueries: [], modelId: MODEL_ID }) });
    if (!response.ok) throw new Error(`Power BI query failed (${response.status}) for ${port}`);
    const result = (await response.json()).results?.[0]?.result?.data;
    const error = result?.dsr?.DataShapes?.[0]?.["odata.error"];
    if (error) throw new Error(error.message?.value ?? error.code);
    const ds = result.dsr.DS[0]; const compact = ds.PH?.[0]?.DM0 ?? [];
    if (!compact.length) return [];
    const schema = compact[0].S; const dict = ds.ValueDicts ?? {}; const names = result.descriptor.Select.map((x) => x.Name); const previous = Array(schema.length);
    return compact.map((r) => { const vals = []; let cursor = 0; for (let i = 0; i < schema.length; i++) { let v; if ((r.R ?? 0) & (1 << i)) v = previous[i]; else if ((r["Ø"] ?? 0) & (1 << i)) v = null; else { v = r.C?.[cursor++]; if (schema[i].DN) v = dict[schema[i].DN][v]; } previous[i] = v; vals.push(v); } return Object.fromEntries(names.map((n, i) => [n, vals[i]])); });
  }
  const rows = [];
  for (const port of ports) for (const r of await query(port)) rows.push([r["Combined.Year"], r["Combined.PORT"], r["Combined.Mode"], r["Combined.SpeciesName"], r["Combined.Month"], r["Combined.MonthName"], r["Combined.Estimate Type"], r["Sum(Combined.Estimate)"], "Michigan DNR Creel Sportfishing Estimates dashboard", "2025-04-23"]);
  rows.sort((a, b) => a[1].localeCompare(b[1]) || a[0] - b[0] || a[4] - b[4] || String(a[3]).localeCompare(String(b[3])) || a[6].localeCompare(b[6]));
  return toCsv([["year", "port", "mode", "species", "month", "month_name", "estimate_type", "estimate", "source", "source_last_refreshed"], ...rows]);
}

async function extractStocking() {
  const text = localStocking ? fs.readFileSync(localStocking, "utf8") : await (await fetch("https://www2.dnr.state.mi.us/publications/pdfs/Fishing/FishStocking/FishStockingData.csv")).text();
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  const header = rows.shift();
  const countyIndex = header.indexOf("County_Name");
  return toCsv([header, ...rows.filter((r) => counties.has(r[countyIndex]))]);
}

const creel = await extractCreel();
const stocking = await extractStocking();
fs.writeFileSync(creelOutput, creel);
fs.writeFileSync(stockingOutput, stocking);
console.log(`Wrote ${parseCsv(creel.trim()).length - 1} creel rows to ${creelOutput}`);
console.log(`Wrote ${parseCsv(stocking.trim()).length - 1} stocking rows to ${stockingOutput}`);
