// Returning students from the old site: their browser is the only complete
// record of what they finished (Dr. Cook's review, 29 Sept 2026, items 4-5:
// the old "CTS Completions" Sheet has 26 rows, none for two of these three).
// Three students modelled on the ones in Dr. Cook's tracker, with invented
// names: each browser is seeded the way the old site left it, opens the new
// site once, and the record the seminary ends up with is checked --
// units, completed courses, the level of each, the foundation count, the
// catalog, program progress, degree eligibility, no duplicates, and exactly
// one notice to the seminary for the whole history. Then a second visit must
// change nothing and tell the seminary nothing.
//
//   node test/migration.test.mjs          (API_BASE defaults to http://127.0.0.1:8799)
import crypto from 'node:crypto';
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8799';
const CHROME = process.env.CHROME_PATH;
let checks = 0;
const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
const slugOf = Object.fromEntries(Object.entries(catalog.courses).map(([slug, c]) => [c.code, slug]));
const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

/* The staff roster, signed in the way test/staff.test.mjs signs in. */
const { key: JWK } = JSON.parse(fs.readFileSync('test/fixtures/access-test-key.json', 'utf8'));
const b64 = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');
const head = b64({ alg: 'RS256', kid: 'cts-test-1', typ: 'JWT' });
const body = b64({ aud: ['cts-test-aud'], iss: 'https://cts-test.cloudflareaccess.com', exp: Math.floor(Date.now() / 1000) + 3600, email: 'staff@example.test' });
const TOKEN = `${head}.${body}.${crypto.sign('sha256', Buffer.from(`${head}.${body}`), crypto.createPrivateKey({ key: JWK, format: 'jwk' })).toString('base64url')}`;
const roster = async () => (await fetch(`${BASE}/staff/students.json`, { headers: { 'cf-access-jwt-assertion': TOKEN } })).json();

/* A browser as the old site left it. `recorded`: courses whose certificate page
   was opened, so the old site wrote their code (and sent a notice); `unrecorded`:
   every unit passed, certificate page never opened -- no code, no notice.
   `mdiv`: codes the old certificate pages also put on the M.Div. list. */
function oldBrowser({ name, track, goal, recorded, unrecorded, mdiv = [] }) {
  const seed = {
    cts_student: JSON.stringify({ name, email: `${name.split(' ')[0].toLowerCase()}@example.test`, country: 'MX', track, ...(goal ? { goal } : {}) }),
    cts_track: track, ...(goal ? { cts_goal: goal } : {}),
    cts_done_codes: JSON.stringify(recorded),
    cts_degree_courses: JSON.stringify(recorded.map((c) => catalog.completions[c].name)),
  };
  if (mdiv.length) seed.cts_mdiv_done_codes = JSON.stringify(mdiv);
  const units = {};
  for (const code of [...recorded, ...unrecorded]) {
    if (code === 'WISESPEAK') {                        // Preaching as it was: nine units, before unit 7 was added
      const ws = {}; for (let i = 1; i <= 9; i++) ws[i] = { passed: true };
      seed.cts_wisespeak_state = JSON.stringify(ws); continue;
    }
    const slug = slugOf[code]; if (!slug) continue;    // a single-page course: its code is the record
    const pr = {}; for (const u of catalog.courses[slug].units) pr[`unit${u}`] = true;
    units[slug] = catalog.courses[slug].units.length;
    // Evangelism's old engine kept its progress under its own name
    seed[slug === 'evangelism' ? 'cts_ev_progress' : `cts_${slug}_progress`] = JSON.stringify(pr);
    for (const u of catalog.courses[slug].units) if (slug === 'evangelism') seed[`cts_ev_u${u}_mc_passed`] = '1';
  }
  return { seed, units };
}

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

