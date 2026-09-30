/* The fill-in-the-blank questions on the four courses that are not on the unit
 * engine -- Counseling, Narrative Preaching, WiseSpeak Preaching and Ethics --
 * checked the way engine-test-built.mjs checks them everywhere else.
 *
 * Each of these pages grades its own test, so the fill-ins had to be wired
 * into four different submit functions. What must hold on all of them:
 *
 *   - the grader is the engine's, word for word (cts-fill.js is compared with
 *     cts-engine.js), and every stored answer passes it;
 *   - Certificate: the fill-ins never decide a pass;
 *   - Associate: 9 of 10 passes, 8 of 10 fails, and a failed set is shown for
 *     review, locked, and opens again empty once the lock is over;
 *   - master's tracks: the fill-ins are needed as well;
 *   - a checked answer survives a reload and cannot be changed;
 *   - a student's saved progress from before the fill-ins existed still loads,
 *     and a unit already passed stays passed.
 *
 *   node tools/verify-fill-single.mjs http://127.0.0.1:8798
 */
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const fails = [];
let checks = 0;
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

// ---- static: one grader, the engine's --------------------------------------
const fnSource = (src, name) => (new RegExp(`\\n  function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n  \\}`).exec(src) || [''])[0];
const engine = fs.readFileSync('public/assets/js/cts-engine.js', 'utf8');
const widget = fs.readFileSync('public/assets/js/cts-fill.js', 'utf8');
for (const f of ['normalise', 'fold', 'bare', 'fillRight']) {
  ok(fnSource(engine, f) && fnSource(engine, f) === fnSource(widget, f),
    `cts-fill.js ${f}() is cts-engine.js's own, word for word`);
}
const { fillRight } = new Function(`${fnSource(engine, 'normalise')}\n${fnSource(engine, 'fold')}\n${fnSource(engine, 'bare')}\n${fnSource(engine, 'fillRight')}\nreturn { fillRight };`)();

const COURSES = {
  counseling: { units: 11, pages: ['CTSCounseling.html'] },
  narrative: { units: 8, pages: ['CTS_Narrative_Preaching.html'] },
  wisespeak: { units: 10, pages: ['CTS_WiseSpeak_Preaching.html'] },
  ethics: { units: 10, pages: Array.from({ length: 10 }, (_, i) => `ethics_unit${String(i + 1).padStart(2, '0')}.html`) },
};
for (const [key, c] of Object.entries(COURSES)) {
  const win = {};
  new Function('window', fs.readFileSync(`public/assets/js/fill/${key}.js`, 'utf8'))(win);
  const data = win.CTS_FILL_DATA?.[key] || {};
  ok(Object.keys(data).length === c.units, `${key}: questions for all ${c.units} units`, `found ${Object.keys(data).length}`);
  for (const [u, qs] of Object.entries(data)) {
    ok(qs.length === 10, `${key} unit ${u}: ten questions`, `found ${qs.length}`);
    for (const q of qs) for (const lang of ['en', 'es']) {
      for (const v of [q.answer[lang], ...(q.accept?.[lang] || [])]) {
        if (!fillRight(q, v)) ok(false, `${key} unit ${u}: "${v}" is marked wrong by the engine's grader`);
      }
    }
  }
  for (const p of c.pages) {
    const html = fs.readFileSync(`public/${p}`, 'utf8');
    const a = html.match(/assets\/js\/cts-fill\.js\?v=([\w.-]+)/), b = html.match(new RegExp(`assets/js/fill/${key}\\.js\\?v=([\\w.-]+)`));
    ok(a && b, `${p} loads cts-fill.js and fill/${key}.js`);
    ok(!/fill-in-the-blank questions they answer in other courses will be added/.test(html), `${p} no longer promises the fill-ins for later`);
  }
}

// ---- in a browser --------------------------------------------------------------
/* Each page grades differently, so each gets a small driver: how to register a
   student on a track, answer the multiple choice correctly, submit, and read
   back the result. Everything else is the same test. */
