/* Shadow mode (docs/ai-grading.md section 1), in a browser, on the shadow
 * build: the pages keep their keys and the browser still grades -- and each
 * submitted unit, and each textbook test, is also posted to POST /api/shadow.
 *
 *   node test/shadow-mode.test.mjs <shadow-base-url>
 *
 * /api/shadow is answered by a stub here: the real route is on another branch.
 */
import { chromium } from 'playwright';
import { bankOf } from './lib/grading-stub.mjs';
import { singleSections } from '../tools/single-pages-lib.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:8813';
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const fails = []; let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d ? `\n        ${d}` : '')); };
const bank = bankOf('u:CTSJohn/1');

async function open(path) {
  const ctx = await browser.newContext();
  const posts = [];
  await ctx.route('**/api/shadow', async (r) => { posts.push(JSON.parse(r.request().postData())); await r.fulfill({ json: { ok: true } }); });
  await ctx.route('**/api/**', (r) => r.request().url().endsWith('/api/shadow') ? r.fallback() : r.fulfill({ json: { ok: true } }));
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('cts_exam_view:' + location.pathname, '1');
      localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
      localStorage.setItem('cts_student', JSON.stringify({ name: 'Shadow Student', email: 's@example.test', track: 'thm' })); localStorage.setItem('cts_track', 'thm');
      localStorage.setItem('cts_student_code', 'SHADOWCODE');
    } catch (e) {}
  });
  const p = await ctx.newPage();
  await p.goto(BASE + path, { waitUntil: 'load' });
  return { ctx, p, posts };
}

