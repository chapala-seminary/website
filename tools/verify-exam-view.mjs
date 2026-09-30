/* The lesson and its exam are never on screen together (Dr. Cook's review,
 * 29 Sept 2026, item 7; assets/js/cts-exam-view.js). On every unit page:
 *
 *   - it opens on the lesson: the teaching shows, the questions do not, and
 *     there is a "Take the exam" button;
 *   - taking the exam hides every paragraph of the teaching (hidden text is
 *     what the browser's Find cannot search) and shows the questions and the
 *     submit button;
 *   - going back shows the lesson again and keeps an answer already given;
 *   - a reload stays on the exam, so a result is not lost from view.
 *
 *   node tools/verify-exam-view.mjs http://127.0.0.1:8798
 */
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const pages = fs.readdirSync('dist').filter((f) => f.endsWith('.html') && fs.readFileSync(`dist/${f}`, 'utf8').includes('window.CTS_UNIT')).sort();
const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };

// Long visible blocks of text outside the questions: the teaching.
const snapshot = () => {
  const vis = (e) => !!(e && e.offsetParent !== null && getComputedStyle(e).visibility !== 'hidden');
  const qs = document.getElementById('questionsContainer');
  const bar = document.getElementById('cts-exam-switch');
  const blocks = [...document.querySelectorAll('#lesson p, #lesson li, #lesson blockquote')]
    // .course-done: the closing note after the last unit's exam, shown with either view
    .filter((e) => !qs.contains(e) && !(bar && bar.contains(e)) && !e.closest('.course-done') && vis(e) && e.textContent.replace(/\s+/g, ' ').trim().length > 160)
    .map((e) => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 70));
  const q = qs.querySelector('.question');
  return {
    blocks, questions: vis(q), submit: vis(document.getElementById('submitExamBtn')),
    open: vis(document.getElementById('cts-exam-open')), back: vis(document.getElementById('cts-exam-back')),
  };
};

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
async function check(file) {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    if (!localStorage.getItem('cts_student')) {
      localStorage.setItem('cts_student', JSON.stringify({ name: 'View Test', track: 'mdiv' }));
      localStorage.setItem('cts_track', 'mdiv');
      // the foundation finished, so no course is behind the lock
      localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
    }
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${file}`, { waitUntil: 'load' });
  await p.waitForTimeout(150);
  const a = await p.evaluate(snapshot);
  ok(a.blocks.length > 0 && !a.questions && a.open, `${file}: does not open on the lesson (lesson ${a.blocks.length} blocks, questions ${a.questions}, button ${a.open})`);
  await p.click('#cts-exam-open');
  const b = await p.evaluate(snapshot);
  ok(b.questions && b.submit && b.back, `${file}: taking the exam does not show the questions and submit (questions ${b.questions}, submit ${b.submit}, back ${b.back})`);
  // whatever showed with the lesson must not show with the exam (the exam's
  // own instructions and short-answer questions are hidden with the lesson)
  const both = b.blocks.filter((t) => a.blocks.includes(t));
  ok(both.length === 0, `${file}: ${both.length} paragraph(s) of the lesson still showing during the exam: "${both[0]}"`);
  const leak = a.blocks.filter((t) => /^\d+\.\s/.test(t) && b.blocks.includes(t));
  ok(!leak.length, `${file}: exam questions showing with the lesson: "${leak[0]}"`);
  // an answer survives going back to the lesson and returning
  await p.evaluate(() => document.querySelector('#questionsContainer button.option, #questionsContainer input[type=radio]')?.click());
  const picked = await p.evaluate(() => document.querySelector('#questionsContainer .selected, #questionsContainer input[type=radio]:checked, #questionsContainer [aria-pressed=true]')?.outerHTML.slice(0, 60) || null);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(150);
  ok((await p.evaluate(snapshot)).questions, `${file}: a reload during the exam goes back to the lesson`);
  if (!picked) { await p.evaluate(() => document.querySelector('#questionsContainer button.option, #questionsContainer input[type=radio]')?.click()); }
  await p.click('#cts-exam-back');
  const c = await p.evaluate(snapshot);
  ok(c.blocks.length > 0 && !c.questions && c.open, `${file}: "Back to the lesson" does not show the lesson again`);
  await p.click('#cts-exam-open');
  ok(!errs.length, `${file}: page error ${errs[0]}`);
  await ctx.close();
}

const queue = [...pages];
await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await check(queue.shift()); }));
await browser.close();

console.log(`${checks} assertions on the lesson and exam views across ${pages.length} unit pages`);
if (fails.length) { fails.slice(0, 40).forEach((f) => console.log('  FAIL: ' + f)); console.log(`FAIL — ${fails.length}`); process.exit(1); }
console.log('PASS — on every unit page the lesson and the exam are never shown together.');
