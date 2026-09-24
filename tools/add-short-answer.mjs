// Append short-answer questions to unit files from JSON drafts.
//
//   node tools/add-short-answer.mjs <dir-of-drafts> [--write]
//
// Each draft is <Course>-<unit>.json: an array of {prompt:{en,es},
// keywords:{en:[8],es:[8]}, model:{en,es}}. Without --write it only checks:
// shape, eight keywords a side, and that the model answer in each language
// would itself pass the engine's grader (three keyword hits), so a student
// who writes the model answer is never marked wrong. Written on 24 Sept 2026
// when the 29 units short of ten questions were brought up to ten.
import fs from 'node:fs';
import path from 'node:path';

const [dir, flag] = process.argv.slice(2);
if (!dir) { console.error('usage: add-short-answer.mjs <dir> [--write]'); process.exit(2); }
const write = flag === '--write';

// the engine's normalisation, copied so the check shares its rules
const norm = (s) => ' ' + String(s || '').toLowerCase().replace(/[^a-z0-9áéíóúñü\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
const hits = (answer, ks) => ks.filter((k) => norm(answer).includes(norm(k).trim())).length;

let problems = 0, added = 0;
for (const f of fs.readdirSync(dir).filter((f) => /^CTS[A-Za-z]+-\d+\.json$/.test(f)).sort()) {
  const [, course, unit] = /^(CTS[A-Za-z]+)-(\d+)\.json$/.exec(f);
  const draft = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const target = `src/content/units/${course}/${unit}.json`;
  const u = JSON.parse(fs.readFileSync(target, 'utf8'));
  const label = `${course} u${unit}`;
  for (const [i, q] of draft.entries()) {
    const where = `${label} q${i + 1}`;
    for (const lang of ['en', 'es']) {
      if (!q.prompt?.[lang] || !q.model?.[lang]) { console.error(`${where}: missing ${lang} prompt/model`); problems++; }
      const ks = q.keywords?.[lang];
      if (!Array.isArray(ks) || ks.length !== 8) { console.error(`${where}: ${lang} keywords not 8`); problems++; continue; }
      const h = hits(q.model[lang], ks);
      if (h < 3) { console.error(`${where}: ${lang} model answer scores ${h}/8 keywords — would fail`); problems++; }
    }
  }
  const have = u.sa.length, want = 10;
  if (have + draft.length !== want) { console.error(`${label}: has ${have}, draft adds ${draft.length}, total ${have + draft.length} != ${want}`); problems++; }
  if (write && !problems) {
    u.sa.push(...draft);
    fs.writeFileSync(target, JSON.stringify(u, null, 1));
    added += draft.length;
  }
  console.log(`${label}: ${have} + ${draft.length}`);
}
if (problems) { console.error(`${problems} problem(s); nothing written`); process.exit(1); }
console.log(write ? `wrote ${added} questions` : 'check passed; add --write to apply');
