import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import {
  buildPierCastSalmonidCalibrationAuditV18,
  type PierCastSalmonidCalibrationAuditReportV18,
} from "../lib/pierCastSalmonidCalibrationAuditV18.ts";

export function pierCastSalmonidCalibrationAuditFingerprint(
  report: PierCastSalmonidCalibrationAuditReportV18,
): string {
  return createHash("sha256").update(JSON.stringify(report)).digest("hex");
}

function printHumanSummary(
  report: PierCastSalmonidCalibrationAuditReportV18,
): void {
  const coverage = report.coverage;
  console.log(`PierCast salmonid calibration audit ${report.schemaVersion}`);
  console.log(
    `Coverage: ${coverage.auditedRowCount}/${coverage.expectedRowCount} rows; ` +
      `${coverage.scoredPairCount} scored pairs; ` +
      `${coverage.researchHoldPairCount} research holds; ` +
      `${coverage.dayCount} dates; ${coverage.scenarioCount} thermal scenarios.`,
  );
  console.log(
    `Findings: ${report.errorCount} errors; ${report.reviewCount} review flags.`,
  );
  for (const finding of report.findings) {
    console.log(
      `- ${finding.severity.toUpperCase()} ${finding.code}: ${finding.count}`,
    );
  }
  console.log(
    `Fingerprint: ${pierCastSalmonidCalibrationAuditFingerprint(report)}`,
  );
}

if (
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const emitRows = process.argv.includes("--rows");
  const report = buildPierCastSalmonidCalibrationAuditV18(
    emitRows ? { onRow: (row) => console.log(JSON.stringify(row)) } : {},
  );
  if (emitRows) {
    console.error(
      `Audited ${report.coverage.auditedRowCount} rows; ` +
        `${report.errorCount} errors; ${report.reviewCount} review flags.`,
    );
  } else if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanSummary(report);
  }
  if (report.errorCount > 0) process.exitCode = 1;
}
