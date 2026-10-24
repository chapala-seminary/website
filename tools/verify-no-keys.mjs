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
 *   - a textbook or reading test page still carries its question bank
 *     (the server sends the drawn prompts; the page ships questions: []);
 *   - a model answer or an explanation from the source content (40 characters
 *     or more, so ordinary words in a lesson cannot trip it) appears anywhere
 *     in the page's data script.
 * The lesson prose is not searched: its words are meant to be on the page.
 * The data script is the only place a key could ride.
 *
 * The single-page courses (Counseling, Narrative and WiseSpeak Preaching,
 * Ethics; 13 pages, each in English, Spanish and French) are checked the same
 * way: in a live build every question block of the page script, the French
 * draft literals and the fill-in data file may carry only what a student reads,
 * no model answer or explanation (40 characters or more) of the source appears
 * anywhere in the page, and the page loads cts-single-live.js; in a shadow build
 * the keys are there and the page loads the shadow hook.
 * Left on the page on purpose: the practice exercises of WiseSpeak (the
 * U1_ANSWERS and U7_FILL words), which are never counted for credit.
 *
 * In both modes, the public source of every private reading bank (a row
 * with `private: true` in tools/import-readings.mjs, or a file saying
 * keys: "private") is checked too: src/content/readings/<slug>.json must say
 * keys: "private" and carry no answer, accept or tr on any question; so is
 * every private textbook (keys: "private"; every "elec" book is one). Those
 * belong only in the assessment-keys checkout (docs/reading-rooms.md).
 */
import fs from 'node:fs';
import path from 'node:path';
import { COURSES, singleSections } from './single-pages-lib.mjs';
import { PRIVATE_READINGS } from './import-readings.mjs';
import { privateReadingLeaks } from './grading-keys-lib.mjs';

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
  if (!isUnit && (U.questions || []).length) note(`${rel}: a live test page still carries the question bank`);
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
  // The teaching passages of the missed-question review hold the answers
  // (tools/exam-review.mjs): a live page never loads them before a pass.
  if (/\/assets\/exam-review\//.test(html) || html.includes('CTS_EXAM_REVIEW =')) note(`${rel}: a live page loads the review passages, which hold the answers`);
}
/* ...and the passages are not a script a browser could load: in a live build
   they are JSON the Worker alone reads, after a passed attempt (answer-
   disclosure policy, Wayne, 18 Oct 2026; worker/index.js refuses the path). */
let reviewFiles = 0;
if (!expectKeys) {
  const rd = path.join(dir, 'assets', 'exam-review');
  for (const f of fs.existsSync(rd) ? fs.readdirSync(rd) : []) {
    if (f.endsWith('.json')) reviewFiles++;
    else note(`assets/exam-review/${f}: review passages published as something other than the Worker's JSON`);
  }
  if (testPages && !reviewFiles) note('assets/exam-review has no review passages for the Worker to send after a pass');
}
function liveScriptOk(html) { return /\/assets\/js\/cts-grading\.js/.test(html); }

