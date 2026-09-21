// Course gating: is the generated front page still locking what the
// hand-written one locked?
//
// This exists because of a real scare. The catalog cards are now generated
// from a collection, and the lock state is painted onto them at runtime by
// cts-curriculum.js, which matches on the card's href. Nothing in the build
// checks that the two still agree -- a renamed entry page or a dropped script
// tag would quietly open the whole catalog to a student who has finished
// nothing, and the page would look perfectly fine.
//
// Both pages are loaded from the same server with the same empty localStorage.
// The only difference is which index.html is served.
//
//   node tools/verify-gating.mjs http://127.0.0.1:8798 _reference-index.html

import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const REFERENCE = process.argv[3] || '_reference-index.html';
const CHROME = process.env.CHROME_PATH;

const CORE = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

/* Comparing the built page against the reference page is necessary and not
   sufficient. Both are served from the same directory and both load the same
   cts-curriculum.js, so a change to the gating RULES moves both sides together
   and the comparison sees nothing. Removing a course from the foundation list
   -- which opens courses a student has not earned -- passed this check.
   That is the mistake that let 480 wrong answer keys through: a checker
   sharing a dependency with the thing it checks proves nothing.
   So the locked set is also compared against a recorded expectation that does
   not come from the page. Record it deliberately, the way the content
   baselines are recorded:
       node tools/verify-gating.mjs <base> <reference> --record          */
const BASELINE = 'test/fixtures/gating-baseline.json';
const RECORD = process.argv.includes('--record');

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const fails = [];
let checks = 0;
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

async function state(page_, done) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(`${BASE}/${page_}`, { waitUntil: 'load' });
  await p.evaluate((d) => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify({ name: 'T', track: 'cert' }));
    if (d.length) localStorage.setItem('cts_done_codes', JSON.stringify(d));
  }, done);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('a.course')];
    // Gating rewrites a locked card's href to the explainer page, so the href
    // cannot identify the course. Use the English title, which it does not
    // touch -- otherwise a failure reports the same destination 35 times.
    const name = (a) => (a.querySelector('.c-title .en') || a.querySelector('.c-title') || a).textContent.trim();
    return {
      cards: cards.length,
      locked: cards.filter((a) => /cts-locked/.test(a.className)).map(name).sort(),
      // where each card actually sends a student -- the redirect IS the feature
      destinations: Object.fromEntries(cards.map((a) => [name(a), a.getAttribute('href')])),
    };
  });
  await ctx.close();
  return { ...out, errs };
}

const recorded = {};
for (const [label, done] of [['a student who has finished nothing', []], ['a student who has finished the foundation', CORE]]) {
  const ref = await state(REFERENCE, done);
  const built = await state('index.html', done);

  ok(ref.errs.length === 0 && built.errs.length === 0,
    `${label}: page errors`, `reference: ${ref.errs[0] || '-'} | built: ${built.errs[0] || '-'}`);
  ok(ref.cards === built.cards, `${label}: ${built.cards} cards rendered, reference has ${ref.cards}`);
  ok(ref.cards > 0, `${label}: no course cards rendered at all — the check would pass vacuously`);

  const same = JSON.stringify(ref.locked) === JSON.stringify(built.locked);
  const only = (a, b) => a.filter((x) => !b.includes(x));
  ok(same, `${label}: a different set of courses is locked`,
    `locked only in the reference: ${only(ref.locked, built.locked).join(' ') || '(none)'}\n` +
    `        locked only in the build    : ${only(built.locked, ref.locked).join(' ') || '(none)'}`);

  ok(JSON.stringify(ref.destinations) === JSON.stringify(built.destinations),
    `${label}: a card leads somewhere different`);

  recorded[label] = { cards: built.cards, locked: built.locked };
  console.log(`  ${label}: ${built.locked.length}/${built.cards} locked (reference ${ref.locked.length}/${ref.cards})`);
}

/* The rule itself, not only its consequences.
   Comparing locked sets cannot see a shortened foundation list: a student with
   nothing is locked out either way, and a student with all seven is let in
   either way. Testing "a student one course short" only catches it if that
   happens to be the course removed. So ask the page directly -- for each
   foundation course in turn, a student holding the other six must NOT have
   completed the foundation. That pins the requirement at all seven, whatever
   order the list is in. */
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  const r = await p.evaluate((core) => {
    const set = (codes) => {
      localStorage.setItem('cts_student', JSON.stringify({ name: 'T', track: 'cert' }));
      localStorage.setItem('cts_done_codes', JSON.stringify(codes));
    };
    if (!window.CTSCurriculum || typeof window.CTSCurriculum.coreComplete !== 'function')
      return { missing: true };
    const out = { all: null, short: {} };
    set(core); out.all = window.CTSCurriculum.coreComplete();
    for (const c of core) { set(core.filter((x) => x !== c)); out.short[c] = window.CTSCurriculum.coreComplete(); }
    return out;
  }, CORE);
  await ctx.close();

  ok(!r.missing, 'the page does not expose CTSCurriculum.coreComplete — the foundation rule was not checked');
  if (!r.missing) {
    ok(r.all === true, `a student with all ${CORE.length} foundation courses is not credited with the foundation`);
    for (const c of CORE)
      ok(r.short[c] === false,
        `the foundation no longer requires ${c}`,
        `a student holding the other ${CORE.length - 1} was credited with the whole foundation`);
  }
}

await browser.close();

if (RECORD) {
  fs.mkdirSync('test/fixtures', { recursive: true });
  fs.writeFileSync(BASELINE, JSON.stringify(recorded, null, 1));
  const n = Object.values(recorded).reduce((a, r) => a + r.locked.length, 0);
  console.log(`recorded ${n} locked-course entries across ${Object.keys(recorded).length} student states -> ${BASELINE}`);
  process.exit(0);
}

/* The absolute check: which courses are locked, independent of the reference
   page and of cts-curriculum.js. */
if (!fs.existsSync(BASELINE)) {
  console.log(`FAIL — no gating baseline at ${BASELINE}. Run with --record once, ` +
              'having checked the locked list below is what the seminary intends.');
  for (const [label, r] of Object.entries(recorded))
    console.log(`  ${label}: ${r.locked.length}/${r.cards} locked`);
  process.exit(1);
}
const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
for (const [label, want] of Object.entries(base)) {
  const got = recorded[label];
  const only = (a, b) => a.filter((x) => !b.includes(x));
  ok(!!got, `${label}: this student state was not checked at all`);
  if (!got) continue;
  ok(got.cards === want.cards, `${label}: ${got.cards} cards, baseline recorded ${want.cards}`);
  ok(JSON.stringify(got.locked) === JSON.stringify(want.locked),
    `${label}: the locked set no longer matches the recorded one`,
    `newly OPEN to this student: ${only(want.locked, got.locked).join(' ') || '(none)'}\n` +
    `        newly LOCKED             : ${only(got.locked, want.locked).join(' ') || '(none)'}`);
}

console.log(`${checks} gating assertions`);
if (!fails.length) console.log('PASS — the catalog gates as the hand-written one did, and as recorded.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
