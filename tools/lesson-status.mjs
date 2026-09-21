/* What each translation of a lesson is worth right now.
 *
 * This is the question a CMS has to answer before it can offer automatic
 * translation without doing damage: for every paragraph, in every language,
 * is the translation still a translation of what the author currently says?
 *
 * The answer comes from the `from` hash each translation carries -- a hash of
 * the source text it was made from. Hash the source as it stands today; if the
 * two differ, the author has edited since, and that translation is stale. Per
 * paragraph, not per lesson, which is the difference between "re-translate
 * this sentence" and "re-translate the whole unit and hope".
 *
 *   node tools/lesson-status.mjs                       every course
 *   node tools/lesson-status.mjs CTSHermeneutics       one course
 *   node tools/lesson-status.mjs CTSHermeneutics 3     one unit, block by block
 */
import fs from 'node:fs';
import path from 'node:path';
import { hash, isStale } from '../src/lib/lesson.ts';

const LESSONS = 'src/content/lessons';
const [, , COURSE, UNIT] = process.argv;

if (!fs.existsSync(LESSONS)) { console.log('no course has been converted yet'); process.exit(0); }
const courses = COURSE ? [COURSE] : fs.readdirSync(LESSONS);

const label = (b, lang, src) => {
  const t = b.type === 'figure' ? b.caption?.text : b.text;
  if (!t || t[src] == null) return null;
  if (t[lang] == null) return 'missing';
  if (isStale(b, lang, src)) return 'stale';
  const prov = b.type === 'figure' ? b.caption?.tr : b.tr;
  return prov?.[lang]?.status ?? 'untracked';
};

let anyStale = 0;
for (const course of courses) {
  const dir = path.join(LESSONS, course);
  if (!fs.existsSync(dir)) { console.error(`${course} is not converted`); process.exit(1); }
  const units = fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  for (const f of units) {
    const l = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (UNIT && String(l.unit) !== String(UNIT)) continue;
    const others = l.langs.filter((x) => x !== l.sourceLang);

    const tally = Object.fromEntries(others.map((x) => [x, {}]));
    for (const b of l.blocks)
      for (const lang of others) {
        const s = label(b, lang, l.sourceLang);
        if (s) tally[lang][s] = (tally[lang][s] || 0) + 1;
      }

    const line = others.map((lang) => {
      const t = tally[lang];
      anyStale += (t.stale || 0) + (t.missing || 0);
      const parts = Object.entries(t).sort().map(([k, n]) => `${n} ${k}`);
      return `${lang}: ${parts.join(', ') || '—'}`;
    }).join('   ');
    console.log(`${course} unit ${String(l.unit).padStart(2)}  ${l.blocks.length} blocks   ${line}`);

    if (!UNIT) continue;
    for (const b of l.blocks) {
      const states = others.map((lang) => `${lang}=${label(b, lang, l.sourceLang) ?? '—'}`).join(' ');
      const t = b.type === 'figure' ? b.caption?.text : b.text;
      const preview = (t?.[l.sourceLang] ?? '(illustration)').replace(/<[^>]+>/g, '').slice(0, 58);
      console.log(`   ${b.id.padEnd(9)} ${b.type.padEnd(9)} ${states.padEnd(14)} ${preview}`);
    }
  }
}

if (anyStale) console.log(`\n${anyStale} block translation(s) need attention.`);
else console.log('\nEvery translation is current with the source it was made from.');
