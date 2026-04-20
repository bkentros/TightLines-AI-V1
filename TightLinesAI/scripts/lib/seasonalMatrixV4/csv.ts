/** Minimal RFC4180-style CSV field encoding (one header row + data rows). */

export function encodeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function decodeCsvField(raw: string): string {
  const t = raw.trim();
  if (t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1).replaceAll('""', '"');
  }
  return t;
}

/** Split a CSV line respecting quoted fields. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = false;
        }
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") {
        out.push(cur);
        cur = "";
      } else cur += c;
    }
  }
  out.push(cur);
  return out;
}

export function parsePipeList(s: string): string[] {
  if (!s.trim()) return [];
  return s.split("|").map((x) => x.trim()).filter(Boolean);
}

export function joinPipeList(ids: readonly string[]): string {
  return ids.join("|");
}