const TRACK = {
  single: { cert: 'cert', assoc: 'cert', mdiv: 'mdiv' },
  ethics: { cert: 'certificate', assoc: 'certificate', mdiv: 'mdiv' },
};
const single = (key, page, regKey, extra = {}) => ({
  key, page, unit: 1, host: '#fill_1 .cts-fill',
  async register(p, track) {
    await p.evaluate(([regKey, t, goal, extra]) => {
      localStorage.clear();
      const who = { name: 'Fill Test', email: 'fill-test@example.invalid', country: 'MX' };
      localStorage.setItem('cts_student', JSON.stringify({ ...who, track: t === 'cert' ? 'certificate' : t }));
      if (goal) localStorage.setItem('cts_goal', goal);
      localStorage.setItem(regKey, JSON.stringify({ ...who, track: t }));
      for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
    }, [regKey, TRACK.single[track], track === 'assoc' ? 'assoc' : '', extra]);
  },
  answerMC: (p) => p.evaluate(() => { state.unitState[1].mcq = UNITS[1].mcq.map((q) => q.correct); saveState(); }),
  submit: (p) => p.evaluate(() => submitUnit(1)),
  passed: (p) => p.evaluate(() => !!state.unitState[1].passed),
  endLock: (p) => p.evaluate(() => { state.unitState[1].lockedUntil = Date.now() - 1000; saveState(); FILL[1].render(); }),
  saved: (p) => p.evaluate((k) => (JSON.parse(localStorage.getItem(k) || '{}')[1]) || {}, regKey.replace('_reg', '_state')),
  oldState: (p) => p.evaluate((k) => {
    const s = {}; s[1] = { mcq: UNITS[1].mcq.map((q) => q.correct), passed: true, score: 100 };
    localStorage.setItem(k, JSON.stringify(s));
  }, regKey.replace('_reg', '_state')),
});
const DRIVERS = [
  single('counseling', 'CTSCounseling.html', 'cts_drakeford_reg'),
  single('narrative', 'CTS_Narrative_Preaching.html', 'cts_storytel_reg'),
  single('wisespeak', 'CTS_WiseSpeak_Preaching.html', 'cts_wisespeak_reg', { cts_wisespeak_layout: '2' }),
  {
    key: 'ethics', page: 'ethics_unit01.html', unit: 1, host: '#questionsContainer .cts-fill',
    async register(p, track) {
      await p.evaluate(([t, goal]) => {
        localStorage.clear();
        localStorage.setItem('cts_student', JSON.stringify({ name: 'Fill Test', email: 'fill-test@example.invalid', track: t }));
        if (goal) localStorage.setItem('cts_goal', goal);
      }, [TRACK.ethics[track], track === 'assoc' ? 'assoc' : '']);
    },
    answerMC: (p) => p.evaluate(() => { mcAnswers = mcQuestions.map((q) => String.fromCharCode(65 + q.correct)); saveState(); renderQuestions(); }),
    // the course-order overlay covers the page for a student with no foundation courses;
    // the button's own handler is what is under test
    submit: (p) => p.evaluate(() => document.getElementById('submitExamBtn').onclick()),
    passed: (p) => p.evaluate(() => !!JSON.parse(localStorage.getItem('cts_ethics_progress') || '{}').unit1),
    endLock: (p) => p.evaluate(() => {
      localStorage.setItem('cts_ethics_u1_sa_lockout', String(Date.now() - 1000));
      localStorage.setItem('cts_ethics_u1_lockout', String(Date.now() - 1000));
      FILL.render(); checkLockouts();
    }),
    saved: (p) => p.evaluate(() => JSON.parse(localStorage.getItem('cts_ethics_u1_state') || '{}')),
    oldState: (p) => p.evaluate(() => {
      localStorage.setItem('cts_ethics_u1_state', JSON.stringify({ mcAnswers: new Array(20).fill('A'), kwAnswers: new Array(10).fill('') }));
      localStorage.setItem('cts_ethics_progress', JSON.stringify({ unit1: true }));
      localStorage.setItem('cts_ethics_u1_mc_passed', 'true');
    }),
  },
];

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

async function open(d, track, prepare) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('dialog', (dl) => dl.accept());
  await p.goto(`${BASE}/${d.page}`, { waitUntil: 'load' });
  await d.register(p, track);
  if (prepare) await prepare(p);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(300);
  return { p, ctx, errs };
}
const qs = (p, d) => p.evaluate(([k, u]) => window.CTS_FILL_DATA[k][u], [d.key, d.unit]);
async function answerFill(p, d, right) {
  const list = await qs(p, d);
  for (let i = 0; i < list.length; i++) {
    const input = p.locator(`${d.host} input[data-cts-fill="${i}"]`);
    if (!(await input.count()) || await input.isDisabled()) { ok(false, `${d.key}: fill-in ${i + 1} is open to answer`); return; }
    await input.fill(i < right ? list[i].answer.en : 'zzz wrong');
    await input.press('Enter');
  }
}
const view = (p, d) => p.evaluate((sel) => {
  const box = document.querySelector(sel);
  if (!box) return null;
  const ins = [...box.querySelectorAll('input[data-cts-fill]')];
  return { n: ins.length, disabled: ins.filter((i) => i.disabled).length, filled: ins.filter((i) => i.value).length,
           marks: box.querySelectorAll('.cts-fill-ok, .cts-fill-bad').length, text: box.textContent };
}, d.host);

