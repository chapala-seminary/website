/* A plan shared by the CLI and its tests. No provider calls or disk writes. */
import { hash } from '../src/lib/lesson.ts';
const protectedStatus = new Set(['human', 'machine-edited']);
const questionFields = ['stem', 'prompt', 'options', 'why', 'answer', 'accept', 'keywords', 'model'];
export function translationPlan(lesson, unit, lang) {
  const source = lesson.sourceLang, jobs = [], protectedItems = [];
  function add(owner, fields, label) {
    const original = Object.fromEntries(fields.filter(key => owner[key]?.[source] != null).map(key => [key, owner[key][source]]));
    if (!Object.keys(original).length) return;
    const sharedKey = { ...(typeof owner.answer === 'number' ? { answerIndex: owner.answer } : {}), ...(owner.minHits != null ? { minHits: owner.minHits } : {}) };
    const stamp = hash(fields.length === 1 && fields[0] === 'text' ? original.text : JSON.stringify({ ...original, ...sharedKey }));
    const state = owner.tr?.[lang];
    const present = Object.keys(original).every(key => owner[key][lang] != null);
    if (protectedStatus.has(state?.status)) {
      if (!present || state.from !== stamp) protectedItems.push(`${label}: ${state.status} needs review; preserved`);
      return;
    }
    // Existing translations without provenance may be human work too.
    if (!state && Object.keys(original).some(key => owner[key][lang] != null)) {
      protectedItems.push(`${label}: unmarked translation needs review; preserved`); return;
    }
    if (present && state?.from === stamp) return;
    jobs.push({ owner, original, stamp, label });
  }
  for (const block of lesson.blocks) add(block, ['text'], `block ${block.id}`);
  if (unit) for (const section of ['mc', 'fill', 'sa'])
    (unit[section] || []).forEach((q, index) => add(q, questionFields, `${section} ${index + 1}`));
  return { jobs, protectedItems, source };
}
// Keep arrays and synonym groups intact; the provider receives only strings.
export function strings(value) { return Array.isArray(value) ? value.flatMap(strings) : [value]; }
export function replaceStrings(value, output) { return Array.isArray(value) ? value.map(v => replaceStrings(v, output)) : output.shift(); }
export function applyTranslation(job, output, lang) {
  for (const [key, value] of Object.entries(job.original)) job.owner[key][lang] = replaceStrings(value, output);
  job.owner.tr = { ...(job.owner.tr || {}), [lang]: { status: 'machine', from: job.stamp } };
}
