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
import { createHash } from 'node:crypto';
import { parse as parseYaml, stringify as toYaml } from 'yaml';

const BASE = process.env.BASE || 'http://127.0.0.1:8791';

const read = (f) => fs.readFileSync(f, 'utf8');
const write = (f, s) => fs.writeFileSync(f, s);

/* verify-catalog.mjs and verify-gating.mjs both compare against the
   hand-written front page as it stood before the catalog was generated. It
   lives in git, not in the tree -- test/run-tests.sh extracts it and removes
   it again. Do the same here, or the gate errors on a missing file and this
   harness reports INCONCLUSIVE rather than testing anything. */
const REF = '_reference-index.html';

/* A reference has to be a front page, not just a path that exists.
   `git show ... > file` creates the file BEFORE git runs, so a checkout that
   cannot reach that commit leaves a zero-byte file behind -- and if the run is
   interrupted before its trap fires, the next run finds it, uses it, and both
   gates report "already red". Which is what happened: two mutations were
   reported INCONCLUSIVE for a week against an empty file, and the message
   blamed the checkout. Anything that does not look like the page is no
   reference at all. */
const usable = (f) => {
  try { return fs.statSync(f).size > 10_000 && read(f).includes('<html'); }
  catch { return false; }
};

let refMade = false;
if (!usable(REF)) {
  try { fs.unlinkSync(REF); } catch {}
  try {
    execSync(`git show c257ea2:public/index.html > ${REF}`, { stdio: 'pipe' });
    refMade = true;
  } catch { /* fall through to the copy below */ }
  if (!usable(REF)) {
    try { fs.unlinkSync(REF); } catch {}
    refMade = false;
    if (usable('dist/' + REF)) { fs.copyFileSync('dist/' + REF, REF); refMade = true; }
  }
}
if (!usable(REF)) {
  console.error(`no usable ${REF}: this checkout cannot reach commit c257ea2 and there is `
    + 'no copy in dist/, so the catalog and gating mutations cannot run. Everything else can.\n'
    + 'To run them anyway, put the front page as it stood at c257ea2 at that path:\n'
    + `  git show c257ea2:public/index.html > ${REF}`);
}
process.on('exit', () => { if (refMade) { try { fs.unlinkSync(REF); } catch {} } });
const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1]
  || (args.includes('--only') ? args[args.indexOf('--only') + 1] : '');
const FAST = args.includes('--fast');
const LIST = args.includes('--list');

