/* A required-reading test drawn by reading (World Religions, revised
 * 10 Oct 2026), driven in a browser the way a student would use it.
 *
 *   node tools/import-readings.mjs --next-out <dir>
 *   node tools/verify-grouped-reading-test.mjs <base-url> <dir>/wrreadings.json
 *
 * The revised bank has eight questions on each of the five readings, and
 * each attempt draws four from each. Until it is in force (tools/import-
 * readings.mjs, `next.active`) the site does not build its page, so the test
 * serves one at <base>/__verify-grouped-reading-test.html from the bank the
 * importer would write, with the site's own scripts (cts-fill.js,
 * cts-record.js, cts-textbook.js) loaded from <base>. Once the bank is in
 * force, the built CTSWRRequiredTest.html carries it and is tested instead.
 * Checked:
 *   - every attempt draws twenty distinct questions, four from each reading,
 *     and every question can be drawn;
 *   - a reload mid-attempt keeps the draw and the answers typed;
 *   - an attempt saved before the revision, or under another, is set aside
 *     for a fresh draw -- and the pass, its date and a lock are kept;
 *   - a saved attempt of the right revision that is not four from each
 *     reading is drawn afresh;
 *   - eighteen right passes (English, Spanish, alternates, capitals without
 *     accents); seventeen fails and locks, and after the wait a fresh draw
 *     is again four from each reading; so is a practice set after a pass;
 *   - a bank not drawn by reading (Genesis), when the site has its page,
 *     draws as before and keeps no revision.
 * Answers are read from the page's own data.
 */
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const NEXT = process.argv[3];
const CHROME = process.env.CHROME_PATH;
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const fails = [];
let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d !== undefined ? `\n        ${typeof d === 'string' ? d : JSON.stringify(d)}` : '')); };

/* The page to test: the built one if the bank is in force, else a copy of it. */
let PAGE = 'CTSWRRequiredTest.html', harness = null;
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const r = await p.goto(`${BASE}/${PAGE}`, { waitUntil: 'load' }).catch(() => null);
  const live = r && r.ok() ? await p.evaluate(() => window.CTS_TEXTBOOK_TEST && window.CTS_TEXTBOOK_TEST.perGroup) : null;
  await ctx.close();
  if (!live) {
    if (!NEXT || !fs.existsSync(NEXT)) { console.error('The site does not yet serve a test drawn by reading; give the bank: node tools/import-readings.mjs --next-out <dir>, then pass <dir>/wrreadings.json'); process.exit(2); }
    const r0 = JSON.parse(fs.readFileSync(NEXT, 'utf8'));
    const data = { slug: r0.slug, page: r0.page, kind: 'reading', title: r0.title, draw: r0.test.draw, pass: r0.test.pass,
      questions: r0.test.questions, completion: null, perGroup: r0.test.perGroup, revision: r0.test.revision };
    PAGE = '__verify-grouped-reading-test.html';
    harness = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>grouped reading test</title>
<script src="/cts-lang.js"></script></head>
<body class="lang-en" data-textbook-kind="reading">
<section class="card tb-test" id="tb-test"><div id="tb-status" role="status"></div><div id="tb-questions"></div>
<div class="actions"><button type="button" id="tb-submit">Submit</button><button type="button" id="tb-reset">Clear</button></div>
<div id="tb-result"></div></section>
<script>window.CTS_TEXTBOOK_TEST = ${JSON.stringify(data).replace(/</g, '\\u003c')};</script>
<script src="/assets/js/cts-fill.js"></script><script src="/assets/js/cts-record.js"></script><script src="/assets/js/cts-textbook.js"></script>
</body></html>`;
    console.log(`(the bank is not in force: testing it on a copy of the page, with the site's scripts from ${BASE})`);
  }
}

