/* Credential boundaries (Dr. Cook's review, 29 Sept 2026, item 6).
 *
 * "A course initially completed at Certificate level may later be upgraded when
 * the student completes the additional Associate or master's requirements.
 * What must not happen is: Certificate completion -> automatically counted as
 * Associate or master's completion."
 *
 * The rules live twice -- worker/awards.js, which the Worker applies before it
 * issues a diploma, and public/assets/js/cts-degrees.js, which the four diploma
 * pages show progress from. This holds the two copies equal, runs every
 * boundary Dr. Cook listed against both, and opens each diploma page on the
 * two sides of its boundary. It also checks the one-time step that keeps an
 * old-site Associate student's courses at the Associate level.
 *
 *   node tools/verify-degrees.mjs http://127.0.0.1:8798
 */
import fs from 'node:fs';
import { chromium } from 'playwright';
// worker/awards.js imports the catalog the way the Worker's bundler does;
// Node wants an import attribute, so the module is loaded with that one line
// replaced by the same data.
const awardsSrc = fs.readFileSync('worker/awards.js', 'utf8').replace(
  /import catalog from '\.\/catalog\.json';/, `const catalog = ${fs.readFileSync('worker/catalog.json', 'utf8')};`);
const { DEGREES, FOUNDATION, MDIV_CORE, degreeShortfall } = await import('data:text/javascript,' + encodeURIComponent(awardsSrc));

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
let checks = 0;
const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

/* ---- the two copies agree ------------------------------------------------ */
const src = fs.readFileSync('public/assets/js/cts-degrees.js', 'utf8');
const client = new Function('window', 'localStorage', src + '; return window.CTSDegrees;')({}, { getItem: () => null, setItem() {} });
ok(JSON.stringify(client.FOUNDATION) === JSON.stringify(FOUNDATION), 'the foundation courses are the same in the browser and the Worker');
ok(JSON.stringify(client.MDIV_CORE) === JSON.stringify(MDIV_CORE), 'the M.Div. core is the same in the browser and the Worker');
for (const [k, d] of Object.entries(DEGREES))
  ok(client.DEGREES[k] && client.DEGREES[k].courses === d.courses && JSON.stringify(client.DEGREES[k].levels) === JSON.stringify(d.levels),
    `${k}: the same count and levels in the browser and the Worker`);

/* ---- one permanent ID per course (Dr. Cook's review, item 9) --------------
   The completion code is the ID: the browser's lists, the Worker, the
   database and the certificate names all use it. Exactly 44, no two alike,
   and every list of courses names only those. */
{
  const cat = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
  const ids = Object.keys(cat.completions);
  ok(ids.length === 44 && new Set(ids).size === 44, `the Worker knows exactly 44 course IDs, none repeated (${ids.length})`);
  const names = new Function('window', fs.readFileSync('public/assets/js/cts-cert-names.js', 'utf8') + '; return window.CTS_COURSE_NAMES;')({});
  ok(Object.keys(names).length === 44 && Object.keys(names).every((c) => cat.completions[c]),
    'the certificate names use the same 44 IDs', Object.keys(names).filter((c) => !cat.completions[c]).join(' '));
  const unitCodes = Object.values(cat.courses).map((c) => c.code);
  ok(unitCodes.every((c) => cat.completions[c]) && new Set(unitCodes).size === unitCodes.length,
    'every course with unit pages has one of those IDs, and no two share one');
  ok([...FOUNDATION, ...MDIV_CORE].every((c) => cat.completions[c]), 'the foundation and M.Div. core name only those IDs');
  const names2 = new Set(Object.values(cat.completions).map((c) => c.name));
  ok(names2.size === 44, 'and no two courses share a name', `${names2.size} distinct names`);
}

