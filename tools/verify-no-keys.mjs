/* A live-mode build must carry no answer keys (docs/ai-grading.md section 4).
 *
 *   node tools/verify-no-keys.mjs [dist]               # live build: fails on any key
 *   node tools/verify-no-keys.mjs --expect-keys <dir>  # shadow build: the pages are
 *                                                      # as before, plus the shadow hook
 *                                                      # (also the default when CTS_GRADING_MODE=shadow)
 *
 * Live: every page with an inlined question set (window.CTS_UNIT on a unit
 * page, window.CTS_TEXTBOOK_TEST on a textbook or required-reading test) is
 * read as data, and fails if
 *   - a multiple-choice, fill-in or short-answer item (or a test question)
 *     carries any field that is not on the whitelist -- above all `answer`,
 *     `correct`, `accept`, `why`, `model`, `keywords`, `rubric`;
 *   - the page does not say grading: "live", or an item has no qid;
 *   - a model answer or an explanation from the source content (40 characters
 *     or more, so ordinary words in a lesson cannot trip it) appears anywhere
 *     in the page's data script.
 * The lesson prose is not searched: its words are meant to be on the page.
 * The data script is the only place a key could ride.
 *
 * Not yet covered, and said so: the single-page courses (Counseling, Narrative
 * and WiseSpeak Preaching, Ethics) load their keys from
 * public/assets/js/fill/*.js and are converted in the plan's step 6.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
/* A deploy builds in the mode CTS_GRADING_MODE names; this checks the build for
   that mode unless told otherwise. */
const expectKeys = args.includes('--expect-keys') || (!args.includes('--live') && (process.env.CTS_GRADING_MODE || '').toLowerCase() === 'shadow');
const dir = args.filter((a) => !a.startsWith('--'))[0] || 'dist';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SHOWN = new Set(['qid', 'stem', 'text', 'prompt', 'options', 'group', 'chapter', 'reading']);
const problems = [];
const note = (m) => { if (problems.length < 40) problems.push(m); };

function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}
/* The JSON a page assigns to a window variable: the first line of the script
   (JSON.stringify never writes a raw newline; language pages append a line). */
function dataOf(html, name) {
  const marker = `window.${name} = `;
  const at = html.indexOf(marker);
  if (at < 0) return null;
  const start = at + marker.length;
  const end = html.indexOf('\n', start) >= 0 && html.indexOf('\n', start) < html.indexOf('</script>', start) ? html.indexOf('\n', start) : html.indexOf('</script>', start);
  let text = html.slice(start, end).trim();
  if (text.endsWith(';')) text = text.slice(0, -1);
  try { return { json: JSON.parse(text), text }; } catch { return { error: true, text }; }
}

// source content: long model answers and explanations, by unit file
const longStrings = new Map();     // `${prefix}/${n}` -> [string]
const unitsDir = path.join(ROOT, 'src/content/units');
if (!expectKeys && fs.existsSync(unitsDir)) {
  for (const pre of fs.readdirSync(unitsDir)) {
    const d = path.join(unitsDir, pre);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json'))) {
      const u = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
      const out = [];
      const grab = (v) => { if (typeof v === 'string' && v.length >= 40) out.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(grab); };
      for (const q of u.sa || []) grab(q.model);
      for (const q of u.mc || []) grab(q.why);
      longStrings.set(`${pre}/${u.unit}`, out);
    }
  }
}

let unitPages = 0, testPages = 0, withKeys = 0, shadowHook = 0, liveScript = 0;
for (const file of walk(dir)) {
  const html = fs.readFileSync(file, 'utf8');
  const isUnit = html.includes('window.CTS_UNIT = ');
  const isTest = html.includes('window.CTS_TEXTBOOK_TEST = ');
  if (!isUnit && !isTest) continue;
  const rel = path.relative(dir, file);
  const d = dataOf(html, isUnit ? 'CTS_UNIT' : 'CTS_TEXTBOOK_TEST');
  if (!d || d.error) { note(`${rel}: the inlined question data does not parse`); continue; }
  const U = d.json;
  const lists = isUnit ? [['mc', U.mc], ['fill', U.fill], ['sa', U.sa]] : [['questions', U.questions]];
  isUnit ? unitPages++ : testPages++;
  if (/\/assets\/js\/cts-shadow\.js/.test(html)) shadowHook++;
  if (/\/assets\/js\/cts-grading\.js/.test(html)) liveScript++;

  if (expectKeys) {
    // a shadow page is what it was: the keys are there, and no live marker
    if (U.grading) note(`${rel}: a shadow page says grading: "${U.grading}"`);
    const any = lists.some(([, l]) => (l || []).some((q) => 'answer' in q || 'model' in q || 'keywords' in q));
    if (any) withKeys++; else if (lists.some(([, l]) => (l || []).length)) note(`${rel}: a shadow page has no answer keys`);
    continue;
  }

  if (U.grading !== 'live') note(`${rel}: the page does not say grading: "live"`);
  for (const [kind, list] of lists) {
    (list || []).forEach((q, i) => {
      for (const k of Object.keys(q)) if (!SHOWN.has(k)) note(`${rel}: ${kind}[${i}] carries "${k}"`);
      if (!q.qid) note(`${rel}: ${kind}[${i}] has no qid`);
    });
  }
  if (isUnit) {
    const m = /([^/]+?)Unit(\d+)\.html$/.exec(rel);
    // text the page is meant to show (a question, its options) may repeat a long explanation word for word
    const shown = new Set();
    const gather = (v) => { if (typeof v === 'string') shown.add(v); else if (v && typeof v === 'object') Object.values(v).forEach(gather); };
    for (const [, list] of lists) for (const q of list || []) for (const k of SHOWN) gather(q[k]);
    for (const s of m ? longStrings.get(`${m[1]}/${m[2]}`) || [] : []) {
      if (shown.has(s)) continue;
      // JSON-escaped, as it would sit in the script
      const needle = JSON.stringify(s).slice(1, -1).replace(/</g, '\\u003c');
      if (d.text.includes(needle)) note(`${rel}: a model answer or explanation (${s.slice(0, 40)}...) is in the data script`);
    }
  }
  if (!liveScriptOk(html)) note(`${rel}: a live page without cts-grading.js`);
}
function liveScriptOk(html) { return /\/assets\/js\/cts-grading\.js/.test(html); }

if (!unitPages && !testPages) problems.push(`no page with question data found under ${dir}: is it built?`);
if (expectKeys) {
  if (!withKeys) problems.push('no shadow page carries answer keys');
  if (shadowHook < unitPages + testPages) problems.push(`only ${shadowHook} of ${unitPages + testPages} shadow pages carry cts-shadow.js`);
  if (liveScript) problems.push(`${liveScript} shadow pages load cts-grading.js`);
}

const singles = ['public/assets/js/fill'].filter((p) => fs.existsSync(path.join(ROOT, p)));
if (problems.length) {
  console.error(`FAIL — ${expectKeys ? 'shadow' : 'live'} build ${dir}:`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(expectKeys
  ? `PASS — shadow build: ${unitPages} unit pages and ${testPages} test pages keep their keys (${withKeys} with keys) and post to /api/shadow (${shadowHook} carry the hook).`
  : `PASS — live build: ${unitPages} unit pages and ${testPages} test pages carry no answer key, accept list, model answer, keyword, rubric or explanation.`);
if (!expectKeys && singles.length) console.log('  note: the single-page courses still load keys from public/assets/js/fill/ (plan step 6, not this build check).');
