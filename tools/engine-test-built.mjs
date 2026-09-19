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
//   lockout        master's 15 min, certificate 2 min
//   reveal         certificate sees answers on submit; master's does not
//   persistence    a passed MC section stays passed; SA-only lockout

import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://127.0.0.1:8823';
const ROOT = './dist';
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const CORE = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

// Two units per course, the lowest-numbered that exist.
const byCourse = new Map();
for (const f of fs.readdirSync(ROOT).sort()) {
  const m = /^(CTS[A-Za-z0-9]*)Unit(\d+)\.html$/.exec(f);
  if (!m) continue;
  const [, course, n] = m;
  (byCourse.get(course) ?? byCourse.set(course, []).get(course)).push(+n);
}
const SAMPLES = [...byCourse].flatMap(([course, units]) =>
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
  await page.evaluate(([t, core]) => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify({ name: 'T', email: 't@x.org', track: t }));
    localStorage.setItem('cts_track', t);
    localStorage.setItem('cts_done_codes', JSON.stringify(core));
  }, [track, CORE]);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);

  // the unit as the STUDENT'S browser has it, not as the source tree has it
  const U = await page.evaluate(() => {
    const u = window.CTS_UNIT;
    return u && { course: u.course, unit: u.unit, mc: (u.mc || []).map(q => q.answer), sa: (u.sa || []).length };
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

  // 2. exactly the pass mark passes
  const atMark = await session(course, unit, 'cert', need, true);
  ok(/Passed|Aprobado/.test(atMark.result), `${label}: ${need}/${nMc} (the 90% mark) did not pass`);
  ok(atMark.ls[`cts_${slug}_progress`]?.includes(`unit${unit}`), `${label}: passing did not record progress`);

  // 3. one below the mark fails
  const below = await session(course, unit, 'cert', need - 1);
  ok(!/Passed|Aprobado/.test(below.result), `${label}: ${need - 1}/${nMc} passed but should not`);

  // 4. certificate track: 2-minute lock and answers revealed
  ok(/\b2 minute|2 minuto/.test(below.result), `${label}: cert lock not 2 minutes — "${below.result.slice(0, 80)}"`);
  ok(below.revealed > 0, `${label}: cert track did not reveal correct answers`);

  // 5. master's track: 15-minute lock and answers NOT revealed
  const mdiv = await session(course, unit, 'mdiv', need - 1);
  ok(/\b15 minute|15 minuto/.test(mdiv.result), `${label}: mdiv lock not 15 minutes — "${mdiv.result.slice(0, 80)}"`);
  ok(mdiv.revealed === 0, `${label}: mdiv track revealed ${mdiv.revealed} correct answers on a failed attempt`);

  // 6. a failed attempt records a lock
  ok(Object.keys(mdiv.ls).some(k => /_(sa|full)_lock$/.test(k)), `${label}: failed attempt recorded no lockout`);

  // 7. passing MC banks it
  ok(atMark.ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: MC pass not banked`);
}

await browser.close();
console.log(`${checks} policy assertions across ${SAMPLES.length} units of the BUILT site`);
if (!fails.length) console.log('PASS — the built site implements the agreed policy.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
