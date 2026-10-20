#!/usr/bin/env node
/* Print what is needed to write the rubrics of one single-page course unit:
 * the English lesson text, then each short-answer question with its English
 * model answer and keywords. Read-only; the rubric files are
 * src/data/single-rubrics/<course>.json (tools/rubric-guidelines.md).
 *
 *   node tools/single-rubric-dump.mjs <course> <unit> [--no-lesson]
 */
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { singleSections } from './single-pages-lib.mjs';

const [course, unitArg, ...flags] = process.argv.slice(2);
if (!course || unitArg == null) { console.error('usage: single-rubric-dump.mjs <course> <unit> [--no-lesson]'); process.exit(2); }
const sec = singleSections({ only: course }).find((s) => s.unit === Number(unitArg));
if (!sec) { console.error('no such unit'); process.exit(2); }

const skipLang = (n) => n.nodeType === 1 && /\blang-es\b|\blang-fr\b/.test(n.getAttribute('class') || '');
const textOf = (n) => (n.nodeType === 3 ? n.rawText : skipLang(n) ? '' : n.childNodes.map(textOf).join(''));
function lessonText() {
  const root = parse(fs.readFileSync('public/' + sec.file, 'utf8'));
  const host = sec.course === 'ethics' ? root : root.querySelector('#unit' + sec.unit);
  if (!host) return '(lesson not found)';
  for (const q of host.querySelectorAll('.quiz-section, script, style, .reg-form, #questionsContainer')) q.remove();
  const out = [];
  const walk = (n) => {
    if (n.nodeType !== 1) return;
    if (/\blang-es\b|\blang-fr\b/.test(n.getAttribute('class') || '')) return;
    if (/^(P|H[1-6]|BLOCKQUOTE|LI|DIV)$/.test(n.tagName) && !n.childNodes.some((c) => c.nodeType === 1 && /^(P|H[1-6]|BLOCKQUOTE|LI|DIV|UL|OL)$/.test(c.tagName))) {
      const t = textOf(n).replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
      return;
    }
    n.childNodes.forEach(walk);
  };
  walk(host);
  return out.join('\n\n');
}

console.log(`# ${course} unit ${sec.unit}  (page id ${sec.page}; scope ${sec.scope})\n`);
if (!flags.includes('--no-lesson')) console.log('## Lesson (English)\n\n' + lessonText() + '\n');
console.log('## Short-answer questions\n');
sec.sa.forEach((q, i) => {
  console.log(`### Q${i + 1} (index ${i})\n${q.prompt.en}\n\nModel answer (English):\n${q.model.en}\n\nKeywords (hints only): ${q.keywords.en.join(', ')}\n`);
});
