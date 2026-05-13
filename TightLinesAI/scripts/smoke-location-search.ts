import { searchUsCities } from '../lib/locationSearch';

type Case = {
  query: string;
  first?: string;
  includes?: string[];
};

const cases: Case[] = [
  { query: 't', includes: ['Tampa, FL', 'Tacoma, WA'] },
  { query: 'ta', includes: ['Tampa, FL', 'Tacoma, WA'] },
  { query: 'tampa', first: 'Tampa, FL' },
  { query: 'dulth', first: 'Duluth, MN' },
  { query: 'xuluth', first: 'Duluth, MN' },
  { query: 'duluth mn', first: 'Duluth, MN' },
  { query: 'Kanss City MO', first: 'Kansas City, MO' },
  { query: 'Kansas City MO', first: 'Kansas City, MO' },
  { query: 'oklahma city', first: 'Oklahoma City, OK' },
  { query: 'Oklahoma City', first: 'Oklahoma City, OK' },
  { query: 'san deigo', first: 'San Diego, CA' },
  { query: 'San Diego', first: 'San Diego, CA' },
  { query: 'lake placd', first: 'Lake Placid, NY' },
  { query: 'Madison WI', first: 'Madison, WI' },
  { query: 'Garden City KS', first: 'Garden City, KS' },
  { query: 'Springfield IL', first: 'Springfield, IL' },
  { query: 'Washington DC', first: 'Washington, DC' },
  { query: 'Washington District of Columbia', first: 'Washington, DC' },
];

async function main() {
  let failures = 0;

  for (const c of cases) {
    const results = await searchUsCities(c.query);
    const labels = results.map((r) => r.label);
    const first = labels[0] ?? '<none>';

    if (c.first && first !== c.first) {
      failures += 1;
      console.error(`[fail] ${c.query}: expected first "${c.first}", got "${first}"`);
      console.error(`       results: ${labels.slice(0, 8).join(' | ')}`);
    }

    for (const expected of c.includes ?? []) {
      if (!labels.includes(expected)) {
        failures += 1;
        console.error(`[fail] ${c.query}: expected results to include "${expected}"`);
        console.error(`       results: ${labels.slice(0, 8).join(' | ')}`);
      }
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
  } else {
    console.log(`location-search smoke passed (${cases.length} cases)`);
  }
}

void main();