/* ---- helpers ----------------------------------------------------------- */


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
    /* This used to point at src/body/CTSActsUnit3.html. That file stopped
       existing when the last course was converted, and because the harness
       reads every mutation's files up front, ONE stale path made the whole
       suite crash on startup -- so the suite that exists to prove the gates
       can fail was itself unable to run. Which is the joke this project keeps
       telling. It now edits the same lesson through the data. */
    files: ['src/content/lessons/CTSActs/3.json'],
    needsBuild: true,
    why: 'lose a paragraph of the lesson — what a body transform does wrong',
    expect: /block\(s\) lost/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      const b = j.blocks.find((x) => (x.text?.en || '').length > 300);
      if (!b) throw new Error('no long paragraph to lose');
      b.text.en = b.text.en.slice(0, 40) + ' MUTATED';
      write(f[0], JSON.stringify(j, null, 1) + '\n');
    },
  },
  /* The lesson pipeline. A converted course is data now, and data is exactly
     as easy to lose as markup was -- these are the ways it would go. */
  {
    id: 'lesson-drop-block',
    gate: 'node tools/prose-baseline.mjs check dist',
    files: ['src/content/lessons/CTSHermeneutics/4.json'],
    needsBuild: true,
    why: 'empty a paragraph of a converted lesson — the same loss, now in data',
    expect: /block\(s\) lost/,
    apply: (f) => {
      /* Emptied rather than removed. Removing it outright is caught earlier,
         by the template still holding its hole; this is the quieter version,
         where the shape is intact and the words are gone. */
      const j = JSON.parse(read(f[0]));
      const b = j.blocks.find((b) => b.type === 'prose' && (b.text?.en || '').length > 300);
      if (!b) throw new Error('no long paragraph to empty');
      for (const k of Object.keys(b.text)) b.text[k] = ' ';
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  {
    id: 'lesson-drop-spanish',
    gate: 'npx astro build',
    files: ['src/content/lessons/CTSHermeneutics/6.json'],
    why: 'drop one block\'s Spanish — the page half in a language the reader did not choose',
    expect: /hole for es and no es text/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      const b = j.blocks.find((b) => b.type === 'prose');
      delete b.text.es;
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  {
    id: 'lesson-duplicate-id',
    gate: 'npx astro build',
    files: ['src/content/lessons/CTSHermeneutics/7.json'],
    why: 'give two blocks the same id — an edit to one would land on the other',
    expect: /share an id/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      j.blocks[3].id = j.blocks[2].id;
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  {
    id: 'lesson-stale-ignored',
    gate: 'node test/lesson-translation.mjs',
    files: ['src/lib/lesson.ts'],
    why: 'call every translation current — automatic translation would then never refresh anything',
    expect: /FAIL/,
    apply: (f) => {
      write(f[0], read(f[0]).replace('return tr.from !== hash(src);', 'return false;'));
    },
  },
  {
    id: 'lesson-clobbers-human',
    gate: 'node test/lesson-translation.mjs',
    files: ['tools/translate-lesson.mjs'],
    why: 'translate every block, not only the stale ones — a person\'s corrections overwritten on every run',
    expect: /FAIL/,
    apply: (f) => {
      write(f[0], read(f[0]).replace(
        'if (has && !isStale(b, LANG, l.sourceLang)) continue;', ''));
    },
  },
  {
    id: 'lesson-wrong-stamp',
    gate: 'node test/lesson-translation.mjs',
    files: ['tools/translate-lesson.mjs'],
    why: 'stamp a translation with the wrong source — every later edit looks already translated',
    expect: /FAIL/,
    apply: (f) => {
      write(f[0], read(f[0]).replace(
        "p.tr = { ...(p.tr ?? {}), [LANG]: { status: 'machine', from: hash(src) } };",
        "p.tr = { ...(p.tr ?? {}), [LANG]: { status: 'machine', from: hash('') } };"));
    },
  },
  {
    id: 'lesson-render-drift',
    gate: 'node tools/verify-lesson-render.mjs',
    files: ['src/lib/lesson.ts'],
    needsBuild: true,
    why: 'render only the first language into the page — every page loses its Spanish',
    expect: /differs|FAIL/,
    apply: (f) => {
      write(f[0], read(f[0]).replace('if (!langs.includes(lang)) return \'\';',
                                     'if (lang !== langs[0]) return \'\';'));
    },
  },
  {
    id: 'lesson-template-hole-lost',
    gate: 'npx astro build',
    files: ['src/content/lessons/CTSActs/4.json'],
    why: 'a block loses its hole in the template — its text never reaches the page again',
    expect: /hole|vanish from the page/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      const id = j.blocks[5].id;
      j.template = j.template.split(`<!--cts:${id}:en-->`).join('');
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  /* The CMS config. Sveltia drops fields its config does not declare, so the
     dangerous change here is a quiet one: data gains a field, the config does
     not, and the next teacher to press save deletes it. */
  {
    id: 'cms-field-undeclared',
    gate: 'node tools/verify-cms-config.mjs',
    files: ['public/admin/config.yml'],
    why: 'stop declaring the paragraph text — 301 paragraphs lose their words on the next save',
    expect: /would delete them|not in the config/,
    apply: (f) => {
      /* Removed from the PARAGRAPH type only. Six other block types still
         declare `text`, so a check that merely collected field names would see
         nothing wrong. Edited through the YAML parser rather than with a
         regex, so the mutation is the missing field and not a broken file. */
      const c = parseYaml(read(f[0]));
      const blocks = c.collections
        .find((c) => String(c.name).startsWith('lessons_')).fields
        .find((f) => f.name === 'blocks');
      const prose = blocks.types.find((t) => t.name === 'prose');
      const before = prose.fields.length;
      prose.fields = prose.fields.filter((f) => f.name !== 'text');
      if (prose.fields.length === before) throw new Error('the paragraph has no text field to remove');
      write(f[0], toYaml(c));
    },
  },
  {
    id: 'cms-course-unlisted',
    gate: 'node tools/verify-cms-config.mjs',
    files: ['public/admin/config.yml'],
    why: 'a converted course with no collection — its lessons are not editable and nobody is told',
    expect: /has no collection/,
    apply: (f) => {
      const s = read(f[0]);
      write(f[0], s.replace(/ {4}folder: src\/content\/lessons\/\w+\n/, '    folder: src/content/lessons/_none\n'));
    },
  },
  {
    id: 'cms-config-malformed',
    gate: 'node tools/verify-cms-config.mjs',
    files: ['public/admin/config.yml'],
    why: 'break the YAML — the CMS would not load at all',
    expect: /not valid YAML/,
    apply: (f) => write(f[0], read(f[0]).replace(/^collections:$/m, 'collections: [oops')),
  },
  {
    id: 'cms-unpublished',
    gate: `node tools/verify-cms-loads.mjs ${BASE}`,
    files: ['public/admin/index.html'],
    needsBuild: true,
    slow: true,
    why: 'the editing interface stops being published — a teacher gets a 404 and nobody else finds out',
    expect: /returns 200|FAIL/,
    apply: (f) => write(f[0], read(f[0]).replace(/<script src=[^>]*><\/script>/, '')),
  },
  {
    id: 'html-lang-stale',
    gate: `node tools/verify-language.mjs ${BASE} dist`,
    files: ['public/assets/js/cts-engine.js'],
    needsBuild: true,
    slow: true,
    why: 'the document keeps saying lang="en" in Spanish — screen readers mispronounce every page',
    expect: /html lang="en"|FAIL/,
    apply: (f) => sub(f[0], 'if (lang !== "both") document.documentElement.lang = lang;', ''),
  },
  {
    id: 'lesson-entities-return',
    gate: 'npx astro build',
    files: ['src/content/lessons/CTSHermeneutics/3.json'],
    why: 'an HTML entity gets back into the lesson text — a teacher reads &ldquo; instead of a quotation mark',
    expect: /entities belong in HTML/,
    apply: (f) => {
      const j = JSON.parse(read(f[0]));
      const b = j.blocks.find((b) => b.type === 'prose' && /\u201c|\u2014/.test(b.text?.en ?? ''));
      if (!b) throw new Error('no block with a decoded character to re-encode');
      b.text.en = b.text.en.replace(/\u201c/g, '&ldquo;').replace(/\u2014/g, '&mdash;');
      write(f[0], JSON.stringify(j, null, 1));
    },
  },
  {
    id: 'baseline-records-nothing',
    gate: 'node tools/prose-baseline.mjs record',
    /* The fixture is listed even though the mutation does not edit it, because
       the GATE writes it: `record` rewrites the baseline, and the harness only
       restores what a mutation declares. Left off this list, the green run
       before the mutation quietly re-recorded the baseline from the current
       tree -- so any content the working tree had just lost was written into
       the standard it is measured against, and the next check passed. That
       happened. It cost 781 blocks of coverage and was caught by comparing
       against the committed copy, not by anything here. */
    files: ['tools/prose-baseline.mjs', 'test/fixtures/prose-baseline.json'],
    why: 'the prose baseline records nothing and every check then passes against nothing',
    expect: /REFUSING to record/,
    apply: (f) => {
      /* What actually happened: the last HTML body was converted, src/body
         emptied, and `record` -- which listed that directory -- wrote a
         baseline of zero blocks. `check` then passed, loudly, against it. */
      write(f[0], read(f[0]).replace(
        'for (const f of pages(dir)) map[f] = read(dir, f, isDist);',
        "for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) map[f] = read(dir, f, isDist);"));
    },
  },
  {
    id: 'lesson-text-frozen',
    gate: 'node tools/verify-editable.mjs',
    files: ['src/content/lessons/CTSST/12.json'],
    why: 'lesson text goes back into the template — on the page, and beyond a teacher\'s reach',
    expect: /NOT page furniture/,
    apply: (f) => {
      /* What actually happened once: CTSST unit 12's Spanish sat in the
         template because it never paired, rendered perfectly, and no gate
         said a word. */
      const j = JSON.parse(read(f[0]));
      const b = j.blocks.find((b) => (b.text.en || '').length > 400);
      if (!b) throw new Error('no long block to freeze');
      j.template = j.template.replace(`<!--cts:${b.id}:en-->`, b.text.en);
      j.blocks = j.blocks.filter((x) => x.id !== b.id);
      write(f[0], JSON.stringify(j, null, 1));
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
    /* Was src/body/CTSREUnit1.html until CTSRE was converted; the button now
       lives in that unit's template. Same button, same page, same defect. */
    files: ['src/content/lessons/CTSRE/1.json'],
    needsBuild: true,
    slow: true,
    /* A SIXTH spelling, not one of the five shell.ts knows. Renaming to a known
       alias proves nothing now: the build renames it straight back, which is the
       transform working. The live risk is a new page inventing a name nobody
       has taught the transform about. */
    why: 'a page invents a control id nothing knows — the alias problem, returning',
    expect: /not #submitExamBtn|FAIL/,
    apply: (f) => sub(f[0], '<button id=\\"submitExamBtn\\" onclick=\\"grade()\\">', '<button id=\\"submitExamButton\\" onclick=\\"grade()\\">'),
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
    id: 'greeting-duplicate',
    gate: `node tools/audit-controls-built.mjs ${BASE}`,
    /* This used to be a one-file mutation: take the greeting placeholders out
       of shell.ts's CHROME list and watch 29 pages go blank. It stopped
       reproducing anything when strip-chrome.mjs removed those placeholders
       from the templates -- there was nothing left for shell.ts to fail to
       remove, so the gate passed and the mutation was MISSED. That is the
       defence moving, not disappearing, but a mutation that cannot fail is
       worth nothing, so it now reintroduces the hazard as well as disabling
       the defence: put a placeholder back into a lesson AND stop shell.ts
       taking it out. Both, because either alone is harmless. */
    files: ['src/lib/shell.ts', 'src/content/lessons/CTSActs/3.json'],
    needsBuild: true,
    slow: true,
    why: 'a page carries its own greeting placeholder and shell.ts stops removing it — '
       + 'it wins, and the layout\'s greeting stays blank',
    expect: /duplicate greeting placeholder|FAIL/,
    apply: (f) => {
      sub(f[0], "  '#studentGreeting', '#student-greeting', '#greet', '#t-greet',", '');
      const j = JSON.parse(read(f[1]));
      j.template = '<div id=\"studentGreeting\"></div>' + j.template;
      write(f[1], JSON.stringify(j, null, 1) + '\n');
    },
  },
  {
    id: 'container-alias',
    gate: `node tools/audit-controls-built.mjs ${BASE}`,
    files: ['src/lib/shell.ts'],
    needsBuild: true,
    slow: true,
    why: 'stop renaming the question containers — the engine renders questions nowhere',
    expect: /not #questionsContainer|FAIL/,
    apply: (f) => sub(f[0], "  questionsContainer: ['mcContainer'", "  questionsContainerOFF: ['mcContainer'"),
  },
  {
    id: 'alias-creeps-back',
    gate: 'node tools/verify-one-name.mjs',
    files: ['public/assets/js/cts-engine.js'],
    why: 'add one convenient alias back to a resolver — how the lists grew the first time',
    expect: /asks for 2 ids|FAIL/,
    apply: (f) => sub(f[0], 'function submitEl() { return el("submitExamBtn"); }',
                            'function submitEl() { return el("submitExamBtn") || el("submitBtn"); }'),
  },
  {
    id: 'class-alias-css',
    gate: 'node tools/verify-one-class.mjs dist',
    files: ['public/assets/css/cts.css'],
    why: 'the stylesheet re-admits a retired class name',
    expect: /still styles \.cts-figure|FAIL/,
    apply: (f) => sub(f[0], '.illustration,figure{', '.illustration,.cts-figure,figure{'),
  },
  {
    id: 'class-normalise-off',
    gate: 'node tools/verify-one-class.mjs dist',
    files: ['src/lib/shell.ts'],
    needsBuild: true,
    why: 'stop renaming classes at build time — six names for one surface return',
    expect: /survives on \d+ built page|FAIL/,
    apply: (f) => sub(f[0], '  normaliseClasses(root);', '  // normaliseClasses(root);'),
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

  /* ---- the partials -------------------------------------------------- */
  /* Markup that is the same on every page now lives in one place, which is
     the point and also the risk: one wrong character is wrong on 434 pages
     at once. These are the three ways it can go wrong quietly. */
  {
    id: 'partial-unknown-name',
    gate: 'node tools/verify-partials.mjs',
    files: ['src/content/lessons/CTSActs/3.json'],
    why: 'misspell a partial\'s name in a template — a page renders with a gap in it',
    expect: /does not define/,
    apply: (f) => sub(f[0], '<!--cts-part:honours-->', '<!--cts-part:honors-->'),
  },
  {
    id: 'partial-no-reading-room',
    gate: 'node tools/verify-partials.mjs',
    files: ['src/lib/partials.ts'],
    why: 'a course loses its reading room — the honours box would point nowhere',
    expect: /no reading room/,
    apply: (f) => sub(f[0], '  CTSActs: "CTSActsReadings.html",\n', ''),
  },
  {
    id: 'partial-unused',
    gate: 'node tools/verify-partials.mjs',
    files: ['src/lib/partials.ts'],
    why: 'define a partial nothing names — markup that is maintained and never seen',
    expect: /which no template names/,
    apply: (f) => sub(f[0], '  honours: honoursBox,', '  honours: honoursBox,\n  ghost: () => \'<i>x</i>\','),
  },
  {
    id: 'partial-build-stops',
    gate: 'npm run build',
    files: ['src/content/lessons/CTSActs/3.json'],
    why: 'the same misspelling, against the build itself — renderLesson must refuse, '
       + 'not render a page with a hole in it',
    expect: /asks for a partial named/,
    apply: (f) => sub(f[0], '<!--cts-part:honours-->', '<!--cts-part:honors-->'),
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

/* A gate is meant to READ the tree, not write to it. One of them wrote to a
   fixture, and because the harness restores only what a mutation declares,
   the damage outlived the run and weakened the very baseline the suite
   exists to protect. So: hash everything a gate could plausibly write to,
   before and after, and say so if any of it moved. */
const WATCHED = ['test/fixtures', 'tools/content-baseline.json', 'public/admin/config.yml'];
const watchFiles = () => {
  const out = [];
  const walk = (p) => {
    if (!fs.existsSync(p)) return;
    if (fs.statSync(p).isDirectory()) { for (const c of fs.readdirSync(p)) walk(`${p}/${c}`); return; }
    out.push(p);
  };
  for (const w of WATCHED) walk(w);
  /* The content, not just a hash: detecting the damage after the fact is not
     much use if the only copy of what was there is now gone. */
  return new Map(out.map((f) => [f, read(f)]));
};

const results = [];
for (const m of chosen) {
  const watchedBefore = watchFiles();
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
    /* And that nothing the mutation did NOT declare was changed underneath
       it. A gate that writes to a fixture corrupts the standard silently and
       for good; better to stop the run and say which file. */
    const watchedAfter = watchFiles();
    const strayed = [];
    for (const [f, want] of watchedBefore)
      if (watchedAfter.get(f) !== want) { write(f, want); strayed.push(f); }
    for (const f of watchedAfter.keys())
      if (!watchedBefore.has(f)) strayed.push(`${f} (created)`);
    if (strayed.length) {
      console.error(`\n${m.id} changed ${strayed.join(', ')} without declaring `
        + 'it. Its gate writes there. Put the file(s) in its files list.');
      console.error('They have been put back, so nothing is lost — but stop and fix the list, '
        + 'because a run that records this tree as its own standard passes against anything.');
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
