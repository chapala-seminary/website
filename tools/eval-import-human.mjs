#!/usr/bin/env node
// Imports a faculty member's grades from a filled blind sheet into
// test/eval/human/<grader>.json, separate from the agent-written items.
//
//   node tools/eval-import-human.mjs --grader wayne --sheet my-grades.csv \
//        --key test/eval-results/blind/sheet-cts-blind-1.key.json
//
// The sheet may be the full CSV from eval-blind-sheet.mjs or the short
// "my-grades.csv" the HTML page downloads; only sheet_id and your_grade are read.
// Each record is {id, qid, kind, lang, grade, expected_by: "<grader>", graded_at}.
// Re-importing replaces that grader's grade for the same item. Blank grades are
// skipped and reported. Nothing here touches the item files.
//
// Then: node tools/eval-grader.mjs --truth wayne ... scores the AI against that
// person's grades instead of the agent's.
import fs from 'node:fs';
import path from 'node:path';
import { EVAL_DIR, readItemFiles, isPosGrade } from './eval-lib.mjs';
import { SA_GRADES, FILL_GRADES } from './eval-blind-sheet.mjs';

const GRADERS = ['wayne', 'ted', 'robert'];
const ALIASES = { 'not met': 'not_met', notmet: 'not_met', 'not-met': 'not_met', no: 'not_met', n: 'not_met', yes: 'met', y: 'met', partial: 'partly', p: 'partly', correct: 'right', incorrect: 'wrong', r: 'right', w: 'wrong' };

export function parseCsv(text) {
  const rows = []; let row = [], cell = '', inQ = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else inQ = false; } else cell += c; }
    else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some(x => x !== '')) rows.push(row); row = []; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); if (row.some(x => x !== '')) rows.push(row); }
  return rows;
}

export function normaliseGrade(raw, kind) {
  const g0 = String(raw || '').trim().toLowerCase();
  if (!g0) return null;
  const g = ALIASES[g0] || g0.replace(/\s+/g, '_');
  const ok = kind === 'sa' ? SA_GRADES : FILL_GRADES;
  return ok.includes(g) ? g : undefined;   // undefined = not allowed for this kind
}

export function importGrades({ grader, csvText, key, items, existing = [], now = new Date().toISOString() }) {
  const table = parseCsv(csvText);
  const head = table[0].map(h => h.trim().toLowerCase());
  const iId = head.indexOf('sheet_id'), iGrade = head.indexOf('your_grade');
  if (iId < 0 || iGrade < 0) throw new Error('sheet needs columns sheet_id and your_grade');
  const bySheet = new Map(key.rows.map(r => [r.sheet_id, r]));
  const byItem = new Map(items.map(i => [i.id, i]));
  const merged = new Map(existing.map(g => [g.id, g]));
  const report = { imported: 0, blank: 0, invalid: [], unknown: [] };
  for (const r of table.slice(1)) {
    const sid = (r[iId] || '').trim();
    const k = bySheet.get(sid);
    if (!k) { report.unknown.push(sid); continue; }
    const it = byItem.get(k.id);
    const g = normaliseGrade(r[iGrade], it.kind);
    if (g === null) { report.blank++; continue; }
    if (g === undefined) { report.invalid.push(`${sid}: "${r[iGrade]}" is not allowed for a ${it.kind} item`); continue; }
    merged.set(it.id, { id: it.id, qid: it.qid, kind: it.kind, lang: it.lang, grade: g, expected_by: grader, graded_at: now });
    report.imported++;
  }
  return { grades: [...merged.values()].sort((a, b) => a.id.localeCompare(b.id)), report };
}

function main() {
  const argv = process.argv.slice(2);
  const opt = n => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
  const grader = opt('grader'), sheet = opt('sheet'), keyFile = opt('key');
  if (!GRADERS.includes(grader) || !sheet || !keyFile) { console.error(`usage: eval-import-human.mjs --grader ${GRADERS.join('|')} --sheet FILE.csv --key sheet-<seed>.key.json`); process.exit(2); }
  const dir = path.join(EVAL_DIR, 'human'), file = path.join(dir, `${grader}.json`);
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  const items = readItemFiles();
  const { grades, report } = importGrades({ grader, csvText: fs.readFileSync(sheet, 'utf8'), key: JSON.parse(fs.readFileSync(keyFile, 'utf8')), items, existing });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(grades, null, 1) + '\n');
  const byItem = new Map(items.map(i => [i.id, i]));
  const mine = grades.filter(g => byItem.has(g.id));
  const agree = mine.filter(g => isPosGrade(g.grade) === isPosGrade(byItem.get(g.id).expected)).length;
  console.log(`${report.imported} grades imported, ${report.blank} left blank, ${report.invalid.length} invalid, ${report.unknown.length} unknown sheet ids -> ${file}`);
  for (const m of report.invalid.slice(0, 10)) console.log('  invalid:', m);
  console.log(`${grader} vs the agent's expected grade (met/right vs not): ${agree}/${mine.length} agree. Disagreements are where the agent's labels need fixing.`);
}
import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
