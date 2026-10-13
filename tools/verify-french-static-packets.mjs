/* Checks the French packets of the single-page courses (Narrative Preaching,
 * Biblical Counseling, Christian Ethics) against their English source packets:
 * every block present with the same HTML tags, the same question and option
 * counts, one blank per fill-in, keyword lists aligned with the English, and
 * every French model answer meeting its own keywords with the page's matcher.
 *   node tools/verify-french-static-packets.mjs [course] [--part <part>]   */
import fs from 'node:fs';
import { COURSES, extractCourse, sourceText, sha } from './french-static-courses.mjs';

const args = process.argv.slice(2);
const only = args.find(a => !a.startsWith('--') && COURSES[a]);
const partArg = args.includes('--part') ? args[args.indexOf('--part') + 1] : null;
const noHash = args.includes('--no-hash');
const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
// The page matchers, as written on each page (see the page scripts).
function hitWise(answer, kw) {
  if (Array.isArray(kw)) return kw.some(k => hitWise(answer, k));
  if (!answer || !kw) return false;
  const strip = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const a = strip(answer), k = strip(kw), esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (k.length <= 4 ? new RegExp('(^|[^\\p{L}])' + esc + '($|[^\\p{L}])', 'u') : new RegExp('(^|[^\\p{L}])' + esc, 'u')).test(a);
}
function hitPage(ans, k) {
  if (Array.isArray(k)) return k.some(x => hitPage(ans, x));
  k = (k || '').toLowerCase(); if (!k) return false;
  const WC = '0-9a-záéíóúñü';
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pat = k.length <= 4 ? '(?:^|[^' + WC + '])' + esc + '(?![' + WC + '])' : '(?:^|[^' + WC + '])' + esc;
  return new RegExp(pat, 'i').test(ans);
}
const tags = html => (String(html).match(/<\/?[a-z][a-z0-9]*/gi) || []).map(t => t.toLowerCase()).sort().join(' ');
const plain = html => String(html).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ');
const groups = (en, fr) => en.map((e, i) => { const forms = [].concat(fr[i]).map(s => String(s).toLowerCase().trim()).filter(Boolean); return [...new Set([...forms, ...forms.map(fold), String(e).toLowerCase()])]; });
const frenchOnly = (en, fr) => en.map((e, i) => [...new Set([].concat(fr[i]).map(s => String(s).toLowerCase().trim()).filter(Boolean).flatMap(f => [f, fold(f)]))]);

let problems = 0, warnings = 0, checked = 0;
const fail = (where, msg) => { problems++; console.log(`FAIL ${where}: ${msg}`); };
const warn = (where, msg) => { warnings++; console.log(`warn ${where}: ${msg}`); };
for (const key of Object.keys(COURSES)) {
  if (only && key !== only) continue;
  const c = COURSES[key];
  const hit = key === 'narrative' ? hitWise : hitPage;
  const minChars = key === 'narrative' ? 120 : 100;
  for (const [part, packet] of Object.entries(extractCourse(key))) {
    if (partArg && part !== partArg) continue;
    const file = `_review/french/${c.folder}/${c.folder}-${part === 'page' ? 'page' : 'unit' + part}-fr.json`;
    if (!fs.existsSync(file)) { fail(file, 'missing'); continue; }
    let f; try { f = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail(file, 'not JSON: ' + e.message); continue; }
    if (!noHash && (f.tr?.status !== 'machine' || f.tr?.from !== sha(sourceText(packet)))) fail(file, `tr must be {status:"machine", from:"${sha(sourceText(packet))}"}`);
    const byId = new Map((f.blocks || []).map(b => [b.id, b.fr]));
    for (const b of packet.blocks) {
      const fr = byId.get(b.id);
      if (!fr || !String(fr).trim()) { fail(file, `block ${b.id} has no French`); continue; }
      if (tags(fr) !== tags(b.en)) fail(file, `block ${b.id} HTML tags differ`);
      for (const m of b.en.matchAll(/href="([^"]+)"/g)) if (!fr.includes(`href="${m[1]}"`)) fail(file, `block ${b.id} lost link ${m[1]}`);
      checked++;
    }
    for (const id of byId.keys()) if (!packet.blocks.some(b => b.id === id)) fail(file, `unknown block ${id}`);
    const mc = f.mc || [], sa = f.sa || [], fill = f.fill || [];
    if (mc.length !== packet.mc.length) fail(file, `MC count ${mc.length} ≠ ${packet.mc.length}`);
    packet.mc.forEach((q, i) => {
      const t = mc[i]; if (!t) return;
      if (!t.stem || !t.why || !Array.isArray(t.options) || t.options.length !== q.options.length || t.options.some(o => !String(o).trim())) fail(file, `mc ${i + 1}: stem/why/options incomplete`);
      if ('answer' in t && t.answer !== q.answer) fail(file, `mc ${i + 1}: answer index changed`);
      if (new Set(t.options).size !== t.options.length) warn(file, `mc ${i + 1}: duplicate options`);
      checked++;
    });
    if (fill.length !== packet.fill.length) fail(file, `fill count ${fill.length} ≠ ${packet.fill.length}`);
    fill.forEach((q, i) => {
      if ((String(q.prompt).match(/_{3,}/g) || []).length !== 1) fail(file, `fill ${i + 1}: needs exactly one ____ blank`);
      if (!String(q.answer || '').trim()) fail(file, `fill ${i + 1}: no answer`);
      if (!Array.isArray(q.accept)) fail(file, `fill ${i + 1}: accept must be a list`);
      const ans = fold(String(q.answer).toLowerCase());
      if (ans.length > 3 && fold(String(q.prompt).toLowerCase()).includes(ans)) warn(file, `fill ${i + 1}: the prompt contains the answer`);
      checked++;
    });
    if (sa.length !== packet.sa.length) fail(file, `SA count ${sa.length} ≠ ${packet.sa.length}`);
    packet.sa.forEach((q, i) => {
      const t = sa[i]; if (!t) return;
      const where = `${file} sa ${i + 1}`;
      if (!t.prompt) fail(where, 'no prompt');
      if (q.model && !t.model) fail(where, 'no model answer');
      if (!Array.isArray(t.keywords) || t.keywords.length !== q.keywords.length) { fail(where, `keywords must align with the ${q.keywords.length} English keywords`); return; }
      for (const forms of t.keywords) for (const form of [].concat(forms)) {
        const letters = fold(String(form).toLowerCase()).replace(/[^a-z0-9]/g, '');
        if (!letters) fail(where, `empty keyword form`);
      }
      if (!Array.isArray(t.labels) || t.labels.length !== q.keywords.length) fail(where, 'labels must align with the keywords');
      const g = groups(q.keywords, t.keywords), fo = frenchOnly(q.keywords, t.keywords);
      const count = (text, list) => list.filter(k => hit(String(text).toLowerCase(), k)).length;
      if (t.model) {
        const n = count(plain(t.model), fo);
        if (n < 3) fail(where, `French model meets only ${n} French concepts (needs 3)`);
        else if (n < 4) warn(where, `French model meets only ${n} French concepts`);
        if (plain(t.model).length < minChars) warn(where, 'French model is shorter than the length the page requires');
      }
      const promptHits = count(plain(t.prompt), g);
      if (promptHits >= 3) warn(where, `the question alone meets ${promptHits} concepts`);
      checked++;
    });
  }
}
console.log(`${problems ? 'FAIL' : 'PASS'} — ${checked} French packet items checked, ${problems} problems, ${warnings} warnings.`);
if (problems) process.exit(1);
