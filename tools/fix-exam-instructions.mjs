/* The exam instructions inside each lesson were written for the courses' own
 * engines, before the Associate track and the fill-in-the-blank questions:
 * "Certificate students: Answer 1–20. M.Div. / Th.M. students: Answer all 30",
 * headings that count 30 questions on a page that asks 40, and some stating
 * rules the one engine does not apply (a 70/30 weighting, a 15-minute lock for
 * every track, "you will be redirected to your certificate"). Dr. Cook's beta
 * audit (4 Oct 2026, item 1) asked that every course state the normal rule.
 *
 * The sentence is the one Dr. Cook approved for Parables (content-changes 8af).
 * Only the blocks listed here change; every other word of a lesson is left as
 * it is. The Spanish is rewritten with the English, so its `from` hash is
 * reset to the new English and it stays a current, human translation.
 *
 *   node tools/fix-exam-instructions.mjs          rewrite
 *   node tools/fix-exam-instructions.mjs --check  fail if an old wording remains
 */
import fs from 'node:fs';
import path from 'node:path';
import { hash } from '../src/lib/lesson.ts';

const L = 'src/content/lessons';
const STD = {
  en: '<strong>Certificate track:</strong> the 20 multiple-choice questions. <strong>Associate:</strong> multiple choice and the 10 fill-in-the-blank questions. <strong>M.Div. and Th.M.:</strong> multiple choice, fill-ins and the 10 short-answer questions. 90% of each part is required to pass. If you do not pass, the exam waits a short time before you can try again.',
  es: '<strong>Certificado:</strong> las 20 preguntas de opción múltiple. <strong>Asociado:</strong> opción múltiple y las 10 preguntas de completar el espacio en blanco. <strong>M.Div. y Th.M.:</strong> opción múltiple, completar el espacio y las 10 preguntas de desarrollo. Se requiere 90% en cada parte para aprobar. Si no aprueba, el examen espera un tiempo breve antes de intentarlo de nuevo.',
};

