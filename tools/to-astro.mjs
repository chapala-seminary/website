/* Convert the static site into Astro content collections.
 *
 *   node tools/to-astro.mjs [--apply]
 *
 * What moves and what does not
 * ----------------------------
 * Questions move into a schema-validated JSON collection. That is the point of
 * Stage 2: the answer-index invariant, the bilingual pairing and the option
 * counts become build-time checks instead of hopes.
 *
 * The page body is carried across VERBATIM, minus its <script> tags. It is
 * tempting to extract "just the lesson" and regenerate the surrounding markup,
 * but 255 of the 451 pages have no element identifying where the lesson starts
 * or ends -- they are a sequence of .card divs, one of which happens to be the
 * lesson. Any rule for splitting them would be a guess, and a wrong guess drops
 * lesson text silently. Carrying the body whole is verifiable byte for byte.
 *
 * The consequence, stated plainly: this does NOT make page markup uniform.
 * Each course keeps its own layout and stylesheet. Unifying the look of forty
 * courses is a redesign, not a migration, and should be decided on its own.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = path.join(ROOT, 'site');
const apply = process.argv.includes('--apply');

const rows = fs.readFileSync(path.join(ROOT, 'tools', 'unified-courses.txt'), 'utf8')
  .trim().split('\n').map(l => l.trim().split(/\s+/));
const slugOf = Object.fromEntries(rows.map(([c, s]) => [c, s]));

function unitData(slug, n) {
  const f = path.join(SITE, 'data', slug, `unit${n}.js`);
  if (!fs.existsSync(f)) return null;
  const ctx = { window: {}, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
  return ctx.window.CTS_UNIT;
}

const entries = [];
const problems = [];

for (const file of fs.readdirSync(SITE).filter(f => /^CTS.*Unit\d+\.html$/.test(f)).sort()) {
  const m = file.match(/^(CTS[A-Za-z0-9]*)Unit(\d+)\.html$/);
  const [, course, nStr] = m;
  const n = +nStr;
  const slug = slugOf[course];
  if (!slug) { problems.push(`${file}: course not in unified-courses.txt`); continue; }
  const U = unitData(slug, n);
  if (!U) { problems.push(`${file}: no data file`); continue; }

  const html = fs.readFileSync(path.join(SITE, file), 'utf8');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim();
  const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(x => x[1]);
  const bodyOpen = html.match(/<body([^>]*)>/);
  const bodyClass = (bodyOpen && (bodyOpen[1].match(/class="([^"]*)"/) || [, ''])[1]) || '';
  const bodyStart = html.indexOf('>', html.indexOf('<body')) + 1;
  const bodyEnd = html.lastIndexOf('</body>');
  if (bodyStart <= 0 || bodyEnd < 0) { problems.push(`${file}: no <body>`); continue; }

  let body = html.slice(bodyStart, bodyEnd);
  const extra = [];
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (tag) => {
    const src = (tag.match(/src="([^"]+)"/) || [])[1];
    // the engine and this unit's data are supplied by the layout; anything else
    // the page loads (language toggle, gating) is recorded and re-emitted
    if (src && !/cts-engine\.js$/.test(src) && !/^data\//.test(src)) extra.push(src);
    return '';
  });

  entries.push({ file, course, n, slug, title, styles, bodyClass, extra, body, U });
}

console.log(`${entries.length} unit pages read` + (problems.length ? `, ${problems.length} problems` : ''));
problems.slice(0, 10).forEach(p => console.log('  ' + p));
if (problems.length) process.exitCode = 1;

const uniq = a => [...new Set(a)];
console.log(`  distinct extra scripts: ${uniq(entries.flatMap(e => e.extra)).join(', ')}`);
console.log(`  distinct body classes : ${uniq(entries.map(e => e.bodyClass)).map(s => s || '(none)').join(' | ')}`);
console.log(`  body bytes total      : ${(entries.reduce((a, e) => a + e.body.length, 0) / 1e6).toFixed(1)}MB`);

if (!apply) { console.log('  (analysis only — pass --apply to write)'); process.exit(); }

const CONTENT = path.join(ROOT, 'src', 'content', 'units');
const BODY = path.join(ROOT, 'src', 'body');
fs.rmSync(CONTENT, { recursive: true, force: true });
fs.rmSync(BODY, { recursive: true, force: true });
fs.mkdirSync(CONTENT, { recursive: true });
fs.mkdirSync(BODY, { recursive: true });

for (const e of entries) {
  const dir = path.join(CONTENT, e.course);
  fs.mkdirSync(dir, { recursive: true });
  const entry = {
    // course is the STORAGE key the engine has always used ("1peter"), not the
    // page prefix. Renaming it would orphan every student's saved progress.
    course: e.U.course,
    pagePrefix: e.course,
    unit: e.n,
    totalUnits: e.U.totalUnits,
    title: e.title,
    bodyClass: e.bodyClass,
    styles: e.styles,
    scripts: e.extra,
    prevHref: e.U.prevHref ?? null,
    nextHref: e.U.nextHref ?? null,
    filePrefix: e.U.filePrefix ?? e.course,
    ...(e.U.unitTitles ? { unitTitles: e.U.unitTitles } : {}),
    mc: e.U.mc,
    sa: e.U.sa,
  };
  fs.writeFileSync(path.join(dir, `${e.n}.json`), JSON.stringify(entry, null, 1));
  fs.writeFileSync(path.join(BODY, `${e.course}Unit${e.n}.html`), e.body);
}
console.log(`  wrote ${entries.length} collection entries and ${entries.length} body files`);
