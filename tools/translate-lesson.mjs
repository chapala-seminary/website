/* Translate missing/stale machine text and questions in one pass. Reviewed
 * human and machine-edited translations are always preserved, even stale.
 * `tag` is a plumbing check, never a French translation for publication. */
import fs from 'node:fs';
import path from 'node:path';
import { translationPlan, strings, applyTranslation } from './translation-plan.mjs';
const args = process.argv.slice(2);
const COURSE = args[0];
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i < 0 ? fallback : args[i + 1]; };
const DRY = args.includes('--dry-run'), LANG = opt('lang'), UNIT = opt('unit');
if (!COURSE || !/^[A-Za-z0-9_-]+$/.test(COURSE) || !LANG || !/^[a-z]{2,3}(?:-[A-Za-z]+)?$/.test(LANG)) {
  console.error('usage: node tools/translate-lesson.mjs <Course> --lang <code> [--unit N] [--provider tag] [--dry-run]'); process.exit(2);
}
const PROVIDERS = { tag: async (texts, from, to) => texts.map(t => `[${from}->${to}] ${t}`) };
const provider = PROVIDERS[opt('provider', 'tag')];
if (!Object.hasOwn(PROVIDERS, opt('provider', 'tag'))) { console.error(`no such provider: ${opt('provider')}`); process.exit(2); }
const dir = path.join('src/content/lessons', COURSE);
if (!fs.existsSync(dir)) { console.error(`${COURSE} has not been converted`); process.exit(1); }
let count = 0, files = 0;
const writes = [];
for (const name of fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f)).sort((a,b) => parseInt(a)-parseInt(b))) {
  const lessonPath = path.join(dir, name), lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
  if (UNIT && String(lesson.unit) !== String(UNIT)) continue;
  if (LANG === lesson.sourceLang) throw new Error(`${LANG} is the source language`);
  const unitPath = path.join('src/content/units', COURSE, name);
  // Refuse a lesson-only result: a readable translation needs matching keys.
  if (!fs.existsSync(unitPath)) throw new Error(`missing exam file ${unitPath}; nothing written`);
  const unit = JSON.parse(fs.readFileSync(unitPath, 'utf8'));
  if (unit.unit !== lesson.unit) throw new Error(`lesson/exam unit mismatch in ${unitPath}`);
  const plan = translationPlan(lesson, unit, LANG);
  for (const item of plan.protectedItems) console.log(`  ! unit ${lesson.unit} ${item}`);
  console.log(`unit ${lesson.unit}: ${plan.jobs.length} item(s) ${DRY ? 'would be' : ''} translated ${plan.source} -> ${LANG}`);
  count += plan.jobs.length;
  if (DRY || !plan.jobs.length) continue;
  const input = plan.jobs.flatMap(j => Object.values(j.original).flatMap(strings));
  const output = await provider(input, plan.source, LANG);
  if (!Array.isArray(output) || output.length !== input.length || output.some(t => typeof t !== 'string' || !t.trim())) throw new Error('invalid provider output; nothing written');
  for (const job of plan.jobs) applyTranslation(job, output, LANG);
  // A translation must retain one gap and the MC option order/count.
  for (const q of unit.fill || []) if (q.prompt[LANG] != null && q.prompt[LANG].split('____').length !== 2) throw new Error('translated fill prompt must have one blank; nothing written');
  for (const q of unit.mc || []) if (q.options[LANG] && q.options[LANG].length !== q.options[plan.source].length) throw new Error('translated options changed length; nothing written');
  if (!lesson.langs.includes(LANG)) lesson.langs.push(LANG);
  writes.push([lessonPath, lesson], [unitPath, unit]); files++;
}
// Prepare every unit before writing anything. Restore originals if a write fails.
const originals = writes.map(([file]) => [file, fs.readFileSync(file)]);
try { for (const [file, data] of writes) fs.writeFileSync(file, JSON.stringify(data, null, 1) + '\n'); }
catch (error) { for (const [file, bytes] of originals) fs.writeFileSync(file, bytes); throw error; }
console.log(DRY ? `\n${count} item(s) would be translated. Nothing was written.` : `\n${count} item(s) translated into ${LANG} across ${files} unit(s), marked machine.`);
