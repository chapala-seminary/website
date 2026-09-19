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

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const REFERENCE = process.argv[3] || '_reference-index.html';
const CHROME = process.env.CHROME_PATH;

const CORE = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

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

  console.log(`  ${label}: ${built.locked.length}/${built.cards} locked (reference ${ref.locked.length}/${ref.cards})`);
}

await browser.close();
console.log(`${checks} gating assertions`);
if (!fails.length) console.log('PASS — the generated catalog gates exactly as the hand-written one did.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
