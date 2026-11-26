// A course that gained units keeps the units it had for every completion the
// seminary recorded before the change (src/data/unit-legacy.json,
// worker/awards.js legacyUnits). Presbyterian History went from 10 to 12
// units on 24 Nov 2026: a student who finished the 10-unit course keeps it.
//
//   node test/unit-legacy.test.mjs

import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(
  `export async function load(url, ctx, next) {
     if (url.endsWith('.json')) return next(url, { ...ctx, importAttributes: { ...ctx.importAttributes, type: 'json' } });
     return next(url, ctx);
   }`));
const A = await import('../worker/awards.js');
const catalog = (await import('../worker/catalog.json')).default;
import fs from 'node:fs';

let checks = 0;
const fails = [];
const ok = (cond, label) => { checks++; if (!cond) fails.push(label); };

const c = catalog.courses.elecref1;
ok(c && c.totalUnits === 12 && c.units.length === 12, 'Presbyterian History has 12 units');
ok(c && c.legacy && c.legacy.units.length === 10, 'and keeps its 10-unit list as legacy');
const ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], all = [...ten, 11, 12];
const ctx = (completions) => ({ completions, now: '2026-12-15T00:00:00Z', requiredFrom: {} });
const before = [{ code: 'CTSELECREF1', track: 'cert', completed_at: '2026-11-20 10:00:00' }];
const after = [{ code: 'CTSELECREF1', track: 'cert', completed_at: '2026-12-05 10:00:00' }];

ok(A.courseShortfall('elecref1', ten, 'cert', [], ctx(before)) === null, 'completed before the change with 10 units: the certificate stands');
ok(/units not recorded as passed: 11, 12/.test(A.courseShortfall('elecref1', ten, 'cert', [], ctx([])) || ''), 'no earlier completion: units 11 and 12 are required');
ok(/11, 12/.test(A.courseShortfall('elecref1', ten, 'cert', [], ctx(after)) || ''), 'a completion recorded after the change does not use the old list');
ok(A.courseShortfall('elecref1', all, 'cert', [], ctx([])) === null, 'all 12 units: the certificate is supported');
ok(/units not recorded/.test(A.courseShortfall('elecref1', ten.slice(1), 'cert', [], ctx(before)) || ''), 'the legacy list still needs every one of its units');
ok(A.legacyUnits('ots', ctx(before)) === null, 'other courses have no legacy list');

// The reading order: every stored unit appears once, and the pages that use it agree.
const order = JSON.parse(fs.readFileSync('src/data/unit-order.json', 'utf8')).CTSElecRef1;
ok(JSON.stringify([...order].sort((a, b) => a - b)) === JSON.stringify(all), 'the reading order lists units 1-12 once each');
for (let i = 0; i < order.length; i++) {
  const u = JSON.parse(fs.readFileSync(`src/content/units-public/CTSElecRef1/${order[i]}.json`, 'utf8'));
  const prev = i ? `CTSElecRef1Unit${order[i - 1]}.html` : null;
  const next = i < order.length - 1 ? `CTSElecRef1Unit${order[i + 1]}.html` : 'CTSElecRef1Certificate.html';
  ok(u.prevHref === prev && u.nextHref === next, `unit ${order[i]} links in reading order`);
  ok(new RegExp(`Unit ${i + 1}:`).test(u.title), `unit ${order[i]} is titled as Unit ${i + 1}`);
}
const cert = fs.readFileSync('public/CTSElecRef1Certificate.html', 'utf8');
ok(cert.includes('const totalUnits = 12;') && cert.includes(`const ORDER = [${order.join(', ')}];`), 'the certificate page counts 12 units in reading order');

if (fails.length) { console.error(`FAIL ${fails.length} of ${checks}:\n  - ` + fails.join('\n  - ')); process.exit(1); }
console.log(`unit-legacy: ${checks} checks pass`);
