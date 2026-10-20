import { createHash } from "node:crypto";

import {
  buildPierCastSalmonidCityIntegrationAuditV18,
} from "../lib/pierCastSalmonidCityIntegrationAuditV18.ts";

const report = buildPierCastSalmonidCityIntegrationAuditV18();
const fingerprint = createHash("sha256")
  .update(JSON.stringify(report))
  .digest("hex");

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ ...report, fingerprint }, null, 2));
} else {
  console.log(
    [
      `PierCast salmonid city integration audit: ${report.schemaVersion}`,
      `Cities: ${report.coverage.cityCount}`,
      `Pairs: ${report.coverage.pairCount} (${report.coverage.scoredPairCount} scored, ${report.coverage.researchHoldPairCount} research holds)`,
      `Dates: ${report.coverage.dateCount}`,
      `Rows: ${report.coverage.auditedRowCount}/${report.coverage.expectedRowCount}`,
      `Errors: ${report.errorCount}`,
      `Fingerprint: ${fingerprint}`,
    ].join("\n"),
  );
}

if (report.errorCount > 0) process.exitCode = 1;
