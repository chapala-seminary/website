/* Prose baseline.
 *
 * content-baseline.mjs guards the questions: 34,778 comparisons of MC/SA text
 * and answer indices. It says nothing about the lesson itself, which is most
 * of what the seminary actually wrote. Nothing did, which is why
 * tools/to-astro.mjs refused to restructure the bodies at all: a wrong split
 * drops lesson text and no check notices.
 *
 * This records every text block in every unit body, so a transform must
 * account for anything it removes. Blocks are normalised (entities decoded,
 * whitespace collapsed) so reformatting is not mistaken for loss.
 *
 * Only hashes are stored. The prose they stand for is in src/body/ in the same
 * commit, so a failure can still quote the missing paragraph -- it is looked
 * up by hash when the check fails. Storing the text as well would put ten
 * megabytes of duplicated lesson into the repository to say what a few hundred
 * kilobytes of hashes already say.
 *
 *   node tools/prose-baseline.mjs record      -> test/fixtures/prose-baseline.json
 *   node tools/prose-baseline.mjs check       -> compares src/body against it
 *   node tools/prose-baseline.mjs check dist  -> compares the built pages
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse } from 'node-html-parser';
import { renderLesson } from '../src/lib/lesson.ts';

const BODY_DIR = 'src/body';
const OUT = 'test/fixtures/prose-baseline.json';
const MIN = 40;                     // shorter than this is a label, not prose

/* Text that belongs to the page furniture rather than the lesson: the
 * registration copy each of the forty-four courses wrote for itself, and the
 * navigation labels. The layout renders those once now. A transform may drop
 * these and only these; anything else missing is a bug. Recorded as hashes for
 * the same reason as the baseline. */
const CHROME_ALLOW = 'test/fixtures/prose-chrome-allow.json';

const norm = (s) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const hash = (s) => crypto.createHash('sha1').update(s).digest('base64url').slice(0, 12);

/* Blocks, not paragraphs: some courses put the lesson in <li>, <blockquote> or
 * a bare <div>. Taking only the innermost element that holds text avoids
 * counting the same words once per ancestor. */
/* `div` is here deliberately. Forty-four courses put 1,170 Scripture
 * quotations in <div class="scripture"> and several hundred more paragraphs in
 * bare <div>s, and a list without it left all of that unguarded -- the quoted
 * Scripture, of all things. The wrapper rule below keeps a container <div>
 * from counting its children's words a second time. */
const BLOCK = ['p','li','blockquote','h1','h2','h3','h4','h5','h6',
               'td','th','dt','dd','figcaption','summary','pre','div'];
const SEL = BLOCK.join(',');

function blocks(html) {
  const root = parse(html);
  root.querySelectorAll('script,style').forEach((n) => n.remove());
  const out = [];
  for (const el of root.querySelectorAll(SEL)) {
    if (el.querySelector(SEL)) continue;        // a wrapper; its children count
    const t = norm(el.text);
    if (t.length >= MIN) out.push(t);
  }
  return out;
}

/* A converted course has no file in src/body any more -- its lesson is data.
 * The baseline still has to be able to read it, or converting a course would
 * quietly retire the guard on exactly the pages that just changed. So the
 * lesson is rendered back to markup and read from that. */
const LESSONS = 'src/content/lessons';
function fromLesson(file) {
  const m = file.match(/^(.+)Unit(\d+)\.html$/);
  if (!m) return null;
  const dir = path.join(LESSONS, m[1]);
  const lesson = path.join(dir, `${m[2]}.json`);
  const shared = path.join(dir, '_shared.json');
  if (!fs.existsSync(lesson) || !fs.existsSync(shared)) return null;
  return renderLesson(JSON.parse(fs.readFileSync(lesson, 'utf8')),
                      JSON.parse(fs.readFileSync(shared, 'utf8')));
}

function read(dir, file, isDist) {
  let html;
  if (!isDist && !fs.existsSync(path.join(dir, file))) {
    html = fromLesson(file);
    if (html == null) throw new Error(`no body and no lesson for ${file}`);
  } else {
    html = fs.readFileSync(path.join(dir, file), 'utf8');
  }
  if (isDist) {
    const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (m) html = m[1];
  }
  return blocks(html);
}

function collect(dir, isDist) {
  const map = {};
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
    map[f] = read(dir, f, isDist);
  }
  return map;
}

const cmd = process.argv[2] || 'check';
const target = process.argv[3];

if (cmd === 'record') {
  const map = collect(BODY_DIR, false);
  const hashed = Object.fromEntries(
    Object.entries(map).map(([f, list]) => [f, list.map(hash)]));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(hashed));
  const n = Object.values(map).reduce((a, b) => a + b.length, 0);
  console.log(`recorded ${n} blocks across ${Object.keys(map).length} units -> ${OUT}`);
  process.exit(0);
}

if (!fs.existsSync(OUT)) {
  console.error(`no baseline at ${OUT} — run: node tools/prose-baseline.mjs record`);
  process.exit(2);
}
const base = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const allow = fs.existsSync(CHROME_ALLOW)
  ? new Set(JSON.parse(fs.readFileSync(CHROME_ALLOW, 'utf8')))
  : new Set();

const isDist = target === 'dist';
const dir = isDist ? 'dist' : BODY_DIR;

/* What the missing hashes stood for. Read back from the source bodies, which
   is the point of storing hashes rather than the prose twice over. */
function quote(file, wanted) {
  const found = new Map();
  try {
    for (const t of read(BODY_DIR, file, false)) {
      const h = hash(t);
      if (wanted.has(h)) found.set(h, t);
    }
  } catch { /* the source body is gone too; the hash is all we can report */ }
  return found;
}

let missingUnits = 0, missingBlocks = 0, expected = 0;
const report = [];
for (const [file, want] of Object.entries(base)) {
  let got;
  try { got = read(dir, file, isDist); }
  catch { missingUnits++; report.push(`MISSING PAGE  ${file}`); continue; }

  const have = new Set(got.map(hash));
  const gone = want.filter((h) => !have.has(h));
  const unlisted = gone.filter((h) => !allow.has(h));
  expected += gone.length - unlisted.length;
  if (!unlisted.length) continue;

  missingBlocks += unlisted.length;
  const text = quote(file, new Set(unlisted));
  report.push(`${file}  ${unlisted.length} block(s) not in the page and not chrome:`);
  for (const h of unlisted.slice(0, 3)) {
    report.push(`    ${(text.get(h) || `<${h}>`).slice(0, 140)}`);
  }
  if (unlisted.length > 3) report.push(`    … and ${unlisted.length - 3} more`);
}

const total = Object.values(base).reduce((a, b) => a + b.length, 0);
console.log(`prose: ${total} blocks, ${Object.keys(base).length} units, comparing ${dir}`);
if (expected) console.log(`  ${expected} chrome block(s) removed as expected`);
if (report.length) {
  console.log(report.join('\n'));
  console.error(`FAIL: ${missingUnits} page(s) missing, ${missingBlocks} block(s) lost`);
  process.exit(1);
}
console.log('OK: every recorded block is still on its page');