async function visit(ctx, path = '/index.html') {
  const p = await ctx.newPage();
  const syncs = [], posts = [];
  p.on('response', async (r) => { if (/\/api\/sync$/.test(r.url())) { try { syncs.push(await r.json()); } catch {} } });
  await p.route('https://script.google.com/**', (r) => { posts.push(r.request().postData()); r.fulfill({ status: 200, body: '' }); });
  await p.goto(BASE + path, { waitUntil: 'load' });
  // the sync client registers, then uploads; wait until it has been quiet a while
  let last = -1;
  for (let i = 0; i < 40; i++) { await p.waitForTimeout(500); if (syncs.length && syncs.length === last) break; last = syncs.length; }
  await p.waitForTimeout(800);
  return { p, syncs, posts };
}

async function run(label, spec, expect) {
  const { seed, units } = oldBrowser(spec);
  const ctx = await browser.newContext();
  await ctx.addInitScript((s) => {
    if (localStorage.getItem('cts_student')) return;   // seeded once per browser, not per tab
    for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
  }, seed);

  const first = await visit(ctx);
  const local = await first.p.evaluate(() => ({
    done: JSON.parse(localStorage.getItem('cts_done_codes') || '[]'),
    code: localStorage.getItem('cts_student_code') || Object.keys(localStorage).filter((k) => /code/i.test(k)).map((k) => localStorage.getItem(k)).find((v) => /^CTS-/.test(v || '')),
    locked: document.querySelectorAll('a.course.cts-locked').length,
  }));
  const all = [...spec.recorded, ...spec.unrecorded];
  ok(all.every((c) => local.done.includes(c)) && local.done.length === all.length,
    `${label}: every finished course is recorded in the browser (${local.done.length} of ${all.length})`,
    `missing: ${all.filter((c) => !local.done.includes(c)).join(' ')}`);
  ok(expect.unlocked ? local.locked === 0 : local.locked > 0, `${label}: the catalog is ${expect.unlocked ? 'open' : 'locked'} (${local.locked} locked cards)`);
  ok(/^CTS-/.test(local.code || ''), `${label}: the browser was given a student code without being asked (${local.code})`);

  const st = (await (await fetch(`${BASE}/api/student/${local.code}`)).json());
  const comp = Object.fromEntries((st.completions || []).map((c) => [c.code, c.track]));
  ok((st.completions || []).length === all.length && new Set((st.completions || []).map((c) => c.code)).size === all.length,
    `${label}: the seminary holds each course once (${(st.completions || []).length} of ${all.length})`);
  for (const [code, lv] of Object.entries(expect.levels))
    ok(comp[code] === lv, `${label}: ${code} is held at the ${lv} level`, `held: ${comp[code]}`);
  const unitTotal = Object.values(units).reduce((a, b) => a + b, 0);
  ok((st.progress || []).length === unitTotal, `${label}: every unit passed is held (${(st.progress || []).length} of ${unitTotal})`);
  for (const [deg, want] of Object.entries(expect.degrees))
    ok(st.degrees[deg] === want, `${label}: ${deg} ${want ? 'is' : 'is not'} supported by the record`, JSON.stringify(st.degrees));

  const told = first.syncs.flatMap((r) => r.notifications || []).filter((n) => n.kind === 'course');
  ok(told.length === all.length && told.every((n) => n.batch === all.length && n.status === 'sent'),
    `${label}: the seminary is told of the whole history in one notice (${told.length} courses; batches ${[...new Set(told.map((n) => n.batch))]})`);
  ok(first.posts.length === 0, `${label}: nothing is posted to the old Apps Script Sheet (${first.posts.length})`);

  const row = (await roster()).find((r) => r.name === spec.name);
  ok(row && row.foundation === `${expect.foundation}/7` && row.program_progress === expect.progress,
    `${label}: the staff roster shows foundation ${expect.foundation}/7 and ${expect.progress} toward the program`, JSON.stringify(row && { foundation: row.foundation, progress: row.program_progress, notices: row.notices }));

  const second = await visit(ctx);
  const st2 = (await (await fetch(`${BASE}/api/student/${local.code}`)).json());
  ok((st2.completions || []).length === all.length && (st2.progress || []).length === unitTotal, `${label}: a second visit adds nothing`);
  { const n2 = second.syncs.flatMap((r) => r.notifications || []); ok(n2.length === 0, `${label}: and tells the seminary nothing`, JSON.stringify(n2).slice(0, 400)); }
  await ctx.close();
}