const KEY = (k) => `cts_textbook_wrreadings_${k}`;
async function open(seed = {}) {
  const ctx = await browser.newContext();
  if (harness) await ctx.route(`${BASE}/${PAGE}`, (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: harness }));
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${PAGE}`, { waitUntil: 'load' });
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(150);
  return { ctx, p, errs };
}
const T = async (p) => p.evaluate(() => window.CTS_TEXTBOOK_TEST);
const draw = (p) => p.evaluate(() => window.CTS_TEXTBOOK.draw());
const saved = (p) => p.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEY('state'));
const perGroup = (bank, d) => { const c = {}; for (const i of d) { const g = bank.questions[i].group; c[g] = (c[g] || 0) + 1; } return c; };
const groupedOK = (bank, d) => { const c = perGroup(bank, d), gs = [...new Set(bank.questions.map((q) => q.group))];
  return d.length === bank.draw && new Set(d).size === d.length && gs.every((g) => c[g] === bank.perGroup); };
const student = (track = 'cert') => JSON.stringify({ name: 'Synthetic Reader', track });
/* Answer the first `right` questions from the page's data -- in the language
   and form asked -- and the rest wrongly, pressing Check on each. */
async function answer(p, right, form = () => (q) => q.answer.en) {
  const bank = await T(p), d = await draw(p);
  for (let i = 0; i < d.length; i++) {
    const q = bank.questions[d[i]];
    await p.locator(`input[data-cts-fill="${i}"]`).fill(i < right ? form(i)(q) : 'xyzzy wrong');
    await p.locator(`button[data-cts-fill-check="${i}"]`).click();
  }
}

// 1. the bank, and fresh draws: four from each reading, every question reachable
{
  const a = await open({ cts_student: student() });
  const bank = await T(a.p);
  const gs = [...new Set(bank.questions.map((q) => q.group))].sort();
  ok(bank.draw === 20 && bank.pass === 18 && bank.questions.length === 40 && bank.perGroup === 4, `the page says draw ${bank.draw}, pass ${bank.pass}, ${bank.questions.length} questions, ${bank.perGroup} per reading`);
  ok(JSON.stringify(gs) === '[1,2,3,4,5]' && gs.every((g) => bank.questions.filter((q) => q.group === g).length === 8), 'eight questions on each of readings 1-5', gs);
  ok(typeof bank.revision === 'string' && bank.revision.length > 0, 'the bank carries its revision', bank.revision);
  ok((await a.p.locator('input[data-cts-fill]').count()) === 20, 'twenty answer boxes on the page');
  ok(a.errs.length === 0, 'page errors', a.errs[0]);
  const seen = new Set(), orders = new Set();
  let bad = null;
  for (let k = 0; k < 60; k++) {
    await a.p.evaluate((key) => localStorage.removeItem(key), KEY('state'));
    await a.p.reload({ waitUntil: 'load' });
    const d = await draw(a.p);
    if (!groupedOK(bank, d) && !bad) bad = { d, per: perGroup(bank, d) };
    d.forEach((i) => seen.add(i)); orders.add(JSON.stringify(d));
    const st = await saved(a.p);
    if (k === 0) ok(st && st.rev === bank.revision, 'a fresh attempt is saved with the bank revision', st && st.rev);
  }
  ok(!bad, 'every fresh draw is twenty distinct questions, four from each reading', bad);
  ok(seen.size === 40, `every question can be drawn: ${seen.size} of 40 seen in 60 draws`);
  ok(orders.size > 55, `fresh draws differ: ${orders.size} distinct of 60`);
  // a reload mid-attempt keeps the draw and the answer typed
  const d0 = await draw(a.p);
  await a.p.locator('input[data-cts-fill="0"]').fill('something');
  await a.p.waitForTimeout(100);
  await a.p.reload({ waitUntil: 'load' });
  ok(JSON.stringify(await draw(a.p)) === JSON.stringify(d0), 'a reload mid-attempt changed the draw');
  ok((await a.p.locator('input[data-cts-fill="0"]').inputValue()) === 'something', 'a reload mid-attempt lost the answer typed');
  await a.ctx.close();
}

// 2. an attempt begun on the old bank -- no revision -- is set aside; the pass and its date are kept
{
  const probe = await open({ cts_student: student() });
  const bank = await T(probe.p), valid = await draw(probe.p);
  await probe.ctx.close();
  const oldDraw = Array.from({ length: 20 }, (_, i) => i);        // the old bank's numbers: now questions on readings 1-3 only
  for (const [label, st] of [
    ['an old-bank attempt (no revision)', { draw: oldDraw, fillAnswers: Array(20).fill('typed on the old questions'), fillChecked: Array(20).fill(true) }],
    ['an attempt of another revision, even one four from each reading', { draw: valid, rev: 'an-earlier-revision', fillAnswers: Array(20).fill('typed earlier'), fillChecked: Array(20).fill(true) }],
  ]) {
    const { ctx, p, errs } = await open({ cts_student: student('mdiv'), [KEY('state')]: JSON.stringify(st), [KEY('passed')]: '2026-10-01' });
    const now = await saved(p), d = await draw(p);
    ok(now && now.rev === bank.revision, `${label}: set aside for an attempt of the current revision`, now && now.rev);
    ok(groupedOK(bank, d), `${label}: the fresh attempt is four from each reading`, perGroup(bank, d));
    ok(!(now.fillAnswers || []).some(Boolean), `${label}: no answer typed on other questions is carried over`, now.fillAnswers);
    ok((await p.evaluate((k) => localStorage.getItem(k), KEY('passed'))) === '2026-10-01', `${label}: the pass and its date are kept`);
    ok(errs.length === 0, `${label}: page errors`, errs[0]);
    await ctx.close();
  }
  // ... and a lock running is kept: the student still waits, then gets a fresh draw
  const until = Date.now() + 10 * 60000;
  const { ctx, p } = await open({ cts_student: student('mdiv'), [KEY('state')]: JSON.stringify({ draw: oldDraw, fillAnswers: [], fillChecked: [], redrawAt: until }), [KEY('lock')]: String(until) });
  ok((await p.evaluate((k) => localStorage.getItem(k), KEY('lock'))) === String(until), 'an old-bank attempt under a lock: the lock is kept');
  ok(await p.locator('#tb-submit').isDisabled(), 'an old-bank attempt under a lock: the test still cannot be submitted until the wait is over');
  ok((await saved(p)).rev === bank.revision && groupedOK(bank, await draw(p)), 'an old-bank attempt under a lock: replaced by an attempt of the current revision');
  await ctx.close();
}

// 3. the current revision, but not four from each reading: drawn afresh; the right one is kept
{
  const probe = await open({ cts_student: student() });
  const bank = await T(probe.p), valid = await draw(probe.p);
  await probe.ctx.close();
  const lopsided = bank.questions.map((q, i) => i).filter((i) => bank.questions[i].group !== 5).slice(0, 20);
  let s = await open({ cts_student: student(), [KEY('state')]: JSON.stringify({ draw: lopsided, rev: bank.revision, fillAnswers: [], fillChecked: [] }) });
  ok(groupedOK(bank, await draw(s.p)) && JSON.stringify(await draw(s.p)) !== JSON.stringify(lopsided), 'a saved attempt with no question on reading 5 is drawn afresh');
  await s.ctx.close();
  s = await open({ cts_student: student(), [KEY('state')]: JSON.stringify({ draw: valid, rev: bank.revision, fillAnswers: ['kept'].concat(Array(19).fill('')), fillChecked: [] }) });
  ok(JSON.stringify(await draw(s.p)) === JSON.stringify(valid) && (await s.p.locator('input[data-cts-fill="0"]').inputValue()) === 'kept', 'an attempt of the current revision, four from each reading, is resumed as it was');
  await s.ctx.close();
}

// 4. eighteen right passes -- English, Spanish, alternates, capitals without accents; then practice draws by reading too
{
  const { ctx, p, errs } = await open({ cts_student: student('mdiv') });
  const bank = await T(p);
  const strip = (a) => a.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  await answer(p, 18, (i) => [
    (q) => q.answer.en, (q) => q.answer.es, (q) => (q.accept.en[0] || q.answer.en), (q) => (q.accept.es[0] || q.answer.es), (q) => strip(q.answer.es),
  ][i % 5]);
  await p.locator('#tb-submit').click();
  await p.waitForTimeout(300);
  ok(/Passed: 18 of 20/.test(await p.locator('#tb-result').textContent()), 'eighteen right is a pass', await p.locator('#tb-result').textContent());
  ok(!!(await p.evaluate((k) => localStorage.getItem(k), KEY('passed'))), 'the pass is kept');
  await p.locator('#tb-practice').click();
  await p.waitForTimeout(150);
  ok(groupedOK(bank, await draw(p)) && (await saved(p)).rev === bank.revision, 'a practice set after the pass is four from each reading, of the current revision');
  ok(errs.length === 0, 'page errors', errs[0]);
  await ctx.close();
}

// 5. seventeen right fails and locks; after the wait, a fresh draw is again four from each reading
{
  const { ctx, p } = await open({ cts_student: student('mdiv') });
  const bank = await T(p), d0 = await draw(p);
  await answer(p, 17);
  await p.locator('#tb-submit').click();
  await p.waitForTimeout(300);
  ok(/Not yet: 17 of 20/.test(await p.locator('#tb-result').textContent()), 'seventeen right is not a pass', await p.locator('#tb-result').textContent());
  const lock = Number(await p.evaluate((k) => localStorage.getItem(k), KEY('lock')));
  ok(lock > Date.now() + 14 * 60000, 'a failed attempt on the M.Div. locks the test for fifteen minutes');
  ok(!(await p.evaluate((k) => localStorage.getItem(k), KEY('passed'))), 'a failed attempt records no pass');
  await p.evaluate(({ k, s }) => { localStorage.setItem(k, String(Date.now() - 1000)); const st = JSON.parse(localStorage.getItem(s)); st.redrawAt = Date.now() - 1000; localStorage.setItem(s, JSON.stringify(st)); }, { k: KEY('lock'), s: KEY('state') });
  await p.reload({ waitUntil: 'load' });
  const d1 = await draw(p);
  ok(JSON.stringify(d1) !== JSON.stringify(d0) && groupedOK(bank, d1), 'after the wait a fresh twenty are drawn, four from each reading');
  await ctx.close();
}

// 6. a bank not drawn by reading draws as before (the built site only: Genesis's page is generated)
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const r = await p.goto(`${BASE}/CTSGenesisReadingsTest.html`, { waitUntil: 'load' }).catch(() => null);
  if (r && r.ok()) {
    await p.evaluate(() => { localStorage.clear(); localStorage.setItem('cts_student', JSON.stringify({ name: 'Synthetic Reader', track: 'cert' })); });
    await p.reload({ waitUntil: 'load' });
    const g = await p.evaluate(() => ({ T: window.CTS_TEXTBOOK_TEST, d: window.CTS_TEXTBOOK.draw(), st: JSON.parse(localStorage.getItem('cts_textbook_genesisreadings_state') || 'null') }));
    ok(!g.T.perGroup && !g.T.revision, 'Genesis is not drawn by reading');
    ok(g.d.length === 20 && new Set(g.d).size === 20, 'Genesis still draws twenty distinct questions');
    ok(g.st && !('rev' in g.st), 'Genesis keeps no revision with its attempt');
  } else console.log('(CTSGenesisReadingsTest.html is not served here: the Genesis check runs on the built site)');
  await ctx.close();
}

await browser.close();
if (fails.length) {
  console.log(`FAIL — ${fails.length} of ${checks} grouped reading-test checks:`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log(`PASS — ${checks} grouped reading-test checks: four from each reading, revision-aware resume, pass and lock kept.`);