/* A whole block whose English starts like this is the old instruction. */
const WHOLE = [
  /^<strong>Certificate students:<\/strong> Answer (questions )?1–20/,
  /^<em><strong>Certificate track:<\/strong> 20 multiple-choice questions, 90%/,
  /^20 multiple choice questions \+ 10 short answer questions \(essays required/,
  /^<em>20 multiple-choice \+ 10 short-answer/,
  /^<strong>Certificate track:<\/strong> 18 of 20 multiple choice correct to pass\./,
];

/* Courses that split the rule over two blocks: each keeps its two blocks. */
const PAIRS = [
  { first: /^<strong>Certificate track:<\/strong> Section A \(multiple choice\) required at 90%\./, set: {
      en: '<strong>Certificate track:</strong> Section A (multiple choice) required at 90%; Section B (short answer) optional. <strong>Associate:</strong> Section A and the 10 fill-in-the-blank questions, each at 90%.',
      es: '<strong>Certificado:</strong> Sección A (opción múltiple) obligatoria al 90%; Sección B (respuesta corta) opcional. <strong>Asociado:</strong> Sección A y las 10 preguntas de completar el espacio en blanco, cada una al 90%.' } },
  { first: /^<strong>M\.Div\.\/Th\.M\. track:<\/strong> Both sections required at 90% each/, set: {
      en: '<strong>M.Div./Th.M. track:</strong> Section A, the fill-in-the-blank questions and Section B, each at 90%, independently.',
      es: '<strong>M.Div./Th.M.:</strong> Sección A, las preguntas de completar el espacio en blanco y la Sección B, cada una al 90%, independientemente.' } },
  { first: /^<strong>Certificate track:<\/strong> 18 \/ 20 multiple-choice correct\.$/, set: {
      en: '<strong>Certificate track:</strong> 18 / 20 multiple-choice correct. <strong>Associate:</strong> that, and 9 / 10 fill-in-the-blank.',
      es: '<strong>Certificado:</strong> 18 / 20 de opción múltiple correctas. <strong>Asociado:</strong> eso, y 9 / 10 de completar el espacio en blanco.' } },
  { first: /^<strong>Th\.M\. \/ M\.Div\. tracks:<\/strong> 18 \/ 20 MC <em>and<\/em> 9 \/ 10 short-answer/, set: {
      en: '<strong>Th.M. / M.Div. tracks:</strong> 18 / 20 MC, 9 / 10 fill-in-the-blank <em>and</em> 9 / 10 short-answer, scored independently.',
      es: '<strong>Th.M. / M.Div.:</strong> 18 / 20 MC, 9 / 10 de completar el espacio <em>y</em> 9 / 10 respuesta corta, calificadas independientemente.' } },
  { first: /^Short Answer \(M\.Div track only\)$/, set: {
      en: 'Short Answer (M.Div. / Th.M. tracks only)', es: 'Respuesta Corta (solo M.Div. / Th.M.)' } },
  { first: /^Required for the Th\.M\. and M\.Div\. tracks; optional \(but encouraged\) for the Certificate track\./, edit: {
      en: ['for the Certificate track.', 'for the Certificate and Associate tracks.'],
      es: ['para la vía de Certificado.', 'para las vías de Certificado y Asociado.'] } },
];

/* Headings that count 30 questions: the page asks 20 + 10 + 10. */
const HEAD = { en: / — 30 Questions/, es: / — 30 Preguntas/ };
const isHeading = (t) => t.length < 90 && /Exam|Examen/.test(t);

/* Pentecostal's unit footer: a website unit is not an offline file. */
const OFFLINE = { en: ' This unit is designed for offline use — no internet connection is required.',
                  es: ' Esta unidad está diseñada para uso sin conexión: no se requiere internet.' };

const check = process.argv.includes('--check');
let files = 0, blocks = 0; const left = [];
for (const c of fs.readdirSync(L)) for (const f of fs.readdirSync(path.join(L, c)).filter((f) => /^\d+\.json$/.test(f))) {
  const p = path.join(L, c, f);
  const raw = fs.readFileSync(p, 'utf8');
  const l = JSON.parse(raw);
  let n = 0;
  for (const b of l.blocks) {
    const en = b.text.en ?? '', es = b.text.es ?? '';
    let next = null;
    if (WHOLE.some((r) => r.test(en))) next = { ...STD };
    for (const pr of PAIRS) if (pr.first.test(en)) {
      next = pr.set ? { ...pr.set } : { en: en.replace(...pr.edit.en), es: es.replace(...pr.edit.es) };
    }
    if (!next && isHeading(en) && (HEAD.en.test(en) || HEAD.es.test(es)))
      next = { en: en.replace(HEAD.en, ''), es: es.replace(HEAD.es, '') };
    if (!next && en.includes(OFFLINE.en)) next = { en: en.replace(OFFLINE.en, ''), es: es.replace(OFFLINE.es, '') };
    if (!next || (next.en === en && next.es === es)) continue;
    if (check) { left.push(`${c}/${f}#${b.id}: ${en.slice(0, 90)}`); continue; }
    if (b.text.en == null || b.text.es == null) throw new Error(`${p}#${b.id} is not in both languages`);
    if (next.es === es && next.en !== en) throw new Error(`${p}#${b.id}: the Spanish did not change with the English`);
    b.text.en = next.en; b.text.es = next.es;
    b.tr = { ...(b.tr ?? {}), es: { status: 'human', from: hash(next.en) } };
    n++;
  }
  if (n) { fs.writeFileSync(p, JSON.stringify(l, null, raw.match(/^\{\n( +)/)?.[1].length ?? 2) + (raw.endsWith('\n') ? '\n' : '')); files++; blocks += n; }
}
if (check) { console.log(left.join('\n')); console.log(`${left.length} block(s) with the old exam wording`); process.exit(left.length ? 1 : 0); }
console.log(`${blocks} block(s) in ${files} lesson(s) changed`);
