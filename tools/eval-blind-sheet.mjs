#!/usr/bin/env node
// Exports a seeded sample of eval items as a sheet for FACULTY to grade blind.
//
//   node tools/eval-blind-sheet.mjs --n 200 [--seed cts-blind-1] [--kinds sa,fill]
//        [--include-all] [--out test/eval-results/blind]
//
// Writes, in --out:
//   sheet-<seed>.csv   open in Excel/Sheets; fill the your_grade column
//   sheet-<seed>.html  the same sheet as a page: pick grades from menus, then
//                      "Download my grades (CSV)"
//   sheet-<seed>.key.json   sheet_id -> eval item id. KEEP THIS; do not send it.
//
// What the faculty member sees: the question, the reference (model answer, the
// accepted alternatives for a fill-in, the rubric if one exists), the answer,
// and an empty grade. What they do NOT see: the expected grade, the category
// (it would give the grade away), the item id (it names the category), or any
// AI verdict. Rows are shuffled with the seed. By default copied-question
// pastes and instruction-injection answers are left out: they are checked by
// rule, and a person grading them adds nothing (use --include-all to keep them).
//
// Grades come back through tools/eval-import-human.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, EVAL_DIR, readItemFiles, keyFor, applyHoldout, rng, shuffle } from './eval-lib.mjs';
import { selectItems } from './eval-grader.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const flag = n => argv.includes(`--${n}`);

export const SA_GRADES = ['met', 'partly', 'not_met'];
export const FILL_GRADES = ['right', 'wrong'];
const PLACEHOLDER = /strong answer integrates|a strong answer/i;

export function referenceFor(key, lang, kind) {
  if (kind === 'fill') {
    const answer = key.answer?.[lang] ?? key.answer?.en;
    const alts = [...(key.accept?.[lang] || [])];
    return `Official answer: ${answer}${alts.length ? `\nAlso accepted: ${alts.join('; ')}` : ''}`;
  }
  const m = key.model || {};
  const pick = [lang, 'en', 'fr', 'es'].map(l => m[l]).find(t => t && t.split(/\s+/).length > 5 && !PLACEHOLDER.test(t));
  const rub = key.rubric?.points?.length ? '\nRubric (essential points marked *): ' + key.rubric.points.map(p => `${p.essential ? '*' : ''}${p.id}) ${p.en}`).join(' | ') : '';
  return (pick || '(no model answer on file for this question)') + rub;
}

const q = s => `"${String(s).replace(/"/g, '""')}"`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function buildSheet({ items, seed, n, includeAll, kinds }) {
  let pool = items.filter(i => kinds.includes(i.kind));
  if (!includeAll) pool = pool.filter(i => i.category !== 'copied' && i.category !== 'injection');
  const chosen = shuffle(selectItems(pool, { limit: n, seed }), rng(`${seed}:order`));
  const rows = chosen.map((it, k) => {
    const key = applyHoldout(keyFor(it.qid), it.holdout);
    const [, course, unit] = /^u:([^/]+)\/(\d+)\//.exec(it.qid);
    return {
      sheet_id: `S${String(k + 1).padStart(3, '0')}`, itemId: it.id, kind: it.kind, lang: it.lang,
      course_unit: `${course} unit ${unit}`, type: it.kind === 'sa' ? 'Short answer' : 'Fill-in',
      question: (key.prompt && (key.prompt[it.lang] || key.prompt.en)) || '', reference: referenceFor(key, it.lang, it.kind),
      answer: it.answer, allowed: (it.kind === 'sa' ? SA_GRADES : FILL_GRADES).join(' / '),
    };
  });
  return rows;
}

export function toCsv(rows) {
  const head = ['sheet_id', 'course_unit', 'language', 'type', 'question', 'reference', 'student_answer', 'allowed_grades', 'your_grade', 'comment'];
  const lines = [head.join(',')];
  for (const r of rows) lines.push([r.sheet_id, r.course_unit, r.lang, r.type, r.question, r.reference, r.answer, r.allowed, '', ''].map(q).join(','));
  return '﻿' + lines.join('\r\n') + '\r\n';
}