/* ---- the single-page courses ---- */
let singlePages = 0;
{
  const secretKeys = /^(correct|answer|accept|why|explain\w*|model\w*|rubric\w*|kw_\w+|keywords|minHits)$/;
  const walkKeys = (v, where, path = '') => {
    if (Array.isArray(v)) v.forEach((x, i) => walkKeys(x, where, path + '[' + i + ']'));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) {
      if (secretKeys.test(k)) note(`${where}: ${path}.${k} is a key in a live page`); else walkKeys(x, where, path + '.' + k);
    }
  };
  const sections = expectKeys ? [] : singleSections({ root: ROOT });
  const longTexts = new Map();           // file -> strings that must not appear
  for (const sec of sections) {
    const set = longTexts.get(sec.file) ?? longTexts.set(sec.file, new Set()).get(sec.file);
    const grab = (v) => { if (typeof v === 'string' && v.trim().length >= 40) set.add(v.trim()); else if (v && typeof v === 'object') Object.values(v).forEach(grab); };
    sec.mc.forEach((q) => grab(q.why)); sec.sa.forEach((q) => grab(q.model));
  }
  const decode = (t) => t.replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\"/g, '"').replace(/\\'/g, "'");
  for (const c of Object.values(COURSES)) {
    for (const file of c.family === 'ethics' ? c.files : [c.file]) {
      for (const v of ['', 'es', 'fr']) {
        const f = path.join(dir, v, file);
        if (!fs.existsSync(f)) continue;
        singlePages++;
        const html = fs.readFileSync(f, 'utf8'), rel = path.relative(dir, f);
        if (expectKeys) {
          if (!/cts-shadow-single\.js/.test(html) || !/cts-shadow\.js/.test(html)) note(`${rel}: a shadow page without the shadow hook`);
          if (/cts-single-live\.js|cts-grading\.js/.test(html)) note(`${rel}: a shadow page loads the live scripts`);
          if (!/\bcorrect\s*:\s*\d/.test(html)) note(`${rel}: a shadow page has no answer keys`);
          continue;
        }
        if (!/cts-single-live\.js/.test(html) || !/cts-grading\.js/.test(html)) note(`${rel}: a live page without the live scripts`);
        if (/cts-shadow/.test(html)) note(`${rel}: a live page loads the shadow hook`);
        const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((x) => x.includes(c.family === 'ethics' ? 'const mcQuestions' : 'const UNITS')) || '';
        // the question blocks, read as data
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const ln = lines[i];
          let m;
          if ((m = /^UNITS\[(\d+)\] = (\{.*\});$/.exec(ln))) walkKeys(JSON.parse(m[2]), `${rel} UNITS[${m[1]}]`);
          else if (/^UNITS\[\d+\] = /.test(ln)) note(`${rel}: a unit block that is not stripped data`);
          if ((m = /^const (mcQuestions|kwQuestions) = (\[.*\]);$/.exec(ln))) walkKeys(JSON.parse(m[2]), `${rel} ${m[1]}`);
          if ((m = /^const (FRENCH_COURSE|FRENCH_UNIT|FRENCH_WISESPEAK)=(.*);$/.exec(ln))) walkKeys(JSON.parse(m[2]), `${rel} ${m[1]}`);
        }
        if (c.family === 'ethics' && !/^const mcQuestions = \[\{/m.test(code)) note(`${rel}: the multiple-choice block is not stripped data`);
        if (/\.answer\.fr\s*=/.test(code)) note(`${rel}: French fill-in answers are still written into the page`);
        // only the scripts: the lesson prose is meant to be on the page, and some explanations quote it
        const hay = decode([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n'));
        for (const t of longTexts.get(file) ?? []) if (hay.includes(decode(JSON.stringify(t).slice(1, -1))) || hay.includes(t)) note(`${rel}: a model answer or explanation (${t.slice(0, 40)}...) is on the page`);
      }
    }
    if (!expectKeys) {
      const f = path.join(dir, `assets/js/fill/${c.fill}.js`);
      const text = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
      if (!text) note(`assets/js/fill/${c.fill}.js is missing`);
      else {
        const w = {}; new Function('window', text)(w);
        walkKeys(w.CTS_FILL_DATA?.[c.fill], `assets/js/fill/${c.fill}.js`);
        if (!/qid/.test(text)) note(`assets/js/fill/${c.fill}.js has no question ids`);
      }
    } else {
      const f = path.join(dir, `assets/js/fill/${c.fill}.js`);
      if (!fs.existsSync(f) || !/"answer"/.test(fs.readFileSync(f, 'utf8'))) note(`assets/js/fill/${c.fill}.js: a shadow build keeps its fill-in answers`);
    }
  }
}

/* ---- the public source of the private reading banks ---- */
let privateReadings = 0, privateBooks = 0;
{
  const rdir = path.join(ROOT, 'src/content/readings');
  const files = fs.existsSync(rdir) ? fs.readdirSync(rdir).filter((f) => f.endsWith('.json')) : [];
  const flagged = new Set(PRIVATE_READINGS);
  for (const f of files) {
    const pub = JSON.parse(fs.readFileSync(path.join(rdir, f), 'utf8'));
    if (pub.keys === 'private') flagged.add(pub.slug);
  }
  for (const slug of flagged) {
    const f = path.join(rdir, `${slug}.json`);
    if (!fs.existsSync(f)) { note(`src/content/readings/${slug}.json: a private reading row has no public file; run node tools/import-readings.mjs --write`); continue; }
    privateReadings++;
    for (const m of privateReadingLeaks(JSON.parse(fs.readFileSync(f, 'utf8')), `src/content/readings/${slug}.json`)) note(m);
  }
  /* the private textbooks (keys: "private", the electives'; every "elec" book must be one) */
  const tdir = path.join(ROOT, 'src/content/textbooks');
  for (const f of fs.existsSync(tdir) ? fs.readdirSync(tdir).filter((x) => x.endsWith('.json')) : []) {
    const pub = JSON.parse(fs.readFileSync(path.join(tdir, f), 'utf8'));
    if (pub.keys !== 'private' && !String(pub.slug).startsWith('elec')) continue;
    privateBooks++;
    for (const m of privateReadingLeaks(pub, `src/content/textbooks/${f}`)) note(m);
  }
}

if (!unitPages && !testPages) problems.push(`no page with question data found under ${dir}: is it built?`);
if (!singlePages) problems.push(`no single-page course found under ${dir}: is it built?`);
if (expectKeys) {
  if (!withKeys) problems.push('no shadow page carries answer keys');
  if (shadowHook < unitPages + testPages) problems.push(`only ${shadowHook} of ${unitPages + testPages} shadow pages carry cts-shadow.js`);
  if (liveScript) problems.push(`${liveScript} shadow pages load cts-grading.js`);
}

if (problems.length) {
  console.error(`FAIL — ${expectKeys ? 'shadow' : 'live'} build ${dir}:`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(expectKeys
  ? `PASS — shadow build: ${unitPages} unit pages and ${testPages} test pages keep their keys (${withKeys} with keys) and post to /api/shadow (${shadowHook} carry the hook); ${singlePages} single-page course pages keep theirs and carry the hook.`
  : `PASS — live build: ${unitPages} unit pages and ${testPages} test pages carry no answer key, accept list, model answer, keyword, rubric, explanation or review passage (${reviewFiles} passage files kept for the Worker); nor do the ${singlePages} single-page course pages (Counseling, Narrative and WiseSpeak Preaching, Ethics) or their fill-in data.`);
console.log(`PASS — ${privateReadings} private reading bank(s) and ${privateBooks} private textbook bank(s): their public files carry no answer, accept or tr.`);
