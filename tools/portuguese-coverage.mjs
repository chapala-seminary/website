#!/usr/bin/env node
// Source inventory only. Never read private grading banks or student records.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const hash = (text, algorithm = 'sha256') => crypto.createHash(algorithm).update(text).digest('hex');
const present = value => typeof value === 'string' ? !!value.trim() : Array.isArray(value) && value.length > 0 && value.every(present);
const words = value => (Array.isArray(value) ? value.join(' ') : value).replace(/<[^>]*>/g, ' ').match(/\S+/g)?.length || 0;

export function measure(value) {
  const fields = [];
  function walk(node, pointer = '', owner = null, fieldKey = null) {
    if (!node || typeof node !== 'object') return;
    if (present(node.en)) {
      const translated = present(node.pt) && (!Array.isArray(node.en) || (Array.isArray(node.pt) && node.en.length === node.pt.length));
      // Provenance belongs to the block containing text, not to the text map.
      const provenance = owner?.tr?.[fieldKey]?.pt || (fieldKey === 'text' ? owner?.tr?.pt : null);
      let state = translated ? 'present-unreviewed' : 'missing';
      if (translated && provenance) state = typeof node.en === 'string' && provenance.from && provenance.from !== hash(node.en, 'sha1').slice(0, 12)
        ? 'stale' : provenance.status === 'human' ? 'human-status-unverified' : 'machine-or-unreviewed';
      fields.push({pointer, sourceWords: words(node.en), state, sourceHash: hash(JSON.stringify(node.en)), ...(provenance ? {provenance: provenance.status || 'unrecorded'} : {})});
    }
    for (const [key, child] of Object.entries(node)) {
      // Do not include key/rubric data, even if an unexpected public file has it.
      if (/^(answer|answers|accept|rubric|rubrics|keywords|model|why|correct|tr|explanation|explanations)$/i.test(key)) continue;
      walk(child, `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`, node, key);
    }
  }
  walk(value);
  return fields;
}

export function references(html, route) {
  const found = new Map();
  for (const match of html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (href.startsWith('#')) continue;
    let url;
    try { url = new URL(href, 'https://inventory.invalid' + route); } catch { continue; }
    if (!['http:', 'https:'].includes(url.protocol)) continue;
    // Queries/fragments can carry credentials; they are never inventoried.
    if (/\/macros\/s\//.test(url.pathname)) continue;
    const external = !['inventory.invalid', 'chapalaseminary.org', 'beta.chapalaseminary.org'].includes(url.hostname);
    const target = (external ? url.origin : '') + url.pathname;
    found.set(target, {target, state: external ? 'external-source-language-rights-and-assignment-audit-pending' : 'local-target-translation-and-route-audit-pending'});
  }
  return [...found.values()].sort((a, b) => a.target.localeCompare(b.target, 'en'));
}

export function inventory(root) {
  const tracked = execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean).sort();
  const records = [];
  for (const file of tracked) {
    // Explicit public-source allowlist; private banks and review packets excluded.
    if (!/^(src\/(content\/(courses|lessons|units-public|textbooks|readings|papers|finals)\/|(?:body|pages|layouts|components|lib)\/|data\/(interface\/|[^/]+\.json$|textbooks\/|french-readings\/))|public\/|worker\/.*\.js$)/.test(file)) continue;
    const bytes = fs.readFileSync(path.join(root, file));
    const record = {path: file, sha256: hash(bytes), bytes: bytes.length};
    if (file.endsWith('.json')) {
      const value = JSON.parse(bytes);
      record.course = value.course || value.code || null;
      const prefix = value.pagePrefix || (file.startsWith('src/content/lessons/') ? value.course : null);
      record.route = value.page ? `/pt/${value.page}.html` : value.entry ? `/pt/${value.entry}` : prefix && Number.isInteger(value.unit) ? `/pt/${prefix}Unit${value.unit}.html` : null;
      record.fields = file.includes('/french-readings/') ? [] : measure(value);
      if (record.route) record.references = references([value.body?.en || '', ...(value.blocks || []).map(b => b.text?.en || '')].join('\n'), record.route);
      record.state = record.fields.length ? 'measured-source-fields' : 'requires-pair-or-render-audit';
      if (file.includes('/interface/static/pt/')) record.storedPairs = value.pairs?.length || 0;
    } else {
      record.state = /\.(pdf|docx|epub|txt|rtf|odt)$/.test(file) ? 'requires-rights-source-and-translation-audit' : 'requires-render-or-service-audit';
      if (file.endsWith('.html')) record.references = references(bytes.toString('utf8'), '/' + path.basename(file));
    }
    records.push(record);
  }
  const states = {};
  for (const record of records) for (const field of record.fields || []) states[field.state] = (states[field.state] || 0) + 1;
  return {
    schemaVersion: 1,
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim(),
    sourceTree: execFileSync('git', ['rev-parse', 'HEAD^{tree}'], {cwd: root, encoding: 'utf8'}).trim(),
    language: 'pt',
    limitations: ['Source presence is not rendered coverage or theological approval.', 'Hashes describe working files; compare them before reusing this report.', 'Private grading parity requires a separate private-repository audit; no keys are read or exported.', 'Dictionary/pair presence does not prove that a current rendered source uses the entry.', 'Human provenance status is reported, not independently certified.', 'Binary files and generated routes need separate review; routes listed here are candidates, not HTTP acceptance.'],
    privateGrading: {state: 'not-audited', required: ['stable IDs', 'MC option positions', 'PT answer acceptance', 'PT explanations and rubrics', 'no public keys']},
    summary: {files: records.length, languageFields: Object.values(states).reduce((a, b) => a + b, 0), states, missingSourceWords: records.flatMap(r => r.fields || []).filter(f => f.state === 'missing').reduce((n, f) => n + f.sourceWords, 0)},
    records: records.map(({fields, ...record}) => fields ? {...record,
      fieldStates: fields.reduce((counts, f) => ({...counts, [f.state]: (counts[f.state] || 0) + 1}), {}),
      missingSourceWords: fields.filter(f => f.state === 'missing').reduce((n, f) => n + f.sourceWords, 0),
      missing: fields.filter(f => f.state === 'missing').map(f => f.pointer),
      stale: fields.filter(f => f.state === 'stale').map(f => f.pointer),
    } : record),
  };
}

export function builtInventory(directory, missingDictionaryFile) {
  const pages = [];
  const visit = relative => {
    for (const entry of fs.readdirSync(path.join(directory, relative), {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const file = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.name.endsWith('.html')) {
        const html = fs.readFileSync(path.join(directory, file), 'utf8');
        pages.push({route: '/' + file, sha256: hash(html),
          declaredPortuguese: /<html\b[^>]*\blang=["']pt(?:-BR)?["']/i.test(html),
          fallbackMarkers: (html.match(/\bdata-cts-fallback(?:=|[\s>])/g) || []).length,
          state: 'built-html-observed-interaction-and-visual-audit-pending'});
      }
    }
  };
  visit('pt');
  return {pages, missingInterface: JSON.parse(fs.readFileSync(missingDictionaryFile, 'utf8')),
    limitation: 'Marker counts are diagnostics, not proof of no English fallback; browser-produced text and links require interaction checks.'};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const report = inventory(root);
  const output = process.argv[2];
  const built = process.argv.indexOf('--built');
  if (built >= 0) report.built = builtInventory(path.resolve(process.argv[built + 1]), path.join(root, '.astro/interface-missing-pt.json'));
  if (output) fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  else process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}
