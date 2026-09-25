// Functional test of the unified engine against the agreed assessment policy,
// run against the BUILT site rather than the source data files.
//
// The Stage 1 version read data/<slug>/unit<n>.js off disk to know what the
// right answers were. After the Astro migration the data is inlined into the
// page, so that file no longer exists -- and reading the source instead of the
// build would be the same mistake as a checker that shares a bug with the
// thing it checks. This version asks the loaded page what it thinks its own
// questions are, which is exactly what the student's browser has.
//
//   pass mark      90% of MC, as a ratio
//   fill-ins       count on the Associate, Th.M. and M.Div., 9 of 10; on the
//                  Certificate they do not count and their answers are shown
//                  on submit (Wayne's rule, 25 Sept 2026)
//   short answer   counts on Th.M. and M.Div., 90% of SA; not on the
//                  Certificate of Ministry or the Associate
//   progress       cts_<course>_progress only when every part that counts
//                  on the track has passed
//   MC feedback    every question is corrected on click, on every track
//   lockout        master's 15 min, certificate 2 min
//   persistence    a passed MC section stays passed; SA-only lockout

import { chromium } from 'playwright';
import fs from 'fs';

// Takes the server as an argument like every other check here; the hardcoded
// port meant a run against a different server silently tested nothing but
// connection errors.
const BASE = process.argv[2] || 'http://127.0.0.1:8823';
const ROOT = './dist';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const CORE = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

// Two units per course, the lowest-numbered that exist.
const byCourse = new Map();
for (const f of fs.readdirSync(ROOT).sort()) {
  const m = /^(CTS[A-Za-z0-9]*)Unit(\d+)\.html$/.exec(f);
  if (!m) continue;
  const [, course, n] = m;
  (byCourse.get(course) ?? byCourse.set(course, []).get(course)).push(+n);
}
// ENGINE_TEST_COURSES=CTSCS,CTSActs narrows a run while working on the engine;
// the suite always runs everything.
const ONLY = (process.env.ENGINE_TEST_COURSES || '').split(',').filter(Boolean);
const SAMPLES = [...byCourse].filter(([c]) => !ONLY.length || ONLY.includes(c)).flatMap(([course, units]) =>
  units.sort((a, b) => a - b).slice(0, 2).map(u => [course, u]));

const fails = [];
let checks = 0;
function ok(cond, label) { checks++; if (!cond) fails.push(label); }

const browser = await chromium.launch({ executablePath: CHROME });

/* Most units have no fill-ins yet (CTS1Peter is the pilot), and a rule tested
   only on one course is a rule nobody will notice breaking on the other 39.
   So a unit that has none is given ten made-up ones before the engine reads
   it; a unit with real ones keeps them. `synthetic` in the result says which. */
const SYNTH_FILL = Array.from({ length: 10 }, (_, i) => ({
  prompt: { en: `Test sentence ${i + 1}: the ____ is here.`, es: `Frase de prueba ${i + 1}: el ____ está aquí.` },
  answer: { en: `Word ${i + 1}`, es: `Palabra ${i + 1}` },
  accept: i === 0 ? { en: ['first word'], es: ['primera palabra'] } : undefined,
}));
function injectFill(synth) {
  let held;
  Object.defineProperty(window, 'CTS_UNIT', {
    configurable: true,
    get() { return held; },
    set(v) { if (v && !(v.fill && v.fill.length)) { v.fill = synth; v._syntheticFill = true; } held = v; },
  });
}