export function toHtml(rows, title) {
  const body = rows.map(r => `<tr data-id="${r.sheet_id}"><td>${r.sheet_id}</td><td>${esc(r.course_unit)}<br><small>${r.lang.toUpperCase()} - ${r.type}</small></td><td>${esc(r.question)}</td><td class="ref">${esc(r.reference).replace(/\n/g, '<br>')}</td><td class="ans">${esc(r.answer)}</td><td><select><option value="">-</option>${r.allowed.split(' / ').map(g => `<option>${g}</option>`).join('')}</select><br><input placeholder="comment" size="18"></td></tr>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>body{font:15px/1.45 system-ui,sans-serif;margin:16px;color:#1b1b1b;background:#fff}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:6px 8px;vertical-align:top;text-align:left}th{background:#f1f1f1;position:sticky;top:0}.ref{font-size:13px;color:#333;background:#fafaf2}.ans{background:#eef6ff}button{font-size:15px;padding:8px 14px;margin:8px 0}@media(prefers-color-scheme:dark){body{background:#151515;color:#eee}th{background:#262626}.ref{background:#23231a;color:#ddd}.ans{background:#16212e}td,th{border-color:#555}}</style></head><body>
<h1>${esc(title)}</h1>
<p>Grade each student answer on its own. Short answers: <b>met</b> (every essential point made, nothing contradicted), <b>partly</b> (some but not all essential points) or <b>not_met</b>. Fill-ins: <b>right</b> or <b>wrong</b>. Do not look for a pattern; the answers are mixed on purpose. Your choices stay in this page until you download them.</p>
<button id="dl">Download my grades (CSV)</button> <span id="count"></span>
<table><thead><tr><th>#</th><th>Where</th><th>Question</th><th>Reference</th><th>Student answer</th><th>Your grade</th></tr></thead><tbody>
${body}
</tbody></table>
<script>
const rows=[...document.querySelectorAll('tbody tr')];
const count=()=>{document.getElementById('count').textContent=rows.filter(r=>r.querySelector('select').value).length+' of '+rows.length+' graded'};
document.addEventListener('change',count);count();
document.getElementById('dl').onclick=()=>{
 const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
 const lines=['sheet_id,your_grade,comment'].concat(rows.map(r=>[r.dataset.id,r.querySelector('select').value,r.querySelector('input').value].map(q).join(',')));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\\ufeff'+lines.join('\\r\\n')],{type:'text/csv'}));a.download='my-grades.csv';a.click();
};
</script></body></html>`;
}

function main() {
  const n = parseInt(opt('n', '200'), 10), seed = opt('seed', 'cts-blind-1');
  const kinds = opt('kinds', 'sa,fill').split(',');
  const out = path.resolve(opt('out', path.join(ROOT, 'test', 'eval-results', 'blind')));
  const rows = buildSheet({ items: readItemFiles(opt('items', EVAL_DIR)), seed, n, includeAll: flag('include-all'), kinds });
  fs.mkdirSync(out, { recursive: true });
  const base = path.join(out, `sheet-${seed}`);
  fs.writeFileSync(`${base}.csv`, toCsv(rows));
  fs.writeFileSync(`${base}.html`, toHtml(rows, `CTS grading sheet ${seed}`));
  fs.writeFileSync(`${base}.key.json`, JSON.stringify({ seed, note: 'sheet_id -> eval item id. Do not send to graders.', rows: rows.map(r => ({ sheet_id: r.sheet_id, id: r.itemId, kind: r.kind })) }, null, 1) + '\n');
  console.log(`${rows.length} rows -> ${base}.{csv,html}\nkey (keep private): ${base}.key.json`);
}
import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
