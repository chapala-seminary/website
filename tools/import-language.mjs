#!/usr/bin/env node
/* Import translated course packets into the lesson and question files, for
 * any language after French (Swahili first). Modeled on
 * tools/import-french-drafts.mjs; see docs/swahili.md.
 *
 *   node tools/import-language.mjs --lang sw --from <packets dir> [--course=CTSActs,CTS]
 *        [--key-fix <file>] [--report <file>] [--write]
 *
 * A packet is two files per unit, in <packets dir>/<Course>/:
 *   <Course>-unit<N>-source.json   the English it was translated from
 *   <Course>-unit<N>-<lang>.json   the translation:
 *     blocks: [{ id, <lang> }] (or { id: text })
 *     mc:   [{ stem, options[4], why }]
 *     fill: [{ prompt (one ____), answer, accept[] }]
 *     sa:   [{ prompt, keywords[[synonyms]], model }]
 *
 * What it does, unit by unit:
 *   - every lesson block that has English gets the translation (text.<lang>);
 *   - every question gets its translated wording and keys (stem, options,
 *     why, prompt, answer, accept, keywords, model); the multiple-choice
 *     answer index is shared by all languages and is never changed: options
 *     are matched to the current English by their English wording;
 *   - each translated item is stamped tr.<lang> = { status: 'machine', from:
 *     hash of its English } (tools/translation-plan.mjs), and <lang> is added
 *     to the lesson's langs;
 *   - question keys go to the private assessment-keys checkout, never to this
 *     repository (tools/private-units.mjs unitWrites).
 *
 * It stops (exit 1, nothing written) when an item is MISSING: a block or a
 * question with English and no translation, a wrong count of questions or
 * options, a fill-in without exactly one blank. Reviewed work (human or
 * machine-edited) is never replaced.
 *
 * Where the site's English changed after the packet was made (a STALE item),
 * that item keeps the English and the page shows the translation-pending
 * note; the report lists it so a translator can update it. A unit whose
 * English no longer has the packet's blocks at all is refused.
 */
import fs from 'node:fs';
import path from 'node:path';
import { translationPlan } from './translation-plan.mjs';
import { unitWrites } from './private-units.mjs';

const argv = process.argv.slice(2);
const arg = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : argv.find((a) => a.startsWith(name + '='))?.slice(name.length + 1); };
const LANG = arg('--lang'), FROM = arg('--from'), WRITE = argv.includes('--write');
const ONLY = arg('--course')?.split(',');
const REPORT = arg('--report');
/* --key-fix <file>: corrections to the packets' English multiple-choice keys,
   [{ course, unit, mc (1-based), answer (0-based option of the packet) }]. */
const KEY_FIX = arg('--key-fix');
const keyFix = new Map((KEY_FIX ? JSON.parse(fs.readFileSync(KEY_FIX, 'utf8')) : []).map((k) => [`${k.course} ${k.unit} ${k.mc}`, k.answer]));
const keyNotes = [];
if (!LANG || !FROM) { console.error('usage: node tools/import-language.mjs --lang sw --from <packets dir> [--course=A,B] [--write] [--report file]'); process.exit(2); }
if (['en', 'es', 'fr'].includes(LANG)) { console.error(`${LANG} has its own tools; this importer is for later languages`); process.exit(2); }

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const sameText = (a, b) => norm(a) === norm(b);

const errors = [], stale = [], writes = [], summary = [];
let units = 0, blocksDone = 0, questionsDone = 0;

function courseDirs() {
  return fs.readdirSync(FROM).filter((c) => fs.statSync(path.join(FROM, c)).isDirectory())
    .filter((c) => !ONLY || ONLY.includes(c)).sort();
}

