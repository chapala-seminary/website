/* Are the gates capable of failing?
 *
 * This project keeps finding the same defect in its own checks: something that
 * reports PASS while verifying nothing. verify-unified.mjs skipped every unit
 * and said PASS. verify-language.mjs asked whether Spanish appeared, not
 * whether English went away, and called 55 broken pages good. The 480 wrong
 * answer keys got through because the checker read the generator's own input.
 * A green suite is evidence only if each check has been seen to go red.
 *
 * So each entry below breaks something real, asserts the named gate notices,
 * and puts it back. It also runs the gate BEFORE mutating: a gate that is
 * already failing would otherwise look like it caught the mutation.
 *
 *   node tools/mutation-suite.mjs                 # every mutation (slow)
 *   node tools/mutation-suite.mjs --list
 *   node tools/mutation-suite.mjs --only catalog-title,gating-core
 *   node tools/mutation-suite.mjs --fast          # skip the whole-site sweeps
 *
 * BASE and CHROME_PATH are taken from the environment; dist/ must be served.
 */
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://127.0.0.1:8791';

/* verify-catalog.mjs and verify-gating.mjs both compare against the
   hand-written front page as it stood before the catalog was generated. It
   lives in git, not in the tree -- test/run-tests.sh extracts it and removes
   it again. Do the same here, or the gate errors on a missing file and this
   harness reports INCONCLUSIVE rather than testing anything. */
const REF = '_reference-index.html';
let refMade = false;
try {
  if (!fs.existsSync(REF)) {
    execSync(`git show c257ea2:public/index.html > ${REF}`, { stdio: 'pipe' });
    refMade = true;
  }
} catch {
  if (!fs.existsSync('dist/' + REF)) {
    console.error(`no ${REF}: this checkout cannot reach commit c257ea2, so the ` +
                  'catalog and gating mutations cannot run. Everything else can.');
  } else {
    fs.copyFileSync('dist/' + REF, REF); refMade = true;
  }
}
process.on('exit', () => { if (refMade) { try { fs.unlinkSync(REF); } catch {} } });
const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1]
  || (args.includes('--only') ? args[args.indexOf('--only') + 1] : '');
const FAST = args.includes('--fast');
const LIST = args.includes('--list');

/* ---- helpers ----------------------------------------------------------- */

const read = (f) => fs.readFileSync(f, 'utf8');
const write = (f, s) => fs.writeFileSync(f, s);

/** Replace exactly once, or throw. A mutation that silently did nothing would
 *  make the gate look better than it is. */
function sub(file, from, to) {
  const s = read(file);
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`${file}: expected 1 occurrence of ${JSON.stringify(String(from).slice(0, 60))}, found ${n}`);
  write(file, s.replace(from, to));
}

function build() {
  execSync('npm run build', { stdio: 'pipe' });
  /* A build empties dist/. verify-catalog.mjs reads the reference front page
     from the working directory; verify-gating.mjs loads it over HTTP, so it
     has to be in dist/ too. Put it back after every build, or the next gate
     errors on a missing file and this harness reports INCONCLUSIVE -- which is
     what it should do, but it means nothing was actually tested. */
  try { if (fs.existsSync(REF)) fs.copyFileSync(REF, 'dist/' + REF); } catch {}
}

/** Run a gate. Returns { code, out }. Never throws on a non-zero exit. */
function gate(cmd) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || '') + (e.stderr || '') };
  }
}

/* ---- the catalog ------------------------------------------------------- */
/* `expect` is matched against the gate's output, so a mutation that fails for
   an unrelated reason (a crash, a missing server) is not counted as caught. */

