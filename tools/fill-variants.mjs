/* Accepted answers for every fill-in-the-blank question: three to five per
 * language (Dr. Cook's beta audit, 4 Oct 2026 -- the rule the textbook and
 * required-reading tests already meet). A form only counts if the grader can
 * tell it apart: capitals, accents, punctuation and one leading article are
 * ignored (fillRight() in cts-fill.js), so "La gracia" is not a second form of
 * "gracia".
 *
 *   node tools/fill-variants.mjs --list <group>           what each question has and needs (JSON)
 *   node tools/fill-variants.mjs --apply <variants.json>  validate and add; prints rejects
 *   node tools/fill-variants.mjs --check                  every question has 3-5 per language
 *
 * Groups: an engine course (CTSWR ...) or a single-page course (counseling,
 * narrative, wisespeak, ethics). Engine courses are written to
 * src/content/units/<C>/<n>.json; single-page courses to their drafts in
 * _review/fill-ins/drafts/<course>/, after which
 * `node tools/add-fill-ins-page.mjs --course <course> --write` regenerates the page data.
 *
 * Variants file: { "<group>/<unit>#<n>": { "en": [...], "es": [...] } }, n from 1.
 */
import fs from 'node:fs';
import path from 'node:path';

function normalise(s) { return ' ' + String(s || '').toLowerCase().replace(/[^a-z0-9áéíóúñü\s]/g, ' ').replace(/\s+/g, ' ') + ' '; }
function fold(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/ñ/g, 'ñ').replace(/[̀-ͯ]/g, ''); }
const bare = (s) => normalise(fold(s)).trim().replace(/^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas) (?=\S)/, '');

const UNITS = 'src/content/units', DRAFTS = '_review/fill-ins/drafts';
const PAGE = ['counseling', 'narrative', 'wisespeak', 'ethics'];
const MIN = 3, MAX = 5;

function load(group) {           // -> [{id, file, list, i, q}]
  const out = [];
  const dir = PAGE.includes(group) ? path.join(DRAFTS, group) : path.join(UNITS, group);
  for (const f of fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b))) {
    const file = path.join(dir, f), data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const list = PAGE.includes(group) ? data : (data.fill || []);
    list.forEach((q, i) => out.push({ id: `${group}/${parseInt(f)}#${i + 1}`, file, data, list, i, q }));
  }
  return out;
}
const forms = (q, l) => { const seen = new Set(), keep = [];
  for (const s of [q.answer[l], ...(q.accept?.[l] ?? [])]) { const b = bare(s); if (b && !seen.has(b)) { seen.add(b); keep.push(s); } }
  return keep; };
const groups = () => [...fs.readdirSync(UNITS).filter((d) => fs.statSync(path.join(UNITS, d)).isDirectory()), ...PAGE];

const [cmd, arg] = process.argv.slice(2);
if (cmd === '--list') {
  console.log(JSON.stringify(load(arg).map(({ id, q }) => ({ id, prompt: q.prompt,
    have: { en: forms(q, 'en'), es: forms(q, 'es') },
    need: { en: Math.max(0, MIN - forms(q, 'en').length), es: Math.max(0, MIN - forms(q, 'es').length) } })), null, 1));
} else if (cmd === '--apply') {
  const v = JSON.parse(fs.readFileSync(arg, 'utf8'));
  const byGroup = new Map();
  for (const id of Object.keys(v)) { const g = id.split('/')[0]; if (!byGroup.has(g)) byGroup.set(g, load(g)); }
  const touched = new Set(); let added = 0; const rejects = [];
  for (const [id, add] of Object.entries(v)) {
    const e = byGroup.get(id.split('/')[0]).find((x) => x.id === id);
    if (!e) { rejects.push(`${id}: no such question`); continue; }
    for (const l of ['en', 'es']) for (const s of add[l] ?? []) {
      const have = forms(e.q, l), b = bare(s);
      if (!b) { rejects.push(`${id} ${l} "${s}": empty after normalising`); continue; }
      if (have.some((h) => bare(h) === b)) continue;                      // already accepted: not an error
      if (have.length >= MAX) { rejects.push(`${id} ${l} "${s}": already ${MAX} forms`); continue; }
      if (/_{2,}/.test(s) || b.split(' ').length > 6) { rejects.push(`${id} ${l} "${s}": not a short answer`); continue; }
      e.q.accept = e.q.accept ?? {}; e.q.accept[l] = [...(e.q.accept[l] ?? []), s.trim()];
      added++; touched.add(e.file);
    }
  }
  for (const f of touched) {
    const e = [...byGroup.values()].flat().find((x) => x.file === f);
    const raw = fs.readFileSync(f, 'utf8');
    fs.writeFileSync(f, JSON.stringify(e.data, null, raw.match(/^[[{]\n( +)/)?.[1].length ?? 2) + (raw.endsWith('\n') ? '\n' : ''));
  }
  console.log(`${added} form(s) added in ${touched.size} file(s); ${rejects.length} rejected`);
  for (const r of rejects) console.log('  ' + r);
} else if (cmd === '--check') {
  let bad = 0, n = 0;
  for (const g of groups()) for (const { id, q } of load(g)) { n++;
    for (const l of ['en', 'es']) { const k = forms(q, l).length; if (k < MIN || k > MAX) { bad++; if (bad <= 20) console.log(`${id} ${l}: ${k} form(s)`); } } }
  console.log(`${n} questions; ${bad} language list(s) outside ${MIN}-${MAX}`);
  process.exit(bad ? 1 : 0);
} else { console.error('usage: --list <group> | --apply <file> | --check'); process.exit(2); }