async function session(course, unit, track, nCorrect, fillSA = false, fillN = 0) {
  const ctx = await browser.newContext();
  await ctx.addInitScript(injectFill, SYNTH_FILL);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(`${BASE}/${course}Unit${unit}.html`, { waitUntil: 'load' });
  // 'assoc' is how the front page registers an Associate: certificate rigor
  // (cts_track "cert") with the degree goal recorded beside it.
  await page.evaluate(([t, core]) => {
    localStorage.clear();
    const goal = t === 'assoc' ? 'assoc' : '';
    if (goal) t = 'cert';
    localStorage.setItem('cts_student', JSON.stringify({ name: 'T', email: 't@x.org', track: t, goal }));
    localStorage.setItem('cts_track', t);
    if (goal) localStorage.setItem('cts_goal', goal);
    localStorage.setItem('cts_done_codes', JSON.stringify(core));
  }, [track, CORE]);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);

  // the unit as the STUDENT'S browser has it, not as the source tree has it
  const U = await page.evaluate(() => {
    const u = window.CTS_UNIT;
    // sa counts only the short-answer questions the engine can grade: one
    // with no keywords is credited as written (Genesis has none), so a blank
    // answer cannot fail there and the SA rule is not testable on that unit.
    const hasKw = q => { const k = q.keywords; return Array.isArray(k) ? k.length > 0 : !!(k && ((k.en || []).length || (k.es || []).length)); };
    return u && { course: u.course, unit: u.unit, mc: (u.mc || []).map(q => q.answer), sa: (u.sa || []).filter(hasKw).length,
                  fill: (u.fill || []).length, synthetic: !!u._syntheticFill };
  });
  const rendered = await page.evaluate(() => document.querySelectorAll('.question[data-mc]').length);

  await page.evaluate(([n, fill, fN]) => {
    const U = window.CTS_UNIT;
    // the first fN fill-ins answered right (in English), the rest wrong
    document.querySelectorAll('input[data-fill]').forEach(t => {
      const i = +t.dataset.fill;
      t.value = i < fN ? U.fill[i].answer.en : 'not the answer';
      t.dispatchEvent(new Event('input', { bubbles: true }));
    });
    document.querySelectorAll('.question[data-mc]').forEach(q => {
      const i = +q.dataset.mc;
      const want = i < n ? U.mc[i].answer : (U.mc[i].answer === 0 ? 1 : 0);
      const btn = q.querySelector(`button.option[data-opt="${want}"]`);
      if (btn) btn.click();
    });
    if (fill) {
      document.querySelectorAll('textarea[data-sa]').forEach(t => {
        const q = U.sa[+t.dataset.sa];
        const kws = (q.keywords && q.keywords.en || []).flat().join(' ');
        t.value = kws + ' ' + ((q.model && q.model.en) || '');
        t.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }
  }, [nCorrect, fillSA, fillN]);
  await page.waitForTimeout(150);

  // Drive the control the STUDENT uses. This must never fall back to calling
  // the engine directly: doing so hid a course whose pages had no submit
  // control at all, which the policy suite then reported as passing.
  const clickedSubmit = await page.evaluate(() => {
    const b = window.CTS_ENGINE?.controls?.submit?.();
    if (!b || b.offsetParent === null) return false;
    b.click();
    return true;
  });
  await page.waitForTimeout(300);

  const out = await page.evaluate(() => ({
    result: (window.CTS_ENGINE?.controls?.result?.() || {}).textContent || '',
    revealed: document.querySelectorAll('button.option.correct').length,
    verdicts: document.querySelectorAll('.question[data-mc] .feedback-text').length,
    wrongMarked: document.querySelectorAll('button.option.wrong').length,
    fillRendered: document.querySelectorAll('.question[data-fill] input[data-fill]').length,
    // answers shown after submit: a "Correct" line or the right answer
    fillShown: document.querySelectorAll('.question[data-fill] .feedback, .question[data-fill] .feedback-text').length,
    ls: Object.fromEntries(Object.entries(localStorage).filter(([k]) => k.startsWith('cts_'))),
  }));
  await ctx.close();
  return { U, rendered, errs, clickedSubmit, ...out };
}

for (const [course, unit] of SAMPLES) {
  const label = `${course} u${unit}`;
  const probe = await session(course, unit, 'cert', 0);
  if (!probe.U) { fails.push(`${label}: page exposes no CTS_UNIT`); checks++; continue; }
  const slug = probe.U.course;
  const nMc = probe.U.mc.length;
  if (!nMc) { console.log(`  (skip ${label}: no multiple-choice questions)`); continue; }
  const need = Math.ceil(nMc * 0.90);

  const nFill = probe.U.fill, needF = Math.ceil(nFill * 0.90);
  const prog = (r) => !!r.ls[`cts_${slug}_progress`]?.includes(`"unit${unit}"`);
  if (!probe.U.synthetic) console.log(`  (${label}: real fill-ins, ${nFill})`);

  // 1. everything renders, no page errors
  const all = await session(course, unit, 'cert', nMc, true, nFill);
  ok(all.errs.length === 0, `${label}: page errors: ${all.errs.slice(0, 2).join(' | ')}`);
  ok(all.rendered === nMc, `${label}: rendered ${all.rendered} of ${nMc} MC questions`);
  ok(all.fillRendered === nFill, `${label}: rendered ${all.fillRendered} of ${nFill} fill-in questions`);
  ok(all.clickedSubmit, `${label}: no visible submit control for the student to press`);

  // 2. exactly the pass mark passes -- on the certificate track with NO
  //    fill-ins and NO short answer written, since neither counts there
  const atMark = await session(course, unit, 'cert', need, false);
  ok(/Passed|Aprobado/.test(atMark.result), `${label}: ${need}/${nMc} (the 90% mark) did not pass on cert with fill-ins and SA blank`);
  ok(prog(atMark), `${label}: passing did not record progress`);
  // on the Certificate the fill-in answers are shown on submit, for review
  ok(atMark.fillShown === nFill, `${label}: cert showed ${atMark.fillShown} of ${nFill} fill-in answers after submit`);

  // 3. one below the mark fails
  const below = await session(course, unit, 'cert', need - 1);
  ok(!/Passed|Aprobado/.test(below.result), `${label}: ${need - 1}/${nMc} passed but should not`);

  // 4. every question is corrected the moment it is clicked, on every track:
  //    a verdict line per question, the right option marked, wrong ones marked
  ok(below.verdicts === nMc, `${label}: cert track showed ${below.verdicts} of ${nMc} per-question verdicts`);
  ok(below.revealed === nMc, `${label}: cert track marked ${below.revealed} of ${nMc} correct options`);
  ok(below.wrongMarked === nMc - (need - 1), `${label}: cert track marked ${below.wrongMarked} wrong options, expected ${nMc - (need - 1)}`);
  ok(/\b2 minute|2 minuto/.test(below.result), `${label}: cert lock not 2 minutes — "${below.result.slice(0, 80)}"`);

  const mdiv = await session(course, unit, 'mdiv', need - 1);
  ok(mdiv.verdicts === nMc, `${label}: mdiv track showed ${mdiv.verdicts} of ${nMc} per-question verdicts`);
  ok(mdiv.revealed === nMc, `${label}: mdiv track marked ${mdiv.revealed} of ${nMc} correct options`);
  ok(/\b15 minute|15 minuto/.test(mdiv.result), `${label}: mdiv lock not 15 minutes — "${mdiv.result.slice(0, 80)}"`);

  // 5. short answer counts on the master's track: MC and fill-ins at the
  //    mark with SA blank fails (where the unit has SA); with SA written it
  //    passes
  if (probe.U.sa > 0) {
    const mdivNoSA = await session(course, unit, 'mdiv', need, false, nFill);
    ok(!/Passed|Aprobado/.test(mdivNoSA.result), `${label}: mdiv passed with short answer blank`);
    ok(!prog(mdivNoSA), `${label}: mdiv recorded the unit as passed with short answer blank`);
    ok(/short answer|respuesta corta/i.test(mdivNoSA.result), `${label}: mdiv SA failure did not name short answer — "${mdivNoSA.result.slice(0, 80)}"`);
    ok(mdivNoSA.ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: mdiv MC pass not banked when SA failed`);
    ok(Object.keys(mdivNoSA.ls).some(k => /_sa_lock$/.test(k)), `${label}: mdiv SA failure did not apply an SA-only lock`);
  }
  // 5b. the Associate: MC plus fill-ins, no short answer (Wayne's rule,
  //     25 Sept 2026). MC and fill-ins at the mark pass with short answer
  //     blank; one fill-in short fails, banks the MC pass, locks only the
  //     written part for the certificate 2 minutes, and records no progress
  const assocNoSA = await session(course, unit, 'assoc', need, false, needF);
  ok(/Passed|Aprobado/.test(assocNoSA.result), `${label}: associate did not pass with MC and fill-ins at the mark and short answer blank — "${assocNoSA.result.slice(0, 80)}"`);
  ok(prog(assocNoSA), `${label}: associate pass did not record progress`);
  const assocFill = await session(course, unit, 'assoc', need, false, needF - 1);
  ok(!/Passed|Aprobado/.test(assocFill.result), `${label}: associate passed with ${needF - 1}/${nFill} fill-ins`);
  ok(/fill in the blank|complete el espacio/i.test(assocFill.result), `${label}: associate fill-in failure did not name the fill-ins — "${assocFill.result.slice(0, 80)}"`);
  ok(!/short answer|respuesta corta/i.test(assocFill.result), `${label}: associate failure named short answer, which does not count there`);
  ok(!prog(assocFill), `${label}: associate recorded the unit as passed with the fill-ins failed`);
  ok(assocFill.ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: associate MC pass not banked when fill-ins failed`);
  ok(!!assocFill.ls[`cts_${slug}_u${unit}_sa_lock`] && !assocFill.ls[`cts_${slug}_u${unit}_full_lock`],
     `${label}: associate fill-in failure did not lock only the written part`);
  ok(/\b2 minute|2 minuto/.test(assocFill.result), `${label}: associate fill-in lock not 2 minutes`);
  ok(assocFill.fillShown === 0, `${label}: associate was shown ${assocFill.fillShown} fill-in answers before passing`);
  const assocBelow = await session(course, unit, 'assoc', need - 1, false, nFill);
  ok(!/Passed|Aprobado/.test(assocBelow.result), `${label}: associate passed below the MC mark`);
  ok(/\b2 minute|2 minuto/.test(assocBelow.result), `${label}: associate lock not 2 minutes — "${assocBelow.result.slice(0, 80)}"`);
  const mdivSA = await session(course, unit, 'mdiv', need, true, needF);
  ok(/Passed|Aprobado/.test(mdivSA.result), `${label}: mdiv did not pass with MC and fill-ins at the mark and SA written — "${mdivSA.result.slice(0, 80)}"`);
  ok(prog(mdivSA), `${label}: mdiv pass did not record progress`);

  // 5c. fill-ins count on both master's tracks too: everything else right
  //     and the fill-ins blank fails, with no progress written
  for (const t of ['mdiv', 'thm']) {
    const noFill = await session(course, unit, t, need, true, 0);
    ok(!/Passed|Aprobado/.test(noFill.result), `${label}: ${t} passed with the fill-ins blank`);
    ok(/fill in the blank|complete el espacio/i.test(noFill.result), `${label}: ${t} fill-in failure did not name the fill-ins`);
    ok(!prog(noFill), `${label}: ${t} recorded the unit as passed with the fill-ins blank`);
    ok(noFill.ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: ${t} MC pass not banked when fill-ins failed`);
  }

  // 6. a failed attempt records a lock
  ok(Object.keys(mdiv.ls).some(k => /_(sa|full)_lock$/.test(k)), `${label}: failed attempt recorded no lockout`);

  // 7. passing MC banks it
  ok(atMark.ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: MC pass not banked`);
}

// 8. an answered question stays answered for the attempt (the verdict shows
//    the key, so changing it would be free marks), and a reload after a failed
//    attempt starts fresh rather than showing a locked, fully-answered form
{
  const [course, unit] = SAMPLES[0];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${course}Unit${unit}.html`, { waitUntil: 'load' });
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('cts_track', 'cert'); });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);
  const changed = await page.evaluate(() => {
    const q = document.querySelector('.question[data-mc="0"]');
    q.querySelector('button.option[data-opt="0"]').click();
    document.querySelector('.question[data-mc="0"] button.option[data-opt="1"]').click();
    return document.querySelector('.question[data-mc="0"] button.option.selected')?.dataset.opt;
  });
  ok(changed === '0', `${course} u${unit}: an answered question could be changed (now ${changed})`);
  await page.evaluate(() => {
    document.querySelectorAll('.question[data-mc]').forEach(q => {
      const wrong = window.CTS_UNIT.mc[+q.dataset.mc].answer === 0 ? 1 : 0;
      const b = q.querySelector(`button.option[data-opt="${wrong}"]`); if (b && !q.querySelector('.selected')) b.click();
    });
    window.CTS_ENGINE.controls.submit().click();
  });
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => document.querySelectorAll('button.option.selected').length);
  ok(after === 0, `${course} u${unit}: reload after a failed attempt still showed ${after} answered questions`);
  await ctx.close();
}

// 9. the MC-banked, fill-in-failed lock, start to finish, on the Associate:
//    the retry after the lock needs only the fill-ins, and only then is the
//    unit recorded. Also the grader's edges: case and punctuation do not
//    matter, an accepted alternative counts, and "contains" is not enough.
{
  const [course, unit] = SAMPLES.find(([c]) => c === 'CTS1Peter') || SAMPLES[0];
  const label = `${course} u${unit} (lock)`;
  const ctx = await browser.newContext();
  await ctx.addInitScript(injectFill, SYNTH_FILL);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${course}Unit${unit}.html`, { waitUntil: 'load' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify({ name: 'T', track: 'cert', goal: 'assoc' }));
    localStorage.setItem('cts_track', 'cert'); localStorage.setItem('cts_goal', 'assoc');
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);
  const typeFill = (vals) => page.evaluate((vals) => {
    document.querySelectorAll('input[data-fill]').forEach(t => {
      t.value = vals[+t.dataset.fill]; t.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }, vals);
  const U = await page.evaluate(() => ({ course: window.CTS_UNIT.course, fill: window.CTS_UNIT.fill, mc: window.CTS_UNIT.mc.map(q => q.answer) }));
  const slug = U.course;

  // every answer the unit carries, in both languages, passes its own grader
  const graderOK = await page.evaluate(() => window.CTS_UNIT.fill.every(q =>
    [q.answer.en, q.answer.es, ...((q.accept || {}).en || []), ...((q.accept || {}).es || [])]
      .every(a => window.CTS_ENGINE.fillRight(q, a))));
  ok(graderOK, `${label}: a stored fill-in answer does not pass the engine's own grader`);
  const edges = await page.evaluate(() => {
    const q = window.CTS_UNIT.fill[0], r = window.CTS_ENGINE.fillRight;
    return { shout: r(q, '  ' + q.answer.en.toUpperCase() + '!! '), extra: r(q, q.answer.en + ' and more words'),
             blank: r(q, ''), es: r(q, q.answer.es) };
  });
  ok(edges.shout, `${label}: capitals, spaces or punctuation made a right fill-in wrong`);
  ok(!edges.extra, `${label}: an answer with extra words was accepted`);
  ok(!edges.blank, `${label}: a blank fill-in was accepted`);
  ok(edges.es, `${label}: the Spanish answer was not accepted`);

  // MC right, fill-ins half right: fail, MC banked, written part locked
  await page.evaluate((ans) => document.querySelectorAll('.question[data-mc]').forEach(q => {
    const b = q.querySelector(`button.option[data-opt="${ans[+q.dataset.mc]}"]`); if (b) b.click(); }), U.mc);
  await typeFill(U.fill.map((q, i) => i < 5 ? q.answer.en : 'wrong'));
  await page.evaluate(() => window.CTS_ENGINE.controls.submit().click());
  await page.waitForTimeout(200);
  let ls = await page.evaluate(() => ({ ...localStorage }));
  ok(ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: MC not banked`);
  ok(!!ls[`cts_${slug}_u${unit}_sa_lock`] && !ls[`cts_${slug}_u${unit}_full_lock`], `${label}: not an MC-banked, written-part-only lock`);
  ok(!(ls[`cts_${slug}_progress`] || '').includes(`"unit${unit}"`), `${label}: progress written with the fill-ins failed`);

  // still locked: a resubmit is refused and records nothing
  await typeFill(U.fill.map(q => q.answer.en));
  await page.evaluate(() => window.CTS_ENGINE.controls.submit().click());
  await page.waitForTimeout(200);
  const locked = await page.evaluate(() => window.CTS_ENGINE.controls.result().textContent);
  ok(/Locked|Bloqueado/.test(locked), `${label}: a resubmit inside the lock was not refused — "${locked.slice(0, 60)}"`);

  // lock expires. The saved MC answers are wiped too, so a pass now can come
  // only from the banked flag -- the fill-ins alone must be enough
  await page.evaluate(([lk, sk]) => {
    localStorage.setItem(lk, String(Date.now() - 1000));
    const st = JSON.parse(localStorage.getItem(sk) || '{}'); st.mcAnswers = null;
    localStorage.setItem(sk, JSON.stringify(st));
  }, [`cts_${slug}_u${unit}_sa_lock`, `cts_${slug}_u${unit}_state`]);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);
  await typeFill(U.fill.map(q => q.answer.en));
  await page.evaluate(() => window.CTS_ENGINE.controls.submit().click());
  await page.waitForTimeout(200);
  const res = await page.evaluate(() => window.CTS_ENGINE.controls.result().textContent);
  ls = await page.evaluate(() => ({ ...localStorage }));
  ok(/Passed|Aprobado/.test(res), `${label}: fill-ins alone did not pass after the lock with MC banked — "${res.slice(0, 60)}"`);
  ok((ls[`cts_${slug}_progress`] || '').includes(`"unit${unit}"`), `${label}: passing after the lock did not record progress`);
  await ctx.close();
}

await browser.close();
console.log(`${checks} policy assertions across ${SAMPLES.length} units of the BUILT site`);
if (!fails.length) console.log('PASS — the built site implements the agreed policy.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