// Paul: Certificate of Ministry. Eight courses reached the inbox; OT Survey,
// NT Survey and Preaching were finished but never recorded, so his catalog
// stayed locked. Evangelism's progress is under its old storage names.
await run('Paul', {
  name: 'Paulo Migrante', track: 'cert',
  recorded: ['CTSST', 'CTSCH', 'CTSEVANGELISM', 'CTSPM', 'CTSDEACONFAMILYMINISTRY', 'CTSJOSH', 'CTSPENT', 'CTSPSALMS'],
  unrecorded: ['CTSOTS', 'CTSNT', 'WISESPEAK'],
}, {
  unlocked: true, foundation: 7, progress: '11/12',
  levels: { CTSOTS: 'cert', CTSNT: 'cert', WISESPEAK: 'cert', CTSEVANGELISM: 'cert' },
  degrees: { certificate: false, associate: false },
});

// Ignacio: Associate of Divinity, 25 courses; only 11 were ever recorded.
const IG_REC = ['CTSBIBLE', 'CTSOTS', 'CTSST', 'CTSJOSH', 'CTSLOC', 'CTS1PETER', 'CTSGENESIS', 'CTSBIBLECHARACTERS', 'CTSBIBLECHARACTERS2', 'CTSPENTECOSTAL', 'CTSAPOL'];
const IG_UNREC = ['CTSNT', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK', 'CTSACTS', 'CTSMATT', 'CTSROMANS', 'CTSJOHN', 'CTSPSALMS', 'CTSGALATIANS', 'CTSREV', 'CTSHS', 'CTSCULTS'];
await run('Ignacio', { name: 'Ignacio Migrante', track: 'cert', goal: 'assoc', recorded: IG_REC, unrecorded: IG_UNREC }, {
  unlocked: true, foundation: 7, progress: '25/25',
  levels: Object.fromEntries([...IG_REC, ...IG_UNREC].map((c) => [c, 'assoc'])),
  degrees: { certificate: true, associate: true, thm: false },
});

// Ken: M.Div. Eleven courses at the master's level (the Sheet has Joshua and
// Psalms at M.Div.), eleven finished earlier at the certificate level, and Acts
// finished on the M.Div. track but never recorded.
const KEN_MDIV = [...FOUNDATION, 'CTSJOSH', 'CTSPSALMS', 'CTSHERMENEUTICS', 'CTSMATT'];
const KEN_CERT = ['CTSBIBLE', 'CTSLOC', 'CTS1PETER', 'CTSGENESIS', 'CTSBIBLECHARACTERS', 'CTSPENTECOSTAL', 'CTSAPOL', 'CTSJOHN', 'CTSROMANS', 'CTSGALATIANS', 'CTSREV'];
await run('Ken', { name: 'Kenneth Migrante', track: 'mdiv', recorded: [...KEN_MDIV, ...KEN_CERT], unrecorded: ['CTSACTS'], mdiv: KEN_MDIV }, {
  unlocked: true, foundation: 7, progress: '12/30',
  levels: { ...Object.fromEntries(KEN_MDIV.map((c) => [c, 'mdiv'])), ...Object.fromEntries(KEN_CERT.map((c) => [c, 'cert'])), CTSACTS: 'mdiv' },
  degrees: { certificate: true, associate: false, thm: true, mdiv: false },   // 12 master's-level: not yet 25 for the Associate
});

await browser.close();
console.log(`${checks} assertions on returning students from the old site`);
if (!fails.length) console.log('PASS — Paul, Ignacio and Ken arrive with their whole record, at the right level, told once.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
