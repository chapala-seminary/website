// Regression harness: render each unit page from the baseline tree and the
// consolidated tree, then compare rendered DOM, computed styles, console
// output, exam behaviour and persisted state.
//
// Anything that differs is reported. Nothing is assumed equivalent.

import { chromium } from 'playwright';

const BEFORE = 'http://127.0.0.1:8801';
const AFTER = 'http://127.0.0.1:8802';
const UNITS = Array.from({ length: 12 }, (_, i) => i + 1);

const STUDENT = JSON.stringify({
  name: 'Test Student', email: 'test@example.org', track: 'cert', country: 'MX',
});

function norm(html) {
  return String(html)
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .replace(/\b1[6-9]\d{11}\b/g, '<EPOCH>')      // Date.now() lock stamps
    .trim();
}

// show where two strings actually diverge instead of truncating at the front
function firstDiff(x, y) {
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  const s = Math.max(0, i - 90);
  return { at: i, before: x.slice(s, i + 130), after: y.slice(s, i + 130) };
}

async function probe(browser, base, unit, mode) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  await page.goto(`${base}/CTS1PeterUnit${unit}.html`, { waitUntil: 'load' });
  await page.evaluate(s => {
    localStorage.setItem('cts_student', s);
    localStorage.setItem('cts_track', 'cert');
  }, STUDENT);

  if (mode === 'unlocked') {
    await page.evaluate(() => localStorage.setItem('cts_done_codes',
      JSON.stringify(['CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK'])));
  }

  if (mode === 'passed') {
    await page.evaluate(u => {
      localStorage.setItem(`cts_1peter_u${u}_mc_passed`, '1');
      const p = {}; p[u] = true;
      localStorage.setItem('cts_1peter_progress', JSON.stringify(p));
    }, unit);
  }

  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(350);

  const snap = await page.evaluate(() => {
    const cs = el => {
      if (!el) return null;
      const c = getComputedStyle(el);
      return [c.fontFamily, c.fontSize, c.lineHeight, c.color, c.backgroundColor,
        c.padding, c.margin, c.borderRadius, c.maxWidth].join('|');
    };
    return {
      title: document.title,
      // scripts are deliberately relocated by the consolidation, so compare the
      // rendered document with all <script> elements removed
      body: (() => {
        const c = document.body.cloneNode(true);
        c.querySelectorAll('script').forEach(n => n.remove());
        return c.innerHTML;
      })(),
      bodyClass: document.body.className,
      grid: (document.getElementById('progressGrid') || {}).innerHTML || null,
      questions: (document.getElementById('questionsContainer') || {}).innerHTML || null,
      result: (document.getElementById('examResult') || {}).textContent || null,
      submitDisabled: (document.getElementById('submitExamBtn') || {}).disabled ?? null,
      styles: {
        body: cs(document.body),
        container: cs(document.querySelector('.container')),
        card: cs(document.querySelector('.card')),
        navbar: cs(document.querySelector('.nav-bar')),
        scripture: cs(document.querySelector('.scripture')),
        btn: cs(document.querySelector('.nav-btn')),
      },
      globals: ['UNIT', 'COURSE', 'NEXT_UNIT_URL', 'totalUnits', 'mcQuestions',
        'kwQuestions', 'unitTitlesEn', 'gradeMC', 'gradeSA', 'submitExam',
        'renderQuestions', 'resetUnit', 'saveState', 'checkLockouts']
        .map(n => { try { const v = eval(n); return n + ':' + (typeof v === 'function' ? 'fn' : Array.isArray(v) ? 'arr' + v.length : JSON.stringify(v)); } catch { return n + ':MISSING'; } }),
    };
  });

  // exercise the exam deterministically: pick option 0 on every MC question
  const behaviour = await page.evaluate(() => {
    const out = { clicked: 0 };
    document.querySelectorAll('.question').forEach(q => {
      const opt = q.querySelector('.option');
      if (opt) { opt.click(); out.clicked++; }
    });
    return out;
  });
  await page.waitForTimeout(120);
  // programmatic click: the curriculum lock overlay intercepts real pointer
  // events identically in both trees, and is not what we are testing here
  await page.evaluate(() => {
    const b = document.getElementById('submitExamBtn');
    if (b && !b.disabled) b.click();
  });
  await page.waitForTimeout(300);

  const after = await page.evaluate(() => ({
    result: (document.getElementById('examResult') || {}).textContent || null,
    questions: (document.getElementById('questionsContainer') || {}).innerHTML || null,
    ls: Object.fromEntries(Object.entries(localStorage).filter(([k]) => k.startsWith('cts_')).sort()),
  }));

  const shot = await page.screenshot({ fullPage: false });
  await ctx.close();
  return { errors, snap, behaviour, after, shot };
}

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
let failures = 0, checks = 0;
const report = [];

for (const mode of ['fresh', 'passed', 'unlocked']) {
  for (const unit of UNITS) {
    const b = await probe(browser, BEFORE, unit, mode);
    const a = await probe(browser, AFTER, unit, mode);
    const diffs = [];

    const cmp = (label, x, y) => {
      checks++;
      const xs = typeof x === 'string' ? norm(x) : norm(JSON.stringify(x));
      const ys = typeof y === 'string' ? norm(y) : norm(JSON.stringify(y));
      if (xs !== ys) {
        const d = firstDiff(xs, ys);
        diffs.push({ label: `${label} @${d.at}`, before: d.before, after: d.after });
      }
    };

    cmp('title', b.snap.title, a.snap.title);
    cmp('body.innerHTML', b.snap.body, a.snap.body);
    cmp('body.class', b.snap.bodyClass, a.snap.bodyClass);
    cmp('progressGrid', b.snap.grid, a.snap.grid);
    cmp('questions(initial)', b.snap.questions, a.snap.questions);
    cmp('examResult(initial)', b.snap.result, a.snap.result);
    cmp('submitDisabled', b.snap.submitDisabled, a.snap.submitDisabled);
    cmp('computedStyles', b.snap.styles, a.snap.styles);
    cmp('globals', b.snap.globals, a.snap.globals);
    cmp('optionsClicked', b.behaviour, a.behaviour);
    cmp('examResult(after submit)', b.after.result, a.after.result);
    cmp('questions(after submit)', b.after.questions, a.after.questions);
    cmp('localStorage', b.after.ls, a.after.ls);

    const pxSame = Buffer.compare(b.shot, a.shot) === 0;
    checks++;
    if (!pxSame) diffs.push({ label: 'screenshot', before: `${b.shot.length}B`, after: `${a.shot.length}B` });

    const newErrors = a.errors.filter(e => !b.errors.includes(e));
    checks++;
    if (newErrors.length) diffs.push({ label: 'new console errors', before: '', after: newErrors.join(' | ').slice(0, 220) });

    if (diffs.length) { failures++; report.push({ mode, unit, diffs }); }
    process.stdout.write(diffs.length ? 'X' : '.');
  }
}
await browser.close();

console.log('\n');
if (report.length === 0) {
  console.log(`PASS — ${checks} comparisons across 12 units x 3 states, zero differences.`);
} else {
  console.log(`FAIL — ${failures} page/state combinations differ (${checks} comparisons):\n`);
  for (const r of report) {
    console.log(`  unit ${r.unit} [${r.mode}]`);
    for (const d of r.diffs) {
      console.log(`    ${d.label}`);
      console.log(`      before: ${d.before}`);
      console.log(`      after : ${d.after}`);
    }
  }
  process.exitCode = 1;
}
