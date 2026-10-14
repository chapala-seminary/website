// The ONE file that knows how the eval reaches the server's grading code.
//
// tools/eval-grader.mjs asks this adapter for a verdict on one item and
// nothing else. Everything the eval assumes about worker/grading/* is written
// here; when the real modules land (branch aig/server, contract §5 and §8) and
// a signature differs from the guess below, change this file and only this file.
//
// WHAT IS ASSUMED (contract docs/ai-grading.md §5, §8)
//
//   worker/grading/text.js
//     exactFill(key, answer, lang)  -> boolean   today's bare() match against
//                                                key.answer / key.accept
//     copiedOnly(prompt, answer)    -> boolean   `prompt` is the prompt STRING in
//                                                the student's language
//     wordCount(text)               -> number
//   worker/grading/rules.js
//     isInstructionLike(text)       -> boolean   the §5 step-2 pattern, EN/ES/FR
//                                                (aliases tried: looksLikeInstruction,
//                                                injectionLike, isInjection)
//   worker/grading/model.js
//     gradeShortAnswer(env, {key, answer, lang}) -> Promise<Result>
//     gradeFill(env, {key, answer, lang})        -> Promise<Result>
//       Result = {verdict, feedback?, points?, model?, prompt_version?, usage?}
//       verdict: met|partly|not_met|pending (sa)  right|wrong|pending (fill)
//       `env` carries AI, GRADER_MODEL, GRADER_MODEL_FALLBACK, GRADER_PROMPT_VERSION
//       and, in a dry run, AI_FAKE=1 (contract §8). The model call itself is
//       env.AI.run(model, {messages, response_format, max_tokens, temperature:0}).
//       A single export `gradeWritten(env, {kind, key, answer, lang})` is also tried.
//   worker/grading/fake-ai.js          used by the module itself when env.AI_FAKE
//
// WHAT IS NOT ASSUMED: D1, grade_cache, grade_overrides, attempts. The eval
// grades one answer at a time with no database, so cache and overrides never
// answer for the model.
//
// When worker/grading/ does not exist yet, --dry-run falls back to the small
// stand-in at the bottom of this file so the harness can be tested. A real run
// refuses to start without the real modules.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, bare, wordCount as localWordCount } from './eval-lib.mjs';

export const SA_MIN_WORDS = 15;     // contract §5, step 1
export const DEFAULTS = {
  GRADER_MODEL: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  GRADER_MODEL_FALLBACK: '@cf/openai/gpt-oss-120b',
  GRADER_PROMPT_VERSION: '2026-10-14.1',
};

async function tryImport(file, root) {
  const p = path.join(root, 'worker', 'grading', file);
  if (!fs.existsSync(p)) return null;
  return import(pathToFileURL(p).href);
}

/** Load the server grading modules. `real` is false if any is missing. */
export async function loadGrading({ root = ROOT } = {}) {
  const [text, rules, model, prompt] = await Promise.all(['text.js', 'rules.js', 'model.js', 'prompt.js'].map(f => tryImport(f, root)));
  const missing = [['text.js', text], ['rules.js', rules], ['model.js', model], ['prompt.js', prompt]].filter(([, m]) => !m).map(([f]) => f);
  const problems = [];
  if (text) for (const fn of ['exactFill', 'copiedOnly', 'wordCount']) if (typeof text[fn] !== 'function') problems.push(`text.js does not export ${fn}`);
  if (model && !(typeof model.gradeShortAnswer === 'function' && typeof model.gradeFill === 'function') && typeof model.gradeWritten !== 'function') {
    problems.push('model.js exports none of gradeShortAnswer+gradeFill / gradeWritten');
  }
  const injectionFn = rules && (rules.isInstructionLike || rules.looksLikeInstruction || rules.injectionLike || rules.isInjection);
  return { real: missing.length === 0 && problems.length === 0, missing, problems, text, rules, model, prompt, injectionFn };
}

/** What the grading path needs to know about the environment. */
export function makeEnv({ ai, dryRun, model, fallbackModel }) {
  return {
    ...(dryRun ? { AI_FAKE: '1' } : {}),
    AI: ai || null,
    GRADER_MODEL: model || DEFAULTS.GRADER_MODEL,
    GRADER_MODEL_FALLBACK: fallbackModel || DEFAULTS.GRADER_MODEL_FALLBACK,
    GRADER_PROMPT_VERSION: DEFAULTS.GRADER_PROMPT_VERSION,
    GRADING_MODE: 'live',
  };
}

const promptIn = (key, lang) => String((key.prompt && (key.prompt[lang] || key.prompt.en)) || '');