for (const course of courseDirs()) {
  const dir = path.join(FROM, course);
  const pairs = fs.readdirSync(dir).filter((n) => /-unit\d+-source\.json$/.test(n));
  if (!pairs.length) continue;
  if (!fs.existsSync(`src/content/lessons/${course}`)) { summary.push(`${course}: no lesson collection on the site (a single-page course); skipped`); continue; }
  for (const name of pairs.sort((a, b) => Number(/unit(\d+)/.exec(a)[1]) - Number(/unit(\d+)/.exec(b)[1]))) {
    const where = `${course}/${name.replace('-source.json', '')}`;
    const tfile = path.join(dir, name.replace('-source.json', `-${LANG}.json`));
    if (!fs.existsSync(tfile)) { errors.push(`${where}: no ${path.basename(tfile)}`); continue; }
    const source = readJson(path.join(dir, name)), draft = readJson(tfile);
    const unitNo = source.unit ?? Number(/unit(\d+)/.exec(name)[1]);
    const lp = `src/content/lessons/${course}/${unitNo}.json`, up = `src/content/units/${course}/${unitNo}.json`;
    if (!fs.existsSync(lp) || !fs.existsSync(up)) { errors.push(`${where}: the site has no ${lp} or ${up}`); continue; }
    const lesson = readJson(lp), unit = readJson(up);
    const before = errors.length;

    // ---- blocks
    const text = Array.isArray(draft.blocks)
      ? Object.fromEntries(draft.blocks.map((b) => [b.id, b[LANG] ?? b.text]))
      : { ...draft.blocks };
    const sourceBlocks = new Map((source.blocks || []).map((b) => [b.id, b]));
    const blockText = new Map();
    let matched = 0;
    for (const b of lesson.blocks) {
      if (!b.text.en) continue;
      const old = sourceBlocks.get(b.id);
      if (!old) { stale.push(`${where} block ${b.id}: not in the packet (added after it)`); continue; }
      matched++;
      const t = text[b.id];
      if (t == null || t === '') { errors.push(`${where} block ${b.id}: missing ${LANG}`); continue; }
      if (!sameText(old.en, b.text.en)) { stale.push(`${where} block ${b.id}: English changed since the packet`); continue; }
      blockText.set(b.id, t);
    }
    if (!matched) errors.push(`${where}: none of the packet's blocks are on the site`);

    // ---- questions
    const qText = { mc: [], fill: [], sa: [] };
    for (const sec of ['mc', 'fill', 'sa']) {
      const site = unit[sec] || [], src = source[sec] || [], tr = draft[sec] || [];
      if (src.length !== tr.length) { errors.push(`${where} ${sec}: ${src.length} source questions but ${tr.length} translated`); continue; }
      if (site.length !== src.length) { errors.push(`${where} ${sec}: the site has ${site.length} questions, the packet ${src.length}`); continue; }
      site.forEach((q, i) => {
        const old = src[i], t = tr[i], label = `${where} ${sec} ${i + 1}`;
        if (!t) { errors.push(`${label}: missing`); return; }
        const out = {};
        let isStale = false;
        for (const field of ['stem', 'prompt', 'options', 'why', 'answer', 'accept', 'keywords', 'model']) {
          if (typeof q[field] === 'number') continue;          // the shared mc answer index
          const en = q[field]?.en;
          if (en == null) continue;
          const oldEn = old[field] ?? old[`${field}_en`];
          let value = t[field];
          if (field === 'options') {
            if (!Array.isArray(value) || value.length !== (oldEn || []).length) { errors.push(`${label}: options missing or the wrong count`); continue; }
            if (en.some((v) => !oldEn.includes(v))) { isStale = true; continue; }
            value = en.map((v) => t.options[oldEn.indexOf(v)]);   // follow the site's order
          } else if (field === 'keywords') {
            if (!Array.isArray(value) || !value.length) { errors.push(`${label}: keywords missing`); continue; }
            if (!same(oldEn, en)) isStale = true;
          } else if (field === 'accept') {
            value = (Array.isArray(value) ? value : []).filter((a) => norm(a) && norm(a) !== norm(t.answer));
            if (!same(oldEn ?? [], en)) isStale = true;
          } else if (field === 'why') {
            value ??= '';
            if (!sameText(oldEn, en) && norm(oldEn)) isStale = true;
          } else {
            if (value == null || value === '') { errors.push(`${label}: ${field} missing`); continue; }
            if (!sameText(oldEn, en)) isStale = true;
          }
          out[field] = value;
        }
        if (sec === 'fill' && out.prompt != null && out.prompt.split('____').length !== 2) errors.push(`${label}: the ${LANG} prompt needs exactly one ____`);
        if (sec === 'sa' && !q.model?.en && t.model) out.model = t.model;
        // The answer index is shared by every language and never imported:
        // the translated options follow the site's English order, so the
        // site's key stays the key. Where the packet's key (or its correction
        // in --key-fix) points at another option, the report says so.
        if (sec === 'mc' && typeof old.answer === 'number' && q.options?.en && old.options) {
          const fix = keyFix.get(`${course} ${unitNo} ${i + 1}`);
          const packetKey = fix ?? old.answer;
          const siteKey = q.options.en[q.answer];
          if (old.options[packetKey] !== siteKey) keyNotes.push(`${label}: the site's key is "${siteKey}"; the packet${fix != null ? ' (with its correction)' : ''} says "${old.options[packetKey]}"; the site's key is kept`);
          else if (fix != null) keyNotes.push(`${label}: the packet's correction agrees with the site's key "${siteKey}"`);
        }
        if (isStale) { stale.push(`${label}: English changed since the packet`); return; }
        qText[sec][i] = out;
      });
    }
    if (errors.length > before) continue;

    // ---- apply, stamping provenance as tools/translation-plan.mjs does
    const plan = translationPlan(lesson, unit, LANG);
    const protectedLabels = new Set(plan.protectedItems.map((p) => p.split(':')[0]));
    for (const job of plan.jobs) {
      const label = job.label;
      if (protectedLabels.has(label)) continue;
      if (label.startsWith('block ')) {
        const id = label.slice(6), t = blockText.get(id);
        if (t == null) continue;
        job.owner.text[LANG] = t;
      } else {
        const [sec, n] = label.split(' '), t = qText[sec][Number(n) - 1];
        if (!t) continue;
        for (const [field, value] of Object.entries(t)) {
          if (field === 'accept') { if (value.length) { job.owner.accept ??= {}; job.owner.accept[LANG] = value; } continue; }
          if (field === 'model' && !job.owner.model) { job.owner.model = { [LANG]: value }; continue; }
          job.owner[field][LANG] = value;
        }
        // every language in accept, or none (src/content.config.ts)
        if (job.owner.accept && !job.owner.accept[LANG] && Object.keys(job.owner.accept).length) job.owner.accept[LANG] = [];
        questionsDone++;
      }
      if (label.startsWith('block ')) blocksDone++;
      job.owner.tr = { ...(job.owner.tr || {}), [LANG]: { status: 'machine', from: job.stamp } };
    }
    lesson.langs = [...new Set([...(lesson.langs || []), LANG])];
    writes.push([lp, lesson], [up, unit]);
    units++;
  }
}

const out = writes.flatMap(([p, data]) => p.startsWith('src/content/units/') ? unitWrites(p, data) : [[p, JSON.stringify(data, null, 1) + '\n']]);
if (REPORT) {
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify({ lang: LANG, from: FROM, units, blocks: blocksDone, questions: questionsDone, stale, keys: keyNotes, errors, notes: summary }, null, 1) + '\n');
}
for (const s of summary) console.log(s);
if (errors.length) {
  console.error(`\n${errors.length} missing or malformed item(s); nothing written:`);
  for (const e of errors.slice(0, 60)) console.error('  - ' + e);
  if (errors.length > 60) console.error(`  ... and ${errors.length - 60} more${REPORT ? ` (see ${REPORT})` : ''}`);
  process.exit(1);
}
if (WRITE) for (const [p, t] of out) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, t); }
console.log(`${units} unit(s), ${blocksDone} block(s), ${questionsDone} question(s) ${WRITE ? 'imported' : 'checked; nothing written (add --write)'} in ${LANG}.`);
for (const k of keyNotes) console.log('key: ' + k);
if (stale.length) console.log(`${stale.length} item(s) left in English because the English changed after the packet${REPORT ? ` (listed in ${REPORT})` : ''}.`);
