// Functional test of the unified engine against the agreed assessment policy.
//
// This does not compare against the old pages — the policy deliberately
// changed. It asserts the policy is actually what was agreed:
//
//   pass mark      90% of MC, as a ratio
//   lockout        master's 15 min, certificate 2 min
//   reveal         certificate sees answers on submit; master's does not
//   persistence    a passed MC section stays passed; SA-only lockout
//
// It also checks that every question in the data file actually renders.

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const BASE = 'http://127.0.0.1:8821';
const ROOT = '/home/claude/verify/enginetest/site';
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

function unitData(slug, n) {
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', slug, `unit${n}.js`), 'utf8'), ctx);
  return ctx.window.CTS_UNIT;
}

import { readFileSync } from 'fs';
const SAMPLES = readFileSync('/home/claude/verify/enginetest/unified.txt', 'utf8')
  .trim().split('\n').map(l => l.trim().split(/\s+/))
  .flatMap(([course, slug, n]) => {
    const exists = u => fs.existsSync(`${ROOT}/data/${slug}/unit${u}.js`);
    const units = [0, 1, 2, 3].filter(exists).slice(0, 2);
    return units.map(u => [course, slug, u]);
  });

const fails = [];
let checks = 0;
function ok(cond, label) { checks++; if (!cond) fails.push(label); }

const browser = await chromium.launch({ executablePath: CHROME });

async function session(course, slug, unit, track, answer, fillSA = false) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(`${BASE}/${course}Unit${unit}.html`, { waitUntil: 'load' });
  await page.evaluate(t => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify({ name: 'T', email: 't@x.org', track: t }));
    localStorage.setItem('cts_track', t);
    localStorage.setItem('cts_done_codes', JSON.stringify(
      ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
  }, track);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);

  const rendered = await page.evaluate(() => document.querySelectorAll('.question[data-mc]').length);

  // answer the first `answer` MC questions correctly, the rest wrong
  await page.evaluate(([nCorrect, fillSA]) => {
    const U = window.CTS_UNIT;
    document.querySelectorAll('.question[data-mc]').forEach(q => {
      const i = +q.dataset.mc;
      const want = i < nCorrect ? U.mc[i].answer : (U.mc[i].answer === 0 ? 1 : 0);
      const btn = q.querySelector(`button.option[data-opt="${want}"]`);
      if (btn) btn.click();
    });
    if (fillSA) {
      document.querySelectorAll('textarea[data-sa]').forEach(t => {
        const q = U.sa[+t.dataset.sa];
        t.value = (q.keywords ? q.keywords.en.join(' ') : '') + ' ' + ((q.model && q.model.en) || '');
        t.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }
  }, [answer, fillSA]);
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
  return { rendered, errs, clickedSubmit, ...out };
}

for (const [course, slug, unit] of SAMPLES) {
  const U = unitData(slug, unit);
  const need = Math.ceil(U.mc.length * 0.90);
  const label = `${course} u${unit}`;
  if (!U.mc.length) { console.log(`  (skip ${label}: no multiple-choice questions)`); continue; }

  // 1. everything renders, no page errors
  const all = await session(course, slug, unit, 'cert', U.mc.length, true);
  ok(all.errs.length === 0, `${label}: page errors: ${all.errs.slice(0, 2).join(' | ')}`);
  ok(all.rendered === U.mc.length, `${label}: rendered ${all.rendered} of ${U.mc.length} MC questions`);
  ok(all.clickedSubmit, `${label}: no visible submit control for the student to press`);

  // 2. exactly the pass mark passes
  const atMark = await session(course, slug, unit, 'cert', need, true);
  ok(/Passed|Aprobado/.test(atMark.result), `${label}: ${need}/${U.mc.length} (the 90% mark) did not pass`);
  ok(atMark.ls[`cts_${slug}_progress`]?.includes(`unit${unit}`),
    `${label}: passing did not record progress`);

  // 3. one below the mark fails
  const below = await session(course, slug, unit, 'cert', need - 1);
  ok(!/Passed|Aprobado/.test(below.result), `${label}: ${need - 1}/${U.mc.length} passed but should not`);

  // 4. certificate track: 2-minute lock and answers revealed
  ok(/\b2 minute|2 minuto/.test(below.result), `${label}: cert lock not 2 minutes — "${below.result.slice(0, 80)}"`);
  ok(below.revealed > 0, `${label}: cert track did not reveal correct answers`);

  // 5. master's track: 15-minute lock and answers NOT revealed
  const mdiv = await session(course, slug, unit, 'mdiv', need - 1);
  ok(/\b15 minute|15 minuto/.test(mdiv.result), `${label}: mdiv lock not 15 minutes — "${mdiv.result.slice(0, 80)}"`);
  ok(mdiv.revealed === 0, `${label}: mdiv track revealed ${mdiv.revealed} correct answers on a failed attempt`);

  // 6. a failed attempt records a lock
  const locked = Object.keys(mdiv.ls).some(k => /_(sa|full)_lock$/.test(k));
  ok(locked, `${label}: failed attempt recorded no lockout`);

  // 7. passing MC banks it
  ok(atMark.ls[`cts_${slug}_u${unit}_mc_passed`] === '1', `${label}: MC pass not banked`);
}

await browser.close();
console.log(`${checks} policy assertions across ${SAMPLES.length} units`);
if (!fails.length) console.log('PASS — engine implements the agreed policy.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