/** Grade one item exactly as the server would, minus the database. */
export async function gradeOne({ item, key, env, grading }) {
  const lang = item.lang;
  if (!grading.real) return fallbackGrade({ item, key });   // dry run only; the caller refuses otherwise
  const { text, model } = grading;
  if (item.kind === 'fill') {
    if (text.exactFill(key, item.answer, lang)) return { verdict: 'right', via: 'exact', graded_by: 'exact' };
    const r = typeof model.gradeFill === 'function'
      ? await model.gradeFill(env, { key, answer: item.answer, lang })
      : await model.gradeWritten(env, { kind: 'fill', key, answer: item.answer, lang });
    return normaliseResult(r, 'ai');
  }
  // short answer, contract §5 order
  if (text.copiedOnly(promptIn(key, lang), item.answer) || text.wordCount(item.answer) < SA_MIN_WORDS) {
    return { verdict: 'not_met', via: 'rule:copied-or-short', graded_by: 'rule' };
  }
  if ((grading.injectionFn || injectionLike)(item.answer)) return { verdict: 'pending', via: 'rule:injection', graded_by: 'rule' };
  const r = typeof model.gradeShortAnswer === 'function'
    ? await model.gradeShortAnswer(env, { key, answer: item.answer, lang })
    : await model.gradeWritten(env, { kind: 'sa', key, answer: item.answer, lang });
  return normaliseResult(r, 'ai');
}

function normaliseResult(r, via) {
  if (!r || typeof r !== 'object') throw new Error('grading module returned no result object');
  return { verdict: r.verdict, feedback: r.feedback, points: r.points, model: r.model, prompt_version: r.prompt_version, usage: r.usage, via, graded_by: r.graded_by || 'ai', error: r.error };
}

/** Does the key give the model a rubric? (contract §3) */
export const hasRubric = key => !!(key.rubric && Array.isArray(key.rubric.points) && key.rubric.points.length);

// ---------------------------------------------------------------------------
// Stand-in used only by --dry-run when worker/grading/ is absent. It mirrors
// the CONTRACT's order and regex so the harness, summary and bar logic can be
// exercised, but it is not evidence about the real grader and the results file
// says so (meta.grading_path = "internal-fallback").
// ---------------------------------------------------------------------------
const INJECTION = new RegExp([
  'ignore (all|previous|the)', 'instructions?', 'mark (this|it|me) (as )?(correct|right)', 'system prompt',
  'you are (an|a) (ai|grader)',
  // Spanish and French equivalents (contract §5 says "plus the same in ES and FR")
  'ignora(r)? (todas|las|lo|el)', 'instrucciones', 'marca(r|lo|me)? (esta|esto|lo|me)? ?(como )?(correct[oa]|bien)', 'prompt del sistema', 'eres (una|un) (ia|calificador)',
  'ignore[rz]? (toutes|les|le|l\')', 'marque(r|z)? (ceci|cette|le|la|moi)? ?(comme )?(correct|juste|bon)', 'prompt syst[eè]me', '(tu es|vous [eê]tes) (une|un) (ia|correcteur)',
].join('|'), 'i');
export function injectionLike(text) { return INJECTION.test(String(text)); }

const fold = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const toks = s => fold(s).replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(' ').filter(Boolean);
function copiedFallback(prompt, answer) {
  const p = toks(prompt), a = toks(answer);
  if (!a.length) return true;
  const ps = new Set(p);
  const inPrompt = a.filter(w => ps.has(w)).length;
  return inPrompt / a.length >= 0.85 && a.length <= p.length + 6;
}
function lev1(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i);
}
function hint(answer) { const m = /\[\[(met|not_met|partly|pending|right|wrong|error|bad-json)\]\]/.exec(answer); return m && m[1]; }

export function fallbackGrade({ item, key }) {
  const lang = item.lang, h = hint(item.answer);
  const usage = { input_tokens: Math.ceil((promptIn(key, lang).length + item.answer.length + 900) / 4), output_tokens: 60, synthetic: true };
  if (h === 'error' || h === 'bad-json') return { verdict: 'pending', via: 'ai', graded_by: 'ai', error: h, usage };
  if (item.kind === 'fill') {
    const forms = [key.answer?.[lang], key.answer?.[key.sourceLang || 'en'], ...(key.accept?.[lang] || []), ...(key.accept?.[key.sourceLang || 'en'] || [])].filter(Boolean).map(bare);
    const b = bare(item.answer);
    if (forms.includes(b)) return { verdict: 'right', via: 'exact', graded_by: 'exact' };
    if (h === 'right' || h === 'wrong') return { verdict: h, via: 'ai', graded_by: 'ai', usage };
    // stand-in "model": forgives a one-letter slip in a word of 6+ letters
    return { verdict: forms.some(f => f.length >= 6 && lev1(f, b)) ? 'right' : 'wrong', via: 'ai', graded_by: 'ai', usage };
  }
  if (copiedFallback(promptIn(key, lang), item.answer) || localWordCount(item.answer) < SA_MIN_WORDS) return { verdict: 'not_met', via: 'rule:copied-or-short', graded_by: 'rule' };
  if (injectionLike(item.answer)) return { verdict: 'pending', via: 'rule:injection', graded_by: 'rule' };
  if (h) return { verdict: h, via: 'ai', graded_by: 'ai', usage };
  const groups = key.keywords?.[lang] || key.keywords?.en || [];
  const text = fold(item.answer);
  const hit = groups.filter(g => [].concat(g).some(f => text.includes(fold(f)))).length;
  const share = groups.length ? hit / groups.length : 0;
  return { verdict: share >= 0.5 ? 'met' : share >= 0.3 ? 'partly' : 'not_met', via: 'ai', graded_by: 'ai', usage, feedback: 'internal stand-in' };
}
