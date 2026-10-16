/* Mobile Lighthouse on the six Phase 1 URLs. Writes docs/SEO-LIGHTHOUSE.md.
 * Enforces the requested budgets on a course landing and a lesson page.
 * Home is reported; its Performance score is a known limit of the inherited
 * front page (see docs/PLAN-cts-seo.md).
 *
 *   node tools/lighthouse-seo.mjs [base-url]
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const BASE = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const PAGES = [
  { id: 'home-en', path: '/', enforce: ['seo'] },
  { id: 'home-es', path: '/es/index.html', enforce: ['seo'] },
  { id: 'course-en', path: '/CTSNTCourse.html', enforce: ['performance', 'seo', 'accessibility', 'best-practices'] },
  { id: 'course-es', path: '/es/CTSNTCourse.html', enforce: ['performance', 'seo', 'accessibility', 'best-practices'] },
  { id: 'lesson-en', path: '/CTSNTUnit1.html', enforce: ['performance', 'seo', 'accessibility', 'best-practices'] },
  { id: 'lesson-es', path: '/es/CTSNTUnit1.html', enforce: ['performance', 'seo', 'accessibility', 'best-practices'] },
];
const BUDGET = { performance: 95, seo: 100, accessibility: 95, 'best-practices': 95, lcp: 2500, cls: 0.1 };

function run(url) {
  return new Promise((resolve, reject) => {
    const args = [
      'lighthouse', url,
      '--quiet', '--chrome-flags=--headless --no-sandbox --disable-gpu',
      '--output=json', '--output-path=stdout',
      '--only-categories=performance,seo,accessibility,best-practices',
      '--form-factor=mobile', '--screenEmulation.mobile=true',
    ];
    const child = spawn('npx', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    const out = [];
    const err = [];
    child.stdout.on('data', (c) => out.push(c));
    child.stderr.on('data', (c) => err.push(c));
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(Buffer.concat(err).toString() || `lighthouse exited ${code}`));
      resolve(JSON.parse(Buffer.concat(out).toString()));
    });
  });
}

const rows = [];
const fails = [];
for (const page of PAGES) {
  const json = await run(BASE + page.path);
  const score = (id) => Math.round((json.categories[id]?.score ?? 0) * 100);
  const lcp = json.audits['largest-contentful-paint']?.numericValue ?? 0;
  const cls = json.audits['cumulative-layout-shift']?.numericValue ?? 0;
  const row = {
    id: page.id, path: page.path,
    performance: score('performance'), seo: score('seo'),
    accessibility: score('accessibility'), bestPractices: score('best-practices'),
    lcp: Math.round(lcp), cls: Number(cls.toFixed(3)),
  };
  rows.push(row);
  for (const cat of page.enforce) {
    const got = cat === 'best-practices' ? row.bestPractices : row[cat];
    if (got < BUDGET[cat]) fails.push(`${page.id} ${cat} ${got} < ${BUDGET[cat]}`);
  }
  if (page.enforce.includes('performance')) {
    if (row.lcp > BUDGET.lcp) fails.push(`${page.id} LCP ${row.lcp}ms > ${BUDGET.lcp}ms`);
    if (row.cls > BUDGET.cls) fails.push(`${page.id} CLS ${row.cls} > ${BUDGET.cls}`);
  }
}

const md = `# Lighthouse (mobile) — Phase 1

Measured against a local build of this branch. Home Performance is reported
and not enforced: the inherited front page is a large inline document
(docs/PLAN-cts-seo.md). Course landings and a lesson page must meet the
budgets.

Budgets: Performance ≥95, SEO 100, Accessibility ≥95, Best Practices ≥95,
LCP <2.5s, CLS <0.1.

| Page | Perf | SEO | A11y | BP | LCP (ms) | CLS |
|---|---:|---:|---:|---:|---:|---:|
${rows.map((r) => `| ${r.id} \`${r.path}\` | ${r.performance} | ${r.seo} | ${r.accessibility} | ${r.bestPractices} | ${r.lcp} | ${r.cls} |`).join('\n')}

${fails.length ? `## Failed budgets\n\n${fails.map((f) => `- ${f}`).join('\n')}` : 'All enforced budgets passed.'}
`;
fs.writeFileSync('docs/SEO-LIGHTHOUSE.md', md);
console.log(md);
if (fails.length) process.exitCode = 1;
