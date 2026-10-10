/* The eight proposed five-reading banks staged for faculty review (10 Oct
 * 2026): src/data/readings/staged/. Read-only: this writes nothing.
 *
 *   node tools/verify-staged-readings.mjs
 *
 * Checks that the staged files are the ones ChatGPT delivered (SHA-256 in
 * academic_manifest.json), that each bank has the agreed shape (40 questions,
 * eight per reading, four drawn per reading, 18 of 20 to pass), that every
 * one is inactive and NOT installed (no src/content/readings file, not in
 * tools/import-readings.mjs), and that every primary answer, English and
 * Spanish, occurs in the course's reading room -- the five CTS digests the
 * questions are written on. Missing accepted alternates are counted and
 * reported, not failed: faculty supply them (299 of 320 when staged). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DIR = 'src/data/readings/staged';
const m = JSON.parse(fs.readFileSync(path.join(DIR, 'academic_manifest.json'), 'utf8'));
const problems = [];
const bad = (s) => problems.push(s);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ');
const text = (h) => norm(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"'));
const importer = fs.readFileSync('tools/import-readings.mjs', 'utf8');

if (m.requiredFrom !== null || m.never_auto_import !== true) bad('manifest: requiredFrom must be null and never_auto_import true');
let total = 0, missingAlt = 0;
for (const c of m.courses) {
  const tag = `${c.course} (${c.slug})`;
  const raw = fs.readFileSync(path.join(DIR, `${c.slug}.bank.json`));
  const accRaw = fs.readFileSync(path.join(DIR, `${c.slug}.accept.json`));
  if (crypto.createHash('sha256').update(raw).digest('hex') !== c.bank_sha256) bad(`${tag}: bank differs from the delivered file`);
  if (crypto.createHash('sha256').update(accRaw).digest('hex') !== c.accept_sha256) bad(`${tag}: accept file differs from the delivered file`);
  if (c.requiredFrom !== null || c.academic_status !== 'DRAFT_NEEDS_FACULTY_REVIEW' || c.deployment_status !== 'STAGING_ONLY') bad(`${tag}: not marked inactive draft staging`);
  if (fs.existsSync(path.join('src/content/readings', `${c.slug}.json`))) bad(`${tag}: installed in src/content/readings`);
  if (importer.includes(c.slug)) bad(`${tag}: listed in tools/import-readings.mjs`);
  const bank = JSON.parse(raw), acc = JSON.parse(accRaw), qs = bank.questions;
  const f = bank.format || {};
  if (qs.length !== 40 || f.questions_per_attempt !== 20 || f.questions_drawn_per_reading !== 4 || f.passing_score !== 18) bad(`${tag}: not 40 questions / 20 drawn / 4 per reading / 18 to pass`);
  for (let r = 1; r <= 5; r++) if (qs.filter((q) => q.reading === r).length !== 8) bad(`${tag}: reading ${r} does not have eight questions`);
  if (new Set(qs.map((q) => q.id)).size !== qs.length) bad(`${tag}: duplicate question ids`);
  const room = path.join('src/body/rooms', c.reading_room);
  if (!fs.existsSync(room)) { bad(`${tag}: reading room ${room} not found`); continue; }
  const src = text(fs.readFileSync(room, 'utf8'));
  let found = 0;
  for (const q of qs) {
    if (q.en.split('____').length !== 2 || q.es.split('____').length !== 2) bad(`${tag} #${q.id}: needs exactly one blank in each language`);
    const en = src.includes(norm(q.answer_en)), es = src.includes(norm(q.answer_es));
    if (en && es) found++;
    else bad(`${tag} #${q.id}: answer not in ${c.reading_room}: ${en ? '' : `EN "${q.answer_en}" `}${es ? '' : `ES "${q.answer_es}"`}`);
    const a = acc[String(q.id)] || {};
    if (!(a.en || []).length || !(a.es || []).length) missingAlt++;
  }
  total += qs.length;
  console.log(`${tag}: ${found} of ${qs.length} primary answers found in ${c.reading_room} in both languages`);
}
console.log(`${m.courses.length} staged banks, ${total} questions; ${missingAlt} still need accepted alternates from faculty (not an error)`);
if (problems.length) { for (const p of problems) console.error('  ' + p); console.error(`FAIL: ${problems.length} problem(s)`); process.exit(1); }
console.log('PASS: staged only, inactive, unchanged, answers supported by the reading rooms. Nothing written.');