/* ---- the boundaries ------------------------------------------------------- */
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
const ALL = Object.keys(catalog.completions);
const electives = ALL.filter((c) => !MDIV_CORE.includes(c));
const at = (codes, track) => codes.map((code) => ({ code, track }));
const f7 = FOUNDATION, f6 = FOUNDATION.slice(0, 6);
const pick = (n, base) => [...base, ...ALL.filter((c) => !base.includes(c))].slice(0, n);
const core20 = MDIV_CORE;
const CASES = [
  // [label, degree, completions, earned?]
  ['Certificate: 6 foundations + 6 others = 12', 'certificate', at([...f6, ...electives.slice(0, 6)], 'cert'), false],
  ['Certificate: 7 foundations, 11 courses', 'certificate', at(pick(11, f7), 'cert'), false],
  ['Certificate: 7 foundations + 5 electives', 'certificate', at([...f7, ...electives.slice(0, 5)], 'cert'), true],
  ['Associate: 24 Associate-level courses', 'associate', at(pick(24, f7), 'assoc'), false],
  ['Associate: 25 Associate-level courses incl. the foundations', 'associate', at(pick(25, f7), 'assoc'), true],
  ['Associate: 25 Associate-level courses but a foundation missing', 'associate', at(pick(25, f6).filter((c) => c !== f7[6]).concat(electives[20]).slice(0, 25), 'assoc'), false],
  ['Associate: 25 Certificate-only courses', 'associate', at(pick(25, f7), 'cert'), false],
  ['Associate: 20 Associate-level + 5 master\'s-level', 'associate', [...at(pick(20, f7), 'assoc'), ...at(ALL.filter((c) => !pick(20, f7).includes(c)).slice(0, 5), 'mdiv')], true],
  ['Th.M.: 11 master\'s-level courses', 'thm', at(pick(11, f7), 'thm'), false],
  ['Th.M.: 12 master\'s-level, a foundation missing', 'thm', at(pick(13, f7).filter((c) => c !== f7[0]).slice(0, 12), 'thm'), false],
  ['Th.M.: 12 master\'s-level incl. the foundations', 'thm', at(pick(12, f7), 'thm'), true],
  ['Th.M.: 12 Certificate-level courses', 'thm', at(pick(12, f7), 'cert'), false],
  ['Th.M.: 12 Associate-level courses', 'thm', at(pick(12, f7), 'assoc'), false],
  ['M.Div.: 29 master\'s-level courses', 'mdiv', at(pick(29, core20), 'mdiv'), false],
  ['M.Div.: 30 master\'s-level, a core course missing', 'mdiv', at(pick(31, core20).filter((c) => c !== core20[19]).slice(0, 30), 'mdiv'), false],
  ['M.Div.: the 20-course core + 10 electives', 'mdiv', at([...core20, ...electives.slice(0, 10)], 'mdiv'), true],
  ['M.Div.: core on the Th.M. track + 10 on the M.Div.', 'mdiv', [...at(core20, 'thm'), ...at(electives.slice(0, 10), 'mdiv')], true],
  ['M.Div.: 30 Certificate-level courses', 'mdiv', at([...core20, ...electives.slice(0, 10)], 'cert'), false],
];
ok(electives.length >= 20, `enough elective courses to build the cases (${electives.length})`);
for (const [label, degree, list, want] of CASES) {
  ok(new Set(list.map((c) => c.code)).size === list.length, `${label}: the case has no duplicate courses`);
  const server = degreeShortfall(degree, list, 'cert') === null;
  ok(server === want, `Worker — ${label}: ${want ? 'earned' : 'not earned'}`, degreeShortfall(degree, list, 'cert'));
}

/* A completion with no recorded level counts at the student's own level --
   and a Certificate student's does not become Associate work. */
{
  const bare = pick(25, f7).map((code) => ({ code, track: null }));
  ok(degreeShortfall('associate', bare, 'cert') !== null, 'a Certificate student\'s unlevelled completions do not make an Associate');
  ok(degreeShortfall('associate', bare, 'assoc') === null, 'an Associate student\'s unlevelled completions (from before levels) do');
}

