// Country codes: the menu, the stored value, and the migration agree.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CODES, canonicalCountry, countryUpdates } from '../src/lib/countries.mjs';

for (const [typed, stored] of [
  ['US', 'US'],
  ['us', 'US'],
  ['USA', 'US'],
  ['U.S.A.', 'US'],
  ['EEUU', 'US'],
  ['Estados Unidos', 'US'],
  ['México', 'MX'],
  ['Mexique', 'MX'],
  ['Other', 'OT'],
  ['Otro', 'OT'],
  ['korea', 'KR'],
  ['North Korea', 'KP'],
  ['Narnia', 'Narnia'],
  ['America', 'America'],
  ['', null],
  [null, null],
]) {
  assert.equal(canonicalCountry(typed), stored, `${typed} -> ${stored}`);
}

const menu = readFileSync(new URL('../public/assets/js/cts-countries.js', import.meta.url), 'utf8');
for (const code of CODES) assert.ok(menu.includes(`"${code}"`), `the browser menu lists ${code}`);
assert.equal(CODES.length, 198);

const sql = readFileSync(new URL('../migrations/0016_country_codes.sql', import.meta.url), 'utf8');
const body = sql.split('\n').filter((line) => line && !line.startsWith('--')).join('\n');
assert.equal(body.trim(), countryUpdates().trim());
assert.ok(!/INSERT|student_id|@/.test(sql), 'the migration names countries only');

console.log(`PASS — ${CODES.length} country codes, aliases, and the migration agree.`);
