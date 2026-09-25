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
//   short answer   counts on Th.M. and M.Div., 90% of SA; not on the
//                  Certificate of Ministry or the Associate (Wayne's rule,
//                  25 Sept 2026: the Associate gets fill-ins instead, to come)
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

async function session(course, unit, track, nCorrect, fillSA = false) {
  const ctx = await browser.newContext();
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
    return u && { course: u.course, unit: u.unit, mc: (u.mc || []).map(q => q.answer), sa: (u.sa || []).filter(hasKw).length };
  });
  const rendered = await page.evaluate(() => document.querySelectorAll('.question[data-mc]').length);

  await page.evaluate(([n, fill]) => {
    const U = window.CTS_UNIT;
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
  }, [nCorrect, fillSA]);
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

  // 1. everything renders, no page errors
  const all = await session(course, unit, 'cert', nMc, true);
  ok(all.errs.length === 0, `${label}: page errors: ${all.errs.slice(0, 2).join(' | ')}`);
  ok(all.rendered === nMc, `${label}: rendered ${all.rendered} of ${nMc} MC questions`);
  ok(all.clickedSubmit, `${label}: no visible submit control for the student to press`);

  // 2. exactly the pass mark passes -- on the certificate track with NO short
  //    answer written, since short answer does not count there
  const atMark = await session(course, unit, 'cert', need, false);
  ok(/Passed|Aprobado/.test(atMark.result), `${label}: ${need}/${nMc} (the 90% mark) did not pass on cert with SA blank`);
  ok(atMark.ls[`cts_${slug}_progress`]?.includes(`unit${unit}`), `${label}: passing did not record progress`);

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

  // 5. short answer counts on the master's track: MC at the mark with SA
  //    blank fails (where the unit has SA); with SA written it passes
  if (probe.U.sa > 0) {
    const mdivNoSA = await session(course, unit, 'mdiv', need, false);
    ok(!/Passed|Aprobado/.test(mdivNoSA.result), `${label}: mdiv passed with short answer blank`);
    ok(/short answer|respuesta corta/i.test(mdivNoSA.result), `${label}: mdiv SA failure did not name short answer — "${mdivNoSA.result.slice(0, 80)}"`);
    ok(mdivNoSA.ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: mdiv MC pass not banked when SA failed`);
    ok(Object.keys(mdivNoSA.ls).some(k => /_sa_lock$/.test(k)), `${label}: mdiv SA failure did not apply an SA-only lock`);
  }
  // 5b. the Associate is graded like the Certificate: MC at the mark passes
  //     with short answer blank (Wayne's rule, 25 Sept 2026 -- fill-ins, not
  //     short answer, will be the Associate's extra requirement), and a miss
  //     gets the certificate lockout
  const assocNoSA = await session(course, unit, 'assoc', need, false);
  ok(/Passed|Aprobado/.test(assocNoSA.result), `${label}: associate did not pass with MC at mark and short answer blank — "${assocNoSA.result.slice(0, 80)}"`);
  const assocBelow = await session(course, unit, 'assoc', need - 1);
  ok(!/Passed|Aprobado/.test(assocBelow.result), `${label}: associate passed below the MC mark`);
  ok(/\b2 minute|2 minuto/.test(assocBelow.result), `${label}: associate lock not 2 minutes — "${assocBelow.result.slice(0, 80)}"`);
  const mdivSA = await session(course, unit, 'mdiv', need, true);
  ok(/Passed|Aprobado/.test(mdivSA.result), `${label}: mdiv did not pass with MC at mark and SA written — "${mdivSA.result.slice(0, 80)}"`);

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

await browser.close();
console.log(`${checks} policy assertions across ${SAMPLES.length} units of the BUILT site`);
if (!fails.length) console.log('PASS — the built site implements the agreed policy.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