for (const d of DRIVERS) {
  const at = (s) => `${d.key}: ${s}`;

  // Certificate: the fill-ins are review only
  {
    const { p, ctx, errs } = await open(d, 'cert');
    const v = await view(p, d);
    ok(v && v.n === 10, at('ten fill-ins are drawn under the multiple choice'), JSON.stringify(v && v.n));
    ok(v && /do not count on the Certificate/.test(v.text), at('the Certificate student is told they do not count'));
    await d.answerMC(p);
    await answerFill(p, d, 0);
    await d.submit(p);
    ok(await d.passed(p), at('Certificate: multiple choice alone passes, every fill-in wrong'));
    ok(!errs.length, at('no page errors (Certificate)'), errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // Associate: 8 of 10 fails, is shown for review, locks, then opens empty
  {
    const { p, ctx, errs } = await open(d, 'assoc');
    const v0 = await view(p, d);
    ok(v0 && /You need 9 of 10/.test(v0.text), at('the Associate student is told 9 of 10 are needed'));
    await d.answerMC(p);
    await answerFill(p, d, 8);
    const checked = await view(p, d);
    ok(checked.disabled === 10 && checked.marks === 10, at('Check marks each fill-in at once and fixes it'), JSON.stringify(checked));
    await d.submit(p);
    ok(!(await d.passed(p)), at('Associate: 8 of 10 fill-ins fails the unit'));
    const review = await view(p, d);
    ok(review.disabled === 10 && review.marks === 10 && review.filled === 10, at('a failed set stays on screen for review, locked'), JSON.stringify(review));
    const saved = await d.saved(p);
    ok(Array.isArray(saved.fillAnswers) && saved.fillAnswers.every((a) => !a), at('the failed answers are not kept for the next attempt'), JSON.stringify(saved.fillAnswers));
    await d.endLock(p);
    const fresh = await view(p, d);
    ok(fresh.disabled === 0 && fresh.filled === 0 && fresh.marks === 0, at('after the lock the fill-ins open again, empty'), JSON.stringify(fresh));
    await d.answerMC(p);
    await answerFill(p, d, 9);
    await d.submit(p);
    ok(await d.passed(p), at('Associate: 9 of 10 fill-ins passes'));
    ok(!errs.length, at('no page errors (Associate)'), errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // master's: the fill-ins are needed too; a checked answer survives a reload
  {
    const { p, ctx, errs } = await open(d, 'mdiv');
    await d.answerMC(p);
    const list = await qs(p, d);
    const first = p.locator(`${d.host} input[data-cts-fill="0"]`);
    await first.fill(list[0].answer.es);
    await first.press('Enter');
    await p.reload({ waitUntil: 'load' });
    await p.waitForTimeout(300);
    const kept = await view(p, d);
    ok(kept.disabled === 1 && kept.marks === 1, at('a checked fill-in is still checked after a reload'), JSON.stringify(kept));
    ok(/Correct/.test(kept.text), at('an answer in Spanish is marked right'));
    await d.answerMC(p);
    for (let i = 1; i < 10; i++) {
      const input = p.locator(`${d.host} input[data-cts-fill="${i}"]`);
      if (await input.isDisabled()) { ok(false, at(`fill-in ${i + 1} is open to answer`)); break; }
      await input.fill('zzz wrong'); await input.press('Enter');
    }
    await d.submit(p);
    ok(!(await d.passed(p)), at('M.Div.: the unit is not passed with the fill-ins failed'));
    ok(!errs.length, at('no page errors (M.Div.)'), errs.slice(0, 2).join(' | '));
    await ctx.close();
  }

  // saved progress from before the fill-ins: still loads, still passed
  {
    const { p, ctx, errs } = await open(d, 'assoc', d.oldState);
    ok(await d.passed(p), at('a unit passed before the fill-ins existed is still passed'));
    const v = await view(p, d);
    ok(v && v.n === 10 && v.disabled === 10, at('its fill-ins are shown as done, not asked for'), JSON.stringify(v));
    ok(!errs.length, at('no page errors (old saved state)'), errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
}

await browser.close();
console.log(`${checks} assertions on the fill-ins of the four single-page courses`);
if (fails.length) {
  fails.forEach((f) => console.log('  FAIL: ' + f));
  console.log(`FAIL — ${fails.length} of ${checks}`);
  process.exit(1);
}
console.log('PASS — the single-page courses grade fill-ins as the unit engine does.');