const M = [
  {
    id: 'content-answer',
    gate: 'node tools/content-baseline.mjs --check',
    files: ['src/content/units/CTSActs/1.json'],
    why: 'flip an answer key — the defect that shipped 480 times before',
    expect: /ANSWER/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      j.mc[0].answer = (j.mc[0].answer + 1) % j.mc[0].options.en.length;
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  {
    id: 'content-stem',
    gate: 'node tools/content-baseline.mjs --check',
    files: ['src/content/units/CTSActs/1.json'],
    why: 'reword a question — content changing without anyone meaning it to',
    expect: /English text changed/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      j.mc[0].stem.en = j.mc[0].stem.en.replace(/\s\S+$/, ' MUTATED');
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  {
    id: 'prose-drop',
    gate: 'node tools/prose-baseline.mjs check dist',
    files: ['src/body/CTSActsUnit3.html'],
    needsBuild: true,
    why: 'delete a paragraph of the lesson — what a body transform does wrong',
    expect: /block\(s\) lost/,
    apply: (f) => {
      const s = read(f[0]);
      const m = s.match(/<p[^>]*>[^<]{300,}<\/p>/);
      if (!m) throw new Error('no long paragraph to remove');
      write(f[0], s.replace(m[0], ''));
    },
  },
  {
    id: 'catalog-title',
    gate: 'node tools/verify-catalog.mjs _reference-index.html',
    files: ['src/content/courses/CTSActs.json'],
    needsBuild: true,
    why: 'rename a course on the front page',
    expect: /FAIL/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      j.title.en = j.title.en + ' MUTATED';
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  {
    id: 'sitemap-drop',
    gate: 'node tools/verify-sitemap.mjs dist',
    files: ['src/pages/sitemap.xml.ts'],
    needsBuild: true,
    why: 'drop a whole class of pages from the sitemap, as CTSPentecostal was',
    expect: /FAIL/,
    apply: (f) => sub(f[0], "const isCertificate = (f: string) => /Certificate\\.html$/i.test(f);",
                             "const isCertificate = (f: string) => false && /Certificate\\.html$/i.test(f);"),
  },
  {
    id: 'gating-core',
    gate: `node tools/verify-gating.mjs ${BASE} _reference-index.html`,
    files: ['public/cts-curriculum.js'],
    needsBuild: true,
    slow: true,
    why: 'shorten the foundation list — opens courses a student has not earned',
    expect: /different set of courses is locked|FAIL/,
    apply: (f) => sub(f[0], '"CTSOTS", "CTSNT"', '"CTSNT"'),
  },
  {
    id: 'language-hide',
    gate: `node tools/verify-language.mjs ${BASE} dist`,
    files: ['public/assets/css/cts.css'],
    needsBuild: true,
    slow: true,
    why: 'stop Spanish hiding English — 55 pages were in this state and passed',
    expect: /still showing .* English block|FAIL/,
    apply: (f) => sub(f[0], 'body.lang-es :is(.lang-en', 'body.lang-es-MUTATED :is(.lang-en'),
  },
  {
    id: 'mobile-overflow',
    gate: `node tools/verify-mobile.mjs ${BASE} dist 390`,
    files: ['public/assets/css/cts.css'],
    needsBuild: true,
    slow: true,
    why: 'force the page wider than a phone',
    expect: /scroll sideways|FAIL/,
    apply: (f) => write(f[0], read(f[0]) + '\n.wrap{min-width:900px}\n'),
  },
  {
    id: 'submit-id',
    gate: `node tools/audit-controls-built.mjs ${BASE}`,
    files: ['src/body/CTSREUnit1.html'],
    needsBuild: true,
    slow: true,
    /* A SIXTH spelling, not one of the five shell.ts knows. Renaming to a known
       alias proves nothing now: the build renames it straight back, which is the
       transform working. The live risk is a new page inventing a name nobody
       has taught the transform about. */
    why: 'a page invents a control id nothing knows — the alias problem, returning',
    expect: /not #submitExamBtn|FAIL/,
    apply: (f) => sub(f[0], '<button id="submitExamBtn" onclick="grade()">', '<button id="submitExamButton" onclick="grade()">'),
  },
  {
    id: 'result-alias',
    gate: `node tools/audit-controls-built.mjs ${BASE}`,
    files: ['src/lib/shell.ts'],
    needsBuild: true,
    slow: true,
    why: 'stop renaming the result area — the engine writes the score nowhere the page shows',
    expect: /not #examResult|FAIL/,
    apply: (f) => sub(f[0], "  examResult: ['examStatus'", "  examResultDISABLED: ['examStatus'"),
  },
  {
    id: 'control-normalise-off',
    gate: `node tools/audit-controls-built.mjs ${BASE}`,
    files: ['src/lib/shell.ts'],
    needsBuild: true,
    slow: true,
    why: 'stop renaming control ids at build time — the alias problem returns',
    expect: /not #submitExamBtn|FAIL/,
    apply: (f) => sub(f[0], '  normaliseControls(root, removed);', '  // normaliseControls(root, removed);'),
  },
  {
    id: 'submit-doublebind',
    gate: `node tools/audit-controls-built.mjs ${BASE}`,
    files: ['public/assets/js/cts-engine.js', 'src/lib/shell.ts'],
    needsBuild: true,
    slow: true,
    /* Two protections now stand between a student and this defect: shell.ts
       strips the inline onclick, and the engine skips binding a control that
       has one. Removing either alone is harmless, so this removes both. The
       question is whether the audit still notices when the whole defence is
       dismantled, not whether one layer can be nudged. */
    why: 'dismantle both guards, restoring the double-bind that hid a failing score',
    expect: /bound twice|FAIL/,
    apply: (f) => {
      sub(f[0],
        'var sb = submitEl(); if (sb && !sb.getAttribute("onclick")) sb.addEventListener("click", submit);',
        'var sb = submitEl(); if (sb) sb.addEventListener("click", submit);');
      sub(f[1], "if (el && el.getAttribute('onclick')) {", "if (false && el.getAttribute('onclick')) {");
    },
  },
  {
    id: 'engine-passmark',
    gate: `node tools/engine-test-built.mjs ${BASE}`,
    files: ['public/assets/js/cts-engine.js'],
    needsBuild: true,
    slow: true,
    why: 'lower the pass mark below the agreed 90%',
    expect: /FAIL/,
    apply: (f) => sub(f[0], 'PASS_RATIO      = 0.90', 'PASS_RATIO      = 0.50'),
  },
  {
    id: 'devmode-off',
    gate: `node tools/verify-devmode.mjs ${BASE}`,
    files: ['public/cts-curriculum.js'],
    needsBuild: true,
    why: 'break the course-tester override entirely',
    expect: /FAIL/,
    apply: (f) => sub(f[0],
      'function testActive() { try { return localStorage.getItem(TEST_KEY) === "1"; } catch (e) { return false; } }',
      'function testActive() { return false; }'),
  },
  {
    id: 'devmode-wipes-student',
    gate: `node tools/verify-devmode.mjs ${BASE}`,
    files: ['public/cts-curriculum.js'],
    needsBuild: true,
    why: 'let tester mode erase a registered student\'s earned progress',
    expect: /erased|FAIL/,
    apply: (f) => sub(f[0], 'if (existing && existing.name && !existing._tester) return;', 'if (false) return;'),
  },
  {
    id: 'certificate-sync',
    gate: `node tools/verify-certificates.mjs ${BASE}`,
    files: ['public/CTSActsCertificate.html'],
    needsBuild: true,
    why: 'a certificate stops taking part in student records',
    expect: /do not load cts-sync|never probed|FAIL/,
    apply: (f) => sub(f[0], '<script src="assets/js/cts-sync.js" defer></script>', ''),
  },
];

/* ---- runner ------------------------------------------------------------ */

if (LIST) {
  console.log(`${M.length} mutations:\n`);
  for (const m of M) console.log(`  ${m.id.padEnd(22)} ${m.slow ? '(slow) ' : '       '}${m.why}`);
  process.exit(0);
}

let chosen = M;
if (only) {
  const want = new Set(only.split(',').map((s) => s.trim()));
  chosen = M.filter((m) => want.has(m.id));
  const missing = [...want].filter((w) => !M.some((m) => m.id === w));
  if (missing.length) { console.error('unknown mutation(s): ' + missing.join(', ')); process.exit(2); }
}
if (FAST) chosen = chosen.filter((m) => !m.slow);

/* Crash safety. This tool deliberately breaks the working tree and puts it
   back in a `finally`. A `finally` does not run when the process is killed --
   a timeout, a Ctrl-C, a closed terminal -- and an earlier run of this file
   was killed by a timeout and left cts-engine.js mutated. Nothing said so; the
   next run simply started from a corrupted tree and reported nonsense.
   So every backup is also written to disk before the tree is touched, the
   signals are handled, and a run refuses to start while an unreclaimed backup
   from a previous run exists. */
const SAFE = '.mutation-backup';

function saveBackup(map) {
  fs.mkdirSync(SAFE, { recursive: true });
  const manifest = [];
  let i = 0;
  for (const [f, body] of map) {
    const copy = `${SAFE}/${i++}.bak`;
    fs.writeFileSync(copy, body);
    manifest.push({ file: f, copy });
  }
  fs.writeFileSync(`${SAFE}/manifest.json`, JSON.stringify(manifest));
}
function clearBackup() { try { fs.rmSync(SAFE, { recursive: true, force: true }); } catch {} }
function reclaim() {
  const man = `${SAFE}/manifest.json`;
  if (!fs.existsSync(man)) return false;
  for (const { file, copy } of JSON.parse(fs.readFileSync(man, 'utf8'))) {
    fs.copyFileSync(copy, file);
    console.log(`  restored ${file}`);
  }
  clearBackup();
  return true;
}

if (args.includes('--restore')) {
  console.log(reclaim() ? 'Working tree restored from an interrupted run.'
                        : 'Nothing to restore.');
  process.exit(0);
}
if (fs.existsSync(`${SAFE}/manifest.json`)) {
  console.error('An earlier run of this tool was interrupted and the working tree may still\n' +
                'be mutated. Restoring it now; re-run when this reports clean.\n');
  reclaim();
  console.error('\nRestored. Verify with `git status` before re-running.');
  process.exit(2);
}

let live = null;                       // the mutation currently applied
const emergency = () => { if (live) { live(); live = null; } clearBackup(); };
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP'])
  process.on(sig, () => { emergency(); process.exit(130); });

const results = [];
for (const m of chosen) {
  const backup = new Map(m.files.map((f) => [f, read(f)]));
  const restore = () => { for (const [f, s] of backup) write(f, s); };
  saveBackup(backup);
  live = restore;
  process.stdout.write(`${m.id} … `);
  let row = { id: m.id, why: m.why };
  try {
    // The gate must be green first, or "it failed" proves nothing.
    if (m.needsBuild) build();
    const before = gate(m.gate);
    if (before.code !== 0) {
      row.verdict = 'INCONCLUSIVE';
      row.note = 'the gate was already failing before the mutation';
      results.push(row); console.log('INCONCLUSIVE (already red)'); continue;
    }
    m.apply(m.files);
    if (m.needsBuild) build();
    const after = gate(m.gate);
    const caught = after.code !== 0 && m.expect.test(after.out);
    row.verdict = caught ? 'caught'
      : after.code !== 0 ? 'FAILED FOR THE WRONG REASON'
      : 'MISSED';
    if (!caught) row.note = (after.out.trim().split('\n').slice(-3).join(' | ')).slice(0, 160);
    console.log(row.verdict);
  } catch (e) {
    row.verdict = 'ERROR'; row.note = String(e.message).slice(0, 140);
    console.log('ERROR — ' + row.note);
  } finally {
    restore();
    live = null;
    clearBackup();
    // Prove the restore worked, rather than assuming it.
    for (const [f, want] of backup)
      if (read(f) !== want) {
        console.error(`\nCOULD NOT RESTORE ${f} — stop and check it before doing anything else.`);
        process.exit(3);
      }
  }
  results.push(row);
}

// Leave the tree as we found it.
build();

const bad = results.filter((r) => r.verdict !== 'caught');
console.log(`\n${results.length} mutation(s) run against ${new Set(chosen.map(m=>m.gate.split(' ')[1])).size} gate(s)`);
if (!bad.length) {
  console.log('PASS — every gate noticed the defect it exists to notice.');
} else {
  console.log(`FAIL — ${bad.length} mutation(s) not caught:`);
  for (const r of bad) {
    console.log(`  ${r.id}: ${r.verdict}`);
    console.log(`      breaks: ${r.why}`);
    if (r.note) console.log(`      gate said: ${r.note}`);
  }
  process.exit(1);
}