/* ---- in the browser: the same cases, and each diploma page ---------------- */
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const LIST = { cert: 'cts_done_codes', assoc: 'cts_assoc_done_codes', thm: 'cts_thm_done_codes', mdiv: 'cts_mdiv_done_codes' };
function seedFor(list, track = 'cert', goal) {
  const s = { cts_student: JSON.stringify({ name: 'Case Student', track, ...(goal ? { goal } : {}) }), cts_track: track,
              cts_done_codes: JSON.stringify(list.map((c) => c.code)), cts_assoc_done_codes: '[]', cts_thm_done_codes: '[]', cts_mdiv_done_codes: '[]' };
  for (const lv of ['assoc', 'thm', 'mdiv']) s[LIST[lv]] = JSON.stringify(list.filter((c) => c.track === lv).map((c) => c.code));
  // the names list a real browser also carries, which the pages once counted
  s.cts_degree_courses = JSON.stringify(list.map((c) => catalog.completions[c.code].name));
  return s;
}
const PAGE = { certificate: 'CTSCertificateOfMinistry.html', associate: 'CTSAssociateCertificate.html', thm: 'CTSThMCertificate.html', mdiv: 'CTSMDivCertificate.html' };
async function open(page, seed) {
  const ctx = await browser.newContext(); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${page}`); await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(300);
  return { ctx, p, errs };
}
const shown = (p) => p.evaluate(() => {
  const cert = document.getElementById('certCard');
  if (cert) return getComputedStyle(cert).display !== 'none';
  return /eligible/.test((document.getElementById('status') || {}).className || '');
});
const seenPage = new Set();
for (const [label, degree, list, want] of CASES) {
  const { ctx, p, errs } = await open(PAGE[degree], seedFor(list));
  const st = await p.evaluate((d) => (window.CTSDegrees ? window.CTSDegrees.status(d) : null), degree);
  ok(st && st.earned === want, `browser — ${label}: ${want ? 'earned' : 'not earned'}`, JSON.stringify(st ? { count: st.count, missing: st.missing } : 'the page does not load cts-degrees.js'));
  ok(await shown(p) === want, `${PAGE[degree]} — ${label}: the diploma is ${want ? 'shown' : 'not shown'}`);
  ok(!errs.length, `${PAGE[degree]}: no page errors`, errs.join(' | '));
  seenPage.add(PAGE[degree] + want);
  await ctx.close();
}
ok(seenPage.size === 8, 'every diploma page was opened on both sides of its boundary');

/* ---- the one-time Associate step ------------------------------------------- */
{
  const codes = pick(25, f7);
  const old = { cts_student: JSON.stringify({ name: 'Old Associate', track: 'cert', goal: 'assoc' }), cts_track: 'cert', cts_done_codes: JSON.stringify(codes) };
  const { ctx, p } = await open(PAGE.associate, old);
  const r = await p.evaluate(() => ({ list: JSON.parse(localStorage.getItem('cts_assoc_done_codes') || 'null'), st: window.CTSDegrees ? window.CTSDegrees.status('associate') : {} }));
  ok(r.list && r.list.length === 25 && r.st.earned, 'an old-site Associate student keeps the 25 courses already finished (the Associate then asked Certificate work)', JSON.stringify(r.st && r.st.count));
  await ctx.close();
  const cert = { ...old, cts_student: JSON.stringify({ name: 'Old Certificate', track: 'cert' }) };
  const c2 = await open(PAGE.associate, cert);
  const r2 = await c2.p.evaluate(() => ({ list: JSON.parse(localStorage.getItem('cts_assoc_done_codes') || 'null'), st: window.CTSDegrees ? window.CTSDegrees.status('associate') : {} }));
  ok(r2.list && r2.list.length === 0 && !r2.st.earned, 'an old-site Certificate student\'s courses do not become Associate work', JSON.stringify(r2));
  await c2.ctx.close();
}

/* ---- a new Associate completion is recorded at that level ------------------ */
{
  const { ctx, p } = await open('CTSActsUnit11.html', {
    cts_student: JSON.stringify({ name: 'New Associate', track: 'cert', goal: 'assoc' }), cts_track: 'cert', cts_goal: 'assoc',
    cts_acts_progress: JSON.stringify(Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`unit${i + 1}`, true]))),
  });
  await p.evaluate(() => { const U = window.CTS_UNIT;
    document.querySelectorAll('.question[data-mc]').forEach((q) => { const i = +q.dataset.mc; q.querySelector(`button.option[data-opt="${U.mc[i].answer}"]`)?.click(); });
    document.querySelectorAll('input[data-fill]').forEach((t) => { t.value = U.fill[+t.dataset.fill].answer.en; t.dispatchEvent(new Event('input', { bubbles: true })); });
    window.CTS_ENGINE.controls.submit().click(); });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ done: localStorage.getItem('cts_done_codes'), assoc: localStorage.getItem('cts_assoc_done_codes'), res: (window.CTS_ENGINE.controls.result() || {}).textContent }));
  ok(/passed|aprobada/i.test(r.res || ''), 'an Associate student passes the last unit with multiple choice and fill-ins, no short answer', (r.res || '').slice(0, 80));
  ok((r.done || '').includes('CTSACTS') && (r.assoc || '').includes('CTSACTS'), 'and the course is recorded at the Associate level', JSON.stringify(r));
  await ctx.close();
}
{
  const { ctx, p } = await open('CTSActsUnit11.html', {
    cts_student: JSON.stringify({ name: 'New Certificate', track: 'cert' }), cts_track: 'cert',
    cts_acts_progress: JSON.stringify(Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`unit${i + 1}`, true]))),
  });
  await p.evaluate(() => { const U = window.CTS_UNIT;
    document.querySelectorAll('.question[data-mc]').forEach((q) => { const i = +q.dataset.mc; q.querySelector(`button.option[data-opt="${U.mc[i].answer}"]`)?.click(); });
    window.CTS_ENGINE.controls.submit().click(); });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ done: localStorage.getItem('cts_done_codes'), assoc: localStorage.getItem('cts_assoc_done_codes') }));
  ok((r.done || '').includes('CTSACTS') && !(r.assoc || '').includes('CTSACTS'), 'a Certificate student\'s completion is not recorded at the Associate level', JSON.stringify(r));
  await ctx.close();
}

await browser.close();
console.log(`${checks} assertions on credential boundaries and completion levels`);
if (fails.length) { fails.forEach((f) => console.log('  FAIL: ' + f)); console.log(`FAIL — ${fails.length} of ${checks}`); process.exit(1); }
console.log('PASS — each course counts only at the level it was completed on, and every degree has the boundaries Dr. Cook set.');
