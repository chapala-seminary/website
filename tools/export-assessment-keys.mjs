#!/usr/bin/env node
/* Write the textbook and reading answer banks for the private assessment-keys
 * checkout. This public repo keeps its own copies until deploy sync is reading
 * that checkout (docs/ai-grading.md section 4).
 *
 *   node tools/export-assessment-keys.mjs <dir>
 *
 * <dir> must be outside this repository. Each file is
 * textbooks/<slug>.json or readings/<slug>.json:
 *
 *   { "slug", "test": { "questions": [ { "prompt", "answer", "accept", "chapter"|"reading" } ] } }
 *
 * Array order is the question id (tb:<slug>/fill/<i>, rd: the same way).
 * Do not reorder a file. The book text is not copied. A new bank, including
 * the Christian Education exam, is authored in the private checkout only.
 */
import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const destArg = process.argv[2];
if (!destArg) {
  console.error('usage: node tools/export-assessment-keys.mjs <dir>');
  process.exit(2);
}
const dest = path.resolve(destArg);
const relToRepo = path.relative(repo, dest);
if (relToRepo === '' || (!relToRepo.startsWith('..') && !path.isAbsolute(relToRepo))) {
  console.error('refusing to write assessment keys inside the public website repo');
  process.exit(2);
}

const keep = (q) => {
  const out = {};
  for (const f of ['prompt', 'answer', 'accept', 'chapter', 'reading']) if (q[f] !== undefined) out[f] = q[f];
  return out;
};

function writeKind(kind) {
  const src = path.join(repo, 'src/content', kind);
  const outDir = path.join(dest, kind);
  fs.mkdirSync(outDir, { recursive: true });
  let n = 0;
  for (const file of fs.readdirSync(src).filter((f) => f.endsWith('.json')).sort()) {
    const b = JSON.parse(fs.readFileSync(path.join(src, file), 'utf8'));
    if (!b.test?.questions) continue;
    const body = { slug: b.slug, test: { questions: b.test.questions.map(keep) } };
    fs.writeFileSync(path.join(outDir, file), JSON.stringify(body, null, 2) + '\n');
    n++;
  }
  return n;
}

const textbooks = writeKind('textbooks');
const readings = writeKind('readings');
fs.writeFileSync(path.join(dest, 'README.md'), `# Assessment keys

Private answer banks for Chapala Theological Seminary textbook and reading tests.

\`textbooks/<slug>.json\` and \`readings/<slug>.json\` hold \`test.questions\` in the order that is the question id: \`tb:<slug>/fill/<i>\` and \`rd:<slug>/fill/<i>\`. Do not reorder a file. Draw size, pass mark and course code stay in the public catalog.

\`tools/sync-grading-keys.mjs\` in the website repo reads this checkout when \`ASSESSMENT_KEYS\` points here, or when this directory is \`../assessment-keys\` beside that repo and contains \`textbooks/\`. A file whose length does not match the public bank is ignored while the public bank still has questions, so a short file cannot delete grading keys.

The book text is not in these files. A new bank, including the Christian Education exam, is written here and is not added to the public website repository.
`);
console.log(`wrote ${textbooks} textbook banks and ${readings} reading banks to ${dest}`);
