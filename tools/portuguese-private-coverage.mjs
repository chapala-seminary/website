#!/usr/bin/env node
// Optional local-only audit. Emits counts, never answers, prompts, rubrics,
// key hashes, grading explanations or student information.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export function privateFieldCounts(value) {
  const counts = {};
  const present = v => typeof v === 'string' ? !!v.trim() : Array.isArray(v) && v.length > 0 && v.every(present);
  function visit(node, category = 'other') {
    if (!node || typeof node !== 'object') return;
    if (present(node.en)) {
      const bucket = counts[category] ||= {total: 0, portuguesePresent: 0, portugueseMissing: 0};
      bucket.total++;
      bucket[present(node.pt) ? 'portuguesePresent' : 'portugueseMissing']++;
    }
    for (const [key, child] of Object.entries(node)) visit(child, ['why', 'answer', 'accept', 'model', 'keywords', 'rubric'].includes(key) ? key : category);
  }
  visit(value);
  return counts;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.env.ASSESSMENT_KEYS) throw new Error('Set ASSESSMENT_KEYS to the private checkout; no default scan is allowed.');
  const root = fs.realpathSync(process.env.ASSESSMENT_KEYS);
  const website = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const records = [];
  for (const collection of ['units', 'textbooks', 'readings', 'finals']) {
    const visit = relative => {
      for (const item of fs.readdirSync(path.join(root, relative), {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
        const file = path.join(relative, item.name);
        if (item.isDirectory()) visit(file);
        else if (item.name.endsWith('.json')) {
          const privateData = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
          const publicFile = path.join(website, 'src/content', file.replace(/^units\//, 'units-public/'));
          if (!fs.existsSync(publicFile)) continue;
          const publicData = JSON.parse(fs.readFileSync(publicFile, 'utf8'));
          const parity = {};
          for (const kind of ['mc', 'fill', 'sa']) if (publicData[kind] || privateData[kind]) {
            parity[kind] = (publicData[kind]?.length || 0) === (privateData[kind]?.length || 0) ? 'same-count-order-not-semantically-verified' : 'count-mismatch';
          }
          if (publicData.test?.questions) parity.test = publicData.test.questions.length === privateData.test?.questions?.length ? 'same-count-order-not-semantically-verified' : 'count-mismatch';
          records.push({publicPath: path.relative(website, publicFile), fields: privateFieldCounts(privateData), parity});
        }
      }
    };
    visit(collection);
  }
  process.stdout.write(JSON.stringify({schemaVersion: 1,
    privateCommit: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(),
    limitations: ['Counts do not certify meaning, option alignment, IDs or grading acceptance.', 'Rubric fallback may be intentional; faculty must decide required language coverage.', 'No private text or key hash is exported.'], records}, null, 2) + '\n');
}