{
  const { ctx, p, posts } = await open('/CTSJohnUnit1.html');
  const U = await p.evaluate(() => window.CTS_UNIT);
  ok(U.mc[0].answer === bank.mc[0].answer && U.fill[0].answer.en === 'Genesis' && U.sa[0].model && !U.grading, 'a shadow page keeps its keys and says nothing about live grading');
  ok(await p.evaluate(() => !window.CTSGrading) && await p.locator('script[src*="cts-shadow.js"]').count() === 1, 'it loads the shadow hook and not the live client');
  await p.waitForSelector('.question[data-mc]');
  for (let i = 0; i < bank.mc.length; i++) await p.locator(`button.option[data-mc="${i}"][data-opt="${bank.mc[i].answer}"]`).click();
  // the browser grades as before: a right answer is marked at once, with no server
  ok(await p.locator('.question[data-mc="0"] .feedback-text.correct').count() === 1, 'the browser still marks a click itself');
  await p.locator('input[data-fill="0"]').fill('genesis'); await p.locator('input[data-fill="0"]').press('Enter');
  await p.locator('textarea[data-sa="0"]').fill('The Word was with God and was God, eternal, distinct from the Father.');
  await p.locator('#submitExamBtn').click();
  await p.waitForFunction(() => document.body.innerText.includes('Not yet'), null, { timeout: 5000 }).catch(() => {});
  await p.waitForTimeout(400);
  ok(posts.length === 1, 'one POST /api/shadow per submit', String(posts.length));
  const s = posts[0] || {};
  ok(s.code === 'SHADOWCODE' && s.scope === 'u:CTSJohn/1' && s.lang === 'en', 'it names the code, the scope and the language');
  ok(s.answers?.some((a) => a.qid === 'u:CTSJohn/1/mc/0' && a.choice === bank.mc[0].answer) && s.answers?.some((a) => a.qid === 'u:CTSJohn/1/fill/0' && a.answer === 'genesis') && s.answers?.some((a) => a.qid === 'u:CTSJohn/1/sa/0' && /Word was with God/.test(a.answer)), 'the answers go with their contract qids');
  ok(s.clientResult && s.clientResult.mc.right === bank.mc.length && s.clientResult.passed === false, 'and what this browser decided', JSON.stringify(s.clientResult));
  await ctx.close();
}
{
  const { ctx, p, posts } = await open('/CTSTextbookCultsTest.html');
  await p.waitForSelector('input[data-cts-fill]');
  const T = await p.evaluate(() => window.CTS_TEXTBOOK_TEST);
  ok(T.questions[0].answer && !T.grading, 'a shadow test page keeps its bank');
  const d = await p.evaluate(() => window.CTS_TEXTBOOK.draw());
  await p.locator('input[data-cts-fill="0"]').fill(T.questions[d[0]].answer.en);
  await p.locator('#tb-submit').click();
  await p.waitForTimeout(400);
  ok(posts.length === 1 && posts[0].scope === 'tb:cults' && posts[0].answers.some((a) => a.qid === `tb:cults/fill/${d[0]}`), 'a textbook test also posts to /api/shadow, by bank position', JSON.stringify(posts[0] || null).slice(0, 200));
  await ctx.close();
}
/* The single-page courses: the page and its own grading as they were, the hook posts the unit. */
{
  const sections = singleSections({ root: '.' });
  // Ethics: a page per unit
  const e = sections.find((x) => x.course === 'ethics' && x.unit === 1);
  {
    const { ctx, p, posts } = await open('/ethics_unit01.html');
    ok(await p.evaluate(() => mcQuestions[0].correct === 1 && typeof kwQuestions[0].modelEn === 'string' && !window.CTSSingleLive), 'a shadow Ethics page keeps its keys and its own engine');
    ok(await p.locator('script[src*="cts-shadow-single.js"]').count() === 1 && await p.locator('script[src*="cts-single-live.js"]').count() === 0, 'it carries the shadow hook and not the live engine');
    await p.waitForSelector('#questionsContainer .question');
    for (let i = 0; i < e.mc.length; i++) await p.locator('#questionsContainer .question').nth(i).locator('button.option').nth(e.mc[i].answer).click();
    await p.locator('.cts-fill-q input').first().fill(e.fill[0].answer.en);
    await p.locator('textarea.kw-answer').first().fill('x '.repeat(60) + 'god glory standard');
    await p.locator('#submitExamBtn').click();
    await p.waitForTimeout(500);
    ok(posts.length === 1 && posts[0].scope === 'sp:ethics_unit01' && posts[0].lang === 'en', 'Ethics: one POST /api/shadow per submit, for its scope', JSON.stringify(posts.map((x) => x.scope)));
    const a = posts[0]?.answers || [];
    ok(a.some((x) => x.qid === 'sp:ethics_unit01/mc/0' && x.choice === e.mc[0].answer) && a.some((x) => x.qid === 'sp:ethics_unit01/fill/0' && x.answer === e.fill[0].answer.en) && a.some((x) => x.qid === 'sp:ethics_unit01/sa/0' && /god glory/.test(x.answer)), 'the answers go with the contract question ids');
    ok(posts[0]?.clientResult?.mc?.right === 20 && posts[0].clientResult.mc.total === 20, 'and what this browser decided', JSON.stringify(posts[0]?.clientResult));
    await ctx.close();
  }
  // Counseling: a unit of one page
  const c = sections.find((x) => x.course === 'counseling' && x.unit === 1);
  {
    const { ctx, p, posts } = await open('/CTSCounseling.html');
    await p.waitForSelector('#mcq_1 .question-card');
    for (let i = 0; i < c.mc.length; i++) await p.locator(`#mcq_1 input[name="u1q${i}"][value="${c.mc[i].answer}"]`).check({ force: true });
    await p.locator('#fill_1 .cts-fill-q input').first().fill(c.fill[0].answer.en);
    await p.locator('#essay_1 textarea').first().fill('y '.repeat(60));
    await p.locator('button.submit-btn[onclick="submitUnit(1)"]').click();
    await p.waitForTimeout(500);
    ok(posts.length === 1 && posts[0].scope === 'sp:CTSCounseling-u1', 'Counseling: the unit posts to /api/shadow with its own scope', JSON.stringify(posts.map((x) => x.scope)));
    const a = posts[0]?.answers || [];
    ok(a.filter((x) => x.qid.startsWith('sp:CTSCounseling-u1/mc/')).length === 20 && a.some((x) => x.qid === 'sp:CTSCounseling-u1/fill/0' && x.answer === c.fill[0].answer.en) && a.some((x) => x.qid === 'sp:CTSCounseling-u1/sa/0'), 'with every answer under its question id');
    ok(posts[0]?.clientResult?.mc?.right === 20, 'and the browser\'s own result', JSON.stringify(posts[0]?.clientResult));
    await ctx.close();
  }
  // Narrative and WiseSpeak share the template: the hook is on their pages too
  for (const f of ['/CTS_Narrative_Preaching.html', '/fr/CTS_WiseSpeak_Preaching.html', '/es/ethics_unit05.html']) {
    const html = await (await fetch(BASE + f)).text();
    ok(html.includes('cts-shadow-single.js') && html.includes('CTS_SHADOW_SINGLE'), `${f}: carries the shadow hook`);
  }
}
await browser.close();
if (fails.length) { console.error(`FAIL — ${fails.length} of ${checks}:`); fails.forEach((f) => console.error('  ✗ ' + f)); process.exit(1); }
console.log(`PASS — ${checks} checks: the shadow build keeps its keys and posts to /api/shadow.`);
